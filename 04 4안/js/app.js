/**
 * Master Application Coordinator & History Router (Grammar Master Pro 2.0)
 * Supports browser back/forward buttons, URL hash routing, and explicit in-app back navigation.
 */

const App = (() => {
  let currentLevel = 1;
  let setupChapterId = null;
  let selectedTrainingMode = 'mcq';
  let isNavigatingFromPopstate = false;

  function init() {
    console.log("🚀 Grammar Master Pro 2.0 Booting...");

    // Initialize data
    GrammarData.init();

    // Load user settings
    const settings = Storage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');
    const themeIcon = document.querySelector('.theme-toggle-icon');
    if (themeIcon) themeIcon.textContent = settings.theme === 'dark' ? '☀️' : '🌙';

    Sound.setSoundEnabled(settings.soundEnabled !== false);

    // Setup Routing listeners
    setupRouting();

    // Setup input & keybindings
    setupSearchInput();
    setupKeybindings();

    // Initial state based on URL hash or default to dashboard
    if (window.location.hash) {
      handleHashRouting();
    } else {
      navigate({ screen: 'dashboard' }, false);
    }
  }

  // =========================================================================
  // History & SPA State Router
  // =========================================================================
  function setupRouting() {
    window.addEventListener('popstate', (event) => {
      isNavigatingFromPopstate = true;
      if (event.state) {
        renderState(event.state);
      } else {
        handleHashRouting();
      }
      isNavigatingFromPopstate = false;
    });
  }

  function navigate(state, pushHistory = true) {
    if (pushHistory && !isNavigatingFromPopstate) {
      const hashStr = getHashFromState(state);
      history.pushState(state, '', hashStr);
    }
    renderState(state);
  }

  function getHashFromState(state) {
    if (!state || state.screen === 'dashboard') return '#home';
    if (state.screen === 'curriculum') return `#curriculum-${state.level || 1}`;
    if (state.screen === 'lesson') return `#lesson-${state.chapterId}`;
    if (state.screen === 'training') return `#training-${state.chapterId}`;
    if (state.screen === 'search') return '#search';
    if (state.screen === 'wrong') return '#wrong';
    if (state.screen === 'stats') return '#stats';
    return '#home';
  }

  function handleHashRouting() {
    const rawHash = (window.location.hash || '').replace(/^#/, '');
    if (!rawHash || rawHash === 'home' || rawHash === 'dashboard') {
      renderState({ screen: 'dashboard' });
    } else if (rawHash.startsWith('curriculum')) {
      const lvl = parseInt(rawHash.split('-')[1] || '1', 10);
      renderState({ screen: 'curriculum', level: lvl });
    } else if (rawHash.startsWith('lesson')) {
      const chId = rawHash.replace('lesson-', '');
      renderState({ screen: 'lesson', chapterId: chId });
    } else if (rawHash.startsWith('training')) {
      const chId = rawHash.replace('training-', '');
      renderState({ screen: 'training', chapterId: chId, mode: 'mcq' });
    } else if (rawHash === 'search') {
      renderState({ screen: 'search' });
    } else if (rawHash === 'wrong') {
      renderState({ screen: 'wrong' });
    } else if (rawHash === 'stats') {
      renderState({ screen: 'stats' });
    } else {
      renderState({ screen: 'dashboard' });
    }
  }

  function renderState(state) {
    if (!state || state.screen === 'dashboard') {
      UI.renderDashboard();
      UI.showScreen('dashboard-screen');
    } else if (state.screen === 'curriculum') {
      currentLevel = state.level || 1;
      UI.renderCurriculum(currentLevel);
      UI.showScreen('curriculum-screen');
    } else if (state.screen === 'lesson') {
      LessonViewer.renderLessonContent(state.chapterId);
      UI.showScreen('lesson-screen');
    } else if (state.screen === 'training') {
      Trainer.startTraining(state.chapterId, state.mode || 'mcq');
    } else if (state.screen === 'search') {
      renderSearchResults(state.query || '', state.levelFilter || 'all');
      UI.showScreen('search-screen');
      const input = document.getElementById('search-input');
      if (input) input.focus();
    } else if (state.screen === 'wrong') {
      UI.renderWrongScreen();
      UI.showScreen('wrong-screen');
    } else if (state.screen === 'stats') {
      UI.renderStatsScreen();
      UI.showScreen('stats-screen');
    }
  }

  function goBack() {
    // If there is browser history, navigate back
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback hierarchy
      const active = UI.getActiveScreen();
      if (active === 'training-screen' && setupChapterId) {
        navigate({ screen: 'lesson', chapterId: setupChapterId }, false);
      } else if (active === 'lesson-screen') {
        navigate({ screen: 'curriculum', level: currentLevel }, false);
      } else if (active === 'curriculum-screen' || active === 'search-screen' || active === 'wrong-screen' || active === 'stats-screen') {
        navigate({ screen: 'dashboard' }, false);
      } else {
        navigate({ screen: 'dashboard' }, false);
      }
    }
  }

  // Navigation Trigger Functions
  function goHome() {
    navigate({ screen: 'dashboard' });
  }

  function selectLevelCurriculum(levelNum) {
    currentLevel = parseInt(levelNum, 10);
    navigate({ screen: 'curriculum', level: currentLevel });
  }

  function openLesson(chapterId) {
    const ch = GrammarData.getChapterById(chapterId);
    if (ch) {
      currentLevel = ch.level;
    }
    navigate({ screen: 'lesson', chapterId });
  }

  function goToSearch() {
    navigate({ screen: 'search' });
  }

  function goToWrongScreen() {
    navigate({ screen: 'wrong' });
  }

  function goToStats() {
    navigate({ screen: 'stats' });
  }

  function toggleBookmark(chapterId, btn) {
    const isNowBookmarked = Storage.toggleBookmark(chapterId);
    if (btn) {
      btn.classList.toggle('active', isNowBookmarked);
      btn.textContent = isNowBookmarked ? '⭐' : '☆';
    }
    UI.showToast(isNowBookmarked ? '⭐ 북마크에 추가되었습니다.' : '북마크가 해제되었습니다.', 'info');
  }

  function removeWrongExercise(exId) {
    Storage.clearWrongExercise(exId);
    UI.renderWrongScreen();
    UI.showToast("오답노트에서 삭제되었습니다.", "info");
  }

  // Training Setup Flow
  function startChapterTraining(chapterId, mode = 'mcq') {
    setupChapterId = chapterId;
    selectedTrainingMode = mode;
    openTrainingSetupModal(chapterId);
  }

  function openTrainingSetupModal(chapterId) {
    const chapter = GrammarData.getChapterById(chapterId);
    if (!chapter) return;

    setupChapterId = chapterId;
    const titleEl = document.getElementById('setup-chapter-title');
    const descEl = document.getElementById('setup-chapter-desc');
    if (titleEl) titleEl.textContent = `${chapter.icon} ${chapter.title}`;
    if (descEl) descEl.textContent = chapter.subtitle;

    const modal = document.getElementById('training-setup-modal');
    if (modal) modal.classList.add('active');
  }

  function closeTrainingSetupModal() {
    const modal = document.getElementById('training-setup-modal');
    if (modal) modal.classList.remove('active');
  }

  function selectMode(mode, element) {
    selectedTrainingMode = mode;
    const cards = document.querySelectorAll('.mode-card');
    cards.forEach(c => c.classList.remove('active'));
    if (element) element.classList.add('active');
  }

  function launchTrainingFromModal() {
    closeTrainingSetupModal();
    if (setupChapterId) {
      navigate({ screen: 'training', chapterId: setupChapterId, mode: selectedTrainingMode });
    }
  }

  function launchWrongReviewTraining() {
    const wrongMap = Storage.getWrongExercises();
    const wrongList = Object.values(wrongMap);
    if (wrongList.length === 0) {
      UI.showToast("풀어야 할 오답이 없습니다.", "info");
      return;
    }

    // Build synthetic chapter for wrong review
    navigate({ screen: 'training', chapterId: 'wrong_review_session', mode: 'mcq' });
  }

  function confirmExitTraining() {
    if (confirm("정말로 훈련을 종료하시겠습니까? (진행 상황이 저장됩니다)")) {
      goBack();
    }
  }

  // Settings Modal
  function openSettingsModal() {
    const settings = Storage.getSettings();
    const soundCheck = document.getElementById('setting-sound');
    const goalInput = document.getElementById('setting-daily-goal');

    if (soundCheck) soundCheck.checked = settings.soundEnabled !== false;
    if (goalInput) goalInput.value = settings.dailyGoal || 5;

    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.add('active');
  }

  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('active');
  }

  function saveSettings() {
    const soundCheck = document.getElementById('setting-sound');
    const goalInput = document.getElementById('setting-daily-goal');

    const settings = Storage.getSettings();
    settings.soundEnabled = soundCheck ? soundCheck.checked : true;
    settings.dailyGoal = goalInput ? parseInt(goalInput.value, 10) : 5;

    Sound.setSoundEnabled(settings.soundEnabled);
    Storage.saveSettings(settings);

    closeSettingsModal();
    UI.showToast("설정이 저장되었습니다.", "info");
    UI.renderDashboard();
  }

  function resetAllData() {
    if (confirm("⚠️ 모든 학습 진도와 오답노트가 초기화됩니다. 계속하시겠습니까?")) {
      Storage.resetAll();
      closeSettingsModal();
      UI.showToast("데이터가 성공적으로 초기화되었습니다.", "info");
      goHome();
    }
  }

  // Search Logic
  function setupSearchInput() {
    const input = document.getElementById('search-input');
    const levelSelect = document.getElementById('search-level-filter');
    if (!input) return;

    input.addEventListener('input', (e) => {
      const lvl = levelSelect ? levelSelect.value : 'all';
      renderSearchResults(e.target.value, lvl);
    });

    if (levelSelect) {
      levelSelect.addEventListener('change', (e) => {
        renderSearchResults(input.value, e.target.value);
      });
    }
  }

  function renderSearchResults(query, levelFilter = 'all') {
    const container = document.getElementById('search-results-list');
    const countEl = document.getElementById('search-results-count');
    if (!container) return;

    const results = GrammarData.searchChapters(query, levelFilter);
    if (countEl) countEl.textContent = `${results.length}개 챕터 검색됨`;

    if (results.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-emoji">🔍</div>
          <h3>검색 결과가 없습니다</h3>
          <p>다른 문법 키워드(예: 가정법, 도치, 수동태, 관계사 등)를 검색해보세요.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = results.map(ch => `
      <div class="search-result-card" onclick="App.openLesson('${ch.id}')" style="background:var(--bg-surface); border:1px solid var(--border-color); border-radius:var(--radius-lg); padding:16px 18px; margin-bottom:10px; cursor:pointer;">
        <div class="search-card-header" style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <span class="badge-level level-${ch.level}">${ch.levelCode}</span>
          <span class="search-card-title" style="font-weight:800; font-size:1rem;">${ch.icon} ${ch.title}</span>
        </div>
        <p class="search-card-sub" style="font-size:0.85rem; color:var(--text-muted); margin-bottom:6px;">${ch.subtitle}</p>
        <p class="search-card-summary" style="font-size:0.88rem; color:var(--text-sub); line-height:1.4;">${ch.summary}</p>
      </div>
    `).join('');
  }

  function setupKeybindings() {
    document.addEventListener('keydown', (e) => {
      // Ignore in input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      // Escape key to go back or close modals
      if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal-overlay.active');
        if (activeModal) {
          activeModal.classList.remove('active');
        } else {
          goBack();
        }
        return;
      }

      if (e.key >= '1' && e.key <= '4') {
        const mcqBtn = document.getElementById(`mcq-opt-${parseInt(e.key, 10) - 1}`);
        if (mcqBtn && !mcqBtn.disabled) {
          mcqBtn.click();
        }
      }
    });
  }

  function getCurrentLevel() {
    return currentLevel;
  }

  return {
    init,
    navigate,
    goBack,
    goHome,
    selectLevelCurriculum,
    openLesson,
    goToSearch,
    goToWrongScreen,
    goToStats,
    toggleBookmark,
    removeWrongExercise,
    startChapterTraining,
    openTrainingSetupModal,
    closeTrainingSetupModal,
    selectMode,
    launchTrainingFromModal,
    launchWrongReviewTraining,
    confirmExitTraining,
    openSettingsModal,
    closeSettingsModal,
    saveSettings,
    resetAllData,
    getCurrentLevel
  };
})();

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
