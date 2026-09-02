/**
 * Grammar Data Aggregator & Search Index (Grammar Master Pro 2.0)
 * Combines 5 CEFR Levels: A1, A2, B1, B2, C1 (40 total chapters), computes level metrics, and handles search filters.
 */

const GrammarData = (() => {
  let combinedChapters = [];
  let isInitialized = false;

  const LEVEL_META = [
    {
      level: 1,
      code: "A1",
      title: "Level 1 · A1 초등 기초 & 중1 입문",
      subtitle: "8품사, be동사, 일반동사 3인칭 -s, 과거형, 관사, 인칭대명사, 빈도부사, There is/are",
      emoji: "🌱",
      color: "#059669",
      bgGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
      chaptersCount: 8,
      desc: "영문법의 첫걸음! 알파벳 단어들의 신분(품사)과 가장 기초적인 문장 생성 규칙 8단원"
    },
    {
      level: 2,
      code: "A2",
      title: "Level 2 · A2 중학 기본 영문법",
      subtitle: "문장 5형식, 진행형, 조동사, to부정사/동명사 기초, 비교급, 접속사, 부가의문문",
      emoji: "📗",
      color: "#16a34a",
      bgGradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
      chaptersCount: 8,
      desc: "문장의 뼈대를 세우고 중학교 1~2학년 내신 기초를 완벽하게 다지는 핵심 8단원"
    },
    {
      level: 3,
      code: "B1",
      title: "Level 3 · B1 중학 심화 & 예비고",
      subtitle: "현재/과거완료, 수동태, to부정사 심화, 분사구문, 관계대명사, 관계부사, 조동사 have p.p.",
      emoji: "📘",
      color: "#2563eb",
      bgGradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      chaptersCount: 8,
      desc: "중3 내신 만점 및 고등 영어로 넘어가는 연결 다리 역할을 하는 심화 8단원"
    },
    {
      level: 4,
      code: "B2",
      title: "Level 4 · B2 고등 수능 빈출 영문법",
      subtitle: "가정법 완성, 도치/특수구문, 수일치/병렬, 시제일치, with 분사구문, 복합관계사",
      emoji: "📙",
      color: "#d97706",
      bgGradient: "linear-gradient(135deg, #f59e0b 0%, #b45309 100%)",
      chaptersCount: 8,
      desc: "수능 영어 1~2등급 및 고교 내신 서술형에 직결되는 실전 빈출 8단원"
    },
    {
      level: 5,
      code: "C1",
      title: "Level 5 · C1 수능 1등급 킬러 & 학술",
      subtitle: "가정법 if생략 도치, 준동사 복합형, 부정 구문의 수사학, 정보 패키징, 명사화",
      emoji: "👑",
      color: "#dc2626",
      bgGradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
      chaptersCount: 8,
      desc: "평가원 최고난도 킬러 지문 및 원서 독해를 관통하는 통사 구조 심화 8단원"
    }
  ];

  function init() {
    combinedChapters = [];
    if (typeof GRAMMAR_A1 !== 'undefined') combinedChapters.push(...GRAMMAR_A1);
    if (typeof GRAMMAR_A2 !== 'undefined') combinedChapters.push(...GRAMMAR_A2);
    if (typeof GRAMMAR_B1 !== 'undefined') combinedChapters.push(...GRAMMAR_B1);
    if (typeof GRAMMAR_B2 !== 'undefined') combinedChapters.push(...GRAMMAR_B2);
    if (typeof GRAMMAR_C1 !== 'undefined') combinedChapters.push(...GRAMMAR_C1);

    isInitialized = true;
    console.log(`[GrammarData] Initialized with ${combinedChapters.length} grammar chapters across 5 CEFR levels (A1~C1).`);
  }

  function getAllChapters() {
    if (!isInitialized) init();
    return combinedChapters;
  }

  function getChaptersByLevel(levelNum) {
    if (!isInitialized) init();
    const lvl = parseInt(levelNum, 10);
    return combinedChapters.filter(ch => ch.level === lvl);
  }

  function getChapterById(chapterId) {
    if (!isInitialized) init();
    return combinedChapters.find(ch => ch.id === chapterId) || null;
  }

  function searchChapters(query, levelFilter = 'all') {
    if (!isInitialized) init();
    const q = (query || '').toLowerCase().trim();

    return combinedChapters.filter(ch => {
      // Level filter
      if (levelFilter !== 'all' && ch.level !== parseInt(levelFilter, 10)) {
        return false;
      }
      if (!q) return true;

      // Match title, subtitle, summary, formulas, or pitfalls
      const inTitle = ch.title.toLowerCase().includes(q);
      const inSubtitle = ch.subtitle.toLowerCase().includes(q);
      const inSummary = ch.summary.toLowerCase().includes(q);
      const inFormulas = ch.formulas && ch.formulas.some(f =>
        f.title.toLowerCase().includes(q) || f.formula.toLowerCase().includes(q) || (f.desc && f.desc.toLowerCase().includes(q))
      );
      const inPitfalls = ch.pitfalls && ch.pitfalls.some(p =>
        p.title.toLowerCase().includes(q) || p.tip.toLowerCase().includes(q)
      );

      return inTitle || inSubtitle || inSummary || inFormulas || inPitfalls;
    });
  }

  function getLevelStats(levelNum) {
    const chapters = getChaptersByLevel(levelNum);
    const progress = Storage.getChapterProgress();
    const completedCount = chapters.filter(ch => progress[ch.id] && progress[ch.id].completed).length;

    return {
      total: chapters.length,
      completed: completedCount,
      percent: chapters.length > 0 ? Math.round((completedCount / chapters.length) * 100) : 0
    };
  }

  function getOverallProgress() {
    const all = getAllChapters();
    const progress = Storage.getChapterProgress();
    const completedCount = all.filter(ch => progress[ch.id] && progress[ch.id].completed).length;

    return {
      totalChapters: all.length,
      completedChapters: completedCount,
      percent: all.length > 0 ? Math.round((completedCount / all.length) * 100) : 0
    };
  }

  return {
    init,
    getAllChapters,
    getChaptersByLevel,
    getChapterById,
    searchChapters,
    getLevelStats,
    getOverallProgress,
    LEVEL_META
  };
})();
