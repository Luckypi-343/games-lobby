"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  puyoEmptyGrid,
  puyoNewPair,
  puyoSecondPos,
  puyoTryMove,
  puyoTryRotate,
  puyoTryDrop,
  puyoLockPair,
  puyoClearGroups,
  puyoIsOver,
  PUYO_COLS,
  PUYO_ROWS,
  PUYO_PALETTE,
  type PuyoCell,
  type PuyoPair,
} from "@/lib/games/puyo"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function PuyoView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [grid, setGrid] = useState<PuyoCell[][]>(() => puyoEmptyGrid())
  const [pair, setPair] = useState<PuyoPair>(() => puyoNewPair())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [chain, setChain] = useState(0)
  const [over, setOver] = useState(false)
  const [busy, setBusy] = useState(false)
  const gridRef = useRef(grid)
  const pairRef = useRef(pair)
  const overRef = useRef(over)
  const busyRef = useRef(busy)
  gridRef.current = grid
  pairRef.current = pair
  overRef.current = over
  busyRef.current = busy

  useEffect(() => {
    const interval = setInterval(() => {
      if (overRef.current || busyRef.current) return
      softDrop()
    }, 650)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (overRef.current || busyRef.current) return
      if (e.key === "ArrowLeft") setPair((p) => puyoTryMove(gridRef.current, p, -1))
      else if (e.key === "ArrowRight") setPair((p) => puyoTryMove(gridRef.current, p, 1))
      else if (e.key === "ArrowUp") setPair((p) => puyoTryRotate(gridRef.current, p))
      else if (e.key === "ArrowDown") softDrop()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function softDrop() {
    const { pair: moved, landed } = puyoTryDrop(gridRef.current, pairRef.current)
    if (!landed) {
      setPair(moved)
      return
    }
    lockAndResolve()
  }

  function lockAndResolve() {
    setBusy(true)
    let g = puyoLockPair(gridRef.current, pairRef.current)
    let chainCount = 0
    let gained = 0

    function step() {
      const { grid: cleared, cleared: n, groups } = puyoClearGroups(g)
      if (groups > 0) {
        chainCount += 1
        const chainBonus = Math.min(8, chainCount)
        gained += n * 10 * chainBonus
        g = cleared
        setGrid(g)
        setChain(chainCount)
        if (soundOn) playWinSound()
        setTimeout(step, 260)
      } else {
        setScore((s) => s + gained)
        setChain(0)
        if (puyoIsOver(g)) {
          setOver(true)
          setBest((b) => Math.max(b, score + gained))
          if (soundOn) playLossSound()
          setBusy(false)
          return
        }
        setPair(puyoNewPair())
        setBusy(false)
      }
    }
    setGrid(g)
    if (soundOn) playMoveSound()
    setTimeout(step, 120)
  }

  function restart() {
    setGrid(puyoEmptyGrid())
    setPair(puyoNewPair())
    setScore(0)
    setChain(0)
    setOver(false)
    setBusy(false)
  }

  // 組合顯示：棋盤 + 浮空中的成對泡泡
  const display: (number | null)[][] = grid.map((row) => [...row])
  const sec = puyoSecondPos(pair)
  if (!over) {
    if (pair.row >= 0 && pair.row < PUYO_ROWS) display[pair.row][pair.col] = pair.colorA
    if (sec.row >= 0 && sec.row < PUYO_ROWS) display[sec.row][sec.col] = pair.colorB
  }

  return (
    <PuzzleShell
      gameId="puyo"
      title="噗喲噗喲"
      subtitle="成對軟泥落下，同色連成4個以上就會消除"
      status={over ? `遊戲結束，分數 ${score}（最佳 ${best}）` : `分數：${score}${chain > 1 ? `　連鎖 x${chain}` : ""}`}
      rulesBrief="成對的彩色軟泥會從上方落下，左右按鈕移動位置，旋轉按鈕改變兩顆軟泥的相對方向，向下按鈕加速落下。落地後若有4個以上相同顏色的軟泥相連（上下左右），就會一次消除，消除後上方軟泥落下，可能引發連續的連鎖消除。軟泥堆到最上方出生點時，遊戲結束。"
      solved={false}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-[2px] rounded-2xl border border-border bg-gradient-to-b from-slate-100 to-slate-200 p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${PUYO_COLS}, 1fr)` }}
      >
        {display.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="flex items-center justify-center" style={{ width: 28, height: 28 }}>
              {cell !== null ? <PuyoBall color={cell} /> : <div className="h-full w-full rounded-full bg-black/5" />}
            </div>
          )),
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => !busy && !over && setPair((p) => puyoTryMove(gridRef.current, p, -1))}
          className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground shadow active:scale-95"
        >
          ←
        </button>
        <button
          onClick={() => !busy && !over && setPair((p) => puyoTryRotate(gridRef.current, p))}
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
          onClick={() => !busy && !over && setPair((p) => puyoTryMove(gridRef.current, p, 1))}
          className="rounded-full bg-muted px-4 py-2 text-sm font-bold text-foreground shadow active:scale-95"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}

function PuyoBall({ color }: { color: number }) {
  const palette = PUYO_PALETTE[color] ?? PUYO_PALETTE[0]
  return (
    <div
      className="h-full w-full rounded-full"
      style={{
        background: `radial-gradient(circle at 35% 30%, ${lighten(palette.base)}, ${palette.base} 55%, ${darken(palette.base)} 100%)`,
        boxShadow: "inset 0 -3px 4px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.3)",
      }}
    />
  )
}

function lighten(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + 70)
  const g = Math.min(255, ((n >> 8) & 0xff) + 70)
  const b = Math.min(255, (n & 0xff) + 70)
  return `rgb(${r},${g},${b})`
}
function darken(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - 40)
  const g = Math.max(0, ((n >> 8) & 0xff) - 40)
  const b = Math.max(0, (n & 0xff) - 40)
  return `rgb(${r},${g},${b})`
}
