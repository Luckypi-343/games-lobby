// Server-side completion + crediting for the Pi → pi玩幣 exchange. This is
// the only place coins are ever granted for an exchange, and it only runs
// after: (1) the caller's Pi session is verified against Pi's own identity
// API, and (2) Pi's official payment-complete endpoint has confirmed the
// blockchain transaction. The unique constraint on payment_id guarantees a
// given real payment can only ever be credited once, even if this route is
// called twice for the same payment.
import { db } from "@/lib/db"
import { verifyPiToken } from "@/lib/pi-server"

const COINS_PER_PI = 10000
const MAX_PI_AMOUNT = 100000

export async function POST(req: Request) {
  const apiKey = process.env.PI_API_KEY
  if (!apiKey) {
    console.log("[v0] exchange complete: PI_API_KEY is not configured")
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const { uid, accessToken, paymentId, txid, amount } = body ?? {}
  if (typeof uid !== "string" || !uid || typeof accessToken !== "string" || !accessToken) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }
  if (typeof paymentId !== "string" || !paymentId || typeof txid !== "string" || !txid) {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }
  const piAmount = Number(amount)
  if (!Number.isFinite(piAmount) || piAmount <= 0 || piAmount > MAX_PI_AMOUNT) {
    return Response.json({ error: "invalid_amount" }, { status: 400 })
  }

  const verified = await verifyPiToken(accessToken)
  if (!verified || verified.uid !== uid) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ txid }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.log("[v0] exchange complete: Pi complete failed:", res.status, text)
      return Response.json({ error: "complete_failed" }, { status: 502 })
    }
  } catch (err) {
    console.log("[v0] exchange complete: Pi complete request error:", err)
    return Response.json({ error: "complete_failed" }, { status: 502 })
  }

  let pool
  try {
    pool = await db()
  } catch (err) {
    console.log("[v0] exchange complete: database not ready:", err)
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  const coinsAwarded = Math.round(piAmount * COINS_PER_PI)
  const now = Date.now()
  try {
    const r = await pool.query(
      `INSERT INTO exchange_records (uid, username, pi_amount, coins_awarded, payment_id, txid, status, created_at)
       VALUES ($1,$2,$3,$4,$5,$6,'completed',$7)
       ON CONFLICT (payment_id) DO NOTHING
       RETURNING id`,
      [uid, verified.username, piAmount, coinsAwarded, paymentId, txid, now],
    )
    const credited = r.rows.length > 0
    await pool.query(
      `INSERT INTO players (uid, username, first_seen, last_seen) VALUES ($1,$2,$3,$3)
       ON CONFLICT (uid) DO UPDATE SET username=$2, last_seen=$3`,
      [uid, verified.username, now],
    )
    return Response.json({ ok: true, credited, coinsAwarded })
  } catch (err) {
    console.log("[v0] exchange complete: db insert error:", err)
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
