"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import {
  LZ_CAMPS,
  LZ_COLS,
  LZ_LABELS,
  lzAiMove,
  lzInitial,
  lzMove,
  lzMovesFor,
  type LZState,
} from "@/lib/games/luzhanqi"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"

export function LuzhanqiView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<LZState>(() => lzInitial())
  const [selected, setSelected] = useState<number | null>(null)

  const legal = selected !== null ? lzMovesFor(state, selected) : []

  useEffect(() => {
    if (mode === "ai" && state.turn === "b" && state.status === "playing") {
      const t = setTimeout(() => {
        const best = lzAiMove(state)
        const pool: { from: number; to: number }[] = []
        state.board.forEach((piece, i) => {
          if (piece && piece.color === state.turn) {
            lzMovesFor(state, i).forEach((to) => pool.push({ from: i, to }))
          }
        })
        const move = applyDifficulty(difficulty, best, pool)
        if (move) {
          const hadTarget = !!state.board[move.to]
          if (soundOn) (hadTarget ? playCaptureSound() : playMoveSound())
          setState((s) => lzMove(s, move.from, move.to))
        }
      }, 550)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, state, difficulty])

  const restart = () => {
    setState(lzInitial())
    setSelected(null)
  }

  const result = state.status === "over" ? (state.winner === "r" ? "win" : "loss") : null

  const handleClick = (i: number) => {
    if (state.status !== "playing" || (mode === "ai" && state.turn === "b")) return
    const piece = state.board[i]
    if (selected !== null && legal.includes(i)) {
      const hadTarget = !!state.board[i]
      if (soundOn) (hadTarget ? playCaptureSound() : playMoveSound())
      setState((s) => lzMove(s, selected, i))
      setSelected(null)
      return
    }
    if (piece && piece.color === state.turn) setSelected(i)
    else setSelected(null)
  }

  const statusText =
    state.status === "over"
      ? `${state.winner === "r" ? "紅方" : "黑方"}獲勝！${state.message ?? ""}`
      : `${state.turn === "r" ? "紅方" : "黑方"}回合${state.message ? " · " + state.message : ""}${
          mode === "ai" && state.turn === "b" ? " · AI 思考中…" : ""
        }`

  return (
    <BoardShell
      gameId="luzhanqi"
      title="陸軍棋"
      subtitle="隱藏軍階 · 奪旗致勝"
      status={statusText}
      result={result}
      rulesBrief="雙方輪流移動棋子，軍階保密。攻擊時比較軍階大小，較大者獲勝；成功奪取對方軍旗即獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div
        className="grid gap-[2px] rounded-lg border-2 border-emerald-800 bg-emerald-50 p-2"
        style={{ gridTemplateColumns: `repeat(${LZ_COLS}, minmax(0, 1fr))`, width: "min(78vw, 260px)" }}
      >
        {state.board.map((piece, i) => {
          const isSelected = selected === i
          const isLegal = legal.includes(i)
          const isCamp = LZ_CAMPS.has(i)
          const isOwn = piece && piece.color === state.turn
          const isVisible = mode === "two" || (piece && piece.color === "r")
          return (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className={`relative flex aspect-square items-center justify-center rounded-sm border ${
                isCamp ? "border-emerald-600 bg-emerald-200" : "border-emerald-800/20 bg-emerald-100"
              }`}
            >
              {isLegal && <span className="absolute h-1.5 w-1.5 rounded-full bg-primary/70" />}
              {piece && (
                <span
                  className={`flex h-[88%] w-[88%] items-center justify-center rounded-sm text-[8px] font-bold leading-none shadow-[0_1px_2px_rgba(0,0,0,0.4)] ${
                    piece.color === "r"
                      ? "bg-gradient-to-br from-red-50 via-red-100 to-red-200 text-red-800"
                      : "bg-gradient-to-br from-neutral-600 via-neutral-800 to-black text-neutral-100"
                  } ${isSelected ? "ring-2 ring-primary" : ""}`}
                >
                  {isVisible ? LZ_LABELS[piece.type] : "?"}
                </span>
              )}
            </button>
          )
        })}
      </div>
      <p className="max-w-[260px] text-center text-[11px] text-muted-foreground">
        綠色格為安全營地，敵方無法攻入。對手棋子軍階保密，只有己方（紅方）看得到。
      </p>
    </BoardShell>
  )
}
