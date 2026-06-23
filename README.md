# reading-sensibility

문장순간은 종이책에서 발견한 짧은 문장을 OCR로 가져오고, 사용자의 감상과 책 정보를 더해 개인 소장용 이미지 카드로 저장하는 모바일 웹/PWA 프로젝트입니다.

## 현재 상태

- `munjang-sungan-codex-handoff-v0.1.zip` 기반 저장소 거버넌스 파일 반영
- `munjang-sungan-design-v1.0.zip` 기반 설계 산출물 반영
- TypeScript + React + Next.js App Router 스캐폴드 구성
- 기본 라우트: `/`, `/create`, `/library`
- 검증 스크립트: lint, typecheck, test

설계 원본 패키지는 `docs/design/munjang-sungan-design-v1.0/`에 있습니다. 이후 OpenAPI, DB schema, template catalog 연동 작업은 이 산출물을 기준으로 진행합니다.

## IntelliJ 실행

1. IntelliJ에서 이 폴더를 프로젝트로 엽니다.
2. Node interpreter는 `24.14.0`을 권장하며, 최소 `>=20.19.0`을 사용합니다.
3. 터미널에서 의존성을 설치합니다.

```bash
npm ci
```

4. 개발 서버를 실행합니다.

```bash
npm run dev
```

5. 브라우저에서 `http://localhost:3000`을 엽니다.

## 검증 명령

```bash
npm run lint
npm run typecheck
npm test
npm run verify
```

## 다음 작업

- 설계 산출물 `docs/design/munjang-sungan-design-v1.0/` 추가
- `codex/prompts/02_import_design_contracts.md` 기준 계약 파일 연동
- `codex/prompts/03_foundation_domain_types.md` 기준 도메인 타입과 validation 추가
