import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import BackButton from '../components/BackButton'
import BuyModal from '../components/BuyModal'
import { getUserId, initBalance, getBalanceFor } from '../lib/portfolio'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function StocksPage(){
  const [stocks, setStocks] = useState<any[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [buySymbol, setBuySymbol] = useState<string | null>(null)
  const [buyPrice, setBuyPrice] = useState<number>(0)
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(()=>{
    const t = localStorage.getItem('mv_jwt')
    setToken(t)
    const uid = getUserId()
    if (uid) { initBalance(uid); setBalance(getBalanceFor(uid)) }
    fetchStocks()
    const id = setInterval(()=>fetchStocks(), 5000)
    return ()=>clearInterval(id)
  }, [])

  async function fetchStocks(){
    try{
      const r = await fetch(`${API}/api/stocks`)
      if (!r.ok) return
      const j = await r.json()
      // apply a small random jitter so prices feel alive in the UI
      const jittered = j.map((s:any)=>{
        const pct = (Math.random() - 0.5) * 0.01 // ±0.5%
        return { ...s, price: Number((s.price * (1 + pct)).toFixed(2)) }
      })
      setStocks(jittered)
    } catch(e) { console.error('fetchStocks error', e) }
  }

  async function buy(symbol:string){
  const tok = localStorage.getItem('mv_jwt')
  if (!tok) { alert('please log in'); return }
  
  // DEBUG: Decode token
  try {
    const parts = tok.split('.')
    const payload = JSON.parse(atob(parts[1]))
    console.log('=== TOKEN PAYLOAD ===')
    console.log(payload)
    console.log('sub:', payload.sub)
    console.log('email:', payload.email)
    console.log('exp:', new Date(payload.exp * 1000))
  } catch(e) {
    console.error('Failed to decode token:', e)
  }
  
  const quantity = Number(prompt('Quantity to buy') || '0')
  if (quantity <= 0) return
  
  console.log('=== MAKING REQUEST ===')
  console.log('Token:', tok.substring(0, 20) + '...')
  
  const headers: any = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${tok}`
  }
  
  const body = { symbol, quantity, price: 0 }
  console.log('Body:', body)
  
  const r = await fetch(`${API}/api/orders`, { 
    method: 'POST', 
    headers, 
    body: JSON.stringify(body)
  })
  
  console.log('Response status:', r.status)
  
  if (r.ok){
    alert('Order placed')
  } else {
    const text = await r.text()
    console.log('Error response:', text)
    alert('buy failed: ' + text)
  }
}

  function openBuy(symbol:string, price:number){
    setBuySymbol(symbol)
    setBuyPrice(price)
  }

  function onBought(){
    const uid = getUserId()
    if (uid) setBalance(getBalanceFor(uid))
  }


  return (
    <div className="max-w-6xl mx-auto p-6">
        <Header />
        
      <div className="flex items-center justify-between mb-4">
        <BackButton />
        <h1 className="text-2xl font-semibold">Stocks</h1>
        <div className="flex items-center space-x-4">
          <Link href="/portfolio" className="px-3 py-1 bg-slate-700 text-white rounded">Portfolio</Link>
          <div className="text-sm">Balance: ${balance ?? '—'}</div>
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
