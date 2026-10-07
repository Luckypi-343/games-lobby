// 河內塔 — 3 根柱子，把整疊圓盤從左邊移到右邊，每次只能移動最上方的一個圓盤，且不能把大盤疊在小盤上。
export const HN_DISKS = 4

export interface HnState {
  pegs: number[][] // 每根柱子由下到大排列，陣列最後一個是最上面（最小可移動）的盤
  moves: number
  won: boolean
}

export function hnNew(n: number = HN_DISKS): HnState {
  const first = Array.from({ length: n }, (_, i) => n - i)
  return { pegs: [first, [], []], moves: 0, won: false }
}

export function hnCanMove(state: HnState, from: number, to: number): boolean {
  if (from === to) return false
  const src = state.pegs[from]
  if (src.length === 0) return false
  const disk = src[src.length - 1]
  const dst = state.pegs[to]
  if (dst.length === 0) return true
  return dst[dst.length - 1] > disk
}

export function hnMove(state: HnState, from: number, to: number): HnState {
  if (state.won || !hnCanMove(state, from, to)) return state
  const pegs = state.pegs.map((p) => [...p])
  const disk = pegs[from].pop()!
  pegs[to].push(disk)
  const won = pegs[2].length === state.pegs[0].length + state.pegs[1].length + state.pegs[2].length
  return { pegs, moves: state.moves + 1, won }
}

export function hnMinMoves(n: number = HN_DISKS): number {
  return 2 ** n - 1
}
