/**
 * Interactive Grammar Training Arena (Grammar Master Pro)
 * 4 Multi-Modes: MCQ, Error Correction, Sentence Unscramble, Form Cloze
 */

const Trainer = (() => {
  let session = {
    chapterId: null,
    mode: 'mcq', // 'mcq' | 'error' | 'unscramble' | 'cloze'
    questions: [],
    currentIndex: 0,
    score: 0,
    combo: 0,
    maxCombo: 0,
    answers: [],
    unscrambleChosen: [],
    unscrambleRemaining: []
  };

  function startTraining(chapterId, mode = 'mcq') {
    const chapter = GrammarData.getChapterById(chapterId);
    if (!chapter || !chapter.exercises) {
      UI.showToast("해당 챕터의 연습문제를 찾을 수 없습니다.", "error");
      return;
    }

    let qList = [];
    if (mode === 'mcq') {
      qList = [...(chapter.exercises.mcq || [])];
    } else if (mode === 'error') {
      qList = [...(chapter.exercises.errorCorrection || [])];
    } else if (mode === 'unscramble') {
      qList = [...(chapter.exercises.unscramble || [])];
    } else if (mode === 'cloze') {
      qList = [...(chapter.exercises.formCloze || [])];
    }

    if (qList.length === 0) {
      // Fallback to MCQ
      qList = [...(chapter.exercises.mcq || [])];
      mode = 'mcq';
    }

    session = {
      chapterId: chapter.id,
      mode: mode,
      questions: qList,
      currentIndex: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      answers: [],
      unscrambleChosen: [],
      unscrambleRemaining: []
    };

    UI.showScreen('training-screen');
    renderQuestion();
  }

  function renderQuestion() {
    const container = document.getElementById('training-arena-container');
    if (!container) return;

    if (session.currentIndex >= session.questions.length) {
      renderSummary();
      return;
    }

    const q = session.questions[session.currentIndex];
    const total = session.questions.length;
    const current = session.currentIndex + 1;
    const progressPercent = Math.round((current / total) * 100);

    const chapter = GrammarData.getChapterById(session.chapterId);

    let html = `
      <div class="trainer-header-bar">
        <button class="btn-icon-subtle" onclick="App.confirmExitTraining()">✕ 나가기</button>
        <div class="trainer-title-wrap">
          <span class="trainer-chapter-tag">${chapter.icon} ${chapter.title}</span>
          <div class="trainer-progress-text">${current} / ${total} 문항</div>
        </div>
        <div class="trainer-combo-pill ${session.combo > 1 ? 'active' : ''}">
          ⚡ ${session.combo} 콤보
        </div>
      </div>

      <div class="trainer-progress-track">
        <div class="trainer-progress-fill" style="width: ${progressPercent}%;"></div>
      </div>
    `;

    // Render by Mode
    if (session.mode === 'mcq') {
      html += renderMCQView(q);
    } else if (session.mode === 'error') {
      html += renderErrorView(q);
    } else if (session.mode === 'unscramble') {
      html += renderUnscrambleView(q);
    } else if (session.mode === 'cloze') {
      html += renderClozeView(q);
    }

    container.innerHTML = html;

    // Focus input if cloze or error mode
    if (session.mode === 'cloze') {
      const input = document.getElementById('cloze-answer-input');
      if (input) input.focus();
    } else if (session.mode === 'error') {
      const input = document.getElementById('error-correction-input');
      if (input) input.focus();
    }
  }

  // 1. MCQ View
  function renderMCQView(q) {
    return `
      <div class="training-card">
        <div class="q-type-badge">🎯 4지선다 실전 어법</div>
        <h3 class="q-prompt-text">${q.question.replace(/\n/g, '<br>')}</h3>

        <div class="mcq-options-list">
          ${q.options.map((opt, idx) => `
            <button class="mcq-option-btn" id="mcq-opt-${idx}" onclick="Trainer.submitMCQ(${idx})">
              <span class="opt-num">${idx + 1}</span>
              <span class="opt-text">${opt}</span>
            </button>
          `).join('')}
        </div>

        <div id="trainer-feedback-area" class="trainer-feedback-area" style="display:none;"></div>
      </div>
    `;
  }

  function submitMCQ(chosenIdx) {
    const q = session.questions[session.currentIndex];
    const isCorrect = chosenIdx === q.answerIndex;

    const optButtons = document.querySelectorAll('.mcq-option-btn');
    optButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.answerIndex) {
        btn.classList.add('correct');
      } else if (idx === chosenIdx && !isCorrect) {
        btn.classList.add('wrong');
      }
    });

    handleResult(isCorrect, q.options[chosenIdx], q.options[q.answerIndex], q.explanation);
  }

  // 2. Error Correction View
  function renderErrorView(q) {
    const highlightedSentence = q.originalSentence.replace(
      q.underlineTarget,
      `<span class="error-target-underline">${q.underlineTarget}</span>`
    );

    return `
      <div class="training-card">
        <div class="q-type-badge">🔍 어법 오류 수정 훈련</div>
        <p class="q-desc-sub">밑줄 친 부분이 어법상 올바르지 않습니다. 바르게 고친 단어를 입력하세요.</p>

        <div class="error-sentence-box">
          ${highlightedSentence}
          <button class="btn-speak-inline" onclick="Sound.speak('${q.originalSentence.replace(/'/g, "\\'")}')" title="음성 듣기">🔊</button>
        </div>

        <div class="error-input-row">
          <input type="text" id="error-correction-input" class="trainer-text-input" placeholder="올바르게 고친 단어 입력..." onkeydown="if(event.key==='Enter') Trainer.submitErrorCorrection()">
          <button class="btn-primary" onclick="Trainer.submitErrorCorrection()">정답 확인</button>
        </div>

        <div id="trainer-feedback-area" class="trainer-feedback-area" style="display:none;"></div>
      </div>
    `;
  }

  function submitErrorCorrection() {
    const input = document.getElementById('error-correction-input');
    if (!input) return;
    const userVal = input.value.trim();
    if (!userVal) {
      UI.showToast("수정할 단어를 입력해주세요.", "info");
      return;
    }

    const q = session.questions[session.currentIndex];
    const isCorrect = userVal.toLowerCase() === q.correctedWord.toLowerCase();
    input.disabled = true;

    handleResult(isCorrect, userVal, q.correctedWord, q.explanation);
  }

  // 3. Sentence Unscramble View
  function renderUnscrambleView(q) {
    if (session.unscrambleRemaining.length === 0 && session.unscrambleChosen.length === 0) {
      session.unscrambleRemaining = shuffleArray([...q.words]);
      session.unscrambleChosen = [];
    }

    return `
      <div class="training-card">
        <div class="q-type-badge">🧩 문장 조각 영작 배열</div>
        <div class="unscramble-prompt-kr">"${q.promptKr}"</div>

        <!-- Answer Slot -->
        <div class="unscramble-answer-slot" id="unscramble-answer-slot">
          ${session.unscrambleChosen.length === 0 ? '<span class="slot-placeholder">아래 단어 조각을 순서대로 터치하세요.</span>' : ''}
          ${session.unscrambleChosen.map((w, idx) => `
            <button class="unscramble-chip chosen" onclick="Trainer.unscrambleRemove(${idx})">${w}</button>
          `).join('')}
        </div>

        <!-- Word Pool -->
        <div class="unscramble-pool" id="unscramble-pool">
          ${session.unscrambleRemaining.map((w, idx) => `
            <button class="unscramble-chip" onclick="Trainer.unscramblePick(${idx})">${w}</button>
          `).join('')}
        </div>

        <div class="unscramble-actions-row">
          <button class="btn-secondary" onclick="Trainer.unscrambleReset()">🔄 다시 배열</button>
          <button class="btn-primary" onclick="Trainer.submitUnscramble()">정답 제출</button>
        </div>

        <div id="trainer-feedback-area" class="trainer-feedback-area" style="display:none;"></div>
      </div>
    `;
  }

  function unscramblePick(idx) {
    Sound.playClick();
    const word = session.unscrambleRemaining.splice(idx, 1)[0];
    session.unscrambleChosen.push(word);
    renderQuestion();
  }

  function unscrambleRemove(idx) {
    Sound.playClick();
    const word = session.unscrambleChosen.splice(idx, 1)[0];
    session.unscrambleRemaining.push(word);
    renderQuestion();
  }

  function unscrambleReset() {
    const q = session.questions[session.currentIndex];
    session.unscrambleRemaining = shuffleArray([...q.words]);
    session.unscrambleChosen = [];
    renderQuestion();
  }

  function submitUnscramble() {
    const q = session.questions[session.currentIndex];
    const userSentence = session.unscrambleChosen.join(' ');
    const isCorrect = userSentence.trim().toLowerCase() === q.answer.trim().toLowerCase();

    handleResult(isCorrect, userSentence, q.answer, `올바른 어순: ${q.answer}`);
  }

  // 4. Form Cloze View
  function renderClozeView(q) {
    const blankSentence = q.sentence.replace('________', '<span class="cloze-blank-highlight">________</span>');

    return `
      <div class="training-card">
        <div class="q-type-badge">✍️ 동사/준동사 형태 변형 완성</div>
        <p class="q-desc-sub">${q.hint ? `💡 힌트: ${q.hint}` : '괄호 안의 기본 단어를 문맥 어법에 맞게 변형하세요.'}</p>

        <div class="cloze-sentence-box">
          ${blankSentence}
        </div>

        <div class="cloze-input-row">
          <input type="text" id="cloze-answer-input" class="trainer-text-input" placeholder="정답 어형 입력..." onkeydown="if(event.key==='Enter') Trainer.submitCloze()">
          <button class="btn-primary" onclick="Trainer.submitCloze()">정답 제출</button>
        </div>

        <div id="trainer-feedback-area" class="trainer-feedback-area" style="display:none;"></div>
      </div>
    `;
  }

  function submitCloze() {
    const input = document.getElementById('cloze-answer-input');
    if (!input) return;
    const userVal = input.value.trim();
    if (!userVal) {
      UI.showToast("정답을 입력해주세요.", "info");
      return;
    }

    const q = session.questions[session.currentIndex];
    const isCorrect = userVal.toLowerCase() === q.answer.toLowerCase();
    input.disabled = true;

    handleResult(isCorrect, userVal, q.answer, q.explanation);
  }

  // Shared Result Handler
  function handleResult(isCorrect, userAnswer, correctAnswer, explanation) {
    const q = session.questions[session.currentIndex];
    Storage.recordExerciseResult(session.chapterId, q, isCorrect, userAnswer);

    if (isCorrect) {
      Sound.playCorrect();
      session.score += 100 + (session.combo * 15);
      session.combo += 1;
      if (session.combo > session.maxCombo) {
        session.maxCombo = session.combo;
      }
      if (session.combo > 2) {
        Sound.playCombo(session.combo);
      }
    } else {
      Sound.playWrong();
      session.combo = 0;
    }

    session.answers.push({
      question: q,
      userAnswer,
      correctAnswer,
      isCorrect,
      explanation
    });

    const feedbackArea = document.getElementById('trainer-feedback-area');
    if (feedbackArea) {
      feedbackArea.style.display = 'block';
      feedbackArea.className = `trainer-feedback-area ${isCorrect ? 'correct' : 'wrong'}`;
      feedbackArea.innerHTML = `
        <div class="feedback-status-row">
          <span class="status-icon">${isCorrect ? '🎉 정답입니다!' : '❌ 오답입니다'}</span>
          <span class="status-pts">${isCorrect ? `+${100 + ((session.combo - 1) * 15)} XP` : '0 XP'}</span>
        </div>
        ${!isCorrect ? `<div class="feedback-correct-answer"><strong>정답:</strong> ${correctAnswer}</div>` : ''}
        <p class="feedback-explanation"><strong>해설:</strong> ${explanation || '정확한 어법 규칙을 기억하세요.'}</p>
        <button class="btn-primary" onclick="Trainer.nextQuestion()">
          ${session.currentIndex + 1 < session.questions.length ? '다음 문항 →' : '결과 확인하기 🏆'}
        </button>
      `;
    }
  }

  function nextQuestion() {
    session.currentIndex += 1;
    session.unscrambleChosen = [];
    session.unscrambleRemaining = [];
    renderQuestion();
  }

  function renderSummary() {
    const container = document.getElementById('training-arena-container');
    if (!container) return;

    const total = session.questions.length;
    const correctCount = session.answers.filter(a => a.isCorrect).length;
    const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const chapter = GrammarData.getChapterById(session.chapterId);

    // Save chapter mastery
    Storage.saveChapterScore(session.chapterId, {
      lastScore: session.score,
      accuracy: accuracy,
      totalQuestions: total,
      correctCount: correctCount
    });

    if (accuracy >= 80) {
      Sound.playFanfare();
      UI.launchConfetti();
    }

    container.innerHTML = `
      <div class="training-summary-card">
        <div class="summary-badge-hero">${accuracy >= 80 ? '🏆' : '📚'}</div>
        <h2>훈련 완료!</h2>
        <p class="text-muted-sm">${chapter.title} — ${getModeTitle(session.mode)}</p>

        <div class="summary-stats-row">
          <div class="stat-pill">
            <span class="stat-label">정답률</span>
            <span class="stat-num">${accuracy}%</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">맞힌 문항</span>
            <span class="stat-num">${correctCount} / ${total}</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">최대 콤보</span>
            <span class="stat-num">${session.maxCombo} 콤보</span>
          </div>
          <div class="stat-pill">
            <span class="stat-label">획득 XP</span>
            <span class="stat-num">+${session.score} XP</span>
          </div>
        </div>

        <div class="summary-actions-row">
          <button class="btn-secondary" onclick="App.startChapterTraining('${session.chapterId}', '${session.mode}')">
            🔄 다시 훈련하기
          </button>
          <button class="btn-primary" onclick="LessonViewer.renderLesson('${session.chapterId}')">
            📖 개념 강의로 복귀
          </button>
          <button class="btn-outline" onclick="App.goHome()">
            🏠 홈 대시보드
          </button>
        </div>
      </div>
    `;
  }

  function getModeTitle(mode) {
    switch (mode) {
      case 'mcq': return '4지선다 어법 퀴즈';
      case 'error': return '어법 오류 수정 훈련';
      case 'unscramble': return '문장 조각 영작 배열';
      case 'cloze': return '동사/준동사 형태 변형';
      default: return '문법 실전 훈련';
    }
  }

  function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  return {
    startTraining,
    submitMCQ,
    submitErrorCorrection,
    unscramblePick,
    unscrambleRemove,
    unscrambleReset,
    submitUnscramble,
    submitCloze,
    nextQuestion
  };
})();
