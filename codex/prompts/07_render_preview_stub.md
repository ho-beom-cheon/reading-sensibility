# Codex Task 07: Render preview stub

Goal: implement client-side card preview and prepare server PNG rendering contract.

Implement:

- Card preview component for selected template.
- Support 1:1, 4:5, 9:16 visual ratios.
- Render quote, reflection, readAt, title, author, page.
- Add overflow handling.
- Add download button that uses a stubbed render endpoint or client-generated placeholder if no backend exists yet.

Do not introduce AI image generation.

Acceptance criteria:

- Preview updates when quote/details/template/ratio changes.
- Overflow is handled gracefully.
- Download action has a clear stub or working implementation.
