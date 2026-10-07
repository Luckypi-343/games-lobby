// 傳統麻台（第三代·動物主題）純邏輯引擎。
// 設置、運轉機制跟第二代花朵JP版（little-mary-3.ts）完全相同，只替換圖騰：
// 大牌組 🐯／🐲／🐵（虎／龍／猴），小牌組 🦊／🐭／🐔（狐／鼠／雞），普牌 🐣（小雞）取代櫻桃。
// 🌺花神三元獎機制（大三元／小三元，總倍數＝跑燈停止倍數×3）、BAR 家族、箭頭、ONCE MORE 完全不變。

export type LittleMary4SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

export type LittleMary4StakeKey = "bar" | "chick" | "tiger" | "dragon" | "monkey" | "fox" | "mouse" | "rooster"

export interface StakeInfo4 {
  key: LittleMary4StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_4: StakeInfo4[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "tiger", glyph: "🐯", label: "老虎", group: "big" },
  { key: "dragon", glyph: "🐲", label: "龍", group: "big" },
  { key: "monkey", glyph: "🐵", label: "猴子", group: "big" },
  { key: "fox", glyph: "🦊", label: "狐狸", group: "small" },
  { key: "mouse", glyph: "🐭", label: "老鼠", group: "small" },
  { key: "rooster", glyph: "🐔", label: "雞", group: "small" },
  { key: "chick", glyph: "🐣", label: "小雞", group: "fixed" },
]

export type LittleMary4Bets = Record<LittleMary4StakeKey, number>

export function createEmptyBets4(defaultValue = 0): LittleMary4Bets {
  const bets = {} as LittleMary4Bets
  for (const s of STAKE_SYMBOLS_4) bets[s.key] = defaultValue
  return bets
}

export function totalStaked4(bets: LittleMary4Bets): number {
  return STAKE_SYMBOLS_4.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary4Slot {
  index: number
  kind: LittleMary4SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary4StakeKey
}

function slot(
  index: number,
  kind: LittleMary4SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary4StakeKey,
  fixedMultiplier?: number,
): LittleMary4Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

export const LITTLE_MARY_4_RING: LittleMary4Slot[] = [
  slot(0, "small", "🦊", "狐狸", "fox"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🐣", "小雞", "chick", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🐣", "小雞", "chick", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🐔", "雞", "rooster"),
  slot(8, "fixed", "🐣", "小雞", "chick", 2),
  slot(9, "big", "🐲", "龍", "dragon"),
  slot(10, "fixed", "🐣", "小雞", "chick", 2),
  slot(11, "once-more", "🅾️", "再來一次"),
  slot(12, "arrow", "⬇️", "下"),
  slot(13, "fixed", "🐣", "小雞", "chick", 2),
  slot(14, "small", "🐭", "老鼠", "mouse"),
  slot(15, "arrow", "⬇️", "下"),
  slot(16, "fixed", "🐣", "小雞", "chick", 2),
  slot(17, "small", "🦊", "狐狸", "fox"),
  slot(18, "fixed", "🐣", "小雞", "chick", 2),
  slot(19, "arrow", "⬅️", "左"),
  slot(20, "big", "🐯", "老虎", "tiger"),
  slot(21, "fixed", "🐣", "小雞", "chick", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "arrow", "⬅️", "左"),
  slot(24, "small", "🐔", "雞", "rooster"),
  slot(25, "fixed", "🐣", "小雞", "chick", 2),
  slot(26, "big", "🐵", "猴子", "monkey"),
  slot(27, "fixed", "🐣", "小雞", "chick", 2),
  slot(28, "once-more", "🅾️", "再來一次"),
  slot(29, "arrow", "⬆️", "上"),
  slot(30, "fixed", "🐣", "小雞", "chick", 2),
  slot(31, "small", "🐭", "老鼠", "mouse"),
  slot(32, "arrow", "⬆️", "上"),
  slot(33, "fixed", "🐣", "小雞", "chick", 2),
]

export const RING_SIZE_4 = LITTLE_MARY_4_RING.length
export const BOARD_COLS_4 = 8
export const BOARD_ROWS_4 = 11

export const BIG_CHASE_VALUES_4 = [20, 30, 40] as const
export const SMALL_CHASE_VALUES_4 = [10, 15, 20] as const
export const TRIPLET_FACTOR_4 = 3

export const JP_MIN_SPINS_4 = 80
export const JP_WINDOW_SPINS_4 = 50
const JP_TRIGGER_CHANCE_PER_SPIN_4 = 0.12

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_4 = 80
export const BAR_2_MIN_SPINS_4 = 40

export interface LittleMary4State {
  spinsSinceJp: number
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary4State(): LittleMary4State {
  return { spinsSinceJp: 0, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick4(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_4)
}

function weightedPick4WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick4(rng)
    const s = LITTLE_MARY_4_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick4(rng)
}

const JP_ELIGIBLE_INDICES_4 = LITTLE_MARY_4_RING.filter((s) => s.kind === "big" || s.kind === "small").map(
  (s) => s.index,
)

/** 花神三元獎觸發時強制在「這一轉」就落在大牌或小牌其中一格，絕不預告下幾轉才兌現。 */
function pickJpIndex4(rng: () => number): number {
  return JP_ELIGIBLE_INDICES_4[Math.floor(rng() * JP_ELIGIBLE_INDICES_4.length)]
}

export interface LittleMary4SpinResult {
  stopIndex: number
  slot: LittleMary4Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  tripletIsBig?: boolean
  chaseValue?: number
  nextState: LittleMary4State
}

export function spinLittleMary4(
  bets: LittleMary4Bets,
  state: LittleMary4State,
  rng: () => number = Math.random,
): LittleMary4SpinResult {
  const staked = totalStaked4(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  // 觸發與落點在同一轉決定：累積轉數到門檻後，每次啟動才有機會觸發，一旦觸發這一轉就必定落在大牌或小牌。
  const jpWindowOpen4 = spinsSinceJp >= JP_MIN_SPINS_4
  const jpForced4 = spinsSinceJp >= JP_MIN_SPINS_4 + JP_WINDOW_SPINS_4
  const triggered = jpWindowOpen4 && (jpForced4 || rng() < JP_TRIGGER_CHANCE_PER_SPIN_4)
  const stopIndex = triggered
    ? pickJpIndex4(rng)
    : weightedPick4WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_4, spinsSince2Bar >= BAR_2_MIN_SPINS_4)
  const slotHit = LITTLE_MARY_4_RING[stopIndex]

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

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_4 : SMALL_CHASE_VALUES_4
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]

  if (triggered) {
    const barStake = bets.bar ?? 0
    const barWeight = slotHit.kind === "big" ? 2 : 1
    const groupStake = stakeUsed + barStake * barWeight
    const multiplier = chaseValue * TRIPLET_FACTOR_4
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

export function slotPosition4(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_4) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_4
  if (afterTop < BOARD_ROWS_4 - 2) {
    return { col: BOARD_COLS_4 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_4 - 2)
  if (afterRight < BOARD_COLS_4) {
    return { col: BOARD_COLS_4 - 1 - afterRight, row: BOARD_ROWS_4 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_4
  return { col: 0, row: BOARD_ROWS_4 - 2 - afterBottom }
}
