// 德州撲克（單挑簡化版）：玩家 vs AI，翻前決定跟注或棄牌，跟注後自動開牌比大小。
import { type Card, freshDeck, shuffled, bestOf7 } from "./cards"

export interface THState {
  playerHole: Card[]
  aiHole: Card[]
  community: Card[]
  deck: Card[]
  ante: number
  pot: number
  playerChips: number
  aiChips: number
  hands: number
  wins: number
  losses: number
  status: "betting" | "showdown"
  winner: 0 | 1 | 2 | null // 0 = tie
  playerHandName: string | null
  aiHandName: string | null
  aiHoleRevealed: boolean
}

const ANTE = 20

export function thInitial(): THState {
  return thNewHand({
    playerHole: [],
    aiHole: [],
    community: [],
    deck: [],
    ante: ANTE,
    pot: 0,
    playerChips: 1000,
    aiChips: 1000,
    hands: 0,
    wins: 0,
    losses: 0,
    status: "betting",
    winner: null,
    playerHandName: null,
    aiHandName: null,
    aiHoleRevealed: false,
  })
}

export function thNewHand(prev: THState): THState {
  const deck = shuffled(freshDeck())
  const playerHole = [deck.pop()!, deck.pop()!]
  const aiHole = [deck.pop()!, deck.pop()!]
  const community = [deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!, deck.pop()!]
  const anteEach = ANTE
  return {
    ...prev,
    playerHole,
    aiHole,
    community,
    deck,
    ante: anteEach,
    pot: anteEach * 2,
    playerChips: prev.playerChips - anteEach,
    aiChips: prev.aiChips - anteEach,
    hands: prev.hands + 1,
    status: "betting",
    winner: null,
    playerHandName: null,
    aiHandName: null,
    aiHoleRevealed: false,
  }
}

export function thFold(state: THState): THState {
  return {
    ...state,
    status: "showdown",
    winner: 2,
    aiChips: state.aiChips + state.pot,
    losses: state.losses + 1,
    aiHoleRevealed: true,
    aiHandName: null,
    playerHandName: null,
  }
}

export function thCall(state: THState): THState {
  const callAmount = state.ante
  const playerBest = bestOf7([...state.playerHole, ...state.community])
  const aiBest = bestOf7([...state.aiHole, ...state.community])
  let winner: 0 | 1 | 2
  if (playerBest.score[0] === aiBest.score[0] && compareEq(playerBest.score, aiBest.score)) winner = 0
  else winner = compareScore(playerBest.score, aiBest.score) > 0 ? 1 : 2

  const pot = state.pot + callAmount * 2
  let playerChips = state.playerChips - callAmount
  let aiChips = state.aiChips - callAmount
  if (winner === 1) playerChips += pot
  else if (winner === 2) aiChips += pot
  else {
    playerChips += pot / 2
    aiChips += pot / 2
  }

  return {
    ...state,
    pot,
    playerChips,
    aiChips,
    status: "showdown",
    winner,
    playerHandName: playerBest.name,
    aiHandName: aiBest.name,
    aiHoleRevealed: true,
    wins: winner === 1 ? state.wins + 1 : state.wins,
    losses: winner === 2 ? state.losses + 1 : state.losses,
  }
}

function compareEq(a: number[], b: number[]): boolean {
  return compareScore(a, b) === 0
}
function compareScore(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? -1
    const bv = b[i] ?? -1
    if (av !== bv) return av - bv
  }
  return 0
}
