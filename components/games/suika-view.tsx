"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PuzzleShell } from "./puzzle-shell"
import {
  suikaStep,
  suikaIsOver,
  suikaNewId,
  suikaRandomSpawnLevel,
  SUIKA_LEVELS,
  SUIKA_WIDTH,
  SUIKA_HEIGHT,
  type SuikaFruit,
} from "@/lib/games/suika"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const CENTER_X = SUIKA_WIDTH / 2
const NUDGE_STEP = 22
const DISPLAY_WIDTH = 280

export function SuikaView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [fruits, setFruits] = useState<SuikaFruit[]>([])
  const [dropX, setDropX] = useState(CENTER_X)
  const [nextLevel, setNextLevel] = useState(() => suikaRandomSpawnLevel())
  const [queuedLevel, setQueuedLevel] = useState(() => suikaRandomSpawnLevel())
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [over, setOver] = useState(false)
  const [canDrop, setCanDrop] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const dropGuardRef = useRef(false)
  const overStreakRef = useRef(0)
  const stateRef = useRef({ fruits, over, dropX, nextLevel, canDrop })
  stateRef.current = { fruits, over, dropX, nextLevel, canDrop }

  useEffect(() => {
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(1.6, (now - last) / 16.67)
      last = now
      if (!stateRef.current.over) {
        setFruits((prev) => {
          const { fruits: next, merges } = suikaStep(prev, dt)
          if (merges.length) {
            let add = 0
            for (const m of merges) add += m.score
            setScore((s) => s + add)
            if (soundOn) playMoveSound()
          }
          // 需連續偵測到「堆疊過高且靜止」超過約0.6秒才判定遊戲結束，
          // 避免剛放下的水果（或合併瞬間往上彈起）在單一畫面更新中被誤判為結束。
          if (suikaIsOver(next)) {
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
    ctx.clearRect(0, 0, SUIKA_WIDTH, SUIKA_HEIGHT)

    // 容器背景（立體玻璃感）
    const bg = ctx.createLinearGradient(0, 0, 0, SUIKA_HEIGHT)
    bg.addColorStop(0, "#fff7eb")
    bg.addColorStop(1, "#ffe8c8")
    ctx.fillStyle = bg
    ctx.fillRect(0, 0, SUIKA_WIDTH, SUIKA_HEIGHT)

    // 危險線
    ctx.strokeStyle = "rgba(220,38,38,0.35)"
    ctx.setLineDash([5, 5])
    ctx.beginPath()
    ctx.moveTo(0, SUIKA_HEIGHT * 0.12)
    ctx.lineTo(SUIKA_WIDTH, SUIKA_HEIGHT * 0.12)
    ctx.stroke()
    ctx.setLineDash([])

    for (const f of stateRef.current.fruits) {
      drawRealisticFruit(ctx, f.x, f.y, SUIKA_LEVELS[f.level].radius, f.level)
    }

    // 目前可操控的水果：固定從頂端中間出現，玩家左右移動尋找落下位置
    if (!stateRef.current.over && stateRef.current.canDrop) {
      const lv = SUIKA_LEVELS[stateRef.current.nextLevel]
      ctx.beginPath()
      ctx.setLineDash([3, 4])
      ctx.moveTo(stateRef.current.dropX, lv.radius * 2 + 8)
      ctx.lineTo(stateRef.current.dropX, SUIKA_HEIGHT)
      ctx.strokeStyle = "rgba(0,0,0,0.12)"
      ctx.stroke()
      ctx.setLineDash([])
      drawRealisticFruit(ctx, stateRef.current.dropX, lv.radius + 10, lv.radius, stateRef.current.nextLevel)
    }
  }

  function clampX(x: number, level: number) {
    const r = SUIKA_LEVELS[level].radius
    return Math.max(r, Math.min(SUIKA_WIDTH - r, x))
  }

  function nudge(dir: -1 | 1) {
    if (over) return
    setDropX((x) => clampX(x + dir * NUDGE_STEP, nextLevel))
  }

  function handlePointerMove(clientX: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const scale = SUIKA_WIDTH / rect.width
    const x = (clientX - rect.left) * scale
    setDropX(clampX(x, nextLevel))
  }

  function handleDrop() {
    if (over || !canDrop || dropGuardRef.current) return
    dropGuardRef.current = true
    setCanDrop(false)
    setFruits((prev) => [
      ...prev,
      { id: suikaNewId(), x: dropX, y: SUIKA_LEVELS[nextLevel].radius + 10, vx: 0, vy: 0.12, level: nextLevel },
    ])
    const upcoming = queuedLevel
    setNextLevel(upcoming)
    setQueuedLevel(suikaRandomSpawnLevel())
    setDropX(clampX(CENTER_X, upcoming))
    setTimeout(() => {
      setCanDrop(true)
      dropGuardRef.current = false
    }, 650)
  }

  function restart() {
    setFruits([])
    setScore(0)
    setOver(false)
    setCanDrop(true)
    const first = suikaRandomSpawnLevel()
    setNextLevel(first)
    setQueuedLevel(suikaRandomSpawnLevel())
    setDropX(clampX(CENTER_X, first))
  }

  const queuedLv = SUIKA_LEVELS[queuedLevel]

  return (
    <PuzzleShell
      gameId="suika"
      title="合成西瓜"
      subtitle="水果從頂端中間出現，左右移動尋找落下位置，相同水果相撞即合成更大水果"
      status={over ? `遊戲結束，分數 ${score}（最佳 ${best}）` : `分數：${score}`}
      rulesBrief="水果固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下水果」後會緩緩落下。兩個等級相同的水果碰到會合併升級成下一等級的新水果，一路合成到最大的西瓜。水果堆到頂端危險線且靜止不動時，遊戲結束。"
      solved={false}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="flex flex-col items-center gap-3">
        {/* 預告：下一個水果，放在框框上方，不佔用遊戲畫面 */}
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 shadow-sm">
          <span className="text-xs font-medium text-muted-foreground">預告下一個</span>
          <PreviewSwatch level={queuedLevel} />
          <span className="text-xs font-bold text-foreground">{queuedLv.name}</span>
        </div>

        <canvas
          ref={canvasRef}
          width={SUIKA_WIDTH}
          height={SUIKA_HEIGHT}
          className="touch-none rounded-2xl border border-border shadow-lg"
          style={{ width: DISPLAY_WIDTH, height: Math.round((DISPLAY_WIDTH * SUIKA_HEIGHT) / SUIKA_WIDTH) }}
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
            放下水果
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
    drawRealisticFruit(ctx, 14, 14, 11, level)
  }, [level])
  return <canvas ref={ref} width={28} height={28} className="h-7 w-7" />
}

/** 仿真立體水果繪製：依等級套用不同質感（籽點、果紋、條紋）與配件（果梗、葉片、冠葉）。 */
function drawRealisticFruit(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  const lv = SUIKA_LEVELS[level]

  // 主體立體漸層
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  const grad = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r)
  grad.addColorStop(0, lightenColor(lv.color, 65))
  grad.addColorStop(0.55, lv.color)
  grad.addColorStop(1, darkenColor(lv.color, 38))
  ctx.fillStyle = grad
  ctx.shadowColor = "rgba(0,0,0,0.35)"
  ctx.shadowBlur = Math.max(4, r * 0.18)
  ctx.shadowOffsetY = Math.max(2, r * 0.1)
  ctx.fill()
  ctx.restore()

  // 果面質感（裁切在圓內）
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.clip()
  drawFruitTexture(ctx, x, y, r, level)
  ctx.restore()

  // 高光
  ctx.beginPath()
  ctx.ellipse(x - r * 0.3, y - r * 0.4, r * 0.28, r * 0.16, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = "rgba(255,255,255,0.55)"
  ctx.fill()

  // 配件（果梗/葉片/冠葉，可超出圓外）
  drawFruitAccessory(ctx, x, y, r, level)
}

function drawFruitTexture(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  switch (level) {
    case 0: {
      // 櫻桃：底部淺摺線
      ctx.beginPath()
      ctx.moveTo(x - r * 0.3, y + r * 0.55)
      ctx.quadraticCurveTo(x, y + r * 0.7, x + r * 0.3, y + r * 0.55)
      ctx.strokeStyle = "rgba(0,0,0,0.18)"
      ctx.lineWidth = Math.max(0.6, r * 0.05)
      ctx.stroke()
      break
    }
    case 1: {
      // 草莓：黃色籽點
      for (let i = 0; i < 10; i++) {
        const ang = (i / 10) * Math.PI * 2 + 0.3
        const rad = r * (0.4 + 0.25 * ((i % 3) / 2))
        const px = x + Math.cos(ang) * rad
        const py = y + Math.sin(ang) * rad * 0.9 + r * 0.1
        ctx.beginPath()
        ctx.ellipse(px, py, r * 0.055, r * 0.08, ang, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,221,110,0.9)"
        ctx.fill()
      }
      break
    }
    case 2: {
      // 葡萄：深色果皮光澤斑點
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2
        const px = x + Math.cos(ang) * r * 0.42
        const py = y + Math.sin(ang) * r * 0.42
        ctx.beginPath()
        ctx.arc(px, py, r * 0.14, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,0,0,0.12)"
        ctx.fill()
      }
      break
    }
    case 3: {
      // 橘子：毛孔凹點
      for (let i = 0; i < 18; i++) {
        const ang = (i / 18) * Math.PI * 2
        const rad = r * (0.3 + 0.55 * ((i % 4) / 3))
        const px = x + Math.cos(ang) * rad
        const py = y + Math.sin(ang) * rad
        ctx.beginPath()
        ctx.arc(px, py, r * 0.035, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,0,0,0.14)"
        ctx.fill()
      }
      break
    }
    case 4: {
      // 柿子：光澤自然，無額外紋理
      break
    }
    case 5: {
      // 蘋果：垂直光澤陰影帶
      ctx.beginPath()
      ctx.ellipse(x - r * 0.45, y, r * 0.18, r * 0.85, 0, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0,0,0,0.08)"
      ctx.fill()
      break
    }
    case 6: {
      // 水梨：細小斑點紋
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2 + 0.5
        const rad = r * (0.35 + 0.4 * ((i % 3) / 2))
        const px = x + Math.cos(ang) * rad
        const py = y + Math.sin(ang) * rad
        ctx.beginPath()
        ctx.arc(px, py, r * 0.03, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(110,70,20,0.25)"
        ctx.fill()
      }
      break
    }
    case 7: {
      // 桃子：中央凹縫線
      ctx.beginPath()
      ctx.moveTo(x, y - r * 0.9)
      ctx.quadraticCurveTo(x - r * 0.12, y, x, y + r * 0.9)
      ctx.strokeStyle = "rgba(0,0,0,0.16)"
      ctx.lineWidth = Math.max(0.8, r * 0.04)
      ctx.stroke()
      break
    }
    case 8: {
      // 鳳梨：菱形交叉紋
      ctx.strokeStyle = "rgba(0,0,0,0.22)"
      ctx.lineWidth = Math.max(0.6, r * 0.035)
      const step = r * 0.3
      for (let o = -r * 1.5; o < r * 1.5; o += step) {
        ctx.beginPath()
        ctx.moveTo(x + o - r, y - r)
        ctx.lineTo(x + o + r, y + r)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x + o + r, y - r)
        ctx.lineTo(x + o - r, y + r)
        ctx.stroke()
      }
      break
    }
    case 9: {
      // 哈密瓜：網紋
      ctx.strokeStyle = "rgba(255,255,255,0.35)"
      ctx.lineWidth = Math.max(0.6, r * 0.03)
      for (let i = -3; i <= 3; i++) {
        ctx.beginPath()
        ctx.moveTo(x - r, y + i * r * 0.28 + r * 0.1)
        ctx.quadraticCurveTo(x, y + i * r * 0.28 - r * 0.15, x + r, y + i * r * 0.28 + r * 0.1)
        ctx.stroke()
      }
      break
    }
    case 10: {
      // 大西瓜：深綠條紋
      ctx.strokeStyle = "rgba(20,70,30,0.6)"
      ctx.lineWidth = Math.max(1.5, r * 0.12)
      for (let i = -4; i <= 4; i += 2) {
        ctx.beginPath()
        ctx.moveTo(x + i * r * 0.18, y - r)
        ctx.quadraticCurveTo(x + i * r * 0.26, y, x + i * r * 0.18, y + r)
        ctx.stroke()
      }
      break
    }
  }
}

function drawFruitAccessory(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, level: number) {
  const topY = y - r
  switch (level) {
    case 0:
    case 5:
    case 6: {
      // 果梗＋葉片
      ctx.strokeStyle = "#6b4226"
      ctx.lineWidth = Math.max(1, r * 0.1)
      ctx.beginPath()
      ctx.moveTo(x, topY + r * 0.1)
      ctx.quadraticCurveTo(x + r * 0.15, topY - r * 0.25, x + r * 0.05, topY - r * 0.4)
      ctx.stroke()
      ctx.beginPath()
      ctx.ellipse(x + r * 0.28, topY - r * 0.3, r * 0.22, r * 0.12, -0.6, 0, Math.PI * 2)
      ctx.fillStyle = "#4b8f3a"
      ctx.fill()
      break
    }
    case 1: {
      // 草莓蒂頭
      ctx.fillStyle = "#4b8f3a"
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x, topY + r * 0.15)
        ctx.lineTo(x + Math.cos(ang) * r * 0.28, topY - r * 0.1 + Math.sin(ang) * r * 0.15)
        ctx.lineTo(x + Math.cos(ang + 0.5) * r * 0.2, topY + r * 0.15)
        ctx.closePath()
        ctx.fill()
      }
      break
    }
    case 2: {
      ctx.fillStyle = "#6b4226"
      ctx.beginPath()
      ctx.arc(x, topY + r * 0.15, r * 0.06, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 3: {
      ctx.fillStyle = "#4b8f3a"
      ctx.beginPath()
      ctx.ellipse(x + r * 0.08, topY + r * 0.1, r * 0.18, r * 0.1, -0.4, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 4: {
      // 柿子：四角花萼
      ctx.fillStyle = "#4b7a3a"
      for (let i = 0; i < 4; i++) {
        const ang = (i / 4) * Math.PI * 2 + Math.PI / 4
        ctx.beginPath()
        ctx.ellipse(x + Math.cos(ang) * r * 0.2, topY + r * 0.12 + Math.sin(ang) * r * 0.12, r * 0.18, r * 0.09, ang, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }
    case 7: {
      ctx.fillStyle = "#4b8f3a"
      ctx.beginPath()
      ctx.ellipse(x + r * 0.1, topY + r * 0.12, r * 0.2, r * 0.1, -0.5, 0, Math.PI * 2)
      ctx.fill()
      break
    }
    case 8: {
      // 鳳梨冠葉
      ctx.fillStyle = "#3f7a34"
      for (let i = -2; i <= 2; i++) {
        ctx.save()
        ctx.translate(x, topY + r * 0.2)
        ctx.rotate(i * 0.3)
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.lineTo(-r * 0.09, -r * 0.6)
        ctx.lineTo(r * 0.09, -r * 0.6)
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      break
    }
    default:
      break
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
