"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { stTrim, stColorFor, ST_BASE_WIDTH, type StBlock } from "@/lib/games/stack-tower"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound, playWinSound } from "@/lib/games/game-audio"

export function StackTowerView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [stack, setStack] = useState<StBlock[]>([{ x: 20, width: ST_BASE_WIDTH, colorIndex: 0 }])
  const [moving, setMoving] = useState<StBlock>({ x: 0, width: ST_BASE_WIDTH, colorIndex: 1 })
  const [dir, setDir] = useState(1)
  const [over, setOver] = useState(false)
  const [best, setBest] = useState(0)
  const rafRef = useRef<number | null>(null)
  const stateRef = useRef({ moving, dir })
  stateRef.current = { moving, dir }

  const speed = Math.min(0.9, 0.35 + stack.length * 0.03)

  useEffect(() => {
    if (over) return
    let last = performance.now()
    const loop = (now: number) => {
      const dt = now - last
      last = now
      setMoving((m) => {
        let { x } = m
        let d = stateRef.current.dir
        x += d * speed * (dt / 16)
        if (x <= 0) {
          x = 0
          d = 1
          setDir(1)
        } else if (x + m.width >= 100) {
          x = 100 - m.width
          d = -1
          setDir(-1)
        }
        return { ...m, x }
      })
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over, speed])

  const drop = () => {
    if (over) return
    const below = stack[stack.length - 1]
    const { block, perfect } = stTrim(stateRef.current.moving, below)
    if (!block) {
      setOver(true)
      setBest((b) => Math.max(b, stack.length - 1))
      if (soundOn) playLossSound()
      return
    }
    if (soundOn) {
      if (perfect) playWinSound()
      else playMoveSound()
    }
    const nextStack = [...stack, block]
    setStack(nextStack)
    setMoving({ x: Math.random() > 0.5 ? 0 : 100 - block.width, width: block.width, colorIndex: nextStack.length })
    setDir(Math.random() > 0.5 ? 1 : -1)
  }

  const restart = () => {
    setStack([{ x: 20, width: ST_BASE_WIDTH, colorIndex: 0 }])
    setMoving({ x: 0, width: ST_BASE_WIDTH, colorIndex: 1 })
    setDir(1)
    setOver(false)
  }

  const visibleLayers = stack.slice(-6)

  return (
    <PuzzleShell
      gameId="stack-tower"
      title="疊疊樂"
      subtitle="抓準時機堆越高越好"
      status={over ? `遊戲結束，堆疊高度：${stack.length - 1}` : `高度：${stack.length - 1}　最佳：${best}`}
      rulesBrief="上方色塊會左右來回移動，點擊畫面或「放下」把它疊到下方色塊上，重疊越少方塊會越窄，沒有重疊就會掉落結束遊戲。"
      solved={false}
      cost={6}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        onClick={drop}
        className="relative touch-none overflow-hidden rounded-2xl border border-border bg-card shadow-lg"
        style={{ width: 240, height: 260 }}
      >
        {!over && (
          <div
            className={`absolute h-8 rounded-sm ${stColorFor(moving.colorIndex)}`}
            style={{ left: `${moving.x}%`, width: `${moving.width}%`, top: 8 }}
          />
        )}
        {visibleLayers
          .slice()
          .reverse()
          .map((b, i) => (
            <div
              key={stack.length - i}
              className={`absolute h-8 rounded-sm ${stColorFor(b.colorIndex)}`}
              style={{ left: `${b.x}%`, width: `${b.width}%`, bottom: i * 32 + 4 }}
            />
          ))}
      </div>
      <button
        onClick={drop}
        disabled={over}
        className="rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow active:scale-95 disabled:opacity-40"
      >
        放下
      </button>
    </PuzzleShell>
  )
}
