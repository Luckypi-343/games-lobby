export type Player = 1 | 2
export type GameStatus = "playing" | "win"
export type OTCell = 0 | 1 | 2

export const OTH_SIZE = 8

export interface OTState {
  board: OTCell[]
  turn: Player
  status: GameStatus
  winner: Player | null
}

function idx(r: number, c: number): number {
  return r * OTH_SIZE + c
}

export function otEmpty(): OTState {
  const board = Array(64).fill(0) as OTCell[]
  board[idx(3, 3)] = 2
  board[idx(3, 4)] = 1
  board[idx(4, 3)] = 1
  board[idx(4, 4)] = 2
  return { board, turn: 1, status: "playing", winner: null }
}

const DIRS8 = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
]

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < OTH_SIZE && c >= 0 && c < OTH_SIZE
}

export function otFlipsFor(board: OTCell[], r: number, c: number, player: Player): number[] {
  if (board[idx(r, c)] !== 0) return []
  const opp: OTCell = player === 1 ? 2 : 1
  let flips: number[] = []
  for (const [dr, dc] of DIRS8) {
    let rr = r + dr
    let cc = c + dc
    const line: number[] = []
    while (inBounds(rr, cc) && board[idx(rr, cc)] === opp) {
      line.push(idx(rr, cc))
      rr += dr
      cc += dc
    }
    if (line.length && inBounds(rr, cc) && board[idx(rr, cc)] === player) {
      flips = flips.concat(line)
    }
  }
  return flips
}

export function otLegalMoves(board: OTCell[], player: Player): number[] {
  const out: number[] = []
  for (let r = 0; r < OTH_SIZE; r++) {
    for (let c = 0; c < OTH_SIZE; c++) {
      if (otFlipsFor(board, r, c, player).length) out.push(idx(r, c))
    }
  }
  return out
}

function advance(s: OTState): OTState {
  const next: Player = s.turn === 1 ? 2 : 1
  if (otLegalMoves(s.board, next).length) return { ...s, turn: next }
  if (otLegalMoves(s.board, s.turn).length) return { ...s, turn: s.turn }
  const p1 = s.board.filter((x) => x === 1).length
  const p2 = s.board.filter((x) => x === 2).length
  const winner: Player | null = p1 > p2 ? 1 : p2 > p1 ? 2 : null
  return { ...s, status: "win", winner }
}

export function otMove(s: OTState, r: number, c: number): OTState {
  if (s.status !== "playing") return s
  const flips = otFlipsFor(s.board, r, c, s.turn)
  if (!flips.length) return s
  const board = [...s.board]
  board[idx(r, c)] = s.turn
  for (const f of flips) board[f] = s.turn
  return advance({ ...s, board })
}

export function otAiMove(s: OTState): number {
  const moves = otLegalMoves(s.board, s.turn)
  if (!moves.length) return -1
  const cornerBonus = [0, 7, 56, 63]
  let best = -Infinity
  let bestI = moves[0]
  for (const i of moves) {
    const r = Math.floor(i / OTH_SIZE)
    const c = i % OTH_SIZE
    let score = otFlipsFor(s.board, r, c, s.turn).length
    if (cornerBonus.includes(i)) score += 20
    else if (r === 0 || r === 7 || c === 0 || c === 7) score += 3
    if (score > best) {
      best = score
      bestI = i
    }
  }
  return bestI
}
