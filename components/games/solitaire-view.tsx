"use client"

import { useState } from "react"
import { BoardShell } from "./board-shell"
import {
  solInitial,
  solDraw,
  solCanMove,
  solApplyMove,
  solAutoFoundationMoves,
  SUIT_SYMBOL,
  RANK_LABEL,
  type SolState,
  type PileRef,
  type Card,
  type Suit,
} from "@/lib/games/solitaire"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound } from "@/lib/games/game-audio"

function isRed(suit: Suit) {
  return suit === 1 || suit === 2
}

function refEquals(a: PileRef, b: PileRef) {
  if (a.kind !== b.kind) return false
  if (a.kind === "foundation" && b.kind === "foundation") return a.suit === b.suit
  if (a.kind === "tableau" && b.kind === "tableau") return a.col === b.col
  return true
}

function CardFace({ card, small }: { card: Card; small?: boolean }) {
  const red = isRed(card.suit)
  return (
    <div
      className={`flex ${small ? "h-10 w-7" : "h-14 w-10"} flex-col items-center justify-center rounded-md border shadow-sm ${
        card.faceUp ? "border-neutral-300 bg-white" : "border-neutral-500 bg-gradient-to-br from-blue-700 to-blue-900"
      }`}
    >
      {card.faceUp && (
        <>
          <span className={`text-[10px] font-bold leading-none ${red ? "text-red-600" : "text-neutral-900"}`}>
            {RANK_LABEL[card.rank]}
          </span>
          <span className={`text-xs leading-none ${red ? "text-red-600" : "text-neutral-900"}`}>{SUIT_SYMBOL[card.suit]}</span>
        </>
      )}
    </div>
  )
}

export function SolitaireView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<SolState>(() => solInitial())
  const [selected, setSelected] = useState<PileRef | null>(null)

  const restart = () => {
    setState(solInitial())
    setSelected(null)
  }

  function tryMove(to: PileRef) {
    if (!selected) return
    if (solCanMove(state, selected, to)) {
      if (soundOn) playMoveSound()
      const next = solApplyMove(state, selected, to)
      setState(next)
      if (next.status === "win" && soundOn) playWinSound()
    }
    setSelected(null)
  }

  function tapPile(ref: PileRef) {
    if (state.status !== "playing") return
    if (selected && refEquals(selected, ref)) {
      setSelected(null)
      return
    }
    if (selected) {
      tryMove(ref)
      return
    }
    setSelected(ref)
  }

  function autoSort() {
    const move = solAutoFoundationMoves(state)
    if (move) {
      if (soundOn) playMoveSound()
      setState((s) => solApplyMove(s, move.from, move.to))
    }
  }

  const statusText =
    state.status === "win" ? "恭喜！全部歸位完成" : `已移動 ${state.moves} 次${selected ? "，請選擇要放置的位置" : ""}`

  return (
    <BoardShell
      gameId="solitaire"
      title="接龍紙牌"
      subtitle="Klondike 單人版"
      status={statusText}
      result={state.status === "win" ? "win" : null}
      rulesBrief="點選一張牌再點選目的地即可移動：基礎堆需依同花色A到K依序疊放；牌桌欄需交替紅黑顏色且點數依序減一，空欄只能放K；牌堆用完可翻牌補充。"
      onBack={onBack}
      onRestart={restart}
      mode="single"
    >
      <div className="flex w-[min(94vw,420px)] shrink-0 flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (soundOn) playMoveSound()
                setState((s) => solDraw(s))
                setSelected(null)
              }}
              className="flex h-14 w-10 items-center justify-center rounded-md border border-dashed border-border bg-muted text-xs text-muted-foreground"
            >
              {state.stock.length > 0 ? `牌堆${state.stock.length}` : "重洗"}
            </button>
            <button onClick={() => tapPile({ kind: "waste" })} className="relative">
              {state.waste.length > 0 ? (
                <div className={selected?.kind === "waste" ? "rounded-md ring-2 ring-accent" : ""}>
                  <CardFace card={state.waste.at(-1)!} />
                </div>
              ) : (
                <div className="h-14 w-10 rounded-md border border-dashed border-border" />
              )}
            </button>
          </div>
          <div className="flex gap-1.5">
            {([0, 1, 2, 3] as Suit[]).map((suit) => {
              const pile = state.foundations[suit]
              const ref: PileRef = { kind: "foundation", suit }
              return (
                <button
                  key={suit}
                  onClick={() => tapPile(ref)}
                  className={`flex h-14 w-10 items-center justify-center rounded-md border ${
                    selected?.kind === "foundation" && selected.suit === suit ? "ring-2 ring-accent" : ""
                  } ${pile.length > 0 ? "" : "border-dashed border-border"}`}
                >
                  {pile.length > 0 ? <CardFace card={pile.at(-1)!} /> : <span className="text-sm text-muted-foreground">{SUIT_SYMBOL[suit]}</span>}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={autoSort}
          className="self-start rounded-md bg-accent/15 px-3 py-1 text-xs font-semibold text-accent"
        >
          自動歸位
        </button>

        <div className="grid grid-cols-7 gap-1.5">
          {state.tableau.map((col, colIdx) => {
            const ref: PileRef = { kind: "tableau", col: colIdx }
            const isSelected = selected?.kind === "tableau" && selected.col === colIdx
            return (
              <button
                key={colIdx}
                onClick={() => tapPile(ref)}
                className={`relative flex min-h-[90px] flex-col items-center rounded-md ${
                  isSelected ? "ring-2 ring-accent" : ""
                } ${col.length === 0 ? "border border-dashed border-border" : ""}`}
              >
                {col.length === 0 && <span className="mt-8 text-[10px] text-muted-foreground">空</span>}
                {col.map((card, i) => (
                  <div key={card.id} className={i === 0 ? "" : "-mt-8"} style={{ zIndex: i }}>
                    <CardFace card={card} small />
                  </div>
                ))}
              </button>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
