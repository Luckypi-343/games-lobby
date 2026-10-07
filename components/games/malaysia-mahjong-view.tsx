"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import { MahjongTileFace } from "@/components/games/mahjong-tile"
import {
  mwInitial,
  mwDraw,
  mwSelfHu,
  mwDiscard,
  mwResolveClaim,
  mwBotChoice,
  mwBotDiscard,
  mwIsWinningHand,
  mwLabel,
  type MWState,
  type MWTile,
} from "@/lib/games/malaysia-mahjong"

const GAME_ID = "malaysia-mahjong"

function Tile({ t, onClick, selected }: { t: MWTile; onClick?: () => void; selected?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`shrink-0 rounded-[5px] transition-transform ${selected ? "-translate-y-2 ring-2 ring-emerald-500" : ""} ${
        onClick ? "active:scale-95" : ""
      }`}
    >
      <MahjongTileFace tile={t} />
    </button>
  )
}

export function MalaysiaMahjongView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const [state, setState] = useState<MWState>(() => mwInitial())
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (botTimer.current) clearTimeout(botTimer.current)
    if (state.phase === "over") return

    if (state.phase === "claim") {
      const pending = state.claimOptions.find((o) => o.seat !== 0)
      if (pending) {
        botTimer.current = setTimeout(() => {
          const choice = mwBotChoice(state, pending.seat)
          setState((s) => mwResolveClaim(s, pending.seat, choice.action, choice.chowPair))
        }, 550)
      }
      return () => {
        if (botTimer.current) clearTimeout(botTimer.current)
      }
    }

    if (state.turn === 0) return
    botTimer.current = setTimeout(() => {
      if (state.phase === "draw") {
        setState((s) => mwDraw(s))
      } else if (state.phase === "discard") {
        setState((s) => {
          const p = s.players[s.turn]
          if (mwIsWinningHand(p.hand)) return mwSelfHu(s)
          return mwDiscard(s, mwBotDiscard(p.hand))
        })
      }
    }, 600)
    return () => {
      if (botTimer.current) clearTimeout(botTimer.current)
    }
  }, [state])

  const me = state.players[0]
  const myTurn = state.turn === 0 && state.phase !== "over"
  const myClaim = state.claimOptions.find((o) => o.seat === 0)
  const iCanSelfHu = myTurn && state.phase === "discard" && mwIsWinningHand(me.hand)

  const result: PuzzleOutcome = state.phase !== "over" ? null : state.winner === 0 ? "win" : "loss"

  return (
    <BoardShell
      gameId={GAME_ID}
      title="馬來西亞三聯麻將"
      subtitle="三人對戰，牌庫只保留筒子、字牌、花牌，並加入飛牌（萬能牌）。牌數少、花牌多，容易湊出大牌。"
      status={
        state.phase === "over"
          ? "本局結束"
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
      onRestart={() => setState(mwInitial())}
      result={result}
      showDifficulty={false}
    >
      <div className="flex w-full flex-col gap-3 px-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-2">
              <span className="text-xs font-semibold text-muted-foreground">{state.players[i].name}</span>
              <span className="text-xs">手牌 {state.players[i].hand.length}</span>
              <div className="flex flex-wrap gap-0.5">
                {state.players[i].melds.map((m, mi) => (
                  <span key={mi} className="text-sm">
                    {m.tiles.map((t) => mwLabel(t)).join("")}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-card/40 p-2 text-center text-xs text-muted-foreground">{state.log}</div>

        {state.phase === "over" && (
          <div className="rounded-xl border border-amber-400 bg-amber-50 p-3 text-center font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {state.winner !== null ? `${state.players[state.winner].name} 胡牌獲勝！` : "牌摸完，流局"}
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">我的手牌（粉紅色＝飛牌萬能牌）</span>
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
                onClick={myTurn && state.phase === "discard" ? () => setState((s) => mwDiscard(s, t)) : undefined}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {myTurn && state.phase === "draw" && (
            <button
              type="button"
              onClick={() => setState((s) => mwDraw(s))}
              className="rounded-full bg-emerald-600 px-6 py-2 font-bold text-white shadow"
            >
              摸牌
            </button>
          )}
          {iCanSelfHu && (
            <button
              type="button"
              onClick={() => setState((s) => mwSelfHu(s))}
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
                  onClick={() => setState((s) => mwResolveClaim(s, 0, "hu"))}
                  className="rounded-full bg-rose-600 px-6 py-2 font-bold text-white shadow"
                >
                  胡！
                </button>
              )}
              {myClaim.kong && (
                <button
                  type="button"
                  onClick={() => setState((s) => mwResolveClaim(s, 0, "kong"))}
                  className="rounded-full bg-purple-600 px-6 py-2 font-bold text-white shadow"
                >
                  槓
                </button>
              )}
              {myClaim.pong && (
                <button
                  type="button"
                  onClick={() => setState((s) => mwResolveClaim(s, 0, "pong"))}
                  className="rounded-full bg-sky-600 px-6 py-2 font-bold text-white shadow"
                >
                  碰
                </button>
              )}
              {myClaim.chow.map((pair, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setState((s) => mwResolveClaim(s, 0, "chow", pair))}
                  className="rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow"
                >
                  吃 {pair.map((t) => mwLabel(t)).join("")}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setState((s) => mwResolveClaim(s, 0, "pass"))}
                className="rounded-full border border-border px-6 py-2 font-bold"
              >
                放過
              </button>
            </>
          )}
          {state.phase === "over" && (
            <button
              type="button"
              onClick={() => setState(mwInitial())}
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
