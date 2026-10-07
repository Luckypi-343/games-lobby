"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  bsNew,
  bsTickMeter,
  bsShoot,
  bsNextAttempt,
  BS_ATTEMPTS,
  BS_WIN_MADE,
  type BsState,
} from "@/lib/games/basketball-shoot"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function BasketballShootView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BsState>(() => bsNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(bsNew())
    overRef.current = false
  }

  useEffect(() => {
    if (state.over && !overRef.current) {
      overRef.current = true
      if (soundOn) {
        if (state.won) playWinSound()
        else playLossSound()
      }
    }
  }, [state.over, state.won, soundOn])

  useEffect(() => {
    if (state.flying || state.over) return
    const id = setInterval(() => setState((s) => bsTickMeter(s)), 24)
    return () => clearInterval(id)
  }, [state.flying, state.over])

  useEffect(() => {
    if (!state.flying) return
    if (soundOn && state.lastResult === "in") playCaptureSound()
    const t = setTimeout(() => setState((s) => bsNextAttempt(s)), 900)
    return () => clearTimeout(t)
  }, [state.flying, state.lastResult, soundOn])

  return (
    <PuzzleShell
      gameId="basketball-shoot"
      title="籃球投籃"
      subtitle="抓準時機停在中央區域投籃"
      status={`已進球：${state.made}／${BS_WIN_MADE}　剩餘機會：${state.attemptsLeft}`}
      rulesBrief="力度條會自動來回移動，落在中央區域附近按「投籃」較容易命中，在機會用盡前命中足夠球數即過關。"
      solved={state.over && state.won}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="relative h-40 w-64 overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="absolute left-1/2 top-3 h-6 w-6 -translate-x-1/2 rounded-full border-4 border-[oklch(0.6_0.2_30)]" />
        {state.flying && (
          <p
            className={`absolute left-1/2 top-14 -translate-x-1/2 text-sm font-bold ${
              state.lastResult === "in" ? "text-primary" : "text-destructive"
            }`}
          >
            {state.lastResult === "in" ? "命中！" : "偏出"}
          </p>
        )}
        <div className="absolute bottom-3 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[oklch(0.6_0.16_40)]" />
      </div>
      <div className="w-full max-w-xs space-y-2">
        <div className="relative h-4 overflow-hidden rounded-full bg-muted">
          <div className="absolute inset-y-0 left-[38%] w-[24%] rounded-full bg-primary/25" />
          <div
            className="absolute top-0 h-full w-1.5 rounded-full bg-primary"
            style={{ left: `${state.power}%` }}
          />
        </div>
        <button
          onClick={() => setState((s) => bsShoot(s))}
          disabled={state.flying || state.over}
          className="w-full rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground transition disabled:opacity-40 active:scale-95"
        >
          投籃
        </button>
      </div>
    </PuzzleShell>
  )
}
