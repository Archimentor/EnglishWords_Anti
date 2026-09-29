async (page) => {
  const browser=page.context().browser(),ctx=await browser.newContext({viewport:{width:1366,height:900}});
  const p=await ctx.newPage(),base='http://127.0.0.1:8768/',path=base+'06%206%EC%95%88/',key='grammar_atlas_option6_v1',passed=[];
  const ok=(v,label)=>{if(!v)throw Error(label);passed.push(label);};
  const read=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  try {
    await p.goto(path+'#lesson/1/concept'); await p.locator('#lesson-title').waitFor();
    await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    ok(await p.evaluate(()=>document.querySelector('#lesson-title').getBoundingClientRect().top>=document.querySelector('.atlas-header').getBoundingClientRect().bottom),'Chapter title visible on first opening');
    await p.locator('#lesson-note').fill('backup-fixture');
    await p.locator('#settings-open').click();
    await p.locator('[name="font"][value="large"]').check();
    ok((await read()).font==='large','Font preference saved');
    const downloadEvent=p.waitForEvent('download'); await p.locator('[data-backup="export"]').click();
    const dl=await downloadEvent;
    ok(dl.suggestedFilename().includes(key),'Backup export offered for the correct course');
    const before=JSON.stringify(await read());
    async function upload(data) {await p.locator('.data-backup input').evaluate((el,value)=>{const dt=new DataTransfer();dt.items.add(new File([JSON.stringify(value)],'record.json',{type:'application/json'}));el.files=dt.files;el.dispatchEvent(new Event('change'));},data);}
    await upload({format:'englishwords-backup-v1',app:key,state:{version:1}});
    await p.locator('.backup-status').filter({hasText:'올바른 백업'}).waitFor();
    ok(JSON.stringify(await read())===before,'Invalid backup leaves progress intact');
    const fixture=await read();fixture.lessons[1].note='restored-note';
    p.once('dialog',d=>d.accept());
    await upload({format:'englishwords-backup-v1',app:key,state:fixture});
    await p.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).lessons[1].note==='restored-note',key);
    await p.waitForFunction(()=>document.querySelector('#lesson-note')?.value==='restored-note');
    ok((await read()).lessons[1].note==='restored-note','Valid backup replaces and restores exact notes');
    // A second tab must not silently overwrite concurrent edits.
    const other=await ctx.newPage();await other.goto(path+'#lesson/1/concept');await other.locator('#lesson-title').waitFor();
    await other.locator('#lesson-note').fill('second-tab');
    await p.locator('#storage-warning').filter({hasText:'다른 탭'}).waitFor();
    await p.locator('#lesson-note').fill('stale-tab');
    ok((await read()).lessons[1].note==='second-tab','Conflicted tab cannot overwrite newer data');
    await other.close(); await p.reload();await p.locator('#lesson-title').waitFor();
    // A malformed local record is kept byte-for-byte rather than overwritten on navigation.
    await p.evaluate(k=>localStorage.setItem(k,'{"broken":'),key);await p.reload();
    await p.locator('#storage-warning').filter({hasText:'원본은 덮어쓰지'}).waitFor();
    await p.locator('#lesson-note').fill('temporary');
    ok(await p.evaluate(k=>localStorage.getItem(k),key)==='{"broken":','Corrupt storage preserved for recovery');
    // Portal round-trip and narrow navigation, including existing courses.
    await p.locator('.portal-home').click(); await p.locator('[data-option="6"]').click();
    await p.locator('#syllabus a').first().waitFor();
    ok((await p.title()).includes('Grammar Atlas'),'Portal to option 6 and back');
    await p.setViewportSize({width:320,height:800});
    await p.locator('.mobile-toc').click();await p.locator('#search').fill('120');
    await p.locator('#syllabus a').click();await p.locator('#lesson-title[data-id="120"]').waitFor();
    ok(await p.locator('.mobile-toc').getAttribute('aria-expanded')==='false','Mobile syllabus closes after navigation');
    for(const option of [2,3,4,5]) {
      await p.goto(base+encodeURIComponent('0'+option+' '+option+'안')+'/');
      const link=p.locator('.portal-options a').filter({hasText:'6안'});
      ok(await link.count()===1,`Option ${option} links to 6`);
      ok(await p.locator('.portal-bar').evaluate(el=>el.scrollWidth<=innerWidth),`Option ${option} portal fits 320px`);
    }
    const restricted=await browser.newContext({viewport:{width:320,height:800}});
    try {
      await restricted.addInitScript(()=>{Storage.prototype.setItem=function(){throw new DOMException('Blocked','QuotaExceededError');};});
      const q=await restricted.newPage();await q.goto(path+'#lesson/120/concept');await q.locator('#lesson-title').waitFor();
      await q.locator('#lesson-note').fill('메모는 저장 실패 때도 현재 창에서 유지');
      ok((await q.locator('#storage-warning').innerText()).includes('저장할 수 없습니다'),'Storage failure is visible');
      ok(await q.locator('#lesson-note').inputValue()==='메모는 저장 실패 때도 현재 창에서 유지','Storage failure does not discard in-memory writing');
      await q.locator('#settings-open').click();await q.locator('[name="font"][value="large"]').check();
      await q.keyboard.press('Escape');
      ok(await q.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'Large type fits 320px');
      ok(!(await q.locator('#settings').isVisible()),'Settings dismisses with Escape');
    } finally {await restricted.close();}
    const unavailable=await browser.newContext();
    try {
      const q=await unavailable.newPage();await q.route('**/lessons-06.js*',r=>r.abort());await q.goto(path);
      ok((await q.locator('#workspace').innerText()).includes('교재를 불러오지 못했습니다'),'Missing curriculum fails clearly, not a blank screen');
      await q.unroute('**/lessons-06.js*');
      await q.route('**/teaching-06.js*',r=>r.abort());await q.reload();
      ok((await q.locator('#workspace').innerText()).includes('교재를 불러오지 못했습니다'),'Missing detailed teaching must not silently show the shallow draft');
    } finally {await unavailable.close();}
    return {passed};
  } finally {await ctx.close();}
}
