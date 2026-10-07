// 決鬥擂台 — 回合制對戰，選擇攻擊／防禦／必殺技，率先擊倒對手者獲勝。
export const DA_MAX_HP = 100

export type DaAction = "attack" | "defend" | "special"

export interface DaLogEntry {
  text: string
  kind: "player" | "enemy" | "info"
}

export interface DaState {
  playerHp: number
  enemyHp: number
  playerCharge: number
  enemyCharge: number
  playerGuard: boolean
  enemyGuard: boolean
  turn: number
  log: DaLogEntry[]
  over: boolean
  won: boolean
}

export function daNew(): DaState {
  return {
    playerHp: DA_MAX_HP,
    enemyHp: DA_MAX_HP,
    playerCharge: 0,
    enemyCharge: 0,
    playerGuard: false,
    enemyGuard: false,
    turn: 1,
    log: [{ text: "決鬥開始！", kind: "info" }],
    over: false,
    won: false,
  }
}

function rand(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1))
}

export function daAct(state: DaState, action: DaAction): DaState {
  if (state.over) return state
  if (action === "special" && state.playerCharge < 3) return state

  const log: DaLogEntry[] = [...state.log]
  let enemyHp = state.enemyHp
  let playerCharge = state.playerCharge
  const enemyGuard = state.enemyGuard
  let playerGuard = false

  if (action === "attack") {
    const dmg = rand(12, 20)
    const applied = enemyGuard ? Math.round(dmg * 0.5) : dmg
    enemyHp = Math.max(0, enemyHp - applied)
    playerCharge = Math.min(3, playerCharge + 1)
    log.push({ text: `您發動攻擊，造成 ${applied} 傷害！`, kind: "player" })
  } else if (action === "defend") {
    playerGuard = true
    log.push({ text: "您舉起護甲，準備防禦下一波攻擊。", kind: "player" })
  } else {
    const dmg = rand(35, 45)
    const applied = enemyGuard ? Math.round(dmg * 0.5) : dmg
    enemyHp = Math.max(0, enemyHp - applied)
    playerCharge = 0
    log.push({ text: `您蓄力使出必殺技，造成 ${applied} 傷害！`, kind: "player" })
  }

  if (enemyHp <= 0) {
    return {
      ...state,
      enemyHp: 0,
      playerCharge,
      playerGuard,
      log: log.slice(-8),
      over: true,
      won: true,
    }
  }

  let playerHp = state.playerHp
  let enemyCharge = state.enemyCharge
  const roll = Math.random()
  let enemyAction: DaAction
  if (enemyCharge >= 3 && roll < 0.4) enemyAction = "special"
  else if (roll < 0.22) enemyAction = "defend"
  else enemyAction = "attack"

  let nextEnemyGuard = false
  if (enemyAction === "attack") {
    const dmg = rand(10, 18)
    const applied = playerGuard ? Math.round(dmg * 0.5) : dmg
    playerHp = Math.max(0, playerHp - applied)
    enemyCharge = Math.min(3, enemyCharge + 1)
    log.push({ text: `對手反擊，造成 ${applied} 傷害！`, kind: "enemy" })
  } else if (enemyAction === "defend") {
    nextEnemyGuard = true
    log.push({ text: "對手擺出防禦姿態。", kind: "enemy" })
  } else {
    const dmg = rand(35, 45)
    const applied = playerGuard ? Math.round(dmg * 0.5) : dmg
    playerHp = Math.max(0, playerHp - applied)
    enemyCharge = 0
    log.push({ text: `對手使出必殺技，造成 ${applied} 傷害！`, kind: "enemy" })
  }

  const over = playerHp <= 0
  return {
    playerHp,
    enemyHp,
    playerCharge,
    enemyCharge,
    playerGuard,
    enemyGuard: nextEnemyGuard,
    turn: state.turn + 1,
    log: log.slice(-8),
    over,
    won: false,
  }
}
