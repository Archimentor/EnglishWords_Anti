# Grammar Atlas · 6안

Notion의 **ChatGPT 영문법 학습 정리 1~120단계**를 기준으로 만든 독립 교재형 학습기입니다. 별도 빌드나 서버 API 없이 GitHub Pages에서 실행됩니다.

## 콘텐츠

- 원본 120개 하위 페이지의 번호·제목·순서·핵심 요약 보존 (`data/source.js`, 2026-09-29 조회).
- 각 단계: 기본 원리·구조에 이어 상황, 문장 변형, 세부 용법, 혼동 비교를 다루는 상세 강의 5개 이상. 영어 예문·한국어 해석·문법적 이유를 함께 읽습니다.
- 120단계 전체에 해설 예문 974개 블록, 본문 약 18.9만 자(영문·한글·구조·해설 포함). 단계마다 본문 1,200자 이상입니다. 분량 검사는 최소 구조 기준이며 내용 감수를 대신하지 않습니다.
- 83단계는 사용자가 제시한 상세 예시를 기준으로 11개 추가 설명, should/would rather/had better 비교, 부정형, 생활 표현, 해설이 붙은 선택형 6문항을 제공합니다.
- 선택 활동: 자기 설명 질문과 해설, 직접 문장 만들기와 예시·해설. 자동 정답 판정은 하지 않습니다.
- 교재 중심 85–90%를 지향하는 화면 구성입니다. 실제 학습 시간·숙련도 측정 수치가 아닙니다.
- 원본에는 CEFR별 배정이 없어 임의의 공인 등급표는 제공하지 않습니다.

## 학습 기록

- 목차 번호/주제/핵심 요약 검색, 범위·완료 상태·북마크 필터.
- 읽던 절 위치, 읽기 완료, 북마크, 단계별 메모·작문·자기 설명 저장.
- `grammar_atlas_option6_v1` 키 사용. 2–5안의 기록은 건드리지 않습니다.
- 읽기 완료 후 1일 뒤 첫 복습, 예정된 복습의 자기평가 성공 시 3/7/14/30일, 실패 시 10분 뒤 재확인. 실패 후 성공은 1일 뒤로 돌아갑니다.
- 조기 재방문이나 반복 클릭으로 간격을 늘리지 않습니다. 읽기 완료와 회상 성공을 별도로 기록합니다.
- 브라우저 저장 실패 안내, 다른 탭 변경 시 덮어쓰기 중단, 손상 기록 원문 보존·다운로드, 백업 검증·복원 지원.

## 파일

- `data/source.js`: 원본 대응표. Notion 원문은 수정하지 않았습니다.
- `data/lessons-01.js` … `lessons-06.js`: 20단계 단위의 보충 집필 내용.
- `data/teaching-01.js` … `teaching-06.js`: 각 단계의 주제별 심화 설명·추가 해설 예문. 이 데이터가 빠지면 불완전한 요약본을 표시하지 않고 로딩 오류를 안내합니다.
- `js/engine.js`: DOM과 분리한 기록·간격 복습·백업 검증.
- `js/app.js`: 읽기·검색·노트·복습 화면.
- `css/style.css`: 반응형·큰 글씨·동작 줄이기·인쇄 스타일.
- `../shared/portal.js`: 기존 과정과 공통인 이동·기록 백업 기능.

## 검증

저장소 루트에서:

```powershell
node "06 6안/scripts/verify-content.mjs"
node "06 6안/scripts/verify-depth.mjs"
node "06 6안/scripts/verify-engine.mjs"
```

`scripts/browser-test.cjs`, `scripts/browser-storage.cjs`는 Playwright MCP의 `browser_run_code_unsafe`가 읽는 `async (page) => …` 형식입니다. 단독 Node 실행 파일이 아닙니다. 저장소 루트를 `http://127.0.0.1:8768/`에서 제공한 뒤 `filename`으로 실행합니다. 각 검사는 별도 브라우저 컨텍스트를 만들고 `finally`에서 닫습니다.

## 집필 참고와 한계

기준 문서: [Notion 원본](https://app.notion.com/p/3e90e2451ae381218535e6687480d409).

보충 집필 중 특히 혼동하기 쉬운 용법을 대조한 참고 자료:

- [Cambridge — Would rather, would sooner](https://dictionary.cambridge.org/grammar/british-grammar/would-rather-would-): 같은/다른 주어에 따른 형태.
- [Cambridge — May as well and might as well](https://dictionary.cambridge.org/grammar/british-grammar/may-as-well-and-might-as-well): 더 나은 대안이 없을 때의 제안, 단순 가능성과의 구별.
- [British Council — Suggestions and obligations](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/suggestions-obligations?page=1): 제안의 that절에서 should와 원형 가정법의 사용.
- [British Council — Participle clauses](https://learnenglish.britishcouncil.org/free-resources/grammar/c1/participle-clauses): 분사구문의 주체, 완료분사의 선행 관계.
- [British Council — Inversion after negative adverbials](https://learnenglish.britishcouncil.org/free-resources/grammar/c1/inversion-after-negative-adverbials): 부정어 도치와 do 보충.

이 자료를 통째로 가져온 교재가 아닙니다. 원본 요약에 자체 작성한 설명과 예문을 보충했으며, 시험 인증·개별 문법 교정·개인별 기억력 측정은 제공하지 않습니다. 기능 검증은 영문법 전문가의 전면 감수나 학습 효과 실험을 대체하지 않습니다.
