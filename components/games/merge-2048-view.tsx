"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import { dealMerge2048, slide, suggestDirection, maxTile, type Merge2048State } from "@/lib/games/merge-2048"
import { playMoveSound, playCaptureSound, playLossSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"

const GAME_ID = "merge-2048"

const RULES =
  "4×4 網格，向上/下/左/右滑動（或用方向鍵）：所有方塊往該方向靠攏，相同數字相撞即合併相加（2+2=4、4+4=8...），每次滑動後空白處隨機生成一個新方塊（90%機率是2，10%機率是4）。目標是合成出 2048，合成後仍可繼續挑戰更高分數。盤面填滿且四個方向都無法再合併時，即結束挑戰。小提示：儘量把最大的數字固定在同一個角落，再用同一兩個方向整理盤面，比較容易越疊越高。"

const DIR_ARROW: Record<"left" | "right" | "up" | "down", string> = {
  left: "←",
  right: "→",
  up: "↑",
  down: "↓",
}

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

export function Merge2048View({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [best, setBest] = useState(0)
  const [state, setState] = useState<Merge2048State>(() => dealMerge2048())
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    setBest((b) => Math.max(b, state.best))
  }, [state.best])

  function applyMove(dir: "left" | "right" | "up" | "down") {
    if (state.finished) return
    const prevMax = maxTile(state.grid)
    const next = slide({ ...state, best }, dir)
    if (!next.moved) return
    setState(next)
    if (soundOn) {
      if (next.finished) playLossSound()
      else if (maxTile(next.grid) > prevMax) playCaptureSound()
      else playMoveSound()
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") applyMove("left")
      else if (e.key === "ArrowRight") applyMove("right")
      else if (e.key === "ArrowUp") applyMove("up")
      else if (e.key === "ArrowDown") applyMove("down")
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, best])

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
    if (Math.abs(dx) > Math.abs(dy)) {
      applyMove(dx > 0 ? "right" : "left")
    } else {
      applyMove(dy > 0 ? "down" : "up")
    }
  }

  const result: PuzzleOutcome = state.finished ? (state.won ? "win" : "loss") : null

  const hint = suggestDirection(state.grid)
  const status = state.finished
    ? `挑戰結束！最終分數 ${state.score}（最高紀錄 ${best}）`
    : `分數 ${state.score} ・ 最高紀錄 ${best}${state.won ? " ・ 已合成2048！" : ""}`

  return (
    <BoardShell
      gameId={GAME_ID}
      title="2048合併"
      subtitle="滑動合併數字，挑戰2048"
      status={status}
      rulesBrief={RULES}
      result={result}
      onBack={onBack}
      onRestart={() => setState(dealMerge2048(best))}
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
                    } ${style?.text ?? ""} ${value && value >= 1000 ? "text-base" : "text-xl"}`}
                  >
                    {value ?? ""}
                  </div>
                )
              }),
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
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
        </div>

        {!state.finished && (
          <p className="text-[11px] text-muted-foreground">
            建議方向：<span className="font-semibold text-accent">{DIR_ARROW[hint]}</span>（角落定錨，優先同一兩個方向整理盤面）
          </p>
        )}
      </div>
    </BoardShell>
  )
}
