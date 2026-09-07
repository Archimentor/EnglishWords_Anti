import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const context = { console };
context.window = context;
context.globalThis = context;
vm.createContext(context);

const run = (relativePath) => {
  const filename = path.join(root, relativePath);
  vm.runInContext(fs.readFileSync(filename, "utf8"), context, { filename });
};

[
  "data/grammar_a1.js",
  "data/grammar_a2.js",
  "data/grammar_b1.js",
  "data/grammar_b2.js",
  "data/grammar_c1.js",
  "data/grammar_refinements.js",
  "data/grammar_guides.js",
  "js/data.js",
  "js/learning-engine.js"
].forEach(run);

const data = context.GrammarStudioData;
const engine = context.GrammarStudioEngine;
const chapters = data.getAll();

assert.equal(chapters.length, 40, "A1–C1 과정은 40개 단원이어야 합니다.");
assert.deepEqual(
  Array.from(engine.LEVELS, (level) => data.getByLevel(level).length),
  [8, 8, 8, 8, 8],
  "각 CEFR 레벨에는 8개 단원이 있어야 합니다."
);
assert.equal(new Set(chapters.map((chapter) => chapter.id)).size, 40, "단원 ID는 중복될 수 없습니다.");

const requiredGuideFields = ["mission", "essentialQuestion", "decisionRule", "koreanLens", "transferPrompt"];
chapters.forEach((chapter) => {
  assert.ok(chapter.guide, `${chapter.id}: 편집형 학습 가이드가 필요합니다.`);
  requiredGuideFields.forEach((field) => {
    assert.ok(String(chapter.guide[field] || "").length >= 15, `${chapter.id}: ${field}가 충분히 구체적이어야 합니다.`);
  });
  assert.ok(chapter.guide.outcomes?.length >= 2, `${chapter.id}: 학습 결과가 2개 이상이어야 합니다.`);
  const types = new Set(engine.flattenExercises(chapter).map((exercise) => exercise.type));
  ["choice", "correction", "arrange", "input"].forEach((type) => {
    assert.ok(types.has(type), `${chapter.id}: ${type} 수행 유형이 빠졌습니다.`);
  });
});
assert.equal(new Set(chapters.map((chapter) => chapter.guide.mission)).size, 40, "40개 단원 미션은 서로 달라야 합니다.");

const exercises = chapters.flatMap(engine.flattenExercises);
assert.ok(exercises.length >= 190, "충분한 수행 문장이 필요합니다.");
assert.equal(new Set(exercises.map((exercise) => exercise.id)).size, exercises.length, "수행 문장 ID는 중복될 수 없습니다.");

let progress = engine.createProgress();
engine.STATIONS.forEach((station) => { progress = engine.visitStation(progress, station.id); });
assert.equal(engine.stationCompletion(progress).complete, false, "방문만으로 학습 완료를 판정하지 않습니다.");
engine.STATIONS.forEach((station) => { progress = engine.completeStation(progress, station.id); });
assert.equal(engine.stationCompletion(progress).complete, true, "읽기 완료를 명시한 절을 집계합니다.");
assert.ok(progress.nextDue, "문제풀이 없이 읽기만 마쳐도 복습 일정이 생깁니다.");

const now = Date.UTC(2026, 8, 2, 0, 0, 0);
const repair = engine.scheduleSession(engine.createProgress(), { total: 5, correct: 2, hints: 0, averageResponseMs: 7000 }, now);
assert.equal(repair.verdict, "repair");
assert.equal(repair.intervalMs, 10 * engine.MINUTE, "불안정한 구조는 10분 뒤 다시 확인해야 합니다.");
const growing = engine.scheduleSession(engine.createProgress(), { total: 5, correct: 5, types: 4, hints: 0, averageResponseMs: 5000 }, now);
assert.equal(growing.verdict, "growing");
assert.equal(growing.intervalMs, engine.DAY, "첫 확인은 하루 뒤 복습합니다.");
assert.equal(growing.progress.mastery, 1);
const repeated = engine.scheduleSession(growing.progress, {total:5, correct:5, types:4}, now + engine.MINUTE);
assert.equal(repeated.progress.mastery, 1, "같은 날 즉시 반복해서 숙련도를 부풀리지 않습니다.");
assert.equal(repeated.nextDue, growing.nextDue);
const recovered = engine.scheduleSession(repair.progress, {total:4, correct:4, types:4}, repair.nextDue);
assert.ok(recovered.nextDue > repair.nextDue, "기한이 된 10분 재학습에 성공하면 과거 기한에 갇히지 않습니다.");
assert.equal(recovered.progress.mastery, repair.progress.mastery, "같은 날 재학습은 숙련도만 부풀리지 않습니다.");
const later = engine.scheduleSession(growing.progress, {total:5, correct:5, types:4}, now + engine.DAY);
assert.equal(later.progress.mastery, 2);
const single = engine.scheduleSession(engine.createProgress(), {total:1, correct:1, types:1}, now);
assert.equal(single.progress.mastery, 0, "한 문제만으로 숙련을 판정하지 않습니다.");
const hinted = engine.scheduleSession(growing.progress, {total:5, correct:5, types:4, hints:1}, now + engine.DAY);
assert.ok(hinted.intervalMs <= engine.DAY);
exercises.forEach(ex => {
  assert.ok(engine.isAnswerCorrect(ex, ex.answer), ex.id + ": 대표 정답");
  assert.equal(engine.isAnswerCorrect(ex, ""), false, ex.id + ": 빈 답안");
  (ex.acceptedAnswers || []).forEach(answer => assert.ok(engine.isAnswerCorrect(ex, answer), ex.id + ": 대체 정답"));
  if (ex.type === "choice") {
    assert.equal(ex.options.length, new Set(ex.options).size, ex.id + ": 중복 선택지");
    ex.options.forEach((_, index) => assert.equal(engine.isAnswerCorrect(ex, index), index === ex.answer));
  }
  if (ex.type === "arrange") {
    const tokens = value => engine.normalizeAnswer(value).split(" ").sort().join("|");
    assert.equal(tokens(ex.tokens.join(" ")), tokens(ex.answer), ex.id + ": 조립 토큰");
  }
});
assert.ok(engine.isAnswerCorrect(exercises.find(ex => ex.id === "b1_13_c1"), "who"));
assert.ok(engine.isAnswerCorrect(exercises.find(ex => ex.id === "c1_26_c1"), "accepting"));
const advancedDue = {[chapters.at(-1).id]:{...growing.progress,nextDue:now-1}};
assert.equal(engine.buildDailyPlan(chapters, advancedDue, "A1", 15, now).due.length, 1, "A1 선택이 이미 학습한 C1 복습을 숨기면 안 됩니다.");
assert.equal(engine.buildReviewSession(chapters, {[chapters[0].id]:growing.progress}, 5, now).length, 0, "아직 기한이 아닌 약한 단원을 복습 기한으로 오인하지 않습니다.");

const dueMap = {
  [chapters[0].id]: { ...repair.progress, nextDue: now - 1 },
  [chapters[1].id]: { ...growing.progress, nextDue: now + engine.DAY }
};
assert.equal(engine.getDueChapters(chapters, dueMap, now)[0].id, chapters[0].id, "기한이 지난 구조가 복습 큐의 앞에 와야 합니다.");
assert.ok(engine.buildDailyPlan(chapters, dueMap, "A1", 15, now).queue.length >= 1, "오늘의 작업 큐가 만들어져야 합니다.");
assert.ok(engine.buildReviewSession(chapters, dueMap, 5, now, () => .5).length >= 1, "복습 수행 문장이 생성되어야 합니다.");

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const app = fs.readFileSync(path.join(root, "js/app.js"), "utf8");
const style = fs.readFileSync(path.join(root, "css/style.css"), "utf8");
const components = fs.readFileSync(path.join(root, "css/grammar-components.css"), "utf8");

["grammar_guides.js", "learning-engine.js", "app.js"].forEach((asset) => assert.ok(html.includes(asset), `${asset}가 index.html에 연결되어야 합니다.`));
["lesson.js", "trainer.js", "storage.js", "sound.js", "ui.js", "print.js"].forEach((legacy) => {
  assert.ok(!html.includes(legacy), `${legacy}는 새 앱에서 로드하지 않습니다.`);
  assert.ok(!fs.existsSync(path.join(root, "js", legacy)), `${legacy} 레거시 파일은 제거되어야 합니다.`);
});
["renderBriefStation", "renderObserveStation", "renderRuleStation", "renderBlueprintStation", "renderRepairStation", "renderTransferStation", "select-syntax", "transfer-draft"].forEach((renderer) => assert.ok(app.includes(renderer), `${renderer}가 필요합니다.`));
assert.ok(!app.includes("Object.groupBy"), "구형 브라우저 호환을 위해 Object.groupBy를 사용하지 않습니다.");
assert.ok(app.includes("OPTION 05") && app.includes("grammar_blueprint_option5_v1"), "5안 표기와 독립 저장소 키가 필요합니다.");
assert.ok(html.includes('class="brand-plate" aria-hidden="true">05</span>'), "헤더에 05 표기가 필요합니다.");
assert.ok(style.includes(".blueprint-poster") && components.includes(".syntax-board"), "설계 스튜디오 시각 체계가 필요합니다.");

for (const match of html.matchAll(/(?:src|href)="(\.\/[^"?#]+)"/g)) {
  const target = path.resolve(root, match[1]);
  assert.ok(fs.existsSync(target), `연결된 로컬 리소스가 없습니다: ${match[1]}`);
}

console.log(JSON.stringify({
  status: "PASS",
  levels: engine.LEVELS.length,
  chapters: chapters.length,
  exercises: exercises.length,
  stations: engine.STATIONS.length,
  guideMissions: new Set(chapters.map((chapter) => chapter.guide.mission)).size,
  intervals: engine.INTERVALS.map(engine.formatInterval)
}, null, 2));
