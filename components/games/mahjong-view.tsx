"use client"

import { useEffect, useRef, useState } from "react"
import {
  MJ_LABELS,
  isWinningHand,
  mjBotChoice,
  mjBotDiscard,
  mjDiscard,
  mjDraw,
  mjInitial,
  mjResolveClaim,
  mjSelfHu,
  mjWaitingTiles,
  type MJState,
  type MJTile,
} from "@/lib/games/mahjong"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { DIFFICULTY_LABEL, type Difficulty } from "@/lib/games/difficulty"
import { playMoveSound, playSpecialSound, playWinSound, startBgm, stopBgm } from "@/lib/games/game-audio"

const GAME_ID = "mahjong"
const RULES_BRIEF = "13張起手，輪流摸牌後打出一張；別家棄牌可吃、碰、槓或胡。集滿四組加一對即可胡牌，牌牆摸完則流局。"

const TILE_RED = "#b91c1c"
const TILE_BLUE = "#1c3f8f"
const TILE_GREEN = "#146c34"

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

const TILE_BASE =
  "relative flex items-center justify-center overflow-hidden rounded-[5px] border border-amber-950/60 bg-gradient-to-b from-white via-amber-50 to-amber-100 shadow-[0_3px_0_rgba(120,80,20,0.55),0_4px_5px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.9)]"

function TileFace({ tile, small }: { tile: MJTile; small?: boolean }) {
  const sizeCls = small ? "h-9 w-7" : "h-14 w-10"
  const suit = tile[0]

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
    // 一索: pictorial bird, the traditional exception tile in the bamboo suit — modeled on the
    // classic printed sparrow/peacock glyph: perched body facing right, head turned back over the
    // shoulder with a small crest, one long looping tail plume sweeping up and over the back, a
    // folded wing with feather lines on the flank, and two perching legs at the base.
    return (
      <span className={`${TILE_BASE} ${sizeCls}`}>
        <svg viewBox="0 0 40 56" className={small ? "h-11 w-7" : "h-[5rem] w-[3.15rem]"} fill="none">
          {/* Long looping tail plume, sweeping up from the tail base, over the back, curling near the head */}
          <path
            d="M13 42 Q3 37 6 24 Q8 14 17 9 Q23 6.5 26 10"
            stroke={TILE_BLUE}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M11 40 Q5 33 8 23" stroke={TILE_BLUE} strokeWidth="1.6" strokeLinecap="round" fill="none" />
          {/* Small crest / topknot on the head */}
          <path d="M24 5 L27 1 M27 4 L30.5 1.5 M28.5 7 L32 5.5" stroke={TILE_BLUE} strokeWidth="1.6" strokeLinecap="round" />
          {/* Perched, slender body facing right */}
          <path d="M14 21 C14 14 19 10 24 12 C30 14.5 31 25 29 35 C27 46 15 47 12 39 C10 33 11 26 14 21 Z" fill={TILE_GREEN} />
          {/* Head, turned back over the shoulder toward the tail */}
          <circle cx="25" cy="12" r="6.6" fill={TILE_GREEN} />
          {/* Beak, pointing down-left toward the body */}
          <path d="M19.5 14 L12 17 L20 19.5 Z" fill={TILE_RED} />
          {/* Eye */}
          <circle cx="25" cy="10.5" r="1.4" fill={TILE_BLUE} />
          {/* Folded wing on the flank, layered feather lines */}
          <path d="M17 25 Q24 24 25 33 Q25 40 18 41" stroke={TILE_BLUE} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <path d="M18 29 Q22 29 22 35" stroke={TILE_BLUE} strokeWidth="1.4" strokeLinecap="round" fill="none" />
          {/* Accent dot on the breast */}
          <circle cx="17" cy="28" r="1.5" fill={TILE_RED} />
          {/* Perching legs with splayed feet */}
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
            // Coin/dot: concentric ring so the pip reads as a real 筒 (core colour + rim colour).
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
    // 八索：|/\| 疊 |\/|。左右各一根直的邊槓，中間用一條連續折線相接：
    // 上半段從左槓底部（中線）往上到一個「只到一半高度」的尖峰、再往下接回右槓底部，形似 W 的簡化版；
    // 下半段從左槓頂部（中線）往下到一個「只到一半深度」的凹谷、再往上接回右槓頂部，形似 M 的簡化版。
    // 尖峰／凹谷都刻意不觸及牌面頂端／底端，只到上下半格的一半高度。
    return (
      <span className={`${TILE_BASE} ${sizeCls}`}>
        <svg viewBox="0 0 40 56" className={small ? "h-9 w-7" : "h-14 w-11"} fill="none">
          {/* 上半：|/\| — 左槓、尖峰只到一半高、右槓（底端不觸及下半段，留一點空隙） */}
          <path
            d="M8,6 L8,24 L20,15 L32,24 L32,6"
            stroke={TILE_GREEN}
            strokeWidth={6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* 下半：|\/| — 左槓、凹谷只到一半深、右槓（頂端不觸及上半段，留一點空隙） */}
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
          // Bamboo stalk with jointed banding, coloured per the requested recipe.
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

  // Flower tiles keep their pictorial glyph, framed with the same red/blue accent.
  const label = MJ_LABELS[tile] ?? tile
  return (
    <span className={`${TILE_BASE} ${sizeCls} border-2`} style={{ borderColor: TILE_BLUE }}>
      <span className={small ? "text-sm" : "text-2xl"} style={{ color: TILE_RED }}>
        {label}
      </span>
    </span>
  )
}

function WallStrip({ count }: { count: number }) {
  const shown = Math.min(count, 10)
  return (
    <div className="flex w-full max-w-sm items-center justify-center gap-2 rounded-md bg-emerald-950/50 px-2 py-1.5">
      <span className="text-[10px] font-semibold text-emerald-100/80">牌牆</span>
      <div className="flex -space-x-3">
        {Array.from({ length: shown }).map((_, i) => (
          <span
            key={i}
            className="h-6 w-4 rounded-[2px] border border-amber-900/60 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
          />
        ))}
      </div>
      <span className="text-[10px] font-bold text-emerald-50">剩 {count} 張</span>
    </div>
  )
}

export function MahjongView({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<MJState>(() => mjInitial())
  const { coins, difficulty, setDifficulty, getPuzzleStat, recordPuzzleResult, soundOn, musicOn } = useLuckyPi()
  const stat = getPuzzleStat(GAME_ID)
  const recordedRef = useRef(false)

  useEffect(() => {
    if (musicOn) startBgm()
    return () => stopBgm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (musicOn) startBgm()
    else stopBgm()
  }, [musicOn])

  const you = state.players[0]
  const yourClaim = state.claimOptions.find((c) => c.seat === 0)
  const selfWinAvailable = state.turn === 0 && state.phase === "discard" && isWinningHand(you.hand)
  const [tingHint, setTingHint] = useState<string | null>(null)
  const tingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (tingTimerRef.current) clearTimeout(tingTimerRef.current)
    }
  }, [])

  // Higher difficulty makes bots claim/chow more assertively and discard more shrewdly.
  const chowChance = difficulty === "easy" ? 0.25 : difficulty === "medium" ? 0.45 : 0.7

  useEffect(() => {
    if (state.phase === "over") {
      if (!recordedRef.current) {
        recordedRef.current = true
        const won = state.winner === 0
        if (soundOn) (won ? playWinSound() : playSpecialSound())
        recordPuzzleResult(GAME_ID, won ? "win" : state.winner === null ? "draw" : "loss")
      }
      return
    }
    if (state.phase === "draw" && state.turn !== 0) {
      const t = setTimeout(() => setState((s) => mjDraw(s)), 500)
      return () => clearTimeout(t)
    }
    if (state.phase === "discard" && state.turn !== 0) {
      const t = setTimeout(() => {
        if (soundOn) playMoveSound()
        setState((s) => {
          const bot = s.players[s.turn]
          const tile = mjBotDiscard(bot.hand)
          return mjDiscard(s, tile)
        })
      }, 650)
      return () => clearTimeout(t)
    }
    if (state.phase === "claim") {
      const botSeats = state.claimOptions.filter((c) => c.seat !== 0).map((c) => c.seat)
      if (botSeats.length > 0 && !yourClaim) {
        const t = setTimeout(() => {
          setState((s) => {
            const seat = botSeats[0]
            const opt = s.claimOptions.find((o) => o.seat === seat)
            let choice = mjBotChoice(s, seat)
            if (opt?.chow.length && choice.action === "pass" && Math.random() < chowChance) {
              choice = { action: "chow", chowPair: opt.chow[0] }
            }
            return mjResolveClaim(s, seat, choice.action, choice.chowPair)
          })
        }, 500)
        return () => clearTimeout(t)
      }
    }
  }, [state, yourClaim, chowChance, recordPuzzleResult])

  const restart = () => {
    recordedRef.current = false
    setState(mjInitial())
  }

  const handleYourDiscard = (tile: MJTile) => {
    if (state.turn !== 0 || state.phase !== "discard") return
    if (soundOn) playMoveSound()
    setState((s) => mjDiscard(s, tile))
  }

  const handleYourClaim = (action: "hu" | "pong" | "kong" | "chow" | "pass", chowPair?: [MJTile, MJTile]) => {
    if (soundOn && action !== "pass") playSpecialSound()
    setState((s) => mjResolveClaim(s, 0, action, chowPair))
  }

  const handleTing = () => {
    const waits = mjWaitingTiles(you.hand)
    setTingHint(waits.length > 0 ? `聽牌中：${waits.map((t) => MJ_LABELS[t] ?? t).join("、")}` : "尚未聽牌")
    if (tingTimerRef.current) clearTimeout(tingTimerRef.current)
    tingTimerRef.current = setTimeout(() => setTingHint(null), 2600)
  }

  const drawAvailable = state.turn === 0 && state.phase === "draw"

  const handleDraw = () => {
    if (!drawAvailable) return
    if (soundOn) playMoveSound()
    setState((s) => mjDraw(s))
  }

  const handleHuButton = () => {
    if (yourClaim?.hu) {
      handleYourClaim("hu")
      return
    }
    if (selfWinAvailable) {
      if (soundOn) playSpecialSound()
      setState((s) => mjSelfHu(s))
    }
  }

  const huAvailable = Boolean(yourClaim?.hu) || selfWinAvailable
  const pongAvailable = Boolean(yourClaim?.pong)
  const kongAvailable = Boolean(yourClaim?.kong)
  const chowOptions = yourClaim?.chow ?? []
  const actionBtn = (enabled: boolean) =>
    `rounded-full px-3 py-1.5 text-[11px] font-bold ${
      enabled ? "bg-accent text-accent-foreground" : "bg-secondary/40 text-muted-foreground/40"
    }`

  return (
    <div className="relative flex flex-1 w-full flex-col items-center gap-3 overflow-y-auto px-3 py-4">
      {tingHint && (
        <div className="pointer-events-none absolute inset-x-0 top-14 z-30 flex justify-center px-3">
          <div className="animate-in fade-in slide-in-from-top-2 rounded-full bg-primary px-3 py-1.5 text-center text-[11px] font-semibold text-primary-foreground shadow-lg">
            {tingHint}
          </div>
        </div>
      )}
      <div className="flex w-full max-w-sm items-center justify-between">
        <button onClick={onBack} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
          ← 返回大廳
        </button>
        <div className="rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-bold text-amber-600">
          遊戲幣 {coins.toLocaleString()}
        </div>
        <button onClick={restart} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">
          重新開始
        </button>
      </div>

      <div className="flex w-full max-w-sm gap-1.5">
        {(["easy", "medium", "hard"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`flex-1 rounded-full px-2 py-1 text-[10px] font-semibold transition-colors ${
              difficulty === d ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
            }`}
          >
            {DIFFICULTY_LABEL[d]}
          </button>
        ))}
      </div>

      <div className="w-full max-w-sm rounded-md bg-secondary/30 p-2 text-center text-[10px] text-muted-foreground">
        {RULES_BRIEF}
      </div>

      <div
        className={`w-full max-w-sm rounded-lg p-3 text-center text-xs ${
          state.phase === "over"
            ? state.winner === 0
              ? "bg-amber-500 text-amber-950"
              : "bg-emerald-900 text-emerald-50"
            : "bg-emerald-900 text-emerald-50"
        }`}
      >
        {state.phase === "over"
          ? state.winner !== null
            ? state.winner === 0
              ? "恭喜您胡牌獲勝！再接再厲！"
              : `${state.players[state.winner].name}胡牌獲勝，別氣餒，再拚一局！`
            : "流局，本局結束，再來一局試試手氣！"
          : state.log}
      </div>

      {state.phase === "over" && (
        <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-center text-[10px]">
          <div className="rounded-md bg-secondary/50 p-2">
            <div className="text-base font-bold text-foreground">{stat.plays}</div>
            <div className="text-muted-foreground">總局數</div>
          </div>
          <div className="rounded-md bg-secondary/50 p-2">
            <div className="text-base font-bold text-emerald-600">{stat.wins}</div>
            <div className="text-muted-foreground">胡牌次數</div>
          </div>
          <div className="rounded-md bg-secondary/50 p-2">
            <div className="text-base font-bold text-foreground">
              {stat.plays > 0 ? Math.round((stat.wins / stat.plays) * 100) : 0}%
            </div>
            <div className="text-muted-foreground">胡牌率</div>
          </div>
        </div>
      )}

      <WallStrip count={state.wall.length} />

      <div className="grid w-full max-w-sm grid-cols-3 gap-2 text-[10px]">
        {state.players.slice(1).map((p) => (
          <div key={p.seat} className="rounded-md bg-secondary/60 p-2 text-center">
            <div className="font-semibold text-foreground">{p.name}</div>
            <div className="text-muted-foreground">手牌 {p.hand.length} 張</div>
            {p.flowers.length > 0 && (
              <div className="mt-1 flex flex-wrap justify-center gap-0.5">
                {p.flowers.map((t, i) => (
                  <TileFace key={i} tile={t} small />
                ))}
              </div>
            )}
            <div className="mt-1 flex flex-wrap justify-center gap-0.5">
              {p.discards.slice(-6).map((t, i) => (
                <TileFace key={i} tile={t} small />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-sm rounded-md bg-secondary/40 p-2">
        <div className="mb-1 text-center text-[10px] text-muted-foreground">您的棄牌</div>
        <div className="flex flex-wrap justify-center gap-0.5">
          {you.discards.map((t, i) => (
            <TileFace key={i} tile={t} small />
          ))}
        </div>
      </div>

      <div className="flex w-full max-w-sm items-stretch justify-center gap-2 rounded-lg bg-primary/10 p-2">
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="text-[9px] font-semibold text-muted-foreground">吃・碰・槓</div>
          <div className="flex flex-wrap justify-center gap-1">
            {chowOptions.length > 0 ? (
              chowOptions.map((pair, i) => (
                <button key={i} onClick={() => handleYourClaim("chow", pair)} className={actionBtn(true)}>
                  吃{MJ_LABELS[pair[0]]}
                  {MJ_LABELS[pair[1]]}
                </button>
              ))
            ) : (
              <button disabled className={actionBtn(false)}>
                吃
              </button>
            )}
            <button onClick={() => handleYourClaim("pong")} disabled={!pongAvailable} className={actionBtn(pongAvailable)}>
              碰
            </button>
            <button onClick={() => handleYourClaim("kong")} disabled={!kongAvailable} className={actionBtn(kongAvailable)}>
              槓
            </button>
          </div>
        </div>
        <div className="w-px bg-border" />
        <div className="flex flex-1 flex-col items-center gap-1">
          <div className="text-[9px] font-semibold text-muted-foreground">聽・胡・摸牌</div>
          <div className="flex flex-wrap justify-center gap-1">
            <button onClick={handleTing} disabled={state.turn !== 0} className={actionBtn(state.turn === 0)}>
              聽
            </button>
            <button onClick={handleHuButton} disabled={!huAvailable} className={actionBtn(huAvailable)}>
              胡
            </button>
            <button onClick={handleDraw} disabled={!drawAvailable} className={actionBtn(drawAvailable)}>
              摸牌
            </button>
          </div>
        </div>
      </div>

      {state.phase === "claim" && yourClaim && (
        <div className="w-full max-w-sm">
          <button
            onClick={() => handleYourClaim("pass")}
            className="w-full rounded-full bg-secondary px-4 py-2 text-xs font-bold"
          >
            過
          </button>
        </div>
      )}

      <div className="mt-auto w-full max-w-sm">
        <div className="mb-1 text-center text-[10px] text-muted-foreground">
          您的手牌{state.turn === 0 && state.phase === "discard" ? " · 點擊要打出的牌" : ""}
        </div>
        <div className="flex flex-wrap justify-center gap-0.5 rounded-md bg-amber-950/5 p-2">
          {you.hand.map((t, i) => (
            <button
              key={i}
              onClick={() => handleYourDiscard(t)}
              disabled={state.turn !== 0 || state.phase !== "discard"}
              className="disabled:opacity-90"
            >
              <TileFace tile={t} />
            </button>
          ))}
        </div>
        {you.melds.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-1">
            {you.melds.map((m, i) => (
              <div key={i} className="flex gap-0.5 rounded bg-secondary/50 p-1">
                {m.tiles.map((t, j) => (
                  <TileFace key={j} tile={t} small />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
