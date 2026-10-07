// Server-only email + password authentication for the hidden admin control
// panel. This is fully separate from the Pi Network sign-in used by the
// game itself — only these two exact email addresses may ever hold an
// admin account, and every session token is verified against the database
// on every request. Passwords are never stored or logged in plain text.
import crypto from "crypto"
import { db } from "@/lib/db"

export const ADMIN_EMAILS = ["a0931653580@gmail.com", "a0988576990@gmail.com"]

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000
const MIN_PASSWORD_LENGTH = 8

export function normalizeEmail(email: unknown): string {
  return typeof email === "string" ? email.trim().toLowerCase() : ""
}

export function isAllowedAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(normalizeEmail(email))
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex")
}

function genSalt(): string {
  return crypto.randomBytes(16).toString("hex")
}

function genToken(): string {
  return crypto.randomBytes(32).toString("hex")
}

export async function getAccountStatus(emailInput: string): Promise<{ allowed: boolean; hasPassword: boolean }> {
  const email = normalizeEmail(emailInput)
  if (!isAllowedAdminEmail(email)) return { allowed: false, hasPassword: false }
  const pool = await db()
  const r = await pool.query("SELECT password_hash FROM admin_accounts WHERE email=$1", [email])
  if (r.rows.length === 0) return { allowed: true, hasPassword: false }
  return { allowed: true, hasPassword: !!r.rows[0].password_hash }
}

async function createSession(email: string): Promise<string> {
  const pool = await db()
  const token = genToken()
  const now = Date.now()
  await pool.query("INSERT INTO admin_sessions (token, email, created_at, expires_at) VALUES ($1,$2,$3,$4)", [
    token,
    email,
    now,
    now + SESSION_TTL_MS,
  ])
  return token
}

export async function setInitialPassword(
  emailInput: string,
  password: string,
): Promise<{ ok: true; token: string; email: string } | { ok: false; error: string }> {
  const email = normalizeEmail(emailInput)
  if (!isAllowedAdminEmail(email)) return { ok: false, error: "not_allowed" }
  if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: "password_too_short" }
  }
  const pool = await db()
  const existing = await pool.query("SELECT password_hash FROM admin_accounts WHERE email=$1", [email])
  if (existing.rows.length > 0 && existing.rows[0].password_hash) {
    return { ok: false, error: "already_set" }
  }
  const salt = genSalt()
  const hash = hashPassword(password, salt)
  const now = Date.now()
  await pool.query(
    `INSERT INTO admin_accounts (email, password_hash, salt, created_at, updated_at) VALUES ($1,$2,$3,$4,$4)
     ON CONFLICT (email) DO UPDATE SET password_hash=$2, salt=$3, updated_at=$4`,
    [email, hash, salt, now],
  )
  const token = await createSession(email)
  return { ok: true, token, email }
}

export async function login(
  emailInput: string,
  password: string,
): Promise<{ ok: true; token: string; email: string } | { ok: false; error: string }> {
  const email = normalizeEmail(emailInput)
  if (!isAllowedAdminEmail(email)) return { ok: false, error: "not_allowed" }
  if (typeof password !== "string" || !password) return { ok: false, error: "invalid_credentials" }
  const pool = await db()
  const r = await pool.query("SELECT password_hash, salt FROM admin_accounts WHERE email=$1", [email])
  if (r.rows.length === 0 || !r.rows[0].password_hash) return { ok: false, error: "not_set_up" }
  const { password_hash, salt } = r.rows[0]
  const attempt = hashPassword(password, salt)
  const a = Buffer.from(attempt, "hex")
  const b = Buffer.from(password_hash, "hex")
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { ok: false, error: "invalid_credentials" }
  }
  const token = await createSession(email)
  return { ok: true, token, email }
}

export async function verifySessionToken(token: unknown): Promise<string | null> {
  if (typeof token !== "string" || !token) return null
  const pool = await db()
  const r = await pool.query("SELECT email, expires_at FROM admin_sessions WHERE token=$1", [token])
  if (r.rows.length === 0) return null
  const row = r.rows[0]
  if (Number(row.expires_at) < Date.now()) {
    await pool.query("DELETE FROM admin_sessions WHERE token=$1", [token])
    return null
  }
  const email = normalizeEmail(row.email)
  if (!isAllowedAdminEmail(email)) return null
  return email
}

export async function deleteSession(token: unknown): Promise<void> {
  if (typeof token !== "string" || !token) return
  const pool = await db()
  await pool.query("DELETE FROM admin_sessions WHERE token=$1", [token])
}
