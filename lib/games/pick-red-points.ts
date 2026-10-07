// 撿紅點（正宗規則）：
// ・吃牌配對：A(1)+9、2+8、3+7、4+6、5+5 湊10；10 只能吃 10；J／Q／K 不計點數，只能跟「同牌型」的皮牌對碰。
// ・每回合固定兩步：
//   步驟1 打手牌：手上有牌能吃就打出去吃牌（手牌＋被吃的桌面牌一起收走）；吃不到就把這張手牌丟入桌面（放水）。
//   步驟2 翻牌堆：從牌堆翻開一張牌，能吃桌面牌就立刻吃掉；吃不到就留在桌面上。
// ・只計算紅牌（紅心／方塊）：紅A每張20分，紅9/10/J/Q/K每張10分，紅2~8依牌面數字計分，黑牌0分，全副牌紅點固定230分。
// ・雙連吃：同一回合「打手牌」與「翻牌堆」都吃到牌，這回合吃到的紅點分數加倍計算。
import { type Card, isRedSuit, freshDeck, shuffled } from "./cards"

export type PrpPlayer = "you" | "ai"

export interface PrpCapture {
  cards: Card[]
  doubled: boolean
}

export interface PendingChoice {
  player: PrpPlayer
  /** 這次吃牌是在「打手牌」還是「翻牌堆」步驟觸發的。 */
  source: "hand" | "flip"
  playedCard: Card
  /** 桌面上多張點數相同、可供選擇吃掉的牌（如兩張 8）。 */
  options: Card[]
}

export interface PickRedPointsState {
  table: Card[]
  hand: Record<PrpPlayer, Card[]>
  stock: Card[]
  captured: Record<PrpPlayer, PrpCapture[]>
  turn: PrpPlayer
  phase: "play" | "flip"
  /** 這一回合「打手牌」步驟是否已經吃牌成功，供翻牌步驟判斷是否觸發雙連吃。 */
  handCapturedThisTurn: boolean
  /** 海底出現兩張以上相同點數的牌時，等待玩家選擇要吃哪一張；只會發生在真人玩家身上，電腦會自動選擇。 */
  pendingChoice: PendingChoice | null
  finished: boolean
  outcome: "win" | "lose" | "draw" | null
  message: string
}

function isPip(card: Card): boolean {
  return card.rank <= 10
}

/** 找出桌面上能被這張牌吃下的所有牌（可能同時吃好幾張符合湊10／同型的牌）。 */
export function findCaptures(card: Card, table: Card[]): Card[] {
  if (isPip(card)) {
    if (card.rank === 10) {
      return table.filter((t) => isPip(t) && t.rank === 10)
    }
    const target = 10 - card.rank
    if (target < 1 || target > 9) return []
    return table.filter((t) => isPip(t) && t.rank === target)
  }
  // 皮牌（J/Q/K）只能跟同牌型的皮牌對碰
  return table.filter((t) => !isPip(t) && t.rank === card.rank)
}

export function cardPoints(card: Card): number {
  if (!isRedSuit(card.suit)) return 0
  if (card.rank === 1) return 20
  if (card.rank >= 9) return 10
  return card.rank
}

export function totalPoints(captures: PrpCapture[]): number {
  return captures.reduce((sum, cap) => {
    const base = cap.cards.reduce((s, c) => s + cardPoints(c), 0)
    return sum + (cap.doubled ? base * 2 : base)
  }, 0)
}

export function dealPickRedPoints(): PickRedPointsState {
  const deck = shuffled(freshDeck())
  const table = deck.slice(0, 4)
  const you = deck.slice(4, 11)
  const ai = deck.slice(11, 18)
  const stock = deck.slice(18)
  return {
    table,
    hand: { you, ai },
    stock,
    captured: { you: [], ai: [] },
    turn: "you",
    phase: "play",
    handCapturedThisTurn: false,
    pendingChoice: null,
    finished: false,
    outcome: null,
    message: "請打出一張手牌",
  }
}

function finishIfDone(state: PickRedPointsState): PickRedPointsState {
  const noHandsLeft = state.hand.you.length === 0 && state.hand.ai.length === 0
  if (!noHandsLeft || state.stock.length > 0) return state
  const you = totalPoints(state.captured.you)
  const ai = totalPoints(state.captured.ai)
  const outcome: "win" | "lose" | "draw" = you > ai ? "win" : you < ai ? "lose" : "draw"
  return { ...state, finished: true, outcome, message: "牌局結束" }
}

/** 海底出現多張點數相同的牌時，電腦自動挑分數最高的一張；真人玩家則改由畫面請他自己選。 */
function pickBestOption(options: Card[]): Card {
  return [...options].sort((a, b) => cardPoints(b) - cardPoints(a))[0]
}

function applyHandCapture(
  state: PickRedPointsState,
  player: PrpPlayer,
  card: Card,
  matches: Card[],
  handAfter: Card[],
): PickRedPointsState {
  let table = state.table
  let captured = state.captured
  let capturedThisTurn = false
  if (matches.length > 0) {
    const matchIds = new Set(matches.map((m) => m.id))
    table = state.table.filter((t) => !matchIds.has(t.id))
    captured = { ...captured, [player]: [...captured[player], { cards: [...matches, card], doubled: false }] }
    capturedThisTurn = true
  } else {
    table = [...state.table, card]
  }

  return {
    ...state,
    table,
    captured,
    hand: { ...state.hand, [player]: handAfter },
    phase: "flip",
    handCapturedThisTurn: capturedThisTurn,
    pendingChoice: null,
    message: capturedThisTurn ? "吃牌成功！接著翻牌堆" : "沒有對應的牌，已放水。接著翻牌堆",
  }
}

/** 步驟1：打出一張手牌。 */
export function playHandCard(state: PickRedPointsState, player: PrpPlayer, card: Card): PickRedPointsState {
  if (state.finished || state.turn !== player || state.phase !== "play" || state.pendingChoice) return state
  const hand = state.hand[player]
  if (!hand.some((c) => c.id === card.id)) return state

  const matches = findCaptures(card, state.table)
  const handAfter = hand.filter((c) => c.id !== card.id)

  // 海底同時出現兩張以上相同的牌（例如兩張 8）：只能選擇吃其中一張，不能一次全吃。
  if (matches.length > 1) {
    if (player === "ai") {
      return applyHandCapture(state, player, card, [pickBestOption(matches)], handAfter)
    }
    return {
      ...state,
      hand: { ...state.hand, [player]: handAfter },
      pendingChoice: { player, source: "hand", playedCard: card, options: matches },
      message: "海底有兩張以上相同的牌，請選擇要吃哪一張",
    }
  }

  return applyHandCapture(state, player, card, matches, handAfter)
}

function applyFlipCapture(
  state: PickRedPointsState,
  player: PrpPlayer,
  flipped: Card,
  matches: Card[],
): PickRedPointsState {
  let table = state.table
  let captured = state.captured
  let doubleCapture = false
  if (matches.length > 0) {
    const matchIds = new Set(matches.map((m) => m.id))
    table = state.table.filter((t) => !matchIds.has(t.id))
    const playerCaptures = captured[player]
    let newCaptures: PrpCapture[]
    if (state.handCapturedThisTurn && playerCaptures.length > 0) {
      // 這回合「打手牌」已經吃過一次，這次翻牌又吃到：雙連吃，兩筆都加倍計分。
      doubleCapture = true
      const updatedLast: PrpCapture = { ...playerCaptures[playerCaptures.length - 1], doubled: true }
      newCaptures = [...playerCaptures.slice(0, -1), updatedLast, { cards: [...matches, flipped], doubled: true }]
    } else {
      newCaptures = [...playerCaptures, { cards: [...matches, flipped], doubled: false }]
    }
    captured = { ...captured, [player]: newCaptures }
  } else {
    table = [...state.table, flipped]
  }

  let next: PickRedPointsState = {
    ...state,
    table,
    captured,
    phase: "play",
    turn: player === "you" ? "ai" : "you",
    handCapturedThisTurn: false,
    pendingChoice: null,
    message: doubleCapture
      ? "雙連吃！這回合分數加倍！"
      : matches.length > 0
        ? "翻牌也吃到了！"
        : "翻牌沒有對應，留在桌面上",
  }
  next = finishIfDone(next)
  return runAiIfNeeded(next)
}

/** 步驟2：從牌堆翻一張牌。 */
export function flipStock(state: PickRedPointsState): PickRedPointsState {
  if (state.finished || state.phase !== "flip" || state.pendingChoice) return state
  const player = state.turn
  if (state.stock.length === 0) {
    let next: PickRedPointsState = {
      ...state,
      phase: "play",
      turn: player === "you" ? "ai" : "you",
      handCapturedThisTurn: false,
    }
    next = finishIfDone(next)
    return runAiIfNeeded(next)
  }
  const stock = [...state.stock]
  const flipped = stock.shift() as Card
  const matches = findCaptures(flipped, state.table)
  const base: PickRedPointsState = { ...state, stock }

  // 翻出的牌在海底也可能同時配到兩張以上相同的牌，同樣只能選一張。
  if (matches.length > 1) {
    if (player === "ai") {
      return applyFlipCapture(base, player, flipped, [pickBestOption(matches)])
    }
    return {
      ...base,
      pendingChoice: { player, source: "flip", playedCard: flipped, options: matches },
      message: "海底有兩張以上相同的牌，請選擇要吃哪一張",
    }
  }

  return applyFlipCapture(base, player, flipped, matches)
}

/** 真人玩家在海底有多張相同牌時，選擇其中一張來吃。 */
export function resolveChoice(state: PickRedPointsState, chosenCardId: string): PickRedPointsState {
  const pending = state.pendingChoice
  if (!pending) return state
  const chosen = pending.options.find((c) => c.id === chosenCardId)
  if (!chosen) return state
  const base: PickRedPointsState = { ...state, pendingChoice: null }
  if (pending.source === "hand") {
    return applyHandCapture(base, pending.player, pending.playedCard, [chosen], state.hand[pending.player])
  }
  return applyFlipCapture(base, pending.player, pending.playedCard, [chosen])
}

function runAiIfNeeded(state: PickRedPointsState): PickRedPointsState {
  let next = state
  let guard = 0
  while (!next.finished && next.turn === "ai" && guard < 40) {
    guard++
    if (next.phase === "play") {
      const aiHand = next.hand.ai
      if (aiHand.length === 0) {
        next = { ...next, phase: "flip" }
        continue
      }
      let bestCard = aiHand[0]
      let bestScore = -1
      for (const c of aiHand) {
        const m = findCaptures(c, next.table)
        const score = m.reduce((s, x) => s + cardPoints(x), 0) + cardPoints(c)
        if (m.length > 0 && score > bestScore) {
          bestScore = score
          bestCard = c
        }
      }
      if (bestScore < 0) {
        bestCard = [...aiHand].sort((a, b) => cardPoints(a) - cardPoints(b))[0]
      }
      next = playHandCard(next, "ai", bestCard)
    } else {
      next = flipStock(next)
    }
  }
  return next
}
