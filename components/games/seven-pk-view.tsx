"use client"

import { useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { PlayingCard } from "./playing-card"
import {
  pkInitial,
  pkDeal,
  pkToggleHold,
  pkDraw,
  drawBigSmallCard,
  resolveBigSmall,
  resolveColor,
  PK_PAYOUT,
  PK_CATEGORY_LABEL,
  PK_PAYOUT_TABLE,
  type PkState,
  type BigSmallChoice,
  type ColorChoice,
} from "@/lib/games/seven-pk"
import { type Card } from "@/lib/games/cards"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound } from "@/lib/games/game-audio"

const RULES =
  "先調整押注金額，按「發牌」拿5張牌，勾選要保留的牌後按「換牌」重新抽剩下的牌（僅一次機會），結算牌型對照賠率表發彩金。中獎後可選擇「比倍」，猜對翻倍、猜錯獎金歸零，也可隨時「兌現」入袋。\n\n【賠率表】" +
  PK_PAYOUT_TABLE.map((row) => `${row.label}×${row.multiplier}`).join("、")

const BET_MIN = 50
const BET_MAX = 2000
const BET_STEP = 50
const HUE = 25

export function SevenPkView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [state, setState] = useState<PkState>(() => pkInitial())
  const [bet, setBet] = useState(100)
  const [winnings, setWinnings] = useState(0)
  const [doubleCard, setDoubleCard] = useState<Card | null>(null)
  const [doubleBusy, setDoubleBusy] = useState(false)
  const [doubleTieNote, setDoubleTieNote] = useState(false)

  const canBet = state.phase === "idle" || (state.phase === "result" && winnings === 0)

  function deal() {
    if (!canBet) return
    if (!spendCoins(bet)) return
    setState((s) => pkDeal(s))
    setWinnings(0)
    setDoubleCard(null)
    setDoubleTieNote(false)
  }

  function draw() {
    if (state.phase !== "dealt") return
    const next = pkDraw(state)
    setState(next)
    const multiplier = PK_PAYOUT[next.category]
    if (multiplier > 0) {
      const payout = bet * multiplier
      setWinnings(payout)
      if (soundOn) playWinSound()
    } else {
      setWinnings(0)
      if (soundOn) playLossSound()
    }
  }

  function cashOut() {
    if (winnings > 0) creditWin(winnings)
    setWinnings(0)
    setState((s) => ({ ...s, phase: "idle" }))
  }

  function playDoubleUp(kind: "bigsmall" | "color", choice: BigSmallChoice | ColorChoice) {
    if (winnings <= 0 || doubleBusy) return
    setDoubleBusy(true)
    setDoubleTieNote(false)
    const card = drawBigSmallCard()
    setDoubleCard(card)
    window.setTimeout(() => {
      if (kind === "bigsmall") {
        const outcome = resolveBigSmall(card, choice as BigSmallChoice)
        if (outcome === "tie") {
          setDoubleTieNote(true)
          setDoubleBusy(false)
          return
        }
        if (outcome === "win") {
          setWinnings((w) => w * 2)
          if (soundOn) playWinSound()
        } else {
          setWinnings(0)
          if (soundOn) playLossSound()
        }
      } else {
        const outcome = resolveColor(card, choice as ColorChoice)
        if (outcome === "win") {
          setWinnings((w) => w * 2)
          if (soundOn) playWinSound()
        } else {
          setWinnings(0)
          if (soundOn) playLossSound()
        }
      }
      setDoubleBusy(false)
    }, 600)
  }

  return (
    <CasinoTableShell
      title="7PK"
      rules={RULES}
      hue={HUE}
      bet={bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={!canBet}
      onBetChange={setBet}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex h-full flex-col justify-between px-4 py-3">
        <div className="flex items-center justify-end">
          <p className="text-xs font-semibold text-amber-200/60">
            局數 {state.hands} · 中獎 {state.wins}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          {state.phase === "idle" ? (
            <p className="text-sm text-amber-100/60">調整押注金額，按「發牌」開始這一局</p>
          ) : (
            <>
              <div className="flex gap-2">
                {state.hand.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setState((s) => pkToggleHold(s, i))}
                    disabled={state.phase !== "dealt"}
                    className="flex flex-col items-center gap-1 transition active:scale-95 disabled:active:scale-100"
                  >
                    <PlayingCard card={c} />
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        state.held[i] ? "bg-amber-400 text-neutral-900" : "bg-white/10 text-amber-200/50"
                      }`}
                    >
                      {state.held[i] ? "保留" : "換牌"}
                    </span>
                  </button>
                ))}
              </div>

              {state.phase === "result" && (
                <p
                  className="rounded-full border px-5 py-2 text-center font-serif text-base font-bold shadow-lg"
                  style={{
                    borderColor: "oklch(0.7 0.15 80 / 0.5)",
                    background: "oklch(0.2 0.05 25 / 0.85)",
                    color: PK_PAYOUT[state.category] > 0 ? "oklch(0.88 0.14 80)" : "oklch(0.85 0.05 20)",
                  }}
                >
                  {PK_PAYOUT[state.category] > 0
                    ? `${PK_CATEGORY_LABEL[state.category]}！贏得 ${bet * PK_PAYOUT[state.category]} 幣`
                    : "未中獎"}
                </p>
              )}
            </>
          )}
        </div>

        {state.phase === "result" && winnings > 0 && (
          <div className="mt-2 flex flex-col items-center gap-2 rounded-xl border border-amber-400/30 bg-black/40 p-3">
            <p className="text-xs font-semibold text-amber-200/80">
              目前彩金 <span className="font-mono text-base text-amber-100 tabular-nums">{winnings}</span> 幣 — 選擇比倍或兌現
            </p>
            {doubleCard && (
              <PlayingCard card={doubleCard} />
            )}
            {doubleTieNote && <p className="text-[11px] text-amber-200/70">開出7點，平手重新比倍</p>}
            <div className="flex flex-wrap justify-center gap-2">
              <button
                disabled={doubleBusy}
                onClick={() => playDoubleUp("bigsmall", "big")}
                className="rounded-full bg-amber-500/90 px-4 py-2 text-xs font-bold text-neutral-900 transition active:scale-95 disabled:opacity-40"
              >
                比大
              </button>
              <button
                disabled={doubleBusy}
                onClick={() => playDoubleUp("bigsmall", "small")}
                className="rounded-full bg-amber-500/90 px-4 py-2 text-xs font-bold text-neutral-900 transition active:scale-95 disabled:opacity-40"
              >
                比小
              </button>
              <button
                disabled={doubleBusy}
                onClick={() => playDoubleUp("color", "red")}
                className="rounded-full bg-rose-500/90 px-4 py-2 text-xs font-bold text-neutral-900 transition active:scale-95 disabled:opacity-40"
              >
                比紅
              </button>
              <button
                disabled={doubleBusy}
                onClick={() => playDoubleUp("color", "black")}
                className="rounded-full bg-neutral-700 px-4 py-2 text-xs font-bold text-neutral-100 transition active:scale-95 disabled:opacity-40"
              >
                比黑
              </button>
              <button
                disabled={doubleBusy}
                onClick={cashOut}
                className="rounded-full bg-emerald-500/90 px-4 py-2 text-xs font-bold text-neutral-900 transition active:scale-95 disabled:opacity-40"
              >
                兌現入袋
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex justify-center gap-3">
          {state.phase === "dealt" ? (
            <button
              onClick={draw}
              className="rounded-full bg-amber-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              換牌
            </button>
          ) : state.phase === "result" && winnings > 0 ? null : (
            <button
              onClick={deal}
              disabled={!canBet}
              className="rounded-full bg-amber-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95 disabled:opacity-40"
            >
              {state.phase === "result" ? "再玩一局" : "發牌"}
            </button>
          )}
        </div>
      </div>
    </CasinoTableShell>
  )
}
