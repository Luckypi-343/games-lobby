"use client"

import { useEffect, useRef, useState } from "react"
import type { PointerEvent as ReactPointerEvent } from "react"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { dictFor } from "@/lib/luckypi/i18n"

// 「祝 您 好 運！！」逐字彈出閃爍訊息：六個金色粗體字依序跳出，全部跳出後一起閃爍10次，
// 接著消失、短暫停頓，再從頭重複整個循環。常駐佔用JP／花朵／鳳鳥燈箱騰出的那塊空間。
export function GoodLuckMessage({ cellSize = "2rem" }: { cellSize?: string }) {
  const chars = ["祝", "您", "好", "運", "！", "！"]
  const [visibleCount, setVisibleCount] = useState(0)
  const [blinkOn, setBlinkOn] = useState(true)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    let alive = true
    const timers: ReturnType<typeof setTimeout>[] = []
    setVisibleCount(0)
    setBlinkOn(true)

    chars.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          if (alive) setVisibleCount(i + 1)
        }, 150 * (i + 1)),
      )
    })

    const popDuration = 150 * chars.length
    let blinkStep = 0
    function blink() {
      if (!alive) return
      setBlinkOn((prev) => !prev)
      blinkStep += 1
      if (blinkStep < 20) {
        timers.push(setTimeout(blink, 260))
      } else {
        setVisibleCount(0)
        timers.push(
          setTimeout(() => {
            if (alive) setCycle((c) => c + 1)
          }, 900),
        )
      }
    }
    timers.push(setTimeout(blink, popDuration + 250))

    return () => {
      alive = false
      timers.forEach(clearTimeout)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle])

  return (
    <div className="flex items-center justify-center gap-0.5" style={{ minHeight: cellSize }} aria-hidden="true">
      {chars.map((c, i) => (
        <span
          key={i}
          className="font-black leading-none transition-all duration-150"
          style={{
            fontSize: `calc(${cellSize} * 0.75)`,
            color: "oklch(0.8 0.17 88)",
            WebkitTextStroke: "1px oklch(0.4 0.16 50)",
            textShadow: "0 0 10px oklch(0.82 0.2 88 / 0.85), 0 2px 2px oklch(0 0 0 / 0.5)",
            opacity: i < visibleCount ? (blinkOn ? 1 : 0.15) : 0,
            transform: i < visibleCount ? "scale(1)" : "scale(0.4)",
          }}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

// 傳統水果盤「3BAR堆疊」圖騰：三條黑底白字BAR由上到下堆疊，取代🆎表情符號。
export function BarStackGlyph({ size = "lg" }: { size?: "lg" | "sm" }) {
  const barClass =
    size === "lg"
      ? "px-2 py-[2px] text-[0.62em] tracking-wider"
      : "px-1 py-px text-[0.6em] tracking-wide"
  return (
    <div className="flex flex-col items-center gap-[2px]" aria-label="BAR BAR BAR">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={`rounded-[2px] bg-neutral-950 font-black leading-none text-white ${barClass}`}
          style={{ boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.2), 0 1px 1px oklch(0 0 0 / 0.5)" }}
        >
          BAR
        </span>
      ))}
    </div>
  )
}

// 傳統水果盤頭獎「7」：粗壯圓肥造型取代純文字數字，營造立體泡泡感。
export function SevenGlyph({ fontSize }: { fontSize: string }) {
  return (
    <span
      className="inline-block font-black"
      style={{
        fontSize,
        lineHeight: 1,
        color: "oklch(0.58 0.22 25)",
        transform: "scaleX(1.24) scaleY(1.16)",
        WebkitTextStroke: "3px oklch(0.32 0.2 22)",
        textShadow: "0 3px 0 oklch(0.4 0.2 22), 0 5px 8px oklch(0.15 0.08 20 / 0.6)",
      }}
    >
      7
    </span>
  )
}

export function WelcomeBanner({ text }: { text: string }) {
  return (
    <div className="overflow-hidden rounded-full border border-border bg-card/70 py-1.5">
      <div className="lp-marquee-track flex w-max items-center gap-16 whitespace-nowrap">
        <span className="text-xs font-medium text-primary">{text}</span>
        <span className="text-xs font-medium text-primary">{text}</span>
      </div>
    </div>
  )
}

export function LoadingScreen() {
  const { lang } = useLuckyPi()
  const t = dictFor(lang)
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background text-foreground">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{t.loadingLobbyLabel}</p>
    </div>
  )
}

/** 可拖曳的浮動提示條：玩家可用手指／滑鼠按住並拖到畫面任何位置，放開後就固定停在那裡，不會擋住操作。 */
function useDraggableOffset() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number; moved: boolean } | null>(null)

  function onPointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: offset.x, baseY: offset.y, moved: false }
  }
  function onPointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return
    const dx = e.clientX - drag.current.startX
    const dy = e.clientY - drag.current.startY
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.current.moved = true
    setOffset({ x: drag.current.baseX + dx, y: drag.current.baseY + dy })
  }
  function onPointerUp() {
    drag.current = null
  }

  return { offset, onPointerDown, onPointerMove, onPointerUp }
}

export function StorageNotice() {
  const { storageTrouble, storageNoticeHosted, lang } = useLuckyPi()
  const t = dictFor(lang)
  const { offset, onPointerDown, onPointerMove, onPointerUp } = useDraggableOffset()
  // 若目前畫面已自行在特定位置顯示這個提示（見 InlineStorageNotice），
  // 這裡的全畫面置頂版本就先讓出，避免同一則訊息重複出現在兩個地方。
  if (!storageTrouble || storageNoticeHosted) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-2 z-40 flex justify-center px-4">
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="pointer-events-auto cursor-grab touch-none select-none rounded-full border border-border bg-card px-4 py-1.5 text-[11px] text-muted-foreground shadow-lg active:cursor-grabbing"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        {t.syncingAccountLabel}
      </div>
    </div>
  )
}

/**
 * 可以嵌在畫面任意位置顯示的同步提示版本（非浮動置頂）。
 * 掛載期間會通知全畫面版本讓出，避免重複顯示；卸載時自動還原。
 */
export function InlineStorageNotice({ className = "" }: { className?: string }) {
  const { storageTrouble, setStorageNoticeHosted, lang } = useLuckyPi()
  const t = dictFor(lang)

  useEffect(() => {
    setStorageNoticeHosted(true)
    return () => setStorageNoticeHosted(false)
  }, [setStorageNoticeHosted])

  if (!storageTrouble) return null
  return (
    <div className={`flex justify-center px-2 ${className}`}>
      <div className="rounded-full border border-border bg-card px-3 py-1 text-[10px] text-muted-foreground shadow-lg">
        {t.syncingAccountLabel}
      </div>
    </div>
  )
}

export function ToastHost() {
  const { toasts } = useLuckyPi()
  if (toasts.length === 0) return null
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-in fade-in rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}
