(function () {
  "use strict";

  const LEVEL_META = [
    { id: "A1", number: "01", name: "기초 골격", caption: "짧은 문장의 자리를 정확히 세웁니다.", color: "#16705a" },
    { id: "A2", number: "02", name: "문장 확장", caption: "시제·조동사·준동사로 표현 범위를 넓힙니다.", color: "#0f67a6" },
    { id: "B1", number: "03", name: "절과 연결", caption: "완료·수동·관계절을 연결해 긴 문장을 읽습니다.", color: "#3156a3" },
    { id: "B2", number: "04", name: "구조 변형", caption: "도치·가정·압축으로 정보 초점을 바꿉니다.", color: "#a8512c" },
    { id: "C1", number: "05", name: "고급 통사", caption: "담화와 학술 문장의 압축 논리를 해체합니다.", color: "#8b3344" }
  ];

  const rawGroups = [
    typeof GRAMMAR_A1 !== "undefined" ? GRAMMAR_A1 : [],
    typeof GRAMMAR_A2 !== "undefined" ? GRAMMAR_A2 : [],
    typeof GRAMMAR_B1 !== "undefined" ? GRAMMAR_B1 : [],
    typeof GRAMMAR_B2 !== "undefined" ? GRAMMAR_B2 : [],
    typeof GRAMMAR_C1 !== "undefined" ? GRAMMAR_C1 : []
  ];

  const chapters = rawGroups.flat().map((chapter, index) => ({
    ...chapter,
    order: index + 1,
    guide: (typeof GRAMMAR_GUIDES !== "undefined" && GRAMMAR_GUIDES[chapter.id]) || null
  }));

  function getAll() {
    return chapters;
  }

  function getChapter(id) {
    return chapters.find((chapter) => chapter.id === id) || null;
  }

  function getByLevel(level) {
    return chapters.filter((chapter) => chapter.levelCode === level);
  }

  function getLevel(level) {
    return LEVEL_META.find((item) => item.id === level) || LEVEL_META[0];
  }

  function search(query, level = "ALL") {
    const normalized = String(query || "").trim().toLowerCase();
    return chapters.filter((chapter) => {
      if (level !== "ALL" && chapter.levelCode !== level) return false;
      if (!normalized) return true;
      const haystack = [
        chapter.title,
        chapter.subtitle,
        chapter.summary,
        chapter.guide?.mission,
        ...(chapter.formulas || []).flatMap((formula) => [formula.title, formula.formula, formula.desc]),
        ...(chapter.pitfalls || []).flatMap((pitfall) => [pitfall.title, pitfall.tip])
      ].join(" ").toLowerCase();
      return haystack.includes(normalized);
    });
  }

  function meaningfulFormulaText(value) {
    const text = String(value || "").trim();
    if (!text) return "";
    const boilerplate = [
      "이 공식은",
      "문장의 통사적 골격을 정확하게 구성",
      "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계",
      "공식 적용 분석",
      "핵심 대표 예문",
      "실전 포인트:"
    ];
    return boilerplate.some((phrase) => text.includes(phrase)) ? "" : text;
  }

  function formulaMeaning(formula) {
    return meaningfulFormulaText(formula.coreMeaning)
      || meaningfulFormulaText(formula.desc)
      || `${formula.title}의 의미와 형태를 함께 확인합니다.`;
  }

  function formulaUsage(formula, chapter) {
    return meaningfulFormulaText(formula.usageTip)
      || chapter.guide?.decisionRule
      || `${formula.desc || formula.title}의 의미가 필요할 때 ${formula.formula} 순서로 구조를 세웁니다.`;
  }

  function formulaTrap(formula) {
    return meaningfulFormulaText(formula.commonTrap);
  }

  function exampleTranslation(example) {
    return meaningfulFormulaText(example?.kr);
  }

  function exampleNote(example) {
    return meaningfulFormulaText(example?.note);
  }

  window.GrammarStudioData = {
    LEVEL_META,
    getAll,
    getChapter,
    getByLevel,
    getLevel,
    search,
    meaningfulFormulaText,
    formulaMeaning,
    formulaUsage,
    formulaTrap,
    exampleTranslation,
    exampleNote
  };
})();
