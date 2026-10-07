"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { wsNew, wsTap, wsWon, WS_CAPACITY, WS_PALETTE, type WsState } from "@/lib/games/water-sort"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound } from "@/lib/games/game-audio"

export function WaterSortView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<WsState>(() => wsNew())
  const won = wsWon(state.tubes)

  const restart = () => setState(wsNew())

  const tap = (i: number) => {
    if (won) return
    setState((s) => {
      const next = wsTap(s, i)
      if (soundOn) {
        if (next.moves > s.moves) playMoveSound()
        else if (s.selected !== null && s.selected !== i) playLossSound()
      }
      return next
    })
  }

  return (
    <PuzzleShell
      gameId="water-sort"
      title="分色排序"
      subtitle="把顏色倒一倒排整齊"
      status={won ? "全部排序完成！" : `步數：${state.moves}`}
      rulesBrief="點選一支試管選取最上層顏色，再點選另一支試管即可倒入（只能倒到空試管或最上層同色的試管）。把每支試管都排成單一顏色即可過關。"
      solved={won}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="flex flex-wrap justify-center gap-2.5 rounded-2xl border border-border bg-card p-3 shadow-lg" style={{ width: 280 }}>
        {state.tubes.map((tube, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`relative flex h-28 w-8 flex-col-reverse overflow-hidden rounded-b-lg rounded-t-sm border-2 bg-muted/10 ${
              state.selected === i ? "border-primary ring-2 ring-primary/50 -translate-y-1" : "border-border"
            } transition-all`}
          >
            {tube.map((color, j) => (
              <div key={j} className={`w-full flex-1 ${WS_PALETTE[color]}`} />
            ))}
            {Array.from({ length: WS_CAPACITY - tube.length }, (_, j) => (
              <div key={`e${j}`} className="w-full flex-1" />
            ))}
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
