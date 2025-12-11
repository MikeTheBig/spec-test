import { useEffect, useState } from 'react'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import Link from 'next/link'
import { getUserId, getPortfolio, getBalanceFor, sellHolding } from '../lib/portfolio'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function PortfolioPage(){
  const [userId, setUserId] = useState<string | null>(null)
  const [holdings, setHoldings] = useState<any[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [sellQty, setSellQty] = useState<Record<string, number>>({})

  useEffect(()=>{
    const uid = getUserId()
    setUserId(uid)
    if (!uid) return
    setHoldings(getPortfolio(uid))
    setBalance(getBalanceFor(uid))
  }, [])

  function refresh(){
    if (!userId) return
    setHoldings(getPortfolio(userId))
    setBalance(getBalanceFor(userId))
  }

  const [prices, setPrices] = useState<Record<string, number>>({})

  async function fetchPrices(){
    try{
      const r = await fetch(`${API}/api/stocks`)
      if (!r.ok) return
      const arr = await r.json()
      const map: Record<string, number> = {}
      for (const s of arr) map[s.symbol] = Number(s.price)
      // small jitter so the UI updates and doesn't always show seed values
      for (const k of Object.keys(map)){
        const pct = (Math.random() - 0.5) * 0.01
        map[k] = Number((map[k] * (1 + pct)).toFixed(2))
      }
      setPrices(map)
    } catch(e){ console.error('fetchPrices error', e) }
  }

  useEffect(()=>{
    fetchPrices()
    const id = setInterval(()=>fetchPrices(), 5000)
    return ()=>clearInterval(id)
  }, [])

  function onSell(symbol:string){
    if (!userId) return alert('Please log in')
    const qty = Number(sellQty[symbol] ?? 0)
    if (!qty || qty <= 0) return alert('Enter quantity > 0')
    // For now use avgPrice as sell price; could be replaced with market price
    const holding = holdings.find(h=>h.symbol === symbol)
    if (!holding) return alert('Holding not found')
    const marketPrice = prices[holding.symbol]
    const price = (typeof marketPrice === 'number' ? marketPrice : holding.avgPrice) || 0
    const res: any = sellHolding(userId, symbol, qty, price)
    if (!res.ok) return alert(res.error || 'Sell failed')
    setSellQty(prev=>({ ...prev, [symbol]: 0 }))
    refresh()
  }

  if (!userId) return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-semibold mt-4">Din portefølje</h1>
      <p className="mt-4">Du er ikke logget ind. Venligst <button onClick={()=>{window.scrollTo(0,0)}} className="underline">log ind</button> eller <Link href="/stocks" className="text-emerald-600">gå til aktier</Link>.</p>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6">
            <Header />
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">Din portefølje</h1>
        <Link href="/stocks" className="px-3 py-1 bg-slate-700 text-white rounded">Buy more</Link>
      </div>

      <div className="mt-6">
        <div className="mb-4">Balance: <span className="font-semibold">${balance ?? '—'}</span></div>

        {holdings.length === 0 ? (
          <div className="text-slate-600">Ingen beholdninger endnu — prøv at købe nogle aktier på <Link href="/stocks" className="text-emerald-600">Stocks</Link>.</div>
        ) : (
          <div>
            <div className="mb-4 font-semibold">Holdings value breakdown</div>
            <div className="mb-3">
              <button onClick={() => fetchPrices()} className="px-3 py-1 bg-slate-700 text-white rounded">Refresh prices</button>
            </div>
            <div className="space-y-4">
              {holdings.map(h=> {
                const qty = Number(h.quantity || 0)
                const avg = Number(h.avgPrice || 0)
                const market = prices[h.symbol] ?? avg
                const total = qty * market
                const unreal = (market - avg) * qty
                const owned = Number(h.quantity || 0)
                const inputVal = sellQty[h.symbol] ?? 0
                const parsed = Number(inputVal) || 0
                const disabled = parsed <= 0 || parsed > owned
                return (
                  <div key={h.symbol} className="p-4 border rounded flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{h.symbol}</div>
                      <div className="text-sm text-slate-600">Qty: {h.quantity} • Avg: ${avg.toFixed(2)} • Current: ${market.toFixed(2)} • Total: ${total.toFixed(2)}</div>
                      <div className={`text-sm ${unreal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>Unrealized: ${unreal.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="number" min={1} max={owned} value={inputVal} onChange={e=>{
                        let v = Number(e.target.value)
                        if (!Number.isFinite(v) || isNaN(v)) v = 0
                        if (v < 1) v = 1
                        if (v > owned) v = owned
                        setSellQty(s=>({ ...s, [h.symbol]: v }))
                      }} className="w-24 p-2 border bg-white text-slate-900" placeholder="qty" />
                      <button disabled={disabled} onClick={()=>onSell(h.symbol)} className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50">Sell</button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 border rounded bg-slate-50">
              <div className="font-semibold color text-black">Total holdings value: ${holdings.reduce((acc, h)=> acc + ((h.quantity||0) * (h.avgPrice||0)), 0).toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
