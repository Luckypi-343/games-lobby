// 接龍紙牌（Klondike 單人版，簡化為單張移動，不支援連續多張拖曳）。
export type Suit = 0 | 1 | 2 | 3 // 0黑桃 1紅心 2方塊 3梅花
export interface Card {
  suit: Suit
  rank: number // 1=A ... 13=K
  faceUp: boolean
  id: string
}

export const SUIT_SYMBOL = ["♠", "♥", "♦", "♣"]
export const RANK_LABEL = ["", "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]

function isRed(suit: Suit) {
  return suit === 1 || suit === 2
}

export interface SolState {
  stock: Card[]
  waste: Card[]
  foundations: Card[][] // index = suit
  tableau: Card[][]
  moves: number
  status: "playing" | "win"
}

function freshDeck(): Card[] {
  const cards: Card[] = []
  for (let s = 0; s < 4; s++) {
    for (let r = 1; r <= 13; r++) {
      cards.push({ suit: s as Suit, rank: r, faceUp: false, id: `${s}-${r}` })
    }
  }
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[cards[i], cards[j]] = [cards[j], cards[i]]
  }
  return cards
}

export function solInitial(): SolState {
  const deck = freshDeck()
  const tableau: Card[][] = [[], [], [], [], [], [], []]
  for (let col = 0; col < 7; col++) {
    for (let i = 0; i <= col; i++) {
      const card = deck.pop()!
      card.faceUp = i === col
      tableau[col].push(card)
    }
  }
  deck.forEach((c) => (c.faceUp = false))
  return {
    stock: deck,
    waste: [],
    foundations: [[], [], [], []],
    tableau,
    moves: 0,
    status: "playing",
  }
}

export function solDraw(state: SolState): SolState {
  if (state.stock.length === 0) {
    if (state.waste.length === 0) return state
    const newStock = [...state.waste].reverse().map((c) => ({ ...c, faceUp: false }))
    return { ...state, stock: newStock, waste: [], moves: state.moves + 1 }
  }
  const stock = [...state.stock]
  const card = { ...stock.pop()!, faceUp: true }
  return { ...state, stock, waste: [...state.waste, card], moves: state.moves + 1 }
}

export type PileRef = { kind: "waste" } | { kind: "foundation"; suit: Suit } | { kind: "tableau"; col: number }

function topCard(state: SolState, ref: PileRef): Card | null {
  if (ref.kind === "waste") return state.waste.at(-1) ?? null
  if (ref.kind === "foundation") return state.foundations[ref.suit].at(-1) ?? null
  return state.tableau[ref.col].at(-1) ?? null
}

export function solCanMove(state: SolState, from: PileRef, to: PileRef): boolean {
  const card = topCard(state, from)
  if (!card || !card.faceUp) return false
  if (to.kind === "foundation") {
    if (card.suit !== to.suit) return false
    const top = state.foundations[to.suit].at(-1)
    return top ? card.rank === top.rank + 1 : card.rank === 1
  }
  if (to.kind === "tableau") {
    const target = state.tableau[to.col]
    if (target.length === 0) return card.rank === 13
    const top = target.at(-1)!
    if (!top.faceUp) return false
    return isRed(top.suit) !== isRed(card.suit) && card.rank === top.rank - 1
  }
  return false
}

export function solApplyMove(state: SolState, from: PileRef, to: PileRef): SolState {
  if (!solCanMove(state, from, to)) return state
  const waste = [...state.waste]
  const foundations = state.foundations.map((f) => [...f])
  const tableau = state.tableau.map((t) => [...t])

  let card: Card
  if (from.kind === "waste") card = waste.pop()!
  else if (from.kind === "foundation") card = foundations[from.suit].pop()!
  else card = tableau[from.col].pop()!

  if (to.kind === "foundation") foundations[to.suit].push(card)
  else tableau[to.col].push(card)

  if (from.kind === "tableau") {
    const col = tableau[from.col]
    const last = col.at(-1)
    if (last && !last.faceUp) last.faceUp = true
  }

  const won = foundations.every((f) => f.length === 13)
  return { stock: state.stock, waste, foundations, tableau, moves: state.moves + 1, status: won ? "win" : "playing" }
}

export function solAutoFoundationMoves(state: SolState): { from: PileRef; to: PileRef } | null {
  const sources: PileRef[] = [{ kind: "waste" }, ...state.tableau.map((_, col) => ({ kind: "tableau" as const, col }))]
  for (const from of sources) {
    const card = topCard(state, from)
    if (!card) continue
    for (let s = 0; s < 4; s++) {
      const to: PileRef = { kind: "foundation", suit: s as Suit }
      if (solCanMove(state, from, to)) return { from, to }
    }
  }
  return null
}
