// 合成西瓜（Suika Game）物理合成引擎：圓形水果自由落下、碰撞滾動，相同等級的水果碰到即合併升級。

export type SuikaFruit = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  level: number // 0 = 最小櫻桃 ... 10 = 大西瓜
}

export const SUIKA_LEVELS = [
  { name: "櫻桃", radius: 11, color: "#d6336c", score: 1 },
  { name: "草莓", radius: 15, color: "#e8590c", score: 3 },
  { name: "葡萄", radius: 19, color: "#7048e8", score: 6 },
  { name: "橘子", radius: 24, color: "#f08c00", score: 10 },
  { name: "柿子", radius: 29, color: "#e8590c", score: 15 },
  { name: "蘋果", radius: 35, color: "#c92a2a", score: 21 },
  { name: "水梨", radius: 41, color: "#74b816", score: 28 },
  { name: "桃子", radius: 48, color: "#f783ac", score: 36 },
  { name: "鳳梨", radius: 56, color: "#f59f00", score: 45 },
  { name: "哈密瓜", radius: 65, color: "#94d82d", score: 55 },
  { name: "大西瓜", radius: 76, color: "#2f9e44", score: 70 },
] as const

export const SUIKA_WIDTH = 340
export const SUIKA_HEIGHT = 520
export const SUIKA_GRAVITY = 0.32
export const SUIKA_WALL_RESTITUTION = 0.35
export const SUIKA_SPAWN_MAX_LEVEL = 4 // 玩家可投放的水果等級上限（0~4：櫻桃~柿子）

let nextId = 1
export function suikaNewId() {
  return nextId++
}

export function suikaRandomSpawnLevel(): number {
  return Math.floor(Math.random() * (SUIKA_SPAWN_MAX_LEVEL + 1))
}

/** 單步物理更新：重力、邊界反彈、球與球碰撞分離，回傳是否有合併發生（含分數與合併後水果）。 */
export function suikaStep(
  fruits: SuikaFruit[],
  dt: number,
): { fruits: SuikaFruit[]; merges: { x: number; y: number; level: number; score: number }[] } {
  const list = fruits.map((f) => ({ ...f }))
  const merges: { x: number; y: number; level: number; score: number }[] = []

  for (const f of list) {
    f.vy += SUIKA_GRAVITY * dt
    f.x += f.vx * dt
    f.y += f.vy * dt
    const r = SUIKA_LEVELS[f.level].radius
    if (f.x - r < 0) {
      f.x = r
      f.vx *= -SUIKA_WALL_RESTITUTION
    }
    if (f.x + r > SUIKA_WIDTH) {
      f.x = SUIKA_WIDTH - r
      f.vx *= -SUIKA_WALL_RESTITUTION
    }
    if (f.y + r > SUIKA_HEIGHT) {
      f.y = SUIKA_HEIGHT - r
      f.vy *= -SUIKA_WALL_RESTITUTION
      f.vx *= 0.92
    }
  }

  // 碰撞分離 + 合併判定
  const toRemove = new Set<number>()
  const toAdd: SuikaFruit[] = []
  for (let i = 0; i < list.length; i++) {
    if (toRemove.has(list[i].id)) continue
    for (let j = i + 1; j < list.length; j++) {
      if (toRemove.has(list[j].id)) continue
      const a = list[i]
      const b = list[j]
      const ra = SUIKA_LEVELS[a.level].radius
      const rb = SUIKA_LEVELS[b.level].radius
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.001
      const minDist = ra + rb
      if (dist < minDist) {
        if (a.level === b.level && a.level < SUIKA_LEVELS.length - 1) {
          toRemove.add(a.id)
          toRemove.add(b.id)
          const nx = (a.x + b.x) / 2
          const ny = (a.y + b.y) / 2
          const newLevel = a.level + 1
          toAdd.push({ id: suikaNewId(), x: nx, y: ny, vx: 0, vy: -1.5, level: newLevel })
          merges.push({ x: nx, y: ny, level: newLevel, score: SUIKA_LEVELS[newLevel].score })
        } else {
          // 分離重疊，避免卡死
          const overlap = minDist - dist
          const nx = dx / dist
          const ny = dy / dist
          const totalMass = ra + rb
          const pushA = overlap * (rb / totalMass)
          const pushB = overlap * (ra / totalMass)
          a.x -= nx * pushA
          a.y -= ny * pushA
          b.x += nx * pushB
          b.y += ny * pushB
          const relVx = b.vx - a.vx
          const relVy = b.vy - a.vy
          const sep = relVx * nx + relVy * ny
          if (sep < 0) {
            const impulse = -sep * 0.5
            a.vx -= impulse * nx
            a.vy -= impulse * ny
            b.vx += impulse * nx
            b.vy += impulse * ny
          }
        }
      }
    }
  }

  const result = list.filter((f) => !toRemove.has(f.id)).concat(toAdd)
  return { fruits: result, merges }
}

export function suikaIsOver(fruits: SuikaFruit[]): boolean {
  // 任何水果靜止且頂端超過危險線（頂部 15% 高度）即算遊戲結束
  const dangerY = SUIKA_HEIGHT * 0.12
  return fruits.some((f) => f.y - SUIKA_LEVELS[f.level].radius < dangerY && Math.abs(f.vy) < 0.4)
}
