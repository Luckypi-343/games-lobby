"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import {
  chessInitialBoard,
  chessLegalMoves,
  chessApplyMove,
  chessAllLegalMoves,
  chessStatus,
  chessBestMove,
  chessIsInCheck,
  CHESS_GLYPH,
  type ChessBoard,
  type ChessColor,
  type ChessMove,
} from "@/lib/games/chess"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"

// 全黑／全白的仿真立體棋子：用漸層上色＋多層陰影堆疊出浮雕般的光澤與厚度感，
// 取代原本扁平單色的文字棋子圖示，同時整體尺寸放大約 28%（text-2xl → text-[2.55rem]）。
function ChessPiece({ glyph, color }: { glyph: string; color: "w" | "b" }) {
  const isWhite = color === "w"
  return (
    <span
      className="select-none text-[2.55rem] leading-none"
      style={{
        backgroundImage: isWhite
          ? "linear-gradient(180deg, #ffffff 0%, #f1f1f1 35%, #cfcfcf 70%, #ffffff 100%)"
          : "linear-gradient(180deg, #4a4a4a 0%, #222222 35%, #000000 70%, #3a3a3a 100%)",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        filter: isWhite
          ? "drop-shadow(0 1px 0 #808080) drop-shadow(0 2px 2px rgba(0,0,0,0.45))"
          : "drop-shadow(0 1px 0 #000000) drop-shadow(0 2px 3px rgba(0,0,0,0.6)) drop-shadow(0 0 1px rgba(255,255,255,0.25))",
      }}
    >
      {glyph}
    </span>
  )
}

export function ChessView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [board, setBoard] = useState<ChessBoard>(() => chessInitialBoard())
  const [turn, setTurn] = useState<ChessColor>("w")
  const [selected, setSelected] = useState<number | null>(null)

  const status = chessStatus(board, turn)
  const inCheck = status === "playing" && chessIsInCheck(board, turn)
  const destinations = selected !== null ? chessLegalMoves(board, selected) : []
  const aiColor: ChessColor = "b"

  const restart = () => {
    setBoard(chessInitialBoard())
    setTurn("w")
    setSelected(null)
  }

  useEffect(() => {
    if (mode === "ai" && turn === aiColor && status === "playing") {
      const timer = setTimeout(() => {
        const allMoves = chessAllLegalMoves(board, aiColor)
        const best = chessBestMove(board, aiColor)
        const move = applyDifficulty(difficulty, best, allMoves)
        if (move) applyMove(move)
      }, 550)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, turn, board, status, difficulty])

  function applyMove(move: ChessMove) {
    const captured = !!board[move.to]
    if (soundOn) (captured ? playCaptureSound() : playMoveSound())
    setBoard((b) => chessApplyMove(b, move))
    setTurn((t) => (t === "w" ? "b" : "w"))
    setSelected(null)
  }

  function handleTap(i: number) {
    if (status !== "playing") return
    if (mode === "ai" && turn === aiColor) return
    const piece = board[i]
    const move = destinations.find((to) => to === i)
    if (selected !== null && move !== undefined) {
      applyMove({ from: selected, to: i })
      return
    }
    if (piece && piece.color === turn) {
      setSelected(i)
    } else {
      setSelected(null)
    }
  }

  const result =
    status === "checkmate" ? (turn === "w" ? "loss" : mode === "ai" ? "win" : "loss") : status === "stalemate" ? "draw" : null

  const statusText =
    status === "checkmate"
      ? turn === "w"
        ? mode === "ai"
          ? "被將死了，AI 獲勝"
          : "被將死了，黑方獲勝"
        : mode === "ai"
          ? "將死成功，您獲勝！"
          : "將死成功，白方獲勝！"
      : status === "stalemate"
        ? "無棋可走，和局"
        : turn === "w"
          ? inCheck
            ? "您被將軍了！"
            : "您的回合（白方）"
          : mode === "ai"
            ? "AI 思考中…"
            : inCheck
              ? "黑方被將軍了！"
              : "黑方回合"

  return (
    <BoardShell
      gameId="chess"
      title="國際象棋"
      subtitle="標準規則"
      status={statusText}
      result={result}
      rulesBrief="依照國際象棋標準規則移動棋子，將死對方國王即獲勝；本版本暫不支援王車易位與吃過路兵。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div className="w-[min(92vw,360px)] shrink-0">
        <div className="grid grid-cols-8 gap-[1px] rounded-xl border border-border bg-[#3a2a1d] p-2">
          {board.map((piece, i) => {
            const row = Math.floor(i / 8)
            const col = i % 8
            const dark = (row + col) % 2 === 1
            const isSel = selected === i
            const isDest = destinations.includes(i)
            return (
              <button
                key={i}
                onClick={() => handleTap(i)}
                className={`relative flex aspect-square items-center justify-center text-2xl ${
                  dark ? "bg-[#7a5a3a]" : "bg-[#e8d3ad]"
                } ${isSel ? "ring-2 ring-accent" : ""} ${isDest ? "ring-2 ring-primary" : ""}`}
              >
                {piece && <ChessPiece glyph={CHESS_GLYPH[piece.color][piece.type]} color={piece.color} />}
              </button>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
