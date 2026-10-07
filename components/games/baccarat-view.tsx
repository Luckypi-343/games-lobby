"use client"

import { useState } from "react"
import { BoardShell } from "./board-shell"
import { CardRow } from "./playing-card"
import { bacInitial, bacPlaceBet, bacNewRound, bacTotal, type BacState, type BacBet } from "@/lib/games/baccarat"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound, playDrawSound } from "@/lib/games/game-audio"

const BET_LABEL: Record<BacBet, string> = { player: "押閒", banker: "押莊", tie: "押和" }
const OUTCOME_LABEL: Record<string, string> = { player: "閒家勝", banker: "莊家勝", tie: "和局" }

export function BaccaratView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<BacState>(() => bacInitial())

  const restart = () => setState(bacInitial())

  function bet(choice: BacBet) {
    if (soundOn) playMoveSound()
    const next = bacPlaceBet(state, choice)
    setState(next)
    if (soundOn) {
      if (next.outcome === choice) playWinSound()
      else if (next.outcome === "tie" && choice !== "tie") playDrawSound()
      else playLossSound()
    }
  }

  function nextRound() {
    setState((s) => bacNewRound(s))
  }

  const done = state.status === "over"
  const won = done && state.outcome === state.bet
  const result = done ? (won ? "win" : state.outcome === "tie" ? "draw" : "loss") : null

  const statusText = done
    ? `${OUTCOME_LABEL[state.outcome ?? "tie"]}（閒 ${bacTotal(state.playerCards)} 點 · 莊 ${bacTotal(state.bankerCards)} 點）${
        state.bet ? `，您${BET_LABEL[state.bet]}${won ? "，中獎！" : "，未中"}` : ""
      }`
    : `第 ${state.hands + 1} 局 · 請選擇押注方向`

  return (
    <BoardShell
      gameId="baccarat"
      title="百家樂"
      subtitle="押莊／押閒／押和"
      status={statusText}
      result={result}
      rulesBrief={
        "押注閒家、莊家或和局後開牌：牌面點數(J/Q/K=0,A=1,其餘依面值)加總取尾數個位比大小，數字較大者贏；補牌規則自動依標準百家樂補牌表進行。\n\n【賠率表】押閒且閒家勝 ×2；押莊且莊家勝 ×2；押和且和局 ×9；押注方向與結果不符則輸掉籌碼。"
      }
      showBookButton
      onBack={onBack}
      onRestart={restart}
      mode="single"
    >
      <div className="flex w-[min(94vw,420px)] flex-col items-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground">莊家{done ? `（${bacTotal(state.bankerCards)} 點）` : ""}</p>
          <CardRow cards={state.bankerCards} faceDown={!done} small />
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <p className="text-[10px] font-semibold text-muted-foreground">閒家{done ? `（${bacTotal(state.playerCards)} 點）` : ""}</p>
          <CardRow cards={state.playerCards} faceDown={!done} small />
        </div>

        <div className="flex w-full items-center justify-between text-[11px] text-muted-foreground">
          <span>中獎：{state.wins}</span>
          <span>第 {state.hands} 局</span>
          <span>未中：{state.losses}</span>
        </div>

        {!done ? (
          <div className="flex w-full gap-2">
            {(["player", "banker", "tie"] as const).map((b) => (
              <button
                key={b}
                onClick={() => bet(b)}
                className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground transition active:scale-95"
              >
                {BET_LABEL[b]}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={nextRound}
            className="w-full rounded-lg bg-accent py-2.5 text-sm font-bold text-accent-foreground transition active:scale-95"
          >
            下一局
          </button>
        )}
      </div>
    </BoardShell>
  )
}
