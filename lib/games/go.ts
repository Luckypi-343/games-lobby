export const GO_SIZE = 19
export type GOCell = 0 | 1 | 2 // 0 empty, 1 black, 2 white

export interface GOState {
  board: GOCell[]
  turn: 1 | 2
  passes: number
  captures: { 1: number; 2: number }
  status: "playing" | "over"
  lastCapturedCount: number
  history: string[]
}

export function goEmpty(): GOState {
  return {
    board: Array(GO_SIZE * GO_SIZE).fill(0) as GOCell[],
    turn: 1,
    passes: 0,
    captures: { 1: 0, 2: 0 },
    status: "playing",
    lastCapturedCount: 0,
    history: [],
  }
}

function neighbors(i: number): number[] {
  const r = Math.floor(i / GO_SIZE)
  const c = i % GO_SIZE
  const out: number[] = []
  if (r > 0) out.push(i - GO_SIZE)
  if (r < GO_SIZE - 1) out.push(i + GO_SIZE)
  if (c > 0) out.push(i - 1)
  if (c < GO_SIZE - 1) out.push(i + 1)
  return out
}

function groupOf(board: GOCell[], start: number): { group: number[]; liberties: number } {
  const color = board[start]
  const seen = new Set<number>([start])
  const stack = [start]
  const group: number[] = []
  const libs = new Set<number>()
  while (stack.length) {
    const cur = stack.pop()!
    group.push(cur)
    for (const n of neighbors(cur)) {
      if (board[n] === 0) libs.add(n)
      else if (board[n] === color && !seen.has(n)) {
        seen.add(n)
        stack.push(n)
      }
    }
  }
  return { group, liberties: libs.size }
}

export function goBoardKey(board: GOCell[]): string {
  return board.join("")
}

export function goLegalMoves(state: GOState): number[] {
  const moves: number[] = []
  for (let i = 0; i < state.board.length; i++) {
    if (state.board[i] === 0 && goTryMove(state, i)) moves.push(i)
  }
  return moves
}

function simulate(board: GOCell[], turn: 1 | 2, index: number): { board: GOCell[]; captured: number } | null {
  if (board[index] !== 0) return null
  const opponent: GOCell = turn === 1 ? 2 : 1
  const next = board.slice()
  next[index] = turn
  let captured = 0
  for (const n of neighbors(index)) {
    if (next[n] === opponent) {
      const { group, liberties } = groupOf(next, n)
      if (liberties === 0) {
        for (const g of group) next[g] = 0
        captured += group.length
      }
    }
  }
  const { liberties: selfLibs } = groupOf(next, index)
  if (selfLibs === 0) return null // suicide, illegal
  return { board: next, captured }
}

export function goTryMove(state: GOState, index: number): { board: GOCell[]; captured: number } | null {
  const result = simulate(state.board, state.turn, index)
  if (!result) return null
  const key = goBoardKey(result.board)
  if (state.history.includes(key)) return null // simple ko / repetition guard
  return result
}

export function goMove(state: GOState, index: number): GOState {
  const result = goTryMove(state, index)
  if (!result) return state
  const nextHistory = [...state.history.slice(-6), goBoardKey(state.board)]
  return {
    ...state,
    board: result.board,
    turn: state.turn === 1 ? 2 : 1,
    passes: 0,
    captures: { ...state.captures, [state.turn]: state.captures[state.turn] + result.captured },
    lastCapturedCount: result.captured,
    history: nextHistory,
  }
}

export function goPass(state: GOState): GOState {
  const passes = state.passes + 1
  return {
    ...state,
    turn: state.turn === 1 ? 2 : 1,
    passes,
    status: passes >= 2 ? "over" : "playing",
  }
}

export function goScore(state: GOState): { 1: number; 2: number } {
  const board = state.board
  const visited = new Array(board.length).fill(false)
  const territory: { 1: number; 2: number } = { 1: 0, 2: 0 }
  const stones: { 1: number; 2: number } = { 1: 0, 2: 0 }
  for (let i = 0; i < board.length; i++) {
    if (board[i] === 1) stones[1]++
    else if (board[i] === 2) stones[2]++
  }
  for (let i = 0; i < board.length; i++) {
    if (board[i] !== 0 || visited[i]) continue
    const stack = [i]
    const region: number[] = []
    const seen = new Set<number>([i])
    const borderColors = new Set<GOCell>()
    while (stack.length) {
      const cur = stack.pop()!
      region.push(cur)
      visited[cur] = true
      for (const n of neighbors(cur)) {
        if (board[n] === 0) {
          if (!seen.has(n)) {
            seen.add(n)
            stack.push(n)
          }
        } else {
          borderColors.add(board[n])
        }
      }
    }
    if (borderColors.size === 1) {
      const owner = [...borderColors][0] as 1 | 2
      territory[owner] += region.length
    }
  }
  return {
    1: stones[1] + territory[1] + state.captures[1],
    2: stones[2] + territory[2] + state.captures[2] + 7.5, // white gets a small komi bonus
  }
}

export function goAiMove(state: GOState): number | "pass" {
  const legal = goLegalMoves(state)
  if (legal.length === 0) return "pass"
  const opponent: GOCell = state.turn === 1 ? 2 : 1

  let best: number | null = null
  let bestScore = -Infinity
  const sample = legal.length > 90 ? sampleArray(legal, 90) : legal
  for (const move of sample) {
    const result = simulate(state.board, state.turn, move)
    if (!result) continue
    let score = result.captured * 8
    const r = Math.floor(move / GO_SIZE)
    const c = move % GO_SIZE
    const edgeDist = Math.min(r, c, GO_SIZE - 1 - r, GO_SIZE - 1 - c)
    score += edgeDist >= 1 && edgeDist <= 4 ? 3 : edgeDist === 0 ? -2 : 1
    for (const n of neighbors(move)) {
      if (result.board[n] === opponent) score += 1
      if (result.board[n] === state.turn) score += 0.5
    }
    score += Math.random() * 2
    if (score > bestScore) {
      bestScore = score
      best = move
    }
  }
  return best ?? "pass"
}

function sampleArray<T>(arr: T[], n: number): T[] {
  const copy = arr.slice()
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy.slice(0, n)
}
