import { MongoClient } from "mongodb"

let client: MongoClient | null = null
let promise: Promise<MongoClient> | null = null

export async function getMongoClient() {
  if (client) return client
  if (!promise) {
    const uri = process.env.MONGODB_URI as string
    promise = new MongoClient(uri, { maxPoolSize: 5 }).connect().then((c) => {
      client = c
      return c
    })
  }
  return promise
}

export async function getDb() {
  const c = await getMongoClient()
  const dbName = (process.env.MONGODB_DB as string) || "naje"
  return c.db(dbName)
}