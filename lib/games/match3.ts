// 開心消消樂 — 交換相鄰方塊湊出 3 個以上同色連線即會消除並連鎖補位。
// 牌局放大為高10列×寬8欄（原本是 6×6 的正方形），讓玩家有更大的消除空間。
export const M3_ROWS = 10
export const M3_COLS = 8
// 保留舊名稱 M3_SIZE 供欄數使用，避免其他地方若有殘留引用時直接壞掉。
export const M3_SIZE = M3_COLS
export const M3_PALETTE = ["bg-rose-500", "bg-sky-500", "bg-emerald-500", "bg-amber-500", "bg-fuchsia-500", "bg-indigo-500"]

export interface M3State {
  grid: number[]
  score: number
  lastCleared: number
}

function randomColor(): number {
  return Math.floor(Math.random() * M3_PALETTE.length)
}

function idx(r: number, c: number): number {
  return r * M3_COLS + c
}

function findMatches(grid: number[]): boolean[] {
  const matched = Array(grid.length).fill(false)
  for (let r = 0; r < M3_ROWS; r++) {
    for (let c = 0; c < M3_COLS - 2; c++) {
      const a = grid[idx(r, c)]
      if (a === -1) continue
      if (a === grid[idx(r, c + 1)] && a === grid[idx(r, c + 2)]) {
        matched[idx(r, c)] = matched[idx(r, c + 1)] = matched[idx(r, c + 2)] = true
      }
    }
  }
  for (let c = 0; c < M3_COLS; c++) {
    for (let r = 0; r < M3_ROWS - 2; r++) {
      const a = grid[idx(r, c)]
      if (a === -1) continue
      if (a === grid[idx(r + 1, c)] && a === grid[idx(r + 2, c)]) {
        matched[idx(r, c)] = matched[idx(r + 1, c)] = matched[idx(r + 2, c)] = true
      }
    }
  }
  return matched
}

function applyGravity(grid: number[]): number[] {
  const next = [...grid]
  for (let c = 0; c < M3_COLS; c++) {
    const col: number[] = []
    for (let r = M3_ROWS - 1; r >= 0; r--) {
      if (next[idx(r, c)] !== -1) col.push(next[idx(r, c)])
    }
    while (col.length < M3_ROWS) col.push(randomColor())
    for (let r = M3_ROWS - 1; r >= 0; r--) {
      next[idx(r, c)] = col[M3_ROWS - 1 - r]
    }
  }
  return next
}

function resolve(grid: number[]): { grid: number[]; cleared: number } {
  let current = grid
  let cleared = 0
  for (let i = 0; i < 12; i++) {
    const matched = findMatches(current)
    const count = matched.filter(Boolean).length
    if (count === 0) break
    cleared += count
    const removed = current.map((v, i2) => (matched[i2] ? -1 : v))
    current = applyGravity(removed)
  }
  return { grid: current, cleared }
}

export function m3New(): M3State {
  let grid = Array.from({ length: M3_ROWS * M3_COLS }, randomColor)
  for (let i = 0; i < 8; i++) {
    const { grid: resolved, cleared } = resolve(grid)
    grid = resolved
    if (cleared === 0) break
  }
  return { grid, score: 0, lastCleared: 0 }
}

export function m3Swap(state: M3State, a: number, b: number): { state: M3State; moved: boolean } {
  const ra = Math.floor(a / M3_COLS)
  const ca = a % M3_COLS
  const rb = Math.floor(b / M3_COLS)
  const cb = b % M3_COLS
  if (Math.abs(ra - rb) + Math.abs(ca - cb) !== 1) return { state, moved: false }
  const swapped = [...state.grid]
  ;[swapped[a], swapped[b]] = [swapped[b], swapped[a]]
  const matched = findMatches(swapped)
  if (!matched.some(Boolean)) return { state, moved: false }
  const { grid, cleared } = resolve(swapped)
  return {
    state: { grid, score: state.score + cleared * 10, lastCleared: cleared },
    moved: true,
  }
}
