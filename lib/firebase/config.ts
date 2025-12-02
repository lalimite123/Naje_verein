import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { initializeApp as initializeAdminApp, getApps } from 'firebase-admin/app'
import { getStorage as getAdminStorage } from 'firebase-admin/storage'
import { credential } from 'firebase-admin'

// Configuration client Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialisation client
const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

// Initialisation admin (côté serveur)
let adminApp
if (!getApps().length) {
  // Validation des variables d'environnement
  const requiredEnvVars = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY
  }

  // Vérifier que toutes les variables sont présentes
  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.includes('YOUR_') || value.includes('your_')) {
      throw new Error(`Variable d'environnement Firebase manquante ou invalide: ${key}`)
    }
  }

  adminApp = initializeAdminApp({
    credential: credential.cert({
      projectId: requiredEnvVars.projectId,
      clientEmail: requiredEnvVars.clientEmail,
      privateKey: requiredEnvVars.privateKey.replace(/\\n/g, '\n')
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
  })
} else {
  adminApp = getApps()[0]
}

export const adminStorage = getAdminStorage(adminApp)