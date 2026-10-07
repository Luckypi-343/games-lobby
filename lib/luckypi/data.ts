import { type LangId, isLangId as isLangIdBase } from "./i18n"

export type { LangId }

export type SymbolId =
  | "rat"
  | "ox"
  | "tiger"
  | "rabbit"
  | "dragon"
  | "snake"
  | "horse"
  | "goat"
  | "monkey"
  | "rooster"
  | "dog"
  | "pig"
  | "wild"
  | "bonus"
  | "wheel"

// 9 個「一般圖騰」：實際會依倍數高低對獎（如創辦人提供的中獎比率表 A～I）。
// 鼠/虎/龍 三個生肖不再是一般對獎圖騰，而是被賦予特殊身分：
//   龍 → 百搭 WILD（可搭配任何一般圖騰湊連線）
//   虎 → 額外 SCATTER（觸發免費遊戲）
//   鼠 → BONUS（觸發飛輪贈分小遊戲）
export const ZODIAC_SYMBOLS: { id: Exclude<SymbolId, "wild" | "bonus" | "wheel" | "rat" | "tiger" | "dragon">; label: string }[] = [
  { id: "ox", label: "牛" },
  { id: "rabbit", label: "兔" },
  { id: "snake", label: "蛇" },
  { id: "horse", label: "馬" },
  { id: "goat", label: "羊" },
  { id: "monkey", label: "猴" },
  { id: "rooster", label: "雞" },
  { id: "dog", label: "狗" },
  { id: "pig", label: "豬" },
]

export const SYMBOL_LABEL: Record<SymbolId, string> = {
  ...Object.fromEntries(ZODIAC_SYMBOLS.map((z) => [z.id, z.label])),
  rat: "鼠",
  tiger: "虎",
  dragon: "龍",
  wild: "龍",
  bonus: "虎",
  wheel: "鼠",
} as Record<SymbolId, string>

// WILD／SCATTER／BONUS 三個特殊身分實際使用的技術代號分別是 wild／bonus／wheel，
// 畫面上以龍／虎／鼠三個生肖圖騰呈現，並疊上白底立體英文字樣（WILD／SCATTER／BONUS）。
export const SPECIAL_OVERLAY: Record<"wild" | "bonus" | "wheel", string> = {
  wild: "WILD",
  bonus: "SCATTER",
  wheel: "BONUS",
}

export const SYMBOL_WEIGHT: Record<SymbolId, number> = {
  ox: 15,
  dog: 14,
  pig: 13,
  rabbit: 13,
  goat: 12,
  rooster: 11,
  snake: 10,
  horse: 9,
  monkey: 9,
  rat: 0,
  tiger: 0,
  dragon: 0,
  wild: 5,
  bonus: 4,
  wheel: 3,
}

// 一般圖騰中獎比率（押注 9 分＝每線 1 分時的倍數，對應創辦人提供的 A～I 對獎表）。
export const PAYTABLE: Record<Exclude<SymbolId, "bonus" | "wheel" | "rat" | "tiger" | "dragon">, { 3: number; 4: number; 5: number }> = {
  rooster: { 3: 2, 4: 3, 5: 4 },
  snake: { 3: 4, 4: 6, 5: 8 },
  rabbit: { 3: 6, 4: 9, 5: 12 },
  pig: { 3: 8, 4: 12, 5: 16 },
  dog: { 3: 10, 4: 15, 5: 20 },
  monkey: { 3: 20, 4: 30, 5: 40 },
  goat: { 3: 30, 4: 45, 5: 60 },
  ox: { 3: 40, 4: 60, 5: 80 },
  horse: { 3: 50, 4: 75, 5: 100 },
  wild: { 3: 60, 4: 150, 5: 500 },
}

// 全盤獎倍數：當整個轉盤 15 格全部都是同一個一般圖騰（可搭配百搭 WILD）時，
// 以「總押注分（9 條線 × 每線押注分）」乘上此倍數計算，屬於極稀有的大獎。
export const BOARD_PAYTABLE: Record<Exclude<SymbolId, "wild" | "bonus" | "wheel" | "rat" | "tiger" | "dragon">, number> = {
  horse: 1000,
  ox: 800,
  goat: 600,
  monkey: 400,
  dog: 200,
  pig: 160,
  rabbit: 120,
  snake: 80,
  rooster: 40,
}

// SCATTER（虎）觸發免費遊戲次數：3 個 5 次、4 個 10 次、5 個 15 次。
// 注意：每一豎列（reel）最多只會出現 1 個 SCATTER，且必須落在 9 條中獎連線的規範中才算得中。
export const SCATTER_FREE_GAMES: { 3: number; 4: number; 5: number } = { 3: 5, 4: 10, 5: 15 }

// BONUS（鼠）觸發飛輪贈分小遊戲次數：3 個 1 次、4 個 2 次、5 個 3 次。
// 注意：每一豎列（reel）最多只會出現 1 個 BONUS，且必須落在 9 條中獎連線的規範中才算得中。
export const BONUS_WHEEL_SPINS: { 3: number; 4: number; 5: number } = { 3: 1, 4: 2, 5: 3 }

// 9 paylines across a 5-column x 3-row grid, numbered 1~9 to match the machine's
// payline signage (轉盤兩側編碼). Each entry is the row index (0 = top, 1 = middle,
// 2 = bottom) used at each of the 5 columns. Order below IS the line number:
// index 0 = 第1條, index 1 = 第2條 ... index 8 = 第9條.
export const PAYLINES: number[][] = [
  [0, 1, 2, 1, 0], // 1：V 形，兩端貼齊上排
  [0, 0, 0, 0, 0], // 2：一形，上排一直線（上排中心線）
  [0, 0, 1, 2, 2], // 3：Z 形，左上→右下
  [1, 0, 0, 0, 1], // 4：M 形，兩端貼齊中排
  [1, 1, 1, 1, 1], // 5：一形，中排一直線（中排中心線）
  [1, 2, 2, 2, 1], // 6：W 形，兩端貼齊中排
  [2, 1, 0, 1, 2], // 7：A 形，兩端貼齊下排
  [2, 2, 2, 2, 2], // 8：一形，下排一直線（下排中心線）
  [2, 2, 1, 0, 0], // 9：反 Z 形，左下→右上
]

export const LINE_COUNT = PAYLINES.length

export type CategoryId = "puzzle" | "gamble"

export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: "puzzle", label: "益智區", blurb: "輕鬆玩法，適合休閒活動與腦智開發" },
  { id: "gamble", label: "博奕區", blurb: "刺激高倍玩法，挑戰您的手氣" },
]

export type TierId = "bronze" | "silver" | "gold" | "diamond"

export const TIERS: { id: TierId; label: string; factor: number }[] = [
  { id: "bronze", label: "青銅台", factor: 0.7 },
  { id: "silver", label: "白銀台", factor: 1 },
  { id: "gold", label: "黃金台", factor: 1.5 },
  { id: "diamond", label: "鑽石台", factor: 2.2 },
]

export interface Machine {
  id: string
  name: string
  category: CategoryId
  tier: TierId
  hue: number
  payFactor: number
}

const PUZZLE_THEMES = [
  "招財喜氣",
  "福運連連",
  "開心農場",
  "糖果派對",
  "森林奇緣",
  "海底寶藏",
  "繁星許願",
  "彩虹樂園",
  "幸運兔兔",
  "甜心莊園",
  "歡樂馬戲",
  "璀璨煙火",
  "夢幻樂土",
  "翡翠山谷",
  "陽光小鎮",
]

const GAMBLE_THEMES = [
  "瑞獸迎福",
  "招財進寶",
  "花開富貴",
  "蛟龍探寶",
  "尊爵名仕",
  "閃電飆速",
  "沙場霸主",
  "荒野槍手",
  "賭聖出擊",
  "煙火盛宴",
  "金雨降臨",
  "旭日東昇",
  "鑽世奢華",
  "王朝盛世",
  "福海生財",
]

// 第16～30台（白銀台）專屬的另一組 15 個主題名稱，跟青銅台（01～15台）完全不同，
// 確保兩組機台的主題、圖騰、配色徹底獨立，不會因為共用同一個名稱而彼此同步。
const GAMBLE_THEMES_SILVER = [
  "錦鯉躍泉",
  "麒麟獻瑞",
  "鳳凰來儀",
  "星際遠征",
  "機甲紀元",
  "幽冥秘境",
  "忍者暗影",
  "武士魂",
  "埃及法老",
  "北歐戰神",
  "馬戲奇幻",
  "蒸汽機關",
  "極光秘寶",
  "叢林秘境",
  "深海霓光",
]

// All 12 icons that can appear on any reel (9 一般生肖 + 龍WILD + 虎SCATTER + 鼠BONUS)，
// used to build each machine's own "十二生肖圖騰網格" background.
export const ALL_SYMBOL_IDS: SymbolId[] = [...ZODIAC_SYMBOLS.map((z) => z.id), "wild", "bonus", "wheel"]

export function shuffledSymbolOrder(seed: string): SymbolId[] {
  const order = [...ALL_SYMBOL_IDS]
  let h = fnv(seed)
  for (let i = order.length - 1; i > 0; i--) {
    h = Math.imul(h ^ i, 2654435761) >>> 0
    const j = h % (i + 1)
    ;[order[i], order[j]] = [order[j], order[i]]
  }
  return order
}

export function fnv(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Each gambling theme has its own exclusive totem glyph (its "台徽"), independent of tier/hue.
export const GAMBLE_THEME_TOTEM: Record<string, string> = {
  瑞獸迎福: "zodiac",
  招財進寶: "ingot",
  花開富貴: "lantern",
  蛟龍探寶: "pearl",
  尊爵名仕: "crown",
  閃電飆速: "bolt",
  沙場霸主: "shield",
  荒野槍手: "horseshoe",
  賭聖出擊: "dice",
  煙火盛宴: "firework",
  金雨降臨: "coinrain",
  旭日東昇: "sunrise",
  鑽世奢華: "diamond",
  王朝盛世: "palace",
  福海生財: "wave",
  // 第16～30台（白銀台）專屬台徽，與青銅台完全不同。
  錦鯉躍泉: "koi",
  麒麟獻瑞: "qilin",
  鳳凰來儀: "phoenix",
  星際遠征: "rocket",
  機甲紀元: "mech",
  幽冥秘境: "ghost",
  忍者暗影: "shuriken",
  武士魂: "katana",
  埃及法老: "scarab",
  北歐戰神: "mjolnir",
  馬戲奇幻: "circus",
  蒸汽機關: "gear",
  極光秘寶: "aurora",
  叢林秘境: "leaf",
  深海霓光: "diving",
}

export function totemOf(machine: Pick<Machine, "name">): string {
  return GAMBLE_THEME_TOTEM[machine.name] ?? "coin"
}

// Each machine also carries its own reel-grid pattern ("方格圖案"), deterministic from its id.
export const PATTERN_IDS = ["diamond", "hex", "cross", "brick", "chevron"] as const
export type PatternId = (typeof PATTERN_IDS)[number]

export function patternOf(id: string): PatternId {
  return PATTERN_IDS[fnv(id) % PATTERN_IDS.length]
}

// 轉盤左右兩側的九條中獎連線編碼，固定排版方式（由上而下）：
// 左邊：1 2 3 ／ 4 5 6 ／ 7 8 9。
// 右邊：1 2 9 ／ 4 5 6 ／ 7 8 3。
// 每一組都是「上方符號、本排中心線編碼、下方符號」由上到下排列，設置在最上層。
export function paylineEdgeGroups(): { left: number[][]; right: number[][] } {
  return {
    left: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ],
    right: [
      [1, 2, 9],
      [4, 5, 6],
      [7, 8, 3],
    ],
  }
}

// 九條中獎連線各自專屬的顏色代表，左右兩側同一個編號一律使用同一種顏色。
export const LINE_COLORS: Record<number, string> = {
  1: "oklch(0.62 0.21 25)",
  2: "oklch(0.68 0.19 48)",
  3: "oklch(0.78 0.17 85)",
  4: "oklch(0.72 0.18 120)",
  5: "oklch(0.64 0.16 150)",
  6: "oklch(0.63 0.13 195)",
  7: "oklch(0.58 0.16 250)",
  8: "oklch(0.55 0.18 290)",
  9: "oklch(0.6 0.2 330)",
}

// 每個博奕主題自己專屬的色系代表色（0~360 色相），讓不同主題的機台在背景、
// 資料卡、轉盤底色上都能一眼看出彼此不同，同一主題的青銅/白銀/黃金/鑽石台則共用這個色系。
export const GAMBLE_THEME_HUE: Record<string, number> = {
  瑞獸迎福: 45,
  招財進寶: 20,
  花開富貴: 335,
  蛟龍探寶: 250,
  尊爵名仕: 285,
  閃電飆速: 195,
  沙場霸主: 15,
  荒野槍手: 55,
  賭聖出擊: 355,
  煙火盛宴: 130,
  金雨降臨: 95,
  旭日東昇: 30,
  鑽世奢華: 320,
  王朝盛世: 265,
  福海生財: 175,
  // 第16～30台（白銀台）專屬色系，與青銅台完全不同，彼此也互相區隔。
  錦鯉躍泉: 8,
  麒麟獻瑞: 165,
  鳳凰來儀: 18,
  星際遠征: 215,
  機甲紀元: 200,
  幽冥秘境: 270,
  忍者暗影: 240,
  武士魂: 0,
  埃及法老: 42,
  北歐戰神: 205,
  馬戲奇幻: 350,
  蒸汽機關: 35,
  極光秘寶: 150,
  叢林秘境: 110,
  深海霓光: 185,
}

// 每個博奕主題自己專屬的一套圖騰（取代十二生肖預設造型），固定順序對應：
// 9 個一般圖騰(牛/兔/蛇/馬/羊/猴/雞/狗/豬) + 3 個特殊身分(龍WILD/虎SCATTER/鼠BONUS)。
const GAMBLE_ROLE_ORDER: readonly ["ox", "rabbit", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig", "dragon", "tiger", "rat"] = [
  "ox",
  "rabbit",
  "snake",
  "horse",
  "goat",
  "monkey",
  "rooster",
  "dog",
  "pig",
  "dragon",
  "tiger",
  "rat",
]

// 每個主題固定配置 9 個一般圖騰 + 3 個特殊圖騰，180 個圖案全部互不重複，彼此才有真正的差異感。
export const GAMBLE_THEME_EMOJI: Record<string, string[]> = {
  瑞獸迎福: ["🐃", "🐇", "🐍", "🐎", "🐐", "🐒", "🐓", "🐕", "🐖", "🐲", "🐅", "🐀"],
  招財進寶: ["💰", "🧧", "🏮", "🪙", "🥮", "🎑", "💵", "🤑", "🏦", "🐉", "🦊", "🔑"],
  花開富貴: ["🪷", "🌺", "🐠", "💎", "🍑", "🦢", "🌼", "🦋", "🐢", "🦄", "🐝", "🌸"],
  蛟龍探寶: ["🌊", "🔱", "⚓", "🐚", "🫧", "🐋", "🦑", "🦞", "🦀", "🐊", "🦈", "🐬"],
  尊爵名仕: ["👑", "🎩", "🥂", "🕯", "🎻", "🖋", "🪞", "🎭", "🍷", "🦅", "🗝", "🎷"],
  閃電飆速: ["⚡", "🏎", "🛞", "🔥", "🧨", "🚀", "🛠", "🔩", "⛽", "🐆", "⏱", "🏁"],
  沙場霸主: ["⚔", "🛡", "🏹", "🏰", "📯", "🎖", "🥇", "🍖", "🪓", "🦁", "🐗", "🪖"],
  荒野槍手: ["🤠", "🐴", "🌵", "🥃", "🔫", "🎯", "🐂", "🌾", "🧭", "🦂", "🦨", "💥"],
  賭聖出擊: ["🃏", "🎲", "♠", "♦", "♣", "♥", "🎰", "💴", "🍸", "🐺", "💀", "🎱"],
  煙火盛宴: ["🎉", "🎊", "🎆", "🎇", "🥳", "🎈", "🍾", "🌟", "🎗", "🦚", "🏆", "🎐"],
  金雨降臨: ["💳", "📈", "🧮", "🏧", "💱", "🤲", "🧲", "🐷", "🦦", "🌧", "⛈", "🪅"],
  旭日東昇: ["🌅", "🧿", "🔔", "🏵", "🎏", "🐦", "🌞", "🍀", "🪭", "🦩", "🐥", "🌄"],
  鑽世奢華: ["💍", "👜", "🚗", "⌚", "🏅", "🍹", "🛥", "🏝", "✨", "🦓", "🦉", "🧊"],
  王朝盛世: ["🏛", "📜", "🗿", "🕍", "⚜", "🏯", "🎌", "🪘", "💠", "🐳", "🐯", "🦃"],
  福海生財: ["🏖", "🐟", "💧", "🪼", "🍃", "🎋", "🌿", "🦆", "🐡", "🐙", "🦭", "⛵"],
  // 第16～30台（白銀台）專屬的另一組 180 個圖案，跟青銅台的 180 個完全不重複。
  錦鯉躍泉: ["💮", "🪻", "🍵", "🫖", "🥢", "🍱", "🍙", "🍘", "🏞", "⛩", "🗻", "🦐"],
  麒麟獻瑞: ["🀄", "☯", "🕉", "🪬", "🔮", "🌙", "💫", "⭐", "🪽", "🎴", "🧵", "🪄"],
  鳳凰來儀: ["🪶", "🦜", "🐣", "🪺", "🌋", "🔆", "♨", "🌡", "🔅", "🌤", "🪔", "🌠"],
  星際遠征: ["🛸", "🪐", "🌌", "👽", "🛰", "🌑", "🌒", "🌓", "🌔", "👾", "🔭", "🧑‍🚀"],
  機甲紀元: ["🤖", "⚙", "🔧", "💡", "🔋", "🖥", "📡", "🔌", "🧰", "🪛", "🔗", "🗜"],
  幽冥秘境: ["👻", "🕸", "🦇", "🪦", "🕷", "🌚", "🧙", "🧛", "🫥", "🌫", "🧟", "🔦"],
  忍者暗影: ["🥷", "🗡", "🌘", "🔪", "🧤", "👤", "🕶", "💣", "🪝", "🚪", "🧱", "🪜"],
  武士魂: ["🥋", "🧘", "🍡", "🎍", "🪈", "🥁", "🎎", "🍶", "🗾", "🪢", "🪆", "🍂"],
  埃及法老: ["🏺", "🦎", "🌴", "🐫", "🐪", "👁", "🧞", "☀", "🔺", "🏜", "🪲", "🐾"],
  北歐戰神: ["🔨", "❄", "🛶", "⛰", "🦌", "🥶", "🌨", "🪵", "🧔", "🌀", "🐻", "🗺"],
  馬戲奇幻: ["🎪", "🤡", "🎡", "🎢", "🍿", "🎠", "🪁", "🎟", "🐘", "🤹", "🎹", "🥨"],
  蒸汽機關: ["🕰", "⏳", "⚗", "🧪", "🔬", "💨", "🪫", "🎛", "🪤", "🪚", "🪠", "⛓"],
  極光秘寶: ["🌈", "🔷", "🔹", "🪩", "🌃", "🪨", "🔶", "🔻", "🟢", "🟡", "🟣", "🟦"],
  叢林秘境: ["🦧", "🦥", "🍌", "🌳", "🦗", "🍄", "🪴", "🦟", "🐸", "🦫", "🌲", "🥭"],
  深海霓光: ["🧜", "🪸", "🎣", "🛟", "🔵", "🌐", "🥽", "🤿", "⚫", "🛳", "🚤", "🔘"],
}

export function themeHueOf(themeName: string, fallbackSeed: string): number {
  return GAMBLE_THEME_HUE[themeName] ?? fnv(fallbackSeed) % 360
}

// 每個博奕主題自己專屬的一套「中文名稱」，取代十二生肖的固定文字（牛/兔/蛇...），
// 順序對應 GAMBLE_THEME_EMOJI 同一主題的 12 個圖案：9 個一般圖騰 + WILD + SCATTER + BONUS。
export const GAMBLE_THEME_LABELS: Record<string, string[]> = {
  瑞獸迎福: ["牛", "兔", "蛇", "馬", "羊", "猴", "雞", "狗", "豬", "龍", "虎", "鼠"],
  招財進寶: ["金幣", "紅包", "燈籠", "硬幣", "月餅", "賞月", "鈔票", "發財", "錢莊", "金龍", "靈狐", "鑰匙"],
  花開富貴: ["蓮花", "扶桑", "錦魚", "鑽石", "仙桃", "天鵝", "雛菊", "蝴蝶", "靈龜", "麒麟獸", "蜂后", "櫻花"],
  蛟龍探寶: ["海浪", "三叉戟", "錨", "貝殼", "氣泡", "鯨魚", "章魚", "龍蝦", "螃蟹", "蛟龍", "鯊魚", "海豚"],
  尊爵名仕: ["皇冠", "禮帽", "香檳", "燭台", "小提琴", "鋼筆", "鏡台", "面具", "紅酒", "獵鷹", "金鑰", "薩克斯風"],
  閃電飆速: ["閃電", "賽車", "輪胎", "火焰", "爆發", "火箭", "工具", "螺栓", "油槍", "獵豹", "碼表", "終點旗"],
  沙場霸主: ["長劍", "盾牌", "強弓", "城堡", "號角", "勳章", "金牌", "戰糧", "戰斧", "雄獅", "野豬", "戰盔"],
  荒野槍手: ["牛仔帽", "駿馬", "仙人掌", "威士忌", "手槍", "標靶", "公牛", "麥穗", "指南針", "蠍子", "臭鼬", "爆破"],
  賭聖出擊: ["鬼牌", "骰子", "黑桃", "方塊", "梅花", "紅心", "拉霸機", "鈔票", "雞尾酒", "獨狼", "骸骨", "黑球"],
  煙火盛宴: ["慶祝", "彩球", "煙火", "仙女棒", "派對帽", "氣球", "香檳", "星光", "彩帶", "孔雀", "獎盃", "風鈴"],
  金雨降臨: ["信用卡", "收益曲線", "算盤", "提款機", "匯率", "雙手捧財", "磁力吸金", "小豬撲滿", "水獺", "金雨", "暴風財雲", "彩罐"],
  旭日東昇: ["日出", "護身符", "金鐘", "勳章花", "鯉魚旗", "喜鳥", "旭日", "幸運草", "扇子", "瑞鶴", "雛鳥", "晨曦山"],
  鑽世奢華: ["鑽戒", "名牌包", "跑車", "名錶", "獎牌", "雞尾酒", "遊艇", "私人島", "星輝", "斑馬紋", "智慧貓頭鷹", "冰鑽"],
  王朝盛世: ["宮殿", "詔書", "石像", "聖殿", "紋章", "城閣", "旌旗", "戰鼓", "寶珠", "瑞獸", "猛虎", "祥禽"],
  福海生財: ["沙灘", "錦鯉", "水滴", "水母", "綠葉", "竹葉", "草葉", "水鴨", "河豚", "八爪魚", "海獅", "帆船"],
  // 第16～30台（白銀台）專屬的另一組 15 套名稱，與青銅台完全不同。
  錦鯉躍泉: ["錦鯉花印", "紫藤", "抹茶", "茶壺", "筷子", "便當", "飯糰", "仙貝", "庭園", "鳥居", "靈峰", "錦蝦"],
  麒麟獻瑞: ["麻將牌", "太極", "梵文", "護身符", "水晶球", "月光", "瑞星", "吉星", "羽翼", "符牌", "瑞線", "法杖"],
  鳳凰來儀: ["羽毛", "鸚鵡", "幼鳥", "巢卵", "火山", "烈焰", "溫泉", "熾熱", "微光", "晴空", "油燈", "流星"],
  星際遠征: ["飛碟", "土星", "星河", "外星人", "衛星", "新月", "月相", "半月", "盈月", "星際怪", "望遠鏡", "太空人"],
  機甲紀元: ["機械人", "齒輪", "扳手", "電燈", "電池", "主機", "天線", "插頭", "工具箱", "螺絲刀", "鏈環", "夾具"],
  幽冥秘境: ["幽靈", "蜘蛛網", "蝙蝠", "墓碑", "毒蛛", "暗月", "巫師", "吸血鬼", "幻影", "迷霧", "喪屍", "手電筒"],
  忍者暗影: ["忍者", "忍刀", "暗月", "飛刃", "暗手套", "潛影", "夜視鏡", "炸彈", "暗鉤", "密門", "磚牆", "繩梯"],
  武士魂: ["武士服", "禪定", "糰子", "門松", "竹笛", "太鼓", "人偶", "清酒", "日本地圖", "繩結", "人偶套", "落葉"],
  埃及法老: ["陶罐", "壁虎", "棕櫚", "駱駝", "單峰駝", "荷魯斯之眼", "精靈", "太陽神", "金字塔", "沙漠", "聖甲蟲", "足跡"],
  北歐戰神: ["雷神鎚", "寒冰", "長船", "雪山", "麋鹿", "極寒", "暴雪", "木舟", "戰士", "旋風", "巨熊", "征途"],
  馬戲奇幻: ["馬戲帳", "小丑", "摩天輪", "雲霄飛車", "爆米花", "旋轉木馬", "風箏", "入場券", "大象", "雜耍", "鋼琴", "點心"],
  蒸汽機關: ["齒輪鐘", "沙漏", "蒸餾瓶", "試管", "顯微鏡", "蒸汽", "動力", "操控台", "機關", "鋸齒", "活塞", "鎖鏈"],
  極光秘寶: ["極光", "藍寶石", "冰晶", "光球", "夜幕", "秘礦", "琥珀", "紅寶", "綠寶", "金寶", "紫寶", "藍玉"],
  叢林秘境: ["紅毛猿", "樹懶", "香蕉", "大樹", "蟋蟀", "蘑菇", "盆栽", "蚊蟲", "青蛙", "水獺", "松樹", "芒果"],
  深海霓光: ["美人魚", "珊瑚", "釣魚", "浮環", "藍光", "聲波", "潛鏡", "潛水裝", "黑珠", "遊輪", "快艇", "霓光鈕"],
}

// 依主題名稱組出這一台機台專屬的完整 15 個圖騰「中文名稱」對照表（含 wild/bonus/wheel 對獎身分），
// 讓規則說明書／大廳卡片／飛輪畫面顯示的名稱，跟實際套用的圖案是同一套主題，不再永遠顯示生肖舊名。
export function themeSymbolLabel(themeName: string): Record<SymbolId, string> {
  const list = GAMBLE_THEME_LABELS[themeName] ?? GAMBLE_THEME_LABELS.瑞獸迎福
  const entries = GAMBLE_ROLE_ORDER.map((role, i) => [role, list[i]] as const)
  const byRole = Object.fromEntries(entries) as Record<(typeof GAMBLE_ROLE_ORDER)[number], string>
  return {
    ox: byRole.ox,
    rabbit: byRole.rabbit,
    snake: byRole.snake,
    horse: byRole.horse,
    goat: byRole.goat,
    monkey: byRole.monkey,
    rooster: byRole.rooster,
    dog: byRole.dog,
    pig: byRole.pig,
    dragon: byRole.dragon,
    tiger: byRole.tiger,
    rat: byRole.rat,
    wild: byRole.dragon,
    bonus: byRole.tiger,
    wheel: byRole.rat,
  }
}

// 依主題名稱組出這一台機台專屬的完整 15 個圖騰對照表（含 wild/bonus/wheel 對獎身分）。
export function themeEmojiMap(themeName: string): Record<SymbolId, string> {
  const list = GAMBLE_THEME_EMOJI[themeName] ?? GAMBLE_THEME_EMOJI.瑞獸迎福
  const entries = GAMBLE_ROLE_ORDER.map((role, i) => [role, list[i]] as const)
  const byRole = Object.fromEntries(entries) as Record<(typeof GAMBLE_ROLE_ORDER)[number], string>
  return {
    ox: byRole.ox,
    rabbit: byRole.rabbit,
    snake: byRole.snake,
    horse: byRole.horse,
    goat: byRole.goat,
    monkey: byRole.monkey,
    rooster: byRole.rooster,
    dog: byRole.dog,
    pig: byRole.pig,
    dragon: byRole.dragon,
    tiger: byRole.tiger,
    rat: byRole.rat,
    wild: byRole.dragon,
    bonus: byRole.tiger,
    wheel: byRole.rat,
  }
}

// 九條中獎連線的顏色，隨主題色系整體平移色相（彼此之間仍保持互相可分辨的間距），
// 讓轉盤左右兩側的連線編碼卡片，也隨機台主題呈現不同的色調氛圍。
const LINE_BASE_HUE: Record<number, number> = { 1: 25, 2: 48, 3: 85, 4: 120, 5: 150, 6: 195, 7: 250, 8: 290, 9: 330 }
const LINE_BASE_LC: Record<number, [number, number]> = {
  1: [0.62, 0.21],
  2: [0.68, 0.19],
  3: [0.78, 0.17],
  4: [0.72, 0.18],
  5: [0.64, 0.16],
  6: [0.63, 0.13],
  7: [0.58, 0.16],
  8: [0.55, 0.18],
  9: [0.6, 0.2],
}
const DEFAULT_THEME_HUE = 45

export function lineColorsFor(hue: number): Record<number, string> {
  const shift = hue - DEFAULT_THEME_HUE
  const out: Record<number, string> = {}
  for (let n = 1; n <= 9; n++) {
    const [l, c] = LINE_BASE_LC[n]
    const h = (((LINE_BASE_HUE[n] + shift) % 360) + 360) % 360
    out[n] = `oklch(${l} ${c} ${h})`
  }
  return out
}

function buildCategoryMachines(category: CategoryId, themesForTier: (tierId: TierId) => string[]): Machine[] {
  const out: Machine[] = []
  for (const tier of TIERS) {
    const themes = themesForTier(tier.id)
    for (const theme of themes) {
      const id = `${category}-${tier.id}-${fnv(theme).toString(36)}`
      out.push({
        id,
        name: theme,
        category,
        tier: tier.id,
        hue: category === "gamble" ? themeHueOf(theme, id) : fnv(id) % 360,
        payFactor: tier.factor * (category === "gamble" ? 1.25 : 0.85),
      })
    }
  }
  return out
}

// 青銅台（01～15台）跟白銀台（16～30台）各自使用完全獨立的主題名單，
// 兩組機台的名稱、台徽、配色、圖騰才不會因為共用同一份清單而彼此同步。
export const MACHINES: Machine[] = [
  ...buildCategoryMachines("puzzle", () => PUZZLE_THEMES),
  ...buildCategoryMachines("gamble", (tierId) => (tierId === "silver" ? GAMBLE_THEMES_SILVER : GAMBLE_THEMES)),
]

export const MACHINE_MAP: Record<string, Machine> = Object.fromEntries(MACHINES.map((m) => [m.id, m]))

export function getMachine(id: string): Machine | undefined {
  return MACHINE_MAP[id]
}

export function machinesOf(category: CategoryId): Machine[] {
  return MACHINES.filter((m) => m.category === category)
}

export const COINS_PER_PI = 10000
// 單押注分（每一條連線的押注）範圍 1～500，總押注分 = 單押注分 × 9 條線，
// 所以總押注分自然落在 9～4500 之間，調整步階以「單押注分」為單位。
export const MIN_BET = 1
export const MAX_BET = 500
export const BET_STEP = 1
// 撲克牌桌（10點半／梭哈／牛牛／炸金花）目前每一局最低押注金額，
// 用來判斷玩家幣別是否連最低押注都不夠、該在進場前就擋下來。
export const WAGERED_TABLE_MIN_BET = 50
export const MIN_AUTO = 0
export const MAX_AUTO = 1000
export const AUTO_STEP = 10
export const MAX_SPIN_HISTORY = 30

export type PlayMode = "trial" | "pi"

export const STARTER_TRIAL_COINS = 300
export const STARTER_PI_COINS = 0
export const DAILY_TRIAL_BONUS = 300

  export const SLOTS_PER_CATEGORY = 80
  // 博奕區新增第51、52台（幸運七倍加碼版）、第53台（象棋麻將）後，台數超過原本的50台，
  // 這裡單獨放大博奕區的總台數；第55、56、57台為原益智區排七／麻將妞妞／射龍門三台具押注性機台改歸類過來。
  export const GAMBLE_SLOTS_PER_CATEGORY = 57

export type PuzzleGameId =
  | "xiangqi"
  | "darkchess-classic"
  | "darkchess-variant"
  | "go"
  | "gomoku"
  | "othello"
  | "mahjong"
  | "luzhanqi"
  | "checkers"
  | "tictactoe"
  | "chess"
  | "connect4"
  | "chinese-checkers"
  | "jigsaw"
  | "number-merge"
  | "memory-match"
  | "ludo"
  | "solitaire"
  | "rummikub"
  | "rps-battle"
  | "texas-holdem"
  | "blackjack"
  | "baccarat"
  | "war"
  | "three-card-poker"
  | "klotski"
  | "tetris"
  | "bubble-shooter"
  | "match3"
  | "hanoi"
  | "water-sort"
  | "pipe-connect"
  | "stack-tower"
  | "sequence-sort"
  | "mini-sudoku"
  | "shooting-range"
  | "space-invaders"
  | "tank-battle"
  | "brick-breaker"
  | "zombie-defense"
  | "air-combat"
  | "duel-arena"
  | "penalty-kick"
  | "racing"
  | "parking"
  | "motocross"
  | "drift-racing"
  | "ten-half"
  | "five-pk"
  | "seven-pk"
  | "bridge"
  | "pick-red-points"
  | "dou-dizhu"
  | "thirteen-water"
  | "big-two"
  | "stud-poker"
  | "niuniu"
  | "zha-jinhua"
  | "little-mary"
  | "little-mary-2"
  | "little-mary-3"
  | "little-mary-4"
  | "little-mary-5"
  | "little-mary-6"
  | "little-mary-7"
  | "little-mary-8"
  | "fruit-slot-1"
  | "fruit-slot-2"
  | "little-mary-bonus"
  | "little-mary-bonus-2"
  | "xiangqi-mahjong"
  | "tuitongzai"
  | "suika"
  | "drop-2048"
  | "puyo"
  | "candy-crush"
  | "bejeweled"
  | "dr-mario"
  | "columns-tetris"
  | "gardenscapes"
  | "homescapes"
  | "royal-match"
  | "tower-of-saviors"
  | "puzzle-dragons"
  | "empires-puzzles"
  | "sheep-sheep"
  | "match3d"
  | "balls-merge"
  | "cookies-merge"
  | "planets-merge"

export interface PuzzleGame {
  id: PuzzleGameId
  slotNumber: number
  name: string
  subtitle: string
  status: "ready" | "soon"
  hue: number
  cost: number
  rules: string
  glyph: string
  // 撲克牌桌用：每一局都要自己調整押注、贏了才拿彩金，不像其他益智小遊戲是「進場先扣一次固定費用、之後免費玩」。
  wagered?: boolean
}

export const PUZZLE_GAMES: PuzzleGame[] = [
  {
    id: "xiangqi",
    slotNumber: 1,
    name: "中國象棋",
    subtitle: "AI單人／雙人",
    status: "ready",
    hue: 4,
    cost: 10,
    rules: "雙方輪流移動棋子，率先將對方主帥（將）逼入無路可走者獲勝。走法依傳統象棋規則：車直走、馬走日字、象走田字、士走斜線，兵過河後可橫向移動。",
    glyph: "帥",
  },
  {
    id: "darkchess-classic",
    slotNumber: 2,
    name: "暗棋（傳統）",
    subtitle: "AI單人／雙人",
    status: "ready",
    hue: 24,
    cost: 6,
    rules:
      "所有棋子背面朝上扣置盤面，點選暗棋即可翻開，翻開後依傳統大小順序互相吃子；點選己方明棋後再點目標格即可移動或吃子，吃光對方棋子或使對方無棋可走者獲勝。",
    glyph: "暗",
  },
  {
    id: "darkchess-variant",
    slotNumber: 3,
    name: "暗棋（變異）",
    subtitle: "AI單人／雙人",
    status: "ready",
    hue: 44,
    cost: 6,
    rules:
      "玩法與傳統暗棋相同（點選暗棋翻開，點選己方明棋後點目標格移動或吃子），但砲的攻擊與跳吃方式採用變異規則，增添更多戰術變化，適合喜歡挑戰新玩法的玩家。",
    glyph: "變",
  },
  {
    id: "go",
    slotNumber: 4,
    name: "中國圍棋",
    subtitle: "19×19",
    status: "ready",
    hue: 64,
    cost: 10,
    rules: "雙方輪流在 19×19 棋盤的交叉點上放置黑白棋子，圍地面積較多者獲勝；被完全包圍、沒有氣的棋子會被提走。",
    glyph: "圍",
  },
  {
    id: "gomoku",
    slotNumber: 5,
    name: "五子棋",
    subtitle: "17×17",
    status: "ready",
    hue: 96,
    cost: 4,
    rules: "雙方輪流在棋盤上放置棋子，率先在橫、豎或斜方向連成五子者獲勝。",
    glyph: "五",
  },
  {
    id: "othello",
    slotNumber: 6,
    name: "黑白棋",
    subtitle: "標準規格",
    status: "ready",
    hue: 152,
    cost: 4,
    rules: "雙方輪流放置棋子，只要能夾住對方棋子即可翻轉為己方顏色，終局時棋盤上己方棋子數量較多者獲勝。",
    glyph: "翻",
  },
  {
    id: "mahjong",
    slotNumber: 7,
    name: "中國麻將",
    subtitle: "AI單人（三家電腦）",
    status: "ready",
    hue: 132,
    cost: 10,
    rules: "與三位電腦對手同桌，輪流摸牌、打牌，可吃、碰、槓其他玩家棄牌，率先湊成合法胡牌牌型者胡牌獲勝。",
    glyph: "麻",
  },
  {
    id: "luzhanqi",
    slotNumber: 8,
    name: "陸軍棋",
    subtitle: "AI單人／雙人",
    status: "ready",
    hue: 172,
    cost: 6,
    rules: "雙方棋子軍階保密，對方只能看到背面。交戰時依軍階大小決定勝負，率先奪取對方軍旗或使對方無棋可走者獲勝。",
    glyph: "陸",
  },
  {
    id: "checkers",
    slotNumber: 9,
    name: "跳棋",
    subtitle: "標準規格",
    status: "ready",
    hue: 284,
    cost: 4,
    rules:
      "雙方輪流斜線移動棋子，可跳過並吃掉對方棋子；棋子走到底線可升級為王，升級後可前後斜走；吃光對方棋子或使對方無棋可走者獲勝。",
    glyph: "跳",
  },
  {
    id: "tictactoe",
    slotNumber: 10,
    name: "井字棋",
    subtitle: "3×3放大格式",
    status: "ready",
    hue: 328,
    cost: 3,
    rules: "雙方輪流在 3×3 棋盤上放置符號，率先在橫、豎或斜方向連成三子者獲勝；九格全部填滿仍無人連線則為平手。",
    glyph: "井",
  },
  {
    id: "chess",
    slotNumber: 11,
    name: "國際象棋",
    subtitle: "AI單人／雙人",
    status: "ready",
    hue: 8,
    cost: 7,
    rules:
      "雙方輪流移動棋子，率先將死對方國王者獲勝。走法依標準國際象棋規則：兵、車、馬、象、后、王各有不同走法；本版本暫不支援王車易位與吃過路兵。",
    glyph: "王",
  },
  {
    id: "connect4",
    slotNumber: 12,
    name: "四子棋",
    subtitle: "AI單人／雙人",
    status: "ready",
    hue: 40,
    cost: 4,
    rules: "雙方輪流將棋子投入直立棋盤，率先在橫、豎或斜方向連成四子者獲勝。",
    glyph: "四",
  },
  {
    id: "chinese-checkers",
    slotNumber: 13,
    name: "中國跳棋",
    subtitle: "六角星盤",
    status: "ready",
    hue: 200,
    cost: 6,
    rules:
      "在六角星形棋盤上，雙方輪流移動己方棋子，每次可走一步至相鄰空格，或連續跳過棋子（己方或對方皆可）前進，率先將己方全部10顆棋子移動到對面角落者獲勝。",
    glyph: "星",
  },
  {
    id: "jigsaw",
    slotNumber: 14,
    name: "拼圖樂",
    subtitle: "數字拼板",
    status: "ready",
    hue: 260,
    cost: 3,
    rules: "點按與空格相鄰的方塊將其滑入空格，依序排列 1 到 15 即完成挑戰。",
    glyph: "拼",
  },
  {
    id: "number-merge",
    slotNumber: 15,
    name: "數字消除",
    subtitle: "2048 玩法",
    status: "ready",
    hue: 300,
    cost: 3,
    rules: "上下左右滑動或按方向鍵，相同數字相鄰時會合併加倍，合成出 2048 即挑戰成功。",
    glyph: "數",
  },
  {
    id: "memory-match",
    slotNumber: 16,
    name: "翻牌記憶",
    subtitle: "配對挑戰",
    status: "ready",
    hue: 340,
    cost: 3,
    rules: "翻開兩張卡牌，配對成功的圖案會保留在桌面，用最少翻牌次數配對完所有卡牌者獲勝。",
    glyph: "憶",
  },
  {
    id: "ludo",
    slotNumber: 17,
    name: "飛行棋",
    subtitle: "雙人對戰",
    status: "ready",
    hue: 16,
    cost: 5,
    rules: "擲骰子決定步數，讓己方所有棋子從起點繞行棋盤回到終點，途中可攻擊對手棋子使其重新出發。",
    glyph: "飛",
  },
  {
    id: "solitaire",
    slotNumber: 18,
    name: "接龍紙牌",
    subtitle: "經典單人牌戲",
    status: "ready",
    hue: 116,
    cost: 3,
    rules: "依照花色與數字順序將所有紙牌排列整理到基礎堆，完成四組花色的完整接龍即過關。",
    glyph: "接",
  },
  {
    id: "rummikub",
    slotNumber: 19,
    name: "拉密牌",
    subtitle: "數字拼牌對戰",
    status: "ready",
    hue: 220,
    cost: 6,
    rules: "利用手中數字牌組成連續順子或同數字組合並擺上桌面，率先出完手牌者獲勝。",
    glyph: "拉",
  },
  {
    id: "rps-battle",
    slotNumber: 20,
    name: "猜拳大戰",
    subtitle: "AI對戰",
    status: "ready",
    hue: 356,
    cost: 2,
    rules: "與電腦同時出拳，剪刀、石頭、布互相克制，累積局數領先者獲得最終勝利。",
    glyph: "拳",
  },
  {
    id: "texas-holdem",
    slotNumber: 21,
    name: "德州撲克",
    subtitle: "單挑 AI 簡化版",
    status: "ready",
    hue: 350,
    cost: 6,
    rules: "您與 AI 各持 2 張手牌，加上桌面 5 張公共牌，選擇「跟注」開牌比大小，或「棄牌」放棄本手，牌型較高者贏得底池。",
    glyph: "撲",
  },
  {
    id: "blackjack",
    slotNumber: 22,
    name: "21點",
    subtitle: "Blackjack 對戰莊家",
    status: "ready",
    hue: 10,
    cost: 4,
    rules: "點數盡量接近21點但不超過。A可算1或11點，J/Q/K算10點。可選擇補牌或停牌，莊家會持牌到17點以上為止。",
    glyph: "21",
  },
  {
    id: "baccarat",
    slotNumber: 23,
    name: "百家樂",
    subtitle: "押莊／押閒／押和",
    status: "ready",
    hue: 30,
    cost: 4,
    rules: "押注閒家、莊家或和局後開牌，牌面點數加總取個位數比大小，數字較大者贏，補牌規則自動依標準百家樂補牌表進行。",
    glyph: "百",
  },
  {
    id: "war",
    slotNumber: 24,
    name: "戰爭牌",
    subtitle: "比大小對戰 AI",
    status: "ready",
    hue: 50,
    cost: 2,
    rules: "牌堆平分兩半，每輪雙方各翻一張牌比大小，較大者贏得整輪的牌，平手則燒牌再比，最終持牌較多者獲勝。",
    glyph: "戰",
  },
  {
    id: "three-card-poker",
    slotNumber: 25,
    name: "三張牌撲克",
    subtitle: "對戰莊家",
    status: "ready",
    hue: 70,
    cost: 4,
    rules: "您與莊家各拿 3 張牌，看牌後選擇「跟注」開牌比大小，或「棄牌」放棄本局，牌型較高者獲勝。",
    glyph: "三",
  },
  {
    id: "klotski",
    slotNumber: 26,
    name: "華容道",
    subtitle: "滑塊重組",
    status: "ready",
    hue: 18,
    cost: 7,
    rules: "在有限的棋盤空間內，滑動大小不同的木塊，將最大的「曹操」木塊移動到棋盤下方出口即可過關。",
    glyph: "容",
  },
  {
    id: "tetris",
    slotNumber: 27,
    name: "俄羅斯方塊",
    subtitle: "堆疊消行",
    status: "ready",
    hue: 210,
    cost: 9,
    rules: "左右滑動移動掉落方塊，輕點旋轉，向下滑動快速落下。填滿一整行即可消除得分，堆到頂端遊戲結束。",
    glyph: "疊",
  },
  {
    id: "bubble-shooter",
    slotNumber: 28,
    name: "泡泡龍",
    subtitle: "同色消除",
    status: "ready",
    hue: 190,
    cost: 6,
    rules: "點選欄位發射目前顏色的泡泡，3 個以上同色相連即會消除得分，泡泡疊到最上方就會結束遊戲。",
    glyph: "泡",
  },
  {
    id: "match3",
    slotNumber: 29,
    name: "開心消消樂",
    subtitle: "交換三連消",
    status: "ready",
    hue: 330,
    cost: 4,
    rules: "點選一個方塊再點選相鄰方塊即可交換，湊出 3 個以上同色連線就會消除並往下補位，可連鎖觸發更多消除。",
    glyph: "消",
  },
  {
    id: "hanoi",
    slotNumber: 30,
    name: "河內塔",
    subtitle: "圓盤搬移",
    status: "ready",
    hue: 250,
    cost: 8,
    rules: "點選一根柱子選取最上方的圓盤，再點選目標柱子即可移動。大圓盤不能疊在小圓盤上面，把所有圓盤移到最右邊柱子就過關。",
    glyph: "塔",
  },
  {
    id: "water-sort",
    slotNumber: 31,
    name: "分色排序",
    subtitle: "試管倒色",
    status: "ready",
    hue: 200,
    cost: 7,
    rules: "點選一支試管選取最上層顏色，再點選另一支試管即可倒入，只能倒到空試管或最上層同色的試管。把每支試管都排成單一顏色即可過關。",
    glyph: "色",
  },
  {
    id: "pipe-connect",
    slotNumber: 32,
    name: "接水管",
    subtitle: "旋轉接通",
    status: "ready",
    hue: 205,
    cost: 6,
    rules: "點擊管線方塊即可旋轉 90 度，把左上角的水源一路接通到右下角的出口，接通全程即可過關。",
    glyph: "管",
  },
  {
    id: "stack-tower",
    slotNumber: 33,
    name: "疊疊樂",
    subtitle: "抓準時機",
    status: "ready",
    hue: 22,
    cost: 4,
    rules: "上方色塊會左右來回移動，點擊畫面把它疊到下方色塊上，重疊越少方塊會越窄，沒有重疊就會掉落結束遊戲。",
    glyph: "樓",
  },
  {
    id: "sequence-sort",
    slotNumber: 34,
    name: "排列大師",
    subtitle: "交換排序",
    status: "ready",
    hue: 160,
    cost: 7,
    rules: "點選兩個數字方塊即可互相交換位置，用最少交換次數把所有數字排列成由小到大的順序即可過關。",
    glyph: "排",
  },
  {
    id: "mini-sudoku",
    slotNumber: 35,
    name: "迷你數獨",
    subtitle: "6x6 盤面",
    status: "ready",
    hue: 270,
    cost: 9,
    rules: "每一行、每一欄、每個 2x3 小宮格內，數字 1 到 6 都不能重複出現，填滿整個盤面且沒有衝突即可過關。",
    glyph: "獨",
  },
  {
    id: "shooting-range",
    slotNumber: 36,
    name: "打靶場",
    subtitle: "限時點擊靈活靶標",
    status: "ready",
    hue: 25,
    cost: 6,
    rules: "靶標會隨機在網格上亮起，出現後盡快點擊得分，時間到之前累積達到目標分數即算過關。",
    glyph: "靶",
  },
  {
    id: "space-invaders",
    slotNumber: 37,
    name: "太空侵略者",
    subtitle: "清光整編隊即獲勝",
    status: "ready",
    hue: 150,
    cost: 8,
    rules: "左右移動戰機閃避敵彈，發射砲彈擊落整編隊的外星戰艦，若編隊逼近或生命耗盡則挑戰失敗。",
    glyph: "侵",
  },
  {
    id: "tank-battle",
    slotNumber: 38,
    name: "坦克大戰",
    subtitle: "率先命中對方 3 次獲勝",
    status: "ready",
    hue: 95,
    cost: 8,
    rules: "左右移動戰車並發射砲彈，砲彈命中對方所在直線即得分，率先命中對方 3 次者獲勝。",
    glyph: "坦",
  },
  {
    id: "brick-breaker",
    slotNumber: 39,
    name: "打磚塊",
    subtitle: "打光所有磚塊即過關",
    status: "ready",
    hue: 200,
    cost: 7,
    rules: "左右拖曳擋板反彈球，打掉所有磚塊即過關；球掉出畫面會扣一條生命，生命耗盡則挑戰失敗。",
    glyph: "磚",
  },
  {
    id: "zombie-defense",
    slotNumber: 40,
    name: "殭屍防禦",
    subtitle: "撐過全部波次即獲勝",
    status: "ready",
    hue: 140,
    cost: 9,
    rules: "殭屍會沿著車道往左逼近，點擊殭屍即可消滅（部分殭屍需點兩次），讓殭屍抵達最左側會扣血，撐過所有波次即獲勝。",
    glyph: "屍",
  },
  {
    id: "air-combat",
    slotNumber: 41,
    name: "空戰爭霸",
    subtitle: "存活並達到目標分數",
    status: "ready",
    hue: 260,
    cost: 9,
    rules: "戰機會自動開火，左右移動閃避敵機並清空對方，限時內存活且分數達標即獲勝，生命耗盡則挑戰失敗。",
    glyph: "空",
  },
  {
    id: "bridge",
    slotNumber: 43,
    name: "橋牌",
    subtitle: "與夥伴組隊，對戰電腦兩家",
    status: "ready",
    hue: 220,
    cost: 8,
    rules:
      "您與北家夥伴組隊，對戰西、東兩家電腦。每輪四人依序出牌，須跟牌（有同花色必須跟出），沒有時可打任意花色或王牌。同花色最大或王牌最大者贏得該輪，13輪出完後您方合計贏得7輪以上即獲勝。",
    glyph: "橋",
  },
  {
    id: "pick-red-points",
    slotNumber: 44,
    name: "撿紅點",
    subtitle: "出牌配對桌面同點數的牌",
    status: "ready",
    hue: 350,
    cost: 5,
    rules:
      "輪流出一張牌：若手上出的牌點數跟桌面上的牌相同，就能把桌面上所有同點數的牌連同這張牌一起撿走得分；沒有相同點數則留在桌面上。整副牌出完後比較雙方撿到的紅心／方塊點數：一般紅牌 1 分，紅色 10、J、Q、K 各算 10 分，總分較高者獲勝。",
    glyph: "紅",
  },
  {
    id: "dou-dizhu",
    slotNumber: 45,
    name: "鬥地主",
    subtitle: "地主對抗兩位農民",
    status: "ready",
    hue: 15,
    cost: 8,
    rules:
      "發牌後系統依牌力自動指定一位地主（可能是您也可能是電腦），地主多拿3張底牌，其餘兩家結為農民聯手對抗地主。輪流出牌，須出比上家更大的同類型牌組，出不了就按過牌。地主先出完牌即地主獲勝，任一農民先出完牌則農民方獲勝。",
    glyph: "鬥",
  },
  {
    id: "penalty-kick",
    slotNumber: 46,
    name: "足球射門",
    subtitle: "選方向對戰門將",
    status: "ready",
    hue: 140,
    cost: 8,
    rules: "選擇左路、中路或右路射門，門將會隨機撲向一側，方向不同則進球，5輪內進球數達標即過關。",
    glyph: "足",
  },
  {
    id: "racing",
    slotNumber: 47,
    name: "賽車競速",
    subtitle: "切換車道閃避來車",
    status: "ready",
    hue: 260,
    cost: 8,
    rules: "左右切換車道閃避迎面而來的車輛，抵達終點距離前生命耗盡則挑戰失敗。",
    glyph: "賽",
  },
  {
    id: "parking",
    slotNumber: 48,
    name: "停車挑戰",
    subtitle: "步數內停進車位",
    status: "ready",
    hue: 200,
    cost: 7,
    rules: "使用左右轉向與前進按鈕操控車輛，在步數與碰撞次數用盡前，把車頭朝向正確地停進標記的車位即過關。",
    glyph: "停",
  },
  {
    id: "motocross",
    slotNumber: 49,
    name: "越野摩托車",
    subtitle: "跳躍越過坑洞抵達終點",
    status: "ready",
    hue: 80,
    cost: 8,
    rules: "點擊跳躍讓摩托車起跳，抓準時機越過前方坑洞障礙，抵達終點前生命耗盡則挑戰失敗。",
    glyph: "越",
  },
  {
    id: "drift-racing",
    slotNumber: 50,
    name: "極速漂移",
    subtitle: "順彎道轉向累積分數",
    status: "ready",
    hue: 320,
    cost: 9,
    rules:
      "按住左右按鈕跟著賽道彎曲方向轉向，維持在賽道範圍內並累積漂移分數，抵達終點且分數達標即過關；長時間偏離賽道則挑戰失敗。",
    glyph: "漂",
  },
  {
    id: "duel-arena",
    slotNumber: 42,
    name: "決鬥擂台",
    subtitle: "回合制對戰，率先擊倒對手",
    status: "ready",
    hue: 15,
    cost: 10,
    rules: "選擇攻擊累積必殺氣力、防禦減半下一次受到的傷害，或蓄滿 3 點氣力後使出必殺技，率先讓對手血量歸零者獲勝。",
    glyph: "鬥",
  },
  {
    id: "liars-cards",
    slotNumber: 51,
    name: "吹牛",
    subtitle: "蓋牌宣告點數，猜對手真假",
    status: "ready",
    hue: 30,
    cost: 6,
    rules:
      "與電腦A、電腦B三人輪流出牌：每次選1~4張手牌蓋起來打出，並宣告點數（須依A→2→3→...→K→A順序輪替，可誠實出牌也可吹牛虛報）。輪到其他人時可選擇「相信」直接輪下一家，或「抓吹牛」掀牌驗證——抓對了出牌者收回桌面所有累積的牌，抓錯了換抓人的自己收回。誰最先把手牌出光且沒被抓到吹牛即獲勝。",
    glyph: "吹",
  },
  {
    id: "sevens",
    slotNumber: 52,
    name: "排七",
    subtitle: "四人接龍，蓋牌分數最低獲勝",
    status: "ready",
    hue: 150,
    cost: 8,
    rules:
      "52張牌（不含鬼牌）四人各發13張，持♠7者優先開局，其餘花色的7在輪到自己時也要打出才能開啟該花色軌道。開局後可往上(8→K)或往下(6→A)接牌。輪到你時若有牌可接必須出牌，完全無牌可接才能蓋下一張（面朝下，遊戲結束前不可再打出）。結束後比較各自蓋牌點數（A=1、2~10依牌面、J=11、Q=12、K=13；蓋A或K加倍計分），分數最低者獲勝；完全沒蓋牌（完美出牌）最為漂亮。",
    glyph: "七",
  },
  {
    id: "sichuan-mahjong",
    slotNumber: 53,
    name: "四川麻將（血戰到底）",
    subtitle: "缺一門血戰，一家胡牌照樣續打",
    status: "ready",
    hue: 25,
    cost: 0,
    rules:
      "四人對戰，只使用筒、條、萬三門（無風牌、無花牌）。開局依手牌自動判定每家要缺哪一門，之後摸到缺的那門牌一律跳過。一家胡牌後立刻離場，遊戲不結束，剩下的人繼續血戰，直到三家都胡牌或牌摸完才算整局結束。",
    glyph: "血",
  },
  {
    id: "malaysia-mahjong",
    slotNumber: 54,
    name: "馬來西亞三聯麻將",
    subtitle: "三人對戰，飛牌萬能大牌多",
    status: "ready",
    hue: 300,
    cost: 0,
    rules:
      "僅由3人對戰的麻將變體，牌庫只保留筒子、字牌、花牌，並移除索子與萬子，再加入飛牌（萬能牌，可代表任何一張牌湊成組合）。因為牌數少、花牌與飛牌多，湊成大牌（如字一色）的機率明顯提高，節奏刺激。",
    glyph: "飛",
  },
  {
    id: "mahjong-pengpeng",
    slotNumber: 55,
    name: "碰碰胡",
    subtitle: "簡化版麻將，只碰不吃",
    status: "ready",
    hue: 160,
    cost: 0,
    rules:
      "簡化版麻將，牌庫只用筒子（一筒～九筒）與七種字牌，取消吃牌，只能碰或摸。手牌固定8張，四人輪流摸牌、打牌，其他人可以碰別人打出的牌，湊成2組刻子（三張相同）加上1對將牌即可胡牌，適合新手與長輩一起玩。",
    glyph: "碰",
  },
  {
    id: "mahjong-sevens",
    slotNumber: 56,
    name: "麻將接龍",
    subtitle: "仿排七，筒索萬三門接龍",
    status: "ready",
    hue: 170,
    cost: 0,
    rules:
      "仿照撲克牌排七規則，改用筒子、索子、萬子三門數字牌（各門1～9，各4張）。以五筒、五索、五萬為基準先鋪在桌上開局，四人輪流出相鄰數字接龍，無牌可接須蓋牌（蓋牌點數計入扣分），最後誰蓋牌總分最少就獲勝，全部出完沒蓋過牌算完美出牌。",
    glyph: "接",
  },
  {
    id: "riichi-mahjong",
    slotNumber: 57,
    name: "日本立直麻將",
    subtitle: "東風戰，立直/寶牌/振聽",
    status: "ready",
    hue: 260,
    cost: 0,
    rules:
      "4人標準136張牌東風戰簡化版。門清聽牌可宣告立直（押1000點，之後只能摸切），開局翻一張寶牌指示牌，湊到寶牌額外加番，自己棄過的牌不能再胡別人（振聽），且無役不能胡牌。計分採簡化版（固定視為30符）換算番數，略過一發、裏寶牌等細節。",
    glyph: "立",
  },
  {
    id: "mahjong-solitaire",
    slotNumber: 58,
    name: "麻將連連看",
    subtitle: "找出相同圖案，兩折點消除",
    status: "ready",
    hue: 150,
    cost: 0,
    rules:
      "單人益智玩法：將一副麻將牌（筒子/索子/萬子/字牌共34種圖案）排成6列×8欄共48張、24對。尋找兩張圖案相同、連線路徑轉折不超過兩次的牌進行消除，目標是在180秒時限內清空整個盤面，卡關時可用提示或洗牌。",
    glyph: "連",
  },
  {
    id: "merge-2048",
    slotNumber: 59,
    name: "2048合併",
    subtitle: "滑動合併數字，挑戰2048",
    status: "ready",
    hue: 40,
    cost: 0,
    rules:
      "4×4 網格，向上/下/左/右滑動（或用方向鍵）：所有方塊往該方向靠攏，相同數字相撞即合併相加（2+2=4、4+4=8...），每次滑動後空白處隨機生成一個新方塊（90%機率是2，10%機率是4）。目標是合成出 2048，合成後仍可繼續挑戰更高分數。盤面填滿且四個方向都無法再合併時，即結束挑戰。畫面會提示建議滑動方向，協助將最大數字固定在同一角落。",
    glyph: "2048",
  },
  {
    id: "city-2048",
    slotNumber: 60,
    name: "City 2048",
    subtitle: "合併建築，從草地蓋到摩天大樓",
    status: "ready",
    hue: 100,
    cost: 0,
    rules:
      "玩法跟 2048 完全相同：4×4 網格向上/下/左/右滑動，相同建築相撞即升級合併，每次滑動後隨機長出一株新芽。不同的是把數字換成城市演化圖像——草地、花圃、樹木、小屋，一路蓋到摩天大樓，畫面也會提示建議滑動方向。",
    glyph: "城",
  },
  {
    id: "merge-2048-undo",
    slotNumber: 61,
    name: "2048 Undo",
    subtitle: "滑動合併，還能倒退悔棋",
    status: "ready",
    hue: 40,
    cost: 0,
    rules:
      "玩法跟 2048 完全相同：4×4 網格滑動合併相同數字，目標合成2048。這一台額外提供「倒退悔棋」功能，最多可連續悔棋5步，滑錯方向能馬上退回重新選擇，容錯率大幅降低，適合輕鬆體驗。",
    glyph: "悔",
  },
  {
    id: "triple-town",
    slotNumber: 62,
    name: "三重鎮合併",
    subtitle: "合併建築，小心熊群搗亂",
    status: "ready",
    hue: 120,
    cost: 0,
    rules:
  "6×6 棋盤，點選空格放置目前手上的道具。草地集滿3個升級成灌木，接著依序樹木、小屋、大屋、城堡、浮空城。水晶是萬能牌，有可合併鄰居時自動幫忙合併，否則變成無法利用的岩石。棋盤上偶爾會有熊或黑熊闖入阻礙擺放，把牠們的去路封死就會死亡變成墓碑，墓碑也能集滿3個升級成教堂、大教堂、寶箱。拿到機器人道具時點選任一物件即可清除，旁邊的儲存槽可以先存放暫時用不到的道具。棋盤填滿且無法再放置時遊戲結束。",
    glyph: "鎮",
  },
  {
    id: "suika",
    slotNumber: 63,
    name: "合成大西瓜",
    subtitle: "左右移動落下水果，相同合併變大",
    status: "ready",
    hue: 15,
    cost: 8,
    rules:
      "容器上方可左右移動後放下水果，水果會因物理重力落下滾動。兩顆相同的水果碰在一起會合併成更大一級的新水果，從最小的櫻桃一路合成到最大的西瓜。水果堆到容器頂端的警戒線就會遊戲結束，盡量維持穩定堆疊、持續合併拿高分。",
    glyph: "瓜",
  },
  {
    id: "drop-2048",
    slotNumber: 64,
    name: "2048下落版",
    subtitle: "數字方塊落下疊加，合併翻倍",
    status: "ready",
    hue: 35,
    cost: 8,
    rules:
      "數字方塊由上方落下，可左右移動選擇欄位、向下加速落下。方塊疊到相同數字的方塊上方或旁邊時會合併相加（2+2=4、4+4=8...），持續合併挑戰更高數字。方塊堆到最上方出生點時遊戲結束。",
    glyph: "落",
  },
  {
    id: "puyo",
    slotNumber: 65,
    name: "噗喲噗喲",
    subtitle: "成對軟泥落下，同色四個以上消除",
    status: "ready",
    hue: 300,
    cost: 8,
    rules:
      "成對的彩色軟泥由上方落下，可左右移動、旋轉改變兩顆軟泥的相對方向，向下加速落下。落地後若有4個以上相同顏色的軟泥相連，就會一次消除，消除後上方軟泥落下可能引發連續的連鎖消除。軟泥堆到出生點時遊戲結束。",
    glyph: "喲",
  },
  {
    id: "dr-mario",
    slotNumber: 66,
    name: "瑪利歐醫生",
    subtitle: "膠囊落下堆疊，連成一線消除病毒",
    status: "ready",
    hue: 200,
    cost: 8,
    rules:
      "雙色膠囊由上方落下，可左右移動、旋轉改變兩半膠囊的方向，向下加速落下。同一顏色（膠囊或病毒）在同一橫排或直排連成4個以上就會一次消除。目標是清除棋盤上所有病毒即可過關，膠囊堆到出生點時遊戲結束。",
    glyph: "醫",
  },
  {
    id: "columns-tetris",
    slotNumber: 67,
    name: "寶石方塊／俄羅斯方塊",
    subtitle: "切換兩種古典掉落消除玩法",
    status: "ready",
    hue: 255,
    cost: 8,
    rules:
      "可切換兩種玩法：寶石方塊——三連直立寶石落下，移動旋轉調整順序，同色橫直斜連成3個以上消除；俄羅斯方塊——經典方塊落下，移動旋轉調整形狀，填滿一整橫排即消除。棋盤堆滿時遊戲結束。",
    glyph: "疊",
  },
  {
    id: "candy-crush",
    slotNumber: 68,
    name: "糖果傳奇",
    subtitle: "交換糖果三連消，衝目標分數過關",
    status: "ready",
    hue: 345,
    cost: 6,
    rules:
      "點選一顆糖果再點選相鄰糖果即可交換，湊出 3 個以上同色連線就會消除：4連變成條紋糖（可清掉整行/整列），5連變成炫彩糖（可清掉同色全部糖果）。在限定步數內達到目標分數即可過關。",
    glyph: "糖",
  },
  {
    id: "bejeweled",
    slotNumber: 69,
    name: "寶石迷陣",
    subtitle: "三消遊戲鼻祖，交換寶石連線消除",
    status: "ready",
    hue: 260,
    cost: 5,
    rules:
      "點選一顆寶石再點選相鄰寶石即可交換，湊出 3 個以上同色連線就會消除並往下補位，可連續觸發連鎖反應獲得加成分數，沒有步數限制，持續累積您的最高紀錄。",
    glyph: "鑽",
  },
  {
    id: "gardenscapes",
    slotNumber: 70,
    name: "夢幻花園",
    subtitle: "三消賺金幣，整修荒廢花園",
    status: "ready",
    hue: 140,
    cost: 6,
    rules:
      "點選一個花園元素再點選相鄰元素即可交換，湊出 3 個以上同色連線就會消除並獲得金幣。金幣累積到目標後按「完成整修」推進花園修復進度，依序完成 3 項整修任務即可過關。",
    glyph: "園",
  },
  {
    id: "homescapes",
    slotNumber: 71,
    name: "夢幻家園",
    subtitle: "三消賺金幣，裝潢夢想豪宅",
    status: "ready",
    hue: 25,
    cost: 6,
    rules:
  "點選一個家飾元素再點選相鄰元素即可交換，湊出 3 個以上同色連線就會消除並獲得金幣。金幣累積到目標後按「完成裝潢」推進豪宅修復進度，依序完成 3 項裝潢任務即可過關。",
  glyph: "家",
  },
  {
    id: "royal-match",
    slotNumber: 72,
    name: "皇家消除",
    subtitle: "三消賺金幣，修復古老城堡",
    status: "ready",
    hue: 45,
    cost: 6,
    rules:
      "點選一個皇家徽章再點選相鄰徽章即可交換，湊出 3 個以上同色連線就會消除並獲得金幣。金幣累積到目標後按「完成修復」推進城堡修復進度，依序完成 3 項修復任務即可過關。",
    glyph: "堡",
  },
  {
    id: "tower-of-saviors",
    slotNumber: 73,
    name: "救世之塔",
    subtitle: "寶石消除 + 卡牌戰鬥養成",
    status: "ready",
    hue: 265,
    cost: 10,
    rules:
      "交換相鄰寶石湊出 3 個以上同色連線，對應屬性的隊友就會對敵人發動攻擊，粉紅愛心可以治療全隊。擊敗敵人過關後隊伍會升級、恢復滿血前往下一關，六關全破後重新開始更高難度的循環，隊伍全滅則挑戰失敗。",
    glyph: "塔",
  },
  {
    id: "puzzle-dragons",
    slotNumber: 74,
    name: "智龍迷城",
    subtitle: "寶石消除 + 屬性相剋戰鬥",
    status: "ready",
    hue: 200,
    cost: 10,
    rules:
      "交換相鄰寶石湊出同色連線，對應屬性的飛龍會對敵人發動攻擊：火克木、木克水、水克火、光暗互剋，用剋制屬性攻擊會造成更高傷害。粉紅愛心可以治療全隊，擊敗所有敵人後前往下一座迷宮並升級。",
    glyph: "龍",
  },
  {
    id: "empires-puzzles",
    slotNumber: 75,
    name: "帝國與拼圖",
    subtitle: "寶石消除 + 簡易城建與 PvP",
    status: "ready",
    hue: 35,
    cost: 10,
    rules:
      "交換相鄰寶石湊出同色連線，對應屬性的英雄會攻擊對手，擊敗後獲得木材、石材、糧食等建材。粉紅愛心治療全隊，擊敗所有對手即可晉級下一回合 PvP，隊伍升級並持續累積建材壯大帝國。",
    glyph: "帝",
  },
  {
    id: "sheep-sheep",
    slotNumber: 76,
    name: "羊了個羊",
    subtitle: "堆疊點擊收集，湊滿三個同款消除",
    status: "ready",
    hue: 95,
    cost: 8,
    rules:
      "畫面堆疊了四層牧場小物，只能點擊沒有被上層物件壓住的圖案，點擊後收進下方收集槽。槽裡湊滿 3 個一樣的圖案會自動消除，收集槽滿了（7格）還沒湊到三連就會挑戰失敗，清空所有小物即可過關。",
    glyph: "羊",
  },
  {
    id: "match3d",
    slotNumber: 77,
    name: "3D消除",
    subtitle: "立體雜物堆點擊收集三消",
    status: "ready",
    hue: 220,
    cost: 8,
    rules:
      "畫面堆滿五層立體雜物，只能點擊沒有被上層物件壓住、顏色明亮的物品，點擊後收進下方收集欄。欄裡湊滿 3 個相同寶物會自動消除，收集欄滿了（7格）還沒湊到三連就會挑戰失敗，清空雜物堆即可過關。",
    glyph: "3D",
  },
  {
  id: "balls-merge",
  slotNumber: 78,
  name: "球類合成",
  subtitle: "左右移動尋找落點，相同球合成更大的球",
  status: "ready",
  hue: 100,
  cost: 8,
  rules:
  "球固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下球」後會緩緩落下。兩個等級相同的球碰到會合併升級成下一等級的新球，從乒乓球一路合成到橄欖球。球堆到頂端危險線且靜止不動時，遊戲結束。",
  glyph: "球",
  },
  {
  id: "cookies-merge",
  slotNumber: 79,
  name: "餅乾合成",
  subtitle: "左右移動尋找落點，相同餅乾合成更大的餅乾",
  status: "ready",
  hue: 35,
  cost: 8,
  rules:
  "餅乾固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下餅乾」後會緩緩落下。兩個等級相同的餅乾碰到會合併升級成下一等級的新餅乾，從三角餅乾一路合成到超大餅。餅乾堆到頂端危險線且靜止不動時，遊戲結束。",
  glyph: "餅",
  },
  {
  id: "planets-merge",
  slotNumber: 80,
  name: "星球合成",
  subtitle: "左右移動尋找落點，相同星球合成更大的星球",
  status: "ready",
  hue: 260,
  cost: 8,
  rules:
  "星球固定從框框頂端中間出現，用左右按鈕（或直接拖曳畫面）移動尋找想要的落下位置，按「放下星球」後會緩緩落下。兩個等級相同的星球碰到會合併升級成下一等級的新星球，從星星一路合成到星系。星球堆到頂端危險線且靜止不動時，遊戲結束。",
  glyph: "宇",
  },
  ]

export const PUZZLE_GAME_MAP: Record<string, PuzzleGame> = Object.fromEntries(PUZZLE_GAMES.map((g) => [g.id, g]))

// 博奕區撲克牌桌，從第 31 台開始改建（其餘機台仍保留原本的老虎機盤面）。
// 排列順序依創辦人指定的博奕區優先順序：10點半→21點→7PK→13張(十三水)→大老二→梭哈→牛牛→炸金花→百家樂。
// 21點與百家樂沿用益智區已完成的同一套牌局引擎（id 相同、規則相同），其餘 7 款規則尚待創辦人確認細節後才會實際開放。
export const GAMBLE_GAMES: PuzzleGame[] = [
  {
    id: "ten-half",
    slotNumber: 31,
    name: "10點半",
    subtitle: "比點數大小",
    status: "ready",
    hue: 355,
    cost: 100,
    rules:
      "先調整押注金額再開局。開局各發2張牌，可選擇「補牌」或「停牌」，越接近10.5點越好，超過10.5點即爆牌。A算1點，J/Q/K各算0.5點，其餘照牌面點數計算。發牌就剛好10.5點稱為「天生半」，直接開牌且獲勝為3倍彩金；一般獲勝為2倍彩金，平手退回押注。",
    glyph: "半",
    wagered: true,
  },
  {
    id: "blackjack",
    slotNumber: 32,
    name: "21點",
    subtitle: "Blackjack 對戰莊家",
    status: "ready",
    hue: 10,
    cost: 4,
    rules: "點數盡量接近21點但不超過。A可算1或11點，J/Q/K算10點。可選擇補牌或停牌，莊家會持牌到17點以上為止。",
    glyph: "21",
    wagered: true,
  },
  {
    id: "five-pk",
    slotNumber: 33,
    name: "5PK",
    subtitle: "換牌比牌型，含比倍",
    status: "ready",
    hue: 25,
    cost: 4,
    rules:
      "先調整押注金額，按「發牌」拿5張牌（牌堆含2張鬼牌），勾選要保留的牌後按「換牌」重新抽剩下的牌（僅一次機會）。結算牌型對照賠率：同花大順500倍、五條(4同點+1鬼牌)200倍、同花順120倍、正/副鐵支50倍、葫蘆7倍、同花5倍、順子3倍、三條2倍、大兩對(其中一組J以上)1倍，其餘不中獎。中獎後可選擇「比倍」：押大/小或紅/黑，猜對翻倍、猜錯歸零，也可隨時「兌現」入袋。",
    glyph: "5",
    wagered: true,
  },
  {
  id: "thirteen-water",
  slotNumber: 34,
  name: "十三支",
    subtitle: "13張分三墩比大小",
    status: "ready",
    hue: 265,
    cost: 100,
    rules:
      "先調整押注金額，再按「發牌」。系統會自動幫玩家與莊家把各自的13張牌，排成頭道(3張)、中道(5張)、尾道(5張)三墩最強且不犯規的組合，三墩分別比大小。三墩全贏（全垂）得5倍彩金；淨勝2墩得2倍；淨勝1墩得1.5倍；平分退回押注；淨輸則不退。",
    glyph: "十",
    wagered: true,
  },
  {
    id: "big-two",
    slotNumber: 35,
    name: "大老二",
    subtitle: "出牌接龍比大小",
    status: "ready",
    hue: 200,
    cost: 100,
    rules:
      "先調整押注金額，再按「發牌」與莊家對戰。簡化版規則：僅支援單張與對子出牌（不含順子等進階牌型）。點選手牌中1張或同點數2張出牌，須比對方剛出的同類型牌型大，也可選擇過牌。牌面大小順序：3小...10、J、Q、K、A、2最大，同點數比花色 ♠>♥>♣>♦。率先出完13張手牌者獲勝，獲勝得2倍彩金。",
    glyph: "二",
    wagered: true,
  },
  {
    id: "stud-poker",
    slotNumber: 36,
    name: "梭哈",
    subtitle: "5張牌型對戰",
    status: "ready",
    hue: 340,
    cost: 100,
    rules:
      "先調整押注金額，再按「開牌」與莊家各發5張牌直接比牌型大小（同花順、鐵支、葫蘆、同花、順子、三條、兩對、一對、高牌）。牌型較高者贏得2倍彩金，平手退回押注。",
    glyph: "梭",
    wagered: true,
  },
  {
    id: "niuniu",
    slotNumber: 37,
    name: "牛牛",
    subtitle: "湊牛比點數",
    status: "ready",
    hue: 130,
    cost: 100,
    rules:
      "先調整押注金額，再按「開牌」與莊家各發5張牌。從5張中挑3張湊成10的倍數（稱為「牛」），剩下2張點數相加取個位數，數字越大越好，湊到剛好整10稱為「牛牛」最大，湊不出倍數則「無牛」最小。點數較大者贏得2倍彩金，平手退回押注。J/Q/K算10點，A算1點。",
    glyph: "牛",
    wagered: true,
  },
  {
    id: "zha-jinhua",
    slotNumber: 38,
    name: "炸金花",
    subtitle: "3張牌型比大小",
    status: "ready",
    hue: 45,
    cost: 100,
    rules:
      "先調整押注金額，再按「開牌」與莊家各發3張牌直接比牌型大小，牌型大小依序為：三條(豹子)、同花順、同花(金花)、順子、對子、單張。牌型較高者贏得2倍彩金，平手退回押注。",
    glyph: "炸",
    wagered: true,
  },
  {
    id: "baccarat",
    slotNumber: 39,
    name: "百家樂",
    subtitle: "押莊／押閒／押和",
    status: "ready",
    hue: 30,
    cost: 4,
    rules: "押注閒家、莊家或和局後開牌，牌面點數加總取個位數比大小，數字較大者贏，補牌規則自動依標準百家樂補牌表進行。",
    glyph: "百",
    wagered: true,
  },
  {
    id: "seven-pk",
    slotNumber: 40,
    name: "7PK",
    subtitle: "四階漸進開牌，可放棄或加倍",
    status: "ready",
    hue: 15,
    cost: 4,
    rules:
      "先選定押注分數再按「開牌」：第一次發3張（1、3張翻開，2張蓋著），可選擇放棄認輸或加倍押注；第二次發2張（第4張蓋著，第5張翻開），同樣可放棄或加倍；第三次發1張（第6張翻開），同樣可放棄或加倍；最後發第7張並把第2、4張蓋著的牌一起翻開，用最好的5張牌判定牌型。輸則賠掉目前總押注，贏則依賠率表發彩金：同花大順150倍、五條(4同點+1鬼牌)200倍、同花順120倍、正鐵支50倍、副鐵支(3同點+1鬼牌)30倍、葫蘆7倍、同花5倍、順子3倍、三條2倍、大兩對(其中一組J以上)1倍，其餘不中獎。",
    glyph: "7",
    wagered: true,
  },
  {
    id: "little-mary",
    slotNumber: 41,
    name: "傳統麻台(一)",
    subtitle: "中空方框跑馬燈，押大牌或小牌",
    status: "ready",
    hue: 38,
    cost: 50,
    rules:
      "先選押注邊（大牌／小牌）與押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（不扣分）；停在固定圖案（🆎/🅰️/🅱️/🍒）依固定倍率出彩；停在大牌(77/🍉/⭐️)或小牌(🔔/🍈/🍋)圖案且跟所選邊相符才出彩，一般依跑燈倍數發彩，累積一定轉數後隨機進入JP場次，命中時改發固定高倍並響起專屬鈴聲。",
    glyph: "麻",
    wagered: true,
  },
  {
    id: "little-mary-2",
    slotNumber: 42,
    name: "傳統麻台(二)",
    subtitle: "運動主題跑馬燈，押大牌或小牌",
    status: "ready",
    hue: 150,
    cost: 50,
    rules:
      "設置與運轉機制跟傳統麻台(一)完全相同，圖騰換成球類主題：對BAR／足球／橄欖球／籃球／保齡球／網球／桌球／高爾夫各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（不扣分）；停在固定圖案（🆎/🅰️/🅱️/🏌️‍♂️）依固定倍率出彩；停在大牌(⚽️/🏉/🏀)或小牌(🎳/🎾/🏓)圖案且該圖案自己有押注才出彩，大牌一般依跑燈倍數29～40浮動、小牌10～20浮動，累積一定轉數後隨機進入JP場次，命中時改發固定高倍並響起專屬鈴聲。",
    glyph: "⚽",
    wagered: true,
  },
  {
    id: "little-mary-3",
    slotNumber: 43,
    name: "傳統麻台(三)",
    subtitle: "花神JP三元獎，押大牌或小牌",
    status: "ready",
    hue: 335,
    cost: 50,
    rules:
      "設置與運轉機制跟傳統麻台(一)完全相同：對BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／櫻桃各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（不扣分）；停在固定圖案（🆎/🅰️/🅱️/🍒）依固定倍率出彩；停在大牌(77/🍉/⭐️)或小牌(🔔/🍈/🍋)圖案且該圖案自己有押注才一般依跑燈倍數出彩。花神🌺🌺🌺平常各自不同步閃爍，累積一定轉數後隨機進入預告狀態（三朵花同時炫光急閃、警鈴連響），此時若轉停在大牌組或小牌組即開出大三元／小三元，該組三個圖案同時中獎，總倍數＝跑燈停止倍數×3。",
    glyph: "🌺",
    wagered: true,
  },
  {
    id: "little-mary-4",
    slotNumber: 44,
    name: "傳統麻台(四)",
    subtitle: "動物主題花神三元獎",
    status: "ready",
    hue: 55,
    cost: 50,
    rules:
      "設置與運轉機制跟傳統麻台(三)花神JP版完全相同，圖騰換成動物主題：對BAR／老虎／龍／猴子／狐狸／老鼠／雞／小雞各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（不扣分）；停在固定圖案（🆎/🅰️/🅱️/🐣）依固定倍率出彩；停在大牌(🐯/🐲/🐵)或小牌(🦊/🐭/🐔)圖案且該圖案自己有押注才一般依跑燈倍數出彩。花神平常各自不同步閃爍，累積一定轉數後隨機進入預告狀態，此時若轉停在大牌組或小牌組即開出大三元／小三元，總倍數＝跑燈停止倍數×3。",
    glyph: "🐯",
    wagered: true,
  },
  {
    id: "little-mary-5",
    slotNumber: 45,
    name: "傳統麻台(三)",
    subtitle: "鳳凰裝飾版，押大牌或小牌",
    status: "ready",
    hue: 320,
    cost: 50,
    rules:
      "設置與運轉機制跟傳統麻台(一)完全相同：對BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／櫻桃各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在固定圖案（🆎/🅰️/🅱️/🍒）依固定倍率出彩；停在大牌(77/🍉/⭐️)或小牌(🔔/🍈/🍋)圖案且該圖案自己有押注才一般依跑燈倍數出彩，累積一定轉數後隨機進入預告場次，命中時改發固定高倍。中央放大的鳳凰🐦‍🔥純屬裝飾，平常慢慢閃爍、翅膀輕輕擺動，預告場次會加快閃爍並發光。轉停在左邊🅾️（免費重轉一次，全額退回）會額外掃過2～6個以大牌為主、偶爾含BAR的燈位並保留光圈；轉停在右邊🅾️則掃過以小牌為主的燈位，光圈都留到下一輪轉動才恢復，純屬裝飾不影響派彩。",
    glyph: "🐦‍🔥",
    wagered: true,
  },
  {
    id: "little-mary-6",
    slotNumber: 46,
    name: "傳統麻台(四)",
    subtitle: "鳳凰裝飾版．飲品主題",
    status: "ready",
    hue: 55,
    cost: 50,
    rules:
      "設置與運轉機制跟傳統麻台(三)鳳凰裝飾版完全相同，圖騰換成飲品主題：對BAR／茶壺／蜂蜜／瑪黛茶／剉冰／啤酒／紅酒／調酒各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在固定圖案（🆎/🅰️/🅱️/🍹）依固定倍率出彩；停在大牌(🫖/🍯/🧉)或小牌(🍧/🍺/🍷)圖案且該圖案自己有押注才一般依跑燈倍數出彩，累積一定轉數後隨機進入預告場次，命中時改發固定高倍。中央放大的鳳凰純屬裝飾，平常慢慢閃爍、翅膀輕輕擺動，預告場次會加快閃爍並發光。轉停在左邊🅾️（免費重轉一次，全額退回）會額外掃過2～6個以大牌為主、偶爾含BAR的燈位並保留光圈；轉停在右邊🅾️則掃過以小牌為主的燈位，光圈都留到下一輪轉動才恢復，純屬裝飾不影響派彩。",
    glyph: "🫖",
    wagered: true,
  },
  {
    id: "little-mary-7",
    slotNumber: 47,
    name: "小瑪莉(海洋)",
    subtitle: "8×8中空迷你版，押大牌或小牌",
    status: "ready",
    hue: 195,
    cost: 50,
    rules:
      "橫8格×直8格中空方框（共28個燈位），比傳統麻台(一)迷你，運轉規則完全相同：對BAR／鯊魚／鯨魚／海豚／熱帶魚／螃蟹／貝殼／氣泡各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（全額退回）；停在固定圖案（🆎/🅰️/🅱️/🫧）依固定倍率出彩；停在大牌(🦈/🐳/🐬)或小牌(🐠/🦀/🐚)圖案且該圖案自己有押注才一般依跑燈倍數出彩，累積一定轉數後隨機進入JP預告場次，命中時改發固定高倍並響起專屬鈴聲。",
    glyph: "🐬",
    wagered: true,
  },
  {
    id: "little-mary-8",
    slotNumber: 48,
    name: "小瑪莉(甜點)",
    subtitle: "8×8中空迷你版．甜點主題",
    status: "ready",
    hue: 340,
    cost: 50,
    rules:
      "跟第47台（小瑪莉海洋主題）完全相同的8×8中空方框／28個燈位規則，圖騰換成甜點主題：對BAR／蛋糕／草莓蛋糕／杯子蛋糕／甜甜圈／餅乾／糖果／棒棒糖各自調整押注分數，再按開始啟動。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（全額退回）；停在固定圖案（🆎/🅰️/🅱️/🍭）依固定倍率出彩；停在大牌(🎂/🍰/🧁)或小牌(🍩/🍪/🍬)圖案且該圖案自己有押注才一般依跑燈倍數出彩，累積一定轉數後隨機進入JP預告場次，命中時改發固定高倍並響起專屬鈴聲。",
    glyph: "🧁",
    wagered: true,
  },
  {
    id: "fruit-slot-1",
    slotNumber: 49,
    name: "水果盤(一)",
    subtitle: "經典3輪×3格，5條連線",
    status: "ready",
    hue: 10,
    cost: 50,
    rules:
      "經典3輪×3格水果盤，橫排上／中／下三條連線，加上左上到右下、左下到右上兩條斜線，共5條連線。設定每線押注分數後按開始，一次扣除「每線押注×5條連線」的總額。三個輪軸各自獨立轉動，由左到右依序停下，轉動中可按停止提早喊停。任何一條連線三格完全相同的圖案即依賠率出彩：7️⃣×100、🆎×50、🔔×25、🍉×15、🍇×10、🍊×8、🍋×6、🍒×4；畫面中🍒出現2顆以上額外加發安慰獎；中排三格全是7️⃣視為中頭獎，觸發JP燈箱特效與專屬鈴聲。",
    glyph: "7️⃣",
    wagered: true,
  },
  {
    id: "fruit-slot-2",
    slotNumber: 50,
    name: "水果盤(二)",
    subtitle: "熱帶水果主題，5條連線",
    status: "ready",
    hue: 175,
    cost: 50,
    rules:
      "跟水果盤(一)完全相同的3輪×3格、5連線規則，圖騰換成熱帶水果主題：💎取代7️⃣作為頭獎，搭配🆎／🔔／🍓／🍍／🍌／🍑／🍒。任何一條連線三格完全相同的圖案即依賠率出彩：💎×100、🆎×50、🔔×25、🍓×15、🍍×10、🍌×8、🍑×6、🍒×4；畫面中🍒出現2顆以上額外加發安慰獎；中排三格全是💎視為中頭獎，觸發JP燈箱特效與專屬鈴聲。",
    glyph: "💎",
    wagered: true,
  },
  {
    id: "little-mary-bonus",
    slotNumber: 51,
    name: "傳統麻台(五)",
    subtitle: "幸運七倍加碼版",
    status: "ready",
    hue: 45,
    cost: 50,
    rules:
      "設置與運轉機制跟傳統麻台(一)完全相同：對BAR／77／星星／西瓜／鈴鐺／香瓜／檸檬／櫻桃各自調整押注分數，再按開始啟動，一次扣掉8筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（全額退回）；停在某個圖案，只有該圖案自己的押注依賠率出彩。中央(7)(7)(7)是三個獨立數字轉輪（0～9），平常只是亂數跑動的裝飾；當BAR／大牌／小牌中獎時，有機會隨機跳出加碼關卡：轉輪由左而右依序停下，第三輪神秘式慢慢停，通常跟前兩輪不同（只是預告留期待），大約每100～200次中獎才會真正三輪同一數字——開出奇數（111/333/555/777/999）中獎金額再×10，開出偶數（000/222/444/666/888）中獎金額再×5，純屬隨機驚喜，不一定每次都會跳出。",
    glyph: "7️⃣",
    wagered: true,
  },
  {
    id: "little-mary-bonus-2",
    slotNumber: 52,
    name: "傳統麻台(四)",
    subtitle: "幸運七倍加碼版．喜慶主題",
    status: "ready",
    hue: 15,
    cost: 50,
    rules:
      "設置與運轉機制跟幸運七倍加碼版（傳統麻台五）完全相同，大牌／小牌圖騰換成喜慶主題：對BAR／紅包／金元寶／燈籠／橘子／月餅／煙火／櫻桃各自調整押注分數，再按開始啟動，一次扣掉8筆押注總和。方框燈順時鐘快轉三圈、再緩轉半圈到一圈半停止，轉動中可按停止提早喊停：停在箭頭算輸；停在🅾️免費重轉一次（全額退回）；停在某個圖案，只有該圖案自己的押注依賠率出彩。中央(7)(7)(7)三個獨立數字轉輪平常只是亂數跑動的裝飾；當BAR／大牌／小牌中獎時，有機會隨機跳出加碼關卡，轉輪由左而右依序停下，第三輪神秘式慢慢停，大約每100～200次中獎才會真正三輪同一數字——奇數中獎再×10、偶數中獎再×5，純屬隨機驚喜。機身改用硃紅／鎏金配色，背景音樂與開獎音效也換成不同音色。",
    glyph: "🧧",
    wagered: true,
  },
  {
    id: "xiangqi-mahjong",
    slotNumber: 53,
    name: "象棋麻將",
    subtitle: "用象棋棋子湊牌，與電腦比賽先胡牌",
    status: "ready",
    hue: 20,
    cost: 50,
    rules:
      "先調整押注金額（10～500）再按「開局」，雙方各摸5顆象棋棋子。輪到您時先按「摸牌」，摸進的那顆若正好湊成「1對眼＋1組（順子或刻子）」即自摸獲勝；沒胡牌則從6顆手牌中選1顆打出，換電腦回合。電腦打牌後，若剛好能讓您湊成胡牌，可以選擇「吃牌胡」，否則按「放過」繼續摸牌。賠率：混合一對＋順子＝2倍，同色一對＋順子＝3倍，5兵或5卒＝5倍；吃牌胡依上述倍數獲勝，自摸胡再加1倍。牌堆摸完仍無人胡牌則流局退回押注。",
    glyph: "馬",
    wagered: true,
  },
  {
    id: "tuitongzai",
    slotNumber: 54,
    name: "推筒仔",
    subtitle: "仿真麻將棋子比大小，頭門／天門／尾門三門同下",
    status: "ready",
    hue: 200,
    cost: 50,
    rules:
      "使用仿真中國麻將棋子代表一筒～九筒（各4張）加白板（4張，半點），共40張。開局前先分別調整頭門、天門、尾門三個門位的押注（10～500），按「開局」後莊家與三個門位各自掀出2張牌比大小。牌型大小順序：至尊寶（雙白板）＞對子（9對～1對）＞二八槓（2筒+8筒）＞一般點數（兩張相加取個位數，白板算0.5點，9.5點最大，0點鱉十最小）。每個門位各自跟莊家比較：贏得1倍注碼（1:1），特殊牌型對子加碼4倍、至尊寶加碼10倍；點數相同時依傳統規則算莊家勝。",
    glyph: "🀄",
    wagered: true,
  },
  {
    id: "mahjong-ninepoint5",
    slotNumber: 55,
    name: "麻將九點半",
    subtitle: "仿真麻將棋子，比點數近9.5",
    status: "ready",
    hue: 150,
    cost: 6,
    rules:
      "用麻將棋子代替撲克牌比點數：一筒～九筒、一索～九索、一萬～九萬依數字算點，東南西北中發白一律算0.5點。開局先發2顆，可選「補牌」再摸一顆，或「停牌」結束。目標是讓手牌點數總和儘量接近9.5點但不能超過，超過就爆牌。點數較接近9.5點的一方獲勝，1:1派彩；兩張牌剛好湊滿9.5點（天牌）加倍派彩；點數相同算莊家勝。",
    glyph: "半",
    wagered: true,
  },
  {
    id: "mahjong-niuniu",
    slotNumber: 56,
    name: "麻將妞妞",
    subtitle: "仿真麻將棋子，湊10比牛點",
    status: "ready",
    hue: 20,
    cost: 10,
    rules:
      "用一筒～九筒、一索～九索、一萬～九萬（不含字牌）代替撲克牌。開局您與莊家各發5顆，自動從5顆中找出最佳的3顆湊成10的倍數（稱為「有妞」），剩下2顆相加取個位數比大小：湊不出倍數是「無妞」最小，剛好湊整10的「妞妞」最大。點數較大的一方獲勝，1:1派彩；妞妞加碼3倍，妞7以上加碼2倍；點數相同算平手退回押注。",
    glyph: "妞",
    wagered: true,
  },
  {
    id: "dragon-gate",
    slotNumber: 57,
    name: "射龍門",
    subtitle: "麻將筒子開門猜大小",
    status: "ready",
    hue: 10,
    cost: 10,
    rules:
      "使用麻將一筒～九筒代替撲克牌，每局先開兩張牌當「球門」，調整押注後開第三張牌：點數落在兩張門牌之間即贏得1倍注碼，在門外則輸掉注碼，剛好跟任一邊門柱點數相同（撞柱）則要賠雙倍注碼。",
    glyph: "射",
    wagered: true,
  },
  ]

export const GAMBLE_GAME_MAP: Record<string, PuzzleGame> = Object.fromEntries(GAMBLE_GAMES.map((g) => [g.id, g]))

export type Difficulty = "easy" | "medium" | "hard"

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "初級",
  medium: "中級",
  hard: "高級",
}

export interface PuzzleGameStat {
  wins: number
  losses: number
  draws: number
}

export type PuzzleStats = Record<string, PuzzleGameStat>

export const EMPTY_PUZZLE_GAME_STAT: PuzzleGameStat = { wins: 0, losses: 0, draws: 0 }

export function isDifficulty(v: unknown): v is Difficulty {
  return v === "easy" || v === "medium" || v === "hard"
}

export interface Slot {
  number: number
  machine: Machine | null
  game: PuzzleGame | null
}

export function slotsOf(category: CategoryId): Slot[] {
  const machines = machinesOf(category)
  if (category === "puzzle") {
    return Array.from({ length: SLOTS_PER_CATEGORY }, (_, i) => {
      const number = i + 1
      const game = PUZZLE_GAMES.find((g) => g.slotNumber === number) ?? null
      const machine = game ? null : machines[number - 1 - PUZZLE_GAMES.length] ?? null
      return { number, machine, game }
    })
  }
  if (category === "gamble") {
    // 第 31～39 台改建為撲克牌桌（GAMBLE_GAMES），其餘機台編號仍是原本的老虎機盤面，
    // 老虎機依序往下遞補，不因撲克牌桌插入而中斷編號；第51、52台為新增的幸運七倍加碼機台，
    // 博奕區總台數因此放大到 GAMBLE_SLOTS_PER_CATEGORY。
    let machineIdx = 0
    return Array.from({ length: GAMBLE_SLOTS_PER_CATEGORY }, (_, i) => {
      const number = i + 1
      const game = GAMBLE_GAMES.find((g) => g.slotNumber === number) ?? null
      if (game) return { number, machine: null, game }
      const machine = machines[machineIdx] ?? null
      machineIdx++
      return { number, machine, game: null }
    })
  }
  return Array.from({ length: SLOTS_PER_CATEGORY }, (_, i) => ({
    number: i + 1,
    machine: machines[i] ?? null,
    game: null,
  }))
}

export const WELCOME_MESSAGES: string[] = [
  "{name}，歡迎回到 Luckypi Games！",
  "祝 {name} 今天手氣旺旺！",
  "{name}，益智區與博奕區都準備好了。",
  "歡迎 {name} 蒞臨遊戲大廳，盡情暢玩！",
  "{name}，每日試玩幣已為您備妥。",
]

export interface Announcement {
  id: string
  icon: string
  tag: string
  title: string
  body: string
  date: string
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "a1",
    icon: "📌",
    tag: "重要訊息",
    title: "平台正式上線",
    body: "歡迎來到 Luckypi Games！平台已正式上線，邀請您一起體驗！",
    date: "2026-09-01",
  },
  {
    id: "a2",
    icon: "🎮",
    tag: "新款上台",
    title: "新遊戲上線",
    body: "益智區與博奕區持續新增精彩機台，快來試試吧！",
    date: "2026-09-10",
  },
  {
    id: "a3",
    icon: "🔧",
    tag: "定時維修",
    title: "系統維護通知",
    body: "系統將於預告時段進行例行維護，期間平台可能暫時無法訪問，敬請留意。",
    date: "2026-09-18",
  },
  {
    id: "a4",
    icon: "💰",
    tag: "服務預告",
    title: "Pi 兌換服務即將開通",
    body: "正式的 Pi 支付兌換功能將於後續版本開通，目前先以示範額度體驗。",
    date: "2026-09-20",
  },
]

export interface SpinRecord {
  id: string
  machineId: string
  bet: number
  totalWin: number
  freeGamesAwarded: number
  usedFreeSpin: boolean
  at: number
}

export interface Wallet {
  trialCoins: number
  piCoins: number
}

export interface Stats {
  spins: number
  totalWin: number
  totalWagered: number
  bestWin: number
}

export const EMPTY_STATS: Stats = { spins: 0, totalWin: 0, totalWagered: 0, bestWin: 0 }

export type SpinSpeed = "fast" | "normal" | "slow"

export interface Prefs {
  tab: CategoryId
  mode: PlayMode
  betPerLine: number
  autoCount: number
  lastMachineId: string | null
  lastBonusDay: string | null
  lang: LangId
  trialName: string | null
  piDisplayName: string | null
  musicOn: boolean
  soundOn: boolean
  spinSpeed: SpinSpeed
  difficulty: Difficulty
}

export const DEFAULT_PREFS: Prefs = {
  tab: "puzzle",
  mode: "trial",
  betPerLine: 10,
  autoCount: 10,
  lastMachineId: null,
  lastBonusDay: null,
  lang: "zh-TW",
  trialName: null,
  piDisplayName: null,
  musicOn: true,
  soundOn: true,
  spinSpeed: "normal",
  difficulty: "medium",
}

export const SPIN_SPEED_MS: Record<SpinSpeed, number> = {
  fast: 420,
  normal: 780,
  slow: 1200,
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null
}

export function extractObject(input: unknown): Record<string, unknown> | null {
  if (!isRecord(input)) return null
  let cur: Record<string, unknown> = input
  for (let i = 0; i < 4; i++) {
    if (isRecord(cur.blob)) {
      cur = cur.blob as Record<string, unknown>
      continue
    }
    return cur
  }
  return cur
}

export function sanitizeWallet(raw: unknown): Wallet {
  const obj = extractObject(raw)
  const num = (v: unknown, fallback: number) =>
    typeof v === "number" && Number.isFinite(v) ? Math.max(0, Math.floor(v)) : fallback
  return {
    trialCoins: num(obj?.trialCoins, STARTER_TRIAL_COINS),
    piCoins: num(obj?.piCoins, STARTER_PI_COINS),
  }
}

export function sanitizeStats(raw: unknown): Stats {
  const obj = extractObject(raw)
  if (!obj) return { ...EMPTY_STATS }
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0)
  return {
    spins: num(obj.spins),
    totalWin: num(obj.totalWin),
    totalWagered: num(obj.totalWagered),
    bestWin: num(obj.bestWin),
  }
}

export function sanitizePuzzleStats(raw: unknown): PuzzleStats {
  const obj = extractObject(raw)
  if (!obj) return {}
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0)
  const out: PuzzleStats = {}
  for (const [key, v] of Object.entries(obj)) {
    if (!isRecord(v) || !PUZZLE_GAME_MAP[key]) continue
    out[key] = { wins: num(v.wins), losses: num(v.losses), draws: num(v.draws) }
  }
  return out
}

export function puzzleStatsToBlob(s: PuzzleStats) {
  return { ...s }
}

export function sanitizePrefs(raw: unknown): Prefs {
  const obj = extractObject(raw)
  if (!obj) return { ...DEFAULT_PREFS }
  const tab: CategoryId = obj.tab === "gamble" ? "gamble" : "puzzle"
  const mode: PlayMode = obj.mode === "pi" ? "pi" : "trial"
  const clampBet = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v)
      ? Math.min(MAX_BET, Math.max(MIN_BET, Math.round(v / BET_STEP) * BET_STEP))
      : DEFAULT_PREFS.betPerLine
  const betPerLine = clampBet(obj.betPerLine)
  const autoCount =
    typeof obj.autoCount === "number" && Number.isFinite(obj.autoCount)
      ? Math.min(MAX_AUTO, Math.max(MIN_AUTO, Math.round(obj.autoCount / AUTO_STEP) * AUTO_STEP))
      : DEFAULT_PREFS.autoCount
  const lastMachineId = typeof obj.lastMachineId === "string" && MACHINE_MAP[obj.lastMachineId] ? obj.lastMachineId : null
  const lastBonusDay = typeof obj.lastBonusDay === "string" && obj.lastBonusDay.length <= 10 ? obj.lastBonusDay : null
  const lang: LangId = isLangId(obj.lang) ? obj.lang : DEFAULT_PREFS.lang
  const cleanName = (v: unknown) => (typeof v === "string" && v.trim().length > 0 ? v.trim().slice(0, 40) : null)
  const bool = (v: unknown, fallback: boolean) => (typeof v === "boolean" ? v : fallback)
  const spinSpeed: SpinSpeed = obj.spinSpeed === "fast" || obj.spinSpeed === "slow" ? (obj.spinSpeed as SpinSpeed) : "normal"
  const difficulty: Difficulty = isDifficulty(obj.difficulty) ? obj.difficulty : DEFAULT_PREFS.difficulty
  return {
    tab,
    mode,
    betPerLine,
    autoCount,
    lastMachineId,
    lastBonusDay,
    lang,
    trialName: cleanName(obj.trialName),
    piDisplayName: cleanName(obj.piDisplayName),
    musicOn: bool(obj.musicOn, DEFAULT_PREFS.musicOn),
    soundOn: bool(obj.soundOn, DEFAULT_PREFS.soundOn),
    spinSpeed,
    difficulty,
  }
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10)
}

export function walletToBlob(w: Wallet) {
  return { trialCoins: w.trialCoins, piCoins: w.piCoins }
}

export function statsToBlob(s: Stats) {
  return { ...s }
}

export function prefsToBlob(p: Prefs) {
  return { ...p }
}

export const isLangId = isLangIdBase

export function formatCoins(n: number): string {
  // 防呆：任何非有效數字（例如尚未載入完成、或計算過程中出現的空值）一律顯示為 0，
  // 絕對不會讓畫面上出現 "NaN" 這種看起來像亂碼的英文字。
  if (typeof n !== "number" || !Number.isFinite(n)) return "0"
  return Math.round(n).toLocaleString("zh-Hant")
}

// 防呆：把任何來源的數值（可能是 undefined、NaN、字串）安全轉成一個有效的整數，
// 並限制在指定的上下限之間，確保押注分、自動次數等欄位永遠是看得懂的數字。
export function safeNumber(v: unknown, fallback: number, min: number, max: number): number {
  const n = typeof v === "number" ? v : Number(v)
  if (!Number.isFinite(n)) return fallback
  return Math.min(max, Math.max(min, Math.round(n)))
}
