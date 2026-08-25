import { neon } from "@neondatabase/serverless"

// The MVP does not yet have generated database row types. Keep the untyped
// boundary in this one module rather than leaking Neon's broad result union
// throughout the application. Individual service/query layers should replace
// this with explicit row types as the research/clinical data model hardens.
export type SqlRow = any
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

export const sql: SqlTag = (strings, ...values) => {
  return getDb()(strings, ...values) as Promise<SqlRow[]>
}

export async function dbColumnExists(tableName: string, columnName: string) {
  const result = await sql`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = ${tableName}
        AND column_name = ${columnName}
    ) AS column_exists
  `
  return result[0]?.column_exists === true
}
