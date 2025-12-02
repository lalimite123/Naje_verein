export type Program = {
  title: string
  summary: string
  date: string
  time?: string
  location?: string
  organizer?: string
  type: "program" | "event"
  image?: string
  createdAt: Date
  updatedAt: Date
}

export function buildProgram(input: Omit<Program, "createdAt" | "updatedAt">, now: Date): Program {
  return { ...input, createdAt: now, updatedAt: now }
}