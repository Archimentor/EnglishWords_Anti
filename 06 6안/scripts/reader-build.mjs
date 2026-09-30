import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {Marked, Renderer} from '../vendor/marked.mjs';
import {notionBlockBoundaries, notionTable} from './notion-markdown.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=s=>createHash('sha256').update(s).digest('hex');
const stageHeading=/^#{1,3}\s+(?:\*\*)?(\d{1,3})단계[^\r\n]*/m;

export function extractLessons(html, expected=83) {
  const lessons=new Map();
  for(const match of html.matchAll(/streamController\.enqueue\(("(?:[^"\\]|\\.)*")\)/g)) {
    let pool;
    try {pool=JSON.parse(JSON.parse(match[1]));} catch {continue;}
    if(!Array.isArray(pool))continue;
    for(const value of pool) {
      if(typeof value!=='string'||value.length<500)continue;
      const heading=stageHeading.exec(value);
      if(!heading)continue;
      const id=Number(heading[1]);
      if(id<1||id>expected)continue;
      if(lessons.has(id))throw Error('Duplicate source chapter: '+id);
      lessons.set(id,{id,markdown:value});
    }
  }
  const missing=Array.from({length:expected},(_,i)=>i+1).filter(id=>!lessons.has(id));
  if(missing.length)throw Error('Missing source chapters: '+missing.join(', '));
  return [...lessons.values()].sort((a,b)=>a.id-b.id);
}

export function resolveAnchor(chapter, anchor) {
  if(['concept','connections','practice'].includes(anchor))return anchor;
  if(chapter.toc.some(h=>h.id===anchor))return anchor;
  if(/^topic-\d+$/.test(anchor))return chapter.toc.filter(h=>h.depth===2)[Number(anchor.slice(6))-1]?.id||'concept';
  const meaning={structure:/구조|형태|모양/,examples:/예문|예$/,contrast:/차이|비교|구분/}[anchor];
  return meaning ? chapter.toc.find(h=>meaning.test(h.label))?.id||'concept' : 'concept';
}

export function renderChapter(id, markdown, {format='markdown'}={}) {
  const toc=[];
  let title='';
  const renderer=new Renderer();
  renderer.heading=function(token) {
    const inline=this.parser.parseInline(token.tokens);
    const label=token.text.replace(/\\([\\`*_{}\[\]()#+\-.!~|<>])/g,'$1').replace(/[`*_]/g,'');
    if(!title && new RegExp('^'+id+'단계(?:\\s|[—–-]|$)').test(label)) {
      title=label;
      return `<h1 id="lesson-title" data-id="${id}">${inline}</h1>\n`;
    }
    // The shared responses use multiple h1s. Preserve their visual hierarchy,
    // but expose one accessible page title and stable, sequential section IDs.
    const anchor='reading-'+(toc.length+1);
    const depth=Math.max(2,token.depth);
    toc.push({id:anchor,label,depth});
    return `<h${depth} id="${anchor}" data-reading-anchor="${anchor}">${inline}</h${depth}>\n`;
  };
  renderer.html=token=>format==='notion' && /^<br\s*\/?\s*>$/i.test(token.text)?'<br>':escape(token.text);
  renderer.image=token=>escape(token.text);
  renderer.link=function(token) {
    const label=this.parser.parseInline(token.tokens);
    let safe=false;
    try {const u=new URL(token.href);safe=['https:','http:'].includes(u.protocol);}catch {}
    return safe?`<a href="${escape(token.href)}" target="_blank" rel="noopener noreferrer">${label}</a>`:label;
  };
  const table=renderer.table;
  renderer.table=function(token) {return '<div class="table-scroll" role="region" aria-label="문법 비교 표" tabindex="0">'+table.call(this,token)+'</div>';};
  const parser=new Marked({gfm:true,breaks:false,renderer});
  // The original chat allows a Korean particle after bold text ending in
  // punctuation or inline code. CommonMark otherwise leaves the ** visible.
  // Handle this at tokenization, not by changing the stored source or HTML.
  parser.use({extensions:[{
    name:'strong',level:'inline',
    start:src=>src.indexOf('**'),
    tokenizer(src) {
      // Notion emits adjacent rich-text runs as **text ****`code`**.
      // Tokenize each run independently, including its boundary spaces.
      if(format==='notion') {
        const run=/^\*\*(?!\*)([^\n]+?)\*\*/.exec(src);
        if(run)return {type:'strong',raw:run[0],text:run[1],tokens:this.lexer.inlineTokens(run[1])};
      }
      const match=/^\*\*(?!\*)(\S(?:[^\n]*?\S)?)\*\*(?!\*)/.exec(src);
      if(match && /^[가-힣]/.test(src.slice(match[0].length))) {
        return {type:'strong',raw:match[0],text:match[1],tokens:this.lexer.inlineTokens(match[1])};
      }
    }
  }]});
  if(format==='notion')parser.use({extensions:[notionTable]});
  const html=parser.parse(format==='notion'?notionBlockBoundaries(markdown):markdown);
  if(!title)throw Error('Missing chapter title: '+id);
  if(toc.length>80)throw Error('Too many headings for persisted anchors: '+id);
  const chapter={id,title,html,toc,origin:format==='notion'?'notion':id<=83?'conversation':'continuation',characters:markdown.length};
  chapter.aliases=Object.fromEntries(['structure','examples','contrast',...Array.from({length:12},(_,i)=>'topic-'+(i+1))].map(a=>[a,resolveAnchor(chapter,a)]));
  return chapter;
}

function extract(file) {
  const lessons=extractLessons(fs.readFileSync(file,'utf8'));
  const dir=path.join(root,'content');
  fs.mkdirSync(dir,{recursive:true});
  for(const lesson of lessons) {
    const dest=path.join(dir,String(lesson.id).padStart(3,'0')+'.md');
    if(fs.existsSync(dest))throw Error('Refusing to overwrite reviewed manuscript: '+dest);
  }
  const records=[];
  for(const {id,markdown} of lessons) {
    // Opaque ChatGPT citation IDs are UI artifacts, not readable source prose.
    const text=markdown.replace(/\s*cite[^]*/g,'').trim()+'\n';
    fs.writeFileSync(path.join(dir,String(id).padStart(3,'0')+'.md'),text);
    records.push({id,originalCharacters:markdown.length,originalSha256:hash(markdown),importedSha256:hash(text)});
  }
  fs.writeFileSync(path.join(root,'data/conversation-source.json'),JSON.stringify({url:'https://chatgpt.com/share/6abb3b19-1004-83ee-8b42-f2748b5e55f8',stages:records},null,2)+'\n');
  console.log('Extracted all 83 original chapters; no conversation metadata exported.');
}

export function build({check=false}={}) {
  const sourceFile=path.join(root,'data/notion-source.json');
  const notion=fs.existsSync(sourceFile)?JSON.parse(fs.readFileSync(sourceFile,'utf8')):null;
  if(notion&&(notion.format!=='notion-enhanced-markdown'||notion.stages.length!==120))throw Error('Invalid Notion provenance manifest');
  const chapters=Array.from({length:120},(_,i)=> {
    const id=i+1,markdown=fs.readFileSync(path.join(root,'content',String(id).padStart(3,'0')+'.md'),'utf8');
    if(notion&&(notion.stages[i].id!==id||notion.stages[i].manuscriptSha256!==hash(markdown)))throw Error('Manuscript differs from imported Notion source: '+id);
    return renderChapter(id,markdown,{format:notion?'notion':'markdown'});
  });
  for(let part=0;part<6;part++) {
    const payload=JSON.stringify(chapters.slice(part*20,part*20+20)).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
    const output='// Generated from content/*.md by scripts/reader-build.mjs. Do not edit.\nwindow.AtlasChapters=(window.AtlasChapters||[]).concat('+payload+');\n';
    const target=path.join(root,'data','chapters-'+String(part+1).padStart(2,'0')+'.js');
    if(check) {
      if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==output)throw Error('Stale generated chapter bundle: '+target);
    } else fs.writeFileSync(target,output);
  }
  console.log(`${check?'Verified':'Built'} 120 chapters, ${chapters.reduce((n,c)=>n+c.characters,0)} manuscript characters.`);
  return chapters;
}

if(process.argv[1] && path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  if(process.argv[2]==='--extract')extract(process.argv[3]);
  else build({check:process.argv.includes('--check')});
}
