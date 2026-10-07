"use client"

// 博奕區「真人對戰撲克桌」共用外殼：統一頂部六大按鈕（沿用 PuzzleHeader，跟大廳其他機台完全同款）、
// 統一的試玩幣/pi玩幣顯示與押注調整列、統一的豪華綠絨桌面背景與專屬背景音樂，
// 讓 10點半／梭哈／牛牛／炸金花 這幾張新牌桌，外觀跟操作方式保持一致，不會各做各的。
import { useEffect } from "react"
import type { ReactNode } from "react"
import { PuzzleHeader } from "./puzzle-header"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { formatCoins } from "@/lib/luckypi/data"
import { dictFor } from "@/lib/luckypi/i18n"
import { startBgm, stopBgm } from "@/lib/luckypi/reel-audio"

export function CasinoTableShell({
  title,
  rules,
  hue,
  bet,
  betMin,
  betMax,
  betStep,
  betLocked,
  onBetChange,
  onHome,
  onLobby,
  children,
  hideBetBar = false,
}: {
  title: string
  rules: string
  hue: number
  bet: number
  betMin: number
  betMax: number
  betStep: number
  betLocked: boolean
  onBetChange: (next: number) => void
  onHome: () => void
  onLobby: () => void
  children: ReactNode
  /** 部分機台改用「每種圖案各自下注」，不需要這條單一的押注調整列。 */
  hideBetBar?: boolean
}) {
  const { trialCoins, piCoins, mode, musicOn, lang } = useLuckyPi()
  const t = dictFor(lang)

  useEffect(() => {
    if (musicOn) startBgm(hue)
    return () => stopBgm()
  }, [musicOn, hue])

  function adjust(dir: 1 | -1) {
    if (betLocked) return
    const next = Math.min(betMax, Math.max(betMin, bet + dir * betStep))
    onBetChange(next)
  }

  return (
    <div
      className="flex min-h-dvh flex-col text-neutral-100"
      style={{
        background: `radial-gradient(120% 90% at 50% -8%, oklch(0.27 0.06 ${hue}), oklch(0.15 0.035 ${hue}) 55%, oklch(0.08 0.02 ${hue}))`,
      }}
    >
      <PuzzleHeader title={title} rules={rules} onHome={onHome} onLobby={onLobby} />

      {!hideBetBar && (
        <div
          className="flex shrink-0 items-center justify-between gap-2 border-b px-3 py-2"
          style={{
            background: `linear-gradient(180deg, oklch(0.2 0.05 ${hue} / 0.9), oklch(0.14 0.04 ${hue} / 0.9))`,
            borderColor: `oklch(0.55 0.12 ${hue} / 0.4)`,
          }}
        >
          <div className="flex flex-col text-[11px] font-semibold leading-tight">
            <span className="text-amber-200/80">{mode === "trial" ? t.trialCoinsLabel : t.piCoinsLabel}</span>
            <span className="font-mono text-sm text-amber-100 tabular-nums">
              {mode === "trial" ? formatCoins(trialCoins) : String(piCoins).padStart(6, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-amber-200/70">押注</span>
            <button
              onClick={() => adjust(-1)}
              disabled={betLocked || bet <= betMin}
              aria-label="減少押注"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-bold text-amber-100 transition active:scale-90 disabled:opacity-30"
            >
              −
            </button>
            <span className="min-w-[4.5rem] text-center font-mono text-base font-bold text-amber-100 tabular-nums">
              {formatCoins(bet)}
            </span>
            <button
              onClick={() => adjust(1)}
              disabled={betLocked || bet >= betMax}
              aria-label="增加押注"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-bold text-amber-100 transition active:scale-90 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      )}

      <div className="relative flex-1">{children}</div>
    </div>
  )
}
