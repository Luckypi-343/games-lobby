"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { mxNew, mxJump, mxTick, MX_GOAL_DISTANCE, type MxState } from "@/lib/games/motocross"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"

export function MotocrossView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<MxState>(() => mxNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(mxNew())
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
    const id = setInterval(() => setState((s) => mxTick(s)), 90)
    return () => clearInterval(id)
  }, [])

  const jump = () => setState((s) => mxJump(s))

  return (
    <PuzzleShell
      gameId="motocross"
      title="越野摩托車"
      subtitle="抓準時機跳躍越過坑洞"
      status={`進度：${Math.round((state.distance / MX_GOAL_DISTANCE) * 100)}%　生命：${"❤".repeat(Math.max(0, state.lives))}`}
      rulesBrief="點擊「跳躍」讓摩托車起跳，抓準時機越過前方的坑洞障礙，抵達終點前生命耗盡則挑戰失敗。"
      solved={state.over && state.won}
      cost={12}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative touch-none select-none overflow-hidden rounded-2xl border border-border bg-[oklch(0.75_0.08_60)] shadow-lg"
        style={{ width: 280, height: 140 }}
        onPointerDown={jump}
      >
        <div className="absolute inset-x-0 bottom-6 h-1 bg-[oklch(0.4_0.05_60)]" />
        {state.obstacles.map((o) => {
          const left = ((o.distance - state.distance) / 100) * 280 + 40
          if (left < -20 || left > 300) return null
          return (
            <div
              key={o.id}
              className="absolute bottom-6 rounded-t-sm bg-[oklch(0.45_0.03_60)]"
              style={{ left, width: 14, height: 20 }}
            />
          )
        })}
        {/* 仿真摩托車造型：車身、坐墊、前後輪與握把 */}
        <div
          className="absolute h-9 w-14 transition-transform"
          style={{ left: 26, bottom: state.airborne ? 44 : 6 }}
        >
          <div className="absolute bottom-[6px] left-0 h-4 w-4 rounded-full border-2 border-[oklch(0.2_0.01_60)] bg-[oklch(0.3_0.01_60)] shadow-[inset_0_0_0_2px_oklch(0.55_0.01_60)]" />
          <div className="absolute bottom-[6px] right-0 h-4 w-4 rounded-full border-2 border-[oklch(0.2_0.01_60)] bg-[oklch(0.3_0.01_60)] shadow-[inset_0_0_0_2px_oklch(0.55_0.01_60)]" />
          <div
            className="absolute bottom-[12px] left-[6px] h-[10px] w-[30px] rounded-sm bg-gradient-to-b from-primary to-[oklch(0.4_0.2_260)] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)]"
          />
          <div className="absolute bottom-[20px] left-[14px] h-[6px] w-[16px] rounded-t-md bg-[oklch(0.25_0.02_260)]" />
          <div className="absolute bottom-[14px] right-0 h-[10px] w-[3px] -rotate-[20deg] bg-[oklch(0.3_0.01_60)]" />
          <div className="absolute bottom-[22px] right-[-2px] h-[3px] w-[8px] -rotate-[20deg] rounded-full bg-[oklch(0.25_0.02_260)]" />
        </div>
      </div>
      <button
        onClick={jump}
        disabled={state.over}
        className="rounded-full bg-primary px-8 py-2 text-xs font-bold text-primary-foreground transition disabled:opacity-40 active:scale-95"
      >
        跳躍
      </button>
    </PuzzleShell>
  )
}
