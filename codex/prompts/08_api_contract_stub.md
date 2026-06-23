# Codex Task 08: API contract skeleton

Goal: implement API route skeletons matching OpenAPI contract.

Routes:

- `POST /api/ocr`
- `POST /api/theme/classify`
- `GET /api/card-templates`
- `POST /api/card-templates/recommend`
- `POST /api/cards/render`
- `POST /api/reading-moments`

Requirements:

- Use typed request/response models.
- Use shared error response format.
- Return mock/stub data where provider is not implemented.
- Validate quote length and required fields.

Acceptance criteria:

- API routes compile.
- Contract tests pass.
- Error response format is consistent.
