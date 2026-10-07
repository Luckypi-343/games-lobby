// 小瑪莉（8×8中空·海洋主題）純邏輯引擎。
// 燈位排成一圈「橫8格×直8格」中空方框（頂、底各8格，左、右各6格，角落共用），
// 共 28 個燈位，比第一代（8×11／34格）更迷你，但運轉規則完全相同：
// 玩家對 8 種圖案各自分別下注，啟動時一次扣掉全部押注總和。方框游標順時鐘快轉三圈、
// 再緩轉半圈到一圈半才停止。停在箭頭 = 全輸；停在 ONCE MORE = 不扣分、全額退回、免費重轉一次；
// 停在某個圖案 = 只有「該圖案自己的押注」依其賠率出彩。
// BAR 類（🆎／🅰️／🅱️）共用同一筆「BAR」押注；大牌組（🦈／🐳／🐬）與小牌組（🐠／🦀／🐚）
// 依跑燈當下數值給浮動倍率，JP 場次則改發固定高倍；普牌 🫧 氣泡固定 2 倍（取代櫻桃）。

export type LittleMary7SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMary7StakeKey = "bar" | "bubble" | "shark" | "whale" | "dolphin" | "fish" | "crab" | "shell"

export interface StakeInfo7 {
  key: LittleMary7StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_7: StakeInfo7[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "shark", glyph: "🦈", label: "鯊魚", group: "big" },
  { key: "whale", glyph: "🐳", label: "鯨魚", group: "big" },
  { key: "dolphin", glyph: "🐬", label: "海豚", group: "big" },
  { key: "fish", glyph: "🐠", label: "熱帶魚", group: "small" },
  { key: "crab", glyph: "🦀", label: "螃蟹", group: "small" },
  { key: "shell", glyph: "🐚", label: "貝殼", group: "small" },
  { key: "bubble", glyph: "🫧", label: "氣泡", group: "fixed" },
]

export type LittleMary7Bets = Record<LittleMary7StakeKey, number>

export function createEmptyBets7(defaultValue = 0): LittleMary7Bets {
  const bets = {} as LittleMary7Bets
  for (const s of STAKE_SYMBOLS_7) bets[s.key] = defaultValue
  return bets
}

export function totalStaked7(bets: LittleMary7Bets): number {
  return STAKE_SYMBOLS_7.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary7Slot {
  index: number
  kind: LittleMary7SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary7StakeKey
}

function slot(
  index: number,
  kind: LittleMary7SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary7StakeKey,
  fixedMultiplier?: number,
): LittleMary7Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

// 排列順序：頂排(左→右) → 右欄(上→下) → 底排(右→左) → 左欄(下→上)，順時鐘。
export const LITTLE_MARY_7_RING: LittleMary7Slot[] = [
  // 頂排 8 格
  slot(0, "small", "🐠", "熱帶魚", "fish"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🫧", "氣泡", "bubble", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🫧", "氣泡", "bubble", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🐚", "貝殼", "shell"),
  // 右欄 6 格（上→下，不含上下角）
  slot(8, "fixed", "🫧", "氣泡", "bubble", 2),
  slot(9, "big", "🐬", "海豚", "dolphin"),
  slot(10, "once-more", "🅾️", "再來一次"),
  slot(11, "arrow", "⬇️", "下"),
  slot(12, "small", "🦀", "螃蟹", "crab"),
  slot(13, "fixed", "🫧", "氣泡", "bubble", 2),
  // 底排 8 格（右→左）
  slot(14, "small", "🐠", "熱帶魚", "fish"),
  slot(15, "fixed", "🫧", "氣泡", "bubble", 2),
  slot(16, "arrow", "⬅️", "左"),
  slot(17, "big", "🦈", "鯊魚", "shark"),
  slot(18, "fixed", "🫧", "氣泡", "bubble", 2),
  slot(19, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(20, "arrow", "⬅️", "左"),
  slot(21, "small", "🐚", "貝殼", "shell"),
  // 左欄 6 格（下→上，不含上下角）
  slot(22, "fixed", "🫧", "氣泡", "bubble", 2),
  slot(23, "big", "🐳", "鯨魚", "whale"),
  slot(24, "once-more", "🅾️", "再來一次"),
  slot(25, "arrow", "⬆️", "上"),
  slot(26, "small", "🦀", "螃蟹", "crab"),
  slot(27, "fixed", "🫧", "氣泡", "bubble", 2),
]

export const RING_SIZE_7 = LITTLE_MARY_7_RING.length
export const BOARD_COLS_7 = 8
export const BOARD_ROWS_7 = 8

export const BIG_CHASE_VALUES_7 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_7 = [10, 15, 20] as const
export const BIG_JP_MULTIPLIER_7 = 100
export const SMALL_JP_MULTIPLIER_7 = 50

export const JP_MIN_SPINS_7 = 70
const JP_ARM_CHANCE_PER_SPIN_7 = 0.24

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_7 = 80
export const BAR_2_MIN_SPINS_7 = 40

export interface LittleMary7State {
  spinsSinceJp: number
  jpArmed: boolean
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary7State(): LittleMary7State {
  return { spinsSinceJp: 0, jpArmed: false, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick7(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_7)
}

function weightedPick7WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick7(rng)
    const s = LITTLE_MARY_7_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick7(rng)
}

export interface LittleMary7SpinResult {
  stopIndex: number
  slot: LittleMary7Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  chaseValue?: number
  nextState: LittleMary7State
}

export function spinLittleMary7(
  bets: LittleMary7Bets,
  state: LittleMary7State,
  rng: () => number = Math.random,
): LittleMary7SpinResult {
  const staked = totalStaked7(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  const jpArmed = state.jpArmed || (spinsSinceJp >= JP_MIN_SPINS_7 && rng() < JP_ARM_CHANCE_PER_SPIN_7)
  const stopIndex = weightedPick7WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_7, spinsSince2Bar >= BAR_2_MIN_SPINS_7)
  const slotHit = LITTLE_MARY_7_RING[stopIndex]

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

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_7 : SMALL_CHASE_VALUES_7
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]
  const jpHit = jpArmed && stakeUsed > 0
  const multiplier = jpHit ? (slotHit.kind === "big" ? BIG_JP_MULTIPLIER_7 : SMALL_JP_MULTIPLIER_7) : chaseValue

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

/** 面板座標：回傳每個燈位在 8×8 中空方框上的 (col, row)，0-based。 */
export function slotPosition7(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_7) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_7
  if (afterTop < BOARD_ROWS_7 - 2) {
    return { col: BOARD_COLS_7 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_7 - 2)
  if (afterRight < BOARD_COLS_7) {
    return { col: BOARD_COLS_7 - 1 - afterRight, row: BOARD_ROWS_7 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_7
  return { col: 0, row: BOARD_ROWS_7 - 2 - afterBottom }
}
