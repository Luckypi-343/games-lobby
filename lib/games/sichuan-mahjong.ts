// 四川麻將（血戰到底）：只用筒、條、萬三門（無風牌、無花牌），開局前每人自動「缺一門」
// （手牌中數量最少的那一門整個不用，之後摸到該門牌一律跳過），一家胡牌後該家離場但遊戲不結束，
// 繼續讓剩下的人打，直到三家都胡牌或牌摸完才算整局結束。
import { isWinningHand, canPong, canKong, canChow, MJ_LABELS, type MJTile, type MJMeld } from "@/lib/games/mahjong"

export type SCSuit = "w" | "t" | "s"
const SUITS: SCSuit[] = ["w", "t", "s"]

function buildSichuanWall(): MJTile[] {
  const tiles: MJTile[] = []
  for (const suit of SUITS) {
    for (let n = 1; n <= 9; n++) {
      for (let k = 0; k < 4; k++) tiles.push(`${suit}${n}` as MJTile)
    }
  }
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

function sortTiles(tiles: MJTile[]): MJTile[] {
  return tiles.slice().sort((a, b) => {
    const sa = SUITS.indexOf(a[0] as SCSuit)
    const sb = SUITS.indexOf(b[0] as SCSuit)
    if (sa !== sb) return sa - sb
    return Number(a.slice(1)) - Number(b.slice(1))
  })
}

function countBySuit(tiles: MJTile[]): Record<SCSuit, number> {
  const c: Record<SCSuit, number> = { w: 0, t: 0, s: 0 }
  for (const t of tiles) c[t[0] as SCSuit]++
  return c
}

/** 從牌牆摸一張牌，自動跳過該家缺的那一門（跳過的牌放回牌尾，供其他人摸到）。 */
function drawAvoiding(wall: MJTile[], avoid: SCSuit): MJTile | undefined {
  let attempts = 0
  while (wall.length > 0 && attempts < wall.length + 1) {
    const t = wall.shift()!
    if (t[0] === avoid) {
      wall.push(t)
      attempts++
      continue
    }
    return t
  }
  return wall.shift()
}

export interface SCPlayer {
  seat: number
  name: string
  isYou: boolean
  hand: MJTile[]
  melds: MJMeld[]
  discards: MJTile[]
  missingSuit: SCSuit
  out: boolean // 已胡牌離場
}

export interface SCState {
  players: SCPlayer[]
  wall: MJTile[]
  turn: number
  drawn: MJTile | null
  lastDiscard: { seat: number; tile: MJTile } | null
  phase: "draw" | "discard" | "claim" | "over"
  claimOptions: { seat: number; pong: boolean; kong: boolean; chow: [MJTile, MJTile][]; hu: boolean }[]
  winners: number[] // 依胡牌順序，最多 3 家
  log: string
}

const SUIT_LABEL: Record<SCSuit, string> = { w: "萬", t: "筒", s: "條" }
const NAMES = ["您", "東家阿福", "南家阿珠", "西家阿明"]

export function scMissingLabel(suit: SCSuit): string {
  return SUIT_LABEL[suit]
}

export function scInitial(): SCState {
  const wall = buildSichuanWall()
  const rawHands: MJTile[][] = [[], [], [], []]
  for (let seat = 0; seat < 4; seat++) {
    for (let k = 0; k < 13; k++) rawHands[seat].push(wall.shift()!)
  }
  const missing: SCSuit[] = rawHands.map((hand) => {
    const counts = countBySuit(hand)
    return (Object.keys(counts) as SCSuit[]).reduce((min, s) => (counts[s] < counts[min] ? s : min), "w" as SCSuit)
  })
  const hands: MJTile[][] = rawHands.map((hand, seat) => hand.filter((t) => t[0] !== missing[seat]))
  const removedPool = rawHands.flatMap((hand, seat) => hand.filter((t) => t[0] === missing[seat]))
  for (let i = removedPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[removedPool[i], removedPool[j]] = [removedPool[j], removedPool[i]]
  }
  wall.push(...removedPool)
  for (let seat = 0; seat < 4; seat++) {
    while (hands[seat].length < 13 && wall.length > 0) {
      const t = drawAvoiding(wall, missing[seat])
      if (t === undefined) break
      hands[seat].push(t)
    }
  }
  const players: SCPlayer[] = NAMES.map((name, seat) => ({
    seat,
    name,
    isYou: seat === 0,
    hand: sortTiles(hands[seat]),
    melds: [],
    discards: [],
    missingSuit: missing[seat],
    out: false,
  }))
  const firstDraw = drawAvoiding(wall, missing[0])
  if (firstDraw !== undefined) players[0].hand = sortTiles([...players[0].hand, firstDraw])
  return {
    players,
    wall,
    turn: 0,
    drawn: firstDraw ?? null,
    lastDiscard: null,
    phase: "discard",
    claimOptions: [],
    winners: [],
    log: `開局！每家已自動缺一門（您缺${SUIT_LABEL[missing[0]]}），請打出一張牌。`,
  }
}

function nextActiveSeat(state: SCState, from: number): number {
  let s = (from + 1) % 4
  let loop = 0
  while (state.players[s].out && loop < 4) {
    s = (s + 1) % 4
    loop++
  }
  return s
}

function activeCount(state: SCState): number {
  return state.players.filter((p) => !p.out).length
}

export function scDraw(state: SCState): SCState {
  if (state.wall.length === 0 || activeCount(state) <= 1) {
    return { ...state, phase: "over", log: "牌牆已空或只剩一家在場，本局結束。" }
  }
  const wall = state.wall.slice()
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const tile = drawAvoiding(wall, p.missingSuit)
  if (tile === undefined) {
    return { ...state, wall, phase: "over", log: "牌牆已空，本局結束。" }
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

export function scSelfHu(state: SCState): SCState {
  if (state.phase !== "discard") return state
  const p = state.players[state.turn]
  if (!isWinningHand(p.hand)) return state
  return markWinner(state, state.turn, "自摸")
}

function markWinner(state: SCState, seat: number, how: string): SCState {
  const players = state.players.slice()
  players[seat] = { ...players[seat], out: true }
  const winners = [...state.winners, seat]
  const remaining = players.filter((p) => !p.out)
  const over = winners.length >= 3 || remaining.length <= 1
  return {
    ...state,
    players,
    winners,
    claimOptions: [],
    phase: over ? "over" : "draw",
    turn: over ? state.turn : nextActiveSeat(state, seat),
    log: `${players[seat].name}${how}胡牌！${over ? "整局結束。" : "離場，其餘繼續血戰。"}`,
  }
}

export function scWaitingTiles(hand: MJTile[], missingSuit: SCSuit): MJTile[] {
  const candidates = (Object.keys(MJ_LABELS) as MJTile[]).filter((t) => t[0] !== missingSuit && t[0] !== "E" && !t.startsWith("f") && !["S", "W", "N", "R", "G", "B"].includes(t))
  return candidates.filter((t) => isWinningHand([...hand, t]))
}

export function scDiscard(state: SCState, tile: MJTile): SCState {
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const i = p.hand.indexOf(tile)
  if (i === -1) return state
  p.hand = p.hand.slice()
  p.hand.splice(i, 1)
  p.discards = [...p.discards, tile]
  players[state.turn] = p

  const claimOptions: SCState["claimOptions"] = []
  for (const other of players) {
    if (other.seat === state.turn || other.out) continue
    const hu = isWinningHand([...other.hand, tile])
    const pong = canPong(other.hand, tile)
    const kong = canKong(other.hand, tile)
    const isNext = other.seat === nextActiveSeat(state, state.turn)
    const chow = isNext ? canChow(other.hand, tile) : []
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
    turn: claimOptions.length > 0 ? state.turn : nextActiveSeat(state, state.turn),
    log: `${p.name}打出 ${MJ_LABELS[tile] ?? tile}`,
  }
}

export function scResolveClaim(
  state: SCState,
  seat: number,
  action: "hu" | "pong" | "kong" | "chow" | "pass",
  chowPair?: [MJTile, MJTile],
): SCState {
  if (!state.lastDiscard) return state
  const { tile, seat: fromSeat } = state.lastDiscard
  if (action === "hu") return markWinner(state, seat, "吃牌")
  if (action === "pass") {
    const remaining = state.claimOptions.filter((c) => c.seat !== seat)
    if (remaining.length > 0) return { ...state, claimOptions: remaining, log: `${state.players[seat].name}選擇過牌。` }
    return { ...state, claimOptions: [], phase: "draw", turn: nextActiveSeat(state, fromSeat), log: "無人吃碰槓，繼續摸牌。" }
  }

  const players = state.players.slice()
  const claimant = { ...players[seat] }
  const discarder = { ...players[fromSeat] }
  discarder.discards = discarder.discards.slice(0, -1)
  players[fromSeat] = discarder

  if (action === "pong") {
    const hand = claimant.hand.slice()
    for (let k = 0; k < 2; k++) hand.splice(hand.indexOf(tile), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "pong", tiles: [tile, tile, tile] }]
    players[seat] = claimant
    return { ...state, players, turn: seat, claimOptions: [], phase: "discard", drawn: null, log: `${claimant.name}碰！` }
  }
  if (action === "kong") {
    const hand = claimant.hand.slice()
    for (let k = 0; k < 3; k++) hand.splice(hand.indexOf(tile), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "kong", tiles: [tile, tile, tile, tile] }]
    const wall = state.wall.slice()
    const extra = drawAvoiding(wall, claimant.missingSuit)
    if (extra) claimant.hand = sortTiles([...claimant.hand, extra])
    players[seat] = claimant
    return { ...state, players, wall, turn: seat, claimOptions: [], phase: "discard", drawn: extra ?? null, log: `${claimant.name}槓！補牌一張。` }
  }
  if (action === "chow" && chowPair) {
    const hand = claimant.hand.slice()
    hand.splice(hand.indexOf(chowPair[0]), 1)
    hand.splice(hand.indexOf(chowPair[1]), 1)
    claimant.hand = hand
    claimant.melds = [...claimant.melds, { type: "chow", tiles: sortTiles([tile, ...chowPair]) }]
    players[seat] = claimant
    return { ...state, players, turn: seat, claimOptions: [], phase: "discard", drawn: null, log: `${claimant.name}吃！` }
  }
  return state
}

export function scBotChoice(state: SCState, seat: number): { action: "hu" | "pong" | "kong" | "chow" | "pass"; chowPair?: [MJTile, MJTile] } {
  const opt = state.claimOptions.find((o) => o.seat === seat)
  if (!opt) return { action: "pass" }
  if (opt.hu) return { action: "hu" }
  if (opt.kong) return { action: "kong" }
  if (opt.pong) return { action: "pong" }
  if (opt.chow.length > 0 && Math.random() > 0.4) return { action: "chow", chowPair: opt.chow[0] }
  return { action: "pass" }
}

export function scBotDiscard(hand: MJTile[]): MJTile {
  const counts = new Map<MJTile, number>()
  for (const t of hand) counts.set(t, (counts.get(t) ?? 0) + 1)
  const isolated = hand.filter((t) => {
    if ((counts.get(t) ?? 0) >= 2) return false
    const suit = t[0] as SCSuit
    const n = Number(t.slice(1))
    const near = [n - 2, n - 1, n + 1, n + 2].some((x) => x >= 1 && x <= 9 && (counts.get(`${suit}${x}` as MJTile) ?? 0) > 0)
    return !near
  })
  const pool = isolated.length > 0 ? isolated : hand
  return pool[Math.floor(Math.random() * pool.length)]
}
