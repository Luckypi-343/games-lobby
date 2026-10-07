"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import { MahjongTileFace } from "@/components/games/mahjong-tile"
import {
  ppNewGame,
  ppDraw,
  ppDiscard,
  ppPong,
  ppPassPong,
  ppBotDiscardChoice,
  ppLabel,
  type PPState,
  type PPTile,
} from "@/lib/games/mahjong-pengpeng"

function Tile({ t, onClick, selected }: { t: PPTile; onClick?: () => void; selected?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`rounded-[5px] transition-transform ${selected ? "-translate-y-2 ring-2 ring-emerald-500" : ""} ${
        onClick ? "active:scale-95" : ""
      }`}
    >
      <MahjongTileFace tile={t} />
    </button>
  )
}

export function MahjongPengPengView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const onBack = onLobby
  const [state, setState] = useState<PPState>(() => ppNewGame())
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (botTimer.current) clearTimeout(botTimer.current)
    if (state.phase === "over") return
    const current = state.players[state.turn]
    if (!current.isBot) return
    botTimer.current = setTimeout(() => {
      if (state.phase === "draw") {
        setState((s) => ppDraw(s))
      } else if (state.phase === "discarded-wait") {
        if (state.lastDiscardBy !== state.turn) {
          // bot may pong the pending discard
          const can = current.hand.filter((t) => t === state.lastDiscard).length >= 2
          if (can && Math.random() < 0.8) {
            setState((s) => ppPong(s, state.turn))
          } else {
            setState((s) => ppPassPong(s))
          }
        } else {
          const tile = ppBotDiscardChoice(current.hand)
          setState((s) => ppDiscard(s, tile))
        }
      }
    }, 650)
    return () => {
      if (botTimer.current) clearTimeout(botTimer.current)
    }
  }, [state])

  const me = state.players[0]
  const myTurn = state.turn === 0 && state.phase !== "over"
  const pongWindow = state.phase === "discarded-wait" && state.lastDiscardBy !== 0 && state.lastDiscard
  const canIPong = pongWindow && me.hand.filter((t) => t === state.lastDiscard).length >= 2
  const result: PuzzleOutcome = state.phase !== "over" ? null : state.winner === 0 ? "win" : "loss"

  return (
    <BoardShell
      gameId="mahjong-pengpeng"
      title="碰碰胡"
      subtitle="簡化版麻將，只用筒子與字牌，取消吃牌，只能碰或摸，湊成2組刻子+1對將牌即可胡牌。"
      status={
        state.phase === "over"
          ? "本局結束"
          : myTurn
            ? state.phase === "draw"
              ? "輪到你，請摸牌"
              : "輪到你，請打出一張牌"
            : canIPong
              ? "可以碰牌！"
              : `等待 ${state.players[state.turn].name} 行動…`
      }
      mode="ai"
      onBack={onBack}
      onRestart={() => setState(ppNewGame())}
      result={result}
      showDifficulty={false}
    >
      <div className="flex w-full flex-col gap-4 px-3 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-2">
              <span className="text-xs font-semibold text-muted-foreground">{state.players[i].name}</span>
              <span className="text-xs">手牌 {state.players[i].hand.length}</span>
              <div className="flex flex-wrap gap-0.5">
                {state.players[i].melds.map((m, mi) => (
                  <span key={mi} className="text-sm">
                    {m.map(ppLabel).join("")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-card/40 p-2 text-center text-xs text-muted-foreground">
          {state.log[state.log.length - 1]}
        </div>

        {state.phase === "over" && state.winner !== null && (
          <div className="rounded-xl border border-amber-400 bg-amber-50 p-3 text-center font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {state.players[state.winner].name} 胡牌獲勝！
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">我的手牌</span>
          <div className="flex flex-wrap justify-center gap-1">
            {me.melds.map((m, mi) => (
              <div key={mi} className="mr-2 flex gap-0.5">
                {m.map((t, ti) => (
                  <Tile key={ti} t={t} />
                ))}
              </div>
            ))}
            {me.hand.map((t, i) => (
              <Tile
                key={`${t}-${i}`}
                t={t}
                onClick={myTurn && state.phase === "discarded-wait" ? () => setState((s) => ppDiscard(s, t)) : undefined}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3">
          {myTurn && state.phase === "draw" && (
            <button
              type="button"
              onClick={() => setState((s) => ppDraw(s))}
              className="rounded-full bg-emerald-600 px-6 py-2 font-bold text-white shadow"
            >
              摸牌
            </button>
          )}
          {canIPong && (
            <>
              <button
                type="button"
                onClick={() => setState((s) => ppPong(s, 0))}
                className="rounded-full bg-rose-600 px-6 py-2 font-bold text-white shadow"
              >
                碰！
              </button>
              <button
                type="button"
                onClick={() => setState((s) => ppPassPong(s))}
                className="rounded-full border border-border px-6 py-2 font-bold"
              >
                放過
              </button>
            </>
          )}
          {state.phase === "over" && (
            <button
              type="button"
              onClick={() => setState(ppNewGame())}
              className="rounded-full bg-amber-600 px-6 py-2 font-bold text-white shadow"
            >
              再來一局
            </button>
          )}
        </div>
      </div>
    </BoardShell>
  )
}
