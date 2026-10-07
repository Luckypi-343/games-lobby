"use client"

import { useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"
import { MahjongTileFace, MahjongTileBack } from "@/components/games/mahjong-tile"
import { dgInitial, dgSetBet, dgReveal, dgOpenGate, dgGateWidth, BET_MIN, BET_MAX, BET_STEP, type DGState } from "@/lib/games/dragon-gate"

const HUE = 10

const RULES =
  "射龍門使用麻將一筒～九筒（各4張，共36張）代替撲克牌。每局先開兩張牌當「球門」，調整押注（10～500）後按「開球門」：若第三張牌點數落在兩張門牌之間（不含門柱本身）即獲勝，贏得1倍注碼；若點數在門外則輸掉注碼；若剛好跟任何一邊門柱點數相同（撞柱），要賠雙倍注碼。結算完畢按「再來一局」重新開門。"

export function DragonGateView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [state, setState] = useState<DGState>(() => dgInitial(10))
  const width = dgGateWidth(state)

  function handleReveal() {
    if (state.phase !== "betting") return
    if (!spendCoins(state.bet)) return
    const next = dgReveal(state)
    setState(next)
    if (next.balanceDelta > 0) {
      creditWin(state.bet + next.balanceDelta)
      if (soundOn) playWinSound()
    } else if (next.balanceDelta < 0) {
      if (soundOn) playLossSound()
    } else {
      creditWin(state.bet)
    }
  }

  function handleNext() {
    setState((s) => dgOpenGate(s))
  }

  return (
    <CasinoTableShell
      title="射龍門"
      rules={RULES}
      hue={HUE}
      bet={state.bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={state.phase === "revealed"}
      onBetChange={(v) => setState((s) => dgSetBet(s, v))}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-6">
        <div className="flex items-center gap-4">
          {state.gateLow && <MahjongTileFace tile={`t${state.gateLow.num}`} />}
          <span className="text-2xl font-bold text-amber-300">球門</span>
          {state.gateHigh && <MahjongTileFace tile={`t${state.gateHigh.num}`} />}
        </div>
        <p className="text-sm text-amber-200/80">
          門內數字：{width > 0 ? `${state.gateLow!.num + 1} ～ ${state.gateHigh!.num - 1}` : "無（門柱相鄰，幾乎必輸）"}
        </p>

        <div className="flex h-20 w-14 items-center justify-center">
          {state.phase === "revealed" && state.revealed ? (
            <MahjongTileFace tile={`t${state.revealed.num}`} />
          ) : (
            <MahjongTileBack />
          )}
        </div>

        {state.phase === "revealed" && (
          <div
            className={`rounded-xl border px-4 py-2 text-center font-bold ${
              state.result === "win"
                ? "border-emerald-400 bg-emerald-500/20 text-emerald-300"
                : state.result === "post"
                  ? "border-rose-500 bg-rose-600/30 text-rose-200"
                  : "border-rose-400 bg-rose-500/20 text-rose-300"
            }`}
          >
            {state.result === "win" && `進球！贏得 ${state.balanceDelta} 枚`}
            {state.result === "lose" && `出界，輸掉 ${state.bet} 枚`}
            {state.result === "post" && `撞柱！賠雙倍 ${-state.balanceDelta} 枚`}
          </div>
        )}

        {state.phase === "betting" ? (
          <button
            type="button"
            onClick={handleReveal}
            className="rounded-full bg-amber-500 px-8 py-3 text-lg font-bold text-amber-950 shadow-lg active:scale-95"
          >
            開球門
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-full bg-sky-500 px-8 py-3 text-lg font-bold text-sky-950 shadow-lg active:scale-95"
          >
            再來一局
          </button>
        )}
      </div>
    </CasinoTableShell>
  )
}
