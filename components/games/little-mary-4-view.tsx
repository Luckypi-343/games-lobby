"use client"

// 傳統麻台（第三代·動物主題）畫面：設置、運轉機制、🌺花神三元獎（大三元／小三元）完全複製第二代花朵JP版，
// 只替換圖騰：大牌組 🐯／🐲／🐵，小牌組 🦊／🐭／🐔，普牌 🐣 取代櫻桃。機殼改用琥珀／叢林棕色調做區隔。
import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import {
  LITTLE_MARY_4_RING,
  BOARD_COLS_4,
  BOARD_ROWS_4,
  BIG_CHASE_VALUES_4,
  SMALL_CHASE_VALUES_4,
  TRIPLET_FACTOR_4,
  JP_MIN_SPINS_4,
  STAKE_SYMBOLS_4,
  slotPosition4,
  createLittleMary4State,
  createEmptyBets4,
  totalStaked4,
  spinLittleMary4,
  RING_SIZE_4,
  type LittleMary4Bets,
  type LittleMary4StakeKey,
  type LittleMary4State,
  type LittleMary4SpinResult,
} from "@/lib/games/little-mary-4"
import {
  playTickSound,
  playButtonSound,
  playJpBellSound,
  playAlarmBlip,
  startBirdCallLoop,
  stopBirdCallLoop,
} from "@/lib/games/game-audio"
import { playWinSound as playReelWinSound, playBrakeClick } from "@/lib/luckypi/reel-audio"
import { InlineStorageNotice, GoodLuckMessage } from "@/components/luckypi/pieces"

const STAKE_MIN = 0
const STAKE_MAX = 99
const STAKE_DEFAULT = 5
const HUE = 55 // 琥珀／叢林棕色調，跟花朵版（335）、運動版（150）、第一代（38）做出區隔。
const RULES =
  "設置與運轉機制跟傳統麻台(一)、花朵JP版完全相同，圖騰換成動物主題：對BAR／老虎／龍／猴子／狐狸／老鼠／雞／小雞各自調整押注分數（0～99），再按開始啟動，一次扣掉8筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按「停止」提早喊停（結果已事先決定，純手感操作）：停在箭頭全輸；停在🅾️免費重轉一次（全額退回）；停在BAR／小雞依固定倍率出彩。花神平常各自不同步閃爍，累積一定轉數後隨機進入預告狀態（三朵花同時炫光急閃、警鈴連響）：此時若轉停在大牌組或小牌組，即開出大三元／小三元——該組三個圖案同時中獎，總倍數＝跑燈停止倍數×3。\n\n【賠率表】BAR類（共用同一筆BAR押注）：🆎三條BAR×100、🅰️兩條BAR×50、🅱️單條BAR×25。🐣小雞固定×2。大牌／小牌（各自押注，依跑燈浮動）：🐯／🐲／🐵一般×" +
  BIG_CHASE_VALUES_4.join("／") +
  "；🦊／🐭／🐔一般×" +
  SMALL_CHASE_VALUES_4.join("／") +
  "。🌺花神三元獎：累積約滿" +
  JP_MIN_SPINS_4 +
  "轉後才有機會隨機進入預告狀態，命中時總倍數＝跑燈停止倍數×" +
  TRIPLET_FACTOR_4 +
  "。停在箭頭全輸；停在🅾️免費重轉一次，全額退回。賠率為機台固定設定，不開放玩家自行調整。"

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

function groupColor(group: "bar" | "fixed" | "big" | "small"): { base: string; dim: string } {
  switch (group) {
    case "bar":
      return { base: "oklch(0.56 0.22 25)", dim: "oklch(0.3 0.1 25)" }
    case "big":
      return { base: "oklch(0.58 0.19 55)", dim: "oklch(0.32 0.1 55)" }
    case "small":
      return { base: "oklch(0.55 0.16 220)", dim: "oklch(0.3 0.08 220)" }
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

function FlowerRow({ armed, flash }: { armed: boolean; flash: boolean }) {
  const [idleTick, setIdleTick] = useState(0)
  useEffect(() => {
    const tm = setInterval(() => setIdleTick((n) => n + 1), 260)
    return () => clearInterval(tm)
  }, [])
  const offsets = [0, 1, 2]
  return (
    <div className="flex items-center justify-center gap-2">
      {offsets.map((off) => {
        const lit = armed ? flash : (idleTick + off) % 5 < 3
        return (
          <span
            key={off}
            className="text-3xl transition-all duration-150"
            style={{
              opacity: lit ? 1 : 0.3,
              filter: armed
                ? flash
                  ? "drop-shadow(0 0 10px oklch(0.75 0.22 55 / 1)) drop-shadow(0 0 22px oklch(0.7 0.22 55 / 0.9))"
                  : "drop-shadow(0 0 4px oklch(0.7 0.18 55 / 0.5))"
                : lit
                  ? "drop-shadow(0 0 4px oklch(0.7 0.18 55 / 0.5))"
                  : "none",
              transform: armed && flash ? "scale(1.15)" : "scale(1)",
            }}
          >
            🌺
          </span>
        )
      })}
    </div>
  )
}

export function LittleMary4View({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin, lang } = useLuckyPi()
  const t = dictFor(lang)
  const [bets, setBets] = useState<LittleMary4Bets>(() => createEmptyBets4(STAKE_DEFAULT))
  const [pointer, setPointer] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [autoLeft, setAutoLeft] = useState(0)
  const [autoCount, setAutoCount] = useState(5)
  const [tallyFlicker, setTallyFlicker] = useState<number | null>(null)
  const flickerTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<LittleMary4SpinResult | null>(null)
  const [chaseBig, setChaseBig] = useState<number>(BIG_CHASE_VALUES_4[0])
  const [chaseSmall, setChaseSmall] = useState<number>(SMALL_CHASE_VALUES_4[0])
  const jpStateRef = useRef<LittleMary4State>(createLittleMary4State())
  // 這一轉是否已經是「必中三元」的那一轉：在啟動當下就跟結果一起決定好，絕不會提前預告未來幾轉。
  const [jpActive, setJpActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipAheadRef = useRef(false)

  useEffect(() => {
    return () => {
      stopBirdCallLoop()
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

  const stake = totalStaked4(bets)

  function setStake(key: LittleMary4StakeKey, updater: (prev: number) => number) {
    setBets((prev) => ({ ...prev, [key]: Math.max(STAKE_MIN, Math.min(STAKE_MAX, updater(prev[key]))) }))
  }

  function runSpin() {
    if (phase === "spinning") return
    if (stake <= 0) return
    if (!spendCoins(stake)) return
    setResult(null)
    setPhase("spinning")
    skipAheadRef.current = false

    const outcome = spinLittleMary4(bets, jpStateRef.current)
    jpStateRef.current = outcome.nextState
    // 這一轉是否觸發三元獎，在啟動當下就已經確定，所以急促閃爍/炫光必須立刻同步顯示，不是提前預告下幾轉。
    setJpActive(outcome.wasJpSpin)
    if (outcome.wasJpSpin && soundOn) startBirdCallLoop(HUE)
    else stopBirdCallLoop()

    const fastLaps = 3 * RING_SIZE_4
    let distanceToTarget = (outcome.stopIndex - 0 + RING_SIZE_4) % RING_SIZE_4
    const extraLaps = Math.floor(Math.random() * 2)
    distanceToTarget += extraLaps * RING_SIZE_4
    const totalSteps = fastLaps + distanceToTarget

    let step = 0
    let current = 0
    const tick = () => {
      current = (current + 1) % RING_SIZE_4
      setPointer(current)
      if (soundOn) playTickSound(HUE)
      setChaseBig(BIG_CHASE_VALUES_4[step % BIG_CHASE_VALUES_4.length])
      setChaseSmall(SMALL_CHASE_VALUES_4[step % SMALL_CHASE_VALUES_4.length])
      step += 1
      const remaining = totalSteps - step
      if (step >= totalSteps || (skipAheadRef.current && remaining <= distanceToTarget && remaining <= 0)) {
        finish(outcome)
        return
      }
      if (skipAheadRef.current && remaining > distanceToTarget) {
        step = totalSteps - distanceToTarget
      }
      const effectiveRemaining = skipAheadRef.current ? Math.min(remaining, distanceToTarget) : remaining
      const delay = effectiveRemaining > distanceToTarget ? SPIN_STEP_MS_FAST : SPIN_STEP_MS_SLOW
      timerRef.current = setTimeout(tick, delay)
    }
    timerRef.current = setTimeout(tick, SPIN_STEP_MS_FAST)
  }

  function finish(outcome: LittleMary4SpinResult) {
    stopBirdCallLoop()
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
  const jpBlinking = jpActive

  const [jpFlash, setJpFlash] = useState(true)
  useEffect(() => {
    let alive = true
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      if (!alive) return
      setJpFlash((f) => !f)
      if (jpBlinking && soundOn) playAlarmBlip(HUE)
      timer = setTimeout(tick, jpBlinking ? 500 : 3000)
    }
    timer = setTimeout(tick, jpBlinking ? 500 : 3000)
    return () => {
      alive = false
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jpBlinking])

  return (
    <CasinoTableShell
      title="傳統麻台(四)"
      rules={RULES}
      hue={HUE}
      bet={stake}
      betMin={0}
      betMax={99 * STAKE_SYMBOLS_4.length}
      betStep={1}
      betLocked={betLocked}
      onBetChange={() => {}}
      onHome={onHome}
      onLobby={onLobby}
      hideBetBar
    >
      <div className="flex h-full flex-col items-center justify-start gap-3 overflow-y-auto px-2 py-3">
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-amber-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.62 0.1 55), oklch(0.48 0.1 55) 55%, oklch(0.38 0.08 55))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.25), inset 0 -3px 8px oklch(0.24 0.06 55 / 0.55), 0 10px 24px -8px oklch(0.2 0.05 55 / 0.6)",
          }}
        >
          <div
            className="relative mx-auto grid w-full gap-[3px] rounded-xl border border-amber-900/40 bg-black/40 p-1.5"
            style={{ gridTemplateColumns: `repeat(${BOARD_COLS_4}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS_4}, 2rem)` }}
          >
            {LITTLE_MARY_4_RING.map((s, i) => {
              const { col, row } = slotPosition4(i)
              const lit = pointer === i
              return (
                <div
                  key={i}
                  className="flex items-center justify-center rounded-sm border leading-none transition-all"
                  style={{
                    gridColumnStart: col + 1,
                    gridRowStart: row + 1,
                    borderColor: lit ? "oklch(0.85 0.19 55)" : "oklch(0.55 0.03 55 / 0.5)",
                    background: lit ? "oklch(0.68 0.19 55)" : "oklch(0.94 0.03 60)",
                    boxShadow: lit ? "0 0 10px 3px oklch(0.75 0.19 55 / 0.65)" : "inset 0 0 0 1px oklch(1 0 0 / 0.4)",
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
              className="flex flex-col items-center justify-start gap-1 rounded-lg border border-amber-500/30 bg-black/70 py-1.5"
              style={{ gridColumn: `2 / ${BOARD_COLS_4}`, gridRow: "2 / 11" }}
            >
              <div
                className={`rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wide transition-opacity duration-150 ${
                  jpBlinking ? "border-amber-300 text-amber-200" : "border-white/10 text-amber-100/40"
                }`}
                style={{ opacity: jpBlinking ? (jpFlash ? 1 : 0.35) : 0.75 }}
              >
                {jpBlinking ? "花神預告中" : "花神累積中"}
              </div>
              <FlowerRow armed={jpBlinking} flash={jpFlash} />
              <GoodLuckMessage cellSize="2rem" />
              <div className="mt-3 grid w-full grid-cols-2 gap-x-2 text-center">
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
                    className={`text-[11px] font-black leading-tight ${
                      result.outcome === "win"
                        ? "text-amber-300"
                        : result.outcome === "once-more"
                          ? "text-sky-300"
                          : "text-neutral-400"
                    }`}
                  >
                    {result.outcome === "win"
                      ? result.jpHit
                        ? `${result.tripletIsBig ? "大三元" : "小三元"}！${result.stakeUsed}×${result.multiplier}＝${result.payout}`
                        : `${result.slot.label} 中獎！${result.stakeUsed}×${result.multiplier}＝${result.payout}`
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
                {BIG_CHASE_VALUES_4.map((v) => (
                  <span
                    key={v}
                    className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all ${
                      chaseBig === v
                        ? `scale-110 border-amber-400 bg-amber-500/30 text-amber-100 shadow-[0_0_10px_2px_oklch(0.8_0.19_80/0.75)] ${phase === "spinning" ? "animate-pulse" : ""}`
                        : "border-white/10 text-neutral-600"
                    }`}
                  >
                    {v}
                  </span>
                ))}
              </div>
              <div className="flex gap-1">
                {SMALL_CHASE_VALUES_4.map((v) => (
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

        <div
          className="w-full max-w-[22rem] rounded-2xl border border-amber-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.64 0.1 55), oklch(0.5 0.1 55) 55%, oklch(0.4 0.08 55))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.3), inset 0 -4px 10px oklch(0.24 0.06 55 / 0.5), 0 14px 22px -10px oklch(0.16 0.05 55 / 0.65)",
            transform: "perspective(900px) rotateX(5deg)",
            transformOrigin: "top center",
          }}
        >
          <div className="grid w-full grid-cols-8 gap-1">
            {STAKE_SYMBOLS_4.map((s) => (
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
