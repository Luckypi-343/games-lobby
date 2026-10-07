export type Player = 1 | 2
export type GameStatus = "playing" | "win" | "draw"
export type GKCell = 0 | 1 | 2

export const GOMOKU_SIZE = 17

export interface GKState {
  board: GKCell[]
  turn: Player
  status: GameStatus
  winner: Player | null
  winLine: number[] | null
  last: number | null
}

function idx(r: number, c: number): number {
  return r * GOMOKU_SIZE + c
}

const DIRS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [1, -1],
]

export function gkEmpty(): GKState {
  return {
    board: Array(GOMOKU_SIZE * GOMOKU_SIZE).fill(0) as GKCell[],
    turn: 1,
    status: "playing",
    winner: null,
    winLine: null,
    last: null,
  }
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < GOMOKU_SIZE && c >= 0 && c < GOMOKU_SIZE
}

function checkWin(board: GKCell[], r: number, c: number, player: GKCell): number[] | null {
  for (const [dr, dc] of DIRS) {
    const line = [idx(r, c)]
    let rr = r + dr
    let cc = c + dc
    while (inBounds(rr, cc) && board[idx(rr, cc)] === player) {
      line.push(idx(rr, cc))
      rr += dr
      cc += dc
    }
    rr = r - dr
    cc = c - dc
    while (inBounds(rr, cc) && board[idx(rr, cc)] === player) {
      line.push(idx(rr, cc))
      rr -= dr
      cc -= dc
    }
    if (line.length >= 5) return line
  }
  return null
}

export function gkMove(s: GKState, r: number, c: number): GKState {
  const i = idx(r, c)
  if (s.status !== "playing" || s.board[i]) return s
  const board = [...s.board]
  board[i] = s.turn
  const win = checkWin(board, r, c, s.turn)
  if (win) return { ...s, board, status: "win", winner: s.turn, winLine: win, last: i }
  if (board.every((x) => x)) return { ...s, board, status: "draw", last: i }
  return { ...s, board, turn: s.turn === 1 ? 2 : 1, last: i }
}

const LINE_SCORE = [0, 0, 1, 12, 120, 20000, 20000]

function scoreCell(board: GKCell[], r: number, c: number, player: GKCell): number {
  let score = 0
  for (const [dr, dc] of DIRS) {
    let count = 1
    let openEnds = 0
    let rr = r + dr
    let cc = c + dc
    while (inBounds(rr, cc) && board[idx(rr, cc)] === player) {
      count++
      rr += dr
      cc += dc
    }
    if (inBounds(rr, cc) && board[idx(rr, cc)] === 0) openEnds++
    rr = r - dr
    cc = c - dc
    while (inBounds(rr, cc) && board[idx(rr, cc)] === player) {
      count++
      rr -= dr
      cc -= dc
    }
    if (inBounds(rr, cc) && board[idx(rr, cc)] === 0) openEnds++
    const base = LINE_SCORE[Math.min(count, 6)]
    score += base * (openEnds + 1)
  }
  return score
}

export function gkAiMove(s: GKState): { r: number; c: number } {
  const ai = s.turn
  const opp: GKCell = ai === 1 ? 2 : 1
  let best = -Infinity
  let bestCell = { r: Math.floor(GOMOKU_SIZE / 2), c: Math.floor(GOMOKU_SIZE / 2) }
  let hasStone = false
  for (const cell of s.board) {
    if (cell !== 0) {
      hasStone = true
      break
    }
  }
  if (!hasStone) return bestCell
  for (let r = 0; r < GOMOKU_SIZE; r++) {
    for (let c = 0; c < GOMOKU_SIZE; c++) {
      const i = idx(r, c)
      if (s.board[i] !== 0) continue
      const board = [...s.board]
      board[i] = ai
      const atk = scoreCell(board, r, c, ai)
      board[i] = opp
      const def = scoreCell(board, r, c, opp)
      const total = atk * 1.05 + def
      if (total > best) {
        best = total
        bestCell = { r, c }
      }
    }
  }
  return bestCell
}
