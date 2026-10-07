// Public read of which machines the admin has taken offline. No login
// required — every player sees the same open/closed machines.
import { db } from "@/lib/db"

export async function GET() {
  try {
    const pool = await db()
    const r = await pool.query("SELECT slot_id FROM machines WHERE enabled=false")
    return Response.json({ disabled: r.rows.map((row: any) => row.slot_id as string) })
  } catch (err) {
    console.log("[v0] machines route error:", err)
    return Response.json({ disabled: [] })
  }
}
