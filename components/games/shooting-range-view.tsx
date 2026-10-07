"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { srNew, srSpawn, srTick, srHit, SR_COLS, SR_ROWS, SR_WIN_SCORE, type SrState } from "@/lib/games/shooting-range"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function ShootingRangeView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<SrState>(() => srNew())
  const overRef = useRef(false)
  const spawnCooldownRef = useRef(0)

  const restart = () => {
    setState(srNew())
    overRef.current = false
    spawnCooldownRef.current = 0
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
      const now = Date.now()
      setState((s) => {
        let next = srTick(s, now, 0.2)
        spawnCooldownRef.current -= 200
        if (!next.over && spawnCooldownRef.current <= 0) {
          next = srSpawn(next, now)
          spawnCooldownRef.current = Math.max(420, 900 - next.score * 20)
        }
        return next
      })
    }, 200)
    return () => clearInterval(id)
  }, [])

  const hit = (id: number) => {
    setState((s) => {
      const before = s.targets.length
      const next = srHit(s, id)
      if (next.targets.length < before && soundOn) playMoveSound()
      return next
    })
  }

  return (
    <PuzzleShell
      gameId="shooting-range"
      title="打靶場"
      subtitle="限時點擊靈活靶標"
      status={`分數：${state.score}／${SR_WIN_SCORE}　剩餘時間：${Math.ceil(state.timeLeft)}s`}
      rulesBrief="靶標會隨機在網格上亮起，出現後盡快點擊得分，時間到之前累積達到目標分數即算過關。"
      solved={state.over && state.won}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-2 rounded-2xl border border-border bg-card p-3 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${SR_COLS}, minmax(0, 1fr))`, width: 260 }}
      >
        {Array.from({ length: SR_COLS * SR_ROWS }, (_, i) => {
          const target = state.targets.find((t) => t.cell === i)
          return (
            <button
              key={i}
              onClick={() => target && hit(target.id)}
              disabled={!target || state.over}
              className={`aspect-square rounded-full transition active:scale-90 ${
                target ? "bg-destructive shadow-[0_0_10px_2px_oklch(0.6_0.22_25_/_0.6)]" : "bg-muted/25"
              }`}
            />
          )
        })}
      </div>
      {state.over && !state.won && (
        <p className="text-center text-xs font-semibold text-destructive">時間到！分數未達標，點「重新開始」再挑戰一次。</p>
      )}
    </PuzzleShell>
  )
}
