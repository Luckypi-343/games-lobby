// 傳統麻台（第二代·運動主題）純邏輯引擎。
// 完全複製第一代（little-mary.ts）的規則與運轉機制，只是把圖騰換成球類圖案：
// 大牌組 🏀／⚽️／🏉（籃球／足球／橄欖球），小牌組 🎳／🎾／🏓（保齡球／網球／桌球），
// 普牌 🏌️‍♂️（高爾夫）取代原本的櫻桃，BAR 家族與箭頭／ONCE MORE 完全不變。
// 燈位排列、機率權重、JP 累積與喚醒機制、ONCE MORE 全額退回規則都跟第一代一模一樣，
// 只有大牌組的浮動倍率範圍從 20～40 調整為 29～40（其餘倍率不變）。

export type LittleMary2SymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

/** 可分別下注的 8 種圖案鍵值。 */
export type LittleMary2StakeKey =
  | "bar"
  | "golf"
  | "basketball"
  | "soccer"
  | "rugby"
  | "bowling"
  | "tennis"
  | "pingpong"

export interface StakeInfo2 {
  key: LittleMary2StakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS_2: StakeInfo2[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "soccer", glyph: "⚽️", label: "足球", group: "big" },
  { key: "rugby", glyph: "🏉", label: "橄欖球", group: "big" },
  { key: "basketball", glyph: "🏀", label: "籃球", group: "big" },
  { key: "bowling", glyph: "🎳", label: "保齡球", group: "small" },
  { key: "tennis", glyph: "🎾", label: "網球", group: "small" },
  { key: "pingpong", glyph: "🏓", label: "桌球", group: "small" },
  { key: "golf", glyph: "🏌️‍♂️", label: "高爾夫", group: "fixed" },
]

export type LittleMary2Bets = Record<LittleMary2StakeKey, number>

export function createEmptyBets2(defaultValue = 0): LittleMary2Bets {
  const bets = {} as LittleMary2Bets
  for (const s of STAKE_SYMBOLS_2) bets[s.key] = defaultValue
  return bets
}

export function totalStaked2(bets: LittleMary2Bets): number {
  return STAKE_SYMBOLS_2.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMary2Slot {
  index: number
  kind: LittleMary2SymbolKind
  glyph: string
  label: string
  fixedMultiplier?: number
  stakeKey?: LittleMary2StakeKey
}

function slot(
  index: number,
  kind: LittleMary2SymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMary2StakeKey,
  fixedMultiplier?: number,
): LittleMary2Slot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

// 排列順序與第一代完全相同（頂排→右欄→底排→左欄，順時鐘），只替換圖騰，
// 確保每種符號的出現格數（機率權重）也跟第一代一致。
export const LITTLE_MARY_2_RING: LittleMary2Slot[] = [
  // 頂排 8 格
  slot(0, "small", "🎳", "保齡球", "bowling"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🏓", "桌球", "pingpong"),
  // 右欄 9 格
  slot(8, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(9, "big", "🏀", "籃球", "basketball"),
  slot(10, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(11, "once-more", "🅾️", "再來一次"),
  slot(12, "arrow", "⬇️", "下"),
  slot(13, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(14, "small", "🎾", "網球", "tennis"),
  slot(15, "arrow", "⬇️", "下"),
  slot(16, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  // 底排 8 格（右→左）
  slot(17, "small", "🎳", "保齡球", "bowling"),
  slot(18, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(19, "arrow", "⬅️", "左"),
  slot(20, "big", "⚽️", "足球", "soccer"),
  slot(21, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "arrow", "⬅️", "左"),
  slot(24, "small", "🏓", "桌球", "pingpong"),
  // 左欄 9 格（下→上）
  slot(25, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(26, "big", "🏉", "橄欖球", "rugby"),
  slot(27, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(28, "once-more", "🅾️", "再來一次"),
  slot(29, "arrow", "⬆️", "上"),
  slot(30, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
  slot(31, "small", "🎾", "網球", "tennis"),
  slot(32, "arrow", "⬆️", "上"),
  slot(33, "fixed", "🏌️‍♂️", "高爾夫", "golf", 2),
]

export const RING_SIZE_2 = LITTLE_MARY_2_RING.length
export const BOARD_COLS_2 = 8
export const BOARD_ROWS_2 = 11

// 大牌組浮動倍率範圍依要求調整為 29～40（原第一代為 20～40），小牌組維持 10～20 不變。
export const BIG_CHASE_VALUES_2 = [29, 35, 40] as const
export const SMALL_CHASE_VALUES_2 = [10, 15, 20] as const
export const BIG_JP_MULTIPLIER_2 = 100
export const SMALL_JP_MULTIPLIER_2 = 50

export const JP_MIN_SPINS_2 = 80
export const JP_WINDOW_SPINS_2 = 50
const JP_TRIGGER_CHANCE_PER_SPIN_2 = 0.12

/** 三疊BAR（×100倍）至少累積這麼多轉才有機會隨機出現；雙疊BAR（×50倍）至少累積這麼多轉；單條BAR（×25倍）不受限制。 */
export const BAR_3_MIN_SPINS_2 = 80
export const BAR_2_MIN_SPINS_2 = 40

export interface LittleMary2State {
  spinsSinceJp: number
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMary2State(): LittleMary2State {
  return { spinsSinceJp: 0, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick2(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE_2)
}

function weightedPick2WithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick2(rng)
    const s = LITTLE_MARY_2_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick2(rng)
}

const JP_ELIGIBLE_INDICES_2 = LITTLE_MARY_2_RING.filter((s) => s.kind === "big" || s.kind === "small").map(
  (s) => s.index,
)

/** JP 觸發時強制在「這一轉」就落在大牌或小牌其中一格，絕不預告下幾轉才兌現。 */
function pickJpIndex2(rng: () => number): number {
  return JP_ELIGIBLE_INDICES_2[Math.floor(rng() * JP_ELIGIBLE_INDICES_2.length)]
}

export interface LittleMary2SpinResult {
  stopIndex: number
  slot: LittleMary2Slot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  multiplier: number
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  chaseValue?: number
  nextState: LittleMary2State
}

export function spinLittleMary2(
  bets: LittleMary2Bets,
  state: LittleMary2State,
  rng: () => number = Math.random,
): LittleMary2SpinResult {
  const staked = totalStaked2(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  // JP 觸發與落點在同一轉決定：累積轉數到門檻後，每次啟動才有機會觸發，一旦觸發這一轉就必定落在大牌或小牌。
  const jpWindowOpen2 = spinsSinceJp >= JP_MIN_SPINS_2
  const jpForced2 = spinsSinceJp >= JP_MIN_SPINS_2 + JP_WINDOW_SPINS_2
  const triggered = jpWindowOpen2 && (jpForced2 || rng() < JP_TRIGGER_CHANCE_PER_SPIN_2)
  const stopIndex = triggered
    ? pickJpIndex2(rng)
    : weightedPick2WithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS_2, spinsSince2Bar >= BAR_2_MIN_SPINS_2)
  const slotHit = LITTLE_MARY_2_RING[stopIndex]

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

  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES_2 : SMALL_CHASE_VALUES_2
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]
  const jpHit = triggered
  const multiplier = jpHit ? (slotHit.kind === "big" ? BIG_JP_MULTIPLIER_2 : SMALL_JP_MULTIPLIER_2) : chaseValue

  return {
    stopIndex,
    slot: slotHit,
    outcome: stakeUsed > 0 ? "win" : "lose",
    totalStaked: staked,
    stakeUsed,
    multiplier,
    payout: stakeUsed * multiplier,
    chaseValue,
    wasJpSpin: jpHit,
    jpHit,
    nextState: jpHit
      ? { spinsSinceJp: 0, spinsSince3Bar, spinsSince2Bar }
      : { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
  }
}

export function slotPosition2(index: number): { col: number; row: number } {
  if (index < BOARD_COLS_2) {
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS_2
  if (afterTop < BOARD_ROWS_2 - 2) {
    return { col: BOARD_COLS_2 - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS_2 - 2)
  if (afterRight < BOARD_COLS_2) {
    return { col: BOARD_COLS_2 - 1 - afterRight, row: BOARD_ROWS_2 - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS_2
  return { col: 0, row: BOARD_ROWS_2 - 2 - afterBottom }
}
