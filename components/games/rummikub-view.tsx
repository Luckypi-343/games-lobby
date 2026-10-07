"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import {
  rkInitial,
  rkIsValidMeld,
  rkPlayMeld,
  rkDrawAndPass,
  rkFindMeld,
  COLOR_HEX,
  COLOR_SUIT,
  rkRankLabel,
  type RKState,
  type RKTile,
} from "@/lib/games/rummikub"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

// 仿真牌面的拉密牌：跟撲克牌一樣用米黃牌面、立體邊框與雙角索引，中央放大顯示點數與花色，
// 取代原本過於簡易的白底小方塊，四種顏色（紅心／方塊／梅花／黑桃）維持原本配色規則。
function Tile({ tile, selected, onClick, dim }: { tile: RKTile; selected?: boolean; onClick?: () => void; dim?: boolean }) {
  const color = COLOR_HEX[tile.color]
  const label = rkRankLabel(tile.number)
  const suit = COLOR_SUIT[tile.color]
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`relative flex h-16 w-11 shrink-0 rounded-md border-2 border-neutral-300 shadow-md transition ${
        selected ? "-translate-y-2 border-accent ring-2 ring-accent" : ""
      } ${dim ? "opacity-50" : ""}`}
      style={{ background: "linear-gradient(135deg, #fffdf7 0%, #f7f1e2 100%)" }}
    >
      <span className="absolute left-[3px] top-[2px] flex flex-col items-center text-[9px] font-bold leading-none" style={{ color }}>
        <span>{label}</span>
        <span className="text-[10px]">{suit}</span>
      </span>
      <span
        className="absolute bottom-[2px] right-[3px] flex flex-col items-center text-[9px] font-bold leading-none"
        style={{ color, transform: "rotate(180deg)" }}
      >
        <span>{label}</span>
        <span className="text-[10px]">{suit}</span>
      </span>
      <span className="absolute inset-0 flex items-center justify-center text-xl font-black" style={{ color }}>
        {label}
      </span>
    </button>
  )
}

export function RummikubView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<RKState>(() => rkInitial())
  const [selected, setSelected] = useState<string[]>([])

  const restart = () => {
    setState(rkInitial())
    setSelected([])
  }

  function toggleTile(id: string) {
    if (state.turn !== 1 || state.status !== "playing") return
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  function playSelected() {
    if (selected.length < 3) return
    const chosen = state.racks[1].filter((t) => selected.includes(t.id))
    if (!rkIsValidMeld(chosen)) return
    if (soundOn) playMoveSound()
    const next = rkPlayMeld(state, 1, selected)
    setState(next)
    setSelected([])
    if (next.status === "win" && soundOn) playWinSound()
  }

  function drawAndPass() {
    if (soundOn) playMoveSound()
    setState((s) => rkDrawAndPass(s, 1))
    setSelected([])
  }

  useEffect(() => {
    if (state.status !== "playing" || state.turn !== 2) return
    const t = setTimeout(() => {
      const meld = rkFindMeld(state.racks[2])
      if (meld) {
        if (soundOn) playMoveSound()
        const played = rkPlayMeld(state, 2, meld.map((t) => t.id))
        // Keep AI's turn to try playing more melds, then eventually draw
        setState(played)
        if (played.status === "win" && soundOn) playLossSound()
      } else {
        if (soundOn) playMoveSound()
        setState((s) => rkDrawAndPass(s, 2))
      }
    }, 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  const canPlay = selected.length >= 3 && rkIsValidMeld(state.racks[1].filter((t) => selected.includes(t.id)))
  const result = state.status === "win" ? (state.winner === 1 ? "win" : "loss") : null

  const statusText =
    state.status === "win"
      ? state.winner === 1
        ? "恭喜！手牌清空獲勝"
        : "AI 先清空手牌，敗陣"
      : state.turn === 1
        ? `您的回合，手牌 ${state.racks[1].length} 張`
        : "AI 思考中…"

  return (
    <BoardShell
      gameId="rummikub"
      title="拉密牌"
      subtitle="數字拼牌對戰 AI"
      status={statusText}
      result={result}
      rulesBrief="四色撲克牌（紅心♥／方塊♦／梅花♣／黑桃♠）：從手牌中選出至少3張牌，同花色連續點數（順子）或同點數不同花色（同花）即可點「出牌」放上桌面；若無法組合，點「摸牌」補一張並換對方回合；先清空手牌者獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode="single"
    >
      <div className="flex w-[min(94vw,420px)] shrink-0 flex-col gap-3">
        <div className="rounded-lg border border-border bg-muted/30 p-2">
          <p className="mb-1 text-[10px] font-semibold text-muted-foreground">桌面已出牌組（{state.table.length}）</p>
          <div className="flex max-h-32 flex-col gap-1 overflow-y-auto">
            {state.table.length === 0 && <p className="text-[10px] text-muted-foreground">尚無牌組</p>}
            {state.table.map((meld, i) => (
              <div key={i} className="flex gap-1">
                {meld.map((t) => (
                  <Tile key={t.id} tile={t} />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <span>AI 手牌：{state.racks[2].length} 張</span>
          <span>牌堆剩餘：{state.deck.length} 張</span>
        </div>

        <div className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-card p-2">
          {state.racks[1]
            .slice()
            .sort((a, b) => a.color - b.color || a.number - b.number)
            .map((t) => (
              <Tile key={t.id} tile={t} selected={selected.includes(t.id)} onClick={() => toggleTile(t.id)} />
            ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={playSelected}
            disabled={!canPlay || state.turn !== 1}
            className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground shadow-sm disabled:opacity-40"
          >
            出牌 ({selected.length})
          </button>
          <button
            onClick={drawAndPass}
            disabled={state.turn !== 1}
            className="flex-1 rounded-lg bg-muted py-2.5 text-sm font-bold text-foreground disabled:opacity-40"
          >
            摸牌並結束回合
          </button>
        </div>
      </div>
    </BoardShell>
  )
}
