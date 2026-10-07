"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import { Button, Card, IconBrain, IconSpade, IconCoin, IconMedal, IconBolt, IconCrown, IconGlobe, IconCheck } from "./ui"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { LANGS, dictFor, type LangId } from "@/lib/luckypi/i18n"

const NEON_VARS: CSSProperties = {
  "--neon-pink": "#ff2fd6",
  "--neon-cyan": "#22e8ff",
  "--neon-gold": "#ffd447",
  "--neon-violet": "#9b5bff",
} as CSSProperties

function PiLogoBadge() {
  return (
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 font-serif text-lg font-black"
      style={{
        borderColor: "var(--neon-gold)",
        color: "var(--neon-gold)",
        background: "radial-gradient(circle at 35% 30%, rgba(255,212,71,0.25), rgba(0,0,0,0.6))",
        boxShadow: "0 0 16px -2px var(--neon-gold)",
        animation: "luckypi-spin 5s linear infinite",
      }}
      aria-hidden
    >
      π
    </span>
  )
}

function LanguagePicker({ lang, onChange }: { lang: LangId; onChange: (l: LangId) => void }) {
  const [open, setOpen] = useState(false)
  const dict = dictFor(lang)
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label={dict.languagePicker}
        onClick={() => setOpen((o) => !o)}
        className="flex h-11 w-11 items-center justify-center rounded-full border-2"
        style={{
          borderColor: "var(--neon-cyan)",
          color: "var(--neon-cyan)",
          background: "radial-gradient(circle at 65% 30%, rgba(34,232,255,0.22), rgba(0,0,0,0.6))",
          boxShadow: "0 0 16px -2px var(--neon-cyan)",
          animation: open ? undefined : "luckypi-spin 7s linear infinite",
        }}
      >
        <IconGlobe className="h-5 w-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-[150]" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-14 z-[151] max-h-72 w-48 overflow-y-auto rounded-2xl border-2 bg-neutral-950 p-1.5"
            style={{ borderColor: "var(--neon-cyan)", boxShadow: "0 0 24px -6px var(--neon-cyan)" }}
          >
            {LANGS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => {
                  onChange(l.id)
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-neutral-200 hover:bg-neutral-800"
              >
                <span>{l.native}</span>
                {l.id === lang && <IconCheck className="h-4 w-4" style={{ color: "var(--neon-cyan)" }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function NeonTitle({ lang, onChangeLang }: { lang: LangId; onChangeLang: (l: LangId) => void }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <div className="flex w-full items-center justify-between gap-2">
        <PiLogoBadge />
        <h1
          className="flex-1 font-serif text-2xl font-black tracking-tight text-balance"
          style={{ color: "var(--neon-gold)", textShadow: "0 0 14px var(--neon-gold), 0 0 34px rgba(255,212,71,0.55)" }}
        >
          Luckypi Games 🪩
        </h1>
        <LanguagePicker lang={lang} onChange={onChangeLang} />
      </div>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  accent,
  children,
}: {
  icon: ReactNode
  title: string
  accent: "pink" | "cyan" | "gold" | "violet"
  children: ReactNode
}) {
  const colorVar = `var(--neon-${accent})`
  return (
    <Card
      className="border-2 bg-black/40 p-4"
      style={{ borderColor: `color-mix(in oklch, ${colorVar} 55%, transparent)`, boxShadow: `0 0 22px -6px ${colorVar}` }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full border"
          style={{ borderColor: colorVar, color: colorVar, boxShadow: `0 0 10px ${colorVar}` }}
        >
          {icon}
        </span>
        <h3 className="text-sm font-bold" style={{ color: colorVar }}>
          {title}
        </h3>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-neutral-300">{children}</p>
    </Card>
  )
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  accent,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  accent: "pink" | "gold"
}) {
  const colorVar = `var(--neon-${accent})`
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-semibold text-neutral-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-2 bg-black/50 px-3 py-2 text-sm text-white outline-none placeholder:text-neutral-600"
        style={{ borderColor: "rgba(255,255,255,0.12)" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = colorVar)}
        onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
      />
    </label>
  )
}

function JoinFriendSheet({ onClose, lang }: { onClose: () => void; lang: LangId }) {
  const dict = dictFor(lang)
  const [copied, setCopied] = useState(false)
  const link = "minepi.com/Jsc343"
  return (
    <div className="fixed inset-0 z-[140] flex flex-col justify-end bg-black/70" onClick={onClose}>
      <div
        className="rounded-t-3xl border-t-2 bg-neutral-950 p-5"
        style={{ borderColor: "var(--neon-cyan)", boxShadow: "0 -8px 40px -12px var(--neon-cyan)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-700" />
        <h2 className="font-serif text-lg font-bold" style={{ color: "var(--neon-cyan)" }}>
          {dict.joinFriendTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-300">{dict.joinFriendBody}</p>
        <Card className="mt-3 border border-neutral-800 bg-neutral-900 p-3">
          <p className="break-all text-sm font-semibold text-neutral-100">{link}</p>
        </Card>
        <Button
          block
          className="mt-4 border-0 text-sm font-bold text-black"
          style={{ background: "linear-gradient(135deg, var(--neon-cyan), #b8fbff)" }}
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(link)
              setCopied(true)
              setTimeout(() => setCopied(false), 1800)
            } catch {}
          }}
        >
          {copied ? dict.copied : dict.copyLink}
        </Button>
        <Button block variant="ghost" className="mt-2 text-neutral-400" onClick={onClose}>
          ✕
        </Button>
      </div>
    </div>
  )
}

export function HomeScreen({
  onPlay,
  onExchange,
}: {
  onPlay: (mode: "trial" | "pi") => void
  onExchange: () => void
}) {
  const { lang, setLang, trialName, piDisplayName, setTrialName, setPiDisplayName } = useLuckyPi()
  const dict = dictFor(lang)

  const [joinOpen, setJoinOpen] = useState(false)
  const [trialUser, setTrialUser] = useState(trialName ?? "")
  const [trialEmail, setTrialEmail] = useState("")
  const [trialPass, setTrialPass] = useState("")
  const [piUser, setPiUser] = useState(piDisplayName ?? "")
  const [piEmail, setPiEmail] = useState("")
  const [piPass, setPiPass] = useState("")

  const trialReady = trialUser.trim() && trialEmail.trim() && trialPass.trim()
  const piReady = piUser.trim() && piEmail.trim() && piPass.trim()

  return (
    <div
      className="min-h-dvh bg-gradient-to-b from-black via-neutral-950 to-black px-4 pb-10 pt-8 text-white"
      style={NEON_VARS}
    >
      <style>{`@keyframes luckypi-spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      <NeonTitle lang={lang} onChangeLang={setLang} />

      <div className="mt-6 grid grid-cols-1 gap-3">
        <InfoCard icon={<IconMedal className="h-4 w-4" />} title={dict.purposeTitle} accent="violet">
          {dict.purposeBody}
        </InfoCard>
        <InfoCard icon={<IconCoin className="h-4 w-4" />} title={dict.ecosystemTitle} accent="gold">
          {dict.ecosystemBody}
        </InfoCard>
        <InfoCard icon={<IconCrown className="h-4 w-4" />} title={dict.spiritTitle} accent="pink">
          {dict.spiritBody}
        </InfoCard>
        <InfoCard icon={<IconSpade className="h-4 w-4" />} title={dict.contentTitle} accent="cyan">
          {dict.contentBody}
        </InfoCard>
        <InfoCard icon={<IconBrain className="h-4 w-4" />} title={dict.secureTitle} accent="violet">
          {dict.secureBody}
        </InfoCard>
        <InfoCard icon={<IconBolt className="h-4 w-4" />} title={dict.fastTitle} accent="gold">
          {dict.fastBody}
        </InfoCard>
        <InfoCard icon={<IconMedal className="h-4 w-4" />} title={dict.entryTitle} accent="pink">
          {dict.entryBody}
        </InfoCard>
      </div>

      <div className="mt-7 space-y-3">
        <Card className="border-2 bg-black/40 p-4" style={{ borderColor: "color-mix(in oklch, var(--neon-pink) 45%, transparent)" }}>
          <div className="grid grid-cols-1 gap-2.5">
            <FieldInput label={dict.usernameLabel} value={trialUser} onChange={setTrialUser} accent="pink" />
            <FieldInput label={dict.emailLabel} value={trialEmail} onChange={setTrialEmail} type="email" accent="pink" />
            <FieldInput label={dict.passwordLabel} value={trialPass} onChange={setTrialPass} type="password" accent="pink" />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">{dict.fillAllToContinue}</p>
          <Button
            block
            disabled={!trialReady}
            onClick={() => {
              setTrialName(trialUser)
              onPlay("trial")
            }}
            className="mt-3 border-0 text-sm font-bold"
            style={{
              background: "linear-gradient(135deg, var(--neon-pink), var(--neon-violet))",
              boxShadow: "0 0 22px -4px var(--neon-pink)",
            }}
          >
            🎮 {dict.trialModeBtn}
          </Button>
        </Card>

        <Card className="border-2 bg-black/40 p-4" style={{ borderColor: "color-mix(in oklch, var(--neon-gold) 45%, transparent)" }}>
          <div className="grid grid-cols-1 gap-2.5">
            <FieldInput label={dict.piUsernameLabel} value={piUser} onChange={setPiUser} accent="gold" />
            <FieldInput label={dict.piEmailLabel} value={piEmail} onChange={setPiEmail} type="email" accent="gold" />
            <FieldInput label={dict.passwordLabel} value={piPass} onChange={setPiPass} type="password" accent="gold" />
          </div>
          <p className="mt-2 text-[11px] text-neutral-500">{dict.fillAllToContinue}</p>
          <Button
            block
            disabled={!piReady}
            onClick={() => {
              setPiDisplayName(piUser)
              onPlay("pi")
            }}
            className="mt-3 border-0 text-sm font-bold text-black"
            style={{
              background: "linear-gradient(135deg, var(--neon-gold), #fff3c4)",
              boxShadow: "0 0 22px -4px var(--neon-gold)",
            }}
          >
            π {dict.piModeBtn}
          </Button>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Button
            block
            variant="outline"
            onClick={() => setJoinOpen(true)}
            className="text-xs font-semibold"
            style={{ borderColor: "var(--neon-cyan)", color: "var(--neon-cyan)" }}
          >
            {dict.joinFriendBtn}
          </Button>
          <Button
            block
            variant="outline"
            onClick={onExchange}
            className="text-xs font-semibold"
            style={{ borderColor: "var(--neon-violet)", color: "var(--neon-violet)" }}
          >
            {dict.exchangeBtn}
          </Button>
        </div>
      </div>

      <p className="mt-8 text-center text-[11px] text-neutral-500">{dict.footerNote}</p>

      {joinOpen && <JoinFriendSheet lang={lang} onClose={() => setJoinOpen(false)} />}
    </div>
  )
}
