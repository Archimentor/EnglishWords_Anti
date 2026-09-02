(function () {
  "use strict";

  const lessons = {
    "a1-be-have": {
      overview: {
        title: "영어 문장은 ‘누구인지’와 ‘무엇을 가졌는지’를 다르게 말합니다",
        lead: "be동사는 주어와 설명을 연결하고, have got은 주어가 가진 사람·사물을 꺼내 보여 줍니다. 두 구조를 구분하면 자기소개 문장의 뼈대가 생깁니다.",
        why: "한국어의 ‘이다·있다’는 문맥에 따라 생략되기도 하지만 영어 문장은 동사를 비워 둘 수 없습니다. 그래서 주어를 본 순간 am/is/are 또는 have/has got 중 무엇이 필요한지 먼저 결정해야 합니다.",
        outcomes: [
          "주어에 맞춰 am, is, are를 고를 수 있습니다.",
          "be동사 문장의 긍정·부정·질문 순서를 바꿀 수 있습니다.",
          "상태를 설명하는 be와 소유를 나타내는 have got을 구분할 수 있습니다."
        ]
      },
      concepts: [
        {
          title: "be동사는 주어와 설명을 잇는 등호입니다",
          body: "I am a student에서 am은 ‘행동’을 뜻하지 않습니다. I와 a student가 같은 사람이라는 관계를 연결합니다. 뒤에는 이름이나 직업 같은 명사, happy 같은 상태를 나타내는 형용사, at home 같은 위치 표현이 올 수 있습니다.",
          key: "주어 = 뒤의 설명이라고 생각하면 be동사의 역할이 보입니다."
        },
        {
          title: "be동사의 모양은 주어가 결정합니다",
          body: "현재형 be는 am, is, are 세 모양을 가집니다. I만 am을 쓰고, 한 사람·한 사물인 he, she, it은 is를 씁니다. you와 둘 이상인 we, they는 are를 씁니다. 이름도 대명사로 바꾸어 판단합니다. Mina는 she, my parents는 they입니다.",
          key: "동사 앞의 명사를 I / he·she·it / you·we·they 중 하나로 바꾸어 보세요."
        },
        {
          title: "have got은 ‘지금 가지고 있음’을 한 덩어리로 말합니다",
          body: "I have got a bike에서 have got 전체가 소유를 나타냅니다. 이때 got을 ‘얻었다’라고 따로 해석하지 않습니다. he, she, it에서는 has got이 됩니다. 일상 영국 영어에서는 I've got, she's got처럼 줄여 쓰는 경우가 많습니다.",
          key: "I am a bike가 아니라 I have got a bike입니다. 정체와 소유를 구분하세요."
        }
      ],
      formRows: [
        { label: "be 긍정", pattern: "I am · he/she/it is · you/we/they are", example: "Mina is twelve years old.", translation: "미나는 열두 살입니다.", note: "나이도 영어에서는 be동사 뒤에 놓습니다." },
        { label: "be 부정", pattern: "subject + am/is/are + not", example: "We are not late.", translation: "우리는 늦지 않았습니다.", note: "not은 be동사 바로 뒤에 놓습니다." },
        { label: "be 질문", pattern: "Am/Is/Are + subject + ...?", example: "Are you ready?", translation: "준비됐나요?", note: "be동사를 주어 앞으로 이동합니다." },
        { label: "소유 긍정", pattern: "I/you/we/they have got · he/she/it has got", example: "She has got two brothers.", translation: "그녀에게는 남자 형제가 두 명 있습니다.", note: "주어가 she이므로 has got을 씁니다." },
        { label: "소유 부정", pattern: "subject + haven't/hasn't got + noun", example: "I haven't got a car.", translation: "나는 차가 없습니다.", note: "have/has 뒤에 not을 붙입니다." },
        { label: "소유 질문", pattern: "Have/Has + subject + got + noun?", example: "Have you got a pen?", translation: "펜이 있나요?", note: "have 또는 has를 주어 앞으로 이동합니다." }
      ],
      uses: [
        { title: "정체와 관계", signal: "누구인가", body: "이름, 직업, 국적, 가족 관계처럼 주어가 누구인지 설명할 때 be를 씁니다.", example: "This is my cousin, Leo.", translation: "이쪽은 내 사촌 레오입니다." },
        { title: "상태와 위치", signal: "어떠한가·어디인가", body: "감정, 상태, 나이, 위치도 주어를 설명하는 정보이므로 be 뒤에 놓습니다.", example: "The keys are on the table.", translation: "열쇠는 탁자 위에 있습니다." },
        { title: "소유와 가족", signal: "무엇이 있는가", body: "물건뿐 아니라 가족, 특징을 가지고 있다고 말할 때 have got을 씁니다.", example: "Our house has got a small garden.", translation: "우리 집에는 작은 정원이 있습니다." }
      ],
      koreanContrast: {
        title: "한국어의 ‘있다’ 하나가 영어에서는 둘로 갈립니다",
        body: "한국어에서는 위치와 소유에 모두 ‘있다’를 쓰지만 영어는 대상을 설명하는지, 소유하는지를 구분합니다.",
        pairs: [
          { korean: "민수는 교실에 있어.", english: "Minsu is in the classroom.", note: "민수의 위치를 설명하므로 be를 씁니다." },
          { korean: "민수는 새 가방이 있어.", english: "Minsu has got a new bag.", note: "민수가 가진 물건을 말하므로 has got을 씁니다." },
          { korean: "나는 열세 살이야.", english: "I am thirteen.", note: "영어에서 나이는 have가 아니라 be로 말합니다." }
        ]
      },
      walkthroughs: [
        {
          sentence: "My parents are at work.",
          translation: "우리 부모님은 직장에 계십니다.",
          intent: "두 사람의 현재 위치를 설명하는 문장",
          chunks: [
            { text: "My parents", role: "주어", note: "두 명이므로 they로 바꿀 수 있습니다." },
            { text: "are", role: "연결 동사", note: "복수 주어에 맞는 be동사입니다." },
            { text: "at work", role: "위치 설명", note: "주어가 어디에 있는지 덧붙입니다." }
          ],
          takeaway: "주어를 they로 바꿀 수 있으면 are를 선택합니다."
        },
        {
          sentence: "Has Ella got a dog?",
          translation: "엘라에게 개가 있나요?",
          intent: "한 사람이 가진 동물을 묻는 문장",
          chunks: [
            { text: "Has", role: "질문 신호", note: "Ella는 she이므로 has가 앞으로 옵니다." },
            { text: "Ella", role: "주어", note: "소유의 주체입니다." },
            { text: "got a dog", role: "소유 내용", note: "got과 목적어는 뒤에 남습니다." }
          ],
          takeaway: "have got 질문은 have/has만 주어 앞으로 이동합니다."
        }
      ],
      traps: [
        { wrong: "She are kind.", right: "She is kind.", why: "she는 한 사람이므로 is를 씁니다." },
        { wrong: "I am have a brother.", right: "I have got a brother.", why: "소유를 말할 때 be와 have got을 겹쳐 쓰지 않습니다." },
        { wrong: "He have got blue eyes.", right: "He has got blue eyes.", why: "he 뒤에서는 have가 has로 바뀝니다." },
        { wrong: "You are tired?", right: "Are you tired?", why: "질문에서는 are를 주어 앞으로 옮깁니다." }
      ],
      summary: {
        statement: "설명이면 be, 소유이면 have got. 그다음 주어에 맞춰 동사의 모양을 고릅니다.",
        points: ["I—am / he·she·it—is / you·we·they—are", "be 부정은 be + not, 질문은 be + 주어", "have got은 I·you·we·they, has got은 he·she·it"]
      }
    },

    "a1-present-simple": {
      overview: {
        title: "현재단순은 ‘지금 한 번’이 아니라 반복되는 삶을 말합니다",
        lead: "매일 하는 일, 변하지 않는 사실, 정해진 일정을 말할 때 현재단순을 씁니다. 핵심은 주어가 he·she·it일 때 동사에 붙는 -s와 질문·부정을 만드는 do/does입니다.",
        why: "한국어 동사는 주어가 바뀌어도 모양이 같지만 영어 현재형은 3인칭 단수 주어를 동사에 표시합니다. 이 작은 -s가 문장의 주어를 확인했다는 신호입니다.",
        outcomes: ["현재단순이 필요한 반복·사실·일정 상황을 구분합니다.", "3인칭 단수 주어 뒤에서 동사의 형태를 바꿉니다.", "do/does로 부정문과 질문을 만듭니다."]
      },
      concepts: [
        { title: "현재단순은 반복되는 시간 전체를 봅니다", body: "I walk to school은 반드시 지금 걷는 장면을 뜻하지 않습니다. 평소 통학 방법을 말합니다. every day, usually, often, sometimes, never 같은 빈도 표현이 현재단순의 단서가 됩니다.", key: "한 장의 사진이 아니라 반복되는 달력을 떠올리세요." },
        { title: "he·she·it은 동사에 -s를 남깁니다", body: "I work와 She works의 차이는 주어입니다. 대부분 -s를 붙이고, -s·-sh·-ch·-x·-o로 끝나면 -es를 붙입니다. consonant + y는 y를 i로 바꾸어 -es를 붙여 study → studies가 됩니다.", key: "주어가 한 사람·한 사물이면 동사의 끝을 확인합니다." },
        { title: "do와 does는 질문·부정을 만드는 도움 동사입니다", body: "일반동사 자체는 앞으로 이동하거나 바로 not을 붙이지 못합니다. 그래서 do/does가 문법 정보를 맡습니다. Does she work?에서 3인칭 표시는 does에 이미 있으므로 work에는 -s를 붙이지 않습니다.", key: "does가 등장하면 본동사는 원형으로 돌아갑니다." }
      ],
      formRows: [
        { label: "긍정 I/you/we/they", pattern: "subject + base verb", example: "They play tennis on Sundays.", translation: "그들은 일요일마다 테니스를 칩니다.", note: "복수 주어 뒤에는 동사원형을 씁니다." },
        { label: "긍정 he/she/it", pattern: "subject + verb-s/-es", example: "Joon watches TV after dinner.", translation: "준은 저녁 식사 후 TV를 봅니다.", note: "watch는 -ch로 끝나므로 -es를 붙입니다." },
        { label: "부정", pattern: "subject + don't/doesn't + base verb", example: "Mia doesn't like spicy food.", translation: "미아는 매운 음식을 좋아하지 않습니다.", note: "doesn't 뒤의 like에는 -s가 없습니다." },
        { label: "예/아니요 질문", pattern: "Do/Does + subject + base verb?", example: "Do you live near here?", translation: "이 근처에 사나요?", note: "you와 함께 Do를 씁니다." },
        { label: "의문사 질문", pattern: "Wh-word + do/does + subject + base verb?", example: "Where does Ben work?", translation: "벤은 어디에서 일하나요?", note: "의문사 뒤에도 does + 주어 + 원형 순서를 유지합니다." }
      ],
      uses: [
        { title: "습관과 반복", signal: "every day · usually · often", body: "일정한 간격으로 반복되는 행동과 생활 습관을 말합니다.", example: "I usually get up at seven.", translation: "나는 보통 7시에 일어납니다." },
        { title: "일반적인 사실", signal: "always true", body: "과학적 사실이나 오래 지속되는 상태를 말합니다.", example: "Water freezes at zero degrees.", translation: "물은 0도에서 업니다." },
        { title: "정해진 일정", signal: "timetable", body: "시간표처럼 이미 정해진 출발·시작 시간을 말합니다.", example: "The class starts at nine.", translation: "수업은 9시에 시작합니다." },
        { title: "생각과 감정 상태", signal: "like · know · want", body: "진행 동작이 아닌 생각·선호·소유 상태는 보통 현재단순으로 말합니다.", example: "She knows the answer.", translation: "그녀는 답을 압니다." }
      ],
      koreanContrast: {
        title: "한국어에는 없는 ‘3인칭 단수 -s’를 의식해야 합니다",
        body: "한국어 ‘가다’는 내가 가도, 그가 가도 형태가 같지만 영어는 주어가 he·she·it일 때 현재형 동사에 표시를 남깁니다.",
        pairs: [
          { korean: "나는 매일 걸어가.", english: "I walk every day.", note: "I 뒤에는 원형 walk를 씁니다." },
          { korean: "민지는 매일 걸어가.", english: "Minji walks every day.", note: "Minji는 she이므로 walks가 됩니다." },
          { korean: "민지는 걸어가지 않아.", english: "Minji doesn't walk.", note: "3인칭 표시는 doesn't가 맡으므로 walk는 원형입니다." }
        ]
      },
      walkthroughs: [
        { sentence: "My father works at a hospital.", translation: "우리 아버지는 병원에서 일합니다.", intent: "직업과 평소 근무지를 말하는 문장", chunks: [{ text: "My father", role: "3인칭 단수 주어", note: "he로 바꿀 수 있습니다." }, { text: "works", role: "현재단순 동사", note: "work에 -s를 붙입니다." }, { text: "at a hospital", role: "장소 정보", note: "어디에서 일하는지 덧붙입니다." }], takeaway: "현재의 직업처럼 지속되는 사실에는 현재단순을 씁니다." },
        { sentence: "Does your sister study English?", translation: "당신의 여동생은 영어를 공부하나요?", intent: "한 사람의 반복 행동을 묻는 문장", chunks: [{ text: "Does", role: "질문·3인칭 신호", note: "sister가 she이므로 does를 씁니다." }, { text: "your sister", role: "주어", note: "질문의 대상입니다." }, { text: "study English", role: "동사원형 + 목적어", note: "does 뒤라 studies가 아닌 study입니다." }], takeaway: "does와 동사 -s를 한 문장에 동시에 쓰지 않습니다." }
      ],
      traps: [
        { wrong: "She go to school by bus.", right: "She goes to school by bus.", why: "she 뒤의 현재형 동사에는 -s/-es가 필요합니다." },
        { wrong: "He doesn't eats meat.", right: "He doesn't eat meat.", why: "doesn't가 3인칭 표시를 이미 가지므로 eat은 원형입니다." },
        { wrong: "Are you like music?", right: "Do you like music?", why: "like는 일반동사이므로 do로 질문합니다." },
        { wrong: "I am go to school every day.", right: "I go to school every day.", why: "일반동사 현재형 앞에 be동사를 덧붙이지 않습니다." }
      ],
      summary: { statement: "반복·사실·일정에는 현재단순. he·she·it의 긍정문만 동사에 -s를 붙입니다.", points: ["I/you/we/they + 동사원형", "he/she/it + 동사-s/-es", "does/doesn't 뒤에는 언제나 동사원형"] }
    },

    "a1-question-forms": {
      overview: {
        title: "영어 질문은 억양보다 ‘문장 앞의 신호’가 먼저입니다",
        lead: "질문을 만들 때는 문장의 동사가 be인지 일반동사인지 먼저 찾습니다. be가 있으면 앞으로 보내고, 일반동사이면 do 또는 does를 앞에 세웁니다.",
        why: "한국어는 평서문과 같은 어순에 물음 억양만 더해도 질문이 되지만, 영어는 대개 앞부분의 순서를 바꾸어 질문임을 표시합니다.",
        outcomes: ["be동사 질문과 일반동사 질문을 구분합니다.", "Yes/No 질문과 의문사 질문의 순서를 만듭니다.", "질문에 맞는 짧은 대답을 사용합니다."]
      },
      concepts: [
        { title: "먼저 문장 속 동사를 찾습니다", body: "She is tired에서는 is가 이미 있으므로 Is she tired?로 옮기기만 합니다. She likes music에서는 일반동사 likes만 있으므로 Do/Does의 도움이 필요합니다. 질문을 만들기 전에 be동사 문장인지 일반동사 문장인지 분류하는 습관이 중요합니다.", key: "be가 보이면 이동, be가 없으면 do/does를 호출합니다." },
        { title: "의문사는 질문의 빈칸 종류를 알려 줍니다", body: "who는 사람, where는 장소, when은 시간, what은 사물·정보, why는 이유, how는 방법을 묻습니다. 의문사를 문장 맨 앞에 놓은 뒤에도 나머지 질문 순서는 유지합니다: Where does he live?", key: "의문사 + 질문 순서의 두 층으로 생각하세요." },
        { title: "짧은 대답에도 질문의 도움 동사를 되풀이합니다", body: "Are you ready?에는 Yes, I am. Do they work here?에는 Yes, they do.처럼 대답합니다. 질문에서 사용한 be 또는 do/does를 그대로 가져오면 됩니다.", key: "Yes/No 뒤에 주어와 질문의 동사를 다시 붙입니다." }
      ],
      formRows: [
        { label: "be Yes/No", pattern: "Am/Is/Are + subject + complement?", example: "Is Leo at home?", translation: "레오는 집에 있나요?", note: "is를 Leo 앞으로 보냅니다." },
        { label: "일반동사 Yes/No", pattern: "Do/Does + subject + base verb?", example: "Does Leo live here?", translation: "레오는 여기에 사나요?", note: "does 뒤의 live는 원형입니다." },
        { label: "be 의문사", pattern: "Wh-word + am/is/are + subject?", example: "Where are my keys?", translation: "내 열쇠는 어디에 있나요?", note: "where 뒤에 are + 주어를 놓습니다." },
        { label: "일반동사 의문사", pattern: "Wh-word + do/does + subject + base verb?", example: "What does this word mean?", translation: "이 단어는 무슨 뜻인가요?", note: "mean에 -s를 붙이지 않습니다." },
        { label: "짧은 대답", pattern: "Yes/No + subject + be/do/does", example: "No, she doesn't.", translation: "아니요, 그렇지 않습니다.", note: "부정 대답은 보통 축약형을 씁니다." }
      ],
      uses: [
        { title: "사실 확인", signal: "yes or no", body: "맞는지 아닌지 확인할 때 Yes/No 질문을 씁니다.", example: "Are you a new student?", translation: "새 학생인가요?" },
        { title: "구체적인 정보", signal: "who · what · where · when", body: "대답의 종류를 지정하려면 알맞은 의문사를 앞에 둡니다.", example: "When does the film start?", translation: "영화는 언제 시작하나요?" },
        { title: "방법과 상태", signal: "how", body: "방법, 상태, 정도를 물을 때 how를 사용합니다.", example: "How do you go to school?", translation: "학교에 어떻게 가나요?" }
      ],
      koreanContrast: {
        title: "‘너 음악 좋아해?’의 어순을 그대로 옮기면 안 됩니다",
        body: "한국어 질문은 ‘너 음악 좋아해?’처럼 평서문 어순을 유지하지만 영어 일반동사 질문에는 앞쪽 질문 신호가 필요합니다.",
        pairs: [
          { korean: "너 피곤해?", english: "Are you tired?", note: "tired를 연결하는 are를 앞으로 옮깁니다." },
          { korean: "너 음악 좋아해?", english: "Do you like music?", note: "like는 일반동사이므로 Do를 추가합니다." },
          { korean: "네 형은 어디 살아?", english: "Where does your brother live?", note: "Where + does + 주어 + 동사원형입니다." }
        ]
      },
      walkthroughs: [
        { sentence: "Why is the window open?", translation: "창문은 왜 열려 있나요?", intent: "상태의 이유를 묻는 be동사 질문", chunks: [{ text: "Why", role: "필요한 정보", note: "이유를 묻습니다." }, { text: "is", role: "질문 신호", note: "window가 it이므로 is입니다." }, { text: "the window", role: "주어", note: "무엇이 열려 있는지 나타냅니다." }, { text: "open", role: "상태 설명", note: "주어의 상태입니다." }], takeaway: "의문사가 있어도 is는 주어 앞에 놓입니다." },
        { sentence: "What time does your class finish?", translation: "수업은 몇 시에 끝나나요?", intent: "일정의 시간을 묻는 일반동사 질문", chunks: [{ text: "What time", role: "시간 의문사", note: "몇 시인지 묻습니다." }, { text: "does", role: "질문·3인칭 신호", note: "class가 it이므로 does입니다." }, { text: "your class", role: "주어", note: "끝나는 대상입니다." }, { text: "finish", role: "동사원형", note: "does 뒤라 finishes가 아닙니다." }], takeaway: "긴 의문사 뒤에도 does + 주어 + 원형 순서는 같습니다." }
      ],
      traps: [
        { wrong: "You are at home?", right: "Are you at home?", why: "be동사 질문에서는 are를 주어 앞으로 옮깁니다." },
        { wrong: "Does she likes tea?", right: "Does she like tea?", why: "does가 있으면 본동사는 원형입니다." },
        { wrong: "Where you live?", right: "Where do you live?", why: "일반동사 질문에는 do가 필요합니다." },
        { wrong: "Do he work here?", right: "Does he work here?", why: "he와 함께 does를 씁니다." }
      ],
      summary: { statement: "be가 있으면 앞으로, 일반동사이면 do/does를 앞으로. 의문사는 그보다 더 앞에 둡니다.", points: ["be + 주어 ...?", "do/does + 주어 + 동사원형 ...?", "의문사 + 위의 질문 순서"] }
    },

    "a1-present-continuous": {
      overview: {
        title: "현재진행형은 지금 펼쳐지는 장면을 문장으로 찍습니다",
        lead: "말하는 순간 진행 중인 행동은 am/is/are와 동사-ing를 함께 사용합니다. 현재단순이 반복되는 달력이라면 현재진행형은 지금의 사진입니다.",
        why: "한국어 ‘먹어요’는 문맥에 따라 평소 습관과 지금 행동을 모두 나타낼 수 있지만 영어는 I eat과 I am eating을 구분합니다.",
        outcomes: ["현재단순과 현재진행형의 시간 관점을 구분합니다.", "주어에 맞는 be + 동사-ing 형태를 만듭니다.", "-ing 철자 변화와 부정·질문 순서를 적용합니다."]
      },
      concepts: [
        { title: "현재진행형은 be와 -ing가 모두 있어야 완성됩니다", body: "I am reading에서 am은 시제와 주어 정보를, reading은 진행 중인 행동을 나타냅니다. 둘 중 하나라도 빠지면 문장이 완성되지 않습니다. She reading이나 She is read는 현재진행형이 아닙니다.", key: "be + -ing를 하나의 동사 묶음으로 보세요." },
        { title: "현재단순과의 차이는 행동 자체가 아니라 시간 관점입니다", body: "I read before bed는 잠들기 전의 습관이고, I am reading now는 바로 지금의 행동입니다. 같은 동사도 화자가 반복을 보는지 현재 장면을 보는지에 따라 형태가 달라집니다.", key: "usually/every day는 현재단순, now/look/listen은 현재진행의 강한 단서입니다." },
        { title: "모든 동사가 자연스럽게 진행형이 되는 것은 아닙니다", body: "know, like, want처럼 생각·감정·소유 상태를 나타내는 동사는 보통 진행 장면으로 보지 않습니다. 그래서 I know the answer, I like music처럼 현재단순을 주로 씁니다.", key: "움직이는 행동인지 지속되는 상태인지 먼저 판단합니다." }
      ],
      formRows: [
        { label: "긍정", pattern: "subject + am/is/are + verb-ing", example: "The baby is sleeping.", translation: "아기가 자고 있습니다.", note: "baby는 it이므로 is를 씁니다." },
        { label: "부정", pattern: "subject + am/is/are + not + verb-ing", example: "We aren't waiting outside.", translation: "우리는 밖에서 기다리고 있지 않습니다.", note: "not은 be동사 뒤에 놓습니다." },
        { label: "질문", pattern: "Am/Is/Are + subject + verb-ing?", example: "Are they coming with us?", translation: "그들도 우리와 함께 오고 있나요?", note: "be동사만 주어 앞으로 이동합니다." },
        { label: "-e 탈락", pattern: "make → making · write → writing", example: "She is writing an email.", translation: "그녀는 이메일을 쓰고 있습니다.", note: "말 없는 마지막 e를 빼고 -ing를 붙입니다." },
        { label: "자음 겹치기", pattern: "run → running · sit → sitting", example: "The dog is running.", translation: "개가 달리고 있습니다.", note: "짧은 모음 + 자음으로 끝나는 일부 동사는 마지막 자음을 겹칩니다." }
      ],
      uses: [
        { title: "바로 지금", signal: "now · right now · look · listen", body: "말하는 순간 눈앞에서 벌어지는 행동을 묘사합니다.", example: "Listen! Someone is singing.", translation: "들어 봐! 누군가 노래하고 있어." },
        { title: "현재의 일시적 상황", signal: "this week · these days", body: "영구적이지 않고 현재 기간에만 이어지는 행동을 말합니다.", example: "I'm staying with my aunt this week.", translation: "이번 주에는 이모 집에 머물고 있어요." },
        { title: "변하는 장면", signal: "getting · becoming", body: "지금 점차 변하고 있는 상황을 나타냅니다.", example: "The weather is getting colder.", translation: "날씨가 점점 추워지고 있습니다." }
      ],
      koreanContrast: {
        title: "한국어 현재 표현 하나를 영어에서는 두 시제로 나눕니다",
        body: "‘학교에 가요’가 평소 습관인지 지금 이동 중인지 영어에서는 반드시 구분해야 합니다.",
        pairs: [
          { korean: "나는 버스로 학교에 가요. (평소)", english: "I go to school by bus.", note: "반복되는 통학 방법이라 현재단순입니다." },
          { korean: "나는 지금 학교에 가고 있어요.", english: "I am going to school now.", note: "지금 진행 중인 이동이라 현재진행형입니다." },
          { korean: "나는 그 답을 알아요.", english: "I know the answer.", note: "know는 상태 동사라 보통 진행형을 쓰지 않습니다." }
        ]
      },
      walkthroughs: [
        { sentence: "The children are playing in the garden.", translation: "아이들이 정원에서 놀고 있습니다.", intent: "눈앞의 복수 주어 행동을 묘사", chunks: [{ text: "The children", role: "복수 주어", note: "they로 바꿀 수 있습니다." }, { text: "are", role: "주어·시제 표시", note: "복수 주어에 맞는 be입니다." }, { text: "playing", role: "진행 행동", note: "play + -ing입니다." }, { text: "in the garden", role: "장소", note: "행동이 일어나는 곳입니다." }], takeaway: "현재진행형의 핵심 동사부는 are playing 전체입니다." },
        { sentence: "Is Mina doing her homework?", translation: "미나는 숙제를 하고 있나요?", intent: "한 사람의 현재 행동을 질문", chunks: [{ text: "Is", role: "질문 신호", note: "Mina가 she이므로 is입니다." }, { text: "Mina", role: "주어", note: "행동하는 사람입니다." }, { text: "doing", role: "진행 행동", note: "do + -ing입니다." }, { text: "her homework", role: "목적어", note: "무엇을 하는지 나타냅니다." }], takeaway: "질문에서도 -ing는 그대로 두고 be만 앞으로 옮깁니다." }
      ],
      traps: [
        { wrong: "She reading a book.", right: "She is reading a book.", why: "현재진행형에는 주어에 맞는 be동사가 필요합니다." },
        { wrong: "They are play football.", right: "They are playing football.", why: "be 뒤의 행동 동사는 -ing형이어야 합니다." },
        { wrong: "I am knowing the answer.", right: "I know the answer.", why: "know는 상태를 나타내므로 보통 현재단순을 씁니다." },
        { wrong: "Does he sleeping?", right: "Is he sleeping?", why: "현재진행형 질문은 do가 아니라 be동사를 앞으로 보냅니다." }
      ],
      summary: { statement: "지금의 장면에는 주어에 맞는 be + 동사-ing를 함께 씁니다.", points: ["I am / he·she·it is / you·we·they are + -ing", "부정은 be + not + -ing", "질문은 be + 주어 + -ing"] }
    },

    "a1-past-simple": {
      overview: {
        title: "과거단순은 끝난 시간을 문장 밖에 선명하게 그어 줍니다",
        lead: "어제, 지난주, 2025년처럼 이미 끝난 시간에 일어난 행동과 상태는 과거단순으로 말합니다. 긍정문은 과거형, 질문과 부정문은 did + 동사원형이 핵심입니다.",
        why: "영어는 행동이 언제 일어났는지를 동사의 모양으로 표시합니다. 문장에 yesterday가 있어도 동사를 현재형으로 두지 않습니다.",
        outcomes: ["끝난 과거와 현재를 구분합니다.", "규칙·불규칙 과거형을 올바르게 사용합니다.", "did와 was/were로 과거 질문·부정을 만듭니다."]
      },
      concepts: [
        { title: "과거단순은 현재와 분리된 완료 사건을 말합니다", body: "I visited Busan last weekend는 방문이 지난 주말 안에 끝났다는 뜻입니다. yesterday, last night, two days ago, in 2024처럼 끝난 시간을 가리키는 표현과 자주 함께 씁니다.", key: "시간선에서 이미 닫힌 구간이면 과거단순을 선택합니다." },
        { title: "긍정문에서는 동사 자체가 과거 표시를 맡습니다", body: "규칙동사는 보통 -ed를 붙여 work → worked가 됩니다. go → went, see → saw, have → had처럼 모양이 달라지는 불규칙동사는 따로 익혀야 합니다. 모든 주어에 같은 과거형을 씁니다: I went, she went, they went.", key: "과거 긍정문에는 3인칭 단수 -s가 없습니다." },
        { title: "did가 나오면 본동사는 원형으로 돌아갑니다", body: "Did you see it?과 I didn't see it에서 과거 정보는 did가 담당합니다. saw나 visited처럼 과거형을 다시 쓰면 과거 표시를 두 번 하는 셈입니다. 단, be동사의 과거형 was/were는 did의 도움을 받지 않습니다.", key: "did + 과거형이 아니라 did + 동사원형입니다." }
      ],
      formRows: [
        { label: "일반동사 긍정", pattern: "subject + past verb", example: "We watched a film last night.", translation: "우리는 어젯밤 영화를 봤습니다.", note: "watch에 -ed를 붙였습니다." },
        { label: "일반동사 부정", pattern: "subject + didn't + base verb", example: "We didn't watch TV.", translation: "우리는 TV를 보지 않았습니다.", note: "didn't 뒤에는 watch 원형을 씁니다." },
        { label: "일반동사 질문", pattern: "Did + subject + base verb?", example: "Did you call Mina?", translation: "미나에게 전화했나요?", note: "called가 아니라 call입니다." },
        { label: "be 긍정", pattern: "I/he/she/it was · you/we/they were", example: "They were tired after the trip.", translation: "그들은 여행 후 피곤했습니다.", note: "복수 주어에는 were를 씁니다." },
        { label: "be 부정·질문", pattern: "wasn't/weren't · Was/Were + subject?", example: "Was the shop open?", translation: "가게가 열려 있었나요?", note: "be동사 과거 질문에는 did를 쓰지 않습니다." }
      ],
      uses: [
        { title: "한 번 끝난 사건", signal: "yesterday · ago · last", body: "과거의 특정 시점에 시작하고 끝난 행동을 말합니다.", example: "I lost my umbrella yesterday.", translation: "나는 어제 우산을 잃어버렸습니다." },
        { title: "과거 사건의 순서", signal: "first · then · after that", body: "이야기 속에서 차례로 일어난 완료 행동을 이어 말합니다.", example: "She opened the door and walked inside.", translation: "그녀는 문을 열고 안으로 걸어 들어갔습니다." },
        { title: "과거의 상태", signal: "was · were", body: "과거의 나이, 감정, 위치와 같은 상태를 말합니다.", example: "I was ten years old in 2020.", translation: "나는 2020년에 열 살이었습니다." }
      ],
      koreanContrast: {
        title: "시간 표현만 과거로 만들고 동사를 놓치지 마세요",
        body: "한국어에서는 ‘어제’가 강한 시간 단서라 동사 형태를 덜 의식하기 쉽지만 영어 문장에서는 일반동사도 과거를 표시해야 합니다.",
        pairs: [
          { korean: "나는 어제 학교에 가.", english: "I went to school yesterday.", note: "끝난 과거이므로 go가 went로 바뀝니다." },
          { korean: "너 어제 미나 봤어?", english: "Did you see Mina yesterday?", note: "질문에서는 did가 과거를 맡고 see는 원형입니다." },
          { korean: "그들은 집에 없었어.", english: "They weren't at home.", note: "be동사의 과거 부정은 weren't입니다." }
        ]
      },
      walkthroughs: [
        { sentence: "He went to school by bus.", translation: "그는 버스로 학교에 갔습니다.", intent: "끝난 과거 이동을 말하는 긍정문", chunks: [{ text: "He", role: "주어", note: "행동한 사람입니다." }, { text: "went", role: "불규칙 과거형", note: "go의 과거형이며 이미 과거를 표시합니다." }, { text: "to school", role: "목적지", note: "어디로 갔는지 나타냅니다." }, { text: "by bus", role: "방법", note: "이동 수단을 덧붙입니다." }], takeaway: "긍정문에서는 went 하나가 행동과 과거 정보를 함께 전달합니다." },
        { sentence: "Did Emma finish her homework?", translation: "엠마는 숙제를 끝냈나요?", intent: "과거의 완료 여부를 묻는 질문", chunks: [{ text: "Did", role: "질문·과거 신호", note: "질문과 과거를 동시에 표시합니다." }, { text: "Emma", role: "주어", note: "행동의 주체입니다." }, { text: "finish", role: "동사원형", note: "did 뒤이므로 finished가 아닙니다." }, { text: "her homework", role: "목적어", note: "끝낸 대상입니다." }], takeaway: "Did가 앞에 서면 본동사는 반드시 원형입니다." }
      ],
      traps: [
        { wrong: "I go there yesterday.", right: "I went there yesterday.", why: "yesterday는 끝난 과거이므로 went를 씁니다." },
        { wrong: "Did you saw him?", right: "Did you see him?", why: "did 뒤에는 동사원형 see가 옵니다." },
        { wrong: "She didn't went out.", right: "She didn't go out.", why: "didn't가 과거를 표시하므로 go는 원형입니다." },
        { wrong: "They was happy.", right: "They were happy.", why: "they와 함께 be동사의 과거형 were를 씁니다." }
      ],
      summary: { statement: "끝난 과거의 긍정은 과거형, 질문·부정은 did + 동사원형입니다. be는 was/were를 직접 씁니다.", points: ["규칙동사 -ed와 불규칙 과거형", "Did/didn't + 동사원형", "I·he·she·it was / you·we·they were"] }
    },

    "a1-there-some-any": {
      overview: {
        title: "처음 등장한 사람과 사물은 there로 장면 안에 들여옵니다",
        lead: "there is/are는 어떤 장소에 무엇이 존재하는지 처음 소개하는 구조입니다. 뒤에 오는 명사가 하나인지 여럿인지에 따라 is/are를 고르고, some/any로 수량의 존재를 말합니다.",
        why: "한국어 ‘방에 의자가 있어’의 ‘있어’를 It is로 옮기면 영어에서는 어색합니다. 아직 대화에 나오지 않은 대상을 소개할 때는 there is/are가 필요합니다.",
        outcomes: ["there is와 there are를 명사의 수에 맞춥니다.", "a/an, some, any의 기본 쓰임을 구분합니다.", "존재 질문과 부정문을 만들 수 있습니다."]
      },
      concepts: [
        { title: "there는 장소를 뜻하는 주어가 아니라 존재를 여는 신호입니다", body: "There is a café near here에서 there를 ‘저기에’라고 번역하지 않습니다. 실제 장소는 near here이고, there is는 ‘~이 있다’라는 문장 틀입니다. 이미 알고 있는 대상의 위치는 The café is near here처럼 일반 be문으로 말할 수 있습니다.", key: "새 대상을 소개하면 there is/are, 알려진 대상의 위치를 말하면 주어 + be입니다." },
        { title: "is와 are는 바로 뒤 명사의 수에 맞춥니다", body: "a book, one chair, water처럼 하나이거나 셀 수 없는 명사에는 there is를 씁니다. two books, many chairs처럼 복수에는 there are를 씁니다. 문장의 진짜 내용이 되는 명사를 먼저 확인하세요.", key: "there가 아니라 뒤의 명사가 is/are를 결정합니다." },
        { title: "some은 ‘어느 정도 있음’, any는 존재 여부를 엽니다", body: "긍정문에서는 some으로 정확한 수를 밝히지 않은 양을 말합니다. 질문과 부정문에서는 보통 any를 사용합니다. There is some milk. Is there any milk? There isn't any milk.의 변화를 한 묶음으로 익히세요.", key: "긍정 some, 질문·부정 any가 기본 패턴입니다." }
      ],
      formRows: [
        { label: "단수 존재", pattern: "There is + a/an + singular noun", example: "There is a bank on this street.", translation: "이 거리에 은행이 하나 있습니다.", note: "처음 소개하는 가산 단수에는 a/an이 필요합니다." },
        { label: "복수 존재", pattern: "There are + number/some + plural noun", example: "There are three windows in the room.", translation: "방에 창문이 세 개 있습니다.", note: "windows가 복수이므로 are입니다." },
        { label: "셀 수 없는 양", pattern: "There is + some + uncountable noun", example: "There is some rice in the bowl.", translation: "그릇에 밥이 조금 있습니다.", note: "rice는 셀 수 없는 명사라 is를 씁니다." },
        { label: "질문", pattern: "Is/Are there + any/a + noun?", example: "Are there any buses after ten?", translation: "10시 이후에 버스가 있나요?", note: "are를 there 앞으로 보내고 any를 씁니다." },
        { label: "부정", pattern: "There isn't/aren't + any + noun", example: "There aren't any eggs.", translation: "달걀이 하나도 없습니다.", note: "복수 eggs에 aren't를 씁니다." }
      ],
      uses: [
        { title: "장소 소개", signal: "in · on · near", body: "방, 동네, 사진 속에 무엇이 있는지 처음 설명합니다.", example: "There is a park behind the school.", translation: "학교 뒤에 공원이 있습니다." },
        { title: "필요한 것 확인", signal: "Is/Are there any...?", body: "물건이나 시설이 존재하는지 질문합니다.", example: "Is there any water?", translation: "물이 있나요?" },
        { title: "수량의 유무", signal: "some · any · number", body: "정확한 수나 대략적인 양을 존재 구조와 함께 말합니다.", example: "There are some photos on the wall.", translation: "벽에 사진이 몇 장 있습니다." }
      ],
      koreanContrast: {
        title: "‘있다’가 존재 소개인지 위치 설명인지 구분합니다",
        body: "두 문장 모두 한국어로는 ‘있다’지만, 처음 등장시키는 대상과 이미 알려진 대상의 위치는 영어 구조가 다릅니다.",
        pairs: [
          { korean: "책상 위에 책이 한 권 있어.", english: "There is a book on the desk.", note: "책을 처음 장면에 소개합니다." },
          { korean: "그 책은 책상 위에 있어.", english: "The book is on the desk.", note: "이미 알고 있는 the book의 위치를 설명합니다." },
          { korean: "냉장고에 우유가 하나도 없어.", english: "There isn't any milk in the fridge.", note: "milk는 셀 수 없어 is와 any를 씁니다." }
        ]
      },
      walkthroughs: [
        { sentence: "There are two chairs by the window.", translation: "창가에 의자가 두 개 있습니다.", intent: "복수 사물을 장면에 처음 소개", chunks: [{ text: "There are", role: "복수 존재 틀", note: "뒤의 two chairs에 맞춰 are를 씁니다." }, { text: "two chairs", role: "존재하는 대상", note: "두 개의 복수 명사입니다." }, { text: "by the window", role: "장소", note: "어디에 있는지 알려 줍니다." }], takeaway: "there가 아니라 two chairs가 동사의 수를 결정합니다." },
        { sentence: "Is there any cheese in the fridge?", translation: "냉장고에 치즈가 있나요?", intent: "셀 수 없는 음식의 존재를 질문", chunks: [{ text: "Is there", role: "단수·불가산 질문 틀", note: "cheese에 맞춰 is를 씁니다." }, { text: "any cheese", role: "확인할 대상", note: "질문이므로 any를 사용합니다." }, { text: "in the fridge", role: "장소", note: "찾는 범위를 지정합니다." }], takeaway: "셀 수 없는 명사는 양이 많아도 문법적으로 단수처럼 is와 결합합니다." }
      ],
      traps: [
        { wrong: "There is two chairs.", right: "There are two chairs.", why: "복수 명사 two chairs에는 are를 씁니다." },
        { wrong: "There are some milk.", right: "There is some milk.", why: "milk는 셀 수 없는 명사라 is를 씁니다." },
        { wrong: "There isn't some bread.", right: "There isn't any bread.", why: "일반적인 부정문에서는 some 대신 any를 씁니다." },
        { wrong: "It is a café near here.", right: "There is a café near here.", why: "새로운 장소를 소개할 때 there is를 씁니다." }
      ],
      summary: { statement: "새 대상을 소개할 때 there is/are를 쓰고, 뒤 명사의 수와 문장 종류에 맞춰 some/any를 고릅니다.", points: ["단수·불가산 there is / 복수 there are", "긍정 some / 질문·부정 any", "새 대상 there is/are / 알려진 대상 주어 + be"] }
    },

    "a1-can-imperatives": {
      overview: {
        title: "can은 동사의 가능성을 열고, 명령문은 행동부터 바로 말합니다",
        lead: "can은 능력, 허용, 간단한 가능성을 나타내는 조동사입니다. 명령문은 상대에게 행동을 요청하거나 지시할 때 주어 없이 동사원형으로 시작합니다.",
        why: "can 뒤에 to나 -s를 붙이거나, 명령문에 불필요한 you를 넣는 실수가 많습니다. 두 구조 모두 동사원형이 중심이라는 공통점을 잡으면 간단해집니다.",
        outcomes: ["can + 동사원형으로 능력과 허용을 말합니다.", "can의 부정문과 질문을 만듭니다.", "긍정·부정 명령문과 정중한 요청을 구분합니다."]
      },
      concepts: [
        { title: "can은 행동 동사 앞에서 의미를 더하는 조동사입니다", body: "Mina can swim에서 실제 행동은 swim이고 can은 그 행동이 가능하다는 의미를 더합니다. can은 주어가 바뀌어도 형태가 변하지 않으며 뒤에는 언제나 동사원형이 옵니다: I can swim, she can swim.", key: "can 뒤에는 to도, -s도, -ing도 붙이지 않습니다." },
        { title: "can 자체가 질문과 부정을 만들 수 있습니다", body: "be동사처럼 can을 주어 앞으로 보내 Can you help me?를 만들고, 뒤에 not을 붙여 cannot 또는 can't를 만듭니다. do/does의 도움은 필요하지 않습니다.", key: "Do you can이 아니라 Can you입니다." },
        { title: "명령문은 듣는 사람 you를 생략하고 행동으로 시작합니다", body: "Open the book에서 숨은 주어는 you입니다. 정중하게 만들려면 please를 앞이나 뒤에 붙일 수 있고, 하지 말라는 지시는 Don't + 동사원형으로 만듭니다.", key: "명령문 첫 단어는 동사원형, 금지는 Don't + 동사원형입니다." }
      ],
      formRows: [
        { label: "능력 긍정", pattern: "subject + can + base verb", example: "Leo can speak Spanish.", translation: "레오는 스페인어를 할 수 있습니다.", note: "Leo 뒤에서도 can과 speak는 변하지 않습니다." },
        { label: "부정", pattern: "subject + cannot/can't + base verb", example: "I can't come tonight.", translation: "나는 오늘 밤 올 수 없습니다.", note: "cannot은 한 단어로 씁니다." },
        { label: "질문", pattern: "Can + subject + base verb?", example: "Can your sister drive?", translation: "당신의 여동생은 운전할 수 있나요?", note: "can을 주어 앞으로 보냅니다." },
        { label: "긍정 명령", pattern: "(Please) + base verb", example: "Please close the door.", translation: "문을 닫아 주세요.", note: "주어 없이 close로 시작합니다." },
        { label: "부정 명령", pattern: "Don't + base verb", example: "Don't touch that button.", translation: "그 버튼을 만지지 마세요.", note: "금지는 Don't로 시작합니다." }
      ],
      uses: [
        { title: "능력", signal: "할 수 있다", body: "배운 기술이나 신체적 능력을 말합니다.", example: "My little brother can read.", translation: "내 남동생은 글을 읽을 수 있습니다." },
        { title: "허락 요청", signal: "해도 될까요", body: "상대에게 어떤 행동을 해도 되는지 묻습니다.", example: "Can I use your phone?", translation: "전화기를 사용해도 될까요?" },
        { title: "간단한 부탁", signal: "해 줄 수 있나요", body: "상대가 해 줄 수 있는지 묻는 형태로 부탁합니다.", example: "Can you open the window?", translation: "창문을 열어 줄 수 있나요?" },
        { title: "지시와 안내", signal: "동사로 시작", body: "방법이나 규칙을 짧고 직접적으로 전달합니다.", example: "Turn left at the bank.", translation: "은행에서 왼쪽으로 도세요." }
      ],
      koreanContrast: {
        title: "‘할 수 있다’ 뒤의 영어 동사는 항상 원형입니다",
        body: "한국어에서는 ‘수 있다’ 앞에 동사 형태가 바뀌지만 영어 can 뒤에는 주어와 시제에 관계없이 기본형을 둡니다.",
        pairs: [
          { korean: "그녀는 수영할 수 있어.", english: "She can swim.", note: "she여도 swim에 -s를 붙이지 않습니다." },
          { korean: "여기 앉아도 될까요?", english: "Can I sit here?", note: "허락을 구할 때 Can I ...?를 씁니다." },
          { korean: "뛰지 마세요.", english: "Don't run.", note: "부정 명령은 Don't + 동사원형입니다." }
        ]
      },
      walkthroughs: [
        { sentence: "Can your brother cook?", translation: "당신의 남자 형제는 요리할 수 있나요?", intent: "한 사람의 능력을 질문", chunks: [{ text: "Can", role: "질문·가능 신호", note: "문장 맨 앞에서 능력을 묻습니다." }, { text: "your brother", role: "주어", note: "능력을 가진 사람입니다." }, { text: "cook", role: "동사원형", note: "brother가 he여도 cooks가 아닙니다." }], takeaway: "can이 있으면 3인칭 단수 -s 규칙이 멈춥니다." },
        { sentence: "Please wait here and don't move.", translation: "여기에서 기다리고 움직이지 마세요.", intent: "긍정 지시와 부정 지시를 연결", chunks: [{ text: "Please wait", role: "정중한 긍정 명령", note: "please + 동사원형입니다." }, { text: "here", role: "장소", note: "기다릴 위치입니다." }, { text: "and", role: "연결", note: "두 지시를 잇습니다." }, { text: "don't move", role: "부정 명령", note: "하지 말 행동을 나타냅니다." }], takeaway: "명령문의 숨은 주어는 you이며 문장에는 쓰지 않습니다." }
      ],
      traps: [
        { wrong: "She cans swim.", right: "She can swim.", why: "can은 주어가 she여도 변하지 않습니다." },
        { wrong: "He can to drive.", right: "He can drive.", why: "can 뒤에는 to 없이 동사원형을 씁니다." },
        { wrong: "Do you can help me?", right: "Can you help me?", why: "can 자체를 앞으로 보내므로 do가 필요 없습니다." },
        { wrong: "You open the book.", right: "Open the book.", why: "일반적인 명령문에서는 주어 you를 생략합니다." }
      ],
      summary: { statement: "can과 명령문 뒤의 핵심 행동은 언제나 동사원형입니다.", points: ["주어 + can/can't + 동사원형", "Can + 주어 + 동사원형?", "(Please) + 동사원형 / Don't + 동사원형"] }
    },

    "a1-prepositions": {
      overview: {
        title: "in, on, at은 번역이 아니라 공간과 시간의 크기로 선택합니다",
        lead: "한국어 조사 ‘에’ 하나가 영어에서는 in, on, at으로 나뉩니다. at은 점, on은 표면·하루, in은 내부·넓은 기간이라는 기본 이미지를 이해하면 암기할 양이 줄어듭니다.",
        why: "전치사를 단어별 한국어 뜻으로 외우면 at nine, on Monday, in September가 매번 별개의 규칙처럼 보입니다. 세 전치사의 공간 이미지를 시간에 그대로 적용해 보세요.",
        outcomes: ["at·on·in의 핵심 공간 이미지를 설명합니다.", "시간의 크기에 맞는 전치사를 선택합니다.", "기본 장소 표현과 자주 쓰는 고정 표현을 구분합니다."]
      },
      concepts: [
        { title: "at은 하나의 점을 찍습니다", body: "장소에서는 at the station처럼 지도 위 한 지점을, 시간에서는 at 7:30처럼 정확한 시각을 가리킵니다. 내부나 표면의 모양보다 ‘그 지점’ 자체가 중요할 때 씁니다.", key: "at = point: 정확한 한 지점" },
        { title: "on은 표면에 닿거나 달력의 하루를 가리킵니다", body: "on the desk는 물체가 표면에 닿아 있는 모습입니다. 시간에서는 on Monday, on 5 May처럼 달력에서 한 칸을 차지하는 요일·날짜에 씁니다.", key: "on = surface/day: 표면 또는 특정한 하루" },
        { title: "in은 경계 안이나 넓은 시간 범위입니다", body: "in the room은 벽으로 둘러싸인 공간 안, in Seoul은 도시의 범위 안을 뜻합니다. 시간에서는 in May, in winter, in 2026처럼 월·계절·연도라는 넓은 기간에 씁니다.", key: "in = container/period: 안쪽 또는 넓은 기간" }
      ],
      formRows: [
        { label: "시간 at", pattern: "at + clock time / exact point", example: "The lesson starts at nine.", translation: "수업은 9시에 시작합니다.", note: "정확한 시각은 시간선의 점입니다." },
        { label: "시간 on", pattern: "on + day / date", example: "We have English on Tuesday.", translation: "우리는 화요일에 영어 수업이 있습니다.", note: "요일과 날짜 앞에는 on을 씁니다." },
        { label: "시간 in", pattern: "in + month / season / year / part of day", example: "My birthday is in November.", translation: "내 생일은 11월입니다.", note: "월은 넓은 기간이므로 in입니다." },
        { label: "장소 at", pattern: "at + point / event", example: "I'll meet you at the bus stop.", translation: "버스 정류장에서 만날게요.", note: "정류장을 만남의 지점으로 봅니다." },
        { label: "장소 on", pattern: "on + surface", example: "Your phone is on the sofa.", translation: "전화기는 소파 위에 있습니다.", note: "표면과 닿아 있는 위치입니다." },
        { label: "장소 in", pattern: "in + enclosed/large area", example: "The children are in the kitchen.", translation: "아이들은 부엌에 있습니다.", note: "경계가 있는 공간 안입니다." }
      ],
      uses: [
        { title: "약속 시간과 지점", signal: "at", body: "정확한 시각이나 만날 지점을 하나의 점처럼 지정합니다.", example: "Meet me at the entrance at six.", translation: "6시에 입구에서 만나요." },
        { title: "요일·날짜와 표면", signal: "on", body: "달력의 특정 하루 또는 물체가 닿아 있는 표면을 가리킵니다.", example: "The test is on Friday.", translation: "시험은 금요일입니다." },
        { title: "기간과 공간 내부", signal: "in", body: "월·연도·계절 같은 기간이나 방·도시·나라의 안쪽 범위를 말합니다.", example: "It rains a lot in summer.", translation: "여름에는 비가 많이 옵니다." },
        { title: "전치사 없는 시간", signal: "this · last · next · every", body: "this morning, last week, next year, every day 앞에는 보통 in/on/at을 쓰지 않습니다.", example: "See you next Monday.", translation: "다음 주 월요일에 만나요." }
      ],
      koreanContrast: {
        title: "한국어 ‘에’를 바로 번역하지 말고 크기와 모양을 봅니다",
        body: "‘에’라는 같은 조사라도 영어에서는 시간·장소를 점, 표면, 내부 중 어떻게 보는지에 따라 전치사가 달라집니다.",
        pairs: [
          { korean: "9시에", english: "at nine", note: "정확한 시각은 점입니다." },
          { korean: "월요일에", english: "on Monday", note: "달력의 특정 하루입니다." },
          { korean: "겨울에", english: "in winter", note: "여러 날을 포함하는 기간입니다." },
          { korean: "책상 위에", english: "on the desk", note: "표면에 닿은 위치입니다." }
        ]
      },
      walkthroughs: [
        { sentence: "The meeting starts at nine on Monday.", translation: "회의는 월요일 9시에 시작합니다.", intent: "서로 다른 크기의 시간 정보를 함께 표현", chunks: [{ text: "The meeting", role: "주어", note: "정해진 일정입니다." }, { text: "starts", role: "현재단순", note: "시간표이므로 현재단순을 씁니다." }, { text: "at nine", role: "정확한 시각", note: "점이므로 at입니다." }, { text: "on Monday", role: "특정 요일", note: "달력의 하루이므로 on입니다." }], takeaway: "한 문장에서도 시간 단위의 크기에 따라 전치사가 달라집니다." },
        { sentence: "The keys are in my bag, not on the desk.", translation: "열쇠는 책상 위가 아니라 내 가방 안에 있습니다.", intent: "내부와 표면 위치를 대조", chunks: [{ text: "The keys", role: "주어", note: "찾는 물건입니다." }, { text: "are", role: "위치 연결", note: "복수 주어에 맞는 be입니다." }, { text: "in my bag", role: "내부", note: "가방이라는 경계 안입니다." }, { text: "not on the desk", role: "표면 위치 부정", note: "책상 표면은 on으로 나타냅니다." }], takeaway: "in은 경계 안, on은 표면 접촉이라는 공간 그림을 유지합니다." }
      ],
      traps: [
        { wrong: "at Monday", right: "on Monday", why: "요일은 달력의 특정 하루이므로 on을 씁니다." },
        { wrong: "in 7 o'clock", right: "at 7 o'clock", why: "정확한 시각은 점이므로 at을 씁니다." },
        { wrong: "on winter", right: "in winter", why: "계절은 넓은 기간이므로 in을 씁니다." },
        { wrong: "in next week", right: "next week", why: "next, last, this, every가 앞에 있으면 보통 전치사를 쓰지 않습니다." }
      ],
      summary: { statement: "at은 점, on은 표면·하루, in은 내부·기간입니다. 번역보다 공간 이미지를 먼저 고릅니다.", points: ["at + 정확한 시각·지점", "on + 요일·날짜·표면", "in + 월·계절·연도·내부 공간"] }
    }
  };

  window.GRAMMAR_LESSONS = lessons;
})();
