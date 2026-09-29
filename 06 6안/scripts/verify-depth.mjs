import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const ctx={window:{}};
for(let i=1;i<=6;i++)vm.runInNewContext(fs.readFileSync(new URL(`../data/lessons-0${i}.js`,import.meta.url),'utf8'),ctx);
for(let i=1;i<=6;i++) {
  const f=new URL(`../data/teaching-0${i}.js`,import.meta.url);
  if(fs.existsSync(f))vm.runInNewContext(fs.readFileSync(f,'utf8'),ctx);
}
const teaching=ctx.window.AtlasTeaching || {};
const missing=Array.from({length:120},(_,i)=>i+1).filter(id=>!teaching[id]);
assert.equal(missing.length,0,'Detailed teaching missing: '+missing.join(', '));
for(const [id,blocks] of Object.entries(teaching)) {
  assert.ok(blocks.length>=5,`Stage ${id}: missing distinct in-depth explanations`);
  assert.ok(new Set(blocks.map(b=>b.title)).size===blocks.length);
  assert.ok(blocks.every(b=>b.title&&b.text&&Array.isArray(b.examples)&&b.examples.length));
  assert.ok(blocks.reduce((n,b)=>n+b.examples.length,0)>=6,`Stage ${id}: not enough explained examples`);
  assert.ok(blocks.every(b=>b.examples.every(e=>e.length===3&&e.every(Boolean))));
  assert.ok(blocks.every(b=>b.text.length>=55),`Stage ${id}: explanation too brief`);
  assert.ok(blocks.length<=12,`Stage ${id}: expand engine anchors before adding more sections`);
}
assert.equal(ctx.window.AtlasChecks[83].length,6,'The supplied six checks are retained');
let characters=0,examples=0,sections=0;
for(const l of ctx.window.AtlasLessons) {
  const blocks=teaching[l.id];
  sections+=5+blocks.length;
  examples+=l.examples.length+blocks.reduce((n,b)=>n+b.examples.length,0);
  const text=[...l.why,l.form,...l.examples.flat(),...l.compare,...blocks.flatMap(b=>[b.title,b.text,...b.examples.flat()])].join('');
  assert.ok(text.length>=1200,`Stage ${l.id}: combined chapter needs further detail (${text.length} characters)`);
  characters+=text.length;
}
console.log(`PASS: 120 detailed stages; ${sections} reading sections; ${examples} explained example blocks; ${characters.toLocaleString()} teaching characters. Structural checks do not replace editorial review.`);
