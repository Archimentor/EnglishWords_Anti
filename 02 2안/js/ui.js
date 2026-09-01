/**
 * UI Renderer & Screen Router (English Master Pro 2.0)
 * Handles screens, dashboard widgets, modal views, toasts, and celebratory visual effects.
 */

const UI = (() => {
  let activeScreenId = 'dashboard-screen';

  // ===== Screen Management =====
  function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      activeScreenId = screenId;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update bottom nav & drawer active states
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    const navMap = {
      'dashboard-screen': 'nav-home',
      'curriculum-screen': 'nav-curriculum',
      'wordlist-screen': 'nav-words',
      'wrong-words-screen': 'nav-wrong',
      'stats-screen': 'nav-stats'
    };
    const navId = navMap[screenId];
    if (navId) {
      const el = document.getElementById(navId);
      if (el) el.classList.add('active');
    }
  }

  function getActiveScreen() {
    return activeScreenId;
  }

  // ===== Theme System =====
  function initTheme() {
    const settings = Storage.getSettings();
    document.documentElement.setAttribute('data-theme', settings.theme || 'light');
    updateThemeIcon(settings.theme || 'light');
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    Storage.updateSettings({ theme: next });
    updateThemeIcon(next);
    showToast(`${next === 'dark' ? '다크' : '라이트'} 모드로 전환되었습니다.`, 'info');
  }

  function updateThemeIcon(theme) {
    const iconEls = document.querySelectorAll('.theme-toggle-icon');
    iconEls.forEach(el => {
      el.textContent = theme === 'dark' ? '☀️' : '🌙';
    });
  }

  // ===== Toast Notifications =====
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: '✅', warning: '⚠️', error: '❌', info: '💡' };
    const toast = document.createElement('div');
    toast.className = `toast-pill toast-${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span> <span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  // ===== Dashboard Rendering =====
  function renderDashboard() {
    const allWords = DataManager.getAllWords();
    const progress = Storage.getProgress();
    const streak = Storage.getStreakData();
    const xpData = Storage.getXPData();
    const wrongMap = Storage.getWrongWordsMap();
    const dueWords = Storage.getDueReviewWords(allWords);
    const settings = Storage.getSettings();
    const todayStats = Storage.getDailyStats();
    const todayStr = new Date().toISOString().slice(0, 10);
    const studiedToday = todayStats[todayStr] || 0;
    const dailyGoal = settings.dailyGoal || 20;
    const goalPct = Math.min(100, Math.round((studiedToday / dailyGoal) * 100));

    // Mastered count (Leitner Box >= 3)
    const masteredCount = Object.values(progress).filter(p => p.leitnerBox >= 3).length;
    const learningCount = Object.values(progress).filter(p => p.correctCount > 0 && p.leitnerBox < 3).length;

    // Header stats
    const totalWordsEl = document.getElementById('dash-total-words');
    const masteredEl = document.getElementById('dash-mastered-words');
    const streakEl = document.getElementById('dash-streak-days');
    const xpLevelEl = document.getElementById('dash-xp-level');
    const xpTitleEl = document.getElementById('dash-xp-title');

    if (totalWordsEl) totalWordsEl.textContent = allWords.length.toLocaleString();
    if (masteredEl) masteredEl.textContent = masteredCount.toLocaleString();
    if (streakEl) streakEl.textContent = streak.current;
    if (xpLevelEl) xpLevelEl.textContent = `Lv.${xpData.level}`;
    if (xpTitleEl) xpTitleEl.textContent = xpData.title;

    // Daily Goal Widget
    const goalProgressEl = document.getElementById('dash-goal-progress');
    const goalTextEl = document.getElementById('dash-goal-text');
    if (goalProgressEl) goalProgressEl.style.width = `${goalPct}%`;
    if (goalTextEl) goalTextEl.textContent = `${studiedToday} / ${dailyGoal} 단어 (${goalPct}%)`;

    // Today's Review Banner (Ebbinghaus)
    const reviewBanner = document.getElementById('dash-review-banner');
    if (reviewBanner) {
      if (dueWords.length > 0) {
        reviewBanner.style.display = 'flex';
        reviewBanner.innerHTML = `
          <div class="banner-icon-area">🔄</div>
          <div class="banner-text-area">
            <h4>오늘의 복습 알림</h4>
            <p>에빙하우스 망각곡선 주기에 도달한 <strong>${dueWords.length}개</strong> 단어가 대기 중입니다!</p>
          </div>
          <button class="btn-banner-action" onclick="App.startReviewSession()">지금 복습하기 →</button>
        `;
      } else {
        reviewBanner.style.display = 'none';
      }
    }

    // Wrong Words Banner
    const wrongCountTotal = Object.keys(wrongMap).length;
    const wrongBanner = document.getElementById('dash-wrong-banner');
    if (wrongBanner) {
      if (wrongCountTotal > 0) {
        wrongBanner.style.display = 'flex';
        wrongBanner.innerHTML = `
          <div class="banner-icon-area">📝</div>
          <div class="banner-text-area">
            <h4>오답노트 복습 추천</h4>
            <p>틀린 적이 있는 <strong>${wrongCountTotal}개</strong> 단어를 집중 공략하세요!</p>
          </div>
          <button class="btn-banner-action btn-banner-wrong" onclick="App.goToWrongWords()">오답노트 열기 →</button>
        `;
      } else {
        wrongBanner.style.display = 'none';
      }
    }

    // Render Level Curriculum Cards
    const levelCardsContainer = document.getElementById('dash-level-cards');
    if (levelCardsContainer) {
      const levelsMeta = DataManager.getAllLevelsMeta();
      levelCardsContainer.innerHTML = levelsMeta.map(meta => {
        const levelWords = DataManager.getWordsByLevel(meta.level);
        const total = levelWords.length;
        const mastered = levelWords.filter(w => progress[w.id] && progress[w.id].leitnerBox >= 3).length;
        const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;
        const days = DataManager.getDaysInLevel(meta.level);

        return `
          <div class="level-curriculum-card level-theme-${meta.level}" onclick="App.selectLevelCurriculum(${meta.level})">
            <div class="level-card-top">
              <div class="level-badge-pill" style="background: ${meta.bgGradient}; color: #fff;">
                <span class="level-emoji">${meta.emoji}</span>
                <strong>Level ${meta.level}</strong>
              </div>
              <span class="level-day-tag">${days.length} Days</span>
            </div>

            <h3 class="level-title">${meta.title}</h3>
            <p class="level-subtitle">${meta.subtitle}</p>

            <div class="level-progress-wrap">
              <div class="level-progress-labels">
                <span>진도율</span>
                <strong>${pct}% (${mastered}/${total}단어)</strong>
              </div>
              <div class="level-progress-bar">
                <div class="level-progress-fill" style="width: ${pct}%; background: ${meta.color};"></div>
              </div>
            </div>

            <!-- Quick Day Chips -->
            <div class="level-day-chips" onclick="event.stopPropagation()">
              ${days.map(d => {
                const dayWords = DataManager.getWordsByDay(meta.level, d);
                const dayMastered = dayWords.filter(w => progress[w.id] && progress[w.id].leitnerBox >= 3).length;
                const isDayComplete = dayWords.length > 0 && dayMastered === dayWords.length;

                return `
                  <button class="day-chip-btn ${isDayComplete ? 'complete' : ''}"
                          onclick="App.startDayStudy(${meta.level}, ${d})"
                          title="Day ${d} 학습 (${dayMastered}/${dayWords.length} 완료)">
                    Day ${d} ${isDayComplete ? '✓' : ''}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ===== Curriculum Screen Rendering =====
  function renderCurriculumScreen(level) {
    const meta = DataManager.getLevelMeta(level);
    const words = DataManager.getWordsByLevel(level);
    const days = DataManager.getDaysInLevel(level);
    const progress = Storage.getProgress();

    const headerContainer = document.getElementById('curriculum-header-area');
    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="curriculum-hero" style="background: ${meta.bgGradient};">
          <div class="hero-top-row">
            <button class="btn-hero-back" onclick="App.goHome()">← 홈</button>
            <span class="hero-level-tag">Level ${meta.level} 커리큘럼</span>
          </div>
          <h2 class="hero-title">${meta.emoji} ${meta.title}</h2>
          <p class="hero-desc">${meta.desc}</p>
          <div class="hero-stats-row">
            <div class="hero-stat"><span>총 단어</span> <strong>${words.length}개</strong></div>
            <div class="hero-stat"><span>학습 일수</span> <strong>${days.length} Days</strong></div>
          </div>
        </div>
      `;
    }

    const daysContainer = document.getElementById('curriculum-days-list');
    if (daysContainer) {
      daysContainer.innerHTML = days.map(d => {
        const dayWords = DataManager.getWordsByDay(level, d);
        const dayMastered = dayWords.filter(w => progress[w.id] && progress[w.id].leitnerBox >= 3).length;
        const pct = dayWords.length > 0 ? Math.round((dayMastered / dayWords.length) * 100) : 0;
        const previewWords = dayWords.slice(0, 5).map(w => w.word).join(', ');

        return `
          <div class="curriculum-day-row">
            <div class="day-num-box">
              <span class="d-label">DAY</span>
              <strong class="d-val">${d}</strong>
            </div>

            <div class="day-info-area">
              <div class="day-title-row">
                <h4>Day ${d} 핵심 단어 (${dayWords.length}단어)</h4>
                <span class="day-pct-tag ${pct === 100 ? 'complete' : ''}">${pct}% 마스터</span>
              </div>
              <p class="day-preview-text">미리보기: ${previewWords}...</p>
              <div class="day-progress-bar">
                <div class="day-progress-fill" style="width: ${pct}%;"></div>
              </div>
            </div>

            <div class="day-actions">
              <button class="btn-day-study" onclick="App.startDayStudy(${level}, ${d})">
                🚀 학습 시작
              </button>
              <button class="btn-day-test" onclick="PrintManager.openPrintModal(DataManager.getWordsByDay(${level}, ${d}), 'Level ${level} · Day ${d} 단어 시험지')" title="단어 시험지 인쇄">
                🖨️ 시험지
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ===== Word List / Dictionary Screen =====
  function renderWordListScreen(words, currentLevel = 'all', currentDay = 'all', currentFilter = 'all') {
    const listContainer = document.getElementById('wordlist-items-container');
    const countEl = document.getElementById('wordlist-total-count');
    if (countEl) countEl.textContent = `${words.length}개 단어`;

    if (!listContainer) return;

    if (words.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state-box">
          <span class="empty-icon">🔍</span>
          <h3>일치하는 단어가 없습니다.</h3>
          <p>검색어나 필터 조건을 변경해보세요.</p>
        </div>
      `;
      return;
    }

    const progress = Storage.getProgress();
    const bookmarks = Storage.getBookmarks();

    listContainer.innerHTML = words.map(w => {
      const p = progress[w.id];
      const isBookmarked = bookmarks.includes(w.id);
      const isMastered = p && p.leitnerBox >= 3;
      const isWrong = p && p.wrongCount > 0;

      return `
        <div class="word-card-item ${isMastered ? 'mastered' : ''}" onclick="UI.showWordDetailModal(${w.id})">
          <div class="word-item-left">
            <div class="word-text-line">
              <strong class="word-eng">${w.word}</strong>
              <span class="word-pos">[${w.pos}]</span>
              <span class="word-ipa">${w.ipa || ''}</span>
            </div>
            <div class="word-meaning-line">${w.meaning}</div>
            ${w.example ? `<div class="word-example-snippet">"${w.example}"</div>` : ''}
          </div>

          <div class="word-item-right" onclick="event.stopPropagation()">
            <span class="level-mini-tag level-${w.level}">Lv.${w.level} · D${w.day || 1}</span>
            <button class="btn-mini-audio" onclick="Sound.speak('${w.word}')" title="발음 듣기">🔊</button>
            <button class="btn-mini-star ${isBookmarked ? 'active' : ''}" onclick="UI.toggleWordBookmark(${w.id}, this)" title="북마크">
              ${isBookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function toggleWordBookmark(wordId, btnEl) {
    const isBookmarked = Storage.toggleBookmark(wordId);
    if (btnEl) {
      btnEl.textContent = isBookmarked ? '★' : '☆';
      btnEl.classList.toggle('active', isBookmarked);
    }
    showToast(isBookmarked ? '북마크에 추가되었습니다.' : '북마크가 해제되었습니다.', 'info');
  }

  // ===== Word Detail Modal =====
  function showWordDetailModal(wordId) {
    const word = DataManager.getWordById(wordId);
    if (!word) return;

    const modal = document.getElementById('word-detail-modal');
    const content = document.getElementById('word-detail-content');
    if (!modal || !content) return;

    const isBookmarked = Storage.isBookmarked(word.id);
    const p = Storage.getWordProgress(word.id);

    content.innerHTML = `
      <div class="modal-detail-header">
        <div class="detail-badge-row">
          <span class="pos-badge pos-${word.pos}">${word.pos.toUpperCase()}</span>
          <span class="level-pill level-${word.level}">Level ${word.level} · Day ${word.day || 1}</span>
          <span class="leitner-stage-tag">숙련도: ${p.leitnerBox || 0}/5단계</span>
        </div>
        <button class="btn-modal-close" onclick="UI.closeWordDetailModal()">✕</button>
      </div>

      <div class="modal-detail-word-display">
        <h2 class="detail-word">${word.word}</h2>
        <div class="detail-ipa">${word.ipa || ''}</div>
        <div class="detail-audio-btns">
          <button class="btn-audio-pill" onclick="Sound.speak('${word.word}')">🔊 원어민 발음</button>
          <button class="btn-audio-pill btn-audio-slow" onclick="Sound.speakSlow('${word.word}')">🐢 느리게 듣기</button>
          <button class="btn-star-pill ${isBookmarked ? 'active' : ''}" onclick="UI.toggleWordBookmark(${word.id}, this)">
            ${isBookmarked ? '★ 북마크됨' : '☆ 북마크 추가'}
          </button>
        </div>
      </div>

      <div class="detail-body-section">
        <div class="detail-info-block">
          <div class="info-label">💡 대표 한국어 뜻</div>
          <div class="info-value meaning-large">${word.meaning}</div>
        </div>

        ${word.collocation ? `
          <div class="detail-info-block">
            <div class="info-label">🔗 빈출 연어 / 짝꿍 표현 (Collocation)</div>
            <div class="info-value">${word.collocation}</div>
          </div>
        ` : ''}

        ${word.etymology ? `
          <div class="detail-info-block">
            <div class="info-label">🌱 어원 & 암기 꿀팁 (Etymology)</div>
            <div class="info-value">${word.etymology}</div>
          </div>
        ` : ''}

        ${word.example ? `
          <div class="detail-info-block">
            <div class="info-label">📖 생생한 예문과 해석</div>
            <div class="example-box">
              <div class="ex-eng">
                "${word.example.replace(new RegExp('(' + word.word + '[a-z]*)', 'gi'), '<strong>$1</strong>')}"
                <button class="btn-mini-audio" onclick="Sound.speak('${word.example.replace(/'/g, "\\'")}')">🔊</button>
              </div>
              <div class="ex-kr">${word.exampleMeaning}</div>
            </div>
          </div>
        ` : ''}

        ${word.synonyms && word.synonyms.length > 0 ? `
          <div class="detail-info-block">
            <div class="info-label">✨ 유의어 (Synonyms)</div>
            <div class="synonym-chips">
              ${word.synonyms.map(s => `<span class="syn-chip">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <div class="modal-detail-footer">
        <button class="btn-modal-study" onclick="UI.closeWordDetailModal(); FlashcardController.startSession([DataManager.getWordById(${word.id})]);">
          🃏 이 단어 플래시카드로 집중 학습
        </button>
      </div>
    `;

    modal.classList.add('active');
  }

  function closeWordDetailModal() {
    const modal = document.getElementById('word-detail-modal');
    if (modal) modal.classList.remove('active');
  }

  // ===== Wrong Answer Notebook Screen =====
  function renderWrongWordsScreen() {
    const allWords = DataManager.getAllWords();
    const wrongMap = Storage.getWrongWordsMap();
    const wrongIds = Object.keys(wrongMap).map(Number);
    const wrongWordList = allWords.filter(w => wrongIds.includes(w.id));

    const countEl = document.getElementById('wrong-words-count');
    if (countEl) countEl.textContent = `${wrongWordList.length}개 오답 단어`;

    const container = document.getElementById('wrong-words-container');
    if (!container) return;

    if (wrongWordList.length === 0) {
      container.innerHTML = `
        <div class="empty-state-box">
          <span class="empty-icon">🎉</span>
          <h3>등록된 오답 단어가 없습니다!</h3>
          <p>틀린 단어가 발생하면 여기에 자동으로 누적됩니다.</p>
          <button class="btn-primary" onclick="App.goToStudy()">✏️ 퀴즈 풀러 가기</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="wrong-top-actions">
        <button class="btn-primary" onclick="App.startQuizWithScope(QuizEngine.getCurrentWords && QuizEngine.getCurrentWords().length > 0 ? QuizEngine.getCurrentWords() : DataManager.getAllWords().filter(w => Storage.getWrongWordsMap()[w.id]))">
          🎯 오답 단어로 퀴즈 풀기
        </button>
        <button class="btn-secondary" onclick="PrintManager.openPrintModal(DataManager.getAllWords().filter(w => Storage.getWrongWordsMap()[w.id]), '📝 맞춤형 오답노트 단어 시험지')">
          🖨️ 오답 시험지 인쇄
        </button>
        <button class="btn-outline-danger" onclick="App.clearAllWrongAnswers()">
          🗑️ 오답노트 전체 비우기
        </button>
      </div>

      <div class="word-items-list">
        ${wrongWordList.map(w => {
          const wrongData = wrongMap[w.id];
          return `
            <div class="word-card-item wrong-card" onclick="UI.showWordDetailModal(${w.id})">
              <div class="word-item-left">
                <div class="word-text-line">
                  <strong class="word-eng">${w.word}</strong>
                  <span class="word-pos">[${w.pos}]</span>
                  <span class="wrong-count-badge">⚠️ ${wrongData?.count || 1}회 오답</span>
                </div>
                <div class="word-meaning-line">${w.meaning}</div>
                ${w.example ? `<div class="word-example-snippet">"${w.example}"</div>` : ''}
              </div>

              <div class="word-item-right" onclick="event.stopPropagation()">
                <button class="btn-mini-audio" onclick="Sound.speak('${w.word}')">🔊</button>
                <button class="btn-delete-wrong" onclick="Storage.removeWrongWord(${w.id}); UI.renderWrongWordsScreen(); UI.showToast('오답노트에서 제거되었습니다.', 'info');" title="오답노트에서 삭제">
                  ✕
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ===== Statistics & Badges Screen =====
  function renderStatsScreen() {
    const allWords = DataManager.getAllWords();
    const progress = Storage.getProgress();
    const streak = Storage.getStreakData();
    const xpData = Storage.getXPData();
    const unlockedBadges = Storage.getUnlockedBadges();

    // Summary stats
    const masteredCount = Object.values(progress).filter(p => p.leitnerBox >= 3).length;
    const learningCount = Object.values(progress).filter(p => p.correctCount > 0 && p.leitnerBox < 3).length;
    const unlearnedCount = allWords.length - masteredCount - learningCount;

    // Badges grid
    const badgesContainer = document.getElementById('stats-badges-grid');
    if (badgesContainer) {
      badgesContainer.innerHTML = Storage.BADGE_DEFINITIONS.map(b => {
        const isUnlocked = unlockedBadges.includes(b.id);
        return `
          <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon-wrap">${b.icon}</div>
            <h4 class="badge-title">${b.name}</h4>
            <p class="badge-desc">${b.desc}</p>
            <span class="badge-status-pill">${isUnlocked ? '✓ 획득 완료' : '🔒 미달성'}</span>
          </div>
        `;
      }).join('');
    }

    // Level breakdown
    const levelStatsContainer = document.getElementById('stats-level-breakdown');
    if (levelStatsContainer) {
      const levelsMeta = DataManager.getAllLevelsMeta();
      levelStatsContainer.innerHTML = levelsMeta.map(m => {
        const words = DataManager.getWordsByLevel(m.level);
        const mastered = words.filter(w => progress[w.id] && progress[w.id].leitnerBox >= 3).length;
        const learning = words.filter(w => progress[w.id] && progress[w.id].correctCount > 0 && progress[w.id].leitnerBox < 3).length;
        const pct = words.length > 0 ? Math.round((mastered / words.length) * 100) : 0;

        return `
          <div class="level-stat-row">
            <div class="stat-row-top">
              <span class="stat-level-title">${m.emoji} ${m.title}</span>
              <strong>${pct}% (${mastered}/${words.length}단어)</strong>
            </div>
            <div class="stat-progress-bar">
              <div class="stat-fill-mastered" style="width: ${pct}%; background: ${m.color};"></div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // ===== Confetti Celebration Effect =====
  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444'];

    for (let i = 0; i < 90; i++) {
      pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height,
        w: Math.random() * 10 + 6,
        h: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 3,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 8
      });
    }

    let animationFrame = null;
    let frames = 0;

    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      frames++;
      if (frames < 140) {
        animationFrame = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    render();
  }

  return {
    showScreen,
    getActiveScreen,
    initTheme,
    toggleTheme,
    showToast,
    renderDashboard,
    renderCurriculumScreen,
    renderWordListScreen,
    renderWrongWordsScreen,
    renderStatsScreen,
    showWordDetailModal,
    closeWordDetailModal,
    toggleWordBookmark,
    launchConfetti
  };
})();
