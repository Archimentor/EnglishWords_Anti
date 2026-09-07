(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GrammarStudioEngine = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MINUTE = 60 * 1000;
  const DAY = 24 * 60 * MINUTE;
  const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
  const STATIONS = [
    { id: "brief", label: "설계 브리프", short: "BRIEF" },
    { id: "observe", label: "의미 관찰", short: "OBSERVE" },
    { id: "rule", label: "형태 원리", short: "RULE" },
    { id: "blueprint", label: "문장 설계도", short: "BLUEPRINT" },
    { id: "repair", label: "오류 수리", short: "REPAIR" },
    { id: "transfer", label: "직접 전이", short: "TRANSFER" }
  ];
  const INTERVALS = [10 * MINUTE, DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 60 * DAY];

  function createProgress() {
    return {
      visitedStations: [],
      completedStations: [],
      lastStation: "brief",
      studioCompletedAt: null,
      sessions: 0,
      attempts: 0,
      correct: 0,
      mastery: 0,
      streak: 0,
      lapses: 0,
      hints: 0,
      averageResponseMs: 0,
      lastSeen: null,
      nextDue: null,
      lastVerdict: "new"
    };
  }

  function ensureProgress(progress) {
    const next = { ...createProgress(), ...(progress || {}) };
    next.visitedStations = [...new Set(Array.isArray(next.visitedStations) ? next.visitedStations : [])]
      .filter((id) => STATIONS.some((station) => station.id === id));
    next.completedStations = [...new Set(Array.isArray(next.completedStations) ? next.completedStations : [])]
      .filter(id => STATIONS.some(station => station.id === id));
    for (const key of ["sessions", "attempts", "correct", "mastery", "streak", "lapses", "hints", "averageResponseMs"]) {
      next[key] = Math.max(0, Number(next[key]) || 0);
    }
    next.mastery = Math.min(5, next.mastery);
    next.correct = Math.min(next.correct, next.attempts);
    for (const key of ["lastSeen", "nextDue", "studioCompletedAt"]) next[key] = Number(next[key]) > 0 ? Number(next[key]) : null;
    return next;
  }

  function normalizeAnswer(value) {
    return String(value ?? "")
      .trim()
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+([,.!?;:])/g, "$1")
      .replace(/[,.!?;:]/g, "")
      .replace(/\s+/g, " ");
  }

  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function flattenExercises(chapter) {
    const groups = chapter?.exercises || {};
    const result = [];

    (groups.mcq || []).forEach((item) => result.push({
      ...item,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      level: chapter.levelCode,
      type: "choice",
      modeLabel: "판별",
      prompt: item.question,
      answer: item.answerIndex
    }));

    (groups.errorCorrection || []).forEach((item) => result.push({
      ...item,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      level: chapter.levelCode,
      type: "correction",
      modeLabel: "오류 수리",
      prompt: item.instruction || "밑줄 친 표현을 문법에 맞게 고치세요.",
      source: item.originalSentence,
      answer: item.correctedWord,
      acceptedAnswers: [item.correctedWord, ...(item.acceptedAnswers || [])].flatMap(answer => [
        answer, String(item.originalSentence || "").replace(item.underlineTarget, answer)
      ])
    }));

    (groups.unscramble || []).forEach((item) => result.push({
      ...item,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      level: chapter.levelCode,
      type: "arrange",
      modeLabel: "구조 조립",
      prompt: item.promptKr,
      tokens: item.words,
      answer: item.answer
    }));

    (groups.formCloze || []).forEach((item) => result.push({
      ...item,
      chapterId: chapter.id,
      chapterTitle: chapter.title,
      level: chapter.levelCode,
      type: "input",
      modeLabel: "형태 변환",
      prompt: item.instruction ? item.instruction + "\n" + item.sentence : item.sentence,
      answer: item.answer,
      acceptedAnswers: [item.answer, ...(item.acceptedAnswers || [])]
    }));

    return result;
  }

  function isAnswerCorrect(exercise, response) {
    if (!exercise) return false;
    if (exercise.type === "choice") return response !== null && response !== undefined && String(response).trim() !== "" && Number(response) === Number(exercise.answer);
    const accepted = exercise.acceptedAnswers?.length ? exercise.acceptedAnswers : [exercise.answer];
    const normalized = normalizeAnswer(response);
    return accepted.some((answer) => normalizeAnswer(answer) === normalized);
  }

  function visitStation(progress, stationId) {
    const next = ensureProgress(progress);
    if (!STATIONS.some((station) => station.id === stationId)) return next;
    next.visitedStations = [...new Set([...next.visitedStations, stationId])];
    next.lastStation = stationId;
    return next;
  }

  function completeStation(progress, stationId, now = Date.now()) {
    const next = visitStation(progress, stationId);
    if (!STATIONS.some(station => station.id === stationId)) return next;
    next.completedStations = [...new Set([...next.completedStations, stationId])];
    if (next.completedStations.length === STATIONS.length && !next.studioCompletedAt) {
      next.studioCompletedAt = now;
      if (!next.nextDue) next.nextDue = now + DAY;
    }
    return next;
  }

  function stationCompletion(progress) {
    const current = ensureProgress(progress);
    return {
      visited: current.completedStations.length,
      total: STATIONS.length,
      percent: Math.round((current.completedStations.length / STATIONS.length) * 100),
      complete: STATIONS.every((station) => current.completedStations.includes(station.id))
    };
  }

  function scheduleSession(progress, evidence, now = Date.now()) {
    const current = ensureProgress(progress);
    const total = Math.max(1, Number(evidence?.total) || 1);
    const correct = Math.max(0, Math.min(total, Number(evidence?.correct) || 0));
    const hints = Math.max(0, Number(evidence?.hints) || 0);
    const responseMs = Math.max(0, Number(evidence?.averageResponseMs) || 0);
    const accuracy = correct / total;
    const hintRate = hints / total;

    const previousDue = current.nextDue;
    const previousSeen = current.lastSeen;
    const spaced = !current.attempts || (previousDue <= now && now - previousSeen >= DAY);
    const enoughEvidence = total >= 3 && Number(evidence?.types || 0) >= 2;
    current.sessions += 1;
    current.attempts += total;
    current.correct += correct;
    current.hints += hints;
    current.lastSeen = now;
    current.averageResponseMs = current.averageResponseMs
      ? Math.round((current.averageResponseMs * 0.65) + (responseMs * 0.35))
      : Math.round(responseMs);

    let intervalIndex = 0;
    let verdict = "repair";
    if (accuracy < 0.5) {
      current.mastery = Math.max(0, current.mastery - 1);
      current.streak = 0;
      current.lapses += 1;
    } else if (accuracy < 0.8 || hintRate > 0) {
      current.mastery = Math.min(2, current.mastery);
      current.streak = 0;
      intervalIndex = 1;
      verdict = "reinforce";
    } else {
      if (enoughEvidence && spaced) {
        current.mastery = Math.min(5, current.mastery + 1);
        current.streak += 1;
      }
      intervalIndex = enoughEvidence ? Math.max(1, current.mastery) : 1;
      verdict = current.mastery >= 4 ? "stable" : "growing";
    }

    const earlySuccess = accuracy >= 0.8 && hintRate === 0 && current.attempts > total && previousDue > now;
    current.nextDue = earlySuccess ? (previousDue || now + DAY) : now + INTERVALS[intervalIndex];
    if (earlySuccess) current.lastSeen = previousSeen;
    current.lastVerdict = verdict;
    return {
      progress: current,
      verdict,
      accuracy,
      nextDue: current.nextDue,
      intervalMs: Math.max(0, current.nextDue - now)
    };
  }

  function getDueChapters(chapters, progressMap, now = Date.now()) {
    return chapters
      .filter((chapter) => {
        const progress = ensureProgress(progressMap?.[chapter.id]);
        return (progress.attempts > 0 || progress.studioCompletedAt) && progress.nextDue && progress.nextDue <= now;
      })
      .sort((a, b) => ensureProgress(progressMap[a.id]).nextDue - ensureProgress(progressMap[b.id]).nextDue);
  }

  function buildDailyPlan(chapters, progressMap, activeLevel, goalMinutes = 15, now = Date.now()) {
    const activeIndex = Math.max(0, LEVELS.indexOf(activeLevel));
    const allowed = LEVELS.slice(0, activeIndex + 1);
    const scoped = chapters.filter((chapter) => allowed.includes(chapter.levelCode));
    const due = getDueChapters(chapters, progressMap, now);
    const atLevel = chapters.filter((chapter) => chapter.levelCode === activeLevel);
    const unfinished = atLevel.filter((chapter) => !stationCompletion(progressMap?.[chapter.id]).complete);
    const weak = scoped
      .filter((chapter) => {
        const progress = ensureProgress(progressMap?.[chapter.id]);
        return progress.attempts > 0 && progress.mastery < 3 && !due.includes(chapter);
      })
      .sort((a, b) => ensureProgress(progressMap[a.id]).mastery - ensureProgress(progressMap[b.id]).mastery);
    const partial = unfinished.find(chapter => ensureProgress(progressMap?.[chapter.id]).visitedStations.length);
    const focus = partial || unfinished[0] || weak[0] || atLevel[0] || chapters[0];
    const queueLimit = goalMinutes <= 10 ? 2 : goalMinutes <= 15 ? 3 : 4;
    const queue = [];
    [...due, focus, ...weak, ...unfinished].forEach((chapter) => {
      if (chapter && queue.length < queueLimit && !queue.includes(chapter)) queue.push(chapter);
    });
    return { focus, due, weak, queue };
  }

  function buildReviewSession(chapters, progressMap, count = 8, now = Date.now(), random = Math.random) {
    const due = getDueChapters(chapters, progressMap, now);
    // One whole chapter provides multiple retrieval types; one lucky answer is not mastery.
    const pool = due.filter(chapter => ensureProgress(progressMap?.[chapter.id]).attempts > 0)
      .slice(0, Math.max(1, Math.floor(count / 4)));
    const result = [];
    for (const chapter of pool) {
      const exercises = shuffle(flattenExercises(chapter), random);
      const selected = [];
      for (const type of ["choice", "correction", "arrange", "input"]) {
        const exercise = exercises.find(item => item.type === type);
        if (exercise) selected.push(exercise);
      }
      result.push(...selected);
    }
    return result;
  }

  function getLevelSummary(chapters, progressMap) {
    const summary = Object.fromEntries(LEVELS.map((level) => [level, {
      total: 0,
      started: 0,
      studioComplete: 0,
      stable: 0,
      averageMastery: 0
    }]));
    chapters.forEach((chapter) => {
      const bucket = summary[chapter.levelCode];
      const progress = ensureProgress(progressMap?.[chapter.id]);
      bucket.total += 1;
      if (progress.visitedStations.length || progress.attempts) bucket.started += 1;
      if (stationCompletion(progress).complete) bucket.studioComplete += 1;
      if (progress.mastery >= 4) bucket.stable += 1;
      bucket.averageMastery += progress.mastery;
    });
    Object.values(summary).forEach((bucket) => {
      bucket.averageMastery = bucket.total
        ? Math.round((bucket.averageMastery / (bucket.total * 5)) * 100)
        : 0;
    });
    return summary;
  }

  function formatInterval(milliseconds) {
    if (!Number.isFinite(milliseconds) || milliseconds <= 0) return "지금";
    if (milliseconds < 60 * MINUTE) return `${Math.max(1, Math.round(milliseconds / MINUTE))}분`;
    if (milliseconds < DAY) return `${Math.max(1, Math.round(milliseconds / (60 * MINUTE)))}시간`;
    return `${Math.max(1, Math.round(milliseconds / DAY))}일`;
  }

  function formatDue(timestamp, now = Date.now()) {
    if (!timestamp) return "첫 확인 전";
    const diff = timestamp - now;
    if (diff <= 0) return "복습할 시간";
    return `${formatInterval(diff)} 후`;
  }

  function verdictLabel(verdict) {
    return ({
      new: "새 구조",
      repair: "수리 필요",
      reinforce: "한 번 더",
      growing: "형성 중",
      stable: "안정"
    })[verdict] || "학습 중";
  }

  return {
    MINUTE,
    DAY,
    LEVELS,
    STATIONS,
    INTERVALS,
    createProgress,
    ensureProgress,
    normalizeAnswer,
    shuffle,
    flattenExercises,
    isAnswerCorrect,
    visitStation,
    completeStation,
    stationCompletion,
    scheduleSession,
    getDueChapters,
    buildDailyPlan,
    buildReviewSession,
    getLevelSummary,
    formatInterval,
    formatDue,
    verdictLabel
  };
});
