"use client"

import { useEffect, useRef, useState } from "react"
import { BoardShell, type PuzzleOutcome } from "./board-shell"
import { PlayingCard } from "./playing-card"
import {
  type DealState,
  type Seat,
  type Strain,
  type Call,
  type Contract,
  SEAT_ORDER,
  SEAT_LABEL,
  STRAIN_ORDER,
  isYourTeam,
  partnershipOf,
  partnerOf,
  dealerForBoard,
  newDeal,
  legalCallTypes,
  minLegalBidRank,
  bidRank,
  applyCall,
  aiDecideCall,
  finalizeAuction,
  seatController,
  aiChooseCard,
  playCard,
  scoreContract,
  strainSymbol,
  isVulnerable,
  handPoints,
} from "@/lib/games/bridge"
import { playMoveSound, playCaptureSound } from "@/lib/games/game-audio"
import { useLuckyPi } from "@/contexts/luckypi-context"

const GAME_ID = "bridge"

function callLabel(call: Call): string {
  if (call.kind === "pass") return "過"
  if (call.kind === "double") return "加倍"
  if (call.kind === "redouble") return "再加倍"
  return `${call.bid.level}${strainSymbol(call.bid.strain)}`
}
function strainColor(strain: Strain): string {
  if (strain === "NT") return "oklch(0.72 0.14 80)"
  if (strain === 1 || strain === 2) return "oklch(0.58 0.2 20)" // ♥♦ 紅
  return "oklch(0.3 0.02 260)" // ♠♣ 黑
}
function doubledSuffix(d: 0 | 1 | 2): string {
  return d === 1 ? "（加倍）" : d === 2 ? "（再加倍）" : ""
}
function roleLabel(seat: Seat, contract: Contract): string {
  if (seat === contract.declarer) return "莊家"
  if (seat === partnerOf(contract.declarer)) return "夢家"
  return "防守"
}

export function BridgeView({ onBack }: { onBack: () => void }) {
  const { soundOn } = useLuckyPi()
  const [board, setBoard] = useState(1)
  const [deal, setDeal] = useState<DealState>(() => newDeal(1, dealerForBoard(1)))
  const [match, setMatch] = useState({ ns: 0, ew: 0 })
  const appliedBoardRef = useRef<number>(0)

  function nextDeal() {
    const nb = board + 1
    setBoard(nb)
    setDeal(newDeal(nb, dealerForBoard(nb)))
  }
  function resetMatch() {
    setBoard(1)
    setDeal(newDeal(1, dealerForBoard(1)))
    setMatch({ ns: 0, ew: 0 })
    appliedBoardRef.current = 0
  }

  // AI 叫牌
  useEffect(() => {
    if (deal.phase !== "bidding" || deal.auction.finished || deal.auction.turn === "south") return
    const t = setTimeout(() => {
      const call = aiDecideCall(deal.auction.turn, deal.auction, deal.hands)
      setDeal((d) => (d.phase === "bidding" ? { ...d, auction: applyCall(d.auction, d.auction.turn, call) } : d))
    }, 650)
    return () => clearTimeout(t)
  }, [deal.phase, deal.auction, deal.hands])

  // 叫牌結束 → 定約或流局重發
  useEffect(() => {
    if (deal.phase !== "bidding" || !deal.auction.finished) return
    const t = setTimeout(() => {
      if (deal.auction.passedOut) nextDeal()
      else setDeal((d) => finalizeAuction(d))
    }, 900)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deal.phase, deal.auction.finished])

  // AI／莊家代打 自動出牌
  useEffect(() => {
    if (deal.phase !== "playing" || !deal.play || deal.play.finished || !deal.contract) return
    const play = deal.play
    const contract = deal.contract
    if (seatController(play.turn, contract) === "human") return
    const t = setTimeout(() => {
      const trump = contract.strain === "NT" ? null : contract.strain
      const card = aiChooseCard(play.hands[play.turn], play.currentTrick, trump)
      const wasTrickOver = play.currentTrick.plays.length === 3
      const next = playCard(play, play.turn, card)
      setDeal((d) => (d.play === play ? { ...d, play: next } : d))
      if (soundOn) (wasTrickOver ? playCaptureSound : playMoveSound)()
    }, 550)
    return () => clearTimeout(t)
  }, [deal.phase, deal.play, deal.contract, soundOn])

  // 13 墩出完 → 計分
  useEffect(() => {
    if (deal.phase !== "playing" || !deal.play?.finished || !deal.contract) return
    const tricksWon = deal.play.tricksWon[partnershipOf(deal.contract.declarer)]
    const score = scoreContract(deal.contract, tricksWon, deal.vulnerability)
    setDeal((d) => ({ ...d, phase: "scoring", score }))
  }, [deal.phase, deal.play?.finished, deal.contract, deal.vulnerability])

  // 計分結果計入總比數（每局只計一次）
  useEffect(() => {
    if (deal.phase === "scoring" && deal.score && appliedBoardRef.current !== deal.board) {
      appliedBoardRef.current = deal.board
      const s = deal.score
      setMatch((m) => ({ ns: m.ns + (s.scoringSide === "NS" ? s.points : 0), ew: m.ew + (s.scoringSide === "EW" ? s.points : 0) }))
      if (soundOn) (s.scoringSide === "NS" ? playCaptureSound : playMoveSound)()
    }
  }, [deal.phase, deal.score, deal.board, soundOn])

  function handleBid(level: number, strain: Strain) {
    if (deal.auction.turn !== "south" || deal.auction.finished) return
    setDeal((d) => ({ ...d, auction: applyCall(d.auction, "south", { kind: "bid", bid: { level, strain } }) }))
  }
  function handleCall(kind: "pass" | "double" | "redouble") {
    if (deal.auction.turn !== "south" || deal.auction.finished) return
    setDeal((d) => ({ ...d, auction: applyCall(d.auction, "south", { kind }) }))
  }
  function handlePlay(seat: Seat, cardId: string) {
    if (!deal.play || !deal.contract || deal.play.finished) return
    if (seatController(seat, deal.contract) !== "human" || deal.play.turn !== seat) return
    const card = deal.play.hands[seat].find((c) => c.id === cardId)
    if (!card) return
    const legal =
      deal.play.currentTrick.plays.length > 0
        ? deal.play.hands[seat].filter((c) => c.suit === deal.play!.currentTrick.ledSuit)
        : deal.play.hands[seat]
    const pool = legal.length > 0 ? legal : deal.play.hands[seat]
    if (!pool.some((c) => c.id === cardId)) return
    const wasTrickOver = deal.play.currentTrick.plays.length === 3
    const next = playCard(deal.play, seat, card)
    setDeal((d) => (d.play ? { ...d, play: next } : d))
    if (soundOn) (wasTrickOver ? playCaptureSound : playMoveSound)()
  }

  const vulNS = isVulnerable(deal.vulnerability, "NS")
  const vulEW = isVulnerable(deal.vulnerability, "EW")

  const result: PuzzleOutcome =
    deal.phase === "scoring" && deal.score ? (deal.score.scoringSide === "NS" ? "win" : "loss") : null

  const status =
    deal.phase === "bidding"
      ? deal.auction.finished
        ? deal.auction.passedOut
          ? "全部過牌，重新發牌…"
          : "叫牌結束，定約中…"
        : `第 ${board} 局叫牌中・輪到：${SEAT_LABEL[deal.auction.turn]}`
      : deal.phase === "playing" && deal.contract
        ? `定約 ${deal.contract.level}${strainSymbol(deal.contract.strain)}${doubledSuffix(deal.contract.doubled)}・莊家 ${SEAT_LABEL[deal.contract.declarer]}・輪到 ${SEAT_LABEL[deal.play!.turn]}`
        : deal.score
          ? deal.score.detail
          : ""

  return (
    <BoardShell
      gameId={GAME_ID}
      title="橋牌"
      subtitle="正宗合約橋牌：發牌→叫牌→打牌→計分"
      status={status}
      rulesBrief="四人分南北（您與北家隊友）、東西（西家、東家電腦）兩隊，每人發13張牌。先叫牌：由莊家開始依序喊價，花色等級 NT>♠>♥>♦>♣，線數1～7，每次喊牌需比前一家更高；也可以「過」，或對敵方「加倍」、被加倍後「再加倍」。連續三家過牌，最後喊出的合約定案，先喊出該花色的一方成為莊家，其隊友成為夢家，開出第一張牌後攤牌由莊家代打。打牌共13墩，須跟牌，沒有同花色才能打別的花色或王牌；每墩由花色最大或王牌最大者獲勝並取得下一墩開牌權。計分：達成合約得基本分＋超墩分，湊滿100分有成局獎勵，叫滿6線（小滿貫）或7線（大滿貫）另有高額獎分；未達成合約則由防守方依少墩數、是否加倍獲得罰分。"
      result={result}
      onBack={onBack}
      onRestart={resetMatch}
      mode="single"
    >
      <div className="flex w-full max-w-sm flex-col items-center gap-2">
        {/* 局況列：局號、局況脆弱性、總比數 */}
        <div className="flex w-full items-center justify-between rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-[10px]">
          <span className="text-muted-foreground">第 {board} 局・莊家 {SEAT_LABEL[deal.dealer]}</span>
          <div className="flex items-center gap-1.5">
            <span className={`rounded px-1.5 py-0.5 font-semibold ${vulNS ? "bg-destructive/20 text-destructive" : "text-muted-foreground"}`}>
              南北 {match.ns}
            </span>
            <span className={`rounded px-1.5 py-0.5 font-semibold ${vulEW ? "bg-destructive/20 text-destructive" : "text-muted-foreground"}`}>
              東西 {match.ew}
            </span>
          </div>
        </div>

        {deal.phase === "bidding" && (
          <BiddingPanel deal={deal} onBid={handleBid} onCall={handleCall} />
        )}

        {deal.phase === "playing" && deal.play && deal.contract && (
          <PlayPanel deal={deal} onPlay={handlePlay} />
        )}

        {deal.phase === "scoring" && deal.score && deal.contract && (
          <ScoringPanel contract={deal.contract} score={deal.score} onNext={nextDeal} />
        )}
      </div>
    </BoardShell>
  )
}

function BiddingPanel({
  deal,
  onBid,
  onCall,
}: {
  deal: DealState
  onBid: (level: number, strain: Strain) => void
  onCall: (kind: "pass" | "double" | "redouble") => void
}) {
  const auction = deal.auction
  const legal = legalCallTypes(auction, "south")
  const minRank = minLegalBidRank(auction)
  const yourPoints = handPoints(deal.hands.south)

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full items-center justify-around text-[11px] text-muted-foreground">
        {SEAT_ORDER.filter((s) => s !== "south").map((seat) => (
          <div key={seat} className="flex flex-col items-center gap-0.5">
            <span className={`${isYourTeam(seat) ? "font-semibold text-primary" : ""} ${auction.turn === seat && !auction.finished ? "underline" : ""}`}>
              {SEAT_LABEL[seat]}
              {auction.dealer === seat ? "・莊" : ""}
            </span>
          </div>
        ))}
      </div>

      <div className="flex max-h-24 w-full flex-col gap-0.5 overflow-y-auto rounded-lg border border-border bg-card/60 p-2 text-[11px]">
        {auction.calls.length === 0 ? (
          <p className="text-center text-muted-foreground">叫牌開始，由 {SEAT_LABEL[auction.dealer]} 先喊</p>
        ) : (
          auction.calls.map((rec, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className={isYourTeam(rec.seat) ? "font-semibold text-primary" : "text-foreground"}>{SEAT_LABEL[rec.seat]}</span>
              <span className="lp-nums font-semibold">{callLabel(rec.call)}</span>
            </div>
          ))
        )}
      </div>

      <p className="text-[11px] text-primary">您（南）・{yourPoints} 點</p>

      {auction.turn === "south" && !auction.finished ? (
        <div className="flex w-full flex-col gap-1.5">
          <div className="grid grid-cols-5 gap-1">
            {STRAIN_ORDER.map((strain) => (
              <span key={String(strain)} className="text-center text-xs font-bold" style={{ color: strainColor(strain) }}>
                {strainSymbol(strain)}
              </span>
            ))}
          </div>
          {Array.from({ length: 7 }, (_, i) => i + 1).map((level) => (
            <div key={level} className="grid grid-cols-5 gap-1">
              {STRAIN_ORDER.map((strain) => {
                const disabled = bidRank({ level, strain }) < minRank
                return (
                  <button
                    key={String(strain)}
                    disabled={disabled}
                    onClick={() => onBid(level, strain)}
                    className="rounded-md border border-border bg-card py-1 text-[11px] font-bold transition active:scale-95 disabled:opacity-25"
                    style={{ color: disabled ? undefined : strainColor(strain) }}
                  >
                    {level}
                  </button>
                )
              })}
            </div>
          ))}
          <div className="mt-1 grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onCall("pass")}
              className="rounded-lg border border-border bg-secondary py-2 text-xs font-semibold active:scale-95"
            >
              過
            </button>
            <button
              onClick={() => onCall("double")}
              disabled={!legal.canDouble}
              className="rounded-lg border border-border bg-secondary py-2 text-xs font-semibold active:scale-95 disabled:opacity-30"
            >
              加倍
            </button>
            <button
              onClick={() => onCall("redouble")}
              disabled={!legal.canRedouble}
              className="rounded-lg border border-border bg-secondary py-2 text-xs font-semibold active:scale-95 disabled:opacity-30"
            >
              再加倍
            </button>
          </div>
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          {auction.finished ? (auction.passedOut ? "流局，準備重新發牌" : "叫牌結束") : `等待 ${SEAT_LABEL[auction.turn]} 叫牌…`}
        </p>
      )}
    </div>
  )
}

function PlayPanel({ deal, onPlay }: { deal: DealState; onPlay: (seat: Seat, cardId: string) => void }) {
  const play = deal.play!
  const contract = deal.contract!
  const revealed = play.completedTricks.length > 0 || play.currentTrick.plays.length > 0
  const dummy = play.dummy

  function renderOtherSeat(seat: Seat) {
    const isDummySeat = seat === dummy
    const faceUp = isDummySeat && revealed
    const controllable = seatController(seat, contract) === "human" && play.turn === seat && !play.finished
    return (
      <div key={seat} className="flex flex-col items-center gap-1">
        <span className={`text-[10px] ${isYourTeam(seat) ? "font-semibold text-primary" : "text-muted-foreground"} ${play.turn === seat ? "underline" : ""}`}>
          {SEAT_LABEL[seat]}・{roleLabel(seat, contract)}
        </span>
        {faceUp ? (
          <div className="flex max-w-[280px] flex-wrap justify-center gap-1">
            {play.hands[seat].map((card) => (
              <button
                key={card.id}
                onClick={() => onPlay(seat, card.id)}
                disabled={!controllable}
                className="transition active:scale-95 disabled:opacity-60"
              >
                <PlayingCard card={card} small />
              </button>
            ))}
          </div>
        ) : (
          <span className="lp-nums text-[11px] text-muted-foreground">剩 {play.hands[seat].length} 張</span>
        )}
      </div>
    )
  }

  const southControllable = seatController("south", contract) === "human" && play.turn === "south" && !play.finished

  return (
    <div className="flex w-full flex-col items-center gap-2.5">
      <p className="text-[10px] text-muted-foreground">
        王牌：{contract.strain === "NT" ? "無王" : strainSymbol(contract.strain)}・已打 {play.completedTricks.length}/13 墩・您方贏{" "}
        {play.tricksWon.NS}・對方贏 {play.tricksWon.EW}
      </p>

      {renderOtherSeat("north")}

      <div className="flex w-full items-center justify-between">
        <div className="shrink-0">{renderOtherSeat("west")}</div>
        <div className="flex min-h-20 min-w-24 flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card/60 p-2">
          {play.currentTrick.plays.length === 0 ? (
            <p className="text-[10px] text-muted-foreground">等待出牌…</p>
          ) : (
            play.currentTrick.plays.map(({ seat, card }) => (
              <div key={card.id} className="flex flex-col items-center gap-0.5">
                <span className="text-[8px] text-muted-foreground">{SEAT_LABEL[seat]}</span>
                <PlayingCard card={card} small />
              </div>
            ))
          )}
        </div>
        <div className="shrink-0">{renderOtherSeat("east")}</div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[11px] font-semibold text-primary">
          您（南）・{roleLabel("south", contract)}
          {!southControllable && !play.finished ? "（由隊友代打）" : ""}
        </span>
        <div className="flex flex-wrap justify-center gap-1">
          {play.hands.south.map((card) => (
            <button
              key={card.id}
              onClick={() => onPlay("south", card.id)}
              disabled={!southControllable}
              className="transition active:scale-95 disabled:opacity-60"
            >
              <PlayingCard card={card} small />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function ScoringPanel({ contract, score, onNext }: { contract: Contract; score: ReturnType<typeof scoreContract>; onNext: () => void }) {
  return (
    <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-border bg-card/70 p-4">
      <p className="text-sm font-bold">
        定約 {contract.level}
        {strainSymbol(contract.strain)}
        {doubledSuffix(contract.doubled)}・莊家 {SEAT_LABEL[contract.declarer]}
      </p>
      <p className={`text-base font-black ${score.made ? "text-primary" : "text-destructive"}`}>
        {score.made ? "完成合約" : "合約失敗"}
      </p>
      <p className="text-[12px] text-muted-foreground">{score.detail}</p>
      <p className="lp-nums text-sm font-bold">
        {score.scoringSide === "NS" ? "南北" : "東西"} +{score.points} 分
      </p>
      <button onClick={onNext} className="w-full rounded-lg bg-primary py-2.5 text-sm font-bold text-primary-foreground active:scale-95">
        下一局
      </button>
    </div>
  )
}
