// Public read of the announcements the admin has published. No login is
// required to read these — they're the same for every player.
import { db } from "@/lib/db"
import { ANNOUNCEMENTS as FALLBACK } from "@/lib/luckypi/data"

export async function GET() {
  try {
    const pool = await db()
    const r = await pool.query(
      "SELECT id, title, body, created_at FROM announcements WHERE active=true ORDER BY created_at DESC LIMIT 30",
    )
    if (r.rows.length === 0) {
      return Response.json({ items: FALLBACK })
    }
    const items = r.rows.map((row: any) => ({
      id: String(row.id),
      icon: "📢",
      tag: "公告",
      title: row.title as string,
      body: row.body as string,
      date: new Date(Number(row.created_at)).toISOString().slice(0, 10),
    }))
    return Response.json({ items })
  } catch (err) {
    console.log("[v0] announcements route error:", err)
    return Response.json({ items: FALLBACK })
  }
}
