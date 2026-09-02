const GRAMMAR_A2 = [
  {
    "id": "a2_ch1",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 9,
    "title": "문장 5형식과 문장 성분",
    "subtitle": "주어, 동사, 목적어, 보어로 완성하는 영어의 뼈대",
    "icon": "🧱",
    "summary": "영어의 모든 문장은 주어(S), 동사(V), 목적어(O), 보어(C), 수식어(M)의 조합에 따라 5가지 기본 형식으로 분류됩니다. 문장의 뼈대를 바르게 식별하는 것이 정확한 독해의 출발점입니다.",
    "formulas": [
      {
        "title": "1형식 (완전자동사)",
        "formula": "S + V (+ M)",
        "desc": "목적어나 보어 없이 주어와 동사만으로 의미가 완전한 문장",
        "coreMeaning": "동작의 대상(~을/를)이나 주어를 보충해 주는 말(보어) 없이, 주어(S)와 동사(V) 자체만으로 문장의 의미가 100% 온전하게 완성되는 가장 순수하고 기본적인 뼈대 구조입니다. 문장 뒤에 전치사구나 부사가 길게 이어지더라도 문장 형식 계산 시에는 수식어(M)로 취급하여 제외합니다.",
        "components": [
          {
            "part": "S (주어)",
            "desc": "행동이나 상태의 주인공 (~은/는/이/가)"
          },
          {
            "part": "V (완전자동사)",
            "desc": "목적어나 보어가 필요 없는 스스로 서는 동사 (go, run, rise, live, shine 등)"
          },
          {
            "part": "M (수식어구 - 선택)",
            "desc": "시간(when), 장소(where), 방법(how)을 나타내는 부사나 전치사구"
          }
        ],
        "usageTip": "문장이 길어 보여도 전치사구([in the morning], [on the hill])를 괄호로 묶어내면 주어와 동사만 남는 1형식임을 쉽게 판별할 수 있습니다.",
        "examples": [
          {
            "en": "The sun rises in the east.",
            "kr": "태양이 동쪽에서 떠오른다.",
            "note": "rises(동사) + in the east(장소 전치사구 M)"
          },
          {
            "en": "The birds were singing brightly in the trees.",
            "kr": "새들이 나무에서 밝게 노래하고 있었다.",
            "note": "were singing(동사구) + brightly(부사 M) + in the trees(전치사구 M)"
          }
        ],
        "commonTrap": "🚨 수능/내신 함정: 동사 뒤에 긴 전치사구가 오면 3형식으로 착각하기 쉽지만, 전치사구는 절대 목적어가 아니므로 1형식입니다!"
      },
      {
        "title": "2형식 (불완전자동사)",
        "formula": "S + V + C (주격보어)",
        "desc": "주어의 상태나 성질을 보충 설명하는 명사/형용사 보어가 필요한 문장",
        "coreMeaning": "동사 혼자서는 주어의 상태나 정체를 온전히 전달하지 못하여, 주어가 어떤 사람/상태인지를 뒤에서 보충 설명해 주는 '주격보어(C)'가 반드시 필요한 구조입니다. [주어 = 보어]라는 등식 관계가 항상 성립합니다.",
        "components": [
          {
            "part": "S (주어)",
            "desc": "문장의 주인공 (~은/는/이/가)"
          },
          {
            "part": "V (불완전자동사)",
            "desc": "be동사, 감각동사(look, sound, smell, taste, feel), 상태유지/변화동사(stay, become, turn)"
          },
          {
            "part": "C (주격보어)",
            "desc": "주어의 상태를 설명하는 형용사 또는 주어의 신분을 나타내는 명사"
          }
        ],
        "usageTip": "감각동사(look, smell 등) 뒤에는 한국어로 '~하게'라고 부사처럼 해석되더라도 문법적으로는 반드시 형용사 보어를 씁니다.",
        "examples": [
          {
            "en": "She looks happy today.",
            "kr": "그녀는 오늘 행복해 보인다.",
            "note": "She(주어) = happy(형용사 주격보어). happily(부사)는 절대 불가!"
          },
          {
            "en": "His dream became a reality.",
            "kr": "그의 꿈은 현실이 되었다.",
            "note": "His dream(주어) = a reality(명사 주격보어)"
          }
        ],
        "commonTrap": "🚨 빈출 오답: 'The music sounds beautifully ❌' ➔ 감각동사 sound 뒤에는 부사가 아닌 형용사 beautiful ⭕을 써야 합니다!"
      },
      {
        "title": "3형식 (완전타동사)",
        "formula": "S + V + O (목적어)",
        "desc": "동사의 대상이 되는 목적어가 필요한 문장",
        "coreMeaning": "주어의 동작이나 행위가 가 닿는 구체적인 '대상(목적어: ~을/를)'이 반드시 있어야만 문장의 의미가 온전해지는 가장 널리 쓰이는 기본 구조입니다.",
        "components": [
          {
            "part": "S (주어)",
            "desc": "행동을 실행하는 주체 (~은/는/이/가)"
          },
          {
            "part": "V (완전타동사)",
            "desc": "목적어를 반드시 필요로 하는 타동사 (like, make, read, solve, love 등)"
          },
          {
            "part": "O (목적어)",
            "desc": "행동의 직접적인 대상 (~을/를)"
          }
        ],
        "usageTip": "동사 뒤에 '무엇을/누구를?'이라는 질문을 던졌을 때 답이 되는 명사가 바로 목적어(O)입니다.",
        "examples": [
          {
            "en": "He solved the difficult puzzle easily.",
            "kr": "그는 그 어려운 퍼즐을 쉽게 풀어냈다.",
            "note": "the difficult puzzle = 목적어(O), easily = 부사(M)"
          },
          {
            "en": "We enjoyed the live concert yesterday.",
            "kr": "우리는 어제 라이브 콘서트를 즐겼다.",
            "note": "the live concert = 목적어(O)"
          }
        ],
        "commonTrap": "🚨 전치사 착각 주의: discuss, enter, marry, reach 등은 타동사이므로 뒤에 전치사(about, into, with, to)를 절대 붙이면 안 됩니다! (enter into the room ❌ ➔ enter the room ⭕)"
      },
      {
        "title": "4형식 (수여동사)",
        "formula": "S + V + IO(간목) + DO(직목)",
        "desc": "~에게 ~을 주다 형태의 문장 (3형식 전환 시 to/for/of 전치사 사용)",
        "coreMeaning": "주어가 누군가에게 무언가를 건네주는 '수여(Give)'의 의미를 가집니다. 받는 사람(~에게: 간접목적어)이 먼저 오고, 건네받는 물건(~을/를: 직접목적어)이 뒤따르는 2중 목적어 구조입니다.",
        "components": [
          {
            "part": "S (주어)",
            "desc": "무언가를 주는 사람"
          },
          {
            "part": "V (수여동사)",
            "desc": "give, send, teach, show, make, buy, ask 등 '주다'의 뉘앙스를 가진 동사"
          },
          {
            "part": "IO (간접목적어)",
            "desc": "받는 대상/사람 (~에게)"
          },
          {
            "part": "DO (직접목적어)",
            "desc": "건네받는 물건/내용 (~을/를)"
          }
        ],
        "usageTip": "3형식으로 바꿀 때: [S + V + DO(물건) + 전치사(to/for/of) + IO(사람)] 어순으로 전환됩니다. (to: 방향 전달, for: 정성과 수고, of: 요청)",
        "examples": [
          {
            "en": "My mom made me a delicious cake.",
            "kr": "어머니는 나에게 맛있는 케이크를 만들어 주셨다.",
            "note": "me (간목: 나에게) + a delicious cake (직목: 케이크를)"
          },
          {
            "en": "He sent his friend a postcard.",
            "kr": "그는 친구에게 엽서를 보냈다.",
            "note": "3형식 전환: He sent a postcard to his friend."
          }
        ],
        "commonTrap": "🚨 대명사 직목 규칙: 직접목적어가 대명사(it, them)일 때는 4형식을 쓰지 않고 3형식으로만 씁니다! (Give me it ❌ ➔ Give it to me ⭕)"
      },
      {
        "title": "5형식 (불완전타동사)",
        "formula": "S + V + O + OC (목적격보어)",
        "desc": "목적어의 상태, 성질, 동작을 보충 설명하는 보어가 필요한 문장",
        "coreMeaning": "주어와 동사, 목적어만으로는 문장의 뜻이 불충분하여, 목적어가 어떤 상태인지 또는 어떤 행동을 하는지를 뒤에서 보충해 주는 '목적격보어(OC)'가 결합된 가장 고급스럽고 핵심적인 구문입니다. [목적어 = 목적격보어]의 작은 2형식 관계가 문장 속에 포함되어 있습니다.",
        "components": [
          {
            "part": "S (주어)",
            "desc": "문장의 주인공"
          },
          {
            "part": "V (불완전타동사)",
            "desc": "make, call, name, keep, find, 사역동사(let/make/have), 지각동사(see/hear), 권유동사(want/ask/allow)"
          },
          {
            "part": "O (목적어)",
            "desc": "의미상의 주어 역할을 하는 대상 (~이/가, ~을/를)"
          },
          {
            "part": "OC (목적격보어)",
            "desc": "목적어의 정체(명사), 상태(형용사), 동작(to부정사/동사원형/분사)"
          }
        ],
        "usageTip": "목적어와 목적격보어 사이에 'is'나 'do'를 넣어보았을 때 말이 되면 5형식입니다! (The news made [me = happy])",
        "examples": [
          {
            "en": "The coach made the players run fast.",
            "kr": "코치는 선수들에게 빠르게 달리도록 시켰다.",
            "note": "사역동사 make + 목적어(the players) + 원형부정사(run)"
          },
          {
            "en": "We consider her a great leader.",
            "kr": "우리는 그녀를 훌륭한 지도자라고 생각한다.",
            "note": "her(목적어) = a great leader(명사 목적격보어)"
          }
        ],
        "commonTrap": "🚨 목적격보어 품사 함정: 목적격보어 자리에 형용사가 올 때 부사를 쓰지 않도록 주의! (Keep the room cleanly ❌ ➔ Keep the room clean ⭕)"
      }
    ],
    "pitfalls": [
      {
        "title": "감각동사 뒤에는 반드시 형용사 보어!",
        "tip": "look, sound, smell, taste, feel 뒤에는 한국어 해석이 부사처럼 되더라도 부사를 쓸 수 없습니다. (Look nicely ❌ ➔ Look nice ⭕)"
      },
      {
        "title": "4형식 ➔ 3형식 전환 전치사 구분",
        "tip": "to(give, send, show), for(make, buy, cook, find), of(ask)를 정확히 구별해야 합니다."
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "The morning sun rises brightly in the east.",
        "translation": "아침 태양이 동쪽에서 밝게 떠오른다. (1형식)",
        "tokens": [
          {
            "text": "The morning sun",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "rises",
            "role": "V",
            "label": "동사"
          },
          {
            "text": "brightly",
            "role": "M",
            "label": "부사 수식어"
          },
          {
            "text": "in the east",
            "role": "M",
            "label": "전치사구 수식어"
          }
        ]
      },
      {
        "sentence": "The hot soup smells wonderful in the kitchen.",
        "translation": "그 뜨거운 수프는 주방에서 매우 향긋한 냄새가 난다. (2형식)",
        "tokens": [
          {
            "text": "The hot soup",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "smells",
            "role": "V",
            "label": "감각동사"
          },
          {
            "text": "wonderful",
            "role": "C",
            "label": "주격보어(형용사)"
          },
          {
            "text": "in the kitchen",
            "role": "M",
            "label": "수식어"
          }
        ]
      },
      {
        "sentence": "The encouraging news made all students very happy.",
        "translation": "그 고무적인 소식은 모든 학생들을 매우 행복하게 만들었다. (5형식)",
        "tokens": [
          {
            "text": "The encouraging news",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "made",
            "role": "V",
            "label": "불완전타동사"
          },
          {
            "text": "all students",
            "role": "O",
            "label": "목적어"
          },
          {
            "text": "very happy",
            "role": "C",
            "label": "목적격보어"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_1_m1",
          "question": "다음 문장의 빈칸에 들어갈 가장 알맞은 단어는?\n\"The lemon juice tastes too ________ to drink.\"",
          "options": [
            "sourly",
            "sour",
            "more sourly",
            "sourness"
          ],
          "answerIndex": 1,
          "explanation": "감각동사 taste 뒤에는 주격보어로 형용사가 와야 하므로 sour가 정답입니다."
        },
        {
          "id": "a2_1_m2",
          "question": "다음 중 문장의 형식이 나머지 넷과 다른 것은?",
          "options": [
            "She sent me a lovely postcard.",
            "He bought his sister a new watch.",
            "They named their puppy Coco.",
            "My uncle told us an interesting story."
          ],
          "answerIndex": 2,
          "explanation": "1, 2, 4번은 4형식(S+V+IO+DO)이며, 3번은 5형식(S+V+O+OC: puppy=Coco)입니다."
        },
        {
          "id": "a2_1_m3",
          "question": "4형식 문장 \"He cooked his parents a nice dinner.\"를 3형식으로 올바르게 전환한 것은?",
          "options": [
            "He cooked a nice dinner to his parents.",
            "He cooked a nice dinner for his parents.",
            "He cooked a nice dinner of his parents.",
            "He cooked a nice dinner with his parents."
          ],
          "answerIndex": 1,
          "explanation": "동사 cook, make, buy 등은 3형식 전환 시 간접목적어 앞에 전치사 for를 사용합니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_1_e1",
          "originalSentence": "The fresh coffee in the café smelled very sweetly.",
          "underlineTarget": "sweetly",
          "correctedWord": "sweet",
          "explanation": "감각동사 smell 뒤에는 부사가 올 수 없으며, 주격보어로 형용사 sweet를 써야 합니다."
        },
        {
          "id": "a2_1_e2",
          "originalSentence": "She gave a warm winter scarf for her best friend.",
          "underlineTarget": "for",
          "correctedWord": "to",
          "explanation": "수여동사 give는 3형식 전환 시 방향을 나타내는 전치사 to를 취합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_1_u1",
          "promptKr": "그 따뜻한 음악은 나를 편안하게 느끼게 만든다.",
          "words": [
            "The",
            "warm",
            "music",
            "makes",
            "me",
            "feel",
            "relaxed"
          ],
          "answer": "The warm music makes me feel relaxed"
        },
        {
          "id": "a2_1_u2",
          "promptKr": "아버지는 나에게 새 자전거를 사주셨다.",
          "words": [
            "My",
            "father",
            "bought",
            "me",
            "a",
            "new",
            "bicycle"
          ],
          "answer": "My father bought me a new bicycle"
        }
      ],
      "formCloze": [
        {
          "id": "a2_1_c1",
          "sentence": "The delicious strawberry cake tastes ________ (sweet) than the chocolate one.",
          "baseWord": "sweet",
          "answer": "sweeter",
          "hint": "than 앞의 비교급 형용사 형태",
          "explanation": "비교급 문맥에서 taste의 보어로 형용사의 비교급 sweeter가 들어갑니다."
        }
      ]
    },
    "storyMetaphor": "🧱 레고 블록에 5가지 조립 설명서가 있듯이, 영어의 모든 문장도 딱 5가지 틀(1~5형식)로 조립됩니다!",
    "coreExplanation": "\n<h3>💡 5형식을 왜 배워야 할까요?</h3>\n<p>영어 문장이 아무리 길고 복잡해 보여도, 사실은 <strong>[주어(주인공)], [동사(행동/상태)], [목적어(대상)], [보어(보충설명)]</strong>라는 4가지 핵심 레고 블록으로만 만들어집니다. 뒤에 붙는 전치사구나 부사는 문장을 풍성하게 꾸며주는 '악세사리(수식어 M)'일 뿐이에요.</p>\n\n<div class=\"concept-breakdown-card\">\n  <h4>🔍 어려운 한자어 문법 용어, 1초 만에 이해하기</h4>\n  <ul>\n    <li><strong>주어 (Subject, S):</strong> 문장의 '주인공' (~은/는/이/가)</li>\n    <li><strong>동사 (Verb, V):</strong> 주인공의 '동작이나 상태' (~하다/~이다)</li>\n    <li><strong>목적어 (Object, O):</strong> 동작을 받는 '대상' (~을/를, ~에게)</li>\n    <li><strong>보어 (Complement, C):</strong> 주어나 목적어의 상태를 '보충해 주는 말' (형용사 또는 명사)</li>\n    <li><strong>수식어 (Modifier, M):</strong> 시간, 장소, 방법 등을 덧붙여주는 꾸밈말 (문장 형식 판단에서 제외)</li>\n  </ul>\n</div>\n\n<div class=\"concept-breakdown-card\">\n  <h4>🔑 1형식부터 5형식까지 한눈에 꿰뚫는 핵심 차이</h4>\n  <p><strong>1형식 (S + V):</strong> 주인공과 동작만으로 의미가 끝납니다. 뒤에 아무리 긴 장소/시간 부사구가 붙어도 형식은 변하지 않아요.<br>\n  <em>예: The bird sings [sweetly in the morning]. (새가 노래한다 - 1형식)</em></p>\n  <p><strong>2형식 (S + V + C):</strong> 동사만으로는 주인공의 상태가 부족해서 주어를 보충해 주는 말(C)이 필요합니다.<br>\n  <em>예: She is a doctor. / She looks happy. (그녀 = 행복한 상태)</em></p>\n  <p><strong>3형식 (S + V + O):</strong> 동작이 가 닿는 대상(~을/를)이 반드시 필요합니다.<br>\n  <em>예: I like pizza. (내가 좋아하는 '대상'은 피자)</em></p>\n  <p><strong>4형식 (S + V + IO + DO):</strong> 누군가에게 무언가를 '주는(수여)' 문장입니다.<br>\n  <em>예: Mom gave me (나에게) a gift (선물을).</em></p>\n  <p><strong>5형식 (S + V + O + OC):</strong> 목적어의 상태나 동작을 뒤에서 보충 설명합니다.<br>\n  <em>예: The news made me happy. (내가 행복해진 것: me = happy)</em></p>\n</div>\n",
    "keyTakeaways": [
      "감각동사(look, smell, taste, sound, feel) 뒤에는 부사가 아닌 '형용사 보어'가 온다.",
      "전치사구(in the room, on the table 등)는 수식어(M)이므로 문장 형식 계산 시 제외한다.",
      "4형식은 '~에게 ~을 주다', 5형식은 '목적어가 ~하게 만들다/부르다'로 구분한다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'The soup smells deliciously.' 이 문장은 왜 틀렸을까요?",
        "answer": "smell은 감각동사(2형식)이므로 뒤에 주격보어로 형용사(delicious)가 와야 합니다. 한국어로 '맛있게'라고 부사처럼 해석되더라도 영어에서는 반드시 형용사를 써야 합니다!"
      },
      {
        "question": "Q. 'He bought me a book.'을 3형식으로 바꾸면 전치사 무엇을 쓸까요?",
        "answer": "buy, make, cook 등 '정성과 노력이 들어가는 동사'는 4형식을 3형식으로 바꿀 때 전치사 for를 씁니다. (He bought a book for me.)"
      }
    ]
  },
  {
    "id": "a2_ch2",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 10,
    "title": "동사의 기본 시제와 진행형",
    "subtitle": "현재, 과거, 미래, 그리고 동작의 진행",
    "icon": "⏰",
    "summary": "영어의 기본 시제는 일상적 사실과 습관을 나타내는 현재, 이미 일어난 사건의 과거, 앞으로 일어날 미래, 그리고 특정 순간 동작이 진행 중임을 나타내는 진행형(be + -ing)으로 나뉩니다.",
    "formulas": [
      {
        "title": "현재 시제 (단순 현재)",
        "formula": "S + V(s/es)",
        "desc": "반복되는 일상, 일반적 진리, 현재의 상태",
        "coreMeaning": "반복되는 일상, 일반적 진리, 현재의 상태. 이 공식은 현재 시제 (단순 현재)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "S + V(s/es)"
          },
          {
            "part": "핵심 역할",
            "desc": "반복되는 일상, 일반적 진리, 현재의 상태"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Water boils at 100 degrees Celsius.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 현재 시제 (단순 현재)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "과거 시제 (단순 과거)",
        "formula": "S + V-ed (불규칙 과거형)",
        "desc": "과거의 특정 시점에 완료된 동작이나 상태",
        "coreMeaning": "과거의 특정 시점에 완료된 동작이나 상태. 이 공식은 과거 시제 (단순 과거)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "S + V-ed (불규칙 과거형)"
          },
          {
            "part": "핵심 역할",
            "desc": "과거의 특정 시점에 완료된 동작이나 상태"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "We visited the art museum yesterday.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 과거 시제 (단순 과거)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "미래 시제 (will / be going to)",
        "formula": "S + will / be going to + V원형",
        "desc": "미래의 계획, 예측, 즉각적 결심",
        "coreMeaning": "미래의 계획, 예측, 즉각적 결심. 이 공식은 미래 시제 (will / be going to)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "S + will / be going to + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "미래의 계획, 예측, 즉각적 결심"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "I will call you when I arrive at the station.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 미래 시제 (will / be going to)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "진행형 시제",
        "formula": "S + be (am/is/are/was/were) + V-ing",
        "desc": "말하는 시점에 동작이 진행 중임을 강조",
        "coreMeaning": "말하는 시점에 동작이 진행 중임을 강조. 이 공식은 진행형 시제의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "S + be (am/is/are/was/were) + V-ing"
          },
          {
            "part": "핵심 역할",
            "desc": "말하는 시점에 동작이 진행 중임을 강조"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "She is writing an English diary right now.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 진행형 시제에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "진행형을 쓸 수 없는 상태 동사",
        "tip": "소유(have, belong), 감정(like, love, hate), 인지/감각(know, believe, see, hear)은 원칙적으로 진행형을 쓰지 않습니다. (I am knowing him ❌ ➔ I know him ⭕)"
      },
      {
        "title": "시간/조건 부사절에서는 현재가 미래를 대신!",
        "tip": "when, if, as soon as 등의 시간/조건 부사절 속에서는 미래 시제 대신 현재 시제를 씁니다. (If it will rain tomorrow ❌ ➔ If it rains tomorrow ⭕)"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "He practices playing the acoustic guitar every evening.",
        "translation": "그는 매일 저녁 통기타 연주를 연습한다. (현재 시제: 반복적 습관)",
        "tokens": [
          {
            "text": "He",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "practices",
            "role": "V",
            "label": "동사(현재 3단칭)"
          },
          {
            "text": "playing the acoustic guitar",
            "role": "O",
            "label": "동명사 목적어"
          },
          {
            "text": "every evening",
            "role": "M",
            "label": "시간 부사구"
          }
        ]
      },
      {
        "sentence": "They were studying science when the phone rang.",
        "translation": "전화가 울렸을 때 그들은 과학을 공부하고 있었다. (과거진행 + 과거)",
        "tokens": [
          {
            "text": "They",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "were studying",
            "role": "V",
            "label": "과거진행형"
          },
          {
            "text": "science",
            "role": "O",
            "label": "목적어"
          },
          {
            "text": "when the phone rang",
            "role": "M",
            "label": "시간 부사절"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_2_m1",
          "question": "다음 빈칸에 들어갈 가장 알맞은 것은?\n\"If it ________ sunny tomorrow, we will go on a picnic.\"",
          "options": [
            "will be",
            "is",
            "was",
            "would be"
          ],
          "answerIndex": 1,
          "explanation": "조건을 나타내는 if 부사절에서는 미래 시제 대신 현재 시제(is)를 사용합니다."
        },
        {
          "id": "a2_2_m2",
          "question": "다음 중 어법상 어색한 문장은?",
          "options": [
            "She is living in Seoul right now.",
            "I am having two smart phones.",
            "Listen! A bird is singing outside.",
            "He was watching TV when I entered."
          ],
          "answerIndex": 1,
          "explanation": "소유를 나타내는 have는 진행형으로 쓸 수 없으므로 I have two smartphones가 맞습니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_2_e1",
          "originalSentence": "I will give this letter to her as soon as she will arrive.",
          "underlineTarget": "will arrive",
          "correctedWord": "arrives",
          "explanation": "as soon as가 이끄는 시간의 부사절에서는 미래 시제 대신 현재 시제(arrives)를 씁니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_2_u1",
          "promptKr": "내가 집에 도착했을 때 그녀는 음악을 듣고 있었다.",
          "words": [
            "She",
            "was",
            "listening",
            "to",
            "music",
            "when",
            "I",
            "arrived",
            "home"
          ],
          "answer": "She was listening to music when I arrived home"
        }
      ],
      "formCloze": [
        {
          "id": "a2_2_c1",
          "sentence": "We ________ (visit) our grandparents in Busan next weekend.",
          "baseWord": "visit",
          "answer": "are going to visit",
          "hint": "예정된 미래 계획 (be going to)",
          "explanation": "이미 계획된 미래를 나타낼 때 be going to visit를 씁니다."
        }
      ]
    },
    "storyMetaphor": "⏰ 동사의 시제는 사건이 벌어진 순간을 알려주는 '시간의 타임스탬프'입니다!",
    "coreExplanation": "\n<h3>💡 왜 영어는 시제를 세밀하게 나눌까요?</h3>\n<p>한국어는 '나 어제 밥 먹어'처럼 현재형으로 과거를 표현하기도 하지만, 영어는 <strong>시간의 위치(과거-현재-미래)</strong>와 <strong>동작의 생생한 진행 여부(-ing)</strong>를 아주 엄격하게 구분합니다.</p>\n\n<div class=\"concept-breakdown-card\">\n  <h4>📌 현재 시제는 '지금 이 순간'만을 뜻하는 것이 아닙니다!</h4>\n  <p>단순 현재 시제(S + V)의 진짜 의미는 <strong>'어제도 그랬고, 오늘도 그러하며, 내일도 그럴 일'</strong>(반복되는 습관, 불변의 진리, 현재의 일반적 사실)을 말할 때 씁니다.<br>\n  <em>예: The sun rises in the east. (태양이 동쪽에서 뜨는 것은 어제도 오늘도 내일도 진리)</em></p>\n  <p>반면, <strong>'지금 당장 눈앞에서 진행 중인 동작'</strong>은 반드시 진행형(be + V-ing)을 써야 합니다.<br>\n  <em>예: Look! It is raining outside. (봐! 지금 밖에서 비가 오고 있어.)</em></p>\n</div>\n",
    "keyTakeaways": [
      "단순 현재는 '늘 반복되는 일/진리', 진행형(be -ing)은 '지금 한창 진행 중인 동작'이다.",
      "소유(have, belong), 감정(like, love), 인지(know, remember) 등 상태 동사는 진행형을 쓰지 않는다.",
      "시간/조건 부사절(when, if, as soon as) 안에서는 미래(will) 대신 현재 시제를 쓴다."
    ],
    "selfChecks": [
      {
        "question": "Q. 'I am having two smartphones.'는 왜 어색한 문장일까요?",
        "answer": "have가 '가지고 있다(소유)'의 뜻일 때는 이미 상태를 나타내므로 진행형을 쓰지 않고 'I have two smartphones'라고 써야 합니다. (단, have가 '먹다/시간을 보내다'일 때는 I am having lunch처럼 진행형 가능!)"
      }
    ]
  },
  {
    "id": "a2_ch3",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 11,
    "title": "조동사의 기본 용법",
    "subtitle": "능력, 허가, 의무, 추측의 뉘앙스 더하기",
    "icon": "🔑",
    "summary": "조동사(can, may, must, should, will)는 본동사 앞에 위치하여 화자의 태도나 가능성, 허가, 의무 등의 뉘앙스를 부여합니다. 조동사 뒤에는 항상 동사 원형이 오는 것이 절대 원칙입니다.",
    "formulas": [
      {
        "title": "can / be able to",
        "formula": "can + V원형",
        "desc": "능력(~할 수 있다), 허가(~해도 좋다), 요청(Can you...?)",
        "coreMeaning": "능력(~할 수 있다), 허가(~해도 좋다), 요청(Can you...?). 이 공식은 can / be able to의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "can + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "능력(~할 수 있다), 허가(~해도 좋다), 요청(Can you...?)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "She can speak three foreign languages fluently.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: can / be able to에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "may / might",
        "formula": "may + V원형",
        "desc": "불확실한 추측(~일지도 모른다), 공손한 허가(May I...?)",
        "coreMeaning": "불확실한 추측(~일지도 모른다), 공손한 허가(May I...?). 이 공식은 may / might의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "may + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "불확실한 추측(~일지도 모른다), 공손한 허가(May I...?)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "It may rain this afternoon, so take an umbrella.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: may / might에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "must / have to",
        "formula": "must + V원형",
        "desc": "강한 의무(~해야만 한다), 강한 확신(~임에 틀림없다)",
        "coreMeaning": "강한 의무(~해야만 한다), 강한 확신(~임에 틀림없다). 이 공식은 must / have to의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "must + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "강한 의무(~해야만 한다), 강한 확신(~임에 틀림없다)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "You must fasten your seatbelt in the car.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: must / have to에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "should / ought to",
        "formula": "should + V원형",
        "desc": "권고, 당연한 도리(~하는 것이 좋다/마땅하다)",
        "coreMeaning": "권고, 당연한 도리(~하는 것이 좋다/마땅하다). 이 공식은 should / ought to의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "should + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "권고, 당연한 도리(~하는 것이 좋다/마땅하다)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "We should respect other people's opinions.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: should / ought to에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "must not vs don't have to 의 차이",
        "tip": "must not은 '~해서는 안 된다(금지)'이며, don't have to는 '~할 필요가 없다(불필요)'입니다. 둘을 혼동하지 않도록 주의하세요!"
      },
      {
        "title": "조동사 연속 사용 금지",
        "tip": "will can (❌) ➔ will be able to (⭕) 형태로 대용 어구를 사용해야 합니다."
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "Students must wear safety goggles in the science laboratory.",
        "translation": "학생들은 과학 실험실에서 보안경을 착용해야만 한다. (강한 의무)",
        "tokens": [
          {
            "text": "Students",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "must wear",
            "role": "V",
            "label": "조동사+동사원형"
          },
          {
            "text": "safety goggles",
            "role": "O",
            "label": "목적어"
          },
          {
            "text": "in the science laboratory",
            "role": "M",
            "label": "장소 부사구"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_3_m1",
          "question": "다음 빈칸에 들어갈 말로 가장 알맞은 것은?\n\"Tomorrow is Sunday, so you ________ get up early.\"",
          "options": [
            "must not",
            "don't have to",
            "cannot",
            "should not"
          ],
          "answerIndex": 1,
          "explanation": "내일이 일요일이므로 일찍 일어날 '필요가 없다'는 의미인 don't have to가 정답입니다."
        },
        {
          "id": "a2_3_m2",
          "question": "다음 중 어법상 올바른 문장은?",
          "options": [
            "He will can swim fast next year.",
            "She must to finish the homework.",
            "They will be able to join our club.",
            "You should not to speak loudly."
          ],
          "answerIndex": 2,
          "explanation": "조동사 will과 can은 나란히 쓸 수 없으므로 will be able to로 고친 3번이 올바릅니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_3_e1",
          "originalSentence": "You must not to touch the wet paint on the wall.",
          "underlineTarget": "not to touch",
          "correctedWord": "not touch",
          "explanation": "조동사 must 뒤에는 to부정사가 아닌 동사 원형(not touch)이 와야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_3_u1",
          "promptKr": "너는 도서관 안에서 큰 소리로 말해서는 안 된다.",
          "words": [
            "You",
            "must",
            "not",
            "speak",
            "loudly",
            "in",
            "the",
            "library"
          ],
          "answer": "You must not speak loudly in the library"
        }
      ],
      "formCloze": [
        {
          "id": "a2_3_c1",
          "sentence": "He ________ (be able to) solve the puzzle after practicing for an hour.",
          "baseWord": "be able to",
          "answer": "was able to",
          "hint": "과거 시점의 능력 발휘",
          "explanation": "과거 시점에서 퍼즐을 풀 수 있었으므로 was able to를 씁니다."
        }
      ]
    },
    "storyMetaphor": "🔑 조동사는 무미건조한 동사에 '말하는 사람의 마음과 색깔(능력, 허가, 확신, 의무)'을 입혀주는 마법의 조미료입니다!",
    "coreExplanation": "\n<h3>💡 조동사(can, may, must, should, will)의 황금 원칙 2가지</h3>\n<ol>\n  <li><strong>조동사 뒤에는 무조건 '동사 원형'이 온다!</strong> (주어가 3인칭 단수여도 -s를 붙이지 않음)</li>\n  <li><strong>조동사는 나란히 2개를 연속해서 쓸 수 없다!</strong> (will can ❌ ➔ will be able to ⭕)</li>\n</ol>\n\n<div class=\"concept-breakdown-card\">\n  <h4>🚨 가장 많이 헷갈리는 must not vs don't have to</h4>\n  <ul>\n    <li><strong>must not:</strong> 절대 해서는 안 된다! (금지 ⛔) ➔ <em>You must not touch it. (손대면 안 돼!)</em></li>\n    <li><strong>don't have to:</strong> 굳이 할 필요가 없다 (불필요 ☕) ➔ <em>You don't have to come early. (일찍 올 필요 없어.)</em></li>\n  </ul>\n</div>\n",
    "keyTakeaways": [
      "조동사 뒤는 항상 동사 원형!",
      "must not(강한 금지: ~하면 안 됨)과 don't have to(불필요: ~할 필요 없음)를 구별하자.",
      "조동사 2개 연속 사용 불가 (will can ❌ ➔ will be able to ⭕)."
    ],
    "selfChecks": [
      {
        "question": "Q. '내일은 휴일이라 학교에 갈 필요가 없다'는 must not일까요, don't have to일까요?",
        "answer": "의무가 없는 불필요의 상황이므로 don't have to를 써야 합니다. (You don't have to go to school tomorrow.)"
      }
    ]
  },
  {
    "id": "a2_ch4",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 12,
    "title": "명사와 대명사의 기초",
    "subtitle": "셀 수 있는 명사, 셀 수 없는 명사, 그리고 대명사",
    "icon": "📦",
    "summary": "명사는 셀 수 있는 명사(가산)와 셀 수 없는 명사(불가산)로 나뉘며, 수량 형용사(many/much, a few/a little)의 수식을 받습니다. 대명사는 지시대명사, 부정대명사(one, some, any), 재귀대명사(-self) 등이 있습니다.",
    "formulas": [
      {
        "title": "가산명사 수량 표현",
        "formula": "many / (a) few + 복수명사",
        "desc": "a few는 약간 있는(긍정), few는 거의 없는(부정)",
        "coreMeaning": "a few는 약간 있는(긍정), few는 거의 없는(부정). 이 공식은 가산명사 수량 표현의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "many / (a) few + 복수명사"
          },
          {
            "part": "핵심 역할",
            "desc": "a few는 약간 있는(긍정), few는 거의 없는(부정)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "She has a few close friends in town.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 가산명사 수량 표현에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "불가산명사 수량 표현",
        "formula": "much / (a) little + 단수명사",
        "desc": "a little은 약간 있는(긍정), little은 거의 없는(부정)",
        "coreMeaning": "a little은 약간 있는(긍정), little은 거의 없는(부정). 이 공식은 불가산명사 수량 표현의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "much / (a) little + 단수명사"
          },
          {
            "part": "핵심 역할",
            "desc": "a little은 약간 있는(긍정), little은 거의 없는(부정)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "There is little water left in the bottle.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 불가산명사 수량 표현에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "부정대명사 one vs it",
        "formula": "one (동종 불특정) vs it (앞의 바로 그것)",
        "desc": "I lost my pen, so I need to buy one(아무 펜) / I found it(잃어버린 그 펜).",
        "coreMeaning": "I lost my pen, so I need to buy one(아무 펜) / I found it(잃어버린 그 펜).. 이 공식은 부정대명사 one vs it의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "one (동종 불특정) vs it (앞의 바로 그것)"
          },
          {
            "part": "핵심 역할",
            "desc": "I lost my pen, so I need to buy one(아무 펜) / I found it(잃어버린 그 펜)."
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "This bag is old; I want a new one.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 부정대명사 one vs it에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "재귀대명사 (-self)",
        "formula": "S = O 일 때 목적어 자리에 -self 사용",
        "desc": "재귀용법(생략 불가)과 강조용법(생략 가능)",
        "coreMeaning": "재귀용법(생략 불가)과 강조용법(생략 가능). 이 공식은 재귀대명사 (-self)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "S = O 일 때 목적어 자리에 -self 사용"
          },
          {
            "part": "핵심 역할",
            "desc": "재귀용법(생략 불가)과 강조용법(생략 가능)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "He looked at himself in the mirror.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 재귀대명사 (-self)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "대표적 불가산 명사 암기",
        "tip": "furniture, information, advice, baggage, homework, news, water 등은 복수형(-s)이나 부정관사(a/an)를 붙이지 않습니다."
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "The wise teacher gave me some helpful advice yesterday.",
        "translation": "지혜로운 선생님께서 어제 내게 몇 가지 유용한 조언을 해주셨다.",
        "tokens": [
          {
            "text": "The wise teacher",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "gave",
            "role": "V",
            "label": "수여동사"
          },
          {
            "text": "me",
            "role": "IO",
            "label": "간접목적어"
          },
          {
            "text": "some helpful advice",
            "role": "DO",
            "label": "직접목적어(불가산)"
          },
          {
            "text": "yesterday",
            "role": "M",
            "label": "시간 부사"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_4_m1",
          "question": "다음 빈칸에 들어갈 말로 가장 알맞은 것은?\n\"I am thirsty, but there is ________ water left in the fridge.\"",
          "options": [
            "few",
            "a few",
            "little",
            "a little"
          ],
          "answerIndex": 2,
          "explanation": "water는 불가산 명사이며, 목이 마른데 물이 '거의 없다'는 부정 의미이므로 little이 정답입니다."
        },
        {
          "id": "a2_4_m2",
          "question": "다음 중 어법상 올바른 문장은?",
          "options": [
            "He gave me many useful advices.",
            "She bought a new furniture yesterday.",
            "I have a lot of homework to do tonight.",
            "The news are very shocking to all."
          ],
          "answerIndex": 2,
          "explanation": "homework는 셀 수 없는 명사이므로 a lot of homework 형태가 맞습니다. advice, furniture는 단수형, news는 단수 취급합니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_4_e1",
          "originalSentence": "Could you give me some informations about the city tour?",
          "underlineTarget": "informations",
          "correctedWord": "information",
          "explanation": "information은 셀 수 없는 명사이므로 복수형 -s를 붙이지 않습니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_4_u1",
          "promptKr": "그는 거울 속에 비친 자기 자신을 보았다.",
          "words": [
            "He",
            "looked",
            "at",
            "himself",
            "in",
            "the",
            "clean",
            "mirror"
          ],
          "answer": "He looked at himself in the clean mirror"
        }
      ],
      "formCloze": [
        {
          "id": "a2_4_c1",
          "sentence": "The children prepared the delicious sandwiches by ________ (them).",
          "baseWord": "them",
          "answer": "themselves",
          "hint": "재귀대명사 (스스로, 혼자 힘으로 = by oneself)",
          "explanation": "by oneself 구문에서 주어가 The children(3인칭 복수)이므로 themselves가 정답입니다."
        }
      ]
    },
    "storyMetaphor": "💡 명사와 대명사의 기초의 핵심 원리를 실생활 비유와 함께 직관적으로 마스터합니다!",
    "coreExplanation": "\n<h3>💡 명사와 대명사의 기초 완벽 마스터하기</h3>\n<p>명사는 셀 수 있는 명사(가산)와 셀 수 없는 명사(불가산)로 나뉘며, 수량 형용사(many/much, a few/a little)의 수식을 받습니다. 대명사는 지시대명사, 부정대명사(one, some, any), 재귀대명사(-self) 등이 있습니다.</p>\n<div class=\"concept-breakdown-card\">\n  <h4>📌 핵심 원리 및 구조 분석</h4>\n  <p>이 단원에서는 <strong>셀 수 있는 명사, 셀 수 없는 명사, 그리고 대명사</strong>의 핵심 메커니즘을 다룹니다. 공식의 기계적 암기가 아니라, 왜 이 어형이 쓰이는지 문맥 속 논리를 이해하는 것이 고득점의 비결입니다.</p>\n</div>\n",
    "keyTakeaways": [
      "명사와 대명사의 기초의 기본 어순과 핵심 공식을 정확히 숙지한다.",
      "시험에 자주 출제되는 오답 함정 포인트와 예외 규칙을 점검한다.",
      "실전 훈련 문제에 적용하여 정확성과 속도를 동시에 끌어올린다."
    ],
    "selfChecks": [
      {
        "question": "Q. 명사와 대명사의 기초에서 가장 유의해야 할 문법적 핵심은 무엇일까요?",
        "answer": "furniture, information, advice, baggage, homework, news, water 등은 복수형(-s)이나 부정관사(a/an)를 붙이지 않습니다."
      }
    ]
  },
  {
    "id": "a2_ch5",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 13,
    "title": "형용사와 부사, 비교 구문",
    "subtitle": "성질을 묘사하고 차이를 비교하는 방법",
    "icon": "⚖️",
    "summary": "형용사는 명사를 수식하거나 보어로 쓰이며, 부사는 동사·형용사·다른 부사·문장 전체를 수식합니다. 비교 구문에는 원급(as ~ as), 비교급(~er / more ~ than), 최상급(the ~est / most ~)이 있습니다.",
    "formulas": [
      {
        "title": "원급 비교 (as ~ as)",
        "formula": "as + 원급(형용사/부사) + as",
        "desc": "~만큼 ~한/하게 (부정형: not as/so ~ as)",
        "coreMeaning": "~만큼 ~한/하게 (부정형: not as/so ~ as). 이 공식은 원급 비교 (as ~ as)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "as + 원급(형용사/부사) + as"
          },
          {
            "part": "핵심 역할",
            "desc": "~만큼 ~한/하게 (부정형: not as/so ~ as)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "He runs as fast as a professional athlete.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 원급 비교 (as ~ as)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "비교급 비교 (more / -er than)",
        "formula": "비교급 + than",
        "desc": "~보다 더 ~한/하게",
        "coreMeaning": "~보다 더 ~한/하게. 이 공식은 비교급 비교 (more / -er than)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "비교급 + than"
          },
          {
            "part": "핵심 역할",
            "desc": "~보다 더 ~한/하게"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Health is much more important than wealth.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 비교급 비교 (more / -er than)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "비교급 강조 부사",
        "formula": "much / even / far / still / a lot + 비교급",
        "desc": "'훨씬'의 의미로 비교급 수식 (very는 비교급 수식 불가!)",
        "coreMeaning": "'훨씬'의 의미로 비교급 수식 (very는 비교급 수식 불가!). 이 공식은 비교급 강조 부사의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "much / even / far / still / a lot + 비교급"
          },
          {
            "part": "핵심 역할",
            "desc": "'훨씬'의 의미로 비교급 수식 (very는 비교급 수식 불가!)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "This problem is much easier than that one.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 비교급 강조 부사에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "최상급 비교 (the -est / most)",
        "formula": "the + 최상급 + in (장소/집단) / of (복수명사)",
        "desc": "가장 ~한/하게",
        "coreMeaning": "가장 ~한/하게. 이 공식은 최상급 비교 (the -est / most)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "the + 최상급 + in (장소/집단) / of (복수명사)"
          },
          {
            "part": "핵심 역할",
            "desc": "가장 ~한/하게"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Mount Everest is the highest mountain in the world.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 최상급 비교 (the -est / most)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "very vs much 비교급 수식 함정",
        "tip": "very는 원급 형용사/부사만 수식하며, 비교급 앞에는 절대로 쓸 수 없습니다. (very taller ❌ ➔ much/even taller ⭕)"
      },
      {
        "title": "The + 비교급, the + 비교급",
        "tip": "'~하면 할수록 더 ~하다' 구문으로 독해와 영작에 매우 빈출됩니다. (The more you read, the wiser you become.)"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "Learning English is much easier when you practice daily.",
        "translation": "매일 연습할 때 영어를 배우는 것은 훨씬 더 쉽다.",
        "tokens": [
          {
            "text": "Learning English",
            "role": "S",
            "label": "동명사 주어"
          },
          {
            "text": "is",
            "role": "V",
            "label": "동사"
          },
          {
            "text": "much easier",
            "role": "C",
            "label": "비교급 강조 보어"
          },
          {
            "text": "when you practice daily",
            "role": "M",
            "label": "조건/시간 부사절"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_5_m1",
          "question": "다음 빈칸에 들어갈 수 없는 단어는?\n\"This smartphone is ________ faster than my previous model.\"",
          "options": [
            "much",
            "even",
            "very",
            "far"
          ],
          "answerIndex": 2,
          "explanation": "very는 비교급(faster)을 수식할 수 없으며, much, even, far, still, a lot만이 비교급을 강조합니다."
        },
        {
          "id": "a2_5_m2",
          "question": "다음 문장의 빈칸에 들어갈 가장 알맞은 것은?\n\"The more you exercise regularly, ________ you will feel.\"",
          "options": [
            "healthy",
            "the healthier",
            "the healthiest",
            "more healthy"
          ],
          "answerIndex": 1,
          "explanation": "'The + 비교급, the + 비교급' 구문이므로 the healthier가 정답입니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_5_e1",
          "originalSentence": "She is very taller than any other student in her class.",
          "underlineTarget": "very",
          "correctedWord": "much",
          "explanation": "비교급 taller 앞에는 very 대신 much, even, far 등을 사용해야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_5_u1",
          "promptKr": "건강은 돈보다 훨씬 더 소중하다.",
          "words": [
            "Health",
            "is",
            "much",
            "more",
            "valuable",
            "than",
            "money"
          ],
          "answer": "Health is much more valuable than money"
        }
      ],
      "formCloze": [
        {
          "id": "a2_5_c1",
          "sentence": "Jupiter is the ________ (large) planet in our solar system.",
          "baseWord": "large",
          "answer": "largest",
          "hint": "the 뒤의 최상급 형태",
          "explanation": "태양계에서 '가장 큰' 행성이므로 최상급 largest가 알맞습니다."
        }
      ]
    },
    "storyMetaphor": "💡 형용사와 부사, 비교 구문의 핵심 원리를 실생활 비유와 함께 직관적으로 마스터합니다!",
    "coreExplanation": "\n<h3>💡 형용사와 부사, 비교 구문 완벽 마스터하기</h3>\n<p>형용사는 명사를 수식하거나 보어로 쓰이며, 부사는 동사·형용사·다른 부사·문장 전체를 수식합니다. 비교 구문에는 원급(as ~ as), 비교급(~er / more ~ than), 최상급(the ~est / most ~)이 있습니다.</p>\n<div class=\"concept-breakdown-card\">\n  <h4>📌 핵심 원리 및 구조 분석</h4>\n  <p>이 단원에서는 <strong>성질을 묘사하고 차이를 비교하는 방법</strong>의 핵심 메커니즘을 다룹니다. 공식의 기계적 암기가 아니라, 왜 이 어형이 쓰이는지 문맥 속 논리를 이해하는 것이 고득점의 비결입니다.</p>\n</div>\n",
    "keyTakeaways": [
      "형용사와 부사, 비교 구문의 기본 어순과 핵심 공식을 정확히 숙지한다.",
      "시험에 자주 출제되는 오답 함정 포인트와 예외 규칙을 점검한다.",
      "실전 훈련 문제에 적용하여 정확성과 속도를 동시에 끌어올린다."
    ],
    "selfChecks": [
      {
        "question": "Q. 형용사와 부사, 비교 구문에서 가장 유의해야 할 문법적 핵심은 무엇일까요?",
        "answer": "very는 원급 형용사/부사만 수식하며, 비교급 앞에는 절대로 쓸 수 없습니다. (very taller ❌ ➔ much/even taller ⭕)"
      }
    ]
  },
  {
    "id": "a2_ch6",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 14,
    "title": "to부정사의 기초 용법",
    "subtitle": "명사, 형용사, 부사처럼 쓰이는 만능 준동사",
    "icon": "🌱",
    "summary": "to부정사(to + 동사원형)는 동사의 성질을 유지하면서 문장에서 명사(주어, 목적어, 보어), 형용사(명사 수식), 부사(목적, 원인, 결과) 역할을 자유롭게 수행합니다.",
    "formulas": [
      {
        "title": "명사적 용법",
        "formula": "to + V원형 (주어/목적어/보어)",
        "desc": "'~하는 것, ~하기'로 해석 (want, hope, plan, decide + to V)",
        "coreMeaning": "'~하는 것, ~하기'로 해석 (want, hope, plan, decide + to V). 이 공식은 명사적 용법의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "to + V원형 (주어/목적어/보어)"
          },
          {
            "part": "핵심 역할",
            "desc": "'~하는 것, ~하기'로 해석 (want, hope, plan, decide + to V)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "She decided to study abroad next year.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 명사적 용법에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "형용사적 용법",
        "formula": "명사 + to + V원형",
        "desc": "'~할, ~하는'으로 앞의 명사 수식",
        "coreMeaning": "'~할, ~하는'으로 앞의 명사 수식. 이 공식은 형용사적 용법의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "명사 + to + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "'~할, ~하는'으로 앞의 명사 수식"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "I have a lot of homework to finish tonight.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 형용사적 용법에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "부사적 용법 (목적)",
        "formula": "to + V원형 (= in order to / so as to)",
        "desc": "'~하기 위하여'로 동사의 목적을 설명",
        "coreMeaning": "'~하기 위하여'로 동사의 목적을 설명. 이 공식은 부사적 용법 (목적)의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "to + V원형 (= in order to / so as to)"
          },
          {
            "part": "핵심 역할",
            "desc": "'~하기 위하여'로 동사의 목적을 설명"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "He got up early to catch the first train.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 부사적 용법 (목적)에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "가주어 it - 진주어 to V",
        "formula": "It is + 형용사 + to + V원형",
        "desc": "긴 to부정사 주어 대신 it을 쓰고 to V를 뒤로 보냄",
        "coreMeaning": "긴 to부정사 주어 대신 it을 쓰고 to V를 뒤로 보냄. 이 공식은 가주어 it - 진주어 to V의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "It is + 형용사 + to + V원형"
          },
          {
            "part": "핵심 역할",
            "desc": "긴 to부정사 주어 대신 it을 쓰고 to V를 뒤로 보냄"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "It is important to brush your teeth twice a day.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 가주어 it - 진주어 to V에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "형용사적 용법 뒤 전치사 누락 주의!",
        "tip": "a chair to sit on (⭕), a house to live in (⭕), a pen to write with (⭕) 처럼 자동사 뒤에 전치사가 반드시 필요합니다."
      },
      {
        "title": "to부정사만 목적어로 취하는 동사",
        "tip": "want, hope, wish, expect, decide, plan, promise, refuse 등은 to부정사를 목적어로 취합니다."
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "He went to the public library to borrow science books.",
        "translation": "그는 과학책을 빌리기 위해 공공 도서관에 갔다. (부사적 용법: 목적)",
        "tokens": [
          {
            "text": "He",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "went",
            "role": "V",
            "label": "동사"
          },
          {
            "text": "to the public library",
            "role": "M",
            "label": "장소 부사구"
          },
          {
            "text": "to borrow science books",
            "role": "M",
            "label": "to부정사 목적 부사구"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_6_m1",
          "question": "다음 밑줄 친 to부정사의 용법이 나머지와 다른 것은?",
          "options": [
            "I want to become a famous scientist.",
            "To speak English well requires practice.",
            "He bought some flowers to give his mother.",
            "My dream is to travel around the world."
          ],
          "answerIndex": 2,
          "explanation": "1, 2, 4번은 명사적 용법(목적어, 주어, 보어)이며, 3번은 부사적 용법(목적: 주기 위해)입니다."
        },
        {
          "id": "a2_6_m2",
          "question": "다음 중 어법상 올바른 문장은?",
          "options": [
            "I need a comfortable chair to sit.",
            "She has no friend to talk with.",
            "He refused helping his brother.",
            "It is easy speak English fluently."
          ],
          "answerIndex": 1,
          "explanation": "talk with someone 구조이므로 전치사 with가 포함된 2번이 올바릅니다. (1번은 sit on 필요)"
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_6_e1",
          "originalSentence": "She bought a piece of paper to write on it.",
          "underlineTarget": "write on it",
          "correctedWord": "write on",
          "explanation": "형용사적 용법에서는 수식받는 명사(paper)가 전치사의 목적어 역할을 이미 하므로 it을 중복해서 쓰지 않습니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_6_u1",
          "promptKr": "외국어를 배우는 것은 매우 흥미롭다.",
          "words": [
            "It",
            "is",
            "very",
            "interesting",
            "to",
            "learn",
            "a",
            "foreign",
            "language"
          ],
          "answer": "It is very interesting to learn a foreign language"
        }
      ],
      "formCloze": [
        {
          "id": "a2_6_c1",
          "sentence": "They decided ________ (cancel) the outdoor concert due to heavy rain.",
          "baseWord": "cancel",
          "answer": "to cancel",
          "hint": "decide 뒤 목적어 형태",
          "explanation": "decide는 to부정사만을 목적어로 취하는 동사입니다."
        }
      ]
    },
    "storyMetaphor": "💡 to부정사의 기초 용법의 핵심 원리를 실생활 비유와 함께 직관적으로 마스터합니다!",
    "coreExplanation": "\n<h3>💡 to부정사의 기초 용법 완벽 마스터하기</h3>\n<p>to부정사(to + 동사원형)는 동사의 성질을 유지하면서 문장에서 명사(주어, 목적어, 보어), 형용사(명사 수식), 부사(목적, 원인, 결과) 역할을 자유롭게 수행합니다.</p>\n<div class=\"concept-breakdown-card\">\n  <h4>📌 핵심 원리 및 구조 분석</h4>\n  <p>이 단원에서는 <strong>명사, 형용사, 부사처럼 쓰이는 만능 준동사</strong>의 핵심 메커니즘을 다룹니다. 공식의 기계적 암기가 아니라, 왜 이 어형이 쓰이는지 문맥 속 논리를 이해하는 것이 고득점의 비결입니다.</p>\n</div>\n",
    "keyTakeaways": [
      "to부정사의 기초 용법의 기본 어순과 핵심 공식을 정확히 숙지한다.",
      "시험에 자주 출제되는 오답 함정 포인트와 예외 규칙을 점검한다.",
      "실전 훈련 문제에 적용하여 정확성과 속도를 동시에 끌어올린다."
    ],
    "selfChecks": [
      {
        "question": "Q. to부정사의 기초 용법에서 가장 유의해야 할 문법적 핵심은 무엇일까요?",
        "answer": "a chair to sit on (⭕), a house to live in (⭕), a pen to write with (⭕) 처럼 자동사 뒤에 전치사가 반드시 필요합니다."
      }
    ]
  },
  {
    "id": "a2_ch7",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 15,
    "title": "동명사의 기초와 준동사 선택",
    "subtitle": "동사가 명사로 변신할 때와 to부정사와의 차이",
    "icon": "🔄",
    "summary": "동명사(V-ing)는 동사의 의미를 지닌 채 명사처럼 주어, 목적어, 보어로 쓰입니다. 특히 전치사 뒤에는 반드시 동명사가 오며, 특정 동사는 동명사만을 목적어로 취합니다.",
    "formulas": [
      {
        "title": "동명사의 역할",
        "formula": "V-ing (주어/목적어/보어/전치사의 목적어)",
        "desc": "'~하는 것'으로 해석되며 단수 취급",
        "coreMeaning": "'~하는 것'으로 해석되며 단수 취급. 이 공식은 동명사의 역할의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "V-ing (주어/목적어/보어/전치사의 목적어)"
          },
          {
            "part": "핵심 역할",
            "desc": "'~하는 것'으로 해석되며 단수 취급"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Swimming in the cool pool is refreshing.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 동명사의 역할에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "동명사만 목적어로 취하는 동사",
        "formula": "enjoy, finish, mind, avoid, give up, stop, practice + V-ing",
        "desc": "MEGAFPS(Mind, Enjoy, Give up, Avoid, Finish, Practice, Stop)",
        "coreMeaning": "MEGAFPS(Mind, Enjoy, Give up, Avoid, Finish, Practice, Stop). 이 공식은 동명사만 목적어로 취하는 동사의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "enjoy, finish, mind, avoid, give up, stop, practice + V-ing"
          },
          {
            "part": "핵심 역할",
            "desc": "MEGAFPS(Mind, Enjoy, Give up, Avoid, Finish, Practice, Stop)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "She finished writing her research report.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 동명사만 목적어로 취하는 동사에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "to부정사와 동명사 둘 다 취하지만 의미가 다른 동사",
        "formula": "remember / forget / try / stop",
        "desc": "to V는 미래/할 일, V-ing는 과거/했던 일",
        "coreMeaning": "to V는 미래/할 일, V-ing는 과거/했던 일. 이 공식은 to부정사와 동명사 둘 다 취하지만 의미가 다른 동사의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "remember / forget / try / stop"
          },
          {
            "part": "핵심 역할",
            "desc": "to V는 미래/할 일, V-ing는 과거/했던 일"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Remember to lock the door (잠글 것을 기억해) vs Remember locking the door (잠갔던 것을 기억해)",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: to부정사와 동명사 둘 다 취하지만 의미가 다른 동사에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "전치사 + 동명사",
        "formula": "전치사(in, on, at, about, for, of, without) + V-ing",
        "desc": "전치사 뒤에는 to부정사를 쓸 수 없고 동명사만 가능",
        "coreMeaning": "전치사 뒤에는 to부정사를 쓸 수 없고 동명사만 가능. 이 공식은 전치사 + 동명사의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "전치사(in, on, at, about, for, of, without) + V-ing"
          },
          {
            "part": "핵심 역할",
            "desc": "전치사 뒤에는 to부정사를 쓸 수 없고 동명사만 가능"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Thank you for helping me with the project.",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 전치사 + 동명사에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "stop to V vs stop V-ing 구별",
        "tip": "stop to V는 '~하기 위해 멈추다(to V는 부사적 용법)', stop V-ing는 '~하던 것을 그만두다'입니다."
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "She is interested in learning traditional Korean cooking.",
        "translation": "그녀는 한국 전통 요리를 배우는 것에 관심이 있다. (전치사의 목적어)",
        "tokens": [
          {
            "text": "She",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "is",
            "role": "V",
            "label": "동사"
          },
          {
            "text": "interested",
            "role": "C",
            "label": "보어"
          },
          {
            "text": "in learning traditional Korean cooking",
            "role": "M",
            "label": "전치사구(전치사+동명사)"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_7_m1",
          "question": "다음 빈칸에 들어갈 가장 알맞은 것은?\n\"He gave up ________ the marathon because of his knee injury.\"",
          "options": [
            "to run",
            "running",
            "ran",
            "run"
          ],
          "answerIndex": 1,
          "explanation": "give up은 동명사만을 목적어로 취하는 동사이므로 running이 정답입니다."
        },
        {
          "id": "a2_7_m2",
          "question": "다음 중 두 문장의 의미가 같은 것은?",
          "options": [
            "I stopped to smoke. = I stopped smoking.",
            "Remember to buy milk. = Remember buying milk.",
            "She started to cry. = She started crying.",
            "He tried to move the stone. = He tried moving the stone."
          ],
          "answerIndex": 2,
          "explanation": "start, begin, like, love, hate 등은 to부정사와 동명사 둘 다 목적어로 취하며 의미 차이가 없습니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_7_e1",
          "originalSentence": "He left the classroom without to say goodbye to anyone.",
          "underlineTarget": "without to say",
          "correctedWord": "without saying",
          "explanation": "전치사 without 뒤에는 to부정사가 올 수 없으며, 동명사 saying을 써야 합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_7_u1",
          "promptKr": "그는 문을 잠갔던 것을 잊어버리고 다시 확인했다.",
          "words": [
            "He",
            "forgot",
            "locking",
            "the",
            "front",
            "door",
            "and",
            "checked",
            "again"
          ],
          "answer": "He forgot locking the front door and checked again"
        }
      ],
      "formCloze": [
        {
          "id": "a2_7_c1",
          "sentence": "Don't forget ________ (turn) off the lights before going out.",
          "baseWord": "turn",
          "answer": "to turn",
          "hint": "앞으로 외출할 때 '꺼야 할 것'을 잊지 말라는 의미",
          "explanation": "미래에 해야 할 일을 잊지 말라고 할 때는 forget to V를 씁니다."
        }
      ]
    },
    "storyMetaphor": "💡 동명사의 기초와 준동사 선택의 핵심 원리를 실생활 비유와 함께 직관적으로 마스터합니다!",
    "coreExplanation": "\n<h3>💡 동명사의 기초와 준동사 선택 완벽 마스터하기</h3>\n<p>동명사(V-ing)는 동사의 의미를 지닌 채 명사처럼 주어, 목적어, 보어로 쓰입니다. 특히 전치사 뒤에는 반드시 동명사가 오며, 특정 동사는 동명사만을 목적어로 취합니다.</p>\n<div class=\"concept-breakdown-card\">\n  <h4>📌 핵심 원리 및 구조 분석</h4>\n  <p>이 단원에서는 <strong>동사가 명사로 변신할 때와 to부정사와의 차이</strong>의 핵심 메커니즘을 다룹니다. 공식의 기계적 암기가 아니라, 왜 이 어형이 쓰이는지 문맥 속 논리를 이해하는 것이 고득점의 비결입니다.</p>\n</div>\n",
    "keyTakeaways": [
      "동명사의 기초와 준동사 선택의 기본 어순과 핵심 공식을 정확히 숙지한다.",
      "시험에 자주 출제되는 오답 함정 포인트와 예외 규칙을 점검한다.",
      "실전 훈련 문제에 적용하여 정확성과 속도를 동시에 끌어올린다."
    ],
    "selfChecks": [
      {
        "question": "Q. 동명사의 기초와 준동사 선택에서 가장 유의해야 할 문법적 핵심은 무엇일까요?",
        "answer": "stop to V는 '~하기 위해 멈추다(to V는 부사적 용법)', stop V-ing는 '~하던 것을 그만두다'입니다."
      }
    ]
  },
  {
    "id": "a2_ch8",
    "level": 2,
    "levelCode": "A2",
    "chapterNum": 16,
    "title": "의문문, 부정문, 부가의문문",
    "subtitle": "다양한 문장 형태와 되물어 확인하는 화법",
    "icon": "❓",
    "summary": "의문문은 be동사/조동사 의문문, 일반동사 do/does/did 의문문, 의문사(who, what, when, where, why, how) 의문문으로 나뉩니다. 상대방에게 동의나 확인을 구할 때 문장 끝에 붙이는 부가의문문의 규칙을 익힙니다.",
    "formulas": [
      {
        "title": "일반 의문문 어순",
        "formula": "Do/Does/Did + S + V원형 ~?",
        "desc": "일반동사 의문문 구조",
        "coreMeaning": "일반동사 의문문 구조. 이 공식은 일반 의문문 어순의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "Do/Does/Did + S + V원형 ~?"
          },
          {
            "part": "핵심 역할",
            "desc": "일반동사 의문문 구조"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Did you finish the science assignment?",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 일반 의문문 어순에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "의문사 의문문 어순",
        "formula": "의문사 + (be/조동사/do) + S + V ~?",
        "desc": "구체적 정보를 묻는 의문문 (Yes/No로 답하지 않음)",
        "coreMeaning": "구체적 정보를 묻는 의문문 (Yes/No로 답하지 않음). 이 공식은 의문사 의문문 어순의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "의문사 + (be/조동사/do) + S + V ~?"
          },
          {
            "part": "핵심 역할",
            "desc": "구체적 정보를 묻는 의문문 (Yes/No로 답하지 않음)"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Where did you buy that lovely backpack?",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 의문사 의문문 어순에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "부가의문문 기본 원칙",
        "formula": "긍정문, 부정 부가의문문? / 부정문, 긍정 부가의문문?",
        "desc": "앞 문장의 동사 종류(be/조동사/일반)와 시제·인칭에 일치",
        "coreMeaning": "앞 문장의 동사 종류(be/조동사/일반)와 시제·인칭에 일치. 이 공식은 부가의문문 기본 원칙의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "긍정문, 부정 부가의문문? / 부정문, 긍정 부가의문문?"
          },
          {
            "part": "핵심 역할",
            "desc": "앞 문장의 동사 종류(be/조동사/일반)와 시제·인칭에 일치"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "You are a new student here, aren't you?",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 부가의문문 기본 원칙에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      },
      {
        "title": "명령문과 제안문의 부가의문문",
        "formula": "명령문, will you? / Let's ~, shall we?",
        "desc": "특수 부가의문문 형태",
        "coreMeaning": "특수 부가의문문 형태. 이 공식은 명령문과 제안문의 부가의문문의 핵심 규칙으로, 문장의 통사적 골격을 정확하게 구성하고 해석하는 핵심 뼈대입니다. 문맥 속에서 어형 변화와 수일치에 유의하며 학습해야 합니다.",
        "components": [
          {
            "part": "구조 공식",
            "desc": "명령문, will you? / Let's ~, shall we?"
          },
          {
            "part": "핵심 역할",
            "desc": "특수 부가의문문 형태"
          }
        ],
        "usageTip": "문장에서 해당 문법 요소의 위치와 앞뒤 연결 관계를 파악하고, 직독직해 방식으로 의미 단위를 끊어 읽는 훈련을 진행하세요.",
        "examples": [
          {
            "en": "Close the window, will you? / Let's take a break, shall we?",
            "kr": "핵심 대표 예문",
            "note": "공식 적용 분석"
          }
        ],
        "commonTrap": "🚨 실전 포인트: 명령문과 제안문의 부가의문문에서 자주 혼동되는 형태나 전치사 결합, 어순을 점검하세요."
      }
    ],
    "pitfalls": [
      {
        "title": "부정의문문 대답 주의 (한국어와 반대!)",
        "tip": "Didn't you eat lunch? 질문에 밥을 먹었으면 무조건 Yes, I did. 안 먹었으면 No, I didn't. (Yes/No는 사실 여부에만 따름)"
      }
    ],
    "syntaxExamples": [
      {
        "sentence": "Your older brother can play the piano very well, can't he?",
        "translation": "네 형은 피아노를 아주 잘 칠 수 있지, 그렇지 않니? (부가의문문)",
        "tokens": [
          {
            "text": "Your older brother",
            "role": "S",
            "label": "주어"
          },
          {
            "text": "can play",
            "role": "V",
            "label": "조동사 긍정문"
          },
          {
            "text": "the piano",
            "role": "O",
            "label": "목적어"
          },
          {
            "text": "can't he",
            "role": "M",
            "label": "부정 부가의문문"
          }
        ]
      }
    ],
    "exercises": {
      "mcq": [
        {
          "id": "a2_8_m1",
          "question": "다음 대화의 빈칸에 들어갈 말로 가장 알맞은 것은?\nA: \"Didn't you bring your umbrella today?\"\nB: \"________. I have it in my backpack.\"",
          "options": [
            "No, I didn't",
            "Yes, I did",
            "No, I did",
            "Yes, I didn't"
          ],
          "answerIndex": 1,
          "explanation": "실제로 우산을 가지고 있으므로 긍정의 대답인 Yes, I did가 정답입니다."
        },
        {
          "id": "a2_8_m2",
          "question": "다음 문장의 빈칸에 들어갈 알맞은 부가의문문은?\n\"She plays the violin beautifully, ________?\"",
          "options": [
            "doesn't she",
            "isn't she",
            "does she",
            "is she"
          ],
          "answerIndex": 0,
          "explanation": "앞 문장이 일반동사 현재형 긍정(plays)이므로 doesn't she가 맞습니다."
        }
      ],
      "errorCorrection": [
        {
          "id": "a2_8_e1",
          "originalSentence": "Let's go to the library together, will you?",
          "underlineTarget": "will you",
          "correctedWord": "shall we",
          "explanation": "Let's로 시작하는 제안문의 부가의문문은 shall we?를 사용합니다."
        }
      ],
      "unscramble": [
        {
          "id": "a2_8_u1",
          "promptKr": "그들은 어제 그 흥미로운 영화를 보지 않았니?",
          "words": [
            "Didn't",
            "they",
            "watch",
            "the",
            "interesting",
            "movie",
            "yesterday"
          ],
          "answer": "Didn't they watch the interesting movie yesterday"
        }
      ],
      "formCloze": [
        {
          "id": "a2_8_c1",
          "sentence": "You haven't visited Jeju Island yet, ________ (have) you?",
          "baseWord": "have",
          "answer": "have",
          "hint": "부정문 뒤의 긍정 부가의문문",
          "explanation": "앞 문장이 haven't(현재완료 부정)이므로 부가의문문은 긍정형 have you?가 됩니다."
        }
      ]
    },
    "storyMetaphor": "💡 의문문, 부정문, 부가의문문의 핵심 원리를 실생활 비유와 함께 직관적으로 마스터합니다!",
    "coreExplanation": "\n<h3>💡 의문문, 부정문, 부가의문문 완벽 마스터하기</h3>\n<p>의문문은 be동사/조동사 의문문, 일반동사 do/does/did 의문문, 의문사(who, what, when, where, why, how) 의문문으로 나뉩니다. 상대방에게 동의나 확인을 구할 때 문장 끝에 붙이는 부가의문문의 규칙을 익힙니다.</p>\n<div class=\"concept-breakdown-card\">\n  <h4>📌 핵심 원리 및 구조 분석</h4>\n  <p>이 단원에서는 <strong>다양한 문장 형태와 되물어 확인하는 화법</strong>의 핵심 메커니즘을 다룹니다. 공식의 기계적 암기가 아니라, 왜 이 어형이 쓰이는지 문맥 속 논리를 이해하는 것이 고득점의 비결입니다.</p>\n</div>\n",
    "keyTakeaways": [
      "의문문, 부정문, 부가의문문의 기본 어순과 핵심 공식을 정확히 숙지한다.",
      "시험에 자주 출제되는 오답 함정 포인트와 예외 규칙을 점검한다.",
      "실전 훈련 문제에 적용하여 정확성과 속도를 동시에 끌어올린다."
    ],
    "selfChecks": [
      {
        "question": "Q. 의문문, 부정문, 부가의문문에서 가장 유의해야 할 문법적 핵심은 무엇일까요?",
        "answer": "Didn't you eat lunch? 질문에 밥을 먹었으면 무조건 Yes, I did. 안 먹었으면 No, I didn't. (Yes/No는 사실 여부에만 따름)"
      }
    ]
  }
];
