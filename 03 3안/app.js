(function () {
  "use strict";

  const Engine = window.WORDLINE_ENGINE;
  const STORAGE_KEY = "wordline-v3-cefr-progress";
  const WORD_BY_ID = new Map(WORDLINE_WORDS.map(word => [String(word.id), word]));
  const SESSION_OPTIONS = [5, 10, 15];
  const CHALLENGE_MODES = ["meaning", "reverse", "context", "listening", "spelling"];
  const SCAN_SIZE_BY_MINUTES = Object.freeze({ 5: 16, 10: 24, 15: 32 });
  const VERIFY_SIZE_BY_MINUTES = Object.freeze({ 5: 2, 10: 3, 15: 4 });
  const LEVEL_TITLES = [
    "기억 새싹", "단어 탐험가", "연결 설계자", "문맥 추적자",
    "회상 전문가", "어휘 항해사", "기억 전략가", "wordline 마스터"
  ];
  const BADGES = [
    { id: "first_loop", icon: "◉", name: "첫 기억 루프", desc: "첫 적응형 학습을 끝냈습니다." },
    { id: "streak_3", icon: "Ⅲ", name: "세 번의 약속", desc: "3일 연속 학습했습니다." },
    { id: "streak_7", icon: "Ⅶ", name: "일주일 리듬", desc: "7일 연속 학습했습니다." },
    { id: "combo_5", icon: "×5", name: "회상 가속", desc: "챌린지에서 5콤보를 만들었습니다." },
    { id: "review_clean", icon: "↻", name: "기억 정리", desc: "복습 대기열을 모두 비웠습니다." },
    { id: "words_100", icon: "100", name: "백 개의 연결", desc: "100단어를 장기 기억으로 옮겼습니다." },
    { id: "stage_a1", icon: "A1", name: "첫 구간 완주", desc: "A1 단계를 장기 기억으로 완주했습니다." },
    { id: "deep_focus", icon: "15′", name: "깊은 몰입", desc: "15분 집중 루프를 완주했습니다." }
  ];

  const workspace = document.getElementById("workspace");
  const toast = document.getElementById("toast");
  const liveRegion = document.getElementById("live-region");
  const wordDialog = document.getElementById("word-dialog");
  const dialogContent = document.getElementById("dialog-content");
  const settingsDialog = document.getElementById("settings-dialog");
  const celebrationLayer = document.getElementById("celebration-layer");

  let currentView = "studio";
  let archiveStage = "all";
  let archiveStatus = "all";
  let archiveQuery = "";
  let archiveLimit = 60;
  let placementSession = null;
  let scanSession = null;
  let studySession = null;
  let quizSession = null;
  let resultSession = null;
  let toastTimer = null;
  let audioContext = null;

  function defaultState() {
    return {
      version: 4,
      currentStage: "a1",
      sessionMinutes: 10,
      onboardingComplete: false,
      placement: null,
      soundEnabled: true,
      autoSpeak: true,
      xp: 0,
      streak: 0,
      bestStreak: 0,
      lastActiveDate: null,
      progress: {},
      bookmarks: [],
      badges: [],
      daily: {},
      sessions: [],
      scanHistory: [],
      scannedKnown: 0,
      pendingWords: [],
      pendingSession: null,
      discoveredUnknown: 0
    };
  }

  function migrateState(stored) {
    const base = defaultState();
    if (!stored || typeof stored !== "object") return base;
    const knownStage = WORDLINE_CURRICULUM.some(stage => stage.id === stored.currentStage)
      ? stored.currentStage
      : "a1";
    const migratedProgress = {};
    Object.entries(stored.progress || {}).forEach(([wordId, progress]) => {
      if (findWord(wordId)) migratedProgress[wordId] = Engine.normalizeProgress(progress, wordId);
    });

    if (stored.version === 3 || stored.version === 4) {
      return {
        ...base,
        ...stored,
        currentStage: knownStage,
        xp: Math.max(0, Number(stored.xp) || 0),
        streak: Math.max(0, Number(stored.streak) || 0),
        bestStreak: Math.max(0, Number(stored.bestStreak) || 0),
        sessionMinutes: SESSION_OPTIONS.includes(stored.sessionMinutes) ? stored.sessionMinutes : 10,
        progress: migratedProgress,
        bookmarks: Array.isArray(stored.bookmarks) ? stored.bookmarks : [],
        badges: Array.isArray(stored.badges) ? stored.badges : [],
        daily: Object.fromEntries(Object.entries(stored.daily || {}).filter(([date, value]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && value && typeof value === "object").map(([date, value]) => [date, {
          ...Object.fromEntries(["words","correct","attempts","sessions"].map(key => [key, Math.max(0, Number(value[key]) || 0)])),
          wordIds: Array.isArray(value.wordIds) ? value.wordIds : []
        }])),
        pendingWords: Array.isArray(stored.pendingWords) ? stored.pendingWords.filter(id => findWord(id)) : [],
        sessions: Array.isArray(stored.sessions) ? stored.sessions.filter(item => item && typeof item === "object").map(item => ({...item, count:Number(item.count)||0, correct:Number(item.correct)||0})) : [],
        scanHistory: Array.isArray(stored.scanHistory) ? stored.scanHistory : [],
        scannedKnown: Math.max(0, Number(stored.scannedKnown) || 0),
        discoveredUnknown: Math.max(0, Number(stored.discoveredUnknown) || 0)
      };
    }

    const oldGoal = Number(stored.dailyGoal) || 10;
    return {
      ...base,
      currentStage: knownStage,
      sessionMinutes: oldGoal <= 8 ? 5 : oldGoal >= 16 ? 15 : 10,
      onboardingComplete: Object.keys(migratedProgress).length > 0 || Boolean(stored.sessions?.length),
      xp: Math.max(0, Number(stored.xp) || (stored.sessions?.length || 0) * 25),
      streak: Math.max(0, Number(stored.streak) || 0),
      bestStreak: Math.max(0, Number(stored.bestStreak) || Number(stored.streak) || 0),
      lastActiveDate: stored.lastActiveDate || null,
      progress: migratedProgress,
      daily: stored.daily || {},
      sessions: Array.isArray(stored.sessions) ? stored.sessions : []
    };
  }

  function loadState() {
    try {
      return migrateState(JSON.parse(window.LearningData.read(STORAGE_KEY)));
    } catch (error) {
      return defaultState();
    }
  }

  let state = loadState();

  function saveState() {
    state.version = 4;
    window.LearningData.write(STORAGE_KEY, JSON.stringify(state));
    updateHeader();
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function escapeRegExp(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("ko-KR").format(Number(value) || 0);
  }

  function formatInterval(days) {
    if (days < (1 / 24)) return `${Math.max(10, Math.round(days * 24 * 60))}분`;
    if (days < 1) return `${Math.max(1, Math.round(days * 24))}시간`;
    if (days < 30) return `${Math.max(1, Math.round(days))}일`;
    return `${Math.max(1, Math.round(days / 30))}개월`;
  }

  function dateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function yesterdayKey() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return dateKey(date);
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function uniqueWords(words) {
    const seen = new Set();
    return words.filter(word => {
      if (!word || seen.has(String(word.id))) return false;
      seen.add(String(word.id));
      return true;
    });
  }

  function wordContext(word) {
    return word.example || word.definitionEn || `${word.cefr} 단계 핵심 어휘`;
  }

  function getStage(stageId = state.currentStage) {
    return WORDLINE_CURRICULUM.find(stage => stage.id === stageId) || WORDLINE_CURRICULUM[0];
  }

  function getStageWords(stageOrId) {
    const stage = typeof stageOrId === "string" ? getStage(stageOrId) : stageOrId;
    return stage.units.flatMap(unit => unit.words);
  }

  function findWord(wordId) {
    return WORD_BY_ID.get(String(wordId));
  }

  function getProgress(wordId) {
    return Engine.normalizeProgress(state.progress[wordId], wordId);
  }

  function isMastered(word) {
    const progress = getProgress(word.id);
    return progress.strength >= 4 && progress.spacedSuccesses >= 3;
  }

  function stageStats(stage) {
    const words = getStageWords(stage);
    const seen = words.filter(word => getProgress(word.id).seen > 0).length;
    const mastered = words.filter(isMastered).length;
    return {
      total: words.length,
      seen,
      mastered,
      percent: words.length ? Math.round((mastered / words.length) * 100) : 0
    };
  }

  function overallStats() {
    const progressValues = WORDLINE_WORDS.filter(word => state.progress[word.id]).map(word => getProgress(word.id));
    const seen = progressValues.filter(progress => progress.seen > 0).length;
    const mastered = WORDLINE_WORDS.filter(isMastered).length;
    const answers = progressValues.reduce((sum, item) => sum + item.correct + item.wrong, 0);
    const correct = progressValues.reduce((sum, item) => sum + item.correct, 0);
    return {
      total: WORDLINE_WORDS.length,
      seen,
      mastered,
      learning: Math.max(0, seen - mastered),
      accuracy: answers ? Math.round((correct / answers) * 100) : 0,
      answers
    };
  }

  function recentAccuracy() {
    const recent = state.sessions.slice(0, 5);
    const total = recent.reduce((sum, session) => sum + (session.count || 0), 0);
    const correct = recent.reduce((sum, session) => sum + (session.correct || 0), 0);
    return total ? Math.round((correct / total) * 100) : 82;
  }

  function averageRetention(words = WORDLINE_WORDS) {
    const seen = words
      .map(word => getProgress(word.id))
      .filter(progress => progress.seen > 0);
    if (!seen.length) return 0;
    return Math.round((seen.reduce((sum, progress) => sum + Engine.retrievability(progress), 0) / seen.length) * 100);
  }

  function getDueWords(words = WORDLINE_WORDS) {
    return words
      .filter(word => Engine.isDue(getProgress(word.id)))
      .sort((a, b) => {
        const aProgress = getProgress(a.id);
        const bProgress = getProgress(b.id);
        return Engine.retrievability(aProgress) - Engine.retrievability(bProgress)
          || (aProgress.dueAt || 0) - (bProgress.dueAt || 0);
      });
  }

  function getCurrentUnit(stage) {
    return stage.units.find(unit => unit.words.some(word => getProgress(word.id).seen === 0))
      || stage.units.find(unit => unit.words.some(word => !isMastered(word)))
      || stage.units[stage.units.length - 1];
  }

  function getDailyPlan() {
    return Engine.buildDailyPlan({
      allWords: WORDLINE_WORDS,
      stageWords: getStageWords(getStage()),
      progress: state.progress,
      sessionMinutes: state.sessionMinutes,
      recentAccuracy: recentAccuracy()
    });
  }

  function todayActivity() {
    return state.daily[dateKey()] || { words: 0, correct: 0, attempts: 0, sessions: 0, wordIds: [] };
  }

  function getLevelData() {
    const level = Math.max(1, Math.floor(Math.sqrt(state.xp / 120)) + 1);
    const currentFloor = Math.pow(level - 1, 2) * 120;
    const nextFloor = Math.pow(level, 2) * 120;
    return {
      level,
      title: LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)],
      progress: Math.round(((state.xp - currentFloor) / Math.max(1, nextFloor - currentFloor)) * 100),
      nextXP: nextFloor
    };
  }

  function addXP(amount) {
    state.xp = Math.max(0, state.xp + Math.max(0, Number(amount) || 0));
  }

  function activateToday() {
    const today = dateKey();
    if (state.lastActiveDate === today) return;
    state.streak = state.lastActiveDate === yesterdayKey() ? state.streak + 1 : 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.lastActiveDate = today;
  }

  function trackDailyWord(word, options = {}) {
    const today = dateKey();
    const daily = state.daily[today] || { words: 0, correct: 0, attempts: 0, sessions: 0, wordIds: [] };
    daily.wordIds = Array.isArray(daily.wordIds) ? daily.wordIds : [];
    if (!daily.wordIds.includes(word.id)) {
      daily.wordIds.push(word.id);
      daily.words += 1;
    }
    if (options.attempted) {
      daily.attempts = (daily.attempts || 0) + 1;
      daily.correct = (daily.correct || 0) + (options.correct ? 1 : 0);
    }
    state.daily[today] = daily;
    activateToday();
  }

  function recordReview(word, rating, source) {
    const previous = getProgress(word.id);
    const updated = Engine.scheduleReview(previous, rating);
    state.progress[word.id] = updated;
    trackDailyWord(word, { attempted: true, correct: rating !== "again" });

    const xpByRating = { again: 2, hard: 6, good: 10, easy: 13 };
    addXP(xpByRating[rating] || 2);
    state.lastSource = source;
    saveState();
    return updated;
  }

  function recordPerformance(word, evidence, source) {
    const updated = Engine.scheduleFromPerformance(getProgress(word.id), evidence);
    state.progress[word.id] = updated;
    trackDailyWord(word, { attempted: true, correct: Boolean(evidence.correct) });
    addXP(evidence.correct ? (evidence.hintUsed ? 5 : 9) : 2);
    state.lastSource = source;
    saveState();
    return updated;
  }

  function recordExposure(word, source) {
    const updated = Engine.registerExposure(getProgress(word.id));
    state.progress[word.id] = updated;
    trackDailyWord(word);
    state.lastSource = source;
    saveState();
    return updated;
  }

  function unlockBadge(id, unlocked) {
    if (state.badges.includes(id)) return;
    state.badges.push(id);
    const badge = BADGES.find(item => item.id === id);
    if (badge) unlocked.push(badge);
    addXP(40);
  }

  function checkAchievements(meta = {}) {
    const unlocked = [];
    const stats = overallStats();
    if (state.sessions.length >= 1) unlockBadge("first_loop", unlocked);
    if (state.streak >= 3) unlockBadge("streak_3", unlocked);
    if (state.streak >= 7) unlockBadge("streak_7", unlocked);
    if ((meta.maxCombo || 0) >= 5) unlockBadge("combo_5", unlocked);
    if (meta.reviewMode && getDueWords().length === 0) unlockBadge("review_clean", unlocked);
    if (stats.mastered >= 100) unlockBadge("words_100", unlocked);
    if (stageStats(getStage("a1")).percent === 100) unlockBadge("stage_a1", unlocked);
    if (state.sessionMinutes === 15 && meta.kind === "mission") unlockBadge("deep_focus", unlocked);
    return unlocked;
  }

  function completeSession(kind, words, correctCount, meta = {}) {
    const today = dateKey();
    const daily = state.daily[today] || { words: 0, correct: 0, attempts: 0, sessions: 0, wordIds: [] };
    daily.sessions = (daily.sessions || 0) + 1;
    state.daily[today] = daily;
    const completionBonus = 12 + Math.min(20, (meta.maxCombo || 0) * 2);
    addXP(completionBonus);
    state.sessions.unshift({
      date: today,
      at: Date.now(),
      kind,
      count: meta.answerCount || words.length,
      correct: correctCount,
      maxCombo: meta.maxCombo || 0,
      score: meta.score || 0,
      minutes: state.sessionMinutes
    });
    state.sessions = state.sessions.slice(0, 120);
    const unlocked = checkAchievements({ ...meta, kind });
    saveState();
    return { unlocked, completionBonus };
  }

  function updateHeader() {
    const stats = overallStats();
    document.getElementById("header-level").textContent = "확인";
    document.getElementById("header-xp").textContent = `${formatNumber(stats.mastered)} 단어`;
    document.getElementById("header-streak").textContent = state.streak;
    document.getElementById("archive-nav-label").textContent = `${formatNumber(WORDLINE_WORDS.length)} 단어`;
  }

  function updateNavigation() {
    const activeView = ["onboarding", "placement", "scan", "study", "challenge", "result"].includes(currentView)
      ? "studio"
      : currentView;
    document.querySelectorAll(".mode-link").forEach(button => {
      const isActive = button.dataset.view === activeView;
      button.classList.toggle("is-active", isActive);
      if (isActive) button.setAttribute("aria-current", "page");
      else button.removeAttribute("aria-current");
    });
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2400);
  }

  function announce(message) {
    liveRegion.textContent = "";
    window.setTimeout(() => { liveRegion.textContent = message; }, 20);
  }

  function playTone(type, combo = 0) {
    if (!state.soundEnabled || !(window.AudioContext || window.webkitAudioContext)) return;
    try {
      audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
      const now = audioContext.currentTime;
      const notes = type === "complete"
        ? [392, 523.25, 659.25]
        : type === "correct"
          ? [440 + Math.min(combo, 6) * 22, 659.25 + Math.min(combo, 6) * 18]
          : [220, 174.61];
      notes.forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = type === "wrong" ? "triangle" : "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, now + index * 0.08);
        gain.gain.exponentialRampToValueAtTime(type === "complete" ? 0.08 : 0.055, now + index * 0.08 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 0.24);
        oscillator.connect(gain).connect(audioContext.destination);
        oscillator.start(now + index * 0.08);
        oscillator.stop(now + index * 0.08 + 0.26);
      });
    } catch (error) {
      // Sound is an optional enhancement; learning continues without it.
    }
  }

  function celebrate() {
    celebrationLayer.replaceChildren();
    const colors = ["#f45532", "#171b1a", "#f3b23f", "#fff8e8"];
    for (let index = 0; index < 18; index += 1) {
      const piece = document.createElement("i");
      piece.style.setProperty("--x", `${8 + Math.random() * 84}%`);
      piece.style.setProperty("--delay", `${Math.random() * 0.25}s`);
      piece.style.setProperty("--turn", `${Math.round(Math.random() * 520)}deg`);
      piece.style.setProperty("--color", colors[index % colors.length]);
      celebrationLayer.appendChild(piece);
    }
    celebrationLayer.classList.remove("is-active");
    requestAnimationFrame(() => celebrationLayer.classList.add("is-active"));
    window.setTimeout(() => celebrationLayer.classList.remove("is-active"), 2200);
  }

  function setView(view) {
    checkpointSession();
    currentView = view;
    placementSession = null;
    scanSession = null;
    studySession = null;
    quizSession = null;
    resultSession = null;
    updateNavigation();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function render() {
    if (currentView === "onboarding") renderOnboarding();
    else if (currentView === "studio") {
      if (state.onboardingComplete) renderStudio();
      else renderOnboarding();
    } else if (currentView === "placement") renderPlacement();
    else if (currentView === "scan") renderScan();
    else if (currentView === "study") renderStudy();
    else if (currentView === "challenge") renderChallenge();
    else if (currentView === "result") renderResult();
    else if (currentView === "archive") renderArchive();
    else if (currentView === "report") renderReport();
  }

  function renderOnboarding() {
    currentView = "onboarding";
    updateNavigation();
    workspace.innerHTML = `
      <section class="onboarding-shell view-enter">
        <div class="onboarding-copy">
          <p class="eyebrow">SCAN THE GAPS, NOT EVERY WORD</p>
          <h1>모르는 것만 고르면,<br><em>나머지는 빠르게 통과.</em></h1>
          <p class="onboarding-lead">뜻을 하나씩 열어 보고 스스로 점수 매기지 않습니다. 여러 단어를 한눈에 훑고, 표본 몇 개만 실제 회상으로 확인합니다.</p>
          <div class="onboarding-actions">
            <button class="primary-action dark" type="button" data-action="start-placement">45초 범위 스캔</button>
            <button class="secondary-action" type="button" data-action="start-a1">A1 레이더부터 시작</button>
          </div>
          <p class="onboarding-note">스캔 결과는 출발점만 정합니다. 실제 정답과 간격을 둔 복습으로 계속 보정됩니다.</p>
        </div>
        <div class="scan-hero" aria-label="단어 스캔 학습 흐름">
          <div class="scan-hero-copy"><span>01 SCAN</span><strong>모르는 단어만<br>손으로 잡기</strong></div>
          <div class="scan-hero-cloud" aria-hidden="true">
            <i>apple</i><i>quiet</i><i>discover</i><i>borrow</i><i>curious</i><i>meanwhile</i><i>surface</i><i>brief</i><i>ordinary</i>
          </div>
          <div class="scan-hero-proof"><span>02 CHECK</span><strong>3개만 검증</strong><small>통과한 묶음은 21일 뒤 다시 확인</small></div>
        </div>
      </section>
    `;
  }

  function createOptions(target, labelKey = "meaning", poolWords = getStageWords(target.stageId)) {
    const labels = new Set([target[labelKey]]);
    const pool = shuffle(poolWords).filter(word => {
      if (word.id === target.id || labels.has(word[labelKey]) || (labelKey === "word" && word.meaning === target.meaning)) return false;
      labels.add(word[labelKey]); return true;
    });
    return shuffle([target, ...pool.slice(0, 3)]).map(word => ({
      id: String(word.id),
      label: word[labelKey]
    }));
  }

  function buildPlacementScanWords() {
    const positions = [0.12, 0.31, 0.5, 0.69, 0.88];
    return WORDLINE_CURRICULUM.flatMap(stage => {
      const words = getStageWords(stage);
      return positions.map(position => words[Math.min(words.length - 1, Math.floor(words.length * position))]);
    });
  }

  function startPlacement() {
    placementSession = {
      phase: "scan",
      words: buildPlacementScanWords(),
      selectedIds: new Set(),
      questions: [],
      index: 0,
      selectedId: null,
      answers: [],
      resultStage: null,
      startedAt: Date.now()
    };
    currentView = "placement";
    renderPlacement();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function preparePlacementVerification() {
    const knownCandidates = placementSession.words.filter(word => !placementSession.selectedIds.has(String(word.id)));
    const targets = Engine.sampleForVerification(knownCandidates, Math.min(5, knownCandidates.length));
    placementSession.questions = targets.map(target => ({
      target,
      stageId: target.stageId,
      stageName: target.stageName,
      options: createOptions(target, "meaning", getStageWords(target.stageId)),
      selectedId: null,
      correct: null,
      startedAt: null,
      responseMs: 0
    }));
    placementSession.index = 0;
    placementSession.phase = targets.length ? "verify" : "result";
    if (!targets.length) finishPlacement();
    else renderPlacement();
  }

  function finishPlacement() {
    const failedIds = new Set(placementSession.answers.filter(answer => !answer.correct).map(answer => String(answer.word.id)));
    const unknownIds = new Set([...placementSession.selectedIds, ...failedIds]);
    const stageUnknown = WORDLINE_CURRICULUM.map(stage => placementSession.words
      .filter(word => word.stageId === stage.id && unknownIds.has(String(word.id))).length);
    let stageIndex = stageUnknown.findIndex(count => count >= 2);
    if (stageIndex < 0) {
      const firstGap = stageUnknown.findIndex(count => count > 0);
      stageIndex = firstGap >= 0 ? firstGap : WORDLINE_CURRICULUM.length - 1;
    }
    placementSession.resultStage = WORDLINE_CURRICULUM[Math.max(0, stageIndex)];
    placementSession.score = placementSession.words.length - unknownIds.size;
    placementSession.answers.forEach(answer => {
      if (answer.correct) state.progress[answer.word.id] = Engine.markKnown(getProgress(answer.word.id), { verified: true, responseMs: answer.responseMs });
    });
    saveState();
    playTone("complete");
    renderPlacement();
  }

  function renderPlacement() {
    if (!placementSession) {
      renderOnboarding();
      return;
    }
    if (placementSession.resultStage) {
      const stage = placementSession.resultStage;
      workspace.innerHTML = `
        <section class="placement-result view-enter">
          <p class="eyebrow">RANGE FOUND / SAMPLE VERIFIED</p>
          <div class="placement-level">${escapeHTML(stage.name)}</div>
          <h1><em>${escapeHTML(stage.school)}</em> 구간부터<br>빈틈을 찾겠습니다.</h1>
          <p>25개를 한 번에 훑고 ${placementSession.answers.length}개만 실제로 확인했습니다. 전체 단어를 시험 본 결과가 아니라, 빠른 출발점입니다.</p>
          <div class="placement-proof">
            <span><small>추천 단계</small><strong>${escapeHTML(stage.name)}</strong></span>
            <span><small>스캔 통과</small><strong>${placementSession.score}</strong></span>
            <span><small>실제 검증</small><strong>${placementSession.answers.filter(answer => answer.correct).length}/${placementSession.answers.length}</strong></span>
          </div>
          <div class="result-actions">
            <button class="primary-action dark" type="button" data-action="confirm-placement">단어 레이더 시작</button>
            <button class="secondary-action" type="button" data-action="retry-placement">다시 스캔</button>
          </div>
        </section>
      `;
      return;
    }

    if (placementSession.phase === "scan") {
      workspace.innerHTML = `
        <section class="scan-shell placement-scan view-enter">
          <header class="scan-header">
            <button class="back-button" type="button" data-action="cancel-placement" aria-label="범위 스캔 나가기">←</button>
            <div><p class="eyebrow">RANGE SCAN · 25 WORDS AT ONCE</p><h1>뜻이 바로 안 떠오르는 단어만 누르세요.</h1></div>
            <span class="scan-counter"><b>${placementSession.selectedIds.size}</b>개 낯섦</span>
          </header>
          <p class="scan-guide">뜻은 아직 보여주지 않습니다. ‘본 적 있음’이 아니라, 지금 의미를 설명할 수 있는지를 기준으로 훑어보세요.</p>
          <div class="scan-grid placement-grid">
            ${placementSession.words.map(word => `<button class="scan-word ${placementSession.selectedIds.has(String(word.id)) ? "is-unknown" : ""}" type="button" data-action="placement-toggle" data-word-id="${escapeHTML(word.id)}" aria-pressed="${placementSession.selectedIds.has(String(word.id))}"><small>${escapeHTML(word.stageName)}</small><strong>${escapeHTML(word.word)}</strong><span>${placementSession.selectedIds.has(String(word.id)) ? "배울 단어" : ""}</span></button>`).join("")}
          </div>
          <div class="scan-dock">
            <div><strong>${placementSession.selectedIds.size ? `${placementSession.selectedIds.size}개 빈틈 발견` : "전부 아는 것 같나요?"}</strong><small>다음 단계에서 표본 몇 개만 실제 뜻으로 확인합니다.</small></div>
            <button class="primary-action dark" type="button" data-action="placement-scan-next">표본 검증하기</button>
          </div>
        </section>
      `;
      return;
    }

    const question = placementSession.questions[placementSession.index];
    const answered = question.selectedId !== null;
    const isCorrect = question.correct;
    const progress = Math.round((placementSession.index / placementSession.questions.length) * 100);
    if (!question.startedAt) question.startedAt = Date.now();
    workspace.innerHTML = `
      <section class="placement-shell view-enter">
        <header class="study-header">
          <button class="back-button" type="button" data-action="cancel-placement" aria-label="진단 나가기">←</button>
          <div class="session-progress"><span style="width:${progress}%"></span></div>
          <span class="session-count">${placementSession.index + 1} / ${placementSession.questions.length}</span>
        </header>
        <div class="placement-question">
          <p class="eyebrow">SAMPLE CHECK · ${escapeHTML(question.stageName)}</p>
          <h1>${escapeHTML(question.target.word)}</h1>
          <p class="phonetic">${escapeHTML(question.target.ipa || question.target.pos)}</p>
          <div class="placement-options">
            ${question.options.map((option, index) => {
              let className = "placement-option";
              if (answered && option.id === String(question.target.id)) className += " is-correct";
              if (answered && option.id === question.selectedId && !isCorrect) className += " is-wrong";
              return `<button class="${className}" type="button" data-action="placement-answer" data-value="${escapeHTML(option.id)}" ${answered ? "disabled" : ""}><span>${index + 1}</span><strong>${escapeHTML(option.label)}</strong></button>`;
            }).join("")}
          </div>
          ${answered ? `
            <div class="placement-feedback"><strong>${isCorrect ? "표본 검증 통과" : `이 단어는 빈틈으로 이동 · ${escapeHTML(question.target.meaning)}`}</strong><button class="next-button" type="button" data-action="placement-next">${placementSession.index === placementSession.questions.length - 1 ? "범위 결과" : "다음 표본"} →</button></div>
          ` : `<p class="verification-note">선택하지 않은 단어를 정말 아는지 일부만 확인합니다.</p>`}
        </div>
      </section>
    `;
  }

  function answerPlacement(value) {
    if (!placementSession || placementSession.phase !== "verify") return;
    const question = placementSession.questions[placementSession.index];
    if (question.selectedId !== null) return;
    question.selectedId = value;
    const correct = value === String(question.target.id);
    question.correct = correct;
    question.responseMs = Date.now() - question.startedAt;
    placementSession.answers.push({ stageId: question.stageId, word: question.target, correct, responseMs: question.responseMs });
    playTone(correct ? "correct" : "wrong");
    renderPlacement();
  }

  function nextPlacement() {
    if (!placementSession || placementSession.phase !== "verify") return;
    const question = placementSession.questions[placementSession.index];
    if (question.selectedId === null) return;
    if (placementSession.index >= placementSession.questions.length - 1) {
      finishPlacement();
      return;
    }
    placementSession.index += 1;
    renderPlacement();
  }

  function getScanSize() {
    return SCAN_SIZE_BY_MINUTES[state.sessionMinutes] || SCAN_SIZE_BY_MINUTES[10];
  }

  function startScan(options = {}) {
    const stage = getStage(options.stageId || state.currentStage);
    const words = Engine.buildScanBatch({
      stageWords: getStageWords(stage),
      progress: state.progress,
      size: getScanSize()
    });
    if (!words.length) {
      setView("studio");
      showToast(`${stage.name}에서 지금 새로 훑을 단어가 없습니다. 예약된 복습이나 다른 레벨을 선택하세요.`);
      return;
    }
    scanSession = {
      phase: "scan",
      stage,
      words,
      selectedIds: new Set(),
      knownCandidates: [],
      questions: [],
      index: 0,
      answers: [],
      startedAt: Date.now(),
      summary: null
    };
    currentView = "scan";
    updateNavigation();
    renderScan();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function toggleScanWord(wordId) {
    if (!scanSession || scanSession.phase !== "scan") return;
    const id = String(wordId);
    if (scanSession.selectedIds.has(id)) scanSession.selectedIds.delete(id);
    else scanSession.selectedIds.add(id);
    renderScan();
  }

  function prepareScanVerification() {
    if (!scanSession || scanSession.phase !== "scan") return;
    scanSession.knownCandidates = scanSession.words.filter(word => !scanSession.selectedIds.has(String(word.id)));
    const targets = Engine.sampleForVerification(
      scanSession.knownCandidates,
      VERIFY_SIZE_BY_MINUTES[state.sessionMinutes] || VERIFY_SIZE_BY_MINUTES[10]
    );
    scanSession.questions = targets.map(target => ({
      target,
      options: createOptions(target, "meaning", getStageWords(target.stageId)),
      selectedId: null,
      correct: null,
      responseMs: 0,
      startedAt: null
    }));
    scanSession.index = 0;
    scanSession.phase = targets.length ? "verify" : "finish";
    if (targets.length) renderScan();
    else finishScan();
  }

  function renderScan() {
    if (!scanSession) {
      setView("studio");
      return;
    }

    if (scanSession.phase === "outcome") {
      const summary = scanSession.summary;
      workspace.innerHTML = `
        <section class="scan-outcome view-enter">
          <p class="eyebrow">SCAN CLEAR / NO FLASHCARDS NEEDED</p>
          <div class="scan-outcome-mark">${summary.skipped}<small>WORDS PASSED</small></div>
          <h1>이번 묶음에서는<br><em>새 빈틈이 없었습니다.</em></h1>
          <p>${summary.verified}개 표본을 실제로 맞혀 나머지를 묶음 통과시켰습니다. 잠정 통과 단어는 21일 뒤 일부가 다시 검증됩니다.</p>
          <div class="scan-summary-grid">
            <span><small>한꺼번에 훑음</small><strong>${summary.batch}</strong></span>
            <span><small>실제 뜻 검증</small><strong>${summary.verified}</strong></span>
            <span><small>절약한 카드 조작</small><strong>${Math.max(0, summary.batch - summary.verified)}</strong></span>
          </div>
          <div class="result-actions">
            <button class="primary-action dark" type="button" data-action="scan-next-batch">다음 묶음 훑기</button>
            <button class="secondary-action" type="button" data-action="finish-result">학습실로 돌아가기</button>
          </div>
        </section>
      `;
      return;
    }

    if (scanSession.phase === "scan") {
      workspace.innerHTML = `
        <section class="scan-shell view-enter">
          <header class="scan-header">
            <button class="back-button" type="button" data-action="exit-session" aria-label="단어 스캔 나가기">←</button>
            <div><p class="eyebrow">WORD RADAR · ${escapeHTML(scanSession.stage.name)} · ${scanSession.words.length} AT ONCE</p><h1>모르는 단어만 잡으세요.</h1></div>
            <span class="scan-counter"><b>${scanSession.selectedIds.size}</b>개 발견</span>
          </header>
          <div class="scan-instruction">
            <span>01</span><p><strong>뜻이 바로 설명되지 않으면 탭</strong><small>아는 단어는 아무것도 누르지 않아도 됩니다. 뜻은 다음 단계까지 숨겨집니다.</small></p>
          </div>
          <div class="scan-grid">
            ${scanSession.words.map((word, index) => {
              const selected = scanSession.selectedIds.has(String(word.id));
              return `<button class="scan-word ${selected ? "is-unknown" : ""}" style="--order:${index}" type="button" data-action="toggle-scan-word" data-word-id="${escapeHTML(word.id)}" aria-pressed="${selected}"><small>${String(index + 1).padStart(2, "0")}</small><strong>${escapeHTML(word.word)}</strong><span>${selected ? "LEARN" : ""}</span></button>`;
            }).join("")}
          </div>
          <div class="scan-dock">
            <button class="scan-all-button" type="button" data-action="scan-all-unknown">전부 낯설어요</button>
            <div><strong>${scanSession.selectedIds.size ? `${scanSession.selectedIds.size}개만 학습 후보` : "전부 아는 것 같아요"}</strong><small>선택하지 않은 단어는 ${Math.min(scanSession.words.length, VERIFY_SIZE_BY_MINUTES[state.sessionMinutes])}개만 표본 확인합니다.</small></div>
            <button class="primary-action dark" type="button" data-action="scan-verify">${scanSession.selectedIds.size ? "선택 완료" : "빠른 검증"}</button>
          </div>
        </section>
      `;
      return;
    }

    const question = scanSession.questions[scanSession.index];
    if (!question.startedAt) question.startedAt = Date.now();
    const answered = question.selectedId !== null;
    const progress = Math.round((scanSession.index / scanSession.questions.length) * 100);
    workspace.innerHTML = `
      <section class="verify-shell view-enter">
        <header class="study-header">
          <button class="back-button" type="button" data-action="exit-session" aria-label="표본 검증 나가기">←</button>
          <div class="session-progress"><span style="width:${progress}%"></span></div>
          <span class="session-count">${scanSession.index + 1} / ${scanSession.questions.length}</span>
        </header>
        <div class="verify-layout">
          <aside class="verify-rationale"><p class="eyebrow">WHY THIS CHECK?</p><h2>${scanSession.knownCandidates.length}개를 다시<br>하나씩 묻지 않기 위해.</h2><p>표본을 맞히면 선택하지 않은 묶음을 한꺼번에 통과시킵니다. 틀린 표본은 바로 학습 후보로 이동합니다.</p></aside>
          <div class="placement-question verify-question">
            <p class="eyebrow">RANDOM PROOF · ${escapeHTML(question.target.stageName)}</p>
            <h1>${escapeHTML(question.target.word)}</h1>
            <p class="phonetic">${escapeHTML(question.target.ipa || question.target.pos)}</p>
            <div class="placement-options">
              ${question.options.map((option, index) => {
                let className = "placement-option";
                if (answered && option.id === String(question.target.id)) className += " is-correct";
                if (answered && option.id === question.selectedId && !question.correct) className += " is-wrong";
                return `<button class="${className}" type="button" data-action="scan-verification-answer" data-value="${escapeHTML(option.id)}" ${answered ? "disabled" : ""}><span>${index + 1}</span><strong>${escapeHTML(option.label)}</strong></button>`;
              }).join("")}
            </div>
            ${answered ? `<div class="placement-feedback"><strong>${question.correct ? "검증 통과" : `빈틈 발견 · ${escapeHTML(question.target.meaning)}`}</strong><button class="next-button" type="button" data-action="scan-verification-next">${scanSession.index === scanSession.questions.length - 1 ? "스캔 정리" : "다음 표본"} →</button></div>` : ""}
          </div>
        </div>
      </section>
    `;
  }

  function answerScanVerification(value) {
    if (!scanSession || scanSession.phase !== "verify") return;
    const question = scanSession.questions[scanSession.index];
    if (question.selectedId !== null) return;
    question.selectedId = String(value);
    question.correct = String(value) === String(question.target.id);
    question.responseMs = Date.now() - question.startedAt;
    scanSession.answers.push({ word: question.target, correct: question.correct, responseMs: question.responseMs });
    playTone(question.correct ? "correct" : "wrong");
    renderScan();
  }

  function nextScanVerification() {
    if (!scanSession || scanSession.phase !== "verify") return;
    const question = scanSession.questions[scanSession.index];
    if (question.selectedId === null) return;
    if (scanSession.index >= scanSession.questions.length - 1) {
      finishScan();
      return;
    }
    scanSession.index += 1;
    renderScan();
  }

  function finishScan() {
    if (!scanSession) return;
    const failedWords = scanSession.answers.filter(answer => !answer.correct).map(answer => answer.word);
    const selectedWords = scanSession.words.filter(word => scanSession.selectedIds.has(String(word.id)));
    const learningWords = uniqueWords([...selectedWords, ...failedWords]);
    const verifiedIds = new Set(scanSession.answers.map(answer => String(answer.word.id)));
    const untestedKnown = scanSession.knownCandidates.filter(word => !verifiedIds.has(String(word.id)));
    const allVerified = scanSession.answers.length > 0 && scanSession.answers.every(answer => answer.correct);

    scanSession.answers.forEach(answer => {
      if (answer.correct) state.progress[answer.word.id] = Engine.markKnown(getProgress(answer.word.id), { verified: true, responseMs: answer.responseMs });
    });
    untestedKnown.forEach(word => {
      state.progress[word.id] = allVerified
        ? Engine.markKnown(getProgress(word.id), { verified: false })
        : Engine.deferScan(getProgress(word.id), 3);
    });

    const verified = scanSession.answers.filter(answer => answer.correct).length;
    const skipped = verified + (allVerified ? untestedKnown.length : 0);
    const summary = {
      batch: scanSession.words.length,
      selected: selectedWords.length,
      discovered: learningWords.length,
      verified,
      skipped,
      deferred: allVerified ? 0 : untestedKnown.length,
      seconds: Math.max(1, Math.round((Date.now() - scanSession.startedAt) / 1000)),
      stageId: scanSession.stage.id
    };
    state.scannedKnown += skipped;
    state.discoveredUnknown += learningWords.length;
    state.scanHistory.unshift({ ...summary, at: Date.now(), date: dateKey() });
    state.scanHistory = state.scanHistory.slice(0, 80);
    scanSession.summary = summary;
    activateToday();
    saveState();

    if (learningWords.length) {
      state.pendingWords = [...new Set([...state.pendingWords, ...learningWords.map(word => String(word.id))])];
      const carriedSummary = summary;
      startStudy(learningWords.slice(0, Engine.SESSION_PRESETS[state.sessionMinutes].capacity).map(word => ({ word, kind: "new" })), { mission: true, scanSummary: carriedSummary });
      return;
    }
    scanSession.phase = "outcome";
    renderScan();
    playTone("complete");
    celebrate();
  }

  function renderPath(stage) {
    return WORDLINE_CURRICULUM.map((item, index) => {
      const stats = stageStats(item);
      const classes = ["path-step"];
      if (item.id === stage.id) classes.push("is-active");
      if (stats.percent === 100) classes.push("is-complete");
      return `
        <button class="${classes.join(" ")}" type="button" data-stage="${item.id}" aria-pressed="${item.id === stage.id}">
          <span class="path-node">${index + 1}</span>
          <span class="path-copy"><strong>${escapeHTML(item.name)}</strong><small>${escapeHTML(item.school)} · 누적 ${formatNumber(item.cumulative)}</small></span>
          <span class="path-percent">${stats.percent}%</span>
        </button>
      `;
    }).join("");
  }

  function memoryQueueMarkup(words) {
    if (!words.length) return `<div class="empty-memory">첫 루프를 마치면 단어마다 다음 복습 시점이 이곳에 나타납니다.</div>`;
    return words.slice(0, 5).map(word => {
      const progress = getProgress(word.id);
      const retention = progress.seen ? Math.round(Engine.retrievability(progress) * 100) : null;
      return `
        <button class="memory-item" type="button" data-word-id="${escapeHTML(word.id)}">
          <span><strong>${escapeHTML(word.word)}</strong><small>${escapeHTML(word.meaning)}</small></span>
          <span class="memory-state">${retention === null ? "NEW" : `${retention}%`}</span>
        </button>
      `;
    }).join("");
  }

  function renderStudio() {
    const stage = getStage();
    const stageProgress = stageStats(stage);
    const overall = overallStats();
    const dueWords = getDueWords();
    const forecast = Engine.reviewForecast(WORDLINE_WORDS, state.progress);
    const currentUnit = getCurrentUnit(stage);
    const activity = todayActivity();
    const scanWords = Engine.buildScanBatch({ stageWords: getStageWords(stage), progress: state.progress, size: getScanSize() });
    const previewWords = scanWords.slice(0, 14);
    const queueWords = dueWords.length ? dueWords : scanWords;
    const stageComplete = !scanWords.length && stageProgress.percent === 100;
    const nextStage = WORDLINE_CURRICULUM[WORDLINE_CURRICULUM.findIndex(item => item.id === stage.id) + 1];
    const recentScan = state.scanHistory[0];

    workspace.innerHTML = `
      <div class="studio-shell view-enter">
        <aside class="curriculum-rail" aria-label="단계별 학습 경로">
          <p class="eyebrow">CEFR PATH / 01—${String(WORDLINE_CURRICULUM.length).padStart(2, "0")}</p>
          <h2 class="rail-heading">빈틈 지도</h2>
          <p class="rail-caption">전체 목록을 다 풀지 않습니다.<br>각 구간의 모르는 단어만 남깁니다.</p>
          <div class="path-list">${renderPath(stage)}</div>
          <div class="syllabus-total">
            <div><span>간격 복습으로 확인</span><strong>${formatNumber(overall.mastered)}</strong></div>
            <div class="thin-progress"><span style="width:${(overall.mastered / overall.total) * 100}%"></span></div>
          </div>
        </aside>

        <section class="focus-stage radar-stage">
          <div class="focus-topline radar-topline">
            <div>
              <p class="eyebrow">TODAY'S WORD RADAR · ${escapeHTML(stage.name)} / ${escapeHTML(currentUnit.focus)}</p>
              <h1 class="focus-title"><em>${scanWords.length || 0}개를 한눈에</em> 훑고,<br>모르는 것만 배웁니다.</h1>
            </div>
            <div class="date-note">${state.sessionMinutes} MIN<br>${getScanSize()} WORD SCAN</div>
          </div>

          <article class="radar-board" data-ghost="${escapeHTML(stage.ghost)}">
            <div class="radar-board-head">
              <span><b>SCAN FIRST</b> · 뜻은 숨긴 채 빠르게 분류</span>
              <small>${recentScan ? `최근 ${recentScan.batch}개 중 빈틈 ${recentScan.discovered}개` : "첫 묶음 준비 완료"}</small>
            </div>
            <div class="radar-cloud" aria-label="다음 스캔 단어 미리 보기">
              ${previewWords.length ? previewWords.map((word, index) => `<span style="--x:${(index * 37) % 89}%;--y:${(index * 53) % 78}%;--delay:${index * 0.08}s">${escapeHTML(word.word)}</span>`).join("") : `<strong class="radar-clear">${stageComplete ? `${escapeHTML(stage.name)} 구간 개척 완료` : "다음 단어를 준비 중입니다"}</strong>`}
              <i class="radar-ring ring-a"></i><i class="radar-ring ring-b"></i><i class="radar-sweep"></i>
            </div>
            <div class="radar-board-foot">
              <div class="radar-proof-line">
                <span><b>${formatNumber(state.scannedKnown)}</b><small>묶음 통과</small></span>
                <span><b>${formatNumber(state.discoveredUnknown)}</b><small>발견한 빈틈</small></span>
                <span><b>${dueWords.length}</b><small>지금 복습</small></span>
              </div>
              ${stageComplete && nextStage
                ? `<button class="primary-action" type="button" data-action="advance-stage" data-stage="${nextStage.id}">${escapeHTML(nextStage.name)}로 이동</button>`
                : `<button class="primary-action radar-action" type="button" data-action="start-scan" ${scanWords.length ? "" : "disabled"}>단어 레이더 켜기 <span>· ${scanWords.length}개</span></button>`}
            </div>
          </article>

          <div class="loop-route scan-route" aria-label="새 학습 흐름 네 단계">
            <div><span>01</span><strong>묶음 스캔</strong><small>모르는 단어만 탭</small></div>
            <i>→</i>
            <div><span>02</span><strong>표본 검증</strong><small>아는 묶음 중 2~4개</small></div>
            <i>→</i>
            <div><span>03</span><strong>빈틈 학습</strong><small>고른 것과 틀린 것만</small></div>
            <i>→</i>
            <div><span>04</span><strong>자동 간격</strong><small>정답·힌트·복습 이력로 배정</small></div>
          </div>

          <div class="lesson-actions">
            <button class="lesson-action" type="button" data-action="start-review" ${dueWords.length ? "" : "disabled"}>
              <span class="action-index">${dueWords.length || "✓"}</span>
              <span><strong>${dueWords.length ? "돌아온 기억 복습" : "오늘 복습은 비었습니다"}</strong><small>난이도 선택 없이 실제 문제로 바로 판정</small></span>
              <span>→</span>
            </button>
            <button class="lesson-action" type="button" data-action="open-stage-archive">
              <span class="action-index">${escapeHTML(stage.name)}</span>
              <span><strong>현재 구간 직접 살펴보기</strong><small>${stageProgress.seen}/${stageProgress.total}개 분류 · 오늘 ${activity.words || 0}개 학습</small></span>
              <span>→</span>
            </button>
          </div>
        </section>

        <aside class="recall-rail" aria-label="기억 대기열">
          <div>
            <p class="eyebrow">MEMORY FORECAST</p>
            <h2 class="recall-heading">버튼 대신 기록으로</h2>
            <p class="rail-caption">정답 여부, 응답 시간, 힌트 사용을 조합해 다음 시점을 자동 계산합니다.</p>
            <svg class="forgetting-curve" viewBox="0 0 280 90" role="img" aria-label="복습으로 다시 높아지는 기억 곡선">
              <path class="curve-guide" d="M4 14 C42 78 74 76 94 48 C116 18 154 76 184 50 C207 30 241 58 276 44"/>
              <path class="curve-active" d="M4 14 C42 78 74 76 94 48 C116 18 154 76 184 50 C207 30 241 58 276 44"/>
              <circle cx="94" cy="48" r="4"/><circle cx="184" cy="50" r="4"/><circle cx="276" cy="44" r="4"/>
            </svg>
            <div class="forecast-grid">
              <span><b>${forecast.overdue}</b><small>지금</small></span>
              <span><b>${forecast.today}</b><small>오늘 안</small></span>
              <span><b>${forecast.tomorrow}</b><small>내일</small></span>
            </div>
          </div>
          <div>
            <div class="memory-list">${memoryQueueMarkup(queueWords)}</div>
            <button class="review-button" type="button" data-action="start-review" ${dueWords.length ? "" : "disabled"}>
              <span>${dueWords.length ? `${dueWords.length}개 간격 복습` : "복습 대기 없음"}</span><span>→</span>
            </button>
            <div class="evidence-mini"><span>확인된 회상</span><strong>${formatNumber(overall.answers)}회</strong><small>최근 정확도 ${recentAccuracy()}%</small></div>
          </div>
        </aside>
      </div>
    `;
  }

  function normalizeStudyItems(items) {
    const seen = new Set();
    return items.map(item => item.word ? item : { word: item, kind: "reinforce" }).filter(item => {
      if (!item.word || seen.has(String(item.word.id))) return false;
      seen.add(String(item.word.id));
      return true;
    });
  }

  function startStudy(items, options = {}) {
    const selected = normalizeStudyItems(items);
    if (!selected.length) {
      showToast("지금 학습할 단어가 없습니다.");
      return;
    }
    studySession = {
      items: selected,
      words: selected.map(item => item.word),
      index: 0,
      revealed: false,
      answers: [],
      combo: 0,
      maxCombo: 0,
      xpStart: state.xp,
      mission: Boolean(options.mission),
      reviewMode: Boolean(options.reviewMode),
      scanSummary: options.scanSummary || null,
      spokenIndex: -1
    };
    currentView = "study";
    updateNavigation();
    renderStudy();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function ratingPreview(word, rating) {
    return formatInterval(Engine.scheduleReview(getProgress(word.id), rating).intervalDays);
  }

  function studyPhase(item) {
    if (item.kind === "review") return { act: "ACT 01", title: "기억 깨우기", label: "DUE REVIEW" };
    if (item.kind === "new") return { act: "ACT 02", title: "새 연결 만들기", label: "NEW CONNECTION" };
    return { act: "ACT 02", title: "약한 연결 보강", label: "REINFORCE" };
  }

  function renderStudy() {
    if (!studySession) {
      setView("studio");
      return;
    }
    const item = studySession.items[studySession.index];
    const word = item.word;
    const phase = studyPhase(item);
    const progress = Math.round((studySession.index / studySession.items.length) * 100);
    const memory = getProgress(word.id);
    const retention = memory.seen ? Math.round(Engine.retrievability(memory) * 100) : null;

    workspace.innerHTML = `
      <section class="study-shell view-enter">
        <header class="study-header">
          <button class="back-button" type="button" data-action="exit-session" aria-label="학습실로 돌아가기">←</button>
          <div class="session-progress" aria-label="학습 진행률 ${progress}%"><span style="width:${progress}%"></span></div>
          <span class="session-count">${String(studySession.index + 1).padStart(2, "0")} / ${String(studySession.items.length).padStart(2, "0")}</span>
        </header>
        <div class="act-heading"><span>${phase.act}</span><strong>${phase.title}</strong><small>${studySession.combo ? `${studySession.combo} FLOW` : phase.label}</small></div>

        <div class="flashcard-wrap">
          <article class="flashcard ${studySession.revealed ? "is-revealed" : ""}" id="flashcard">
            <span class="card-label">${escapeHTML(word.stageName)} / ${escapeHTML(word.unitTitle)}</span>
            <button class="speak-button" type="button" data-action="speak" data-word="${escapeHTML(word.word)}" aria-label="${escapeHTML(word.word)} 발음 듣기">◖))</button>
            <div class="card-memory-label"><span>${retention === null ? "첫 만남" : `추정 ${retention}%`}</span><i>${Engine.reviewLabel(memory)}</i></div>
            <h1 class="study-word">${escapeHTML(word.word)}</h1>
            <p class="phonetic">${word.ipa ? `${escapeHTML(word.ipa)} · ` : ""}${escapeHTML(word.pos)}</p>
            <div class="reveal-area">
              ${studySession.revealed ? `
                <div class="meaning-reveal">
                  <div class="meaning-line"><small>${escapeHTML(word.pos)}</small><strong>${escapeHTML(word.meaning)}</strong></div>
                  <p class="example-sentence">${escapeHTML(wordContext(word))}</p>
                  <p class="example-meaning">${word.exampleMeaning ? escapeHTML(word.exampleMeaning) : word.example ? "문맥 속에서 의미를 연결해 보세요." : "영어 풀이로 의미망을 넓혀 보세요."}</p>
                </div>
              ` : `<button class="reveal-button" type="button" data-action="reveal">먼저 떠올린 뒤 뜻 보기</button>`}
            </div>
          </article>
        </div>

        ${studySession.revealed ? `
          <div class="learning-continue">
            <div><span>SELF-RATING REMOVED</span><strong>여기서는 이해만 하고, 다음 회상 문제로 실제 기억을 판정합니다.</strong></div>
            <button class="primary-action dark" type="button" data-action="continue-learning">${studySession.index === studySession.items.length - 1 ? "회상으로 증명하기" : "다음 빈틈"}</button>
          </div>
          <p class="keyboard-hint">Enter · 다음 &nbsp;&nbsp; 선택 난이도 없이 정답·힌트·복습 이력로 자동 조절</p>
        ` : `<p class="keyboard-hint">Space · 문맥과 뜻 보기 &nbsp;&nbsp; S · 발음 듣기</p>`}
      </section>
    `;

    if (state.autoSpeak && studySession.spokenIndex !== studySession.index) {
      studySession.spokenIndex = studySession.index;
      window.setTimeout(() => speak(word.word), 120);
    }
  }

  function answerStudy() {
    if (!studySession || !studySession.revealed) return;
    const item = studySession.items[studySession.index];
    const word = item.word;
    state.pendingWords = state.pendingWords.filter(id => String(id) !== String(word.id));
    const scheduled = recordExposure(word, item.kind);
    studySession.answers.push({ word, rating: "exposure", correct: null, dueAt: scheduled.dueAt });
    announce(`${word.word}, 학습 후보에 추가`);

    if (studySession.index >= studySession.items.length - 1) {
      const source = studySession;
      studySession = null;
      startChallenge(source.words, {
        kind: source.mission ? "mission" : source.reviewMode ? "review" : "study",
        reviewMode: source.reviewMode,
        xpStart: source.xpStart,
        studyAnswers: source.answers,
        maxCombo: source.maxCombo,
        scanSummary: source.scanSummary
      });
      return;
    }

    studySession.index += 1;
    studySession.revealed = false;
    renderStudy();
  }

  function clozeMarkup(word) {
    return escapeHTML(Engine.clozeText(word) || "").replaceAll("_____", "<mark>_____</mark>");
  }

  function createChallengeQuestion(target, index) {
    let mode = CHALLENGE_MODES[index % CHALLENGE_MODES.length];
    if (mode === "context" && !Engine.clozeText(target)) mode = "reverse";
    if (mode === "listening" && !("speechSynthesis" in window)) mode = "reverse";
    const labelKey = mode === "meaning" ? "meaning" : "word";
    return {
      target,
      mode,
      options: mode === "spelling" ? [] : createOptions(target, labelKey),
      selectedValue: null,
      typedValue: "",
      correct: null,
      hint: false,
      startedAt: null,
      responseMs: 0
    };
  }

  function startChallenge(words, options = {}) {
    const unique = uniqueWords(words);
    if (!unique.length) {
      showToast("도전 문제를 만들 단어가 없습니다.");
      return;
    }
    const questionCount = options.kind && options.kind !== "quick" ? unique.length : Math.min(unique.length, state.sessionMinutes === 5 ? 3 : state.sessionMinutes === 15 ? 6 : 5);
    const targets = (options.reviewMode ? unique : shuffle(unique)).slice(0, questionCount);
    quizSession = {
      kind: options.kind || "quick",
      reviewMode: Boolean(options.reviewMode),
      sourceWords: unique,
      questions: targets.map(createChallengeQuestion),
      index: 0,
      answers: [],
      combo: options.maxCombo || 0,
      maxCombo: options.maxCombo || 0,
      score: 0,
      xpStart: options.xpStart ?? state.xp,
      studyAnswers: options.studyAnswers || [],
      scanSummary: options.scanSummary || null
    };
    currentView = "challenge";
    updateNavigation();
    renderChallenge();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function challengePrompt(question) {
    const word = question.target;
    if (question.mode === "reverse") {
      return `<p>한국어 뜻에 맞는 단어를 고르세요.</p><h2>${escapeHTML(word.meaning)}</h2>`;
    }
    if (question.mode === "context") {
      return `<p>문맥의 빈칸을 완성하세요.</p><h2 class="context-question">${clozeMarkup(word)}</h2>`;
    }
    if (question.mode === "listening") {
      return `<p>소리를 듣고 단어를 고르세요.</p><button class="listen-orb" type="button" data-action="speak" data-word="${escapeHTML(word.word)}"><span>◖))</span><small>PLAY WORD</small></button><button class="text-button" type="button" data-action="listening-fallback">소리가 안 들려요 · 뜻 문제로 바꾸기</button>`;
    }
    if (question.mode === "spelling") {
      return `<p>뜻을 보고 영어 철자를 완성하세요.</p><h2>${escapeHTML(word.meaning)}</h2>`;
    }
    return `<p>가장 가까운 뜻을 고르세요.</p><h2>${escapeHTML(word.word)}</h2>`;
  }

  function challengeModeName(mode) {
    return ({ meaning: "뜻 회상", reverse: "역방향 연결", context: "문맥 추론", listening: "소리 회상", spelling: "철자 인출" })[mode];
  }

  function renderChallenge() {
    if (!quizSession) {
      setView("studio");
      return;
    }
    const question = quizSession.questions[quizSession.index];
    const answered = question.correct !== null;
    if (!answered && !question.startedAt) question.startedAt = Date.now();
    const progress = Math.round((quizSession.index / quizSession.questions.length) * 100);
    const optionMarkup = question.mode === "spelling" ? `
      <form class="spelling-form ${answered ? (question.correct ? "is-correct" : "is-wrong") : ""}" data-form="spelling">
        <label class="sr-only" for="spelling-answer">영어 철자 입력</label>
        <input id="spelling-answer" name="answer" type="text" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="영어 단어 입력" value="${escapeHTML(question.typedValue)}" ${answered ? "disabled" : ""} autofocus>
        ${answered ? "" : `<button type="submit">확인</button>`}
      </form>
      ${!answered ? `<button class="hint-button" type="button" data-action="show-hint">${question.hint ? `${escapeHTML(question.target.word[0])}${" ·".repeat(Math.max(1, question.target.word.length - 2))} ${escapeHTML(question.target.word.at(-1))}` : "철자 힌트"}</button>` : ""}
    ` : `
      <div class="quiz-options">
        ${question.options.map((option, index) => {
          let className = "quiz-option";
          if (answered && option.id === String(question.target.id)) className += " is-correct";
          if (answered && option.id === question.selectedValue && !question.correct) className += " is-wrong";
          return `<button class="${className}" type="button" data-action="challenge-answer" data-value="${escapeHTML(option.id)}" ${answered ? "disabled" : ""}><strong>${escapeHTML(option.label)}</strong><span>${index + 1}</span></button>`;
        }).join("")}
      </div>
    `;

    workspace.innerHTML = `
      <section class="study-shell challenge-shell view-enter">
        <header class="study-header">
          <button class="back-button" type="button" data-action="exit-session" aria-label="학습실로 돌아가기">←</button>
          <div class="session-progress"><span style="width:${progress}%"></span></div>
          <span class="session-count">${quizSession.index + 1} / ${quizSession.questions.length}</span>
        </header>
        <div class="challenge-status">
          <span>ACT 03 · RECALL SPRINT</span>
          <strong class="combo-pulse ${quizSession.combo >= 2 ? "is-hot" : ""}">×${quizSession.combo} COMBO</strong>
          <small>${formatNumber(quizSession.score)} PTS</small>
        </div>
        <div class="quiz-panel challenge-panel">
          <div class="quiz-prompt">
            <span class="challenge-type">${challengeModeName(question.mode)}</span>
            ${challengePrompt(question)}
          </div>
          ${optionMarkup}
          ${answered ? `
            <div class="quiz-feedback ${question.correct ? "is-correct" : "is-wrong"}">
              <div><strong>${question.correct ? `정확해요 · ${quizSession.combo}콤보` : `정답은 ‘${escapeHTML(question.target.word)}’`}</strong><small>${escapeHTML(question.target.meaning)} · ${escapeHTML(wordContext(question.target))}</small></div>
              <button class="next-button" type="button" data-action="challenge-next">${quizSession.index === quizSession.questions.length - 1 ? "기억 결과" : "다음 도전"} →</button>
            </div>
          ` : `<div class="quiz-feedback"><div><strong>정답을 머릿속에서 먼저 꺼내 보세요.</strong><small>읽기보다 회상할 때 기억 간격이 더 분명해집니다.</small></div></div>`}
        </div>
      </section>
    `;
    if (question.mode === "spelling" && !answered) {
      window.setTimeout(() => document.getElementById("spelling-answer")?.focus(), 80);
    }
  }

  function answerChallenge(value) {
    if (!quizSession) return;
    const question = quizSession.questions[quizSession.index];
    if (question.correct !== null) return;
    const typed = question.mode === "spelling";
    const normalizedValue = String(value || "").trim().toLowerCase();
    const correct = typed
      ? normalizedValue === question.target.word.toLowerCase()
      : String(value) === String(question.target.id);
    question.selectedValue = typed ? normalizedValue : String(value);
    question.typedValue = typed ? String(value || "").trim() : "";
    question.correct = correct;
    question.responseMs = Math.max(1, Date.now() - (question.startedAt || Date.now()));
    if (correct) {
      quizSession.combo += 1;
      quizSession.maxCombo = Math.max(quizSession.maxCombo, quizSession.combo);
      const speedBonus = question.hint ? 0 : question.responseMs <= 2600 ? 45 : question.responseMs <= 5000 ? 20 : 0;
      quizSession.score += 100 + speedBonus + Math.min(80, quizSession.combo * 12);
      addXP(Math.min(10, quizSession.combo * 2));
    } else {
      quizSession.combo = 0;
    }
    const scheduled = recordPerformance(question.target, {
      correct,
      responseMs: question.responseMs,
      hintUsed: question.hint,
      phase: question.mode
    }, "challenge");
    quizSession.answers.push({ word: question.target, correct, dueAt: scheduled.dueAt, responseMs: question.responseMs, hintUsed: question.hint });
    playTone(correct ? "correct" : "wrong", quizSession.combo);
    announce(correct ? `${quizSession.combo}콤보` : `정답은 ${question.target.word}`);
    renderChallenge();
  }

  function finishChallenge() {
    const source = quizSession;
    const correctCount = source.answers.filter(answer => answer.correct).length;
    const scorePercent = Math.round((correctCount / source.questions.length) * 100);
    const completion = completeSession(source.kind, source.sourceWords, correctCount, {
      maxCombo: source.maxCombo,
      score: source.score,
      reviewMode: source.reviewMode,
      answerCount: source.questions.length
    });
    resultSession = {
      kind: source.kind,
      words: source.sourceWords,
      correct: correctCount,
      questionCount: source.questions.length,
      mistakes: source.answers.filter(answer => !answer.correct).map(answer => answer.word),
      maxCombo: source.maxCombo,
      points: source.score,
      score: scorePercent,
      xpEarned: state.xp - source.xpStart,
      unlocked: completion.unlocked,
      scanSummary: source.scanSummary,
      averageResponseMs: source.answers.length
        ? Math.round(source.answers.reduce((sum, answer) => sum + (answer.responseMs || 0), 0) / source.answers.length)
        : 0
    };
    quizSession = null;
    currentView = "result";
    renderResult();
    playTone("complete");
    if (scorePercent >= 80) celebrate();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function nextChallenge() {
    if (!quizSession) return;
    const question = quizSession.questions[quizSession.index];
    if (question.correct === null) return;
    if (quizSession.index >= quizSession.questions.length - 1) {
      finishChallenge();
      return;
    }
    quizSession.index += 1;
    renderChallenge();
  }

  function renderResult() {
    if (!resultSession) {
      setView("studio");
      return;
    }
    const title = resultSession.score >= 90
      ? "기억이 한 단계 멀리 갔어요."
      : resultSession.score >= 60
        ? "좋아요, 헷갈린 연결만 다듬어요."
        : "지금 틀린 단어가 가장 좋은 복습 재료예요.";
    const nextReviews = resultSession.words
      .map(word => ({ word, progress: getProgress(word.id) }))
      .sort((a, b) => (a.progress.dueAt || Infinity) - (b.progress.dueAt || Infinity))
      .slice(0, 3);
    workspace.innerHTML = `
      <section class="result-view view-enter">
        <p class="eyebrow">PROOF COMPLETE / SCHEDULED AUTOMATICALLY</p>
        <div class="result-orbit"><div class="result-score">${resultSession.score}<small>RECALL / 100</small></div></div>
        <h1>${title}</h1>
        <p>${resultSession.mistakes.length ? `${resultSession.mistakes.length}개 단어는 10분 복습 대기열로 보냈습니다.` : "정답과 힌트 사용, 간격을 둔 복습 기록으로 다음 복습 시점을 자동 배정했습니다."}</p>
        <div class="result-metrics">
          <span><small>평균 응답</small><strong>${resultSession.averageResponseMs ? `${(resultSession.averageResponseMs / 1000).toFixed(1)}초` : "–"}</strong></span>
          <span><small>최고 연속 회상</small><strong>×${resultSession.maxCombo}</strong></span>
          <span><small>혼합 문제</small><strong>${resultSession.correct}/${resultSession.questionCount}</strong></span>
        </div>
        ${resultSession.scanSummary ? `<div class="scan-result-strip"><span><small>한 번에 훑음</small><strong>${resultSession.scanSummary.batch}</strong></span><span><small>학습 빈틈</small><strong>${resultSession.scanSummary.discovered}</strong></span><span><small>묶음 통과</small><strong>${resultSession.scanSummary.skipped}</strong></span></div>` : ""}
        ${resultSession.unlocked.map(badge => `<div class="badge-unlock"><span>${badge.icon}</span><div><small>NEW MEMORY MARK</small><strong>${escapeHTML(badge.name)}</strong><p>${escapeHTML(badge.desc)}</p></div></div>`).join("")}
        <div class="next-review-strip">
          <p class="eyebrow">NEXT RETURN</p>
          ${nextReviews.map(item => `<span><strong>${escapeHTML(item.word.word)}</strong><small>${Engine.reviewLabel(item.progress)}</small></span>`).join("")}
        </div>
        <div class="result-actions">
          ${resultSession.mistakes.length ? `<button class="secondary-action" type="button" data-action="repeat-mistakes">헷갈린 단어만 다시</button>` : ""}
          ${state.pendingWords.length ? `<button class="primary-action dark" type="button" data-action="continue-pending">남은 빈틈 ${state.pendingWords.length}개 이어가기</button>` : resultSession.scanSummary ? `<button class="primary-action dark" type="button" data-action="scan-next-batch">다음 묶음 훑기</button>` : ""}
          <button class="secondary-action" type="button" data-action="finish-result">학습실로 돌아가기</button>
        </div>
      </section>
    `;
  }

  function strengthMarkup(strength) {
    return `<span class="strength-mark" aria-label="기억 강도 ${strength}/5">${Array.from({ length: 5 }, (_, index) => `<i class="${index < strength ? "is-on" : ""}"></i>`).join("")}</span>`;
  }

  function getFilteredWords() {
    const normalized = archiveQuery.trim().toLowerCase();
    const filtered = WORDLINE_WORDS.filter(word => {
      if (archiveStage !== "all" && word.stageId !== archiveStage) return false;
      const progress = getProgress(word.id);
      if (archiveStatus === "due" && !Engine.isDue(progress)) return false;
      if (archiveStatus === "weak" && !(progress.seen > 0 && progress.strength < 4)) return false;
      if (archiveStatus === "new" && progress.seen > 0) return false;
      if (archiveStatus === "mastered" && progress.strength < 4) return false;
      if (archiveStatus === "bookmarked" && !state.bookmarks.includes(String(word.id))) return false;
      if (!normalized) return true;
      return [word.word, word.meaning, word.example, word.exampleMeaning, word.definitionEn, word.unitTitle]
        .some(value => String(value ?? "").toLowerCase().includes(normalized));
    });
    if (!normalized) return filtered;
    const rank = word => {
      const headword = word.word.toLowerCase();
      if (headword === normalized) return 0;
      if (headword.startsWith(normalized)) return 1;
      if (word.meaning.toLowerCase().includes(normalized)) return 2;
      return 3;
    };
    return filtered.sort((a, b) => rank(a) - rank(b));
  }

  function archiveListMarkup() {
    const filtered = getFilteredWords();
    const visible = filtered.slice(0, archiveLimit);
    return `
      <div class="archive-meta"><span>${formatNumber(filtered.length)} WORDS</span><span>NEXT MEMORY</span></div>
      ${visible.length ? `
        <div class="word-table">
          ${visible.map((word, index) => {
            const progress = getProgress(word.id);
            return `
              <button class="word-row" type="button" data-word-id="${escapeHTML(word.id)}">
                <span class="word-index">${String(index + 1).padStart(3, "0")}</span>
                <strong class="word-en">${state.bookmarks.includes(String(word.id)) ? "★ " : ""}${escapeHTML(word.word)}</strong>
                <span class="word-kr">${escapeHTML(word.meaning)}</span>
                <span class="word-example">${escapeHTML(wordContext(word))}</span>
                <span class="review-timing">${Engine.reviewLabel(progress)}</span>
                ${strengthMarkup(progress.strength)}
              </button>
            `;
          }).join("")}
        </div>
        ${filtered.length > visible.length ? `<button class="load-more" type="button" data-action="load-more">${Math.min(60, filtered.length - visible.length)}개 더 보기</button>` : ""}
      ` : `<div class="no-results">검색 조건에 맞는 단어가 없습니다.</div>`}
    `;
  }

  function refreshArchiveList() {
    const target = document.getElementById("archive-list-area");
    if (target) target.innerHTML = archiveListMarkup();
  }

  function renderArchive() {
    workspace.innerHTML = `
      <section class="wide-view view-enter">
        <header class="view-heading">
          <div><p class="eyebrow">WORD ARCHIVE / MEMORY FILTERS</p><h1><em>${formatNumber(WORDLINE_WORDS.length)}개의 단어</em>를<br>지금 필요한 순서로 봅니다.</h1></div>
          <p>전체 목록을 외우는 대신, 복습 시점·약한 연결·새 단어·북마크만 골라서 학습할 수 있습니다.</p>
        </header>
        <div class="archive-controls">
          <label class="search-wrap"><span class="sr-only">단어 검색</span><input class="search-input" id="word-search" type="search" autocomplete="off" placeholder="영어, 뜻, 예문으로 찾기" value="${escapeHTML(archiveQuery)}"></label>
          <div class="stage-filter" aria-label="단계 필터">
            <button class="filter-chip ${archiveStage === "all" ? "is-active" : ""}" type="button" data-filter-stage="all">전체</button>
            ${WORDLINE_CURRICULUM.map(stage => `<button class="filter-chip ${archiveStage === stage.id ? "is-active" : ""}" type="button" data-filter-stage="${stage.id}">${escapeHTML(stage.name)}</button>`).join("")}
          </div>
          <div class="status-filter" aria-label="기억 상태 필터">
            ${[
              ["all", "모든 상태"], ["due", "지금 복습"], ["weak", "약한 연결"], ["new", "새 단어"], ["mastered", "장기 기억"], ["bookmarked", "★ 북마크"]
            ].map(([id, label]) => `<button class="status-chip ${archiveStatus === id ? "is-active" : ""}" type="button" data-filter-status="${id}">${label}</button>`).join("")}
          </div>
        </div>
        <div id="archive-list-area">${archiveListMarkup()}</div>
      </section>
    `;
  }

  function getWeekDays() {
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      return date;
    });
  }

  function renderReport() {
    const stats = overallStats();
    const forecast = Engine.reviewForecast(WORDLINE_WORDS, state.progress);
    const masteryPercent = Math.round((stats.mastered / stats.total) * 100);
    const learningPercent = Math.round((stats.learning / stats.total) * 100);
    const weekDays = getWeekDays();
    const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];
    workspace.innerHTML = `
      <section class="wide-view view-enter">
        <header class="view-heading">
          <div><p class="eyebrow">MEMORY RECORD</p><h1>외운 양보다<br><em>다시 떠올릴 시점</em>을 봅니다.</h1></div>
          <p>기억 추정치는 복습 일정을 위한 단순 계산값이며 실제 기억력을 측정한 확률이 아닙니다. 틀리면 10분 뒤, 힌트를 쓰면 하루 이내 다시 확인합니다. 장기 기억은 날짜를 달리한 회상 성공이 3회 이상 쌓여야 집계합니다.</p>
        </header>
        <div class="report-grid">
          <div class="report-primary">
            <div class="report-title-row"><div><p class="eyebrow">LONG-TERM MEMORY</p><h2 class="big-number">${formatNumber(stats.mastered)}<small>/ ${formatNumber(stats.total)} 단어</small></h2></div><div class="report-retention"><strong>${averageRetention() || "–"}<small>%</small></strong><span>현재 기억 추정치</span></div></div>
            <div class="mastery-bar"><span class="mastered" style="width:${masteryPercent}%"></span><span class="learning" style="width:${learningPercent}%"></span></div>
            <div class="legend"><span class="mastered-key">장기 기억 ${formatNumber(stats.mastered)}</span><span class="learning-key">학습 중 ${formatNumber(stats.learning)}</span><span>아직 만나지 않음 ${formatNumber(stats.total - stats.seen)}</span></div>
            <h3 class="week-title">이번 주 학습 리듬</h3>
            <div class="week-strip">
              ${weekDays.map((day, index) => {
                const key = dateKey(day);
                const activity = state.daily[key];
                const classes = ["day-cell"];
                if (key === dateKey()) classes.push("is-today");
                if (activity?.words) classes.push("has-study");
                return `<div class="${classes.join(" ")}"><span>${dayLabels[index]}</span><strong>${day.getDate()}</strong><small>${activity?.words ? `${activity.words} WORDS` : "REST"}</small></div>`;
              }).join("")}
            </div>
            <div class="review-forecast-report">
              <p class="eyebrow">FORGETTING CURVE QUEUE</p>
              <div><span><strong>${forecast.overdue}</strong><small>지금 복습</small></span><span><strong>${forecast.today}</strong><small>오늘 안</small></span><span><strong>${forecast.tomorrow}</strong><small>내일</small></span><span><strong>${forecast.week}</strong><small>7일 안</small></span></div>
            </div>
          </div>
          <aside class="report-aside">
            <p class="eyebrow">RADAR EFFICIENCY</p>
            <div class="learner-level"><span>${formatNumber(state.scannedKnown)}</span><strong>묶음 통과 단어</strong><small>발견한 실제 빈틈 ${formatNumber(state.discoveredUnknown)}개</small><i><b style="width:${Math.min(100, state.scannedKnown ? (state.scannedKnown / Math.max(1, state.scannedKnown + state.discoveredUnknown)) * 100 : 0)}%"></b></i></div>
            <div class="metric-line"><span>CURRENT STREAK</span><strong>${state.streak}일</strong><small>최고 ${state.bestStreak}일</small></div>
            <div class="metric-line"><span>RECALL ACCURACY</span><strong>${stats.accuracy}%</strong><small>${formatNumber(stats.answers)}번의 회상 기록</small></div>
            <div class="stage-report"><p class="eyebrow">BY CEFR STAGE</p>${WORDLINE_CURRICULUM.map(stage => { const progress = stageStats(stage); return `<div class="stage-report-row"><span>${escapeHTML(stage.name)}</span><span>${formatNumber(progress.mastered)} / ${formatNumber(progress.total)}</span></div>`; }).join("")}</div>
          </aside>
        </div>
        <section class="badge-section">
          <div><p class="eyebrow">MEMORY MARKS</p><h2>숫자보다 기억에 남는 이정표</h2></div>
          <div class="badge-line">${BADGES.map(badge => { const unlocked = state.badges.includes(badge.id); return `<div class="memory-badge ${unlocked ? "is-unlocked" : ""}"><span>${badge.icon}</span><strong>${escapeHTML(badge.name)}</strong><small>${escapeHTML(badge.desc)}</small></div>`; }).join("")}</div>
        </section>
      </section>
    `;
  }

  function openWordDialog(wordId) {
    const word = findWord(wordId);
    if (!word) return;
    const progress = getProgress(word.id);
    const bookmarked = state.bookmarks.includes(String(word.id));
    dialogContent.innerHTML = `
      <p class="eyebrow">${escapeHTML(word.cefr)} · ${escapeHTML(word.unitTitle)} · ${escapeHTML(word.pos)}</p>
      <h2 class="dialog-word" id="dialog-word">${escapeHTML(word.word)}</h2>
      ${word.ipa ? `<p class="phonetic" style="text-align:left">${escapeHTML(word.ipa)}</p>` : ""}
      <p class="dialog-meaning">${escapeHTML(word.meaning)}</p>
      <p class="dialog-example">${escapeHTML(wordContext(word))}</p>
      <p class="dialog-example-kr">${word.exampleMeaning ? escapeHTML(word.exampleMeaning) : word.example ? "문맥 속 용례" : "영어 사전식 풀이"}</p>
      <div class="word-memory-readout"><span><small>기억 추정치</small><strong>${progress.seen ? `${Math.round(Engine.retrievability(progress) * 100)}%` : "첫 학습 전"}</strong></span><span><small>다음 복습</small><strong>${Engine.reviewLabel(progress)}</strong></span></div>
      <div class="dialog-actions">
        <button class="text-button" type="button" data-dialog-action="speak" data-word="${escapeHTML(word.word)}">발음 듣기</button>
        <button class="text-button" type="button" data-dialog-action="bookmark" data-word-id="${escapeHTML(word.id)}">${bookmarked ? "★ 북마크 해제" : "☆ 북마크"}</button>
        <button class="text-button" type="button" data-dialog-action="learn" data-word-id="${escapeHTML(word.id)}">이 단어 학습</button>
        <button class="text-button" type="button" data-dialog-action="recall" data-word-id="${escapeHTML(word.id)}">회상 확인</button>
        <button class="text-button" type="button" data-dialog-action="mark-known" data-word-id="${escapeHTML(word.id)}">아는 단어 · 나중에 확인</button>
      </div>
      <div style="margin-top:24px">${strengthMarkup(progress.strength)}</div>
    `;
    if (!wordDialog.open) {
      if (typeof wordDialog.showModal === "function") wordDialog.showModal();
      else wordDialog.setAttribute("open", "");
    }
  }

  function speak(text) {
    if (!("speechSynthesis" in window)) {
      showToast("이 브라우저에서는 발음을 재생할 수 없습니다.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.82;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }

  function openSettings() {
    document.getElementById("session-options").innerHTML = SESSION_OPTIONS.map(minutes => `
      <button class="goal-option ${state.sessionMinutes === minutes ? "is-active" : ""}" type="button" data-session-minutes="${minutes}" aria-pressed="${state.sessionMinutes === minutes}">${minutes}분</button>
    `).join("");
    const soundToggle = document.getElementById("sound-toggle");
    const autoSpeakToggle = document.getElementById("auto-speak-toggle");
    soundToggle.setAttribute("aria-checked", String(state.soundEnabled));
    autoSpeakToggle.setAttribute("aria-checked", String(state.autoSpeak));
    soundToggle.classList.toggle("is-on", state.soundEnabled);
    autoSpeakToggle.classList.toggle("is-on", state.autoSpeak);
    if (!settingsDialog.open) {
      if (typeof settingsDialog.showModal === "function") settingsDialog.showModal();
      else settingsDialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  document.querySelectorAll("[data-view]").forEach(button => {
    button.addEventListener("click", () => setView(button.dataset.view));
  });

  document.getElementById("profile-button").addEventListener("click", openSettings);
  document.getElementById("dialog-close").addEventListener("click", () => closeDialog(wordDialog));
  document.getElementById("settings-close").addEventListener("click", () => closeDialog(settingsDialog));

  [wordDialog, settingsDialog].forEach(dialog => {
    dialog.addEventListener("click", event => {
      if (event.target === dialog) closeDialog(dialog);
    });
  });

  document.getElementById("session-options").addEventListener("click", event => {
    const button = event.target.closest("[data-session-minutes]");
    if (!button) return;
    state.sessionMinutes = Number(button.dataset.sessionMinutes);
    saveState();
    openSettings();
    showToast(`${state.sessionMinutes}분 집중으로 바꿨습니다. 분량은 자동 계산됩니다.`);
    if (currentView === "studio") renderStudio();
  });

  document.getElementById("sound-toggle").addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    openSettings();
    if (state.soundEnabled) playTone("correct", 1);
  });

  document.getElementById("auto-speak-toggle").addEventListener("click", () => {
    state.autoSpeak = !state.autoSpeak;
    saveState();
    openSettings();
  });

  document.getElementById("reset-progress").addEventListener("click", () => {
    const confirmed = window.confirm("진단 결과, 기억 간격, 경험치와 학습 기록을 모두 지울까요? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmed) return;
    placementSession = scanSession = studySession = quizSession = resultSession = null;
    state = defaultState();
    saveState();
    closeDialog(settingsDialog);
    setView("studio");
    showToast("학습 기록을 초기화했습니다.");
  });

  dialogContent.addEventListener("click", event => {
    const button = event.target.closest("[data-dialog-action]");
    if (!button) return;
    if (button.dataset.dialogAction === "speak") {
      speak(button.dataset.word);
      return;
    }
    const word = findWord(button.dataset.wordId);
    if (!word) return;
    if (button.dataset.dialogAction === "bookmark") {
      const id = String(word.id);
      if (state.bookmarks.includes(id)) state.bookmarks = state.bookmarks.filter(item => item !== id);
      else state.bookmarks.push(id);
      saveState();
      openWordDialog(word.id);
      if (currentView === "archive") refreshArchiveList();
    } else if (["learn", "recall"].includes(button.dataset.dialogAction)) {
      closeDialog(wordDialog);
      state.onboardingComplete = true;
      if (button.dataset.dialogAction === "learn") startStudy([word]);
      else startChallenge([word], {kind:"study"});
    } else if (button.dataset.dialogAction === "mark-known") {
      state.progress[word.id] = Engine.markKnown(getProgress(word.id), { verified: false });
      saveState();
      openWordDialog(word.id);
      showToast(`다음 복습: ${Engine.reviewLabel(getProgress(word.id))}`);
      if (currentView === "archive") refreshArchiveList();
    }
  });

  workspace.addEventListener("input", event => {
    if (event.target.id === "spelling-answer" && quizSession) { quizSession.questions[quizSession.index].typedValue = event.target.value; checkpointSession(); return; }
    if (event.target.id !== "word-search") return;
    archiveQuery = event.target.value;
    archiveLimit = 60;
    refreshArchiveList();
  });

  workspace.addEventListener("submit", event => {
    if (!event.target.matches('[data-form="spelling"]')) return;
    event.preventDefault();
    const data = new FormData(event.target);
    answerChallenge(data.get("answer"));
  });

  workspace.addEventListener("click", event => {
    const actionButton = event.target.closest("[data-action]");
    if (actionButton) {
      const action = actionButton.dataset.action;
      if (action === "resume-session") resumeSession();
      else if (action === "continue-pending") startStudy(state.pendingWords.map(findWord).filter(Boolean).slice(0, Engine.SESSION_PRESETS[state.sessionMinutes].capacity).map(word => ({word,kind:"new"})), {mission:true});
      else if (action === "listening-fallback" && quizSession) {
        const question = quizSession.questions[quizSession.index];
        if (question.correct === null) { question.mode = "reverse"; question.startedAt = Date.now(); renderChallenge(); }
      }
      else if (action === "start-placement") startPlacement();
      else if (action === "retry-placement") startPlacement();
      else if (action === "cancel-placement") setView("onboarding");
      else if (action === "placement-toggle") {
        const id = String(actionButton.dataset.wordId);
        if (placementSession.selectedIds.has(id)) placementSession.selectedIds.delete(id);
        else placementSession.selectedIds.add(id);
        renderPlacement();
      }
      else if (action === "placement-scan-next") preparePlacementVerification();
      else if (action === "placement-answer") answerPlacement(actionButton.dataset.value);
      else if (action === "placement-next") nextPlacement();
      else if (action === "confirm-placement") {
        state.currentStage = placementSession.resultStage.id;
        state.placement = { score: placementSession.score, stageId: placementSession.resultStage.id, completedAt: Date.now() };
        state.onboardingComplete = true;
        state.pendingSession = null;
        addXP(30);
        saveState();
        placementSession = null;
        currentView = "studio";
        renderStudio();
      }
      else if (action === "start-a1") {
        placementSession = null;
        state.pendingSession = null;
        state.currentStage = "a1";
        state.onboardingComplete = true;
        saveState();
        currentView = "studio";
        renderStudio();
      }
      else if (action === "start-mission" || action === "start-scan") startScan();
      else if (action === "start-review") {
        const due = getDueWords().slice(0, Engine.SESSION_PRESETS[state.sessionMinutes].capacity);
        startChallenge(due, { kind: "review", reviewMode: true });
      }
      else if (action === "quick-challenge") {
        const plan = getDailyPlan();
        const pool = uniqueWords([...getDueWords(), ...plan.words, ...getCurrentUnit(getStage()).words]);
        startChallenge(pool.slice(0, state.sessionMinutes === 5 ? 3 : state.sessionMinutes === 15 ? 6 : 5), { kind: "quick" });
      }
      else if (action === "open-stage-archive") {
        archiveStage = state.currentStage;
        archiveStatus = "all";
        archiveQuery = "";
        archiveLimit = 60;
        setView("archive");
      }
      else if (action === "advance-stage") {
        state.currentStage = actionButton.dataset.stage;
        saveState();
        renderStudio();
      }
      else if (action === "exit-session") setView("studio");
      else if (action === "toggle-scan-word") toggleScanWord(actionButton.dataset.wordId);
      else if (action === "scan-all-unknown") {
        if (scanSession) {
          scanSession.words.forEach(word => scanSession.selectedIds.add(String(word.id)));
          renderScan();
        }
      }
      else if (action === "scan-verify") prepareScanVerification();
      else if (action === "scan-verification-answer") answerScanVerification(actionButton.dataset.value);
      else if (action === "scan-verification-next") nextScanVerification();
      else if (action === "scan-next-batch") {
        resultSession = null;
        scanSession = null;
        startScan();
      }
      else if (action === "speak") speak(actionButton.dataset.word);
      else if (action === "reveal") {
        studySession.revealed = true;
        renderStudy();
      }
      else if (action === "continue-learning") answerStudy();
      else if (action === "challenge-answer") answerChallenge(actionButton.dataset.value);
      else if (action === "challenge-next") nextChallenge();
      else if (action === "show-hint") {
        if (quizSession) {
          quizSession.questions[quizSession.index].hint = true;
          renderChallenge();
        }
      }
      else if (action === "repeat-mistakes") startStudy(resultSession.mistakes.map(word => ({ word, kind: "review" })), { reviewMode: true });
      else if (action === "finish-result") setView("studio");
      else if (action === "load-more") {
        archiveLimit += 60;
        refreshArchiveList();
      }
      return;
    }

    const stageButton = event.target.closest("[data-stage]");
    if (stageButton) {
      state.currentStage = stageButton.dataset.stage;
      saveState();
      renderStudio();
      return;
    }

    const stageFilter = event.target.closest("[data-filter-stage]");
    if (stageFilter) {
      archiveStage = stageFilter.dataset.filterStage;
      archiveLimit = 60;
      renderArchive();
      return;
    }

    const statusFilter = event.target.closest("[data-filter-status]");
    if (statusFilter) {
      archiveStatus = statusFilter.dataset.filterStatus;
      archiveLimit = 60;
      renderArchive();
      return;
    }

    const wordButton = event.target.closest("[data-word-id]");
    if (wordButton) openWordDialog(wordButton.dataset.wordId);
  });

  document.addEventListener("keydown", event => {
    const activeTag = document.activeElement?.tagName;
    const isTyping = ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);
    if (wordDialog.open || settingsDialog.open || event.repeat || event.isComposing) return;
    if (["BUTTON", "A"].includes(activeTag) && ["Enter", " "].includes(event.key)) return;
    if (!isTyping && ["Enter", " "].includes(event.key)) event.preventDefault();

    if (currentView === "study" && studySession && !isTyping) {
      if (event.code === "Space" && !studySession.revealed) {
        event.preventDefault();
        studySession.revealed = true;
        renderStudy();
      } else if (!studySession.revealed && event.key.toLowerCase() === "s") {
        speak(studySession.items[studySession.index].word.word);
      } else if (studySession.revealed && event.key === "Enter") {
        answerStudy();
      }
    }

    if (currentView === "placement" && placementSession && !placementSession.resultStage && !isTyping) {
      if (placementSession.phase === "scan" && event.key === "Enter") preparePlacementVerification();
      else if (placementSession.phase === "verify") {
        const question = placementSession.questions[placementSession.index];
        const numeric = Number(event.key);
        if (question.selectedId === null && numeric >= 1 && numeric <= question.options.length) answerPlacement(question.options[numeric - 1].id);
        else if (question.selectedId !== null && event.key === "Enter") nextPlacement();
      }
    }

    if (currentView === "scan" && scanSession && !isTyping) {
      if (scanSession.phase === "scan" && event.key === "Enter") prepareScanVerification();
      else if (scanSession.phase === "verify") {
        const question = scanSession.questions[scanSession.index];
        const numeric = Number(event.key);
        if (question.selectedId === null && numeric >= 1 && numeric <= question.options.length) answerScanVerification(question.options[numeric - 1].id);
        else if (question.selectedId !== null && event.key === "Enter") nextScanVerification();
      }
    }

    if (currentView === "challenge" && quizSession && !isTyping) {
      const question = quizSession.questions[quizSession.index];
      const numeric = Number(event.key);
      if (question.correct === null && question.mode !== "spelling" && numeric >= 1 && numeric <= question.options.length) {
        answerChallenge(question.options[numeric - 1].id);
      } else if (question.correct !== null && event.key === "Enter") {
        nextChallenge();
      }
    }
  });

  let importing = false;
  let syncingHistory = false;
  function checkpointSession() {
    if (importing) return;
    const sessions = {placement:placementSession, scan:scanSession, study:studySession, challenge:quizSession};
    const active = sessions[currentView];
    if (active) state.pendingSession = JSON.parse(JSON.stringify({view:currentView, session:active}, (_, value) => value instanceof Set ? {setValues:[...value]} : value));
    if (currentView === "result" || (currentView === "scan" && scanSession?.phase === "outcome")) state.pendingSession = null;
    window.LearningData.write(STORAGE_KEY, JSON.stringify(state));
  }

  function resumeSession() {
    const pending = state.pendingSession;
    if (!pending || !["placement","scan","study","challenge"].includes(pending.view)) return false;
    try {
      const session = JSON.parse(JSON.stringify(pending.session), (_, value) => value && Array.isArray(value.setValues) ? new Set(value.setValues) : value);
      const items = session.items || session.questions || session.words;
      if (!Array.isArray(items) || (pending.view === "study" && !session.items[session.index]) || (pending.view === "challenge" && !session.questions[session.index])) throw Error("Invalid saved session");
      placementSession = scanSession = studySession = quizSession = null;
      if (pending.view === "placement") placementSession = session;
      if (pending.view === "scan") scanSession = session;
      if (pending.view === "study") studySession = session;
      if (pending.view === "challenge") { quizSession = session; session.questions[session.index].startedAt = Date.now(); }
      currentView = pending.view;
      render();
      return true;
    } catch (_) {
      state.pendingSession = null; currentView = state.onboardingComplete ? "studio" : "onboarding";
      window.LearningData.warn(); return false;
    }
  }

  function decorateSession() {
    if (["studio","archive","report","onboarding"].includes(currentView) && !workspace.querySelector(".resume-session-banner")) {
      const pending = state.pendingSession;
      if (pending || state.pendingWords.length) workspace.insertAdjacentHTML("afterbegin",
        '<section class="resume-session-banner"><p><b>' + (pending ? "멈춘 학습을 이어가세요." : "골라 둔 빈틈 " + state.pendingWords.length + "개가 남았습니다.") +
        '</b><small>선택한 단어, 답안과 다음 순서를 이 브라우저에 저장합니다.</small></p><button type="button" data-action="' +
        (pending ? "resume-session" : "continue-pending") + '">이어서 학습</button></section>');
    }
    checkpointSession();
    const hash = "#" + currentView;
    if (!syncingHistory && location.hash !== hash) history.pushState({view:currentView}, "", hash);
  }
  new MutationObserver(decorateSession).observe(workspace, {childList:true});
  document.addEventListener("click", checkpointSession);
  document.addEventListener("keydown", checkpointSession);
  window.addEventListener("learning-data-imported", () => { importing = true; });
  window.addEventListener("pagehide", checkpointSession);
  window.addEventListener("popstate", () => {
    checkpointSession();
    syncingHistory = true;
    const view = location.hash.slice(1);
    if (state.pendingSession?.view === view) resumeSession();
    else setView(["studio","archive","report","onboarding"].includes(view) ? view : "studio");
    syncingHistory = false;
  });
  window.LearningData.mount({dialog:settingsDialog, key:STORAGE_KEY, getState:() => { checkpointSession(); return state; },
    validate:value => Boolean(value && [3,4].includes(value.version) && value.progress && typeof value.progress === "object" && !Array.isArray(value.progress) && Array.isArray(value.bookmarks) && Array.isArray(value.sessions))
  });
  if (state.lastActiveDate && ![dateKey(), yesterdayKey()].includes(state.lastActiveDate)) state.streak = 0;
  const initialView = location.hash.slice(1);
  if (["archive", "report"].includes(initialView)) currentView = initialView;
  if (state.pendingSession?.view === initialView && resumeSession()) return;
  updateHeader();
  updateNavigation();
  saveState();
  render();
})();
