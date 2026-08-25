const LEGACY_ADMIN_PROFESSIONAL_PATH = "/admin/professional"
const ADMIN_PROFESSIONALS_PATH = "/admin/professionals"

export function canonicalReturnPath(value: unknown, fallback: string | null): string | null {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return fallback
  }

  if (
    value === LEGACY_ADMIN_PROFESSIONAL_PATH
    || value.startsWith(`${LEGACY_ADMIN_PROFESSIONAL_PATH}/`)
    || value.startsWith(`${LEGACY_ADMIN_PROFESSIONAL_PATH}?`)
    || value.startsWith(`${LEGACY_ADMIN_PROFESSIONAL_PATH}#`)
  ) {
    return `${ADMIN_PROFESSIONALS_PATH}${value.slice(LEGACY_ADMIN_PROFESSIONAL_PATH.length)}`
  }

  return value
}
