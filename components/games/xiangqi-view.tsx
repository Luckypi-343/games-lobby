"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell } from "./board-shell"
import { XQ_COLS, XQ_ROWS, XQ_LABELS, xqInitial, xqLegalMoves, xqMove, xqAiMove, type XQState } from "@/lib/games/xiangqi"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { startBgm, stopBgm, playBrakeClick, playWinSound } from "@/lib/luckypi/reel-audio"

const XQ_HUE = 18

// Traditional cross-mark points (cannon + soldier starting intersections).
const MARK_POINTS = new Set<string>()
;[
  [1, 2], [7, 2], [1, 7], [7, 7], // cannons
  [0, 3], [2, 3], [4, 3], [6, 3], [8, 3], // black soldiers
  [0, 6], [2, 6], [4, 6], [6, 6], [8, 6], // red soldiers
].forEach(([c, r]) => MARK_POINTS.add(`${c},${r}`))

function xPct(col: number) {
  return (col / (XQ_COLS - 1)) * 100
}
function yPct(row: number) {
  return (row / (XQ_ROWS - 1)) * 100
}

function CrossMark({ col, row }: { col: number; row: number }) {
  const left = col > 0
  const right = col < XQ_COLS - 1
  const size = 6
  const gap = 2.6
  return (
    <div
      className="pointer-events-none absolute"
      style={{ left: `${xPct(col)}%`, top: `${yPct(row)}%`, width: 0, height: 0 }}
    >
      {left && (
        <>
          <span className="absolute bg-amber-900/55" style={{ width: size, height: 1, right: gap, top: -size / 2 }} />
          <span className="absolute bg-amber-900/55" style={{ width: size, height: 1, right: gap, top: size / 2 }} />
          <span className="absolute bg-amber-900/55" style={{ width: 1, height: size, right: gap, top: -size }} />
          <span className="absolute bg-amber-900/55" style={{ width: 1, height: size, right: gap, top: gap }} />
        </>
      )}
      {right && (
        <>
          <span className="absolute bg-amber-900/55" style={{ width: size, height: 1, left: gap, top: -size / 2 }} />
          <span className="absolute bg-amber-900/55" style={{ width: size, height: 1, left: gap, top: size / 2 }} />
          <span className="absolute bg-amber-900/55" style={{ width: 1, height: size, left: gap, top: -size }} />
          <span className="absolute bg-amber-900/55" style={{ width: 1, height: size, left: gap, top: gap }} />
        </>
      )}
    </div>
  )
}

export function XiangqiView({ onBack }: { onBack: () => void }) {
  const { difficulty, musicOn, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<XQState>(xqInitial())
  const [selected, setSelected] = useState<number | null>(null)
  const soundedResultRef = useRef<string | null>(null)

  const legal = selected !== null ? xqLegalMoves(state, selected) : []

  useEffect(() => {
    if (musicOn) startBgm(XQ_HUE)
    return () => stopBgm()
  }, [musicOn])

  useEffect(() => {
    if (mode === "ai" && state.turn === "b" && state.status === "playing") {
      const t = setTimeout(() => {
        const best = xqAiMove(state)
        const pool: { from: number; to: number }[] = []
        state.board.forEach((piece, i) => {
          if (piece && piece.color === state.turn) {
            xqLegalMoves(state, i).forEach((to) => pool.push({ from: i, to }))
          }
        })
        const move = applyDifficulty(difficulty, best, pool)
        if (move) {
          if (soundOn) playBrakeClick(XQ_HUE)
          setState((s) => xqMove(s, move.from, move.to))
        }
      }, 500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, state, difficulty])

  const result =
    state.status === "checkmate" ? (state.turn === "r" ? "loss" : "win") : state.status === "stalemate" ? "draw" : null

  useEffect(() => {
    if (!result) {
      soundedResultRef.current = null
      return
    }
    const key = `${state.board.length}-${result}`
    if (soundedResultRef.current === key) return
    soundedResultRef.current = key
    if (soundOn) playWinSound(XQ_HUE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  const restart = () => {
    setState(xqInitial())
    setSelected(null)
  }

  const handleClick = (i: number) => {
    if (state.status !== "playing" || (mode === "ai" && state.turn === "b")) return
    const piece = state.board[i]
    if (selected !== null && legal.includes(i)) {
      if (soundOn) playBrakeClick(XQ_HUE)
      setState((s) => xqMove(s, selected, i))
      setSelected(null)
      return
    }
    if (piece && piece.color === state.turn) setSelected(i)
    else setSelected(null)
  }

  const statusText =
    state.status === "checkmate"
      ? `${state.turn === "r" ? "紅" : "黑"}方被將死 · ${state.turn === "r" ? "黑" : "紅"}方勝`
      : state.status === "stalemate"
        ? "無棋可走 · 和局"
        : `${state.turn === "r" ? "紅方" : "黑方"}回合${state.inCheck ? " · 將軍！" : ""}${
            mode === "ai" && state.turn === "b" ? " · AI 思考中…" : ""
          }`

  const hitW = 100 / (XQ_COLS - 1)
  const hitH = 100 / (XQ_ROWS - 1)

  return (
    <BoardShell
      gameId="xiangqi"
      title="中國象棋"
      subtitle="標準格局 · 楚河漢界"
      status={statusText}
      result={result}
      rulesBrief="輪流移動棋子，率先將對方主帥（將）逼入無路可走者獲勝。車直走、馬走日字、象走田字、士走斜線，兵過河後可橫走。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div
        className="relative rounded-lg border-4 border-amber-800 bg-gradient-to-b from-amber-100 via-amber-50 to-amber-100 p-4 shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]"
        style={{ width: "min(99vw, 330px)", aspectRatio: `${XQ_COLS - 1} / ${XQ_ROWS - 1}` }}
      >
        <svg
          viewBox={`0 0 ${XQ_COLS - 1} ${XQ_ROWS - 1}`}
          className="absolute inset-4"
          style={{ width: "calc(100% - 2rem)", height: "calc(100% - 2rem)" }}
          preserveAspectRatio="none"
        >
          {/* outer border */}
          <rect
            x={0}
            y={0}
            width={XQ_COLS - 1}
            height={XQ_ROWS - 1}
            fill="none"
            stroke="rgb(120 53 15 / 0.75)"
            strokeWidth={0.035}
          />
          {/* horizontal lines (full width, every row) */}
          {Array.from({ length: XQ_ROWS }, (_, r) => (
            <line
              key={`h${r}`}
              x1={0}
              y1={r}
              x2={XQ_COLS - 1}
              y2={r}
              stroke="rgb(120 53 15 / 0.55)"
              strokeWidth={0.028}
            />
          ))}
          {/* vertical lines, broken across the river (rows 4-5), except the two edge columns */}
          {Array.from({ length: XQ_COLS }, (_, c) => {
            const isEdge = c === 0 || c === XQ_COLS - 1
            if (isEdge) {
              return (
                <line key={`v${c}`} x1={c} y1={0} x2={c} y2={XQ_ROWS - 1} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
              )
            }
            return (
              <g key={`v${c}`}>
                <line x1={c} y1={0} x2={c} y2={4} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
                <line x1={c} y1={5} x2={c} y2={XQ_ROWS - 1} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
              </g>
            )
          })}
          {/* palace diagonals, top and bottom */}
          <line x1={3} y1={0} x2={5} y2={2} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
          <line x1={5} y1={0} x2={3} y2={2} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
          <line x1={3} y1={7} x2={5} y2={9} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
          <line x1={5} y1={7} x2={3} y2={9} stroke="rgb(120 53 15 / 0.55)" strokeWidth={0.028} />
        </svg>

        {/* river text */}
        <div
          className="pointer-events-none absolute flex -translate-y-1/2 items-center justify-between px-[16%] font-serif text-sm font-bold tracking-[0.3em] text-amber-800/70"
          style={{ left: "1rem", right: "1rem", top: `${(yPct(4) + yPct(5)) / 2}%` }}
        >
          <span>楚河</span>
          <span>漢界</span>
        </div>

        {/* cross marks */}
        <div className="absolute inset-4">
          {Array.from(MARK_POINTS).map((key) => {
            const [c, r] = key.split(",").map(Number)
            return <CrossMark key={key} col={c} row={r} />
          })}
        </div>

        {/* pieces + hit targets */}
        <div className="absolute inset-4">
          {state.board.map((piece, i) => {
            const row = Math.floor(i / XQ_COLS)
            const col = i % XQ_COLS
            const isSelected = selected === i
            const isLegal = legal.includes(i)
            return (
              <button
                key={i}
                onClick={() => handleClick(i)}
                aria-label={piece ? XQ_LABELS[piece.color][piece.type] : `位置 ${col + 1},${row + 1}`}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{
                  left: `${xPct(col)}%`,
                  top: `${yPct(row)}%`,
                  width: `${hitW}%`,
                  height: `${hitH}%`,
                }}
              >
                {isLegal && (
                  <span
                    className={`absolute h-2.5 w-2.5 rounded-full ${piece ? "ring-2 ring-primary/80" : "bg-primary/70"}`}
                    style={piece ? { width: "88%", height: "88%", background: "transparent" } : undefined}
                  />
                )}
                {piece && (
                  <span
                    className={`relative z-10 flex h-[86%] w-[86%] items-center justify-center rounded-full border-[2.5px] font-serif text-base font-bold shadow-[0_3px_4px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.7),inset_0_-2px_3px_rgba(0,0,0,0.12)] ${
                      piece.color === "r"
                        ? "border-red-800 bg-gradient-to-br from-amber-50 via-red-50 to-red-100 text-red-700"
                        : "border-neutral-900 bg-gradient-to-br from-stone-50 via-neutral-100 to-stone-200 text-neutral-900"
                    } ${isSelected ? "ring-[3px] ring-primary ring-offset-1 ring-offset-amber-50" : ""}`}
                  >
                    <span
                      className={`flex h-[78%] w-[78%] items-center justify-center rounded-full border ${
                        piece.color === "r" ? "border-red-700/40" : "border-neutral-800/40"
                      }`}
                      style={{ textShadow: "0 1px 0 rgba(255,255,255,0.5)" }}
                    >
                      {XQ_LABELS[piece.color][piece.type]}
                    </span>
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
