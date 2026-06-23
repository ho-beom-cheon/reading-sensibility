# Codex 작업 묶음: M0~M2

## M0-01. 저장소 부트스트랩

목표: 설계 산출물과 Codex 작업 규칙을 저장소에 반영한다.

작업:

- `docs/design/munjang-sungan-design-v1.0/` 생성
- 설계 산출물 전체 복사
- 루트 `AGENTS.md` 추가
- PR/Issue 템플릿 추가
- 개발 실행 계획 문서 추가

검증:

- 저장소 루트에서 `AGENTS.md` 확인 가능
- 설계 문서 경로가 README와 일치

## M1-01. 앱 스캐폴드

목표: 로컬에서 실행 가능한 모바일 웹 앱의 기본 골격을 만든다.

작업:

- 앱 프레임워크 초기화
- TypeScript strict 적용
- lint/typecheck/test 명령 추가
- 홈, create, library route 추가
- CI workflow 추가

검증:

- 앱 실행 가능
- lint 통과
- typecheck 통과
- test 통과

## M1-02. 디자인 문서 import 계약

목표: 설계 산출물의 OpenAPI, DB schema, template catalog를 코드 기준 자료로 연결한다.

작업:

- `specs/openapi.yaml` 복사 또는 참조
- `specs/template_catalog.json`을 앱 데이터로 import 가능한 위치에 둔다
- 오류 코드 enum 생성
- 정책 상수 생성

검증:

- template catalog를 테스트에서 읽을 수 있음
- 오류 코드 enum과 문서가 일치

## M2-01. 도메인 타입과 validation

목표: MVP 핵심 데이터 모델을 타입과 validation schema로 고정한다.

작업:

- Book
- ReadingMoment
- CardTemplate
- GeneratedCard
- OcrSession
- Quote length policy
- Reflection length policy

검증:

- 100자 초과 문구 차단 테스트
- private visibility 기본값 테스트
- template ratio validation 테스트

## M2-02. 생성 플로우 상태 머신

목표: 업로드부터 저장 완료까지 화면 상태 전이를 구현한다.

작업:

- CreateCardState 정의
- step enum 정의
- next/prev transition 함수
- invalid transition 차단

검증:

- upload → ocr → selectQuote → details → templates → preview → done 순서 테스트
- 문장 미선택 상태에서 details 이동 차단 테스트
