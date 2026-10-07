// 太空侵略者 — 固定編隊由上往下逼近，清光整編隊即獲勝。
export const SI_COLS = 7
export const SI_ALIEN_ROWS = 3
export const SI_GRID_ROWS = 9

export interface SiBullet {
  col: number
  row: number
}

export interface SiState {
  alive: boolean[][]
  offsetRow: number
  dir: 1 | -1
  colOffset: number
  playerCol: number
  playerBullet: SiBullet | null
  enemyBullets: SiBullet[]
  lives: number
  score: number
  over: boolean
  won: boolean
}

export function siNew(): SiState {
  const alive = Array.from({ length: SI_ALIEN_ROWS }, () => Array<boolean>(SI_COLS).fill(true))
  return {
    alive,
    offsetRow: 0,
    dir: 1,
    colOffset: 0,
    playerCol: Math.floor(SI_COLS / 2),
    playerBullet: null,
    enemyBullets: [],
    lives: 3,
    score: 0,
    over: false,
    won: false,
  }
}

function aliveCount(alive: boolean[][]): number {
  return alive.reduce((sum, row) => sum + row.filter(Boolean).length, 0)
}

export function siMove(state: SiState, dx: number): SiState {
  if (state.over) return state
  const col = Math.max(0, Math.min(SI_COLS - 1, state.playerCol + dx))
  return { ...state, playerCol: col }
}

export function siShoot(state: SiState): SiState {
  if (state.over || state.playerBullet) return state
  return { ...state, playerBullet: { col: state.playerCol, row: SI_GRID_ROWS - 2 } }
}

export function siTick(state: SiState): SiState {
  if (state.over) return state
  const alive = state.alive.map((r) => [...r])
  let dir = state.dir
  let colOffset = state.colOffset
  let offsetRow = state.offsetRow

  const nextOffset = colOffset + dir
  if (nextOffset < 0 || nextOffset > 1) {
    dir = (dir * -1) as 1 | -1
    offsetRow += 1
  } else {
    colOffset = nextOffset
  }

  let playerBullet = state.playerBullet
  let score = state.score
  if (playerBullet) {
    const row = playerBullet.row - 1
    if (row < 0) {
      playerBullet = null
    } else {
      const alienRow = row - offsetRow
      if (alienRow >= 0 && alienRow < SI_ALIEN_ROWS && alive[alienRow][playerBullet.col]) {
        alive[alienRow][playerBullet.col] = false
        score += 10
        playerBullet = null
      } else {
        playerBullet = { ...playerBullet, row }
      }
    }
  }

  let enemyBullets = state.enemyBullets.map((b) => ({ ...b, row: b.row + 1 }))
  if (Math.random() < 0.22 && aliveCount(alive) > 0) {
    const cols: number[] = []
    for (let c = 0; c < SI_COLS; c++) {
      for (let r = SI_ALIEN_ROWS - 1; r >= 0; r--) {
        if (alive[r][c]) {
          cols.push(c)
          break
        }
      }
    }
    if (cols.length) {
      const col = cols[Math.floor(Math.random() * cols.length)]
      let topRow = -1
      for (let r = SI_ALIEN_ROWS - 1; r >= 0; r--) {
        if (alive[r][col]) {
          topRow = r
          break
        }
      }
      enemyBullets.push({ col, row: topRow + offsetRow + 1 })
    }
  }

  let lives = state.lives
  const playerRow = SI_GRID_ROWS - 1
  const survivedBullets: SiBullet[] = []
  for (const b of enemyBullets) {
    if (b.row >= playerRow && b.col === state.playerCol) {
      lives -= 1
    } else if (b.row < SI_GRID_ROWS) {
      survivedBullets.push(b)
    }
  }
  enemyBullets = survivedBullets

  const remaining = aliveCount(alive)
  const reachedPlayer = offsetRow + SI_ALIEN_ROWS >= playerRow
  const over = lives <= 0 || remaining === 0 || reachedPlayer
  const won = remaining === 0 && lives > 0 && !reachedPlayer

  return {
    alive,
    offsetRow,
    dir,
    colOffset,
    playerCol: state.playerCol,
    playerBullet,
    enemyBullets,
    lives,
    score,
    over,
    won,
  }
}
