"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "@/components/games/board-shell"
import { MahjongTileFace } from "@/components/games/mahjong-tile"
import {
  solInitial,
  solSelect,
  solTick,
  solFindHint,
  solReshuffle,
  ROWS,
  COLS,
  TIME_LIMIT,
  type SolState,
} from "@/lib/games/mahjong-solitaire"

const GAME_ID = "mahjong-solitaire"

const RULES =
  "麻將連連看：將一副麻將牌（筒子/索子/萬子/字牌共34種圖案）排成6列×8欄共48張、24對。點選兩張圖案相同的牌，若之間的連線路徑（可穿過已消除的空格或盤面外一格）轉折不超過兩次，就能消除這一對。盤面全部清空獲勝；時間（180秒）用完還沒清完則挑戰失敗。卡關時可用「提示」找出一組可消的牌，或「洗牌」重新排列剩下的牌。"

export function MahjongSolitaireView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const [state, setState] = useState<SolState>(() => solInitial())
  const [hint, setHint] = useState<[[number, number], [number, number]] | null>(null)
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setState((s) => solTick(s))
    }, 1000)
    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [])

  function handleRestart() {
    setState(solInitial())
    setHint(null)
  }

  function handleCellClick(r: number, c: number) {
    setHint(null)
    setState((s) => solSelect(s, r, c))
  }

  function handleHint() {
    const found = solFindHint(state)
    setHint(found)
  }

  function handleReshuffle() {
    setState((s) => solReshuffle(s))
    setHint(null)
  }

  const outcome: PuzzleOutcome = state.status === "won" ? "win" : state.status === "lost" ? "loss" : null
  const mins = Math.floor(state.secondsLeft / 60)
  const secs = state.secondsLeft % 60
  const remaining = state.grid.flat().filter((cell) => cell && !cell.matched).length

  function isHinted(r: number, c: number) {
    if (!hint) return false
    return (hint[0][0] === r && hint[0][1] === c) || (hint[1][0] === r && hint[1][1] === c)
  }

  return (
    <BoardShell
      gameId={GAME_ID}
      title="麻將連連看"
      subtitle="找出相同圖案，轉折不超過兩次"
      status={`剩餘 ${remaining} 張 · ⏱ ${mins}:${secs.toString().padStart(2, "0")} · 已消 ${state.moves} 組`}
      rulesBrief={RULES}
      result={outcome}
      onBack={onLobby}
      onRestart={handleRestart}
      mode="single"
      showBookButton
      extraAction={
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleHint}
            className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold text-amber-950 active:scale-95"
          >
            提示
          </button>
          <button
            type="button"
            onClick={handleReshuffle}
            className="rounded-full bg-sky-500 px-3 py-1 text-[11px] font-semibold text-sky-950 active:scale-95"
          >
            洗牌
          </button>
        </div>
      }
    >
      <div
        className="grid gap-1 rounded-xl bg-emerald-900/30 p-2"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
      >
        {state.grid.map((row, r) =>
          row.map((cell, c) => {
            const selected = state.selected && state.selected[0] === r && state.selected[1] === c
            if (!cell || cell.matched) {
              return <div key={`${r}-${c}`} className="aspect-[5/7]" />
            }
            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleCellClick(r, c)}
                className={`flex aspect-[5/7] items-center justify-center rounded transition-transform active:scale-90 ${
                  selected ? "-translate-y-1 ring-2 ring-amber-400" : ""
                } ${isHinted(r, c) ? "ring-2 ring-emerald-400" : ""}`}
              >
                <MahjongTileFace tile={cell.tile} small />
              </button>
            )
          }),
        )}
      </div>
    </BoardShell>
  )
}
