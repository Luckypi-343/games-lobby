// 小瑪莉（8×8中空·甜點主題）純邏輯引擎。
// 跟第47台（海洋主題）完全相同的 8×8／28格規則與機率權重，只是換上甜點圖騰，
// 風格也改成糖果粉色調：大牌組 🎂／🍰／🧁，小牌組 🍩／🍪／🍬，普牌 🍭 棒棒糖固定 2 倍。
// BAR 家族、箭頭、ONCE MORE 全額退回規則都跟第47台一致。

export type LittleMary8SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMary8StakeKey = "bar" | "lollipop" | "cake" | "shortcake" | "cupcake" | "donut" | "cookie" | "candy"

export interface StakeInfo8 {
  key: LittleMary8StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_8: StakeInfo8[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "cake", glyph: "🎂", label: "蛋糕", group: "big" },
  { key: "shortcake", glyph: "🍰", label: "草莓蛋糕", group: "big" },
  { key: "cupcake", glyph: "🧁", label: "杯子蛋糕", group: "big" },
  { key: "donut", glyph: "🍩", label: "甜甜圈", group: "small" },
  { key: "cookie", glyph: "🍪", label: "餅乾", group: "small" },
  { key: "candy", glyph: "🍬", label: "糖果", group: "small" },
  { key: "lollipop", glyph: "🍭", label: "棒棒糖", group: "fixed" },
]

export type LittleMary8Bets = Record<LittleMary8StakeKey, number>

export function createEmptyBets8(defaultValue = 0): LittleMary8Bets {
  const bets = {} as LittleMary8Bets
  for (const s of STAKE_SYMBOLS_8) bets[s.key] = defaultValue
  return bets
}

export function totalStaked8(bets: LittleMary8Bets): number {
  return STAKE_SYMBOLS_8.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary8Slot {
  index: number
  kind: LittleMary8SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary8StakeKey
}

function slot(
  index: number,
  kind: LittleMary8SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary8StakeKey,
  fixedMultiplier?: number,
): LittleMary8Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

export const LITTLE_MARY_8_RING: LittleMary8Slot[] = [
  // 頂排 8 格
  slot(0, "small", "🍩", "甜甜圈", "donut"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🍬", "糖果", "candy"),
  // 右欄 6 格（上→下，不含上下角）
  slot(8, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  slot(9, "big", "🧁", "杯子蛋糕", "cupcake"),
  slot(10, "once-more", "🅾️", "再來一次"),
  slot(11, "arrow", "⬇️", "下"),
  slot(12, "small", "🍪", "餅乾", "cookie"),
  slot(13, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  // 底排 8 格（右→左）
  slot(14, "small", "🍩", "甜甜圈", "donut"),
  slot(15, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  slot(16, "arrow", "⬅️", "左"),
  slot(17, "big", "🎂", "蛋糕", "cake"),
  slot(18, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  slot(19, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(20, "arrow", "⬅️", "左"),
  slot(21, "small", "🍬", "糖果", "candy"),
  // 左欄 6 格（下→上，不含上下角）
  slot(22, "fixed", "🍭", "棒棒糖", "lollipop", 2),
  slot(23, "big", "🍰", "草莓蛋糕", "shortcake"),
  slot(24, "once-more", "🅾️", "再來一次"),
  slot(25, "arrow", "⬆️", "上"),
  slot(26, "small", "🍪", "餅乾", "cookie"),
  slot(27, "fixed", "🍭", "棒棒糖", "lollipop", 2),
]

export const RING_SIZE_8 = LITTLE_MARY_8_RING.length
export const BOARD_COLS_8 = 8
export const BOARD_ROWS_8 = 8

export const BIG_CHASE_VALUES_8 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_8 = [10, 15, 20] as const
export const BIG_JP_MULTIPLIER_8 = 100
export const SMALL_JP_MULTIPLIER_8 = 50

export const JP_MIN_SPINS_8 = 70
const JP_ARM_CHANCE_PER_SPIN_8 = 0.24

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_8 = 80
export const BAR_2_MIN_SPINS_8 = 40

export interface LittleMary8State {
  spinsSinceJp: number
  jpArmed: boolean
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary8State(): LittleMary8State {
  return { spinsSinceJp: 0, jpArmed: false, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick8(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_8)
}

function weightedPick8WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick8(rng)
    const s = LITTLE_MARY_8_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick8(rng)
}

export interface LittleMary8SpinResult {
  stopIndex: number
  slot: LittleMary8Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  chaseValue?: number
  nextState: LittleMary8State
}

export function spinLittleMary8(
  bets: LittleMary8Bets,
  state: LittleMary8State,
  rng: () => number = Math.random,
): LittleMary8SpinResult {
  const staked = totalStaked8(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  const jpArmed = state.jpArmed || (spinsSinceJp >= JP_MIN_SPINS_8 && rng() < JP_ARM_CHANCE_PER_SPIN_8)
  const stopIndex = weightedPick8WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_8, spinsSince2Bar >= BAR_2_MIN_SPINS_8)
  const slotHit = LITTLE_MARY_8_RING[stopIndex]

  if (slotHit.kind === "arrow") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "lose",
      totalStaked: staked,
      stakeUsed: 0,
      multiplier: 0,
      payout: 0,
      wasJpSpin: jpArmed,
      jpHit: false,
      nextState: { spinsSinceJp, jpArmed, spinsSince3Bar, spinsSince2Bar },
    }
  }

  if (slotHit.kind === "once-more") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "once-more",
      totalStaked: staked,
      stakeUsed: 0,
      multiplier: 0,
      payout: staked,
      wasJpSpin: jpArmed,
      jpHit: false,
      nextState: { spinsSinceJp: state.spinsSinceJp, jpArmed, spinsSince3Bar: state.spinsSince3Bar, spinsSince2Bar: state.spinsSince2Bar },
    }
  }

  const stakeKey = slotHit.stakeKey!
  const stakeUsed = bets[stakeKey] ?? 0

  if (slotHit.kind === "bar" || slotHit.kind === "fixed") {
    const multiplier = slotHit.fixedMultiplier ?? 1
    const next3Bar = multiplier === 100 ? 0 : spinsSince3Bar
    const next2Bar = multiplier === 50 ? 0 : spinsSince2Bar
    return {
      stopIndex,
      slot: slotHit,
      outcome: stakeUsed > 0 ? "win" : "lose",
      totalStaked: staked,
      stakeUsed,
      multiplier,
      payout: stakeUsed * multiplier,
      wasJpSpin: jpArmed,
      jpHit: false,
      nextState: { spinsSinceJp, jpArmed, spinsSince3Bar: next3Bar, spinsSince2Bar: next2Bar },
    }
  }

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_8 : SMALL_CHASE_VALUES_8
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]
  const jpHit = jpArmed && stakeUsed > 0
  const multiplier = jpHit ? (slotHit.kind === "big" ? BIG_JP_MULTIPLIER_8 : SMALL_JP_MULTIPLIER_8) : chaseValue

  return {
    stopIndex,
    slot: slotHit,
    outcome: stakeUsed > 0 ? "win" : "lose",
    totalStaked: staked,
    stakeUsed,
    multiplier,
    payout: stakeUsed * multiplier,
    chaseValue,
    wasJpSpin: jpArmed,
    jpHit,
    nextState: jpHit
      ? { spinsSinceJp: 0, jpArmed: false, spinsSince3Bar, spinsSince2Bar }
      : { spinsSinceJp, jpArmed, spinsSince3Bar, spinsSince2Bar },
  }
}

export function slotPosition8(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_8) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_8
  if (afterTop < BOARD_ROWS_8 - 2) {
    return { col: BOARD_COLS_8 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_8 - 2)
  if (afterRight < BOARD_COLS_8) {
    return { col: BOARD_COLS_8 - 1 - afterRight, row: BOARD_ROWS_8 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_8
  return { col: 0, row: BOARD_ROWS_8 - 2 - afterBottom }
}
