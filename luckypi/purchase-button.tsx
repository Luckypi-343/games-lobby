"use client"

import { useState } from "react"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { PRODUCT_CONFIG } from "@/lib/product-config"
import { dictFor } from "@/lib/luckypi/i18n"
import { PiEmblem } from "./ui"
import { cn } from "@/lib/utils"

export function PurchaseButton({ className }: { className?: string }) {
  const { products, sdk, restoredPurchases, refreshPurchases } = usePiAuth()
  const { toast, lang } = useLuckyPi()
  const t = dictFor(lang)
  const [busy, setBusy] = useState(false)

  const product = products?.find((p) => p.id === PRODUCT_CONFIG.PRODUCT_6abb4e1c049575905d4f2095)
  const quantity = restoredPurchases?.purchases?.find((p) => p.productId === product?.slug)?.quantity ?? 0

  const handleBuy = async () => {
    if (!product || busy) return
    setBusy(true)
    try {
      const result = await sdk.makePurchase(product.slug)
      if (result.ok) {
        toast(t.purchaseSuccessTemplate.replace("{name}", product.name))
        await refreshPurchases()
      }
    } catch (err: any) {
      if (err?.code === "purchase_cancelled") {
        toast(t.purchaseCancelledLabel)
      } else if (err?.code === "product_not_found") {
        toast(t.purchaseNotFoundLabel)
      } else {
        toast(t.purchaseFailedLabel)
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleBuy}
      disabled={!product || busy}
      aria-label={product ? `${t.purchaseBuySuffix.replace("π", product.price_in_pi.toString())}` : t.purchaseUnavailableLabel}
      className={cn(
        "relative flex w-full items-center justify-between gap-3 overflow-hidden rounded-2xl border-2 border-primary bg-gradient-to-r from-primary/30 via-primary/10 to-transparent px-4 py-3 text-left shadow-[0_0_18px_-4px_var(--primary)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <PiEmblem size={32} />
        <span className="flex min-w-0 flex-col">
          <span className="flex items-center gap-1.5 truncate text-sm font-bold text-foreground">
            {product?.name ?? "Luckypi Games"}
            {quantity > 0 && (
              <span className="rounded-full bg-primary/20 px-1.5 py-0.5 font-mono text-[10px] text-primary">
                {t.purchaseOwnedPrefix} x{quantity}
              </span>
            )}
          </span>
          <span className="truncate text-[11px] text-muted-foreground">{t.purchaseAppDescLabel}</span>
        </span>
      </span>
      <span className="shrink-0 whitespace-nowrap rounded-full bg-primary px-3.5 py-1.5 text-sm font-bold text-primary-foreground">
        {busy ? t.purchaseBusyLabel : product ? `${product.price_in_pi} ${t.purchaseBuySuffix}` : t.purchaseUnavailableLabel}
      </span>
    </button>
  )
}
