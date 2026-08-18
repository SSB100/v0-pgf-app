import { neon } from "@neondatabase/serverless"

export type SqlRow = Record<string, any>
type SqlTag = (strings: TemplateStringsArray, ...values: any[]) => Promise<SqlRow[]>

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

// Waypoint currently uses Neon through tagged template literals only. Narrow the
// return type to row arrays so callers do not inherit Neon's transaction/query
// option union when they are executing a normal SELECT/INSERT/UPDATE statement.
export const sql: SqlTag = (strings, ...values) => {
  return getDb()(strings, ...values) as Promise<SqlRow[]>
}
