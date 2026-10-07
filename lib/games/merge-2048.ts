export type Merge2048Cell = number | null

export interface Merge2048State {
  grid: Merge2048Cell[][]
  score: number
  best: number
  moved: boolean
  finished: boolean
  won: boolean
  message: string
}

const SIZE = 4

function emptyGrid(): Merge2048Cell[][] {
  return Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => null as Merge2048Cell))
}

function randomSpawnValue(): number {
  return Math.random() < 0.9 ? 2 : 4
}

function emptyCells(grid: Merge2048Cell[][]): Array<{ r: number; c: number }> {
  const cells: Array<{ r: number; c: number }> = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (grid[r][c] === null) cells.push({ r, c })
    }
  }
  return cells
}

function spawnTile(grid: Merge2048Cell[][]): Merge2048Cell[][] {
  const cells = emptyCells(grid)
  if (cells.length === 0) return grid
  const pick = cells[Math.floor(Math.random() * cells.length)]
  const next = grid.map((row) => [...row])
  next[pick.r][pick.c] = randomSpawnValue()
  return next
}

export function dealMerge2048(best = 0): Merge2048State {
  let grid = emptyGrid()
  grid = spawnTile(grid)
  grid = spawnTile(grid)
  return {
    grid,
    score: 0,
    best,
    moved: false,
    finished: false,
    won: false,
    message: "向上/下/左/右滑動或用方向鍵，合併出 2048！",
  }
}

/** Compresses & merges a single line (array of SIZE cells) toward index 0. Returns new line + score gained + whether it changed. */
function collapseLine(line: Merge2048Cell[]): { line: Merge2048Cell[]; gained: number; changed: boolean } {
  const values = line.filter((v): v is number => v !== null)
  const merged: number[] = []
  let gained = 0
  let i = 0
  while (i < values.length) {
    if (i + 1 < values.length && values[i] === values[i + 1]) {
      const sum = values[i] * 2
      merged.push(sum)
      gained += sum
      i += 2
    } else {
      merged.push(values[i])
      i += 1
    }
  }
  while (merged.length < SIZE) merged.push(0)
  const newLine: Merge2048Cell[] = merged.map((v) => (v === 0 ? null : v))
  const changed = newLine.some((v, idx) => v !== line[idx])
  return { line: newLine, gained, changed }
}

function getLine(grid: Merge2048Cell[][], dir: "left" | "right" | "up" | "down", index: number): Merge2048Cell[] {
  if (dir === "left") return [...grid[index]]
  if (dir === "right") return [...grid[index]].reverse()
  if (dir === "up") return grid.map((row) => row[index])
  return grid.map((row) => row[index]).reverse()
}

function setLine(grid: Merge2048Cell[][], dir: "left" | "right" | "up" | "down", index: number, line: Merge2048Cell[]) {
  if (dir === "left") {
    grid[index] = [...line]
  } else if (dir === "right") {
    grid[index] = [...line].reverse()
  } else if (dir === "up") {
    for (let r = 0; r < SIZE; r++) grid[r][index] = line[r]
  } else {
    const reversed = [...line].reverse()
    for (let r = 0; r < SIZE; r++) grid[r][index] = reversed[r]
  }
}

function canMove(grid: Merge2048Cell[][]): boolean {
  for (const dir of ["left", "right", "up", "down"] as const) {
    for (let i = 0; i < SIZE; i++) {
      const line = getLine(grid, dir, i)
      if (collapseLine(line).changed) return true
    }
  }
  return false
}

export function slide(state: Merge2048State, dir: "left" | "right" | "up" | "down"): Merge2048State {
  if (state.finished) return state
  const grid = state.grid.map((row) => [...row])
  let gained = 0
  let changed = false
  for (let i = 0; i < SIZE; i++) {
    const line = getLine(grid, dir, i)
    const result = collapseLine(line)
    if (result.changed) changed = true
    gained += result.gained
    setLine(grid, dir, i, result.line)
  }
  if (!changed) {
    return { ...state, moved: false }
  }
  const spawned = spawnTile(grid)
  const score = state.score + gained
  const best = Math.max(state.best, score)
  const won = state.won || spawned.some((row) => row.some((v) => v !== null && v >= 2048))
  const finished = !canMove(spawned)
  return {
    grid: spawned,
    score,
    best,
    moved: true,
    finished,
    won,
    message: finished ? "盤面已滿且無法再合併，挑戰結束！" : won && !state.won ? "恭喜合成 2048！可以繼續挑戰更高分數。" : state.message,
  }
}

/** Recommends a swipe direction using a simple corner-anchor + monotonic heuristic (anchors the largest tile at bottom-left). */
export function suggestDirection(grid: Merge2048Cell[][]): "left" | "right" | "up" | "down" {
  const dirs: Array<"left" | "right" | "up" | "down"> = ["left", "down", "right", "up"]
  for (const dir of dirs) {
    const grid2 = grid.map((row) => [...row])
    let changed = false
    for (let i = 0; i < SIZE; i++) {
      const line = getLine(grid2, dir, i)
      const result = collapseLine(line)
      if (result.changed) changed = true
    }
    if (changed) return dir
  }
  return "left"
}

export function maxTile(grid: Merge2048Cell[][]): number {
  let max = 0
  for (const row of grid) {
    for (const v of row) {
      if (v !== null && v > max) max = v
    }
  }
  return max
}
