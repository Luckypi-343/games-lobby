// 標準六角星棋盤（121 格），雙人對戰版本，玩家分別佔據相對的兩個尖角（各10顆棋子）。
export interface CubeCoord {
  x: number
  y: number
  z: number
}

const N = 4 // 中央六邊形半徑，星角三角形邊長

function key(c: CubeCoord): string {
  return `${c.x},${c.y},${c.z}`
}

function generateCells(): CubeCoord[] {
  const cells: CubeCoord[] = []
  for (let x = -2 * N; x <= 2 * N; x++) {
    for (let y = -2 * N; y <= 2 * N; y++) {
      const z = -x - y
      if (Math.abs(z) > 2 * N) continue
      const smallCount = [x, y, z].filter((v) => Math.abs(v) <= N).length
      if (smallCount >= 2) cells.push({ x, y, z })
    }
  }
  return cells
}

export const CC_CELLS: CubeCoord[] = generateCells()
const CELL_INDEX = new Map<string, number>()
CC_CELLS.forEach((c, i) => CELL_INDEX.set(key(c), i))

const DIRECTIONS: CubeCoord[] = [
  { x: 1, y: -1, z: 0 },
  { x: 1, y: 0, z: -1 },
  { x: 0, y: 1, z: -1 },
  { x: -1, y: 1, z: 0 },
  { x: -1, y: 0, z: 1 },
  { x: 0, y: -1, z: 1 },
]

function add(a: CubeCoord, b: CubeCoord): CubeCoord {
  return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }
}

function indexOf(c: CubeCoord): number {
  return CELL_INDEX.get(key(c)) ?? -1
}

// 每個格子的六個方向鄰居索引（-1 表示棋盤外）
const NEIGHBORS: number[][] = CC_CELLS.map((c) => DIRECTIONS.map((d) => indexOf(add(c, d))))
// 每個格子每個方向跳兩步的落點索引
const JUMP_TARGETS: number[][] = CC_CELLS.map((c) => DIRECTIONS.map((d) => indexOf(add(add(c, d), d))))

export type CCPlayer = 1 | 2
export type CCCellValue = 0 | CCPlayer
export interface CCMove {
  from: number
  to: number
}
export interface CCState {
  board: CCCellValue[]
  turn: CCPlayer
  status: "playing" | "win"
  winner: CCPlayer | null
}

// player 1 佔據 x 小於等於 -5 的三角區，往 +x 方向前進；player 2 相反
function homeIndices(large: "neg" | "pos"): number[] {
  return CC_CELLS.reduce<number[]>((acc, c, i) => {
    if (large === "neg" && c.x <= -(N + 1)) acc.push(i)
    if (large === "pos" && c.x >= N + 1) acc.push(i)
    return acc
  }, [])
}

const PLAYER1_HOME = homeIndices("neg")
const PLAYER2_HOME = homeIndices("pos")

export function ccEmpty(): CCState {
  const board: CCCellValue[] = new Array(CC_CELLS.length).fill(0)
  PLAYER1_HOME.forEach((i) => (board[i] = 1))
  PLAYER2_HOME.forEach((i) => (board[i] = 2))
  return { board, turn: 1, status: "playing", winner: null }
}

export function ccMovesFrom(board: CCCellValue[], from: number): number[] {
  const result = new Set<number>()
  // 單步移動
  for (const n of NEIGHBORS[from]) {
    if (n >= 0 && board[n] === 0) result.add(n)
  }
  // 連續跳躍（BFS）
  const visited = new Set<number>([from])
  const queue: number[] = [from]
  while (queue.length > 0) {
    const cur = queue.shift()!
    for (let d = 0; d < 6; d++) {
      const mid = NEIGHBORS[cur][d]
      const land = JUMP_TARGETS[cur][d]
      if (mid >= 0 && land >= 0 && board[mid] !== 0 && board[land] === 0 && !visited.has(land)) {
        visited.add(land)
        result.add(land)
        queue.push(land)
      }
    }
  }
  return Array.from(result)
}

export function ccAllMoves(board: CCCellValue[], player: CCPlayer): CCMove[] {
  const moves: CCMove[] = []
  board.forEach((v, i) => {
    if (v === player) {
      for (const to of ccMovesFrom(board, i)) moves.push({ from: i, to })
    }
  })
  return moves
}

function isWin(board: CCCellValue[], player: CCPlayer): boolean {
  const target = player === 1 ? PLAYER2_HOME : PLAYER1_HOME
  return target.every((i) => board[i] === player)
}

export function ccApply(state: CCState, move: CCMove): CCState {
  const board = [...state.board]
  const piece = board[move.from]
  board[move.from] = 0
  board[move.to] = piece
  if (isWin(board, state.turn)) {
    return { board, turn: state.turn, status: "win", winner: state.turn }
  }
  return { board, turn: state.turn === 1 ? 2 : 1, status: "playing", winner: null }
}

export function ccBestMove(state: CCState): CCMove | null {
  const player = state.turn
  const moves = ccAllMoves(state.board, player)
  if (moves.length === 0) return null
  let best: CCMove = moves[0]
  let bestScore = -Infinity
  for (const m of moves) {
    const fromX = CC_CELLS[m.from].x
    const toX = CC_CELLS[m.to].x
    const progress = player === 1 ? toX - fromX : fromX - toX
    if (progress > bestScore) {
      bestScore = progress
      best = m
    }
  }
  return best
}
