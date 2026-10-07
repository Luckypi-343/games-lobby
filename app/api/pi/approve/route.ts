// Server-side approval step of the real Pi payment flow. Pi's client SDK
// calls this once the user has authorized a payment; this route calls the
// genuine Pi Platform API to approve it before Pi will move funds.
export async function POST(req: Request) {
  const apiKey = process.env.PI_API_KEY
  if (!apiKey) {
    console.log("[v0] Pi payment approve: PI_API_KEY is not configured")
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  let paymentId: unknown
  try {
    const body = await req.json()
    paymentId = body?.paymentId
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  if (typeof paymentId !== "string" || !paymentId) {
    return Response.json({ error: "invalid_payment_id" }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {
      method: "POST",
      headers: { Authorization: `Key ${apiKey}` },
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.log("[v0] Pi payment approve failed:", res.status, text)
      return Response.json({ error: "approve_failed" }, { status: 502 })
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.log("[v0] Pi payment approve request error:", err)
    return Response.json({ error: "approve_failed" }, { status: 502 })
  }
}
