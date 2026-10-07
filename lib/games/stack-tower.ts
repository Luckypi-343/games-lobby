// 疊疊樂 — 抓準時機讓移動中的方塊與下方對齊，堆得越高分數越高。
export interface StBlock {
  x: number // 0-100 百分比座標（左邊界）
  width: number
  colorIndex: number
}

export const ST_BOARD_WIDTH = 100
export const ST_BASE_WIDTH = 60

export function stColorFor(index: number): string {
  const palette = [
    "bg-rose-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-sky-500",
    "bg-indigo-500",
    "bg-fuchsia-500",
  ]
  return palette[index % palette.length]
}

export function stTrim(current: StBlock, below: StBlock): { block: StBlock | null; perfect: boolean } {
  const left = Math.max(current.x, below.x)
  const right = Math.min(current.x + current.width, below.x + below.width)
  const overlap = right - left
  if (overlap <= 1) return { block: null, perfect: false }
  const perfect = overlap >= current.width - 1.5
  return { block: { x: left, width: overlap, colorIndex: current.colorIndex }, perfect }
}
