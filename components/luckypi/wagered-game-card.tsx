"use client"

// 博奕區「押注可調」撲克桌（10點半／梭哈／牛牛／炸金花⋯）在大廳的展示卡片，
// 外觀完全比照 01～30 號一般機台的卡片樣式（同一套 Card／徽章／底色風格），
// 不再另外用一套獨立設計，維持整個大廳視覺一致。
import type { PuzzleGame } from "@/lib/luckypi/data"
import { patternOf } from "@/lib/luckypi/data"
import { patternStyle } from "./machine-totem"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import { Card, Pill, IconSpade, IconMedal } from "./ui"

export function WageredGameCard({
  game,
  slotLabel,
  onPlay,
}: {
  game: PuzzleGame
  slotLabel: string
  onPlay: (game: PuzzleGame) => void
}) {
  const { lang } = useLuckyPi()
  const t = dictFor(lang)
  const isReady = game.status === "ready"

  return (
    <button onClick={() => onPlay(game)} className="text-left">
      <Card className="flex flex-col gap-2 p-3 transition active:scale-95">
        <div
          className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl"
          style={{
            background: `radial-gradient(circle at 28% 22%, oklch(0.62 0.17 ${game.hue}), oklch(0.18 0.07 ${game.hue}) 75%)`,
          }}
        >
          <span className="absolute inset-0" style={patternStyle(patternOf(game.id), game.hue)} />
          <span
            className="relative flex h-[92%] w-[92%] flex-col items-center justify-center gap-0.5 rounded-full border-2 border-white/25 bg-black/40 shadow-lg"
            style={{ boxShadow: `0 0 14px -2px oklch(0.75 0.18 ${game.hue} / 0.85)` }}
          >
            <span className="text-3xl font-black leading-none text-white drop-shadow" aria-hidden>
              {game.glyph}
            </span>
            <span className="rounded-md bg-amber-500/95 px-1.5 py-0.5 text-[8px] font-black tracking-wide text-black shadow">
              押注可調
            </span>
          </span>
          {slotLabel && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-black/45 px-2 py-0.5 font-mono text-base font-extrabold text-white shadow">
              {slotLabel}
            </span>
          )}
          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/30">
            <IconSpade className="h-3 w-3 text-white/85" />
          </span>
        </div>
        <p className="line-clamp-1 text-sm font-semibold text-foreground">{game.name}</p>
        <div className="flex items-center justify-between">
          <Pill tone={isReady ? "gold" : "neutral"} className="gap-1">
            <IconMedal className="h-3 w-3 text-primary" />
            {isReady ? t.gameReadyLabel : t.gameComingSoonLabel}
          </Pill>
          <span className="line-clamp-1 text-[10px] font-medium text-muted-foreground">{game.subtitle}</span>
        </div>
      </Card>
    </button>
  )
}
