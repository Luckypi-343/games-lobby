import type { CSSProperties } from "react"
import { shuffledSymbolOrder, type PatternId } from "@/lib/luckypi/data"
import type { LangId } from "@/lib/luckypi/i18n"
import { themeSymbolLabelFor } from "@/lib/luckypi/slot-i18n"

// One exclusive silhouette per gambling theme -- its "台徽" totem, independent of tier colour.
const TOTEM_PATHS: Record<string, string> = {
  zodiac:
    "M12 2.2a9.8 9.8 0 1 0 0 19.6 9.8 9.8 0 0 0 0-19.6z M12 2.2v3.4 M12 18.4v3.4 M21.8 12h-3.4 M5.6 12H2.2 M18.7 5.3l-2.4 2.4 M7.7 16.3l-2.4 2.4 M18.7 18.7l-2.4-2.4 M7.7 7.7 5.3 5.3 M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z",
  dragon:
    "M4 17c1.5-5 4-9 9-11 1 2.5-0.5 4.5-2.5 5.5 3-0.3 5.5 1 6.5 3.5-2.8-0.8-4.8 0-5.8 1.8 2 0.8 3.5 2.5 3.8 4.2-2.8-2-5.5-2-7.8 0-1-2 0-4 2-5-3 0.5-5 0.2-6 0.5z M6 14.5c-0.8 0.3-1.5 1-1.8 2",
  ingot: "M6.5 13.5 8.5 8h7l2 5.5-3.5 5.5h-6z M9 19h6 M8.5 8c1-1.5 5.5-1.5 7 0",
  lantern: "M8.5 4.5h7v2.5h-7z M6.5 8.5h11l1 8-3 3h-6l-3-3z M11 4.5v-1.2h2v1.2 M9.5 12h5 M9.5 15h5",
  pearl: "M12 3l2.4 5 5.5.8-4 3.9.9 5.4L12 15.4l-4.8 2.7.9-5.4-4-3.9 5.5-.8z",
  crown: "M4.5 17 5.5 8.5 9 12.5l3-6.5 3 6.5 3.5-4 1 8.5z M4.5 17h15v2h-15z M12 8.5v0",
  bolt: "M13.5 2 5.5 14h5.5l-1.5 8 8-12h-5.5z",
  shield: "M12 3.2 18.5 6v6c0 5-2.8 7.8-6.5 8.8C8.3 19.8 5.5 17 5.5 12V6z M9 12l2.2 2.2L15 10",
  horseshoe:
    "M7.5 4.3a6.2 6.2 0 0 0-1.8 12.2l1.6-2.8a3.3 3.3 0 1 1 9.4 0l1.6 2.8A6.2 6.2 0 0 0 16.5 4.3a6.2 6.2 0 0 0-9 0z",
  dice: "M5.5 5.5h13v13h-13z M8.7 8.7h.1 M15.3 8.7h.1 M12 12h.1 M8.7 15.3h.1 M15.3 15.3h.1",
  firework: "M12 2v5.5 M12 16.5V22 M2 12h5.5 M16.5 12H22 M5.3 5.3l3.9 3.9 M14.8 14.8l3.9 3.9 M18.7 5.3l-3.9 3.9 M9.2 14.8l-3.9 3.9",
  coinrain:
    "M7 3.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M17 3.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M12 11.5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z M7 6.5v0 M17 6.5v0 M12 14.5v0",
  sunrise: "M12 2.5v3.2 M4.9 8.6l2.3 2.3 M19.1 8.6l-2.3 2.3 M2 16.5h20 M6.2 16.5a5.8 5.8 0 0 1 11.6 0",
  diamond: "M4.5 9h15L12 21.5z M4.5 9l4-6.5h7l4 6.5",
  palace: "M4.5 20V10.5l3.8-3v3h7.4v-3l3.8 3V20z M9.3 20v-6h5.4v6 M4.5 10.5h15",
  wave: "M2.5 8c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0 M2.5 14c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0 M2.5 20c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0",
  coin:
    "M12 3.2a8.8 8.8 0 1 0 0 17.6 8.8 8.8 0 0 0 0-17.6z M12 7.2v9.6 M9.2 9.6c0-1.5 1.2-2.4 2.8-2.4s2.8.9 2.8 2.2c0 3-5.6 1.4-5.6 4.4 0 1.4 1.2 2.4 2.8 2.4s2.8-.9 2.8-2.2",
  // 第16～30台（白銀台）專屬的另一組 15 個台徽，徹底不同於青銅台。
  koi: "M3 12c3-4 7-6 11-6 2 0 4 .6 5 2l2-1.5-1 3.5 1 3.5-2-1.5c-1 1.4-3 2-5 2-4 0-8-2-11-6z M9 12a.5 .5 0 1 0 0-.1",
  qilin:
    "M12 2.2c1.2 1.8 1.6 3.6.6 5.4 1.8-.6 3.6 0 4.6 1.6-1.8 0-3.2.8-3.8 2.2 1.8.4 3 1.8 3.4 3.6-1.8-1-3.4-.8-4.4.4-1-1.2-2.6-1.4-4.4-.4.4-1.8 1.6-3.2 3.4-3.6-.6-1.4-2-2.2-3.8-2.2 1-1.6 2.8-2.2 4.6-1.6-1-1.8-.6-3.6.6-5.4z",
  phoenix: "M12 3c3 1 5 4 4 8-.5 2-2 3.5-4 4-2-.5-3.5-2-4-4-1-4 1-7 4-8z M12 15v6 M8 19l4 2 4-2",
  rocket: "M12 2c3 2 4 6 4 10l-2 3h-4l-2-3c0-4 1-8 4-10z M9 12l-3 2 1 3 3-1 M15 12l3 2-1 3-3-1 M12 9a1.1 1.1 0 1 0 0-.1",
  mech: "M7 6h10v9a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z M9 3.5h6v2.5h-6z M9.5 10.5h.1 M14.5 10.5h.1 M9 14.5h6",
  ghost:
    "M12 2.5a7 7 0 0 0-7 7v10.5l2.3-2 2.2 2 2.2-2 2.3 2 2.2-2 2.3 2V9.5a7 7 0 0 0-7-7z M9.3 10.5a1 1 0 1 0 0-.1 M14.7 10.5a1 1 0 1 0 0-.1",
  shuriken: "M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z",
  katana: "M4 20 16 8 M14.5 6.5 17.5 9.5 M18.5 5.5 20 7 18.5 8.5 17 7z M4 20l1.5-1.5",
  scarab:
    "M12 7a3.2 3.2 0 1 0 0 6.4A3.2 3.2 0 0 0 12 7z M12 2.5v2 M12 19.5v2 M8 4l1.3 1.6 M16 4l-1.3 1.6 M5 9.5h2.3 M16.7 9.5H19 M6 16l2.5-1.8 M18 16l-2.5-1.8 M9.3 13.5 8 19 M14.7 13.5 16 19",
  mjolnir: "M8 3h8v6H8z M12 9v4 M7.5 13h9l1.5 7-6-2-6 2z",
  circus: "M12 3 20 15H4z M12 3v12 M4 15h16v4H4z",
  gear:
    "M12 3v2.2 M12 18.8V21 M3 12h2.2 M18.8 12H21 M5.6 5.6l1.6 1.6 M16.8 16.8l1.6 1.6 M18.4 5.6l-1.6 1.6 M7.2 16.8l-1.6 1.6 M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z",
  aurora: "M3 16c2-3 4-5 9-5s7 2 9 5 M3 11c2-3 4-5 9-5s7 2 9 5 M12 18l2.2-3.6h-4.4z",
  leaf: "M4 20c0-9 6-15 15-16-1 9-7 15-16 16z M8 16c2-3 5-5 9-6",
  diving: "M6 10a6 6 0 0 1 12 0v2a2 2 0 0 1-2 2h-2.5l-1.5 3-1.5-3H8a2 2 0 0 1-2-2z M9 10.5h.1 M15 10.5h.1",
}

export function MachineTotem({ id, className }: { id: string; className?: string }) {
  const d = TOTEM_PATHS[id] ?? TOTEM_PATHS.coin
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  )
}

// The real "15 個圖騰網格" behind the reels: every machine tiles all 15 possible symbols
// (12 生肖 + 百搭 + 額外 + 飛輪) as a faint background grid, shuffled per machine id so each
// theme's board still reads as its own layout while genuinely showing all 15 totems.
export function TotemGrid({
  machineId,
  hue,
  themeName,
  lang,
}: {
  machineId: string
  hue: number
  themeName: string
  lang: LangId
}) {
  const order = shuffledSymbolOrder(machineId)
  const cells = Array.from({ length: 30 }, (_, i) => order[i % order.length])
  const labelMap = themeSymbolLabelFor(lang, themeName)
  return (
    <div
      className="pointer-events-none absolute inset-0 grid grid-cols-5 grid-rows-6 place-items-center opacity-[0.16]"
      aria-hidden
    >
      {cells.map((id, i) => (
        <span
          key={i}
          className="font-serif text-[11px] font-bold leading-none"
          style={{ color: `oklch(0.9 0.06 ${hue})` }}
        >
          {labelMap[id]}
        </span>
      ))}
    </div>
  )
}

// A distinct reel-grid texture per machine, so each theme's 3x5 board reads as its own design.
export function patternStyle(pattern: PatternId, hue: number): CSSProperties {
  const line = `oklch(0.92 0.05 ${hue} / 0.16)`
  const line2 = `oklch(0.92 0.05 ${hue} / 0.09)`
  switch (pattern) {
    case "diamond":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${line} 0 2px, transparent 2px 14px), repeating-linear-gradient(-45deg, ${line} 0 2px, transparent 2px 14px)`,
      }
    case "hex":
      return {
        backgroundImage: `radial-gradient(circle at 25% 25%, ${line} 0 3px, transparent 4px), radial-gradient(circle at 75% 75%, ${line} 0 3px, transparent 4px)`,
        backgroundSize: "20px 20px",
      }
    case "cross":
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${line} 0 1.5px, transparent 1.5px 12px), repeating-linear-gradient(90deg, ${line} 0 1.5px, transparent 1.5px 12px)`,
      }
    case "brick":
      return {
        backgroundImage: `repeating-linear-gradient(0deg, ${line} 0 1.5px, transparent 1.5px 11px), repeating-linear-gradient(90deg, ${line2} 0 1.5px, transparent 1.5px 22px)`,
      }
    case "chevron":
      return {
        backgroundImage: `repeating-linear-gradient(135deg, ${line} 0 2px, transparent 2px 10px, ${line2} 10px 12px, transparent 12px 20px)`,
      }
    default:
      return {}
  }
}
