// 三張牌撲克：玩家與莊家(電腦)各發三張牌，看牌後選擇「跟注」比大小或「棄牌」，比較三張牌牌型高低。
import { type Card, freshDeck, shuffled, evaluate3, threeCardHandName } from "./cards"

export interface TCPState {
  deck: Card[]
  player: Card[]
  dealer: Card[]
  status: "betting" | "over"
  result: "win" | "loss" | "fold" | "tie" | null
  playerHandName: string | null
  dealerHandName: string | null
  wins: number
  losses: number
  hands: number
}

export function tcpInitial(): TCPState {
  return tcpNewHand({ deck: [], player: [], dealer: [], status: "betting", result: null, playerHandName: null, dealerHandName: null, wins: 0, losses: 0, hands: 0 })
}

export function tcpNewHand(prev: TCPState): TCPState {
  let deck = shuffled(freshDeck())
  if (deck.length < 10) deck = shuffled(freshDeck())
  const player = [deck.pop()!, deck.pop()!, deck.pop()!]
  const dealer = [deck.pop()!, deck.pop()!, deck.pop()!]
  return {
    deck,
    player,
    dealer,
    status: "betting",
    result: null,
    playerHandName: null,
    dealerHandName: null,
    wins: prev.wins,
    losses: prev.losses,
    hands: prev.hands + 1,
  }
}

function cmp(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? -1
    const bv = b[i] ?? -1
    if (av !== bv) return av - bv
  }
  return 0
}

export function tcpFold(state: TCPState): TCPState {
  return { ...state, status: "over", result: "fold", losses: state.losses + 1 }
}

export function tcpCall(state: TCPState): TCPState {
  const ps = evaluate3(state.player)
  const ds = evaluate3(state.dealer)
  const diff = cmp(ps, ds)
  const result: TCPState["result"] = diff === 0 ? "tie" : diff > 0 ? "win" : "loss"
  return {
    ...state,
    status: "over",
    result,
    playerHandName: threeCardHandName(state.player),
    dealerHandName: threeCardHandName(state.dealer),
    wins: state.wins + (result === "win" ? 1 : 0),
    losses: state.losses + (result === "loss" ? 1 : 0),
  }
}
