"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"
import { pi, isPiBrowser, sdk, getRestoredPurchases, type PiUser, type Product, type PurchaseRecord } from "@/lib/pi"

type AuthStatus = "checking" | "authenticated" | "unavailable"

interface RestoredPurchases {
  purchases: PurchaseRecord[]
}

interface PiAuthContextValue {
  status: AuthStatus
  user: PiUser
  inPiBrowser: boolean
  retry: () => void
  products: Product[]
  sdk: typeof sdk
  restoredPurchases: RestoredPurchases | null
  refreshPurchases: () => Promise<void>
}

const PiAuthContext = createContext<PiAuthContextValue | null>(null)

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("checking")
  const [user, setUser] = useState<PiUser>(null)
  const [attempt, setAttempt] = useState(0)
  const [inPiBrowser, setInPiBrowser] = useState(true)
  const [restoredPurchases, setRestoredPurchases] = useState<RestoredPurchases | null>(null)

  const refreshPurchases = useCallback(async () => {
    const result = await getRestoredPurchases()
    setRestoredPurchases(result)
  }, [])

  useEffect(() => {
    if (status !== "authenticated") return
    let cancelled = false
    ;(async () => {
      const result = await getRestoredPurchases()
      if (!cancelled) setRestoredPurchases(result)
    })()
    return () => {
      cancelled = true
    }
  }, [status])

  useEffect(() => {
    let cancelled = false
    setStatus("checking")
    setInPiBrowser(isPiBrowser())

    ;(async () => {
      const existing = await pi.auth.getUser()
      if (existing) {
        if (!cancelled) {
          setUser(existing)
          setStatus("authenticated")
        }
        return
      }
      const logged = await pi.auth.login()
      if (cancelled) return
      if (logged) {
        setUser(logged)
        setStatus("authenticated")
      } else {
        setStatus("unavailable")
      }
    })()

    return () => {
      cancelled = true
    }
  }, [attempt])

  return (
    <PiAuthContext.Provider
      value={{
        status,
        user,
        inPiBrowser,
        retry: () => setAttempt((a) => a + 1),
        products: sdk.products,
        sdk,
        restoredPurchases,
        refreshPurchases,
      }}
    >
      {children}
    </PiAuthContext.Provider>
  )
}

export function usePiAuth() {
  const ctx = useContext(PiAuthContext)
  if (!ctx) throw new Error("usePiAuth must be used within a PiAuthProvider")
  return ctx
}
