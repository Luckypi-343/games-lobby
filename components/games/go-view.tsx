"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import { GO_SIZE, goEmpty, goMove, goPass, goAiMove, goScore, type GOState } from "@/lib/games/go"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"

const STAR_POINTS = new Set(
  [3, 9, 15].flatMap((r) => [3, 9, 15].map((c) => r * GO_SIZE + c)),
)

export function GoView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<GOState>(goEmpty())

  useEffect(() => {
    if (mode === "ai" && state.turn === 2 && state.status === "playing") {
      const t = setTimeout(() => {
        const move = goAiMove(state)
        setState((s) => {
          if (move === "pass") return goPass(s)
          const before = s.captures[1] + s.captures[2]
          const next = goMove(s, move)
          if (soundOn) (next.captures[1] + next.captures[2] > before ? playCaptureSound() : playMoveSound())
          return next
        })
      }, 550)
      return () => clearTimeout(t)
    }
  }, [mode, state])

  const restart = () => setState(goEmpty())
  const score = state.status === "over" ? goScore(state) : null
  const result =
    state.status === "over" && score
      ? score[1] > score[2]
        ? "win"
        : score[1] < score[2]
          ? "loss"
          : "draw"
      : null

  const statusText =
    state.status === "over"
      ? score
        ? score[1] > score[2]
          ? `對局結束 · 黑 ${score[1].toFixed(1)} 勝 白 ${score[2].toFixed(1)}`
          : `對局結束 · 白 ${score[2].toFixed(1)} 勝 黑 ${score[1].toFixed(1)}`
        : "對局結束"
      : `${state.turn === 1 ? "黑棋" : "白棋"}回合 · 提子 黑${state.captures[1]} 白${state.captures[2]}${
          mode === "ai" && state.turn === 2 ? " · AI 思考中…" : ""
        }`

  return (
    <BoardShell
      gameId="go"
      title="中國圍棋"
      subtitle="19×19 標準格式"
      status={statusText}
      result={result}
      showDifficulty={false}
      rulesBrief="輪流在交叉點放置黑白棋子，圍地面積較多者獲勝；沒有氣（周圍完全被包圍）的棋子會被提走。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        setState(goEmpty())
      }}
      extraAction={
        state.status === "playing" && !(mode === "ai" && state.turn === 2) ? (
          <button
            onClick={() => setState((s) => goPass(s))}
            className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground"
          >
            虛手（Pass）
          </button>
        ) : undefined
      }
    >
      <div className="w-[min(94vw,380px)] shrink-0 overflow-x-auto">
        <div
          className="mx-auto grid rounded-lg border border-amber-800 bg-amber-200 p-1"
          style={{ gridTemplateColumns: `repeat(${GO_SIZE}, minmax(0, 1fr))`, width: "min(94vw, 380px)" }}
        >
          {state.board.map((cell, i) => {
            const disabled = state.status !== "playing" || (mode === "ai" && state.turn === 2)
            return (
              <button
                key={i}
                onClick={() =>
                  !disabled &&
                  setState((s) => {
                    const before = s.captures[1] + s.captures[2]
                    const next = goMove(s, i)
                    if (soundOn) (next.captures[1] + next.captures[2] > before ? playCaptureSound() : playMoveSound())
                    return next
                  })
                }
                className="relative flex aspect-square items-center justify-center"
              >
                <span className="absolute inset-0 border-r border-b border-amber-800/50" />
                {STAR_POINTS.has(i) && cell === 0 && (
                  <span className="absolute h-1 w-1 rounded-full bg-amber-900" />
                )}
                {cell !== 0 && (
                  <span
                    className={`relative z-10 h-[85%] w-[85%] rounded-full shadow ${
                      cell === 1 ? "bg-neutral-900" : "border border-neutral-400 bg-neutral-50"
                    }`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </BoardShell>
  )
}
