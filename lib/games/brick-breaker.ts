// 打磚塊 — 滑動擋板反彈球，打光所有磚塊即過關。
export const BB_COLS = 6
export const BB_ROWS = 5
export const BB_LIVES = 3

const BRICK_TOP = 8
const BRICK_ROW_H = 6
const PADDLE_Y = 90

export interface BbState {
  paddleX: number
  paddleWidth: number
  ball: { x: number; y: number; vx: number; vy: number }
  bricks: boolean[][]
  lives: number
  score: number
  over: boolean
  won: boolean
  launched: boolean
}

export function bbNew(): BbState {
  const bricks = Array.from({ length: BB_ROWS }, () => Array<boolean>(BB_COLS).fill(true))
  return {
    paddleX: 50,
    paddleWidth: 22,
    ball: { x: 50, y: PADDLE_Y - 3, vx: 1.1, vy: -1.6 },
    bricks,
    lives: BB_LIVES,
    score: 0,
    over: false,
    won: false,
    launched: false,
  }
}

export function bbMovePaddle(state: BbState, x: number): BbState {
  if (state.over) return state
  const half = state.paddleWidth / 2
  const paddleX = Math.max(half, Math.min(100 - half, x))
  if (!state.launched) {
    return { ...state, paddleX, ball: { ...state.ball, x: paddleX } }
  }
  return { ...state, paddleX }
}

export function bbLaunch(state: BbState): BbState {
  if (state.launched || state.over) return state
  return { ...state, launched: true }
}

function brickColFor(x: number): number {
  return Math.max(0, Math.min(BB_COLS - 1, Math.floor((x / 100) * BB_COLS)))
}

export function bbTick(state: BbState): BbState {
  if (state.over || !state.launched) return state
  let { x, y, vx, vy } = state.ball

  x += vx
  y += vy

  if (x <= 1) {
    x = 1
    vx = Math.abs(vx)
  }
  if (x >= 99) {
    x = 99
    vx = -Math.abs(vx)
  }
  if (y <= 1) {
    y = 1
    vy = Math.abs(vy)
  }

  let bricks = state.bricks
  let score = state.score
  const rowIndex = Math.floor((y - BRICK_TOP) / BRICK_ROW_H)
  if (rowIndex >= 0 && rowIndex < BB_ROWS && y >= BRICK_TOP) {
    const col = brickColFor(x)
    if (bricks[rowIndex][col]) {
      bricks = bricks.map((row, r) => (r === rowIndex ? row.map((v, c) => (c === col ? false : v)) : row))
      vy = Math.abs(vy)
      score += 10
    }
  }

  const half = state.paddleWidth / 2
  let lives = state.lives
  let launched = true
  let ballOut = { x, y, vx, vy }

  if (y >= PADDLE_Y - 2 && y <= PADDLE_Y + 2 && x >= state.paddleX - half && x <= state.paddleX + half && vy > 0) {
    const rel = (x - state.paddleX) / half
    ballOut = { x, y: PADDLE_Y - 2, vx: rel * 1.8, vy: -Math.abs(vy) }
  } else if (y > 100) {
    lives -= 1
    if (lives > 0) {
      ballOut = { x: state.paddleX, y: PADDLE_Y - 3, vx: 1.1, vy: -1.6 }
      launched = false
    }
  }

  const remaining = bricks.some((row) => row.some(Boolean))
  const over = lives <= 0 || !remaining
  const won = !remaining && lives > 0

  return {
    ...state,
    ball: ballOut,
    bricks,
    lives,
    score,
    launched: over ? state.launched : launched,
    over,
    won,
  }
}
