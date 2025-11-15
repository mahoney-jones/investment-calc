# Repository Guidelines

## Documentation
- **`CALCULATOR-FEATURES.md`** - Comprehensive feature documentation, changelog, and usage guide
- **`AGENTS.md`** (this file) - Development guidelines and conventions

## Project Structure & Module Organization
- `index.html` hosts the primary ROI calculator UI with monthly contributions and optional MER (in advanced options); loads `main.js` for all interactive behavior.
- `main.js` handles compound interest calculations for both lump sum and monthly contributions, with proper per-contribution compounding.
- `fee-impact.html` provides side-by-side fee comparison for up to 3 investment scenarios (includes MER, advisory fees, starter fees, and fixed costs); uses `fee-impact.js`.
- `fee-impact.js` calculates net returns after all fee types and displays comparison results with best-option highlighting.
- `schedule.html` renders the compound-interest amortization table using `schedule.js`; expects query parameters from main calculator.
- `schedule.js` generates period-by-period breakdown of investment growth.
- `styles.css` stores all shared styling rules—includes advanced options collapse styling, dynamic font sizing, and responsive layouts.
- `Product List.csv` contains Vanguard ETF data (38 funds) for real-world examples and testing.
- `BALANCED-PORTFOLIO-STRATEGY.md` comprehensive investment strategy guide following Bogle philosophy with VFV-centered portfolio.
- `CALCULATOR-FEATURES.md` detailed feature documentation, examples, and changelog.

## Build, Test, and Development Commands
- `python3 -m http.server 8000` (from the repo root) serves the static site locally; visit `http://localhost:8000/index.html`.
- `xdg-open index.html` (or the platform equivalent) opens the calculator directly without a server; use this for quick markup checks.
- No bundling step exists—commit artefacts must remain plain HTML, CSS, and vanilla JS.

## Coding Style & Naming Conventions
- JavaScript uses 2-space indentation, `const`/`let` declarations, arrow functions, and guard clauses; follow the existing camelCase naming for variables, IDs, and helpers (for example `safeNumber`, `futureValueDisplay`).
- Keep formatting logic centralized: prefer `Intl.NumberFormat` for currency and percentages, and sanitize inputs with small helpers instead of inline parsing.
- Keep HTML IDs descriptive and sync them with the JS query selectors; CSS classes should stay kebab-case.

## Testing Guidelines
- Run the local server, input a representative scenario:
  - Main calculator: principal `10000`, monthly contribution `500`, rate `7.8`, frequency `12`, years `30`
  - Verify: Total Contributed = $190,000, Future Balance ≈ $745,000, Interest Earned ≈ $555,000
- Test Advanced Options:
  - Expand advanced options, set MER to `0.24`
  - Verify calculations adjust for net return
- Test fee comparison page:
  - Modify scenario fees and click "Recalculate"
  - Verify all three scenarios update correctly
  - Check that "Best!" indicator appears on lowest-fee option
- Follow the schedule link and verify the totals progress monotonically and match the headline numbers.
- Re-test zero or empty inputs to ensure graceful handling; document any edge case gaps in the PR description.

## Commit & Pull Request Guidelines
- Write imperative, scoped commit messages (`Add manual rate validation`) and limit subjects to ~50 characters; elaborate rationale in the body when needed.
- Group related UI and logic changes together, and avoid committing generated artifacts.
- Pull requests should summarize intent, list manual test evidence, link any tracking issue, and include before/after screenshots when the UI changes.
