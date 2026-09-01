/**
 * Main Application Coordinator (English Master Pro 2.0)
 * Orchestrates navigation, study mode setups, search filters, modal triggers, and global hotkeys.
 */

const App = (() => {
  let currentStudyScope = {
    level: null,
    day: null,
    words: []
  };

  let selectedStudyMode = 'flashcard'; // 'flashcard', 'mcq', 'spelling', 'match', 'sentence', 'listening'
  let selectedDirection = 'en-to-kr';
  let selectedCount = 10;

  function init() {
    console.log('🚀 Initializing English Master Pro 2.0...');

    // 1. Initialize data & speech
    DataManager.init();
    Sound.init();
    UI.initTheme();

    // 2. Render initial dashboard
    UI.renderDashboard();
    UI.showScreen('dashboard-screen');

    // 3. Bind global event listeners
    bindEvents();

    console.log('✨ English Master Pro 2.0 Ready!');
  }

  function bindEvents() {
    // Search input listener
    const searchInput = document.getElementById('word-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const level = document.getElementById('word-level-filter')?.value || 'all';
        const status = document.querySelector('.filter-tab-btn.active')?.dataset.filter || 'all';

        const filtered = DataManager.searchWords({ query, level, filter: status });
        UI.renderWordListScreen(filtered, level, 'all', status);
      });
    }

    // Global keyboard listener
    window.addEventListener('keydown', (e) => {
      // Don't intercept when typing in inputs/textareas
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === 'Escape') {
        UI.closeWordDetailModal();
        PrintManager.closePrintModal();
        closeSettingsModal();
        closeAddWordModal();
        return;
      }

      // Route to active controllers
      FlashcardController.handleKeyboardShortcut(e);
      QuizEngine.handleKeyboardShortcut(e);
    });
  }

  // ===== Navigation =====
  function goHome() {
    currentStudyScope = { level: null, day: null, words: [] };
    UI.renderDashboard();
    UI.showScreen('dashboard-screen');
  }

  function goBack() {
    const active = UI.getActiveScreen();
    if (active === 'flashcard-screen' || active === 'quiz-arena-screen') {
      showStudySetup();
    } else if (active === 'study-setup-screen') {
      if (currentStudyScope.day) {
        selectLevelCurriculum(currentStudyScope.level);
      } else {
        goHome();
      }
    } else {
      goHome();
    }
  }

  function selectLevelCurriculum(level) {
    currentStudyScope.level = level;
    currentStudyScope.day = null;
    currentStudyScope.words = DataManager.getWordsByLevel(level);

    UI.renderCurriculumScreen(level);
    UI.showScreen('curriculum-screen');
  }

  function startDayStudy(level, day) {
    currentStudyScope.level = level;
    currentStudyScope.day = day;
    currentStudyScope.words = DataManager.getWordsByDay(level, day);

    showStudySetup();
  }

  function goToWordList(level = 'all', filter = 'all') {
    const words = DataManager.searchWords({ level, filter });
    UI.renderWordListScreen(words, level, 'all', filter);
    UI.showScreen('wordlist-screen');
  }

  function goToStudy() {
    if (!currentStudyScope.words || currentStudyScope.words.length === 0) {
      currentStudyScope.level = 1;
      currentStudyScope.day = 1;
      currentStudyScope.words = DataManager.getWordsByDay(1, 1);
    }
    showStudySetup();
  }

  function goToWrongWords() {
    UI.renderWrongWordsScreen();
    UI.showScreen('wrong-words-screen');
  }

  function goToBookmarks() {
    goToWordList('all', 'bookmarked');
  }

  function goToStats() {
    UI.renderStatsScreen();
    UI.showScreen('stats-screen');
  }

  // ===== Study Setup Screen =====
  function showStudySetup() {
    const scope = currentStudyScope;
    const words = scope.words && scope.words.length > 0 ? scope.words : DataManager.getWordsByLevel(1);

    const titleEl = document.getElementById('study-setup-title');
    const descEl = document.getElementById('study-setup-desc');

    if (titleEl) {
      if (scope.level && scope.day) {
        titleEl.textContent = `Level ${scope.level} · Day ${scope.day} 학습`;
      } else if (scope.level) {
        titleEl.textContent = `Level ${scope.level} 전체 학습`;
      } else {
        titleEl.textContent = `맞춤 어휘 학습`;
      }
    }

    if (descEl) {
      descEl.textContent = `총 ${words.length}개의 단어가 준비되어 있습니다. 원하는 학습 모드를 선택하세요.`;
    }

    UI.showScreen('study-setup-screen');
  }

  function setStudyMode(mode, btnEl) {
    selectedStudyMode = mode;
    document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }

  function setQuizDirection(dir, btnEl) {
    selectedDirection = dir;
    document.querySelectorAll('.direction-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }

  function setQuizCount(count, btnEl) {
    selectedCount = count;
    document.querySelectorAll('.count-chip-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }

  function launchSelectedStudy() {
    const words = currentStudyScope.words && currentStudyScope.words.length > 0 ?
                  currentStudyScope.words : DataManager.getWordsByLevel(1);

    if (selectedStudyMode === 'flashcard') {
      FlashcardController.startSession(words);
    } else {
      UI.showScreen('quiz-arena-screen');
      QuizEngine.startQuiz({
        mode: selectedStudyMode,
        words,
        direction: selectedDirection,
        count: selectedCount
      });
    }
  }

  function startQuizWithScope(words) {
    currentStudyScope.words = words;
    selectedStudyMode = 'mcq';
    showStudySetup();
  }

  function startQuizFromCurrentScope() {
    selectedStudyMode = 'mcq';
    launchSelectedStudy();
  }

  function startReviewSession() {
    const allWords = DataManager.getAllWords();
    const dueWords = Storage.getDueReviewWords(allWords);

    if (dueWords.length === 0) {
      UI.showToast('오늘 복습할 단어가 없습니다! 대단해요!', 'success');
      return;
    }

    currentStudyScope = {
      level: null,
      day: null,
      words: dueWords
    };

    FlashcardController.startSession(dueWords, () => {
      Storage.unlockBadge('review_hero');
    });
  }

  function clearAllWrongAnswers() {
    if (confirm('오답노트에 있는 모든 단어를 삭제하시겠습니까?')) {
      Storage.clearAllWrongWords();
      UI.renderWrongWordsScreen();
      UI.showToast('오답노트가 초기화되었습니다.', 'info');
    }
  }

  // ===== Dictionary Filter Events =====
  function filterWordsByTab(filter, btnEl) {
    document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    const query = document.getElementById('word-search-input')?.value || '';
    const level = document.getElementById('word-level-filter')?.value || 'all';
    const words = DataManager.searchWords({ query, level, filter });

    UI.renderWordListScreen(words, level, 'all', filter);
  }

  function filterWordsByLevel(level) {
    const query = document.getElementById('word-search-input')?.value || '';
    const status = document.querySelector('.filter-tab-btn.active')?.dataset.filter || 'all';
    const words = DataManager.searchWords({ query, level, filter: status });

    UI.renderWordListScreen(words, level, 'all', status);
  }

  // ===== Settings Modal =====
  function openSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (!modal) return;

    const s = Storage.getSettings();
    document.getElementById('setting-daily-goal').value = s.dailyGoal || 20;
    document.getElementById('setting-voice-lang').value = s.voiceLang || 'en-US';
    document.getElementById('setting-auto-speak').checked = !!s.autoSpeak;
    document.getElementById('setting-sound-effects').checked = !!s.sound;

    modal.classList.add('active');
  }

  function closeSettingsModal() {
    const modal = document.getElementById('settings-modal');
    if (modal) modal.classList.remove('active');
  }

  function saveSettings() {
    const dailyGoal = parseInt(document.getElementById('setting-daily-goal').value) || 20;
    const voiceLang = document.getElementById('setting-voice-lang').value;
    const autoSpeak = document.getElementById('setting-auto-speak').checked;
    const sound = document.getElementById('setting-sound-effects').checked;

    Storage.updateSettings({ dailyGoal, voiceLang, autoSpeak, sound });
    Sound.setVoiceLang(voiceLang);
    Sound.setSoundEnabled(sound);

    closeSettingsModal();
    UI.showToast('설정이 저장되었습니다.', 'success');
    UI.renderDashboard();
  }

  function resetAllUserData() {
    if (confirm('정말로 모든 학습 진도와 오답노트, 북마크를 초기화하시겠습니까? (되돌릴 수 없습니다)')) {
      Storage.resetAllData();
      DataManager.init();
      closeSettingsModal();
      UI.showToast('모든 학습 데이터가 초기화되었습니다.', 'info');
      goHome();
    }
  }

  // ===== Add Custom Word Modal =====
  function openAddWordModal() {
    const modal = document.getElementById('add-word-modal');
    if (modal) modal.classList.add('active');
  }

  function closeAddWordModal() {
    const modal = document.getElementById('add-word-modal');
    if (modal) modal.classList.remove('active');
  }

  function submitCustomWord() {
    const wordInput = document.getElementById('custom-word-input');
    const meaningInput = document.getElementById('custom-meaning-input');
    const posInput = document.getElementById('custom-pos-input');
    const exampleInput = document.getElementById('custom-example-input');
    const exMeaningInput = document.getElementById('custom-exmeaning-input');

    if (!wordInput || !wordInput.value.trim() || !meaningInput || !meaningInput.value.trim()) {
      UI.showToast('영단어와 한국어 뜻은 필수 입력입니다.', 'warning');
      return;
    }

    const added = Storage.addCustomWord({
      word: wordInput.value.trim(),
      meaning: meaningInput.value.trim(),
      pos: posInput?.value || 'n',
      example: exampleInput?.value.trim() || '',
      exampleMeaning: exMeaningInput?.value.trim() || ''
    });

    DataManager.init(); // Refresh dataset
    closeAddWordModal();

    // Reset inputs
    wordInput.value = '';
    meaningInput.value = '';
    if (exampleInput) exampleInput.value = '';
    if (exMeaningInput) exMeaningInput.value = '';

    UI.showToast(`'${added.word}' 단어가 나만의 단어장에 추가되었습니다!`, 'success');
    goToWordList('all', 'all');
  }

  return {
    init,
    goHome,
    goBack,
    selectLevelCurriculum,
    startDayStudy,
    goToWordList,
    goToStudy,
    goToWrongWords,
    goToBookmarks,
    goToStats,
    showStudySetup,
    setStudyMode,
    setQuizDirection,
    setQuizCount,
    launchSelectedStudy,
    startQuizWithScope,
    startQuizFromCurrentScope,
    startReviewSession,
    clearAllWrongAnswers,
    filterWordsByTab,
    filterWordsByLevel,
    openSettingsModal,
    closeSettingsModal,
    saveSettings,
    resetAllUserData,
    openAddWordModal,
    closeAddWordModal,
    submitCustomWord,
    getCurrentScope: () => currentStudyScope
  };
})();

// Auto-run on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
