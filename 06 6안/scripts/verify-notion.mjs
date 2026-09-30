import assert from 'node:assert/strict';
import {renderChapter} from './reader-build.mjs';

// A Notion newline separates blocks; treating this as ordinary Markdown
// merges the explanation into the quote and leaks <br>/table markup.
const source='# 84단계 — 미래 표현\n\n첫 번째 문단.\n두 번째 문단.\n> **곧 출발한다.**<br>It is about to leave.\n> 별도의 인용문.\n인용문 밖의 설명.\n## 비교\n<table header-row="true">\n<tr>\n<td>표현</td>\n<td>뜻</td>\n</tr>\n<tr>\n<td>**about to**</td>\n<td>곧<br>바로 직전</td>\n</tr>\n</table>\n## 연습\n1. **첫 질문**\n\t→ 첫 질문의 설명\n2. 두 번째 질문\n다음은 **85단계 — ****`will be`**** 표현**이다.\n';
const chapter=renderChapter(84,source,{format:'notion'});
const escapedHeading=renderChapter(47,'# 47단계 — 시간\n\n## 1. `when` — \\~할 때\n## 연습',{format:'notion'});
assert.equal(escapedHeading.toc[0].label,'1. when — ~할 때','The sidebar uses displayed heading text, not Notion escape characters');
assert.match(chapter.html,/<p>첫 번째 문단\.<\/p>\s*<p>두 번째 문단\.<\/p>/,'Keep separate Notion paragraph blocks');
assert.match(chapter.html,/<blockquote>\s*<p><strong>곧 출발한다\.<\/strong><br>It is about to leave\.<\/p>\s*<\/blockquote>/,'Keep inline Notion line breaks and quote boundaries');
assert.match(chapter.html,/<\/blockquote>\s*<p>인용문 밖의 설명\.<\/p>/,'Do not swallow following prose into a lazy Markdown quote');
assert.equal((chapter.html.match(/<blockquote>/g)||[]).length,2);
assert.match(chapter.html,/<table>\s*<thead>[\s\S]*<th[^>]*>표현<\/th>/);
assert.match(chapter.html,/<td><strong>about to<\/strong><\/td>/);
assert.match(chapter.html,/<td>곧<br>바로 직전<\/td>/);
assert.match(chapter.html,/<ol>[\s\S]*<li>[\s\S]*첫 질문[\s\S]*→ 첫 질문의 설명[\s\S]*<\/li>[\s\S]*<li>/,'Nested Notion explanation stays in its numbered exercise');
assert.doesNotMatch(chapter.html,/<pre>|\*\*|&lt;br|&lt;table/);
assert.match(chapter.html,/<strong>85단계 — <\/strong><strong><code>will be<\/code><\/strong><strong> 표현<\/strong>이다/,'Adjacent Notion bold runs keep their text and styling');

const continued=renderChapter(1,'# 1단계 — 구조\n\nI run.  \nShe smiles.\n새 문단.\n## 연습\n1. 골라봐.  \n\t이어서 읽는 설명.\n2. 다음 문제.',{format:'notion'});
assert.match(continued.html,/<p>I run\.<br>\s*She smiles\.<\/p>\s*<p>새 문단\.<\/p>/,'Existing explicit Markdown hard breaks in Notion exports also survive');
assert.doesNotMatch(continued.html,/<pre>/);
const unsafe=renderChapter(1,'# 1단계 — 구조\n\n<script>alert(1)</script>\n<br onmouseover="alert(1)">\n[악성](javascript:alert%281%29)\n## 연습',{format:'notion'});
assert.doesNotMatch(unsafe.html,/<script|<br on|href="javascript:/i);
assert.throws(()=>renderChapter(1,'# 1단계 — 구조\n\n<table onclick="bad()"><tr><td>x</td></tr></table>\n## 연습',{format:'notion'}),/table|표/i,'Unknown table attributes must not silently execute or disappear');
console.log('PASS: Notion paragraph/quote boundaries, inline breaks, rich tables, nested exercises, adjacent emphasis, safe rendering');
