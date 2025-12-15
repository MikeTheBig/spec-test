import { useEffect, useState } from 'react'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import Link from 'next/link'
import Deposit from 'components/Deposit'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function PortfolioPage(){
  const [token, setToken] = useState<string | null>(null)
  const [holdings, setHoldings] = useState<any[]>([])
  const [balance, setBalance] = useState<number | null>(null)
  const [sellQty, setSellQty] = useState<Record<string, number>>({})
  const [prices, setPrices] = useState<Record<string, number>>({})
  const [showDeposit, setShowDeposit] = useState(false)


  async function fetchBalance() {
    const token = localStorage.getItem('mv_jwt')
    if (!token) return

    try {
      const r = await fetch(`${API}/api/orders/balance`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (r.ok) {
        const data = await r.json()
        setBalance(data.balance)
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    }
  }

  async function fetchPortfolio() {
    const token = localStorage.getItem('mv_jwt')
    if (!token) return

    try {
      const r = await fetch(`${API}/api/orders/portfolio`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (r.ok) {
        const data = await r.json()
        setHoldings(data)
      } else {
        console.error('Failed to fetch portfolio:', r.status)
      }
    } catch (error) {
      console.error('Portfolio fetch error:', error)
    }
  }

  async function fetchPrices(){
    try{
      const r = await fetch(`${API}/api/stocks`)
      if (!r.ok) return
      const arr = await r.json()
      const map: Record<string, number> = {}
      for (const s of arr) map[s.symbol] = Number(s.price)
      setPrices(map)
    } catch(e){ console.error('fetchPrices error', e) }
  }

  useEffect(() => {
    const token = localStorage.getItem('mv_jwt')
    setToken(token)
    if (!token) return

    fetchPortfolio()
    fetchBalance()
    fetchPrices()

    const priceInterval = setInterval(() => fetchPrices(), 5000)
    return () => clearInterval(priceInterval)
  }, [])

  function refresh(){
    fetchPortfolio()
    fetchBalance()
  }

  async function onSell(symbol: string) {
    const token = localStorage.getItem('mv_jwt')
    if (!token) {
      alert('Please log in')
      return
    }

    const qty = Number(sellQty[symbol] ?? 0)
    if (!qty || qty <= 0) {
      alert('Enter quantity > 0')
      return
    }

    const holding = holdings.find(h => h.symbol === symbol)
    if (!holding) {
      alert('Holding not found')
      return
    }

    if (qty > holding.quantity) {
      alert(`You only have ${holding.quantity} shares`)
      return
    }

    const marketPrice = prices[symbol]
    const price = (typeof marketPrice === 'number' ? marketPrice : holding.avgPrice) || 0

    try {
      const r = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol,
          quantity: -qty,
          price: price
        })
      })

      if (r.ok) {
        alert('Sold successfully!')
        setSellQty(prev => ({ ...prev, [symbol]: 0 }))
        refresh()
      } else {
        const errorText = await r.text()
        console.error('Sell failed:', errorText)
        alert('Sell failed: ' + errorText)
      }
    } catch (error) {
      console.error('Sell error:', error)
      alert('Sell failed - network error')
    }
  }

  
  if (!token) return (
    <div className="max-w-4xl mx-auto p-6">
      <BackButton />
      <h1 className="text-2xl font-semibold mt-4">Din portefølje</h1>
      <p className="mt-4">Du er ikke logget ind. Venligst <Link href="/" className="underline">log ind</Link> eller <Link href="/stocks" className="text-emerald-600">gå til aktier</Link>.</p>
    </div>
  )

  // Calculate total holdings value using current market prices when available
// Calculate total holdings value using current market prices when available
const holdingsTotal = holdings.reduce((acc, h) => {
  const qty = Number(h.quantity || 0)
  const price = typeof prices[h.symbol] === 'number' ? prices[h.symbol] : Number(h.avgPrice || 0)
  return acc + qty * price
}, 0)

const formattedHoldingsTotal = new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD', 
  minimumFractionDigits: 2 
}).format(holdingsTotal)

const totalHoldings = holdingsTotal + (balance || 0) // Brug holdingsTotal, ikke formatted!
const formattedTotal = new Intl.NumberFormat('en-US', { 
  style: 'currency', 
  currency: 'USD', 
  minimumFractionDigits: 2 
}).format(totalHoldings)


  return (
  <div className="max-w-6xl mx-auto p-6">
    <Header />
    <div className="flex items-center justify-between mb-4">
      <BackButton />
      <h1 className="text-2xl font-semibold">Din portefølje</h1>
      <div className="flex gap-2">
        <Link href="/stocks" className="px-3 py-1 bg-slate-700 text-white rounded">Buy more</Link>
        <button
          onClick={() => setShowDeposit(true)}
          className="px-3 py-1 bg-emerald-600 text-white rounded"
        >
          Deposit
        </button>
      </div>
    </div>

    <div className="mt-6">
      <div className="mb-4">Balance: <span className="font-semibold">${balance !== null && balance !== undefined ? balance.toFixed(2) : '—'}</span></div>

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
                    <input 
                      type="number" 
                      min={1} 
                      max={owned} 
                      value={inputVal || ''} 
                      onChange={e=>{
                        let v = Number(e.target.value)
                        if (!Number.isFinite(v) || isNaN(v)) v = 0
                        if (v < 1) v = 1
                        if (v > owned) v = owned
                        setSellQty(s=>({ ...s, [h.symbol]: v }))
                      }} 
                      className="w-24 p-2 border bg-white text-slate-900" 
                      placeholder="qty" 
                    />
                    <button 
                      disabled={disabled} 
                      onClick={()=>onSell(h.symbol)} 
                      className="px-3 py-1 bg-red-600 text-white rounded disabled:opacity-50"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 border rounded bg-slate-50">
            <div className="font-semibold color text-black">Total holdings value: {formattedTotal}</div>
          </div>
        </div>
      )}
    </div>

    {/* Modal helt i bunden - UDEN for alt andet layout */}
    {showDeposit && (
      <Deposit 
        onClose={() => setShowDeposit(false)} 
        onDone={fetchBalance} 
      />
    )}
  </div>
)}