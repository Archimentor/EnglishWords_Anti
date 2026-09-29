(function () {
  'use strict';
  const DAY=86400000, intervals=[1,3,7,14,30];
  const anchors=['concept','structure',...Array.from({length:12},(_,i)=>'topic-'+(i+1)),'examples','contrast','connections','practice'];
  const validId=id=>Number.isInteger(Number(id)) && Number(id)>=1 && Number(id)<=120;
  const stamp=n=>Number.isFinite(n) && n>=0 && n<=8640000000000000;
  const integer=n=>Number.isInteger(n) && n>=0;
  const record=()=>({completedAt:0,bookmarked:false,note:'',draft:'',recallDraft:'',due:0,interval:0,reviewedAt:0,reviews:0});
  function get(s,id) {
    if(!validId(id)) throw new Error('Invalid lesson');
    return s.lessons[id] || (s.lessons[id]=record());
  }
  window.AtlasEngine={
    anchors,
    create:()=>({version:1,last:{id:1,anchor:'concept'},font:'normal',lessons:{}}),
    get,
    visit(s,id,anchor='concept') { get(s,id); s.last={id:Number(id),anchor:anchors.includes(anchor)?anchor:'concept'}; },
    complete(s,id,now=Date.now()) {
      const p=get(s,id);
      if(!p.completedAt) { p.completedAt=now; p.due=now+DAY; p.interval=1; }
      return p;
    },
    review(s,id,remembered,now=Date.now()) {
      const p=get(s,id);
      if(!p.completedAt) throw new Error('Read the lesson before reviewing');
      // An already scheduled future review cannot be advanced by repeated/early clicks.
      if(p.due>now) return p;
      p.reviews++; p.reviewedAt=now;
      if(!remembered) { p.interval=0; p.due=now+600000; }
      else { p.interval=Math.min(p.interval+1,intervals.length); p.due=now+intervals[p.interval-1]*DAY; }
      return p;
    },
    due(s,now=Date.now()) { return Object.keys(s.lessons).filter(id=>s.lessons[id].completedAt && s.lessons[id].due<=now).sort((a,b)=>s.lessons[a].due-s.lessons[b].due || a-b).map(Number); },
    matches(lesson,query) { const q=query.trim().toLocaleLowerCase().normalize('NFKC'); return !q || (String(lesson.id)+' '+lesson.title+' '+lesson.summary).toLocaleLowerCase().normalize('NFKC').includes(q); },
    validate(s) {
      if(!s || Array.isArray(s) || s.version!==1 || !['normal','large'].includes(s.font) || !s.last || !validId(s.last.id) || typeof s.last.id!=='number' || !anchors.includes(s.last.anchor)) return false;
      if(!s.lessons || typeof s.lessons!=='object' || Array.isArray(s.lessons) || Object.keys(s.lessons).length>120) return false;
      return Object.entries(s.lessons).every(([id,p])=>String(Number(id))===id && validId(id) && p && typeof p==='object' && !Array.isArray(p) && stamp(p.completedAt) && typeof p.bookmarked==='boolean' && typeof p.note==='string' && p.note.length<=20000 && typeof p.draft==='string' && p.draft.length<=10000 && typeof p.recallDraft==='string' && p.recallDraft.length<=10000 && stamp(p.due) && stamp(p.reviewedAt) && integer(p.reviews) && p.reviews<=1000000 && integer(p.interval) && p.interval<=5 && (!p.completedAt ? p.due===0 && p.interval===0 && p.reviews===0 : p.due>0));
    }
  };
})();
