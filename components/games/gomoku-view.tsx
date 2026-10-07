"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import { GOMOKU_SIZE, gkEmpty, gkMove, gkAiMove, type GKState } from "@/lib/games/gomoku"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

export function GomokuView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<GKState>(gkEmpty())

  useEffect(() => {
    if (mode === "ai" && state.turn === 2 && state.status === "playing") {
      const t = setTimeout(() => {
        const best = gkAiMove(state)
        const empties: { r: number; c: number }[] = []
        state.board.forEach((cell, i) => {
          if (cell === 0) empties.push({ r: Math.floor(i / GOMOKU_SIZE), c: i % GOMOKU_SIZE })
        })
        const move = applyDifficulty(difficulty, best, empties)!
        if (soundOn) playMoveSound()
        setState((s) => gkMove(s, move.r, move.c))
      }, 400)
      return () => clearTimeout(t)
    }
  }, [mode, state, difficulty])

  const restart = () => setState(gkEmpty())

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
            ? "您的回合（黑子）"
            : "玩家一回合（黑子）"
          : mode === "ai"
            ? "AI 思考中…"
            : "玩家二回合（白子）"

  return (
    <BoardShell
      gameId="gomoku"
      title="五子棋"
      subtitle="17×17"
      status={statusText}
      result={result}
      rulesBrief="輪流在棋盤交叉點放置棋子，率先在橫、豎或斜方向連成五子者獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        setState(gkEmpty())
      }}
    >
      <div className="w-[min(94vw,380px)] shrink-0 overflow-x-auto">
        <div
          className="grid gap-[1px] rounded-xl border border-border bg-[#c9a06a] p-2"
          style={{ gridTemplateColumns: `repeat(${GOMOKU_SIZE}, minmax(0, 1fr))`, width: "min(94vw, 380px)" }}
        >
          {state.board.map((cell, i) => {
            const r = Math.floor(i / GOMOKU_SIZE)
            const c = i % GOMOKU_SIZE
            return (
              <button
                key={i}
                onClick={() => {
                  if (state.status !== "playing") return
                  if (mode === "ai" && state.turn === 2) return
                  if (soundOn) playMoveSound()
                  setState((s) => gkMove(s, r, c))
                }}
                className="relative flex aspect-square items-center justify-center"
              >
                <span className="absolute inset-0 border border-[#8a6a3f]/40" />
                {cell !== 0 && (
                  <span
                    className={`relative z-10 h-[80%] w-[80%] rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.4)] ${
                      cell === 1
                        ? "bg-gradient-to-br from-neutral-600 via-neutral-900 to-black"
                        : "bg-gradient-to-br from-white via-neutral-100 to-neutral-300"
                    } ${state.winLine?.includes(i) ? "ring-2 ring-primary" : ""}`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
