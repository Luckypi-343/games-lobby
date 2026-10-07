"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  ctEmptyGrid,
  ctColumnsNewPiece,
  ctColumnsTryMove,
  ctColumnsRotate,
  ctColumnsTryDrop,
  ctColumnsLock,
  ctColumnsClear,
  ctColumnsIsOver,
  ctTetrisNewPiece,
  ctTetrisTryMove,
  ctTetrisRotate,
  ctTetrisTryDrop,
  ctTetrisLock,
  ctTetrisClearLines,
  ctTetrisIsOver,
  CT_COLS,
  CT_ROWS,
  CT_GEM_PALETTE,
  CT_TETRIS_COLORS,
  type CtCell,
  type CtColumnsPiece,
  type CtTetrisPiece,
} from "@/lib/games/columns-tetris"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

type Mode = "columns" | "tetris"

export function ColumnsTetrisView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [uiMode, setUiMode] = useState<Mode>("columns")
  const [grid, setGrid] = useState<CtCell[][]>(() => ctEmptyGrid())
  const [colPiece, setColPiece] = useState<CtColumnsPiece>(() => ctColumnsNewPiece())
  const [tetPiece, setTetPiece] = useState<CtTetrisPiece>(() => ctTetrisNewPiece())
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const gridRef = useRef(grid)
  const colRef = useRef(colPiece)
  const tetRef = useRef(tetPiece)
  const overRef = useRef(over)
  const busyRef = useRef(busy)
  const modeRef = useRef(uiMode)
  gridRef.current = grid
  colRef.current = colPiece
  tetRef.current = tetPiece
  overRef.current = over
  busyRef.current = busy
  modeRef.current = uiMode

  useEffect(() => {
    const interval = setInterval(() => {
      if (overRef.current || busyRef.current) return
      softDrop()
    }, 600)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiMode])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (overRef.current || busyRef.current) return
      if (e.key === "ArrowLeft") move(-1)
      else if (e.key === "ArrowRight") move(1)
      else if (e.key === "ArrowUp") rotate()
      else if (e.key === "ArrowDown") softDrop()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiMode])

  function move(dx: number) {
    if (modeRef.current === "columns") setColPiece((p) => ctColumnsTryMove(gridRef.current, p, dx))
    else setTetPiece((p) => ctTetrisTryMove(gridRef.current, p, dx))
  }
  function rotate() {
    if (modeRef.current === "columns") setColPiece((p) => ctColumnsRotate(p))
    else setTetPiece((p) => ctTetrisRotate(gridRef.current, p))
  }

  function softDrop() {
    if (modeRef.current === "columns") {
      const { piece, landed } = ctColumnsTryDrop(gridRef.current, colRef.current)
      if (!landed) {
        setColPiece(piece)
        return
      }
      lockColumns()
    } else {
      const { piece, landed } = ctTetrisTryDrop(gridRef.current, tetRef.current)
      if (!landed) {
        setTetPiece(piece)
        return
      }
      lockTetris()
    }
  }

  function lockColumns() {
    setBusy(true)
    let g = ctColumnsLock(gridRef.current, colRef.current)
    let gained = 0
    function step() {
      const { grid: cleared, cleared: n } = ctColumnsClear(g)
      if (n > 0) {
        gained += n * 10
        g = cleared
        setGrid(g)
        if (soundOn) playWinSound()
        setTimeout(step, 240)
      } else {
        setScore((s) => s + gained)
        if (ctColumnsIsOver(g)) {
          setOver(true)
          if (soundOn) playLossSound()
          setBusy(false)
          return
        }
        setColPiece(ctColumnsNewPiece())
        setBusy(false)
      }
    }
    setGrid(g)
    if (soundOn) playMoveSound()
    setTimeout(step, 100)
  }

  function lockTetris() {
    setBusy(true)
    let g = ctTetrisLock(gridRef.current, tetRef.current)
    const { grid: cleared, cleared: lines } = ctTetrisClearLines(g)
    g = cleared
    const gained = [0, 40, 100, 200, 400][Math.min(4, lines)] ?? 0
    setGrid(g)
    if (gained) {
      setScore((s) => s + gained)
      if (soundOn) playWinSound()
    } else if (soundOn) playMoveSound()
    if (ctTetrisIsOver(g)) {
      setOver(true)
      if (soundOn) playLossSound()
      setBusy(false)
      return
    }
    setTetPiece(ctTetrisNewPiece())
    setBusy(false)
  }

  function switchMode(m: Mode) {
    setUiMode(m)
    setGrid(ctEmptyGrid())
    setColPiece(ctColumnsNewPiece())
    setTetPiece(ctTetrisNewPiece())
    setScore(0)
    setOver(false)
    setBusy(false)
  }

  function restart() {
    switchMode(uiMode)
  }

  // 組合顯示
  const display: CtCell[][] = grid.map((row) => [...row])
  if (!over) {
    if (uiMode === "columns") {
      for (let i = 0; i < 3; i++) {
        const r = colPiece.row + i
        if (r >= 0 && r < CT_ROWS) display[r][colPiece.col] = colPiece.gems[i]
      }
    } else {
      for (let r = 0; r < tetPiece.shape.length; r++) {
        for (let c = 0; c < tetPiece.shape[r].length; c++) {
          if (!tetPiece.shape[r][c]) continue
          const gr = tetPiece.row + r
          const gc = tetPiece.col + c
          if (gr >= 0 && gr < CT_ROWS) display[gr][gc] = tetPiece.colorIndex
        }
      }
    }
  }

  const palette = uiMode === "columns" ? CT_GEM_PALETTE : CT_TETRIS_COLORS
  const isGem = uiMode === "columns"

  return (
    <PuzzleShell
      gameId="columns-tetris"
      title="寶石方塊 / 俄羅斯方塊"
      subtitle="切換兩種古典掉落消除玩法"
      status={over ? `遊戲結束，分數 ${score}` : `分數：${score}`}
      rulesBrief="寶石方塊：三連直立寶石落下，左右移動、旋轉調整順序，相同顏色橫、直、斜連成3個以上即消除。俄羅斯方塊：經典方塊落下，左右移動、旋轉調整形狀，填滿一整橫排即消除，可一次消除多排獲得更多分數。棋盤堆到最上方時遊戲結束。"
      solved={false}
      cost={8}
      onBack={onBack}
      onRestart={restart}
      extraAction={
        <div className="flex items-center gap-1.5">
          {(["columns", "tetris"] as const).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`rounded-full px-3 py-1 text-[11px] font-semibold transition ${
                uiMode === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {m === "columns" ? "寶石方塊" : "俄羅斯方塊"}
            </button>
          ))}
        </div>
      }
    >
      <div
        className="grid gap-[2px] rounded-2xl border border-border bg-gradient-to-b from-indigo-50 to-indigo-100 p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${CT_COLS}, 1fr)` }}
      >
        {display.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="flex items-center justify-center" style={{ width: 26, height: 26 }}>
              {cell !== null ? (
                <CellView color={palette[cell] ?? palette[0]} round={isGem} />
              ) : (
                <div className="h-full w-full rounded bg-black/5" />
              )}
            </div>
          )),
        )}
      </div>
      <div className="flex items-center gap-3">
        <button onClick={() => move(-1)} className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground shadow active:scale-95">
          ←
        </button>
        <button onClick={() => rotate()} className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow active:scale-95">
          旋轉
        </button>
        <button onClick={() => softDrop()} className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow active:scale-95">
          ↓
        </button>
        <button onClick={() => move(1)} className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground shadow active:scale-95">
          →
        </button>
      </div>
    </PuzzleShell>
  )
}

function CellView({ color, round }: { color: string; round: boolean }) {
  return (
    <div
      className={round ? "h-full w-full rounded-full" : "h-full w-full rounded-md"}
      style={{
        background: round
          ? `radial-gradient(circle at 35% 30%, ${lighten(color)}, ${color} 55%, ${darken(color)})`
          : `linear-gradient(145deg, ${lighten(color)}, ${color} 55%, ${darken(color)})`,
        boxShadow: "inset 0 2px 2px rgba(255,255,255,0.5), inset 0 -3px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.25)",
      }}
    />
  )
}

function lighten(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + 60)
  const g = Math.min(255, ((n >> 8) & 0xff) + 60)
  const b = Math.min(255, (n & 0xff) + 60)
  return `rgb(${r},${g},${b})`
}
function darken(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - 40)
  const g = Math.max(0, ((n >> 8) & 0xff) - 40)
  const b = Math.max(0, (n & 0xff) - 40)
  return `rgb(${r},${g},${b})`
}
