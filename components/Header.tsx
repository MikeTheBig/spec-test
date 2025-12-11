import Link from 'next/link'

export default function Header(){
  return (
    <header className="bg-slate-900/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg">MarketView</Link>
        <nav className="space-x-4">
          <Link href="/" className="text-slate-300 hover:text-white">Overview</Link>
          <Link href="/about" className="text-slate-300 hover:text-white">About</Link>
          <Link href="/faq" className="text-slate-300 hover:text-white">FAQ</Link>
          <Link href="/history" className="text-slate-300 hover:text-white">History</Link>
        </nav>
      </div>
    </header>
  )
}
