export const WAYPOINT_TIME_ZONE = "Pacific/Auckland"

export function getAotearoaDateKey(date: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-NZ", {
    timeZone: WAYPOINT_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  const year = parts.find((part) => part.type === "year")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const day = parts.find((part) => part.type === "day")?.value

  if (!year || !month || !day) {
    throw new Error("Unable to resolve the Aotearoa date")
  }

  return `${year}-${month}-${day}`
}

export function normaliseDateKey(value: unknown): string | null {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)
  return null
}

export function formatDateKeyEnNz(dateKey: string): string {
  const [year, month, day] = dateKey.split("-")
  if (!year || !month || !day) return dateKey
  return `${day}/${month}/${year}`
}

export function addCalendarDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0))
  return date.toISOString().slice(0, 10)
}

export function differenceInCalendarDays(laterDateKey: string, earlierDateKey: string): number {
  const [laterYear, laterMonth, laterDay] = laterDateKey.split("-").map(Number)
  const [earlierYear, earlierMonth, earlierDay] = earlierDateKey.split("-").map(Number)

  const later = Date.UTC(laterYear, laterMonth - 1, laterDay)
  const earlier = Date.UTC(earlierYear, earlierMonth - 1, earlierDay)

  return Math.round((later - earlier) / (24 * 60 * 60 * 1000))
}
