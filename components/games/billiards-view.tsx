"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { blNew, blShoot, blTick, type BlState } from "@/lib/games/billiards"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function BilliardsView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BlState>(() => blNew())
  const overRef = useRef(false)
  const fieldRef = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null)

  const restart = () => {
    setState(blNew())
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
        const before = s.pocketed
        const next = blTick(s)
        if (next.pocketed > before && soundOn) playCaptureSound()
        return next
      })
    }, 24)
    return () => clearInterval(id)
  }, [soundOn])

  const toPct = (clientX: number, clientY: number) => {
    const field = fieldRef.current
    if (!field) return { x: 50, y: 50 }
    const rect = field.getBoundingClientRect()
    return { x: ((clientX - rect.left) / rect.width) * 100, y: ((clientY - rect.top) / rect.height) * 100 }
  }

  const handleUp = (clientX: number, clientY: number) => {
    if (!drag || state.moving) {
      setDrag(null)
      return
    }
    const p = toPct(clientX, clientY)
    const dx = state.cue.x - p.x
    const dy = state.cue.y - p.y
    setState((s) => blShoot(s, dx, dy))
    setDrag(null)
  }

  const aimEnd = drag ?? { x: state.cue.x, y: state.cue.y }
  const aimDx = state.cue.x - aimEnd.x
  const aimDy = state.cue.y - aimEnd.y
  const aimLen = Math.hypot(aimDx, aimDy)

  return (
    <PuzzleShell
      gameId="billiards"
      title="撞球對戰"
      subtitle="拖曳瞄準，把所有球打進袋口"
      status={`已進袋：${state.pocketed}／6　剩餘擊球次數：${state.shotsLeft}`}
      rulesBrief="從母球往反方向拖曳瞄準，放開手指即擊球，利用彈牆與碰撞把所有彩球打進四角與中間的袋口，在擊球次數用盡前清空全部球即過關。"
      solved={state.over && state.won}
      cost={12}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        ref={fieldRef}
        className="relative touch-none overflow-hidden rounded-2xl border-4 border-[oklch(0.35_0.08_140)] bg-[oklch(0.42_0.09_150)] shadow-lg"
        style={{ width: 280, height: 280 }}
        onPointerDown={(e) => setDrag(toPct(e.clientX, e.clientY))}
        onPointerMove={(e) => drag && setDrag(toPct(e.clientX, e.clientY))}
        onPointerUp={(e) => handleUp(e.clientX, e.clientY)}
        onTouchStart={(e) => setDrag(toPct(e.touches[0].clientX, e.touches[0].clientY))}
        onTouchMove={(e) => drag && setDrag(toPct(e.touches[0].clientX, e.touches[0].clientY))}
        onTouchEnd={(e) => handleUp(e.changedTouches[0].clientX, e.changedTouches[0].clientY)}
      >
        {[
          { x: 4, y: 4 },
          { x: 50, y: 3 },
          { x: 96, y: 4 },
          { x: 4, y: 96 },
          { x: 50, y: 97 },
          { x: 96, y: 96 },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-black/80"
            style={{ left: `calc(${p.x}% - 6px)`, top: `calc(${p.y}% - 6px)`, width: 12, height: 12 }}
          />
        ))}
        {drag && !state.moving && aimLen > 2 && (
          <svg className="absolute inset-0 h-full w-full">
            <line
              x1={`${state.cue.x}%`}
              y1={`${state.cue.y}%`}
              x2={`${state.cue.x + aimDx * 3}%`}
              y2={`${state.cue.y + aimDy * 3}%`}
              stroke="white"
              strokeOpacity={0.6}
              strokeWidth={1.5}
              strokeDasharray="3 3"
            />
          </svg>
        )}
        {state.balls.map(
          (b) =>
            b.active && (
              <div
                key={b.id}
                className="absolute rounded-full shadow-md"
                style={{
                  left: `calc(${b.x}% - 5px)`,
                  top: `calc(${b.y}% - 5px)`,
                  width: 10,
                  height: 10,
                  backgroundColor: `oklch(0.62 0.18 ${b.hue})`,
                }}
              />
            ),
        )}
        {state.cue.active && (
          <div
            className="absolute rounded-full bg-white shadow-md"
            style={{ left: `calc(${state.cue.x}% - 5px)`, top: `calc(${state.cue.y}% - 5px)`, width: 10, height: 10 }}
          />
        )}
      </div>
      {state.over && (
        <p className={`text-center text-xs font-semibold ${state.won ? "text-primary" : "text-destructive"}`}>
          {state.won ? "恭喜清空全部球！" : "擊球次數用盡，點「重新開始」再挑戰一次！"}
        </p>
      )}
    </PuzzleShell>
  )
}
