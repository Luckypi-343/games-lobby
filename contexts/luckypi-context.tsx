"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { pi } from "@/lib/pi"
import { usePiAuth } from "@/contexts/pi-auth-context"
import { luckypiWriter } from "@/lib/luckypi/store"
import {
  type CategoryId,
  type Machine,
  type PlayMode,
  type Prefs,
  type Stats,
  type SpinRecord,
  type LangId,
  type SpinSpeed,
  type Difficulty,
  type PuzzleStats,
  type PuzzleGameStat,
  DEFAULT_PREFS,
  EMPTY_STATS,
  EMPTY_PUZZLE_GAME_STAT,
  STARTER_TRIAL_COINS,
  STARTER_PI_COINS,
  MAX_SPIN_HISTORY,
  LINE_COUNT,
  DAILY_TRIAL_BONUS,
  todayKey,
  sanitizePrefs,
  sanitizeStats,
  sanitizeWallet,
  sanitizePuzzleStats,
  prefsToBlob,
  statsToBlob,
  walletToBlob,
  puzzleStatsToBlob,
} from "@/lib/luckypi/data"
import { evaluateSpin, spinReels, type SpinResult, type Grid } from "@/lib/luckypi/engine"
import { startReelRumble, reduceReelRumble, stopReelRumble, playBrakeClick, playWinSound } from "@/lib/luckypi/reel-audio"

export interface Toast {
  id: string
  message: string
}

interface LuckyPiContextValue {
  ready: boolean
  storageTrouble: boolean
  storageNoticeHosted: boolean
  setStorageNoticeHosted: (hosted: boolean) => void
  tab: CategoryId
  setTab: (tab: CategoryId) => void
  mode: PlayMode
  setMode: (mode: PlayMode) => void
  betPerLine: number
  setBetPerLine: (n: number | ((prev: number) => number)) => void
  autoCount: number
  setAutoCount: (n: number | ((prev: number) => number)) => void
  autoRemaining: number
  autoTotalWin: number
  freeSpinsGranted: number
  startAuto: (machine: Machine) => void
  stopAuto: () => void
  lang: LangId
  setLang: (lang: LangId) => void
  trialName: string | null
  piDisplayName: string | null
  setTrialName: (name: string) => void
  setPiDisplayName: (name: string) => void
  musicOn: boolean
  setMusicOn: (on: boolean) => void
  soundOn: boolean
  setSoundOn: (on: boolean) => void
  spinSpeed: SpinSpeed
  setSpinSpeed: (speed: SpinSpeed) => void
  trialCoins: number
  piCoins: number
  coins: number
  stats: Stats
  freeGamesRemaining: number
  lastResult: SpinResult | null
  displayGrid: Grid | null
  stoppedCols: number
  spinning: boolean
  settling: boolean
  spin: (machine: Machine) => Promise<void>
  addPiCoins: (amount: number) => void
  spendCoins: (amount: number) => boolean
  creditWin: (amount: number) => void
  history: SpinRecord[]
  toasts: Toast[]
  toast: (message: string) => void
  claimDailyBonus: () => void
  wheelBonusOpen: boolean
  wheelBonusStake: number
  wheelBonusSpinsLeft: number
  wheelBonusSpinsTotal: number
  wheelBonusRound: number
  resolveWheelBonus: (multiplier: number) => void
  startWheelBonusTest: () => void
  difficulty: Difficulty
  setDifficulty: (d: Difficulty) => void
  puzzleStats: PuzzleStats
  getPuzzleStat: (gameId: string) => PuzzleGameStat
  recordPuzzleResult: (gameId: string, outcome: "win" | "loss" | "draw") => void
}

const LuckyPiContext = createContext<LuckyPiContextValue | null>(null)

const WALLET_KEY = "luckypi.wallet"
const STATS_KEY = "luckypi.stats"
const PREFS_KEY = "luckypi.prefs"
const PUZZLE_STATS_KEY = "luckypi.puzzlestats"

export function LuckyPiProvider({ children }: { children: ReactNode }) {
  const { status } = usePiAuth()
  const [ready, setReady] = useState(false)
  const [storageTrouble, setStorageTrouble] = useState(false)
  const [storageNoticeHosted, setStorageNoticeHosted] = useState(false)
  const [prefs, setPrefsState] = useState<Prefs>(DEFAULT_PREFS)
  const [trialCoins, setTrialCoins] = useState(STARTER_TRIAL_COINS)
  const [piCoins, setPiCoins] = useState(STARTER_PI_COINS)
  const [stats, setStats] = useState<Stats>(EMPTY_STATS)
  const [freeGamesRemaining, setFreeGamesRemaining] = useState(0)
  const [lastResult, setLastResult] = useState<SpinResult | null>(null)
  const [spinning, setSpinning] = useState(false)
  // 「轉輪還在轉」跟「這一輪對獎效果還在播放中」分開判斷：settling 只用來擋下一輪太早搶著開始，
  // 不會影響中獎連線／動三下／恭賀橫幅在轉輪停下的那一刻就立刻出現。
  const [settling, setSettling] = useState(false)
  const settlingRef = useRef(false)
  const [displayGrid, setDisplayGrid] = useState<Grid | null>(null)
  const [stoppedCols, setStoppedCols] = useState(5)
  const [history, setHistory] = useState<SpinRecord[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [autoRemaining, setAutoRemaining] = useState(0)
  const [autoTotalWin, setAutoTotalWin] = useState(0)
  const [freeSpinsGranted, setFreeSpinsGranted] = useState(0)
  const [puzzleStats, setPuzzleStats] = useState<PuzzleStats>({})
  const [wheelBonusOpen, setWheelBonusOpen] = useState(false)
  const [wheelBonusSpinsLeft, setWheelBonusSpinsLeft] = useState(0)
  const [wheelBonusSpinsTotal, setWheelBonusSpinsTotal] = useState(0)
  const [wheelBonusRound, setWheelBonusRound] = useState(0)
  const wheelBonusAccruedRef = useRef(0)
  const [wheelBonusStake, setWheelBonusStake] = useState(0)
  // BONUS 飛輪贈分全頁面開著時，主遊戲（手動轉動、自動轉動）都要先暫停等待，
  // 不能在飛輪畫面背後偷偷繼續轉動或消耗自動次數；用 ref 讓 spin／自動迴圈隨時讀到最新的開關狀態。
  const wheelBonusOpenRef = useRef(false)
  wheelBonusOpenRef.current = wheelBonusOpen

  const trialCoinsRef = useRef(trialCoins)
  const piCoinsRef = useRef(piCoins)
  const statsRef = useRef(stats)
  const prefsRef = useRef(prefs)
  const puzzleStatsRef = useRef(puzzleStats)
  const autoRemainingRef = useRef(0)
  const autoStopRef = useRef(false)
  trialCoinsRef.current = trialCoins
  piCoinsRef.current = piCoins
  statsRef.current = stats
  prefsRef.current = prefs
  puzzleStatsRef.current = puzzleStats

  const toast = useCallback((message: string) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  useEffect(() => {
    if (status !== "authenticated") return
    let cancelled = false
    ;(async () => {
      const [walletRec, statsRec, prefsRec, puzzleStatsRec] = await Promise.all([
        pi.userState.get(WALLET_KEY),
        pi.userState.get(STATS_KEY),
        pi.userState.get(PREFS_KEY),
        pi.userState.get(PUZZLE_STATS_KEY),
      ])
      if (cancelled) return
      const wallet = walletRec ? sanitizeWallet(walletRec.blob) : { trialCoins: STARTER_TRIAL_COINS, piCoins: STARTER_PI_COINS }
      setTrialCoins(wallet.trialCoins)
      setPiCoins(wallet.piCoins)
      setStats(statsRec ? sanitizeStats(statsRec.blob) : { ...EMPTY_STATS })
      setPrefsState(prefsRec ? sanitizePrefs(prefsRec.blob) : { ...DEFAULT_PREFS })
      setPuzzleStats(puzzleStatsRec ? sanitizePuzzleStats(puzzleStatsRec.blob) : {})
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [status])

  const commitWallet = useCallback((immediate = false) => {
    luckypiWriter.schedule(
      WALLET_KEY,
      () => walletToBlob({ trialCoins: trialCoinsRef.current, piCoins: piCoinsRef.current }),
      immediate,
      () => setStorageTrouble(true),
    )
  }, [])
  const commitStats = useCallback((immediate = false) => {
    luckypiWriter.schedule(STATS_KEY, () => statsToBlob(statsRef.current), immediate, () => setStorageTrouble(true))
  }, [])
  const commitPrefs = useCallback((immediate = false) => {
    luckypiWriter.schedule(PREFS_KEY, () => prefsToBlob(prefsRef.current), immediate, () => setStorageTrouble(true))
  }, [])
  const commitPuzzleStats = useCallback((immediate = false) => {
    luckypiWriter.schedule(
      PUZZLE_STATS_KEY,
      () => puzzleStatsToBlob(puzzleStatsRef.current),
      immediate,
      () => setStorageTrouble(true),
    )
  }, [])

  const setTab = useCallback(
    (tab: CategoryId) => {
      setPrefsState((p) => {
        const next = { ...p, tab }
        prefsRef.current = next
        return next
      })
      commitPrefs()
    },
    [commitPrefs],
  )

  const setMode = useCallback(
    (mode: PlayMode) => {
      setPrefsState((p) => {
        const next = { ...p, mode }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  // 接受一個數字，或是一個「依上一次的值往下算」的函式（跟 React 內建的 setState 用法一樣），
  // 這樣長按快速加減時，每一下都能疊加在真正最新的數值上，不會被舊的畫面值蓋掉。
  const setBetPerLine = useCallback(
    (n: number | ((prev: number) => number)) => {
      setPrefsState((p) => {
        const resolved = typeof n === "function" ? n(p.betPerLine) : n
        const next = { ...p, betPerLine: resolved }
        prefsRef.current = next
        return next
      })
      commitPrefs()
    },
    [commitPrefs],
  )

  const setAutoCount = useCallback(
    (n: number | ((prev: number) => number)) => {
      setPrefsState((p) => {
        const resolved = typeof n === "function" ? n(p.autoCount) : n
        const next = { ...p, autoCount: resolved }
        prefsRef.current = next
        return next
      })
      commitPrefs()
    },
    [commitPrefs],
  )

  const setLang = useCallback(
    (lang: LangId) => {
      setPrefsState((p) => {
        const next = { ...p, lang }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const setTrialName = useCallback(
    (name: string) => {
      setPrefsState((p) => {
        const next = { ...p, trialName: name.trim().slice(0, 40) || null }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const setPiDisplayName = useCallback(
    (name: string) => {
      setPrefsState((p) => {
        const next = { ...p, piDisplayName: name.trim().slice(0, 40) || null }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const setMusicOn = useCallback(
    (on: boolean) => {
      setPrefsState((p) => {
        const next = { ...p, musicOn: on }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const setSoundOn = useCallback(
    (on: boolean) => {
      setPrefsState((p) => {
        const next = { ...p, soundOn: on }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const setSpinSpeed = useCallback(
    (speed: SpinSpeed) => {
      setPrefsState((p) => {
        const next = { ...p, spinSpeed: speed }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const setDifficulty = useCallback(
    (d: Difficulty) => {
      setPrefsState((p) => {
        const next = { ...p, difficulty: d }
        prefsRef.current = next
        return next
      })
      commitPrefs(true)
    },
    [commitPrefs],
  )

  const getPuzzleStat = useCallback((gameId: string): PuzzleGameStat => {
    return puzzleStatsRef.current[gameId] ?? EMPTY_PUZZLE_GAME_STAT
  }, [])

  const recordPuzzleResult = useCallback(
    (gameId: string, outcome: "win" | "loss" | "draw") => {
      setPuzzleStats((prev) => {
        const current = prev[gameId] ?? { wins: 0, losses: 0, draws: 0 }
        const next: PuzzleStats = {
          ...prev,
          [gameId]: {
            wins: current.wins + (outcome === "win" ? 1 : 0),
            losses: current.losses + (outcome === "loss" ? 1 : 0),
            draws: current.draws + (outcome === "draw" ? 1 : 0),
          },
        }
        puzzleStatsRef.current = next
        return next
      })
      commitPuzzleStats(true)
    },
    [commitPuzzleStats],
  )

  const resolveWheelBonus = useCallback(
    (multiplier: number) => {
      const award = Math.round(wheelBonusStake * multiplier)
      wheelBonusAccruedRef.current += award
      const mode = prefsRef.current.mode
      const activeRef = mode === "trial" ? trialCoinsRef : piCoinsRef
      const setActive = mode === "trial" ? setTrialCoins : setPiCoins
      if (award > 0) {
        setActive((c) => {
          const next = c + award
          activeRef.current = next
          return next
        })
        setStats((s) => {
          const next: Stats = { ...s, totalWin: s.totalWin + award, bestWin: Math.max(s.bestWin, award) }
          statsRef.current = next
          return next
        })
        commitWallet(true)
        commitStats(true)
      }

      if (multiplier !== 0) {
        // 只要這一次沒有停在「0」，這一次進場機會就自動接著再轉一次，不用手動點按。
        setWheelBonusRound((r) => r + 1)
        return
      }

      // 停在「0」：這一次進場機會結束，看看還有沒有下一次進場機會。
      setWheelBonusSpinsLeft((left) => {
        const remaining = left - 1
        if (remaining > 0) {
          setWheelBonusRound((r) => r + 1)
        } else {
          const total = wheelBonusAccruedRef.current
          if (total > 0) toast(`飛輪贈分共獲得 ${total.toLocaleString("zh-Hant")} 分！`)
          setWheelBonusOpen(false)
          setWheelBonusStake(0)
        }
        return Math.max(0, remaining)
      })
    },
    [wheelBonusStake, commitWallet, commitStats, toast],
  )

  // 規則說明頁「BONUS贈分遊戲」章節提供的示範入口：不消耗押注、不影響正式紀錄，
  // 純粹讓玩家先體驗一次飛輪贈分小遊戲長什麼樣子、怎麼操作。
  const startWheelBonusTest = useCallback(() => {
    // 這是規則說明頁的示範入口，不該被主遊戲當下是否還在轉動卡住——
    // 只要飛輪畫面本身還沒開著，就一定要能立刻進去體驗，不然點了沒反應。
    if (wheelBonusOpenRef.current) return
    const bet = prefsRef.current?.betPerLine ?? MIN_BET
    const demoStake = Math.max(MIN_BET, bet) * LINE_COUNT
    wheelBonusAccruedRef.current = 0
    setWheelBonusStake(demoStake)
    setWheelBonusSpinsTotal(1)
    setWheelBonusSpinsLeft(1)
    setWheelBonusRound((r) => r + 1)
    setWheelBonusOpen(true)
  }, [])

  const addPiCoins = useCallback(
    (amount: number) => {
      setPiCoins((c) => {
        const next = c + amount
        piCoinsRef.current = next
        return next
      })
      commitWallet(true)
      toast(`已兌換 ${amount.toLocaleString("zh-Hant")} pi玩幣`)
    },
    [commitWallet, toast],
  )

  const spendCoins = useCallback(
    (amount: number) => {
      const mode = prefsRef.current.mode
      const activeRef = mode === "trial" ? trialCoinsRef : piCoinsRef
      const setActive = mode === "trial" ? setTrialCoins : setPiCoins
      if (activeRef.current < amount) {
        toast(mode === "trial" ? "試玩幣不足，明日再來領取" : "pi玩幣不足，請先前往兌換")
        return false
      }
      setActive((c) => {
        const next = c - amount
        activeRef.current = next
        return next
      })
      commitWallet(true)
      return true
    },
    [toast, commitWallet],
  )

  // 撲克牌桌用的通用「入帳」：贏錢或退回押注時，直接加回目前所在的幣別（試玩幣或pi玩幣），
  // 不像 addPiCoins 那樣只針對pi玩幣、也不會跳出兌換成功的提示，純粹是遊戲內的派彩。
  const creditWin = useCallback(
    (amount: number) => {
      if (amount <= 0) return
      const mode = prefsRef.current.mode
      const activeRef = mode === "trial" ? trialCoinsRef : piCoinsRef
      const setActive = mode === "trial" ? setTrialCoins : setPiCoins
      setActive((c) => {
        const next = c + amount
        activeRef.current = next
        return next
      })
      commitWallet(true)
    },
    [commitWallet],
  )

  const claimDailyBonus = useCallback(() => {
    const today = todayKey()
    if (prefsRef.current.lastBonusDay === today) return
    setTrialCoins((c) => {
      const next = c + DAILY_TRIAL_BONUS
      trialCoinsRef.current = next
      return next
    })
    setPrefsState((p) => {
      const next = { ...p, lastBonusDay: today }
      prefsRef.current = next
      return next
    })
    commitWallet(true)
    commitPrefs(true)
    toast(`每日試玩幣已發放：${DAILY_TRIAL_BONUS.toLocaleString("zh-Hant")} 幣`)
  }, [commitWallet, commitPrefs, toast])

  const spin = useCallback(
    async (machine: Machine): Promise<SpinResult | null> => {
      // BONUS 飛輪贈分全頁面開著時，主遊戲要真正暫停等待，不能在飛輪畫面背後偷偷開始新的一輪。
      // settlingRef 是「這一輪的對獎效果還在播放中」的獨立門檻，跟 spinning（轉輪還在轉）分開判斷，
      // 這樣轉輪一停就能立刻顯示中獎連線／動三下／恭賀橫幅，不用等到整輪徹底結束才出現。
      if (spinning || settlingRef.current || wheelBonusOpenRef.current) return null
      settlingRef.current = true
      const mode = prefsRef.current.mode
      const activeRef = mode === "trial" ? trialCoinsRef : piCoinsRef
      const setActive = mode === "trial" ? setTrialCoins : setPiCoins
      const totalBet = prefsRef.current.betPerLine * LINE_COUNT
      const usingFree = freeGamesRemaining > 0
      if (!usingFree && activeRef.current < totalBet) {
        toast(mode === "trial" ? "試玩幣不足，明日再來領取" : "pi玩幣不足，請先前往兌換")
        return null
      }

      setSpinning(true)
      setLastResult(null)
      setStoppedCols(0)
      if (!usingFree) {
        setActive((c) => {
          const next = c - totalBet
          activeRef.current = next
          return next
        })
      } else {
        setFreeGamesRemaining((f) => Math.max(0, f - 1))
      }

      // 五個轉輪同時轉動，模擬五個風車輪一起轉動的隆隆聲。
      const grid = spinReels()
      setDisplayGrid(grid)
      const result = evaluateSpin(grid, prefsRef.current.betPerLine, machine.payFactor)

      const speedFactor =
        prefsRef.current.spinSpeed === "fast" ? 0.55 : prefsRef.current.spinSpeed === "slow" ? 1.4 : 1
      startReelRumble(prefsRef.current.soundOn, machine.hue)
      // 第一豎列先轉 3 秒才停，之後每隔 0.8 秒再停一豎列，共鳴聲隨之一輪輪減弱。
      const stopDelays = [3000, 800, 800, 800, 800].map((ms) => Math.round(ms * speedFactor))
      for (let col = 0; col < 5; col++) {
        await new Promise((resolve) => setTimeout(resolve, stopDelays[col]))
        setStoppedCols(col + 1)
        reduceReelRumble(4 - col)
        if (prefsRef.current.soundOn) playBrakeClick(machine.hue)
      }
      stopReelRumble()

      // 全部靜止，進入對獎：立刻把 spinning 關掉，讓中獎連線／動三下／恭賀橫幅馬上出現，
      // 不再讓玩家對著靜止的轉輪空等 2 秒都看不到任何反應。settlingRef 繼續保持鎖定，
      // 避免下一輪（尤其自動連續轉動）在對獎效果播完之前就搶著開始。
      setLastResult(result)
      setSpinning(false)

      if (result.totalWin > 0) {
        setActive((c) => {
          const next = c + result.totalWin
          activeRef.current = next
          return next
        })
        // 中獎喜悅音效，跟恭賀橫幅、動物動三下同一時間播放。
        if (prefsRef.current.soundOn) playWinSound(machine.hue)
      }
      if (result.freeGames > 0) {
        setFreeGamesRemaining((f) => f + result.freeGames)
        setFreeSpinsGranted((f) => f + result.freeGames)
        toast(`觸發額外遊戲 ${result.freeGames} 次！`)
      }
      if (result.boardWin > 0) {
        toast(`全盤大獎！獲得 ${result.boardWin.toLocaleString("zh-Hant")} 分！`)
      }
      if (result.bonusWheelTriggered) {
        wheelBonusAccruedRef.current = 0
        setWheelBonusStake(totalBet > 0 ? totalBet : prefsRef.current.betPerLine * LINE_COUNT)
        setWheelBonusSpinsTotal(result.wheelSpins)
        setWheelBonusSpinsLeft(result.wheelSpins)
        setWheelBonusRound((r) => r + 1)
        setWheelBonusOpen(true)
        toast(`觸發 BONUS 飛輪贈分 ${result.wheelSpins} 次！`)
      }

      setStats((s) => {
        const next: Stats = {
          spins: s.spins + 1,
          totalWin: s.totalWin + result.totalWin,
          totalWagered: s.totalWagered + (usingFree ? 0 : totalBet),
          bestWin: Math.max(s.bestWin, result.totalWin),
        }
        statsRef.current = next
        return next
      })

      setHistory((h) =>
        [
          {
            id: Math.random().toString(36).slice(2),
            machineId: machine.id,
            bet: usingFree ? 0 : totalBet,
            totalWin: result.totalWin,
            freeGamesAwarded: result.freeGames,
            usedFreeSpin: usingFree,
            at: Date.now(),
          },
          ...h,
        ].slice(0, MAX_SPIN_HISTORY),
      )

      setPrefsState((p) => {
        const next = { ...p, lastMachineId: machine.id }
        prefsRef.current = next
        return next
      })

      commitPrefs()
      commitWallet()
      commitStats()

      // 對獎完成後停留一下讓玩家看清楚結果，再等 1 秒才視為本輪真正結束（可接著自動啟動下一輪）。
      const hasWin = result.totalWin > 0 || result.freeGames > 0
      await new Promise((resolve) => setTimeout(resolve, hasWin ? 2200 : 1000))

      settlingRef.current = false
      setSettling(false)
      return result
    },
    [spinning, freeGamesRemaining, toast, commitPrefs, commitWallet, commitStats],
  )

  const stopAuto = useCallback(() => {
    autoStopRef.current = true
    autoRemainingRef.current = 0
    setAutoRemaining(0)
  }, [])

  const runAutoStep = useCallback(
    (machine: Machine) => {
      if (autoStopRef.current || autoRemainingRef.current <= 0) {
        autoRemainingRef.current = 0
        setAutoRemaining(0)
        return
      }
      if (wheelBonusOpenRef.current) {
        // BONUS 飛輪贈分全頁面進行中：自動轉動先在這裡等待，不消耗次數，飛輪結束後自動接續下一輪。
        window.setTimeout(() => runAutoStep(machine), 400)
        return
      }
      const mode = prefsRef.current.mode
      const activeRef = mode === "trial" ? trialCoinsRef : piCoinsRef
      const totalBet = prefsRef.current.betPerLine * LINE_COUNT
      if (freeGamesRemaining === 0 && activeRef.current < totalBet) {
        autoStopRef.current = true
        autoRemainingRef.current = 0
        setAutoRemaining(0)
        toast(mode === "trial" ? "試玩幣不足，自動轉動已停止" : "pi玩幣不足，自動轉動已停止")
        return
      }
      spin(machine).then((result) => {
        if (result) setAutoTotalWin((w) => w + result.totalWin)
        autoRemainingRef.current = Math.max(0, autoRemainingRef.current - 1)
        setAutoRemaining(autoRemainingRef.current)
        // spin() 內部已經走完「轉停→對獎→等待 1 秒」的完整流程，這裡不再額外加等待，直接自動啟動下一輪。
        if (!autoStopRef.current && autoRemainingRef.current > 0) {
          runAutoStep(machine)
        }
      })
    },
    [spin, freeGamesRemaining, toast],
  )

  const startAuto = useCallback(
    (machine: Machine) => {
      if (spinning || settlingRef.current || autoRemainingRef.current > 0 || wheelBonusOpenRef.current) return
      const count = prefsRef.current.autoCount
      if (count <= 0) {
        toast("請先設定自動次數")
        return
      }
      autoStopRef.current = false
      setAutoTotalWin(0)
      autoRemainingRef.current = count
      setAutoRemaining(count)
      runAutoStep(machine)
    },
    [spinning, toast, runAutoStep],
  )

  useEffect(() => {
    const flush = () => {
      luckypiWriter.flushNow(WALLET_KEY, () =>
        walletToBlob({ trialCoins: trialCoinsRef.current, piCoins: piCoinsRef.current }),
      )
      luckypiWriter.flushNow(STATS_KEY, () => statsToBlob(statsRef.current))
      luckypiWriter.flushNow(PREFS_KEY, () => prefsToBlob(prefsRef.current))
      luckypiWriter.flushNow(PUZZLE_STATS_KEY, () => puzzleStatsToBlob(puzzleStatsRef.current))
    }
    document.addEventListener("visibilitychange", flush)
    window.addEventListener("pagehide", flush)
    return () => {
      document.removeEventListener("visibilitychange", flush)
      window.removeEventListener("pagehide", flush)
    }
  }, [])

  const coins = prefs.mode === "trial" ? trialCoins : piCoins

  const value = useMemo<LuckyPiContextValue>(
    () => ({
      ready,
      storageTrouble,
      storageNoticeHosted,
      setStorageNoticeHosted,
      tab: prefs.tab,
      setTab,
      mode: prefs.mode,
      setMode,
      betPerLine: prefs.betPerLine,
      setBetPerLine,
      autoCount: prefs.autoCount,
      setAutoCount,
      autoRemaining,
      autoTotalWin,
      freeSpinsGranted,
      startAuto,
      stopAuto,
      lang: prefs.lang,
      setLang,
      trialName: prefs.trialName,
      piDisplayName: prefs.piDisplayName,
      setTrialName,
      setPiDisplayName,
      musicOn: prefs.musicOn,
      setMusicOn,
      soundOn: prefs.soundOn,
      setSoundOn,
      spinSpeed: prefs.spinSpeed,
      setSpinSpeed,
      trialCoins,
      piCoins,
      coins,
      stats,
      freeGamesRemaining,
      lastResult,
      displayGrid,
      stoppedCols,
      spinning,
      settling,
      spin,
      addPiCoins,
      spendCoins,
      creditWin,
      history,
      toasts,
      toast,
      claimDailyBonus,
      wheelBonusOpen,
      wheelBonusStake,
      wheelBonusSpinsLeft,
      wheelBonusSpinsTotal,
      wheelBonusRound,
      resolveWheelBonus,
      startWheelBonusTest,
      difficulty: prefs.difficulty,
      setDifficulty,
      puzzleStats,
      getPuzzleStat,
      recordPuzzleResult,
    }),
    [
      ready,
      storageTrouble,
      storageNoticeHosted,
      prefs.tab,
      prefs.mode,
      prefs.betPerLine,
      prefs.autoCount,
      autoRemaining,
      autoTotalWin,
      freeSpinsGranted,
      prefs.lang,
      prefs.trialName,
      prefs.piDisplayName,
      prefs.musicOn,
      prefs.soundOn,
      prefs.spinSpeed,
      prefs.difficulty,
      displayGrid,
      stoppedCols,
      setTab,
      setMode,
      setBetPerLine,
      setAutoCount,
      startAuto,
      stopAuto,
      setLang,
      setTrialName,
      setPiDisplayName,
      setMusicOn,
      setSoundOn,
      setSpinSpeed,
      setDifficulty,
      trialCoins,
      piCoins,
      coins,
      stats,
      freeGamesRemaining,
      lastResult,
      spinning,
      spin,
      addPiCoins,
      spendCoins,
      creditWin,
      history,
      toasts,
      toast,
      claimDailyBonus,
      wheelBonusOpen,
      wheelBonusStake,
      wheelBonusSpinsLeft,
      wheelBonusSpinsTotal,
      wheelBonusRound,
      resolveWheelBonus,
      startWheelBonusTest,
      puzzleStats,
      getPuzzleStat,
      recordPuzzleResult,
    ],
  )

  return <LuckyPiContext.Provider value={value}>{children}</LuckyPiContext.Provider>
}

export function useLuckyPi() {
  const ctx = useContext(LuckyPiContext)
  if (!ctx) throw new Error("useLuckyPi must be used within a LuckyPiProvider")
  return ctx
}
