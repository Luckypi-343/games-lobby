"use client"

import { useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { CardRow } from "./playing-card"
import { zjhInitial, zjhNewHand, zjhReveal, type ZjhState } from "@/lib/games/zha-jinhua"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound, playDrawSound } from "@/lib/games/game-audio"

const BET_MIN = 50
const BET_MAX = 2000
const BET_STEP = 50
const HUE = 45

const RESULT_LABEL: Record<string, string> = {
  win: "獲勝！",
  loss: "莊家獲勝",
  tie: "平手，已退回押注",
}

export function ZhaJinhuaView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [state, setState] = useState<ZjhState>(() => zjhInitial())
  const [bet, setBet] = useState(100)
  const [phase, setPhase] = useState<"idle" | "dealt" | "over">("idle")

  function deal() {
    if (phase === "dealt") return
    if (!spendCoins(bet)) return
    setState((s) => zjhNewHand(s))
    setPhase("dealt")
  }

  function reveal() {
    if (phase !== "dealt") return
    const next = zjhReveal(state)
    setState(next)
    setPhase("over")
    if (soundOn) {
      if (next.result === "win") playWinSound()
      else if (next.result === "loss") playLossSound()
      else playDrawSound()
    }
    if (next.result === "win") creditWin(bet * 2)
    else if (next.result === "tie") creditWin(bet)
  }

  return (
    <CasinoTableShell
      title="炸金花"
      rules="先調整押注金額，再按「開牌」與莊家各發3張牌直接比牌型大小，牌型大小依序為：三條(豹子)、同花順、同花(金花)、順子、對子、單張。牌型較高者贏得2倍彩金，平手退回押注。"
      hue={HUE}
      bet={bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={phase === "dealt"}
      onBetChange={setBet}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex h-full flex-col justify-between px-4 py-3">
        <div className="flex min-h-[7.5rem] flex-col items-center gap-1.5">
          <p className="text-xs font-semibold text-amber-200/70">莊家</p>
          <CardRow cards={state.dealer} faceDown={phase !== "over"} />
          <p className="font-mono text-sm font-bold text-amber-100 tabular-nums">
            {phase === "over" ? state.dealerHandName : "—"}
          </p>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {phase === "over" && state.result ? (
            <p
              className="rounded-full border px-5 py-2 text-center font-serif text-base font-bold shadow-lg"
              style={{
                borderColor: "oklch(0.7 0.15 80 / 0.5)",
                background: "oklch(0.2 0.05 45 / 0.85)",
                color: "oklch(0.88 0.14 80)",
              }}
            >
              {RESULT_LABEL[state.result]}
            </p>
          ) : phase === "idle" ? (
            <p className="text-sm text-amber-100/60">調整押注金額，按「開牌」開始這一局</p>
          ) : (
            <p className="text-sm text-amber-100/60">按「比牌」揭曉勝負</p>
          )}
        </div>

        <div className="flex min-h-[7.5rem] flex-col items-center gap-1.5">
          <p className="font-mono text-sm font-bold text-amber-100 tabular-nums">
            {phase === "idle" ? "—" : phase === "over" ? state.playerHandName : "\u00A0"}
          </p>
          <CardRow cards={state.player} />
          <p className="text-xs font-semibold text-amber-200/70">玩家</p>
        </div>

        <div className="mt-3 flex justify-center gap-3">
          {phase === "dealt" ? (
            <button
              onClick={reveal}
              className="rounded-full bg-amber-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              比牌
            </button>
          ) : (
            <button
              onClick={deal}
              className="rounded-full bg-amber-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              {phase === "over" ? "再玩一局" : "開牌"}
            </button>
          )}
        </div>
      </div>
    </CasinoTableShell>
  )
}
