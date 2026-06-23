# 문장순간 버전 로드맵 v0.1 → v1.0

- 기준일: 2026-06-23
- 목적: 설계가 중간에 건너뛰지 않도록 각 버전을 독립적인 게이트로 정의한다.
- 원칙: 이전 버전의 산출물과 체크리스트가 완료되지 않으면 다음 버전으로 넘어가지 않는다.

## 버전 단계 요약

| 버전 | 단계 | 목표 |
|---|---|---|
| v0.1 | 제품 정의/PRD 고정 | 제품 문제, 가치, MVP 포함/제외 범위, 성공 기준을 확정한다. |
| v0.2 | 사용자 플로우/IA 고정 | 사용자가 홈에서 카드 저장까지 이동하는 전체 경로와 정보구조를 확정한다. |
| v0.3 | 화면/와이어프레임 고정 | 각 화면의 UI 컴포넌트, 입력값, 검증, 에러 메시지를 확정한다. |
| v0.4 | 데이터 모델/상태 모델 고정 | Book, ReadingMoment, GeneratedCard, Template, OCR 세션과 상태 전이를 확정한다. |
| v0.5 | API/오류 계약 고정 | 클라이언트-서버 연동 API, 요청/응답/에러 코드를 확정한다. |
| v0.6 | OCR/AI/추천 명세 고정 | OCR 처리 정책, AI 입력/출력, 템플릿 추천 점수식을 확정한다. |
| v0.7 | 렌더링/템플릿 시스템 고정 | 카드 렌더링 파이프라인, 템플릿 카탈로그, 해상도/오버플로우 정책을 확정한다. |
| v0.8 | 보안/개인정보/저작권 안전장치 고정 | 저장 정책, 원본 이미지 삭제, private visibility, 고지 문구를 확정한다. |
| v0.9 | QA/베타/운영 지표 고정 | 테스트 시나리오, 지표, 로그, 베타 운영 기준을 확정한다. |
| v1.0 | 릴리스/핸드오프 고정 | 출시 가능 조건, 개발 백로그, 검수 체크리스트, 운영 인수인계를 확정한다. |


## 전체 게이트 규칙

```text
v0.1 PRD 확정
  ↓
v0.2 플로우/IA 확정
  ↓
v0.3 화면 명세 확정
  ↓
v0.4 데이터/상태 확정
  ↓
v0.5 API 계약 확정
  ↓
v0.6 OCR/AI/추천 확정
  ↓
v0.7 렌더링/템플릿 확정
  ↓
v0.8 보안/저작권/개인정보 확정
  ↓
v0.9 QA/베타/운영 확정
  ↓
v1.0 릴리스 핸드오프
```

## 버전별 통과 조건

각 버전은 다음 4개 항목이 모두 완료되어야 종료한다.

1. 산출물 파일 작성 완료
2. 이해관계자 검토 항목 정리
3. 개발 이슈로 분해 가능한 수준의 명세 확보
4. 이전 버전과 충돌하는 항목이 없는지 확인

## 버전별 산출물 매핑

| 버전 | 산출물 |
|---|---|
| v0.1 | `01_v0.1_product_charter_prd.md` |
| v0.2 | `02_v0.2_user_flow_ia.md` |
| v0.3 | `03_v0.3_screen_wireframe_spec.md`, `assets/wireframes/create_flow_wireframes.png` |
| v0.4 | `04_v0.4_data_state_model.md`, `specs/database_schema.sql`, `assets/diagrams/data_model_erd.png` |
| v0.5 | `05_v0.5_api_error_contract.md`, `specs/openapi.yaml`, `specs/error_codes.md` |
| v0.6 | `06_v0.6_ocr_ai_recommendation_spec.md`, `specs/ai_prompt_and_schema.md` |
| v0.7 | `07_v0.7_rendering_template_asset_spec.md`, `specs/template_catalog.json`, `assets/sample_cards/*.png` |
| v0.8 | `08_v0.8_security_privacy_copyright_spec.md` |
| v0.9 | `09_v0.9_qa_beta_ops_metrics.md`, `qa/test_plan.md`, `specs/event_taxonomy.md` |
| v1.0 | `10_v1.0_release_handoff.md`, `issues/development_backlog.md` |
