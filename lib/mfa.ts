import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto"

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
const TOTP_PERIOD_SECONDS = 30
const TOTP_DIGITS = 6

export function isMfaEncryptionConfigured() {
  const value = process.env.MFA_ENCRYPTION_KEY
  return typeof value === "string" && value.length >= 24
}

function getMfaMasterSecret() {
  const value = process.env.MFA_ENCRYPTION_KEY
  if (!value || value.length < 24) {
    throw new Error("MFA_ENCRYPTION_KEY is not configured with sufficient entropy")
  }
  return value
}

function encryptionKey() {
  return createHash("sha256").update(`waypoint-mfa-encryption:${getMfaMasterSecret()}`).digest()
}

function recoveryPepper() {
  return createHash("sha256").update(`waypoint-mfa-recovery:${getMfaMasterSecret()}`).digest()
}

export function encodeBase32(buffer: Uint8Array) {
  let bits = 0
  let value = 0
  let output = ""

  for (const byte of buffer) {
    value = (value << 8) | byte
    bits += 8
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) output += BASE32_ALPHABET[(value << (5 - bits)) & 31]
  return output
}

function decodeBase32(input: string) {
  const clean = input.toUpperCase().replace(/[^A-Z2-7]/g, "")
  let bits = 0
  let value = 0
  const bytes: number[] = []

  for (const char of clean) {
    const index = BASE32_ALPHABET.indexOf(char)
    if (index < 0) continue
    value = (value << 5) | index
    bits += 5
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return Buffer.from(bytes)
}

export function generateTotpSecret() {
  return encodeBase32(randomBytes(20))
}

export function encryptMfaSecret(secret: string) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv)
  const ciphertext = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return {
    ciphertext: ciphertext.toString("base64url"),
    iv: iv.toString("base64url"),
    authTag: tag.toString("base64url"),
  }
}

export function decryptMfaSecret(input: { ciphertext: string; iv: string; authTag: string }) {
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(input.iv, "base64url"))
  decipher.setAuthTag(Buffer.from(input.authTag, "base64url"))
  return Buffer.concat([
    decipher.update(Buffer.from(input.ciphertext, "base64url")),
    decipher.final(),
  ]).toString("utf8")
}

function totpAt(secret: string, timestampMs: number) {
  const counter = Math.floor(timestampMs / 1000 / TOTP_PERIOD_SECONDS)
  const buffer = Buffer.alloc(8)
  buffer.writeBigUInt64BE(BigInt(counter))

  const digest = createHmac("sha1", decodeBase32(secret)).update(buffer).digest()
  const offset = digest[digest.length - 1] & 0x0f
  const binary = ((digest[offset] & 0x7f) << 24)
    | ((digest[offset + 1] & 0xff) << 16)
    | ((digest[offset + 2] & 0xff) << 8)
    | (digest[offset + 3] & 0xff)

  return String(binary % (10 ** TOTP_DIGITS)).padStart(TOTP_DIGITS, "0")
}

export function verifyTotpCode(secret: string, input: string, now = Date.now()) {
  const code = input.replace(/\s+/g, "")
  if (!/^\d{6}$/.test(code)) return false
  const supplied = Buffer.from(code)

  for (const step of [-1, 0, 1]) {
    const expected = Buffer.from(totpAt(secret, now + step * TOTP_PERIOD_SECONDS * 1000))
    if (supplied.length === expected.length && timingSafeEqual(supplied, expected)) return true
  }

  return false
}

export function buildTotpUri(input: { secret: string; email: string }) {
  const issuer = "Waypoint"
  const label = `${issuer}:${input.email}`
  return `otpauth://totp/${encodeURIComponent(label)}?secret=${encodeURIComponent(input.secret)}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`
}

export function generateRecoveryCodes(count = 10) {
  return Array.from({ length: count }, () => {
    const value = randomBytes(6).toString("hex").toUpperCase()
    return `${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}`
  })
}

export function normaliseRecoveryCode(value: string) {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "")
}

export function hashRecoveryCode(value: string) {
  return createHmac("sha256", recoveryPepper()).update(normaliseRecoveryCode(value)).digest("hex")
}

export function looksLikeTotp(value: string) {
  return /^\d{6}$/.test(value.replace(/\s+/g, ""))
}
