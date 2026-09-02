(function () {
  "use strict";

  const data = window.GrammarStudioData;
  const engine = window.GrammarStudioEngine;
  const workspace = document.getElementById("workspace");
  const siteHeader = document.getElementById("site-header");
  const settingsDialog = document.getElementById("settings-dialog");
  const dueCounter = document.getElementById("due-counter");
  const STORAGE_KEY = "grammar_blueprint_option5_v1";
  const LEGACY_OPTION5_KEY = "grammar-lab-a1-c1-v3";
  const MAX_ATTEMPT_LOG = 240;

  let state = loadState();
  let currentView = state.onboarded ? "today" : "onboarding";
  let courseLevel = state.activeLevel;
  let courseQuery = "";
  let studioSession = null;
  let practiceSession = null;
  let resultSession = null;
  let resetArmed = false;
  let resetTimer = null;

  function defaultState() {
    return {
      version: 2,
      migrationComplete: false,
      onboarded: false,
      activeLevel: "A1",
      goalMinutes: 15,
      soundEnabled: true,
      progress: {},
      drafts: {},
      attemptLog: [],
      lastStudyDate: null,
      streak: 0
    };
  }

  function safeParse(value, fallback) {
    try {
      return value ? JSON.parse(value) : fallback;
    } catch (_error) {
      return fallback;
    }
  }

  function migrateLegacy(base) {
    if (base.migrationComplete) return base;
    const legacy = safeParse(localStorage.getItem(LEGACY_OPTION5_KEY), null);
    if (!legacy) {
      return { ...base, migrationComplete: true };
    }
    base.onboarded = Boolean(legacy.onboarded);
    base.activeLevel = engine.LEVELS.includes(legacy.activeLevel) ? legacy.activeLevel : "A1";
    const legacyMinutes = Math.max(5, Number(legacy.goalMinutes) || 15);
    base.goalMinutes = legacyMinutes <= 10 ? 10 : legacyMinutes <= 15 ? 15 : 25;
    base.soundEnabled = legacy.soundEnabled !== false;
    base.streak = Math.max(0, Number(legacy.streak) || 0);
    base.lastStudyDate = legacy.lastActiveDate || null;
    base.migrationComplete = true;
    return base;
  }

  function loadState() {
    const base = defaultState();
    const saved = safeParse(localStorage.getItem(STORAGE_KEY), null);
    const merged = saved ? {
      ...base,
      ...saved,
      progress: saved.progress && typeof saved.progress === "object" ? saved.progress : {},
      drafts: saved.drafts && typeof saved.drafts === "object" ? saved.drafts : {},
      attemptLog: Array.isArray(saved.attemptLog) ? saved.attemptLog.slice(-MAX_ATTEMPT_LOG) : []
    } : base;
    const migrated = migrateLegacy(merged);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    } catch (_error) {
      // The app remains usable in private modes where storage is unavailable.
    }
    return migrated;
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_error) {
      // Progress persistence is best-effort; learning content still works.
    }
    updateHeader();
  }

  function getProgress(chapterId) {
    return engine.ensureProgress(state.progress[chapterId]);
  }

  function setProgress(chapterId, progress) {
    state.progress[chapterId] = engine.ensureProgress(progress);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, "&#096;");
  }

  function stripLeadingSymbol(value) {
    return String(value || "").replace(/^\s*[\p{Extended_Pictographic}\uFE0F]+\s*/u, "").trim();
  }

  function richQuestion(value) {
    return escapeHTML(value)
      .replace(/&lt;ins&gt;/g, "<ins>")
      .replace(/&lt;\/ins&gt;/g, "</ins>")
      .replace(/\n/g, "<br>");
  }

  function sanitizeLessonHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = String(html || "");
    const allowed = new Set(["H3", "H4", "P", "UL", "OL", "LI", "STRONG", "EM", "DIV", "SPAN", "BR", "INS"]);
    [...template.content.querySelectorAll("*")].forEach((element) => {
      [...element.attributes].forEach((attribute) => element.removeAttribute(attribute.name));
      if (!allowed.has(element.tagName)) element.replaceWith(document.createTextNode(element.textContent || ""));
    });
    template.content.querySelectorAll("h3, h4").forEach((heading) => {
      heading.textContent = stripLeadingSymbol(heading.textContent);
    });
    return template.innerHTML;
  }

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function recordStudyDay() {
    const today = localDateKey();
    if (state.lastStudyDate === today) return;
    if (!state.lastStudyDate) {
      state.streak = 1;
    } else {
      const previous = new Date(`${state.lastStudyDate}T00:00:00`);
      const current = new Date(`${today}T00:00:00`);
      const difference = Math.round((current - previous) / engine.DAY);
      state.streak = difference === 1 ? state.streak + 1 : 1;
    }
    state.lastStudyDate = today;
  }

  function completedStudioCount() {
    return data.getAll().filter((chapter) => engine.stationCompletion(getProgress(chapter.id)).complete).length;
  }

  function stableChapterCount() {
    return data.getAll().filter((chapter) => getProgress(chapter.id).mastery >= 4).length;
  }

  function overallAccuracy() {
    if (!state.attemptLog.length) return 0;
    const correct = state.attemptLog.filter((attempt) => attempt.correct).length;
    return Math.round((correct / state.attemptLog.length) * 100);
  }

  function updateHeader() {
    const due = engine.getDueChapters(data.getAll(), state.progress).length;
    dueCounter.textContent = `복습 ${due}`;
    siteHeader.classList.toggle("is-onboarding", !state.onboarded);
    siteHeader.querySelectorAll("[data-route]").forEach((button) => {
      button.disabled = !state.onboarded;
      button.classList.toggle("is-active", button.dataset.route === currentView);
    });
  }

  function routeTo(view, options = {}) {
    const { push = true } = options;
    if (!state.onboarded && view !== "onboarding") view = "onboarding";
    currentView = view;
    if (view !== "studio") studioSession = null;
    if (view !== "practice") practiceSession = null;
    if (view !== "result") resultSession = null;
    if (push) history.pushState({ view }, "", view === "onboarding" ? "#start" : `#${view}`);
    render();
  }

  function render() {
    const renderer = {
      onboarding: renderOnboarding,
      today: renderToday,
      course: renderCourse,
      review: renderReview,
      records: renderRecords,
      studio: renderStudio,
      practice: renderPractice,
      result: renderResult
    }[currentView] || renderToday;
    workspace.innerHTML = renderer();
    updateHeader();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function renderOnboarding() {
    const sample = data.getChapter("a2_ch3");
    const syntax = sample.syntaxExamples[0];
    return `
      <section class="onboarding-view">
        <div class="onboarding-copy">
          <p class="micro-label">OPTION 05 · STRUCTURE-FIRST GRAMMAR</p>
          <h1>문법은 외우는 규칙이 아니라<br><em>설계하는 구조</em>입니다.</h1>
          <p class="onboarding-lead">문장을 관찰하고, 원리를 분리하고, 성분을 다시 조립한 뒤 실제 수행 결과로 복습 시점을 정합니다. A1부터 C1까지 40개 구조를 하나의 작업 흐름으로 익히세요.</p>
          <div class="onboarding-actions">
            <button class="primary-action" type="button" data-action="begin-a1">A1 첫 설계 시작</button>
            <button class="text-action" type="button" data-action="browse-course">40개 과정 먼저 보기</button>
          </div>
          <dl class="method-ledger">
            <div><dt>01</dt><dd><b>읽기만 하지 않습니다</b><span>문장 성분을 눌러 구조와 역할을 직접 확인합니다.</span></dd></div>
            <div><dt>02</dt><dd><b>문제부터 풀지 않습니다</b><span>6개 설계 단계를 마친 뒤에 수행을 확인합니다.</span></dd></div>
            <div><dt>03</dt><dd><b>한 번의 정답을 믿지 않습니다</b><span>정확도·힌트·속도로 다음 복습을 예약합니다.</span></dd></div>
          </dl>
        </div>

        <figure class="blueprint-poster" aria-label="문장 구조 설계 예시">
          <figcaption><span>BLUEPRINT / ${sample.levelCode}.${sample.chapterNum}</span><b>${escapeHTML(sample.title)}</b></figcaption>
          <div class="poster-grid" aria-hidden="true"></div>
          <p class="poster-sentence">${escapeHTML(syntax.sentence)}</p>
          <div class="poster-tokens">
            ${syntax.tokens.map((token, index) => `<div style="--i:${index}"><span>${escapeHTML(token.role)}</span><b>${escapeHTML(token.text)}</b><small>${escapeHTML(token.label)}</small></div>`).join("")}
          </div>
          <blockquote>${escapeHTML(sample.guide.decisionRule)}</blockquote>
          <div class="poster-stamp">A1—C1<br>40 MODULES</div>
        </figure>
      </section>`;
  }

  function renderLevelRail(activeLevel = state.activeLevel, action = "set-active-level") {
    return `
      <div class="level-rail" role="tablist" aria-label="문법 수준">
        ${data.LEVEL_META.map((level) => `<button type="button" role="tab" aria-selected="${level.id === activeLevel}" class="${level.id === activeLevel ? "is-active" : ""}" data-action="${action}" data-level="${level.id}"><span>${level.number}</span><b>${level.id}</b><small>${escapeHTML(level.name)}</small></button>`).join("")}
      </div>`;
  }

  function renderToday() {
    const chapters = data.getAll();
    const plan = engine.buildDailyPlan(chapters, state.progress, state.activeLevel, state.goalMinutes);
    const focus = plan.focus;
    const progress = getProgress(focus.id);
    const station = engine.stationCompletion(progress);
    const nextStation = engine.STATIONS.find((item) => !progress.visitedStations.includes(item.id)) || engine.STATIONS.at(-1);
    const formula = focus.formulas?.[0];
    const duePreview = plan.due.slice(0, 3);
    return `
      <section class="today-view">
        ${renderLevelRail()}
        <div class="today-grid">
          <article class="mission-board">
            <header class="mission-header">
              <div><p class="micro-label">TODAY'S BUILD · ${state.goalMinutes} MIN</p><span>${focus.levelCode} / MODULE ${String(focus.order).padStart(2, "0")}</span></div>
              <div class="mission-progress"><b>${station.percent}</b><span>% STUDIO</span></div>
            </header>
            <div class="mission-body">
              <p class="mission-kicker">${escapeHTML(nextStation.short)} · ${escapeHTML(nextStation.label)}</p>
              <h1>${escapeHTML(focus.title)}</h1>
              <p>${escapeHTML(focus.guide.mission)}</p>
              ${formula ? `<code>${escapeHTML(formula.formula)}</code>` : ""}
            </div>
            <footer class="mission-footer">
              <button class="primary-action" type="button" data-action="start-studio" data-chapter="${focus.id}">${station.visited ? "설계 이어가기" : "스튜디오 입장"}</button>
              <span>다음 단계 ${String(station.visited + 1).padStart(2, "0")} / ${station.total}</span>
            </footer>
          </article>

          <aside class="today-ledger">
            <header><p class="micro-label">TODAY LEDGER</p><h2>오늘의 작업 순서</h2></header>
            <ol>
              ${plan.queue.map((chapter, index) => {
                const itemProgress = getProgress(chapter.id);
                const isDue = itemProgress.nextDue && itemProgress.nextDue <= Date.now();
                return `<li><button type="button" data-action="start-studio" data-chapter="${chapter.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><b>${escapeHTML(chapter.title)}</b><small>${chapter.levelCode} · ${isDue ? "복습 우선" : engine.stationCompletion(itemProgress).complete ? "다시 설계" : "새 구조"}</small></div><i>→</i></button></li>`;
              }).join("")}
            </ol>
            <div class="due-callout ${plan.due.length ? "has-due" : ""}">
              <div><span>${plan.due.length}</span><p><b>복습할 구조</b><small>${plan.due.length ? "기억이 흐려지기 전에 먼저 확인합니다." : "현재 밀린 복습이 없습니다."}</small></p></div>
              <button type="button" data-action="start-review" ${plan.due.length || state.attemptLog.length ? "" : "disabled"}>복습 시작</button>
            </div>
          </aside>
        </div>

        <section class="workflow-strip" aria-label="학습 과정">
          <header><p class="micro-label">THE SIX-STATION METHOD</p><h2>한 단원을 끝내는 방법</h2></header>
          <ol>${engine.STATIONS.map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHTML(item.label)}</b><small>${escapeHTML(item.short)}</small></li>`).join("")}</ol>
        </section>

        <section class="evidence-strip">
          <div><span>완료한 설계</span><b>${completedStudioCount()}<small>/40</small></b></div>
          <div><span>안정된 구조</span><b>${stableChapterCount()}<small>/40</small></b></div>
          <div><span>누적 수행</span><b>${state.attemptLog.length}<small>문장</small></b></div>
          <div><span>연속 학습</span><b>${state.streak}<small>일</small></b></div>
        </section>

        ${duePreview.length ? `<section class="repair-preview"><header><p class="micro-label">REPAIR FIRST</p><h2>먼저 되살릴 구조</h2></header><div>${duePreview.map((chapter) => `<button type="button" data-action="start-studio" data-chapter="${chapter.id}"><span>${chapter.levelCode}</span><b>${escapeHTML(chapter.title)}</b><small>${engine.formatDue(getProgress(chapter.id).nextDue)}</small></button>`).join("")}</div></section>` : ""}
      </section>`;
  }

  function courseRowsHTML() {
    const chapters = data.search(courseQuery, courseLevel);
    return chapters.length ? chapters.map((chapter) => {
      const progress = getProgress(chapter.id);
      const station = engine.stationCompletion(progress);
      const status = progress.mastery >= 4 ? "안정" : station.complete ? engine.verdictLabel(progress.lastVerdict) : station.visited ? "설계 중" : "미학습";
      return `
        <button class="course-row" type="button" data-action="start-studio" data-chapter="${chapter.id}">
          <span class="course-index">${chapter.levelCode}.${String(data.getByLevel(chapter.levelCode).indexOf(chapter) + 1).padStart(2, "0")}</span>
          <div class="course-name"><b>${escapeHTML(chapter.title)}</b><small>${escapeHTML(chapter.guide.mission)}</small></div>
          <span class="course-formulas">${chapter.formulas?.length || 0}개 구조</span>
          <span class="course-meter"><i style="width:${station.percent}%"></i></span>
          <strong class="course-state state-${progress.lastVerdict}">${escapeHTML(status)}</strong>
          <span class="course-arrow">→</span>
        </button>`;
    }).join("") : `<div class="empty-ledger"><span>0</span><h3>일치하는 설계도가 없습니다.</h3><p>문법 이름, 공식, 예문 핵심어로 다시 검색해 보세요.</p></div>`;
  }

  function renderCourse() {
    const level = data.getLevel(courseLevel);
    const count = data.search(courseQuery, courseLevel).length;
    return `
      <section class="course-view">
        <header class="page-heading course-heading">
          <div><p class="micro-label">FULL CURRICULUM · 40 BLUEPRINTS</p><h1>문법 구조 과정</h1><p>레벨마다 8개 핵심 구조를 관찰·분해·수리·전이합니다.</p></div>
          <label class="course-search"><span>구조 검색</span><input id="course-search" type="search" value="${escapeAttribute(courseQuery)}" placeholder="예: 가정법, 관계사, 수동태" autocomplete="off"></label>
        </header>
        ${renderLevelRail(courseLevel, "set-course-level")}
        <section class="level-intro" style="--level-color:${level.color}"><span>LEVEL ${level.id}</span><div><h2>${escapeHTML(level.name)}</h2><p>${escapeHTML(level.caption)}</p></div><strong id="course-count">${count}개 모듈</strong></section>
        <div class="course-ledger" id="course-ledger">${courseRowsHTML()}</div>
      </section>`;
  }

  function reviewCandidates() {
    const chapters = data.getAll();
    const due = engine.getDueChapters(chapters, state.progress);
    const weak = chapters.filter((chapter) => {
      const progress = getProgress(chapter.id);
      return progress.attempts > 0 && progress.mastery < 4 && !due.includes(chapter);
    }).sort((a, b) => getProgress(a.id).mastery - getProgress(b.id).mastery);
    return { due, weak, all: [...due, ...weak] };
  }

  function renderReview() {
    const candidates = reviewCandidates();
    const upcoming = data.getAll()
      .filter((chapter) => getProgress(chapter.id).nextDue > Date.now())
      .sort((a, b) => getProgress(a.id).nextDue - getProgress(b.id).nextDue)
      .slice(0, 5);
    const readyItems = engine.buildReviewSession(data.getAll(), state.progress, state.goalMinutes <= 10 ? 5 : state.goalMinutes <= 15 ? 7 : 10);
    return `
      <section class="review-view">
        <header class="page-heading">
          <div><p class="micro-label">SPACED REPAIR QUEUE</p><h1>복습 큐</h1><p>정확도, 힌트 사용, 응답 속도를 근거로 필요한 구조만 다시 꺼냅니다.</p></div>
          <div class="queue-total"><b>${candidates.due.length}</b><span>지금 복습</span></div>
        </header>

        <section class="review-launch">
          <div><span>ACTIVE SESSION</span><h2>${readyItems.length ? `${readyItems.length}개 문장으로 기억을 다시 세웁니다.` : "아직 복습할 수행 기록이 없습니다."}</h2><p>${readyItems.length ? "같은 문제 유형만 반복하지 않고 판별·수리·조립·변환을 섞습니다." : "한 단원의 6개 설계 단계를 마치고 확인 연습을 완료하면 복습 일정이 생성됩니다."}</p></div>
          <button class="primary-action" type="button" data-action="start-review" ${readyItems.length ? "" : "disabled"}>복습 세션 시작</button>
        </section>

        <div class="review-columns">
          <section class="due-ledger"><header><p class="micro-label">DUE / WEAK</p><h2>수리가 필요한 구조</h2></header>${candidates.all.length ? candidates.all.slice(0, 10).map((chapter, index) => { const progress = getProgress(chapter.id); return `<button type="button" data-action="start-studio" data-chapter="${chapter.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><b>${escapeHTML(chapter.title)}</b><small>${chapter.levelCode} · ${engine.verdictLabel(progress.lastVerdict)}</small></div><strong>${progress.nextDue <= Date.now() ? "지금" : `${progress.mastery}/5`}</strong></button>`; }).join("") : `<div class="empty-inline">학습 결과가 쌓이면 이곳에 약한 구조가 나타납니다.</div>`}</section>
          <section class="upcoming-ledger"><header><p class="micro-label">NEXT DUE</p><h2>다가오는 복습</h2></header>${upcoming.length ? upcoming.map((chapter) => `<div><span>${chapter.levelCode}</span><p><b>${escapeHTML(chapter.title)}</b><small>${engine.formatDue(getProgress(chapter.id).nextDue)}</small></p><i style="--mastery:${getProgress(chapter.id).mastery}"></i></div>`).join("") : `<div class="empty-inline">예정된 복습이 없습니다.</div>`}<footer><b>10분 → 1일 → 3일 → 7일</b><span>실패하면 짧게, 안정되면 길게 간격이 조정됩니다.</span></footer></section>
        </div>
      </section>`;
  }

  function renderRecords() {
    const summary = engine.getLevelSummary(data.getAll(), state.progress);
    const recent = [...state.attemptLog].slice(-8).reverse();
    const wrongByMode = {};
    state.attemptLog.forEach((attempt) => {
      if (!attempt.correct) wrongByMode[attempt.modeLabel] = (wrongByMode[attempt.modeLabel] || 0) + 1;
    });
    const weakness = Object.entries(wrongByMode).sort((a, b) => b[1] - a[1]);
    return `
      <section class="records-view">
        <header class="page-heading">
          <div><p class="micro-label">LEARNING EVIDENCE</p><h1>학습 기록</h1><p>읽은 양보다 실제로 설계하고 맞힌 근거를 중심으로 보여 줍니다.</p></div>
          <div class="accuracy-dial" style="--accuracy:${overallAccuracy()}"><b>${overallAccuracy()}%</b><span>전체 정확도</span></div>
        </header>

        <section class="record-summary">
          <div><span>설계 완료</span><b>${completedStudioCount()}<small>/40</small></b></div>
          <div><span>안정 구조</span><b>${stableChapterCount()}<small>/40</small></b></div>
          <div><span>수행 문장</span><b>${state.attemptLog.length}<small>개</small></b></div>
          <div><span>연속 학습</span><b>${state.streak}<small>일</small></b></div>
        </section>

        <section class="level-evidence"><header><p class="micro-label">LEVEL EVIDENCE</p><h2>레벨별 구조 안정도</h2></header>${data.LEVEL_META.map((level) => { const item = summary[level.id]; return `<div class="level-evidence-row"><span>${level.id}</span><div><b>${escapeHTML(level.name)}</b><small>${item.studioComplete}/${item.total} 설계 완료 · ${item.stable}개 안정</small></div><i><u style="width:${item.averageMastery}%"></u></i><strong>${item.averageMastery}%</strong></div>`; }).join("")}</section>

        <div class="record-columns">
          <section class="weakness-ledger"><header><p class="micro-label">ERROR PATTERN</p><h2>오류가 남은 작업</h2></header>${weakness.length ? weakness.map(([mode, count]) => `<div><b>${escapeHTML(mode)}</b><span>${count}회 오류</span><i style="width:${Math.min(100, count * 14)}%"></i></div>`).join("") : `<div class="empty-inline">아직 기록된 오류가 없습니다.</div>`}</section>
          <section class="attempt-ledger"><header><p class="micro-label">RECENT ATTEMPTS</p><h2>최근 수행</h2></header>${recent.length ? recent.map((attempt) => `<div class="${attempt.correct ? "is-correct" : "is-wrong"}"><span>${attempt.correct ? "PASS" : "REPAIR"}</span><p><b>${escapeHTML(attempt.chapterTitle)}</b><small>${escapeHTML(attempt.modeLabel)} · ${new Date(attempt.at).toLocaleDateString("ko-KR")}</small></p></div>`).join("") : `<div class="empty-inline">확인 연습을 완료하면 수행 기록이 남습니다.</div>`}</section>
        </div>
      </section>`;
  }

  function beginStudio(chapterId, options = {}) {
    const chapter = data.getChapter(chapterId);
    if (!chapter) return;
    const progress = getProgress(chapterId);
    let stationIndex = engine.STATIONS.findIndex((station) => station.id === progress.lastStation);
    if (stationIndex < 0) stationIndex = 0;
    studioSession = {
      chapter,
      stationIndex,
      formulaIndex: 0,
      syntaxIndex: 0,
      tokenIndex: 0,
      repairRevealed: new Set(),
      checkRevealed: new Set()
    };
    setProgress(chapterId, engine.visitStation(progress, engine.STATIONS[stationIndex].id));
    saveState();
    currentView = "studio";
    if (options.push !== false) history.pushState({ view: "studio", chapterId }, "", `#studio-${chapterId}`);
    render();
  }

  function selectStudioStation(index) {
    if (!studioSession) return;
    const progress = getProgress(studioSession.chapter.id);
    const visitedIndexes = progress.visitedStations.map((id) => engine.STATIONS.findIndex((station) => station.id === id));
    const maxVisited = Math.max(0, ...visitedIndexes);
    const unlocked = Math.min(engine.STATIONS.length - 1, maxVisited + 1);
    const nextIndex = Math.max(0, Math.min(engine.STATIONS.length - 1, Number(index)));
    if (nextIndex > unlocked) return;
    studioSession.stationIndex = nextIndex;
    studioSession.formulaIndex = 0;
    studioSession.tokenIndex = 0;
    const stationId = engine.STATIONS[nextIndex].id;
    setProgress(studioSession.chapter.id, engine.visitStation(progress, stationId));
    saveState();
    render();
  }

  function studioRailHTML(chapter, progress) {
    const visitedIndexes = progress.visitedStations.map((id) => engine.STATIONS.findIndex((station) => station.id === id));
    const unlocked = Math.min(engine.STATIONS.length - 1, Math.max(0, ...visitedIndexes) + 1);
    return `<nav class="studio-rail" aria-label="설계 단계">${engine.STATIONS.map((station, index) => `<button type="button" data-action="select-station" data-index="${index}" ${index > unlocked ? "disabled" : ""} class="${index === studioSession.stationIndex ? "is-active" : ""} ${progress.visitedStations.includes(station.id) ? "is-visited" : ""}" aria-current="${index === studioSession.stationIndex ? "step" : "false"}"><span>${String(index + 1).padStart(2, "0")}</span><div><b>${escapeHTML(station.label)}</b><small>${escapeHTML(station.short)}</small></div><i>${progress.visitedStations.includes(station.id) ? "✓" : ""}</i></button>`).join("")}</nav>`;
  }

  function renderBriefStation(chapter) {
    return `
      <article class="station-page brief-station">
        <p class="station-code">00 / DESIGN BRIEF</p>
        <h1>${escapeHTML(chapter.guide.mission)}</h1>
        <p class="station-lead">${escapeHTML(chapter.summary)}</p>
        <section class="essential-question"><span>ESSENTIAL QUESTION</span><h2>${escapeHTML(chapter.guide.essentialQuestion)}</h2></section>
        <section class="outcome-list"><header><span>이 설계를 마치면</span></header><ol>${chapter.guide.outcomes.map((outcome, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(outcome)}</p></li>`).join("")}</ol></section>
        <aside class="korean-lens"><span>KOREAN SPEAKER LENS</span><p>${escapeHTML(chapter.guide.koreanLens)}</p></aside>
      </article>`;
  }

  function renderObserveStation(chapter) {
    return `
      <article class="station-page observe-station">
        <p class="station-code">01 / OBSERVE MEANING</p>
        <h1>형태를 외우기 전에<br>문장이 필요한 이유를 봅니다.</h1>
        <blockquote class="story-analogy">${escapeHTML(stripLeadingSymbol(chapter.storyMetaphor))}</blockquote>
        <div class="core-reading">${sanitizeLessonHTML(chapter.coreExplanation || `<p>${escapeHTML(chapter.summary)}</p>`)}</div>
        <section class="decision-rule"><span>FIRST DECISION</span><h2>${escapeHTML(chapter.guide.decisionRule)}</h2></section>
      </article>`;
  }

  function renderRuleStation(chapter) {
    const formulas = chapter.formulas || [];
    const activeIndex = Math.min(studioSession.formulaIndex, Math.max(0, formulas.length - 1));
    const formula = formulas[activeIndex];
    if (!formula) return `<article class="station-page"><h1>등록된 형태 공식이 없습니다.</h1></article>`;
    const examples = formula.examples?.length ? formula.examples : formula.example ? [{ en: formula.example }] : [];
    const trap = data.formulaTrap(formula);
    return `
      <article class="station-page rule-station">
        <p class="station-code">02 / FORM SYSTEM</p>
        <h1>의미를 문장 형태로<br>변환하는 규칙입니다.</h1>
        <div class="formula-workbench">
          <nav aria-label="공식 선택">${formulas.map((item, index) => `<button type="button" data-action="select-formula" data-index="${index}" class="${index === activeIndex ? "is-active" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHTML(item.title)}</b></button>`).join("")}</nav>
          <section class="active-formula">
            <header><p>${escapeHTML(formula.title)}</p><code>${escapeHTML(formula.formula)}</code></header>
            <div class="formula-meaning"><span>MEANING</span><p>${escapeHTML(data.formulaMeaning(formula))}</p></div>
            ${formula.components?.length ? `<dl class="component-ledger">${formula.components.map((component) => `<div><dt>${escapeHTML(component.part)}</dt><dd>${escapeHTML(component.desc)}</dd></div>`).join("")}</dl>` : ""}
            <div class="formula-decision"><span>판별 순서</span><p>${escapeHTML(data.formulaUsage(formula, chapter))}</p></div>
            ${examples.length ? `<div class="formula-examples"><header><span>WORKED EXAMPLES</span></header>${examples.map((example, index) => { const translation = data.exampleTranslation(example); const note = data.exampleNote(example); return `<section><div><span>0${index + 1}</span><button type="button" data-action="speak" data-text="${escapeAttribute(example.en)}">듣기</button></div><h3>${escapeHTML(example.en)}</h3>${translation ? `<p>${escapeHTML(translation)}</p>` : ""}${note ? `<small>${escapeHTML(note)}</small>` : ""}</section>`; }).join("")}</div>` : ""}
            ${trap ? `<aside class="formula-warning"><span>WATCH</span><p>${escapeHTML(stripLeadingSymbol(trap))}</p></aside>` : ""}
          </section>
        </div>
        ${formulas.length > 1 ? `<section class="formula-compare"><header><span>COMPARE ALL</span><h2>같은 단원 안의 선택지를 한눈에 비교합니다.</h2></header>${formulas.map((item) => `<div><b>${escapeHTML(item.title)}</b><code>${escapeHTML(item.formula)}</code><p>${escapeHTML(item.desc || data.formulaMeaning(item))}</p></div>`).join("")}</section>` : ""}
      </article>`;
  }

  function renderBlueprintStation(chapter) {
    const examples = chapter.syntaxExamples || [];
    const syntaxIndex = Math.min(studioSession.syntaxIndex, Math.max(0, examples.length - 1));
    const example = examples[syntaxIndex];
    if (!example) return `<article class="station-page"><h1>등록된 문장 설계도가 없습니다.</h1></article>`;
    const tokenIndex = Math.min(studioSession.tokenIndex, Math.max(0, example.tokens.length - 1));
    const token = example.tokens[tokenIndex];
    return `
      <article class="station-page blueprint-station">
        <p class="station-code">03 / SENTENCE BLUEPRINT</p>
        <h1>문장을 덩어리로 나누고<br>각 부품의 일을 추적합니다.</h1>
        <section class="syntax-board">
          <header><span>ANALYSIS ${String(syntaxIndex + 1).padStart(2, "0")}</span><button type="button" data-action="speak" data-text="${escapeAttribute(example.sentence)}">문장 듣기</button></header>
          ${examples.length > 1 ? `<nav class="syntax-example-tabs" aria-label="분석 예문 선택">${examples.map((item, index) => `<button type="button" data-action="select-syntax" data-index="${index}" class="${index === syntaxIndex ? "is-active" : ""}"><span>${String(index + 1).padStart(2, "0")}</span>${escapeHTML(item.sentence)}</button>`).join("")}</nav>` : ""}
          <h2>${escapeHTML(example.sentence)}</h2>
          <p>${escapeHTML(example.translation)}</p>
          <div class="syntax-track">${example.tokens.map((item, index) => `<button type="button" data-action="select-token" data-index="${index}" class="role-${escapeAttribute(item.role)} ${index === tokenIndex ? "is-active" : ""}"><span>${escapeHTML(item.role)}</span><b>${escapeHTML(item.text)}</b></button>`).join("")}</div>
          <div class="token-inspector"><span>${escapeHTML(token.role)}</span><div><b>${escapeHTML(token.text)}</b><p>${escapeHTML(token.label)}</p></div><i>문장 안에서 이 덩어리가 맡은 역할</i></div>
        </section>
        <section class="blueprint-method"><span>READING ORDER</span><ol><li><b>동사</b><p>문장의 사건이나 상태를 먼저 찾습니다.</p></li><li><b>필수 성분</b><p>동사가 요구하는 주어·목적어·보어를 연결합니다.</p></li><li><b>수식 정보</b><p>시간·장소·방법처럼 없어도 골격이 남는 정보를 분리합니다.</p></li></ol></section>
      </article>`;
  }

  function highlightedSentence(sentence, target) {
    const safeSentence = escapeHTML(sentence);
    const safeTarget = escapeHTML(target);
    return safeTarget ? safeSentence.replace(safeTarget, `<mark>${safeTarget}</mark>`) : safeSentence;
  }

  function renderRepairStation(chapter) {
    const corrections = chapter.exercises?.errorCorrection || [];
    return `
      <article class="station-page repair-station">
        <p class="station-code">04 / ERROR REPAIR</p>
        <h1>틀린 문장을 고치는 것보다<br>틀린 이유를 복원합니다.</h1>
        <div class="repair-bench">${corrections.map((item, index) => { const revealed = studioSession.repairRevealed.has(index); return `<section class="repair-case ${revealed ? "is-revealed" : ""}"><header><span>CASE ${String(index + 1).padStart(2, "0")}</span><b>오류 위치 ${escapeHTML(item.underlineTarget)}</b></header><p class="broken-sentence">${highlightedSentence(item.originalSentence, item.underlineTarget)}</p>${revealed ? `<div class="repair-answer"><span>REPAIRED</span><h3>${highlightedSentence(String(item.originalSentence).replace(item.underlineTarget, item.correctedWord), item.correctedWord)}</h3><p>${escapeHTML(item.explanation)}</p></div>` : `<button type="button" data-action="reveal-repair" data-index="${index}">수리 과정 확인</button>`}</section>`; }).join("")}</div>
        ${chapter.pitfalls?.length ? `<section class="pitfall-ledger"><header><span>FAILURE MODES</span><h2>이 단원에서 자주 무너지는 지점</h2></header>${chapter.pitfalls.map((pitfall, index) => `<div><span>${String(index + 1).padStart(2, "0")}</span><p><b>${escapeHTML(pitfall.title)}</b><small>${escapeHTML(pitfall.tip)}</small></p></div>`).join("")}</section>` : ""}
        ${chapter.selfChecks?.length ? `<section class="concept-checks"><header><span>MENTAL CHECK</span><h2>답을 보기 전에 말로 설명해 보세요.</h2></header>${chapter.selfChecks.map((check, index) => { const revealed = studioSession.checkRevealed.has(index); return `<div class="concept-check ${revealed ? "is-revealed" : ""}"><p>${escapeHTML(check.question.replace(/^Q\.\s*/, ""))}</p>${revealed ? `<blockquote>${escapeHTML(check.answer)}</blockquote>` : `<button type="button" data-action="reveal-check" data-index="${index}">설명과 대조</button>`}</div>`; }).join("")}</section>` : ""}
      </article>`;
  }

  function renderTransferStation(chapter, progress) {
    const completion = engine.stationCompletion(progress);
    const missing = engine.STATIONS.filter((station) => !progress.visitedStations.includes(station.id));
    return `
      <article class="station-page transfer-station">
        <p class="station-code">05 / TRANSFER</p>
        <h1>본 예문을 떠나<br>내 문장으로 옮깁니다.</h1>
        <section class="transfer-assignment"><span>YOUR BUILD</span><h2>${escapeHTML(chapter.guide.transferPrompt)}</h2><p>모범 문장을 베끼지 말고, 내가 실제로 말하거나 쓸 법한 내용으로 구조를 옮겨 보세요.</p></section>
        <label class="transfer-draft"><span>MY SENTENCE / WORKSPACE</span><textarea id="transfer-draft" data-chapter="${chapter.id}" maxlength="1200" placeholder="여기에 직접 만든 문장과 판단 근거를 적으세요.">${escapeHTML(state.drafts[chapter.id] || "")}</textarea><small>이 브라우저에 자동 저장됩니다. 아래 조건을 하나씩 가리키며 내 문장을 다시 읽어 보세요.</small></label>
        <section class="takeaway-spec"><header><span>ACCEPTANCE CRITERIA</span><h2>문장이 만족해야 할 핵심 조건</h2></header><ol>${(chapter.keyTakeaways || []).map((item, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(item)}</p></li>`).join("")}</ol></section>
        <section class="studio-completion ${completion.complete ? "is-ready" : ""}">
          ${completion.complete
            ? `<div><span>6/6</span><p><b>설계 단계를 모두 통과했습니다.</b><small>이제 판별·수리·조립·변환으로 실제 수행을 확인합니다.</small></p></div><button class="primary-action" type="button" data-action="start-chapter-practice">확인 연습 시작</button>`
            : `<div><span>${completion.visited}/6</span><p><b>아직 확인하지 않은 설계 단계가 있습니다.</b><small>문제보다 먼저 원리와 구조를 모두 확인하세요.</small></p></div><button class="primary-action" type="button" data-action="select-station" data-index="${engine.STATIONS.findIndex((station) => station.id === missing[0]?.id)}">남은 단계로 이동</button>`}
        </section>
      </article>`;
  }

  function renderStudioStation(chapter, progress) {
    return [
      renderBriefStation,
      renderObserveStation,
      renderRuleStation,
      renderBlueprintStation,
      renderRepairStation,
      (item) => renderTransferStation(item, progress)
    ][studioSession.stationIndex](chapter);
  }

  function renderStudio() {
    if (!studioSession) return renderToday();
    const chapter = studioSession.chapter;
    const progress = getProgress(chapter.id);
    const completion = engine.stationCompletion(progress);
    const station = engine.STATIONS[studioSession.stationIndex];
    return `
      <section class="studio-view">
        <header class="studio-topbar">
          <button class="studio-back" type="button" data-action="navigate" data-route="today" aria-label="오늘 설계로 돌아가기">←</button>
          <div><span>${chapter.levelCode} · ${escapeHTML(chapter.subtitle)} · ${studioSession.stationIndex + 1}/6</span><b>${escapeHTML(chapter.title)}</b></div>
          <p>${escapeHTML(station.short)} · ${completion.percent}%</p>
          <button class="studio-print" type="button" data-action="print">인쇄</button>
        </header>
        <div class="studio-progress"><i style="width:${((studioSession.stationIndex + 1) / engine.STATIONS.length) * 100}%"></i></div>
        <div class="studio-shell">
          <aside class="studio-sidebar"><div class="module-identity"><p>MODULE</p><strong>${chapter.levelCode}.${data.getByLevel(chapter.levelCode).indexOf(chapter) + 1}</strong><span>${escapeHTML(chapter.title)}</span></div>${studioRailHTML(chapter, progress)}<div class="studio-ratio"><span><b>6</b> 설계 단계</span><span><b>${engine.flattenExercises(chapter).length}</b> 수행 문장</span></div></aside>
          <main class="studio-reader">${renderStudioStation(chapter, progress)}<nav class="station-nav"><button type="button" data-action="select-station" data-index="${studioSession.stationIndex - 1}" ${studioSession.stationIndex === 0 ? "disabled" : ""}>← 이전 단계</button><span><b>${String(studioSession.stationIndex + 1).padStart(2, "0")}</b>${escapeHTML(station.label)}</span><button type="button" data-action="select-station" data-index="${studioSession.stationIndex + 1}" ${studioSession.stationIndex === engine.STATIONS.length - 1 ? "disabled" : ""}>다음 단계 →</button></nav></main>
          <aside class="studio-inspector"><p class="micro-label">MODULE INTENT</p><h2>${escapeHTML(chapter.guide.essentialQuestion)}</h2><section><span>결정 규칙</span><p>${escapeHTML(chapter.guide.decisionRule)}</p></section><section><span>한국어 관점</span><p>${escapeHTML(chapter.guide.koreanLens)}</p></section><div class="inspector-meter"><b>${completion.visited}/6</b><span>확인한 단계</span><i><u style="width:${completion.percent}%"></u></i></div></aside>
        </div>
      </section>`;
  }

  function startChapterPractice() {
    if (!studioSession) return;
    const chapter = studioSession.chapter;
    const completion = engine.stationCompletion(getProgress(chapter.id));
    if (!completion.complete) {
      const missingIndex = engine.STATIONS.findIndex((station) => !getProgress(chapter.id).visitedStations.includes(station.id));
      selectStudioStation(Math.max(0, missingIndex));
      return;
    }
    const items = engine.shuffle(engine.flattenExercises(chapter));
    startPractice({ mode: "chapter", items, originChapterId: chapter.id });
  }

  function startReview() {
    const count = state.goalMinutes <= 10 ? 5 : state.goalMinutes <= 15 ? 7 : 10;
    const items = engine.buildReviewSession(data.getAll(), state.progress, count);
    if (!items.length) return;
    startPractice({ mode: "review", items, originChapterId: null });
  }

  function startPractice({ mode, items, originChapterId }) {
    practiceSession = {
      mode,
      items,
      originChapterId,
      index: 0,
      responses: [],
      itemState: null
    };
    preparePracticeItem();
    currentView = "practice";
    history.pushState({ view: "practice" }, "", "#practice");
    render();
  }

  function preparePracticeItem() {
    if (!practiceSession) return;
    const exercise = practiceSession.items[practiceSession.index];
    const tokenPool = exercise.type === "arrange"
      ? engine.shuffle(exercise.tokens.map((text, index) => ({ id: `${index}`, text })))
      : [];
    practiceSession.itemState = {
      answered: false,
      correct: false,
      response: "",
      hintShown: false,
      startedAt: Date.now(),
      tokenPool,
      builtTokens: []
    };
  }

  function currentExercise() {
    return practiceSession?.items[practiceSession.index] || null;
  }

  function exerciseHint(exercise) {
    if (exercise.hint) return exercise.hint;
    if (exercise.type === "correction") return `수정할 범위: ${exercise.underlineTarget}`;
    if (exercise.type === "arrange") return `영어 문장은 보통 주어와 동사부터 골격을 세웁니다. 첫 단어 후보: ${exercise.tokens.find((token) => /^[A-Z]/.test(token)) || exercise.tokens[0]}`;
    if (exercise.type === "input") return `기본형 ${exercise.baseWord || ""}을 문장의 시제와 역할에 맞게 바꾸세요.`;
    return "정답의 모양보다 이 단원의 결정 규칙을 먼저 떠올리세요.";
  }

  function correctAnswerText(exercise) {
    if (exercise.type === "choice") return exercise.options[exercise.answer];
    return exercise.answer;
  }

  function exerciseExplanation(exercise) {
    if (exercise.explanation) return exercise.explanation;
    if (exercise.type === "arrange") {
      return `정답은 “${exercise.answer}”입니다. 주어와 동사로 골격을 세운 뒤 목적어·보어와 수식어를 연결하세요.`;
    }
    if (exercise.type === "correction") {
      return `밑줄 친 “${exercise.underlineTarget}”을 “${exercise.answer}”으로 바꾸면 이 단원의 결정 규칙에 맞습니다.`;
    }
    if (exercise.type === "input") {
      return `기본형을 문장 안의 시제와 역할에 맞춰 “${exercise.answer}”으로 바꿉니다.`;
    }
    return `정답은 “${correctAnswerText(exercise)}”입니다. 형태를 고르기 전에 이 단원의 결정 규칙을 다시 적용해 보세요.`;
  }

  function renderExerciseControl(exercise, itemState) {
    if (exercise.type === "choice") {
      return `<div class="choice-grid">${exercise.options.map((option, index) => { const selected = String(itemState.response) === String(index); const correct = itemState.answered && index === exercise.answer; const wrong = itemState.answered && selected && !correct; return `<button type="button" data-action="answer-choice" data-index="${index}" class="${correct ? "is-correct" : wrong ? "is-wrong" : selected ? "is-selected" : ""}" ${itemState.answered ? "disabled" : ""}><span>${String(index + 1).padStart(2, "0")}</span><b>${escapeHTML(option)}</b></button>`; }).join("")}</div>`;
    }
    if (exercise.type === "arrange") {
      return `<div class="arrange-workbench"><div class="built-sentence ${itemState.answered ? (itemState.correct ? "is-correct" : "is-wrong") : ""}">${itemState.builtTokens.length ? itemState.builtTokens.map((token) => `<button type="button" data-action="remove-token" data-token="${token.id}" ${itemState.answered ? "disabled" : ""}>${escapeHTML(token.text)}</button>`).join("") : `<span>단어 조각을 눌러 문장을 조립하세요.</span>`}</div><div class="token-pool">${itemState.tokenPool.map((token) => `<button type="button" data-action="add-token" data-token="${token.id}" ${itemState.answered ? "disabled" : ""}>${escapeHTML(token.text)}</button>`).join("")}</div></div>`;
    }
    const source = exercise.type === "correction"
      ? `<p class="source-sentence">${highlightedSentence(exercise.source, exercise.underlineTarget)}</p>`
      : "";
    return `${source}<label class="answer-field"><span>${exercise.type === "correction" ? "고친 표현 또는 완성 문장" : "정답 입력"}</span><input id="practice-answer" type="text" value="${escapeAttribute(itemState.response)}" autocomplete="off" autocapitalize="off" spellcheck="false" ${itemState.answered ? "disabled" : ""} placeholder="직접 입력하세요"></label>`;
  }

  function renderPractice() {
    if (!practiceSession) return renderToday();
    const exercise = currentExercise();
    const itemState = practiceSession.itemState;
    const percent = ((practiceSession.index + (itemState.answered ? 1 : 0)) / practiceSession.items.length) * 100;
    return `
      <section class="practice-view">
        <header class="practice-topbar"><button type="button" data-action="exit-practice" aria-label="연습 종료">×</button><div><span>${practiceSession.mode === "review" ? "SPACED REVIEW" : "PERFORMANCE CHECK"}</span><b>${practiceSession.index + 1} / ${practiceSession.items.length}</b></div><p>${exercise.level} · ${escapeHTML(exercise.chapterTitle)}</p></header>
        <div class="practice-progress"><i style="width:${percent}%"></i></div>
        <main class="practice-stage">
          <article class="exercise-sheet">
            <header><span>${escapeHTML(exercise.modeLabel)}</span><b>${exercise.level} / ${String(practiceSession.index + 1).padStart(2, "0")}</b></header>
            <p class="exercise-label">${exercise.type === "arrange" ? "KOREAN → ENGLISH" : exercise.type === "correction" ? "DEBUG THE SENTENCE" : "APPLY THE RULE"}</p>
            <h1>${richQuestion(exercise.prompt)}</h1>
            ${renderExerciseControl(exercise, itemState)}
            ${itemState.answered ? `<section class="answer-feedback ${itemState.correct ? "is-correct" : "is-wrong"}"><span>${itemState.correct ? "STRUCTURE HOLDS" : "REPAIR NEEDED"}</span><h2>${itemState.correct ? "구조가 정확합니다." : `정답: ${escapeHTML(correctAnswerText(exercise))}`}</h2><p>${escapeHTML(exerciseExplanation(exercise))}</p><button class="primary-action" type="button" data-action="practice-next">${practiceSession.index === practiceSession.items.length - 1 ? "결과 보기" : "다음 문장"}</button></section>` : `<footer class="practice-tools"><button type="button" data-action="show-hint" ${itemState.hintShown ? "disabled" : ""}>${itemState.hintShown ? escapeHTML(exerciseHint(exercise)) : "힌트 한 줄"}</button>${exercise.type === "choice" ? `<span>선택하면 바로 근거를 확인합니다.</span>` : `<button class="check-answer" type="button" data-action="check-answer" ${exercise.type === "arrange" && !itemState.builtTokens.length ? "disabled" : ""}>문장 검사</button>`}</footer>`}
          </article>
          <aside class="practice-context"><p class="micro-label">REFERENCE</p><h2>${escapeHTML(data.getChapter(exercise.chapterId)?.guide.decisionRule || "형태보다 먼저 의미와 문장 자리를 확인하세요.")}</h2><dl><div><dt>유형</dt><dd>${escapeHTML(exercise.modeLabel)}</dd></div><div><dt>힌트</dt><dd>${itemState.hintShown ? "사용" : "미사용"}</dd></div><div><dt>근거</dt><dd>정확도 + 속도</dd></div></dl></aside>
        </main>
      </section>`;
  }

  function submitPractice(response) {
    if (!practiceSession || practiceSession.itemState.answered) return;
    const exercise = currentExercise();
    const itemState = practiceSession.itemState;
    const correct = engine.isAnswerCorrect(exercise, response);
    itemState.answered = true;
    itemState.correct = correct;
    itemState.response = String(response ?? "");
    const elapsed = Math.max(250, Date.now() - itemState.startedAt);
    const attempt = {
      id: `${exercise.id}-${Date.now()}`,
      exerciseId: exercise.id,
      chapterId: exercise.chapterId,
      chapterTitle: exercise.chapterTitle,
      level: exercise.level,
      modeLabel: exercise.modeLabel,
      type: exercise.type,
      correct,
      response: itemState.response,
      hint: itemState.hintShown,
      responseMs: elapsed,
      at: Date.now()
    };
    practiceSession.responses.push(attempt);
    state.attemptLog.push(attempt);
    state.attemptLog = state.attemptLog.slice(-MAX_ATTEMPT_LOG);
    saveState();
    if (correct && state.soundEnabled) speak(correctAnswerText(exercise));
    render();
  }

  function practiceNext() {
    if (!practiceSession?.itemState.answered) return;
    if (practiceSession.index >= practiceSession.items.length - 1) {
      finishPractice();
      return;
    }
    practiceSession.index += 1;
    preparePracticeItem();
    render();
  }

  function finishPractice() {
    const responses = [...practiceSession.responses];
    const grouped = responses.reduce((groups, attempt) => {
      (groups[attempt.chapterId] ||= []).push(attempt);
      return groups;
    }, {});
    const schedules = [];
    Object.entries(grouped).forEach(([chapterId, attempts]) => {
      const result = engine.scheduleSession(getProgress(chapterId), {
        total: attempts.length,
        correct: attempts.filter((attempt) => attempt.correct).length,
        hints: attempts.filter((attempt) => attempt.hint).length,
        averageResponseMs: Math.round(attempts.reduce((sum, attempt) => sum + attempt.responseMs, 0) / attempts.length)
      });
      setProgress(chapterId, result.progress);
      schedules.push({ chapter: data.getChapter(chapterId), ...result });
    });
    recordStudyDay();
    saveState();
    resultSession = {
      mode: practiceSession.mode,
      originChapterId: practiceSession.originChapterId,
      responses,
      schedules,
      total: responses.length,
      correct: responses.filter((attempt) => attempt.correct).length,
      hints: responses.filter((attempt) => attempt.hint).length
    };
    practiceSession = null;
    currentView = "result";
    history.replaceState({ view: "result" }, "", "#result");
    render();
  }

  function renderResult() {
    if (!resultSession) return renderToday();
    const accuracy = resultSession.total ? Math.round((resultSession.correct / resultSession.total) * 100) : 0;
    const primary = resultSession.schedules[0];
    const wrong = resultSession.responses.filter((attempt) => !attempt.correct);
    const verdict = primary?.verdict || (accuracy >= 80 ? "growing" : "repair");
    return `
      <section class="result-view">
        <header class="result-hero state-${verdict}"><p class="micro-label">SESSION EVIDENCE</p><span>${engine.verdictLabel(verdict)}</span><h1>${accuracy}<small>%</small></h1><p>${accuracy >= 80 ? "형태와 의미가 연결되고 있습니다. 다음 간격에서 다시 확인합니다." : "틀린 문장을 원리 단계와 연결해 한 번 더 수리해야 합니다."}</p></header>
        <section class="result-metrics"><div><span>정답</span><b>${resultSession.correct}<small>/${resultSession.total}</small></b></div><div><span>힌트 사용</span><b>${resultSession.hints}<small>회</small></b></div><div><span>다음 복습</span><b>${primary ? engine.formatInterval(primary.intervalMs) : "-"}<small>후</small></b></div><div><span>현재 숙련</span><b>${primary?.progress.mastery ?? 0}<small>/5</small></b></div></section>
        ${wrong.length ? `<section class="result-repairs"><header><p class="micro-label">REPAIR NOTES</p><h2>다시 볼 오류 근거</h2></header>${wrong.map((attempt, index) => { const sourceExercise = data.getChapter(attempt.chapterId) ? engine.flattenExercises(data.getChapter(attempt.chapterId)).find((item) => item.id === attempt.exerciseId) : null; return `<div><span>${String(index + 1).padStart(2, "0")}</span><p><b>${escapeHTML(attempt.chapterTitle)}</b><small>${escapeHTML(sourceExercise ? exerciseExplanation(sourceExercise) : "결정 규칙을 다시 확인하세요.")}</small></p></div>`; }).join("")}</section>` : `<section class="result-clean"><span>NO REPAIR NOTES</span><h2>모든 문장의 구조가 유지됐습니다.</h2></section>`}
        <footer class="result-actions"><button class="primary-action" type="button" data-action="navigate" data-route="today">오늘 설계로</button>${resultSession.originChapterId ? `<button class="text-action" type="button" data-action="start-studio" data-chapter="${resultSession.originChapterId}">단원 다시 보기</button>` : `<button class="text-action" type="button" data-action="navigate" data-route="review">복습 큐 보기</button>`}</footer>
      </section>`;
  }

  function speak(text) {
    if (!state.soundEnabled || !("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = "en-US";
    utterance.rate = 0.88;
    window.speechSynthesis.speak(utterance);
  }

  function setActiveLevel(level) {
    if (!engine.LEVELS.includes(level)) return;
    state.activeLevel = level;
    courseLevel = level;
    saveState();
    render();
  }

  function openSettings() {
    document.getElementById("goal-minutes").value = String(state.goalMinutes);
    document.getElementById("sound-enabled").checked = state.soundEnabled;
    settingsDialog.showModal();
  }

  function requestReset(button) {
    if (!resetArmed) {
      resetArmed = true;
      button.classList.add("is-armed");
      button.textContent = "한 번 더 눌러 삭제";
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        resetArmed = false;
        button.classList.remove("is-armed");
        button.textContent = "초기화";
      }, 4500);
      return;
    }
    clearTimeout(resetTimer);
    state = { ...defaultState(), migrationComplete: true };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    currentView = "onboarding";
    studioSession = null;
    practiceSession = null;
    resultSession = null;
    resetArmed = false;
    settingsDialog.close();
    history.replaceState({ view: "onboarding" }, "", "#start");
    render();
  }

  function updateCourseSearch(value) {
    courseQuery = value;
    const ledger = document.getElementById("course-ledger");
    const count = document.getElementById("course-count");
    if (ledger) ledger.innerHTML = courseRowsHTML();
    if (count) count.textContent = `${data.search(courseQuery, courseLevel).length}개 모듈`;
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;

    if (action === "begin-a1") {
      state.onboarded = true;
      state.activeLevel = "A1";
      courseLevel = "A1";
      saveState();
      routeTo("today");
    }
    if (action === "browse-course") {
      state.onboarded = true;
      saveState();
      routeTo("course");
    }
    if (action === "go-home") routeTo(state.onboarded ? "today" : "onboarding");
    if (action === "navigate") routeTo(target.dataset.route);
    if (action === "set-active-level") setActiveLevel(target.dataset.level);
    if (action === "set-course-level") {
      courseLevel = target.dataset.level;
      courseQuery = "";
      render();
    }
    if (action === "start-studio") beginStudio(target.dataset.chapter);
    if (action === "select-station") selectStudioStation(target.dataset.index);
    if (action === "select-formula" && studioSession) {
      studioSession.formulaIndex = Number(target.dataset.index) || 0;
      render();
    }
    if (action === "select-token" && studioSession) {
      studioSession.tokenIndex = Number(target.dataset.index) || 0;
      render();
    }
    if (action === "select-syntax" && studioSession) {
      studioSession.syntaxIndex = Number(target.dataset.index) || 0;
      studioSession.tokenIndex = 0;
      render();
    }
    if (action === "reveal-repair" && studioSession) {
      studioSession.repairRevealed.add(Number(target.dataset.index));
      render();
    }
    if (action === "reveal-check" && studioSession) {
      studioSession.checkRevealed.add(Number(target.dataset.index));
      render();
    }
    if (action === "start-chapter-practice") startChapterPractice();
    if (action === "start-review") startReview();
    if (action === "answer-choice") submitPractice(target.dataset.index);
    if (action === "show-hint" && practiceSession) {
      practiceSession.itemState.hintShown = true;
      render();
    }
    if (action === "add-token" && practiceSession && !practiceSession.itemState.answered) {
      const index = practiceSession.itemState.tokenPool.findIndex((token) => token.id === target.dataset.token);
      if (index >= 0) practiceSession.itemState.builtTokens.push(practiceSession.itemState.tokenPool.splice(index, 1)[0]);
      render();
    }
    if (action === "remove-token" && practiceSession && !practiceSession.itemState.answered) {
      const index = practiceSession.itemState.builtTokens.findIndex((token) => token.id === target.dataset.token);
      if (index >= 0) practiceSession.itemState.tokenPool.push(practiceSession.itemState.builtTokens.splice(index, 1)[0]);
      render();
    }
    if (action === "check-answer" && practiceSession) {
      const exercise = currentExercise();
      const response = exercise.type === "arrange"
        ? practiceSession.itemState.builtTokens.map((token) => token.text).join(" ")
        : document.getElementById("practice-answer")?.value || "";
      submitPractice(response);
    }
    if (action === "practice-next") practiceNext();
    if (action === "exit-practice") {
      if (practiceSession?.originChapterId) beginStudio(practiceSession.originChapterId);
      else routeTo("review");
    }
    if (action === "speak") speak(target.dataset.text);
    if (action === "print") window.print();
    if (action === "open-settings") openSettings();
    if (action === "request-reset") requestReset(target);
  });

  document.addEventListener("input", (event) => {
    if (event.target.id === "course-search") updateCourseSearch(event.target.value);
    if (event.target.id === "transfer-draft") {
      const chapterId = event.target.dataset.chapter;
      if (data.getChapter(chapterId)) {
        state.drafts[chapterId] = event.target.value.slice(0, 1200);
        saveState();
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (currentView === "practice" && event.key === "Enter" && practiceSession && !practiceSession.itemState.answered) {
      const exercise = currentExercise();
      if (exercise.type !== "choice") {
        event.preventDefault();
        const response = exercise.type === "arrange"
          ? practiceSession.itemState.builtTokens.map((token) => token.text).join(" ")
          : document.getElementById("practice-answer")?.value || "";
        if (response) submitPractice(response);
      }
    }
  });

  settingsDialog.addEventListener("change", (event) => {
    if (event.target.dataset.setting === "goalMinutes") state.goalMinutes = Number(event.target.value);
    if (event.target.dataset.setting === "soundEnabled") state.soundEnabled = event.target.checked;
    saveState();
    if (currentView === "today" || currentView === "review") render();
  });

  settingsDialog.addEventListener("close", () => {
    resetArmed = false;
    clearTimeout(resetTimer);
    const button = settingsDialog.querySelector("[data-action='request-reset']");
    if (button) {
      button.classList.remove("is-armed");
      button.textContent = "초기화";
    }
  });

  window.addEventListener("popstate", (event) => {
    const hash = location.hash.replace(/^#/, "");
    if (hash.startsWith("studio-")) {
      beginStudio(hash.replace("studio-", ""), { push: false });
      return;
    }
    const view = event.state?.view || hash;
    if (["today", "course", "review", "records"].includes(view)) {
      currentView = view;
      studioSession = null;
      practiceSession = null;
      resultSession = null;
      render();
    }
  });

  function boot() {
    if (state.onboarded) {
      const hash = location.hash.replace(/^#/, "");
      if (hash.startsWith("studio-")) {
        beginStudio(hash.replace("studio-", ""), { push: false });
        return;
      }
      if (["today", "course", "review", "records"].includes(hash)) currentView = hash;
      else history.replaceState({ view: "today" }, "", "#today");
    } else {
      currentView = "onboarding";
      history.replaceState({ view: "onboarding" }, "", "#start");
    }
    render();
  }

  boot();
})();
