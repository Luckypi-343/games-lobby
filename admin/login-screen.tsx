"use client"

import { useState, type FormEvent } from "react"
import { adminAuthApi, type Session } from "@/lib/admin/client"
import { Button, Card, Field, inputClass } from "@/components/admin/ui"

type Step = "email" | "set_password" | "login"

export function LoginScreen({ onLoggedIn }: { onLoggedIn: (session: Session) => void }) {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  async function handleEmailSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    setBusy(true)
    setError("")
    try {
      const res = await adminAuthApi.status(trimmed)
      setStep(res.hasPassword ? "login" : "set_password")
    } catch (err: any) {
      setError(err?.message === "not_allowed" ? "此電子郵件沒有後台權限" : "無法確認帳號，請稍後再試")
    } finally {
      setBusy(false)
    }
  }

  async function handleSetPassword(e: FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError("密碼至少需要 8 個字元")
      return
    }
    if (password !== confirmPassword) {
      setError("兩次輸入的密碼不一致")
      return
    }
    setBusy(true)
    setError("")
    try {
      const res = await adminAuthApi.setPassword(email.trim().toLowerCase(), password)
      onLoggedIn({ email: res.email, token: res.token })
    } catch (err: any) {
      const map: Record<string, string> = {
        not_allowed: "此電子郵件沒有後台權限",
        password_too_short: "密碼至少需要 8 個字元",
        already_set: "此帳號已經設定過密碼，請改用登入",
      }
      setError(map[err?.message] ?? "設定失敗，請稍後再試")
      if (err?.message === "already_set") setStep("login")
    } finally {
      setBusy(false)
    }
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    if (!password) return
    setBusy(true)
    setError("")
    try {
      const res = await adminAuthApi.login(email.trim().toLowerCase(), password)
      onLoggedIn({ email: res.email, token: res.token })
    } catch (err: any) {
      const map: Record<string, string> = {
        not_allowed: "此電子郵件沒有後台權限",
        invalid_credentials: "電子郵件或密碼不正確",
        not_set_up: "此帳號尚未設定密碼",
      }
      setError(map[err?.message] ?? "登入失敗，請稍後再試")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      <Card className="w-full max-w-sm p-6">
        <div className="mb-5 flex flex-col gap-1 text-center">
          <h1 className="text-lg font-bold text-foreground">Luckypi Games 後台</h1>
          <p className="text-xs text-muted-foreground">僅限指定管理員電子郵件登入</p>
        </div>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
            <Field label="管理員電子郵件">
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} block>
              {busy ? "確認中…" : "下一步"}
            </Button>
          </form>
        )}

        {step === "set_password" && (
          <form onSubmit={handleSetPassword} className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              這是 {email.trim().toLowerCase()} 第一次登入，請設定一個密碼。
            </p>
            <Field label="設定密碼（至少 8 個字元）">
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="再次輸入密碼">
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} block>
              {busy ? "設定中…" : "設定密碼並登入"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("email")
                setError("")
                setPassword("")
                setConfirmPassword("")
              }}
              className="text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              返回
            </button>
          </form>
        )}

        {step === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">{email.trim().toLowerCase()}</p>
            <Field label="密碼">
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </Field>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} block>
              {busy ? "登入中…" : "登入"}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep("email")
                setError("")
                setPassword("")
              }}
              className="text-center text-xs text-muted-foreground underline-offset-2 hover:underline"
            >
              使用其他電子郵件
            </button>
          </form>
        )}
      </Card>
    </div>
  )
}
