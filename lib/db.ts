// Shared Postgres connection (Neon) backing this app's per-player save data,
// the Pi-exchange ledger, and the admin control panel. All access goes
// through this one pool; schema is created lazily and idempotently on first
// use so no manual migration step is required.
import { Pool } from "pg"

let pool: Pool | null = null
let schemaReady: Promise<void> | null = null

function getPool(): Pool {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error("DATABASE_URL is not configured")
  if (!pool) pool = new Pool({ connectionString: url, max: 5 })
  return pool
}

async function ensureSchema(p: Pool): Promise<void> {
  await p.query(`CREATE TABLE IF NOT EXISTS user_state (
    uid text NOT NULL,
    key text NOT NULL,
    blob jsonb NOT NULL,
    version integer NOT NULL DEFAULT 1,
    updated_at bigint NOT NULL,
    PRIMARY KEY (uid, key)
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS players (
    uid text PRIMARY KEY,
    username text NOT NULL DEFAULT '',
    first_seen bigint NOT NULL,
    last_seen bigint NOT NULL,
    banned boolean NOT NULL DEFAULT false
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS exchange_records (
    id serial PRIMARY KEY,
    uid text NOT NULL,
    username text NOT NULL DEFAULT '',
    pi_amount numeric NOT NULL,
    coins_awarded bigint NOT NULL,
    payment_id text NOT NULL UNIQUE,
    txid text NOT NULL DEFAULT '',
    status text NOT NULL,
    created_at bigint NOT NULL
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS admin_actions (
    id serial PRIMARY KEY,
    admin_username text NOT NULL,
    target_uid text NOT NULL,
    target_username text NOT NULL DEFAULT '',
    action_type text NOT NULL,
    coin_type text NOT NULL,
    amount bigint NOT NULL,
    note text NOT NULL DEFAULT '',
    created_at bigint NOT NULL
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS feedback_items (
    id serial PRIMARY KEY,
    uid text NOT NULL,
    username text NOT NULL DEFAULT '',
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new',
    created_at bigint NOT NULL
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS announcements (
    id serial PRIMARY KEY,
    title text NOT NULL,
    body text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at bigint NOT NULL
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS machines (
    slot_id text PRIMARY KEY,
    zone text NOT NULL,
    enabled boolean NOT NULL DEFAULT true,
    note text NOT NULL DEFAULT ''
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS admin_accounts (
    email text PRIMARY KEY,
    password_hash text NOT NULL DEFAULT '',
    salt text NOT NULL DEFAULT '',
    created_at bigint NOT NULL,
    updated_at bigint NOT NULL
  )`)
  await p.query(`CREATE TABLE IF NOT EXISTS admin_sessions (
    token text PRIMARY KEY,
    email text NOT NULL,
    created_at bigint NOT NULL,
    expires_at bigint NOT NULL
  )`)
}

export async function db(): Promise<Pool> {
  const p = getPool()
  if (!schemaReady) {
    schemaReady = ensureSchema(p).catch((err) => {
      schemaReady = null
      throw err
    })
  }
  await schemaReady
  return p
}
