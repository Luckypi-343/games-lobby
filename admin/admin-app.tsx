"use client"

import { useEffect, useState } from "react"
import { adminApi, adminAuthApi, type Session } from "@/lib/admin/client"
import { LoginScreen } from "@/components/admin/login-screen"
import {
  Button,
  IconBack,
  IconChat,
  IconExchange,
  IconGear,
  IconHome,
  IconMachine,
  IconMegaphone,
  IconUsers,
} from "@/components/admin/ui"
import {
  OverviewSection,
  PlayersSection,
  PlayerDetailSection,
  ExchangesSection,
  MachinesSection,
  AnnouncementsSection,
  FeedbackSection,
  SettingsSection,
} from "@/components/admin/sections"

type TabId = "home" | "players" | "exchanges" | "machines" | "announcements" | "feedback" | "settings"

const TABS: { id: TabId; label: string; icon: typeof IconHome }[] = [
  { id: "home", label: "主頁", icon: IconHome },
  { id: "players", label: "玩家訊息", icon: IconUsers },
  { id: "exchanges", label: "兌換回覆", icon: IconExchange },
  { id: "machines", label: "機台控管", icon: IconMachine },
  { id: "announcements", label: "通告製作", icon: IconMegaphone },
  { id: "feedback", label: "玩家反饋", icon: IconChat },
  { id: "settings", label: "設定", icon: IconGear },
]

const SESSION_STORAGE_KEY = "luckypi.admin.session"

function loadStoredSession(): Session | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed.email === "string" && typeof parsed.token === "string") {
      return { email: parsed.email, token: parsed.token }
    }
    return null
  } catch {
    return null
  }
}

function saveStoredSession(session: Session | null) {
  if (typeof window === "undefined") return
  try {
    if (session) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    else window.localStorage.removeItem(SESSION_STORAGE_KEY)
  } catch {}
}

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null)
  const [gate, setGate] = useState<"checking" | "login" | "ready">("checking")
  const [tab, setTab] = useState<TabId>("home")
  const [selectedUid, setSelectedUid] = useState<string | null>(null)

  useEffect(() => {
    const stored = loadStoredSession()
    if (!stored) {
      setGate("login")
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        await adminApi.verify(stored)
        if (cancelled) return
        setSession(stored)
        setGate("ready")
      } catch {
        if (cancelled) return
        saveStoredSession(null)
        setGate("login")
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  function handleLoggedIn(next: Session) {
    saveStoredSession(next)
    setSession(next)
    setGate("ready")
  }

  function handleLogout() {
    if (session) adminAuthApi.logout(session.token)
    saveStoredSession(null)
    setSession(null)
    setTab("home")
    setSelectedUid(null)
    setGate("login")
  }

  if (gate === "checking") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">正在確認管理員權限…</p>
      </div>
    )
  }

  if (gate === "login" || !session) {
    return <LoginScreen onLoggedIn={handleLoggedIn} />
  }

  if (selectedUid) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
        <header className="flex items-center gap-3 border-b border-border px-4 py-3">
          <button
            onClick={() => setSelectedUid(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full text-foreground active:scale-90"
            aria-label="返回"
          >
            <IconBack />
          </button>
          <h1 className="text-base font-bold text-foreground">玩家資料</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4">
          <PlayerDetailSection session={session} uid={selectedUid} adminUsername={session.email} />
        </main>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h1 className="text-base font-bold text-foreground">Luckypi Games 後台</h1>
          <p className="text-xs text-muted-foreground">管理員：{session.email}</p>
        </div>
      </header>

      <nav className="flex gap-1.5 overflow-x-auto border-b border-border px-3 py-2">
        {TABS.map((t) => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <Button
              key={t.id}
              variant={active ? "primary" : "ghost"}
              onClick={() => setTab(t.id)}
              className="shrink-0 whitespace-nowrap"
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </Button>
          )
        })}
      </nav>

      <main className="flex-1 overflow-y-auto p-4">
        {tab === "home" && <OverviewSection session={session} onGoTab={(t) => setTab(t as TabId)} />}
        {tab === "players" && <PlayersSection session={session} onSelectPlayer={setSelectedUid} />}
        {tab === "exchanges" && <ExchangesSection session={session} />}
        {tab === "machines" && <MachinesSection session={session} />}
        {tab === "announcements" && <AnnouncementsSection session={session} />}
        {tab === "feedback" && <FeedbackSection session={session} />}
        {tab === "settings" && <SettingsSection adminUsername={session.email} onLogout={handleLogout} />}
      </main>
    </div>
  )
}
