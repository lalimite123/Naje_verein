#!/usr/bin/env node
const { MongoClient } = require('mongodb')
const crypto = require('crypto')

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const iterations = 100000
  const digest = 'sha256'
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 32, digest).toString('hex')
  return `pbkdf2$${iterations}$${digest}$${salt}$${hash}`
}

async function main() {
  const uri = process.env.MONGODB_URI
  const dbName = process.env.MONGODB_DB || 'naje'
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD
  const name = process.env.ADMIN_NAME || ''

  if (!uri || !email || !password) {
    console.error('Missing env: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD')
    process.exit(1)
  }

  const client = new MongoClient(uri, { maxPoolSize: 1 })
  await client.connect()
  const db = client.db(dbName)
  const col = db.collection('Admins')
  await col.createIndex({ username: 1 }, { unique: true })

  const doc = {
    username: email,
    email,
    name,
    password: hashPassword(password),
    createdAt: new Date(),
  }

  try {
    await col.insertOne(doc)
    console.log('Admin created:', email)
  } catch (e) {
    if (e && e.code === 11000) {
      console.log('Admin already exists:', email)
    } else {
      console.error('Error:', e && e.message ? e.message : e)
      process.exit(1)
    }
  } finally {
    await client.close()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})