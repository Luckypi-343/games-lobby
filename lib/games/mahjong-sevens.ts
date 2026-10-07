// 麻將接龍：仿照撲克牌排七規則，改用麻將的筒子／索子／萬子三門數字牌（各門1～9，各4張，共108張）。
// 以「五筒、五索、五萬」為基準先鋪在桌上開局，玩家依序出相鄰數字接龍，無牌可出者必須蓋牌（扣分）。
export type MSSuit = "t" | "s" | "w" // 筒/索/萬
export const MS_SUIT_LABEL: Record<MSSuit, string> = { t: "筒", s: "索", w: "萬" }
export const MS_SUIT_NAME: Record<MSSuit, string> = { t: "筒子", s: "索子", w: "萬子" }

export interface MSTile {
  suit: MSSuit
  num: number // 1..9
  id: string
}

export const MS_PLAYER_NAMES = ["你", "電腦A", "電腦B", "電腦C"] as const

export interface MSTrack {
  opened: boolean
  low: number // 目前延伸到的最小數字（開局即為5）
  high: number // 目前延伸到的最大數字（開局即為5）
}

export interface MSState {
  hands: MSTile[][]
  covered: MSTile[][]
  tracks: Record<MSSuit, MSTrack>
  turn: number
  finished: boolean[]
  log: string[]
  status: "playing" | "over"
}

function buildMSDeck(): MSTile[] {
  const tiles: MSTile[] = []
  let id = 0
  for (const suit of ["t", "s", "w"] as MSSuit[]) {
    for (let n = 1; n <= 9; n++) {
      for (let k = 0; k < 4; k++) tiles.push({ suit, num: n, id: `${suit}${n}-${id++}` })
    }
  }
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

export function msLabel(t: MSTile): string {
  return `${t.num}${MS_SUIT_LABEL[t.suit]}`
}

export function msDeal(): MSState {
  const deck = buildMSDeck()
  const hands: MSTile[][] = [[], [], [], []]
  deck.forEach((c, i) => hands[i % 4].push(c))
  hands.forEach((h) => h.sort((a, b) => a.suit.localeCompare(b.suit) || a.num - b.num))
  // 五筒自動視為開局基準：持有5筒者優先開局
  const starter = hands.findIndex((h) => h.some((c) => c.suit === "t" && c.num === 5))
  return {
    hands,
    covered: [[], [], [], []],
    tracks: {
      t: { opened: false, low: 6, high: 4 },
      s: { opened: false, low: 6, high: 4 },
      w: { opened: false, low: 6, high: 4 },
    },
    turn: starter >= 0 ? starter : 0,
    finished: [false, false, false, false],
    log: [`以五筒、五索、五萬為基準開局，${MS_PLAYER_NAMES[starter >= 0 ? starter : 0]} 優先出牌`],
    status: "playing",
  }
}

export function msIsPlayable(state: MSState, tile: MSTile): boolean {
  const track = state.tracks[tile.suit]
  if (tile.num === 5) return !track.opened
  if (!track.opened) return false
  if (tile.num === track.low - 1) return true
  if (tile.num === track.high + 1) return true
  return false
}

export function msPlayableTiles(state: MSState, seat: number): MSTile[] {
  return state.hands[seat].filter((t) => msIsPlayable(state, t))
}

function msNextSeat(state: MSState, from: number): number {
  let i = from
  for (let step = 0; step < 4; step++) {
    i = (i + 1) % 4
    if (!state.finished[i]) return i
  }
  return from
}

function msCheckFinished(state: MSState, seat: number) {
  if (state.hands[seat].length === 0) state.finished[seat] = true
}

function msCheckOver(state: MSState) {
  if (state.finished.every(Boolean)) state.status = "over"
}

export function msPlayTile(state: MSState, seat: number, tile: MSTile): MSState {
  if (state.status !== "playing" || state.turn !== seat) return state
  if (!msIsPlayable(state, tile)) return state
  const next: MSState = JSON.parse(JSON.stringify(state))
  const hand = next.hands[seat]
  const idx = hand.findIndex((t) => t.id === tile.id)
  if (idx < 0) return state
  hand.splice(idx, 1)
  const track = next.tracks[tile.suit]
  if (tile.num === 5) {
    track.opened = true
    track.low = 5
    track.high = 5
  } else if (tile.num === track.low - 1) {
    track.low = tile.num
  } else {
    track.high = tile.num
  }
  next.log = [`${MS_PLAYER_NAMES[seat]} 打出 ${msLabel(tile)}`, ...next.log].slice(0, 20)
  msCheckFinished(next, seat)
  next.turn = msNextSeat(next, seat)
  msCheckOver(next)
  return next
}

export function msCoverTile(state: MSState, seat: number, tile: MSTile): MSState {
  if (state.status !== "playing" || state.turn !== seat) return state
  if (msPlayableTiles(state, seat).length > 0) return state
  const next: MSState = JSON.parse(JSON.stringify(state))
  const hand = next.hands[seat]
  const idx = hand.findIndex((t) => t.id === tile.id)
  if (idx < 0) return state
  hand.splice(idx, 1)
  next.covered[seat].push(tile)
  next.log = [`${MS_PLAYER_NAMES[seat]} 無牌可接，蓋下一張牌`, ...next.log].slice(0, 20)
  msCheckFinished(next, seat)
  next.turn = msNextSeat(next, seat)
  msCheckOver(next)
  return next
}

export function msBotAct(state: MSState, seat: number): MSState {
  const options = msPlayableTiles(state, seat)
  if (options.length > 0) {
    const sorted = [...options].sort((a, b) => {
      if (a.num === 5 && b.num !== 5) return -1
      if (b.num === 5 && a.num !== 5) return 1
      return a.num - b.num
    })
    return msPlayTile(state, seat, sorted[0])
  }
  const hand = state.hands[seat]
  if (hand.length === 0) return state
  const sorted = [...hand].sort((a, b) => a.num - b.num)
  return msCoverTile(state, seat, sorted[0])
}

export interface MSScoreRow {
  seat: number
  name: string
  coveredCount: number
  points: number
  perfect: boolean
}

export function msScore(state: MSState): MSScoreRow[] {
  return state.covered.map((tiles, seat) => {
    const points = tiles.reduce((s, t) => s + t.num, 0)
    return { seat, name: MS_PLAYER_NAMES[seat], coveredCount: tiles.length, points, perfect: tiles.length === 0 }
  })
}
