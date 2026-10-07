// 水果盤（一）純邏輯引擎：經典 3 輪×3 格水果盤，橫3排＋直2斜線，共 5 條連線。
// 每個輪軸是一條獨立的環形輪帶（24格），啟動時三個輪軸各自隨機停在某一點，
// 畫面顯示停點本身與上下各一格，共組成 3×3 的畫面。5條連線（上排／中排／下排／左上到右下斜線／左下到右上斜線）
// 只要同一條連線三格完全相同的圖案，就依該圖案賠率出彩；若畫面中🍒出現2顆以上（不論位置），
// 額外加發小獎（安慰獎，常見於傳統水果盤）。中排三格全是 7️⃣ 視為中頭獎（JP），獎金已包含在連線賠率內，
// 只是會觸發JP燈箱的特別閃爍與鈴聲效果。
// 玩家只需設定「每線押注」一個分數（0～99），啟動時扣除「每線押注×5條連線」的總額。

export type FruitSlotSymbolKey = "seven" | "bar" | "bell" | "watermelon" | "grape" | "orange" | "lemon" | "cherry"

export interface FruitSymbolInfo {
  key: FruitSlotSymbolKey
  glyph: string
  label: string
  multiplier: number
}

export const FRUIT_SYMBOLS: FruitSymbolInfo[] = [
  { key: "seven", glyph: "7️⃣", label: "七七七", multiplier: 100 },
  { key: "bar", glyph: "🆎", label: "BAR", multiplier: 50 },
  { key: "bell", glyph: "🔔", label: "鈴鐺", multiplier: 25 },
  { key: "watermelon", glyph: "🍉", label: "西瓜", multiplier: 15 },
  { key: "grape", glyph: "🍇", label: "葡萄", multiplier: 10 },
  { key: "orange", glyph: "🍊", label: "橘子", multiplier: 8 },
  { key: "lemon", glyph: "🍋", label: "檸檬", multiplier: 6 },
  { key: "cherry", glyph: "🍒", label: "櫻桃", multiplier: 4 },
]

function symbolInfo(key: FruitSlotSymbolKey): FruitSymbolInfo {
  return FRUIT_SYMBOLS.find((s) => s.key === key)!
}

// 單一輪帶（三個輪軸共用同一條帶子設計，各自獨立停點），依賠率越高、出現次數越少的傳統配置。
export const REEL_STRIP: FruitSlotSymbolKey[] = [
  "cherry", "lemon", "orange", "cherry", "grape", "bell",
  "lemon", "orange", "cherry", "watermelon", "bar", "lemon",
  "orange", "cherry", "grape", "bell", "lemon", "orange",
  "cherry", "watermelon", "bar", "grape", "seven", "watermelon",
]

export const STRIP_LENGTH = REEL_STRIP.length
export const REEL_COUNT = 3
export const LINE_COUNT = 5
export const CHERRY_BONUS_MULTIPLIER = 2
export const CHERRY_BONUS_MIN_COUNT = 2

export const JP_MIN_SPINS = 60
const JP_ARM_CHANCE_PER_SPIN = 0.18

export interface FruitSlotState {
  spinsSinceJp: number
  jpArmed: boolean
}

export function createFruitSlotState(): FruitSlotState {
  return { spinsSinceJp: 0, jpArmed: false }
}

export interface FruitSlotLineResult {
  line: number
  symbols: FruitSlotSymbolKey[]
  won: boolean
  multiplier: number
  payout: number
}

export interface FruitSlotSpinResult {
  stops: number[]
  grid: FruitSlotSymbolKey[][]
  lines: FruitSlotLineResult[]
  cherryCount: number
  cherryBonus: number
  totalStaked: number
  payout: number
  outcome: "lose" | "win"
  jpHit: boolean
  wasJpVisual: boolean
  nextState: FruitSlotState
}

function cellAt(stop: number, offset: -1 | 0 | 1): FruitSlotSymbolKey {
  const idx = (stop + offset + STRIP_LENGTH) % STRIP_LENGTH
  return REEL_STRIP[idx]
}

/**
 * 進行一次轉動判定。
 * @param betPerLine 每條連線的押注分數（實際扣款＝betPerLine × 5 條連線）。
 * @param state 目前 JP 視覺累積狀態（純粹用來讓燈箱閃爍節奏加快，不影響實際中獎機率）。
 * @param rng 可注入的隨機數來源。
 */
export function spinFruitSlot1(
  betPerLine: number,
  state: FruitSlotState,
  rng: () => number = Math.random,
): FruitSlotSpinResult {
  const stops = Array.from({ length: REEL_COUNT }, () => Math.floor(rng() * STRIP_LENGTH))
  // grid[row][col]：row 0 = 上排、1 = 中排、2 = 下排。
  const grid: FruitSlotSymbolKey[][] = [0, 1, 2].map((row) =>
    stops.map((stop) => cellAt(stop, row === 0 ? -1 : row === 2 ? 1 : 0)),
  )

  const lineDefs: FruitSlotSymbolKey[][] = [
    [grid[0][0], grid[0][1], grid[0][2]],
    [grid[1][0], grid[1][1], grid[1][2]],
    [grid[2][0], grid[2][1], grid[2][2]],
    [grid[0][0], grid[1][1], grid[2][2]],
    [grid[2][0], grid[1][1], grid[0][2]],
  ]

  const totalStaked = betPerLine * LINE_COUNT
  const lines: FruitSlotLineResult[] = lineDefs.map((symbols, line) => {
    const allSame = symbols[0] === symbols[1] && symbols[1] === symbols[2]
    const multiplier = allSame ? symbolInfo(symbols[0]).multiplier : 0
    return {
      line,
      symbols,
      won: allSame,
      multiplier,
      payout: allSame ? betPerLine * multiplier : 0,
    }
  })

  const cherryCount = grid.flat().filter((s) => s === "cherry").length
  const cherryBonus = cherryCount >= CHERRY_BONUS_MIN_COUNT ? betPerLine * CHERRY_BONUS_MULTIPLIER : 0

  const linePayout = lines.reduce((sum, l) => sum + l.payout, 0)
  const payout = linePayout + cherryBonus

  // 中排（傳統機台的主連線）三格全是 7️⃣ 視為中頭獎，獎金已包含在上面的連線賠率內，
  // 這裡只標記出來，供畫面觸發JP燈箱特效與鈴聲。
  const jpHit = grid[1][0] === "seven" && grid[1][1] === "seven" && grid[1][2] === "seven"

  const spinsSinceJp = state.spinsSinceJp + 1
  const jpArmedNext = jpHit
    ? false
    : state.jpArmed || (spinsSinceJp >= JP_MIN_SPINS && rng() < JP_ARM_CHANCE_PER_SPIN)

  return {
    stops,
    grid,
    lines,
    cherryCount,
    cherryBonus,
    totalStaked,
    payout,
    outcome: payout > 0 ? "win" : "lose",
    jpHit,
    wasJpVisual: state.jpArmed,
    nextState: jpHit ? { spinsSinceJp: 0, jpArmed: false } : { spinsSinceJp, jpArmed: jpArmedNext },
  }
}
