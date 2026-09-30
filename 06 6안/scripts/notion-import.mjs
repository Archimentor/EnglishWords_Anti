import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {renderChapter, build} from './reader-build.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const sha=s=>createHash('sha256').update(s).digest('hex');

export function extractNotionPage(id,page) {
  if([page,page.metadata||{}].some(p=>p.truncated||p.unknown_block_count||p.unknown_block_ids?.length))throw Error('Incomplete Notion source: '+id);
  const properties=page.text?.match(/<properties>\n([\s\S]*?)\n<\/properties>/);
  const title=properties&&JSON.parse(properties[1]).title;
  if(typeof title!=='string'||!new RegExp('^'+id+'단계(?:\\s|[—–-]|$)').test(title)||title.includes('\n'))throw Error('Notion title does not match stage '+id);
  const content=page.text.match(/<content>\n([\s\S]*?)\n<\/content>/);
  if(!content||!content[1].trim())throw Error('Missing Notion content: '+id);
  const body=content[1];
  // Fail closed when the enhanced-Markdown fetch contains a block that this
  // importer cannot faithfully display. Never publish an incomplete fallback.
  const unsupported=[...body.matchAll(/(?<!\\)<\/?([a-z_]+)\b/gi)].map(m=>m[1]).find(tag=>!['br','table','tr','td'].includes(tag));
  if(unsupported)throw Error('Unsupported Notion block '+unsupported+' in stage '+id);
  const url=new URL(page.url);url.search='';url.hash='';
  if(url.origin!=='https://app.notion.com'||!url.pathname.startsWith('/p/'))throw Error('Unexpected Notion source URL');
  return {id,title,url:url.href,edited:page.page_last_edited_at||null,body,markdown:'# '+title+'\n\n'+body+'\n'};
}

export function prepareCourse(lessons) {
  if(lessons.length!==120)throw Error('All 120 Notion stages are required');
  if(new Set(lessons.map(l=>l.id)).size!==120||new Set(lessons.map(l=>l.url)).size!==120)throw Error('Duplicate Notion stages or page URLs');
  const sorted=[...lessons].sort((a,b)=>a.id-b.id);
  if(sorted.some((l,i)=>l.id!==i+1))throw Error('Missing Notion stage in 1–120');
  return sorted;
}

export function importCourse(directory) {
  const index=JSON.parse(fs.readFileSync(path.join(directory,'index.json'),'utf8'));
  const lessons=prepareCourse(index.stages.map(entry=>{
    const page=JSON.parse(fs.readFileSync(path.join(directory,String(entry.id).padStart(3,'0')+'.json'),'utf8'));
    const lesson=extractNotionPage(entry.id,page);
    if(lesson.url!==entry.url)throw Error('Child page differs from course index: '+entry.id);
    return lesson;
  }));
  // Validate every complete rendering before replacing any existing source.
  for(const l of lessons)renderChapter(l.id,l.markdown,{format:'notion'});
  const manifest={format:'notion-enhanced-markdown',url:index.parent,fetched:index.fetched,stages:lessons.map(l=>({id:l.id,title:l.title,url:l.url,edited:l.edited,bodyCharacters:l.body.length,bodySha256:sha(l.body),manuscriptSha256:sha(l.markdown)}))};
  const source={title:'ChatGPT 영문법 학습 정리 1~120단계',url:index.parent,fetched:index.fetched,stages:lessons.map(l=>({id:l.id,title:l.title.replace(/^\d+단계\s*[—–-]\s*/,''),url:l.url,summary:l.body.split('\n').slice(0,8).join('\n'),edited:l.edited}))};
  for(const l of lessons)fs.writeFileSync(path.join(root,'content',String(l.id).padStart(3,'0')+'.md'),l.markdown);
  fs.writeFileSync(path.join(root,'data/notion-source.json'),JSON.stringify(manifest,null,2)+'\n');
  fs.writeFileSync(path.join(root,'data/source.js'),'window.GrammarSource = '+JSON.stringify(source,null,2).replace(/</g,'\\u003c')+';\n');
  build();
  console.log('Imported all 120 Notion bodies verbatim; '+lessons.reduce((n,l)=>n+l.body.length,0)+' original body characters.');
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(!process.argv[2])throw Error('Pass the directory containing the 120 captured Notion pages and index.json');
  importCourse(path.resolve(process.argv[2]));
}
