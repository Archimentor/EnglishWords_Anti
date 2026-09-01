/**
 * Data Aggregator & Indexing Engine (English Master Pro 2.0)
 * Manages vocabulary datasets, level curriculums, Day partitioning, and multi-field search.
 */

const DataManager = (() => {
  let combinedWords = [];
  let isInitialized = false;

  const LEVEL_METADATA = [
    {
      level: 1,
      title: "Level 1 · 초등 기초 (A1)",
      subtitle: "파닉스 & 일상 기초 필수 600단어",
      emoji: "🌱",
      color: "#10b981",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      targetDays: 20,
      desc: "초등 전 과정 파닉스, 일상 사물, 동물, 가족, 기초 동작 등 완벽 커버"
    },
    {
      level: 2,
      title: "Level 2 · 중학 기본 (A2)",
      subtitle: "중학 교과서 핵심 빈출 800단어",
      emoji: "📗",
      color: "#06b6d4",
      bgGradient: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
      targetDays: 25,
      desc: "중학교 내신 필수, 일상 소통, 감정, 건강, 사회 기초 어휘"
    },
    {
      level: 3,
      title: "Level 3 · 중학 심화 & 예비고 (B1)",
      subtitle: "중학 심화 및 고교 전환 700단어",
      emoji: "📘",
      color: "#3b82f6",
      bgGradient: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
      targetDays: 25,
      desc: "추상적 개념, 인과관계, 학술 기초 등 고등 영어로 넘어가는 징검다리 어휘"
    },
    {
      level: 4,
      title: "Level 4 · 고등 필수 & 수능 (B2)",
      subtitle: "수능 및 고등 내신 1~2등급 800단어",
      emoji: "📙",
      color: "#f59e0b",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      targetDays: 25,
      desc: "EBS 연계, 논리 담화 표지어, 학술 연구 및 수능 핵심 어휘"
    },
    {
      level: 5,
      title: "Level 5 · 고등 심화 & 1등급 킬러 (C1)",
      subtitle: "수능 1등급 & 평가원 킬러 600단어",
      emoji: "📕",
      color: "#ef4444",
      bgGradient: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      targetDays: 20,
      desc: "철학, 인식론, 학제간 융합 지문 및 최고난도 추상 학술 어휘 완벽 대비"
    }
  ];

  function init() {
    combinedWords = [];

    if (typeof WORDS_ELEMENTARY !== 'undefined') {
      combinedWords.push(...WORDS_ELEMENTARY);
    }
    if (typeof WORDS_MIDDLE !== 'undefined') {
      combinedWords.push(...WORDS_MIDDLE);
    }
    if (typeof WORDS_HIGH_BASIC !== 'undefined') {
      combinedWords.push(...WORDS_HIGH_BASIC);
    }
    if (typeof WORDS_HIGH_ADVANCED !== 'undefined') {
      combinedWords.push(...WORDS_HIGH_ADVANCED);
    }

    // Merge custom words from storage
    if (typeof Storage !== 'undefined') {
      const customWords = Storage.getCustomWords();
      combinedWords.push(...customWords);
    }

    isInitialized = true;
    console.log(`✅ DataManager initialized: ${combinedWords.length} words loaded.`);
  }

  function getAllWords() {
    if (!isInitialized) init();
    return combinedWords;
  }

  function getWordById(id) {
    return getAllWords().find(w => w.id === Number(id));
  }

  function getWordsByLevel(level) {
    return getAllWords().filter(w => w.level === Number(level));
  }

  function getWordsByDay(level, day) {
    return getAllWords().filter(w => w.level === Number(level) && w.day === Number(day));
  }

  function getDaysInLevel(level) {
    const wordsInLevel = getWordsByLevel(level);
    const daySet = new Set(wordsInLevel.map(w => w.day));
    return Array.from(daySet).sort((a, b) => a - b);
  }

  function getLevelMeta(level) {
    return LEVEL_METADATA.find(m => m.level === Number(level)) || LEVEL_METADATA[0];
  }

  function getAllLevelsMeta() {
    return LEVEL_METADATA;
  }

  /**
   * Search and filter words with multi-criteria
   */
  function searchWords({ query = '', level = null, day = null, filter = 'all' }) {
    let list = getAllWords();

    if (level !== null && level !== 'all') {
      list = list.filter(w => w.level === Number(level));
    }
    if (day !== null && day !== 'all') {
      list = list.filter(w => w.day === Number(day));
    }

    // Status filter
    if (filter !== 'all') {
      const progress = Storage.getProgress();
      const bookmarks = Storage.getBookmarks();
      const wrongMap = Storage.getWrongWordsMap();

      if (filter === 'bookmarked') {
        list = list.filter(w => bookmarks.includes(w.id));
      } else if (filter === 'wrong') {
        list = list.filter(w => !!wrongMap[w.id]);
      } else if (filter === 'mastered') {
        list = list.filter(w => progress[w.id] && progress[w.id].leitnerBox >= 3);
      } else if (filter === 'learning') {
        list = list.filter(w => progress[w.id] && progress[w.id].correctCount > 0 && progress[w.id].leitnerBox < 3);
      } else if (filter === 'unlearned') {
        list = list.filter(w => !progress[w.id] || progress[w.id].correctCount === 0);
      }
    }

    // Keyword Search (English, Meaning, Etymology, Example)
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(w =>
        w.word.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q) ||
        (w.collocation && w.collocation.toLowerCase().includes(q)) ||
        (w.etymology && w.etymology.toLowerCase().includes(q)) ||
        (w.example && w.example.toLowerCase().includes(q))
      );
    }

    return list;
  }

  return {
    init,
    getAllWords,
    getWordById,
    getWordsByLevel,
    getWordsByDay,
    getDaysInLevel,
    getLevelMeta,
    getAllLevelsMeta,
    searchWords
  };
})();
