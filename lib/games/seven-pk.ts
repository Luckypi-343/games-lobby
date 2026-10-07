// 7PK：換牌式撲克機台（含2張鬼牌）。玩家先發5張牌，可選擇保留的牌，其餘換牌一次，
// 結算牌型比對賠率表；中獎後可選擇「比倍」把獎金押大/小或紅/黑，猜對翻倍、猜錯歸零。
import { type Card, type Suit, isRedSuit } from "./cards"

export type PkCategory =
  | "five_kind" // 五條：4張同點數+1張鬼牌
  | "royal_flush" // 同花大順：同花色 A K Q J 10
  | "straight_flush" // 同花順
  | "four_kind" // 正鐵支：4張同點數（不含鬼牌）
  | "four_kind_joker" // 副鐵支：3張同點數+1張鬼牌
  | "full_house" // 葫蘆
  | "flush" // 同花
  | "straight" // 順子
  | "three_kind" // 三條
  | "two_pair_big" // 大兩對（其中一組為J以上）
  | "none" // 未中獎

export const PK_PAYOUT: Record<PkCategory, number> = {
  five_kind: 200,
  royal_flush: 500,
  straight_flush: 120,
  four_kind: 50,
  four_kind_joker: 50,
  full_house: 7,
  flush: 5,
  straight: 3,
  three_kind: 2,
  two_pair_big: 1,
  none: 0,
}

export const PK_CATEGORY_LABEL: Record<PkCategory, string> = {
  five_kind: "五條",
  royal_flush: "同花大順",
  straight_flush: "同花順",
  four_kind: "正鐵支",
  four_kind_joker: "副鐵支",
  full_house: "葫蘆",
  flush: "同花",
  straight: "順子",
  three_kind: "三條",
  two_pair_big: "大兩對",
  none: "未中獎",
}

// 賠率說明（供規則彈窗顯示）：由創辦人指定。
export const PK_PAYOUT_TABLE: { label: string; multiplier: number }[] = [
  { label: "同花大順", multiplier: 500 },
  { label: "五條", multiplier: 200 },
  { label: "同花順", multiplier: 120 },
  { label: "正鐵支／副鐵支", multiplier: 50 },
  { label: "葫蘆", multiplier: 7 },
  { label: "同花", multiplier: 5 },
  { label: "順子", multiplier: 3 },
  { label: "三條", multiplier: 2 },
  { label: "大兩對（含J以上）", multiplier: 1 },
]

export function freshPkDeck(): Card[] {
  const cards: Card[] = []
  for (let s = 0; s < 4; s++) {
    for (let r = 2; r <= 14; r++) {
      cards.push({ suit: s as Suit, rank: r, id: `${s}-${r}` })
    }
  }
  cards.push({ suit: 0, rank: 0, id: "joker-1", joker: true })
  cards.push({ suit: 0, rank: 0, id: "joker-2", joker: true })
  return cards
}

export function shuffledCards<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// 評分：鬼牌只用來「補強最大同點數組」（五條／鐵支／三條），不參與同花或順子的湊成。
export function evaluatePk(cards: Card[]): PkCategory {
  const jokers = cards.filter((c) => c.joker)
  const real = cards.filter((c) => !c.joker)
  const jokerCount = jokers.length

  const counts = new Map<number, number>()
  for (const c of real) counts.set(c.rank, (counts.get(c.rank) ?? 0) + 1)
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1])
  const bestGroupSize = groups[0]?.[1] ?? 0
  const effective = bestGroupSize + jokerCount

  if (jokerCount === 0 && real.length === 5) {
    const ranks = real.map((c) => c.rank).sort((a, b) => b - a)
    const isFlush = real.every((c) => c.suit === real[0].suit)
    const uniqueRanks = [...new Set(ranks)]
    let straightHigh = 0
    if (uniqueRanks.length === 5) {
      if (uniqueRanks[0] - uniqueRanks[4] === 4) straightHigh = uniqueRanks[0]
      else if (uniqueRanks[0] === 14 && uniqueRanks[1] === 5 && uniqueRanks[4] === 2) straightHigh = 5
    }
    const isRoyal = isFlush && new Set(ranks).size === 5 && ranks[0] === 14 && ranks[4] === 10 && straightHigh === 14

    if (isRoyal) return "royal_flush"
    if (isFlush && straightHigh) return "straight_flush"
    if (bestGroupSize === 4) return "four_kind"
    if (bestGroupSize === 3 && groups[1]?.[1] === 2) return "full_house"
    if (isFlush) return "flush"
    if (straightHigh) return "straight"
    if (bestGroupSize === 3) return "three_kind"
    if (bestGroupSize === 2 && groups[1]?.[1] === 2) {
      const highPair = Math.max(groups[0][0], groups[1][0])
      if (highPair >= 11) return "two_pair_big"
      return "none"
    }
    return "none"
  }

  // 有鬼牌：只走鬼牌能補強的分類。
  if (effective >= 5) return "five_kind"
  if (effective === 4) return bestGroupSize === 3 ? "four_kind_joker" : "four_kind"
  if (effective === 3) return "three_kind"
  return "none"
}

export interface PkState {
  deck: Card[]
  hand: Card[]
  held: boolean[]
  phase: "idle" | "dealt" | "result"
  category: PkCategory
  hands: number
  wins: number
}

export function pkInitial(): PkState {
  return {
    deck: [],
    hand: [],
    held: [false, false, false, false, false],
    phase: "idle",
    category: "none",
    hands: 0,
    wins: 0,
  }
}

export function pkDeal(prev: PkState): PkState {
  let deck = shuffledCards(freshPkDeck())
  if (deck.length < 10) deck = shuffledCards(freshPkDeck())
  const hand = Array.from({ length: 5 }, () => deck.pop()!)
  return {
    deck,
    hand,
    held: [false, false, false, false, false],
    phase: "dealt",
    category: "none",
    hands: prev.hands,
    wins: prev.wins,
  }
}

export function pkToggleHold(state: PkState, index: number): PkState {
  if (state.phase !== "dealt") return state
  const held = [...state.held]
  held[index] = !held[index]
  return { ...state, held }
}

export function pkDraw(state: PkState): PkState {
  if (state.phase !== "dealt") return state
  const deck = [...state.deck]
  const hand = state.hand.map((c, i) => (state.held[i] ? c : deck.pop()!))
  const category = evaluatePk(hand)
  return {
    ...state,
    deck,
    hand,
    phase: "result",
    category,
    hands: state.hands + 1,
    wins: state.wins + (category !== "none" ? 1 : 0),
  }
}

// ---- 比倍（Double Up）----
export type BigSmallChoice = "big" | "small"
export type ColorChoice = "red" | "black"

function drawPlainCard(): Card {
  const deck = shuffledCards(freshPkDeck()).filter((c) => !c.joker)
  return deck[0]
}

export function drawBigSmallCard(): Card {
  return drawPlainCard()
}

// 轮回1~13比大小(A算1)，剛好7為中間值，開出7時視為平手(需重抽，不消耗這一輪)。
export function resolveBigSmall(card: Card, choice: BigSmallChoice): "win" | "lose" | "tie" {
  const r13 = card.rank === 14 ? 1 : card.rank
  if (r13 === 7) return "tie"
  const big = r13 > 7
  return (choice === "big") === big ? "win" : "lose"
}

export function resolveColor(card: Card, choice: ColorChoice): "win" | "lose" {
  const red = isRedSuit(card.suit)
  return (choice === "red") === red ? "win" : "lose"
}
