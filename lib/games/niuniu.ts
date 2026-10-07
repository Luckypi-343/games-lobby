// 牛牛：玩家 vs 莊家(電腦)，各發5張牌，從中挑3張湊成10的倍數（稱為「牛」），
// 剩下2張點數相加取個位數，數字越大越好，湊到剛好整10稱為「牛牛」最大，湊不出倍數則「無牛」最小。
import { type Card, freshDeck, shuffled } from "./cards"

export interface NiuState {
  deck: Card[]
  player: Card[]
  dealer: Card[]
  status: "betting" | "over"
  result: "win" | "loss" | "tie" | null
  playerNiu: number
  dealerNiu: number
  wins: number
  losses: number
  hands: number
}

function niuCardValue(c: Card): number {
  if (c.rank >= 11 && c.rank <= 13) return 10 // J/Q/K
  if (c.rank === 14) return 1 // A
  return c.rank
}

// 從5張牌中找出最佳的「牛」點數：0=無牛，1~9=牛X，10=牛牛(最大)。
export function niuScore(cards: Card[]): number {
  const idx = [0, 1, 2, 3, 4]
  let best = -1
  for (let a = 0; a < 5; a++) {
    for (let b = a + 1; b < 5; b++) {
      for (let c = b + 1; c < 5; c++) {
        const sum3 = niuCardValue(cards[a]) + niuCardValue(cards[b]) + niuCardValue(cards[c])
        if (sum3 % 10 !== 0) continue
        const rest = idx.filter((i) => i !== a && i !== b && i !== c)
        const sum2 = (niuCardValue(cards[rest[0]]) + niuCardValue(cards[rest[1]])) % 10
        const score = sum2 === 0 ? 10 : sum2
        if (score > best) best = score
      }
    }
  }
  return best < 0 ? 0 : best
}

export function niuLabel(score: number): string {
  if (score === 0) return "無牛"
  if (score === 10) return "牛牛"
  return `牛${score}`
}

export function niuInitial(): NiuState {
  return niuNewHand({
    deck: [],
    player: [],
    dealer: [],
    status: "betting",
    result: null,
    playerNiu: 0,
    dealerNiu: 0,
    wins: 0,
    losses: 0,
    hands: 0,
  })
}

export function niuNewHand(prev: NiuState): NiuState {
  let deck = shuffled(freshDeck())
  if (deck.length < 12) deck = shuffled(freshDeck())
  const player = Array.from({ length: 5 }, () => deck.pop()!)
  const dealer = Array.from({ length: 5 }, () => deck.pop()!)
  return {
    deck,
    player,
    dealer,
    status: "betting",
    result: null,
    playerNiu: 0,
    dealerNiu: 0,
    wins: prev.wins,
    losses: prev.losses,
    hands: prev.hands + 1,
  }
}

export function niuReveal(state: NiuState): NiuState {
  if (state.status !== "betting") return state
  const playerNiu = niuScore(state.player)
  const dealerNiu = niuScore(state.dealer)
  const result: NiuState["result"] = playerNiu === dealerNiu ? "tie" : playerNiu > dealerNiu ? "win" : "loss"
  return {
    ...state,
    status: "over",
    result,
    playerNiu,
    dealerNiu,
    wins: state.wins + (result === "win" ? 1 : 0),
    losses: state.losses + (result === "loss" ? 1 : 0),
  }
}
