"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { gsNew, gsSwap, gsCompleteTask, GS_SIZE, GS_TASKS, type GSState, type GSCell } from "@/lib/games/gardenscapes"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

// 6 種花園元素的仿真立體配色
const GARDEN_STYLE = [
  { base: "#ec4899", light: "#fbcfe8", dark: "#831843", shape: "flower" }, // 玫瑰花
  { base: "#f59e0b", light: "#fde68a", dark: "#78350f", shape: "sunflower" }, // 向日葵
  { base: "#22c55e", light: "#bbf7d0", dark: "#14532d", shape: "leaf" }, // 葉片
  { base: "#3b82f6", light: "#bfdbfe", dark: "#1e3a8a", shape: "water" }, // 水滴
  { base: "#a855f7", light: "#e9d5ff", dark: "#581c87", shape: "berry" }, // 莓果
  { base: "#78716c", light: "#d6d3d1", dark: "#292524", shape: "stone" }, // 石頭
]

function GardenItem({ cell, size }: { cell: GSCell; size: number }) {
  const style = GARDEN_STYLE[cell.color] ?? GARDEN_STYLE[0]
  if (style.shape === "flower") {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {[0, 72, 144, 216, 288].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 rounded-full"
            style={{
              width: size * 0.42,
              height: size * 0.42,
              background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.base} 60%, ${style.dark} 100%)`,
              transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-${size * 0.26}px)`,
              boxShadow: "inset -1px -2px 3px rgba(0,0,0,0.35)",
            }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: size * 0.32,
            height: size * 0.32,
            background: "radial-gradient(circle at 35% 30%, #fef9c3, #facc15 70%, #92400e 100%)",
            transform: "translate(-50%,-50%)",
            boxShadow: "inset -1px -2px 3px rgba(0,0,0,0.3)",
          }}
        />
      </div>
    )
  }
  if (style.shape === "sunflower") {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: size * 0.22,
              height: size * 0.46,
              background: `linear-gradient(180deg, ${style.light}, ${style.base})`,
              borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
              transform: `translate(-50%,-100%) rotate(${i * 45}deg)`,
              transformOrigin: "50% 100%",
            }}
          />
        ))}
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: size * 0.5,
            height: size * 0.5,
            background: "radial-gradient(circle at 35% 30%, #92400e, #451a03 80%)",
            transform: "translate(-50%,-50%)",
            boxShadow: "inset -1px -2px 3px rgba(0,0,0,0.5)",
          }}
        />
      </div>
    )
  }
  if (style.shape === "leaf") {
    return (
      <div
        style={{
          width: size * 0.85,
          height: size * 0.85,
          background: `linear-gradient(135deg, ${style.light}, ${style.base} 55%, ${style.dark})`,
          borderRadius: "0% 70% 0% 70%",
          boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.35), inset 1px 1px 3px rgba(255,255,255,0.4)",
        }}
      />
    )
  }
  if (style.shape === "water") {
    return (
      <div
        style={{
          width: size * 0.75,
          height: size * 0.9,
          background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.base} 60%, ${style.dark} 100%)`,
          borderRadius: "50% 50% 50% 0%",
          transform: "rotate(45deg)",
          boxShadow: "inset -2px -2px 4px rgba(0,0,0,0.3)",
        }}
      />
    )
  }
  if (style.shape === "berry") {
    return (
      <div className="relative" style={{ width: size, height: size }}>
        {[
          [-0.18, -0.1],
          [0.18, -0.1],
          [0, 0.15],
        ].map(([dx, dy], i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: size * 0.42,
              height: size * 0.42,
              left: `${50 + dx * 100}%`,
              top: `${50 + dy * 100}%`,
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(circle at 35% 30%, ${style.light}, ${style.base} 60%, ${style.dark} 100%)`,
              boxShadow: "inset -1px -2px 3px rgba(0,0,0,0.35)",
            }}
          />
        ))}
      </div>
    )
  }
  // stone
  return (
    <div
      style={{
        width: size * 0.85,
        height: size * 0.7,
        background: `radial-gradient(circle at 35% 25%, ${style.light}, ${style.base} 55%, ${style.dark} 100%)`,
        borderRadius: "45% 55% 50% 50% / 60% 60% 40% 40%",
        boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.4), inset 2px 2px 3px rgba(255,255,255,0.3)",
      }}
    />
  )
}

export function GardenscapesView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<GSState>(() => gsNew())
  const [selected, setSelected] = useState<number | null>(null)

  const restart = () => {
    setState(gsNew())
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
    const { state: next, moved } = gsSwap(state, selected, i)
    if (moved) {
      setState(next)
      if (soundOn) playMoveSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  const complete = () => {
    const next = gsCompleteTask(state)
    if (next !== state) {
      setState(next)
      if (soundOn) playWinSound()
    }
  }

  const task = GS_TASKS[state.taskIndex]
  const canComplete = !!task && state.coins >= task.cost

  return (
    <PuzzleShell
      gameId="gardenscapes"
      title="夢幻花園"
      subtitle="交換花園元素三連消，賺金幣整修花園"
      status={
        state.won
          ? `花園整修全部完成！總分 ${state.score}`
          : task
            ? `任務：${task.name}　金幣 ${state.coins} / ${task.cost}`
            : ""
      }
      rulesBrief="點選一個花園元素再點選相鄰元素即可交換，湊出 3 個以上同色連線就會消除並獲得金幣。金幣累積到目標後按「完成整修」推進花園修復進度，依序完成 3 項整修任務即可過關。"
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
            完成整修（{state.taskIndex + 1}/{GS_TASKS.length}）
          </button>
        )
      }
    >
      <div
        className="grid gap-1 rounded-2xl border border-border bg-gradient-to-b from-green-50 to-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${GS_SIZE}, minmax(0, 1fr))`, width: 347, maxWidth: "100%" }}
      >
        {state.grid.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`flex aspect-square items-center justify-center rounded-lg transition-all active:scale-90 ${
              selected === i ? "ring-2 ring-foreground/60" : ""
            }`}
          >
            <GardenItem cell={c} size={31} />
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
