import { cn } from "@/lib/utils"
import { Card, Pill, IconBrain, IconSpade, IconMedal } from "./ui"
import { patternOf, themeEmojiMap, type Machine } from "@/lib/luckypi/data"
import { patternStyle } from "./machine-totem"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor, tierLabelFor } from "@/lib/luckypi/i18n"
import { themeNameFor } from "@/lib/luckypi/slot-i18n"

const TIER_ICON_TONE: Record<string, string> = {
  bronze: "text-secondary",
  silver: "text-muted-foreground",
  gold: "text-primary",
  diamond: "text-accent",
}

export function MachineCard({
  machine,
  onPlay,
  slotLabel,
}: {
  machine: Machine
  onPlay: (m: Machine) => void
  slotLabel?: string
}) {
  const { lang } = useLuckyPi()
  const t = dictFor(lang)
  const tierLabel = tierLabelFor(lang, machine.tier)
  const CategoryIcon = machine.category === "puzzle" ? IconBrain : IconSpade
  const bonusGlyph = themeEmojiMap(machine.name).wheel

  return (
    <button onClick={() => onPlay(machine)} className="text-left">
      <Card className="flex flex-col gap-2 p-3 transition active:scale-95">
        <div
          className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-xl"
          style={{
            background: `radial-gradient(circle at 28% 22%, oklch(0.62 0.17 ${machine.hue}), oklch(0.18 0.07 ${machine.hue}) 75%)`,
          }}
        >
          <span className="absolute inset-0" style={patternStyle(patternOf(machine.id), machine.hue)} />
          {/* Central medallion: this machine's own exclusive BONUS glyph, filling the disc exactly
              like the centre of its full-screen bonus wheel (same emoji + BONUS tag underneath). */}
          <span
            className="relative flex h-[92%] w-[92%] flex-col items-center justify-center gap-0.5 rounded-full border-2 border-white/25 bg-black/40 shadow-lg"
            style={{ boxShadow: `0 0 14px -2px oklch(0.75 0.18 ${machine.hue} / 0.85)` }}
          >
            <span className="text-4xl leading-none drop-shadow" aria-hidden>
              {bonusGlyph}
            </span>
            <span className="rounded-md bg-red-600/95 px-1.5 py-0.5 text-[8px] font-black tracking-wide text-white shadow">
              BONUS
            </span>
          </span>
          {slotLabel && (
            <span className="absolute left-1.5 top-1.5 rounded-full bg-black/45 px-2 py-0.5 font-mono text-base font-extrabold text-white shadow">
              {slotLabel}
            </span>
          )}
          <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/30">
            <CategoryIcon className="h-3 w-3 text-white/85" />
          </span>
        </div>
        <p className="line-clamp-1 text-sm font-semibold text-foreground">{themeNameFor(lang, machine.name)}</p>
        <div className="flex items-center justify-between">
          <Pill tone={machine.tier === "diamond" ? "gold" : "neutral"} className="gap-1">
            <IconMedal className={cn("h-3 w-3", TIER_ICON_TONE[machine.tier])} />
            {tierLabel}
          </Pill>
          <span className="text-[10px] font-medium text-muted-foreground">
            {t.payRateLabel} ×{machine.payFactor.toFixed(2)}
          </span>
        </div>
      </Card>
    </button>
  )
}
