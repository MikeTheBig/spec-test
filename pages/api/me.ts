import type { NextApiRequest, NextApiResponse } from 'next'
import { getUserFromToken } from '../../lib/auth'

function parseCookies(req: NextApiRequest) {
  const header = req.headers.cookie || ''
  const parts = header.split(';').map(p => p.trim())
  const out: Record<string,string> = {}
  for (const p of parts) {
    if (!p) continue
    const [k,v] = p.split('=')
    out[k] = v
  }
  return out
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parseCookies(req)
  const token = cookies['mv_token']
  const user = getUserFromToken(token)
  if (!user) return res.json({ user: null })
  return res.json({ user: { id: user.id, email: user.email, name: user.name } })
}
