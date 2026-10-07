// 麻將九點半：用麻將棋子代替撲克牌玩「21點/十點半」式的比點數遊戲。
// 一筒~九筒 / 一索~九索 / 一萬~九萬 依數字算點，東南西北中發與白板算 0.5 點。
// 目標：手牌點數總和儘量接近 9.5 點但不能超過，超過即爆牌。

export type NPTile = { id: string; label: string; points: number }

const SUITS: Array<"t" | "s" | "w"> = ["t", "s", "w"]
const HONORS = ["E", "S", "W", "N", "R", "G", "B"] as const

function buildDeck(): NPTile[] {
  const deck: NPTile[] = []
  for (const suit of SUITS) {
    for (let n = 1; n <= 9; n++) {
      for (let copy = 0; copy < 4; copy++) {
        deck.push({ id: `${suit}${n}-${copy}`, label: `${suit}${n}`, points: n })
      }
    }
  }
  for (const h of HONORS) {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({ id: `${h}-${copy}`, label: h, points: 0.5 })
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export type NPPhase = "betting" | "player-turn" | "dealer-turn" | "result"

export type NPState = {
  phase: NPPhase
  deck: NPTile[]
  playerHand: NPTile[]
  dealerHand: NPTile[]
  bet: number
  result?: {
    outcome: "win" | "lose" | "push"
    playerTotal: number
    dealerTotal: number
    playerBust: boolean
    dealerBust: boolean
    multiplier: number
    payout: number
  }
}

export function npTotal(hand: NPTile[]): number {
  const sum = hand.reduce((s, t) => s + t.points, 0)
  return Math.round(sum * 10) / 10
}

export function npIsBust(hand: NPTile[]): boolean {
  return npTotal(hand) > 9.5
}

export function npInitial(bet: number): NPState {
  return { phase: "betting", deck: [], playerHand: [], dealerHand: [], bet }
}

export function npDeal(bet: number): NPState {
  const deck = shuffle(buildDeck())
  const playerHand = [deck.pop()!, deck.pop()!]
  const dealerHand = [deck.pop()!, deck.pop()!]
  return { phase: "player-turn", deck, playerHand, dealerHand, bet }
}

export function npPlayerHit(state: NPState): NPState {
  if (state.phase !== "player-turn") return state
  const deck = [...state.deck]
  const tile = deck.pop()
  if (!tile) return state
  const playerHand = [...state.playerHand, tile]
  if (npIsBust(playerHand)) {
    return settle({ ...state, deck, playerHand, phase: "dealer-turn" })
  }
  return { ...state, deck, playerHand }
}

export function npPlayerStand(state: NPState): NPState {
  if (state.phase !== "player-turn") return state
  return settle({ ...state, phase: "dealer-turn" })
}

function dealerPlay(state: NPState): NPState {
  let deck = [...state.deck]
  let dealerHand = [...state.dealerHand]
  // 莊家策略：低於 7 點必補牌，7～9.5 之間視情況補（接近玩家時才補），超過即停。
  while (npTotal(dealerHand) < 7 && deck.length > 0) {
    const tile = deck.pop()
    if (!tile) break
    dealerHand = [...dealerHand, tile]
  }
  const playerTotal = npTotal(state.playerHand)
  while (
    npTotal(dealerHand) < 9.5 &&
    npTotal(dealerHand) <= playerTotal &&
    !npIsBust(state.playerHand) &&
    deck.length > 0 &&
    npTotal(dealerHand) < 9
  ) {
    const tile = deck.pop()
    if (!tile) break
    dealerHand = [...dealerHand, tile]
  }
  return { ...state, deck, dealerHand }
}

function settle(state: NPState): NPState {
  const afterDealer = dealerPlay(state)
  const playerTotal = npTotal(afterDealer.playerHand)
  const dealerTotal = npTotal(afterDealer.dealerHand)
  const playerBust = npIsBust(afterDealer.playerHand)
  const dealerBust = npIsBust(afterDealer.dealerHand)

  let outcome: "win" | "lose" | "push"
  let multiplier = 1
  if (playerBust) {
    outcome = "lose"
  } else if (dealerBust) {
    outcome = "win"
  } else if (playerTotal === 9.5 && afterDealer.playerHand.length === 2) {
    outcome = dealerTotal === 9.5 && afterDealer.dealerHand.length === 2 ? "lose" : "win"
    multiplier = 2 // 兩張剛好湊 9.5 點（天牌）加倍
  } else if (dealerTotal === 9.5 && afterDealer.dealerHand.length === 2) {
    outcome = "lose"
  } else if (playerTotal > dealerTotal) {
    outcome = "win"
  } else if (playerTotal < dealerTotal) {
    outcome = "lose"
  } else {
    outcome = "lose" // 同點莊家勝（莊家優勢），符合推筒仔同點判定的慣例
  }

  const payout = outcome === "win" ? afterDealer.bet * multiplier : outcome === "push" ? 0 : -afterDealer.bet

  return {
    ...afterDealer,
    phase: "result",
    result: { outcome, playerTotal, dealerTotal, playerBust, dealerBust, multiplier, payout },
  }
}
