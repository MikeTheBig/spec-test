import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import BuyModal from '../components/BuyModal'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function StocksPage(){
  const [stocks, setStocks] = useState<any[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [buySymbol, setBuySymbol] = useState<string | null>(null)
  const [buyPrice, setBuyPrice] = useState<number>(0)
  const [balance, setBalance] = useState<number | null>(null)

  async function fetchBalance() {
    const tok = localStorage.getItem('mv_jwt')
    if (!tok) return

    try {
      const r = await fetch(`${API}/api/orders/balance`, {
        headers: { 'Authorization': `Bearer ${tok}` }
      })
      if (r.ok) {
        const data = await r.json()
        setBalance(data.balance)
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    }
  }

  useEffect(()=>{
    const t = localStorage.getItem('mv_jwt')
    setToken(t)
    fetchBalance()
    fetchStocks()
    const id = setInterval(()=>fetchStocks(), 30000)
    return ()=>clearInterval(id)
  }, [])

  async function fetchStocks(){
  try{
    const r = await fetch(`${API}/api/stocks`)
    if (!r.ok) return
    const j = await r.json()
    setStocks(j)
  } catch(e) { console.error('fetchStocks error', e) }
}

  function openBuy(symbol:string, price:number){
    setBuySymbol(symbol)
    setBuyPrice(price)
  }

  function onBought(){
    fetchBalance() // Refresh balance after buy
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Header />
      
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">Stocks</h1>
        <div className="flex items-center space-x-4">
          <Link href="/portfolio" className="px-3 py-1 bg-slate-700 text-white rounded">Portfolio</Link>
          <div className="text-sm">Balance: ${balance !== null ? balance.toFixed(2) : '—'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stocks.map(s=> (
          <div key={s.symbol} className="p-4 border rounded">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{s.symbol} — {s.company}</div>
                <div className="text-sm text-slate-600">${s.price}</div>
              </div>
              <div>
                <button onClick={()=>openBuy(s.symbol, s.price)} className="px-3 py-1 bg-emerald-600 text-white rounded">Buy</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {buySymbol && <BuyModal symbol={buySymbol} price={buyPrice} onClose={()=>setBuySymbol(null)} onDone={onBought} />}
    </div>
  )
}