# Codex Task 06: Template catalog and recommendation engine

Goal: implement template recommendation using the design score formula.

Implement:

- Load 5 MVP templates.
- Implement text length classification.
- Implement score calculation:
  - moodMatch
  - genreMatch
  - textLengthFit
  - ratioSupport
  - emphasisMatch
- Return top 3 templates.
- Return reason payload.

Tests:

- short/medium/long/blocked text classification.
- unsupported ratio excluded.
- blocked quote excluded.
- best matching mood ranks higher.

Acceptance criteria:

- Template selection screen shows top 3 recommendations.
- Recommendation logic is covered by tests.
