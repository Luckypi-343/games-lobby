"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PuzzleShell } from "./puzzle-shell"
import {
  cookieStep,
  cookieIsOver,
  cookieNewId,
  cookieRandomSpawnLevel,
  COOKIE_LEVELS,
  COOKIE_WIDTH,
  COOKIE_HEIGHT,
  type CookieItem,
} from "@/lib/games/cookies-merge"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playLossSound } from "@/lib/games/game-audio"

const CENTER_X = COOKIE_WIDTH / 2
const NUDGE_STEP = 22
const DISPLAY_WIDTH = 280

export function CookiesMergeView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [items, setItems] = useState<CookieItem[]>([])
  const [dropX, setDropX] = useState(CENTER_X)
  const [nextLevel, setNextLevel] = useState(() => cookieRandomSpawnLevel())
  const [queuedLevel, setQueuedLevel] = useState(() => cookieRandomSpawnLevel())
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
          const { items: next, merges } = cookieStep(prev, dt)
          if (merges.length) {
            let add = 0
            for (const m of merges) add += m.score
            setScore((s) => s + add)
            if (soundOn) playMoveSound()
          }
          if (cookieIsOver(next)) {
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
    ctx.clearRect(0, 0, COOKIE_WIDTH, COOKIE_HEIGHT)

    // 木質烘焙托盤背景
    const bg = ctx.createLinearGradient(0, 0, 0, COOKIE_HEIGHT)
    bg.addColorStop(0, "#f3e0c0")
    bg.addColorStop(1, "#d8b685")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, COOKIE_WIDTH, COOKIE_HEIGHT)

    // 木紋橫線
    ctx.save()
    ctx.strokeStyle = "rgba(120,80,40,0.12)"
    ctx.lineWidth = 2
    for (let i = 0; i < 14; i++) {
      const yy = (i * COOKIE_HEIGHT) / 14
      ctx.beginPath()
      ctx.moveTo(0, yy)
      ctx.quadraticCurveTo(COOKIE_WIDTH / 2, yy + 6, COOKIE_WIDTH, yy)
      ctx.stroke()
    }
    ctx.restore()

    // 危險線
    ctx.strokeStyle = "rgba(220,38,38,0.4)"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, COOKIE_HEIGHT * 0.12)
    ctx.lineTo(COOKIE_WIDTH, COOKIE_HEIGHT * 0.12)
    ctx.stroke()
    ctx.setLineDash([])

    for (const f of stateRef.current.items) {
      drawRealisticCookie(ctx, f.x, f.y, COOKIE_LEVELS[f.level].radius, f.level)
    }

    if (!stateRef.current.over && stateRef.current.canDrop) {
      const lv = COOKIE_LEVELS[stateRef.current.nextLevel]
      ctx.beginPath()
      ctx.setLineDash([3, 4])
      ctx.moveTo(stateRef.current.dropX, lv.radius * 2 + 8)
      ctx.lineTo(stateRef.current.dropX, COOKIE_HEIGHT)
      ctx.strokeStyle = "rgba(0,0,0,0.12)"
      ctx.stroke()
      ctx.setLineDash([])
      drawRealisticCookie(ctx, stateRef.current.dropX, lv.radius + 10, lv.radius, stateRef.current.nextLevel)
    }
  }

  function clampX(x: number, level: number) {
    const r = COOKIE_LEVELS[level].radius
    return Math.max(r, Math.min(COOKIE_WIDTH - r, x))
  }

  function nudge(dir: -1 | 1) {
    if (over) return
    setDropX((x) => clampX(x + dir * NUDGE_STEP, nextLevel))
  }

  function handlePointerMove(clientX: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = COOKIE_WIDTH / rect.width
    const x = (clientX - rect.left) * scale
    setDropX(clampX(x, nextLevel))
  }

  function handleDrop() {
    if (over || !canDrop || dropGuardRef.current) return
    dropGuardRef.current = true
    setCanDrop(false)
    setItems((prev) => [
      ...prev,
      { id: cookieNewId(), x: dropX, y: COOKIE_LEVELS[nextLevel].radius + 10, vx: 0, vy: 0.12, level: nextLevel },
    ])
    const upcoming = queuedLevel
    setNextLevel(upcoming)
    setQueuedLevel(cookieRandomSpawnLevel())
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
    const first = cookieRandomSpawnLevel()
    setNextLevel(first)
    setQueuedLevel(cookieRandomSpawnLevel())
    setDropX(clampX(CENTER_X, first))
  }

  const queuedLv = COOKIE_LEVELS[queuedLevel]

  return (
    <PuzzleShell
      gameId="cookies-merge"
      title="餅乾合成"
      subtitle="餅乾從頂端中間出現，左右移動尋找落下位置，相同餅乾碰到即合成更大一級的餅乾"
      status={over ? `遊戲結束，分數 ${score}（最佳 ${best}）` : `分數：${score}`}
      rulesBrief="餅乾固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下餅乾」後會緩緩落下。兩個等級相同的餅乾碰到會合併升級成下一等級的新餅乾，從三角餅乾一路合成到超大餅。餅乾堆到頂端危險線且靜止不動時，遊戲結束。"
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
          width={COOKIE_WIDTH}
          height={COOKIE_HEIGHT}
          className="touch-none rounded-2xl border border-border shadow-lg"
          style={{ width: DISPLAY_WIDTH, height: Math.round((DISPLAY_WIDTH * COOKIE_HEIGHT) / COOKIE_WIDTH) }}
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
            放下餅乾
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
    drawRealisticCookie(ctx, 14, 14, 11, level)
  }, [level])
  return <canvas ref={ref} width={28} height={28} className="h-7 w-7" />
}

/** 仿真立體餅乾繪製：依等級套用不同形狀（三角／愛心／環狀）與烘焙質感。 */
function drawRealisticCookie(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  const lv = COOKIE_LEVELS[level]

  ctx.save()
  tracePath(ctx, x, y, r, level)
  const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r)
  grad.addColorStop(0, lightenColor(lv.color, 55))
  grad.addColorStop(0.55, lv.color)
  grad.addColorStop(1, darkenColor(lv.color, 42))
  ctx.fillStyle = grad
  ctx.shadowColor = "rgba(0,0,0,0.35)"
  ctx.shadowBlur = Math.max(4, r * 0.18)
  ctx.shadowOffsetY = Math.max(2, r * 0.1)
  ctx.fill()
  ctx.restore()

  ctx.save()
  tracePath(ctx, x, y, r, level)
  ctx.clip()
  drawCookieTexture(ctx, x, y, r, level)
  ctx.restore()

  if (level !== 4 && level !== 5) {
    ctx.beginPath()
    ctx.ellipse(x - r * 0.28, y - r * 0.38, r * 0.24, r * 0.13, -0.5, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.4)"
    ctx.fill()
  }
}

function tracePath(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  ctx.beginPath()
  if (level === 0) {
    // 三角餅乾
    ctx.moveTo(x, y - r)
    ctx.lineTo(x + r * 0.95, y + r * 0.7)
    ctx.lineTo(x - r * 0.95, y + r * 0.7)
    ctx.closePath()
  } else if (level === 2) {
    // 愛心餅乾
    const s = r * 0.9
    ctx.moveTo(x, y + s * 0.8)
    ctx.bezierCurveTo(x - s * 1.4, y - s * 0.4, x - s * 0.5, y - s * 1.3, x, y - s * 0.4)
    ctx.bezierCurveTo(x + s * 0.5, y - s * 1.3, x + s * 1.4, y - s * 0.4, x, y + s * 0.8)
    ctx.closePath()
  } else if (level === 4 || level === 5) {
    // 甜甜圈／貝果：環狀（外圓，內圓以 evenodd 鏤空於貼圖階段另畫洞）
    ctx.arc(x, y, r, 0, Math.PI * 2)
  } else {
    ctx.arc(x, y, r, 0, Math.PI * 2)
  }
}

function drawCookieTexture(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  switch (level) {
    case 0: {
      // 三角餅乾：烤斑點
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.arc(x + (i - 2) * r * 0.25, y + r * 0.2, r * 0.07, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(90,50,20,0.3)"
        ctx.fill()
      }
      break
    }
    case 1: {
      // 小圓餅乾：巧克力豆
      for (let i = 0; i < 7; i++) {
        const ang = (i / 7) * Math.PI * 2 + 0.3
        const rad = r * (0.3 + 0.35 * ((i % 3) / 2))
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad, r * 0.1, 0, Math.PI * 2)
        ctx.fillStyle = "#4a2b13"
        ctx.fill()
      }
      break
    }
    case 2: {
      // 愛心餅乾：糖霜邊
      ctx.strokeStyle = "rgba(255,255,255,0.5)"
      ctx.lineWidth = Math.max(1, r * 0.08)
      ctx.beginPath()
      ctx.arc(x, y, r * 0.5, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 3: {
      // 格子鬆餅：網格紋
      ctx.strokeStyle = "rgba(90,50,20,0.35)"
      ctx.lineWidth = Math.max(1, r * 0.06)
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath()
        ctx.moveTo(x + i * r * 0.28, y - r)
        ctx.lineTo(x + i * r * 0.28, y + r)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x - r, y + i * r * 0.28)
        ctx.lineTo(x + r, y + i * r * 0.28)
        ctx.stroke()
      }
      break
    }
    case 4: {
      // 甜甜圈：中央鏤空＋糖霜頂層＋彩色米
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, r * 0.42, 0, Math.PI * 2)
      ctx.fillStyle = "#d8b685"
      ctx.globalCompositeOperation = "destination-out"
      ctx.fill()
      ctx.restore()
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI, false)
      ctx.arc(x, y, r * 0.42, Math.PI, 0, true)
      ctx.closePath()
      ctx.fillStyle = "rgba(255,210,230,0.7)"
      ctx.fill()
      for (let i = 0; i < 10; i++) {
        const ang = Math.PI + (i / 10) * Math.PI
        const rad = r * 0.7
        ctx.save()
        ctx.translate(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad)
        ctx.rotate(ang)
        ctx.fillStyle = ["#e03131", "#1971c2", "#2f9e44", "#f08c00"][i % 4]
        ctx.fillRect(-r * 0.05, -r * 0.015, r * 0.1, r * 0.03)
        ctx.restore()
      }
      break
    }
    case 5: {
      // 貝果：中央鏤空＋芝麻
      ctx.save()
      ctx.beginPath()
      ctx.arc(x, y, r * 0.38, 0, Math.PI * 2)
      ctx.fillStyle = "#d8b685"
      ctx.globalCompositeOperation = "destination-out"
      ctx.fill()
      ctx.restore()
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2
        const rad = r * 0.68
        ctx.beginPath()
        ctx.ellipse(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad, r * 0.05, r * 0.025, ang, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,245,220,0.9)"
        ctx.fill()
      }
      break
    }
    case 6: {
      // 迷你披薩：起司底+少量配料
      ctx.fillStyle = "rgba(255,220,120,0.5)"
      ctx.beginPath()
      ctx.arc(x, y, r * 0.85, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * r * 0.4, y + Math.sin(ang) * r * 0.4, r * 0.13, 0, Math.PI * 2)
        ctx.fillStyle = "#c92a2a"
        ctx.fill()
      }
      break
    }
    case 7: {
      // 披薩：更多配料＋切片線
      ctx.fillStyle = "rgba(255,220,120,0.5)"
      ctx.beginPath()
      ctx.arc(x, y, r * 0.9, 0, Math.PI * 2)
      ctx.fill()
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * r * 0.5, y + Math.sin(ang) * r * 0.5, r * 0.12, 0, Math.PI * 2)
        ctx.fillStyle = "#c92a2a"
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang + 0.5) * r * 0.3, y + Math.sin(ang + 0.5) * r * 0.3, r * 0.08, 0, Math.PI * 2)
        ctx.fillStyle = "#2f9e44"
        ctx.fill()
      }
      ctx.strokeStyle = "rgba(90,50,20,0.25)"
      ctx.lineWidth = 1
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r)
        ctx.stroke()
      }
      break
    }
    case 8: {
      // 大餅：炭烤斑點
      for (let i = 0; i < 14; i++) {
        const ang = (i / 14) * Math.PI * 2
        const rad = r * (0.3 + 0.55 * ((i % 4) / 3))
        ctx.beginPath()
        ctx.arc(x + Math.cos(ang) * rad, y + Math.sin(ang) * rad, r * 0.05, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(80,40,10,0.3)"
        ctx.fill()
      }
      break
    }
    case 9: {
      // 超大餅：烤爐網格紋＋金黃光澤
      ctx.strokeStyle = "rgba(90,50,10,0.25)"
      ctx.lineWidth = Math.max(1, r * 0.03)
      for (let i = -4; i <= 4; i++) {
        ctx.beginPath()
        ctx.moveTo(x - r, y + i * r * 0.2)
        ctx.lineTo(x + r, y + i * r * 0.2)
        ctx.stroke()
      }
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
