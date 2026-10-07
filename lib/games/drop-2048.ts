// 2048 下落版：數字方塊從上方指定欄位落下，疊在欄位最上方；若落點與下方同欄最上層數字相同，立即合併升級。

export const DROP2048_COLS = 5
export const DROP2048_ROWS = 8

export type Drop2048Cell = number | null // null = 空格，否則為數字值（2,4,8...)

export function drop2048EmptyGrid(): Drop2048Cell[][] {
  return Array.from({ length: DROP2048_ROWS }, () => Array.from({ length: DROP2048_COLS }, () => null))
}

export function drop2048RandomValue(): number {
  return Math.random() < 0.85 ? 2 : 4
}

/** 將數字方塊丟入指定欄位，由下往上找到可堆疊的位置；若頂端同值則合併一次（可連鎖往上）。
 * grid[0] 為最上層，grid[ROWS-1] 為最底層。 */
export function drop2048Drop(
  grid: Drop2048Cell[][],
  col: number,
  value: number,
): { grid: Drop2048Cell[][]; landedRow: number; merged: boolean; gained: number } {
  const g = grid.map((row) => [...row])
  // 找最底部空格
  let row = -1
  for (let r = DROP2048_ROWS - 1; r >= 0; r--) {
    if (g[r][col] === null) {
      row = r
      break
    }
  }
  if (row === -1) return { grid: g, landedRow: -1, merged: false, gained: 0 }

  let current = value
  let merged = false
  let gained = 0
  g[row][col] = current
  // 向上連鎖合併：若正下方（row+1）同值，則合併並持續往上檢查
  let r = row
  while (r + 1 < DROP2048_ROWS && g[r + 1][col] === current) {
    current = current * 2
    gained += current
    g[r + 1][col] = current
    g[r][col] = null
    r += 1
    merged = true
  }
  return { grid: g, landedRow: r, merged, gained }
}

export function drop2048IsOver(grid: Drop2048Cell[][]): boolean {
  return grid[0].every((c) => c !== null)
}

export function drop2048MaxValue(grid: Drop2048Cell[][]): number {
  let max = 0
  for (const row of grid) for (const c of row) if (c && c > max) max = c
  return max
}

export const DROP2048_COLORS: Record<number, { bg: string; text: string }> = {
  2: { bg: "#eef2ff", text: "#3730a3" },
  4: { bg: "#e0e7ff", text: "#312e81" },
  8: { bg: "#fde68a", text: "#92400e" },
  16: { bg: "#fbbf24", text: "#78350f" },
  32: { bg: "#fb923c", text: "#7c2d12" },
  64: { bg: "#f87171", text: "#7f1d1d" },
  128: { bg: "#facc15", text: "#713f12" },
  256: { bg: "#4ade80", text: "#14532d" },
  512: { bg: "#38bdf8", text: "#0c4a6e" },
  1024: { bg: "#a78bfa", text: "#3b0764" },
  2048: { bg: "#f472b6", text: "#500724" },
  4096: { bg: "#f43f5e", text: "#4c0519" },
}
