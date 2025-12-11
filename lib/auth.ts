import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { createSession, getSession, deleteSession, findUserById, findUserByEmail } from './db'

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export function createAuthToken(userId: string) {
  const token = uuidv4()
  createSession(token, userId)
  return token
}

export function getUserFromToken(token?: string) {
  if (!token) return null
  const sess = getSession(token)
  if (!sess) return null
  return findUserById(sess.userId)
}

export function logoutToken(token?: string) {
  if (!token) return
  deleteSession(token)
}
