// 夢幻家園 — 交換相鄰家飾湊三連消賺取金幣，金幣累積到目標後完成豪宅裝潢任務，三項任務都完成即過關。
export const HS_SIZE = 7
export const HS_COLORS = 6

export interface HSTask {
  name: string
  cost: number
}

export const HS_TASKS: HSTask[] = [
  { name: "粉刷客廳牆面", cost: 250 },
  { name: "鋪設木質地板", cost: 400 },
  { name: "更換豪華家具", cost: 600 },
]

export interface HSCell {
  color: number
}

export interface HSState {
  grid: HSCell[]
  score: number
  coins: number
  taskIndex: number
  lastCleared: number
  won: boolean
}

function idx(r: number, c: number) {
  return r * HS_SIZE + c
}

function randomColor(): number {
  return Math.floor(Math.random() * HS_COLORS)
}

function cloneGrid(grid: HSCell[]): HSCell[] {
  return grid.map((c) => ({ ...c }))
}

function findLines(grid: HSCell[]): number[][] {
  const lines: number[][] = []
  for (let r = 0; r < HS_SIZE; r++) {
    let run: number[] = []
    for (let c = 0; c <= HS_SIZE; c++) {
      const i = c < HS_SIZE ? idx(r, c) : -1
      const color = i >= 0 ? grid[i].color : -2
      if (run.length > 0 && (color === -1 || color !== grid[run[0]].color)) {
        if (run.length >= 3) lines.push([...run])
        run = []
      }
      if (i >= 0 && color >= 0) run.push(i)
    }
  }
  for (let c = 0; c < HS_SIZE; c++) {
    let run: number[] = []
    for (let r = 0; r <= HS_SIZE; r++) {
      const i = r < HS_SIZE ? idx(r, c) : -1
      const color = i >= 0 ? grid[i].color : -2
      if (run.length > 0 && (color === -1 || color !== grid[run[0]].color)) {
        if (run.length >= 3) lines.push([...run])
        run = []
      }
      if (i >= 0 && color >= 0) run.push(i)
    }
  }
  return lines
}

function resolve(grid: HSCell[], score: number, coins: number): { grid: HSCell[]; score: number; coins: number; cleared: number } {
  let current = cloneGrid(grid)
  let totalCleared = 0
  let totalScore = score
  let totalCoins = coins
  for (let pass = 0; pass < 12; pass++) {
    const lines = findLines(current)
    if (lines.length === 0) break
    const toClear = new Set<number>()
    lines.forEach((line) => line.forEach((i) => toClear.add(i)))
    totalCleared += toClear.size
    totalScore += toClear.size * 12
    totalCoins += toClear.size * 10

    const next = cloneGrid(current)
    toClear.forEach((i) => {
      next[i] = { color: -1 }
    })
    for (let c = 0; c < HS_SIZE; c++) {
      const col: HSCell[] = []
      for (let r = HS_SIZE - 1; r >= 0; r--) {
        if (next[idx(r, c)].color !== -1) col.push(next[idx(r, c)])
      }
      while (col.length < HS_SIZE) col.push({ color: randomColor() })
      for (let r = HS_SIZE - 1; r >= 0; r--) {
        next[idx(r, c)] = col[HS_SIZE - 1 - r]
      }
    }
    current = next
  }
  return { grid: current, score: totalScore, coins: totalCoins, cleared: totalCleared }
}

export function hsNew(): HSState {
  let grid: HSCell[] = Array.from({ length: HS_SIZE * HS_SIZE }, () => ({ color: randomColor() }))
  for (let i = 0; i < 10; i++) {
    const { grid: resolved, cleared } = resolve(grid, 0, 0)
    grid = resolved
    if (cleared === 0) break
  }
  return { grid, score: 0, coins: 0, taskIndex: 0, lastCleared: 0, won: false }
}

export function hsSwap(state: HSState, a: number, b: number): { state: HSState; moved: boolean } {
  if (state.won) return { state, moved: false }
  const ra = Math.floor(a / HS_SIZE)
  const ca = a % HS_SIZE
  const rb = Math.floor(b / HS_SIZE)
  const cb = b % HS_SIZE
  if (Math.abs(ra - rb) + Math.abs(ca - cb) !== 1) return { state, moved: false }

  const swapped = cloneGrid(state.grid)
  ;[swapped[a], swapped[b]] = [swapped[b], swapped[a]]

  const lines = findLines(swapped)
  if (lines.length === 0) return { state, moved: false }

  const { grid, score, coins, cleared } = resolve(swapped, state.score, state.coins)
  return {
    state: { ...state, grid, score, coins, lastCleared: cleared },
    moved: true,
  }
}

export function hsCompleteTask(state: HSState): HSState {
  const task = HS_TASKS[state.taskIndex]
  if (!task || state.coins < task.cost) return state
  const taskIndex = state.taskIndex + 1
  const won = taskIndex >= HS_TASKS.length
  return { ...state, coins: state.coins - task.cost, taskIndex, won }
}
