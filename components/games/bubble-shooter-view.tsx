"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { bbNew, bbShoot, BB_COLS, BB_ROWS, BB_PALETTE, type BbState } from "@/lib/games/bubble-shooter"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function BubbleShooterView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BbState>(() => bbNew())

  const restart = () => setState(bbNew())

  const shoot = (col: number) => {
    if (state.over) return
    setState((s) => {
      const next = bbShoot(s, col)
      if (soundOn) {
        if (next.over) playLossSound()
        else if (next.score > s.score) playWinSound()
        else playMoveSound()
      }
      return next
    })
  }

  return (
    <PuzzleShell
      gameId="bubble-shooter"
      title="泡泡龍"
      subtitle="湊出同色泡泡消除得分"
      status={state.over ? "欄位已滿，遊戲結束" : `分數：${state.score}`}
      rulesBrief="點選下方任一欄位發射目前顏色的泡泡，3 個以上同色相連即會消除得分，泡泡疊到最上方就會結束遊戲。"
      solved={false}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-1 rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${BB_COLS}, minmax(0, 1fr))`, width: 240 }}
      >
        {state.grid.flat().map((cell, i) => (
          <div
            key={i}
            className={`aspect-square rounded-full border border-border/40 ${
              cell !== null ? BB_PALETTE[cell] : "bg-muted/15"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] text-muted-foreground">下一個</span>
          <div className={`h-6 w-6 rounded-full ${BB_PALETTE[state.next]}`} />
        </div>
        <div className={`h-10 w-10 rounded-full border-2 border-foreground/30 ${BB_PALETTE[state.current]}`} />
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${BB_COLS}, minmax(0, 1fr))`, width: 240 }}>
        {Array.from({ length: BB_COLS }, (_, c) => (
          <button
            key={c}
            onClick={() => shoot(c)}
            disabled={state.over}
            className="flex h-8 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground active:scale-90 disabled:opacity-40"
          >
            ↑
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
