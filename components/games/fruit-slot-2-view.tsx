"use client"

// 水果盤（二）畫面：跟水果盤(一)完全相同的 3輪×3格、5連線規則與運轉機制，
// 只是換上熱帶水果圖騰（💎取代7️⃣頭獎）與青綠珊瑚色調風格。
import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import {
  FRUIT_SYMBOLS_2,
  createFruitSlot2State,
  spinFruitSlot2,
  JP_MIN_SPINS_2,
  type FruitSlot2State,
  type FruitSlot2SpinResult,
  type FruitSlot2SymbolKey,
} from "@/lib/games/fruit-slot-2"
import { playTickSound, playButtonSound, playJpBellSound } from "@/lib/games/game-audio"
import { playWinSound as playReelWinSound, playBrakeClick } from "@/lib/luckypi/reel-audio"
import { InlineStorageNotice, BarStackGlyph } from "@/components/luckypi/pieces"

const STAKE_MIN = 0
const STAKE_MAX = 99
const STAKE_DEFAULT = 5
const HUE = 175 // 青綠珊瑚色調
const RULES =
  "經典3輪×3格水果盤，橫排上／中／下三條連線，加上左上到右下、左下到右上兩條斜線，共5條連線。設定每線押注分數（0～99）後按開始，一次扣除「每線押注×5條連線」的總額。三個輪軸各自獨立轉動，由左到右依序停下，轉動中可按「停止」提早喊停（結果已事先決定，純手感操作）。任何一條連線三格完全相同的圖案即依賠率出彩：💎×100、🆎×50、🔔×25、🍓×15、🍍×10、🍌×8、🍑×6、🍒×4；畫面中🍒出現2顆以上，不論位置都額外加發每線押注×2的安慰獎；中排三格全是💎視為中頭獎，觸發JP燈箱特別閃爍與專屬鈴聲（獎金已包含在連線賠率內）。賠率為機台固定設定，不開放玩家自行調整。約滿一定轉數後JP燈箱才會隨機進入預告閃爍（純視覺效果，不影響實際中獎機率）。"

const LONG_PRESS_DELAY_MS = 380
const LONG_PRESS_REPEAT_MS = 95
const SYMBOL_GLYPHS = FRUIT_SYMBOLS_2.map((s) => s.glyph)
const REEL_LOCK_FRAMES = [16, 23, 30]
const FRAME_MS = 65

type Phase = "idle" | "spinning" | "result"

function glyphFor(key: FruitSlot2SymbolKey): string {
  return FRUIT_SYMBOLS_2.find((s) => s.key === key)!.glyph
}

function AutoCountStepper({
  value,
  disabled,
  onChange,
  onPulse,
}: {
  value: number
  disabled: boolean
  onChange: (updater: (prev: number) => number) => void
  onPulse: () => void
}) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const didHold = useRef(false)

  function clearHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (holdInterval.current) clearInterval(holdInterval.current)
    holdTimer.current = null
    holdInterval.current = null
  }

  function step(dir: 1 | -1) {
    onChange((n) => Math.max(5, Math.min(99, n + dir)))
    onPulse()
  }

  function startHold(dir: 1 | -1) {
    if (disabled) return
    didHold.current = false
    holdTimer.current = setTimeout(() => {
      didHold.current = true
      step(dir)
      holdInterval.current = setInterval(() => step(dir), LONG_PRESS_REPEAT_MS)
    }, LONG_PRESS_DELAY_MS)
  }

  function tap(dir: 1 | -1) {
    if (disabled) return
    if (!didHold.current) step(dir)
    didHold.current = false
    clearHold()
  }

  useEffect(() => () => clearHold(), [])

  return (
    <div className="flex flex-1 items-center justify-between gap-2 rounded-full border border-white/15 bg-white/5 px-2">
      <button
        aria-label="減少自動次數"
        disabled={disabled}
        onPointerDown={() => startHold(-1)}
        onPointerUp={() => tap(-1)}
        onPointerLeave={clearHold}
        onContextMenu={(e) => e.preventDefault()}
        className="flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full text-base font-bold text-neutral-200 transition active:scale-90 disabled:opacity-30 [-webkit-touch-callout:none]"
        style={{ touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none" }}
      >
        −◀️
      </button>
      <span className="font-mono text-xs font-black tabular-nums text-amber-200">{String(value).padStart(2, "0")}</span>
      <button
        aria-label="增加自動次數"
        disabled={disabled}
        onPointerDown={() => startHold(1)}
        onPointerUp={() => tap(1)}
        onPointerLeave={clearHold}
        onContextMenu={(e) => e.preventDefault()}
        className="flex h-12 w-12 shrink-0 select-none items-center justify-center rounded-full text-base font-bold text-neutral-200 transition active:scale-90 disabled:opacity-30 [-webkit-touch-callout:none]"
        style={{ touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none" }}
      >
        ▶️+
      </button>
    </div>
  )
}

function BetStepper({ value, disabled, onChange }: { value: number; disabled: boolean; onChange: (next: number) => void }) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const didHold = useRef(false)

  function clearHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (holdInterval.current) clearInterval(holdInterval.current)
    holdTimer.current = null
    holdInterval.current = null
  }

  function step(dir: 1 | -1) {
    onChange(Math.max(STAKE_MIN, Math.min(STAKE_MAX, value + dir)))
  }

  function startHold(dir: 1 | -1) {
    if (disabled) return
    didHold.current = false
    holdTimer.current = setTimeout(() => {
      didHold.current = true
      step(dir)
      holdInterval.current = setInterval(() => step(dir), LONG_PRESS_REPEAT_MS)
    }, LONG_PRESS_DELAY_MS)
  }

  function tap(dir: 1 | -1) {
    if (disabled) return
    if (!didHold.current) step(dir)
    didHold.current = false
    clearHold()
  }

  useEffect(() => () => clearHold(), [])

  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-teal-400/30 bg-black/30 px-3 py-1.5">
      <button
        onContextMenu={(e) => e.preventDefault()}
        aria-label="減少每線押注"
        disabled={disabled}
        onPointerDown={() => startHold(-1)}
        onPointerUp={() => tap(-1)}
        onPointerLeave={clearHold}
        className="flex h-12 w-12 select-none items-center justify-center rounded-full bg-white/10 text-base font-bold text-neutral-100 transition active:scale-90 disabled:opacity-30 [-webkit-touch-callout:none]"
        style={{ touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none" }}
      >
        −◀️
      </button>
      <div className="flex flex-col items-center leading-none">
        <span className="text-[9px] font-semibold text-teal-200/70">每線押注</span>
        <span className="font-mono text-lg font-black tabular-nums text-teal-200">{String(value).padStart(2, "0")}</span>
      </div>
      <button
        onContextMenu={(e) => e.preventDefault()}
        aria-label="增加每線押注"
        disabled={disabled}
        onPointerDown={() => startHold(1)}
        onPointerUp={() => tap(1)}
        onPointerLeave={clearHold}
        className="flex h-12 w-12 select-none items-center justify-center rounded-full bg-white/10 text-base font-bold text-neutral-100 transition active:scale-90 disabled:opacity-30 [-webkit-touch-callout:none]"
        style={{ touchAction: "manipulation", WebkitUserSelect: "none", userSelect: "none" }}
      >
        ▶️+
      </button>
    </div>
  )
}

const LINE_CELLS: [number, number][][] = [
  [[0, 0], [0, 1], [0, 2]],
  [[1, 0], [1, 1], [1, 2]],
  [[2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 1], [2, 2]],
  [[2, 0], [1, 1], [0, 2]],
]

export function FruitSlot2View({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin, lang } = useLuckyPi()
  const t = dictFor(lang)
  const [betPerLine, setBetPerLine] = useState(STAKE_DEFAULT)
  const [phase, setPhase] = useState<Phase>("idle")
  const [autoLeft, setAutoLeft] = useState(0)
  const [autoCount, setAutoCount] = useState(5)
  const [tallyFlicker, setTallyFlicker] = useState<number | null>(null)
  const flickerTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<FruitSlot2SpinResult | null>(null)
  const [displayGrid, setDisplayGrid] = useState<string[][]>([
    [SYMBOL_GLYPHS[0], SYMBOL_GLYPHS[1], SYMBOL_GLYPHS[2]],
    [SYMBOL_GLYPHS[3], SYMBOL_GLYPHS[4], SYMBOL_GLYPHS[5]],
    [SYMBOL_GLYPHS[6], SYMBOL_GLYPHS[7], SYMBOL_GLYPHS[0]],
  ])
   const jpStateRef = useRef<FruitSlot2State>(createFruitSlot2State())
  const frameTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const skipAheadRef = useRef(false)

  useEffect(() => {
    return () => {
      if (frameTimer.current) clearInterval(frameTimer.current)
      if (flickerTimer.current) clearInterval(flickerTimer.current)
    }
  }, [])

  function flashTally() {
    if (flickerTimer.current) clearInterval(flickerTimer.current)
    let ticks = 0
    flickerTimer.current = setInterval(() => {
      setTallyFlicker(Math.floor(Math.random() * 1000))
      ticks += 1
      if (ticks >= 5) {
        if (flickerTimer.current) clearInterval(flickerTimer.current)
        flickerTimer.current = null
        setTallyFlicker(null)
      }
    }, 70)
  }

  const totalStaked = betPerLine * 5

  function runSpin() {
    if (phase === "spinning") return
    if (betPerLine <= 0) return
    if (!spendCoins(totalStaked)) return
    setResult(null)
    setPhase("spinning")
    skipAheadRef.current = false

    const outcome = spinFruitSlot2(betPerLine, jpStateRef.current)
    jpStateRef.current = outcome.nextState

    let frame = 0
    const lockFrames = REEL_LOCK_FRAMES.map((f) => f)
    frameTimer.current = setInterval(() => {
      frame += 1
      const effectiveFrames = skipAheadRef.current ? lockFrames.map((f) => Math.min(f, frame + 1)) : lockFrames
      setDisplayGrid((prev) => {
        const next = prev.map((row) => [...row])
        for (let col = 0; col < 3; col++) {
          if (frame >= effectiveFrames[col]) {
            for (let row = 0; row < 3; row++) next[row][col] = glyphFor(outcome.grid[row][col])
          } else {
            for (let row = 0; row < 3; row++) next[row][col] = SYMBOL_GLYPHS[Math.floor(Math.random() * SYMBOL_GLYPHS.length)]
          }
        }
        return next
      })
      if (soundOn && frame % 2 === 0) playTickSound(HUE)

      if (frame >= effectiveFrames[2]) {
        if (frameTimer.current) clearInterval(frameTimer.current)
        frameTimer.current = null
        finish(outcome)
      }
    }, FRAME_MS)
  }

  function finish(outcome: FruitSlot2SpinResult) {
    setResult(outcome)
    setPhase("result")

    if (outcome.outcome === "win") {
      creditWin(outcome.payout)
      if (soundOn) {
        if (outcome.jpHit) playJpBellSound(HUE)
        else playReelWinSound(HUE)
      }
    } else {
      if (soundOn) playBrakeClick(HUE)
    }

    setAutoLeft((n) => Math.max(0, n - 1))
  }

  useEffect(() => {
    if (phase !== "result" || autoLeft <= 0) return
    const tm = setTimeout(() => {
      runSpin()
    }, 850)
    return () => clearTimeout(tm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, autoLeft])

  function startSingle() {
    setAutoLeft(0)
    runSpin()
  }

  function startAuto() {
    setAutoLeft(autoCount - 1)
    runSpin()
  }

  function requestStop() {
    if (phase === "spinning") skipAheadRef.current = true
  }

  const betLocked = phase === "spinning" || autoLeft > 0
  const jpBlinking = jpStateRef.current.jpArmed

  const [jpFlash, setJpFlash] = useState(true)
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      if (!alive) return
      setJpFlash((f) => !f)
      timer = setTimeout(tick, jpBlinking ? 500 : 3000)
    }
    timer = setTimeout(tick, jpBlinking ? 500 : 3000)
    return () => {
      alive = false
      clearTimeout(timer)
    }
  }, [jpBlinking])

  const winningCells = new Set<string>()
  if (result) {
    result.lines.forEach((l, i) => {
      if (l.won) LINE_CELLS[i].forEach(([r, c]) => winningCells.add(`${r}-${c}`))
    })
  }

  return (
    <CasinoTableShell
      title="水果盤(二)"
      rules={RULES}
      hue={HUE}
      bet={totalStaked}
      betMin={0}
      betMax={99 * 5}
      betStep={1}
      betLocked={betLocked}
      onBetChange={() => {}}
      onHome={onHome}
      onLobby={onLobby}
      hideBetBar
    >
      <div className="flex h-full flex-col items-center justify-start gap-3 overflow-y-auto px-2 py-3">
        {/* 機台立面：青綠珊瑚色調裝潢 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-teal-800/50 p-3"
          style={{
            background: "linear-gradient(180deg, oklch(0.42 0.1 180), oklch(0.3 0.08 180) 55%, oklch(0.2 0.05 180))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.2), inset 0 -3px 8px oklch(0.12 0.04 180 / 0.6), 0 10px 24px -8px oklch(0.1 0.04 180 / 0.6)",
          }}
        >
          <div
            className={`mb-2 flex items-center justify-center gap-2 rounded-full border px-3 py-1 text-xs font-black tracking-wide transition-opacity duration-150 ${
              jpBlinking ? "border-teal-300 text-teal-200" : "border-white/10 text-teal-100/40"
            }`}
            style={{ opacity: jpBlinking ? (jpFlash ? 1 : 0.35) : jpFlash ? 1 : 0.6 }}
          >
            <span
              style={{
                textShadow: jpBlinking
                  ? jpFlash
                    ? "0 0 10px oklch(0.8 0.18 170 / 1), 0 0 20px oklch(0.75 0.18 160 / 0.8)"
                    : "none"
                  : "none",
              }}
            >
              {jpBlinking ? "JP 預告中 · 中排三顆💎中頭獎" : "JP 累積中"}
            </span>
          </div>

          <div className="mx-auto grid w-full max-w-[18rem] grid-cols-3 gap-2 rounded-xl border border-teal-900/40 bg-black/50 p-2">
            {displayGrid.map((row, r) =>
              row.map((glyph, c) => {
                const win = winningCells.has(`${r}-${c}`) && phase === "result"
                const isBar = glyph === "🆎"
                return (
                  <div
                    key={`${r}-${c}`}
                  className="flex aspect-square items-center justify-center rounded-lg border transition-all"
                  style={{
                    borderColor: win ? "oklch(0.85 0.18 170)" : "oklch(0.5 0.05 180 / 0.5)",
                    background: win ? "oklch(0.65 0.18 170 / 0.3)" : "oklch(0.95 0.02 180)",
                    boxShadow: win ? "0 0 14px 3px oklch(0.8 0.18 170 / 0.6)" : "inset 0 0 0 1px oklch(1 0 0 / 0.4)",
                    transform: win ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  {isBar ? <BarStackGlyph size="lg" /> : <span className="text-[2.73rem]">{glyph}</span>}
                </div>
                )
              }),
            )}
          </div>

          <InlineStorageNotice className="mt-2" />
          <div className="mt-2 flex min-h-[1.4rem] items-center justify-center px-2 text-center">
            {phase === "result" && result ? (
              <span className={`text-xs font-black leading-tight ${result.outcome === "win" ? "text-teal-300" : "text-neutral-400"}`}>
                {result.outcome === "win"
                  ? `連線中獎！總計贏得 ${result.payout}${result.cherryBonus > 0 ? `（含櫻桃安慰獎 ${result.cherryBonus}）` : ""}`
                  : "未中獎"}
              </span>
            ) : (
              <span className="text-[10px] text-neutral-500">{phase === "spinning" ? "轉動中…" : "調整押注後開始"}</span>
            )}
          </div>
        </div>

        {/* 玩家工作面：同款前傾角度感，青綠珊瑚色調 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-teal-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.46 0.1 180), oklch(0.33 0.08 180) 55%, oklch(0.24 0.06 180))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.25), inset 0 -4px 10px oklch(0.12 0.04 180 / 0.5), 0 14px 22px -10px oklch(0.08 0.03 180 / 0.65)",
            transform: "perspective(900px) rotateX(5deg)",
            transformOrigin: "top center",
          }}
        >
          <BetStepper value={betPerLine} disabled={betLocked} onChange={setBetPerLine} />

          <div className="mt-2 flex w-full items-stretch gap-1">
            <button
              onClick={startSingle}
              disabled={betLocked || betPerLine <= 0}
              className="rounded-full bg-orange-500 px-2.5 py-2 text-[10px] font-black text-neutral-900 shadow-lg transition active:scale-95 disabled:opacity-40"
            >
              {t.startBtnLabel}
            </button>
            <button
              onClick={requestStop}
              disabled={phase !== "spinning"}
              className="rounded-full border border-red-400/40 bg-red-500/80 px-2.5 py-2 text-[10px] font-bold text-white transition active:scale-95 disabled:opacity-40"
            >
              {t.stopBtnLabel}
            </button>
            <button
              onClick={autoLeft > 0 ? () => setAutoLeft(0) : startAuto}
              disabled={(phase === "spinning" && autoLeft === 0) || betPerLine <= 0}
              className="rounded-full border border-violet-400/40 bg-violet-500/80 px-2.5 py-2 text-[10px] font-bold text-white transition active:scale-95 disabled:opacity-40"
            >
              {autoLeft > 0 ? t.autoBtnActiveLabel : t.autoBtnLabel}
            </button>
            <AutoCountStepper value={autoCount} disabled={betLocked} onChange={setAutoCount} onPulse={flashTally} />
          </div>
          <div className="mt-1 flex items-center justify-center gap-2 text-[10px] text-neutral-400">
            <span>自動次數 ({String(tallyFlicker ?? autoCount).padStart(2, "0")})</span>
            <span>自動剩餘 {String(autoLeft).padStart(2, "0")}</span>
          </div>
        </div>

      </div>
    </CasinoTableShell>
  )
}
