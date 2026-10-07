"use client"

import { useEffect, useState } from "react"
import {
  adminApi,
  type AdminAnnouncement,
  type AdminExchange,
  type AdminFeedback,
  type AdminMachine,
  type AdminOverview,
  type AdminPlayer,
  type AdminPlayerDetail,
} from "@/lib/admin/client"
import { CATEGORIES, COINS_PER_PI } from "@/lib/luckypi/data"
import {
  Button,
  Card,
  EmptyState,
  Field,
  IconCheck,
  IconPlus,
  IconSearch,
  IconTrash,
  Pill,
  StatTile,
  inputClass,
} from "@/components/admin/ui"

type Session = { email: string; token: string }

function fmtNum(n: number): string {
  return Math.round(n).toLocaleString("zh-Hant")
}
function fmtDate(ms: number): string {
  if (!ms) return "—"
  return new Date(ms).toLocaleString("zh-Hant-TW", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
}
function shortUid(uid: string): string {
  return uid.length > 10 ? `${uid.slice(0, 6)}…${uid.slice(-4)}` : uid
}

function Loading() {
  return (
    <div className="flex justify-center py-10">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function ErrorNote({ message }: { message: string }) {
  return <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{message}</p>
}

// --------------------------------------------------------------------------
// 主頁
// --------------------------------------------------------------------------
export function OverviewSection({ session, onGoTab }: { session: Session; onGoTab: (tab: string) => void }) {
  const [data, setData] = useState<AdminOverview | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    adminApi
      .overview(session)
      .then((res) => !cancelled && setData(res))
      .catch(() => !cancelled && setError("讀取總覽資料失敗"))
    return () => {
      cancelled = true
    }
  }, [session])

  if (error) return <ErrorNote message={error} />
  if (!data) return <Loading />

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <StatTile label="累積玩家數" value={fmtNum(data.playerCount)} />
        <StatTile label="待處理反饋" value={fmtNum(data.newFeedbackCount)} />
        <StatTile label="流通 pi玩幣" value={fmtNum(data.totalPiCoins)} tone="gold" />
        <StatTile label="流通試玩幣" value={fmtNum(data.totalTrialCoins)} />
        <StatTile label="累積兌換次數" value={fmtNum(data.exchangeCount)} />
        <StatTile label="累積兌換 Pi" value={data.exchangePiTotal.toFixed(4)} />
      </div>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          兌換比率：1 Pi = {fmtNum(COINS_PER_PI)} 遊戲幣。累積已兌出 {fmtNum(data.exchangeCoinsTotal)} 枚 pi玩幣。
        </p>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        {[
          { id: "players", label: "查看玩家" },
          { id: "exchanges", label: "兌換紀錄" },
          { id: "machines", label: "機台控管" },
          { id: "feedback", label: "玩家反饋" },
        ].map((b) => (
          <Button key={b.id} variant="outline" onClick={() => onGoTab(b.id)}>
            {b.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// 玩家訊息
// --------------------------------------------------------------------------
export function PlayersSection({
  session,
  onSelectPlayer,
}: {
  session: Session
  onSelectPlayer: (uid: string) => void
}) {
  const [items, setItems] = useState<AdminPlayer[] | null>(null)
  const [search, setSearch] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    setError("")
    const t = setTimeout(() => {
      adminApi
        .players(session, search)
        .then((res) => !cancelled && setItems(res.items))
        .catch(() => !cancelled && setError("讀取玩家清單失敗"))
    }, 250)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [session, search])

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜尋玩家名稱或 UID"
          className={`${inputClass} pl-9`}
        />
      </div>
      {error && <ErrorNote message={error} />}
      {!items && !error && <Loading />}
      {items && items.length === 0 && <EmptyState>目前沒有符合的玩家</EmptyState>}
      {items && items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((p) => (
            <button
              key={p.uid}
              onClick={() => onSelectPlayer(p.uid)}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-left active:scale-[0.99]"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-foreground">{p.username || "（未知）"}</span>
                <span className="text-xs text-muted-foreground">{shortUid(p.uid)} · 最後上線 {fmtDate(p.lastSeen)}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Pill tone="gold">{fmtNum(p.piCoins)} pi幣</Pill>
                {p.banned && <Pill tone="red">已停權</Pill>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// 玩家資料
// --------------------------------------------------------------------------
export function PlayerDetailSection({
  session,
  uid,
  adminUsername,
}: {
  session: Session
  uid: string
  adminUsername: string
}) {
  const [detail, setDetail] = useState<AdminPlayerDetail | null>(null)
  const [error, setError] = useState("")
  const [coinType, setCoinType] = useState<"piCoins" | "trialCoins">("piCoins")
  const [amount, setAmount] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState("")

  const load = () => {
    setError("")
    adminApi
      .playerDetail(session, uid)
      .then(setDetail)
      .catch(() => setError("讀取玩家資料失敗"))
  }

  useEffect(load, [session, uid])

  const submitAdjust = async (sign: 1 | -1) => {
    const n = Math.trunc(Number(amount))
    if (!Number.isFinite(n) || n <= 0) {
      setNotice("請輸入正確的數量")
      return
    }
    setBusy(true)
    setNotice("")
    try {
      await adminApi.adjustWallet(session, uid, coinType, n * sign, note)
      setAmount("")
      setNote("")
      setNotice(sign > 0 ? "已加值完成" : "已扣除完成")
      load()
    } catch {
      setNotice("操作失敗，請再試一次")
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorNote message={error} />
  if (!detail) return <Loading />

  return (
    <div className="flex flex-col gap-4">
      <Card className="p-4">
        <p className="text-base font-bold text-foreground">{detail.player.username || "（未知玩家）"}</p>
        <p className="mt-0.5 break-all text-xs text-muted-foreground">{detail.player.uid}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          首次登入 {fmtDate(detail.player.firstSeen)} · 最後上線 {fmtDate(detail.player.lastSeen)}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="pi玩幣" value={fmtNum(detail.wallet.piCoins)} tone="gold" />
        <StatTile label="試玩幣" value={fmtNum(detail.wallet.trialCoins)} />
      </div>

      <Card className="flex flex-col gap-3 p-4">
        <p className="text-sm font-semibold text-foreground">加值 / 扣除遊戲幣</p>
        <div className="flex gap-2">
          {(["piCoins", "trialCoins"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCoinType(c)}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                coinType === c ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {c === "piCoins" ? "pi玩幣" : "試玩幣"}
            </button>
          ))}
        </div>
        <Field label="數量">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="numeric"
            placeholder="請輸入數量"
            className={inputClass}
          />
        </Field>
        <Field label="備註（選填）">
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="例如：客服補償" className={inputClass} />
        </Field>
        {notice && <p className="text-xs text-muted-foreground">{notice}</p>}
        <div className="flex gap-2">
          <Button variant="primary" block disabled={busy} onClick={() => submitAdjust(1)}>
            加值
          </Button>
          <Button variant="danger" block disabled={busy} onClick={() => submitAdjust(-1)}>
            扣除
          </Button>
        </div>
      </Card>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">兌換紀錄</p>
        {detail.exchanges.length === 0 ? (
          <EmptyState>尚無兌換紀錄</EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {detail.exchanges.map((e) => (
              <Card key={e.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm text-foreground">{e.piAmount} Pi → {fmtNum(e.coinsAwarded)} 枚</p>
                  <p className="text-xs text-muted-foreground">{fmtDate(e.createdAt)}</p>
                </div>
                <Pill tone={e.status === "completed" ? "jade" : "neutral"}>{e.status}</Pill>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">管理員操作紀錄</p>
        {detail.adminActions.length === 0 ? (
          <EmptyState>尚無管理員操作紀錄</EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {detail.adminActions.map((a) => (
              <Card key={a.id} className="p-3 text-sm">
                <p className="text-foreground">
                  {a.adminUsername} {a.amount > 0 ? "加值" : "扣除"} {fmtNum(Math.abs(a.amount))}{" "}
                  {a.coinType === "piCoins" ? "pi玩幣" : "試玩幣"}
                </p>
                {a.note && <p className="text-xs text-muted-foreground">備註：{a.note}</p>}
                <p className="text-xs text-muted-foreground">{fmtDate(a.createdAt)}</p>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-foreground">此玩家的反饋</p>
        {detail.feedback.length === 0 ? (
          <EmptyState>尚無反饋紀錄</EmptyState>
        ) : (
          <div className="flex flex-col gap-2">
            {detail.feedback.map((f) => (
              <Card key={f.id} className="p-3 text-sm">
                <p className="whitespace-pre-wrap text-foreground">{f.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{fmtDate(f.createdAt)}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// 兌換回覆
// --------------------------------------------------------------------------
export function ExchangesSection({ session }: { session: Session }) {
  const [items, setItems] = useState<AdminExchange[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    adminApi
      .listExchanges(session)
      .then((res) => setItems(res.items))
      .catch(() => setError("讀取兌換紀錄失敗"))
  }, [session])

  if (error) return <ErrorNote message={error} />
  if (!items) return <Loading />
  if (items.length === 0) return <EmptyState>目前尚無兌換紀錄</EmptyState>

  return (
    <div className="flex flex-col gap-2">
      {items.map((e) => (
        <Card key={e.id} className="flex items-center justify-between p-3">
          <div>
            <p className="text-sm font-semibold text-foreground">{e.username || shortUid(e.uid)}</p>
            <p className="text-xs text-muted-foreground">
              {e.piAmount} Pi → {fmtNum(e.coinsAwarded)} 枚 · {fmtDate(e.createdAt)}
            </p>
          </div>
          <Pill tone={e.status === "completed" ? "jade" : e.status === "failed" ? "red" : "neutral"}>{e.status}</Pill>
        </Card>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// 機台控管
// --------------------------------------------------------------------------
export function MachinesSection({ session }: { session: Session }) {
  const [items, setItems] = useState<AdminMachine[] | null>(null)
  const [error, setError] = useState("")
  const [zone, setZone] = useState<"all" | "puzzle" | "gamble">("all")
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () =>
    adminApi
      .listMachines(session)
      .then((res) => setItems(res.items))
      .catch(() => setError("讀取機台清單失敗"))

  useEffect(load, [session])

  const toggle = async (m: AdminMachine) => {
    setBusyId(m.id)
    try {
      await adminApi.toggleMachine(session, m.id, !m.enabled, m.note)
      setItems((prev) => prev && prev.map((it) => (it.id === m.id ? { ...it, enabled: !it.enabled } : it)))
    } catch {
      setError("更新機台狀態失敗")
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <ErrorNote message={error} />
  if (!items) return <Loading />

  const filtered = items.filter((m) => zone === "all" || m.category === zone)
  const onCount = items.filter((m) => m.enabled).length

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        目前上線 {onCount} / {items.length} 台
      </p>
      <div className="flex gap-2">
        {[
          { id: "all" as const, label: "全部" },
          ...CATEGORIES.map((c) => ({ id: c.id as "puzzle" | "gamble", label: c.label })),
        ].map((z) => (
          <button
            key={z.id}
            onClick={() => setZone(z.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              zone === z.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map((m) => (
          <Card key={m.id} className="flex items-center justify-between p-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">
                {CATEGORIES.find((c) => c.id === m.category)?.label ?? m.category} · {m.tier}
              </p>
            </div>
            <button
              onClick={() => toggle(m)}
              disabled={busyId === m.id}
              className={`h-7 w-12 rounded-full p-0.5 transition ${m.enabled ? "bg-primary" : "bg-muted"}`}
              aria-label={m.enabled ? "關閉機台" : "開啟機台"}
            >
              <span
                className={`block h-6 w-6 rounded-full bg-background shadow transition ${m.enabled ? "translate-x-5" : "translate-x-0"}`}
              />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// 通告製作
// --------------------------------------------------------------------------
export function AnnouncementsSection({ session }: { session: Session }) {
  const [items, setItems] = useState<AdminAnnouncement[] | null>(null)
  const [error, setError] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [busy, setBusy] = useState(false)

  const load = () =>
    adminApi
      .listAnnouncements(session)
      .then((res) => setItems(res.items))
      .catch(() => setError("讀取公告失敗"))

  useEffect(load, [session])

  const startNew = () => {
    setEditingId(0)
    setTitle("")
    setBody("")
  }
  const startEdit = (a: AdminAnnouncement) => {
    setEditingId(a.id)
    setTitle(a.title)
    setBody(a.body)
  }

  const save = async () => {
    if (!title.trim() || !body.trim()) return
    setBusy(true)
    try {
      await adminApi.saveAnnouncement(session, {
        id: editingId ? editingId : undefined,
        title: title.trim(),
        body: body.trim(),
        active: true,
      })
      setEditingId(null)
      load()
    } catch {
      setError("儲存公告失敗")
    } finally {
      setBusy(false)
    }
  }

  const remove = async (id: number) => {
    setBusy(true)
    try {
      await adminApi.deleteAnnouncement(session, id)
      load()
    } catch {
      setError("刪除公告失敗")
    } finally {
      setBusy(false)
    }
  }

  if (error) return <ErrorNote message={error} />

  return (
    <div className="flex flex-col gap-3">
      {editingId !== null ? (
        <Card className="flex flex-col gap-3 p-4">
          <Field label="標題">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} maxLength={100} />
          </Field>
          <Field label="內容">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              className={`${inputClass} resize-none`}
              maxLength={800}
            />
          </Field>
          <div className="flex gap-2">
            <Button variant="primary" block disabled={busy} onClick={save}>
              發布公告
            </Button>
            <Button variant="ghost" onClick={() => setEditingId(null)}>
              取消
            </Button>
          </div>
        </Card>
      ) : (
        <Button variant="primary" onClick={startNew}>
          <IconPlus className="h-4 w-4" /> 新增公告
        </Button>
      )}

      {!items && <Loading />}
      {items && items.length === 0 && <EmptyState>尚未發布任何公告</EmptyState>}
      {items && items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((a) => (
            <Card key={a.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{a.title}</p>
                  <p className="mt-0.5 whitespace-pre-wrap text-xs text-muted-foreground">{a.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{fmtDate(a.createdAt)}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => startEdit(a)} className="rounded-lg px-2 py-1 text-xs text-primary">
                    編輯
                  </button>
                  <button onClick={() => remove(a.id)} className="rounded-lg px-2 py-1 text-destructive">
                    <IconTrash className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// 玩家反饋
// --------------------------------------------------------------------------
export function FeedbackSection({ session }: { session: Session }) {
  const [items, setItems] = useState<AdminFeedback[] | null>(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<"" | "new" | "resolved">("")
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = () =>
    adminApi
      .listFeedback(session, filter)
      .then((res) => setItems(res.items))
      .catch(() => setError("讀取反饋失敗"))

  useEffect(load, [session, filter])

  const markStatus = async (id: number, status: string) => {
    setBusyId(id)
    try {
      await adminApi.updateFeedbackStatus(session, id, status)
      load()
    } catch {
      setError("更新狀態失敗")
    } finally {
      setBusyId(null)
    }
  }

  if (error) return <ErrorNote message={error} />

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {[
          { id: "" as const, label: "全部" },
          { id: "new" as const, label: "待處理" },
          { id: "resolved" as const, label: "已處理" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
              filter === f.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {!items && <Loading />}
      {items && items.length === 0 && <EmptyState>目前沒有反饋</EmptyState>}
      {items && items.length > 0 && (
        <div className="flex flex-col gap-2">
          {items.map((f) => (
            <Card key={f.id} className="p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground">{f.username || shortUid(f.uid)}</p>
                <Pill tone={f.status === "new" ? "red" : f.status === "resolved" ? "jade" : "neutral"}>
                  {f.status === "new" ? "待處理" : f.status === "resolved" ? "已處理" : "已讀"}
                </Pill>
              </div>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{f.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{fmtDate(f.createdAt)}</p>
              <div className="mt-2 flex gap-2">
                {f.status !== "read" && (
                  <Button variant="outline" disabled={busyId === f.id} onClick={() => markStatus(f.id, "read")}>
                    標記已讀
                  </Button>
                )}
                {f.status !== "resolved" && (
                  <Button variant="primary" disabled={busyId === f.id} onClick={() => markStatus(f.id, "resolved")}>
                    <IconCheck className="h-3.5 w-3.5" /> 標記已處理
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// 設定
// --------------------------------------------------------------------------
export function SettingsSection({
  adminUsername,
  onLogout,
}: {
  adminUsername: string
  onLogout: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-2 p-4">
        <p className="text-sm font-semibold text-foreground">目前登入</p>
        <p className="text-sm text-muted-foreground">管理員：{adminUsername}</p>
        <Button variant="outline" onClick={onLogout} className="mt-1 self-start">
          登出
        </Button>
      </Card>
      <Card className="flex flex-col gap-2 p-4">
        <p className="text-sm font-semibold text-foreground">兌換設定</p>
        <p className="text-sm text-muted-foreground">1 Pi = {fmtNum(COINS_PER_PI)} 遊戲幣（於程式碼中設定）</p>
      </Card>
      <Card className="flex flex-col gap-2 p-4">
        <p className="text-sm font-semibold text-foreground">管理員名單</p>
        <p className="text-sm text-muted-foreground">
          後台僅限兩個指定電子郵件帳號登入。如需更換帳號，需要調整程式中的管理員名單設定。
        </p>
      </Card>
    </div>
  )
}
