# Grammar Atlas · 6안

[배포된 교재](https://archimentor.github.io/EnglishWords_Anti/06%206%EC%95%88/) · [노션 1–120단계 원문](https://app.notion.com/p/3e90e2451ae381218535e6687480d409)

원리를 충분히 읽고 이해하는 영문법 교재입니다. 2026-09-30 확인한 노션의 120개 단계별 페이지를 모두 원문 그대로 반영했습니다. 이전 판의 대화 원문과 자체 집필 원고를 섞지 않습니다. 노션 원본은 읽기만 했습니다.

## 본문과 학습 기록

- 본문 전체 문자열을 그대로 보관하고 각 페이지의 실제 제목만 문서 맨 위에 붙입니다. 문장 수정·축약·재요약을 하지 않았습니다.
- 제목·문단·인용·강조·코드·예문과 해석·비교표·목록·구분선·연습의 순서를 유지합니다. 노션의 블록 경계, 셀 안 줄바꿈, 중첩된 연습 설명을 안전하게 렌더링합니다.
- 원문 본문 369,333자, 제목 포함 원고 373,044자, 표 57개입니다. 수치는 누락 확인용이며 학습 효과나 내용 정확성의 인증이 아닙니다.
- 본문 속 연습은 원래 위치에서 읽습니다. 기존 자기 설명·작문 기록은 본문 뒤 접힌 선택 영역이며 다음 단계 이동의 조건이 아닙니다.
- 소제목 목차·이전/다음·관련 단계·전체 메인메뉴 이동, 번호·주제·원문 도입부 검색과 학습 상태 필터를 제공합니다.
- 기존 `grammar_atlas_option6_v1` 키와 백업 형식을 유지합니다. 옛 `topic-N`, `structure`, `examples`, `contrast` 링크도 연결합니다. 원문의 소제목 순서가 달라진 경우 같은 절 번호가 이전과 다른 소제목을 가리킬 수 있습니다.
- 읽기 완료 1일 뒤 첫 복습. 예정된 자기평가 성공 시 3/7/14/30일, 실패 시 10분 뒤, 실패 후 성공은 1일 뒤입니다. 조기·반복 클릭으로 간격을 늘리지 않습니다.
- 저장 실패 안내, 다른 탭 변경 시 덮어쓰기 중단, 손상 원본 보존, 백업 검증·복원 기능을 유지합니다.
- 기록은 해당 브라우저에만 저장됩니다. 서버 동기화나 자동 문법 채점은 없습니다. 2–5안의 기록을 변경하지 않습니다.

## 파일과 동기화

- `content/001.md` … `120.md`: 노션 원문 전체와 실제 페이지 제목. 수동 편집하면 출처 해시 검증이 실패합니다.
- `data/notion-source.json`: 확인일, 페이지 URL·수정 시각, 본문·원고 SHA-256. 개인적인 상위 경로 등 불필요한 메타데이터는 포함하지 않습니다.
- `data/source.js`: 최신 제목·페이지 링크·검색용 원문 도입부.
- `data/chapters-01.js` … `06.js`: 생성한 정적 본문·목차. 직접 편집하지 않습니다.
- `scripts/notion-import.mjs`: 누락·중복·제목·미지원 블록을 검사하고 120개 원문을 일괄 반영합니다.
- `scripts/notion-markdown.mjs`: 저장된 원문을 바꾸지 않고 노션 블록 경계와 표를 변환합니다.
- `scripts/reader-build.mjs`: 안전한 HTML·목차·기존 앵커·묶음 파일 생성. 해시 불일치나 미지원 표는 중단합니다.
- `vendor/marked.mjs`: 빌드 전용 Marked 18.0.14. 브라우저에서 외부 Markdown 변환 API를 호출하지 않습니다.
- `data/lessons-01.js` … `06.js`: 기존 선택 활동·복습·관련 단계용 보조 데이터로 원문 본문과 분리되어 있습니다.
- `data/teaching-*.js`, `data/conversation-source.json`, `scripts/reviewed-source-edits.json`: 이전 판의 자료이며 현재 원문 가져오기·본문 표시에 사용하지 않습니다.
- `js/engine.js`: 기록·복습·백업. `js/app.js`: 읽기·검색·노트·복습 UI.

노션 커넥터로 목차와 120개 자식 페이지를 읽고 응답을 로컬의 무시된 폴더에 보관합니다. `index.json`에는 `fetched`, `parent`, `stages: [{id,url,title}]`을, `001.json` … `120.json`에는 페이지 응답의 `text`, `url`, `page_last_edited_at` 등을 담습니다. 원본 캡처 폴더는 저장소나 사이트에 올리지 않습니다.

Node.js로 저장소 루트에서 실행합니다. 캡처 경로는 실제 확보한 폴더로 지정합니다.

```powershell
node "06 6안/scripts/notion-import.mjs" ".playwright-mcp/notion-20260930"
node "06 6안/scripts/verify-notion-import.mjs"
node "06 6안/scripts/verify-notion.mjs"
node "06 6안/scripts/verify-reader.mjs"
node "06 6안/scripts/verify-manuscripts.mjs" ".playwright-mcp/notion-20260930"
node "06 6안/scripts/verify-content.mjs"
node "06 6안/scripts/verify-engine.mjs"
node --check "06 6안/js/app.js"
```

캡처 인자를 생략해도 저장된 원문 해시·표·표시 단어와 숫자·목차·배포 묶음을 검사합니다. 렌더러만 바꾼 경우 `node "06 6안/scripts/reader-build.mjs"`로 다시 생성합니다. 생성 파일도 배포하므로 GitHub Pages에서 빌드 서버는 필요하지 않습니다.

`verify-depth.mjs`도 본문 검사로 연결됩니다. `browser-test.cjs`, `browser-storage.cjs`는 이전 DOM용으로 현재 검증에 사용하지 않습니다. 이번 검증 범위는 `QUALITY_AUDIT.md`에 기록합니다.

## 범위와 한계

원문 일치 검사는 전문 교정자의 전면 감수나 학습 효과 실험을 대신하지 않습니다. 원본에 CEFR 배정이 없어 임의의 공인 등급표는 만들지 않습니다. 기본 글꼴은 기존 외부 CDN을 사용하며 학습 기록의 서버 전송·동기화는 없습니다.
