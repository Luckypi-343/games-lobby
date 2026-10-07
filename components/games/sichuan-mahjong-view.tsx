"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import { MahjongTileFace } from "@/components/games/mahjong-tile"
import { MJ_LABELS, isWinningHand, type MJTile } from "@/lib/games/mahjong"
import {
  scInitial,
  scDraw,
  scSelfHu,
  scDiscard,
  scResolveClaim,
  scBotChoice,
  scBotDiscard,
  scWaitingTiles,
  scMissingLabel,
  type SCState,
} from "@/lib/games/sichuan-mahjong"

const GAME_ID = "sichuan-mahjong"

function Tile({ t, onClick, selected, dim }: { t: MJTile; onClick?: () => void; selected?: boolean; dim?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`shrink-0 rounded-[5px] transition-transform ${selected ? "-translate-y-2 ring-2 ring-emerald-500" : ""} ${
        dim ? "opacity-50" : ""
      } ${onClick ? "active:scale-95" : ""}`}
    >
      <MahjongTileFace tile={t} />
    </button>
  )
}

export function SichuanMahjongView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const [state, setState] = useState<SCState>(() => scInitial())
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (botTimer.current) clearTimeout(botTimer.current)
    if (state.phase === "over") return

    if (state.phase === "claim") {
      const pending = state.claimOptions.find((o) => o.seat !== 0)
      if (pending) {
        botTimer.current = setTimeout(() => {
          const choice = scBotChoice(state, pending.seat)
          setState((s) => scResolveClaim(s, pending.seat, choice.action, choice.chowPair))
        }, 550)
        return () => {
          if (botTimer.current) clearTimeout(botTimer.current)
        }
      }
      return
    }

    const seat = state.turn
    if (seat === 0) return
    const player = state.players[seat]
    if (player.out) return

    botTimer.current = setTimeout(() => {
      if (state.phase === "draw") {
        setState((s) => scDraw(s))
      } else if (state.phase === "discard") {
        setState((s) => {
          const p = s.players[seat]
          if (isWinningHand(p.hand)) {
            return scSelfHu(s)
          }
          const tile = scBotDiscard(p.hand)
          return scDiscard(s, tile)
        })
      }
    }, 600)
    return () => {
      if (botTimer.current) clearTimeout(botTimer.current)
    }
  }, [state])

  const me = state.players[0]
  const myTurn = state.turn === 0 && state.phase !== "over" && !me.out
  const myClaim = state.claimOptions.find((o) => o.seat === 0)
  const waiting = myTurn && state.phase === "discard" ? scWaitingTiles(me.hand, me.missingSuit) : []

  const result: PuzzleOutcome = state.phase !== "over" ? null : state.winners[0] === 0 ? "win" : state.winners.includes(0) ? "win" : "loss"

  return (
    <BoardShell
      gameId={GAME_ID}
      title="四川麻將（血戰到底）"
      subtitle="只用筒、條、萬三門，開局自動缺一門；一家胡牌離場但遊戲不結束，直到三家胡牌或牌摸完才算整局結束。"
      status={
        state.phase === "over"
          ? "本局結束"
          : me.out
            ? "您已胡牌離場，其餘繼續血戰"
            : myTurn
              ? state.phase === "draw"
                ? "輪到你，請摸牌"
                : "輪到你，請打出一張牌"
              : myClaim
                ? "可以吃碰槓胡！"
                : `等待 ${state.players[state.turn]?.name ?? ""} 行動…`
      }
      mode="ai"
      onBack={onLobby}
      onRestart={() => setState(scInitial())}
      result={result}
      showDifficulty={false}
    >
      <div className="flex w-full flex-col gap-3 px-3 pb-4">
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 ${
                state.players[i].out ? "border-amber-400 bg-amber-50 dark:bg-amber-950" : "border-border/60 bg-card/60"
              }`}
            >
              <span className="text-xs font-semibold text-muted-foreground">
                {state.players[i].name} {state.players[i].out ? "🏆已胡" : ""}
              </span>
              <span className="text-[10px] text-muted-foreground">缺{scMissingLabel(state.players[i].missingSuit)}</span>
              <span className="text-xs">手牌 {state.players[i].hand.length}</span>
              <div className="flex flex-wrap gap-0.5">
                {state.players[i].melds.map((m, mi) => (
                  <span key={mi} className="text-sm">
                    {m.tiles.map((t) => MJ_LABELS[t] ?? t).join("")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-card/40 p-2 text-center text-xs text-muted-foreground">{state.log}</div>

        {state.phase === "over" && (
          <div className="rounded-xl border border-amber-400 bg-amber-50 p-3 text-center dark:bg-amber-950">
            <p className="font-bold text-amber-700 dark:text-amber-300">
              {state.winners.length > 0
                ? `胡牌順序：${state.winners.map((w) => state.players[w].name).join(" → ")}`
                : "牌摸完，流局"}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            我的手牌（缺{scMissingLabel(me.missingSuit)}）
          </span>
          <div className="flex flex-wrap justify-center gap-1">
            {me.melds.map((m, mi) => (
              <div key={mi} className="mr-2 flex gap-0.5">
                {m.tiles.map((t, ti) => (
                  <Tile key={ti} t={t} />
                ))}
              </div>
            ))}
            {me.hand.map((t, i) => (
              <Tile
                key={`${t}-${i}`}
                t={t}
                dim={waiting.length > 0 && !waiting.includes(t)}
                onClick={myTurn && state.phase === "discard" ? () => setState((s) => scDiscard(s, t)) : undefined}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {myTurn && state.phase === "draw" && (
            <button
              type="button"
              onClick={() => setState((s) => scDraw(s))}
              className="rounded-full bg-emerald-600 px-6 py-2 font-bold text-white shadow"
            >
              摸牌
            </button>
          )}
          {myTurn && state.phase === "discard" && isWinningHand(me.hand) && (
            <button
              type="button"
              onClick={() => setState((s) => scSelfHu(s))}
              className="rounded-full bg-rose-600 px-6 py-2 font-bold text-white shadow"
            >
              自摸胡牌！
            </button>
          )}
          {myClaim && (
            <>
              {myClaim.hu && (
                <button
                  type="button"
                  onClick={() => setState((s) => scResolveClaim(s, 0, "hu"))}
                  className="rounded-full bg-rose-600 px-6 py-2 font-bold text-white shadow"
                >
                  胡！
                </button>
              )}
              {myClaim.kong && (
                <button
                  type="button"
                  onClick={() => setState((s) => scResolveClaim(s, 0, "kong"))}
                  className="rounded-full bg-purple-600 px-6 py-2 font-bold text-white shadow"
                >
                  槓
                </button>
              )}
              {myClaim.pong && (
                <button
                  type="button"
                  onClick={() => setState((s) => scResolveClaim(s, 0, "pong"))}
                  className="rounded-full bg-sky-600 px-6 py-2 font-bold text-white shadow"
                >
                  碰
                </button>
              )}
              {myClaim.chow.map((pair, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setState((s) => scResolveClaim(s, 0, "chow", pair))}
                  className="rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow"
                >
                  吃 {pair.map((t) => MJ_LABELS[t] ?? t).join("")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setState((s) => scResolveClaim(s, 0, "pass"))}
                className="rounded-full border border-border px-6 py-2 font-bold"
              >
                放過
              </button>
            </>
          )}
          {state.phase === "over" && (
            <button
              type="button"
              onClick={() => setState(scInitial())}
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
