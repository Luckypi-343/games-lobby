// 10點半：玩家 vs 莊家(電腦)，各發2張牌，可補牌或停牌，最接近10.5點但不超過者贏。
// A算1點，J/Q/K各算0.5點，其餘照牌面點數。發牌剛好10.5點稱為「天生半」，直接開牌。
import { type Card, freshDeck, shuffled } from "./cards"

export interface TenHalfState {
  deck: Card[]
  player: Card[]
  dealer: Card[]
  status: "playing" | "over"
  result: "win" | "loss" | "push" | "bonus" | null
  wins: number
  losses: number
  hands: number
}

export function thPoints(cards: Card[]): number {
  let total = 0
  for (const c of cards) {
    if (c.rank === 14) total += 1
    else if (c.rank >= 11 && c.rank <= 13) total += 0.5
    else total += c.rank
  }
  return Math.round(total * 10) / 10
}

export function thIsBust(cards: Card[]): boolean {
  return thPoints(cards) > 10.5
}

export function thInitial(): TenHalfState {
  return thNewHand({
    deck: [],
    player: [],
    dealer: [],
    status: "playing",
    result: null,
    wins: 0,
    losses: 0,
    hands: 0,
  })
}

export function thNewHand(prev: TenHalfState): TenHalfState {
  let deck = shuffled(freshDeck())
  if (deck.length < 12) deck = shuffled(freshDeck())
  const player = [deck.pop()!, deck.pop()!]
  const dealer = [deck.pop()!, deck.pop()!]
  const playerNatural = thPoints(player) === 10.5
  const dealerNatural = thPoints(dealer) === 10.5
  if (playerNatural || dealerNatural) {
    let result: TenHalfState["result"] = "push"
    if (playerNatural && !dealerNatural) result = "bonus"
    else if (!playerNatural && dealerNatural) result = "loss"
    return {
      deck,
      player,
      dealer,
      status: "over",
      result,
      wins: prev.wins + (result === "bonus" ? 1 : 0),
      losses: prev.losses + (result === "loss" ? 1 : 0),
      hands: prev.hands + 1,
    }
  }
  return { deck, player, dealer, status: "playing", result: null, wins: prev.wins, losses: prev.losses, hands: prev.hands + 1 }
}

export function thHit(state: TenHalfState): TenHalfState {
  if (state.status !== "playing") return state
  const deck = [...state.deck]
  const player = [...state.player, deck.pop()!]
  if (thIsBust(player)) {
    return { ...state, deck, player, status: "over", result: "loss", losses: state.losses + 1 }
  }
  return { ...state, deck, player }
}

export function thStand(state: TenHalfState): TenHalfState {
  if (state.status !== "playing") return state
  const deck = [...state.deck]
  let dealer = [...state.dealer]
  while (thPoints(dealer) < 8 && !thIsBust(dealer)) {
    dealer = [...dealer, deck.pop()!]
  }
  const playerVal = thPoints(state.player)
  const dealerBust = thIsBust(dealer)
  const dealerVal = dealerBust ? -1 : thPoints(dealer)
  let result: TenHalfState["result"]
  if (dealerVal < 0 || playerVal > dealerVal) result = "win"
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
