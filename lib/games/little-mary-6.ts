// 傳統麻台（第二代·鳳凰版·飲品主題）純邏輯引擎。
// 完全複製第 45 台（little-mary-5.ts）的規則、機率權重、JP 累積倍率、ONCE MORE 全額退回、
// 左右 🅾️ 掃光裝飾機制，只替換圖騰：大牌組 🫖／🍯／🧉，小牌組 🍧／🍺／🍷，普牌 🍹 取代櫻桃。

export type LittleMary6SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMary6StakeKey =
  | "bar"
  | "cocktail"
  | "apple"
  | "teapot"
  | "honey"
  | "mate"
  | "shavedice"
  | "beer"
  | "wine"

export interface StakeInfo6 {
  key: LittleMary6StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_6: StakeInfo6[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "teapot", glyph: "🫖", label: "茶壺", group: "big" },
  { key: "honey", glyph: "🍯", label: "蜂蜜", group: "big" },
  { key: "mate", glyph: "🧉", label: "瑪黛茶", group: "big" },
  { key: "shavedice", glyph: "🍧", label: "剉冰", group: "small" },
  { key: "beer", glyph: "🍺", label: "啤酒", group: "small" },
  { key: "wine", glyph: "🍷", label: "紅酒", group: "small" },
  { key: "apple", glyph: "🍎", label: "蘋果", group: "fixed" },
  { key: "cocktail", glyph: "🍹", label: "調酒", group: "fixed" },
]

export type LittleMary6Bets = Record<LittleMary6StakeKey, number>

export function createEmptyBets6(defaultValue = 0): LittleMary6Bets {
  const bets = {} as LittleMary6Bets
  for (const s of STAKE_SYMBOLS_6) bets[s.key] = defaultValue
  return bets
}

export function totalStaked6(bets: LittleMary6Bets): number {
  return STAKE_SYMBOLS_6.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary6Slot {
  index: number
  kind: LittleMary6SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary6StakeKey
}

function slot(
  index: number,
  kind: LittleMary6SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary6StakeKey,
  fixedMultiplier?: number,
): LittleMary6Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

export const LITTLE_MARY_6_RING: LittleMary6Slot[] = [
  slot(0, "small", "🍧", "剉冰", "shavedice"),
  slot(1, "fixed", "🍎", "蘋果", "apple", 5),
  slot(2, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(6, "fixed", "🍎", "蘋果", "apple", 5),
  slot(7, "small", "🍷", "紅酒", "wine"),
  slot(8, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(9, "big", "🍯", "蜂蜜", "honey"),
  slot(10, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(11, "once-more", "🅾️", "再來一次（右）"),
  slot(12, "fixed", "🍎", "蘋果", "apple", 5),
  slot(13, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(14, "small", "🍺", "啤酒", "beer"),
  slot(15, "fixed", "🍎", "蘋果", "apple", 5),
  slot(16, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(17, "small", "🍧", "剉冰", "shavedice"),
  slot(18, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(19, "fixed", "🍎", "蘋果", "apple", 5),
  slot(20, "big", "🫖", "茶壺", "teapot"),
  slot(21, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "fixed", "🍎", "蘋果", "apple", 5),
  slot(24, "small", "🍷", "紅酒", "wine"),
  slot(25, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(26, "big", "🧉", "瑪黛茶", "mate"),
  slot(27, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(28, "once-more", "🅾️", "再來一次（左）"),
  slot(29, "fixed", "🍎", "蘋果", "apple", 5),
  slot(30, "fixed", "🍹", "調酒", "cocktail", 2),
  slot(31, "small", "🍺", "啤酒", "beer"),
  slot(32, "fixed", "🍎", "蘋果", "apple", 5),
  slot(33, "fixed", "🍹", "調酒", "cocktail", 2),
]

export const RING_SIZE_6 = LITTLE_MARY_6_RING.length
export const BOARD_COLS_6 = 8
export const BOARD_ROWS_6 = 11

export const BIG_CHASE_VALUES_6 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_6 = [10, 15, 20] as const
export const BIG_JP_MULTIPLIER_6 = 100
export const SMALL_JP_MULTIPLIER_6 = 50

export const JP_MIN_SPINS_6 = 80
export const JP_WINDOW_SPINS_6 = 50
const JP_TRIGGER_CHANCE_PER_SPIN_6 = 0.12

const LEFT_ONCE_MORE_INDEX_6 = 28
const RIGHT_ONCE_MORE_INDEX_6 = 11
const ECHO_BAR_CHANCE_6 = 0.25

function pickOnceMoreEcho6(stopIndex: number, rng: () => number): number[] {
  const isLeft = stopIndex === LEFT_ONCE_MORE_INDEX_6
  const dominantKind: LittleMary6SymbolKind = isLeft ? "big" : "small"
  const dominantSlots = LITTLE_MARY_6_RING.filter((s) => s.kind === dominantKind).map((s) => s.index)
  // 左🅾️：3BAR(×100)、2BAR(×50)皆可掃到；右🅾️：只有3BAR(×100)可掃到，不含單條BAR。
  const barSlots = LITTLE_MARY_6_RING.filter(
    (s) =>
      s.kind === "bar" &&
      (isLeft ? s.fixedMultiplier === 100 || s.fixedMultiplier === 50 : s.fixedMultiplier === 100),
  ).map((s) => s.index)
  // 調酒（2倍）、蘋果（5倍）這兩種普獎不分左右，一律有機會被掃到，陪襯大牌／小牌為主的裝飾效果。
  const commonSlots = LITTLE_MARY_6_RING.filter((s) => s.stakeKey === "cocktail" || s.stakeKey === "apple").map(
    (s) => s.index,
  )
  const count = 2 + Math.floor(rng() * 5)
  const echoed: number[] = []
  for (let i = 0; i < count; i++) {
    const roll = rng()
    const pool = roll < ECHO_BAR_CHANCE_6 ? barSlots : roll < ECHO_BAR_CHANCE_6 + 0.3 ? commonSlots : dominantSlots
    echoed.push(pool[Math.floor(rng() * pool.length)])
  }
  return echoed
}

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_6 = 80
export const BAR_2_MIN_SPINS_6 = 40

export interface LittleMary6State {
  spinsSinceJp: number
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary6State(): LittleMary6State {
  return { spinsSinceJp: 0, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick6(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_6)
}

function weightedPick6WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick6(rng)
    const s = LITTLE_MARY_6_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick6(rng)
}

/** 觸發預告中大獎時，游標閃停位置不再只是裝飾：依照該格押注，直接按大牌/小牌JP倍率或自身固定倍率給獎。 */
function echoPayout6(echoed: number[], bets: LittleMary6Bets): number {
  let total = 0
  for (const idx of echoed) {
    const s = LITTLE_MARY_6_RING[idx]
    if (!s.stakeKey) continue
    const staked = bets[s.stakeKey] ?? 0
    if (staked <= 0) continue
    if (s.kind === "bar" || s.kind === "fixed") {
      total += staked * (s.fixedMultiplier ?? 1)
    } else if (s.kind === "big") {
      total += staked * BIG_JP_MULTIPLIER_6
    } else if (s.kind === "small") {
      total += staked * SMALL_JP_MULTIPLIER_6
    }
  }
  return total
}

export interface LittleMary6SpinResult {
  stopIndex: number
  slot: LittleMary6Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  chaseValue?: number
  onceMoreEcho?: number[]
  nextState: LittleMary6State
}

export function spinLittleMary6(
  bets: LittleMary6Bets,
  state: LittleMary6State,
  rng: () => number = Math.random,
): LittleMary6SpinResult {
  const staked = totalStaked6(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  // 觸發與落點在同一轉決定：累積轉數到門檻後，每次啟動才有機會觸發，一旦觸發這一轉就必定停在左或右的ONCE MORE。
  const jpWindowOpen6 = spinsSinceJp >= JP_MIN_SPINS_6
  const jpForced6 = spinsSinceJp >= JP_MIN_SPINS_6 + JP_WINDOW_SPINS_6
  const triggered = jpWindowOpen6 && (jpForced6 || rng() < JP_TRIGGER_CHANCE_PER_SPIN_6)
  const stopIndex = triggered
    ? rng() < 0.5
      ? LEFT_ONCE_MORE_INDEX_6
      : RIGHT_ONCE_MORE_INDEX_6
    : weightedPick6WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_6, spinsSince2Bar >= BAR_2_MIN_SPINS_6)
  const slotHit = LITTLE_MARY_6_RING[stopIndex]

  if (slotHit.kind === "arrow") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "lose",
      totalStaked: staked,
      stakeUsed: 0,
      multiplier: 0,
      payout: 0,
      wasJpSpin: false,
      jpHit: false,
      nextState: { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
    }
  }

  if (slotHit.kind === "once-more") {
    const echoed = pickOnceMoreEcho6(stopIndex, rng)
    if (triggered) {
      // 游標閃停的這2～6個燈位不再只是裝飾，直接依各自押注與倍率送獎，燈號持續閃爍到下一輪啟動。
      const payout = echoPayout6(echoed, bets)
      const jpHit = payout > 0
      return {
        stopIndex,
        slot: slotHit,
        outcome: jpHit ? "win" : "lose",
        totalStaked: staked,
        stakeUsed: staked,
        multiplier: 0,
        payout,
        wasJpSpin: true,
        jpHit,
        onceMoreEcho: echoed,
        nextState: jpHit
          ? { spinsSinceJp: 0, spinsSince3Bar, spinsSince2Bar }
          : { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
      }
    }
    return {
      stopIndex,
      slot: slotHit,
      outcome: "once-more",
      totalStaked: staked,
      stakeUsed: 0,
      multiplier: 0,
      payout: staked,
      wasJpSpin: false,
      jpHit: false,
      onceMoreEcho: echoed,
      nextState: { spinsSinceJp: state.spinsSinceJp, spinsSince3Bar: state.spinsSince3Bar, spinsSince2Bar: state.spinsSince2Bar },
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
      wasJpSpin: false,
      jpHit: false,
      nextState: { spinsSinceJp, spinsSince3Bar: next3Bar, spinsSince2Bar: next2Bar },
    }
  }

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_6 : SMALL_CHASE_VALUES_6
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]

  return {
    stopIndex,
    slot: slotHit,
    outcome: stakeUsed > 0 ? "win" : "lose",
    totalStaked: staked,
    stakeUsed,
    multiplier: chaseValue,
    payout: stakeUsed * chaseValue,
    chaseValue,
    wasJpSpin: false,
    jpHit: false,
    nextState: { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
  }
}

export function slotPosition6(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_6) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_6
  if (afterTop < BOARD_ROWS_6 - 2) {
    return { col: BOARD_COLS_6 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_6 - 2)
  if (afterRight < BOARD_COLS_6) {
    return { col: BOARD_COLS_6 - 1 - afterRight, row: BOARD_ROWS_6 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_6
  return { col: 0, row: BOARD_ROWS_6 - 2 - afterBottom }
}
