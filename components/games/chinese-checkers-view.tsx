"use client"

import { useEffect, useMemo, useState } from "react"
import { BoardShell } from "./board-shell"
import { CC_CELLS, ccEmpty, ccMovesFrom, ccApply, ccBestMove, type CCState } from "@/lib/games/chinese-checkers"
import { applyDifficulty } from "@/lib/games/difficulty"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

const CELL_R = 15
const SQRT3 = Math.sqrt(3)

function pixelOf(x: number, z: number) {
  // 使用軸向座標 q=x, r=z 的尖頂六角格排版
  const px = CELL_R * (SQRT3 * x + (SQRT3 / 2) * z)
  const py = CELL_R * (1.5 * z)
  return { px, py }
}

const POINTS = CC_CELLS.map((c) => pixelOf(c.x, c.z))
const MIN_X = Math.min(...POINTS.map((p) => p.px))
const MAX_X = Math.max(...POINTS.map((p) => p.px))
const MIN_Y = Math.min(...POINTS.map((p) => p.py))
const MAX_Y = Math.max(...POINTS.map((p) => p.py))
const PAD = CELL_R * 1.5
const VIEW_W = MAX_X - MIN_X + PAD * 2
const VIEW_H = MAX_Y - MIN_Y + PAD * 2

export function ChineseCheckersView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<CCState>(() => ccEmpty())
  const [selected, setSelected] = useState<number | null>(null)

  const destinations = useMemo(
    () => (selected !== null ? ccMovesFrom(state.board, selected) : []),
    [selected, state.board],
  )

  const restart = () => {
    setState(ccEmpty())
    setSelected(null)
  }

  useEffect(() => {
    if (mode === "ai" && state.turn === 2 && state.status === "playing") {
      const t = setTimeout(() => {
        const best = ccBestMove(state)
        const allMoves = best ? [best] : []
        const move = applyDifficulty(difficulty, best, allMoves)
        if (move) {
          if (soundOn) playMoveSound()
          setState((s) => ccApply(s, move))
        }
        setSelected(null)
      }, 550)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, state, difficulty])

  function handleTap(i: number) {
    if (state.status !== "playing") return
    if (mode === "ai" && state.turn === 2) return
    if (selected !== null && destinations.includes(i)) {
      if (soundOn) playMoveSound()
      setState((s) => ccApply(s, { from: selected, to: i }))
      setSelected(null)
      return
    }
    if (state.board[i] === state.turn) {
      setSelected(i)
    } else {
      setSelected(null)
    }
  }

  const result = state.status === "win" ? (state.winner === 1 ? "win" : mode === "ai" ? "loss" : "loss") : null
  const statusText =
    state.status === "win"
      ? state.winner === 1
        ? "所有棋子安全抵達，您獲勝！"
        : mode === "ai"
          ? "AI 已將全部棋子送達，AI 獲勝"
          : "玩家二獲勝"
      : state.turn === 1
        ? "您的回合（左方）"
        : mode === "ai"
          ? "AI 思考中…"
          : "玩家二回合（右方）"

  return (
    <BoardShell
      gameId="chinese-checkers"
      title="中國跳棋"
      subtitle="六角星盤．雙人對戰"
      status={statusText}
      result={result}
      rulesBrief="輪流移動己方棋子，每次可走一步至相鄰空格，或連續跳過棋子（己方或對方皆可）落於空格；最先將全部10顆棋子移至對面星角者獲勝。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div className="w-[min(94vw,380px)] shrink-0">
        <svg
          viewBox={`${MIN_X - PAD} ${MIN_Y - PAD} ${VIEW_W} ${VIEW_H}`}
          className="w-full rounded-xl border border-border bg-[#1a2e22]"
        >
          {CC_CELLS.map((c, i) => {
            const { px, py } = POINTS[i]
            const value = state.board[i]
            const isSel = selected === i
            const isDest = destinations.includes(i)
            return (
              <g key={i} onClick={() => handleTap(i)} className="cursor-pointer">
                <circle
                  cx={px}
                  cy={py}
                  r={CELL_R * 0.42}
                  fill={isDest ? "rgba(250,204,21,0.35)" : "#0f1f16"}
                  stroke={isSel ? "#facc15" : isDest ? "#facc15" : "#2f4a38"}
                  strokeWidth={isSel || isDest ? 2 : 1}
                />
                {value !== 0 && (
                  <circle
                    cx={px}
                    cy={py}
                    r={CELL_R * 0.34}
                    fill={value === 1 ? "#dc2626" : "#2563eb"}
                    stroke={value === 1 ? "#7f1d1d" : "#1e3a8a"}
                    strokeWidth={1.5}
                  />
                )}
              </g>
            )
          })}
        </svg>
      </div>
    </BoardShell>
  )
}
