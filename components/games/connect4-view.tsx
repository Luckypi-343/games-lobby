"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import { c4Empty, c4Move, c4BestMove, c4ValidCols, C4_ROWS, C4_COLS, type C4State } from "@/lib/games/connect4"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

const DISC_COLOR: Record<0 | 1 | 2, string> = {
  0: "bg-background",
  1: "bg-primary",
  2: "bg-accent",
}

export function Connect4View({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<C4State>(c4Empty())

  useEffect(() => {
    if (mode === "ai" && state.turn === 2 && state.status === "playing") {
      const timer = setTimeout(() => {
        const cols = c4ValidCols(state.board)
        const best = c4BestMove(state)
        const move = applyDifficulty(difficulty, best, cols)
        if (move === null) return
        if (soundOn) playMoveSound()
        setState((s) => c4Move(s, move))
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [mode, state, difficulty, soundOn])

  const restart = () => setState(c4Empty())

  const result = state.status === "win" ? (state.winner === 1 ? "win" : "loss") : state.status === "draw" ? "draw" : null

  const statusText =
    state.status === "win"
      ? state.winner === 1
        ? "您獲勝了！"
        : mode === "ai"
          ? "AI 獲勝"
          : "玩家二獲勝"
      : state.status === "draw"
        ? "平手"
        : state.turn === 1
          ? mode === "ai"
            ? "您的回合"
            : "玩家一回合"
          : mode === "ai"
            ? "AI 思考中…"
            : "玩家二回合"

  return (
    <BoardShell
      gameId="connect4"
      title="四子棋"
      subtitle="AI單人／雙人"
      status={statusText}
      result={result}
      rulesBrief="雙方輪流將棋子投入直立棋盤，率先在橫、豎或斜方向連成四子者獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        setState(c4Empty())
      }}
    >
      <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-card p-2.5 shadow-lg">
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: C4_COLS }, (_, col) => (
            <button
              key={col}
              onClick={() => {
                if (state.status !== "playing") return
                if (mode === "ai" && state.turn === 2) return
                if (soundOn) playMoveSound()
                setState((s) => c4Move(s, col))
              }}
              disabled={state.status !== "playing" || (mode === "ai" && state.turn === 2)}
              className="flex h-6 w-9 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground transition active:scale-90 disabled:opacity-40"
            >
              ↓
            </button>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 rounded-xl bg-primary/10 p-1.5">
          {Array.from({ length: C4_ROWS * C4_COLS }, (_, i) => {
            const cell = state.board[i] as 0 | 1 | 2
            const onLine = state.line?.includes(i)
            return (
              <div
                key={i}
                className={`flex h-9 w-9 items-center justify-center rounded-full ${
                  cell === 0 ? "bg-background/60" : "shadow-inner"
                }`}
              >
                <div
                  className={`h-8 w-8 rounded-full transition ${DISC_COLOR[cell]} ${
                    onLine ? "ring-2 ring-offset-1 ring-foreground" : ""
                  }`}
                />
              </div>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
