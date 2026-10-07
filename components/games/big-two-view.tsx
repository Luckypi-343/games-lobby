"use client"

import { useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { PlayingCard, CardRow } from "./playing-card"
import { dealBigTwoHand, kickoffIfDealerStarts, playerPass, playerPlay, type BigTwoState } from "@/lib/games/big-two"
import { type Card } from "@/lib/games/cards"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"

const BET_MIN = 50
const BET_MAX = 2000
const BET_STEP = 50
const HUE = 200

export function BigTwoView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [state, setState] = useState<BigTwoState>(() => kickoffIfDealerStarts(dealBigTwoHand()))
  const [bet, setBet] = useState(100)
  const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle")
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function start() {
    if (!spendCoins(bet)) return
    setState(kickoffIfDealerStarts(dealBigTwoHand()))
    setSelected(new Set())
    setPhase("playing")
  }

  function toggle(card: Card) {
    if (phase !== "playing" || state.turn !== "player") return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(card.id)) next.delete(card.id)
      else {
        if (next.size >= 2) return prev
        next.add(card.id)
      }
      return next
    })
  }

  function finish(next: BigTwoState) {
    setState(next)
    if (next.status === "over") {
      setPhase("over")
      if (next.winner === "player") {
        if (soundOn) playWinSound()
        creditWin(bet * 2)
      } else if (soundOn) {
        playLossSound()
      }
    }
  }

  function play() {
    const selectedCards = state.playerHand.filter((c) => selected.has(c.id))
    if (selectedCards.length === 0) return
    const next = playerPlay(state, selectedCards)
    if (next === state) return // 不合法的出牌，忽略
    setSelected(new Set())
    finish(next)
  }

  function pass() {
    const next = playerPass(state)
    if (next === state) return
    finish(next)
  }

  const mustBeat = state.lastPlay && state.lastPlay.by === "dealer" ? state.lastPlay.combo : null
  const canPass = phase === "playing" && state.turn === "player" && !!mustBeat

  return (
    <CasinoTableShell
      title="大老二"
      rules="簡化版規則：僅支援單張與對子出牌（不含順子等進階牌型）。點選手牌中1張或同點數2張再按「出牌」，須比對方剛出的同類型牌型大，也可以選擇「過牌」。牌面大小順序：3小...10、J、Q、K、A、2最大，同點數比花色 ♠>♥>♣>♦。率先出完13張手牌者獲勝，獲勝可得2倍彩金。"
      hue={HUE}
      bet={bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={phase === "playing"}
      onBetChange={setBet}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex h-full flex-col justify-between gap-2 px-3 py-3">
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs font-semibold text-sky-200/70">莊家手牌剩餘 {state.dealerHand.length} 張</p>
          <CardRow cards={state.dealerLastPlayed.length ? state.dealerLastPlayed : []} small />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2 overflow-y-auto py-1">
          {phase === "idle" ? (
            <p className="text-sm text-sky-100/60">調整押注金額，按「發牌」開始對局</p>
          ) : (
            <>
              <p className="max-h-16 max-w-xs overflow-y-auto text-center text-[11px] leading-relaxed text-sky-100/50">
                {state.history.slice(-4).join(" ／ ")}
              </p>
              {phase === "over" && (
                <p
                  className="rounded-full border px-5 py-2 text-center font-serif text-sm font-bold shadow-lg"
                  style={{
                    borderColor: "oklch(0.7 0.15 80 / 0.5)",
                    background: "oklch(0.2 0.05 200 / 0.85)",
                    color: "oklch(0.88 0.14 80)",
                  }}
                >
                  {state.winner === "player" ? "玩家獲勝！" : "莊家獲勝"}
                </p>
              )}
              {phase === "playing" && state.turn === "dealer" && (
                <p className="text-xs text-sky-100/50">莊家思考中…</p>
              )}
              {phase === "playing" && state.turn === "player" && (
                <p className="text-xs text-sky-100/50">
                  {mustBeat ? "請出一張更大的牌，或選擇過牌" : "自由開局，出任意單張或對子"}
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap justify-center gap-1">
            {state.playerHand.map((c) => (
              <button
                key={c.id}
                onClick={() => toggle(c)}
                className="transition"
                style={{ transform: selected.has(c.id) ? "translateY(-6px)" : "none" }}
              >
                <PlayingCard card={c} small />
              </button>
            ))}
          </div>
          <p className="text-center text-xs font-semibold text-sky-200/70">玩家手牌 {state.playerHand.length} 張</p>

          <div className="flex justify-center gap-3">
            {phase !== "playing" ? (
              <button
                onClick={start}
                className="rounded-full bg-sky-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
              >
                {phase === "over" ? "再玩一局" : "發牌"}
              </button>
            ) : (
              <>
                <button
                  onClick={pass}
                  disabled={!canPass || state.turn !== "player"}
                  className="rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-sky-100 shadow-lg transition active:scale-95 disabled:opacity-30"
                >
                  過牌
                </button>
                <button
                  onClick={play}
                  disabled={state.turn !== "player" || selected.size === 0}
                  className="rounded-full bg-sky-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95 disabled:opacity-30"
                >
                  出牌
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </CasinoTableShell>
  )
}
