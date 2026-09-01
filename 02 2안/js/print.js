/**
 * Printable Vocabulary Worksheet & Test Generator (English Master Pro 2.0)
 * Generates beautiful, clean A4 printable test sheets with answer keys and pocket vocab lists.
 */

const PrintManager = (() => {
  let selectedWords = [];
  let testType = 'word_to_meaning'; // 'word_to_meaning', 'meaning_to_word', 'mixed', 'answer_key', 'pocket'
  let testTitle = '일일 영단어 테스트';

  function openPrintModal(words, defaultTitle = '영단어 테스트') {
    selectedWords = words && words.length > 0 ? words : DataManager.getWordsByLevel(1);
    testTitle = defaultTitle;

    const modal = document.getElementById('print-setup-modal');
    if (!modal) return;

    // Fill options
    renderPrintConfigUI();
    modal.classList.add('active');
  }

  function closePrintModal() {
    const modal = document.getElementById('print-setup-modal');
    if (modal) modal.classList.remove('active');
  }

  function renderPrintConfigUI() {
    const configContainer = document.getElementById('print-config-area');
    if (!configContainer) return;

    configContainer.innerHTML = `
      <div class="print-config-form">
        <div class="form-group">
          <label>시험지 제목</label>
          <input type="text" id="print-title-input" class="form-input" value="${testTitle}">
        </div>

        <div class="form-group">
          <label>시험지 유형 선택</label>
          <div class="print-type-grid">
            <button class="print-type-btn active" data-type="word_to_meaning" onclick="PrintManager.selectTestType('word_to_meaning', this)">
              <span class="type-icon">📝</span>
              <strong>[A형] 영단어 → 뜻 쓰기</strong>
              <small>영어 제시, 한국어 뜻 쓰기</small>
            </button>
            <button class="print-type-btn" data-type="meaning_to_word" onclick="PrintManager.selectTestType('meaning_to_word', this)">
              <span class="type-icon">✍️</span>
              <strong>[B형] 뜻 → 영단어 쓰기</strong>
              <small>한국어 뜻 제시, 영단어 스펠링 쓰기</small>
            </button>
            <button class="print-type-btn" data-type="mixed" onclick="PrintManager.selectTestType('mixed', this)">
              <span class="type-icon">🔀</span>
              <strong>[C형] 50:50 혼합 시험</strong>
              <small>단어와 뜻 문제가 무작위로 교차</small>
            </button>
            <button class="print-type-btn" data-type="pocket" onclick="PrintManager.selectTestType('pocket', this)">
              <span class="type-icon">📖</span>
              <strong>[D형] 포켓 휴대용 단어장</strong>
              <small>발음기호 + 예문이 포함된 2열 단어장</small>
            </button>
            <button class="print-type-btn" data-type="answer_key" onclick="PrintManager.selectTestType('answer_key', this)">
              <span class="type-icon">🔑</span>
              <strong>[E형] 정답 및 해설지</strong>
              <small>선생님 및 채점용 정답지</small>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>문항 수 선택 (총 ${selectedWords.length}단어 대상)</label>
          <div class="print-count-chips">
            <button class="chip-btn ${selectedWords.length <= 10 ? 'active' : ''}" onclick="PrintManager.setWordCount(10, this)">10문제</button>
            <button class="chip-btn ${selectedWords.length > 10 && selectedWords.length <= 20 ? 'active' : ''}" onclick="PrintManager.setWordCount(20, this)">20문제</button>
            <button class="chip-btn" onclick="PrintManager.setWordCount(30, this)">30문제</button>
            <button class="chip-btn ${selectedWords.length > 30 ? 'active' : ''}" onclick="PrintManager.setWordCount(selectedWords.length, this)">전체 (${selectedWords.length}문제)</button>
          </div>
        </div>
      </div>
    `;
  }

  function selectTestType(type, btnEl) {
    testType = type;
    document.querySelectorAll('.print-type-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
  }

  function setWordCount(count, btnEl) {
    document.querySelectorAll('.print-count-chips .chip-btn').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
    selectedWords = selectedWords.slice(0, count);
  }

  function generateAndPrint() {
    const titleInput = document.getElementById('print-title-input');
    if (titleInput && titleInput.value.trim()) {
      testTitle = titleInput.value.trim();
    }

    const printContainer = document.getElementById('print-sheet-area');
    if (!printContainer) return;

    let itemsHtml = '';
    const dateStr = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

    if (testType === 'pocket') {
      // 2-Column Pocket Vocabulary Sheet
      itemsHtml = `
        <div class="print-pocket-grid">
          ${selectedWords.map((w, idx) => `
            <div class="pocket-word-row">
              <div class="p-num">${idx + 1}</div>
              <div class="p-main">
                <div class="p-word-ipa">
                  <strong>${w.word}</strong> <span class="p-ipa">${w.ipa || ''}</span>
                  <span class="p-pos">[${w.pos}]</span>
                </div>
                <div class="p-meaning">${w.meaning}</div>
                ${w.example ? `<div class="p-example">"${w.example}" (${w.exampleMeaning})</div>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else if (testType === 'answer_key') {
      // Answer Key & Explanations
      itemsHtml = `
        <div class="print-answer-table">
          <table class="answer-table">
            <thead>
              <tr>
                <th>번호</th>
                <th>영단어</th>
                <th>품사</th>
                <th>한국어 뜻</th>
                <th>어원 / 연어 표현</th>
              </tr>
            </thead>
            <tbody>
              ${selectedWords.map((w, idx) => `
                <tr>
                  <td class="td-num">${idx + 1}</td>
                  <td class="td-word"><strong>${w.word}</strong> ${w.ipa || ''}</td>
                  <td class="td-pos">${w.pos}</td>
                  <td class="td-meaning">${w.meaning}</td>
                  <td class="td-extra">${w.collocation || w.etymology || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
    } else {
      // Standard A4 2-Column Test Worksheet
      itemsHtml = `
        <div class="print-test-columns">
          ${selectedWords.map((w, idx) => {
            let prompt = '';
            let blank = '';

            if (testType === 'word_to_meaning') {
              prompt = `<strong>${w.word}</strong> <span class="p-pos">[${w.pos}]</span>`;
              blank = `<span class="answer-line"></span>`;
            } else if (testType === 'meaning_to_word') {
              prompt = `${w.meaning} <span class="p-pos">[${w.pos}]</span>`;
              blank = `<span class="answer-line"></span>`;
            } else {
              // Mixed 50/50
              if (idx % 2 === 0) {
                prompt = `<strong>${w.word}</strong> <span class="p-pos">[${w.pos}]</span>`;
                blank = `<span class="answer-line"></span>`;
              } else {
                prompt = `${w.meaning} <span class="p-pos">[${w.pos}]</span>`;
                blank = `<span class="answer-line"></span>`;
              }
            }

            return `
              <div class="print-question-item">
                <span class="q-number">${idx + 1}.</span>
                <span class="q-prompt">${prompt}</span>
                <span class="q-answer-blank">${blank}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    printContainer.innerHTML = `
      <div class="print-page-a4">
        <div class="print-header">
          <div class="print-title-area">
            <h1 class="print-main-title">${testTitle}</h1>
            <div class="print-meta-sub">English Master Pro 2.0 — 체계적 영단어 학습 시스템</div>
          </div>
          <div class="print-score-box">
            <div class="score-field"><span>이름:</span> ________________</div>
            <div class="score-field"><span>일자:</span> ${dateStr}</div>
            <div class="score-field"><span>점수:</span> ________ / ${selectedWords.length}점</div>
          </div>
        </div>

        <div class="print-body-content">
          ${itemsHtml}
        </div>

        <div class="print-footer">
          <span>📚 English Master Pro 2.0 | 총 ${selectedWords.length}문항</span>
          <span>꾸준한 어휘 학습이 실력을 만듭니다.</span>
        </div>
      </div>
    `;

    closePrintModal();

    // Trigger Print
    setTimeout(() => {
      window.print();
    }, 200);
  }

  return {
    openPrintModal,
    closePrintModal,
    selectTestType,
    setWordCount,
    generateAndPrint
  };
})();
