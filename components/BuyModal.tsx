import Modal from './Modal'
import { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function BuyModal({ symbol, price, onClose, onDone } : { symbol:string; price:number; onClose: ()=>void; onDone: ()=>void }){
  const [qty, setQty] = useState(1)
  const [balance, setBalance] = useState<number | null>(null)

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

  useEffect(() => {
    fetchBalance()
  }, [])

  async function buy(e:any){
    e.preventDefault()
    
    const token = localStorage.getItem('mv_jwt')
    if (!token) {
      alert('Please log in')
      return
    }
    
    const cost = Number(qty) * price
    const bal = balance ?? 0
    if (cost > bal) {
      alert('Insufficient balance')
      return
    }

    try {
      const r = await fetch(`${API}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          symbol,
          quantity: Number(qty),
          price: price
        })
      })

      if (r.ok) {
        alert('Order placed successfully!')
        onDone()
        onClose()
      } else {
        const errorText = await r.text()
        console.error('Buy failed:', errorText)
        alert('Buy failed: ' + errorText)
      }
    } catch (error) {
      console.error('Buy error:', error)
      alert('Buy failed - network error')
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Buy {symbol}</h2>
      <form onSubmit={buy} className="space-y-3">
        <div>Price: ${price}</div>
        <div className="text-sm">Total: <span className="font-semibold">${(Number(qty) * price).toFixed(2)}</span></div>
        {balance !== null && (
          <div className="text-sm text-slate-600">Balance: ${balance.toFixed(2)} • After: ${(Math.max(0, (balance - (Number(qty) * price)))).toFixed(2)}</div>
        )}
        {balance !== null && balance >= 0 && (
          <div className="text-xs text-slate-500">Max purchasable: {Math.max(0, Math.floor(balance / price))} shares</div>
        )}
        <input type="number" min={1} value={qty} onChange={e=>{
          let v = Number(e.target.value)
          if (!Number.isFinite(v) || isNaN(v)) v = 1
          if (v < 1) v = 1
          if (balance !== null){
            const max = Math.max(0, Math.floor(balance / price))
            if (v > max) v = max
          }
          setQty(v)
        }} className="w-full p-2 border bg-white text-slate-900" />
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 px-3 py-1">Cancel</button>
          <button type="submit" disabled={(balance !== null && (Number(qty) * price) > balance) || Number(qty) <= 0} className="px-3 py-1 bg-emerald-600 text-white disabled:opacity-50">Buy</button>
        </div>
      </form>
    </Modal>
  )
}