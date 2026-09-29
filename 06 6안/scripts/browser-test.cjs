async (page) => {
  const ctx=await page.context().browser().newContext({viewport:{width:1366,height:900}});
  const p=await ctx.newPage(); const errors=[];
  p.on('pageerror',error=>errors.push(error.message));
  function ok(condition,message) {if(!condition) throw new Error(message);}
  const base='http://127.0.0.1:8768/06%206%EC%95%88/';
  const result=[];
  try {
    await p.goto(base);
    ok((await p.title()).includes('Grammar Atlas'),'6안 must load a real reader');
    await p.locator('#syllabus a').first().waitFor();
    ok(await p.locator('#syllabus a').count()===120,'120 searchable source stages');
    await p.locator('#search').fill('가정법');
    ok(await p.locator('#syllabus a').count()===4,'Search should find four titles/summary matches');
    await p.locator('#search').fill('없는주제abcdefgh');
    ok(await p.locator('#syllabus a').count()===0,'Empty search must not show unrelated chapters');
    await p.locator('#search').fill('');
    await p.goto(base+'#lesson/1/concept');
    await p.locator('#lesson-title').waitFor();
    ok(await p.locator('.reading-section').count()>=10,'Detailed textbook sections visible without a quiz gate');
    ok(!(await p.locator('#recall-answer').isVisible()),'Recall answer starts hidden');
    await p.locator('[data-action="bookmark"]').click();
    await p.locator('#lesson-note').fill('내 문법 노트 <script>bad()</script>');
    await p.locator('#practice').evaluate(el=>el.open=true);
    await p.locator('#writing-draft').fill('I walk every morning.');
    await p.locator('#recall-draft').fill('주어와 동사의 역할을 구분한다.');
    await p.reload(); await p.locator('#lesson-title').waitFor();
    ok(await p.locator('#lesson-note').inputValue()==='내 문법 노트 <script>bad()</script>','Notes survive reload as text');
    ok(await p.locator('#writing-draft').inputValue()==='I walk every morning.','Writing drafts survive reload');
    ok(await p.locator('[data-action="bookmark"]').getAttribute('aria-pressed')==='true','Bookmark survives reload');
    await p.locator('[data-action="complete"]').click();
    const key='grammar_atlas_option6_v1';
    let state=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    ok(state.lessons[1].completedAt>0 && state.lessons[1].reviews===0,'Reading completion must not claim recall mastery');
    ok(state.lessons[1].due>Date.now()+86000000,'First review scheduled tomorrow');
    // Inject a valid, overdue record to exercise the real review UI without waiting a day.
    await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));s.lessons[1].due=Date.now()-1000;localStorage.setItem(k,JSON.stringify(s));},key);
    await p.goto(base+'#review'); await p.reload();
    await p.locator('[data-review-id="1"]').click();
    ok(!(await p.locator('#review-answer').isVisible()),'Review must begin with retrieval, not the answer');
    ok(!(await p.locator('[data-action="remembered"]').isVisible()),'Cannot rate before revealing');
    await p.locator('[data-action="reveal-review"]').click();
    await p.locator('[data-action="forgot"]').click();
    state=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    ok(state.lessons[1].due>Date.now()+590000 && state.lessons[1].due<Date.now()+610000,'Forgotten concept returns in ten minutes');
    await p.goto(base+'#notes');
    ok((await p.locator('#workspace').innerText()).includes('<script>bad()</script>'),'Notes are escaped, not interpreted');
    // Every source stage must render its own textbook, links and optional practice.
    for(let id=1;id<=120;id++) {
      await p.goto(base+'#lesson/'+id+'/concept');
      await p.locator(`#lesson-title[data-id="${id}"]`).waitFor();
      ok(await p.locator('.example').count()>=8,`Stage ${id} missing explained examples`);
      ok(await p.locator('.deep-section').count()>=5,`Stage ${id} missing detailed teaching`);
      ok(await p.locator('.inline-toc a').count()>=11,`Stage ${id} missing section navigation`);
      ok(await p.locator('#concept p').count()===2,`Stage ${id} missing concept teaching`);
      ok(await p.locator('.source-link').getAttribute('href')!==null,`Stage ${id} missing source`);
    }
    result.push('120 stages render; search, bookmark, notes, draft, reload, completion and due-review flow');
    await p.goto(base+'#lesson/83/concept');
    ok(await p.locator('.deep-section').count()===11,'Stage 83 follows the supplied detailed example');
    for(const term of ['should','would rather','had better','부정형']) {
      ok((await p.locator('.reader').innerText()).includes(term),'Stage 83 missing comparison: '+term);
    }
    await p.locator('#practice').evaluate(el=>el.open=true);
    ok(await p.locator('.choice-checks fieldset').count()===6,'All six optional reference checks');
    const answers=[0,0,0,0,0,1];
    for(let i=0;i<answers.length;i++) {
      const field=p.locator('.choice-checks fieldset').nth(i);
      await field.locator('button').nth(1-answers[i]).click();
      ok((await field.locator('.choice-feedback').innerText()).startsWith('다시 비교해'),'Incorrect option explains the error');
      await field.locator('button').nth(answers[i]).click();
      ok((await field.locator('.choice-feedback').innerText()).startsWith('맞습니다'),'Correct option explains the reason');
    }
    state=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
    ok(!state.lessons[83].completedAt && !state.lessons[83].reviews,'Optional checks do not claim mastery or mark reading complete');
    await p.goto(base+'#lesson/83/topic-8');
    await p.waitForTimeout(400);
    await p.reload(); await p.locator('#topic-8').waitFor();
    ok((await p.locator('#topic-8 h2').innerText()).includes('부정형'),'Deep section can be directly linked and reloaded');
    ok(await p.locator('[data-anchor="topic-8"]').getAttribute('aria-current')==='location','Deep-section reading position restored');
    result.push('83: eleven detailed explanations, six correct/incorrect answer explanations, no quiz gate, deep-link restore');
    for(const width of [320,390,768,1366]) {
      await p.setViewportSize({width,height:900});
      await p.goto(base+'#lesson/83/concept');
      ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Horizontal overflow at ${width}`);
      await p.goto(base+'#library');
      ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Library overflow at ${width}`);
    }
    result.push('320/390/768/1366 responsive widths');
    ok(errors.length===0,'Runtime errors: '+errors.join('; '));
    return {passed:result,errors};
  } finally {await ctx.close();}
}
