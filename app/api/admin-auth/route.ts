// Email + password sign-in for the hidden admin control panel. Only the
// two email addresses in lib/admin/auth.ts (ADMIN_EMAILS) can ever hold an
// account here — everyone else is rejected before any database work
// happens. The first sign-in for an allowed email sets its password; every
// sign-in after that must match it.
import { db } from "@/lib/db"
import { getAccountStatus, setInitialPassword, login, deleteSession } from "@/lib/admin/auth"

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const { action, email, password, token } = body ?? {}

  try {
    await db()
  } catch (err) {
    console.log("[v0] admin-auth route: database not ready:", err)
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  try {
    if (action === "status") {
      if (typeof email !== "string" || !email) return Response.json({ error: "invalid_input" }, { status: 400 })
      const status = await getAccountStatus(email)
      if (!status.allowed) return Response.json({ error: "not_allowed" }, { status: 403 })
      return Response.json({ ok: true, hasPassword: status.hasPassword })
    }

    if (action === "set_password") {
      if (typeof email !== "string" || typeof password !== "string") {
        return Response.json({ error: "invalid_input" }, { status: 400 })
      }
      const result = await setInitialPassword(email, password)
      if (!result.ok) return Response.json({ error: result.error }, { status: 400 })
      return Response.json({ ok: true, token: result.token, email: result.email })
    }

    if (action === "login") {
      if (typeof email !== "string" || typeof password !== "string") {
        return Response.json({ error: "invalid_input" }, { status: 400 })
      }
      const result = await login(email, password)
      if (!result.ok) return Response.json({ error: result.error }, { status: 401 })
      return Response.json({ ok: true, token: result.token, email: result.email })
    }

    if (action === "logout") {
      await deleteSession(token)
      return Response.json({ ok: true })
    }

    return Response.json({ error: "invalid_action" }, { status: 400 })
  } catch (err) {
    console.log("[v0] admin-auth route error:", action, err)
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
