"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  drop2048EmptyGrid,
  drop2048Drop,
  drop2048IsOver,
  drop2048RandomValue,
  drop2048MaxValue,
  DROP2048_COLS,
  DROP2048_ROWS,
  DROP2048_COLORS,
  type Drop2048Cell,
} from "@/lib/games/drop-2048"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function Drop2048View({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [grid, setGrid] = useState<Drop2048Cell[][]>(() => drop2048EmptyGrid())
  const [current, setCurrent] = useState(() => drop2048RandomValue())
  const [next, setNext] = useState(() => drop2048RandomValue())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const [dropping, setDropping] = useState(false)

  function handleDrop(col: number) {
    if (over || dropping) return
    const { grid: g, landedRow, gained, merged } = drop2048Drop(grid, col, current)
    if (landedRow === -1) return
    setDropping(true)
    setGrid(g)
    if (gained) {
      setScore((s) => s + gained)
      if (soundOn) playMoveSound()
    }
    if (merged && soundOn) playWinSound()
    const isOver = drop2048IsOver(g)
    setTimeout(() => {
      setDropping(false)
      if (isOver) {
        setOver(true)
        setBest((b) => Math.max(b, score + gained))
        if (soundOn) playLossSound()
      } else {
        setCurrent(next)
        setNext(drop2048RandomValue())
      }
    }, 220)
  }

  function restart() {
    setGrid(drop2048EmptyGrid())
    setCurrent(drop2048RandomValue())
    setNext(drop2048RandomValue())
    setScore(0)
    setOver(false)
    setDropping(false)
  }

  const maxValue = drop2048MaxValue(grid)

  return (
    <PuzzleShell
      gameId="drop-2048"
      title="2048下落版"
      subtitle="選擇欄位丟下數字，相同數字落下相疊就會合併"
      status={over ? `遊戲結束，分數 ${score}（最佳 ${best}）` : `分數：${score}　目前最大：${maxValue}`}
      rulesBrief="點選下方任一欄位丟下目前的數字方塊，方塊會落到該欄最底部的空位。如果正下方已經疊著相同數字，會立即合併升級成兩倍數值，並持續往上連鎖檢查。欄位頂端被方塊堆滿時，遊戲結束。"
      solved={false}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground">下一個：</span>
        <Tile value={next} size={30} />
      </div>
      <div
        className="grid gap-1 rounded-2xl border border-border bg-gradient-to-b from-amber-50 to-amber-100 p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${DROP2048_COLS}, 1fr)` }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div key={`${r}-${c}`} className="flex items-center justify-center" style={{ width: 42, height: 42 }}>
              {cell ? <Tile value={cell} size={40} /> : <div className="h-full w-full rounded-lg bg-black/5" />}
            </div>
          )),
        )}
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${DROP2048_COLS}, 1fr)`, width: 42 * DROP2048_COLS + 4 * (DROP2048_COLS - 1) }}>
        {Array.from({ length: DROP2048_COLS }, (_, c) => (
          <button
            key={c}
            onClick={() => handleDrop(c)}
            disabled={over || dropping}
            className="rounded-full bg-primary py-1.5 text-[11px] font-bold text-primary-foreground shadow active:scale-95 disabled:opacity-40"
          >
            ↓
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}

function Tile({ value, size }: { value: number; size: number }) {
  const palette = DROP2048_COLORS[value] ?? { bg: "#be185d", text: "#ffffff" }
  return (
    <div
      className="flex items-center justify-center rounded-lg font-bold shadow-inner"
      style={{
        width: size,
        height: size,
        fontSize: Math.max(13, size * 0.48),
        background: `linear-gradient(145deg, ${lighten(palette.bg)}, ${palette.bg})`,
        color: palette.text,
        boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -3px 4px rgba(0,0,0,0.12), 0 2px 3px rgba(0,0,0,0.15)",
      }}
    >
      {value}
    </div>
  )
}

function lighten(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + 25)
  const g = Math.min(255, ((n >> 8) & 0xff) + 25)
  const b = Math.min(255, (n & 0xff) + 25)
  return `rgb(${r},${g},${b})`
}
