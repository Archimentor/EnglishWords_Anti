(function () {
  "use strict";

  const curriculum = window.GRAMMAR_CURRICULUM || [];
  const levels = window.GRAMMAR_LEVELS || [];
  const lessonLibrary = window.GRAMMAR_LESSONS || {};
  const engine = window.GrammarEngine;
  const STORAGE_KEY = "grammar-lab-a1-c1-v3";
  const LESSON_SECTIONS = [
    { id: "overview", label: "강의 안내" },
    { id: "concept", label: "핵심 개념" },
    { id: "form", label: "형태 변화" },
    { id: "usage", label: "쓰는 상황" },
    { id: "contrast", label: "한국어와 비교" },
    { id: "walkthrough", label: "문장 해설" },
    { id: "summary", label: "오류와 정리" }
  ];
  const app = document.getElementById("app");
  const header = document.getElementById("site-header");
  const nav = document.querySelector(".main-nav");
  const dueStatus = document.getElementById("due-status");
  const settingsDialog = document.getElementById("settings-dialog");
  const goalSelect = document.getElementById("goal-minutes");
  const soundCheckbox = document.getElementById("sound-enabled");

  function defaultState() {
    return {
      version: 3,
      onboarded: false,
      activeLevel: "A1",
      goalMinutes: 10,
      soundEnabled: true,
      streak: 0,
      lastActiveDate: null,
      totalSentences: 0,
      progress: {},
      lessonProgress: {},
      attemptLog: []
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return saved ? {
        ...defaultState(),
        ...saved,
        progress: saved.progress || {},
        lessonProgress: saved.lessonProgress || {},
        attemptLog: saved.attemptLog || []
      } : defaultState();
    } catch (error) {
      return defaultState();
    }
  }

  let state = loadState();
  let currentView = state.onboarded ? "today" : "onboarding";
  let diagnosticSession = null;
  let diagnosticResult = null;
  let lessonSession = null;
  let practiceSession = null;
  let resultSession = null;
  let mapLevel = state.activeLevel;
  let resetArmed = false;
  let resetTimer = null;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function activateToday() {
    const today = dateKey();
    if (state.lastActiveDate === today) return;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    state.streak = state.lastActiveDate === dateKey(yesterday) ? state.streak + 1 : 1;
    state.lastActiveDate = today;
  }

  function getTopic(topicId) {
    return curriculum.find((topic) => topic.id === topicId);
  }

  function getLevel(levelId) {
    return levels.find((level) => level.id === levelId) || levels[0];
  }

  function getProgress(topicId) {
    return engine.ensureProgress(state.progress[topicId]);
  }

  function getLessonProgress(topicId) {
    const saved = state.lessonProgress[topicId] || {};
    return {
      visited: Array.isArray(saved.visited) ? saved.visited : [],
      lastStep: Number.isInteger(saved.lastStep) ? saved.lastStep : 0,
      openedAt: saved.openedAt || null,
      completedAt: saved.completedAt || null
    };
  }

  function lessonPercent(topicId) {
    const progress = getLessonProgress(topicId);
    return Math.round(progress.visited.length / LESSON_SECTIONS.length * 100);
  }

  function lessonStatus(topicId) {
    const progress = getLessonProgress(topicId);
    if (progress.completedAt) return "개념 완료";
    if (progress.visited.length) return `${progress.visited.length}/${LESSON_SECTIONS.length} 학습`;
    return "미학습";
  }

  function getLevelLearningSummary(levelId) {
    const topics = curriculum.filter((topic) => topic.level === levelId);
    const completed = topics.filter((topic) => getLessonProgress(topic.id).completedAt).length;
    const visitedSections = topics.reduce((sum, topic) => sum + getLessonProgress(topic.id).visited.length, 0);
    const totalSections = topics.length * LESSON_SECTIONS.length;
    return {
      total: topics.length,
      completed,
      percent: totalSections ? Math.round(visitedSections / totalSections * 100) : 0
    };
  }

  function buildLearningQueue(levelId) {
    const limit = state.goalMinutes <= 5 ? 1 : state.goalMinutes <= 10 ? 2 : 3;
    const topics = curriculum.filter((topic) => topic.level === levelId);
    return [...topics]
      .sort((left, right) => {
        const a = getLessonProgress(left.id);
        const b = getLessonProgress(right.id);
        if (Boolean(a.completedAt) !== Boolean(b.completedAt)) return a.completedAt ? 1 : -1;
        if (a.visited.length !== b.visited.length) return b.visited.length - a.visited.length;
        return topics.indexOf(left) - topics.indexOf(right);
      })
      .slice(0, limit);
  }

  function dueTopics(now = Date.now()) {
    return curriculum.filter((topic) => {
      const progress = state.progress[topic.id];
      return progress && progress.nextDue && progress.nextDue <= now;
    });
  }

  function formatDue(timestamp) {
    if (!timestamp) return "미확인";
    const difference = timestamp - Date.now();
    if (difference <= 0) return "지금 복습";
    return `${engine.formatInterval(difference)} 뒤`;
  }

  function masteryLabel(progress) {
    if (!progress.attempts) return "NEW";
    if (progress.mastery >= 4) return "STABLE";
    if (progress.nextDue && progress.nextDue <= Date.now()) return "DUE";
    if (progress.mastery >= 2) return "GROWING";
    return "REPAIR";
  }

  function correctAnswerOf(exercise) {
    return exercise.type === "input" ? exercise.answers[0] : exercise.answer;
  }

  function updateHeader() {
    const isOnboarding = !state.onboarded && ["onboarding", "diagnostic", "diagnostic-result"].includes(currentView);
    header.classList.toggle("is-onboarding", isOnboarding);
    nav.hidden = isOnboarding;
    dueStatus.hidden = isOnboarding;
    dueStatus.textContent = `복습 ${dueTopics().length}`;
    document.querySelectorAll("[data-nav]").forEach((button) => {
      const selected = button.dataset.nav === currentView;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-current", selected ? "page" : "false");
    });
  }

  function render() {
    updateHeader();
    const renderer = {
      onboarding: renderOnboarding,
      diagnostic: renderDiagnostic,
      "diagnostic-result": renderDiagnosticResult,
      today: renderToday,
      map: renderMap,
      notebook: renderNotebook,
      lesson: renderLesson,
      practice: renderPractice,
      result: renderResult
    }[currentView] || renderToday;
    app.innerHTML = renderer();
    app.focus({ preventScroll: true });
  }

  function renderOnboarding() {
    return `
      <section class="onboarding-view">
        <div class="onboarding-copy">
          <p class="micro-label">A1 → C1 · CONCEPT TEXTBOOK</p>
          <h1>문제를 풀기 전에<br><em>문법을 이해하세요.</em></h1>
          <p class="onboarding-lead">한 단원의 85%는 개념 교재입니다. 왜 쓰는지부터 형태 변화, 한국어와의 차이, 문장 해설까지 충분히 배운 뒤 마지막 15%만 연습합니다.</p>
          <div class="onboarding-actions">
            <button class="primary-button" type="button" data-action="skip-diagnostic">A1 개념 학습 시작</button>
            <button class="text-button" type="button" data-action="start-diagnostic">선택 · 10문장 수준 진단</button>
          </div>
          <p class="privacy-note">로그인 없음 · 학습 기록은 이 브라우저에만 저장</p>
        </div>

        <div class="sentence-poster" aria-label="문장 교정 예시">
          <div class="poster-index">05 / GRAMMAR LAB</div>
          <div class="poster-sentence poster-wrong">
            She <span>go</span> to school every day.
            <i aria-hidden="true">주어 확인</i>
          </div>
          <div class="correction-arrow" aria-hidden="true">↓</div>
          <div class="poster-sentence poster-right">
            She <span>goes</span> to school every day.
          </div>
          <div class="syntax-track" aria-hidden="true">
            <span>주어 she</span><span>반복 현재</span><span>동사 go</span><span>3인칭 -s</span>
          </div>
          <p>정답보다 먼저<br>문장이 작동하는 이유를 배웁니다.</p>
        </div>

        <div class="level-ribbon" aria-label="학습 수준">
          ${levels.map((level) => `<span><b>${level.id}</b>${escapeHTML(level.name)}</span>`).join("")}
        </div>
      </section>
    `;
  }

  function startDiagnostic() {
    diagnosticSession = {
      items: engine.getDiagnosticItems(curriculum),
      index: 0,
      results: [],
      answered: false,
      response: null,
      correct: false,
      startedAt: Date.now()
    };
    currentView = "diagnostic";
    render();
  }

  function renderDiagnostic() {
    if (!diagnosticSession) return renderOnboarding();
    const item = diagnosticSession.items[diagnosticSession.index];
    const progress = ((diagnosticSession.index + 1) / diagnosticSession.items.length) * 100;
    return `
      <section class="diagnostic-view">
        <header class="diagnostic-header">
          <button class="back-button" type="button" data-action="exit-diagnostic" aria-label="진단 나가기">←</button>
          <div class="diagnostic-meter"><span style="width:${progress}%"></span></div>
          <b>${diagnosticSession.index + 1} / ${diagnosticSession.items.length}</b>
        </header>
        <div class="diagnostic-stage">
          <p class="micro-label">${item.level} · ${escapeHTML(item.topicTitle)}</p>
          <h1>${escapeHTML(item.prompt)}</h1>
          <div class="choice-list">
            ${item.options.map((option, index) => {
              const chosen = diagnosticSession.response === option;
              const isAnswer = diagnosticSession.answered && option === item.answer;
              const isWrong = diagnosticSession.answered && chosen && !diagnosticSession.correct;
              return `<button type="button" class="choice-option ${chosen ? "is-chosen" : ""} ${isAnswer ? "is-correct" : ""} ${isWrong ? "is-wrong" : ""}" data-action="answer-diagnostic" data-value="${escapeHTML(option)}" ${diagnosticSession.answered ? "disabled" : ""}><span>0${index + 1}</span>${escapeHTML(option)}</button>`;
            }).join("")}
          </div>
          ${diagnosticSession.answered ? `
            <div class="inline-feedback ${diagnosticSession.correct ? "is-correct" : "is-wrong"}">
              <div><b>${diagnosticSession.correct ? "구조 감지 성공" : "이 구조는 학습 지도에 표시합니다"}</b><p>${escapeHTML(item.explanation)}</p></div>
              <button class="next-button" type="button" data-action="diagnostic-next">${diagnosticSession.index === diagnosticSession.items.length - 1 ? "진단 결과" : "다음 문장"}</button>
            </div>` : `<p class="keyboard-help">숫자 1–3으로도 선택할 수 있습니다.</p>`}
        </div>
      </section>
    `;
  }

  function answerDiagnostic(value) {
    if (!diagnosticSession || diagnosticSession.answered) return;
    const item = diagnosticSession.items[diagnosticSession.index];
    diagnosticSession.response = value;
    diagnosticSession.correct = engine.isAnswerCorrect(item, value);
    diagnosticSession.answered = true;
    diagnosticSession.results.push({
      topicId: item.topicId,
      level: item.level,
      correct: diagnosticSession.correct,
      responseMs: Date.now() - diagnosticSession.startedAt
    });
    render();
  }

  function advanceDiagnostic() {
    if (!diagnosticSession || !diagnosticSession.answered) return;
    if (diagnosticSession.index < diagnosticSession.items.length - 1) {
      diagnosticSession.index += 1;
      diagnosticSession.answered = false;
      diagnosticSession.response = null;
      diagnosticSession.correct = false;
      diagnosticSession.startedAt = Date.now();
      render();
      return;
    }
    diagnosticResult = engine.estimateStartLevel(diagnosticSession.results);
    currentView = "diagnostic-result";
    render();
  }

  function renderDiagnosticResult() {
    if (!diagnosticResult || !diagnosticSession) return renderOnboarding();
    const level = getLevel(diagnosticResult.level);
    const correct = diagnosticSession.results.filter((result) => result.correct).length;
    return `
      <section class="diagnostic-result-view">
        <div class="result-radar" aria-hidden="true">
          <span>${diagnosticResult.level}</span>
          ${levels.map((item, index) => `<i style="--ring:${index + 1}">${item.id}</i>`).join("")}
        </div>
        <div class="diagnostic-result-copy">
          <p class="micro-label">RANGE FOUND · ${correct}/${diagnosticSession.items.length}</p>
          <h1>${diagnosticResult.level}<small>${escapeHTML(level.name)}</small></h1>
          <p>${escapeHTML(level.caption)} 단계부터 시작합니다. 맞힌 고급 구조는 건너뛰지 않고 7일 뒤 표본 복습으로 다시 확인합니다.</p>
          <div class="level-score-lines">
            ${levels.map((item) => {
              const score = diagnosticResult.byLevel[item.id];
              const percentage = score.total ? score.correct / score.total * 100 : 0;
              return `<div><span>${item.id}</span><i><b style="width:${percentage}%"></b></i><strong>${score.correct}/${score.total}</strong></div>`;
            }).join("")}
          </div>
          <button class="primary-button" type="button" data-action="accept-diagnostic">${diagnosticResult.level} 개념 교재 열기</button>
        </div>
      </section>
    `;
  }

  function acceptDiagnostic() {
    state.activeLevel = diagnosticResult.level;
    state.progress = engine.seedDiagnosticProgress(state.progress, diagnosticSession.results);
    state.onboarded = true;
    mapLevel = state.activeLevel;
    saveState();
    currentView = "today";
    render();
  }

  function skipDiagnostic() {
    state.onboarded = true;
    state.activeLevel = "A1";
    mapLevel = "A1";
    saveState();
    currentView = "today";
    render();
  }

  function renderLevelRail() {
    return `
      <aside class="level-rail" aria-label="CEFR 문법 단계">
        <p class="micro-label">LEVEL</p>
        ${levels.map((level, index) => {
          const selected = level.id === state.activeLevel;
          const summary = getLevelLearningSummary(level.id);
          return `<button type="button" data-action="select-active-level" data-level="${level.id}" class="${selected ? "is-active" : ""}" aria-pressed="${selected}"><span>0${index + 1}</span><b>${level.id}</b><small>${summary.percent}%</small></button>`;
        }).join("")}
      </aside>
    `;
  }

  function renderToday() {
    const queue = buildLearningQueue(state.activeLevel);
    const fallback = curriculum.find((topic) => topic.level === state.activeLevel) || curriculum[0];
    const focus = queue[0] || fallback;
    const focusLearning = getLessonProgress(focus.id);
    const levelSummary = getLevelLearningSummary(state.activeLevel);
    const due = dueTopics();
    const completedLessons = Object.values(state.lessonProgress).filter((item) => item?.completedAt).length;
    const example = focus.examples[0];
    const splitPoint = Math.max(1, Math.floor(example.split(" ").length / 2));
    const words = example.split(" ");

    return `
      <section class="today-view">
        ${renderLevelRail()}
        <div class="today-workspace">
          <header class="workspace-heading">
            <div>
              <p class="micro-label">TODAY'S TEXTBOOK · ${state.goalMinutes} MIN</p>
              <h1>오늘 배울<br>문법 개념</h1>
            </div>
            <div class="workspace-count"><b>${levelSummary.completed}</b><span>/ ${levelSummary.total}<br>강의 완료</span></div>
          </header>

          <article class="focus-board">
            <div class="focus-meta">
              <span>${focus.level} · ${escapeHTML(focus.category)}</span>
              <b>${lessonStatus(focus.id)}</b>
            </div>
            <p class="focus-number">${String(curriculum.indexOf(focus) + 1).padStart(2, "0")}</p>
            <h2>${escapeHTML(focus.title)}</h2>
            <p class="focus-en">${escapeHTML(focus.titleEn)}</p>
            <div class="focus-sentence" aria-label="예시 문장">
              <span>${escapeHTML(words.slice(0, splitPoint).join(" "))}</span>
              <strong>${escapeHTML(words.slice(splitPoint).join(" "))}</strong>
            </div>
            <p class="focus-summary">${escapeHTML(focus.summary)}</p>
            <button class="primary-button" type="button" data-action="start-topic" data-topic="${focus.id}">${focusLearning.visited.length ? "개념 학습 이어가기" : "개념부터 학습하기"}</button>
          </article>

          <div class="today-evidence">
            <div><span>완료한 강의</span><b>${completedLessons}</b></div>
            <div><span>연속 학습</span><b>${state.streak}<small>일</small></b></div>
            <div><span>학습 비중</span><b>85<small>% 교재</small></b></div>
          </div>
        </div>

        <aside class="today-queue">
          <header>
            <div><p class="micro-label">READING QUEUE</p><h2>오늘 읽을 강의</h2></div>
            <span>${queue.length}개 개념</span>
          </header>
          <ol>
            ${queue.map((topic, index) => {
              const progress = getLessonProgress(topic.id);
              return `<li><button type="button" data-action="start-topic" data-topic="${topic.id}"><span>0${index + 1}</span><div><b>${escapeHTML(topic.title)}</b><small>${topic.level} · 교재 ${progress.visited.length}/${LESSON_SECTIONS.length}</small></div><i>→</i></button></li>`;
            }).join("")}
          </ol>
          <div class="review-callout">
            <p>${due.length ? `개념 학습 뒤 확인할 문장 ${due.length}개가 있습니다.` : "문장 연습은 개념 학습 뒤 선택할 수 있습니다."}</p>
            <button type="button" data-action="start-review" ${due.length ? "" : "disabled"}>선택 연습 ${due.length ? "시작" : "대기"}</button>
          </div>
        </aside>
      </section>
    `;
  }

  function renderMap() {
    const level = getLevel(mapLevel);
    const topics = curriculum.filter((topic) => topic.level === mapLevel);
    const summary = getLevelLearningSummary(mapLevel);
    return `
      <section class="map-view">
        <header class="map-header">
          <div><p class="micro-label">GRAMMAR TEXTBOOK · 40 CHAPTERS</p><h1>문법 교재</h1><p>문제를 풀기 전에 필요한 개념 강의를 골라 차례대로 학습합니다.</p></div>
          <div class="map-level-score"><b>${summary.percent}%</b><span>${mapLevel} 교재 학습 진도</span></div>
        </header>
        <div class="map-level-tabs" role="tablist" aria-label="문법 수준">
          ${levels.map((item) => `<button type="button" role="tab" aria-selected="${item.id === mapLevel}" class="${item.id === mapLevel ? "is-active" : ""}" data-action="select-map-level" data-level="${item.id}"><b>${item.id}</b><span>${escapeHTML(item.name)}</span></button>`).join("")}
        </div>
        <div class="map-level-intro">
          <p>LEVEL ${mapLevel}</p><h2>${escapeHTML(level.caption)}</h2><span>${summary.completed}/${summary.total} 강의 완료</span>
        </div>
        <div class="topic-ledger">
          ${topics.map((topic, index) => {
            const percent = lessonPercent(topic.id);
            const status = lessonStatus(topic.id);
            return `
              <button type="button" class="topic-row" data-action="start-topic" data-topic="${topic.id}">
                <span class="topic-index">${mapLevel}.${index + 1}</span>
                <div class="topic-name"><b>${escapeHTML(topic.title)}</b><small>${escapeHTML(topic.titleEn)}</small></div>
                <span class="topic-category">${escapeHTML(topic.category)}</span>
                <i class="topic-progress"><b style="width:${percent}%"></b></i>
                <strong class="topic-state state-learning">${status}</strong>
                <span class="row-arrow">→</span>
              </button>`;
          }).join("")}
        </div>
      </section>
    `;
  }

  function renderNotebook() {
    const summary = Object.fromEntries(levels.map((level) => [level.id, getLevelLearningSummary(level.id)]));
    const errorProfile = engine.getErrorProfile(state.attemptLog, 5);
    const recent = [...state.attemptLog].slice(-8).reverse();
    const totalCorrect = state.attemptLog.filter((attempt) => attempt.correct).length;
    const accuracy = state.attemptLog.length ? Math.round(totalCorrect / state.attemptLog.length * 100) : 0;
    const totalVisited = Object.values(state.lessonProgress).reduce((sum, item) => sum + (item?.visited?.length || 0), 0);
    const totalSections = curriculum.length * LESSON_SECTIONS.length;
    const conceptPercent = totalSections ? Math.round(totalVisited / totalSections * 100) : 0;
    return `
      <section class="notebook-view">
        <header class="notebook-header">
          <div><p class="micro-label">CONCEPT PROGRESS · PRACTICE EVIDENCE</p><h1>학습 기록</h1><p>읽은 개념 강의를 중심으로 기록하고, 문제 결과는 보조 자료로 남깁니다.</p></div>
          <div class="accuracy-stamp"><b>${conceptPercent}%</b><span>전체 교재 학습 진도</span></div>
        </header>

        <div class="notebook-grid">
          <section class="level-evidence">
            <header><p class="micro-label">TEXTBOOK PROGRESS</p><h2>수준별 개념 학습</h2></header>
            ${levels.map((level) => {
              const item = summary[level.id];
              return `<div class="evidence-line"><b>${level.id}</b><span><i style="width:${item.percent}%"></i></span><strong>${item.percent}%</strong><small>${item.completed}/${item.total} 완료</small></div>`;
            }).join("")}
          </section>

          <section class="error-dna">
            <header><p class="micro-label">OPTIONAL PRACTICE · ${accuracy}%</p><h2>연습에서 나온 오류</h2></header>
            ${errorProfile.length ? errorProfile.map((item, index) => `<div class="error-line"><span>0${index + 1}</span><b>${escapeHTML(item.category)}</b><i style="--weight:${Math.min(item.count, 8)}"></i><strong>${item.count}회</strong></div>`).join("") : `<div class="empty-note"><b>아직 연습 오류가 없습니다.</b><p>개념 강의 뒤 선택 연습을 하면 오류 유형이 여기에 기록됩니다.</p></div>`}
          </section>
        </div>

        <section class="attempt-ledger">
          <header><p class="micro-label">OPTIONAL PRACTICE LOG</p><h2>최근 문장 연습</h2></header>
          ${recent.length ? `<div class="attempt-table">${recent.map((attempt) => `<div><span class="attempt-mark ${attempt.correct ? "is-correct" : "is-wrong"}">${attempt.correct ? "✓" : "×"}</span><b>${escapeHTML(attempt.topicTitle)}</b><span>${escapeHTML(attempt.category)}</span><small>${attempt.level}</small><time>${new Date(attempt.at).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}</time></div>`).join("")}</div>` : `<div class="empty-attempts">완료한 문장이 없습니다.</div>`}
        </section>
      </section>
    `;
  }

  function beginTopic(topicId) {
    const topic = getTopic(topicId);
    if (!topic) return;
    const progress = getLessonProgress(topicId);
    const firstUnread = LESSON_SECTIONS.findIndex((_, index) => !progress.visited.includes(index));
    lessonSession = {
      topic,
      lesson: getLessonData(topic),
      step: progress.completedAt ? 0 : firstUnread >= 0 ? firstUnread : Math.min(progress.lastStep, LESSON_SECTIONS.length - 1),
      formIndex: 0
    };
    visitLessonStep(lessonSession.step);
    currentView = "lesson";
    render();
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function getLessonData(topic) {
    if (lessonLibrary[topic.id]) return lessonLibrary[topic.id];
    return {
      overview: {
        title: `${topic.title}의 원리부터 이해합니다`,
        lead: topic.summary,
        why: `${topic.formula} 형태가 어떤 의미를 만들고 실제 문장에서 언제 필요한지 순서대로 살펴봅니다.`,
        outcomes: topic.rules
      },
      concepts: topic.rules.map((rule, index) => ({
        title: `핵심 원리 ${index + 1}`,
        body: rule,
        key: index === 0 ? topic.summary : `${topic.formula} 안에서 이 원리가 작동하는 위치를 확인하세요.`
      })),
      formRows: [
        { label: "핵심 형태", pattern: topic.formula, example: topic.examples[0], translation: "", note: topic.summary },
        { label: "교정 전", pattern: "형태가 어긋난 문장", example: topic.contrast.before, translation: "", note: topic.contrast.note },
        { label: "교정 후", pattern: "의미에 맞는 형태", example: topic.contrast.after, translation: "", note: topic.contrast.note }
      ],
      uses: topic.examples.map((example, index) => ({
        title: `쓰임 ${index + 1}`,
        signal: topic.category,
        body: topic.rules[index] || topic.summary,
        example,
        translation: ""
      })),
      koreanContrast: {
        title: "형태가 바뀌면 전달되는 의미도 달라집니다",
        body: topic.contrast.note,
        pairs: [{ korean: "어색하거나 의미가 다른 형태", english: topic.contrast.after, note: topic.contrast.note }]
      },
      walkthroughs: topic.examples.map((sentence, index) => ({
        sentence,
        translation: "",
        intent: topic.rules[index] || topic.summary,
        chunks: [{ text: sentence, role: "완성 문장", note: topic.summary }],
        takeaway: topic.formula
      })),
      traps: [{ wrong: topic.contrast.before, right: topic.contrast.after, why: topic.contrast.note }],
      summary: { statement: topic.summary, points: topic.rules }
    };
  }

  function visitLessonStep(step) {
    if (!lessonSession) return;
    const topicId = lessonSession.topic.id;
    const progress = getLessonProgress(topicId);
    const visited = [...new Set([...progress.visited, step])].sort((a, b) => a - b);
    state.lessonProgress[topicId] = {
      ...progress,
      visited,
      lastStep: step,
      openedAt: progress.openedAt || Date.now()
    };
    saveState();
  }

  function selectLessonStep(step) {
    if (!lessonSession) return;
    lessonSession.step = Math.max(0, Math.min(LESSON_SECTIONS.length - 1, Number(step) || 0));
    lessonSession.formIndex = 0;
    visitLessonStep(lessonSession.step);
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function completeConceptLesson() {
    if (!lessonSession) return;
    const topicId = lessonSession.topic.id;
    const progress = getLessonProgress(topicId);
    const missing = LESSON_SECTIONS.map((_, index) => index).filter((index) => !progress.visited.includes(index));
    if (missing.length) {
      selectLessonStep(missing[0]);
      return;
    }
    state.lessonProgress[topicId] = { ...progress, completedAt: progress.completedAt || Date.now() };
    activateToday();
    saveState();
    render();
  }

  function renderLesson() {
    if (!lessonSession) return renderToday();
    const topic = lessonSession.topic;
    const progress = getLessonProgress(topic.id);
    const step = lessonSession.step;
    const section = LESSON_SECTIONS[step];
    const percentage = Math.round((step + 1) / LESSON_SECTIONS.length * 100);
    return `
      <section class="lesson-view concept-lesson-view">
        <header class="lesson-topbar concept-topbar">
          <button class="back-button" type="button" data-action="exit-lesson" aria-label="오늘 학습으로 돌아가기">←</button>
          <div><span>${topic.level} · ${escapeHTML(topic.category)} · ${step + 1}/${LESSON_SECTIONS.length}</span><b>${escapeHTML(topic.title)}</b></div>
          <p>교재 85% · 연습 15%</p>
        </header>
        <div class="lesson-reading-meter"><span style="width:${percentage}%"></span></div>
        <div class="concept-course">
          <aside class="course-rail">
            <div class="course-identity">
              <p class="micro-label">CONCEPT TEXTBOOK</p>
              <strong>${topic.level}.${curriculum.filter((item) => item.level === topic.level).indexOf(topic) + 1}</strong>
              <span>${escapeHTML(topic.titleEn)}</span>
            </div>
            <nav aria-label="강의 목차">
              ${LESSON_SECTIONS.map((item, index) => `
                <button type="button" data-action="lesson-step" data-step="${index}" class="${index === step ? "is-active" : ""} ${progress.visited.includes(index) ? "is-visited" : ""}" aria-current="${index === step ? "step" : "false"}">
                  <span>${String(index + 1).padStart(2, "0")}</span><b>${item.label}</b><i>${progress.visited.includes(index) ? "읽음" : ""}</i>
                </button>`).join("")}
            </nav>
            <div class="course-ratio"><span><b>85</b>% 개념 교재</span><span><b>15</b>% 선택 연습</span></div>
          </aside>
          <div class="concept-reader">
            ${renderLessonSection(section.id, lessonSession.lesson, topic, progress)}
            <footer class="reader-navigation">
              <button type="button" data-action="lesson-step" data-step="${step - 1}" ${step === 0 ? "disabled" : ""}>← 이전 절</button>
              <span><b>${String(step + 1).padStart(2, "0")}</b>${escapeHTML(section.label)}</span>
              <button type="button" data-action="lesson-step" data-step="${step + 1}" ${step === LESSON_SECTIONS.length - 1 ? "disabled" : ""}>다음 절 →</button>
            </footer>
          </div>
          <aside class="reader-margin">
            <p class="micro-label">LEARNING GOAL</p>
            <h2>${escapeHTML(topic.title)}</h2>
            <ol>${lessonSession.lesson.overview.outcomes.map((outcome) => `<li>${escapeHTML(outcome)}</li>`).join("")}</ol>
            <div><b>${progress.visited.length}/${LESSON_SECTIONS.length}</b><span>읽은 교재 절</span></div>
          </aside>
        </div>
      </section>
    `;
  }

  function renderLessonSection(sectionId, lesson, topic, progress) {
    if (sectionId === "overview") {
      return `
        <article class="reader-section chapter-opening">
          <p class="micro-label">CHAPTER OPEN · ${topic.level}</p>
          <h1>${escapeHTML(lesson.overview.title)}</h1>
          <p class="chapter-lead">${escapeHTML(lesson.overview.lead)}</p>
          <div class="study-ratio-visual"><div><b>85%</b><span>개념을 읽고 이해하는 시간</span></div><div><b>15%</b><span>마지막 확인 연습</span></div></div>
          <section class="why-this-matters"><span>WHY</span><div><h2>왜 이 개념을 배워야 하나요?</h2><p>${escapeHTML(lesson.overview.why)}</p></div></section>
          <section class="learning-outcomes"><p class="micro-label">이 강의를 마치면</p><ol>${lesson.overview.outcomes.map((outcome, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><p>${escapeHTML(outcome)}</p></li>`).join("")}</ol></section>
        </article>`;
    }

    if (sectionId === "concept") {
      return `
        <article class="reader-section">
          <p class="micro-label">01 · CORE CONCEPT</p>
          <h1>규칙보다 먼저<br>의미를 이해합니다</h1>
          <div class="concept-explanations">${lesson.concepts.map((concept, index) => `
            <section><span>${String(index + 1).padStart(2, "0")}</span><div><h2>${escapeHTML(concept.title)}</h2><p>${escapeHTML(concept.body)}</p><blockquote>${escapeHTML(concept.key)}</blockquote></div></section>`).join("")}</div>
        </article>`;
    }

    if (sectionId === "form") {
      const active = lesson.formRows[Math.min(lessonSession.formIndex, lesson.formRows.length - 1)];
      return `
        <article class="reader-section">
          <p class="micro-label">02 · FORM SYSTEM</p>
          <h1>문장의 형태가<br>어떻게 바뀌나요?</h1>
          <p class="section-intro">각 행을 눌러 긍정문·부정문·질문의 구조와 실제 예문을 비교하세요.</p>
          <div class="form-explorer">
            <div class="form-row-list">${lesson.formRows.map((row, index) => `<button type="button" data-action="select-form-row" data-index="${index}" class="${index === lessonSession.formIndex ? "is-active" : ""}"><span>${String(index + 1).padStart(2, "0")}</span><div><b>${escapeHTML(row.label)}</b><code>${escapeHTML(row.pattern)}</code></div><i>→</i></button>`).join("")}</div>
            <div class="form-example" aria-live="polite"><p>${escapeHTML(active.label)}</p><h2>${escapeHTML(active.example)}</h2>${active.translation ? `<strong>${escapeHTML(active.translation)}</strong>` : ""}<span>${escapeHTML(active.note)}</span><button type="button" data-action="speak" data-text="${escapeHTML(active.example)}">예문 듣기</button></div>
          </div>
        </article>`;
    }

    if (sectionId === "usage") {
      return `
        <article class="reader-section">
          <p class="micro-label">03 · MEANING IN USE</p>
          <h1>언제 이 문법을<br>선택하나요?</h1>
          <p class="section-intro">형태가 맞아도 상황에 맞지 않으면 자연스러운 문장이 아닙니다. 쓰임과 시간 관점을 함께 확인하세요.</p>
          <div class="usage-ledger">${lesson.uses.map((use, index) => `<section><span>${String(index + 1).padStart(2, "0")}</span><div class="usage-copy"><p>${escapeHTML(use.signal)}</p><h2>${escapeHTML(use.title)}</h2><div>${escapeHTML(use.body)}</div></div><div class="usage-example"><b>${escapeHTML(use.example)}</b>${use.translation ? `<small>${escapeHTML(use.translation)}</small>` : ""}</div></section>`).join("")}</div>
        </article>`;
    }

    if (sectionId === "contrast") {
      return `
        <article class="reader-section">
          <p class="micro-label">04 · KOREAN → ENGLISH</p>
          <h1>${escapeHTML(lesson.koreanContrast.title)}</h1>
          <p class="section-intro">${escapeHTML(lesson.koreanContrast.body)}</p>
          <div class="language-contrast">${lesson.koreanContrast.pairs.map((pair, index) => `<section><span>${String(index + 1).padStart(2, "0")}</span><div><p>한국어 생각</p><h2>${escapeHTML(pair.korean)}</h2></div><i>→</i><div><p>영어 구조</p><h2>${escapeHTML(pair.english)}</h2><small>${escapeHTML(pair.note)}</small></div></section>`).join("")}</div>
        </article>`;
    }

    if (sectionId === "walkthrough") {
      return `
        <article class="reader-section">
          <p class="micro-label">05 · SENTENCE WALKTHROUGH</p>
          <h1>문장을 성분별로<br>천천히 해체합니다</h1>
          <div class="walkthrough-list">${lesson.walkthroughs.map((item, index) => `<section><header><span>EXAMPLE ${String(index + 1).padStart(2, "0")}</span><button type="button" data-action="speak" data-text="${escapeHTML(item.sentence)}">듣기</button></header><h2>${escapeHTML(item.sentence)}</h2>${item.translation ? `<p class="walkthrough-translation">${escapeHTML(item.translation)}</p>` : ""}<p class="walkthrough-intent">${escapeHTML(item.intent)}</p><div class="sentence-chunks">${item.chunks.map((chunk) => `<div><b>${escapeHTML(chunk.text)}</b><span>${escapeHTML(chunk.role)}</span><p>${escapeHTML(chunk.note)}</p></div>`).join("")}</div><blockquote>${escapeHTML(item.takeaway)}</blockquote></section>`).join("")}</div>
        </article>`;
    }

    const missing = LESSON_SECTIONS.map((_, index) => index).filter((index) => !progress.visited.includes(index));
    return `
      <article class="reader-section">
        <p class="micro-label">06 · ERROR CLINIC & SUMMARY</p>
        <h1>틀리는 이유까지 알아야<br>개념이 완성됩니다</h1>
        <div class="trap-ledger">${lesson.traps.map((trap, index) => `<section><span>${String(index + 1).padStart(2, "0")}</span><div><del>${escapeHTML(trap.wrong)}</del><strong>${escapeHTML(trap.right)}</strong><p>${escapeHTML(trap.why)}</p></div></section>`).join("")}</div>
        <section class="chapter-summary"><p class="micro-label">ONE PAGE MEMORY</p><h2>${escapeHTML(lesson.summary.statement)}</h2><ul>${lesson.summary.points.map((point) => `<li>${escapeHTML(point)}</li>`).join("")}</ul></section>
        <section class="concept-completion ${progress.completedAt ? "is-complete" : ""}">
          ${progress.completedAt
            ? `<div><span>✓</span><p><b>개념 강의를 완료했습니다.</b><small>이제 필요할 때만 짧은 문장 연습으로 이해를 확인하세요.</small></p></div><button class="primary-button" type="button" data-action="start-topic-practice">선택 · 3문장 확인 연습</button>`
            : missing.length
              ? `<div><span>${LESSON_SECTIONS.length - missing.length}/${LESSON_SECTIONS.length}</span><p><b>아직 읽지 않은 절이 있습니다.</b><small>점수가 아니라 개념 학습을 완료한 뒤 다음 단계로 이동합니다.</small></p></div><button class="primary-button" type="button" data-action="lesson-step" data-step="${missing[0]}">남은 교재 절 읽기</button>`
              : `<div><span>85%</span><p><b>교재 학습을 모두 읽었습니다.</b><small>문제 풀이와 별개로 이 강의를 완료 처리합니다.</small></p></div><button class="primary-button" type="button" data-action="complete-concept">개념 학습 완료</button>`}
        </section>
      </article>`;
  }

  function startTopicPractice() {
    if (!lessonSession) return;
    const topic = lessonSession.topic;
    if (!getLessonProgress(topic.id).completedAt) {
      selectLessonStep(LESSON_SECTIONS.length - 1);
      return;
    }
    practiceSession = {
      mode: "lesson",
      topic,
      items: engine.shuffle(topic.exercises),
      index: 0,
      responses: [],
      totalHints: 0,
      itemState: null
    };
    preparePracticeItem();
    currentView = "practice";
    render();
  }

  function startReview() {
    const items = engine.buildMixedReview(curriculum, state.progress, state.goalMinutes <= 5 ? 4 : state.goalMinutes <= 10 ? 6 : 8);
    if (!items.length) return;
    practiceSession = {
      mode: "review",
      topic: null,
      items,
      index: 0,
      responses: [],
      totalHints: 0,
      itemState: null
    };
    preparePracticeItem();
    currentView = "practice";
    render();
  }

  function preparePracticeItem() {
    if (!practiceSession) return;
    const exercise = practiceSession.items[practiceSession.index];
    const tokenPool = exercise.type === "arrange"
      ? engine.shuffle(exercise.tokens.map((text, index) => ({ id: `${index}-${text}`, text })))
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

  function renderPractice() {
    if (!practiceSession) return renderToday();
    const exercise = practiceSession.items[practiceSession.index];
    const itemState = practiceSession.itemState;
    const topic = practiceSession.mode === "lesson" ? practiceSession.topic : getTopic(exercise.topicId);
    const percent = ((practiceSession.index + (itemState.answered ? 1 : 0)) / practiceSession.items.length) * 100;
    const typeLabels = { choice: "맥락 선택", arrange: "문장 조립", input: "문장 변환" };
    return `
      <section class="practice-view">
        <header class="practice-header">
          <button class="back-button" type="button" data-action="exit-practice" aria-label="연습 나가기">×</button>
          <div class="practice-meter"><span style="width:${percent}%"></span></div>
          <b>${practiceSession.index + 1} / ${practiceSession.items.length}</b>
        </header>
        <div class="practice-stage">
          <div class="practice-meta"><span>${topic.level} · ${escapeHTML(topic.title)}</span><b>${typeLabels[exercise.type]}</b></div>
          <p class="micro-label">${practiceSession.mode === "review" ? "INTERLEAVED REVIEW" : "OPTIONAL CHECK · 15%"}</p>
          <h1>${escapeHTML(exercise.prompt)}</h1>
          ${exercise.cue ? `<p class="exercise-cue">${escapeHTML(exercise.cue)}</p>` : ""}
          ${renderExerciseControl(exercise, itemState)}
          ${itemState.answered ? renderPracticeFeedback(exercise, itemState, topic) : renderPracticeTools(exercise, itemState)}
        </div>
      </section>
    `;
  }

  function renderExerciseControl(exercise, itemState) {
    if (exercise.type === "choice") {
      return `<div class="choice-list practice-choices">${exercise.options.map((option, index) => {
        const chosen = itemState.response === option;
        const answer = itemState.answered && option === exercise.answer;
        const wrong = itemState.answered && chosen && !itemState.correct;
        return `<button type="button" class="choice-option ${chosen ? "is-chosen" : ""} ${answer ? "is-correct" : ""} ${wrong ? "is-wrong" : ""}" data-action="answer-practice-choice" data-value="${escapeHTML(option)}" ${itemState.answered ? "disabled" : ""}><span>0${index + 1}</span>${escapeHTML(option)}</button>`;
      }).join("")}</div>`;
    }

    if (exercise.type === "arrange") {
      return `
        <div class="sentence-builder ${itemState.answered ? (itemState.correct ? "is-correct" : "is-wrong") : ""}">
          <div class="built-line" aria-label="조립한 문장">
            ${itemState.builtTokens.length ? itemState.builtTokens.map((token) => `<button type="button" data-action="remove-token" data-token="${escapeHTML(token.id)}" ${itemState.answered ? "disabled" : ""}>${escapeHTML(token.text)}</button>`).join("") : `<span>아래 조각을 순서대로 누르세요.</span>`}
          </div>
          <div class="token-bank" aria-label="사용할 문장 조각">
            ${itemState.tokenPool.map((token) => `<button type="button" data-action="add-token" data-token="${escapeHTML(token.id)}" ${itemState.answered ? "disabled" : ""}>${escapeHTML(token.text)}</button>`).join("")}
          </div>
        </div>`;
    }

    return `
      <div class="sentence-input-wrap ${itemState.answered ? (itemState.correct ? "is-correct" : "is-wrong") : ""}">
        <label for="sentence-answer">완성 문장</label>
        <textarea id="sentence-answer" rows="2" spellcheck="false" autocomplete="off" placeholder="영어 문장을 직접 입력하세요." ${itemState.answered ? "disabled" : ""}>${escapeHTML(itemState.response)}</textarea>
      </div>`;
  }

  function renderPracticeTools(exercise, itemState) {
    return `
      <div class="practice-tools">
        ${exercise.hint ? `<button class="hint-button" type="button" data-action="show-hint" ${itemState.hintShown ? "disabled" : ""}>${itemState.hintShown ? escapeHTML(exercise.hint) : "힌트 한 줄"}</button>` : `<span></span>`}
        ${exercise.type === "arrange" ? `<button class="check-button" type="button" data-action="check-arrange" ${itemState.builtTokens.length ? "" : "disabled"}>문장 검사</button>` : ""}
        ${exercise.type === "input" ? `<button class="check-button" type="button" data-action="check-input">문장 검사</button>` : ""}
      </div>`;
  }

  function renderPracticeFeedback(exercise, itemState, topic) {
    const correctAnswer = correctAnswerOf(exercise);
    return `
      <div class="practice-feedback ${itemState.correct ? "is-correct" : "is-wrong"}">
        <div class="feedback-mark">${itemState.correct ? "✓" : "×"}</div>
        <div class="feedback-copy">
          <p>${itemState.correct ? "구조가 맞습니다" : "이 위치를 다시 연결하세요"}</p>
          <h2>${escapeHTML(correctAnswer)}</h2>
          <span>${escapeHTML(exercise.explanation)}</span>
          <div class="xray-line"><b>STRUCTURE</b><i></i><strong>${escapeHTML(topic.formula)}</strong></div>
        </div>
        <div class="feedback-actions">
          <button type="button" data-action="speak" data-text="${escapeHTML(correctAnswer)}">문장 듣기</button>
          <button class="next-button" type="button" data-action="practice-next">${practiceSession.index === practiceSession.items.length - 1 ? "결과 보기" : "다음 문장"}</button>
        </div>
      </div>`;
  }

  function showHint() {
    if (!practiceSession || practiceSession.itemState.hintShown) return;
    practiceSession.itemState.hintShown = true;
    practiceSession.totalHints += 1;
    render();
  }

  function addToken(tokenId) {
    const itemState = practiceSession?.itemState;
    if (!itemState || itemState.answered) return;
    const index = itemState.tokenPool.findIndex((token) => token.id === tokenId);
    if (index < 0) return;
    itemState.builtTokens.push(itemState.tokenPool.splice(index, 1)[0]);
    render();
  }

  function removeToken(tokenId) {
    const itemState = practiceSession?.itemState;
    if (!itemState || itemState.answered) return;
    const index = itemState.builtTokens.findIndex((token) => token.id === tokenId);
    if (index < 0) return;
    itemState.tokenPool.push(itemState.builtTokens.splice(index, 1)[0]);
    render();
  }

  function submitPractice(response) {
    if (!practiceSession || practiceSession.itemState.answered) return;
    const exercise = practiceSession.items[practiceSession.index];
    const topic = practiceSession.mode === "lesson" ? practiceSession.topic : getTopic(exercise.topicId);
    const itemState = practiceSession.itemState;
    itemState.response = response;
    itemState.correct = engine.isAnswerCorrect(exercise, response);
    itemState.answered = true;
    const evidence = {
      topicId: topic.id,
      topicTitle: topic.title,
      level: topic.level,
      category: topic.category,
      exerciseId: exercise.id,
      correct: itemState.correct,
      hintUsed: itemState.hintShown,
      responseMs: Date.now() - itemState.startedAt,
      at: Date.now(),
      mode: practiceSession.mode
    };
    practiceSession.responses.push(evidence);
    state.attemptLog.push(evidence);
    state.totalSentences += 1;
    trimAttemptLog();
    saveState();
    if (itemState.correct && state.soundEnabled) speak(correctAnswerOf(exercise));
    render();
  }

  function trimAttemptLog() {
    if (state.attemptLog.length > 300) state.attemptLog = state.attemptLog.slice(-300);
  }

  function advancePractice() {
    if (!practiceSession || !practiceSession.itemState.answered) return;
    if (practiceSession.index < practiceSession.items.length - 1) {
      practiceSession.index += 1;
      preparePracticeItem();
      render();
      return;
    }
    finishPractice();
  }

  function finishPractice() {
    activateToday();
    const now = Date.now();
    const grouped = {};
    practiceSession.responses.forEach((response) => {
      if (!grouped[response.topicId]) grouped[response.topicId] = [];
      grouped[response.topicId].push(response);
    });

    const schedules = Object.entries(grouped).map(([topicId, responses]) => {
      const result = engine.scheduleSession(state.progress[topicId], {
        total: responses.length,
        correct: responses.filter((response) => response.correct).length,
        hints: responses.filter((response) => response.hintUsed).length,
        averageResponseMs: responses.reduce((sum, response) => sum + response.responseMs, 0) / responses.length,
        mode: practiceSession.mode
      }, now);
      state.progress[topicId] = result.progress;
      return { topicId, ...result };
    });

    const totalCorrect = practiceSession.responses.filter((response) => response.correct).length;
    resultSession = {
      mode: practiceSession.mode,
      total: practiceSession.responses.length,
      correct: totalCorrect,
      hints: practiceSession.totalHints,
      schedules,
      topic: practiceSession.topic
    };
    saveState();
    currentView = "result";
    render();
  }

  function renderResult() {
    if (!resultSession) return renderToday();
    const accuracy = resultSession.total ? Math.round(resultSession.correct / resultSession.total * 100) : 0;
    const mainSchedule = resultSession.schedules[0];
    const verdictLabels = { repair: "다시 연결할 구조", reinforce: "한 번 더 굳힐 구조", growing: "형성 중인 구조", stable: "안정된 구조" };
    const nextText = resultSession.schedules.length === 1
      ? engine.formatInterval(mainSchedule.intervalMs)
      : `${resultSession.schedules.length}개 주제 개별 예약`;
    return `
      <section class="result-view">
        <div class="result-score">
          <p class="micro-label">${resultSession.mode === "review" ? "REVIEW COMPLETE" : "OPTIONAL CHECK COMPLETE"}</p>
          <b>${accuracy}<small>%</small></b>
          <span>${resultSession.correct}/${resultSession.total} 문장 정확</span>
        </div>
        <div class="result-copy">
          <p class="micro-label">NEXT EVIDENCE</p>
          <h1>${resultSession.schedules.length === 1 ? verdictLabels[mainSchedule.verdict] : "교차 복습이 정리됐습니다"}</h1>
          <p>이 결과는 개념 강의 완료와 별도로 기록됩니다. 정답, 응답 시간, 힌트 사용은 다음 선택 복습 시점만 계산합니다.</p>
          <div class="result-facts">
            <div><span>다음 복습</span><b>${escapeHTML(nextText)}</b></div>
            <div><span>힌트 사용</span><b>${resultSession.hints}<small>회</small></b></div>
            <div><span>연속 학습</span><b>${state.streak}<small>일</small></b></div>
          </div>
          <div class="result-actions">
            <button class="primary-button" type="button" data-action="result-today">오늘 학습으로</button>
            <button class="text-button" type="button" data-action="result-map">문법 지도 보기</button>
          </div>
        </div>
      </section>
    `;
  }

  function speak(text) {
    if (!("speechSynthesis" in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  function navigate(view) {
    if (!state.onboarded) return;
    currentView = view;
    render();
  }

  function openSettings() {
    goalSelect.value = String(state.goalMinutes);
    soundCheckbox.checked = state.soundEnabled;
    settingsDialog.showModal();
  }

  function requestReset(button) {
    if (!resetArmed) {
      resetArmed = true;
      button.textContent = "정말 초기화";
      button.classList.add("is-armed");
      clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        resetArmed = false;
        button.textContent = "초기화";
        button.classList.remove("is-armed");
      }, 4000);
      return;
    }
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    currentView = "onboarding";
    diagnosticSession = null;
    lessonSession = null;
    practiceSession = null;
    resultSession = null;
    resetArmed = false;
    settingsDialog.close();
    render();
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    if (action === "go-today") navigate("today");
    if (action === "nav") navigate(target.dataset.nav);
    if (action === "open-settings") openSettings();
    if (action === "request-reset") requestReset(target);
    if (action === "start-diagnostic") startDiagnostic();
    if (action === "exit-diagnostic") { diagnosticSession = null; currentView = "onboarding"; render(); }
    if (action === "skip-diagnostic") skipDiagnostic();
    if (action === "answer-diagnostic") answerDiagnostic(target.dataset.value);
    if (action === "diagnostic-next") advanceDiagnostic();
    if (action === "accept-diagnostic") acceptDiagnostic();
    if (action === "select-active-level") { state.activeLevel = target.dataset.level; mapLevel = state.activeLevel; saveState(); render(); }
    if (action === "select-map-level") { mapLevel = target.dataset.level; render(); }
    if (action === "start-topic") beginTopic(target.dataset.topic);
    if (action === "exit-lesson") { lessonSession = null; currentView = "today"; render(); }
    if (action === "lesson-step") selectLessonStep(target.dataset.step);
    if (action === "select-form-row" && lessonSession) { lessonSession.formIndex = Number(target.dataset.index) || 0; render(); }
    if (action === "complete-concept") completeConceptLesson();
    if (action === "start-topic-practice") startTopicPractice();
    if (action === "start-review") startReview();
    if (action === "exit-practice") { practiceSession = null; currentView = "today"; render(); }
    if (action === "show-hint") showHint();
    if (action === "add-token") addToken(target.dataset.token);
    if (action === "remove-token") removeToken(target.dataset.token);
    if (action === "answer-practice-choice") submitPractice(target.dataset.value);
    if (action === "check-arrange") submitPractice(practiceSession.itemState.builtTokens.map((token) => token.text).join(" "));
    if (action === "check-input") submitPractice(document.getElementById("sentence-answer")?.value || "");
    if (action === "practice-next") advancePractice();
    if (action === "speak") speak(target.dataset.text);
    if (action === "result-today") { currentView = "today"; resultSession = null; practiceSession = null; render(); }
    if (action === "result-map") { currentView = "map"; resultSession = null; practiceSession = null; render(); }
  });

  settingsDialog.addEventListener("change", (event) => {
    if (event.target.dataset.setting === "goalMinutes") state.goalMinutes = Number(event.target.value);
    if (event.target.dataset.setting === "soundEnabled") state.soundEnabled = event.target.checked;
    saveState();
    if (state.onboarded && currentView === "today") render();
  });

  settingsDialog.addEventListener("close", () => {
    resetArmed = false;
    clearTimeout(resetTimer);
    const resetButton = settingsDialog.querySelector("[data-action='request-reset']");
    if (resetButton) {
      resetButton.textContent = "초기화";
      resetButton.classList.remove("is-armed");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key >= "1" && event.key <= "3") {
      const options = [...document.querySelectorAll(".choice-option:not(:disabled)")];
      options[Number(event.key) - 1]?.click();
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter" && currentView === "practice") {
      const checkButton = document.querySelector("[data-action='check-input'], [data-action='check-arrange']");
      checkButton?.click();
    }
  });

  if (!engine || !curriculum.length) {
    app.innerHTML = "<p>문법 학습 데이터를 불러오지 못했습니다.</p>";
    return;
  }

  render();
})();
