// 21點：玩家 vs 莊家(電腦)，標準規則，A可算1或11，莊家需持牌到17點以上。
import { type Card, freshDeck, shuffled } from "./cards"

export interface BJState {
  deck: Card[]
  player: Card[]
  dealer: Card[]
  status: "playing" | "dealer" | "over"
  result: "win" | "loss" | "push" | "blackjack" | null
  wins: number
  losses: number
  hands: number
}

export function bjHandValue(cards: Card[]): number {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.rank >= 11 && c.rank <= 13) total += 10
    else if (c.rank === 14) {
      total += 11
      aces++
    } else total += c.rank
  }
  while (total > 21 && aces > 0) {
    total -= 10
    aces--
  }
  return total
}

export function bjIsBlackjack(cards: Card[]): boolean {
  return cards.length === 2 && bjHandValue(cards) === 21
}

export function bjInitial(): BJState {
  return bjNewHand({ deck: [], player: [], dealer: [], status: "playing", result: null, wins: 0, losses: 0, hands: 0 })
}

export function bjNewHand(prev: BJState): BJState {
  let deck = shuffled(freshDeck())
  if (deck.length < 15) deck = shuffled(freshDeck())
  const player = [deck.pop()!, deck.pop()!]
  const dealer = [deck.pop()!, deck.pop()!]
  const playerBJ = bjIsBlackjack(player)
  const dealerBJ = bjIsBlackjack(dealer)
  if (playerBJ || dealerBJ) {
    let result: BJState["result"] = "push"
    if (playerBJ && !dealerBJ) result = "blackjack"
    else if (!playerBJ && dealerBJ) result = "loss"
    return {
      deck,
      player,
      dealer,
      status: "over",
      result,
      wins: prev.wins + (result === "blackjack" ? 1 : 0),
      losses: prev.losses + (result === "loss" ? 1 : 0),
      hands: prev.hands + 1,
    }
  }
  return { deck, player, dealer, status: "playing", result: null, wins: prev.wins, losses: prev.losses, hands: prev.hands + 1 }
}

export function bjHit(state: BJState): BJState {
  if (state.status !== "playing") return state
  const deck = [...state.deck]
  const player = [...state.player, deck.pop()!]
  const value = bjHandValue(player)
  if (value > 21) {
    return { ...state, deck, player, status: "over", result: "loss", losses: state.losses + 1 }
  }
  return { ...state, deck, player }
}

export function bjStand(state: BJState): BJState {
  if (state.status !== "playing") return state
  const deck = [...state.deck]
  let dealer = [...state.dealer]
  while (bjHandValue(dealer) < 17) {
    dealer = [...dealer, deck.pop()!]
  }
  const playerVal = bjHandValue(state.player)
  const dealerVal = bjHandValue(dealer)
  let result: BJState["result"]
  if (dealerVal > 21 || playerVal > dealerVal) result = "win"
  else if (playerVal < dealerVal) result = "loss"
  else result = "push"
  return {
    ...state,
    deck,
    dealer,
    status: "over",
    result,
    wins: state.wins + (result === "win" ? 1 : 0),
    losses: state.losses + (result === "loss" ? 1 : 0),
  }
}
