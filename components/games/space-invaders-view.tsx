"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import {
  siNew,
  siMove,
  siShoot,
  siTick,
  SI_COLS,
  SI_ALIEN_ROWS,
  SI_GRID_ROWS,
  type SiState,
} from "@/lib/games/space-invaders"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function SpaceInvadersView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<SiState>(() => siNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(siNew())
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
    // 下降／前進速度調整為原本的 30%（間隔拉長為約 3.3 倍），讓節奏更從容好操作
    const id = setInterval(() => {
      setState((s) => siTick(s))
    }, 930)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setState((s) => siMove(s, -1))
      else if (e.key === "ArrowRight") setState((s) => siMove(s, 1))
      else if (e.key === " ") shoot()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const shoot = () => {
    setState((s) => {
      const next = siShoot(s)
      if (next.playerBullet && !s.playerBullet && soundOn) playCaptureSound()
      return next
    })
  }

  // 場地寬×高加大為原本的 1.3 倍 × 1.5 倍：橫向與縱向各自獨立縮放，戰機/敵艦方塊仍維持清晰可辨識的比例
  const WIDTH_SCALE = 1.3
  const HEIGHT_SCALE = 1.5
  const cellW = 26 * WIDTH_SCALE
  const cellH = 26 * HEIGHT_SCALE
  const gapW = 3 * WIDTH_SCALE
  const gapH = 3 * HEIGHT_SCALE

  return (
    <PuzzleShell
      gameId="space-invaders"
      title="太空侵略者"
      subtitle="清光整編隊即獲勝"
      status={`分數：${state.score}　生命：${"❤".repeat(Math.max(0, state.lives))}`}
      rulesBrief="左右移動戰機閃避敵彈，發射砲彈擊落整編隊的外星戰艦，若編隊逼近或生命耗盡則挑戰失敗。"
      solved={state.over && state.won}
      cost={12}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative touch-none rounded-2xl border border-border bg-card shadow-lg"
        style={{
          width: SI_COLS * (cellW + gapW) - gapW + 16,
          height: SI_GRID_ROWS * (cellH + gapH) - gapH + 16,
          padding: 8,
        }}
      >
        {state.alive.map((row, r) =>
          row.map((isAlive, c) => {
            if (!isAlive) return null
            const top = (r + state.offsetRow) * (cellH + gapH) + state.colOffset * 4
            const left = c * (cellW + gapW) + state.colOffset * 4
            return (
              <div
                key={`${r}-${c}`}
                className="absolute rounded-md bg-[oklch(0.62_0.19_150)] shadow-[0_0_6px_oklch(0.62_0.19_150_/_0.6)]"
                style={{ width: cellW, height: cellH, top, left }}
              />
            )
          }),
        )}
        {state.playerBullet && (
          <div
            className="absolute rounded-full bg-[oklch(0.85_0.18_90)]"
            style={{
              width: 6,
              height: 14,
              left: state.playerBullet.col * (cellW + gapW) + cellW / 2 - 3,
              top: state.playerBullet.row * (cellH + gapH),
            }}
          />
        )}
        {state.enemyBullets.map((b, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-destructive"
            style={{
              width: 6,
              height: 14,
              left: b.col * (cellW + gapW) + cellW / 2 - 3,
              top: b.row * (cellH + gapH),
            }}
          />
        ))}
        <div
          className="absolute rounded-md bg-primary shadow-[0_0_8px_oklch(0.55_0.2_260_/_0.6)]"
          style={{
            width: cellW,
            height: cellH,
            left: state.playerCol * (cellW + gapW),
            top: (SI_GRID_ROWS - 1) * (cellH + gapH),
          }}
        />
      </div>
      {state.over && !state.won && (
        <p className="text-center text-xs font-semibold text-destructive">挑戰失敗，點「重新開始」再來一次！</p>
      )}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => setState((s) => siMove(s, -1))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ←
        </button>
        <button
          onClick={shoot}
          className="flex h-10 w-14 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground active:scale-90"
        >
          {soundOn ? "開火" : "開火"}
        </button>
        <button
          onClick={() => setState((s) => siMove(s, 1))}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}
