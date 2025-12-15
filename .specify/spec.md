# MarketView — Specification

Concise specification for the MarketView demo. The project started as a static, mock-driven prototype and has been extended with a small client-side portfolio and optional backend support. This spec records both the user-facing features and the expected behaviour for the portfolio and history tooling added during development.

## Goal
A modern, approachable demo that presents a live-like overview of selected stocks, allows a signed-in user to buy and sell mock positions, and visualises short-range minute-by-minute history for a selected symbol. The app should run locally for development and be deployable as a static site (with optional API/back-end if the developer chooses to enable it).

## Pages & routes
- `/` (Overview / Landing) — table of 10 stocks, search, sort, periodic small updates to prices, buy actions that open a modal.
- `/stocks` — dedicated stocks list and buy flow.
- `/history` — minute-by-minute mock history chart for a selected symbol with range controls (10/30/60 minutes) and consistent 'Current' price displayed alongside the chart.
- `/portfolio` — user portfolio, balance, holdings, per-holding market value, unrealized P&L, sell controls.
- `/account` — account details, login / register UX (modal-based) and sign-out.
- API (optional): `/api/stocks` (mock or proxied feed), `/api/orders`, `/api/auth` — when a backend is present these endpoints follow the documented behaviour; the app also works with client-only storage.

## Data shape (mock)
Each stock object includes:
- `symbol` (string)
- `company` (string)
- `price` (number)
- `change` (number)
- `changePercent` (number)
- `marketCap` (number)
- `volume` (number)

Portfolio (client-side) holdings shape:
- `symbol` (string)
- `quantity` (number)
- `avgPrice` (number)

## Functional requirements (updated)
1. Overview shows exactly 10 stocks by default with columns: Symbol, Company, Price, Change, Change%, Market Cap, Volume.
2. Sorting: clicking a column header sorts ascending; clicking again toggles descending.
3. Search: input filters rows by symbol or company (case-insensitive, partial matches allowed).
4. Price updates:
	- UI periodically fetches stock data from `/api/stocks` (or uses local mock) and applies small, periodic fluctuations (a small jitter) so prices appear live.
	- Manual Refresh remains available to force an immediate update.
5. Authentication:
	- Login/Register are implemented as modal flows. When a backend is enabled, authentication uses JWT; the client stores the token in localStorage for demo purposes.
6. Buy/Sell & portfolio:
	- Users can buy stocks from the Overview or Stocks pages via a Buy modal.
	- The user starts with a default balance of $1,000 (client-side) when first creating a portfolio.
	- Buying enforces a hard limit: the total cost (quantity * price) cannot exceed the available balance. The Buy modal displays total cost and the resulting post-buy balance.
	- Selling enforces a hard limit: users cannot sell more shares than they own (UI clamps input and disables the Sell button when invalid).
	- Portfolio data is persisted client-side (localStorage) keyed by user id for the prototype. The portfolio page shows per-holding market value (using current market price), unrealized P&L, and total holdings value.
	- When a backend with authenticated orders is used, orders may be POSTed to `/api/orders` (requires Authorization header: `Bearer <token>`). If backend auth is enabled, ensure the server's JWT secret matches the signing key used at login.
7. History:
	- The History page generates minute-by-minute mock data client-side to avoid SSR hydration mismatches.
	- The chart's generated series is anchored to the current (fetched/jittered) price so the 'Current' display and hovered chart points match.

## Non-functional requirements (updated)
- Static-first: the app must still be able to run without a backend. Optional server components must be documented and not required for local UI features like portfolio persisted to localStorage.
- Reproducible preview: `npm run dev` (development) and `npm run build`/`npm run start` documented in `package.json`.
- Security: no production secrets in repo. Demo uses localStorage for JWT only for the prototype — note this is not secure for production.

## Acceptance criteria (manual)
- Overview loads and shows 10 rows; periodic small price updates are visible.
- Buy modal shows total cost computed as quantity * current price and prevents purchases exceeding balance.
- After buying, the portfolio page contains the purchased holding and the cash balance is reduced accordingly.
- The portfolio page shows per-holding market value and an aggregated total holdings value; Sell enforces not selling more than owned.
- History's Current value matches the chart hover and updates when prices refresh.

## API / Backend (optional)
- `/api/stocks` — returns current stock fixtures; used by the UI. Can be mocked or backed by an API.
- `/api/auth` — register/login (returns JWT) when backend enabled.
- `/api/orders` — POST to create an order (requires Authorization). The client also supports a file/DB-backed server implementation but the prototype works client-only.

## Tests & CI (recommended)
- Unit tests: buy/sell logic (client `lib/portfolio.ts`), history generation, and sort/search utilities.
- Integration/smoke: portfolio flow — login (or guest), buy, verify balance and holdings, sell and verify balance update.
- CI: install, lint, type-check, build, run unit tests. Optionally run basic end-to-end smoke tests in CI.

## Files expected (updated)
- `pages/` or `index.html`, `about.html`, `faq.html`, `stocks`, `history`, `portfolio`, `account`.
- `lib/portfolio.ts` (client buy/sell logic), `components/BuyModal.tsx`, `components/Modal.tsx`.
- `pages/api/stocks.ts` (mock feed) and optional backend under `backend/` with documented JWT secret in `appsettings.json` (do not commit secrets).

## Notes
- The app intentionally keeps portfolio persistence client-side for the demo. If server-backed persistence is desired, the API and auth endpoints are designed to be enabled and consumed by the same UI.
- This spec records the current, implemented behaviour (balance $1,000 starting point, buy/sell limits, price jitter, history anchoring). Future changes to persistence model (server vs client) should be added to this spec.

**Version**: 1.1.0 | **Updated**: 2025-12-15
