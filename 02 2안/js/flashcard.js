/**
 * 3D Flashcard Controller with Leitner Spaced Repetition (English Master Pro 2.0)
 * Supports 3-tier self-rating, Auto-play slideshow, and keyboard shortcuts.
 */

const FlashcardController = (() => {
  let wordList = [];
  let currentIndex = 0;
  let isFlipped = false;
  let isAutoPlaying = false;
  let autoPlayTimer = null;
  let onCompleteCallback = null;

  function startSession(words, onComplete = null) {
    if (!words || words.length === 0) {
      UI.showToast('학습할 단어가 없습니다.', 'warning');
      return;
    }

    wordList = [...words];
    currentIndex = 0;
    isFlipped = false;
    isAutoPlaying = false;
    clearTimeout(autoPlayTimer);
    onCompleteCallback = onComplete;

    renderCard();
    UI.showScreen('flashcard-screen');

    // Auto pronounce first word if enabled in settings
    const settings = Storage.getSettings();
    if (settings.autoSpeak) {
      setTimeout(() => {
        Sound.speak(wordList[0].word);
      }, 300);
    }
  }

  function renderCard() {
    const container = document.getElementById('flashcard-container');
    if (!container) return;

    if (currentIndex >= wordList.length) {
      finishSession();
      return;
    }

    const currentWord = wordList[currentIndex];
    const progress = Storage.getWordProgress(currentWord.id);
    const isBookmarked = Storage.isBookmarked(currentWord.id);
    const total = wordList.length;
    const currentNum = currentIndex + 1;
    const progressPct = Math.round((currentNum / total) * 100);

    // Leitner Box level indicators
    let leitnerStars = '';
    for (let i = 1; i <= 5; i++) {
      leitnerStars += `<span class="leitner-dot ${i <= progress.leitnerBox ? 'active' : ''}"></span>`;
    }

    container.innerHTML = `
      <div class="flashcard-header">
        <button class="btn-icon-subtle" onclick="App.goBack()" title="뒤로가기">←</button>
        <div class="card-progress-info">
          <div class="card-counter">${currentNum} / ${total}</div>
          <div class="card-progress-bar-wrap">
            <div class="card-progress-bar-fill" style="width: ${progressPct}%"></div>
          </div>
        </div>
        <div class="card-header-actions">
          <button class="btn-icon-subtle ${isBookmarked ? 'bookmarked' : ''}" onclick="FlashcardController.toggleBookmark(${currentWord.id}, this)" title="북마크">
            ${isBookmarked ? '★' : '☆'}
          </button>
          <button class="btn-icon-subtle ${isAutoPlaying ? 'btn-autoplay-active' : ''}" onclick="FlashcardController.toggleAutoPlay()" title="자동 재생">
            ${isAutoPlaying ? '⏸️ 정지' : '▶️ 자동'}
          </button>
        </div>
      </div>

      <!-- 3D Perspective Card Scene -->
      <div class="flashcard-scene" onclick="FlashcardController.flipCard()">
        <div class="flashcard ${isFlipped ? 'is-flipped' : ''}" id="main-flashcard">
          <!-- FRONT FACE -->
          <div class="flashcard-face flashcard-front">
            <div class="card-badge-row">
              <span class="pos-badge pos-${currentWord.pos}">${currentWord.pos.toUpperCase()}</span>
              <span class="level-pill level-${currentWord.level}">Lv.${currentWord.level} · Day ${currentWord.day || 1}</span>
              <div class="leitner-indicators" title="암기 숙련도 (${progress.leitnerBox}/5단계)">
                ${leitnerStars}
              </div>
            </div>

            <div class="word-main-display">
              <h2 class="card-word">${currentWord.word}</h2>
              <div class="card-ipa">${currentWord.ipa || ''}</div>
            </div>

            <div class="card-audio-controls" onclick="event.stopPropagation()">
              <button class="btn-audio" onclick="Sound.speak('${currentWord.word}')" title="원어민 발음 듣기">
                🔊 발음 듣기
              </button>
              <button class="btn-audio btn-audio-slow" onclick="Sound.speakSlow('${currentWord.word}')" title="느리게 듣기">
                🐢 느리게
              </button>
            </div>

            ${currentWord.etymology ? `
              <div class="card-etymology-preview">
                <span class="etymology-label">💡 어원 꿀팁:</span> ${currentWord.etymology}
              </div>
            ` : ''}

            <div class="card-tap-hint">
              <span>👆 탭하여 뜻과 예문 확인 (Space)</span>
            </div>
          </div>

          <!-- BACK FACE -->
          <div class="flashcard-face flashcard-back">
            <div class="card-badge-row">
              <span class="pos-badge pos-${currentWord.pos}">${currentWord.pos.toUpperCase()}</span>
              <span class="card-word-sm">${currentWord.word}</span>
            </div>

            <div class="meaning-section">
              <h3 class="card-meaning">${currentWord.meaning}</h3>
              ${currentWord.collocation ? `
                <div class="card-collocation">
                  <span class="colloc-tag">빈출 연어</span> ${currentWord.collocation}
                </div>
              ` : ''}
            </div>

            <div class="example-section">
              <div class="example-eng">
                "${currentWord.example.replace(new RegExp('(' + currentWord.word + '[a-z]*)', 'gi'), '<strong>$1</strong>')}"
                <button class="btn-mini-audio" onclick="event.stopPropagation(); Sound.speak('${currentWord.example.replace(/'/g, "\\'")}')">🔊</button>
              </div>
              <div class="example-kr">${currentWord.exampleMeaning}</div>
            </div>

            ${currentWord.synonyms && currentWord.synonyms.length > 0 ? `
              <div class="card-synonyms">
                <span class="syn-label">유의어:</span>
                ${currentWord.synonyms.map(s => `<span class="syn-tag">${s}</span>`).join(' ')}
              </div>
            ` : ''}

            <div class="card-tap-hint">
              <span>👆 탭하여 단어로 돌아가기</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Rating Buttons (Leitner 3 Tiers) -->
      <div class="flashcard-rating-bar">
        <button class="btn-rate btn-rate-hard" onclick="FlashcardController.rateCard(1)" title="단축키: 1 또는 ←">
          <span class="rate-icon">❌</span>
          <span class="rate-text">몰라요</span>
          <span class="rate-shortcut">[ 1 ]</span>
        </button>
        <button class="btn-rate btn-rate-good" onclick="FlashcardController.rateCard(2)" title="단축키: 2 또는 ↓">
          <span class="rate-icon">🤔</span>
          <span class="rate-text">애매해요</span>
          <span class="rate-shortcut">[ 2 ]</span>
        </button>
        <button class="btn-rate btn-rate-easy" onclick="FlashcardController.rateCard(3)" title="단축키: 3 또는 →">
          <span class="rate-icon">✅</span>
          <span class="rate-text">알아요</span>
          <span class="rate-shortcut">[ 3 ]</span>
        </button>
      </div>
    `;
  }

  function flipCard() {
    isFlipped = !isFlipped;
    Sound.playFlip();
    const cardEl = document.getElementById('main-flashcard');
    if (cardEl) {
      if (isFlipped) {
        cardEl.classList.add('is-flipped');
      } else {
        cardEl.classList.remove('is-flipped');
      }
    }
  }

  function rateCard(quality) {
    if (currentIndex >= wordList.length) return;
    const currentWord = wordList[currentIndex];

    const isCorrect = quality >= 2;
    Storage.recordWordResult(currentWord.id, isCorrect, quality);

    if (quality === 3) {
      Sound.playCorrect();
    } else if (quality === 1) {
      Sound.playWrong();
    } else {
      Sound.playClick();
    }

    // Advance to next card
    currentIndex++;
    isFlipped = false;

    if (currentIndex < wordList.length) {
      renderCard();
      const settings = Storage.getSettings();
      if (settings.autoSpeak) {
        setTimeout(() => {
          Sound.speak(wordList[currentIndex].word);
        }, 200);
      }
    } else {
      finishSession();
    }
  }

  function toggleBookmark(wordId, btnEl) {
    const isBookmarked = Storage.toggleBookmark(wordId);
    if (btnEl) {
      btnEl.textContent = isBookmarked ? '★' : '☆';
      btnEl.classList.toggle('bookmarked', isBookmarked);
    }
    UI.showToast(isBookmarked ? '북마크에 저장되었습니다.' : '북마크가 해제되었습니다.', 'info');
  }

  function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    if (isAutoPlaying) {
      runAutoPlayStep();
      UI.showToast('자동 학습 모드를 시작합니다.', 'info');
    } else {
      clearTimeout(autoPlayTimer);
      UI.showToast('자동 학습 모드가 정지되었습니다.', 'info');
    }
    renderCard();
  }

  function runAutoPlayStep() {
    if (!isAutoPlaying || currentIndex >= wordList.length) {
      isAutoPlaying = false;
      return;
    }

    const currentWord = wordList[currentIndex];

    // 1. Speak word
    Sound.speak(currentWord.word, 0.9, () => {
      // 2. Flip card after 1.5s
      autoPlayTimer = setTimeout(() => {
        if (!isAutoPlaying) return;
        if (!isFlipped) flipCard();

        // 3. Speak example sentence
        Sound.speak(currentWord.example, 0.85, () => {
          // 4. Advance after 2s
          autoPlayTimer = setTimeout(() => {
            if (!isAutoPlaying) return;
            rateCard(3); // Mark as learned
            runAutoPlayStep();
          }, 2000);
        });
      }, 1500);
    });
  }

  function finishSession() {
    clearTimeout(autoPlayTimer);
    isAutoPlaying = false;
    Sound.playVictory();

    const container = document.getElementById('flashcard-container');
    if (container) {
      container.innerHTML = `
        <div class="session-complete-card">
          <div class="complete-trophy">🎉</div>
          <h2>플래시카드 학습 완료!</h2>
          <p>총 <strong>${wordList.length}개</strong> 단어를 성공적으로 검토했습니다.</p>
          <div class="xp-earned-badge">+${wordList.length * 10} XP 획득!</div>
          <div class="complete-actions">
            <button class="btn-primary" onclick="FlashcardController.startSession(FlashcardController.getWordList())">🔄 한 번 더 학습</button>
            <button class="btn-secondary" onclick="App.startQuizFromCurrentScope()">🎯 퀴즈로 실력 점검</button>
            <button class="btn-outline" onclick="App.goHome()">🏠 홈으로 돌아가기</button>
          </div>
        </div>
      `;
      UI.launchConfetti();
    }

    if (onCompleteCallback) {
      onCompleteCallback();
    }
  }

  function handleKeyboardShortcut(e) {
    if (document.getElementById('flashcard-screen')?.classList.contains('active')) {
      if (e.code === 'Space') {
        e.preventDefault();
        flipCard();
      } else if (e.key === '1' || e.key === 'ArrowLeft') {
        rateCard(1);
      } else if (e.key === '2' || e.key === 'ArrowDown') {
        rateCard(2);
      } else if (e.key === '3' || e.key === 'ArrowRight') {
        rateCard(3);
      } else if (e.key.toLowerCase() === 's') {
        if (wordList[currentIndex]) Sound.speak(wordList[currentIndex].word);
      }
    }
  }

  return {
    startSession,
    renderCard,
    flipCard,
    rateCard,
    toggleBookmark,
    toggleAutoPlay,
    handleKeyboardShortcut,
    getWordList: () => wordList
  };
})();
