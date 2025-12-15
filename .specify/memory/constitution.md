# [PROJECT_NAME] Constitution

Minimal constitution with the baseline requirements for MarketView. This document records high-level principles and notes the permitted exceptions (for example, small client-side persistence used for the portfolio prototype).

## Core Principles

### I. Static-first (preferred)
The application must be deployable as static assets (HTML, CSS, JS, images) by default. Dynamic server components are allowed only as optional, documented extensions. Any required dynamic behaviour must be implemented client-side or pre-rendered at build time unless explicitly justified.

### II. Reproducible build
Provide a single documented build/preview command (for example `npm run build` or `npm start`) that produces deterministic output into a named directory (`dist/` or `build/`). Commit lockfiles and document required runtimes.

### III. Performance & accessibility baseline
Deliver lightweight pages and basic accessibility. At minimum: assets are cacheable, critical CSS/JS kept small, and automated a11y linting is run on critical pages in CI.

### IV. Security and secrets
No secrets or credentials in source. Any runtime secrets must be injected by the hosting environment and never committed. Follow basic security headers (CSP) where possible. Client-side persistence (e.g., localStorage) may be used only for prototype/demo purposes and must be clearly called out as not secure for production.

### V. CI/CD & gated deployments
All changes merged to the main branch must pass automated checks: install, lint, type-check (if applicable), build, and tests. Deployments to production must be gated on CI success.

### VI. Simplicity and maintainability
Prefer minimal dependencies and clear documentation. Major framework changes require justification and a migration plan in the PR.

### VII. Optional backend policy
If a backend is added (e.g., for authentication or persisted orders), it must:
- Be optional for the primary demo (the UI must still work client-only).
- Avoid embedding secrets in the repo (use environment variables).
- Document its API (endpoints, expected request/response shapes) in the repo `README.md`.

## Project structure (minimum)

- `src/` — source files (optional for very small projects)
- `public/` or `static/` — static assets (images, fonts)
- `pages/` or `index.html` — entry pages (Overview, Stocks, History, Portfolio, Account)
- `lib/` — small client-side helpers (e.g., `portfolio.ts`, `history.ts`)
- `backend/` — optional backend code (if present, must be clearly documented)
- `dist/` or `build/` — build output (generated)
- `package.json` and lockfile — scripts and pinned deps

## Development workflow & quality gates

- Pull requests must include a short description and a preview link when available.
- Required CI checks (minimal):
  - Install dependencies
  - Lint (HTML/CSS/JS/TS)
  - Type check (if TypeScript used)
  - Build (must succeed)
  - Unit tests covering critical logic (portfolio buy/sell, history generation)

## Prototype exceptions (explicit)
- Client-side portfolio persistence in `localStorage` is allowed as a demo-only feature and must be documented as non-production-safe.

**Version**: 1.1.0 | **Ratified**: 2025-12-15 | **Last Amended**: 2025-12-15
