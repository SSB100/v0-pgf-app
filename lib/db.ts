import { neon } from "@neondatabase/serverless"

let _sql: ReturnType<typeof neon> | null = null

function getDb() {
  if (!_sql) {
    const databaseUrl = process.env.NEON_DATABASE_URL
    if (!databaseUrl) {
      throw new Error("NEON_DATABASE_URL is not defined")
    }
    _sql = neon(databaseUrl)
  }
  return _sql
}

// This works with tagged template literals: sql`SELECT...`
export const sql = (...args: Parameters<ReturnType<typeof neon>>) => {
  return getDb()(...args)
}
