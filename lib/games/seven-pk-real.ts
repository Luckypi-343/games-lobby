// 7PK（正式版）：四階段漸進發牌的比牌型機台（含2張鬼牌，共54張）。
// 第一次發3張(1、3翻開，2蓋)，第二次發2張(4蓋，5翻開)，第三次發1張(6翻開)，
// 最後發第7張並翻開2、4，用最好的7張湊出最強5張比對賠率表。
// 每一階段玩家可選擇「放棄」（認輸，賠掉目前總押注）、「跟注」（維持押注進入下一階段）
// 或「加倍」（把目前總押注翻倍再進入下一階段）。
import { type Card, evaluatePk, freshPkDeck, shuffledCards, type PkCategory } from "./seven-pk"

export { PK_CATEGORY_LABEL } from "./seven-pk"

// 依牌型強弱排序（由強到弱），用於從7張牌中挑出最好的5張。
export const SEVEN_PK_STRENGTH_ORDER: PkCategory[] = [
  "five_kind",
  "royal_flush",
  "straight_flush",
  "four_kind",
  "four_kind_joker",
  "full_house",
  "flush",
  "straight",
  "three_kind",
  "two_pair_big",
  "none",
]

// 正式版7PK賠率表（由創辦人指定，同花大順與副鐵支倍率與5PK不同）。
export const SEVEN_PK_PAYOUT: Record<PkCategory, number> = {
  five_kind: 200,
  royal_flush: 150,
  straight_flush: 120,
  four_kind: 50,
  four_kind_joker: 30,
  full_house: 7,
  flush: 5,
  straight: 3,
  three_kind: 2,
  two_pair_big: 1,
  none: 0,
}

export const SEVEN_PK_PAYOUT_TABLE: { label: string; multiplier: number }[] = [
  { label: "五條(4同點+1鬼牌)", multiplier: 200 },
  { label: "同花大順", multiplier: 150 },
  { label: "同花順", multiplier: 120 },
  { label: "正鐵支", multiplier: 50 },
  { label: "副鐵支(3同點+1鬼牌)", multiplier: 30 },
  { label: "葫蘆", multiplier: 7 },
  { label: "同花", multiplier: 5 },
  { label: "順子", multiplier: 3 },
  { label: "三條", multiplier: 2 },
  { label: "大兩對(其中一組J以上)", multiplier: 1 },
]

function combinations5of7(cards: Card[]): Card[][] {
  const out: Card[][] = []
  const n = cards.length
  for (let a = 0; a < n; a++)
    for (let b = a + 1; b < n; b++)
      for (let c = b + 1; c < n; c++)
        for (let d = c + 1; d < n; d++)
          for (let e = d + 1; e < n; e++) out.push([cards[a], cards[b], cards[c], cards[d], cards[e]])
  return out
}

export function bestOfSeven(cards: Card[]): PkCategory {
  if (cards.length < 5) return "none"
  let best: PkCategory = "none"
  let bestRank = SEVEN_PK_STRENGTH_ORDER.length - 1
  for (const combo of combinations5of7(cards)) {
    const category = evaluatePk(combo)
    const rank = SEVEN_PK_STRENGTH_ORDER.indexOf(category)
    if (rank >= 0 && rank < bestRank) {
      bestRank = rank
      best = category
    }
  }
  return best
}

export type SevenPkStage = "idle" | "stage1" | "stage2" | "stage3" | "result"
export type SevenPkAction = "call" | "double"

export interface SevenPkState {
  deck: Card[]
  hand: Card[]
  concealed: boolean[]
  stage: SevenPkStage
  totalUnits: number
  folded: boolean
  category: PkCategory
  hands: number
  wins: number
}

export function sevenPkInitial(): SevenPkState {
  return {
    deck: [],
    hand: [],
    concealed: [],
    stage: "idle",
    totalUnits: 1,
    folded: false,
    category: "none",
    hands: 0,
    wins: 0,
  }
}

export function sevenPkDeal(prev: SevenPkState): SevenPkState {
  let deck = shuffledCards(freshPkDeck())
  if (deck.length < 10) deck = shuffledCards(freshPkDeck())
  const hand = [deck.pop()!, deck.pop()!, deck.pop()!]
  return {
    deck,
    hand,
    concealed: [false, true, false],
    stage: "stage1",
    totalUnits: 1,
    folded: false,
    category: "none",
    hands: prev.hands,
    wins: prev.wins,
  }
}

export function sevenPkAdvance(state: SevenPkState, action: SevenPkAction): SevenPkState {
  if (state.stage === "idle" || state.stage === "result") return state
  const deck = [...state.deck]
  const hand = [...state.hand]
  const concealed = [...state.concealed]
  const totalUnits = action === "double" ? state.totalUnits * 2 : state.totalUnits

  if (state.stage === "stage1") {
    hand.push(deck.pop()!, deck.pop()!)
    concealed.push(true, false)
    return { ...state, deck, hand, concealed, totalUnits, stage: "stage2" }
  }
  if (state.stage === "stage2") {
    hand.push(deck.pop()!)
    concealed.push(false)
    return { ...state, deck, hand, concealed, totalUnits, stage: "stage3" }
  }
  // stage3 -> 最後一階段：發第7張，翻開先前蓋著的第2、4張，結算牌型
  hand.push(deck.pop()!)
  concealed.push(false)
  concealed[1] = false
  concealed[3] = false
  const category = bestOfSeven(hand)
  return {
    ...state,
    deck,
    hand,
    concealed,
    totalUnits,
    stage: "result",
    category,
    hands: state.hands + 1,
    wins: state.wins + (category !== "none" ? 1 : 0),
  }
}

export function sevenPkFold(state: SevenPkState): SevenPkState {
  if (state.stage === "idle" || state.stage === "result") return state
  return {
    ...state,
    concealed: state.concealed.map(() => false),
    stage: "result",
    folded: true,
    category: "none",
    hands: state.hands + 1,
  }
}
