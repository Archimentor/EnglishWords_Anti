import assert from 'node:assert/strict';
import {extractNotionPage, prepareCourse} from './notion-import.mjs';

const page={url:'https://app.notion.com/p/example-1?pvs=204',page_last_edited_at:'2026-09-30T00:00:00Z',text:'<page>\n<properties>\n{"title":"1단계 — 문장"}\n</properties>\n<content>\n설명 그대로.\n> 예문<br>해석\n## 연습\n1. 질문\n</content>\n</page>'};
const lesson=extractNotionPage(1,page);
assert.deepEqual(lesson,{id:1,title:'1단계 — 문장',url:'https://app.notion.com/p/example-1',edited:'2026-09-30T00:00:00Z',body:'설명 그대로.\n> 예문<br>해석\n## 연습\n1. 질문',markdown:'# 1단계 — 문장\n\n설명 그대로.\n> 예문<br>해석\n## 연습\n1. 질문\n'},'Keep the exact Notion body, only adding its real page title');
assert.throws(()=>extractNotionPage(2,page),/title|제목/i);
assert.throws(()=>extractNotionPage(1,{...page,truncated:true}),/incomplete|완전/i);
assert.throws(()=>extractNotionPage(1,{...page,unknown_block_count:1}),/incomplete|완전/i);
assert.throws(()=>extractNotionPage(1,{...page,text:page.text.replace('</content>','')}),/content|본문/i);
assert.throws(()=>extractNotionPage(1,{...page,text:page.text.replace('설명 그대로.','<unknown url="x"/>')}),/unsupported|지원/i);
const lessons=Array.from({length:120},(_,i)=>({...lesson,id:i+1,title:`${i+1}단계 — 문장`,url:`https://app.notion.com/p/example-${i+1}`}));
assert.equal(prepareCourse(lessons).length,120);
assert.throws(()=>prepareCourse(lessons.slice(1)),/120|missing|누락/i);
assert.throws(()=>prepareCourse([...lessons.slice(1),lessons[1]]),/duplicate|중복/i);
assert.throws(()=>prepareCourse(lessons.map((l,i)=>i===119?{...l,url:lessons[0].url}:l)),/duplicate|중복/i);
console.log('PASS: exact source import, title matching, incomplete/unsupported page rejection, 120 unique stages and URLs');
