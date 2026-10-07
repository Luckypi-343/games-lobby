"use client"

import { useEffect, useRef, useState } from "react"
import { PuzzleShell } from "./puzzle-shell"
import { daNew, daAct, DA_MAX_HP, type DaState } from "@/lib/games/duel-arena"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound, playWinSound, playLossSound } from "@/lib/games/game-audio"

export function DuelArenaView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [state, setState] = useState<DaState>(() => daNew())
  const overRef = useRef(false)

  const restart = () => {
    setState(daNew())
    overRef.current = false
  }

  useEffect(() => {
    if (state.over && !overRef.current) {
      overRef.current = true
      if (soundOn) {
        if (state.won) playWinSound()
        else playLossSound()
      }
    }
  }, [state.over, state.won, soundOn])

  const act = (action: "attack" | "defend" | "special") => {
    setState((s) => {
      const next = daAct(s, action)
      if (soundOn && next !== s) {
        if (action === "special") playCaptureSound()
        else playMoveSound()
      }
      return next
    })
  }

  return (
    <PuzzleShell
      gameId="duel-arena"
      title="決鬥擂台"
      subtitle="回合制對戰，率先擊倒對手"
      status={`第 ${state.turn} 回合`}
      rulesBrief="選擇攻擊累積必殺氣力、防禦減半下一次受到的傷害，或蓄滿 3 點氣力後使出必殺技，率先讓對手血量歸零者獲勝。"
      solved={state.over && state.won}
      cost={16}
      onBack={onBack}
      onRestart={restart}
    >
      <div className="w-full max-w-xs space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
            <span>對手</span>
            <span className="lp-nums">{state.enemyHp}／{DA_MAX_HP}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-destructive transition-all"
              style={{ width: `${(state.enemyHp / DA_MAX_HP) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-[11px] font-semibold text-foreground">
            <span>您</span>
            <span className="lp-nums">{state.playerHp}／{DA_MAX_HP}</span>
          </div>
          <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(state.playerHp / DA_MAX_HP) * 100}%` }}
            />
          </div>
          <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>必殺氣力：</span>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`h-2 w-2 rounded-full ${i < state.playerCharge ? "bg-accent" : "bg-muted"}`}
              />
            ))}
          </div>
        </div>

        <div className="max-h-28 space-y-1 overflow-y-auto rounded-xl border border-border bg-muted/20 p-2">
          {state.log.map((entry, i) => (
            <p
              key={i}
              className={`text-[11px] leading-snug ${
                entry.kind === "player" ? "text-primary" : entry.kind === "enemy" ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {entry.text}
            </p>
          ))}
        </div>

        {!state.over && (
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => act("attack")}
              className="rounded-full bg-primary py-2 text-[11px] font-bold text-primary-foreground active:scale-95"
            >
              攻擊
            </button>
            <button
              onClick={() => act("defend")}
              className="rounded-full bg-muted py-2 text-[11px] font-bold text-foreground active:scale-95"
            >
              防禦
            </button>
            <button
              onClick={() => act("special")}
              disabled={state.playerCharge < 3}
              className="rounded-full bg-accent py-2 text-[11px] font-bold text-accent-foreground transition disabled:opacity-40 active:scale-95"
            >
              必殺技
            </button>
          </div>
        )}
        {state.over && (
          <p className={`text-center text-xs font-semibold ${state.won ? "text-primary" : "text-destructive"}`}>
            {state.won ? "恭喜擊倒對手！" : "您已倒下，點「重新開始」再挑戰一次！"}
          </p>
        )}
      </div>
    </PuzzleShell>
  )
}
