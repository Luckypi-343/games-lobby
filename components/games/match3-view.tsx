"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { m3New, m3Swap, M3_ROWS, M3_COLS, M3_PALETTE, type M3State } from "@/lib/games/match3"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function Match3View({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<M3State>(() => m3New())
  const [selected, setSelected] = useState<number | null>(null)

  const restart = () => {
    setState(m3New())
    setSelected(null)
  }

  const tap = (i: number) => {
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    const { state: next, moved } = m3Swap(state, selected, i)
    if (moved) {
      setState(next)
      if (soundOn) playWinSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  return (
    <PuzzleShell
      gameId="match3"
      title="開心消消樂"
      subtitle="交換方塊湊出三連消"
      status={`分數：${state.score}${state.lastCleared > 0 ? `　上次消除：${state.lastCleared}` : ""}`}
      rulesBrief="點選一個方塊再點選相鄰方塊即可交換，湊出 3 個以上同色連線就會消除並往下補位，可連鎖觸發更多消除。"
      solved={false}
      cost={6}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-1 rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${M3_COLS}, minmax(0, 1fr))`, width: 240, height: 300 }}
      >
        {state.grid.map((color, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`aspect-square rounded-lg border-2 transition-all active:scale-90 ${M3_PALETTE[color]} ${
              selected === i ? "border-foreground ring-2 ring-foreground/40" : "border-transparent"
            }`}
          />
        ))}
      </div>
    </PuzzleShell>
  )
}
