import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {extractLessons, renderChapter, resolveAnchor} from './reader-build.mjs';

// Real export shape: a JSON-encoded JSON pool inside a script, not page text.
const pool=['irrelevant', '# 2단계 — 두 번째\n\n'+'뜻과 예문\n'.repeat(120),
  '# 1단계 — 첫 번째\n\n'+'설명\n'.repeat(170)+'\n## 2단계처럼 보이는 하위 제목'];
const fixture=`<script>streamController.enqueue(${JSON.stringify(JSON.stringify(pool))})</script>`;
assert.deepEqual(extractLessons(fixture,2).map(x=>x.id),[1,2]);
assert.equal(extractLessons(fixture,2)[0].markdown,pool[2]);
assert.throws(()=>extractLessons(fixture,3),/missing|누락/i,'A partial share must never replace a complete course');
assert.throws(()=>extractLessons(fixture+fixture,2),/duplicate|중복/i,'Ambiguous duplicate chapters must be reviewed');

const lesson=renderChapter(83,`# 83단계 — \`may as well\`

## 1. 기본 의미

> We **might as well go** home.${'  '}
> 그냥 집에 가자.

---

## 2. 구조

✅ \`might as well go\` / ❌ \`might as well to go\`

| 표현 | 의미 |
| --- | --- |
| **should** | 조언 |
| might as well | 대안 없음 |

## 연습

1. **go / to go**
2. not go / don't go

[출처](https://example.org/grammar)

<script>alert(1)</script>

[위험](javascript:alert%281%29)

![추적 이미지](https://example.org/tracker.png)
`);
assert.match(lesson.html,/<h1[^>]*id="lesson-title"[^>]*>83단계/);
assert.equal((lesson.html.match(/<h1\b/g)||[]).length,1,'One accessible lesson title, not one h1 per section');
assert.match(lesson.html,/<blockquote>\s*<p>We <strong>might as well go<\/strong> home\.<br>/);
assert.match(lesson.html,/<code>might as well to go<\/code>/);
assert.match(lesson.html,/<table>[\s\S]*<th>표현<\/th>[\s\S]*<td><strong>should<\/strong><\/td>/);
assert.match(lesson.html,/<ol>[\s\S]*<li><strong>go \/ to go<\/strong><\/li>/);
assert.match(lesson.html,/<hr>/);
assert.match(lesson.html,/href="https:\/\/example.org\/grammar"/);
assert.doesNotMatch(lesson.html,/<script|<img|href="javascript:/i,'Imported Markdown must not execute scripts or load remote images');
assert.deepEqual(lesson.toc.map(h=>h.id),['reading-1','reading-2','reading-3']);
assert.equal(resolveAnchor(lesson,'topic-2'),'reading-2','Old reader links must still reach a meaningful heading');
assert.equal(resolveAnchor(lesson,'structure'),'reading-2');
assert.equal(resolveAnchor(lesson,'reading-999'),'concept');
assert.equal(resolveAnchor(lesson,'practice'),'practice');
const alternate=renderChapter(1,'# 1단계 — 제목\n\n# 1. 개념\n\n### 예\n\n# 핵심\n\n**연습**');
assert.equal((alternate.html.match(/<h1\b/g)||[]).length,1);
assert.deepEqual(alternate.toc.map(h=>h.label),['1. 개념','예','핵심']);
assert.equal(new Set(alternate.toc.map(h=>h.id)).size,3);
const koreanEmphasis=renderChapter(2,'# 2단계 — be동사\n\n그래서 **동사 `am`**이 필요하다. **"상태"**를 말한다. **기본형**은 같다.\n\n`**문법 기호**`와 \\*\\*별표\\*\\*는 그대로 둔다.');
assert.match(koreanEmphasis.html,/<strong>동사 <code>am<\/code><\/strong>이/,'Original Korean particles must not break bold spans ending in inline code');
assert.match(koreanEmphasis.html,/<strong>&quot;상태&quot;<\/strong>를/);
assert.match(koreanEmphasis.html,/<strong>기본형<\/strong>은/);
assert.match(koreanEmphasis.html,/<code>\*\*문법 기호\*\*<\/code>/);
assert.match(koreanEmphasis.html,/\*\*별표\*\*/);
console.log('PASS: complete/unique source extraction, original rich formatting, safe rendering, original heading order, old anchors');

const context={window:{}};
vm.runInNewContext(fs.readFileSync(new URL('../js/engine.js',import.meta.url),'utf8'),context);
const E=context.window.AtlasEngine, state=E.create();
E.visit(state,83,'reading-27');
assert.equal(state.last.anchor,'reading-27','Resuming a long original chapter must not silently jump to its beginning');
assert.ok(E.validate(JSON.parse(JSON.stringify(state))));
state.last.anchor='topic-4';
assert.ok(E.validate(state),'Existing backups remain valid without resetting notes or progress');
state.last.anchor='reading-999';
assert.equal(E.validate(state),false);
console.log('PASS: old backups and new long-chapter positions');
