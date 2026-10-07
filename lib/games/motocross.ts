// 越野摩托車 — 抓準時機跳躍越過坑洞與障礙，抵達終點即獲勝。
export const MX_GOAL_DISTANCE = 500
export const MX_LIVES = 3

export interface MxObstacle {
  id: number
  distance: number
  passed: boolean
}

export interface MxState {
  distance: number
  speed: number
  airborne: boolean
  airTime: number
  obstacles: MxObstacle[]
  lives: number
  nextId: number
  spawnAt: number
  over: boolean
  won: boolean
}

export function mxNew(): MxState {
  return {
    distance: 0,
    speed: 2.4,
    airborne: false,
    airTime: 0,
    obstacles: [{ id: 1, distance: 60, passed: false }],
    lives: MX_LIVES,
    nextId: 2,
    spawnAt: 130,
    over: false,
    won: false,
  }
}

export function mxJump(state: MxState): MxState {
  if (state.over || state.airborne) return state
  return { ...state, airborne: true, airTime: 14 }
}

export function mxTick(state: MxState): MxState {
  if (state.over) return state

  const distance = state.distance + state.speed
  let airborne = state.airborne
  let airTime = state.airTime
  if (airborne) {
    airTime -= 1
    if (airTime <= 0) airborne = false
  }

  let lives = state.lives
  const obstacles = state.obstacles.map((o) => ({ ...o }))
  for (const o of obstacles) {
    if (!o.passed && distance >= o.distance) {
      o.passed = true
      if (!airborne) lives -= 1
    }
  }

  let nextId = state.nextId
  let spawnAt = state.spawnAt
  let list = obstacles
  if (distance >= spawnAt - 60 && !obstacles.some((o) => o.distance === spawnAt)) {
    list = [...obstacles, { id: nextId, distance: spawnAt, passed: false }]
    nextId += 1
    spawnAt += 90 + Math.random() * 40
  }

  const won = distance >= MX_GOAL_DISTANCE && lives > 0
  const over = lives <= 0 || won

  return {
    distance: Math.min(distance, MX_GOAL_DISTANCE),
    speed: state.speed,
    airborne,
    airTime,
    obstacles: list.filter((o) => o.distance > distance - 40),
    lives,
    nextId,
    spawnAt,
    over,
    won,
  }
}
