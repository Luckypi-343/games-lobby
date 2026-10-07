"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { rmNew, rmSwap, rmCompleteTask, RM_SIZE, RM_TASKS, type RMState, type RMCell } from "@/lib/games/royal-match"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

// 6 種皇家徽章的仿真立體配色
const ROYAL_STYLE = [
  { base: "#eab308", light: "#fef08a", dark: "#713f12", shape: "crown" }, // 皇冠
  { base: "#dc2626", light: "#fecaca", dark: "#7f1d1d", shape: "shield" }, // 盾牌
  { base: "#2563eb", light: "#bfdbfe", dark: "#1e3a8a", shape: "gem" }, // 藍寶石
  { base: "#7c3aed", light: "#ddd6fe", dark: "#4c1d95", shape: "scroll" }, // 卷軸
  { base: "#059669", light: "#a7f3d0", dark: "#064e3b", shape: "key" }, // 鑰匙
  { base: "#ea580c", light: "#fed7aa", dark: "#7c2d12", shape: "goblet" }, // 聖杯
]

function RoyalItem({ cell, size }: { cell: RMCell; size: number }) {
  const style = ROYAL_STYLE[cell.color] ?? ROYAL_STYLE[0]
  const grad = `radial-gradient(circle at 32% 28%, ${style.light}, ${style.base} 58%, ${style.dark} 100%)`
  const shadow = "inset -2px -3px 4px rgba(0,0,0,0.4), inset 1px 1px 3px rgba(255,255,255,0.4)"

  if (style.shape === "crown") {
    return (
      <div className="relative" style={{ width: size, height: size * 0.85 }}>
        <svg viewBox="0 0 100 80" width={size} height={size * 0.85}>
          <defs>
            <linearGradient id="crownG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={style.light} />
              <stop offset="60%" stopColor={style.base} />
              <stop offset="100%" stopColor={style.dark} />
            </linearGradient>
          </defs>
          <path d="M8 70 L8 35 L26 52 L50 15 L74 52 L92 35 L92 70 Z" fill="url(#crownG)" stroke={style.dark} strokeWidth="2" />
          <circle cx="50" cy="20" r="6" fill={style.light} />
          <circle cx="20" cy="40" r="4" fill={style.light} />
          <circle cx="80" cy="40" r="4" fill={style.light} />
        </svg>
      </div>
    )
  }
  if (style.shape === "shield") {
    return (
      <div
        style={{
          width: size * 0.78,
          height: size * 0.92,
          background: grad,
          borderRadius: "40% 40% 50% 50% / 30% 30% 60% 60%",
          boxShadow: shadow,
          position: "relative",
        }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: size * 0.3, height: size * 0.4, background: style.light, opacity: 0.6, borderRadius: "30% 30% 50% 50%" }}
        />
      </div>
    )
  }
  if (style.shape === "gem") {
    return (
      <div className="relative" style={{ width: size * 0.8, height: size * 0.8 }}>
        <svg viewBox="0 0 100 100" width={size * 0.8} height={size * 0.8}>
          <defs>
            <linearGradient id="gemG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={style.light} />
              <stop offset="50%" stopColor={style.base} />
              <stop offset="100%" stopColor={style.dark} />
            </linearGradient>
          </defs>
          <polygon points="50,5 85,35 70,95 30,95 15,35" fill="url(#gemG)" stroke={style.dark} strokeWidth="2" />
          <polygon points="50,5 85,35 50,45" fill={style.light} opacity="0.5" />
        </svg>
      </div>
    )
  }
  if (style.shape === "scroll") {
    return (
      <div
        style={{
          width: size * 0.85,
          height: size * 0.6,
          background: `linear-gradient(180deg, ${style.light}, ${style.base} 50%, ${style.dark})`,
          borderRadius: "40%",
          boxShadow: shadow,
        }}
      />
    )
  }
  if (style.shape === "key") {
    return (
      <div className="relative" style={{ width: size * 0.85, height: size * 0.5 }}>
        <div
          className="absolute rounded-full"
          style={{ width: size * 0.4, height: size * 0.4, left: 0, top: "50%", transform: "translateY(-50%)", background: grad, boxShadow: shadow }}
        />
        <div
          className="absolute"
          style={{ width: size * 0.5, height: size * 0.12, left: size * 0.3, top: "50%", transform: "translateY(-50%)", background: style.base }}
        />
        <div
          className="absolute"
          style={{ width: size * 0.12, height: size * 0.22, right: size * 0.05, top: "50%", background: style.base }}
        />
      </div>
    )
  }
  // goblet
  return (
    <div className="relative" style={{ width: size * 0.7, height: size * 0.9 }}>
      <div style={{ width: "100%", height: "55%", background: grad, borderRadius: "40% 40% 50% 50%", boxShadow: shadow }} />
      <div
        className="mx-auto"
        style={{ width: "18%", height: "30%", background: `linear-gradient(180deg, ${style.base}, ${style.dark})` }}
      />
      <div className="mx-auto" style={{ width: "55%", height: "10%", background: style.dark, borderRadius: "30%" }} />
    </div>
  )
}

export function RoyalMatchView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<RMState>(() => rmNew())
  const [selected, setSelected] = useState<number | null>(null)

  const restart = () => {
    setState(rmNew())
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
    const { state: next, moved } = rmSwap(state, selected, i)
    if (moved) {
      setState(next)
      if (soundOn) playMoveSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  const complete = () => {
    const next = rmCompleteTask(state)
    if (next !== state) {
      setState(next)
      if (soundOn) playWinSound()
    }
  }

  const task = RM_TASKS[state.taskIndex]
  const canComplete = !!task && state.coins >= task.cost

  return (
    <PuzzleShell
      gameId="royal-match"
      title="皇家消除"
      subtitle="交換皇家徽章三連消，賺金幣修復城堡"
      status={
        state.won
          ? `城堡修復全部完成！總分 ${state.score}`
          : task
            ? `任務：${task.name}　金幣 ${state.coins} / ${task.cost}`
            : ""
      }
      rulesBrief="點選一個皇家徽章再點選相鄰徽章即可交換，湊出 3 個以上同色連線就會消除並獲得金幣。金幣累積到目標後按「完成修復」推進城堡修復進度，依序完成 3 項修復任務即可過關。"
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
            完成修復（{state.taskIndex + 1}/{RM_TASKS.length}）
          </button>
        )
      }
    >
      <div
        className="grid gap-1 rounded-2xl border border-border bg-gradient-to-b from-amber-50 to-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${RM_SIZE}, minmax(0, 1fr))`, width: 347, maxWidth: "100%" }}
      >
        {state.grid.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`flex aspect-square items-center justify-center rounded-lg transition-all active:scale-90 ${
              selected === i ? "ring-2 ring-foreground/60" : ""
            }`}
          >
            <RoyalItem cell={c} size={31} />
          </button>
        ))}
      </div>
    </PuzzleShell>
  )
}
