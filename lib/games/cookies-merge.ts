// 餅乾合成（複製合成西瓜規格）物理合成引擎：幾何餅乾自由落下、碰撞滾動，相同等級的餅乾碰到即合併升級。

export type CookieItem = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  level: number // 0 = 三角小餅乾 ... 9 = 超大餅
}

export const COOKIE_LEVELS = [
  { name: "三角餅乾", radius: 11, color: "#d9a066", score: 1 },
  { name: "小圓餅乾", radius: 15, color: "#c98a4b", score: 3 },
  { name: "愛心餅乾", radius: 19, color: "#e8927c", score: 6 },
  { name: "格子鬆餅", radius: 24, color: "#e3a857", score: 10 },
  { name: "甜甜圈", radius: 29, color: "#d87a3e", score: 15 },
  { name: "貝果", radius: 35, color: "#b4783a", score: 21 },
  { name: "迷你披薩", radius: 41, color: "#e8b14a", score: 28 },
  { name: "披薩", radius: 48, color: "#e2a73f", score: 36 },
  { name: "大餅", radius: 56, color: "#d99a3e", score: 45 },
  { name: "超大餅", radius: 65, color: "#c88738", score: 55 },
] as const

export const COOKIE_WIDTH = 340
export const COOKIE_HEIGHT = 520
export const COOKIE_GRAVITY = 0.32
export const COOKIE_WALL_RESTITUTION = 0.35
export const COOKIE_SPAWN_MAX_LEVEL = 4

let nextId = 1
export function cookieNewId() {
  return nextId++
}

export function cookieRandomSpawnLevel(): number {
  return Math.floor(Math.random() * (COOKIE_SPAWN_MAX_LEVEL + 1))
}

export function cookieStep(
  items: CookieItem[],
  dt: number,
): { items: CookieItem[]; merges: { x: number; y: number; level: number; score: number }[] } {
  const list = items.map((f) => ({ ...f }))
  const merges: { x: number; y: number; level: number; score: number }[] = []

  for (const f of list) {
    f.vy += COOKIE_GRAVITY * dt
    f.x += f.vx * dt
    f.y += f.vy * dt
    const r = COOKIE_LEVELS[f.level].radius
    if (f.x - r < 0) {
      f.x = r
      f.vx *= -COOKIE_WALL_RESTITUTION
    }
    if (f.x + r > COOKIE_WIDTH) {
      f.x = COOKIE_WIDTH - r
      f.vx *= -COOKIE_WALL_RESTITUTION
    }
    if (f.y + r > COOKIE_HEIGHT) {
      f.y = COOKIE_HEIGHT - r
      f.vy *= -COOKIE_WALL_RESTITUTION
      f.vx *= 0.92
    }
  }

  const toRemove = new Set<number>()
  const toAdd: CookieItem[] = []
  for (let i = 0; i < list.length; i++) {
    if (toRemove.has(list[i].id)) continue
    for (let j = i + 1; j < list.length; j++) {
      if (toRemove.has(list[j].id)) continue
      const a = list[i]
      const b = list[j]
      const ra = COOKIE_LEVELS[a.level].radius
      const rb = COOKIE_LEVELS[b.level].radius
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.001
      const minDist = ra + rb
      if (dist < minDist) {
        if (a.level === b.level && a.level < COOKIE_LEVELS.length - 1) {
          toRemove.add(a.id)
          toRemove.add(b.id)
          const nx = (a.x + b.x) / 2
          const ny = (a.y + b.y) / 2
          const newLevel = a.level + 1
          toAdd.push({ id: cookieNewId(), x: nx, y: ny, vx: 0, vy: -1.5, level: newLevel })
          merges.push({ x: nx, y: ny, level: newLevel, score: COOKIE_LEVELS[newLevel].score })
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

export function cookieIsOver(items: CookieItem[]): boolean {
  const dangerY = COOKIE_HEIGHT * 0.12
  return items.some((f) => f.y - COOKIE_LEVELS[f.level].radius < dangerY && Math.abs(f.vy) < 0.4)
}
