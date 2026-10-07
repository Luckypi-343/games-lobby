// 泡泡龍 — 選擇欄位發射泡泡，堆疊出 3 個以上同色相連即會消除得分。
export const BB_COLS = 7
export const BB_ROWS = 9

export const BB_PALETTE = ["bg-rose-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-fuchsia-500"]

export interface BbState {
  grid: (number | null)[][]
  current: number
  next: number
  score: number
  over: boolean
}

function randomColor(): number {
  return Math.floor(Math.random() * BB_PALETTE.length)
}

function initialGrid(): (number | null)[][] {
  const grid = Array.from({ length: BB_ROWS }, () => Array<number | null>(BB_COLS).fill(null))
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < BB_COLS; c++) grid[r][c] = randomColor()
  }
  return grid
}

export function bbNew(): BbState {
  return { grid: initialGrid(), current: randomColor(), next: randomColor(), score: 0, over: false }
}

function landingRow(grid: (number | null)[][], col: number): number | null {
  let topFilled = BB_ROWS
  for (let r = 0; r < BB_ROWS; r++) {
    if (grid[r][col] !== null) {
      topFilled = r
      break
    }
  }
  if (topFilled === 0) return null
  return topFilled === BB_ROWS ? BB_ROWS - 1 : topFilled - 1
}

function floodFill(grid: (number | null)[][], row: number, col: number, color: number): [number, number][] {
  const visited = new Set<string>()
  const stack: [number, number][] = [[row, col]]
  const result: [number, number][] = []
  while (stack.length) {
    const [r, c] = stack.pop()!
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)
    if (r < 0 || r >= BB_ROWS || c < 0 || c >= BB_COLS) continue
    if (grid[r][c] !== color) continue
    result.push([r, c])
    stack.push([r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1])
  }
  return result
}

export function bbShoot(state: BbState, col: number): BbState {
  if (state.over) return state
  const row = landingRow(state.grid, col)
  if (row === null) return { ...state, over: true }
  const grid = state.grid.map((r) => [...r])
  grid[row][col] = state.current
  const group = floodFill(grid, row, col, state.current)
  let scoreAdd = 0
  if (group.length >= 3) {
    for (const [r, c] of group) grid[r][c] = null
    scoreAdd = group.length * 10
  }
  return {
    grid,
    current: state.next,
    next: randomColor(),
    score: state.score + scoreAdd,
    over: false,
  }
}
