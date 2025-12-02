let validated = (globalThis as any).__envValidated || false

export function assertRequiredEnv() {
  if (validated) return
  const required = ["SENDGRID_API_KEY", "SENDGRID_TO_EMAIL", "SENDGRID_FROM_EMAIL"]
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    const msg = `Env variables missing: ${missing.join(", ")}. Set them in .env.local (see .env.example).`
    if (process.env.NODE_ENV === "production") {
      console.error(msg)
    } else {
      console.warn(msg)
    }
  }
  ;(globalThis as any).__envValidated = true
  validated = true
}

let newsletterValidated = (globalThis as any).__newsletterEnvValidated || false
export function assertNewsletterEnv() {
  if (newsletterValidated) return
  const required = ["MONGODB_URI", "SENDGRID_API_KEY", "SENDGRID_FROM_EMAIL"]
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    const msg = `Env variables missing for newsletter: ${missing.join(", ")}. Set them in .env.local (see .env.example).`
    if (process.env.NODE_ENV === "production") {
      console.error(msg)
    } else {
      console.warn(msg)
    }
  }
  ;(globalThis as any).__newsletterEnvValidated = true
  newsletterValidated = true
}