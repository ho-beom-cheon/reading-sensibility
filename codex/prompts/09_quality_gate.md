# Codex Task 09: Quality gate

Goal: add initial QA coverage for the MVP happy path and high-risk edge cases.

Test cases:

- Happy path: upload mock image → OCR → select quote → enter details → recommend template → preview.
- OCR failure → direct input fallback.
- Overlong quote blocked.
- Missing reflection blocked.
- Unsupported template ratio excluded.
- Privacy/copyright notices present.

Also:

- Ensure lint/typecheck/test commands run in CI.
- Add README instructions for local development.

Acceptance criteria:

- CI green.
- Tests cover high-risk policies.
- README explains how to run the app.
