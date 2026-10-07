export type Player = 1 | 2
export type GameStatus = "playing" | "win" | "draw"
export type C4Cell = 0 | 1 | 2

export const C4_ROWS = 6
export const C4_COLS = 7

export interface C4State {
  board: C4Cell[]
  turn: Player
  status: GameStatus
  winner: Player | null
  line: number[] | null
  lastMove: number | null
}

function idx(row: number, col: number): number {
  return row * C4_COLS + col
}

export function c4Empty(): C4State {
  return {
    board: Array(C4_ROWS * C4_COLS).fill(0) as C4Cell[],
    turn: 1,
    status: "playing",
    winner: null,
    line: null,
    lastMove: null,
  }
}

// Lowest empty row in a column, or -1 if the column is full.
export function c4DropRow(board: C4Cell[], col: number): number {
  for (let row = C4_ROWS - 1; row >= 0; row--) {
    if (board[idx(row, col)] === 0) return row
  }
  return -1
}

export function c4ValidCols(board: C4Cell[]): number[] {
  const cols: number[] = []
  for (let c = 0; c < C4_COLS; c++) {
    if (c4DropRow(board, c) >= 0) cols.push(c)
  }
  return cols
}

const DIRECTIONS: [number, number][] = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

function c4CheckFrom(board: C4Cell[], row: number, col: number): number[] | null {
  const player = board[idx(row, col)]
  if (!player) return null
  for (const [dr, dc] of DIRECTIONS) {
    const cells = [idx(row, col)]
    for (const sign of [1, -1]) {
      let r = row + dr * sign
      let c = col + dc * sign
      while (r >= 0 && r < C4_ROWS && c >= 0 && c < C4_COLS && board[idx(r, c)] === player) {
        cells.push(idx(r, c))
        r += dr * sign
        c += dc * sign
      }
    }
    if (cells.length >= 4) return cells
  }
  return null
}

export function c4Check(board: C4Cell[]): { winner: Player | null; line: number[] | null } {
  for (let row = 0; row < C4_ROWS; row++) {
    for (let col = 0; col < C4_COLS; col++) {
      if (!board[idx(row, col)]) continue
      const line = c4CheckFrom(board, row, col)
      if (line) return { winner: board[idx(row, col)] as Player, line }
    }
  }
  return { winner: null, line: null }
}

export function c4Move(s: C4State, col: number): C4State {
  if (s.status !== "playing") return s
  const row = c4DropRow(s.board, col)
  if (row < 0) return s
  const board = [...s.board]
  board[idx(row, col)] = s.turn
  const { winner, line } = c4Check(board)
  const moveIdx = idx(row, col)
  if (winner) return { ...s, board, status: "win", winner, line, lastMove: moveIdx }
  if (c4ValidCols(board).length === 0) return { ...s, board, status: "draw", lastMove: moveIdx }
  return { ...s, board, turn: s.turn === 1 ? 2 : 1, lastMove: moveIdx }
}

// Lightweight heuristic AI: take an immediate win, otherwise block an immediate
// opponent win, otherwise prefer central columns (statistically strongest in Connect Four).
export function c4BestMove(s: C4State): number | null {
  const cols = c4ValidCols(s.board)
  if (cols.length === 0) return null
  const ai = s.turn
  const opp: Player = ai === 1 ? 2 : 1

  for (const col of cols) {
    const row = c4DropRow(s.board, col)
    const board = [...s.board]
    board[idx(row, col)] = ai
    if (c4Check(board).winner === ai) return col
  }

  for (const col of cols) {
    const row = c4DropRow(s.board, col)
    const board = [...s.board]
    board[idx(row, col)] = opp
    if (c4Check(board).winner === opp) return col
  }

  const center = (C4_COLS - 1) / 2
  const scored = cols
    .map((col) => ({ col, score: -Math.abs(col - center) + Math.random() * 0.3 }))
    .sort((a, b) => b.score - a.score)
  return scored[0].col
}
