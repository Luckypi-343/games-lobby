"use client"

import { useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import type { PuzzleGame } from "@/lib/luckypi/data"
import { useLuckyPi } from "@/contexts/luckypi-context"
import { puzzleGameText, puzzleCommonText } from "@/lib/luckypi/puzzle-i18n"
import { PuzzleHeader } from "@/components/luckypi/puzzle-header"

// 每一款遊戲的畫面,改成只有在玩家真正點進去玩那一款的時候,手機才會去下載、
// 才會真正載入到記憶體裡,不會在剛打開首頁的那一刻,就把一百多款遊戲的程式全部一次塞進手機,
// 這樣才不會在手機上造成讀取過久、白屏或閃退。
function GameLoadingFallback() {
  return (
    <div className="flex min-h-dvh flex-1 items-center justify-center bg-background">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}

function lazyGame<P extends object = any>(loader: () => Promise<Record<string, any>>, exportName: string) {
  return dynamic<P>(() => loader().then((m) => ({ default: m[exportName] })), {
    ssr: false,
    loading: GameLoadingFallback,
  })
}

const TicTacToeView = lazyGame(() => import("@/components/games/tictactoe-view"), "TicTacToeView")
const GomokuView = lazyGame(() => import("@/components/games/gomoku-view"), "GomokuView")
const OthelloView = lazyGame(() => import("@/components/games/othello-view"), "OthelloView")
const CheckersView = lazyGame(() => import("@/components/games/checkers-view"), "CheckersView")
const GoView = lazyGame(() => import("@/components/games/go-view"), "GoView")
const XiangqiView = lazyGame(() => import("@/components/games/xiangqi-view"), "XiangqiView")
const DarkChessView = lazyGame(() => import("@/components/games/darkchess-view"), "DarkChessView")
const LuzhanqiView = lazyGame(() => import("@/components/games/luzhanqi-view"), "LuzhanqiView")
const MahjongView = lazyGame(() => import("@/components/games/mahjong-view"), "MahjongView")
const ChessView = lazyGame(() => import("@/components/games/chess-view"), "ChessView")
const ChineseCheckersView = lazyGame(() => import("@/components/games/chinese-checkers-view"), "ChineseCheckersView")
const LudoView = lazyGame(() => import("@/components/games/ludo-view"), "LudoView")
const SolitaireView = lazyGame(() => import("@/components/games/solitaire-view"), "SolitaireView")
const RummikubView = lazyGame(() => import("@/components/games/rummikub-view"), "RummikubView")
const Connect4View = lazyGame(() => import("@/components/games/connect4-view"), "Connect4View")
const RpsView = lazyGame(() => import("@/components/games/rps-view"), "RpsView")
const SlidingPuzzleView = lazyGame(() => import("@/components/games/sliding-puzzle-view"), "SlidingPuzzleView")
const NumberMergeView = lazyGame(() => import("@/components/games/number-merge-view"), "NumberMergeView")
const MemoryMatchView = lazyGame(() => import("@/components/games/memory-match-view"), "MemoryMatchView")
const TexasHoldemView = lazyGame(() => import("@/components/games/texas-holdem-view"), "TexasHoldemView")
const BlackjackView = lazyGame(() => import("@/components/games/blackjack-view"), "BlackjackView")
const BaccaratView = lazyGame(() => import("@/components/games/baccarat-view"), "BaccaratView")
const WarView = lazyGame(() => import("@/components/games/war-view"), "WarView")
const ThreeCardPokerView = lazyGame(() => import("@/components/games/three-card-poker-view"), "ThreeCardPokerView")
const KlotskiView = lazyGame(() => import("@/components/games/klotski-view"), "KlotskiView")
const TetrisView = lazyGame(() => import("@/components/games/tetris-view"), "TetrisView")
const BubbleShooterView = lazyGame(() => import("@/components/games/bubble-shooter-view"), "BubbleShooterView")
const Match3View = lazyGame(() => import("@/components/games/match3-view"), "Match3View")
const HanoiView = lazyGame(() => import("@/components/games/hanoi-view"), "HanoiView")
const WaterSortView = lazyGame(() => import("@/components/games/water-sort-view"), "WaterSortView")
const PipeConnectView = lazyGame(() => import("@/components/games/pipe-connect-view"), "PipeConnectView")
const StackTowerView = lazyGame(() => import("@/components/games/stack-tower-view"), "StackTowerView")
const SequenceSortView = lazyGame(() => import("@/components/games/sequence-sort-view"), "SequenceSortView")
const MiniSudokuView = lazyGame(() => import("@/components/games/mini-sudoku-view"), "MiniSudokuView")
const ShootingRangeView = lazyGame(() => import("@/components/games/shooting-range-view"), "ShootingRangeView")
const SpaceInvadersView = lazyGame(() => import("@/components/games/space-invaders-view"), "SpaceInvadersView")
const TankBattleView = lazyGame(() => import("@/components/games/tank-battle-view"), "TankBattleView")
const BrickBreakerView = lazyGame(() => import("@/components/games/brick-breaker-view"), "BrickBreakerView")
const ZombieDefenseView = lazyGame(() => import("@/components/games/zombie-defense-view"), "ZombieDefenseView")
const AirCombatView = lazyGame(() => import("@/components/games/air-combat-view"), "AirCombatView")
const DuelArenaView = lazyGame(() => import("@/components/games/duel-arena-view"), "DuelArenaView")
const PenaltyKickView = lazyGame(() => import("@/components/games/penalty-kick-view"), "PenaltyKickView")
const RacingView = lazyGame(() => import("@/components/games/racing-view"), "RacingView")
const ParkingView = lazyGame(() => import("@/components/games/parking-view"), "ParkingView")
const MotocrossView = lazyGame(() => import("@/components/games/motocross-view"), "MotocrossView")
const DriftRacingView = lazyGame(() => import("@/components/games/drift-racing-view"), "DriftRacingView")
const TenHalfView = lazyGame(() => import("@/components/games/ten-half-view"), "TenHalfView")
const SevenPkView = lazyGame(() => import("@/components/games/seven-pk-view"), "SevenPkView")
const SevenPkRealView = lazyGame(() => import("@/components/games/seven-pk-real-view"), "SevenPkView")
const StudPokerView = lazyGame(() => import("@/components/games/stud-poker-view"), "StudPokerView")
const NiuniuView = lazyGame(() => import("@/components/games/niuniu-view"), "NiuniuView")
const ZhaJinhuaView = lazyGame(() => import("@/components/games/zha-jinhua-view"), "ZhaJinhuaView")
const ThirteenWaterView = lazyGame(() => import("@/components/games/thirteen-water-view"), "ThirteenWaterView")
const BigTwoView = lazyGame(() => import("@/components/games/big-two-view"), "BigTwoView")
const BridgeView = lazyGame(() => import("@/components/games/bridge-view"), "BridgeView")
const PickRedPointsView = lazyGame(() => import("@/components/games/pick-red-points-view"), "PickRedPointsView")
const DouDizhuView = lazyGame(() => import("@/components/games/dou-dizhu-view"), "DouDizhuView")
const LittleMaryView = lazyGame(() => import("@/components/games/little-mary-view"), "LittleMaryView")
const LittleMary2View = lazyGame(() => import("@/components/games/little-mary-2-view"), "LittleMary2View")
const LittleMary3View = lazyGame(() => import("@/components/games/little-mary-3-view"), "LittleMary3View")
const LittleMary4View = lazyGame(() => import("@/components/games/little-mary-4-view"), "LittleMary4View")
const LittleMary5View = lazyGame(() => import("@/components/games/little-mary-5-view"), "LittleMary5View")
const LittleMary6View = lazyGame(() => import("@/components/games/little-mary-6-view"), "LittleMary6View")
const LittleMary7View = lazyGame(() => import("@/components/games/little-mary-7-view"), "LittleMary7View")
const LittleMary8View = lazyGame(() => import("@/components/games/little-mary-8-view"), "LittleMary8View")
const FruitSlot1View = lazyGame(() => import("@/components/games/fruit-slot-1-view"), "FruitSlot1View")
const FruitSlot2View = lazyGame(() => import("@/components/games/fruit-slot-2-view"), "FruitSlot2View")
const LittleMaryBonusView = lazyGame(() => import("@/components/games/little-mary-bonus-view"), "LittleMaryBonusView")
const LittleMaryBonus2View = lazyGame(
  () => import("@/components/games/little-mary-bonus-2-view"),
  "LittleMaryBonus2View",
)
const LiarsCardsView = lazyGame(() => import("@/components/games/liars-cards-view"), "LiarsCardsView")
const SevensView = lazyGame(() => import("@/components/games/sevens-view"), "SevensView")
const MahjongNinePoint5View = lazyGame(
  () => import("@/components/games/mahjong-ninepoint5-view"),
  "MahjongNinePoint5View",
)
const MahjongNiuNiuView = lazyGame(() => import("@/components/games/mahjong-niuniu-view"), "MahjongNiuNiuView")
const MahjongPengPengView = lazyGame(() => import("@/components/games/mahjong-pengpeng-view"), "MahjongPengPengView")
const MahjongSevensView = lazyGame(() => import("@/components/games/mahjong-sevens-view"), "MahjongSevensView")
const DragonGateView = lazyGame(() => import("@/components/games/dragon-gate-view"), "DragonGateView")
const MahjongSolitaireView = lazyGame(() => import("@/components/games/mahjong-solitaire-view"), "MahjongSolitaireView")
const SichuanMahjongView = lazyGame(() => import("@/components/games/sichuan-mahjong-view"), "SichuanMahjongView")
const MalaysiaMahjongView = lazyGame(() => import("@/components/games/malaysia-mahjong-view"), "MalaysiaMahjongView")
const RiichiMahjongView = lazyGame(() => import("@/components/games/riichi-mahjong-view"), "RiichiMahjongView")
const XiangqiMahjongView = lazyGame(() => import("@/components/games/xiangqi-mahjong-view"), "XiangqiMahjongView")
const TuiTongZaiView = lazyGame(() => import("@/components/games/tuitongzai-view"), "TuiTongZaiView")
const Merge2048View = lazyGame(() => import("@/components/games/merge-2048-view"), "Merge2048View")
const City2048View = lazyGame(() => import("@/components/games/city-2048-view"), "City2048View")
const Merge2048UndoView = lazyGame(() => import("@/components/games/merge-2048-undo-view"), "Merge2048UndoView")
const TripleTownView = lazyGame(() => import("@/components/games/triple-town-view"), "TripleTownView")
const SuikaView = lazyGame(() => import("@/components/games/suika-view"), "SuikaView")
const Drop2048View = lazyGame(() => import("@/components/games/drop-2048-view"), "Drop2048View")
const PuyoView = lazyGame(() => import("@/components/games/puyo-view"), "PuyoView")
const DrMarioView = lazyGame(() => import("@/components/games/dr-mario-view"), "DrMarioView")
const ColumnsTetrisView = lazyGame(() => import("@/components/games/columns-tetris-view"), "ColumnsTetrisView")
const CandyCrushView = lazyGame(() => import("@/components/games/candy-crush-view"), "CandyCrushView")
const BejeweledView = lazyGame(() => import("@/components/games/bejeweled-view"), "BejeweledView")
const GardenscapesView = lazyGame(() => import("@/components/games/gardenscapes-view"), "GardenscapesView")
const HomescapesView = lazyGame(() => import("@/components/games/homescapes-view"), "HomescapesView")
const RoyalMatchView = lazyGame(() => import("@/components/games/royal-match-view"), "RoyalMatchView")
const TowerOfSaviorsView = lazyGame(() => import("@/components/games/tower-of-saviors-view"), "TowerOfSaviorsView")
const PuzzleDragonsView = lazyGame(() => import("@/components/games/puzzle-dragons-view"), "PuzzleDragonsView")
const EmpiresPuzzlesView = lazyGame(() => import("@/components/games/empires-puzzles-view"), "EmpiresPuzzlesView")
const SheepSheepView = lazyGame(() => import("@/components/games/sheep-sheep-view"), "SheepSheepView")
const Match3DView = lazyGame(() => import("@/components/games/match3d-view"), "Match3DView")
const BallsMergeView = lazyGame(() => import("@/components/games/balls-merge-view"), "BallsMergeView")
const CookiesMergeView = lazyGame(() => import("@/components/games/cookies-merge-view"), "CookiesMergeView")
const PlanetsMergeView = lazyGame(() => import("@/components/games/planets-merge-view"), "PlanetsMergeView")

function ComingSoonView({
  game,
  name,
  subtitle,
  onBack,
}: {
  game: PuzzleGame
  name: string
  subtitle: string
  onBack: () => void
}) {
  const { lang } = useLuckyPi()
  const common = puzzleCommonText(lang)
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-serif text-2xl font-bold text-primary">{name}</p>
      <p className="text-sm text-muted-foreground">{subtitle}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{common.comingSoonText}</p>
      <button
        onClick={onBack}
        className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition active:scale-95"
      >
        {common.backToLobby}
      </button>
    </div>
  )
}

function GameBody({
  game,
  name,
  subtitle,
  onBack,
  onHome,
}: {
  game: PuzzleGame
  name: string
  subtitle: string
  onBack: () => void
  onHome: () => void
}) {
  switch (game.id) {
    case "ten-half":
      return <TenHalfView onHome={onHome} onLobby={onBack} />
    case "five-pk":
      return <SevenPkView onHome={onHome} onLobby={onBack} />
    case "seven-pk":
      return <SevenPkRealView onHome={onHome} onLobby={onBack} />
    case "stud-poker":
      return <StudPokerView onHome={onHome} onLobby={onBack} />
    case "niuniu":
      return <NiuniuView onHome={onHome} onLobby={onBack} />
    case "zha-jinhua":
      return <ZhaJinhuaView onHome={onHome} onLobby={onBack} />
    case "little-mary":
      return <LittleMaryView onHome={onHome} onLobby={onBack} />
    case "little-mary-2":
      return <LittleMary2View onHome={onHome} onLobby={onBack} />
    case "little-mary-3":
      return <LittleMary3View onHome={onHome} onLobby={onBack} />
    case "little-mary-4":
      return <LittleMary4View onHome={onHome} onLobby={onBack} />
    case "little-mary-5":
      return <LittleMary5View onHome={onHome} onLobby={onBack} />
    case "little-mary-6":
      return <LittleMary6View onHome={onHome} onLobby={onBack} />
    case "little-mary-7":
      return <LittleMary7View onHome={onHome} onLobby={onBack} />
    case "little-mary-8":
      return <LittleMary8View onHome={onHome} onLobby={onBack} />
    case "fruit-slot-1":
      return <FruitSlot1View onHome={onHome} onLobby={onBack} />
    case "fruit-slot-2":
      return <FruitSlot2View onHome={onHome} onLobby={onBack} />
    case "little-mary-bonus":
      return <LittleMaryBonusView onHome={onHome} onLobby={onBack} />
    case "little-mary-bonus-2":
      return <LittleMaryBonus2View onHome={onHome} onLobby={onBack} />
    case "xiangqi-mahjong":
      return <XiangqiMahjongView onHome={onHome} onLobby={onBack} />
    case "tuitongzai":
      return <TuiTongZaiView onHome={onHome} onLobby={onBack} />
    case "thirteen-water":
      return <ThirteenWaterView onHome={onHome} onLobby={onBack} />
    case "big-two":
      return <BigTwoView onHome={onHome} onLobby={onBack} />
    case "bridge":
      return <BridgeView onBack={onBack} />
    case "pick-red-points":
      return <PickRedPointsView onBack={onBack} />
    case "dou-dizhu":
      return <DouDizhuView onBack={onBack} />
    case "liars-cards":
      return <LiarsCardsView onBack={onBack} />
    case "sevens":
      return <SevensView onHome={onHome} onLobby={onBack} />
    case "mahjong-ninepoint5":
      return <MahjongNinePoint5View onHome={onHome} onLobby={onBack} />
    case "mahjong-niuniu":
      return <MahjongNiuNiuView onHome={onHome} onLobby={onBack} />
    case "mahjong-pengpeng":
      return <MahjongPengPengView onHome={onHome} onLobby={onBack} />
    case "mahjong-sevens":
      return <MahjongSevensView onHome={onHome} onLobby={onBack} />
    case "dragon-gate":
      return <DragonGateView onHome={onHome} onLobby={onBack} />
    case "mahjong-solitaire":
      return <MahjongSolitaireView onHome={onHome} onLobby={onBack} />
    case "merge-2048":
      return <Merge2048View onBack={onBack} />
    case "city-2048":
      return <City2048View onBack={onBack} />
    case "merge-2048-undo":
      return <Merge2048UndoView onBack={onBack} />
    case "triple-town":
      return <TripleTownView onBack={onBack} />
    case "suika":
      return <SuikaView onBack={onBack} />
    case "drop-2048":
      return <Drop2048View onBack={onBack} />
    case "puyo":
      return <PuyoView onBack={onBack} />
    case "dr-mario":
      return <DrMarioView onBack={onBack} />
    case "columns-tetris":
      return <ColumnsTetrisView onBack={onBack} />
    case "candy-crush":
      return <CandyCrushView onBack={onBack} />
    case "bejeweled":
      return <BejeweledView onBack={onBack} />
    case "gardenscapes":
      return <GardenscapesView onBack={onBack} />
    case "homescapes":
      return <HomescapesView onBack={onBack} />
    case "royal-match":
      return <RoyalMatchView onBack={onBack} />
    case "tower-of-saviors":
      return <TowerOfSaviorsView onBack={onBack} />
    case "puzzle-dragons":
      return <PuzzleDragonsView onBack={onBack} />
    case "empires-puzzles":
      return <EmpiresPuzzlesView onBack={onBack} />
    case "sheep-sheep":
      return <SheepSheepView onBack={onBack} />
    case "match3d":
      return <Match3DView onBack={onBack} />
    case "balls-merge":
      return <BallsMergeView onBack={onBack} />
    case "cookies-merge":
      return <CookiesMergeView onBack={onBack} />
    case "planets-merge":
      return <PlanetsMergeView onBack={onBack} />
    case "sichuan-mahjong":
      return <SichuanMahjongView onHome={onHome} onLobby={onBack} />
    case "malaysia-mahjong":
      return <MalaysiaMahjongView onHome={onHome} onLobby={onBack} />
    case "riichi-mahjong":
      return <RiichiMahjongView onHome={onHome} onLobby={onBack} />
    case "tictactoe":
      return <TicTacToeView onBack={onBack} />
    case "gomoku":
      return <GomokuView onBack={onBack} />
    case "othello":
      return <OthelloView onBack={onBack} />
    case "checkers":
      return <CheckersView onBack={onBack} />
    case "go":
      return <GoView onBack={onBack} />
    case "xiangqi":
      return <XiangqiView onBack={onBack} />
    case "darkchess-classic":
      return <DarkChessView onBack={onBack} variant="traditional" />
    case "darkchess-variant":
      return <DarkChessView onBack={onBack} variant="variant" />
    case "luzhanqi":
      return <LuzhanqiView onBack={onBack} />
    case "mahjong":
      return <MahjongView onBack={onBack} />
    case "connect4":
      return <Connect4View onBack={onBack} />
    case "rps-battle":
      return <RpsView onBack={onBack} />
    case "chess":
      return <ChessView onBack={onBack} />
    case "chinese-checkers":
      return <ChineseCheckersView onBack={onBack} />
    case "ludo":
      return <LudoView onBack={onBack} />
    case "solitaire":
      return <SolitaireView onBack={onBack} />
    case "rummikub":
      return <RummikubView onBack={onBack} />
    case "jigsaw":
      return <SlidingPuzzleView onBack={onBack} />
    case "number-merge":
      return <NumberMergeView onBack={onBack} />
    case "memory-match":
      return <MemoryMatchView onBack={onBack} />
    case "texas-holdem":
      return <TexasHoldemView onBack={onBack} />
    case "blackjack":
      return <BlackjackView onBack={onBack} />
    case "baccarat":
      return <BaccaratView onBack={onBack} />
    case "war":
      return <WarView onBack={onBack} />
    case "three-card-poker":
      return <ThreeCardPokerView onBack={onBack} />
    case "klotski":
      return <KlotskiView onBack={onBack} />
    case "tetris":
      return <TetrisView onBack={onBack} />
    case "bubble-shooter":
      return <BubbleShooterView onBack={onBack} />
    case "match3":
      return <Match3View onBack={onBack} />
    case "hanoi":
      return <HanoiView onBack={onBack} />
    case "water-sort":
      return <WaterSortView onBack={onBack} />
    case "pipe-connect":
      return <PipeConnectView onBack={onBack} />
    case "stack-tower":
      return <StackTowerView onBack={onBack} />
    case "sequence-sort":
      return <SequenceSortView onBack={onBack} />
    case "mini-sudoku":
      return <MiniSudokuView onBack={onBack} />
    case "shooting-range":
      return <ShootingRangeView onBack={onBack} />
    case "space-invaders":
      return <SpaceInvadersView onBack={onBack} />
    case "tank-battle":
      return <TankBattleView onBack={onBack} />
    case "brick-breaker":
      return <BrickBreakerView onBack={onBack} />
    case "zombie-defense":
      return <ZombieDefenseView onBack={onBack} />
    case "air-combat":
      return <AirCombatView onBack={onBack} />
    case "duel-arena":
      return <DuelArenaView onBack={onBack} />
    case "penalty-kick":
      return <PenaltyKickView onBack={onBack} />
    case "racing":
      return <RacingView onBack={onBack} />
    case "parking":
      return <ParkingView onBack={onBack} />
    case "motocross":
      return <MotocrossView onBack={onBack} />
    case "drift-racing":
      return <DriftRacingView onBack={onBack} />
    default:
      return <ComingSoonView game={game} name={name} subtitle={subtitle} onBack={onBack} />
  }
}

export function PuzzleGameScreen({
  game,
  onBack,
  onHome,
}: {
  game: PuzzleGame
  onBack: () => void
  onHome: () => void
}) {
  const { spendCoins, toast, lang } = useLuckyPi()
  const chargedForRef = useRef<string | null>(null)
  const text = puzzleGameText(lang, game.id)
  const common = puzzleCommonText(lang)
  const name = text?.name ?? game.name
  const subtitle = text?.subtitle ?? game.subtitle
  const rules = text?.rules ?? game.rules

  useEffect(() => {
    // 牌桌類遊戲每一局自己調整押注、贏了才拿彩金,不在進場時預扣固定費用。
    if (game.wagered) return
    if (chargedForRef.current === game.id) return
    chargedForRef.current = game.id
    const ok = spendCoins(game.cost)
    if (ok) {
      toast(common.costToastTemplate.replace("{cost}", String(game.cost)))
    }
    // Only charge once per time this screen is opened for this game.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id])

  if (game.wagered) {
    // 牌桌類遊戲有自己專屬的頂部功能列與押注列(CasinoTableShell),不套用益智小遊戲共用的外層標題列。
    return <GameBody game={game} name={name} subtitle={subtitle} onBack={onBack} onHome={onHome} />
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <PuzzleHeader title={name} rules={rules} onHome={onHome} onLobby={onBack} />
      <GameBody game={game} name={name} subtitle={subtitle} onBack={onBack} onHome={onHome} />
    </div>
  )
}
