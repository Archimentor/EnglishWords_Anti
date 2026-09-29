import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx={window:{}};
for(const name of ['source.js',...Array.from({length:6},(_,i)=>`lessons-0${i+1}.js`)]) vm.runInNewContext(fs.readFileSync(new URL('../data/'+name,import.meta.url),'utf8'),ctx,{filename:name});
const {GrammarSource:source,AtlasLessons:lessons}=ctx.window;
assert.equal(source.stages.length,120);
assert.equal(lessons.length,120,'Every Notion stage needs authored textbook content');
const ids=new Set(); let chars=0;
for(let i=0;i<120;i++) {
  const s=source.stages[i],l=lessons[i];
  assert.equal(s.id,i+1); assert.equal(l.id,s.id); assert.ok(!ids.has(l.id)); ids.add(l.id);
  assert.ok(s.summary && s.title && /^https:\/\/app.notion.com\/p\//.test(s.url));
  assert.equal(l.why.length,2);
  assert.ok(l.why.every(p=>p.length>=95),`Stage ${l.id}: explanation too short`);
  assert.ok(l.form.length>10);
  assert.equal(l.examples.length,2);
  assert.ok(l.examples.every(e=>e.length===3 && e.every(v=>typeof v==='string' && v.length>5)));
  assert.equal(l.compare.length,3); assert.ok(l.compare[2].length>=25);
  assert.equal(l.recall.length,2); assert.equal(l.task.length,3);
  assert.ok(l.related.length>=2 && l.related.every(id=>id>=1 && id<=120 && id!==l.id));
  chars+=l.why.join('').length+l.examples.flat().join('').length+l.compare.join('').length;
}
console.log(`PASS: ${lessons.length} source-mapped stages, ${lessons.length*2} explained examples, ${lessons.length} contrasts, ${lessons.length} recall prompts, ${lessons.length} writing models; ${chars.toLocaleString()} teaching characters.`);
