// 射龍門：用麻將筒子（一筒～九筒，各4張，共36張）代替撲克牌。先開兩張牌當「球門」，
// 玩家下注後開第三張牌：點數介於門內（不含門柱本身）即贏；在門外則輸；剛好等於門柱（撞柱）要賠雙倍。
export const BET_MIN = 10
export const BET_MAX = 500
export const BET_STEP = 10

export interface DGTile {
  num: number // 1..9
  id: string
}

export type DGResult = "win" | "lose" | "post" | null

export interface DGState {
  deck: DGTile[]
  gateLow: DGTile | null
  gateHigh: DGTile | null
  revealed: DGTile | null
  bet: number
  balanceDelta: number
  result: DGResult
  phase: "betting" | "revealed"
}

function buildDeck(): DGTile[] {
  const tiles: DGTile[] = []
  let id = 0
  for (let n = 1; n <= 9; n++) {
    for (let k = 0; k < 4; k++) tiles.push({ num: n, id: `t${n}-${id++}` })
  }
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

export function dgInitial(bet = 10): DGState {
  return dgOpenGate({
    deck: [],
    gateLow: null,
    gateHigh: null,
    revealed: null,
    bet,
    balanceDelta: 0,
    result: null,
    phase: "betting",
  })
}

export function dgSetBet(state: DGState, bet: number): DGState {
  return { ...state, bet: Math.max(BET_MIN, Math.min(BET_MAX, bet)) }
}

// 開出新的一局：重新整副牌並開兩張做球門（相同點數就重開，避免門寬為0無法判定）。
export function dgOpenGate(state: DGState): DGState {
  let deck = buildDeck()
  let a = deck.pop()!
  let b = deck.pop()!
  let guard = 0
  while (a.num === b.num && guard < 50) {
    deck = buildDeck()
    a = deck.pop()!
    b = deck.pop()!
    guard++
  }
  const gateLow = a.num <= b.num ? a : b
  const gateHigh = a.num <= b.num ? b : a
  return {
    deck,
    gateLow,
    gateHigh,
    revealed: null,
    bet: state.bet,
    balanceDelta: 0,
    result: null,
    phase: "betting",
  }
}

export function dgGateWidth(state: DGState): number {
  if (!state.gateLow || !state.gateHigh) return 0
  return state.gateHigh.num - state.gateLow.num - 1
}

export function dgReveal(state: DGState): DGState {
  if (state.phase !== "betting" || !state.gateLow || !state.gateHigh) return state
  const deck = [...state.deck]
  const revealed = deck.pop()
  if (!revealed) return state
  let result: DGResult
  let delta: number
  if (revealed.num === state.gateLow.num || revealed.num === state.gateHigh.num) {
    result = "post" // 撞柱，賠雙倍
    delta = -state.bet * 2
  } else if (revealed.num > state.gateLow.num && revealed.num < state.gateHigh.num) {
    result = "win"
    delta = state.bet
  } else {
    result = "lose"
    delta = -state.bet
  }
  return { ...state, deck, revealed, result, balanceDelta: delta, phase: "revealed" }
}
