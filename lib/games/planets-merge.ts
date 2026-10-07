// 星球合成（複製合成西瓜規格）物理合成引擎：星球自由落下、碰撞滾動，相同等級的星球碰到即合併升級。

export type PlanetItem = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  level: number // 0 = 星星 ... 9 = 星系
}

export const PLANET_LEVELS = [
  { name: "星星", radius: 11, color: "#ffd43b", score: 1 },
  { name: "月亮", radius: 15, color: "#ced4da", score: 3 },
  { name: "地球", radius: 19, color: "#3b82f6", score: 6 },
  { name: "火星", radius: 24, color: "#e8590c", score: 10 },
  { name: "木星", radius: 29, color: "#d9a066", score: 15 },
  { name: "土星", radius: 35, color: "#e8c88a", score: 21 },
  { name: "天王星", radius: 41, color: "#74c0d4", score: 28 },
  { name: "海王星", radius: 48, color: "#2f5fd0", score: 36 },
  { name: "太陽", radius: 56, color: "#ffa94d", score: 45 },
  { name: "星系", radius: 65, color: "#845ef7", score: 55 },
] as const

export const PLANET_WIDTH = 340
export const PLANET_HEIGHT = 520
export const PLANET_GRAVITY = 0.32
export const PLANET_WALL_RESTITUTION = 0.35
export const PLANET_SPAWN_MAX_LEVEL = 4

let nextId = 1
export function planetNewId() {
  return nextId++
}

export function planetRandomSpawnLevel(): number {
  return Math.floor(Math.random() * (PLANET_SPAWN_MAX_LEVEL + 1))
}

export function planetStep(
  items: PlanetItem[],
  dt: number,
): { items: PlanetItem[]; merges: { x: number; y: number; level: number; score: number }[] } {
  const list = items.map((f) => ({ ...f }))
  const merges: { x: number; y: number; level: number; score: number }[] = []

  for (const f of list) {
    f.vy += PLANET_GRAVITY * dt
    f.x += f.vx * dt
    f.y += f.vy * dt
    const r = PLANET_LEVELS[f.level].radius
    if (f.x - r < 0) {
      f.x = r
      f.vx *= -PLANET_WALL_RESTITUTION
    }
    if (f.x + r > PLANET_WIDTH) {
      f.x = PLANET_WIDTH - r
      f.vx *= -PLANET_WALL_RESTITUTION
    }
    if (f.y + r > PLANET_HEIGHT) {
      f.y = PLANET_HEIGHT - r
      f.vy *= -PLANET_WALL_RESTITUTION
      f.vx *= 0.92
    }
  }

  const toRemove = new Set<number>()
  const toAdd: PlanetItem[] = []
  for (let i = 0; i < list.length; i++) {
    if (toRemove.has(list[i].id)) continue
    for (let j = i + 1; j < list.length; j++) {
      if (toRemove.has(list[j].id)) continue
      const a = list[i]
      const b = list[j]
      const ra = PLANET_LEVELS[a.level].radius
      const rb = PLANET_LEVELS[b.level].radius
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.001
      const minDist = ra + rb
      if (dist < minDist) {
        if (a.level === b.level && a.level < PLANET_LEVELS.length - 1) {
          toRemove.add(a.id)
          toRemove.add(b.id)
          const nx = (a.x + b.x) / 2
          const ny = (a.y + b.y) / 2
          const newLevel = a.level + 1
          toAdd.push({ id: planetNewId(), x: nx, y: ny, vx: 0, vy: -1.5, level: newLevel })
          merges.push({ x: nx, y: ny, level: newLevel, score: PLANET_LEVELS[newLevel].score })
        } else {
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
  return { items: result, merges }
}

export function planetIsOver(items: PlanetItem[]): boolean {
  const dangerY = PLANET_HEIGHT * 0.12
  return items.some((f) => f.y - PLANET_LEVELS[f.level].radius < dangerY && Math.abs(f.vy) < 0.4)
}
