"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { rcNew, rcChangeLane, rcTick, RC_LANES, RC_ROWS, RC_GOAL_DISTANCE, type RcState } from "@/lib/games/racing"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"

export function RacingView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<RcState>(() => rcNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(rcNew())
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
    const id = setInterval(() => setState((s) => rcTick(s)), 130)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setState((s) => rcChangeLane(s, -1))
      else if (e.key === "ArrowRight") setState((s) => rcChangeLane(s, 1))
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const laneW = 100 / RC_LANES
  // 車道加高 50%
  const cellH = 26 * 1.5

  return (
    <PuzzleShell
      gameId="racing"
      title="賽車競速"
      subtitle="切換車道閃避來車，抵達終點"
      status={`進度：${Math.round((state.distance / RC_GOAL_DISTANCE) * 100)}%　生命：${"❤".repeat(Math.max(0, state.lives))}`}
      rulesBrief="左右切換車道閃避迎面而來的車輛，抵達終點距離前生命耗盡則挑戰失敗。"
      solved={state.over && state.won}
      cost={12}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative touch-none overflow-hidden rounded-2xl border border-border bg-[oklch(0.32_0.02_240)] shadow-lg"
        style={{ width: 180, height: RC_ROWS * cellH + 16, padding: 8 }}
      >
        {Array.from({ length: RC_LANES - 1 }, (_, i) => (
          <div
            key={i}
            className="absolute top-0 h-full border-l border-dashed border-white/25"
            style={{ left: `${(i + 1) * laneW}%` }}
          />
        ))}
        {state.obstacles.map((o) => (
          <div
            key={o.id}
            className="absolute rounded-md bg-[oklch(0.62_0.2_25)] shadow-md"
            style={{
              width: `${laneW - 6}%`,
              height: 20,
              left: `${o.lane * laneW + 3}%`,
              top: o.row * cellH,
            }}
          />
        ))}
        <div
          className="absolute rounded-md bg-primary shadow-[0_0_8px_oklch(0.55_0.2_260_/_0.6)]"
          style={{ width: `${laneW - 6}%`, height: 20, left: `${state.lane * laneW + 3}%`, top: (RC_ROWS - 1) * cellH }}
        />
      </div>
      {/* 左右按鈕拉開到車道的左右下方 */}
      <div className="flex w-[180px] items-center justify-between">
        <button
          onClick={() => setState((s) => rcChangeLane(s, -1))}
          className="flex h-10 w-14 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ←
        </button>
        <button
          onClick={() => setState((s) => rcChangeLane(s, 1))}
          className="flex h-10 w-14 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}
