export type Stock = {
  symbol: string;
  company: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
}

export const STOCKS: Stock[] = [
  { symbol: 'AAPL', company: 'Apple Inc.', price: 174.55, change: 0.62, changePercent: 0.36, marketCap: 2700000000000, volume: 55400000 },
  { symbol: 'MSFT', company: 'Microsoft Corp.', price: 339.12, change: -1.23, changePercent: -0.36, marketCap: 2500000000000, volume: 18300000 },
  { symbol: 'GOOGL', company: 'Alphabet Inc.', price: 132.44, change: 0.85, changePercent: 0.65, marketCap: 1700000000000, volume: 1800000 },
  { symbol: 'AMZN', company: 'Amazon.com, Inc.', price: 142.19, change: -0.95, changePercent: -0.66, marketCap: 1300000000000, volume: 3900000 },
  { symbol: 'NVDA', company: 'NVIDIA Corp.', price: 540.11, change: 6.12, changePercent: 1.14, marketCap: 1000000000000, volume: 28200000 },
  { symbol: 'TSLA', company: 'Tesla, Inc.', price: 242.55, change: -4.52, changePercent: -1.83, marketCap: 800000000000, volume: 22100000 },
  { symbol: 'META', company: 'Meta Platforms', price: 331.22, change: 2.14, changePercent: 0.65, marketCap: 900000000000, volume: 10500000 },
  { symbol: 'NONO', company: 'Novo Nordisk', price: 139.5, change: 0.12, changePercent: 0.09, marketCap: 420000000000, volume: 7300000 },
  { symbol: 'V', company: 'Visa Inc.', price: 245.66, change: -0.08, changePercent: -0.03, marketCap: 470000000000, volume: 3000000 },
  { symbol: 'DIS', company: 'The Walt Disney Co.', price: 94.11, change: 0.4, changePercent: 0.43, marketCap: 175000000000, volume: 12100000 },
];
