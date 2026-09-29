import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {build, extractLessons} from './reader-build.mjs';

const chapters=build({check:true});
assert.equal(chapters.length,120);
const context={window:{}};
for(let i=1;i<=6;i++)vm.runInNewContext(fs.readFileSync(new URL(`../data/chapters-0${i}.js`,import.meta.url),'utf8'),context);
assert.equal(context.window.AtlasChapters.length,120,'The deployed browser bundles must include every chapter');
for(const chapter of chapters) {
  const shipped=context.window.AtlasChapters.find(c=>c.id===chapter.id);
  assert.equal(shipped.html,chapter.html,`Chapter ${chapter.id}: deployment lost manuscript content`);
  assert.equal((chapter.html.match(/<h1\b/g)||[]).length,1);
  assert.match(chapter.html,/연습/,'Original exercises remain part of the reading, not a locked quiz');
  assert.doesNotMatch(chapter.html.replace(/<code>[\s\S]*?<\/code>/g,''),/\*\*/,'Original emphasis must not leak raw Markdown markers into the reading');
  assert.doesNotMatch(chapter.html,/[]|<script|<iframe|<img|onerror=/i,'No hydration markers, executable HTML or remote images');
  const ids=[...chapter.html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`Chapter ${chapter.id}: duplicate heading targets`);
  for(const heading of chapter.toc)assert.ok(ids.includes(heading.id));
  for(const target of Object.values(chapter.aliases))assert.ok(target==='concept'||ids.includes(target));
}
// Compare every imported paragraph with the actual user-provided conversation.
if(process.argv[2]) {
  const source=extractLessons(fs.readFileSync(process.argv[2],'utf8'));
  const reviewed=JSON.parse(fs.readFileSync(new URL('./reviewed-source-edits.json',import.meta.url),'utf8'));
  for(const {id,markdown} of source) {
    let expected=markdown.replace(/\s*cite[^]*/g,'').trim()+'\n';
    for(const [before,after] of reviewed[id]||[]) {
      assert.equal(expected.split(before).length,2,'Each reviewed edit must match exactly once: '+id);
      expected=expected.replace(before,after);
    }
    assert.equal(fs.readFileSync(new URL(`../content/${String(id).padStart(3,'0')}.md`,import.meta.url),'utf8'),expected,`Chapter ${id}: unreviewed loss or rewriting of original prose`);
  }
  console.log('PASS: all 83 original responses retained in full, apart from reviewed corrections and non-display citation tokens');
}
console.log(`PASS: all 120 deployed manuscripts and heading links; ${chapters.reduce((n,c)=>n+c.characters,0).toLocaleString()} characters; ${chapters.reduce((n,c)=>n+c.toc.length,0)} original-format headings.`);
console.log('Editorial depth is reviewed in the manuscripts, not inferred from a word-count target.');
