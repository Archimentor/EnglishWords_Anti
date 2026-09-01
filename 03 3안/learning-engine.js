(function (root, factory) {
  const engine = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = engine;
  root.WORDLINE_ENGINE = engine;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const SESSION_PRESETS = Object.freeze({
    5: { capacity: 6, newBase: 3, label: "가볍게" },
    10: { capacity: 11, newBase: 5, label: "균형 있게" },
    15: { capacity: 17, newBase: 8, label: "깊게" }
  });

  const RATING_LABELS = Object.freeze({
    again: "10분 뒤",
    hard: "오늘 다시",
    good: "기억 간격 늘리기",
    easy: "빠르게 넘기기"
  });

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function asTime(value) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (!value) return null;
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : null;
  }

  function defaultProgress(wordId) {
    return {
      wordId,
      seen: 0,
      correct: 0,
      wrong: 0,
      lapses: 0,
      repetitions: 0,
      difficulty: 5,
      stability: 0,
      intervalDays: 0,
      strength: 0,
      lastSeen: null,
      dueAt: null,
      nextReview: null,
      lastRating: null,
      confidence: "unseen",
      verifiedCount: 0,
      averageResponseMs: 0,
      scanDeferredUntil: null,
      lastEvidence: null
    };
  }

  function strengthFromInterval(intervalDays, rating) {
    if (rating === "again" || intervalDays < 0.2) return 0;
    if (intervalDays < 1.5) return 1;
    if (intervalDays < 4) return 2;
    if (intervalDays < 14) return 3;
    if (intervalDays < 45) return 4;
    return 5;
  }

  function normalizeProgress(raw, wordId) {
    const base = defaultProgress(wordId);
    if (!raw || typeof raw !== "object") return base;
    const legacyIntervals = [0, 1, 2, 4, 7, 14];
    const legacyStrength = clamp(Number(raw.strength) || 0, 0, 5);
    const intervalDays = Number.isFinite(Number(raw.intervalDays))
      ? Math.max(0, Number(raw.intervalDays))
      : legacyIntervals[legacyStrength] || 0;
    const dueAt = asTime(raw.dueAt) || asTime(raw.nextReview);
    const lastSeen = asTime(raw.lastSeen);

    return {
      ...base,
      ...raw,
      wordId,
      seen: Math.max(0, Number(raw.seen) || 0),
      correct: Math.max(0, Number(raw.correct) || 0),
      wrong: Math.max(0, Number(raw.wrong) || 0),
      lapses: Math.max(0, Number(raw.lapses) || Number(raw.wrong) || 0),
      repetitions: Math.max(0, Number(raw.repetitions) || Number(raw.seen) || 0),
      difficulty: clamp(Number(raw.difficulty) || 5, 1, 10),
      stability: Math.max(0, Number(raw.stability) || intervalDays),
      intervalDays,
      strength: Number.isFinite(Number(raw.strength))
        ? clamp(Number(raw.strength), 0, 5)
        : strengthFromInterval(intervalDays, raw.lastRating),
      lastSeen,
      dueAt,
      nextReview: dueAt,
      lastRating: raw.lastRating || null,
      confidence: raw.confidence || (raw.seen ? (legacyStrength >= 4 ? "verified" : "learning") : "unseen"),
      verifiedCount: Math.max(0, Number(raw.verifiedCount) || 0),
      averageResponseMs: Math.max(0, Number(raw.averageResponseMs) || 0),
      scanDeferredUntil: asTime(raw.scanDeferredUntil),
      lastEvidence: raw.lastEvidence || null
    };
  }

  function scheduleReview(rawProgress, rating, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    const previousInterval = Math.max(progress.intervalDays || progress.stability || 0, 0.01);
    const previousEase = clamp(2.65 - ((progress.difficulty - 5) * 0.12), 1.65, 3.05);
    let intervalDays;
    let difficulty = progress.difficulty;
    let stability;
    let isCorrect = true;

    if (rating === "again") {
      intervalDays = 10 / (24 * 60);
      difficulty = clamp(difficulty + 0.8, 1, 10);
      stability = Math.max(0.04, previousInterval * 0.18);
      isCorrect = false;
    } else if (rating === "hard") {
      intervalDays = progress.seen ? Math.max(0.25, previousInterval * 1.18) : 0.25;
      difficulty = clamp(difficulty + 0.35, 1, 10);
      stability = intervalDays;
    } else if (rating === "easy") {
      intervalDays = progress.seen
        ? Math.max(4, previousInterval * previousEase * 1.45)
        : 4;
      difficulty = clamp(difficulty - 0.45, 1, 10);
      stability = intervalDays;
    } else {
      intervalDays = progress.seen
        ? Math.max(1, previousInterval * previousEase)
        : 1;
      difficulty = clamp(difficulty - 0.08, 1, 10);
      stability = intervalDays;
      rating = "good";
    }

    intervalDays = clamp(intervalDays, 10 / (24 * 60), 180);
    const dueAt = now + (intervalDays * DAY);
    return {
      ...progress,
      seen: progress.seen + 1,
      correct: progress.correct + (isCorrect ? 1 : 0),
      wrong: progress.wrong + (isCorrect ? 0 : 1),
      lapses: progress.lapses + (isCorrect ? 0 : 1),
      repetitions: isCorrect ? progress.repetitions + 1 : 0,
      difficulty: Number(difficulty.toFixed(2)),
      stability: Number(stability.toFixed(4)),
      intervalDays: Number(intervalDays.toFixed(4)),
      strength: strengthFromInterval(intervalDays, rating),
      lastSeen: now,
      dueAt,
      nextReview: dueAt,
      lastRating: rating,
      confidence: isCorrect ? "learning" : "fragile",
      scanDeferredUntil: null
    };
  }

  function scheduleFromPerformance(rawProgress, evidence = {}, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    const correct = Boolean(evidence.correct);
    const responseMs = Math.max(0, Number(evidence.responseMs) || 0);
    const hintUsed = Boolean(evidence.hintUsed);
    const phase = evidence.phase || "recall";
    let rating = "good";

    if (!correct) rating = "again";
    else if (hintUsed || responseMs > 8000) rating = "hard";
    else if (responseMs > 0 && responseMs <= 2600 && progress.correct >= 1) rating = "easy";

    const scheduled = scheduleReview(progress, rating, now);
    const answerCount = progress.correct + progress.wrong;
    const averageResponseMs = responseMs
      ? Math.round(((progress.averageResponseMs || 0) * answerCount + responseMs) / (answerCount + 1))
      : progress.averageResponseMs;

    return {
      ...scheduled,
      averageResponseMs,
      verifiedCount: progress.verifiedCount + (correct && !hintUsed ? 1 : 0),
      confidence: !correct ? "fragile" : scheduled.strength >= 4 ? "verified" : "learning",
      lastEvidence: { correct, responseMs, hintUsed, phase, at: now }
    };
  }

  function registerExposure(rawProgress, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    const intervalDays = 10 / (24 * 60);
    const dueAt = now + intervalDays * DAY;
    return {
      ...progress,
      seen: progress.seen + 1,
      difficulty: clamp(progress.difficulty + 0.15, 1, 10),
      stability: Math.max(progress.stability, 0.04),
      intervalDays,
      strength: 0,
      lastSeen: now,
      dueAt,
      nextReview: dueAt,
      lastRating: "exposure",
      confidence: "learning",
      scanDeferredUntil: null,
      lastEvidence: { correct: null, responseMs: 0, hintUsed: false, phase: "exposure", at: now }
    };
  }

  function markKnown(rawProgress, options = {}, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    const verified = Boolean(options.verified);
    const intervalDays = verified ? 45 : 21;
    const dueAt = now + intervalDays * DAY;
    return {
      ...progress,
      seen: progress.seen + 1,
      correct: progress.correct + (verified ? 1 : 0),
      repetitions: Math.max(progress.repetitions, verified ? 2 : 1),
      difficulty: clamp(progress.difficulty - (verified ? 0.8 : 0.35), 1, 10),
      stability: Math.max(progress.stability, intervalDays),
      intervalDays,
      strength: verified ? 4 : 3,
      lastSeen: now,
      dueAt,
      nextReview: dueAt,
      lastRating: verified ? "verified-known" : "provisional-known",
      confidence: verified ? "verified" : "provisional",
      verifiedCount: progress.verifiedCount + (verified ? 1 : 0),
      scanDeferredUntil: null,
      lastEvidence: { correct: verified ? true : null, responseMs: Number(options.responseMs) || 0, hintUsed: false, phase: verified ? "verification" : "batch-scan", at: now }
    };
  }

  function deferScan(rawProgress, days = 3, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    return {
      ...progress,
      scanDeferredUntil: now + Math.max(1, Number(days) || 3) * DAY,
      confidence: progress.seen ? progress.confidence : "uncertain",
      lastEvidence: { correct: null, responseMs: 0, hintUsed: false, phase: "scan-deferred", at: now }
    };
  }

  function buildScanBatch(options = {}) {
    const {
      stageWords = [],
      progress = {},
      size = 24,
      now = Date.now()
    } = options;
    const normalized = word => normalizeProgress(progress[word.id], word.id);
    const available = stageWords.filter(word => {
      const item = normalized(word);
      return item.seen === 0 && (!item.scanDeferredUntil || item.scanDeferredUntil <= now);
    });
    return uniqueById(available).slice(0, Math.max(1, Number(size) || 24));
  }

  function sampleForVerification(words = [], count = 3) {
    const unique = uniqueById(words);
    const targetCount = Math.min(unique.length, Math.max(0, Number(count) || 0));
    if (!targetCount) return [];
    if (targetCount === unique.length) return unique;
    const selected = [];
    const used = new Set();
    for (let index = 0; index < targetCount; index += 1) {
      let position = Math.floor(((index + 0.5) / targetCount) * unique.length);
      while (used.has(position) && position < unique.length - 1) position += 1;
      used.add(position);
      selected.push(unique[position]);
    }
    return selected;
  }

  function retrievability(rawProgress, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    if (!progress.seen || !progress.lastSeen || !progress.stability) return 0;
    const elapsedDays = Math.max(0, (now - progress.lastSeen) / DAY);
    return clamp(Math.exp(-elapsedDays / Math.max(0.04, progress.stability)), 0, 1);
  }

  function isDue(rawProgress, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    return Boolean(progress.seen && progress.dueAt && progress.dueAt <= now);
  }

  function reviewLabel(rawProgress, now = Date.now()) {
    const progress = normalizeProgress(rawProgress, rawProgress?.wordId);
    if (!progress.seen || !progress.dueAt) return "첫 학습";
    const delta = progress.dueAt - now;
    if (delta <= 0) return "지금 복습";
    if (delta < HOUR) return `${Math.max(1, Math.round(delta / MINUTE))}분 뒤`;
    if (delta < 20 * HOUR) return `${Math.max(1, Math.round(delta / HOUR))}시간 뒤`;
    if (delta < 1.5 * DAY) return "내일";
    const days = Math.max(2, Math.round(delta / DAY));
    return `${days}일 뒤`;
  }

  function uniqueById(items) {
    const seen = new Set();
    return items.filter(item => {
      const id = item?.word?.id ?? item?.id;
      if (id == null || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function buildDailyPlan(options) {
    const {
      allWords = [],
      stageWords = [],
      progress = {},
      sessionMinutes = 10,
      recentAccuracy = 80,
      now = Date.now()
    } = options || {};
    const preset = SESSION_PRESETS[sessionMinutes] || SESSION_PRESETS[10];
    const normalized = word => normalizeProgress(progress[word.id], word.id);

    const due = allWords
      .filter(word => isDue(normalized(word), now))
      .sort((a, b) => {
        const aProgress = normalized(a);
        const bProgress = normalized(b);
        const retentionDelta = retrievability(aProgress, now) - retrievability(bProgress, now);
        if (Math.abs(retentionDelta) > 0.001) return retentionDelta;
        return (aProgress.dueAt || 0) - (bProgress.dueAt || 0);
      });

    const unseen = stageWords.filter(word => normalized(word).seen === 0);

    const accuracy = clamp(Number(recentAccuracy) || 0, 0, 100);
    let newTarget = preset.newBase;
    if (accuracy < 55) newTarget = 1;
    else if (accuracy < 72) newTarget = Math.max(2, newTarget - 2);
    else if (accuracy >= 92) newTarget += 1;
    if (due.length >= Math.ceil(preset.capacity * 0.8)) newTarget = Math.min(newTarget, 2);
    if (due.length >= preset.capacity * 1.5) newTarget = 0;

    const dueTarget = Math.min(due.length, Math.max(2, preset.capacity - newTarget));
    const dueItems = due.slice(0, dueTarget).map(word => {
      const item = normalized(word);
      return { word, kind: item.lapses > 0 || item.wrong > 0 || item.lastRating === "again" ? "reinforce" : "review" };
    });
    const remainingSlots = Math.max(0, preset.capacity - dueItems.length);
    const newItems = unseen.slice(0, Math.min(newTarget, remainingSlots)).map(word => ({ word, kind: "new" }));
    const queue = uniqueById([...dueItems, ...newItems]);
    const mix = {
      review: queue.filter(item => item.kind === "review").length,
      reinforce: queue.filter(item => item.kind === "reinforce").length,
      new: queue.filter(item => item.kind === "new").length
    };
    const estimatedMinutes = Math.max(2, Math.ceil((queue.length * 34 + Math.min(5, queue.length) * 22) / 60));

    return {
      queue,
      words: queue.map(item => item.word),
      mix,
      dueTotal: due.length,
      backlog: Math.max(0, due.length - mix.review),
      capacity: preset.capacity,
      estimatedMinutes,
      presetLabel: preset.label,
      recentAccuracy: accuracy,
      rationale: due.length
        ? `${due.length}개 복습 대기와 최근 정답률 ${accuracy}%를 반영했어요.`
        : `${sessionMinutes}분 안에 기억하기 좋은 분량으로 시작해요.`
    };
  }

  function reviewForecast(words, progress, now = Date.now()) {
    const buckets = { overdue: 0, today: 0, tomorrow: 0, week: 0, later: 0 };
    words.forEach(word => {
      const item = normalizeProgress(progress[word.id], word.id);
      if (!item.seen || !item.dueAt) return;
      const delta = item.dueAt - now;
      if (delta <= 0) buckets.overdue += 1;
      else if (delta <= 20 * HOUR) buckets.today += 1;
      else if (delta <= 1.5 * DAY) buckets.tomorrow += 1;
      else if (delta <= 7 * DAY) buckets.week += 1;
      else buckets.later += 1;
    });
    return buckets;
  }

  return Object.freeze({
    DAY,
    HOUR,
    MINUTE,
    SESSION_PRESETS,
    RATING_LABELS,
    defaultProgress,
    normalizeProgress,
    scheduleReview,
    scheduleFromPerformance,
    registerExposure,
    markKnown,
    deferScan,
    buildScanBatch,
    sampleForVerification,
    retrievability,
    isDue,
    reviewLabel,
    buildDailyPlan,
    reviewForecast,
    strengthFromInterval
  });
});
