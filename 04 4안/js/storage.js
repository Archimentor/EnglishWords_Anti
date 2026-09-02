/**
 * LocalStorage & Progress Manager (Grammar Master Pro)
 * Manages chapter progress, mastery scores, wrong exercise notebook, bookmarks, streak, XP, and badges.
 */

const Storage = (() => {
  const PREFIX = 'grammar_pro_v1_';

  const KEYS = {
    CHAPTERS: PREFIX + 'chapter_progress',
    WRONG_EXERCISES: PREFIX + 'wrong_exercises',
    BOOKMARKS: PREFIX + 'bookmarked_chapters',
    STATS: PREFIX + 'stats',
    SETTINGS: PREFIX + 'settings'
  };

  const BADGES = [
    { id: 'first_step', title: '첫 발걸음', desc: '첫 번째 문법 챕터 학습을 완료했습니다.', icon: '🌱', reqXP: 20 },
    { id: 'a1_master', title: 'A1 기초 문법 정복', desc: 'A1 레벨 8개 챕터를 모두 완료했습니다.', icon: '🌱', reqXP: 150 },
    { id: 'a2_master', title: 'A2 중학 기본 정복', desc: 'A2 레벨 8개 챕터를 모두 완료했습니다.', icon: '📗', reqXP: 350 },
    { id: 'b1_master', title: 'B1 중학 심화 정복', desc: 'B1 레벨 8개 챕터를 모두 완료했습니다.', icon: '📘', reqXP: 600 },
    { id: 'b2_master', title: 'B2 수능 빈출 정복', desc: 'B2 레벨 8개 챕터를 모두 완료했습니다.', icon: '📙', reqXP: 950 },
    { id: 'c1_master', title: 'C1 1등급 킬러 정복', desc: 'C1 최고난도 8개 챕터를 모두 완료했습니다.', icon: '👑', reqXP: 1400 },
    { id: 'combo_king', title: '어법 콤보 마스터', desc: '훈련 모드에서 10연속 정답을 달성했습니다.', icon: '⚡', reqXP: 100 },
    { id: 'error_hunter', title: '오류 사냥꾼', desc: '어법 오류 수정 훈련을 20문항 이상 해결했습니다.', icon: '🔍', reqXP: 150 },
    { id: 'sentence_builder', title: '문장 조립의 대가', desc: '문장 조각 영작 훈련을 20문항 이상 완성했습니다.', icon: '🧩', reqXP: 250 },
    { id: 'streak_3', title: '작심삼일 탈출', desc: '3일 연속으로 문법을 공부했습니다.', icon: '🔥', reqXP: 80 },
    { id: 'streak_7', title: '주간 열정 러너', desc: '7일 연속으로 매일 문법을 학습했습니다.', icon: '🌟', reqXP: 300 },
    { id: 'wrong_clear', title: '오답 청소부', desc: '오답노트의 취약 문제를 10개 이상 정복했습니다.', icon: '🧹', reqXP: 120 },
    { id: 'grand_master', title: '영문법 그랜드 마스터', desc: '누적 2,500 XP를 달성하고 전 과정을 수료했습니다.', icon: '🏆', reqXP: 2500 }
  ];

  function getJSON(key, defaultVal) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultVal;
    } catch (e) {
      console.warn(`Error reading ${key}:`, e);
      return defaultVal;
    }
  }

  function setJSON(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn(`Error saving ${key}:`, e);
    }
  }

  function getStats() {
    const stats = getJSON(KEYS.STATS, {
      xp: 0,
      streakDays: 1,
      lastStudyDate: new Date().toISOString().split('T')[0],
      totalExercisesSolved: 0,
      totalCorrect: 0,
      dailyCompletedCount: 0,
      dailyGoal: 5,
      unlockedBadges: []
    });

    // Check streak
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastStudyDate !== today) {
      const last = new Date(stats.lastStudyDate);
      const cur = new Date(today);
      const diffDays = Math.floor((cur - last) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Continuous streak maintained
      } else if (diffDays > 1) {
        stats.streakDays = 1;
      }
      stats.dailyCompletedCount = 0;
      stats.lastStudyDate = today;
      setJSON(KEYS.STATS, stats);
    }

    return stats;
  }

  function saveStats(stats) {
    setJSON(KEYS.STATS, stats);
  }

  function addXP(amount) {
    const stats = getStats();
    stats.xp = (stats.xp || 0) + amount;
    stats.dailyCompletedCount = (stats.dailyCompletedCount || 0) + 1;

    // Check unlocked badges
    BADGES.forEach(badge => {
      if (!stats.unlockedBadges.includes(badge.id) && stats.xp >= badge.reqXP) {
        stats.unlockedBadges.push(badge.id);
        if (typeof UI !== 'undefined' && UI.showToast) {
          UI.showToast(`🏆 새로운 성취 배지 획득: [${badge.title}]!`, 'badge');
        }
      }
    });

    saveStats(stats);
    return stats;
  }

  function getChapterProgress() {
    return getJSON(KEYS.CHAPTERS, {});
  }

  function saveChapterScore(chapterId, scoreObj) {
    const progress = getChapterProgress();
    progress[chapterId] = {
      ...progress[chapterId],
      ...scoreObj,
      lastStudied: new Date().toISOString(),
      completed: true
    };
    setJSON(KEYS.CHAPTERS, progress);
    addXP(25);
  }

  function isChapterCompleted(chapterId) {
    const progress = getChapterProgress();
    return !!(progress[chapterId] && progress[chapterId].completed);
  }

  function getWrongExercises() {
    return getJSON(KEYS.WRONG_EXERCISES, {});
  }

  function recordExerciseResult(chapterId, exercise, isCorrect, userAnswer) {
    const wrongMap = getWrongExercises();
    const exId = exercise.id || `${chapterId}_${exercise.question ? exercise.question.slice(0, 10) : 'ex'}`;

    if (!isCorrect) {
      wrongMap[exId] = {
        chapterId,
        exercise,
        userAnswer,
        failedAt: new Date().toISOString(),
        wrongCount: (wrongMap[exId] ? wrongMap[exId].wrongCount : 0) + 1
      };
      setJSON(KEYS.WRONG_EXERCISES, wrongMap);
    } else {
      if (wrongMap[exId]) {
        delete wrongMap[exId];
        setJSON(KEYS.WRONG_EXERCISES, wrongMap);
        addXP(10);
      }
    }

    const stats = getStats();
    stats.totalExercisesSolved = (stats.totalExercisesSolved || 0) + 1;
    if (isCorrect) {
      stats.totalCorrect = (stats.totalCorrect || 0) + 1;
      addXP(5);
    }
    saveStats(stats);
  }

  function clearWrongExercise(exId) {
    const wrongMap = getWrongExercises();
    if (wrongMap[exId]) {
      delete wrongMap[exId];
      setJSON(KEYS.WRONG_EXERCISES, wrongMap);
    }
  }

  function getBookmarks() {
    return getJSON(KEYS.BOOKMARKS, []);
  }

  function toggleBookmark(chapterId) {
    const bookmarks = getBookmarks();
    const idx = bookmarks.indexOf(chapterId);
    if (idx >= 0) {
      bookmarks.splice(idx, 1);
    } else {
      bookmarks.push(chapterId);
    }
    setJSON(KEYS.BOOKMARKS, bookmarks);
    return idx < 0;
  }

  function isBookmarked(chapterId) {
    return getBookmarks().includes(chapterId);
  }

  function getSettings() {
    return getJSON(KEYS.SETTINGS, {
      theme: 'light',
      soundEnabled: true,
      ttsSpeed: 0.95,
      ttsLang: 'en-US',
      dailyGoal: 5
    });
  }

  function saveSettings(settings) {
    setJSON(KEYS.SETTINGS, settings);
  }

  function resetAll() {
    localStorage.removeItem(KEYS.CHAPTERS);
    localStorage.removeItem(KEYS.WRONG_EXERCISES);
    localStorage.removeItem(KEYS.BOOKMARKS);
    localStorage.removeItem(KEYS.STATS);
  }

  return {
    getStats,
    addXP,
    getChapterProgress,
    saveChapterScore,
    isChapterCompleted,
    getWrongExercises,
    recordExerciseResult,
    clearWrongExercise,
    getBookmarks,
    toggleBookmark,
    isBookmarked,
    getSettings,
    saveSettings,
    resetAll,
    BADGES
  };
})();
