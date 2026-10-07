export const SP_SIZE = 4
export const SP_CELLS = SP_SIZE * SP_SIZE

export interface SpState {
  tiles: number[] // 0 = blank, values 1..15
  moves: number
}

export function spSolved(size = SP_SIZE): number[] {
  const tiles = Array.from({ length: size * size }, (_, i) => (i + 1) % (size * size))
  return tiles
}

export function spIsSolved(tiles: number[]): boolean {
  const solved = spSolved()
  return tiles.every((v, i) => v === solved[i])
}

function neighbors(index: number, size = SP_SIZE): number[] {
  const row = Math.floor(index / size)
  const col = index % size
  const list: number[] = []
  if (row > 0) list.push(index - size)
  if (row < size - 1) list.push(index + size)
  if (col > 0) list.push(index - 1)
  if (col < size - 1) list.push(index + 1)
  return list
}

export function spShuffled(size = SP_SIZE): SpState {
  const tiles = spSolved(size)
  let blank = tiles.indexOf(0)
  // Perform many random valid slides from the solved state to guarantee solvability.
  for (let i = 0; i < 300; i++) {
    const opts = neighbors(blank, size)
    const pick = opts[Math.floor(Math.random() * opts.length)]
    tiles[blank] = tiles[pick]
    tiles[pick] = 0
    blank = pick
  }
  return { tiles, moves: 0 }
}

export function spMove(state: SpState, index: number, size = SP_SIZE): SpState {
  const blank = state.tiles.indexOf(0)
  if (!neighbors(index, size).includes(blank)) return state
  const tiles = [...state.tiles]
  tiles[blank] = tiles[index]
  tiles[index] = 0
  return { tiles, moves: state.moves + 1 }
}
