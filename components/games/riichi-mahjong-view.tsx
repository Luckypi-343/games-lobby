"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import { MahjongTileFace } from "@/components/games/mahjong-tile"
import {
  rmInitial,
  rmNextHand,
  rmDraw,
  rmSelfHu,
  rmDiscard,
  rmResolveClaim,
  rmBotChoice,
  rmBotAct,
  rmCanDeclareRiichi,
  rmArmRiichi,
  rmWaitingTiles,
  MJ_LABELS,
  type RMState,
  type MJTile,
} from "@/lib/games/riichi-mahjong"
import { isWinningHand } from "@/lib/games/mahjong"

const GAME_ID = "riichi-mahjong"

function Tile({ t, onClick, selected, dim }: { t: MJTile; onClick?: () => void; selected?: boolean; dim?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`shrink-0 rounded-[5px] transition-transform ${selected ? "-translate-y-2 ring-2 ring-emerald-500" : ""} ${
        dim ? "opacity-40" : ""
      } ${onClick ? "active:scale-95" : ""}`}
    >
      <MahjongTileFace tile={t} />
    </button>
  )
}

export function RiichiMahjongView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const [state, setState] = useState<RMState>(() => rmInitial())
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (botTimer.current) clearTimeout(botTimer.current)
    if (state.phase === "over") return

    if (state.phase === "claim") {
      const pending = state.claimOptions.find((o) => o.seat !== 0)
      if (pending) {
        botTimer.current = setTimeout(() => {
          const choice = rmBotChoice(state, pending.seat)
          setState((s) => rmResolveClaim(s, pending.seat, choice.action, choice.chowPair))
        }, 550)
      }
      return () => {
        if (botTimer.current) clearTimeout(botTimer.current)
      }
    }

    if (state.turn === 0) return
    botTimer.current = setTimeout(() => {
      if (state.phase === "draw") setState((s) => rmDraw(s))
      else if (state.phase === "discard") setState((s) => rmBotAct(s, s.turn))
    }, 600)
    return () => {
      if (botTimer.current) clearTimeout(botTimer.current)
    }
  }, [state])

  const me = state.players[0]
  const myTurn = state.turn === 0 && state.phase !== "over"
  const myClaim = state.claimOptions.find((o) => o.seat === 0)
  const iCanSelfHu = myTurn && state.phase === "discard" && isWinningHand(me.hand)
  const canRiichi = rmCanDeclareRiichi(state)
  const myWaits = state.phase !== "over" ? rmWaitingTiles(me.hand.length === 13 ? me.hand : me.hand.slice(0, -1)) : []

  const result: PuzzleOutcome =
    state.phase !== "over" || !state.result ? null : state.result.winner === 0 ? "win" : state.result.loser === 0 ? "loss" : state.result.draw ? "draw" : "loss"

  return (
    <BoardShell
      gameId={GAME_ID}
      title="日本立直麻將"
      subtitle="東風戰簡化版：4人標準136張牌，含立直宣告、寶牌加番、振聽防守、無役不能胡。計分為簡化版（固定視為30符），略過一發／裏寶牌等細節。"
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
      onRestart={() => setState(rmInitial())}
      result={result}
      showDifficulty={false}
    >
      <div className="flex w-full flex-col gap-3 px-3 pb-4">
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 p-2 text-xs dark:bg-amber-950">
          <span>第{state.handNumber}局</span>
          <span>｜寶牌指示 {MJ_LABELS[state.doraIndicator]}（寶牌＝{MJ_LABELS[state.dora]}）</span>
          <span>｜立直棒 {state.riichiPot / 1000}</span>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center text-xs">
          {state.players.map((p) => (
            <div
              key={p.seat}
              className={`flex flex-col items-center gap-0.5 rounded-lg border p-1.5 ${
                state.turn === p.seat && state.phase !== "over" ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950" : "border-border/60 bg-card/60"
              }`}
            >
              <span className="font-semibold">
                {p.name}
                {p.seat === state.dealer ? "（莊）" : ""}
              </span>
              <span>{p.score}點</span>
              {p.riichi && <span className="font-bold text-rose-600">立直中</span>}
              <span className="text-muted-foreground">手牌{p.hand.length}</span>
            </div>
          ))}
        </div>

        {/* 牌山（待摸牌堆）剩餘張數：四家摸牌都從同一座牌山扣減，讓玩家知道這一局還能摸幾張。 */}
        <div className="flex items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-card/40 p-2 text-xs text-muted-foreground">
          <span className="flex h-6 w-5 items-center justify-center rounded-[3px] border-2 border-neutral-500 bg-gradient-to-b from-neutral-600 to-neutral-700" />
          <span>牌山剩餘 {state.wall.length} 張</span>
        </div>

        {/* 四家棄牌堆：每家打出去的牌依序排列顯示，縮小版仿真牌面，方便追蹤已出過哪些牌。 */}
        <div className="grid grid-cols-2 gap-2">
          {state.players.map((p) => (
            <div key={p.seat} className="flex flex-col gap-1 rounded-lg border border-border/60 bg-black/10 p-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground">
                {p.name}
                {p.seat === state.dealer ? "（莊）" : ""} 棄牌 {p.discards.length}
              </span>
              <div className="flex flex-wrap gap-0.5">
                {p.discards.length === 0 ? (
                  <span className="px-1 py-0.5 text-[9px] text-muted-foreground">尚未出牌</span>
                ) : (
                  p.discards.map((t, i) => <MahjongTileFace key={i} tile={t} small />)
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-card/40 p-2 text-center text-xs text-muted-foreground">{state.log}</div>

        {state.phase === "over" && state.result && (
          <div className="rounded-xl border border-amber-400 bg-amber-50 p-3 text-center dark:bg-amber-950">
            {state.result.draw ? (
              <p className="font-bold text-amber-700 dark:text-amber-300">流局！聽牌者收取不聽罰符。</p>
            ) : (
              <>
                <p className="font-bold text-amber-700 dark:text-amber-300">
                  {state.players[state.result.winner!].name} {state.result.tsumo ? "自摸" : "胡牌"}！{state.result.points}點
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{state.result.han}番：{state.result.yaku.join("、")}</p>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                const dealerWon = state.result?.winner === state.dealer
                const dealerTenpai = state.result?.draw && rmWaitingTiles(state.players[state.dealer].hand).length > 0
                setState(rmNextHand(state, Boolean(dealerWon || dealerTenpai)))
              }}
              className="mt-2 rounded-full bg-amber-600 px-6 py-2 font-bold text-white shadow"
            >
              下一局
            </button>
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">
            我的手牌{me.riichi ? "（已立直，只能摸切）" : ""}
            {myWaits.length > 0 && !me.riichi ? `　聽牌中：${myWaits.map((t) => MJ_LABELS[t]).join(" ")}` : ""}
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
                dim={me.riichi && t !== state.drawn}
                onClick={
                  myTurn && state.phase === "discard" && (!me.riichi || t === state.drawn) ? () => setState((s) => rmDiscard(s, t)) : undefined
                }
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {myTurn && state.phase === "draw" && (
            <button type="button" onClick={() => setState((s) => rmDraw(s))} className="rounded-full bg-emerald-600 px-6 py-2 font-bold text-white shadow">
              摸牌
            </button>
          )}
          {iCanSelfHu && (
            <button type="button" onClick={() => setState((s) => rmSelfHu(s))} className="rounded-full bg-rose-600 px-6 py-2 font-bold text-white shadow">
              自摸胡牌！
            </button>
          )}
          {canRiichi && !state.riichiArmed && (
            <button type="button" onClick={() => setState((s) => rmArmRiichi(s))} className="rounded-full bg-purple-600 px-6 py-2 font-bold text-white shadow">
              宣告立直
            </button>
          )}
          {myClaim && (
            <>
              {myClaim.ron && (
                <button type="button" onClick={() => setState((s) => rmResolveClaim(s, 0, "ron"))} className="rounded-full bg-rose-600 px-6 py-2 font-bold text-white shadow">
                  胡！
                </button>
              )}
              {myClaim.kong && (
                <button type="button" onClick={() => setState((s) => rmResolveClaim(s, 0, "kong"))} className="rounded-full bg-purple-600 px-6 py-2 font-bold text-white shadow">
                  槓
                </button>
              )}
              {myClaim.pong && (
                <button type="button" onClick={() => setState((s) => rmResolveClaim(s, 0, "pong"))} className="rounded-full bg-sky-600 px-6 py-2 font-bold text-white shadow">
                  碰
                </button>
              )}
              {myClaim.chow.map((pair, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setState((s) => rmResolveClaim(s, 0, "chow", pair))}
                  className="rounded-full bg-teal-600 px-4 py-2 text-sm font-bold text-white shadow"
                >
                  吃 {pair.map((t) => MJ_LABELS[t]).join("")}
                </button>
              ))}
              <button type="button" onClick={() => setState((s) => rmResolveClaim(s, 0, "pass"))} className="rounded-full border border-border px-6 py-2 font-bold">
                放過
              </button>
            </>
          )}
        </div>
      </div>
    </BoardShell>
  )
}
