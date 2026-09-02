/**
 * Concept Lesson & Syntax Visualizer Engine (Grammar Master Pro 2.0)
 * Renders in-depth, friendly storytelling lectures, detailed formula cards, syntax highlighter, pitfalls, and self-checks.
 */

const LessonViewer = (() => {
  let currentChapter = null;

  function renderLesson(chapterId) {
    App.openLesson(chapterId);
  }

  function renderLessonContent(chapterId) {
    const chapter = GrammarData.getChapterById(chapterId);
    if (!chapter) return;

    currentChapter = chapter;
    const container = document.getElementById('lesson-container');
    if (!container) return;

    const isBookmarked = Storage.isBookmarked(chapter.id);
    const isCompleted = Storage.isChapterCompleted(chapter.id);

    container.innerHTML = `
      <!-- Header Card -->
      <div class="lesson-header-card">
        <div class="lesson-meta-bar">
          <span class="badge-level level-${chapter.level}">${chapter.levelCode}</span>
          <span class="lesson-chapter-label">Chapter ${chapter.chapterNum}</span>
          ${isCompleted ? '<span class="badge-completed">✅ 학습 완료</span>' : ''}
          <button class="btn-bookmark-action ${isBookmarked ? 'active' : ''}" onclick="LessonViewer.toggleCurrentBookmark(this)">
            ${isBookmarked ? '⭐ 북마크됨' : '☆ 북마크'}
          </button>
        </div>

        <h2 class="lesson-title">${chapter.icon} ${chapter.title}</h2>
        <div class="lesson-subtitle">${chapter.subtitle}</div>

        <!-- Metaphor Banner -->
        ${chapter.storyMetaphor ? `
          <div class="story-metaphor-banner">
            ${chapter.storyMetaphor}
          </div>
        ` : ''}

        <div class="lesson-quick-actions">
          <button class="btn-primary" onclick="App.startChapterTraining('${chapter.id}')">
            🚀 실전 훈련 시작 (4대 모드)
          </button>
          <button class="btn-secondary" onclick="PrintManager.openPrintModalForChapter('${chapter.id}')">
            🖨️ A4 시험지 인쇄
          </button>
        </div>
      </div>

      <!-- Section 1: Detailed Friendly Lecture -->
      <div class="lesson-section">
        <div class="lesson-in-depth-card">
          ${chapter.coreExplanation || `<p>${chapter.summary}</p>`}
        </div>
      </div>

      <!-- Section 2: Key Takeaways -->
      ${(chapter.keyTakeaways && chapter.keyTakeaways.length > 0) ? `
        <div class="lesson-section">
          <div class="key-takeaways-card">
            <h3 class="takeaways-title">📌 이것만은 꼭 기억하세요! (핵심 3줄 요약)</h3>
            <ul class="takeaways-list">
              ${chapter.keyTakeaways.map(item => `
                <li><span class="takeaway-bullet">✓</span> <span>${item}</span></li>
              `).join('')}
            </ul>
          </div>
        </div>
      ` : ''}

      <!-- Section 3: Deep Formula Breakdown Cards -->
      <div class="lesson-section">
        <h3 class="lesson-section-heading">📐 핵심 문법 공식 & 구조 상세 해설</h3>
        <p class="section-lead-desc">각 공식의 탄생 원리와 구성 성분, 대표 예문 및 빈출 함정을 꼼꼼히 확인하세요.</p>
        <div class="formulas-grid">
          ${(chapter.formulas || []).map((f, fIdx) => `
            <div class="formula-card">
              <!-- Formula Card Header -->
              <div class="formula-card-header">
                <div class="formula-title-row">
                  <span class="formula-pill-badge">공식 ${fIdx + 1}</span>
                  <h4 class="formula-main-title">${f.title}</h4>
                </div>
                <div class="formula-code-badge">${f.formula}</div>
              </div>

              <!-- In-Depth Core Meaning -->
              <div class="formula-meaning-box">
                <h5>💡 공식 상세 설명 & 탄생 원리</h5>
                <p>${f.coreMeaning || f.desc}</p>
              </div>

              <!-- Components Breakdown Grid -->
              ${(f.components && f.components.length > 0) ? `
                <div class="formula-components-wrap">
                  <h5>🧩 구성 성분 하나하나 쪼개보기</h5>
                  <div class="components-grid">
                    ${f.components.map(c => `
                      <div class="component-item">
                        <span class="component-part">${c.part}</span>
                        <span class="component-desc">${c.desc}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <!-- Practical Usage Tip -->
              ${f.usageTip ? `
                <div class="formula-tip-box">
                  <span class="tip-tag">🔍 해석 & 판별 비법</span>
                  <p class="tip-text">${f.usageTip}</p>
                </div>
              ` : ''}

              <!-- Multiple Rich Examples with Annotations -->
              <div class="formula-examples-section">
                <h5>📝 대표 실전 예문 분석</h5>
                <div class="formula-examples-list">
                  ${(f.examples && f.examples.length > 0 ? f.examples : [{ en: f.example, kr: "대표 예문", note: "" }]).map((ex, i) => `
                    <div class="formula-ex-card">
                      <div class="ex-en-row">
                        <span class="ex-idx">예문 ${i + 1}</span>
                        <strong class="ex-sentence">${ex.en}</strong>
                        <button class="btn-speak-inline" onclick="Sound.speak('${ex.en.replace(/'/g, "\\'")}')" title="원어민 발음 듣기">🔊</button>
                      </div>
                      <div class="ex-kr-row">${ex.kr}</div>
                      ${ex.note ? `<div class="ex-note-row">📌 <em>${ex.note}</em></div>` : ''}
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Common Trap & Watch Out -->
              ${f.commonTrap ? `
                <div class="formula-trap-card">
                  ${f.commonTrap}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 4: Syntax Highlighter Lab -->
      <div class="lesson-section">
        <h3 class="lesson-section-heading">🔬 문장 구조 시각화 랩 (Syntax Highlighter)</h3>
        <div class="syntax-examples-list">
          ${(chapter.syntaxExamples || []).map(ex => `
            <div class="syntax-analysis-card">
              <div class="syntax-sentence-row">
                <span class="syntax-sentence-text">${ex.sentence}</span>
                <button class="btn-speak-sm" onclick="Sound.speak('${ex.sentence.replace(/'/g, "\\'")}')" title="원어민 발음">🔊</button>
              </div>
              <div class="syntax-translation-row">${ex.translation}</div>
              <div class="syntax-tokens-row">
                ${ex.tokens.map(t => `
                  <div class="syntax-token-chip role-${t.role}">
                    <span class="chip-text">${t.text}</span>
                    <span class="chip-role-badge">[${t.role}] ${t.label}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- Section 5: Pitfalls & Exam Traps -->
      ${(chapter.pitfalls && chapter.pitfalls.length > 0) ? `
        <div class="lesson-section">
          <h3 class="lesson-section-heading">🚨 시험 빈출 함정 & 주의점 (Pitfall Notes)</h3>
          <div class="pitfalls-list">
            ${chapter.pitfalls.map(p => `
              <div class="pitfall-alert-card">
                <div class="pitfall-title">
                  <span>⚠️</span> <strong>${p.title}</strong>
                </div>
                <div class="pitfall-content">${p.tip}</div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Section 6: Interactive 1-Second Self-Checks -->
      ${(chapter.selfChecks && chapter.selfChecks.length > 0) ? `
        <div class="lesson-section">
          <h3 class="lesson-section-heading">❓ 1초 셀프 체크 퀴즈 (이해력 확인)</h3>
          <div class="self-checks-list">
            ${chapter.selfChecks.map((sc, idx) => `
              <div class="self-check-card" id="self-check-${idx}">
                <div class="self-check-q" onclick="LessonViewer.toggleSelfCheck(${idx})">
                  <span>${sc.question}</span>
                  <span class="self-check-arrow">👉 정답 & 해설 보기</span>
                </div>
                <div class="self-check-a" id="self-check-ans-${idx}" style="display:none;">
                  💡 <strong>해설:</strong> ${sc.answer}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Bottom Launch Training Banner -->
      <div class="lesson-bottom-banner">
        <div class="banner-text">
          <h3>개념을 완벽히 이해하셨나요? 실전 문제로 확인하세요!</h3>
          <p>4지선다, 오류 수정, 문장 조각 영작, 형태 변형 빈칸 채우기</p>
        </div>
        <button class="btn-primary-large" onclick="App.startChapterTraining('${chapter.id}')">
          실전 훈련 시작하기 →
        </button>
      </div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleSelfCheck(idx) {
    const ansEl = document.getElementById(`self-check-ans-${idx}`);
    const card = document.getElementById(`self-check-${idx}`);
    if (ansEl && card) {
      const isHidden = ansEl.style.display === 'none';
      ansEl.style.display = isHidden ? 'block' : 'none';
      card.classList.toggle('active', isHidden);
      Sound.playClick();
    }
  }

  function toggleCurrentBookmark(btn) {
    if (!currentChapter) return;
    const isNowBookmarked = Storage.toggleBookmark(currentChapter.id);
    if (btn) {
      btn.classList.toggle('active', isNowBookmarked);
      btn.innerHTML = isNowBookmarked ? '⭐ 북마크됨' : '☆ 북마크';
    }
    UI.showToast(isNowBookmarked ? '⭐ 북마크에 추가되었습니다.' : '북마크가 해제되었습니다.', 'info');
  }

  return {
    renderLesson,
    renderLessonContent,
    toggleSelfCheck,
    toggleCurrentBookmark
  };
})();
