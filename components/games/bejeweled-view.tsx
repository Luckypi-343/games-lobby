"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { bjNew, bjSwap, BJ_SIZE, type BJState } from "@/lib/games/bejeweled"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

// 7 種寶石的仿真配色（主色 + 高光 + 深邃切面陰影），用多層切面營造立體切割寶石感
const GEM_STYLE = [
  { name: "紅寶石", base: "#e11d48", light: "#fda4af", dark: "#7f1d1d" },
  { name: "藍寶石", base: "#2563eb", light: "#93c5fd", dark: "#1e3a8a" },
  { name: "綠寶石", base: "#16a34a", light: "#86efac", dark: "#14532d" },
  { name: "黃玉", base: "#eab308", light: "#fef08a", dark: "#713f12" },
  { name: "紫晶", base: "#9333ea", light: "#e9d5ff", dark: "#581c87" },
  { name: "橙玉", base: "#ea580c", light: "#fed7aa", dark: "#7c2d12" },
  { name: "鑽石", base: "#94a3b8", light: "#f8fafc", dark: "#334155" },
]

function Gem({ type, size }: { type: number; size: number }) {
  const g = GEM_STYLE[type] ?? GEM_STYLE[0]
  return (
    <div
      className="relative"
      style={{
        width: size,
        height: size,
        clipPath: "polygon(50% 0%, 90% 25%, 100% 65%, 50% 100%, 0% 65%, 10% 25%)",
        background: `linear-gradient(135deg, ${g.light} 0%, ${g.base} 45%, ${g.dark} 100%)`,
        boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.45), inset 2px 2px 3px rgba(255,255,255,0.6), 0 2px 3px rgba(0,0,0,0.3)",
      }}
    >
      {/* 切面光澤 */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(50% 0%, 90% 25%, 50% 45%, 10% 25%)",
          background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0.1))",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(10% 25%, 50% 45%, 50% 100%, 0% 65%)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.3), transparent)",
        }}
      />
    </div>
  )
}

export function BejeweledView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BJState>(() => bjNew())
  const [selected, setSelected] = useState<number | null>(null)
  const [best, setBest] = useState(0)

  const restart = () => {
    setBest((b) => Math.max(b, state.score))
    setState(bjNew())
    setSelected(null)
  }

  const tap = (i: number) => {
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    const { state: next, moved } = bjSwap(state, selected, i)
    if (moved) {
      setState(next)
      if (soundOn) playWinSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  return (
    <PuzzleShell
      gameId="bejeweled"
      title="寶石迷陣"
      subtitle="三消遊戲鼻祖，交換寶石連線消除"
      status={`分數：${state.score}${state.combo > 1 ? `　連鎖 x${state.combo}` : ""}　最高紀錄：${Math.max(best, state.score)}`}
      rulesBrief="點選一顆寶石再點選相鄰寶石即可交換，湊出 3 個以上同色連線就會消除並往下補位，可連續觸發連鎖反應獲得加成分數，沒有步數限制，持續累積您的最高紀錄。"
      solved={false}
      cost={5}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-1 rounded-2xl border border-border p-2 shadow-lg"
        style={{
          gridTemplateColumns: `repeat(${BJ_SIZE}, minmax(0, 1fr))`,
          width: 340,
          maxWidth: "100%",
          background: "linear-gradient(160deg, #1e1b4b, #312e81)",
        }}
      >
        {state.grid.map((type, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`flex aspect-square items-center justify-center rounded-md transition-all active:scale-90 ${
              selected === i ? "ring-2 ring-amber-300" : ""
            }`}
          >
            <Gem type={type} size={28} />
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
