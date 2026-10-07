// 麻將連連看：盤面排成固定格狀（6列×8欄＝48張，24對）。玩家尋找兩張圖案相同且路徑轉折不超過兩次
// 的牌進行消除，目標是在時限內清空整個盤面。
import type { MJTile } from "@/lib/games/mahjong"

export const ROWS = 6
export const COLS = 8
export const TIME_LIMIT = 180 // 秒

const ALL_FACES: MJTile[] = [
  ...(["t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9"] as MJTile[]),
  ...(["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9"] as MJTile[]),
  ...(["w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8", "w9"] as MJTile[]),
  ...(["E", "S", "W", "N", "R", "G", "B"] as MJTile[]),
]

export interface SolCell {
  tile: MJTile
  matched: boolean
}

export interface SolState {
  grid: (SolCell | null)[][]
  selected: [number, number] | null
  secondsLeft: number
  status: "playing" | "won" | "lost"
  moves: number
  lastPath: [number, number][] | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function solInitial(): SolState {
  const pairCount = (ROWS * COLS) / 2
  const faces = shuffle(ALL_FACES).slice(0, pairCount)
  const tiles = shuffle(faces.flatMap((f) => [f, f]))
  const grid: (SolCell | null)[][] = []
  let idx = 0
  for (let r = 0; r < ROWS; r++) {
    const row: (SolCell | null)[] = []
    for (let c = 0; c < COLS; c++) {
      row.push({ tile: tiles[idx++], matched: false })
    }
    grid.push(row)
  }
  return { grid, selected: null, secondsLeft: TIME_LIMIT, status: "playing", moves: 0, lastPath: null }
}

const DIRS: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
]

/** 尋找 (r1,c1)→(r2,c2) 的連線路徑：只能穿過已消除的空格或盤面外一格的邊界，轉折最多兩次。 */
export function findLinkPath(
  grid: (SolCell | null)[][],
  r1: number,
  c1: number,
  r2: number,
  c2: number,
): [number, number][] | null {
  const eR = ROWS + 2
  const eC = COLS + 2
  const passable: boolean[][] = Array.from({ length: eR }, () => Array(eC).fill(true))
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c]
      passable[r + 1][c + 1] = !cell || cell.matched
    }
  }
  const sr = r1 + 1
  const sc = c1 + 1
  const tr = r2 + 1
  const tc = c2 + 1
  passable[tr][tc] = true

  type St = { r: number; c: number; dir: number; turns: number; path: [number, number][] }
  const best = new Map<string, number>()
  const stack: St[] = [{ r: sr, c: sc, dir: -1, turns: -1, path: [] }]
  while (stack.length) {
    const cur = stack.pop()!
    for (let d = 0; d < 4; d++) {
      const nr = cur.r + DIRS[d][0]
      const nc = cur.c + DIRS[d][1]
      if (nr < 0 || nr >= eR || nc < 0 || nc >= eC) continue
      if (!passable[nr][nc]) continue
      const turns = cur.dir === -1 ? 0 : cur.dir === d ? cur.turns : cur.turns + 1
      if (turns > 2) continue
      const path: [number, number][] = [...cur.path, [nr - 1, nc - 1]]
      if (nr === tr && nc === tc) return path
      const key = `${nr}_${nc}_${d}`
      const prev = best.get(key)
      if (prev !== undefined && prev <= turns) continue
      best.set(key, turns)
      stack.push({ r: nr, c: nc, dir: d, turns, path })
    }
  }
  return null
}

export function solSelect(state: SolState, r: number, c: number): SolState {
  if (state.status !== "playing") return state
  const cell = state.grid[r][c]
  if (!cell || cell.matched) return state

  if (!state.selected) {
    return { ...state, selected: [r, c], lastPath: null }
  }
  const [sr, sc] = state.selected
  if (sr === r && sc === c) {
    return { ...state, selected: null }
  }
  const first = state.grid[sr][sc]
  if (!first || first.matched) return { ...state, selected: [r, c] }

  if (first.tile !== cell.tile) {
    return { ...state, selected: [r, c], lastPath: null }
  }
  const path = findLinkPath(state.grid, sr, sc, r, c)
  if (!path) {
    return { ...state, selected: [r, c], lastPath: null }
  }
  const grid = state.grid.map((row) => [...row])
  grid[sr][sc] = { ...first, matched: true }
  grid[r][c] = { ...cell, matched: true }
  const remaining = grid.some((row) => row.some((cell) => cell && !cell.matched))
  return {
    ...state,
    grid,
    selected: null,
    moves: state.moves + 1,
    lastPath: path,
    status: remaining ? "playing" : "won",
  }
}

export function solTick(state: SolState): SolState {
  if (state.status !== "playing") return state
  const secondsLeft = state.secondsLeft - 1
  if (secondsLeft <= 0) return { ...state, secondsLeft: 0, status: "lost" }
  return { ...state, secondsLeft }
}

/** 找出任意一組目前仍可連線的配對，供提示按鈕使用。 */
export function solFindHint(state: SolState): [[number, number], [number, number]] | null {
  const open: [number, number][] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = state.grid[r][c]
      if (cell && !cell.matched) open.push([r, c])
    }
  }
  for (let i = 0; i < open.length; i++) {
    for (let j = i + 1; j < open.length; j++) {
      const [r1, c1] = open[i]
      const [r2, c2] = open[j]
      if (state.grid[r1][c1]!.tile !== state.grid[r2][c2]!.tile) continue
      if (findLinkPath(state.grid, r1, c1, r2, c2)) return [open[i], open[j]]
    }
  }
  return null
}

export function solReshuffle(state: SolState): SolState {
  const remaining: MJTile[] = []
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = state.grid[r][c]
      if (cell && !cell.matched) remaining.push(cell.tile)
    }
  }
  const shuffled = shuffle(remaining)
  const grid = state.grid.map((row) => [...row])
  let idx = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = grid[r][c]
      if (cell && !cell.matched) {
        grid[r][c] = { tile: shuffled[idx++], matched: false }
      }
    }
  }
  return { ...state, grid, selected: null, lastPath: null }
}
