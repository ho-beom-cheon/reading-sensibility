# Codex Task 02: Import design contracts

Goal: make design contracts available to code and tests.

Read:

- `docs/design/munjang-sungan-design-v1.0/specs/openapi.yaml`
- `docs/design/munjang-sungan-design-v1.0/specs/template_catalog.json`
- `docs/design/munjang-sungan-design-v1.0/specs/error_codes.md`
- `docs/design/munjang-sungan-design-v1.0/specs/state_machine.md`

Implement:

- Copy or reference template catalog in application source.
- Add error code enum/constants.
- Add policy constants: quote max length, reflection max length, supported ratios.
- Add tests proving contracts can be loaded.

Acceptance criteria:

- Template catalog is importable.
- Error codes are typed.
- Policy constants are centralized.
- Tests pass.
