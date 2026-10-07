"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { RM_SIZE, rmSwap, type RmOrb, type RmState } from "@/lib/games/rpg-match3-core"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const ORB_STYLE: Record<RmOrb, { base: string; light: string; dark: string; label: string }> = {
  0: { base: "#ef4444", light: "#fca5a5", dark: "#7f1d1d", label: "火" },
  1: { base: "#3b82f6", light: "#bfdbfe", dark: "#1e3a8a", label: "水" },
  2: { base: "#22c55e", light: "#bbf7d0", dark: "#14532d", label: "木" },
  3: { base: "#facc15", light: "#fef9c3", dark: "#854d0e", label: "光" },
  4: { base: "#7c3aed", light: "#ddd6fe", dark: "#3b0764", label: "暗" },
  5: { base: "#ec4899", light: "#fbcfe8", dark: "#831843", label: "心" },
}

function Orb({ color, size }: { color: RmOrb; size: number }) {
  const s = ORB_STYLE[color]
  return (
    <div
      className="relative rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 32% 28%, ${s.light}, ${s.base} 55%, ${s.dark} 100%)`,
        boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.5), 0 2px 3px rgba(0,0,0,0.25)",
      }}
    >
      <div className="absolute left-[22%] top-[18%] h-[20%] w-[20%] rounded-full bg-white/70 blur-[1px]" />
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white/90 drop-shadow">
        {s.label}
      </div>
    </div>
  )
}

function HpBar({ hp, maxHp, color }: { hp: number; maxHp: number; color: string }) {
  const pct = Math.max(0, Math.round((hp / maxHp) * 100))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  )
}

export function RpgMatch3View({
  gameId,
  title,
  subtitle,
  rulesBrief,
  cost,
  state,
  setState,
  onNewGame,
  onAdvance,
  onBack,
  footer,
}: {
  gameId: string
  title: string
  subtitle: string
  rulesBrief: string
  cost: number
  state: RmState
  setState: (s: RmState) => void
  onNewGame: () => RmState
  onAdvance: (s: RmState) => RmState
  onBack: () => void
  footer?: ReactNode
}) {
  const { soundOn } = useLuckyPi()
  const [selected, setSelected] = useState<number | null>(null)
  const enemy = state.enemies[state.enemyIndex]

  const restart = () => {
    setState(onNewGame())
    setSelected(null)
  }

  const tap = (i: number) => {
    if (state.cleared || state.defeated) return
    if (selected === null) {
      setSelected(i)
      return
    }
    if (selected === i) {
      setSelected(null)
      return
    }
    const next = rmSwap(state, selected, i)
    if (next !== state) {
      setState(next)
      if (soundOn) playMoveSound()
    } else if (soundOn) {
      playLossSound()
    }
    setSelected(null)
  }

  const handleAdvance = () => {
    setState(onAdvance(state))
    if (soundOn) playWinSound()
  }

  return (
    <PuzzleShell
      gameId={gameId}
      title={title}
      subtitle={subtitle}
      status={`第 ${state.stage} 關　金幣 ${state.gold}`}
      rulesBrief={rulesBrief}
      solved={false}
      cost={cost}
      onBack={onBack}
      onRestart={restart}
    >
      {/* 敵人狀態 */}
      {enemy && (
        <div className="w-full max-w-[360px] rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              {enemy.name}（{state.enemyIndex + 1}/{state.enemies.length}）
            </span>
            <span className="lp-nums text-muted-foreground">
              {enemy.hp}/{enemy.maxHp}
            </span>
          </div>
          <div className="mt-1">
            <HpBar hp={enemy.hp} maxHp={enemy.maxHp} color="#ef4444" />
          </div>
          <p className="lp-nums mt-1 text-[10px] text-muted-foreground">距離反擊：{enemy.attackIn} 回合</p>
        </div>
      )}

      {/* 隊伍狀態 */}
      <div className="grid w-full max-w-[360px] grid-cols-3 gap-2">
        {state.party.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-2 text-center shadow-sm">
            <p className="truncate text-[11px] font-semibold text-foreground">{p.name}</p>
            <p className="lp-nums text-[10px] text-muted-foreground">Lv.{p.level}</p>
            <div className="mt-1">
              <HpBar hp={p.hp} maxHp={p.maxHp} color={p.hp > 0 ? "#22c55e" : "#9ca3af"} />
            </div>
            <p className="lp-nums text-[10px] text-muted-foreground">
              {p.hp}/{p.maxHp}
            </p>
          </div>
        ))}
      </div>

      {footer}

      {/* 寶石棋盤 */}
      <div
        className="grid gap-1 rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${RM_SIZE}, minmax(0, 1fr))`, width: 320, maxWidth: "100%" }}
      >
        {state.grid.map((c, i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            className={`flex aspect-square items-center justify-center rounded-lg transition-all active:scale-90 ${
              selected === i ? "ring-2 ring-foreground/60" : ""
            }`}
          >
            <Orb color={c} size={28} />
          </button>
        ))}
      </div>

      {/* 戰鬥紀錄 */}
      <div className="w-full max-w-[360px] rounded-xl border border-border bg-muted/40 p-2">
        {state.log.slice(0, 3).map((l, i) => (
          <p key={i} className="truncate text-[10px] text-muted-foreground">
            {l}
          </p>
        ))}
      </div>

      {state.cleared && (
        <div className="w-full max-w-[360px] rounded-2xl border border-primary/40 bg-primary/10 p-3 text-center">
          <p className="text-sm font-bold text-primary">本關已過關！</p>
          <button
            onClick={handleAdvance}
            className="mt-2 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground transition active:scale-95"
          >
            前往下一關
          </button>
        </div>
      )}
      {state.defeated && (
        <div className="w-full max-w-[360px] rounded-2xl border border-destructive/40 bg-destructive/10 p-3 text-center">
          <p className="text-sm font-bold text-destructive">隊伍全滅，挑戰失敗</p>
          <button
            onClick={restart}
            className="mt-2 w-full rounded-full bg-destructive py-2 text-xs font-semibold text-destructive-foreground transition active:scale-95"
          >
            重新挑戰
          </button>
        </div>
      )}
    </PuzzleShell>
  )
}
