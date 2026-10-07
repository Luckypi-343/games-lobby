"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { acNew, acMove, acTick, AC_COLS, AC_ROWS, AC_WIN_SCORE, type AcState } from "@/lib/games/air-combat"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function AirCombatView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<AcState>(() => acNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(acNew())
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
        const next = acTick(s, 0.16)
        if (next.score > before && soundOn) playCaptureSound()
        return next
      })
    }, 160)
    return () => clearInterval(id)
  }, [soundOn])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setState((s) => acMove(s, -1))
      else if (e.key === "ArrowRight") setState((s) => acMove(s, 1))
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const cellSize = 28
  const gap = 3
  // 總高度增加 30%
  const rowStep = (cellSize + gap) * 1.3
  const fieldHeight = AC_ROWS * rowStep - gap * 1.3 + 16

  return (
    <PuzzleShell
      gameId="air-combat"
      title="空戰爭霸"
      subtitle="存活並達到目標分數"
      status={`分數：${state.score}／${AC_WIN_SCORE}　生命：${"❤".repeat(Math.max(0, state.lives))}　剩餘：${Math.ceil(state.timeLeft)}s`}
      rulesBrief="戰機會自動開火，左右移動閃避敵機並清空對方，限時內存活且分數達標即獲勝，生命耗盡則挑戰失敗。"
      solved={state.over && state.won}
      cost={14}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative touch-none rounded-2xl border border-border bg-card shadow-lg"
        style={{ width: AC_COLS * (cellSize + gap) - gap + 16, height: fieldHeight, padding: 8 }}
      >
        {state.enemies.map((e) => (
          <div
            key={e.id}
            className="absolute rounded-md bg-[oklch(0.6_0.2_15)] shadow-[0_0_6px_oklch(0.6_0.2_15_/_0.6)]"
            style={{ width: cellSize, height: cellSize, left: e.col * (cellSize + gap), top: e.row * rowStep }}
          />
        ))}
        {state.bullets.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[oklch(0.85_0.18_90)]"
            style={{ width: 6, height: 12, left: b.col * (cellSize + gap) + cellSize / 2 - 3, top: b.row * rowStep }}
          />
        ))}
        <div
          className="absolute rounded-md bg-primary shadow-[0_0_8px_oklch(0.55_0.2_260_/_0.6)]"
          style={{
            width: cellSize,
            height: cellSize,
            left: state.playerCol * (cellSize + gap),
            top: (AC_ROWS - 1) * rowStep,
          }}
        />
        {/* 左右按鈕分開到框框的左右下角 */}
        <button
          onClick={() => setState((s) => acMove(s, -1))}
          className="absolute bottom-2 left-2 flex h-10 w-14 items-center justify-center rounded-full bg-muted/90 text-sm font-bold text-muted-foreground shadow-md active:scale-90"
        >
          ←
        </button>
        <button
          onClick={() => setState((s) => acMove(s, 1))}
          className="absolute bottom-2 right-2 flex h-10 w-14 items-center justify-center rounded-full bg-muted/90 text-sm font-bold text-muted-foreground shadow-md active:scale-90"
        >
          →
        </button>
      </div>
      {state.over && (
        <p className={`text-center text-xs font-semibold ${state.won ? "text-primary" : "text-destructive"}`}>
          {state.won ? "恭喜達成目標分數！" : "挑戰失敗，點「重新開始」再來一次！"}
        </p>
      )}
    </PuzzleShell>
  )
}
