"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { pk2New, pk2Turn, pk2Move, PK2_SIZE, type Pk2State } from "@/lib/games/parking"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const ARROW = ["↑", "→", "↓", "←"]

export function ParkingView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<Pk2State>(() => pk2New())
  const overRef = useRef(false)

  const restart = () => {
    setState(pk2New())
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

  // 車道總高加 100%，格子高度加倍（寬度不變）
  const cellW = 30
  const cellH = 60

  return (
    <PuzzleShell
      gameId="parking"
      title="停車挑戰"
      subtitle="操控車輛停進標記車位"
      status={`剩餘步數：${state.movesLeft}　碰撞：${state.bumps}／5`}
      rulesBrief="使用左右轉向與前進按鈕操控車輛，在步數與碰撞次數用盡前，把車頭朝向正確地停進標記的車位即過關。每次挑戰的停車位置會隨機變化。"
      solved={state.over && state.won}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative rounded-2xl border border-border bg-card shadow-lg"
        style={{ width: PK2_SIZE * cellW + 16, height: PK2_SIZE * cellH + 16, padding: 8 }}
      >
        <div
          className="absolute rounded-md border-2 border-dashed border-primary/60"
          style={{ left: state.target.x * cellW, top: state.target.y * cellH, width: cellW - 2, height: cellH - 2 }}
        />
        {state.walls.map((w, i) => (
          <div
            key={i}
            className="absolute rounded-md bg-muted shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),inset_0_-3px_4px_rgba(0,0,0,0.25)]"
            style={{ left: w.x * cellW, top: w.y * cellH, width: cellW - 2, height: cellH - 2 }}
          />
        ))}
        <div
          className="absolute flex items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground shadow-md transition-all"
          style={{ left: state.carX * cellW, top: state.carY * cellH, width: cellW - 2, height: cellH - 2 }}
        >
          {ARROW[state.facing]}
        </div>
      </div>
      {!state.over && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setState((s) => pk2Turn(s, -1))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-bold active:scale-90"
          >
            ↺
          </button>
          <button
            onClick={() => {
              setState((s) => pk2Move(s))
              if (soundOn) playMoveSound()
            }}
            className="flex h-11 w-16 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground active:scale-90"
          >
            前進
          </button>
          <button
            onClick={() => setState((s) => pk2Turn(s, 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-sm font-bold active:scale-90"
          >
            ↻
          </button>
        </div>
      )}
    </PuzzleShell>
  )
}
