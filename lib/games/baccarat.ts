// 百家樂：玩家先選押莊/押閒/押和，開牌後依標準補牌規則自動補第三張牌，比點數（尾數取個位）大小。
import { type Card, freshDeck, shuffled } from "./cards"

export type BacBet = "player" | "banker" | "tie"

export interface BacState {
  deck: Card[]
  playerCards: Card[]
  bankerCards: Card[]
  bet: BacBet | null
  status: "betting" | "over"
  outcome: "player" | "banker" | "tie" | null
  wins: number
  losses: number
  hands: number
}

// rank: 2..10 normal, 11 J,12 Q,13 K -> 0, 14 A -> 1
function cardPoint(c: Card): number {
  if (c.rank >= 11 && c.rank <= 13) return 0
  if (c.rank === 14) return 1
  return c.rank
}

function total(cards: Card[]): number {
  return cards.reduce((s, c) => s + cardPoint(c), 0) % 10
}

export function bacInitial(): BacState {
  return { deck: [], playerCards: [], bankerCards: [], bet: null, status: "betting", outcome: null, wins: 0, losses: 0, hands: 0 }
}

export function bacPlaceBet(prev: BacState, bet: BacBet): BacState {
  let deck = shuffled(freshDeck())
  if (deck.length < 10) deck = shuffled(freshDeck())
  let playerCards = [deck.pop()!, deck.pop()!]
  let bankerCards = [deck.pop()!, deck.pop()!]

  const playerTotal = total(playerCards)
  const bankerTotal = total(bankerCards)
  const natural = playerTotal >= 8 || bankerTotal >= 8

  if (!natural) {
    let playerDrew = false
    let playerThird: Card | null = null
    if (playerTotal <= 5) {
      playerThird = deck.pop()!
      playerCards = [...playerCards, playerThird]
      playerDrew = true
    }
    if (!playerDrew) {
      // Player stands (6-7), banker draws on 0-5.
      if (bankerTotal <= 5) bankerCards = [...bankerCards, deck.pop()!]
    } else {
      const thirdVal = cardPoint(playerThird!)
      const shouldBankerDraw =
        bankerTotal <= 2 ||
        (bankerTotal === 3 && thirdVal !== 8) ||
        (bankerTotal === 4 && thirdVal >= 2 && thirdVal <= 7) ||
        (bankerTotal === 5 && thirdVal >= 4 && thirdVal <= 7) ||
        (bankerTotal === 6 && (thirdVal === 6 || thirdVal === 7))
      if (shouldBankerDraw) bankerCards = [...bankerCards, deck.pop()!]
    }
  }

  const finalPlayer = total(playerCards)
  const finalBanker = total(bankerCards)
  const outcome: BacState["outcome"] = finalPlayer === finalBanker ? "tie" : finalPlayer > finalBanker ? "player" : "banker"
  const won = outcome === bet

  return {
    deck,
    playerCards,
    bankerCards,
    bet,
    status: "over",
    outcome,
    wins: prev.wins + (won ? 1 : 0),
    losses: prev.losses + (won ? 0 : 1),
    hands: prev.hands + 1,
  }
}

export function bacNewRound(prev: BacState): BacState {
  return { ...prev, playerCards: [], bankerCards: [], bet: null, status: "betting", outcome: null }
}

export { total as bacTotal }
