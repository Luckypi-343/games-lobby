"use client"

// 小瑪莉（8×8中空·海洋主題）畫面：跟傳統麻台(一)同一套運轉機制
// （中空方框跑馬燈、順時鐘快轉三圈再緩轉停止、停止鍵純手感不影響結果、
// ONCE MORE 全額退回、JP 累積與預告閃爍、每種圖案各自押注），但燈位縮小成
// 橫8格×直8格（共28格），比第一代更迷你輕快。圖騰換成海洋生物：
// 大牌 🦈／🐳／🐬，小牌 🐠／🦀／🐚，普牌 🫧 氣泡固定×2，機殼改成深海藍綠色調。
import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import {
  LITTLE_MARY_7_RING,
  BOARD_COLS_7,
  BOARD_ROWS_7,
  BIG_CHASE_VALUES_7,
  SMALL_CHASE_VALUES_7,
  BIG_JP_MULTIPLIER_7,
  SMALL_JP_MULTIPLIER_7,
  JP_MIN_SPINS_7,
  STAKE_SYMBOLS_7,
  slotPosition7,
  createLittleMary7State,
  createEmptyBets7,
  totalStaked7,
  spinLittleMary7,
  RING_SIZE_7,
  type LittleMary7Bets,
  type LittleMary7StakeKey,
  type LittleMary7State,
  type LittleMary7SpinResult,
} from "@/lib/games/little-mary-7"
import { playTickSound, playButtonSound, playJpBellSound } from "@/lib/games/game-audio"
import { playWinSound as playReelWinSound, playBrakeClick } from "@/lib/luckypi/reel-audio"
import { InlineStorageNotice, GoodLuckMessage } from "@/components/luckypi/pieces"

const STAKE_MIN = 0
const STAKE_MAX = 99
const STAKE_DEFAULT = 5
const HUE = 195 // 深海藍綠色調
const RULES =
  "橫8格×直8格中空方框（共28個燈位），比傳統麻台(一)迷你，運轉規則完全相同：對BAR／鯊魚／鯨魚／海豚／熱帶魚／螃蟹／貝殼／氣泡各自調整押注分數（0～99），再按開始啟動，一次扣掉8筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按「停止」提早喊停（結果已事先決定，純手感操作）：停在箭頭全輸；停在🅾️免費重轉一次（全額退回）；停在某個圖案，只有該圖案自己的押注依賠率出彩——🆎固定100倍、🅰️固定50倍、🅱️固定25倍、氣泡固定2倍，鯊魚/鯨魚/海豚依跑燈倍數浮動（20～40），熱帶魚/螃蟹/貝殼依跑燈倍數浮動（10～20），累積一定轉數後隨機進入JP場次，命中時改發固定高倍並響起專屬鈴聲。\n\n【賠率表】BAR類（共用同一筆BAR押注）：🆎三條BAR×100、🅰️兩條BAR×50、🅱️單條BAR×25。🫧氣泡固定×2。大牌（各自押注，依跑燈浮動）：🦈／🐳／🐬一般×" +
  BIG_CHASE_VALUES_7.join("／") +
  "，JP場次固定×" +
  BIG_JP_MULTIPLIER_7 +
  "。小牌（各自押注，依跑燈浮動）：🐠／🦀／🐚一般×" +
  SMALL_CHASE_VALUES_7.join("／") +
  "，JP場次固定×" +
  SMALL_JP_MULTIPLIER_7 +
  "。停在箭頭全輸；停在🅾️免費重轉一次，全額退回。約滿" +
  JP_MIN_SPINS_7 +
  "轉後才有機會隨機進入JP預告場次。賠率為機台固定設定，不開放玩家自行調整。"

const SPIN_STEP_MS_FAST = 45
const SPIN_STEP_MS_SLOW = 150
const LONG_PRESS_DELAY_MS = 380
const LONG_PRESS_REPEAT_MS = 95

type Phase = "idle" | "spinning" | "result"

function SymbolFace({ glyph, variant }: { glyph: string; variant: "board" | "stepper" }) {
  const big = variant === "board"
  if (glyph === "🅾️") {
    return (
      <span className="flex w-full flex-col items-center justify-center gap-0 leading-[0.85]">
        <span
          className="font-black tracking-tight text-[oklch(0.5_0.22_25)]"
          style={{ fontSize: big ? "0.62rem" : "0.46rem", textShadow: "0.5px 0.5px 0 oklch(1 0 0 / 0.9), 0 1px 2px oklch(0 0 0 / 0.4)" }}
        >
          ONCE
        </span>
        <span
          className="font-black tracking-tight text-[oklch(0.5_0.22_25)]"
          style={{ fontSize: big ? "0.62rem" : "0.46rem", textShadow: "0.5px 0.5px 0 oklch(1 0 0 / 0.9), 0 1px 2px oklch(0 0 0 / 0.4)" }}
        >
          MORE
        </span>
      </span>
    )
  }
  if (glyph === "🆎" || glyph === "🅰️" || glyph === "🅱️") {
    const count = glyph === "🆎" ? 3 : glyph === "🅰️" ? 2 : 1
    const fs = big
      ? count === 1
        ? "0.75rem"
        : count === 2
          ? "0.62rem"
          : "0.5rem"
      : count === 1
        ? "0.58rem"
        : count === 2
          ? "0.48rem"
          : "0.4rem"
    return (
      <span className="flex w-full flex-col items-center justify-center gap-[1px]">
        {Array.from({ length: count }).map((_, i) => (
          <span
            key={i}
              className={`w-full text-center font-black leading-none ${big ? "text-neutral-900" : "text-white"}`}
            style={{ fontSize: fs, transform: "scaleX(1.25)" }}
          >
            BAR
          </span>
        ))}
      </span>
    )
  }
  return <span style={{ fontSize: big ? "1.3rem" : "1rem" }}>{glyph}</span>
}

/** 四組押注各自的指示色：BAR紅、大牌(鯊魚/鯨魚/海豚)深藍、小牌(熱帶魚/螃蟹/貝殼)青綠、氣泡金。 */
function groupColor(group: "bar" | "fixed" | "big" | "small"): { base: string; dim: string } {
  switch (group) {
    case "bar":
      return { base: "oklch(0.56 0.22 25)", dim: "oklch(0.3 0.1 25)" }
    case "big":
      return { base: "oklch(0.52 0.16 240)", dim: "oklch(0.28 0.08 240)" }
    case "small":
      return { base: "oklch(0.58 0.14 175)", dim: "oklch(0.3 0.07 175)" }
    default:
      return { base: "oklch(0.62 0.16 95)", dim: "oklch(0.34 0.08 95)" }
  }
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
    onChange((n) => Math.max(5, Math.min(1000, n + dir)))
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

function StakeStepper({
  glyph,
  label,
  group,
  value,
  disabled,
  onChange,
}: {
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
  value: number
  disabled: boolean
  onChange: (updater: (prev: number) => number) => void
}) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)
  const didHold = useRef(false)
  const color = groupColor(group)

  function clearHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (holdInterval.current) clearInterval(holdInterval.current)
    holdTimer.current = null
    holdInterval.current = null
  }

  function increment() {
    onChange((prev) => (prev + 1) % 100)
  }

  function startHold() {
    if (disabled) return
    didHold.current = false
    holdTimer.current = setTimeout(() => {
      didHold.current = true
      increment()
      holdInterval.current = setInterval(increment, LONG_PRESS_REPEAT_MS)
    }, LONG_PRESS_DELAY_MS)
  }

  function tap() {
    if (disabled) return
    if (!didHold.current) increment()
    didHold.current = false
    clearHold()
  }

  useEffect(() => () => clearHold(), [])

  return (
    <div
    className={`flex flex-col items-center gap-0.5 rounded-md border px-0.5 py-1 ${
    group === "bar" ? "border-white/20 bg-black" : "border-white/10 bg-white/5"
    }`}
    >
      <span className="flex h-5 w-full items-center justify-center leading-none">
        <SymbolFace glyph={glyph} variant="stepper" />
      </span>
      <span
        className={`font-mono text-[9px] font-bold tabular-nums ${group === "bar" ? "text-white" : "text-sky-200"}`}
      >
        ({String(value).padStart(2, "0")})
      </span>
      <button
        aria-label={`增加${label}押注`}
        disabled={disabled}
        onPointerDown={startHold}
        onPointerUp={tap}
        onPointerLeave={clearHold}
        onPointerCancel={clearHold}
        onContextMenu={(e) => e.preventDefault()}
        className="h-4 w-full select-none rounded-[3px] transition active:scale-90 disabled:opacity-30 [-webkit-touch-callout:none]"
        style={{
          background: `linear-gradient(180deg, ${color.base}, ${color.dim})`,
          boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.35), 0 1px 1px oklch(0 0 0 / 0.4)",
          touchAction: "manipulation",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      />
    </div>
  )
}

export function LittleMary7View({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin, lang } = useLuckyPi()
  const t = dictFor(lang)
  const [bets, setBets] = useState<LittleMary7Bets>(() => createEmptyBets7(STAKE_DEFAULT))
  const [pointer, setPointer] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [autoLeft, setAutoLeft] = useState(0)
  const [autoCount, setAutoCount] = useState(5)
  const [tallyFlicker, setTallyFlicker] = useState<number | null>(null)
  const flickerTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<LittleMary7SpinResult | null>(null)
  const [chaseBig, setChaseBig] = useState<number>(BIG_CHASE_VALUES_7[0])
  const [chaseSmall, setChaseSmall] = useState<number>(SMALL_CHASE_VALUES_7[0])
  const jpStateRef = useRef<LittleMary7State>(createLittleMary7State())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipAheadRef = useRef(false)

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
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

  const stake = totalStaked7(bets)

  function setStake(key: LittleMary7StakeKey, updater: (prev: number) => number) {
    setBets((prev) => ({ ...prev, [key]: Math.max(STAKE_MIN, Math.min(STAKE_MAX, updater(prev[key]))) }))
  }

  function runSpin() {
    if (phase === "spinning") return
    if (stake <= 0) return
    if (!spendCoins(stake)) return
    setResult(null)
    setPhase("spinning")
    skipAheadRef.current = false

    const outcome = spinLittleMary7(bets, jpStateRef.current)
    jpStateRef.current = outcome.nextState

    const fastLaps = 3 * RING_SIZE_7
    let distanceToTarget = (outcome.stopIndex - 0 + RING_SIZE_7) % RING_SIZE_7
    const extraLaps = Math.floor(Math.random() * 2)
    distanceToTarget += extraLaps * RING_SIZE_7
    const totalSteps = fastLaps + distanceToTarget

    let step = 0
    let current = 0
    const tick = () => {
      current = (current + 1) % RING_SIZE_7
      setPointer(current)
      if (soundOn) playTickSound(HUE)
      setChaseBig(BIG_CHASE_VALUES_7[step % BIG_CHASE_VALUES_7.length])
      setChaseSmall(SMALL_CHASE_VALUES_7[step % SMALL_CHASE_VALUES_7.length])
      step += 1
      const remaining = totalSteps - step
      const effectiveRemaining = skipAheadRef.current ? Math.min(remaining, distanceToTarget) : remaining
      if (step >= totalSteps || (skipAheadRef.current && remaining <= distanceToTarget && remaining <= 0)) {
        finish(outcome)
        return
      }
      if (skipAheadRef.current && remaining > distanceToTarget) {
        step = totalSteps - distanceToTarget
      }
      const delay = effectiveRemaining > distanceToTarget ? SPIN_STEP_MS_FAST : SPIN_STEP_MS_SLOW
      timerRef.current = setTimeout(tick, delay)
    }
    timerRef.current = setTimeout(tick, SPIN_STEP_MS_FAST)
  }

  function finish(outcome: LittleMary7SpinResult) {
    setPointer(outcome.stopIndex)
    setResult(outcome)
    setPhase("result")
    if (outcome.chaseValue !== undefined) {
      if (outcome.slot.kind === "big") setChaseBig(outcome.chaseValue)
      else setChaseSmall(outcome.chaseValue)
    }

    if (outcome.outcome === "win") {
      creditWin(outcome.payout)
      if (soundOn) {
        if (outcome.jpHit) playJpBellSound(HUE)
        else playReelWinSound(HUE)
      }
    } else if (outcome.outcome === "once-more") {
      creditWin(outcome.payout)
      if (soundOn) playButtonSound()
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

  return (
    <CasinoTableShell
      title="小瑪莉(海洋)"
      rules={RULES}
      hue={HUE}
      bet={stake}
      betMin={0}
      betMax={99 * STAKE_SYMBOLS_7.length}
      betStep={1}
      betLocked={betLocked}
      onBetChange={() => {}}
      onHome={onHome}
      onLobby={onLobby}
      hideBetBar
    >
      <div className="flex h-full flex-col items-center justify-start gap-3 overflow-y-auto px-2 py-3">
        {/* 機台立面：深海藍綠色調裝潢 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-cyan-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.56 0.08 210), oklch(0.42 0.09 210) 55%, oklch(0.32 0.07 210))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.25), inset 0 -3px 8px oklch(0.2 0.05 210 / 0.55), 0 10px 24px -8px oklch(0.15 0.04 210 / 0.6)",
          }}
        >
        <div
          className="relative mx-auto grid w-full gap-[3px] rounded-xl border border-cyan-900/40 bg-black/40 p-1.5"
          style={{ gridTemplateColumns: `repeat(${BOARD_COLS_7}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS_7}, 2.4rem)` }}
        >
          {LITTLE_MARY_7_RING.map((s, i) => {
            const { col, row } = slotPosition7(i)
            const lit = pointer === i
            return (
              <div
                key={i}
                className="flex items-center justify-center rounded-sm border leading-none transition-all"
                style={{
                  gridColumnStart: col + 1,
                  gridRowStart: row + 1,
                  borderColor: lit ? "oklch(0.85 0.18 195)" : "oklch(0.55 0.03 210 / 0.5)",
                  background: lit ? "oklch(0.62 0.18 195)" : "oklch(0.93 0.03 195)",
                  boxShadow: lit ? "0 0 10px 3px oklch(0.75 0.18 195 / 0.65)" : "inset 0 0 0 1px oklch(1 0 0 / 0.4)",
                  transform: lit ? "scale(1.12)" : "scale(1)",
                }}
                aria-label={s.label}
              >
                <span style={{ filter: lit ? "none" : "saturate(1.1)" }}>
                  <SymbolFace glyph={s.glyph} variant="board" />
                </span>
              </div>
            )
          })}
          <div
            className="flex flex-col items-center justify-start gap-1 rounded-lg border border-cyan-500/30 bg-black/70 py-1.5"
            style={{ gridColumn: `2 / ${BOARD_COLS_7}`, gridRow: "2 / 8" }}
          >
            <div
              className={`rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wide transition-opacity duration-150 ${
                jpBlinking ? "border-cyan-300 text-cyan-200" : "border-white/10 text-cyan-100/40"
              }`}
              style={{ opacity: jpBlinking ? (jpFlash ? 1 : 0.35) : jpFlash ? 1 : 0.6 }}
            >
              {jpBlinking ? "JP 預告中" : "JP 累積中"}
            </div>
            <p
              className="font-black leading-[0.85] tracking-wider transition-[text-shadow,opacity] duration-150"
              style={{
                fontSize: "3.6rem",
                transform: "scaleY(1.35)",
                color: "oklch(0.62 0.22 25)",
                WebkitTextStroke: "2px oklch(1 0 0 / 0.9)",
                opacity: jpBlinking ? (jpFlash ? 1 : 0.6) : jpFlash ? 1 : 0.5,
                textShadow: jpBlinking
                  ? jpFlash
                    ? "0 2px 0 oklch(1 0 0 / 0.95), 0 4px 6px oklch(0 0 0 / 0.55), 0 0 18px oklch(0.75 0.2 195 / 1), 0 0 40px oklch(0.7 0.2 195 / 0.9), 0 0 60px oklch(0.65 0.22 25 / 0.7)"
                    : "0 2px 0 oklch(1 0 0 / 0.9), 0 4px 6px oklch(0 0 0 / 0.5), 0 0 10px oklch(0.7 0.25 25 / 0.45)"
                  : "0 2px 0 oklch(1 0 0 / 0.9), 0 4px 6px oklch(0 0 0 / 0.5)",
              }}
            >
              JP
            </p>
            <div className="mt-3">
              <GoodLuckMessage cellSize="2rem" />
            </div>
            <div className="mt-3 grid w-full grid-cols-2 gap-x-2 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-[9px] font-semibold text-neutral-400">自動次數</p>
                <p className="font-mono text-base font-black tabular-nums text-cyan-100">
                  ({String(tallyFlicker ?? autoCount).padStart(3, "0")})
                </p>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-[9px] font-semibold text-neutral-400">自動剩餘</p>
                <p className="font-mono text-base font-black tabular-nums text-neutral-200">{String(autoLeft).padStart(2, "0")}</p>
              </div>
            </div>
            <InlineStorageNotice className="mt-1" />
            <div className="mt-1 flex min-h-[1.4rem] items-center justify-center px-2 text-center">
              {phase === "result" && result ? (
                <span
                  className={`text-[11px] font-black leading-tight ${result.outcome === "win" ? "text-cyan-300" : result.outcome === "once-more" ? "text-sky-300" : "text-neutral-400"}`}
                >
                  {result.outcome === "win"
                    ? `${result.slot.label} 中獎！${result.stakeUsed}×${result.multiplier}＝${result.payout}`
                    : result.outcome === "once-more"
                      ? "再來一次（全額退回）"
                      : "未中獎"}
                </span>
              ) : (
                <span className="text-[10px] text-neutral-500">{phase === "spinning" ? "轉動中…" : "調整押注後開始"}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-2">
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-neutral-400">
            <span>大牌跑燈</span>
            <span>小牌跑燈</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {BIG_CHASE_VALUES_7.map((v) => (
                <span
                  key={v}
                  className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all ${
                    chaseBig === v
                      ? `scale-110 border-blue-400 bg-blue-500/30 text-blue-100 shadow-[0_0_10px_2px_oklch(0.65_0.19_255/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
                      : "border-white/10 text-neutral-600"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {SMALL_CHASE_VALUES_7.map((v) => (
                <span
                  key={v}
                  className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all ${
                    chaseSmall === v
                      ? `scale-110 border-teal-400 bg-teal-500/30 text-teal-100 shadow-[0_0_10px_2px_oklch(0.72_0.14_180/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
                      : "border-white/10 text-neutral-600"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* 玩家工作面：同款前傾角度感，深海藍綠色調 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-cyan-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.58 0.08 210), oklch(0.44 0.09 210) 55%, oklch(0.34 0.07 210))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.3), inset 0 -4px 10px oklch(0.2 0.05 210 / 0.5), 0 14px 22px -10px oklch(0.12 0.04 210 / 0.65)",
            transform: "perspective(900px) rotateX(5deg)",
            transformOrigin: "top center",
          }}
        >
        <div className="grid w-full grid-cols-8 gap-1">
          {STAKE_SYMBOLS_7.map((s) => (
            <StakeStepper
              key={s.key}
              glyph={s.glyph}
              label={s.label}
              group={s.group}
              value={bets[s.key]}
              disabled={betLocked}
              onChange={(updater) => setStake(s.key, updater)}
            />
          ))}
        </div>

        <div className="mt-2 flex w-full items-stretch gap-1">
          <button
            onClick={startSingle}
            disabled={betLocked || stake <= 0}
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
            disabled={(phase === "spinning" && autoLeft === 0) || stake <= 0}
            className="rounded-full border border-violet-400/40 bg-violet-500/80 px-2.5 py-2 text-[10px] font-bold text-white transition active:scale-95 disabled:opacity-40"
          >
            {autoLeft > 0 ? t.autoBtnActiveLabel : t.autoBtnLabel}
          </button>
          <AutoCountStepper value={autoCount} disabled={betLocked} onChange={setAutoCount} onPulse={flashTally} />
        </div>
        </div>

      </div>
    </CasinoTableShell>
  )
}
