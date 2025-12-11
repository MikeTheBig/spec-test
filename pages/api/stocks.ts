import type { NextApiRequest, NextApiResponse } from 'next'
import { STOCKS } from '../../data/stocks'

export default function handler(req: NextApiRequest, res: NextApiResponse){
  // Return the mock stocks; later replace with real provider call if desired
  res.setHeader('Cache-Control','s-maxage=10, stale-while-revalidate=30')
  res.status(200).json(STOCKS)
}
