const fs = require('fs')
const path = require('path')

const required = {
  core: [
    'MONGODB_URI',
    'APP_URL',
  ],
  newsletter: [
    'SENDGRID_API_KEY',
    'SENDGRID_FROM_EMAIL',
  ],
  adminAuth: [
    'ADMIN_JWT_SECRET',
    'ADMIN_API_TOKEN',
  ],
  firebaseClient: [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID',
  ],
  firebaseAdmin: [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY',
  ],
  redis: [
    'REDIS_URL',
    'REDIS_PASSWORD',
  ],
}

function parseEnvFile(fp) {
  const env = {}
  const txt = fs.readFileSync(fp, 'utf8')
  const lines = txt.split(/\r?\n/)
  for (const line of lines) {
    const l = line.trim()
    if (!l || l.startsWith('#')) continue
    const eq = l.indexOf('=')
    if (eq === -1) continue
    const key = l.slice(0, eq).trim()
    let val = l.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    val = val.replace(/\\n/g, '\n')
    env[key] = val
  }
  return env
}

function mask(v) {
  if (!v) return 'MISSING'
  return 'SET'
}

function checkGroup(name, keys, getEnv) {
  const results = keys.map((k) => ({ key: k, ok: !!getEnv(k) }))
  const ok = results.every((r) => r.ok)
  console.log(`\n[${name}]`)
  for (const r of results) console.log(` - ${r.key}: ${mask(getEnv(r.key))}`)
  return ok
}

function validateExtras(getEnv) {
  let ok = true
  const appUrl = getEnv('APP_URL') || ''
  if (!/^https?:\/\//.test(appUrl)) {
    console.log("\n[hint] APP_URL devrait commencer par http(s)://")
    ok = false
  }

  const sendgrid = getEnv('SENDGRID_API_KEY') || ''
  if (sendgrid && sendgrid.length < 20) {
    console.log("[hint] SENDGRID_API_KEY semble trop court")
    ok = false
  }

  const adminJwt = getEnv('ADMIN_JWT_SECRET') || ''
  const adminToken = getEnv('ADMIN_API_TOKEN') || ''
  if (!adminJwt && !adminToken) {
    console.log("[hint] ADMIN_JWT_SECRET ou ADMIN_API_TOKEN doit être défini")
    ok = false
  }

  const pk = getEnv('FIREBASE_PRIVATE_KEY') || ''
  if (pk && /YOUR_/i.test(pk)) {
    console.log("[hint] FIREBASE_PRIVATE_KEY invalide (placeholder)")
    ok = false
  }

  const redisUrl = getEnv('REDIS_URL') || ''
  const redisPwd = getEnv('REDIS_PASSWORD') || ''
  if (redisUrl || redisPwd) {
    if (!redisUrl || !redisPwd) {
      console.log("[hint] REDIS_URL et REDIS_PASSWORD doivent être tous les deux définis pour activer Redis")
      ok = false
    } else if (!/^https?:\/\//.test(redisUrl)) {
      console.log("[hint] REDIS_URL devrait être une URL HTTPS (Upstash REST)")
    }
  }

  return ok
}

function main() {
  console.log("Vérification des variables d’environnement (.env.local)")
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) {
    console.log("Fichier .env.local introuvable")
    process.exit(1)
  }
  const envFile = parseEnvFile(envPath)
  const getEnv = (k) => (envFile[k] !== undefined ? envFile[k] : (process.env[k] || ''))
  let allOk = true
  allOk &= checkGroup('core', required.core, getEnv)
  allOk &= checkGroup('newsletter', required.newsletter, getEnv)
  console.log("\n[adminAuth]")
  console.log(` - ADMIN_JWT_SECRET: ${mask(getEnv('ADMIN_JWT_SECRET'))}`)
  console.log(` - ADMIN_API_TOKEN: ${mask(getEnv('ADMIN_API_TOKEN'))}`)
  if (!getEnv('ADMIN_JWT_SECRET') && !getEnv('ADMIN_API_TOKEN')) allOk = false
  allOk &= checkGroup('firebaseClient', required.firebaseClient, getEnv)
  allOk &= checkGroup('firebaseAdmin', required.firebaseAdmin, getEnv)
  checkGroup('redis (optionnel)', required.redis, getEnv)
  const extrasOk = validateExtras(getEnv)
  allOk &= extrasOk

  console.log(`\nRésultat: ${allOk ? 'OK' : 'INCOMPLET'}`)
  process.exit(allOk ? 0 : 1)
}

main()