"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { CATEGORIES, slotsOf, formatCoins, type Machine, type PuzzleGame } from "@/lib/luckypi/data"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { LANGS, dictFor } from "@/lib/luckypi/i18n"
import { WelcomeBanner } from "./pieces"
import { SlotCard } from "./slot-card"
import { PurchaseButton } from "./purchase-button"
import { IconBrain, IconSpade, IconHome, IconGear, IconMegaphone, IconChat, IconCoin, PiEmblem } from "./ui"

const CATEGORY_ICON = { puzzle: IconBrain, gamble: IconSpade } as const

function LanguageMenuButton() {
  const { lang, setLang } = useLuckyPi()
  const t = dictFor(lang)
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={t.navLanguage}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-3xl leading-none shadow-md transition active:scale-95"
        style={{ display: "inline-flex", animation: "luckypi-spin 9s linear infinite" }}
      >
        🪩
      </button>
      {open && (
        <>
          <button
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div className="fixed right-4 top-24 z-50 max-h-72 w-40 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg">
            <p className="px-2 py-1.5 text-[10px] font-semibold text-muted-foreground">{t.langMenuTitle}</p>
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id)
                  setOpen(false)
                }}
                className={cn(
                  "block w-full rounded-lg px-2 py-1.5 text-left text-xs transition",
                  lang === l.id ? "bg-primary/15 font-semibold text-primary" : "text-foreground hover:bg-muted",
                )}
              >
                {l.native}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function NavIconButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-muted-foreground transition active:scale-95"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground">{icon}</span>
      <span className="text-[10px]">{label}</span>
    </button>
  )
}

export function LobbyScreen({
  onPlay,
  onPlayGame,
  onHome,
  onSettings,
  onAnnouncements,
  onFeedback,
  onExchange,
}: {
  onPlay: (m: Machine) => void
  onPlayGame: (g: PuzzleGame) => void
  onHome: () => void
  onSettings: () => void
  onAnnouncements: () => void
  onFeedback: () => void
  onExchange: () => void
}) {
  const { tab, setTab, trialCoins, piCoins, lang, mode, trialName, piDisplayName } = useLuckyPi()
  const { user } = usePiAuth()
  const t = dictFor(lang)
  const [disabledMachines, setDisabledMachines] = useState<Set<string>>(new Set())

  useEffect(() => {
    let cancelled = false
    fetch("/api/machines")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data || !Array.isArray(data.disabled)) return
        setDisabledMachines(new Set(data.disabled as string[]))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const rawSlots = slotsOf(tab)
  const slots = rawSlots.map((slot) =>
    slot.machine && disabledMachines.has(slot.machine.id) ? { ...slot, machine: undefined } : slot,
  )
  const activeCategory = CATEGORIES.find((c) => c.id === tab)!
  const filled = slots.filter((s) => s.machine).length
  const ZONE_LABEL: Record<string, string> = { puzzle: t.puzzleZoneLabel, gamble: t.gambleZoneLabel }
  const ZONE_BLURB: Record<string, string> = { puzzle: t.puzzleZoneBlurb, gamble: t.gambleZoneBlurb }
  const loggedInName = mode === "trial" ? trialName : piDisplayName ?? user?.username
  const displayName = (loggedInName ?? "").trim() || t.guestNameLabel
  const welcomeTemplate = mode === "trial" ? t.welcomeTrialTemplate : t.welcomePiTemplate
  const welcomeText = welcomeTemplate.replace("{name}", displayName)

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-6">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur">
        <div className="lp-shine relative overflow-hidden bg-gradient-to-br from-secondary via-secondary to-background px-4 pb-3 pt-4 text-center">
          <p className="relative text-[11px] text-secondary-foreground/70">Luckypi Games</p>
          <div className="relative flex items-center justify-between gap-2">
            <div className="flex w-14 shrink-0 justify-start">
              <PiEmblem size={40} spin />
            </div>
            <p className="min-w-0 flex-1 truncate font-serif text-3xl font-bold tracking-wide text-primary text-balance">
              {t.lobbyTitleLabel}
            </p>
            <div className="flex w-14 shrink-0 justify-end">
              <LanguageMenuButton />
            </div>
          </div>
        </div>

        <div className="px-4 pt-3">
          <WelcomeBanner text={welcomeText} />
        </div>

        <div className="px-4 pt-3">
          <PurchaseButton />
        </div>

        <div className="flex items-center px-2 pt-1">
          <NavIconButton icon={<IconHome className="h-4 w-4" />} label={t.lobbyHomeLabel} onClick={onHome} />
          <NavIconButton icon={<IconGear className="h-4 w-4" />} label={t.lobbySettingsLabel} onClick={onSettings} />
          <NavIconButton
            icon={<IconMegaphone className="h-4 w-4" />}
            label={t.lobbyAnnouncementsLabel}
            onClick={onAnnouncements}
          />
          <NavIconButton icon={<IconChat className="h-4 w-4" />} label={t.lobbyFeedbackLabel} onClick={onFeedback} />
          <NavIconButton icon={<IconCoin className="h-4 w-4" />} label={t.lobbyExchangeLabel} onClick={onExchange} />
        </div>

        <div className="flex items-center justify-between px-4 pb-3 pt-2">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            {t.trialCoinsLabel}：<span className="font-mono text-primary">{formatCoins(trialCoins)}</span>
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            {t.piCoinsLabel}：<span className="font-mono text-primary">{piCoins.toString().padStart(6, "0")}</span>
          </span>
        </div>

        <div className="flex gap-2 px-4 pb-3">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICON[c.id]
            const count = slotsOf(c.id).filter((s) => s.machine).length
            return (
              <button
                key={c.id}
                onClick={() => setTab(c.id)}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-3 transition",
                  tab === c.id ? "bg-primary text-primary-foreground shadow-md" : "bg-muted text-muted-foreground",
                )}
              >
                <span className="flex items-center gap-1.5 text-sm font-bold">
                  <Icon className="h-4 w-4" />
                  {ZONE_LABEL[c.id]}
                </span>
                <span className="font-mono text-xs opacity-80">{count}+</span>
              </button>
            )
          })}
        </div>
      </header>

      <div className="flex items-center justify-between px-4 pt-3">
        <p className="text-xs text-muted-foreground">{ZONE_BLURB[activeCategory.id]}</p>
        <span className="font-mono text-xs text-muted-foreground">
          {filled} / {slots.length} {t.openedCountLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4 pt-4 sm:grid-cols-3">
        {slots.map((slot) => (
        <SlotCard key={slot.number} slot={slot} onPlay={onPlay} onPlayGame={onPlayGame} />
      ))}
      </div>
    </div>
  )
}
