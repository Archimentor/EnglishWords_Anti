/**
 * Storage & Spaced Repetition Engine (English Master Pro 2.0)
 * - Leitner Box / SM-2 Spaced Repetition Intervals
 * - Wrong Answer Notebook & Mistake Tracker
 * - Starred Bookmarks & Custom Word Storage
 * - Daily Streak, Daily Goals, XP & Gamification Badges
 */

const Storage = (() => {
  const KEYS = {
    PROGRESS: 'emp2_word_progress',
    SETTINGS: 'emp2_settings',
    STATS: 'emp2_daily_stats',
    STREAK: 'emp2_streak',
    WRONG: 'emp2_wrong_words',
    BOOKMARKS: 'emp2_bookmarks',
    CUSTOM_WORDS: 'emp2_custom_words',
    XP: 'emp2_xp_data',
    BADGES: 'emp2_badges'
  };

  // Review intervals in hours: [10min, 1day, 3days, 7days, 14days, 30days]
  const REVIEW_INTERVALS = [0.16, 24, 72, 168, 336, 720];

  const BADGE_DEFINITIONS = [
    { id: 'first_step', name: '첫 발자국', desc: '첫 번째 학습을 성공적으로 완료했습니다.', icon: '🌱', reqXp: 10 },
    { id: 'streak_3', name: '작심삼일 극복', desc: '3일 연속으로 출석 학습을 달성했습니다.', icon: '🔥', reqStreak: 3 },
    { id: 'streak_7', name: '일주일 마스터', desc: '7일 연속 스트릭을 달성했습니다.', icon: '⚡', reqStreak: 7 },
    { id: 'streak_30', name: '한 달의 기적', desc: '30일 연속 학습을 완수했습니다.', icon: '👑', reqStreak: 30 },
    { id: 'words_50', name: '어휘 수집가', desc: '50개 이상의 단어를 마스터했습니다.', icon: '📚', reqWords: 50 },
    { id: 'words_100', name: '단어 박사', desc: '100개 이상의 단어를 완벽 학습했습니다.', icon: '🎓', reqWords: 100 },
    { id: 'words_300', name: '어휘의 신', desc: '300개 이상의 단어를 정복했습니다.', icon: '🏆', reqWords: 300 },
    { id: 'perfect_quiz', name: '백점만점', desc: '퀴즈에서 오답 없이 100점을 기록했습니다.', icon: '💯' },
    { id: 'speed_master', name: '스피드 콤보', desc: '스피드 매칭 게임에서 8콤보를 달성했습니다.', icon: '⚡' },
    { id: 'spelling_ace', name: '스펠링 에이스', desc: '스펠링 훈련에서 오답 없이 완주했습니다.', icon: '✍️' },
    { id: 'review_hero', name: '망각의 지우개', desc: '오늘의 복습 큐를 모두 완료했습니다.', icon: '🔄' },
    { id: 'custom_creator', name: '나만의 사전', desc: '나만의 단어를 1개 이상 추가했습니다.', icon: '✨' }
  ];

  // ===== Helper JSON get/set =====
  function get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage read error:', e);
      return defaultValue;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  // ===== Word Progress (SM-2 Spaced Repetition) =====
  function getProgress() {
    return get(KEYS.PROGRESS, {});
  }

  function getWordProgress(wordId) {
    const p = getProgress();
    return p[wordId] || {
      wordId,
      correctCount: 0,
      wrongCount: 0,
      leitnerBox: 0, // 0 (new), 1..5 (mastered)
      lastStudied: null,
      nextReview: null
    };
  }

  /**
   * Updates word status after a study event
   * @param {number} wordId
   * @param {boolean} isCorrect
   * @param {number} quality 1 (hard), 2 (good), 3 (easy)
   */
  function recordWordResult(wordId, isCorrect, quality = 2) {
    const progress = getProgress();
    const wp = progress[wordId] || {
      wordId,
      correctCount: 0,
      wrongCount: 0,
      leitnerBox: 0,
      lastStudied: null,
      nextReview: null
    };

    const now = Date.now();
    wp.lastStudied = now;

    if (isCorrect) {
      wp.correctCount++;
      const step = quality === 3 ? 2 : 1;
      wp.leitnerBox = Math.min(wp.leitnerBox + step, REVIEW_INTERVALS.length - 1);
      removeWrongWord(wordId);
      addXP(10);
    } else {
      wp.wrongCount++;
      wp.leitnerBox = Math.max(0, wp.leitnerBox - 1);
      recordWrongWord(wordId);
      addXP(2);
    }

    const intervalHours = REVIEW_INTERVALS[wp.leitnerBox] || 24;
    wp.nextReview = now + intervalHours * 60 * 60 * 1000;

    progress[wordId] = wp;
    set(KEYS.PROGRESS, progress);

    recordDailyStudyActivity(wordId);
    checkBadges();
    return wp;
  }

  // ===== Wrong Answers Tracker (오답노트) =====
  function getWrongWordsMap() {
    return get(KEYS.WRONG, {});
  }

  function recordWrongWord(wordId) {
    const wrongs = getWrongWordsMap();
    if (!wrongs[wordId]) {
      wrongs[wordId] = { wordId, count: 0, firstWrong: Date.now(), lastWrong: Date.now() };
    }
    wrongs[wordId].count++;
    wrongs[wordId].lastWrong = Date.now();
    set(KEYS.WRONG, wrongs);
  }

  function removeWrongWord(wordId) {
    const wrongs = getWrongWordsMap();
    if (wrongs[wordId]) {
      delete wrongs[wordId];
      set(KEYS.WRONG, wrongs);
    }
  }

  function clearAllWrongWords() {
    set(KEYS.WRONG, {});
  }

  // ===== Bookmarks (나만의 즐겨찾기) =====
  function getBookmarks() {
    return get(KEYS.BOOKMARKS, []);
  }

  function toggleBookmark(wordId) {
    let bookmarks = getBookmarks();
    const idx = bookmarks.indexOf(wordId);
    let isBookmarked = false;
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
      isBookmarked = false;
    } else {
      bookmarks.push(wordId);
      isBookmarked = true;
    }
    set(KEYS.BOOKMARKS, bookmarks);
    return isBookmarked;
  }

  function isBookmarked(wordId) {
    const bookmarks = getBookmarks();
    return bookmarks.includes(wordId);
  }

  // ===== Custom Words (사용자 직접 단어 추가) =====
  function getCustomWords() {
    return get(KEYS.CUSTOM_WORDS, []);
  }

  function addCustomWord(wordObj) {
    const list = getCustomWords();
    const newWord = {
      id: 9000 + list.length + 1,
      word: wordObj.word.trim(),
      meaning: wordObj.meaning.trim(),
      pos: wordObj.pos || 'n',
      ipa: wordObj.ipa || '',
      level: Number(wordObj.level) || 1,
      day: 1,
      example: wordObj.example || '',
      exampleMeaning: wordObj.exampleMeaning || '',
      etymology: wordObj.etymology || '사용자 등록 단어',
      collocation: wordObj.collocation || '',
      synonyms: wordObj.synonyms || [],
      isCustom: true
    };
    list.unshift(newWord);
    set(KEYS.CUSTOM_WORDS, list);
    unlockBadge('custom_creator');
    addXP(25);
    return newWord;
  }

  function deleteCustomWord(wordId) {
    let list = getCustomWords();
    list = list.filter(w => w.id !== wordId);
    set(KEYS.CUSTOM_WORDS, list);
  }

  // ===== Daily Streak & Study Activity =====
  function getStreakData() {
    return get(KEYS.STREAK, {
      current: 0,
      best: 0,
      lastDate: null
    });
  }

  function recordDailyStudyActivity(wordId) {
    const todayStr = new Date().toISOString().slice(0, 10);
    const streak = getStreakData();

    if (!streak.lastDate) {
      streak.current = 1;
      streak.best = 1;
      streak.lastDate = todayStr;
    } else if (streak.lastDate !== todayStr) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (streak.lastDate === yesterdayStr) {
        streak.current++;
        if (streak.current > streak.best) streak.best = streak.current;
      } else {
        streak.current = 1;
      }
      streak.lastDate = todayStr;
    }
    set(KEYS.STREAK, streak);

    // Track daily count
    const stats = get(KEYS.STATS, {});
    stats[todayStr] = (stats[todayStr] || 0) + 1;
    set(KEYS.STATS, stats);
  }

  function getDailyStats() {
    return get(KEYS.STATS, {});
  }

  // ===== XP & Levels =====
  function getXPData() {
    return get(KEYS.XP, { totalXP: 0, level: 1, title: '어휘 초심자' });
  }

  function addXP(amount) {
    const data = getXPData();
    data.totalXP += amount;

    // Calculate level: Level = floor(sqrt(XP / 25)) + 1
    const newLevel = Math.floor(Math.sqrt(data.totalXP / 25)) + 1;
    const titles = [
      '어휘 초심자', '단어 탐험가', '어휘 수련생', '문장 분석관',
      '영단어 전문가', '어휘 마스터', '수능 1등급', '언어의 지배자'
    ];
    data.level = newLevel;
    data.title = titles[Math.min(newLevel - 1, titles.length - 1)];

    set(KEYS.XP, data);
    return data;
  }

  // ===== Badges & Achievements =====
  function getUnlockedBadges() {
    return get(KEYS.BADGES, []);
  }

  function unlockBadge(badgeId) {
    const unlocked = getUnlockedBadges();
    if (!unlocked.includes(badgeId)) {
      unlocked.push(badgeId);
      set(KEYS.BADGES, unlocked);
      addXP(50);
      return BADGE_DEFINITIONS.find(b => b.id === badgeId);
    }
    return null;
  }

  function checkBadges() {
    const progress = getProgress();
    const streak = getStreakData();
    const xp = getXPData();
    const masteredWordsCount = Object.values(progress).filter(p => p.leitnerBox >= 2).length;

    if (xp.totalXP >= 10) unlockBadge('first_step');
    if (streak.current >= 3) unlockBadge('streak_3');
    if (streak.current >= 7) unlockBadge('streak_7');
    if (streak.current >= 30) unlockBadge('streak_30');
    if (masteredWordsCount >= 50) unlockBadge('words_50');
    if (masteredWordsCount >= 100) unlockBadge('words_100');
    if (masteredWordsCount >= 300) unlockBadge('words_300');
  }

  // ===== Spaced Repetition Due Queue =====
  function getDueReviewWords(allWords) {
    const progress = getProgress();
    const now = Date.now();
    const dueWordIds = [];

    Object.keys(progress).forEach(idStr => {
      const p = progress[idStr];
      if (p.nextReview && p.nextReview <= now) {
        dueWordIds.push(Number(idStr));
      }
    });

    return allWords.filter(w => dueWordIds.includes(w.id));
  }

  // ===== App Settings =====
  function getSettings() {
    return get(KEYS.SETTINGS, {
      theme: 'light',
      voiceLang: 'en-US',
      sound: true,
      autoSpeak: true,
      dailyGoal: 20
    });
  }

  function updateSettings(patch) {
    const curr = getSettings();
    const updated = { ...curr, ...patch };
    set(KEYS.SETTINGS, updated);
    return updated;
  }

  // Reset progress
  function resetAllData() {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  }

  return {
    getWordProgress,
    recordWordResult,
    getProgress,
    getWrongWordsMap,
    recordWrongWord,
    removeWrongWord,
    clearAllWrongWords,
    getBookmarks,
    toggleBookmark,
    isBookmarked,
    getCustomWords,
    addCustomWord,
    deleteCustomWord,
    getStreakData,
    getDailyStats,
    getXPData,
    addXP,
    getUnlockedBadges,
    unlockBadge,
    checkBadges,
    getDueReviewWords,
    getSettings,
    updateSettings,
    resetAllData,
    BADGE_DEFINITIONS
  };
})();
