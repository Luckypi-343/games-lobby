"use client"

import { useEffect, useRef, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { CardRow } from "./playing-card"
import {
  studInitial,
  studDeal,
  studBigOpen,
  studAfterCheck,
  studRespondToBet,
  studReveal,
  dealerDecideOpen,
  dealerDecideAfterCheck,
  dealerDecideCall,
  RAISE_STEPS,
  type StudState,
} from "@/lib/games/stud-poker"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound, playDrawSound } from "@/lib/games/game-audio"

const BET_MIN = 50
const BET_MAX = 500
const BET_STEP = 50
const HUE = 340

const STREET_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "第一輪．發2張(蓋1開1)",
  2: "第二輪．發第3張",
  3: "第三輪．發第4張",
  4: "最終輪．發第5張(4明1暗)",
}

export function StudPokerView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [ante, setAnte] = useState(100)
  const [state, setState] = useState<StudState>(() => studInitial())
  const [raise, setRaise] = useState(ante)
  const aiTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (aiTimer.current) clearTimeout(aiTimer.current)
    }
  }, [])

  function startHand() {
    if (state.stage !== "over") return
    if (!spendCoins(ante)) return
    setRaise(ante)
    setState((prev) => studDeal(prev, ante))
  }

  function settle(next: StudState) {
    if (next.stage === "over" && state.stage !== "over") {
      if (soundOn) {
        if (next.result === "win") playWinSound()
        else if (next.result === "loss") playLossSound()
        else playDrawSound()
      }
      if (next.result === "win") creditWin(next.pot)
      else if (next.result === "tie") creditWin(next.playerContrib)
    }
    setState(next)
  }

  // 玩家需要額外付款的動作（加注／跟牌），先向錢包扣款成功才真正套用。
  function playerBigOpen(action: "check" | "bet" | "fold") {
    if (state.actor !== "player" || state.stage !== "act-open") return
    if (action === "bet" && !spendCoins(raise)) return
    settle(studBigOpen(state, action, raise))
  }
  function playerAfterCheck(action: "check" | "bet") {
    if (state.actor !== "player" || state.stage !== "act-after-check") return
    if (action === "bet" && !spendCoins(raise)) return
    settle(studAfterCheck(state, action, raise))
  }
  function playerRespond(action: "call" | "fold") {
    if (state.actor !== "player" || state.stage !== "act-call") return
    if (action === "call" && !spendCoins(state.pendingAmount)) return
    settle(studRespondToBet(state, action))
  }
  function playerReveal() {
    if (state.stage !== "showdown-ready") return
    settle(studReveal(state))
  }

  // 莊家(電腦)自動行動：依目前牌局階段做決策，帶一點「思考」延遲讓玩家能看清楚節奏。
  useEffect(() => {
    if (state.actor !== "dealer") return
    if (state.stage !== "act-open" && state.stage !== "act-after-check" && state.stage !== "act-call") return
    aiTimer.current = setTimeout(() => {
      if (state.stage === "act-open") {
        const d = dealerDecideOpen(state)
        settle(studBigOpen(state, d.action, d.amount))
      } else if (state.stage === "act-after-check") {
        const d = dealerDecideAfterCheck(state)
        settle(studAfterCheck(state, d.action, d.amount))
      } else if (state.stage === "act-call") {
        settle(studRespondToBet(state, dealerDecideCall(state)))
      }
    }, 850)
    return () => {
      if (aiTimer.current) clearTimeout(aiTimer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const idle = state.stage === "over" && state.hands === 0 && !state.result
  const dealerFaceDownAt = state.stage === "over" ? [] : [0]
  const bigLabel = state.bigSide === "player" ? "您目前牌面較大" : "莊家目前牌面較大"
  const raiseMax = ante * RAISE_STEPS
  const isPlayerTurn = state.actor === "player" && state.stage !== "over" && state.stage !== "showdown-ready"

  return (
    <CasinoTableShell
      title="梭哈"
      rules={
        "先調整底注，按「發牌」開始。雙方各發2張牌(第1張蓋牌、第2張開牌)，牌面較大的一方可選過牌／加注／棄牌；" +
        "過牌後換對方可選過牌或加注，被加注的一方只能跟牌或棄牌，不可再加注。第3~5張牌都是明牌，每次都由牌面較大的一方優先喊牌，" +
        "較小的一方跟進或棄牌。發滿5張(4明1暗)後進入最終輪，仍是大者先喊過牌或加注，小者也可以評估後選擇跟牌、棄牌，或主動詐唬性加注。" +
        "雙方都下定後按「開牌」，翻出各自的蓋牌，用完整5張牌比大小：同花順>鐵支>葫蘆>同花>順子>三條>兩對>一對>高牌，贏家獨得彩池，平手退回自己投入的籌碼。" +
        "加注金額限底注的1～5倍。"
      }
      hue={HUE}
      bet={ante}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={state.stage !== "over"}
      onBetChange={(v) => {
        setAnte(v)
        setRaise(v)
      }}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex h-full flex-col justify-between px-4 py-3">
        <div className="flex min-h-[7rem] flex-col items-center gap-1.5">
          <p className="text-xs font-semibold text-rose-200/70">莊家</p>
          <CardRow cards={state.dealer} faceDownAt={dealerFaceDownAt} />
          <p className="font-mono text-sm font-bold text-rose-100 tabular-nums">
            {state.stage === "over" && state.dealerHandName ? state.dealerHandName : "\u00A0"}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-1 text-center">
          {idle ? (
            <p className="text-sm text-rose-100/60">調整底注金額，按「發牌」開始這一局</p>
          ) : state.stage === "over" ? (
            <p
              className="rounded-full border px-5 py-2 text-center font-serif text-base font-bold shadow-lg"
              style={{
                borderColor: "oklch(0.7 0.15 80 / 0.5)",
                background: "oklch(0.2 0.05 340 / 0.85)",
                color: "oklch(0.88 0.14 80)",
              }}
            >
              {state.resultReason}
            </p>
          ) : (
            <>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-rose-200/60">
                {STREET_LABEL[state.street]}
              </p>
              <p className="text-xs text-amber-200/90">
                彩池 {state.pot} ．{bigLabel}
              </p>
              {state.actor === "dealer" ? (
                <p className="text-sm text-rose-100/60">莊家思考中…</p>
              ) : state.stage === "act-call" ? (
                <p className="text-sm text-rose-100/80">
                  對方{state.pendingBettor === "dealer" ? "莊家" : "您"}加注了 {state.pendingAmount}，請跟牌或棄牌
                </p>
              ) : state.stage === "act-after-check" ? (
                <p className="text-sm text-rose-100/80">對方過牌，換您選擇過牌或加注</p>
              ) : (
                <p className="text-sm text-rose-100/80">輪到您喊牌</p>
              )}
            </>
          )}
        </div>

        <div className="flex min-h-[7rem] flex-col items-center gap-1.5">
          <p className="font-mono text-sm font-bold text-rose-100 tabular-nums">
            {state.stage === "over" && state.playerHandName ? state.playerHandName : "\u00A0"}
          </p>
          <CardRow cards={state.player} />
          <p className="text-xs font-semibold text-rose-200/70">玩家</p>
        </div>

        {isPlayerTurn && (state.stage === "act-open" || state.stage === "act-after-check") && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-[11px] text-rose-200/70">加注</span>
            <button
              onClick={() => setRaise((v) => Math.max(ante, v - ante))}
              className="h-7 w-7 rounded-full bg-rose-900/60 text-sm font-bold text-rose-100 active:scale-95"
            >
              −
            </button>
            <span className="min-w-[3.5rem] text-center font-mono text-sm font-bold text-amber-200 tabular-nums">
              {raise}
            </span>
            <button
              onClick={() => setRaise((v) => Math.min(raiseMax, v + ante))}
              className="h-7 w-7 rounded-full bg-rose-900/60 text-sm font-bold text-rose-100 active:scale-95"
            >
              ＋
            </button>
          </div>
        )}

        <div className="mt-3 flex flex-wrap justify-center gap-2.5">
          {idle || (state.stage === "over" && state.result) ? (
            <button
              onClick={startHand}
              className="rounded-full bg-rose-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              {idle ? "發牌" : "再玩一局"}
            </button>
          ) : state.stage === "showdown-ready" ? (
            <button
              onClick={playerReveal}
              className="rounded-full bg-amber-400 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              開牌
            </button>
          ) : isPlayerTurn && state.stage === "act-open" ? (
            <>
              <button
                onClick={() => playerBigOpen("check")}
                className="rounded-full bg-neutral-700 px-6 py-2.5 text-sm font-bold text-rose-100 shadow transition active:scale-95"
              >
                過牌
              </button>
              <button
                onClick={() => playerBigOpen("bet")}
                className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-neutral-900 shadow transition active:scale-95"
              >
                加注 {raise}
              </button>
              {state.canFold && (
                <button
                  onClick={() => playerBigOpen("fold")}
                  className="rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-bold text-rose-200/80 shadow transition active:scale-95"
                >
                  棄牌
                </button>
              )}
            </>
          ) : isPlayerTurn && state.stage === "act-after-check" ? (
            <>
              <button
                onClick={() => playerAfterCheck("check")}
                className="rounded-full bg-neutral-700 px-6 py-2.5 text-sm font-bold text-rose-100 shadow transition active:scale-95"
              >
                過牌
              </button>
              <button
                onClick={() => playerAfterCheck("bet")}
                className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-neutral-900 shadow transition active:scale-95"
              >
                加注 {raise}
              </button>
            </>
          ) : isPlayerTurn && state.stage === "act-call" ? (
            <>
              <button
                onClick={() => playerRespond("call")}
                className="rounded-full bg-rose-500 px-6 py-2.5 text-sm font-bold text-neutral-900 shadow transition active:scale-95"
              >
                跟牌 {state.pendingAmount}
              </button>
              <button
                onClick={() => playerRespond("fold")}
                className="rounded-full bg-neutral-800 px-6 py-2.5 text-sm font-bold text-rose-200/80 shadow transition active:scale-95"
              >
                棄牌
              </button>
            </>
          ) : null}
        </div>
      </div>
    </CasinoTableShell>
  )
}
