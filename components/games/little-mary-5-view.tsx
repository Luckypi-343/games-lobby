"use client"

// 傳統麻台（第二代·鳳凰版）畫面：設置、圖騰、運轉機制完全跟第一代一致，
// 唯一的差異是中央 JP 圖樣換成放大的鳳凰 🐦‍🔥（純裝飾，平常只會慢慢閃爍＋翅膀輕輕擺動；
// 累積轉數進入預告狀態時改為快速閃爍＋發光，命中時仍照原本的大牌/小牌固定高倍發彩），
// 以及左右兩個 🅾️ ONCE MORE 各自觸發一次「游標快速掃過 2～6 個燈位」的裝飾效果：
// 左邊以大牌組為主、右邊以小牌組為主，偶爾會掃到 BAR，被掃到的燈位會保留光圈，
// 直到下一輪轉動才恢復正常（純裝飾，不影響派彩）。機殼改成暮色紫紅色調。
import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import {
  LITTLE_MARY_5_RING,
  BOARD_COLS_5,
  BOARD_ROWS_5,
  BIG_CHASE_VALUES_5,
  SMALL_CHASE_VALUES_5,
  BIG_JP_MULTIPLIER_5,
  SMALL_JP_MULTIPLIER_5,
  JP_MIN_SPINS_5,
  STAKE_SYMBOLS_5,
  slotPosition5,
  createLittleMary5State,
  createEmptyBets5,
  totalStaked5,
  spinLittleMary5,
  RING_SIZE_5,
  type LittleMary5Bets,
  type LittleMary5StakeKey,
  type LittleMary5State,
  type LittleMary5SpinResult,
} from "@/lib/games/little-mary-5"
import {
  playTickSound,
  playButtonSound,
  playJpBellSound,
  startEagleCryLoop,
  stopEagleCryLoop,
} from "@/lib/games/game-audio"
import { playWinSound as playReelWinSound, playBrakeClick } from "@/lib/luckypi/reel-audio"
import { InlineStorageNotice, GoodLuckMessage } from "@/components/luckypi/pieces"

const STAKE_MIN = 0
const STAKE_MAX = 99
const STAKE_DEFAULT = 5
const HUE = 320 // 暮色紫紅色調，跟第一代（木質色）、第二代（草綠）做出區隔。
const RULES =
  "設置與運轉機制跟傳統麻台(一)完全相同：對BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／蘋果／櫻桃各自調整押注分數（0～99），再按開始啟動，一次扣掉9筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按「停止」提早喊停（結果已事先決定，純手感操作）：停在🍎蘋果固定5倍出彩；停在🅾️免費重轉一次（全額退回），同時會額外掃過幾個燈位留下光圈作裝飾（櫻桃、蘋果不分左右都有機會被掃到），下一輪轉動才會恢復；停在某個圖案，只有該圖案自己的押注依賠率出彩——🆎固定100倍、🅰️固定50倍、🅱️固定25倍、櫻桃固定2倍，77/星星/西瓜依跑燈倍數浮動（20～40），鈴鐺/香瓜/檸檬依跑燈倍數浮動（10～20），累積一定轉數後隨機進入JP場次，命中時改發固定高倍並響起專屬鈴聲。中央的鳳凰圖樣純屬裝飾，平常慢慢閃爍、翅膀輕輕擺動，預告場次時會加快閃爍並發光。\n\n【賠率表】BAR類（共用同一筆BAR押注）：🆎三條BAR×100、🅰️兩條BAR×50、🅱️單條BAR×25。🍎蘋果固定×5、🍒櫻桃固定×2。大牌（各自押注，依跑燈浮動）：77／⭐️／🍉一般×" +
  BIG_CHASE_VALUES_5.join("／") +
  "，JP場次固定×" +
  BIG_JP_MULTIPLIER_5 +
  "。小牌（各自押注，依跑燈浮動）：🔔／🍈／🍋一般×" +
  SMALL_CHASE_VALUES_5.join("／") +
  "，JP場次固定×" +
  SMALL_JP_MULTIPLIER_5 +
  "。停在箭頭全輸；停在左／右🅾️免費重轉一次，全額退回。約滿" +
  JP_MIN_SPINS_5 +
  "轉後才有機會隨機進入鳳凰預告場次。賠率為機台固定設定，不開放玩家自行調整。"

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
  if (glyph === "77") {
    return (
      <span
        className="italic text-[oklch(0.55_0.24_25)]"
        style={{
          fontSize: big ? "1.15rem" : "0.9rem",
          fontWeight: 900,
          transform: "skewX(-8deg) scaleY(1.08)",
          display: "inline-block",
          textShadow: "0 1px 0 oklch(1 0 0 / 0.5), 0 2px 3px oklch(0 0 0 / 0.4)",
        }}
      >
        77
      </span>
    )
  }
  return <span style={{ fontSize: big ? "1.3rem" : "1rem" }}>{glyph}</span>
}

function groupColor(group: "bar" | "fixed" | "big" | "small"): { base: string; dim: string } {
  switch (group) {
    case "bar":
      return { base: "oklch(0.56 0.22 25)", dim: "oklch(0.3 0.1 25)" }
    case "big":
      return { base: "oklch(0.56 0.2 320)", dim: "oklch(0.3 0.1 320)" }
    case "small":
      return { base: "oklch(0.55 0.16 220)", dim: "oklch(0.3 0.08 220)" }
    default:
      return { base: "oklch(0.62 0.18 145)", dim: "oklch(0.34 0.09 145)" }
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
        className={`font-mono text-[9px] font-bold tabular-nums ${group === "bar" ? "text-white" : "text-fuchsia-200"}`}
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

export function LittleMary5View({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin, lang } = useLuckyPi()
  const t = dictFor(lang)
  const [bets, setBets] = useState<LittleMary5Bets>(() => createEmptyBets5(STAKE_DEFAULT))
  const [pointer, setPointer] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [autoLeft, setAutoLeft] = useState(0)
  const [autoCount, setAutoCount] = useState(5)
  const [tallyFlicker, setTallyFlicker] = useState<number | null>(null)
  const flickerTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<LittleMary5SpinResult | null>(null)
  const [chaseBig, setChaseBig] = useState<number>(BIG_CHASE_VALUES_5[0])
  const [chaseSmall, setChaseSmall] = useState<number>(SMALL_CHASE_VALUES_5[0])
  const [echoLit, setEchoLit] = useState<Set<number>>(new Set())
  const jpStateRef = useRef<LittleMary5State>(createLittleMary5State())
  // 這一轉是否已經是「必停ONCE MORE」的那一轉：在啟動當下就跟結果一起決定好，絕不會提前預告未來幾轉。
  const [jpActive, setJpActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipAheadRef = useRef(false)

  useEffect(() => {
    return () => {
      stopEagleCryLoop()
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

  const stake = totalStaked5(bets)

  function setStake(key: LittleMary5StakeKey, updater: (prev: number) => number) {
    setBets((prev) => ({ ...prev, [key]: Math.max(STAKE_MIN, Math.min(STAKE_MAX, updater(prev[key]))) }))
  }

  function runSpin() {
    if (phase === "spinning") return
    if (stake <= 0) return
    if (!spendCoins(stake)) return
    setResult(null)
    setEchoLit(new Set())
    setPhase("spinning")
    skipAheadRef.current = false

    const outcome = spinLittleMary5(bets, jpStateRef.current)
    jpStateRef.current = outcome.nextState
    // 這一轉是否必停ONCE MORE，在啟動當下就已經確定，所以急促閃爍/炫光必須立刻同步顯示，不是提前預告下幾轉。
    setJpActive(outcome.wasJpSpin)
    if (outcome.wasJpSpin && soundOn) startEagleCryLoop(HUE)
    else stopEagleCryLoop()

    const fastLaps = 3 * RING_SIZE_5
    let distanceToTarget = (outcome.stopIndex - 0 + RING_SIZE_5) % RING_SIZE_5
    const extraLaps = Math.floor(Math.random() * 2)
    distanceToTarget += extraLaps * RING_SIZE_5
    const totalSteps = fastLaps + distanceToTarget

    let step = 0
    let current = 0
    const tick = () => {
      current = (current + 1) % RING_SIZE_5
      setPointer(current)
      if (soundOn) playTickSound(HUE)
      setChaseBig(BIG_CHASE_VALUES_5[step % BIG_CHASE_VALUES_5.length])
      setChaseSmall(SMALL_CHASE_VALUES_5[step % SMALL_CHASE_VALUES_5.length])
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

  function playEchoSequence(indices: number[]) {
    indices.forEach((idx, i) => {
      setTimeout(() => {
        if (soundOn) playTickSound(HUE)
        setEchoLit((prev) => {
          const next = new Set(prev)
          next.add(idx)
          return next
        })
      }, i * 160)
    })
  }

  function finish(outcome: LittleMary5SpinResult) {
    stopEagleCryLoop()
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
      if (outcome.onceMoreEcho && outcome.onceMoreEcho.length > 0) {
        playEchoSequence(outcome.onceMoreEcho)
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
  const jpBlinking = jpActive

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

  // 鳳凰翅膀輕輕擺動：跟 jpFlash 反向交錯，製造「閃爍＋拍翅」錯開的節奏感。
  const [wingUp, setWingUp] = useState(true)
  useEffect(() => {
    const id = setInterval(() => setWingUp((w) => !w), jpBlinking ? 260 : 900)
    return () => clearInterval(id)
  }, [jpBlinking])

  return (
    <CasinoTableShell
      title="傳統麻台(三)"
      rules={RULES}
      hue={HUE}
      bet={stake}
      betMin={0}
      betMax={99 * STAKE_SYMBOLS_5.length}
      betStep={1}
      betLocked={betLocked}
      onBetChange={() => {}}
      onHome={onHome}
      onLobby={onLobby}
      hideBetBar
    >
      <div className="flex h-full flex-col items-center justify-start gap-3 overflow-y-auto px-2 py-3">
        {/* 機台立面：暮色紫紅色調裝潢，跟其餘台別做出區隔 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-fuchsia-900/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.5 0.1 320), oklch(0.38 0.1 320) 55%, oklch(0.3 0.08 320))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.2), inset 0 -3px 8px oklch(0.2 0.05 320 / 0.6), 0 10px 24px -8px oklch(0.15 0.04 320 / 0.6)",
          }}
        >
        <div
          className="relative mx-auto grid w-full gap-[3px] rounded-xl border border-fuchsia-900/40 bg-black/40 p-1.5"
          style={{ gridTemplateColumns: `repeat(${BOARD_COLS_5}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS_5}, 2rem)` }}
        >
          {LITTLE_MARY_5_RING.map((s, i) => {
            const { col, row } = slotPosition5(i)
            const lit = pointer === i
            const echoed = !lit && echoLit.has(i)
            return (
              <div
                key={i}
                className="flex items-center justify-center rounded-sm border leading-none transition-all"
                style={{
                  gridColumnStart: col + 1,
                  gridRowStart: row + 1,
                  borderColor: lit ? "oklch(0.85 0.22 330)" : echoed ? "oklch(0.8 0.2 330 / 0.9)" : "oklch(0.55 0.03 320 / 0.5)",
                  background: lit ? "oklch(0.62 0.22 330)" : echoed ? "oklch(0.72 0.18 330 / 0.5)" : "oklch(0.93 0.03 320)",
                  boxShadow: lit
                    ? "0 0 10px 3px oklch(0.78 0.22 330 / 0.65)"
                    : echoed
                      ? "0 0 8px 2px oklch(0.78 0.22 330 / 0.5)"
                      : "inset 0 0 0 1px oklch(1 0 0 / 0.4)",
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
            className="flex flex-col items-center justify-start gap-1 rounded-lg border border-fuchsia-500/30 bg-black/70 py-1.5"
            style={{ gridColumn: `2 / ${BOARD_COLS_5}`, gridRow: "2 / 11" }}
          >
            <div
              className={`rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wide transition-opacity duration-150 ${
                jpBlinking ? "border-fuchsia-300 text-fuchsia-200" : "border-white/10 text-fuchsia-100/40"
              }`}
              style={{ opacity: jpBlinking ? (jpFlash ? 1 : 0.35) : jpFlash ? 1 : 0.6 }}
            >
              {jpBlinking ? "鳳凰預告中" : "鳳凰棲息中"}
            </div>
            <p
              aria-hidden
              className="leading-[0.9] transition-[filter,transform,opacity] duration-200"
              style={{
                fontSize: "5.2rem",
                transform: `scale(${wingUp ? 1 : 0.94}) rotate(${wingUp ? -2 : 2}deg)`,
                opacity: jpFlash ? 1 : jpBlinking ? 0.55 : 0.75,
                filter: jpBlinking
                  ? jpFlash
                    ? "drop-shadow(0 0 16px oklch(0.75 0.25 330 / 1)) drop-shadow(0 0 32px oklch(0.7 0.24 25 / 0.8))"
                    : "drop-shadow(0 0 6px oklch(0.7 0.22 330 / 0.4))"
                  : "drop-shadow(0 2px 4px oklch(0 0 0 / 0.5))",
              }}
            >
              🐦‍🔥
            </p>
            <div className="mt-4">
              <GoodLuckMessage cellSize="2rem" />
            </div>
            <div className="mt-3 grid w-full grid-cols-2 gap-x-2 text-center">
              <div className="flex flex-col items-center gap-0.5">
                <p className="text-[9px] font-semibold text-neutral-400">自動次數</p>
                <p className="font-mono text-base font-black tabular-nums text-fuchsia-100">
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
                  className={`text-[11px] font-black leading-tight ${result.outcome === "win" ? "text-fuchsia-300" : result.outcome === "once-more" ? "text-sky-300" : "text-neutral-400"}`}
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
              {BIG_CHASE_VALUES_5.map((v) => (
                <span
                  key={v}
                  className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all ${
                    chaseBig === v
                      ? `scale-110 border-fuchsia-400 bg-fuchsia-500/30 text-fuchsia-100 shadow-[0_0_10px_2px_oklch(0.72_0.2_330/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
                      : "border-white/10 text-neutral-600"
                  }`}
                >
                  {v}
                </span>
              ))}
            </div>
            <div className="flex gap-1">
              {SMALL_CHASE_VALUES_5.map((v) => (
                <span
                  key={v}
                  className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all ${
                    chaseSmall === v
                      ? `scale-110 border-sky-400 bg-sky-500/30 text-sky-100 shadow-[0_0_10px_2px_oklch(0.75_0.14_235/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
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

        {/* 玩家工作面：跟第一代同款前傾角度感，改用暮色紫紅色調 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-fuchsia-900/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.52 0.1 320), oklch(0.4 0.1 320) 55%, oklch(0.32 0.08 320))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.25), inset 0 -4px 10px oklch(0.2 0.05 320 / 0.55), 0 14px 22px -10px oklch(0.12 0.04 320 / 0.65)",
            transform: "perspective(900px) rotateX(5deg)",
            transformOrigin: "top center",
          }}
        >
        <div className="grid w-full grid-cols-9 gap-1">
          {STAKE_SYMBOLS_5.map((s) => (
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
