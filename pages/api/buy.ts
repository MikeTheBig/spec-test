import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromToken } from '../../lib/auth'
import { createOrder } from '../../lib/db'
import { STOCKS } from '../../data/stocks'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method_not_allowed' })
  const token = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('mv_token='))?.split('=')[1]
  const user = getUserFromToken(token)
  if (!user) return res.status(401).json({ error: 'unauthenticated' })
  const { symbol, quantity } = req.body
  if (!symbol || !quantity || quantity <= 0) return res.status(400).json({ error: 'invalid_input' })
  const stock = STOCKS.find(s => s.symbol === symbol)
  if (!stock) return res.status(404).json({ error: 'stock_not_found' })
  const order = {
    id: 'o_' + Date.now(),
    userId: user.id,
    symbol,
    quantity: Number(quantity),
    price: stock.price,
    createdAt: Date.now()
  }
  createOrder(order)
  return res.json({ ok: true, order })
}
