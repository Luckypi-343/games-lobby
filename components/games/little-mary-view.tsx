"use client"

// 傳統麻台（第一代）畫面：橫8格×直11格中空方框跑馬燈，34個燈位環繞一圈，
// 啟動後游標順時鐘快轉三圈、再緩轉半圈到一圈半停止；玩家可在停止前按「停止」鍵提早喊停
// （最終停點仍由開始那一刻就決定好的結果決定，純粹是手感操作，不影響機率公平性）。
// 玩家對 8 種圖案（BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／櫻桃）各自分別下注分數，
// 啟動時一次扣掉 8 筆押注總和；停在哪個圖案，只有該圖案自己的押注會依賠率出彩。
// 中央燈箱比照傳統機台造型：加大加高、帶白色立體陰影的 JP 霓虹字樣、(000)輪次計數、自動剩餘次數。
// 面板下方 BAR 區顯示目前大牌／小牌跑燈數值（轉動時左右快速跳動），停止當下的數值就是這次中獎倍率，
// 純供顯示，不開放玩家自行調整，避免任何人能把中獎機率或賠率改到對自己有利。
import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import {
  LITTLE_MARY_RING,
  RING_SIZE,
  BOARD_COLS,
  BOARD_ROWS,
  BIG_CHASE_VALUES,
  SMALL_CHASE_VALUES,
  BIG_JP_MULTIPLIER,
  SMALL_JP_MULTIPLIER,
  JP_MIN_SPINS,
  STAKE_SYMBOLS,
  slotPosition,
  createLittleMaryState,
  createEmptyBets,
  totalStaked,
  spinLittleMary,
  type LittleMaryBets,
  type LittleMaryStakeKey,
  type LittleMaryState,
  type LittleMarySpinResult,
} from "@/lib/games/little-mary"
import {
  playTickSound,
  playButtonSound,
  playJpBellSound,
  startChristmasBellLoop,
  stopChristmasBellLoop,
} from "@/lib/games/game-audio"
import { playWinSound as playReelWinSound, playBrakeClick } from "@/lib/luckypi/reel-audio"
import { InlineStorageNotice, GoodLuckMessage } from "@/components/luckypi/pieces"

const STAKE_MIN = 0
const STAKE_MAX = 99
const STAKE_DEFAULT = 5
const HUE = 38
const RULES =
  "對BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／櫻桃各自調整押注分數（0～99），再按開始啟動，一次扣掉8筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按「停止」提早喊停（結果已事先決定，純手感操作）：停在箭頭全輸；停在🅾️免費重轉一次（全額退回）；停在某個圖案，只有該圖案自己的押注依賠率出彩——🆎固定100倍、🅰️固定50倍、🅱️固定25倍、櫻桃固定2倍，77/星星/西瓜與鈴鐺/香瓜/檸檬依跑燈倍數浮動，累積一定轉數後隨機進入JP場次，命中時改發固定高倍並響起專屬鈴聲。\n\n【賠率表】BAR類（共用同一筆BAR押注）：🆎三條BAR×100、🅰️兩條BAR×50、🅱️單條BAR×25。🍒櫻桃固定×2。大牌（各自押注，依跑燈浮動）：77／⭐️／🍉一般×" +
  BIG_CHASE_VALUES.join("／") +
  "，JP場次固定×" +
  BIG_JP_MULTIPLIER +
  "。小牌（各自押注，依跑燈浮動）：🔔／🍈／🍋一般×" +
  SMALL_CHASE_VALUES.join("／") +
  "，JP場次固定×" +
  SMALL_JP_MULTIPLIER +
  "。約滿" +
  JP_MIN_SPINS +
  "轉後才有機會隨機進入JP預告場次。賠率為機台固定設定，不開放玩家自行調整。"

const SPIN_STEP_MS_FAST = 45
const SPIN_STEP_MS_SLOW = 150
const LONG_PRESS_DELAY_MS = 380
const LONG_PRESS_REPEAT_MS = 95

type Phase = "idle" | "spinning" | "result"

/** BAR／77 兩種符號的仿真呈現：77 為紅色加粗變形字並置中，BAR 為純黑粗體文字（不用色底），依堆疊層數拉寬填滿格子。 */
function SymbolFace({ glyph, variant }: { glyph: string; variant: "board" | "stepper" }) {
  const big = variant === "board"
  if (glyph === "77") {
    return (
      <span
        className="flex w-full items-center justify-center font-black leading-none"
        style={{
          fontSize: big ? "1.5rem" : "1.1rem",
          color: "oklch(0.52 0.24 25)",
          transform: "scaleX(1.15) skewX(-12deg)",
          textShadow:
            "1px 1px 0 oklch(0 0 0 / 0.65), -0.5px -0.5px 0 oklch(1 0 0 / 0.25), 0 0 6px oklch(0.55 0.22 25 / 0.5)",
        }}
      >
        77
      </span>
    )
  }
  if (glyph === "🅾️") {
    // 不用圓圈符號，改用「ONCE」／「MORE」上下兩行疊字，紅色粗體、白色陰影。
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
    // 🆎 三條BAR、🅰️ 兩條BAR、🅱️ 單條BAR：純黑粗體文字，不用色底，儘量拉寬但不超出格子。
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

/** 四組押注各自的指示色：BAR紅、大牌(77/星星/西瓜)紫、小牌(鈴鐺/香瓜/檸檬)藍、櫻桃綠。 */
function groupColor(group: "bar" | "fixed" | "big" | "small"): { base: string; dim: string } {
  switch (group) {
    case "bar":
      return { base: "oklch(0.56 0.22 25)", dim: "oklch(0.3 0.1 25)" }
    case "big":
      return { base: "oklch(0.52 0.2 310)", dim: "oklch(0.28 0.09 310)" }
    case "small":
      return { base: "oklch(0.55 0.16 250)", dim: "oklch(0.3 0.08 250)" }
    default:
      return { base: "oklch(0.58 0.17 150)", dim: "oklch(0.3 0.08 150)" }
  }
}

/** 自動次數調整：-◀️▶️+ 四個動作合併成一組，單按跳一格，長按連續增減，5～99 之間夾住。每次操作會呼叫 onPulse 讓 JP 下方的(000)跳動幾下作為回饋。 */
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
    // 單一牌的增加押注分按鈕：0～99 循環，到頂就折返重頭開始。
    // 用 updater function 讀取「當下最新」的值，長按連續觸發時才不會每次都疊加在同一個舊值上。
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

export function LittleMaryView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin, lang } = useLuckyPi()
 const t = dictFor(lang)
  const [bets, setBets] = useState<LittleMaryBets>(() => createEmptyBets(STAKE_DEFAULT))
  const [pointer, setPointer] = useState(0)
  const [phase, setPhase] = useState<Phase>("idle")
  const [autoLeft, setAutoLeft] = useState(0)
  const [autoCount, setAutoCount] = useState(5)
  const [tallyFlicker, setTallyFlicker] = useState<number | null>(null)
  const flickerTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [result, setResult] = useState<LittleMarySpinResult | null>(null)
  const [chaseBig, setChaseBig] = useState<number>(BIG_CHASE_VALUES[0])
  const [chaseSmall, setChaseSmall] = useState<number>(SMALL_CHASE_VALUES[0])
  const jpStateRef = useRef<LittleMaryState>(createLittleMaryState())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipAheadRef = useRef(false)
  // 這一轉是否已經是「必中JP」的那一轉：在啟動當下就跟結果一起決定好，絕不會提前預告未來幾轉。
  const [jpActive, setJpActive] = useState(false)

  useEffect(() => {
    return () => {
      stopChristmasBellLoop()
      if (timerRef.current) clearTimeout(timerRef.current)
      if (flickerTimer.current) clearInterval(flickerTimer.current)
    }
  }, [])

  // 點按或長按自動次數的 -◀️▶️+ 時，讓JP下方的(000)短暫跳動幾個隨機數字作為操作回饋，
  // 結束後自動還原顯示真正的輪次計數。
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

  const stake = totalStaked(bets)

  function setStake(key: LittleMaryStakeKey, updater: (prev: number) => number) {
    setBets((prev) => ({ ...prev, [key]: Math.max(STAKE_MIN, Math.min(STAKE_MAX, updater(prev[key]))) }))
  }

  function runSpin() {
    if (phase === "spinning") return
    if (stake <= 0) return
    if (!spendCoins(stake)) return
    setResult(null)
    setPhase("spinning")
    skipAheadRef.current = false

    const outcome = spinLittleMary(bets, jpStateRef.current)
    jpStateRef.current = outcome.nextState
    // 這一轉是否觸發JP，在啟動當下就已經確定，所以急促閃爍/炫光必須立刻同步顯示，不是提前預告下幾轉。
    setJpActive(outcome.wasJpSpin)
    if (outcome.wasJpSpin && soundOn) startChristmasBellLoop()
    else stopChristmasBellLoop()

    // 目標總步數：先快轉 3 整圈，再緩轉到最終落點（半圈到一圈半之間，依落點距離決定）。
    const fastLaps = 3 * RING_SIZE
    let distanceToTarget = (outcome.stopIndex - 0 + RING_SIZE) % RING_SIZE
    const extraLaps = Math.floor(Math.random() * 2) // 緩轉階段再多繞 0～1 整圈，模擬半圈到一圈半
    distanceToTarget += extraLaps * RING_SIZE
    const totalSteps = fastLaps + distanceToTarget

    let step = 0
    let current = 0
    const tick = () => {
      current = (current + 1) % RING_SIZE
      setPointer(current)
      if (soundOn) playTickSound()
      // 跑燈效果：大牌/小牌參考數值在轉動過程持續跳動
      setChaseBig(BIG_CHASE_VALUES[step % BIG_CHASE_VALUES.length])
      setChaseSmall(SMALL_CHASE_VALUES[step % SMALL_CHASE_VALUES.length])
      step += 1
      const remaining = totalSteps - step
      const effectiveRemaining = skipAheadRef.current ? Math.min(remaining, distanceToTarget) : remaining
      if (step >= totalSteps || (skipAheadRef.current && remaining <= distanceToTarget && remaining <= 0)) {
        finish(outcome)
        return
      }
      if (skipAheadRef.current && remaining > distanceToTarget) {
        // 快轉階段被要求提早停止：直接跳到緩轉起點。
        step = totalSteps - distanceToTarget
      }
      const delay = effectiveRemaining > distanceToTarget ? SPIN_STEP_MS_FAST : SPIN_STEP_MS_SLOW
      timerRef.current = setTimeout(tick, delay)
    }
    timerRef.current = setTimeout(tick, SPIN_STEP_MS_FAST)
  }

  function finish(outcome: LittleMarySpinResult) {
    stopChristmasBellLoop()
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
        if (outcome.jpHit) playJpBellSound()
        else playReelWinSound(HUE)
      }
    } else if (outcome.outcome === "once-more") {
      creditWin(outcome.payout) // 全額退回。
      if (soundOn) playButtonSound()
    } else {
      if (soundOn) playBrakeClick(HUE)
    }

    setAutoLeft((n) => Math.max(0, n - 1))
  }

  // 自動連續次數：上一輪結束後若還有剩餘次數，自動接著轉下一輪。
  useEffect(() => {
    if (phase !== "result" || autoLeft <= 0) return
    const t = setTimeout(() => {
      runSpin()
    }, 850)
    return () => clearTimeout(t)
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

  // JP 字樣閃爍節奏：平常每 3 秒閃一下（提示持續累積中），預告中大獎時改成每 0.5 秒快速閃爍並周圍發光。
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
      title="傳統麻台(一)"
      rules={RULES}
      hue={HUE}
      bet={stake}
      betMin={0}
      betMax={99 * STAKE_SYMBOLS.length}
      betStep={1}
      betLocked={betLocked}
      onBetChange={() => {}}
      onHome={onHome}
      onLobby={onLobby}
      hideBetBar
    >
      <div className="flex h-full flex-col items-center justify-start gap-3 overflow-y-auto px-2 py-3">
        {/* 機台立面：轉盤燈框＋跑燈合併成一整片直立式立體機殼，改用淺咖木材色裝潢（上緣打亮、下緣陰影、兩側收邊，模擬真實機台木紋外殼）。 */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-amber-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.72 0.05 62), oklch(0.62 0.06 52) 55%, oklch(0.52 0.06 45))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.25), inset 0 -3px 8px oklch(0.3 0.04 40 / 0.55), 0 10px 24px -8px oklch(0.25 0.03 40 / 0.6)",
          }}
        >
        {/* 中空方框跑馬燈面板：8格×11格 = 34 燈位，淺色底框內嵌中獎圖騰 */}
        <div
          className="relative mx-auto grid w-full gap-[3px] rounded-xl border border-amber-900/40 bg-black/40 p-1.5"
          style={{ gridTemplateColumns: `repeat(${BOARD_COLS}, 1fr)`, gridTemplateRows: `repeat(${BOARD_ROWS}, 2rem)` }}
        >
          {LITTLE_MARY_RING.map((s, i) => {
            const { col, row } = slotPosition(i)
            const lit = pointer === i
            return (
              <div
                key={i}
                className="flex items-center justify-center rounded-sm border leading-none transition-all"
                style={{
                  gridColumnStart: col + 1,
                  gridRowStart: row + 1,
                  borderColor: lit ? "oklch(0.85 0.2 85)" : "oklch(0.55 0.03 38 / 0.5)",
                  background: lit ? "oklch(0.55 0.22 85)" : "oklch(0.93 0.015 70)",
                  boxShadow: lit ? "0 0 10px 3px oklch(0.75 0.2 85 / 0.65)" : "inset 0 0 0 1px oklch(1 0 0 / 0.4)",
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
          {/* 中央燈箱：加大加高、帶白色立體陰影的 JP 霓虹字樣 + 輪次計數 + 自動剩餘（下移避開JP）+ 中獎訊息 */}
          <div
            className="flex flex-col items-center justify-start gap-1 rounded-lg border border-amber-500/30 bg-black/70 py-1.5"
            style={{ gridColumn: `2 / ${BOARD_COLS}`, gridRow: "2 / 11" }}
          >
            <div
              className={`rounded-full border px-3 py-0.5 text-[10px] font-bold tracking-wide transition-opacity duration-150 ${
                jpBlinking ? "border-amber-300 text-amber-200" : "border-white/10 text-amber-100/40"
              }`}
              style={{ opacity: jpBlinking ? (jpFlash ? 1 : 0.35) : jpFlash ? 1 : 0.6 }}
            >
              {jpBlinking ? "JP 預告中" : "JP 累積中"}
            </div>
            <p
              className="font-black leading-[0.85] tracking-wider transition-[text-shadow,opacity] duration-150"
              style={{
                fontSize: "4.4rem",
                transform: "scaleY(1.35)",
                color: "oklch(0.62 0.22 25)",
                WebkitTextStroke: "2px oklch(1 0 0 / 0.9)",
                opacity: jpBlinking ? (jpFlash ? 1 : 0.6) : jpFlash ? 1 : 0.5,
                // 平常每3秒閃一下：只有簡單的立體深度陰影，不帶炫光。
                // 預告大獎時每0.5秒快閃：周圍持續帶著炫光，閃到亮時光暈更強。
                textShadow: jpBlinking
                  ? jpFlash
                    ? "0 2px 0 oklch(1 0 0 / 0.95), 0 4px 6px oklch(0 0 0 / 0.55), 0 0 18px oklch(0.75 0.25 85 / 1), 0 0 40px oklch(0.7 0.24 85 / 0.9), 0 0 60px oklch(0.65 0.22 25 / 0.7)"
                    : "0 2px 0 oklch(1 0 0 / 0.9), 0 4px 6px oklch(0 0 0 / 0.5), 0 0 10px oklch(0.7 0.25 25 / 0.45)"
                  : "0 2px 0 oklch(1 0 0 / 0.9), 0 4px 6px oklch(0 0 0 / 0.5)",
              }}
            >
              JP
            </p>
            <div className="mt-4">
              <GoodLuckMessage cellSize="2rem" />
            </div>
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
            {/* 中獎訊息：移到JP燈箱下方顯示，不再另外佔用面板外的空間 */}
            <div className="mt-1 flex min-h-[1.4rem] items-center justify-center px-2 text-center">
              {phase === "result" && result ? (
                <span
                  className={`text-[11px] font-black leading-tight ${result.outcome === "win" ? "text-amber-300" : result.outcome === "once-more" ? "text-sky-300" : "text-neutral-400"}`}
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

        {/* BAR 跑燈倍數（轉動中左右快速跳動，停止當下的數值就是這次的中獎倍率）— 併入同一片機殼立面底部 */}
        <div className="mt-2 rounded-xl border border-white/10 bg-black/40 p-2">
          <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-neutral-400">
            <span>大牌跑燈</span>
            <span>小牌跑燈</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1">
              {BIG_CHASE_VALUES.map((v) => (
                <span
                  key={v}
                  className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all duration-150 ${
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
              {SMALL_CHASE_VALUES.map((v) => (
                <span
                  key={v}
                  className={`rounded-md border px-2 py-1 font-mono text-xs font-bold tabular-nums transition-all duration-150 ${
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

        {/* 玩家工作面：8格押注＋開始／停止／自動，比照正面同款淺咖木材色，並帶前傾角度感（像實體機台操作台斜放在機身下方） */}
        <div
          className="w-full max-w-[22rem] rounded-2xl border border-amber-800/50 p-2.5"
          style={{
            background: "linear-gradient(180deg, oklch(0.74 0.05 62), oklch(0.64 0.06 52) 55%, oklch(0.54 0.06 45))",
            boxShadow:
              "inset 0 2px 0 oklch(1 0 0 / 0.3), inset 0 -4px 10px oklch(0.3 0.04 40 / 0.5), 0 14px 22px -10px oklch(0.2 0.03 40 / 0.65)",
            transform: "perspective(900px) rotateX(5deg)",
            transformOrigin: "top center",
          }}
        >
        {/* 每種圖案各自押注（單一牌增加押注分按鈕：點按跳一格，長按連續增加，0～99循環）— 8格一排並排顯示 */}
        <div className="grid w-full grid-cols-8 gap-1">
          {STAKE_SYMBOLS.map((s) => (
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

        {/* 開始／停止／自動／自動次數調整，排成同一排：三顆主按鈕縮小，讓調節按鈕更寬好按 */}
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
          <AutoCountStepper
            value={autoCount}
            disabled={betLocked}
            onChange={setAutoCount}
            onPulse={flashTally}
          />
        </div>
        </div>

      </div>
    </CasinoTableShell>
  )
}
