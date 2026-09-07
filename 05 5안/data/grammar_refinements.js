// Editorial corrections for option 5 only. Keep option 4's original course independent.
(function () {
  "use strict";
  const chapters = [...GRAMMAR_A1, ...GRAMMAR_A2, ...GRAMMAR_B1, ...GRAMMAR_B2, ...GRAMMAR_C1];
  const chapter = id => chapters.find(item => item.id === id);
  const exercise = id => chapters.flatMap(item => Object.values(item.exercises).flat()).find(item => item.id === id);
  function examples(id, index, rows) {
    chapter(id).formulas[index].examples = rows.map(([en, kr, note]) => ({en, kr, note}));
  }
  function formula(id, index, text, explanation) {
    Object.assign(chapter(id).formulas[index], {formula:text, coreMeaning:explanation, desc:explanation,
      components:[], usageTip:explanation});
  }
  examples("b1_ch9",0,[
    ["I have just finished my report.","나는 방금 보고서를 끝냈다.","just는 have와 과거분사 사이에서 방금 끝난 일을 나타냅니다."],
    ["Have you finished your report yet?","보고서를 벌써 끝냈니?","yet은 주로 의문문·부정문의 끝에서 지금까지 완료되었는지 묻습니다."]
  ]);
  examples("b1_ch9",1,[["Have you ever visited Canada?","캐나다에 가 본 적 있니?","ever는 지금까지의 경험을 묻습니다."],["I have visited Canada twice.","나는 캐나다에 두 번 가 보았다.","횟수 표현은 과거분사 바로 앞이 아니라 목적어 뒤에 놓습니다."]]);
  examples("b1_ch9",2,[["I have lived in Seoul for five years.","나는 서울에서 5년째 살고 있다.","for는 기간, since는 시작 시점과 연결합니다."]]);
  examples("b1_ch9",3,[["She has gone to the library.","그녀는 도서관에 가서 지금 여기 없다.","gone은 가 버린 현재 결과, been은 다녀온 경험에 초점을 둡니다."],["I have lost my keys.","열쇠를 잃어버려 지금 없다.","과거 사건이 현재의 상태에 영향을 줍니다."]]);
  formula("b1_ch9",0,"have/has + just/already + p.p. / 의문·부정문 끝의 yet","완료를 말할 때 just와 already는 주로 have와 과거분사 사이에, yet은 주로 의문문과 부정문의 끝에 둡니다.");
  formula("b1_ch9",1,"have/has + ever/never + p.p. / have/has + p.p. ... before / twice","ever와 never는 경험 여부를, before와 횟수 표현은 이전 경험이나 반복 횟수를 나타냅니다. 모든 부사를 같은 자리에 끼우는 공식은 아닙니다.");
  examples("b1_ch10",1,[["She was given a book.","그녀는 책 한 권을 받았다.","간접목적어를 주어로 하면 직접목적어가 남습니다."],["A book was given to her.","책 한 권이 그녀에게 주어졌다.","직접목적어를 주어로 하면 사람 앞에 to를 씁니다."]]);
  examples("b1_ch10",2,[["The players were made to run.","선수들은 달리도록 강요받았다.","make의 능동태 목적격보어 run은 수동태에서 to run이 됩니다."],["He was heard to sing.","그가 노래하는 것이 들렸다.","능동태 heard him sing과 수동태 was heard to sing을 대조하세요."]]);
  examples("b2_ch17",0,[["If I had more time now, I would learn French.","지금 시간이 더 있다면 프랑스어를 배울 텐데.","had는 과거 사건이 아니라 현재 사실과의 거리를 나타냅니다."]]);
  examples("b2_ch17",1,[["If we had left earlier, we would have caught the train.","더 일찍 떠났다면 기차를 탔을 텐데.","조건과 결과 모두 이미 지나간 일입니다."]]);
  examples("b2_ch17",2,[["If I had studied medicine, I would be a doctor now.","의학을 공부했다면 지금 의사일 텐데.","과거 조건 had studied가 현재 결과 would be에 연결됩니다."]]);
  examples("b2_ch17",3,[["I wish I knew the answer.","답을 알면 좋을 텐데.","현재의 아쉬움에는 과거형 knew를 씁니다."],["I wish I had called her.","그녀에게 전화했더라면 좋았을 텐데.","과거의 아쉬움에는 과거완료 had called를 씁니다."]]);
  examples("b2_ch18",0,[["Never have I seen such a clear sky.","이렇게 맑은 하늘은 본 적이 없다.","현재완료의 have만 주어 앞으로 가며 seen은 과거분사로 남습니다."],["Rarely does he arrive late.","그는 좀처럼 늦지 않는다.","일반동사 현재형은 does로 도치하고 arrive는 원형으로 씁니다."]]);
  examples("b2_ch18",1,[["Under the tree stood a wooden bench.","나무 아래에는 나무 벤치가 있었다.","장소를 먼저 제시하고 명사 주어를 동사 뒤로 보냅니다."]]);
  examples("b2_ch18",2,[["She enjoys jazz, and so do I.","그녀는 재즈를 좋아하고 나도 그렇다.","긍정 동의: so + do + 주어."],["He cannot swim, and neither can I.","그는 수영을 못하고 나도 못한다.","부정 동의: neither + 조동사 + 주어."]]);
  examples("b2_ch18",3,[["Especially important is the final chapter.","특히 중요한 것은 마지막 장이다.","형용사 보어를 앞으로 보내 강조하고 be동사 뒤에 주어를 둡니다."]]);
  formula("b2_ch18",0,"부정·제한 표현 + 조동사/be + S + 나머지 서술부","일반동사는 do/does/did를 추가하고 원형을 씁니다. 이미 have나 be가 있으면 그것을 주어 앞으로 옮기되 과거분사나 -ing형은 유지합니다. only가 주어만 수식할 때는 도치하지 않습니다.");
  examples("c1_ch25",0,[["Were I to accept the offer, I would have to move.","그 제안을 수락한다면 이사해야 할 것이다.","If I were to accept에서 if를 빼고 were를 앞으로 이동합니다."]]);
  examples("c1_ch25",1,[["Had we left earlier, we would have caught the train.","더 일찍 떠났다면 기차를 탔을 텐데.","If we had left에서 if를 생략하고 had를 주어 앞으로 이동합니다."]]);
  examples("c1_ch25",2,[["Should you need assistance, please call us.","도움이 필요하시면 전화해 주세요.","If you should need의 격식 있는 조건 표현입니다. should 다음은 동사원형입니다."]]);
  examples("c1_ch25",3,[["Had it not been for your help, I would have failed.","네 도움이 없었더라면 실패했을 것이다.","had + it + not + been 순서이며, not을 주어 앞에 놓지 않습니다."]]);
  examples("c1_ch29",2,[["It is surprising that the results were reproducible.","그 결과를 재현할 수 있었다는 점은 놀랍다.","긴 that절을 뒤로 보내고 주어 자리를 it으로 채웁니다."],["We found it difficult to reproduce the results.","우리는 결과를 재현하기 어렵다는 것을 알았다.","목적어 it 뒤에 보어 difficult를 두고 실제 내용인 to부정사를 뒤로 보냅니다."]]);
  examples("c1_ch32",2,[["Factors contributing to climate change require careful analysis.","기후 변화에 기여하는 요인들은 면밀한 분석이 필요하다.","which contribute를 contributing으로 줄여 능동 관계를 유지합니다."]]);
  formula("c1_ch30",0,"must: 강한 추론 / should: 합리적 기대 / may·might·could: 가능성","조동사는 고정된 확률 수치가 아닙니다. must는 증거에 근거한 강한 추론, should는 예상, may·might·could는 가능성을 나타냅니다. 확신의 정도는 문맥과 억양에 따라 달라집니다.");
  examples("c1_ch30",0,[["The results must be wrong.","그 결과는 분명히 잘못되었을 것이다.","결과가 틀렸다는 강한 추론입니다. 실제 관찰이나 증명을 뜻하지는 않습니다."],["The results might be wrong.","그 결과가 틀렸을 수도 있다.","같은 내용에 가능성만 부여하여 단정을 피합니다."]]);
  formula("b2_ch21",1,"지금도 유효한 사실: 현재 시제를 유지할 수 있음","전달 시점에도 사실임을 강조하면 현재형을 유지할 수 있습니다. 과거형으로 시제를 뒤로 옮긴 문장도 문맥에 따라 맞으므로 무조건 오답으로 보지 않습니다.");
  formula("b2_ch21",2,"명확한 과거 사건: 단순과거 유지 가능 / 맥락에 따른 과거완료","연도 등으로 과거 시점이 분명하면 단순과거를 유지할 수 있습니다. 전달 시점보다 앞선 사건임을 강조하면 과거완료로 옮길 수도 있습니다.");
  chapter("c1_ch30").formulas[0].components = [
    {part:"must",desc:"증거에 근거한 강한 추론. 직접 확인한 사실 자체와는 구별합니다."},
    {part:"should",desc:"보통의 조건이라면 그럴 것이라는 합리적 기대."},
    {part:"may / might / could",desc:"가능성은 열어 두되 단정하지 않는 표현."}
  ];
  chapter("c1_ch30").formulas[0].usageTip = "The results must be wrong은 강한 추론입니다. The results might be wrong으로 바꾸면 오류 가능성을 조심스럽게 제시합니다. 연구 근거가 제한적일 때는 후자가 적합합니다.";
  // Replace categorical wording throughout this chapter, not only on the formula tab.
  const reported = chapter("b2_ch21");
  reported.coreExplanation = '<h3>전달하는 시점과 원래 사건의 시점</h3><p>과거에 한 말을 전달할 때 현재형을 과거형으로, 과거형을 과거완료로 옮길 수 있습니다. 이를 시제 후퇴라고 합니다. 하지만 전달 시점에도 참인 사실은 현재형을 유지할 수 있고, 연도로 시점이 분명한 과거 사건은 단순과거를 유지할 수도 있습니다.</p><p>She said that she was tired는 그때 피곤했다고 전합니다. She said that she is tired는 지금도 피곤하다는 내용을 함께 인정하는 표현입니다. 어느 쪽이 맞는지는 말하는 시점과 의도에 달려 있습니다.</p><h3>질문을 전달할 때의 어순</h3><p>직접 질문 Where does she live?를 전달하면 He asked where she lived처럼 의문사 뒤에 주어와 동사를 놓습니다. 의문사가 없으면 if 또는 whether를 씁니다: He asked if I was ready. 원래 질문의 do/does/did는 그대로 남기지 않습니다.</p>';
  reported.keyTakeaways = ["과거 전달동사 뒤에서 시제 후퇴는 일반적이지만 모든 문맥에 강제되는 것은 아닙니다.","여전히 유효한 사실은 현재형을 유지할 수 있고, 명확한 과거 사건은 단순과거를 유지할 수 있습니다.","간접의문문은 의문사/if/whether + 주어 + 동사 순서입니다."];
  reported.pitfalls = [{title:"시제만 보고 오답으로 단정하기",tip:"사건의 시점과 현재에도 사실인지 먼저 확인합니다."},{title:"간접의문문에 질문 어순을 남기기",tip:"He asked where she lived처럼 주어를 동사 앞에 놓습니다."}];
  reported.selfChecks = [{question:"She said that she is tired에서 is를 유지할 수 있는 이유는?",answer:"전달하는 지금도 피곤하다는 내용이 유효함을 강조할 수 있기 때문입니다. 그때 상태만 전하면 was도 가능합니다."},{question:"Where does she live?를 과거에 한 질문으로 전달하면?",answer:"He asked where she lived. 의문사 뒤에 주어와 동사를 놓고 질문용 does를 없앱니다."}];
  exercise("a1_c5_m1").question = '화자와 청자가 어느 역인지 이미 알고 있습니다. 빈칸에 들어갈 관사를 고르세요.\n"I waited for ________ hour at ________ station."';
  exercise("a2_2_c1").acceptedAnswers = ["will visit","are visiting"];
  exercise("a2_2_c1").explanation = "계획에는 are going to visit, 확정된 약속에는 are visiting, 미래 일을 말할 때는 will visit도 가능합니다. 이 문장만으로 한 표현만 강제하지 않습니다.";
  exercise("a2_3_c1").sentence = "Yesterday, he ________ (be able to) solve the puzzle after practicing for an hour.";
  exercise("b1_9_c1").acceptedAnswers = ["have been living"];
  exercise("b1_12_c1").acceptedAnswers = ["Having arrived","On arriving"];
  exercise("b1_13_c1").acceptedAnswers = ["who","that"];
  exercise("b1_13_c1").explanation = "목적격 관계대명사 whom은 격식체이며 who와 that도 가능합니다. 관계절에서 students가 주어, 선행사 teacher가 respect의 목적어입니다.";
  exercise("c1_26_c1").acceptedAnswers = ["accepting"];
  exercise("c1_26_c1").explanation = "having accepted는 부인한 시점보다 앞선 일을 강조합니다. during the previous election campaign이 과거 시점을 드러내므로 accepting도 맞습니다.";
  exercise("c1_27_e1").instruction = "‘배심원단에게 전혀 만족스럽지 않았다’라는 뜻이 되도록 밑줄 친 표현을 바꾸세요. 원문은 문법 오류가 아니라 의미가 다른 문장입니다.";
  exercise("c1_30_e1").instruction = "증거가 가설을 지지합니다. ‘틀림없이 사실이다’라는 강한 긍정적 추론을 나타내도록 밑줄 친 조동사를 바꾸세요.";
  exercise("b2_21_e1").instruction = "지금도 성립하는 지리적 사실임을 강조하도록 밑줄 친 과거형을 현재형으로 바꾸세요. 과거형 자체가 모든 문맥에서 틀린 것은 아닙니다.";
  exercise("b1_16_c1").instruction = "이미 끝난 과거 행동에 대한 강한 부정적 추측을 표현하세요.";
  exercise("b2_20_c1").instruction = "현재의 일반적인 사실로 말하세요. 긴 주어구의 핵심 명사와 수를 일치시키세요.";
  exercise("b2_19_c1").instruction = "그 당시에는 분명히 이해했다는 의미로 과거 동작을 강조하세요.";
  exercise("b1_13_e1").acceptedAnswers = ["which"];
  exercise("b1_14_e1").acceptedAnswers = ["for which"];
  exercise("b1_15_e1").acceptedAnswers = ["Though","Even though"];
  exercise("a2_5_e1").acceptedAnswers = ["far","a lot","even","still"];
  exercise("b1_10_e1").originalSentence = "A terrible earthquake was occurred on the island yesterday.";
  exercise("a2_1_m2").question = "다음 중 문장의 형식이 나머지 세 문장과 다른 것은?";
  exercise("a2_4_m1").question = '물이 거의 남지 않아 마실 수 없다는 뜻으로 빈칸을 채우세요.\n"I am thirsty, but there is ________ water left in the fridge."';
  exercise("b1_9_m1").options[3] = "He has went to Japan twice before.";
  exercise("b1_12_m2").options[3] = "Not knew her address, ...";
  exercise("b1_15_m2").question = "‘서두르지 않으면 늦는다’라는 의도와 어긋나는 조건절을 포함한 문장은?";
  exercise("c1_25_m1").question = "'If you should have any questions, do not hesitate to ask.'에서 should를 유지하면서 if를 생략한 도치문을 고르세요.";
  exercise("c1_26_m1").question = '본인이 지도교수에게 거짓말한 일을 부끄러워한다는 뜻으로 빈칸을 채우세요.\n"He was deeply ashamed of ________ a lie to his thesis advisor."';
  exercise("c1_26_m2").options[0] = "I asked him to leave, but he refused leave.";
  exercise("c1_29_m2").question = "'Such arrogance'를 문두에 강조한 평서문을 고르세요. 질문 어순은 쓰지 않습니다.";
  exercise("c1_31_m1").question = "'Do you think?'와 'What triggered the global economic recession?'을 강조 조동사 did를 추가하지 않고 한 질문으로 결합하세요.";
  // Remove a reported-speech MCQ whose presumed wrong option is valid in real usage.
  const tenseQuestion = reported.exercises.mcq.find(item => item.options.some(option => option.includes("Earth was round")));
  if (tenseQuestion) {
    tenseQuestion.question = "간접의문문의 어순이 올바른 문장을 고르세요.";
    tenseQuestion.options = ["He asked where did she live.","He asked where she lived.","He asked where does she lived.","He asked where she did lived."];
    tenseQuestion.answerIndex = 1;
    tenseQuestion.explanation = "간접의문문은 의문사 + 주어 + 동사 순서입니다. 질문 어순을 그대로 넣지 않습니다.";
  }
})();
