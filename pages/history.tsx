import { useMemo, useState, useEffect } from 'react'
import Header from '../components/Header'
import Chart from '../components/Chart'
import { STOCKS } from '../data/stocks'
import { generateHistory } from '../lib/history'

export default function History(){
  const [symbol, setSymbol] = useState(STOCKS[0].symbol)

  const stock = useMemo(() => STOCKS.find(s => s.symbol === symbol) || STOCKS[0], [symbol])
  const [minutes, setMinutes] = useState<number>(10)
  const [points, setPoints] = useState(() => [] as { ts: number; price: number }[])

  // Generate history on the client only to avoid SSR/client hydration mismatch (random data)
  useEffect(() => {
    setPoints(generateHistory(stock, minutes))
  }, [stock, minutes])

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <h1 className="text-3xl font-bold">History — Last 10 minutes</h1>
          <p className="text-slate-400 mt-2">Select a symbol to view mock minute-by-minute price history for the last 10 minutes.</p>
        </section>

        <section className="bg-slate-800/50 rounded-lg p-6">
          <div className="flex gap-4 items-center mb-4">
            <label className="text-slate-300">Symbol</label>
            <select value={symbol} onChange={e => setSymbol(e.target.value)} className="bg-slate-700 text-white px-3 py-2 rounded">
              {STOCKS.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} — {s.company}</option>)}
            </select>

            <label className="text-slate-300">Range</label>
            <select value={minutes} onChange={e => setMinutes(Number(e.target.value))} className="bg-slate-700 text-white px-3 py-2 rounded">
              <option value={10}>10 min</option>
              <option value={30}>30 min</option>
              <option value={60}>60 min</option>
            </select>
          </div>

          <div className="mb-4">
            <Chart points={points} />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 text-slate-200 items-center">
            <div>
              <h3 className="font-semibold">Start (10m ago)</h3>
              <p className="text-lg">${points.length ? points[0].price.toFixed(2) : stock.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Current</h3>
              <p className="text-lg">${stock.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 className="font-semibold">Change (10m)</h3>
              {
                (() => {
                  const start = points.length ? points[0].price : stock.price
                  const last = points.length ? points[points.length - 1].price : stock.price
                  const delta = last - start
                  const pct = (delta / start) * 100
                  const up = delta >= 0
                  return (
                    <p className={`text-lg font-semibold ${up ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {up ? '+' : ''}{delta.toFixed(2)} ({up ? '+' : ''}{pct.toFixed(2)}%)
                    </p>
                  )
                })()
              }
            </div>
          </div>
        </section>

      </main>
    </div>
  )
}