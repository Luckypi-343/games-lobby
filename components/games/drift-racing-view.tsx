"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  drNew,
  drSteer,
  drTick,
  DR_GOAL_DISTANCE,
  DR_TRACK_WIDTH,
  DR_WIN_SCORE,
  type DrState,
} from "@/lib/games/drift-racing"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"

export function DriftRacingView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<DrState>(() => drNew())
  const overRef = useRef(false)
  const holdRef = useRef<-1 | 0 | 1>(0)

  const restart = () => {
    setState(drNew())
    overRef.current = false
  }

  useEffect(() => {
    if (state.over && !overRef.current) {
      overRef.current = true
      if (soundOn) {
        if (state.won) playWinSound()
        else playLossSound()
      }
    }
  }, [state.over, state.won, soundOn])

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        const steered = holdRef.current !== 0 ? drSteer(s, holdRef.current * 2.4) : s
        return drTick(steered)
      })
    }, 90)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") holdRef.current = -1
      else if (e.key === "ArrowRight") holdRef.current = 1
    }
    const up = () => (holdRef.current = 0)
    window.addEventListener("keydown", handler)
    window.addEventListener("keyup", up)
    return () => {
      window.removeEventListener("keydown", handler)
      window.removeEventListener("keyup", up)
    }
  }, [])

  const offset = state.carX - state.roadCenter
  const offTrack = Math.abs(offset) > DR_TRACK_WIDTH / 2

  return (
    <PuzzleShell
      gameId="drift-racing"
      title="極速漂移"
      subtitle="順著彎道轉向，累積漂移分數"
      status={`進度：${Math.round((state.distance / DR_GOAL_DISTANCE) * 100)}%　漂移分：${state.driftScore}／${DR_WIN_SCORE}`}
      rulesBrief="按住左右按鈕跟著賽道彎曲的方向轉向，維持在賽道範圍內並累積漂移分數，抵達終點且分數達標即過關；長時間偏離賽道則挑戰失敗。"
      solved={state.over && state.won}
      cost={14}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="relative h-56 w-40 overflow-hidden rounded-2xl border border-border bg-[oklch(0.3_0.03_150)] shadow-lg">
        <div
          className="absolute rounded-full bg-[oklch(0.5_0.02_150)] transition-all"
          style={{ left: `calc(${state.roadCenter}% - ${DR_TRACK_WIDTH / 2}%)`, width: `${DR_TRACK_WIDTH}%`, top: 0, bottom: 0 }}
        />
        <div
          className={`absolute h-6 w-6 rounded-md shadow-md transition-all ${offTrack ? "bg-destructive" : "bg-primary"}`}
          style={{ left: `calc(${state.carX}% - 12px)`, bottom: 16 }}
        />
      </div>
      <div className="flex w-40 items-center justify-between">
        <button
          onPointerDown={() => (holdRef.current = -1)}
          onPointerUp={() => (holdRef.current = 0)}
          onPointerLeave={() => (holdRef.current = 0)}
          className="flex h-11 w-14 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ←
        </button>
        <button
          onPointerDown={() => (holdRef.current = 1)}
          onPointerUp={() => (holdRef.current = 0)}
          onPointerLeave={() => (holdRef.current = 0)}
          className="flex h-11 w-14 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}
