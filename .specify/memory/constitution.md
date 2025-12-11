# [PROJECT_NAME] Constitution

Minimal constitution with the bare minimum requirements for a static web application.

## Core Principles

### I. Static-first
The application must be deployable as static assets (HTML, CSS, JS, images). Any dynamic behavior must be implemented client-side or pre-rendered at build time.

### II. Reproducible build
Provide a single documented build/preview command (for example `npm run build` or `npm start`) that produces deterministic output into a named directory (`dist/` or `build/`). Commit lockfiles and document required runtimes.

### III. Performance & accessibility baseline
Deliver lightweight pages and basic accessibility. At minimum: assets are cacheable, critical CSS/JS kept small, and automated a11y linting is run on critical pages in CI.

### IV. Security and secrets
No secrets or credentials in source. Any runtime secrets must be injected by the hosting environment and never committed. Follow basic security headers (CSP) where possible.

### V. CI/CD & gated deployments
All changes merged to the main branch must pass automated checks: install, lint, type-check (if applicable), build, and tests. Deployments to production must be automated and gated on CI success.

### VI. Simplicity and maintainability
Prefer minimal dependencies and clear documentation. Major framework changes require justification and a migration plan in the PR.

## Project structure (minimum)

- `src/` — source files (optional for very small projects)
- `public/` or `static/` — static assets (images, fonts)
- `index.html`, `about.html`, `faq.html` — required pages for this project
- `css/`, `js/` — styles and client scripts
- `dist/` or `build/` — build output (generated)
- `package.json` and lockfile — scripts and pinned deps

Followable conventions: clear entry points and a documented start/build command in `package.json`.

## Development workflow & quality gates

- Pull requests must include a short description and link to preview when available.
- Required CI checks (minimal):
	- Install dependencies
	- Lint (HTML/CSS/JS)
	- Type check (if TypeScript used)
	- Build (must succeed)
	- Basic unit/component tests (where applicable)


**Version**: 1.0.0 | **Ratified**: 2025-12-10 | **Last Amended**: 2025-12-10
