// 接水管 — 旋轉管線方塊，把左上角的水源接通到右下角的出口。
export const PC_SIZE = 5

type Dir = "N" | "E" | "S" | "W"
type PipeType = "straight" | "corner" | "fixed"

export interface PcCell {
  type: PipeType
  rot: number
  fixedDirs?: Dir[]
}

export interface PcState {
  cells: PcCell[]
  won: boolean
  moves: number
}

const DIR_DELTA: Record<Dir, [number, number]> = { N: [-1, 0], E: [0, 1], S: [1, 0], W: [0, -1] }
const OPPOSITE: Record<Dir, Dir> = { N: "S", S: "N", E: "W", W: "E" }
const ORDER: Dir[] = ["N", "E", "S", "W"]

export function pcConnections(cell: PcCell): Dir[] {
  if (cell.type === "fixed") return cell.fixedDirs ?? []
  if (cell.type === "straight") return cell.rot % 2 === 0 ? ["N", "S"] : ["E", "W"]
  const i = cell.rot % 4
  return [ORDER[i], ORDER[(i + 1) % 4]]
}

function idx(r: number, c: number): number {
  return r * PC_SIZE + c
}

function randomCell(): PcCell {
  const type: PipeType = Math.random() < 0.5 ? "straight" : "corner"
  return { type, rot: Math.floor(Math.random() * 4) }
}

function checkWin(cells: PcCell[]): boolean {
  const visited = new Set<number>()
  const stack = [0]
  while (stack.length) {
    const i = stack.pop()!
    if (visited.has(i)) continue
    visited.add(i)
    const r = Math.floor(i / PC_SIZE)
    const c = i % PC_SIZE
    for (const d of pcConnections(cells[i])) {
      const [dr, dc] = DIR_DELTA[d]
      const nr = r + dr
      const nc = c + dc
      if (nr < 0 || nr >= PC_SIZE || nc < 0 || nc >= PC_SIZE) continue
      const ni = idx(nr, nc)
      if (pcConnections(cells[ni]).includes(OPPOSITE[d])) stack.push(ni)
    }
  }
  return visited.has(PC_SIZE * PC_SIZE - 1)
}

export function pcNew(): PcState {
  const cells: PcCell[] = []
  for (let r = 0; r < PC_SIZE; r++) {
    for (let c = 0; c < PC_SIZE; c++) {
      if (r === 0 && c === 0) cells.push({ type: "fixed", rot: 0, fixedDirs: ["E", "S"] })
      else if (r === PC_SIZE - 1 && c === PC_SIZE - 1) cells.push({ type: "fixed", rot: 0, fixedDirs: ["N", "W"] })
      else cells.push(randomCell())
    }
  }
  return { cells, won: checkWin(cells), moves: 0 }
}

export function pcRotate(state: PcState, i: number): PcState {
  if (state.won) return state
  const cell = state.cells[i]
  if (cell.type === "fixed") return state
  const cells = state.cells.map((c, idx2) => (idx2 === i ? { ...c, rot: (c.rot + 1) % 4 } : c))
  return { cells, moves: state.moves + 1, won: checkWin(cells) }
}
