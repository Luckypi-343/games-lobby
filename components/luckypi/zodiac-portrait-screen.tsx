"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import {
  LINE_COUNT,
  MIN_BET,
  MAX_BET,
  MIN_AUTO,
  MAX_AUTO,
  formatCoins,
  safeNumber,
  paylineEdgeGroups,
  PAYLINES,
  PAYTABLE,
  BOARD_PAYTABLE,
  SCATTER_FREE_GAMES,
  BONUS_WHEEL_SPINS,
  SYMBOL_LABEL,
  ZODIAC_SYMBOLS,
  themeEmojiMap,
  lineColorsFor,
  type Machine,
  type SymbolId,
} from "@/lib/luckypi/data"
import type { LineHit } from "@/lib/luckypi/engine"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { LANGS, dictFor } from "@/lib/luckypi/i18n"
import { themeNameFor, themeSymbolLabelFor } from "@/lib/luckypi/slot-i18n"
import { PiEmblem } from "./ui"
import { WheelBonusSheet } from "./wheel-bonus-sheet"
import { TotemGrid } from "./machine-totem"
import { startBgm, stopBgm } from "@/lib/luckypi/reel-audio"
import {
  useElementSize,
  ReelColumn,
  PaylineRail,
  StaticGridLines,
  WinningLinesOverlay,
  CongratsBanner,
  RuleSection,
  ColorStatBox,
  useHoldRepeat,
  MiniStepper,
  LINE_SHAPE_NAME,
} from "./game-screen"

const PAYLINE_EDGES = paylineEdgeGroups()

// 鼓勵詞語輪流用的詞庫（備用，當語言包沒有提供 cheerLines 時才使用），跟「中獎20倍以上」的跑馬燈訊息交替出現在跑馬燈上。
const FALLBACK_CHEER_PHRASES = [
  "手氣正旺，再轉一次試試！",
  "幸運就在下一輪！",
  "祝您今天財運滾滾！",
  "十二生肖齊聚，好運降臨！",
  "穩住心態，大獎就在前方！",
  "每一轉都是新機會！",
  "恭喜各位先鋒玩家！",
  "祝您連線連連中！",
]

// 跑馬燈：串接「歡迎詞」「鼓勵詞語」跟「近期20倍以上中獎」訊息，不斷循環橫向跑動（速度放慢、字體加大）。
function TickerMarquee({ text }: { text: string }) {
  return (
    <div className="relative h-8 w-full overflow-hidden rounded-full bg-black/25" aria-live="off">
      <div
        className="lp-ticker-scroll lp-ticker-slow absolute inset-y-0 flex items-center whitespace-nowrap px-4 text-sm font-extrabold text-amber-200"
      >
        {text}
      </div>
    </div>
  )
}

// 鼓勵詞語輪流：單行文字，每隔幾秒淡入淡出切換到下一句（依照目前選擇的語言顯示對應翻譯）。
function CheerLine({ lines }: { lines: string[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    setIdx(0)
  }, [lines])
  useEffect(() => {
    const timer = window.setInterval(() => setIdx((i) => (i + 1) % lines.length), 3400)
    return () => window.clearInterval(timer)
  }, [lines])
  return (
    <p
      key={idx}
      className="lp-cheer-fade text-center text-sm font-bold"
      style={{ color: "oklch(0.38 0.1 40)" }}
    >
      {lines[idx]}
    </p>
  )
}

// 直向的「調動條」：顯示目前數值、範圍，並用一條可拖動的 range 滑桿即時調整。
function AdjustTrack({
  label,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
  accent,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  disabled?: boolean
  onChange: (v: number) => void
  accent: string
}) {
  return (
    <div
      className="lp-3d-card flex h-full flex-col justify-center rounded-lg px-2 py-0.5"
      style={{ background: "oklch(0.97 0.01 60)" }}
    >
      <div className="mb-0.5 flex items-center justify-start gap-1 leading-none">
        <span className="text-[11px] font-extrabold" style={{ color: "oklch(0.22 0.02 60)" }}>
          {label}：
        </span>
        <span className="lp-nums text-base font-black" style={{ color: accent }}>
          {value}
        </span>
      </div>
      <div className="mb-0.5 flex items-center justify-between leading-none">
        <span className="lp-nums text-[8px] text-muted-foreground">{min}</span>
        <span className="text-[8px] text-muted-foreground">═══○═══</span>
        <span className="lp-nums text-[8px] text-muted-foreground">{max}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full disabled:opacity-40"
        style={{
          background: `linear-gradient(90deg, ${accent} 0%, ${accent} ${((value - min) / (max - min)) * 100}%, oklch(0.88 0.01 60) ${((value - min) / (max - min)) * 100}%, oklch(0.88 0.01 60) 100%)`,
        }}
        aria-label={label}
      />
    </div>
  )
}

export function ZodiacPortraitScreen({
  machine,
  onBack,
  onHome,
  onSettings,
}: {
  machine: Machine
  onBack: () => void
  onHome: () => void
  onSettings: () => void
}) {
  const {
    trialCoins,
    piCoins,
    coins,
    mode,
    betPerLine,
    setBetPerLine,
    autoCount,
    setAutoCount,
    autoRemaining,
    autoTotalWin,
    freeSpinsGranted,
    freeGamesRemaining,
    lastResult,
    displayGrid,
    stoppedCols,
    history,
    spinning,
    settling,
    spin,
    startAuto,
    stopAuto,
    musicOn,
    setMusicOn,
    soundOn,
    setSoundOn,
    lang,
    setLang,
    trialName,
    piDisplayName,
    wheelBonusOpen,
    wheelBonusStake,
    wheelBonusSpinsLeft,
    wheelBonusSpinsTotal,
    wheelBonusRound,
    resolveWheelBonus,
    startWheelBonusTest,
  } = useLuckyPi()
  const t = dictFor(lang)
  const [ruleSection, setRuleSection] = useState<number | null>(null)

  const emojiMap = useMemo(() => themeEmojiMap(machine.name), [machine.name])
  const symbolLabelMap = useMemo(() => themeSymbolLabelFor(lang, machine.name), [machine.name, lang])
  const translatedThemeName = themeNameFor(lang, machine.name)
  const lineColors = useMemo(() => lineColorsFor(machine.hue), [machine.hue])

  const [testWheelForceOpen, setTestWheelForceOpen] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [showWinLog, setShowWinLog] = useState(false)
  const [showSound, setShowSound] = useState(false)
  const [showLang, setShowLang] = useState(false)
  const [scatterFlashKey, setScatterFlashKey] = useState(0)
  const [scatterMistOn, setScatterMistOn] = useState(false)
  const prevFreeSpinsGranted = useRef(freeSpinsGranted)
  const [freeGamesEndFlashKey, setFreeGamesEndFlashKey] = useState(0)
  const prevFreeGamesRemaining = useRef(freeGamesRemaining)

  const [resultId, setResultId] = useState(0)
  const [showCongrats, setShowCongrats] = useState(false)
  const prevResultRef = useRef(lastResult)
  const [gridRef, gridSize] = useElementSize<HTMLDivElement>()

  useEffect(() => {
    if (freeSpinsGranted > prevFreeSpinsGranted.current) {
      setScatterFlashKey((k) => k + 1)
      setScatterMistOn(true)
      const timer = window.setTimeout(() => setScatterMistOn(false), 1650)
      prevFreeSpinsGranted.current = freeSpinsGranted
      return () => window.clearTimeout(timer)
    }
    prevFreeSpinsGranted.current = freeSpinsGranted
  }, [freeSpinsGranted])

  useEffect(() => {
    if (prevFreeGamesRemaining.current > 0 && freeGamesRemaining === 0) {
      setFreeGamesEndFlashKey((k) => k + 1)
    }
    prevFreeGamesRemaining.current = freeGamesRemaining
  }, [freeGamesRemaining])

  useEffect(() => {
    if (spinning) return
    if (lastResult && lastResult !== prevResultRef.current) {
      prevResultRef.current = lastResult
      setResultId((n) => n + 1)
      if (lastResult.totalWin > 0) {
        setShowCongrats(true)
        const timer = window.setTimeout(() => setShowCongrats(false), 2200)
        return () => window.clearTimeout(timer)
      }
    }
  }, [spinning, lastResult])

  useEffect(() => {
    if (musicOn) startBgm(machine.hue)
    return () => stopBgm()
  }, [musicOn])

  const scatterGlowActive = freeGamesRemaining > 0

  const safeBetPerLine = safeNumber(betPerLine, MIN_BET, MIN_BET, MAX_BET)
  const safeAutoCountDisplay = safeNumber(autoCount, MIN_AUTO, MIN_AUTO, MAX_AUTO)
  const totalBet = safeBetPerLine * LINE_COUNT
  const grid = displayGrid ?? lastResult?.grid
  const winningHits: LineHit[] = useMemo(() => {
    if (spinning || !lastResult || lastResult.totalWin <= 0) return []
    return lastResult.hits
  }, [spinning, lastResult])
  const winningLineSet = useMemo(() => new Set(winningHits.map((h) => h.lineIndex + 1)), [winningHits])
  const winningCellSet = useMemo(() => {
    const set = new Set<string>()
    winningHits.forEach((hit) => {
      const rows = PAYLINES[hit.lineIndex]
      if (!rows) return
      for (let col = 0; col < Math.max(2, hit.count) && col < rows.length; col++) {
        set.add(`${col}-${rows[col]}`)
      }
    })
    if (!spinning && lastResult && lastResult.boardWin > 0) {
      for (let c = 0; c < 5; c++) for (let r = 0; r < 3; r++) set.add(`${c}-${r}`)
    }
    return set
  }, [winningHits, spinning, lastResult])
  const autoActive = autoRemaining > 0
  const canManualSpin =
    !spinning && !settling && !autoActive && !wheelBonusOpen && (freeGamesRemaining > 0 || coins >= totalBet)
  const canStartAuto =
    !spinning &&
    !settling &&
    !autoActive &&
    !wheelBonusOpen &&
    autoCount > 0 &&
    (freeGamesRemaining > 0 || coins >= totalBet)

  // 鼓勵詞語：優先使用目前語言包提供的翻譯，沒有才用備用詞庫。
  const cheerLines = t.cheerLines && t.cheerLines.length > 0 ? t.cheerLines : FALLBACK_CHEER_PHRASES

  // 跑馬燈文字：把「歡迎詞」「近期20倍以上中獎」跟「鼓勵詞語」接成一條循環跑動的訊息，全部依目前語言翻譯。
  const tickerText = useMemo(() => {
    const bigWins = history
      .filter((h) => h.machineId === machine.id && h.bet > 0 && h.totalWin / h.bet >= 20)
      .slice(0, 5)
      .map((h) =>
        (t.recentWinTemplate ?? "🎉 Won {amount} pts ({multiplier}x)!")
          .replace("{amount}", formatCoins(h.totalWin))
          .replace("{multiplier}", String(Math.floor(h.totalWin / h.bet))),
      )
    const welcomeName = mode === "trial" ? trialName : piDisplayName
    const welcome = (mode === "trial" ? t.welcomeTrialTemplate : t.welcomePiTemplate).replace(
      "{name}",
      `「${welcomeName || "先鋒"}」`,
    )
    const parts = [welcome, ...bigWins, ...cheerLines]
    return parts.join("　★　") + "　★　"
  }, [history, machine.id, mode, trialName, piDisplayName, t, cheerLines])

  const adjustBet = (next: number) => {
    if (spinning || autoActive) return
    setBetPerLine(safeNumber(next, MIN_BET, MIN_BET, MAX_BET))
  }
  const adjustAuto = (next: number) => {
    if (autoActive) return
    setAutoCount(safeNumber(next, MIN_AUTO, MIN_AUTO, MAX_AUTO))
  }

  return (
    <div
      className="relative flex h-dvh w-full flex-col overflow-hidden text-neutral-900"
      style={{ background: "linear-gradient(160deg, oklch(0.91 0.02 70), oklch(0.85 0.03 55))" }}
    >
      {/* 頂端功能列：🏠🎰🔊 機台名稱 ⚙️📖🌍 */}
      <header
        className="relative z-[45] flex shrink-0 items-center gap-1 border-b border-border px-1.5"
        style={{
          flex: "0 0 10%",
          background: `linear-gradient(180deg, oklch(0.22 0.07 ${machine.hue}), oklch(0.85 0.03 55) 160%)`,
        }}
      >
        <PiEmblem size={22} spin />
        <button
          onClick={onHome}
          aria-label="返回首頁"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
        >
          🏠
        </button>
        <button
          onClick={onBack}
          aria-label="返回遊戲大廳"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
        >
          🎰
        </button>
        <button
          onClick={() => {
            setShowSound((v) => !v)
            setShowLang(false)
          }}
          aria-label="背景音樂、音效開關"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
        >
          {musicOn || soundOn ? "🔊" : "🔇"}
        </button>
        <p className="flex-1 truncate text-center font-serif text-base font-black text-primary drop-shadow">
          {translatedThemeName}
        </p>
        <button
          onClick={onSettings}
          aria-label="連結至設定頁面"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
        >
          ⚙️
        </button>
        <button
          onClick={() => {
            setShowRules(true)
            setShowSound(false)
            setShowLang(false)
          }}
          aria-label="查看遊戲規則說明"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
        >
          📖
        </button>
        <button
          onClick={() => {
            setShowLang((v) => !v)
            setShowSound(false)
          }}
          aria-label="選擇語言"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
        >
          🌍
        </button>

        {showSound && (
          <div className="absolute right-1 top-full z-50 mt-1 w-36 rounded-xl border border-border bg-card p-2 shadow-lg">
            <div className="flex items-center justify-between py-1 text-[10px] font-medium text-foreground">
              <span>{t.musicLabel}</span>
              <button
                onClick={() => setMusicOn(!musicOn)}
                className={cn("relative h-4 w-7 rounded-full transition", musicOn ? "bg-primary" : "bg-muted")}
              >
                <span
                  className={cn(
                    "absolute top-0.5 block h-3 w-3 rounded-full bg-background transition",
                    musicOn ? "left-[14px]" : "left-0.5",
                  )}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-1 text-[10px] font-medium text-foreground">
              <span>{t.soundEffectLabel}</span>
              <button
                onClick={() => setSoundOn(!soundOn)}
                className={cn("relative h-4 w-7 rounded-full transition", soundOn ? "bg-primary" : "bg-muted")}
              >
                <span
                  className={cn(
                    "absolute top-0.5 block h-3 w-3 rounded-full bg-background transition",
                    soundOn ? "left-[14px]" : "left-0.5",
                  )}
                />
              </button>
            </div>
            <button
              onClick={() => {
                setShowWinLog(true)
                setShowSound(false)
              }}
              className="mt-1 flex w-full items-center justify-between rounded-lg py-1 text-[10px] font-medium text-foreground transition hover:bg-muted"
            >
              <span>🏆 {t.winRecordTitle}</span>
              <span className="text-muted-foreground">›</span>
            </button>
          </div>
        )}
      </header>

      {showLang && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-6"
          onClick={() => setShowLang(false)}
        >
          <div
            className="max-h-[70vh] w-full max-w-xs overflow-y-auto rounded-2xl border p-2 shadow-2xl"
            style={{ background: "#ffffff", borderColor: "#d8d8e0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="px-2 py-1.5 text-center text-xs font-bold" style={{ color: "#6b6b78" }}>
              {t.langMenuTitle}
            </p>
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  setLang(l.id)
                  setShowLang(false)
                }}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                style={
                  lang === l.id
                    ? { background: "oklch(0.9 0.09 55)", color: "oklch(0.32 0.1 55)", fontWeight: 700 }
                    : { color: "#1c1c24" }
                }
              >
                {l.native}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 跑馬燈：約 6% 高度（字體加大、速度放慢、高度加高） */}
      <div style={{ flex: "0 0 6%" }} className="shrink-0 flex items-center px-2 pt-1">
        <TickerMarquee text={tickerText} />
      </div>

      {/* 鼓勵詞語條：約 6% 高度 */}
      <div style={{ flex: "0 0 6%" }} className="shrink-0 flex items-center justify-center px-2">
        <div className="flex w-full items-center justify-center rounded-full bg-white/65 px-3 py-0.5 shadow-sm">
                <CheerLine lines={cheerLines} />
        </div>
      </div>

      {/* 恭賀中獎區域：隨畫面大小自動拉伸 */}
      <div style={{ flex: "1 1 0%", minHeight: 0 }} className="relative flex items-center justify-center px-2">
        {showCongrats && lastResult && lastResult.totalWin > 0 ? (
          <div key={resultId} className="lp-congrats-pop flex items-center gap-2 rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-400 to-orange-500 px-4 py-1.5 shadow-lg">
            <span className="text-lg leading-none">🎉</span>
            <span className="text-xs font-black text-white drop-shadow">{t.congratsPrefix ?? "Congrats! You won"}</span>
            <span className="lp-nums text-base font-black text-white drop-shadow">{formatCoins(lastResult.totalWin)}</span>
            <span className="text-xs font-black text-white drop-shadow">{t.pointsSuffix ?? "pts"}</span>
          </div>
        ) : (
          <p className="rounded-full bg-white/55 px-3 py-1 text-[10px] font-medium" style={{ color: "oklch(0.4 0.06 50)" }}>
            {t.cheerSubtext ?? "Good luck, spin for a great result!"}
          </p>
        )}
      </div>

      {/* 餘額列：約 4% 高度 */}
      <div style={{ flex: "0 0 4%" }} className="shrink-0 flex items-center justify-between px-3">
        <span className="text-xs font-bold" style={{ color: "oklch(0.3 0.12 150)" }}>
          {t.trialCoinsLabel}：<span className="lp-nums">{formatCoins(trialCoins)}</span>
        </span>
        <span className="text-xs font-bold" style={{ color: "oklch(0.35 0.16 300)" }}>
          {t.piCoinsLabel}：<span className="lp-nums">{String(piCoins).padStart(6, "0")}</span>
        </span>
      </div>

      {/* 轉盤本體：3×5 齒輪格，左右兩側貼著九連線編碼軌 */}
        <div style={{ flex: "0 0 33%" }} className="shrink-0 flex items-stretch justify-center px-0.5 py-1">
          <div
            className={cn(
              "relative flex h-full w-full items-stretch gap-1 rounded-[20px] border-[5px] p-1.5 transition-colors duration-300",
              scatterMistOn ? "border-red-400" : scatterGlowActive ? "border-amber-300" : "border-[oklch(0.52_0.07_55)]",
            )}
            style={{
              background: "linear-gradient(155deg, oklch(0.72 0.055 60), oklch(0.6 0.06 52) 55%, oklch(0.5 0.06 48))",
              boxShadow:
                scatterMistOn || scatterGlowActive
                  ? undefined
                  : "0 0 0 2px oklch(0.42 0.05 50), inset 0 2px 0 oklch(0.85 0.04 65 / 0.5), inset 0 -3px 6px oklch(0.3 0.04 45 / 0.5), 0 10px 22px -8px oklch(0.2 0.03 40 / 0.55)",
              animation: scatterMistOn
                ? "lp-scatter-red-glow 0.4s ease-in-out 4"
                : scatterGlowActive
                  ? "luckypi-scatter-glow 1.1s ease-in-out infinite"
                  : undefined,
            }}
          >
            <div
              key={scatterFlashKey}
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-0 z-30 rounded-[16px] bg-amber-200",
                scatterFlashKey > 0 && "opacity-0",
              )}
              style={scatterFlashKey > 0 ? { animation: "luckypi-scatter-flash 0.9s ease-out" } : { display: "none" }}
            />
            {freeGamesEndFlashKey > 0 && (
              <div
                key={`fgend-${freeGamesEndFlashKey}`}
                aria-hidden
                className="pointer-events-none absolute inset-0 z-30 rounded-[16px] bg-white lp-freegames-end-flash"
              />
            )}
            {freeGamesRemaining > 0 && (
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-black shadow-[0_0_10px_2px_oklch(0.85_0.18_90/0.8)]">
                {(t.freeGamesRemainingTemplate ?? "{n} free spins remaining").replace("{n}", String(freeGamesRemaining))}
              </span>
            )}
            {!!lastResult && lastResult.boardWin > 0 && (
              <span
                key={`board-${lastResult.boardWin}-${lastResult.boardSymbol ?? ""}`}
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 px-3 py-0.5 text-[10px] font-bold text-black shadow-[0_0_14px_3px_oklch(0.85_0.18_90/0.9)]"
                style={{ animation: "luckypi-scatter-flash 1.4s ease-out" }}
              >
                {t.boardWinBanner}
                {formatCoins(lastResult.boardWin)}
              </span>
            )}
            <PaylineRail side="left" winningLines={winningLineSet} lineColors={lineColors} hue={machine.hue} />
            <div
              ref={gridRef}
              className="relative grid flex-1 grid-cols-5 grid-rows-3 gap-[3px] overflow-hidden rounded-xl p-1.5"
              style={{
                background: `linear-gradient(160deg, oklch(0.72 0.055 ${machine.hue}), oklch(0.6 0.06 ${machine.hue}) 55%, oklch(0.5 0.06 ${machine.hue}))`,
                boxShadow: `inset 0 0 0 2px oklch(0.52 0.07 ${machine.hue}), inset 0 2px 6px oklch(0.4 0.05 ${machine.hue} / 0.5)`,
              }}
            >
              <TotemGrid machineId={machine.id} hue={machine.hue} themeName={machine.name} lang={lang} />
              <WinningLinesOverlay hits={winningHits} width={gridSize.width} height={gridSize.height} lineColors={lineColors} />
              {scatterMistOn && (
                <div
                  aria-hidden
                  className="lp-scatter-mist pointer-events-none absolute inset-0 z-25 rounded-xl"
                  style={{
                    background: "radial-gradient(oklch(0.62 0.2 22 / 0.5), oklch(0.55 0.22 15 / 0.32) 70%, transparent)",
                  }}
                />
              )}
              {Array.from({ length: 5 }).map((_, col) => {
                const colSpinning = spinning && col >= stoppedCols
                return (
                  <div key={col} className="relative z-10 h-full w-full" style={{ gridColumn: col + 1, gridRow: "1 / span 3" }}>
                    <ReelColumn
                      col={col}
                      grid={grid}
                      spinning={colSpinning}
                      winningCells={winningCellSet}
                      resultId={resultId}
                      emojiMap={emojiMap}
                      symbolScale={0.81}
                    />
                  </div>
                )
              })}
              <StaticGridLines />
            </div>
            <PaylineRail side="right" winningLines={winningLineSet} lineColors={lineColors} hue={machine.hue} />
          </div>
        </div>

        {/* 中獎顯示區：轉盤轉停對獎後，逐條列出實際中獎的連線與分數；隨畫面大小自動拉伸 */}
        <div style={{ flex: "2 1 0%", minHeight: 0 }} className="flex flex-col gap-1 overflow-y-auto px-2 py-1">
          {!spinning && winningHits.length > 0 ? (
            <div className="flex flex-col gap-1">
              {winningHits
                .slice()
                .sort((a, b) => a.lineIndex - b.lineIndex)
                .map((hit) => {
                  const multiplier = safeBetPerLine > 0 ? Math.round(hit.win / safeBetPerLine) : 0
                  return (
                    <div
                      key={hit.lineIndex}
                      className="flex items-center justify-between gap-2 rounded-lg bg-white/75 px-2.5 py-1 text-[11px] font-bold"
                      style={{ boxShadow: `inset 0 0 0 1.5px ${lineColors[hit.lineIndex + 1]}` }}
                    >
                      <span className="flex items-center gap-1" style={{ color: "oklch(0.3 0.08 50)" }}>
                        <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: lineColors[hit.lineIndex + 1] }} />
                        {(t.lineLabelTemplate ?? "Line {n}").replace("{n}", String(hit.lineIndex + 1))}{" "}
                        {emojiMap[hit.symbol]}×{hit.count}
                      </span>
                      <span className="lp-nums" style={{ color: "oklch(0.5 0.2 30)" }}>
                        {safeBetPerLine}×{multiplier}=<span className="text-[12px]">{formatCoins(hit.win)}</span>
                      </span>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center rounded-lg bg-white/60 px-2 py-2 text-center text-xs font-semibold text-neutral-600">
              {t.waitingSpinLabel ?? "Waiting to spin……"}
            </div>
          )}
        </div>

        {/* 統計列：押注分／自動剩／本次贏／總贏分 */}
        <div style={{ flex: "0 0 5%" }} className="grid shrink-0 grid-cols-4 gap-1 px-2">
          <ColorStatBox
            label={t.betPerLineLabel}
            value={formatCoins(safeBetPerLine)}
            textColor="oklch(0.32 0.12 260)"
            bgColor="oklch(0.92 0.06 55)"
          />
          <ColorStatBox
            label={t.autoRemainingLabel}
            value={String(safeNumber(autoRemaining, 0, 0, MAX_AUTO))}
            textColor="oklch(0.55 0.22 25)"
            bgColor="oklch(0.92 0.045 230)"
          />
          <ColorStatBox
            label={t.roundWinLabel}
            value={lastResult ? formatCoins(lastResult.totalWin) : "0"}
            textColor="oklch(0.3 0.11 255)"
            bgColor="oklch(0.9 0.06 255)"
          />
          <ColorStatBox
            label={t.autoTotalWinLabel}
            value={formatCoins(autoTotalWin)}
            textColor="oklch(0.3 0.11 255)"
            bgColor="oklch(0.9 0.06 255)"
          />
        </div>

        {/* 押注分數／自動次數調動條：約 6% 高度，並排兩欄 */}
        <div style={{ flex: "0 0 6%" }} className="shrink-0 grid grid-cols-2 gap-1.5 px-2">
          <AdjustTrack
            label={t.totalBetLabel}
            value={totalBet}
            min={MIN_BET * LINE_COUNT}
            max={MAX_BET * LINE_COUNT}
            step={LINE_COUNT}
            disabled={spinning || autoActive}
            onChange={(nextTotal) => adjustBet(Math.round(nextTotal / LINE_COUNT))}
            accent="oklch(0.6 0.15 55)"
          />
          <AdjustTrack
            label={t.autoCountLabel}
            value={safeAutoCountDisplay}
            min={MIN_AUTO}
            max={MAX_AUTO}
            step={10}
            disabled={autoActive}
            onChange={adjustAuto}
            accent="oklch(0.55 0.13 260)"
          />
        </div>

        {/* 開始／停止／自動按鈕列 */}
        <div style={{ flex: "0 0 5%" }} className="grid shrink-0 grid-cols-3 gap-1.5 px-2 pb-1 pt-0.5">
          <button
            onClick={() => spin(machine)}
            disabled={!canManualSpin}
            className="lp-3d-btn rounded-lg bg-green-600 py-1.5 text-xs font-bold text-white transition active:scale-95 disabled:opacity-40"
          >
            {spinning ? (t.spinningStatusLabel ?? "Spinning…") : t.startBtn}
          </button>
          <button
            onClick={stopAuto}
            disabled={!autoActive}
            className="lp-3d-btn rounded-lg bg-red-600 py-1.5 text-xs font-bold text-white transition active:scale-95 disabled:opacity-40"
          >
            {t.stopBtn}
          </button>
          <button
            onClick={() => startAuto(machine)}
            disabled={!canStartAuto}
            className="lp-3d-btn rounded-lg bg-violet-600 py-1.5 text-xs font-bold text-white transition active:scale-95 disabled:opacity-40"
          >
            {t.autoBtn}
          </button>
        </div>

      {showRules && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background">
          <div
            className="relative flex shrink-0 items-center gap-1 border-b border-border px-1.5 py-2"
            style={{ background: `linear-gradient(180deg, oklch(0.22 0.07 ${machine.hue}), oklch(0.85 0.03 55) 160%)` }}
          >
            <PiEmblem size={26} spin />
            <button
              onClick={onHome}
              aria-label="返回首頁"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
            >
              🏠
            </button>
            <p className="flex-1 truncate text-center font-serif text-base font-bold text-primary">{t.rulesTitle}</p>
            <button
              onClick={() => {
                setShowRules(false)
                setRuleSection(null)
              }}
              aria-label="返回遊戲大廳"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/70 text-base leading-none transition active:scale-90"
            >
              🎰
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="mx-auto max-w-sm space-y-2 pb-4">
              <RuleSection
                index={0}
                title={t.ruleSec1}
                open={ruleSection === 0}
                onToggle={() => setRuleSection((s) => (s === 0 ? null : 0))}
              >
                <p>{t.rulesSec1Body}</p>
              </RuleSection>

              <RuleSection
                index={1}
                title={t.ruleSec2}
                open={ruleSection === 1}
                onToggle={() => setRuleSection((s) => (s === 1 ? null : 1))}
              >
                <p className="mb-2">{t.rulesSec2Intro}</p>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[11px]">
                  {PAYLINES.map((line, i) => (
                    <div key={i} className="rounded-lg bg-muted/60 px-1.5 py-1.5">
                      <p className="font-bold" style={{ color: lineColors[i + 1] }}>
                        第{i + 1}線
                      </p>
                      <p className="text-muted-foreground">{LINE_SHAPE_NAME[i]}形</p>
                      <div className="mt-1 flex justify-center gap-[2px]">
                        {line.map((row, c) => (
                          <div key={c} className="flex flex-col gap-[2px]">
                            {[0, 1, 2].map((r) => (
                              <span
                                key={r}
                                className="block h-1.5 w-1.5 rounded-full"
                                style={{
                                  backgroundColor: r === row ? lineColors[i + 1] : "var(--muted)",
                                  opacity: r === row ? 1 : 0.4,
                                }}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </RuleSection>

              <RuleSection
                index={2}
                title={t.ruleSec3}
                open={ruleSection === 2}
                onToggle={() => setRuleSection((s) => (s === 2 ? null : 2))}
              >
                <p className="mb-2">{t.rulesSec3Intro}</p>
                <div className="space-y-1 text-xs">
                  <div className="grid grid-cols-4 gap-1 font-bold text-muted-foreground">
                    <span>{t.tableTotem}</span>
                    <span className="text-center">{t.tableLine3}</span>
                    <span className="text-center">{t.tableLine4}</span>
                    <span className="text-center">{t.tableLine5}</span>
                  </div>
                  {[...ZODIAC_SYMBOLS.map((z) => z.id), "wild" as SymbolId]
                    .sort((a, b) => PAYTABLE[a as keyof typeof PAYTABLE][3] - PAYTABLE[b as keyof typeof PAYTABLE][3])
                    .reverse()
                    .map((id) => {
                      const p = PAYTABLE[id as keyof typeof PAYTABLE]
                      return (
                        <div key={id} className="grid grid-cols-4 gap-1 rounded-lg bg-muted/50 px-2 py-1">
                          <span className="font-medium">
                            {emojiMap[id as SymbolId]} {symbolLabelMap[id as SymbolId]}
                            {id === "wild" ? "(WILD)" : ""}
                          </span>
                          <span className="text-center">{p[3]}倍</span>
                          <span className="text-center">{p[4]}倍</span>
                          <span className="text-center">{p[5]}倍</span>
                        </div>
                      )
                    })}
                </div>
              </RuleSection>

              <RuleSection
                index={3}
                title={t.ruleSec4}
                open={ruleSection === 3}
                onToggle={() => setRuleSection((s) => (s === 3 ? null : 3))}
              >
                <p className="mb-2">{t.rulesSec4Intro}</p>
                <div className="space-y-1 text-xs">
                  {Object.entries(BOARD_PAYTABLE)
                    .sort((a, b) => b[1] - a[1])
                    .map(([id, mult]) => (
                      <div key={id} className="flex items-center justify-between rounded-lg bg-muted/50 px-2 py-1">
                        <span className="font-medium">
                          {emojiMap[id as SymbolId]} {symbolLabelMap[id as SymbolId]}
                        </span>
                        <span className="font-bold text-amber-600">
                          {t.boardMultLabel} {mult}
                        </span>
                      </div>
                    ))}
                </div>
              </RuleSection>

              <RuleSection
                index={4}
                title={t.ruleSec5}
                open={ruleSection === 4}
                onToggle={() => setRuleSection((s) => (s === 4 ? null : 4))}
              >
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                    <p className="font-bold text-amber-600">
                      {emojiMap.wild} {symbolLabelMap.wild} · {t.wildSuffix}
                    </p>
                    <p className="mt-0.5 text-foreground">{t.wildBody}</p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                    <p className="font-bold text-sky-600">
                      {emojiMap.bonus} {symbolLabelMap.bonus} · {t.scatterSuffix}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {t.scatterBody} ({SCATTER_FREE_GAMES[3]}／{SCATTER_FREE_GAMES[4]}／{SCATTER_FREE_GAMES[5]})
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/50 px-2.5 py-2">
                    <p className="font-bold text-rose-600">
                      {emojiMap.wheel} {symbolLabelMap.wheel} · {t.bonusSymSuffix}
                    </p>
                    <p className="mt-0.5 text-foreground">
                      {t.bonusSymBody} ({BONUS_WHEEL_SPINS[3]}／{BONUS_WHEEL_SPINS[4]}／{BONUS_WHEEL_SPINS[5]})
                    </p>
                  </div>
                </div>
              </RuleSection>

              <RuleSection
                index={5}
                title={t.ruleSec6}
                open={ruleSection === 5}
                onToggle={() => setRuleSection((s) => (s === 5 ? null : 5))}
              >
                <p className="mb-3">{t.rulesSec6Body}</p>
                <button
                  onClick={() => {
                    try {
                      startWheelBonusTest()
                    } catch {}
                    setTestWheelForceOpen(true)
                    setShowRules(false)
                    setRuleSection(null)
                  }}
                  className="w-full rounded-full bg-rose-600 py-2 text-xs font-bold text-white transition active:scale-95"
                >
                  🎡 進入 BONUS 飛輪測試
                </button>
              </RuleSection>
            </div>
          </div>
          <div className="shrink-0 border-t border-border px-4 py-3">
            <button
              onClick={() => {
                setShowRules(false)
                setRuleSection(null)
              }}
              className="mx-auto block w-full max-w-sm rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition active:scale-95"
            >
              {t.gotIt}
            </button>
          </div>
        </div>
      )}

      {showWinLog && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center bg-background/60 px-3 pb-3"
          onClick={() => setShowWinLog(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-card p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-2 text-center font-serif text-base font-bold text-primary">🏆 {t.winLogTitle}</p>
            <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
              {history.filter((h) => h.machineId === machine.id && h.totalWin > 0).length === 0 ? (
                <p className="py-6 text-center text-xs text-muted-foreground">{t.winLogEmpty}</p>
              ) : (
                history
                  .filter((h) => h.machineId === machine.id && h.totalWin > 0)
                  .slice(0, 30)
                  .map((h) => (
                    <div key={h.id} className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">
                        {new Date(h.at).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-muted-foreground">押注 {h.bet}</span>
                      <span className="font-bold text-amber-600">+{h.totalWin}</span>
                    </div>
                  ))
              )}
            </div>
            <button
              onClick={() => setShowWinLog(false)}
              className="mt-4 w-full rounded-full bg-primary py-2 text-sm font-semibold text-primary-foreground transition active:scale-95"
            >
              關閉
            </button>
          </div>
        </div>
      )}

      <WheelBonusSheet
        open={wheelBonusOpen || testWheelForceOpen}
        stake={wheelBonusStake}
        spinsLeft={wheelBonusSpinsLeft}
        spinsTotal={wheelBonusSpinsTotal}
        round={wheelBonusRound}
        machineName={translatedThemeName}
        hue={machine.hue}
        onResolve={(multiplier) => {
          resolveWheelBonus(multiplier)
          if (testWheelForceOpen && multiplier === 0) {
            setTestWheelForceOpen(false)
          }
        }}
      />
    </div>
  )
}
