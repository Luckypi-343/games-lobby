// 飛行棋（雙人簡化版）：共用52格環形跑道，起飛需擲出6，跑完一圈進入專屬6格終點跑道，
// 4顆棋子全部抵達終點即獲勝。
export type LDPlayer = 1 | 2
export const TRACK_LEN = 52
export const HOME_LEN = 6 // 終點跑道格數（含終點格）
const START_OFFSET: Record<LDPlayer, number> = { 1: 0, 2: 26 }
export const SAFE_CELLS = [0, 26]

export interface LDState {
  tokens: Record<LDPlayer, number[]> // 每顆棋子：-1=機庫, 0~50=共用跑道相對步數, 51~56=終點跑道(56=抵達終點)
  turn: LDPlayer
  dice: number | null
  status: "playing" | "win"
  winner: LDPlayer | null
  log: string
}

export function ldInitial(): LDState {
  return {
    tokens: { 1: [-1, -1, -1, -1], 2: [-1, -1, -1, -1] },
    turn: 1,
    dice: null,
    status: "playing",
    winner: null,
    log: "請擲骰子",
  }
}

export function ldAbsoluteCell(player: LDPlayer, rel: number): number | null {
  if (rel < 0 || rel > 50) return null
  return (START_OFFSET[player] + rel) % TRACK_LEN
}

export function ldRoll(): number {
  return 1 + Math.floor(Math.random() * 6)
}

export interface LDMoveOption {
  tokenIndex: number
  captures: boolean
  finishes: boolean
}

export function ldValidMoves(state: LDState, player: LDPlayer, dice: number): LDMoveOption[] {
  const opts: LDMoveOption[] = []
  state.tokens[player].forEach((rel, i) => {
    if (rel === -1) {
      if (dice === 6) opts.push({ tokenIndex: i, captures: false, finishes: false })
      return
    }
    const newRel = rel + dice
    if (newRel > HOME_LEN + 50) return
    const finishes = newRel === HOME_LEN + 50
    let captures = false
    if (newRel <= 50) {
      const cell = ldAbsoluteCell(player, newRel)
      const opponent: LDPlayer = player === 1 ? 2 : 1
      if (cell !== null && !SAFE_CELLS.includes(cell)) {
        captures = state.tokens[opponent].some((oRel) => oRel >= 0 && oRel <= 50 && ldAbsoluteCell(opponent, oRel) === cell)
      }
    }
    opts.push({ tokenIndex: i, captures, finishes })
  })
  return opts
}

export function ldApplyMove(state: LDState, player: LDPlayer, dice: number, tokenIndex: number): LDState {
  const tokens: Record<LDPlayer, number[]> = { 1: [...state.tokens[1]], 2: [...state.tokens[2]] }
  const rel = tokens[player][tokenIndex]
  let newRel: number
  let log = ""
  if (rel === -1) {
    newRel = 0
    log = "棋子起飛！"
  } else {
    newRel = rel + dice
    log = `移動了 ${dice} 步`
  }
  tokens[player][tokenIndex] = newRel

  if (newRel <= 50) {
    const cell = ldAbsoluteCell(player, newRel)
    const opponent: LDPlayer = player === 1 ? 2 : 1
    if (cell !== null && !SAFE_CELLS.includes(cell)) {
      tokens[opponent] = tokens[opponent].map((oRel) => {
        if (oRel >= 0 && oRel <= 50 && ldAbsoluteCell(opponent, oRel) === cell) {
          log = "擊落對方棋子！"
          return -1
        }
        return oRel
      })
    }
  }

  const won = tokens[player].every((r) => r === HOME_LEN + 50)
  const nextTurn: LDPlayer = dice === 6 && !won ? player : player === 1 ? 2 : 1

  return {
    tokens,
    turn: nextTurn,
    dice: null,
    status: won ? "win" : "playing",
    winner: won ? player : null,
    log: won ? "全部棋子抵達終點！" : log,
  }
}

export function ldBestMove(state: LDState, player: LDPlayer, dice: number): number | null {
  const opts = ldValidMoves(state, player, dice)
  if (opts.length === 0) return null
  const finish = opts.find((o) => o.finishes)
  if (finish) return finish.tokenIndex
  const capture = opts.find((o) => o.captures)
  if (capture) return capture.tokenIndex
  // 優先移動走得最遠的棋子，其次起飛新棋子
  const onTrack = opts.filter((o) => state.tokens[player][o.tokenIndex] >= 0)
  if (onTrack.length > 0) {
    onTrack.sort((a, b) => state.tokens[player][b.tokenIndex] - state.tokens[player][a.tokenIndex])
    return onTrack[0].tokenIndex
  }
  return opts[0].tokenIndex
}
