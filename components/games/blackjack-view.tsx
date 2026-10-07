"use client"

import { useState } from "react"
import { BoardShell } from "./board-shell"
import { CardRow, PlayingCard } from "./playing-card"
import { bjInitial, bjNewHand, bjHit, bjStand, bjHandValue, type BJState } from "@/lib/games/blackjack"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound, playDrawSound } from "@/lib/games/game-audio"

const RESULT_LABEL: Record<string, string> = {
  win: "恭喜獲勝！",
  loss: "莊家獲勝",
  push: "平手，退回籌碼",
  blackjack: "🂡 Blackjack！您獲勝",
}

export function BlackjackView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BJState>(() => bjInitial())

  const restart = () => setState(bjInitial())

  function hit() {
    if (soundOn) playMoveSound()
    const next = bjHit(state)
    setState(next)
    if (next.status === "over" && soundOn) playLossSound()
  }

  function stand() {
    if (soundOn) playMoveSound()
    const next = bjStand(state)
    setState(next)
    if (soundOn) {
      if (next.result === "win") playWinSound()
      else if (next.result === "loss") playLossSound()
      else playDrawSound()
    }
  }

  function nextHand() {
    setState((s) => bjNewHand(s))
  }

  const done = state.status === "over"
  const result = done ? (state.result === "win" || state.result === "blackjack" ? "win" : state.result === "loss" ? "loss" : "draw") : null
  const playerValue = bjHandValue(state.player)
  const dealerValue = bjHandValue(state.dealer)

  const statusText = done
    ? `${RESULT_LABEL[state.result ?? "push"]}（您 ${playerValue} 點 · 莊家 ${dealerValue} 點）`
    : `您的點數：${playerValue}${playerValue > 21 ? "（爆牌）" : ""} · 莊家明牌：${bjHandValue([state.dealer[0]])}`

  return (
    <BoardShell
      gameId="blackjack"
      title="21點"
      subtitle="Blackjack 對戰莊家"
      status={statusText}
      result={result}
      rulesBrief={
        "點數盡量接近21點但不超過。A可算1或11點，J/Q/K算10點。「補牌」再拿一張牌，「停牌」結束回合換莊家補牌；莊家會持牌到17點以上為止。\n\n【賠率表】一般獲勝 ×2；發牌即湊成21點（Blackjack）×2.5；莊家爆牌或點數較低者，玩家獲勝；點數相同則平手退回籌碼；玩家爆牌（超過21點）直接輸。"
      }
      showBookButton
      onBack={onBack}
      onRestart={restart}
      mode="single"
    >
      <div className="flex w-[min(94vw,420px)] flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground">
            莊家{done ? `（${dealerValue} 點）` : ""}
          </p>
          <div className="flex gap-1.5">
            {state.dealer.map((c, i) => (
              <PlayingCard key={c.id} card={c} faceDown={!done && i > 0} />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground">您（{playerValue} 點）</p>
          <CardRow cards={state.player} />
        </div>

        <div className="flex w-full items-center justify-between text-[11px] text-muted-foreground">
          <span>勝：{state.wins}</span>
          <span>第 {state.hands} 手</span>
          <span>負：{state.losses}</span>
        </div>

        {!done ? (
          <div className="flex w-full gap-2">
            <button
              onClick={hit}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition active:scale-95"
            >
              補牌
            </button>
            <button
              onClick={stand}
              className="flex-1 rounded-lg bg-muted py-2.5 text-sm font-bold text-foreground transition active:scale-95"
            >
              停牌
            </button>
          </div>
        ) : (
          <button
            onClick={nextHand}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-accent-foreground transition active:scale-95"
          >
            下一手
          </button>
        )}
      </div>
    </BoardShell>
  )
}
