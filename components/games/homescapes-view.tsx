"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { hsNew, hsSwap, hsCompleteTask, HS_SIZE, HS_TASKS, type HSState, type HSCell } from "@/lib/games/homescapes"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

// 6 種家飾元素的仿真立體配色
const HOME_STYLE = [
  { base: "#f97316", light: "#fed7aa", dark: "#7c2d12", shape: "paint" }, // 油漆桶
  { base: "#0ea5e9", light: "#bae6fd", dark: "#0c4a6e", shape: "tile" }, // 磁磚
  { base: "#eab308", light: "#fef08a", dark: "#713f12", shape: "lamp" }, // 檯燈
  { base: "#ef4444", light: "#fecaca", dark: "#7f1d1d", shape: "sofa" }, // 沙發墊
  { base: "#8b5cf6", light: "#ddd6fe", dark: "#4c1d95", shape: "curtain" }, // 窗簾
  { base: "#78716c", light: "#d6d3d1", dark: "#292524", shape: "rug" }, // 地毯
]

function HomeItem({ cell, size }: { cell: HSCell; size: number }) {
  const style = HOME_STYLE[cell.color] ?? HOME_STYLE[0]
  if (style.shape === "paint") {
    return (
      <div className="relative" style={{ width: size * 0.7, height: size * 0.85 }}>
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: "80%",
            background: `linear-gradient(180deg, ${style.light}, ${style.base} 55%, ${style.dark})`,
            borderRadius: "6% 6% 18% 18%",
            boxShadow: "inset -2px -2px 3px rgba(0,0,0,0.35), inset 1px 1px 2px rgba(255,255,255,0.4)",
          }}
        />
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 rounded-sm"
          style={{ width: "90%", height: "16%", background: style.dark }}
        />
      </div>
    )
  }
  if (style.shape === "tile") {
    return (
      <div
        className="grid grid-cols-2 gap-[2px] overflow-hidden rounded-md"
        style={{ width: size * 0.8, height: size * 0.8, boxShadow: "0 2px 3px rgba(0,0,0,0.25)" }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.base} 60%, ${style.dark} 100%)`,
            }}
          />
        ))}
      </div>
    )
  }
  if (style.shape === "lamp") {
    return (
      <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
        <div
          style={{
            width: size * 0.7,
            height: size * 0.42,
            background: `linear-gradient(180deg, ${style.light}, ${style.base} 60%, ${style.dark})`,
            borderRadius: "50% 50% 20% 20% / 70% 70% 20% 20%",
            boxShadow: "inset -2px -2px 3px rgba(0,0,0,0.3)",
          }}
        />
        <div style={{ width: 3, height: size * 0.4, background: style.dark }} />
      </div>
    )
  }
  if (style.shape === "sofa") {
    return (
      <div
        style={{
          width: size * 0.85,
          height: size * 0.7,
          background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.base} 55%, ${style.dark} 100%)`,
          borderRadius: "22%",
          boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.4)",
        }}
      />
    )
  }
  if (style.shape === "curtain") {
    return (
      <div className="flex gap-[2px]" style={{ width: size * 0.8, height: size * 0.85 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1"
            style={{
              background: `linear-gradient(180deg, ${style.light}, ${style.base} 60%, ${style.dark})`,
              borderRadius: "40% 40% 10% 10%",
            }}
          />
        ))}
      </div>
    )
  }
  // rug
  return (
    <div
      style={{
        width: size * 0.9,
        height: size * 0.65,
        background: `linear-gradient(135deg, ${style.light}, ${style.base} 55%, ${style.dark})`,
        borderRadius: "8%",
        boxShadow: "inset -2px -2px 3px rgba(0,0,0,0.3), inset 2px 2px 3px rgba(255,255,255,0.3)",
      }}
    />
  )
}

export function HomescapesView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<HSState>(() => hsNew())
  const [selected, setSelected] = useState<number | null>(null)

  const restart = () => {
    setState(hsNew())
    setSelected(null)
  }

  const tap = (i: number) => {
    if (state.won) return
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    const { state: next, moved } = hsSwap(state, selected, i)
    if (moved) {
      setState(next)
      if (soundOn) playMoveSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  const complete = () => {
    const next = hsCompleteTask(state)
    if (next !== state) {
      setState(next)
      if (soundOn) playWinSound()
    }
  }

  const task = HS_TASKS[state.taskIndex]
  const canComplete = !!task && state.coins >= task.cost

  return (
    <PuzzleShell
      gameId="homescapes"
      title="夢幻家園"
      subtitle="交換家飾元素三連消，賺金幣裝潢豪宅"
      status={
        state.won
          ? `豪宅裝潢全部完成！總分 ${state.score}`
          : task
            ? `任務：${task.name}　金幣 ${state.coins} / ${task.cost}`
            : ""
      }
      rulesBrief="點選一個家飾元素再點選相鄰元素即可交換，湊出 3 個以上同色連線就會消除並獲得金幣。金幣累積到目標後按「完成裝潢」推進豪宅修復進度，依序完成 3 項裝潢任務即可過關。"
      solved={state.won}
      cost={6}
      onBack={onBack}
      onRestart={restart}
      extraAction={
        !state.won && (
          <button
            onClick={complete}
            disabled={!canComplete}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition active:scale-95 ${
              canComplete ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            完成裝潢（{state.taskIndex + 1}/{HS_TASKS.length}）
          </button>
        )
      }
    >
      <div
        className="grid gap-1 rounded-2xl border border-border bg-gradient-to-b from-amber-50 to-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${HS_SIZE}, minmax(0, 1fr))`, width: 347, maxWidth: "100%" }}
      >
        {state.grid.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`flex aspect-square items-center justify-center rounded-lg transition-all active:scale-90 ${
              selected === i ? "ring-2 ring-foreground/60" : ""
            }`}
          >
            <HomeItem cell={c} size={31} />
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
