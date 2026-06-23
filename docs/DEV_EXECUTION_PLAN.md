# 개발 실행 계획

## 목표

GitHub 저장소를 Codex가 안정적으로 작업할 수 있는 구조로 만들고, 설계 산출물 v1.0을 기준으로 MVP를 단계적으로 구현한다.

## 단계 요약

| 단계 | 목표 | 완료 기준 |
|---|---|---|
| D0 | 저장소 부트스트랩 | 설계 문서, AGENTS.md, PR/Issue 템플릿 반영 |
| D1 | 앱 스캐폴드 | 로컬 실행, lint/typecheck/test 기본 통과 |
| D2 | 도메인 타입 | Book, ReadingMoment, CardTemplate, GeneratedCard 타입 구현 |
| D3 | 생성 플로우 UI | 업로드→선택→입력→템플릿→미리보기 화면 이동 가능 |
| D4 | OCR stub | mock OCR 결과 기반 문장 선택/수정 가능 |
| D5 | 추천 엔진 | template_catalog 기반 top 3 추천 가능 |
| D6 | 렌더링 stub | 카드 미리보기와 PNG 다운로드 경로 제공 |
| D7 | API 계약 | openapi.yaml 기준 API route skeleton 구현 |
| D8 | 저장/보관함 | private ReadingMoment 저장/조회/삭제 구현 |
| D9 | QA gate | 테스트 계획, 접근성, 에러 상태, 보안 제한 확인 |

## D0: 저장소 부트스트랩

체크리스트:

- [ ] `/docs/design/munjang-sungan-design-v1.0/`에 설계 산출물 전체 추가
- [ ] 루트 `AGENTS.md` 추가
- [ ] `.github/PULL_REQUEST_TEMPLATE.md` 추가
- [ ] `.github/ISSUE_TEMPLATE/` 추가
- [ ] `codex/prompts/` 추가
- [ ] `docs/DEV_EXECUTION_PLAN.md` 추가
- [ ] 첫 PR 생성

## D1: 앱 스캐폴드

체크리스트:

- [ ] 앱 실행 명령 정의
- [ ] lint 명령 정의
- [ ] typecheck 명령 정의
- [ ] test 명령 정의
- [ ] 기본 라우팅 구성
- [ ] 모바일 웹 viewport 기준 적용
- [ ] CI workflow 추가

## D2: 도메인 기반

체크리스트:

- [ ] `Book` 타입 구현
- [ ] `ReadingMoment` 타입 구현
- [ ] `CardTemplate` 타입 구현
- [ ] `GeneratedCard` 타입 구현
- [ ] `OcrSession` 임시 타입 구현
- [ ] validation schema 구현
- [ ] 단위 테스트 추가

## D3: 생성 플로우 UI

체크리스트:

- [ ] 홈 화면
- [ ] 업로드 화면
- [ ] OCR 처리 화면
- [ ] 문장 선택/수정 화면
- [ ] 기록 입력 화면
- [ ] 템플릿 선택 화면
- [ ] 미리보기/저장 화면
- [ ] 단계 상태 머신 연결

## D4: OCR stub

체크리스트:

- [ ] 이미지 업로드 UI 검증
- [ ] OCR provider interface 정의
- [ ] mock OCR provider 구현
- [ ] 문장 단위 후보 반환
- [ ] OCR 실패 fallback 구현
- [ ] 원본 이미지 미저장 정책 반영

## D5: 추천 엔진

체크리스트:

- [ ] template_catalog import
- [ ] textLength 계산
- [ ] mood/genre/ratio/emphasis 점수 계산
- [ ] top 3 반환
- [ ] 추천 사유 반환
- [ ] 테스트 추가

## D6: 렌더링 stub

체크리스트:

- [ ] 카드 preview component
- [ ] 1:1 layout
- [ ] 4:5 layout
- [ ] 9:16 layout
- [ ] PNG 다운로드 stub
- [ ] overflow 처리

## D7: API 계약

체크리스트:

- [ ] `/api/ocr`
- [ ] `/api/theme/classify`
- [ ] `/api/card-templates`
- [ ] `/api/card-templates/recommend`
- [ ] `/api/cards/render`
- [ ] `/api/reading-moments`
- [ ] 공통 error response

## D8: 저장/보관함

체크리스트:

- [ ] DB schema 반영
- [ ] migration 작성
- [ ] private visibility 고정
- [ ] 저장 목록 조회
- [ ] 상세 조회
- [ ] 삭제 처리

## D9: QA gate

체크리스트:

- [ ] 핵심 happy path e2e
- [ ] OCR 실패 케이스
- [ ] 장문 차단 케이스
- [ ] 템플릿 없음 케이스
- [ ] 렌더링 실패 케이스
- [ ] 보관함 private 접근 제어
- [ ] 개인정보/저작권 안내 노출 확인
