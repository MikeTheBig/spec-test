import Link from 'next/link'
import { useState, useEffect } from 'react'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

export default function Header(){
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(()=>{
    const u = localStorage.getItem('mv_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  function logout(){
    localStorage.removeItem('mv_jwt')
    localStorage.removeItem('mv_user')
    setUser(null)
    // optional: reload to update UI
    window.location.reload()
  }

  return (
    <header className="bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg">MarketView</Link>
        <nav className="space-x-4">
          <Link href="/" className="text-slate-300 hover:text-white">Overview</Link>
          <Link href="/about" className="text-slate-300 hover:text-white">About</Link>
          <Link href="/faq" className="text-slate-300 hover:text-white">FAQ</Link>
          <Link href="/history" className="text-slate-300 hover:text-white">History</Link>
          {user && (
            <>
            <Link href="/stocks" className="text-slate-300 hover:text-white">Stocks</Link>
            <Link href="/orders" className="text-slate-300 hover:text-white">Orders</Link>
            <Link href="/portfolio" className="text-slate-300 hover:text-white">Portfolio</Link>
            </>
          )}
          
          {user ? (
            <button onClick={logout} className="ml-3 px-3 py-1 bg-red-600 text-white rounded">Logout</button>
          ) : (
            <>
              <button onClick={()=>setShowLogin(true)} className="ml-3 px-3 py-1 bg-slate-700 text-white rounded">Login</button>
              <button onClick={()=>setShowRegister(true)} className="ml-2 px-3 py-1 bg-emerald-600 text-white rounded">Register</button>
            </>
          )}
        </nav>
      </div>

      {showRegister && <RegisterForm onClose={()=>setShowRegister(false)} />}
      {showLogin && <LoginForm onClose={()=>setShowLogin(false)} />}
    </header>
  )
}
