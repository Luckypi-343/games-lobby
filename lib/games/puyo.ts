// 噗喲噗喲（Puyo Puyo）：成對彩色軟泥由上方落下，可左右移動與旋轉，落地堆疊後同色連成4個以上即消除，並引發連鎖。

export const PUYO_COLS = 6
export const PUYO_ROWS = 10
export const PUYO_COLOR_COUNT = 4

export type PuyoCell = number | null // 0..PUYO_COLOR_COUNT-1，null = 空格

export type PuyoPair = {
  // axis = 軸心泡泡座標，second 依 rotation 決定相對位置
  col: number
  row: number
  rotation: 0 | 1 | 2 | 3 // 0=second在上, 1=在右, 2=在下, 3=在左
  colorA: number
  colorB: number
}

export const PUYO_PALETTE = [
  { name: "紅", base: "#ef4444" },
  { name: "綠", base: "#22c55e" },
  { name: "藍", base: "#3b82f6" },
  { name: "黃", base: "#eab308" },
  { name: "紫", base: "#a855f7" },
]

export function puyoEmptyGrid(): PuyoCell[][] {
  return Array.from({ length: PUYO_ROWS }, () => Array.from({ length: PUYO_COLS }, () => null))
}

export function puyoRandomColor(): number {
  return Math.floor(Math.random() * PUYO_COLOR_COUNT)
}

export function puyoNewPair(): PuyoPair {
  return { col: Math.floor(PUYO_COLS / 2), row: 0, rotation: 0, colorA: puyoRandomColor(), colorB: puyoRandomColor() }
}

export function puyoSecondPos(p: PuyoPair): { col: number; row: number } {
  if (p.rotation === 0) return { col: p.col, row: p.row - 1 }
  if (p.rotation === 1) return { col: p.col + 1, row: p.row }
  if (p.rotation === 2) return { col: p.col, row: p.row + 1 }
  return { col: p.col - 1, row: p.row }
}

function cellFree(grid: PuyoCell[][], col: number, row: number): boolean {
  if (col < 0 || col >= PUYO_COLS || row < 0 || row >= PUYO_ROWS) return false
  return grid[row][col] === null
}

export function puyoCanPlace(grid: PuyoCell[][], p: PuyoPair): boolean {
  const sec = puyoSecondPos(p)
  return cellFree(grid, p.col, p.row) && cellFree(grid, sec.col, sec.row)
}

export function puyoTryMove(grid: PuyoCell[][], p: PuyoPair, dx: number): PuyoPair {
  const moved = { ...p, col: p.col + dx }
  return puyoCanPlace(grid, moved) ? moved : p
}

export function puyoTryRotate(grid: PuyoCell[][], p: PuyoPair): PuyoPair {
  const rotated = { ...p, rotation: (((p.rotation + 1) % 4) as 0 | 1 | 2 | 3) }
  if (puyoCanPlace(grid, rotated)) return rotated
  // 牆踢：嘗試左右平移一格
  const kickRight = { ...rotated, col: rotated.col + 1 }
  if (puyoCanPlace(grid, kickRight)) return kickRight
  const kickLeft = { ...rotated, col: rotated.col - 1 }
  if (puyoCanPlace(grid, kickLeft)) return kickLeft
  return p
}

export function puyoTryDrop(grid: PuyoCell[][], p: PuyoPair): { pair: PuyoPair; landed: boolean } {
  const moved = { ...p, row: p.row + 1 }
  if (puyoCanPlace(grid, moved)) return { pair: moved, landed: false }
  return { pair: p, landed: true }
}

/** 將目前的成對軟泥固定到棋盤上，並讓上方浮空的泡泡落下直到底部或堆疊。 */
export function puyoLockPair(grid: PuyoCell[][], p: PuyoPair): PuyoCell[][] {
  const g = grid.map((row) => [...row])
  const sec = puyoSecondPos(p)
  g[p.row][p.col] = p.colorA
  if (sec.row >= 0 && sec.row < PUYO_ROWS) g[sec.row][sec.col] = p.colorB
  return puyoApplyGravity(g)
}

export function puyoApplyGravity(grid: PuyoCell[][]): PuyoCell[][] {
  const g = grid.map((row) => [...row])
  for (let c = 0; c < PUYO_COLS; c++) {
    const colVals: number[] = []
    for (let r = 0; r < PUYO_ROWS; r++) if (g[r][c] !== null) colVals.push(g[r][c] as number)
    for (let r = 0; r < PUYO_ROWS; r++) g[r][c] = null
    const startRow = PUYO_ROWS - colVals.length
    for (let i = 0; i < colVals.length; i++) g[startRow + i][c] = colVals[i]
  }
  return g
}

/** 找出所有 >=4 個相連同色群組，消除後套用重力，回傳是否有消除與消除數量（用於連鎖計分）。 */
export function puyoClearGroups(grid: PuyoCell[][]): { grid: PuyoCell[][]; cleared: number; groups: number } {
  const g = grid.map((row) => [...row])
  const visited = Array.from({ length: PUYO_ROWS }, () => Array(PUYO_COLS).fill(false))
  let cleared = 0
  let groups = 0

  for (let r = 0; r < PUYO_ROWS; r++) {
    for (let c = 0; c < PUYO_COLS; c++) {
      if (visited[r][c] || g[r][c] === null) continue
      const color = g[r][c]
      const stack = [[r, c]]
      const group: [number, number][] = []
      visited[r][c] = true
      while (stack.length) {
        const [cr, cc] = stack.pop()!
        group.push([cr, cc])
        const neighbors = [
          [cr - 1, cc],
          [cr + 1, cc],
          [cr, cc - 1],
          [cr, cc + 1],
        ]
        for (const [nr, nc] of neighbors) {
          if (nr < 0 || nr >= PUYO_ROWS || nc < 0 || nc >= PUYO_COLS) continue
          if (visited[nr][nc] || g[nr][nc] !== color) continue
          visited[nr][nc] = true
          stack.push([nr, nc])
        }
      }
      if (group.length >= 4) {
        groups += 1
        cleared += group.length
        for (const [gr, gc] of group) g[gr][gc] = null
      }
    }
  }

  return { grid: puyoApplyGravity(g), cleared, groups }
}

export function puyoIsOver(grid: PuyoCell[][]): boolean {
  // 出生點被佔用即遊戲結束
  const spawnCol = Math.floor(PUYO_COLS / 2)
  return grid[0][spawnCol] !== null || grid[1]?.[spawnCol] !== null
}
