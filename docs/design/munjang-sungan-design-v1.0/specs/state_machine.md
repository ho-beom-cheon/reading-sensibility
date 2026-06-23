# 생성 플로우 상태 머신

## 상태

```text
idle
uploading
ocr_processing
ocr_failed
quote_selecting
details_editing
template_recommending
template_selecting
preview_rendering
preview_ready
render_failed
complete
```

## 정상 전이

```text
idle -> uploading -> ocr_processing -> quote_selecting -> details_editing -> template_recommending -> template_selecting -> preview_rendering -> preview_ready -> complete
```

## 예외 전이

| From | Event | To | 처리 |
|---|---|---|---|
| uploading | UPLOAD_FAILED | idle | 재업로드 |
| ocr_processing | OCR_FAILED | ocr_failed | 재촬영/직접 입력 |
| ocr_failed | MANUAL_INPUT | quote_selecting | 직접 입력 모드 |
| template_recommending | AI_FAILED | template_selecting | fallback 추천 |
| preview_rendering | RENDER_FAILED | render_failed | 재시도 |
| preview_ready | SAVE_LIBRARY_REQUIRED_AUTH | preview_ready | 로그인 안내 |
