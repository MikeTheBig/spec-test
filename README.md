# MarketView — Next.js static demo (TypeScript + Tailwind)

This project is a static demo of a top-10 stock overview using Next.js (Pages Router), TypeScript, and Tailwind CSS. Data is mocked and embedded at build time.

## Run locally
```powershell with 2 terminal: Frontend and Backend
npm install
npm run dev

cd backend
dotnet run

# MarketView — Next.js demo (TypeScript + Tailwind)

MarketView is a small demo app that shows a live-like top-10 stock overview, a minute-by-minute history chart (mocked), and a client-side portfolio demo with buy/sell flows.

This repo contains a Next.js frontend (Pages Router, TypeScript, Tailwind) and an optional ASP.NET Core backend under `backend/` (used for JWT auth and a simple stocks/orders API). The app works fully client-side without the backend; the backend is optional for a more realistic demo.

## Quick start (frontend only)
Open a terminal for the frontend and run:

```powershell
npm install
npm run dev
```

Visit http://localhost:3000

## Optional backend (for auth/orders)
If you want the demo backend (C#/.NET) running too:

```powershell
cd backend
dotnet run
```

The backend listens on http://localhost:5000 by default. The frontend will use `NEXT_PUBLIC_API_URL` when present; otherwise it defaults to `http://localhost:5000` for API calls.

Note: if you change the backend's JWT signing key, existing tokens will be invalid. Also ensure you stop any previously-running `dotnet` process before rebuilding (Windows sometimes keeps the exe locked).

## Pages and features
- `/` — Overview (top-10 stocks): search, sort, buy modal.
- `/stocks` — dedicated stocks listing and buy flow.
- `/history` — minute-by-minute mock history; Current price matches the chart hover.
- `/portfolio` — your holdings, balance (starts at $1,000), unrealized P&L, sell controls.
- `/account` — login/register (modal-based). When using the backend, login returns a JWT stored in `localStorage` for the prototype.

## Portfolio behaviour (important)
- Starting balance: $1,000 (client-side) when a user first uses the portfolio.
- Buying:
	- The Buy modal shows `Total = quantity * current price` and the projected post-buy balance.
	- Purchases are blocked when Total > Balance.
- Selling:
	- The UI prevents selling more than you own (clamps input and disables Sell when invalid).
- Persistence: the portfolio is stored in `localStorage` (keyed by the user id when available). This is a demo convenience and not secure for production.

LocalStorage keys (prototype):
- `mv_jwt` — stored JWT token (if using backend auth)
- `mv_user` — stored user object (id/email)
- `mv_<userId>_balance` — numeric balance for a user
- `mv_<userId>_portfolio` — JSON array of holdings

## Development notes
- Prices in the UI are fetched from `/api/stocks` (mocked) and a small random jitter is applied periodically so the UI appears live.
- The History page generates minute-by-minute points client-side anchored to the current (fetched) price — this avoids SSR/client hydration mismatch while keeping Current and chart hover consistent.

## Git / housekeeping
- A comprehensive `.gitignore` is included to avoid committing `node_modules`, `.next`, `backend/bin`, `backend/obj`, editor/OS temp files, and local DB files.
- If you already committed build artifacts (for example `.next/` or `backend/bin/`), remove them from Git tracking:

```powershell
git rm -r --cached .next backend/bin backend/obj
git commit -m "Remove tracked build artifacts"
```

## Troubleshooting
- 401 on POST `/api/orders`: ensure the backend is running, the frontend has the current token (`mv_jwt`), and Authorization header is `Bearer <token>`. If tokens were issued with a different signing key, re-register/login.
- dotnet exe locked: on Windows a previously-run `dotnet run` can lock the built exe; stop the running process (Task Manager or `Stop-Process -Id <pid>`) before rebuilding.

## Tests & CI
- Unit tests are recommended for `lib/portfolio.ts` (buy/sell logic) and `lib/history.ts` (history generation). CI should run install, lint, type-check, build and tests.

## Contributing
PRs should include a short description, link to a preview if available, and necessary steps to test the change locally.

---

If you want I can add a short `CHANGELOG.md` capturing the recent 1.1.0 updates (portfolio, buy/sell limits, history anchoring). Want that? If so, I will add it.
