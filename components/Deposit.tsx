import Modal from './Modal'
import { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function Deposit({ onClose, onDone } : { onClose: ()=>void; onDone: ()=>void }){
    const [amount, setAmount] = useState(100)
    const [loading, setLoading] = useState(false)

    async function handleDeposit(e:any){
        e.preventDefault()

        if (amount <= 0) {
            alert('Please enter a valid amount')
            return
        }
        const token = localStorage.getItem('mv_jwt')
        if (!token) {
            alert('Please log in')
            return
        }

        setLoading(true)

        try {
            const r = await fetch(`${API}/api/orders/balance/deposit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(amount)
            })

            if (r.ok) {
                alert('Deposit successful')
                onDone()
                onClose()
            } else {
                const errorText = await r.text()
                console.error('Deposit failed:', errorText)
        alert('Deposit failed: ' + errorText)
      }
    } catch (error) {
      console.error('Deposit error:', error)
      alert('Deposit failed - network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>
      <form onSubmit={handleDeposit} className="space-y-3">
        <div className="text-sm text-slate-600">
          Add money to your trading account
        </div>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold">$</span>
          <input 
            type="number" 
            min={1} 
            step={1}
            value={amount} 
            onChange={e => {
              let v = Number(e.target.value)
              if (v < 1) v = 1
              setAmount(v)
            }}
            className="flex-1 p-3 border rounded-lg bg-white text-slate-900 text-xl font-semibold" 
          />
        </div>
        <div className="flex gap-2">
          <button 
            type="button" 
            onClick={() => setAmount(100)} 
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            $100
          </button>
          <button 
            type="button" 
            onClick={() => setAmount(500)} 
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            $500
          </button>
          <button 
            type="button" 
            onClick={() => setAmount(1000)} 
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            $1,000
          </button>
          <button 
            type="button" 
            onClick={() => setAmount(5000)} 
            className="px-3 py-1 bg-slate-200 rounded hover:bg-slate-300"
          >
            $5,000
          </button>
        </div>
        <div className="flex justify-end pt-2">
          <button 
            type="button" 
            onClick={onClose} 
            className="mr-2 px-4 py-2 rounded hover:bg-slate-100"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading || amount <= 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Depositing...' : `Deposit $${amount}`}
          </button>
        </div>
      </form>
    </Modal>
  )
}
