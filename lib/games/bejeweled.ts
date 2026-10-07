// 寶石迷陣 — 三消遊戲鼻祖，交換相鄰寶石湊出同色連線消除並連鎖補位，沒有步數限制，持續累積分數。
export const BJ_SIZE = 8
export const BJ_GEM_TYPES = 7

export interface BJState {
  grid: number[]
  score: number
  lastCleared: number
  combo: number
}

function idx(r: number, c: number) {
  return r * BJ_SIZE + c
}

function randomGem(): number {
  return Math.floor(Math.random() * BJ_GEM_TYPES)
}

function findMatches(grid: number[]): boolean[] {
  const matched = Array(grid.length).fill(false)
  for (let r = 0; r < BJ_SIZE; r++) {
    for (let c = 0; c < BJ_SIZE - 2; c++) {
      const a = grid[idx(r, c)]
      if (a === -1) continue
      if (a === grid[idx(r, c + 1)] && a === grid[idx(r, c + 2)]) {
        matched[idx(r, c)] = matched[idx(r, c + 1)] = matched[idx(r, c + 2)] = true
      }
    }
  }
  for (let c = 0; c < BJ_SIZE; c++) {
    for (let r = 0; r < BJ_SIZE - 2; r++) {
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
  for (let c = 0; c < BJ_SIZE; c++) {
    const col: number[] = []
    for (let r = BJ_SIZE - 1; r >= 0; r--) {
      if (next[idx(r, c)] !== -1) col.push(next[idx(r, c)])
    }
    while (col.length < BJ_SIZE) col.push(randomGem())
    for (let r = BJ_SIZE - 1; r >= 0; r--) {
      next[idx(r, c)] = col[BJ_SIZE - 1 - r]
    }
  }
  return next
}

function resolve(grid: number[]): { grid: number[]; cleared: number; combo: number } {
  let current = grid
  let cleared = 0
  let combo = 0
  for (let i = 0; i < 14; i++) {
    const matched = findMatches(current)
    const count = matched.filter(Boolean).length
    if (count === 0) break
    combo++
    cleared += count
    const removed = current.map((v, i2) => (matched[i2] ? -1 : v))
    current = applyGravity(removed)
  }
  return { grid: current, cleared, combo }
}

export function bjNew(): BJState {
  let grid = Array.from({ length: BJ_SIZE * BJ_SIZE }, randomGem)
  for (let i = 0; i < 10; i++) {
    const { grid: resolved, cleared } = resolve(grid)
    grid = resolved
    if (cleared === 0) break
  }
  return { grid, score: 0, lastCleared: 0, combo: 0 }
}

export function bjSwap(state: BJState, a: number, b: number): { state: BJState; moved: boolean } {
  const ra = Math.floor(a / BJ_SIZE)
  const ca = a % BJ_SIZE
  const rb = Math.floor(b / BJ_SIZE)
  const cb = b % BJ_SIZE
  if (Math.abs(ra - rb) + Math.abs(ca - cb) !== 1) return { state, moved: false }
  const swapped = [...state.grid]
  ;[swapped[a], swapped[b]] = [swapped[b], swapped[a]]
  const matched = findMatches(swapped)
  if (!matched.some(Boolean)) return { state, moved: false }
  const { grid, cleared, combo } = resolve(swapped)
  const comboBonus = combo > 1 ? combo * 20 : 0
  return {
    state: { grid, score: state.score + cleared * 12 + comboBonus, lastCleared: cleared, combo },
    moved: true,
  }
}
