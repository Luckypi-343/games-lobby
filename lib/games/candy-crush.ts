// 糖果傳奇 — 交換相鄰糖果湊出三連消，四連變成條紋糖，五連變成炫彩糖，限定步數內達成目標分數過關。
export const CC_SIZE = 8
export const CC_MOVE_LIMIT = 20
export const CC_TARGET_SCORE = 1200

export type CandyKind = "normal" | "striped-h" | "striped-v" | "wrapped" | "bomb"

export interface CandyCell {
  color: number // 0..5, -1 表示空格（即將被補位）
  kind: CandyKind
}

export interface CCState {
  grid: CandyCell[]
  score: number
  movesLeft: number
  lastCleared: number
  won: boolean
  lost: boolean
}

export const CC_COLORS = 6

function idx(r: number, c: number) {
  return r * CC_SIZE + c
}

function randomColor(): number {
  return Math.floor(Math.random() * CC_COLORS)
}

function cell(color: number, kind: CandyKind = "normal"): CandyCell {
  return { color, kind }
}

function cloneGrid(grid: CandyCell[]): CandyCell[] {
  return grid.map((c) => ({ ...c }))
}

// 找出所有長度 >= 3 的連線，回傳每條連線的座標陣列（水平 / 垂直分開回傳，方便判斷特殊糖）
function findLines(grid: CandyCell[]): { cells: number[]; horizontal: boolean }[] {
  const lines: { cells: number[]; horizontal: boolean }[] = []
  for (let r = 0; r < CC_SIZE; r++) {
    let run: number[] = []
    for (let c = 0; c <= CC_SIZE; c++) {
      const i = c < CC_SIZE ? idx(r, c) : -1
      const color = i >= 0 ? grid[i].color : -2
      if (run.length > 0 && (color === -1 || color !== grid[run[0]].color)) {
        if (run.length >= 3) lines.push({ cells: [...run], horizontal: true })
        run = []
      }
      if (i >= 0 && color >= 0) run.push(i)
    }
  }
  for (let c = 0; c < CC_SIZE; c++) {
    let run: number[] = []
    for (let r = 0; r <= CC_SIZE; r++) {
      const i = r < CC_SIZE ? idx(r, c) : -1
      const color = i >= 0 ? grid[i].color : -2
      if (run.length > 0 && (color === -1 || color !== grid[run[0]].color)) {
        if (run.length >= 3) lines.push({ cells: [...run], horizontal: false })
        run = []
      }
      if (i >= 0 && color >= 0) run.push(i)
    }
  }
  return lines
}

function resolve(grid: CandyCell[], score: number): { grid: CandyCell[]; score: number; cleared: number } {
  let current = cloneGrid(grid)
  let totalCleared = 0
  let totalScore = score
  for (let pass = 0; pass < 12; pass++) {
    const lines = findLines(current)
    if (lines.length === 0) break

    const toClear = new Set<number>()
    const specialsToSpawn: { at: number; kind: CandyKind; color: number }[] = []

    for (const line of lines) {
      line.cells.forEach((i) => toClear.add(i))
      if (line.cells.length >= 5) {
        specialsToSpawn.push({ at: line.cells[Math.floor(line.cells.length / 2)], kind: "bomb", color: current[line.cells[0]].color })
      } else if (line.cells.length === 4) {
        specialsToSpawn.push({
          at: line.cells[1],
          kind: line.horizontal ? "striped-h" : "striped-v",
          color: current[line.cells[0]].color,
        })
      }
    }

    // 特殊糖被消除時觸發額外清除範圍
    const extra = new Set<number>()
    toClear.forEach((i) => {
      const c = current[i]
      if (c.kind === "striped-h") {
        const r = Math.floor(i / CC_SIZE)
        for (let cc = 0; cc < CC_SIZE; cc++) extra.add(idx(r, cc))
      } else if (c.kind === "striped-v") {
        const cc = i % CC_SIZE
        for (let r = 0; r < CC_SIZE; r++) extra.add(idx(r, cc))
      } else if (c.kind === "wrapped") {
        const r = Math.floor(i / CC_SIZE)
        const cc = i % CC_SIZE
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr
            const nc = cc + dc
            if (nr >= 0 && nr < CC_SIZE && nc >= 0 && nc < CC_SIZE) extra.add(idx(nr, nc))
          }
      } else if (c.kind === "bomb") {
        const color = c.color
        current.forEach((cell2, i2) => {
          if (cell2.color === color) extra.add(i2)
        })
      }
    })
    extra.forEach((i) => toClear.add(i))

    totalCleared += toClear.size
    totalScore += toClear.size * 15

    const next = cloneGrid(current)
    toClear.forEach((i) => {
      next[i] = cell(-1)
    })
    specialsToSpawn.forEach((s) => {
      if (!toClear.has(s.at)) return
      next[s.at] = cell(s.color, s.kind)
    })

    // 重力：每列從下往上補位
    for (let c = 0; c < CC_SIZE; c++) {
      const col: CandyCell[] = []
      for (let r = CC_SIZE - 1; r >= 0; r--) {
        if (next[idx(r, c)].color !== -1) col.push(next[idx(r, c)])
      }
      while (col.length < CC_SIZE) col.push(cell(randomColor()))
      for (let r = CC_SIZE - 1; r >= 0; r--) {
        next[idx(r, c)] = col[CC_SIZE - 1 - r]
      }
    }
    current = next
  }
  return { grid: current, score: totalScore, cleared: totalCleared }
}

export function ccNew(): CCState {
  let grid: CandyCell[] = Array.from({ length: CC_SIZE * CC_SIZE }, () => cell(randomColor()))
  for (let i = 0; i < 10; i++) {
    const { grid: resolved, cleared } = resolve(grid, 0)
    grid = resolved
    if (cleared === 0) break
  }
  return { grid, score: 0, movesLeft: CC_MOVE_LIMIT, lastCleared: 0, won: false, lost: false }
}

export function ccSwap(state: CCState, a: number, b: number): { state: CCState; moved: boolean } {
  if (state.won || state.lost) return { state, moved: false }
  const ra = Math.floor(a / CC_SIZE)
  const ca = a % CC_SIZE
  const rb = Math.floor(b / CC_SIZE)
  const cb = b % CC_SIZE
  if (Math.abs(ra - rb) + Math.abs(ca - cb) !== 1) return { state, moved: false }

  const swapped = cloneGrid(state.grid)
  ;[swapped[a], swapped[b]] = [swapped[b], swapped[a]]

  // 炫彩糖 + 任意糖交換：直接清除整個該顏色
  const ca2 = swapped[a]
  const cb2 = swapped[b]
  let forced = false
  if (ca2.kind === "bomb" || cb2.kind === "bomb") forced = true

  const lines = findLines(swapped)
  if (lines.length === 0 && !forced) return { state, moved: false }

  const { grid, score, cleared } = resolve(swapped, state.score)
  const movesLeft = state.movesLeft - 1
  const won = score >= CC_TARGET_SCORE
  const lost = !won && movesLeft <= 0
  return {
    state: { grid, score, movesLeft, lastCleared: cleared, won, lost },
    moved: true,
  }
}
