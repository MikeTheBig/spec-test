import Modal from './Modal'
import { useState, useEffect } from 'react'
import { getUserId, buyHolding, getBalanceFor } from '../lib/portfolio'

export default function BuyModal({ symbol, price, onClose, onDone } : { symbol:string; price:number; onClose: ()=>void; onDone: ()=>void }){
  const [qty, setQty] = useState(1)
  const userId = getUserId()
  const [balance, setBalance] = useState<number | null>(null)

  useEffect(()=>{
    if (!userId) return
    setBalance(getBalanceFor(userId))
  }, [userId])

  async function buy(e:any){
    e.preventDefault()
    if (!userId) return alert('please login')
    const cost = Number(qty) * price
    const bal = getBalanceFor(userId) ?? 0
    if (cost > bal) return alert('Insufficient balance')
    const res: any = buyHolding(userId, symbol, Number(qty), price)
    if (!res.ok) return alert(res.error || 'buy failed')
    onDone()
    onClose()
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Buy {symbol}</h2>
      <form onSubmit={buy} className="space-y-3">
        <div>Price: ${price}</div>
        <div className="text-sm">Total: <span className="font-semibold">${(Number(qty) * price).toFixed(2)}</span></div>
        {balance !== null && (
          <div className="text-sm text-slate-600">Balance: ${balance} • After: {(Math.max(0, (balance - (Number(qty) * price)))).toFixed(2)}</div>
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
