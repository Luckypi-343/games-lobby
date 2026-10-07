// 排七（Sevens）四人牌局規則引擎：52張標準牌（不含鬼牌），每人發13張。
// 四條花色軌道以7為起點向上(8..K)、向下(6..A)延伸；輪到的玩家若有牌可出必須出牌，
// 無牌可出才能蓋牌（蓋下的牌面朝下，點數計入最終負分，且遊戲結束前不可再打出）。
import { type Card, type Suit, freshDeck, shuffled, RANK_LABEL, SUIT_SYMBOL } from "./cards"

export const SEVENS_PLAYER_COUNT = 4
export const SEVENS_PLAYER_NAMES = ["你", "電腦A", "電腦B", "電腦C"] as const

export interface SuitTrack {
  opened: boolean // 7 是否已經打出
  low: number // 目前往下延伸到的最小點數（尚未打出任何牌時為 8，代表只差 7 本身）
  high: number // 目前往上延伸到的最大點數（尚未打出任何牌時為 6）
}

export interface SevensState {
  hands: Card[][] // 4人手牌
  covered: Card[][] // 4人蓋牌（面朝下，只計點數）
  tracks: Record<Suit, SuitTrack>
  turn: number // 目前輪到的玩家索引 0..3
  finished: boolean[] // 該玩家手牌是否已出完/蓋完
  log: string[] // 最新事件說明（供畫面顯示）
  lastMove: { by: number; kind: "play" | "cover"; card: Card } | null
  status: "playing" | "over"
  // 進階規則追蹤
  lastPlayedExtreme: { by: number; rank: number } | null // 最後一張出牌若為 A 或 K，記錄用於「活牌開到底」獎勵
}

function emptyTrack(): SuitTrack {
  return { opened: false, low: 8, high: 6 }
}

export function cardPoint(rank: number): number {
  // A=1, 2..10 依牌面, J=11, Q=12, K=13
  return rank === 14 ? 1 : rank
}

export function dealSevens(): SevensState {
  const deck = shuffled(freshDeck())
  const hands: Card[][] = [[], [], [], []]
  deck.forEach((c, i) => hands[i % 4].push(c))
  hands.forEach((h) => h.sort((a, b) => a.suit - b.suit || a.rank - b.rank))

  // 持有 ♠7 的人優先開局
  const starter = hands.findIndex((h) => h.some((c) => c.suit === 0 && c.rank === 7))

  return {
    hands,
    covered: [[], [], [], []],
    tracks: {
      0: emptyTrack(),
      1: emptyTrack(),
      2: emptyTrack(),
      3: emptyTrack(),
    } as Record<Suit, SuitTrack>,
    turn: starter >= 0 ? starter : 0,
    finished: [false, false, false, false],
    log: [`${SEVENS_PLAYER_NAMES[starter >= 0 ? starter : 0]} 持有 ♠7，優先開局`],
    lastMove: null,
    status: "playing",
    lastPlayedExtreme: null,
  }
}

export function isPlayable(state: SevensState, card: Card): boolean {
  const track = state.tracks[card.suit]
  if (card.rank === 7) return !track.opened
  if (!track.opened) return false
  if (card.rank === track.low - 1) return true
  if (card.rank === track.high + 1) return true
  return false
}

export function playableCards(state: SevensState, seat: number): Card[] {
  return state.hands[seat].filter((c) => isPlayable(state, c))
}

function nextSeat(state: SevensState, from: number): number {
  let i = from
  for (let step = 0; step < 4; step++) {
    i = (i + 1) % 4
    if (!state.finished[i]) return i
  }
  return from
}

function checkFinished(state: SevensState, seat: number) {
  if (state.hands[seat].length === 0) {
    state.finished[seat] = true
  }
}

function checkGameOver(state: SevensState) {
  if (state.finished.every(Boolean)) {
    state.status = "over"
  }
}

export function playCard(state: SevensState, seat: number, card: Card): SevensState {
  if (state.status !== "playing" || state.turn !== seat) return state
  if (!isPlayable(state, card)) return state
  const next: SevensState = JSON.parse(JSON.stringify(state))
  const hand = next.hands[seat]
  const idx = hand.findIndex((c) => c.id === card.id)
  if (idx < 0) return state
  hand.splice(idx, 1)
  const track = next.tracks[card.suit]
  if (card.rank === 7) {
    track.opened = true
    track.low = 7
    track.high = 7
  } else if (card.rank === track.low - 1) {
    track.low = card.rank
  } else {
    track.high = card.rank
  }
  next.lastMove = { by: seat, kind: "play", card }
  next.log = [`${SEVENS_PLAYER_NAMES[seat]} 打出 ${SUIT_SYMBOL[card.suit]}${RANK_LABEL[card.rank]}`, ...next.log].slice(0, 20)
  next.lastPlayedExtreme = card.rank === 14 || card.rank === 13 ? { by: seat, rank: card.rank } : null
  checkFinished(next, seat)
  if (!next.finished[seat]) {
    next.turn = nextSeat(next, seat)
  } else if (!next.finished.every(Boolean)) {
    next.turn = nextSeat(next, seat)
  }
  checkGameOver(next)
  return next
}

export function coverCard(state: SevensState, seat: number, card: Card): SevensState {
  if (state.status !== "playing" || state.turn !== seat) return state
  if (playableCards(state, seat).length > 0) return state // 有牌可出就不能蓋牌
  const next: SevensState = JSON.parse(JSON.stringify(state))
  const hand = next.hands[seat]
  const idx = hand.findIndex((c) => c.id === card.id)
  if (idx < 0) return state
  hand.splice(idx, 1)
  next.covered[seat].push(card)
  next.lastMove = { by: seat, kind: "cover", card }
  const extremeNote = card.rank === 14 || card.rank === 13 ? "（端點牌，計分加倍！）" : ""
  next.log = [`${SEVENS_PLAYER_NAMES[seat]} 無牌可接，蓋下一張牌${extremeNote}`, ...next.log].slice(0, 20)
  next.lastPlayedExtreme = null
  checkFinished(next, seat)
  next.turn = nextSeat(next, seat)
  checkGameOver(next)
  return next
}

// 電腦自動行動：優先保護高點數牌——若需蓋牌，蓋點數最小的；若可出牌，優先出會卡住他人、或單純最早可出的牌。
export function botAct(state: SevensState, seat: number): SevensState {
  const options = playableCards(state, seat)
  if (options.length > 0) {
    // 優先出 7，其次出點數較小的牌（盡快脫手小牌，留大牌觀望）
    const sorted = [...options].sort((a, b) => {
      if (a.rank === 7 && b.rank !== 7) return -1
      if (b.rank === 7 && a.rank !== 7) return 1
      return a.rank - b.rank
    })
    return playCard(state, seat, sorted[0])
  }
  const hand = state.hands[seat]
  if (hand.length === 0) return state
  // 蓋牌時優先蓋點數最小的，把大牌留在手裡等待機會
  const sorted = [...hand].sort((a, b) => cardPoint(a.rank) - cardPoint(b.rank))
  return coverCard(state, seat, sorted[0])
}

export interface SevensScoreRow {
  seat: number
  name: string
  coveredCount: number
  basePoints: number
  finalPoints: number
  perfect: boolean
  lastExtremeBonus: boolean
}

export function scoreSevens(state: SevensState): SevensScoreRow[] {
  return state.covered.map((cards, seat) => {
    let basePoints = 0
    for (const c of cards) {
      const p = cardPoint(c.rank)
      // 蓋 A 或 K 屬於端點關鍵牌，加倍計分
      basePoints += c.rank === 14 || c.rank === 13 ? p * 2 : p
    }
    const perfect = cards.length === 0
    let finalPoints = perfect ? 0 : basePoints
    return {
      seat,
      name: SEVENS_PLAYER_NAMES[seat],
      coveredCount: cards.length,
      basePoints,
      finalPoints,
      perfect,
      lastExtremeBonus: false,
    }
  })
}
