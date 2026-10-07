// 排序方塊 — 依照數字由小到大依序點擊，考驗反應與專注力。
export interface SeqState {
  tiles: number[]
  cleared: boolean[]
  next: number
  mistakes: number
  done: boolean
  startedAt: number
}

export const SEQ_SIZE = 16

export function ssNew(size: number = SEQ_SIZE): SeqState {
  const tiles = Array.from({ length: size }, (_, i) => i + 1)
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return {
    tiles,
    cleared: Array(size).fill(false),
    next: 1,
    mistakes: 0,
    done: false,
    startedAt: Date.now(),
  }
}

export function ssTap(state: SeqState, index: number): { state: SeqState; correct: boolean } {
  if (state.done || state.cleared[index]) return { state, correct: true }
  if (state.tiles[index] !== state.next) {
    return { state: { ...state, mistakes: state.mistakes + 1 }, correct: false }
  }
  const cleared = [...state.cleared]
  cleared[index] = true
  const next = state.next + 1
  const done = next > state.tiles.length
  return { state: { ...state, cleared, next, done }, correct: true }
}
