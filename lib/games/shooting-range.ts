// 打靶場 — 隨機在網格上亮起目標，限時內點擊得分。
export interface SrTarget {
  id: number
  cell: number
  expiresAt: number
}

export interface SrState {
  targets: SrTarget[]
  score: number
  misses: number
  timeLeft: number
  over: boolean
  won: boolean
  nextId: number
}

export const SR_COLS = 5
export const SR_ROWS = 4
export const SR_DURATION = 30
export const SR_WIN_SCORE = 16

export function srNew(): SrState {
  return { targets: [], score: 0, misses: 0, timeLeft: SR_DURATION, over: false, won: false, nextId: 1 }
}

export function srSpawn(state: SrState, now: number): SrState {
  if (state.over) return state
  const occupied = new Set(state.targets.map((t) => t.cell))
  const free: number[] = []
  for (let i = 0; i < SR_COLS * SR_ROWS; i++) if (!occupied.has(i)) free.push(i)
  if (free.length === 0) return state
  const cell = free[Math.floor(Math.random() * free.length)]
  const life = Math.max(650, 1500 - state.score * 30)
  return {
    ...state,
    targets: [...state.targets, { id: state.nextId, cell, expiresAt: now + life }],
    nextId: state.nextId + 1,
  }
}

export function srTick(state: SrState, now: number, deltaSec: number): SrState {
  if (state.over) return state
  const survivors = state.targets.filter((t) => t.expiresAt > now)
  const missedCount = state.targets.length - survivors.length
  const timeLeft = Math.max(0, state.timeLeft - deltaSec)
  const over = timeLeft <= 0
  return {
    ...state,
    targets: survivors,
    misses: state.misses + missedCount,
    timeLeft,
    over,
    won: over ? state.score >= SR_WIN_SCORE : state.won,
  }
}

export function srHit(state: SrState, id: number): SrState {
  if (state.over) return state
  if (!state.targets.some((t) => t.id === id)) return state
  return { ...state, targets: state.targets.filter((t) => t.id !== id), score: state.score + 1 }
}
