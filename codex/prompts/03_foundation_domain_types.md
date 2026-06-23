# Codex Task 03: Foundation domain types

Goal: implement domain models and validation policies.

Implement:

- Book
- ReadingMoment
- CardTemplate
- GeneratedCard
- OcrSession
- Ratio
- TextLength
- Visibility

Validation requirements:

- selectedQuote max length must be enforced.
- visibility defaults to private.
- OCR session is temporary and must not represent permanent storage.
- GeneratedCard stores render options separately from image file path.

Add unit tests.

Acceptance criteria:

- Domain types compile under strict TypeScript.
- Validation rejects overlong quote.
- Validation defaults visibility to private.
- Tests pass.
