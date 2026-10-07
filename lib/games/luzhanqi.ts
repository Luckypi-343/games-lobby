export type LZColor = "r" | "b"
export type LZType = "M" | "G" | "D" | "B" | "R" | "N" | "C" | "P" | "E" | "L" | "X" | "F"

export interface LZPiece {
  type: LZType
  color: LZColor
}

export type LZBoard = (LZPiece | null)[]

export const LZ_COLS = 5
export const LZ_ROWS = 12

export interface LZState {
  board: LZBoard
  turn: LZColor
  status: "playing" | "over"
  winner: LZColor | null
  lastMove: { from: number; to: number } | null
  message: string | null
}

const RANK: Record<LZType, number> = { M: 9, G: 8, D: 7, B: 6, R: 5, N: 4, C: 3, P: 2, E: 1, L: 0, X: 0, F: 0 }

export const LZ_LABELS: Record<LZType, string> = {
  M: "司令",
  G: "軍長",
  D: "師長",
  B: "旅長",
  R: "團長",
  N: "營長",
  C: "連長",
  P: "排長",
  E: "工兵",
  L: "地雷",
  X: "炸彈",
  F: "軍旗",
}

function idx(r: number, c: number) {
  return r * LZ_COLS + c
}
function rc(i: number): [number, number] {
  return [Math.floor(i / LZ_COLS), i % LZ_COLS]
}
function inBounds(r: number, c: number) {
  return r >= 0 && r < LZ_ROWS && c >= 0 && c < LZ_COLS
}

export const LZ_CAMPS = new Set<number>([idx(4, 1), idx(4, 3), idx(5, 2), idx(6, 2), idx(7, 1), idx(7, 3)])
export const LZ_HQ = new Set<number>([idx(0, 2), idx(11, 2)])

function isRail(r: number, c: number) {
  return c === 0 || c === LZ_COLS - 1 || r === 4 || r === 5 || r === 6 || r === 7
}

function buildArmy(color: LZColor): LZType[] {
  const arr: LZType[] = ["M", "G", "D", "D", "B", "B", "R", "R", "N", "N", "N", "C", "C", "C", "P", "P", "P", "E", "E", "E", "L", "L", "L", "X", "X", "F"]
  return arr
}

export function lzInitial(): LZState {
  const board: LZBoard = Array(LZ_COLS * LZ_ROWS).fill(null)
  const blackCells: number[] = []
  for (let r = 0; r < 5; r++) for (let c = 0; c < LZ_COLS; c++) blackCells.push(idx(r, c))
  const redCells: number[] = []
  for (let r = 7; r < 12; r++) for (let c = 0; c < LZ_COLS; c++) redCells.push(idx(r, c))

  const placeArmy = (color: LZColor, cells: number[], flagCell: number) => {
    const pieces = buildArmy(color).filter((t) => t !== "F")
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
    }
    const remaining = cells.filter((c) => c !== flagCell)
    remaining.forEach((cellIdx, i) => {
      board[cellIdx] = { type: pieces[i], color }
    })
    board[flagCell] = { type: "F", color }
  }

  placeArmy("b", blackCells, idx(0, 2))
  placeArmy("r", redCells, idx(11, 2))

  return { board, turn: "r", status: "playing", winner: null, lastMove: null, message: null }
}

function straightRailMoves(board: LZBoard, from: number, color: LZColor): number[] {
  const [r, c] = rc(from)
  if (!isRail(r, c)) return []
  const out: number[] = []
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  for (const [dr, dc] of dirs) {
    let rr = r + dr
    let cc = c + dc
    while (inBounds(rr, cc) && isRail(rr, cc)) {
      const target = board[idx(rr, cc)]
      if (!target) {
        out.push(idx(rr, cc))
      } else {
        if (target.color !== color && !LZ_CAMPS.has(idx(rr, cc))) out.push(idx(rr, cc))
        break
      }
      rr += dr
      cc += dc
    }
  }
  return out
}

function engineerRailMoves(board: LZBoard, from: number, color: LZColor): number[] {
  const [r0, c0] = rc(from)
  if (!isRail(r0, c0)) return []
  const visited = new Set<number>([from])
  const out: number[] = []
  const queue = [from]
  while (queue.length) {
    const cur = queue.shift()!
    const [r, c] = rc(cur)
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const r2 = r + dr
      const c2 = c + dc
      if (!inBounds(r2, c2) || !isRail(r2, c2)) continue
      const ni = idx(r2, c2)
      if (visited.has(ni)) continue
      visited.add(ni)
      const target = board[ni]
      if (!target) {
        out.push(ni)
        queue.push(ni)
      } else if (target.color !== color && !LZ_CAMPS.has(ni)) {
        out.push(ni)
      }
    }
  }
  return out
}

export function lzMovesFor(state: LZState, from: number): number[] {
  const piece = state.board[from]
  if (!piece || piece.color !== state.turn) return []
  if (piece.type === "L" || piece.type === "F") return []
  const [r, c] = rc(from)
  const out = new Set<number>()
  for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const r2 = r + dr
    const c2 = c + dc
    if (!inBounds(r2, c2)) continue
    const ni = idx(r2, c2)
    const target = state.board[ni]
    if (!target) out.add(ni)
    else if (target.color !== piece.color && !LZ_CAMPS.has(ni)) out.add(ni)
  }
  if (piece.type === "E") {
    for (const m of engineerRailMoves(state.board, from, piece.color)) out.add(m)
  } else {
    for (const m of straightRailMoves(state.board, from, piece.color)) out.add(m)
  }
  return Array.from(out)
}

function resolveCombat(attacker: LZPiece, defender: LZPiece): "attackerWins" | "defenderWins" | "mutual" {
  if (defender.type === "F") return "attackerWins"
  if (defender.type === "L") return attacker.type === "E" ? "attackerWins" : "mutual"
  if (defender.type === "X" || attacker.type === "X") return "mutual"
  const ar = RANK[attacker.type]
  const dr = RANK[defender.type]
  if (ar > dr) return "attackerWins"
  if (ar < dr) return "defenderWins"
  return "mutual"
}

export function lzMove(state: LZState, from: number, to: number): LZState {
  if (state.status !== "playing") return state
  if (!lzMovesFor(state, from).includes(to)) return state
  const board = state.board.slice()
  const attacker = board[from]!
  const defender = board[to]
  let message: string | null = null
  let status: LZState["status"] = "playing"
  let winner: LZColor | null = null

  if (!defender) {
    board[to] = attacker
    board[from] = null
  } else {
    const result = resolveCombat(attacker, defender)
    if (result === "attackerWins") {
      if (defender.type === "F") {
        message = `${attacker.color === "r" ? "紅方" : "黑方"}攻下軍旗，獲得勝利！`
        status = "over"
        winner = attacker.color
      } else if (defender.type === "L" && attacker.type === "E") {
        message = "工兵成功排雷！"
      }
      board[to] = attacker
      board[from] = null
    } else if (result === "defenderWins") {
      board[from] = null
      message = "攻擊方階級較低，己方棋子陣亡。"
    } else {
      board[from] = null
      board[to] = null
      message = "雙方同歸於盡！"
    }
  }

  const nextTurn: LZColor = state.turn === "r" ? "b" : "r"
  if (status === "playing") {
    const hasPieces = board.some((p) => p && p.color === nextTurn && p.type !== "F")
    if (!hasPieces) {
      status = "over"
      winner = state.turn
      message = `${nextTurn === "r" ? "黑方" : "紅方"}兵力全滅！`
    }
  }
  return { board, turn: nextTurn, status, winner, lastMove: { from, to }, message }
}

export function lzAiMove(state: LZState): { from: number; to: number } | null {
  const color = state.turn
  const options: { from: number; to: number; score: number }[] = []
  for (let i = 0; i < state.board.length; i++) {
    const piece = state.board[i]
    if (piece && piece.color === color) {
      for (const to of lzMovesFor(state, i)) {
        const target = state.board[to]
        let score = Math.random() * 2
        if (target) {
          const result = resolveCombat(piece, target)
          if (target.type === "F") score = 1000
          else if (result === "attackerWins") score = 20 + RANK[target.type]
          else if (result === "mutual") score = 5
          else score = -20
        }
        options.push({ from: i, to, score })
      }
    }
  }
  if (options.length === 0) return null
  options.sort((a, b) => b.score - a.score)
  const top = options.filter((o) => o.score >= options[0].score - 1)
  return top[Math.floor(Math.random() * top.length)]
}
