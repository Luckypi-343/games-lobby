"use client"

import { pi } from "@/lib/pi"

type Builder<T> = () => T

// Debounces + rate-limits writes to Pi user-state so we never exceed the
// storage backend's per-key / cross-key write limits, and retries with
// backoff if a write is rejected — without ever losing in-memory progress.
class KeyWriter {
  private timers = new Map<string, ReturnType<typeof setTimeout>>()
  private backoff = new Map<string, number>()
  private lastAnyWrite = 0

  schedule<T>(key: string, build: Builder<T>, immediate = false, onError?: () => void) {
    const existing = this.timers.get(key)
    if (existing) clearTimeout(existing)
    const delay = immediate ? 0 : 900
    const timer = setTimeout(() => this.flushKey(key, build, onError), delay)
    this.timers.set(key, timer)
  }

  private async flushKey<T>(key: string, build: Builder<T>, onError?: () => void) {
    const now = Date.now()
    const wait = Math.max(0, 1100 - (now - this.lastAnyWrite))
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait))
    }
    this.lastAnyWrite = Date.now()
    try {
      await pi.userState.set(key, build())
      this.backoff.delete(key)
    } catch {
      onError?.()
      const prev = this.backoff.get(key) ?? 3000
      const next = Math.min(30000, prev * 1.8)
      this.backoff.set(key, next)
      const timer = setTimeout(() => this.flushKey(key, build, onError), prev)
      this.timers.set(key, timer)
    }
  }

  flushNow<T>(key: string, build: Builder<T>) {
    const existing = this.timers.get(key)
    if (existing) clearTimeout(existing)
    void this.flushKey(key, build)
  }
}

export const luckypiWriter = new KeyWriter()
