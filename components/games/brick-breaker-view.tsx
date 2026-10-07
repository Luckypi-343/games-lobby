"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { bbNew, bbMovePaddle, bbLaunch, bbTick, BB_COLS, BB_ROWS, type BbState } from "@/lib/games/brick-breaker"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const BRICK_HUES = [25, 48, 85, 150, 260]

export function BrickBreakerView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BbState>(() => bbNew())
  const overRef = useRef(false)
  const fieldRef = useRef<HTMLDivElement>(null)

  const restart = () => {
    setState(bbNew())
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
        const before = s.score
        const next = bbTick(s)
        if (next.score > before && soundOn) playCaptureSound()
        return next
      })
    }, 26)
    return () => clearInterval(id)
  }, [soundOn])

  const moveToClientX = (clientX: number) => {
    const field = fieldRef.current
    if (!field) return
    const rect = field.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setState((s) => bbMovePaddle(s, pct))
  }

  return (
    <PuzzleShell
      gameId="brick-breaker"
      title="打磚塊"
      subtitle="打光所有磚塊即過關"
      status={`分數：${state.score}　生命：${"❤".repeat(Math.max(0, state.lives))}`}
      rulesBrief="左右拖曳擋板反彈球，打掉所有磚塊即過關；球掉出畫面會扣一條生命，生命耗盡則挑戰失敗。"
      solved={state.over && state.won}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        ref={fieldRef}
        className="relative touch-none overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        style={{ width: 260, height: 320 }}
        onPointerDown={(e) => moveToClientX(e.clientX)}
        onPointerMove={(e) => e.buttons > 0 && moveToClientX(e.clientX)}
        onTouchStart={(e) => moveToClientX(e.touches[0].clientX)}
        onTouchMove={(e) => moveToClientX(e.touches[0].clientX)}
      >
        {state.bricks.map((row, r) =>
          row.map((alive, c) => {
            if (!alive) return null
            const w = 100 / BB_COLS
            const h = 6
            return (
              <div
                key={`${r}-${c}`}
                className="absolute rounded-sm"
                style={{
                  left: `${c * w}%`,
                  top: `${8 + r * h}%`,
                  width: `${w - 1.2}%`,
                  height: `${h - 1}%`,
                  backgroundColor: `oklch(0.66 0.17 ${BRICK_HUES[r % BRICK_HUES.length]})`,
                }}
              />
            )
          }),
        )}
        <div
          className="absolute rounded-full bg-primary"
          style={{ left: `calc(${state.ball.x}% - 5px)`, top: `calc(${state.ball.y}% - 5px)`, width: 10, height: 10 }}
        />
        <div
          className="absolute rounded-full bg-accent"
          style={{
            left: `calc(${state.paddleX}% - ${state.paddleWidth / 2}%)`,
            top: "88%",
            width: `${state.paddleWidth}%`,
            height: "3%",
          }}
        />
      </div>
      {!state.launched && !state.over && (
        <button
          onClick={() => setState((s) => bbLaunch(s))}
          className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-primary-foreground active:scale-95"
        >
          發球
        </button>
      )}
      {state.over && !state.won && (
        <p className="text-center text-xs font-semibold text-destructive">生命耗盡，點「重新開始」再挑戰一次！</p>
      )}
    </PuzzleShell>
  )
}
