import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
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
// The current source is Notion. Compare raw bodies independently of the importer
// so a transformation accidentally dropping a paragraph cannot validate itself.
const notionFile=new URL('../data/notion-source.json',import.meta.url);
if(fs.existsSync(notionFile)) {
  const manifest=JSON.parse(fs.readFileSync(notionFile,'utf8'));
  // Independently compare the rendered words and numbers in order. This does
  // not replace the byte-for-byte body check: it detects text lost by parsing.
  const decode=text=>text.replace(/&(?:amp|lt|gt|quot|apos|#39|#x[0-9a-f]+|#\d+);/gi,entity=>{
    const named={'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&apos;':"'",'&#39;':"'"};
    return named[entity]??String.fromCodePoint(parseInt(entity.slice(entity[2]==='x'?3:2,-1),entity[2]==='x'?16:10));
  });
  const words=text=>text.replace(/[^\p{L}\p{N}]/gu,'');
  let tables=0,breaks=0;
  for(const record of manifest.stages) {
    const markdown=fs.readFileSync(new URL(`../content/${String(record.id).padStart(3,'0')}.md`,import.meta.url),'utf8');
    const body=markdown.slice(markdown.indexOf('\n\n')+2,-1);
    assert.equal(createHash('sha256').update(body).digest('hex'),record.bodySha256);
    assert.equal(chapters[record.id-1].origin,'notion');
    const originalWords=words(body.replace(/^[\t ]*\d+[.)] /gm,'').replace(/<\/?(?:table|tr|td|br)\b[^>]*>/g,''));
    const visibleWords=words(decode(chapters[record.id-1].html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/,'').replace(/<[^>]*>/g,'')));
    assert.equal(visibleWords,originalWords,`Stage ${record.id}: rendered words or numbers changed`);
    const tableCount=(body.match(/<table\b/g)||[]).length;
    assert.equal((chapters[record.id-1].html.match(/<table>/g)||[]).length,tableCount,`Stage ${record.id}: source table lost`);
    assert.ok((chapters[record.id-1].html.match(/<br>/g)||[]).length>=(body.match(/<br>/g)||[]).length,`Stage ${record.id}: inline source breaks lost`);
    tables+=tableCount;breaks+=(body.match(/<br>/g)||[]).length;
    if(process.argv[2]) {
      const capture=JSON.parse(fs.readFileSync(path.join(process.argv[2],`${String(record.id).padStart(3,'0')}.json`),'utf8'));
      const start=capture.text.indexOf('<content>\n')+'<content>\n'.length;
      const end=capture.text.lastIndexOf('\n</content>');
      assert.ok(start>=10&&end>start);
      assert.equal(body,capture.text.slice(start,end),`Stage ${record.id}: Notion prose changed or omitted`);
    }
  }
  console.log(`PASS: all 120 exact Notion source bodies, ${tables} tables, ${breaks} inline source breaks${process.argv[2]?', compared with captured pages':''}`);
} else if(process.argv[2]) {
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
