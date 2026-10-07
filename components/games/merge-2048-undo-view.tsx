"use client"

import { useEffect, useRef, useState } from "react"
import { Undo2 } from "lucide-react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import { dealMerge2048, slide, suggestDirection, maxTile, type Merge2048State } from "@/lib/games/merge-2048"
import { playMoveSound, playCaptureSound, playLossSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"

const GAME_ID = "merge-2048-undo"
const MAX_UNDOS = 5

const RULES =
  "規則跟 2048 完全一樣：4×4 網格，滑動合併相同數字。這一台額外提供「倒退悔棋」——最多可以連續悔棋 5 步，滑錯方向也能馬上退回上一步重新選擇，容錯率大幅降低，很適合想輕鬆體驗、不想一失手就重來的玩家。"

const DIR_ARROW: Record<"left" | "right" | "up" | "down", string> = { left: "←", right: "→", up: "↑", down: "↓" }

function tileStyle(value: number): { bg: string; text: string } {
  const map: Record<number, { bg: string; text: string }> = {
    2: { bg: "bg-[#eee4da]", text: "text-[#6b5a4d]" },
    4: { bg: "bg-[#ede0c8]", text: "text-[#6b5a4d]" },
    8: { bg: "bg-[#f2b179]", text: "text-white" },
    16: { bg: "bg-[#f59563]", text: "text-white" },
    32: { bg: "bg-[#f67c5f]", text: "text-white" },
    64: { bg: "bg-[#f65e3b]", text: "text-white" },
    128: { bg: "bg-[#edcf72]", text: "text-white" },
    256: { bg: "bg-[#edcc61]", text: "text-white" },
    512: { bg: "bg-[#edc850]", text: "text-white" },
    1024: { bg: "bg-[#edc53f]", text: "text-white" },
    2048: { bg: "bg-[#edc22e]", text: "text-white" },
  }
  return map[value] ?? { bg: "bg-[#3c3a32]", text: "text-white" }
}

export function Merge2048UndoView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [best, setBest] = useState(0)
  const [state, setState] = useState<Merge2048State>(() => dealMerge2048())
  const [history, setHistory] = useState<Merge2048State[]>([])
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setBest((b) => Math.max(b, state.best))
  }, [state.best])

  function applyMove(dir: "left" | "right" | "up" | "down") {
    if (state.finished) return
    const prevMax = maxTile(state.grid)
    const next = slide({ ...state, best }, dir)
    if (!next.moved) return
    setHistory((h) => [...h, state].slice(-MAX_UNDOS))
    setState(next)
    if (soundOn) {
      if (next.finished) playLossSound()
      else if (maxTile(next.grid) > prevMax) playCaptureSound()
      else playMoveSound()
    }
  }

  function undo() {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setState(prev)
  }

  function restart() {
    setHistory([])
    setState(dealMerge2048(best))
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") applyMove("left")
      else if (e.key === "ArrowRight") applyMove("right")
      else if (e.key === "ArrowUp") applyMove("up")
      else if (e.key === "ArrowDown") applyMove("down")
      else if (e.key === "z" || e.key === "Z") undo()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, best, history])

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0]
    touchStart.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return
    const t = e.changedTouches[0]
    const dx = t.clientX - touchStart.current.x
    const dy = t.clientY - touchStart.current.y
    touchStart.current = null
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return
    if (Math.abs(dx) > Math.abs(dy)) applyMove(dx > 0 ? "right" : "left")
    else applyMove(dy > 0 ? "down" : "up")
  }

  const result: PuzzleOutcome = state.finished ? (state.won ? "win" : "loss") : null
  const hint = suggestDirection(state.grid)
  const status = state.finished
    ? `挑戰結束！最終分數 ${state.score}（最高紀錄 ${best}）`
    : `分數 ${state.score} ・ 最高紀錄 ${best} ・ 可悔棋 ${Math.min(history.length, MAX_UNDOS)} 步${state.won ? " ・ 已合成2048！" : ""}`

  return (
    <BoardShell
      gameId={GAME_ID}
      title="2048 Undo"
      subtitle="滑動合併，還能倒退悔棋"
      status={status}
      rulesBrief={RULES}
      result={result}
      onBack={onBack}
      onRestart={restart}
      mode="single"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div
          className="relative aspect-square w-full max-w-[320px] touch-none rounded-2xl bg-[#bbada0] p-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-2">
            {state.grid.map((row, r) =>
              row.map((value, c) => {
                const style = value !== null ? tileStyle(value) : null
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`lp-nums flex items-center justify-center rounded-lg font-bold transition-all ${
                      value === null ? "bg-[#cdc1b4]/60" : style!.bg
                    } ${style?.text ?? ""} ${value && value >= 1000 ? "text-2xl" : "text-3xl"}`}
                  >
                    {value ?? ""}
                  </div>
                )
              }),
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(["up", "left", "down", "right"] as const).map((dir) => (
            <button
              key={dir}
              onClick={() => applyMove(dir)}
              disabled={state.finished}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-base font-bold text-foreground transition active:scale-95 disabled:opacity-40"
              aria-label={dir}
            >
              {DIR_ARROW[dir]}
            </button>
          ))}
          <button
            onClick={undo}
            disabled={history.length === 0 || state.finished}
            className="flex h-9 items-center gap-1 rounded-full bg-accent px-3 text-xs font-semibold text-accent-foreground transition active:scale-95 disabled:opacity-40"
          >
            <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
            悔棋
          </button>
        </div>

        {!state.finished && (
          <p className="text-[11px] text-muted-foreground">
            建議方向：<span className="font-semibold text-accent">{DIR_ARROW[hint]}</span>・滑錯了可以按悔棋退回上一步（最多 {MAX_UNDOS} 步）
          </p>
        )}
      </div>
    </BoardShell>
  )
}
