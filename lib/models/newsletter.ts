export type NewsletterSubscription = {
  email: string
  name: string | null
  subscribedAt: Date
  date: string
  hour: number
  weekday: number
  confirmed: boolean
  confirmToken?: string
  confirmTokenCreatedAt?: Date
}

export function buildNewsletterSubscription(email: string, name: string | null, now: Date): NewsletterSubscription {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
  return {
    email,
    name,
    subscribedAt: now,
    date: local.toISOString().slice(0, 10),
    hour: local.getHours(),
    weekday: local.getDay(),
    confirmed: false,
  }
}