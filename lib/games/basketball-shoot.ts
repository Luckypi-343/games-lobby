// 籃球投籃 — 抓準時機停止上下移動的力度條，命中夠多球即過關。
export const BS_ATTEMPTS = 8
export const BS_WIN_MADE = 5

export interface BsState {
  power: number
  direction: 1 | -1
  attemptsLeft: number
  made: number
  flying: boolean
  lastResult: "in" | "out" | null
  over: boolean
  won: boolean
}

export function bsNew(): BsState {
  return {
    power: 0,
    direction: 1,
    attemptsLeft: BS_ATTEMPTS,
    made: 0,
    flying: false,
    lastResult: null,
    over: false,
    won: false,
  }
}

export function bsTickMeter(state: BsState): BsState {
  if (state.flying || state.over) return state
  let power = state.power + state.direction * 4
  let direction = state.direction
  if (power >= 100) {
    power = 100
    direction = -1
  } else if (power <= 0) {
    power = 0
    direction = 1
  }
  return { ...state, power, direction }
}

export function bsShoot(state: BsState): BsState {
  if (state.flying || state.over) return state
  const target = 50
  const distance = Math.abs(state.power - target)
  const made = distance <= 12
  const attemptsLeft = state.attemptsLeft - 1
  const madeCount = state.made + (made ? 1 : 0)
  const over = attemptsLeft <= 0
  const won = madeCount >= BS_WIN_MADE
  return {
    ...state,
    attemptsLeft,
    made: madeCount,
    flying: true,
    lastResult: made ? "in" : "out",
    over: over,
    won: over && won,
  }
}

export function bsNextAttempt(state: BsState): BsState {
  if (!state.flying) return state
  return { ...state, flying: false, power: 0, direction: 1 }
}
