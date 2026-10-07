// 撲克牌共用工具：標準 52 張牌、洗牌、以及德州撲克 / 三張牌撲克的牌型評分。
export type Suit = 0 | 1 | 2 | 3 // 0黑桃 1紅心 2方塊 3梅花
export interface Card {
  suit: Suit
  rank: number // 2..14 (14=A)
  id: string
  joker?: boolean // 鬼牌（萬能牌），為 true 時忽略 suit/rank，畫面另外渲染
}

export const SUIT_SYMBOL = ["♠", "♥", "♦", "♣"]
export const RANK_LABEL: Record<number, string> = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
}

export function isRedSuit(suit: Suit): boolean {
  return suit === 1 || suit === 2
}

export function freshDeck(): Card[] {
  const cards: Card[] = []
  for (let s = 0; s < 4; s++) {
    for (let r = 2; r <= 14; r++) {
      cards.push({ suit: s as Suit, rank: r, id: `${s}-${r}` })
    }
  }
  return cards
}

export function shuffled<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// ---- 5 張牌牌型評分（用於德州撲克從 7 張選最佳 5 張）----
// 回傳分數陣列，字典順序比較：[category, tiebreak1, tiebreak2, ...]，數字越大越強。
export const HAND_NAME = ["高牌", "一對", "兩對", "三條", "順子", "同花", "葫蘆", "四條", "同花順"]

function combinations<T>(arr: T[], k: number): T[][] {
  const out: T[][] = []
  function go(start: number, chosen: T[]) {
    if (chosen.length === k) {
      out.push([...chosen])
      return
    }
    for (let i = start; i < arr.length; i++) {
      chosen.push(arr[i])
      go(i + 1, chosen)
      chosen.pop()
    }
  }
  go(0, [])
  return out
}

export function evaluate5(cards: Card[]): number[] {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a)
  const counts = new Map<number, number>()
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1)
  const groups = [...counts.entries()].sort((a, b) => (b[1] - a[1]) || (b[0] - a[0]))
  const isFlush = cards.every((c) => c.suit === cards[0].suit)
  const uniqueRanks = [...new Set(ranks)]
  let straightHigh = 0
  if (uniqueRanks.length === 5) {
    if (uniqueRanks[0] - uniqueRanks[4] === 4) straightHigh = uniqueRanks[0]
    else if (uniqueRanks[0] === 14 && uniqueRanks[1] === 5 && uniqueRanks[4] === 2) straightHigh = 5 // A-2-3-4-5
  }
  const pattern = groups.map((g) => g[1])

  if (straightHigh && isFlush) return [8, straightHigh]
  if (pattern[0] === 4) return [7, groups[0][0], groups[1][0]]
  if (pattern[0] === 3 && pattern[1] === 2) return [6, groups[0][0], groups[1][0]]
  if (isFlush) return [5, ...ranks]
  if (straightHigh) return [4, straightHigh]
  if (pattern[0] === 3) return [3, groups[0][0], ...groups.slice(1).map((g) => g[0])]
  if (pattern[0] === 2 && pattern[1] === 2) return [2, groups[0][0], groups[1][0], groups[2][0]]
  if (pattern[0] === 2) return [1, groups[0][0], ...groups.slice(1).map((g) => g[0])]
  return [0, ...ranks]
}

function cmpScore(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? -1
    const bv = b[i] ?? -1
    if (av !== bv) return av - bv
  }
  return 0
}

// 從 7 張牌中找出最佳 5 張組合的分數與名稱。
export function bestOf7(cards: Card[]): { score: number[]; name: string } {
  let best: number[] | null = null
  for (const combo of combinations(cards, 5)) {
    const score = evaluate5(combo)
    if (!best || cmpScore(score, best) > 0) best = score
  }
  return { score: best!, name: HAND_NAME[best![0]] }
}

export function compareScores(a: number[], b: number[]): number {
  return cmpScore(a, b)
}

// ---- 三張牌撲克評分（無葫蘆／四條，僅：同花順 > 三條 > 順子 > 同花 > 對子 > 高牌）----
export const THREE_CARD_HAND_NAME = ["高牌", "對子", "同花", "順子", "三條", "同花順"]

export function evaluate3(cards: Card[]): number[] {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a)
  const isFlush = cards.every((c) => c.suit === cards[0].suit)
  const isTrips = ranks[0] === ranks[1] && ranks[1] === ranks[2]
  const uniqueRanks = [...new Set(ranks)]
  let straightHigh = 0
  if (uniqueRanks.length === 3) {
    if (uniqueRanks[0] - uniqueRanks[2] === 2) straightHigh = uniqueRanks[0]
    else if (uniqueRanks[0] === 14 && uniqueRanks[1] === 3 && uniqueRanks[2] === 2) straightHigh = 3 // A-2-3
  }
  if (isTrips) return [4, ranks[0]]
  if (straightHigh && isFlush) return [5, straightHigh]
  if (straightHigh) return [3, straightHigh]
  if (isFlush) return [2, ...ranks]
  if (ranks[0] === ranks[1] || ranks[1] === ranks[2]) {
    const pairRank = ranks[0] === ranks[1] ? ranks[0] : ranks[1]
    const kicker = ranks[0] === ranks[1] ? ranks[2] : ranks[0]
    return [1, pairRank, kicker]
  }
  return [0, ...ranks]
}

export function threeCardHandName(cards: Card[]): string {
  const score = evaluate3(cards)
  return THREE_CARD_HAND_NAME[score[0]]
}
