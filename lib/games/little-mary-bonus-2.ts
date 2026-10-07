// 傳統麻台(四)．幸運七加碼版．喜慶主題 純邏輯引擎。
// 跟 little-mary-bonus.ts（幸運七加碼版．第一代圖騰）完全相同的燈位排列、機率權重、
// ONCE MORE 全額退回規則與幸運七轉輪加碼機制，唯一不同是大牌／小牌圖騰換成喜慶主題：
// 大牌組 🧧／💰／🏮（紅包／金元寶／燈籠），小牌組 🍊／🥮／🎆（橘子／月餅／煙火），
// BAR 家族、櫻桃、箭頭／ONCE MORE 完全不變。

export type LittleMaryBonus2SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMaryBonus2StakeKey =
  | "bar"
  | "cherry"
  | "envelope"
  | "ingot"
  | "lantern"
  | "orange"
  | "mooncake"
  | "firework"

export interface StakeInfoB2 {
  key: LittleMaryBonus2StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_B2: StakeInfoB2[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "envelope", glyph: "🧧", label: "紅包", group: "big" },
  { key: "ingot", glyph: "💰", label: "金元寶", group: "big" },
  { key: "lantern", glyph: "🏮", label: "燈籠", group: "big" },
  { key: "orange", glyph: "🍊", label: "橘子", group: "small" },
  { key: "mooncake", glyph: "🥮", label: "月餅", group: "small" },
  { key: "firework", glyph: "🎆", label: "煙火", group: "small" },
  { key: "cherry", glyph: "🍒", label: "櫻桃", group: "fixed" },
]

export type LittleMaryBonus2Bets = Record<LittleMaryBonus2StakeKey, number>

export function createEmptyBetsB2(defaultValue = 0): LittleMaryBonus2Bets {
  const bets = {} as LittleMaryBonus2Bets
  for (const s of STAKE_SYMBOLS_B2) bets[s.key] = defaultValue
  return bets
}

export function totalStakedB2(bets: LittleMaryBonus2Bets): number {
  return STAKE_SYMBOLS_B2.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMaryBonus2Slot {
  index: number
  kind: LittleMaryBonus2SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMaryBonus2StakeKey
}

function slot(
  index: number,
  kind: LittleMaryBonus2SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMaryBonus2StakeKey,
  fixedMultiplier?: number,
): LittleMaryBonus2Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

export const LITTLE_MARY_B2_RING: LittleMaryBonus2Slot[] = [
  slot(0, "small", "🍊", "橘子", "orange"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🎆", "煙火", "firework"),
  slot(8, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(9, "big", "💰", "金元寶", "ingot"),
  slot(10, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(11, "once-more", "🅾️", "再來一次"),
  slot(12, "arrow", "⬇️", "下"),
  slot(13, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(14, "small", "🥮", "月餅", "mooncake"),
  slot(15, "arrow", "⬇️", "下"),
  slot(16, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(17, "small", "🍊", "橘子", "orange"),
  slot(18, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(19, "arrow", "⬅️", "左"),
  slot(20, "big", "🧧", "紅包", "envelope"),
  slot(21, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "arrow", "⬅️", "左"),
  slot(24, "small", "🎆", "煙火", "firework"),
  slot(25, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(26, "big", "🏮", "燈籠", "lantern"),
  slot(27, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(28, "once-more", "🅾️", "再來一次"),
  slot(29, "arrow", "⬆️", "上"),
  slot(30, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(31, "small", "🥮", "月餅", "mooncake"),
  slot(32, "arrow", "⬆️", "上"),
  slot(33, "fixed", "🍒", "櫻桃", "cherry", 2),
]

export const RING_SIZE_B2 = LITTLE_MARY_B2_RING.length
export const BOARD_COLS_B2 = 8
export const BOARD_ROWS_B2 = 11

export const BIG_CHASE_VALUES_B2 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_B2 = [10, 15, 20] as const

export const BAR_3_MIN_SPINS_B2 = 80
export const BAR_2_MIN_SPINS_B2 = 40

export const BONUS_MIN_WINS_B2 = 100
export const BONUS_WINDOW_WINS_B2 = 100
const BONUS_TRUE_CHANCE_B2 = 0.12
const BONUS_TEASE_CHANCE_B2 = 0.4

export const BONUS_ODD_MULTIPLIER_B2 = 10
export const BONUS_EVEN_MULTIPLIER_B2 = 5

export interface LittleMaryBonus2State {
  spinsSince3Bar: number
  spinsSince2Bar: number
  winsSinceBonus: number
}

export function createLittleMaryBonus2State(): LittleMaryBonus2State {
  return { spinsSince3Bar: 0, spinsSince2Bar: 0, winsSinceBonus: 0 }
}

function weightedPickB2(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_B2)
}

function weightedPickWithBarGateB2(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPickB2(rng)
    const s = LITTLE_MARY_B2_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPickB2(rng)
}

export interface LittleMaryBonus2SpinResult {
  stopIndex: number
  slot: LittleMaryBonus2Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  baseMultiplier: number
  basePayout: number
  bonusShown: boolean
  bonusDigits?: [number, number, number]
  bonusHit: boolean
  bonusMultiplier: number
  payout: number
  chaseValue?: number
  nextState: LittleMaryBonus2State
}

export function spinLittleMaryBonus2(
  bets: LittleMaryBonus2Bets,
  state: LittleMaryBonus2State,
  rng: () => number = Math.random,
): LittleMaryBonus2SpinResult {
  const staked = totalStakedB2(bets)
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  const stopIndex = weightedPickWithBarGateB2(
    rng,
    spinsSince3Bar >= BAR_3_MIN_SPINS_B2,
    spinsSince2Bar >= BAR_2_MIN_SPINS_B2,
  )
  const slotHit = LITTLE_MARY_B2_RING[stopIndex]

  if (slotHit.kind === "arrow") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "lose",
      totalStaked: staked,
      stakeUsed: 0,
      baseMultiplier: 0,
      basePayout: 0,
      bonusShown: false,
      bonusHit: false,
      bonusMultiplier: 1,
      payout: 0,
      nextState: { spinsSince3Bar, spinsSince2Bar, winsSinceBonus: state.winsSinceBonus },
    }
  }

  if (slotHit.kind === "once-more") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "once-more",
      totalStaked: staked,
      stakeUsed: 0,
      baseMultiplier: 0,
      basePayout: staked,
      bonusShown: false,
      bonusHit: false,
      bonusMultiplier: 1,
      payout: staked,
      nextState: { spinsSince3Bar: state.spinsSince3Bar, spinsSince2Bar: state.spinsSince2Bar, winsSinceBonus: state.winsSinceBonus },
    }
  }

  const stakeKey = slotHit.stakeKey!
  const stakeUsed = bets[stakeKey] ?? 0
  const isQualifyingGroup = slotHit.kind === "bar" || slotHit.kind === "big" || slotHit.kind === "small"
  const isWin = stakeUsed > 0

  let baseMultiplier = 0
  let chaseValue: number | undefined
  let next3Bar = spinsSince3Bar
  let next2Bar = spinsSince2Bar

  if (slotHit.kind === "bar" || slotHit.kind === "fixed") {
    baseMultiplier = slotHit.fixedMultiplier ?? 1
    if (slotHit.fixedMultiplier === 100) next3Bar = 0
    if (slotHit.fixedMultiplier === 50) next2Bar = 0
  } else {
    const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_B2 : SMALL_CHASE_VALUES_B2
    chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]
    baseMultiplier = chaseValue
  }

  const basePayout = stakeUsed * baseMultiplier

  let bonusShown = false
  let bonusHit = false
  let bonusMultiplier = 1
  let bonusDigits: [number, number, number] | undefined
  let winsSinceBonus = state.winsSinceBonus

  if (isQualifyingGroup && isWin) {
    winsSinceBonus += 1
    const windowOpen = winsSinceBonus >= BONUS_MIN_WINS_B2
    const forced = winsSinceBonus >= BONUS_MIN_WINS_B2 + BONUS_WINDOW_WINS_B2
    bonusHit = windowOpen && (forced || rng() < BONUS_TRUE_CHANCE_B2)
    bonusShown = bonusHit || rng() < BONUS_TEASE_CHANCE_B2

    if (bonusShown) {
      if (bonusHit) {
        const digit = Math.floor(rng() * 10)
        bonusDigits = [digit, digit, digit]
        bonusMultiplier = digit % 2 === 1 ? BONUS_ODD_MULTIPLIER_B2 : BONUS_EVEN_MULTIPLIER_B2
        winsSinceBonus = 0
      } else {
        const d1 = Math.floor(rng() * 10)
        let d2 = Math.floor(rng() * 10)
        if (d2 === d1) d2 = (d2 + 1 + Math.floor(rng() * 9)) % 10
        bonusDigits = [d1, d1, d2]
      }
    }
  }

  const payout = basePayout * bonusMultiplier

  return {
    stopIndex,
    slot: slotHit,
    outcome: isWin ? "win" : "lose",
    totalStaked: staked,
    stakeUsed,
    baseMultiplier,
    basePayout,
    bonusShown,
    bonusDigits,
    bonusHit,
    bonusMultiplier,
    payout,
    chaseValue,
    nextState: { spinsSince3Bar: next3Bar, spinsSince2Bar: next2Bar, winsSinceBonus },
  }
}

export function slotPositionB2(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_B2) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_B2
  if (afterTop < BOARD_ROWS_B2 - 2) {
    return { col: BOARD_COLS_B2 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_B2 - 2)
  if (afterRight < BOARD_COLS_B2) {
    return { col: BOARD_COLS_B2 - 1 - afterRight, row: BOARD_ROWS_B2 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_B2
  return { col: 0, row: BOARD_ROWS_B2 - 2 - afterBottom }
}
