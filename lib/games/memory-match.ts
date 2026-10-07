export const MM_SYMBOLS = ["🀄", "🀅", "🀆", "🀇", "🀐", "🀙", "🐉", "🀀"]

export interface MmCard {
  symbol: string
  matched: boolean
}

export interface MmState {
  cards: MmCard[]
  flipped: number[] // currently revealed, unmatched indices (max 2)
  moves: number
  matchedCount: number
}

export function mmNew(): MmState {
  const pairs = [...MM_SYMBOLS, ...MM_SYMBOLS]
  for (let i = pairs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pairs[i], pairs[j]] = [pairs[j], pairs[i]]
  }
  return {
    cards: pairs.map((symbol) => ({ symbol, matched: false })),
    flipped: [],
    moves: 0,
    matchedCount: 0,
  }
}

export function mmFlip(state: MmState, index: number): MmState {
  if (state.cards[index].matched) return state
  if (state.flipped.includes(index)) return state
  if (state.flipped.length >= 2) return state

  const flipped = [...state.flipped, index]
  if (flipped.length < 2) {
    return { ...state, flipped }
  }

  const [a, b] = flipped
  const isMatch = state.cards[a].symbol === state.cards[b].symbol
  const moves = state.moves + 1

  if (isMatch) {
    const cards = state.cards.map((c, i) => (i === a || i === b ? { ...c, matched: true } : c))
    return { cards, flipped: [], moves, matchedCount: state.matchedCount + 1 }
  }

  return { ...state, flipped, moves }
}

export function mmClearFlip(state: MmState): MmState {
  return { ...state, flipped: [] }
}

export function mmIsSolved(state: MmState): boolean {
  return state.matchedCount === MM_SYMBOLS.length
}
