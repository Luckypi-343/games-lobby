import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, SVGProps } from "react"
import { cn } from "@/lib/utils"

function S({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-4 w-4", className)}
      {...props}
    />
  )
}

export function IconBrain(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M9 4.5a2.5 2.5 0 0 0-2.5 2.5v.3A2.7 2.7 0 0 0 5 9.7v1.1a2.6 2.6 0 0 0-1 2.1c0 1 .6 1.8 1.4 2.2a2.6 2.6 0 0 0 2.4 3.4h.7A2.5 2.5 0 0 0 11 19V6a1.5 1.5 0 0 0-2-1.5Z" />
      <path d="M15 4.5a2.5 2.5 0 0 1 2.5 2.5v.3a2.7 2.7 0 0 1 1.5 2.4v1.1a2.6 2.6 0 0 1 1 2.1c0 1-.6 1.8-1.4 2.2a2.6 2.6 0 0 1-2.4 3.4h-.7A2.5 2.5 0 0 1 13 19V6a1.5 1.5 0 0 1 2-1.5Z" />
    </S>
  )
}

export function IconSpade(props: SVGProps<SVGSVGElement>) {
  return (
    <S fill="currentColor" stroke="none" {...props}>
      <path d="M12 3c2.5 3.2 6.5 6 6.5 9.6a4 4 0 0 1-6 3.5c.3 1.5 1 2.6 2 3.4H9.5c1-.8 1.7-1.9 2-3.4a4 4 0 0 1-6-3.5C5.5 9 9.5 6.2 12 3Z" />
    </S>
  )
}

export function IconCoin(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="5.5" strokeDasharray="1.5 2.4" />
      <path d="M12 9v6M10.3 10.5c0-.9.8-1.5 1.7-1.5s1.7.5 1.7 1.3c0 1.7-3.4 1-3.4 2.9 0 .8.8 1.3 1.7 1.3s1.7-.6 1.7-1.5" />
    </S>
  )
}

export function IconMedal(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M7 3h10l-3.2 6.2L17 14l-5-2.6L7 14l3.2-4.8Z" />
      <circle cx="12" cy="15.5" r="4.5" />
      <path d="M10.2 15.5h3.6M12 13.7v3.6" strokeWidth={1.4} />
    </S>
  )
}

export function IconBolt(props: SVGProps<SVGSVGElement>) {
  return (
    <S fill="currentColor" stroke="none" {...props}>
      <path d="M13 2 4 14h5.5L10 22l9-13h-5.5Z" />
    </S>
  )
}

export function IconCrown(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M4 8.5 8 12l4-6 4 6 4-3.5V17H4Z" />
      <path d="M4 17h16v2.5H4Z" />
    </S>
  )
}

export function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </S>
  )
}

export function IconGear(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.6 7.5l1.9 1.1M17.5 15.4l1.9 1.1M4.6 16.5l1.9-1.1M17.5 8.6l1.9-1.1M3.5 12h2.2M18.3 12h2.2" />
    </S>
  )
}

export function IconMegaphone(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M3 10v4a1 1 0 0 0 1 1h2l10 4V5L6 9H4a1 1 0 0 0-1 1Z" />
      <path d="M17 9.5a3.5 3.5 0 0 1 0 5" />
    </S>
  )
}

export function IconChat(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M4 5h16v11H9l-4 4v-4H4Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </S>
  )
}

export function IconGlobe(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.4 2.3 3.6 5.3 3.6 8.5s-1.2 6.2-3.6 8.5c-2.4-2.3-3.6-5.3-3.6-8.5s1.2-6.2 3.6-8.5Z" />
    </S>
  )
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M5 12.5 9.5 17 19 6.5" />
    </S>
  )
}

// Pi 的仿真商標：金屬圓形徽章 + 粗體 π 字標，取代原本單純的🟣色球 emoji，
// 讓所有出現「Pi 相關」標題的地方（首頁、大廳、遊戲頁面、設定／公告／反饋面板）都用同一個徽章。
export function PiEmblem({ size = 28, spin = false }: { size?: number; spin?: boolean }) {
  return (
    <span
      className="relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        // 金環改用「內距+雙層背景」做出來，不再用 border-image（border-image 不會服從
        // border-radius，畫出來的會是方形相框，這正是徽章看起來變四方形的真正原因）。
        background: "conic-gradient(from 135deg, #ffe9a8, #d9a13a 30%, #8a5f16 55%, #ffe9a8 78%, #d9a13a 100%)",
        padding: Math.max(1.5, size * 0.07),
        boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
        animation: spin ? "luckypi-spin 6s linear infinite" : undefined,
      }}
      aria-hidden
    >
      <span
        className="relative flex h-full w-full items-center justify-center rounded-full"
        style={{
          borderRadius: "50%",
          background: "radial-gradient(circle at 32% 28%, #3a3a3a, #0c0c0c 72%)",
          boxShadow: "inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 3px rgba(0,0,0,0.6)",
        }}
      >
      <svg viewBox="0 0 24 24" width={size * 0.56} height={size * 0.56} style={{ position: "relative" }}>
        <defs>
          <linearGradient id="piGoldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff2c8" />
            <stop offset="55%" stopColor="#ffcf4d" />
            <stop offset="100%" stopColor="#c98d1e" />
          </linearGradient>
        </defs>
        <path
          d="M4 6.4h15.4M8 6.4v12.2c0 1 .5 1.6 1.3 1.6M16.6 6.4v12.2c0 1 .5 1.6 1.3 1.6"
          fill="none"
          stroke="url(#piGoldGrad)"
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      </span>
    </span>
  )
}

type ButtonVariant = "primary" | "solid" | "outline" | "ghost" | "danger"

export function Button({
  className,
  variant = "primary",
  block,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; block?: boolean }) {
  const styles: Record<ButtonVariant, string> = {
    primary: "bg-primary text-primary-foreground hover:brightness-110",
    solid: "bg-secondary text-secondary-foreground hover:brightness-110",
    outline: "border border-border bg-transparent text-foreground hover:bg-muted",
    ghost: "bg-transparent text-foreground hover:bg-muted",
    danger: "bg-destructive text-destructive-foreground hover:brightness-110",
  }
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        styles[variant],
        block && "w-full",
        className,
      )}
      {...props}
    />
  )
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-2xl border border-border bg-card", className)} {...props} />
}

type PillTone = "neutral" | "gold" | "jade" | "red"

export function Pill({
  className,
  tone = "neutral",
  children,
}: {
  className?: string
  tone?: PillTone
  children: ReactNode
}) {
  const tones: Record<PillTone, string> = {
    neutral: "bg-muted text-muted-foreground",
    gold: "bg-primary/20 text-primary",
    jade: "bg-accent/20 text-accent",
    red: "bg-secondary text-secondary-foreground",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
