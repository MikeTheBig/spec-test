import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'db.json')

type DB = {
  users: Array<any>
  sessions: Record<string, any>
  orders: Array<any>
}

function readDB(): DB {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw) as DB
}

function writeDB(db: DB) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8')
}

export function createUser(user: { id: string; email: string; name?: string; passwordHash: string }) {
  const db = readDB()
  db.users.push(user)
  writeDB(db)
  return user
}

export function findUserByEmail(email: string) {
  const db = readDB()
  return db.users.find(u => u.email === email)
}

export function findUserById(id: string) {
  const db = readDB()
  return db.users.find(u => u.id === id)
}

export function createSession(token: string, userId: string) {
  const db = readDB()
  db.sessions[token] = { userId, createdAt: Date.now() }
  writeDB(db)
}

export function getSession(token: string) {
  const db = readDB()
  return db.sessions[token]
}

export function deleteSession(token: string) {
  const db = readDB()
  delete db.sessions[token]
  writeDB(db)
}

export function createOrder(order: any) {
  const db = readDB()
  db.orders.push(order)
  writeDB(db)
  return order
}

export function listOrdersByUser(userId: string) {
  const db = readDB()
  return db.orders.filter(o => o.userId === userId)
}
