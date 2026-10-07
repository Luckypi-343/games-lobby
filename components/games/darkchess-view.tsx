"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell } from "./board-shell"
import {
  DC_COLS,
  DC_ROWS,
  DC_LABELS,
  dcAiAction,
  dcFlip,
  dcInitial,
  dcMove,
  dcMovesFor,
  type DCState,
  type DCVariant,
} from "@/lib/games/darkchess"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { startBgm, stopBgm, playBrakeClick, playWinSound } from "@/lib/luckypi/reel-audio"

type DCAction = { type: "flip" | "move"; from?: number; to: number }

// The board is transposed for display so the standard 8x4 layout fits a portrait screen
// as 4 columns x 8 rows, without rotating any text.
function toDisplay(index: number) {
  const row = Math.floor(index / DC_COLS)
  const col = index % DC_COLS
  return { dispRow: col, dispCol: DC_ROWS - 1 - row }
}

export function DarkChessView({ onBack, variant }: { onBack: () => void; variant: DCVariant }) {
  const { difficulty, musicOn, soundOn } = useLuckyPi()
  const hue = variant === "traditional" ? 24 : 44
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<DCState>(() => dcInitial(variant))
  const [selected, setSelected] = useState<number | null>(null)
  const [hint, setHint] = useState<string | null>(null)
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const soundedResultRef = useRef<string | null>(null)

  const legal = selected !== null ? dcMovesFor(state, selected) : []

  const showHint = (msg: string) => {
    setHint(msg)
    if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    hintTimerRef.current = setTimeout(() => setHint(null), 900)
  }

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (musicOn) startBgm(hue)
    return () => stopBgm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicOn, hue])

  useEffect(() => {
    if (mode === "ai" && state.turn === "b" && state.status === "playing") {
      const t = setTimeout(() => {
        const best: DCAction | null = dcAiAction(state)
        const pool: DCAction[] = []
        state.board.forEach((cell, i) => {
          if (!cell) return
          if (!cell.faceUp) pool.push({ type: "flip", to: i })
          else if (cell.piece.color === state.turn) {
            dcMovesFor(state, i).forEach((to) => pool.push({ type: "move", from: i, to }))
          }
        })
        const action = applyDifficulty(difficulty, best, pool)
        if (!action) return
        const captured = action.type === "move" ? state.board[action.to] : null
        if (soundOn) playBrakeClick(hue)
        if (action.type === "flip") showHint("電腦翻棋")
        else if (captured) showHint(`電腦吃子：${DC_LABELS[captured.piece.color][captured.piece.type]}`)
        setState((s) => (action.type === "flip" ? dcFlip(s, action.to) : dcMove(s, action.from!, action.to)))
      }, 550)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, state, difficulty])

  const result = state.status === "over" ? (state.winner === "r" ? "win" : "loss") : null

  useEffect(() => {
    if (!result) {
      soundedResultRef.current = null
      return
    }
    const key = `${state.board.filter((c) => c).length}-${result}`
    if (soundedResultRef.current === key) return
    soundedResultRef.current = key
    if (soundOn) playWinSound(hue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  const restart = () => {
    setState(dcInitial(variant))
    setSelected(null)
    setHint(null)
  }

  const handleClick = (i: number) => {
    if (state.status !== "playing" || (mode === "ai" && state.turn === "b")) return
    const cell = state.board[i]
    if (selected !== null && legal.includes(i)) {
      const captured = state.board[i]
      if (soundOn) playBrakeClick(hue)
      if (captured) showHint(`吃子！${DC_LABELS[captured.piece.color][captured.piece.type]}`)
      setState((s) => dcMove(s, selected, i))
      setSelected(null)
      return
    }
    if (!cell) {
      setSelected(null)
      return
    }
    if (!cell.faceUp) {
      if (soundOn) playBrakeClick(hue)
      showHint("翻棋！")
      setState((s) => dcFlip(s, i))
      setSelected(null)
      return
    }
    if (cell.piece.color === state.turn) setSelected(i)
    else setSelected(null)
  }

  const statusText =
    state.status === "over"
      ? `對局結束 · ${state.winner === "r" ? "紅方" : "黑方"}勝`
      : `${state.turn === "r" ? "紅方" : "黑方"}回合${mode === "ai" && state.turn === "b" ? " · AI 思考中…" : ""}`

  return (
    <BoardShell
      gameId={variant === "traditional" ? "darkchess-classic" : "darkchess-variant"}
      title={variant === "traditional" ? "象棋暗棋" : "象棋暗棋（變異）"}
      subtitle={variant === "traditional" ? "逐格移動 · 以階級決勝負" : "原棋子走法 · 落點吃子"}
      status={statusText}
      result={result}
      compact
      rulesBrief="所有棋子背面朝上，翻開後依大小順序互相吃子，吃光對方棋子或使對方無棋可走者獲勝。點選暗棋即可翻開，點選己方明棋後點目標格移動或吃子。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div className="relative">
        <div
          className="grid gap-1 rounded-lg border-2 border-amber-800 bg-amber-100 p-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]"
          style={{
            gridTemplateColumns: `repeat(${DC_ROWS}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${DC_COLS}, minmax(0, 1fr))`,
            width: "min(78vw, 300px)",
            aspectRatio: `${DC_ROWS} / ${DC_COLS}`,
          }}
        >
          {state.board.map((cell, i) => {
            const isSelected = selected === i
            const isLegal = legal.includes(i)
            const { dispRow, dispCol } = toDisplay(i)
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                style={{ gridRow: dispRow + 1, gridColumn: dispCol + 1 }}
                className="relative flex aspect-square items-center justify-center rounded-md border border-amber-800/30 bg-amber-50"
              >
                {isLegal && (
                  <span
                    className={`absolute rounded-full ${cell ? "ring-2 ring-primary/80" : "h-2 w-2 bg-primary/70"}`}
                    style={cell ? { width: "88%", height: "88%", background: "transparent" } : undefined}
                  />
                )}
                {cell && !cell.faceUp && (
                  <span className="flex h-[85%] w-[85%] items-center justify-center rounded-full bg-gradient-to-br from-amber-600 via-amber-800 to-amber-950 text-xs font-bold text-amber-100 shadow-[0_2px_3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)]">
                    暗
                  </span>
                )}
                {cell && cell.faceUp && (
                  <span
                    className={`flex h-[85%] w-[85%] items-center justify-center rounded-full border-[2.5px] font-serif text-base font-bold shadow-[0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_3px_rgba(0,0,0,0.12)] ${
                      cell.piece.color === "r"
                        ? "border-red-800 bg-gradient-to-br from-amber-50 via-red-50 to-red-100 text-red-700"
                        : "border-neutral-900 bg-gradient-to-br from-stone-50 via-neutral-100 to-stone-200 text-neutral-900"
                    } ${isSelected ? "ring-[3px] ring-primary ring-offset-1 ring-offset-amber-50" : ""}`}
                  >
                    {DC_LABELS[cell.piece.color][cell.piece.type]}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {hint && (
          <div className="pointer-events-none absolute inset-x-0 -top-3 flex justify-center">
            <span className="animate-in fade-in slide-in-from-bottom-1 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-primary shadow-lg">
              {hint}
            </span>
          </div>
        )}
      </div>
    </BoardShell>
  )
}
