/**
 * UI Renderer, Screen Router, and Modal Controller (Grammar Master Pro)
 */

const UI = (() => {
  let activeScreen = 'dashboard-screen';

  function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      activeScreen = screenId;
    }

    // Update bottom nav
    const navMap = {
      'dashboard-screen': 'nav-home',
      'curriculum-screen': 'nav-curriculum',
      'search-screen': 'nav-search',
      'wrong-screen': 'nav-wrong',
      'stats-screen': 'nav-stats'
    };

    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(n => n.classList.remove('active'));

    const activeNavId = navMap[screenId];
    if (activeNavId) {
      const activeNav = document.getElementById(activeNavId);
      if (activeNav) activeNav.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function renderDashboard() {
    const overall = GrammarData.getOverallProgress();
    const stats = Storage.getStats();

    // Update XP and Streak
    const xpTitle = getXPTitle(stats.xp || 0);
    const xpLvl = Math.floor((stats.xp || 0) / 100) + 1;

    const elXpLvl = document.getElementById('dash-xp-level');
    const elXpTitle = document.getElementById('dash-xp-title');
    const elTotalCh = document.getElementById('dash-total-chapters');
    const elMasteredCh = document.getElementById('dash-mastered-chapters');
    const elStreakDays = document.getElementById('dash-streak-days');
    const elGoalText = document.getElementById('dash-goal-text');
    const elGoalProgress = document.getElementById('dash-goal-progress');

    if (elXpLvl) elXpLvl.textContent = `Lv.${xpLvl}`;
    if (elXpTitle) elXpTitle.textContent = xpTitle;
    if (elTotalCh) elTotalCh.textContent = `${overall.totalChapters}단원`;
    if (elMasteredCh) elMasteredCh.textContent = `${overall.completedChapters}단원 (${overall.percent}%)`;
    if (elStreakDays) elStreakDays.textContent = `${stats.streakDays || 1}일`;

    const goalTotal = stats.dailyGoal || 5;
    const goalDone = stats.dailyCompletedCount || 0;
    const goalPercent = Math.min(Math.round((goalDone / goalTotal) * 100), 100);

    if (elGoalText) elGoalText.textContent = `${goalDone} / ${goalTotal} 학습 완료 (${goalPercent}%)`;
    if (elGoalProgress) elGoalProgress.style.width = `${goalPercent}%`;

    // Render 4 Level Cards
    const levelCardsContainer = document.getElementById('dash-level-cards');
    if (levelCardsContainer) {
      levelCardsContainer.innerHTML = GrammarData.LEVEL_META.map(lvl => {
        const lvlStats = GrammarData.getLevelStats(lvl.level);
        return `
          <div class="level-card" onclick="App.selectLevelCurriculum(${lvl.level})" style="border-left: 5px solid ${lvl.color};">
            <div class="level-card-top">
              <span class="level-card-emoji">${lvl.emoji}</span>
              <div class="level-card-info">
                <h4>${lvl.title}</h4>
                <p class="level-card-sub">${lvl.subtitle}</p>
              </div>
              <span class="level-card-progress-badge">${lvlStats.completed}/${lvlStats.total}</span>
            </div>
            <p class="level-card-desc">${lvl.desc}</p>
            <div class="level-card-bar">
              <div class="level-card-bar-fill" style="width: ${lvlStats.percent}%; background: ${lvl.bgGradient};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Wrong items alert
    const wrongExercises = Storage.getWrongExercises();
    const wrongCount = Object.keys(wrongExercises).length;
    const wrongBanner = document.getElementById('dash-wrong-banner');
    if (wrongBanner) {
      if (wrongCount > 0) {
        wrongBanner.style.display = 'flex';
        wrongBanner.innerHTML = `
          <div class="alert-icon">📝</div>
          <div class="alert-content">
            <strong>오답노트에 취약 문법 ${wrongCount}문항이 있습니다!</strong>
            <span>틀린 문제를 다시 풀고 문법 개념을 확실히 다져보세요.</span>
          </div>
          <button class="btn-sm btn-primary" onclick="App.goToWrongScreen()">오답 정복 →</button>
        `;
      } else {
        wrongBanner.style.display = 'none';
      }
    }
  }

  function renderCurriculum(levelNum = 1) {
    const lvl = parseInt(levelNum, 10);
    const meta = GrammarData.LEVEL_META.find(m => m.level === lvl);
    const chapters = GrammarData.getChaptersByLevel(lvl);
    const progress = Storage.getChapterProgress();

    const headerArea = document.getElementById('curriculum-header-area');
    if (headerArea && meta) {
      const lvlStats = GrammarData.getLevelStats(lvl);
      headerArea.innerHTML = `
        <div class="curriculum-banner" style="background: ${meta.bgGradient};">
          <div class="curriculum-banner-top">
            <span class="banner-emoji">${meta.emoji}</span>
            <div>
              <h2>${meta.title}</h2>
              <p>${meta.subtitle}</p>
            </div>
          </div>
          <div class="curriculum-banner-progress">
            <span>진도율: ${lvlStats.completed} / ${lvlStats.total} 챕터 완료 (${lvlStats.percent}%)</span>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width: ${lvlStats.percent}%;"></div>
            </div>
          </div>
        </div>

        <div class="level-tabs-row">
          ${GrammarData.LEVEL_META.map(m => `
            <button class="level-tab-btn ${m.level === lvl ? 'active' : ''}" onclick="App.selectLevelCurriculum(${m.level})">
              ${m.emoji} ${m.code}
            </button>
          `).join('')}
        </div>
      `;
    }

    const listArea = document.getElementById('curriculum-chapters-list');
    if (listArea) {
      listArea.innerHTML = chapters.map(ch => {
        const isDone = progress[ch.id] && progress[ch.id].completed;
        const lastScore = progress[ch.id] ? progress[ch.id].accuracy : null;
        const isBookmarked = Storage.isBookmarked(ch.id);

        return `
          <div class="chapter-card ${isDone ? 'completed' : ''}">
            <div class="chapter-card-header">
              <div class="chapter-badge-num">Ch.${ch.chapterNum}</div>
              <div class="chapter-title-group">
                <h3>${ch.icon} ${ch.title}</h3>
                <div class="chapter-sub">${ch.subtitle}</div>
              </div>
              <button class="btn-bookmark-icon ${isBookmarked ? 'active' : ''}" onclick="event.stopPropagation(); App.toggleBookmark('${ch.id}', this)" title="북마크">
                ${isBookmarked ? '⭐' : '☆'}
              </button>
            </div>

            <p class="chapter-summary-text">${ch.summary}</p>

            <div class="chapter-card-footer">
              <div class="chapter-score-pill">
                ${isDone ? `✅ 숙달 (${lastScore}% 정답률)` : '⏳ 미학습'}
              </div>
              <div class="chapter-actions">
                <button class="btn-sm btn-secondary" onclick="LessonViewer.renderLesson('${ch.id}')">
                  📖 개념 강의
                </button>
                <button class="btn-sm btn-primary" onclick="App.startChapterTraining('${ch.id}')">
                  🚀 실전 훈련
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  function renderWrongScreen() {
    const wrongMap = Storage.getWrongExercises();
    const wrongList = Object.entries(wrongMap).map(([id, data]) => ({ id, ...data }));
    const countEl = document.getElementById('wrong-screen-count');
    if (countEl) countEl.textContent = `${wrongList.length}개 취약 문항`;

    const container = document.getElementById('wrong-screen-container');
    if (!container) return;

    if (wrongList.length === 0) {
      container.innerHTML = `
        <div class="empty-state-card">
          <div class="empty-emoji">🎉</div>
          <h3>오답노트가 깨끗합니다!</h3>
          <p>틀린 문제가 없습니다. 실전 훈련에서 새로운 문법 단원에 도전해보세요.</p>
          <button class="btn-primary" onclick="App.selectLevelCurriculum(1)">커리큘럼 보러가기 →</button>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="wrong-top-actions">
        <button class="btn-primary" onclick="App.launchWrongReviewTraining()">
          ⚡ 오답 맞춤 재시험 풀기 (${wrongList.length}문항)
        </button>
        <button class="btn-secondary" onclick="PrintManager.openPrintModalForWrong()">
          🖨️ 오답 시험지 인쇄
        </button>
      </div>

      <div class="wrong-items-list">
        ${wrongList.map(item => {
          const ch = GrammarData.getChapterById(item.chapterId);
          const q = item.exercise;
          return `
            <div class="wrong-exercise-card">
              <div class="wrong-card-header">
                <span class="badge-chapter">${ch ? ch.title : '문법'}</span>
                <span class="wrong-count-badge">누적 ${item.wrongCount}회 오답</span>
                <button class="btn-icon-subtle" onclick="App.removeWrongExercise('${item.id}')" title="오답노트에서 삭제">✕</button>
              </div>

              <div class="wrong-card-body">
                <p class="wrong-q-text"><strong>문제:</strong> ${q.question || q.originalSentence || q.sentence || q.promptKr}</p>
                <p class="wrong-user-ans"><strong>내가 쓴 답:</strong> <span class="text-danger">${item.userAnswer || '미입력'}</span></p>
                <p class="wrong-correct-ans"><strong>정답:</strong> <span class="text-success">${q.options ? q.options[q.answerIndex] : (q.correctedWord || q.answer)}</span></p>
                <p class="wrong-explanation"><strong>해설:</strong> ${q.explanation || '핵심 문법 규칙을 복습하세요.'}</p>
              </div>

              <div class="wrong-card-footer">
                <button class="btn-sm btn-outline" onclick="LessonViewer.renderLesson('${item.chapterId}')">
                  📖 관련 개념 다시 보기
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function renderStatsScreen() {
    const stats = Storage.getStats();
    const overall = GrammarData.getOverallProgress();

    // Render level breakdown
    const breakdownContainer = document.getElementById('stats-level-breakdown');
    if (breakdownContainer) {
      breakdownContainer.innerHTML = GrammarData.LEVEL_META.map(lvl => {
        const s = GrammarData.getLevelStats(lvl.level);
        return `
          <div class="stats-level-row">
            <div class="stats-lvl-info">
              <span>${lvl.emoji} <strong>${lvl.code}</strong> (${lvl.title})</span>
              <span>${s.completed}/${s.total} 완료 (${s.percent}%)</span>
            </div>
            <div class="progress-bar-wrap">
              <div class="progress-bar-fill" style="width: ${s.percent}%; background: ${lvl.bgGradient};"></div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Render Badges
    const badgesGrid = document.getElementById('stats-badges-grid');
    if (badgesGrid) {
      const unlocked = stats.unlockedBadges || [];
      badgesGrid.innerHTML = Storage.BADGES.map(b => {
        const isUnlocked = unlocked.includes(b.id);
        return `
          <div class="badge-item ${isUnlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon">${b.icon}</div>
            <div class="badge-title">${b.title}</div>
            <div class="badge-desc">${b.desc}</div>
            <div class="badge-status">${isUnlocked ? '✅ 획득 완료' : `🔒 ${b.reqXP} XP 필요`}</div>
          </div>
        `;
      }).join('');
    }
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);

    const icon = document.querySelector('.theme-toggle-icon');
    if (icon) icon.textContent = next === 'dark' ? '☀️' : '🌙';

    const settings = Storage.getSettings();
    settings.theme = next;
    Storage.saveSettings(settings);
  }

  function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-pill ${type}`;
    toast.textContent = msg;

    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 2800);
  }

  function launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 20,
      size: 6 + Math.random() * 6,
      color: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][Math.floor(Math.random() * 5)],
      speedY: 3 + Math.random() * 4,
      speedX: -2 + Math.random() * 4,
      rotation: Math.random() * 360,
      rotSpeed: -5 + Math.random() * 10
    }));

    let frames = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frames++;
      if (frames < 100) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animate);
  }

  function getXPTitle(xp) {
    if (xp >= 2000) return '영문법 그랜드 마스터';
    if (xp >= 1200) return '수능 1등급 킬러 정복자';
    if (xp >= 750) return '고등 문법 마스터';
    if (xp >= 450) return '중학 심화 우등생';
    if (xp >= 200) return '기본 문법 마스터';
    if (xp >= 50) return '열정적인 학습자';
    return '문법 초심자';
  }

  function getActiveScreen() {
    return activeScreen;
  }

  return {
    showScreen,
    getActiveScreen,
    renderDashboard,
    renderCurriculum,
    renderWrongScreen,
    renderStatsScreen,
    toggleTheme,
    showToast,
    launchConfetti
  };
})();
