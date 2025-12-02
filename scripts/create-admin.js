#!/usr/bin/env node
const { spawn } = require('child_process')
const readline = require('readline')
const path = require('path')
const fs = require('fs')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

function question(query) {
  return new Promise((resolve) => rl.question(query, (answer) => resolve(answer)))
}

function loadEnvFiles() {
  const candidates = [
    path.resolve(__dirname, '..', '.env.local'),
    path.resolve(__dirname, '..', '.env'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/)
      for (const line of lines) {
        if (!line || /^\s*#/.test(line)) continue
        const m = line.match(/^\s*([^=]+)=(.*)$/)
        if (m) {
          const key = m[1].trim()
          let val = m[2].trim()
          if (/^".*"$/.test(val)) val = val.slice(1, -1)
          if (/^'.*'$/.test(val)) val = val.slice(1, -1)
          if (!process.env[key]) process.env[key] = val
        }
      }
    }
  }
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePasswordStrength(password) {
  if (!password || password.length < 8) return { isValid: false, message: 'Le mot de passe doit contenir au moins 8 caractères' }
  if (!/[A-Z]/.test(password)) return { isValid: false, message: 'Le mot de passe doit contenir au moins une lettre majuscule' }
  if (!/[a-z]/.test(password)) return { isValid: false, message: 'Le mot de passe doit contenir au moins une lettre minuscule' }
  if (!/[0-9]/.test(password)) return { isValid: false, message: 'Le mot de passe doit contenir au moins un chiffre' }
  if (!/[^A-Za-z0-9]/.test(password)) return { isValid: false, message: 'Le mot de passe doit contenir au moins un caractère spécial' }
  return { isValid: true }
}

async function main() {
  loadEnvFiles()
  console.log('==================================================')
  console.log("🚀 Assistant de création d'un nouvel administrateur")
  console.log('==================================================')

  let email = ''
  while (!email) {
    email = await question("📧 Email de l'administrateur: ")
    if (!isValidEmail(email)) {
      console.log('❌ Email invalide. Veuillez entrer un email valide.')
      email = ''
    }
  }

  let password = ''
  let validation = { isValid: false }
  while (!validation.isValid) {
    password = await question('🔑 Mot de passe (min 8 caractères, avec majuscule, minuscule, chiffre et caractère spécial): ')
    validation = validatePasswordStrength(password)
    if (!validation.isValid) console.log(`❌ ${validation.message}`)
  }

  const fullName = await question('👤 Nom complet: ')

  const tempEnvPath = path.join(__dirname, '.temp-admin-env')
  const envContent = `ADMIN_EMAIL=${email}\nADMIN_PASSWORD=${password}\nADMIN_NAME=${fullName}\n`
  fs.writeFileSync(tempEnvPath, envContent)

  console.log("\n✅ Informations enregistrées. Création de l'administrateur en cours...")

  const initScript = path.join(__dirname, 'init-admin-user.js')
  const child = spawn(process.platform === 'win32' ? 'node.exe' : 'node', [initScript], {
    env: { ...process.env, ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: fullName },
    stdio: 'inherit',
  })

  child.on('close', (code) => {
    if (fs.existsSync(tempEnvPath)) fs.unlinkSync(tempEnvPath)
    if (code === 0) console.log('\n✅ Administrateur créé avec succès!')
    else console.error(`\n❌ Erreur lors de la création de l'administrateur (code: ${code})`)
    rl.close()
  })
}

main().catch((error) => {
  console.error('❌ Erreur:', error)
  rl.close()
})