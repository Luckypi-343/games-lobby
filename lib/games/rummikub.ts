// 拉密牌（簡化版，不含鬼牌）：4種顏色、1~13各兩張，共104張。組成同色連續數字（順子，至少3張）
// 或同數字不同顏色（同花，3~4張）即可出牌，先清空手牌者獲勝。
export type RKColor = 0 | 1 | 2 | 3
export const COLOR_HEX = ["#dc2626", "#2563eb", "#16a34a", "#111827"]
export const COLOR_NAME = ["紅心", "方塊", "梅花", "黑桃"]
// 四色撲克牌：紅心♥／方塊♦／梅花♣／黑桃♠，各自固定顏色方便辨識
export const COLOR_SUIT = ["♥", "♦", "♣", "♠"]
export function rkRankLabel(n: number): string {
  if (n === 1) return "A"
  if (n === 11) return "J"
  if (n === 12) return "Q"
  if (n === 13) return "K"
  return String(n)
}

export interface RKTile {
  id: string
  color: RKColor
  number: number
}

export type RKPlayer = 1 | 2

export interface RKState {
  deck: RKTile[]
  racks: Record<RKPlayer, RKTile[]>
  table: RKTile[][]
  turn: RKPlayer
  status: "playing" | "win"
  winner: RKPlayer | null
  log: string
}

function freshDeck(): RKTile[] {
  const tiles: RKTile[] = []
  for (let copy = 0; copy < 2; copy++) {
    for (let c = 0; c < 4; c++) {
      for (let n = 1; n <= 13; n++) {
        tiles.push({ id: `${c}-${n}-${copy}`, color: c as RKColor, number: n })
      }
    }
  }
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[tiles[i], tiles[j]] = [tiles[j], tiles[i]]
  }
  return tiles
}

export function rkInitial(): RKState {
  const deck = freshDeck()
  const p1 = deck.splice(0, 14)
  const p2 = deck.splice(0, 14)
  return {
    deck,
    racks: { 1: p1, 2: p2 },
    table: [],
    turn: 1,
    status: "playing",
    winner: null,
    log: "請組合並出牌，或摸牌結束回合",
  }
}

export function rkIsValidMeld(tiles: RKTile[]): boolean {
  if (tiles.length < 3) return false
  const sameColor = tiles.every((t) => t.color === tiles[0].color)
  if (sameColor) {
    const nums = [...tiles.map((t) => t.number)].sort((a, b) => a - b)
    for (let i = 1; i < nums.length; i++) {
      if (nums[i] !== nums[i - 1] + 1) return false
    }
    return new Set(nums).size === nums.length
  }
  const sameNumber = tiles.every((t) => t.number === tiles[0].number)
  if (sameNumber && tiles.length <= 4) {
    const colors = new Set(tiles.map((t) => t.color))
    return colors.size === tiles.length
  }
  return false
}

export function rkPlayMeld(state: RKState, player: RKPlayer, tileIds: string[]): RKState {
  const rack = state.racks[player]
  const chosen = rack.filter((t) => tileIds.includes(t.id))
  if (chosen.length !== tileIds.length || !rkIsValidMeld(chosen)) return state
  const newRack = rack.filter((t) => !tileIds.includes(t.id))
  const table = [...state.table, chosen]
  const won = newRack.length === 0
  return {
    ...state,
    racks: { ...state.racks, [player]: newRack },
    table,
    status: won ? "win" : "playing",
    winner: won ? player : null,
    log: won ? "手牌清空，獲勝！" : "成功出牌",
  }
}

export function rkDrawAndPass(state: RKState, player: RKPlayer): RKState {
  const deck = [...state.deck]
  const rack = [...state.racks[player]]
  if (deck.length > 0) rack.push(deck.pop()!)
  return {
    ...state,
    deck,
    racks: { ...state.racks, [player]: rack },
    turn: player === 1 ? 2 : 1,
    log: "摸了一張牌，換對方回合",
  }
}

export function rkEndTurn(state: RKState, player: RKPlayer): RKState {
  return { ...state, turn: player === 1 ? 2 : 1, log: "回合結束" }
}

// 在手牌中窮舉尋找任何有效組合（同色順子或同數同花），回傳找到的第一組
export function rkFindMeld(rack: RKTile[]): RKTile[] | null {
  // 同數字不同顏色
  const byNumber = new Map<number, RKTile[]>()
  rack.forEach((t) => {
    const arr = byNumber.get(t.number) ?? []
    arr.push(t)
    byNumber.set(t.number, arr)
  })
  for (const [, tiles] of byNumber) {
    const uniqueColors = new Map<RKColor, RKTile>()
    tiles.forEach((t) => uniqueColors.set(t.color, t))
    const group = Array.from(uniqueColors.values())
    if (group.length >= 3) return group.slice(0, 4)
  }
  // 同色連續順子
  for (let c = 0; c < 4; c++) {
    const nums = rack
      .filter((t) => t.color === c)
      .sort((a, b) => a.number - b.number)
    let run: RKTile[] = []
    for (let i = 0; i < nums.length; i++) {
      if (run.length === 0 || nums[i].number === run[run.length - 1].number + 1) {
        run.push(nums[i])
      } else if (nums[i].number !== run[run.length - 1].number) {
        if (run.length >= 3) return run
        run = [nums[i]]
      }
    }
    if (run.length >= 3) return run
  }
  return null
}
