"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import { startBgm, stopBgm, playWinSound } from "@/lib/games/game-audio"

export function PuzzleShell({
  gameId,
  title,
  subtitle,
  status,
  rulesBrief,
  solved = false,
  cost,
  onBack,
  onRestart,
  extraAction,
  children,
}: {
  gameId: string
  title: string
  subtitle: string
  status: ReactNode
  rulesBrief?: string
  solved?: boolean
  cost?: number
  onBack: () => void
  onRestart: () => void
  extraAction?: ReactNode
  children: ReactNode
}) {
  const { musicOn, soundOn, recordPuzzleResult, getPuzzleStat, lang } = useLuckyPi()
  const stat = getPuzzleStat(gameId)
  const recordedRef = useRef(false)
  const t = dictFor(lang)

  useEffect(() => {
    if (musicOn) startBgm()
    return () => stopBgm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (musicOn) startBgm()
    else stopBgm()
  }, [musicOn])

  useEffect(() => {
    if (!solved) {
      recordedRef.current = false
      return
    }
    if (!recordedRef.current) {
      recordedRef.current = true
      recordPuzzleResult(gameId, "win")
      if (soundOn) playWinSound()
    }
  }, [solved, gameId, recordPuzzleResult, soundOn])

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-6">
      <header className="sticky top-0 z-10 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={onBack}
            className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition active:scale-95"
          >
            ← 返回大廳
          </button>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="font-serif text-lg font-bold text-primary">{title}</p>
            </div>
            <p className="text-[11px] text-muted-foreground">{subtitle}</p>
          </div>
          <button
            onClick={onRestart}
            className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition active:scale-95"
          >
            重新開始
          </button>
        </div>
        <p className="mt-2 text-center text-xs font-semibold text-foreground">{status}</p>
        <p className="lp-nums mt-1 text-center text-[10px] text-muted-foreground">
          過關次數 · {stat.wins}
        </p>
        {typeof cost === "number" && (
          <p className="lp-nums mt-1 text-center text-[10px] font-semibold text-accent">
            提醒：每次挑戰須先扣除 {cost} 遊戲幣（依難易度 5～20 個不等）
          </p>
        )}
        {extraAction && <div className="mt-2 flex items-center justify-center">{extraAction}</div>}
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-4">
        {children}
      </div>

      {solved && (
        <div
          className="fixed inset-x-0 top-0 z-50 flex justify-center bg-transparent px-4 pt-3"
          onClick={onRestart}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-border bg-card/95 p-3 text-center shadow-xl backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl leading-none">🎉</p>
              <p className="font-serif text-base font-bold text-primary">過關成功！</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">恭喜您完成挑戰，再來一輪試試更快的紀錄吧。</p>
            <p className="lp-nums mt-1.5 text-[11px] text-muted-foreground">過關次數 {stat.wins}</p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={onBack}
                className="flex-1 rounded-full bg-muted py-1.5 text-[11px] font-semibold text-foreground transition active:scale-95"
              >
                返回大廳
              </button>
              <button
                onClick={onRestart}
                className="flex-1 rounded-full bg-primary py-1.5 text-[11px] font-semibold text-primary-foreground transition active:scale-95"
              >
                再玩一次
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
