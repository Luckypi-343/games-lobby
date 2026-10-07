"use client"

import { useState } from "react"
import { RpgMatch3View } from "./rpg-match3-view"
import { pdNew, pdAdvance, PD_DUNGEON_NAMES } from "@/lib/games/puzzle-dragons"
import type { RmState } from "@/lib/games/rpg-match3-core"

export function PuzzleDragonsView({ onBack }: { onBack: () => void }) {
  const [state, setState] = useState<RmState>(() => pdNew())
  const dungeon = PD_DUNGEON_NAMES[(state.stage - 1) % PD_DUNGEON_NAMES.length]
  return (
    <RpgMatch3View
      gameId="puzzle-dragons"
      title="智龍迷城"
      subtitle={`${dungeon} · 寶石消除 + 屬性相剋戰鬥`}
      rulesBrief="交換相鄰寶石湊出同色連線，對應屬性的飛龍會對敵人發動攻擊：火克木、木克水、水克火、光暗互剋，用剋制屬性攻擊會造成更高傷害。粉紅愛心可以治療全隊。擊敗所有敵人後前往下一座迷宮，隊伍會升級並恢復滿血。"
      cost={10}
      state={state}
      setState={setState}
      onNewGame={pdNew}
      onAdvance={pdAdvance}
      onBack={onBack}
    />
  )
}
