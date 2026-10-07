// 賽車競速 — 左右切換車道閃避對向來車，抵達終點距離即獲勝。
export const RC_LANES = 3
export const RC_ROWS = 10
export const RC_GOAL_DISTANCE = 600
export const RC_LIVES = 3

export interface RcObstacle {
  id: number
  lane: number
  row: number
}

export interface RcState {
  lane: number
  obstacles: RcObstacle[]
  distance: number
  lives: number
  speed: number
  spawnCooldown: number
  nextId: number
  over: boolean
  won: boolean
}

export function rcNew(): RcState {
  return {
    lane: 1,
    obstacles: [],
    distance: 0,
    lives: RC_LIVES,
    speed: 1,
    spawnCooldown: 5,
    nextId: 1,
    over: false,
    won: false,
  }
}

export function rcChangeLane(state: RcState, dx: number): RcState {
  if (state.over) return state
  const lane = Math.max(0, Math.min(RC_LANES - 1, state.lane + dx))
  return { ...state, lane }
}

export function rcTick(state: RcState): RcState {
  if (state.over) return state

  let obstacles = state.obstacles.map((o) => ({ ...o, row: o.row + state.speed })).filter((o) => o.row < RC_ROWS + 1)

  let lives = state.lives
  const survivors: RcObstacle[] = []
  for (const o of obstacles) {
    if (o.row >= RC_ROWS - 1 && o.row < RC_ROWS && o.lane === state.lane) {
      lives -= 1
    } else {
      survivors.push(o)
    }
  }
  obstacles = survivors

  let spawnCooldown = state.spawnCooldown - 1
  if (spawnCooldown <= 0) {
    const lane = Math.floor(Math.random() * RC_LANES)
    obstacles = [...obstacles, { id: state.nextId, lane, row: 0 }]
    spawnCooldown = Math.max(4, 9 - Math.floor(state.distance / 100))
  }

  const distance = state.distance + state.speed * 3
  const speed = Math.min(2.4, 1 + distance / 400)
  const won = distance >= RC_GOAL_DISTANCE && lives > 0
  const over = lives <= 0 || won

  return {
    lane: state.lane,
    obstacles,
    distance: Math.min(distance, RC_GOAL_DISTANCE),
    lives,
    speed,
    spawnCooldown,
    nextId: state.nextId + 1,
    over,
    won,
  }
}
