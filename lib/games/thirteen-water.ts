// 十三水（簡化版）：玩家 vs 莊家(電腦) 各發13張牌，系統會自動幫雙方把13張牌
// 排成「頭道(3張)＋中道(5張)＋尾道(5張)」三墩最強且不犯規（頭道≤中道≤尾道）的排法，
// 三墩各自比大小，贏的墩數多者贏得這一局；三墩全贏（全垂）額外加碼。
import { type Card, freshDeck, shuffled, evaluate3, evaluate5 } from "./cards"

function cmpScore(a: number[], b: number[]): number {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const av = a[i] ?? -1
    const bv = b[i] ?? -1
    if (av !== bv) return av - bv
  }
  return 0
}

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

// 從一組牌中挑出 k 張，湊出分數最高的 5 張牌組合（用於尾道／中道）。
function bestFive(cards: Card[]): { score: number[]; combo: Card[] } {
  let best: number[] | null = null
  let bestCombo: Card[] | null = null
  for (const combo of combinations(cards, 5)) {
    const score = evaluate5(combo)
    if (!best || cmpScore(score, best) > 0) {
      best = score
      bestCombo = combo
    }
  }
  return { score: best!, combo: bestCombo! }
}

export interface ThirteenHand {
  front: Card[]
  middle: Card[]
  back: Card[]
  frontScore: number[]
  middleScore: number[]
  backScore: number[]
}

// 自動排牌：先在13張中挑出最強的5張當尾道，再從剩下8張挑出最強的5張當中道，
// 剩下3張自動當頭道。這樣尾道≥中道幾乎必然成立，能大幅避免「倒水」犯規。
export function autoArrange(cards: Card[]): ThirteenHand {
  const { combo: back } = bestFive(cards)
  const backIds = new Set(back.map((c) => c.id))
  const remaining8 = cards.filter((c) => !backIds.has(c.id))
  const { combo: middle } = bestFive(remaining8)
  const middleIds = new Set(middle.map((c) => c.id))
  const front = remaining8.filter((c) => !middleIds.has(c.id))
  return {
    front,
    middle,
    back,
    frontScore: evaluate3(front),
    middleScore: evaluate5(middle),
    backScore: evaluate5(back),
  }
}

export type SectionResult = "win" | "loss" | "tie"

export interface ThirteenState {
  player: ThirteenHand | null
  dealer: ThirteenHand | null
  status: "idle" | "over"
  sectionResults: SectionResult[] | null // [頭道, 中道, 尾道]
  sweep: "player" | "dealer" | null
  hands: number
  wins: number
  losses: number
}

export function thirteenInitial(): ThirteenState {
  return { player: null, dealer: null, status: "idle", sectionResults: null, sweep: null, hands: 0, wins: 0, losses: 0 }
}

export function thirteenNewHand(prev: ThirteenState): ThirteenState {
  let deck = shuffled(freshDeck())
  if (deck.length < 26) deck = shuffled(freshDeck())
  const playerCards = Array.from({ length: 13 }, () => deck.pop()!)
  const dealerCards = Array.from({ length: 13 }, () => deck.pop()!)
  const player = autoArrange(playerCards)
  const dealer = autoArrange(dealerCards)
  const results: SectionResult[] = [
    cmpScore(player.frontScore, dealer.frontScore) > 0 ? "win" : cmpScore(player.frontScore, dealer.frontScore) < 0 ? "loss" : "tie",
    cmpScore(player.middleScore, dealer.middleScore) > 0 ? "win" : cmpScore(player.middleScore, dealer.middleScore) < 0 ? "loss" : "tie",
    cmpScore(player.backScore, dealer.backScore) > 0 ? "win" : cmpScore(player.backScore, dealer.backScore) < 0 ? "loss" : "tie",
  ]
  const wins = results.filter((r) => r === "win").length
  const losses = results.filter((r) => r === "loss").length
  const sweep = wins === 3 ? "player" : losses === 3 ? "dealer" : null
  const net = wins - losses
  return {
    player,
    dealer,
    status: "over",
    sectionResults: results,
    sweep,
    hands: prev.hands + 1,
    wins: prev.wins + (net > 0 ? 1 : 0),
    losses: prev.losses + (net < 0 ? 1 : 0),
  }
}

// 依三墩淨勝墩數計算彩金倍數（相對於押注金額）：
// 全垂(3墩全贏) = 5倍；淨勝2墩 = 2倍；淨勝1墩 = 1.5倍；平手(淨勝0) = 退回押注(1倍)；淨輸則不退。
export function thirteenPayoutMultiplier(state: ThirteenState): number {
  if (!state.sectionResults) return 0
  if (state.sweep === "player") return 5
  const wins = state.sectionResults.filter((r) => r === "win").length
  const losses = state.sectionResults.filter((r) => r === "loss").length
  const net = wins - losses
  if (net >= 2) return 2
  if (net === 1) return 1.5
  if (net === 0) return 1
  return 0
}

export const SECTION_LABEL = ["頭道", "中道", "尾道"]
