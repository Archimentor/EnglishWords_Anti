(function () {
  'use strict';
  const E=window.AtlasEngine, D=window.LearningData, source=window.GrammarSource;
  const main=document.getElementById('workspace'), key='grammar_atlas_option6_v1';
  if(!E || !D || source?.stages.length!==120 || window.AtlasLessons?.length!==120 || !source.stages.every(s=>window.AtlasTeaching?.[s.id]?.length>=5)) {
    main.innerHTML='<h1>교재를 불러오지 못했습니다.</h1><p>인터넷 연결을 확인하고 새로고침해 주세요. 계속되면 메인메뉴에서 다시 열어 주세요.</p><a href="../index.html">전체 메인메뉴로 돌아가기</a>'; return;
  }
  const chapters=source.stages.map(s=>({...s,...window.AtlasLessons.find(l=>l.id===s.id),teaching:window.AtlasTeaching?.[s.id]||[],checks:window.AtlasChecks?.[s.id]||[]}));
  const parts=['문장의 기초','표현의 확장','절과 시제의 연결','가정과 화자의 태도','정교한 표현','고급 문장과 종합'];
  const partNotes=['주어·동사에서 현재진행형까지','조동사·비교·전치사·대명사·부정사','동명사에서 완료·관계절·명사절까지','비교 확장·가정·추측·후회','허락·미래·수량·대명사·구동사','축약·도치·강조·생략·문장 분석'];
  const sections={concept:'원리 이해',structure:'구조 정리',examples:'예문 해설',contrast:'표현 비교',connections:'연결 학습',practice:'선택 활동'};
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const pad=n=>String(n).padStart(3,'0');
  const url=(id,anchor='concept')=>'#lesson/'+id+'/'+anchor;
  const date=n=>new Intl.DateTimeFormat('ko-KR',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(n);
  let state=E.create(), corrupt=false, raw=D.read(key), currentId=0, view='', scrollTimer, toastTimer, restoring=false;
  if(raw) {
    try {const loaded=JSON.parse(raw); if(!E.validate(loaded)) throw Error('invalid'); state=loaded;}
    catch(_) {corrupt=true; D.warn('저장된 6안 기록을 읽을 수 없어 임시 기록으로 열었습니다. 원본은 덮어쓰지 않습니다. 읽기 설정에서 원본을 내려받거나 정상 백업을 가져와 주세요.'); $('#raw-export').hidden=false;}
  }
  function save() {
    const success=!corrupt && D.write(key,JSON.stringify(state));
    document.querySelectorAll('.save-state').forEach(el=>el.textContent=success?'이 브라우저에 저장됨':'저장되지 않음 · 읽기 설정에서 백업하세요');
    return success;
  }
  function toast(message) {clearTimeout(toastTimer); $('#toast').textContent=message; $('#toast').classList.add('visible'); toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),4500);}
  const progress=id=>state.lessons[id];
  const sectionLabel=anchor=>sections[anchor] || '자세한 개념 학습';
  function teachingHTML(c) {
    return c.teaching.map((b,i)=>`<section class="reading-section deep-section" id="topic-${i+1}"><h2><span class="section-kicker">${String(i+3).padStart(2,'0')}</span>${esc(b.title)}</h2><p>${esc(b.text)}</p>${b.formula?`<div class="formula">${esc(b.formula)}</div>`:''}${b.examples.map(e=>`<div class="example"><p class="english" lang="en">${esc(e[0])}</p><p class="translation">${esc(e[1])}</p><p class="analysis">${esc(e[2])}</p></div>`).join('')}</section>`).join('');
  }
  function checksHTML(c) {
    return c.checks.length?`<section class="choice-checks"><h3>짧은 확인 연습</h3><p class="muted">선택하면 이유를 확인할 수 있습니다. 진도나 복습 간격에는 영향을 주지 않으며, 선택은 새로고침하면 초기화됩니다.</p>${c.checks.map((q,i)=>`<fieldset><legend>${i+1}. ${esc(q.question)}</legend><div class="actions">${q.options.map((v,j)=>`<button type="button" data-action="check-choice" data-question="${i}" data-choice="${j}" aria-pressed="false">${esc(v)}</button>`).join('')}</div><p class="choice-feedback" role="status"></p></fieldset>`).join('')}</section><div class="practice-divider"></div>`:'';
  }
  function counts() {
    const complete=Object.values(state.lessons).filter(p=>p.completedAt).length;
    $('#read-count').textContent=complete+' / 120 읽음'; $('#read-progress').value=complete;
    $('#due-count').textContent=E.due(state).length;
  }
  function renderSidebar() {
    const query=$('#search').value, part=$('#part-filter').value, status=$('#status-filter').value;
    const list=chapters.filter(c=>E.matches(c,query) && (part==='all'||Math.floor((c.id-1)/20)===Number(part)) && (status==='all'||status==='read'&&progress(c.id)?.completedAt||status==='unread'&&!progress(c.id)?.completedAt||status==='bookmarked'&&progress(c.id)?.bookmarked));
    $('#search-status').textContent=list.length ? list.length+'개 단계 · 번호순' : '검색 결과가 없습니다. 검색어나 필터를 바꿔 보세요.';
    const sidebar=$('.sidebar'), y=sidebar.scrollTop;
    $('#syllabus').innerHTML=list.map(c=>`<a href="${url(c.id)}" ${currentId===c.id?'aria-current="page"':''}><span class="stage-no">${pad(c.id)}</span><span>${esc(c.title)}</span><span class="read-mark" aria-label="${progress(c.id)?.completedAt?'읽기 완료':progress(c.id)?.bookmarked?'북마크':''}">${progress(c.id)?.completedAt?'✓':progress(c.id)?.bookmarked?'◆':''}</span></a>`).join('');
    sidebar.scrollTop=y; counts();
  }
  function renderLibrary() {
    const last=chapters[state.last.id-1], started=Object.keys(state.lessons).length>0;
    main.innerHTML=`<div class="overview"><p class="eyebrow">THE GRAMMAR COLLECTION · 06</p><h1>120단계 문법 교재</h1><p class="intro-text">한 문장의 뼈대에서 복잡한 문장 분석까지.<br>원리를 읽고 예문을 이해하며, 필요한 단계로 자유롭게 이동하세요.</p>
      <div class="resume-band"><div><small>${started?'마지막으로 펼친 곳':'처음 시작한다면'}</small><b>${last.id}단계 · ${esc(last.title)}</b><small>${started?sectionLabel(state.last.anchor):'정해진 학습량이나 문제 풀이 없이 시작합니다.'}</small></div><a class="button primary" href="${url(last.id,state.last.anchor)}">${started?'이어서 읽기':'1단계부터 읽기'} →</a></div>
      ${parts.map((name,i)=>`<details class="volume" ${Math.floor((state.last.id-1)/20)===i?'open':''}><summary><span class="volume-number">0${i+1}</span><div><b>${name}</b><small>${i*20+1}–${i*20+20}단계 · ${partNotes[i]}</small></div></summary><div class="volume-list">${chapters.slice(i*20,i*20+20).map(c=>`<a href="${url(c.id)}"><span>${pad(c.id)}</span>${esc(c.title)}${progress(c.id)?.completedAt?' ✓':''}</a>`).join('')}</div></details>`).join('')}
      <div class="course-info"><p>각 단계는 개념 설명 · 구조 · 해설 예문 · 표현 비교가 중심입니다. 회상 질문과 문장 만들기는 선택해서 펼칠 수 있습니다. 읽기 완료는 숙련도 판정이 아닙니다.</p><p>원본: <a href="${source.url}" target="_blank" rel="noopener">${esc(source.title)} ↗</a> · ${source.fetched} 기준<br>120개 요약을 바탕으로 상세 해설을 보충했습니다. 20단계씩 묶은 목차는 탐색을 위한 분류이며 CEFR 공인 등급 구분이 아닙니다.</p><p>기록은 이 브라우저에 저장됩니다. 읽기 설정에서 백업·복원할 수 있습니다.</p></div></div>`;
  }
  function renderLesson(id) {
    const c=chapters[id-1], p=E.get(state,id), part=Math.floor((id-1)/20);
    const toc=[['concept','기본 의미'],['structure','핵심 구조'],...c.teaching.map((b,i)=>['topic-'+(i+1),b.title]),['examples','예문으로 정리'],['contrast','표현 비교'],['connections','연결 학습'],['practice','선택 활동']];
    main.innerHTML=`<div class="reader-layout"><article class="reader" aria-labelledby="lesson-title"><div class="reader-topline"><p class="eyebrow">PART 0${part+1} / STEP ${pad(id)}</p><button type="button" data-action="bookmark" aria-pressed="${p.bookmarked}">${p.bookmarked?'◆ 북마크됨':'◇ 북마크'}</button></div>
      <h1 id="lesson-title" data-id="${id}">${id}단계<br>${esc(c.title)}</h1><p class="reader-meta">${parts[part]} · ${p.completedAt?'읽기 완료 · 다시 펼쳐보기':'개념을 읽고, 문장으로 이해하기'}</p><details class="inline-toc"><summary>이 단계의 목차</summary>${toc.map(([a,t])=>`<a href="${url(id,a)}">${esc(t)}</a>`).join('')}</details>
      <section class="reading-section" id="concept"><h2><span class="section-kicker">01</span> 원리 이해</h2>${c.why.map(t=>`<p>${esc(t)}</p>`).join('')}</section>
      <section class="reading-section" id="structure"><h2><span class="section-kicker">02</span> 구조 정리</h2><div class="formula">${esc(c.form)}</div><details class="glossary"><summary>문법 기호가 낯설다면</summary><p>S = 주어 · V = 동사 · O = 목적어 · C = 보어<br>동사원형 = 사전의 기본 형태 · p.p. = 과거분사 · V-ing = 동사의 -ing형<br>절 = 주어와 동사를 중심으로 이루어진 덩어리 · 명사구 = 명사를 중심으로 한 덩어리</p></details></section>
      ${teachingHTML(c)}
      <section class="reading-section" id="examples"><h2><span class="section-kicker">${String(c.teaching.length+3).padStart(2,'0')}</span> 예문으로 정리</h2>${c.examples.map(e=>`<div class="example"><p class="english" lang="en">${esc(e[0])}</p><p class="translation">${esc(e[1])}</p><p class="analysis">${esc(e[2])}</p></div>`).join('')}</section>
      <section class="reading-section" id="contrast"><h2><span class="section-kicker">${String(c.teaching.length+4).padStart(2,'0')}</span> 표현 비교</h2><div class="compare-row"><span>표현 A</span><p>${esc(c.compare[0])}</p></div><div class="compare-row"><span>표현 B</span><p>${esc(c.compare[1])}</p></div><p class="compare-reason">${esc(c.compare[2])}</p></section>
      <section class="reading-section" id="connections"><h2><span class="section-kicker">${String(c.teaching.length+5).padStart(2,'0')}</span> 연결해서 읽기</h2><div class="related">${c.related.map(r=>`<a href="${url(r)}">${r}단계 · ${esc(chapters[r-1].title)} →</a>`).join('')}</div><details class="source-details"><summary>노션의 원본 요약 보기</summary><blockquote>${esc(c.summary)}</blockquote><a class="source-link" href="${c.url}" target="_blank" rel="noopener">이 단계의 노션 원본 ↗</a><p class="muted">원본 요약 위에 의미·용법·예외를 보충해 집필했습니다. 원문과 설명의 표현이 다른 경우 상세 해설의 적용 조건을 함께 확인하세요.</p></details></section>
      <details class="optional-practice" id="practice"><summary>선택 · 설명해 보기와 문장 만들기<small>문제를 풀지 않아도 읽기 완료와 다음 단계 이동이 가능합니다.</small></summary><div class="practice-content">${checksHTML(c)}<h3>책을 잠시 덮고 설명해 보세요</h3><p>${esc(c.recall[0])}</p><label for="recall-draft">내 설명</label><textarea id="recall-draft" data-field="recallDraft" maxlength="10000" placeholder="내 말로 설명해 보세요. 말로 답해도 괜찮습니다.">${esc(p.recallDraft)}</textarea><button type="button" data-action="reveal-recall" aria-expanded="false" aria-controls="recall-answer">해설 펼치기</button><div class="answer" id="recall-answer" hidden>${esc(c.recall[1])}</div>
      <div class="practice-divider"></div><h3>내 문장으로 옮기기</h3><p>${esc(c.task[0])}</p><label for="writing-draft">내 문장</label><textarea id="writing-draft" data-field="draft" maxlength="10000" spellcheck="false" placeholder="문장을 쓰고 아래 예시와 구조를 비교해 보세요.">${esc(p.draft)}</textarea><button type="button" data-action="reveal-model" aria-expanded="false" aria-controls="writing-model">예시와 해설 펼치기</button><div id="writing-model" class="answer" hidden><p lang="en">${esc(c.task[1])}</p><p>${esc(c.task[2])}</p></div><small>자동 채점은 하지 않습니다. 예시는 유일한 정답이 아니며, 자신의 문장에서 구조와 의미가 맞는지 비교하세요.</small></div></details>
      <section class="note-section"><label for="lesson-note">이 단계의 나의 노트</label><textarea id="lesson-note" data-field="note" maxlength="20000" placeholder="헷갈렸던 점, 직접 만든 예문, 다시 확인할 질문을 남기세요.">${esc(p.note)}</textarea><span class="save-state">이 브라우저에 자동 저장 · 읽기 설정에서 백업 가능</span></section>
      <div class="reading-finish"><button type="button" class="primary" data-action="complete" ${p.completedAt?'disabled':''}>${p.completedAt?'✓ 이 단계 읽기 완료':'이 단계 읽기 완료'}</button><p id="completion-note">${p.completedAt?'다음 복습: '+date(p.due):'읽기 완료를 표시하면 다음 날 첫 회상 복습이 열립니다. 문제 풀이는 필수가 아닙니다.'}</p></div>
      <nav class="page-turn" aria-label="이전 다음 단계">${id>1?`<a href="${url(id-1)}">← ${id-1}단계<br>${esc(chapters[id-2].title)}</a>`:''}${id<120?`<a href="${url(id+1)}">${id+1}단계 →<br>${esc(chapters[id].title)}</a>`:'<a href="#library">전체 과정으로 →</a>'}</nav>
      </article><aside class="outline" aria-label="본문 내 목차"><b>이 단계에서</b>${toc.map(([anchor,label])=>`<a href="${url(id,anchor)}" data-anchor="${anchor}">${esc(label)}</a>`).join('')}<button class="print-button" type="button" data-action="print">교재 인쇄 ↗</button></aside></div>`;
  }
  function renderReview(id) {
    const due=E.due(state), c=chapters[id-1];
    if(!c || !due.includes(id)) {
      const future=Object.values(state.lessons).filter(p=>p.completedAt && p.due>Date.now()).sort((a,b)=>a.due-b.due)[0];
      main.innerHTML=`<div class="overview"><p class="eyebrow">RECALL & RETURN</p><h1>복습할 개념</h1><p class="intro-text">답을 보기 전에 내 말로 설명해 보세요. 복습 평가는 자기 확인이며 자동 채점이 아닙니다.</p>${due.length?`<p>${due.length}개 단계의 복습 시간이 되었습니다. 원하는 순서로 펼쳐 보세요.</p><ul class="review-list">${due.map(n=>`<li><a data-review-id="${n}" href="#review/${n}"><span>${n}단계 · ${esc(chapters[n-1].title)}</span><small>설명해 보기 →</small></a></li>`).join('')}</ul>`:`<div class="empty"><h2>지금 예정된 복습은 없습니다.</h2><p>${future?'다음 복습은 '+date(future.due)+'에 열립니다.':'교재에서 읽기 완료를 표시하면 다음 날 첫 복습이 열립니다.'}</p><a class="button primary" href="${url(state.last.id,state.last.anchor)}">교재 이어 읽기 →</a></div>`}<p class="course-info">읽기 완료 → 1일 뒤 첫 복습. 예정된 복습에서 설명할 수 있으면 3·7·14·30일 간격, 다시 읽기가 필요하면 10분 뒤에 재확인합니다. 열린 화면에서도 시간이 되면 목록이 갱신됩니다.</p></div>`;
      return;
    }
    const p=E.get(state,id);
    main.innerHTML=`<div class="overview"><p class="eyebrow">STEP ${pad(id)} · RECALL</p><h1>${esc(c.title)}</h1><p class="intro-text">먼저 떠올려 보고, 해설을 펼친 뒤 자신의 설명과 비교하세요.</p><div class="review-prompt">${esc(c.recall[0])}</div><label for="review-draft">내 설명 · 글이나 말로 답해도 괜찮습니다</label><textarea id="review-draft" data-field="recallDraft" data-id="${id}" maxlength="10000">${esc(p.recallDraft)}</textarea><div class="actions"><button class="primary" type="button" data-action="reveal-review" aria-expanded="false" aria-controls="review-answer">해설과 비교하기</button></div><div id="review-answer" class="answer" hidden>${esc(c.recall[1])}</div><div id="review-actions" hidden><p>구조와 이유를 해설 없이 설명할 수 있었나요?</p><div class="actions"><button type="button" data-action="forgot" data-id="${id}">다시 읽기 필요 · 10분 뒤</button><button class="primary" type="button" data-action="remembered" data-id="${id}">설명할 수 있어요</button></div></div><a class="review-link" href="${url(id)}">교재에서 원리 다시 읽기 →</a><br><a class="review-link" href="#review">← 복습 목록</a></div>`;
  }
  function renderNotes() {
    const list=chapters.filter(c=>{const p=progress(c.id);return p && (p.bookmarked||p.note||p.draft||p.recallDraft);});
    main.innerHTML=`<div class="overview"><p class="eyebrow">PERSONAL MARGINALIA</p><h1>나의 노트</h1><p class="intro-text">북마크한 단계, 직접 쓴 설명과 문장을 모았습니다. 수정하려면 해당 교재를 펼쳐 주세요.</p>${list.length?list.map(c=>{const p=progress(c.id);return `<section class="record-row"><h2><a href="${url(c.id)}">${p.bookmarked?'◆ ':''}${c.id}단계 · ${esc(c.title)}</a></h2>${p.note?`<small>학습 노트</small><p>${esc(p.note)}</p>`:''}${p.draft?`<small>내 문장</small><p>${esc(p.draft)}</p>`:''}${p.recallDraft?`<small>내 설명</small><p>${esc(p.recallDraft)}</p>`:''}${!p.note&&!p.draft&&!p.recallDraft?'<p class="muted">북마크한 단계입니다. 교재에서 노트를 남길 수 있습니다.</p>':''}</section>`;}).join(''):'<div class="empty"><h2>아직 남긴 노트가 없습니다.</h2><p>교재의 북마크 버튼이나 나의 노트 칸을 사용해 보세요.</p><a href="#library">전체 과정 둘러보기 →</a></div>'}</div>`;
  }
  function markAnchor(anchor) {
    document.querySelectorAll('[data-anchor]').forEach(el=>{if(el.dataset.anchor===anchor) el.setAttribute('aria-current','location');else el.removeAttribute('aria-current');});
  }
  function goAnchor(anchor) {
    restoring=true;
    if(anchor==='practice') $('#practice').open=true;
    requestAnimationFrame(()=>{const el=anchor==='concept'?$('.reader'):document.getElementById(anchor); el?.scrollIntoView({block:'start',behavior:'instant'});setTimeout(()=>{restoring=false;},120);});
    markAnchor(anchor);
  }
  function route() {
    clearTimeout(scrollTimer);
    const path=location.hash.slice(1).split('/');
    if(path[0]==='workspace') {main.focus();return;}
    const name=['library','lesson','review','notes'].includes(path[0])?path[0]:'library';
    const id=Number(path[1]);
    if(name==='lesson' && Number.isInteger(id) && id>=1 && id<=120) {
      const validAnchors=E.anchors.filter(a=>!a.startsWith('topic-')||Number(a.slice(6))<=chapters[id-1].teaching.length);
      const anchor=validAnchors.includes(path[2])?path[2]:(state.last.id===id&&validAnchors.includes(state.last.anchor)?state.last.anchor:'concept');
      if(view==='lesson' && currentId===id) {E.visit(state,id,anchor);save();goAnchor(anchor);return;}
      view=name;currentId=id; E.visit(state,id,anchor); save(); renderLesson(id); goAnchor(anchor);
      document.title=`${id}단계 · ${chapters[id-1].title} | Grammar Atlas`;
    } else {
      currentId=0; view=name==='lesson'?'library':name;
      if(view==='review')renderReview(id);else if(view==='notes')renderNotes();else renderLibrary();
      window.scrollTo({top:0,behavior:'instant'});document.title=({review:'복습할 개념',notes:'나의 노트',library:'120단계 문법 교재'}[view])+' | Grammar Atlas';
    }
    document.querySelectorAll('[data-view]').forEach(el=>{if(el.dataset.view===(view==='lesson'?'library':view))el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});
    renderSidebar(); main.focus({preventScroll:true}); $('.sidebar').classList.remove('expanded'); $('.mobile-toc').setAttribute('aria-expanded','false'); $('.mobile-toc span').textContent='펼치기 ↓';
  }
  document.addEventListener('input',event=>{
    const el=event.target;
    if(el.matches('[data-field]')) {const id=Number(el.dataset.id)||currentId;if(!id)return;E.get(state,id)[el.dataset.field]=el.value;save();}
  });
  $('#search').addEventListener('input',renderSidebar);
  $('#part-filter').addEventListener('change',renderSidebar);
  $('#status-filter').addEventListener('change',renderSidebar);
  $('.mobile-toc').onclick=()=>{const open=$('.sidebar').classList.toggle('expanded');$('.mobile-toc').setAttribute('aria-expanded',String(open));$('.mobile-toc span').textContent=open?'접기 ↑':'펼치기 ↓';};
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-action]');if(!el)return;
    const action=el.dataset.action;
    if(action==='check-choice' && currentId) {const q=chapters[currentId-1].checks[Number(el.dataset.question)];if(!q)return;const fieldset=el.closest('fieldset');fieldset.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));fieldset.querySelector('.choice-feedback').textContent=(Number(el.dataset.choice)===q.answer?'맞습니다. ':'다시 비교해 보세요. ')+q.explanation;}
    if(action==='bookmark' && currentId) {const p=E.get(state,currentId);p.bookmarked=!p.bookmarked;el.setAttribute('aria-pressed',String(p.bookmarked));el.textContent=p.bookmarked?'◆ 북마크됨':'◇ 북마크';save();renderSidebar();}
    if(action==='complete' && currentId) {const p=E.complete(state,currentId);save();el.disabled=true;el.textContent='✓ 이 단계 읽기 완료';$('#completion-note').textContent='다음 복습: '+date(p.due);renderSidebar();toast(corrupt?'현재 창에만 표시했습니다. 기록을 복원한 뒤 저장할 수 있습니다.':'읽기 완료를 표시했습니다. 내일 복습에서 다시 만나요.');}
    if(action==='reveal-recall'||action==='reveal-model') {const answer=action==='reveal-recall'?$('#recall-answer'):$('#writing-model');answer.hidden=!answer.hidden;el.setAttribute('aria-expanded',String(!answer.hidden));el.textContent=answer.hidden?(action==='reveal-recall'?'해설 펼치기':'예시와 해설 펼치기'):'해설 접기';}
    if(action==='print')window.print();
    if(action==='reveal-review') {$('#review-answer').hidden=false;$('#review-actions').hidden=false;el.setAttribute('aria-expanded','true');el.hidden=true;}
    if((action==='forgot'||action==='remembered') && $('#review-answer') && !$('#review-answer').hidden) {const id=Number(el.dataset.id);if(!E.due(state).includes(id))return;const p=E.review(state,id,action==='remembered');save();location.hash='#review';toast('다음 복습: '+date(p.due)+(action==='forgot'?' · 교재에서 원리를 다시 읽어 보세요.':''));}
  });
  const settings=$('#settings');
  $('#settings-open').onclick=()=>settings.showModal();
  settings.addEventListener('click',event=>{if(event.target===settings){const r=settings.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)settings.close();}});
  settings.querySelectorAll('[name="font"]').forEach(el=>{el.checked=el.value===state.font;el.onchange=()=>{state.font=el.value;document.body.classList.toggle('large-type',state.font==='large');save();};});
  document.body.classList.toggle('large-type',state.font==='large');
  D.mount({dialog:settings,key,getState:()=>state,validate:E.validate});
  $('#raw-export').onclick=()=>{const link=document.createElement('a'),blob=new Blob([raw],{type:'application/json'}),objectURL=URL.createObjectURL(blob);link.href=objectURL;link.download='grammar-atlas-unreadable-original.json';link.click();setTimeout(()=>URL.revokeObjectURL(objectURL),1000);};
  window.addEventListener('hashchange',route);
  window.addEventListener('scroll',()=>{
    if(view!=='lesson'||restoring)return;
    clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{
      if(view!=='lesson'||restoring)return;
      const threshold=$('.atlas-header').getBoundingClientRect().bottom+90;
      const visible=E.anchors.filter(a=>document.getElementById(a)?.getBoundingClientRect().top<=threshold);
      const anchor=visible.at(-1)||'concept';
      if(state.last.id===currentId && state.last.anchor===anchor)return;
      E.visit(state,currentId,anchor);save();markAnchor(anchor);history.replaceState(null,'',url(currentId,anchor));
    },200);
  },{passive:true});
  // Refresh due counts when a ten-minute recovery becomes available; never replace an active recall draft.
  setInterval(()=>{if(document.hidden)return;counts();if(view==='review'&&!$('#review-draft'))renderReview(0);},30000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden){counts();if(view==='review'&&!$('#review-draft'))renderReview(0);}});
  route();
})();
