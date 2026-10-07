// 日本立直麻將（東風戰簡化版）：標準136張牌（萬/筒/索+字牌，無花牌），4人對戰。
// 含立直宣告（押1000點、門清聽牌才能宣告，之後只能摸切）、寶牌（開局翻一張指示牌，下一張算寶牌加番）、
// 振聽（自己棄過的牌不能再用來胡別人的牌，只能自摸）、無役不能胡（役種計算簡化但確有實際運作）。
// 計分採用簡化版（固定視為30符），不含一發/裏寶牌/精確符數，但番數→點數換算與支付方式維持正規結構。
import { isWinningHand, canPong, canKong, canChow, MJ_LABELS, type MJTile, type MJMeld } from "@/lib/games/mahjong"

const SUITS = ["w", "t", "s"] as const
const WINDS = ["E", "S", "W", "N"] as const
const DRAGONS = ["B", "G", "R"] as const // 白→發→中→白 的寶牌循環順序

function isTerminalOrHonor(t: MJTile): boolean {
  if (t === "E" || t === "S" || t === "W" || t === "N" || t === "R" || t === "G" || t === "B") return true
  const n = Number(t.slice(1))
  return n === 1 || n === 9
}

function buildRiichiWall(): MJTile[] {
  const tiles: MJTile[] = []
  for (const suit of SUITS) for (let n = 1; n <= 9; n++) for (let k = 0; k < 4; k++) tiles.push(`${suit}${n}` as MJTile)
  for (const h of WINDS) for (let k = 0; k < 4; k++) tiles.push(h)
  for (const h of DRAGONS) for (let k = 0; k < 4; k++) tiles.push(h)
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

function nextDoraTile(indicator: MJTile): MJTile {
  const suit = indicator[0]
  if (suit === "w" || suit === "t" || suit === "s") {
    const n = Number(indicator.slice(1))
    return `${suit}${n === 9 ? 1 : n + 1}` as MJTile
  }
  if (WINDS.includes(indicator as (typeof WINDS)[number])) {
    const i = WINDS.indexOf(indicator as (typeof WINDS)[number])
    return WINDS[(i + 1) % 4]
  }
  const i = DRAGONS.indexOf(indicator as (typeof DRAGONS)[number])
  return DRAGONS[(i + 1) % 3]
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

type Group = { type: "triplet" | "sequence"; tiles: MJTile[] }

function decompose(counts: Map<MJTile, number>, meldsNeeded: number, groups: Group[]): Group[] | null {
  if (meldsNeeded === 0) return groups
  let first: MJTile | null = null
  for (const [t, c] of counts) {
    if (c > 0) {
      first = t
      break
    }
  }
  if (!first) return null
  if ((counts.get(first) ?? 0) >= 3) {
    counts.set(first, counts.get(first)! - 3)
    const res = decompose(counts, meldsNeeded - 1, [...groups, { type: "triplet", tiles: [first, first, first] }])
    counts.set(first, counts.get(first)! + 3)
    if (res) return res
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
        const res = decompose(counts, meldsNeeded - 1, [...groups, { type: "sequence", tiles: [first, t2, t3] }])
        counts.set(first, counts.get(first)! + 1)
        counts.set(t2, counts.get(t2)! + 1)
        counts.set(t3, counts.get(t3)! + 1)
        if (res) return res
      }
    }
  }
  return null
}

function decomposeWinningHand(tiles: MJTile[]): { pair: MJTile; groups: Group[] } | null {
  if (tiles.length % 3 !== 2) return null
  const meldsNeeded = (tiles.length - 2) / 3
  const counts = countMap(tiles)
  for (const t of Array.from(counts.keys())) {
    if ((counts.get(t) ?? 0) >= 2) {
      counts.set(t, counts.get(t)! - 2)
      const res = decompose(new Map(counts), meldsNeeded, [])
      counts.set(t, counts.get(t)! + 2)
      if (res) return { pair: t, groups: res }
    }
  }
  return null
}

const CANDIDATES: MJTile[] = [
  ...SUITS.flatMap((s) => Array.from({ length: 9 }, (_, i) => `${s}${i + 1}` as MJTile)),
  ...WINDS,
  ...DRAGONS,
]

export function rmWaitingTiles(hand: MJTile[]): MJTile[] {
  return CANDIDATES.filter((t) => isWinningHand([...hand, t]))
}

export interface YakuResult {
  list: string[]
  han: number
  valid: boolean // 至少一個役（寶牌不算役），無役不能胡
}

export function computeYaku(
  concealedTiles: MJTile[],
  openMelds: MJMeld[],
  ctx: { riichi: boolean; tsumo: boolean; seatWind: MJTile; roundWind: MJTile; dora: MJTile },
): YakuResult {
  const decomp = decomposeWinningHand(concealedTiles)
  if (!decomp) return { list: [], han: 0, valid: false }
  const allGroups: Group[] = [
    ...decomp.groups,
    ...openMelds.map((m) => ({ type: (m.type === "chow" ? "sequence" : "triplet") as "sequence" | "triplet", tiles: m.tiles })),
  ]
  const allTiles = [...concealedTiles, ...openMelds.flatMap((m) => m.tiles)]
  const closed = openMelds.length === 0
  const list: string[] = []
  let han = 0

  if (ctx.riichi) {
    list.push("立直")
    han += 1
  }
  if (ctx.tsumo && closed) {
    list.push("門前清自摸和")
    han += 1
  }
  const isTanyao = allTiles.every((t) => !isTerminalOrHonor(t))
  if (isTanyao) {
    list.push("斷么九")
    han += 1
  }
  const allTriplets = allGroups.every((g) => g.type === "triplet")
  if (allTriplets) {
    list.push("對對和")
    han += 2
  }
  const allSequences = allGroups.every((g) => g.type === "sequence")
  const pairIsYakuhai = decomp.pair === "R" || decomp.pair === "G" || decomp.pair === "B" || decomp.pair === ctx.seatWind || decomp.pair === ctx.roundWind
  if (closed && allSequences && !pairIsYakuhai) {
    list.push("平和")
    han += 1
  }
  for (const g of allGroups) {
    if (g.type !== "triplet") continue
    const t = g.tiles[0]
    if (t === "R" || t === "G" || t === "B") {
      list.push(`役牌（${MJ_LABELS[t]}）`)
      han += 1
    } else if (t === ctx.roundWind) {
      list.push("役牌（場風）")
      han += 1
    } else if (t === ctx.seatWind) {
      list.push("役牌（自風）")
      han += 1
    }
  }
  const suitsUsed = new Set(allTiles.filter((t) => t[0] === "w" || t[0] === "t" || t[0] === "s").map((t) => t[0]))
  const hasHonor = allTiles.some((t) => !(t[0] === "w" || t[0] === "t" || t[0] === "s"))
  if (suitsUsed.size === 1) {
    if (hasHonor) {
      list.push("混一色")
      han += closed ? 3 : 2
    } else {
      list.push("清一色")
      han += closed ? 6 : 5
    }
  }
  if (suitsUsed.size === 0) {
    list.push("字一色")
    han += 13
  }

  const valid = list.length > 0
  if (valid) {
    const doraCount = allTiles.filter((t) => t === ctx.dora).length
    if (doraCount > 0) {
      list.push(`寶牌 x${doraCount}`)
      han += doraCount
    }
  }
  return { list, han, valid }
}

function roundTo100(n: number): number {
  return Math.ceil(n / 100) * 100
}
function nonDealerRonTotal(han: number): number {
  if (han >= 13) return 32000
  if (han >= 11) return 24000
  if (han >= 8) return 16000
  if (han >= 6) return 12000
  if (han >= 5) return 8000
  return ({ 1: 1000, 2: 2000, 3: 3900, 4: 7700 } as Record<number, number>)[han] ?? 1000
}
function dealerRonTotal(han: number): number {
  if (han >= 13) return 48000
  if (han >= 11) return 36000
  if (han >= 8) return 24000
  if (han >= 6) return 18000
  if (han >= 5) return 12000
  return ({ 1: 1500, 2: 2900, 3: 5800, 4: 11600 } as Record<number, number>)[han] ?? 1500
}

export interface RMPlayer {
  seat: number
  name: string
  isYou: boolean
  hand: MJTile[]
  melds: MJMeld[]
  discards: MJTile[]
  riichi: boolean
  score: number
}

export interface RMHandResult {
  draw: boolean
  winner: number | null
  loser: number | null // ron 的放槓者；自摸則為 null
  tsumo: boolean
  yaku: string[]
  han: number
  points: number
  payments: { seat: number; delta: number }[]
}

export interface RMState {
  players: RMPlayer[]
  wall: MJTile[]
  doraIndicator: MJTile
  dora: MJTile
  turn: number
  dealer: number
  roundWind: MJTile
  handNumber: number
  riichiPot: number
  drawn: MJTile | null
  lastDiscard: { seat: number; tile: MJTile } | null
  phase: "draw" | "discard" | "claim" | "over"
  claimOptions: { seat: number; pong: boolean; kong: boolean; chow: [MJTile, MJTile][]; ron: boolean }[]
  riichiArmed: boolean // 玩家已按下「宣告立直」，等待選擇要打出的牌
  result: RMHandResult | null
  log: string
}

const NAMES = ["您", "東家阿凱", "南家小惠", "北家阿勇"]

function seatWindOf(seat: number, dealer: number): MJTile {
  return WINDS[(seat - dealer + 4) % 4]
}

function startHand(scores: number[], dealer: number, handNumber: number, riichiPot: number): RMState {
  const wall = buildRiichiWall()
  const doraIndicator = wall.pop()!
  const dora = nextDoraTile(doraIndicator)
  const hands: MJTile[][] = [[], [], [], []]
  for (let seat = 0; seat < 4; seat++) for (let k = 0; k < 13; k++) hands[seat].push(wall.shift()!)
  const players: RMPlayer[] = NAMES.map((name, seat) => ({
    seat,
    name,
    isYou: seat === 0,
    hand: sortTiles(hands[seat]),
    melds: [],
    discards: [],
    riichi: false,
    score: scores[seat],
  }))
  const firstDraw = wall.shift()
  if (firstDraw !== undefined) players[dealer].hand = sortTiles([...players[dealer].hand, firstDraw])
  const windLabel: Record<string, string> = { E: "東", S: "南", W: "西", N: "北" }
  return {
    players,
    wall,
    doraIndicator,
    dora,
    turn: dealer,
    dealer,
    roundWind: "E",
    handNumber,
    riichiPot,
    drawn: dealer === 0 ? (firstDraw ?? null) : null,
    lastDiscard: null,
    phase: "discard",
    claimOptions: [],
    riichiArmed: false,
    result: null,
    log: `第${handNumber}局開始！莊家是${NAMES[dealer]}（${windLabel[seatWindOf(dealer, dealer)]}），寶牌指示牌 ${MJ_LABELS[doraIndicator]}（寶牌是 ${MJ_LABELS[dora]}）。`,
  }
}

export function rmInitial(): RMState {
  return startHand([25000, 25000, 25000, 25000], 0, 1, 0)
}

export function rmNextHand(state: RMState, dealerRepeats: boolean): RMState {
  const scores = state.players.map((p) => p.score)
  const nextDealer = dealerRepeats ? state.dealer : (state.dealer + 1) % 4
  return startHand(scores, nextDealer, state.handNumber + 1, state.riichiPot)
}

function finishHand(state: RMState, result: RMHandResult): RMState {
  const players = state.players.map((p) => {
    const pay = result.payments.find((x) => x.seat === p.seat)
    return pay ? { ...p, score: p.score + pay.delta } : p
  })
  return { ...state, players, phase: "over", result, riichiPot: result.draw ? state.riichiPot : 0 }
}

export function rmDraw(state: RMState): RMState {
  if (state.wall.length === 0) return resolveExhaustiveDraw(state)
  const wall = state.wall.slice()
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const tile = wall.shift()!
  p.hand = sortTiles([...p.hand, tile])
  players[state.turn] = p
  return { ...state, wall, players, drawn: tile, phase: "discard", log: `${p.name}摸牌。` }
}

function resolveExhaustiveDraw(state: RMState): RMState {
  const tenpai = state.players.map((p) => rmWaitingTiles(p.hand).length > 0)
  const tenpaiSeats = tenpai.filter(Boolean).length
  const payments: { seat: number; delta: number }[] = state.players.map((p) => ({ seat: p.seat, delta: 0 }))
  if (tenpaiSeats >= 1 && tenpaiSeats <= 3) {
    const notenSeats = 4 - tenpaiSeats
    const perNoten = roundTo100(3000 / notenSeats)
    const perTenpai = roundTo100(3000 / tenpaiSeats)
    state.players.forEach((p, i) => {
      payments[i].delta = tenpai[i] ? perTenpai : -perNoten
    })
  }
  const result: RMHandResult = { draw: true, winner: null, loser: null, tsumo: false, yaku: [], han: 0, points: 0, payments }
  const next = finishHand(state, result)
  return { ...next, log: "牌牆已空，流局。" + (tenpaiSeats > 0 && tenpaiSeats < 4 ? "聽牌者收取不聽罰符。" : "") }
}

export function rmCanDeclareRiichi(state: RMState): boolean {
  if (state.phase !== "discard" || state.turn !== 0) return false
  const me = state.players[0]
  if (me.melds.length > 0 || me.riichi || me.score < 1000 || me.hand.length !== 14) return false
  return me.hand.some((t, i) => {
    const rest = me.hand.slice()
    rest.splice(i, 1)
    return rmWaitingTiles(rest).length > 0
  })
}

export function rmArmRiichi(state: RMState): RMState {
  if (!rmCanDeclareRiichi(state)) return state
  return { ...state, riichiArmed: true, log: "您宣告立直！請打出一張能維持聽牌的牌。" }
}

export function rmSelfHu(state: RMState): RMState {
  if (state.phase !== "discard") return state
  const seat = state.turn
  const p = state.players[seat]
  if (!isWinningHand(p.hand)) return state
  const seatWind = seatWindOf(seat, state.dealer)
  const yaku = computeYaku(p.hand, p.melds, { riichi: p.riichi, tsumo: true, seatWind, roundWind: state.roundWind, dora: state.dora })
  if (!yaku.valid) return state
  const isDealer = seat === state.dealer
  const total = isDealer ? dealerRonTotal(yaku.han) : nonDealerRonTotal(yaku.han)
  const payments: { seat: number; delta: number }[] = state.players.map((pl) => ({ seat: pl.seat, delta: 0 }))
  if (isDealer) {
    const share = roundTo100(total / 3)
    for (const pl of state.players) if (pl.seat !== seat) payments[pl.seat].delta = -share
    payments[seat].delta = share * 3 + state.riichiPot
  } else {
    const dealerShare = roundTo100(total / 2)
    const otherShare = roundTo100(total / 4)
    for (const pl of state.players) {
      if (pl.seat === seat) continue
      payments[pl.seat].delta = pl.seat === state.dealer ? -dealerShare : -otherShare
    }
    payments[seat].delta = dealerShare + otherShare * 2 + state.riichiPot
  }
  const result: RMHandResult = { draw: false, winner: seat, loser: null, tsumo: true, yaku: yaku.list, han: yaku.han, points: total, payments }
  return finishHand(state, { ...result })
}

function rmFuriten(state: RMState, seat: number): boolean {
  const p = state.players[seat]
  const waits = rmWaitingTiles(p.hand)
  if (waits.length === 0) return false
  return p.discards.some((d) => waits.includes(d))
}

export function rmDiscard(state: RMState, tile: MJTile): RMState {
  const players = state.players.slice()
  const p = { ...players[state.turn] }
  const i = p.hand.indexOf(tile)
  if (i === -1) return state
  if (p.riichi && state.turn === 0 && tile !== state.drawn) return state // 立直後只能摸切
  p.hand = p.hand.slice()
  p.hand.splice(i, 1)
  let riichiPot = state.riichiPot
  if (state.turn === 0 && state.riichiArmed) {
    p.riichi = true
    p.score -= 1000
    riichiPot += 1000
  }
  p.discards = [...p.discards, tile]
  players[state.turn] = p

  const claimOptions: RMState["claimOptions"] = []
  for (const other of players) {
    if (other.seat === state.turn) continue
    const canRon = isWinningHand([...other.hand, tile])
    const ron = canRon ? computeYaku([...other.hand, tile], other.melds, {
      riichi: other.riichi,
      tsumo: false,
      seatWind: seatWindOf(other.seat, state.dealer),
      roundWind: state.roundWind,
      dora: state.dora,
    }).valid && !rmFuriten(state, other.seat) : false
    const pong = canPong(other.hand, tile)
    const kong = canKong(other.hand, tile)
    const isNext = other.seat === (state.turn + 1) % 4
    const chow = isNext ? canChow(other.hand, tile) : []
    if (ron || pong || kong || chow.length > 0) {
      claimOptions.push({ seat: other.seat, pong, kong, chow, ron })
    }
  }

  return {
    ...state,
    players,
    riichiPot,
    riichiArmed: false,
    lastDiscard: { seat: state.turn, tile },
    drawn: null,
    claimOptions,
    phase: claimOptions.length > 0 ? "claim" : "draw",
    turn: claimOptions.length > 0 ? state.turn : (state.turn + 1) % 4,
    log: `${p.name}打出 ${MJ_LABELS[tile] ?? tile}`,
  }
}

export function rmResolveClaim(
  state: RMState,
  seat: number,
  action: "ron" | "pong" | "kong" | "chow" | "pass",
  chowPair?: [MJTile, MJTile],
): RMState {
  if (!state.lastDiscard) return state
  const { tile, seat: fromSeat } = state.lastDiscard
  const players = state.players.slice()
  const claimant = { ...players[seat] }

  if (action === "ron") {
    const yaku = computeYaku([...claimant.hand, tile], claimant.melds, {
      riichi: claimant.riichi,
      tsumo: false,
      seatWind: seatWindOf(seat, state.dealer),
      roundWind: state.roundWind,
      dora: state.dora,
    })
    const isDealer = seat === state.dealer
    const total = isDealer ? dealerRonTotal(yaku.han) : nonDealerRonTotal(yaku.han)
    const payments: { seat: number; delta: number }[] = state.players.map((pl) => ({ seat: pl.seat, delta: 0 }))
    payments[fromSeat].delta = -total
    payments[seat].delta = total + state.riichiPot
    const result: RMHandResult = { draw: false, winner: seat, loser: fromSeat, tsumo: false, yaku: yaku.list, han: yaku.han, points: total, payments }
    return finishHand(state, result)
  }
  if (action === "pass") {
    const remaining = state.claimOptions.filter((c) => c.seat !== seat)
    if (remaining.length > 0) return { ...state, claimOptions: remaining, log: `${claimant.name}選擇過牌。` }
    return { ...state, claimOptions: [], phase: "draw", turn: (fromSeat + 1) % 4, log: "無人吃碰槓胡，繼續摸牌。" }
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
    return { ...state, players, turn: seat, claimOptions: [], phase: "discard", drawn: null, log: `${claimant.name}碰！` }
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

export function rmBotChoice(
  state: RMState,
  seat: number,
): { action: "ron" | "pong" | "kong" | "chow" | "pass"; chowPair?: [MJTile, MJTile] } {
  const opt = state.claimOptions.find((o) => o.seat === seat)
  if (!opt) return { action: "pass" }
  if (opt.ron) return { action: "ron" }
  if (opt.kong) return { action: "kong" }
  if (opt.pong) return { action: "pong" }
  if (opt.chow.length > 0 && Math.random() > 0.5) return { action: "chow", chowPair: opt.chow[0] }
  return { action: "pass" }
}

export function rmBotAct(state: RMState, seat: number): RMState {
  const p = state.players[seat]
  if (isWinningHand(p.hand)) {
    const yaku = computeYaku(p.hand, p.melds, {
      riichi: p.riichi,
      tsumo: true,
      seatWind: seatWindOf(seat, state.dealer),
      roundWind: state.roundWind,
      dora: state.dora,
    })
    if (yaku.valid) return rmSelfHuAt(state, seat, yaku)
  }
  if (p.riichi) {
    const tile = state.drawn ?? p.hand[p.hand.length - 1]
    return rmDiscard(state, tile)
  }
  if (p.melds.length === 0 && p.score >= 1000) {
    const canRiichi = p.hand.some((t, i) => {
      const rest = p.hand.slice()
      rest.splice(i, 1)
      return rmWaitingTiles(rest).length > 0
    })
    if (canRiichi && Math.random() < 0.6) {
      const idx = p.hand.findIndex((t, i) => {
        const rest = p.hand.slice()
        rest.splice(i, 1)
        return rmWaitingTiles(rest).length > 0
      })
      const armed = { ...state, players: state.players.map((pl, i) => (i === seat ? pl : pl)) }
      const withRiichiFlag = rmArmForBot(armed, seat)
      return rmDiscard(withRiichiFlag, p.hand[idx])
    }
  }
  const counts = countMap(p.hand)
  const isolated = p.hand.filter((t) => {
    if ((counts.get(t) ?? 0) >= 2) return false
    const suit = t[0]
    if (suit !== "w" && suit !== "t" && suit !== "s") return true
    const n = Number(t.slice(1))
    const near = [n - 2, n - 1, n + 1, n + 2].some((x) => x >= 1 && x <= 9 && (counts.get(`${suit}${x}` as MJTile) ?? 0) > 0)
    return !near
  })
  const pool = isolated.length > 0 ? isolated : p.hand
  const tile = pool[Math.floor(Math.random() * pool.length)]
  return rmDiscard(state, tile)
}

function rmArmForBot(state: RMState, seat: number): RMState {
  const players = state.players.slice()
  const p = { ...players[seat] }
  p.riichi = true
  p.score -= 1000
  players[seat] = p
  return { ...state, players, riichiPot: state.riichiPot + 1000, log: `${p.name}宣告立直！` }
}

function rmSelfHuAt(state: RMState, seat: number, yaku: YakuResult): RMState {
  const isDealer = seat === state.dealer
  const total = isDealer ? dealerRonTotal(yaku.han) : nonDealerRonTotal(yaku.han)
  const payments: { seat: number; delta: number }[] = state.players.map((pl) => ({ seat: pl.seat, delta: 0 }))
  if (isDealer) {
    const share = roundTo100(total / 3)
    for (const pl of state.players) if (pl.seat !== seat) payments[pl.seat].delta = -share
    payments[seat].delta = share * 3 + state.riichiPot
  } else {
    const dealerShare = roundTo100(total / 2)
    const otherShare = roundTo100(total / 4)
    for (const pl of state.players) {
      if (pl.seat === seat) continue
      payments[pl.seat].delta = pl.seat === state.dealer ? -dealerShare : -otherShare
    }
    payments[seat].delta = dealerShare + otherShare * 2 + state.riichiPot
  }
  const result: RMHandResult = { draw: false, winner: seat, loser: null, tsumo: true, yaku: yaku.list, han: yaku.han, points: total, payments }
  return finishHand(state, result)
}

export { MJ_LABELS }
export type { MJTile }
