"use client"

import { useState } from "react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import { PlayingCard } from "./playing-card"
import {
  dealPickRedPoints,
  playHandCard,
  flipStock,
  resolveChoice,
  findCaptures,
  totalPoints,
  type PickRedPointsState,
} from "@/lib/games/pick-red-points"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"

const GAME_ID = "pick-red-points"

const RULES =
  "吃牌配對：A(1)+9、2+8、3+7、4+6、5+5 湊10；10 只能吃10；J／Q／K 不計點數，只能跟同牌型的皮牌對碰。每回合固定兩步：先打一張手牌（能吃就吃，吃不到就丟到桌面放水），接著從牌堆翻開一張牌（能吃就立刻吃，吃不到就留在桌面）。只計算紅心／方塊：紅A每張20分，紅9/10/J/Q/K每張10分，紅2~8依牌面數字計分，黑牌0分，全副牌紅點固定230分。若同一回合「打手牌」與「翻牌堆」都吃到牌，稱為雙連吃，這回合吃到的分數加倍計算。手牌與牌堆用盡，比較雙方紅點總分，分數高者獲勝。"

export function PickRedPointsView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<PickRedPointsState>(() => dealPickRedPoints())

  const result: PuzzleOutcome = state.outcome === "win" ? "win" : state.outcome === "lose" ? "loss" : state.outcome === "draw" ? "draw" : null

  const choosing = state.pendingChoice !== null && state.pendingChoice.player === "you"

  function handlePlay(cardId: string) {
    if (state.finished || state.turn !== "you" || state.phase !== "play" || choosing) return
    const card = state.hand.you.find((c) => c.id === cardId)
    if (!card) return
    const willCapture = findCaptures(card, state.table).length > 0
    const next = playHandCard(state, "you", card)
    setState(next)
    if (soundOn) (willCapture ? playCaptureSound : playMoveSound)()
  }

  function handleFlip() {
    if (state.finished || state.turn !== "you" || state.phase !== "flip" || choosing) return
    const next = flipStock(state)
    setState(next)
    if (soundOn) playCaptureSound()
  }

  function handleChoice(cardId: string) {
    if (!choosing) return
    const next = resolveChoice(state, cardId)
    setState(next)
    if (soundOn) playCaptureSound()
  }

  const yourPoints = totalPoints(state.captured.you)
  const aiPoints = totalPoints(state.captured.ai)

  const status = state.finished
    ? `終局比分 您 ${yourPoints} ： 電腦 ${aiPoints}`
    : state.message

  return (
    <BoardShell
      gameId={GAME_ID}
      title="撿紅點"
      subtitle="湊10配對吃牌，收集紅點計分"
      status={status}
      rulesBrief={RULES}
      result={result}
      onBack={onBack}
      onRestart={() => setState(dealPickRedPoints())}
      mode="single"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] text-muted-foreground">
            電腦 ・ 手牌 {state.hand.ai.length} ・ 已得 {aiPoints} 分
          </span>
          <div className="flex gap-1">
            {state.hand.ai.map((c) => (
              <PlayingCard key={c.id} card={c} faceDown small />
            ))}
          </div>
        </div>

        {choosing ? (
          <p className="text-center text-[11px] font-semibold text-accent">
            海底有兩張以上相同的牌，請點選要吃的那一張
          </p>
        ) : null}

        <div className="flex min-h-24 w-full flex-wrap items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 p-2">
          {state.table.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">桌面已清空</p>
          ) : (
            state.table.map((c) => {
              const selectable = choosing && state.pendingChoice!.options.some((o) => o.id === c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleChoice(c.id)}
                  disabled={!selectable}
                  className={
                    selectable
                      ? "rounded-md ring-2 ring-accent ring-offset-2 ring-offset-background transition active:scale-95"
                      : "cursor-default"
                  }
                >
                  <PlayingCard card={c} small />
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">牌堆剩 {state.stock.length} 張</span>
          <button
            onClick={handleFlip}
            disabled={state.turn !== "you" || state.phase !== "flip" || state.finished || choosing}
            className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary transition active:scale-95 disabled:opacity-40"
          >
            翻牌堆
          </button>
        </div>

        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold text-primary">
            您 ・ 已得 {yourPoints} 分 {state.turn === "you" && state.phase === "play" && !state.finished ? "（請打手牌）" : ""}
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {state.hand.you.map((card) => (
              <button
                key={card.id}
                onClick={() => handlePlay(card.id)}
                disabled={state.turn !== "you" || state.phase !== "play" || state.finished}
                className="transition active:scale-95 disabled:opacity-40"
              >
                <PlayingCard card={card} small />
              </button>
            ))}
          </div>
        </div>
      </div>
    </BoardShell>
  )
}
