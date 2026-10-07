"use client"

import { useEffect, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { MahjongTileFace, MahjongTileBack } from "@/components/games/mahjong-tile"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"
import { npInitial, npDeal, npPlayerHit, npPlayerStand, npTotal, type NPState } from "@/lib/games/mahjong-ninepoint5"

const HUE = 150
const BET_MIN = 10
const BET_MAX = 500
const BET_STEP = 10

const RULES =
  "麻將九點半：用麻將棋子代替撲克牌比點數。一筒～九筒、一索～九索、一萬～九萬依數字算點，東南西北中發白一律算0.5點。開局先發2顆，可選「補牌」再摸一顆，或「停牌」結束。目標是讓手牌點數總和儘量接近9.5點但不能超過，超過就爆牌。莊家（電腦）會在您停牌或爆牌後依牌況決定補牌。點數較接近9.5點的一方獲勝，1:1派彩；兩張牌剛好湊滿9.5點（天牌）加倍派彩；點數相同算莊家勝。"

export function MahjongNinePoint5View({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [bet, setBet] = useState(10)
  const [state, setState] = useState<NPState>(() => npInitial(10))
  const [settled, setSettled] = useState(false)

  function handleDeal() {
    if (state.phase !== "betting") return
    if (!spendCoins(bet)) return
    setSettled(false)
    setState(npDeal(bet))
  }

  function handleHit() {
    setState((s) => npPlayerHit(s))
  }

  function handleStand() {
    setState((s) => npPlayerStand(s))
  }

  useEffect(() => {
    if (state.phase !== "result" || settled || !state.result) return
    setSettled(true)
    const { outcome, payout } = state.result
    if (soundOn) {
      if (outcome === "win") playWinSound()
      else if (outcome === "lose") playLossSound()
    }
    if (outcome === "win") creditWin(bet + payout)
    else if (outcome === "push") creditWin(bet)
  }, [state.phase, state.result, settled, soundOn, creditWin, bet])

  function handleNext() {
    setState(npInitial(bet))
  }

  const playerTotal = npTotal(state.playerHand)
  const dealerTotal = state.dealerHand.length ? npTotal(state.dealerHand) : null

  return (
    <CasinoTableShell
      title="麻將九點半"
      rules={RULES}
      hue={HUE}
      bet={bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={state.phase !== "betting"}
      onBetChange={setBet}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex w-full flex-col items-center gap-4 px-3 pb-4">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">莊家</span>
          <div className="flex gap-1.5">
            {state.dealerHand.map((t, i) => (
              <span key={t.id}>
                {state.phase === "player-turn" && i === 1 ? <MahjongTileBack /> : <MahjongTileFace tile={t.label} />}
              </span>
            ))}
            {state.dealerHand.length === 0 && (
              <>
                <MahjongTileBack />
                <MahjongTileBack />
              </>
            )}
          </div>
          {state.phase !== "betting" && state.phase !== "player-turn" && dealerTotal !== null && (
            <span className="font-mono text-sm font-bold text-amber-500">{dealerTotal} 點</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">我的手牌</span>
          <div className="flex gap-1.5">
            {state.playerHand.map((t) => (
              <MahjongTileFace key={t.id} tile={t.label} />
            ))}
            {state.playerHand.length === 0 && (
              <>
                <MahjongTileBack />
                <MahjongTileBack />
              </>
            )}
          </div>
          {state.playerHand.length > 0 && <span className="font-mono text-sm font-bold text-emerald-500">{playerTotal} 點</span>}
        </div>

        {state.phase === "result" && state.result && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-2">
            <span className="text-sm font-bold">
              {state.result.playerBust
                ? "爆牌！"
                : state.result.dealerBust
                  ? "莊家爆牌！"
                  : state.result.outcome === "win"
                    ? "獲勝！"
                    : state.result.outcome === "push"
                      ? "平手"
                      : "輸了"}
              {state.result.multiplier > 1 && "（天牌 ×2）"}
            </span>
            <span className={`text-lg font-black ${state.result.outcome === "win" ? "text-emerald-500" : state.result.outcome === "push" ? "text-muted-foreground" : "text-rose-500"}`}>
              {state.result.outcome === "win" ? `+${state.result.payout}` : state.result.outcome === "push" ? "退回押注" : state.result.payout}
            </span>
          </div>
        )}

        <div className="flex w-full justify-center gap-3">
          {state.phase === "betting" ? (
            <button
              type="button"
              onClick={handleDeal}
              className="rounded-full px-8 py-3 text-base font-black text-white shadow-lg"
              style={{ background: `oklch(0.55 0.18 ${HUE})` }}
            >
              開局（押注 {bet}）
            </button>
          ) : state.phase === "player-turn" ? (
            <>
              <button
                type="button"
                onClick={handleHit}
                className="rounded-full px-6 py-3 text-base font-black text-white shadow-lg"
                style={{ background: `oklch(0.55 0.18 ${HUE})` }}
              >
                補牌
              </button>
              <button
                type="button"
                onClick={handleStand}
                className="rounded-full border border-border bg-card px-6 py-3 text-base font-black shadow-lg"
              >
                停牌
              </button>
            </>
          ) : state.phase === "dealer-turn" ? (
            <span className="rounded-full bg-muted px-6 py-2 text-sm font-semibold text-muted-foreground">結算中…</span>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="rounded-full px-8 py-3 text-base font-black text-white shadow-lg"
              style={{ background: `oklch(0.55 0.18 ${HUE})` }}
            >
              再來一局
            </button>
          )}
        </div>
      </div>
    </CasinoTableShell>
  )
}
