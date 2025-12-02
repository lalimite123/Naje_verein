import { randomBytes, pbkdf2Sync } from "crypto"

export type Admin = {
  username: string
  password: string
  createdAt: Date
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const iterations = 100000
  const keylen = 32
  const digest = "sha256"
  const hash = pbkdf2Sync(password, salt, iterations, keylen, digest).toString("hex")
  return `pbkdf2$${iterations}$${digest}$${salt}$${hash}`
}

export function verifyPassword(password: string, encoded: string) {
  const parts = encoded.split("$")
  if (parts.length !== 5 || parts[0] !== "pbkdf2") return false
  const iterations = parseInt(parts[1], 10)
  const digest = parts[2]
  const salt = parts[3]
  const expected = parts[4]
  const hash = pbkdf2Sync(password, salt, iterations, 32, digest).toString("hex")
  return hash === expected
}