# MarketView — Next.js static demo (TypeScript + Tailwind)

This project is a static demo of a top-10 stock overview using Next.js (Pages Router), TypeScript, and Tailwind CSS. Data is mocked and embedded at build time.

## Run locally
```powershell
npm install
npm run dev
```

Preview static export:

```powershell
npm run build
npm run export
# exported files will be in the out/ directory
```

## Notes
- The `data/stocks.ts` file contains the mocked dataset.
- Site is responsive and accessible with semantic table markup.
