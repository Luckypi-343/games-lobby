"use client"

import { useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { pcNew, pcRotate, pcConnections, PC_SIZE, type PcState } from "@/lib/games/pipe-connect"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

const DIR_STYLE: Record<string, string> = {
  N: "left-1/2 top-0 h-1/2 w-[26%] -translate-x-1/2",
  S: "left-1/2 bottom-0 h-1/2 w-[26%] -translate-x-1/2",
  E: "right-0 top-1/2 h-[26%] w-1/2 -translate-y-1/2",
  W: "left-0 top-1/2 h-[26%] w-1/2 -translate-y-1/2",
}

export function PipeConnectView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<PcState>(() => pcNew())

  const restart = () => setState(pcNew())

  const rotate = (i: number) => {
    if (state.won) return
    if (soundOn) playMoveSound()
    setState((s) => pcRotate(s, i))
  }

  return (
    <PuzzleShell
      gameId="pipe-connect"
      title="接水管"
      subtitle="旋轉管線接通水源到出口"
      status={`旋轉次數：${state.moves}${state.won ? "　已接通！" : ""}`}
      rulesBrief="點擊管線方塊即可旋轉 90 度，把左上角的水源（藍色）一路接通到右下角的出口（金色），接通全程即可過關。"
      solved={state.won}
      cost={8}
      onBack={onBack}
      onRestart={restart}
    >
      <div
        className="grid gap-0.5 rounded-2xl border border-border bg-card p-2 shadow-lg"
        style={{ gridTemplateColumns: `repeat(${PC_SIZE}, minmax(0, 1fr))`, width: 250, height: 250 }}
      >
        {state.cells.map((cell, i) => {
          const dirs = pcConnections(cell)
          const isSource = i === 0
          const isSink = i === PC_SIZE * PC_SIZE - 1
          return (
            <button
              key={i}
              onClick={() => rotate(i)}
              disabled={cell.type === "fixed"}
              className="relative aspect-square rounded-sm bg-muted/20"
            >
              {dirs.map((d) => (
                <span
                  key={d}
                  className={`absolute rounded-sm ${DIR_STYLE[d]} ${
                    isSource ? "bg-sky-500" : isSink ? "bg-amber-500" : "bg-primary/70"
                  }`}
                />
              ))}
              <span
                className={`absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                  isSource ? "bg-sky-500" : isSink ? "bg-amber-500" : dirs.length ? "bg-primary/70" : "bg-transparent"
                }`}
              />
            </button>
          )
        })}
      </div>
    </PuzzleShell>
  )
}
