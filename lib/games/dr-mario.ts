// 瑪利歐醫生（Dr. Mario）：雙色膠囊由上方落下旋轉，堆疊於病毒旁；同色連成4個以上（含病毒）即消除，清空所有病毒即過關。

export const DRMARIO_COLS = 7
export const DRMARIO_ROWS = 12
export const DRMARIO_COLOR_COUNT = 3

export type DrMarioCellKind = "virus" | "capsule"
export type DrMarioCell = { color: number; kind: DrMarioCellKind } | null

export type DrMarioCapsule = {
  col: number
  row: number
  rotation: 0 | 1 | 2 | 3 // 0=second在右, 1=在下, 2=在左, 3=在上
  colorA: number
  colorB: number
}

export const DRMARIO_PALETTE = [
  { name: "紅", base: "#ef4444" },
  { name: "黃", base: "#eab308" },
  { name: "藍", base: "#3b82f6" },
]

export function drMarioEmptyGrid(): DrMarioCell[][] {
  return Array.from({ length: DRMARIO_ROWS }, () => Array.from({ length: DRMARIO_COLS }, () => null))
}

export function drMarioSeedViruses(count: number): DrMarioCell[][] {
  const g = drMarioEmptyGrid()
  let placed = 0
  let guard = 0
  while (placed < count && guard < 500) {
    guard++
    const row = DRMARIO_ROWS - 1 - Math.floor(Math.random() * Math.min(7, DRMARIO_ROWS - 2))
    const col = Math.floor(Math.random() * DRMARIO_COLS)
    if (g[row][col] === null) {
      g[row][col] = { color: Math.floor(Math.random() * DRMARIO_COLOR_COUNT), kind: "virus" }
      placed++
    }
  }
  return g
}

export function drMarioNewCapsule(): DrMarioCapsule {
  return {
    col: Math.floor(DRMARIO_COLS / 2) - 1,
    row: 0,
    rotation: 0,
    colorA: Math.floor(Math.random() * DRMARIO_COLOR_COUNT),
    colorB: Math.floor(Math.random() * DRMARIO_COLOR_COUNT),
  }
}

export function drMarioSecondPos(c: DrMarioCapsule): { col: number; row: number } {
  if (c.rotation === 0) return { col: c.col + 1, row: c.row }
  if (c.rotation === 1) return { col: c.col, row: c.row + 1 }
  if (c.rotation === 2) return { col: c.col - 1, row: c.row }
  return { col: c.col, row: c.row - 1 }
}

function free(grid: DrMarioCell[][], col: number, row: number): boolean {
  if (col < 0 || col >= DRMARIO_COLS || row < 0 || row >= DRMARIO_ROWS) return false
  return grid[row][col] === null
}

export function drMarioCanPlace(grid: DrMarioCell[][], c: DrMarioCapsule): boolean {
  const sec = drMarioSecondPos(c)
  return free(grid, c.col, c.row) && free(grid, sec.col, sec.row)
}

export function drMarioTryMove(grid: DrMarioCell[][], c: DrMarioCapsule, dx: number): DrMarioCapsule {
  const moved = { ...c, col: c.col + dx }
  return drMarioCanPlace(grid, moved) ? moved : c
}

export function drMarioTryRotate(grid: DrMarioCell[][], c: DrMarioCapsule): DrMarioCapsule {
  const rotated = { ...c, rotation: (((c.rotation + 1) % 4) as 0 | 1 | 2 | 3) }
  if (drMarioCanPlace(grid, rotated)) return rotated
  const kickLeft = { ...rotated, col: rotated.col - 1 }
  if (drMarioCanPlace(grid, kickLeft)) return kickLeft
  const kickRight = { ...rotated, col: rotated.col + 1 }
  if (drMarioCanPlace(grid, kickRight)) return kickRight
  return c
}

export function drMarioTryDrop(grid: DrMarioCell[][], c: DrMarioCapsule): { capsule: DrMarioCapsule; landed: boolean } {
  const moved = { ...c, row: c.row + 1 }
  if (drMarioCanPlace(grid, moved)) return { capsule: moved, landed: false }
  return { capsule: c, landed: true }
}

export function drMarioLockCapsule(grid: DrMarioCell[][], c: DrMarioCapsule): DrMarioCell[][] {
  const g = grid.map((row) => [...row])
  const sec = drMarioSecondPos(c)
  if (c.row >= 0) g[c.row][c.col] = { color: c.colorA, kind: "capsule" }
  if (sec.row >= 0) g[sec.row][sec.col] = { color: c.colorB, kind: "capsule" }
  return g
}

/** 膠囊受重力下落直到支撐（病毒跟已固定的膠囊都視為支撐），每格膠囊各自獨立下落（病毒不會掉）。 */
export function drMarioApplyGravity(grid: DrMarioCell[][]): DrMarioCell[][] {
  const g = grid.map((row) => [...row])
  let moved = true
  let guard = 0
  while (moved && guard < DRMARIO_ROWS + 2) {
    moved = false
    guard++
    for (let c = 0; c < DRMARIO_COLS; c++) {
      for (let r = DRMARIO_ROWS - 2; r >= 0; r--) {
        const cell = g[r][c]
        if (cell && cell.kind === "capsule" && g[r + 1][c] === null) {
          g[r + 1][c] = cell
          g[r][c] = null
          moved = true
        }
      }
    }
  }
  return g
}

export function drMarioClear(grid: DrMarioCell[][]): { grid: DrMarioCell[][]; cleared: number; virusesCleared: number } {
  const g = grid.map((row) => [...row])
  const toClear = new Set<string>()

  function checkLine(cells: { r: number; c: number }[]) {
    let runColor = -1
    let run: { r: number; c: number }[] = []
    for (const { r, c } of cells) {
      const cell = g[r][c]
      const color = cell ? cell.color : -1
      if (color === runColor && color !== -1) {
        run.push({ r, c })
      } else {
        if (run.length >= 4) for (const p of run) toClear.add(`${p.r},${p.c}`)
        run = color !== -1 ? [{ r, c }] : []
        runColor = color
      }
    }
    if (run.length >= 4) for (const p of run) toClear.add(`${p.r},${p.c}`)
  }

  for (let r = 0; r < DRMARIO_ROWS; r++) {
    checkLine(Array.from({ length: DRMARIO_COLS }, (_, c) => ({ r, c })))
  }
  for (let c = 0; c < DRMARIO_COLS; c++) {
    checkLine(Array.from({ length: DRMARIO_ROWS }, (_, r) => ({ r, c })))
  }

  let virusesCleared = 0
  for (const key of toClear) {
    const [r, c] = key.split(",").map(Number)
    if (g[r][c]?.kind === "virus") virusesCleared++
    g[r][c] = null
  }

  return { grid: g, cleared: toClear.size, virusesCleared }
}

export function drMarioCountViruses(grid: DrMarioCell[][]): number {
  let n = 0
  for (const row of grid) for (const c of row) if (c?.kind === "virus") n++
  return n
}

export function drMarioIsOver(grid: DrMarioCell[][]): boolean {
  const spawnCol = Math.floor(DRMARIO_COLS / 2) - 1
  return grid[0][spawnCol] !== null || grid[0][spawnCol + 1] !== null
}
