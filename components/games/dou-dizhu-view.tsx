"use client"

import { useMemo, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import {
  dealDouDizhu,
  placeBid,
  playCombo,
  passTurn,
  classifyCombo,
  comboBeats,
  COMBO_TYPE_LABEL,
  DDZ_SEAT_LABEL,
  type DdzState,
  type DdzCard,
} from "@/lib/games/dou-dizhu"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"
import type { Card } from "@/lib/games/cards"
import { PlayingCard } from "./playing-card"

const GAME_ID = "dou-dizhu"

// 將鬥地主的牌（含大小鬼、"2"為第15點）轉換成標準撲克牌資料，畫出仿真撲克牌牌面。
function toPlayingCard(card: DdzCard): Card {
  if (card.rank >= 16) return { suit: 0, rank: 2, id: card.id, joker: true }
  return { suit: card.suit as 0 | 1 | 2 | 3, rank: card.rank === 15 ? 2 : card.rank, id: card.id }
}

function DdzChip({ card, selected }: { card: DdzCard; selected: boolean }) {
  return (
    <div className={`transition ${selected ? "-translate-y-2" : ""}`}>
      <PlayingCard card={toPlayingCard(card)} small />
    </div>
  )
}

function BidButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition active:scale-95 disabled:opacity-40"
    >
      {label}
    </button>
  )
}

export function DouDizhuView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<DdzState>(() => dealDouDizhu())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState<string | null>(null)

  const result: PuzzleOutcome = state.outcome === "win" ? "win" : state.outcome === "lose" ? "loss" : null
  const youAreLandlord = state.landlord === "you"
  const isBidding = state.phase === "bidding"

  const selectedCards = useMemo(
    () => state.hands.you.filter((c) => selected.has(c.id)),
    [state.hands.you, selected],
  )
  const previewCombo = useMemo(() => classifyCombo(selectedCards), [selectedCards])

  function toggle(cardId: string) {
    if (isBidding || state.finished || state.turn !== "you") return
    setMessage(null)
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) next.delete(cardId)
      else next.add(cardId)
      return next
    })
  }

  function handleBid(bid: number) {
    if (!isBidding || state.bidTurnOrder[state.bidIndex] !== "you") return
    const next = placeBid(state, "you", bid)
    setState(next)
    if (soundOn) playMoveSound()
  }

  function handlePlay() {
    if (state.turn !== "you" || selectedCards.length === 0) return
    if (!previewCombo) {
      setMessage("這不是合法的牌組")
      return
    }
    const mustLead = !state.lastCombo || state.lastSeat === "you"
    if (!mustLead && !comboBeats(previewCombo, state.lastCombo)) {
      setMessage("牌組壓不過上家，換一組或按過牌")
      return
    }
    const next = playCombo(state, "you", selectedCards)
    setState(next)
    setSelected(new Set())
    setMessage(null)
    if (soundOn) (next.finished ? playCaptureSound : playMoveSound)()
  }

  function handlePass() {
    if (state.turn !== "you" || !state.lastCombo || state.lastSeat === "you") return
    setState(passTurn(state, "you"))
    setSelected(new Set())
    setMessage(null)
  }

  const myBidTurn = isBidding && state.bidTurnOrder[state.bidIndex] === "you"

  const status = state.finished
    ? state.outcome === "win"
      ? youAreLandlord
        ? "地主先出完，您獲勝！"
        : "農民先出完，您獲勝！"
      : youAreLandlord
        ? "農民先出完，地主落敗"
        : "地主先出完，農民落敗"
    : isBidding
      ? myBidTurn
        ? "輪到您叫牌，請選擇分數或不叫"
        : "電腦正在叫牌……"
      : `地主：${DDZ_SEAT_LABEL[state.landlord!]}${youAreLandlord ? "（您）" : ""} ・ 現在輪到：${DDZ_SEAT_LABEL[state.turn]}`

  return (
    <BoardShell
      gameId={GAME_ID}
      title="鬥地主"
      subtitle="地主對抗兩位農民"
      status={status}
      rulesBrief="發牌後先進行叫地主：三人依序叫1分／2分／3分／不叫，叫分須高於前面的叫分，喊出3分立即結束；三人皆不叫則重新發牌。叫到最高分者成為地主，收取3張底牌（共20張手牌），其餘兩人結為農民聯手對抗地主。輪流出牌，須出比上家更大的同類型牌組（單張／對子／三張／三帶一或二／順子／連對／四帶二／炸彈／火箭），出不了就按過牌，連續兩家過牌則由剛出牌者重新自由出牌。地主先出完牌即地主獲勝，任一農民先出完牌則農民方獲勝。計分＝叫分×倍數，每打出一組炸彈或火箭倍數×2，若農民全程沒出過牌（春天）或地主只出過第一手牌（反春）倍數再×2；地主贏得地主方雙倍、農民各扣一倍，農民贏則相反。"
      result={result}
      onBack={onBack}
      onRestart={() => {
        setState(dealDouDizhu())
        setSelected(new Set())
        setMessage(null)
      }}
      mode="single"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        {!isBidding && (
          <div className="flex w-full items-center justify-around text-[11px] text-muted-foreground">
            {(["ai1", "ai2"] as const).map((seat) => (
              <div key={seat} className="flex flex-col items-center gap-1">
                <span className={state.landlord === seat ? "font-semibold text-accent" : ""}>
                  {DDZ_SEAT_LABEL[seat]}
                  {state.landlord === seat ? "（地主）" : ""}
                </span>
                <span className="lp-nums">手牌 {state.hands[seat].length}</span>
              </div>
            ))}
          </div>
        )}

        {!state.finished && !isBidding && (
          <div className="flex items-center gap-3 rounded-full bg-card/60 px-3 py-1 text-[10px] text-muted-foreground">
            <span className="lp-nums">底分 {state.baseScore}</span>
            <span className="lp-nums">倍數 ×{state.multiplier}</span>
          </div>
        )}

        {isBidding ? (
          <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-border bg-card/60 p-4">
            <p className="text-xs text-muted-foreground">
              底牌 3 張（叫到地主才會翻開）・ 目前最高叫分：
              <span className="lp-nums font-semibold text-accent">
                {" "}
                {state.highestBid > 0 ? `${state.highestBid} 分（${DDZ_SEAT_LABEL[state.highestBidder!]}）` : "尚無人叫"}
              </span>
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {state.bidHistory.map((h, i) => (
                <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-foreground">
                  {DDZ_SEAT_LABEL[h.seat]}：{h.bid === 0 ? "不叫" : `${h.bid}分`}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-1 pt-1">
              {state.hands.you.map((card) => (
                <DdzChip key={card.id} card={card} selected={false} />
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <BidButton label="不叫" onClick={() => handleBid(0)} disabled={!myBidTurn} />
              {[1, 2, 3].map((n) => (
                <BidButton
                  key={n}
                  label={`叫 ${n} 分`}
                  onClick={() => handleBid(n)}
                  disabled={!myBidTurn || n <= state.highestBid}
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex min-h-12 w-full flex-col items-center gap-1 rounded-xl border border-border bg-card/60 p-2">
              {state.bottomRevealed && (
                <div className="flex items-center gap-1 pb-1 text-[10px] text-muted-foreground">
                  <span>底牌：</span>
                  {state.bottom.map((c) => (
                    <DdzChip key={c.id} card={c} selected={false} />
                  ))}
                </div>
              )}
              {state.lastCombo ? (
                <>
                  <span className="text-[10px] text-muted-foreground">
                    {state.lastSeat ? DDZ_SEAT_LABEL[state.lastSeat] : ""} 出了 {COMBO_TYPE_LABEL[state.lastCombo.type]}
                  </span>
                  <div className="flex gap-1">
                    {state.lastCombo.cards.map((c) => (
                      <DdzChip key={c.id} card={c} selected={false} />
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-[11px] text-muted-foreground">請自由出牌開局</p>
              )}
            </div>

            {message && <p className="text-[11px] font-semibold text-destructive">{message}</p>}

            {state.finished && state.finalScore && (
              <div className="flex flex-col items-center gap-1 rounded-xl border border-accent/40 bg-accent/10 p-2 text-[11px]">
                {state.springLabel && <span className="font-semibold text-accent">觸發「{state.springLabel}」，倍數再×2！</span>}
                <div className="flex gap-3">
                  {(["you", "ai1", "ai2"] as const).map((s) => (
                    <span key={s} className={`lp-nums ${s === "you" ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                      {DDZ_SEAT_LABEL[s]} {state.finalScore![s] >= 0 ? "+" : ""}
                      {state.finalScore![s]}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <span className="text-[11px] font-semibold text-primary">
                您{youAreLandlord ? "（地主）" : "（農民）"} ・ 手牌 {state.hands.you.length}
              </span>
              <div className="flex max-w-[22rem] flex-wrap justify-center gap-1">
                {state.hands.you.map((card) => (
                  <button key={card.id} onClick={() => toggle(card.id)} className="active:scale-95">
                    <DdzChip card={card} selected={selected.has(card.id)} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePass}
                  disabled={state.turn !== "you" || !state.lastCombo || state.lastSeat === "you" || state.finished}
                  className="rounded-full bg-muted px-4 py-1.5 text-xs font-semibold text-foreground transition active:scale-95 disabled:opacity-40"
                >
                  過牌
                </button>
                <button
                  onClick={handlePlay}
                  disabled={state.turn !== "you" || selectedCards.length === 0 || state.finished}
                  className="rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-primary-foreground transition active:scale-95 disabled:opacity-40"
                >
                  出牌
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </BoardShell>
  )
}
