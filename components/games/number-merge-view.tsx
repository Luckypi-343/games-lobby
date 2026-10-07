"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { nmNew, nmMove, NM_SIZE, type NmState } from "@/lib/games/number-merge"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

const TILE_STYLE: Record<number, string> = {
  0: "bg-muted/40",
  2: "bg-muted text-foreground",
  4: "bg-muted text-foreground",
  8: "bg-primary/60 text-primary-foreground",
  16: "bg-primary/70 text-primary-foreground",
  32: "bg-primary/80 text-primary-foreground",
  64: "bg-primary text-primary-foreground",
  128: "bg-accent/70 text-accent-foreground",
  256: "bg-accent/85 text-accent-foreground",
  512: "bg-accent text-accent-foreground",
  1024: "bg-secondary text-secondary-foreground",
  2048: "bg-primary text-primary-foreground",
}

export function NumberMergeView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<NmState>(() => nmNew())
  const touchRef = useRef<{ x: number; y: number } | null>(null)

  const restart = () => setState(nmNew())

  const move = (dir: "up" | "down" | "left" | "right") => {
    setState((s) => {
      const next = nmMove(s, dir)
      if (next !== s && soundOn) playMoveSound()
      return next
    })
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") move("up")
      else if (e.key === "ArrowDown") move("down")
      else if (e.key === "ArrowLeft") move("left")
      else if (e.key === "ArrowRight") move("right")
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "right" : "left")
    else move(dy > 0 ? "down" : "up")
    touchRef.current = null
  }

  const solved = state.won && state.over === false ? false : state.won

  return (
    <PuzzleShell
      gameId="number-merge"
      title="數字消除"
      subtitle="2048 玩法"
      status={state.over ? "無法再移動，遊戲結束" : `分數：${state.score}　最高：${state.best}`}
      rulesBrief="上下左右滑動或按方向鍵，相同數字相鄰時會合併加倍，合成出 2048 即挑戰成功。"
      solved={state.won}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid touch-none gap-1.5 rounded-2xl border border-border bg-card p-2.5 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${NM_SIZE}, minmax(0, 1fr))` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {state.grid.map((val, i) => (
          <div
            key={i}
            className={`lp-nums flex h-16 w-16 items-center justify-center rounded-xl text-lg font-bold transition ${
              TILE_STYLE[val] ?? "bg-primary text-primary-foreground"
            }`}
          >
            {val !== 0 ? val : ""}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div />
        <button
          onClick={() => move("up")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => move("left")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ←
        </button>
        <button
          onClick={() => move("down")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ↓
        </button>
        <button
          onClick={() => move("right")}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}
