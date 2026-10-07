// Server-side completion step of the real Pi payment flow. Pi's client SDK
// calls this once the transaction is on the blockchain; this route calls the
// genuine Pi Platform API to mark the payment complete.
export async function POST(req: Request) {
  const apiKey = process.env.PI_API_KEY
  if (!apiKey) {
    console.log("[v0] Pi payment complete: PI_API_KEY is not configured")
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  let paymentId: unknown
  let txid: unknown
  try {
    const body = await req.json()
    paymentId = body?.paymentId
    txid = body?.txid
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  if (typeof paymentId !== "string" || !paymentId || typeof txid !== "string" || !txid) {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  try {
    const res = await fetch(`https://api.minepi.com/v2/payments/${paymentId}/complete`, {
      method: "POST",
      headers: { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ txid }),
    })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      console.log("[v0] Pi payment complete failed:", res.status, text)
      return Response.json({ error: "complete_failed" }, { status: 502 })
    }
    return Response.json({ ok: true })
  } catch (err) {
    console.log("[v0] Pi payment complete request error:", err)
    return Response.json({ error: "complete_failed" }, { status: 502 })
  }
}
