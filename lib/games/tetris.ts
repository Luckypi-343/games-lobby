// 俄羅斯方塊 — 簡化版核心邏輯（8 欄 x 14 列，適合手機直向操作）。
export type TetrominoType = "I" | "O" | "T" | "S" | "Z" | "J" | "L"

export const TT_COLS = 8
export const TT_ROWS = 14

type Cell = [number, number]

const SHAPES: Record<TetrominoType, Cell[][]> = {
  I: [
    [[1, 0], [1, 1], [1, 2], [1, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 1], [1, 1], [2, 1], [3, 1]],
  ],
  O: [
    [[1, 1], [1, 2], [2, 1], [2, 2]],
    [[1, 1], [1, 2], [2, 1], [2, 2]],
    [[1, 1], [1, 2], [2, 1], [2, 2]],
    [[1, 1], [1, 2], [2, 1], [2, 2]],
  ],
  T: [
    [[0, 1], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 1]],
    [[0, 1], [1, 0], [1, 1], [2, 1]],
  ],
  S: [
    [[0, 1], [0, 2], [1, 0], [1, 1]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 1], [1, 2], [2, 0], [2, 1]],
    [[0, 0], [1, 0], [1, 1], [2, 1]],
  ],
  Z: [
    [[0, 0], [0, 1], [1, 1], [1, 2]],
    [[0, 2], [1, 1], [1, 2], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[0, 1], [1, 0], [1, 1], [2, 0]],
  ],
  J: [
    [[0, 0], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [0, 2], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 0], [2, 1]],
  ],
  L: [
    [[0, 2], [1, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [1, 2], [2, 0]],
    [[0, 0], [0, 1], [1, 1], [2, 1]],
  ],
}

export const TT_COLOR: Record<TetrominoType, string> = {
  I: "bg-sky-500",
  O: "bg-yellow-500",
  T: "bg-fuchsia-500",
  S: "bg-emerald-500",
  Z: "bg-rose-500",
  J: "bg-blue-600",
  L: "bg-orange-500",
}

const TYPES: TetrominoType[] = ["I", "O", "T", "S", "Z", "J", "L"]

export interface TtPiece {
  type: TetrominoType
  rot: number
  x: number
  y: number
}

export interface TtState {
  board: (TetrominoType | null)[][]
  current: TtPiece | null
  next: TetrominoType
  score: number
  lines: number
  over: boolean
}

function randomType(): TetrominoType {
  return TYPES[Math.floor(Math.random() * TYPES.length)]
}

function cellsFor(piece: TtPiece): Cell[] {
  return SHAPES[piece.type][piece.rot]
}

function collides(board: (TetrominoType | null)[][], piece: TtPiece): boolean {
  for (const [r, c] of cellsFor(piece)) {
    const y = piece.y + r
    const x = piece.x + c
    if (x < 0 || x >= TT_COLS || y >= TT_ROWS) return true
    if (y >= 0 && board[y][x]) return true
  }
  return false
}

function emptyBoard(): (TetrominoType | null)[][] {
  return Array.from({ length: TT_ROWS }, () => Array<TetrominoType | null>(TT_COLS).fill(null))
}

function spawnPiece(type: TetrominoType): TtPiece {
  return { type, rot: 0, x: Math.floor(TT_COLS / 2) - 2, y: -2 }
}

export function ttNew(): TtState {
  const board = emptyBoard()
  const current = spawnPiece(randomType())
  return { board, current, next: randomType(), score: 0, lines: 0, over: false }
}

function lockPiece(state: TtState): TtState {
  if (!state.current) return state
  const board = state.board.map((row) => [...row])
  for (const [r, c] of cellsFor(state.current)) {
    const y = state.current.y + r
    const x = state.current.x + c
    if (y >= 0 && y < TT_ROWS) board[y][x] = state.current.type
  }
  const kept = board.filter((row) => row.some((cell) => !cell))
  const clearedCount = TT_ROWS - kept.length
  const newBoard = [
    ...Array.from({ length: clearedCount }, () => Array<TetrominoType | null>(TT_COLS).fill(null)),
    ...kept,
  ]
  const scoreAdd = [0, 100, 300, 500, 800][clearedCount] ?? clearedCount * 200
  const nextPiece = spawnPiece(state.next)
  const over = collides(newBoard, nextPiece)
  return {
    board: newBoard,
    current: over ? null : nextPiece,
    next: randomType(),
    score: state.score + scoreAdd,
    lines: state.lines + clearedCount,
    over,
  }
}

export function ttMove(state: TtState, dx: number): TtState {
  if (!state.current || state.over) return state
  const moved = { ...state.current, x: state.current.x + dx }
  if (collides(state.board, moved)) return state
  return { ...state, current: moved }
}

export function ttRotate(state: TtState): TtState {
  if (!state.current || state.over) return state
  const rotated = { ...state.current, rot: (state.current.rot + 1) % 4 }
  if (!collides(state.board, rotated)) return { ...state, current: rotated }
  for (const kick of [-1, 1, -2, 2]) {
    const kicked = { ...rotated, x: rotated.x + kick }
    if (!collides(state.board, kicked)) return { ...state, current: kicked }
  }
  return state
}

export function ttTick(state: TtState): TtState {
  if (!state.current || state.over) return state
  const dropped = { ...state.current, y: state.current.y + 1 }
  if (!collides(state.board, dropped)) return { ...state, current: dropped }
  return lockPiece(state)
}

export function ttHardDrop(state: TtState): TtState {
  if (!state.current || state.over) return state
  let piece = state.current
  while (!collides(state.board, { ...piece, y: piece.y + 1 })) {
    piece = { ...piece, y: piece.y + 1 }
  }
  return lockPiece({ ...state, current: piece, score: state.score + 5 })
}

export function ttGhostY(state: TtState): number {
  if (!state.current) return 0
  let piece = state.current
  while (!collides(state.board, { ...piece, y: piece.y + 1 })) {
    piece = { ...piece, y: piece.y + 1 }
  }
  return piece.y
}

export function ttCellsFor(piece: TtPiece): Cell[] {
  return cellsFor(piece)
}
