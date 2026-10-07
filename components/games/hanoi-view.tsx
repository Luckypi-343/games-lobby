"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { hnNew, hnMove, hnCanMove, hnMinMoves, HN_DISKS, type HnState } from "@/lib/games/hanoi"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound } from "@/lib/games/game-audio"

// 立體套環造型：每個圓盤用漸層＋內凹高光做出中空套環的厚度與光澤感，
// 取代原本扁平單色長條，讓套環看起來像是真的疊放在柱子上。
const DISK_GRADIENT = [
  "linear-gradient(180deg, #fca5a5 0%, #e11d48 55%, #9f1239 100%)",
  "linear-gradient(180deg, #fdba74 0%, #ea580c 55%, #9a3412 100%)",
  "linear-gradient(180deg, #fde68a 0%, #d97706 55%, #92400e 100%)",
  "linear-gradient(180deg, #6ee7b7 0%, #059669 55%, #065f46 100%)",
  "linear-gradient(180deg, #7dd3fc 0%, #0284c7 55%, #075985 100%)",
  "linear-gradient(180deg, #a5b4fc 0%, #4f46e5 55%, #3730a3 100%)",
]

export function HanoiView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<HnState>(() => hnNew())
  const [selected, setSelected] = useState<number | null>(null)

  const restart = () => {
    setState(hnNew())
    setSelected(null)
  }

  const tapPeg = (idx: number) => {
    if (state.won) return
    if (selected === null) {
      if (state.pegs[idx].length > 0) setSelected(idx)
      return
    }
    if (selected === idx) {
      setSelected(null)
      return
    }
    if (hnCanMove(state, selected, idx)) {
      if (soundOn) playMoveSound()
      setState((s) => hnMove(s, selected, idx))
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  const minMoves = hnMinMoves(HN_DISKS)

  return (
    <PuzzleShell
      gameId="hanoi"
      title="河內塔"
      subtitle="把整疊圓盤移到最右邊"
      status={`步數：${state.moves}　最少步數：${minMoves}`}
      rulesBrief="點選一根柱子選取最上方的圓盤，再點選目標柱子即可移動。大圓盤不能疊在小圓盤上面，把所有圓盤移到最右邊柱子就過關。"
      solved={state.won}
      cost={12}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="flex items-end justify-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-lg" style={{ height: 180, width: 260 }}>
        {state.pegs.map((peg, idx) => (
          <button
            key={idx}
            onClick={() => tapPeg(idx)}
            className="relative flex h-full flex-1 flex-col items-center justify-end"
          >
            <div
              className={`absolute bottom-0 w-1.5 rounded-t-sm ${selected === idx ? "bg-primary" : "bg-border"}`}
              style={{ height: "90%" }}
            />
            <div className="relative z-10 flex flex-col-reverse items-center gap-0.5 pb-1">
              {peg.map((disk, i) => (
                <div
                  key={i}
                  className={`h-5 rounded-full border border-black/20 ${
                    selected === idx && i === peg.length - 1 ? "ring-2 ring-foreground ring-offset-1" : ""
                  }`}
                  style={{
                    width: `${20 + disk * 12}px`,
                    backgroundImage: DISK_GRADIENT[disk - 1] ?? DISK_GRADIENT[0],
                    boxShadow:
                      "inset 0 2px 1px rgba(255,255,255,0.6), inset 0 -3px 3px rgba(0,0,0,0.35), 0 2px 3px rgba(0,0,0,0.35)",
                  }}
                />
              ))}
            </div>
            <div className="absolute -bottom-4 h-1.5 w-full rounded-full bg-muted" />
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
