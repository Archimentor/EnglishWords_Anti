import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const context = { window: {} };
vm.createContext(context);

vm.runInContext(fs.readFileSync(path.join(root, "data", "grammar-curriculum.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "data", "grammar-lessons-a1.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(root, "learning-engine.js"), "utf8"), context);

const curriculum = context.window.GRAMMAR_CURRICULUM;
const levels = context.window.GRAMMAR_LEVELS;
const lessons = context.window.GRAMMAR_LESSONS;
const engine = context.window.GrammarEngine;

assert.equal(levels.length, 5, "A1~C1 다섯 단계가 필요합니다.");
assert.equal(curriculum.length, 40, "총 40개 문법 주제가 필요합니다.");

const topicIds = new Set();
const exerciseIds = new Set();
const levelCounts = {};
let exerciseCount = 0;

for (const topic of curriculum) {
  assert(!topicIds.has(topic.id), `중복 주제 ID: ${topic.id}`);
  topicIds.add(topic.id);
  assert(["A1", "A2", "B1", "B2", "C1"].includes(topic.level), `잘못된 수준: ${topic.id}`);
  levelCounts[topic.level] = (levelCounts[topic.level] || 0) + 1;
  assert.equal(topic.exercises.length, 3, `${topic.id}는 세 문제를 가져야 합니다.`);
  assert(topic.rules.length >= 3, `${topic.id}의 규칙 설명이 부족합니다.`);
  assert(topic.examples.length >= 2, `${topic.id}의 예문이 부족합니다.`);

  for (const exercise of topic.exercises) {
    exerciseCount += 1;
    assert(!exerciseIds.has(exercise.id), `중복 문항 ID: ${exercise.id}`);
    exerciseIds.add(exercise.id);
    assert(["choice", "arrange", "input"].includes(exercise.type), `잘못된 문항 유형: ${exercise.id}`);
    assert(exercise.prompt && exercise.explanation, `${exercise.id}의 설명이 부족합니다.`);
    if (exercise.type === "choice") {
      assert(exercise.options.length >= 3, `${exercise.id} 선택지가 부족합니다.`);
      assert(exercise.options.includes(exercise.answer), `${exercise.id} 정답이 선택지에 없습니다.`);
      assert(engine.isAnswerCorrect(exercise, exercise.answer), `${exercise.id} 정답 판정 실패`);
    }
    if (exercise.type === "arrange") {
      assert(exercise.tokens.length >= 3, `${exercise.id} 토큰이 부족합니다.`);
      assert(engine.isAnswerCorrect(exercise, exercise.answer), `${exercise.id} 조립 정답 판정 실패`);
    }
    if (exercise.type === "input") {
      assert(exercise.answers.length >= 1, `${exercise.id} 허용 정답이 없습니다.`);
      assert(engine.isAnswerCorrect(exercise, exercise.answers[0]), `${exercise.id} 입력 정답 판정 실패`);
    }
  }
}

assert.deepEqual(levelCounts, { A1: 8, A2: 8, B1: 8, B2: 8, C1: 8 });
assert.equal(exerciseCount, 120);

const a1Topics = curriculum.filter((topic) => topic.level === "A1");
assert.equal(Object.keys(lessons).length, 8, "A1에는 상세 개념 강의 8개가 필요합니다.");
for (const topic of a1Topics) {
  const lesson = lessons[topic.id];
  assert(lesson, `${topic.id} 상세 개념 강의가 없습니다.`);
  assert(lesson.overview?.outcomes?.length >= 3, `${topic.id} 학습 목표가 부족합니다.`);
  assert(lesson.concepts?.length >= 3, `${topic.id} 핵심 개념 설명이 부족합니다.`);
  assert(lesson.formRows?.length >= 5, `${topic.id} 형태 변화표가 부족합니다.`);
  assert(lesson.uses?.length >= 3, `${topic.id} 쓰임 설명이 부족합니다.`);
  assert(lesson.koreanContrast?.pairs?.length >= 3, `${topic.id} 한국어 대조 설명이 부족합니다.`);
  assert(lesson.walkthroughs?.length >= 2, `${topic.id} 단계별 문장 해설이 부족합니다.`);
  assert(lesson.traps?.length >= 4, `${topic.id} 오류 교정 사례가 부족합니다.`);
  assert(lesson.summary?.points?.length >= 3, `${topic.id} 개념 요약이 부족합니다.`);
  assert(JSON.stringify(lesson).length >= 3500, `${topic.id} 강의 설명이 지나치게 짧습니다.`);
}

const diagnostic = engine.getDiagnosticItems(curriculum);
assert.equal(diagnostic.length, 10, "진단은 수준별 두 문장이어야 합니다.");
assert.deepEqual(
  Object.fromEntries(["A1", "A2", "B1", "B2", "C1"].map((level) => [level, diagnostic.filter((item) => item.level === level).length])),
  { A1: 2, A2: 2, B1: 2, B2: 2, C1: 2 }
);
assert.equal(
  engine.estimateStartLevel(diagnostic.map((item) => ({ ...item, correct: false }))).level,
  "A1",
  "모든 진단 문장을 틀리면 A1부터 시작해야 합니다."
);
assert.equal(
  engine.estimateStartLevel(diagnostic.map((item) => ({ ...item, correct: true }))).level,
  "C1",
  "모든 진단 문장을 맞히면 C1부터 시작해야 합니다."
);

const now = Date.UTC(2026, 8, 1, 0, 0, 0);
const failed = engine.scheduleSession(null, { total: 3, correct: 1, hints: 1, averageResponseMs: 12000 }, now);
assert.equal(failed.verdict, "repair");
assert.equal(failed.intervalMs, 10 * 60 * 1000);

const strong = engine.scheduleSession(null, { total: 3, correct: 3, hints: 0, averageResponseMs: 3500 }, now);
assert(strong.progress.mastery >= 2, "빠르고 정확한 수행은 숙련도를 높여야 합니다.");
assert(strong.intervalMs >= 3 * engine.DAY, "빠르고 정확한 첫 수행은 최소 3일 간격이어야 합니다.");

const queue = engine.buildDailyQueue(curriculum, {}, "A1", 10, now);
assert.equal(queue.length, 2, "10분 계획은 두 문법 주제를 선택해야 합니다.");
assert(queue.every((topic) => topic.level === "A1"), "첫 A1 계획에는 A1 신규 주제가 들어가야 합니다.");

for (const file of ["index.html", "style.css", "app.js", "learning-engine.js", path.join("data", "grammar-curriculum.js"), path.join("data", "grammar-lessons-a1.js")]) {
  assert(fs.existsSync(path.join(root, file)), `필수 파일 누락: ${file}`);
}

const appSource = fs.readFileSync(path.join(root, "app.js"), "utf8");
const indexSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
assert(appSource.includes("교재 85% · 연습 15%"), "개념 85% 학습 비중이 화면에 표시되어야 합니다.");
assert(appSource.includes("LESSON_SECTIONS"), "교재형 강의 목차가 필요합니다.");
assert(!appSource.includes('data-action="answer-pretest"'), "개념 강의 전에 사전 문제를 강제하면 안 됩니다.");
assert(indexSource.indexOf("grammar-lessons-a1.js") < indexSource.indexOf("app.js"), "상세 강의 데이터는 앱보다 먼저 로드되어야 합니다.");

console.log(JSON.stringify({
  status: "ok",
  topics: curriculum.length,
  exercises: exerciseCount,
  detailedA1Lessons: Object.keys(lessons).length,
  levels: levelCounts,
  diagnosticItems: diagnostic.length,
  failedIntervalMinutes: failed.intervalMs / 60000,
  strongIntervalDays: strong.intervalMs / engine.DAY,
  dailyQueue: queue.map((topic) => topic.id)
}, null, 2));
