/**
 * A4 Printable Grammar Worksheet & Answer Key Generator (Grammar Master Pro)
 * Formats tests for clean A4 printing via window.print()
 */

const PrintManager = (() => {
  let printConfig = {
    scope: 'chapter', // 'chapter' | 'level' | 'wrong'
    targetId: null,
    includeMCQ: true,
    includeError: true,
    includeUnscramble: true,
    includeCloze: true,
    includeAnswerKey: true
  };

  function openPrintModalForChapter(chapterId) {
    printConfig.scope = 'chapter';
    printConfig.targetId = chapterId;
    renderModal();
    const modal = document.getElementById('print-modal');
    if (modal) modal.classList.add('active');
  }

  function openPrintModalForLevel(levelNum) {
    printConfig.scope = 'level';
    printConfig.targetId = levelNum;
    renderModal();
    const modal = document.getElementById('print-modal');
    if (modal) modal.classList.add('active');
  }

  function openPrintModalForWrong() {
    printConfig.scope = 'wrong';
    printConfig.targetId = null;
    renderModal();
    const modal = document.getElementById('print-modal');
    if (modal) modal.classList.add('active');
  }

  function closePrintModal() {
    const modal = document.getElementById('print-modal');
    if (modal) modal.classList.remove('active');
  }

  function renderModal() {
    const container = document.getElementById('print-config-area');
    if (!container) return;

    let targetTitle = "";
    if (printConfig.scope === 'chapter') {
      const ch = GrammarData.getChapterById(printConfig.targetId);
      targetTitle = ch ? `${ch.icon} Chapter ${ch.chapterNum}. ${ch.title}` : '선택된 챕터';
    } else if (printConfig.scope === 'level') {
      const meta = GrammarData.LEVEL_META.find(m => m.level === parseInt(printConfig.targetId, 10));
      targetTitle = meta ? meta.title : `Level ${printConfig.targetId}`;
    } else {
      targetTitle = "📝 오답노트 취약 문법 문항 전체";
    }

    container.innerHTML = `
      <div class="print-config-group">
        <label class="print-label">인쇄 대상</label>
        <div class="print-target-badge">${targetTitle}</div>
      </div>

      <div class="print-config-group">
        <label class="print-label">포함할 문제 유형</label>
        <div class="print-checkboxes-grid">
          <label><input type="checkbox" id="p-opt-mcq" checked> 🎯 4지선다 어법</label>
          <label><input type="checkbox" id="p-opt-error" checked> 🔍 오류 수정</label>
          <label><input type="checkbox" id="p-opt-unscramble" checked> 🧩 조각 영작 배열</label>
          <label><input type="checkbox" id="p-opt-cloze" checked> ✍️ 어형 변형</label>
        </div>
      </div>

      <div class="print-config-group">
        <label class="print-label">정답 및 해설지</label>
        <div class="print-checkboxes-grid">
          <label><input type="checkbox" id="p-opt-answers" checked> 📑 별도 정답 & 상세 해설지 포함</label>
        </div>
      </div>
    `;
  }

  function generateAndPrint() {
    // Read checkbox values
    const incMCQ = document.getElementById('p-opt-mcq')?.checked ?? true;
    const incError = document.getElementById('p-opt-error')?.checked ?? true;
    const incUnscramble = document.getElementById('p-opt-unscramble')?.checked ?? true;
    const incCloze = document.getElementById('p-opt-cloze')?.checked ?? true;
    const incAnswers = document.getElementById('p-opt-answers')?.checked ?? true;

    let chaptersToPrint = [];
    if (printConfig.scope === 'chapter') {
      const ch = GrammarData.getChapterById(printConfig.targetId);
      if (ch) chaptersToPrint.push(ch);
    } else if (printConfig.scope === 'level') {
      chaptersToPrint = GrammarData.getChaptersByLevel(printConfig.targetId);
    } else if (printConfig.scope === 'wrong') {
      const wrongExercises = Object.values(Storage.getWrongExercises());
      if (wrongExercises.length === 0) {
        UI.showToast("인쇄할 오답 문항이 없습니다.", "info");
        return;
      }
      generateWrongPrintSheet(wrongExercises, incAnswers);
      closePrintModal();
      window.print();
      return;
    }

    if (chaptersToPrint.length === 0) {
      UI.showToast("인쇄할 문법 단원이 없습니다.", "error");
      return;
    }

    const printArea = document.getElementById('print-sheet-area');
    if (!printArea) return;

    let questionsList = [];
    chaptersToPrint.forEach(ch => {
      if (ch.exercises) {
        if (incMCQ && ch.exercises.mcq) {
          ch.exercises.mcq.forEach(q => questionsList.push({ type: 'mcq', chapter: ch, data: q }));
        }
        if (incError && ch.exercises.errorCorrection) {
          ch.exercises.errorCorrection.forEach(q => questionsList.push({ type: 'error', chapter: ch, data: q }));
        }
        if (incUnscramble && ch.exercises.unscramble) {
          ch.exercises.unscramble.forEach(q => questionsList.push({ type: 'unscramble', chapter: ch, data: q }));
        }
        if (incCloze && ch.exercises.formCloze) {
          ch.exercises.formCloze.forEach(q => questionsList.push({ type: 'cloze', chapter: ch, data: q }));
        }
      }
    });

    let mainTitle = printConfig.scope === 'chapter'
      ? `[Grammar Test] Chapter ${chaptersToPrint[0].chapterNum}. ${chaptersToPrint[0].title}`
      : `[Grammar Test] Level ${printConfig.targetId} 실전 종합 평가`;

    let html = `
      <div class="print-page-a4">
        <!-- Header -->
        <div class="print-header">
          <div>
            <h1 class="print-main-title">${mainTitle}</h1>
            <div class="print-meta-sub">영문법 마스터 PRO 2.0 · 표준 A4 실전 시험지</div>
          </div>
          <div class="print-score-box">
            <div><strong>이름:</strong> ______________</div>
            <div><strong>일자:</strong> 2026. __. __.</div>
            <div><strong>점수:</strong> _____ / 100 점</div>
          </div>
        </div>

        <!-- 2-Column Questions List -->
        <div class="print-test-columns">
          ${questionsList.map((item, idx) => `
            <div class="print-question-item">
              <span class="q-number">${idx + 1}.</span>
              <div class="q-body">
                ${renderPrintQuestionBody(item)}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="print-footer">
          <span>📚 영단어 마스터 PRO 2.0 (Grammar Edition)</span>
          <span>Page 1 / ${incAnswers ? '2' : '1'}</span>
        </div>
      </div>
    `;

    // Add Answer Key Page if enabled
    if (incAnswers) {
      html += `
        <div class="print-page-a4" style="page-break-before: always;">
          <div class="print-header">
            <div>
              <h1 class="print-main-title">📑 [정답 및 상세 해설] ${mainTitle}</h1>
              <div class="print-meta-sub">정답 및 문법 규칙 분석표</div>
            </div>
          </div>

          <table class="answer-table">
            <thead>
              <tr>
                <th style="width: 40px;">번호</th>
                <th style="width: 120px;">유형</th>
                <th style="width: 180px;">정답</th>
                <th>문법 규칙 및 해설</th>
              </tr>
            </thead>
            <tbody>
              ${questionsList.map((item, idx) => `
                <tr>
                  <td style="text-align:center; font-weight:bold;">${idx + 1}</td>
                  <td>${getQuestionTypeLabel(item.type)}</td>
                  <td style="font-weight:bold; color:#000;">${getPrintAnswerString(item)}</td>
                  <td style="font-size:8.5pt;">${item.data.explanation || '핵심 문법 규칙 적용'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="print-footer">
            <span>📚 영단어 마스터 PRO 2.0</span>
            <span>정답 및 해설지</span>
          </div>
        </div>
      `;
    }

    printArea.innerHTML = html;
    closePrintModal();
    window.print();
  }

  function renderPrintQuestionBody(item) {
    if (item.type === 'mcq') {
      const q = item.data;
      return `
        <div class="p-prompt">${q.question.replace(/\n/g, '<br>')}</div>
        <div class="p-options-grid">
          ${q.options.map((opt, i) => `<span>①②③④⑤`[i] + ` ${opt}</span>`).join('<br>')}
        </div>
      `;
    } else if (item.type === 'error') {
      const q = item.data;
      const underlined = q.originalSentence.replace(q.underlineTarget, `<u>${q.underlineTarget}</u>`);
      return `
        <div class="p-prompt">다음 문장의 밑줄 친 부분을 어법상 바르게 고쳐 쓰시오.</div>
        <div class="p-quote">"${underlined}"</div>
        <div class="p-answer-line">정답: ____________________</div>
      `;
    } else if (item.type === 'unscramble') {
      const q = item.data;
      return `
        <div class="p-prompt">[조건 영작] 다음 주어진 단어를 올바른 어순으로 배열하시오.</div>
        <div class="p-quote">우리말: "${q.promptKr}"</div>
        <div class="p-words-pool">보기: [ ${q.words.join(' / ')} ]</div>
        <div class="p-answer-line">정답: __________________________________________________</div>
      `;
    } else if (item.type === 'cloze') {
      const q = item.data;
      return `
        <div class="p-prompt">다음 괄호 안의 단어를 문맥에 맞는 알맞은 어형으로 변형하여 빈칸을 채우시오.</div>
        <div class="p-quote">"${q.sentence}"</div>
        <div class="p-answer-line">정답: ____________________</div>
      `;
    }
    return '';
  }

  function getQuestionTypeLabel(type) {
    switch (type) {
      case 'mcq': return '4지선다 어법';
      case 'error': return '오류 수정';
      case 'unscramble': return '문장 배열';
      case 'cloze': return '어형 변형';
      default: return '문법';
    }
  }

  function getPrintAnswerString(item) {
    if (item.type === 'mcq') {
      const q = item.data;
      return `[${q.answerIndex + 1}번] ${q.options[q.answerIndex]}`;
    } else if (item.type === 'error') {
      return item.data.correctedWord;
    } else if (item.type === 'unscramble') {
      return item.data.answer;
    } else if (item.type === 'cloze') {
      return item.data.answer;
    }
    return '';
  }

  function generateWrongPrintSheet(wrongList, incAnswers) {
    const printArea = document.getElementById('print-sheet-area');
    if (!printArea) return;

    let html = `
      <div class="print-page-a4">
        <div class="print-header">
          <div>
            <h1 class="print-main-title">📝 [스마트 오답노트] 취약 문법 집중 클리닉 시험지</h1>
            <div class="print-meta-sub">내가 틀린 문법 문항 맞춤 재시험지</div>
          </div>
          <div class="print-score-box">
            <div><strong>이름:</strong> ______________</div>
            <div><strong>일자:</strong> 2026. __. __.</div>
            <div><strong>점수:</strong> _____ / 100 점</div>
          </div>
        </div>

        <div class="print-test-columns">
          ${wrongList.map((item, idx) => `
            <div class="print-question-item">
              <span class="q-number">${idx + 1}.</span>
              <div class="q-body">
                <div class="p-prompt">${item.exercise.question || item.exercise.sentence || item.exercise.promptKr}</div>
                <div class="p-answer-line">정답: ____________________</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="print-footer">
          <span>📚 영단어 마스터 PRO 2.0</span>
          <span>오답노트 클리닉</span>
        </div>
      </div>
    `;

    printArea.innerHTML = html;
  }

  return {
    openPrintModalForChapter,
    openPrintModalForLevel,
    openPrintModalForWrong,
    closePrintModal,
    generateAndPrint
  };
})();
