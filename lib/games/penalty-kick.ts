// 足球射門 — 選擇射門方向，對戰隨機撲救的門將，5 輪內進球數達標即過關。
export const PK_ROUNDS = 5
export const PK_WIN_GOALS = 3

export type PkSide = "left" | "center" | "right"

export interface PkState {
  round: number
  goals: number
  saves: number
  lastKick: PkSide | null
  lastKeeper: PkSide | null
  lastResult: "goal" | "saved" | null
  animating: boolean
  over: boolean
  won: boolean
}

export function pkNew(): PkState {
  return {
    round: 1,
    goals: 0,
    saves: 0,
    lastKick: null,
    lastKeeper: null,
    lastResult: null,
    animating: false,
    over: false,
    won: false,
  }
}

const SIDES: PkSide[] = ["left", "center", "right"]

export function pkKick(state: PkState, side: PkSide): PkState {
  if (state.over || state.animating) return state
  const keeper = SIDES[Math.floor(Math.random() * SIDES.length)]
  const scored = keeper !== side || Math.random() < 0.12
  return {
    ...state,
    lastKick: side,
    lastKeeper: keeper,
    lastResult: scored ? "goal" : "saved",
    animating: true,
    goals: state.goals + (scored ? 1 : 0),
    saves: state.saves + (scored ? 0 : 1),
  }
}

export function pkNextRound(state: PkState): PkState {
  if (!state.animating) return state
  const round = state.round + 1
  const over = round > PK_ROUNDS
  const won = over && state.goals >= PK_WIN_GOALS
  return {
    ...state,
    round: Math.min(round, PK_ROUNDS),
    animating: false,
    over,
    won,
  }
}
