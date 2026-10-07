// 碰碰胡／傻瓜麻將：簡化版麻將。牌庫只用筒子（一筒～九筒）與七種字牌（東南西北中發白），
// 取消吃牌，只能碰或摸，手牌固定8張，胡牌條件是湊成2組刻子（或槓）+1對將牌。
export type PPTile = string // "t1".."t9" or "E","S","W","N","R","G","B"

export const PP_LABELS: Record<string, string> = {
  t1: "🀙", t2: "🀚", t3: "🀛", t4: "🀜", t5: "🀝", t6: "🀞", t7: "🀟", t8: "🀠", t9: "🀡",
  E: "🀀", S: "🀁", W: "🀂", N: "🀃", R: "🀄", G: "🀅", B: "🀆",
}

export function ppLabel(t: PPTile): string {
  return PP_LABELS[t] ?? t
}

function buildPPWall(): PPTile[] {
  const tiles: PPTile[] = []
  for (let n = 1; n <= 9; n++) for (let k = 0; k < 4; k++) tiles.push(`t${n}`)
  for (const h of ["E", "S", "W", "N", "R", "G", "B"]) for (let k = 0; k < 4; k++) tiles.push(h)
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

function sortPP(tiles: PPTile[]): PPTile[] {
  const order = ["t", "E", "S", "W", "N", "R", "G", "B"]
  return tiles.slice().sort((a, b) => {
    const sa = order.indexOf(a[0])
    const sb = order.indexOf(b[0])
    if (sa !== sb) return sa - sb
    return (Number(a.slice(1)) || 0) - (Number(b.slice(1)) || 0)
  })
}

// 8張：2組刻子（三張相同，不論手牌或已碰）+ 1對將牌
export function ppIsWinning(hand: PPTile[], melds: PPTile[][]): boolean {
  const totalTiles = hand.length + melds.reduce((s, m) => s + m.length, 0)
  if (totalTiles !== 8) return false
  if (melds.some((m) => m.length !== 3 || !m.every((t) => t === m[0]))) return false
  const meldsNeeded = 2 - melds.length
  if (meldsNeeded < 0) return false
  const counts = new Map<PPTile, number>()
  for (const t of hand) counts.set(t, (counts.get(t) ?? 0) + 1)
  const unique = Array.from(counts.keys())
  for (const pairTile of unique) {
    if ((counts.get(pairTile) ?? 0) < 2) continue
    const rest = new Map(counts)
    rest.set(pairTile, rest.get(pairTile)! - 2)
    let ok = true
    let needed = meldsNeeded
    for (const [t, c] of rest) {
      if (c === 0) continue
      if (c % 3 !== 0) {
        ok = false
        break
      }
      needed -= c / 3
    }
    if (ok && needed === 0) return true
  }
  return false
}

export interface PPPlayerState {
  name: string
  hand: PPTile[]
  melds: PPTile[][]
  isBot: boolean
}

export type PPPhase = "draw" | "discarded-wait" | "over"

export interface PPState {
  wall: PPTile[]
  players: PPPlayerState[]
  turn: number
  phase: PPPhase
  lastDiscard: PPTile | null
  lastDiscardBy: number | null
  winner: number | null
  log: string[]
}

export function ppNewGame(): PPState {
  const wall = buildPPWall()
  const players: PPPlayerState[] = [
    { name: "您", hand: sortPP(wall.splice(0, 8)), melds: [], isBot: false },
    { name: "電腦A", hand: sortPP(wall.splice(0, 8)), melds: [], isBot: true },
    { name: "電腦B", hand: sortPP(wall.splice(0, 8)), melds: [], isBot: true },
    { name: "電腦C", hand: sortPP(wall.splice(0, 8)), melds: [], isBot: true },
  ]
  return { wall, players, turn: 0, phase: "draw", lastDiscard: null, lastDiscardBy: null, winner: null, log: ["開局，請摸牌"] }
}

export function ppDraw(state: PPState): PPState {
  if (state.phase !== "draw" || state.wall.length === 0) return state
  const wall = [...state.wall]
  const tile = wall.shift()!
  const players = state.players.map((p, i) => (i === state.turn ? { ...p, hand: sortPP([...p.hand, tile]) } : p))
  if (ppIsWinning(players[state.turn].hand, players[state.turn].melds)) {
    return { ...state, wall, players, phase: "over", winner: state.turn, log: [...state.log, `${players[state.turn].name} 自摸！`] }
  }
  return { ...state, wall, players, phase: "discarded-wait", log: [...state.log, `${players[state.turn].name} 摸牌`] }
}

export function ppDiscard(state: PPState, tile: PPTile): PPState {
  if (state.phase !== "discarded-wait") return state
  const idx = state.turn
  const hand = [...state.players[idx].hand]
  const pos = hand.indexOf(tile)
  if (pos < 0) return state
  hand.splice(pos, 1)
  const players = state.players.map((p, i) => (i === idx ? { ...p, hand: sortPP(hand) } : p))
  // Check if anyone else can pong the discarded tile
  const pongable = players.some((p, i) => i !== idx && p.hand.filter((t) => t === tile).length >= 2)
  const next = (idx + 1) % 4
  return {
    ...state,
    players,
    lastDiscard: tile,
    lastDiscardBy: idx,
    turn: pongable ? idx : next,
    phase: pongable ? "discarded-wait" : "draw",
    log: [...state.log, `${players[idx].name} 打出 ${ppLabel(tile)}`],
  }
}

export function ppPong(state: PPState, playerIdx: number): PPState {
  if (!state.lastDiscard || state.lastDiscardBy === null) return state
  const tile = state.lastDiscard
  const player = state.players[playerIdx]
  if (player.hand.filter((t) => t === tile).length < 2) return state
  const hand = [...player.hand]
  hand.splice(hand.indexOf(tile), 1)
  hand.splice(hand.indexOf(tile), 1)
  const meld = [tile, tile, tile]
  const players = state.players.map((p, i) => (i === playerIdx ? { ...p, hand: sortPP(hand), melds: [...p.melds, meld] } : p))
  if (ppIsWinning(players[playerIdx].hand, players[playerIdx].melds)) {
    return { ...state, players, phase: "over", winner: playerIdx, lastDiscard: null, log: [...state.log, `${players[playerIdx].name} 碰牌胡牌！`] }
  }
  return {
    ...state,
    players,
    turn: playerIdx,
    phase: "discarded-wait",
    lastDiscard: null,
    log: [...state.log, `${players[playerIdx].name} 碰牌`],
  }
}

export function ppPassPong(state: PPState): PPState {
  if (state.lastDiscardBy === null) return state
  const next = (state.lastDiscardBy + 1) % 4
  return { ...state, turn: next, phase: "draw", lastDiscard: null, lastDiscardBy: null }
}

// Simple bot: pong if possible else discard first non-useful tile (keeps pairs/triplets, drops singles)
export function ppBotDiscardChoice(hand: PPTile[]): PPTile {
  const counts = new Map<PPTile, number>()
  for (const t of hand) counts.set(t, (counts.get(t) ?? 0) + 1)
  const singles = hand.filter((t) => counts.get(t) === 1)
  return singles[0] ?? hand[0]
}
