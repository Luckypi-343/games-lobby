// 馬來西亞三聯麻將（三人麻將）：僅 3 人對戰，牌庫移除索子、萬子，只保留筒子、字牌、花牌，
// 並加入「飛牌」（萬能牌，可代表任何一張牌湊成任意組合），因牌數少、花牌多，容易湊出大牌。
import { isWinningHand, canPong, canKong, canChow, MJ_LABELS, type MJTile, type MJMeld } from "@/lib/games/mahjong"

export type MWTile = MJTile | "JK"

const WILD_CANDIDATES: MJTile[] = [
  "t1", "t2", "t3", "t4", "t5", "t6", "t7", "t8", "t9",
  "E", "S", "W", "N", "R", "G", "B",
]

export const MW_LABELS: Record<string, string> = { ...MJ_LABELS, JK: "🀄✨" }
export function mwLabel(t: MWTile): string {
  return t === "JK" ? "飛" : (MJ_LABELS[t] ?? t)
}

function isFlowerTile(tile: MWTile): boolean {
  return typeof tile === "string" && tile.startsWith("f")
}

function buildMalaysiaWall(): MWTile[] {
  const tiles: MWTile[] = []
  for (let n = 1; n <= 9; n++) {
    for (let k = 0; k < 4; k++) tiles.push(`t${n}` as MWTile)
  }
  for (const h of ["E", "S", "W", "N", "R", "G", "B"] as const) {
    for (let k = 0; k < 4; k++) tiles.push(h)
  }
  for (let n = 1; n <= 8; n++) tiles.push(`f${n}` as MWTile)
  for (let k = 0; k < 4; k++) tiles.push("JK")
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

function drawSkippingFlowers(wall: MWTile[], flowersOut: MWTile[]): MWTile | undefined {
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

function sortTiles(tiles: MWTile[]): MWTile[] {
  const order = ["t", "E", "S", "W", "N", "R", "G", "B", "JK"]
  return tiles.slice().sort((a, b) => {
    const sa = order.indexOf(a === "JK" ? "JK" : a[0])
    const sb = order.indexOf(b === "JK" ? "JK" : b[0])
    if (sa !== sb) return sa - sb
    return (Number(a.slice(1)) || 0) - (Number(b.slice(1)) || 0)
  })
}

// 計算手牌中有幾張飛牌（萬能牌），並嘗試用候選牌替換後檢查能否胡牌。
export function mwIsWinningHand(tiles: MWTile[]): boolean {
  const wilds = tiles.filter((t) => t === "JK").length
  const rest = tiles.filter((t) => t !== "JK") as MJTile[]
  return trySubstitute(rest, wilds)
}

function trySubstitute(hand: MJTile[], wildsLeft: number): boolean {
  if (wildsLeft === 0) return isWinningHand(hand)
  if (wildsLeft > 4) return false // 避免極端情況下組合爆炸
  for (const c of WILD_CANDIDATES) {
    if (trySubstitute([...hand, c], wildsLeft - 1)) return true
  }
  return false
}

export function mwIsAllHonors(tiles: MWTile[]): boolean {
  return tiles.every((t) => t === "JK" || ["E", "S", "W", "N", "R", "G", "B"].includes(t as string))
}

export interface MWPlayer {
  seat: number
  name: string
  isYou: boolean
  hand: MWTile[]
  melds: MJMeld[]
  discards: MWTile[]
  flowers: MWTile[]
}

export interface MWState {
  players: MWPlayer[]
  wall: MWTile[]
  turn: number
  drawn: MWTile | null
  lastDiscard: { seat: number; tile: MWTile } | null
  phase: "draw" | "discard" | "claim" | "over"
  claimOptions: { seat: number; pong: boolean; kong: boolean; chow: [MWTile, MWTile][]; hu: boolean }[]
  winner: number | null
  log: string
}

const NAMES = ["您", "東家阿吉", "西家阿蓮"]

export function mwInitial(): MWState {
  const wall = buildMalaysiaWall()
  const flowersBySeat: MWTile[][] = [[], [], []]
  const handsBySeat: MWTile[][] = [[], [], []]
  for (let seat = 0; seat < 3; seat++) {
    for (let k = 0; k < 13; k++) {
      const t = drawSkippingFlowers(wall, flowersBySeat[seat])
      if (t !== undefined) handsBySeat[seat].push(t)
    }
  }
  const players: MWPlayer[] = NAMES.map((name, seat) => ({
    seat,
    name,
    isYou: seat === 0,
    hand: sortTiles(handsBySeat[seat]),
    melds: [],
    discards: [],
    flowers: flowersBySeat[seat],
  }))
  const firstDraw = drawSkippingFlowers(wall, players[0].flowers)
  if (firstDraw !== undefined) players[0].hand = sortTiles([...players[0].hand, firstDraw])
  return {
    players,
    wall,
    turn: 0,
    drawn: firstDraw ?? null,
    lastDiscard: null,
    phase: "discard",
    claimOptions: [],
    winner: null,
    log: "開局！牌庫只有筒子、字牌、花牌與飛牌（萬能牌），您摸牌，請選擇要打出的牌。",
  }
}

export function mwDraw(state: MWState): MWState {
  if (state.wall.length === 0) return { ...state, phase: "over", log: "牌牆已空，本局流局。" }
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
  const selfWin = mwIsWinningHand(p.hand)
  return { ...state, wall, players, drawn: tile, phase: "discard", log: `${p.name}摸牌${selfWin ? "，可以胡牌！" : ""}` }
}

export function mwSelfHu(state: MWState): MWState {
  if (state.phase !== "discard") return state
  const p = state.players[state.turn]
  if (!mwIsWinningHand(p.hand)) return state
  const bonus = mwIsAllHonors(p.hand) ? "（字一色，大牌！）" : ""
  return { ...state, phase: "over", winner: state.turn, log: `${p.name}自摸胡牌！${bonus}` }
}

export function mwDiscard(state: MWState, tile: MWTile): MWState {
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const i = p.hand.indexOf(tile)
  if (i === -1) return state
  p.hand = p.hand.slice()
  p.hand.splice(i, 1)
  p.discards = [...p.discards, tile]
  players[state.turn] = p

  const claimOptions: MWState["claimOptions"] = []
  for (const other of players) {
    if (other.seat === state.turn) continue
    const hu = mwIsWinningHand([...other.hand, tile])
    const nonWildHand = other.hand.filter((t) => t !== "JK") as MJTile[]
    const pong = tile !== "JK" ? canPong(nonWildHand, tile as MJTile) || other.hand.includes("JK") : false
    const kong = tile !== "JK" ? canKong(nonWildHand, tile as MJTile) : false
    const isNext = other.seat === (state.turn + 1) % 3
    const chow = isNext && tile !== "JK" ? (canChow(nonWildHand, tile as MJTile) as [MWTile, MWTile][]) : []
    if (hu || pong || kong || chow.length > 0) {
      claimOptions.push({ seat: other.seat, pong, kong, chow, hu })
    }
  }

  return {
    ...state,
    players,
    lastDiscard: { seat: state.turn, tile },
    drawn: null,
    claimOptions,
    phase: claimOptions.length > 0 ? "claim" : "draw",
    turn: claimOptions.length > 0 ? state.turn : (state.turn + 1) % 3,
    log: `${p.name}打出 ${mwLabel(tile)}`,
  }
}

export function mwResolveClaim(
  state: MWState,
  seat: number,
  action: "hu" | "pong" | "kong" | "chow" | "pass",
  chowPair?: [MWTile, MWTile],
): MWState {
  if (!state.lastDiscard) return state
  const { tile, seat: fromSeat } = state.lastDiscard
  const players = state.players.slice()
  const claimant = { ...players[seat] }

  if (action === "hu") {
    const bonus = mwIsAllHonors([...claimant.hand, tile]) ? "（字一色，大牌！）" : ""
    return { ...state, phase: "over", winner: seat, log: `${claimant.name}胡牌！${bonus}` }
  }
  if (action === "pass") {
    const remaining = state.claimOptions.filter((c) => c.seat !== seat)
    if (remaining.length > 0) return { ...state, claimOptions: remaining, log: `${claimant.name}選擇過牌。` }
    return { ...state, claimOptions: [], phase: "draw", turn: (fromSeat + 1) % 3, log: "無人吃碰槓，繼續摸牌。" }
  }

  const discarder = { ...players[fromSeat] }
  discarder.discards = discarder.discards.slice(0, -1)
  players[fromSeat] = discarder

  if (action === "pong") {
    const hand = claimant.hand.slice()
    const sameCount = hand.filter((t) => t === tile).length
    if (sameCount >= 2) {
      hand.splice(hand.indexOf(tile), 1)
      hand.splice(hand.indexOf(tile), 1)
    } else {
      hand.splice(hand.indexOf(tile), 1)
      hand.splice(hand.indexOf("JK" as MWTile), 1)
    }
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "pong", tiles: [tile as MJTile, tile as MJTile, tile as MJTile] }]
    players[seat] = claimant
    return { ...state, players, turn: seat, claimOptions: [], phase: "discard", drawn: null, log: `${claimant.name}碰！` }
  }
  if (action === "kong") {
    const hand = claimant.hand.slice()
    for (let k = 0; k < 3; k++) hand.splice(hand.indexOf(tile), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "kong", tiles: [tile as MJTile, tile as MJTile, tile as MJTile, tile as MJTile] }]
    const wall = state.wall.slice()
    const flowers = claimant.flowers.slice()
    const extra = drawSkippingFlowers(wall, flowers)
    claimant.flowers = flowers
    if (extra) claimant.hand = sortTiles([...claimant.hand, extra])
    players[seat] = claimant
    return { ...state, players, wall, turn: seat, claimOptions: [], phase: "discard", drawn: extra ?? null, log: `${claimant.name}槓！補牌一張。` }
  }
  if (action === "chow" && chowPair) {
    const hand = claimant.hand.slice()
    hand.splice(hand.indexOf(chowPair[0]), 1)
    hand.splice(hand.indexOf(chowPair[1]), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "chow", tiles: sortTiles([tile, ...chowPair]) as MJTile[] }]
    players[seat] = claimant
    return { ...state, players, turn: seat, claimOptions: [], phase: "discard", drawn: null, log: `${claimant.name}吃！` }
  }
  return state
}

export function mwBotChoice(state: MWState, seat: number): { action: "hu" | "pong" | "kong" | "chow" | "pass"; chowPair?: [MWTile, MWTile] } {
  const opt = state.claimOptions.find((o) => o.seat === seat)
  if (!opt) return { action: "pass" }
  if (opt.hu) return { action: "hu" }
  if (opt.kong) return { action: "kong" }
  if (opt.pong) return { action: "pong" }
  if (opt.chow.length > 0 && Math.random() > 0.4) return { action: "chow", chowPair: opt.chow[0] }
  return { action: "pass" }
}

export function mwBotDiscard(hand: MWTile[]): MWTile {
  const nonWild = hand.filter((t) => t !== "JK")
  const pool = nonWild.length > 0 ? nonWild : hand
  return pool[Math.floor(Math.random() * pool.length)]
}
