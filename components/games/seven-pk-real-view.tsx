"use client"

import { useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { CardRow } from "./playing-card"
import {
  sevenPkInitial,
  sevenPkDeal,
  sevenPkAdvance,
  sevenPkFold,
  SEVEN_PK_PAYOUT,
  SEVEN_PK_PAYOUT_TABLE,
  PK_CATEGORY_LABEL,
  type SevenPkState,
} from "@/lib/games/seven-pk-real"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

const BET_MIN = 20
const BET_MAX = 1000
const BET_STEP = 20
const HUE = 15

const STAGE_HINT: Record<string, string> = {
  stage1: "第一階段：已翻開第1、3張。可選擇放棄、跟注或加倍押注再進入下一階段。",
  stage2: "第二階段：加發2張（第5張翻開）。可選擇放棄、跟注或加倍押注。",
  stage3: "第三階段：加發第6張。這是最後一次選擇放棄、跟注或加倍押注的機會。",
}

const RULES =
  "先選定押注分數，按「開牌」發3張(1、3翻開，2蓋)。每一階段可選擇放棄(認輸)、跟注或加倍押注再繼續發牌，直到第7張發完並翻開所有蓋牌，用最好的5張比對賠率表。放棄或未中獎則賠掉目前總押注，中獎則依賠率表獲得對應倍數的獎勵。\n\n【賠率表】" +
  SEVEN_PK_PAYOUT_TABLE.map((row) => `${row.label}×${row.multiplier}`).join("、")

export function SevenPkView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [state, setState] = useState<SevenPkState>(() => sevenPkInitial())
  const [bet, setBet] = useState(100)

  const staked = bet * state.totalUnits
  const won = state.stage === "result" && !state.folded ? SEVEN_PK_PAYOUT[state.category] > 0 : false

  function settleIfDone(next: SevenPkState) {
    setState(next)
    if (next.stage !== "result") return
    if (soundOn) {
      const multiplier = SEVEN_PK_PAYOUT[next.category]
      if (!next.folded && multiplier > 0) playWinSound()
      else playLossSound()
    }
    if (!next.folded) {
      const multiplier = SEVEN_PK_PAYOUT[next.category]
      if (multiplier > 0) creditWin(bet * next.totalUnits * multiplier)
    }
  }

  function deal() {
    if (state.stage !== "idle" && state.stage !== "result") return
    if (!spendCoins(bet)) return
    if (soundOn) playMoveSound()
    setState(sevenPkDeal(state))
  }

  function fold() {
    if (state.stage === "idle" || state.stage === "result") return
    if (soundOn) playMoveSound()
    settleIfDone(sevenPkFold(state))
  }

  function call() {
    if (state.stage === "idle" || state.stage === "result") return
    if (soundOn) playMoveSound()
    settleIfDone(sevenPkAdvance(state, "call"))
  }

  function double() {
    if (state.stage === "idle" || state.stage === "result") return
    const extra = bet * state.totalUnits
    if (!spendCoins(extra)) return
    if (soundOn) playMoveSound()
    settleIfDone(sevenPkAdvance(state, "double"))
  }

  const playing = state.stage === "stage1" || state.stage === "stage2" || state.stage === "stage3"

  return (
    <CasinoTableShell
      title="7PK"
      rules={RULES}
      hue={HUE}
      bet={bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={playing}
      onBetChange={setBet}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex h-full flex-col gap-2 px-4 py-3">
        {/* 第三區：簡易說明 */}
        <div className="flex items-center justify-center text-xs text-amber-100/70">
          <span>{state.stage === "idle" ? "調整押注分數，按「開牌」開始這一局" : (STAGE_HINT[state.stage] ?? "")}</span>
        </div>

        {/* 第五區：發牌區 */}
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          <CardRow
            cards={state.hand}
            faceDownAt={state.concealed.map((c, i) => (c ? i : -1)).filter((i) => i >= 0)}
          />

          {state.stage === "result" ? (
            <p
              className="rounded-full border px-5 py-2 text-center font-serif text-base font-bold shadow-lg"
              style={{
                borderColor: "oklch(0.7 0.15 80 / 0.5)",
                background: "oklch(0.2 0.05 15 / 0.85)",
                color: won ? "oklch(0.88 0.14 80)" : "oklch(0.75 0.15 20)",
              }}
            >
              {state.folded
                ? "已放棄，賠掉押注"
                : won
                  ? `${PK_CATEGORY_LABEL[state.category]}！贏得 ${bet * state.totalUnits * SEVEN_PK_PAYOUT[state.category]} 遊戲幣`
                  : "未中獎，賠掉押注"}
            </p>
          ) : state.stage !== "idle" ? (
            <p className="font-mono text-sm font-bold text-amber-100 tabular-nums">目前總押注：{staked} 遊戲幣</p>
          ) : null}
        </div>

        {/* 第六區：按鈕區 */}
        <div className="flex justify-center gap-2.5">
          {playing ? (
            <>
              <button
                onClick={fold}
                className="rounded-full border-2 border-amber-400/60 bg-transparent px-5 py-3 text-sm font-bold text-amber-200 shadow-lg transition active:scale-95"
              >
                放棄
              </button>
              <button
                onClick={call}
                className="rounded-full bg-amber-500 px-6 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
              >
                跟注
              </button>
              <button
                onClick={double}
                className="rounded-full bg-rose-500 px-5 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
              >
                加倍押注
              </button>
            </>
          ) : (
            <button
              onClick={deal}
              className="rounded-full bg-amber-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              {state.stage === "result" ? "再玩一局" : "開牌"}
            </button>
          )}
        </div>
      </div>
    </CasinoTableShell>
  )
}
