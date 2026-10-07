"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"
import {
  LINE_COUNT,
  MIN_BET,
  MAX_BET,
  BET_STEP,
  MIN_AUTO,
  MAX_AUTO,
  AUTO_STEP,
  formatCoins,
  safeNumber,
  totemOf,
  paylineEdgeGroups,
  PAYLINES,
  PAYTABLE,
  BOARD_PAYTABLE,
  SCATTER_FREE_GAMES,
  BONUS_WHEEL_SPINS,
  SYMBOL_LABEL,
  ZODIAC_SYMBOLS,
  themeEmojiMap,
  lineColorsFor,
  type Machine,
  type SymbolId,
} from "@/lib/luckypi/data"
import type { Grid, LineHit } from "@/lib/luckypi/engine"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { LANGS, dictFor } from "@/lib/luckypi/i18n"
import { themeNameFor, themeSymbolLabelFor } from "@/lib/luckypi/slot-i18n"
import { PiEmblem } from "./ui"
import { SPECIAL_OVERLAY } from "@/lib/luckypi/data"
import { WheelBonusSheet } from "./wheel-bonus-sheet"
import { MachineTotem, TotemGrid } from "./machine-totem"
import { startBgm, stopBgm } from "@/lib/luckypi/reel-audio"

// 精準量測轉盤格子容器目前實際的像素寬高（會隨畫面尺寸即時更新），
// 讓中獎連線疊層能用「真正的像素座標」對齊格子中心，不再用估算的百分比造成偏移。
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, size] as const
}

export const PAYLINE_EDGES = paylineEdgeGroups()
const GEAR_POOL: SymbolId[] = [
  "rat",
  "ox",
  "tiger",
  "rabbit",
  "dragon",
  "snake",
  "horse",
  "goat",
  "monkey",
  "rooster",
  "dog",
  "pig",
]

// 每一個方格自己就是一個獨立的齒輪：方格本身的淺花紋底色永遠固定不動，
// 轉動時裡面疊了一長條隨機生肖圖騰，往下快速捲動並加上強模糊，看起來完全認不出形象，
// 就像站在高速轉動的齒輪正面，圖案不斷往下滾過去；15 格各自的捲動速度不同，
// 不會同步成一條輸送帶。停下瞬間立刻切回單一清晰圖騰，沒有模糊、沒有位移。
function ReelCell({
  symbol,
  spinning,
  seed,
  isWinning,
  resultId,
  emojiMap,
  symbolScale = 1,
}: {
  symbol: SymbolId
  spinning: boolean
  seed: number
  isWinning?: boolean
  resultId?: number
  emojiMap: Record<SymbolId, string>
  symbolScale?: number
}) {
  const symbolFontSize = `min(${(13.9 * symbolScale).toFixed(2)}vw, ${(4 * symbolScale).toFixed(2)}rem)`
  // 每一格自己專屬的捲動快慢（0.11～0.27秒跑完一圈，各格不同），數字越小滾得越快、越看不清楚。
  const fallDuration = 0.11 + ((seed * 29) % 16) / 100
  // 長條上疊 5 張隨機生肖圖騰，往下捲動時肉眼只會看到連續的模糊殘影，不會停下讓人辨認。
  const fallStrip = useMemo(() => {
    let s = seed * 7919 + 13
    const next = () => {
      s = (s * 1103515245 + 12345) & 0x7fffffff
      return GEAR_POOL[s % GEAR_POOL.length]
    }
    return Array.from({ length: 5 }, () => next())
  }, [seed])
  const overlayWord = symbol === "wild" || symbol === "bonus" || symbol === "wheel" ? SPECIAL_OVERLAY[symbol] : null

  // 淺花紋底色是獨立、絕對定位、永遠固定不動的一層——不管轉動或靜止，
  // 這一層從頭到尾都不會被觸碰、不會被拿掉重建，也不會有任何閃現或跳動；
  // 轉動時往下捲動的圖騰長條疊在它上面，停下時的單一圖騰也疊在它上面，兩種狀態共用同一個底。
  return (
    <div className="relative z-10 h-full w-full overflow-hidden rounded-md ring-1 ring-inset ring-black/15">
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "oklch(0.94 0.02 68)",
          backgroundImage:
            "radial-gradient(oklch(0.82 0.035 60 / 0.55) 1.1px, transparent 1.6px), radial-gradient(oklch(0.88 0.03 64 / 0.5) 1.1px, transparent 1.6px)",
          backgroundSize: "10px 10px, 10px 10px",
          backgroundPosition: "0 0, 5px 5px",
          boxShadow: "inset 0 0 0 1px oklch(0.7 0.04 60 / 0.6)",
        }}
      />
      <div className="absolute inset-0 overflow-hidden">
        {spinning ? (
          <div
            className="absolute inset-x-0 flex flex-col lp-gear-fall"
            style={{
              top: "-100%",
              height: "300%",
              animationDuration: `${fallDuration}s`,
              filter: "blur(5px) brightness(0.94)",
            }}
            aria-hidden
          >
            {fallStrip.map((s, i) => (
              <span
                key={i}
                className="flex h-1/5 items-center justify-center leading-none"
                style={{ fontSize: symbolFontSize }}
              >
                {emojiMap[s]}
              </span>
            ))}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* 中獎的動物圖騰要「動三下」：key 每次中獎都換一個新值，強迫這個節點重新掛載，
                animation-iteration-count:3 才會每次都重新從頭播完 3 次，不會播完就定住不動。 */}
            <span
              key={isWinning ? `win-${resultId}` : "idle"}
              className={cn("flex items-center justify-center leading-none", isWinning && "lp-win-cell-pulse")}
              style={{
                fontSize: symbolFontSize,
                // 立體感：三層疊加陰影（近距深色收邊＋中距擴散陰影＋底部落影），
                // 讓每個圖騰看起來像雕刻在木櫥窗裡的浮凸吊牌，而不是扁平貼紙。
                filter:
                  "drop-shadow(0 1px 0 rgba(255,255,255,0.55)) drop-shadow(0 2px 1px rgba(0,0,0,0.28)) drop-shadow(0 4px 5px rgba(0,0,0,0.35))",
              }}
              aria-hidden
            >
              {emojiMap[symbol]}
            </span>
            {overlayWord && (
              // 特殊符號的英文字：去掉底色標籤牌，純文字疊在圖騰上方，粗體＋白色立體陰影，
              // 不管字母多少個（WILD 4 字／SCATTER 7 字）一律用 SVG textLength 強制縮放，
              // 固定佔滿格子寬 90%、高 40%，並依身分配色字面（WILD 黃／SCATTER 藍／BONUS 紅）。
              <svg
                viewBox="0 0 100 40"
                preserveAspectRatio="none"
                className="pointer-events-none absolute left-[5%] top-1/2 h-[40%] w-[90%] -translate-y-1/2"
                aria-hidden
              >
                <text
                  x="50"
                  y="30"
                  textAnchor="middle"
                  textLength="94"
                  lengthAdjust="spacingAndGlyphs"
                  fontFamily="var(--font-sans), system-ui, sans-serif"
                  fontWeight={900}
                  fontSize="34"
                  letterSpacing="-1"
                  fill={
                    symbol === "wild"
                      ? "oklch(0.82 0.18 92)"
                      : symbol === "bonus"
                        ? "oklch(0.58 0.2 255)"
                        : "oklch(0.58 0.22 25)"
                  }
                  style={{
                    filter:
                      "drop-shadow(0 -1px 0 white) drop-shadow(0 1px 0 white) drop-shadow(-1px 0 0 white) drop-shadow(1px 0 0 white) drop-shadow(0 2px 2px rgba(0,0,0,0.45))",
                  }}
                >
                  {overlayWord}
                </text>
              </svg>
            )}
            {symbol === "bonus" && (
              <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-1 ring-white/70" />
            )}
            {symbol === "wheel" && (
              <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-yellow-400 ring-1 ring-white/70" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// 一個豎列＝把該列 3 個獨立齒輪格子直向排好，本身完全填滿外層 grid 分配到的那一整個直行空間，
// 這樣才能跟 StaticGridLines 的 3×5 網格線精準對齊，不會超出格子。
export function ReelColumn({
  col,
  grid,
  spinning,
  winningCells,
  resultId,
  emojiMap,
  symbolScale = 1,
}: {
  col: number
  grid: Grid | null
  spinning: boolean
  winningCells?: Set<string>
  resultId?: number
  emojiMap: Record<SymbolId, string>
  symbolScale?: number
}) {
  const finalSymbols: SymbolId[] = grid ? grid[col] : (["rat", "rat", "rat"] as SymbolId[])
  return (
    <div className="grid h-full w-full grid-rows-3 gap-[3px]">
      {finalSymbols.map((s, row) => (
        <ReelCell
          key={row}
          symbol={s}
          spinning={spinning}
          seed={col * 3 + row + 1}
          isWinning={winningCells?.has(`${col}-${row}`)}
          resultId={resultId}
          emojiMap={emojiMap}
          symbolScale={symbolScale}
        />
      ))}
    </div>
  )
}

// 九條中獎連線編碼：固定貼在轉盤左右最外側觸邊，且一律設置在最上層（z-40），
// 不會被轉輪、圖騰網格或任何特效遮住。中獎的那幾條連線編碼會亮起發光提示。
export function PaylineRail({
  side,
  winningLines,
  lineColors,
  hue,
}: {
  side: "left" | "right"
  winningLines: Set<number>
  lineColors: Record<number, string>
  hue: number
}) {
  const groups = side === "left" ? PAYLINE_EDGES.left : PAYLINE_EDGES.right
  return (
    <div
      className={cn(
        "relative z-40 flex w-5 shrink-0 flex-col justify-around rounded-full py-1.5",
        side === "left" ? "-ml-2" : "-mr-2",
      )}
      style={{
        // 轉盤左右兩側的整條卡片背板，隨機台主題色系染色，讓玩家一眼就能感受到跟其他機台不同的氛圍。
        background: `linear-gradient(180deg, oklch(0.4 0.05 ${hue} / 0.55), oklch(0.28 0.05 ${hue} / 0.7))`,
        boxShadow: `inset 0 0 0 1px oklch(0.6 0.08 ${hue} / 0.5)`,
      }}
      aria-hidden
    >
      {groups.map((lines, row) => (
        <div key={row} className="flex flex-col items-center gap-1">
          {lines.map((n, idx) => {
            const won = winningLines.has(n)
            return (
              <span
                key={n}
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full font-mono text-[8px] font-extrabold leading-none text-white transition-transform",
                  idx === 1 && "scale-[1.18]",
                  won && "scale-[1.4]",
                )}
                style={{
                  background: lineColors[n],
                  boxShadow: won
                    ? `0 0 10px 4px ${lineColors[n]}, inset 0 0 0 1.5px white`
                    : idx === 1
                      ? `0 0 6px 2px ${lineColors[n]}, inset 0 0 0 1px rgba(255,255,255,0.55)`
                      : "inset 0 0 0 1px rgba(255,255,255,0.35), 0 1px 2px rgba(0,0,0,0.5)",
                  ...(won ? { animation: "luckypi-scatter-glow 0.7s ease-in-out infinite" } : {}),
                }}
              >
                {n}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// 3×5 網格線條：與外框同一木料色調，讓「外框＋網格」看起來是一體雕出來的木質展示櫃，
// 不用另一組幾何色線條取代。不論15個圖騰怎麼滾動，這層線條本身永遠固定不動。
export function StaticGridLines() {
  return (
    <div className="pointer-events-none absolute inset-1.5 z-20 grid grid-cols-5 grid-rows-3 gap-[3px]" aria-hidden>
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="rounded-[3px]"
          style={{ boxShadow: "inset 0 0 0 2px oklch(0.52 0.07 55 / 0.9)" }}
        />
      ))}
    </div>
  )
}

// 中獎時，把中獎的那幾條連線真正畫成一條彩色折線，直接疊在轉盤 5×3 的圖騰上面。
// 一律畫出這條線「完整」的 5 個位置（由最左邊第1格連到最右邊第5格），不會只畫到
// 中獎的那幾格就斷掉；真正連中的那幾格會另外用實心大圓點標亮，其餘格子只是淡淡的引導點。
// 座標一律用「量測到的真實像素寬高」換算，並精準扣掉格子容器的內距與格子間隙，
// 這樣折線才會剛好穿過每一格的正中心，不會偏下或偏右。
const GRID_PAD_PX = 6 // 對應格子容器 p-1.5 的實際內距（0.375rem）
const GRID_GAP_PX = 3 // 對應格子之間 gap-[3px] 的實際間隙
export function WinningLinesOverlay({
  hits,
  width,
  height,
  lineColors,
}: {
  hits: LineHit[]
  width: number
  height: number
  lineColors: Record<number, string>
}) {
  if (hits.length === 0 || width <= 0 || height <= 0) return null
  const cellW = (width - GRID_PAD_PX * 2 - GRID_GAP_PX * 4) / 5
  const cellH = (height - GRID_PAD_PX * 2 - GRID_GAP_PX * 2) / 3
  const colX = (col: number) => GRID_PAD_PX + col * (cellW + GRID_GAP_PX) + cellW / 2
  const rowY = (row: number) => GRID_PAD_PX + row * (cellH + GRID_GAP_PX) + cellH / 2
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-30"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {hits.map((hit) => {
        const rows = PAYLINES[hit.lineIndex]
        if (!rows) return null
        const lineNo = hit.lineIndex + 1
        const matchedCount = Math.max(2, hit.count)
        const points = rows.map((r, col) => `${colX(col)},${rowY(r)}`).join(" ")
        const color = lineColors[lineNo] ?? "oklch(0.8 0.18 90)"
        return (
          <g key={lineNo}>
            {/* 白色描邊墊底，讓彩色線在任何背景圖騰上都清楚可見 */}
            <polyline
              points={points}
              fill="none"
              stroke="white"
              strokeWidth={Math.max(5, cellW * 0.11)}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
            <polyline
              points={points}
              fill="none"
              stroke={color}
              strokeWidth={Math.max(4, cellW * 0.075)}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lp-winline-pulse"
            />
            {rows.map((r, col) => {
              const isMatched = col < matchedCount
              return (
                <circle
                  key={col}
                  cx={colX(col)}
                  cy={rowY(r)}
                  r={isMatched ? Math.max(5, cellW * 0.09) : Math.max(2, cellW * 0.03)}
                  fill={isMatched ? color : "white"}
                  stroke={isMatched ? "white" : color}
                  strokeWidth={isMatched ? 1.5 : 1}
                  opacity={isMatched ? 1 : 0.5}
                />
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}

export function CongratsBanner({ show, amount, resultId }: { show: boolean; amount: number; resultId: number }) {
  if (!show || amount <= 0) return null
  return (
    <div
      key={resultId}
      className="pointer-events-none absolute inset-x-0 top-[8%] z-40 flex justify-center px-4"
      aria-live="polite"
    >
      <div className="lp-congrats-pop flex flex-col items-center gap-0.5 rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-400 to-orange-500 px-5 py-2.5 text-center shadow-2xl">
        <span className="text-sm font-black leading-tight text-white drop-shadow">🎉 恭賀您中獎了！🎉</span>
        <span className="lp-nums text-xl font-black leading-tight text-white drop-shadow">+{amount}</span>
      </div>
    </div>
  )
}

// 九條連線各自對應的形狀名稱，順序即為第1～9線。
export const LINE_SHAPE_NAME = ["V", "一", "Z", "M", "一", "W", "A", "一", "反Z"]

// 規則說明頁的可展開章節：標題可點擊，展開後顯示詳細內容，一次只會展開一個章節。
export function RuleSection({
  title,
  open,
  onToggle,
  children,
}: {
  index: number
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between bg-muted/40 px-3 py-2.5 text-left text-sm font-bold text-foreground transition active:bg-muted/60"
      >
        <span>{title}</span>
        <span
          className={cn("text-xs text-muted-foreground transition-transform", open && "rotate-180")}
          aria-hidden
        >
          ▾
        </span>
      </button>
      {open && <div className="border-t border-border/60 bg-card px-3 py-2.5 text-xs leading-relaxed text-foreground">{children}</div>}
    </div>
  )
}

// 左側數據區：總押注分／單押注分／自動次數／自動剩餘，各自固定的文字色與底色。
export function ColorStatBox({
  label,
  value,
  textColor,
  bgColor,
}: {
  label: string
  value: string
  textColor: string
  bgColor: string
}) {
  return (
    <div
      className="lp-3d-card flex flex-1 flex-col items-center justify-center rounded-lg px-1 py-1.5"
      style={{ background: bgColor }}
    >
      <span className="text-[9px] font-semibold leading-tight" style={{ color: textColor }}>
        {label}
      </span>
      <span className="lp-nums text-[12px] font-extrabold leading-tight" style={{ color: textColor }}>
        {value}
      </span>
    </div>
  )
}

// 按鈕支援長按快速加減：按下 400ms 後開始每 90ms 重複觸發，放開或移出即停止。
export function useHoldRepeat() {
  const holdTimeout = useRef<number | null>(null)
  const repeatInterval = useRef<number | null>(null)

  const stop = () => {
    if (holdTimeout.current !== null) {
      window.clearTimeout(holdTimeout.current)
      holdTimeout.current = null
    }
    if (repeatInterval.current !== null) {
      window.clearInterval(repeatInterval.current)
      repeatInterval.current = null
    }
  }

  const start = (fn: () => void) => {
    stop()
    fn()
    holdTimeout.current = window.setTimeout(() => {
      repeatInterval.current = window.setInterval(fn, 90)
    }, 400)
  }

  useEffect(() => stop, [])

  return { start, stop }
}

export function MiniStepper({
  label,
  rangeLabel,
  value,
  onDec,
  onInc,
  disabled,
  bgColor,
  textColor,
}: {
  label: string
  rangeLabel?: string
  value: string | number
  onDec: () => void
  onInc: () => void
  disabled?: boolean
  bgColor?: string
  textColor?: string
}) {
  const { start, stop } = useHoldRepeat()
  // 手指按下時立刻鎖定這顆按鈕（pointer capture），並關掉瀏覽器內建的滑動／縮放手勢，
  // 這樣在手機上長按才不會被系統手勢誤判打斷，導致長按快速加減看起來像沒作用。
  const holdProps = (fn: () => void) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled) return
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {}
      start(fn)
    },
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    style: { touchAction: "none" as const },
  })
  const resolvedText = textColor ?? "oklch(0.32 0.12 260)"
  return (
    <div
      className="lp-3d-card flex h-full w-full flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5"
      style={{ background: bgColor ?? "oklch(0.5 0 0 / 0.12)" }}
    >
      <span className="text-[9px] font-semibold leading-tight" style={{ color: resolvedText }}>
        {label}
      </span>
      {rangeLabel && (
        <span className="text-[7.5px] leading-tight opacity-70" style={{ color: resolvedText }}>
          {rangeLabel}
        </span>
      )}
      <div className="flex items-center gap-1">
        <button
          {...holdProps(onDec)}
          disabled={disabled}
          aria-label={`減少${label}，長按可快速調整`}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card text-foreground transition active:scale-90 disabled:opacity-40"
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
            <rect x="1" y="5" width="10" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <span className="lp-nums min-w-[2.5rem] text-center text-[12px] font-extrabold" style={{ color: resolvedText }}>
          {value}
        </span>
        <button
          {...holdProps(onInc)}
          disabled={disabled}
          aria-label={`增加${label}，長按可快速調整`}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-border bg-card text-foreground transition active:scale-90 disabled:opacity-40"
        >
          <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden>
            <rect x="1" y="5" width="10" height="2" rx="1" fill="currentColor" />
            <rect x="5" y="1" width="2" height="10" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function GameScreen({
  machine,
  onBack,
  onHome,
  onSettings,
}: {
  machine: Machine
  onBack: () => void
  onHome: () => void
  onSettings: () => void
}) {
  const {
    trialCoins,
    piCoins,
    coins,
    mode,
    betPerLine,
    setBetPerLine,
    autoCount,
    setAutoCount,
    autoRemaining,
    autoTotalWin,
    freeSpinsGranted,
    freeGamesRemaining,
    lastResult,
    displayGrid,
    stoppedCols,
    history,
    spinning,
    settling,
    spin,
    startAuto,
    stopAuto,
    musicOn,
    setMusicOn,
    soundOn,
    setSoundOn,
    lang,
    setLang,
    wheelBonusOpen,
    wheelBonusStake,
    wheelBonusSpinsLeft,
    wheelBonusSpinsTotal,
    wheelBonusRound,
    resolveWheelBonus,
    startWheelBonusTest,
    } = useLuckyPi()
  const t = dictFor(lang)
  const [ruleSection, setRuleSection] = useState<number | null>(null)

  // 這一台機台自己專屬的一套圖騰造型（取代十二生肖預設造型）跟九連線色系，
  // 讓每一台機台在感官上都能跟其他機台明顯區分出來。
  const emojiMap = useMemo(() => themeEmojiMap(machine.name), [machine.name])
  const symbolLabelMap = useMemo(() => themeSymbolLabelFor(lang, machine.name), [machine.name, lang])
  const lineColors = useMemo(() => lineColorsFor(machine.hue), [machine.hue])
  const translatedThemeName = themeNameFor(lang, machine.name)

  // 這個畫面自己的「強制顯示」開關：不管遊玩紀錄裡的飛輪狀態出了什麼問題，
  // 只要玩家在規則說明頁按下測試按鈕，這個開關一定會被打開，飛輪畫面就一定會顯示出來。
  const [testWheelForceOpen, setTestWheelForceOpen] = useState(false)

  const [showRules, setShowRules] = useState(false)
  const [showWinLog, setShowWinLog] = useState(false)
  const [showSound, setShowSound] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [scatterFlashKey, setScatterFlashKey] = useState(0)
  const [scatterMistOn, setScatterMistOn] = useState(false)
  const prevFreeSpinsGranted = useRef(freeSpinsGranted)
  const [freeGamesEndFlashKey, setFreeGamesEndFlashKey] = useState(0)
  const prevFreeGamesRemaining = useRef(freeGamesRemaining)

  // 每次轉停出現新的一局結果，就把這個編號往上加一。中獎的動物圖騰跟恭賀橫幅都拿這個編號當 key，
  // 這樣「同樣中獎金額連續兩局」也一定會被當成新的一次，重新播放「動三下」跟彈出橫幅，不會被誤判成沒變化。
  const [resultId, setResultId] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const prevResultRef = useRef(lastResult)
  // 量測轉盤格子容器目前真正的像素寬高，讓中獎連線疊層能精準對齊格子中心。
  const [gridRef, gridSize] = useElementSize<HTMLDivElement>()

  // 每當畫面判定觸發 SCATTER 額外遊戲，就補一次爆閃特效＋紅光炫彩外框＋15格淡紅色雲霧，
  // 雲霧跟炫彩維持約1.6秒後自動退去，之後轉盤外框改成額外遊戲期間持續發光提示。
  useEffect(() => {
    if (freeSpinsGranted > prevFreeSpinsGranted.current) {
      setScatterFlashKey((k) => k + 1)
      setScatterMistOn(true)
      const timer = window.setTimeout(() => setScatterMistOn(false), 1650)
      prevFreeSpinsGranted.current = freeSpinsGranted
      return () => window.clearTimeout(timer)
    }
    prevFreeSpinsGranted.current = freeSpinsGranted
  }, [freeSpinsGranted])

  // 額外遊戲次數逐漸遞減，一旦真正歸零（從有次數變成 0），補一次炫光閃爍效果告知玩家額外遊戲已結束。
  useEffect(() => {
    if (prevFreeGamesRemaining.current > 0 && freeGamesRemaining === 0) {
      setFreeGamesEndFlashKey((k) => k + 1)
    }
    prevFreeGamesRemaining.current = freeGamesRemaining
  }, [freeGamesRemaining])

  // 轉停且真的中獎時，跳出「恭賀您中獎了！」橫幅並讓中獎動物動三下，停留約 2.2 秒後自動收起。
  useEffect(() => {
    if (spinning) return
    if (lastResult && lastResult !== prevResultRef.current) {
      prevResultRef.current = lastResult
      setResultId((n) => n + 1)
      if (lastResult.totalWin > 0) {
        setShowCongrats(true)
        const timer = window.setTimeout(() => setShowCongrats(false), 2200)
        return () => window.clearTimeout(timer)
      }
    }
  }, [spinning, lastResult])

  // 一進入這台機台的遊戲頁面，只要背景音樂開關是開的，就直接開始播放背景演奏音樂；
  // 離開頁面或關掉音樂開關時停止，避免疊加多個音源。
  useEffect(() => {
    if (musicOn) startBgm(machine.hue)
    return () => stopBgm()
  }, [musicOn])

  const scatterGlowActive = freeGamesRemaining > 0

  const safeBetPerLine = safeNumber(betPerLine, MIN_BET, MIN_BET, MAX_BET)
  const safeAutoCountDisplay = safeNumber(autoCount, MIN_AUTO, MIN_AUTO, MAX_AUTO)
  const totalBet = safeBetPerLine * LINE_COUNT
  const grid = displayGrid ?? lastResult?.grid
  // 中獎時，把中獎的連線整理起來：winningLineSet 給左右兩側的九連線編碼用（哪幾條線亮起），
  // winningHits 給轉盤上的彩色連線用（要精準畫出每條線「真正連中的那幾格」），
  // winningCellSet 給每一格用（只有真正連中的那幾格才會動三下，不會整條線 5 格都動）。
  const winningHits: LineHit[] = useMemo(() => {
    if (spinning || !lastResult || lastResult.totalWin <= 0) return []
    return lastResult.hits
  }, [spinning, lastResult])
  const winningLineSet = useMemo(() => new Set(winningHits.map((h) => h.lineIndex + 1)), [winningHits])
  const winningCellSet = useMemo(() => {
    const set = new Set<string>()
    winningHits.forEach((hit) => {
      const rows = PAYLINES[hit.lineIndex]
      if (!rows) return
      for (let col = 0; col < Math.max(2, hit.count) && col < rows.length; col++) {
        set.add(`${col}-${rows[col]}`)
      }
    })
    if (!spinning && lastResult && lastResult.boardWin > 0) {
      for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) set.add(`${c}-${r}`)
    }
    return set
  }, [winningHits, spinning, lastResult])
  const autoActive = autoRemaining > 0
  // 中了 BONUS 時，主遊戲頁面（手動、自動按鈕）都要暫停，直到專屬贈分飛輪全頁面結束才恢復。
  const canManualSpin =
    !spinning && !settling && !autoActive && !wheelBonusOpen && (freeGamesRemaining > 0 || coins >= totalBet)
  const canStartAuto =
    !spinning &&
    !settling &&
    !autoActive &&
    !wheelBonusOpen &&
    autoCount > 0 &&
    (freeGamesRemaining > 0 || coins >= totalBet)

  // 用「函式型」更新（依上一次的值往下算），而不是直接讀取畫面當下的變數，
  // 這樣長按快速連續觸發時，每一下都會疊加在真正最新的數值上，
  // 不會因為長按期間畫面還沒重繪、疊代成同一個舊數字而看起來像「長按沒有用」。
  const adjustBet = (dir: 1 | -1) => {
    if (spinning || autoActive) return
    setBetPerLine((prev) => safeNumber(safeNumber(prev, MIN_BET, MIN_BET, MAX_BET) + dir * BET_STEP, MIN_BET, MIN_BET, MAX_BET))
  }
  const adjustAuto = (dir: 1 | -1) => {
    if (autoActive) return
    setAutoCount((prev) =>
      safeNumber(safeNumber(prev, MIN_AUTO, MIN_AUTO, MAX_AUTO) + dir * AUTO_STEP, MIN_AUTO, MIN_AUTO, MAX_AUTO),
    )
  }

  return (
    <div
      className="relative h-dvh w-full overflow-hidden text-neutral-900"
      style={{ background: "linear-gradient(160deg, oklch(0.91 0.02 70), oklch(0.85 0.03 55))" }}
    >
      <div className="lp-slot-landscape h-full w-full flex-col">
        <header
          className="relative z-[45] flex h-[14%] shrink-0 items-center gap-1 border-b border-border px-1.5"
          style={{ background: `linear-gradient(180deg, oklch(0.22 0.07 ${machine.hue}), oklch(0.85 0.03 55) 160%)` }}
        >
          <PiEmblem size={26} spin />
          <button
            onClick={onHome}
            aria-label="返回首頁"
            className="flex h-[2.42rem] w-[2.42rem] items-center justify-center rounded-full bg-muted/70 text-[1.21rem] leading-none transition active:scale-90"
          >
            🏠
          </button>
          <button
            onClick={onBack}
            aria-label="返回遊戲大廳"
            className="flex h-[2.42rem] w-[2.42rem] items-center justify-center rounded-full bg-muted/70 text-[1.21rem] leading-none transition active:scale-90"
          >
            🎰
          </button>
          <button
            onClick={() => {
              setShowSound((v) => !v)
              setShowLang(false)
            }}
            aria-label="背景音樂、音效開關"
            className="flex h-[2.42rem] w-[2.42rem] items-center justify-center rounded-full bg-muted/70 text-[1.21rem] leading-none transition active:scale-90"
          >
            {musicOn || soundOn ? "🔊" : "🔇"}
          </button>
          <p className="flex-1 truncate text-center font-serif text-[1.8rem] font-black text-primary drop-shadow">
            {translatedThemeName}
          </p>
          <button
            onClick={onSettings}
            aria-label="連結至設定頁面"
            className="flex h-[2.42rem] w-[2.42rem] items-center justify-center rounded-full bg-muted/70 text-[1.21rem] leading-none transition active:scale-90"
          >
            ⚙️
          </button>
          <button
            onClick={() => {
              setShowRules(true)
              setShowSound(false)
              setShowLang(false)
            }}
            aria-label="查看遊戲規則說明"
            className="flex h-[2.42rem] w-[2.42rem] items-center justify-center rounded-full bg-muted/70 text-[1.21rem] leading-none transition active:scale-90"
          >
            📖
          </button>
          <button
            onClick={() => {
              setShowLang((v) => !v)
              setShowSound(false)
            }}
            aria-label="選擇語言"
            className="flex h-[2.42rem] w-[2.42rem] items-center justify-center rounded-full bg-muted/70 text-[1.21rem] leading-none transition active:scale-90"
          >
            🌍
          </button>

          {showSound && (
            <div className="absolute right-1 top-full z-50 mt-1 w-36 rounded-xl border border-border bg-card p-2 shadow-lg">
              <div className="flex items-center justify-between py-1 text-[10px] font-medium text-foreground">
                <span>背景音樂</span>
                <button
                  onClick={() => setMusicOn(!musicOn)}
                  className={cn("relative h-4 w-7 rounded-full transition", musicOn ? "bg-primary" : "bg-muted")}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 block h-3 w-3 rounded-full bg-background transition",
                      musicOn ? "left-[14px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between py-1 text-[10px] font-medium text-foreground">
                <span>音效</span>
                <button
                  onClick={() => setSoundOn(!soundOn)}
                  className={cn("relative h-4 w-7 rounded-full transition", soundOn ? "bg-primary" : "bg-muted")}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 block h-3 w-3 rounded-full bg-background transition",
                      soundOn ? "left-[14px]" : "left-0.5",
                    )}
                  />
                </button>
              </div>
              <button
                onClick={() => {
                  setShowWinLog(true)
                  setShowSound(false)
                }}
                className="mt-1 flex w-full items-center justify-between rounded-lg py-1 text-[10px] font-medium text-foreground transition hover:bg-muted"
              >
                <span>🏆 查看中獎紀錄</span>
                <span className="text-muted-foreground">›</span>
              </button>
            </div>
          )}
        </header>

        {/* 語言選單改為「置中全屏浮層」而不是貼著按鈕的小卡片：
            這台機台的畫面在直式手機上會整體旋轉90度來模擬橫向遊戲機，
            旋轉後貼齊按鈕下方的小卡片方向會跟著整個畫面一起轉，
            容易被轉盤或其他區塊蓋住、看不清楚。改成獨立置中的浮層，
            不管畫面有沒有旋轉，永遠穩穩地顯示在畫面正中央、最上層。 */}
        {showLang && (
          <div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-6"
            onClick={() => setShowLang(false)}
          >
            <div
              className="max-h-[70vh] w-full max-w-xs overflow-y-auto rounded-2xl border p-2 shadow-2xl"
              style={{ background: "#ffffff", borderColor: "#d8d8e0" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="px-2 py-1.5 text-center text-xs font-bold" style={{ color: "#6b6b78" }}>
                {t.langMenuTitle}
              </p>
              {LANGS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => {
                    setLang(l.id)
                    setShowLang(false)
                  }}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                  style={
                    lang === l.id
                      ? { background: "oklch(0.9 0.09 55)", color: "oklch(0.32 0.1 55)", fontWeight: 700 }
                      : { color: "#1c1c24" }
                  }
                  onMouseDown={(e) => {
                    if (lang !== l.id) e.currentTarget.style.background = "#f0f0f4"
                  }}
                  onMouseLeave={(e) => {
                    if (lang !== l.id) e.currentTarget.style.background = "transparent"
                  }}
                >
                  {l.native}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid h-[13%] shrink-0 grid-cols-6 gap-1 border-b border-border bg-card/50 px-1 py-1">
          {/* 試玩幣→綠色底 */}
          <ColorStatBox
            label={t.trialCoinsLabel}
            value={formatCoins(trialCoins)}
            textColor="oklch(0.28 0.09 150)"
            bgColor="oklch(0.9 0.09 150)"
          />
          {/* 免費次數／免費剩餘→紅色底 */}
          <ColorStatBox
            label={t.freeSpinsGrantedLabel}
            value={String(freeSpinsGranted)}
            textColor="oklch(0.32 0.16 25)"
            bgColor="oklch(0.9 0.08 25)"
          />
          <ColorStatBox
            label={t.freeSpinsRemainingLabel}
            value={String(freeGamesRemaining)}
            textColor="oklch(0.32 0.16 25)"
            bgColor="oklch(0.9 0.08 25)"
          />
          {/* 本局得分／自動總得→藍色底 */}
          <ColorStatBox
            label={t.roundWinLabel}
            value={lastResult ? formatCoins(lastResult.totalWin) : "0"}
            textColor="oklch(0.3 0.11 255)"
            bgColor="oklch(0.9 0.06 255)"
          />
          <ColorStatBox
            label={t.autoTotalWinLabel}
            value={formatCoins(autoTotalWin)}
            textColor="oklch(0.3 0.11 255)"
            bgColor="oklch(0.9 0.06 255)"
          />
          {/* Pi玩幣→紫色底 */}
          <ColorStatBox
            label={t.piCoinsLabel}
            value={String(piCoins).padStart(6, "0")}
            textColor="oklch(0.32 0.14 300)"
            bgColor="oklch(0.9 0.07 300)"
          />
        </div>

        <div className="flex flex-1 items-stretch gap-1 overflow-hidden px-1.5 py-1.5">
          <div className="flex h-full w-[15%] shrink-0 flex-col gap-1.5">
            <ColorStatBox
              label={t.totalBetLabel}
              value={formatCoins(totalBet)}
              textColor="oklch(0.32 0.12 260)"
              bgColor="oklch(0.92 0.06 55)"
            />
            <ColorStatBox
              label={t.betPerLineLabel}
              value={formatCoins(safeBetPerLine)}
              textColor="oklch(0.55 0.22 25)"
              bgColor="oklch(0.92 0.06 55)"
            />
            <ColorStatBox
              label={t.autoCountLabel}
              value={String(safeAutoCountDisplay)}
              textColor="oklch(0.32 0.12 260)"
              bgColor="oklch(0.92 0.045 230)"
            />
            <ColorStatBox
              label={t.autoRemainingLabel}
              value={String(safeNumber(autoRemaining, 0, 0, MAX_AUTO))}
              textColor="oklch(0.55 0.22 25)"
              bgColor="oklch(0.92 0.045 230)"
            />
          </div>

          <div className="flex flex-1 items-center justify-center">
            {/* 木質相框立體外框：淺色木紋，四角圓角做出雕花相框感。 */}
            <div
              className={cn(
                "relative flex h-full w-full max-w-full items-stretch gap-1 rounded-[20px] border-[5px] p-1.5 transition-colors duration-300",
                scatterMistOn ? "border-red-400" : scatterGlowActive ? "border-amber-300" : "border-[oklch(0.52_0.07_55)]",
              )}
              style={{
                background: "linear-gradient(155deg, oklch(0.72 0.055 60), oklch(0.6 0.06 52) 55%, oklch(0.5 0.06 48))",
                boxShadow:
                  scatterMistOn || scatterGlowActive
                    ? undefined
                    : "0 0 0 2px oklch(0.42 0.05 50), inset 0 2px 0 oklch(0.85 0.04 65 / 0.5), inset 0 -3px 6px oklch(0.3 0.04 45 / 0.5), 0 10px 22px -8px oklch(0.2 0.03 40 / 0.55)",
                animation: scatterMistOn
                  ? "lp-scatter-red-glow 0.4s ease-in-out 4"
                  : scatterGlowActive
                    ? "luckypi-scatter-glow 1.1s ease-in-out infinite"
                    : undefined,
              }}
            >
              {/* SCATTER 觸發瞬間的爆閃特效，每次新觸發都重新播放一次。 */}
              <div
                key={scatterFlashKey}
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-0 z-30 rounded-[16px] bg-amber-200",
                  scatterFlashKey > 0 && "opacity-0",
                )}
                style={scatterFlashKey > 0 ? { animation: "luckypi-scatter-flash 0.9s ease-out" } : { display: "none" }}
              />
              {/* 額外遊戲次數真正歸零瞬間的炫光閃爍收尾，播完就完全終止、外框恢復平常樣式。 */}
              {freeGamesEndFlashKey > 0 && (
                <div
                  key={`fgend-${freeGamesEndFlashKey}`}
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-30 rounded-[16px] bg-white lp-freegames-end-flash"
                />
              )}
              {freeGamesRemaining > 0 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black shadow-[0_0_10px_2px_oklch(0.85_0.18_90/0.8)]">
                  額外遊戲剩餘 {freeGamesRemaining} 次
                </span>
              )}
              {!!lastResult && lastResult.boardWin > 0 && (
                <span
                  key={`board-${lastResult.boardWin}-${lastResult.boardSymbol ?? ""}`}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 px-3 py-0.5 text-[10px] font-bold text-black shadow-[0_0_14px_3px_oklch(0.85_0.18_90/0.9)]"
                  style={{ animation: "luckypi-scatter-flash 1.4s ease-out" }}
                >
                  {t.boardWinBanner}{formatCoins(lastResult.boardWin)}
                </span>
              )}
              {/* 九連線編碼貼在木框最外側觸邊，常駐最上層，不被任何特效遮住。
                  中獎時，對應的連線編碼會亮起發光提示，讓玩家清楚看到是哪幾條連線中獎。 */}
              <CongratsBanner show={showCongrats} amount={lastResult?.totalWin ?? 0} resultId={resultId} />
              <PaylineRail side="left" winningLines={winningLineSet} lineColors={lineColors} hue={machine.hue} />
              <div
                ref={gridRef}
                className="relative grid flex-1 grid-cols-5 grid-rows-3 gap-[3px] overflow-hidden rounded-xl p-1.5"
                style={{
                  // 15 個圖騰的整片背景底色，隨機台主題色相染色，讓每一台機台的轉盤本身視覺氛圍都不一樣。
                  background: `linear-gradient(160deg, oklch(0.72 0.055 ${machine.hue}), oklch(0.6 0.06 ${machine.hue}) 55%, oklch(0.5 0.06 ${machine.hue}))`,
                  boxShadow: `inset 0 0 0 2px oklch(0.52 0.07 ${machine.hue}), inset 0 2px 6px oklch(0.4 0.05 ${machine.hue} / 0.5)`,
                }}
              >
                <TotemGrid machineId={machine.id} hue={machine.hue} themeName={machine.name} lang={lang} />
                <WinningLinesOverlay
                  hits={winningHits}
                  width={gridSize.width}
                  height={gridSize.height}
                  lineColors={lineColors}
                />
                {/* 中了 SCATTER 的瞬間，15 個圖騰上面疊一層淡紅色雲霧，跟外框的紅光炫彩同時出現。 */}
                {scatterMistOn && (
                  <div
                    aria-hidden
                    className="lp-scatter-mist pointer-events-none absolute inset-0 z-25 rounded-xl"
                    style={{
                      background:
                        "radial-gradient(oklch(0.62 0.2 22 / 0.5), oklch(0.55 0.22 15 / 0.32) 70%, transparent)",
                    }}
                  />
                )}
                {Array.from({ length: 5 }).map((_, col) => {
                  // 第 1 豎列最先停，第 5 豎列最後停：col < stoppedCols 代表這一列已經停下來了。
                  const colSpinning = spinning && col >= stoppedCols
                  return (
                    <div key={col} className="relative z-10 h-full w-full" style={{ gridColumn: col + 1, gridRow: "1 / span 3" }}>
                      <ReelColumn
                        col={col}
                        grid={grid}
                        spinning={colSpinning}
                        winningCells={winningCellSet}
                        resultId={resultId}
                        emojiMap={emojiMap}
                      />
                    </div>
                  )
                })}
                <StaticGridLines />
              </div>
              <PaylineRail side="right" winningLines={winningLineSet} lineColors={lineColors} hue={machine.hue} />
            </div>
          </div>

          <div className="flex h-full w-[15%] shrink-0 flex-col">
            <div className="flex flex-1 flex-col gap-1.5">
              <MiniStepper
                label={t.totalBetLabel}
                rangeLabel={`${MIN_BET * LINE_COUNT}～${MAX_BET * LINE_COUNT}`}
                value={formatCoins(totalBet)}
                onDec={() => adjustBet(-1)}
                onInc={() => adjustBet(1)}
                disabled={spinning || autoActive}
                bgColor="oklch(0.9 0.06 55)"
                textColor="oklch(0.32 0.12 260)"
              />
              <MiniStepper
                label={t.autoCountLabel}
                rangeLabel={`${MIN_AUTO}～${MAX_AUTO}`}
                value={safeAutoCountDisplay}
                onDec={() => adjustAuto(-1)}
                onInc={() => adjustAuto(1)}
                disabled={autoActive}
                bgColor="oklch(0.9 0.05 230)"
                textColor="oklch(0.32 0.12 260)"
              />
            </div>
            <div className="flex flex-col gap-1 pt-1">
              <button
                onClick={() => startAuto(machine)}
                disabled={!canStartAuto}
                className="lp-3d-btn rounded-lg bg-violet-600 py-1.5 text-[11px] font-bold text-white transition active:scale-95 disabled:opacity-40"
              >
                {t.autoBtn}
              </button>
              <button
                onClick={stopAuto}
                disabled={!autoActive}
                className="lp-3d-btn rounded-lg bg-red-600 py-1.5 text-[11px] font-bold text-white transition active:scale-95 disabled:opacity-40"
              >
                {t.stopBtn}
              </button>
              <button
                onClick={() => spin(machine)}
                disabled={!canManualSpin}
                className="lp-3d-btn rounded-lg bg-green-600 py-1.5 text-[11px] font-bold text-white transition active:scale-95 disabled:opacity-40"
              >
                {spinning ? "轉動中" : t.startBtn}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showRules && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background">
          <div
            className="relative flex shrink-0 items-center gap-1 border-b border-border px-1.5 py-2"
            style={{ background: `linear-gradient(180deg, oklch(0.22 0.07 ${machine.hue}), oklch(0.85 0.03 55) 160%)` }}
          >
            <PiEmblem size={26} spin />
            <button
              onClick={onHome}
              aria-label="返回首頁"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
            >
              🏠
            </button>
            <p className="flex-1 truncate text-center font-serif text-base font-bold text-primary">{t.rulesTitle}</p>
            <button
              onClick={() => {
                setShowRules(false)
                setRuleSection(null)
              }}
              aria-label="返回遊戲大廳"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
            >
              🎰
            </button>
            <button
              onClick={() => setShowLang((v) => !v)}
              aria-label="選擇語言"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
            >
              🌍
            </button>
            {showLang && (
              <div
                className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-6"
                onClick={() => setShowLang(false)}
              >
                <div
                  className="max-h-[70vh] w-56 overflow-y-auto rounded-2xl border p-2 shadow-2xl"
                  style={{ background: "#1a1420", borderColor: "#4a3a5a" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <p className="px-2 py-1.5 text-center text-xs font-bold" style={{ color: "#ffffff" }}>
                    {t.langMenuTitle}
                  </p>
                  {LANGS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setLang(l.id)
                        setShowLang(false)
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                      style={
                        lang === l.id
                          ? { background: "oklch(0.55 0.14 55)", color: "#ffffff", fontWeight: 700 }
                          : { color: "#ffffff" }
                      }
                      onMouseDown={(e) => {
                        if (lang !== l.id) e.currentTarget.style.background = "#3a2d48"
                      }}
                      onMouseLeave={(e) => {
                        if (lang !== l.id) e.currentTarget.style.background = "transparent"
                      }}
                    >
                      {l.native}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto max-w-sm space-y-2 pb-4">
              <RuleSection
                index={0}
                title={t.ruleSec1}
                open={ruleSection === 0}
                onToggle={() => setRuleSection((s) => (s === 0 ? null : 0))}
              >
                <p>{t.rulesSec1Body}</p>
              </RuleSection>

              <RuleSection
                index={1}
                title={t.ruleSec2}
                open={ruleSection === 1}
                onToggle={() => setRuleSection((s) => (s === 1 ? null : 1))}
              >
                <p className="mb-2">{t.rulesSec2Intro}</p>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  {PAYLINES.map((line, i) => (
                    <div key={i} className="rounded-lg bg-muted/60 px-1.5 py-1.5">
                      <p className="font-bold" style={{ color: lineColors[i + 1] }}>
                        第{i + 1}線
                      </p>
                      <p className="text-muted-foreground">{LINE_SHAPE_NAME[i]}形</p>
                      <div className="mt-1 flex justify-center gap-[2px]">
                        {line.map((row, c) => (
                          <div key={c} className="flex flex-col gap-[2px]">
                            {[0, 1, 2].map((r) => (
                              <span
                                key={r}
                                className="block h-1.5 w-1.5 rounded-full"
                                style={{
                                  backgroundColor: r === row ? lineColors[i + 1] : "var(--muted)",
                                  opacity: r === row ? 1 : 0.4,
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </RuleSection>

              <RuleSection
                index={2}
                title={t.ruleSec3}
                open={ruleSection === 2}
                onToggle={() => setRuleSection((s) => (s === 2 ? null : 2))}
              >
                <p className="mb-2">{t.rulesSec3Intro}</p>
                <div className="space-y-1 text-xs">
                  <div className="grid grid-cols-4 gap-1 font-bold text-muted-foreground">
                    <span>{t.tableTotem}</span>
                    <span className="text-center">{t.tableLine3}</span>
                    <span className="text-center">{t.tableLine4}</span>
                    <span className="text-center">{t.tableLine5}</span>
                  </div>
                  {[...ZODIAC_SYMBOLS.map((z) => z.id), "wild" as SymbolId]
                    .sort((a, b) => PAYTABLE[a as keyof typeof PAYTABLE][3] - PAYTABLE[b as keyof typeof PAYTABLE][3])
                    .reverse()
                    .map((id) => {
                      const p = PAYTABLE[id as keyof typeof PAYTABLE]
                      return (
                        <div key={id} className="grid grid-cols-4 gap-1 rounded-lg bg-muted/50 px-2 py-1">
                          <span className="font-medium">
                            {emojiMap[id as SymbolId]} {symbolLabelMap[id as SymbolId]}
                            {id === "wild" ? "(WILD)" : ""}
                          </span>
                          <span className="text-center">{p[3]}倍</span>
                          <span className="text-center">{p[4]}倍</span>
                          <span className="text-center">{p[5]}倍</span>
                        </div>
                      )
                    })}
                </div>
              </RuleSection>

              <RuleSection
                index={3}
                title={t.ruleSec4}
                open={ruleSection === 3}
                onToggle={() => setRuleSection((s) => (s === 3 ? null : 3))}
              >
                <p className="mb-2">{t.rulesSec4Intro}</p>
                <div className="space-y-1 text-xs">
                  {Object.entries(BOARD_PAYTABLE)
                    .sort((a, b) => b[1] - a[1])
                    .map(([id, mult]) => (
                      <div key={id} className="flex items-center justify-between rounded-lg bg-muted/50 px-2 py-1">
                        <span className="font-medium">
                          {emojiMap[id as SymbolId]} {symbolLabelMap[id as SymbolId]}
                        </span>
                        <span className="font-bold text-amber-600">
                          {t.boardMultLabel} {mult}
                        </span>
                      </div>
                    ))}
                </div>
              </RuleSection>

              <RuleSection
                index={4}
                title={t.ruleSec5}
                open={ruleSection === 4}
                onToggle={() => setRuleSection((s) => (s === 4 ? null : 4))}
              >
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                    <p className="font-bold text-amber-600">
                      {emojiMap.wild} {symbolLabelMap.wild} · {t.wildSuffix}
                    </p>
                    <p className="mt-0.5 text-foreground">{t.wildBody}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                    <p className="font-bold text-sky-600">
                      {emojiMap.bonus} {symbolLabelMap.bonus} · {t.scatterSuffix}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {t.scatterBody} ({SCATTER_FREE_GAMES[3]}／{SCATTER_FREE_GAMES[4]}／{SCATTER_FREE_GAMES[5]})
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                    <p className="font-bold text-rose-600">
                      {emojiMap.wheel} {symbolLabelMap.wheel} · {t.bonusSymSuffix}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {t.bonusSymBody} ({BONUS_WHEEL_SPINS[3]}／{BONUS_WHEEL_SPINS[4]}／{BONUS_WHEEL_SPINS[5]})
                    </p>
                  </div>
                </div>
              </RuleSection>

              <RuleSection
                index={5}
                title={t.ruleSec6}
                open={ruleSection === 5}
                onToggle={() => setRuleSection((s) => (s === 5 ? null : 5))}
              >
                <p className="mb-3">{t.rulesSec6Body}</p>
                <button
                  onClick={() => {
                    try {
                      startWheelBonusTest()
                    } catch {
                      // 即使背後的正式流程出了任何問題，下面這個強制開關仍然會讓飛輪畫面顯示出來。
                    }
                    setTestWheelForceOpen(true)
                    setShowRules(false)
                    setRuleSection(null)
                  }}
                  className="w-full rounded-full bg-rose-600 py-2 text-xs font-bold text-white transition active:scale-95"
                >
                  🎡 進入 BONUS 飛輪測試
                </button>
              </RuleSection>
            </div>
          </div>
          <div className="shrink-0 border-t border-border px-4 py-3">
            <button
              onClick={() => {
                setShowRules(false)
                setRuleSection(null)
              }}
              className="mx-auto block w-full max-w-sm rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition active:scale-95"
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      )}

      {showWinLog && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-background/60 px-3 pb-3"
          onClick={() => setShowWinLog(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-center font-serif text-base font-bold text-primary">🏆 {t.winLogTitle}</p>
            <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {history.filter((h) => h.machineId === machine.id && h.totalWin > 0).length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">{t.winLogEmpty}</p>
              ) : (
                history
                  .filter((h) => h.machineId === machine.id && h.totalWin > 0)
                  .slice(0, 30)
                  .map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs"
                    >
                      <span className="text-muted-foreground">
                        {new Date(h.at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-muted-foreground">押注 {h.bet}</span>
                      <span className="font-bold text-amber-600">+{h.totalWin}</span>
                    </div>
                  ))
              )}
            </div>
            <button
              onClick={() => setShowWinLog(false)}
              className="mt-4 w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground transition active:scale-95"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      <WheelBonusSheet
        open={wheelBonusOpen || testWheelForceOpen}
        stake={wheelBonusStake}
        spinsLeft={wheelBonusSpinsLeft}
        spinsTotal={wheelBonusSpinsTotal}
        round={wheelBonusRound}
            machineName={translatedThemeName}
        hue={machine.hue}
        onResolve={(multiplier) => {
          resolveWheelBonus(multiplier)
          if (testWheelForceOpen && multiplier === 0) {
            setTestWheelForceOpen(false)
          }
        }}
      />
    </div>
  )
}
