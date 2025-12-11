export type Holding = {
  symbol: string
  quantity: number
  avgPrice: number
}

function userKey(userId: string, name: string){
  return `mv_${userId}_${name}`
}

export function getUserId(){
  try {
    const u = localStorage.getItem('mv_user')
    if (!u) return null
    const parsed = JSON.parse(u)
    return String(parsed.id)
  } catch { return null }
}

export function getBalanceFor(userId: string){
  const v = localStorage.getItem(userKey(userId, 'balance'))
  if (!v) return null
  return Number(v)
}

export function initBalance(userId: string, start = 1000){
  const key = userKey(userId, 'balance')
  if (!localStorage.getItem(key)) localStorage.setItem(key, String(start))
}

export function setBalance(userId: string, amount: number){
  localStorage.setItem(userKey(userId, 'balance'), String(amount))
}

export function getPortfolio(userId: string): Holding[] {
  const v = localStorage.getItem(userKey(userId, 'portfolio'))
  if (!v) return []
  try { return JSON.parse(v) } catch { return [] }
}

export function savePortfolio(userId: string, holdings: Holding[]){
  localStorage.setItem(userKey(userId, 'portfolio'), JSON.stringify(holdings))
}

export function buyHolding(userId: string, symbol: string, quantity: number, price: number){
  if (quantity <= 0) return { ok: false, error: 'quantity' }
  initBalance(userId)
  const balance = getBalanceFor(userId) ?? 0
  const cost = quantity * price
  if (cost > balance) return { ok: false, error: 'insufficient' }
  const holdings = getPortfolio(userId)
  const existing = holdings.find(h=>h.symbol===symbol)
  if (existing){
    const totalQty = existing.quantity + quantity
    existing.avgPrice = ((existing.avgPrice * existing.quantity) + (price * quantity)) / totalQty
    existing.quantity = totalQty
  } else {
    holdings.push({ symbol, quantity, avgPrice: price })
  }
  setBalance(userId, balance - cost)
  savePortfolio(userId, holdings)
  return { ok: true, holdings }
}

export function sellHolding(userId: string, symbol: string, quantity: number, price: number){
  if (quantity <= 0) return { ok: false, error: 'quantity' }
  const holdings = getPortfolio(userId)
  const existing = holdings.find(h=>h.symbol===symbol)
  if (!existing || existing.quantity < quantity) return { ok: false, error: 'not_enough' }
  existing.quantity -= quantity
  const revenue = quantity * price
  const balance = getBalanceFor(userId) ?? 0
  setBalance(userId, balance + revenue)
  const remaining = holdings.filter(h=>h.quantity>0)
  savePortfolio(userId, remaining)
  return { ok: true, holdings: remaining }
}
