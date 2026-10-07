import {
  BOARD_PAYTABLE,
  BONUS_WHEEL_SPINS,
  LINE_COUNT,
  PAYLINES,
  PAYTABLE,
  SCATTER_FREE_GAMES,
  SYMBOL_WEIGHT,
  type SymbolId,
} from "./data"

const ALL_SYMBOLS = Object.keys(SYMBOL_WEIGHT) as SymbolId[]
const TOTAL_WEIGHT = ALL_SYMBOLS.reduce((sum, s) => sum + SYMBOL_WEIGHT[s], 0)

function randomSymbol(): SymbolId {
  let r = Math.random() * TOTAL_WEIGHT
  for (const s of ALL_SYMBOLS) {
    r -= SYMBOL_WEIGHT[s]
    if (r <= 0) return s
  }
  return ALL_SYMBOLS[0]
}

// grid[col][row] — 5 reels (columns) x 3 visible rows each.
export type Grid = SymbolId[][]

// 每一豎列（reel）最多只允許出現 1 個 SCATTER（虎/bonus）與 1 個 BONUS（鼠/wheel），
// 符合創辦人規範：「每列只能 1 個」。
export function spinReels(): Grid {
  const grid: Grid = []
  for (let col = 0; col < 5; col++) {
    const column: SymbolId[] = []
    let scatterUsed = false
    let wheelUsed = false
    for (let row = 0; row < 3; row++) {
      let s = randomSymbol()
      let tries = 0
      while (tries < 30 && ((s === "bonus" && scatterUsed) || (s === "wheel" && wheelUsed))) {
        s = randomSymbol()
        tries++
      }
      if (s === "bonus" && scatterUsed) s = "rooster"
      if (s === "wheel" && wheelUsed) s = "rooster"
      if (s === "bonus") scatterUsed = true
      if (s === "wheel") wheelUsed = true
      column.push(s)
    }
    grid.push(column)
  }
  return grid
}

export interface LineHit {
  lineIndex: number
  symbol: Exclude<SymbolId, "bonus" | "wheel">
  count: number
  win: number
}

export interface SpinResult {
  grid: Grid
  hits: LineHit[]
  totalWin: number
  freeGames: number
  bonusWheelTriggered: boolean
  wheelSymbolCount: number
  wheelSpins: number
  boardWin: number
  boardSymbol: Exclude<SymbolId, "wild" | "bonus" | "wheel" | "rat" | "tiger" | "dragon"> | null
}

const GENERAL_SYMBOLS = Object.keys(BOARD_PAYTABLE) as (keyof typeof BOARD_PAYTABLE)[]

export function evaluateSpin(grid: Grid, betPerLine: number, payFactor: number): SpinResult {
  const hits: LineHit[] = []
  let freeGames = 0
  let wheelSymbolCount = 0
  let wheelSpins = 0

  PAYLINES.forEach((pattern, lineIndex) => {
    const cells = pattern.map((row, col) => grid[col][row])

    // Payline payout: bonus / wheel symbols never form part of a paying line.
    let symbol: SymbolId | null = cells[0] === "bonus" || cells[0] === "wheel" ? null : cells[0]
    if (symbol === "wild" || symbol === null) {
      const firstReal = cells.find((c) => c !== "wild" && c !== "bonus" && c !== "wheel")
      symbol = firstReal ?? "wild"
    }

    if (symbol !== "bonus" && symbol !== "wheel") {
      let count = 0
      for (const c of cells) {
        if (c === symbol || c === "wild") count++
        else break
      }
      if (count >= 3) {
        const table = PAYTABLE[symbol as Exclude<SymbolId, "bonus" | "wheel">]
        const tier = count >= 5 ? 5 : count === 4 ? 4 : 3
        const win = Math.round(table[tier as 3 | 4 | 5] * payFactor * betPerLine)
        hits.push({ lineIndex, symbol: symbol as Exclude<SymbolId, "bonus" | "wheel">, count, win })
      }
    }

    // SCATTER（虎）trigger：跟一般圖騰同一套規則——由左而右算起，連續出現 3 個以上才觸發免費遊戲
    // （中間一旦斷開就不算），3 個＝5 次、4 個＝10 次、5 個＝15 次。
    let scatterCount = 0
    for (const c of cells) {
      if (c === "bonus") scatterCount++
      else break
    }
    if (scatterCount >= 3) {
      const tier = scatterCount >= 5 ? 5 : scatterCount === 4 ? 4 : 3
      const award = SCATTER_FREE_GAMES[tier as 3 | 4 | 5]
      if (award > freeGames) freeGames = award
    }

    // BONUS（鼠）trigger：同樣由左而右算起，連續出現 3 個以上才觸發飛輪贈分遊戲（中間斷開不算）。
    // 3 個＝1 次、4 個＝2 次、5 個＝3 次。
    let wheelCount = 0
    for (const c of cells) {
      if (c === "wheel") wheelCount++
      else break
    }
    if (wheelCount >= 3) {
      const tier = wheelCount >= 5 ? 5 : wheelCount === 4 ? 4 : 3
      const spins = BONUS_WHEEL_SPINS[tier as 3 | 4 | 5]
      if (spins > wheelSpins) {
        wheelSpins = spins
        wheelSymbolCount = wheelCount
      }
    }
  })

  const bonusWheelTriggered = wheelSpins > 0

  // 全盤獎：轉盤 15 格全部都是同一個一般圖騰（可搭配百搭 WILD）時，
  // 以「總押注分（9 條線 × 每線押注分）」乘上全盤倍數計算，屬於極稀有的大獎。
  let boardWin = 0
  let boardSymbol: SpinResult["boardSymbol"] = null
  const flat = grid.flat()
  for (const sym of GENERAL_SYMBOLS) {
    const allMatch = flat.every((c) => c === sym || c === "wild")
    const hasReal = flat.some((c) => c === sym)
    if (allMatch && hasReal) {
      boardSymbol = sym
      boardWin = Math.round(BOARD_PAYTABLE[sym] * payFactor * betPerLine * LINE_COUNT)
      break
    }
  }

  const totalWin = hits.reduce((sum, h) => sum + h.win, 0) + boardWin
  return {
    grid,
    hits,
    totalWin,
    freeGames,
    bonusWheelTriggered,
    wheelSymbolCount,
    wheelSpins,
    boardWin,
    boardSymbol,
  }
}
