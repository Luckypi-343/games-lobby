"use client"

import { useEffect, useRef, useState } from "react"
import { Sprout, Flower2, TreeDeciduous, Tent, Home, Warehouse, Building, Building2, Landmark, Castle } from "lucide-react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import { dealMerge2048, slide, suggestDirection, maxTile, type Merge2048State } from "@/lib/games/merge-2048"
import { playMoveSound, playCaptureSound, playLossSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"

const GAME_ID = "city-2048"

const RULES =
  "規則跟 2048 完全一樣：4×4 網格，向上/下/左/右滑動，相同建築相撞即升級合併，每次滑動後空白處隨機長出一株新芽。不同的是這裡把數字換成城市演化——從草地、小屋一路蓋到摩天大樓，合成到最高等級的摩天大樓即可持續挑戰更高分數。"

const DIR_ARROW: Record<"left" | "right" | "up" | "down", string> = { left: "←", right: "→", up: "↑", down: "↓" }

const CITY_STAGES: Record<number, { Icon: typeof Sprout; label: string; bg: string; text: string }> = {
  2: { Icon: Sprout, label: "草地", bg: "bg-[#dcedc8]", text: "text-[#4a7c2a]" },
  4: { Icon: Flower2, label: "花圃", bg: "bg-[#c5e1a5]", text: "text-[#4a7c2a]" },
  8: { Icon: TreeDeciduous, label: "樹木", bg: "bg-[#aed581]", text: "text-[#33691e]" },
  16: { Icon: Tent, label: "棚屋", bg: "bg-[#ffe0b2]", text: "text-[#8d5524]" },
  32: { Icon: Home, label: "小屋", bg: "bg-[#ffcc80]", text: "text-white" },
  64: { Icon: Warehouse, label: "倉房", bg: "bg-[#ffb74d]", text: "text-white" },
  128: { Icon: Building, label: "樓房", bg: "bg-[#ff9e5e]", text: "text-white" },
  256: { Icon: Building2, label: "大樓", bg: "bg-[#ef8354]", text: "text-white" },
  512: { Icon: Landmark, label: "地標", bg: "bg-[#e0624a]", text: "text-white" },
  1024: { Icon: Building2, label: "商城", bg: "bg-[#c2452f]", text: "text-white" },
  2048: { Icon: Castle, label: "摩天樓", bg: "bg-[#8e2f1f]", text: "text-white" },
}

function stageFor(value: number) {
  return CITY_STAGES[value] ?? { Icon: Castle, label: `${value}`, bg: "bg-[#4a2311]", text: "text-white" }
}

export function City2048View({ onBack }: { onBack: () => void }) {
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
    if (Math.abs(dx) > Math.abs(dy)) applyMove(dx > 0 ? "right" : "left")
    else applyMove(dy > 0 ? "down" : "up")
  }

  const result: PuzzleOutcome = state.finished ? (state.won ? "win" : "loss") : null
  const hint = suggestDirection(state.grid)
  const status = state.finished
    ? `城市發展結束！最終分數 ${state.score}（最高紀錄 ${best}）`
    : `分數 ${state.score} ・ 最高紀錄 ${best}${state.won ? " ・ 已蓋出摩天樓！" : ""}`

  return (
    <BoardShell
      gameId={GAME_ID}
      title="City 2048"
      subtitle="合併建築，從草地蓋到摩天大樓"
      status={status}
      rulesBrief={RULES}
      result={result}
      onBack={onBack}
      onRestart={() => setState(dealMerge2048(best))}
      mode="single"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-3">
        <div
          className="relative aspect-square w-full max-w-[320px] touch-none rounded-2xl bg-[#8fbc74] p-2"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-2">
            {state.grid.map((row, r) =>
              row.map((value, c) => {
                const stage = value !== null ? stageFor(value) : null
                return (
                  <div
                    key={`${r}-${c}`}
                    className={`flex flex-col items-center justify-center gap-0.5 rounded-lg transition-all ${
                      value === null ? "bg-[#e8f5d8]/60" : stage!.bg
                    } ${stage?.text ?? ""}`}
                    style={
                      stage
                        ? {
                            boxShadow:
                              "inset 0 2px 2px rgba(255,255,255,0.5), inset 0 -3px 4px rgba(0,0,0,0.25), 0 2px 3px rgba(0,0,0,0.2)",
                          }
                        : undefined
                    }
                  >
                    {stage && (
                      <>
                        {/* 圖騰放大並加上陰影投影，呈現仿真立體建築模型的厚度感 */}
                        <stage.Icon
                          className="h-8 w-8 drop-shadow-[0_2px_1.5px_rgba(0,0,0,0.35)]"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                        <span className="text-[10px] font-semibold leading-none">{stage.label}</span>
                      </>
                    )}
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
            建議方向：<span className="font-semibold text-accent">{DIR_ARROW[hint]}</span>（固定一個角落發展，城市才會越蓋越高）
          </p>
        )}
      </div>
    </BoardShell>
  )
}
