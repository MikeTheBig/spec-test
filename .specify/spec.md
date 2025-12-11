# MarketView — Specification

Concise specification for the MarketView static demo. This file is intentionally minimal and focused on acceptance criteria so implementation aligns with the product intent.

## Goal
A sleek, modern static site that presents a live-like overview of the stock market using mocked data. Deployable as static assets without server-side dependencies.

## Pages
- `index.html` — Landing page: table of 10 stocks, search, sort, refresh; primary UX.
- `about.html` — Short page describing the demo and design rationale.
- `faq.html` — Simple FAQ covering data origins and running locally.

## Data shape (mock)
Each stock object must include:
- `symbol` (string)
- `company` (string)
- `price` (number)
- `change` (number)
- `changePercent` (number)
- `marketCap` (number)
- `volume` (number)

## Functional requirements
1. The landing table shows exactly 10 stocks by default.
2. Columns: Symbol, Company, Price, Change, Change%, Market Cap, Volume.
3. Sorting: clicking a column header sorts ascending; clicking again toggles descending.
4. Search: input filters rows by symbol or company (case-insensitive, partial matches allowed).
5. Refresh: clicking refresh randomizes prices to simulate live updates.
6. Auto-update (optional): small, periodic fluctuations to mimic live movement.
7. Semantic, accessible markup: use `<table>`, `<thead>`, `<tbody>`, include `aria-label` on the table and accessible form labels.

## Non-functional requirements
- Static-first: deployable to any static host (Netlify, Vercel, GitHub Pages).
- Reproducible preview: a documented `start` command in `package.json` or README.
- Performance: small bundle size; no large client dependencies.
- Accessibility: basic a11y considerations met (labels, table semantics, readable contrast).
- Security: no secrets in the repository.

## Acceptance criteria (manual)
- Open `index.html` → page loads and displays 10 rows.
- Click header → rows sort; click again → toggles order.
- Enter search → rows filter accordingly.
- Click refresh → prices change.
- `about.html` and `faq.html` accessible from site header.

## Minimal CI (recommended)
- On PR: install deps, lint (JS/CSS), run build (if any), and run tests (if present).
- Merge to main triggers deploy (optional, not required for the demo).

## Tests (recommended)
- Unit: tests for `sortBy()` numeric vs string behavior; tests for search filtering.
- Smoke: headless check that `index.html` contains a table with 10 rows.
- A11y: run axe-core on `index.html` in CI (optional).

## Files expected
- `index.html`, `about.html`, `faq.html`
- `css/styles.css`, `js/app.js`
- `README.md`, `package.json`
- `.specify/spec.md` (this file)

## Notes
- This spec is deliberately minimal to allow a fast, polished prototype. If you want a richer feature set (real feeds, historical charts, user settings), propose them and I'll add to the spec.

**Version**: 1.0.0 | **Created**: 2025-12-10
