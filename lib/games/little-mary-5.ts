// 傳統麻台（第二代·鳳凰版）純邏輯引擎。
// 完全複製第一代（little-mary.ts）的規則與運轉機制（圖騰、機率權重、JP 累積倍率、ONCE MORE 全額退回），
// 唯一新增的是：轉停在「左邊」🅾️（index 28）或「右邊」🅾️（index 11）時，
// 會額外產生一串「游標快速掃過」的裝飾燈位（2～6個），左邊以大牌組為主、右邊以小牌組為主，
// 偶爾也會掃到三種 BAR，每個被掃到的燈位會保留光圈，直到下一輪轉動才恢復正常（純裝飾，不影響派彩）。

export type LittleMary5SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMary5StakeKey =
  | "bar"
  | "cherry"
  | "apple"
  | "seven"
  | "star"
  | "watermelon"
  | "bell"
  | "honeydew"
  | "lemon"

export interface StakeInfo5 {
  key: LittleMary5StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_5: StakeInfo5[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "seven", glyph: "77", label: "77", group: "big" },
  { key: "star", glyph: "⭐️", label: "星星", group: "big" },
  { key: "watermelon", glyph: "🍉", label: "西瓜", group: "big" },
  { key: "bell", glyph: "🔔", label: "鈴鐺", group: "small" },
  { key: "honeydew", glyph: "🍈", label: "香瓜", group: "small" },
  { key: "lemon", glyph: "🍋", label: "檸檬", group: "small" },
  { key: "apple", glyph: "🍎", label: "蘋果", group: "fixed" },
  { key: "cherry", glyph: "🍒", label: "櫻桃", group: "fixed" },
]

export type LittleMary5Bets = Record<LittleMary5StakeKey, number>

export function createEmptyBets5(defaultValue = 0): LittleMary5Bets {
  const bets = {} as LittleMary5Bets
  for (const s of STAKE_SYMBOLS_5) bets[s.key] = defaultValue
  return bets
}

export function totalStaked5(bets: LittleMary5Bets): number {
  return STAKE_SYMBOLS_5.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary5Slot {
  index: number
  kind: LittleMary5SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary5StakeKey
}

function slot(
  index: number,
  kind: LittleMary5SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary5StakeKey,
  fixedMultiplier?: number,
): LittleMary5Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

export const LITTLE_MARY_5_RING: LittleMary5Slot[] = [
  slot(0, "small", "🔔", "鈴鐺", "bell"),
  slot(1, "fixed", "🍎", "蘋果", "apple", 5),
  slot(2, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(6, "fixed", "🍎", "蘋果", "apple", 5),
  slot(7, "small", "🍋", "檸檬", "lemon"),
  slot(8, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(9, "big", "🍉", "西瓜", "watermelon"),
  slot(10, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(11, "once-more", "🅾️", "再來一次（右）"),
  slot(12, "fixed", "🍎", "蘋果", "apple", 5),
  slot(13, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(14, "small", "🍈", "香瓜", "honeydew"),
  slot(15, "fixed", "🍎", "蘋果", "apple", 5),
  slot(16, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(17, "small", "🔔", "鈴鐺", "bell"),
  slot(18, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(19, "fixed", "🍎", "蘋果", "apple", 5),
  slot(20, "big", "77", "77", "seven"),
  slot(21, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "fixed", "🍎", "蘋果", "apple", 5),
  slot(24, "small", "🍋", "檸檬", "lemon"),
  slot(25, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(26, "big", "⭐️", "星星", "star"),
  slot(27, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(28, "once-more", "🅾️", "再來一次（左）"),
  slot(29, "fixed", "🍎", "蘋果", "apple", 5),
  slot(30, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(31, "small", "🍈", "香瓜", "honeydew"),
  slot(32, "fixed", "🍎", "蘋果", "apple", 5),
  slot(33, "fixed", "🍒", "櫻桃", "cherry", 2),
]

export const RING_SIZE_5 = LITTLE_MARY_5_RING.length
export const BOARD_COLS_5 = 8
export const BOARD_ROWS_5 = 11

export const BIG_CHASE_VALUES_5 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_5 = [10, 15, 20] as const
export const BIG_JP_MULTIPLIER_5 = 100
export const SMALL_JP_MULTIPLIER_5 = 50

export const JP_MIN_SPINS_5 = 80
export const JP_WINDOW_SPINS_5 = 50
const JP_TRIGGER_CHANCE_PER_SPIN_5 = 0.12

/** 左邊 🅾️ = index 28（面板左欄），右邊 🅾️ = index 11（面板右欄）。 */
const LEFT_ONCE_MORE_INDEX = 28
const RIGHT_ONCE_MORE_INDEX = 11
const ECHO_BAR_CHANCE = 0.25

function pickOnceMoreEcho(stopIndex: number, rng: () => number): number[] {
  const isLeft = stopIndex === LEFT_ONCE_MORE_INDEX
  const dominantKind: LittleMary5SymbolKind = isLeft ? "big" : "small"
  const dominantSlots = LITTLE_MARY_5_RING.filter((s) => s.kind === dominantKind).map((s) => s.index)
  // 左🅾️：3BAR(×100)、2BAR(×50)皆可掃到；右🅾️：只有3BAR(×100)可掃到，不含單條BAR。
  const barSlots = LITTLE_MARY_5_RING.filter(
    (s) =>
      s.kind === "bar" &&
      (isLeft ? s.fixedMultiplier === 100 || s.fixedMultiplier === 50 : s.fixedMultiplier === 100),
  ).map((s) => s.index)
  // 櫻桃（2倍）、蘋果（5倍）這兩種普獎不分左右，一律有機會被掃到，陪襯大牌／小牌為主的裝飾效果。
  const commonSlots = LITTLE_MARY_5_RING.filter((s) => s.stakeKey === "cherry" || s.stakeKey === "apple").map(
    (s) => s.index,
  )
  const count = 2 + Math.floor(rng() * 5) // 2～6 個
  const echoed: number[] = []
  for (let i = 0; i < count; i++) {
    const roll = rng()
    const pool = roll < ECHO_BAR_CHANCE ? barSlots : roll < ECHO_BAR_CHANCE + 0.3 ? commonSlots : dominantSlots
    echoed.push(pool[Math.floor(rng() * pool.length)])
  }
  return echoed
}

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_5 = 80
export const BAR_2_MIN_SPINS_5 = 40

export interface LittleMary5State {
  spinsSinceJp: number
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary5State(): LittleMary5State {
  return { spinsSinceJp: 0, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick5(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_5)
}

function weightedPick5WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick5(rng)
    const s = LITTLE_MARY_5_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick5(rng)
}

/** 觸發預告中大獎時，游標閃停位置不再只是裝飾：依照該格押注，直接按大牌/小牌JP倍率或自身固定倍率給獎。 */
function echoPayout5(echoed: number[], bets: LittleMary5Bets): number {
  let total = 0
  for (const idx of echoed) {
    const s = LITTLE_MARY_5_RING[idx]
    if (!s.stakeKey) continue
    const staked = bets[s.stakeKey] ?? 0
    if (staked <= 0) continue
    if (s.kind === "bar" || s.kind === "fixed") {
      total += staked * (s.fixedMultiplier ?? 1)
    } else if (s.kind === "big") {
      total += staked * BIG_JP_MULTIPLIER_5
    } else if (s.kind === "small") {
      total += staked * SMALL_JP_MULTIPLIER_5
    }
  }
  return total
}

export interface LittleMary5SpinResult {
  stopIndex: number
  slot: LittleMary5Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  chaseValue?: number
  /** 只有停在 🅾️ 時才會有值：裝飾用的「掃過燈位」清單，依面板順序保留光圈直到下一輪轉動。 */
  onceMoreEcho?: number[]
  nextState: LittleMary5State
}

export function spinLittleMary5(
  bets: LittleMary5Bets,
  state: LittleMary5State,
  rng: () => number = Math.random,
): LittleMary5SpinResult {
  const staked = totalStaked5(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  // 觸發與落點在同一轉決定：累積轉數到門檻後，每次啟動才有機會觸發，一旦觸發這一轉就必定停在左或右的ONCE MORE。
  const jpWindowOpen5 = spinsSinceJp >= JP_MIN_SPINS_5
  const jpForced5 = spinsSinceJp >= JP_MIN_SPINS_5 + JP_WINDOW_SPINS_5
  const triggered = jpWindowOpen5 && (jpForced5 || rng() < JP_TRIGGER_CHANCE_PER_SPIN_5)
  const stopIndex = triggered
    ? rng() < 0.5
      ? LEFT_ONCE_MORE_INDEX
      : RIGHT_ONCE_MORE_INDEX
    : weightedPick5WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_5, spinsSince2Bar >= BAR_2_MIN_SPINS_5)
  const slotHit = LITTLE_MARY_5_RING[stopIndex]

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
    const echoed = pickOnceMoreEcho(stopIndex, rng)
    if (triggered) {
      // 游標閃停的這2～6個燈位不再只是裝飾，直接依各自押注與倍率送獎，燈號持續閃爍到下一輪啟動。
      const payout = echoPayout5(echoed, bets)
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

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_5 : SMALL_CHASE_VALUES_5
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

export function slotPosition5(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_5) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_5
  if (afterTop < BOARD_ROWS_5 - 2) {
    return { col: BOARD_COLS_5 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_5 - 2)
  if (afterRight < BOARD_COLS_5) {
    return { col: BOARD_COLS_5 - 1 - afterRight, row: BOARD_ROWS_5 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_5
  return { col: 0, row: BOARD_ROWS_5 - 2 - afterBottom }
}
