import Header from '../components/Header'

export default function FAQ(){
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="bg-slate-800/50 rounded-lg p-6">
          <h1 className="text-2xl font-bold">FAQ</h1>

          <h3 className="mt-4 font-semibold">Is this data real?</h3>
          <p className="text-slate-300">No. All data is mocked and bundled at build time for demo purposes.</p>

          <h3 className="mt-4 font-semibold">Can I connect a real feed?</h3>
          <p className="text-slate-300">Yes — replace the local data import with a fetch to your API and adapt the client update logic.</p>

          <h3 className="mt-4 font-semibold">How do I preview the site?</h3>
          <p className="text-slate-300">Run <code>npm run dev</code> and open <code>http://localhost:3000</code>. For static export: <code>npm run build</code> then <code>npm run export</code>.</p>

        </section>
      </main>
    </div>
  )
}
