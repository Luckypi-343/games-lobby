"use client"

import type { Slot } from "@/lib/luckypi/data"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import { MachineCard } from "./machine-card"
import { PuzzleGameCard } from "./puzzle-game-card"
import { WageredGameCard } from "./wagered-game-card"

export function SlotCard({
  slot,
  onPlay,
  onPlayGame,
}: {
  slot: Slot
  onPlay: (machine: NonNullable<Slot["machine"]>) => void
  onPlayGame: (game: NonNullable<Slot["game"]>) => void
}) {
  const { lang } = useLuckyPi()
  const t = dictFor(lang)
  const label = String(slot.number).padStart(2, "0")

  if (slot.game) {
    // 博奕區「押注可調」撲克桌沿用一般機台的卡片外觀，其他益智小遊戲維持原本卡片樣式。
    if (slot.game.wagered) {
      return <WageredGameCard game={slot.game} slotLabel={label} onPlay={onPlayGame} />
    }
    return <PuzzleGameCard game={slot.game} slotLabel={label} onPlay={onPlayGame} />
  }

  if (slot.machine) {
    return <MachineCard machine={slot.machine} slotLabel={label} onPlay={onPlay} />
  }

  return (
    <div className="flex aspect-[4/5] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card/40 text-center">
      <span className="font-mono text-[11px] text-muted-foreground/70">{label}</span>
      <span className="text-[11px] text-muted-foreground/70">{t.slotNotOpenLabel}</span>
    </div>
  )
}
