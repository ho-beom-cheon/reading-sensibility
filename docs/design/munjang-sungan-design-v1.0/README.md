# 문장순간 설계 산출물 패키지 v1.0

- 생성일: 2026-06-23
- 기준 문서: `source/quote-card-product-brief.md`
- 목적: 책 페이지 OCR 기반 문장 선택, 감상 입력, 템플릿 추천, 이미지 카드 생성, 개인 독서 순간 아카이브 MVP 설계

## 패키지 구성

```text
.
├── docs/                         # v0.1 ~ v1.0 단계별 설계서
├── specs/                        # API, DB, AI, 템플릿, 상태, 이벤트 명세
├── checklists/                   # 버전 게이트 및 릴리스 체크리스트
├── issues/                       # 개발 이슈/깃허브 이슈 템플릿
├── qa/                           # 테스트 계획과 QA 시나리오
├── assets/diagrams/              # 로드맵, 플로우, 아키텍처, ERD 다이어그램
├── assets/wireframes/            # 화면 와이어프레임 SVG/PNG
├── assets/sample_cards/          # MVP 템플릿 샘플 카드 이미지
└── source/                       # 원본 브리프
```

## 먼저 볼 파일

1. `docs/00_MASTER_DESIGN_v1.0.md` - 전체 통합 설계서
2. `docs/00_VERSION_ROADMAP_v0.1_to_v1.0.md` - v0.1부터 v1.0까지 단계별 게이트
3. `checklists/MASTER_CHECKLIST.md` - 빠뜨리면 안 되는 전체 체크리스트
4. `issues/development_backlog.md` - 실제 개발 이슈 분해

## 생성된 이미지

- `assets/diagrams/roadmap_v0.1_to_v1.0.png`
- `assets/diagrams/user_flow.png`
- `assets/diagrams/system_architecture.png`
- `assets/diagrams/data_model_erd.png`
- `assets/diagrams/state_machine.png`
- `assets/wireframes/create_flow_wireframes.png`
- `assets/sample_cards/*.png`

## 설계 원칙

- MVP는 공유 플랫폼이 아니라 개인 독서 순간 기록 도구로 시작한다.
- OCR은 완성본이 아니라 수정 가능한 초안 생성 도구다.
- AI는 분위기 분류와 템플릿 추천 보조만 담당한다.
- 원본 책 이미지는 저장하지 않고 OCR 후 삭제한다.
- 긴 문단, 페이지 전체 카드화, 공개 피드, SNS 자동 공유는 MVP에서 제외한다.
