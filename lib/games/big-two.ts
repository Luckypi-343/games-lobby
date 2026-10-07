// 大老二（簡化版）：玩家 vs 莊家(電腦) 各發13張牌，輪流出牌，
// 支援「單張」與「對子」兩種牌型，出牌需比上一手同類型的牌大，或選擇「過牌」，
// 率先把手上13張牌全部出完者獲勝。
// 大小順序（由小到大）：3 4 5 6 7 8 9 10 J Q K A 2（2最大），同點數再比花色 ♠>♥>♣>♦。
import { type Card, type Suit, freshDeck, shuffled } from "./cards"

const SUIT_RANK: Record<Suit, number> = { 0: 4, 1: 3, 3: 2, 2: 1 } // 0♠ 1♥ 2♦ 3♣

export function bigTwoRank(rank: number): number {
  // cards.ts 的 rank：2..10 為自身，11=J，12=Q，13=K，14=A。
  // 大老二排序：3(最小)…10, J, Q, K, A, 2(最大)。
  if (rank === 2) return 12
  if (rank >= 3 && rank <= 10) return rank - 3
  if (rank === 11) return 8 // J
  if (rank === 12) return 9 // Q
  if (rank === 13) return 10 // K
  if (rank === 14) return 11 // A
  return -1
}

export type ComboType = "single" | "pair"

export interface Combo {
  type: ComboType
  cards: Card[]
  rank: number
  suitRank: number
}

function makeCombo(cards: Card[]): Combo {
  const type: ComboType = cards.length === 1 ? "single" : "pair"
  const rank = bigTwoRank(cards[0].rank)
  const suitRank = Math.max(...cards.map((c) => SUIT_RANK[c.suit]))
  return { type, cards, rank, suitRank }
}

// 比較兩個同類型的牌組，回傳 >0 表示 a 比 b 大。
export function compareCombo(a: Combo, b: Combo): number {
  if (a.rank !== b.rank) return a.rank - b.rank
  return a.suitRank - b.suitRank
}

// 列出手牌中所有可行的單張／對子牌組。
export function comboOptions(hand: Card[], type: ComboType): Combo[] {
  if (type === "single") {
    return hand.map((c) => makeCombo([c])).sort((a, b) => a.rank - b.rank || a.suitRank - b.suitRank)
  }
  const byRank = new Map<number, Card[]>()
  for (const c of hand) {
    const arr = byRank.get(c.rank) ?? []
    arr.push(c)
    byRank.set(c.rank, arr)
  }
  const out: Combo[] = []
  for (const cards of byRank.values()) {
    if (cards.length >= 2) out.push(makeCombo(cards.slice(0, 2)))
  }
  return out.sort((a, b) => a.rank - b.rank || a.suitRank - b.suitRank)
}

export function findLowestSingle(hand: Card[]): Combo {
  return comboOptions(hand, "single")[0]
}

// 找出手牌中能打贏 mustBeat 的最小同類型牌組；找不到則回傳 null（代表只能過牌）。
export function findBeatingCombo(hand: Card[], mustBeat: Combo): Combo | null {
  const candidates = comboOptions(hand, mustBeat.type).filter((c) => compareCombo(c, mustBeat) > 0)
  return candidates[0] ?? null
}

export function hasCard3Spade(hand: Card[]): boolean {
  return hand.some((c) => c.suit === 0 && c.rank === 3)
}

export type Turn = "player" | "dealer"

export interface BigTwoState {
  playerHand: Card[]
  dealerHand: Card[]
  turn: Turn
  lastPlay: { by: Turn; combo: Combo } | null
  passStreak: number
  status: "playing" | "over"
  winner: Turn | null
  playerLastPlayed: Card[]
  dealerLastPlayed: Card[]
  history: string[]
}

export function bigTwoInitial(): BigTwoState {
  return dealBigTwoHand()
}

export function dealBigTwoHand(): BigTwoState {
  let deck = shuffled(freshDeck())
  if (deck.length < 26) deck = shuffled(freshDeck())
  const playerHand = Array.from({ length: 13 }, () => deck.pop()!)
  const dealerHand = Array.from({ length: 13 }, () => deck.pop()!)
  const turn: Turn = hasCard3Spade(playerHand) ? "player" : "dealer"
  return {
    playerHand: sortHand(playerHand),
    dealerHand: sortHand(dealerHand),
    turn,
    lastPlay: null,
    passStreak: 0,
    status: "playing",
    winner: null,
    playerLastPlayed: [],
    dealerLastPlayed: [],
    history: [turn === "player" ? "玩家持有 3♠，玩家先出牌" : "莊家持有 3♠，莊家先出牌"],
  }
}

export function sortHand(hand: Card[]): Card[] {
  return [...hand].sort((a, b) => bigTwoRank(a.rank) - bigTwoRank(b.rank) || SUIT_RANK[a.suit] - SUIT_RANK[b.suit])
}

// 玩家出牌（selected 為玩家點選的牌，必須是1張或同點數2張）。
export function playerPlay(state: BigTwoState, selected: Card[]): BigTwoState {
  if (state.status !== "playing" || state.turn !== "player") return state
  if (selected.length !== 1 && selected.length !== 2) return state
  if (selected.length === 2 && selected[0].rank !== selected[1].rank) return state
  const combo = makeCombo(selected)
  if (state.lastPlay && state.lastPlay.by !== "player") {
    if (combo.type !== state.lastPlay.combo.type) return state
    if (compareCombo(combo, state.lastPlay.combo) <= 0) return state
  }
  const ids = new Set(selected.map((c) => c.id))
  const nextHand = state.playerHand.filter((c) => !ids.has(c.id))
  const history = [...state.history, `玩家出：${describeCombo(combo)}`]
  if (nextHand.length === 0) {
    return { ...state, playerHand: nextHand, playerLastPlayed: selected, lastPlay: { by: "player", combo }, status: "over", winner: "player", history: [...history, "玩家出完所有牌，獲勝！"] }
  }
  return advanceAfterPlay({ ...state, playerHand: nextHand, playerLastPlayed: selected, dealerLastPlayed: [], lastPlay: { by: "player", combo }, passStreak: 0, turn: "dealer", history })
}

export function playerPass(state: BigTwoState): BigTwoState {
  if (state.status !== "playing" || state.turn !== "player") return state
  if (!state.lastPlay || state.lastPlay.by === "player") return state // 沒人出牌不能過
  const history = [...state.history, "玩家過牌"]
  return advanceAfterPass({ ...state, passStreak: state.passStreak + 1, turn: "dealer", history })
}

function advanceAfterPlay(state: BigTwoState): BigTwoState {
  if (state.turn === "dealer") return runDealerTurn(state)
  return state
}

function advanceAfterPass(state: BigTwoState): BigTwoState {
  if (state.turn === "dealer") return runDealerTurn(state)
  return state
}

function describeCombo(combo: Combo): string {
  const labels = combo.cards.map((c) => `${["♠", "♥", "♦", "♣"][c.suit]}${["", "", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"][c.rank]}`)
  return labels.join("、")
}

// 電腦回合：若需壓牌則找最小能贏的組合，找不到就過牌；若是自由開局則出手上最小單張。
function runDealerTurn(state: BigTwoState): BigTwoState {
  let history = state.history
  if (!state.lastPlay || state.lastPlay.by === "dealer") {
    // 自由開局（對手已過牌，或整局剛開始由莊家先出）
    const combo = findLowestSingle(state.dealerHand)
    const ids = new Set(combo.cards.map((c) => c.id))
    const nextHand = state.dealerHand.filter((c) => !ids.has(c.id))
    history = [...history, `莊家出：${describeCombo(combo)}`]
    if (nextHand.length === 0) {
      return { ...state, dealerHand: nextHand, dealerLastPlayed: combo.cards, lastPlay: { by: "dealer", combo }, status: "over", winner: "dealer", history: [...history, "莊家出完所有牌，莊家獲勝"] }
    }
    return { ...state, dealerHand: nextHand, dealerLastPlayed: combo.cards, playerLastPlayed: [], lastPlay: { by: "dealer", combo }, passStreak: 0, turn: "player", history }
  }
  const beating = findBeatingCombo(state.dealerHand, state.lastPlay.combo)
  if (!beating) {
    history = [...history, "莊家過牌"]
    // 雙方都過牌一次後（passStreak 已含玩家那次），由上一個出牌者重新自由開局
    return { ...state, passStreak: state.passStreak + 1, turn: "player", history, lastPlay: state.lastPlay }
  }
  const ids = new Set(beating.cards.map((c) => c.id))
  const nextHand = state.dealerHand.filter((c) => !ids.has(c.id))
  history = [...history, `莊家出：${describeCombo(beating)}`]
  if (nextHand.length === 0) {
    return { ...state, dealerHand: nextHand, dealerLastPlayed: beating.cards, lastPlay: { by: "dealer", combo: beating }, status: "over", winner: "dealer", history: [...history, "莊家出完所有牌，莊家獲勝"] }
  }
  return { ...state, dealerHand: nextHand, dealerLastPlayed: beating.cards, lastPlay: { by: "dealer", combo: beating }, passStreak: 0, turn: "player", history }
}

// 若整局一開始就輪到莊家先出（莊家持有3♠），需要主動觸發一次莊家回合。
export function kickoffIfDealerStarts(state: BigTwoState): BigTwoState {
  if (state.turn === "dealer" && state.status === "playing" && !state.lastPlay) {
    return runDealerTurn(state)
  }
  return state
}
