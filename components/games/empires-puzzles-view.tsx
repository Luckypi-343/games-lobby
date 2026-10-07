"use client"

import { useState } from "react"
import { RpgMatch3View } from "./rpg-match3-view"
import { epNew, epAdvance, BUILD_TARGETS } from "@/lib/games/empires-puzzles"
import type { RmState } from "@/lib/games/rpg-match3-core"

function ResourceBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const pct = Math.min(100, Math.round((value / target) * 100))
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="lp-nums">
          {Math.min(value, target)}/{target}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function EmpiresPuzzlesView({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<RmState>(() => epNew())
  const { wood, stone, food } = state.resources

  return (
    <RpgMatch3View
      gameId="empires-puzzles"
      title="帝國與拼圖"
      subtitle="寶石消除 + 簡易城建與 PvP 英雄對決"
      rulesBrief="交換相鄰寶石湊出同色連線，對應屬性的英雄會攻擊對手，擊敗後會獲得木材、石材、糧食等建材（進度顯示於上方）。粉紅愛心治療全隊。擊敗所有對手即可晉級下一回合 PvP，隊伍升級並恢復滿血，持續累積建材壯大您的帝國。"
      cost={10}
      state={state}
      setState={setState}
      onNewGame={epNew}
      onAdvance={epAdvance}
      onBack={onBack}
      footer={
        <div className="w-full max-w-[360px] space-y-1.5 rounded-xl border border-border bg-card p-2 shadow-sm">
          <p className="text-[11px] font-semibold text-foreground">城市建設進度</p>
          <ResourceBar label="木材" value={wood} target={BUILD_TARGETS.wood} color="#92400e" />
          <ResourceBar label="石材" value={stone} target={BUILD_TARGETS.stone} color="#64748b" />
          <ResourceBar label="糧食" value={food} target={BUILD_TARGETS.food} color="#ca8a04" />
        </div>
      }
    />
  )
}
