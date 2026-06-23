# 이벤트 Taxonomy

| 이벤트 | 설명 | 주요 속성 |
|---|---|---|
| home_viewed | 홈 화면 진입 | referrer |
| create_started | 카드 생성 시작 | entryPoint |
| upload_started | 업로드 시작 | sourceType |
| upload_completed | 업로드 완료 | fileSize, mimeType |
| ocr_started | OCR 시작 | language |
| ocr_completed | OCR 완료 | sentenceCount, avgConfidence, durationMs |
| ocr_failed | OCR 실패 | reason, durationMs |
| quote_selected | 문장 선택 | quoteLength, confidence |
| quote_edited | 문장 수정 | beforeLength, afterLength |
| details_completed | 기록 입력 완료 | hasPageNumber, hasMood, genre |
| theme_classified | AI 분류 완료 | moods, confidence, durationMs |
| template_recommended | 템플릿 추천 완료 | templateIds, scoreMax |
| template_selected | 템플릿 선택 | templateId, ratio, emphasis |
| card_render_started | 렌더링 시작 | templateId, ratio |
| card_rendered | 렌더링 완료 | cardId, width, height, durationMs |
| card_render_failed | 렌더링 실패 | templateId, ratio, errorCode |
| card_downloaded | PNG 다운로드 | cardId |
| moment_saved | 보관함 저장 | momentId, templateId |
| moment_deleted | 독서 순간 삭제 | momentId |
| flow_abandoned | 플로우 이탈 | step, elapsedSec |
