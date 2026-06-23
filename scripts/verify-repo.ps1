$ErrorActionPreference = "Stop"

Write-Host "Checking repository handoff files..."

$requiredFiles = @(
  "AGENTS.md",
  ".github/PULL_REQUEST_TEMPLATE.md",
  "docs/DEV_EXECUTION_PLAN.md"
)

foreach ($file in $requiredFiles) {
  if (-not (Test-Path -LiteralPath $file -PathType Leaf)) {
    throw "Missing $file"
  }
}

if (-not (Test-Path -LiteralPath ".github/ISSUE_TEMPLATE" -PathType Container)) {
  throw "Missing issue templates"
}

if (Test-Path -LiteralPath "package.json" -PathType Leaf) {
  $npmCommand = Get-Command npm -ErrorAction Stop
  $npmDirectory = Split-Path -Parent $npmCommand.Source
  $npmCli = Join-Path $npmDirectory "node_modules/npm/bin/npm-cli.js"

  if (Test-Path -LiteralPath $npmCli -PathType Leaf) {
    node $npmCli run verify
  } else {
    npm run verify
  }
} else {
  Write-Host "No package.json yet. Skipping npm checks."
}

Write-Host "Repository handoff check completed."
