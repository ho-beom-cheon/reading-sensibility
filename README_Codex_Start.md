# 문장순간 Codex 개발 핸드오프 v0.1

이 패키지는 `문장순간 설계 산출물 v1.0`을 GitHub 저장소에서 Codex 중심 개발로 전환하기 위한 부트스트랩 자료입니다.

## 적용 순서

1. 기존 설계 ZIP의 전체 내용을 저장소 `/docs/design/munjang-sungan-design-v1.0/` 아래에 넣는다.
2. 이 패키지의 `AGENTS.md`를 저장소 루트에 넣는다.
3. `.github/` 디렉터리 내용을 저장소에 병합한다.
4. `codex/prompts/`의 프롬프트를 00번부터 순서대로 Codex에 실행시킨다.
5. 각 Codex 작업은 반드시 별도 브랜치와 PR 단위로 처리한다.
6. PR마다 `npm run lint`, `npm test`, `npm run typecheck` 또는 저장소에 정의된 동등 명령을 통과시킨다.
7. v0.1부터 v1.0까지 버전 게이트 체크리스트를 완료한 뒤 다음 단계로 넘어간다.

## 기본 개발 원칙

- 설계 문서가 요구사항의 기준이다.
- MVP 범위를 벗어나는 기능은 구현하지 않는다.
- 공개 피드, SNS 자동 공유, 긴 문단 저장, 페이지 전체 카드화는 구현 금지다.
- 원본 책 사진과 OCR 전체 원문은 영구 저장하지 않는다.
- AI는 이미지 생성이 아니라 mood/style 분류와 템플릿 추천 보조만 담당한다.
- 모든 기능은 테스트 가능해야 한다.

## 우선 실행 순서

```text
00_bootstrap_repo.md
01_scaffold_application.md
02_import_design_contracts.md
03_foundation_domain_types.md
04_create_flow_ui_shell.md
05_mock_ocr_and_quote_selection.md
06_template_catalog_and_recommendation.md
07_render_preview_stub.md
08_api_contract_stub.md
09_quality_gate.md
```

## 개발 완료 기준

MVP 개발 완료는 다음 조건을 모두 만족해야 한다.

- 사용자가 책 페이지 이미지를 업로드할 수 있다.
- OCR 또는 mock OCR 결과에서 문장을 선택/수정할 수 있다.
- 책 제목, 작가명, 페이지, 감상을 입력할 수 있다.
- 템플릿 추천 top 3가 표시된다.
- 1:1, 4:5, 9:16 비율 중 하나를 선택할 수 있다.
- 카드 미리보기가 생성된다.
- PNG 다운로드 경로가 동작한다.
- 보안/저작권 제한 정책이 코드와 UI에 반영되어 있다.
