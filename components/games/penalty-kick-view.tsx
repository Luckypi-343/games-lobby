"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  pkNew,
  pkKick,
  pkNextRound,
  PK_ROUNDS,
  PK_WIN_GOALS,
  type PkSide,
  type PkState,
} from "@/lib/games/penalty-kick"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const SIDE_LABEL: Record<PkSide, string> = { left: "左路", center: "中路", right: "右路" }
const SIDE_X: Record<PkSide, string> = { left: "18%", center: "50%", right: "82%" }

export function PenaltyKickView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<PkState>(() => pkNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(pkNew())
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
    if (!state.animating) return
    if (soundOn && state.lastResult === "goal") playCaptureSound()
    const t = setTimeout(() => setState((s) => pkNextRound(s)), 1000)
    return () => clearTimeout(t)
  }, [state.animating, state.lastResult, soundOn])

  return (
    <PuzzleShell
      gameId="penalty-kick"
      title="足球射門"
      subtitle="選方向射門，對戰隨機撲救的門將"
      status={`第 ${state.round}／${PK_ROUNDS} 輪　進球：${state.goals}／${PK_WIN_GOALS}`}
      rulesBrief="選擇左路、中路或右路射門，門將會隨機撲向一側，方向不同則進球，5 輪內進球數達標即過關。"
      solved={state.over && state.won}
      cost={12}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="relative h-36 w-64 overflow-hidden rounded-2xl border border-border bg-[oklch(0.5_0.1_140)] shadow-lg">
        <div className="absolute inset-x-8 top-2 h-10 rounded-md border-2 border-white/70" />
        {state.lastKeeper && (
          <div
            className="absolute top-3 h-7 w-7 -translate-x-1/2 rounded-full bg-[oklch(0.85_0.16_90)] shadow-md transition-all duration-300"
            style={{ left: SIDE_X[state.lastKeeper] }}
          />
        )}
        {state.lastKick && (
          <div
            className="absolute bottom-3 h-4 w-4 -translate-x-1/2 rounded-full bg-white shadow-md transition-all duration-500"
            style={{ left: SIDE_X[state.lastKick] }}
          />
        )}
        {state.animating && (
          <p
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-xs font-bold ${
              state.lastResult === "goal" ? "text-primary" : "text-destructive"
            }`}
          >
            {state.lastResult === "goal" ? "進球！" : "被撲救！"}
          </p>
        )}
      </div>
      {!state.over && (
        <div className="grid grid-cols-3 gap-2">
          {(["left", "center", "right"] as PkSide[]).map((side) => (
            <button
              key={side}
              onClick={() => setState((s) => pkKick(s, side))}
              disabled={state.animating}
              className="rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground transition disabled:opacity-40 active:scale-95"
            >
              {SIDE_LABEL[side]}
            </button>
          ))}
        </div>
      )}
    </PuzzleShell>
  )
}
