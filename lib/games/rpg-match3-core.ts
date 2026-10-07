// 共用引擎：寶石消除 + 角色養成戰鬥，供 73 救世之塔／74 智龍迷城／75 帝國與拼圖 共用。
export const RM_SIZE = 6
export type RmOrb = 0 | 1 | 2 | 3 | 4 | 5 // 0 火 1 水 2 木 3 光 4 暗 5 心(回血)

export interface RmCharacter {
  id: string
  name: string
  element: RmOrb // 0-4，心屬性不會做為角色主屬性
  maxHp: number
  hp: number
  atk: number
  level: number
  exp: number
}

export interface RmEnemy {
  id: string
  name: string
  element: RmOrb
  maxHp: number
  hp: number
  atk: number
  turnsToAttack: number
  attackIn: number
}

export interface RmState {
  grid: RmOrb[]
  party: RmCharacter[]
  enemies: RmEnemy[]
  enemyIndex: number
  stage: number
  maxStage: number
  log: string[]
  gold: number
  resources: { wood: number; stone: number; food: number }
  cleared: boolean
  defeated: boolean
  lastDamage: number
}

function randomOrb(): RmOrb {
  return Math.floor(Math.random() * 6) as RmOrb
}
function idx(r: number, c: number): number {
  return r * RM_SIZE + c
}

function findMatches(grid: RmOrb[]): boolean[] {
  const matched = Array(grid.length).fill(false)
  for (let r = 0; r < RM_SIZE; r++) {
    for (let c = 0; c < RM_SIZE - 2; c++) {
      const a = grid[idx(r, c)]
      if (a === grid[idx(r, c + 1)] && a === grid[idx(r, c + 2)]) {
        matched[idx(r, c)] = matched[idx(r, c + 1)] = matched[idx(r, c + 2)] = true
      }
    }
  }
  for (let c = 0; c < RM_SIZE; c++) {
    for (let r = 0; r < RM_SIZE - 2; r++) {
      const a = grid[idx(r, c)]
      if (a === grid[idx(r + 1, c)] && a === grid[idx(r + 2, c)]) {
        matched[idx(r, c)] = matched[idx(r + 1, c)] = matched[idx(r + 2, c)] = true
      }
    }
  }
  return matched
}

function applyGravity(grid: RmOrb[]): RmOrb[] {
  const next = [...grid]
  for (let c = 0; c < RM_SIZE; c++) {
    const col: RmOrb[] = []
    for (let r = RM_SIZE - 1; r >= 0; r--) {
      if (next[idx(r, c)] !== -1) col.push(next[idx(r, c)])
    }
    while (col.length < RM_SIZE) col.push(randomOrb())
    for (let r = RM_SIZE - 1; r >= 0; r--) {
      next[idx(r, c)] = col[RM_SIZE - 1 - r]
    }
  }
  return next
}

// 屬性相剋（簡化版）：火克木、木克水、水克火；光暗互剋。回傳倍率。
export function elementAdvantage(attacker: RmOrb, defender: RmOrb): number {
  const beats: Partial<Record<RmOrb, RmOrb>> = { 0: 2, 2: 0, 1: 2 as RmOrb, 3: 4, 4: 3 }
  if (attacker === 0 && defender === 2) return 1.5 // 火克木
  if (attacker === 2 && defender === 1) return 1.5 // 木克水
  if (attacker === 1 && defender === 0) return 1.5 // 水克火
  if (attacker === 3 && defender === 4) return 1.5 // 光克暗
  if (attacker === 4 && defender === 3) return 1.5 // 暗克光
  void beats
  return 1
}

function resolveBoard(grid: RmOrb[]): { grid: RmOrb[]; clearedByColor: number[] } {
  let current = grid
  const clearedByColor = [0, 0, 0, 0, 0, 0]
  for (let i = 0; i < 12; i++) {
    const matched = findMatches(current)
    if (!matched.some(Boolean)) break
    for (let k = 0; k < current.length; k++) {
      if (matched[k]) clearedByColor[current[k]]++
    }
    const removed = current.map((v, k) => (matched[k] ? (-1 as unknown as RmOrb) : v))
    current = applyGravity(removed)
  }
  return { grid: current, clearedByColor }
}

export function rmNewBoard(): RmOrb[] {
  let grid = Array.from({ length: RM_SIZE * RM_SIZE }, randomOrb)
  for (let i = 0; i < 8; i++) {
    const { grid: resolved, clearedByColor } = resolveBoard(grid)
    grid = resolved
    if (clearedByColor.every((v) => v === 0)) break
  }
  return grid
}

export function rmPushLog(state: RmState, line: string): RmState {
  return { ...state, log: [line, ...state.log].slice(0, 6) }
}

function currentEnemy(state: RmState): RmEnemy | null {
  return state.enemies[state.enemyIndex] ?? null
}

export function rmSwap(state: RmState, a: number, b: number): RmState {
  if (state.cleared || state.defeated) return state
  const ra = Math.floor(a / RM_SIZE)
  const ca = a % RM_SIZE
  const rb = Math.floor(b / RM_SIZE)
  const cb = b % RM_SIZE
  if (Math.abs(ra - rb) + Math.abs(ca - cb) !== 1) return state
  const swapped = [...state.grid]
  ;[swapped[a], swapped[b]] = [swapped[b], swapped[a]]
  const matched = findMatches(swapped)
  if (!matched.some(Boolean)) return state

  const { grid, clearedByColor } = resolveBoard(swapped)
  let next: RmState = { ...state, grid }
  const enemy = currentEnemy(next)
  let totalDamage = 0
  let healing = 0

  for (let color = 0 as RmOrb; color <= 4; color++) {
    const count = clearedByColor[color]
    if (count < 3) continue
    const fighters = next.party.filter((p) => p.element === color && p.hp > 0)
    if (fighters.length === 0) continue
    const perFighter = fighters.map((f) => f.atk)
    const base = perFighter.reduce((s, v) => s + v, 0)
    const comboBonus = 1 + (count - 3) * 0.3
    const adv = enemy ? elementAdvantage(color, enemy.element) : 1
    totalDamage += Math.round(base * comboBonus * adv)
  }
  healing += clearedByColor[5] >= 3 ? 20 + (clearedByColor[5] - 3) * 10 : 0

  if (healing > 0) {
    next.party = next.party.map((p) => ({ ...p, hp: Math.min(p.maxHp, p.hp + healing) }))
    next = rmPushLog(next, `治癒團隊 +${healing} HP`)
  }

  if (enemy && totalDamage > 0) {
    const newHp = Math.max(0, enemy.hp - totalDamage)
    const enemies = [...next.enemies]
    enemies[next.enemyIndex] = { ...enemy, hp: newHp, attackIn: enemy.attackIn - 1 }
    next = { ...next, enemies }
    next = rmPushLog(next, `對 ${enemy.name} 造成 ${totalDamage} 傷害`)
    next.lastDamage = totalDamage

    if (newHp <= 0) {
      next = rmPushLog(next, `${enemy.name} 被擊敗！`)
      next.gold += 30 + next.stage * 10
      next.resources = {
        wood: next.resources.wood + 5,
        stone: next.resources.stone + 3,
        food: next.resources.food + 4,
      }
      if (next.enemyIndex + 1 >= next.enemies.length) {
        next = { ...next, cleared: true }
        next = rmPushLog(next, `第 ${next.stage} 關全數擊破！`)
      } else {
        next = { ...next, enemyIndex: next.enemyIndex + 1 }
      }
    }
  } else if (totalDamage === 0) {
    next.lastDamage = 0
  }

  // 敵人倒數攻擊
  const liveEnemy = next.enemies[next.enemyIndex]
  if (liveEnemy && liveEnemy.hp > 0) {
    if (liveEnemy.attackIn <= 0) {
      const target = next.party.filter((p) => p.hp > 0)
      if (target.length > 0) {
        const dmgEach = Math.round(liveEnemy.atk / target.length)
        next.party = next.party.map((p) =>
          p.hp > 0 ? { ...p, hp: Math.max(0, p.hp - dmgEach) } : p,
        )
        next = rmPushLog(next, `${liveEnemy.name} 反擊，全隊受到 ${dmgEach} 傷害`)
      }
      const enemies = [...next.enemies]
      enemies[next.enemyIndex] = { ...liveEnemy, attackIn: liveEnemy.turnsToAttack }
      next = { ...next, enemies }
    }
  }

  if (next.party.every((p) => p.hp <= 0)) {
    next = { ...next, defeated: true }
    next = rmPushLog(next, "隊伍全滅，挑戰失敗")
  }

  return next
}

export function rmLevelUp(party: RmCharacter[]): RmCharacter[] {
  return party.map((p) => {
    const needed = 50 + (p.level - 1) * 30
    if (p.exp < needed) return p
    let { level, exp, maxHp, atk } = p
    while (exp >= needed) {
      exp -= needed
      level++
      maxHp += 15
      atk += 4
    }
    return { ...p, level, exp, maxHp, hp: maxHp, atk }
  })
}

export function rmGrantStageExp(state: RmState): RmState {
  if (!state.cleared) return state
  const party = rmLevelUp(
    state.party.map((p) => ({ ...p, exp: p.exp + 40 + state.stage * 10 })),
  )
  return { ...state, party }
}
