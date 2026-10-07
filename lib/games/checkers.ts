export type Player = 1 | 2
export type GameStatus = "playing" | "win"
export type CKPiece = 0 | 1 | 2 | 3 | 4 // 0 empty, 1/2 men, 3/4 kings

export const CK_SIZE = 8

export interface CKState {
  board: CKPiece[]
  turn: Player
  status: GameStatus
  winner: Player | null
}

export interface CKMove {
  from: number
  to: number
  captures: number[]
}

function idx(r: number, c: number): number {
  return r * CK_SIZE + c
}

export function ckEmpty(): CKState {
  const board = Array(64).fill(0) as CKPiece[]
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) board[idx(r, c)] = 2
    }
  }
  for (let r = 5; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) board[idx(r, c)] = 1
    }
  }
  return { board, turn: 1, status: "playing", winner: null }
}

function owner(p: CKPiece): Player | 0 {
  if (p === 1 || p === 3) return 1
  if (p === 2 || p === 4) return 2
  return 0
}

function isKing(p: CKPiece): boolean {
  return p === 3 || p === 4
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < CK_SIZE && c >= 0 && c < CK_SIZE
}

export function ckMovesFor(board: CKPiece[], player: Player): CKMove[] {
  const simple: CKMove[] = []
  const capture: CKMove[] = []
  for (let r = 0; r < CK_SIZE; r++) {
    for (let c = 0; c < CK_SIZE; c++) {
      const i = idx(r, c)
      const p = board[i]
      if (owner(p) !== player) continue
      const king = isKing(p)
      const dirs = king
        ? [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1],
          ]
        : player === 1
          ? [
              [-1, -1],
              [-1, 1],
            ]
          : [
              [1, -1],
              [1, 1],
            ]
      for (const [dr, dc] of dirs) {
        const nr = r + dr
        const nc = c + dc
        if (inBounds(nr, nc) && board[idx(nr, nc)] === 0) {
          simple.push({ from: i, to: idx(nr, nc), captures: [] })
        }
        const jr = r + dr * 2
        const jc = c + dc * 2
        if (
          inBounds(nr, nc) &&
          inBounds(jr, jc) &&
          board[idx(nr, nc)] !== 0 &&
          owner(board[idx(nr, nc)]) !== player &&
          board[idx(jr, jc)] === 0
        ) {
          capture.push({ from: i, to: idx(jr, jc), captures: [idx(nr, nc)] })
        }
      }
    }
  }
  return capture.length ? capture : simple
}

export function ckApply(s: CKState, move: CKMove): CKState {
  const board = [...s.board]
  const piece = board[move.from]
  board[move.from] = 0
  for (const cap of move.captures) board[cap] = 0
  const toRow = Math.floor(move.to / CK_SIZE)
  let placed: CKPiece = piece
  if (piece === 1 && toRow === 0) placed = 3
  if (piece === 2 && toRow === CK_SIZE - 1) placed = 4
  board[move.to] = placed
  const next: Player = s.turn === 1 ? 2 : 1
  const nextMoves = ckMovesFor(board, next)
  if (!nextMoves.length) {
    return { board, turn: s.turn, status: "win", winner: s.turn }
  }
  return { board, turn: next, status: "playing", winner: null }
}

export function ckAiMove(s: CKState): CKMove | null {
  const moves = ckMovesFor(s.board, s.turn)
  if (!moves.length) return null
  let best = -Infinity
  let bestMove = moves[0]
  for (const m of moves) {
    let score = m.captures.length * 5
    const toRow = Math.floor(m.to / CK_SIZE)
    if ((s.turn === 1 && toRow === 0) || (s.turn === 2 && toRow === CK_SIZE - 1)) score += 8
    score += Math.random() * 2
    if (score > best) {
      best = score
      bestMove = m
    }
  }
  return bestMove
}
