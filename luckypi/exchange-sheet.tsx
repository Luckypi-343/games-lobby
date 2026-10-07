"use client"

import { useMemo, useState } from "react"
import { COINS_PER_PI, formatCoins } from "@/lib/luckypi/data"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { usePiAuth } from "@/contexts/pi-auth-context"
import type { ExchangeError } from "@/lib/pi"
import { Button, Card, IconCheck, IconHome, PiEmblem } from "./ui"

type Step = "info" | "amount" | "processing" | "done"

export function ExchangeSheet({
  onClose,
  onBackToHome,
  onBackToLobby,
}: {
  onClose: () => void
  onBackToHome?: () => void
  onBackToLobby?: () => void
}) {
  const { addPiCoins, toast } = useLuckyPi()
  const { sdk, user } = usePiAuth()

  const [step, setStep] = useState<Step>("info")
  const [amountInput, setAmountInput] = useState("")
  const [awardedCoins, setAwardedCoins] = useState(0)
  const [paying, setPaying] = useState(false)

  const amount = useMemo(() => {
    const n = Number.parseFloat(amountInput)
    return Number.isFinite(n) && n > 0 ? n : 0
  }, [amountInput])
  const previewCoins = Math.round(amount * COINS_PER_PI)

  const startPayment = async () => {
    if (amount <= 0 || paying) return
    setPaying(true)
    setStep("processing")
    try {
      const result = await sdk.exchangePi(amount)
      if (result.credited && result.coinsAwarded > 0) {
        addPiCoins(result.coinsAwarded)
      }
      setAwardedCoins(result.coinsAwarded)
      setStep("done")
    } catch (err) {
      const e = err as ExchangeError
      if (e?.code === "purchase_cancelled") {
        toast("已取消付款")
      } else {
        toast(e?.message ? `兌換失敗：${e.message}` : "兌換失敗，請稍後再試")
      }
      setStep("amount")
    } finally {
      setPaying(false)
    }
  }

  const stop = (e: React.MouseEvent) => e.stopPropagation()

  return (
    <div className="fixed inset-0 z-[130] flex flex-col justify-end bg-black/60" onClick={onClose}>
      <div className="max-h-[88vh] overflow-y-auto rounded-t-3xl bg-card p-5" onClick={stop}>
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border" />
        <p className="mb-5 flex items-center justify-center gap-2 font-serif text-xl font-bold tracking-widest text-foreground">
          <PiEmblem size={24} />
          Pi 兌換系統
        </p>

        {step === "info" && (
          <div className="space-y-3">
            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground">兌換比率</p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p>
                  1 Pi = <span className="font-semibold text-primary">{formatCoins(COINS_PER_PI)}</span> pi玩幣
                </p>
              </div>
            </Card>

            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground">兌換遊戲幣說明</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                您輸入想兌換的 Pi 數量後，會直接開啟 Pi 官方付款流程進行真實付款。付款經 Pi
                官方系統確認完成後，系統會自動核發對應的 pi玩幣至您的帳戶，全程自動處理，不需要另外聯絡客服。
              </p>
            </Card>

            <Card className="p-4">
              <p className="text-sm font-semibold text-foreground">免責聲明</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                本平台遊戲僅供休閒娛樂與腦力開發使用，不涉及實質金錢輸贏。兌換所得 pi玩幣僅可用於平台內遊戲遊玩，不具現金價值，亦不可提現或轉讓。付款經 Pi 官方確認後即無法撤回，請確認金額無誤後再送出。
              </p>
            </Card>

            <Button block onClick={() => setStep("amount")}>
              確認兌換
            </Button>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-3">
            <Card className="space-y-2 p-4">
              <label className="text-sm font-semibold text-foreground">輸入想兌換的 Pi 數量</label>
              <input
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value.replace(/[^0-9.]/g, ""))}
                placeholder="0.00"
                inputMode="decimal"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-lg font-semibold text-foreground outline-none focus:border-primary"
              />
              {amount > 0 && (
                <p className="text-xs text-muted-foreground">
                  將獲得 <span className="font-semibold text-primary">{formatCoins(previewCoins)}</span> pi玩幣
                </p>
              )}
              <p className="text-[11px] text-muted-foreground">
                {user?.username ? `付款帳號：${user.username}` : ""}
              </p>
            </Card>

            <Button block disabled={amount <= 0} onClick={startPayment}>
              以 Pi 支付 {amount > 0 ? amount : ""} 兌換
            </Button>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-3 py-6 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />
            <p className="text-sm font-semibold text-foreground">請在 Pi 付款視窗完成付款</p>
            <p className="text-xs text-muted-foreground">系統會等待 Pi 官方確認交易，完成後自動發放 pi玩幣。</p>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 py-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent">
              <IconCheck className="h-7 w-7" />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">兌換成功</p>
              <p className="mt-1 text-sm text-muted-foreground">
                已為您發放 <span className="font-semibold text-primary">{formatCoins(awardedCoins)}</span> pi玩幣
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  onClose()
                  onBackToHome?.()
                }}
              >
                返回首頁
              </Button>
              <Button
                variant="solid"
                className="flex-1"
                onClick={() => {
                  onClose()
                  onBackToLobby?.()
                }}
              >
                <IconHome className="h-4 w-4" /> 進入大廳
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
