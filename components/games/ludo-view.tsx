"use client"

import { useEffect, useState } from "react"
import { BoardShell } from "./board-shell"
import {
  ldInitial,
  ldRoll,
  ldValidMoves,
  ldApplyMove,
  ldBestMove,
  ldAbsoluteCell,
  TRACK_LEN,
  HOME_LEN,
  SAFE_CELLS,
  type LDState,
  type LDPlayer,
} from "@/lib/games/ludo"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playMoveSound, playCaptureSound, playWinSound } from "@/lib/games/game-audio"

const RADIUS = 130
const CENTER = 150
const SIZE = 300

function trackPixel(cell: number) {
  const angle = (cell / TRACK_LEN) * Math.PI * 2 - Math.PI / 2
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) }
}

const PLAYER_COLOR: Record<LDPlayer, string> = { 1: "#dc2626", 2: "#2563eb" }

function TokenTray({ player, tokens, active }: { player: LDPlayer; tokens: number[]; active: boolean }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-lg border px-2 py-1.5 ${active ? "border-primary bg-primary/10" : "border-border"}`}>
      <span className="text-[10px] font-bold" style={{ color: PLAYER_COLOR[player] }}>
        {player === 1 ? "您" : "P2"}
      </span>
      {tokens.map((rel, i) => {
        const label = rel === -1 ? "機" : rel <= 50 ? "跑" : rel === 50 + HOME_LEN ? "✓" : `${rel - 50}`
        const done = rel === 50 + HOME_LEN
        return (
          <span
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold text-white ${done ? "ring-2 ring-yellow-400" : ""}`}
            style={{ backgroundColor: PLAYER_COLOR[player], opacity: rel === -1 ? 0.4 : 1 }}
          >
            {label}
          </span>
        )
      })}
    </div>
  )
}

export function LudoView({ onBack }: { onBack: () => void }) {
  const { difficulty, soundOn } = useLuckyPi()
  const [mode, setMode] = useState<"ai" | "two">("ai")
  const [state, setState] = useState<LDState>(() => ldInitial())
  const [dice, setDice] = useState<number | null>(null)
  const [rolling, setRolling] = useState(false)

  const restart = () => {
    setState(ldInitial())
    setDice(null)
  }

  const movable = dice !== null && state.status === "playing" ? ldValidMoves(state, state.turn, dice) : []

  function doRoll() {
    if (state.status !== "playing" || dice !== null) return
    setRolling(true)
    setTimeout(() => {
      const value = ldRoll()
      setDice(value)
      setRolling(false)
    }, 350)
  }

  function pickToken(tokenIndex: number) {
    if (dice === null) return
    if (!movable.some((m) => m.tokenIndex === tokenIndex)) return
    const opt = movable.find((m) => m.tokenIndex === tokenIndex)!
    if (soundOn) {
      if (opt.finishes) playWinSound()
      else if (opt.captures) playCaptureSound()
      else playMoveSound()
    }
    setState((s) => ldApplyMove(s, s.turn, dice, tokenIndex))
    setDice(null)
  }

  useEffect(() => {
    if (state.status !== "playing") return
    if (dice === null && !rolling) {
      if (mode === "two" || state.turn === 1) return
      const t = setTimeout(doRoll, 500)
      return () => clearTimeout(t)
    }
    if (dice !== null && mode === "ai" && state.turn === 2) {
      const best = ldBestMove(state, 2, dice)
      const t = setTimeout(() => {
        if (best !== null) pickToken(best)
        else setDice(null)
      }, 500)
      return () => clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, dice, rolling, mode])

  const result = state.status === "win" ? (state.winner === 1 ? "win" : mode === "ai" ? "loss" : "loss") : null
  const statusText =
    state.status === "win"
      ? state.winner === 1
        ? "恭喜！全部棋子安全降落"
        : mode === "ai"
          ? "AI 全部棋子抵達，AI 獲勝"
          : "玩家二獲勝"
      : state.turn === 1
        ? dice === null
          ? "您的回合，請擲骰子"
          : "請選擇要移動的棋子"
        : mode === "ai"
          ? "AI 思考中…"
          : dice === null
            ? "玩家二回合，請擲骰子"
            : "玩家二請選擇棋子"

  const isMyTurn = mode === "two" || state.turn === 1

  return (
    <BoardShell
      gameId="ludo"
      title="飛行棋"
      subtitle="雙人環形跑道"
      status={statusText}
      result={result}
      rulesBrief="擲出6才能讓棋子起飛上跑道；擲骰後選擇要移動的棋子，走到對方棋子所在格可將其擊落送回機庫；繞完一圈進入專屬終點跑道，4顆棋子全數抵達終點即獲勝，擲出6可再擲一次。"
      onBack={onBack}
      onRestart={restart}
      mode={mode}
      onModeChange={(m) => {
        setMode(m)
        restart()
      }}
    >
      <div className="flex w-[min(94vw,380px)] shrink-0 flex-col items-center gap-3">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full max-w-[320px] rounded-xl border border-border bg-[#0f2418]">
          {Array.from({ length: TRACK_LEN }).map((_, cell) => {
            const { x, y } = trackPixel(cell)
            const safe = SAFE_CELLS.includes(cell)
            return (
              <circle key={cell} cx={x} cy={y} r={safe ? 8 : 6} fill={safe ? "#facc15" : "#1e3a2a"} stroke="#0f2418" strokeWidth={1} />
            )
          })}
          {([1, 2] as LDPlayer[]).map((player) =>
            state.tokens[player].map((rel, i) => {
              if (rel < 0 || rel > 50) return null
              const cell = ldAbsoluteCell(player, rel)
              if (cell === null) return null
              const { x, y } = trackPixel(cell)
              const offset = i * 2 - 3
              return (
                <circle
                  key={`${player}-${i}`}
                  cx={x + offset}
                  cy={y + offset}
                  r={7}
                  fill={PLAYER_COLOR[player]}
                  stroke="#fff"
                  strokeWidth={1.5}
                />
              )
            }),
          )}
          <circle cx={CENTER} cy={CENTER} r={40} fill="#facc15" opacity={0.15} />
          <text x={CENTER} y={CENTER + 5} textAnchor="middle" fontSize={13} fill="#facc15" fontWeight="bold">
            終點
          </text>
        </svg>

        <div className="flex w-full flex-col gap-2">
          <TokenTray player={1} tokens={state.tokens[1]} active={state.turn === 1} />
          <TokenTray player={2} tokens={state.tokens[2]} active={state.turn === 2} />
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-xl border-2 border-primary bg-card text-2xl font-bold ${rolling ? "animate-pulse" : ""}`}
          >
            {rolling ? "🎲" : dice ?? "-"}
          </div>
          {isMyTurn && dice === null && state.status === "playing" && (
            <button
              onClick={doRoll}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-sm active:scale-95"
            >
              擲骰子
            </button>
          )}
          {isMyTurn && dice !== null && movable.length === 0 && (
            <button
              onClick={() => setDice(null)}
              className="rounded-lg bg-muted px-4 py-2.5 text-sm font-bold text-muted-foreground active:scale-95"
            >
              無棋可走，跳過
            </button>
          )}
        </div>

        {isMyTurn && dice !== null && movable.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {movable.map((m) => (
              <button
                key={m.tokenIndex}
                onClick={() => pickToken(m.tokenIndex)}
                className="rounded-lg border border-primary bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary active:scale-95"
              >
                移動 {m.tokenIndex + 1}號棋 {m.captures ? "（可擊落！）" : m.finishes ? "（抵達終點！）" : ""}
              </button>
            ))}
          </div>
        )}
      </div>
    </BoardShell>
  )
}
