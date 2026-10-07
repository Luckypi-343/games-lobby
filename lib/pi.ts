"use client"

// Client for the Pi Network connection used by this app (sign-in + payments).
// Loads Pi Network's real, official SDK script and uses its documented
// `init` + `authenticate` + `createPayment` calls. Nothing here is invented —
// these are the genuine, publicly documented endpoints Pi Network provides.

import { PRODUCT_CONFIG } from "@/lib/product-config"

export type UserStateRecord<T = unknown> = {
  blob: T
  updatedAt: number
  version: number
}

export type PiUser = { uid: string; username: string } | null

declare global {
  interface Window {
    Pi?: {
      init: (opts: { version: string; sandbox?: boolean }) => void
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: unknown) => void,
      ) => Promise<{ user: { uid: string; username: string }; accessToken: string }>
      createPayment: (
        paymentData: { amount: number; memo: string; metadata?: Record<string, unknown> },
        callbacks: {
          onReadyForServerApproval: (paymentId: string) => void
          onReadyForServerCompletion: (paymentId: string, txid: string) => void
          onCancel: (paymentId: string) => void
          onError: (error: Error, payment?: unknown) => void
        },
      ) => void
      [key: string]: any
    }
  }
}

const PI_SDK_SRC = "https://sdk.minepi.com/pi-sdk.js"
const SCRIPT_TIMEOUT_MS = 10000
const AUTH_TIMEOUT_MS = 12000

let cachedUser: PiUser = null
let cachedAccessToken: string | null = null
let inited = false
let scriptPromise: Promise<void> | null = null

export function isPiBrowser(): boolean {
  if (typeof navigator === "undefined") return false
  return /PiBrowser/i.test(navigator.userAgent)
}

function loadScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.reject(new Error("no document"))
  if (window.Pi) return Promise.resolve()
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById("pi-network-sdk") as HTMLScriptElement | null
    const finish = () => (window.Pi ? resolve() : reject(new Error("Pi SDK script loaded without exposing window.Pi")))
    if (existing) {
      if (window.Pi) return resolve()
      existing.addEventListener("load", finish)
      existing.addEventListener("error", () => reject(new Error("failed to load Pi SDK script")))
      return
    }
    const script = document.createElement("script")
    script.id = "pi-network-sdk"
    script.src = PI_SDK_SRC
    script.async = true
    const timer = setTimeout(() => reject(new Error("timed out loading Pi SDK script")), SCRIPT_TIMEOUT_MS)
    script.addEventListener("load", () => {
      clearTimeout(timer)
      finish()
    })
    script.addEventListener("error", () => {
      clearTimeout(timer)
      reject(new Error("failed to load Pi SDK script"))
    })
    document.head.appendChild(script)
  })

  return scriptPromise
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (err) => {
        clearTimeout(timer)
        reject(err)
      },
    )
  })
}

async function stateRequest(action: string, extra: Record<string, unknown> = {}): Promise<any> {
  if (!cachedUser || !cachedAccessToken) return null
  try {
    const res = await fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, uid: cachedUser.uid, accessToken: cachedAccessToken, ...extra }),
    })
    if (!res.ok) return null
    return await res.json()
  } catch (err) {
    console.log("[v0] Pi userState request failed:", action, err)
    return null
  }
}

export const pi = {
  auth: {
    async getUser(): Promise<PiUser> {
      return cachedUser
    },
    async login(): Promise<PiUser> {
      try {
        await withTimeout(loadScript(), SCRIPT_TIMEOUT_MS, "Pi SDK script did not load in time")
      } catch (err) {
        console.log("[v0] Pi auth: SDK script failed to load:", err)
        return null
      }
      const Pi = window.Pi
      if (!Pi) {
        console.log("[v0] Pi auth: window.Pi missing after script load")
        return null
      }
      try {
        if (!inited) {
          Pi.init({ version: "2.0", sandbox: false })
          inited = true
        }
        const result = await withTimeout(
          Pi.authenticate(["username", "payments"], () => {}),
          AUTH_TIMEOUT_MS,
          "Pi authenticate timed out",
        )
        const user = result?.user
        if (!user?.uid) {
          console.log("[v0] Pi auth: authenticate returned no user")
          return null
        }
        cachedUser = { uid: String(user.uid), username: String(user.username ?? "") }
        cachedAccessToken = result?.accessToken ? String(result.accessToken) : null
        return cachedUser
      } catch (err) {
        console.log("[v0] Pi auth: authenticate failed:", err)
        return null
      }
    },
    // The current session's Pi access token, used to prove identity to our
    // own server routes (per-player storage, exchange crediting, admin
    // login). Never sent anywhere except this app's own /api/* routes.
    getAccessToken(): string | null {
      return cachedAccessToken
    },
  },
  // Per-user save/load storage, backed by a real shared database. Every
  // call is verified server-side against the current Pi session before it
  // can touch this uid's row, so this is safe to call as soon as the user
  // is signed in.
  userState: {
    async get<T = unknown>(key: string): Promise<UserStateRecord<T> | null> {
      const data = await stateRequest("get", { key })
      return (data?.record as UserStateRecord<T> | undefined) ?? null
    },
    async set<T = unknown>(key: string, value: T): Promise<void> {
      const data = await stateRequest("set", { key, value })
      if (!data?.ok) throw new Error("userState.set failed")
    },
    async delete(key: string): Promise<void> {
      await stateRequest("delete", { key })
    },
    async keys(): Promise<string[]> {
      const data = await stateRequest("keys")
      return Array.isArray(data?.keys) ? data.keys : []
    },
  },
  isReady(): boolean {
    return typeof window !== "undefined" && !!window.Pi
  },
}

// ---------------------------------------------------------------------------
// Shop products + real Pi payments (Pi.createPayment, approved/completed by
// the server routes in app/api/pi/*, which call the genuine Pi Platform API).
// ---------------------------------------------------------------------------

export type Product = {
  id: string
  slug: string
  name: string
  description: string
  price_in_pi: number
}

export const PRODUCTS: Product[] = [
  {
    id: PRODUCT_CONFIG.PRODUCT_6abb4e1c049575905d4f2095,
    slug: PRODUCT_CONFIG.PRODUCT_6abb4e1c049575905d4f2095,
    name: "Luckypi Games",
    description: "提供多元手遊款式，讓pi友盡興玩樂。",
    price_in_pi: 1,
  },
]

export type PurchaseErrorCode = "product_not_found" | "purchase_cancelled" | "purchase_error"
export type PurchaseError = { code: PurchaseErrorCode; message?: string }
export type PurchaseResult = { ok: true; productId: string; paymentId: string; txid: string }
export type PurchaseRecord = { productId: string; quantity: number }

const PURCHASES_KEY = "luckypi.purchases"

function sanitizePurchases(blob: unknown): PurchaseRecord[] {
  const items = blob && typeof blob === "object" ? (blob as any).items : null
  if (!Array.isArray(items)) return []
  const out: PurchaseRecord[] = []
  for (const it of items) {
    if (!it || typeof it !== "object") continue
    const productId = typeof it.productId === "string" ? it.productId.slice(0, 64) : ""
    const quantity = Number.isFinite(it.quantity) ? Math.max(0, Math.floor(it.quantity)) : 0
    if (productId) out.push({ productId, quantity })
    if (out.length >= 64) break
  }
  return out
}

async function loadPurchases(): Promise<PurchaseRecord[]> {
  const rec = await pi.userState.get(PURCHASES_KEY)
  return rec ? sanitizePurchases(rec.blob) : []
}

async function savePurchases(list: PurchaseRecord[]): Promise<void> {
  await pi.userState.set(PURCHASES_KEY, { items: list })
}

async function addPurchase(productId: string, qty: number): Promise<void> {
  const list = await loadPurchases()
  const idx = list.findIndex((p) => p.productId === productId)
  if (idx >= 0) list[idx] = { productId, quantity: list[idx].quantity + qty }
  else list.push({ productId, quantity: qty })
  await savePurchases(list)
}

async function consumeProduct(productId: string, qty: number): Promise<void> {
  const list = await loadPurchases()
  const idx = list.findIndex((p) => p.productId === productId)
  if (idx < 0) return
  list[idx] = { productId, quantity: Math.max(0, list[idx].quantity - qty) }
  await savePurchases(list)
}

export async function getRestoredPurchases(): Promise<{ purchases: PurchaseRecord[] }> {
  return { purchases: await loadPurchases() }
}

async function postJson(url: string, body: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}

async function makePurchase(slug: string): Promise<PurchaseResult> {
  const product = PRODUCTS.find((p) => p.slug === slug)
  if (!product) {
    return Promise.reject({ code: "product_not_found" } as PurchaseError)
  }

  try {
    await withTimeout(loadScript(), SCRIPT_TIMEOUT_MS, "Pi SDK script did not load in time")
  } catch (err) {
    console.log("[v0] Pi payment: SDK script failed to load:", err)
    return Promise.reject({ code: "purchase_error", message: "Pi SDK 尚未載入" } as PurchaseError)
  }

  const Pi = window.Pi
  if (!Pi || typeof Pi.createPayment !== "function") {
    return Promise.reject({ code: "purchase_error", message: "Pi 付款功能尚未就緒" } as PurchaseError)
  }

  if (!inited) {
    Pi.init({ version: "2.0", sandbox: false })
    inited = true
  }

  return new Promise<PurchaseResult>((resolve, reject) => {
    let settled = false
    const finishOk = (result: PurchaseResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }
    const finishErr = (error: PurchaseError) => {
      if (settled) return
      settled = true
      reject(error)
    }

    try {
      Pi.createPayment(
        {
          amount: product.price_in_pi,
          memo: product.name,
          metadata: { productId: product.id },
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            postJson("/api/pi/approve", { paymentId }).then((ok) => {
              if (!ok) {
                console.log("[v0] Pi payment: approve request failed", paymentId)
                finishErr({ code: "purchase_error", message: "付款核准失敗" })
              }
            })
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            postJson("/api/pi/complete", { paymentId, txid }).then(async (ok) => {
              if (!ok) {
                console.log("[v0] Pi payment: complete request failed", paymentId, txid)
                finishErr({ code: "purchase_error", message: "付款確認失敗" })
                return
              }
              try {
                await addPurchase(product.id, 1)
              } catch (err) {
                console.log("[v0] Pi payment: failed to record purchase:", err)
              }
              finishOk({ ok: true, productId: product.id, paymentId, txid })
            })
          },
          onCancel: () => {
            finishErr({ code: "purchase_cancelled" })
          },
          onError: (error: Error) => {
            console.log("[v0] Pi payment: createPayment error:", error)
            finishErr({ code: "purchase_error", message: error?.message })
          },
        },
      )
    } catch (err) {
      console.log("[v0] Pi payment: failed to start createPayment:", err)
      finishErr({ code: "purchase_error", message: "無法啟動付款" })
    }
  })
}

export type ExchangeErrorCode = "purchase_cancelled" | "purchase_error"
export type ExchangeError = { code: ExchangeErrorCode; message?: string }
export type ExchangeResult = { ok: true; paymentId: string; txid: string; credited: boolean; coinsAwarded: number }

// Real Pi payment for the Pi → pi玩幣 exchange. The amount is whatever the
// player chose (not a fixed catalog price), so this talks to Pi's payment
// API directly rather than going through the fixed-price product catalog.
// Coins are only ever granted by the server in /api/exchange/complete,
// after it verifies the payment really completed on Pi's side.
async function exchangePi(amount: number): Promise<ExchangeResult> {
  if (!cachedUser || !cachedAccessToken) {
    return Promise.reject({ code: "purchase_error", message: "尚未登入" } as ExchangeError)
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return Promise.reject({ code: "purchase_error", message: "兌換金額不正確" } as ExchangeError)
  }

  try {
    await withTimeout(loadScript(), SCRIPT_TIMEOUT_MS, "Pi SDK script did not load in time")
  } catch (err) {
    console.log("[v0] Pi exchange: SDK script failed to load:", err)
    return Promise.reject({ code: "purchase_error", message: "Pi SDK 尚未載入" } as ExchangeError)
  }

  const Pi = window.Pi
  if (!Pi || typeof Pi.createPayment !== "function") {
    return Promise.reject({ code: "purchase_error", message: "Pi 付款功能尚未就緒" } as ExchangeError)
  }
  if (!inited) {
    Pi.init({ version: "2.0", sandbox: false })
    inited = true
  }

  const uid = cachedUser.uid
  const accessToken = cachedAccessToken

  return new Promise<ExchangeResult>((resolve, reject) => {
    let settled = false
    const finishOk = (result: ExchangeResult) => {
      if (settled) return
      settled = true
      resolve(result)
    }
    const finishErr = (error: ExchangeError) => {
      if (settled) return
      settled = true
      reject(error)
    }

    try {
      Pi.createPayment(
        {
          amount,
          memo: "Luckypi Games 兌換 pi玩幣",
          metadata: { type: "exchange" },
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            postJson("/api/pi/approve", { paymentId }).then((ok) => {
              if (!ok) {
                console.log("[v0] Pi exchange: approve request failed", paymentId)
                finishErr({ code: "purchase_error", message: "付款核准失敗" })
              }
            })
          },
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            fetch("/api/exchange/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ uid, accessToken, paymentId, txid, amount }),
            })
              .then(async (res) => {
                if (!res.ok) {
                  console.log("[v0] Pi exchange: complete request failed", paymentId, txid)
                  finishErr({ code: "purchase_error", message: "付款確認失敗" })
                  return
                }
                const data = await res.json().catch(() => null)
                if (!data?.ok) {
                  finishErr({ code: "purchase_error", message: "付款確認失敗" })
                  return
                }
                finishOk({
                  ok: true,
                  paymentId,
                  txid,
                  credited: !!data.credited,
                  coinsAwarded: Number(data.coinsAwarded) || 0,
                })
              })
              .catch((err) => {
                console.log("[v0] Pi exchange: complete request error:", err)
                finishErr({ code: "purchase_error", message: "付款確認失敗" })
              })
          },
          onCancel: () => {
            finishErr({ code: "purchase_cancelled" })
          },
          onError: (error: Error) => {
            console.log("[v0] Pi exchange: createPayment error:", error)
            finishErr({ code: "purchase_error", message: error?.message })
          },
        },
      )
    } catch (err) {
      console.log("[v0] Pi exchange: failed to start createPayment:", err)
      finishErr({ code: "purchase_error", message: "無法啟動付款" })
    }
  })
}

export const sdk = {
  products: PRODUCTS,
  makePurchase,
  exchangePi,
  state: {
    consume: consumeProduct,
  },
}
