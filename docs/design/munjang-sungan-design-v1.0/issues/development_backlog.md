# 문장순간 개발 백로그

## Epic 1. 카드 생성 플로우 UI

- [ ] HOME 화면 구현
- [ ] CREATE_UPLOAD 화면 구현
- [ ] OCR_PROCESSING 상태 화면 구현
- [ ] SELECT_QUOTE 화면 구현
- [ ] MOMENT_DETAILS 화면 구현
- [ ] TEMPLATE_SELECT 화면 구현
- [ ] PREVIEW 화면 구현
- [ ] SAVE_COMPLETE 화면 구현
- [ ] 단계별 상태 보존 구현
- [ ] 모바일 반응형 UI 구현

## Epic 2. OCR 파이프라인

- [ ] 이미지 업로드 API 구현
- [ ] 이미지 파일 검증 구현
- [ ] OCR provider 연동
- [ ] OCR 결과 문장 단위 분리
- [ ] OCR 세션 TTL 구현
- [ ] 원본 이미지 삭제 보장
- [ ] OCR 실패 fallback 구현

## Epic 3. 독서 순간 데이터

- [ ] Book 모델 구현
- [ ] ReadingMoment 모델 구현
- [ ] GeneratedCard 모델 구현
- [ ] CardTemplate 모델 구현
- [ ] OcrSession 임시 모델 구현
- [ ] private visibility 정책 구현
- [ ] 삭제 API 구현

## Epic 4. AI/추천

- [ ] AI theme classify API 구현
- [ ] JSON schema validation 구현
- [ ] fallback 결과 구현
- [ ] 템플릿 추천 점수식 구현
- [ ] 추천 사유 reason payload 구현
- [ ] AI 실패 시 기본 추천 연결

## Epic 5. 렌더링/다운로드

- [ ] HTML/CSS 또는 SVG 렌더러 구현
- [ ] 1:1 PNG 생성 구현
- [ ] 4:5 PNG 생성 구현
- [ ] 9:16 PNG 생성 구현
- [ ] 텍스트 overflow 처리 구현
- [ ] 다운로드 URL 발급 구현
- [ ] 다운로드 URL 만료 구현

## Epic 6. 보관함

- [ ] 보관함 목록 API 구현
- [ ] 보관함 목록 화면 구현
- [ ] 독서 순간 상세 화면 구현
- [ ] 카드 삭제 구현
- [ ] 책별 필터 구현
- [ ] 날짜별 필터 구현

## Epic 7. 안전장치

- [ ] 선택 문구 120자 제한 구현
- [ ] 감상 150자 제한 구현
- [ ] 공개 피드 미구현 보장
- [ ] SNS 자동 공유 미구현 보장
- [ ] 원본 이미지 미저장 테스트 작성
- [ ] 필수 고지 문구 표시

## Epic 8. QA/운영

- [ ] 이벤트 로깅 구현
- [ ] OCR 성공률 대시보드 쿼리 작성
- [ ] 렌더링 실패율 대시보드 쿼리 작성
- [ ] E2E 테스트 작성
- [ ] 모바일 브라우저 QA
- [ ] 베타 피드백 수집 폼 작성
