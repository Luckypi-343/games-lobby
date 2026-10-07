"use client"

import { useEffect, useState } from "react"
import { CasinoTableShell } from "@/components/luckypi/casino-table-shell"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { playWinSound, playLossSound, playDrawSound } from "@/lib/games/game-audio"
import {
  mjInitial,
  mjDeal,
  mjEat,
  mjDraw,
  mjDiscard,
  mjBotAct,
  canEat,
  type MahjongState,
  type Piece,
  BET_MIN,
  BET_MAX,
  BET_STEP,
} from "@/lib/games/xiangqi-mahjong"

const HUE = 20

const RULES =
  "先調整押注金額（10～500）再按「開局」。開局時莊家（電腦）先摸5顆：若這5顆正好湊成胡牌，直接開胡（發牌就胡，彩金固定×5）；若未胡牌，則從中選1顆打出，保留4顆，換閒家（玩家持4顆）行動。通常兩家桌面都維持4顆——輪到您時，可以選擇「吃牌」收下對方剛打出的那顆，或「摸牌」從牌堆摸1顆，湊成5顆後若正好是「1對眼＋1組（順子或刻子）」即直接胡牌；沒胡牌則從5顆中選1顆打出（換牌或棄牌皆可），手上維持4顆，換對方行動，如此輪流進行。賠率：混合一對＋順子＝2倍，同色一對＋順子＝3倍，5兵或5卒＝5倍；吃牌胡依上述倍數獲勝，自摸胡再加1倍。牌堆摸完仍無人胡牌則流局退回押注。"

function PieceTile({
  piece,
  faceDown,
  onClick,
  highlighted,
  size = "md",
}: {
  piece: Piece | null
  faceDown?: boolean
  onClick?: () => void
  highlighted?: boolean
  size?: "sm" | "md"
}) {
  const isRed = piece?.color === "red"
  const dim = size === "sm" ? "h-11 w-11 text-sm" : "h-14 w-14 text-lg"
  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 font-serif font-black shadow-md transition ${dim} ${
        onClick ? "active:scale-95" : ""
      } ${highlighted ? "ring-2 ring-offset-1 ring-amber-400" : ""}`}
      style={
        faceDown
          ? {
              background: "oklch(0.32 0.04 40)",
              borderColor: "oklch(0.5 0.08 60)",
            }
          : {
              background: "oklch(0.93 0.02 70)",
              borderColor: isRed ? "oklch(0.55 0.2 25)" : "oklch(0.3 0.01 0)",
              color: isRed ? "oklch(0.45 0.22 25)" : "oklch(0.2 0.01 0)",
            }
      }
    >
      {faceDown ? "" : piece?.label}
    </button>
  )
}

function PieceRow({
  pieces,
  faceDown,
  onPick,
  highlightIds,
  size,
}: {
  pieces: Piece[]
  faceDown?: boolean
  onPick?: (id: string) => void
  highlightIds?: Set<string>
  size?: "sm" | "md"
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {pieces.map((p) => (
        <PieceTile
          key={p.id}
          piece={p}
          faceDown={faceDown}
          onClick={onPick ? () => onPick(p.id) : undefined}
          highlighted={highlightIds?.has(p.id)}
          size={size}
        />
      ))}
    </div>
  )
}

const RESULT_LABEL: Record<string, string> = {
  "player-self-draw": "自摸！玩家獲勝",
  "player-claim": "吃牌胡！玩家獲勝",
  "bot-self-draw": "電腦自摸，莊家獲勝",
  "bot-claim": "電腦吃牌胡，莊家獲勝",
  "bot-deal-win": "發牌就胡！莊家開局直接胡牌",
  "draw-out": "牌堆摸完，流局退回押注",
}

export function XiangqiMahjongView({ onHome, onLobby }: { onHome: () => void; onLobby: () => void }) {
  const { soundOn, spendCoins, creditWin } = useLuckyPi()
  const [state, setState] = useState<MahjongState>(() => mjInitial())
  const [bet, setBet] = useState(50)
  const [settled, setSettled] = useState(false)

  function startHand() {
    if (state.phase === "playing") return
    if (!spendCoins(bet)) return
    setState(mjDeal())
    setSettled(false)
  }

  function eat() {
    setState((s) => mjEat(s, "player"))
  }

  function draw() {
    setState((s) => mjDraw(s, "player"))
  }

  function discard(pieceId: string) {
    setState((s) => {
      const next = mjDiscard(s, "player", pieceId)
      // 玩家打牌後，讓電腦自動接棒行動（吃牌或摸牌，再打出一顆）。
      setTimeout(() => setState((cur) => (cur.phase === "playing" && cur.turn === "bot" ? mjBotAct(cur) : cur)), 650)
      return next
    })
  }

  // 結算一次性發錢，避免重複入帳。
  useEffect(() => {
    if (state.phase !== "resolved" || settled) return
    setSettled(true)
    const isWin = state.result === "player-self-draw" || state.result === "player-claim"
    const isDraw = state.result === "draw-out"
    if (soundOn) {
      if (isWin) playWinSound()
      else if (isDraw) playDrawSound()
      else playLossSound()
    }
    if (isWin) creditWin(bet * (state.winMultiplier + 1)) // 連本金一起退還 + 彩金倍數
    else if (isDraw) creditWin(bet)
  }, [state.phase, state.result, settled, bet, soundOn, creditWin, state.winMultiplier])

  const playerMustDiscard = state.phase === "playing" && state.turn === "player" && state.stage === "discard" && !!state.drawnPiece
  const playerMustReact = state.phase === "playing" && state.turn === "player" && state.stage === "react"
  const playerCanEat = canEat(state)
  const waitingForBot = state.phase === "playing" && state.turn === "bot"

  return (
    <CasinoTableShell
      title="象棋麻將"
      rules={RULES}
      hue={HUE}
      bet={bet}
      betMin={BET_MIN}
      betMax={BET_MAX}
      betStep={BET_STEP}
      betLocked={state.phase === "playing"}
      onBetChange={setBet}
      onHome={onHome}
      onLobby={onLobby}
    >
      <div className="flex h-full flex-col justify-between px-3 py-3">
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-xs font-semibold text-amber-200/70">莊家・電腦（{state.botHand.length}顆）</p>
          <PieceRow pieces={state.botHand} faceDown size="sm" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-1">
          {state.phase === "idle" ? (
            <p className="text-sm text-amber-100/60">調整押注金額，按「開局」開始這一局</p>
          ) : state.phase === "resolved" ? (
            <div className="flex flex-col items-center gap-1">
              <p
                className="rounded-full border px-5 py-2 text-center font-serif text-base font-bold shadow-lg"
                style={{
                  borderColor: "oklch(0.7 0.15 80 / 0.5)",
                  background: "oklch(0.2 0.05 40 / 0.85)",
                  color: "oklch(0.88 0.14 80)",
                }}
              >
                {RESULT_LABEL[state.result ?? "draw-out"]}
              </p>
              {state.winInfo ? (
                <p className="font-mono text-xs text-amber-100/70">
                  牌型「{state.winInfo.label}」　彩金倍數 ×{state.winMultiplier}
                </p>
              ) : null}
            </div>
          ) : (
            <>
              <p className="font-mono text-xs text-amber-100/60">
                牌堆剩 {state.deck.length} 顆　棄牌 {state.discard.length} 顆
              </p>
              {state.lastDiscard ? (
                <div className="flex flex-col items-center gap-1">
                  <p className="text-xs text-amber-200/70">{state.lastDiscardBy === "bot" ? "電腦" : "玩家"}剛打出</p>
                  <PieceTile piece={state.lastDiscard} />
                </div>
              ) : null}
              <p className="text-sm text-amber-100/80">
                {playerMustReact && "輪到您，選擇「吃牌」或「摸牌」"}
                {playerMustDiscard && "請選一顆打出（換牌或棄牌）"}
                {waitingForBot && "電腦行動中…"}
              </p>
            </>
          )}
          {state.log.length > 0 && state.phase === "playing" ? (
            <p className="max-w-[18rem] text-center text-[0.65rem] leading-snug text-amber-100/40">
              {state.log[state.log.length - 1]}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-1.5">
          <PieceRow
            pieces={state.drawnPiece ? [...state.playerHand, state.drawnPiece] : state.playerHand}
            onPick={playerMustDiscard ? discard : undefined}
            highlightIds={state.drawnPiece ? new Set([state.drawnPiece.id]) : undefined}
          />
          <p className="text-xs font-semibold text-amber-200/70">閒家・玩家（{state.playerHand.length + (state.drawnPiece ? 1 : 0)}顆）</p>
        </div>

        <div className="mt-3 flex justify-center gap-3">
          {state.phase === "idle" || state.phase === "resolved" ? (
            <button
              onClick={startHand}
              className="rounded-full bg-amber-500 px-10 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
            >
              {state.phase === "resolved" ? "再玩一局" : "開局"}
            </button>
          ) : playerMustReact ? (
            <>
              {playerCanEat ? (
                <button
                  onClick={eat}
                  className="rounded-full bg-rose-500 px-8 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
                >
                  吃牌
                </button>
              ) : null}
              <button
                onClick={draw}
                className="rounded-full bg-amber-500 px-8 py-3 text-sm font-bold text-neutral-900 shadow-lg transition active:scale-95"
              >
                摸牌
              </button>
            </>
          ) : null}
        </div>
      </div>
    </CasinoTableShell>
  )
}
