// Every action the hidden admin control panel can take goes through this
// one route. Every request must prove (via a fresh Pi accessToken) that the
// caller is really signed in as one of the usernames listed in the
// ADMIN_PI_USERNAMES setting — never trust a client-claimed "isAdmin" flag.
import { db } from "@/lib/db"
import { verifySessionToken } from "@/lib/admin/auth"
import { MACHINES } from "@/lib/luckypi/data"

const KEY_RE = /^[a-z0-9._-]{1,64}$/
const WALLET_KEY = "luckypi.wallet"

async function requireAdmin(email: unknown, token: unknown): Promise<{ email: string } | null> {
  const verifiedEmail = await verifySessionToken(token)
  if (!verifiedEmail) return null
  if (typeof email === "string" && email && email.trim().toLowerCase() !== verifiedEmail) return null
  return { email: verifiedEmail }
}

function readWallet(blob: unknown): { trialCoins: number; piCoins: number } {
  const b = blob && typeof blob === "object" ? (blob as any) : {}
  const trialCoins = Number.isFinite(b.trialCoins) ? Math.max(0, Math.floor(b.trialCoins)) : 0
  const piCoins = Number.isFinite(b.piCoins) ? Math.max(0, Math.floor(b.piCoins)) : 0
  return { trialCoins, piCoins }
}

export async function POST(req: Request) {
  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "invalid_body" }, { status: 400 })
  }

  const { action, email, token } = body ?? {}
  const admin = await requireAdmin(email, token)
  if (!admin) return Response.json({ error: "unauthorized" }, { status: 401 })

  let pool
  try {
    pool = await db()
  } catch (err) {
    console.log("[v0] admin route: database not ready:", err)
    return Response.json({ error: "server_not_configured" }, { status: 500 })
  }

  try {
    if (action === "verify") {
      return Response.json({ ok: true, username: admin.email })
    }

    if (action === "overview") {
      const [players, wallets, exchanges, feedbackNew] = await Promise.all([
        pool.query("SELECT COUNT(*)::int AS n FROM players"),
        pool.query(
          "SELECT COALESCE(SUM((blob->>'piCoins')::numeric),0) AS pi_coins, COALESCE(SUM((blob->>'trialCoins')::numeric),0) AS trial_coins FROM user_state WHERE key=$1",
          [WALLET_KEY],
        ),
        pool.query(
          "SELECT COUNT(*)::int AS n, COALESCE(SUM(pi_amount),0) AS pi_total, COALESCE(SUM(coins_awarded),0) AS coins_total FROM exchange_records WHERE status='completed'",
        ),
        pool.query("SELECT COUNT(*)::int AS n FROM feedback_items WHERE status='new'"),
      ])
      return Response.json({
        playerCount: players.rows[0].n,
        totalPiCoins: Number(wallets.rows[0].pi_coins),
        totalTrialCoins: Number(wallets.rows[0].trial_coins),
        exchangeCount: exchanges.rows[0].n,
        exchangePiTotal: Number(exchanges.rows[0].pi_total),
        exchangeCoinsTotal: Number(exchanges.rows[0].coins_total),
        newFeedbackCount: feedbackNew.rows[0].n,
      })
    }

    if (action === "players") {
      const search = typeof body.search === "string" ? body.search.trim().slice(0, 64) : ""
      const params: any[] = []
      let where = ""
      if (search) {
        params.push(`%${search.toLowerCase()}%`)
        where = "WHERE LOWER(p.username) LIKE $1 OR LOWER(p.uid) LIKE $1"
      }
      const r = await pool.query(
        `SELECT p.uid, p.username, p.first_seen, p.last_seen, p.banned,
                COALESCE((w.blob->>'piCoins')::numeric,0) AS pi_coins,
                COALESCE((w.blob->>'trialCoins')::numeric,0) AS trial_coins
         FROM players p
         LEFT JOIN user_state w ON w.uid = p.uid AND w.key = '${WALLET_KEY}'
         ${where}
         ORDER BY p.last_seen DESC
         LIMIT 200`,
        params,
      )
      return Response.json({
        items: r.rows.map((row: any) => ({
          uid: row.uid,
          username: row.username,
          firstSeen: Number(row.first_seen),
          lastSeen: Number(row.last_seen),
          banned: !!row.banned,
          piCoins: Number(row.pi_coins),
          trialCoins: Number(row.trial_coins),
        })),
      })
    }

    if (action === "player_detail") {
      const targetUid = typeof body.targetUid === "string" ? body.targetUid : ""
      if (!targetUid) return Response.json({ error: "invalid_target" }, { status: 400 })
      const [playerR, walletR, exchR, actionsR, feedbackR] = await Promise.all([
        pool.query("SELECT uid, username, first_seen, last_seen, banned FROM players WHERE uid=$1", [targetUid]),
        pool.query("SELECT blob FROM user_state WHERE uid=$1 AND key=$2", [targetUid, WALLET_KEY]),
        pool.query(
          "SELECT id, pi_amount, coins_awarded, payment_id, status, created_at FROM exchange_records WHERE uid=$1 ORDER BY created_at DESC LIMIT 30",
          [targetUid],
        ),
        pool.query(
          "SELECT id, admin_username, action_type, coin_type, amount, note, created_at FROM admin_actions WHERE target_uid=$1 ORDER BY created_at DESC LIMIT 30",
          [targetUid],
        ),
        pool.query(
          "SELECT id, message, status, created_at FROM feedback_items WHERE uid=$1 ORDER BY created_at DESC LIMIT 20",
          [targetUid],
        ),
      ])
      if (playerR.rows.length === 0) return Response.json({ error: "not_found" }, { status: 404 })
      const player = playerR.rows[0]
      const wallet = readWallet(walletR.rows[0]?.blob)
      return Response.json({
        player: {
          uid: player.uid,
          username: player.username,
          firstSeen: Number(player.first_seen),
          lastSeen: Number(player.last_seen),
          banned: !!player.banned,
        },
        wallet,
        exchanges: exchR.rows.map((row: any) => ({
          id: row.id,
          piAmount: Number(row.pi_amount),
          coinsAwarded: Number(row.coins_awarded),
          paymentId: row.payment_id,
          status: row.status,
          createdAt: Number(row.created_at),
        })),
        adminActions: actionsR.rows.map((row: any) => ({
          id: row.id,
          adminUsername: row.admin_username,
          actionType: row.action_type,
          coinType: row.coin_type,
          amount: Number(row.amount),
          note: row.note,
          createdAt: Number(row.created_at),
        })),
        feedback: feedbackR.rows.map((row: any) => ({
          id: row.id,
          message: row.message,
          status: row.status,
          createdAt: Number(row.created_at),
        })),
      })
    }

    if (action === "adjust_wallet") {
      const targetUid = typeof body.targetUid === "string" ? body.targetUid : ""
      const coinType = body.coinType === "trialCoins" ? "trialCoins" : "piCoins"
      const amount = Math.trunc(Number(body.amount))
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 200) : ""
      if (!targetUid || !Number.isFinite(amount) || amount === 0) {
        return Response.json({ error: "invalid_input" }, { status: 400 })
      }
      if (Math.abs(amount) > 100_000_000) {
        return Response.json({ error: "amount_too_large" }, { status: 400 })
      }
      const existingR = await pool.query("SELECT blob, username FROM user_state u WHERE uid=$1 AND key=$2", [
        targetUid,
        WALLET_KEY,
      ])
      const playerR = await pool.query("SELECT username FROM players WHERE uid=$1", [targetUid])
      if (playerR.rows.length === 0) return Response.json({ error: "not_found" }, { status: 404 })
      const wallet = readWallet(existingR.rows[0]?.blob)
      const nextValue = Math.max(0, wallet[coinType] + amount)
      const nextWallet = { ...wallet, [coinType]: nextValue }
      const now = Date.now()
      await pool.query(
        `INSERT INTO user_state (uid, key, blob, version, updated_at) VALUES ($1,$2,$3::jsonb,1,$4)
         ON CONFLICT (uid, key) DO UPDATE SET blob=$3::jsonb, version=user_state.version+1, updated_at=$4`,
        [targetUid, WALLET_KEY, JSON.stringify(nextWallet), now],
      )
      await pool.query(
        `INSERT INTO admin_actions (admin_username, target_uid, target_username, action_type, coin_type, amount, note, created_at)
         VALUES ($1,$2,$3,'adjust_wallet',$4,$5,$6,$7)`,
        [admin.email, targetUid, playerR.rows[0].username, coinType, amount, note, now],
      )
      return Response.json({ ok: true, wallet: nextWallet })
    }

    if (action === "list_exchanges") {
      const r = await pool.query(
        "SELECT id, uid, username, pi_amount, coins_awarded, payment_id, status, created_at FROM exchange_records ORDER BY created_at DESC LIMIT 100",
      )
      return Response.json({
        items: r.rows.map((row: any) => ({
          id: row.id,
          uid: row.uid,
          username: row.username,
          piAmount: Number(row.pi_amount),
          coinsAwarded: Number(row.coins_awarded),
          paymentId: row.payment_id,
          status: row.status,
          createdAt: Number(row.created_at),
        })),
      })
    }

    if (action === "list_machines") {
      const overridesR = await pool.query("SELECT slot_id, enabled, note FROM machines")
      const overrides = new Map(overridesR.rows.map((row: any) => [row.slot_id, { enabled: row.enabled, note: row.note }]))
      return Response.json({
        items: MACHINES.map((m) => ({
          id: m.id,
          name: m.name,
          category: m.category,
          tier: m.tier,
          enabled: overrides.get(m.id)?.enabled ?? true,
          note: overrides.get(m.id)?.note ?? "",
        })),
      })
    }

    if (action === "toggle_machine") {
      const slotId = typeof body.slotId === "string" ? body.slotId : ""
      const enabled = !!body.enabled
      const note = typeof body.note === "string" ? body.note.trim().slice(0, 200) : ""
      const machine = MACHINES.find((m) => m.id === slotId)
      if (!machine) return Response.json({ error: "invalid_machine" }, { status: 400 })
      await pool.query(
        `INSERT INTO machines (slot_id, zone, enabled, note) VALUES ($1,$2,$3,$4)
         ON CONFLICT (slot_id) DO UPDATE SET enabled=$3, note=$4`,
        [slotId, machine.category, enabled, note],
      )
      return Response.json({ ok: true })
    }

    if (action === "list_announcements") {
      const r = await pool.query(
        "SELECT id, title, body, active, created_at FROM announcements ORDER BY created_at DESC LIMIT 50",
      )
      return Response.json({
        items: r.rows.map((row: any) => ({
          id: row.id,
          title: row.title,
          body: row.body,
          active: !!row.active,
          createdAt: Number(row.created_at),
        })),
      })
    }

    if (action === "save_announcement") {
      const title = typeof body.title === "string" ? body.title.trim().slice(0, 100) : ""
      const text = typeof body.body === "string" ? body.body.trim().slice(0, 800) : ""
      const active = body.active !== false
      const id = Number.isFinite(body.id) ? Math.trunc(body.id) : null
      if (!title || !text) return Response.json({ error: "invalid_input" }, { status: 400 })
      if (id) {
        await pool.query("UPDATE announcements SET title=$1, body=$2, active=$3 WHERE id=$4", [
          title,
          text,
          active,
          id,
        ])
      } else {
        await pool.query(
          "INSERT INTO announcements (title, body, active, created_at) VALUES ($1,$2,$3,$4)",
          [title, text, active, Date.now()],
        )
      }
      return Response.json({ ok: true })
    }

    if (action === "delete_announcement") {
      const id = Number.isFinite(body.id) ? Math.trunc(body.id) : null
      if (!id) return Response.json({ error: "invalid_input" }, { status: 400 })
      await pool.query("DELETE FROM announcements WHERE id=$1", [id])
      return Response.json({ ok: true })
    }

    if (action === "list_feedback") {
      const statusFilter = typeof body.status === "string" ? body.status : ""
      const params: any[] = []
      let where = ""
      if (statusFilter) {
        params.push(statusFilter)
        where = "WHERE status=$1"
      }
      const r = await pool.query(
        `SELECT id, uid, username, message, status, created_at FROM feedback_items ${where} ORDER BY created_at DESC LIMIT 100`,
        params,
      )
      return Response.json({
        items: r.rows.map((row: any) => ({
          id: row.id,
          uid: row.uid,
          username: row.username,
          message: row.message,
          status: row.status,
          createdAt: Number(row.created_at),
        })),
      })
    }

    if (action === "update_feedback_status") {
      const id = Number.isFinite(body.id) ? Math.trunc(body.id) : null
      const status = typeof body.status === "string" ? body.status : ""
      if (!id || !["new", "read", "resolved"].includes(status)) {
        return Response.json({ error: "invalid_input" }, { status: 400 })
      }
      await pool.query("UPDATE feedback_items SET status=$1 WHERE id=$2", [status, id])
      return Response.json({ ok: true })
    }

    if (action === "actions_log") {
      const r = await pool.query(
        "SELECT id, admin_username, target_uid, target_username, action_type, coin_type, amount, note, created_at FROM admin_actions ORDER BY created_at DESC LIMIT 100",
      )
      return Response.json({
        items: r.rows.map((row: any) => ({
          id: row.id,
          adminUsername: row.admin_username,
          targetUid: row.target_uid,
          targetUsername: row.target_username,
          actionType: row.action_type,
          coinType: row.coin_type,
          amount: Number(row.amount),
          note: row.note,
          createdAt: Number(row.created_at),
        })),
      })
    }

    return Response.json({ error: "invalid_action" }, { status: 400 })
  } catch (err) {
    console.log("[v0] admin route error:", action, err)
    return Response.json({ error: "server_error" }, { status: 500 })
  }
}
