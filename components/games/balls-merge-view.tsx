"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PuzzleShell } from "./puzzle-shell"
import {
  ballStep,
  ballIsOver,
  ballNewId,
  ballRandomSpawnLevel,
  BALL_LEVELS,
  BALL_WIDTH,
  BALL_HEIGHT,
  type BallItem,
} from "@/lib/games/balls-merge"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const CENTER_X = BALL_WIDTH / 2
const NUDGE_STEP = 22
const DISPLAY_WIDTH = 280

export function BallsMergeView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [items, setItems] = useState<BallItem[]>([])
  const [dropX, setDropX] = useState(CENTER_X)
  const [nextLevel, setNextLevel] = useState(() => ballRandomSpawnLevel())
  const [queuedLevel, setQueuedLevel] = useState(() => ballRandomSpawnLevel())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const [canDrop, setCanDrop] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dropGuardRef = useRef(false)
  const overStreakRef = useRef(0)
  const stateRef = useRef({ items, over, dropX, nextLevel, canDrop })
  stateRef.current = { items, over, dropX, nextLevel, canDrop }

  useEffect(() => {
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(1.6, (now - last) / 16.67)
      last = now
      if (!stateRef.current.over) {
        setItems((prev) => {
          const { items: next, merges } = ballStep(prev, dt)
          if (merges.length) {
            let add = 0
            for (const m of merges) add += m.score
            setScore((s) => s + add)
            if (soundOn) playMoveSound()
          }
          if (ballIsOver(next)) {
            overStreakRef.current += 1
          } else {
            overStreakRef.current = 0
          }
          if (overStreakRef.current > 36) {
            setOver(true)
            setBest((b) => Math.max(b, score))
            if (soundOn) playLossSound()
          }
          return next
        })
      }
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn])

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, BALL_WIDTH, BALL_HEIGHT)

    // 運動場草地背景
    const bg = ctx.createLinearGradient(0, 0, 0, BALL_HEIGHT)
    bg.addColorStop(0, "#e9f7e3")
    bg.addColorStop(1, "#bfe6a8")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, BALL_WIDTH, BALL_HEIGHT)

    // 草地條紋
    ctx.save()
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = i % 2 === 0 ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)"
      ctx.fillRect(0, (i * BALL_HEIGHT) / 10, BALL_WIDTH, BALL_HEIGHT / 10)
    }
    ctx.restore()

    // 場地中線與中圈（球場風格外觀）
    ctx.strokeStyle = "rgba(255,255,255,0.55)"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(BALL_WIDTH / 2, BALL_HEIGHT * 0.65, 46, 0, Math.PI * 2)
    ctx.stroke()

    // 危險線
    ctx.strokeStyle = "rgba(220,38,38,0.4)"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, BALL_HEIGHT * 0.12)
    ctx.lineTo(BALL_WIDTH, BALL_HEIGHT * 0.12)
    ctx.stroke()
    ctx.setLineDash([])

    for (const f of stateRef.current.items) {
      drawRealisticBall(ctx, f.x, f.y, BALL_LEVELS[f.level].radius, f.level)
    }

    if (!stateRef.current.over && stateRef.current.canDrop) {
      const lv = BALL_LEVELS[stateRef.current.nextLevel]
      ctx.beginPath()
      ctx.setLineDash([3, 4])
      ctx.moveTo(stateRef.current.dropX, lv.radius * 2 + 8)
      ctx.lineTo(stateRef.current.dropX, BALL_HEIGHT)
      ctx.strokeStyle = "rgba(0,0,0,0.12)"
      ctx.stroke()
      ctx.setLineDash([])
      drawRealisticBall(ctx, stateRef.current.dropX, lv.radius + 10, lv.radius, stateRef.current.nextLevel)
    }
  }

  function clampX(x: number, level: number) {
    const r = BALL_LEVELS[level].radius
    return Math.max(r, Math.min(BALL_WIDTH - r, x))
  }

  function nudge(dir: -1 | 1) {
    if (over) return
    setDropX((x) => clampX(x + dir * NUDGE_STEP, nextLevel))
  }

  function handlePointerMove(clientX: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = BALL_WIDTH / rect.width
    const x = (clientX - rect.left) * scale
    setDropX(clampX(x, nextLevel))
  }

  function handleDrop() {
    if (over || !canDrop || dropGuardRef.current) return
    dropGuardRef.current = true
    setCanDrop(false)
    setItems((prev) => [
      ...prev,
      { id: ballNewId(), x: dropX, y: BALL_LEVELS[nextLevel].radius + 10, vx: 0, vy: 0.12, level: nextLevel },
    ])
    const upcoming = queuedLevel
    setNextLevel(upcoming)
    setQueuedLevel(ballRandomSpawnLevel())
    setDropX(clampX(CENTER_X, upcoming))
    setTimeout(() => {
      setCanDrop(true)
      dropGuardRef.current = false
    }, 650)
  }

  function restart() {
    setItems([])
    setScore(0)
    setOver(false)
    setCanDrop(true)
    const first = ballRandomSpawnLevel()
    setNextLevel(first)
    setQueuedLevel(ballRandomSpawnLevel())
    setDropX(clampX(CENTER_X, first))
  }

  const queuedLv = BALL_LEVELS[queuedLevel]

  return (
    <PuzzleShell
      gameId="balls-merge"
      title="球類合成"
      subtitle="球從頂端中間出現，左右移動尋找落下位置，相同球碰到即合成更大一級的球"
      status={over ? `遊戲結束，分數 ${score}（最佳 ${best}）` : `分數：${score}`}
      rulesBrief="球固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下球」後會緩緩落下。兩個等級相同的球碰到會合併升級成下一等級的新球，從乒乓球一路合成到橄欖球。球堆到頂端危險線且靜止不動時，遊戲結束。"
      solved={false}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">預告下一個</span>
          <PreviewSwatch level={queuedLevel} />
          <span className="text-xs font-bold text-foreground">{queuedLv.name}</span>
        </div>

        <canvas
          ref={canvasRef}
          width={BALL_WIDTH}
          height={BALL_HEIGHT}
          className="touch-none rounded-2xl border border-border shadow-lg"
          style={{ width: DISPLAY_WIDTH, height: Math.round((DISPLAY_WIDTH * BALL_HEIGHT) / BALL_WIDTH) }}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onMouseDown={(e) => handlePointerMove(e.clientX)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
          onTouchStart={(e) => handlePointerMove(e.touches[0].clientX)}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => nudge(-1)}
            disabled={over}
            aria-label="向左移動"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow active:scale-95 disabled:opacity-40"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleDrop}
            disabled={over || !canDrop}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow active:scale-95 disabled:opacity-40"
          >
            放下球
          </button>
          <button
            onClick={() => nudge(1)}
            disabled={over}
            aria-label="向右移動"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card shadow active:scale-95 disabled:opacity-40"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </PuzzleShell>
  )
}

function PreviewSwatch({ level }: { level: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, 28, 28)
    drawRealisticBall(ctx, 14, 14, 11, level)
  }, [level])
  return <canvas ref={ref} width={28} height={28} className="h-7 w-7" />
}

/** 仿真立體球類繪製：依等級套用不同質感（縫線、五邊形、條紋）與專屬配色。 */
function drawRealisticBall(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  const lv = BALL_LEVELS[level]

  // 橄欖球為橢圓形，其餘為正圓
  ctx.save()
  ctx.beginPath()
  if (level === 10) {
    ctx.ellipse(x, y, r * 1.15, r * 0.78, 0, 0, Math.PI * 2)
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2)
  }
  const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r)
  grad.addColorStop(0, lightenColor(lv.color, 60))
  grad.addColorStop(0.55, lv.color)
  grad.addColorStop(1, darkenColor(lv.color, 40))
  ctx.fillStyle = grad
  ctx.shadowColor = "rgba(0,0,0,0.35)"
  ctx.shadowBlur = Math.max(4, r * 0.18)
  ctx.shadowOffsetY = Math.max(2, r * 0.1)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  if (level === 10) {
    ctx.ellipse(x, y, r * 1.15, r * 0.78, 0, 0, Math.PI * 2)
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2)
  }
  ctx.clip()
  drawBallTexture(ctx, x, y, r, level)
  ctx.restore()

  ctx.beginPath()
  ctx.ellipse(x - r * 0.3, y - r * 0.4, r * 0.26, r * 0.15, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,255,0.55)"
  ctx.fill()
}

function drawBallTexture(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  switch (level) {
    case 0: {
      // 乒乓球：一條細小商標弧線
      ctx.beginPath()
      ctx.arc(x, y, r * 0.5, 0.2, 1.4)
      ctx.strokeStyle = "rgba(0,0,0,0.1)"
      ctx.lineWidth = 1
      ctx.stroke()
      break
    }
    case 1: {
      // 撞球：白色圓點編號底
      ctx.beginPath()
      ctx.arc(x, y - r * 0.1, r * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.92)"
      ctx.fill()
      ctx.fillStyle = "#333"
      ctx.font = `bold ${Math.round(r * 0.4)}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText("9", x, y - r * 0.08)
      break
    }
    case 2: {
      // 網球：白色弧線縫
      ctx.strokeStyle = "rgba(255,255,255,0.85)"
      ctx.lineWidth = Math.max(1, r * 0.08)
      ctx.beginPath()
      ctx.arc(x - r * 0.5, y, r * 0.9, -0.9, 0.9)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x + r * 0.5, y, r * 0.9, Math.PI - 0.9, Math.PI + 0.9)
      ctx.stroke()
      break
    }
    case 3: {
      // 樂樂球：柔軟泡棉點紋
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * r * 0.5, y + Math.sin(ang) * r * 0.5, r * 0.08, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.3)"
        ctx.fill()
      }
      break
    }
    case 4: {
      // 棒球：紅色縫線
      ctx.strokeStyle = "#c92a2a"
      ctx.lineWidth = Math.max(1, r * 0.06)
      for (const side of [-1, 1]) {
        ctx.beginPath()
        ctx.arc(x + side * r * 0.45, y, r * 0.8, 1.1, 2.3)
        ctx.stroke()
        for (let t = 1.1; t < 2.3; t += 0.25) {
          const px = x + side * r * 0.45 + Math.cos(t) * r * 0.8
          const py = y + Math.sin(t) * r * 0.8
          ctx.beginPath()
          ctx.moveTo(px - 2, py - 2)
          ctx.lineTo(px + 2, py + 2)
          ctx.stroke()
        }
      }
      break
    }
    case 5: {
      // 槌球：光澤無紋理
      break
    }
    case 6: {
      // 手球：三角分色塊
      ctx.fillStyle = "rgba(255,255,255,0.25)"
      ctx.beginPath()
      ctx.moveTo(x, y - r)
      ctx.lineTo(x + r * 0.7, y + r * 0.5)
      ctx.lineTo(x - r * 0.7, y + r * 0.5)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 7: {
      // 足球：黑色五邊形拼塊
      ctx.fillStyle = "rgba(20,20,20,0.85)"
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 - Math.PI / 2
        const px = x + Math.cos(ang) * r * 0.45
        const py = y + Math.sin(ang) * r * 0.45
        drawPentagon(ctx, px, py, r * 0.2)
      }
      drawPentagon(ctx, x, y, r * 0.22)
      break
    }
    case 8: {
      // 排球：藍色弧線拼接
      ctx.strokeStyle = "rgba(30,80,180,0.65)"
      ctx.lineWidth = Math.max(1.2, r * 0.06)
      for (let i = 0; i < 3; i++) {
        const ang = (i / 3) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * r * 0.3, y + Math.sin(ang) * r * 0.3, r * 0.6, 0, Math.PI * 2)
        ctx.stroke()
      }
      break
    }
    case 9: {
      // 籃球：黑色弧線分瓣
      ctx.strokeStyle = "rgba(20,20,20,0.75)"
      ctx.lineWidth = Math.max(1.5, r * 0.07)
      ctx.beginPath()
      ctx.moveTo(x, y - r)
      ctx.lineTo(x, y + r)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(x - r, y)
      ctx.lineTo(x + r, y)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x, y, r * 0.98, 0.3, Math.PI - 0.3)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(x, y, r * 0.98, Math.PI + 0.3, Math.PI * 2 - 0.3)
      ctx.stroke()
      break
    }
    case 10: {
      // 橄欖球：白色縫線＋皮革紋
      ctx.strokeStyle = "rgba(255,255,255,0.85)"
      ctx.lineWidth = Math.max(1.2, r * 0.07)
      ctx.beginPath()
      ctx.moveTo(x - r * 0.9, y)
      ctx.lineTo(x + r * 0.9, y)
      ctx.stroke()
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath()
        ctx.moveTo(x + i * r * 0.18, y - r * 0.12)
        ctx.lineTo(x + i * r * 0.18, y + r * 0.12)
        ctx.stroke()
      }
      break
    }
  }
}

function drawPentagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 - Math.PI / 2
    const px = cx + Math.cos(ang) * size
    const py = cy + Math.sin(ang) * size
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  ctx.fill()
}

function lightenColor(hex: string, amt: number) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.min(255, (n >> 16) + amt)
  const g = Math.min(255, ((n >> 8) & 0xff) + amt)
  const b = Math.min(255, (n & 0xff) + amt)
  return `rgb(${r},${g},${b})`
}
function darkenColor(hex: string, amt: number) {
  const n = Number.parseInt(hex.slice(1), 16)
  const r = Math.max(0, (n >> 16) - amt)
  const g = Math.max(0, ((n >> 8) & 0xff) - amt)
  const b = Math.max(0, (n & 0xff) - amt)
  return `rgb(${r},${g},${b})`
}
