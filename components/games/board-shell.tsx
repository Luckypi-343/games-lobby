"use client"

import type { ReactNode } from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { DIFFICULTY_LABEL, type Difficulty } from "@/lib/luckypi/data"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"
import { startBgm, stopBgm, playWinSound, playLossSound, playDrawSound } from "@/lib/games/game-audio"

export type PuzzleOutcome = "win" | "loss" | "draw" | null

export function BoardShell({
  gameId,
  title,
  subtitle,
  status,
  rulesBrief,
  result = null,
  onBack,
  onRestart,
  mode,
  onModeChange,
  showDifficulty = true,
  extraAction,
  compact = false,
  /** 僅供「沒有外層共用頂部📖」的機台（例如博奕區直接使用本外殼的牌桌）開啟專屬的📖按鈕；
   * 其餘由 PuzzleGameScreen 統一包裹頂部標題列的機台，📖已經在外層顯示過一次，這裡維持關閉即可，避免重複。 */
  showBookButton = false,
  children,
}: {
  gameId: string
  title: string
  subtitle: string
  status: ReactNode
  rulesBrief?: string
  result?: PuzzleOutcome
  onBack: () => void
  onRestart: () => void
  mode: "ai" | "two" | "single"
  onModeChange?: (m: "ai" | "two") => void
  showDifficulty?: boolean
  extraAction?: ReactNode
  compact?: boolean
  showBookButton?: boolean
  children: ReactNode
}) {
  const { difficulty, setDifficulty, getPuzzleStat, recordPuzzleResult, musicOn, soundOn, lang } = useLuckyPi()
  const stat = getPuzzleStat(gameId)
  const recordedRef = useRef(false)
  const t = dictFor(lang)
  const [showRules, setShowRules] = useState(false)

  const RESULT_COPY: Record<Exclude<PuzzleOutcome, null>, { emoji: string; title: string; encourage: string }> = {
    win: { emoji: "🎉", title: t.puzzleWinTitle, encourage: t.puzzleWinBody },
    loss: { emoji: "💪", title: t.puzzleLossTitle, encourage: t.puzzleLossBody },
    draw: { emoji: "🤝", title: t.puzzleDrawTitle, encourage: t.puzzleDrawBody },
  }

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
    if (!result) {
      recordedRef.current = false
      return
    }
    if (!recordedRef.current) {
      recordedRef.current = true
      recordPuzzleResult(gameId, result)
      if (soundOn) {
        if (result === "win") playWinSound()
        else if (result === "loss") playLossSound()
        else playDrawSound()
      }
    }
  }, [result, gameId, recordPuzzleResult, soundOn])

  const modeChip = mode !== "single" && (
    <div className="flex items-center justify-center gap-1.5">
      {(["ai", "two"] as const).map((m) => (
        <button
          key={m}
          onClick={() => onModeChange?.(m)}
          className={cn(
            "rounded-full font-semibold transition",
            compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-[11px]",
            mode === m ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {m === "ai" ? t.aiSoloMode : t.twoPlayerMode}
        </button>
      ))}
    </div>
  )

  const difficultyChips = mode === "ai" && showDifficulty && (
    <div className={cn("flex items-center justify-center gap-1.5", compact ? "mt-1" : "mt-2")}>
      <span className="text-[10px] text-muted-foreground">{t.difficultyLabel}</span>
      {(["easy", "medium", "hard"] as const).map((d) => (
        <button
          key={d}
          onClick={() => setDifficulty(d)}
          className={cn(
            "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition",
            difficulty === d ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {DIFFICULTY_LABEL[d]}
        </button>
      ))}
    </div>
  )

  return (
    <div className="flex min-h-dvh flex-col bg-background pb-6">
      <header
        className={cn(
          "sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur",
          compact ? "px-2 py-1.5" : "px-4 py-3",
        )}
      >
        {compact ? (
          <>
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={onBack}
                className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-foreground transition active:scale-95"
              >
                ← {t.backToLobbyBtn}
              </button>
              {modeChip}
              <div className="flex items-center gap-1">
                {showBookButton && rulesBrief && (
                  <button
                    onClick={() => setShowRules(true)}
                    aria-label={t.navRules}
                    className="rounded-full bg-muted p-1.5 text-[11px] leading-none transition active:scale-95"
                  >
                    📖
                  </button>
                )}
                <button
                  onClick={onRestart}
                  className="rounded-full bg-muted px-2 py-1 text-[10px] font-semibold text-foreground transition active:scale-95"
                >
                  {t.restartGameBtn}
                </button>
              </div>
            </div>
            <div className="mt-1 flex items-center justify-center gap-1">
              <p className="truncate text-center font-serif text-xs font-bold text-primary">{title}</p>
            </div>
            {difficultyChips}
            <p className="mt-1 text-center text-[10px] font-semibold text-foreground">{status}</p>
            <p className="lp-nums text-center text-[9px] text-muted-foreground">
              {t.statsLabel} · {t.winShort} {stat.wins} ・ {t.lossShort} {stat.losses} ・ {t.drawShort} {stat.draws}
            </p>
            {extraAction && <div className="mt-1 flex items-center justify-center">{extraAction}</div>}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={onBack}
                className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition active:scale-95"
              >
                ← {t.backToLobbyBtn}
              </button>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="font-serif text-lg font-bold text-primary">{title}</p>
                </div>
                <p className="text-[11px] text-muted-foreground">{subtitle}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {showBookButton && rulesBrief && (
                  <button
                    onClick={() => setShowRules(true)}
                    aria-label={t.navRules}
                    className="rounded-full bg-muted p-1.5 text-sm leading-none transition active:scale-95"
                  >
                    📖
                  </button>
                )}
                <button
                  onClick={onRestart}
                  className="rounded-full bg-muted px-3 py-1.5 text-xs font-semibold text-foreground transition active:scale-95"
                >
                  {t.restartGameBtn}
                </button>
              </div>
            </div>
            <div className="mt-3">{modeChip}</div>
            {difficultyChips}
            <p className="mt-2 text-center text-xs font-semibold text-foreground">{status}</p>
            <p className="lp-nums mt-1 text-center text-[10px] text-muted-foreground">
              {t.statsLabel} · {t.winShort} {stat.wins} ・ {t.lossShort} {stat.losses} ・ {t.drawShort} {stat.draws}
            </p>
            {extraAction && <div className="mt-2 flex items-center justify-center">{extraAction}</div>}
          </>
        )}
      </header>
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 py-4">
        {children}
      </div>

      {result && (
        <div
          className="fixed inset-x-0 top-0 z-50 flex justify-center bg-transparent px-4 pt-3"
          onClick={onRestart}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-border bg-card/95 p-3 text-center shadow-xl backdrop-blur-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl leading-none">{RESULT_COPY[result].emoji}</p>
              <p className="font-serif text-base font-bold text-primary">{RESULT_COPY[result].title}</p>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{RESULT_COPY[result].encourage}</p>
            <p className="lp-nums mt-1.5 text-[11px] text-muted-foreground">
              {t.statsLabel} {t.winShort} {stat.wins} ・ {t.lossShort} {stat.losses} ・ {t.drawShort} {stat.draws}
            </p>
            <div className="mt-2 flex gap-2">
              <button
                onClick={onBack}
                className="flex-1 rounded-full bg-muted py-1.5 text-[11px] font-semibold text-foreground transition active:scale-95"
              >
                {t.backToLobbyBtn}
              </button>
              <button
                onClick={onRestart}
                className="flex-1 rounded-full bg-primary py-1.5 text-[11px] font-semibold text-primary-foreground transition active:scale-95"
              >
                {t.playAgainBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {showBookButton && showRules && rulesBrief && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-background/60 px-3 pb-3"
          onClick={() => setShowRules(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-center font-serif text-base font-bold text-primary">{title}</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">{rulesBrief}</p>
            <button
              onClick={() => setShowRules(false)}
              className="mt-4 w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground transition active:scale-95"
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
