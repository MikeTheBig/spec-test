import Header from '../components/Header'

export default function About(){
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-slate-800/50 rounded-lg p-6">
          <h1 className="text-2xl font-bold">About MarketView</h1>
          <p className="text-slate-400 mt-3">This demo is a modern static overview of mock stock market data. Built with Next.js (Pages Router), TypeScript and Tailwind CSS. Data is embedded at build time and there are no external feeds.</p>

          <h2 className="mt-6 font-semibold">Design choices</h2>
          <ul className="list-disc list-inside text-slate-300 mt-2">
            <li>Static export compatible (next export) — easy to host as static files.</li>
            <li>Accessible table markup and responsive layout.</li>
            <li>Minimal dependency footprint for fast load times.</li>
          </ul>

          <h2 className="mt-6 font-semibold">How to run</h2>
          <p className="text-slate-300">Install dependencies and run <code>npm run dev</code> for local development. Use <code>npm run build</code> and <code>npm run export</code> to produce static files.</p>
        </section>
      </main>
    </div>
  )
}
