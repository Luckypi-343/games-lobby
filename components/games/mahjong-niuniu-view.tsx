"use client"

import { useEffect, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { MahjongTileFace, MahjongTileBack } from "@/components/games/mahjong-tile"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"
import { nnInitial, nnDeal, nnLabel, type NNState } from "@/lib/games/mahjong-niuniu"

const HUE = 20
const BET_MIN = 10
const BET_MAX = 500
const BET_STEP = 10

const RULES =
  "麻將妞妞：用一筒～九筒、一索～九索、一萬～九萬（不含字牌）代替撲克牌。開局您與莊家各發5顆，系統自動從5顆中找出最佳的3顆湊成10的倍數（稱為「有妞」），剩下2顆相加取個位數比大小：湊不出倍數是「無妞」最小，剛好湊整10的「妞妞」最大，其餘是「妞1」～「妞9」。點數較大的一方獲勝，1:1派彩；妞妞加碼3倍，妞7以上加碼2倍；點數相同算平手退回押注。"

export function MahjongNiuNiuView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [bet, setBet] = useState(10)
  const [state, setState] = useState<NNState>(() => nnInitial(10))
  const [settled, setSettled] = useState(false)

  function handleDeal() {
    if (state.phase !== "betting") return
    if (!spendCoins(bet)) return
    setSettled(false)
    setState(nnDeal(bet))
  }

  useEffect(() => {
    if (state.phase !== "revealed" || settled) return
    setSettled(true)
    if (soundOn) {
      if (state.result === "win") playWinSound()
      else if (state.result === "lose") playLossSound()
    }
    if (state.result === "win") creditWin(bet + state.payout)
    else if (state.result === "push") creditWin(bet)
  }, [state.phase, state.result, state.payout, settled, soundOn, creditWin, bet])

  function handleNext() {
    setState(nnInitial(bet))
  }

  return (
    <CasinoTableShell
      title="麻將妞妞"
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
            {state.phase === "betting"
              ? Array.from({ length: 5 }).map((_, i) => <MahjongTileBack key={i} />)
              : state.dealer.map((t) => <MahjongTileFace key={t.id} tile={t.label} />)}
          </div>
          {state.phase === "revealed" && <span className="font-mono text-sm font-bold text-amber-500">{nnLabel(state.dealerScore)}</span>}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-muted-foreground">我的手牌</span>
          <div className="flex gap-1.5">
            {state.phase === "betting"
              ? Array.from({ length: 5 }).map((_, i) => <MahjongTileBack key={i} />)
              : state.player.map((t) => <MahjongTileFace key={t.id} tile={t.label} />)}
          </div>
          {state.phase === "revealed" && <span className="font-mono text-sm font-bold text-emerald-500">{nnLabel(state.playerScore)}</span>}
        </div>

        {state.phase === "revealed" && state.result && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-border/60 bg-card/60 px-4 py-2">
            <span className="text-sm font-bold">{state.result === "win" ? "獲勝！" : state.result === "push" ? "平手" : "輸了"}</span>
            <span
              className={`text-lg font-black ${state.result === "win" ? "text-emerald-500" : state.result === "push" ? "text-muted-foreground" : "text-rose-500"}`}
            >
              {state.result === "win" ? `+${state.payout}` : state.result === "push" ? "退回押注" : state.payout}
            </span>
          </div>
        )}

        <div className="flex w-full justify-center">
          {state.phase === "betting" ? (
            <button
              type="button"
              onClick={handleDeal}
              className="rounded-full px-8 py-3 text-base font-black text-white shadow-lg"
              style={{ background: `oklch(0.55 0.18 ${HUE})` }}
            >
              開局（押注 {bet}）
            </button>
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
