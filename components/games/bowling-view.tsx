"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { bwNew, bwSetAngle, bwRoll, bwTick, BW_FRAMES, BW_WIN_SCORE, type BwState } from "@/lib/games/bowling"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function BowlingView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BwState>(() => bwNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(bwNew())
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
    if (!state.rolling) return
    const id = setInterval(() => {
      setState((s) => {
        const before = s.totalScore
        const next = bwTick(s)
        if (next.totalScore > before && soundOn) playCaptureSound()
        return next
      })
    }, 40)
    return () => clearInterval(id)
  }, [state.rolling, soundOn])

  return (
    <PuzzleShell
      gameId="bowling"
      title="保齡球"
      subtitle="3 局內擊倒的球瓶數達標即過關"
      status={`第 ${Math.min(state.frame, BW_FRAMES)}／${BW_FRAMES} 局　總分：${state.totalScore}／${BW_WIN_SCORE}`}
      rulesBrief="拖曳滑桿調整擲球角度，按「擲球」讓球滾向球瓶，3 局結束後累積擊倒球瓶數達到目標即過關。"
      solved={state.over && state.won}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="relative h-64 w-48 overflow-hidden rounded-2xl border border-border bg-[oklch(0.55_0.1_50)] shadow-lg">
        <div className="absolute inset-x-6 top-2 flex flex-wrap justify-center gap-1.5" style={{ width: "calc(100% - 3rem)" }}>
          {state.standing.map((alive, i) => (
            <div
              key={i}
              className={`h-3 w-3 rounded-full transition-opacity ${alive ? "bg-white opacity-100" : "opacity-0"}`}
              style={{ order: i }}
            />
          ))}
        </div>
        {state.rolling && (
          <div
            className="absolute rounded-full bg-[oklch(0.3_0.02_50)] shadow-md"
            style={{ left: `calc(${state.ballX}% - 6px)`, top: state.ballY, width: 12, height: 12 }}
          />
        )}
      </div>
      {!state.rolling && !state.over && (
        <div className="w-full max-w-xs space-y-2">
          <input
            type="range"
            min={-30}
            max={30}
            value={state.angle}
            onChange={(e) => setState((s) => bwSetAngle(s, Number(e.target.value)))}
            className="w-full"
          />
          <button
            onClick={() => setState((s) => bwRoll(s))}
            className="w-full rounded-full bg-primary py-2 text-xs font-bold text-primary-foreground active:scale-95"
          >
            擲球
          </button>
        </div>
      )}
      <p className="text-center text-xs text-muted-foreground">{state.message}</p>
    </PuzzleShell>
  )
}
