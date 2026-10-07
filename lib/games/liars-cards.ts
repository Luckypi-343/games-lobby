// 吹牛（順序出牌版，3人對戰：您＋電腦A＋電腦B）：54張牌（含大小鬼，鬼牌可代表任意點數）平均發給三人。
// 每輪出牌者從手牌選 1～4 張蓋牌打出，並宣告「點數＋張數」——宣告的點數必須依 A→2→3→...→K→A 的順序，
// 剛好比上一輪多一個點位（第一輪固定從 A 開始）；宣告內容可以誠實也可以吹牛（虛報點數）。
// 出牌蓋上後，其餘玩家依序可以選擇「相信」（不質疑，直接輪到下一家按順位點數出牌）或「抓吹牛」。
// 一旦有人抓吹牛：立刻掀開剛剛那一疊蓋牌驗證——
//   抓對了（真的吹牛，牌面與宣告不符）：出牌者把桌面所有累積蓋牌全部收回當手牌。
//   抓錯了（出牌者誠實）：抓人的人把桌面所有累積蓋牌全部收回當手牌。
// 結算後桌面清空，由質疑中勝出的一方（抓對時是質疑者、抓錯時是出牌者）獲得重新引牌權，從 A 重新宣告。
// 誰最先把手牌清空即獲勝；若清空的那手牌被成功抓到吹牛，則收回所有牌繼續遊戲。
export type LiarSeat = "you" | "ai1" | "ai2"
export const LIAR_SEAT_ORDER: LiarSeat[] = ["you", "ai1", "ai2"]
export const LIAR_SEAT_LABEL: Record<LiarSeat, string> = { you: "您", ai1: "電腦A", ai2: "電腦B" }

export interface LiarCard {
  suit: 0 | 1 | 2 | 3 | -1 // -1 表示鬼牌
  rank: number // 1..13 = A..K，0 表示鬼牌本身無固定點數
  id: string
}

export const LIAR_RANK_SEQUENCE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] // A..K，之後循環回 A
export const LIAR_RANK_LABEL: Record<number, string> = {
  1: "A",
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
}
export const LIAR_SUIT_SYMBOL: Record<number, string> = { 0: "♠", 1: "♥", 2: "♦", 3: "♣", "-1": "" }

export function liarCardLabel(c: LiarCard): string {
  if (c.suit === -1) return "鬼"
  return `${LIAR_SUIT_SYMBOL[c.suit]}${LIAR_RANK_LABEL[c.rank]}`
}

export function isLiarJoker(c: LiarCard): boolean {
  return c.suit === -1
}

function freshLiarDeck(): LiarCard[] {
  const cards: LiarCard[] = []
  for (let s = 0; s < 4; s++) {
    for (let r = 1; r <= 13; r++) {
      cards.push({ suit: s as 0 | 1 | 2 | 3, rank: r, id: `${s}-${r}` })
    }
  }
  cards.push({ suit: -1, rank: 0, id: "joker-s" })
  cards.push({ suit: -1, rank: 0, id: "joker-b" })
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

function sortHand(cards: LiarCard[]): LiarCard[] {
  return [...cards].sort((a, b) => a.rank - b.rank || a.suit - b.suit)
}

export function nextLiarRank(rank: number): number {
  const idx = LIAR_RANK_SEQUENCE.indexOf(rank)
  return LIAR_RANK_SEQUENCE[(idx + 1) % LIAR_RANK_SEQUENCE.length]
}

export interface LiarPlay {
  seat: LiarSeat
  claimedRank: number
  cards: LiarCard[] // 實際打出的牌（蓋牌，驗證時才揭曉）
}

export type LiarPhase = "playing" | "reveal" | "finished"

export interface LiarState {
  hands: Record<LiarSeat, LiarCard[]>
  turn: LiarSeat
  currentClaimRank: number // 這一輪應該宣告的點數
  pile: LiarPlay[] // 桌面累積蓋牌（依序疊上）
  turnOrder: LiarSeat[]
  turnIndex: number
  lastPlay: LiarPlay | null
  phase: LiarPhase
  revealResult: { challenger: LiarSeat; honest: boolean; loser: LiarSeat } | null
  finished: boolean
  outcome: "win" | "lose" | null
  winner: LiarSeat | null
  roundCount: number
  message: string | null
}

export function dealLiarsCards(): LiarState {
  const deck = shuffle(freshLiarDeck())
  const you = sortHand(deck.slice(0, 18))
  const ai1 = sortHand(deck.slice(18, 36))
  const ai2 = sortHand(deck.slice(36, 54))
  const turnOrder = shuffle(LIAR_SEAT_ORDER)
  return {
    hands: { you, ai1, ai2 },
    turn: turnOrder[0],
    currentClaimRank: 1, // 第一把必須從 A 開始
    pile: [],
    turnOrder,
    turnIndex: 0,
    lastPlay: null,
    phase: "playing",
    revealResult: null,
    finished: false,
    outcome: null,
    winner: null,
    roundCount: 0,
    message: null,
  }
}

function seatAfter(state: LiarState, seat: LiarSeat): LiarSeat {
  const idx = state.turnOrder.indexOf(seat)
  return state.turnOrder[(idx + 1) % state.turnOrder.length]
}

// 出牌：打出 1~4 張蓋牌，宣告點數必須是 state.currentClaimRank（依序輪替，可誠實也可吹牛）。
export function playLiarCards(state: LiarState, cardIds: string[]): LiarState {
  if (state.phase !== "playing" || cardIds.length === 0 || cardIds.length > 4) return state
  const seat = state.turn
  const hand = state.hands[seat]
  const played = hand.filter((c) => cardIds.includes(c.id))
  if (played.length !== cardIds.length) return state
  const remaining = hand.filter((c) => !cardIds.includes(c.id))

  const play: LiarPlay = { seat, claimedRank: state.currentClaimRank, cards: played }
  const wonByEmptying = remaining.length === 0

  return {
    ...state,
    hands: { ...state.hands, [seat]: remaining },
    pile: [...state.pile, play],
    lastPlay: play,
    turn: seatAfter(state, seat),
    phase: "playing",
    message: null,
    // 手牌清空先標記，等其餘玩家決定是否質疑這最後一手牌之後才真正判定勝負
    outcome: wonByEmptying ? null : state.outcome,
  }
}

// 相信（不質疑）：輪到下一位玩家按順位點數繼續出牌；若剛才出完牌的人已經手牌清空且沒被抓，則他獲勝。
export function passChallenge(state: LiarState): LiarState {
  if (state.phase !== "playing" || !state.lastPlay) return state
  const emptied = state.hands[state.lastPlay.seat].length === 0
  if (emptied) {
    return {
      ...state,
      finished: true,
      phase: "finished",
      outcome: state.lastPlay.seat === "you" ? "win" : "lose",
      winner: state.lastPlay.seat,
      message: `${LIAR_SEAT_LABEL[state.lastPlay.seat]}的牌全部出完，沒有人抓吹牛，獲勝！`,
    }
  }
  return {
    ...state,
    currentClaimRank: nextLiarRank(state.currentClaimRank),
    message: null,
  }
}

// 抓吹牛：verify 剛才那一手牌的實際牌面是否符合宣稱的點數（鬼牌可代表任意點數）。
export function challengeLiar(state: LiarState, challenger: LiarSeat): LiarState {
  if (state.phase !== "playing" || !state.lastPlay) return state
  const play = state.lastPlay
  const honest = play.cards.every((c) => isLiarJoker(c) || c.rank === play.claimedRank)
  const loser = honest ? challenger : play.seat

  // 收回桌面所有累積蓋牌給輸家
  const allPileCards = state.pile.flatMap((p) => p.cards)
  const handsAfterCollect: Record<LiarSeat, LiarCard[]> = {
    you: [...state.hands.you],
    ai1: [...state.hands.ai1],
    ai2: [...state.hands.ai2],
  }
  handsAfterCollect[loser] = sortHand([...handsAfterCollect[loser], ...allPileCards])

  const emptiedWinner = play.seat !== loser && handsAfterCollect[play.seat].length === 0
  if (emptiedWinner) {
    // 出牌者是誠實的且剛好清空手牌，質疑失敗後出牌者直接獲勝
    return {
      ...state,
      hands: handsAfterCollect,
      pile: [],
      lastPlay: null,
      phase: "finished",
      finished: true,
      outcome: play.seat === "you" ? "win" : "lose",
      winner: play.seat,
      revealResult: { challenger, honest, loser },
      message: `${LIAR_SEAT_LABEL[challenger]}抓錯了！${LIAR_SEAT_LABEL[play.seat]}牌已出完，獲勝！`,
    }
  }

  const nextTurn = loser // 質疑中勝出的一方獲得重新引牌權
  const winnerOfChallenge = honest ? play.seat : challenger
  return {
    ...state,
    hands: handsAfterCollect,
    pile: [],
    lastPlay: null,
    turn: winnerOfChallenge,
    currentClaimRank: 1, // 重新從 A 開始宣告
    phase: "playing",
    revealResult: { challenger, honest, loser },
    roundCount: state.roundCount + 1,
    message: honest
      ? `${LIAR_SEAT_LABEL[challenger]}抓錯了！${LIAR_SEAT_LABEL[challenger]}收回全部桌面的牌。`
      : `${LIAR_SEAT_LABEL[challenger]}抓對了！${LIAR_SEAT_LABEL[play.seat]}收回全部桌面的牌。`,
  }
}

// --- AI 邏輯 ---

// AI 決定要出哪些牌、宣告什麼點數（可能誠實也可能吹牛）。
export function aiChooseLiarPlay(hand: LiarCard[], claimRank: number): string[] {
  const matching = hand.filter((c) => c.rank === claimRank || isLiarJoker(c))
  if (matching.length > 0) {
    // 有真牌時，大多誠實出 1~3 張；偶爾混一張雜牌吹牛增加張數
    const count = Math.min(matching.length, 1 + Math.floor(Math.random() * Math.min(3, matching.length)))
    const chosen = matching.slice(0, count)
    if (Math.random() < 0.15 && hand.length > chosen.length) {
      const filler = hand.find((c) => !chosen.includes(c))
      if (filler) chosen.push(filler)
    }
    return chosen.map((c) => c.id)
  }
  // 沒有真牌，必須吹牛：挑 1~2 張雜牌蓋出去，優先出小牌或多餘的牌
  const sorted = [...hand].sort((a, b) => a.rank - b.rank)
  const count = Math.min(sorted.length, 1 + Math.floor(Math.random() * 2))
  return sorted.slice(0, count).map((c) => c.id)
}

// AI 決定是否質疑上一手牌：依照自己手上同點數的牌張數，估計對方吹牛機率。
export function aiShouldChallenge(hand: LiarCard[], play: LiarPlay): boolean {
  const ownMatching = hand.filter((c) => c.rank === play.claimedRank || isLiarJoker(c)).length
  const totalOfRank = 4 // 整副牌每個點數最多4張（不含鬼牌）
  const impossible = ownMatching + play.cards.length > totalOfRank + 2 // 含鬼牌容錯
  if (impossible) return true
  // 自己手上同點數的牌越多，對方越可能是吹牛
  let suspicion = ownMatching * 0.22
  if (play.cards.length >= 3) suspicion += 0.15
  if (play.cards.length === 4) suspicion += 0.15
  suspicion += Math.random() * 0.25 - 0.05
  return suspicion > 0.45
}
