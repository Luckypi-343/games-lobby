export type ChessColor = "w" | "b"
export type PieceType = "p" | "n" | "b" | "r" | "q" | "k"
export interface ChessPiece {
  type: PieceType
  color: ChessColor
}
export type ChessBoard = (ChessPiece | null)[] // 64 cells, index = row*8+col, row 0 = black back rank

export interface ChessMove {
  from: number
  to: number
}

const PIECE_VALUE: Record<PieceType, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

export function chessInitialBoard(): ChessBoard {
  const back: PieceType[] = ["r", "n", "b", "q", "k", "b", "n", "r"]
  const board: ChessBoard = new Array(64).fill(null)
  for (let c = 0; c < 8; c++) {
    board[0 * 8 + c] = { type: back[c], color: "b" }
    board[1 * 8 + c] = { type: "p", color: "b" }
    board[6 * 8 + c] = { type: "p", color: "w" }
    board[7 * 8 + c] = { type: back[c], color: "w" }
  }
  return board
}

function rc(i: number): [number, number] {
  return [Math.floor(i / 8), i % 8]
}
function idx(row: number, col: number): number | null {
  if (row < 0 || row > 7 || col < 0 || col > 7) return null
  return row * 8 + col
}

function slide(board: ChessBoard, from: number, dirs: [number, number][], color: ChessColor): number[] {
  const [row, col] = rc(from)
  const moves: number[] = []
  for (const [dr, dc] of dirs) {
    let r = row + dr
    let c = col + dc
    while (r >= 0 && r <= 7 && c >= 0 && c <= 7) {
      const target = idx(r, c)!
      const occupant = board[target]
      if (!occupant) {
        moves.push(target)
      } else {
        if (occupant.color !== color) moves.push(target)
        break
      }
      r += dr
      c += dc
    }
  }
  return moves
}

function pseudoMoves(board: ChessBoard, from: number): number[] {
  const piece = board[from]
  if (!piece) return []
  const [row, col] = rc(from)
  const { type, color } = piece
  const forward = color === "w" ? -1 : 1

  if (type === "p") {
    const moves: number[] = []
    const one = idx(row + forward, col)
    if (one !== null && !board[one]) {
      moves.push(one)
      const startRow = color === "w" ? 6 : 1
      const two = idx(row + forward * 2, col)
      if (row === startRow && two !== null && !board[two]) moves.push(two)
    }
    for (const dc of [-1, 1]) {
      const cap = idx(row + forward, col + dc)
      if (cap !== null && board[cap] && board[cap]!.color !== color) moves.push(cap)
    }
    return moves
  }

  if (type === "n") {
    const deltas: [number, number][] = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1],
    ]
    const moves: number[] = []
    for (const [dr, dc] of deltas) {
      const t = idx(row + dr, col + dc)
      if (t !== null && (!board[t] || board[t]!.color !== color)) moves.push(t)
    }
    return moves
  }

  if (type === "b") return slide(board, from, [[-1, -1], [-1, 1], [1, -1], [1, 1]], color)
  if (type === "r") return slide(board, from, [[-1, 0], [1, 0], [0, -1], [0, 1]], color)
  if (type === "q") return slide(board, from, [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]], color)

  // king
  const moves: number[] = []
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const t = idx(row + dr, col + dc)
      if (t !== null && (!board[t] || board[t]!.color !== color)) moves.push(t)
    }
  }
  return moves
}

export function chessApplyMove(board: ChessBoard, move: ChessMove): ChessBoard {
  const next = [...board]
  const piece = next[move.from]
  next[move.from] = null
  if (piece && piece.type === "p") {
    const [toRow] = rc(move.to)
    if (toRow === 0 || toRow === 7) {
      next[move.to] = { type: "q", color: piece.color }
      return next
    }
  }
  next[move.to] = piece
  return next
}

function findKing(board: ChessBoard, color: ChessColor): number {
  return board.findIndex((p) => p && p.type === "k" && p.color === color)
}

function isSquareAttacked(board: ChessBoard, square: number, byColor: ChessColor): boolean {
  for (let i = 0; i < 64; i++) {
    const p = board[i]
    if (p && p.color === byColor) {
      if (pseudoMoves(board, i).includes(square)) return true
    }
  }
  return false
}

export function chessIsInCheck(board: ChessBoard, color: ChessColor): boolean {
  const kingSq = findKing(board, color)
  if (kingSq === -1) return false
  return isSquareAttacked(board, kingSq, color === "w" ? "b" : "w")
}

export function chessLegalMoves(board: ChessBoard, from: number): number[] {
  const piece = board[from]
  if (!piece) return []
  return pseudoMoves(board, from).filter((to) => {
    const next = chessApplyMove(board, { from, to })
    return !chessIsInCheck(next, piece.color)
  })
}

export function chessAllLegalMoves(board: ChessBoard, color: ChessColor): ChessMove[] {
  const moves: ChessMove[] = []
  for (let i = 0; i < 64; i++) {
    const p = board[i]
    if (p && p.color === color) {
      for (const to of chessLegalMoves(board, i)) moves.push({ from: i, to })
    }
  }
  return moves
}

export type ChessStatus = "playing" | "checkmate" | "stalemate"

export function chessStatus(board: ChessBoard, turn: ChessColor): ChessStatus {
  const moves = chessAllLegalMoves(board, turn)
  if (moves.length > 0) return "playing"
  return chessIsInCheck(board, turn) ? "checkmate" : "stalemate"
}

function evaluate(board: ChessBoard, color: ChessColor): number {
  let score = 0
  for (const p of board) {
    if (!p) continue
    const val = PIECE_VALUE[p.type]
    score += p.color === color ? val : -val
  }
  return score
}

export function chessBestMove(board: ChessBoard, color: ChessColor): ChessMove | null {
  const moves = chessAllLegalMoves(board, color)
  if (moves.length === 0) return null
  let best = moves[0]
  let bestScore = -Infinity
  for (const m of moves) {
    const next = chessApplyMove(board, m)
    let score = evaluate(next, color)
    // Prefer captures a bit more, and avoid moving into an immediate recapture-heavy square lightly.
    if (board[m.to]) score += 0.5
    if (score > bestScore) {
      bestScore = score
      best = m
    }
  }
  return best
}

export const CHESS_GLYPH: Record<ChessColor, Record<PieceType, string>> = {
  w: { p: "♙", n: "♘", b: "♗", r: "♖", q: "♕", k: "♔" },
  b: { p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚" },
}
