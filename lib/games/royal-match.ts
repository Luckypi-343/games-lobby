// 皇家消除 — 交換相鄰徽章湊三連消賺取金幣，金幣累積到目標後完成城堡修復任務，三項任務都完成即過關。
export const RM_SIZE = 7
export const RM_COLORS = 6

export interface RMTask {
  name: string
  cost: number
}

export const RM_TASKS: RMTask[] = [
  { name: "修復城門吊橋", cost: 280 },
  { name: "重建皇家花園", cost: 450 },
  { name: "翻修王座大廳", cost: 650 },
]

export interface RMCell {
  color: number
}

export interface RMState {
  grid: RMCell[]
  score: number
  coins: number
  taskIndex: number
  lastCleared: number
  won: boolean
}

function idx(r: number, c: number) {
  return r * RM_SIZE + c
}

function randomColor(): number {
  return Math.floor(Math.random() * RM_COLORS)
}

function cloneGrid(grid: RMCell[]): RMCell[] {
  return grid.map((c) => ({ ...c }))
}

function findLines(grid: RMCell[]): number[][] {
  const lines: number[][] = []
  for (let r = 0; r < RM_SIZE; r++) {
    let run: number[] = []
    for (let c = 0; c <= RM_SIZE; c++) {
      const i = c < RM_SIZE ? idx(r, c) : -1
      const color = i >= 0 ? grid[i].color : -2
      if (run.length > 0 && (color === -1 || color !== grid[run[0]].color)) {
        if (run.length >= 3) lines.push([...run])
        run = []
      }
      if (i >= 0 && color >= 0) run.push(i)
    }
  }
  for (let c = 0; c < RM_SIZE; c++) {
    let run: number[] = []
    for (let r = 0; r <= RM_SIZE; r++) {
      const i = r < RM_SIZE ? idx(r, c) : -1
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

function resolve(grid: RMCell[], score: number, coins: number): { grid: RMCell[]; score: number; coins: number; cleared: number } {
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
    totalScore += toClear.size * 14
    totalCoins += toClear.size * 11

    const next = cloneGrid(current)
    toClear.forEach((i) => {
      next[i] = { color: -1 }
    })
    for (let c = 0; c < RM_SIZE; c++) {
      const col: RMCell[] = []
      for (let r = RM_SIZE - 1; r >= 0; r--) {
        if (next[idx(r, c)].color !== -1) col.push(next[idx(r, c)])
      }
      while (col.length < RM_SIZE) col.push({ color: randomColor() })
      for (let r = RM_SIZE - 1; r >= 0; r--) {
        next[idx(r, c)] = col[RM_SIZE - 1 - r]
      }
    }
    current = next
  }
  return { grid: current, score: totalScore, coins: totalCoins, cleared: totalCleared }
}

export function rmNew(): RMState {
  let grid: RMCell[] = Array.from({ length: RM_SIZE * RM_SIZE }, () => ({ color: randomColor() }))
  for (let i = 0; i < 10; i++) {
    const { grid: resolved, cleared } = resolve(grid, 0, 0)
    grid = resolved
    if (cleared === 0) break
  }
  return { grid, score: 0, coins: 0, taskIndex: 0, lastCleared: 0, won: false }
}

export function rmSwap(state: RMState, a: number, b: number): { state: RMState; moved: boolean } {
  if (state.won) return { state, moved: false }
  const ra = Math.floor(a / RM_SIZE)
  const ca = a % RM_SIZE
  const rb = Math.floor(b / RM_SIZE)
  const cb = b % RM_SIZE
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

export function rmCompleteTask(state: RMState): RMState {
  const task = RM_TASKS[state.taskIndex]
  if (!task || state.coins < task.cost) return state
  const taskIndex = state.taskIndex + 1
  const won = taskIndex >= RM_TASKS.length
  return { ...state, coins: state.coins - task.cost, taskIndex, won }
}
