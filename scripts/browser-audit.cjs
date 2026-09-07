async (page) => {
  const context = await page.context().browser().newContext();
  const test = await context.newPage();
  const errors = [];
  test.on("pageerror", error => errors.push(error.message));
  await test.goto("http://localhost:8768/" + encodeURIComponent("05 5안") + "/");
  await test.locator('[data-action="begin-a1"]').click();
  const result = await test.evaluate(() => {
    const data = GrammarStudioData, engine = GrammarStudioEngine;
    let sections = 0, formulas = 0, syntax = 0, answers = 0;
    const assert = (value, message) => { if (!value) throw new Error(message); };
    function click(selector) { const el = document.querySelector(selector); assert(el, "Missing: " + selector); el.click(); }
    for (const chapter of data.getAll()) {
      history.replaceState(null, "", "#studio-" + chapter.id);
      dispatchEvent(new PopStateEvent("popstate"));
      for (let i = 0; i < 6; i++) {
        click('.studio-rail [data-action="select-station"][data-index="' + i + '"]');
        assert(document.querySelector(".station-page h1"), chapter.id + ": empty section " + i);
        if (i === 2) {
          for (let f = 0; f < chapter.formulas.length; f++) {
            click('[data-action="select-formula"][data-index="' + f + '"]'); formulas++;
          }
        }
        if (i === 3) {
          for (let t = 0; t < chapter.syntaxExamples.length; t++) {
            const button = document.querySelector('[data-action="select-syntax"][data-index="' + t + '"]');
            if (button) button.click();
            for (const token of [...document.querySelectorAll('[data-action="select-token"]')]) {
              document.querySelector('[data-action="select-token"][data-index="' + token.dataset.index + '"]').click();
            }
            syntax++;
          }
        }
        click('[data-action="complete-station"]'); sections++;
      }
      const saved = JSON.parse(localStorage.getItem("grammar_blueprint_option5_v1"));
      assert(saved.progress[chapter.id].completedStations.length === 6, chapter.id + ": reading progress");
      click('[data-action="start-chapter-practice"]');
      for (let i = 0; i < engine.flattenExercises(chapter).length; i++) {
        const state = JSON.parse(localStorage.getItem("grammar_blueprint_option5_v1"));
        const session = state.pendingPractice, exercise = session.items[session.index];
        if (exercise.type === "choice") {
          click('[data-action="answer-choice"][data-index="' + exercise.answer + '"]');
        } else if (exercise.type === "arrange") {
          let remaining = engine.normalizeAnswer(exercise.answer);
          const pool = [...session.itemState.tokenPool];
          while (pool.length) {
            const index = pool.findIndex(token => {
              const word = engine.normalizeAnswer(token.text);
              return remaining === word || remaining.startsWith(word + " ");
            });
            assert(index >= 0, exercise.id + ": token sequence");
            const token = pool.splice(index,1)[0];
            remaining = remaining.slice(engine.normalizeAnswer(token.text).length).trim();
            click('[data-action="add-token"][data-token="' + token.id + '"]');
          }
          click('[data-action="check-answer"]');
        } else {
          const input = document.getElementById("practice-answer");
          input.value = exercise.answer;
          input.dispatchEvent(new Event("input", {bubbles:true}));
          click('[data-action="check-answer"]');
        }
        assert(document.querySelector(".answer-feedback.is-correct"), exercise.id + ": correct response rejected");
        answers++;
        click('[data-action="practice-next"]');
      }
      assert(document.querySelector(".result-view"), chapter.id + ": missing result");
    }
    const saved = JSON.parse(localStorage.getItem("grammar_blueprint_option5_v1"));
    assert(!saved.pendingPractice, "Completed practice must not resume");
    const attempts = Object.values(saved.progress).reduce((sum,p) => sum + p.attempts,0);
    assert(attempts === answers, "Double counted or lost responses");
    assert(Object.values(saved.progress).every(p => p.mastery === 1), "First-session mastery inflated");
    return {chapters:data.getAll().length, sections, formulas, syntax, answers, attempts, maxMastery:1};
  });
  await context.close();
  return {...result, errors};
}
