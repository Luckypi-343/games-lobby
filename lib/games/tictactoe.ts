export type Player = 1 | 2
export type GameStatus = "playing" | "win" | "draw"
export type TTCell = 0 | 1 | 2

export interface TTState {
  board: TTCell[]
  turn: Player
  status: GameStatus
  winner: Player | null
  line: number[] | null
}

const LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

export function ttEmpty(): TTState {
  return { board: Array(9).fill(0) as TTCell[], turn: 1, status: "playing", winner: null, line: null }
}

function ttCheck(board: TTCell[]): { winner: Player | null; line: number[] | null } {
  for (const l of LINES) {
    const [a, b, c] = l
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as Player, line: l }
    }
  }
  return { winner: null, line: null }
}

export function ttMove(s: TTState, i: number): TTState {
  if (s.status !== "playing" || s.board[i]) return s
  const board = [...s.board]
  board[i] = s.turn
  const { winner, line } = ttCheck(board)
  if (winner) return { ...s, board, status: "win", winner, line }
  if (board.every((c) => c)) return { ...s, board, status: "draw" }
  return { ...s, board, turn: s.turn === 1 ? 2 : 1 }
}

function ttMinimax(board: TTCell[], turn: Player, ai: Player, depth = 0): number {
  const { winner } = ttCheck(board)
  if (winner) return winner === ai ? 10 - depth : depth - 10
  if (board.every((c) => c)) return 0
  const avail = board.map((c, i) => (c === 0 ? i : -1)).filter((i) => i >= 0)
  const scores = avail.map((i) => {
    const b = [...board]
    b[i] = turn
    return ttMinimax(b, turn === 1 ? 2 : 1, ai, depth + 1)
  })
  return turn === ai ? Math.max(...scores) : Math.min(...scores)
}

export function ttAiMove(s: TTState): number {
  const avail = s.board.map((c, i) => (c === 0 ? i : -1)).filter((i) => i >= 0)
  let best = -Infinity
  let bestIdx = avail[0]
  for (const i of avail) {
    const board = [...s.board]
    board[i] = s.turn
    const score = ttMinimax(board, s.turn === 1 ? 2 : 1, s.turn)
    if (score > best) {
      best = score
      bestIdx = i
    }
  }
  return bestIdx
}
