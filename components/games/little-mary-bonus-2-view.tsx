"use client"

// 傳統麻台(四)．幸運七加碼版．喜慶主題 畫面：運轉機制、幸運七轉輪加碼玩法
// 跟幸運七加碼版(傳統麻台五)完全相同，只替換大牌／小牌圖騰為喜慶主題（紅包／金元寶／燈籠、橘子／月餅／煙火），
// 機身改用硃紅／鎏金配色，背景音樂與開獎音效也換成不同音色，做出跟其他機台的區隔。
import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import {
  LITTLE_MARY_B2_RING,
  RING_SIZE_B2,
  BOARD_COLS_B2,
  BOARD_ROWS_B2,
  BIG_CHASE_VALUES_B2,
  SMALL_CHASE_VALUES_B2,
  STAKE_SYMBOLS_B2,
  slotPositionB2,
  createLittleMaryBonus2State,
  createEmptyBetsB2,
  totalStakedB2,
  spinLittleMaryBonus2,
  BONUS_ODD_MULTIPLIER_B2,
  BONUS_EVEN_MULTIPLIER_B2,
  type LittleMaryBonus2Bets,
  type LittleMaryBonus2StakeKey,
  type LittleMaryBonus2State,
  type LittleMaryBonus2SpinResult,
} from "@/lib/games/little-mary-bonus-2"
import {
  playTickSound,
  playButtonSound,
  startEagleCryLoop,
  stopEagleCryLoop,
} from "@/lib/games/game-audio"
import { playWinSound as playReelWinSound, playBrakeClick, startBgm, stopBgm } from "@/lib/luckypi/reel-audio"
import { InlineStorageNotice } from "@/components/luckypi/pieces"

const STAKE_MIN = 0
const STAKE_MAX = 99
const STAKE_DEFAULT = 5
const HUE = 15 // 硃紅／鎏金，跟幸運七加碼版(金色)、傳統麻台(一)(木質)做出區隔。
const RULES =
  "設置與運轉機制跟幸運七加碼版（傳統麻台五）完全相同：對BAR／紅包／金元寶／燈籠／橘子／月餅／煙火／櫻桃各自調整押注分數（0～99），再按開始啟動，一次扣掉8筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按「停止」提早喊停：停在箭頭全輸；停在🅾️免費重轉一次（全額退回）；停在某個圖案，只有該圖案自己的押注依賠率出彩。\n\n【幸運七加碼】中央(7)(7)(7)是三個獨立數字轉輪（0～9），平常只是亂數跑動的裝飾。當BAR／大牌／小牌中獎時，有機會隨機跳出加碼關卡：轉輪由左而右依序停下，第三輪刻意放慢、神秘式慢慢停，通常第三輪會跟前兩輪不同（只是預告，留下期待），大約每100～200次中獎才會真正三輪同一數字——開出奇數（111/333/555/777/999）中獎金額再×" +
  BONUS_ODD_MULTIPLIER_B2 +
  "，開出偶數（000/222/444/666/888）中獎金額再×" +
  BONUS_EVEN_MULTIPLIER_B2 +
  "，不一定每次中獎都會跳出關卡，純屬隨機驚喜，不影響原本的中獎判定。\n\n【賠率表】BAR類（共用同一筆BAR押注）：🆎三條BAR×100、🅰️兩條BAR×50、🅱️單條BAR×25。🍒櫻桃固定×2。大牌（各自押注，依跑燈浮動）：🧧／💰／🏮一般×" +
  BIG_CHASE_VALUES_B2.join("／") +
  "。小牌（各自押注，依跑燈浮動）：🍊／🥮／🎆一般×" +
  SMALL_CHASE_VALUES_B2.join("／") +
  "。以上任何一筆中獎都有機會隨機觸發幸運七加碼關卡。賠率為機台固定設定，不開放玩家自行調整。"

const SPIN_STEP_MS_FAST = 45
const SPIN_STEP_MS_SLOW = 150
const LONG_PRESS_DELAY_MS = 380
const LONG_PRESS_REPEAT_MS = 95

type Phase = "idle" | "spinning" | "result"
type BonusPhase = "idle" | "reel1" | "reel2" | "reel3" | "settled"

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

function groupColor(group: "bar" | "fixed" | "big" | "small"): { base: string; dim: string } {
  switch (group) {
    case "bar":
      return { base: "oklch(0.56 0.22 25)", dim: "oklch(0.3 0.1 25)" }
    case "big":
      return { base: "oklch(0.6 0.2 15)", dim: "oklch(0.34 0.1 15)" }
    case "small":
      return { base: "oklch(0.58 0.16 85)", dim: "oklch(0.32 0.08 85)" }
    default:
      return { base: "oklch(0.58 0.17 150)", dim: "oklch(0.3 0.08 150)" }
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
        className={`font-mono text-[9px] font-bold tabular-nums ${group === "bar" ? "text-white" : "text-amber-200"}`}
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

/**
 * 單一數字轉輪：像老虎機圖騰格一樣的立體淺色窗格。
 * 奇數＝紅底（對應奇數組合×10），偶數＝藍底（對應偶數組合×5），數字本身一律白色粗體、立體陰影。
 * slow=true 時代表這是第三輪正在「神秘式慢慢停」：亂跳速度逐漸變慢，
 * 並會不時刻意跳到跟第一輪一樣的數字（挑逗一下，讓人猜是不是要中獎），再跳開，製造猜測懸念。
 */
function DigitReel({
  digit,
  locked,
  glow,
  slow,
  teaseTarget,
}: {
  digit: number | null
  locked: boolean
  glow: boolean
  slow?: boolean
  teaseTarget?: number | null
}) {
  const [idle, setIdle] = useState(() => Math.floor(Math.random() * 10))
  useEffect(() => {
    if (locked) return
    let alive = true
    let delay = 110
    let handle: ReturnType<typeof setTimeout>
    const tick = () => {
      if (!alive) return
      setIdle(() => {
        if (slow && teaseTarget != null && Math.random() < 0.3) return teaseTarget
        return Math.floor(Math.random() * 10)
      })
      if (slow) delay = Math.min(430, delay + 32)
      handle = setTimeout(tick, delay)
    }
    handle = setTimeout(tick, delay)
    return () => {
      alive = false
      clearTimeout(handle)
    }
  }, [locked, slow, teaseTarget])
  const shown = locked ? digit ?? idle : idle
  const isOdd = shown % 2 === 1
  const tint = isOdd ? "oklch(0.72 0.17 25)" : "oklch(0.68 0.14 240)"
  const tintDim = isOdd ? "oklch(0.86 0.09 25)" : "oklch(0.83 0.07 240)"
  const ring = isOdd ? "oklch(0.58 0.22 25)" : "oklch(0.55 0.18 240)"
  return (
    <div
      className="flex h-11 w-9 items-center justify-center rounded-md border-2 font-mono font-black tabular-nums transition-all duration-150"
      style={{
        fontSize: "1.55rem",
        borderColor: glow ? ring : "oklch(0.5 0.02 70 / 0.55)",
        background: `linear-gradient(180deg, ${tintDim}, ${tint} 60%, ${tintDim})`,
        color: "oklch(1 0 0)",
        textShadow:
          "0.5px 0.5px 0 oklch(0 0 0 / 0.4), -0.5px -0.5px 0 oklch(1 0 0 / 0.35), 0 2px 2px oklch(0 0 0 / 0.5)",
        boxShadow: glow
          ? `inset 0 1px 0 oklch(1 0 0 / 0.6), inset 0 -2px 4px oklch(0 0 0 / 0.2), 0 0 14px 3px ${ring}`
          : "inset 0 1px 0 oklch(1 0 0 / 0.6), inset 0 -2px 4px oklch(0 0 0 / 0.2)",
        transform: glow ? "scale(1.1)" : "scale(1)",
      }}
    >
      {shown}
    </div>
  )
}

export function LittleMaryBonus2View({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, musicOn, spendCoins, creditWin, lang } = useLuckyPi()
  const t = dictFor(lang)
  const [bets, setBets] = useState<LittleMaryBonus2Bets>(() => createEmptyBetsB2(STAKE_DEFAULT))
  const [pointer, setPointer] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [autoLeft, setAutoLeft] = useState(0)
  const [autoCount, setAutoCount] = useState(5)
  const [tallyFlicker, setTallyFlicker] = useState<number | null>(null)
  const flickerTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<LittleMaryBonus2SpinResult | null>(null)
  const [chaseBig, setChaseBig] = useState<number>(BIG_CHASE_VALUES_B2[0])
  const [chaseSmall, setChaseSmall] = useState<number>(SMALL_CHASE_VALUES_B2[0])
  const bonusStateRef = useRef<LittleMaryBonus2State>(createLittleMaryBonus2State())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipAheadRef = useRef(false)

  const [bonusPhase, setBonusPhase] = useState<BonusPhase>("idle")
  const [lockedDigits, setLockedDigits] = useState<[number | null, number | null, number | null]>([null, null, null])
  const [bonusWasHit, setBonusWasHit] = useState(false)
  const bonusTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    if (musicOn) startBgm(HUE)
    return () => stopBgm()
  }, [musicOn])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (flickerTimer.current) clearInterval(flickerTimer.current)
      bonusTimersRef.current.forEach(clearTimeout)
      stopEagleCryLoop()
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

  const stake = totalStakedB2(bets)

  function setStake(key: LittleMaryBonus2StakeKey, updater: (prev: number) => number) {
    setBets((prev) => ({ ...prev, [key]: Math.max(STAKE_MIN, Math.min(STAKE_MAX, updater(prev[key]))) }))
  }

  function runSpin() {
    if (phase === "spinning") return
    if (stake <= 0) return
    if (!spendCoins(stake)) return
    setResult(null)
    setPhase("spinning")
    skipAheadRef.current = false
    bonusTimersRef.current.forEach(clearTimeout)
    bonusTimersRef.current = []
    setBonusPhase("idle")
    setLockedDigits([null, null, null])
    setBonusWasHit(false)

    const outcome = spinLittleMaryBonus2(bets, bonusStateRef.current)
    bonusStateRef.current = outcome.nextState

    const fastLaps = 3 * RING_SIZE_B2
    let distanceToTarget = (outcome.stopIndex - 0 + RING_SIZE_B2) % RING_SIZE_B2
    const extraLaps = Math.floor(Math.random() * 2)
    distanceToTarget += extraLaps * RING_SIZE_B2
    const totalSteps = fastLaps + distanceToTarget

    let step = 0
    let current = 0
    const tick = () => {
      current = (current + 1) % RING_SIZE_B2
      setPointer(current)
      if (soundOn) playTickSound(HUE)
      setChaseBig(BIG_CHASE_VALUES_B2[step % BIG_CHASE_VALUES_B2.length])
      setChaseSmall(SMALL_CHASE_VALUES_B2[step % SMALL_CHASE_VALUES_B2.length])
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

  function runBonusSequence(outcome: LittleMaryBonus2SpinResult) {
    if (!outcome.bonusShown || !outcome.bonusDigits) return
    const [d0, d1, d2] = outcome.bonusDigits
    setBonusPhase("reel1")
    if (soundOn) startEagleCryLoop(HUE)
    bonusTimersRef.current.push(
      setTimeout(() => {
        setLockedDigits([d0, null, null])
        if (soundOn) playButtonSound()
        setBonusPhase("reel2")
        bonusTimersRef.current.push(
          setTimeout(() => {
            setLockedDigits([d0, d1, null])
            if (soundOn) playButtonSound()
            setBonusPhase("reel3")
            bonusTimersRef.current.push(
              setTimeout(() => {
                setLockedDigits([d0, d1, d2])
                setBonusPhase("settled")
                stopEagleCryLoop()
                if (outcome.bonusHit) {
                  setBonusWasHit(true)
                  creditWin(outcome.payout - outcome.basePayout)
                  if (soundOn) playReelWinSound(HUE)
                }
              }, 1500),
            )
          }, 450),
        )
      }, 450),
    )
  }

  function finish(outcome: LittleMaryBonus2SpinResult) {
    setPointer(outcome.stopIndex)
    setResult(outcome)
    setPhase("result")
    if (outcome.chaseValue !== undefined) {
      if (outcome.slot.kind === "big") setChaseBig(outcome.chaseValue)
      else setChaseSmall(outcome.chaseValue)
    }

    if (outcome.outcome === "win") {
      creditWin(outcome.basePayout)
      if (soundOn) playReelWinSound(HUE)
      runBonusSequence(outcome)
    } else if (outcome.outcome === "once-more") {
      creditWin(outcome.payout)
      if (soundOn) playButtonSound()
    } else {
      if (soundOn) playBrakeClick(HUE)
    }

    setAutoLeft((n) => Math.max(0, n - 1))
  }

  useEffect(() => {
    // 加碼預告一定要在「這次啟動→這次轉停」之間跑完，自動連續開始不會提前打斷或拖到下一輪。
    if (phase !== "result" || autoLeft <= 0) return
    if (bonusPhase !== "idle" && bonusPhase !== "settled") return
    const tm = setTimeout(() => {
      runSpin()
    }, 1400)
    return () => clearTimeout(tm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, autoLeft, bonusPhase])

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

  const bonusResolving = bonusPhase !== "idle" && bonusPhase !== "settled"
  const betLocked = phase === "spinning" || autoLeft > 0 || bonusResolving

  return (
    <CasinoTableShell
      title="傳統麻台(四)"
      rules={RULES}
      hue={HUE}
      bet={stake}
      betMin={0}
      betMax={99 * STAKE_SYMBOLS_B2.length}
      betStep={1}
      betLocked={betLocked}
      onBetChange={() => {}}
      onHome={onHome}
      onLobby={onLobby}
      hideBetBar
    >
      <div className="flex h-full flex-col items-center justify-start gap-3 overflow-y-auto px-2 py-3">
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-red-800/60 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.32 0.08 15), oklch(0.2 0.07 15) 55%, oklch(0.12 0.05 15))",
            boxShadow:
              "inset 0 2px 0 oklch(0.65 0.15 85 / 0.3), inset 0 -3px 8px oklch(0 0 0 / 0.55), 0 10px 24px -8px oklch(0 0 0 / 0.6)",
          }}
        >
          <div
            className="relative mx-auto grid w-full gap-[3px] rounded-xl border border-red-900/40 bg-black/40 p-1.5"
            style={{ gridTemplateColumns: `repeat(${BOARD_COLS_B2}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS_B2}, 2rem)` }}
          >
            {LITTLE_MARY_B2_RING.map((s, i) => {
              const { col, row } = slotPositionB2(i)
              const lit = pointer === i
              return (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-sm border leading-none transition-all"
                  style={{
                    gridColumnStart: col + 1,
                    gridRowStart: row + 1,
                    borderColor: lit ? "oklch(0.8 0.2 15)" : "oklch(0.55 0.03 15 / 0.5)",
                    background: lit ? "oklch(0.6 0.22 15)" : "oklch(0.94 0.02 50)",
                    boxShadow: lit ? "0 0 10px 3px oklch(0.7 0.2 15 / 0.65)" : "inset 0 0 0 1px oklch(1 0 0 / 0.4)",
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
              className="flex flex-col items-center justify-start gap-1.5 rounded-lg border border-red-500/30 bg-black/70 py-2"
              style={{ gridColumn: `2 / ${BOARD_COLS_B2}`, gridRow: "2 / 11" }}
            >
              <div
                className={`rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wide ${
                  bonusResolving ? "border-red-300 text-red-200" : "border-white/10 text-red-100/50"
                }`}
              >
                {bonusResolving ? "幸運七開獎中…" : bonusWasHit && bonusPhase === "settled" ? "幸運七中獎！" : "幸運七"}
              </div>
              <div
                className="flex items-center gap-1 rounded-xl border-2 border-red-500/60 bg-gradient-to-b from-neutral-800 to-neutral-950 p-1.5"
                style={{
                  boxShadow:
                    "inset 0 2px 0 oklch(0.55 0.1 15 / 0.4), inset 0 -3px 6px oklch(0 0 0 / 0.6), 0 4px 10px -2px oklch(0 0 0 / 0.6)",
                }}
              >
                <DigitReel digit={lockedDigits[0]} locked={bonusPhase !== "idle"} glow={bonusWasHit && bonusPhase === "settled"} />
                <DigitReel digit={lockedDigits[1]} locked={bonusPhase === "reel2" || bonusPhase === "reel3" || bonusPhase === "settled"} glow={bonusWasHit && bonusPhase === "settled"} />
                <DigitReel
                  digit={lockedDigits[2]}
                  locked={bonusPhase === "settled"}
                  glow={bonusWasHit && bonusPhase === "settled"}
                  slow={bonusPhase === "reel3"}
                  teaseTarget={lockedDigits[0]}
                />
              </div>
              {bonusWasHit && bonusPhase === "settled" && result?.bonusMultiplier && result.bonusMultiplier > 1 && (
                <p className="text-[11px] font-black text-amber-300">加碼 ×{result.bonusMultiplier}！</p>
              )}
              <div className="mt-2 grid w-full grid-cols-2 gap-x-2 text-center">
                <div className="flex flex-col items-center gap-0.5">
                  <p className="text-[9px] font-semibold text-neutral-400">自動次數</p>
                  <p className="font-mono text-base font-black tabular-nums text-amber-100">
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
                    className={`text-[11px] font-black leading-tight ${result.outcome === "win" ? "text-amber-300" : result.outcome === "once-more" ? "text-sky-300" : "text-neutral-400"}`}
                  >
                    {result.outcome === "win"
                      ? `${result.slot.label} 中獎！${result.stakeUsed}×${result.baseMultiplier}＝${result.basePayout}`
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
                {BIG_CHASE_VALUES_B2.map((v) => (
                  <span
                    key={v}
                    className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all duration-150 ${
                      chaseBig === v
                        ? `scale-110 border-red-400 bg-red-500/30 text-red-100 shadow-[0_0_10px_2px_oklch(0.7_0.2_15/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
                        : "border-white/10 text-neutral-600"
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {SMALL_CHASE_VALUES_B2.map((v) => (
                  <span
                    key={v}
                    className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all duration-150 ${
                      chaseSmall === v
                        ? `scale-110 border-amber-400 bg-amber-500/30 text-amber-100 shadow-[0_0_10px_2px_oklch(0.8_0.19_85/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
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

        <div
          className="w-full max-w-[22rem] rounded-2xl border border-red-800/60 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.34 0.08 15), oklch(0.22 0.07 15) 55%, oklch(0.14 0.05 15))",
            boxShadow:
              "inset 0 2px 0 oklch(0.65 0.15 85 / 0.3), inset 0 -4px 10px oklch(0 0 0 / 0.5), 0 14px 22px -10px oklch(0 0 0 / 0.65)",
            transform: "perspective(900px) rotateX(5deg)",
            transformOrigin: "top center",
          }}
        >
          <div className="grid w-full grid-cols-8 gap-1">
            {STAKE_SYMBOLS_B2.map((s) => (
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
