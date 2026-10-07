"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import { MahjongTileFace } from "@/components/games/mahjong-tile"
import {
  msDeal,
  msPlayTile,
  msCoverTile,
  msBotAct,
  msPlayableTiles,
  msScore,
  MS_PLAYER_NAMES,
  MS_SUIT_LABEL,
  type MSState,
  type MSTile,
  type MSSuit,
} from "@/lib/games/mahjong-sevens"

const GAME_ID = "mahjong-sevens"
const SUIT_COLOR: Record<MSSuit, string> = {
  t: "text-sky-600 dark:text-sky-400",
  s: "text-emerald-600 dark:text-emerald-400",
  w: "text-rose-600 dark:text-rose-400",
}

function Tile({ t, onClick, playable }: { t: MSTile; onClick?: () => void; playable?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`rounded-[5px] transition-transform ${playable ? "" : "opacity-60"} ${
        onClick ? "active:scale-95 active:-translate-y-1" : ""
      }`}
    >
      <MahjongTileFace tile={`${t.suit}${t.num}`} />
    </button>
  )
}

// 每個花色的「已接龍牌堆」改用縮小版的仿真麻將牌面顯示，取代原本的文字色塊，
// 讓牌堆看起來跟真實麻將牌一致，同時維持縮小尺寸不佔用太多版面。
function TrackRow({ suit, state }: { suit: MSSuit; state: MSState }) {
  const track = state.tracks[suit]
  const cells: number[] = []
  if (track.opened) for (let n = track.low; n <= track.high; n++) cells.push(n)
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-6 text-center text-xs font-bold ${SUIT_COLOR[suit]}`}>{MS_SUIT_LABEL[suit]}</span>
      <div className="flex flex-1 gap-1 overflow-x-auto rounded-lg bg-black/10 p-1">
        {!track.opened ? (
          <span className="px-2 py-1 text-[10px] text-muted-foreground">等待 5{MS_SUIT_LABEL[suit]} 開局</span>
        ) : (
          cells.map((n) => (
            <div key={n} className={n === 5 ? "scale-105 drop-shadow-[0_0_4px_oklch(0.8_0.17_88_/_0.7)]" : ""}>
              <MahjongTileFace tile={`${suit}${n}`} small />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export function MahjongSevensView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const [state, setState] = useState<MSState>(() => msDeal())
  const botTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (botTimer.current) clearTimeout(botTimer.current)
    if (state.status !== "playing" || state.turn === 0 || state.finished[state.turn]) return
    botTimer.current = setTimeout(() => setState((s) => msBotAct(s, s.turn)), 600)
    return () => {
      if (botTimer.current) clearTimeout(botTimer.current)
    }
  }, [state])

  const myTurn = state.turn === 0 && state.status === "playing" && !state.finished[0]
  const myOptions = msPlayableTiles(state, 0)
  const mustCover = myTurn && myOptions.length === 0

  const scores = state.status === "over" ? msScore(state) : null
  const result: PuzzleOutcome =
    state.status !== "over" || !scores
      ? null
      : scores[0].points === Math.min(...scores.map((s) => s.points))
        ? "win"
        : "loss"

  return (
    <BoardShell
      gameId={GAME_ID}
      title="麻將接龍"
      subtitle="仿照排七規則，以五筒、五索、五萬為基準開局，依序接龍相鄰數字，無牌可接須蓋牌扣分。"
      status={
        state.status === "over"
          ? "本局結束"
          : mustCover
            ? "你無牌可接，請選擇一張手牌蓋下"
            : myTurn
              ? "輪到你，請出一張可接的牌"
              : `等待 ${MS_PLAYER_NAMES[state.turn]} 行動…`
      }
      mode="ai"
      onBack={onLobby}
      onRestart={() => setState(msDeal())}
      result={result}
      showDifficulty={false}
    >
      <div className="flex w-full flex-col gap-3 px-3 pb-4">
        <div className="flex flex-col gap-1.5 rounded-lg border border-border/60 bg-card/40 p-2">
          <TrackRow suit="t" state={state} />
          <TrackRow suit="s" state={state} />
          <TrackRow suit="w" state={state} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1 rounded-lg border border-border/60 bg-card/60 p-2">
              <span className="text-xs font-semibold text-muted-foreground">{MS_PLAYER_NAMES[i]}</span>
              <span className="text-xs">手牌 {state.hands[i].length}</span>
              <span className="text-xs text-muted-foreground">蓋牌 {state.covered[i].length}</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-card/40 p-2 text-center text-xs text-muted-foreground">
          {state.log[0]}
        </div>

        {state.status === "over" && scores && (
          <div className="flex flex-col gap-1 rounded-xl border border-amber-400 bg-amber-50 p-3 dark:bg-amber-950">
            {scores
              .slice()
              .sort((a, b) => a.points - b.points)
              .map((row, rank) => (
                <div key={row.seat} className="flex items-center justify-between text-sm">
                  <span className="font-semibold">
                    {rank === 0 ? "🏆 " : ""}
                    {row.name}
                  </span>
                  <span className={row.perfect ? "font-bold text-emerald-600" : ""}>
                    {row.perfect ? "完美出牌！0分" : `扣 ${row.points} 分`}
                  </span>
                </div>
              ))}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1">
          {state.hands[0].map((t) => (
            <Tile
              key={t.id}
              t={t}
              playable={myOptions.some((o) => o.id === t.id) || mustCover}
              onClick={
                myTurn
                  ? mustCover
                    ? () => setState((s) => msCoverTile(s, 0, t))
                    : myOptions.some((o) => o.id === t.id)
                      ? () => setState((s) => msPlayTile(s, 0, t))
                      : undefined
                  : undefined
              }
            />
          ))}
        </div>

        {state.covered[0].length > 0 && (
          <div className="flex flex-wrap justify-center gap-1">
            <span className="w-full text-center text-xs text-muted-foreground">我的蓋牌</span>
            {state.covered[0].map((t, i) => (
              <div
                key={i}
                className="flex h-10 w-8 items-center justify-center rounded-md border-2 border-neutral-600 bg-gradient-to-b from-neutral-700 to-neutral-800 text-xs text-neutral-300"
              >
                🀫
              </div>
            ))}
          </div>
        )}
      </div>
    </BoardShell>
  )
}
