"use client"

import type { PuzzleGame } from "@/lib/luckypi/data"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import { IconCoin } from "./ui"

export function PuzzleGameCard({
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

  return (
    <button
      onClick={() => onPlay(game)}
      className="relative flex aspect-[4/5] flex-col items-center justify-between gap-1 rounded-xl border p-2.5 text-center shadow-sm transition active:scale-95"
      style={{
        background: `linear-gradient(160deg, hsl(${game.hue} 70% 92%), hsl(${game.hue} 55% 80%))`,
        borderColor: `hsl(${game.hue} 40% 62%)`,
      }}
    >
      <span
        className="rounded-full px-1.5 py-0.5 font-mono text-sm font-extrabold leading-none"
        style={{ background: "hsl(0 0% 100% / 0.55)", color: `hsl(${game.hue} 40% 26%)` }}
      >
        {slotLabel}
      </span>
      <span
        className="flex h-10 w-10 items-center justify-center rounded-full border-2 text-base font-bold shadow-inner"
        style={{
          background: `linear-gradient(155deg, hsl(${game.hue} 45% 98%), hsl(${game.hue} 60% 88%))`,
          borderColor: `hsl(${game.hue} 55% 55%)`,
          color: `hsl(${game.hue} 55% 26%)`,
        }}
        aria-hidden
      >
        {game.glyph}
      </span>
      <span className="text-sm font-extrabold leading-tight text-balance" style={{ color: `hsl(${game.hue} 35% 16%)` }}>
        {game.name}
      </span>
      <span className="text-[10px]" style={{ color: `hsl(${game.hue} 25% 30%)` }}>
        {game.subtitle}
      </span>
      <span
        className="flex items-center gap-0.5 rounded-full px-2 py-0.5 font-mono text-[10px] font-bold"
        style={{ background: "hsl(0 0% 100% / 0.7)", color: `hsl(${game.hue} 55% 30%)` }}
      >
        <IconCoin className="h-3 w-3" />
        {game.wagered ? "押注可調" : `-${game.cost}`}
      </span>
      <span
        className="rounded-full px-2 py-0.5 text-[9px] font-semibold"
        style={
          game.status === "ready"
            ? { background: "hsl(0 0% 100% / 0.65)", color: `hsl(${game.hue} 45% 24%)` }
            : { background: "hsl(0 0% 100% / 0.4)", color: `hsl(${game.hue} 15% 38%)` }
        }
      >
        {game.status === "ready" ? t.gameReadyLabel : t.gameComingSoonLabel}
      </span>
    </button>
  )
}
