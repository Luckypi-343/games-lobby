// 水果盤（二）純邏輯引擎：跟水果盤(一)完全相同的 3輪×3格、5連線（橫3排＋斜線2條）規則，
// 只是換上熱帶水果圖騰與風格：💎取代7️⃣作頭獎、🍓🍍🍌🍑取代葡萄/橘子/檸檬/西瓜，🍒維持櫻桃安慰獎。

export type FruitSlot2SymbolKey = "diamond" | "bar" | "bell" | "strawberry" | "pineapple" | "banana" | "peach" | "cherry"

export interface FruitSymbolInfo2 {
  key: FruitSlot2SymbolKey
  glyph: string
  label: string
  multiplier: number
}

export const FRUIT_SYMBOLS_2: FruitSymbolInfo2[] = [
  { key: "diamond", glyph: "💎", label: "鑽石", multiplier: 100 },
  { key: "bar", glyph: "🆎", label: "BAR", multiplier: 50 },
  { key: "bell", glyph: "🔔", label: "鈴鐺", multiplier: 25 },
  { key: "strawberry", glyph: "🍓", label: "草莓", multiplier: 15 },
  { key: "pineapple", glyph: "🍍", label: "鳳梨", multiplier: 10 },
  { key: "banana", glyph: "🍌", label: "香蕉", multiplier: 8 },
  { key: "peach", glyph: "🍑", label: "水桃", multiplier: 6 },
  { key: "cherry", glyph: "🍒", label: "櫻桃", multiplier: 4 },
]

function symbolInfo(key: FruitSlot2SymbolKey): FruitSymbolInfo2 {
  return FRUIT_SYMBOLS_2.find((s) => s.key === key)!
}

export const REEL_STRIP_2: FruitSlot2SymbolKey[] = [
  "cherry", "peach", "banana", "cherry", "pineapple", "bell",
  "peach", "banana", "cherry", "strawberry", "bar", "peach",
  "banana", "cherry", "pineapple", "bell", "peach", "banana",
  "cherry", "strawberry", "bar", "pineapple", "diamond", "strawberry",
]

export const STRIP_LENGTH_2 = REEL_STRIP_2.length
export const REEL_COUNT_2 = 3
export const LINE_COUNT_2 = 5
export const CHERRY_BONUS_MULTIPLIER_2 = 2
export const CHERRY_BONUS_MIN_COUNT_2 = 2

export const JP_MIN_SPINS_2 = 60
const JP_ARM_CHANCE_PER_SPIN_2 = 0.18

export interface FruitSlot2State {
  spinsSinceJp: number
  jpArmed: boolean
}

export function createFruitSlot2State(): FruitSlot2State {
  return { spinsSinceJp: 0, jpArmed: false }
}

export interface FruitSlot2LineResult {
  line: number
  symbols: FruitSlot2SymbolKey[]
  won: boolean
  multiplier: number
  payout: number
}

export interface FruitSlot2SpinResult {
  stops: number[]
  grid: FruitSlot2SymbolKey[][]
  lines: FruitSlot2LineResult[]
  cherryCount: number
  cherryBonus: number
  totalStaked: number
  payout: number
  outcome: "lose" | "win"
  jpHit: boolean
  wasJpVisual: boolean
  nextState: FruitSlot2State
}

function cellAt(stop: number, offset: -1 | 0 | 1): FruitSlot2SymbolKey {
  const idx = (stop + offset + STRIP_LENGTH_2) % STRIP_LENGTH_2
  return REEL_STRIP_2[idx]
}

export function spinFruitSlot2(
  betPerLine: number,
  state: FruitSlot2State,
  rng: () => number = Math.random,
): FruitSlot2SpinResult {
  const stops = Array.from({ length: REEL_COUNT_2 }, () => Math.floor(rng() * STRIP_LENGTH_2))
  const grid: FruitSlot2SymbolKey[][] = [0, 1, 2].map((row) =>
    stops.map((stop) => cellAt(stop, row === 0 ? -1 : row === 2 ? 1 : 0)),
  )

  const lineDefs: FruitSlot2SymbolKey[][] = [
    [grid[0][0], grid[0][1], grid[0][2]],
    [grid[1][0], grid[1][1], grid[1][2]],
    [grid[2][0], grid[2][1], grid[2][2]],
    [grid[0][0], grid[1][1], grid[2][2]],
    [grid[2][0], grid[1][1], grid[0][2]],
  ]

  const totalStaked = betPerLine * LINE_COUNT_2
  const lines: FruitSlot2LineResult[] = lineDefs.map((symbols, line) => {
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
  const cherryBonus = cherryCount >= CHERRY_BONUS_MIN_COUNT_2 ? betPerLine * CHERRY_BONUS_MULTIPLIER_2 : 0

  const linePayout = lines.reduce((sum, l) => sum + l.payout, 0)
  const payout = linePayout + cherryBonus

  const jpHit = grid[1][0] === "diamond" && grid[1][1] === "diamond" && grid[1][2] === "diamond"

  const spinsSinceJp = state.spinsSinceJp + 1
  const jpArmedNext = jpHit
    ? false
    : state.jpArmed || (spinsSinceJp >= JP_MIN_SPINS_2 && rng() < JP_ARM_CHANCE_PER_SPIN_2)

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
