// 空戰爭霸 — 左右閃避並自動開火，限時內存活並達到目標分數即獲勝。
export const AC_COLS = 5
export const AC_ROWS = 10
export const AC_DURATION = 45
export const AC_WIN_SCORE = 25

export interface AcBullet {
  col: number
  row: number
}

export interface AcEnemy {
  id: number
  col: number
  row: number
}

export interface AcState {
  playerCol: number
  bullets: AcBullet[]
  enemies: AcEnemy[]
  lives: number
  score: number
  timeLeft: number
  spawnCooldown: number
  fireCooldown: number
  over: boolean
  won: boolean
  nextId: number
}

export function acNew(): AcState {
  return {
    playerCol: Math.floor(AC_COLS / 2),
    bullets: [],
    enemies: [],
    lives: 3,
    score: 0,
    timeLeft: AC_DURATION,
    spawnCooldown: 6,
    fireCooldown: 0,
    over: false,
    won: false,
    nextId: 1,
  }
}

export function acMove(state: AcState, dx: number): AcState {
  if (state.over) return state
  const col = Math.max(0, Math.min(AC_COLS - 1, state.playerCol + dx))
  return { ...state, playerCol: col }
}

export function acTick(state: AcState, deltaSec: number): AcState {
  if (state.over) return state

  let bullets = state.bullets.map((b) => ({ ...b, row: b.row - 1 })).filter((b) => b.row >= 0)
  let enemies = state.enemies.map((e) => ({ ...e, row: e.row + 1 }))

  let fireCooldown = state.fireCooldown - 1
  if (fireCooldown <= 0) {
    bullets = [...bullets, { col: state.playerCol, row: AC_ROWS - 2 }]
    fireCooldown = 5
  }

  let score = state.score
  const remainingEnemies: AcEnemy[] = []
  for (const e of enemies) {
    const hitIndex = bullets.findIndex((b) => b.col === e.col && b.row === e.row)
    if (hitIndex >= 0) {
      bullets = bullets.filter((_, i) => i !== hitIndex)
      score += 5
    } else {
      remainingEnemies.push(e)
    }
  }
  enemies = remainingEnemies

  let lives = state.lives
  const survivors: AcEnemy[] = []
  for (const e of enemies) {
    if (e.row >= AC_ROWS - 1) {
      if (e.col === state.playerCol) lives -= 1
    } else {
      survivors.push(e)
    }
  }
  enemies = survivors

  let spawnCooldown = state.spawnCooldown - 1
  if (spawnCooldown <= 0) {
    const col = Math.floor(Math.random() * AC_COLS)
    enemies = [...enemies, { id: state.nextId, col, row: 0 }]
    spawnCooldown = Math.max(5, 12 - Math.floor(score / 20))
  }

  const timeLeft = Math.max(0, state.timeLeft - deltaSec)
  const timeUp = timeLeft <= 0
  const over = lives <= 0 || timeUp
  const won = timeUp && lives > 0 && score >= AC_WIN_SCORE

  return {
    playerCol: state.playerCol,
    bullets,
    enemies,
    lives,
    score,
    timeLeft,
    spawnCooldown,
    fireCooldown,
    over,
    won,
    nextId: state.nextId + 1,
  }
}
