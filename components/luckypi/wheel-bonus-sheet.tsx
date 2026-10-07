"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { formatCoins, themeEmojiMap } from "@/lib/luckypi/data"

// LuckyPi 第01台專屬 BONUS 超炫飛輪：外環固定 36 格倍數，依指定順序排列。
const SEQUENCE: number[] = [
  1, 2, 5, 3, 4, 0, 1, 3, 7, 2, 4, 0, 1, 3, 9, 2, 4, 0, 1, 3, 6, 2, 4, 0, 1, 3, 8, 2, 4, 0, 1, 3, 10, 2, 4, 0,
]
const SEG_COUNT = SEQUENCE.length
const SEG_ANGLE = 360 / SEG_COUNT
// 起始格必須固定在「10」那一格（序列中唯一的一個 10）。
const START_INDEX = SEQUENCE.indexOf(10)

// 指針固定指向每一格「數字」所在的中心角度，而不是格與格之間的刻度分隔線。
function angleToTopRotation(index: number) {
  const center = index * SEG_ANGLE + SEG_ANGLE / 2
  const raw = 360 - (center % 360)
  return ((raw % 360) + 360) % 360
}

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function wedgePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const p1 = polar(cx, cy, r, startDeg)
  const p2 = polar(cx, cy, r, endDeg)
  return `M ${cx} ${cy} L ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} Z`
}

// 產生棘輪轉動時的「喀、喀、喀…」節奏時間表：一開始密集快速，隨轉速減緩逐漸拉長間隔。
function buildTickSchedule(totalMs: number) {
  const times: number[] = []
  let t = 0
  let delay = 26
  while (t < totalMs - 30) {
    times.push(t)
    t += delay
    delay = Math.min(230, delay * 1.06)
  }
  return times
}

// 以 Web Audio 現場合成音效，不依賴外部音檔：背景音樂、棘輪喀嗒聲、中獎與停止音效。
class WheelAudio {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private musicTimer: ReturnType<typeof setInterval> | null = null

  private ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      this.ctx = new AC()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.55
      this.master.connect(this.ctx.destination)
    }
    if (this.ctx.state === "suspended") this.ctx.resume().catch(() => {})
    return this.ctx
  }

  tick(strength: number) {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "square"
    osc.frequency.value = 560 + strength * 140
    const t0 = ctx.currentTime
    gain.gain.setValueAtTime(0.001, t0)
    gain.gain.linearRampToValueAtTime(0.18 * strength + 0.05, t0 + 0.005)
    gain.gain.exponentialRampToValueAtTime(0.0008, t0 + 0.045)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start(t0)
    osc.stop(t0 + 0.05)
  }

  win(multiplier: number) {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const notes = multiplier >= 7 ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99]
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = "triangle"
      osc.frequency.value = freq
      const t0 = ctx.currentTime + i * 0.09
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.24, t0 + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32)
      osc.connect(gain)
      gain.connect(this.master!)
      osc.start(t0)
      osc.stop(t0 + 0.34)
    })
  }

  stopSound() {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sawtooth"
    osc.frequency.setValueAtTime(340, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.42)
    gain.gain.setValueAtTime(0.22, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.46)
    osc.connect(gain)
    gain.connect(this.master)
    osc.start()
    osc.stop(ctx.currentTime + 0.47)
  }

  startMusic() {
    const ctx = this.ensure()
    if (!ctx || !this.master || this.musicTimer) return
    const seq = [329.63, 391.99, 493.88, 391.99, 440, 523.25, 440, 391.99]
    let i = 0
    const playNote = () => {
      const c = this.ctx
      if (!c || !this.master) return
      const osc = c.createOscillator()
      const gain = c.createGain()
      osc.type = "sine"
      osc.frequency.value = seq[i % seq.length]
      const t0 = c.currentTime
      gain.gain.setValueAtTime(0.0001, t0)
      gain.gain.exponentialRampToValueAtTime(0.05, t0 + 0.06)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5)
      osc.connect(gain)
      gain.connect(this.master)
      osc.start(t0)
      osc.stop(t0 + 0.52)
      i++
    }
    playNote()
    this.musicTimer = setInterval(playNote, 560)
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer)
      this.musicTimer = null
    }
  }
}

type RoundResult = { round: number; multiplier: number; award: number }

export function WheelBonusSheet({
  open,
  stake,
  spinsLeft,
  spinsTotal,
  round,
  onResolve,
  machineName = "瑞獸迎福",
  hue = 45,
}: {
  open: boolean
  stake: number
  spinsLeft: number
  spinsTotal: number
  round: number
  onResolve: (multiplier: number) => void
  machineName?: string
  hue?: number
}) {
  // 依機台自己的主題，決定飛輪中央的圖騰（每個主題的 BONUS 身分圖案各不相同），
  // 以及外環格子與邊框，隨機台主題色相整體染色，讓每台機台的飛輪視覺一眼可辨。
  const centerGlyph = themeEmojiMap(machineName).wheel
  const ring = `oklch(0.62 0.16 ${hue})`
  const ringSoft = `oklch(0.75 0.18 ${hue} / 0.85)`
  const [rotation, setRotation] = useState(() => angleToTopRotation(START_INDEX))
  const [transitionCss, setTransitionCss] = useState("none")
  const [spinning, setSpinning] = useState(false)
  const [resultIndex, setResultIndex] = useState<number | null>(null)
  const [accrued, setAccrued] = useState(0)
  const [history, setHistory] = useState<RoundResult[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const baseRotationRef = useRef(angleToTopRotation(START_INDEX))
  const resolvedRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const audioRef = useRef<WheelAudio | null>(null)
  if (!audioRef.current) audioRef.current = new WheelAudio()

  // 背景音樂：畫面開啟時播放，關閉時停止。
  useEffect(() => {
    if (open) {
      audioRef.current?.startMusic()
    } else {
      audioRef.current?.stopMusic()
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
      resolvedRef.current = false
      setResultIndex(null)
      setSpinning(false)
      setAccrued(0)
      setHistory([])
      setCountdown(null)
      setTransitionCss("none")
      setRotation(angleToTopRotation(START_INDEX))
      baseRotationRef.current = angleToTopRotation(START_INDEX)
      return
    }

    resolvedRef.current = false
    setResultIndex(null)
    setSpinning(true)

    const targetIndex = Math.floor(Math.random() * SEG_COUNT)
    const base = baseRotationRef.current
    const targetTop = angleToTopRotation(targetIndex)
    const deltaToTarget = ((targetTop - (base % 360)) + 360) % 360
    // 固定順時鐘快轉 3 整圈，第 4 圈當作緩衝減速，最終在第 5 圈內隨機停格。
    const fastPhase = base + 3 * 360
    const finalRotation = base + 4 * 360 + deltaToTarget
    const overshootRotation = finalRotation + 7

    const PHASE1 = 900
    const PHASE2 = 3000
    const PHASE3 = 380
    const totalSpinMs = PHASE1 + PHASE2 + PHASE3

    const t1 = setTimeout(() => {
      setTransitionCss(`transform ${PHASE1}ms linear`)
      setRotation(fastPhase)
    }, 50)
    const t2 = setTimeout(() => {
      setTransitionCss(`transform ${PHASE2}ms cubic-bezier(0.14,0.7,0.22,1)`)
      setRotation(overshootRotation)
    }, 50 + PHASE1)
    const t3 = setTimeout(() => {
      setTransitionCss(`transform ${PHASE3}ms ease-out`)
      setRotation(finalRotation)
    }, 50 + PHASE1 + PHASE2)
    const t4 = setTimeout(() => {
      setSpinning(false)
      setResultIndex(targetIndex)
      baseRotationRef.current = finalRotation
    }, 50 + totalSpinMs)

    // 棘輪喀嗒聲：隨轉速由快變慢排程播放。
    const tickTimers = buildTickSchedule(totalSpinMs).map((tOffset, i, arr) =>
      setTimeout(() => {
        const progress = i / Math.max(1, arr.length - 1)
        audioRef.current?.tick(1 - progress * 0.7)
      }, 50 + tOffset),
    )

    timersRef.current = [t1, t2, t3, t4, ...tickTimers]
    return () => {
      timersRef.current.forEach(clearTimeout)
      timersRef.current = []
    }
    // 每次贈分回合 (round) 改變都要重新轉動一次飛輪，即使 open 一直維持 true。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, round])

  const multiplier = resultIndex !== null ? SEQUENCE[resultIndex] : null
  const award = multiplier !== null ? Math.round(stake * multiplier) : 0
  const isStop = multiplier === 0

  useEffect(() => {
    if (multiplier === null || resolvedRef.current) return
    resolvedRef.current = true
    setAccrued((a) => a + award)
    setHistory((h) => [...h, { round, multiplier, award }])
    if (multiplier > 0) {
      audioRef.current?.win(multiplier)
    } else {
      audioRef.current?.stopSound()
    }
    // 只要停下來不是「0」，就自動繼續轉動下一次；停在「0」則等待 5 秒讓玩家看清結算後，再自動返回主遊戲。
    const delay = isStop ? 5000 : 1300
    const t = setTimeout(() => onResolve(multiplier), delay)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [multiplier])

  // 停止在「0」時顯示 5 秒倒數，讓玩家清楚知道即將自動返回主遊戲。
  useEffect(() => {
    if (multiplier === null || !isStop) {
      setCountdown(null)
      return
    }
    setCountdown(5)
    const iv = setInterval(() => {
      setCountdown((c) => (c === null ? null : Math.max(0, c - 1)))
    }, 1000)
    return () => clearInterval(iv)
  }, [multiplier, isStop])

  const wedges = useMemo(() => {
    return SEQUENCE.map((num, i) => {
      const start = i * SEG_ANGLE
      const end = start + SEG_ANGLE
      const isZero = num === 0
      // 一般格子改用機台主題色相染色（深淺交錯），0 格固定用警示紅，跟主題無關。
      const fill = isZero ? "#b91c1c" : i % 2 === 0 ? `oklch(0.22 0.07 ${hue})` : `oklch(0.28 0.08 ${hue})`
      return { num, start, end, isZero, fill }
    })
  }, [hue])

  const totalAward = history.reduce((sum, h) => sum + h.award, 0)
  const avgMultiplier = history.length > 0 ? history.reduce((s, h) => s + h.multiplier, 0) / history.length : 0

  if (!open) return null

  const roundNumber = Math.max(1, spinsTotal - spinsLeft + 1)

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 overflow-y-auto bg-black/88 px-4 py-6">
      <p className="text-center font-serif text-lg font-bold text-yellow-300 drop-shadow">LuckyPi《{machineName}》專屬 BONUS</p>
      <p className="text-center font-serif text-base font-bold text-white/90">超炫飛輪遊戲</p>
      <p className="lp-nums text-center text-[11px] font-semibold text-yellow-200/80">
        第 {roundNumber} / {spinsTotal} 次進場
      </p>
      <p className="text-center text-xs text-white/70">
        {spinning
          ? "飛輪高速轉動中，祝您好運！"
          : isStop
            ? "飛輪停在 0，本次贈分結束"
            : multiplier !== null
              ? "中獎！自動接著再轉一次"
              : ""}
      </p>

      <div className="relative h-72 w-72 shrink-0">
        {/* 固定指針，不隨轉盤旋轉，永遠精準指向格內的數字 */}
        <div className="absolute -top-1 left-1/2 z-30 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[11px] border-r-[11px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-300 drop-shadow-lg" />
        </div>

        {/* 外環：36 格倍數與刻度，整體旋轉 */}
        <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)`, transition: transitionCss }}>
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <defs>
              <radialGradient id="lp-wheel-rim" cx="50%" cy="50%" r="55%">
                <stop offset="80%" stopColor="#1a0f28" />
                <stop offset="100%" stopColor="#3a2650" />
              </radialGradient>
            </defs>
            <circle cx={100} cy={100} r={97} fill="url(#lp-wheel-rim)" stroke={ring} strokeWidth={3} />
            {wedges.map((w, i) => (
              <path key={i} d={wedgePath(100, 100, 94, w.start, w.end)} fill={w.fill} stroke="#0c0714" strokeWidth={0.6} />
            ))}
            {wedges.map((w, i) => (
              <g key={`tick-${i}`} transform={`rotate(${w.start} 100 100)`}>
                <line x1={100} y1={4} x2={100} y2={16} stroke={w.isZero ? "#fca5a5" : "#facc15"} strokeWidth={2.2} />
              </g>
            ))}
            {wedges.map((w, i) => {
              const angle = w.start + SEG_ANGLE / 2
              return (
                <g key={`num-${i}`} transform={`rotate(${angle} 100 100)`}>
                  <text
                    x={100}
                    y={28}
                    textAnchor="middle"
                    fontSize={w.isZero ? 13 : 12}
                    fontWeight={800}
                    fill={w.isZero ? "#ffffff" : "#fef3c7"}
                    style={{ fontFamily: "var(--font-geist-sans, sans-serif)" }}
                  >
                    {w.num}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* 中間固定不轉的圓：本台專屬 BONUS 身分圖騰蓋上 BONUS 標籤（放大呈現） */}
        <div
          className="absolute left-1/2 top-1/2 z-20 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1.5 rounded-full border-[3px] bg-black/85"
          style={{ borderColor: ring, boxShadow: `0 0 28px -2px ${ringSoft}` }}
        >
          <span className="text-6xl leading-none drop-shadow">{centerGlyph}</span>
          <span className="rounded-md bg-red-600/95 px-2.5 py-1 text-xs font-black tracking-wide text-white shadow">
            BONUS
          </span>
        </div>
      </div>

      <div className="flex min-h-[64px] flex-col items-center justify-center gap-1">
        {multiplier !== null ? (
          <>
            <p className={"text-center text-2xl font-extrabold drop-shadow " + (isStop ? "text-red-400" : "text-yellow-300")}>
              × {multiplier}
            </p>
            <p className="lp-nums text-center text-base font-bold text-white">+{formatCoins(award)} 幣</p>
          </>
        ) : (
          <p className="lp-nums text-center text-sm text-white/60">押注基數 {formatCoins(stake)} 幣</p>
        )}
      </div>

      {/* 運轉成果・數據統計 */}
      <div className="w-full max-w-xs rounded-xl border border-yellow-500/30 bg-white/5 px-4 py-3">
        <p className="mb-2 text-center text-[11px] font-bold tracking-wide text-yellow-300/90">運轉成果・數據統計</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="lp-nums text-base font-bold text-white">{history.length}</p>
            <p className="text-[10px] text-white/60">已轉動次數</p>
          </div>
          <div>
            <p className="lp-nums text-base font-bold text-yellow-300">{formatCoins(totalAward)}</p>
            <p className="text-[10px] text-white/60">本輪累計幣數</p>
          </div>
          <div>
            <p className="lp-nums text-base font-bold text-white">×{avgMultiplier.toFixed(1)}</p>
            <p className="text-[10px] text-white/60">平均倍數</p>
          </div>
        </div>
        {history.length > 0 ? (
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {history.map((h, i) => (
              <span
                key={i}
                className={
                  "lp-nums rounded-full px-2 py-0.5 text-[10px] font-bold " +
                  (h.multiplier === 0 ? "bg-red-600/30 text-red-300" : "bg-yellow-500/20 text-yellow-200")
                }
              >
                ×{h.multiplier}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {/* 結算：只在最終停於 0 時顯示 */}
      {isStop ? (
        <div className="w-full max-w-xs rounded-xl border border-yellow-400/60 bg-yellow-500/10 px-4 py-3 text-center">
          <p className="text-sm font-bold text-yellow-200">本次 BONUS 結算完成</p>
          <p className="lp-nums mt-1 text-lg font-extrabold text-white">共獲得 {formatCoins(totalAward)} 幣</p>
          <p className="mt-1 text-[11px] text-white/70">
            {countdown !== null ? `${countdown} 秒後自動返回主遊戲畫面` : "即將自動返回主遊戲畫面"}
          </p>
        </div>
      ) : null}
    </div>
  )
}
