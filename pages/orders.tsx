'use client'
import { useState, useEffect } from 'react'
import Header from '../components/Header'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Order {
  id: number
  symbol: string
  stockName: string
  quantity: number
  price: number
  total: number
  type: 'BUY' | 'SELL'
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const token = localStorage.getItem('mv_jwt')
    if (!token) {
        console.error('No auth token found')
        setLoading(false)
        return
    }

    const url = filter 
      ? `${API}/api/orders/history?symbol=${filter}`
      : `${API}/api/orders/history`

    console.log('Fetching orders from', url)
    
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (r.ok) {
      const data = await r.json()
      setOrders(data)
    }
    setLoading(false)
  }

  return (
      <div className="max-w-6xl mx-auto p-6">
        <Header />
      <h1 className="text-2xl font-semibold mb-4">Order History</h1>

      {/* Filter */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Filter by symbol (e.g., AAPL)"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 w-64 text-black"
        />
        <button
          onClick={fetchOrders}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
        {filter && (
          <button
            onClick={() => { setFilter(''); fetchOrders() }}
            className="ml-2 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500">No orders yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black-100">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Symbol</th>
                <th className="border p-2 text-left">Company</th>
                <th className="border p-2 text-right">Quantity</th>
                <th className="border p-2 text-right">Price</th>
                <th className="border p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {new Date(o.createdAt).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      o.type === 'BUY' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {o.type}
                    </span>
                  </td>
                  <td className="border p-2 font-semibold">{o.symbol}</td>
                  <td className="border p-2">{o.stockName}</td>
                  <td className="border p-2 text-right">{o.quantity}</td>
                  <td className="border p-2 text-right">${o.price.toFixed(2)}</td>
                  <td className="border p-2 text-right font-semibold">
                    ${o.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}