import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromToken } from '../../lib/auth'
import { listOrdersByUser } from '../../lib/db'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' })
  const token = (req.headers.cookie || '').split(';').map(s => s.trim()).find(s => s.startsWith('mv_token='))?.split('=')[1]
  const user = getUserFromToken(token)
  if (!user) return res.status(401).json({ error: 'unauthenticated' })
  const orders = listOrdersByUser(user.id)
  return res.json({ orders })
}
