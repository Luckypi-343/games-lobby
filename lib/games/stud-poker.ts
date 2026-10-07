// 梭哈：玩家 vs 莊家(電腦)，採用傳統「蓋一張、開四張」漸進式發牌與喊注流程。
// 每人先發2張（第1張蓋牌、第2張開牌），之後第3~5張都開牌發出，每次發牌後由目前「牌面較大」的一方
// 優先喊牌（過牌／加注，第一輪另外可選棄牌），另一方再依規則跟進或棄牌。發滿5張（4明1暗）後，
// 雙方點按「開牌」才會翻出各自那張蓋牌，用完整5張牌比大小決定勝負。
import { type Card, freshDeck, shuffled, evaluate5, compareScores, HAND_NAME } from "./cards"

export type Side = "player" | "dealer"

// 牌面只開了 1~4 張時的簡化比大小（不計順子／同花，只看對子／三條／四條與高牌，
// 足以判斷「發牌當下誰的明牌比較大」，決定喊牌優先權）。
function scoreOpen(cards: Card[]): number[] {
  if (cards.length === 0) return [0]
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a)
  const counts = new Map<number, number>()
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1)
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0])
  const pattern = groups.map((g) => g[1])
  if (pattern[0] === 4) return [7, groups[0][0]]
  if (pattern[0] === 3 && pattern[1] === 2) return [6, groups[0][0], groups[1][0]]
  if (pattern[0] === 3) return [3, groups[0][0], ...groups.slice(1).map((g) => g[0])]
  if (pattern[0] === 2 && pattern[1] === 2) return [2, groups[0][0], groups[1][0], groups[2]?.[0] ?? 0]
  if (pattern[0] === 2) return [1, groups[0][0], ...groups.slice(1).map((g) => g[0])]
  return [0, ...ranks]
}

function topCard(cards: Card[]): Card {
  return [...cards].sort((a, b) => b.rank - a.rank || a.suit - b.suit)[0]
}

function determineBig(playerOpen: Card[], dealerOpen: Card[]): Side {
  const cmp = compareScores(scoreOpen(playerOpen), scoreOpen(dealerOpen))
  if (cmp > 0) return "player"
  if (cmp < 0) return "dealer"
  const pTop = topCard(playerOpen)
  const dTop = topCard(dealerOpen)
  if (pTop.rank !== dTop.rank) return pTop.rank > dTop.rank ? "player" : "dealer"
  return pTop.suit <= dTop.suit ? "player" : "dealer" // 花色同階時：黑桃>紅心>方塊>梅花
}

function openCardsOf(cards: Card[]): Card[] {
  return cards.slice(1) // 第1張(index 0)固定是蓋牌，其餘都是明牌
}

// 街道是否允許「大者過牌後，小者也能主動選擇過牌或加注(詐唬)」：
// 第1輪(剛發2張)與最後一輪(發滿5張)才有這個完整喊注流程；第2、3輪簡化成「大者有權喊牌，小者只能跟進」。
function allowSmallInitiative(street: 1 | 2 | 3 | 4): boolean {
  return street === 1 || street === 4
}

export type StudStage =
  | "act-open" // 目前行動方(大)可選 過牌／加注(／第一輪可棄牌)
  | "act-after-check" // 大者過牌後，換小者可選 過牌／加注
  | "act-call" // 面對對方加注，需選 跟牌／棄牌
  | "showdown-ready" // 已發滿5張且喊注結束，等待玩家按「開牌」
  | "over"

export interface StudState {
  ante: number
  pot: number
  playerContrib: number
  deck: Card[]
  player: Card[]
  dealer: Card[]
  street: 1 | 2 | 3 | 4
  stage: StudStage
  actor: Side
  bigSide: Side
  canFold: boolean
  pendingBettor: Side | null
  pendingAmount: number
  result: "win" | "loss" | "tie" | null
  resultReason: string | null
  playerHandName: string | null
  dealerHandName: string | null
  hands: number
  wins: number
  losses: number
}

export const RAISE_STEPS = 5 // 加注可選 1~5 倍底注

function openStageFrom(player: Card[], dealer: Card[], street: 1 | 2 | 3 | 4): { bigSide: Side; actor: Side } {
  const bigSide = determineBig(openCardsOf(player), openCardsOf(dealer))
  return { bigSide, actor: bigSide }
}

export function studInitial(): StudState {
  return {
    ante: 100,
    pot: 0,
    playerContrib: 0,
    deck: [],
    player: [],
    dealer: [],
    street: 1,
    stage: "over",
    actor: "player",
    bigSide: "player",
    canFold: false,
    pendingBettor: null,
    pendingAmount: 0,
    result: null,
    resultReason: null,
    playerHandName: null,
    dealerHandName: null,
    hands: 0,
    wins: 0,
    losses: 0,
  }
}

export function studDeal(prev: StudState, ante: number): StudState {
  let deck = shuffled(freshDeck())
  if (deck.length < 10) deck = shuffled(freshDeck())
  const player = [deck.pop()!, deck.pop()!]
  const dealer = [deck.pop()!, deck.pop()!]
  const { bigSide, actor } = openStageFrom(player, dealer, 1)
  return {
    ante,
    pot: ante * 2,
    playerContrib: ante,
    deck,
    player,
    dealer,
    street: 1,
    stage: "act-open",
    actor,
    bigSide,
    canFold: true,
    pendingBettor: null,
    pendingAmount: 0,
    result: null,
    resultReason: null,
    playerHandName: null,
    dealerHandName: null,
    hands: prev.hands,
    wins: prev.wins,
    losses: prev.losses,
  }
}

function otherSide(s: Side): Side {
  return s === "player" ? "dealer" : "player"
}

function finishByFold(state: StudState, folder: Side): StudState {
  const winner = otherSide(folder)
  return {
    ...state,
    stage: "over",
    result: winner === "player" ? "win" : "loss",
    resultReason: winner === "player" ? "莊家棄牌，您獲勝" : "您已棄牌，莊家獲勝",
    hands: state.hands + 1,
    wins: state.wins + (winner === "player" ? 1 : 0),
    losses: state.losses + (winner === "dealer" ? 1 : 0),
  }
}

function advanceRound(state: StudState): StudState {
  if (state.street < 4) {
    let deck = state.deck
    if (deck.length < 2) deck = shuffled(freshDeck())
    const player = [...state.player, deck.pop()!]
    const dealer = [...state.dealer, deck.pop()!]
    const nextStreet = (state.street + 1) as 1 | 2 | 3 | 4
    const { bigSide, actor } = openStageFrom(player, dealer, nextStreet)
    return {
      ...state,
      deck,
      player,
      dealer,
      street: nextStreet,
      stage: "act-open",
      actor,
      bigSide,
      canFold: false,
      pendingBettor: null,
      pendingAmount: 0,
    }
  }
  return { ...state, stage: "showdown-ready" }
}

// 大者在「act-open」階段的決定：過牌／加注／(僅第一輪可)棄牌。
export function studBigOpen(state: StudState, action: "check" | "bet" | "fold", betAmount?: number): StudState {
  if (state.stage !== "act-open") return state
  const big = state.actor
  if (action === "fold") {
    if (!state.canFold) return state
    return finishByFold(state, big)
  }
  if (action === "check") {
    if (allowSmallInitiative(state.street)) {
      return { ...state, actor: otherSide(big), stage: "act-after-check" }
    }
    return advanceRound(state)
  }
  // action === "bet"
  const amount = Math.max(state.ante, Math.min(betAmount ?? state.ante, state.ante * RAISE_STEPS))
  return {
    ...state,
    pot: state.pot + amount,
    playerContrib: state.playerContrib + (big === "player" ? amount : 0),
    actor: otherSide(big),
    stage: "act-call",
    pendingBettor: big,
    pendingAmount: amount,
  }
}

// 大者過牌後，小者在「act-after-check」階段的決定：過牌／加注(詐唬性加注)。
export function studAfterCheck(state: StudState, action: "check" | "bet", betAmount?: number): StudState {
  if (state.stage !== "act-after-check") return state
  const small = state.actor
  if (action === "check") {
    return advanceRound(state)
  }
  const amount = Math.max(state.ante, Math.min(betAmount ?? state.ante, state.ante * RAISE_STEPS))
  return {
    ...state,
    pot: state.pot + amount,
    playerContrib: state.playerContrib + (small === "player" ? amount : 0),
    actor: otherSide(small),
    stage: "act-call",
    pendingBettor: small,
    pendingAmount: amount,
  }
}

// 面對加注的一方，在「act-call」階段的決定：跟牌／棄牌。不可再加注(避免無限豪賭)。
export function studRespondToBet(state: StudState, action: "call" | "fold"): StudState {
  if (state.stage !== "act-call") return state
  const responder = state.actor
  if (action === "fold") {
    return finishByFold(state, responder)
  }
  return advanceRound({
    ...state,
    pot: state.pot + state.pendingAmount,
    playerContrib: state.playerContrib + (responder === "player" ? state.pendingAmount : 0),
    pendingBettor: null,
    pendingAmount: 0,
  })
}

// 發滿5張(4明1暗)、喊注結束後，雙方翻開底牌比大小。
export function studReveal(state: StudState): StudState {
  if (state.stage !== "showdown-ready") return state
  const ps = evaluate5(state.player)
  const ds = evaluate5(state.dealer)
  const cmp = compareScores(ps, ds)
  const result: StudState["result"] = cmp === 0 ? "tie" : cmp > 0 ? "win" : "loss"
  return {
    ...state,
    stage: "over",
    result,
    resultReason: result === "win" ? "比牌獲勝！" : result === "loss" ? "莊家比牌獲勝" : "牌型相同，平手退回",
    playerHandName: HAND_NAME[ps[0]],
    dealerHandName: HAND_NAME[ds[0]],
    hands: state.hands + 1,
    wins: state.wins + (result === "win" ? 1 : 0),
    losses: state.losses + (result === "loss" ? 1 : 0),
  }
}

// ---- 電腦(莊家)AI：依目前手牌強度(含自己尚未亮出的蓋牌)做出決策，並帶一點隨機詐唬 ----
function dealerStrength(state: StudState): number {
  if (state.dealer.length >= 5) {
    const s = evaluate5(state.dealer)
    return s[0] * 1000 + (s[1] ?? 0) * 10 + (s[2] ?? 0)
  }
  const s = scoreOpen(state.dealer)
  return s[0] * 100 + (s[1] ?? 0)
}

export function dealerDecideOpen(state: StudState): { action: "check" | "bet" | "fold"; amount: number } {
  const strength = dealerStrength(state)
  const r = Math.random()
  const amount = state.ante
  if (strength >= 300) return { action: "bet", amount: Math.min(state.ante * 3, state.ante * RAISE_STEPS) }
  if (strength >= 50) return { action: r < 0.55 ? "bet" : "check", amount }
  if (state.canFold && r < 0.1) return { action: "fold", amount: 0 }
  return { action: r < 0.18 ? "bet" : "check", amount }
}

export function dealerDecideAfterCheck(state: StudState): { action: "check" | "bet"; amount: number } {
  const strength = dealerStrength(state)
  const r = Math.random()
  if (strength >= 200) return { action: "bet", amount: Math.min(state.ante * 2, state.ante * RAISE_STEPS) }
  return { action: r < 0.15 ? "bet" : "check", amount: state.ante }
}

export function dealerDecideCall(state: StudState): "call" | "fold" {
  const strength = dealerStrength(state)
  const r = Math.random()
  if (strength >= 150) return "call"
  if (strength >= 30) return r < 0.5 ? "call" : "fold"
  return r < 0.15 ? "call" : "fold"
}
