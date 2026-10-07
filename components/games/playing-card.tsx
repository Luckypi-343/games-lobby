import { RANK_LABEL, SUIT_SYMBOL, isRedSuit, type Card } from "@/lib/games/cards"

// 傳統撲克牌「花點」排列座標表（百分比座標，第二個布林值代表是否需要旋轉180度以朝下）。
// 這是真實撲克牌 2~10 點數的標準排版，讓玩家一眼就能認出牌面點數，而不是只看角落數字。
// 原始座標比較貼近卡面邊緣，容易讓花點看起來往左上角超出卡面；下面會統一把座標往正中央收攏一些。
const RAW_PIP_LAYOUT: Record<number, [number, number, boolean][]> = {
  2: [
    [50, 22, false],
    [50, 78, true],
  ],
  3: [
    [50, 18, false],
    [50, 50, false],
    [50, 82, true],
  ],
  4: [
    [28, 20, false],
    [72, 20, false],
    [28, 80, true],
    [72, 80, true],
  ],
  5: [
    [28, 18, false],
    [72, 18, false],
    [50, 50, false],
    [28, 82, true],
    [72, 82, true],
  ],
  6: [
    [28, 18, false],
    [72, 18, false],
    [28, 50, false],
    [72, 50, false],
    [28, 82, true],
    [72, 82, true],
  ],
  7: [
    [28, 15, false],
    [72, 15, false],
    [50, 32, false],
    [28, 49, false],
    [72, 49, false],
    [28, 85, true],
    [72, 85, true],
  ],
  8: [
    [28, 13, false],
    [72, 13, false],
    [50, 29, false],
    [28, 45, false],
    [72, 45, false],
    [50, 61, true],
    [28, 87, true],
    [72, 87, true],
  ],
  9: [
    [28, 12, false],
    [72, 12, false],
    [28, 34, false],
    [72, 34, false],
    [50, 50, false],
    [28, 66, true],
    [72, 66, true],
    [28, 88, true],
    [72, 88, true],
  ],
  10: [
    [28, 10, false],
    [72, 10, false],
    [50, 22, false],
    [28, 34, false],
    [72, 34, false],
    [28, 66, true],
    [72, 66, true],
    [50, 78, true],
    [28, 90, true],
    [72, 90, true],
  ],
}

// 把每個花點座標往正中央收攏並置中，整組花點再往下、往右移一點點。
// 所有點數的花點維持同一個縮放比例，位置只是整組平移。
function scalePip(x: number, y: number): [number, number] {
  return [50 + (x - 50) * 0.62 - 5, 50 + (y - 50) * 0.58 + 3]
}

// 1~10 點的花點圖示整體再縮小一些，5~10 點縮得更多一些。
function pipScaleFor(rank: number): number {
  return rank >= 5 && rank <= 10 ? 0.58 : 0.8
}

const PIP_LAYOUT: Record<number, [number, number, boolean][]> = Object.fromEntries(
  Object.entries(RAW_PIP_LAYOUT).map(([rank, pts]) => [
    Number(rank),
    pts.map(([x, y, flip]) => {
      const [sx, sy] = scalePip(x, y)
      return [sx, sy, flip] as [number, number, boolean]
    }),
  ]),
)

const FACE_LABEL: Record<number, string> = { 11: "J", 12: "Q", 13: "K" }
const FACE_KIND: Record<number, "prince" | "queen" | "king"> = { 11: "prince", 12: "queen", 13: "king" }

// J／Q／K 的「頭像」插畫，仿照傳統撲克牌人頭牌（如 🂫🂭🂮）的對稱肖像構圖：
// 頭頂王冠／后冠／太子冠，肩上披著鑲邊的披肩衣領，臉部五官用同一套線條風格繪製，
// K 有鬍子與八字鬚、Q 有波浪鬢髮與珍珠項鍊、J 是沒有鬍子的清秀年輕臉孔，一眼能分出誰是誰。
// 皇室服飾配色：金色王冠、膚色臉孔、依身份區分的披肩顏色，讓人頭牌不再只是單色線條，
// 更接近真實紙牌上帶有色彩層次的肖像（如 🂫🂭🂮），同時整體尺寸縮小、不再過於龐大。
const GOLD = "oklch(0.72 0.14 80)"
const SKIN = "oklch(0.9 0.05 55)"
const ROBE_BY_KIND: Record<"king" | "queen" | "prince", string> = {
  king: "oklch(0.5 0.18 25)", // 深紅披袍
  queen: "oklch(0.42 0.14 292)", // 皇后紫藍披袍
  prince: "oklch(0.48 0.13 155)", // 太子墨綠披袍
}

function RoyalPortrait({ rank, color, small }: { rank: number; color: string; small?: boolean }) {
  const kind = FACE_KIND[rank]
  // 身體（披肩）部份拉寬到卡面寬度的85~99%，讓鏡面頭像確實填滿卡面內側，同時維持固定高度不變形過度。
  const heightCls = small ? "h-7" : "h-9"
  const robe = ROBE_BY_KIND[kind]

  return (
    <div className={`relative w-[64%] ${heightCls}`}>
      <svg viewBox="0 0 40 52" className="h-full w-full" preserveAspectRatio="none" aria-hidden>
        {/* 披肩／衣領，用身份色彩上色，再以卡面花色顏色描邊鑲邊 */}
        <path d="M4 50 L8 34 L20 29 L32 34 L36 50 Z" fill={robe} stroke={color} strokeWidth="1.1" />
        <path d="M8 34 L20 30 L32 34" fill="none" stroke={GOLD} strokeWidth="1" />
        <path d="M12 50 L14 38 M28 50 L26 38 M20 50 L20 36" stroke={GOLD} strokeWidth="0.7" opacity={0.8} />

        {/* 王冠／后冠／太子冠：金色填色，鑲寶石 */}
        {kind === "king" && (
          <>
            <path d="M7 15 L7 7 L13 11.5 L17 3 L20 9 L23 3 L27 11.5 L33 7 L33 15 Z" fill={GOLD} stroke={color} strokeWidth="0.6" />
            <circle cx="13" cy="7.5" r="1.4" fill={ROBE_BY_KIND.king} />
            <circle cx="20" cy="4.5" r="1.4" fill={ROBE_BY_KIND.king} />
            <circle cx="27" cy="7.5" r="1.4" fill={ROBE_BY_KIND.king} />
          </>
        )}
        {kind === "queen" && (
          <>
            <path d="M7 14 L7 9 L12 6 L16 12 L20 4 L24 12 L28 6 L33 9 L33 14 Z" fill={GOLD} stroke={color} strokeWidth="0.6" />
            <circle cx="20" cy="5.5" r="1.6" fill={ROBE_BY_KIND.queen} />
            <circle cx="12" cy="8" r="1.1" fill={ROBE_BY_KIND.queen} />
            <circle cx="28" cy="8" r="1.1" fill={ROBE_BY_KIND.queen} />
          </>
        )}
        {kind === "prince" && (
          <>
            <path d="M9 14 L9 8 L20 2.5 L31 8 L31 14 Z" fill={GOLD} stroke={color} strokeWidth="0.6" />
            <circle cx="20" cy="7.5" r="1.3" fill={ROBE_BY_KIND.prince} />
          </>
        )}

        {/* 臉部：膚色填色 */}
        <ellipse cx="20" cy="24" rx="9.5" ry="10.5" fill={SKIN} stroke={color} strokeWidth="1.1" />

        {/* 鬢髮／頭髮 */}
        {kind === "queen" && (
          <>
            <path d="M10.5 17c-2 4-2 10-1 15" stroke="oklch(0.35 0.02 60)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M29.5 17c2 4 2 10 1 15" stroke="oklch(0.35 0.02 60)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          </>
        )}
        {kind === "king" && (
          <>
            <path d="M9.5 18c-1.4 3-1.4 6.5-0.5 9.5" stroke="oklch(0.35 0.02 60)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M30.5 18c1.4 3 1.4 6.5 0.5 9.5" stroke="oklch(0.35 0.02 60)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* 眉毛與眼睛 */}
        <path d="M14.5 21.5h3M22.5 21.5h3" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="16" cy="24.5" r="0.9" fill={color} />
        <circle cx="24" cy="24.5" r="0.9" fill={color} />

        {/* 鼻子 */}
        <path d="M20 24v3.5" stroke={color} strokeWidth="0.9" strokeLinecap="round" />

        {/* 鬍子（僅國王有八字鬚＋落腮鬍） */}
        {kind === "king" && (
          <>
            <path
              d="M13.5 28.5c2 0.6 4 0.4 6.5-0.3c2.5 0.7 4.5 0.9 6.5 0.3"
              stroke="oklch(0.35 0.02 60)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            <path d="M13 30c1 3 3.5 5 7 5s6-2 7-5" stroke="oklch(0.35 0.02 60)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* 嘴巴 */}
        <path
          d={kind === "king" ? "M17 33.2c1.6 1 4.4 1 6 0" : "M16.5 30.5c1.8 1.3 5.2 1.3 7 0"}
          stroke={color}
          strokeWidth="1.1"
          strokeLinecap="round"
          fill="none"
        />

        {/* 皇后項鍊珍珠 */}
        {kind === "queen" && (
          <>
            <circle cx="15" cy="34.5" r="0.8" fill={GOLD} />
            <circle cx="20" cy="35.5" r="0.8" fill={GOLD} />
            <circle cx="25" cy="34.5" r="0.8" fill={GOLD} />
          </>
        )}
      </svg>
    </div>
  )
}

function CardBack({ sizeCls }: { sizeCls: string }) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-md border-2 shadow-md ${sizeCls}`}
      style={{
        borderColor: "oklch(0.72 0.14 75)",
        background:
          "radial-gradient(circle at 50% 50%, oklch(0.28 0.09 265) 0%, oklch(0.16 0.05 265) 70%, oklch(0.11 0.03 265) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.72 0.14 75 / 0.35) 0px, oklch(0.72 0.14 75 / 0.35) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(-45deg, oklch(0.72 0.14 75 / 0.35) 0px, oklch(0.72 0.14 75 / 0.35) 1px, transparent 1px, transparent 8px)",
        }}
      />
      <div className="absolute inset-[3px] rounded-[4px] border" style={{ borderColor: "oklch(0.72 0.14 75 / 0.5)" }} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex h-[46%] w-[46%] items-center justify-center rounded-full border-2"
          style={{ borderColor: "oklch(0.72 0.14 75)", background: "oklch(0.16 0.05 265 / 0.9)" }}
        >
          <span className="text-[9px] font-black tracking-tight" style={{ color: "oklch(0.72 0.14 75)" }}>
            LP
          </span>
        </div>
      </div>
    </div>
  )
}

// 鬼牌（大鬼／小鬼）牌面：五彩小丑帽＋星星圖案，仿照傳統紙牌鬼牌（如 🃏🂿）的熱鬧配色，
// 一眼就能跟一般花色牌區分開來，不需要額外文字說明。
function JokerFace({ small }: { small?: boolean }) {
  const labelCls = small ? "text-[7px]" : "text-[10px]"
  return (
    <div
      className={`relative shrink-0 rounded-md border-2 border-neutral-300 shadow-md ${small ? "h-14 w-10" : "h-20 w-14"}`}
      style={{ background: "linear-gradient(135deg, #fffdf7 0%, #f7f1e2 100%)" }}
    >
      <div className="absolute inset-x-0 top-1 flex flex-col items-center leading-none" style={{ color: "oklch(0.5 0.19 20)" }}>
        <span className={`font-bold ${labelCls}`}>JOKER</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 40 44" className={small ? "h-9 w-9" : "h-12 w-12"} aria-hidden>
          {/* 三角小丑帽，三色鈴鐺球 */}
          <path d="M8 22 L14 6 L20 20 L26 4 L32 22 Z" fill="oklch(0.62 0.2 20)" />
          <path d="M8 22 L14 6 L20 20" fill="oklch(0.68 0.18 260)" />
          <path d="M20 20 L26 4 L32 22" fill="oklch(0.75 0.17 95)" />
          <circle cx="14" cy="6" r="2.4" fill="oklch(0.75 0.17 95)" />
          <circle cx="26" cy="4" r="2.4" fill="oklch(0.62 0.2 20)" />
          <circle cx="20" cy="20" r="2" fill="oklch(0.68 0.18 260)" />
          {/* 臉 */}
          <ellipse cx="20" cy="30" rx="9" ry="9.5" fill="oklch(0.9 0.05 55)" stroke="oklch(0.3 0.02 60)" strokeWidth="1" />
          <circle cx="16.5" cy="29" r="1" fill="oklch(0.3 0.02 60)" />
          <circle cx="23.5" cy="29" r="1" fill="oklch(0.3 0.02 60)" />
          <path d="M15 34c2 2 8 2 10 0" stroke="oklch(0.5 0.19 20)" strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute inset-x-0 bottom-1 flex flex-col items-center leading-none" style={{ color: "oklch(0.5 0.19 20)", transform: "rotate(180deg)" }}>
        <span className={`font-bold ${labelCls}`}>JOKER</span>
      </div>
    </div>
  )
}

export function PlayingCard({ card, faceDown, small }: { card: Card | null; faceDown?: boolean; small?: boolean }) {
  const sizeCls = small ? "h-14 w-10" : "h-20 w-14"
  if (faceDown || !card) {
    return <CardBack sizeCls={sizeCls} />
  }

  if (card.joker) {
    return <JokerFace small={small} />
  }

  const red = isRedSuit(card.suit)
  const color = red ? "oklch(0.5 0.19 20)" : "oklch(0.2 0.01 260)"
  const rankLabel = RANK_LABEL[card.rank]
  const suitSymbol = SUIT_SYMBOL[card.suit]
  const cornerTextCls = small ? "text-[7px]" : "text-[10px]"
  const cornerSuitCls = small ? "text-[8px]" : "text-[11px]"
  // 所有花點統一同一個大小，不論這張牌是2點還是10點，每個小圖示都一樣大。
  const pipCls = small ? "text-[8px]" : "text-sm"
  const aceCls = small ? "text-2xl" : "text-4xl"

  const pips = PIP_LAYOUT[card.rank]
  const isFace = card.rank >= 11 && card.rank <= 13
  const isAce = card.rank === 14

  return (
    <div
      className={`relative shrink-0 rounded-md border-2 border-neutral-300 shadow-md ${sizeCls}`}
      style={{ background: "linear-gradient(135deg, #fffdf7 0%, #f7f1e2 100%)" }}
    >
      {/* 左上角索引 */}
      <div className="absolute left-[3px] top-[2px] flex flex-col items-center leading-none" style={{ color }}>
        <span className={`font-bold ${cornerTextCls}`}>{rankLabel}</span>
        <span className={cornerSuitCls}>{suitSymbol}</span>
      </div>
      {/* 右下角索引（旋轉180度） */}
      <div
        className="absolute bottom-[2px] right-[3px] flex flex-col items-center leading-none"
        style={{ color, transform: "rotate(180deg)" }}
      >
        <span className={`font-bold ${cornerTextCls}`}>{rankLabel}</span>
        <span className={cornerSuitCls}>{suitSymbol}</span>
      </div>

      {isAce ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={aceCls} style={{ color, display: "inline-block", transform: "scale(0.8)" }}>
            {suitSymbol}
          </span>
        </div>
      ) : isFace ? (
        // 頭像鏡面對稱放置：上下各一份，下方旋轉180度，仿照傳統人頭牌（如 🂫🂭🂮）左右/上下對稱的構圖，
        // 只在不觸及左上、右下角索引範圍內加寬加滿，中間不再重複標示多餘的字母或花色符號。
        <div className="absolute inset-x-0 top-[16%] bottom-[16%] flex flex-col items-center">
          <div className="flex h-1/2 w-full items-end justify-center">
            <RoyalPortrait rank={card.rank} color={color} small={small} />
          </div>
          <div className="flex h-1/2 w-full items-start justify-center" style={{ transform: "rotate(180deg)" }}>
            <RoyalPortrait rank={card.rank} color={color} small={small} />
          </div>
        </div>
      ) : (
        pips?.map(([x, y, flip], i) => {
          const scale = pipScaleFor(card.rank)
          return (
            <span
              key={i}
              className={`absolute leading-none ${pipCls}`}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                color,
                transform: `translate(-50%, -50%) scale(${scale}) ${flip ? "rotate(180deg)" : ""}`,
              }}
            >
              {suitSymbol}
            </span>
          )
        })
      )}
    </div>
  )
}

export function CardRow({
  cards,
  faceDown,
  small,
  faceDownAt,
}: {
  cards: Card[]
  faceDown?: boolean
  small?: boolean
  // 指定「哪幾張蓋著」的索引（用於同一排裡有些牌翻開、有些牌蓋著的情況，例如7PK的漸進發牌）。
  faceDownAt?: number[]
}) {
  return (
    <div className="flex gap-1.5">
      {cards.map((c, i) => (
        <PlayingCard key={c.id} card={c} faceDown={faceDown || faceDownAt?.includes(i)} small={small} />
      ))}
    </div>
  )
}
