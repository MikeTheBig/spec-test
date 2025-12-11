import type { NextApiRequest, NextApiResponse } from 'next'
import { hashPassword, verifyPassword, createAuthToken } from '../../lib/auth'
import { createUser, findUserByEmail } from '../../lib/db'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action } = req.query
    if (action === 'register') {
      const { email, password, name } = req.body
      if (!email || !password) return res.status(400).json({ error: 'email and password required' })
      if (findUserByEmail(email)) return res.status(400).json({ error: 'already_registered' })
      const hash = await hashPassword(password)
      const user = { id: 'u_' + Date.now(), email, name: name || '', passwordHash: hash }
      createUser(user)
      const token = createAuthToken(user.id)
      res.setHeader('Set-Cookie', `mv_token=${token}; HttpOnly; Path=/; Max-Age=604800`)
      return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
    }

    if (action === 'login') {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ error: 'email and password required' })
      const user = findUserByEmail(email)
      if (!user) return res.status(400).json({ error: 'not_found' })
      const ok = await verifyPassword(password, user.passwordHash)
      if (!ok) return res.status(400).json({ error: 'invalid_credentials' })
      const token = createAuthToken(user.id)
      res.setHeader('Set-Cookie', `mv_token=${token}; HttpOnly; Path=/; Max-Age=604800`)
      return res.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } })
    }
  }
  res.status(405).json({ error: 'method_not_allowed' })
}
