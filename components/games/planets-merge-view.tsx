"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PuzzleShell } from "./puzzle-shell"
import {
  planetStep,
  planetIsOver,
  planetNewId,
  planetRandomSpawnLevel,
  PLANET_LEVELS,
  PLANET_WIDTH,
  PLANET_HEIGHT,
  type PlanetItem,
} from "@/lib/games/planets-merge"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound } from "@/lib/games/game-audio"

const CENTER_X = PLANET_WIDTH / 2
const NUDGE_STEP = 22
const DISPLAY_WIDTH = 280

type Star = { x: number; y: number; r: number; phase: number }
const STARS: Star[] = Array.from({ length: 50 }, () => ({
  x: Math.random() * PLANET_WIDTH,
  y: Math.random() * PLANET_HEIGHT,
  r: Math.random() * 1.4 + 0.3,
  phase: Math.random() * Math.PI * 2,
}))

export function PlanetsMergeView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [items, setItems] = useState<PlanetItem[]>([])
  const [dropX, setDropX] = useState(CENTER_X)
  const [nextLevel, setNextLevel] = useState(() => planetRandomSpawnLevel())
  const [queuedLevel, setQueuedLevel] = useState(() => planetRandomSpawnLevel())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const [canDrop, setCanDrop] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dropGuardRef = useRef(false)
  const overStreakRef = useRef(0)
  const tRef = useRef(0)
  const stateRef = useRef({ items, over, dropX, nextLevel, canDrop })
  stateRef.current = { items, over, dropX, nextLevel, canDrop }

  useEffect(() => {
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(1.6, (now - last) / 16.67)
      last = now
      tRef.current += dt
      if (!stateRef.current.over) {
        setItems((prev) => {
          const { items: next, merges } = planetStep(prev, dt)
          if (merges.length) {
            let add = 0
            for (const m of merges) add += m.score
            setScore((s) => s + add)
            if (soundOn) playMoveSound()
          }
          if (planetIsOver(next)) {
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
    ctx.clearRect(0, 0, PLANET_WIDTH, PLANET_HEIGHT)

    // 星空背景
    const bg = ctx.createLinearGradient(0, 0, 0, PLANET_HEIGHT)
    bg.addColorStop(0, "#0b0f2e")
    bg.addColorStop(0.55, "#14183f")
    bg.addColorStop(1, "#1c1340")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, PLANET_WIDTH, PLANET_HEIGHT)

    // 星雲光暈
    const nebula = ctx.createRadialGradient(
      PLANET_WIDTH * 0.7,
      PLANET_HEIGHT * 0.3,
      10,
      PLANET_WIDTH * 0.7,
      PLANET_HEIGHT * 0.3,
      180,
    )
    nebula.addColorStop(0, "rgba(130,80,220,0.18)")
    nebula.addColorStop(1, "rgba(130,80,220,0)")
    ctx.fillStyle = nebula
    ctx.fillRect(0, 0, PLANET_WIDTH, PLANET_HEIGHT)

    // 閃爍星星
    for (const s of STARS) {
      const tw = 0.5 + 0.5 * Math.sin(tRef.current * 0.05 + s.phase)
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${0.3 + tw * 0.5})`
      ctx.fill()
    }

    // 危險線
    ctx.strokeStyle = "rgba(255,100,100,0.4)"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, PLANET_HEIGHT * 0.12)
    ctx.lineTo(PLANET_WIDTH, PLANET_HEIGHT * 0.12)
    ctx.stroke()
    ctx.setLineDash([])

    for (const f of stateRef.current.items) {
      drawRealisticPlanet(ctx, f.x, f.y, PLANET_LEVELS[f.level].radius, f.level)
    }

    if (!stateRef.current.over && stateRef.current.canDrop) {
      const lv = PLANET_LEVELS[stateRef.current.nextLevel]
      ctx.beginPath()
      ctx.setLineDash([3, 4])
      ctx.moveTo(stateRef.current.dropX, lv.radius * 2 + 8)
      ctx.lineTo(stateRef.current.dropX, PLANET_HEIGHT)
      ctx.strokeStyle = "rgba(255,255,255,0.15)"
      ctx.stroke()
      ctx.setLineDash([])
      drawRealisticPlanet(ctx, stateRef.current.dropX, lv.radius + 10, lv.radius, stateRef.current.nextLevel)
    }
  }

  function clampX(x: number, level: number) {
    const r = PLANET_LEVELS[level].radius
    return Math.max(r, Math.min(PLANET_WIDTH - r, x))
  }

  function nudge(dir: -1 | 1) {
    if (over) return
    setDropX((x) => clampX(x + dir * NUDGE_STEP, nextLevel))
  }

  function handlePointerMove(clientX: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = PLANET_WIDTH / rect.width
    const x = (clientX - rect.left) * scale
    setDropX(clampX(x, nextLevel))
  }

  function handleDrop() {
    if (over || !canDrop || dropGuardRef.current) return
    dropGuardRef.current = true
    setCanDrop(false)
    setItems((prev) => [
      ...prev,
      { id: planetNewId(), x: dropX, y: PLANET_LEVELS[nextLevel].radius + 10, vx: 0, vy: 0.12, level: nextLevel },
    ])
    const upcoming = queuedLevel
    setNextLevel(upcoming)
    setQueuedLevel(planetRandomSpawnLevel())
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
    const first = planetRandomSpawnLevel()
    setNextLevel(first)
    setQueuedLevel(planetRandomSpawnLevel())
    setDropX(clampX(CENTER_X, first))
  }

  const queuedLv = PLANET_LEVELS[queuedLevel]

  return (
    <PuzzleShell
      gameId="planets-merge"
      title="星球合成"
      subtitle="星球從頂端中間出現，左右移動尋找落下位置，相同星球碰到即合成更大一級的星球"
      status={over ? `遊戲結束，分數 ${score}（最佳 ${best}）` : `分數：${score}`}
      rulesBrief="星球固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下星球」後會緩緩落下。兩個等級相同的星球碰到會合併升級成下一等級的新星球，從星星一路合成到星系。星球堆到頂端危險線且靜止不動時，遊戲結束。"
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
          width={PLANET_WIDTH}
          height={PLANET_HEIGHT}
          className="touch-none rounded-2xl border border-border shadow-lg"
          style={{ width: DISPLAY_WIDTH, height: Math.round((DISPLAY_WIDTH * PLANET_HEIGHT) / PLANET_WIDTH) }}
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
            放下星球
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
    drawRealisticPlanet(ctx, 14, 14, 11, level)
  }, [level])
  return <canvas ref={ref} width={28} height={28} className="h-7 w-7" />
}

/** 仿真立體星球繪製：依等級套用不同質感（隕石坑、環帶、光暈、螺旋星系）。 */
function drawRealisticPlanet(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  const lv = PLANET_LEVELS[level]

  // 土星環／星系外圈先畫在星體後方
  if (level === 5) {
    ctx.save()
    ctx.strokeStyle = "rgba(230,200,150,0.7)"
    ctx.lineWidth = Math.max(2, r * 0.12)
    ctx.beginPath()
    ctx.ellipse(x, y, r * 1.7, r * 0.5, -0.3, 0, Math.PI * 2)
    ctx.stroke()
    ctx.restore()
  }
  if (level === 9) {
    ctx.save()
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(190,150,255,${0.25 - i * 0.06})`
      ctx.lineWidth = Math.max(1.5, r * (0.1 - i * 0.02))
      ctx.beginPath()
      ctx.ellipse(x, y, r * (1.3 + i * 0.35), r * (0.9 + i * 0.25), 0.4, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.restore()
  }

  if (level === 8) {
    // 太陽光暈
    const glow = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * 1.8)
    glow.addColorStop(0, "rgba(255,180,60,0.45)")
    glow.addColorStop(1, "rgba(255,180,60,0)")
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(x, y, r * 1.8, 0, Math.PI * 2)
    ctx.fill()
  }

  if (level === 0) {
    drawStarShape(ctx, x, y, r, lv.color)
    return
  }

  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r)
  grad.addColorStop(0, lightenColor(lv.color, 55))
  grad.addColorStop(0.55, lv.color)
  grad.addColorStop(1, darkenColor(lv.color, 45))
  ctx.fillStyle = grad
  ctx.shadowColor = "rgba(0,0,0,0.5)"
  ctx.shadowBlur = Math.max(4, r * 0.2)
  ctx.shadowOffsetY = Math.max(2, r * 0.1)
  ctx.fill()
  ctx.restore()

  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.clip()
  drawPlanetTexture(ctx, x, y, r, level)
  ctx.restore()

  ctx.beginPath()
  ctx.ellipse(x - r * 0.3, y - r * 0.4, r * 0.26, r * 0.15, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,255,0.45)"
  ctx.fill()
}

function drawStarShape(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save()
  ctx.shadowColor = "rgba(255,220,100,0.8)"
  ctx.shadowBlur = r * 1.2
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const ang = (i / 10) * Math.PI * 2 - Math.PI / 2
    const rad = i % 2 === 0 ? r : r * 0.42
    const px = x + Math.cos(ang) * rad
    const py = y + Math.sin(ang) * rad
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
  const grad = ctx.createRadialGradient(x, y, 0, x, y, r)
  grad.addColorStop(0, "#fff6d0")
  grad.addColorStop(1, color)
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()
}

function drawPlanetTexture(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  switch (level) {
    case 1: {
      // 月亮：隕石坑
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + 0.4
        const rad = r * (0.3 + 0.4 * ((i % 3) / 2))
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad, r * 0.12, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,0,0,0.18)"
        ctx.fill()
      }
      break
    }
    case 2: {
      // 地球：大陸輪廓
      ctx.fillStyle = "rgba(60,140,60,0.75)"
      ctx.beginPath()
      ctx.ellipse(x - r * 0.3, y - r * 0.2, r * 0.4, r * 0.25, 0.4, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(x + r * 0.35, y + r * 0.35, r * 0.3, r * 0.2, -0.3, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "rgba(255,255,255,0.35)"
      ctx.beginPath()
      ctx.ellipse(x, y - r * 0.6, r * 0.5, r * 0.18, 0, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 3: {
      // 火星：深色斑塊
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2
        ctx.beginPath()
        ctx.ellipse(x + Math.cos(ang) * r * 0.4, y + Math.sin(ang) * r * 0.4, r * 0.22, r * 0.14, ang, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(100,40,20,0.3)"
        ctx.fill()
      }
      break
    }
    case 4: {
      // 木星：條紋
      ctx.strokeStyle = "rgba(140,90,40,0.4)"
      for (let i = -3; i <= 3; i++) {
        ctx.lineWidth = Math.max(1, r * 0.1)
        ctx.beginPath()
        ctx.moveTo(x - r, y + i * r * 0.26)
        ctx.quadraticCurveTo(x, y + i * r * 0.26 + r * 0.08, x + r, y + i * r * 0.26)
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.ellipse(x + r * 0.2, y + r * 0.1, r * 0.2, r * 0.13, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(180,80,50,0.5)"
      ctx.fill()
      break
    }
    case 5: {
      // 土星：淡色帶
      ctx.strokeStyle = "rgba(150,110,60,0.3)"
      for (let i = -2; i <= 2; i++) {
        ctx.lineWidth = Math.max(1, r * 0.1)
        ctx.beginPath()
        ctx.moveTo(x - r, y + i * r * 0.3)
        ctx.lineTo(x + r, y + i * r * 0.3)
        ctx.stroke()
      }
      break
    }
    case 6: {
      // 天王星：淡淡環痕
      ctx.strokeStyle = "rgba(255,255,255,0.25)"
      ctx.lineWidth = Math.max(1, r * 0.06)
      ctx.beginPath()
      ctx.ellipse(x, y, r * 0.95, r * 0.25, 0.9, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 7: {
      // 海王星：風暴斑
      ctx.beginPath()
      ctx.ellipse(x + r * 0.2, y - r * 0.1, r * 0.25, r * 0.17, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(10,20,80,0.4)"
      ctx.fill()
      break
    }
    case 8: {
      // 太陽：火焰紋理
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(ang) * r * 0.3, y + Math.sin(ang) * r * 0.3)
        ctx.lineTo(x + Math.cos(ang) * r * 0.95, y + Math.sin(ang) * r * 0.95)
        ctx.strokeStyle = "rgba(255,255,200,0.3)"
        ctx.lineWidth = Math.max(1, r * 0.05)
        ctx.stroke()
      }
      break
    }
    case 9: {
      // 星系：螺旋臂
      ctx.strokeStyle = "rgba(255,255,255,0.5)"
      ctx.lineWidth = Math.max(1, r * 0.07)
      for (let arm = 0; arm < 2; arm++) {
        ctx.beginPath()
        for (let t = 0; t < 1; t += 0.05) {
          const ang = t * Math.PI * 3 + arm * Math.PI
          const rad = t * r * 0.95
          const px = x + Math.cos(ang) * rad
          const py = y + Math.sin(ang) * rad
          if (t === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
      ctx.beginPath()
      ctx.arc(x, y, r * 0.22, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.fill()
      break
    }
  }
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
