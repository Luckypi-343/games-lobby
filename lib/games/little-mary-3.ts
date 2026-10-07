// 傳統麻台（第二代·花朵JP主題）純邏輯引擎。
// 圖騰、燈位排列、機率權重、ONCE MORE 全額退回規則，完全複製第一代（little-mary.ts）。
// 唯一不同：JP 圖案從「JP」文字改成🌺🌺🌺三朵花，且 JP 命中時改發「三元」獎（大三元／小三元），
// 不再是固定倍率的單押注 JP：三朵花同時亮起，代表大牌組（77／⭐️／🍉）或小牌組（🔔／🍈／🍋）
// 三個圖案「全部同時中獎」，總獎金 = (三個圖案各自押注之和) × (跑燈停止倍數 × 3)。

export type LittleMary3SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMary3StakeKey = "bar" | "cherry" | "seven" | "star" | "watermelon" | "bell" | "honeydew" | "lemon"

export interface StakeInfo3 {
  key: LittleMary3StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_3: StakeInfo3[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "seven", glyph: "77", label: "77", group: "big" },
  { key: "star", glyph: "⭐️", label: "星星", group: "big" },
  { key: "watermelon", glyph: "🍉", label: "西瓜", group: "big" },
  { key: "bell", glyph: "🔔", label: "鈴鐺", group: "small" },
  { key: "honeydew", glyph: "🍈", label: "香瓜", group: "small" },
  { key: "lemon", glyph: "🍋", label: "檸檬", group: "small" },
  { key: "cherry", glyph: "🍒", label: "櫻桃", group: "fixed" },
]

export type LittleMary3Bets = Record<LittleMary3StakeKey, number>

export function createEmptyBets3(defaultValue = 0): LittleMary3Bets {
  const bets = {} as LittleMary3Bets
  for (const s of STAKE_SYMBOLS_3) bets[s.key] = defaultValue
  return bets
}

export function totalStaked3(bets: LittleMary3Bets): number {
  return STAKE_SYMBOLS_3.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary3Slot {
  index: number
  kind: LittleMary3SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary3StakeKey
}

function slot(
  index: number,
  kind: LittleMary3SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary3StakeKey,
  fixedMultiplier?: number,
): LittleMary3Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

export const LITTLE_MARY_3_RING: LittleMary3Slot[] = [
  slot(0, "small", "🔔", "鈴鐺", "bell"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🍋", "檸檬", "lemon"),
  slot(8, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(9, "big", "🍉", "西瓜", "watermelon"),
  slot(10, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(11, "once-more", "🅾️", "再來一次"),
  slot(12, "arrow", "⬇️", "下"),
  slot(13, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(14, "small", "🍈", "香瓜", "honeydew"),
  slot(15, "arrow", "⬇️", "下"),
  slot(16, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(17, "small", "🔔", "鈴鐺", "bell"),
  slot(18, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(19, "arrow", "⬅️", "左"),
  slot(20, "big", "77", "77", "seven"),
  slot(21, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "arrow", "⬅️", "左"),
  slot(24, "small", "🍋", "檸檬", "lemon"),
  slot(25, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(26, "big", "⭐️", "星星", "star"),
  slot(27, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(28, "once-more", "🅾️", "再來一次"),
  slot(29, "arrow", "⬆️", "上"),
  slot(30, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(31, "small", "🍈", "香瓜", "honeydew"),
  slot(32, "arrow", "⬆️", "上"),
  slot(33, "fixed", "🍒", "櫻桃", "cherry", 2),
]

export const RING_SIZE_3 = LITTLE_MARY_3_RING.length
export const BOARD_COLS_3 = 8
export const BOARD_ROWS_3 = 11

export const BIG_CHASE_VALUES_3 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_3 = [10, 15, 20] as const
/** 三元獎的總倍數 = 跑燈停止倍數 × 3（取代第一代固定100／50倍的單押注JP）。 */
export const TRIPLET_FACTOR_3 = 3

export const JP_MIN_SPINS_3 = 80
export const JP_WINDOW_SPINS_3 = 50
const JP_TRIGGER_CHANCE_PER_SPIN_3 = 0.12

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_3 = 80
export const BAR_2_MIN_SPINS_3 = 40

export interface LittleMary3State {
  spinsSinceJp: number
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary3State(): LittleMary3State {
  return { spinsSinceJp: 0, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick3(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_3)
}

function weightedPick3WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick3(rng)
    const s = LITTLE_MARY_3_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick3(rng)
}

const JP_ELIGIBLE_INDICES_3 = LITTLE_MARY_3_RING.filter((s) => s.kind === "big" || s.kind === "small").map(
  (s) => s.index,
)

/** 花神三元獎觸發時強制在「這一轉」就落在大牌或小牌其中一格，絕不預告下幾轉才兌現。 */
function pickJpIndex3(rng: () => number): number {
  return JP_ELIGIBLE_INDICES_3[Math.floor(rng() * JP_ELIGIBLE_INDICES_3.length)]
}

export interface LittleMary3SpinResult {
  stopIndex: number
  slot: LittleMary3Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  /** true＝大三元（77／⭐️／🍉三個同時中獎），false＝小三元（🔔／🍈／🍋三個同時中獎）。 */
  tripletIsBig?: boolean
  chaseValue?: number
  nextState: LittleMary3State
}

export function spinLittleMary3(
  bets: LittleMary3Bets,
  state: LittleMary3State,
  rng: () => number = Math.random,
): LittleMary3SpinResult {
  const staked = totalStaked3(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  // 觸發與落點在同一轉決定：累積轉數到門檻後，每次啟動才有機會觸發，一旦觸發這一轉就必定落在大牌或小牌。
  const jpWindowOpen3 = spinsSinceJp >= JP_MIN_SPINS_3
  const jpForced3 = spinsSinceJp >= JP_MIN_SPINS_3 + JP_WINDOW_SPINS_3
  const triggered = jpWindowOpen3 && (jpForced3 || rng() < JP_TRIGGER_CHANCE_PER_SPIN_3)
  const stopIndex = triggered
    ? pickJpIndex3(rng)
    : weightedPick3WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_3, spinsSince2Bar >= BAR_2_MIN_SPINS_3)
  const slotHit = LITTLE_MARY_3_RING[stopIndex]

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

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_3 : SMALL_CHASE_VALUES_3
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]

  // 花朵三元獎觸發時，這一轉已經強制停在大牌／小牌圖案：
  // 大三元＝（落點大牌自己的押注）＋（BAR押注×2，代表3BAR與2BAR兩層）；
  // 小三元＝（落點小牌自己的押注）＋（BAR押注×1，代表單條BAR一層）。
  if (triggered) {
    const barStake = bets.bar ?? 0
    const barWeight = slotHit.kind === "big" ? 2 : 1
    const groupStake = stakeUsed + barStake * barWeight
    const multiplier = chaseValue * TRIPLET_FACTOR_3
    const jpHit = groupStake > 0
    return {
      stopIndex,
      slot: slotHit,
      outcome: jpHit ? "win" : "lose",
      totalStaked: staked,
      stakeUsed: groupStake,
      multiplier,
      payout: groupStake * multiplier,
      chaseValue,
      wasJpSpin: true,
      jpHit,
      tripletIsBig: slotHit.kind === "big",
      nextState: jpHit
        ? { spinsSinceJp: 0, spinsSince3Bar, spinsSince2Bar }
        : { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
    }
  }

  const multiplier = chaseValue
  return {
    stopIndex,
    slot: slotHit,
    outcome: stakeUsed > 0 ? "win" : "lose",
    totalStaked: staked,
    stakeUsed,
    multiplier,
    payout: stakeUsed * multiplier,
    chaseValue,
    wasJpSpin: false,
    jpHit: false,
    nextState: { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
  }
}

export function slotPosition3(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_3) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_3
  if (afterTop < BOARD_ROWS_3 - 2) {
    return { col: BOARD_COLS_3 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_3 - 2)
  if (afterRight < BOARD_COLS_3) {
    return { col: BOARD_COLS_3 - 1 - afterRight, row: BOARD_ROWS_3 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_3
  return { col: 0, row: BOARD_ROWS_3 - 2 - afterBottom }
}
