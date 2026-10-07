// 華容道（Klotski）— 4 欄 x 5 列棋盤，目標是把 2x2 的「曹操」方塊移到最下方中間的出口。
export type KmPieceId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J"

export interface KmPiece {
  id: KmPieceId
  x: number
  y: number
  w: number
  h: number
}

export const KM_COLS = 4
export const KM_ROWS = 5
export const KM_TARGET_ID: KmPieceId = "A"

export interface KmState {
  pieces: KmPiece[]
  moves: number
  won: boolean
}

function initialPieces(): KmPiece[] {
  return [
    { id: "A", x: 1, y: 0, w: 2, h: 2 }, // 曹操 2x2
    { id: "B", x: 0, y: 0, w: 1, h: 2 },
    { id: "C", x: 3, y: 0, w: 1, h: 2 },
    { id: "D", x: 0, y: 2, w: 1, h: 2 },
    { id: "E", x: 1, y: 2, w: 2, h: 1 },
    { id: "F", x: 3, y: 2, w: 1, h: 2 },
    { id: "G", x: 1, y: 3, w: 1, h: 1 },
    { id: "H", x: 2, y: 3, w: 1, h: 1 },
    { id: "I", x: 0, y: 4, w: 1, h: 1 },
    { id: "J", x: 3, y: 4, w: 1, h: 1 },
  ]
}

export function kmNew(): KmState {
  return { pieces: initialPieces(), moves: 0, won: false }
}

function occupiedCells(pieces: KmPiece[], exceptId?: KmPieceId): Set<string> {
  const set = new Set<string>()
  for (const p of pieces) {
    if (p.id === exceptId) continue
    for (let dx = 0; dx < p.w; dx++) {
      for (let dy = 0; dy < p.h; dy++) {
        set.add(`${p.x + dx},${p.y + dy}`)
      }
    }
  }
  return set
}

export function kmCanMove(state: KmState, id: KmPieceId, dx: number, dy: number): boolean {
  const piece = state.pieces.find((p) => p.id === id)
  if (!piece) return false
  const nx = piece.x + dx
  const ny = piece.y + dy
  if (nx < 0 || ny < 0 || nx + piece.w > KM_COLS || ny + piece.h > KM_ROWS) return false
  const blocked = occupiedCells(state.pieces, id)
  for (let x = 0; x < piece.w; x++) {
    for (let y = 0; y < piece.h; y++) {
      if (blocked.has(`${nx + x},${ny + y}`)) return false
    }
  }
  return true
}

export function kmMove(state: KmState, id: KmPieceId, dx: number, dy: number): KmState {
  if (state.won) return state
  if (!kmCanMove(state, id, dx, dy)) return state
  const pieces = state.pieces.map((p) => (p.id === id ? { ...p, x: p.x + dx, y: p.y + dy } : p))
  const target = pieces.find((p) => p.id === KM_TARGET_ID)!
  const won = target.x === 1 && target.y === KM_ROWS - 2
  return { pieces, moves: state.moves + 1, won }
}
