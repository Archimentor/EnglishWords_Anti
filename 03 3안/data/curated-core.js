/*
 * wordline 3안 전용 커리큘럼
 * 6단계 · 24개 주제 유닛 · 240개 핵심 어휘
 * 각 행: 영단어 | 뜻 | 품사 | 예문 | 예문 뜻
 */
const WORDLINE_RAW_CURRICULUM = [
  {
    id: "root",
    code: "ROOT",
    name: "기초",
    title: "처음 만나는 영어",
    school: "영어 입문",
    description: "소리와 뜻을 바로 연결하는 가장 가까운 생활 단어",
    ghost: "A",
    units: [
      {
        title: "인사와 마음",
        focus: "처음 만나고 마음을 표현해요",
        rows: [
          "hello|안녕|감탄사|Hello, my name is Mina.|안녕, 내 이름은 미나야.",
          "goodbye|안녕히 가세요|감탄사|We said goodbye at the gate.|우리는 문 앞에서 작별 인사를 했다.",
          "please|부디, 부탁해요|부사|Please open the window.|창문을 열어 주세요.",
          "thanks|고마워|감탄사|Thanks for your kind help.|친절하게 도와줘서 고마워.",
          "yes|네|감탄사|Yes, I can do it.|네, 저는 할 수 있어요.",
          "no|아니요|감탄사|No, that is not mine.|아니요, 그것은 제 것이 아니에요.",
          "name|이름|명사|Write your name here.|여기에 이름을 쓰세요.",
          "friend|친구|명사|Jin is my best friend.|진은 나의 가장 친한 친구다.",
          "happy|행복한|형용사|The children look happy.|아이들이 행복해 보인다.",
          "sorry|미안한|형용사|I am sorry I am late.|늦어서 미안해요."
        ]
      },
      {
        title: "수와 색",
        focus: "세고 비교하고 색을 말해요",
        rows: [
          "one|하나|수사|I have one pencil.|나는 연필 한 자루가 있다.",
          "two|둘|수사|Two birds sit on the wall.|새 두 마리가 벽에 앉아 있다.",
          "three|셋|수사|She has three brothers.|그녀는 남동생이 세 명 있다.",
          "first|첫 번째의|형용사|This is my first class.|이것은 나의 첫 수업이다.",
          "many|많은|형용사|Many stars shine tonight.|오늘 밤 많은 별이 빛난다.",
          "red|빨간|형용사|He wears a red cap.|그는 빨간 모자를 쓴다.",
          "blue|파란|형용사|The sky is clear and blue.|하늘이 맑고 파랗다.",
          "green|초록색의|형용사|The leaves are green.|잎들이 초록색이다.",
          "white|하얀|형용사|We saw a white cloud.|우리는 하얀 구름을 보았다.",
          "black|검은|형용사|My bag is black.|내 가방은 검은색이다."
        ]
      },
      {
        title: "집과 가족",
        focus: "나와 가장 가까운 사람과 공간을 익혀요",
        rows: [
          "family|가족|명사|My family eats dinner together.|우리 가족은 함께 저녁을 먹는다.",
          "mother|어머니|명사|My mother makes breakfast.|어머니가 아침을 만드신다.",
          "father|아버지|명사|My father reads the news.|아버지가 뉴스를 읽으신다.",
          "sister|자매|명사|My sister likes music.|내 자매는 음악을 좋아한다.",
          "brother|형제|명사|His brother plays soccer.|그의 형제는 축구를 한다.",
          "home|집|명사|I walk home after school.|나는 방과 후 집으로 걸어간다.",
          "room|방|명사|My room has a big window.|내 방에는 큰 창문이 있다.",
          "door|문|명사|Please close the door.|문을 닫아 주세요.",
          "table|탁자|명사|The book is on the table.|책이 탁자 위에 있다.",
          "bed|침대|명사|The cat sleeps under my bed.|고양이는 내 침대 아래에서 잔다."
        ]
      },
      {
        title: "하루의 동작",
        focus: "매일 하는 행동을 짧게 말해요",
        rows: [
          "go|가다|동사|I go to school at eight.|나는 여덟 시에 학교에 간다.",
          "come|오다|동사|Come and sit with us.|와서 우리와 함께 앉아.",
          "eat|먹다|동사|We eat lunch at noon.|우리는 정오에 점심을 먹는다.",
          "drink|마시다|동사|Drink some water after running.|달린 뒤에 물을 좀 마셔라.",
          "sleep|자다|동사|Babies sleep for many hours.|아기들은 여러 시간 잔다.",
          "sit|앉다|동사|Sit next to me.|내 옆에 앉아.",
          "stand|서다|동사|Please stand in a line.|줄을 서 주세요.",
          "read|읽다|동사|I read a book every night.|나는 매일 밤 책을 읽는다.",
          "write|쓰다|동사|Write a short sentence.|짧은 문장을 쓰세요.",
          "play|놀다, 경기하다|동사|They play outside after lunch.|그들은 점심 뒤에 밖에서 논다."
        ]
      }
    ]
  },
  {
    id: "step",
    code: "STEP",
    name: "초등",
    title: "문장으로 넓히기",
    school: "초등 핵심",
    description: "학교와 일상에서 자주 만나는 단어를 문장으로 확장하기",
    ghost: "B",
    units: [
      {
        title: "학교의 하루",
        focus: "수업에서 매일 쓰는 말을 익혀요",
        rows: [
          "school|학교|명사|Our school starts at nine.|우리 학교는 아홉 시에 시작한다.",
          "class|수업, 학급|명사|English class is fun today.|오늘 영어 수업은 재미있다.",
          "teacher|선생님|명사|The teacher asks a question.|선생님이 질문을 하신다.",
          "student|학생|명사|Every student has a notebook.|모든 학생이 공책을 가지고 있다.",
          "lesson|수업 내용|명사|Today's lesson is about animals.|오늘 수업은 동물에 관한 것이다.",
          "question|질문|명사|I have a question for you.|너에게 질문이 하나 있어.",
          "answer|대답, 답하다|명사·동사|Her answer is correct.|그녀의 답은 맞다.",
          "homework|숙제|명사|I finish my homework early.|나는 숙제를 일찍 끝낸다.",
          "library|도서관|명사|We study quietly in the library.|우리는 도서관에서 조용히 공부한다.",
          "practice|연습하다|동사|Practice the new words aloud.|새 단어를 소리 내어 연습해라."
        ]
      },
      {
        title: "시간과 날씨",
        focus: "언제인지, 날씨가 어떤지 말해요",
        rows: [
          "morning|아침|명사|I stretch every morning.|나는 매일 아침 스트레칭을 한다.",
          "afternoon|오후|명사|We meet on Friday afternoon.|우리는 금요일 오후에 만난다.",
          "evening|저녁|명사|The air is cool this evening.|오늘 저녁 공기가 시원하다.",
          "today|오늘|부사|Today is my birthday.|오늘은 내 생일이다.",
          "tomorrow|내일|부사|We will visit grandma tomorrow.|우리는 내일 할머니를 찾아뵐 것이다.",
          "early|일찍|부사|She gets up early on weekdays.|그녀는 평일에 일찍 일어난다.",
          "late|늦게|부사|Do not stay up too late.|너무 늦게까지 깨어 있지 마라.",
          "sunny|화창한|형용사|It is sunny and warm outside.|밖은 화창하고 따뜻하다.",
          "cloudy|흐린|형용사|The sky became cloudy.|하늘이 흐려졌다.",
          "season|계절|명사|Spring is my favorite season.|봄은 내가 가장 좋아하는 계절이다."
        ]
      },
      {
        title: "자연과 장소",
        focus: "주변 세계를 설명하는 명사를 모아요",
        rows: [
          "river|강|명사|A long river crosses the city.|긴 강이 도시를 가로지른다.",
          "mountain|산|명사|Snow covers the mountain.|눈이 산을 덮고 있다.",
          "forest|숲|명사|Many animals live in the forest.|많은 동물이 숲에 산다.",
          "ocean|대양, 바다|명사|The ocean looks calm today.|오늘 바다가 잔잔해 보인다.",
          "island|섬|명사|They live on a small island.|그들은 작은 섬에 산다.",
          "village|마을|명사|The village has one old bridge.|그 마을에는 오래된 다리가 하나 있다.",
          "city|도시|명사|Seoul is a busy city.|서울은 활기찬 도시다.",
          "garden|정원|명사|Flowers grow in the garden.|정원에 꽃이 자란다.",
          "travel|여행하다|동사|We travel by train in summer.|우리는 여름에 기차로 여행한다.",
          "arrive|도착하다|동사|The bus will arrive soon.|버스가 곧 도착할 것이다."
        ]
      },
      {
        title: "감정과 선택",
        focus: "느끼고 선택하는 일을 구체적으로 말해요",
        rows: [
          "excited|신이 난|형용사|I am excited about the trip.|나는 여행 생각에 신이 난다.",
          "worried|걱정하는|형용사|He looks worried about the test.|그는 시험을 걱정하는 것 같다.",
          "surprised|놀란|형용사|We were surprised by the news.|우리는 그 소식에 놀랐다.",
          "careful|조심하는|형용사|Be careful on the wet floor.|젖은 바닥에서 조심해라.",
          "brave|용감한|형용사|The brave child told the truth.|용감한 아이가 진실을 말했다.",
          "share|나누다|동사|We share snacks with our friends.|우리는 친구들과 간식을 나눈다.",
          "choose|선택하다|동사|Choose one book to read.|읽을 책 한 권을 골라라.",
          "build|짓다, 만들다|동사|They build a house with blocks.|그들은 블록으로 집을 만든다.",
          "remember|기억하다|동사|Remember to bring your umbrella.|우산 가져오는 것을 기억해라.",
          "promise|약속하다|동사|I promise to call you tonight.|오늘 밤 전화하겠다고 약속할게."
        ]
      }
    ]
  },
  {
    id: "bridge",
    code: "BRIDGE",
    name: "중등 기본",
    title: "생각을 연결하기",
    school: "중1–2",
    description: "의견과 이유를 연결하며 읽기와 쓰기의 뼈대 만들기",
    ghost: "C",
    units: [
      {
        title: "소통과 태도",
        focus: "의견을 주고받는 데 필요한 표현을 익혀요",
        rows: [
          "explain|설명하다|동사|Can you explain the rule again?|그 규칙을 다시 설명해 줄 수 있니?",
          "describe|묘사하다|동사|Describe what you saw in detail.|무엇을 보았는지 자세히 묘사해라.",
          "suggest|제안하다|동사|I suggest taking a short break.|잠깐 쉬는 것을 제안한다.",
          "agree|동의하다|동사|Most students agree with the idea.|대부분의 학생이 그 생각에 동의한다.",
          "refuse|거절하다|동사|She refused to give up.|그녀는 포기하기를 거부했다.",
          "opinion|의견|명사|Everyone may have a different opinion.|모두가 다른 의견을 가질 수 있다.",
          "reason|이유|명사|Tell me the reason for your choice.|네 선택의 이유를 말해 줘.",
          "message|메시지|명사|I left a message on your phone.|네 전화에 메시지를 남겼다.",
          "conversation|대화|명사|We had a long conversation after class.|우리는 수업 뒤에 긴 대화를 나눴다.",
          "behavior|행동|명사|His behavior changed after the meeting.|회의 뒤에 그의 행동이 달라졌다."
        ]
      },
      {
        title: "배움과 성취",
        focus: "문제를 풀고 성장하는 과정을 말해요",
        rows: [
          "improve|향상시키다|동사|Reading daily will improve your vocabulary.|매일 읽으면 어휘력이 향상될 것이다.",
          "achieve|성취하다|동사|She worked hard to achieve her goal.|그녀는 목표를 이루려고 열심히 노력했다.",
          "solve|해결하다|동사|We solved the problem together.|우리는 함께 문제를 해결했다.",
          "compare|비교하다|동사|Compare the two pictures carefully.|두 그림을 주의 깊게 비교해라.",
          "prepare|준비하다|동사|I need to prepare for the exam.|나는 시험을 준비해야 한다.",
          "focus|집중하다|동사|Focus on the main point.|요점에 집중해라.",
          "knowledge|지식|명사|Books give us useful knowledge.|책은 우리에게 유용한 지식을 준다.",
          "subject|과목, 주제|명사|Science is her favorite subject.|과학은 그녀가 가장 좋아하는 과목이다.",
          "mistake|실수|명사|We can learn from every mistake.|우리는 모든 실수에서 배울 수 있다.",
          "result|결과|명사|The result was better than expected.|결과는 예상보다 좋았다."
        ]
      },
      {
        title: "사회와 환경",
        focus: "공동체와 지구를 이해하는 어휘를 배워요",
        rows: [
          "community|지역 사회|명사|The community opened a new park.|지역 사회가 새 공원을 열었다.",
          "culture|문화|명사|Food is an important part of culture.|음식은 문화의 중요한 부분이다.",
          "society|사회|명사|Technology changes our society.|기술은 우리 사회를 변화시킨다.",
          "tradition|전통|명사|The festival is a local tradition.|그 축제는 지역 전통이다.",
          "environment|환경|명사|We must protect the environment.|우리는 환경을 보호해야 한다.",
          "energy|에너지|명사|Plants get energy from sunlight.|식물은 햇빛에서 에너지를 얻는다.",
          "recycle|재활용하다|동사|We recycle paper and bottles.|우리는 종이와 병을 재활용한다.",
          "protect|보호하다|동사|Trees protect the soil from wind.|나무는 바람으로부터 흙을 보호한다.",
          "pollution|오염|명사|Air pollution harms our health.|대기 오염은 건강을 해친다.",
          "resource|자원|명사|Water is a valuable resource.|물은 소중한 자원이다."
        ]
      },
      {
        title: "결정과 경험",
        focus: "선택하고 도전하는 과정을 표현해요",
        rows: [
          "decide|결정하다|동사|We decided to walk instead.|우리는 대신 걷기로 결정했다.",
          "manage|관리하다, 해내다|동사|She manages her time well.|그녀는 시간을 잘 관리한다.",
          "avoid|피하다|동사|Try to avoid the busiest road.|가장 붐비는 길은 피하도록 해라.",
          "continue|계속하다|동사|The rain continued all night.|비가 밤새 계속되었다.",
          "include|포함하다|동사|The price includes breakfast.|가격에는 아침 식사가 포함된다.",
          "depend|의존하다|동사|Success depends on steady effort.|성공은 꾸준한 노력에 달려 있다.",
          "provide|제공하다|동사|The program provides free meals.|그 프로그램은 무료 식사를 제공한다.",
          "opportunity|기회|명사|This is a good opportunity to learn.|이것은 배울 좋은 기회다.",
          "experience|경험|명사|Travel can be a valuable experience.|여행은 값진 경험이 될 수 있다.",
          "challenge|도전|명사|Learning a language is a rewarding challenge.|언어 학습은 보람 있는 도전이다."
        ]
      }
    ]
  },
  {
    id: "grow",
    code: "GROW",
    name: "중등 심화",
    title: "개념으로 읽기",
    school: "중3",
    description: "원인과 결과, 자료와 주장을 구별하는 독해 어휘",
    ghost: "D",
    units: [
      {
        title: "논리와 관계",
        focus: "문장 사이의 관계를 정확히 찾아요",
        rows: [
          "cause|원인, 야기하다|명사·동사|Heavy rain caused the delay.|폭우가 지연을 야기했다.",
          "effect|영향, 결과|명사|The new rule had little effect.|새 규칙은 효과가 거의 없었다.",
          "contrast|대조하다|동사|The bright walls contrast with the dark floor.|밝은 벽은 어두운 바닥과 대조된다.",
          "connect|연결하다|동사|The bridge connects the two towns.|그 다리는 두 마을을 연결한다.",
          "relationship|관계|명사|Exercise has a close relationship with health.|운동은 건강과 밀접한 관계가 있다.",
          "influence|영향을 주다|동사|Friends can influence our choices.|친구는 우리의 선택에 영향을 줄 수 있다.",
          "according|~에 따르면|전치사|According to the report, sales increased.|보고서에 따르면 매출이 증가했다.",
          "however|그러나|부사|The task was hard; however, we finished it.|과제는 어려웠지만 우리는 끝냈다.",
          "therefore|그러므로|부사|The road was closed; therefore, we turned back.|길이 폐쇄되어 우리는 돌아갔다.",
          "although|비록 ~이지만|접속사|Although he was tired, he kept working.|그는 피곤했지만 계속 일했다."
        ]
      },
      {
        title: "과학과 정보",
        focus: "관찰하고 검증하는 글의 핵심어를 익혀요",
        rows: [
          "experiment|실험|명사|The experiment tested the new material.|그 실험은 새 재료를 시험했다.",
          "evidence|증거|명사|There is strong evidence for the theory.|그 이론을 뒷받침하는 강한 증거가 있다.",
          "theory|이론|명사|The theory explains how light moves.|그 이론은 빛이 이동하는 방식을 설명한다.",
          "technology|기술|명사|Technology allows us to work remotely.|기술은 원격 근무를 가능하게 한다.",
          "device|기기|명사|This device measures air quality.|이 기기는 공기 질을 측정한다.",
          "information|정보|명사|Check the source of the information.|정보의 출처를 확인해라.",
          "article|기사, 글|명사|I read an article about space travel.|나는 우주여행에 관한 기사를 읽었다.",
          "research|연구|명사|The research took more than a year.|그 연구는 1년 넘게 걸렸다.",
          "discover|발견하다|동사|Scientists discovered a new species.|과학자들이 새로운 종을 발견했다.",
          "measure|측정하다|동사|We measured the temperature every hour.|우리는 매시간 온도를 측정했다."
        ]
      },
      {
        title: "경제와 시민",
        focus: "사회가 움직이는 방식을 설명해요",
        rows: [
          "economy|경제|명사|Tourism supports the local economy.|관광은 지역 경제를 뒷받침한다.",
          "industry|산업|명사|The city is known for its film industry.|그 도시는 영화 산업으로 유명하다.",
          "government|정부|명사|The government announced a new plan.|정부가 새 계획을 발표했다.",
          "population|인구|명사|The town's population is growing.|그 도시의 인구가 늘고 있다.",
          "public|대중의, 공공의|형용사|The garden is open to the public.|그 정원은 대중에게 개방되어 있다.",
          "individual|개인|명사|Each individual has a different role.|각 개인은 서로 다른 역할을 가진다.",
          "value|가치|명사|Honesty is an important value.|정직은 중요한 가치다.",
          "produce|생산하다|동사|The farm produces fresh vegetables.|그 농장은 신선한 채소를 생산한다.",
          "consume|소비하다|동사|Modern homes consume less energy.|현대 주택은 에너지를 덜 소비한다.",
          "benefit|혜택, 이익|명사|Regular exercise has many benefits.|규칙적인 운동에는 많은 이점이 있다."
        ]
      },
      {
        title: "변화와 구조",
        focus: "설명문에 자주 나오는 추상 동사를 익혀요",
        rows: [
          "recognize|인식하다|동사|I recognized the pattern immediately.|나는 그 패턴을 즉시 알아보았다.",
          "determine|결정하다, 알아내다|동사|Tests determine the strength of the material.|시험은 재료의 강도를 알아낸다.",
          "require|요구하다|동사|The job requires careful planning.|그 일은 신중한 계획을 요구한다.",
          "respond|반응하다|동사|Plants respond to changes in light.|식물은 빛의 변화에 반응한다.",
          "establish|확립하다|동사|The team established clear rules.|팀은 명확한 규칙을 세웠다.",
          "occur|발생하다|동사|Most accidents occur at home.|대부분의 사고는 집에서 발생한다.",
          "represent|나타내다|동사|The red line represents temperature.|빨간 선은 온도를 나타낸다.",
          "increase|증가하다|동사|Demand increased during the summer.|여름 동안 수요가 증가했다.",
          "reduce|줄이다|동사|We need to reduce plastic waste.|우리는 플라스틱 쓰레기를 줄여야 한다.",
          "maintain|유지하다|동사|It is hard to maintain a balance.|균형을 유지하기는 어렵다."
        ]
      }
    ]
  },
  {
    id: "focus",
    code: "FOCUS",
    name: "고등 기본",
    title: "학술 글 해석하기",
    school: "고1–2",
    description: "모의고사와 교과 지문에서 논지를 추적하는 핵심 어휘",
    ghost: "E",
    units: [
      {
        title: "분석과 해석",
        focus: "개념을 정의하고 근거를 해석해요",
        rows: [
          "analyze|분석하다|동사|We analyzed the data for hidden patterns.|우리는 숨은 패턴을 찾기 위해 자료를 분석했다.",
          "interpret|해석하다|동사|People may interpret the same event differently.|사람들은 같은 사건을 다르게 해석할 수 있다.",
          "define|정의하다|동사|The author defines freedom in practical terms.|저자는 자유를 실용적인 관점에서 정의한다.",
          "indicate|나타내다|동사|The findings indicate a steady decline.|연구 결과는 꾸준한 감소를 나타낸다.",
          "demonstrate|입증하다|동사|The study demonstrates the value of sleep.|그 연구는 수면의 가치를 입증한다.",
          "assume|가정하다|동사|We should not assume that change is always good.|변화가 항상 좋다고 가정해서는 안 된다.",
          "concept|개념|명사|The concept of time varies across cultures.|시간의 개념은 문화에 따라 다르다.",
          "context|맥락|명사|Meaning depends heavily on context.|의미는 맥락에 크게 좌우된다.",
          "factor|요인|명사|Cost is only one factor in the decision.|비용은 결정의 한 가지 요인일 뿐이다.",
          "principle|원리, 원칙|명사|The design follows a simple principle.|그 설계는 단순한 원리를 따른다."
        ]
      },
      {
        title: "변화의 양상",
        focus: "변화의 방향과 크기를 세밀하게 구별해요",
        rows: [
          "adapt|적응하다|동사|Species must adapt to changing conditions.|종은 변화하는 환경에 적응해야 한다.",
          "emerge|나타나다|동사|New forms of work are beginning to emerge.|새로운 업무 형태가 나타나기 시작한다.",
          "evolve|진화하다|동사|Language continues to evolve over time.|언어는 시간이 지나며 계속 진화한다.",
          "transform|변형시키다|동사|Digital tools transformed the way we communicate.|디지털 도구는 소통 방식을 바꾸었다.",
          "expand|확장하다|동사|The program will expand into rural areas.|그 프로그램은 농촌 지역으로 확대될 것이다.",
          "decline|감소하다|동사|The birth rate has continued to decline.|출생률이 계속 감소해 왔다.",
          "shift|변화, 이동|명사|We observed a shift in public opinion.|우리는 여론의 변화를 관찰했다.",
          "stable|안정적인|형용사|Prices remained stable for several months.|가격은 몇 달 동안 안정적으로 유지되었다.",
          "gradual|점진적인|형용사|Recovery was slow but gradual.|회복은 느렸지만 점진적이었다.",
          "significant|중대한|형용사|The policy produced a significant improvement.|그 정책은 상당한 개선을 만들어 냈다."
        ]
      },
      {
        title: "주장과 판단",
        focus: "필자의 주장과 타당성을 평가해요",
        rows: [
          "claim|주장하다|동사|The report claims that the system is fair.|보고서는 그 제도가 공정하다고 주장한다.",
          "conclude|결론짓다|동사|The researchers concluded that more tests were needed.|연구자들은 추가 검사가 필요하다고 결론지었다.",
          "evaluate|평가하다|동사|We must evaluate both risks and benefits.|우리는 위험과 이익을 모두 평가해야 한다.",
          "justify|정당화하다|동사|No evidence can justify that conclusion.|어떤 증거도 그 결론을 정당화할 수 없다.",
          "perspective|관점|명사|Try to see the issue from another perspective.|다른 관점에서 문제를 보려고 해라.",
          "relevant|관련 있는|형용사|Only include information relevant to the topic.|주제와 관련 있는 정보만 포함해라.",
          "valid|타당한|형용사|Her criticism raises a valid point.|그녀의 비판은 타당한 지점을 제기한다.",
          "premise|전제|명사|The argument rests on a false premise.|그 주장은 잘못된 전제에 기반한다.",
          "consequence|결과|명사|Every choice has a possible consequence.|모든 선택에는 가능한 결과가 있다.",
          "contradiction|모순|명사|There is a contradiction between the two statements.|두 진술 사이에 모순이 있다."
        ]
      },
      {
        title: "사회와 가치",
        focus: "사회 문제를 읽는 추상 명사를 정리해요",
        rows: [
          "equality|평등|명사|The law aims to promote equality.|그 법은 평등을 증진하는 것을 목표로 한다.",
          "diversity|다양성|명사|Cultural diversity can strengthen a community.|문화적 다양성은 공동체를 강화할 수 있다.",
          "responsibility|책임|명사|Freedom comes with responsibility.|자유에는 책임이 따른다.",
          "institution|제도, 기관|명사|Trust is essential for any public institution.|신뢰는 모든 공공 기관에 필수적이다.",
          "policy|정책|명사|The policy focuses on affordable housing.|그 정책은 저렴한 주거에 초점을 맞춘다.",
          "welfare|복지|명사|The program improved child welfare.|그 프로그램은 아동 복지를 개선했다.",
          "conflict|갈등|명사|Dialogue can prevent unnecessary conflict.|대화는 불필요한 갈등을 막을 수 있다.",
          "cooperation|협력|명사|Global problems require international cooperation.|세계 문제는 국제 협력을 필요로 한다.",
          "ethical|윤리적인|형용사|The debate raises serious ethical questions.|그 논쟁은 심각한 윤리적 질문을 제기한다.",
          "sustainable|지속 가능한|형용사|Cities need more sustainable transport.|도시에는 더 지속 가능한 교통이 필요하다."
        ]
      }
    ]
  },
  {
    id: "summit",
    code: "SUMMIT",
    name: "고등 심화",
    title: "수능 독해 완성",
    school: "고3·수능",
    description: "추론과 비판적 독해에 필요한 고난도 개념어",
    ghost: "F",
    units: [
      {
        title: "추론과 비판",
        focus: "드러나지 않은 의미와 논리의 틈을 읽어요",
        rows: [
          "infer|추론하다|동사|We can infer her intention from the final paragraph.|우리는 마지막 문단에서 그녀의 의도를 추론할 수 있다.",
          "imply|암시하다|동사|Silence does not necessarily imply agreement.|침묵이 반드시 동의를 뜻하는 것은 아니다.",
          "distinguish|구별하다|동사|Readers must distinguish facts from opinions.|독자는 사실과 의견을 구별해야 한다.",
          "integrate|통합하다|동사|The course integrates theory with practice.|그 과정은 이론과 실습을 통합한다.",
          "formulate|체계화하다|동사|The team formulated a new hypothesis.|팀은 새로운 가설을 세웠다.",
          "assess|평가하다|동사|It is difficult to assess the long-term impact.|장기적 영향을 평가하기는 어렵다.",
          "empirical|경험적인, 실증적인|형용사|The claim lacks empirical support.|그 주장은 실증적 뒷받침이 부족하다.",
          "objective|객관적인|형용사|An objective review should consider all evidence.|객관적인 검토는 모든 증거를 고려해야 한다.",
          "ambiguous|모호한|형용사|The final sentence is deliberately ambiguous.|마지막 문장은 의도적으로 모호하다.",
          "coherent|일관성 있는|형용사|The essay presents a coherent argument.|그 글은 일관된 주장을 제시한다."
        ]
      },
      {
        title: "체계와 작동",
        focus: "복잡한 시스템의 구성과 작동을 설명해요",
        rows: [
          "structure|구조|명사|The structure determines how the system behaves.|구조는 시스템이 작동하는 방식을 결정한다.",
          "mechanism|기제, 작동 원리|명사|Scientists still debate the exact mechanism.|과학자들은 정확한 작동 원리를 여전히 논의한다.",
          "function|기능하다|동사|The network functions as a shared resource.|그 네트워크는 공유 자원으로 기능한다.",
          "distribute|분배하다|동사|The platform distributes information rapidly.|그 플랫폼은 정보를 빠르게 배포한다.",
          "regulate|규제하다, 조절하다|동사|The body regulates its own temperature.|신체는 스스로 체온을 조절한다.",
          "compensate|보상하다|동사|Higher efficiency can compensate for limited space.|더 높은 효율은 제한된 공간을 보완할 수 있다.",
          "accumulate|축적하다|동사|Small errors accumulate over time.|작은 오류가 시간이 지나며 쌓인다.",
          "hierarchy|위계|명사|The organization has a flexible hierarchy.|그 조직은 유연한 위계 구조를 가진다.",
          "variable|변수|명사|Researchers controlled every major variable.|연구자들은 모든 주요 변수를 통제했다.",
          "framework|틀, 체계|명사|The theory provides a useful framework for analysis.|그 이론은 분석에 유용한 틀을 제공한다."
        ]
      },
      {
        title: "인간과 사유",
        focus: "인문·사회 지문의 핵심 개념을 구별해요",
        rows: [
          "ideology|이념|명사|Ideology shapes how people interpret events.|이념은 사람들이 사건을 해석하는 방식에 영향을 준다.",
          "convention|관습|명사|Social conventions change across generations.|사회적 관습은 세대에 따라 변한다.",
          "perception|인식|명사|Color can alter our perception of space.|색은 공간에 대한 인식을 바꿀 수 있다.",
          "cognition|인지|명사|Sleep plays an important role in cognition.|수면은 인지에 중요한 역할을 한다.",
          "identity|정체성|명사|Language is closely tied to identity.|언어는 정체성과 밀접하게 연결되어 있다.",
          "norm|규범|명사|What counts as a norm varies by culture.|무엇이 규범인지는 문화에 따라 다르다.",
          "bias|편향|명사|Awareness can reduce unconscious bias.|인식은 무의식적 편향을 줄일 수 있다.",
          "autonomy|자율성|명사|The policy gives schools greater autonomy.|그 정책은 학교에 더 큰 자율성을 준다.",
          "rational|합리적인|형용사|People do not always make rational choices.|사람들은 항상 합리적인 선택을 하지는 않는다.",
          "intrinsic|본질적인, 내재적인|형용사|Curiosity has intrinsic value for learning.|호기심은 학습에 내재적 가치를 지닌다."
        ]
      },
      {
        title: "고난도 독해 동사",
        focus: "긴 지문의 논리 방향을 바꾸는 동사를 익혀요",
        rows: [
          "facilitate|촉진하다|동사|Clear rules facilitate cooperation.|명확한 규칙은 협력을 촉진한다.",
          "constrain|제약하다|동사|Limited time constrains our choices.|제한된 시간은 우리의 선택을 제약한다.",
          "reinforce|강화하다|동사|Repeated success reinforces confidence.|반복된 성공은 자신감을 강화한다.",
          "undermine|약화시키다|동사|False claims undermine public trust.|거짓 주장은 대중의 신뢰를 약화시킨다.",
          "attribute|~의 탓으로 돌리다|동사|Many people attribute the change to technology.|많은 사람은 그 변화를 기술의 영향으로 본다.",
          "derive|끌어내다, 얻다|동사|The word derives from an ancient term.|그 단어는 고대 용어에서 유래한다.",
          "retain|유지하다|동사|The material retains heat for hours.|그 재료는 몇 시간 동안 열을 유지한다.",
          "undergo|겪다|동사|The region underwent rapid development.|그 지역은 급속한 개발을 겪었다.",
          "subsequent|그 이후의|형용사|Subsequent studies produced similar results.|후속 연구들도 비슷한 결과를 냈다.",
          "predominant|지배적인|형용사|Cost remains the predominant concern.|비용이 여전히 주된 우려 사항이다."
        ]
      }
    ]
  }
];

const WORDLINE_CURRICULUM = WORDLINE_RAW_CURRICULUM.map((stage, stageIndex) => ({
  ...stage,
  index: stageIndex,
  units: stage.units.map((unit, unitIndex) => ({
    ...unit,
    id: `${stage.id}-${unitIndex + 1}`,
    index: unitIndex,
    words: unit.rows.map((row, wordIndex) => {
      const [word, meaning, pos, example, exampleMeaning] = row.split("|");
      return {
        id: `${stage.id}-${unitIndex + 1}-${wordIndex + 1}`,
        word,
        meaning,
        pos,
        example,
        exampleMeaning,
        stageId: stage.id,
        stageName: stage.name,
        unitId: `${stage.id}-${unitIndex + 1}`,
        unitTitle: unit.title
      };
    })
  }))
}));

const WORDLINE_WORDS = WORDLINE_CURRICULUM.flatMap(stage =>
  stage.units.flatMap(unit => unit.words)
);
