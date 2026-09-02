const GRAMMAR_A1 = [
  {
    "id": "a1_ch1",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 1,
    "title": "영어의 8품사와 문장의 시작",
    "subtitle": "모든 영어 단어의 역할과 문장의 기본 재료",
    "icon": "🌱",
    "summary": "영어의 모든 단어는 문장 속 역할에 따라 8가지 품사(명사, 대명사, 동사, 형용사, 부사, 전치사, 접속사, 감탄사)로 나뉩니다. 품사를 바르게 알면 단어가 문장의 어느 자리에 들어가야 하는지 바로 알 수 있습니다.",
    "storyMetaphor": "🎭 8품사는 연극 무대에 오르는 8명의 배우와 같습니다. 주인공(명사), 행동대장(동사), 꾸며주는 조연(형용사/부사)이 모여 한 편의 문장이 완성됩니다!",
    "coreExplanation": `
<h3>💡 8품사를 왜 가장 먼저 배워야 할까요?</h3>
<p>영어 공부를 시작할 때 가장 먼저 넘어야 할 산이 바로 '품사(Parts of Speech)'입니다. 단어 하나하나가 문장 속에서 <strong>어떤 역할(신분)</strong>을 하는지 알아야 단어를 올바른 순서로 배열할 수 있습니다.</p>

<div class="concept-breakdown-card">
  <h4>🔍 8품사 핵심 요약표</h4>
  <ul>
    <li><strong>1. 명사 (Noun):</strong> 사람, 사물, 장소, 생각의 '이름' (apple, student, Seoul, happiness)</li>
    <li><strong>2. 대명사 (Pronoun):</strong> 명사를 대신 부르는 말 (I, you, he, she, it, they, this)</li>
    <li><strong>3. 동사 (Verb):</strong> 주인공의 동작이나 상태 (~하다/~이다) (run, eat, be, love)</li>
    <li><strong>4. 형용사 (Adjective):</strong> 명사의 모양, 성질, 상태를 꾸며주는 말 (~한, ~의) (happy, big, red)</li>
    <li><strong>5. 부사 (Adverb):</strong> 동사, 형용사, 다른 부사를 더 생생하게 꾸며주는 말 (~하게) (fast, quickly, very)</li>
    <li><strong>6. 전치사 (Preposition):</strong> 명사 앞에 붙어 시간, 장소, 방향을 나타내는 말 (in, on, at, under, to)</li>
    <li><strong>7. 접속사 (Conjunction):</strong> 단어와 단어, 문장과 문장을 이어주는 연결고리 (and, but, or, because)</li>
    <li><strong>8. 감탄사 (Interjection):</strong> 기쁨, 놀람, 슬픔 등 감정을 나타내는 짧은 외침 (Wow!, Oh!, Ouch!)</li>
  </ul>
</div>
`,
    "keyTakeaways": [
      "명사는 문장에서 주어, 목적어, 보어 자리에 들어갈 수 있는 핵심 재료이다.",
      "형용사는 '명사'를 꾸미고, 부사는 '동사/형용사/부사'를 꾸민다.",
      "전치사는 항상 명사(대명사) 앞에 오며, 단독으로 쓰이지 않는다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'She runs very fast.'에서 very와 fast의 품사는 각각 무엇일까요?",
        "answer": "fast는 '빠르게 달리다'로 동사 runs를 꾸미는 부사이고, very는 '매우 빠르게'로 부사 fast를 꾸미는 부사입니다. 둘 다 부사입니다!"
      },
      {
        "question": "Q. 'a happy boy'에서 happy는 어떤 품사이며 어떤 역할을 하나요?",
        "answer": "happy는 '행복한'이라는 뜻의 형용사로, 뒤에 오는 명사 boy를 수식(꾸며줌)합니다."
      }
    ],
    "formulas": [
      {
        "title": "형용사의 명사 수식 공식",
        "formula": "a / the + 형용사 + 명사",
        "desc": "형용사가 명사 바로 앞에서 명사의 성질이나 상태를 꾸며주는 어순",
        "coreMeaning": "영어에서 형용사가 명사를 단독으로 꾸밀 때는 항상 명사의 '앞'에 위치합니다. 관사(a/an/the)가 있을 때는 [관사 + 형용사 + 명사] 순서로 배치합니다.",
        "components": [
          { "part": "관사 (a/an/the)", "desc": "명사 앞에 붙는 기본 표식" },
          { "part": "형용사 (Adjective)", "desc": "명사의 상태/모양을 꾸며주는 단어" },
          { "part": "명사 (Noun)", "desc": "꾸밈을 받는 핵심 주인공" }
        ],
        "usageTip": "우리말 '예쁜 꽃'과 마찬가지로 영어도 'a pretty flower'처럼 형용사가 명사 앞에 옵니다.",
        "examples": [
          { "en": "He is a smart student.", "kr": "그는 똑똑한 학생이다.", "note": "a(관사) + smart(형용사) + student(명사)" },
          { "en": "I saw a cute cat.", "kr": "나는 귀여운 고양이 한 마리를 보았다.", "note": "cute가 명사 cat을 앞에서 수식" }
        ],
        "commonTrap": "🚨 주의: 형용사는 명사 뒤가 아니라 명사 앞에 위치합니다! (a cat cute ❌ ➔ a cute cat ⭕)"
      },
      {
        "title": "부사의 동사 수식 공식",
        "formula": "S + V + 부사 (방법/정도)",
        "desc": "부사가 동사 뒤에서 동작이 어떻게 일어나는지 설명하는 구조",
        "coreMeaning": "동작을 '어떻게' 하는지(빠르게, 친절하게, 열심히 등)를 나타내는 부사는 주로 동사 뒤 또는 문장 끝에 위치합니다.",
        "components": [
          { "part": "S (주어)", "desc": "동작의 주체" },
          { "part": "V (동사)", "desc": "동작을 나타내는 단어" },
          { "part": "부사 (Adverb)", "desc": "동작의 방법/상태를 묘사 (~하게)" }
        ],
        "usageTip": "형용사 끝에 -ly를 붙이면 대부분 부사가 됩니다 (quick ➔ quickly, slow ➔ slowly).",
        "examples": [
          { "en": "She speaks English fluently.", "kr": "그녀는 영어를 유창하게 말한다.", "note": "fluently가 speaks(말하다)를 수식" },
          { "en": "The dog runs fast.", "kr": "그 개는 빠르게 달린다.", "note": "fast는 형용사와 부사의 형태가 같은 단어" }
        ],
        "commonTrap": "🚨 주의: fastly는 없는 단어입니다! fast는 '빠른(형용사)'도 되고 '빠르게(부사)'도 됩니다."
      }
    ],
    "pitfalls": [
      {
        "title": "형용사와 부사의 형태가 같은 단어 주의!",
        "tip": "fast(빠른/빠르게), early(이른/일찍이), hard(단단한·어려운/열심히), late(늦은/늦게)는 -ly를 붙이지 않고 그대로 부사로 쓰입니다. (hardly는 '거의 ~않다'라는 완전히 다른 뜻!)"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "The smart boy answered the question correctly.",
        "translation": "그 똑똑한 소년은 그 질문에 올바르게 대답했다.",
        "tokens": [
          { "text": "The smart boy", "role": "S", "label": "주어 (명사구)" },
          { "text": "answered", "role": "V", "label": "동사" },
          { "text": "the question", "role": "O", "label": "목적어" },
          { "text": "correctly", "role": "M", "label": "부사 (수식어)" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c1_m1",
          "question": "다음 문장의 밑줄 친 단어의 품사로 알맞은 것은?\n\"She is a <ins>kind</ins> teacher.\"",
          "options": ["명사", "형용사", "부사", "전치사"],
          "answerIndex": 1,
          "explanation": "kind는 '친절한'이라는 뜻으로 뒤의 명사 teacher를 꾸며주는 형용사입니다."
        },
        {
          "id": "a1_c1_m2",
          "question": "다음 중 빈칸에 들어갈 알맞은 부사 형태는?\n\"He drives very ________.\"",
          "options": ["careful", "carefully", "carefulness", "care"],
          "answerIndex": 1,
          "explanation": "동사 drives(운전하다)를 꾸며주어야 하므로 부사 carefully(조심스럽게)가 와야 합니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c1_e1",
          "originalSentence": "He studies very hardly for the exam.",
          "underlineTarget": "hardly",
          "correctedWord": "hard",
          "explanation": "'열심히'라는 뜻의 부사는 hard입니다. hardly는 '거의 ~않다'라는 부정어입니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c1_u1",
          "promptKr": "그녀는 감미로운 노래를 아름답게 부른다.",
          "words": ["sings", "She", "a sweet song", "beautifully"],
          "answer": "She sings a sweet song beautifully"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c1_f1",
          "sentence": "The students listened to the teacher ________ (quiet).",
          "baseWord": "quiet",
          "answer": "quietly",
          "hint": "동사 listened를 꾸며주는 부사 형태로 변형하세요.",
          "explanation": "동사 listened를 꾸며주는 부사는 quiet에 -ly를 붙인 quietly(조용하게)입니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch2",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 2,
    "title": "be동사의 현재형과 과거형",
    "subtitle": "주인공의 상태와 신분을 나타내는 가장 기초적인 동사",
    "icon": "✨",
    "summary": "be동사는 '~이다(신분/상태)', '~에 있다(장소)'의 뜻을 가지며, 주어의 인칭과 시제(현재/과거)에 따라 am, is, are, was, were로 형태가 변합니다.",
    "storyMetaphor": "🪞 be동사는 주어의 모습을 비추는 '거울'과 같습니다. [주어 = 보어]라는 등식을 만들어 주는 다리 역할을 합니다!",
    "coreExplanation": `
<h3>💡 be동사는 어떤 뜻을 가지고 있을까요?</h3>
<p>be동사는 일반적인 동작(달리다, 먹다)이 아니라, 주인공이 <strong>'누구인지(신분)', '어떤 상태인지(형용사)', '어디에 있는지(장소)'</strong>를 나타낼 때 씁니다.</p>

<div class="concept-breakdown-card">
  <h4>📌 주어에 따른 be동사 짝 맞추기</h4>
  <table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:0.9rem;">
    <tr style="background:var(--bg-surface); font-weight:bold;">
      <td style="padding:6px; border:1px solid var(--border-color);">주어</td>
      <td style="padding:6px; border:1px solid var(--border-color);">현재형</td>
      <td style="padding:6px; border:1px solid var(--border-color);">과거형</td>
      <td style="padding:6px; border:1px solid var(--border-color);">예문</td>
    </tr>
    <tr>
      <td style="padding:6px; border:1px solid var(--border-color);">I (나)</td>
      <td style="padding:6px; border:1px solid var(--border-color); color:var(--primary); font-weight:bold;">am</td>
      <td style="padding:6px; border:1px solid var(--border-color); color:var(--danger); font-weight:bold;">was</td>
      <td style="padding:6px; border:1px solid var(--border-color);">I am a student. / I was busy.</td>
    </tr>
    <tr>
      <td style="padding:6px; border:1px solid var(--border-color);">He, She, It, 단수명사</td>
      <td style="padding:6px; border:1px solid var(--border-color); color:var(--primary); font-weight:bold;">is</td>
      <td style="padding:6px; border:1px solid var(--border-color); color:var(--danger); font-weight:bold;">was</td>
      <td style="padding:6px; border:1px solid var(--border-color);">He is happy. / It was cold.</td>
    </tr>
    <tr>
      <td style="padding:6px; border:1px solid var(--border-color);">You, We, They, 복수명사</td>
      <td style="padding:6px; border:1px solid var(--border-color); color:var(--primary); font-weight:bold;">are</td>
      <td style="padding:6px; border:1px solid var(--border-color); color:var(--danger); font-weight:bold;">were</td>
      <td style="padding:6px; border:1px solid var(--border-color);">They are ready. / We were late.</td>
    </tr>
  </table>
</div>
`,
    "keyTakeaways": [
      "I는 am/was, 단수는 is/was, 복수(You 포함)는 are/were를 쓴다.",
      "be동사의 부정문은 be동사 바로 뒤에 not을 붙인다 (am not, is not, are not).",
      "be동사의 의문문은 be동사를 주어 앞으로 보낸다 (Are you ~? / Is he ~?)."
    ],
    "selfChecks": [
      {
        "question": "Q. 'They was at home yesterday.'는 왜 틀렸을까요?",
        "answer": "주어 They는 복수형이므로 과거형 be동사로 was가 아닌 were를 써야 합니다. (They were at home yesterday.)"
      }
    ],
    "formulas": [
      {
        "title": "be동사 긍정문 / 부정문 공식",
        "formula": "S + be동사 (not) + 명사/형용사/장소",
        "desc": "주어의 상태나 신분을 긍정하거나 부정(~이 아니다)하는 공식",
        "coreMeaning": "be동사 바로 뒤에 not을 붙이면 부정문이 되고, 축약형(isn't, aren't, wasn't, weren't)을 자주 씁니다.",
        "components": [
          { "part": "S (주어)", "desc": "문장의 주인공" },
          { "part": "be동사 (+ not)", "desc": "am, is, are, was, were (+ not)" },
          { "part": "보어/장소", "desc": "신분(명사), 상태(형용사), 위치(전치사구)" }
        ],
        "usageTip": "am not은 amn't로 축약하지 않습니다.",
        "examples": [
          { "en": "She is not (isn't) tired now.", "kr": "그녀는 지금 피곤하지 않다.", "note": "is not = isn't" },
          { "en": "We were at the park yesterday.", "kr": "우리는 어제 공원에 있었다.", "note": "장소를 나타내는 be동사 과거형" }
        ],
        "commonTrap": "🚨 주의: You are not tired의 축약은 You aren't tired 또는 You're not tired 둘 다 가능합니다."
      }
    ],
    "pitfalls": [
      {
        "title": "be동사 의문문 대답할 때 주의점",
        "tip": "Are you a student? 질문에 긍정으로 답할 때 Yes, I am.은 맞지만 Yes, I'm.처럼 축약형으로 끝낼 수는 없습니다!"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "The brave firefighters were ready for the rescue.",
        "translation": "그 용감한 소방관들은 구조 준비가 되어 있었다.",
        "tokens": [
          { "text": "The brave firefighters", "role": "S", "label": "주어 (복수명사)" },
          { "text": "were", "role": "V", "label": "be동사 과거형" },
          { "text": "ready", "role": "C", "label": "주격보어 (형용사)" },
          { "text": "for the rescue", "role": "M", "label": "전치사구 (수식어)" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c2_m1",
          "question": "다음 빈칸에 들어갈 알맞은 be동사는?\n\"My parents ________ very proud of me last year.\"",
          "options": ["is", "are", "was", "were"],
          "answerIndex": 3,
          "explanation": "주어 My parents는 복수이며, last year(작년)라는 과거 시점 부사가 있으므로 were가 정답입니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c2_e1",
          "originalSentence": "He were very happy to see his old friend.",
          "underlineTarget": "were",
          "correctedWord": "was",
          "explanation": "주어가 3인칭 단수 He이므로 be동사 과거형은 was를 써야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c2_u1",
          "promptKr": "그들은 어제 도서관에 없었다.",
          "words": ["yesterday", "were not", "They", "at the library"],
          "answer": "They were not at the library yesterday"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c2_f1",
          "sentence": "I ________ (be) so excited about the school trip yesterday.",
          "baseWord": "be",
          "answer": "was",
          "hint": "주어 I와 과거 시점 yesterday에 맞게 be동사 과거형을 쓰세요.",
          "explanation": "I의 과거형 be동사는 was입니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch3",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 3,
    "title": "일반동사의 현재형과 3인칭 단수 -s",
    "subtitle": "주어에 따라 동사 끝에 -s를 붙이는 영문법 첫 번째 관문",
    "icon": "🏃",
    "summary": "be동사를 제외한 모든 동작과 상태를 나타내는 동사를 일반동사라고 합니다. 현재 시제에서 주어가 3인칭 단수(He, She, It, 단수명사)일 때는 동사 원형 뒤에 -s나 -es를 반드시 붙여야 합니다.",
    "storyMetaphor": "👑 3인칭 단수 주어(He, She, It)는 특별한 왕관을 쓰고 있어서, 뒤따르는 동사에게 반드시 '-s'라는 보석을 선물해야 합니다!",
    "coreExplanation": `
<h3>💡 3인칭 단수란 무엇일까요?</h3>
<p><strong>1인칭:</strong> 나(I, We)<br>
<strong>2인칭:</strong> 너(You)<br>
<strong>3인칭:</strong> 나와 너를 제외한 제3자 (He, She, It, Tom, My mother, The cat 등)</p>
<p>이 3인칭 중에서 <strong>'딱 1명/1개(단수)'</strong>가 주어로 오고 시제가 <strong>'현재'</strong>일 때만 동사 끝에 -s를 붙입니다.</p>

<div class="concept-breakdown-card">
  <h4>📌 3인칭 단수 동사 변화 규칙</h4>
  <ul>
    <li><strong>대부분의 동사:</strong> + s (like ➔ likes, read ➔ reads, play ➔ plays)</li>
    <li><strong>-s, -sh, -ch, -x, -o로 끝나는 동사:</strong> + es (pass ➔ passes, wash ➔ washes, watch ➔ watches, go ➔ goes)</li>
    <li><strong>[자음 + y]로 끝나는 동사:</strong> y를 i로 고치고 + es (study ➔ studies, fly ➔ flies) <em>(단, 모음+y는 그냥 s: play ➔ plays)</em></li>
    <li><strong>불규칙:</strong> have ➔ has</li>
  </ul>
</div>
`,
    "keyTakeaways": [
      "주어가 He, She, It, 단수명사일 때 일반동사 현재형에 -s/-es를 붙인다.",
      "부정문은 [doesn't + 동사원형], 의문문은 [Does + S + 동사원형?]을 쓴다.",
      "doesn't나 does가 나오면 뒤의 동사는 원래 형태(원형)로 돌아간다!"
    ],
    "selfChecks": [
      {
        "question": "Q. 'He doesn't likes apples.'는 왜 틀렸을까요?",
        "answer": "doesn't가 이미 3인칭 단수의 역할을 가져갔으므로, 뒤의 동사는 반드시 원형 like를 써야 합니다. (He doesn't like apples.)"
      }
    ],
    "formulas": [
      {
        "title": "3인칭 단수 현재형 긍정/부정 공식",
        "formula": "S(3인칭단수) + V-(e)s / doesn't + V원형",
        "desc": "3인칭 단수 주어 뒤의 동사 어형 변화와 부정문 공식",
        "coreMeaning": "주어가 3인칭 단수일 때 긍정문은 동사에 -s/-es를 붙이고, 부정문은 don't 대신 doesn't를 사용하며 뒤에 동사원형이 옵니다.",
        "components": [
          { "part": "S (He/She/It)", "desc": "3인칭 단수 주어" },
          { "part": "V-(e)s", "desc": "-s/-es가 붙은 일반동사 현재형" },
          { "part": "doesn't + V원형", "desc": "부정문 형태" }
        ],
        "usageTip": "Does he study hard?처럼 의문문에서도 Does가 앞에 나가면 동사는 study 원형을 씁니다.",
        "examples": [
          { "en": "My sister teaches English at school.", "kr": "내 여동생은 학교에서 영어를 가르친다.", "note": "teach ➔ teaches (-ch로 끝나서 -es)" },
          { "en": "Tom doesn't play soccer on weekdays.", "kr": "톰은 평일에는 축구를 하지 않는다.", "note": "doesn't + play(원형)" }
        ],
        "commonTrap": "🚨 주의: have의 3인칭 단수는 haves가 아니라 has입니다!"
      }
    ],
    "pitfalls": [
      {
        "title": "의문문과 부정문에서 동사원형 복귀 법칙",
        "tip": "Do / Does / Did 뒤에는 무조건 '동사원형'이 와야 합니다. Does she goes? ❌ ➔ Does she go? ⭕"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "My father washes his car every Sunday morning.",
        "translation": "나의 아버지는 매주 일요일 아침에 그의 차를 세차하신다.",
        "tokens": [
          { "text": "My father", "role": "S", "label": "주어 (3인칭 단수)" },
          { "text": "washes", "role": "V", "label": "동사 (wash + es)" },
          { "text": "his car", "role": "O", "label": "목적어" },
          { "text": "every Sunday morning", "role": "M", "label": "시간 부사구 (수식어)" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c3_m1",
          "question": "다음 빈칸에 들어갈 알맞은 동사 형태는?\n\"She ________ her teeth three times a day.\"",
          "options": ["brush", "brushs", "brushes", "brushing"],
          "answerIndex": 2,
          "explanation": "주어 She는 3인칭 단수이고 -sh로 끝나는 동사는 -es를 붙여 brushes가 됩니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c3_e1",
          "originalSentence": "Does your brother likes chocolate cake?",
          "underlineTarget": "likes",
          "correctedWord": "like",
          "explanation": "의문문 조동사 Does가 앞에 쓰였으므로 동사는 원형 like를 써야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c3_u1",
          "promptKr": "그녀는 매일 아침 도서관에서 공부한다.",
          "words": ["every morning", "in the library", "She", "studies"],
          "answer": "She studies in the library every morning"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c3_f1",
          "sentence": "My uncle ________ (live) in Busan with his family.",
          "baseWord": "live",
          "answer": "lives",
          "hint": "3인칭 단수 주어 My uncle에 맞게 변형하세요.",
          "explanation": "주어 My uncle은 3인칭 단수이므로 live 끝에 -s를 붙여 lives가 됩니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch4",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 4,
    "title": "일반동사의 과거형과 불규칙 변화",
    "subtitle": "이미 지나간 과거의 동작과 사건을 표현하는 법",
    "icon": "⏳",
    "summary": "과거의 특정한 시점에 일어난 동작이나 상태를 나타낼 때 일반동사의 과거형을 씁니다. 규칙 동사는 -ed를 붙이며, 일상에서 가장 많이 쓰이는 필수 불규칙 동사들의 3단 변화를 익힙니다.",
    "storyMetaphor": "📜 과거 시제는 어제 있었던 일을 기록하는 '일기장'입니다. 규칙적으로 -ed 도장을 찍거나, 고유한 옛 모습을 기억해 주면 됩니다!",
    "coreExplanation": `
<h3>💡 과거형은 언제 쓰고 어떻게 만들까요?</h3>
<p>yesterday(어제), last night(어젯밤), two days ago(이틀 전), in 2020(2020년에)처럼 <strong>명백한 과거를 나타내는 말</strong>과 함께 쓰입니다.</p>

<div class="concept-breakdown-card">
  <h4>📌 규칙 변화 vs 불규칙 변화</h4>
  <p><strong>1. 규칙 변화 (-ed):</strong><br>
  - 대부분: + ed (walk ➔ walked, watch ➔ watched)<br>
  - e로 끝남: + d (live ➔ lived, love ➔ loved)<br>
  - [자음+y]: y를 i로 고치고 + ed (study ➔ studied)<br>
  - [단모음+단자음]: 자음 한 번 더 쓰고 + ed (stop ➔ stopped, plan ➔ planned)</p>

  <p><strong>2. 필수 불규칙 변화:</strong><br>
  - go ➔ went / see ➔ saw / come ➔ came / buy ➔ bought / make ➔ made / write ➔ wrote / have ➔ had / eat ➔ ate</p>
</div>
`,
    "keyTakeaways": [
      "과거형은 주어의 인칭(1, 2, 3인칭)에 상관없이 형태가 동일하다.",
      "과거 부정문은 [didn't + 동사원형], 의문문은 [Did + S + 동사원형?]이다.",
      "불규칙 동사의 과거형은 필수적으로 암기해야 한다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'I didn't went to school yesterday.'는 왜 틀렸을까요?",
        "answer": "didn't 뒤에는 반드시 동사원형이 와야 하므로 went가 아닌 go를 써야 합니다. (I didn't go to school yesterday.)"
      }
    ],
    "formulas": [
      {
        "title": "일반동사 과거 긍정/부정/의문 공식",
        "formula": "S + V-ed (불규칙) / S + didn't + V원형 / Did + S + V원형?",
        "desc": "과거 시제의 긍정, 부정, 의문문 기본 구조",
        "coreMeaning": "과거 시제에서 부정문은 didn't + 동사원형을 쓰고, 의문문은 Did + 주어 + 동사원형 어순을 만듭니다.",
        "components": [
          { "part": "과거동사", "desc": "규칙(-ed) 또는 불규칙 과거형" },
          { "part": "didn't + V원형", "desc": "과거 부정문" },
          { "part": "Did + S + V원형", "desc": "과거 의문문" }
        ],
        "usageTip": "Did you see that?처럼 질문할 때 Did가 과거를 나타내므로 동사는 see 원형입니다.",
        "examples": [
          { "en": "I bought a new bicycle yesterday.", "kr": "나는 어제 새 자전거를 샀다.", "note": "buy의 불규칙 과거형 bought" },
          { "en": "Did you finish your homework?", "kr": "너는 숙제를 끝마쳤니?", "note": "Did + you + finish(원형)" }
        ],
        "commonTrap": "🚨 주의: read의 과거형은 스펠링은 read 그대로이지만 발음은 [레드]로 바뀝니다!"
      }
    ],
    "pitfalls": [
      {
        "title": "단모음+단자음 동사의 과거형 철자",
        "tip": "stop ➔ stopped, drop ➔ dropped, plan ➔ planned처럼 끝 자음을 한 번 더 쓰고 -ed를 붙여야 합니다."
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "The little girl found a shiny coin on the street.",
        "translation": "그 어린 소녀는 길거리에서 반짝이는 동전 하나를 발견했다.",
        "tokens": [
          { "text": "The little girl", "role": "S", "label": "주어" },
          { "text": "found", "role": "V", "label": "과거동사 (find의 과거)" },
          { "text": "a shiny coin", "role": "O", "label": "목적어" },
          { "text": "on the street", "role": "M", "label": "장소 부사구" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c4_m1",
          "question": "다음 중 동사의 과거형 연결이 바르지 않은 것은?",
          "options": ["make - made", "go - went", "buy - buyed", "see - saw"],
          "answerIndex": 2,
          "explanation": "buy의 과거형은 불규칙으로 bought입니다. buyed는 틀린 형태입니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c4_e1",
          "originalSentence": "Did you saw the movie last weekend?",
          "underlineTarget": "saw",
          "correctedWord": "see",
          "explanation": "의문문 조동사 Did 뒤에는 동사원형(see)이 와야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c4_u1",
          "promptKr": "우리는 지난밤에 맛있는 피자를 먹었다.",
          "words": ["delicious pizza", "We", "last night", "ate"],
          "answer": "We ate delicious pizza last night"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c4_f1",
          "sentence": "She ________ (write) a lovely letter to her grandmother yesterday.",
          "baseWord": "write",
          "answer": "wrote",
          "hint": "write의 불규칙 과거형을 쓰세요.",
          "explanation": "write의 과거형은 wrote입니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch5",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 5,
    "title": "명사의 단수·복수 & 관사 a/an/the",
    "subtitle": "셀 수 있는 명사와 셀 수 없는 명사, 정관사와 부정관사",
    "icon": "🍎",
    "summary": "영어의 명사는 하나(단수)인지 둘 이상(복수)인지, 셀 수 있는지 없는지를 엄격히 구별합니다. 처음 언급할 때는 a/an을, 특정한 대상을 가리킬 때는 the를 붙입니다.",
    "storyMetaphor": "🏷️ 관사(a/an/the)는 명사에게 붙여주는 '이름표'입니다. 세상에 흔한 하나는 a/an, 너도 알고 나도 아는 바로 그것은 the를 붙입니다!",
    "coreExplanation": `
<h3>💡 셀 수 있는 명사 vs 셀 수 없는 명사</h3>
<p><strong>1. 셀 수 있는 명사 (Countable):</strong> 형태가 일정하여 1개, 2개 셀 수 있음 (book, apple, chair)<br>
- 1개일 때: a book, an apple<br>
- 2개 이상일 때: books, apples, boxes, babies</p>

<p><strong>2. 셀 수 없는 명사 (Uncountable):</strong> 형태가 일정하지 않거나 너무 작거나 추상적임<br>
- 액체/기체: water, milk, air<br>
- 물질/재료: bread, cheese, paper, money<br>
- 추상적인 개념: love, happiness, information<br>
<em>⚠️ 주의: 셀 수 없는 명사 앞에는 a/an을 붙이거나 복수형 -s를 붙일 수 없습니다! (a water ❌, waters ❌)</em></p>
`,
    "keyTakeaways": [
      "모음(a, e, i, o, u) 소리로 시작하는 단수명사 앞에는 an을 쓴다 (an apple, an umbrella, an hour).",
      "너도 알고 나도 아는 특정한 것 앞에는 the를 쓴다.",
      "세상에 하나뿐인 것(the sun, the moon, the earth) 앞에는 the를 쓴다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'I have a money.'는 왜 틀렸을까요?",
        "answer": "money(돈)는 셀 수 없는 명사로 취급되므로 앞에 부정관사 a를 붙일 수 없습니다. 'I have money' 또는 'I have some money'라고 써야 합니다."
      }
    ],
    "formulas": [
      {
        "title": "부정관사 a/an vs 정관사 the 공식",
        "formula": "a/an + 단수명사 (불특정) vs the + 명사 (특정)",
        "desc": "처음 등장하는 막연한 하나(a/an)와 대화자 모두가 아는 특정한 대상(the)",
        "coreMeaning": "막연한 하나를 처음 언급할 때는 a/an을 쓰고, 그 대상을 다시 언급하거나 상황상 서로 알 때는 the를 씁니다.",
        "components": [
          { "part": "a / an", "desc": "자음 소리 앞 = a, 모음 소리 앞 = an" },
          { "part": "the", "desc": "정해진 특정한 대상 (~그)" }
        ],
        "usageTip": "철자가 아니라 '발음(소리)' 기준입니다. hour는 h가 묵음이라 [아워]로 발음되므로 an hour입니다.",
        "examples": [
          { "en": "I bought a book. The book was very interesting.", "kr": "나는 책 한 권을 샀다. 그 책은 매우 흥미로웠다.", "note": "처음엔 a book ➔ 다시 말할 땐 The book" },
          { "en": "The sun rises in the morning.", "kr": "태양은 아침에 뜬다.", "note": "세상에 유일한 것 The sun" }
        ],
        "commonTrap": "🚨 발음 주의: a university (u가 [유] 자음 발음이므로 an이 아닌 a를 씁니다)."
      }
    ],
    "pitfalls": [
      {
        "title": "불규칙 복수형 명사 필수 암기",
        "tip": "man ➔ men, woman ➔ women, child ➔ children, foot ➔ feet, tooth ➔ teeth, mouse ➔ mice"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "The children are playing with an orange ball in the park.",
        "translation": "그 아이들은 공원에서 주황색 공 하나를 가지고 놀고 있다.",
        "tokens": [
          { "text": "The children", "role": "S", "label": "주어 (불규칙 복수명사)" },
          { "text": "are playing", "role": "V", "label": "동사구 (현재진행)" },
          { "text": "with an orange ball", "role": "M", "label": "전치사구 (an + 모음형용사 + 명사)" },
          { "text": "in the park", "role": "M", "label": "장소 부사구 (the + 장소명사)" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c5_m1",
          "question": "다음 빈칸에 들어갈 관사의 연결이 바른 것은?\n\"I waited for ________ hour at ________ station.\"",
          "options": ["a - a", "an - the", "a - the", "an - a"],
          "answerIndex": 1,
          "explanation": "hour는 모음 발음이므로 an hour이고, 특정한 역을 가리키므로 the station이 됩니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c5_e1",
          "originalSentence": "There are many childs in the playground.",
          "underlineTarget": "childs",
          "correctedWord": "children",
          "explanation": "child의 올바른 복수형은 불규칙 변화인 children입니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c5_u1",
          "promptKr": "그 여자는 신선한 사과 세 개를 샀다.",
          "words": ["three fresh apples", "bought", "The woman"],
          "answer": "The woman bought three fresh apples"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c5_f1",
          "sentence": "Brush your ________ (tooth) before going to bed.",
          "baseWord": "tooth",
          "answer": "teeth",
          "hint": "tooth의 불규칙 복수형을 쓰세요.",
          "explanation": "tooth의 복수형은 teeth입니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch6",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 6,
    "title": "인칭대명사와 지시대명사",
    "subtitle": "주격, 소유격, 목적격, 소유대명사와 this/that",
    "icon": "👥",
    "summary": "사람이나 사물의 이름을 대신하는 대명사는 문장에서 주어 자리(주격), 명사 앞(소유격), 동사/전치사 뒤(목적격)에 따라 형태가 바뀝니다.",
    "storyMetaphor": "🎭 인칭대명사는 역할에 따라 옷을 갈아입는 '카멜레온'입니다. 주인공 자리에서는 I/He, 꾸밀 때는 My/His, 당할 때는 Me/Him으로 변신합니다!",
    "coreExplanation": `
<h3>💡 인칭대명사 4단 격변화 완벽 정복</h3>
<table style="width:100%; border-collapse:collapse; font-size:0.88rem; margin:10px 0;">
  <tr style="background:var(--bg-surface); font-weight:bold;">
    <td style="padding:6px; border:1px solid var(--border-color);">인칭</td>
    <td style="padding:6px; border:1px solid var(--border-color);">주격 (~은/는)</td>
    <td style="padding:6px; border:1px solid var(--border-color);">소유격 (~의)</td>
    <td style="padding:6px; border:1px solid var(--border-color);">목적격 (~을/를)</td>
    <td style="padding:6px; border:1px solid var(--border-color);">소유대명사 (~의 것)</td>
  </tr>
  <tr>
    <td style="padding:6px; border:1px solid var(--border-color);">1인칭 단수</td>
    <td style="padding:6px; border:1px solid var(--border-color);">I</td>
    <td style="padding:6px; border:1px solid var(--border-color);">my</td>
    <td style="padding:6px; border:1px solid var(--border-color);">me</td>
    <td style="padding:6px; border:1px solid var(--border-color);">mine</td>
  </tr>
  <tr>
    <td style="padding:6px; border:1px solid var(--border-color);">2인칭</td>
    <td style="padding:6px; border:1px solid var(--border-color);">you</td>
    <td style="padding:6px; border:1px solid var(--border-color);">your</td>
    <td style="padding:6px; border:1px solid var(--border-color);">you</td>
    <td style="padding:6px; border:1px solid var(--border-color);">yours</td>
  </tr>
  <tr>
    <td style="padding:6px; border:1px solid var(--border-color);">3인칭 남성</td>
    <td style="padding:6px; border:1px solid var(--border-color);">he</td>
    <td style="padding:6px; border:1px solid var(--border-color);">his</td>
    <td style="padding:6px; border:1px solid var(--border-color);">him</td>
    <td style="padding:6px; border:1px solid var(--border-color);">his</td>
  </tr>
  <tr>
    <td style="padding:6px; border:1px solid var(--border-color);">3인칭 여성</td>
    <td style="padding:6px; border:1px solid var(--border-color);">she</td>
    <td style="padding:6px; border:1px solid var(--border-color);">her</td>
    <td style="padding:6px; border:1px solid var(--border-color);">her</td>
    <td style="padding:6px; border:1px solid var(--border-color);">hers</td>
  </tr>
  <tr>
    <td style="padding:6px; border:1px solid var(--border-color);">3인칭 사물</td>
    <td style="padding:6px; border:1px solid var(--border-color);">it</td>
    <td style="padding:6px; border:1px solid var(--border-color);">its</td>
    <td style="padding:6px; border:1px solid var(--border-color);">it</td>
    <td style="padding:6px; border:1px solid var(--border-color);">-</td>
  </tr>
  <tr>
    <td style="padding:6px; border:1px solid var(--border-color);">3인칭 복수</td>
    <td style="padding:6px; border:1px solid var(--border-color);">they</td>
    <td style="padding:6px; border:1px solid var(--border-color);">their</td>
    <td style="padding:6px; border:1px solid var(--border-color);">them</td>
    <td style="padding:6px; border:1px solid var(--border-color);">theirs</td>
  </tr>
</table>
`,
    "keyTakeaways": [
      "동사 앞 주어 자리에는 주격(I, He, She, They)을 쓴다.",
      "명사 앞에는 소유격(My, His, Her, Their)을 쓴다.",
      "동사 뒤 목적어 자리나 전치사 뒤에는 목적격(Me, Him, Her, Them)을 쓴다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'Give the book to he.'는 왜 틀렸을까요?",
        "answer": "to는 전치사이므로 전치사 뒤에는 목적격인 him을 써야 합니다. (Give the book to him.)"
      }
    ],
    "formulas": [
      {
        "title": "소유대명사 공식",
        "formula": "소유격 + 명사 = 소유대명사",
        "desc": "my book = mine, your car = yours",
        "coreMeaning": "[소유격 + 명사]를 한 단어로 줄여서 '~의 것'으로 표현할 때 소유대명사를 씁니다.",
        "components": [
          { "part": "소유격+명사", "desc": "my bag, her phone" },
          { "part": "소유대명사", "desc": "mine, hers, his, yours, theirs" }
        ],
        "usageTip": "This bag is mine. (= This is my bag.)",
        "examples": [
          { "en": "This umbrella is not mine; it is hers.", "kr": "이 우산은 내 것이 아니다. 그것은 그녀의 것이다.", "note": "mine = my umbrella, hers = her umbrella" }
        ],
        "commonTrap": "🚨 it's vs its 구별: it's는 it is의 축약형이고, its는 '그것의'라는 소유격입니다!"
      }
    ],
    "pitfalls": [
      {
        "title": "지시대명사 this/that의 복수형",
        "tip": "가까운 것 1개는 this, 여러 개는 these! 먼 것 1개는 that, 여러 개는 those!"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "My teacher gave us a lot of helpful advice.",
        "translation": "나의 선생님은 우리에게 많은 유용한 조언을 주셨다.",
        "tokens": [
          { "text": "My teacher", "role": "S", "label": "주어 (소유격 + 명사)" },
          { "text": "gave", "role": "V", "label": "동사" },
          { "text": "us", "role": "IO", "label": "간접목적어 (목적격 대명사)" },
          { "text": "a lot of helpful advice", "role": "DO", "label": "직접목적어" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c6_m1",
          "question": "다음 빈칸에 들어갈 알맞은 대명사는?\n\"This is not my pen. It is ________.\"",
          "options": ["her", "him", "hers", "them"],
          "answerIndex": 2,
          "explanation": "'그녀의 것'이라는 소유대명사가 들어가야 하므로 hers가 정답입니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c6_e1",
          "originalSentence": "The cat licked it's paw carefully.",
          "underlineTarget": "it's",
          "correctedWord": "its",
          "explanation": "'그것의'라는 소유격을 나타내야 하므로 아포스트로피가 없는 its가 맞습니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c6_u1",
          "promptKr": "그들은 어제 우리에게 그들의 새 집을 보여주었다.",
          "words": ["their new house", "They", "showed us", "yesterday"],
          "answer": "They showed us their new house yesterday"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c6_f1",
          "sentence": "Can you pass ________ (I) the salt, please?",
          "baseWord": "I",
          "answer": "me",
          "hint": "동사 pass 뒤 목적어 자리에 들어갈 인칭대명사 목적격을 쓰세요.",
          "explanation": "동사 뒤 간접목적어 자리이므로 I의 목적격인 me가 옵니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch7",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 7,
    "title": "형용사와 부사의 기초와 빈도부사",
    "subtitle": "문장을 풍성하고 구체적으로 묘사하는 수식어의 규칙",
    "icon": "🎨",
    "summary": "형용사는 명사를 수식하거나 보어로 쓰이며, 부사는 동사나 형용사를 수식합니다. 얼마나 자주 일어나는지를 나타내는 빈도부사의 정확한 위치(be/조동사 뒤, 일반동사 앞)를 마스터합니다.",
    "storyMetaphor": "⏱️ 빈도부사는 동작이 얼마나 자주 반복되는지 알려주는 '메트로놈'입니다. 항상(always)부터 전혀 안 함(never)까지의 스펙트럼이 있습니다!",
    "coreExplanation": `
<h3>💡 빈도부사의 6단계 강도와 절대 위치 규칙</h3>
<p><strong>1. 빈도의 강도:</strong><br>
always (100% 항상) ➔ usually (80% 보통) ➔ often (60% 자주) ➔ sometimes (40% 때때로) ➔ seldom/rarely (10% 거의 안 함) ➔ never (0% 절대 안 함)</p>

<div class="concept-breakdown-card">
  <h4>🚨 빈도부사의 황금 위치 공식 (비조뒤 일앞)</h4>
  <ul>
    <li><strong>be동사 / 조동사 뒤:</strong> He is <strong>always</strong> kind. / You should <strong>never</strong> give up.</li>
    <li><strong>일반동사 앞:</strong> She <strong>often</strong> eats breakfast. / I <strong>usually</strong> get up at 7.</li>
  </ul>
</div>
`,
    "keyTakeaways": [
      "빈도부사 위치는 '비조뒤 일앞' (be동사/조동사 뒤, 일반동사 앞)이다.",
      "형용사는 명사를 꾸미고, 부사는 동사/형용사/부사를 꾸민다.",
      "very, really, so는 형용사와 부사의 정도를 강조한다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'I always am happy.'는 왜 어색한 문장일까요?",
        "answer": "be동사 am이 쓰였으므로 빈도부사 always는 be동사 뒤로 가야 합니다. (I am always happy.)"
      }
    ],
    "formulas": [
      {
        "title": "빈도부사 위치 공식 (비조뒤 일앞)",
        "formula": "be동사/조동사 + 빈도부사 vs 빈도부사 + 일반동사",
        "desc": "문장 속 동사의 종류에 따라 결정되는 빈도부사의 위치",
        "coreMeaning": "동사가 be동사나 조동사일 때는 그 뒤에 빈도부사를 두고, 일반동사일 때는 일반동사 바로 앞에 빈도부사를 배치합니다.",
        "components": [
          { "part": "be동사/조동사 뒤", "desc": "is always, can never" },
          { "part": "일반동사 앞", "desc": "usually plays, sometimes goes" }
        ],
        "usageTip": "'비조뒤 일앞' 4글자를 소리 내어 외우면 절대 잊어버리지 않습니다!",
        "examples": [
          { "en": "He is always punctual.", "kr": "그는 항상 시간을 잘 지킨다.", "note": "be동사 is 뒤" },
          { "en": "She usually walks to school.", "kr": "그녀는 보통 걸어서 학교에 간다.", "note": "일반동사 walks 앞" }
        ],
        "commonTrap": "🚨 주의: Sometimes는 문장 맨 앞이나 맨 뒤에 오는 것도 허용됩니다."
      }
    ],
    "pitfalls": [
      {
        "title": "부정어 never와 not의 중복 금지",
        "tip": "never 자체에 '결코 아니다'라는 부정의 뜻이 들어있으므로 don't never처럼 not과 never를 겹쳐 쓰지 않습니다!"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "My grandfather always drinks warm green tea after dinner.",
        "translation": "나의 할아버지는 저녁 식사 후에 항상 따뜻한 녹차를 마시신다.",
        "tokens": [
          { "text": "My grandfather", "role": "S", "label": "주어" },
          { "text": "always", "role": "M", "label": "빈도부사 (일반동사 앞)" },
          { "text": "drinks", "role": "V", "label": "동사 (3인칭 단수)" },
          { "text": "warm green tea", "role": "O", "label": "목적어" },
          { "text": "after dinner", "role": "M", "label": "시간 전치사구" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c7_m1",
          "question": "다음 중 빈도부사의 위치가 가장 올바른 문장은?",
          "options": [
            "He arrives always on time.",
            "He always arrives on time.",
            "He arrives on time always.",
            "Always he arrives on time."
          ],
          "answerIndex": 1,
          "explanation": "arrives는 일반동사이므로 빈도부사 always는 일반동사 앞에 위치해야 합니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c7_e1",
          "originalSentence": "They are late usually for the morning meeting.",
          "underlineTarget": "are late usually",
          "correctedWord": "are usually late",
          "explanation": "be동사 are 뒤에 빈도부사 usually가 오고 그 뒤에 형용사 late가 와야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c7_u1",
          "promptKr": "그녀는 주말에 결코 늦잠을 자지 않는다.",
          "words": ["on weekends", "never", "She", "sleeps late"],
          "answer": "She never sleeps late on weekends"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c7_f1",
          "sentence": "We ________ (usual) go swimming on hot summer days.",
          "baseWord": "usual",
          "answer": "usually",
          "hint": "형용사 usual을 빈도부사 형태로 변형하세요.",
          "explanation": "usual에 -ly를 붙인 usually(보통, 대개)가 빈도부사 형태입니다."
        }
      ]
    }
  },
  {
    "id": "a1_ch8",
    "level": 1,
    "levelCode": "A1",
    "chapterNum": 8,
    "title": "기본 의문사와 There is / There are",
    "subtitle": "궁금한 정보를 묻는 6하원칙 의문문과 존재 표현",
    "icon": "❓",
    "summary": "구체적인 정보를 묻는 6대 의문사(Who, What, Where, When, Why, How)와 사물이나 사람의 존재(~이 있다)를 나타내는 There is / There are 구문을 정복합니다.",
    "storyMetaphor": "🔍 의문사는 궁금증을 해결해 주는 '탐정의 질문'입니다. 누가(Who), 무엇을(What), 어디서(Where), 언제(When), 왜(Why), 어떻게(How) 문장 맨 앞에서 신호를 보냅니다!",
    "coreExplanation": `
<h3>💡 의문사 의문문과 There is/are의 원리</h3>
<p><strong>1. 의문사 의문문 어순:</strong><br>
[의문사 + be동사/조동사 + 주어 ~?] 또는 [의문사 + do/does/did + 주어 + 동사원형 ~?]</p>
<p><strong>2. There is / There are (유도부사 구문):</strong><br>
There는 '거기에'라고 해석하지 않고 단순히 뒤에 무언가가 '있다'는 신호탄 역할을 합니다.<br>
- 뒤에 단수명사/셀 수 없는 명사가 오면: <strong>There is</strong> (There is an apple. / There is water.)<br>
- 뒤에 복수명사가 오면: <strong>There are</strong> (There are three apples.)</p>
`,
    "keyTakeaways": [
      "의문사는 항상 문장의 맨 앞에 온다.",
      "There is 뒤에는 단수명사, There are 뒤에는 복수명사가 온다 (수일치는 뒤의 명사가 결정!).",
      "There is/are의 의문문은 Is there ~? / Are there ~?로 자리를 바꾼다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'There is many books on the desk.'는 왜 틀렸을까요?",
        "answer": "뒤에 오는 명사가 many books(복수명사)이므로 is가 아닌 are를 써야 합니다. (There are many books on the desk.)"
      }
    ],
    "formulas": [
      {
        "title": "There is / There are 수일치 공식",
        "formula": "There is + 단수명사 vs There are + 복수명사",
        "desc": "뒤따라 나오는 진짜 주어의 수에 따라 be동사를 결정하는 공식",
        "coreMeaning": "There는 가짜 주어(유도부사)이며, 진짜 주어는 be동사 '뒤'에 위치합니다.",
        "components": [
          { "part": "There is", "desc": "단수 명사 또는 셀 수 없는 명사 앞" },
          { "part": "There are", "desc": "복수 명사 앞" },
          { "part": "진짜 주어", "desc": "be동사 바로 뒤에 오는 명사" }
        ],
        "usageTip": "There was(단수과거), There were(복수과거)로 시제 변화도 동일합니다.",
        "examples": [
          { "en": "There is a beautiful park near my house.", "kr": "우리 집 근처에 아름다운 공원 하나가 있다.", "note": "a beautiful park (단수) ➔ is" },
          { "en": "There are some birds singing in the trees.", "kr": "나무에서 노래하는 몇 마리의 새들이 있다.", "note": "some birds (복수) ➔ are" }
        ],
        "commonTrap": "🚨 주의: There is no sugar in the coffee. (sugar는 셀 수 없으므로 is를 씁니다)."
      }
    ],
    "pitfalls": [
      {
        "title": "의문사가 주어일 때의 어순 주의",
        "tip": "Who broke the window?처럼 의문사 Who/What 자체가 주어일 때는 do/does 없이 바로 동사(broke)가 옵니다!"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "Where did you buy that awesome backpack?",
        "translation": "너는 그 멋진 배낭을 어디에서 샀니?",
        "tokens": [
          { "text": "Where", "role": "M", "label": "의문부사 (장소)" },
          { "text": "did", "role": "V", "label": "조동사 (과거)" },
          { "text": "you", "role": "S", "label": "주어" },
          { "text": "buy", "role": "V", "label": "동사원형" },
          { "text": "that awesome backpack", "role": "O", "label": "목적어" }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a1_c8_m1",
          "question": "다음 빈칸에 들어갈 알맞은 표현은?\n\"________ any milk left in the refrigerator?\"",
          "options": ["Is there", "Are there", "There is", "There are"],
          "answerIndex": 0,
          "explanation": "milk는 셀 수 없는 명사(단수 취급)이고 의문문이므로 Is there가 올바른 형태입니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a1_c8_e1",
          "originalSentence": "Where you went last Sunday?",
          "underlineTarget": "you went",
          "correctedWord": "did you go",
          "explanation": "일반동사 과거 의문문은 [의문사 + did + 주어 + 동사원형] 어순이므로 did you go가 맞습니다."
        }
      ],
      "unscramble": [
        {
          "id": "a1_c8_u1",
          "promptKr": "테이블 위에 맛있는 사과 세 개가 있다.",
          "words": ["three delicious apples", "on the table", "There are"],
          "answer": "There are three delicious apples on the table"
        }
      ],
      "formCloze": [
        {
          "id": "a1_c8_f1",
          "sentence": "Why ________ (do) she cry so sadly yesterday?",
          "baseWord": "do",
          "answer": "did",
          "hint": "yesterday 시점에 맞게 과거 의문문 조동사를 쓰세요.",
          "explanation": "과거 시점 yesterday에 대한 일반동사 의문문이므로 did가 들어갑니다."
        }
      ]
    }
  }
];
