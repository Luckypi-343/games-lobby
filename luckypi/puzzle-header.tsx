"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { formatCoins } from "@/lib/luckypi/data"
import { LANGS, dictFor } from "@/lib/luckypi/i18n"
import { PiEmblem } from "./ui"

export function PuzzleHeader({
  title,
  rules,
  onHome,
  onLobby,
}: {
  title: string
  rules: string
  onHome: () => void
  onLobby: () => void
}) {
  const { trialCoins, piCoins, musicOn, setMusicOn, soundOn, setSoundOn, lang, setLang } = useLuckyPi()
  const t = dictFor(lang)
  const [showRules, setShowRules] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLang, setShowLang] = useState(false)

  const closeAllExcept = (which: "rules" | "settings" | "lang" | "none") => {
    setShowRules(which === "rules")
    setShowSettings(which === "settings")
    setShowLang(which === "lang")
  }

  return (
    <div className="relative z-20 border-b border-border bg-background/95 px-2 py-2 backdrop-blur">
      <div className="flex items-center justify-between gap-0.5">
        <PiEmblem size={22} spin />
        <button
          onClick={onHome}
          aria-label={t.navHome}
          className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
        >
          🏠
        </button>
        <button
          onClick={onLobby}
          aria-label={t.navLobby}
          className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
        >
          🎰
        </button>
        <p className="flex-1 truncate text-center font-serif text-sm font-bold text-primary">{title}</p>
        <button
          onClick={() => setSoundOn(!soundOn)}
          aria-label={t.navSound}
          className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
        >
          {soundOn ? "🔉" : "🔇"}
        </button>
        <button
          onClick={() => closeAllExcept(showSettings ? "none" : "settings")}
          aria-label={t.navSettings}
          className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
        >
          ⚙️
        </button>
        <button
          onClick={() => closeAllExcept(showRules ? "none" : "rules")}
          aria-label={t.navRules}
          className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
        >
          📖
        </button>
        <button
          onClick={() => closeAllExcept(showLang ? "none" : "lang")}
          aria-label={t.navLanguage}
          className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
          style={{ display: "inline-block", animation: "luckypi-spin 9s linear infinite" }}
        >
          🌍
        </button>
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-4 text-xs font-semibold text-muted-foreground">
        <span>
          {t.trialCoinsLabel}：{formatCoins(trialCoins)}
        </span>
        <span>
          {t.piCoinsLabel}：{String(piCoins).padStart(6, "0")}
        </span>
      </div>

      {showSettings &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200]"
            onClick={() => setShowSettings(false)}
          >
            <div
              className="absolute right-2 top-14 w-44 rounded-xl border border-border bg-card p-3 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between py-1.5 text-xs font-medium text-foreground">
                <span>{t.musicLabel}</span>
                <button
                  onClick={() => setMusicOn(!musicOn)}
                  aria-label={t.musicLabel}
                  className={`relative h-5 w-9 rounded-full transition ${musicOn ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 block h-4 w-4 rounded-full bg-background transition ${
                      musicOn ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-1.5 text-xs font-medium text-foreground">
                <span>{t.soundEffectLabel}</span>
                <button
                  onClick={() => setSoundOn(!soundOn)}
                  aria-label={t.soundEffectLabel}
                  className={`relative h-5 w-9 rounded-full transition ${soundOn ? "bg-primary" : "bg-muted"}`}
                >
                  <span
                    className={`absolute top-0.5 block h-4 w-4 rounded-full bg-background transition ${
                      soundOn ? "left-[18px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {showLang &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200]"
            onClick={() => setShowLang(false)}
          >
            <div
              className="absolute right-2 top-14 max-h-64 w-36 overflow-y-auto rounded-xl border border-border bg-card p-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLang(l.id)
                    setShowLang(false)
                  }}
                  className={`block w-full rounded-lg px-2 py-1.5 text-left text-xs transition ${
                    lang === l.id ? "bg-primary/15 font-semibold text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}

      {showRules &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-background/60 px-3 py-6"
            onClick={() => setShowRules(false)}
          >
            <div
              className="flex max-h-[80vh] w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="shrink-0 border-b border-border px-4 py-3 text-center font-serif text-base font-bold text-primary">
                {title}
              </p>
              <div className="flex-1 overflow-y-auto px-4 py-3">
                <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{rules}</p>
              </div>
              <div className="shrink-0 p-4 pt-2">
                <button
                  onClick={() => setShowRules(false)}
                  className="w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground transition active:scale-95"
                >
                  {t.gotIt}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
