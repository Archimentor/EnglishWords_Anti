import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, "..");
const dataPath = path.join(projectDirectory, "data", "cefr-curriculum.js");
const source = fs.readFileSync(dataPath, "utf8");
const context = {};

vm.createContext(context);
vm.runInContext(`${source}\n;globalThis.__audit={meta:WORDLINE_DATA_META,levels:WORDLINE_LEVELS,words:WORDLINE_WORDS,curriculum:WORDLINE_CURRICULUM};`, context);

const { meta, levels, words, curriculum } = context.__audit;
const expectedLevels = ["A1", "A2", "B1", "B2", "C1"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(meta.total >= 6500, `C1 누적 목표 미달: ${meta.total}`);
assert(words.length === meta.total, "메타데이터와 실제 단어 수가 다릅니다.");
assert(curriculum.length === expectedLevels.length, "CEFR 단계 수가 다릅니다.");
assert(levels.map(level => level.cefr).join(",") === expectedLevels.join(","), "CEFR 단계 순서가 올바르지 않습니다.");
assert(new Set(words.map(word => word.id)).size === words.length, "중복 단어 ID가 있습니다.");
assert(new Set(words.map(word => word.word)).size === words.length, "중복 표제어가 있습니다.");
assert(words.every(word => expectedLevels.includes(word.cefr)), "A1-C1 밖의 단어가 있습니다.");
assert(words.every(word => word.meaning.trim().length > 0), "한국어 뜻이 없는 단어가 있습니다.");

let runningTotal = 0;
for (const level of levels) {
  const levelWords = words.filter(word => word.cefr === level.cefr);
  runningTotal += levelWords.length;
  assert(levelWords.length === level.count, `${level.cefr} 단계 개수가 다릅니다.`);
  assert(level.cumulative === runningTotal, `${level.cefr} 누적 개수가 다릅니다.`);
}
assert(runningTotal === meta.total, "최종 누적 단어 수가 전체 단어 수와 다릅니다.");

const curriculumWords = curriculum.flatMap(stage => stage.units.flatMap(unit => unit.words));
assert(curriculumWords.length === words.length, "유닛에 누락되거나 중복된 단어가 있습니다.");
assert(new Set(curriculumWords.map(word => word.id)).size === words.length, "유닛 안에 중복 단어가 있습니다.");
assert(curriculum.every(stage => stage.units.every(unit => unit.words.length > 0 && unit.words.length <= meta.unitSize)), "유닛 크기가 올바르지 않습니다.");

const contextCount = words.filter(word => word.example || word.definitionEn).length;
const ipaCount = words.filter(word => word.ipa).length;
assert(contextCount / words.length >= 0.9, "문맥 또는 영어 풀이 커버리지가 90% 미만입니다.");
assert(ipaCount / words.length >= 0.9, "IPA 커버리지가 90% 미만입니다.");

console.log(JSON.stringify({
  status: "ok",
  total: words.length,
  levels: Object.fromEntries(levels.map(level => [level.cefr, { added: level.count, cumulative: level.cumulative }])),
  units: curriculum.reduce((sum, stage) => sum + stage.units.length, 0),
  contextCoverage: `${((contextCount / words.length) * 100).toFixed(1)}%`,
  ipaCoverage: `${((ipaCount / words.length) * 100).toFixed(1)}%`
}, null, 2));
