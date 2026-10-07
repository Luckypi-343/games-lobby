"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { kmNew, kmMove, kmCanMove, KM_COLS, KM_ROWS, KM_TARGET_ID, type KmState, type KmPieceId } from "@/lib/games/klotski"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

// 立體豪華型積木：每顆木塊用漸層＋內凹邊框＋立體陰影做出浮雕木紋質感，
// 取代原本扁平單色的方塊，不同角色（曹操／將／兵／卒）各有自己的木質色調。
const PIECE_GRADIENT: Record<KmPieceId, string> = {
  A: "linear-gradient(155deg, #f3c56a 0%, #d79a2e 45%, #a66c12 100%)",
  B: "linear-gradient(155deg, #e8a0a0 0%, #c85d5d 45%, #9c3a3a 100%)",
  C: "linear-gradient(155deg, #e8a0a0 0%, #c85d5d 45%, #9c3a3a 100%)",
  D: "linear-gradient(155deg, #9fc9e8 0%, #5d93c8 45%, #3a6a9c 100%)",
  E: "linear-gradient(155deg, #9fc9e8 0%, #5d93c8 45%, #3a6a9c 100%)",
  F: "linear-gradient(155deg, #9fc9e8 0%, #5d93c8 45%, #3a6a9c 100%)",
  G: "linear-gradient(155deg, #b9c9b0 0%, #7fa070 45%, #597a4c 100%)",
  H: "linear-gradient(155deg, #b9c9b0 0%, #7fa070 45%, #597a4c 100%)",
  I: "linear-gradient(155deg, #b9c9b0 0%, #7fa070 45%, #597a4c 100%)",
  J: "linear-gradient(155deg, #b9c9b0 0%, #7fa070 45%, #597a4c 100%)",
}

const PIECE_LABEL: Record<KmPieceId, string> = {
  A: "曹操",
  B: "將",
  C: "將",
  D: "兵",
  E: "兵",
  F: "兵",
  G: "卒",
  H: "卒",
  I: "卒",
  J: "卒",
}

export function KlotskiView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<KmState>(() => kmNew())
  const [selected, setSelected] = useState<KmPieceId | null>("A")

  const restart = () => {
    setState(kmNew())
    setSelected("A")
  }

  const move = (dx: number, dy: number) => {
    if (!selected) return
    setState((s) => {
      if (!kmCanMove(s, selected, dx, dy)) return s
      if (soundOn) playMoveSound()
      return kmMove(s, selected, dx, dy)
    })
  }

  const cell = 100 / KM_COLS

  return (
    <PuzzleShell
      gameId="klotski"
      title="華容道"
      subtitle="移動曹操到出口"
      status={`步數：${state.moves}　選中：${selected ? PIECE_LABEL[selected] : "無"}`}
      rulesBrief="點選任一方塊選中它，再用方向鍵移動。目標是把最大的「曹操」方塊移到最下方中間的出口。"
      solved={state.won}
      cost={10}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="relative rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ width: 260, height: 260 * (KM_ROWS / KM_COLS) }}
      >
        {/* 出口標示 */}
        <div
          className="absolute rounded-b-lg border-2 border-dashed border-primary/50"
          style={{
            left: `${cell * 1}%`,
            top: `${(100 / KM_ROWS) * (KM_ROWS - 0.15)}%`,
            width: `${cell * 2}%`,
            height: "4%",
          }}
        />
        {state.pieces.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelected(p.id)}
            className={`absolute flex items-center justify-center rounded-xl text-xs font-bold text-white transition-all active:scale-95 ${
              selected === p.id ? "ring-2 ring-foreground ring-offset-1" : ""
            } ${p.id === KM_TARGET_ID ? "font-serif text-sm" : ""}`}
            style={{
              left: `${p.x * cell}%`,
              top: `${p.y * (100 / KM_ROWS)}%`,
              width: `${p.w * cell - 3}%`,
              height: `${p.h * (100 / KM_ROWS) - 3}%`,
              margin: "1.5%",
              backgroundImage: PIECE_GRADIENT[p.id],
              boxShadow:
                "inset 0 2px 1px rgba(255,255,255,0.55), inset 0 -3px 4px rgba(0,0,0,0.35), 0 3px 5px rgba(0,0,0,0.4)",
              border: "1px solid rgba(0,0,0,0.25)",
              textShadow: "0 1px 2px rgba(0,0,0,0.6)",
            }}
          >
            {PIECE_LABEL[p.id]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        <div />
        <button
          onClick={() => move(0, -1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => move(-1, 0)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ←
        </button>
        <button
          onClick={() => move(0, 1)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          ↓
        </button>
        <button
          onClick={() => move(1, 0)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-bold text-muted-foreground active:scale-90"
        >
          →
        </button>
      </div>
    </PuzzleShell>
  )
}
