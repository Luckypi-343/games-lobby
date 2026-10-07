// 共用引擎：多層堆疊、點擊收集到有限槽位，湊滿 3 個相同即消除。供 76 羊了個羊／77 3D消除 共用。
export const TRAY_SIZE = 7
const OVERLAP_RADIUS = 11

export interface TileItem {
  id: number
  icon: number
  layer: number
  x: number // 0-100 百分比座標
  y: number
  collected: boolean
}

export interface TileState {
  items: TileItem[]
  tray: number[] // icon 編號
  won: boolean
  lost: boolean
}

function dist(a: TileItem, b: TileItem): number {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

export function tcIsCovered(items: TileItem[], item: TileItem): boolean {
  if (item.collected) return true
  return items.some(
    (other) =>
      !other.collected && other.id !== item.id && other.layer > item.layer && dist(other, item) < OVERLAP_RADIUS,
  )
}

export function tcNew(iconCount: number, layers: number, perLayer: number): TileState {
  // 需要湊成 3 的倍數個，確保一定能全部消完
  const totalSlots = layers * perLayer
  const tripleCount = Math.ceil(totalSlots / 3)
  const pool: number[] = []
  for (let i = 0; i < tripleCount; i++) {
    const icon = i % iconCount
    pool.push(icon, icon, icon)
  }
  while (pool.length < totalSlots) pool.push(Math.floor(Math.random() * iconCount))
  // 洗牌
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  const items: TileItem[] = []
  let id = 0
  for (let layer = 0; layer < layers; layer++) {
    for (let k = 0; k < perLayer; k++) {
      const jitterX = (Math.random() - 0.5) * 8
      const jitterY = (Math.random() - 0.5) * 8
      const cols = Math.ceil(Math.sqrt(perLayer))
      const row = Math.floor(k / cols)
      const col = k % cols
      const baseX = 12 + (col / Math.max(1, cols - 1)) * 76
      const baseY = 12 + (row / Math.max(1, Math.ceil(perLayer / cols) - 1 || 1)) * 76
      items.push({
        id: id++,
        icon: pool[items.length] ?? Math.floor(Math.random() * iconCount),
        layer,
        x: Math.min(94, Math.max(6, baseX + jitterX)),
        y: Math.min(94, Math.max(6, baseY + jitterY)),
        collected: false,
      })
    }
  }
  return { items, tray: [], won: false, lost: false }
}

export function tcTap(state: TileState, itemId: number): TileState {
  if (state.won || state.lost) return state
  const item = state.items.find((i) => i.id === itemId)
  if (!item || item.collected) return state
  if (tcIsCovered(state.items, item)) return state
  if (state.tray.length >= TRAY_SIZE) return state

  const items = state.items.map((i) => (i.id === itemId ? { ...i, collected: true } : i))
  let tray = [...state.tray, item.icon]

  // 檢查是否湊滿 3 個相同
  const counts = new Map<number, number>()
  tray.forEach((icon) => counts.set(icon, (counts.get(icon) ?? 0) + 1))
  for (const [icon, count] of counts) {
    if (count >= 3) {
      let removed = 0
      tray = tray.filter((v) => {
        if (v === icon && removed < 3) {
          removed++
          return false
        }
        return true
      })
      break
    }
  }

  const allCollected = items.every((i) => i.collected)
  const lost = !allCollected && tray.length >= TRAY_SIZE
  return { items, tray, won: allCollected, lost }
}
