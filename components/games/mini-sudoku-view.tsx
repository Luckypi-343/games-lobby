"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { sdNew, sdSelect, sdInput, sdClear, sdConflicts, sdWon, SD_SIZE, type SdState } from "@/lib/games/mini-sudoku"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound } from "@/lib/games/game-audio"

export function MiniSudokuView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<SdState>(() => sdNew())

  const restart = () => setState(sdNew())
  const won = sdWon(state)
  const conflicts = sdConflicts(state.values)

  const input = (num: number) => {
    if (won || state.selected === null) return
    if (soundOn) playMoveSound()
    setState((s) => sdInput(s, num))
  }

  return (
    <PuzzleShell
      gameId="mini-sudoku"
      title="迷你數獨"
      subtitle="6x6 盤面，1 到 6 不重複"
      status={won ? "恭喜完成！" : "點選空格後從下方選數字填入"}
      rulesBrief="每一行、每一欄、每個 2x3 小宮格內，數字 1 到 6 都不能重複出現，填滿整個盤面且沒有衝突即可過關。"
      solved={won}
      cost={15}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-[3px] rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${SD_SIZE}, minmax(0, 1fr))`, width: 240 }}
      >
        {state.values.map((v, i) => {
          const r = Math.floor(i / SD_SIZE)
          const c = i % SD_SIZE
          const boxBorder = `${c % 3 === 2 && c !== SD_SIZE - 1 ? "border-r-2 border-r-foreground/40" : ""} ${
            r % 2 === 1 && r !== SD_SIZE - 1 ? "border-b-2 border-b-foreground/40" : ""
          }`
          return (
            <button
              key={i}
              onClick={() => {
                if (conflicts[i] && soundOn) playLossSound()
                setState((s) => sdSelect(s, i))
              }}
              className={`lp-nums flex aspect-square items-center justify-center rounded-sm text-sm font-bold transition-all active:scale-90 ${boxBorder} ${
                state.given[i]
                  ? "bg-muted/40 text-foreground"
                  : state.selected === i
                    ? "bg-primary/30 text-foreground ring-2 ring-primary"
                    : conflicts[i] && v !== null
                      ? "bg-destructive/20 text-destructive"
                      : "bg-muted/10 text-foreground"
              }`}
            >
              {v ?? ""}
            </button>
          )
        })}
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => input(n)}
            className="lp-nums flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-sm font-bold text-foreground active:scale-90"
          >
            {n}
          </button>
        ))}
        <button
          onClick={() => setState((s) => sdClear(s))}
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive/20 text-xs font-bold text-destructive active:scale-90"
        >
          清除
        </button>
      </div>
    </PuzzleShell>
  )
}
