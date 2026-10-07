"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { ssNew, ssTap, type SeqState } from "@/lib/games/sequence-sort"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound } from "@/lib/games/game-audio"

export function SequenceSortView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<SeqState>(() => ssNew())
  const [wrongIdx, setWrongIdx] = useState<number | null>(null)

  const restart = () => {
    setState(ssNew())
    setWrongIdx(null)
  }

  const tap = (idx: number) => {
    if (state.done) return
    const { state: next, correct } = ssTap(state, idx)
    setState(next)
    if (correct) {
      if (soundOn) playMoveSound()
    } else {
      if (soundOn) playLossSound()
      setWrongIdx(idx)
      setTimeout(() => setWrongIdx(null), 260)
    }
  }

  return (
    <PuzzleShell
      gameId="sequence-sort"
      title="排序方塊"
      subtitle="依序點擊 1 到 16"
      status={state.done ? "全部完成！" : `下一個：${state.next}　失誤：${state.mistakes}`}
      rulesBrief="方塊上的數字被打亂了，請依照 1、2、3...的順序依序點擊，點錯會累計失誤次數，考驗您的專注力。"
      solved={state.done}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-card p-3 shadow-lg">
        {state.tiles.map((val, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            disabled={state.cleared[i]}
            className={`lp-nums flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold transition-all active:scale-90 ${
              state.cleared[i]
                ? "bg-primary/20 text-primary/40"
                : wrongIdx === i
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-muted text-foreground"
            }`}
          >
            {state.cleared[i] ? "✓" : val}
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
