"use client"

import { useEffect, useMemo, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import {
  dealLiarsCards,
  playLiarCards,
  passChallenge,
  challengeLiar,
  aiChooseLiarPlay,
  aiShouldChallenge,
  isLiarJoker,
  LIAR_RANK_LABEL,
  LIAR_SEAT_LABEL,
  type LiarState,
  type LiarCard,
  type LiarSeat,
} from "@/lib/games/liars-cards"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"
import type { Card } from "@/lib/games/cards"
import { PlayingCard } from "./playing-card"

const GAME_ID = "liars-cards"

// 將吹牛的牌（A=1..K=13，鬼牌 suit=-1）轉換成標準撲克牌資料，畫出仿真撲克牌牌面。
function toPlayingCard(card: LiarCard): Card {
  if (isLiarJoker(card)) return { suit: 0, rank: 2, id: card.id, joker: true }
  return { suit: card.suit as 0 | 1 | 2 | 3, rank: card.rank === 1 ? 14 : card.rank, id: card.id }
}

function LiarChip({ card, selected, hidden }: { card: LiarCard; selected?: boolean; hidden?: boolean }) {
  if (hidden) {
    return <PlayingCard card={null} faceDown small />
  }
  return (
    <div className={`transition ${selected ? "-translate-y-2" : ""}`}>
      <PlayingCard card={toPlayingCard(card)} small />
    </div>
  )
}

export function LiarsCardsView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<LiarState>(() => dealLiarsCards())
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [revealShown, setRevealShown] = useState(false)

  const result: PuzzleOutcome = state.outcome === "win" ? "win" : state.outcome === "lose" ? "loss" : null
  const yourHand = state.hands.you
  const isYourTurn = state.turn === "you" && state.phase === "playing" && !state.lastPlay
  const canChallenge = state.phase === "playing" && !!state.lastPlay && state.lastPlay.seat !== "you"
  const youMustRespond = state.phase === "playing" && !!state.lastPlay && state.lastPlay.seat !== "you"

  function toggle(cardId: string) {
    if (!isYourTurn) return
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(cardId)) next.delete(cardId)
      else if (next.size < 4) next.add(cardId)
      return next
    })
  }

  function submitPlay() {
    if (selected.size === 0) return
    if (soundOn) playMoveSound()
    setState((s) => playLiarCards(s, Array.from(selected)))
    setSelected(new Set())
  }

  function doBelieve() {
    if (soundOn) playMoveSound()
    setState((s) => passChallenge(s))
  }

  function doChallenge() {
    if (soundOn) playCaptureSound()
    setState((s) => challengeLiar(s, "you"))
    setRevealShown(true)
    window.setTimeout(() => setRevealShown(false), 1800)
  }

  function restart() {
    setState(dealLiarsCards())
    setSelected(new Set())
  }

  // AI 自動流程：輪到電腦出牌，或電腦要決定是否質疑您／另一位電腦剛出的牌。
  useEffect(() => {
    if (state.phase !== "playing" || state.finished) return
    if (state.lastPlay) {
      // 有待決的一手牌：先問非出牌者的其他人是否要質疑，從出牌者之後第一位非自己(you)的電腦開始
      const respondersOrder = state.turnOrder.filter((s) => s !== state.lastPlay!.seat)
      const nextResponder = respondersOrder.find((s) => s !== "you") // 僅自動處理電腦的回應；若輪到您則等待操作
      if (state.lastPlay.seat !== "you" && nextResponder) {
        const timer = window.setTimeout(() => {
          setState((s) => {
            if (!s.lastPlay) return s
            const seat = nextResponder
            const shouldChallenge = aiShouldChallenge(s.hands[seat], s.lastPlay)
            if (shouldChallenge) {
              return challengeLiar(s, seat)
            }
            return passChallenge(s)
          })
        }, 900)
        return () => window.clearTimeout(timer)
      }
      return
    }
    if (state.turn !== "you") {
      const timer = window.setTimeout(() => {
        setState((s) => {
          const seat = s.turn
          const ids = aiChooseLiarPlay(s.hands[seat], s.currentClaimRank)
          return playLiarCards(s, ids)
        })
      }, 1000)
      return () => window.clearTimeout(timer)
    }
  }, [state])

  const pileCount = useMemo(() => state.pile.reduce((sum, p) => sum + p.cards.length, 0), [state.pile])

  return (
    <BoardShell
      title="吹牛"
      onBack={onBack}
      result={result}
      onRestart={restart}
      rulesBrief="三人輪流出牌，每次蓋 1~4 張牌並宣告點數（依 A→2→3→...→K→A 順序輪替，可誠實也可吹牛虛報）。其餘玩家可選擇「相信」直接輪到下一家，或「抓吹牛」掀牌驗證：抓對了出牌者收回桌面所有牌，抓錯了質疑者自己收回。誰最先把手牌出光且沒被抓到吹牛即獲勝。"
    >
      <div className="flex w-full flex-col items-center gap-4 px-3 py-2">
        {/* 電腦座位 */}
        <div className="flex w-full justify-between gap-2">
          {(["ai1", "ai2"] as LiarSeat[]).map((seat) => (
            <div key={seat} className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-muted/40 p-2">
              <span className={`text-xs font-semibold ${state.turn === seat ? "text-primary" : "text-muted-foreground"}`}>
                {LIAR_SEAT_LABEL[seat]}
                {state.turn === seat && state.phase === "playing" && !state.lastPlay ? "（出牌中）" : ""}
              </span>
              <span className="text-[11px] text-muted-foreground">手牌 {state.hands[seat].length} 張</span>
            </div>
          ))}
        </div>

        {/* 桌面蓋牌堆與目前宣告 */}
        <div className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 p-4">
          <span className="text-xs text-muted-foreground">本輪應宣告點數</span>
          <span className="text-2xl font-black text-primary">{LIAR_RANK_LABEL[state.currentClaimRank]}</span>
          {state.pile.length > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(pileCount, 10) }).map((_, i) => (
                <LiarChip key={i} card={{ suit: 0, rank: 1, id: `pile-${i}` }} hidden />
              ))}
              {pileCount > 10 && <span className="text-xs text-muted-foreground">+{pileCount - 10}</span>}
            </div>
          )}
          {state.lastPlay && (
            <p className="text-center text-sm font-semibold">
              {LIAR_SEAT_LABEL[state.lastPlay.seat]} 宣稱打出 {state.lastPlay.cards.length} 張「
              {LIAR_RANK_LABEL[state.lastPlay.claimedRank]}」
            </p>
          )}
          {state.message && <p className="text-center text-xs font-medium text-accent">{state.message}</p>}
        </div>

        {/* 您的回應：相信 / 抓吹牛（當上一手牌不是您打出的） */}
        {youMustRespond && (
          <div className="flex w-full gap-2">
            <button
              onClick={doBelieve}
              className="flex-1 rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground transition active:scale-95"
            >
              相信，輪下一家
            </button>
            <button
              onClick={doChallenge}
              className="flex-1 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition active:scale-95"
            >
              抓吹牛！
            </button>
          </div>
        )}

        {/* 您的手牌 */}
        <div className="flex w-full flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">
            您的手牌（{yourHand.length} 張）{isYourTurn ? "－請選 1~4 張蓋牌出牌" : ""}
          </span>
          <div className="flex w-full flex-wrap justify-center gap-1.5">
            {yourHand.map((c) => (
              <button key={c.id} onClick={() => toggle(c.id)} disabled={!isYourTurn}>
                <LiarChip card={c} selected={selected.has(c.id)} />
              </button>
            ))}
          </div>
          {isYourTurn && (
            <button
              onClick={submitPlay}
              disabled={selected.size === 0}
              className="mt-1 rounded-full bg-primary px-6 py-2 text-sm font-bold text-primary-foreground transition active:scale-95 disabled:opacity-40"
            >
              打出 {selected.size} 張，宣稱「{LIAR_RANK_LABEL[state.currentClaimRank]}」
            </button>
          )}
        </div>

        {revealShown && state.revealResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="rounded-2xl border-2 border-primary bg-card p-6 text-center shadow-xl">
              <p className="text-lg font-black">{state.revealResult.honest ? "沒有吹牛！" : "抓到吹牛了！"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {LIAR_SEAT_LABEL[state.revealResult.loser]} 收回桌面所有的牌
              </p>
            </div>
          </div>
        )}
      </div>
    </BoardShell>
  )
}
