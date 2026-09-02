(function () {
  "use strict";

  const DAY = 24 * 60 * 60 * 1000;
  const MINUTE = 60 * 1000;
  const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1"];
  const INTERVALS = [10 * MINUTE, DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY, 60 * DAY];

  function createTopicProgress() {
    return {
      attempts: 0,
      correct: 0,
      mastery: 0,
      streak: 0,
      lapses: 0,
      hints: 0,
      averageResponseMs: 0,
      lastScore: 0,
      lastSeen: null,
      nextDue: null,
      lastMode: null
    };
  }

  function ensureProgress(progress) {
    return { ...createTopicProgress(), ...(progress || {}) };
  }

  function normalizeAnswer(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\s+([,.!?;:])/g, "$1")
      .replace(/[,.!?;:]/g, "")
      .replace(/\s+/g, " ");
  }

  function isAnswerCorrect(exercise, response) {
    if (!exercise) return false;
    const accepted = exercise.type === "input"
      ? exercise.answers || []
      : [exercise.answer];
    const normalized = normalizeAnswer(response);
    return accepted.some((answer) => normalizeAnswer(answer) === normalized);
  }

  function shuffle(items, random = Math.random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
    }
    return result;
  }

  function getDiagnosticItems(curriculum) {
    return LEVEL_ORDER.flatMap((level) => {
      const topics = curriculum.filter((topic) => topic.level === level);
      const sampleIndexes = [0, Math.max(1, Math.floor(topics.length / 2))];
      return sampleIndexes.map((index) => {
        const topic = topics[index];
        const exercise = topic.exercises.find((item) => item.type === "choice") || topic.exercises[0];
        return { ...exercise, topicId: topic.id, level, topicTitle: topic.title };
      });
    });
  }

  function estimateStartLevel(results) {
    const byLevel = Object.fromEntries(LEVEL_ORDER.map((level) => [level, { correct: 0, total: 0 }]));
    results.forEach((result) => {
      if (!byLevel[result.level]) return;
      byLevel[result.level].total += 1;
      if (result.correct) byLevel[result.level].correct += 1;
    });

    for (const level of LEVEL_ORDER) {
      const score = byLevel[level];
      if (!score.total || score.correct / score.total < 0.5) {
        return { level, byLevel };
      }
    }

    const firstImperfect = LEVEL_ORDER.find((level) => byLevel[level].correct < byLevel[level].total);
    return { level: firstImperfect || "C1", byLevel };
  }

  function seedDiagnosticProgress(progressMap, results, now = Date.now()) {
    const next = { ...(progressMap || {}) };
    results.forEach((result) => {
      const current = ensureProgress(next[result.topicId]);
      current.attempts += 1;
      current.correct += result.correct ? 1 : 0;
      current.lastScore = result.correct ? 1 : 0;
      current.lastSeen = now;
      current.lastMode = "diagnostic";
      if (result.correct) {
        current.mastery = Math.max(current.mastery, 2);
        current.streak = Math.max(current.streak, 1);
        current.nextDue = now + 7 * DAY;
      } else {
        current.mastery = 0;
        current.streak = 0;
        current.nextDue = now;
      }
      next[result.topicId] = current;
    });
    return next;
  }

  function scheduleSession(progress, evidence, now = Date.now()) {
    const current = ensureProgress(progress);
    const total = Math.max(1, Number(evidence.total) || 1);
    const correct = Math.max(0, Math.min(total, Number(evidence.correct) || 0));
    const hints = Math.max(0, Number(evidence.hints) || 0);
    const averageResponseMs = Math.max(0, Number(evidence.averageResponseMs) || 0);
    const accuracy = correct / total;
    const hintRate = hints / total;

    current.attempts += total;
    current.correct += correct;
    current.hints += hints;
    current.lastScore = accuracy;
    current.lastSeen = now;
    current.lastMode = evidence.mode || "lesson";
    current.averageResponseMs = current.averageResponseMs
      ? Math.round((current.averageResponseMs * 0.65) + (averageResponseMs * 0.35))
      : Math.round(averageResponseMs);

    let intervalIndex;
    let verdict;
    if (accuracy < 0.5) {
      current.mastery = Math.max(0, current.mastery - 1);
      current.streak = 0;
      current.lapses += 1;
      intervalIndex = 0;
      verdict = "repair";
    } else if (accuracy < 0.8 || hintRate > 0.34) {
      current.mastery = Math.max(1, Math.min(5, current.mastery));
      current.streak = 0;
      intervalIndex = Math.min(1 + current.mastery, 2);
      verdict = "reinforce";
    } else {
      const speedBonus = averageResponseMs > 0 && averageResponseMs < 6500 && hintRate === 0 ? 1 : 0;
      current.mastery = Math.min(5, current.mastery + 1 + speedBonus);
      current.streak += 1;
      intervalIndex = Math.min(current.mastery + (current.streak >= 3 ? 1 : 0), INTERVALS.length - 1);
      verdict = current.mastery >= 4 ? "stable" : "growing";
    }

    current.nextDue = now + INTERVALS[intervalIndex];
    return {
      progress: current,
      verdict,
      accuracy,
      intervalMs: INTERVALS[intervalIndex],
      nextDue: current.nextDue
    };
  }

  function topicsForLevel(curriculum, level) {
    return curriculum.filter((topic) => topic.level === level);
  }

  function buildDailyQueue(curriculum, progressMap, activeLevel, goalMinutes = 10, now = Date.now()) {
    const topicLimit = goalMinutes <= 5 ? 1 : goalMinutes <= 10 ? 2 : 3;
    const allowedLevelIndex = Math.max(0, LEVEL_ORDER.indexOf(activeLevel));
    const allowedLevels = LEVEL_ORDER.slice(0, allowedLevelIndex + 1);
    const candidates = curriculum.filter((topic) => allowedLevels.includes(topic.level));

    const due = candidates
      .filter((topic) => {
        const progress = progressMap[topic.id];
        return progress && progress.nextDue && progress.nextDue <= now;
      })
      .sort((a, b) => (progressMap[a.id].nextDue || 0) - (progressMap[b.id].nextDue || 0));

    const weak = candidates
      .filter((topic) => {
        const progress = progressMap[topic.id];
        return progress
          && progress.attempts > 0
          && progress.mastery < 3
          && (!progress.nextDue || progress.nextDue <= now)
          && !due.includes(topic);
      })
      .sort((a, b) => (progressMap[a.id].mastery || 0) - (progressMap[b.id].mastery || 0));

    const newAtLevel = topicsForLevel(curriculum, activeLevel)
      .filter((topic) => !progressMap[topic.id] || progressMap[topic.id].attempts === 0);

    const queue = [];
    [due, newAtLevel, weak].forEach((pool) => {
      pool.forEach((topic) => {
        if (queue.length < topicLimit && !queue.includes(topic)) queue.push(topic);
      });
    });

    if (queue.length < topicLimit) {
      candidates.forEach((topic) => {
        if (queue.length < topicLimit && !queue.includes(topic)) queue.push(topic);
      });
    }

    return queue;
  }

  function buildMixedReview(curriculum, progressMap, count = 8, now = Date.now(), random = Math.random) {
    const dueTopics = curriculum.filter((topic) => {
      const progress = progressMap[topic.id];
      return progress && progress.nextDue && progress.nextDue <= now;
    });
    const weakTopics = curriculum.filter((topic) => {
      const progress = progressMap[topic.id];
      return progress && progress.attempts > 0 && progress.mastery < 4;
    });
    const pools = shuffle([...new Set([...dueTopics, ...weakTopics])], random);
    const exercises = [];
    let cursor = 0;
    while (exercises.length < count && pools.length) {
      const topic = pools[cursor % pools.length];
      const exercise = topic.exercises[exercises.length % topic.exercises.length];
      exercises.push({ ...exercise, topicId: topic.id, topicTitle: topic.title, level: topic.level, category: topic.category });
      cursor += 1;
      if (cursor > count * 3) break;
    }
    return exercises;
  }

  function getMasterySummary(curriculum, progressMap) {
    const levels = Object.fromEntries(LEVEL_ORDER.map((level) => [level, { total: 0, started: 0, stable: 0, average: 0 }]));
    curriculum.forEach((topic) => {
      const summary = levels[topic.level];
      const progress = ensureProgress(progressMap[topic.id]);
      summary.total += 1;
      if (progress.attempts > 0) summary.started += 1;
      if (progress.mastery >= 4) summary.stable += 1;
      summary.average += progress.mastery;
    });
    Object.values(levels).forEach((summary) => {
      summary.average = summary.total ? Number((summary.average / (summary.total * 5) * 100).toFixed(1)) : 0;
    });
    return levels;
  }

  function getErrorProfile(attemptLog, limit = 4) {
    const counts = {};
    (attemptLog || []).forEach((attempt) => {
      if (attempt.correct) return;
      counts[attempt.category] = (counts[attempt.category] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([category, count]) => ({ category, count }));
  }

  function formatInterval(intervalMs) {
    if (intervalMs < 60 * MINUTE) return `${Math.round(intervalMs / MINUTE)}분`;
    if (intervalMs < DAY) return `${Math.round(intervalMs / (60 * MINUTE))}시간`;
    return `${Math.round(intervalMs / DAY)}일`;
  }

  window.GrammarEngine = {
    DAY,
    LEVEL_ORDER,
    createTopicProgress,
    ensureProgress,
    normalizeAnswer,
    isAnswerCorrect,
    shuffle,
    getDiagnosticItems,
    estimateStartLevel,
    seedDiagnosticProgress,
    scheduleSession,
    buildDailyQueue,
    buildMixedReview,
    getMasterySummary,
    getErrorProfile,
    formatInterval
  };
})();
