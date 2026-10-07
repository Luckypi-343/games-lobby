export type MJSuit = "w" | "t" | "s"
export type MJHonor = "E" | "S" | "W" | "N" | "R" | "G" | "B"
export type MJFlower = "f1" | "f2" | "f3" | "f4" | "f5" | "f6" | "f7" | "f8"
export type MJTile = `${MJSuit}${number}` | MJHonor | MJFlower

export const MJ_LABELS: Record<string, string> = {
  w1: "一萬", w2: "二萬", w3: "三萬", w4: "四萬", w5: "五萬", w6: "六萬", w7: "七萬", w8: "八萬", w9: "九萬",
  t1: "🀙", t2: "🀚", t3: "🀛", t4: "🀜", t5: "🀝", t6: "🀞", t7: "🀟", t8: "🀠", t9: "🀡",
  s1: "🀐", s2: "🀑", s3: "🀒", s4: "🀓", s5: "🀔", s6: "🀕", s7: "🀖", s8: "🀗", s9: "🀘",
  E: "🀀", S: "🀁", W: "🀂", N: "🀃", R: "🀄", G: "🀅", B: "🀆",
  f1: "🀢", f2: "🀣", f3: "🀤", f4: "🀥", f5: "🀦", f6: "🀧", f7: "🀨", f8: "🀩",
}

export function isFlowerTile(tile: MJTile): boolean {
  return typeof tile === "string" && tile.startsWith("f")
}

export function buildWall(): MJTile[] {
  const tiles: MJTile[] = []
  for (const suit of ["w", "t", "s"] as MJSuit[]) {
    for (let n = 1; n <= 9; n++) {
      for (let k = 0; k < 4; k++) tiles.push(`${suit}${n}` as MJTile)
    }
  }
  for (const h of ["E", "S", "W", "N", "R", "G", "B"] as MJHonor[]) {
    for (let k = 0; k < 4; k++) tiles.push(h)
  }
  for (let n = 1; n <= 8; n++) tiles.push(`f${n}` as MJTile)
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

// Draws one playable tile from the wall, setting aside any flower tiles it encounters
// (into `flowersOut`) and drawing again to replace them, per standard flower-tile rules.
function drawSkippingFlowers(wall: MJTile[], flowersOut: MJTile[]): MJTile | undefined {
  while (wall.length > 0) {
    const t = wall.shift()!
    if (isFlowerTile(t)) {
      flowersOut.push(t)
      continue
    }
    return t
  }
  return undefined
}

function sortTiles(tiles: MJTile[]): MJTile[] {
  const order = ["w", "t", "s", "E", "S", "W", "N", "R", "G", "B"]
  return tiles.slice().sort((a, b) => {
    const sa = order.indexOf(a[0])
    const sb = order.indexOf(b[0])
    if (sa !== sb) return sa - sb
    return (Number(a.slice(1)) || 0) - (Number(b.slice(1)) || 0)
  })
}

function countMap(tiles: MJTile[]): Map<MJTile, number> {
  const m = new Map<MJTile, number>()
  for (const t of tiles) m.set(t, (m.get(t) ?? 0) + 1)
  return m
}

function canFormMelds(counts: Map<MJTile, number>, meldsNeeded: number): boolean {
  if (meldsNeeded === 0) return Array.from(counts.values()).every((v) => v === 0)
  let first: MJTile | null = null
  for (const [t, c] of counts) {
    if (c > 0) {
      first = t
      break
    }
  }
  if (!first) return meldsNeeded === 0
  if ((counts.get(first) ?? 0) >= 3) {
    counts.set(first, counts.get(first)! - 3)
    if (canFormMelds(counts, meldsNeeded - 1)) {
      counts.set(first, counts.get(first)! + 3)
      return true
    }
    counts.set(first, counts.get(first)! + 3)
  }
  const suit = first[0]
  if (suit === "w" || suit === "t" || suit === "s") {
    const n = Number(first.slice(1))
    if (n <= 7) {
      const t2 = `${suit}${n + 1}` as MJTile
      const t3 = `${suit}${n + 2}` as MJTile
      if ((counts.get(t2) ?? 0) > 0 && (counts.get(t3) ?? 0) > 0) {
        counts.set(first, counts.get(first)! - 1)
        counts.set(t2, counts.get(t2)! - 1)
        counts.set(t3, counts.get(t3)! - 1)
        if (canFormMelds(counts, meldsNeeded - 1)) {
          counts.set(first, counts.get(first)! + 1)
          counts.set(t2, counts.get(t2)! + 1)
          counts.set(t3, counts.get(t3)! + 1)
          return true
        }
        counts.set(first, counts.get(first)! + 1)
        counts.set(t2, counts.get(t2)! + 1)
        counts.set(t3, counts.get(t3)! + 1)
      }
    }
  }
  return false
}

export function isWinningHand(tiles: MJTile[]): boolean {
  if (tiles.length % 3 !== 2) return false
  const meldsNeeded = (tiles.length - 2) / 3
  const counts = countMap(tiles)
  const unique = Array.from(counts.keys())
  for (const t of unique) {
    if ((counts.get(t) ?? 0) >= 2) {
      counts.set(t, counts.get(t)! - 2)
      if (canFormMelds(new Map(counts), meldsNeeded)) {
        counts.set(t, counts.get(t)! + 2)
        return true
      }
      counts.set(t, counts.get(t)! + 2)
    }
  }
  return false
}

export function canPong(hand: MJTile[], tile: MJTile): boolean {
  return hand.filter((t) => t === tile).length >= 2
}
export function canKong(hand: MJTile[], tile: MJTile): boolean {
  return hand.filter((t) => t === tile).length >= 3
}
export function canChow(hand: MJTile[], tile: MJTile): [MJTile, MJTile][] {
  const suit = tile[0]
  if (suit !== "w" && suit !== "t" && suit !== "s") return []
  const n = Number(tile.slice(1))
  const has = (x: number) => hand.includes(`${suit}${x}` as MJTile)
  const options: [MJTile, MJTile][] = []
  if (n >= 3 && has(n - 1) && has(n - 2)) options.push([`${suit}${n - 2}` as MJTile, `${suit}${n - 1}` as MJTile])
  if (n >= 2 && n <= 8 && has(n - 1) && has(n + 1)) options.push([`${suit}${n - 1}` as MJTile, `${suit}${n + 1}` as MJTile])
  if (n <= 7 && has(n + 1) && has(n + 2)) options.push([`${suit}${n + 1}` as MJTile, `${suit}${n + 2}` as MJTile])
  return options
}

export interface MJMeld {
  type: "pong" | "kong" | "chow"
  tiles: MJTile[]
}

export interface MJPlayer {
  seat: number
  name: string
  isYou: boolean
  hand: MJTile[]
  melds: MJMeld[]
  discards: MJTile[]
  flowers: MJTile[]
}

export interface MJState {
  players: MJPlayer[]
  wall: MJTile[]
  turn: number
  drawn: MJTile | null
  lastDiscard: { seat: number; tile: MJTile } | null
  phase: "draw" | "discard" | "claim" | "over"
  claimOptions: { seat: number; pong: boolean; kong: boolean; chow: [MJTile, MJTile][]; hu: boolean }[]
  winner: number | null
  log: string
}

const NAMES = ["您", "東家阿福", "南家阿珠", "西家阿明"]

export function mjInitial(): MJState {
  const wall = buildWall()
  const flowersBySeat: MJTile[][] = [[], [], [], []]
  const handsBySeat: MJTile[][] = [[], [], [], []]
  for (let seat = 0; seat < 4; seat++) {
    for (let k = 0; k < 13; k++) {
      const t = drawSkippingFlowers(wall, flowersBySeat[seat])
      if (t !== undefined) handsBySeat[seat].push(t)
    }
  }
  const players: MJPlayer[] = NAMES.map((name, seat) => ({
    seat,
    name,
    isYou: seat === 0,
    hand: sortTiles(handsBySeat[seat]),
    melds: [],
    discards: [],
    flowers: flowersBySeat[seat],
  }))
  const firstDraw = drawSkippingFlowers(wall, flowersBySeat[0])
  if (firstDraw !== undefined) {
    players[0].hand = sortTiles([...players[0].hand, firstDraw])
  }
  return {
    players,
    wall,
    turn: 0,
    drawn: firstDraw ?? null,
    lastDiscard: null,
    phase: "discard",
    claimOptions: [],
    winner: null,
    log: "開局！您摸牌，請選擇要打出的牌。",
  }
}

export function mjDraw(state: MJState): MJState {
  if (state.wall.length === 0) {
    return { ...state, phase: "over", log: "牌牆已空，本局流局。" }
  }
  const wall = state.wall.slice()
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const flowers = p.flowers.slice()
  const tile = drawSkippingFlowers(wall, flowers)
  p.flowers = flowers
  if (tile === undefined) {
    players[state.turn] = p
    return { ...state, wall, players, phase: "over", log: "牌牆已空，本局流局。" }
  }
  p.hand = sortTiles([...p.hand, tile])
  players[state.turn] = p
  const selfWin = isWinningHand(p.hand)
  return {
    ...state,
    wall,
    players,
    drawn: tile,
    phase: "discard",
    log: `${p.name}摸牌${selfWin ? "，可以胡牌！" : ""}`,
  }
}

// Player claims a self-drawn win (自摸) on their own turn, outside the claim-on-discard flow.
export function mjSelfHu(state: MJState): MJState {
  if (state.phase !== "discard") return state
  const p = state.players[state.turn]
  if (!isWinningHand(p.hand)) return state
  return { ...state, phase: "over", winner: state.turn, log: `${p.name}自摸胡牌！` }
}

// Tiles that would complete the given hand if drawn/claimed next — used for the "聽" hint.
export function mjWaitingTiles(hand: MJTile[]): MJTile[] {
  const candidates = Object.keys(MJ_LABELS).filter((t) => !isFlowerTile(t as MJTile)) as MJTile[]
  return candidates.filter((t) => isWinningHand([...hand, t]))
}

export function mjDiscard(state: MJState, tile: MJTile): MJState {
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const i = p.hand.indexOf(tile)
  if (i === -1) return state
  p.hand = p.hand.slice()
  p.hand.splice(i, 1)
  p.discards = [...p.discards, tile]
  players[state.turn] = p

  const claimOptions: MJState["claimOptions"] = []
  for (const other of players) {
    if (other.seat === state.turn) continue
    const hu = isWinningHand([...other.hand, tile])
    const pong = canPong(other.hand, tile)
    const kong = canKong(other.hand, tile)
    const isNext = other.seat === (state.turn + 1) % 4
    const chow = isNext ? canChow(other.hand, tile) : []
    if (hu || pong || kong || chow.length > 0) {
      claimOptions.push({ seat: other.seat, pong, kong, chow, hu })
    }
  }

  const nextState: MJState = {
    ...state,
    players,
    lastDiscard: { seat: state.turn, tile },
    drawn: null,
    claimOptions,
    phase: claimOptions.length > 0 ? "claim" : "draw",
    turn: claimOptions.length > 0 ? state.turn : (state.turn + 1) % 4,
    log: `${p.name}打出 ${MJ_LABELS[tile] ?? tile}`,
  }
  return nextState
}

export function mjResolveClaim(
  state: MJState,
  seat: number,
  action: "hu" | "pong" | "kong" | "chow" | "pass",
  chowPair?: [MJTile, MJTile],
): MJState {
  if (!state.lastDiscard) return state
  const { tile, seat: fromSeat } = state.lastDiscard
  const players = state.players.slice()
  const claimant = { ...players[seat] }

  if (action === "hu") {
    return { ...state, phase: "over", winner: seat, log: `${claimant.name}胡牌！` }
  }
  if (action === "pass") {
    const remaining = state.claimOptions.filter((c) => c.seat !== seat)
    if (remaining.length > 0) {
      return { ...state, claimOptions: remaining, log: `${claimant.name}選擇過牌。` }
    }
    return {
      ...state,
      claimOptions: [],
      phase: "draw",
      turn: (fromSeat + 1) % 4,
      log: "無人吃碰槓，繼續摸牌。",
    }
  }

  const discarder = { ...players[fromSeat] }
  discarder.discards = discarder.discards.slice(0, -1)
  players[fromSeat] = discarder

  if (action === "pong") {
    const hand = claimant.hand.slice()
    for (let k = 0; k < 2; k++) hand.splice(hand.indexOf(tile), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "pong", tiles: [tile, tile, tile] }]
    players[seat] = claimant
    return {
      ...state,
      players,
      turn: seat,
      claimOptions: [],
      phase: "discard",
      drawn: null,
      log: `${claimant.name}碰！`,
    }
  }
  if (action === "kong") {
    const hand = claimant.hand.slice()
    for (let k = 0; k < 3; k++) hand.splice(hand.indexOf(tile), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "kong", tiles: [tile, tile, tile, tile] }]
    const wall = state.wall.slice()
    const extra = wall.shift()
    if (extra) claimant.hand = sortTiles([...claimant.hand, extra])
    players[seat] = claimant
    return {
      ...state,
      players,
      wall,
      turn: seat,
      claimOptions: [],
      phase: "discard",
      drawn: extra ?? null,
      log: `${claimant.name}槓！補牌一張。`,
    }
  }
  if (action === "chow" && chowPair) {
    const hand = claimant.hand.slice()
    hand.splice(hand.indexOf(chowPair[0]), 1)
    hand.splice(hand.indexOf(chowPair[1]), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "chow", tiles: sortTiles([tile, ...chowPair]) }]
    players[seat] = claimant
    return {
      ...state,
      players,
      turn: seat,
      claimOptions: [],
      phase: "discard",
      drawn: null,
      log: `${claimant.name}吃！`,
    }
  }
  return state
}

export function mjBotChoice(state: MJState, seat: number): { action: "hu" | "pong" | "kong" | "chow" | "pass"; chowPair?: [MJTile, MJTile] } {
  const opt = state.claimOptions.find((o) => o.seat === seat)
  if (!opt) return { action: "pass" }
  if (opt.hu) return { action: "hu" }
  if (opt.kong) return { action: "kong" }
  if (opt.pong) return { action: "pong" }
  if (opt.chow.length > 0 && Math.random() > 0.4) return { action: "chow", chowPair: opt.chow[0] }
  return { action: "pass" }
}

export function mjBotDiscard(hand: MJTile[]): MJTile {
  const counts = countMap(hand)
  const isolated = hand.filter((t) => {
    if (counts.get(t)! >= 2) return false
    const suit = t[0]
    if (suit !== "w" && suit !== "t" && suit !== "s") return true
    const n = Number(t.slice(1))
    const near = [n - 2, n - 1, n + 1, n + 2].some((x) => x >= 1 && x <= 9 && (counts.get(`${suit}${x}` as MJTile) ?? 0) > 0)
    return !near
  })
  const pool = isolated.length > 0 ? isolated : hand
  return pool[Math.floor(Math.random() * pool.length)]
}
