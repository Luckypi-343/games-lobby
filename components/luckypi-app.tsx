"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LuckyPiProvider, useLuckyPi } from "@/contexts/luckypi-context"
import type { Machine, PuzzleGame } from "@/lib/luckypi/data"
import { LINE_COUNT, MIN_BET, WAGERED_TABLE_MIN_BET } from "@/lib/luckypi/data"
import { HomeScreen } from "@/components/luckypi/home-screen"
import { LobbyScreen } from "@/components/luckypi/lobby-screen"
import { GameScreen } from "@/components/luckypi/game-screen"
import { ZodiacPortraitScreen } from "@/components/luckypi/zodiac-portrait-screen"
import { ExchangeSheet } from "@/components/luckypi/exchange-sheet"
import { SettingsSheet, AnnouncementsSheet, FeedbackSheet } from "@/components/luckypi/info-sheets"
import { LoadingScreen, StorageNotice, ToastHost } from "@/components/luckypi/pieces"

// 益智遊戲的多國語言文字表非常龐大，改成只有在玩家真正點進一款益智遊戲時才載入，
// 避免每次打開App（包括只是看首頁、大廳）就把整包文字一次塞進記憶體，
// 這正是造成手機上白屏、閃退的主因。
const PuzzleGameScreen = dynamic(
  () => import("@/components/luckypi/puzzle-game-screen").then((m) => m.PuzzleGameScreen),
  { ssr: false, loading: () => <LoadingScreen /> },
)

type OverlayId = "exchange" | "settings" | "announcements" | "feedback" | null

function Shell() {
  const { ready, mode, setMode, claimDailyBonus, trialCoins, piCoins, toast } = useLuckyPi()
  const [entered, setEntered] = useState(false)
  const [machine, setMachine] = useState<Machine | null>(null)
  const [puzzleGame, setPuzzleGame] = useState<PuzzleGame | null>(null)
  const [overlay, setOverlay] = useState<OverlayId>(null)

  if (!ready) return <LoadingScreen />

  // 玩家幣別（試玩幣或pi玩幣）不夠支付這台機台／這張桌子最低需要的金額時，
  // 直接擋在大廳，不讓畫面切進遊戲畫面，並提示玩家補充或等待發放。
  function requireCoins(amount: number): boolean {
    const balance = mode === "trial" ? trialCoins : piCoins
    if (balance < amount) {
      toast(mode === "trial" ? "試玩幣不足，請等待每日發放後再進場" : "pi玩幣不足，請先前往兌換後再進場")
      return false
    }
    return true
  }

  function handlePlayMachine(m: Machine) {
    if (!requireCoins(MIN_BET * LINE_COUNT)) return
    setMachine(m)
  }

  function handlePlayGame(g: PuzzleGame) {
    if (!requireCoins(g.wagered ? WAGERED_TABLE_MIN_BET : g.cost)) return
    setPuzzleGame(g)
  }

  if (!entered) {
    return (
      <div className="mx-auto min-h-dvh w-full max-w-md">
        <HomeScreen
          onPlay={(selected) => {
            if (selected !== mode) setMode(selected)
            claimDailyBonus()
            setEntered(true)
          }}
          onExchange={() => setOverlay("exchange")}
        />
        {overlay === "exchange" && (
          <ExchangeSheet
            onClose={() => setOverlay(null)}
            onBackToHome={() => setOverlay(null)}
            onBackToLobby={() => {
              setOverlay(null)
              setEntered(true)
            }}
          />
        )}
        <ToastHost />
        <StorageNotice />
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-dvh w-full max-w-md">
      {machine ? (
        machine.category === "gamble" && machine.tier === "silver" ? (
          <ZodiacPortraitScreen
            machine={machine}
            onBack={() => setMachine(null)}
            onHome={() => {
              setMachine(null)
              setEntered(false)
            }}
            onSettings={() => setOverlay("settings")}
          />
        ) : (
          <GameScreen
            machine={machine}
            onBack={() => setMachine(null)}
            onHome={() => {
              setMachine(null)
              setEntered(false)
            }}
            onSettings={() => setOverlay("settings")}
          />
        )
      ) : puzzleGame ? (
        <PuzzleGameScreen
          game={puzzleGame}
          onBack={() => setPuzzleGame(null)}
          onHome={() => {
            setPuzzleGame(null)
            setEntered(false)
          }}
        />
      ) : (
        <LobbyScreen
          onPlay={handlePlayMachine}
          onPlayGame={handlePlayGame}
          onHome={() => setEntered(false)}
          onSettings={() => setOverlay("settings")}
          onAnnouncements={() => setOverlay("announcements")}
          onFeedback={() => setOverlay("feedback")}
          onExchange={() => setOverlay("exchange")}
        />
      )}
      {overlay === "exchange" && (
        <ExchangeSheet
          onClose={() => setOverlay(null)}
          onBackToHome={() => {
            setOverlay(null)
            setMachine(null)
            setPuzzleGame(null)
            setEntered(false)
          }}
          onBackToLobby={() => {
            setOverlay(null)
            setMachine(null)
            setPuzzleGame(null)
          }}
        />
      )}
      {overlay === "settings" && (
        <SettingsSheet
          onClose={() => setOverlay(null)}
          onBackToLobby={() => setOverlay(null)}
          onBackToHome={() => {
            setOverlay(null)
            setMachine(null)
            setPuzzleGame(null)
            setEntered(false)
          }}
        />
      )}
      {overlay === "announcements" && (
        <AnnouncementsSheet
          onClose={() => setOverlay(null)}
          onBackToLobby={() => setOverlay(null)}
          onBackToHome={() => {
            setOverlay(null)
            setMachine(null)
            setPuzzleGame(null)
            setEntered(false)
          }}
        />
      )}
      {overlay === "feedback" && (
        <FeedbackSheet
          onClose={() => setOverlay(null)}
          onBackToLobby={() => setOverlay(null)}
          onBackToHome={() => {
            setOverlay(null)
            setMachine(null)
            setPuzzleGame(null)
            setEntered(false)
          }}
        />
      )}
      <ToastHost />
      <StorageNotice />
    </div>
  )
}

export function LuckyPiApp() {
  return (
    <LuckyPiProvider>
      <Shell />
    </LuckyPiProvider>
  )
}
