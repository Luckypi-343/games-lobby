export type DCColor = "r" | "b"
export type DCType = "K" | "A" | "B" | "R" | "N" | "C" | "P"
export type DCVariant = "traditional" | "variant"

export interface DCPieceInfo {
  type: DCType
  color: DCColor
}

export interface DCCell {
  piece: DCPieceInfo
  faceUp: boolean
}

export type DCBoard = (DCCell | null)[]

export const DC_COLS = 8
export const DC_ROWS = 4

export interface DCState {
  board: DCBoard
  turn: DCColor
  variant: DCVariant
  status: "playing" | "over"
  winner: DCColor | null
  lastAction: { type: "flip" | "move"; from?: number; to: number } | null
}

const RANK: Record<DCType, number> = { K: 7, A: 6, B: 5, R: 4, N: 3, C: 2, P: 1 }
export const DC_LABELS: Record<DCColor, Record<DCType, string>> = {
  r: { K: "帥", A: "仕", B: "相", R: "俥", N: "傌", C: "炮", P: "兵" },
  b: { K: "將", A: "士", B: "象", R: "車", N: "馬", C: "砲", P: "卒" },
}

function idx(r: number, c: number) {
  return r * DC_COLS + c
}
function rc(i: number): [number, number] {
  return [Math.floor(i / DC_COLS), i % DC_COLS]
}
function inBounds(r: number, c: number) {
  return r >= 0 && r < DC_ROWS && c >= 0 && c < DC_COLS
}

function buildPieceSet(color: DCColor): DCPieceInfo[] {
  const set: DCPieceInfo[] = []
  set.push({ type: "K", color })
  for (let i = 0; i < 2; i++) set.push({ type: "A", color })
  for (let i = 0; i < 2; i++) set.push({ type: "B", color })
  for (let i = 0; i < 2; i++) set.push({ type: "R", color })
  for (let i = 0; i < 2; i++) set.push({ type: "N", color })
  for (let i = 0; i < 2; i++) set.push({ type: "C", color })
  for (let i = 0; i < 5; i++) set.push({ type: "P", color })
  return set
}

export function dcInitial(variant: DCVariant): DCState {
  const pieces = [...buildPieceSet("r"), ...buildPieceSet("b")]
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
  }
  const board: DCBoard = pieces.map((p) => ({ piece: p, faceUp: false }))
  return { board, turn: "r", variant, status: "playing", winner: null, lastAction: null }
}

function canCapture(attacker: DCPieceInfo, defender: DCPieceInfo): boolean {
  // King/General and Cannon can never capture Pawn/Soldier, regardless of rank.
  if (defender.type === "P" && (attacker.type === "K" || attacker.type === "C")) return false
  if (attacker.type === "P" && defender.type === "K") return true
  return RANK[attacker.type] >= RANK[defender.type]
}

function cannonJumpTargets(board: DCBoard, from: number, color: DCColor): number[] {
  const [r, c] = rc(from)
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  const out: number[] = []
  for (const [dr, dc] of dirs) {
    let rr = r + dr
    let cc = c + dc
    let screens = 0
    while (inBounds(rr, cc)) {
      const cell = board[idx(rr, cc)]
      if (screens === 0) {
        if (cell) screens = 1
      } else {
        if (cell) {
          // Cannon can never capture Pawn/Soldier, even by jumping.
          if (cell.faceUp && cell.piece.color !== color && cell.piece.type !== "P") out.push(idx(rr, cc))
          break
        }
      }
      rr += dr
      cc += dc
    }
  }
  return out
}

function traditionalMoves(board: DCBoard, from: number): number[] {
  const cell = board[from]
  if (!cell) return []
  const [r, c] = rc(from)
  const out: number[] = []
  if (cell.piece.type === "C") {
    out.push(...cannonJumpTargets(board, from, cell.piece.color))
  }
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
  for (const [dr, dc] of dirs) {
    const r2 = r + dr
    const c2 = c + dc
    if (!inBounds(r2, c2)) continue
    const target = board[idx(r2, c2)]
    if (!target) out.push(idx(r2, c2))
    else if (target.faceUp && target.piece.color !== cell.piece.color && canCapture(cell.piece, target.piece)) {
      out.push(idx(r2, c2))
    }
  }
  return out
}

function variantMoves(board: DCBoard, from: number): number[] {
  const cell = board[from]
  if (!cell) return []
  const { type, color } = cell.piece
  const [r, c] = rc(from)
  const out: number[] = []
  const tryLand = (r2: number, c2: number): boolean => {
    if (!inBounds(r2, c2)) return false
    const target = board[idx(r2, c2)]
    if (!target) {
      out.push(idx(r2, c2))
      return true
    }
    if (target.faceUp && target.piece.color !== color) out.push(idx(r2, c2))
    return false
  }
  switch (type) {
    case "R": {
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]]
      for (const [dr, dc] of dirs) {
        let rr = r + dr
        let cc = c + dc
        while (inBounds(rr, cc)) {
          const cell2 = board[idx(rr, cc)]
          if (!cell2) out.push(idx(rr, cc))
          else {
            if (cell2.faceUp && cell2.piece.color !== color) out.push(idx(rr, cc))
            break
          }
          rr += dr
          cc += dc
        }
      }
      break
    }
    case "N": {
      const steps = [
        [2, 1, 1, 0], [2, -1, 1, 0], [-2, 1, -1, 0], [-2, -1, -1, 0],
        [1, 2, 0, 1], [-1, 2, 0, 1], [1, -2, 0, -1], [-1, -2, 0, -1],
      ]
      for (const [dr, dc, legR, legC] of steps) {
        const lr = r + legR
        const lc = c + legC
        if (inBounds(lr, lc) && board[idx(lr, lc)]) continue
        tryLand(r + dr, c + dc)
      }
      break
    }
    case "B": {
      for (const [dr, dc] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        tryLand(r + dr, c + dc)
      }
      break
    }
    case "A": {
      for (const [dr, dc] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        tryLand(r + dr, c + dc)
      }
      break
    }
    case "K": {
      // King/General can never capture Pawn/Soldier, so it can't land on one.
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const r2 = r + dr
        const c2 = c + dc
        if (!inBounds(r2, c2)) continue
        const target = board[idx(r2, c2)]
        if (!target) {
          out.push(idx(r2, c2))
        } else if (target.faceUp && target.piece.color !== color && target.piece.type !== "P") {
          out.push(idx(r2, c2))
        }
      }
      break
    }
    case "C": {
      out.push(...cannonJumpTargets(board, from, color))
      for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const r2 = r + dr
        const c2 = c + dc
        if (inBounds(r2, c2) && !board[idx(r2, c2)]) out.push(idx(r2, c2))
      }
      break
    }
    case "P": {
      const forward = color === "r" ? 1 : -1
      tryLand(r + forward, c)
      break
    }
  }
  return out
}

export function dcMovesFor(state: DCState, from: number): number[] {
  const cell = state.board[from]
  if (!cell || !cell.faceUp || cell.piece.color !== state.turn) return []
  return state.variant === "traditional" ? traditionalMoves(state.board, from) : variantMoves(state.board, from)
}

export function dcFlip(state: DCState, index: number): DCState {
  const cell = state.board[index]
  if (!cell || cell.faceUp || state.status !== "playing") return state
  const board = state.board.slice()
  board[index] = { ...cell, faceUp: true }
  return advanceTurn({ ...state, board, lastAction: { type: "flip", to: index } })
}

export function dcMove(state: DCState, from: number, to: number): DCState {
  if (state.status !== "playing") return state
  const legal = dcMovesFor(state, from)
  if (!legal.includes(to)) return state
  const board = state.board.slice()
  const captured = board[to]
  board[to] = board[from]
  board[from] = null
  let status: DCState["status"] = "playing"
  let winner: DCColor | null = null
  if (captured?.piece.type === "K") {
    status = "over"
    winner = state.turn
  }
  const next = advanceTurn({ ...state, board, status, winner, lastAction: { type: "move", from, to } })
  return next
}

function advanceTurn(state: DCState): DCState {
  if (state.status === "over") return state
  const nextTurn: DCColor = state.turn === "r" ? "b" : "r"
  const hasFaceDown = state.board.some((c) => c && !c.faceUp)
  const hasMove = state.board.some(
    (c, i) => c && c.faceUp && c.piece.color === nextTurn && dcMovesFor({ ...state, turn: nextTurn }, i).length > 0,
  )
  if (!hasFaceDown && !hasMove) {
    return { ...state, turn: nextTurn, status: "over", winner: state.turn }
  }
  return { ...state, turn: nextTurn }
}

export function dcAiAction(state: DCState): { type: "flip" | "move"; from?: number; to: number } | null {
  const color = state.turn
  const moveOptions: { from: number; to: number; score: number }[] = []
  for (let i = 0; i < state.board.length; i++) {
    const cell = state.board[i]
    if (cell && cell.faceUp && cell.piece.color === color) {
      for (const to of dcMovesFor(state, i)) {
        const target = state.board[to]
        const score = target ? RANK[target.piece.type] * 10 + Math.random() : Math.random()
        moveOptions.push({ from: i, to, score })
      }
    }
  }
  if (moveOptions.length > 0) {
    moveOptions.sort((a, b) => b.score - a.score)
    const best = moveOptions[0]
    return { type: "move", from: best.from, to: best.to }
  }
  const faceDown = state.board
    .map((c, i) => (c && !c.faceUp ? i : -1))
    .filter((i) => i >= 0)
  if (faceDown.length > 0) {
    const pick = faceDown[Math.floor(Math.random() * faceDown.length)]
    return { type: "flip", to: pick }
  }
  return null
}
