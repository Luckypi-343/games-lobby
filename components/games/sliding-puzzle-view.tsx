"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { spShuffled, spMove, spIsSolved, SP_SIZE, type SpState } from "@/lib/games/sliding-puzzle"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

export function SlidingPuzzleView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<SpState>(() => spShuffled())

  const solved = spIsSolved(state.tiles)

  const restart = () => setState(spShuffled())

  const tap = (index: number) => {
    if (solved) return
    const next = spMove(state, index)
    if (next !== state) {
      if (soundOn) playMoveSound()
      setState(next)
    }
  }

  return (
    <PuzzleShell
      gameId="jigsaw"
      title="拼圖樂"
      subtitle="數字拼板"
      status={solved ? "過關成功！" : `步數：${state.moves}`}
      rulesBrief="點按與空格相鄰的方塊將其滑入空格，依序排列 1 到 15 即完成挑戰。"
      solved={solved}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-1.5 rounded-2xl border border-border bg-card p-2.5 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${SP_SIZE}, minmax(0, 1fr))` }}
      >
        {state.tiles.map((val, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            disabled={val === 0}
            className={`lp-nums flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold transition active:scale-95 ${
              val === 0 ? "bg-transparent" : "bg-primary text-primary-foreground shadow"
            }`}
          >
            {val !== 0 ? val : ""}
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
