// 迷你數獨 — 6x6 盤面（2 列 x 3 欄為一宮），每行、每列、每宮都要填滿 1～6 且不重複。
export const SD_SIZE = 6
const BAND_ROW = [
  [0, 1],
  [2, 3],
  [4, 5],
]
const BAND_COL = [
  [0, 1, 2],
  [3, 4, 5],
]

const BASE_SOLUTION = [
  [1, 2, 3, 4, 5, 6],
  [4, 5, 6, 1, 2, 3],
  [2, 3, 4, 5, 6, 1],
  [5, 6, 1, 2, 3, 4],
  [3, 4, 5, 6, 1, 2],
  [6, 1, 2, 3, 4, 5],
]

export interface SdState {
  solution: number[]
  given: boolean[]
  values: (number | null)[]
  selected: number | null
}

function idx(r: number, c: number): number {
  return r * SD_SIZE + c
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildSolution(): number[] {
  const grid = BASE_SOLUTION.map((row) => [...row])
  // 隨機打亂數字標籤（1-6 重新對應）
  const labelMap = shuffle([1, 2, 3, 4, 5, 6])
  for (let r = 0; r < SD_SIZE; r++) {
    for (let c = 0; c < SD_SIZE; c++) grid[r][c] = labelMap[grid[r][c] - 1]
  }
  // 同一列帶內隨機交換整列（不破壞宮/欄限制）
  const rowOrder: number[] = []
  for (const band of BAND_ROW) rowOrder.push(...shuffle(band))
  const rowsShuffled = rowOrder.map((r) => grid[r])
  // 同一欄帶內隨機交換整欄
  const colOrder: number[] = []
  for (const band of BAND_COL) colOrder.push(...shuffle(band))
  const final: number[][] = rowsShuffled.map((row) => colOrder.map((c) => row[c]))
  return final.flat()
}

export function sdNew(): SdState {
  const solution = buildSolution()
  const given = solution.map(() => Math.random() < 0.55)
  const values = solution.map((v, i) => (given[i] ? v : null))
  return { solution, given, values, selected: null }
}

export function sdSelect(state: SdState, i: number): SdState {
  if (state.given[i]) return state
  return { ...state, selected: i }
}

export function sdInput(state: SdState, num: number): SdState {
  if (state.selected === null || state.given[state.selected]) return state
  const values = [...state.values]
  values[state.selected] = num
  return { ...state, values }
}

export function sdClear(state: SdState): SdState {
  if (state.selected === null || state.given[state.selected]) return state
  const values = [...state.values]
  values[state.selected] = null
  return { ...state, values }
}

export function sdConflicts(values: (number | null)[]): boolean[] {
  const conflict = Array(values.length).fill(false)
  const markDup = (indices: number[]) => {
    const seen = new Map<number, number[]>()
    for (const i of indices) {
      const v = values[i]
      if (v === null) continue
      seen.set(v, [...(seen.get(v) ?? []), i])
    }
    for (const list of seen.values()) {
      if (list.length > 1) for (const i of list) conflict[i] = true
    }
  }
  for (let r = 0; r < SD_SIZE; r++) markDup(Array.from({ length: SD_SIZE }, (_, c) => idx(r, c)))
  for (let c = 0; c < SD_SIZE; c++) markDup(Array.from({ length: SD_SIZE }, (_, r) => idx(r, c)))
  for (const rb of BAND_ROW) {
    for (const cb of BAND_COL) {
      const cells: number[] = []
      for (const r of rb) for (const c of cb) cells.push(idx(r, c))
      markDup(cells)
    }
  }
  return conflict
}

export function sdIsFull(state: SdState): boolean {
  return state.values.every((v) => v !== null)
}

export function sdWon(state: SdState): boolean {
  return sdIsFull(state) && state.values.every((v, i) => v === state.solution[i])
}
