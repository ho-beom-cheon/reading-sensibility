# 권장 저장소 구조

기존 저장소가 비어 있거나 스택이 고정되지 않은 경우 다음 구조를 기준으로 한다.

```text
.
├── AGENTS.md
├── README.md
├── docs/
│   ├── design/
│   │   └── munjang-sungan-design-v1.0/
│   └── DEV_EXECUTION_PLAN.md
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── create/
│   │   ├── library/
│   │   └── api/
│   ├── components/
│   │   ├── create-flow/
│   │   ├── cards/
│   │   └── ui/
│   ├── domain/
│   │   ├── book.ts
│   │   ├── reading-moment.ts
│   │   ├── card-template.ts
│   │   ├── generated-card.ts
│   │   └── ocr-session.ts
│   ├── features/
│   │   ├── ocr/
│   │   ├── recommendation/
│   │   ├── rendering/
│   │   └── library/
│   ├── lib/
│   │   ├── validation/
│   │   ├── errors/
│   │   └── telemetry/
│   └── test/
├── prisma/
│   └── schema.prisma
├── public/
│   └── templates/
├── codex/
│   ├── prompts/
│   └── tasks/
└── .github/
    ├── ISSUE_TEMPLATE/
    ├── PULL_REQUEST_TEMPLATE.md
    └── workflows/
```

## 패키지 경계

| 경로 | 책임 |
|---|---|
| `src/domain` | 순수 도메인 타입과 정책 |
| `src/features/ocr` | OCR provider interface와 mock/real adapter |
| `src/features/recommendation` | 템플릿 추천 점수 계산 |
| `src/features/rendering` | 카드 preview/render/download |
| `src/components/create-flow` | 카드 생성 플로우 UI |
| `src/app/api` | API route 또는 controller |
| `docs/design` | 설계 산출물 원본 |

## 금지

- API route 안에 추천 점수 계산 로직을 직접 작성하지 않는다.
- UI 컴포넌트 안에서 provider를 직접 호출하지 않는다.
- 도메인 정책을 하드코딩된 문자열로 여러 곳에 중복하지 않는다.
- private 데이터를 public route에서 조회하지 않는다.
