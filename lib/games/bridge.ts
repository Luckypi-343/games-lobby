// 橋牌（合約橋牌 / Contract Bridge）正宗規則版：
// 南北（您＋北家隊友）對東西（西家＋東家，皆電腦）兩隊，每局依序經歷
// 發牌 → 叫牌（拍賣）→ 打牌 → 計分 四個完整階段，規則對齊正式合約橋牌。
import { type Card, type Suit, SUIT_SYMBOL, RANK_LABEL, freshDeck, shuffled } from "./cards"

export type Seat = "south" | "west" | "north" | "east"
export const SEAT_ORDER: Seat[] = ["south", "west", "north", "east"] // 順時針叫牌／出牌順序
export const SEAT_LABEL: Record<Seat, string> = { south: "您（南）", west: "西家", north: "北家", east: "東家" }
export type Partnership = "NS" | "EW"

export function partnershipOf(seat: Seat): Partnership {
  return seat === "south" || seat === "north" ? "NS" : "EW"
}
export function isYourTeam(seat: Seat): boolean {
  return partnershipOf(seat) === "NS"
}
export function nextSeat(seat: Seat): Seat {
  return SEAT_ORDER[(SEAT_ORDER.indexOf(seat) + 1) % 4]
}
export function partnerOf(seat: Seat): Seat {
  return nextSeat(nextSeat(seat))
}
export function dealerForBoard(board: number): Seat {
  return SEAT_ORDER[(board - 1) % 4]
}

// ---- 叫牌（Bidding / Auction） ----
export type Strain = Suit | "NT" // 0♠ 1♥ 2♦ 3♣，或 "NT" 無王
export interface ContractBid {
  level: number
  strain: Strain
} // 1～7 線
export type Call =
  | { kind: "bid"; bid: ContractBid }
  | { kind: "pass" }
  | { kind: "double" }
  | { kind: "redouble" }
export interface CallRecord {
  seat: Seat
  call: Call
}

// 花色等級：NT > ♠ > ♥ > ♦ > ♣
function strainRank(strain: Strain): number {
  if (strain === "NT") return 4
  return 3 - strain
}
export function bidRank(bid: ContractBid): number {
  return (bid.level - 1) * 5 + strainRank(bid.strain)
}
export const STRAIN_ORDER: Strain[] = [3, 2, 1, 0, "NT"] // 由低到高：♣ ♦ ♥ ♠ 無王
export function strainSymbol(strain: Strain): string {
  return strain === "NT" ? "NT" : SUIT_SYMBOL[strain]
}
export function strainLabel(strain: Strain): string {
  return strain === "NT" ? "無王" : SUIT_SYMBOL[strain]
}
function strainKey(strain: Strain): string {
  return strain === "NT" ? "NT" : String(strain)
}

export interface AuctionState {
  dealer: Seat
  calls: CallRecord[]
  turn: Seat
  highestBid: ContractBid | null
  highestBidder: Seat | null
  doubled: 0 | 1 | 2
  passStreak: number
  finished: boolean
  passedOut: boolean
}

export function startAuction(dealer: Seat): AuctionState {
  return {
    dealer,
    calls: [],
    turn: dealer,
    highestBid: null,
    highestBidder: null,
    doubled: 0,
    passStreak: 0,
    finished: false,
    passedOut: false,
  }
}

export function legalCallTypes(
  state: AuctionState,
  seat: Seat,
): { canPass: boolean; canBid: boolean; canDouble: boolean; canRedouble: boolean } {
  if (state.finished || state.turn !== seat) return { canPass: false, canBid: false, canDouble: false, canRedouble: false }
  const canDouble = state.highestBid != null && state.doubled === 0 && partnershipOf(state.highestBidder!) !== partnershipOf(seat)
  const canRedouble = state.doubled === 1 && partnershipOf(state.highestBidder!) === partnershipOf(seat)
  return { canPass: true, canBid: true, canDouble, canRedouble }
}

export function minLegalBidRank(state: AuctionState): number {
  return state.highestBid ? bidRank(state.highestBid) + 1 : 0
}

export function applyCall(state: AuctionState, seat: Seat, call: Call): AuctionState {
  if (state.finished || state.turn !== seat) return state
  const legal = legalCallTypes(state, seat)
  if (call.kind === "double" && !legal.canDouble) return state
  if (call.kind === "redouble" && !legal.canRedouble) return state
  if (call.kind === "bid" && bidRank(call.bid) < minLegalBidRank(state)) return state

  const calls = [...state.calls, { seat, call }]
  let { highestBid, highestBidder, doubled, passStreak } = state
  let finished = false
  let passedOut = false

  if (call.kind === "pass") {
    passStreak += 1
    if (highestBid === null && passStreak === 4) {
      finished = true
      passedOut = true
    } else if (highestBid !== null && passStreak === 3) {
      finished = true
    }
  } else {
    passStreak = 0
    if (call.kind === "bid") {
      highestBid = call.bid
      highestBidder = seat
      doubled = 0
    } else if (call.kind === "double") {
      doubled = 1
    } else if (call.kind === "redouble") {
      doubled = 2
    }
  }

  return { ...state, calls, turn: nextSeat(seat), highestBid, highestBidder, doubled, passStreak, finished, passedOut }
}

// 莊家＝贏得最終合約一方中，最早叫出該合約花色（或無王）的那位玩家。
export function computeDeclarer(state: AuctionState): Seat {
  const winner = partnershipOf(state.highestBidder!)
  const key = strainKey(state.highestBid!.strain)
  for (const rec of state.calls) {
    if (rec.call.kind === "bid" && partnershipOf(rec.seat) === winner && strainKey(rec.call.bid.strain) === key) {
      return rec.seat
    }
  }
  return state.highestBidder!
}

// ---- 簡化版標準叫牌 AI（高花點數制：A=4 K=3 Q=2 J=1）----
export function handPoints(hand: Card[]): number {
  return hand.reduce((sum, c) => sum + (c.rank === 14 ? 4 : c.rank === 13 ? 3 : c.rank === 12 ? 2 : c.rank === 11 ? 1 : 0), 0)
}
function suitLengths(hand: Card[]): Record<Suit, number> {
  const len: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 }
  for (const c of hand) len[c.suit]++
  return len as Record<Suit, number>
}
function isBalanced(len: Record<Suit, number>): boolean {
  const vals = [len[0], len[1], len[2], len[3]].sort((a, b) => b - a)
  return vals[0] <= 5 && vals[3] >= 2 && !(vals[0] === 5 && vals[1] < 3)
}
function longestSuit(len: Record<Suit, number>, preferMajor = true): Suit {
  const order: Suit[] = preferMajor ? [0, 1, 3, 2] : [3, 2, 0, 1]
  let best: Suit = 0
  let bestLen = -1
  for (const s of order) {
    if (len[s] > bestLen) {
      bestLen = len[s]
      best = s
    }
  }
  return best
}

export function aiDecideCall(seat: Seat, state: AuctionState, hands: Record<Seat, Card[]>): Call {
  const hand = hands[seat]
  const points = handPoints(hand)
  const len = suitLengths(hand)
  const balanced = isBalanced(len)
  const partner = partnerOf(seat)
  const partnerBidCalls = state.calls.filter((r) => r.call.kind === "bid" && r.seat === partner)
  const ownBidCalls = state.calls.filter((r) => r.call.kind === "bid" && r.seat === seat)
  const oppHasBid = state.highestBid != null && partnershipOf(state.highestBidder!) !== partnershipOf(seat)

  function tryBid(level: number, strain: Strain): Call | null {
    if (level < 1 || level > 7) return null
    const bid: ContractBid = { level, strain }
    if (bidRank(bid) >= minLegalBidRank(state)) return { kind: "bid", bid }
    return null
  }

  // 隊友已開叫、自己尚未叫過、對手也還沒介入 → 標準應叫
  if (partnerBidCalls.length > 0 && ownBidCalls.length === 0 && !oppHasBid) {
    const openBid = (partnerBidCalls[0].call as { kind: "bid"; bid: ContractBid }).bid
    if (openBid.strain === "NT") {
      if (points >= 10) return tryBid(3, "NT") ?? { kind: "pass" }
      if (points >= 8) return tryBid(2, "NT") ?? { kind: "pass" }
      return { kind: "pass" }
    }
    const suit = openBid.strain as Suit
    if (points >= 6 && len[suit] >= 3) {
      const raiseLevel = points >= 10 && len[suit] >= 4 ? openBid.level + 2 : openBid.level + 1
      return tryBid(Math.min(raiseLevel, 7), suit) ?? { kind: "pass" }
    }
    if (points >= 6) {
      const alt = longestSuit(len)
      if (alt !== suit && len[alt] >= 4) {
        const b = tryBid(1, alt) ?? tryBid(2, alt)
        if (b) return b
      }
    }
    if (points >= 6 && points <= 10 && balanced) return tryBid(1, "NT") ?? { kind: "pass" }
    return { kind: "pass" }
  }

  // 尚無人開叫，輪到自己第一次發言
  if (!oppHasBid && ownBidCalls.length === 0 && state.highestBid === null) {
    if (points >= 15 && points <= 17 && balanced) return tryBid(1, "NT") ?? { kind: "pass" }
    if (points >= 13) return tryBid(1, longestSuit(len)) ?? { kind: "pass" }
    return { kind: "pass" }
  }

  // 對手握有優勢叫品，考慮超叫
  if (oppHasBid && ownBidCalls.length === 0) {
    const suit = longestSuit(len)
    if (points >= 9 && len[suit] >= 5) {
      const b = tryBid(state.highestBid!.level, suit) ?? tryBid(state.highestBid!.level + 1, suit)
      if (b) return b
    }
    return { kind: "pass" }
  }

  return { kind: "pass" }
}

// ---- 蕃位／夢家與自動代打規則 ----
export interface Contract {
  level: number
  strain: Strain
  doubled: 0 | 1 | 2
  declarer: Seat
}

// 由誰實際操作這一手牌：莊家代打夢家、防守方各自打自己的牌。
export function seatController(seat: Seat, contract: Contract): "human" | "ai" {
  const declarer = contract.declarer
  const dummy = partnerOf(declarer)
  if (declarer === "south") return seat === "south" || seat === "north" ? "human" : "ai" // 您是莊家，代打夢家(北)
  if (dummy === "south") return "ai" // 您是夢家，由隊友(莊家)代打，完全不需操作
  return seat === "south" ? "human" : "ai" // 您是防守方，只打自己的牌
}

// ---- 打牌（Play of the Hand）----
export interface Trick {
  ledSuit: Suit
  plays: { seat: Seat; card: Card }[]
  winner: Seat | null
}

export type Vulnerability = "none" | "ns" | "ew" | "both"
const VULN_CYCLE: Vulnerability[] = [
  "none", "ns", "ew", "both", "ns", "ew", "both", "none",
  "ew", "both", "none", "ns", "both", "none", "ns", "ew",
]
export function vulnerabilityForBoard(board: number): Vulnerability {
  return VULN_CYCLE[(board - 1) % 16]
}
export function isVulnerable(vuln: Vulnerability, side: Partnership): boolean {
  return vuln === "both" || (side === "NS" ? vuln === "ns" : vuln === "ew")
}

export interface PlayState {
  contract: Contract
  dummy: Seat
  hands: Record<Seat, Card[]>
  turn: Seat
  leader: Seat
  currentTrick: Trick
  completedTricks: Trick[]
  tricksWon: Record<Partnership, number>
  finished: boolean
}

export function startPlay(contract: Contract, hands: Record<Seat, Card[]>): PlayState {
  const opener = nextSeat(contract.declarer) // 莊家左手邊的防守方首引
  const dummy = partnerOf(contract.declarer)
  return {
    contract,
    dummy,
    hands,
    turn: opener,
    leader: opener,
    currentTrick: { ledSuit: hands[opener][0].suit, plays: [], winner: null },
    completedTricks: [],
    tricksWon: { NS: 0, EW: 0 },
    finished: false,
  }
}

export function legalCards(hand: Card[], ledSuit: Suit | null): Card[] {
  if (ledSuit == null) return hand
  const followers = hand.filter((c) => c.suit === ledSuit)
  return followers.length > 0 ? followers : hand
}

function trumpSuitOf(contract: Contract): Suit | null {
  return contract.strain === "NT" ? null : contract.strain
}

function trickWinner(trick: Trick, trump: Suit | null): Seat {
  let best = trick.plays[0]
  for (const p of trick.plays.slice(1)) {
    const bestIsTrump = trump != null && best.card.suit === trump
    const pIsTrump = trump != null && p.card.suit === trump
    if (pIsTrump && !bestIsTrump) best = p
    else if (pIsTrump === bestIsTrump && p.card.suit === best.card.suit && p.card.rank > best.card.rank) best = p
  }
  return best.seat
}

// 電腦出牌：能跟牌就跟，優先打贏這一輪的最小牌，贏不了就丟最小的牌。
export function aiChooseCard(hand: Card[], trick: Trick, trump: Suit | null): Card {
  const options = legalCards(hand, trick.plays.length > 0 ? trick.ledSuit : null)
  if (trick.plays.length === 0) return [...options].sort((a, b) => a.rank - b.rank)[0]
  const currentWinner = trickWinner(trick, trump)
  const winningCard = trick.plays.find((p) => p.seat === currentWinner)!.card
  const canBeat = options.filter((c) => {
    const isTrump = trump != null && c.suit === trump
    const winIsTrump = trump != null && winningCard.suit === trump
    if (isTrump && !winIsTrump) return true
    if (isTrump === winIsTrump && c.suit === winningCard.suit) return c.rank > winningCard.rank
    return false
  })
  if (canBeat.length > 0) return [...canBeat].sort((a, b) => a.rank - b.rank)[0]
  return [...options].sort((a, b) => a.rank - b.rank)[0]
}

export function playCard(state: PlayState, seat: Seat, card: Card): PlayState {
  if (state.finished || state.turn !== seat) return state
  const hand = state.hands[seat]
  const ledSuit = state.currentTrick.plays.length > 0 ? state.currentTrick.ledSuit : card.suit
  const legal = legalCards(hand, state.currentTrick.plays.length > 0 ? state.currentTrick.ledSuit : null)
  if (!legal.some((c) => c.id === card.id)) return state

  let next: PlayState = {
    ...state,
    hands: { ...state.hands, [seat]: hand.filter((c) => c.id !== card.id) },
    currentTrick: {
      ledSuit: state.currentTrick.plays.length > 0 ? state.currentTrick.ledSuit : ledSuit,
      plays: [...state.currentTrick.plays, { seat, card }],
      winner: null,
    },
  }

  if (next.currentTrick.plays.length === 4) {
    const trump = trumpSuitOf(next.contract)
    const winner = trickWinner(next.currentTrick, trump)
    const finishedTrick: Trick = { ...next.currentTrick, winner }
    const side = partnershipOf(winner)
    const tricksWon = { ...next.tricksWon, [side]: next.tricksWon[side] + 1 }
    const completedTricks = [...next.completedTricks, finishedTrick]
    const allEmpty = SEAT_ORDER.every((s) => next.hands[s].length === 0)
    if (allEmpty) {
      next = { ...next, completedTricks, tricksWon, finished: true, currentTrick: { ledSuit: 0 as Suit, plays: [], winner } }
    } else {
      next = {
        ...next,
        completedTricks,
        tricksWon,
        leader: winner,
        turn: winner,
        currentTrick: { ledSuit: next.hands[winner][0]?.suit ?? (0 as Suit), plays: [], winner: null },
      }
    }
  } else {
    next = { ...next, turn: nextSeat(seat) }
  }

  return next
}

export function dealBridgeHands(): Record<Seat, Card[]> {
  const deck = shuffled(freshDeck())
  const hands: Record<Seat, Card[]> = { south: [], west: [], north: [], east: [] }
  SEAT_ORDER.forEach((seat, i) => {
    hands[seat] = deck.slice(i * 13, i * 13 + 13).sort((a, b) => a.suit - b.suit || a.rank - b.rank)
  })
  return hands
}

// ---- 計分（Scoring）----
export interface ScoreResult {
  made: boolean
  tricksWon: number
  required: number
  declarerSide: Partnership
  points: number
  scoringSide: Partnership
  detail: string
}

function trickPointValue(strain: Strain): number {
  if (strain === "NT") return 30
  return strain === 0 || strain === 1 ? 30 : 20
}

function doubledUndertrickPenalty(n: number, vulnerable: boolean): number {
  if (!vulnerable) return n === 1 ? 100 : n <= 3 ? 200 : 300
  return n === 1 ? 200 : 300
}

export function scoreContract(contract: Contract, tricksWon: number, vuln: Vulnerability): ScoreResult {
  const required = 6 + contract.level
  const declarerSide = partnershipOf(contract.declarer)
  const vulnerable = isVulnerable(vuln, declarerSide)

  if (tricksWon >= required) {
    const overtricks = tricksWon - required
    let trickScore = contract.strain === "NT" ? 40 + (contract.level - 1) * 30 : contract.level * trickPointValue(contract.strain)
    if (contract.doubled === 1) trickScore *= 2
    if (contract.doubled === 2) trickScore *= 4

    let overtrickScore: number
    if (contract.doubled === 0) {
      overtrickScore = overtricks * trickPointValue(contract.strain)
    } else {
      const per = vulnerable ? (contract.doubled === 1 ? 200 : 400) : contract.doubled === 1 ? 100 : 200
      overtrickScore = overtricks * per
    }

    const gameBonus = trickScore >= 100 ? (vulnerable ? 500 : 300) : 50
    const slamBonus = contract.level === 7 ? (vulnerable ? 1500 : 1000) : contract.level === 6 ? (vulnerable ? 750 : 500) : 0
    const insultBonus = contract.doubled === 1 ? 50 : contract.doubled === 2 ? 100 : 0
    const points = trickScore + overtrickScore + gameBonus + slamBonus + insultBonus

    return {
      made: true,
      tricksWon,
      required,
      declarerSide,
      points,
      scoringSide: declarerSide,
      detail: `完成合約：贏得 ${tricksWon} 墩（需 ${required} 墩）${overtricks > 0 ? `，超 ${overtricks} 墩` : ""}`,
    }
  }

  const undertricks = required - tricksWon
  let penalty = 0
  if (contract.doubled === 0) {
    penalty = undertricks * (vulnerable ? 100 : 50)
  } else {
    for (let i = 1; i <= undertricks; i++) {
      const base = doubledUndertrickPenalty(i, vulnerable)
      penalty += contract.doubled === 2 ? base * 2 : base
    }
  }
  return {
    made: false,
    tricksWon,
    required,
    declarerSide,
    points: penalty,
    scoringSide: declarerSide === "NS" ? "EW" : "NS",
    detail: `合約失敗：只贏得 ${tricksWon} 墩（需 ${required} 墩），宕 ${undertricks} 墩`,
  }
}

// ---- 一局整體狀態（發牌→叫牌→打牌→計分）----
export type Phase = "bidding" | "playing" | "scoring"

export interface DealState {
  board: number
  vulnerability: Vulnerability
  dealer: Seat
  hands: Record<Seat, Card[]>
  auction: AuctionState
  phase: Phase
  contract: Contract | null
  play: PlayState | null
  score: ScoreResult | null
}

export function newDeal(board: number, dealer: Seat): DealState {
  return {
    board,
    vulnerability: vulnerabilityForBoard(board),
    dealer,
    hands: dealBridgeHands(),
    auction: startAuction(dealer),
    phase: "bidding",
    contract: null,
    play: null,
    score: null,
  }
}

export function finalizeAuction(deal: DealState): DealState {
  if (!deal.auction.finished || deal.auction.passedOut) return deal
  const declarer = computeDeclarer(deal.auction)
  const contract: Contract = {
    level: deal.auction.highestBid!.level,
    strain: deal.auction.highestBid!.strain,
    doubled: deal.auction.doubled,
    declarer,
  }
  return { ...deal, phase: "playing", contract, play: startPlay(contract, deal.hands) }
}

export function cardLabel(card: Card): string {
  return `${SUIT_SYMBOL[card.suit]}${RANK_LABEL[card.rank]}`
}
