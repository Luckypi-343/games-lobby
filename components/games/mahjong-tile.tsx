"use client"

import { MJ_LABELS, type MJTile } from "@/lib/games/mahjong"

export const TILE_RED = "#b91c1c"
export const TILE_BLUE = "#1c3f8f"
export const TILE_GREEN = "#146c34"

type TongDot = { x: number; y: number; core: string; ring?: string; big?: boolean; ringSplit?: number }
type SuoStick = { x: number; y: number; color: string }

// Dot layouts for 筒 (circles), following the requested per-tile colour recipe exactly
// (e.g. 五筒 = four corner dots + a red centre, 九筒 = green/red/blue rows).
const TONG_LAYOUTS: Record<number, TongDot[]> = {
  // 一筒: 中紅外綠，放大圖，外圈綠色比重加大（ringSplit 讓紅心只占前 40%）。
  1: [{ x: 50, y: 50, core: TILE_RED, ring: TILE_GREEN, big: true, ringSplit: 40 }],
  2: [
    { x: 50, y: 28, core: TILE_BLUE },
    { x: 50, y: 72, core: TILE_GREEN },
  ],
  3: [
    { x: 50, y: 18, core: TILE_BLUE },
    { x: 50, y: 50, core: TILE_RED },
    { x: 50, y: 82, core: TILE_GREEN },
  ],
  4: [
    { x: 26, y: 22, core: TILE_BLUE },
    { x: 74, y: 22, core: TILE_GREEN },
    { x: 26, y: 78, core: TILE_GREEN },
    { x: 74, y: 78, core: TILE_BLUE },
  ],
  5: [
    { x: 26, y: 22, core: TILE_BLUE },
    { x: 74, y: 22, core: TILE_GREEN },
    { x: 50, y: 50, core: TILE_RED },
    { x: 26, y: 78, core: TILE_GREEN },
    { x: 74, y: 78, core: TILE_BLUE },
  ],
  6: [
    { x: 32, y: 20, core: TILE_BLUE },
    { x: 68, y: 20, core: TILE_BLUE },
    { x: 30, y: 55, core: TILE_RED },
    { x: 70, y: 55, core: TILE_RED },
    { x: 30, y: 85, core: TILE_RED },
    { x: 70, y: 85, core: TILE_RED },
  ],
  7: [
    { x: 22, y: 14, core: TILE_GREEN },
    { x: 50, y: 26, core: TILE_GREEN },
    { x: 78, y: 38, core: TILE_GREEN },
    { x: 28, y: 64, core: TILE_RED },
    { x: 72, y: 64, core: TILE_RED },
    { x: 28, y: 90, core: TILE_RED },
    { x: 72, y: 90, core: TILE_RED },
  ],
  8: [
    { x: 28, y: 12, core: TILE_BLUE },
    { x: 72, y: 12, core: TILE_BLUE },
    { x: 28, y: 37, core: TILE_BLUE },
    { x: 72, y: 37, core: TILE_BLUE },
    { x: 28, y: 63, core: TILE_BLUE },
    { x: 72, y: 63, core: TILE_BLUE },
    { x: 28, y: 88, core: TILE_BLUE },
    { x: 72, y: 88, core: TILE_BLUE },
  ],
  9: [
    { x: 22, y: 16, core: TILE_GREEN },
    { x: 50, y: 16, core: TILE_GREEN },
    { x: 78, y: 16, core: TILE_GREEN },
    { x: 22, y: 50, core: TILE_RED },
    { x: 50, y: 50, core: TILE_RED },
    { x: 78, y: 50, core: TILE_RED },
    { x: 22, y: 84, core: TILE_BLUE },
    { x: 50, y: 84, core: TILE_BLUE },
    { x: 78, y: 84, core: TILE_BLUE },
  ],
}

// 索 (bamboo) layouts; every stick is a solid colour per the requested recipe (一索 is
// rendered separately as a pictorial bird, matching the traditional sparrow tile).
const SUO_LAYOUTS: Record<number, SuoStick[]> = {
  2: [
    { x: 50, y: 28, color: TILE_GREEN },
    { x: 50, y: 72, color: TILE_GREEN },
  ],
  3: [
    { x: 50, y: 20, color: TILE_GREEN },
    { x: 30, y: 76, color: TILE_GREEN },
    { x: 70, y: 76, color: TILE_GREEN },
  ],
  4: [
    { x: 30, y: 25, color: TILE_GREEN },
    { x: 70, y: 25, color: TILE_GREEN },
    { x: 30, y: 75, color: TILE_GREEN },
    { x: 70, y: 75, color: TILE_GREEN },
  ],
  5: [
    { x: 30, y: 22, color: TILE_GREEN },
    { x: 70, y: 22, color: TILE_GREEN },
    { x: 50, y: 50, color: TILE_RED },
    { x: 30, y: 80, color: TILE_GREEN },
    { x: 70, y: 80, color: TILE_GREEN },
  ],
  6: [
    { x: 24, y: 20, color: TILE_GREEN },
    { x: 50, y: 20, color: TILE_GREEN },
    { x: 76, y: 20, color: TILE_GREEN },
    { x: 24, y: 80, color: TILE_GREEN },
    { x: 50, y: 80, color: TILE_GREEN },
    { x: 76, y: 80, color: TILE_GREEN },
  ],
  7: [
    { x: 50, y: 12, color: TILE_RED },
    { x: 24, y: 44, color: TILE_GREEN },
    { x: 50, y: 44, color: TILE_GREEN },
    { x: 76, y: 44, color: TILE_GREEN },
    { x: 24, y: 82, color: TILE_GREEN },
    { x: 50, y: 82, color: TILE_GREEN },
    { x: 76, y: 82, color: TILE_GREEN },
  ],
  8: [
    { x: 16, y: 22, color: TILE_GREEN },
    { x: 39, y: 34, color: TILE_GREEN },
    { x: 61, y: 22, color: TILE_GREEN },
    { x: 84, y: 34, color: TILE_GREEN },
    { x: 16, y: 84, color: TILE_GREEN },
    { x: 39, y: 72, color: TILE_GREEN },
    { x: 61, y: 84, color: TILE_GREEN },
    { x: 84, y: 72, color: TILE_GREEN },
  ],
  9: [
    { x: 22, y: 18, color: TILE_GREEN },
    { x: 22, y: 50, color: TILE_GREEN },
    { x: 22, y: 82, color: TILE_GREEN },
    { x: 50, y: 18, color: TILE_RED },
    { x: 50, y: 50, color: TILE_RED },
    { x: 50, y: 82, color: TILE_RED },
    { x: 78, y: 18, color: TILE_GREEN },
    { x: 78, y: 50, color: TILE_GREEN },
    { x: 78, y: 82, color: TILE_GREEN },
  ],
}

const HONOR_CHAR: Record<string, string> = { E: "東", S: "南", W: "西", N: "北", R: "中", G: "發", B: "" }
const HONOR_COLOR: Record<string, string> = {
  E: TILE_BLUE,
  S: TILE_BLUE,
  W: TILE_BLUE,
  N: TILE_BLUE,
  R: TILE_RED,
  G: TILE_BLUE,
  B: TILE_BLUE,
}

export const TILE_BASE =
  "relative flex items-center justify-center overflow-hidden rounded-[5px] border border-amber-950/60 bg-gradient-to-b from-white via-amber-50 to-amber-100 shadow-[0_3px_0_rgba(120,80,20,0.55),0_4px_5px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9)]"

/** Shared tile face renderer: renders any mahjong tile with the same 3D/dot-pip art used across the mahjong tables. */
export function MahjongTileFace({ tile, small }: { tile: MJTile | string; small?: boolean }) {
  const sizeCls = small ? "h-9 w-7" : "h-14 w-10"
  const suit = tile[0]

  if (tile === "JK") {
    return (
      <span className={`${TILE_BASE} ${sizeCls} border-2`} style={{ borderColor: "#c026d3" }}>
        <span className={`font-black ${small ? "text-[10px]" : "text-sm"}`} style={{ color: "#c026d3" }}>
          飛
        </span>
      </span>
    )
  }

  if (suit === "w" && /^w[1-9]$/.test(tile)) {
    const label = MJ_LABELS[tile] ?? tile
    return (
      <span className={`${TILE_BASE} ${sizeCls} flex-col gap-0`}>
        <span className={`font-black leading-none ${small ? "text-[11px]" : "text-lg"}`} style={{ color: TILE_BLUE }}>
          {label.charAt(0)}
        </span>
        <span className={`font-black leading-none ${small ? "text-[11px]" : "text-lg"}`} style={{ color: TILE_RED }}>
          萬
        </span>
      </span>
    )
  }

  if (suit === "s" && tile === "s1") {
    return (
      <span className={`${TILE_BASE} ${sizeCls}`}>
        <svg viewBox="0 0 40 56" className={small ? "h-11 w-7" : "h-[5rem] w-[3.15rem]"} fill="none">
          <path
            d="M13 42 Q3 37 6 24 Q8 14 17 9 Q23 6.5 26 10"
            stroke={TILE_BLUE}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M11 40 Q5 33 8 23" stroke={TILE_BLUE} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          <path d="M24 5 L27 1 M27 4 L30.5 1.5 M28.5 7 L32 5.5" stroke={TILE_BLUE} strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 21 C14 14 19 10 24 12 C30 14.5 31 25 29 35 C27 46 15 47 12 39 C10 33 11 26 14 21 Z" fill={TILE_GREEN} />
          <circle cx="25" cy="12" r="6.6" fill={TILE_GREEN} />
          <path d="M19.5 14 L12 17 L20 19.5 Z" fill={TILE_RED} />
          <circle cx="25" cy="10.5" r="1.4" fill={TILE_BLUE} />
          <path d="M17 25 Q24 24 25 33 Q25 40 18 41" stroke={TILE_BLUE} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M18 29 Q22 29 22 35" stroke={TILE_BLUE} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <circle cx="17" cy="28" r="1.5" fill={TILE_RED} />
          <path
            d="M18 46 L15 54 M18 46 L13 51 M18 46 L18 54 M24 46 L27 54 M24 46 L29 51 M24 46 L24 54"
            stroke={TILE_RED}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }

  if (suit === "t" && /^t[1-9]$/.test(tile)) {
    const n = Number(tile.slice(1))
    const layout = TONG_LAYOUTS[n] ?? []
    const baseSize = small ? 7 : 12
    return (
      <span className={`${TILE_BASE} ${sizeCls}`}>
        {layout.map((d, i) => {
          const ring = d.ring ?? d.core
          const size = d.big ? Math.round(baseSize * 1.9) : baseSize
          const split = d.ringSplit ?? 55
          return (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: size,
                height: size,
                transform: "translate(-50%, -50%)",
                background: `radial-gradient(circle at 32% 26%, rgba(255,255,255,0.95), rgba(255,255,255,0.05) 38%, transparent 55%), radial-gradient(circle, ${d.core} 0 ${split}%, ${ring} ${split + 1}% 100%)`,
                boxShadow: "0 1px 1.5px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.35)",
              }}
            />
          )
        })}
      </span>
    )
  }

  if (suit === "s" && tile === "s8") {
    return (
      <span className={`${TILE_BASE} ${sizeCls}`}>
        <svg viewBox="0 0 40 56" className={small ? "h-9 w-7" : "h-14 w-11"} fill="none">
          <path
            d="M8,6 L8,24 L20,15 L32,24 L32,6"
            stroke={TILE_GREEN}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M8,50 L8,32 L20,41 L32,32 L32,50"
            stroke={TILE_GREEN}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }

  if (suit === "s" && /^s[2-9]$/.test(tile)) {
    const n = Number(tile.slice(1))
    const layout = SUO_LAYOUTS[n] ?? []
    return (
      <span className={`${TILE_BASE} ${sizeCls}`}>
        {layout.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-[2px]"
            style={{
              left: `${d.x}%`,
              top: `${d.y}%`,
              width: small ? 4 : 6,
              height: small ? 13 : 20,
              transform: "translate(-50%, -50%)",
              background: `linear-gradient(180deg, ${d.color} 0 32%, rgba(0,0,0,0.28) 32% 38%, ${d.color} 38% 62%, rgba(0,0,0,0.28) 62% 68%, ${d.color} 68% 100%)`,
              boxShadow: "0 1px 1.5px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.4), inset -1px 0 1px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </span>
    )
  }

  if (tile in HONOR_CHAR) {
    const isBlank = tile === "B"
    return (
      <span className={`${TILE_BASE} ${sizeCls} border-2`} style={{ borderColor: TILE_RED }}>
        <span className="pointer-events-none absolute inset-[8%] rounded-[3px] border" style={{ borderColor: TILE_BLUE }} />
        {!isBlank && (
          <span className={`relative font-black ${small ? "text-xs" : "text-xl"}`} style={{ color: HONOR_COLOR[tile] }}>
            {HONOR_CHAR[tile]}
          </span>
        )}
      </span>
    )
  }

  const label = MJ_LABELS[tile] ?? tile
  return (
    <span className={`${TILE_BASE} ${sizeCls} border-2`} style={{ borderColor: TILE_BLUE }}>
      <span className={small ? "text-sm" : "text-2xl"} style={{ color: TILE_RED }}>
        {label}
      </span>
    </span>
  )
}

/** Face-down tile back, matching the tile body's 3D amber styling. */
export function MahjongTileBack({ small }: { small?: boolean }) {
  const sizeCls = small ? "h-9 w-7" : "h-14 w-10"
  return (
    <span
      className={`${sizeCls} rounded-[5px] border border-emerald-950/60 bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-950 shadow-[0_3px_0_rgba(0,40,20,0.55),0_4px_5px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.25)]`}
    />
  )
}
