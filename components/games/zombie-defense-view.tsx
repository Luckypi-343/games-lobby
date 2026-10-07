"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { zdNew, zdHit, zdTick, ZD_LANES, ZD_WAVE_TARGET, type ZdState } from "@/lib/games/zombie-defense"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function ZombieDefenseView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<ZdState>(() => zdNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(zdNew())
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
    const id = setInterval(() => {
      setState((s) => zdTick(s))
    }, 140)
    return () => clearInterval(id)
  }, [])

  const hit = (id: number) => {
    setState((s) => {
      const next = zdHit(s, id)
      if (next.zombies.length < s.zombies.length && soundOn) playCaptureSound()
      return next
    })
  }

  return (
    <PuzzleShell
      gameId="zombie-defense"
      title="殭屍防禦"
      subtitle="撐過全部波次即獲勝"
      status={`第 ${state.wave}／${ZD_WAVE_TARGET} 波　生命：${"❤".repeat(Math.max(0, state.lives))}　分數：${state.score}`}
      rulesBrief="殭屍會沿著車道往左逼近，點擊殭屍即可消滅（部分殭屍需點兩次），讓殭屍抵達最左側會扣血，撐過所有波次即獲勝。"
      solved={state.over && state.won}
      cost={14}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative touch-none overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        style={{ width: 280, height: 4 * 56 + 16 }}
      >
        {Array.from({ length: ZD_LANES }, (_, lane) => (
          <div key={lane} className="absolute inset-x-0 border-b border-border/40" style={{ top: 8 + lane * 56, height: 56 }} />
        ))}
        <div className="absolute inset-y-0 left-0 w-2 bg-primary" />
        {state.zombies.map((z) => (
          <button
            key={z.id}
            onClick={() => hit(z.id)}
            className={`absolute flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-primary-foreground shadow-md transition active:scale-90 ${
              z.hp > 1 ? "bg-[oklch(0.5_0.16_140)]" : "bg-[oklch(0.58_0.18_140)]"
            }`}
            style={{ left: `calc(${z.dist}% - 18px)`, top: 8 + z.lane * 56 + 10 }}
          >
            殭
          </button>
        ))}
      </div>
      {state.over && !state.won && (
        <p className="text-center text-xs font-semibold text-destructive">生命耗盡，點「重新開始」再挑戰一次！</p>
      )}
    </PuzzleShell>
  )
}
