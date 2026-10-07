"use client"

import type { ReactNode } from "react"
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context"

function Gate({ children }: { children: ReactNode }) {
  const { status, retry, inPiBrowser } = usePiAuth()

  if (status === "checking") {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">正在連接您的 Pi 帳號…</p>
      </div>
    )
  }

  if (status === "unavailable") {
    if (!inPiBrowser) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
          <p className="font-serif text-lg font-bold text-foreground">請在 Pi Browser 中開啟</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Luckypi Games 需要透過您的 Pi 帳號登入才能繼續。請確認是在 Pi Browser 中開啟本應用，然後再試一次。
          </p>
          <button
            onClick={retry}
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground active:scale-95"
          >
            重新嘗試
          </button>
        </div>
      )
    }

    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
        <p className="font-serif text-lg font-bold text-foreground">連線逾時</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          與您的 Pi 帳號連線花了比較久的時間，可能是網路較慢或系統暫時忙碌。請確認網路連線正常後再試一次。
        </p>
        <button
          onClick={retry}
          className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground active:scale-95"
        >
          重新嘗試
        </button>
      </div>
    )
  }

  return <>{children}</>
}

export function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <Gate>{children}</Gate>
    </PiAuthProvider>
  )
}
