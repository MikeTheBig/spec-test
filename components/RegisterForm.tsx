import { useState } from 'react'
import Modal from './Modal'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function RegisterForm({ onClose } : { onClose: ()=>void }){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e:any){
    e.preventDefault()
    if (!email || !password) return alert('Please fill email and password')
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/register`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, name, passwordHash: password }) })
      let j: any = null
      try { j = await res.json() } catch (_) {}
      if (!res.ok) {
        const msg = j?.error || `${res.status} ${res.statusText}`
        return alert(msg)
      }
      if (j && j.token){
        localStorage.setItem('mv_jwt', j.token)
        localStorage.setItem('mv_user', JSON.stringify(j.user))
        onClose()
        window.location.href = '/stocks'
      } else {
        alert('Registered but no token returned')
      }
    } catch (err: any) {
      alert('Network error: ' + (err?.message || err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full p-2 border bg-white text-slate-900" placeholder="name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full p-2 border bg-white text-slate-900" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full p-2 border bg-white text-slate-900" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="px-3 py-1 mr-2">Cancel</button>
          <button type="submit" className="px-3 py-1 bg-emerald-600 text-white">{loading ? '...' : 'Register'}</button>
        </div>
      </form>
    </Modal>
  )
}
