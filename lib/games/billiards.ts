// 撞球對戰 — 拖曳瞄準、放開發射，在有限次數內把所有球打進袋口。
export const BL_MAX_SHOTS = 15
export const BL_FRICTION = 0.985
export const BL_BALL_R = 2.6
export const BL_POCKET_R = 5.5

export interface BlBall {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  active: boolean
  hue: number
}

export interface BlState {
  cue: BlBall
  balls: BlBall[]
  shotsLeft: number
  pocketed: number
  moving: boolean
  over: boolean
  won: boolean
}

const POCKETS = [
  { x: 4, y: 4 },
  { x: 50, y: 3 },
  { x: 96, y: 4 },
  { x: 4, y: 96 },
  { x: 50, y: 97 },
  { x: 96, y: 96 },
]

const RACK = [
  { x: 70, y: 50, hue: 25 },
  { x: 78, y: 44, hue: 85 },
  { x: 78, y: 56, hue: 150 },
  { x: 86, y: 38, hue: 200 },
  { x: 86, y: 50, hue: 260 },
  { x: 86, y: 62, hue: 330 },
]

export function blNew(): BlState {
  return {
    cue: { id: 0, x: 22, y: 50, vx: 0, vy: 0, active: true, hue: 0 },
    balls: RACK.map((b, i) => ({ id: i + 1, x: b.x, y: b.y, vx: 0, vy: 0, active: true, hue: b.hue })),
    shotsLeft: BL_MAX_SHOTS,
    pocketed: 0,
    moving: false,
    over: false,
    won: false,
  }
}

export function blShoot(state: BlState, dx: number, dy: number): BlState {
  if (state.over || state.moving) return state
  const len = Math.hypot(dx, dy) || 1
  const power = Math.min(3.2, len / 14)
  return {
    ...state,
    cue: { ...state.cue, vx: (dx / len) * power, vy: (dy / len) * power },
    moving: true,
    shotsLeft: state.shotsLeft - 1,
  }
}

function resolveCollision(a: BlBall, b: BlBall) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.hypot(dx, dy) || 0.01
  const overlap = BL_BALL_R * 2 - dist
  if (overlap > 0) {
    const nx = dx / dist
    const ny = dy / dist
    a.x -= (nx * overlap) / 2
    a.y -= (ny * overlap) / 2
    b.x += (nx * overlap) / 2
    b.y += (ny * overlap) / 2
    const avx = a.vx
    const avy = a.vy
    a.vx = b.vx
    a.vy = b.vy
    b.vx = avx
    b.vy = avy
  }
}

export function blTick(state: BlState): BlState {
  if (state.over || !state.moving) return state
  const all: BlBall[] = [{ ...state.cue }, ...state.balls.map((b) => ({ ...b }))]

  for (const b of all) {
    if (!b.active) continue
    b.x += b.vx
    b.y += b.vy
    b.vx *= BL_FRICTION
    b.vy *= BL_FRICTION
    if (Math.hypot(b.vx, b.vy) < 0.02) {
      b.vx = 0
      b.vy = 0
    }
    if (b.x < BL_BALL_R) {
      b.x = BL_BALL_R
      b.vx = Math.abs(b.vx)
    }
    if (b.x > 100 - BL_BALL_R) {
      b.x = 100 - BL_BALL_R
      b.vx = -Math.abs(b.vx)
    }
    if (b.y < BL_BALL_R) {
      b.y = BL_BALL_R
      b.vy = Math.abs(b.vy)
    }
    if (b.y > 100 - BL_BALL_R) {
      b.y = 100 - BL_BALL_R
      b.vy = -Math.abs(b.vy)
    }
  }

  for (let i = 0; i < all.length; i++) {
    for (let j = i + 1; j < all.length; j++) {
      if (!all[i].active || !all[j].active) continue
      const dist = Math.hypot(all[j].x - all[i].x, all[j].y - all[i].y)
      if (dist < BL_BALL_R * 2) resolveCollision(all[i], all[j])
    }
  }

  let pocketed = state.pocketed
  for (const b of all) {
    if (!b.active) continue
    for (const p of POCKETS) {
      if (Math.hypot(b.x - p.x, b.y - p.y) < BL_POCKET_R) {
        b.active = false
        if (b.id !== 0) pocketed += 1
        break
      }
    }
  }

  const cue = all[0]
  const balls = all.slice(1)
  const moving = all.some((b) => b.active && (Math.abs(b.vx) > 0.001 || Math.abs(b.vy) > 0.001))

  let cueOut = cue
  if (!cue.active) {
    cueOut = { ...cue, active: true, x: 22, y: 50, vx: 0, vy: 0 }
  }

  const remaining = balls.some((b) => b.active)
  const won = !remaining
  const over = won || (!moving && state.shotsLeft <= 0)

  return { cue: cueOut, balls, shotsLeft: state.shotsLeft, pocketed, moving, over, won }
}
