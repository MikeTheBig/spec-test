import type { GetStaticProps } from 'next'
import Header from '../components/Header'
import StockTable from '../components/StockTable'
import { STOCKS, type Stock } from '../data/stocks'

type Props = { stocks: Stock[] }

export default function Home({ stocks }: Props){
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="mb-6">
          <h1 className="text-3xl font-bold">MarketView</h1>
          <p className="text-slate-400 mt-2">A sleek, static demonstration of a top-10 stock overview (mocked data).</p>
        </section>

        <StockTable initial={stocks} />

      </main>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  return { props: { stocks: STOCKS } }
}
