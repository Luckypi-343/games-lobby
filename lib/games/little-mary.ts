// 傳統麻台（第一代）純邏輯引擎。
// 燈位排成一圈「橫8格×直11格」中空方框（頂、底各8格，左、右各9格，角落共用），
// 共 34 個燈位，依照機台面板實際擺放的符號比例決定機率權重（同一符號出現越多次，機率自然越高，
// 不另外加權，忠實還原傳統機台「數格子比機率」的玩法）。
// 玩家可對 8 種圖案（BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／櫻桃）各自分別下注分數，
// 啟動時一次扣掉 8 筆押注的總和。方框游標順時鐘快轉三圈、再緩轉半圈到一圈半才停止。
// 停在箭頭 = 全輸；停在 ONCE MORE = 不扣分、退回全部押注、免費重轉一次；
// 停在某個圖案 = 只有「該圖案自己的押注」依其賠率出彩，其餘圖案的押注視為未中獎；
// BAR 類（🆎／🅰️／🅱️）共用同一筆「BAR」押注，依落在哪一種 BAR 給不同固定倍率；
// 77／⭐️／🍉（大牌組）與 🔔／🍈／🍋（小牌組）依跑燈當下數值給浮動倍率，JP 場次則改發固定高倍。

export type LittleMarySymbolKind = "arrow" | "once-more" | "bar" | "fixed" | "big" | "small"

/** 可分別下注的 8 種圖案鍵值。 */
export type LittleMaryStakeKey = "bar" | "cherry" | "seven" | "star" | "watermelon" | "bell" | "honeydew" | "lemon"

export interface StakeInfo {
  key: LittleMaryStakeKey
  glyph: string
  label: string
  group: "bar" | "fixed" | "big" | "small"
}

export const STAKE_SYMBOLS: StakeInfo[] = [
  { key: "bar", glyph: "🆎", label: "BAR", group: "bar" },
  { key: "seven", glyph: "77", label: "77", group: "big" },
  { key: "star", glyph: "⭐️", label: "星星", group: "big" },
  { key: "watermelon", glyph: "🍉", label: "西瓜", group: "big" },
  { key: "bell", glyph: "🔔", label: "鈴鐺", group: "small" },
  { key: "honeydew", glyph: "🍈", label: "香瓜", group: "small" },
  { key: "lemon", glyph: "🍋", label: "檸檬", group: "small" },
  { key: "cherry", glyph: "🍒", label: "櫻桃", group: "fixed" },
]

export type LittleMaryBets = Record<LittleMaryStakeKey, number>

export function createEmptyBets(defaultValue = 0): LittleMaryBets {
  const bets = {} as LittleMaryBets
  for (const s of STAKE_SYMBOLS) bets[s.key] = defaultValue
  return bets
}

export function totalStaked(bets: LittleMaryBets): number {
  return STAKE_SYMBOLS.reduce((sum, s) => sum + (bets[s.key] ?? 0), 0)
}

export interface LittleMarySlot {
  index: number
  kind: LittleMarySymbolKind
  glyph: string
  label: string
  /** bar/fixed 圖案專用固定倍率；big/small 圖案倍率改由跑燈與 JP 狀態動態決定。 */
  fixedMultiplier?: number
  /** bar/fixed/big/small 圖案對應的押注鍵，用來決定扣這一格要吃哪一筆押注。 */
  stakeKey?: LittleMaryStakeKey
}

function slot(
  index: number,
  kind: LittleMarySymbolKind,
  glyph: string,
  label: string,
  stakeKey?: LittleMaryStakeKey,
  fixedMultiplier?: number,
): LittleMarySlot {
  return { index, kind, glyph, label, stakeKey, fixedMultiplier }
}

// 依面板實際圖案，順時鐘排列：頂排(左→右) → 右欄(上→下) → 底排(右→左) → 左欄(下→上)。
// 🆎／🅰️／🅱️ 三種 BAR 變體都吃同一筆「bar」押注，只是固定倍率不同（2／3／4倍）。
export const LITTLE_MARY_RING: LittleMarySlot[] = [
  // 頂排 8 格
  slot(0, "small", "🔔", "鈴鐺", "bell"),
  slot(1, "arrow", "➡️", "右"),
  slot(2, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(3, "bar", "🆎", "三疊BAR", "bar", 100),
  slot(4, "bar", "🅱️", "單條BAR", "bar", 25),
  slot(5, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(6, "arrow", "➡️", "右"),
  slot(7, "small", "🍋", "檸檬", "lemon"),
  // 右欄 9 格（不含上下角）
  slot(8, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(9, "big", "🍉", "西瓜", "watermelon"),
  slot(10, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(11, "once-more", "🅾️", "再來一次"),
  slot(12, "arrow", "⬇️", "下"),
  slot(13, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(14, "small", "🍈", "香瓜", "honeydew"),
  slot(15, "arrow", "⬇️", "下"),
  slot(16, "fixed", "🍒", "櫻桃", "cherry", 2),
  // 底排 8 格（右→左）
  slot(17, "small", "🔔", "鈴鐺", "bell"),
  slot(18, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(19, "arrow", "⬅️", "左"),
  slot(20, "big", "77", "77", "seven"),
  slot(21, "fixed", "🍒", "櫻桃", "cherry", 2),
  slot(22, "bar", "🅰️", "雙疊BAR", "bar", 50),
  slot(23, "arrow", "⬅️", "左"),
  slot(24, "small", "🍋", "檸檬", "lemon"),
  // 左欄 9 格（下→上，不含上下角）
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

export const RING_SIZE = LITTLE_MARY_RING.length
export const BOARD_COLS = 8
export const BOARD_ROWS = 11

export const BIG_CHASE_VALUES = [20, 30, 40] as const
export const SMALL_CHASE_VALUES = [10, 15, 20] as const
export const BIG_JP_MULTIPLIER = 100
export const SMALL_JP_MULTIPLIER = 50

/** JP 從上次中獎後至少要累積這麼多轉，才有機會在「當次啟動」觸發；觸發與落點在同一轉決定，絕不預告未來幾轉。 */
export const JP_MIN_SPINS = 80
/** 達到門檻後，最晚也會在再累積這麼多轉以內隨機觸發一次（不是固定次數，但保證不會無限拖延）。 */
export const JP_WINDOW_SPINS = 50
const JP_TRIGGER_CHANCE_PER_SPIN = 0.12

/** 三疊BAR（🆎×100倍）從上次中獎後至少要累積這麼多轉，才有機會隨機停在這一格。 */
export const BAR_3_MIN_SPINS = 80
/** 雙疊BAR（🅰️×50倍）從上次中獎後至少要累積這麼多轉，才有機會隨機停在這一格。單條BAR（🅱️×25倍）不受限制，隨時都能隨機出現。 */
export const BAR_2_MIN_SPINS = 40

export interface LittleMaryState {
  spinsSinceJp: number
  spinsSince3Bar: number
  spinsSince2Bar: number
}

export function createLittleMaryState(): LittleMaryState {
  return { spinsSinceJp: 0, spinsSince3Bar: 0, spinsSince2Bar: 0 }
}

function weightedPick(rng: () => number): number {
  // 每個燈位權重相同（機率完全由面板上同一符號出現的格數決定）。
  return Math.floor(rng() * RING_SIZE)
}

/** 一般（非JP）落點：未達門檻前，3BAR／2BAR 這兩格視為暫時不存在，重抽直到落在允許的燈位。 */
function weightedPickWithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick(rng)
    const s = LITTLE_MARY_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick(rng)
}

const JP_ELIGIBLE_INDICES = LITTLE_MARY_RING.filter((s) => s.kind === "big" || s.kind === "small").map(
  (s) => s.index,
)

/** JP 觸發時強制在「這一轉」就落在大牌或小牌其中一格，絕不是先預告、下幾轉才兌現。 */
function pickJpIndex(rng: () => number): number {
  return JP_ELIGIBLE_INDICES[Math.floor(rng() * JP_ELIGIBLE_INDICES.length)]
}

export interface LittleMarySpinResult {
  stopIndex: number
  slot: LittleMarySlot
  outcome: "lose" | "once-more" | "win"
  /** 這一輪實際被扣除的押注總和（8 筆押注加總）。 */
  totalStaked: number
  /** 中獎時，實際出彩所採用的那一筆押注金額（只有落點對應的那個圖案的押注會拿來計算）。 */
  stakeUsed: number
  /** 中獎時實際採用的倍數。 */
  multiplier: number
  /** 中獎金額 = stakeUsed × multiplier。 */
  payout: number
  wasJpSpin: boolean
  jpHit: boolean
  chaseValue?: number
  nextState: LittleMaryState
}

/**
 * 進行一次轉動判定。
 * @param bets 玩家這一輪對 8 種圖案各自下的押注金額。
 * @param state 目前 JP 累積轉數狀態。
 * @param rng 可注入的隨機數來源，預設為 Math.random（測試時可替換）。
 */
export function spinLittleMary(
  bets: LittleMaryBets,
  state: LittleMaryState,
  rng: () => number = Math.random,
): LittleMarySpinResult {
  const staked = totalStaked(bets)
  const spinsSinceJp = state.spinsSinceJp + 1
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  // JP 觸發與落點在「這一轉」當下一次決定：累積轉數到門檻後，每次啟動才有機會觸發；
  // 一旦觸發，轉盤這一轉就必定停在大牌或小牌，絕不是先閃爍預告、留到之後幾轉才兌現（避免可預判的作弊漏洞）。
  const jpWindowOpen = spinsSinceJp >= JP_MIN_SPINS
  const jpForced = spinsSinceJp >= JP_MIN_SPINS + JP_WINDOW_SPINS
  const triggered = jpWindowOpen && (jpForced || rng() < JP_TRIGGER_CHANCE_PER_SPIN)
  const stopIndex = triggered
    ? pickJpIndex(rng)
    : weightedPickWithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS, spinsSince2Bar >= BAR_2_MIN_SPINS)
  const slotHit = LITTLE_MARY_RING[stopIndex]

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
      payout: staked, // 不扣分：全額退回。
      wasJpSpin: false,
      jpHit: false,
      // ONCE MORE 不算一次「空轉」，直接保留目前的累積轉數。
      nextState: { spinsSinceJp: state.spinsSinceJp, spinsSince3Bar: state.spinsSince3Bar, spinsSince2Bar: state.spinsSince2Bar },
    }
  }

  const stakeKey = slotHit.stakeKey!
  const stakeUsed = bets[stakeKey] ?? 0

  if (slotHit.kind === "bar" || slotHit.kind === "fixed") {
    const multiplier = slotHit.fixedMultiplier ?? 1
    // 命中3BAR／2BAR後各自歸零重新累積；單條BAR與櫻桃不受門檻限制，不影響累積轉數。
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

  // 大牌／小牌圖案：只有該圖案自己的押注會拿來計算。觸發JP時這一轉必定落在這裡，直接發固定高倍。
  const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES : SMALL_CHASE_VALUES
  const chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]
  const jpHit = triggered
  const multiplier = jpHit ? (slotHit.kind === "big" ? BIG_JP_MULTIPLIER : SMALL_JP_MULTIPLIER) : chaseValue

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
    // 命中 JP 後歸零重新累積。
    nextState: jpHit
      ? { spinsSinceJp: 0, spinsSince3Bar, spinsSince2Bar }
      : { spinsSinceJp, spinsSince3Bar, spinsSince2Bar },
  }
}

/** 面板座標：回傳每個燈位在 8×11 中空方框上的 (col, row)，0-based，供畫面排版使用。 */
export function slotPosition(index: number): { col: number; row: number } {
  if (index < BOARD_COLS) {
    // 頂排，左→右
    return { col: index, row: 0 }
  }
  const afterTop = index - BOARD_COLS
  if (afterTop < BOARD_ROWS - 2) {
    // 右欄，上→下
    return { col: BOARD_COLS - 1, row: afterTop + 1 }
  }
  const afterRight = afterTop - (BOARD_ROWS - 2)
  if (afterRight < BOARD_COLS) {
    // 底排，右→左
    return { col: BOARD_COLS - 1 - afterRight, row: BOARD_ROWS - 1 }
  }
  const afterBottom = afterRight - BOARD_COLS
  // 左欄，下→上
  return { col: 0, row: BOARD_ROWS - 2 - afterBottom }
}
