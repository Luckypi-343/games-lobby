// 鬥地主（三人單副標準版）：54張牌（含大小鬼）發完後，先進行「叫地主」階段——
// 隨機決定首叫者，三人依序叫 1 分／2 分／3 分／不叫，叫分須高於前面叫出的分數，
// 喊出 3 分立即結束叫牌；若三人均不叫則重新洗牌發牌。叫到最高分者成為地主，
// 收取 3 張底牌（共 20 張手牌），其餘兩人結為「農民」聯手對抗地主。
// 輪流出牌，須出比上家更大的同類型牌組，不出就喊「過」，連續兩家過牌則由剛出牌的人重新自由出牌。
// 地主先把手牌出完即地主獲勝；任何一位農民先出完手牌，農民方獲勝。
// 支援牌型：單張、對子、三張、三帶一、三帶二、順子(5張以上)、連對(3對以上)、四帶二、炸彈(四張)、火箭(雙王)。
// 計分：單局基礎分 = 叫分(底分) × 總倍數；每打出一組炸彈或火箭，總倍數 ×2；
// 春天（農民全程未出過一張牌）或反春（地主全程只出過第一手牌）亦使總倍數 ×2。
// 地主勝：地主 +2×基礎分，兩農民各 -1×基礎分；農民勝：地主 -2×基礎分，兩農民各 +1×基礎分。
export interface DdzCard {
  suit: 0 | 1 | 2 | 3 | -1 // -1 表示鬼牌
  rank: number // 3..14=3~A，15=2，16=小鬼，17=大鬼
  id: string
}

export const DDZ_RANK_LABEL: Record<number, string> = {
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
  15: "2",
  16: "小鬼",
  17: "大鬼",
}
export const DDZ_SUIT_SYMBOL: Record<number, string> = { 0: "♠", 1: "♥", 2: "♦", 3: "♣", "-1": "" }

export type DdzSeat = "you" | "ai1" | "ai2"
export const DDZ_SEAT_ORDER: DdzSeat[] = ["you", "ai1", "ai2"]
export const DDZ_SEAT_LABEL: Record<DdzSeat, string> = { you: "您", ai1: "電腦A", ai2: "電腦B" }

export type ComboType =
  | "single"
  | "pair"
  | "trio"
  | "trio1"
  | "trio2"
  | "straight"
  | "pairStraight"
  | "four2"
  | "bomb"
  | "rocket"

export interface Combo {
  type: ComboType
  rank: number // 主牌比較點數
  length: number // 牌組張數（用於配對相同長度的順子／連對）
  cards: DdzCard[]
}

export type DdzPhase = "bidding" | "playing"

export interface DdzState {
  phase: DdzPhase
  hands: Record<DdzSeat, DdzCard[]>
  bottom: DdzCard[]
  bottomRevealed: boolean
  // 叫牌階段
  bidTurnOrder: DdzSeat[]
  bidIndex: number
  highestBid: number
  highestBidder: DdzSeat | null
  bidHistory: { seat: DdzSeat; bid: number }[]
  // 打牌階段
  landlord: DdzSeat | null
  turn: DdzSeat
  lastCombo: Combo | null
  lastSeat: DdzSeat | null
  passStreak: number
  history: { seat: DdzSeat; combo: Combo | null }[]
  combosPlayedCount: Record<DdzSeat, number>
  baseScore: number
  multiplier: number
  bombCount: number
  finished: boolean
  outcome: "win" | "lose" | null
  winner: DdzSeat | null
  finalScore: Record<DdzSeat, number> | null
  springLabel: string | null
}

function freshDdzDeck(): DdzCard[] {
  const cards: DdzCard[] = []
  for (let s = 0; s < 4; s++) {
    for (let r = 3; r <= 15; r++) {
      cards.push({ suit: s as 0 | 1 | 2 | 3, rank: r, id: `${s}-${r}` })
    }
  }
  cards.push({ suit: -1, rank: 16, id: "joker-s" })
  cards.push({ suit: -1, rank: 17, id: "joker-b" })
  return cards
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function sortHand(cards: DdzCard[]): DdzCard[] {
  return [...cards].sort((a, b) => a.rank - b.rank || a.suit - b.suit)
}

// 叫牌階段 AI 用的牌力估算：鬼牌、2、A 權重較高，並留意是否已持有炸彈／火箭雛形。
function biddingStrength(hand: DdzCard[]): number {
  let score = 0
  for (const c of hand) {
    if (c.rank === 17) score += 6
    else if (c.rank === 16) score += 5
    else if (c.rank === 15) score += 2
    else if (c.rank === 14) score += 1
    else if (c.rank === 13) score += 0.5
  }
  const counts = new Map<number, number>()
  for (const c of hand) counts.set(c.rank, (counts.get(c.rank) ?? 0) + 1)
  for (const n of counts.values()) if (n === 4) score += 4
  if ((counts.get(16) ?? 0) === 1 && (counts.get(17) ?? 0) === 1) score += 3
  return score
}

function aiBidDecision(hand: DdzCard[], highestBid: number): number {
  const strength = biddingStrength(hand)
  let desired = 0
  if (strength >= 8) desired = 3
  else if (strength >= 4) desired = 2
  else if (strength >= 1.5) desired = 1
  if (desired <= highestBid) return 0
  return desired
}

export function dealDouDizhu(): DdzState {
  const deck = shuffle(freshDdzDeck())
  const you = sortHand(deck.slice(0, 17))
  const ai1 = sortHand(deck.slice(17, 34))
  const ai2 = sortHand(deck.slice(34, 51))
  const bottom = deck.slice(51, 54)
  const bidTurnOrder = shuffle(DDZ_SEAT_ORDER)

  const emptyCombosCount: Record<DdzSeat, number> = { you: 0, ai1: 0, ai2: 0 }

  const base: DdzState = {
    phase: "bidding",
    hands: { you, ai1, ai2 },
    bottom,
    bottomRevealed: false,
    bidTurnOrder,
    bidIndex: 0,
    highestBid: 0,
    highestBidder: null,
    bidHistory: [],
    landlord: null,
    turn: bidTurnOrder[0],
    lastCombo: null,
    lastSeat: null,
    passStreak: 0,
    history: [],
    combosPlayedCount: emptyCombosCount,
    baseScore: 0,
    multiplier: 1,
    bombCount: 0,
    finished: false,
    outcome: null,
    winner: null,
    finalScore: null,
    springLabel: null,
  }
  return settleAfterBid(base)
}

export function nextDdzSeat(seat: DdzSeat): DdzSeat {
  return DDZ_SEAT_ORDER[(DDZ_SEAT_ORDER.indexOf(seat) + 1) % 3]
}

const CONSECUTIVE_MAX = 14 // 順子／連對不能包含 2、小鬼、大鬼

// 判斷一組牌是否構成合法牌組，回傳分類結果；不合法回傳 null。
export function classifyCombo(cards: DdzCard[]): Combo | null {
  if (cards.length === 0) return null
  const ranks = cards.map((c) => c.rank).sort((a, b) => a - b)
  const counts = new Map<number, number>()
  for (const r of ranks) counts.set(r, (counts.get(r) ?? 0) + 1)
  const uniqueRanks = [...counts.keys()].sort((a, b) => a - b)

  if (cards.length === 2 && ranks[0] === 16 && ranks[1] === 17) {
    return { type: "rocket", rank: 100, length: 2, cards }
  }
  if (cards.length === 1) return { type: "single", rank: ranks[0], length: 1, cards }
  if (cards.length === 2 && counts.get(ranks[0]) === 2) {
    return { type: "pair", rank: ranks[0], length: 2, cards }
  }
  if (cards.length === 3 && counts.get(ranks[0]) === 3) {
    return { type: "trio", rank: ranks[0], length: 3, cards }
  }
  if (cards.length === 4 && counts.size === 1) {
    return { type: "bomb", rank: ranks[0], length: 4, cards }
  }
  if (cards.length === 4 && counts.size === 2) {
    const triple = uniqueRanks.find((r) => counts.get(r) === 3)
    if (triple != null) return { type: "trio1", rank: triple, length: 4, cards }
  }
  if (cards.length === 5 && counts.size === 2) {
    const triple = uniqueRanks.find((r) => counts.get(r) === 3)
    const pair = uniqueRanks.find((r) => counts.get(r) === 2)
    if (triple != null && pair != null) return { type: "trio2", rank: triple, length: 5, cards }
  }
  if (cards.length === 6 && counts.size === 2) {
    const quad = uniqueRanks.find((r) => counts.get(r) === 4)
    if (quad != null) return { type: "four2", rank: quad, length: 6, cards }
  }
  if (cards.length >= 5 && counts.size === cards.length) {
    const allBelowLimit = uniqueRanks.every((r) => r <= CONSECUTIVE_MAX)
    let consecutive = true
    for (let i = 1; i < uniqueRanks.length; i++) {
      if (uniqueRanks[i] !== uniqueRanks[i - 1] + 1) consecutive = false
    }
    if (allBelowLimit && consecutive) {
      return { type: "straight", rank: uniqueRanks[uniqueRanks.length - 1], length: cards.length, cards }
    }
  }
  if (cards.length >= 6 && cards.length % 2 === 0 && [...counts.values()].every((n) => n === 2)) {
    const allBelowLimit = uniqueRanks.every((r) => r <= CONSECUTIVE_MAX)
    let consecutive = true
    for (let i = 1; i < uniqueRanks.length; i++) {
      if (uniqueRanks[i] !== uniqueRanks[i - 1] + 1) consecutive = false
    }
    if (allBelowLimit && consecutive) {
      return { type: "pairStraight", rank: uniqueRanks[uniqueRanks.length - 1], length: cards.length, cards }
    }
  }
  return null
}

// combo 是否能壓過 prev（同類型同長度比點數大，或炸彈／火箭特例）。
export function comboBeats(combo: Combo, prev: Combo | null): boolean {
  if (!prev) return true
  if (combo.type === "rocket") return true
  if (prev.type === "rocket") return false
  if (combo.type === "bomb" && prev.type !== "bomb") return true
  if (combo.type === "bomb" && prev.type === "bomb") return combo.rank > prev.rank
  if (prev.type === "bomb") return false
  if (combo.type !== prev.type || combo.length !== prev.length) return false
  return combo.rank > prev.rank
}

function findSmallestCombo(hand: DdzCard[], prev: Combo | null): DdzCard[] | null {
  const byRank = new Map<number, DdzCard[]>()
  for (const c of hand) {
    const list = byRank.get(c.rank) ?? []
    list.push(c)
    byRank.set(c.rank, list)
  }
  const ranks = [...byRank.keys()].sort((a, b) => a - b)

  if (!prev) {
    const smallest = hand[0]
    return smallest ? [smallest] : null
  }

  if (prev.type === "rocket") return null

  if (prev.type === "single" || prev.type === "pair" || prev.type === "trio") {
    const need = prev.type === "single" ? 1 : prev.type === "pair" ? 2 : 3
    for (const r of ranks) {
      if (r <= prev.rank) continue
      const group = byRank.get(r)!
      if (group.length >= need) return group.slice(0, need)
    }
  }

  if (prev.type === "trio1" || prev.type === "trio2") {
    const need = prev.type === "trio1" ? 1 : 2
    for (const r of ranks) {
      if (r <= prev.rank) continue
      const group = byRank.get(r)!
      if (group.length >= 3) {
        const kicker: DdzCard[] = []
        for (const [kr, kg] of byRank) {
          if (kr === r) continue
          if (kicker.length >= need) break
          const take = Math.min(need - kicker.length, kg.length)
          kicker.push(...kg.slice(0, take))
        }
        if (kicker.length === need) return [...group.slice(0, 3), ...kicker]
      }
    }
  }

  if (prev.type === "straight" || prev.type === "pairStraight") {
    const need = prev.type === "straight" ? 1 : 2
    const span = prev.length / need
    for (let start = prev.rank + 1; start + span - 1 <= CONSECUTIVE_MAX; start++) {
      const seq: number[] = []
      for (let i = 0; i < span; i++) seq.push(start + i)
      if (seq.every((r) => (byRank.get(r)?.length ?? 0) >= need)) {
        const cards: DdzCard[] = []
        for (const r of seq) cards.push(...byRank.get(r)!.slice(0, need))
        return cards
      }
    }
  }

  // 打不過就考慮出炸彈（僅在對方牌不多、有必要時），否則放棄。
  for (const r of ranks) {
    const group = byRank.get(r)!
    if (group.length === 4) return group
  }
  return null
}

// ---------- 叫牌（叫地主）階段 ----------

function finalizeLandlord(state: DdzState, seat: DdzSeat, bidScore: number): DdzState {
  const landlordHand = sortHand([...state.hands[seat], ...state.bottom])
  const hands: Record<DdzSeat, DdzCard[]> = { ...state.hands, [seat]: landlordHand }
  return {
    ...state,
    phase: "playing",
    hands,
    bottomRevealed: true,
    landlord: seat,
    turn: seat,
    baseScore: bidScore,
    multiplier: 1,
    bombCount: 0,
    combosPlayedCount: { you: 0, ai1: 0, ai2: 0 },
    lastCombo: null,
    lastSeat: null,
    passStreak: 0,
    history: [],
  }
}

function applyBid(state: DdzState, seat: DdzSeat, bid: number): DdzState {
  const bidHistory = [...state.bidHistory, { seat, bid }]
  let next: DdzState = {
    ...state,
    bidHistory,
    highestBid: bid > 0 ? bid : state.highestBid,
    highestBidder: bid > 0 ? seat : state.highestBidder,
  }
  if (bid === 3) {
    return finalizeLandlord(next, seat, 3)
  }
  const nextIndex = state.bidIndex + 1
  if (nextIndex >= state.bidTurnOrder.length) {
    if (next.highestBidder == null) {
      // 三人均不叫，重新洗牌發牌。
      return dealDouDizhuRaw()
    }
    return finalizeLandlord(next, next.highestBidder, next.highestBid)
  }
  return { ...next, bidIndex: nextIndex, turn: state.bidTurnOrder[nextIndex] }
}

// dealDouDizhu 的內部版本：回傳未經 AI 推進的原始發牌狀態（避免遞迴時重複推進）。
function dealDouDizhuRaw(): DdzState {
  const deck = shuffle(freshDdzDeck())
  const you = sortHand(deck.slice(0, 17))
  const ai1 = sortHand(deck.slice(17, 34))
  const ai2 = sortHand(deck.slice(34, 51))
  const bottom = deck.slice(51, 54)
  const bidTurnOrder = shuffle(DDZ_SEAT_ORDER)
  return {
    phase: "bidding",
    hands: { you, ai1, ai2 },
    bottom,
    bottomRevealed: false,
    bidTurnOrder,
    bidIndex: 0,
    highestBid: 0,
    highestBidder: null,
    bidHistory: [],
    landlord: null,
    turn: bidTurnOrder[0],
    lastCombo: null,
    lastSeat: null,
    passStreak: 0,
    history: [],
    combosPlayedCount: { you: 0, ai1: 0, ai2: 0 },
    baseScore: 0,
    multiplier: 1,
    bombCount: 0,
    finished: false,
    outcome: null,
    winner: null,
    finalScore: null,
    springLabel: null,
  }
}

export function placeBid(state: DdzState, seat: DdzSeat, bid: number): DdzState {
  if (state.phase !== "bidding" || state.bidTurnOrder[state.bidIndex] !== seat) return state
  if (bid !== 0 && bid <= state.highestBid) return state
  if (bid < 0 || bid > 3) return state
  return settleAfterBid(applyBid(state, seat, bid))
}

function settleAfterBid(state: DdzState): DdzState {
  let next = state
  let guard = 0
  while (next.phase === "bidding" && next.bidTurnOrder[next.bidIndex] !== "you" && guard < 200) {
    guard++
    const seat = next.bidTurnOrder[next.bidIndex]
    const bid = aiBidDecision(next.hands[seat], next.highestBid)
    next = applyBid(next, seat, bid)
  }
  if (next.phase === "playing") {
    next = advanceAi(next)
  }
  return next
}

// ---------- 打牌階段 ----------

function detectSpringLabel(state: DdzState, winner: DdzSeat, landlord: DdzSeat): string | null {
  const farmers = DDZ_SEAT_ORDER.filter((s) => s !== landlord)
  const landlordWon = winner === landlord
  if (landlordWon) {
    const farmersNeverPlayed = farmers.every((s) => state.combosPlayedCount[s] === 0)
    if (farmersNeverPlayed) return "春天"
  } else if (state.combosPlayedCount[landlord] === 1) {
    return "反春"
  }
  return null
}

export function playCombo(state: DdzState, seat: DdzSeat, cards: DdzCard[]): DdzState {
  if (state.phase !== "playing" || state.finished || state.turn !== seat || !state.landlord) return state
  const hand = state.hands[seat]
  const ids = new Set(cards.map((c) => c.id))
  if (cards.some((c) => !hand.some((h) => h.id === c.id))) return state
  const combo = classifyCombo(cards)
  if (!combo) return state
  if (!comboBeats(combo, state.lastCombo)) return state

  const newHand = hand.filter((c) => !ids.has(c.id))
  const bombHit = combo.type === "bomb" || combo.type === "rocket"
  let next: DdzState = {
    ...state,
    hands: { ...state.hands, [seat]: newHand },
    lastCombo: combo,
    lastSeat: seat,
    passStreak: 0,
    history: [...state.history, { seat, combo }],
    combosPlayedCount: { ...state.combosPlayedCount, [seat]: state.combosPlayedCount[seat] + 1 },
    multiplier: bombHit ? state.multiplier * 2 : state.multiplier,
    bombCount: bombHit ? state.bombCount + 1 : state.bombCount,
    turn: nextDdzSeat(seat),
  }

  if (newHand.length === 0) {
    const landlord = next.landlord!
    const landlordWon = seat === landlord
    const youAreLandlord = landlord === "you"
    const outcome: "win" | "lose" = youAreLandlord ? (landlordWon ? "win" : "lose") : landlordWon ? "lose" : "win"
    const springLabel = detectSpringLabel(next, seat, landlord)
    const finalMultiplier = springLabel ? next.multiplier * 2 : next.multiplier
    const base = next.baseScore * finalMultiplier
    const finalScore: Record<DdzSeat, number> = { you: 0, ai1: 0, ai2: 0 }
    for (const s of DDZ_SEAT_ORDER) {
      if (s === landlord) finalScore[s] = landlordWon ? base * 2 : -base * 2
      else finalScore[s] = landlordWon ? -base : base
    }
    next = {
      ...next,
      multiplier: finalMultiplier,
      finished: true,
      winner: seat,
      outcome,
      finalScore,
      springLabel,
    }
    return next
  }

  return advanceAi(next)
}

export function passTurn(state: DdzState, seat: DdzSeat): DdzState {
  if (state.phase !== "playing" || state.finished || state.turn !== seat || !state.lastCombo || state.lastSeat === seat)
    return state
  let next: DdzState = {
    ...state,
    passStreak: state.passStreak + 1,
    history: [...state.history, { seat, combo: null }],
    turn: nextDdzSeat(seat),
  }
  if (next.passStreak >= 2) {
    next = { ...next, lastCombo: null, lastSeat: null, passStreak: 0 }
  }
  return advanceAi(next)
}

function advanceAi(state: DdzState): DdzState {
  let next = state
  while (!next.finished && next.turn !== "you") {
    const seat = next.turn
    const hand = next.hands[seat]
    const mustLead = !next.lastCombo || next.lastSeat === seat
    const choice = findSmallestCombo(hand, mustLead ? null : next.lastCombo)
    next = choice ? playCombo(next, seat, choice) : passTurn(next, seat)
  }
  return next
}

export function ddzCardLabel(card: DdzCard): string {
  if (card.rank >= 16) return DDZ_RANK_LABEL[card.rank]
  return `${DDZ_SUIT_SYMBOL[card.suit]}${DDZ_RANK_LABEL[card.rank]}`
}

export const COMBO_TYPE_LABEL: Record<ComboType, string> = {
  single: "單張",
  pair: "對子",
  trio: "三張",
  trio1: "三帶一",
  trio2: "三帶二",
  straight: "順子",
  pairStraight: "連對",
  four2: "四帶二",
  bomb: "炸彈",
  rocket: "火箭",
}
