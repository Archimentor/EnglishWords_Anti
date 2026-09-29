# Grammar Atlas · 6안

[배포된 교재](https://archimentor.github.io/EnglishWords_Anti/06%206%EC%95%88/) · [1–83단계 대화 원문](https://chatgpt.com/share/6abb3b19-1004-83ee-8b42-f2748b5e55f8)

원리를 충분히 읽고 이해하는 120단계 영문법 교재입니다. 1–83단계는 사용자가 제공한 대화 원문을 가져왔고, 84–120단계는 기존 과정의 주제·순서에 맞춰 같은 설명 방식으로 이어 썼습니다.

## 본문

- 1–83단계의 문장, 설명 순서, 제목, 강조, 예문·해석, 비교표, 핵심 정리와 연습을 보존합니다. 명백한 오류만 바로잡으며 본문에 수정 이력은 붙이지 않습니다.
- 84–120단계도 상황 → 의미와 구조 → 예문·해석 → 용법과 혼동 비교 → 핵심 → 연습의 교재 형식입니다. 단계를 짧은 공통 틀로 요약하지 않습니다.
- 120개 Markdown 원고, 총 384,789자. 글자 수는 누락 확인용이며 내용의 정확성이나 학습 효과를 인증하는 수치는 아닙니다.
- 본문 속 연습은 원래 위치에서 읽습니다. 별도의 자기 설명·작문 기록은 접힌 선택 영역이며 다음 단계로 이동하기 위한 조건이 아닙니다.
- 상세한 읽기 목차와 이전/다음 단계, 관련 단계, 전체 메인메뉴 이동을 제공합니다.
- Notion의 [120단계 과정 목차](https://app.notion.com/p/3e90e2451ae381218535e6687480d409)를 유지합니다. 원본에 CEFR 배정이 없어 임의의 공인 등급표는 만들지 않습니다.

## 학습 기록

- 번호·주제·핵심 요약 검색, 범위·읽기 완료·북마크 필터.
- 읽던 절, 북마크, 메모, 자기 설명, 작문, 읽기 완료·복습 일정 저장.
- 기존 `grammar_atlas_option6_v1` 키와 백업 형식을 유지합니다. 옛 `topic-N`, `structure`, `examples`, `contrast` 링크는 새 본문의 대응 절로 연결합니다.
- 읽기 완료 1일 뒤 첫 복습. 예정된 자기평가 성공 시 3/7/14/30일, 실패 시 10분 뒤 재확인, 실패 후 성공은 1일 뒤입니다. 조기·반복 클릭으로 간격을 늘리지 않습니다.
- 저장 실패 안내, 다른 탭 변경 시 덮어쓰기 중단, 손상 원본 보존, 백업 검증·복원 기능을 유지합니다.
- 기록은 해당 브라우저의 로컬 저장소에만 있습니다. 서버 동기화나 자동 문법 채점은 없습니다. 2–5안의 기록을 변경하지 않습니다.

## 파일과 빌드

- `content/001.md` … `120.md`: 편집 대상인 교재 본문.
- `data/chapters-01.js` … `06.js`: Markdown에서 생성한 정적 본문·목차. 직접 편집하지 않습니다.
- `scripts/reader-build.mjs`: 안전한 HTML 변환, 목차·기존 앵커 매핑, 묶음 파일 생성.
- `vendor/marked.mjs`: 빌드에만 사용하는 Marked 18.0.14. MIT 라이선스와 출처를 함께 보관합니다. 실행 중 CDN이나 Markdown 변환 API를 호출하지 않습니다.
- `data/conversation-source.json`: 가져온 83개 원문의 해시. 대화 전체의 개인 정보·메타데이터는 배포하지 않습니다.
- `data/source.js`: Notion 과정 대응표. Notion 원문은 수정하지 않았습니다.
- `data/lessons-01.js` … `06.js`: 선택 활동·복습 질문·관련 단계에 쓰는 기존 보조 데이터.
- `data/teaching-01.js` … `06.js`: 이전 판의 보충 설명 데이터. 현재 화면은 이 파일을 불러오지 않습니다.
- `js/engine.js`: 기록·복습·백업 검증. `js/app.js`: 본문·검색·노트·복습 UI.

Node.js로 저장소 루트에서 실행합니다. 생성된 파일도 함께 배포하므로 GitHub Pages 실행 시에는 빌드 서버가 필요하지 않습니다.

```powershell
node "06 6안/scripts/reader-build.mjs"
node "06 6안/scripts/verify-reader.mjs"
node "06 6안/scripts/verify-manuscripts.mjs"
node "06 6안/scripts/verify-content.mjs"
node "06 6안/scripts/verify-engine.mjs"
node --check "06 6안/js/app.js"
```

원문 공유 페이지의 HTML을 로컬에 보관한 경우 아래 검사로 83단계 전체 문장을 대조할 수 있습니다. 경로는 실제 내려받은 파일로 지정합니다. 전체 공유 HTML은 저장소에 넣지 않습니다.

```powershell
node "06 6안/scripts/verify-manuscripts.mjs" ".playwright-mcp/share-source.html"
```

`verify-depth.mjs`도 같은 본문 검사로 연결됩니다. `browser-test.cjs`, `browser-storage.cjs`는 이전 판의 Playwright MCP용 검사이며 현 교재 DOM의 검증으로 사용하지 않습니다. 현재 브라우저 검증 범위는 `QUALITY_AUDIT.md`에 기록합니다.

## 참고와 한계

원문 외에 새 내용을 작성하고 모호한 용법을 확인할 때 대조한 1차 자료입니다. 해당 자료의 본문을 통째로 가져온 교재가 아닙니다.

- [Cambridge — May as well and might as well](https://dictionary.cambridge.org/grammar/british-grammar/may-as-well-and-might-as-well)
- [Cambridge — Question tags](https://dictionary.cambridge.org/grammar/british-grammar/question-tags)
- [Cambridge — Who, whom](https://dictionary.cambridge.org/us/grammar/british-grammar/who-whom)
- [Cambridge — Cleft sentences](https://dictionary.cambridge.org/uk/grammar/british-grammar/cleft)
- [British Council — Participle clauses](https://learnenglish.britishcouncil.org/free-resources/grammar/c1/participle-clauses)
- [British Council — Inversion after negative adverbials](https://learnenglish.britishcouncil.org/free-resources/grammar/c1/inversion-after-negative-adverbials)
- [British Council — Suggestions and obligations](https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/suggestions-obligations?page=1)

기능·원문 일치 검사는 전문 교정자의 전면 감수나 학습 효과 실험을 대신하지 않습니다. 모든 문법 예외를 망라하는 사전이나 CEFR 인증 과정이 아닙니다.
