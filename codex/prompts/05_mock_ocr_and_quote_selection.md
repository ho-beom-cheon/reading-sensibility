# Codex Task 05: Mock OCR and quote selection

Goal: implement OCR provider interface and mock OCR flow.

Implement:

- `OcrProvider` interface.
- `MockOcrProvider` with Korean sample sentences.
- OCR result sentence list.
- Confidence and length metadata.
- Quote select/edit UI integration.
- OCR failure state and direct input fallback.

Security/privacy requirement:

- Do not persist uploaded image.
- Do not persist full OCR text.
- Only selected quote may enter the next state.

Acceptance criteria:

- Mock OCR returns sentence candidates.
- User can select and edit one quote.
- Overlong quote is blocked.
- Failure fallback works.
