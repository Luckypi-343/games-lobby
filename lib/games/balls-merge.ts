// 球類合成（複製合成西瓜規格）物理合成引擎：圓形球類自由落下、碰撞滾動，相同等級的球碰到即合併升級。

export type BallItem = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  level: number // 0 = 乒乓球 ... 10 = 橄欖球
}

export const BALL_LEVELS = [
  { name: "乒乓球", radius: 11, color: "#fdfaf3", score: 1 },
  { name: "撞球", radius: 15, color: "#e03131", score: 3 },
  { name: "網球", radius: 19, color: "#d4e157", score: 6 },
  { name: "樂樂球", radius: 24, color: "#ff922b", score: 10 },
  { name: "棒球", radius: 29, color: "#f8f4e8", score: 15 },
  { name: "槌球", radius: 35, color: "#1971c2", score: 21 },
  { name: "手球", radius: 41, color: "#fab005", score: 28 },
  { name: "足球", radius: 48, color: "#f1f3f5", score: 36 },
  { name: "排球", radius: 56, color: "#ffd43b", score: 45 },
  { name: "籃球", radius: 65, color: "#e8590c", score: 55 },
  { name: "橄欖球", radius: 76, color: "#8b5a2b", score: 70 },
] as const

export const BALL_WIDTH = 340
export const BALL_HEIGHT = 520
export const BALL_GRAVITY = 0.32
export const BALL_WALL_RESTITUTION = 0.35
export const BALL_SPAWN_MAX_LEVEL = 4

let nextId = 1
export function ballNewId() {
  return nextId++
}

export function ballRandomSpawnLevel(): number {
  return Math.floor(Math.random() * (BALL_SPAWN_MAX_LEVEL + 1))
}

export function ballStep(
  items: BallItem[],
  dt: number,
): { items: BallItem[]; merges: { x: number; y: number; level: number; score: number }[] } {
  const list = items.map((f) => ({ ...f }))
  const merges: { x: number; y: number; level: number; score: number }[] = []

  for (const f of list) {
    f.vy += BALL_GRAVITY * dt
    f.x += f.vx * dt
    f.y += f.vy * dt
    const r = BALL_LEVELS[f.level].radius
    if (f.x - r < 0) {
      f.x = r
      f.vx *= -BALL_WALL_RESTITUTION
    }
    if (f.x + r > BALL_WIDTH) {
      f.x = BALL_WIDTH - r
      f.vx *= -BALL_WALL_RESTITUTION
    }
    if (f.y + r > BALL_HEIGHT) {
      f.y = BALL_HEIGHT - r
      f.vy *= -BALL_WALL_RESTITUTION
      f.vx *= 0.92
    }
  }

  const toRemove = new Set<number>()
  const toAdd: BallItem[] = []
  for (let i = 0; i < list.length; i++) {
    if (toRemove.has(list[i].id)) continue
    for (let j = i + 1; j < list.length; j++) {
      if (toRemove.has(list[j].id)) continue
      const a = list[i]
      const b = list[j]
      const ra = BALL_LEVELS[a.level].radius
      const rb = BALL_LEVELS[b.level].radius
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy) || 0.001
      const minDist = ra + rb
      if (dist < minDist) {
        if (a.level === b.level && a.level < BALL_LEVELS.length - 1) {
          toRemove.add(a.id)
          toRemove.add(b.id)
          const nx = (a.x + b.x) / 2
          const ny = (a.y + b.y) / 2
          const newLevel = a.level + 1
          toAdd.push({ id: ballNewId(), x: nx, y: ny, vx: 0, vy: -1.5, level: newLevel })
          merges.push({ x: nx, y: ny, level: newLevel, score: BALL_LEVELS[newLevel].score })
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

export function ballIsOver(items: BallItem[]): boolean {
  const dangerY = BALL_HEIGHT * 0.12
  return items.some((f) => f.y - BALL_LEVELS[f.level].radius < dangerY && Math.abs(f.vy) < 0.4)
}
