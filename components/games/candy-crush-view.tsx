"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { ccNew, ccSwap, CC_SIZE, CC_TARGET_SCORE, type CCState, type CandyCell } from "@/lib/games/candy-crush"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

// 6 種糖果的仿真配色（糖果殼色 + 高光 + 陰影）
const CANDY_STYLE = [
  { base: "#ef4444", light: "#fca5a5", dark: "#991b1b" }, // 紅莓糖
  { base: "#f59e0b", light: "#fde68a", dark: "#92400e" }, // 柳橙糖
  { base: "#eab308", light: "#fef08a", dark: "#854d0e" }, // 檸檬糖
  { base: "#22c55e", light: "#bbf7d0", dark: "#14532d" }, // 青蘋果糖
  { base: "#3b82f6", light: "#bfdbfe", dark: "#1e3a8a" }, // 藍莓糖
  { base: "#a855f7", light: "#e9d5ff", dark: "#581c87" }, // 葡萄糖
]

function Candy({ cell, size }: { cell: CandyCell; size: number }) {
  const style = CANDY_STYLE[cell.color] ?? CANDY_STYLE[0]
  if (cell.kind === "bomb") {
    return (
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: "radial-gradient(circle at 35% 30%, #fde68a, #f59e0b 35%, #ea580c 65%, #7c2d12 100%)",
          boxShadow: "inset -2px -3px 5px rgba(0,0,0,0.4), inset 2px 2px 4px rgba(255,255,255,0.6), 0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.35) 0deg 15deg, transparent 15deg 30deg)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow">★</div>
      </div>
    )
  }
  if (cell.kind === "striped-h" || cell.kind === "striped-v") {
    const stripes =
      cell.kind === "striped-h"
        ? "repeating-linear-gradient(0deg, rgba(255,255,255,0.75) 0px 3px, transparent 3px 7px)"
        : "repeating-linear-gradient(90deg, rgba(255,255,255,0.75) 0px 3px, transparent 3px 7px)"
    return (
      <div
        className="relative rounded-2xl"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.base} 55%, ${style.dark} 100%)`,
          boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.5)",
        }}
      >
        <div className="absolute inset-1 rounded-xl" style={{ background: stripes }} />
      </div>
    )
  }
  if (cell.kind === "wrapped") {
    return (
      <div
        className="relative"
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg, ${style.light}, ${style.base} 50%, ${style.dark})`,
          boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.4), inset 2px 2px 3px rgba(255,255,255,0.55), 0 1px 3px rgba(0,0,0,0.3)",
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "rgba(255,255,255,0.3)" }}
        />
      </div>
    )
  }
  // 普通糖：圓潤糖果，帶高光與陰影，表面有一道螺旋糖紋
  return (
    <div
      className="relative rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 28%, ${style.light}, ${style.base} 55%, ${style.dark} 100%)`,
        boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.55), 0 2px 3px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="absolute inset-[18%] rounded-full opacity-70"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg 50deg, rgba(255,255,255,0.5) 50deg 70deg, transparent 70deg 180deg, rgba(255,255,255,0.3) 180deg 200deg, transparent 200deg 360deg)`,
        }}
      />
      <div className="absolute left-[22%] top-[18%] h-[22%] w-[22%] rounded-full bg-white/70 blur-[1px]" />
    </div>
  )
}

export function CandyCrushView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<CCState>(() => ccNew())
  const [selected, setSelected] = useState<number | null>(null)

  const restart = () => {
    setState(ccNew())
    setSelected(null)
  }

  const tap = (i: number) => {
    if (state.won || state.lost) return
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    const { state: next, moved } = ccSwap(state, selected, i)
    if (moved) {
      setState(next)
      if (soundOn) playWinSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  const solved = state.won

  return (
    <PuzzleShell
      gameId="candy-crush"
      title="糖果傳奇"
      subtitle="交換糖果湊三連消，衝目標分數過關"
      status={
        state.lost
          ? `步數用完，挑戰失敗 · 分數 ${state.score} / ${CC_TARGET_SCORE}`
          : `分數：${state.score} / ${CC_TARGET_SCORE}　剩餘步數：${state.movesLeft}`
      }
      rulesBrief="點選一顆糖果再點選相鄰糖果即可交換，湊出 3 個以上同色連線就會消除：4連會變成條紋糖（可清掉整行/整列），5連會變成炫彩糖（可清掉同色全部糖果）。在步數用完前達到目標分數即可過關。"
      solved={solved}
      cost={6}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-1 rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${CC_SIZE}, minmax(0, 1fr))`, width: 340, maxWidth: "100%" }}
      >
        {state.grid.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`flex aspect-square items-center justify-center rounded-lg transition-all active:scale-90 ${
              selected === i ? "ring-2 ring-foreground/60" : ""
            }`}
          >
            <Candy cell={c} size={28} />
          </button>
        ))}
      </div>
      {state.lost && (
        <p className="text-center text-xs font-semibold text-destructive">步數已用完，按「重新開始」再試一次！</p>
      )}
    </PuzzleShell>
  )
}
