"use client"

import { useEffect, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { mmNew, mmFlip, mmClearFlip, mmIsSolved, type MmState } from "@/lib/games/memory-match"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

export function MemoryMatchView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<MmState>(() => mmNew())

  const solved = mmIsSolved(state)

  const restart = () => setState(mmNew())

  useEffect(() => {
    if (state.flipped.length === 2) {
      const timer = setTimeout(() => setState((s) => mmClearFlip(s)), 700)
      return () => clearTimeout(timer)
    }
  }, [state.flipped])

  const tap = (index: number) => {
    if (state.flipped.length >= 2) return
    if (soundOn) playMoveSound()
    setState((s) => mmFlip(s, index))
  }

  return (
    <PuzzleShell
      gameId="memory-match"
      title="翻牌記憶"
      subtitle="配對挑戰"
      status={solved ? "全部配對成功！" : `翻牌次數：${state.moves}`}
      rulesBrief="翻開兩張卡牌，配對成功的圖案會保留在桌面，用最少翻牌次數配對完所有卡牌者獲勝。"
      solved={solved}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="grid grid-cols-4 gap-2 rounded-2xl border border-border bg-card p-3 shadow-lg">
        {state.cards.map((card, i) => {
          const shown = card.matched || state.flipped.includes(i)
          return (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={shown}
              className={`flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition active:scale-95 ${
                shown ? (card.matched ? "bg-primary/20" : "bg-accent/30") : "bg-muted"
              }`}
            >
              {shown ? card.symbol : ""}
            </button>
          )
        })}
      </div>
    </PuzzleShell>
  )
}
