// Columns（寶石方塊）與俄羅斯方塊（Tetris）二合一機台：共用同一個棋盤格，可切換兩種古典掉落消除玩法。

export const CT_COLS = 7
export const CT_ROWS = 13
export const CT_GEM_COLORS = 5

export type CtCell = number | null // Columns: 0..CT_GEM_COLORS-1 代表寶石顏色；Tetris: 0..6 代表方塊種類顏色

export function ctEmptyGrid(): CtCell[][] {
  return Array.from({ length: CT_ROWS }, () => Array.from({ length: CT_COLS }, () => null))
}

export const CT_GEM_PALETTE = ["#ef4444", "#3b82f6", "#22c55e", "#eab308", "#a855f7"]

// ---------- Columns 寶石方塊 ----------

export type CtColumnsPiece = { col: number; row: number; gems: number[] } // gems[0] 在最上，gems[2] 在最下

export function ctColumnsNewPiece(): CtColumnsPiece {
  return {
    col: Math.floor(CT_COLS / 2),
    row: 0,
    gems: [
      Math.floor(Math.random() * CT_GEM_COLORS),
      Math.floor(Math.random() * CT_GEM_COLORS),
      Math.floor(Math.random() * CT_GEM_COLORS),
    ],
  }
}

export function ctColumnsCanPlace(grid: CtCell[][], p: CtColumnsPiece): boolean {
  for (let i = 0; i < 3; i++) {
    const r = p.row + i
    if (r < 0) continue
    if (r >= CT_ROWS || grid[r][p.col] !== null) return false
  }
  return true
}

export function ctColumnsTryMove(grid: CtCell[][], p: CtColumnsPiece, dx: number): CtColumnsPiece {
  const moved = { ...p, col: p.col + dx }
  return moved.col >= 0 && moved.col < CT_COLS && ctColumnsCanPlace(grid, moved) ? moved : p
}

export function ctColumnsRotate(p: CtColumnsPiece): CtColumnsPiece {
  return { ...p, gems: [p.gems[2], p.gems[0], p.gems[1]] }
}

export function ctColumnsTryDrop(grid: CtCell[][], p: CtColumnsPiece): { piece: CtColumnsPiece; landed: boolean } {
  const moved = { ...p, row: p.row + 1 }
  if (ctColumnsCanPlace(grid, moved)) return { piece: moved, landed: false }
  return { piece: p, landed: true }
}

export function ctColumnsLock(grid: CtCell[][], p: CtColumnsPiece): CtCell[][] {
  const g = grid.map((row) => [...row])
  for (let i = 0; i < 3; i++) {
    const r = p.row + i
    if (r >= 0 && r < CT_ROWS) g[r][p.col] = p.gems[i]
  }
  return ctColumnsGravity(g)
}

export function ctColumnsGravity(grid: CtCell[][]): CtCell[][] {
  const g = grid.map((row) => [...row])
  for (let c = 0; c < CT_COLS; c++) {
    const vals: number[] = []
    for (let r = 0; r < CT_ROWS; r++) if (g[r][c] !== null) vals.push(g[r][c] as number)
    for (let r = 0; r < CT_ROWS; r++) g[r][c] = null
    const start = CT_ROWS - vals.length
    for (let i = 0; i < vals.length; i++) g[start + i][c] = vals[i]
  }
  return g
}

/** 橫、直、斜 三個方向連成3個以上相同顏色即消除。 */
export function ctColumnsClear(grid: CtCell[][]): { grid: CtCell[][]; cleared: number } {
  const g = grid.map((row) => [...row])
  const toClear = new Set<string>()
  const dirs = [
    [0, 1],
    [1, 0],
    [1, 1],
    [1, -1],
  ]
  for (let r = 0; r < CT_ROWS; r++) {
    for (let c = 0; c < CT_COLS; c++) {
      const color = g[r][c]
      if (color === null) continue
      for (const [dr, dc] of dirs) {
        const line: [number, number][] = [[r, c]]
        let rr = r + dr
        let cc = c + dc
        while (rr >= 0 && rr < CT_ROWS && cc >= 0 && cc < CT_COLS && g[rr][cc] === color) {
          line.push([rr, cc])
          rr += dr
          cc += dc
        }
        if (line.length >= 3) for (const [lr, lc] of line) toClear.add(`${lr},${lc}`)
      }
    }
  }
  for (const key of toClear) {
    const [r, c] = key.split(",").map(Number)
    g[r][c] = null
  }
  return { grid: ctColumnsGravity(g), cleared: toClear.size }
}

export function ctColumnsIsOver(grid: CtCell[][]): boolean {
  const spawnCol = Math.floor(CT_COLS / 2)
  return grid[0][spawnCol] !== null || grid[1][spawnCol] !== null
}

// ---------- Tetris 俄羅斯方塊 ----------

export type CtTetrisPiece = { shape: number[][]; col: number; row: number; colorIndex: number }

const TETROMINOES: number[][][] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // S
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // Z
]
export const CT_TETRIS_COLORS = ["#06b6d4", "#eab308", "#a855f7", "#3b82f6", "#f97316", "#22c55e", "#ef4444"]

export function ctTetrisNewPiece(): CtTetrisPiece {
  const idx = Math.floor(Math.random() * TETROMINOES.length)
  const shape = TETROMINOES[idx]
  return { shape, col: Math.floor((CT_COLS - shape[0].length) / 2), row: 0, colorIndex: idx }
}

export function ctTetrisCanPlace(grid: CtCell[][], p: CtTetrisPiece): boolean {
  for (let r = 0; r < p.shape.length; r++) {
    for (let c = 0; c < p.shape[r].length; c++) {
      if (!p.shape[r][c]) continue
      const gr = p.row + r
      const gc = p.col + c
      if (gc < 0 || gc >= CT_COLS || gr >= CT_ROWS) return false
      if (gr >= 0 && grid[gr][gc] !== null) return false
    }
  }
  return true
}

export function ctTetrisTryMove(grid: CtCell[][], p: CtTetrisPiece, dx: number): CtTetrisPiece {
  const moved = { ...p, col: p.col + dx }
  return ctTetrisCanPlace(grid, moved) ? moved : p
}

export function ctTetrisRotate(grid: CtCell[][], p: CtTetrisPiece): CtTetrisPiece {
  const rows = p.shape.length
  const cols = p.shape[0].length
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0))
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) rotated[c][rows - 1 - r] = p.shape[r][c]
  const candidate = { ...p, shape: rotated }
  if (ctTetrisCanPlace(grid, candidate)) return candidate
  const kickLeft = { ...candidate, col: candidate.col - 1 }
  if (ctTetrisCanPlace(grid, kickLeft)) return kickLeft
  const kickRight = { ...candidate, col: candidate.col + 1 }
  if (ctTetrisCanPlace(grid, kickRight)) return kickRight
  return p
}

export function ctTetrisTryDrop(grid: CtCell[][], p: CtTetrisPiece): { piece: CtTetrisPiece; landed: boolean } {
  const moved = { ...p, row: p.row + 1 }
  if (ctTetrisCanPlace(grid, moved)) return { piece: moved, landed: false }
  return { piece: p, landed: true }
}

export function ctTetrisLock(grid: CtCell[][], p: CtTetrisPiece): CtCell[][] {
  const g = grid.map((row) => [...row])
  for (let r = 0; r < p.shape.length; r++) {
    for (let c = 0; c < p.shape[r].length; c++) {
      if (!p.shape[r][c]) continue
      const gr = p.row + r
      const gc = p.col + c
      if (gr >= 0 && gr < CT_ROWS) g[gr][gc] = p.colorIndex
    }
  }
  return g
}

export function ctTetrisClearLines(grid: CtCell[][]): { grid: CtCell[][]; cleared: number } {
  const remaining = grid.filter((row) => row.some((c) => c === null))
  const cleared = CT_ROWS - remaining.length
  const newRows = Array.from({ length: cleared }, () => Array<CtCell>(CT_COLS).fill(null))
  return { grid: [...newRows, ...remaining], cleared }
}

export function ctTetrisIsOver(grid: CtCell[][]): boolean {
  return grid[0].some((c) => c !== null) || grid[1].some((c) => c !== null)
}
