import { useEffect, useMemo, useState } from 'react'
import type { Stock } from '../data/stocks'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

type Props = { initial: Stock[] }

function formatNumber(n: number){
  if (n >= 1e12) return (n/1e12).toFixed(2) + 'T'
  if (n >= 1e9) return (n/1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n/1e6).toFixed(2) + 'M'
  return n.toLocaleString()
}

export default function StockTable({ initial }: Props){
  const [stocks, setStocks] = useState<Stock[]>([])
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<keyof Stock | null>(null)
  const [dir, setDir] = useState<1 | -1>(1)

  async function fetchStocks(){
  try{
    const r = await fetch(`${API}/api/stocks`)
    if (!r.ok) return
    const data = await r.json()
    setStocks(data.map((s: any) => ({
      ...s,
      marketCap: s.marketCap || 1000000000,
      volume: s.volume || 10000000
    })))
  } catch(e){ console.error('fetchStocks error', e) }
}

useEffect(() => {
  fetchStocks()
  const id = setInterval(() => fetchStocks(), 60000) // Opdater hvert minut
  return () => clearInterval(id)
}, [])

  // Improved sorting: compute new direction locally to avoid relying on async state
  function onSort(key: keyof Stock){
    const newDir: 1 | -1 = sortKey === key ? (dir === 1 ? -1 : 1) : 1
    setSortKey(key)
    setDir(newDir)

    setStocks(prev => [...prev].sort((a,b) => {
      const A = a[key] as any
      const B = b[key] as any
      if (typeof A === 'string') return A.localeCompare(B) * newDir
      return (A - B) * newDir
    }))
  }

  function onRefresh(){
    fetchStocks()
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return stocks
    return stocks.filter(s => s.symbol.toLowerCase().includes(q) || s.company.toLowerCase().includes(q))
  }, [stocks, query])

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white text-xl font-semibold">Top 10 Stocks</h2>
        <div className="flex gap-2">
          <input aria-label="Search stocks" placeholder="Search symbol or company" value={query} onChange={e => setQuery(e.target.value)} className="px-3 py-2 rounded bg-slate-700 text-white" />
          <button onClick={onRefresh} className="px-3 py-2 rounded border border-slate-600 text-slate-200">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Top 10 stocks">
          <thead className="text-slate-300">
            <tr>
              <th className="text-left pr-6">
                <button onClick={() => onSort('symbol')} aria-sort={sortKey === 'symbol' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  Symbol {sortKey === 'symbol' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="text-left pr-6">
                <button onClick={() => onSort('company')} aria-sort={sortKey === 'company' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  Company {sortKey === 'company' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="text-left pr-6">
                <button onClick={() => onSort('price')} aria-sort={sortKey === 'price' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  Price {sortKey === 'price' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="text-left pr-6">
                <button onClick={() => onSort('change')} aria-sort={sortKey === 'change' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  Change {sortKey === 'change' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="text-left pr-6">
                <button onClick={() => onSort('changePercent')} aria-sort={sortKey === 'changePercent' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  %
                  {sortKey === 'changePercent' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="text-left pr-6 hidden md:table-cell">
                <button onClick={() => onSort('marketCap')} aria-sort={sortKey === 'marketCap' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  Market Cap {sortKey === 'marketCap' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
              <th className="text-left pr-6 hidden md:table-cell">
                <button onClick={() => onSort('volume')} aria-sort={sortKey === 'volume' ? (dir === 1 ? 'ascending' : 'descending') : 'none'} className="cursor-pointer">
                  Volume {sortKey === 'volume' ? (dir === 1 ? '▲' : '▼') : ''}
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="text-white">
            {filtered.map((s) => (
              <tr key={s.symbol} className="border-t border-slate-700 hover:bg-slate-700/10">
                <td className="py-3 font-semibold">{s.symbol}</td>
                <td className="py-3">{s.company}</td>
                <td className="py-3">${s.price.toFixed(2)}</td>
                <td className={`py-3 ${(s.change ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
  {(s.change ?? 0) >= 0 ? '+' : ''}{(s.change ?? 0).toFixed(2)}
</td>
  <td className={`py-3 ${(s.changePercent ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
  {(s.changePercent ?? 0) >= 0 ? '+' : ''}{(s.changePercent ?? 0).toFixed(2)}%
</td>
                <td className="py-3 hidden md:table-cell">{formatNumber(s.marketCap)}</td>
                <td className="py-3 hidden md:table-cell">{formatNumber(s.volume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-slate-400 text-sm mt-3">Data is comming from Yahoo Finanse.</p>
    </div>
  )
}
