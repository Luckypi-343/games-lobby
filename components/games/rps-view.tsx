"use client"

import { useRef, useState } from "react"
import { BoardShell } from "./board-shell"
import { rpsOutcome, rpsAiChoice, RPS_GLYPH, type RpsChoice } from "@/lib/games/rps"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound } from "@/lib/games/game-audio"

const CHOICES: RpsChoice[] = ["rock", "paper", "scissors"]

export function RpsView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [playerPick, setPlayerPick] = useState<RpsChoice | null>(null)
  const [aiPick, setAiPick] = useState<RpsChoice | null>(null)
  const [result, setResult] = useState<"win" | "loss" | "draw" | null>(null)
  const historyRef = useRef<RpsChoice[]>([])
  const [score, setScore] = useState({ win: 0, loss: 0, draw: 0 })

  const play = (choice: RpsChoice) => {
    if (playerPick) return
    if (soundOn) playMoveSound()
    const ai = rpsAiChoice(difficulty, historyRef.current)
    historyRef.current = [...historyRef.current, choice].slice(-10)
    const outcome = rpsOutcome(choice, ai)
    setPlayerPick(choice)
    setAiPick(ai)
    setResult(outcome)
    setScore((s) => ({ ...s, [outcome]: s[outcome] + 1 }))
  }

  const restart = () => {
    setPlayerPick(null)
    setAiPick(null)
    setResult(null)
  }

  const fullReset = () => {
    restart()
    setScore({ win: 0, loss: 0, draw: 0 })
    historyRef.current = []
  }

  const statusText = playerPick
    ? result === "win"
      ? "您獲勝了！"
      : result === "loss"
        ? "AI 獲勝"
        : "平手"
    : "請出拳：剪刀、石頭、布"

  return (
    <BoardShell
      gameId="rps-battle"
      title="猜拳大戰"
      subtitle="AI對戰"
      status={statusText}
      result={result}
      rulesBrief="與電腦同時出拳，剪刀、石頭、布互相克制，累積局數領先者獲得最終勝利。"
      onBack={onBack}
      onRestart={restart}
      mode="ai"
      onModeChange={() => {}}
      showDifficulty
      extraAction={
        <button
          onClick={fullReset}
          className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold text-muted-foreground transition active:scale-95"
        >
          重設本局比分
        </button>
      }
    >
      <div className="flex flex-col items-center gap-4">
        <div className="lp-nums flex items-center gap-4 text-xs text-muted-foreground">
          <span>勝 {score.win}</span>
          <span>負 {score.loss}</span>
          <span>平 {score.draw}</span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card text-4xl shadow">
              {playerPick ? RPS_GLYPH[playerPick] : "?"}
            </div>
            <span className="text-[10px] text-muted-foreground">您</span>
          </div>
          <span className="text-lg font-bold text-muted-foreground">VS</span>
          <div className="flex flex-col items-center gap-1">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card text-4xl shadow">
              {aiPick ? RPS_GLYPH[aiPick] : "?"}
            </div>
            <span className="text-[10px] text-muted-foreground">電腦</span>
          </div>
        </div>

        <div className="flex gap-3">
          {CHOICES.map((choice) => (
            <button
              key={choice}
              onClick={() => play(choice)}
              disabled={!!playerPick}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-3xl transition active:scale-90 disabled:opacity-40"
            >
              {RPS_GLYPH[choice]}
            </button>
          ))}
        </div>
      </div>
    </BoardShell>
  )
}
