import { createRequire } from "node:module";
import assert from "node:assert/strict";

const require = createRequire(import.meta.url);
const Engine = require("../learning-engine.js");

const now = Date.UTC(2026, 8, 1, 3, 0, 0);
const fresh = Engine.defaultProgress("a1-0001");
const firstGood = Engine.scheduleReview(fresh, "good", now);
assert.equal(firstGood.strength, 1, "첫 good은 1일 간격이어야 합니다.");
assert.equal(firstGood.dueAt, now + Engine.DAY);

const secondGood = Engine.scheduleReview(firstGood, "good", firstGood.dueAt);
assert.ok(secondGood.intervalDays > firstGood.intervalDays, "성공하면 간격이 늘어나야 합니다.");

const forgotten = Engine.scheduleReview(secondGood, "again", secondGood.dueAt);
assert.equal(forgotten.strength, 0);
assert.ok(forgotten.dueAt - secondGood.dueAt <= 11 * Engine.MINUTE, "again은 약 10분 뒤여야 합니다.");
assert.equal(forgotten.lapses, 1);

const weakRetention = Engine.retrievability(firstGood, now + Engine.DAY);
const strongRetention = Engine.retrievability(secondGood, secondGood.lastSeen + Engine.DAY);
assert.ok(strongRetention > weakRetention, "안정도가 높은 기억은 더 천천히 감소해야 합니다.");

const words = Array.from({ length: 40 }, (_, index) => ({ id: `a1-${index + 1}`, word: `word${index + 1}` }));
const progress = {};
for (let index = 0; index < 12; index += 1) {
  progress[words[index].id] = {
    ...Engine.defaultProgress(words[index].id),
    seen: 2,
    correct: 1,
    wrong: 1,
    lastSeen: now - Engine.DAY,
    dueAt: now - Engine.HOUR,
    stability: 1,
    intervalDays: 1,
    strength: 1
  };
}

const shortPlan = Engine.buildDailyPlan({
  allWords: words,
  stageWords: words,
  progress,
  sessionMinutes: 5,
  recentAccuracy: 65,
  now
});
const deepPlan = Engine.buildDailyPlan({
  allWords: words,
  stageWords: words,
  progress: {},
  sessionMinutes: 15,
  recentAccuracy: 95,
  now
});

assert.ok(shortPlan.words.length <= 6, "5분 세션은 짧아야 합니다.");
assert.ok(shortPlan.mix.review + shortPlan.mix.reinforce > shortPlan.mix.new, "복습 적체 시 복습이 우선이어야 합니다.");
assert.ok(deepPlan.words.length > shortPlan.words.length, "15분 세션은 5분 세션보다 길어야 합니다.");
assert.ok(deepPlan.mix.new >= 8 && deepPlan.mix.new <= 10, "정답률이 높고 복습이 없으면 새 단어를 조금 늘려야 합니다.");
assert.equal(new Set(deepPlan.words.map(word => word.id)).size, deepPlan.words.length, "세션 단어가 중복되면 안 됩니다.");

const quickRecall = Engine.scheduleFromPerformance(firstGood, {
  correct: true,
  responseMs: 1800,
  hintUsed: false,
  phase: "meaning"
}, now + Engine.DAY);
assert.equal(quickRecall.lastRating, "easy", "빠르고 정확한 반복 회상은 자동으로 easy 근거가 되어야 합니다.");
assert.ok(quickRecall.intervalDays > firstGood.intervalDays, "빠른 회상은 간격을 늘려야 합니다.");

const hintedRecall = Engine.scheduleFromPerformance(fresh, {
  correct: true,
  responseMs: 4200,
  hintUsed: true,
  phase: "spelling"
}, now);
assert.equal(hintedRecall.lastRating, "hard", "힌트를 쓴 정답은 자동으로 hard 근거가 되어야 합니다.");

const provisionalKnown = Engine.markKnown(fresh, { verified: false }, now);
const verifiedKnown = Engine.markKnown(fresh, { verified: true, responseMs: 1500 }, now);
assert.equal(provisionalKnown.confidence, "provisional");
assert.equal(provisionalKnown.intervalDays, 21);
assert.equal(verifiedKnown.confidence, "verified");
assert.equal(verifiedKnown.intervalDays, 45);

const scanWords = Array.from({ length: 30 }, (_, index) => ({ id: `scan-${index + 1}` }));
const scanProgress = {
  "scan-1": Engine.markKnown(Engine.defaultProgress("scan-1"), { verified: false }, now),
  "scan-2": Engine.deferScan(Engine.defaultProgress("scan-2"), 3, now)
};
const scanBatch = Engine.buildScanBatch({ stageWords: scanWords, progress: scanProgress, size: 24, now });
assert.equal(scanBatch.length, 24, "스캔 크기는 시간 설정에 맞춰 묶음으로 만들어져야 합니다.");
assert.ok(!scanBatch.some(word => word.id === "scan-1" || word.id === "scan-2"), "이미 통과했거나 보류 중인 단어는 즉시 다시 나오면 안 됩니다.");
const verificationSample = Engine.sampleForVerification(scanBatch, 3);
assert.equal(verificationSample.length, 3, "24개 묶음은 소수 표본만 검증해야 합니다.");
assert.equal(new Set(verificationSample.map(word => word.id)).size, 3);

const forecast = Engine.reviewForecast(words, progress, now);
assert.equal(forecast.overdue, 12);
assert.equal(Engine.reviewLabel(firstGood, now), "내일");

console.log(JSON.stringify({
  status: "ok",
  firstIntervalDays: firstGood.intervalDays,
  grownIntervalDays: secondGood.intervalDays,
  againMinutes: Math.round((forgotten.dueAt - secondGood.dueAt) / Engine.MINUTE),
  shortPlan: shortPlan.mix,
  deepPlan: deepPlan.mix,
  overdue: forecast.overdue,
  scanBatch: scanBatch.length,
  verificationSample: verificationSample.map(word => word.id)
}, null, 2));
