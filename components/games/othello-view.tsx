"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import { OTH_SIZE, otEmpty, otLegalMoves, otMove, otAiMove, type OTState } from "@/lib/games/othello"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound } from "@/lib/games/game-audio"

export function OthelloView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<OTState>(otEmpty())

  const legal = state.status === "playing" ? otLegalMoves(state.board, state.turn) : []

  useEffect(() => {
    if (mode === "ai" && state.turn === 2 && state.status === "playing") {
      const t = setTimeout(() => {
        const best = otAiMove(state)
        const move = applyDifficulty(difficulty, best >= 0 ? best : null, legal)
        if (move !== null && move >= 0) {
          if (soundOn) playCaptureSound()
          setState((s) => otMove(s, Math.floor(move / OTH_SIZE), move % OTH_SIZE))
        }
      }, 500)
      return () => clearTimeout(t)
    }
  }, [mode, state, difficulty, legal])

  const restart = () => setState(otEmpty())
  const black = state.board.filter((x) => x === 1).length
  const white = state.board.filter((x) => x === 2).length

  const result =
    state.status === "win" ? (state.winner ? (state.winner === 1 ? "win" : "loss") : "draw") : null

  const statusText =
    state.status === "win"
      ? state.winner
        ? state.winner === 1
          ? `您獲勝了！ 黑 ${black} · 白 ${white}`
          : `${mode === "ai" ? "AI" : "玩家二"}獲勝 黑 ${black} · 白 ${white}`
        : `平手 黑 ${black} · 白 ${white}`
      : `黑 ${black} · 白 ${white} · ${
          state.turn === 1
            ? mode === "ai"
              ? "您的回合"
              : "玩家一回合"
            : mode === "ai"
              ? "AI 思考中…"
              : "玩家二回合"
        }`

  return (
    <BoardShell
      gameId="othello"
      title="黑白棋"
      subtitle="標準規格"
      status={statusText}
      result={result}
      rulesBrief="輪流放置棋子，只要能夾住對方棋子即可翻轉為己方顏色，終局時棋子較多者獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        setState(otEmpty())
      }}
    >
      <div className="w-[min(92vw,360px)] shrink-0">
        <div className="grid grid-cols-8 gap-[2px] rounded-xl border border-border bg-[#1f6b3a] p-2">
          {state.board.map((cell, i) => {
            const r = Math.floor(i / OTH_SIZE)
            const c = i % OTH_SIZE
            const isLegal = legal.includes(i) && !(mode === "ai" && state.turn === 2)
            return (
              <button
                key={i}
                onClick={() => {
                  if (isLegal) {
                    if (soundOn) playCaptureSound()
                    setState((s) => otMove(s, r, c))
                  }
                }}
                className="relative flex aspect-square items-center justify-center border border-[#1f6b3a] bg-[#2c8049]"
              >
                {cell !== 0 && (
                  <span
                    className={`h-[80%] w-[80%] rounded-full shadow-[0_2px_3px_rgba(0,0,0,0.45)] ${
                      cell === 1
                        ? "bg-gradient-to-br from-neutral-600 via-neutral-900 to-black"
                        : "bg-gradient-to-br from-white via-neutral-100 to-neutral-300"
                    }`}
                  />
                )}
                {cell === 0 && isLegal && <span className="h-2 w-2 rounded-full bg-white/40" />}
              </button>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
