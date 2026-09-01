/**
 * Comprehensive Quiz & Interactive Training Engine (English Master Pro 2.0)
 * Modes:
 * 1. Multiple Choice (4지선다: 영->한, 한->영)
 * 2. Spelling & Typing Trainer (스펠링 마스터)
 * 3. Speed Match Game (스피드 카드 매칭)
 * 4. Sentence Cloze (예문 빈칸 완성)
 * 5. Listening & Dictation (소리 듣고 맞히기)
 */

const QuizEngine = (() => {
  let currentMode = 'mcq'; // 'mcq', 'spelling', 'match', 'sentence', 'listening'
  let currentWords = [];
  let currentIndex = 0;
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let streakCombo = 0;
  let maxCombo = 0;
  let quizDirection = 'en-to-kr'; // 'en-to-kr', 'kr-to-en'
  let currentQuestion = null;
  let matchSelectedTile = null;
  let matchTimer = null;
  let matchTimeRemaining = 60;
  let matchClearedPairs = 0;
  let userResults = [];

  // ===== Start Quiz Session =====
  function startQuiz({ mode = 'mcq', words = [], direction = 'en-to-kr', count = 10 }) {
    if (!words || words.length === 0) {
      UI.showToast('퀴즈를 진행할 단어가 없습니다.', 'warning');
      return;
    }

    currentMode = mode;
    quizDirection = direction;
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;
    streakCombo = 0;
    maxCombo = 0;
    userResults = [];

    // Shuffle and slice requested count
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    currentWords = shuffled.slice(0, Math.min(count, shuffled.length));

    if (currentMode === 'match') {
      startMatchingGame();
    } else {
      renderQuestion();
    }
  }

  // ===== Question Router =====
  function renderQuestion() {
    if (currentIndex >= currentWords.length) {
      finishQuiz();
      return;
    }

    const word = currentWords[currentIndex];
    const allWords = DataManager.getAllWords();
    const totalQ = currentWords.length;
    const qNum = currentIndex + 1;
    const progressPct = Math.round((qNum / totalQ) * 100);

    const container = document.getElementById('quiz-arena-container');
    if (!container) return;

    // Build question data
    if (currentMode === 'mcq') {
      renderMCQQuestion(container, word, allWords, qNum, totalQ, progressPct);
    } else if (currentMode === 'spelling') {
      renderSpellingQuestion(container, word, qNum, totalQ, progressPct);
    } else if (currentMode === 'sentence') {
      renderSentenceQuestion(container, word, allWords, qNum, totalQ, progressPct);
    } else if (currentMode === 'listening') {
      renderListeningQuestion(container, word, allWords, qNum, totalQ, progressPct);
    }
  }

  // ==========================================
  // 1. Multiple Choice Quiz (4지선다)
  // ==========================================
  function renderMCQQuestion(container, word, allWords, qNum, totalQ, progressPct) {
    const isEnToKr = quizDirection === 'en-to-kr';

    // Generate 3 distractors from similar level or POS
    const candidates = allWords.filter(w => w.id !== word.id && (w.level === word.level || w.pos === word.pos));
    const shuffledCandidates = candidates.sort(() => Math.random() - 0.5).slice(0, 3);

    // Fallback if not enough same level
    if (shuffledCandidates.length < 3) {
      const extra = allWords.filter(w => w.id !== word.id && !shuffledCandidates.includes(w)).sort(() => Math.random() - 0.5);
      shuffledCandidates.push(...extra.slice(0, 3 - shuffledCandidates.length));
    }

    const options = [word, ...shuffledCandidates].sort(() => Math.random() - 0.5);

    currentQuestion = {
      word,
      options,
      correctId: word.id,
      answered: false
    };

    container.innerHTML = `
      <div class="quiz-top-bar">
        <button class="btn-icon-subtle" onclick="App.goBack()">← 중단</button>
        <div class="quiz-progress-wrap">
          <div class="quiz-q-counter">문제 ${qNum} / ${totalQ}</div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <div class="quiz-combo-badge ${streakCombo >= 2 ? 'active' : ''}">
          🔥 ${streakCombo} 콤보
        </div>
      </div>

      <div class="quiz-question-card">
        <div class="quiz-pos-tag">${word.pos.toUpperCase()}</div>
        <h2 class="quiz-prompt-text">${isEnToKr ? word.word : word.meaning}</h2>
        ${isEnToKr && word.ipa ? `<div class="quiz-prompt-ipa">${word.ipa}</div>` : ''}
        ${isEnToKr ? `
          <button class="btn-audio-pill" onclick="Sound.speak('${word.word}')">🔊 발음 듣기</button>
        ` : ''}
      </div>

      <div class="quiz-options-grid">
        ${options.map((opt, idx) => `
          <button class="quiz-option-btn" id="opt-btn-${opt.id}" onclick="QuizEngine.checkMCQAnswer(${opt.id})">
            <span class="opt-num">${idx + 1}</span>
            <span class="opt-text">${isEnToKr ? opt.meaning : opt.word}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-box" style="display:none;"></div>
    `;

    if (isEnToKr && Storage.getSettings().autoSpeak) {
      setTimeout(() => Sound.speak(word.word), 150);
    }
  }

  function checkMCQAnswer(selectedId) {
    if (!currentQuestion || currentQuestion.answered) return;
    currentQuestion.answered = true;

    const isCorrect = selectedId === currentQuestion.correctId;
    const targetWord = currentQuestion.word;

    // Visual styles on options
    document.querySelectorAll('.quiz-option-btn').forEach(btn => btn.disabled = true);
    const correctBtn = document.getElementById(`opt-btn-${currentQuestion.correctId}`);
    if (correctBtn) correctBtn.classList.add('correct');

    if (!isCorrect) {
      const wrongBtn = document.getElementById(`opt-btn-${selectedId}`);
      if (wrongBtn) wrongBtn.classList.add('wrong');
    }

    // Process answer
    handleAnswerResult(isCorrect, targetWord);

    // Show explanation feedback
    const feedbackBox = document.getElementById('quiz-feedback-box');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'is-correct' : 'is-wrong'}`;
      feedbackBox.innerHTML = `
        <div class="fb-header">
          <span class="fb-icon">${isCorrect ? '✅ 정답입니다!' : '❌ 아쉽네요, 오답입니다!'}</span>
        </div>
        <div class="fb-detail">
          <strong>${targetWord.word}</strong> [${targetWord.pos}] : ${targetWord.meaning}
          ${targetWord.collocation ? `<br><span class="fb-colloc">연어: ${targetWord.collocation}</span>` : ''}
          ${targetWord.example ? `<br><span class="fb-example">예문: "${targetWord.example}" (${targetWord.exampleMeaning})</span>` : ''}
        </div>
        <button class="btn-next-question" onclick="QuizEngine.nextQuestion()">다음 문제 → (Enter)</button>
      `;
    }
  }

  // ==========================================
  // 2. Spelling & Typing Trainer
  // ==========================================
  function renderSpellingQuestion(container, word, qNum, totalQ, progressPct) {
    currentQuestion = {
      word,
      correctId: word.id,
      answered: false
    };

    // First letter hint
    const firstLetter = word.word.charAt(0);
    const length = word.word.length;

    container.innerHTML = `
      <div class="quiz-top-bar">
        <button class="btn-icon-subtle" onclick="App.goBack()">← 중단</button>
        <div class="quiz-progress-wrap">
          <div class="quiz-q-counter">문제 ${qNum} / ${totalQ}</div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <div class="quiz-combo-badge ${streakCombo >= 2 ? 'active' : ''}">
          🔥 ${streakCombo} 콤보
        </div>
      </div>

      <div class="quiz-question-card">
        <div class="quiz-pos-tag">${word.pos.toUpperCase()}</div>
        <h2 class="quiz-prompt-text">${word.meaning}</h2>
        <div class="spelling-word-meta">
          <span class="spelling-hint-pill">글자 수: ${length}자리</span>
          <span class="spelling-hint-pill">첫 글자: <strong>${firstLetter.toUpperCase()}</strong></span>
          <button class="btn-audio-pill" onclick="Sound.speak('${word.word}')">🔊 발음 힌트</button>
        </div>
      </div>

      <div class="spelling-input-area">
        <input type="text" id="spelling-input" class="spelling-input"
               placeholder="영단어를 입력하세요..." autocomplete="off" autocorrect="off"
               autocapitalize="off" spellcheck="false" autofocus>
        <button class="btn-submit-spelling" onclick="QuizEngine.checkSpellingAnswer()">확인 (Enter)</button>
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-box" style="display:none;"></div>
    `;

    setTimeout(() => {
      const input = document.getElementById('spelling-input');
      if (input) {
        input.focus();
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            QuizEngine.checkSpellingAnswer();
          }
        });
      }
    }, 100);
  }

  function checkSpellingAnswer() {
    if (!currentQuestion || currentQuestion.answered) return;
    const input = document.getElementById('spelling-input');
    if (!input) return;

    const userVal = input.value.trim().toLowerCase();
    if (!userVal) {
      UI.showToast('단어를 입력해주세요!', 'warning');
      return;
    }

    currentQuestion.answered = true;
    const targetWord = currentQuestion.word;
    const isCorrect = userVal === targetWord.word.toLowerCase();

    input.disabled = true;
    input.classList.add(isCorrect ? 'correct' : 'wrong');

    handleAnswerResult(isCorrect, targetWord);

    // Speak word on answer
    Sound.speak(targetWord.word);

    const feedbackBox = document.getElementById('quiz-feedback-box');
    if (feedbackBox) {
      feedbackBox.style.display = 'block';
      feedbackBox.className = `quiz-feedback-box ${isCorrect ? 'is-correct' : 'is-wrong'}`;
      feedbackBox.innerHTML = `
        <div class="fb-header">
          <span class="fb-icon">${isCorrect ? '🎉 정확합니다!' : '❌ 철자가 틀렸습니다!'}</span>
        </div>
        <div class="fb-detail">
          정답: <strong class="correct-word-highlight">${targetWord.word}</strong> [${targetWord.ipa || ''}]
          <br>${targetWord.meaning}
          ${targetWord.example ? `<br><span class="fb-example">예문: "${targetWord.example}"</span>` : ''}
        </div>
        <button class="btn-next-question" onclick="QuizEngine.nextQuestion()">다음 문제 → (Enter)</button>
      `;
    }
  }

  // ==========================================
  // 3. Sentence Cloze Quiz (예문 빈칸)
  // ==========================================
  function renderSentenceQuestion(container, word, allWords, qNum, totalQ, progressPct) {
    // Cloze the word in example sentence
    const regex = new RegExp(`\\b${word.word}[a-z]*\\b`, 'gi');
    const clozeSentence = word.example.replace(regex, '________');

    // 3 distractors
    const candidates = allWords.filter(w => w.id !== word.id && w.pos === word.pos).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [word, ...candidates].sort(() => Math.random() - 0.5);

    currentQuestion = {
      word,
      options,
      correctId: word.id,
      answered: false
    };

    container.innerHTML = `
      <div class="quiz-top-bar">
        <button class="btn-icon-subtle" onclick="App.goBack()">← 중단</button>
        <div class="quiz-progress-wrap">
          <div class="quiz-q-counter">문제 ${qNum} / ${totalQ}</div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <div class="quiz-combo-badge ${streakCombo >= 2 ? 'active' : ''}">
          🔥 ${streakCombo} 콤보
        </div>
      </div>

      <div class="quiz-question-card">
        <div class="quiz-pos-tag">문맥 빈칸 추론</div>
        <div class="cloze-sentence-display">"${clozeSentence}"</div>
        <div class="cloze-translation">해석: ${word.exampleMeaning}</div>
      </div>

      <div class="quiz-options-grid">
        ${options.map((opt, idx) => `
          <button class="quiz-option-btn" id="opt-btn-${opt.id}" onclick="QuizEngine.checkMCQAnswer(${opt.id})">
            <span class="opt-num">${idx + 1}</span>
            <span class="opt-text">${opt.word} <small>(${opt.meaning})</small></span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-box" style="display:none;"></div>
    `;
  }

  // ==========================================
  // 4. Listening & Audio First Quiz
  // ==========================================
  function renderListeningQuestion(container, word, allWords, qNum, totalQ, progressPct) {
    const candidates = allWords.filter(w => w.id !== word.id).sort(() => Math.random() - 0.5).slice(0, 3);
    const options = [word, ...candidates].sort(() => Math.random() - 0.5);

    currentQuestion = {
      word,
      options,
      correctId: word.id,
      answered: false
    };

    container.innerHTML = `
      <div class="quiz-top-bar">
        <button class="btn-icon-subtle" onclick="App.goBack()">← 중단</button>
        <div class="quiz-progress-wrap">
          <div class="quiz-q-counter">문제 ${qNum} / ${totalQ}</div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <div class="quiz-combo-badge ${streakCombo >= 2 ? 'active' : ''}">
          🔥 ${streakCombo} 콤보
        </div>
      </div>

      <div class="quiz-question-card listening-card">
        <div class="quiz-pos-tag">🎧 리스닝 청취 훈련</div>
        <div class="listening-soundwave-wrap">
          <button class="btn-big-listen" onclick="Sound.speak('${word.word}')">
            🔊 다시 듣기
          </button>
          <button class="btn-slow-listen" onclick="Sound.speakSlow('${word.word}')">
            🐢 느리게 듣기
          </button>
        </div>
        <div class="listening-instruction">소리를 잘 듣고 알맞은 단어/뜻을 선택하세요.</div>
      </div>

      <div class="quiz-options-grid">
        ${options.map((opt, idx) => `
          <button class="quiz-option-btn" id="opt-btn-${opt.id}" onclick="QuizEngine.checkMCQAnswer(${opt.id})">
            <span class="opt-num">${idx + 1}</span>
            <span class="opt-text"><strong>${opt.word}</strong> — ${opt.meaning}</span>
          </button>
        `).join('')}
      </div>

      <div id="quiz-feedback-box" class="quiz-feedback-box" style="display:none;"></div>
    `;

    // Speak immediately
    setTimeout(() => Sound.speak(word.word), 300);
  }

  // ==========================================
  // 5. Speed Match Battle (스피드 카드 매칭)
  // ==========================================
  function startMatchingGame() {
    const container = document.getElementById('quiz-arena-container');
    if (!container) return;

    // Pick 8 words
    const gameWords = currentWords.slice(0, 8);
    matchClearedPairs = 0;
    matchTimeRemaining = 45;
    matchSelectedTile = null;

    // Create cards: 8 English + 8 Korean
    const cards = [];
    gameWords.forEach(w => {
      cards.push({ id: w.id, type: 'en', text: w.word, raw: w });
      cards.push({ id: w.id, type: 'kr', text: w.meaning, raw: w });
    });

    // Shuffle cards
    cards.sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="quiz-top-bar">
        <button class="btn-icon-subtle" onclick="QuizEngine.stopMatchingGame(); App.goBack();">← 중단</button>
        <div class="match-timer-badge">
          ⏱️ 남은 시간: <span id="match-timer-val">45</span>초
        </div>
        <div class="quiz-combo-badge" id="match-combo-badge">
          🔥 0 콤보
        </div>
      </div>

      <div class="match-instructions">
        영어 단어와 알맞은 한국어 뜻 카드를 빠르게 매칭하세요!
      </div>

      <div class="match-grid" id="match-grid">
        ${cards.map((c, idx) => `
          <div class="match-tile" id="match-tile-${idx}" data-id="${c.id}" data-type="${c.type}"
               onclick="QuizEngine.handleMatchTileClick(this, ${c.id}, '${c.type}', '${c.text}')">
            <span class="tile-text">${c.text}</span>
          </div>
        `).join('')}
      </div>
    `;

    // Start Timer
    clearInterval(matchTimer);
    matchTimer = setInterval(() => {
      matchTimeRemaining--;
      const timerEl = document.getElementById('match-timer-val');
      if (timerEl) timerEl.textContent = matchTimeRemaining;

      if (matchTimeRemaining <= 0) {
        clearInterval(matchTimer);
        finishQuiz();
      }
    }, 1000);
  }

  function handleMatchTileClick(tileEl, id, type, text) {
    if (tileEl.classList.contains('cleared') || tileEl.classList.contains('selected')) return;

    Sound.playClick();

    if (!matchSelectedTile) {
      // First tile of pair
      matchSelectedTile = { el: tileEl, id, type, text };
      tileEl.classList.add('selected');
    } else {
      // Second tile of pair
      const first = matchSelectedTile;

      if (first.el === tileEl) {
        // Deselect
        tileEl.classList.remove('selected');
        matchSelectedTile = null;
        return;
      }

      // Check match: Same ID and different type (en <-> kr)
      if (first.id === id && first.type !== type) {
        // MATCH SUCCESS!
        first.el.classList.remove('selected');
        first.el.classList.add('cleared');
        tileEl.classList.add('cleared');

        streakCombo++;
        if (streakCombo > maxCombo) maxCombo = streakCombo;
        correctCount++;
        score += 100 + (streakCombo * 20);

        Sound.playCombo(streakCombo);
        Storage.recordWordResult(id, true, 3);

        const comboBadge = document.getElementById('match-combo-badge');
        if (comboBadge) {
          comboBadge.textContent = `🔥 ${streakCombo} 콤보 (+${100 + streakCombo * 20}점)`;
          comboBadge.classList.add('active');
        }

        matchSelectedTile = null;
        matchClearedPairs++;

        if (matchClearedPairs >= Math.min(8, currentWords.length)) {
          clearInterval(matchTimer);
          setTimeout(() => finishQuiz(), 500);
        }
      } else {
        // MATCH FAILED!
        streakCombo = 0;
        wrongCount++;
        Sound.playWrong();
        Storage.recordWordResult(id, false);

        first.el.classList.add('mismatch');
        tileEl.classList.add('mismatch');

        const comboBadge = document.getElementById('match-combo-badge');
        if (comboBadge) {
          comboBadge.textContent = `🔥 0 콤보`;
          comboBadge.classList.remove('active');
        }

        setTimeout(() => {
          first.el.classList.remove('selected', 'mismatch');
          tileEl.classList.remove('mismatch');
        }, 500);

        matchSelectedTile = null;
      }
    }
  }

  function stopMatchingGame() {
    clearInterval(matchTimer);
  }

  // ===== General Result Handler =====
  function handleAnswerResult(isCorrect, targetWord) {
    if (isCorrect) {
      streakCombo++;
      if (streakCombo > maxCombo) maxCombo = streakCombo;
      correctCount++;
      score += 100 + (streakCombo * 15);
      Sound.playCombo(streakCombo);
      Storage.recordWordResult(targetWord.id, true);
    } else {
      streakCombo = 0;
      wrongCount++;
      Sound.playWrong();
      Storage.recordWordResult(targetWord.id, false);
    }

    userResults.push({
      word: targetWord,
      isCorrect
    });
  }

  function nextQuestion() {
    currentIndex++;
    renderQuestion();
  }

  // ===== Finish Quiz & Render Report =====
  function finishQuiz() {
    clearInterval(matchTimer);
    Sound.playVictory();

    const total = currentWords.length;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    if (pct === 100) {
      Storage.unlockBadge('perfect_quiz');
      UI.launchConfetti();
    }
    if (maxCombo >= 8) {
      Storage.unlockBadge('speed_master');
    }

    const container = document.getElementById('quiz-arena-container');
    if (!container) return;

    container.innerHTML = `
      <div class="quiz-result-summary-card">
        <div class="result-trophy">${pct >= 80 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
        <h2>퀴즈 결과 리포트</h2>
        <div class="result-score-circle">
          <span class="score-pct">${pct}%</span>
          <span class="score-fraction">${correctCount} / ${total} 정답</span>
        </div>

        <div class="result-stats-row">
          <div class="res-stat-item">
            <div class="res-val">+${score} XP</div>
            <div class="res-lbl">획득 경험치</div>
          </div>
          <div class="res-stat-item">
            <div class="res-val">🔥 ${maxCombo}</div>
            <div class="res-lbl">최대 콤보</div>
          </div>
          <div class="res-stat-item">
            <div class="res-val">${wrongCount}개</div>
            <div class="res-lbl">오답 단어</div>
          </div>
        </div>

        <!-- Wrong Word Quick List -->
        ${userResults.some(r => !r.isCorrect) ? `
          <div class="result-wrong-list-wrap">
            <h3>📝 이번 퀴즈 오답 단어 (오답노트에 자동 저장됨)</h3>
            <div class="result-wrong-chips">
              ${userResults.filter(r => !r.isCorrect).map(r => `
                <div class="wrong-chip" onclick="UI.showWordDetailModal(${r.word.id})">
                  <strong>${r.word.word}</strong> : ${r.word.meaning}
                </div>
              `).join('')}
            </div>
          </div>
        ` : '<p class="all-correct-p">🎉 모든 문제를 맞혔습니다! 완벽합니다!</p>'}

        <div class="result-action-buttons">
          <button class="btn-primary" onclick="QuizEngine.startQuiz({ mode: '${currentMode}', words: QuizEngine.getCurrentWords(), direction: '${quizDirection}', count: ${total} })">
            🔄 다시 풀기
          </button>
          <button class="btn-secondary" onclick="App.showStudySetup()">
            ✏️ 다른 학습 모드 선택
          </button>
          <button class="btn-outline" onclick="App.goHome()">
            🏠 홈으로
          </button>
        </div>
      </div>
    `;
  }

  function handleKeyboardShortcut(e) {
    if (document.getElementById('quiz-arena-screen')?.classList.contains('active')) {
      if (currentQuestion && currentQuestion.answered) {
        if (e.key === 'Enter') {
          nextQuestion();
        }
      } else if (currentMode === 'mcq' || currentMode === 'sentence' || currentMode === 'listening') {
        if (['1', '2', '3', '4'].includes(e.key)) {
          const idx = parseInt(e.key) - 1;
          if (currentQuestion && currentQuestion.options && currentQuestion.options[idx]) {
            checkMCQAnswer(currentQuestion.options[idx].id);
          }
        }
      }
    }
  }

  return {
    startQuiz,
    renderQuestion,
    checkMCQAnswer,
    checkSpellingAnswer,
    handleMatchTileClick,
    stopMatchingGame,
    nextQuestion,
    finishQuiz,
    handleKeyboardShortcut,
    getCurrentWords: () => currentWords
  };
})();
