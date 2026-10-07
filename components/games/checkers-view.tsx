"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import { CK_SIZE, ckEmpty, ckMovesFor, ckApply, ckAiMove, type CKState } from "@/lib/games/checkers"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"

export function CheckersView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<CKState>(ckEmpty())
  const [selected, setSelected] = useState<number | null>(null)

  const legalMoves = state.status === "playing" ? ckMovesFor(state.board, state.turn) : []
  const selectable = Array.from(new Set(legalMoves.map((m) => m.from)))
  const destinations = selected !== null ? legalMoves.filter((m) => m.from === selected) : []

  useEffect(() => {
    if (mode === "ai" && state.turn === 2 && state.status === "playing") {
      const t = setTimeout(() => {
        const best = ckAiMove(state)
        const move = applyDifficulty(difficulty, best, legalMoves)
        if (move) {
          if (soundOn) (Math.abs(move.to - move.from) > 9 ? playCaptureSound() : playMoveSound())
          setState((s) => ckApply(s, move))
        }
        setSelected(null)
      }, 500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, state, difficulty])

  const restart = () => {
    setState(ckEmpty())
    setSelected(null)
  }

  function handleTap(i: number) {
    if (state.status !== "playing") return
    if (mode === "ai" && state.turn === 2) return
    const move = destinations.find((m) => m.to === i)
    if (move) {
      if (soundOn) (Math.abs(move.to - move.from) > 9 ? playCaptureSound() : playMoveSound())
      setState((s) => ckApply(s, move))
      setSelected(null)
      return
    }
    setSelected(selectable.includes(i) ? i : null)
  }

  const result = state.status === "win" ? (state.winner === 1 ? "win" : "loss") : null

  const statusText =
    state.status === "win"
      ? state.winner === 1
        ? "您獲勝了！"
        : mode === "ai"
          ? "AI 獲勝"
          : "玩家二獲勝"
      : state.turn === 1
        ? mode === "ai"
          ? "您的回合"
          : "玩家一回合"
        : mode === "ai"
          ? "AI 思考中…"
          : "玩家二回合"

  return (
    <BoardShell
      gameId="checkers"
      title="跳棋"
      subtitle="標準規格"
      status={statusText}
      result={result}
      rulesBrief="斜向移動棋子，跳過並吃掉對方棋子；棋子走到底線可升級為王，可前後斜走。吃光對方或使其無棋可走者獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div className="w-[min(92vw,360px)] shrink-0">
        <div className="grid grid-cols-8 gap-[2px] rounded-xl border border-border bg-[#3a2a1d] p-2">
          {state.board.map((piece, i) => {
            const r = Math.floor(i / CK_SIZE)
            const c = i % CK_SIZE
            const dark = (r + c) % 2 === 1
            const isDest = destinations.some((m) => m.to === i)
            const isSel = selected === i
            return (
              <button
                key={i}
                onClick={() => handleTap(i)}
                className={`relative flex aspect-square items-center justify-center ${dark ? "bg-[#7a5a3a]" : "bg-[#e8d3ad]"} ${
                  isDest ? "ring-2 ring-primary" : ""
                } ${isSel ? "ring-2 ring-accent" : ""}`}
              >
                {piece !== 0 && (
                  <span
                    className={`flex h-[75%] w-[75%] items-center justify-center rounded-full border-2 shadow-[0_2px_3px_rgba(0,0,0,0.5)] ${
                      piece === 1 || piece === 3
                        ? "border-red-900 bg-gradient-to-br from-red-400 via-red-600 to-red-800"
                        : "border-neutral-800 bg-gradient-to-br from-neutral-600 via-neutral-800 to-black"
                    }`}
                  >
                    {(piece === 3 || piece === 4) && <span className="text-[10px] font-bold text-white drop-shadow">王</span>}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
