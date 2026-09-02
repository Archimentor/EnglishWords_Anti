(function () {
  "use strict";

  const levels = [
    { id: "A1", name: "입문 문장", caption: "사람·사물·일상을 짧고 정확하게 표현", order: 1 },
    { id: "A2", name: "기초 확장", caption: "일상 문장을 정확하게 연결", order: 2 },
    { id: "B1", name: "중급 구조", caption: "시간·조건·관계를 분명하게 표현", order: 3 },
    { id: "B2", name: "중상급 운용", caption: "복합 구조로 의미와 태도를 조절", order: 4 },
    { id: "C1", name: "고급 문체", caption: "강조·압축·격식까지 선택적으로 운용", order: 5 }
  ];

  const curriculum = [
    {
      id: "a1-be-have",
      level: "A1",
      category: "기본문장",
      title: "나와 주변 소개하기",
      titleEn: "Be and have got",
      summary: "be동사로 사람과 상태를 설명하고 have got으로 소유를 말합니다.",
      formula: "subject + am/is/are  ·  have/has got + noun",
      rules: [
        "I에는 am, he·she·it에는 is, you·we·they에는 are를 씁니다.",
        "부정문은 be동사 뒤에 not을 놓습니다.",
        "소유를 말할 때 I·you·we·they에는 have got, he·she·it에는 has got을 씁니다."
      ],
      contrast: {
        before: "My sister are a student.",
        after: "My sister is a student.",
        note: "한 사람인 my sister는 she로 바꿀 수 있으므로 is가 필요합니다."
      },
      examples: ["I am from Seoul.", "He has got a new bike."],
      exercises: [
        {
          id: "a1-be-1",
          type: "choice",
          prompt: "My sister ___ a student.",
          options: ["am", "is", "are"],
          answer: "is",
          explanation: "my sister는 한 명이며 she에 해당하므로 is를 씁니다."
        },
        {
          id: "a1-be-2",
          type: "arrange",
          prompt: "서울 출신이라고 소개하세요.",
          tokens: ["from", "I", "Seoul", "am"],
          answer: "I am from Seoul.",
          explanation: "be동사 문장은 주어 I 다음에 am을 놓습니다."
        },
        {
          id: "a1-be-3",
          type: "input",
          prompt: "그에게 새 자전거가 있다고 쓰세요.",
          cue: "he / have got / a new bike",
          answers: ["He has got a new bike.", "He's got a new bike."],
          hint: "he와 함께 쓰는 have got의 형태를 떠올리세요.",
          explanation: "3인칭 단수 he 뒤에서는 have가 has로 바뀝니다."
        }
      ]
    },
    {
      id: "a1-present-simple",
      level: "A1",
      category: "시제",
      title: "매일 하는 일 말하기",
      titleEn: "Present simple",
      summary: "반복되는 일과 변하지 않는 사실을 현재단순으로 표현합니다.",
      formula: "subject + base verb  ·  he/she/it + verb-s",
      rules: [
        "습관, 일정, 일반적인 사실에는 현재단순을 씁니다.",
        "he·she·it 뒤의 일반동사에는 보통 -s 또는 -es를 붙입니다.",
        "부정문은 do not 또는 does not 뒤에 동사원형을 씁니다."
      ],
      contrast: {
        before: "She go to work by bus.",
        after: "She goes to work by bus.",
        note: "주어가 she이므로 go에 -es를 붙입니다."
      },
      examples: ["I study English every evening.", "Tom doesn't eat meat."],
      exercises: [
        {
          id: "a1-present-1",
          type: "choice",
          prompt: "She ___ to work by bus.",
          options: ["go", "goes", "going"],
          answer: "goes",
          explanation: "she는 3인칭 단수이므로 goes가 맞습니다."
        },
        {
          id: "a1-present-2",
          type: "arrange",
          prompt: "커피를 마시지 않는다고 말하세요.",
          tokens: ["coffee", "do not", "I", "drink"],
          answer: "I do not drink coffee.",
          explanation: "현재단순 부정문은 주어 + do not + 동사원형 순서입니다."
        },
        {
          id: "a1-present-3",
          type: "input",
          prompt: "아버지가 병원에서 일한다고 쓰세요.",
          cue: "my father / work / at a hospital",
          answers: ["My father works at a hospital."],
          hint: "my father는 he로 바꿀 수 있습니다.",
          explanation: "3인칭 단수 주어 뒤에서 work는 works가 됩니다."
        }
      ]
    },
    {
      id: "a1-question-forms",
      level: "A1",
      category: "질문",
      title: "짧고 정확하게 묻기",
      titleEn: "Basic question forms",
      summary: "be동사와 일반동사의 서로 다른 질문 순서를 익힙니다.",
      formula: "be + subject ...?  ·  do/does + subject + verb?",
      rules: [
        "be동사 문장은 be동사를 주어 앞으로 보내 질문을 만듭니다.",
        "일반동사 질문은 문장 앞에 do 또는 does를 둡니다.",
        "does가 질문 앞에 오면 뒤의 일반동사는 원형을 씁니다."
      ],
      contrast: {
        before: "Does your brother lives here?",
        after: "Does your brother live here?",
        note: "3인칭 표시가 does에 이미 있으므로 본동사는 live가 됩니다."
      },
      examples: ["Are they at home?", "What time does the shop open?"],
      exercises: [
        {
          id: "a1-question-1",
          type: "choice",
          prompt: "___ you like music?",
          options: ["Are", "Do", "Does"],
          answer: "Do",
          explanation: "like는 일반동사이고 주어가 you이므로 Do로 질문합니다."
        },
        {
          id: "a1-question-2",
          type: "arrange",
          prompt: "남동생이 어디 사는지 물어보세요.",
          tokens: ["your brother", "live", "Where", "does"],
          answer: "Where does your brother live?",
          explanation: "의문사 뒤에는 does + 주어 + 동사원형 순서가 옵니다."
        },
        {
          id: "a1-question-3",
          type: "input",
          prompt: "그들이 집에 있는지 물어보세요.",
          cue: "they / be / at home",
          answers: ["Are they at home?"],
          hint: "be동사 are를 주어 앞으로 보내세요.",
          explanation: "be동사 의문문은 Are + 주어 순서로 시작합니다."
        }
      ]
    },
    {
      id: "a1-present-continuous",
      level: "A1",
      category: "시제",
      title: "지금 일어나는 장면",
      titleEn: "Present continuous",
      summary: "말하는 순간 진행 중인 행동을 be + -ing로 묘사합니다.",
      formula: "subject + am/is/are + verb-ing",
      rules: [
        "지금 진행 중인 행동에는 현재진행형을 씁니다.",
        "주어에 맞는 be동사 뒤에 동사-ing를 놓습니다.",
        "부정문은 be동사와 -ing형 사이에 not을 둡니다."
      ],
      contrast: {
        before: "The children running now.",
        after: "The children are running now.",
        note: "현재진행형에는 주어에 맞는 be동사가 반드시 필요합니다."
      },
      examples: ["I'm waiting for the bus.", "She isn't sleeping."],
      exercises: [
        {
          id: "a1-continuous-1",
          type: "choice",
          prompt: "Look! The children ___.",
          options: ["run", "are running", "runs"],
          answer: "are running",
          explanation: "Look!은 지금 벌어지는 장면을 가리키므로 are running이 맞습니다."
        },
        {
          id: "a1-continuous-2",
          type: "arrange",
          prompt: "지금 책을 읽고 있다고 말하세요.",
          tokens: ["a book", "reading", "now", "I am"],
          answer: "I am reading a book now.",
          explanation: "I에 맞는 be동사 am 뒤에 reading을 놓습니다."
        },
        {
          id: "a1-continuous-3",
          type: "input",
          prompt: "그녀가 자고 있지 않다고 쓰세요.",
          cue: "she / not / sleep",
          answers: ["She is not sleeping.", "She isn't sleeping."],
          hint: "is와 sleeping 사이에 not을 놓으세요.",
          explanation: "현재진행형 부정은 is not + sleeping으로 만듭니다."
        }
      ]
    },
    {
      id: "a1-past-simple",
      level: "A1",
      category: "시제",
      title: "어제의 일 이야기하기",
      titleEn: "Past simple",
      summary: "끝난 과거의 행동을 규칙·불규칙 과거형으로 말합니다.",
      formula: "subject + past verb  ·  did + subject + base verb?",
      rules: [
        "어제처럼 끝난 과거 시점의 행동에는 과거형을 씁니다.",
        "규칙동사는 보통 -ed를 붙이고 불규칙동사는 형태가 바뀝니다.",
        "질문과 부정문에서 did를 쓰면 본동사는 원형으로 돌아갑니다."
      ],
      contrast: {
        before: "Did you saw Mina yesterday?",
        after: "Did you see Mina yesterday?",
        note: "과거 표시가 did에 있으므로 뒤에는 동사원형 see가 옵니다."
      },
      examples: ["We visited the museum yesterday.", "He went home at five."],
      exercises: [
        {
          id: "a1-past-1",
          type: "choice",
          prompt: "We ___ the museum yesterday.",
          options: ["visit", "visited", "are visiting"],
          answer: "visited",
          explanation: "yesterday는 끝난 과거이므로 visited를 씁니다."
        },
        {
          id: "a1-past-2",
          type: "arrange",
          prompt: "어제 미나를 봤는지 물어보세요.",
          tokens: ["Mina", "Did", "yesterday", "you", "see"],
          answer: "Did you see Mina yesterday?",
          explanation: "과거 질문은 Did + 주어 + 동사원형 순서입니다."
        },
        {
          id: "a1-past-3",
          type: "input",
          prompt: "그가 버스로 학교에 갔다고 쓰세요.",
          cue: "he / go / to school / by bus",
          answers: ["He went to school by bus."],
          hint: "go의 불규칙 과거형을 사용하세요.",
          explanation: "go의 과거형은 went입니다."
        }
      ]
    },
    {
      id: "a1-there-some-any",
      level: "A1",
      category: "명사",
      title: "무엇이 있는지 말하기",
      titleEn: "There is/are, some and any",
      summary: "장소에 있는 사물과 그 수량을 간단히 설명합니다.",
      formula: "there is + singular  ·  there are + plural",
      rules: [
        "하나 또는 셀 수 없는 명사에는 there is를 씁니다.",
        "두 개 이상의 복수 명사에는 there are를 씁니다.",
        "some은 긍정문, any는 질문과 부정문에 주로 씁니다."
      ],
      contrast: {
        before: "There is two chairs in the room.",
        after: "There are two chairs in the room.",
        note: "two chairs는 복수이므로 there are가 필요합니다."
      },
      examples: ["There is some water on the table.", "Are there any cafés nearby?"],
      exercises: [
        {
          id: "a1-there-1",
          type: "choice",
          prompt: "There ___ two chairs in the room.",
          options: ["is", "are", "be"],
          answer: "are",
          explanation: "two chairs가 복수이므로 are를 씁니다."
        },
        {
          id: "a1-there-2",
          type: "arrange",
          prompt: "탁자 위에 물이 조금 있다고 말하세요.",
          tokens: ["some water", "There is", "on the table"],
          answer: "There is some water on the table.",
          explanation: "셀 수 없는 water는 there is와 함께 씁니다."
        },
        {
          id: "a1-there-3",
          type: "input",
          prompt: "근처에 가게가 하나도 없다고 쓰세요.",
          cue: "there / not / any shops / near here",
          answers: ["There are not any shops near here.", "There aren't any shops near here."],
          hint: "복수 shops에는 there are를 쓰고 부정문에는 any를 쓰세요.",
          explanation: "복수 명사의 존재를 부정할 때 there are not any를 쓸 수 있습니다."
        }
      ]
    },
    {
      id: "a1-can-imperatives",
      level: "A1",
      category: "기능",
      title: "할 수 있는 일과 요청",
      titleEn: "Can and imperatives",
      summary: "can으로 능력과 허용을 말하고 명령문으로 간단히 요청합니다.",
      formula: "subject + can + base verb  ·  (please) + base verb",
      rules: [
        "can 뒤에는 주어와 관계없이 동사원형을 씁니다.",
        "부정형은 cannot 또는 can't입니다.",
        "간단한 지시와 요청은 주어 없이 동사원형으로 시작합니다."
      ],
      contrast: {
        before: "Mina can swims very well.",
        after: "Mina can swim very well.",
        note: "조동사 can 뒤에서는 본동사에 -s를 붙이지 않습니다."
      },
      examples: ["Can I open the window?", "Please sit down."],
      exercises: [
        {
          id: "a1-can-1",
          type: "choice",
          prompt: "Mina ___ swim very well.",
          options: ["can", "cans", "is can"],
          answer: "can",
          explanation: "능력을 말할 때 can + 동사원형을 씁니다."
        },
        {
          id: "a1-can-2",
          type: "arrange",
          prompt: "창문을 열어 달라고 정중히 요청하세요.",
          tokens: ["the window", "Please", "open"],
          answer: "Please open the window.",
          explanation: "정중한 명령문은 Please + 동사원형으로 만들 수 있습니다."
        },
        {
          id: "a1-can-3",
          type: "input",
          prompt: "여기에 주차하면 안 된다고 쓰세요.",
          cue: "you / cannot / park / here",
          answers: ["You cannot park here.", "You can't park here."],
          hint: "cannot 뒤에는 동사원형 park를 쓰세요.",
          explanation: "금지를 나타낼 때 cannot 또는 can't + 동사원형을 씁니다."
        }
      ]
    },
    {
      id: "a1-prepositions",
      level: "A1",
      category: "전치사",
      title: "시간과 장소 짚기",
      titleEn: "Prepositions of time and place",
      summary: "in, on, at으로 기본적인 시간과 위치를 정확히 가리킵니다.",
      formula: "at + point  ·  on + day/surface  ·  in + period/space",
      rules: [
        "정확한 시각에는 at, 요일과 날짜에는 on을 씁니다.",
        "달·계절·연도처럼 긴 기간에는 in을 씁니다.",
        "장소에서 at은 지점, on은 표면, in은 안쪽 공간을 나타냅니다."
      ],
      contrast: {
        before: "The meeting starts in nine o'clock.",
        after: "The meeting starts at nine o'clock.",
        note: "정확한 시각 앞에는 at을 씁니다."
      },
      examples: ["The keys are on the desk.", "We go skiing in winter."],
      exercises: [
        {
          id: "a1-preposition-1",
          type: "choice",
          prompt: "The meeting starts ___ nine o'clock.",
          options: ["at", "on", "in"],
          answer: "at",
          explanation: "정확한 시각 nine o'clock 앞에는 at을 씁니다."
        },
        {
          id: "a1-preposition-2",
          type: "arrange",
          prompt: "열쇠가 책상 위에 있다고 쓰세요.",
          tokens: ["on", "The keys", "the desk", "are"],
          answer: "The keys are on the desk.",
          explanation: "표면 위의 위치는 on으로 나타냅니다."
        },
        {
          id: "a1-preposition-3",
          type: "input",
          prompt: "우리는 겨울에 스키를 타러 간다고 쓰세요.",
          cue: "we / go skiing / winter",
          answers: ["We go skiing in winter."],
          hint: "계절 앞에 쓰는 전치사를 떠올리세요.",
          explanation: "계절과 같은 긴 기간 앞에는 in을 씁니다."
        }
      ]
    },
    {
      id: "a2-past-contrast",
      level: "A2",
      category: "시제",
      title: "과거의 장면과 사건",
      titleEn: "Past simple vs continuous",
      summary: "진행 중이던 배경과 그 사이에 일어난 사건을 구분합니다.",
      formula: "was/were + -ing  →  past event",
      rules: [
        "과거진행은 특정 과거 시점에 진행 중이던 장면을 보여줍니다.",
        "과거단순은 완료된 사건이나 연속된 행동을 전달합니다.",
        "when 뒤에는 짧은 사건, while 뒤에는 진행 중인 장면이 자주 옵니다."
      ],
      contrast: {
        before: "I cooked when the phone was ringing.",
        after: "I was cooking when the phone rang.",
        note: "요리 중이던 장면에 전화가 울린 사건이 끼어듭니다."
      },
      examples: ["While we were waiting, the bus finally arrived.", "I dropped my keys as I was leaving the office."],
      exercises: [
        {
          id: "a2-past-1",
          type: "choice",
          prompt: "When I ___ home, it was raining heavily.",
          options: ["was coming", "came", "have come"],
          answer: "came",
          explanation: "집에 도착한 것은 완료된 사건이므로 과거단순 came이 맞습니다."
        },
        {
          id: "a2-past-2",
          type: "arrange",
          prompt: "전화가 울렸을 때 나는 요리 중이었다.",
          tokens: ["the phone", "I", "rang", "when", "was cooking"],
          answer: "I was cooking when the phone rang.",
          explanation: "진행 중인 배경은 was cooking, 끼어든 사건은 rang으로 표현합니다."
        },
        {
          id: "a2-past-3",
          type: "input",
          prompt: "두 사건을 when으로 연결하세요.",
          cue: "she / walk to school + she / see the accident",
          answers: ["She was walking to school when she saw the accident."],
          hint: "진행 중인 행동에는 was + -ing를 사용하세요.",
          explanation: "걷는 행동이 배경이고 사고를 본 일이 짧은 사건입니다."
        }
      ]
    },
    {
      id: "a2-present-perfect",
      level: "A2",
      category: "시제",
      title: "지금과 연결된 경험",
      titleEn: "Present perfect basics",
      summary: "경험, 최근 완료, 아직 끝나지 않은 기간을 현재완료로 말합니다.",
      formula: "have/has + past participle",
      rules: [
        "현재완료는 과거 행동의 결과가 지금과 연결될 때 씁니다.",
        "ever·never는 경험, just·already·yet은 최근 완료와 잘 어울립니다.",
        "끝난 과거 시점 표현(yesterday, last year)과는 과거단순을 씁니다."
      ],
      contrast: {
        before: "I have seen her yesterday.",
        after: "I saw her yesterday.",
        note: "yesterday는 끝난 과거 시점이므로 과거단순이 필요합니다."
      },
      examples: ["I have never tried surfing.", "She has just finished the meeting."],
      exercises: [
        {
          id: "a2-perfect-1",
          type: "choice",
          prompt: "I ___ sushi before. Is it spicy?",
          options: ["never tried", "have never tried", "am never trying"],
          answer: "have never tried",
          explanation: "지금까지의 경험을 묻는 맥락이므로 have never tried가 맞습니다."
        },
        {
          id: "a2-perfect-2",
          type: "arrange",
          prompt: "숙제를 벌써 끝냈는지 물어보세요.",
          tokens: ["your homework", "yet", "Have", "finished", "you"],
          answer: "Have you finished your homework yet?",
          explanation: "현재완료 의문문은 Have + 주어 + 과거분사 순서입니다."
        },
        {
          id: "a2-perfect-3",
          type: "input",
          prompt: "방금 이메일을 보냈다고 쓰세요.",
          cue: "I / just / send / the email",
          answers: ["I have just sent the email.", "I've just sent the email."],
          hint: "have와 send의 과거분사 sent를 사용하세요.",
          explanation: "just는 보통 have와 과거분사 사이에 놓입니다."
        }
      ]
    },
    {
      id: "a2-future-forms",
      level: "A2",
      category: "시제",
      title: "계획·약속·예측",
      titleEn: "Future forms",
      summary: "will, be going to, 현재진행형의 쓰임을 상황에 맞게 고릅니다.",
      formula: "will / be going to / be + -ing",
      rules: [
        "will은 즉석 결정, 약속, 근거가 약한 예측에 자주 씁니다.",
        "be going to는 이미 정한 의도나 눈에 보이는 근거가 있는 예측입니다.",
        "현재진행형은 시간과 장소가 정해진 가까운 미래 약속을 나타냅니다."
      ],
      contrast: {
        before: "Look at those clouds. It will rain.",
        after: "Look at those clouds. It is going to rain.",
        note: "구름이라는 현재 근거가 있으므로 going to가 자연스럽습니다."
      },
      examples: ["I'm meeting Jina at six.", "I'll carry that bag for you."],
      exercises: [
        {
          id: "a2-future-1",
          type: "choice",
          prompt: "I ___ the dentist at 3 p.m. tomorrow. The appointment is booked.",
          options: ["meet", "am meeting", "will have met"],
          answer: "am meeting",
          explanation: "예약이 확정된 약속이므로 현재진행형을 씁니다."
        },
        {
          id: "a2-future-2",
          type: "arrange",
          prompt: "곧 비가 올 것 같다고 말하세요.",
          tokens: ["soon", "going", "rain", "It", "to", "is"],
          answer: "It is going to rain soon.",
          explanation: "현재의 징후를 근거로 예측할 때 be going to를 씁니다."
        },
        {
          id: "a2-future-3",
          type: "input",
          prompt: "영화를 좋아할 것이라는 개인적 예측을 쓰세요.",
          cue: "I think / you / enjoy / the film",
          answers: ["I think you will enjoy the film.", "I think you'll enjoy the film."],
          hint: "I think 뒤의 예측에는 will이 자연스럽습니다.",
          explanation: "현재 증거보다 화자의 판단에 가까운 예측에는 will을 씁니다."
        }
      ]
    },
    {
      id: "a2-articles-quantifiers",
      level: "A2",
      category: "명사",
      title: "관사와 수량의 감각",
      titleEn: "Articles and quantifiers",
      summary: "셀 수 있는지, 처음인지 이미 특정됐는지에 따라 표현을 고릅니다.",
      formula: "a/an + one  ·  the + known  ·  much/many",
      rules: [
        "처음 언급하는 셀 수 있는 단수 명사에는 a/an을 씁니다.",
        "화자와 청자가 어느 대상을 말하는지 알 때 the를 씁니다.",
        "many는 복수 가산명사, much는 불가산명사와 결합합니다."
      ],
      contrast: {
        before: "There aren't many milk left.",
        after: "There isn't much milk left.",
        note: "milk는 불가산명사이므로 단수 동사와 much가 필요합니다."
      },
      examples: ["I saw a dog. The dog was wearing a red collar.", "How many chairs do we need?"],
      exercises: [
        {
          id: "a2-article-1",
          type: "choice",
          prompt: "Could I borrow ___ umbrella by the door?",
          options: ["a", "an", "the"],
          answer: "the",
          explanation: "문 옆에 있는 특정 우산을 가리키므로 the가 맞습니다."
        },
        {
          id: "a2-article-2",
          type: "arrange",
          prompt: "냉장고에 우유가 많지 않다고 쓰세요.",
          tokens: ["milk", "isn't", "the fridge", "much", "There", "in"],
          answer: "There isn't much milk in the fridge.",
          explanation: "불가산명사 milk 앞에는 much를 씁니다."
        },
        {
          id: "a2-article-3",
          type: "input",
          prompt: "어제 새 우산 하나를 샀다고 쓰세요.",
          cue: "I / buy / new umbrella / yesterday",
          answers: ["I bought a new umbrella yesterday."],
          hint: "처음 언급하는 단수 명사입니다.",
          explanation: "umbrella는 모음 소리로 시작하지만 new가 바로 앞에 있으므로 a new umbrella입니다."
        }
      ]
    },
    {
      id: "a2-comparison",
      level: "A2",
      category: "수식",
      title: "비교의 기준 세우기",
      titleEn: "Comparatives and superlatives",
      summary: "차이의 크기와 같고 다름을 비교 표현으로 정확히 보여줍니다.",
      formula: "-er / more  ·  the -est / most  ·  as ... as",
      rules: [
        "짧은 형용사는 -er/-est, 긴 형용사는 more/most를 주로 씁니다.",
        "much, far, a little로 비교 차이의 크기를 조절할 수 있습니다.",
        "동등 비교는 as + 형용사 + as 구조입니다."
      ],
      contrast: {
        before: "This route is more shorter.",
        after: "This route is much shorter.",
        note: "shorter 자체가 비교급이므로 more를 겹쳐 쓰지 않습니다."
      },
      examples: ["The blue room is slightly larger.", "This test isn't as difficult as the last one."],
      exercises: [
        {
          id: "a2-compare-1",
          type: "choice",
          prompt: "The new app is ___ to use than the old one.",
          options: ["much easier", "more easy", "most easier"],
          answer: "much easier",
          explanation: "easy의 비교급은 easier이며 much로 큰 차이를 나타냅니다."
        },
        {
          id: "a2-compare-2",
          type: "arrange",
          prompt: "이것이 여기서 가장 흥미로운 책이라고 쓰세요.",
          tokens: ["book", "the most interesting", "here", "This", "is"],
          answer: "This is the most interesting book here.",
          explanation: "셋 이상 가운데 최고를 고를 때 the + 최상급을 씁니다."
        },
        {
          id: "a2-compare-3",
          type: "input",
          prompt: "내 가방은 네 가방만큼 무겁지 않다고 쓰세요.",
          cue: "my bag / not / heavy / yours",
          answers: ["My bag is not as heavy as yours.", "My bag isn't as heavy as yours."],
          hint: "부정 동등 비교: not as ... as",
          explanation: "not as heavy as는 비교 대상보다 덜 무겁다는 뜻입니다."
        }
      ]
    },
    {
      id: "a2-modals",
      level: "A2",
      category: "조동사",
      title: "의무·허가·조언",
      titleEn: "Modals for everyday rules",
      summary: "해야 함, 금지, 필요 없음, 조언의 강도를 구분합니다.",
      formula: "must / have to / mustn't / don't have to / should",
      rules: [
        "must와 have to는 의무를 나타내지만, have to는 외부 규칙에 자주 씁니다.",
        "mustn't는 금지, don't have to는 필요 없음을 뜻합니다.",
        "should는 명령보다 부드러운 조언입니다."
      ],
      contrast: {
        before: "You don't have to use your phone here.",
        after: "You mustn't use your phone here.",
        note: "금지 규칙을 말할 때는 mustn't가 필요합니다."
      },
      examples: ["You should get some rest.", "Visitors have to show identification."],
      exercises: [
        {
          id: "a2-modal-1",
          type: "choice",
          prompt: "This information is private. You ___ share it.",
          options: ["don't have to", "mustn't", "should"],
          answer: "mustn't",
          explanation: "공유하면 안 된다는 금지이므로 mustn't가 맞습니다."
        },
        {
          id: "a2-modal-2",
          type: "arrange",
          prompt: "병원에 가보라고 조언하세요.",
          tokens: ["a doctor", "You", "see", "should"],
          answer: "You should see a doctor.",
          explanation: "조언은 should + 동사원형으로 표현합니다."
        },
        {
          id: "a2-modal-3",
          type: "input",
          prompt: "학교 규칙으로 교복을 입어야 한다고 쓰세요.",
          cue: "we / have to / wear / a uniform / at school",
          answers: ["We have to wear a uniform at school."],
          hint: "외부 규칙에는 have to가 자연스럽습니다.",
          explanation: "학교가 정한 규칙이므로 have to가 잘 어울립니다."
        }
      ]
    },
    {
      id: "a2-gerund-infinitive",
      level: "A2",
      category: "동사형",
      title: "-ing와 to부정사",
      titleEn: "Gerunds and infinitives",
      summary: "앞 동사와 목적에 따라 -ing 또는 to + 동사원형을 고릅니다.",
      formula: "enjoy + -ing  ·  decide + to V  ·  purpose: to V",
      rules: [
        "enjoy, avoid, finish 뒤에는 주로 -ing가 옵니다.",
        "want, decide, hope 뒤에는 주로 to부정사가 옵니다.",
        "행동의 목적을 설명할 때도 to부정사를 씁니다."
      ],
      contrast: {
        before: "I enjoy to read on the train.",
        after: "I enjoy reading on the train.",
        note: "enjoy 뒤에는 동명사 -ing가 옵니다."
      },
      examples: ["We decided to leave early.", "She went to the shop to buy bread."],
      exercises: [
        {
          id: "a2-gerund-1",
          type: "choice",
          prompt: "Minho enjoys ___ before breakfast.",
          options: ["to run", "running", "run"],
          answer: "running",
          explanation: "enjoy 뒤에는 동명사 running을 씁니다."
        },
        {
          id: "a2-gerund-2",
          type: "arrange",
          prompt: "더 이른 기차를 타기로 결정했다고 쓰세요.",
          tokens: ["the earlier train", "decided", "I", "to take"],
          answer: "I decided to take the earlier train.",
          explanation: "decide 뒤에는 to부정사가 옵니다."
        },
        {
          id: "a2-gerund-3",
          type: "input",
          prompt: "빵을 사기 위해 외출했다고 쓰세요.",
          cue: "she / go out / buy some bread",
          answers: ["She went out to buy some bread."],
          hint: "목적은 to + 동사원형으로 나타냅니다.",
          explanation: "to buy는 외출한 목적을 설명합니다."
        }
      ]
    },
    {
      id: "a2-first-conditional",
      level: "A2",
      category: "조건문",
      title: "가능한 미래 조건",
      titleEn: "First conditional and time clauses",
      summary: "실현 가능한 미래 조건과 그 결과를 연결합니다.",
      formula: "if/when + present, will + V",
      rules: [
        "가능성이 있는 미래 조건에는 1형 조건문을 씁니다.",
        "if절에는 미래 의미라도 현재형을 씁니다.",
        "when, as soon as, before, after가 이끄는 미래 시간절도 현재형을 씁니다."
      ],
      contrast: {
        before: "I will call you when I will arrive.",
        after: "I will call you when I arrive.",
        note: "미래 시간절 when 뒤에는 현재형을 씁니다."
      },
      examples: ["If it rains, we'll stay inside.", "I'll text you as soon as the train arrives."],
      exercises: [
        {
          id: "a2-condition-1",
          type: "choice",
          prompt: "If the weather ___ fine, we'll eat outside.",
          options: ["will be", "is", "would be"],
          answer: "is",
          explanation: "1형 조건문의 if절에는 현재형 is를 씁니다."
        },
        {
          id: "a2-condition-2",
          type: "arrange",
          prompt: "도착하면 전화하겠다고 쓰세요.",
          tokens: ["I", "when", "will call", "arrive", "you", "I"],
          answer: "I will call you when I arrive.",
          explanation: "주절에는 will, when절에는 현재형을 씁니다."
        },
        {
          id: "a2-condition-3",
          type: "input",
          prompt: "열심히 공부하면 시험에 합격할 것이라고 쓰세요.",
          cue: "if / you study hard / you / pass the exam",
          answers: ["If you study hard, you will pass the exam.", "If you study hard, you'll pass the exam."],
          hint: "if절은 현재형, 결과절은 will을 사용하세요.",
          explanation: "실현 가능한 미래 조건을 나타내는 전형적인 1형 조건문입니다."
        }
      ]
    },

    {
      id: "b1-perfect-time",
      level: "B1",
      category: "시제",
      title: "현재완료의 시간 범위",
      titleEn: "Present perfect with for and since",
      summary: "과거부터 지금까지 이어진 상태와 끝난 과거를 구분합니다.",
      formula: "have + p.p. + for duration / since start",
      rules: [
        "for는 기간, since는 시작점을 나타냅니다.",
        "지금까지 이어진 상태에는 현재완료가 자연스럽습니다.",
        "끝난 시점이 분명하면 과거단순을 씁니다."
      ],
      contrast: {
        before: "I live here since 2021.",
        after: "I have lived here since 2021.",
        note: "2021년에 시작해 지금도 이어지는 상태입니다."
      },
      examples: ["We've known each other for ten years.", "I worked there from 2019 to 2021."],
      exercises: [
        {
          id: "b1-time-1",
          type: "choice",
          prompt: "They ___ in this apartment for six months.",
          options: ["live", "have lived", "lived yesterday"],
          answer: "have lived",
          explanation: "과거부터 지금까지 이어진 기간이므로 현재완료를 씁니다."
        },
        {
          id: "b1-time-2",
          type: "arrange",
          prompt: "초등학교 때부터 미아를 알고 지냈다고 쓰세요.",
          tokens: ["since primary school", "Mia", "have known", "I"],
          answer: "I have known Mia since primary school.",
          explanation: "상태동사 know와 시작점 since가 현재완료로 연결됩니다."
        },
        {
          id: "b1-time-3",
          type: "input",
          prompt: "그는 두 달 동안 형을 보지 못했다고 쓰세요.",
          cue: "he / not see / his brother / for two months",
          answers: ["He has not seen his brother for two months.", "He hasn't seen his brother for two months."],
          hint: "has + not + seen 구조입니다.",
          explanation: "보지 못한 상태가 지금까지 이어지므로 현재완료가 맞습니다."
        }
      ]
    },
    {
      id: "b1-past-perfect",
      level: "B1",
      category: "시제",
      title: "과거보다 더 이전",
      titleEn: "Past perfect",
      summary: "두 과거 사건의 순서를 had + 과거분사로 분명하게 만듭니다.",
      formula: "earlier past: had + p.p.  →  later past",
      rules: [
        "과거완료는 다른 과거 사건보다 먼저 일어난 일을 표시합니다.",
        "by the time, already, before와 자주 함께 씁니다.",
        "시간 순서가 이미 명확할 때는 과거단순도 가능하지만 과거완료는 선후를 강조합니다."
      ],
      contrast: {
        before: "When we arrived, the train left.",
        after: "When we arrived, the train had left.",
        note: "우리가 도착하기 전에 기차가 이미 떠났습니다."
      },
      examples: ["She had never flown before that trip.", "By midnight, everyone had gone home."],
      exercises: [
        {
          id: "b1-pastperfect-1",
          type: "choice",
          prompt: "By the time I reached the station, the train ___.",
          options: ["left", "had left", "has left"],
          answer: "had left",
          explanation: "역에 도착한 과거보다 기차가 먼저 떠났으므로 had left입니다."
        },
        {
          id: "b1-pastperfect-2",
          type: "arrange",
          prompt: "우리가 도착했을 때 영화는 이미 시작했다.",
          tokens: ["had started", "we arrived", "the film", "By the time"],
          answer: "By the time we arrived, the film had started.",
          explanation: "먼저 시작한 영화에 과거완료를 사용합니다."
        },
        {
          id: "b1-pastperfect-3",
          type: "input",
          prompt: "보고서를 마친 뒤 그녀가 집에 갔다고 쓰세요.",
          cue: "after / she finish the report / she go home",
          answers: ["After she had finished the report, she went home."],
          hint: "먼저 끝낸 일은 had finished입니다.",
          explanation: "보고서 완료가 귀가보다 먼저 일어난 사건입니다."
        }
      ]
    },
    {
      id: "b1-conditionals",
      level: "B1",
      category: "조건문",
      title: "사실·가능성·가정",
      titleEn: "Zero, first and second conditionals",
      summary: "일반 사실, 가능한 미래, 비현실적 현재를 조건문으로 나눕니다.",
      formula: "zero: present/present · first: present/will · second: past/would",
      rules: [
        "0형은 반복되는 사실과 규칙을 말합니다.",
        "1형은 실현 가능한 미래, 2형은 가능성이 낮거나 비현실적인 현재를 말합니다.",
        "2형의 be동사는 격식 있게 모든 주어에 were를 쓸 수 있습니다."
      ],
      contrast: {
        before: "If I have more time, I would learn Italian.",
        after: "If I had more time, I would learn Italian.",
        note: "현재 사실과 다른 가정이므로 과거형 + would가 필요합니다."
      },
      examples: ["If you heat ice, it melts.", "If I were you, I'd check the contract."],
      exercises: [
        {
          id: "b1-condition-1",
          type: "choice",
          prompt: "If I ___ closer, I would walk to work.",
          options: ["live", "lived", "will live"],
          answer: "lived",
          explanation: "현재 현실과 다른 가정이므로 2형 조건문의 과거형을 씁니다."
        },
        {
          id: "b1-condition-2",
          type: "arrange",
          prompt: "시간이 더 있다면 이탈리아어를 배울 텐데.",
          tokens: ["I", "more time", "would learn", "had", "If", "Italian"],
          answer: "If I had more time, I would learn Italian.",
          explanation: "If + 과거형, would + 동사원형으로 현재의 가정을 만듭니다."
        },
        {
          id: "b1-condition-3",
          type: "input",
          prompt: "물을 100도까지 가열하면 끓는다는 일반 사실을 쓰세요.",
          cue: "water / boil / if / heat it to 100 degrees",
          answers: ["Water boils if you heat it to 100 degrees."],
          hint: "두 절 모두 현재형을 사용하세요.",
          explanation: "항상 성립하는 과학적 사실이므로 0형 조건문입니다."
        }
      ]
    },
    {
      id: "b1-passive",
      level: "B1",
      category: "태",
      title: "초점을 바꾸는 수동태",
      titleEn: "Passive voice",
      summary: "행위자보다 결과나 대상을 앞세워 문장의 초점을 바꿉니다.",
      formula: "be + past participle",
      rules: [
        "수동태는 행동을 받는 대상을 주어로 둡니다.",
        "시제는 be동사에 표시하고 본동사는 과거분사를 씁니다.",
        "행위자가 중요할 때만 by + 행위자를 덧붙입니다."
      ],
      contrast: {
        before: "They built the bridge in 1998.",
        after: "The bridge was built in 1998.",
        note: "누가 지었는지보다 다리와 완공 시점에 초점을 둡니다."
      },
      examples: ["The documents will be sent tomorrow.", "Coffee is grown in this region."],
      exercises: [
        {
          id: "b1-passive-1",
          type: "choice",
          prompt: "This theatre ___ in the nineteenth century.",
          options: ["built", "was built", "has building"],
          answer: "was built",
          explanation: "과거의 수동태는 was/were + 과거분사입니다."
        },
        {
          id: "b1-passive-2",
          type: "arrange",
          prompt: "결과는 내일 발표될 것이다.",
          tokens: ["tomorrow", "will be announced", "The results"],
          answer: "The results will be announced tomorrow.",
          explanation: "미래 수동태는 will be + 과거분사입니다."
        },
        {
          id: "b1-passive-3",
          type: "input",
          prompt: "많은 나라에서 영어가 사용된다고 쓰세요.",
          cue: "English / speak / in many countries",
          answers: ["English is spoken in many countries."],
          hint: "현재 수동태 is + spoken을 사용하세요.",
          explanation: "언어가 사용되는 일반 사실이므로 현재 수동태입니다."
        }
      ]
    },
    {
      id: "b1-relative-clauses",
      level: "B1",
      category: "절",
      title: "정보를 붙이는 관계절",
      titleEn: "Defining and non-defining relatives",
      summary: "필수 정보와 부가 정보를 관계절과 쉼표로 구분합니다.",
      formula: "noun + who/which/that ...",
      rules: [
        "제한적 관계절은 대상을 특정하는 필수 정보이며 쉼표를 쓰지 않습니다.",
        "계속적 관계절은 부가 정보이며 앞뒤에 쉼표를 씁니다.",
        "계속적 관계절에는 that을 쓰지 않습니다."
      ],
      contrast: {
        before: "My uncle that lives in Busan is a chef.",
        after: "My uncle, who lives in Busan, is a chef.",
        note: "한 명인 삼촌에 대한 부가 정보이므로 쉼표와 who를 씁니다."
      },
      examples: ["The book that you lent me was excellent.", "Seoul, which is the capital, is densely populated."],
      exercises: [
        {
          id: "b1-relative-1",
          type: "choice",
          prompt: "The woman ___ helped us works at the station.",
          options: ["who", "where", "whose"],
          answer: "who",
          explanation: "사람을 주어로 받는 관계대명사는 who입니다."
        },
        {
          id: "b1-relative-2",
          type: "arrange",
          prompt: "부산에 사는 내 삼촌은 요리사다. 부가 정보로 쓰세요.",
          tokens: ["is a chef", "who lives in Busan", "My uncle"],
          answer: "My uncle, who lives in Busan, is a chef.",
          explanation: "부가 정보 관계절은 쉼표로 분리합니다."
        },
        {
          id: "b1-relative-3",
          type: "input",
          prompt: "두 문장을 제한적 관계절로 합치세요.",
          cue: "I bought a laptop last year. The laptop is already broken.",
          answers: ["The laptop that I bought last year is already broken.", "The laptop which I bought last year is already broken."],
          hint: "대상을 특정하는 정보이므로 쉼표 없이 that 또는 which를 사용하세요.",
          explanation: "어느 노트북인지 정하는 필수 정보이므로 제한적 관계절입니다."
        }
      ]
    },
    {
      id: "b1-reported-speech",
      level: "B1",
      category: "절",
      title: "말을 옮겨 전하기",
      titleEn: "Reported statements and questions",
      summary: "직접 한 말을 시점과 어순에 맞춰 간접화법으로 바꿉니다.",
      formula: "said (that) ... · asked + wh/if + statement order",
      rules: [
        "과거의 발화 동사 뒤에서는 시제가 한 단계 뒤로 이동할 수 있습니다.",
        "간접의문문은 평서문 어순을 사용하고 do/does/did를 쓰지 않습니다.",
        "now, today, tomorrow 같은 시간 표현도 전달 시점에 맞게 바뀔 수 있습니다."
      ],
      contrast: {
        before: "He asked me where did I live.",
        after: "He asked me where I lived.",
        note: "간접의문문은 주어 + 동사 어순입니다."
      },
      examples: ["Mina said that she was busy.", "They asked if I needed any help."],
      exercises: [
        {
          id: "b1-report-1",
          type: "choice",
          prompt: "‘I'm tired,’ she said. → She said that she ___.",
          options: ["is tired", "was tired", "has tired"],
          answer: "was tired",
          explanation: "과거 전달 동사 said 뒤에서 am이 was로 이동합니다."
        },
        {
          id: "b1-report-2",
          type: "arrange",
          prompt: "그는 내가 어디에 사는지 물었다.",
          tokens: ["where", "He asked me", "I lived"],
          answer: "He asked me where I lived.",
          explanation: "간접의문문은 where + 주어 + 동사 순서입니다."
        },
        {
          id: "b1-report-3",
          type: "input",
          prompt: "‘I will call later,’ Lena said.를 간접화법으로 바꾸세요.",
          cue: "Lena said / she / call later",
          answers: ["Lena said that she would call later.", "Lena said she would call later."],
          hint: "will은 전달 시점에서 would로 이동합니다.",
          explanation: "과거의 발화를 전달하므로 will을 would로 바꿉니다."
        }
      ]
    },
    {
      id: "b1-past-habits",
      level: "B1",
      category: "동사형",
      title: "과거 습관과 익숙함",
      titleEn: "Used to, would and be used to",
      summary: "사라진 과거 상태, 반복 행동, 현재의 익숙함을 구분합니다.",
      formula: "used to V · would V · be used to -ing/noun",
      rules: [
        "used to는 지금은 달라진 과거 상태와 습관 모두에 씁니다.",
        "would는 반복 행동에는 쓰지만 과거 상태에는 보통 쓰지 않습니다.",
        "be used to 뒤의 to는 전치사이므로 명사나 -ing가 옵니다."
      ],
      contrast: {
        before: "I am used to wake up early.",
        after: "I am used to waking up early.",
        note: "be used to의 to는 전치사이므로 waking이 필요합니다."
      },
      examples: ["I used to have long hair.", "Every winter, we would visit my grandparents."],
      exercises: [
        {
          id: "b1-habit-1",
          type: "choice",
          prompt: "I ___ play outside every evening when I was a child.",
          options: ["used to", "am used to", "use to"],
          answer: "used to",
          explanation: "지금은 달라진 과거 습관이므로 used to + 동사원형입니다."
        },
        {
          id: "b1-habit-2",
          type: "arrange",
          prompt: "매년 여름 조부모님을 찾아뵙곤 했다.",
          tokens: ["our grandparents", "would visit", "We", "every summer"],
          answer: "We would visit our grandparents every summer.",
          explanation: "반복된 과거 행동은 would로 표현할 수 있습니다."
        },
        {
          id: "b1-habit-3",
          type: "input",
          prompt: "일찍 일어나는 데 익숙해지고 있다고 쓰세요.",
          cue: "I / get used to / wake up early",
          answers: ["I am getting used to waking up early.", "I'm getting used to waking up early."],
          hint: "get used to 뒤에는 -ing를 사용하세요.",
          explanation: "점차 익숙해지는 과정은 get used to + -ing로 나타냅니다."
        }
      ]
    },
    {
      id: "b1-verb-patterns",
      level: "B1",
      category: "동사형",
      title: "동사 뒤 형태와 의미",
      titleEn: "Verb patterns that change meaning",
      summary: "remember, stop, try 뒤의 -ing와 to부정사가 만드는 의미 차이를 익힙니다.",
      formula: "remember doing ≠ remember to do",
      rules: [
        "remember doing은 과거 행동의 기억, remember to do는 해야 할 일을 잊지 않는 뜻입니다.",
        "stop doing은 행동 중단, stop to do는 다른 행동을 하기 위해 멈추는 뜻입니다.",
        "try doing은 시험 삼아 해보기, try to do는 해내려고 노력하기입니다."
      ],
      contrast: {
        before: "We stopped to talk because the library was quiet.",
        after: "We stopped talking because the library was quiet.",
        note: "대화를 중단한 것이므로 stop + -ing를 씁니다."
      },
      examples: ["Remember to lock the door.", "I remember meeting her years ago."],
      exercises: [
        {
          id: "b1-pattern-1",
          type: "choice",
          prompt: "The doctor told him to stop ___.",
          options: ["smoking", "to smoke", "smoke"],
          answer: "smoking",
          explanation: "흡연 행위를 중단한다는 뜻이므로 stop smoking입니다."
        },
        {
          id: "b1-pattern-2",
          type: "arrange",
          prompt: "문 잠그는 것을 기억해 달라고 쓰세요.",
          tokens: ["the door", "remember", "Please", "to lock"],
          answer: "Please remember to lock the door.",
          explanation: "앞으로 해야 할 일을 잊지 말라는 뜻은 remember to do입니다."
        },
        {
          id: "b1-pattern-3",
          type: "input",
          prompt: "회의에서 그녀를 만났던 기억이 난다고 쓰세요.",
          cue: "I / remember / meet her / at a conference",
          answers: ["I remember meeting her at a conference."],
          hint: "과거 경험의 기억은 remember + -ing입니다.",
          explanation: "이미 일어난 일을 기억하므로 meeting을 씁니다."
        }
      ]
    },

    {
      id: "b2-perfect-continuous",
      level: "B2",
      category: "시제",
      title: "기간과 과정의 초점",
      titleEn: "Perfect continuous aspects",
      summary: "현재·과거의 기준점까지 이어진 활동의 기간과 흔적을 강조합니다.",
      formula: "have/has/had + been + -ing",
      rules: [
        "현재완료진행은 과거에 시작해 지금까지 이어진 활동에 초점을 둡니다.",
        "과거완료진행은 다른 과거 시점 전까지 계속된 활동을 보여줍니다.",
        "완료 결과를 강조하면 완료형, 과정과 기간을 강조하면 완료진행형이 자연스럽습니다."
      ],
      contrast: {
        before: "I have read for three hours, so my eyes are tired.",
        after: "I have been reading for three hours, so my eyes are tired.",
        note: "지속된 과정과 현재의 피로라는 흔적에 초점을 둡니다."
      },
      examples: ["We've been waiting since noon.", "He had been driving for hours before he stopped."],
      exercises: [
        {
          id: "b2-continuous-1",
          type: "choice",
          prompt: "Sorry I'm late. How long ___?",
          options: ["have you waited", "have you been waiting", "did you waiting"],
          answer: "have you been waiting",
          explanation: "지금까지 계속된 기다림의 기간을 묻으므로 현재완료진행이 맞습니다."
        },
        {
          id: "b2-continuous-2",
          type: "arrange",
          prompt: "이사하기 전까지 그녀는 그곳에서 5년간 일해 왔다.",
          tokens: ["before she moved", "there", "had been working", "for five years", "She"],
          answer: "She had been working there for five years before she moved.",
          explanation: "이사라는 과거 시점까지 이어진 활동이므로 과거완료진행입니다."
        },
        {
          id: "b2-continuous-3",
          type: "input",
          prompt: "아침 내내 공부해 왔다고 쓰세요.",
          cue: "I / study / all morning",
          answers: ["I have been studying all morning.", "I've been studying all morning."],
          hint: "have been + -ing를 사용하세요.",
          explanation: "현재까지 이어진 공부의 기간을 강조합니다."
        }
      ]
    },
    {
      id: "b2-future-perfect",
      level: "B2",
      category: "시제",
      title: "미래의 진행과 완료",
      titleEn: "Future continuous and perfect",
      summary: "미래 특정 시점에 진행 중일 일과 그때까지 끝날 일을 구분합니다.",
      formula: "will be + -ing · will have + p.p.",
      rules: [
        "미래진행은 미래의 특정 시점에 진행 중일 활동을 나타냅니다.",
        "미래완료는 미래의 기준 시점까지 완료될 일을 나타냅니다.",
        "by, by the time은 미래완료와 자주 함께 쓰입니다."
      ],
      contrast: {
        before: "By Friday, we will finish the report.",
        after: "By Friday, we will have finished the report.",
        note: "금요일이라는 기한까지 완료될 결과에 초점을 둡니다."
      },
      examples: ["This time tomorrow, I'll be presenting our plan.", "By 2030, the city will have opened three new lines."],
      exercises: [
        {
          id: "b2-futureperfect-1",
          type: "choice",
          prompt: "By the end of this week, I ___ the first draft.",
          options: ["will finish", "will have finished", "will be finish"],
          answer: "will have finished",
          explanation: "기한까지 완료될 결과이므로 미래완료를 씁니다."
        },
        {
          id: "b2-futureperfect-2",
          type: "arrange",
          prompt: "내일 이 시간에는 도쿄로 비행 중일 것이다.",
          tokens: ["to Tokyo", "we", "This time tomorrow", "will be flying"],
          answer: "This time tomorrow, we will be flying to Tokyo.",
          explanation: "미래 특정 시점에 진행 중인 활동은 미래진행입니다."
        },
        {
          id: "b2-futureperfect-3",
          type: "input",
          prompt: "내년 6월까지 다리를 완공할 것이라고 쓰세요.",
          cue: "by next June / they / complete / the bridge",
          answers: ["By next June, they will have completed the bridge."],
          hint: "will have + completed를 사용하세요.",
          explanation: "미래 기한까지 완료될 일이므로 미래완료입니다."
        }
      ]
    },
    {
      id: "b2-third-mixed",
      level: "B2",
      category: "조건문",
      title: "지나간 선택과 현재 결과",
      titleEn: "Third and mixed conditionals",
      summary: "과거의 반대 사실과 그 과거·현재 결과를 가정합니다.",
      formula: "if + had p.p., would have p.p. / would V now",
      rules: [
        "3형 조건문은 실제로 일어나지 않은 과거와 과거 결과를 가정합니다.",
        "혼합 조건문은 과거 조건이 현재 결과에 미친 영향을 나타낼 수 있습니다.",
        "if절에는 would를 쓰지 않는 것이 기본입니다."
      ],
      contrast: {
        before: "If I would have left earlier, I wouldn't miss the train.",
        after: "If I had left earlier, I wouldn't have missed the train.",
        note: "과거 반대 사실은 had + 과거분사, 결과는 would have + 과거분사입니다."
      },
      examples: ["If she'd studied medicine, she would be a doctor now.", "We might have won if we'd played better."],
      exercises: [
        {
          id: "b2-third-1",
          type: "choice",
          prompt: "If we ___ the map, we wouldn't have got lost.",
          options: ["checked", "had checked", "would check"],
          answer: "had checked",
          explanation: "실제로 확인하지 않은 과거 조건이므로 had checked가 맞습니다."
        },
        {
          id: "b2-third-2",
          type: "arrange",
          prompt: "그 직장을 택했다면 지금 해외에서 살고 있을 텐데.",
          tokens: ["I", "I", "would be living abroad now", "had taken that job", "If"],
          answer: "If I had taken that job, I would be living abroad now.",
          explanation: "과거 조건과 현재 결과를 연결한 혼합 조건문입니다."
        },
        {
          id: "b2-third-3",
          type: "input",
          prompt: "그녀가 들었다면 그 실수를 하지 않았을 것이라고 쓰세요.",
          cue: "if / she listen / she / not make that mistake",
          answers: ["If she had listened, she would not have made that mistake.", "If she had listened, she wouldn't have made that mistake."],
          hint: "had listened + would not have made",
          explanation: "과거의 조건과 일어나지 않았을 과거 결과를 나타냅니다."
        }
      ]
    },
    {
      id: "b2-past-deduction",
      level: "B2",
      category: "조동사",
      title: "과거를 논리적으로 추론하기",
      titleEn: "Modals of past deduction",
      summary: "증거에 따라 과거 사건의 확실성 정도를 조절합니다.",
      formula: "must/might/can't + have + p.p.",
      rules: [
        "must have + 과거분사는 과거에 그랬음이 거의 확실하다는 추론입니다.",
        "might/may/could have는 가능성을 열어 둡니다.",
        "can't/couldn't have는 과거에 그랬을 리 없다는 강한 부정 추론입니다."
      ],
      contrast: {
        before: "He must left already.",
        after: "He must have left already.",
        note: "과거 추론은 조동사 + have + 과거분사 구조입니다."
      },
      examples: ["She might have missed the bus.", "They can't have seen the notice."],
      exercises: [
        {
          id: "b2-deduction-1",
          type: "choice",
          prompt: "His coat is gone. He ___ already.",
          options: ["must leave", "must have left", "should leaving"],
          answer: "must have left",
          explanation: "현재 증거로 과거 행동을 강하게 추론하므로 must have left입니다."
        },
        {
          id: "b2-deduction-2",
          type: "arrange",
          prompt: "그들이 변경 사항을 알았을 리 없다고 쓰세요.",
          tokens: ["about the change", "cannot have known", "They"],
          answer: "They cannot have known about the change.",
          explanation: "불가능에 가까운 과거 추론은 cannot have + 과거분사입니다."
        },
        {
          id: "b2-deduction-3",
          type: "input",
          prompt: "그가 약속을 잊었을지도 모른다고 쓰세요.",
          cue: "he / might / forget / our appointment",
          answers: ["He might have forgotten our appointment."],
          hint: "might have + forgotten을 사용하세요.",
          explanation: "확실하지 않은 과거 가능성을 나타냅니다."
        }
      ]
    },
    {
      id: "b2-causative-passive",
      level: "B2",
      category: "태",
      title: "사역과 고급 수동 구조",
      titleEn: "Causative and reporting passives",
      summary: "서비스를 받거나 일반적 평판을 행위자 없이 표현합니다.",
      formula: "have/get + object + p.p. · be believed to V",
      rules: [
        "have/get something done은 다른 사람에게 서비스를 받는 뜻입니다.",
        "be said/thought/believed to는 일반적 보도나 믿음을 간결하게 전달합니다.",
        "과거에 일어난 일을 보고할 때는 to have + 과거분사를 씁니다."
      ],
      contrast: {
        before: "I repaired my phone yesterday.",
        after: "I had my phone repaired yesterday.",
        note: "직접 수리한 것이 아니라 서비스를 맡겼다는 뜻입니다."
      },
      examples: ["The actor is said to live abroad.", "We're getting the windows replaced."],
      exercises: [
        {
          id: "b2-causative-1",
          type: "choice",
          prompt: "I dropped my phone, so I ___ yesterday.",
          options: ["had it repaired", "had repaired it", "was repairing it"],
          answer: "had it repaired",
          explanation: "수리 서비스를 받은 것이므로 have + 목적어 + 과거분사 구조입니다."
        },
        {
          id: "b2-causative-2",
          type: "arrange",
          prompt: "용의자는 출국한 것으로 여겨진다.",
          tokens: ["to have left the country", "is believed", "The suspect"],
          answer: "The suspect is believed to have left the country.",
          explanation: "보고 시점보다 앞선 행동이므로 to have left를 씁니다."
        },
        {
          id: "b2-causative-3",
          type: "input",
          prompt: "이번 주에 사무실 도색을 맡기고 있다고 쓰세요.",
          cue: "we / have / the office / paint / this week",
          answers: ["We are having the office painted this week.", "We're having the office painted this week."],
          hint: "are having + object + painted",
          explanation: "진행 중인 서비스는 현재진행형 사역 구조로 나타냅니다."
        }
      ]
    },
    {
      id: "b2-reporting-verbs",
      level: "B2",
      category: "동사형",
      title: "보고동사의 문형",
      titleEn: "Reporting verb patterns",
      summary: "의미가 다른 보고동사에 맞춰 -ing, to부정사, 목적어 문형을 고릅니다.",
      formula: "admit + -ing · advise + object + to V · deny + -ing",
      rules: [
        "admit, deny, suggest 뒤에는 -ing가 자주 옵니다.",
        "advise, remind, warn은 목적어 + to부정사 문형을 가질 수 있습니다.",
        "promise, agree, refuse 뒤에는 to부정사가 자주 옵니다."
      ],
      contrast: {
        before: "She suggested us to leave early.",
        after: "She suggested leaving early.",
        note: "suggest는 보통 목적어 + to부정사를 취하지 않습니다."
      },
      examples: ["He admitted copying the file.", "They warned us not to touch the wire."],
      exercises: [
        {
          id: "b2-reportverb-1",
          type: "choice",
          prompt: "The manager admitted ___ the deadline.",
          options: ["to miss", "missing", "miss"],
          answer: "missing",
          explanation: "admit 뒤에는 동명사 -ing가 옵니다."
        },
        {
          id: "b2-reportverb-2",
          type: "arrange",
          prompt: "의사는 나에게 잠을 더 자라고 조언했다.",
          tokens: ["to get more sleep", "advised me", "The doctor"],
          answer: "The doctor advised me to get more sleep.",
          explanation: "advise + 목적어 + to부정사 문형입니다."
        },
        {
          id: "b2-reportverb-3",
          type: "input",
          prompt: "그녀는 돈을 가져간 것을 부인했다고 쓰세요.",
          cue: "she / deny / take the money",
          answers: ["She denied taking the money."],
          hint: "deny 뒤에는 -ing가 옵니다.",
          explanation: "deny는 동명사를 목적어로 취합니다."
        }
      ]
    },
    {
      id: "b2-contrast",
      level: "B2",
      category: "담화",
      title: "대조를 연결하는 방식",
      titleEn: "Although, despite and whereas",
      summary: "절과 명사구를 구분해 양보·대조 관계를 정확히 연결합니다.",
      formula: "although + clause · despite + noun/-ing · whereas + clause",
      rules: [
        "although/even though 뒤에는 주어와 동사가 있는 절이 옵니다.",
        "despite/in spite of 뒤에는 명사나 -ing가 옵니다.",
        "whereas는 두 사실을 균형 있게 대조할 때 유용합니다."
      ],
      contrast: {
        before: "Despite he was tired, he continued.",
        after: "Despite being tired, he continued.",
        note: "despite 바로 뒤에는 완전한 절을 둘 수 없습니다."
      },
      examples: ["Although the task was difficult, we finished it.", "The north is dry, whereas the south is humid."],
      exercises: [
        {
          id: "b2-contrast-1",
          type: "choice",
          prompt: "___ the heavy traffic, we arrived on time.",
          options: ["Although", "Despite", "Whereas"],
          answer: "Despite",
          explanation: "the heavy traffic은 명사구이므로 despite가 맞습니다."
        },
        {
          id: "b2-contrast-2",
          type: "arrange",
          prompt: "과제가 어려웠지만 제시간에 끝냈다.",
          tokens: ["we finished it on time", "the task was difficult", "Although"],
          answer: "Although the task was difficult, we finished it on time.",
          explanation: "although 뒤에는 완전한 절이 옵니다."
        },
        {
          id: "b2-contrast-3",
          type: "input",
          prompt: "피곤했음에도 그는 계속 일했다고 쓰세요.",
          cue: "despite / be tired / he continue working",
          answers: ["Despite being tired, he continued working."],
          hint: "despite 뒤에 being을 사용하세요.",
          explanation: "despite + -ing 구조로 양보 관계를 만듭니다."
        }
      ]
    },
    {
      id: "b2-wishes",
      level: "B2",
      category: "가정법",
      title: "바람과 후회",
      titleEn: "Wish, if only and would rather",
      summary: "현재 불만, 과거 후회, 다른 사람에게 바라는 행동을 시제 이동으로 나타냅니다.",
      formula: "wish + past · wish + had p.p. · would rather + subject + past",
      rules: [
        "현재와 다른 바람은 wish + 과거형으로 나타냅니다.",
        "과거 후회는 wish/if only + had + 과거분사입니다.",
        "다른 사람의 현재·미래 행동을 바랄 때 would rather + 주어 + 과거형을 씁니다."
      ],
      contrast: {
        before: "I wish I know the answer.",
        after: "I wish I knew the answer.",
        note: "현재 사실과 다른 바람이므로 시제를 과거로 이동합니다."
      },
      examples: ["If only we'd left earlier.", "I'd rather you came tomorrow."],
      exercises: [
        {
          id: "b2-wish-1",
          type: "choice",
          prompt: "I wish I ___ more confident in meetings.",
          options: ["am", "were", "will be"],
          answer: "were",
          explanation: "현재 사실과 다른 바람이므로 과거형 were를 씁니다."
        },
        {
          id: "b2-wish-2",
          type: "arrange",
          prompt: "표를 더 일찍 예약했더라면 좋았을 텐데.",
          tokens: ["the tickets earlier", "had booked", "If only", "we"],
          answer: "If only we had booked the tickets earlier.",
          explanation: "과거 후회는 if only + had + 과거분사입니다."
        },
        {
          id: "b2-wish-3",
          type: "input",
          prompt: "네가 아무에게도 말하지 않았으면 한다고 쓰세요.",
          cue: "I would rather / you / not tell / anyone",
          answers: ["I would rather you did not tell anyone.", "I'd rather you didn't tell anyone."],
          hint: "would rather + 주어 + 과거형",
          explanation: "다른 사람의 행동에 대한 바람은 과거형으로 거리를 둡니다."
        }
      ]
    },

    {
      id: "c1-negative-inversion",
      level: "C1",
      category: "강조",
      title: "부정어 도치로 강조하기",
      titleEn: "Inversion after negative adverbials",
      summary: "부정·제한 부사어를 앞으로 보내 격식 있고 강한 강조를 만듭니다.",
      formula: "negative adverbial + auxiliary + subject + verb",
      rules: [
        "never, rarely, little, not only 등을 문두에 두면 주어와 조동사를 도치합니다.",
        "기존 조동사가 없으면 do/does/did를 추가합니다.",
        "no sooner ... than, hardly ... when은 연속된 두 사건을 강조합니다."
      ],
      contrast: {
        before: "Rarely I have seen such care.",
        after: "Rarely have I seen such care.",
        note: "문두의 rarely 뒤에서 조동사 have와 주어 I가 도치됩니다."
      },
      examples: ["Little did we know what would happen.", "Not only did she apologise, but she also offered a refund."],
      exercises: [
        {
          id: "c1-inversion-1",
          type: "choice",
          prompt: "Rarely ___ such a convincing argument.",
          options: ["I have heard", "have I heard", "did I heard"],
          answer: "have I heard",
          explanation: "문두 부정 부사 rarely 뒤에서는 조동사와 주어를 도치합니다."
        },
        {
          id: "c1-inversion-2",
          type: "arrange",
          prompt: "그녀는 사과했을 뿐 아니라 환불도 제안했다.",
          tokens: ["but she also offered a refund", "did she apologise", "Not only"],
          answer: "Not only did she apologise, but she also offered a refund.",
          explanation: "Not only가 문두에 오면 did + 주어 + 동사원형으로 도치합니다."
        },
        {
          id: "c1-inversion-3",
          type: "input",
          prompt: "앉자마자 불이 꺼졌다고 no sooner로 쓰세요.",
          cue: "no sooner / we sit down / than / the lights go out",
          answers: ["No sooner had we sat down than the lights went out."],
          hint: "No sooner + had + 주어 + 과거분사 + than",
          explanation: "먼저 일어난 사건은 과거완료 도치로 표현합니다."
        }
      ]
    },
    {
      id: "c1-conditional-inversion",
      level: "C1",
      category: "조건문",
      title: "if 없는 격식 조건문",
      titleEn: "Inverted conditionals",
      summary: "should, were, had 도치로 조건을 더 간결하고 격식 있게 표현합니다.",
      formula: "Should + S + V · Were + S + to V · Had + S + p.p.",
      rules: [
        "가능한 미래 조건은 Should + 주어 + 동사원형으로 만들 수 있습니다.",
        "비현실적 현재는 Were + 주어 + to부정사로 격식 있게 표현합니다.",
        "과거 반대 사실은 Had + 주어 + 과거분사로 도치합니다."
      ],
      contrast: {
        before: "If you should need help, call this number.",
        after: "Should you need help, call this number.",
        note: "if를 생략하고 should를 문두로 이동합니다."
      },
      examples: ["Were the system to fail, the backup would start.", "Had I known, I would have acted differently."],
      exercises: [
        {
          id: "c1-condinv-1",
          type: "choice",
          prompt: "___ about the delay, I would have taken another route.",
          options: ["Had I known", "Should I know", "Were I know"],
          answer: "Had I known",
          explanation: "과거 반대 조건의 도치는 Had + 주어 + 과거분사입니다."
        },
        {
          id: "c1-condinv-2",
          type: "arrange",
          prompt: "도움이 필요하면 안내 데스크에 연락하십시오.",
          tokens: ["please contact reception", "require assistance", "Should you"],
          answer: "Should you require assistance, please contact reception.",
          explanation: "격식 있는 미래 조건은 Should you + 동사원형으로 시작합니다."
        },
        {
          id: "c1-condinv-3",
          type: "input",
          prompt: "계획이 실패한다면 대안이 필요할 것이라고 쓰세요.",
          cue: "were / the plan / fail / we need an alternative",
          answers: ["Were the plan to fail, we would need an alternative."],
          hint: "Were + 주어 + to부정사",
          explanation: "가능성이 낮은 현재·미래 가정을 격식 있게 도치했습니다."
        }
      ]
    },
    {
      id: "c1-cleft-sentences",
      level: "C1",
      category: "강조",
      title: "문장을 갈라 초점 만들기",
      titleEn: "Cleft and pseudo-cleft sentences",
      summary: "it-cleft와 what-cleft로 정보의 초점을 원하는 위치에 놓습니다.",
      formula: "It is/was X that/who ... · What ... is X",
      rules: [
        "It-cleft는 사람·시간·장소 등 특정 요소를 대비해 강조합니다.",
        "What-cleft는 what절 밖의 정보를 초점으로 만듭니다.",
        "강조하려는 정보에 따라 원래 문장을 자연스럽게 분리해야 합니다."
      ],
      contrast: {
        before: "Alex solved the problem, not Mina.",
        after: "It was Alex who solved the problem.",
        note: "행위자 Alex를 다른 사람과 대비해 강조합니다."
      },
      examples: ["What worries me is the lack of evidence.", "It was after midnight that they finally arrived."],
      exercises: [
        {
          id: "c1-cleft-1",
          type: "choice",
          prompt: "___ who first noticed the error.",
          options: ["It was Alex", "What Alex was", "There was Alex"],
          answer: "It was Alex",
          explanation: "사람 Alex를 강조하는 it-cleft 구조입니다."
        },
        {
          id: "c1-cleft-2",
          type: "arrange",
          prompt: "내게 가장 필요한 것은 며칠의 휴식이다.",
          tokens: ["is", "What I need most", "a few days off"],
          answer: "What I need most is a few days off.",
          explanation: "what절 밖의 a few days off에 초점을 둔 pseudo-cleft입니다."
        },
        {
          id: "c1-cleft-3",
          type: "input",
          prompt: "내 의견을 바꾼 것은 마지막 장이었다고 강조하세요.",
          cue: "the final chapter / change my opinion",
          answers: ["It was the final chapter that changed my opinion."],
          hint: "It was + 강조 요소 + that ...",
          explanation: "the final chapter를 초점으로 둔 it-cleft입니다."
        }
      ]
    },
    {
      id: "c1-participle-clauses",
      level: "C1",
      category: "절",
      title: "분사절로 문장 압축하기",
      titleEn: "Participle clauses",
      summary: "같은 주어의 원인·시간·결과 정보를 분사절로 간결하게 압축합니다.",
      formula: "-ing / p.p. / having + p.p., main clause",
      rules: [
        "현재분사절은 능동적·동시적 관계, 과거분사절은 수동적 관계를 자주 나타냅니다.",
        "Having + 과거분사는 주절보다 먼저 완료된 일을 강조합니다.",
        "분사절의 의미상 주어는 원칙적으로 주절의 주어와 같아야 합니다."
      ],
      contrast: {
        before: "Walking to work, the rain started.",
        after: "Walking to work, I was caught in the rain.",
        note: "걷고 있는 주체와 주절의 주어가 같아야 합니다."
      },
      examples: ["Having reviewed the data, we changed the model.", "Built in 1890, the house needs careful repair."],
      exercises: [
        {
          id: "c1-participle-1",
          type: "choice",
          prompt: "___ the final interview, she waited for the decision.",
          options: ["Having completed", "Completed", "Have completing"],
          answer: "Having completed",
          explanation: "면접 완료가 기다림보다 먼저이므로 Having + 과거분사를 씁니다."
        },
        {
          id: "c1-participle-2",
          type: "arrange",
          prompt: "비용 상승에 직면한 회사는 예산을 줄였다.",
          tokens: ["the company reduced its budget", "with rising costs", "Faced"],
          answer: "Faced with rising costs, the company reduced its budget.",
          explanation: "회사가 상황에 직면한 수동 관계이므로 과거분사 Faced를 씁니다."
        },
        {
          id: "c1-participle-3",
          type: "input",
          prompt: "답을 몰라서 침묵했다고 분사절로 쓰세요.",
          cue: "not know the answer / I remain silent",
          answers: ["Not knowing the answer, I remained silent."],
          hint: "부정은 분사 앞에 not을 둡니다.",
          explanation: "두 절의 주어가 I로 같고, 능동적 원인을 -ing 분사절로 압축했습니다."
        }
      ]
    },
    {
      id: "c1-advanced-passive",
      level: "C1",
      category: "태",
      title: "복합 시제의 수동 보고",
      titleEn: "Advanced passive review",
      summary: "진행·완료·보고 구조가 결합된 수동태를 정확히 운용합니다.",
      formula: "be + being + p.p. · have been + p.p. · be reported to be/have",
      rules: [
        "진행 수동은 be + being + 과거분사, 완료 수동은 have been + 과거분사입니다.",
        "보고 수동 뒤의 사건이 동시에 진행되면 to be -ing를 쓸 수 있습니다.",
        "보고보다 먼저 일어난 사건은 to have + 과거분사를 씁니다."
      ],
      contrast: {
        before: "The drug is thought that it was tested abroad.",
        after: "The drug is thought to have been tested abroad.",
        note: "과거의 수동 사건을 to have been + 과거분사로 압축합니다."
      },
      examples: ["The road is being widened.", "The figures are reported to have been revised."],
      exercises: [
        {
          id: "c1-advpassive-1",
          type: "choice",
          prompt: "The manuscript is thought ___ in the fifteenth century.",
          options: ["to write", "to have been written", "to be writing"],
          answer: "to have been written",
          explanation: "과거에 작성된 수동 사건이므로 to have been written입니다."
        },
        {
          id: "c1-advpassive-2",
          type: "arrange",
          prompt: "장관은 사임을 고려 중인 것으로 보도됐다.",
          tokens: ["to be considering resignation", "was reported", "The minister"],
          answer: "The minister was reported to be considering resignation.",
          explanation: "보도 시점에 진행 중인 행동은 to be + -ing로 나타냅니다."
        },
        {
          id: "c1-advpassive-3",
          type: "input",
          prompt: "그 정책이 바뀔 것이라고 널리 여겨진다고 쓰세요.",
          cue: "it / widely believe / the policy will change",
          answers: ["It is widely believed that the policy will change."],
          hint: "It is widely believed that ...",
          explanation: "비인칭 수동 구조로 믿음의 주체를 일반화합니다."
        }
      ]
    },
    {
      id: "c1-ellipsis-substitution",
      level: "C1",
      category: "담화",
      title: "반복을 지우는 문법",
      titleEn: "Ellipsis and substitution",
      summary: "문맥상 분명한 요소를 생략하거나 대용어로 바꿔 자연스러운 글을 만듭니다.",
      formula: "so/not · do so · one/ones · auxiliary ellipsis",
      rules: [
        "think, hope, suppose 뒤에서 so/not으로 앞 절 전체를 대신할 수 있습니다.",
        "반복되는 동사구는 조동사만 남기거나 do so로 대체할 수 있습니다.",
        "반복되는 가산명사는 one/ones, 격식 문체에서는 that/those로 대신할 수 있습니다."
      ],
      contrast: {
        before: "Jin ordered tea, and I ordered tea too.",
        after: "Jin ordered tea, and I did too.",
        note: "두 번째 ordered tea를 조동사 did로 대신합니다."
      },
      examples: ["Will prices fall? I hope so.", "The coastal route is longer than the inland one."],
      exercises: [
        {
          id: "c1-ellipsis-1",
          type: "choice",
          prompt: "‘Will the plan work?’ ‘I hope ___.’",
          options: ["it", "so", "do"],
          answer: "so",
          explanation: "hope so에서 so가 앞의 긍정 절 전체를 대신합니다."
        },
        {
          id: "c1-ellipsis-2",
          type: "arrange",
          prompt: "나는 채식 메뉴를 주문했고 미나도 그랬다.",
          tokens: ["and Mina did too", "the vegetarian dish", "I ordered"],
          answer: "I ordered the vegetarian dish, and Mina did too.",
          explanation: "Mina 뒤의 did가 ordered the vegetarian dish를 대신합니다."
        },
        {
          id: "c1-ellipsis-3",
          type: "input",
          prompt: "northern route의 반복을 one으로 피하세요.",
          cue: "The northern route is shorter than the southern route.",
          answers: ["The northern route is shorter than the southern one."],
          hint: "두 번째 route를 one으로 바꾸세요.",
          explanation: "같은 종류의 단수 가산명사 반복은 one으로 대체할 수 있습니다."
        }
      ]
    },
    {
      id: "c1-unreal-time",
      level: "C1",
      category: "가정법",
      title: "시간을 뒤로 밀어 거리 두기",
      titleEn: "Unreal time",
      summary: "현재·과거 사실과 거리를 두기 위해 시제를 의도적으로 뒤로 이동합니다.",
      formula: "It's time + past · as if + past/past perfect · would rather + past perfect",
      rules: [
        "It's time + 과거형은 지금 해야 할 일이 이미 늦었다는 뉘앙스를 줍니다.",
        "as if/as though 뒤의 과거형은 현재 사실과 거리를 둡니다.",
        "과거에 대한 아쉬움은 would rather + 주어 + had + 과거분사로 나타냅니다."
      ],
      contrast: {
        before: "It's time we leave.",
        after: "It's time we left.",
        note: "현재 해야 할 일을 말하지만 비현실 시제인 과거형을 씁니다."
      },
      examples: ["He acts as though he owned the place.", "I'd rather you had asked first."],
      exercises: [
        {
          id: "c1-unreal-1",
          type: "choice",
          prompt: "It's time we ___ a final decision.",
          options: ["make", "made", "had making"],
          answer: "made",
          explanation: "It's time 뒤에는 현재 의미라도 과거형을 씁니다."
        },
        {
          id: "c1-unreal-2",
          type: "arrange",
          prompt: "네가 더 일찍 말해줬더라면 좋았을 텐데.",
          tokens: ["you", "had told me earlier", "I would rather"],
          answer: "I would rather you had told me earlier.",
          explanation: "과거 행동에 대한 바람은 would rather + 과거완료입니다."
        },
        {
          id: "c1-unreal-3",
          type: "input",
          prompt: "그녀가 모든 것을 아는 것처럼 말한다고 쓰세요.",
          cue: "she talks / as though / she know everything",
          answers: ["She talks as though she knew everything."],
          hint: "현재 사실과 거리를 두어 knew를 사용하세요.",
          explanation: "실제로 다 안다는 뜻이 아니라 그렇게 행동한다는 거리 두기입니다."
        }
      ]
    },
    {
      id: "c1-hedging",
      level: "C1",
      category: "담화",
      title: "주장을 정교하게 낮추기",
      titleEn: "Hedging and cautious claims",
      summary: "학술·업무 문맥에서 증거의 강도만큼만 주장하도록 표현을 조절합니다.",
      formula: "appear/seem to · may well · tends to · it would seem that",
      rules: [
        "appear, seem, tend는 단정 대신 관찰에 근거한 경향을 나타냅니다.",
        "may, might, could와 likely/unlikely로 가능성의 강도를 조절합니다.",
        "It would seem that, there is little evidence to 같은 비인칭 구조는 격식 있는 신중함을 만듭니다."
      ],
      contrast: {
        before: "The data proves that remote work is always better.",
        after: "The data appears to suggest that remote work can be beneficial.",
        note: "증거가 허용하는 범위까지만 주장을 낮춥니다."
      },
      examples: ["The treatment may well reduce symptoms.", "There is little evidence to support that conclusion."],
      exercises: [
        {
          id: "c1-hedge-1",
          type: "choice",
          prompt: "The initial evidence ___ a modest improvement.",
          options: ["proves completely", "appears to suggest", "must proving"],
          answer: "appears to suggest",
          explanation: "initial evidence에 맞는 신중한 주장은 appears to suggest입니다."
        },
        {
          id: "c1-hedge-2",
          type: "arrange",
          prompt: "그 주장을 뒷받침할 증거가 거의 없다.",
          tokens: ["to support the claim", "little evidence", "There is"],
          answer: "There is little evidence to support the claim.",
          explanation: "비인칭 구조로 증거의 부족을 객관적으로 표현합니다."
        },
        {
          id: "c1-hedge-3",
          type: "input",
          prompt: "결과가 과장된 듯하다고 신중하게 쓰세요.",
          cue: "it / would seem / the results / overstate",
          answers: ["It would seem that the results were overstated."],
          hint: "It would seem that + 수동태",
          explanation: "would seem으로 단정을 피하고 were overstated로 결과에 초점을 둡니다."
        }
      ]
    }
  ];

  window.GRAMMAR_LEVELS = levels;
  window.GRAMMAR_CURRICULUM = curriculum;
})();
