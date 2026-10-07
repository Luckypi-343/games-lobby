// Thin client for the hidden admin control panel. Every call is verified
// server-side against a signed-in admin session before anything is read
// or changed — this file never trusts anything on its own.
export type AdminOverview = {
  playerCount: number
  totalPiCoins: number
  totalTrialCoins: number
  exchangeCount: number
  exchangePiTotal: number
  exchangeCoinsTotal: number
  newFeedbackCount: number
}

export type AdminPlayer = {
  uid: string
  username: string
  firstSeen: number
  lastSeen: number
  banned: boolean
  piCoins: number
  trialCoins: number
}

export type AdminPlayerDetail = {
  player: { uid: string; username: string; firstSeen: number; lastSeen: number; banned: boolean }
  wallet: { trialCoins: number; piCoins: number }
  exchanges: { id: number; piAmount: number; coinsAwarded: number; paymentId: string; status: string; createdAt: number }[]
  adminActions: {
    id: number
    adminUsername: string
    actionType: string
    coinType: string
    amount: number
    note: string
    createdAt: number
  }[]
  feedback: { id: number; message: string; status: string; createdAt: number }[]
}

export type AdminExchange = {
  id: number
  uid: string
  username: string
  piAmount: number
  coinsAwarded: number
  paymentId: string
  status: string
  createdAt: number
}

export type AdminMachine = {
  id: string
  name: string
  category: string
  tier: string
  enabled: boolean
  note: string
}

export type AdminAnnouncement = { id: number; title: string; body: string; active: boolean; createdAt: number }

export type AdminFeedback = { id: number; uid: string; username: string; message: string; status: string; createdAt: number }

export type Session = { email: string; token: string }

async function call<T = any>(session: Session, action: string, extra: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/api/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, email: session.email, token: session.token, ...extra }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) {
    const err = new Error((data && data.error) || "request_failed")
    throw err
  }
  return data as T
}

async function callAuth<T = any>(action: string, extra: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch("/api/admin-auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, ...extra }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) {
    const err = new Error((data && data.error) || "request_failed")
    throw err
  }
  return data as T
}

export const adminAuthApi = {
  status: (email: string) => callAuth<{ ok: true; hasPassword: boolean }>("status", { email }),
  setPassword: (email: string, password: string) =>
    callAuth<{ ok: true; token: string; email: string }>("set_password", { email, password }),
  login: (email: string, password: string) =>
    callAuth<{ ok: true; token: string; email: string }>("login", { email, password }),
  logout: (token: string) => callAuth<{ ok: true }>("logout", { token }).catch(() => undefined),
}

export const adminApi = {
  verify: (s: Session) => call<{ ok: true; username: string }>(s, "verify"),
  overview: (s: Session) => call<AdminOverview>(s, "overview"),
  players: (s: Session, search?: string) => call<{ items: AdminPlayer[] }>(s, "players", { search }),
  playerDetail: (s: Session, targetUid: string) => call<AdminPlayerDetail>(s, "player_detail", { targetUid }),
  adjustWallet: (s: Session, targetUid: string, coinType: "piCoins" | "trialCoins", amount: number, note: string) =>
    call<{ ok: true; wallet: { trialCoins: number; piCoins: number } }>(s, "adjust_wallet", {
      targetUid,
      coinType,
      amount,
      note,
    }),
  listExchanges: (s: Session) => call<{ items: AdminExchange[] }>(s, "list_exchanges"),
  listMachines: (s: Session) => call<{ items: AdminMachine[] }>(s, "list_machines"),
  toggleMachine: (s: Session, slotId: string, enabled: boolean, note: string) =>
    call<{ ok: true }>(s, "toggle_machine", { slotId, enabled, note }),
  listAnnouncements: (s: Session) => call<{ items: AdminAnnouncement[] }>(s, "list_announcements"),
  saveAnnouncement: (s: Session, input: { id?: number; title: string; body: string; active: boolean }) =>
    call<{ ok: true }>(s, "save_announcement", input),
  deleteAnnouncement: (s: Session, id: number) => call<{ ok: true }>(s, "delete_announcement", { id }),
  listFeedback: (s: Session, status?: string) => call<{ items: AdminFeedback[] }>(s, "list_feedback", { status }),
  updateFeedbackStatus: (s: Session, id: number, status: string) =>
    call<{ ok: true }>(s, "update_feedback_status", { id, status }),
  actionsLog: (s: Session) =>
    call<{
      items: {
        id: number
        adminUsername: string
        targetUid: string
        targetUsername: string
        actionType: string
        coinType: string
        amount: number
        note: string
        createdAt: number
      }[]
    }>(s, "actions_log"),
}
