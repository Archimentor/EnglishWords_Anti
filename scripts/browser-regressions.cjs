async (page) => {
  const browser = page.context().browser();
  const context = await browser.newContext();
  const test = await context.newPage();
  const errors = [], passed = [];
  test.on("pageerror", error => errors.push(error.message));
  const base = "http://localhost:8768/";
  const key3 = "wordline-v3-cefr-progress", key5 = "grammar_blueprint_option5_v1";
  const read = key => test.evaluate(key => JSON.parse(localStorage.getItem(key)),key);
  const check = (value,label) => { if(!value) throw new Error(label); passed.push(label); };
  await test.goto(base + encodeURIComponent("03 3안") + "/");
  await test.locator('[data-action="start-a1"]').click();
  await test.locator('[data-action="start-scan"],[data-action="start-mission"]').first().click();
  await test.locator('[data-action="scan-all-unknown"]').click();
  await test.locator('[data-action="scan-verify"]').click();
  let state = await read(key3);
  check(state.pendingWords.length === 24 && state.pendingSession.session.items.length === 11, "3: selected gaps retained, study bounded by time");
  await test.reload();
  check(await test.locator(".study-word").count(), "3: reload restores study");
  for(let i=0;i<11;i++){
    await test.locator('[data-action="reveal"]').click();
    await test.locator('[data-action="continue-learning"]').click();
  }
  state = await read(key3);
  check(state.pendingSession.session.questions.length === 11, "3: every studied word receives recall");
  check(state.pendingWords.length === 13, "3: unstudied selection is not discarded");
  let listening = 0, spelling = 0;
  for(let i=0;i<11;i++){
    state = await read(key3);
    const q = state.pendingSession.session.questions[i];
    if(q.mode === "listening") {
      await test.locator('[data-action="listening-fallback"]').click(); listening++;
    }
    if(q.mode === "spelling"){
      await test.locator("#spelling-answer").fill(q.target.word);
      await test.locator('[data-action="show-hint"]').click();
      check(await test.locator("#spelling-answer").inputValue() === q.target.word, "3: spelling draft survives hint");
      await test.locator("#spelling-answer").press("Enter"); spelling++;
    } else {
      const option = i===0 ? q.options.find(o=>o.id!==String(q.target.id)) : {id:String(q.target.id)};
      await test.locator('[data-action="challenge-answer"][data-value="'+option.id+'"]').click();
    }
    if(i===0){
      const before = await read(key3);
      await test.locator('[data-action="exit-session"]').click();
      await test.locator('[data-action="resume-session"]').click();
      await test.reload();
      const restored = await read(key3);
      check(restored.pendingSession.session.answers.length === 1, "3: answered item survives exit and reload without duplication");
      check(restored.progress[q.target.id].dueAt === before.progress[q.target.id].dueAt, "3: interrupted wrong answer retains review schedule");
    }
    await test.locator('[data-action="challenge-next"]').click();
  }
  state=await read(key3);
  check(!state.pendingSession && state.pendingWords.length === 13, "3: completed session clears checkpoint but keeps queue");
  check(listening>0 && spelling>0, "3: audio fallback and spelling exercised");
  await test.locator('[data-action="finish-result"]').click();
  await test.locator('[data-view="archive"]').click();
  await test.locator("#word-search").fill("apple");
  await test.locator("#archive-list-area [data-word-id]").first().click();
  await test.locator('[data-dialog-action="bookmark"]').click();
  check((await read(key3)).bookmarks.length===1,"3: bookmark persists");
  const beforeKnown = (await read(key3)).progress;
  await test.locator('[data-dialog-action="mark-known"]').click();
  const afterKnown=(await read(key3)).progress;
  check(Object.values(afterKnown).reduce((n,p)=>n+p.correct,0)===Object.values(beforeKnown).reduce((n,p)=>n+p.correct,0),"3: self-reported known is not a correct answer");
  await test.locator("#dialog-close").click();
  await test.locator('[data-view="report"]').click();
  await test.goBack();
  check(await test.locator("#word-search").count(),"3: browser Back returns to archive");
  await test.goForward();
  check(await test.locator(".report-shell, .report-view, .report-grid").count(),"3: browser Forward returns to report");
  await test.locator(".portal-home").click();
  check(await test.title()==="EnglishWords · 나의 영어 학습실","3: returns to portal");
  await test.locator("#last-course").waitFor({state:"visible"});
  check((await test.locator("#last-course").innerText()).includes("3안"),"portal: remembers latest course");

  await test.goto(base + encodeURIComponent("05 5안") + "/");
  await test.locator('[data-action="begin-a1"]').click();
  await test.locator('[data-action="start-studio"]').first().click();
  for(let i=0;i<6;i++) await test.locator('[data-action="complete-station"]').click();
  await test.locator('[data-action="start-chapter-practice"]').click();
  let session = (await read(key5)).pendingPractice;
  let ex = session.items[0];
  if(ex.type==="choice") await test.locator('[data-action="answer-choice"][data-index="'+((ex.answer+1)%ex.options.length)+'"]').click();
  else if(ex.type==="arrange") {
    await test.locator('[data-action="add-token"]').first().click();
    await test.locator('[data-action="check-answer"]').click();
  } else { await test.locator("#practice-answer").fill("not the answer"); await test.locator('[data-action="check-answer"]').click(); }
  state=await read(key5);
  check(state.progress.a1_ch1.attempts===1 && state.progress.a1_ch1.nextDue>0,"5: partial practice schedules immediately");
  await test.locator('[data-action="exit-practice"]').click();
  await test.locator('[data-action="resume-practice"]').click();
  await test.reload();
  check((await read(key5)).pendingPractice.responses.length===1,"5: reload preserves answered item");
  check((await read(key5)).progress.a1_ch1.attempts===1,"5: resume does not double count");
  await test.locator('[data-action="practice-next"]').click();
  // Find an input item; any preceding items can be submitted through the same controls.
  for(let i=1;i<session.items.length;i++){
    session=(await read(key5)).pendingPractice; ex=session.items[session.index];
    if(["input","correction"].includes(ex.type)){
      await test.locator("#practice-answer").fill("my unfinished answer");
      await test.locator('[data-action="show-hint"]').click();
      check(await test.locator("#practice-answer").inputValue()==="my unfinished answer","5: typed answer survives hint");
      await test.reload();
      check(await test.locator("#practice-answer").inputValue()==="my unfinished answer","5: typed answer survives reload");
      await test.locator("#practice-answer").fill(ex.answer);
      await test.locator("#practice-answer").press("Enter");
      break;
    }
    if(ex.type==="choice") await test.locator('[data-action="answer-choice"][data-index="'+ex.answer+'"]').click();
    else { await test.locator('[data-action="add-token"]').first().click(); await test.locator('[data-action="check-answer"]').click(); }
    await test.locator('[data-action="practice-next"]').click();
  }
  await test.locator('[data-action="navigate"][data-route="records"]').click();
  await test.goBack();
  check(await test.locator(".practice-view").count(),"5: browser Back restores practice");
  await test.goForward();
  check(await test.locator(".records-view").count(),"5: browser Forward restores records");
  await test.locator('[data-action="open-settings"]').click();
  const downloadEvent = test.waitForEvent("download");
  await test.locator('[data-backup="export"]').click();
  const download=await downloadEvent;
  check(download.suggestedFilename().includes(key5),"5: backup download");
  const importFile = payload => test.evaluate(payload => {
    const transfer = new DataTransfer();
    transfer.items.add(new File([JSON.stringify(payload)], "backup.json", {type:"application/json"}));
    const input=document.querySelector('input[type="file"]');
    input.files=transfer.files; input.dispatchEvent(new Event("change",{bubbles:true}));
  },payload);
  await importFile({format:"wrong"});
  await test.waitForFunction(()=>document.querySelector(".backup-status").textContent.includes("올바른"));
  check(true,"5: rejects invalid backup");
  const backupState=await read(key5);
  test.once("dialog",d=>d.accept());
  await importFile({format:"englishwords-backup-v1",app:key5,state:backupState});
  await test.waitForLoadState("load");
  await test.waitForFunction(()=>!document.querySelector("#settings-dialog")?.open);
  check((await read(key5)).progress.a1_ch1.attempts===backupState.progress.a1_ch1.attempts,"5: backup round trip preserves attempts");
  await context.close();

  for(const n of [3,5]){
    const blocked=await browser.newContext();
    await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new DOMException("Blocked","SecurityError")};Storage.prototype.setItem=()=>{throw new DOMException("Full","QuotaExceededError")};});
    const p=await blocked.newPage();p.on("pageerror",e=>errors.push(e.message));
    await p.goto(base+encodeURIComponent("0"+n+" "+n+"안")+"/");
    check(await p.locator("#workspace h1").count()>0,n+": storage failure does not prevent learning");
    check(await p.locator("#storage-warning").count()===1,n+": storage failure explicitly warned");
    await blocked.close();
  }
  return {passed,errors};
}
