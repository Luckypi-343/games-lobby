// Real, persistent per-player storage backing pi.userState. Every request
// must prove the caller really is the Pi user it claims to be (via a fresh
// Pi accessToken checked against Pi's own /v2/me endpoint) before touching
// that uid's row — this is what makes it safe to keep this data in a
// database shared by every player instead of a single local browser.
import { db } from "@/lib/db"
import { verifyPiToken } from "@/lib/pi-server"

const KEY_RE = /^[a-z0-9._-]{1,64}$/

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const { action, uid, accessToken, key, value } = body ?? {}
  if (typeof uid !== "string" || !uid || typeof accessToken !== "string" || !accessToken) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const verified = await verifyPiToken(accessToken)
  if (!verified || verified.uid !== uid) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  let pool
  try {
    pool = await db()
  } catch (err) {
    console.log("[v0] state route: database not ready:", err)
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  try {
    if (action === "get") {
      if (typeof key !== "string" || !KEY_RE.test(key)) {
        return Response.json({ error: "invalid_key" }, { status: 400 })
      }
      const r = await pool.query("SELECT blob, version, updated_at FROM user_state WHERE uid=$1 AND key=$2", [
        uid,
        key,
      ])
      if (r.rows.length === 0) return Response.json({ record: null })
      const row = r.rows[0]
      return Response.json({ record: { blob: row.blob, version: row.version, updatedAt: Number(row.updated_at) } })
    }

    if (action === "set") {
      if (typeof key !== "string" || !KEY_RE.test(key)) {
        return Response.json({ error: "invalid_key" }, { status: 400 })
      }
      const json = JSON.stringify(value ?? {})
      if (json.length > 64_000) {
        return Response.json({ error: "value_too_large" }, { status: 413 })
      }
      const now = Date.now()
      await pool.query(
        `INSERT INTO user_state (uid, key, blob, version, updated_at) VALUES ($1,$2,$3::jsonb,1,$4)
         ON CONFLICT (uid, key) DO UPDATE SET blob=$3::jsonb, version=user_state.version+1, updated_at=$4`,
        [uid, key, json, now],
      )
      await pool.query(
        `INSERT INTO players (uid, username, first_seen, last_seen) VALUES ($1,$2,$3,$3)
         ON CONFLICT (uid) DO UPDATE SET username=$2, last_seen=$3`,
        [uid, verified.username, now],
      )
      return Response.json({ ok: true })
    }

    if (action === "delete") {
      if (typeof key !== "string" || !KEY_RE.test(key)) {
        return Response.json({ error: "invalid_key" }, { status: 400 })
      }
      await pool.query("DELETE FROM user_state WHERE uid=$1 AND key=$2", [uid, key])
      return Response.json({ ok: true })
    }

    if (action === "keys") {
      const r = await pool.query("SELECT key FROM user_state WHERE uid=$1 ORDER BY key", [uid])
      return Response.json({ keys: r.rows.map((row: any) => row.key as string) })
    }

    return Response.json({ error: "invalid_action" }, { status: 400 })
  } catch (err) {
    console.log("[v0] state route error:", action, err)
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
