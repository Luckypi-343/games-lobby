"use client"

import { useEffect, useState, type MouseEvent, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { ANNOUNCEMENTS, type Announcement, type SpinSpeed } from "@/lib/luckypi/data"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { pi } from "@/lib/pi"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { Button, Card, IconMegaphone, IconChat, IconGear, IconHome, PiEmblem } from "./ui"

function SheetShell({
  onClose,
  title,
  icon,
  children,
}: { onClose: () => void; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const stop = (e: MouseEvent) => e.stopPropagation()
  return (
    <div className="fixed inset-0 z-[130] flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div className="max-h-[80vh] overflow-y-auto rounded-t-3xl bg-card p-5" onClick={stop}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
            {icon}
          </span>
          <h2 className="font-serif text-lg font-bold text-foreground">{title}</h2>
        </div>
        {children}
        <Button block variant="outline" onClick={onClose} className="mt-4">
          關閉
        </Button>
      </div>
    </div>
  )
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-7 w-14 shrink-0 rounded-full transition-colors",
        on ? "bg-primary" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-6 w-6 rounded-full bg-card shadow transition-transform",
          on ? "translate-x-[1.9rem]" : "translate-x-0.5",
        )}
      />
      <span
        className={cn(
          "absolute inset-0 flex items-center px-2 text-[10px] font-bold",
          on ? "justify-start text-primary-foreground" : "justify-end text-muted-foreground",
        )}
      >
        {on ? "開" : "關"}
      </span>
    </button>
  )
}

function SettingRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="flex items-center justify-between p-3.5">
      <span className="text-sm font-semibold text-foreground">{label}</span>
      {children}
    </Card>
  )
}

const SPIN_SPEED_LABEL: Record<SpinSpeed, string> = { fast: "快", normal: "中", slow: "慢" }

export function SettingsSheet({
  onClose,
  onBackToLobby,
  onBackToHome,
}: {
  onClose: () => void
  onBackToLobby: () => void
  onBackToHome: () => void
}) {
  const { musicOn, setMusicOn, soundOn, setSoundOn, spinSpeed, setSpinSpeed } = useLuckyPi()

  return (
    <div className="fixed inset-0 z-[130] flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div
        className="max-h-[85vh] overflow-y-auto rounded-t-3xl bg-card p-5"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <p className="mb-5 flex items-center justify-center gap-2 font-serif text-xl font-bold tracking-widest text-foreground">
          <PiEmblem size={22} />
          設 定
          <span aria-hidden>🌍</span>
        </p>

        <div className="space-y-3">
          <SettingRow label="背景音樂">
            <Toggle on={musicOn} onChange={setMusicOn} />
          </SettingRow>

          <SettingRow label="配置音效">
            <Toggle on={soundOn} onChange={setSoundOn} />
          </SettingRow>

          <Card className="p-3.5">
            <p className="mb-2.5 text-sm font-semibold text-foreground">轉停速度</p>
            <div className="flex gap-2">
              {(["fast", "normal", "slow"] as SpinSpeed[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpinSpeed(s)}
                  className={cn(
                    "flex-1 rounded-xl py-2.5 text-sm font-semibold transition active:scale-95",
                    spinSpeed === s ? "bg-primary text-primary-foreground shadow" : "bg-muted text-muted-foreground",
                  )}
                >
                  {SPIN_SPEED_LABEL[s]}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-3.5">
            <p className="text-sm font-semibold text-foreground">其他</p>
            <p className="mt-1 text-xs text-muted-foreground">預留給後續更多設定項目</p>
          </Card>
        </div>

        <div className="mt-5 flex gap-2.5">
          <Button variant="outline" className="flex-1" onClick={onBackToLobby}>
            返回大廳
          </Button>
          <Button variant="solid" className="flex-1" onClick={onBackToHome}>
            <IconHome className="h-4 w-4" />
            返回首頁
          </Button>
        </div>
      </div>
    </div>
  )
}

export function AnnouncementsSheet({
  onClose,
  onBackToHome,
  onBackToLobby,
}: {
  onClose: () => void
  onBackToHome: () => void
  onBackToLobby: () => void
}) {
  const [updatedAt] = useState(() =>
    new Date().toLocaleString("zh-Hant", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }),
  )
  const [items, setItems] = useState<Announcement[]>(ANNOUNCEMENTS)

  useEffect(() => {
    let cancelled = false
    fetch("/api/announcements")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.items) || data.items.length === 0) return
        setItems(data.items)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[130] flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div
        className="flex max-h-[85vh] flex-col rounded-t-3xl bg-card p-5"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <p className="flex items-center justify-center gap-2 font-serif text-xl font-bold tracking-widest text-foreground">
          <PiEmblem size={22} />
          公 告
          <span aria-hidden>🌍</span>
        </p>
        <p className="mt-1.5 text-center text-[11px] text-muted-foreground">
          即時更新 • 最後更新於 {updatedAt}
        </p>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-0.5">
          {items.map((a) => (
            <Card key={a.id} className="p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-base">
                  {a.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-foreground">{a.title}</p>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {a.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.date}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-foreground/80">{a.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-4 rounded-xl bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
          通告說明：系統通告由管理員在後台發佈，包括重要訊息、新遊戲上線、定時維修和臨時要務。
          請定期查看此頁面，不要錯過任何重要信息！
        </p>

        <div className="mt-4 flex gap-2.5">
          <Button variant="outline" className="flex-1" onClick={onBackToHome}>
            <IconHome className="h-4 w-4" />
            返回首頁
          </Button>
          <Button variant="solid" className="flex-1" onClick={onBackToLobby}>
            進入遊戲大廳
          </Button>
        </div>
      </div>
    </div>
  )
}

const FEEDBACK_MAX = 500

export function FeedbackSheet({
  onClose,
  onBackToLobby,
  onBackToHome,
}: {
  onClose: () => void
  onBackToLobby: () => void
  onBackToHome: () => void
}) {
  const { toast } = useLuckyPi()
  const { user } = usePiAuth()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState("")
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const RATING_LABEL: Record<number, string> = { 1: "很差", 2: "尚可", 3: "一般", 4: "不錯", 5: "極好" }
  const activeRating = hoverRating || rating
  const canSubmit = username.trim().length > 0 && email.trim().length > 0 && text.trim().length > 0

  return (
    <div className="fixed inset-0 z-[130] flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div
        className="flex max-h-[88vh] flex-col rounded-t-3xl bg-card p-5"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <p className="flex items-center justify-center gap-2 font-serif text-xl font-bold tracking-widest text-foreground">
          <PiEmblem size={22} />
          反 饋
          <span aria-hidden>🌍</span>
        </p>

        {sent ? (
          <Card className="mt-5 p-5 text-center text-sm text-foreground">
            <p className="text-2xl">✅</p>
            <p className="mt-2 font-semibold">感謝您的反饋！</p>
            <p className="mt-1 text-xs text-muted-foreground">我們會根據您的建議持續改進遊戲平台。</p>
            <div className="mt-4 flex gap-2.5">
              <Button variant="outline" className="flex-1" onClick={onBackToLobby}>
                返回大廳
              </Button>
              <Button variant="solid" className="flex-1" onClick={onBackToHome}>
                <IconHome className="h-4 w-4" />
                返回首頁
              </Button>
            </div>
          </Card>
        ) : (
          <div className="mt-4 flex-1 space-y-4 overflow-y-auto pr-0.5">
            <p className="text-center text-xs text-muted-foreground">
              我們很想聽聽您的想法
              <br />
              您的反饋將幫助我們改進遊戲平台
            </p>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                遊戲用戶名 <span className="text-destructive">*</span>
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="輸入您的遊戲名稱"
                className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                郵箱地址 <span className="text-destructive">*</span>
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                type="email"
                className="w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                平台評分 <span className="text-destructive">*</span>
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHoverRating(n)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-2xl leading-none transition active:scale-90"
                    aria-label={`${n} 星`}
                  >
                    <span className={n <= activeRating ? "text-primary" : "text-muted"}>★</span>
                  </button>
                ))}
                <span className="ml-1.5 text-xs font-semibold text-muted-foreground">
                  {RATING_LABEL[activeRating]}
                </span>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-foreground">
                反應問題或建議 <span className="text-destructive">*</span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, FEEDBACK_MAX))}
                placeholder="請詳細描述您遇到的問題、建議或意見...（最多 500 字）"
                rows={5}
                maxLength={FEEDBACK_MAX}
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-sm text-foreground outline-none focus:border-primary"
              />
              <p className="mt-1 text-right text-[11px] text-muted-foreground">
                {text.length} / {FEEDBACK_MAX} 字
              </p>
            </div>

            <Button
              block
              disabled={!canSubmit || submitting}
              onClick={async () => {
                const accessToken = pi.auth.getAccessToken()
                if (!user || !accessToken) {
                  toast("請先登入後再送出反饋")
                  return
                }
                setSubmitting(true)
                try {
                  const res = await fetch("/api/feedback", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      uid: user.uid,
                      accessToken,
                      message: text.trim(),
                      rating,
                      contact: `${username.trim()} <${email.trim()}>`,
                    }),
                  })
                  if (!res.ok) throw new Error("failed")
                  setSent(true)
                  toast("反饋已送出，感謝您！")
                } catch {
                  toast("送出失敗，請稍後再試")
                } finally {
                  setSubmitting(false)
                }
              }}
            >
              提交反饋
            </Button>

            <p className="rounded-xl bg-muted/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
              提示：您的反饋將發送到管理員後台，我們會根據玩家的建議不斷改進平台。
            </p>

            <div className="flex gap-2.5">
              <Button variant="outline" className="flex-1" onClick={onBackToLobby}>
                返回大廳
              </Button>
              <Button variant="solid" className="flex-1" onClick={onBackToHome}>
                <IconHome className="h-4 w-4" />
                返回首頁
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
