import { cn } from "@/lib/utils"
import { SPECIAL_OVERLAY, type SymbolId } from "@/lib/luckypi/data"

// 直接使用真實的生肖 Emoji，不再用幾何線條 SVG 取代。
// 這份對照表也輸出給轉輪滾動用的裸 emoji 條使用，讓滾動中的圖案跟停格後看到的是同一套。
export const SYMBOL_EMOJI: Record<SymbolId, string> = {
  rat: "🐀",
  ox: "🐃",
  tiger: "🐅",
  rabbit: "🐇",
  dragon: "🐲",
  snake: "🐍",
  horse: "🐎",
  goat: "🐐",
  monkey: "🐒",
  rooster: "🐓",
  dog: "🐕",
  pig: "🐖",
  wild: "🐲",
  bonus: "🐅",
  wheel: "🐀",
}

// 每個圖騰方形櫥窗自己的底色（非文字辨識，靠色調＋真實生肖造型辨識）。
const SYMBOL_TINT: Record<SymbolId, string> = {
  rat: "oklch(0.86 0.03 60)",
  ox: "oklch(0.86 0.03 60)",
  dog: "oklch(0.86 0.03 60)",
  pig: "oklch(0.86 0.03 60)",
  rabbit: "oklch(0.88 0.05 340)",
  goat: "oklch(0.88 0.05 340)",
  rooster: "oklch(0.88 0.05 340)",
  snake: "oklch(0.87 0.06 145)",
  horse: "oklch(0.87 0.06 145)",
  monkey: "oklch(0.87 0.06 145)",
  tiger: "oklch(0.82 0.14 45)",
  dragon: "oklch(0.83 0.15 90)",
  wild: "oklch(0.83 0.15 90)",
  bonus: "oklch(0.82 0.14 45)",
  wheel: "oklch(0.86 0.03 60)",
}
const SYMBOL_INK: Record<SymbolId, string> = {
  rat: "oklch(0.32 0.02 60)",
  ox: "oklch(0.32 0.02 60)",
  dog: "oklch(0.32 0.02 60)",
  pig: "oklch(0.32 0.02 60)",
  rabbit: "oklch(0.34 0.08 340)",
  goat: "oklch(0.34 0.08 340)",
  rooster: "oklch(0.34 0.08 340)",
  snake: "oklch(0.32 0.09 145)",
  horse: "oklch(0.32 0.09 145)",
  monkey: "oklch(0.32 0.09 145)",
  tiger: "oklch(0.32 0.16 30)",
  dragon: "oklch(0.3 0.14 60)",
  wild: "oklch(0.3 0.14 60)",
  bonus: "oklch(0.32 0.16 30)",
  wheel: "oklch(0.32 0.02 60)",
}

export function SymbolGlyph({
  symbol,
  size = "md",
  spinning = false,
}: {
  symbol: SymbolId
  size?: "sm" | "md" | "lg" | "xl" | "cell"
  spinning?: boolean
}) {
  // "cell" 尺寸不用固定像素，而是完全填滿外層格子的寬高，
  // 讓圖騰底色塊永遠等於轉盤的那一個方格，不會超出 3×5 網格線之外。
  const boxSizes = { sm: "h-9 w-9", md: "h-14 w-14", lg: "h-16 w-16", xl: "h-20 w-20", cell: "h-full w-full" }
  const emojiSizes = { sm: "text-xl", md: "text-3xl", lg: "text-4xl", xl: "text-5xl", cell: "text-[min(9vw,2.6rem)]" }
  const overlaySizes = { sm: "text-[6px]", md: "text-[9px]", lg: "text-[10px]", xl: "text-[11px]", cell: "text-[10px]" }
  const special = symbol === "wild" || symbol === "bonus" || symbol === "dragon" || symbol === "wheel"
  const overlayWord = symbol === "wild" || symbol === "bonus" || symbol === "wheel" ? SPECIAL_OVERLAY[symbol] : null

  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-md shadow-md ring-1 ring-inset ring-black/10",
        boxSizes[size],
        spinning && "lp-reel-spin",
        special && !spinning && "lp-glow",
      )}
      style={{
        background: `linear-gradient(155deg, ${SYMBOL_TINT[symbol]}, oklch(0.94 0.015 60))`,
        color: SYMBOL_INK[symbol],
      }}
    >
      <span className="pointer-events-none absolute inset-[2px] rounded-[5px] ring-1 ring-inset ring-white/40" />
      <span className={cn("relative leading-none drop-shadow-sm", emojiSizes[size])} aria-hidden>
        {SYMBOL_EMOJI[symbol]}
      </span>
      {overlayWord && (
        // 特殊圖騰疊字：WILD／SCATTER／BONUS，白底立體字樣橫蓋在生肖圖騰中間。
        <span
          className={cn(
            "absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 rounded-[3px] bg-white text-center font-sans font-black leading-none tracking-tight text-black shadow-[0_1px_0_rgba(0,0,0,0.35),0_2px_2px_rgba(0,0,0,0.45)]",
            overlaySizes[size],
          )}
          style={{ padding: "1px 0" }}
        >
          {overlayWord}
        </span>
      )}
      {symbol === "bonus" && (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-destructive ring-1 ring-background" />
      )}
      {symbol === "wheel" && (
        <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-yellow-400 ring-1 ring-background" />
      )}
    </div>
  )
}
