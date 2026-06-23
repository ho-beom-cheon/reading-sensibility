#!/usr/bin/env bash
set -euo pipefail

echo "Checking repository handoff files..."

test -f AGENTS.md || { echo "Missing AGENTS.md"; exit 1; }
test -f .github/PULL_REQUEST_TEMPLATE.md || { echo "Missing PR template"; exit 1; }
test -d .github/ISSUE_TEMPLATE || { echo "Missing issue templates"; exit 1; }
test -f docs/DEV_EXECUTION_PLAN.md || { echo "Missing DEV_EXECUTION_PLAN.md"; exit 1; }

if [ -f package.json ]; then
  npm run lint --if-present
  npm run typecheck --if-present
  npm test --if-present
else
  echo "No package.json yet. Skipping npm checks."
fi

echo "Repository handoff check completed."
