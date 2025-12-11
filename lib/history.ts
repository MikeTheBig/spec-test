import type { Stock } from '../data/stocks'

// Generate mock history for the last N minutes for a given stock
export type Point = { ts: number; price: number }

export function generateHistory(stock: Stock, minutes = 60): Point[]{
  const now = Date.now()
  const points: Point[] = []
  let price = stock.price
  for (let i = minutes - 1; i >= 0; i--) {
    // minute timestamp
    const ts = now - i * 60_000
    // small random walk
    const change = (Math.random() - 0.5) * (price * 0.01)
    price = Math.max(0.01, price + change)
    points.push({ ts, price })
  }
  return points
}
