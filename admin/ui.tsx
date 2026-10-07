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

export function IconHome(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
      <path d="M10 19v-5h4v5" />
    </S>
  )
}
export function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M15.5 12.3c2.3.4 3.8 2.1 3.8 4.4" />
    </S>
  )
}
export function IconUser(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5" />
    </S>
  )
}
export function IconCoin(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v8M9.5 9.7c0-1.1.9-1.9 2.5-1.9s2.5.7 2.5 1.7c0 2.1-5 1.3-5 3.6 0 1 1 1.7 2.5 1.7s2.5-.7 2.5-1.9" />
    </S>
  )
}
export function IconMachine(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 8h8v5H8Z" />
      <circle cx="9" cy="17" r="1" />
      <circle cx="15" cy="17" r="1" />
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
export function IconExchange(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M4 8h13M13 4l4 4-4 4" />
      <path d="M20 16H7M11 12l-4 4 4 4" />
    </S>
  )
}
export function IconBack(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M14.5 5 8 12l6.5 7" />
    </S>
  )
}
export function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.3-4.3" />
    </S>
  )
}
export function IconTrash(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" />
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
export function IconPlus(props: SVGProps<SVGSVGElement>) {
  return (
    <S {...props}>
      <path d="M12 5v14M5 12h14" />
    </S>
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
        "inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
        styles[variant],
        block && "w-full",
        className,
      )}
      {...props}
    />
  )
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-xl border border-border bg-card", className)} {...props} />
}

type PillTone = "neutral" | "gold" | "jade" | "red" | "blue"

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
    gold: "bg-primary/15 text-primary",
    jade: "bg-accent/20 text-accent",
    red: "bg-destructive/15 text-destructive",
    blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  }
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone], className)}>
      {children}
    </span>
  )
}

export function StatTile({ label, value, tone }: { label: string; value: ReactNode; tone?: PillTone }) {
  return (
    <Card className="flex flex-col gap-1 p-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-2xl font-bold tabular-nums", tone === "gold" && "text-primary")}>{value}</span>
    </Card>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center gap-2 py-12 text-center text-sm text-muted-foreground">{children}</div>
}
