"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import {
  dealSevens,
  playCard,
  coverCard,
  botAct,
  playableCards,
  scoreSevens,
  SEVENS_PLAYER_NAMES,
  type SevensState,
} from "@/lib/games/sevens"
import { type Card, SUIT_SYMBOL, isRedSuit } from "@/lib/games/cards"
import { PlayingCard } from "./playing-card"

const GAME_ID = "sevens"

function MiniCard({ card }: { card: Card }) {
  return <PlayingCard card={card} small />
}

// 四個花色各自的「出牌牌堆」：用跟手牌一樣的仿真撲克牌面堆疊顯示每個已接上的牌，
// 不再用簡易的文字色塊，讓整條牌堆看起來跟真實紙牌一致。
function TrackRow({ suit, state }: { suit: 0 | 1 | 2 | 3; state: SevensState }) {
  const track = state.tracks[suit]
  const red = isRedSuit(suit)
  const cells: number[] = []
  if (track.opened) {
    for (let r = track.low; r <= track.high; r++) cells.push(r)
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-5 shrink-0 text-center text-sm font-bold ${red ? "text-red-500" : "text-foreground"}`}>
        {SUIT_SYMBOL[suit]}
      </span>
      <div className="flex flex-1 gap-1 overflow-x-auto rounded-lg bg-black/20 p-1.5">
        {!track.opened ? (
          <span className="self-center px-2 py-1 text-[10px] text-muted-foreground">等待 7 開局</span>
        ) : (
          cells.map((r) => (
            <div key={r} className={r === 7 ? "scale-105 drop-shadow-[0_0_4px_oklch(0.8_0.17_88_/_0.7)]" : ""}>
              <PlayingCard card={{ id: `${suit}-${r}`, suit, rank: r }} small />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function SevensView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const [state, setState] = useState<SevensState>(() => dealSevens())
  const [perfect, setPerfect] = useState(false)
  const settledRef = useRef(false)

  const myPlayable = playableCards(state, 0)
  const myTurn = state.turn === 0 && state.status === "playing"
  const mustCover = myTurn && myPlayable.length === 0

  function act(card: Card) {
    if (!myTurn) return
    if (mustCover) {
      setState((prev) => coverCard(prev, 0, card))
    } else if (myPlayable.some((c) => c.id === card.id)) {
      setState((prev) => playCard(prev, 0, card))
    }
  }

  // 電腦自動輪流行動
  useEffect(() => {
    if (state.status !== "playing" || state.turn === 0) return
    const timer = setTimeout(() => {
      setState((prev) => botAct(prev, prev.turn))
    }, 650)
    return () => clearTimeout(timer)
  }, [state])

  const scores = state.status === "over" ? scoreSevens(state) : null
  const result: PuzzleOutcome =
    state.status !== "over" || !scores
      ? null
      : (() => {
          const me = scores[0]
          const lowest = Math.min(...scores.map((r) => r.finalPoints))
          const tiedCount = scores.filter((r) => r.finalPoints === lowest).length
          if (me.finalPoints !== lowest) return "loss"
          return tiedCount > 1 ? "draw" : "win"
        })()

  useEffect(() => {
    if (!scores || settledRef.current) return
    settledRef.current = true
    setPerfect(scores[0].perfect)
  }, [scores])

  function restart() {
    setState(dealSevens())
    setPerfect(false)
    settledRef.current = false
  }

  return (
    <BoardShell
      gameId={GAME_ID}
      title="排七"
      subtitle="52張牌四人各發13張，依序接龍相鄰數字，無牌可接須蓋牌扣分。"
      status={
        state.status === "over"
          ? "本局結束"
          : mustCover
            ? "你無牌可接，請選擇一張手牌蓋下"
            : myTurn
              ? "輪到你，請出一張可接的牌"
              : `等待 ${SEVENS_PLAYER_NAMES[state.turn]} 行動…`
      }
      mode="ai"
      onBack={onLobby}
      onRestart={restart}
      result={result}
      showDifficulty={false}
    >
      <div className="flex w-full flex-col gap-3 px-3 pb-4">
        <div className="flex flex-col gap-1.5 rounded-xl bg-black/20 p-2">
          <TrackRow suit={0} state={state} />
          <TrackRow suit={1} state={state} />
          <TrackRow suit={2} state={state} />
          <TrackRow suit={3} state={state} />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-muted-foreground">
          {[1, 2, 3].map((seat) => (
            <div
              key={seat}
              className={`rounded-lg border p-2 ${
                state.turn === seat && state.status === "playing" ? "border-primary bg-primary/10" : "border-border/60 bg-card/40"
              }`}
            >
              <div className="font-semibold text-foreground">{SEVENS_PLAYER_NAMES[seat]}</div>
              <div>手牌 {state.hands[seat].length} 張</div>
              <div>蓋牌 {state.covered[seat].length} 張</div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-black/20 px-3 py-2 text-[11px] text-muted-foreground">{state.log[0]}</div>

        {state.covered[0].length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-[11px] text-muted-foreground">我的蓋牌：</span>
            <div className="flex gap-1">
              {state.covered[0].map((_, i) => (
                <div
                  key={i}
                  className="flex h-8 w-6 items-center justify-center rounded border border-border bg-card text-[9px] text-muted-foreground"
                >
                  ?
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-muted-foreground">
            我的手牌（{state.hands[0].length}張）{mustCover ? "－ 無牌可接，點選一張蓋下" : myTurn ? "－ 點選可出的牌" : ""}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {state.hands[0].map((c) => {
              const playable = myPlayable.some((p) => p.id === c.id)
              const clickable = myTurn && (mustCover || playable)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => act(c)}
                  disabled={!clickable}
                  className={`transition ${clickable ? "cursor-pointer hover:-translate-y-1" : "cursor-default opacity-70"} ${
                    myTurn && !mustCover && playable ? "rounded-md ring-2 ring-primary" : ""
                  }`}
                >
                  <MiniCard card={c} />
                </button>
              )
            })}
          </div>
        </div>

        {scores && (
          <div className="rounded-xl border border-primary/40 bg-primary/5 p-3">
            <div className="mb-2 text-center text-sm font-bold text-primary">結算（分數越低越優勝）</div>
            <div className="flex flex-col gap-1 text-xs">
              {scores
                .slice()
                .sort((a, b) => a.finalPoints - b.finalPoints)
                .map((row) => (
                  <div
                    key={row.seat}
                    className={`flex items-center justify-between rounded-lg px-2 py-1 ${
                      row.seat === 0 ? "bg-primary/20" : "bg-black/10"
                    }`}
                  >
                    <span>
                      {row.name} {row.perfect ? "🏆 完美出牌（零蓋牌）" : `蓋牌${row.coveredCount}張`}
                    </span>
                    <span className="font-bold">{row.finalPoints} 分</span>
                  </div>
                ))}
            </div>
            {perfect && (
              <div className="mt-2 text-center text-xs font-bold text-emerald-500">你完美出牌，全程沒有蓋牌！</div>
            )}
          </div>
        )}
      </div>
    </BoardShell>
  )
}
