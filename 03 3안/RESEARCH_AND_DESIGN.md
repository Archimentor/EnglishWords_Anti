# 3안 학습 방식 재설계 근거

조사일: 2026-09-01

## 문제 정의

기존 3안은 이미 아는 단어도 한 장씩 열고 `다시 / 어려움 / 기억함 / 쉬움`을 눌러야 했다. 이는 학습자가 알고 있는 범위를 빠르게 통과하지 못하게 하고, 자기평가를 복습 스케줄의 주된 근거로 사용한다는 문제가 있었다.

## 서비스 사례

- [Lingvist Knowledge Mapping Engine](https://lingvist.com/blog/is-there-a-map-for-learning-a-language/): 배치 테스트의 일부 응답으로 더 넓은 어휘 지식을 예측하고, 학습·망각 이력을 이용해 개인별 콘텐츠를 조절한다.
- [Duolingo Birdbrain](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain/): 개별 문항 결과와 콘텐츠 난이도를 함께 모델링해 알맞은 난이도의 세션을 구성한다.
- [Vocabulary.com 적응형 학습](https://www.vocabulary.com/how-it-works/): 각 응답으로 지식 수준을 갱신하고, 마지막 학습 시점까지 고려해 다시 물을 단어를 정한다.
- [WordUp Knowledge Map](https://www.wordupapp.co/support): 전체 어휘를 아는 단어, 배울 단어, 아직 확인하지 않은 단어로 나눠 지식의 빈틈을 시각화한다.
- [Memrise의 이미 아는 단어 처리](https://memrisebeta.zendesk.com/hc/en-us/articles/4963156179601-Can-I-ignore-words-I-already-know): 이미 아는 항목을 제외할 수 있지만 단어별 조작이 필요하므로, 3안에서는 이를 묶음 선택으로 확장했다.
- [Anki FSRS 설정](https://docs.ankiweb.net/deck-options.html?highlight=FSRS): 목표 기억 유지율이 높을수록 복습 부담이 급격히 늘어난다. 무조건 자주 보여주는 대신 기억과 학습량 사이의 균형이 필요하다.

## 연구에서 가져온 원칙

1. **자기보고만 믿지 않는다.** Yes/No 어휘 검사는 빠르지만 학습자가 지식을 과대평가할 수 있다. 따라서 묶음 스캔 뒤 무작위 표본을 실제 뜻 회상으로 검증한다.  
   - [Examining the Yes/No vocabulary test](https://www.researchgate.net/publication/240738527_Examining_the_YesNo_vocabulary_test_Some_methodological_issues_in_theory_and_practice)
   - [Scoring Yes–No vocabulary tests: Reaction time vs. nonword approaches](https://doi.org/10.1177/0265532212438053)

2. **긴 진단 대신 적응형 표본을 쓴다.** 컴퓨터 적응형 어휘 검사는 전체 문항의 약 3분의 1만으로도 전체 검사와 비슷한 추정치를 낼 수 있었다.  
   - [Measuring English vocabulary size via computerized adaptive testing](https://doi.org/10.1016/j.compedu.2016.02.018)

3. **읽기보다 회상을 일정에 반영한다.** 반복해서 다시 읽는 것보다 실제로 꺼내 보는 연습이 장기 기억에 유리하다. 실패한 사전 인출도 바로 피드백을 주면 뒤의 학습을 강화할 수 있다.  
   - [The Power of Testing Memory](https://doi.org/10.1111/j.1745-6916.2006.00012.x)
   - [Unsuccessful Retrieval Attempts Enhance Subsequent Learning](https://doi.org/10.1037/a0015729)

4. **고정 망각 곡선이 아니라 개인별 증거를 쓴다.** 단어별 마지막 학습 시점과 성공·실패 이력으로 기억의 반감기를 추정하는 방식이 언어 학습용 간격 반복에 사용된다.  
   - [A Trainable Spaced Repetition Model for Language Learning](https://research.duolingo.com/papers/settles.acl16.pdf)
   - [Adaptive Forgetting Curves for Spaced Repetition Language Learning](https://pmc.ncbi.nlm.nih.gov/articles/PMC7334729/)

5. **게임 요소는 학습 행동에 붙인다.** 게임화는 평균적으로 작은 긍정 효과가 있지만, 장식 자체보다 피드백·목표·실제 학습 행동과의 연결이 중요하다.  
   - [The Gamification of Learning: a Meta-analysis](https://doi.org/10.1007/s10648-019-09498-w)

6. **즉시 피드백과 문맥을 제공한다.** 학습자 설문에서는 접근성과 교정 피드백을 장점으로 봤지만, 문맥 없는 단어 제시는 약점으로 지적됐다.  
   - [Students’ Perceptions of an EFL Vocabulary Learning Mobile Application](https://files.eric.ed.gov/fulltext/EJ1245601.pdf)

## 적용한 새 흐름

1. `SCAN`: 5분은 16개, 10분은 24개, 15분은 32개를 한꺼번에 보여준다. 뜻이 바로 떠오르지 않는 단어만 누른다.
2. `CHECK`: 누르지 않은 단어 중 2~4개만 뜻 회상 문제로 확인한다.
3. `BULK PASS`: 표본을 모두 맞히면 검증 표본은 45일, 같은 묶음의 나머지는 21일 뒤 다시 확인한다. 표본을 틀리면 나머지는 3일간 보류하고 성급하게 숙달 처리하지 않는다.
4. `LEARN`: 사용자가 고른 단어와 표본 검사에서 틀린 단어만 뜻·발음·문맥을 본다.
5. `PROVE`: 뜻, 역방향, 문맥, 듣기, 철자 문제에서 실제로 회상한다.
6. `SCHEDULE`: 정답 여부, 응답 시간, 힌트 사용, 누적 성공 횟수로 다음 복습을 자동 배정한다. 난이도 자기평가 버튼은 사용하지 않는다.

이 구현은 ‘한 번의 스캔으로 영구 숙달’이라고 주장하지 않는다. 묶음 통과는 잠정 상태이며, 장기 기억으로 집계하려면 이후 실제 회상 검증이 필요하다.
