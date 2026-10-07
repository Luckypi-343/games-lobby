"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  drMarioSeedViruses,
  drMarioNewCapsule,
  drMarioSecondPos,
  drMarioTryMove,
  drMarioTryRotate,
  drMarioTryDrop,
  drMarioLockCapsule,
  drMarioApplyGravity,
  drMarioClear,
  drMarioCountViruses,
  drMarioIsOver,
  DRMARIO_COLS,
  DRMARIO_ROWS,
  DRMARIO_PALETTE,
  type DrMarioCell,
  type DrMarioCapsule,
} from "@/lib/games/dr-mario"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const VIRUS_COUNT = 10

export function DrMarioView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [grid, setGrid] = useState<DrMarioCell[][]>(() => drMarioSeedViruses(VIRUS_COUNT))
  const [capsule, setCapsule] = useState<DrMarioCapsule>(() => drMarioNewCapsule())
  const [score, setScore] = useState(0)
  const [over, setOver] = useState(false)
  const [won, setWon] = useState(false)
  const [busy, setBusy] = useState(false)
  const gridRef = useRef(grid)
  const capsuleRef = useRef(capsule)
  const overRef = useRef(over)
  const busyRef = useRef(busy)
  gridRef.current = grid
  capsuleRef.current = capsule
  overRef.current = over
  busyRef.current = busy

  useEffect(() => {
    const interval = setInterval(() => {
      if (overRef.current || busyRef.current) return
      softDrop()
    }, 600)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (overRef.current || busyRef.current) return
      if (e.key === "ArrowLeft") setCapsule((c) => drMarioTryMove(gridRef.current, c, -1))
      else if (e.key === "ArrowRight") setCapsule((c) => drMarioTryMove(gridRef.current, c, 1))
      else if (e.key === "ArrowUp") setCapsule((c) => drMarioTryRotate(gridRef.current, c))
      else if (e.key === "ArrowDown") softDrop()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function softDrop() {
    const { capsule: moved, landed } = drMarioTryDrop(gridRef.current, capsuleRef.current)
    if (!landed) {
      setCapsule(moved)
      return
    }
    lockAndResolve()
  }

  function lockAndResolve() {
    setBusy(true)
    let g = drMarioApplyGravity(drMarioLockCapsule(gridRef.current, capsuleRef.current))
    let gained = 0

    function step() {
      const { grid: cleared, cleared: n, virusesCleared } = drMarioClear(g)
      if (n > 0) {
        gained += n * 10 + virusesCleared * 30
        g = drMarioApplyGravity(cleared)
        setGrid(g)
        if (soundOn) playWinSound()
        setTimeout(step, 260)
      } else {
        setScore((s) => s + gained)
        const remaining = drMarioCountViruses(g)
        if (remaining === 0) {
          setWon(true)
          setOver(true)
          setBusy(false)
          return
        }
        if (drMarioIsOver(g)) {
          setOver(true)
          if (soundOn) playLossSound()
          setBusy(false)
          return
        }
        setCapsule(drMarioNewCapsule())
        setBusy(false)
      }
    }
    setGrid(g)
    if (soundOn) playMoveSound()
    setTimeout(step, 120)
  }

  function restart() {
    setGrid(drMarioSeedViruses(VIRUS_COUNT))
    setCapsule(drMarioNewCapsule())
    setScore(0)
    setOver(false)
    setWon(false)
    setBusy(false)
  }

  const display: (DrMarioCell)[][] = grid.map((row) => [...row])
  const sec = drMarioSecondPos(capsule)
  if (!over) {
    if (capsule.row >= 0 && capsule.row < DRMARIO_ROWS) display[capsule.row][capsule.col] = { color: capsule.colorA, kind: "capsule" }
    if (sec.row >= 0 && sec.row < DRMARIO_ROWS) display[sec.row][sec.col] = { color: capsule.colorB, kind: "capsule" }
  }

  const virusesLeft = drMarioCountViruses(grid)

  return (
    <PuzzleShell
      gameId="dr-mario"
      title="瑪利歐醫生"
      subtitle="膠囊落下堆疊，同色連成4個以上消除病毒"
      status={over ? (won ? `過關！分數 ${score}` : `遊戲結束，分數 ${score}`) : `分數：${score}　剩餘病毒：${virusesLeft}`}
      rulesBrief="雙色膠囊會由上方落下，左右按鈕移動，旋轉按鈕改變兩半膠囊的相對方向，向下按鈕加速落下。只要同一顏色（膠囊或病毒）在同一橫排或直排連成4個以上，就會一次消除。目標是清除棋盤上所有的病毒即可過關；膠囊堆到最上方出生點時遊戲結束。"
      solved={won}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-[2px] rounded-2xl border border-border bg-gradient-to-b from-sky-50 to-sky-100 p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${DRMARIO_COLS}, 1fr)` }}
      >
        {display.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="flex items-center justify-center" style={{ width: 26, height: 26 }}>
              {cell ? <DrMarioCellView cell={cell} /> : <div className="h-full w-full rounded bg-black/5" />}
            </div>
          )),
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => !busy && !over && setCapsule((c) => drMarioTryMove(gridRef.current, c, -1))}
          className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground shadow active:scale-95"
        >
          ←
        </button>
        <button
          onClick={() => !busy && !over && setCapsule((c) => drMarioTryRotate(gridRef.current, c))}
          className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow active:scale-95"
        >
          旋轉
        </button>
        <button
          onClick={() => !busy && !over && softDrop()}
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow active:scale-95"
        >
          ↓
        </button>
        <button
          onClick={() => !busy && !over && setCapsule((c) => drMarioTryMove(gridRef.current, c, 1))}
          className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground shadow active:scale-95"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}

function DrMarioCellView({ cell }: { cell: NonNullable<DrMarioCell> }) {
  const palette = DRMARIO_PALETTE[cell.color] ?? DRMARIO_PALETTE[0]
  if (cell.kind === "virus") {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded-full text-[11px] font-bold text-white"
        style={{
          background: `radial-gradient(circle at 35% 30%, ${lighten(palette.base)}, ${palette.base} 60%, ${darken(palette.base)})`,
          boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.3)",
        }}
      >
        ●
      </div>
    )
  }
  return (
    <div
      className="h-full w-full rounded-md"
      style={{
        background: `linear-gradient(145deg, ${lighten(palette.base)}, ${palette.base} 55%, ${darken(palette.base)})`,
        boxShadow: "inset 0 2px 2px rgba(255,255,255,0.5), inset 0 -2px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.25)",
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
