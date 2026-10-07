export const NM_SIZE = 4
export const NM_TARGET = 2048

export interface NmState {
  grid: number[] // NM_SIZE*NM_SIZE, 0 = empty
  score: number
  best: number
  over: boolean
  won: boolean
}

function emptyGrid(): number[] {
  return Array.from({ length: NM_SIZE * NM_SIZE }, () => 0)
}

function randomEmptyIndex(grid: number[]): number | null {
  const empties = grid.reduce<number[]>((acc, v, i) => (v === 0 ? [...acc, i] : acc), [])
  if (empties.length === 0) return null
  return empties[Math.floor(Math.random() * empties.length)]
}

function spawnTile(grid: number[]): number[] {
  const next = [...grid]
  const idx = randomEmptyIndex(next)
  if (idx !== null) next[idx] = Math.random() < 0.9 ? 2 : 4
  return next
}

export function nmNew(): NmState {
  let grid = emptyGrid()
  grid = spawnTile(grid)
  grid = spawnTile(grid)
  return { grid, score: 0, best: 0, over: false, won: false }
}

function lineFor(grid: number[], row: number, col: number, dir: "up" | "down" | "left" | "right", i: number): number {
  if (dir === "left") return row * NM_SIZE + i
  if (dir === "right") return row * NM_SIZE + (NM_SIZE - 1 - i)
  if (dir === "up") return i * NM_SIZE + col
  return (NM_SIZE - 1 - i) * NM_SIZE + col
}

function collapseLine(values: number[]): { values: number[]; gained: number } {
  const nonZero = values.filter((v) => v !== 0)
  const merged: number[] = []
  let gained = 0
  let i = 0
  while (i < nonZero.length) {
    if (nonZero[i] === nonZero[i + 1]) {
      const val = nonZero[i] * 2
      merged.push(val)
      gained += val
      i += 2
    } else {
      merged.push(nonZero[i])
      i += 1
    }
  }
  while (merged.length < values.length) merged.push(0)
  return { values: merged, gained }
}

function hasMovesLeft(grid: number[]): boolean {
  if (grid.includes(0)) return true
  for (let row = 0; row < NM_SIZE; row++) {
    for (let col = 0; col < NM_SIZE; col++) {
      const idx = row * NM_SIZE + col
      const val = grid[idx]
      if (col < NM_SIZE - 1 && grid[idx + 1] === val) return true
      if (row < NM_SIZE - 1 && grid[idx + NM_SIZE] === val) return true
    }
  }
  return false
}

export function nmMove(state: NmState, dir: "up" | "down" | "left" | "right"): NmState {
  if (state.over) return state
  let moved = false
  let gained = 0
  const nextGrid = [...state.grid]

  const isVertical = dir === "up" || dir === "down"
  for (let a = 0; a < NM_SIZE; a++) {
    const rowOrCol = a
    const values: number[] = []
    for (let i = 0; i < NM_SIZE; i++) {
      const idx = isVertical ? lineFor(nextGrid, i, rowOrCol, dir, i) : lineFor(nextGrid, rowOrCol, i, dir, i)
      values.push(nextGrid[idx])
    }
    const { values: collapsed, gained: g } = collapseLine(values)
    gained += g
    for (let i = 0; i < NM_SIZE; i++) {
      const idx = isVertical ? lineFor(nextGrid, i, rowOrCol, dir, i) : lineFor(nextGrid, rowOrCol, i, dir, i)
      if (nextGrid[idx] !== collapsed[i]) moved = true
      nextGrid[idx] = collapsed[i]
    }
  }

  if (!moved) return state

  const spawned = spawnTile(nextGrid)
  const score = state.score + gained
  const won = state.won || spawned.includes(NM_TARGET)
  const over = !hasMovesLeft(spawned)

  return { grid: spawned, score, best: Math.max(state.best, score), over, won }
}
