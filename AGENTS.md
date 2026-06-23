# AGENTS.md

## Project

문장순간은 종이책에서 발견한 짧은 문장을 OCR로 가져오고, 사용자의 감상·시간·책 정보를 더해 개인 소장용 이미지 카드로 저장하는 독서 순간 아카이브 서비스다.

## Source of truth

Codex는 작업 전 반드시 아래 문서를 먼저 확인한다.

1. `docs/design/munjang-sungan-design-v1.0/README.md`
2. `docs/design/munjang-sungan-design-v1.0/docs/00_MASTER_DESIGN_v1.0.md`
3. `docs/design/munjang-sungan-design-v1.0/checklists/MASTER_CHECKLIST.md`
4. `docs/design/munjang-sungan-design-v1.0/specs/openapi.yaml`
5. `docs/design/munjang-sungan-design-v1.0/specs/database_schema.sql`
6. `docs/design/munjang-sungan-design-v1.0/specs/template_catalog.json`
7. `docs/design/munjang-sungan-design-v1.0/specs/error_codes.md`

설계 문서와 코드가 충돌하면 설계 문서를 우선하고, 필요한 경우 문서 변경 PR을 별도로 제안한다.

## Non-negotiable MVP constraints

- 공개 피드 구현 금지.
- SNS 자동 공유 구현 금지.
- 긴 문단 저장 구현 금지.
- 페이지 전체 카드화 구현 금지.
- 여러 페이지 연속 OCR 구현 금지.
- OCR 전체 원문 영구 저장 금지.
- 원본 책 이미지 영구 저장 금지.
- 기본 visibility는 반드시 `private`.
- 선택 문구는 최대 100자 또는 정책 파일의 제한값 이내로 제한한다.
- 감상과 사용자 기록이 카드에서 책 원문보다 작동상 더 중요한 정보가 되도록 한다.

## Development workflow

- 한 작업은 한 PR로 끝낸다.
- 한 PR은 하나의 명확한 변경 목적만 가진다.
- 대규모 리팩터링과 기능 구현을 같은 PR에 섞지 않는다.
- 스키마, API, UI, 테스트 변경이 함께 필요한 경우 작업을 분리한다.
- 변경 후 반드시 테스트/타입체크/린트를 실행한다.
- 실패한 검증은 PR 설명에 남기고 원인을 설명한다.

## Default stack assumptions

기존 저장소 스택이 없다면 다음을 기본값으로 사용한다.

- TypeScript
- React 기반 모바일 웹/PWA
- Next.js 계열 App Router 구조
- PostgreSQL 호환 DB
- Prisma 또는 동등한 타입 안전 ORM
- 서버 API route 또는 별도 Node API
- HTML/CSS 기반 카드 렌더링 후 PNG 생성
- Playwright 또는 동등한 headless renderer
- 테스트: unit + integration + minimal e2e

기존 저장소에 이미 다른 스택이 있으면 기존 구조를 우선한다. 단, 도메인 모델과 API 계약은 설계 산출물과 호환되게 유지한다.

## Coding rules

- TypeScript는 strict 모드 기준으로 작성한다.
- 도메인 타입은 `selectedQuote`, `reflection`, `ReadingMoment`, `CardTemplate`, `GeneratedCard` 용어를 유지한다.
- 에러 코드는 `specs/error_codes.md`와 일치시킨다.
- API 요청/응답은 `specs/openapi.yaml`과 일치시킨다.
- 템플릿 추천 로직은 순수 함수로 작성하고 단위 테스트를 붙인다.
- OCR, AI, 렌더링 provider는 adapter 인터페이스로 분리한다.
- 외부 서비스 호출은 MVP 초기에는 mock/stub로 시작하고, 실제 provider 연결은 별도 PR에서 처리한다.

## Review guidelines

- P0: 원본 이미지 또는 OCR 전체 원문을 영구 저장하는 변경.
- P0: 공개 피드, 자동 공유, 장문 원문 저장을 추가하는 변경.
- P0: 인증/인가 없이 private 데이터를 조회하는 변경.
- P1: API 계약과 다른 요청/응답 구조.
- P1: 선택 문구 길이 제한 누락.
- P1: 실패 상태 UI 누락.
- P1: 추천/렌더링 로직에 테스트 없음.
- P2: 문서와 코드 용어 불일치.

## Pull request requirements

PR 설명에는 반드시 다음을 포함한다.

- 작업 목적
- 변경 파일 요약
- 설계 문서 참조 위치
- 테스트 결과
- 남은 리스크
- 다음 작업 제안

## Forbidden shortcuts

- 임의로 MVP 범위를 확장하지 않는다.
- 미구현 API를 성공처럼 보이게 하지 않는다.
- 테스트를 삭제해서 CI를 통과시키지 않는다.
- 타입 오류를 `any`로 덮지 않는다.
- 에러를 콘솔 로그만 남기고 무시하지 않는다.
- 사용자에게 보이는 저작권/개인정보 안내 문구를 제거하지 않는다.
