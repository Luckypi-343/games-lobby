// Stores a player's feedback/rating so it shows up in the admin control
// panel. Requires a verified Pi session so we know who really sent it.
import { db } from "@/lib/db"
import { verifyPiToken } from "@/lib/pi-server"

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const { uid, accessToken, message, rating, contact } = body ?? {}
  if (typeof uid !== "string" || !uid || typeof accessToken !== "string" || !accessToken) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }
  const verified = await verifyPiToken(accessToken)
  if (!verified || verified.uid !== uid) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const text = typeof message === "string" ? message.trim().slice(0, 500) : ""
  if (!text) return Response.json({ error: "empty_message" }, { status: 400 })
  const ratingNum = Number.isFinite(rating) ? Math.min(5, Math.max(1, Math.round(rating))) : 0
  const contactText = typeof contact === "string" ? contact.trim().slice(0, 200) : ""

  const parts = [`【評分】${ratingNum || "—"} / 5`]
  if (contactText) parts.push(`【聯絡方式】${contactText}`)
  parts.push(`【內容】${text}`)
  const stored = parts.join("\n")

  try {
    const pool = await db()
    const now = Date.now()
    await pool.query(
      `INSERT INTO feedback_items (uid, username, message, status, created_at) VALUES ($1,$2,$3,'new',$4)`,
      [uid, verified.username, stored, now],
    )
    return Response.json({ ok: true })
  } catch (err) {
    console.log("[v0] feedback route error:", err)
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
