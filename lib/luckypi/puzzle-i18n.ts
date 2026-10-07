import type { LangId } from "./i18n"
import { PUZZLE_GAMES, type PuzzleGameId } from "./data"

export interface PuzzleGameText {
  name: string
  subtitle: string
  rules: string
}

export interface PuzzleCommonText {
  mahjongWall: string
  mahjongTotalRounds: string
  mahjongWinCount: string
  mahjongWinRate: string
  mahjongYourDiscards: string
  mahjongEatPongKong: string
  mahjongTingWinDraw: string
  checkersKing: string
  comingSoonText: string
  backToLobby: string
  costToastTemplate: string
}

// Partial so each language file only needs to supply entries for the games it has
// translated so far; puzzle-game-screen.tsx falls back to the Chinese base copy
// (from lib/luckypi/data.ts) for any game id a language table hasn't covered yet.
type GameTable = Partial<Record<PuzzleGameId, PuzzleGameText>>

const zhTW: GameTable = {
  xiangqi: {
    name: "中國象棋",
    subtitle: "AI單人／雙人",
    rules:
      "雙方輪流移動棋子，率先將對方主帥（將）逼入無路可走者獲勝。走法依傳統象棋規則：車直走、馬走日字、象走田字、士走斜線，兵過河後可橫向移動。",
  },
  "darkchess-classic": {
    name: "暗棋（傳統）",
    subtitle: "AI單人／雙人",
    rules:
      "所有棋子背面朝上扣置盤面，點選暗棋即可翻開，翻開後依傳統大小順序互相吃子；點選己方明棋後再點目標格即可移動或吃子，吃光對方棋子或使對方無棋可走者獲勝。",
  },
  "darkchess-variant": {
    name: "暗棋（變異）",
    subtitle: "AI單人／雙人",
    rules:
      "玩法與傳統暗棋相同（點選暗棋翻開，點選己方明棋後點目標格移動或吃子），但砲的攻擊與跳吃方式採用變異規則，增添更多戰術變化，適合喜歡挑戰新玩法的玩家。",
  },
  go: {
    name: "中國圍棋",
    subtitle: "19×19",
    rules: "雙方輪流在 19×19 棋盤的交叉點上放置黑白棋子，圍地面積較多者獲勝；被完全包圍、沒有氣的棋子會被提走。",
  },
  gomoku: { name: "五子棋", subtitle: "17×17", rules: "雙方輪流在棋盤上放置棋子，率先在橫、豎或斜方向連成五子者獲勝。" },
  othello: {
    name: "黑白棋",
    subtitle: "標準規格",
    rules: "雙方輪流放置棋子，只要能夾住對方棋子即可翻轉為己方顏色，終局時棋盤上己方棋子數量較多者獲勝。",
  },
  mahjong: {
    name: "中國麻將",
    subtitle: "AI單人（三家電腦）",
    rules: "與三位電腦對手同桌，輪流摸牌、打牌，可吃、碰、槓其他玩家棄牌，率先湊成合法胡牌牌型者胡牌獲勝。",
  },
  luzhanqi: {
    name: "陸軍棋",
    subtitle: "AI單人／雙人",
    rules: "雙方棋子軍階保密，對方只能看到背面。交戰時依軍階大小決定勝負，率先奪取對方軍旗或使對方無棋可走者獲勝。",
  },
  checkers: {
    name: "跳棋",
    subtitle: "標準規格",
    rules:
      "雙方輪流斜線移動棋子，可跳過並吃掉對方棋子；棋子走到底線可升級為王，升級後可前後斜走；吃光對方棋子或使對方無棋可走者獲勝。",
  },
  tictactoe: {
    name: "井字棋",
    subtitle: "3×3放大格式",
    rules: "雙方輪流在 3×3 棋盤上放置符號，率先在橫、豎或斜方向連成三子者獲勝；九格全部填滿仍無人連線則為平手。",
  },
}

const zhCN: GameTable = {
  xiangqi: {
    name: "中国象棋",
    subtitle: "AI单人／双人",
    rules:
      "双方轮流移动棋子，率先将对方主帅（将）逼入无路可走者获胜。走法依传统象棋规则：车直走、马走日字、象走田字、士走斜线，兵过河后可横向移动。",
  },
  "darkchess-classic": {
    name: "暗棋（传统）",
    subtitle: "AI单人／双人",
    rules:
      "所有棋子背面朝上扣置盘面，点选暗棋即可翻开，翻开后依传统大小顺序互相吃子；点选己方明棋后再点目标格即可移动或吃子，吃光对方棋子或使对方无棋可走者获胜。",
  },
  "darkchess-variant": {
    name: "暗棋（变异）",
    subtitle: "AI单人／双人",
    rules:
      "玩法与传统暗棋相同（点选暗棋翻开，点选己方明棋后点目标格移动或吃子），但炮的攻击与跳吃方式采用变异规则，增添更多战术变化，适合喜欢挑战新玩法的玩家。",
  },
  go: {
    name: "中国围棋",
    subtitle: "19×19",
    rules: "双方轮流在 19×19 棋盘的交叉点上放置黑白棋子，围地面积较多者获胜；被完全包围、没有气的棋子会被提走。",
  },
  gomoku: { name: "五子棋", subtitle: "17×17", rules: "双方轮流在棋盘上放置棋子，率先在横、竖或斜方向连成五子者获胜。" },
  othello: {
    name: "黑白棋",
    subtitle: "标准规格",
    rules: "双方轮流放置棋子，只要能夹住对方棋子即可翻转为己方颜色，终局时棋盘上己方棋子数量较多者获胜。",
  },
  mahjong: {
    name: "中国麻将",
    subtitle: "AI单人（三家电脑）",
    rules: "与三位电脑对手同桌，轮流摸牌、打牌，可吃、碰、杠其他玩家弃牌，率先凑成合法胡牌牌型者胡牌获胜。",
  },
  luzhanqi: {
    name: "陆军棋",
    subtitle: "AI单人／双人",
    rules: "双方棋子军阶保密，对方只能看到背面。交战时依军阶大小决定胜负，率先夺取对方军旗或使对方无棋可走者获胜。",
  },
  checkers: {
    name: "跳棋",
    subtitle: "标准规格",
    rules:
      "双方轮流斜线移动棋子，可跳过并吃掉对方棋子；棋子走到底线可升级为王，升级后可前后斜走；吃光对方棋子或使对方无棋可走者获胜。",
  },
  tictactoe: {
    name: "井字棋",
    subtitle: "3×3放大格式",
    rules: "双方轮流在 3×3 棋盘上放置符号，率先在横、竖或斜方向连成三子者获胜；九格全部填满仍无人连线则为平手。",
  },
  sevens: {
    name: "排七",
    subtitle: "四人接龙，盖牌分数最低获胜",
    rules: "以5为基准牌开局，轮流出相邻数字的牌，无牌可出则盖牌扣分，结束时盖牌分数最低者获胜。",
  },
  "sichuan-mahjong": {
    name: "四川麻将（血战到底）",
    subtitle: "缺一门血战，一家胡牌照样续打",
    rules: "只用筒条万三门，开局须缺一门，一家胡牌后离场，其余继续打到三家胡牌或牌摸完。",
  },
  "malaysia-mahjong": {
    name: "马来西亚三联麻将",
    subtitle: "三人对战，飞牌万能大牌多",
    rules: "三人对战，牌库只留筒子、字牌、花牌与飞牌（万能牌），凑出大牌几率更高。",
  },
  "mahjong-pengpeng": {
    name: "碰碰胡",
    subtitle: "简化版麻将，只碰不吃",
    rules: "简化牌库，只能碰或摸不能吃，凑成2组刻子加1对将即可胡牌。",
  },
  "mahjong-sevens": {
    name: "麻将接龙",
    subtitle: "仿排七，筒索万三门接龙",
    rules: "以五筒五索五万为基准，轮流出相邻数字接龙，无牌可出则盖牌扣分。",
  },
  "riichi-mahjong": {
    name: "日本立直麻将",
    subtitle: "东风战，立直/宝牌/振听",
    rules: "门清听牌可宣告立直押注，翻出宝牌可加番，振听时不能用弃过的牌胡他家，须凑出有役牌型才能胡牌。",
  },
  "mahjong-solitaire": {
    name: "麻将连连看",
    subtitle: "找出相同图案，两折点消除",
    rules: "找出两张相同图案且连线转折不超过两次的牌即可消除，限时内清空牌面获胜。",
  },
  "merge-2048": {
    name: "2048合并",
    subtitle: "滑动合并数字，挑战2048",
    rules: "上下左右滑动，相同数字相撞合并翻倍，合成2048即挑战成功。",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "合并建筑，从草地盖到摩天大楼",
    rules: "玩法同2048，数字换成建筑图像，从草地一路合并盖到摩天大楼。",
  },
  "merge-2048-undo": {
    name: "2048 Undo",
    subtitle: "滑动合并，还能倒退悔棋",
    rules: "玩法同2048，额外提供悔棋功能，滑错方向可退回重来。",
  },
  "triple-town": {
    name: "三重镇合并",
    subtitle: "合并建筑，小心熊群捣乱",
    rules: "6x6棋盘三个同款物件合并升级，熊会移动阻碍布局，围死熊可变墓碑再合并。",
  },
  suika: {
    name: "合成大西瓜",
    subtitle: "左右移动落下水果，相同合并变大",
    rules: "左右移动寻找落点放下水果，相同水果碰撞合并成更大的水果，目标合成西瓜。",
  },
  "drop-2048": {
    name: "2048下落版",
    subtitle: "数字方块落下叠加，合并翻倍",
    rules: "数字方块从上方落下，可左右移动选位，叠到相同数字会合并翻倍。",
  },
  puyo: {
    name: "噗哟噗哟",
    subtitle: "成对软泥落下，同色四个以上消除",
    rules: "成对彩色软泥落下，可移动旋转，同色连成4个以上即消除并可连锁。",
  },
  "dr-mario": {
    name: "玛利欧医生",
    subtitle: "胶囊落下堆叠，连成一线消除病毒",
    rules: "双色胶囊落下堆叠，同色连成一线消除病毒，清空病毒即过关。",
  },
  "columns-tetris": {
    name: "宝石方块／俄罗斯方块",
    subtitle: "切换两种古典掉落消除玩法",
    rules: "可切换宝石方块（同色连线消除）与俄罗斯方块（填满整行消除）两种玩法。",
  },
  "candy-crush": {
    name: "糖果传奇",
    subtitle: "交换糖果三连消，冲目标分数过关",
    rules: "交换相邻糖果凑三连消，特殊糖效果强大，限定步数内达成目标分数过关。",
  },
  bejeweled: {
    name: "宝石迷阵",
    subtitle: "三消游戏鼻祖，交换宝石连线消除",
    rules: "交换相邻宝石凑同色连线消除，持续累积分数挑战最高纪录。",
  },
  gardenscapes: {
    name: "梦幻花园",
    subtitle: "三消赚金币，整修荒废花园",
    rules: "三消赚取金币，用金币完成花园整修任务。",
  },
  homescapes: {
    name: "梦幻家园",
    subtitle: "三消赚金币，装潢梦想豪宅",
    rules: "三消赚取金币，用金币完成豪宅装潢任务。",
  },
  "royal-match": {
    name: "皇家消除",
    subtitle: "三消赚金币，修复古老城堡",
    rules: "三消赚取金币，用金币完成城堡修复任务。",
  },
  "tower-of-saviors": {
    name: "救世之塔",
    subtitle: "宝石消除 + 卡牌战斗养成",
    rules: "消除宝石触发对应属性队友攻击敌人，击败敌人后队伍升级前往下一关。",
  },
  "puzzle-dragons": {
    name: "智龙迷城",
    subtitle: "宝石消除 + 属性相克战斗",
    rules: "消除宝石发动攻击，利用属性相克造成更高伤害击败敌人。",
  },
  "empires-puzzles": {
    name: "帝国与拼图",
    subtitle: "宝石消除 + 简易城建与PvP",
    rules: "消除宝石发动英雄攻击，击败对手获得建材，逐步壮大帝国。",
  },
  "sheep-sheep": {
    name: "羊了个羊",
    subtitle: "堆叠点击收集，凑满三个同款消除",
    rules: "点击未被遮挡的图案收进收集槽，凑满三个相同图案即消除，槽满未凑齐则失败。",
  },
  match3d: {
    name: "3D消除",
    subtitle: "立体杂物堆点击收集三消",
    rules: "玩法同羊了个羊，换成立体杂物堆寻找并收集三消。",
  },
  "balls-merge": {
    name: "球类合成",
    subtitle: "左右移动寻找落点，相同球合成更大的球",
    rules: "玩法同合成大西瓜，主题换成球类，相同球合并成更大的球。",
  },
  "cookies-merge": {
    name: "饼干合成",
    subtitle: "左右移动寻找落点，相同饼干合成更大的饼干",
    rules: "玩法同合成大西瓜，主题换成饼干，相同饼干合并成更大的饼干。",
  },
  "planets-merge": {
    name: "星球合成",
    subtitle: "左右移动寻找落点，相同星球合成更大的星球",
    rules: "玩法同合成大西瓜，主题换成星球，相同星球合并成更大的星球。",
  },
  "mahjong-ninepoint5": {
    name: "麻将九点半",
    subtitle: "仿真麻将棋子，比点数近9.5",
    rules: "用麻将牌代替扑克牌玩九点半，补牌或停牌，点数最接近9.5但不超过者获胜。",
  },
  "mahjong-niuniu": {
    name: "麻将妞妞",
    subtitle: "仿真麻将棋子，凑10比牛点",
    rules: "用麻将牌代替扑克牌玩妞妞，5张牌中3张凑10的倍数，剩2张比点数大小。",
  },
  "dragon-gate": {
    name: "射龙门",
    subtitle: "麻将筒子开门猜大小",
    rules: "用筒子牌开出两张当球门，下注后开第三张，落在门内即赢，门外输，撞柱赔双倍。",
  },
}

const en: GameTable = {
  xiangqi: {
    name: "Chinese Chess",
    subtitle: "AI Solo / 2 Players",
    rules:
      "Take turns moving pieces; be the first to trap the opponent's general with no escape. Follows classic Xiangqi rules: the chariot moves straight, the horse in an L-shape, the elephant diagonally within its own side, the guard diagonally near the palace, and soldiers may move sideways after crossing the river.",
  },
  "darkchess-classic": {
    name: "Dark Chess (Classic)",
    subtitle: "AI Solo / 2 Players",
    rules:
      "All pieces start face-down. Flip a piece to reveal it, then capture using the traditional rank order. Capture all opposing pieces or leave the opponent with no legal move to win.",
  },
  "darkchess-variant": {
    name: "Dark Chess (Variant)",
    subtitle: "AI Solo / 2 Players",
    rules:
      "Same as Classic Dark Chess, but the cannon's attack and jump-capture follow variant rules, adding extra tactics for players who enjoy a fresh twist.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules:
      "Take turns placing black and white stones on the intersections of a 19×19 board. Whoever encloses more territory wins; stones fully surrounded with no liberties are captured.",
  },
  gomoku: {
    name: "Gomoku",
    subtitle: "17×17",
    rules: "Take turns placing stones. Be the first to connect five in a row — horizontally, vertically, or diagonally — to win.",
  },
  othello: {
    name: "Othello",
    subtitle: "Standard",
    rules:
      "Take turns placing discs; any opposing discs sandwiched between yours are flipped to your color. Whoever has more discs on the board at the end wins.",
  },
  mahjong: {
    name: "Chinese Mahjong",
    subtitle: "AI Solo (3 Computer Players)",
    rules:
      "Play at a table with three computer opponents. Draw and discard tiles, claim other players' discards with Chow/Pong/Kong, and be the first to complete a valid winning hand to win.",
  },
  luzhanqi: {
    name: "Luzhanqi (Army Chess)",
    subtitle: "AI Solo / 2 Players",
    rules:
      "Each side's piece ranks are hidden from the opponent, who only sees the back. Battles are settled by rank; be the first to capture the opponent's flag or leave them with no legal move to win.",
  },
  checkers: {
    name: "Checkers",
    subtitle: "Standard",
    rules:
      "Take turns moving pieces diagonally, jumping over to capture opposing pieces. Capture all opposing pieces or leave the opponent with no legal move to win.",
  },
  tictactoe: {
    name: "Tic-Tac-Toe",
    subtitle: "Large 3×3 Format",
    rules: "Take turns placing your symbol. Be the first to connect three in a row — horizontally, vertically, or diagonally — to win.",
  },
  chess: {
    name: "Chess",
    subtitle: "AI Solo / 2 Players",
    rules:
      "Take turns moving pieces; be the first to checkmate the opponent's king to win. Follows standard chess rules for how the pawn, rook, knight, bishop, queen, and king move.",
  },
  connect4: {
    name: "Connect Four",
    subtitle: "AI Solo / 2 Players",
    rules: "Take turns dropping pieces into the upright grid. Be the first to connect four in a row — horizontally, vertically, or diagonally — to win.",
  },
  "chinese-checkers": {
    name: "Chinese Checkers",
    subtitle: "Star Board",
    rules:
      "On a six-pointed star board, be the first to move all of your pieces into the opposite corner. Pieces may step or chain-jump over other pieces to advance.",
  },
  jigsaw: {
    name: "Sliding Puzzle",
    subtitle: "Numbered Tiles",
    rules: "Tap a tile next to the empty space to slide it in. Arrange the tiles from 1 to 15 in order to complete the challenge.",
  },
  "number-merge": {
    name: "Number Merge",
    subtitle: "2048 Style",
    rules: "Swipe or use the arrow keys. Matching tiles merge and double in value when they collide; reach 2048 to win.",
  },
  "memory-match": {
    name: "Memory Match",
    subtitle: "Pairing Challenge",
    rules: "Flip two cards at a time; matching pairs stay face-up. Match every pair using as few flips as possible to win.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Players",
    rules:
      "Roll the dice to move your pieces around the board and home. Landing on an opponent's piece sends it back to start.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Classic Single Player",
    rules: "Sort every card into the four foundation piles by suit and ascending rank to clear the board and win.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Tile Rummy vs AI",
    rules: "Use your numbered tiles to form runs or same-number sets and lay them on the table. Be the first to play all your tiles to win.",
  },
  "rps-battle": {
    name: "Rock Paper Scissors",
    subtitle: "vs AI",
    rules: "Throw rock, paper, or scissors against the computer at the same time. Whoever leads in rounds won takes the match.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "Heads-up vs AI (Simplified)",
    rules:
      "You and the AI each hold 2 cards, plus 5 shared community cards. Choose to Call and reveal hands, or Fold to give up the hand — the higher-ranked hand wins the pot.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "21 vs the Dealer",
    rules:
      "Get as close to 21 as possible without going over. Aces count as 1 or 11, face cards count as 10. Hit or Stand — the dealer must keep drawing until reaching 17 or more.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player / Banker / Tie",
    rules:
      "Bet on Player, Banker, or Tie before the cards are dealt. Hand totals use the last digit of the sum; the higher total wins. Extra cards are drawn automatically per standard baccarat rules.",
  },
  war: {
    name: "War",
    subtitle: "High Card vs AI",
    rules:
      "The deck is split evenly. Each round both sides flip a card — the higher card wins the round. Ties trigger a burn-and-battle; whoever holds more cards at the end wins.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "vs the Dealer",
    rules:
      "You and the dealer are each dealt 3 cards. After viewing your hand, Call to reveal and compare, or Fold to give up the round — the higher-ranked hand wins.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Sliding Block Puzzle",
    rules: "Slide the differently sized blocks within the limited board space. Move the largest block to the exit at the bottom to win.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Stack & Clear Lines",
    rules:
      "Swipe left or right to move the falling piece, tap to rotate, swipe down to drop fast. Fill an entire row to clear it and score; the game ends if the stack reaches the top.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Match Colors to Clear",
    rules: "Tap a lane to fire the current bubble. Three or more matching bubbles connected together are cleared for points; the game ends if the bubbles reach the top.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Swap to Match",
    rules:
      "Tap a tile, then tap a neighboring tile to swap them. Matching 3 or more of the same color clears them and refills from above, which can chain into more matches.",
  },
  hanoi: {
    name: "Tower of Hanoi",
    subtitle: "Move the Discs",
    rules:
      "Tap a peg to pick up its top disc, then tap another peg to move it there. A larger disc can never sit on a smaller one — move the whole stack to the rightmost peg to win.",
  },
  "water-sort": {
    name: "Water Sort Puzzle",
    subtitle: "Pour to Sort Colors",
    rules:
      "Tap a tube to pick up its top color, then tap another tube to pour it in — only into an empty tube or one topped with the same color. Sort every tube into a single color to win.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Rotate to Link Up",
    rules: "Tap a pipe tile to rotate it 90°. Connect the water source in the top-left all the way to the exit in the bottom-right to win.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Time Your Drop",
    rules:
      "The block above swings left and right; tap to drop it onto the stack below. The less it overlaps, the narrower it gets — miss the stack entirely and the game ends.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Swap to Order",
    rules: "Tap two number tiles to swap their positions. Arrange every number from smallest to largest using as few swaps as possible to win.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "6×6 Grid",
    rules:
      "Every row, column, and 2×3 box must contain the numbers 1 through 6 with no repeats. Fill the entire grid with no conflicts to win.",
  },
  "shooting-range": {
    name: "Shooting Range",
    subtitle: "Fast Reflex Targets",
    rules: "Targets light up randomly across the grid — tap them as fast as you can to score. Reach the target score before time runs out to win.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Clear the Fleet to Win",
    rules:
      "Move left and right to dodge enemy fire and shoot down the entire alien fleet. The challenge fails if the fleet closes in or your lives run out.",
  },
  "tank-battle": {
    name: "Tank Battle",
    subtitle: "First to 3 Hits Wins",
    rules: "Move your tank left and right and fire shells. Hitting the opponent's lane scores a point — be the first to land 3 hits to win.",
  },
  "brick-breaker": {
    name: "Brick Breaker",
    subtitle: "Clear Every Brick to Win",
    rules:
      "Drag the paddle left and right to bounce the ball and break all the bricks to win. Letting the ball fall off the bottom costs a life; the challenge fails if your lives run out.",
  },
  "zombie-defense": {
    name: "Zombie Defense",
    subtitle: "Survive Every Wave to Win",
    rules:
      "Zombies advance along the lane from the right; tap them to destroy them (some take two hits). Letting one reach the left edge costs health — survive every wave to win.",
  },
  "air-combat": {
    name: "Air Combat",
    subtitle: "Survive & Reach the Target Score",
    rules:
      "Your fighter fires automatically; move left and right to dodge enemy planes and clear them. Survive the time limit while reaching the target score to win; running out of lives fails the challenge.",
  },
  billiards: {
    name: "Billiards",
    subtitle: "Drag to Aim, Clear All Balls",
    rules:
      "Drag backward from the cue ball to aim, then release to strike. Pocket every colored ball before you run out of shots to win.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Reach the Pin Target in 3 Frames",
    rules: "Drag the slider to set your throw angle, then release to bowl. Reach the target total pins knocked down within 3 frames to win.",
  },
  "basketball-shoot": {
    name: "Basketball Shootout",
    subtitle: "Time Your Shot",
    rules: "The power meter swings back and forth automatically — tap to shoot when it's near the center to score. Make enough baskets to win.",
  },
  "penalty-kick": {
    name: "Penalty Kick",
    subtitle: "Pick a Side vs the Keeper",
    rules: "Choose left, center, or right to shoot against a keeper who dives randomly. Score enough goals within 5 rounds to win.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Switch Lanes to Dodge Traffic",
    rules: "Switch lanes left and right to dodge oncoming traffic. The challenge fails if you run out of lives before reaching the finish distance.",
  },
  parking: {
    name: "Parking Challenge",
    subtitle: "Park Within Your Moves",
    rules: "Use the steering and forward controls to park exactly in the marked spot before you run out of moves or collisions to win.",
  },
  motocross: {
    name: "Motocross Jump",
    subtitle: "Jump the Pits to the Finish",
    rules: "Tap to jump your bike and clear the pits ahead with good timing. The challenge fails if your lives run out before reaching the finish.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Steer with the Track to Score",
    rules: "Steer with the track's curves to stay on course while racking up drift points. Reach the finish with enough points to win.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Turn-Based, First KO Wins",
    rules:
      "Choose Attack to build your special meter, Guard to halve the next hit, or unleash your Finisher once your meter is full. Be the first to reduce your opponent's health to zero to win.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Partner up against two computer opponents",
    rules:
      "You and your North partner play against West and East, both computer-controlled. Each trick all four players play in turn and must follow suit if possible; otherwise any suit or trump may be played. The highest card of the suit led, or the highest trump, wins the trick. After all 13 tricks, winning 7 or more tricks as a partnership wins the hand.",
  },
  "pick-red-points": {
    name: "Pick Red Points",
    subtitle: "Match a played card to one on the table",
    rules:
      "Take turns playing one card: if its rank matches a card on the table, sweep every card of that rank plus your played card for points. If not, it stays on the table. After the deck is used up, compare each side's collected red hearts/diamonds — regular red cards are worth 1 point, red 10s, Jacks, Queens, and Kings are worth 10 each. Higher total wins.",
  },
  "dou-dizhu": {
    name: "Fight the Landlord",
    subtitle: "Landlord against two farmers",
    rules:
      "After the deal, the system assigns one Landlord (you or a computer) based on hand strength — the Landlord takes 3 extra hidden cards, and the other two become Farmers teaming up against them. Take turns playing combinations stronger than the last, or pass if you can't. The Landlord winning by playing out first wins for the Landlord; either Farmer finishing first wins for the Farmers.",
  },
  "liars-cards": {
    name: "Liar's Cards",
    subtitle: "Play face-down, call out the rank, guess the bluff",
    rules:
      "You and two computer opponents take turns: play 1–4 cards face-down and announce a rank (ranks must cycle A→2→3→...→K→A, and you can either call it honestly or bluff). Other players may either Believe and pass the turn along, or Call the bluff and flip the cards to check — a correct call makes the player who played them take back the whole table pile, a wrong call means the caller takes it instead. The first to empty their hand without being caught bluffing wins.",
  },
  sevens: {
    name: "Sevens",
    subtitle: "4-player rummy — lowest leftover score wins",
    rules:
      "Starting from the 7s, take turns playing cards adjacent in rank right next to them. If you can't play, pass face-down for a penalty. When someone finishes, lowest total penalty wins.",
  },
  "sichuan-mahjong": {
    name: "Sichuan Mahjong (Bloodbath)",
    subtitle: "Missing-one-suit battle, play continues after a win",
    rules:
      "Uses only dots, bamboos, and characters, and you must be missing one suit at the start. A player who wins leaves the table while the rest continue until three have won or the wall runs out.",
  },
  "malaysia-mahjong": {
    name: "Malaysian 3-Player Mahjong",
    subtitle: "3 players, wild tiles make big hands common",
    rules:
      "Played by 3 players with a reduced tile set of dots, honor tiles, flower tiles, and wild tiles. The smaller deck and extra wilds make big winning hands far more common.",
  },
  "mahjong-pengpeng": {
    name: "Pong Pong Mahjong",
    subtitle: "Simplified mahjong, pong only — no chow",
    rules: "A simplified tile set with no chow allowed, only pong or self-draw. Form two triplets plus one pair to win.",
  },
  "mahjong-sevens": {
    name: "Mahjong Sevens",
    subtitle: "Like Sevens, with dot/bamboo/character suits",
    rules:
      "Starting from the 5s of each suit, take turns playing adjacent numbers next to them. If you can't play, pass face-down for a penalty.",
  },
  "riichi-mahjong": {
    name: "Japanese Riichi Mahjong",
    subtitle: "East round — riichi, dora, and furiten",
    rules:
      "Declare riichi when your closed hand is ready to bet on your wait. Revealed dora tiles add bonus han. Furiten blocks winning off a discard you've already passed on. A hand needs at least one yaku to win.",
  },
  "mahjong-solitaire": {
    name: "Mahjong Solitaire",
    subtitle: "Match identical tiles with a path of 2 turns or fewer",
    rules:
      "Find two matching tiles whose connecting path bends no more than twice to clear them. Clear the whole board before time runs out to win.",
  },
  "merge-2048": {
    name: "2048 Merge",
    subtitle: "Swipe to merge numbers, aim for 2048",
    rules: "Swipe in any direction — matching tiles merge and double in value on collision. Reach 2048 to win.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Merge buildings from grass to skyscraper",
    rules: "Same rules as 2048, but the tiles are building icons — merge your way from grass all the way up to a skyscraper.",
  },
  "merge-2048-undo": {
    name: "2048 Undo",
    subtitle: "Same as 2048, with an undo button",
    rules: "Same rules as 2048, but you can undo a swipe if you misjudge a move.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Merge buildings — watch out for wandering bears",
    rules:
      "On a 6×6 board, three matching items merge into the next tier. Bears wander and block your spaces — trap one completely to turn it into a tombstone, which can also be merged.",
  },
  suika: {
    name: "Suika Fruit Merge",
    subtitle: "Move left/right and drop fruit — matching fruit merge bigger",
    rules:
      "Move left and right to choose where the falling fruit drops. Matching fruit merge into the next size up — work your way toward the giant watermelon.",
  },
  "drop-2048": {
    name: "2048 Drop",
    subtitle: "Falling number blocks stack and merge",
    rules: "Number blocks fall from above; move left and right to choose a column. Matching numbers merge and double when they stack.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Falling pairs — clear 4+ matching colors",
    rules:
      "Colored blob pairs fall from above; move and rotate them. Connect 4 or more of the same color to clear them, which can trigger chain reactions.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Stack falling capsules to clear viruses in a line",
    rules: "Two-colored capsules fall and stack; line up 4 of the same color including viruses to clear them. Clear every virus to win.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Switch between two classic falling-block games",
    rules: "Toggle between Columns (match 3+ gems in a line) and Tetris (clear full rows) from the same screen.",
  },
  "candy-crush": {
    name: "Candy Crush",
    subtitle: "Swap candy for 3-in-a-rows, hit the target score",
    rules:
      "Swap adjacent candies to form matches of 3 or more. Special candies from bigger matches clear whole rows or colors — reach the target score within the move limit to win.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "The original match-3 — swap gems to clear lines",
    rules: "Swap adjacent gems to form a line of 3 or more matching gems. Chain combos for bonus points as you chase a new high score.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Match-3 for coins to restore a neglected garden",
    rules: "Clear matches to earn coins, then spend them to complete garden restoration tasks.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Match-3 for coins to decorate a dream mansion",
    rules: "Clear matches to earn coins, then spend them to complete mansion decoration tasks.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Match-3 for coins to restore an old castle",
    rules: "Clear matches to earn coins, then spend them to complete castle restoration tasks.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Match gems + card-battle team building",
    rules: "Matching gems triggers an attack from teammates of the matching element. Defeat enemies to level up your team and advance.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Match gems + elemental-advantage battles",
    rules: "Matching gems triggers an attack; use elemental advantages to deal bonus damage and defeat enemies.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Match gems + light city-building and PvP",
    rules: "Matching gems triggers hero attacks; defeating opponents earns building materials to grow your empire.",
  },
  "sheep-sheep": {
    name: "Sheep a Sheep",
    subtitle: "Collect tiles from a stack, clear sets of 3",
    rules:
      "Tap any unblocked tile to send it to your collection slot. Three matching tiles clear automatically — fill the slot without completing a set and you lose.",
  },
  match3d: {
    name: "Match 3D",
    subtitle: "Collect from a 3D pile for match-3 clears",
    rules: "Same idea as Sheep a Sheep, but the tiles are a 3D pile of objects — find and collect matching sets of 3.",
  },
  "balls-merge": {
    name: "Ball Merge",
    subtitle: "Move and drop — matching balls merge bigger",
    rules: "Same mechanic as Suika Fruit Merge, themed with balls — matching balls merge into the next size up.",
  },
  "cookies-merge": {
    name: "Cookie Merge",
    subtitle: "Move and drop — matching cookies merge bigger",
    rules: "Same mechanic as Suika Fruit Merge, themed with cookies — matching cookies merge into the next size up.",
  },
  "planets-merge": {
    name: "Planet Merge",
    subtitle: "Move and drop — matching planets merge bigger",
    rules: "Same mechanic as Suika Fruit Merge, themed with planets — matching planets merge into the next size up.",
  },
  "mahjong-ninepoint5": {
    name: "Mahjong 9.5",
    subtitle: "Mahjong tiles instead of cards, get closest to 9.5",
    rules: "Play 9.5 (blackjack-style) using mahjong tiles instead of cards. Draw or stand — get as close to 9.5 without going over to win.",
  },
  "mahjong-niuniu": {
    name: "Mahjong Niu Niu",
    subtitle: "Mahjong tiles instead of cards, make 10s for the best bull",
    rules:
      "Play Niu Niu using mahjong tiles instead of cards. From 5 tiles, find 3 that sum to a multiple of 10, then compare the remaining 2 for your bull score.",
  },
  "dragon-gate": {
    name: "Dragon Gate",
    subtitle: "Mahjong dot tiles open the gate, bet on the range",
    rules:
      "Two dot tiles open the gate; place your bet, then a third tile is drawn. Landing between the gate wins, outside loses, and matching either post doubles the loss.",
  },
  "ten-half": {
    name: "10.5",
    subtitle: "Get closer to 10.5 than the dealer",
    rules:
      "Set your bet, then each side is dealt 2 cards. Hit or stand — the closer to 10.5 without going over, the better. Aces count as 1, face cards count as 0.5. A natural 10.5 on the deal pays 3x; a normal win pays 2x; a tie returns your bet.",
  },
  "five-pk": {
    name: "5-Card Poker",
    subtitle: "Draw once, then compare hands with a double-or-nothing option",
    rules:
      "Set your bet, then deal 5 cards (2 jokers are in the deck). Keep the cards you want and draw once to replace the rest. Hands pay by rank — straight flush 500x, five of a kind 200x, flush straight 120x, and down to two pair at 1x. After a win you can double or nothing on big/small or red/black, or cash out anytime.",
  },
  "thirteen-water": {
    name: "Thirteen Card Poker",
    subtitle: "13 cards split into 3 hands vs the dealer",
    rules:
      "Set your bet and deal. The system auto-arranges your 13 cards and the dealer's into a 3-card front hand, 5-card middle hand, and 5-card back hand, each compared separately. Sweeping all 3 hands pays 5x, winning 2 pays 2x, winning 1 pays 1.5x, a split pushes, and losing more than you win forfeits the bet.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Play singles and pairs to empty your hand first",
    rules:
      "Set your bet and deal against the dealer. Play a single card or a same-rank pair that beats the last play, or pass. Rank order is 3 lowest up to 2 highest, with suits breaking ties. Empty your 13 cards first to win 2x your bet.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "5-card hands vs the dealer, no draws",
    rules:
      "Set your bet, then you and the dealer are each dealt 5 cards and compare hand rank directly — straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair, high card. The higher hand wins 2x; a tie returns your bet.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Make 10s from 5 cards for the best bull score",
    rules:
      "Set your bet, then you and the dealer are each dealt 5 cards. Pick 3 that sum to a multiple of 10 (a 'bull'); the remaining 2 cards' last digit is your score, higher is better. An exact 10 is the top 'Bull Bull' hand; no valid combination is 'No Bull', the lowest. The higher score wins 2x; a tie returns your bet. Face cards count as 10, aces as 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "3-card hands vs the dealer",
    rules:
      "Set your bet, then you and the dealer are each dealt 3 cards and compare hand rank directly — three of a kind, straight flush, flush, straight, pair, high card. The higher hand wins 2x; a tie returns your bet.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 rounds of dealing — fold or double at each stage",
    rules:
      "Set your starting bet. Cards are dealt in 4 stages (3, then 2, then 1, then the final 2 revealed), and after each stage you can fold or double your bet. The best 5-card hand from your 7 cards decides the result. Folding forfeits your current total bet; winning pays by hand rank, from a royal flush at 150x down to two pair at 1x.",
  },
  "little-mary": {
    name: "Classic Little Mary",
    subtitle: "Spinning light frame — bet on big or small cards",
    rules:
      "Set your bet on each symbol, then start. The light frame spins fast for 3 laps, then slows to stop within half a lap to a lap and a half — tap Stop to call it early. Landing on an arrow loses; landing on the free-spin symbol gives a free respin; fixed symbols pay a set multiple; big-card or small-card symbols pay by the running multiplier if you bet on that symbol. After enough spins, a bonus round may trigger with a higher fixed payout and a signature chime.",
  },
  "little-mary-2": {
    name: "Classic Little Mary II",
    subtitle: "Sports-theme spinning light frame",
    rules:
      "Same spinning mechanics as Classic Little Mary, retitled with a sports theme (soccer, rugby, basketball, bowling, tennis, table tennis, golf). Bet on each symbol, then start — landing on an arrow loses, the free symbol gives a free respin, fixed symbols pay a set multiple, and big or small sports symbols pay by the running multiplier if bet on. A bonus round may trigger after enough spins with a fixed high payout.",
  },
  "little-mary-3": {
    name: "Classic Little Mary III",
    subtitle: "Flower-god jackpot — bet on big or small",
    rules:
      "Same spinning mechanics as Classic Little Mary. Three flower-god lights normally blink independently; after enough spins they may sync into a flashing alert state. If the reel stops on the big or small symbol group during that alert, all three symbols pay together at 3x the running multiplier — a rare jackpot bonus.",
  },
  "little-mary-4": {
    name: "Classic Little Mary IV",
    subtitle: "Animal-theme flower-god jackpot",
    rules:
      "Same mechanics as the Flower-God Jackpot edition, retitled with an animal theme (tiger, dragon, monkey, fox, mouse, rooster, chick). The flower-god jackpot alert and 3x payout work identically.",
  },
  "little-mary-5": {
    name: "Classic Little Mary III (Phoenix)",
    subtitle: "Phoenix decoration edition — bet on big or small",
    rules:
      "Same spinning mechanics as Classic Little Mary. A large phoenix in the center is purely decorative, flickering faster during the bonus alert. Stopping on either free-spin symbol sweeps a decorative light trail across the frame — visual only, it doesn't change the payout.",
  },
  "little-mary-6": {
    name: "Classic Little Mary IV (Phoenix)",
    subtitle: "Phoenix decoration edition — drinks theme",
    rules:
      "Same mechanics as the Phoenix Decoration edition, retitled with a drinks theme (teapot, honey, mate tea, shaved ice, beer, wine, cocktail). The decorative phoenix and light-trail effects work identically.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Ocean)",
    subtitle: "8×8 mini frame — bet on big or small",
    rules:
      "A smaller 8×8 light frame (28 positions) with the same spin mechanics, themed with ocean animals (shark, whale, dolphin, tropical fish, crab, shell, bubbles). Landing on an arrow loses, the free symbol gives a free respin, fixed symbols pay a set multiple, and big or small symbols pay by the running multiplier if bet on. A jackpot bonus round may trigger after enough spins.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Dessert)",
    subtitle: "8×8 mini frame — dessert theme",
    rules:
      "Same 8×8 mini-frame mechanics as the Ocean edition, retitled with a dessert theme (cake, strawberry cake, cupcake, donut, cookie, candy, lollipop). A jackpot bonus round may trigger after enough spins with a signature chime.",
  },
  "fruit-slot-1": {
    name: "Fruit Reels I",
    subtitle: "Classic 3×3 reels, 5 paylines",
    rules:
      "A classic 3-reel, 3-row fruit machine with 5 paylines (top, middle, bottom rows plus both diagonals). Set your bet per line, then spin — each reel stops independently left to right, and you can tap Stop to call it early. Three matching symbols on any payline pay by the table, from lucky 7 at 100x down to cherry at 4x; two or more cherries anywhere on screen pay a small consolation; three 7s on the middle row is the jackpot with its own light show and chime.",
  },
  "fruit-slot-2": {
    name: "Fruit Reels II",
    subtitle: "Tropical fruit theme, 5 paylines",
    rules:
      "Same 3-reel, 5-payline mechanics as Fruit Reels I, retitled with a tropical theme — a diamond replaces lucky 7 as the jackpot symbol, paired with strawberry, pineapple, banana, peach, and cherry. Three matching symbols on any payline pay by the table, from diamond at 100x down to cherry at 4x; three diamonds on the middle row is the jackpot.",
  },
  "little-mary-bonus": {
    name: "Classic Little Mary V (Lucky 7 Bonus)",
    subtitle: "Lucky sevens bonus multiplier round",
    rules:
      "Same spinning mechanics as Classic Little Mary, with bets placed across 8 symbols at once. A trio of digit reels in the center normally spins as pure decoration; on a win there's a chance it triggers a bonus round where the three reels stop one by one. Landing on three matching odd digits multiplies your win by 10x, three matching even digits by 5x — a rare random bonus that doesn't trigger every time.",
  },
  "little-mary-bonus-2": {
    name: "Classic Little Mary IV (Lucky 7 Bonus, Festive)",
    subtitle: "Festive theme lucky sevens bonus",
    rules:
      "Same mechanics as the Lucky Sevens Bonus edition, retitled with a festive theme (red envelope, gold ingot, lantern, mandarin orange, mooncake, fireworks, cherry). The bonus round and 10x/5x digit-match multipliers work identically, with festive colors and sound effects.",
  },
  "xiangqi-mahjong": {
    name: "Xiangqi Mahjong",
    subtitle: "Form sets from chess pieces, race the computer to win",
    rules:
      "Set your bet, then you and the computer each draw 5 Chinese chess pieces. On your turn, draw a piece — if it completes a pair plus a set (a run or a triplet), you win by self-draw. Otherwise discard one of your 6 pieces. If the computer's discard completes your hand, you can claim it to win, or pass and keep drawing. Payouts: 2x for a mixed pair-and-run, 3x for a same-suit pair-and-run, 5x for five soldiers or pawns; claiming a discard pays the listed rate, self-draw adds a bonus. If the deck runs out with no winner, bets are returned.",
  },
  tuitongzai: {
    name: "Push Cylinder",
    subtitle: "Mahjong-tile pai gow across three positions at once",
    rules:
      "Uses mahjong dot tiles 1–9 (4 of each) plus blank tiles (4, worth half a point) to represent a 40-tile deck. Set bets on the head, heaven, and tail positions, then the dealer and each position flip 2 tiles to compare. Rank order: double blank (highest) beats any pair, which beats a 2-8 combo, which beats a normal point total (digits sum, last digit counts, blank = 0.5, 9.5 is the best normal total, 0 is the lowest). Each position compares against the dealer independently — a win pays 1x, with pairs paying 4x and double blank paying 10x; matching totals favor the dealer by house rule.",
  },
}

const ja: GameTable = {
  xiangqi: {
    name: "中国将棋（シャンチー）",
    subtitle: "AIソロ／2人対戦",
    rules:
      "交互に駒を動かし、相手の将（帥）を先に詰ませた方が勝利。伝統的なシャンチーの規則に従う：車は直進、馬はL字型、象は自陣内で斜め、士は宮殿付近を斜めに移動、兵は川を渡ると横移動が可能。",
  },
  "darkchess-classic": {
    name: "暗棋（クラシック）",
    subtitle: "AIソロ／2人対戦",
    rules: "すべての駒は裏向きで配置され、めくって表向きにした後は伝統的な階級順で相手の駒を取る。相手の駒を全て取るか、動けなくした方が勝利。",
  },
  "darkchess-variant": {
    name: "暗棋（バリアント）",
    subtitle: "AIソロ／2人対戦",
    rules: "クラシック暗棋と同じルールだが、砲の攻撃とジャンプ捕獲に特別ルールを採用し、新しい戦術を楽しめる。",
  },
  go: {
    name: "囲碁",
    subtitle: "19×19",
    rules: "交互に19×19の交点に黒白の石を置き、より多くの領地を囲んだ方が勝利。完全に囲まれ「気」を失った石は取られる。",
  },
  gomoku: { name: "五子棋（連珠）", subtitle: "17×17", rules: "交互に石を置き、縦・横・斜めのいずれかで先に五つ並べた方が勝利。" },
  othello: {
    name: "オセロ",
    subtitle: "標準",
    rules: "交互に石を置き、相手の石を挟むと自分の色にひっくり返せる。終局時に石が多い方が勝利。",
  },
  mahjong: {
    name: "中国麻雀",
    subtitle: "AIソロ（コンピュータ3人）",
    rules: "コンピュータ3人と卓を囲み、ツモと打牌を繰り返し、他家の捨て牌をチー・ポン・カンで取れる。先に和了した方が勝利。",
  },
  luzhanqi: {
    name: "陸軍棋",
    subtitle: "AIソロ／2人対戦",
    rules: "双方の駒の階級は非公開で、相手には裏面しか見えない。階級の大小で勝敗が決まり、先に相手の軍旗を奪うか動けなくした方が勝利。",
  },
  checkers: {
    name: "チェッカー",
    subtitle: "標準",
    rules: "交互に駒を斜めに動かし、相手の駒を飛び越えて取る。相手の駒を全て取るか動けなくした方が勝利。",
  },
  tictactoe: {
    name: "三目並べ",
    subtitle: "拡大版3×3",
    rules: "交互に印を置き、縦・横・斜めのいずれかで先に三つ並べた方が勝利。",
  },
  sevens: {
    name: "セブンズ（排七）",
    subtitle: "4人対戦、残り点が最少の人が勝利",
    rules: "7から始めて隣接する数字のカードを順に出していく。出せない時は伏せて失点。誰かが上がった時点で合計失点が最少の人が勝利。",
  },
  "sichuan-mahjong": {
    name: "四川麻雀（血戦到底）",
    subtitle: "一門欠け必須、和了後も対局継続",
    rules: "筒子・索子・萬子のみ使用し、開局時に一門欠けが必須。誰かが和了しても退席するだけで、三人が和了するか牌が尽きるまで続く。",
  },
  "malaysia-mahjong": {
    name: "マレーシア三人麻雀",
    subtitle: "3人対戦、ワイルド牌で大役が出やすい",
    rules: "3人で対戦し、牌は筒子・字牌・花牌・ワイルド牌のみの縮小デッキ。牌が少なくワイルドが多いため大きな役が出やすい。",
  },
  "mahjong-pengpeng": {
    name: "ポンポン麻雀",
    subtitle: "簡易麻雀、ポンのみでチーなし",
    rules: "簡易化された牌でチーは禁止、ポンかツモのみ可能。刻子2組と対子1組を揃えれば和了。",
  },
  "mahjong-sevens": {
    name: "麻雀セブンズ",
    subtitle: "セブンズと同じ、筒索萬の三門で",
    rules: "各門の5から始めて隣接する数字を順に出していく。出せない時は伏せて失点。",
  },
  "riichi-mahjong": {
    name: "日本立直麻雀",
    subtitle: "東風戦、立直・ドラ・振聴",
    rules: "門前で聴牌したら立直を宣言できる。表示されたドラは翻数を加算。振聴中は見逃した牌でロンできない。役が1つ以上必要。",
  },
  "mahjong-solitaire": {
    name: "麻雀ソリティア（連連看）",
    subtitle: "同じ柄を2回の折れ線以内で消去",
    rules: "折れ線が2回以内で結べる同じ柄の牌を2枚見つけて消去する。時間内に盤面をすべて消せば勝利。",
  },
  "merge-2048": {
    name: "2048マージ",
    subtitle: "スワイプで合体、2048を目指す",
    rules: "好きな方向にスワイプし、同じ数字が衝突すると合体して倍になる。2048を作れば成功。",
  },
  "city-2048": {
    name: "シティ2048",
    subtitle: "建物を合体、草地から摩天楼まで",
    rules: "2048と同じルールだが、タイルは建物アイコン。草地から摩天楼まで合体させていく。",
  },
  "merge-2048-undo": {
    name: "2048アンドゥ",
    subtitle: "2048にアンドゥ機能を追加",
    rules: "2048と同じルールだが、操作を間違えたらアンドゥで元に戻せる。",
  },
  "triple-town": {
    name: "トリプルタウン",
    subtitle: "建物を合体、徘徊するクマに注意",
    rules: "6×6の盤面で同じ物を3つ揃えると次のランクに合体。クマは移動して邪魔をするが、完全に囲むと墓石になり合体可能。",
  },
  suika: {
    name: "スイカゲーム",
    subtitle: "左右移動で落とし、同じ果物を合体",
    rules: "左右に移動して落下位置を選ぶ。同じ果物がぶつかると次の大きさに合体し、大きなスイカを目指す。",
  },
  "drop-2048": {
    name: "2048ドロップ",
    subtitle: "落下する数字ブロックが積み重なって合体",
    rules: "数字ブロックが上から落下、左右に移動して列を選ぶ。同じ数字が重なると合体して倍になる。",
  },
  puyo: {
    name: "ぷよぷよ",
    subtitle: "落下するペア、同色4個以上で消去",
    rules: "色付きぷよのペアが落下、移動・回転ができる。同色が4個以上つながると消去され、連鎖が発生する。",
  },
  "dr-mario": {
    name: "ドクターマリオ",
    subtitle: "落下カプセルを積んでウイルスを一列消去",
    rules: "2色のカプセルが落下して積み重なる。ウイルスを含め同色を4つ揃えると消去。すべてのウイルスを消せば勝利。",
  },
  "columns-tetris": {
    name: "コラムス／テトリス",
    subtitle: "2つの古典的な落下パズルを切り替え",
    rules: "コラムス（同色3個以上を一列に揃えて消去）とテトリス（一行を埋めて消去）を同じ画面で切り替えられる。",
  },
  "candy-crush": {
    name: "キャンディークラッシュ",
    subtitle: "キャンディーを交換して3つ揃え、目標点を目指す",
    rules: "隣接するキャンディーを交換して3つ以上揃える。特殊キャンディーは行や色を一気に消去。制限手数内に目標点に達すればクリア。",
  },
  bejeweled: {
    name: "ビジュエルド",
    subtitle: "マッチ3の元祖、宝石を交換して消去",
    rules: "隣接する宝石を交換して3つ以上の列を作って消去。連鎖でボーナス得点を狙い、ハイスコアに挑戦。",
  },
  gardenscapes: {
    name: "ガーデンスケイプス",
    subtitle: "マッチ3でコインを稼ぎ、荒れた庭を修復",
    rules: "マッチさせてコインを稼ぎ、そのコインで庭の修復タスクを完了させる。",
  },
  homescapes: {
    name: "ホームスケイプス",
    subtitle: "マッチ3でコインを稼ぎ、豪邸を装飾",
    rules: "マッチさせてコインを稼ぎ、そのコインで豪邸の装飾タスクを完了させる。",
  },
  "royal-match": {
    name: "ロイヤルマッチ",
    subtitle: "マッチ3でコインを稼ぎ、古い城を修復",
    rules: "マッチさせてコインを稼ぎ、そのコインで城の修復タスクを完了させる。",
  },
  "tower-of-saviors": {
    name: "神魔の塔",
    subtitle: "宝石消去＋カードバトル育成",
    rules: "宝石を消すと対応する属性の仲間が敵を攻撃する。敵を倒すとチームがレベルアップして次へ進む。",
  },
  "puzzle-dragons": {
    name: "パズル＆ドラゴンズ",
    subtitle: "宝石消去＋属性相性バトル",
    rules: "宝石を消すと攻撃が発動。属性の相性を活かして大ダメージを与え敵を倒す。",
  },
  "empires-puzzles": {
    name: "エンパイアーズ＆パズルズ",
    subtitle: "宝石消去＋簡易街づくりとPvP",
    rules: "宝石を消すとヒーローが攻撃。相手を倒すと建材が手に入り、帝国を発展させる。",
  },
  "sheep-sheep": {
    name: "ヤンレンカン（羊了个羊）",
    subtitle: "積み重なったタイルを収集、3つ揃えて消去",
    rules: "隠れていないタイルをタップして収集枠へ送る。同じ柄が3つ揃うと自動消去。枠が満杯になり揃わないと失敗。",
  },
  match3d: {
    name: "マッチ3D",
    subtitle: "立体の山から収集してマッチ3消去",
    rules: "羊了个羊と同じ仕組みだが、タイルは立体の物体の山。同じ柄を3つ見つけて収集する。",
  },
  "balls-merge": {
    name: "ボールマージ",
    subtitle: "移動して落とし、同じボールを合体",
    rules: "スイカゲームと同じ仕組みで、ボールがテーマ。同じボールが合体して大きくなる。",
  },
  "cookies-merge": {
    name: "クッキーマージ",
    subtitle: "移動して落とし、同じクッキーを合体",
    rules: "スイカゲームと同じ仕組みで、クッキーがテーマ。同じクッキーが合体して大きくなる。",
  },
  "planets-merge": {
    name: "プラネットマージ",
    subtitle: "移動して落とし、同じ惑星を合体",
    rules: "スイカゲームと同じ仕組みで、惑星がテーマ。同じ惑星が合体して大きくなる。",
  },
  "mahjong-ninepoint5": {
    name: "麻雀九点半",
    subtitle: "麻雀牌でカードの代わりに、9.5に近づける",
    rules: "トランプの代わりに麻雀牌で九点半（ブラックジャック風）を遊ぶ。追加かストップを選び、9.5を超えず近づけた方が勝利。",
  },
  "mahjong-niuniu": {
    name: "麻雀牛牛",
    subtitle: "麻雀牌でカードの代わりに、10の倍数を作る",
    rules: "トランプの代わりに麻雀牌で牛牛を遊ぶ。5枚のうち3枚で10の倍数を作り、残り2枚の点数を比べる。",
  },
  "dragon-gate": {
    name: "ドラゴンゲート（射龍門）",
    subtitle: "麻雀の筒子でゲートを作り範囲を賭ける",
    rules: "筒子2枚でゲートを作り、賭けた後3枚目をめくる。ゲートの間なら勝ち、外なら負け、柱と同じ数字なら倍額を支払う。",
  },
  blackjack: {
    name: "ブラックジャック",
    subtitle: "ディーラーと21を競う",
    rules:
      "21に近づけつつ超えないようにする。エースは1か11、絵札は10として数える。ヒットかスタンドを選択、ディーラーは17以上になるまで引き続ける。",
  },
  baccarat: {
    name: "バカラ",
    subtitle: "プレイヤー／バンカー／タイ",
    rules:
      "カードが配られる前にプレイヤー、バンカー、タイのいずれかに賭ける。手の合計は一の位の数字で比較し、大きい方が勝ち。追加カードは標準バカラ規則に従い自動的に引かれる。",
  },
  "ten-half": {
    name: "十点半",
    subtitle: "ディーラーより10.5に近づける",
    rules:
      "賭け金を設定後、両者に2枚配られる。ヒットかスタンドを選び、10.5を超えずに近い方が勝ち。エースは1点、絵札は0.5点。配られた時点で10.5なら3倍、通常の勝利は2倍、引き分けは賭け金が戻る。",
  },
  "thirteen-water": {
    name: "十三水",
    subtitle: "13枚を3組に分けディーラーと対戦",
    rules:
      "賭け金を設定し配牌。システムが自動で13枚を3枚の頭、5枚の中、5枚の尾に分け、それぞれ比較する。3組全勝は5倍、2組勝利は2倍、1組勝利は1.5倍、同点は賭け金が戻り、負けが多い場合は賭け金を失う。",
  },
  "big-two": {
    name: "大富豪（ビッグトゥー）",
    subtitle: "単騎やペアを出し先に手札を空にする",
    rules:
      "賭け金を設定しディーラーと対戦。前の出した札より強い単騎かペアを出す、またはパス。強さは3が最弱、2が最強で、同点はスートで決める。13枚を先に出し切ると賭け金の2倍を獲得。",
  },
  "stud-poker": {
    name: "スタッドポーカー",
    subtitle: "5枚の手札でディーラーと直接比較",
    rules:
      "賭け金を設定後、ディーラーと自分にそれぞれ5枚配られ、役の強さを直接比較する――ストレートフラッシュ、フォーカード、フルハウス、フラッシュ、ストレート、スリーカード、ツーペア、ワンペア、ハイカード。強い方が2倍を獲得、同点は賭け金が戻る。",
  },
  niuniu: {
    name: "ニウニウ（牛牛）",
    subtitle: "5枚から10の倍数を作り点数を競う",
    rules:
      "賭け金を設定後、ディーラーと自分にそれぞれ5枚配られる。3枚で10の倍数（「牛」）を作り、残り2枚の一の位が点数、大きいほど良い。ちょうど10なら最強の「牛牛」、組み合わせができない場合は最弱の「無牛」。高い方が2倍を獲得、同点は賭け金が戻る。絵札は10点、エースは1点。",
  },
  "zha-jinhua": {
    name: "ザージンホワ（炸金花）",
    subtitle: "3枚の手札でディーラーと直接比較",
    rules:
      "賭け金を設定後、ディーラーと自分にそれぞれ3枚配られ、役の強さを直接比較する――スリーカード、ストレートフラッシュ、フラッシュ、ストレート、ペア、ハイカード。強い方が2倍を獲得、同点は賭け金が戻る。",
  },
  "seven-pk": {
    name: "セブンカードスタッド",
    subtitle: "4段階に分けて配り、各段階でフォールドかダブルを選択",
    rules:
      "最初の賭け金を設定。カードは4段階（3枚→2枚→1枚→最後の2枚）に分けて配られ、各段階後にフォールドまたは賭け金を倍にできる。7枚から最強の5枚の組み合わせで勝敗を決める。フォールドすると現在の総賭け金を失う。勝利時はロイヤルフラッシュの150倍からツーペアの1倍まで役の強さで支払われる。",
  },
  chess: {
    name: "チェス",
    subtitle: "AIソロ／2人対戦",
    rules: "交互に駒を動かし、相手のキングを先にチェックメイトした方が勝利。ポーン、ルーク、ナイト、ビショップ、クイーン、キングの標準的な動き方に従う。",
  },
  connect4: {
    name: "コネクトフォー",
    subtitle: "AIソロ／2人対戦",
    rules: "交互に縦型の盤に駒を落とし、縦・横・斜めのいずれかで先に四つ並べた方が勝利。",
  },
  "chinese-checkers": {
    name: "中国跳棋",
    subtitle: "星型盤",
    rules: "六芒星型の盤で、自分の駒を全て対角のゴールへ先に移動させた方が勝利。駒は一歩進むか、他の駒を連続で飛び越えて進める。",
  },
  jigsaw: {
    name: "スライドパズル",
    subtitle: "数字タイル",
    rules: "空きマスに隣接するタイルをタップしてスライドさせ、1から15まで順番に並べれば完成。",
  },
  "number-merge": {
    name: "ナンバーマージ",
    subtitle: "2048方式",
    rules: "スワイプまたは矢印キーで操作。同じ数字が隣り合うと合体して倍になり、2048を作れば成功。",
  },
  "memory-match": {
    name: "神経衰弱",
    subtitle: "ペア探し",
    rules: "2枚のカードをめくり、同じ柄なら表向きのまま残る。最少のめくり回数で全ペアを揃えれば勝利。",
  },
  ludo: {
    name: "ルード",
    subtitle: "2人対戦",
    rules: "サイコロを振って駒を盤上に進め、全ての駒をゴールまで運ぶ。相手の駒がいるマスに止まると相手を振り出しに戻せる。",
  },
  solitaire: {
    name: "ソリティア",
    subtitle: "定番の一人用カードゲーム",
    rules: "スートごとに昇順で4つの組札に全てのカードを並べれば盤面がクリアされ勝利。",
  },
  rummikub: {
    name: "ラミーキューブ",
    subtitle: "数字タイル対戦",
    rules: "手持ちの数字タイルで連続した並びか同数字の組を作り場に出す。先に手持ちタイルを出し切った方が勝利。",
  },
  "rps-battle": {
    name: "じゃんけん対戦",
    subtitle: "AI対戦",
    rules: "コンピュータと同時にグー・チョキ・パーを出し合う。勝利数が多い方が最終勝者。",
  },
  "texas-holdem": {
    name: "テキサスホールデム",
    subtitle: "AIとのタイマン（簡易版）",
    rules: "あなたとAIがそれぞれ2枚の手札を持ち、場の5枚の共通カードと合わせて役を作る。コールして役を比べるかフォールドして降りるかを選び、役の強い方がポットを獲得。",
  },
  war: {
    name: "ウォー",
    subtitle: "カードの大小でAIと対戦",
    rules: "デッキを二等分し、毎ラウンド双方が1枚めくって大小を比較、勝った方がそのラウンドのカードを獲得。同点の場合は追加勝負、最終的に多くのカードを持つ方が勝利。",
  },
  "three-card-poker": {
    name: "スリーカードポーカー",
    subtitle: "ディーラーと対戦",
    rules: "あなたとディーラーにそれぞれ3枚配られる。確認後コールして役を比較するかフォールドするかを選び、役の強い方が勝利。",
  },
  klotski: {
    name: "華容道（クロツキ）",
    subtitle: "スライドブロックパズル",
    rules: "限られた盤面の中で大小さまざまなブロックをスライドさせ、一番大きなブロックを下の出口まで動かせばクリア。",
  },
  tetris: {
    name: "テトリス",
    subtitle: "積み重ねてライン消去",
    rules: "左右スワイプで落下中のブロックを移動、タップで回転、下スワイプで即落下。一列を揃えて消去し得点、積み上がって頂上に達するとゲーム終了。",
  },
  "bubble-shooter": {
    name: "バブルシューター",
    subtitle: "同色消去",
    rules: "レーンをタップして現在の色のバブルを発射。同色が3つ以上つながると消去され得点、バブルが上端に達するとゲーム終了。",
  },
  match3: {
    name: "キャンディーマッチ3",
    subtitle: "交換して3つ揃え",
    rules: "タイルをタップし、隣接するタイルと交換。同色3つ以上揃うと消去されて上から補充、連鎖で更に消去が起こることも。",
  },
  hanoi: {
    name: "ハノイの塔",
    subtitle: "円盤の移動",
    rules: "柱をタップして一番上の円盤を選び、別の柱をタップして移動させる。大きい円盤を小さい円盤の上に置くことはできない。全ての円盤を一番右の柱に移せばクリア。",
  },
  "water-sort": {
    name: "ウォーターソートパズル",
    subtitle: "色分け注ぎ分け",
    rules: "試験管をタップして一番上の色を選び、別の試験管をタップして注ぐ。空の試験管か同色が最上部の試験管にのみ注げる。全ての試験管を単色にすればクリア。",
  },
  "pipe-connect": {
    name: "パイプコネクト",
    subtitle: "回転してつなぐ",
    rules: "パイプタイルをタップして90度回転させ、左上の水源から右下の出口まで繋げればクリア。",
  },
  "stack-tower": {
    name: "スタックタワー",
    subtitle: "タイミングを合わせて積む",
    rules: "上部のブロックが左右に揺れており、タップして下のブロックに重ねる。はみ出した部分は切り落とされて幅が狭くなり、完全に外すとゲーム終了。",
  },
  "sequence-sort": {
    name: "ソートマスター",
    subtitle: "交換して並べ替え",
    rules: "2つの数字タイルをタップして位置を交換し、最少の交換回数で小さい順に並べればクリア。",
  },
  "mini-sudoku": {
    name: "ミニ数独",
    subtitle: "6×6盤面",
    rules: "各行・各列・各2×3ブロックに1から6までの数字が重複なく入るように、盤面全体を矛盾なく埋めればクリア。",
  },
  "shooting-range": {
    name: "射撃場",
    subtitle: "反応速度チャレンジ",
    rules: "盤面にランダムに現れる的をできるだけ早くタップして得点。制限時間内に目標得点に到達すればクリア。",
  },
  "space-invaders": {
    name: "スペースインベーダー",
    subtitle: "編隊を全滅させれば勝利",
    rules: "左右に移動して敵弾を避けつつ砲弾を発射し、敵編隊を全滅させる。編隊が接近するか残機が尽きると失敗。",
  },
  "tank-battle": {
    name: "タンクバトル",
    subtitle: "先に3発命中させた方が勝利",
    rules: "左右に移動して砲弾を発射、相手のいる列に命中すると得点。先に3発命中させた方が勝利。",
  },
  "brick-breaker": {
    name: "ブロック崩し",
    subtitle: "全ブロックを壊せば勝利",
    rules: "左右にパドルを動かしてボールを跳ね返し、全てのブロックを壊せば勝利。ボールを落とすと残機が減り、尽きると失敗。",
  },
  "zombie-defense": {
    name: "ゾンビディフェンス",
    subtitle: "全ウェーブを耐えれば勝利",
    rules: "ゾンビがレーンを左へ進んでくるのでタップして倒す（一部は2回必要）。左端に到達されると体力が減り、全ウェーブを耐えれば勝利。",
  },
  "air-combat": {
    name: "エアコンバット",
    subtitle: "生き残って目標得点に到達",
    rules: "戦闘機は自動で発射、左右移動で敵機を避けながら撃墜する。制限時間内に目標得点へ到達すれば勝利、残機が尽きると失敗。",
  },
  "duel-arena": {
    name: "デュエルアリーナ",
    subtitle: "ターン制、先にノックアウトした方が勝利",
    rules: "攻撃で必殺ゲージを溜める、防御で次のダメージを半減、ゲージが満タンになったら必殺技を発動。先に相手の体力をゼロにした方が勝利。",
  },
  bridge: {
    name: "コントラクトブリッジ",
    subtitle: "パートナーと組んでコンピュータ2人と対戦",
    rules:
      "北家のパートナーと組み、西家・東家のコンピュータと対戦。4人が順番にカードを出し、同じスートがあれば必ず従う必要がある。最も強い同スートかトランプを出した方がそのトリックを獲得。13トリック終了後、自チームが7トリック以上獲得すれば勝利。",
  },
  "pick-red-points": {
    name: "ピックレッドポイント",
    subtitle: "場の同じ数字のカードを取る",
    rules:
      "順番にカードを1枚出す。出したカードと同じ数字が場にあれば全て回収して得点、なければ場に残す。全て出し終えたら赤いカード（ハートとダイヤ）の点数を比較：通常は1点、赤の10・J・Q・Kは各10点、合計が高い方が勝利。",
  },
  "dou-dizhu": {
    name: "闘地主",
    subtitle: "地主が2人の農民と対戦",
    rules:
      "配牌後、役の強さに応じて自動的に地主（自分かコンピュータ）が決まり、地主は3枚の底牌を追加で得る。残り2人は農民として協力して地主と戦う。前の人より強い同種の組を出すか、出せなければパス。地主が先に出し切れば地主の勝ち、農民のどちらかが先に出し切れば農民の勝ち。",
  },
  "penalty-kick": {
    name: "ペナルティキック",
    subtitle: "方向を選んでキーパーと対戦",
    rules: "左・中央・右のいずれかを選んでシュート、キーパーはランダムに飛ぶ。方向が外れればゴール、5ラウンド以内に目標ゴール数に達すればクリア。",
  },
  racing: {
    name: "レーシングラッシュ",
    subtitle: "車線を切り替えて対向車を避ける",
    rules: "左右に車線変更して対向車を避ける。ゴール距離に到達する前に残機が尽きると失敗。",
  },
  parking: {
    name: "パーキングチャレンジ",
    subtitle: "手数内に駐車",
    rules: "ハンドルと前進ボタンで車を操作し、手数と衝突回数が尽きる前に正しい向きで指定の駐車スペースに停めればクリア。",
  },
  motocross: {
    name: "モトクロスジャンプ",
    subtitle: "穴を跳び越えてゴールを目指す",
    rules: "タップしてバイクをジャンプさせ、タイミングよく前方の穴を越える。ゴールに着く前に残機が尽きると失敗。",
  },
  "drift-racing": {
    name: "ドリフトレーシング",
    subtitle: "コースに合わせてハンドルを切り得点",
    rules: "コースのカーブに合わせてハンドルを切りコース内に留まりながらドリフト得点を稼ぐ。ゴールまでに目標得点に達すればクリア、長くコースを外れると失敗。",
  },
  "liars-cards": {
    name: "ライアーズカード（吹牛）",
    subtitle: "伏せて枚数を宣言し、相手の真偽を見破る",
    rules:
      "コンピュータ2人と順番にカードを出す：1〜4枚を伏せて出し、数字を宣言する（A→2→3→…→K→Aの順で巡回、正直に出しても嘘をついてもよい）。他のプレイヤーは「信じる」で次に進むか、「見破る」でめくって検証できる。見破りが成功すれば出した人が場の全カードを回収、失敗すれば見破った人が回収する。誰かが見破られずに手札を全て出し切れば勝利。",
  },
  billiards: {
    name: "ビリヤード",
    subtitle: "引いて狙いを定め、全ての球を落とす",
    rules: "手球から後方へ引いて狙いを定め、離して打つ。ショット回数が尽きる前に全ての色球をポケットすればクリア。",
  },
  bowling: {
    name: "ボウリング",
    subtitle: "3フレームで目標ピン数に到達",
    rules: "スライダーを動かして投球角度を設定し、離して投げる。3フレーム以内に目標の倒れたピン数に到達すればクリア。",
  },
  "basketball-shoot": {
    name: "バスケットボールシュート",
    subtitle: "タイミングを合わせてシュート",
    rules: "パワーゲージが自動で左右に動くので、中央に近いタイミングでタップしてシュート。十分な数を決めればクリア。",
  },
  "five-pk": {
    name: "ファイブカードポーカー",
    subtitle: "1回交換後、役を比較しダブルアップも可能",
    rules:
      "賭け金を設定後、5枚配られる（デッキにはジョーカー2枚を含む）。残したいカードを選び、残りを1回だけ交換する。役は強さに応じて支払われる――ストレートフラッシュ500倍、ファイブカード200倍、フラッシュストレート120倍、ツーペアは1倍まで。勝利後は大小または赤黒でダブルアップに挑戦するか、いつでも換金できる。",
  },
  "little-mary": {
    name: "クラシック・リトルメアリー",
    subtitle: "回転するライトフレーム――大小のカードに賭ける",
    rules:
      "各シンボルに賭けてからスタート。ライトフレームは高速で3周回転した後に減速し、半周から1周半の範囲で停止する――早めに止めたい場合はストップをタップ。矢印で止まると負け、フリースピンシンボルで止まると再スピンが得られる。固定シンボルは決まった倍率を支払い、大小のカードシンボルは賭けていれば現在の倍率で支払う。十分な回転数の後、より高い固定配当と専用サウンドのボーナスラウンドが発生することがある。",
  },
  "little-mary-2": {
    name: "クラシック・リトルメアリーII",
    subtitle: "スポーツテーマの回転ライトフレーム",
    rules:
      "クラシック・リトルメアリーと同じ回転の仕組みを、スポーツテーマ（サッカー、ラグビー、バスケットボール、ボウリング、テニス、卓球、ゴルフ）にアレンジ。各シンボルに賭けてからスタート――矢印で止まると負け、フリーシンボルは追加スピンを付与、固定シンボルは決まった倍率を支払い、大小のスポーツシンボルは賭けていれば現在の倍率で支払う。十分な回転数の後、高配当のボーナスラウンドが発生することがある。",
  },
  "little-mary-3": {
    name: "クラシック・リトルメアリーIII",
    subtitle: "花神ジャックポット――大小に賭ける",
    rules:
      "同じ回転の仕組み。3つの花神ライトは通常それぞれ独立して点滅するが、十分な回転数の後に点滅する警告状態に同期することがある。その瞬間にリールが大小のシンボルグループで止まると、3つのシンボルが一緒に現在の倍率の3倍を支払う――珍しいボーナスジャックポット。",
  },
  "little-mary-4": {
    name: "クラシック・リトルメアリーIV",
    subtitle: "動物テーマの花神ジャックポット",
    rules:
      "花神ジャックポット版と同じ仕組みを動物テーマ（トラ、ドラゴン、サル、キツネ、ネズミ、鶏、ヒヨコ）にアレンジ。花神ジャックポットの警告と3倍配当は同じように機能する。",
  },
  "little-mary-5": {
    name: "クラシック・リトルメアリーIII（鳳凰）",
    subtitle: "鳳凰装飾版――大小に賭ける",
    rules:
      "同じ回転の仕組み。中央の大きな鳳凰は純粋な装飾で、ボーナス警告中はより速く点滅する。フリースピンシンボルで止まるとフレーム全体に装飾的な光の軌跡が流れる――見た目だけの演出で配当は変わらない。",
  },
  "little-mary-6": {
    name: "クラシック・リトルメアリーIV（鳳凰）",
    subtitle: "鳳凰装飾版――ドリンクテーマ",
    rules:
      "鳳凰装飾版と同じ仕組みをドリンクテーマ（急須、はちみつ、マテ茶、かき氷、ビール、ワイン、カクテル）にアレンジ。装飾的な鳳凰と光の軌跡の効果は同じように機能する。",
  },
  "little-mary-7": {
    name: "ミニ・リトルメアリー（オーシャン）",
    subtitle: "8×8ミニフレーム――大小に賭ける",
    rules:
      "同じ回転の仕組みを持つより小さな8×8のライトフレーム（28マス）を、海の生き物テーマ（サメ、クジラ、イルカ、熱帯魚、カニ、貝殻、泡）にアレンジ。矢印で止まると負け、フリーシンボルは追加スピンを付与、固定シンボルは決まった倍率を支払い、大小のシンボルは賭けていれば現在の倍率で支払う。十分な回転数の後、ジャックポットボーナスラウンドが発生することがある。",
  },
  "little-mary-8": {
    name: "ミニ・リトルメアリー（デザート）",
    subtitle: "8×8ミニフレーム――デザートテーマ",
    rules:
      "オーシャン版と同じ8×8ミニフレームの仕組みをデザートテーマ（ケーキ、イチゴケーキ、カップケーキ、ドーナツ、クッキー、キャンディー、ロリポップ）にアレンジ。十分な回転数の後、専用サウンドのジャックポットボーナスラウンドが発生することがある。",
  },
  "fruit-slot-1": {
    name: "フルーツリールI",
    subtitle: "クラシック3×3リール、5ペイライン",
    rules:
      "5本のペイライン（上段、中段、下段と2本の対角線）を持つクラシックな3リール3段のフルーツマシン。ライン毎に賭け金を設定してから回転――各リールは左から右へ独立して停止し、早めに止めたい場合はストップをタップできる。いずれかのラインで3つ揃うと配当表に従って支払われ、ラッキー7の100倍からチェリーの4倍まで。画面上のどこかにチェリーが2つ以上あれば少額のコンソレーション配当。中段に7が3つ揃うとジャックポットで、専用のライトショーとサウンドが流れる。",
  },
  "fruit-slot-2": {
    name: "フルーツリールII",
    subtitle: "トロピカルフルーツテーマ、5ペイライン",
    rules:
      "フルーツリールIと同じ3リール5ペイラインの仕組みをトロピカルテーマにアレンジ――ダイヤモンドがラッキー7の代わりにジャックポットシンボルとなり、イチゴ、パイナップル、バナナ、桃、チェリーと組み合わされる。いずれかのラインで3つ揃うと配当表に従って支払われ、ダイヤモンドの100倍からチェリーの4倍まで。中段にダイヤモンドが3つ揃うとジャックポット。",
  },
  "little-mary-bonus": {
    name: "クラシック・リトルメアリーV（ラッキー7ボーナス）",
    subtitle: "ラッキーセブンボーナス倍率ラウンド",
    rules:
      "同じ回転の仕組みで、同時に8つのシンボルに賭ける。中央の数字リールの3つ組は通常完全に装飾的に回転するが、勝利時に3つのリールが1つずつ停止するボーナスラウンドが発生する可能性がある。3つの同じ奇数で止まると勝利が10倍に、3つの偶数で止まると5倍になる――毎回発生するわけではない珍しいランダムボーナス。",
  },
  "little-mary-bonus-2": {
    name: "クラシック・リトルメアリーIV（ラッキー7ボーナス、祝祭）",
    subtitle: "祝祭テーマのラッキーセブンボーナス",
    rules:
      "ラッキーセブンボーナス版と同じ仕組みを祝祭テーマ（赤い封筒、金の延べ棒、提灯、みかん、月餅、花火、チェリー）にアレンジ。ボーナスラウンドと10倍／5倍の数字一致倍率は祝祭らしい色とサウンドエフェクトで同じように機能する。",
  },
  "xiangqi-mahjong": {
    name: "シャンチー麻雀",
    subtitle: "将棋駒で組を作り、コンピュータと競争",
    rules:
      "賭け金を設定後、あなたとコンピュータがそれぞれ5枚の中国将棋の駒を引く。自分の番に駒を引き、対子と組（連続か同種3つ）が完成すればツモで勝利。できなければ6枚のうち1枚を捨てる。コンピュータが捨てた駒で手が完成すれば取って勝利するか、パスして引き続けることもできる。配当：混合の対子と連続で2倍、同種の対子と連続で3倍、兵または卒が5枚揃うと5倍。捨て牌を取る場合は指定の倍率で支払われ、ツモはボーナスが加算される。勝者が出ずに牌が尽きた場合は賭け金が返却される。",
  },
  tuitongzai: {
    name: "推筒仔",
    subtitle: "麻雀牌のパイガオを3つのポジションで同時に",
    rules:
      "1から9までの円形麻雀牌（各4枚）と半点の価値を持つ無地牌（4枚）を使い、40枚のデッキを表現する。頭・天・尾のポジションに賭けた後、ディーラーと各ポジションが比較のため2枚ずつめくる。強さの順序：ダブル無地（最強）はどのペアにも勝ち、ペアは2-8の組み合わせに勝ち、それは通常の点数合計に勝つ（数字の合計、一の位を使用、無地＝0.5点、9.5が最高の通常合計、0が最低）。各ポジションはディーラーと独立に比較される――勝利は1倍、ペアは4倍、ダブル無地は10倍を支払う。合計が同じ場合はハウスルールによりディーラー有利となる。",
  },
}

const ko: GameTable = {
  xiangqi: {
    name: "중국 장기",
    subtitle: "AI 솔로／2인 대전",
    rules:
      "교대로 기물을 움직여 상대의 장(將)을 먼저 궁지에 몰면 승리합니다. 전통 장기 규칙: 차는 직선, 마는 L자, 상은 자기 진영에서 대각선, 사는 궁 주변 대각선, 병은 강을 건너면 좌우 이동이 가능합니다.",
  },
  "darkchess-classic": {
    name: "암기(전통)",
    subtitle: "AI 솔로／2인 대전",
    rules: "모든 기물은 뒤집혀 배치되며, 뒤집은 후 전통적인 서열 순서로 상대 기물을 잡습니다. 상대 기물을 모두 잡거나 움직일 수 없게 만들면 승리합니다.",
  },
  "darkchess-variant": {
    name: "암기(변형)",
    subtitle: "AI 솔로／2인 대전",
    rules: "전통 암기와 동일하지만 포의 공격과 뛰어넘는 방식에 변형 규칙을 적용해 더 다양한 전술을 즐길 수 있습니다.",
  },
  go: {
    name: "바둑",
    subtitle: "19×19",
    rules: "교대로 19×19 바둑판의 교차점에 흑백 돌을 놓아 더 많은 영역을 차지하면 승리합니다. 완전히 포위되어 활로가 없는 돌은 잡힙니다.",
  },
  gomoku: { name: "오목", subtitle: "17×17", rules: "교대로 돌을 놓아 가로, 세로, 대각선 중 하나로 먼저 다섯 개를 연결하면 승리합니다." },
  othello: {
    name: "오델로",
    subtitle: "표준",
    rules: "교대로 돌을 놓아 상대 돌을 사이에 끼우면 자신의 색으로 뒤집습니다. 종료 시 돌이 더 많은 쪽이 승리합니다.",
  },
  mahjong: {
    name: "중국 마작",
    subtitle: "AI 솔로(컴퓨터 3인)",
    rules: "컴퓨터 3명과 함께 패를 뽑고 버리며, 다른 사람의 버린 패로 치・펑・깡을 할 수 있습니다. 먼저 정식 승패 조합을 완성하면 승리합니다.",
  },
  luzhanqi: {
    name: "육전기(군대 장기)",
    subtitle: "AI 솔로／2인 대전",
    rules: "양측 기물의 계급은 비공개이며 상대는 뒷면만 볼 수 있습니다. 계급의 높낮이로 승부가 결정되며, 먼저 상대의 군기를 빼앗거나 움직일 수 없게 만들면 승리합니다.",
  },
  checkers: {
    name: "체커",
    subtitle: "표준",
    rules: "교대로 기물을 대각선으로 움직이며 상대 기물을 뛰어넘어 잡습니다. 상대 기물을 모두 잡거나 움직일 수 없게 만들면 승리합니다.",
  },
  tictactoe: {
    name: "틱택토",
    subtitle: "확대판 3×3",
    rules: "교대로 기호를 놓아 가로, 세로, 대각선 중 하나로 먼저 세 개를 연결하면 승리합니다.",
  },
  sevens: {
    name: "세븐즈(排七)",
    subtitle: "4인전, 남은 점수가 가장 적은 사람이 승리",
    rules: "7부터 시작해 인접한 숫자의 카드를 순서대로 냅니다. 낼 카드가 없으면 뒤집어 놓고 벌점을 받습니다. 누군가 끝내면 총 벌점이 가장 적은 사람이 승리합니다.",
  },
  "sichuan-mahjong": {
    name: "사천 마작(혈전도저)",
    subtitle: "한 문양 결핍 필수, 승리 후에도 계속 진행",
    rules: "통・삭・만 세 가지 문양만 사용하며 시작 시 한 문양이 없어야 합니다. 한 명이 승리하면 퇴장하고, 나머지는 세 명이 승리하거나 패가 다 떨어질 때까지 계속합니다.",
  },
  "malaysia-mahjong": {
    name: "말레이시아 3인 마작",
    subtitle: "3인전, 와일드패로 큰 패가 자주 나옴",
    rules: "3명이 대전하며 통자, 자패, 화패, 와일드패만 남긴 축소 패덱을 사용합니다. 패가 적고 와일드가 많아 큰 패가 훨씬 자주 나옵니다.",
  },
  "mahjong-pengpeng": {
    name: "펑펑후(碰碰胡)",
    subtitle: "간소화 마작, 치 없이 펑만 가능",
    rules: "치는 금지되고 펑이나 자력으로 뽑기만 가능한 간소화 패덱입니다. 각(刻子) 2조와 대자(對子) 1조를 모으면 승리합니다.",
  },
  "mahjong-sevens": {
    name: "마작 세븐즈",
    subtitle: "세븐즈와 동일, 통・삭・만 세 문양으로",
    rules: "각 문양의 5부터 시작해 인접한 숫자를 순서대로 냅니다. 낼 패가 없으면 뒤집어 놓고 벌점을 받습니다.",
  },
  "riichi-mahjong": {
    name: "일본 리치 마작",
    subtitle: "동풍전, 리치/도라/후리텐",
    rules: "멘젠으로 텐파이하면 리치를 선언할 수 있습니다. 공개된 도라는 추가 한을 더합니다. 후리텐 상태에서는 이미 넘긴 패로 론할 수 없으며, 야쿠가 1개 이상 있어야 승리합니다.",
  },
  "mahjong-solitaire": {
    name: "마작 솔리테어(연연간)",
    subtitle: "같은 패 찾기, 연결선 2번 이하로 꺾어야 제거",
    rules: "연결선이 2번 이하로 꺾이는 같은 패 두 장을 찾아 제거합니다. 시간 내에 판 전체를 비우면 승리합니다.",
  },
  "merge-2048": {
    name: "2048 합치기",
    subtitle: "밀어서 숫자를 합치고 2048 도전",
    rules: "원하는 방향으로 밀면 같은 숫자가 부딪혀 합쳐지며 두 배가 됩니다. 2048을 만들면 성공입니다.",
  },
  "city-2048": {
    name: "시티 2048",
    subtitle: "건물을 합쳐 초원에서 고층빌딩까지",
    rules: "2048과 같은 규칙이지만 타일이 건물 아이콘입니다. 초원부터 고층빌딩까지 합쳐 올라갑니다.",
  },
  "merge-2048-undo": {
    name: "2048 되돌리기",
    subtitle: "2048과 동일, 되돌리기 기능 추가",
    rules: "2048과 같은 규칙이지만, 잘못 밀었을 때 되돌리기로 취소할 수 있습니다.",
  },
  "triple-town": {
    name: "트리플 타운",
    subtitle: "건물을 합치되 돌아다니는 곰을 조심",
    rules: "6×6 판에서 같은 물건 3개를 합치면 다음 등급이 됩니다. 곰이 돌아다니며 칸을 막는데, 완전히 포위하면 묘비가 되어 역시 합칠 수 있습니다.",
  },
  suika: {
    name: "수박 게임",
    subtitle: "좌우로 이동해 떨어뜨리고, 같은 과일을 합쳐 크게",
    rules: "좌우로 이동해 떨어지는 과일의 위치를 고릅니다. 같은 과일이 부딪히면 한 단계 큰 과일로 합쳐지며, 최종적으로 큰 수박을 목표로 합니다.",
  },
  "drop-2048": {
    name: "2048 드롭",
    subtitle: "떨어지는 숫자 블록이 쌓이며 합쳐짐",
    rules: "숫자 블록이 위에서 떨어지며, 좌우로 이동해 열을 고릅니다. 같은 숫자가 쌓이면 합쳐지며 두 배가 됩니다.",
  },
  puyo: {
    name: "푸요푸요",
    subtitle: "쌍으로 떨어지는 블록, 같은 색 4개 이상 제거",
    rules: "색깔 있는 푸요 쌍이 떨어지며 이동・회전이 가능합니다. 같은 색이 4개 이상 연결되면 제거되고 연쇄가 발생할 수 있습니다.",
  },
  "dr-mario": {
    name: "닥터 마리오",
    subtitle: "떨어지는 캡슐을 쌓아 바이러스를 한 줄로 제거",
    rules: "두 가지 색의 캡슐이 떨어져 쌓입니다. 바이러스를 포함해 같은 색 4개를 한 줄로 맞추면 제거됩니다. 모든 바이러스를 없애면 승리합니다.",
  },
  "columns-tetris": {
    name: "컬럼스／테트리스",
    subtitle: "두 가지 고전 낙하 퍼즐을 전환",
    rules: "컬럼스(같은 색 3개 이상을 한 줄로 맞춰 제거)와 테트리스(한 줄을 채워 제거)를 같은 화면에서 전환할 수 있습니다.",
  },
  "candy-crush": {
    name: "캔디 크러쉬",
    subtitle: "사탕을 교환해 3개 맞추고 목표 점수 달성",
    rules: "인접한 사탕을 교환해 3개 이상을 맞춥니다. 특수 사탕은 한 줄이나 색 전체를 제거합니다. 제한된 이동 횟수 내에 목표 점수에 도달하면 성공입니다.",
  },
  bejeweled: {
    name: "비쥬드",
    subtitle: "매치3 게임의 원조, 보석을 교환해 제거",
    rules: "인접한 보석을 교환해 같은 색 3개 이상의 줄을 만들어 제거합니다. 연쇄로 추가 점수를 얻으며 최고 기록에 도전합니다.",
  },
  gardenscapes: {
    name: "가든스케이프",
    subtitle: "매치3로 코인을 모아 황폐한 정원을 복구",
    rules: "매치로 코인을 벌고, 그 코인으로 정원 복구 임무를 완료합니다.",
  },
  homescapes: {
    name: "홈스케이프",
    subtitle: "매치3로 코인을 모아 꿈의 저택을 꾸미기",
    rules: "매치로 코인을 벌고, 그 코인으로 저택 꾸미기 임무를 완료합니다.",
  },
  "royal-match": {
    name: "로얄 매치",
    subtitle: "매치3로 코인을 모아 오래된 성을 복구",
    rules: "매치로 코인을 벌고, 그 코인으로 성 복구 임무를 완료합니다.",
  },
  "tower-of-saviors": {
    name: "신들의 탑",
    subtitle: "보석 매치 + 카드 전투 육성",
    rules: "보석을 매치하면 해당 속성의 동료가 적을 공격합니다. 적을 쓰러뜨리면 팀이 레벨업하고 다음 단계로 진행합니다.",
  },
  "puzzle-dragons": {
    name: "퍼즐앤드래곤",
    subtitle: "보석 매치 + 속성 상극 전투",
    rules: "보석을 매치하면 공격이 발동됩니다. 속성 상극을 활용해 추가 피해를 입히고 적을 쓰러뜨립니다.",
  },
  "empires-puzzles": {
    name: "엠파이어 앤 퍼즐",
    subtitle: "보석 매치 + 간단한 도시 건설과 PvP",
    rules: "보석을 매치하면 영웅이 공격합니다. 상대를 쓰러뜨리면 건축 자재를 얻어 제국을 성장시킵니다.",
  },
  "sheep-sheep": {
    name: "양이라는 양",
    subtitle: "쌓인 타일을 수집, 3개 모으면 제거",
    rules: "가려지지 않은 타일을 탭해 수집 칸으로 보냅니다. 같은 무늬 3개가 모이면 자동으로 제거되며, 칸이 가득 차도록 모으지 못하면 실패합니다.",
  },
  match3d: {
    name: "매치 3D",
    subtitle: "입체 더미에서 수집해 3개 매치",
    rules: "양이라는 양과 같은 방식이지만 타일이 입체 물건 더미입니다. 같은 무늬를 3개 찾아 수집합니다.",
  },
  "balls-merge": {
    name: "공 합치기",
    subtitle: "이동해 떨어뜨리고, 같은 공을 합쳐 크게",
    rules: "수박 게임과 같은 방식이며 공이 테마입니다. 같은 공이 합쳐져 더 커집니다.",
  },
  "cookies-merge": {
    name: "쿠키 합치기",
    subtitle: "이동해 떨어뜨리고, 같은 쿠키를 합쳐 크게",
    rules: "수박 게임과 같은 방식이며 쿠키가 테마입니다. 같은 쿠키가 합쳐져 더 커집니다.",
  },
  "planets-merge": {
    name: "행성 합치기",
    subtitle: "이동해 떨어뜨리고, 같은 행성을 합쳐 크게",
    rules: "수박 게임과 같은 방식이며 행성이 테마입니다. 같은 행성이 합쳐져 더 커집니다.",
  },
  "mahjong-ninepoint5": {
    name: "마작 구점반",
    subtitle: "카드 대신 마작패로, 9.5에 가깝게",
    rules: "트럼프 대신 마작패로 구점반(블랙잭 방식)을 합니다. 더 받거나 멈추기를 선택해 9.5를 넘지 않고 가장 가깝게 만들면 승리합니다.",
  },
  "mahjong-niuniu": {
    name: "마작 니우니우",
    subtitle: "카드 대신 마작패로, 10의 배수를 만들기",
    rules: "트럼프 대신 마작패로 니우니우를 합니다. 5장 중 3장으로 10의 배수를 만들고 남은 2장의 점수를 비교합니다.",
  },
  "dragon-gate": {
    name: "용문 쏘기(射龍門)",
    subtitle: "마작 통자로 문을 열고 범위에 베팅",
    rules: "통자 2장으로 문을 만들고 베팅 후 세 번째 패를 뽑습니다. 문 사이에 들어가면 승리, 밖이면 패배, 기둥과 같은 숫자면 두 배를 물어줍니다.",
  },
  blackjack: {
    name: "블랙잭",
    subtitle: "딜러와 21 대결",
    rules:
      "21을 넘지 않으면서 최대한 가깝게 만드세요. 에이스는 1 또는 11, 그림 카드는 10으로 계산합니다. 히트 또는 스탠드를 선택하며, 딜러는 17 이상이 될 때까지 카드를 뽑아야 합니다.",
  },
  baccarat: {
    name: "바카라",
    subtitle: "플레이어／뱅커／타이",
    rules:
      "카드가 배분되기 전에 플레이어, 뱅커, 타이 중 하나에 베팅합니다. 합계는 일의 자리 숫자로 비교하며 더 큰 쪽이 승리합니다. 추가 카드는 표준 바카라 규칙에 따라 자동으로 뽑힙니다.",
  },
  "ten-half": {
    name: "십점반",
    subtitle: "딜러보다 10.5에 더 가깝게",
    rules:
      "베팅 후 양쪽에 카드 2장씩 배분됩니다. 히트 또는 스탠드를 선택해 10.5를 넘지 않으면서 가깝게 만드세요. 에이스는 1점, 그림 카드는 0.5점입니다. 배분 즉시 10.5면 3배, 일반 승리는 2배, 무승부는 베팅금을 돌려받습니다.",
  },
  "thirteen-water": {
    name: "십삼수",
    subtitle: "13장을 3조로 나눠 딜러와 대결",
    rules:
      "베팅 후 배분하면 시스템이 자동으로 13장을 3장의 앞줄, 5장의 중간줄, 5장의 뒷줄로 나누어 각각 비교합니다. 3조 모두 승리 시 5배, 2조 승리 시 2배, 1조 승리 시 1.5배를 받으며, 무승부는 베팅금이 그대로, 더 많이 지면 베팅금을 잃습니다.",
  },
  "big-two": {
    name: "빅투",
    subtitle: "싱글 또는 페어로 먼저 손패 비우기",
    rules:
      "베팅 후 딜러와 대결합니다. 이전 패보다 강한 싱글 카드나 같은 숫자의 페어를 내거나 패스합니다. 숫자 순서는 3이 가장 약하고 2가 가장 강하며, 동점이면 무늬로 비교합니다. 13장을 먼저 모두 내면 베팅금의 2배를 획득합니다.",
  },
  "stud-poker": {
    name: "스터드 포커",
    subtitle: "5장의 패로 딜러와 직접 비교",
    rules:
      "베팅 후 딜러와 자신에게 각각 5장이 배분되며 패의 강도를 직접 비교합니다 ― 스트레이트 플러시, 포카드, 풀하우스, 플러시, 스트레이트, 트리플, 투페어, 원페어, 하이카드. 더 강한 쪽이 2배를 획득하며, 무승부는 베팅금을 돌려받습니다.",
  },
  niuniu: {
    name: "니우니우",
    subtitle: "5장에서 10의 배수를 만들어 점수 경쟁",
    rules:
      "베팅 후 딜러와 자신에게 각각 5장이 배분됩니다. 3장으로 10의 배수('牛')를 만들고 남은 2장의 일의 숫자가 점수이며 높을수록 좋습니다. 정확히 10이면 최강의 '牛牛', 조합이 안되면 최약의 '無牛'입니다. 높은 쪽이 2배를 획득하며, 무승부는 베팅금을 돌려받습니다. 그림 카드는 10점, 에이스는 1점입니다.",
  },
  "zha-jinhua": {
    name: "자진화",
    subtitle: "3장의 패로 딜러와 직접 비교",
    rules:
      "베팅 후 딜러와 자신에게 각각 3장이 배분되며 패의 강도를 직접 비교합니다 ― 트리플, 스트레이트 플러시, 플러시, 스트레이트, 페어, 하이카드. 더 강한 쪽이 2배를 획득하며, 무승부는 베팅금을 돌려받습니다.",
  },
  "seven-pk": {
    name: "세븐카드 스터드",
    subtitle: "4단계로 배분, 각 단계에서 폴드 또는 더블 선택",
    rules:
      "시작 베팅금을 설정합니다. 카드는 4단계(3장→2장→1장→마지막 2장)로 배분되며, 각 단계 후 폴드하거나 베팅금을 2배로 올릴 수 있습니다. 7장 중 가장 강한 5장의 조합으로 승패를 결정합니다. 폴드하면 현재까지의 총 베팅금을 잃습니다. 승리 시 로열 플러시 150배부터 투페어 1배까지 패의 강도에 따라 지급됩니다.",
  },
  chess: {
    name: "체스",
    subtitle: "AI 솔로／2인 대전",
    rules: "교대로 기물을 움직여 상대의 킹을 먼저 체크메이트하면 승리합니다. 폰, 룩, 나이트, 비숍, 퀸, 킹의 표준 이동 규칙을 따릅니다.",
  },
  connect4: {
    name: "커넥트 포",
    subtitle: "AI 솔로／2인 대전",
    rules: "교대로 세로형 보드에 기물을 떨어뜨려 가로, 세로, 대각선 중 하나로 먼저 네 개를 연결하면 승리합니다.",
  },
  "chinese-checkers": {
    name: "중국 체커",
    subtitle: "별 모양 보드",
    rules: "육각 별 모양 보드에서 자신의 모든 기물을 먼저 반대쪽 모서리로 이동시키면 승리합니다. 기물은 한 칸씩 이동하거나 다른 기물을 연속으로 뛰어넘어 전진할 수 있습니다.",
  },
  jigsaw: {
    name: "슬라이딩 퍼즐",
    subtitle: "숫자 타일",
    rules: "빈 칸에 인접한 타일을 탭해 밀어 넣어, 1부터 15까지 순서대로 배열하면 완료됩니다.",
  },
  "number-merge": {
    name: "넘버 머지",
    subtitle: "2048 방식",
    rules: "스와이프하거나 방향키를 사용합니다. 같은 숫자가 인접하면 합쳐져 두 배가 되며, 2048을 만들면 성공합니다.",
  },
  "memory-match": {
    name: "카드 짝맞추기",
    subtitle: "페어링 챌린지",
    rules: "두 장의 카드를 뒤집어 같은 그림이면 앞면으로 유지됩니다. 최소 횟수로 모든 짝을 맞추면 승리합니다.",
  },
  ludo: {
    name: "루도",
    subtitle: "2인 대전",
    rules: "주사위를 굴려 기물을 보드를 따라 이동시켜 모두 도착점까지 보냅니다. 상대 기물이 있는 칸에 도착하면 상대를 출발점으로 되돌릴 수 있습니다.",
  },
  solitaire: {
    name: "솔리테어",
    subtitle: "클래식 1인용 카드 게임",
    rules: "모든 카드를 무늬별로 오름차순으로 네 개의 파운데이션 더미에 정리하면 보드가 비워지고 승리합니다.",
  },
  rummikub: {
    name: "루미큐브",
    subtitle: "숫자 타일 대전",
    rules: "손에 있는 숫자 타일로 연속된 순서나 같은 숫자 조합을 만들어 테이블에 내려놓습니다. 먼저 모든 타일을 내려놓으면 승리합니다.",
  },
  "rps-battle": {
    name: "가위바위보 대전",
    subtitle: "AI 대전",
    rules: "컴퓨터와 동시에 가위, 바위, 보를 냅니다. 이긴 라운드가 더 많은 쪽이 최종 승리합니다.",
  },
  "texas-holdem": {
    name: "텍사스 홀덤",
    subtitle: "AI와 1대1 (간소화 버전)",
    rules: "당신과 AI가 각각 2장의 패를 받고, 공개된 5장의 커뮤니티 카드와 조합합니다. 콜하여 패를 비교하거나 폴드하여 포기할 수 있으며, 더 높은 패가 팟을 가져갑니다.",
  },
  war: {
    name: "워 카드게임",
    subtitle: "숫자 비교로 AI와 대전",
    rules: "덱을 절반씩 나눕니다. 매 라운드 양측이 카드 한 장씩 뒤집어 비교하며, 더 큰 카드가 해당 라운드를 가져갑니다. 같을 경우 추가 대결을 하며, 최종적으로 카드를 더 많이 가진 쪽이 승리합니다.",
  },
  "three-card-poker": {
    name: "쓰리카드 포커",
    subtitle: "딜러와 대전",
    rules: "당신과 딜러가 각각 3장의 카드를 받습니다. 확인 후 콜하여 패를 비교하거나 폴드할 수 있으며, 더 높은 패가 승리합니다.",
  },
  klotski: {
    name: "화용도(클로츠키)",
    subtitle: "슬라이딩 블록 퍼즐",
    rules: "제한된 보드 공간 안에서 크기가 다른 블록들을 슬라이드시켜, 가장 큰 블록을 아래쪽 출구로 이동시키면 성공합니다.",
  },
  tetris: {
    name: "테트리스",
    subtitle: "쌓아서 줄 지우기",
    rules: "좌우 스와이프로 떨어지는 블록을 이동, 탭하여 회전, 아래로 스와이프하여 빠르게 떨어뜨립니다. 한 줄을 채우면 지워지고 점수를 얻으며, 블록이 맨 위까지 쌓이면 게임이 종료됩니다.",
  },
  "bubble-shooter": {
    name: "버블 슈터",
    subtitle: "같은 색 맞춰 제거",
    rules: "레인을 탭해 현재 색상의 버블을 발사합니다. 같은 색 3개 이상이 연결되면 제거되어 점수를 얻으며, 버블이 맨 위에 도달하면 게임이 종료됩니다.",
  },
  match3: {
    name: "매치3 블래스트",
    subtitle: "교환하여 맞추기",
    rules: "타일을 탭하고 인접한 타일과 교환합니다. 같은 색 3개 이상이 맞춰지면 제거되고 위에서 새로 채워지며, 연쇄로 추가 제거가 일어날 수 있습니다.",
  },
  hanoi: {
    name: "하노이의 탑",
    subtitle: "원반 옮기기",
    rules: "기둥을 탭해 맨 위 원반을 선택하고, 다른 기둥을 탭해 옮깁니다. 큰 원반은 작은 원반 위에 놓을 수 없습니다. 모든 원반을 가장 오른쪽 기둥으로 옮기면 성공합니다.",
  },
  "water-sort": {
    name: "워터 소트 퍼즐",
    subtitle: "부어서 색 분류하기",
    rules: "시험관을 탭해 맨 위 색을 선택하고, 다른 시험관을 탭해 부어 넣습니다. 빈 시험관이나 같은 색이 맨 위인 시험관에만 부을 수 있습니다. 모든 시험관을 단색으로 만들면 성공합니다.",
  },
  "pipe-connect": {
    name: "파이프 연결",
    subtitle: "회전해서 연결하기",
    rules: "파이프 타일을 탭해 90도 회전시킵니다. 왼쪽 위의 수원지부터 오른쪽 아래의 출구까지 연결하면 성공합니다.",
  },
  "stack-tower": {
    name: "스택 타워",
    subtitle: "타이밍 맞춰 쌓기",
    rules: "위쪽 블록이 좌우로 흔들리며, 탭해서 아래 블록 위에 떨어뜨립니다. 겹치지 않은 부분은 잘려나가 폭이 좁아지며, 완전히 빗나가면 게임이 종료됩니다.",
  },
  "sequence-sort": {
    name: "정렬 마스터",
    subtitle: "교환하여 순서대로",
    rules: "두 숫자 타일을 탭해 위치를 교환합니다. 최소 교환 횟수로 모든 숫자를 작은 순서대로 배열하면 성공합니다.",
  },
  "mini-sudoku": {
    name: "미니 스도쿠",
    subtitle: "6×6 보드",
    rules: "각 행, 열, 2×3 박스마다 1부터 6까지의 숫자가 중복 없이 들어가야 합니다. 전체 보드를 충돌 없이 채우면 성공합니다.",
  },
  "shooting-range": {
    name: "사격장",
    subtitle: "빠른 반응 타겟",
    rules: "격자판에 무작위로 타겟이 켜지면 최대한 빠르게 탭해 점수를 얻습니다. 시간이 끝나기 전에 목표 점수에 도달하면 성공합니다.",
  },
  "space-invaders": {
    name: "스페이스 인베이더",
    subtitle: "편대를 전멸시키면 승리",
    rules: "좌우로 이동해 적의 공격을 피하며 포탄을 발사해 외계 편대를 전멸시킵니다. 편대가 접근하거나 생명이 다하면 실패합니다.",
  },
  "tank-battle": {
    name: "탱크 배틀",
    subtitle: "먼저 3발 명중시키면 승리",
    rules: "좌우로 이동하며 포탄을 발사합니다. 상대가 있는 줄에 명중하면 점수를 얻으며, 먼저 3발을 명중시키면 승리합니다.",
  },
  "brick-breaker": {
    name: "벽돌 깨기",
    subtitle: "모든 벽돌을 깨면 승리",
    rules: "좌우로 패들을 움직여 공을 튕겨내며 모든 벽돌을 깨면 승리합니다. 공을 놓치면 생명이 줄어들고, 생명이 다하면 실패합니다.",
  },
  "zombie-defense": {
    name: "좀비 디펜스",
    subtitle: "모든 웨이브를 버티면 승리",
    rules: "좀비가 레인을 따라 왼쪽으로 전진하며, 탭해서 처치합니다(일부는 두 번 필요). 왼쪽 끝에 도달하면 체력이 줄어들며, 모든 웨이브를 버티면 승리합니다.",
  },
  "air-combat": {
    name: "에어 컴뱃",
    subtitle: "생존하여 목표 점수에 도달",
    rules: "전투기는 자동으로 발사하며, 좌우로 이동해 적기를 피하며 격추합니다. 제한 시간 내에 목표 점수에 도달하면 승리하며, 생명이 다하면 실패합니다.",
  },
  "duel-arena": {
    name: "듀얼 아레나",
    subtitle: "턴제, 먼저 쓰러뜨리면 승리",
    rules: "공격으로 필살기 게이지를 모으거나, 방어로 다음 피해를 절반으로 줄이거나, 게이지가 가득 차면 필살기를 사용합니다. 먼저 상대 체력을 0으로 만들면 승리합니다.",
  },
  bridge: {
    name: "브리지",
    subtitle: "파트너와 팀을 이뤄 컴퓨터 2명과 대전",
    rules:
      "북쪽 파트너와 팀을 이루어 서쪽, 동쪽 컴퓨터와 대전합니다. 4명이 순서대로 카드를 내며, 같은 무늬가 있으면 반드시 따라야 합니다. 같은 무늬 중 가장 강한 카드나 으뜸패가 가장 강한 카드가 해당 트릭을 가져갑니다. 13트릭이 끝난 후 당신 팀이 7트릭 이상 가져가면 승리합니다.",
  },
  "pick-red-points": {
    name: "레드 포인트 줍기",
    subtitle: "테이블의 같은 숫자 카드 가져가기",
    rules:
      "순서대로 카드 한 장을 냅니다. 낸 카드와 같은 숫자가 테이블에 있으면 모두 가져가 점수를 얻고, 없으면 테이블에 남습니다. 모두 낸 후 빨간 카드(하트, 다이아몬드) 점수를 비교합니다: 일반 카드는 1점, 빨간 10・J・Q・K는 각 10점, 총점이 높은 쪽이 승리합니다.",
  },
  "dou-dizhu": {
    name: "도우디주(지주 싸움)",
    subtitle: "지주가 두 명의 농민과 대전",
    rules:
      "패를 받은 후 패의 세기에 따라 자동으로 지주(당신 또는 컴퓨터)가 정해지며, 지주는 추가로 3장의 패를 받습니다. 나머지 두 명은 농민으로서 함께 지주와 싸웁니다. 앞사람보다 강한 같은 종류의 패를 내거나, 낼 수 없으면 패스합니다. 지주가 먼저 다 내면 지주 승리, 농민 중 한 명이 먼저 다 내면 농민 승리입니다.",
  },
  "penalty-kick": {
    name: "페널티 킥",
    subtitle: "방향을 선택해 골키퍼와 대결",
    rules: "왼쪽, 중앙, 오른쪽 중 하나를 선택해 슛하며, 골키퍼는 무작위로 뛰어듭니다. 방향이 다르면 골, 5라운드 내에 목표 골 수에 도달하면 성공합니다.",
  },
  racing: {
    name: "레이싱 러시",
    subtitle: "차선을 바꿔 마주 오는 차를 피하기",
    rules: "좌우로 차선을 바꿔 마주 오는 차량을 피합니다. 목표 거리에 도달하기 전에 생명이 다하면 실패합니다.",
  },
  parking: {
    name: "주차 챌린지",
    subtitle: "제한 횟수 내에 주차하기",
    rules: "조향과 전진 버튼으로 차량을 조작해, 횟수와 충돌 횟수가 다하기 전에 올바른 방향으로 지정된 주차 공간에 세우면 성공합니다.",
  },
  motocross: {
    name: "모토크로스 점프",
    subtitle: "구덩이를 넘어 결승선까지",
    rules: "탭해서 오토바이를 점프시켜 타이밍 좋게 앞쪽 구덩이를 넘습니다. 결승선에 도착하기 전에 생명이 다하면 실패합니다.",
  },
  "drift-racing": {
    name: "드리프트 레이싱",
    subtitle: "트랙에 맞춰 조향하며 점수 쌓기",
    rules: "트랙의 커브에 맞춰 조향하며 트랙 안에 머물면서 드리프트 점수를 쌓습니다. 결승선까지 목표 점수에 도달하면 성공하며, 오랫동안 트랙을 벗어나면 실패합니다.",
  },
  "liars-cards": {
    name: "라이어 카드게임",
    subtitle: "숫자를 선언하며 뒤집어 내고, 상대의 진위를 가려내기",
    rules:
      "컴퓨터 2명과 순서대로 카드를 냅니다: 1~4장을 뒤집어 내며 숫자를 선언합니다(A→2→3→…→K→A 순서로 순환하며, 정직하게 내거나 거짓을 말할 수 있습니다). 다른 플레이어는 '믿는다'를 선택해 다음으로 넘어가거나, '거짓 적발'을 선택해 뒤집어 확인할 수 있습니다. 적발에 성공하면 낸 사람이 테이블의 모든 카드를 가져가고, 실패하면 적발한 사람이 가져갑니다. 적발되지 않고 먼저 모든 패를 내면 승리합니다.",
  },
  billiards: {
    name: "당구",
    subtitle: "당겨서 조준하고 모든 공을 넣기",
    rules: "조준하려면 수구에서 뒤로 당긴 후 놓아 타격합니다. 샷 횟수가 다하기 전에 모든 색공을 포켓에 넣으면 성공합니다.",
  },
  bowling: {
    name: "볼링",
    subtitle: "3프레임 안에 목표 핀 수 달성",
    rules: "슬라이더를 드래그해 투구 각도를 설정한 후 놓아서 투구합니다. 3프레임 안에 쓰러뜨린 핀 수 목표에 도달하면 성공합니다.",
  },
  "basketball-shoot": {
    name: "농구 슛",
    subtitle: "타이밍을 맞춰 슛하기",
    rules: "파워 게이지가 자동으로 앞뒤로 움직이며, 중앙 근처에서 탭하면 득점합니다. 충분한 골을 넣으면 성공합니다.",
  },
  "five-pk": {
    name: "5카드 포커",
    subtitle: "한 번 교환 후 패를 비교, 더블업 선택 가능",
    rules:
      "베팅 후 5장이 배분됩니다(덱에 조커 2장 포함). 원하는 카드를 남기고 나머지를 한 번만 교환합니다. 패는 강도에 따라 지급됩니다 ― 스트레이트 플러시 500배, 파이브 카드 200배, 플러시 스트레이트 120배, 투페어까지 1배. 승리 후 대소 또는 적흑으로 더블업에 도전하거나 언제든 환전할 수 있습니다.",
  },
  "little-mary": {
    name: "클래식 리틀 메리",
    subtitle: "회전하는 라이트 프레임 ― 대소 카드에 베팅",
    rules:
      "각 기호에 베팅한 후 시작합니다. 라이트 프레임이 빠르게 3바퀴 회전한 후 느려지며 반 바퀴에서 한 바퀴 반 사이에서 멈춥니다 ― 빨리 멈추려면 정지를 탭하세요. 화살표에서 멈추면 패배, 프리 스핀 기호에서 멈추면 추가 스핀을 받습니다. 고정 기호는 정해진 배율을 지급하며, 대소 카드 기호는 베팅했을 경우 현재 배율로 지급됩니다. 충분한 회전 후 더 높은 고정 배당과 전용 사운드가 있는 보너스 라운드가 발생할 수 있습니다.",
  },
  "little-mary-2": {
    name: "클래식 리틀 메리 II",
    subtitle: "스포츠 테마 회전 라이트 프레임",
    rules:
      "클래식 리틀 메리와 같은 회전 방식을 스포츠 테마(축구, 럭비, 농구, 볼링, 테니스, 탁구, 골프)로 재구성했습니다. 각 기호에 베팅한 후 시작합니다 ― 화살표에서 멈추면 패배, 프리 기호는 추가 스핀을 주며, 고정 기호는 정해진 배율을 지급하고, 대소 스포츠 기호는 베팅했을 경우 현재 배율로 지급됩니다. 충분한 회전 후 높은 고정 배당의 보너스 라운드가 발생할 수 있습니다.",
  },
  "little-mary-3": {
    name: "클래식 리틀 메리 III",
    subtitle: "꽃의 신 잭팟 ― 대소에 베팅",
    rules:
      "같은 회전 방식입니다. 세 개의 꽃의 신 조명은 보통 독립적으로 깜박이지만, 충분한 회전 후 반짝이는 경고 상태로 동기화될 수 있습니다. 그 순간 릴이 대소 기호 그룹에서 멈추면 세 기호 모두 현재 배율의 3배를 함께 지급합니다 ― 드문 보너스 잭팟입니다.",
  },
  "little-mary-4": {
    name: "클래식 리틀 메리 IV",
    subtitle: "동물 테마 꽃의 신 잭팟",
    rules:
      "꽃의 신 잭팟 버전과 같은 방식을 동물 테마(호랑이, 용, 원숭이, 여우, 쥐, 수탉, 병아리)로 재구성했습니다. 꽃의 신 잭팟 경고와 3배 지급은 동일하게 작동합니다.",
  },
  "little-mary-5": {
    name: "클래식 리틀 메리 III (불사조)",
    subtitle: "불사조 장식 버전 ― 대소에 베팅",
    rules:
      "같은 회전 방식입니다. 중앙의 큰 불사조는 순전히 장식이며 보너스 경고 중 더 빠르게 깜박입니다. 프리 스핀 기호에서 멈추면 프레임 전체에 장식적인 빛의 궤적이 흐릅니다 ― 시각 효과일 뿐 배당은 변하지 않습니다.",
  },
  "little-mary-6": {
    name: "클래식 리틀 메리 IV (불사조)",
    subtitle: "불사조 장식 버전 ― 음료 테마",
    rules:
      "불사조 장식 버전과 같은 방식을 음료 테마(찻주전자, 꿀, 마테차, 빙수, 맥주, 와인, 칵테일)로 재구성했습니다. 장식적인 불사조와 빛의 궤적 효과는 동일하게 작동합니다.",
  },
  "little-mary-7": {
    name: "미니 리틀 메리 (오션)",
    subtitle: "8×8 미니 프레임 ― 대소에 베팅",
    rules:
      "같은 회전 방식의 더 작은 8×8 라이트 프레임(28칸)을 바다 동물 테마(상어, 고래, 돌고래, 열대어, 게, 조개, 거품)로 재구성했습니다. 화살표에서 멈추면 패배, 프리 기호는 추가 스핀을 주며, 고정 기호는 정해진 배율을 지급하고, 대소 기호는 베팅했을 경우 현재 배율로 지급됩니다. 충분한 회전 후 잭팟 보너스 라운드가 발생할 수 있습니다.",
  },
  "little-mary-8": {
    name: "미니 리틀 메리 (디저트)",
    subtitle: "8×8 미니 프레임 ― 디저트 테마",
    rules:
      "오션 버전과 같은 8×8 미니 프레임 방식을 디저트 테마(케이크, 딸기 케이크, 컵케이크, 도넛, 쿠키, 캔디, 롤리팝)로 재구성했습니다. 충분한 회전 후 전용 사운드와 함께 잭팟 보너스 라운드가 발생할 수 있습니다.",
  },
  "fruit-slot-1": {
    name: "프루트 릴 I",
    subtitle: "클래식 3×3 릴, 5 페이라인",
    rules:
      "5개의 페이라인(상단, 중간, 하단 줄과 두 대각선)을 가진 클래식 3릴 3줄 과일 머신입니다. 라인별로 베팅을 설정한 후 회전하세요 ― 각 릴은 왼쪽부터 오른쪽으로 독립적으로 멈추며, 빨리 멈추려면 정지를 탭할 수 있습니다. 어떤 페이라인에서든 세 개가 일치하면 배당표에 따라 지급되며, 럭키 7은 100배부터 체리는 4배까지입니다. 화면 어디든 체리가 두 개 이상 있으면 소액의 위로 배당을 받습니다. 중간 줄에 7이 세 개 모이면 전용 라이트 쇼와 사운드가 있는 잭팟입니다.",
  },
  "fruit-slot-2": {
    name: "프루트 릴 II",
    subtitle: "열대 과일 테마, 5 페이라인",
    rules:
      "프루트 릴 I과 같은 3릴 5페이라인 방식을 열대 테마로 재구성했습니다 ― 다이아몬드가 럭키 7 대신 잭팟 기호가 되며, 딸기, 파인애플, 바나나, 복숭아, 체리와 함께 등장합니다. 어떤 페이라인에서든 세 개가 일치하면 배당표에 따라 지급되며, 다이아몬드는 100배부터 체리는 4배까지입니다. 중간 줄에 다이아몬드가 세 개 모이면 잭팟입니다.",
  },
  "little-mary-bonus": {
    name: "클래식 리틀 메리 V (럭키 7 보너스)",
    subtitle: "럭키 세븐 보너스 배율 라운드",
    rules:
      "같은 회전 방식이며 동시에 8개 기호에 베팅합니다. 중앙의 숫자 릴 세 개는 보통 완전히 장식적으로 회전하지만, 승리 시 세 릴이 하나씩 멈추는 보너스 라운드가 발생할 기회가 있습니다. 세 개의 같은 홀수에서 멈추면 승리가 10배로 증가하고, 세 개의 짝수에서는 5배가 됩니다 ― 매번 발생하지는 않는 드물고 무작위적인 보너스입니다.",
  },
  "little-mary-bonus-2": {
    name: "클래식 리틀 메리 IV (럭키 7 보너스, 명절)",
    subtitle: "명절 테마 럭키 세븐 보너스",
    rules:
      "럭키 세븐 보너스 버전과 같은 방식을 명절 테마(빨간 봉투, 금괴, 등불, 귤, 월병, 폭죽, 체리)로 재구성했습니다. 보너스 라운드와 10배/5배 숫자 일치 배율은 명절 색상과 사운드 효과로 동일하게 작동합니다.",
  },
  "xiangqi-mahjong": {
    name: "샹치 마작",
    subtitle: "장기 말로 조합을 만들어 컴퓨터와 경쟁",
    rules:
      "베팅 후 당신과 컴퓨터가 각각 5개의 중국 장기 말을 뽑습니다. 자신의 차례에 말 하나를 뽑습니다 ― 쌍과 조합(연속 또는 트리플)을 완성하면 자력으로 승리합니다. 그렇지 않으면 6개의 말 중 하나를 버립니다. 컴퓨터가 버린 말이 당신의 패를 완성하면 가져가 승리하거나 패스하고 계속 뽑을 수 있습니다. 배당: 혼합 쌍-조합은 2배, 같은 종류의 쌍-조합은 3배, 병 또는 졸 다섯 개는 5배입니다. 버린 패를 가져가면 표시된 비율로 지급되며, 자력 성공 시 보너스가 추가됩니다. 승자 없이 패가 다 떨어지면 베팅금이 반환됩니다.",
  },
  tuitongzai: {
    name: "투이퉁자이",
    subtitle: "세 자리에서 동시에 진행하는 마작패 파이 가우",
    rules:
      "1부터 9까지의 원형 마작패(각 4장)와 반점 가치의 무지패(4장)를 사용해 40장의 덱을 구성합니다. 머리, 하늘, 꼬리 자리에 베팅한 후 딜러와 각 자리가 비교를 위해 2장씩 뒤집습니다. 강도 순서: 더블 무지(최강)는 어떤 쌍에도 이기고, 쌍은 2-8 조합에 이기며, 이는 일반 점수 합계에 이깁니다(숫자의 합, 일의 자리 사용, 무지=0.5, 9.5가 최고의 일반 합계, 0이 최저). 각 자리는 딜러와 독립적으로 비교됩니다 ― 승리는 1배, 쌍은 4배, 더블 무지는 10배를 지급합니다. 합계가 같으면 하우스 규칙에 따라 딜러에게 유리하게 처리됩니다.",
  },
}

const vi: GameTable = {
  xiangqi: {
    name: "Cờ Tướng Trung Quốc",
    subtitle: "AI đơn／2 người",
    rules:
      "Hai bên lần lượt di chuyển quân cờ, ai dồn được Tướng đối phương vào đường cùng trước sẽ thắng. Theo luật cờ tướng truyền thống: Xe đi thẳng, Mã đi chữ L, Tượng đi chéo trong phần sân nhà, Sĩ đi chéo quanh cung, Binh sau khi qua sông có thể đi ngang.",
  },
  "darkchess-classic": {
    name: "Cờ Úp (Cổ điển)",
    subtitle: "AI đơn／2 người",
    rules: "Tất cả quân cờ đặt mặt úp xuống, sau khi lật lên sẽ ăn quân theo thứ tự cấp bậc truyền thống. Ăn hết quân đối phương hoặc khiến đối phương không còn nước đi sẽ thắng.",
  },
  "darkchess-variant": {
    name: "Cờ Úp (Biến thể)",
    subtitle: "AI đơn／2 người",
    rules: "Giống cờ Úp cổ điển nhưng cách Pháo tấn công và nhảy ăn quân áp dụng quy tắc biến thể, mang lại nhiều chiến thuật mới.",
  },
  go: {
    name: "Cờ Vây",
    subtitle: "19×19",
    rules: "Hai bên lần lượt đặt quân đen trắng tại các giao điểm trên bàn 19×19, ai chiếm được nhiều lãnh địa hơn sẽ thắng; quân bị bao vây hoàn toàn và hết khí sẽ bị bắt.",
  },
  gomoku: { name: "Cờ Caro", subtitle: "17×17", rules: "Hai bên lần lượt đặt quân, ai nối được năm quân liên tiếp theo hàng ngang, hàng dọc hoặc đường chéo trước sẽ thắng." },
  othello: {
    name: "Cờ Lật (Othello)",
    subtitle: "Tiêu chuẩn",
    rules: "Hai bên lần lượt đặt quân, kẹp quân đối phương giữa hai quân của mình để lật thành màu của mình. Kết thúc ai có nhiều quân hơn sẽ thắng.",
  },
  mahjong: {
    name: "Mạt Chược Trung Quốc",
    subtitle: "AI đơn (3 đối thủ máy)",
    rules: "Chơi cùng bàn với 3 đối thủ máy, lần lượt rút và đánh bài, có thể Ăn／Bắt Cạ／Bắt Khàn bài đối thủ đánh ra. Ai hoàn thành bộ bài thắng hợp lệ trước sẽ thắng.",
  },
  luzhanqi: {
    name: "Cờ Lục Quân",
    subtitle: "AI đơn／2 người",
    rules: "Cấp bậc quân cờ hai bên được giữ bí mật, đối phương chỉ thấy mặt sau. Khi giao chiến, cấp bậc cao hơn sẽ thắng; ai chiếm được cờ hiệu đối phương hoặc khiến đối phương hết nước đi trước sẽ thắng.",
  },
  checkers: {
    name: "Cờ Đam",
    subtitle: "Tiêu chuẩn",
    rules: "Hai bên lần lượt di chuyển quân theo đường chéo, có thể nhảy qua để ăn quân đối phương. Ăn hết quân đối phương hoặc khiến đối phương hết nước đi sẽ thắng.",
  },
  tictactoe: {
    name: "Cờ Caro 3x3",
    subtitle: "Bản mở rộng 3×3",
    rules: "Hai bên lần lượt đặt ký hiệu, ai nối được ba ký hiệu liên tiếp theo hàng ngang, hàng dọc hoặc đường chéo trước sẽ thắng.",
  },
  chess: {
    name: "Cờ Vua",
    subtitle: "AI đơn／2 người",
    rules:
      "Hai bên lần lượt di chuyển quân cờ, ai chiếu hết Vua đối phương trước sẽ thắng. Theo luật cờ vua tiêu chuẩn về cách di chuyển của Tốt, Xe, Mã, Tượng, Hậu và Vua.",
  },
  connect4: {
    name: "Cờ Nối Bốn",
    subtitle: "AI đơn／2 người",
    rules: "Lần lượt thả quân vào khung đứng. Ai nối được bốn quân liên tiếp theo hàng ngang, hàng dọc hoặc đường chéo trước sẽ thắng.",
  },
  "chinese-checkers": {
    name: "Cờ Nhảy (Sao 6 Cánh)",
    subtitle: "Bàn cờ hình sao",
    rules: "Trên bàn cờ hình sao sáu cánh, ai di chuyển hết quân của mình vào góc đối diện trước sẽ thắng. Quân có thể bước hoặc nhảy liên tiếp qua quân khác để tiến nhanh.",
  },
  jigsaw: {
    name: "Ghép Hình Trượt",
    subtitle: "Ô số",
    rules: "Chạm vào ô cạnh khoảng trống để trượt nó vào. Xếp các ô theo thứ tự từ 1 đến 15 để hoàn thành.",
  },
  "number-merge": {
    name: "Ghép Số",
    subtitle: "Kiểu 2048",
    rules: "Vuốt hoặc dùng phím mũi tên. Các ô cùng số va vào nhau sẽ hợp nhất và nhân đôi giá trị; đạt 2048 để thắng.",
  },
  "memory-match": {
    name: "Lật Hình Ghi Nhớ",
    subtitle: "Thử thách ghi nhớ",
    rules: "Lật hai lá bài mỗi lần; cặp giống nhau sẽ được giữ mở. Ghép hết mọi cặp với số lần lật ít nhất có thể để thắng.",
  },
  ludo: {
    name: "Cờ Cá Ngựa",
    subtitle: "2 người chơi",
    rules: "Gieo xúc xắc để di chuyển quân vòng quanh bàn cờ về nhà. Đáp lên quân đối phương sẽ đẩy quân đó về vị trí xuất phát.",
  },
  solitaire: {
    name: "Giải Trí Một Mình",
    subtitle: "Cổ điển một người chơi",
    rules: "Xếp mọi lá bài vào bốn chồng nền theo chất và cấp số tăng dần để dọn sạch bàn và thắng.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Cờ số rum vs AI",
    rules: "Dùng các ô số của bạn để tạo thành dãy liên tiếp hoặc bộ cùng số rồi đặt lên bàn. Ai đánh hết ô số trước sẽ thắng.",
  },
  "rps-battle": {
    name: "Búa Kéo Bao",
    subtitle: "Đối đầu AI",
    rules: "Ra búa, kéo hoặc bao cùng lúc với máy. Ai thắng nhiều vòng hơn sẽ giành chiến thắng chung.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "Đối đầu 1v1 với AI (Rút gọn)",
    rules:
      "Bạn và AI mỗi người giữ 2 lá bài riêng, cộng với 5 lá bài chung. Chọn Theo để lật bài so sánh, hoặc Bỏ để nhường phần cược — bài mạnh hơn thắng toàn bộ tiền cược.",
  },
  war: {
    name: "Chiến Tranh (War)",
    subtitle: "So lá cao vs AI",
    rules:
      "Bộ bài chia đều hai bên. Mỗi vòng cả hai lật một lá — lá cao hơn thắng vòng đó. Hòa sẽ dẫn đến so bài tiếp; ai còn nhiều bài hơn ở cuối sẽ thắng.",
  },
  "three-card-poker": {
    name: "Poker 3 Lá",
    subtitle: "Đối đầu nhà cái",
    rules:
      "Bạn và nhà cái mỗi bên được chia 3 lá. Sau khi xem bài, chọn Theo để lật so sánh, hoặc Bỏ để nhường vòng — bài có thứ hạng cao hơn thắng.",
  },
  klotski: {
    name: "Hoa Dung Đạo",
    subtitle: "Trò chơi trượt khối",
    rules: "Trượt các khối có kích thước khác nhau trong không gian hạn chế của bàn cờ. Di chuyển khối lớn nhất ra cửa thoát ở dưới để thắng.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Xếp khối & xóa hàng",
    rules:
      "Vuốt trái hoặc phải để di chuyển khối đang rơi, chạm để xoay, vuốt xuống để rơi nhanh. Lấp đầy một hàng để xóa và tính điểm; trò chơi kết thúc nếu khối chồng lên đến đỉnh.",
  },
  "bubble-shooter": {
    name: "Bắn Bóng Màu",
    subtitle: "Ghép màu để xóa",
    rules: "Chạm vào một hướng để bắn bóng hiện tại. Ba bóng cùng màu trở lên nối liền sẽ bị xóa tính điểm; trò chơi kết thúc nếu bóng chạm đỉnh.",
  },
  match3: {
    name: "Nổ Ba Kẹo",
    subtitle: "Đổi để ghép",
    rules:
      "Chạm vào một ô, rồi chạm ô liền kề để đổi chỗ. Ghép 3 ô cùng màu trở lên để xóa và đổ đầy từ trên xuống, có thể tạo phản ứng dây chuyền.",
  },
  hanoi: {
    name: "Tháp Hà Nội",
    subtitle: "Di chuyển các đĩa",
    rules:
      "Chạm vào một cột để lấy đĩa trên cùng, rồi chạm cột khác để chuyển đĩa sang. Đĩa lớn không được đặt lên đĩa nhỏ — chuyển toàn bộ chồng đĩa sang cột bên phải nhất để thắng.",
  },
  "water-sort": {
    name: "Xếp Màu Nước",
    subtitle: "Đổ để phân loại màu",
    rules:
      "Chạm vào một ống để lấy màu trên cùng, rồi chạm ống khác để đổ vào — chỉ đổ được vào ống trống hoặc ống có cùng màu trên cùng. Xếp mỗi ống thành một màu duy nhất để thắng.",
  },
  "pipe-connect": {
    name: "Nối Ống Nước",
    subtitle: "Xoay để kết nối",
    rules: "Chạm vào một ống để xoay 90°. Kết nối nguồn nước ở góc trên trái đến lối ra ở góc dưới phải để thắng.",
  },
  "stack-tower": {
    name: "Xếp Tháp",
    subtitle: "Bắt đúng thời điểm",
    rules:
      "Khối phía trên lắc qua lắc lại tự động; chạm để thả nó xuống chồng khối dưới. Càng chồng khớp, khối sẽ càng hẹp — lệch hoàn toàn khỏi chồng sẽ kết thúc trò chơi.",
  },
  "sequence-sort": {
    name: "Sắp Xếp Số",
    subtitle: "Đổi để sắp thứ tự",
    rules: "Chạm hai ô số để đổi vị trí của chúng. Xếp mọi số từ nhỏ đến lớn với số lần đổi ít nhất có thể để thắng.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Lưới 6×6",
    rules:
      "Mỗi hàng, cột và ô 2×3 phải chứa các số từ 1 đến 6 không trùng lặp. Điền đầy toàn bộ lưới không mâu thuẫn để thắng.",
  },
  "shooting-range": {
    name: "Bắn Mục Tiêu",
    subtitle: "Phản xạ nhanh",
    rules: "Mục tiêu sáng lên ngẫu nhiên trên lưới — chạm nhanh nhất có thể để tính điểm. Đạt điểm mục tiêu trước khi hết giờ để thắng.",
  },
  "space-invaders": {
    name: "Xâm Lược Không Gian",
    subtitle: "Tiêu diệt toàn bộ hạm đội để thắng",
    rules:
      "Di chuyển trái phải để tránh đạn địch và bắn hạ toàn bộ hạm đội ngoài hành tinh. Thất bại nếu hạm đội áp sát hoặc hết mạng.",
  },
  "tank-battle": {
    name: "Đại Chiến Xe Tăng",
    subtitle: "Ai đạt 3 lần trúng đích trước sẽ thắng",
    rules: "Di chuyển xe tăng trái phải và bắn đạn pháo. Trúng vào làn đối phương được tính điểm — ai đạt 3 lần trúng trước sẽ thắng.",
  },
  "brick-breaker": {
    name: "Phá Gạch",
    subtitle: "Phá hết mọi viên gạch để thắng",
    rules:
      "Kéo thanh đỡ trái phải để bật bóng và phá vỡ hết gạch để thắng. Để bóng rơi khỏi đáy sẽ mất một mạng; thất bại nếu hết mạng.",
  },
  "zombie-defense": {
    name: "Phòng Thủ Zombie",
    subtitle: "Sống sót qua mọi đợt để thắng",
    rules:
      "Zombie tiến vào từ bên phải theo làn; chạm để tiêu diệt (một số cần hai lần chạm). Để zombie chạm mép trái sẽ mất máu — sống sót qua mọi đợt để thắng.",
  },
  "air-combat": {
    name: "Không Chiến",
    subtitle: "Sống sót và đạt điểm mục tiêu",
    rules:
      "Máy bay của bạn tự động bắn; di chuyển trái phải để tránh máy bay địch và tiêu diệt chúng. Sống sót trong giới hạn thời gian và đạt điểm mục tiêu để thắng; hết mạng sẽ thất bại.",
  },
  billiards: {
    name: "Billiards (Bi-a)",
    subtitle: "Kéo để ngắm, dọn hết bóng",
    rules:
      "Kéo lùi từ bóng cái để ngắm, rồi thả để đánh. Đưa hết mọi bóng màu vào lỗ trước khi hết lượt đánh để thắng.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Đạt điểm mục tiêu trong 3 lượt",
    rules: "Kéo thanh trượt để chọn góc ném, rồi thả để ném bóng. Đạt tổng số ghim đổ mục tiêu trong 3 lượt để thắng.",
  },
  "basketball-shoot": {
    name: "Ném Bóng Rổ",
    subtitle: "Bắt đúng thời điểm",
    rules: "Thanh lực tự động lắc qua lại — chạm để ném khi gần vị trí trung tâm để vào bóng. Ném đủ số lần thành công để thắng.",
  },
  "penalty-kick": {
    name: "Đá Phạt Luân Lưu",
    subtitle: "Chọn hướng đối đầu thủ môn",
    rules: "Chọn trái, giữa hoặc phải để sút trước thủ môn bay người ngẫu nhiên. Ghi đủ số bàn trong 5 lượt để thắng.",
  },
  racing: {
    name: "Đua Xe Tốc Độ",
    subtitle: "Đổi làn để tránh xe cộ",
    rules: "Đổi làn trái phải để tránh xe cộ ngược chiều. Thất bại nếu hết mạng trước khi đạt khoảng cách đích.",
  },
  parking: {
    name: "Thử Thách Đỗ Xe",
    subtitle: "Đỗ xe trong số lượt cho phép",
    rules: "Dùng điều khiển lái và tiến để đỗ chính xác vào ô đã đánh dấu trước khi hết lượt hoặc va chạm để thắng.",
  },
  motocross: {
    name: "Nhảy Xe Motocross",
    subtitle: "Vượt hố đến đích",
    rules: "Chạm để cho xe nhảy và vượt qua các hố phía trước với thời điểm chính xác. Thất bại nếu hết mạng trước khi đến đích.",
  },
  "drift-racing": {
    name: "Đua Xe Drift",
    subtitle: "Lái theo đường đua để tính điểm",
    rules: "Lái theo các đoạn cong của đường đua để giữ trên đường đồng thời tích điểm drift. Đến đích với đủ điểm để thắng.",
  },
  "duel-arena": {
    name: "Đấu Trường Đối Kháng",
    subtitle: "Theo lượt, hạ knock-out trước sẽ thắng",
    rules:
      "Chọn Tấn công để tích thanh năng lượng đặc biệt, Phòng thủ để giảm nửa sát thương lượt sau, hoặc dùng Chiêu kết liễu khi thanh năng lượng đầy. Ai đưa máu đối phương về 0 trước sẽ thắng.",
  },
  sevens: {
    name: "Xì Bảy (Sevens)",
    subtitle: "4 người chơi rum — ai còn điểm phạt thấp nhất thắng",
    rules:
      "Bắt đầu từ lá 7, lần lượt đánh các lá liền kề cấp số ngay cạnh. Không đánh được thì úp bài chịu phạt. Khi có người hết bài, ai có tổng điểm phạt thấp nhất thắng.",
  },
  "sichuan-mahjong": {
    name: "Mạt Chược Tứ Xuyên (Huyết Chiến)",
    subtitle: "Thiếu một chất khi vào bàn, thắng vẫn tiếp tục chơi",
    rules:
      "Chỉ dùng Văn, Sách, Vạn và phải thiếu một chất ngay từ đầu. Người Hồ bài sẽ rời bàn, những người còn lại tiếp tục chơi đến khi có 3 người Hồ hoặc hết bài.",
  },
  "malaysia-mahjong": {
    name: "Mạt Chược Malaysia 3 Người",
    subtitle: "3 người chơi, lá Hoang giúp bài lớn thường xuyên hơn",
    rules:
      "Chơi với 3 người, bộ bài rút gọn gồm Văn, lá Phong/Tiên và lá Hoang. Bộ bài nhỏ cùng lá Hoang khiến bài thắng lớn xuất hiện thường xuyên hơn.",
  },
  "mahjong-pengpeng": {
    name: "Mạt Chược Bằng Bằng",
    subtitle: "Mạt chược đơn giản, chỉ Bằng — không Ăn",
    rules: "Bộ bài đơn giản không được Ăn, chỉ Bằng hoặc tự rút. Tạo hai bộ ba giống nhau cùng một đôi để thắng.",
  },
  "mahjong-sevens": {
    name: "Xì Bảy Mạt Chược",
    subtitle: "Giống Xì Bảy, dùng chất Văn/Sách/Vạn",
    rules: "Bắt đầu từ lá 5 của mỗi chất, lần lượt đánh các số liền kề ngay cạnh. Không đánh được thì úp bài chịu phạt.",
  },
  "riichi-mahjong": {
    name: "Mạt Chược Lập Trực Nhật",
    subtitle: "Vòng Đông — Lập trực, Dora và Furiten",
    rules:
      "Khi bài kín đã chờ ăn, hô Lập trực để đặt cược. Lá Dora lộ ra cho thêm Han thưởng. Furiten ngăn bạn Hồ từ lá đã từng bỏ qua. Bài cần ít nhất một Yaku mới được Hồ.",
  },
  "mahjong-solitaire": {
    name: "Mạt Chược Ghép Đôi",
    subtitle: "Ghép cặp bài giống nhau với đường nối tối đa 2 lần rẽ",
    rules: "Tìm hai lá bài giống nhau mà đường nối giữa chúng rẽ không quá hai lần để xóa chúng. Xóa hết bàn trước khi hết giờ để thắng.",
  },
  "merge-2048": {
    name: "Hợp Nhất 2048",
    subtitle: "Vuốt để hợp nhất số, hướng tới 2048",
    rules: "Vuốt theo bất kỳ hướng nào — các ô cùng số va vào nhau sẽ hợp nhất và nhân đôi giá trị. Đạt 2048 để thắng.",
  },
  "city-2048": {
    name: "Thành Phố 2048",
    subtitle: "Hợp nhất công trình từ bãi cỏ đến tòa cao tầng",
    rules: "Quy tắc giống 2048 nhưng các ô là biểu tượng công trình — hợp nhất dần từ bãi cỏ lên đến tòa cao tầng.",
  },
  "merge-2048-undo": {
    name: "2048 Hoàn Tác",
    subtitle: "Giống 2048, có thêm nút hoàn tác",
    rules: "Quy tắc giống 2048, nhưng bạn có thể hoàn tác một lượt vuốt nếu đi sai.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Hợp nhất công trình — cẩn thận gấu đi lang thang",
    rules:
      "Trên bàn 6×6, ba vật giống nhau hợp nhất thành cấp cao hơn. Gấu đi lang thang chiếm chỗ — bao vây hoàn toàn một con gấu để biến nó thành bia mộ, cũng có thể hợp nhất được.",
  },
  suika: {
    name: "Hợp Trái Cây Suika",
    subtitle: "Di chuyển trái/phải và thả trái cây — trái cây giống nhau hợp nhất lớn hơn",
    rules: "Di chuyển trái phải để chọn nơi trái cây rơi xuống. Trái cây giống nhau hợp nhất thành cỡ lớn hơn — cố gắng tạo ra quả dưa hấu khổng lồ.",
  },
  "drop-2048": {
    name: "2048 Rơi",
    subtitle: "Khối số rơi xuống chồng lên và hợp nhất",
    rules: "Khối số rơi từ trên xuống; di chuyển trái phải để chọn cột. Các số giống nhau hợp nhất và nhân đôi khi chồng lên nhau.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Cặp rơi xuống — xóa khi có 4+ màu giống nhau nối liền",
    rules:
      "Cặp khối màu rơi từ trên xuống; di chuyển và xoay chúng. Nối 4 khối cùng màu trở lên để xóa, có thể gây phản ứng dây chuyền.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Chồng viên thuốc rơi xuống để xóa virus theo hàng",
    rules: "Viên thuốc hai màu rơi xuống và chồng lên; xếp 4 khối cùng màu bao gồm virus thành một hàng để xóa. Xóa hết virus để thắng.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Chuyển đổi giữa hai trò chơi khối rơi kinh điển",
    rules: "Chuyển đổi giữa Columns (ghép 3+ viên đá quý thành hàng) và Tetris (xóa hàng đầy) trên cùng một màn hình.",
  },
  "candy-crush": {
    name: "Candy Crush",
    subtitle: "Đổi kẹo để tạo 3 hàng liên tiếp, đạt điểm mục tiêu",
    rules:
      "Đổi vị trí kẹo liền kề để tạo chuỗi 3 hoặc nhiều hơn. Kẹo đặc biệt từ chuỗi lớn hơn xóa cả hàng hoặc cả màu — đạt điểm mục tiêu trong số lượt giới hạn để thắng.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Game ghép 3 nguyên bản — đổi đá quý để xóa hàng",
    rules: "Đổi đá quý liền kề để tạo hàng 3 viên giống nhau trở lên. Nối chuỗi combo để có thêm điểm khi chinh phục điểm cao mới.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Ghép 3 lấy xu để phục hồi khu vườn hoang tàn",
    rules: "Xóa các chuỗi ghép để kiếm xu, sau đó dùng xu để hoàn thành nhiệm vụ phục hồi khu vườn.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Ghép 3 lấy xu để trang trí biệt thự mơ ước",
    rules: "Xóa các chuỗi ghép để kiếm xu, sau đó dùng xu để hoàn thành nhiệm vụ trang trí biệt thự.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Ghép 3 lấy xu để phục hồi lâu đài cổ",
    rules: "Xóa các chuỗi ghép để kiếm xu, sau đó dùng xu để hoàn thành nhiệm vụ phục hồi lâu đài.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Ghép đá quý + xây dựng đội hình chiến đấu bằng thẻ bài",
    rules: "Ghép đá quý sẽ kích hoạt đòn tấn công từ đồng minh cùng nguyên tố. Đánh bại kẻ địch để đội hình lên cấp và tiến xa hơn.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Ghép đá quý + chiến đấu khắc chế nguyên tố",
    rules: "Ghép đá quý sẽ kích hoạt tấn công; sử dụng ưu thế khắc chế nguyên tố để gây thêm sát thương và đánh bại kẻ địch.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Ghép đá quý + xây dựng thành phố nhẹ và PvP",
    rules: "Ghép đá quý kích hoạt tấn công của anh hùng; đánh bại đối thủ để nhận vật liệu xây dựng và phát triển đế chế.",
  },
  "sheep-sheep": {
    name: "Cừu Ghép Cừu",
    subtitle: "Thu thập ô từ chồng bài, xóa bộ 3",
    rules:
      "Chạm vào bất kỳ ô không bị che để đưa vào ô thu thập. Ba ô giống nhau sẽ tự động xóa — nếu ô thu thập đầy mà chưa đủ bộ ba, bạn thua.",
  },
  match3d: {
    name: "Ghép 3D",
    subtitle: "Thu thập từ chồng vật thể 3D để ghép 3",
    rules: "Giống ý tưởng của Cừu Ghép Cừu, nhưng các ô là chồng vật thể 3D — tìm và thu thập đủ bộ ba giống nhau.",
  },
  "balls-merge": {
    name: "Hợp Nhất Bóng",
    subtitle: "Di chuyển và thả xuống — bóng giống nhau hợp nhất lớn hơn",
    rules: "Cùng cơ chế với Hợp Trái Cây Suika, chủ đề bóng — bóng giống nhau hợp nhất thành cỡ lớn hơn.",
  },
  "cookies-merge": {
    name: "Hợp Nhất Bánh Quy",
    subtitle: "Di chuyển và thả xuống — bánh quy giống nhau hợp nhất lớn hơn",
    rules: "Cùng cơ chế với Hợp Trái Cây Suika, chủ đề bánh quy — bánh quy giống nhau hợp nhất thành cỡ lớn hơn.",
  },
  "planets-merge": {
    name: "Hợp Nhất Hành Tinh",
    subtitle: "Di chuyển và thả xuống — hành tinh giống nhau hợp nhất lớn hơn",
    rules: "Cùng cơ chế với Hợp Trái Cây Suika, chủ đề hành tinh — hành tinh giống nhau hợp nhất thành cỡ lớn hơn.",
  },
  "mahjong-ninepoint5": {
    name: "Mạt Chược Cửu Điểm Rưỡi",
    subtitle: "Dùng lá mạt chược thay bài, gần 9.5 nhất thắng",
    rules: "Chơi Cửu Điểm Rưỡi (kiểu Blackjack) bằng lá mạt chược thay cho bài Tây. Rút thêm hoặc dừng — ai gần 9.5 nhất mà không vượt quá sẽ thắng.",
  },
  "mahjong-niuniu": {
    name: "Mạt Chược Ngưu Ngưu",
    subtitle: "Dùng lá mạt chược thay bài, ghép bộ 3 chia hết cho 10",
    rules:
      "Chơi Ngưu Ngưu bằng lá mạt chược thay cho bài Tây. Từ 5 lá, tìm 3 lá có tổng là số chia hết cho 10, rồi so điểm 2 lá còn lại.",
  },
  "dragon-gate": {
    name: "Xạ Long Môn",
    subtitle: "Dùng hai lá Văn mạt chược mở cổng, cược vào khoảng giữa",
    rules: "Hai lá Văn mở cổng, đặt cược rồi rút lá thứ ba. Rơi vào giữa cổng thắng, ngoài cổng thua, trùng số với cột thì thua gấp đôi.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Đấu 21 điểm với nhà cái",
    rules:
      "Cố gắng đạt gần 21 điểm nhất mà không vượt quá. Át tính 1 hoặc 11, các lá hình tính 10. Chọn Rút hoặc Dừng — nhà cái phải tiếp tục rút đến khi đạt 17 điểm trở lên.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Đặt cược vào Player, Banker hoặc Tie trước khi chia bài. Tổng điểm lấy chữ số cuối, bên có tổng lớn hơn thắng. Lá bài bổ sung được rút tự động theo quy tắc baccarat tiêu chuẩn.",
  },
  "ten-half": {
    name: "Thập Điểm Bán",
    subtitle: "Gần 10.5 hơn nhà cái",
    rules:
      "Đặt cược, mỗi bên được chia 2 lá. Chọn Rút hoặc Dừng, ai gần 10.5 hơn mà không vượt quá sẽ thắng. Át tính 1 điểm, lá hình tính 0.5 điểm. Đạt đúng 10.5 ngay khi chia trả 3 lần, thắng thường trả 2 lần, hòa trả lại tiền cược.",
  },
  "thirteen-water": {
    name: "Thập Tam Thủy",
    subtitle: "Chia 13 lá thành 3 bộ đấu với nhà cái",
    rules:
      "Đặt cược và chia bài, hệ thống tự động chia 13 lá thành bộ đầu 3 lá, bộ giữa 5 lá, bộ cuối 5 lá để so sánh riêng. Thắng cả 3 bộ trả 5 lần, thắng 2 bộ trả 2 lần, thắng 1 bộ trả 1.5 lần, hòa thì hoàn tiền cược, thua nhiều hơn thắng thì mất tiền cược.",
  },
  "big-two": {
    name: "Tiến Lên (Big Two)",
    subtitle: "Đánh lá đơn hoặc đôi để hết bài trước",
    rules:
      "Đặt cược và đấu với nhà cái. Đánh lá đơn hoặc đôi cùng số mạnh hơn lượt trước, hoặc bỏ lượt. Thứ tự từ 3 nhỏ nhất đến 2 lớn nhất, hòa thì so chất. Hết 13 lá trước thắng gấp 2 lần tiền cược.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "So bài 5 lá trực tiếp với nhà cái",
    rules:
      "Đặt cược, bạn và nhà cái mỗi bên được chia 5 lá và so trực tiếp thứ hạng bài — sảnh đồng hoa, tứ quý, cù lũ, đồng hoa, sảnh, ba lá, hai đôi, một đôi, bài cao. Bên mạnh hơn thắng gấp 2 lần, hòa trả lại tiền cược.",
  },
  niuniu: {
    name: "Niu Niu (Bò)",
    subtitle: "Ghép 10 từ 5 lá để lấy điểm bò cao nhất",
    rules:
      "Đặt cược, bạn và nhà cái mỗi bên được chia 5 lá. Chọn 3 lá tổng là số chia hết cho 10 (gọi là 'bò'), 2 lá còn lại lấy chữ số cuối làm điểm, càng cao càng tốt. Đúng 10 là 'bò bò' cao nhất, không ghép được là 'vô bò' thấp nhất. Điểm cao hơn thắng gấp 2 lần, hòa trả lại tiền cược. Lá hình tính 10 điểm, Át tính 1 điểm.",
  },
  "zha-jinhua": {
    name: "Xì Dách Ba Lá",
    subtitle: "So bài 3 lá trực tiếp với nhà cái",
    rules:
      "Đặt cược, bạn và nhà cái mỗi bên được chia 3 lá và so trực tiếp thứ hạng — ba lá cùng số, sảnh đồng hoa, đồng hoa, sảnh, đôi, bài cao. Bên mạnh hơn thắng gấp 2 lần, hòa trả lại tiền cược.",
  },
  "seven-pk": {
    name: "7 Lá Stud",
    subtitle: "Chia bài 4 vòng — bỏ hoặc gấp đôi cược ở mỗi vòng",
    rules:
      "Đặt cược khởi điểm. Bài được chia qua 4 vòng (3 lá, rồi 2 lá, rồi 1 lá, rồi 2 lá cuối lật ra), sau mỗi vòng có thể bỏ bài hoặc gấp đôi cược. Bộ 5 lá mạnh nhất trong 7 lá quyết định kết quả. Bỏ bài mất toàn bộ tiền cược hiện tại; thắng trả theo thứ hạng bài, từ sảnh cơ hoàng gia 150 lần đến hai đôi 1 lần.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Hợp tác với đồng đội, đấu với 2 máy",
    rules:
      "Hợp tác với đối tác ở hướng Bắc để đấu với hai máy ở hướng Tây và Đông. Bốn người lần lượt đánh bài theo thứ tự, phải theo chất nếu có. Lá mạnh nhất cùng chất hoặc lá chủ sẽ thắng ván đó. Sau 13 ván, đội của bạn thắng nếu giành được từ 7 ván trở lên.",
  },
  "pick-red-points": {
    name: "Nhặt Điểm Đỏ",
    subtitle: "Lấy lá bài trên bàn có cùng số",
    rules:
      "Lần lượt đánh một lá bài: nếu số trùng với lá trên bàn, bạn lấy hết các lá cùng số đó cùng lá vừa đánh để ghi điểm; nếu không trùng, lá đó ở lại trên bàn. Khi hết bài, đếm điểm các lá đỏ (Cơ và Rô) đã lấy được của mỗi bên — lá đỏ thường tính 1 điểm, lá 10/J/Q/K đỏ tính 10 điểm mỗi lá. Bên có điểm cao hơn thắng.",
  },
  "dou-dizhu": {
    name: "Đấu Địa Chủ",
    subtitle: "Địa chủ đấu với hai nông dân",
    rules:
      "Sau khi chia bài, hệ thống tự động chọn một bên (bạn hoặc máy) làm 'địa chủ' dựa trên độ mạnh của bài — địa chủ nhận thêm 3 lá bài úp, hai bên còn lại là nông dân hợp sức chống lại địa chủ. Lần lượt đánh tổ hợp mạnh hơn lượt trước, hoặc bỏ lượt. Địa chủ đánh hết bài trước thì địa chủ thắng; bất kỳ nông dân nào đánh hết bài trước thì phe nông dân thắng.",
  },
  "liars-cards": {
    name: "Bài Nói Dối",
    subtitle: "Úp bài, khai số, bắt lời nói dối",
    rules:
      "Bạn và hai đối thủ máy lần lượt úp 1-4 lá bài và khai một số (số phải theo thứ tự A→2→3→...→K→A, có thể nói thật hoặc nói dối). Người khác có thể 'tin' để tiếp tục, hoặc 'tố cáo' để lật bài kiểm tra — nếu tố cáo đúng, người đánh bài phải nhận hết chồng bài; nếu tố cáo sai, người tố cáo nhận hết. Ai hết bài trước mà không bị bắt sẽ thắng.",
  },
  "five-pk": {
    name: "Poker 5 Lá",
    subtitle: "Đổi bài một lần, so bài hoặc nhân đôi cược",
    rules:
      "Đặt cược, sau đó được chia 5 lá (bộ bài có 2 lá Joker). Giữ lại các lá muốn giữ và đổi phần còn lại một lần duy nhất. Bài trả thưởng theo thứ hạng — sảnh đồng hoa trả 500 lần, ngũ quý trả 200 lần, sảnh đồng hoa đặc biệt trả 120 lần, đến hai đôi trả 1 lần. Sau khi thắng, bạn có thể chọn nhân đôi cược theo lớn/nhỏ hoặc đỏ/đen, hoặc rút tiền bất cứ lúc nào.",
  },
  "little-mary": {
    name: "Little Mary Cổ Điển",
    subtitle: "Khung đèn xoay — Cược vào lá bài lớn hoặc nhỏ",
    rules:
      "Đặt cược vào từng biểu tượng rồi bắt đầu. Khung đèn xoay nhanh 3 vòng rồi chậm dần và dừng trong khoảng từ nửa vòng đến một vòng rưỡi — chạm Dừng để kết thúc sớm. Dừng ở mũi tên là thua; dừng ở biểu tượng quay miễn phí sẽ được quay thêm; biểu tượng cố định trả theo hệ số cố định; biểu tượng lá bài lớn hoặc nhỏ trả theo hệ số hiện tại nếu có đặt cược. Sau đủ số vòng quay, có thể kích hoạt vòng thưởng với mức trả cố định cao hơn và âm thanh riêng.",
  },
  "little-mary-2": {
    name: "Little Mary Cổ Điển II",
    subtitle: "Khung đèn xoay chủ đề thể thao",
    rules:
      "Cơ chế xoay giống Little Mary Cổ Điển, chuyển sang chủ đề thể thao (bóng đá, bóng bầu dục, bóng rổ, bowling, tennis, bóng bàn, golf). Đặt cược vào từng biểu tượng rồi bắt đầu — dừng ở mũi tên là thua, biểu tượng miễn phí cho quay thêm, biểu tượng cố định trả hệ số cố định, biểu tượng thể thao lớn hoặc nhỏ trả theo hệ số hiện tại nếu có đặt cược. Sau đủ số vòng quay có thể kích hoạt vòng thưởng trả cao.",
  },
  "little-mary-3": {
    name: "Little Mary Cổ Điển III",
    subtitle: "Jackpot Thần Hoa — Cược vào lớn hoặc nhỏ",
    rules:
      "Cơ chế xoay giống nhau. Ba đèn Thần Hoa thường nhấp nháy độc lập; sau đủ số vòng quay chúng có thể đồng bộ vào trạng thái cảnh báo nhấp nháy. Nếu lúc đó bánh xe dừng ở nhóm biểu tượng lớn hoặc nhỏ, cả ba biểu tượng sẽ cùng trả gấp 3 lần hệ số hiện tại — một jackpot thưởng hiếm gặp.",
  },
  "little-mary-4": {
    name: "Little Mary Cổ Điển IV",
    subtitle: "Jackpot Thần Hoa chủ đề động vật",
    rules:
      "Cơ chế giống phiên bản Jackpot Thần Hoa, chuyển sang chủ đề động vật (hổ, rồng, khỉ, cáo, chuột, gà trống, gà con). Cảnh báo jackpot Thần Hoa và mức trả gấp 3 lần hoạt động tương tự.",
  },
  "little-mary-5": {
    name: "Little Mary Cổ Điển III (Phượng Hoàng)",
    subtitle: "Phiên bản trang trí Phượng Hoàng — Cược vào lớn hoặc nhỏ",
    rules:
      "Cơ chế xoay giống nhau. Phượng Hoàng lớn ở giữa hoàn toàn mang tính trang trí, nhấp nháy nhanh hơn khi có cảnh báo thưởng. Dừng ở bất kỳ biểu tượng quay miễn phí nào sẽ tạo vệt sáng trang trí lan khắp khung — chỉ là hiệu ứng hình ảnh, không thay đổi mức trả.",
  },
  "little-mary-6": {
    name: "Little Mary Cổ Điển IV (Phượng Hoàng)",
    subtitle: "Phiên bản trang trí Phượng Hoàng — chủ đề đồ uống",
    rules:
      "Cơ chế giống phiên bản trang trí Phượng Hoàng, chuyển sang chủ đề đồ uống (ấm trà, mật ong, trà mate, đá bào, bia, rượu vang, cocktail). Hiệu ứng Phượng Hoàng trang trí và vệt sáng hoạt động tương tự.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Đại Dương)",
    subtitle: "Khung mini 8×8 — Cược vào lớn hoặc nhỏ",
    rules:
      "Khung đèn nhỏ hơn 8×8 (28 vị trí) với cùng cơ chế xoay, chủ đề động vật biển (cá mập, cá voi, cá heo, cá nhiệt đới, cua, vỏ sò, bong bóng). Dừng ở mũi tên là thua, biểu tượng miễn phí cho quay thêm, biểu tượng cố định trả hệ số cố định, biểu tượng lớn hoặc nhỏ trả theo hệ số hiện tại nếu có đặt cược. Sau đủ số vòng quay có thể kích hoạt vòng thưởng jackpot.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Tráng Miệng)",
    subtitle: "Khung mini 8×8 — chủ đề tráng miệng",
    rules:
      "Cơ chế khung mini 8×8 giống phiên bản Đại Dương, chuyển sang chủ đề tráng miệng (bánh kem, bánh dâu, cupcake, donut, bánh quy, kẹo, kẹo mút). Sau đủ số vòng quay có thể kích hoạt vòng thưởng jackpot với âm thanh riêng.",
  },
  "fruit-slot-1": {
    name: "Vòng Quay Trái Cây I",
    subtitle: "Bánh xe cổ điển 3×3, 5 đường trả thưởng",
    rules:
      "Máy trái cây cổ điển 3 bánh xe, 3 hàng với 5 đường trả thưởng (hàng trên, giữa, dưới và hai đường chéo). Đặt cược theo từng đường rồi quay — mỗi bánh xe dừng độc lập từ trái sang phải, có thể chạm Dừng để kết thúc sớm. Ba biểu tượng trùng nhau trên bất kỳ đường nào sẽ trả theo bảng — từ 100 lần cho số 7 may mắn đến 4 lần cho quả anh đào; hai quả anh đào trở lên ở bất kỳ đâu trên màn hình sẽ trả một khoản an ủi nhỏ; ba số 7 ở hàng giữa là jackpot với hiệu ứng ánh sáng và âm thanh riêng.",
  },
  "fruit-slot-2": {
    name: "Vòng Quay Trái Cây II",
    subtitle: "Chủ đề trái cây nhiệt đới, 5 đường trả thưởng",
    rules:
      "Cơ chế 3 bánh xe, 5 đường trả thưởng giống Vòng Quay Trái Cây I, chuyển sang chủ đề nhiệt đới — kim cương thay thế số 7 may mắn làm biểu tượng jackpot, cùng với dâu tây, dứa, chuối, đào và anh đào. Ba biểu tượng trùng nhau trên bất kỳ đường nào sẽ trả theo bảng, từ 100 lần cho kim cương đến 4 lần cho anh đào; ba viên kim cương ở hàng giữa là jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Cổ Điển V (Thưởng 7 May Mắn)",
    subtitle: "Vòng thưởng nhân hệ số 7 may mắn",
    rules:
      "Cơ chế xoay giống nhau, cược đồng thời vào 8 biểu tượng. Bộ ba bánh xe số ở giữa thường chỉ xoay mang tính trang trí; khi thắng có cơ hội kích hoạt vòng thưởng nơi ba bánh xe dừng lần lượt. Dừng ở ba số lẻ giống nhau tăng phần thắng lên 10 lần, ba số chẵn tăng 5 lần — một phần thưởng ngẫu nhiên hiếm không xảy ra mỗi lần.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Cổ Điển IV (Thưởng 7 May Mắn, Lễ Hội)",
    subtitle: "Thưởng 7 may mắn chủ đề lễ hội",
    rules:
      "Cơ chế giống phiên bản Thưởng 7 May Mắn, chuyển sang chủ đề lễ hội (bao lì xì, thỏi vàng, lồng đèn, quýt, bánh trung thu, pháo hoa, anh đào). Vòng thưởng và hệ số khớp số 10 lần/5 lần hoạt động tương tự với màu sắc và âm thanh lễ hội.",
  },
  "xiangqi-mahjong": {
    name: "Mạt Chược Cờ Tướng",
    subtitle: "Ghép bộ từ quân cờ, đấu với máy",
    rules:
      "Đặt cược, sau đó bạn và máy mỗi bên rút 5 quân cờ tướng. Đến lượt, rút một quân — nếu hoàn thành một đôi cộng một bộ (dãy liên tiếp hoặc bộ ba) thì bạn thắng bằng tự rút. Nếu không, bỏ một trong 6 quân của bạn. Nếu quân máy bỏ hoàn thành bài của bạn, bạn có thể lấy để thắng hoặc bỏ qua tiếp tục rút. Tiền thưởng: đôi-và-bộ hỗn hợp trả 2 lần, đôi-và-bộ cùng loại trả 3 lần, năm quân binh hoặc tốt trả 5 lần; lấy quân bỏ trả theo tỷ lệ niêm yết, tự rút được cộng thêm thưởng. Nếu hết quân mà không ai thắng, tiền cược được hoàn lại.",
  },
  tuitongzai: {
    name: "Thôi Thông Tử",
    subtitle: "Bài lá mạt chược kiểu Pai Gow tại ba vị trí cùng lúc",
    rules:
      "Dùng các lá Văn mạt chược từ 1-9 (mỗi số 4 lá) và lá trắng tính nửa điểm (4 lá) để tạo bộ 40 lá. Đặt cược vào vị trí Đầu, Thiên và Vĩ, sau đó nhà cái và mỗi vị trí lật 2 lá để so sánh. Thứ tự mạnh: cặp trắng đôi (mạnh nhất) thắng mọi cặp đôi, cặp đôi thắng tổ hợp 2-8, tổ hợp đó thắng tổng điểm thường (tổng các số, lấy chữ số cuối, trắng = 0.5, 9.5 là tổng thường cao nhất, 0 là thấp nhất). Mỗi vị trí so sánh độc lập với nhà cái — thắng trả 1 lần, cặp đôi trả 4 lần, cặp trắng đôi trả 10 lần; tổng bằng nhau sẽ theo luật nhà cái thắng.",
  },
}

const th: GameTable = {
  xiangqi: {
    name: "หมากรุกจีน",
    subtitle: "AI เดี่ยว／2 คน",
    rules:
      "สลับกันเดินหมาก ผู้ที่บีบให้ขุนพลฝ่ายตรงข้ามจนมุมก่อนเป็นผู้ชนะ ตามกฎหมากรุกจีนดั้งเดิม: เรือเดินตรง ม้าเดินรูปตัว L ช้างเดินทแยงในฝั่งตน ที่ปรึกษาเดินทแยงรอบวัง ทหารข้ามแม่น้ำแล้วเดินด้านข้างได้",
  },
  "darkchess-classic": {
    name: "หมากรุกซ่อน (คลาสสิก)",
    subtitle: "AI เดี่ยว／2 คน",
    rules: "หมากทั้งหมดวางหน้าลง เมื่อเปิดแล้วจะกินกันตามลำดับยศดั้งเดิม กินหมากฝ่ายตรงข้ามหมดหรือทำให้เดินไม่ได้คือชนะ",
  },
  "darkchess-variant": {
    name: "หมากรุกซ่อน (แบบพิเศษ)",
    subtitle: "AI เดี่ยว／2 คน",
    rules: "เหมือนแบบคลาสสิกแต่ปืนใช้กฎการโจมตีและกระโดดกินแบบพิเศษ เพิ่มกลยุทธ์ใหม่ๆ",
  },
  go: {
    name: "หมากล้อม (โกะ)",
    subtitle: "19×19",
    rules: "สลับกันวางหมากดำขาวบนจุดตัดกระดาน 19×19 ผู้ที่ล้อมพื้นที่ได้มากกว่าชนะ หมากที่ถูกล้อมจนไม่มีลมหายใจจะถูกจับ",
  },
  gomoku: { name: "หมากห้าตา", subtitle: "17×17", rules: "สลับกันวางหมาก ผู้ที่เรียงห้าตัวติดกันตามแนวนอน แนวตั้ง หรือทแยงก่อนคือชนะ" },
  othello: {
    name: "ออกแซโล่",
    subtitle: "มาตรฐาน",
    rules: "สลับกันวางหมาก หากประกบหมากฝ่ายตรงข้ามได้จะพลิกเป็นสีของตน จบเกมผู้ที่มีหมากมากกว่าชนะ",
  },
  mahjong: {
    name: "นกกระจอกจีน",
    subtitle: "AI เดี่ยว (คอมพิวเตอร์ 3 คน)",
    rules: "เล่นร่วมโต๊ะกับคอมพิวเตอร์ 3 คน สลับกันจั่วและทิ้งไพ่ สามารถกิน／ป๊อง／กงไพ่ที่ทิ้งได้ ผู้ที่ครบมือชนะก่อนคือผู้ชนะ",
  },
  luzhanqi: {
    name: "หมากรุกกองทัพ",
    subtitle: "AI เดี่ยว／2 คน",
    rules: "ยศของหมากทั้งสองฝ่ายเป็นความลับ ฝ่ายตรงข้ามเห็นแค่ด้านหลัง การต่อสู้ตัดสินด้วยยศ ผู้ที่ยึดธงฝ่ายตรงข้ามหรือทำให้เดินไม่ได้ก่อนคือชนะ",
  },
  checkers: {
    name: "หมากฮอส",
    subtitle: "มาตรฐาน",
    rules: "สลับกันเดินหมากทางทแยง กระโดดข้ามเพื่อกินหมากฝ่ายตรงข้ามได้ กินหมดหรือทำให้เดินไม่ได้คือชนะ",
  },
  tictactoe: {
    name: "เกม OX",
    subtitle: "ขนาดขยาย 3×3",
    rules: "สลับกันวางสัญลักษณ์ ผู้ที่เรียงสามตัวติดกันตามแนวนอน แนวตั้ง หรือทแยงก่อนคือชนะ",
  },
  chess: {
    name: "หมากรุกสากล",
    subtitle: "AI เดี่ยว／2 คน",
    rules:
      "สลับกันเดินหมาก ผู้ที่รุกฆาตคิงฝ่ายตรงข้ามก่อนคือผู้ชนะ ตามกฎหมากรุกสากลมาตรฐานสำหรับการเดินของเบี้ย เรือ อัศวิน บิชอป ควีน และคิง",
  },
  connect4: {
    name: "คอนเน็กต์ โฟร์",
    subtitle: "AI เดี่ยว／2 คน",
    rules: "สลับกันหยอดหมากลงกระดานตั้ง ผู้ที่เรียงสี่ตัวติดกันตามแนวนอน แนวตั้ง หรือทแยงก่อนคือชนะ",
  },
  "chinese-checkers": {
    name: "หมากฮอสจีน",
    subtitle: "กระดานรูปดาว",
    rules: "บนกระดานรูปดาวหกแฉก ผู้ที่ย้ายหมากทั้งหมดไปมุมตรงข้ามก่อนคือชนะ หมากสามารถเดินหรือกระโดดข้ามหมากอื่นต่อเนื่องเพื่อเร่งความเร็ว",
  },
  jigsaw: {
    name: "เกมเลื่อนตัวเลข",
    subtitle: "กระเบื้องตัวเลข",
    rules: "แตะกระเบื้องข้างช่องว่างเพื่อเลื่อนเข้าไป จัดเรียงตัวเลข 1 ถึง 15 ให้ครบเพื่อชนะ",
  },
  "number-merge": {
    name: "รวมตัวเลข",
    subtitle: "สไตล์ 2048",
    rules: "ปัดหรือใช้ปุ่มลูกศร กระเบื้องตัวเลขเดียวกันชนกันจะรวมและเพิ่มค่าเป็นสองเท่า ถึง 2048 เพื่อชนะ",
  },
  "memory-match": {
    name: "จับคู่ความจำ",
    subtitle: "ท้าทายความจำ",
    rules: "เปิดไพ่สองใบต่อครั้ง คู่ที่ตรงกันจะเปิดไว้ จับคู่ให้ครบด้วยจำนวนครั้งน้อยที่สุดเพื่อชนะ",
  },
  ludo: {
    name: "เกมเศรษฐีม้า (ลูโด)",
    subtitle: "2 ผู้เล่น",
    rules: "ทอยลูกเต๋าเพื่อเดินหมากรอบกระดานกลับบ้าน การเหยียบหมากฝ่ายตรงข้ามจะส่งกลับไปจุดเริ่มต้น",
  },
  solitaire: {
    name: "โซลิแทร์",
    subtitle: "คลาสสิกเล่นคนเดียว",
    rules: "จัดไพ่ทุกใบลงกองพื้นทั้งสี่ตามดอกและลำดับเพิ่มขึ้นเพื่อล้างกระดานและชนะ",
  },
  rummikub: {
    name: "รัมมิคับ",
    subtitle: "กระเบื้องตัวเลขปะทะ AI",
    rules: "ใช้กระเบื้องตัวเลขของคุณสร้างเรียงลำดับหรือชุดตัวเลขเดียวกันแล้ววางบนโต๊ะ ผู้ที่เล่นกระเบื้องหมดก่อนคือชนะ",
  },
  "rps-battle": {
    name: "เป่ายิ้งฉุบ",
    subtitle: "ปะทะ AI",
    rules: "ออกค้อน กระดาษ หรือกรรไกรพร้อมกับคอมพิวเตอร์ ผู้ที่ชนะรอบมากกว่าคือผู้ชนะรวม",
  },
  "texas-holdem": {
    name: "เท็กซัสโฮลเอ็ม",
    subtitle: "ตัวต่อตัวกับ AI (แบบย่อ)",
    rules:
      "คุณและ AI ถือไพ่คนละ 2 ใบ บวกไพ่กลางร่วม 5 ใบ เลือกเรียกเพื่อเปิดเทียบไพ่ หรือพับเพื่อยอมแพ้มือนั้น ไพ่อันดับสูงกว่าชนะเดิมพันทั้งหมด",
  },
  war: {
    name: "วอร์ (War)",
    subtitle: "เทียบไพ่สูงปะทะ AI",
    rules:
      "แบ่งสำรับเท่าๆกันสองฝ่าย ทุกรอบทั้งสองฝ่ายเปิดไพ่หนึ่งใบ ไพ่สูงกว่าชนะรอบนั้น เสมอกันจะเข้าสู่การสู้ต่อ ผู้ที่มีไพ่มากกว่าในตอนจบคือชนะ",
  },
  "three-card-poker": {
    name: "โป๊กเกอร์ 3 ใบ",
    subtitle: "ปะทะเจ้ามือ",
    rules:
      "คุณและเจ้ามือได้รับไพ่คนละ 3 ใบ หลังดูไพ่แล้วเลือกเรียกเพื่อเปิดเทียบ หรือพับเพื่อยอมแพ้รอบนั้น ไพ่อันดับสูงกว่าชนะ",
  },
  klotski: {
    name: "คลอตสกี้",
    subtitle: "เกมเลื่อนบล็อก",
    rules: "เลื่อนบล็อกขนาดต่างๆภายในพื้นที่กระดานที่จำกัด ย้ายบล็อกที่ใหญ่ที่สุดไปยังทางออกด้านล่างเพื่อชนะ",
  },
  tetris: {
    name: "เทตริส",
    subtitle: "เรียงซ้อนและเคลียร์แถว",
    rules:
      "ปัดซ้ายหรือขวาเพื่อขยับบล็อกที่ตกลงมา แตะเพื่อหมุน ปัดลงเพื่อเร่งการตก เติมแถวให้เต็มเพื่อเคลียร์และได้คะแนน เกมจบถ้าบล็อกซ้อนถึงด้านบน",
  },
  "bubble-shooter": {
    name: "ยิงลูกบอลสี",
    subtitle: "จับคู่สีเพื่อเคลียร์",
    rules: "แตะทิศทางเพื่อยิงลูกบอลปัจจุบัน ลูกบอลสีเดียวกันสามลูกขึ้นไปที่ติดกันจะถูกเคลียร์ได้คะแนน เกมจบถ้าลูกบอลถึงด้านบน",
  },
  match3: {
    name: "แมทช์-3 บลาสต์",
    subtitle: "สลับเพื่อจับคู่",
    rules:
      "แตะกระเบื้องหนึ่งอัน แล้วแตะกระเบื้องข้างเคียงเพื่อสลับตำแหน่ง จับคู่สีเดียวกัน 3 อันขึ้นไปเพื่อเคลียร์และเติมใหม่จากด้านบน อาจเกิดปฏิกิริยาลูกโซ่",
  },
  hanoi: {
    name: "หอคอยฮานอย",
    subtitle: "เคลื่อนจานหมุน",
    rules:
      "แตะเสาเพื่อหยิบจานบนสุด แล้วแตะเสาอื่นเพื่อย้ายไป จานใหญ่ไม่สามารถวางบนจานเล็กได้ ย้ายกองจานทั้งหมดไปเสาขวาสุดเพื่อชนะ",
  },
  "water-sort": {
    name: "เรียงสีน้ำ",
    subtitle: "เทเพื่อแยกสี",
    rules:
      "แตะหลอดเพื่อหยิบสีบนสุด แล้วแตะหลอดอื่นเพื่อเท เทได้เฉพาะหลอดเปล่าหรือหลอดที่มีสีบนสุดเดียวกัน เรียงทุกหลอดให้เป็นสีเดียวเพื่อชนะ",
  },
  "pipe-connect": {
    name: "ต่อท่อน้ำ",
    subtitle: "หมุนเพื่อเชื่อมต่อ",
    rules: "แตะกระเบื้องท่อเพื่อหมุน 90° เชื่อมต่อแหล่งน้ำที่มุมบนซ้ายไปยังทางออกมุมล่างขวาเพื่อชนะ",
  },
  "stack-tower": {
    name: "เรียงหอคอย",
    subtitle: "จับเวลาให้ตรง",
    rules:
      "บล็อกด้านบนแกว่งซ้ายขวาอัตโนมัติ แตะเพื่อปล่อยลงบนกองด้านล่าง ยิ่งซ้อนตรงมากเท่าไหร่ บล็อกจะยิ่งแคบลง หากพลาดกองทั้งหมดเกมจะจบ",
  },
  "sequence-sort": {
    name: "จัดลำดับมาสเตอร์",
    subtitle: "สลับเพื่อจัดเรียง",
    rules: "แตะกระเบื้องตัวเลขสองอันเพื่อสลับตำแหน่ง จัดเรียงตัวเลขทั้งหมดจากน้อยไปมากด้วยจำนวนครั้งน้อยที่สุดเพื่อชนะ",
  },
  "mini-sudoku": {
    name: "มินิซูโดกุ",
    subtitle: "กริด 6×6",
    rules:
      "ทุกแถว คอลัมน์ และกล่อง 2×3 ต้องมีตัวเลข 1 ถึง 6 โดยไม่ซ้ำกัน เติมกริดทั้งหมดโดยไม่มีข้อขัดแย้งเพื่อชนะ",
  },
  "shooting-range": {
    name: "ยิงเป้า",
    subtitle: "ท้าทายปฏิกิริยาตอบสนอง",
    rules: "เป้าหมายสว่างขึ้นแบบสุ่มบนกริด แตะให้เร็วที่สุดเพื่อได้คะแนน ไปถึงคะแนนเป้าหมายก่อนเวลาหมดเพื่อชนะ",
  },
  "space-invaders": {
    name: "เอเลี่ยนบุก",
    subtitle: "เคลียร์กองยานทั้งหมดเพื่อชนะ",
    rules:
      "เคลื่อนซ้ายขวาเพื่อหลบกระสุนศัตรูและยิงเอเลี่ยนทั้งกองให้หมด ท้าทายจะล้มเหลวถ้ากองยานบุกเข้ามาถึงหรือชีวิตหมด",
  },
  "tank-battle": {
    name: "สงครามรถถัง",
    subtitle: "ผู้ที่ยิงโดน 3 ครั้งก่อนคือชนะ",
    rules: "เคลื่อนรถถังซ้ายขวาและยิงกระสุน ยิงโดนช่องฝ่ายตรงข้ามได้คะแนน ผู้ที่ยิงโดน 3 ครั้งก่อนคือชนะ",
  },
  "brick-breaker": {
    name: "ทำลายกำแพงอิฐ",
    subtitle: "ทำลายอิฐทั้งหมดเพื่อชนะ",
    rules:
      "ลากแท่นรับซ้ายขวาเพื่อเด้งลูกบอลและทำลายอิฐทั้งหมดเพื่อชนะ ลูกบอลตกด้านล่างจะเสียชีวิตหนึ่งชีวิต ท้าทายล้มเหลวถ้าชีวิตหมด",
  },
  "zombie-defense": {
    name: "ป้องกันซอมบี้",
    subtitle: "รอดชีวิตทุกคลื่นเพื่อชนะ",
    rules:
      "ซอมบี้เดินมาตามแนวจากด้านขวา แตะเพื่อทำลาย (บางตัวต้องแตะสองครั้ง) ถ้าซอมบี้ถึงขอบซ้ายจะเสียพลังชีวิต รอดชีวิตทุกคลื่นเพื่อชนะ",
  },
  "air-combat": {
    name: "สงครามทางอากาศ",
    subtitle: "รอดชีวิตและทำคะแนนเป้าหมาย",
    rules:
      "เครื่องบินของคุณยิงอัตโนมัติ เคลื่อนซ้ายขวาเพื่อหลบเครื่องบินศัตรูและเคลียร์พวกมัน รอดชีวิตในเวลาที่กำหนดพร้อมทำคะแนนเป้าหมายเพื่อชนะ ชีวิตหมดคือล้มเหลว",
  },
  billiards: {
    name: "บิลเลียด",
    subtitle: "ลากเพื่อเล็ง เคลียร์ลูกทั้งหมด",
    rules:
      "ลากย้อนจากลูกขาวเพื่อเล็ง แล้วปล่อยเพื่อตี ส่งลูกสีทุกลูกลงหลุมก่อนหมดจำนวนครั้งตีเพื่อชนะ",
  },
  bowling: {
    name: "โบว์ลิ่ง",
    subtitle: "ทำคะแนนเป้าหมายใน 3 เฟรม",
    rules: "ลากแถบเลื่อนเพื่อตั้งมุมขว้าง แล้วปล่อยเพื่อโยน ล้มพินให้ได้คะแนนเป้าหมายใน 3 เฟรมเพื่อชนะ",
  },
  "basketball-shoot": {
    name: "ยิงบาสเก็ตบอล",
    subtitle: "จับเวลาให้ตรง",
    rules: "มาตรวัดแรงแกว่งไปมาอัตโนมัติ แตะเพื่อยิงเมื่ออยู่ใกล้ตรงกลางเพื่อทำคะแนน ยิงให้ได้จำนวนที่กำหนดเพื่อชนะ",
  },
  "penalty-kick": {
    name: "ยิงจุดโทษ",
    subtitle: "เลือกทิศทางปะทะผู้รักษาประตู",
    rules: "เลือกซ้าย กลาง หรือขวาเพื่อยิงประตูผู้รักษาประตูที่พุ่งแบบสุ่ม ทำประตูให้ได้ตามจำนวนใน 5 รอบเพื่อชนะ",
  },
  racing: {
    name: "แข่งรถเร็ว",
    subtitle: "เปลี่ยนเลนเพื่อหลบรถ",
    rules: "เปลี่ยนเลนซ้ายขวาเพื่อหลบรถที่วิ่งสวนมา ท้าทายล้มเหลวถ้าชีวิตหมดก่อนถึงระยะเป้าหมาย",
  },
  parking: {
    name: "ท้าทายจอดรถ",
    subtitle: "จอดรถภายในจำนวนครั้งที่กำหนด",
    rules: "ใช้การบังคับเลี้ยวและเดินหน้าเพื่อจอดให้ตรงจุดที่กำหนดก่อนหมดจำนวนครั้งหรือชนเพื่อชนะ",
  },
  motocross: {
    name: "กระโดดมอเตอร์ครอส",
    subtitle: "กระโดดข้ามหลุมไปจนถึงเส้นชัย",
    rules: "แตะเพื่อกระโดดรถมอเตอร์ไซค์ข้ามหลุมด้านหน้าด้วยการจับเวลาที่ดี ท้าทายล้มเหลวถ้าชีวิตหมดก่อนถึงเส้นชัย",
  },
  "drift-racing": {
    name: "แข่งดริฟท์",
    subtitle: "บังคับตามเส้นทางเพื่อทำคะแนน",
    rules: "บังคับตามโค้งของเส้นทางเพื่อรักษาเส้นทางพร้อมสะสมคะแนนดริฟท์ ถึงเส้นชัยพร้อมคะแนนเพียงพอเพื่อชนะ",
  },
  "duel-arena": {
    name: "สนามประลอง",
    subtitle: "ผลัดกันต่อสู้ น็อกเอาท์ก่อนคือชนะ",
    rules:
      "เลือกโจมตีเพื่อสะสมเกจพิเศษ ป้องกันเพื่อลดความเสียหายครึ่งหนึ่งในรอบถัดไป หรือปล่อยท่าไม้ตายเมื่อเกจเต็ม ผู้ที่ลดพลังชีวิตฝ่ายตรงข้ามเป็นศูนย์ก่อนคือชนะ",
  },
  sevens: {
    name: "เซเว่นส์ (ไพ่ 7)",
    subtitle: "รัมมี่ 4 คน — ใครแต้มโทษเหลือน้อยที่สุดชนะ",
    rules:
      "เริ่มจากไพ่ 7 ผลัดกันวางไพ่ที่มีลำดับติดกันข้างๆ ถ้าวางไม่ได้ให้คว่ำไพ่รับโทษ เมื่อมีคนไพ่หมดก่อน ใครแต้มโทษรวมน้อยที่สุดชนะ",
  },
  "sichuan-mahjong": {
    name: "นกกระจอกเสฉวน (เลือดสังหาร)",
    subtitle: "ขาดลายหนึ่งตั้งแต่เริ่ม ชนะแล้วเล่นต่อได้",
    rules:
      "ใช้เฉพาะไพ่ ว่าน ซัวะ ถ่ง และต้องขาดลายหนึ่งตั้งแต่เริ่มเกม ผู้ที่หูไพ่จะออกจากโต๊ะ ส่วนที่เหลือเล่นต่อจนมีผู้หู 3 คนหรือไพ่หมด",
  },
  "malaysia-mahjong": {
    name: "นกกระจอกมาเลเซีย 3 คน",
    subtitle: "เล่น 3 คน ไพ่จั่วทำให้ไพ่ใหญ่เกิดง่าย",
    rules:
      "เล่นโดยผู้เล่น 3 คน ใช้ไพ่ชุดย่อ ว่าน ไพ่ลม/ดอกไม้ และไพ่จั่ว ชุดไพ่ที่เล็กลงพร้อมไพ่จั่วทำให้ไพ่ใหญ่เกิดขึ้นบ่อยกว่าปกติ",
  },
  "mahjong-pengpeng": {
    name: "นกกระจอกผองผอง",
    subtitle: "นกกระจอกแบบง่าย กินได้เฉพาะปอง ไม่มีชี",
    rules: "ชุดไพ่แบบง่ายที่ไม่ให้กินชี ทำได้แค่ปองหรือจั่วเอง สร้างไพ่สามใบคู่สองชุดพร้อมคู่หนึ่งเพื่อชนะ",
  },
  "mahjong-sevens": {
    name: "เซเว่นส์นกกระจอก",
    subtitle: "เหมือนเซเว่นส์ ใช้ลายว่าน/ซัวะ/ถ่ง",
    rules: "เริ่มจากไพ่เลข 5 ของแต่ละลาย ผลัดกันวางเลขที่ติดกันข้างๆ ถ้าวางไม่ได้ให้คว่ำไพ่รับโทษ",
  },
  "riichi-mahjong": {
    name: "นกกระจอกญี่ปุ่นริจิ",
    subtitle: "รอบตะวันออก — ริจิ โดระ และฟุริเทน",
    rules:
      "เมื่อไพ่ปิดพร้อมรอหูแล้ว ประกาศริจิเพื่อวางเดิมพัน ไพ่โดระที่เปิดจะให้ฮันเพิ่ม ฟุริเทนห้ามหูจากไพ่ที่ทิ้งไปแล้ว ไพ่ต้องมียาคุอย่างน้อยหนึ่งอย่างถึงจะหูได้",
  },
  "mahjong-solitaire": {
    name: "นกกระจอกจับคู่",
    subtitle: "จับคู่ไพ่เหมือนกันด้วยเส้นเชื่อมหักมุมไม่เกิน 2 ครั้ง",
    rules: "หาไพ่สองใบที่เหมือนกันซึ่งเส้นเชื่อมระหว่างกันหักมุมไม่เกินสองครั้งเพื่อเคลียร์ เคลียร์กระดานให้หมดก่อนเวลาหมดเพื่อชนะ",
  },
  "merge-2048": {
    name: "รวม 2048",
    subtitle: "ปัดเพื่อรวมตัวเลข มุ่งสู่ 2048",
    rules: "ปัดไปทางใดก็ได้ — ช่องเลขเดียวกันชนกันจะรวมและเพิ่มค่าเป็นสองเท่า ไปถึง 2048 เพื่อชนะ",
  },
  "city-2048": {
    name: "เมือง 2048",
    subtitle: "รวมสิ่งก่อสร้างจากสนามหญ้าสู่ตึกระฟ้า",
    rules: "กฎเหมือน 2048 แต่ช่องเป็นไอคอนสิ่งก่อสร้าง — รวมไปทีละขั้นจากสนามหญ้าไปจนถึงตึกระฟ้า",
  },
  "merge-2048-undo": {
    name: "2048 ย้อนกลับ",
    subtitle: "เหมือน 2048 มีปุ่มย้อนกลับ",
    rules: "กฎเหมือน 2048 แต่สามารถย้อนการปัดได้หากพลาด",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "รวมสิ่งก่อสร้าง — ระวังหมีที่เดินไปมา",
    rules:
      "บนกระดาน 6×6 ของสามชิ้นที่เหมือนกันจะรวมเป็นระดับที่สูงขึ้น หมีจะเดินไปมาขวางช่องของคุณ — ล้อมหมีให้มิดเพื่อเปลี่ยนเป็นหลุมฝังศพซึ่งก็รวมได้เช่นกัน",
  },
  suika: {
    name: "รวมผลไม้ซุยกะ",
    subtitle: "เลื่อนซ้าย/ขวาแล้วปล่อยผลไม้ — ผลไม้เหมือนกันรวมเป็นลูกใหญ่ขึ้น",
    rules: "เลื่อนซ้ายขวาเพื่อเลือกจุดที่ผลไม้จะตกลงมา ผลไม้ที่เหมือนกันจะรวมเป็นขนาดที่ใหญ่ขึ้น — พยายามไปให้ถึงแตงโมลูกยักษ์",
  },
  "drop-2048": {
    name: "2048 ตก",
    subtitle: "บล็อกเลขตกลงมาซ้อนและรวมกัน",
    rules: "บล็อกเลขตกลงมาจากด้านบน เลื่อนซ้ายขวาเพื่อเลือกคอลัมน์ เลขที่เหมือนกันจะรวมและเพิ่มเป็นสองเท่าเมื่อซ้อนกัน",
  },
  puyo: {
    name: "พูโยะ พูโยะ",
    subtitle: "คู่ที่ตกลงมา — เคลียร์เมื่อสีเดียวกันต่อกัน 4 ขึ้นไป",
    rules: "คู่ก้อนสีตกลงมาจากด้านบน เลื่อนและหมุนได้ เชื่อมสีเดียวกัน 4 ก้อนขึ้นไปเพื่อเคลียร์ ซึ่งอาจทำให้เกิดปฏิกิริยาลูกโซ่",
  },
  "dr-mario": {
    name: "ดร.มาริโอ",
    subtitle: "ซ้อนแคปซูลที่ตกลงมาเพื่อกำจัดไวรัสเป็นแถว",
    rules: "แคปซูลสองสีตกลงมาและซ้อนกัน เรียงสีเดียวกัน 4 ก้อนรวมไวรัสเป็นแถวเพื่อเคลียร์ กำจัดไวรัสให้หมดเพื่อชนะ",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "สลับระหว่างเกมบล็อกตกคลาสสิกสองแบบ",
    rules: "สลับระหว่าง Columns (จับคู่อัญมณี 3+ เป็นแถว) และ Tetris (เคลียร์แถวที่เต็ม) ได้ในหน้าจอเดียว",
  },
  "candy-crush": {
    name: "Candy Crush",
    subtitle: "สลับลูกอมให้เรียง 3 ตัว ทำคะแนนให้ถึงเป้า",
    rules:
      "สลับลูกอมที่อยู่ติดกันเพื่อให้เรียงกัน 3 ตัวขึ้นไป ลูกอมพิเศษจากการจับคู่ใหญ่จะเคลียร์ทั้งแถวหรือทั้งสี — ทำคะแนนให้ถึงเป้าภายในจำนวนตาที่จำกัดเพื่อชนะ",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "เกมจับคู่ 3 ต้นฉบับ — สลับอัญมณีเพื่อเคลียร์แถว",
    rules: "สลับอัญมณีที่อยู่ติดกันให้เรียงกัน 3 ชิ้นขึ้นไป ต่อคอมโบเพื่อคะแนนพิเศษระหว่างไล่ทำคะแนนสูงสุดใหม่",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "จับคู่ 3 เก็บเหรียญเพื่อบูรณะสวนที่ถูกทิ้งร้าง",
    rules: "เคลียร์การจับคู่เพื่อรับเหรียญ จากนั้นใช้เหรียญทำภารกิจบูรณะสวนให้สำเร็จ",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "จับคู่ 3 เก็บเหรียญเพื่อตกแต่งคฤหาสน์ในฝัน",
    rules: "เคลียร์การจับคู่เพื่อรับเหรียญ จากนั้นใช้เหรียญทำภารกิจตกแต่งคฤหาสน์ให้สำเร็จ",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "จับคู่ 3 เก็บเหรียญเพื่อบูรณะปราสาทเก่า",
    rules: "เคลียร์การจับคู่เพื่อรับเหรียญ จากนั้นใช้เหรียญทำภารกิจบูรณะปราสาทให้สำเร็จ",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "จับคู่อัญมณี + สร้างทีมต่อสู้ด้วยการ์ด",
    rules: "การจับคู่อัญมณีจะกระตุ้นให้เพื่อนร่วมทีมธาตุเดียวกันโจมตี เอาชนะศัตรูเพื่อเลเวลอัพทีมและเดินหน้าต่อไป",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "จับคู่อัญมณี + ต่อสู้ด้วยความได้เปรียบธาตุ",
    rules: "การจับคู่อัญมณีจะกระตุ้นการโจมตี ใช้ความได้เปรียบของธาตุเพื่อสร้างความเสียหายเพิ่มและเอาชนะศัตรู",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "จับคู่อัญมณี + สร้างเมืองเบาๆ และ PvP",
    rules: "การจับคู่อัญมณีกระตุ้นให้ฮีโร่โจมตี เอาชนะคู่ต่อสู้เพื่อได้วัสดุก่อสร้างมาขยายอาณาจักร",
  },
  "sheep-sheep": {
    name: "แพะชนแพะ (Sheep a Sheep)",
    subtitle: "เก็บชิ้นจากกองซ้อน เคลียร์ชุดละ 3",
    rules:
      "แตะชิ้นที่ไม่มีอะไรบังเพื่อส่งเข้าช่องเก็บ ชิ้นที่เหมือนกันครบ 3 จะเคลียร์อัตโนมัติ — ถ้าช่องเก็บเต็มโดยยังไม่ครบชุดจะแพ้",
  },
  match3d: {
    name: "Match 3D",
    subtitle: "เก็บจากกองวัตถุ 3 มิติเพื่อเคลียร์แบบจับคู่ 3",
    rules: "แนวคิดเดียวกับแพะชนแพะ แต่ชิ้นเป็นกองวัตถุ 3 มิติ — หาและเก็บชุดที่เหมือนกันครบ 3",
  },
  "balls-merge": {
    name: "รวมลูกบอล",
    subtitle: "เลื่อนและปล่อย — ลูกบอลเหมือนกันรวมเป็นลูกใหญ่ขึ้น",
    rules: "กลไกเดียวกับรวมผลไม้ซุยกะ ธีมลูกบอล — ลูกบอลที่เหมือนกันรวมเป็นขนาดที่ใหญ่ขึ้น",
  },
  "cookies-merge": {
    name: "รวมคุกกี้",
    subtitle: "เลื่อนและปล่อย — คุกกี้เหมือนกันรวมเป็นลูกใหญ่ขึ้น",
    rules: "กลไกเดียวกับรวมผลไม้ซุยกะ ธีมคุกกี้ — คุกกี้ที่เหมือนกันรวมเป็นขนาดที่ใหญ่ขึ้น",
  },
  "planets-merge": {
    name: "รวมดาวเคราะห์",
    subtitle: "เลื่อนและปล่อย — ดาวเคราะห์เหมือนกันรวมเป็นลูกใหญ่ขึ้น",
    rules: "กลไกเดียวกับรวมผลไม้ซุยกะ ธีมดาวเคราะห์ — ดาวเคราะห์ที่เหมือนกันรวมเป็นขนาดที่ใหญ่ขึ้น",
  },
  "mahjong-ninepoint5": {
    name: "นกกระจอกเก้าแต้มครึ่ง",
    subtitle: "ใช้ไพ่นกกระจอกแทนไพ่ป๊อก ใกล้ 9.5 มากที่สุดชนะ",
    rules: "เล่นเก้าแต้มครึ่ง (คล้ายแบล็กแจ็ก) ด้วยไพ่นกกระจอกแทนไพ่ป๊อก เลือกจั่วเพิ่มหรือหยุด ใครใกล้ 9.5 มากที่สุดโดยไม่เกินจะชนะ",
  },
  "mahjong-niuniu": {
    name: "นกกระจอกหนิวหนิว",
    subtitle: "ใช้ไพ่นกกระจอกแทนไพ่ป๊อก รวม 3 ใบให้เป็นเลขคูณ 10",
    rules: "เล่นหนิวหนิวด้วยไพ่นกกระจอกแทนไพ่ป๊อก จากไพ่ 5 ใบ หา 3 ใบที่รวมกันเป็นเลขคูณ 10 แล้วเทียบแต้มอีก 2 ใบที่เหลือ",
  },
  "dragon-gate": {
    name: "ยิงประตูมังกร",
    subtitle: "ใช้ไพ่ว่านนกกระจอกสองใบเปิดประตู แทงช่วงตรงกลาง",
    rules: "ไพ่ว่านสองใบเปิดประตู วางเดิมพันแล้วจั่วใบที่สาม ตกกลางประตูชนะ ตกนอกแพ้ ตรงกับเลขเสาจ่ายสองเท่า",
  },
  blackjack: {
    name: "แบล็คแจ็ค",
    subtitle: "เล่น 21 แต้มกับเจ้ามือ",
    rules:
      "ทำแต้มให้ใกล้ 21 ที่สุดโดยไม่เกิน เอซนับเป็น 1 หรือ 11 ไพ่หน้าคนนับเป็น 10 เลือกจั่วเพิ่มหรือหยุด เจ้ามือต้องจั่วต่อจนกว่าจะได้ 17 แต้มขึ้นไป",
  },
  baccarat: {
    name: "บาคาร่า",
    subtitle: "Player／Banker／Tie",
    rules:
      "แทงที่ Player, Banker หรือ Tie ก่อนแจกไพ่ ผลรวมใช้เลขหลักหน่วยเทียบกัน ฝั่งที่มากกว่าชนะ ไพ่เพิ่มจั่วอัตโนมัติตามกฎบาคาร่ามาตรฐาน",
  },
  "ten-half": {
    name: "สิบจุดครึ่ง",
    subtitle: "ทำแต้มให้ใกล้ 10.5 มากกว่าเจ้ามือ",
    rules:
      "วางเดิมพันแล้วแจกไพ่ 2 ใบให้ทั้งสองฝ่าย เลือกจั่วเพิ่มหรือหยุด ใครใกล้ 10.5 มากกว่าโดยไม่เกินชนะ เอซนับ 1 แต้ม ไพ่หน้าคนนับ 0.5 แต้ม ได้ 10.5 ทันทีจ่าย 3 เท่า ชนะปกติจ่าย 2 เท่า เสมอคืนเงินเดิมพัน",
  },
  "thirteen-water": {
    name: "สิบสามใบ",
    subtitle: "แบ่งไพ่ 13 ใบเป็น 3 กองแข่งกับเจ้ามือ",
    rules:
      "วางเดิมพันแล้วแจกไพ่ ระบบจะแบ่งไพ่ 13 ใบของแต่ละฝ่ายเป็นกองหน้า 3 ใบ กองกลาง 5 ใบ กองหลัง 5 ใบโดยอัตโนมัติ เทียบกันแยกกอง ชนะทั้ง 3 กองจ่าย 5 เท่า ชนะ 2 กองจ่าย 2 เท่า ชนะ 1 กองจ่าย 1.5 เท่า เสมอคืนเงิน แพ้มากกว่าชนะเสียเงินเดิมพัน",
  },
  "big-two": {
    name: "บิ๊กทู",
    subtitle: "เล่นไพ่เดี่ยวหรือคู่ให้หมดมือก่อน",
    rules:
      "วางเดิมพันแล้วแข่งกับเจ้ามือ เล่นไพ่เดี่ยวหรือคู่เลขเดียวกันที่แรงกว่าตาก่อน หรือผ่าน ลำดับแต้ม 3 ต่ำสุดถึง 2 สูงสุด เสมอเทียบดอก เล่นไพ่ 13 ใบหมดก่อนชนะ 2 เท่าของเงินเดิมพัน",
  },
  "stud-poker": {
    name: "สตัดโป๊กเกอร์",
    subtitle: "เทียบไพ่ 5 ใบโดยตรงกับเจ้ามือ",
    rules:
      "วางเดิมพันแล้วแจกไพ่ 5 ใบให้ทั้งสองฝ่าย เทียบอันดับไพ่โดยตรง — สเตรทฟลัช โฟร์ออฟอะไคนด์ ฟูลเฮาส์ ฟลัช สเตรท สามใบ สองคู่ คู่ และไพ่สูง ฝ่ายที่แรงกว่าชนะ 2 เท่า เสมอคืนเงินเดิมพัน",
  },
  niuniu: {
    name: "หนิวหนิว",
    subtitle: "รวมไพ่ 5 ใบให้เป็นเลขคูณ 10 เพื่อแต้มวัวสูงสุด",
    rules:
      "วางเดิมพันแล้วแจกไพ่ 5 ใบให้ทั้งสองฝ่าย เลือก 3 ใบที่รวมกันเป็นเลขคูณ 10 (เรียกว่า 'วัว') ไพ่ที่เหลือ 2 ใบใช้เลขหลักหน่วยเป็นแต้ม ยิ่งสูงยิ่งดี รวมได้ 10 พอดีคือ 'วัววัว' สูงสุด รวมไม่ได้คือ 'ไม่มีวัว' ต่ำสุด แต้มสูงกว่าชนะ 2 เท่า เสมอคืนเงินเดิมพัน ไพ่หน้าคนนับ 10 แต้ม เอซนับ 1 แต้ม",
  },
  "zha-jinhua": {
    name: "จ่าจินฮวา",
    subtitle: "เทียบไพ่ 3 ใบโดยตรงกับเจ้ามือ",
    rules:
      "วางเดิมพันแล้วแจกไพ่ 3 ใบให้ทั้งสองฝ่าย เทียบอันดับไพ่โดยตรง — สามใบเหมือนกัน สเตรทฟลัช ฟลัช สเตรท คู่ และไพ่สูง ฝ่ายที่แรงกว่าชนะ 2 เท่า เสมอคืนเงินเดิมพัน",
  },
  "seven-pk": {
    name: "เซเว่นการ์ดสตัด",
    subtitle: "แจกไพ่ 4 รอบ เลือกพับหรือเพิ่มเดิมพันเป็นสองเท่าในแต่ละรอบ",
    rules:
      "วางเดิมพันเริ่มต้น ไพ่จะถูกแจกเป็น 4 รอบ (3 ใบ แล้ว 2 ใบ แล้ว 1 ใบ แล้วเปิด 2 ใบสุดท้าย) หลังแต่ละรอบเลือกพับหรือเพิ่มเดิมพันเป็นสองเท่าได้ ไพ่ 5 ใบที่แรงที่สุดจาก 7 ใบตัดสินผล พับเสียเงินเดิมพันทั้งหมดที่สะสมไว้ ชนะจ่ายตามอันดับไพ่ ตั้งแต่รอยัลฟลัช 150 เท่า จนถึงสองคู่ 1 เท่า",
  },
  bridge: {
    name: "บริดจ์",
    subtitle: "จับคู่กับเพื่อนปะทะคอมพิวเตอร์สองคน",
    rules:
      "คุณและคู่หูฝั่งเหนือเล่นปะทะฝั่งตะวันตกและตะวันออกที่ควบคุมโดยคอมพิวเตอร์ทั้งคู่ ทุกรอบผู้เล่นทั้งสี่คนจะออกไพ่ตามลำดับและต้องตามดอกถ้ามี มิฉะนั้นออกดอกใดหรือไพ่ทรัมป์ก็ได้ ไพ่สูงสุดของดอกที่นำหรือไพ่ทรัมป์สูงสุดจะชนะตานั้น หลังจบทั้ง 13 ตา ฝ่ายที่ชนะ 7 ตาขึ้นไปเป็นผู้ชนะมือนั้น",
  },
  "pick-red-points": {
    name: "เก็บแต้มแดง",
    subtitle: "จับคู่ไพ่ที่ออกกับไพ่บนโต๊ะ",
    rules:
      "ผลัดกันออกไพ่หนึ่งใบ ถ้าเลขตรงกับไพ่บนโต๊ะจะกวาดไพ่เลขนั้นทั้งหมดพร้อมไพ่ที่ออกไปเป็นแต้ม ถ้าไม่ตรงไพ่จะวางค้างไว้บนโต๊ะ เมื่อไพ่หมดสำรับให้เทียบไพ่สีแดง (โพแดงและข้าวหลามตัด) ที่แต่ละฝ่ายเก็บได้ ไพ่แดงทั่วไปได้ 1 แต้ม ส่วนเลข 10 แจ็ค ควีน และคิงสีแดงได้ใบละ 10 แต้ม ฝ่ายที่แต้มรวมมากกว่าชนะ",
  },
  "dou-dizhu": {
    name: "โจรปล้นเจ้าของที่ดิน",
    subtitle: "เจ้าของที่ดินปะทะชาวนาสองคน",
    rules:
      "หลังแจกไพ่ ระบบจะเลือกเจ้าของที่ดินหนึ่งคน (คุณหรือคอมพิวเตอร์) ตามความแข็งแกร่งของมือไพ่ — เจ้าของที่ดินจะได้ไพ่ซ่อนเพิ่ม 3 ใบ ส่วนอีกสองคนกลายเป็นชาวนาร่วมมือกันต่อสู้กับเจ้าของที่ดิน ผลัดกันออกไพ่ชุดที่แรงกว่าตาก่อนหน้า หรือผ่านถ้าออกไม่ได้ เจ้าของที่ดินเล่นไพ่หมดก่อนชนะให้เจ้าของที่ดิน ชาวนาฝ่ายใดฝ่ายหนึ่งเล่นหมดก่อนชนะให้ฝ่ายชาวนา",
  },
  "liars-cards": {
    name: "ไพ่โป้ปด",
    subtitle: "วางไพ่คว่ำ ประกาศเลข เดาว่าโป้หรือไม่",
    rules:
      "คุณและคอมพิวเตอร์สองคนผลัดกันเล่น: วางไพ่คว่ำ 1-4 ใบแล้วประกาศเลข (เลขต้องไล่ลำดับ A→2→3→...→K→A และคุณจะประกาศตามจริงหรือโป้ก็ได้) ผู้เล่นคนอื่นเลือกเชื่อแล้วส่งต่อตา หรือจับโป้แล้วเปิดไพ่ตรวจสอบ — ถ้าจับถูกผู้ที่วางไพ่ต้องเก็บกองไพ่ทั้งหมดบนโต๊ะคืน ถ้าจับผิดผู้จับต้องเก็บแทน ผู้ที่ไพ่หมดมือก่อนโดยไม่ถูกจับได้โป้เป็นผู้ชนะ",
  },
  "five-pk": {
    name: "โป๊กเกอร์ 5 ใบ",
    subtitle: "จั่วครั้งเดียวแล้วเทียบไพ่ พร้อมตัวเลือกเดิมพันเพิ่มเป็นสองเท่า",
    rules:
      "วางเดิมพันแล้วแจกไพ่ 5 ใบ (มีไพ่โจ๊กเกอร์ 2 ใบในสำรับ) เก็บไพ่ที่ต้องการแล้วจั่วครั้งเดียวเพื่อเปลี่ยนไพ่ที่เหลือ จ่ายตามอันดับไพ่ ตั้งแต่สเตรทฟลัช 500 เท่า ไพ่ตองห้าใบ 200 เท่า ฟลัชสเตรท 120 เท่า ไปจนถึงสองคู่ 1 เท่า หลังชนะสามารถเลือกเดิมพันเพิ่มเป็นสองเท่าแบบสูง/ต่ำ หรือแดง/ดำ หรือจะเก็บเงินออกเมื่อไหร่ก็ได้",
  },
  "little-mary": {
    name: "คลาสสิกลิตเติ้ลแมรี่",
    subtitle: "กรอบไฟหมุน — แทงไพ่ใหญ่หรือเล็ก",
    rules:
      "วางเดิมพันในแต่ละสัญลักษณ์แล้วเริ่ม กรอบไฟจะหมุนเร็ว 3 รอบ แล้วค่อยๆช้าลงจนหยุดภายในครึ่งรอบถึงหนึ่งรอบครึ่ง แตะหยุดเพื่อเรียกก่อนเวลาได้ หยุดที่ลูกศรเสีย หยุดที่สัญลักษณ์ฟรีสปินได้หมุนฟรีอีกครั้ง สัญลักษณ์คงที่จ่ายตามอัตราที่กำหนด สัญลักษณ์ไพ่ใหญ่หรือเล็กจ่ายตามตัวคูณที่วิ่งอยู่ถ้าแทงไว้ หลังหมุนครบจำนวนหนึ่งอาจเข้าสู่รอบโบนัสที่จ่ายสูงคงที่พร้อมเสียงระฆังเฉพาะ",
  },
  "little-mary-2": {
    name: "คลาสสิกลิตเติ้ลแมรี่ II",
    subtitle: "กรอบไฟหมุนธีมกีฬา",
    rules:
      "กลไกการหมุนเหมือนคลาสสิกลิตเติ้ลแมรี่ เปลี่ยนธีมเป็นกีฬา (ฟุตบอล รักบี้ บาสเก็ตบอล โบว์ลิ่ง เทนนิส ปิงปอง กอล์ฟ) วางเดิมพันในแต่ละสัญลักษณ์แล้วเริ่ม — หยุดที่ลูกศรเสีย สัญลักษณ์ฟรีได้หมุนฟรี สัญลักษณ์คงที่จ่ายตามอัตรา สัญลักษณ์กีฬาใหญ่หรือเล็กจ่ายตามตัวคูณที่วิ่งอยู่ถ้าแทงไว้ อาจเข้ารอบโบนัสจ่ายสูงคงที่หลังหมุนครบจำนวนหนึ่ง",
  },
  "little-mary-3": {
    name: "คลาสสิกลิตเติ้ลแมรี่ III",
    subtitle: "แจ็กพอตเทพดอกไม้ — แทงไพ่ใหญ่หรือเล็ก",
    rules:
      "กลไกการหมุนเหมือนคลาสสิกลิตเติ้ลแมรี่ ไฟเทพดอกไม้สามดวงปกติกะพริบอิสระต่อกัน หลังหมุนครบจำนวนหนึ่งอาจซิงค์เข้าสู่สถานะเตือนกะพริบพร้อมกัน ถ้าวงล้อหยุดที่กลุ่มสัญลักษณ์ใหญ่หรือเล็กระหว่างสถานะเตือนนั้น สัญลักษณ์ทั้งสามจะจ่ายรวมกันที่ 3 เท่าของตัวคูณที่วิ่งอยู่ — แจ็กพอตโบนัสที่พบได้ยาก",
  },
  "little-mary-4": {
    name: "คลาสสิกลิตเติ้ลแมรี่ IV",
    subtitle: "แจ็กพอตเทพดอกไม้ธีมสัตว์",
    rules:
      "กลไกเหมือนรุ่นแจ็กพอตเทพดอกไม้ เปลี่ยนธีมเป็นสัตว์ (เสือ มังกร ลิง จิ้งจอก หนู ไก่ตัวผู้ ลูกไก่) สถานะเตือนแจ็กพอตเทพดอกไม้และการจ่าย 3 เท่าทำงานเหมือนเดิม",
  },
  "little-mary-5": {
    name: "คลาสสิกลิตเติ้ลแมรี่ III (ฟีนิกซ์)",
    subtitle: "รุ่นตกแต่งฟีนิกซ์ — แทงไพ่ใหญ่หรือเล็ก",
    rules:
      "กลไกการหมุนเหมือนคลาสสิกลิตเติ้ลแมรี่ ฟีนิกซ์ตัวใหญ่ตรงกลางเป็นเพียงของตกแต่ง กะพริบเร็วขึ้นระหว่างสถานะเตือนโบนัส การหยุดที่สัญลักษณ์ฟรีสปินฝั่งใดฝั่งหนึ่งจะกวาดแสงตกแต่งพาดผ่านกรอบ — เป็นเพียงภาพ ไม่เปลี่ยนแปลงการจ่ายเงิน",
  },
  "little-mary-6": {
    name: "คลาสสิกลิตเติ้ลแมรี่ IV (ฟีนิกซ์)",
    subtitle: "รุ่นตกแต่งฟีนิกซ์ — ธีมเครื่องดื่ม",
    rules:
      "กลไกเหมือนรุ่นตกแต่งฟีนิกซ์ เปลี่ยนธีมเป็นเครื่องดื่ม (กาน้ำชา น้ำผึ้ง ชามาเต้ น้ำแข็งไส เบียร์ ไวน์ ค็อกเทล) ฟีนิกซ์ตกแต่งและเอฟเฟกต์แสงทำงานเหมือนเดิม",
  },
  "little-mary-7": {
    name: "มินิลิตเติ้ลแมรี่ (ทะเล)",
    subtitle: "กรอบมินิ 8×8 — แทงไพ่ใหญ่หรือเล็ก",
    rules:
      "กรอบไฟขนาดเล็กลง 8×8 (28 ตำแหน่ง) ใช้กลไกหมุนแบบเดียวกัน ธีมสัตว์ทะเล (ฉลาม วาฬ โลมา ปลาเขตร้อน ปู เปลือกหอย ฟองน้ำ) หยุดที่ลูกศรเสีย สัญลักษณ์ฟรีได้หมุนฟรี สัญลักษณ์คงที่จ่ายตามอัตรากำหนด สัญลักษณ์ใหญ่หรือเล็กจ่ายตามตัวคูณที่วิ่งอยู่ถ้าแทงไว้ อาจเข้ารอบโบนัสแจ็กพอตหลังหมุนครบจำนวนหนึ่ง",
  },
  "little-mary-8": {
    name: "มินิลิตเติ้ลแมรี่ (ของหวาน)",
    subtitle: "กรอบมินิ 8×8 — ธีมของหวาน",
    rules:
      "กลไกกรอบมินิ 8×8 เหมือนรุ่นทะเล เปลี่ยนธีมเป็นของหวาน (เค้ก เค้กสตรอว์เบอร์รี่ คัพเค้ก โดนัท คุกกี้ ลูกอม อมยิ้ม) อาจเข้ารอบโบนัสแจ็กพอตหลังหมุนครบจำนวนหนึ่งพร้อมเสียงระฆังเฉพาะ",
  },
  "fruit-slot-1": {
    name: "สล็อตผลไม้ I",
    subtitle: "วงล้อคลาสสิก 3×3 ห้าเพย์ไลน์",
    rules:
      "สล็อตผลไม้คลาสสิก 3 วงล้อ 3 แถว มี 5 เพย์ไลน์ (แถวบน กลาง ล่าง และแนวทแยงสองเส้น) ตั้งเดิมพันต่อเส้นแล้วหมุน — แต่ละวงล้อหยุดอิสระจากซ้ายไปขวา แตะหยุดเพื่อเรียกก่อนเวลาได้ สัญลักษณ์เหมือนกันสามตัวบนเพย์ไลน์ใดก็ตามจ่ายตามตาราง ตั้งแต่เลขเจ็ดนำโชค 100 เท่า ลงไปจนถึงเชอร์รี่ 4 เท่า เชอร์รี่สองลูกขึ้นไปที่ไหนก็ได้บนจอจ่ายปลอบใจเล็กน้อย เลขเจ็ดสามตัวบนแถวกลางคือแจ็กพอตพร้อมไฟกระพริบและเสียงระฆังพิเศษ",
  },
  "fruit-slot-2": {
    name: "สล็อตผลไม้ II",
    subtitle: "ธีมผลไม้เขตร้อน ห้าเพย์ไลน์",
    rules:
      "กลไก 3 วงล้อ 5 เพย์ไลน์เหมือนสล็อตผลไม้ I เปลี่ยนธีมเป็นเขตร้อน — เพชรแทนที่เลขเจ็ดนำโชคเป็นสัญลักษณ์แจ็กพอต คู่กับสตรอว์เบอร์รี่ สับปะรด กล้วย ลูกพีช และเชอร์รี่ สัญลักษณ์เหมือนกันสามตัวบนเพย์ไลน์ใดก็ตามจ่ายตามตาราง ตั้งแต่เพชร 100 เท่า ลงไปจนถึงเชอร์รี่ 4 เท่า เพชรสามตัวบนแถวกลางคือแจ็กพอต",
  },
  "little-mary-bonus": {
    name: "คลาสสิกลิตเติ้ลแมรี่ V (โบนัสเลขเจ็ดนำโชค)",
    subtitle: "รอบโบนัสตัวคูณเลขเจ็ดนำโชค",
    rules:
      "กลไกหมุนเหมือนคลาสสิกลิตเติ้ลแมรี่ วางเดิมพันครอบคลุม 8 สัญลักษณ์พร้อมกัน วงล้อตัวเลขสามวงตรงกลางปกติหมุนเป็นเพียงของตกแต่ง เมื่อชนะมีโอกาสเข้าสู่รอบโบนัสที่วงล้อทั้งสามหยุดทีละวง หยุดที่เลขคี่เหมือนกันสามตัวคูณเงินรางวัล 10 เท่า เลขคู่เหมือนกันสามตัวคูณ 5 เท่า — โบนัสสุ่มหายากที่ไม่เกิดขึ้นทุกครั้ง",
  },
  "little-mary-bonus-2": {
    name: "คลาสสิกลิตเติ้ลแมรี่ IV (โบนัสเลขเจ็ดนำโชค เทศกาล)",
    subtitle: "โบนัสเลขเจ็ดนำโชคธีมเทศกาล",
    rules:
      "กลไกเหมือนรุ่นโบนัสเลขเจ็ดนำโชค เปลี่ยนธีมเป็นเทศกาล (อั่งเปา ทองคำแท่ง โคมไฟ ส้ม ขนมไหว้พระจันทร์ พลุ เชอร์รี่) รอบโบนัสและตัวคูณ 10 เท่า/5 เท่าทำงานเหมือนเดิม พร้อมสีสันและเสียงเทศกาล",
  },
  "xiangqi-mahjong": {
    name: "นกกระจอกหมากรุกจีน",
    subtitle: "สร้างชุดจากหมากรุกจีน แข่งกับคอมพิวเตอร์",
    rules:
      "ตั้งเดิมพัน จากนั้นคุณและคอมพิวเตอร์จั่วหมากรุกจีนคนละ 5 ตัว ในตาของคุณจั่วหมากหนึ่งตัว — ถ้าครบคู่บวกชุด (เรียงหรือสามตัวเหมือนกัน) คุณจะชนะด้วยการจั่วเอง มิฉะนั้นทิ้งหมากหนึ่งใน 6 ตัว ถ้าหมากที่คอมพิวเตอร์ทิ้งทำให้มือคุณครบ คุณสามารถเก็บเพื่อชนะ หรือผ่านแล้วจั่วต่อ การจ่าย: คู่ผสมเรียง 2 เท่า คู่เรียงดอกเดียวกัน 3 เท่า ทหารหรือเบี้ยห้าตัว 5 เท่า การเก็บหมากที่ทิ้งจ่ายตามอัตราที่ระบุ จั่วเองได้โบนัสเพิ่ม ถ้าไพ่หมดโดยไม่มีผู้ชนะ เงินเดิมพันจะคืน",
  },
  tuitongzai: {
    name: "ทุยถงไจ๋",
    subtitle: "ไพ่หมากรุกจีนป๊ายเกาสามตำแหน่งพร้อมกัน",
    rules:
      "ใช้หมากนกกระจอกจุด 1-9 (4 ตัวต่อเลข) บวกหมากเปล่า (4 ตัว นับครึ่งแต้ม) แทนสำรับ 40 ใบ วางเดิมพันที่ตำแหน่งหัว สวรรค์ และหาง จากนั้นเจ้ามือและแต่ละตำแหน่งเปิดหมาก 2 ตัวเพื่อเทียบ ลำดับ: เปล่าคู่ (สูงสุด) ชนะคู่ใดๆ ซึ่งชนะชุด 2-8 ซึ่งชนะแต้มปกติ (รวมเลข หลักสุดท้ายนับ เปล่า=0.5 9.5 คือแต้มปกติที่ดีที่สุด 0 คือต่ำสุด) แต่ละตำแหน่งเทียบกับเจ้ามือแยกกัน — ชนะจ่าย 1 เท่า คู่จ่าย 4 เท่า เปล่าคู่จ่าย 10 เท่า แต้มเท่ากันเจ้ามือได้เปรียบตามกติกาบ่อน",
  },
}

const id: GameTable = {
  xiangqi: {
    name: "Catur Cina",
    subtitle: "AI Solo／2 Pemain",
    rules:
      "Bergiliran menggerakkan bidak, siapa yang lebih dulu memojokkan jenderal lawan hingga tak bisa bergerak akan menang. Mengikuti aturan Xiangqi tradisional: Kereta bergerak lurus, Kuda bergerak bentuk L, Gajah bergerak diagonal di wilayah sendiri, Penasihat bergerak diagonal dekat istana, Prajurit bisa bergerak menyamping setelah menyeberangi sungai.",
  },
  "darkchess-classic": {
    name: "Catur Gelap (Klasik)",
    subtitle: "AI Solo／2 Pemain",
    rules: "Semua bidak diletakkan terbalik, setelah dibuka akan memakan sesuai urutan pangkat tradisional. Memakan semua bidak lawan atau membuat lawan tak bisa bergerak akan menang.",
  },
  "darkchess-variant": {
    name: "Catur Gelap (Varian)",
    subtitle: "AI Solo／2 Pemain",
    rules: "Sama seperti Catur Gelap Klasik, tetapi serangan dan lompatan meriam menggunakan aturan varian, menambah taktik baru bagi yang suka tantangan.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Bergiliran menaruh batu hitam-putih di titik pertemuan papan 19×19, siapa yang menguasai wilayah lebih luas akan menang; batu yang terkepung penuh tanpa napas akan ditangkap.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Bergiliran menaruh batu, siapa yang lebih dulu menyusun lima berturut-turut secara horizontal, vertikal, atau diagonal akan menang." },
  othello: {
    name: "Othello",
    subtitle: "Standar",
    rules: "Bergiliran menaruh keping, keping lawan yang terjepit akan berbalik menjadi warna Anda. Di akhir permainan, siapa yang keping lebih banyak akan menang.",
  },
  mahjong: {
    name: "Mahjong Cina",
    subtitle: "AI Solo (3 Komputer)",
    rules: "Bermain bersama tiga lawan komputer, bergiliran mengambil dan membuang kartu, bisa Chow／Pong／Kong kartu buangan pemain lain. Siapa yang lebih dulu menyelesaikan kombinasi menang sah akan menang.",
  },
  luzhanqi: {
    name: "Catur Angkatan Darat",
    subtitle: "AI Solo／2 Pemain",
    rules: "Pangkat bidak kedua pihak dirahasiakan, lawan hanya melihat bagian belakang. Pertarungan ditentukan oleh pangkat; siapa yang lebih dulu merebut bendera lawan atau membuat lawan tak bisa bergerak akan menang.",
  },
  checkers: {
    name: "Dam",
    subtitle: "Standar",
    rules: "Bergiliran menggerakkan bidak secara diagonal, bisa melompati dan memakan bidak lawan. Memakan semua bidak lawan atau membuat lawan tak bisa bergerak akan menang.",
  },
  tictactoe: {
    name: "Tic-Tac-Toe",
    subtitle: "Format Perbesar 3×3",
    rules: "Bergiliran menaruh simbol, siapa yang lebih dulu menyusun tiga berturut-turut secara horizontal, vertikal, atau diagonal akan menang.",
  },
  chess: {
    name: "Catur",
    subtitle: "AI Solo／2 Pemain",
    rules:
      "Bergiliran menggerakkan bidak; siapa yang lebih dulu membuat raja lawan skakmat akan menang. Mengikuti aturan catur standar untuk cara bergerak pion, benteng, kuda, gajah, ratu, dan raja.",
  },
  connect4: {
    name: "Connect Four",
    subtitle: "AI Solo／2 Pemain",
    rules: "Bergiliran menjatuhkan keping ke dalam kotak tegak. Siapa yang lebih dulu menyusun empat berturut-turut secara horizontal, vertikal, atau diagonal akan menang.",
  },
  "chinese-checkers": {
    name: "Dam Cina",
    subtitle: "Papan Bintang",
    rules:
      "Pada papan bintang enam ujung, pindahkan semua bidak Anda ke sudut berlawanan lebih dulu untuk menang. Bidak bisa melangkah atau melompati bidak lain berantai untuk maju.",
  },
  jigsaw: {
    name: "Puzzle Geser",
    subtitle: "Kotak Bernomor",
    rules: "Sentuh kotak di sebelah ruang kosong untuk menggesernya. Susun kotak dari 1 sampai 15 secara berurutan untuk menyelesaikan tantangan.",
  },
  "number-merge": {
    name: "Gabung Angka",
    subtitle: "Gaya 2048",
    rules: "Geser atau gunakan tombol arah. Kotak dengan angka sama bergabung dan berlipat ganda saat bertemu; capai 2048 untuk menang.",
  },
  "memory-match": {
    name: "Tebak Pasangan",
    subtitle: "Tantangan Mencocokkan",
    rules: "Buka dua kartu sekaligus; pasangan yang cocok tetap terbuka. Cocokkan semua pasangan dengan sesedikit mungkin bukaan untuk menang.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Pemain",
    rules: "Lempar dadu untuk menggerakkan bidak Anda keliling papan hingga pulang. Mendarat di bidak lawan mengirimnya kembali ke awal.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Klasik Satu Pemain",
    rules: "Susun semua kartu ke empat tumpukan dasar sesuai jenis dan urutan naik untuk membersihkan papan dan menang.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Rami Ubin vs AI",
    rules: "Gunakan ubin bernomor Anda untuk membentuk deret atau set angka sama, lalu letakkan di meja. Habiskan semua ubin Anda lebih dulu untuk menang.",
  },
  "rps-battle": {
    name: "Batu Gunting Kertas",
    subtitle: "vs AI",
    rules: "Lempar batu, kertas, atau gunting melawan komputer secara bersamaan. Siapa yang memenangkan lebih banyak ronde memenangkan pertandingan.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 Lawan 1 vs AI (Disederhanakan)",
    rules:
      "Anda dan AI masing-masing memegang 2 kartu, ditambah 5 kartu komunitas bersama. Pilih Call untuk membuka tangan, atau Fold untuk menyerah — tangan dengan peringkat lebih tinggi memenangkan pot.",
  },
  war: {
    name: "War",
    subtitle: "Kartu Tertinggi vs AI",
    rules:
      "Kartu dibagi rata. Setiap ronde kedua pihak membuka satu kartu — kartu lebih tinggi menang ronde. Seri memicu pertarungan tambahan; siapa yang memegang lebih banyak kartu di akhir menang.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "vs Dealer",
    rules:
      "Anda dan dealer masing-masing dibagikan 3 kartu. Setelah melihat tangan Anda, Call untuk membuka dan membandingkan, atau Fold untuk menyerah ronde — tangan dengan peringkat lebih tinggi menang.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Puzzle Blok Geser",
    rules: "Geser balok berbagai ukuran dalam ruang papan yang terbatas. Pindahkan balok terbesar ke pintu keluar di bawah untuk menang.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Susun & Hapus Baris",
    rules:
      "Geser kiri atau kanan untuk menggerakkan balok yang jatuh, sentuh untuk memutar, geser bawah untuk menjatuhkan cepat. Penuhi satu baris untuk menghapusnya dan mendapat skor; permainan berakhir jika tumpukan mencapai puncak.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Cocokkan Warna untuk Menghapus",
    rules: "Sentuh satu jalur untuk menembakkan gelembung saat ini. Tiga atau lebih gelembung sama yang terhubung akan terhapus dan mendapat poin; permainan berakhir jika gelembung mencapai puncak.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Tukar untuk Mencocokkan",
    rules:
      "Sentuh satu kotak, lalu sentuh kotak tetangga untuk menukarnya. Mencocokkan 3 atau lebih warna sama menghapusnya dan mengisi ulang dari atas, yang bisa memicu kombinasi berantai.",
  },
  hanoi: {
    name: "Menara Hanoi",
    subtitle: "Pindahkan Cakram",
    rules:
      "Sentuh satu tiang untuk mengambil cakram paling atas, lalu sentuh tiang lain untuk memindahkannya. Cakram besar tidak boleh berada di atas cakram kecil — pindahkan seluruh tumpukan ke tiang paling kanan untuk menang.",
  },
  "water-sort": {
    name: "Puzzle Urutkan Air",
    subtitle: "Tuang untuk Mengurutkan Warna",
    rules:
      "Sentuh tabung untuk mengambil warna paling atas, lalu sentuh tabung lain untuk menuangkannya — hanya ke tabung kosong atau yang berwarna sama di atasnya. Urutkan setiap tabung menjadi satu warna untuk menang.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Putar untuk Menyambungkan",
    rules: "Sentuh kotak pipa untuk memutarnya 90°. Sambungkan sumber air di kiri atas hingga ke pintu keluar di kanan bawah untuk menang.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Timing Jatuhan Anda",
    rules:
      "Balok di atas bergerak kiri dan kanan; sentuh untuk menjatuhkannya ke tumpukan di bawah. Semakin sedikit tumpang tindih, semakin sempit baloknya — melewatkan tumpukan sepenuhnya mengakhiri permainan.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Tukar untuk Mengurutkan",
    rules: "Sentuh dua kotak angka untuk menukar posisinya. Urutkan semua angka dari terkecil ke terbesar dengan sesedikit mungkin tukaran untuk menang.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Kotak 6×6",
    rules:
      "Setiap baris, kolom, dan kotak 2×3 harus berisi angka 1 sampai 6 tanpa pengulangan. Isi seluruh kotak tanpa konflik untuk menang.",
  },
  "shooting-range": {
    name: "Tempat Menembak",
    subtitle: "Target Refleks Cepat",
    rules: "Target menyala acak di seluruh kotak — sentuh secepat mungkin untuk mendapat skor. Capai skor target sebelum waktu habis untuk menang.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Bersihkan Seluruh Armada untuk Menang",
    rules:
      "Bergerak kiri dan kanan untuk menghindari tembakan musuh dan tembak jatuh seluruh armada alien. Tantangan gagal jika armada mendekat atau nyawa Anda habis.",
  },
  "tank-battle": {
    name: "Tank Battle",
    subtitle: "Pertama Mencapai 3 Serangan Menang",
    rules: "Gerakkan tank Anda kiri dan kanan serta tembakkan peluru. Mengenai jalur lawan mendapat poin — jadilah yang pertama mencapai 3 serangan untuk menang.",
  },
  "brick-breaker": {
    name: "Brick Breaker",
    subtitle: "Hancurkan Semua Bata untuk Menang",
    rules:
      "Seret papan pemukul kiri dan kanan untuk memantulkan bola dan menghancurkan semua bata untuk menang. Bola jatuh ke bawah mengurangi nyawa; tantangan gagal jika nyawa habis.",
  },
  "zombie-defense": {
    name: "Zombie Defense",
    subtitle: "Bertahan Setiap Gelombang untuk Menang",
    rules:
      "Zombi bergerak maju di jalur dari kanan; sentuh untuk menghancurkannya (beberapa butuh dua sentuhan). Membiarkan satu mencapai tepi kiri mengurangi nyawa — bertahan setiap gelombang untuk menang.",
  },
  "air-combat": {
    name: "Air Combat",
    subtitle: "Bertahan & Capai Skor Target",
    rules:
      "Pesawat tempur Anda menembak otomatis; gerakkan kiri dan kanan untuk menghindari pesawat musuh dan membersihkannya. Bertahan sampai batas waktu sambil mencapai skor target untuk menang; nyawa habis membuat tantangan gagal.",
  },
  billiards: {
    name: "Biliar",
    subtitle: "Seret untuk Membidik, Bersihkan Semua Bola",
    rules:
      "Seret ke belakang dari bola putih untuk membidik, lalu lepaskan untuk memukul. Masukkan semua bola berwarna sebelum kesempatan pukulan habis untuk menang.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Capai Target Pin dalam 3 Frame",
    rules: "Seret penggeser untuk mengatur sudut lemparan, lalu lepaskan untuk melempar. Capai total target pin jatuh dalam 3 frame untuk menang.",
  },
  "basketball-shoot": {
    name: "Basketball Shootout",
    subtitle: "Timing Tembakan Anda",
    rules: "Meteran tenaga bergerak otomatis maju-mundur — sentuh untuk menembak saat mendekati tengah agar masuk. Cetak cukup gol untuk menang.",
  },
  "penalty-kick": {
    name: "Penalty Kick",
    subtitle: "Pilih Sisi vs Kiper",
    rules: "Pilih kiri, tengah, atau kanan untuk menembak melawan kiper yang melompat secara acak. Cetak cukup gol dalam 5 ronde untuk menang.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Pindah Jalur untuk Hindari Lalu Lintas",
    rules: "Pindah jalur kiri dan kanan untuk menghindari lalu lintas yang datang. Tantangan gagal jika nyawa habis sebelum mencapai jarak finish.",
  },
  parking: {
    name: "Parking Challenge",
    subtitle: "Parkir dalam Batas Langkah",
    rules: "Gunakan kontrol kemudi dan maju untuk parkir tepat di tempat yang ditandai sebelum langkah atau tabrakan Anda habis untuk menang.",
  },
  motocross: {
    name: "Motocross Jump",
    subtitle: "Lompati Lubang hingga Finish",
    rules: "Sentuh untuk melompatkan motor Anda dan melewati lubang di depan dengan timing yang tepat. Tantangan gagal jika nyawa Anda habis sebelum mencapai finish.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Kendalikan Tikungan untuk Skor",
    rules: "Kendalikan sesuai tikungan trek untuk tetap di jalur sambil mengumpulkan poin drift. Capai finish dengan poin cukup untuk menang.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Bergiliran, KO Pertama Menang",
    rules:
      "Pilih Attack untuk mengisi meteran spesial, Guard untuk mengurangi separuh serangan berikutnya, atau lepaskan Finisher saat meteran penuh. Jadilah yang pertama membuat nyawa lawan nol untuk menang.",
  },
  sevens: {
    name: "Sevens (Kartu 7)",
    subtitle: "Rami 4 pemain — sisa poin hukuman terendah menang",
    rules:
      "Mulai dari kartu 7, bergiliran memainkan kartu dengan urutan yang berdekatan di sampingnya. Jika tidak bisa main, tutup kartu untuk menerima hukuman. Saat ada pemain yang selesai, total poin hukuman terendah menang.",
  },
  "sichuan-mahjong": {
    name: "Mahjong Sichuan (Pertarungan Darah)",
    subtitle: "Kurang satu jenis sejak awal, menang masih bisa lanjut main",
    rules:
      "Hanya menggunakan jenis Titik, Bambu, dan Karakter, dan harus kurang satu jenis sejak awal. Pemain yang menang keluar dari meja, sisanya terus bermain sampai tiga orang menang atau kartu habis.",
  },
  "malaysia-mahjong": {
    name: "Mahjong Malaysia 3 Pemain",
    subtitle: "3 pemain, kartu liar membuat kombinasi besar lebih sering muncul",
    rules:
      "Dimainkan oleh 3 pemain dengan set kartu yang dikurangi berupa Titik, kartu Angin/Bunga, dan kartu liar. Set kartu yang lebih kecil ditambah kartu liar membuat kombinasi menang besar jauh lebih sering muncul.",
  },
  "mahjong-pengpeng": {
    name: "Mahjong Peng Peng",
    subtitle: "Mahjong sederhana, hanya peng — tanpa chow",
    rules: "Set kartu sederhana tanpa chow, hanya peng atau tarik sendiri. Bentuk dua set tiga kartu sama ditambah satu pasang untuk menang.",
  },
  "mahjong-sevens": {
    name: "Sevens Mahjong",
    subtitle: "Seperti Sevens, dengan jenis Titik/Bambu/Karakter",
    rules: "Mulai dari kartu angka 5 setiap jenis, bergiliran memainkan angka berdekatan di sampingnya. Jika tidak bisa main, tutup kartu untuk menerima hukuman.",
  },
  "riichi-mahjong": {
    name: "Mahjong Riichi Jepang",
    subtitle: "Ronde Timur — riichi, dora, dan furiten",
    rules:
      "Deklarasikan riichi saat tangan tertutup Anda sudah siap menunggu. Kartu dora yang terbuka menambah han bonus. Furiten mencegah Anda menang dari kartu buangan yang pernah Anda lewatkan. Tangan harus punya minimal satu yaku untuk bisa menang.",
  },
  "mahjong-solitaire": {
    name: "Solitaire Mahjong",
    subtitle: "Cocokkan kartu identik dengan jalur maksimal 2 belokan",
    rules: "Temukan dua kartu identik yang jalur penghubungnya tidak lebih dari dua belokan untuk menghapusnya. Bersihkan seluruh papan sebelum waktu habis untuk menang.",
  },
  "merge-2048": {
    name: "Gabung 2048",
    subtitle: "Geser untuk menggabungkan angka, targetkan 2048",
    rules: "Geser ke arah mana saja — kotak dengan angka sama akan bergabung dan nilainya berlipat ganda saat bertemu. Capai 2048 untuk menang.",
  },
  "city-2048": {
    name: "Kota 2048",
    subtitle: "Gabungkan bangunan dari rumput hingga gedung pencakar langit",
    rules: "Aturan sama seperti 2048, tetapi kotaknya berupa ikon bangunan — gabungkan selangkah demi selangkah dari rumput hingga gedung pencakar langit.",
  },
  "merge-2048-undo": {
    name: "2048 Undo",
    subtitle: "Sama seperti 2048, dengan tombol undo",
    rules: "Aturan sama seperti 2048, tetapi Anda bisa membatalkan geseran jika salah langkah.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Gabungkan bangunan — waspadai beruang yang berkeliaran",
    rules:
      "Di papan 6×6, tiga item yang sama akan bergabung menjadi tingkat berikutnya. Beruang berkeliaran dan menghalangi ruang Anda — kepung sepenuhnya satu beruang untuk mengubahnya menjadi batu nisan, yang juga bisa digabungkan.",
  },
  suika: {
    name: "Gabung Buah Suika",
    subtitle: "Gerakkan kiri/kanan dan jatuhkan buah — buah sama bergabung jadi lebih besar",
    rules: "Gerakkan kiri kanan untuk memilih tempat buah jatuh. Buah yang sama akan bergabung menjadi ukuran yang lebih besar — usahakan mencapai semangka raksasa.",
  },
  "drop-2048": {
    name: "2048 Jatuh",
    subtitle: "Blok angka jatuh, menumpuk, dan bergabung",
    rules: "Blok angka jatuh dari atas; gerakkan kiri kanan untuk memilih kolom. Angka yang sama bergabung dan berlipat ganda saat menumpuk.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Pasangan jatuh — hapus saat 4+ warna sama terhubung",
    rules:
      "Pasangan blob berwarna jatuh dari atas; gerakkan dan putar mereka. Hubungkan 4 atau lebih warna yang sama untuk menghapusnya, yang bisa memicu reaksi berantai.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Tumpuk kapsul yang jatuh untuk menghapus virus dalam satu baris",
    rules: "Kapsul dua warna jatuh dan menumpuk; susun 4 blok warna sama termasuk virus menjadi satu baris untuk menghapusnya. Hapus semua virus untuk menang.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Beralih antara dua game blok jatuh klasik",
    rules: "Beralih antara Columns (cocokkan 3+ permata dalam satu baris) dan Tetris (hapus baris penuh) dari layar yang sama.",
  },
  "candy-crush": {
    name: "Candy Crush",
    subtitle: "Tukar permen membentuk 3 sejajar, capai skor target",
    rules:
      "Tukar permen yang bersebelahan untuk membentuk kombinasi 3 atau lebih. Permen spesial dari kombinasi besar menghapus seluruh baris atau warna — capai skor target dalam batas langkah untuk menang.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Game cocok-3 original — tukar permata untuk menghapus baris",
    rules: "Tukar permata yang bersebelahan untuk membentuk baris 3 atau lebih permata yang cocok. Rangkai combo untuk poin bonus saat mengejar skor tertinggi baru.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Cocok-3 untuk koin guna memulihkan taman terbengkalai",
    rules: "Hapus kombinasi untuk mendapatkan koin, lalu gunakan untuk menyelesaikan tugas restorasi taman.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Cocok-3 untuk koin guna mendekorasi rumah mewah impian",
    rules: "Hapus kombinasi untuk mendapatkan koin, lalu gunakan untuk menyelesaikan tugas dekorasi rumah mewah.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Cocok-3 untuk koin guna memulihkan kastil tua",
    rules: "Hapus kombinasi untuk mendapatkan koin, lalu gunakan untuk menyelesaikan tugas restorasi kastil.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Cocokkan permata + pembangunan tim bertarung dengan kartu",
    rules: "Mencocokkan permata memicu serangan dari rekan tim dengan elemen yang sama. Kalahkan musuh untuk menaikkan level tim dan melaju lebih jauh.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Cocokkan permata + pertarungan keuntungan elemen",
    rules: "Mencocokkan permata memicu serangan; gunakan keuntungan elemen untuk memberikan kerusakan bonus dan mengalahkan musuh.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Cocokkan permata + pembangunan kota ringan dan PvP",
    rules: "Mencocokkan permata memicu serangan pahlawan; kalahkan lawan untuk mendapatkan material bangunan guna mengembangkan kerajaan Anda.",
  },
  "sheep-sheep": {
    name: "Domba vs Domba (Sheep a Sheep)",
    subtitle: "Kumpulkan ubin dari tumpukan, hapus set 3",
    rules:
      "Ketuk ubin yang tidak terhalang untuk mengirimnya ke slot koleksi. Tiga ubin yang cocok akan terhapus otomatis — jika slot penuh sebelum set lengkap, Anda kalah.",
  },
  match3d: {
    name: "Match 3D",
    subtitle: "Kumpulkan dari tumpukan 3D untuk menghapus cocok-3",
    rules: "Ide yang sama dengan Domba vs Domba, tetapi ubinnya berupa tumpukan objek 3D — temukan dan kumpulkan set yang cocok sebanyak 3.",
  },
  "balls-merge": {
    name: "Gabung Bola",
    subtitle: "Gerakkan dan jatuhkan — bola yang sama bergabung jadi lebih besar",
    rules: "Mekanisme sama dengan Gabung Buah Suika, bertema bola — bola yang sama bergabung menjadi ukuran yang lebih besar.",
  },
  "cookies-merge": {
    name: "Gabung Kue Kering",
    subtitle: "Gerakkan dan jatuhkan — kue kering yang sama bergabung jadi lebih besar",
    rules: "Mekanisme sama dengan Gabung Buah Suika, bertema kue kering — kue kering yang sama bergabung menjadi ukuran yang lebih besar.",
  },
  "planets-merge": {
    name: "Gabung Planet",
    subtitle: "Gerakkan dan jatuhkan — planet yang sama bergabung jadi lebih besar",
    rules: "Mekanisme sama dengan Gabung Buah Suika, bertema planet — planet yang sama bergabung menjadi ukuran yang lebih besar.",
  },
  "mahjong-ninepoint5": {
    name: "Mahjong 9,5",
    subtitle: "Kartu mahjong pengganti kartu remi, paling mendekati 9,5 menang",
    rules: "Mainkan 9,5 (gaya blackjack) menggunakan kartu mahjong sebagai pengganti kartu remi. Tarik tambahan atau berhenti — siapa yang paling mendekati 9,5 tanpa melebihi akan menang.",
  },
  "mahjong-niuniu": {
    name: "Mahjong Niu Niu",
    subtitle: "Kartu mahjong pengganti kartu remi, bentuk kelipatan 10",
    rules:
      "Mainkan Niu Niu menggunakan kartu mahjong sebagai pengganti kartu remi. Dari 5 kartu, temukan 3 yang jumlahnya kelipatan 10, lalu bandingkan skor 2 kartu sisanya.",
  },
  "dragon-gate": {
    name: "Gerbang Naga",
    subtitle: "Dua kartu Titik mahjong membuka gerbang, bertaruh pada rentangnya",
    rules: "Dua kartu Titik membuka gerbang; pasang taruhan, lalu kartu ketiga ditarik. Jatuh di antara gerbang menang, di luar kalah, dan sama dengan salah satu tiang menggandakan kekalahan.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Melawan dealer mendekati 21",
    rules:
      "Dekati 21 sedekat mungkin tanpa melebihi. As dihitung 1 atau 11, kartu bergambar dihitung 10. Pilih Tambah atau Berhenti — dealer harus terus menarik kartu sampai mencapai 17 atau lebih.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Bertaruh pada Player, Banker, atau Tie sebelum kartu dibagikan. Total tangan menggunakan digit terakhir dari jumlah; total lebih besar menang. Kartu tambahan ditarik otomatis sesuai aturan baccarat standar.",
  },
  "ten-half": {
    name: "Sepuluh Setengah",
    subtitle: "Lebih dekat ke 10,5 daripada dealer",
    rules:
      "Pasang taruhan, lalu kedua pihak dibagikan 2 kartu. Pilih Tambah atau Berhenti — siapa yang lebih dekat ke 10,5 tanpa melebihi menang. As dihitung 1 poin, kartu bergambar 0,5 poin. Dapat 10,5 langsung saat dibagikan membayar 3x, menang biasa membayar 2x, seri mengembalikan taruhan.",
  },
  "thirteen-water": {
    name: "Tiga Belas Kartu",
    subtitle: "Bagi 13 kartu menjadi 3 tangan melawan dealer",
    rules:
      "Pasang taruhan dan bagikan kartu. Sistem otomatis menyusun 13 kartu Anda dan dealer menjadi tangan depan 3 kartu, tangan tengah 5 kartu, dan tangan belakang 5 kartu, masing-masing dibandingkan terpisah. Menang ketiga tangan membayar 5x, menang 2 tangan membayar 2x, menang 1 tangan membayar 1,5x, seri impas, kalah lebih banyak dari menang kehilangan taruhan.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Mainkan kartu tunggal atau pasangan untuk menghabiskan kartu lebih dulu",
    rules:
      "Pasang taruhan dan lawan dealer. Mainkan kartu tunggal atau pasangan angka sama yang lebih kuat dari giliran sebelumnya, atau lewati. Urutan angka 3 terlemah sampai 2 terkuat, seri dibandingkan dengan jenis kartu. Habiskan 13 kartu lebih dulu untuk menang 2x taruhan.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Bandingkan 5 kartu langsung dengan dealer",
    rules:
      "Pasang taruhan, lalu Anda dan dealer masing-masing dibagikan 5 kartu dan membandingkan peringkat tangan langsung — straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair, kartu tinggi. Tangan lebih kuat menang 2x, seri mengembalikan taruhan.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Bentuk kelipatan 10 dari 5 kartu untuk skor banteng terbaik",
    rules:
      "Pasang taruhan, lalu Anda dan dealer masing-masing dibagikan 5 kartu. Pilih 3 kartu yang jumlahnya kelipatan 10 ('banteng'); digit terakhir dari 2 kartu sisanya adalah skor Anda, lebih tinggi lebih baik. Tepat 10 adalah tangan 'Banteng Banteng' tertinggi; tidak ada kombinasi valid adalah 'Tanpa Banteng', terendah. Skor lebih tinggi menang 2x, seri mengembalikan taruhan. Kartu bergambar dihitung 10, As dihitung 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Bandingkan 3 kartu langsung dengan dealer",
    rules:
      "Pasang taruhan, lalu Anda dan dealer masing-masing dibagikan 3 kartu dan membandingkan peringkat tangan langsung — three of a kind, straight flush, flush, straight, pair, kartu tinggi. Tangan lebih kuat menang 2x, seri mengembalikan taruhan.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 babak pembagian — lipat atau gandakan taruhan di setiap babak",
    rules:
      "Pasang taruhan awal. Kartu dibagikan dalam 4 babak (3, lalu 2, lalu 1, lalu 2 terakhir dibuka), dan setelah setiap babak Anda bisa melipat atau menggandakan taruhan. Tangan 5 kartu terbaik dari 7 kartu Anda menentukan hasil. Melipat kehilangan total taruhan saat ini; menang membayar sesuai peringkat tangan, dari royal flush 150x sampai two pair 1x.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Berpasangan melawan dua lawan komputer",
    rules:
      "Anda dan partner Utara Anda bermain melawan Barat dan Timur, keduanya dikendalikan komputer. Setiap trik, keempat pemain bermain secara bergiliran dan harus mengikuti jenis kartu jika memungkinkan; jika tidak, boleh memainkan jenis kartu atau truf apa pun. Kartu tertinggi dari jenis yang dimainkan, atau truf tertinggi, memenangkan trik. Setelah 13 trik selesai, memenangkan 7 trik atau lebih sebagai pasangan memenangkan tangan.",
  },
  "pick-red-points": {
    name: "Kumpulkan Poin Merah",
    subtitle: "Cocokkan kartu yang dimainkan dengan kartu di meja",
    rules:
      "Bergiliran memainkan satu kartu: jika angkanya cocok dengan kartu di meja, sapu semua kartu dengan angka itu plus kartu Anda untuk mendapat poin. Jika tidak cocok, kartu tetap di meja. Setelah kartu habis, bandingkan hati／wajik merah yang terkumpul masing-masing pihak — kartu merah biasa bernilai 1 poin, 10／J／Q／K merah bernilai 10 poin masing-masing. Total lebih tinggi menang.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Lawan Tuan Tanah)",
    subtitle: "Tuan tanah melawan dua petani",
    rules:
      "Setelah pembagian kartu, sistem menetapkan satu Tuan Tanah (Anda atau komputer) berdasarkan kekuatan tangan — Tuan Tanah mendapat 3 kartu tersembunyi tambahan, dan dua lainnya menjadi Petani yang bekerja sama melawannya. Bergiliran memainkan kombinasi yang lebih kuat dari sebelumnya, atau lewati jika tidak bisa. Tuan Tanah menang jika menghabiskan kartu lebih dulu; Petani menang jika salah satu dari mereka selesai lebih dulu.",
  },
  "liars-cards": {
    name: "Kartu Pembohong",
    subtitle: "Mainkan tertutup, sebutkan angkanya, tebak kebohongannya",
    rules:
      "Anda dan dua lawan komputer bergiliran: mainkan 1–4 kartu tertutup dan umumkan sebuah angka (angka harus berurutan A→2→3→...→K→A, dan Anda bisa jujur atau berbohong). Pemain lain bisa Percaya dan melanjutkan giliran, atau Tantang kebohongan dengan membuka kartu untuk memeriksa — tantangan benar membuat pemain yang memainkan kartu mengambil kembali seluruh tumpukan meja, tantangan salah membuat penantang yang mengambilnya. Yang pertama menghabiskan kartu tanpa ketahuan berbohong menang.",
  },
  "five-pk": {
    name: "Poker 5 Kartu",
    subtitle: "Tarik sekali, lalu bandingkan tangan dengan opsi gandakan",
    rules:
      "Pasang taruhan, lalu dibagikan 5 kartu (2 joker ada dalam kartu). Simpan kartu yang Anda mau dan tarik sekali untuk mengganti sisanya. Tangan membayar sesuai peringkat — straight flush 500x, five of a kind 200x, flush straight 120x, hingga two pair 1x. Setelah menang, Anda bisa menggandakan dengan menebak besar/kecil atau merah/hitam, atau ambil kemenangan kapan saja.",
  },
  "little-mary": {
    name: "Little Mary Klasik",
    subtitle: "Bingkai lampu berputar — bertaruh pada kartu besar atau kecil",
    rules:
      "Pasang taruhan pada setiap simbol, lalu mulai. Bingkai lampu berputar cepat selama 3 putaran, lalu melambat untuk berhenti dalam setengah hingga satu setengah putaran — sentuh Stop untuk menghentikannya lebih awal. Berhenti di panah kalah; berhenti di simbol putaran gratis memberi putaran ulang gratis; simbol tetap membayar kelipatan tertentu; simbol kartu besar atau kecil membayar sesuai pengganda berjalan jika Anda bertaruh pada simbol itu. Setelah cukup banyak putaran, ronde bonus mungkin dipicu dengan pembayaran tetap lebih tinggi dan nada khas.",
  },
  "little-mary-2": {
    name: "Little Mary Klasik II",
    subtitle: "Bingkai lampu berputar bertema olahraga",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik, diubah tema menjadi olahraga (sepak bola, rugbi, basket, bowling, tenis, tenis meja, golf). Pasang taruhan pada setiap simbol lalu mulai — berhenti di panah kalah, simbol gratis memberi putaran ulang gratis, simbol tetap membayar kelipatan tertentu, dan simbol olahraga besar atau kecil membayar sesuai pengganda berjalan jika dipertaruhkan. Ronde bonus mungkin dipicu setelah cukup banyak putaran dengan pembayaran tetap tinggi.",
  },
  "little-mary-3": {
    name: "Little Mary Klasik III",
    subtitle: "Jackpot dewa bunga — bertaruh pada besar atau kecil",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik. Tiga lampu dewa bunga biasanya berkedip independen; setelah cukup banyak putaran bisa tersinkron menjadi status siaga berkedip. Jika gulungan berhenti di kelompok simbol besar atau kecil saat siaga itu, ketiga simbol membayar bersama 3x pengganda berjalan — bonus jackpot langka.",
  },
  "little-mary-4": {
    name: "Little Mary Klasik IV",
    subtitle: "Jackpot dewa bunga bertema hewan",
    rules:
      "Mekanisme sama seperti edisi Jackpot Dewa Bunga, diubah tema menjadi hewan (harimau, naga, monyet, rubah, tikus, ayam jantan, anak ayam). Siaga jackpot dewa bunga dan pembayaran 3x bekerja identik.",
  },
  "little-mary-5": {
    name: "Little Mary Klasik III (Phoenix)",
    subtitle: "Edisi dekorasi phoenix — bertaruh pada besar atau kecil",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik. Phoenix besar di tengah murni dekoratif, berkedip lebih cepat selama siaga bonus. Berhenti di salah satu simbol putaran gratis menyapu jejak cahaya dekoratif di bingkai — hanya visual, tidak mengubah pembayaran.",
  },
  "little-mary-6": {
    name: "Little Mary Klasik IV (Phoenix)",
    subtitle: "Edisi dekorasi phoenix — bertema minuman",
    rules:
      "Mekanisme sama seperti edisi Dekorasi Phoenix, diubah tema menjadi minuman (teko teh, madu, teh mate, es serut, bir, anggur, koktail). Efek phoenix dekoratif dan jejak cahaya bekerja identik.",
  },
  "little-mary-7": {
    name: "Little Mary Mini (Laut)",
    subtitle: "Bingkai mini 8×8 — bertaruh pada besar atau kecil",
    rules:
      "Bingkai lampu 8×8 yang lebih kecil (28 posisi) dengan mekanisme putaran sama, bertema hewan laut (hiu, paus, lumba-lumba, ikan tropis, kepiting, kerang, gelembung). Berhenti di panah kalah, simbol gratis memberi putaran ulang gratis, simbol tetap membayar kelipatan tertentu, dan simbol besar atau kecil membayar sesuai pengganda berjalan jika dipertaruhkan. Ronde bonus jackpot mungkin dipicu setelah cukup banyak putaran.",
  },
  "little-mary-8": {
    name: "Little Mary Mini (Pencuci Mulut)",
    subtitle: "Bingkai mini 8×8 — bertema pencuci mulut",
    rules:
      "Mekanisme bingkai mini 8×8 sama seperti edisi Laut, diubah tema menjadi pencuci mulut (kue, kue stroberi, cupcake, donat, kukis, permen, lolipop). Ronde bonus jackpot mungkin dipicu setelah cukup banyak putaran dengan nada khas.",
  },
  "fruit-slot-1": {
    name: "Gulungan Buah I",
    subtitle: "Gulungan klasik 3×3, 5 garis bayar",
    rules:
      "Mesin buah klasik 3 gulungan, 3 baris dengan 5 garis bayar (baris atas, tengah, bawah plus kedua diagonal). Pasang taruhan per garis, lalu putar — setiap gulungan berhenti sendiri dari kiri ke kanan, dan Anda bisa sentuh Stop untuk menghentikannya lebih awal. Tiga simbol sama di garis bayar mana pun membayar sesuai tabel, dari 7 keberuntungan 100x hingga ceri 4x; dua atau lebih ceri di mana pun di layar membayar hadiah hiburan kecil; tiga 7 di baris tengah adalah jackpot dengan pertunjukan cahaya dan nada khasnya sendiri.",
  },
  "fruit-slot-2": {
    name: "Gulungan Buah II",
    subtitle: "Tema buah tropis, 5 garis bayar",
    rules:
      "Mekanisme sama seperti Gulungan Buah I, 3 gulungan dengan 5 garis bayar, diubah tema tropis — berlian menggantikan 7 keberuntungan sebagai simbol jackpot, dipasangkan dengan stroberi, nanas, pisang, persik, dan ceri. Tiga simbol sama di garis bayar mana pun membayar sesuai tabel, dari berlian 100x hingga ceri 4x; tiga berlian di baris tengah adalah jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Klasik V (Bonus 7 Keberuntungan)",
    subtitle: "Ronde bonus pengganda tujuh keberuntungan",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik, dengan taruhan dipasang di 8 simbol sekaligus. Tiga gulungan angka di tengah biasanya berputar murni dekoratif; saat menang ada kemungkinan memicu ronde bonus di mana ketiga gulungan berhenti satu per satu. Berhenti di tiga angka ganjil yang sama menggandakan kemenangan Anda 10x, tiga angka genap yang sama 5x — bonus acak langka yang tidak selalu terpicu.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Klasik IV (Bonus 7 Keberuntungan, Perayaan)",
    subtitle: "Bonus tujuh keberuntungan bertema perayaan",
    rules:
      "Mekanisme sama seperti edisi Bonus Tujuh Keberuntungan, diubah tema menjadi perayaan (angpau merah, batangan emas, lampion, jeruk mandarin, kue bulan, kembang api, ceri). Ronde bonus dan pengganda kecocokan angka 10x/5x bekerja identik, dengan warna dan efek suara perayaan.",
  },
  "xiangqi-mahjong": {
    name: "Mahjong Xiangqi",
    subtitle: "Bentuk set dari bidak catur, balapan melawan komputer untuk menang",
    rules:
      "Pasang taruhan, lalu Anda dan komputer masing-masing menarik 5 bidak Catur Cina. Pada giliran Anda, tarik satu bidak — jika melengkapi pasangan plus satu set (deret atau tiga sama), Anda menang dengan tarik sendiri. Jika tidak, buang satu dari 6 bidak Anda. Jika buangan komputer melengkapi tangan Anda, Anda bisa mengklaimnya untuk menang, atau lewati dan terus menarik. Pembayaran: 2x untuk pasangan-deret campuran, 3x untuk pasangan-deret jenis sama, 5x untuk lima prajurit atau pion; mengklaim buangan membayar sesuai tarif yang tercantum, tarik sendiri menambah bonus. Jika kartu habis tanpa pemenang, taruhan dikembalikan.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Dorong Silinder)",
    subtitle: "Pai gow kartu mahjong di tiga posisi sekaligus",
    rules:
      "Menggunakan kartu titik mahjong 1–9 (4 masing-masing) ditambah kartu kosong (4, bernilai setengah poin) untuk mewakili 40 kartu. Pasang taruhan pada posisi kepala, langit, dan ekor, lalu dealer dan setiap posisi membuka 2 kartu untuk dibandingkan. Urutan peringkat: kosong ganda (tertinggi) mengalahkan pasangan apa pun, yang mengalahkan kombinasi 2-8, yang mengalahkan total poin normal (jumlah digit, digit terakhir dihitung, kosong = 0,5, 9,5 adalah total normal terbaik, 0 terendah). Setiap posisi dibandingkan dengan dealer secara independen — menang membayar 1x, pasangan membayar 4x dan kosong ganda membayar 10x; total yang sama menguntungkan dealer sesuai aturan rumah.",
  },
  }
}

const ms: GameTable = {
  xiangqi: {
    name: "Catur Cina",
    subtitle: "AI Solo／2 Pemain",
    rules:
      "Bergilir menggerakkan buah catur, sesiapa yang lebih dahulu memojokkan jeneral lawan hingga tidak boleh bergerak akan menang. Mengikut peraturan Xiangqi tradisional: Kereta bergerak lurus, Kuda bergerak bentuk L, Gajah bergerak menyerong di kawasan sendiri, Penasihat bergerak menyerong berhampiran istana, Askar boleh bergerak ke tepi selepas menyeberangi sungai.",
  },
  "darkchess-classic": {
    name: "Catur Gelap (Klasik)",
    subtitle: "AI Solo／2 Pemain",
    rules: "Semua buah diletakkan terbalik, selepas dibuka akan makan mengikut susunan pangkat tradisional. Memakan semua buah lawan atau menjadikan lawan tidak boleh bergerak akan menang.",
  },
  "darkchess-variant": {
    name: "Catur Gelap (Varian)",
    subtitle: "AI Solo／2 Pemain",
    rules: "Sama seperti versi klasik, tetapi serangan dan lompatan meriam menggunakan peraturan varian, menambah taktik baharu.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Bergilir meletakkan batu hitam-putih pada titik silang papan 19×19, sesiapa yang menguasai kawasan lebih luas akan menang; batu yang terkepung sepenuhnya tanpa nafas akan ditawan.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Bergilir meletakkan batu, sesiapa yang lebih dahulu menyusun lima secara mendatar, menegak, atau serong akan menang." },
  othello: {
    name: "Othello",
    subtitle: "Standard",
    rules: "Bergilir meletakkan cakera, cakera lawan yang terapit akan bertukar menjadi warna anda. Di penghujung permainan, sesiapa yang mempunyai cakera lebih banyak akan menang.",
  },
  mahjong: {
    name: "Mahjong Cina",
    subtitle: "AI Solo (3 Komputer)",
    rules: "Bermain bersama tiga lawan komputer, bergilir mengambil dan membuang jubin, boleh Chow／Pong／Kong jubin buangan pemain lain. Sesiapa yang lebih dahulu menyempurnakan kombinasi menang sah akan menang.",
  },
  luzhanqi: {
    name: "Catur Tentera Darat",
    subtitle: "AI Solo／2 Pemain",
    rules: "Pangkat buah kedua-dua pihak dirahsiakan, lawan hanya nampak bahagian belakang. Pertempuran ditentukan oleh pangkat; sesiapa yang merampas bendera lawan atau menjadikan lawan tidak boleh bergerak akan menang.",
  },
  checkers: {
    name: "Dam",
    subtitle: "Standard",
    rules: "Bergilir menggerakkan buah secara menyerong, boleh melompat untuk menawan buah lawan. Menawan semua buah lawan atau menjadikan lawan tidak boleh bergerak akan menang.",
  },
  tictactoe: {
    name: "Tic-Tac-Toe",
    subtitle: "Format Diperbesar 3×3",
    rules: "Bergilir meletakkan simbol, sesiapa yang lebih dahulu menyusun tiga secara mendatar, menegak, atau serong akan menang.",
  },
  sevens: {
    name: "Sevens (Kad 7)",
    subtitle: "Rami 4 pemain — baki mata penalti terendah menang",
    rules:
      "Bermula daripada kad 7, bergilir-gilir memainkan kad bersebelahan nombor di sisinya. Jika tidak boleh main, tutup kad untuk menerima penalti. Apabila seorang pemain selesai, jumlah penalti terendah menang.",
  },
  "sichuan-mahjong": {
    name: "Mahjong Sichuan (Pertempuran Berdarah)",
    subtitle: "Kekurangan satu jenis dari awal, pemenang boleh terus main",
    rules:
      "Hanya menggunakan jenis Titik, Buluh, dan Aksara, dan mesti kekurangan satu jenis sejak permulaan. Pemain yang menang keluar dari meja, selebihnya terus bermain sehingga tiga orang menang atau kad habis.",
  },
  "malaysia-mahjong": {
    name: "Mahjong Malaysia 3 Pemain",
    subtitle: "3 pemain, kad liar menjadikan kombinasi besar lebih kerap",
    rules:
      "Dimainkan oleh 3 pemain dengan set kad yang dikurangkan iaitu Titik, kad Angin/Bunga, dan kad liar. Set kad yang lebih kecil ditambah kad liar menjadikan kombinasi menang besar lebih kerap muncul.",
  },
  "mahjong-pengpeng": {
    name: "Mahjong Pong Pong",
    subtitle: "Mahjong ringkas, hanya pong — tanpa chow",
    rules: "Set kad ringkas tanpa chow, hanya pong atau tarik sendiri. Bentuk dua set tiga kad sama ditambah satu pasang untuk menang.",
  },
  "mahjong-sevens": {
    name: "Sevens Mahjong",
    subtitle: "Seperti Sevens, dengan jenis Titik/Buluh/Aksara",
    rules: "Bermula daripada kad nombor 5 setiap jenis, bergilir-gilir memainkan nombor bersebelahan di sisinya. Jika tidak boleh main, tutup kad untuk menerima penalti.",
  },
  "riichi-mahjong": {
    name: "Mahjong Riichi Jepun",
    subtitle: "Pusingan Timur — riichi, dora, dan furiten",
    rules:
      "Isytiharkan riichi apabila tangan tertutup anda sudah bersedia menunggu. Kad dora yang terbuka menambah han bonus. Furiten menghalang anda menang daripada kad buangan yang pernah anda lepaskan. Tangan mesti ada sekurang-kurangnya satu yaku untuk menang.",
  },
  "mahjong-solitaire": {
    name: "Solitaire Mahjong",
    subtitle: "Padankan kad serupa dengan laluan maksimum 2 selekoh",
    rules: "Cari dua kad serupa yang laluan penghubungnya tidak melebihi dua selekoh untuk mengosongkannya. Kosongkan seluruh papan sebelum masa tamat untuk menang.",
  },
  "merge-2048": {
    name: "Gabung 2048",
    subtitle: "Leret untuk menggabungkan nombor, sasarkan 2048",
    rules: "Leret ke mana-mana arah — petak bernombor sama akan bergabung dan nilainya berganda apabila bertembung. Capai 2048 untuk menang.",
  },
  "city-2048": {
    name: "Bandar 2048",
    subtitle: "Gabungkan bangunan dari rumput hingga bangunan pencakar langit",
    rules: "Peraturan sama seperti 2048, tetapi petaknya ikon bangunan — gabungkan selangkah demi selangkah dari rumput hingga bangunan pencakar langit.",
  },
  "merge-2048-undo": {
    name: "2048 Buat Asal",
    subtitle: "Sama seperti 2048, dengan butang buat asal",
    rules: "Peraturan sama seperti 2048, tetapi anda boleh membuat asal satu leretan jika tersilap langkah.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Gabungkan bangunan — berhati-hati dengan beruang yang merayau",
    rules:
      "Di papan 6×6, tiga item serupa bergabung menjadi tingkat seterusnya. Beruang merayau dan menghalang ruang anda — kepung sepenuhnya seekor beruang untuk menukarnya menjadi batu nisan, yang juga boleh digabungkan.",
  },
  suika: {
    name: "Gabung Buah Suika",
    subtitle: "Gerak kiri/kanan dan jatuhkan buah — buah sama bergabung jadi lebih besar",
    rules: "Gerak kiri kanan untuk memilih tempat buah jatuh. Buah yang sama bergabung menjadi saiz lebih besar — cuba capai tembikai gergasi.",
  },
  "drop-2048": {
    name: "2048 Jatuh",
    subtitle: "Blok nombor jatuh, bertindan, dan bergabung",
    rules: "Blok nombor jatuh dari atas; gerak kiri kanan untuk memilih lajur. Nombor yang sama bergabung dan berganda apabila bertindan.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Pasangan jatuh — kosongkan apabila 4+ warna sama bersambung",
    rules:
      "Pasangan blob berwarna jatuh dari atas; gerak dan pusingkan. Sambungkan 4 atau lebih warna sama untuk mengosongkannya, yang boleh mencetuskan reaksi rantai.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Timbunkan kapsul jatuh untuk kosongkan virus dalam satu baris",
    rules: "Kapsul dua warna jatuh dan bertindan; susun 4 blok warna sama termasuk virus menjadi satu baris untuk mengosongkannya. Kosongkan semua virus untuk menang.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Tukar antara dua permainan blok jatuh klasik",
    rules: "Tukar antara Columns (padankan 3+ batu permata dalam satu baris) dan Tetris (kosongkan baris penuh) pada skrin yang sama.",
  },
  "candy-crush": {
    name: "Candy Crush",
    subtitle: "Tukar gula-gula untuk 3 sebaris, capai skor sasaran",
    rules:
      "Tukar gula-gula bersebelahan untuk membentuk padanan 3 atau lebih. Gula-gula istimewa daripada padanan besar mengosongkan keseluruhan baris atau warna — capai skor sasaran dalam had langkah untuk menang.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Permainan padan-3 asal — tukar batu permata untuk kosongkan baris",
    rules: "Tukar batu permata bersebelahan untuk membentuk baris 3 atau lebih batu permata sepadan. Rantaikan gabungan untuk mata bonus semasa mengejar skor tertinggi baharu.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Padan-3 untuk duit syiling membaik pulih taman terbiar",
    rules: "Kosongkan padanan untuk mendapatkan duit syiling, kemudian gunakannya untuk menyelesaikan tugas pembaikan taman.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Padan-3 untuk duit syiling menghias rumah agam impian",
    rules: "Kosongkan padanan untuk mendapatkan duit syiling, kemudian gunakannya untuk menyelesaikan tugas hiasan rumah agam.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Padan-3 untuk duit syiling membaik pulih istana lama",
    rules: "Kosongkan padanan untuk mendapatkan duit syiling, kemudian gunakannya untuk menyelesaikan tugas pembaikan istana.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Padankan batu permata + bina pasukan bertarung dengan kad",
    rules: "Memadankan batu permata mencetuskan serangan daripada rakan sepasukan elemen sama. Kalahkan musuh untuk naikkan tahap pasukan dan terus maju.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Padankan batu permata + pertarungan kelebihan elemen",
    rules: "Memadankan batu permata mencetuskan serangan; gunakan kelebihan elemen untuk memberi kerosakan tambahan dan mengalahkan musuh.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Padankan batu permata + pembinaan bandar ringan dan PvP",
    rules: "Memadankan batu permata mencetuskan serangan wira; kalahkan lawan untuk mendapatkan bahan binaan dan membesarkan empayar anda.",
  },
  "sheep-sheep": {
    name: "Biri-biri Lawan Biri-biri",
    subtitle: "Kumpul jubin daripada timbunan, kosongkan set 3",
    rules:
      "Ketik jubin yang tidak terhalang untuk hantar ke slot kutipan. Tiga jubin sepadan akan kosong secara automatik — jika slot penuh sebelum set lengkap, anda tewas.",
  },
  match3d: {
    name: "Match 3D",
    subtitle: "Kumpul daripada timbunan 3D untuk kosongkan padan-3",
    rules: "Idea sama seperti Biri-biri Lawan Biri-biri, tetapi jubinnya timbunan objek 3D — cari dan kumpul set sepadan sebanyak 3.",
  },
  "balls-merge": {
    name: "Gabung Bola",
    subtitle: "Gerak dan jatuhkan — bola sama bergabung jadi lebih besar",
    rules: "Mekanisme sama dengan Gabung Buah Suika, bertemakan bola — bola yang sama bergabung menjadi saiz lebih besar.",
  },
  "cookies-merge": {
    name: "Gabung Biskut",
    subtitle: "Gerak dan jatuhkan — biskut sama bergabung jadi lebih besar",
    rules: "Mekanisme sama dengan Gabung Buah Suika, bertemakan biskut — biskut yang sama bergabung menjadi saiz lebih besar.",
  },
  "planets-merge": {
    name: "Gabung Planet",
    subtitle: "Gerak dan jatuhkan — planet sama bergabung jadi lebih besar",
    rules: "Mekanisme sama dengan Gabung Buah Suika, bertemakan planet — planet yang sama bergabung menjadi saiz lebih besar.",
  },
  "mahjong-ninepoint5": {
    name: "Mahjong 9.5",
    subtitle: "Kad mahjong ganti kad terup, paling hampir 9.5 menang",
    rules: "Main 9.5 (gaya blackjack) menggunakan kad mahjong sebagai ganti kad terup. Tarik tambahan atau berhenti — sesiapa paling hampir 9.5 tanpa melebihi akan menang.",
  },
  "mahjong-niuniu": {
    name: "Mahjong Niu Niu",
    subtitle: "Kad mahjong ganti kad terup, bentuk gandaan 10",
    rules:
      "Main Niu Niu menggunakan kad mahjong sebagai ganti kad terup. Daripada 5 kad, cari 3 yang jumlahnya gandaan 10, kemudian banding skor 2 kad baki.",
  },
  "dragon-gate": {
    name: "Pintu Naga",
    subtitle: "Dua kad Titik mahjong membuka pintu, bertaruh pada jurang",
    rules: "Dua kad Titik membuka pintu; letak taruhan, kemudian kad ketiga ditarik. Jatuh antara pintu menang, di luar tewas, sepadan dengan tiang menggandakan kekalahan.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Lawan dealer mendekati 21",
    rules:
      "Dekati 21 tanpa melebihinya. As dikira 1 atau 11, kad bergambar dikira 10. Pilih Tambah atau Berhenti — dealer perlu terus menarik kad sehingga mencapai 17 atau lebih.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Bertaruh pada Player, Banker, atau Tie sebelum kad diedarkan. Jumlah tangan menggunakan digit terakhir; jumlah lebih besar menang. Kad tambahan ditarik secara automatik mengikut peraturan baccarat standard.",
  },
  "ten-half": {
    name: "Sepuluh Setengah",
    subtitle: "Lebih hampir 10.5 daripada dealer",
    rules:
      "Letak taruhan, kedua-dua pihak diedarkan 2 kad. Pilih Tambah atau Berhenti — sesiapa lebih hampir 10.5 tanpa melebihi menang. As dikira 1 mata, kad bergambar 0.5 mata. Dapat 10.5 serta-merta membayar 3x, menang biasa membayar 2x, seri mengembalikan taruhan.",
  },
  "thirteen-water": {
    name: "Tiga Belas Kad",
    subtitle: "Bahagikan 13 kad kepada 3 tangan melawan dealer",
    rules:
      "Letak taruhan dan edarkan kad. Sistem secara automatik menyusun 13 kad anda dan dealer kepada tangan depan 3 kad, tangan tengah 5 kad, tangan belakang 5 kad, masing-masing dibanding berasingan. Menang ketiga-tiga tangan membayar 5x, menang 2 tangan membayar 2x, menang 1 tangan membayar 1.5x, seri impas, kalah lebih banyak kehilangan taruhan.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Main kad tunggal atau pasangan untuk habiskan kad dahulu",
    rules:
      "Letak taruhan dan lawan dealer. Main kad tunggal atau pasangan nombor sama yang lebih kuat daripada giliran sebelumnya, atau lepas. Susunan nombor 3 terlemah hingga 2 terkuat, seri dibanding mengikut sut. Habiskan 13 kad dahulu untuk menang 2x taruhan.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Banding 5 kad terus dengan dealer",
    rules:
      "Letak taruhan, anda dan dealer masing-masing diedarkan 5 kad dan banding kedudukan tangan terus — straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair, kad tinggi. Tangan lebih kuat menang 2x, seri mengembalikan taruhan.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Bentuk gandaan 10 daripada 5 kad untuk skor lembu terbaik",
    rules:
      "Letak taruhan, anda dan dealer masing-masing diedarkan 5 kad. Pilih 3 kad yang jumlahnya gandaan 10 ('lembu'); digit terakhir 2 kad baki adalah skor anda, lebih tinggi lebih baik. Tepat 10 ialah tangan 'Lembu Lembu' tertinggi; tiada gabungan sah ialah 'Tiada Lembu', terendah. Skor lebih tinggi menang 2x, seri mengembalikan taruhan. Kad bergambar dikira 10, As dikira 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Banding 3 kad terus dengan dealer",
    rules:
      "Letak taruhan, anda dan dealer masing-masing diedarkan 3 kad dan banding kedudukan tangan terus — three of a kind, straight flush, flush, straight, pair, kad tinggi. Tangan lebih kuat menang 2x, seri mengembalikan taruhan.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 pusingan pengedaran — lipat atau gandakan taruhan setiap pusingan",
    rules:
      "Letak taruhan permulaan. Kad diedarkan dalam 4 pusingan (3, kemudian 2, kemudian 1, kemudian 2 terakhir dibuka), dan selepas setiap pusingan anda boleh melipat atau menggandakan taruhan. Tangan 5 kad terbaik daripada 7 kad anda menentukan keputusan. Melipat hilang jumlah taruhan semasa; menang membayar mengikut kedudukan tangan, dari royal flush 150x hingga two pair 1x.",
  },
  chess: {
    name: "Catur",
    subtitle: "AI Solo／2 Pemain",
    rules:
      "Bergilir menggerakkan buah; sesiapa yang lebih dahulu membuat raja lawan skak mat akan menang. Mengikut peraturan catur standard untuk cara bergerak pion, kasa, kuda, gajah, suri, dan raja.",
  },
  connect4: {
    name: "Connect Four",
    subtitle: "AI Solo／2 Pemain",
    rules: "Bergilir menjatuhkan cakera ke dalam petak menegak. Sesiapa yang lebih dahulu menyusun empat secara mendatar, menegak, atau serong akan menang.",
  },
  "chinese-checkers": {
    name: "Dam Cina",
    subtitle: "Papan Bintang",
    rules:
      "Pada papan berbentuk bintang enam hujung, pindahkan semua buah anda ke penjuru bertentangan dahulu untuk menang. Buah boleh melangkah atau melompat buah lain secara berturutan untuk maju.",
  },
  jigsaw: {
    name: "Puzzle Gelongsor",
    subtitle: "Petak Bernombor",
    rules: "Sentuh petak di sebelah ruang kosong untuk menggelongsorkannya. Susun petak dari 1 hingga 15 secara berurutan untuk menyelesaikan cabaran.",
  },
  "number-merge": {
    name: "Gabung Nombor",
    subtitle: "Gaya 2048",
    rules: "Leret atau guna butang arah. Petak bernombor sama bergabung dan berganda apabila bertembung; capai 2048 untuk menang.",
  },
  "memory-match": {
    name: "Padan Ingatan",
    subtitle: "Cabaran Memadankan",
    rules: "Buka dua kad serentak; pasangan yang sepadan kekal terbuka. Padankan semua pasangan dengan seminimum bukaan untuk menang.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Pemain",
    rules: "Baling dadu untuk menggerakkan buah anda mengelilingi papan sehingga pulang. Mendarat di buah lawan menghantarnya semula ke permulaan.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Klasik Solo",
    rules: "Susun semua kad ke empat timbunan asas mengikut sut dan urutan menaik untuk mengosongkan papan dan menang.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Rami Jubin vs AI",
    rules: "Guna jubin bernombor anda untuk membentuk turutan atau set nombor sama, kemudian letak di atas meja. Habiskan semua jubin anda dahulu untuk menang.",
  },
  "rps-battle": {
    name: "Batu Gunting Kertas",
    subtitle: "vs AI",
    rules: "Baling batu, gunting, atau kertas melawan komputer serentak. Sesiapa yang memenangi lebih banyak pusingan memenangi perlawanan.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 Lawan 1 vs AI (Dipermudah)",
    rules:
      "Anda dan AI masing-masing memegang 2 kad, ditambah 5 kad komuniti bersama. Pilih Call untuk buka tangan, atau Fold untuk mengalah — tangan berkedudukan lebih tinggi memenangi pot.",
  },
  war: {
    name: "War",
    subtitle: "Kad Tertinggi vs AI",
    rules:
      "Kad diedarkan sama rata. Setiap pusingan kedua-dua pihak membuka satu kad — kad lebih tinggi menang pusingan. Seri mencetuskan pertarungan tambahan; sesiapa memegang lebih banyak kad di akhir menang.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "vs Dealer",
    rules:
      "Anda dan dealer masing-masing diedarkan 3 kad. Selepas melihat tangan anda, Call untuk buka dan banding, atau Fold untuk mengalah pusingan — tangan berkedudukan lebih tinggi menang.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Puzzle Blok Gelongsor",
    rules: "Gelongsorkan blok pelbagai saiz dalam ruang papan terhad. Pindahkan blok terbesar ke pintu keluar di bawah untuk menang.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Susun & Padam Baris",
    rules:
      "Leret kiri atau kanan untuk menggerakkan blok yang jatuh, sentuh untuk memusingkannya, leret ke bawah untuk menjatuhkan cepat. Penuhkan satu baris untuk memadamkannya dan mendapat skor; permainan tamat jika timbunan mencapai puncak.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Padankan Warna untuk Padam",
    rules: "Sentuh satu arah untuk menembak gelembung semasa. Tiga atau lebih gelembung sama yang bersambung akan dipadam dan mendapat mata; permainan tamat jika gelembung mencapai puncak.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Tukar untuk Memadankan",
    rules:
      "Sentuh satu petak, kemudian sentuh petak bersebelahan untuk menukarnya. Memadankan 3 atau lebih warna sama memadamkannya dan mengisi semula dari atas, yang boleh mencetuskan gabungan berturutan.",
  },
  hanoi: {
    name: "Menara Hanoi",
    subtitle: "Pindahkan Cakera",
    rules:
      "Sentuh satu tiang untuk mengambil cakera paling atas, kemudian sentuh tiang lain untuk memindahkannya. Cakera besar tidak boleh berada di atas cakera kecil — pindahkan seluruh timbunan ke tiang paling kanan untuk menang.",
  },
  "water-sort": {
    name: "Puzzle Susun Air",
    subtitle: "Tuang untuk Menyusun Warna",
    rules:
      "Sentuh tiub untuk mengambil warna paling atas, kemudian sentuh tiub lain untuk menuangnya — hanya ke tiub kosong atau yang berwarna sama di atasnya. Susun setiap tiub menjadi satu warna untuk menang.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Pusing untuk Menyambung",
    rules: "Sentuh petak paip untuk memusingkannya 90°. Sambungkan sumber air di kiri atas sehingga ke pintu keluar di kanan bawah untuk menang.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Jangkakan Masa Jatuhan Anda",
    rules:
      "Blok di atas bergerak kiri dan kanan; sentuh untuk menjatuhkannya ke timbunan di bawah. Semakin kurang bertindih, semakin sempit bloknya — terlepas timbunan sepenuhnya menamatkan permainan.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Tukar untuk Menyusun",
    rules: "Sentuh dua petak bernombor untuk menukar kedudukannya. Susun semua nombor dari terkecil ke terbesar dengan seminimum tukaran untuk menang.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Petak 6×6",
    rules:
      "Setiap baris, lajur, dan kotak 2×3 mesti mengandungi nombor 1 hingga 6 tanpa pengulangan. Isi seluruh petak tanpa konflik untuk menang.",
  },
  "shooting-range": {
    name: "Galeri Menembak",
    subtitle: "Sasaran Refleks Pantas",
    rules: "Sasaran menyala secara rawak di seluruh petak — sentuh secepat mungkin untuk mendapat skor. Capai skor sasaran sebelum masa tamat untuk menang.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Bersihkan Seluruh Armada untuk Menang",
    rules:
      "Bergerak kiri dan kanan untuk mengelak tembakan musuh dan tembak jatuh seluruh armada alien. Cabaran gagal jika armada semakin hampir atau nyawa anda habis.",
  },
  "tank-battle": {
    name: "Tank Battle",
    subtitle: "Pertama Capai 3 Serangan Menang",
    rules: "Gerakkan tangki anda kiri dan kanan serta tembak peluru. Mengenai jalur lawan mendapat mata — jadilah yang pertama mencapai 3 serangan untuk menang.",
  },
  "brick-breaker": {
    name: "Brick Breaker",
    subtitle: "Pecahkan Semua Bata untuk Menang",
    rules:
      "Seret papan pemukul kiri dan kanan untuk memantulkan bola dan memecahkan semua bata untuk menang. Bola jatuh ke bawah mengurangkan nyawa; cabaran gagal jika nyawa habis.",
  },
  "zombie-defense": {
    name: "Zombie Defense",
    subtitle: "Bertahan Setiap Gelombang untuk Menang",
    rules:
      "Zombi bergerak maju di jalur dari kanan; sentuh untuk memusnahkannya (sesetengah memerlukan dua sentuhan). Membiarkan seekor mencapai tepi kiri mengurangkan nyawa — bertahan setiap gelombang untuk menang.",
  },
  "air-combat": {
    name: "Air Combat",
    subtitle: "Bertahan & Capai Skor Sasaran",
    rules:
      "Pesawat pejuang anda menembak secara automatik; gerakkan kiri dan kanan untuk mengelak pesawat musuh dan membersihkannya. Bertahan sehingga had masa sambil mencapai skor sasaran untuk menang; nyawa habis menyebabkan cabaran gagal.",
  },
  billiards: {
    name: "Biliard",
    subtitle: "Seret untuk Membidik, Masukkan Semua Bola",
    rules:
      "Seret ke belakang dari bola putih untuk membidik, kemudian lepaskan untuk memukul. Masukkan semua bola berwarna sebelum peluang pukulan habis untuk menang.",
  },
  bowling: {
    name: "Boling",
    subtitle: "Capai Sasaran Pin dalam 3 Frame",
    rules: "Seret penggelongsor untuk mengatur sudut lontaran, kemudian lepaskan untuk melontar. Capai jumlah sasaran pin jatuh dalam 3 frame untuk menang.",
  },
  "basketball-shoot": {
    name: "Basketball Shootout",
    subtitle: "Jangkakan Masa Tembakan Anda",
    rules: "Meter tenaga bergerak secara automatik ke hadapan dan ke belakang — sentuh untuk menembak apabila hampir ke tengah agar masuk. Jaringkan gol yang cukup untuk menang.",
  },
  "penalty-kick": {
    name: "Tendangan Penalti",
    subtitle: "Pilih Sisi vs Penjaga Gol",
    rules: "Pilih kiri, tengah, atau kanan untuk menendang melawan penjaga gol yang melompat secara rawak. Jaringkan gol yang cukup dalam 5 pusingan untuk menang.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Tukar Lorong untuk Elak Lalu Lintas",
    rules: "Tukar lorong kiri dan kanan untuk mengelak lalu lintas yang datang. Cabaran gagal jika nyawa habis sebelum mencapai jarak penamat.",
  },
  parking: {
    name: "Cabaran Meletak Kereta",
    subtitle: "Letak Kereta dalam Had Langkah",
    rules: "Guna kawalan stereng dan maju untuk meletak kereta tepat di tempat yang ditanda sebelum langkah atau pelanggaran anda habis untuk menang.",
  },
  motocross: {
    name: "Motocross Jump",
    subtitle: "Lompat Lubang hingga Penamat",
    rules: "Sentuh untuk melompatkan motosikal anda dan melepasi lubang di hadapan dengan ketepatan masa. Cabaran gagal jika nyawa anda habis sebelum mencapai penamat.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Kawal Selekoh untuk Skor",
    rules: "Kawal mengikut selekoh trek untuk kekal di landasan sambil mengumpul mata drift. Capai garisan penamat dengan mata yang cukup untuk menang.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Bergilir, KO Pertama Menang",
    rules:
      "Pilih Attack untuk mengisi meter khas, Guard untuk mengurangkan separuh serangan seterusnya, atau lepaskan Finisher apabila meter penuh. Jadilah yang pertama menjadikan nyawa lawan sifar untuk menang.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Berpasukan melawan dua lawan komputer",
    rules:
      "Anda dan rakan sepasukan Utara anda bermain melawan Barat dan Timur, kedua-duanya dikawal komputer. Setiap trick, keempat-empat pemain bermain secara bergilir dan mesti mengikut sut jika boleh; jika tidak, boleh main sut atau trump apa-apa. Kad tertinggi daripada sut yang dimainkan, atau trump tertinggi, memenangi trick. Selepas 13 trick selesai, memenangi 7 trick atau lebih sebagai pasukan memenangi tangan.",
  },
  "pick-red-points": {
    name: "Kumpul Mata Merah",
    subtitle: "Padankan kad yang dimainkan dengan kad di atas meja",
    rules:
      "Bergilir memainkan satu kad: jika nombornya sepadan dengan kad di atas meja, sapu semua kad nombor itu bersama kad anda untuk mendapat mata. Jika tidak sepadan, kad kekal di atas meja. Selepas kad habis, banding hati／wajik merah yang terkumpul setiap pihak — kad merah biasa bernilai 1 mata, 10／J／Q／K merah bernilai 10 mata masing-masing. Jumlah lebih tinggi menang.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Lawan Tuan Tanah)",
    subtitle: "Tuan tanah melawan dua petani",
    rules:
      "Selepas pengedaran kad, sistem menetapkan seorang Tuan Tanah (anda atau komputer) berdasarkan kekuatan tangan — Tuan Tanah mendapat 3 kad tersembunyi tambahan, dan dua lagi menjadi Petani yang bekerjasama melawannya. Bergilir memainkan kombinasi yang lebih kuat daripada sebelumnya, atau lepas jika tidak boleh. Tuan Tanah menang jika menghabiskan kad dahulu; Petani menang jika salah seorang mereka selesai dahulu.",
  },
  "liars-cards": {
    name: "Kad Penipu",
    subtitle: "Main tertutup, sebut nombornya, teka penipuannya",
    rules:
      "Anda dan dua lawan komputer bergilir: main 1–4 kad tertutup dan umumkan satu nombor (nombor mesti berurutan A→2→3→...→K→A, dan anda boleh jujur atau menipu). Pemain lain boleh Percaya dan sambung giliran, atau Cabar penipuan dengan membuka kad untuk semak — cabaran betul membuat pemain yang memainkan kad mengambil semula seluruh timbunan meja, cabaran salah membuat pencabar yang mengambilnya. Yang pertama menghabiskan kad tanpa dikesan menipu menang.",
  },
  "five-pk": {
    name: "Poker 5 Kad",
    subtitle: "Tarik sekali, kemudian banding tangan dengan pilihan gandakan",
    rules:
      "Letak taruhan, kemudian diedarkan 5 kad (2 joker ada dalam kad). Simpan kad yang anda mahu dan tarik sekali untuk ganti bakinya. Tangan membayar mengikut kedudukan — straight flush 500x, five of a kind 200x, flush straight 120x, hingga two pair 1x. Selepas menang, anda boleh gandakan dengan meneka besar/kecil atau merah/hitam, atau ambil kemenangan pada bila-bila masa.",
  },
  "little-mary": {
    name: "Little Mary Klasik",
    subtitle: "Bingkai lampu berputar — bertaruh pada kad besar atau kecil",
    rules:
      "Letak taruhan pada setiap simbol, kemudian mula. Bingkai lampu berputar pantas selama 3 pusingan, kemudian perlahan untuk berhenti dalam setengah hingga satu setengah pusingan — sentuh Stop untuk menghentikannya awal. Berhenti di anak panah tewas; berhenti di simbol pusingan percuma memberi pusingan semula percuma; simbol tetap membayar gandaan tertentu; simbol kad besar atau kecil membayar mengikut penggandaan semasa jika anda bertaruh pada simbol itu. Selepas cukup banyak pusingan, pusingan bonus mungkin tercetus dengan bayaran tetap lebih tinggi dan nada khas.",
  },
  "little-mary-2": {
    name: "Little Mary Klasik II",
    subtitle: "Bingkai lampu berputar bertema sukan",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik, ditukar tema kepada sukan (bola sepak, ragbi, bola keranjang, boling, tenis, ping pong, golf). Letak taruhan pada setiap simbol kemudian mula — berhenti di anak panah tewas, simbol percuma memberi pusingan semula percuma, simbol tetap membayar gandaan tertentu, dan simbol sukan besar atau kecil membayar mengikut penggandaan semasa jika dipertaruhkan. Pusingan bonus mungkin tercetus selepas cukup banyak pusingan dengan bayaran tetap tinggi.",
  },
  "little-mary-3": {
    name: "Little Mary Klasik III",
    subtitle: "Jackpot dewa bunga — bertaruh pada besar atau kecil",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik. Tiga lampu dewa bunga biasanya berkelip berasingan; selepas cukup banyak pusingan boleh menyegerak menjadi status amaran berkelip. Jika gegelung berhenti di kumpulan simbol besar atau kecil semasa amaran itu, ketiga-tiga simbol membayar bersama 3x penggandaan semasa — bonus jackpot yang jarang berlaku.",
  },
  "little-mary-4": {
    name: "Little Mary Klasik IV",
    subtitle: "Jackpot dewa bunga bertema haiwan",
    rules:
      "Mekanisme sama seperti edisi Jackpot Dewa Bunga, ditukar tema kepada haiwan (harimau, naga, monyet, musang, tikus, ayam jantan, anak ayam). Amaran jackpot dewa bunga dan bayaran 3x berfungsi sama.",
  },
  "little-mary-5": {
    name: "Little Mary Klasik III (Phoenix)",
    subtitle: "Edisi hiasan phoenix — bertaruh pada besar atau kecil",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik. Phoenix besar di tengah adalah hiasan semata-mata, berkelip lebih pantas semasa amaran bonus. Berhenti di salah satu simbol pusingan percuma menyapu jejak cahaya hiasan merentasi bingkai — hanya visual, tidak mengubah bayaran.",
  },
  "little-mary-6": {
    name: "Little Mary Klasik IV (Phoenix)",
    subtitle: "Edisi hiasan phoenix — bertema minuman",
    rules:
      "Mekanisme sama seperti edisi Hiasan Phoenix, ditukar tema kepada minuman (teko teh, madu, teh mate, ais kepal, bir, wain, koktel). Kesan phoenix hiasan dan jejak cahaya berfungsi sama.",
  },
  "little-mary-7": {
    name: "Little Mary Mini (Laut)",
    subtitle: "Bingkai mini 8×8 — bertaruh pada besar atau kecil",
    rules:
      "Bingkai lampu 8×8 yang lebih kecil (28 kedudukan) dengan mekanisme putaran sama, bertema haiwan laut (jerung, ikan paus, lumba-lumba, ikan tropika, ketam, kulit kerang, buih). Berhenti di anak panah tewas, simbol percuma memberi pusingan semula percuma, simbol tetap membayar gandaan tertentu, dan simbol besar atau kecil membayar mengikut penggandaan semasa jika dipertaruhkan. Pusingan bonus jackpot mungkin tercetus selepas cukup banyak pusingan.",
  },
  "little-mary-8": {
    name: "Little Mary Mini (Pencuci Mulut)",
    subtitle: "Bingkai mini 8×8 — bertema pencuci mulut",
    rules:
      "Mekanisme bingkai mini 8×8 sama seperti edisi Laut, ditukar tema kepada pencuci mulut (kek, kek strawberi, cupcake, donut, biskut, gula-gula, lolipop). Pusingan bonus jackpot mungkin tercetus selepas cukup banyak pusingan dengan nada khas.",
  },
  "fruit-slot-1": {
    name: "Gegelung Buah I",
    subtitle: "Gegelung klasik 3×3, 5 garis bayaran",
    rules:
      "Mesin buah klasik 3 gegelung, 3 baris dengan 5 garis bayaran (baris atas, tengah, bawah serta kedua-dua pepenjuru). Letak taruhan setiap garis, kemudian putar — setiap gegelung berhenti secara berasingan dari kiri ke kanan, dan anda boleh sentuh Stop untuk menghentikannya awal. Tiga simbol sama pada garis bayaran mana-mana membayar mengikut jadual, dari 7 bertuah 100x hingga ceri 4x; dua atau lebih ceri di mana-mana pada skrin membayar hadiah hiburan kecil; tiga 7 pada baris tengah adalah jackpot dengan persembahan cahaya dan nada khasnya sendiri.",
  },
  "fruit-slot-2": {
    name: "Gegelung Buah II",
    subtitle: "Tema buah tropika, 5 garis bayaran",
    rules:
      "Mekanisme sama seperti Gegelung Buah I, 3 gegelung dengan 5 garis bayaran, ditukar tema tropika — berlian menggantikan 7 bertuah sebagai simbol jackpot, dipasangkan dengan strawberi, nanas, pisang, pic, dan ceri. Tiga simbol sama pada garis bayaran mana-mana membayar mengikut jadual, dari berlian 100x hingga ceri 4x; tiga berlian pada baris tengah adalah jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Klasik V (Bonus 7 Bertuah)",
    subtitle: "Pusingan bonus penggandaan tujuh bertuah",
    rules:
      "Mekanisme putaran sama seperti Little Mary Klasik, dengan taruhan diletakkan pada 8 simbol serentak. Tiga gegelung nombor di tengah biasanya berputar hiasan semata-mata; semasa menang ada kemungkinan mencetuskan pusingan bonus di mana ketiga-tiga gegelung berhenti satu demi satu. Berhenti di tiga nombor ganjil yang sama menggandakan kemenangan anda 10x, tiga nombor genap yang sama 5x — bonus rawak jarang yang tidak selalu tercetus.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Klasik IV (Bonus 7 Bertuah, Perayaan)",
    subtitle: "Bonus tujuh bertuah bertema perayaan",
    rules:
      "Mekanisme sama seperti edisi Bonus Tujuh Bertuah, ditukar tema kepada perayaan (sampul merah, dulang emas, tanglung, oren mandarin, kuih bulan, bunga api, ceri). Pusingan bonus dan penggandaan padanan nombor 10x/5x berfungsi sama, dengan warna dan kesan bunyi perayaan.",
  },
  "xiangqi-mahjong": {
    name: "Mahjong Xiangqi",
    subtitle: "Bentuk set daripada buah catur, berlumba melawan komputer untuk menang",
    rules:
      "Letak taruhan, kemudian anda dan komputer masing-masing menarik 5 buah Catur Cina. Pada giliran anda, tarik satu buah — jika melengkapkan pasangan serta satu set (turutan atau tiga sama), anda menang dengan tarikan sendiri. Jika tidak, buang satu daripada 6 buah anda. Jika buangan komputer melengkapkan tangan anda, anda boleh menuntutnya untuk menang, atau lepas dan terus menarik. Bayaran: 2x untuk pasangan-turutan campuran, 3x untuk pasangan-turutan sut sama, 5x untuk lima askar atau pion; menuntut buangan membayar mengikut kadar tersenarai, tarikan sendiri menambah bonus. Jika kad habis tanpa pemenang, taruhan dikembalikan.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Tolak Silinder)",
    subtitle: "Pai gow kad mahjong di tiga kedudukan serentak",
    rules:
      "Menggunakan kad titik mahjong 1–9 (4 setiap satu) ditambah kad kosong (4, bernilai setengah mata) untuk mewakili 40 kad. Letak taruhan pada kedudukan kepala, langit, dan ekor, kemudian dealer dan setiap kedudukan membuka 2 kad untuk dibanding. Susunan kedudukan: kosong berganda (tertinggi) mengalahkan sebarang pasangan, yang mengalahkan kombinasi 2-8, yang mengalahkan jumlah mata biasa (jumlah digit, digit terakhir dikira, kosong = 0.5, 9.5 ialah jumlah biasa terbaik, 0 terendah). Setiap kedudukan dibanding dengan dealer secara berasingan — menang membayar 1x, pasangan membayar 4x dan kosong berganda membayar 10x; jumlah sama memihak kepada dealer mengikut peraturan rumah.",
  },
  }
}

const fil: GameTable = {
  xiangqi: {
    name: "Chinese Chess",
    subtitle: "AI Solo／2 Manlalaro",
    rules:
      "Palitan ang paggalaw ng piraso; ang unang makapagkorner sa heneral ng kalaban na walang malayuang lugar ang mananalo. Sumusunod sa tradisyonal na patakaran ng Xiangqi: dumadaloy ang Chariot, gumagalaw ang Horse sa hugis L, ang Elephant sa diagonal sa sariling bahagi, ang Guard sa diagonal malapit sa palasyo, at ang Soldier ay makakagalaw pasalungat pagkatapos tumawid sa ilog.",
  },
  "darkchess-classic": {
    name: "Dark Chess (Klasiko)",
    subtitle: "AI Solo／2 Manlalaro",
    rules: "Lahat ng piraso ay nakadapa; kapag na-flip, kumakain ayon sa tradisyonal na ranggo. Ang unang kumain ng lahat ng piraso ng kalaban o hindi na sila makagalaw ay mananalo.",
  },
  "darkchess-variant": {
    name: "Dark Chess (Variant)",
    subtitle: "AI Solo／2 Manlalaro",
    rules: "Kapareho ng Klasiko ngunit may pagbabago sa pag-atake at jump-capture ng kanyon, may dagdag na taktika para sa mas mapaghamong laro.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Palitan ang paglalagay ng itim at puting bato sa mga interseksyon ng 19×19 board; ang mas maraming teritoryo ang mananalo. Ang mga bato na napalibutan nang walang hininga ay makukuha.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Palitan ang paglalagay ng bato; ang unang makapagsama ng lima nang tuluy-tuloy nang pahalang, patayo, o pahilis ang mananalo." },
  othello: {
    name: "Othello",
    subtitle: "Standard",
    rules: "Palitan ang paglalagay ng disc; ang mga disc ng kalaban na na-sandwich ay babaligtad sa iyong kulay. Sa dulo, ang may mas maraming disc ang mananalo.",
  },
  mahjong: {
    name: "Chinese Mahjong",
    subtitle: "AI Solo (3 Computer)",
    rules: "Maglaro kasama ang tatlong computer na kalaban, palitan ang pagkuha at pagtapon ng tile, maaaring Chow／Pong／Kong ng itinapon ng iba. Ang unang makumpleto ang balidong winning hand ang mananalo.",
  },
  luzhanqi: {
    name: "Luzhanqi (Army Chess)",
    subtitle: "AI Solo／2 Manlalaro",
    rules: "Nakatago ang ranggo ng mga piraso ng bawat panig; nakikita lang ng kalaban ang likod. Ang ranggo ang nagpasya sa labanan; ang unang makuha ang bandila ng kalaban o walang magalaw ang mananalo.",
  },
  checkers: {
    name: "Checkers",
    subtitle: "Standard",
    rules: "Palitan ang diagonal na paggalaw ng piraso; maaaring lumundag para kunin ang piraso ng kalaban. Ang unang makuha ang lahat ng piraso ng kalaban ang mananalo.",
  },
  tictactoe: {
    name: "Tic-Tac-Toe",
    subtitle: "Pinalaking 3×3",
    rules: "Palitan ang paglalagay ng simbolo; ang unang makapagsama ng tatlo nang tuluy-tuloy nang pahalang, patayo, o pahilis ang mananalo.",
  },
  sevens: {
    name: "Sevens (Baraha 7)",
    subtitle: "Rummy na 4 ang laro — pinakamababang parusa ang panalo",
    rules:
      "Magsisimula sa baraha 7, pasunod-sunod na maglalaro ng kartang katabi ang numero. Kung walang maglalaro, itago nang pabaligtad ang baraha bilang parusa. Pagkatapos ng isa, ang may pinakamababang kabuuang parusa ang panalo.",
  },
  "sichuan-mahjong": {
    name: "Sichuan Mahjong (Dugong Labanan)",
    subtitle: "Kulang ng isang suit mula sa simula, patuloy na laro ang panalo",
    rules:
      "Gamit lamang ang Tuldok, Kawayan, at Karakter, at dapat kulang ng isang suit sa simula. Ang mananalo ay aalis sa mesa, patuloy na maglalaro ang iba hanggang may tatlo nang nanalo o maubos ang baraha.",
  },
  "malaysia-mahjong": {
    name: "Malaysian Mahjong na 3 Manlalaro",
    subtitle: "3 manlalaro, ang wild tiles ay madalas magbigay ng malaking kombinasyon",
    rules:
      "Nilalaro ng 3 manlalaro gamit ang pinaikling set ng Tuldok, Hangin/Bulaklak tiles, at wild tiles. Ang mas maliit na deck kasama ang wild tiles ay gumagawa ng malaking panalong kamay na mas madalas.",
  },
  "mahjong-pengpeng": {
    name: "Pong Pong Mahjong",
    subtitle: "Simpleng mahjong, pong lamang — walang chow",
    rules: "Simpleng set ng baraha na walang pinapayagang chow, pong lamang o sariling hilahan. Bumuo ng dalawang triplet at isang pares para manalo.",
  },
  "mahjong-sevens": {
    name: "Mahjong Sevens",
    subtitle: "Tulad ng Sevens, may suit na Tuldok/Kawayan/Karakter",
    rules: "Magsisimula sa numero 5 ng bawat suit, pasunod-sunod na maglalaro ng katabing numero. Kung walang maglalaro, itago nang pabaligtad ang baraha bilang parusa.",
  },
  "riichi-mahjong": {
    name: "Japanese Riichi Mahjong",
    subtitle: "East round — riichi, dora, at furiten",
    rules:
      "Idineklara ang riichi kapag handa na ang sarado mong kamay na maghintay. Ang mga nabunyag na dora tile ay nagdaragdag ng bonus han. Ang furiten ay humahadlang sa panalo mula sa discard na dati mo nang nilaktawan. Kinakailangan ng kahit isang yaku ang kamay para manalo.",
  },
  "mahjong-solitaire": {
    name: "Mahjong Solitaire",
    subtitle: "Itugma ang parehong tiles na may landas na 2 liko o mas mababa",
    rules: "Hanapin ang dalawang parehong tiles na ang nag-uugnay na landas ay hindi lalagpas sa dalawang liko para burahin ito. Burahin ang buong board bago maubos ang oras para manalo.",
  },
  "merge-2048": {
    name: "Merge 2048",
    subtitle: "I-swipe para pagsamahin ang numero, target ang 2048",
    rules: "I-swipe sa kahit anong direksyon — ang magkaparehong tiles ay magsasama at madodoble ang value kapag nagbanggaan. Maabot ang 2048 para manalo.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Pagsamahin ang gusali mula sa damuhan hanggang skyscraper",
    rules: "Parehong rules ng 2048, pero ang tiles ay icons ng gusali — unti-unting pagsamahin mula sa damuhan hanggang skyscraper.",
  },
  "merge-2048-undo": {
    name: "2048 Undo",
    subtitle: "Tulad ng 2048, may undo button",
    rules: "Parehong rules ng 2048, pero maaari mong i-undo ang isang swipe kung nagkamali ka ng galaw.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Pagsamahin ang gusali — mag-ingat sa mga gumagalang oso",
    rules:
      "Sa 6×6 board, ang tatlong magkaparehong item ay magsasama para maging mas mataas na antas. Ang mga oso ay gumagala at humaharang sa iyong mga puwang — ganap na kulungin ang isang oso para gawin itong lapida, na maaari ring pagsamahin.",
  },
  suika: {
    name: "Suika Fruit Merge",
    subtitle: "Gumalaw kaliwa/kanan at ibagsak ang prutas — pagsasama ng magkaparehong prutas ay nagiging mas malaki",
    rules: "Gumalaw sa kaliwa at kanan para piliin kung saan babagsak ang prutas. Ang magkaparehong prutas ay pagsasamahin sa mas malaking sukat — layunin ang higanteng pakwan.",
  },
  "drop-2048": {
    name: "2048 Drop",
    subtitle: "Ang bumabagsak na numerong block ay nagtitipon at nagsasama",
    rules: "Bumabagsak ang numerong block mula sa itaas; gumalaw kaliwa kanan para pumili ng column. Ang parehong numero ay nagsasama at dumodoble kapag nagtipon.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Bumabagsak na pares — burahin kapag 4+ magkaparehong kulay ang nagkonekta",
    rules:
      "Bumabagsak mula sa itaas ang mga magkaparehong kulay na pares; igalaw at i-rotate ito. Ikonekta ang 4 o higit pang magkaparehong kulay para burahin, na maaaring maging chain reaction.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Itipon ang bumabagsak na kapsula para burahin ang virus sa isang linya",
    rules: "Bumabagsak at nagtitipon ang dalawang-kulay na kapsula; ihanay ang 4 na magkaparehong kulay kasama ang virus sa isang linya para burahin ito. Burahin lahat ng virus para manalo.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Lumipat sa pagitan ng dalawang klasikong bumabagsak na larong block",
    rules: "Lumipat sa pagitan ng Columns (itugma ang 3+ hiyas sa isang linya) at Tetris (burahin ang buong linya) sa parehong screen.",
  },
  "candy-crush": {
    name: "Candy Crush",
    subtitle: "Palitan ang kendi para sa 3-sunod, abutin ang target score",
    rules:
      "Palitan ang katabing kendi para makabuo ng tugma na 3 o higit pa. Ang espesyal na kendi mula sa mas malaking tugma ay bubura ng buong linya o kulay — abutin ang target score sa loob ng limitasyon ng galaw para manalo.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Ang orihinal na match-3 — palitan ang hiyas para burahin ang linya",
    rules: "Palitan ang katabing hiyas para makabuo ng linya na 3 o higit pang magkaparehong hiyas. Magkadena ng combo para sa bonus points habang hinahabol ang bagong high score.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Match-3 para sa coins para ibalik ang pinabayaang hardin",
    rules: "Burahin ang mga tugma para kumita ng coins, pagkatapos gastusin ito para kumpletuhin ang mga gawaing pagsasaayos ng hardin.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Match-3 para sa coins para dekorasyunan ang pangarap na mansyon",
    rules: "Burahin ang mga tugma para kumita ng coins, pagkatapos gastusin ito para kumpletuhin ang mga gawaing dekorasyon ng mansyon.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Match-3 para sa coins para ibalik ang lumang kastilyo",
    rules: "Burahin ang mga tugma para kumita ng coins, pagkatapos gastusin ito para kumpletuhin ang mga gawaing pagsasaayos ng kastilyo.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Itugma ang hiyas + pagbuo ng team sa card battle",
    rules: "Ang pagtugma ng hiyas ay nagtatrigger ng atake mula sa mga teammate na may parehong elemento. Talunin ang mga kalaban para i-level up ang team at sulong pa.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Itugma ang hiyas + labanan gamit ang bentahe ng elemento",
    rules: "Ang pagtugma ng hiyas ay nagtatrigger ng atake; gamitin ang bentahe ng elemento para magdagdag ng damage at talunin ang mga kalaban.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Itugma ang hiyas + magaang paggawa ng lungsod at PvP",
    rules: "Ang pagtugma ng hiyas ay nagtatrigger ng atake ng hero; talunin ang mga kalaban para kumita ng building materials at palawakin ang imperyo.",
  },
  "sheep-sheep": {
    name: "Sheep a Sheep",
    subtitle: "Kolektahin ang tiles mula sa tambak, burahin ang set ng 3",
    rules:
      "Tapikin ang kahit anong tile na walang nakaharang para ipadala sa collection slot. Awtomatikong mabubura ang tatlong magkaparehong tile — mapupuno ang slot nang hindi kumpleto ang set, matatalo ka.",
  },
  match3d: {
    name: "Match 3D",
    subtitle: "Kolektahin mula sa 3D na tambak para sa match-3 clears",
    rules: "Pareho ang ideya sa Sheep a Sheep, pero ang mga tile ay 3D na tambak ng mga bagay — hanapin at kolektahin ang magkaparehong set ng 3.",
  },
  "balls-merge": {
    name: "Ball Merge",
    subtitle: "Igalaw at ibagsak — ang magkaparehong bola ay nagsasama para lumaki",
    rules: "Parehong mekanismo sa Suika Fruit Merge, may temang bola — ang magkaparehong bola ay nagsasama sa mas malaking sukat.",
  },
  "cookies-merge": {
    name: "Cookie Merge",
    subtitle: "Igalaw at ibagsak — ang magkaparehong cookie ay nagsasama para lumaki",
    rules: "Parehong mekanismo sa Suika Fruit Merge, may temang cookie — ang magkaparehong cookie ay nagsasama sa mas malaking sukat.",
  },
  "planets-merge": {
    name: "Planet Merge",
    subtitle: "Igalaw at ibagsak — ang magkaparehong planeta ay nagsasama para lumaki",
    rules: "Parehong mekanismo sa Suika Fruit Merge, may temang planeta — ang magkaparehong planeta ay nagsasama sa mas malaking sukat.",
  },
  "mahjong-ninepoint5": {
    name: "Mahjong 9.5",
    subtitle: "Mahjong tiles kapalit ng baraha, pinakamalapit sa 9.5 ang panalo",
    rules: "Laruin ang 9.5 (blackjack style) gamit ang mahjong tiles kapalit ng baraha. Dagdag o tigil — ang pinakamalapit sa 9.5 nang hindi lalagpas ang panalo.",
  },
  "mahjong-niuniu": {
    name: "Mahjong Niu Niu",
    subtitle: "Mahjong tiles kapalit ng baraha, bumuo ng multiple ng 10",
    rules:
      "Laruin ang Niu Niu gamit ang mahjong tiles kapalit ng baraha. Mula sa 5 tiles, hanapin ang 3 na ang kabuuan ay multiple ng 10, pagkatapos ikumpara ang score ng natitirang 2.",
  },
  "dragon-gate": {
    name: "Dragon Gate",
    subtitle: "Dalawang Tuldok mahjong tiles bubuksan ang gate, pustahan sa saklaw",
    rules: "Dalawang Tuldok tiles ang bubuksan ng gate; magpusta, pagkatapos hihilahin ang ikatlong tile. Mahulog sa pagitan ng gate panalo, sa labas talo, parehas sa poste doble ang talo.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Laban sa dealer, pinakamalapit sa 21",
    rules:
      "Lapitan ang 21 nang hindi lalagpas. Ang Ace ay 1 o 11, ang face cards ay 10. Pumili ng Hit o Stand — ang dealer ay patuloy na bubunot hanggang umabot sa 17 o higit pa.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Tumaya sa Player, Banker, o Tie bago ihatid ang baraha. Ang kabuuan ay gagamit ng huling digit; ang mas malaki ang panalo. Awtomatikong bubunot ng dagdag na baraha ayon sa standard na patakaran ng baccarat.",
  },
  "ten-half": {
    name: "Sampu't Kalahati",
    subtitle: "Mas malapit sa 10.5 kaysa sa dealer",
    rules:
      "Tumaya, pagkatapos ay bibigyan ang bawat panig ng 2 baraha. Pumili ng Hit o Stand — ang mas malapit sa 10.5 nang hindi lalagpas ang panalo. Ang Ace ay 1 puntos, ang face cards ay 0.5 puntos. Ang eksaktong 10.5 sa paghahatid ay bayad 3x; normal na panalo ay 2x; tabla ay ibabalik ang taya.",
  },
  "thirteen-water": {
    name: "Labintatlong Baraha",
    subtitle: "Hatiin ang 13 baraha sa 3 kamay laban sa dealer",
    rules:
      "Tumaya at magsihati. Awtomatikong ia-ayos ng sistema ang iyong 13 baraha at ng dealer sa unahang kamay na 3 baraha, gitnang kamay na 5 baraha, at hulihang kamay na 5 baraha, ikukumpara nang hiwalay. Ang panalo sa 3 kamay ay 5x; 2 kamay ay 2x; 1 kamay ay 1.5x; tabla ay walang bayad; matalo sa mas marami kaysa panalo ay mawawala ang taya.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Maglaro ng single o pares upang unang maubos ang baraha",
    rules:
      "Tumaya at laban sa dealer. Maglaro ng single card o parehong-ranggong pares na mas malakas kaysa sa huling ginawa, o pumasa. Ang ranggo ay 3 ang pinakamahina hanggang 2 ang pinakamalakas, ang tabla ay nalulutas sa pamamagitan ng suit. Unang maubos ang 13 baraha upang manalo ng 2x sa taya.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Direktang ikumpara ang 5 baraha laban sa dealer",
    rules:
      "Tumaya, pagkatapos ikaw at ang dealer ay bibigyan ng tig-5 baraha at direktang ikukumpara ang ranggo ng kamay — straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, pair, high card. Ang mas mataas na kamay ay manalo ng 2x; tabla ay ibabalik ang taya.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Bumuo ng 10 mula sa 5 baraha para sa pinakamahusay na bull score",
    rules:
      "Tumaya, pagkatapos ikaw at ang dealer ay bibigyan ng tig-5 baraha. Piliin ang 3 na ang kabuuan ay multiple ng 10 (tinatawag na 'bull'); ang huling digit ng natitirang 2 baraha ang iyong score, mas mataas mas mabuti. Ang eksaktong 10 ay ang pinakamataas na 'Bull Bull'; walang balidong kombinasyon ay 'No Bull', ang pinakamababa. Ang mas mataas na score ay manalo ng 2x; tabla ay ibabalik ang taya. Ang face cards ay 10, ang Ace ay 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Direktang ikumpara ang 3 baraha laban sa dealer",
    rules:
      "Tumaya, pagkatapos ikaw at ang dealer ay bibigyan ng tig-3 baraha at direktang ikukumpara ang ranggo — three of a kind, straight flush, flush, straight, pair, high card. Ang mas mataas na kamay ay manalo ng 2x; tabla ay ibabalik ang taya.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 na yugto ng paghahatid — fold o doble ang taya sa bawat yugto",
    rules:
      "Itakda ang panimulang taya. Ang baraha ay ihahatid sa 4 na yugto (3, pagkatapos 2, pagkatapos 1, pagkatapos ang huling 2 ibubunyag), at pagkatapos ng bawat yugto ay maaari kang fold o doblehin ang taya. Ang pinakamahusay na 5-baraha na kamay mula sa iyong 7 baraha ang magpapasya ng resulta. Ang fold ay mawawala ang kasalukuyang kabuuang taya; ang panalo ay bayad ayon sa ranggo ng kamay, mula sa royal flush na 150x hanggang two pair na 1x.",
  },
  chess: {
    name: "Chess",
    subtitle: "AI Solo／2 Manlalaro",
    rules:
      "Palitan ang paggalaw ng piraso; ang unang makagawa ng checkmate sa hari ng kalaban ang mananalo. Sumusunod sa standard na patakaran ng chess para sa paggalaw ng pawn, rook, knight, bishop, queen, at king.",
  },
  connect4: {
    name: "Connect Four",
    subtitle: "AI Solo／2 Manlalaro",
    rules: "Palitan ang pagbagsak ng disc sa patayong grid. Ang unang makapagsama ng apat nang tuluy-tuloy nang pahalang, patayo, o pahilis ang mananalo.",
  },
  "chinese-checkers": {
    name: "Chinese Checkers",
    subtitle: "Star Board",
    rules:
      "Sa board na hugis bituin na may anim na dulo, ilipat ang lahat ng iyong piraso sa kabilang sulok muna para manalo. Ang piraso ay makakagalaw o makakalundag sa ibang piraso nang sunud-sunod para sulong.",
  },
  jigsaw: {
    name: "Sliding Puzzle",
    subtitle: "Numbered Tiles",
    rules: "Tapikin ang tile sa tabi ng walang laman na espasyo para idiin ito. Ayusin ang tiles mula 1 hanggang 15 nang sunud-sunod para matapos ang hamon.",
  },
  "number-merge": {
    name: "Number Merge",
    subtitle: "2048 Style",
    rules: "Mag-swipe o gamitin ang arrow buttons. Ang tiles na may parehong numero ay magsasama at dodoble kapag nagbanggaan; maabot ang 2048 para manalo.",
  },
  "memory-match": {
    name: "Memory Match",
    subtitle: "Matching Challenge",
    rules: "Buksan ang dalawang baraha nang sabay; ang magkatugmang pares ay mananatiling bukas. Itugma ang lahat ng pares sa kaunting bukas na maaari para manalo.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Manlalaro",
    rules: "Igulong ang dice para igalaw ang iyong piraso sa paligid ng board hanggang sa umuwi. Ang pagtapak sa piraso ng kalaban ay ibabalik ito sa simula.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Klasikong Solo",
    rules: "Ayusin ang lahat ng baraha sa apat na foundation pile ayon sa suit at pataas na pagkakasunod-sunod para linisin ang board at manalo.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Tile Rummy laban sa AI",
    rules: "Gamitin ang iyong mga may-numerong tile para bumuo ng run o set ng parehong numero, pagkatapos ilagay sa mesa. Unang maubos ang lahat ng iyong tiles para manalo.",
  },
  "rps-battle": {
    name: "Rock Paper Scissors",
    subtitle: "laban sa AI",
    rules: "Itapon ang bato, papel, o gunting laban sa computer nang sabay-sabay. Ang mas marami ang napanalunang round ay panalo sa laro.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 Laban sa 1 vs AI (Pinasimple)",
    rules:
      "Ikaw at ang AI ay may tig-2 baraha, kasama ang 5 community card na pinagsasaluhan. Pumili ng Call para buksan ang kamay, o Fold para sumuko — ang mas mataas na ranggo ng kamay ang mananalo sa pot.",
  },
  war: {
    name: "War",
    subtitle: "Pinakamataas na Baraha vs AI",
    rules:
      "Pantay na hahatiin ang baraha. Sa bawat round, magbubukas ang dalawang panig ng isang baraha — ang mas mataas ay panalo sa round. Ang tabla ay magtatrigger ng karagdagang labanan; ang may mas maraming baraha sa huli ang mananalo.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "vs Dealer",
    rules:
      "Ikaw at ang dealer ay bibigyan ng tig-3 baraha. Pagkatingin sa iyong kamay, Call para buksan at ikumpara, o Fold para sumuko sa round — ang mas mataas na ranggo ng kamay ang mananalo.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Sliding Block Puzzle",
    rules: "Idiin ang mga blocks ng iba't ibang sukat sa limitadong espasyo ng board. Ilipat ang pinakamalaking block sa exit sa ibaba para manalo.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Ayusin at Burahin ang Linya",
    rules:
      "I-swipe sa kaliwa o kanan para igalaw ang bumabagsak na block, tapikin para i-rotate, i-swipe pababa para mabilis na ibagsak. Punuin ang isang linya para burahin ito at kumita ng score; matatapos ang laro kung umabot sa tuktok ang tambak.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Itugma ang Kulay para Burahin",
    rules: "Tapikin ang isang direksyon para itira ang kasalukuyang bubble. Tatlo o higit pang magkaparehong kulay na nagkonekta ay mabubura at kikita ng points; matatapos ang laro kung umabot sa tuktok ang bubbles.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Palitan para Itugma",
    rules:
      "Tapikin ang isang tile, pagkatapos tapikin ang katabing tile para palitan ito. Ang pagtugma ng 3 o higit pang magkaparehong kulay ay bubura ito at magpupuno mula sa itaas, na maaaring magtrigger ng chain combo.",
  },
  hanoi: {
    name: "Tower of Hanoi",
    subtitle: "Ilipat ang Disc",
    rules:
      "Tapikin ang isang tower para kunin ang pinakaitaas na disc, pagkatapos tapikin ang ibang tower para ilipat ito. Ang malaking disc ay hindi dapat nasa ibabaw ng maliit — ilipat ang buong tambak sa pinakakanang tower para manalo.",
  },
  "water-sort": {
    name: "Water Sort Puzzle",
    subtitle: "Ibuhos para Ayusin ang Kulay",
    rules:
      "Tapikin ang tubo para kunin ang pinakaitaas na kulay, pagkatapos tapikin ang ibang tubo para ibuhos ito — sa walang laman o parehong kulay lang sa itaas. Ayusin ang bawat tubo sa isang kulay para manalo.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "I-rotate para Ikonekta",
    rules: "Tapikin ang pipe tile para i-rotate ito nang 90°. Ikonekta ang pinagmulan ng tubig sa kaliwang itaas hanggang sa exit sa kanang ibaba para manalo.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "I-time ang Iyong Paghulog",
    rules:
      "Ang block sa itaas ay gumagalaw pakaliwa at pakanan; tapikin para ibagsak ito sa tambak sa ibaba. Mas kaunting overlap, mas makitid ang block — ang kumpletong kawalan ng overlap ay tatapos ang laro.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Palitan para Ayusin",
    rules: "Tapikin ang dalawang may-numerong tile para palitan ang posisyon. Ayusin ang lahat ng numero mula sa pinakamaliit hanggang pinakamalaki sa kaunting palit para manalo.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "6×6 Grid",
    rules:
      "Ang bawat hanay, column, at 2×3 box ay dapat maglaman ng numero 1 hanggang 6 nang walang pag-uulit. Punuin ang buong grid nang walang conflict para manalo.",
  },
  "shooting-range": {
    name: "Shooting Range",
    subtitle: "Mabilis na Reflex Targets",
    rules: "Random na nagniningning ang mga target sa buong grid — tapikin kasing bilis maaari para kumita ng score. Maabot ang target score bago maubos ang oras para manalo.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Linisin ang Buong Fleet para Manalo",
    rules:
      "Gumalaw pakaliwa at pakanan para iwasan ang kalaban na pagbaril at itumba ang buong fleet ng alien. Mabibigo ang hamon kung lumapit ang fleet o maubos ang buhay.",
  },
  "tank-battle": {
    name: "Tank Battle",
    subtitle: "Unang Makaabot sa 3 Hits ang Panalo",
    rules: "Igalaw ang iyong tank pakaliwa at pakanan at pumutok ng bala. Ang tamaan sa linya ng kalaban ay kikita ng points — unang makaabot sa 3 hits ang mananalo.",
  },
  "brick-breaker": {
    name: "Brick Breaker",
    subtitle: "Sirain Lahat ng Brick para Manalo",
    rules:
      "I-drag ang paddle pakaliwa at pakanan para i-bounce ang bola at sirain lahat ng brick para manalo. Ang pagbagsak ng bola sa ibaba ay mawawalan ng buhay; mabibigo ang hamon kung maubos ang buhay.",
  },
  "zombie-defense": {
    name: "Zombie Defense",
    subtitle: "Buhayin ang Bawat Wave para Manalo",
    rules:
      "Gumagalaw ang zombie sa lane mula sa kanan; tapikin para sirain ito (ang ilan ay kailangan ng dalawang tapik). Ang pagpapahintulot sa isa na makaabot sa kaliwang gilid ay mawawalan ng buhay — buhayin ang bawat wave para manalo.",
  },
  "air-combat": {
    name: "Air Combat",
    subtitle: "Buhayin & Maabot ang Target Score",
    rules:
      "Awtomatikong bumabaril ang iyong fighter jet; igalaw pakaliwa at pakanan para iwasan ang kalaban at linisin ito. Buhayin hanggang sa time limit habang maabot ang target score para manalo; mawawalan ng buhay ay mabibigo ang hamon.",
  },
  billiards: {
    name: "Billiards",
    subtitle: "I-drag para Mag-aim, Pasukin Lahat ng Bola",
    rules:
      "I-drag pabalik mula sa puting bola para mag-aim, pagkatapos bitawan para ipalo. Pasukin lahat ng kulay na bola bago maubos ang pagkakataon para manalo.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Maabot ang Target Pin sa 3 Frame",
    rules: "I-drag ang slider para itakda ang anggulo ng pagpukol, pagkatapos bitawan para ipukol. Maabot ang kabuuang target ng natumbang pin sa 3 frame para manalo.",
  },
  "basketball-shoot": {
    name: "Basketball Shootout",
    subtitle: "I-time ang Iyong Shot",
    rules: "Awtomatikong gumagalaw pabalik-balik ang power meter — tapikin para shoot kapag malapit sa gitna para pumasok. Kumita ng sapat na goal para manalo.",
  },
  "penalty-kick": {
    name: "Penalty Kick",
    subtitle: "Pumili ng Side vs Goalkeeper",
    rules: "Pumili ng kaliwa, gitna, o kanan para shoot laban sa goalkeeper na random na tumatalon. Kumita ng sapat na goal sa 5 round para manalo.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Lumipat ng Lane para Iwasan ang Traffic",
    rules: "Lumipat ng lane pakaliwa at pakanan para iwasan ang paparating na traffic. Mabibigo ang hamon kung maubos ang buhay bago maabot ang finish distance.",
  },
  parking: {
    name: "Parking Challenge",
    subtitle: "Mag-park sa Loob ng Move Limit",
    rules: "Gamitin ang steering control at forward para mag-park eksakto sa minarkahang lugar bago maubos ang iyong moves o bangga para manalo.",
  },
  motocross: {
    name: "Motocross Jump",
    subtitle: "Lundag sa Butas hanggang Finish",
    rules: "Tapikin para ilundag ang iyong motor at lusutan ang butas sa unahan sa tamang timing. Mabibigo ang hamon kung maubos ang buhay bago maabot ang finish.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Kontrolin ang Liko para sa Score",
    rules: "Kontrolin ayon sa liko ng track para manatili sa track habang nangongolekta ng drift points. Maabot ang finish na may sapat na points para manalo.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Palitan, Unang KO ang Panalo",
    rules:
      "Pumili ng Attack para punuin ang special meter, Guard para bawasan ng kalahati ang susunod na atake, o i-release ang Finisher kapag puno ang meter. Unang makapagbawas ng buhay ng kalaban sa zero para manalo.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Magpartner laban sa dalawang computer na kalaban",
    rules:
      "Ikaw at ang North partner mo ay naglalaro laban sa West at East, na kontrolado ng computer. Sa bawat trick, ang apat na manlalaro ay naglalaro nang palitan at dapat sumunod sa suit kung maaari; kung hindi, maaaring maglaro ng kahit na anong suit o trump. Ang pinakamataas na baraha ng naunang suit, o ang pinakamataas na trump, ay mananalo sa trick. Pagkatapos ng lahat ng 13 trick, ang pagpanalo ng 7 o higit pang trick bilang partnership ang mananalo sa kamay.",
  },
  "pick-red-points": {
    name: "Pick Red Points",
    subtitle: "Itugma ang nilaro na baraha sa isa sa mesa",
    rules:
      "Palitan ang pagglaro ng isang baraha: kung ang ranggo nito ay tumutugma sa baraha sa mesa, kuhanin ang lahat ng baraha ng ranggong iyon kasama ang iyong nilaro na baraha para kumita ng points. Kung hindi, mananatili ito sa mesa. Pagkaubos ng deck, ikumpara ang nakolektang pulang puso/diamante ng bawat panig — ang regular na pulang baraha ay nagkakahalaga ng 1 point, ang pulang 10, Jack, Queen, at King ay nagkakahalaga ng 10 bawat isa. Ang mas mataas na kabuuan ang mananalo.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Labanan ang Landlord)",
    subtitle: "Landlord laban sa dalawang Farmer",
    rules:
      "Pagkatapos ng paghahatid, itatakda ng system ang isang Landlord (ikaw o computer) batay sa lakas ng kamay — ang Landlord ay kukuha ng 3 dagdag na nakatagong baraha, at ang dalawa pa ay magiging Farmer na magtutulungan laban dito. Palitan ang pagglaro ng kombinasyon na mas malakas kaysa sa huli, o pumasa kung hindi maaari. Ang Landlord na unang maubos ang baraha ay mananalo para sa Landlord; ang alinmang Farmer na unang matapos ay mananalo para sa mga Farmer.",
  },
  "liars-cards": {
    name: "Liar's Cards",
    subtitle: "Maglaro nang pabaligtad, sabihin ang ranggo, hulaan ang kasinungalingan",
    rules:
      "Ikaw at dalawang computer na kalaban ay palitan: maglaro ng 1–4 baraha nang pabaligtad at ideklara ang isang ranggo (ang ranggo ay dapat umiikot A→2→3→...→K→A, at maaari kang magsabi ng totoo o magsinungaling). Ang ibang manlalaro ay maaaring Maniwala at ipasa ang turn, o Hamunin ang kasinungalingan sa pagbukas ng baraha para suriin — ang tamang hamon ay magpapakuha sa manlalaro na naglaro ng baraha sa buong tambak sa mesa, ang maling hamon ay ang humahamon ang kukuha nito. Ang unang maubos ang kamay nang hindi nahuling nagsisinungaling ang mananalo.",
  },
  "five-pk": {
    name: "5-Card Poker",
    subtitle: "Isang bunot, pagkatapos ikumpara ang kamay na may double-or-nothing option",
    rules:
      "Tumaya, pagkatapos ihahatid ang 5 baraha (2 joker ang nasa deck). Panatilihin ang mga baraha na gusto mo at bunutin isang beses para palitan ang iba. Ang kamay ay babayaran ayon sa ranggo — straight flush 500x, five of a kind 200x, flush straight 120x, pababa hanggang two pair 1x. Pagkatapos manalo, maaari kang double or nothing sa malaki/maliit o pula/itim, o kunin ang panalo anumang oras.",
  },
  "little-mary": {
    name: "Classic Little Mary",
    subtitle: "Umiikot na light frame — tumaya sa malaki o maliit na baraha",
    rules:
      "Tumaya sa bawat simbolo, pagkatapos simulan. Ang light frame ay mabilis na umiikot sa loob ng 3 laps, pagkatapos bumagal para tumigil sa loob ng kalahati hanggang isa't kalahating lap — tapikin ang Stop para ihinto ito nang maaga. Ang paghinto sa arrow ay matalo; ang paghinto sa free-spin symbol ay magbibigay ng libreng respin; ang fixed symbols ay babayaran ng itinakdang multiple; ang malaki o maliit na card symbols ay babayaran ayon sa running multiplier kung pinustahan mo iyon. Pagkatapos ng sapat na spins, maaaring magtrigger ang bonus round na may mas mataas na fixed payout at signature chime.",
  },
  "little-mary-2": {
    name: "Classic Little Mary II",
    subtitle: "Umiikot na light frame na sports-theme",
    rules:
      "Pareho ang spinning mechanics sa Classic Little Mary, binago ang tema sa sports (soccer, rugby, basketball, bowling, tennis, table tennis, golf). Tumaya sa bawat simbolo pagkatapos simulan — ang paghinto sa arrow ay matalo, ang free symbol ay magbibigay ng libreng respin, ang fixed symbols ay babayaran ng itinakdang multiple, at ang malaki o maliit na sports symbols ay babayaran ayon sa running multiplier kung pinustahan. Maaaring magtrigger ang bonus round pagkatapos ng sapat na spins na may fixed na mataas na payout.",
  },
  "little-mary-3": {
    name: "Classic Little Mary III",
    subtitle: "Flower-god jackpot — tumaya sa malaki o maliit",
    rules:
      "Pareho ang spinning mechanics sa Classic Little Mary. Ang tatlong flower-god lights ay normal na kumukurap nang hiwalay; pagkatapos ng sapat na spins maaari itong mag-sync sa flashing alert state. Kung ang reel ay titigil sa malaki o maliit na symbol group habang nasa alert na ito, lahat ng tatlong symbols ay babayaran nang sabay sa 3x ng running multiplier — bihirang jackpot bonus.",
  },
  "little-mary-4": {
    name: "Classic Little Mary IV",
    subtitle: "Animal-theme flower-god jackpot",
    rules:
      "Pareho ang mekanismo sa Flower-God Jackpot edition, binago ang tema sa animal (tiger, dragon, monkey, fox, mouse, rooster, chick). Pareho ang flower-god jackpot alert at 3x payout.",
  },
  "little-mary-5": {
    name: "Classic Little Mary III (Phoenix)",
    subtitle: "Phoenix decoration edition — tumaya sa malaki o maliit",
    rules:
      "Pareho ang spinning mechanics sa Classic Little Mary. Ang malaking phoenix sa gitna ay puro dekorasyon lamang, mas mabilis na kumukurap habang bonus alert. Ang paghinto sa alinmang free-spin symbol ay magsasapot ng dekorasyong light trail sa frame — visual lang, hindi nagbabago ang payout.",
  },
  "little-mary-6": {
    name: "Classic Little Mary IV (Phoenix)",
    subtitle: "Phoenix decoration edition — drinks theme",
    rules:
      "Pareho ang mekanismo sa Phoenix Decoration edition, binago ang tema sa drinks (teapot, honey, mate tea, shaved ice, beer, wine, cocktail). Pareho ang decorative phoenix at light-trail effects.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Ocean)",
    subtitle: "8×8 mini frame — tumaya sa malaki o maliit",
    rules:
      "Mas maliit na 8×8 light frame (28 positions) na may pareho spin mechanics, may temang ocean animals (shark, whale, dolphin, tropical fish, crab, shell, bubbles). Ang paghinto sa arrow ay matalo, ang free symbol ay magbibigay ng libreng respin, ang fixed symbols ay babayaran ng itinakdang multiple, at ang malaki o maliit na symbols ay babayaran ayon sa running multiplier kung pinustahan. Maaaring magtrigger ang jackpot bonus round pagkatapos ng sapat na spins.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Dessert)",
    subtitle: "8×8 mini frame — dessert theme",
    rules:
      "Pareho ang 8×8 mini-frame mechanics sa Ocean edition, binago ang tema sa dessert (cake, strawberry cake, cupcake, donut, cookie, candy, lollipop). Maaaring magtrigger ang jackpot bonus round pagkatapos ng sapat na spins na may signature chime.",
  },
  "fruit-slot-1": {
    name: "Fruit Reels I",
    subtitle: "Klasikong 3×3 reels, 5 paylines",
    rules:
      "Klasikong 3-reel, 3-row fruit machine na may 5 paylines (itaas, gitna, ibabang row kasama ang dalawang diagonal). Tumaya kada line, pagkatapos i-spin — ang bawat reel ay titigil nang hiwalay mula kaliwa hanggang kanan, at maaari kang tapikin ang Stop para ihinto nang maaga. Tatlong magkaparehong symbols sa alinmang payline ay babayaran ayon sa table, mula lucky 7 na 100x pababa sa cherry na 4x; dalawa o higit pang cherry saanman sa screen ay babayaran ng maliit na consolation; tatlong 7 sa gitnang row ay ang jackpot na may sariling light show at chime.",
  },
  "fruit-slot-2": {
    name: "Fruit Reels II",
    subtitle: "Tropical fruit theme, 5 paylines",
    rules:
      "Pareho ang 3-reel, 5-payline mechanics sa Fruit Reels I, binago ang tema sa tropical — pinapalitan ng diamond ang lucky 7 bilang jackpot symbol, kasama ang strawberry, pineapple, banana, peach, at cherry. Tatlong magkaparehong symbols sa alinmang payline ay babayaran ayon sa table, mula diamond na 100x pababa sa cherry na 4x; tatlong diamond sa gitnang row ay ang jackpot.",
  },
  "little-mary-bonus": {
    name: "Classic Little Mary V (Lucky 7 Bonus)",
    subtitle: "Lucky sevens bonus multiplier round",
    rules:
      "Pareho ang spinning mechanics sa Classic Little Mary, na may taya sa 8 symbols nang sabay. Ang tatlong digit reels sa gitna ay normal na umiikot bilang pure decoration; sa panalo ay may tsansa itong magtrigger ng bonus round kung saan ang tatlong reels ay titigil isa-isa. Ang paghinto sa tatlong magkaparehong odd digits ay idodoble ang panalo mo ng 10x, tatlong magkaparehong even digits ng 5x — bihirang random bonus na hindi palaging nagttrigger.",
  },
  "little-mary-bonus-2": {
    name: "Classic Little Mary IV (Lucky 7 Bonus, Festive)",
    subtitle: "Festive theme lucky sevens bonus",
    rules:
      "Pareho ang mekanismo sa Lucky Sevens Bonus edition, binago ang tema sa festive (red envelope, gold ingot, lantern, mandarin orange, mooncake, fireworks, cherry). Pareho ang bonus round at 10x/5x digit-match multipliers, na may festive colors at sound effects.",
  },
  "xiangqi-mahjong": {
    name: "Xiangqi Mahjong",
    subtitle: "Bumuo ng sets mula sa chess pieces, takbuhan ang computer para manalo",
    rules:
      "Tumaya, pagkatapos ikaw at ang computer ay bubunot ng tig-5 Chinese chess pieces. Sa iyong turn, bunutin ang isang piraso — kung kumpleto ang isang pares kasama ang isang set (run o triplet), mananalo ka sa self-draw. Kung hindi, itapon ang isa sa iyong 6 na piraso. Kung ang itinapon ng computer ay nagkumpleto ng iyong kamay, maaari mo itong angkinin para manalo, o pumasa at ipagpatuloy ang pagbunot. Mga payout: 2x para sa mixed pair-and-run, 3x para sa same-suit pair-and-run, 5x para sa limang sundalo o pawn; ang pag-angkin ng discard ay babayaran ayon sa listed rate, ang self-draw ay magdadagdag ng bonus. Kung maubos ang deck nang walang panalo, ibabalik ang mga taya.",
  },
  tuitongzai: {
    name: "Push Cylinder (Tui Tong Zai)",
    subtitle: "Mahjong-tile pai gow sa tatlong posisyon nang sabay",
    rules:
      "Gumagamit ng mahjong dot tiles 1–9 (4 bawat isa) kasama ang blangkong tiles (4, nagkakahalaga ng kalahating point) para kumatawan sa 40-tile deck. Tumaya sa head, heaven, at tail positions, pagkatapos ang dealer at ang bawat posisyon ay babaligtad ng 2 tiles para ikumpara. Ranggo order: double blank (pinakamataas) ay natatalo ang kahit na anong pares, na natatalo sa 2-8 combo, na natatalo sa normal point total (kabuuan ng digits, huling digit ang binibilang, blank = 0.5, 9.5 ang pinakamahusay na normal total, 0 ang pinakamababa). Ang bawat posisyon ay ikukumpara sa dealer nang hiwalay — ang panalo ay babayaran ng 1x, na may mga pares babayaran ng 4x at double blank babayaran ng 10x; ang parehong totals ay pinapaboran ang dealer ayon sa house rule.",
  },
  }
}

const es: GameTable = {
  xiangqi: {
    name: "Ajedrez Chino",
    subtitle: "IA Individual／2 Jugadores",
    rules:
      "Muevan las piezas por turnos; el primero en acorralar al general contrario sin escapatoria gana. Sigue las reglas tradicionales del Xiangqi: la carroza avanza recto, el caballo en forma de L, el elefante en diagonal dentro de su territorio, el consejero en diagonal junto al palacio, y el soldado puede moverse lateralmente tras cruzar el río.",
  },
  "darkchess-classic": {
    name: "Ajedrez Oculto (Clásico)",
    subtitle: "IA Individual／2 Jugadores",
    rules: "Todas las piezas empiezan boca abajo. Al voltearlas se capturan según el orden jerárquico tradicional. Capturar todas las piezas rivales o dejarlas sin movimientos gana.",
  },
  "darkchess-variant": {
    name: "Ajedrez Oculto (Variante)",
    subtitle: "IA Individual／2 Jugadores",
    rules: "Igual que el clásico, pero el ataque y captura por salto del cañón siguen reglas variantes, añadiendo nuevas tácticas.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Coloquen piedras negras y blancas por turnos en las intersecciones de un tablero de 19×19; quien controle más territorio gana. Las piedras totalmente rodeadas sin libertades son capturadas.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Coloquen piedras por turnos; el primero en alinear cinco en fila horizontal, vertical o diagonal gana." },
  othello: {
    name: "Otelo",
    subtitle: "Estándar",
    rules: "Coloquen fichas por turnos; las fichas rivales atrapadas entre las suyas se voltean a su color. Al final, quien tenga más fichas gana.",
  },
  mahjong: {
    name: "Mahjong Chino",
    subtitle: "IA Individual (3 Computadoras)",
    rules: "Juega en una mesa con tres oponentes controlados por IA, roba y descarta fichas por turnos, puedes reclamar descartes con Chow／Pong／Kong. El primero en completar una mano válida gana.",
  },
  luzhanqi: {
    name: "Luzhanqi (Ajedrez Militar)",
    subtitle: "IA Individual／2 Jugadores",
    rules: "El rango de las piezas de ambos bandos es secreto; el rival solo ve el reverso. Las batallas se deciden por rango; el primero en capturar la bandera enemiga o dejarlo sin movimientos gana.",
  },
  checkers: {
    name: "Damas",
    subtitle: "Estándar",
    rules: "Muevan piezas en diagonal por turnos; pueden saltar para capturar piezas rivales. Capturar todas las piezas rivales o dejarlas sin movimientos gana.",
  },
  tictactoe: {
    name: "Tres en Raya",
    subtitle: "Formato Ampliado 3×3",
    rules: "Coloquen símbolos por turnos; el primero en alinear tres en fila horizontal, vertical o diagonal gana.",
  },
  sevens: {
    name: "Juego de los Sietes",
    subtitle: "4 jugadores, cadena de cartas, menor puntaje de cartas bloqueadas gana",
    rules:
      "Comienza con la carta base 5; por turnos juega cartas de número adyacente. Si no puedes jugar, bloqueas una carta que resta puntos; al final, quien tenga menos puntos en cartas bloqueadas gana.",
  },
  "sichuan-mahjong": {
    name: "Mahjong Sichuan (Batalla a Muerte)",
    subtitle: "Falta un palo obligatorio, el ganador sigue jugando",
    rules:
      "Solo se usan tres palos; al inicio debes descartar un palo por completo. El primero en ganar se retira y los demás siguen jugando hasta que tres jugadores ganen o se acaben las fichas.",
  },
  "malaysia-mahjong": {
    name: "Mahjong Malasia de Tres Tríos",
    subtitle: "3 jugadores, fichas voladoras comodín",
    rules:
      "Partida de tres jugadores donde el mazo solo incluye círculos, fichas honoríficas y fichas voladoras (comodines), facilitando combinaciones grandes.",
  },
  "mahjong-pengpeng": {
    name: "Peng Peng (Solo Trío)",
    subtitle: "Mahjong simplificado, solo trío sin secuencias",
    rules: "Mazo simplificado donde solo puedes formar tríos (Pong) o robar, sin secuencias (Chow); gana con 2 tríos y 1 par.",
  },
  "mahjong-sevens": {
    name: "Mahjong de los Sietes",
    subtitle: "Como Sevens, pero con fichas de mahjong",
    rules:
      "Comienza con los cincos de cada palo como base; juega fichas de número adyacente por turnos, bloquear una ficha resta puntos.",
  },
  "riichi-mahjong": {
    name: "Mahjong Riichi Japonés",
    subtitle: "Ronda del Este, Riichi / Dora / Furiten",
    rules:
      "Con la mano cerrada y lista puedes declarar Riichi apostando; las fichas Dora suman puntos extra; en Furiten no puedes ganar con una ficha que ya descartaste; necesitas un Yaku válido para ganar.",
  },
  "mahjong-solitaire": {
    name: "Solitario de Mahjong",
    subtitle: "Encuentra pares iguales, conéctalos con máx. 2 giros",
    rules:
      "Encuentra dos fichas iguales conectables con no más de dos giros de línea para eliminarlas; despeja el tablero antes de que se acabe el tiempo para ganar.",
  },
  "merge-2048": {
    name: "2048 Fusión",
    subtitle: "Desliza para fusionar números, llega al 2048",
    rules: "Desliza arriba, abajo, izquierda o derecha; los números iguales se fusionan y duplican al chocar. Logra el 2048 para ganar.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Fusiona edificios, de un prado a un rascacielos",
    rules: "Mismo juego que 2048, pero los números son edificios; fusiona progresivamente desde un prado hasta un rascacielos.",
  },
  "merge-2048-undo": {
    name: "2048 con Deshacer",
    subtitle: "Fusiona números con opción de deshacer",
    rules: "Igual que 2048, pero con función de deshacer: si deslizas en la dirección equivocada, puedes retroceder e intentarlo de nuevo.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Fusiona edificios, cuidado con los osos",
    rules:
      "En un tablero de 6x6, fusiona tres objetos iguales para mejorarlos; los osos se mueven y estorban, pero puedes atraparlos para convertirlos en lápidas fusionables.",
  },
  suika: {
    name: "Suika Game (Fusión de Sandías)",
    subtitle: "Mueve y suelta frutas, las iguales se fusionan y crecen",
    rules:
      "Mueve a izquierda o derecha para elegir dónde soltar la fruta; frutas iguales que choquen se fusionan en una más grande, con la sandía como meta final.",
  },
  "drop-2048": {
    name: "2048 de Caída",
    subtitle: "Bloques numéricos caen y se apilan, fusiona para duplicar",
    rules: "Los bloques numéricos caen desde arriba; muévelos a los lados para elegir posición, al apilar números iguales se fusionan y duplican.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Caen pares de gelatinas, 4 o más del mismo color eliminan",
    rules: "Caen pares de gelatinas de colores que puedes mover y girar; conecta 4 o más del mismo color para eliminarlas y encadenar combos.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Cápsulas caen y se apilan, alinea para eliminar virus",
    rules: "Cápsulas de dos colores caen y se apilan; alinea el mismo color para eliminar virus, despeja todos los virus para superar el nivel.",
  },
  "columns-tetris": {
    name: "Columnas / Tetris",
    subtitle: "Alterna entre dos clásicos de caída y eliminación",
    rules: "Puedes alternar entre Columnas (conecta gemas del mismo color) y Tetris (completa una línea para eliminarla).",
  },
  "candy-crush": {
    name: "Candy Crush Saga",
    subtitle: "Intercambia dulces en línea de 3, alcanza la puntuación meta",
    rules:
      "Intercambia dulces adyacentes para formar líneas de 3; los dulces especiales son poderosos, alcanza la puntuación meta dentro del límite de movimientos.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "El pionero de los 3 en línea, intercambia gemas",
    rules: "Intercambia gemas adyacentes para formar líneas del mismo color y elimínalas; acumula puntos continuamente para superar tu récord.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Gana monedas con 3 en línea, restaura el jardín abandonado",
    rules: "Gana monedas combinando fichas en línea de 3; usa las monedas para completar las tareas de restauración del jardín.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Gana monedas con 3 en línea, decora la mansión de tus sueños",
    rules: "Gana monedas combinando fichas en línea de 3; usa las monedas para completar las tareas de decoración de la mansión.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Gana monedas con 3 en línea, restaura el antiguo castillo",
    rules: "Gana monedas combinando fichas en línea de 3; usa las monedas para completar las tareas de restauración del castillo.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Combina gemas + batalla con cartas y progresión",
    rules: "Al combinar gemas, los aliados del elemento correspondiente atacan a los enemigos; derrota a los enemigos para subir de nivel y avanzar.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Combina gemas + batalla con ventajas elementales",
    rules: "Combina gemas para atacar; aprovecha las ventajas elementales para causar más daño y derrotar enemigos.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Combina gemas + construcción simplificada y PvP",
    rules:
      "Combina gemas para que tus héroes ataquen; derrota rivales para obtener materiales de construcción y expandir tu imperio paso a paso.",
  },
  "sheep-sheep": {
    name: "Oveja tras Oveja",
    subtitle: "Toca fichas apiladas y colecciona hasta juntar 3 iguales",
    rules:
      "Toca las fichas no bloqueadas para enviarlas a la bandeja de recolección; junta 3 iguales para eliminarlas, si la bandeja se llena sin completar, pierdes.",
  },
  match3d: {
    name: "Eliminación 3D",
    subtitle: "Pila de objetos 3D, toca y colecciona en trío",
    rules: "Mismo juego que Oveja tras Oveja, pero con una pila de objetos tridimensionales para buscar y coleccionar en trío.",
  },
  "balls-merge": {
    name: "Fusión de Pelotas",
    subtitle: "Mueve a los lados y suelta, las pelotas iguales se fusionan y crecen",
    rules: "Mismo juego que Suika Game, con temática de pelotas; las pelotas iguales se fusionan en una más grande.",
  },
  "cookies-merge": {
    name: "Fusión de Galletas",
    subtitle: "Mueve a los lados y suelta, las galletas iguales se fusionan y crecen",
    rules: "Mismo juego que Suika Game, con temática de galletas; las galletas iguales se fusionan en una más grande.",
  },
  "planets-merge": {
    name: "Fusión de Planetas",
    subtitle: "Mueve a los lados y suelta, los planetas iguales se fusionan y crecen",
    rules: "Mismo juego que Suika Game, con temática de planetas; los planetas iguales se fusionan en uno más grande.",
  },
  "mahjong-ninepoint5": {
    name: "Nueve y Medio de Mahjong",
    subtitle: "Fichas de mahjong simulando cartas, acércate a 9.5",
    rules: "Usa fichas de mahjong en lugar de cartas; pide más fichas o detente, gana quien se acerque más a 9.5 sin pasarse.",
  },
  "mahjong-niuniu": {
    name: "Niu Niu de Mahjong",
    subtitle: "Fichas de mahjong simulando cartas, forma 10 y compara",
    rules: "Usa fichas de mahjong en lugar de cartas; de 5 fichas, 3 deben sumar un múltiplo de 10, las otras 2 se comparan por puntos.",
  },
  "dragon-gate": {
    name: "Puerta del Dragón",
    subtitle: "Fichas de círculos de mahjong, adivina mayor o menor",
    rules:
      "Se revelan dos fichas de círculos como puerta; tras apostar se revela una tercera, si cae dentro del rango ganas, fuera pierdes, y si coincide con el límite se paga doble.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Contra el crupier, acércate a 21",
    rules:
      "Acércate a 21 sin pasarte. El As vale 1 u 11, las figuras valen 10. Elige Pedir o Plantarte — el crupier debe seguir pidiendo hasta llegar a 17 o más.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Apuesta a Player, Banker o Tie antes de repartir las cartas. El total usa el último dígito de la suma; el total mayor gana. Las cartas adicionales se reparten automáticamente según las reglas estándar del baccarat.",
  },
  "ten-half": {
    name: "Diez y Medio",
    subtitle: "Acércate más a 10,5 que el crupier",
    rules:
      "Apuesta, luego ambos lados reciben 2 cartas. Elige Pedir o Plantarte — quien se acerque más a 10,5 sin pasarse gana. El As vale 1 punto, las figuras 0,5 puntos. Un 10,5 natural al repartir paga 3x; una victoria normal paga 2x; un empate devuelve la apuesta.",
  },
  "thirteen-water": {
    name: "Trece Cartas",
    subtitle: "Divide 13 cartas en 3 manos contra el crupier",
    rules:
      "Apuesta y reparte. El sistema organiza automáticamente tus 13 cartas y las del crupier en una mano frontal de 3 cartas, una media de 5 y una final de 5, comparadas por separado. Ganar las 3 manos paga 5x, ganar 2 paga 2x, ganar 1 paga 1,5x, un empate no paga ni quita, y perder más de lo que ganas pierde la apuesta.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Juega cartas sueltas o pares para vaciar tu mano primero",
    rules:
      "Apuesta y juega contra el crupier. Juega una carta suelta o un par del mismo rango que supere la última jugada, o pasa. El orden va del 3 (más bajo) al 2 (más alto), con el palo decidiendo empates. Vacía tus 13 cartas primero para ganar 2x tu apuesta.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Compara 5 cartas directamente contra el crupier",
    rules:
      "Apuesta, luego tú y el crupier recibís 5 cartas cada uno y comparáis el rango directamente — escalera de color, póker, full, color, escalera, trío, doble pareja, pareja, carta alta. La mano más fuerte gana 2x; un empate devuelve la apuesta.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Forma múltiplos de 10 con 5 cartas para la mejor puntuación de toro",
    rules:
      "Apuesta, luego tú y el crupier recibís 5 cartas cada uno. Elige 3 que sumen un múltiplo de 10 ('toro'); el último dígito de las 2 restantes es tu puntuación, cuanto más alta mejor. Un 10 exacto es el 'Toro Toro' más alto; ninguna combinación válida es 'Sin Toro', la más baja. La puntuación mayor gana 2x; un empate devuelve la apuesta. Las figuras valen 10, el As vale 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Compara 3 cartas directamente contra el crupier",
    rules:
      "Apuesta, luego tú y el crupier recibís 3 cartas cada uno y comparáis el rango directamente — trío, escalera de color, color, escalera, pareja, carta alta. La mano más fuerte gana 2x; un empate devuelve la apuesta.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 rondas de reparto — retírate o dobla en cada etapa",
    rules:
      "Fija tu apuesta inicial. Las cartas se reparten en 4 etapas (3, luego 2, luego 1, luego las últimas 2 reveladas), y tras cada etapa puedes retirarte o doblar tu apuesta. La mejor mano de 5 cartas de tus 7 decide el resultado. Retirarte pierde tu apuesta total actual; ganar paga según el rango, desde escalera real de color a 150x hasta doble pareja a 1x.",
  },
  chess: {
    name: "Ajedrez",
    subtitle: "IA Individual／2 Jugadores",
    rules:
      "Muevan las piezas por turnos; el primero en dar jaque mate al rey contrario gana. Sigue las reglas estándar del ajedrez para el movimiento de peones, torres, caballos, alfiles, reina y rey.",
  },
  connect4: {
    name: "Conecta Cuatro",
    subtitle: "IA Individual／2 Jugadores",
    rules: "Suelten fichas por turnos en una cuadrícula vertical. El primero en alinear cuatro en fila horizontal, vertical o diagonal gana.",
  },
  "chinese-checkers": {
    name: "Damas Chinas",
    subtitle: "Tablero Estrella",
    rules:
      "En un tablero en forma de estrella de seis puntas, mueve todas tus fichas a la esquina opuesta primero para ganar. Las fichas pueden avanzar un paso o saltar en cadena sobre otras fichas para avanzar.",
  },
  jigsaw: {
    name: "Puzle Deslizante",
    subtitle: "Fichas Numeradas",
    rules: "Toca la ficha junto al espacio vacío para deslizarla. Ordena las fichas del 1 al 15 en secuencia para completar el reto.",
  },
  "number-merge": {
    name: "Fusión de Números",
    subtitle: "Estilo 2048",
    rules: "Desliza o usa los botones de dirección. Las fichas con el mismo número se fusionan y duplican su valor al chocar; llega al 2048 para ganar.",
  },
  "memory-match": {
    name: "Memorama",
    subtitle: "Reto de Emparejar",
    rules: "Voltea dos cartas a la vez; los pares que coincidan permanecen abiertos. Empareja todas las parejas con el menor número de intentos para ganar.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Jugadores",
    rules: "Lanza el dado para mover tu ficha alrededor del tablero hasta llegar a casa. Caer en la ficha del rival la envía de vuelta al inicio.",
  },
  solitaire: {
    name: "Solitario",
    subtitle: "Clásico Individual",
    rules: "Ordena todas las cartas en las cuatro pilas base según el palo y en orden ascendente para despejar el tablero y ganar.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Rami de Fichas vs IA",
    rules: "Usa tus fichas numeradas para formar escaleras o grupos del mismo número, luego colócalas en la mesa. Agota todas tus fichas primero para ganar.",
  },
  "rps-battle": {
    name: "Piedra Papel o Tijera",
    subtitle: "vs IA",
    rules: "Lanza piedra, papel o tijera contra la computadora simultáneamente. Quien gane más rondas gana la partida.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 contra 1 vs IA (Simplificado)",
    rules:
      "Tú y la IA tienen 2 cartas cada uno, más 5 cartas comunitarias compartidas. Elige Call para revelar tu mano, o Fold para retirarte — la mano de mayor rango gana el bote.",
  },
  war: {
    name: "Guerra",
    subtitle: "Carta Más Alta vs IA",
    rules:
      "Las cartas se reparten por igual. En cada ronda ambos lados revelan una carta — la más alta gana la ronda. Un empate desencadena una batalla adicional; quien tenga más cartas al final gana.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "vs Crupier",
    rules:
      "Tú y el crupier reciben 3 cartas cada uno. Después de ver tu mano, Call para revelar y comparar, o Fold para retirarte de la ronda — la mano de mayor rango gana.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Puzle de Bloques Deslizantes",
    rules: "Deslice bloques de varios tamaños en un espacio de tablero limitado. Mueve el bloque más grande hasta la salida inferior para ganar.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Ordena y Elimina Líneas",
    rules:
      "Desliza a la izquierda o derecha para mover el bloque que cae, toca para rotarlo, desliza hacia abajo para caer rápido. Completa una línea para eliminarla y ganar puntos; el juego termina si la pila llega arriba.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Combina Colores para Eliminar",
    rules: "Toca una dirección para disparar la burbuja actual. Tres o más burbujas del mismo color conectadas se eliminan y dan puntos; el juego termina si las burbujas llegan arriba.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Intercambia para Combinar",
    rules:
      "Toca una ficha, luego toca una ficha vecina para intercambiarlas. Combinar 3 o más del mismo color las elimina y rellena desde arriba, lo que puede provocar combos en cadena.",
  },
  hanoi: {
    name: "Torre de Hanói",
    subtitle: "Mueve los Discos",
    rules:
      "Toca una torre para tomar el disco superior, luego toca otra torre para moverlo. Un disco grande no puede estar sobre uno pequeño — mueve toda la pila a la torre más a la derecha para ganar.",
  },
  "water-sort": {
    name: "Puzle de Clasificar Agua",
    subtitle: "Vierte para Ordenar Colores",
    rules:
      "Toca un tubo para tomar el color superior, luego toca otro tubo para verterlo — solo en un tubo vacío o con el mismo color arriba. Ordena cada tubo en un solo color para ganar.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Gira para Conectar",
    rules: "Toca una ficha de tubería para girarla 90°. Conecta la fuente de agua arriba a la izquierda hasta la salida abajo a la derecha para ganar.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Calcula el Momento de Caída",
    rules:
      "El bloque superior se mueve a izquierda y derecha; toca para dejarlo caer sobre la pila inferior. Cuanto menos se superponga, más estrecho será el bloque — fallar la pila por completo termina el juego.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Intercambia para Ordenar",
    rules: "Toca dos fichas numeradas para intercambiar su posición. Ordena todos los números de menor a mayor con el menor número de intercambios para ganar.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Cuadrícula 6×6",
    rules:
      "Cada fila, columna y caja de 2×3 debe contener los números del 1 al 6 sin repetir. Llena toda la cuadrícula sin conflictos para ganar.",
  },
  "shooting-range": {
    name: "Galería de Tiro",
    subtitle: "Objetivos de Reflejos Rápidos",
    rules: "Los objetivos se iluminan al azar en toda la cuadrícula — toca lo más rápido posible para ganar puntos. Alcanza la puntuación meta antes de que se acabe el tiempo para ganar.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Elimina Toda la Flota para Ganar",
    rules:
      "Muévete a izquierda y derecha para evitar los disparos enemigos y derribar toda la flota alienígena. El reto falla si la flota se acerca demasiado o se te acaban las vidas.",
  },
  "tank-battle": {
    name: "Batalla de Tanques",
    subtitle: "El Primero en Lograr 3 Impactos Gana",
    rules: "Mueve tu tanque a izquierda y derecha y dispara proyectiles. Acertar en el carril del rival da puntos — sé el primero en lograr 3 impactos para ganar.",
  },
  "brick-breaker": {
    name: "Rompe Ladrillos",
    subtitle: "Destruye Todos los Ladrillos para Ganar",
    rules:
      "Arrastra la paleta a izquierda y derecha para rebotar la pelota y destruir todos los ladrillos para ganar. Si la pelota cae pierdes una vida; el reto falla si se te acaban las vidas.",
  },
  "zombie-defense": {
    name: "Defensa contra Zombis",
    subtitle: "Sobrevive Cada Oleada para Ganar",
    rules:
      "Los zombis avanzan por el carril desde la derecha; toca para destruirlos (algunos necesitan dos toques). Dejar que uno llegue al borde izquierdo resta una vida — sobrevive cada oleada para ganar.",
  },
  "air-combat": {
    name: "Combate Aéreo",
    subtitle: "Sobrevive y Alcanza la Puntuación Meta",
    rules:
      "Tu avión de combate dispara automáticamente; muévete a izquierda y derecha para evitar aviones enemigos y eliminarlos. Sobrevive hasta el límite de tiempo mientras alcanzas la puntuación meta para ganar; si se te acaban las vidas el reto falla.",
  },
  billiards: {
    name: "Billar",
    subtitle: "Arrastra para Apuntar, Mete Todas las Bolas",
    rules:
      "Arrastra hacia atrás desde la bola blanca para apuntar, luego suelta para golpear. Mete todas las bolas de color antes de que se acaben los intentos para ganar.",
  },
  bowling: {
    name: "Bolos",
    subtitle: "Alcanza la Meta de Pinos en 3 Entradas",
    rules: "Arrastra el control deslizante para ajustar el ángulo de lanzamiento, luego suelta para lanzar. Alcanza el total meta de pinos caídos en 3 entradas para ganar.",
  },
  "basketball-shoot": {
    name: "Tiros de Baloncesto",
    subtitle: "Calcula el Momento del Tiro",
    rules: "El medidor de potencia se mueve automáticamente de adelante hacia atrás — toca para tirar cuando esté cerca del centro para encestar. Anota suficientes canastas para ganar.",
  },
  "penalty-kick": {
    name: "Penalti",
    subtitle: "Elige el Lado vs Portero",
    rules: "Elige izquierda, centro o derecha para disparar contra un portero que salta al azar. Anota suficientes goles en 5 rondas para ganar.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Cambia de Carril para Evitar el Tráfico",
    rules: "Cambia de carril a izquierda y derecha para evitar el tráfico que se acerca. El reto falla si se te acaban las vidas antes de llegar a la meta.",
  },
  parking: {
    name: "Reto de Aparcar",
    subtitle: "Aparca Dentro del Límite de Movimientos",
    rules: "Usa el control de dirección y avance para aparcar exactamente en el lugar marcado antes de que se te acaben los movimientos o choques para ganar.",
  },
  motocross: {
    name: "Salto de Motocross",
    subtitle: "Salta los Hoyos hasta la Meta",
    rules: "Toca para hacer saltar tu moto y pasar los hoyos por delante con el tiempo preciso. El reto falla si se te acaban las vidas antes de llegar a la meta.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Controla las Curvas para Puntuar",
    rules: "Controla según las curvas de la pista para mantenerte en el camino mientras acumulas puntos de derrape. Llega a la meta con suficientes puntos para ganar.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Por Turnos, el Primer KO Gana",
    rules:
      "Elige Attack para llenar el medidor especial, Guard para reducir a la mitad el siguiente ataque, o suelta el Finisher cuando el medidor esté lleno. Sé el primero en reducir a cero la vida del rival para ganar.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Forma pareja contra dos rivales controlados por computadora",
    rules:
      "Tú y tu compañero del Norte juegan contra Oeste y Este, ambos controlados por computadora. En cada baza, los cuatro jugadores juegan por turnos y deben seguir el palo si es posible; si no, pueden jugar cualquier palo o triunfo. La carta más alta del palo líder, o el triunfo más alto, gana la baza. Después de las 13 bazas, ganar 7 o más como pareja gana la mano.",
  },
  "pick-red-points": {
    name: "Recoge Puntos Rojos",
    subtitle: "Empareja la carta jugada con una en la mesa",
    rules:
      "Por turnos juega una carta: si su rango coincide con una carta en la mesa, recoge todas las cartas de ese rango más tu carta jugada para ganar puntos. Si no coincide, se queda en la mesa. Al agotarse el mazo, compara los corazones/diamantes rojos recogidos por cada lado — las cartas rojas normales valen 1 punto, los 10, J, Q y K rojos valen 10 puntos cada uno. El total mayor gana.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Lucha contra el Terrateniente)",
    subtitle: "Terrateniente contra dos granjeros",
    rules:
      "Después del reparto, el sistema asigna un Terrateniente (tú o la computadora) según la fuerza de la mano — el Terrateniente recibe 3 cartas ocultas extra, y los otros dos se convierten en Granjeros que se aliarán contra él. Jueguen por turnos combinaciones más fuertes que la última, o pasen si no pueden. El Terrateniente gana si vacía su mano primero; cualquier Granjero que termine primero gana para los Granjeros.",
  },
  "liars-cards": {
    name: "Cartas del Mentiroso",
    subtitle: "Juega boca abajo, anuncia el rango, adivina el engaño",
    rules:
      "Tú y dos rivales controlados por computadora juegan por turnos: coloca 1 a 4 cartas boca abajo y anuncia un rango (los rangos deben seguir el ciclo A→2→3→...→K→A, y puedes decir la verdad o mentir). Los demás jugadores pueden Creer y pasar el turno, o Desafiar la mentira volteando las cartas para comprobar — un desafío correcto hace que quien jugó las cartas recoja toda la pila de la mesa, uno incorrecto hace que el retador la recoja. El primero en vaciar su mano sin ser descubierto mintiendo gana.",
  },
  "five-pk": {
    name: "Póker de 5 Cartas",
    subtitle: "Una ronda de cambio, luego compara manos con opción de doblar",
    rules:
      "Apuesta, luego se reparten 5 cartas (hay 2 jokers en el mazo). Conserva las cartas que quieras y cambia una vez el resto. Las manos pagan según su rango — escalera de color 500x, póker 200x, escalera de color simple 120x, hasta doble pareja 1x. Después de ganar puedes doblar o nada apostando a mayor/menor o rojo/negro, o cobrar en cualquier momento.",
  },
  "little-mary": {
    name: "Little Mary Clásico",
    subtitle: "Marco de luces giratorio — apuesta a cartas grandes o pequeñas",
    rules:
      "Apuesta en cada símbolo, luego comienza. El marco de luces gira rápido durante 3 vueltas, luego se ralentiza para detenerse en media a una vuelta y media — toca Stop para detenerlo antes. Caer en la flecha pierde; caer en el símbolo de giro gratis da una repetición gratuita; los símbolos fijos pagan un múltiplo fijo; los símbolos de carta grande o pequeña pagan según el multiplicador vigente si apostaste a ese símbolo. Tras suficientes giros, puede activarse una ronda de bonificación con un pago fijo mayor y un sonido característico.",
  },
  "little-mary-2": {
    name: "Little Mary Clásico II",
    subtitle: "Marco de luces giratorio con temática deportiva",
    rules:
      "Mismo mecanismo de giro que Little Mary Clásico, con temática deportiva (fútbol, rugby, baloncesto, bolos, tenis, ping pong, golf). Apuesta en cada símbolo y comienza — caer en la flecha pierde, el símbolo gratis da una repetición gratuita, los símbolos fijos pagan un múltiplo fijo, y los símbolos deportivos grandes o pequeños pagan según el multiplicador vigente si se apostó. Puede activarse una ronda de bonificación tras suficientes giros con un pago fijo alto.",
  },
  "little-mary-3": {
    name: "Little Mary Clásico III",
    subtitle: "Jackpot del dios de las flores — apuesta a grande o pequeño",
    rules:
      "Mismo mecanismo de giro que Little Mary Clásico. Las tres luces del dios de las flores normalmente parpadean de forma independiente; tras suficientes giros pueden sincronizarse en un estado de alerta parpadeante. Si el rodillo se detiene en el grupo de símbolos grande o pequeño durante esa alerta, los tres símbolos pagan juntos 3x el multiplicador vigente — una bonificación de jackpot poco común.",
  },
  "little-mary-4": {
    name: "Little Mary Clásico IV",
    subtitle: "Jackpot del dios de las flores con temática animal",
    rules:
      "Mismo mecanismo que la edición Jackpot del Dios de las Flores, con temática animal (tigre, dragón, mono, zorro, ratón, gallo, pollito). La alerta de jackpot del dios de las flores y el pago 3x funcionan igual.",
  },
  "little-mary-5": {
    name: "Little Mary Clásico III (Fénix)",
    subtitle: "Edición decorativa de fénix — apuesta a grande o pequeño",
    rules:
      "Mismo mecanismo de giro que Little Mary Clásico. Un gran fénix en el centro es puramente decorativo, parpadeando más rápido durante la alerta de bonificación. Caer en cualquier símbolo de giro gratis despliega una estela de luz decorativa por el marco — solo visual, no cambia el pago.",
  },
  "little-mary-6": {
    name: "Little Mary Clásico IV (Fénix)",
    subtitle: "Edición decorativa de fénix — temática de bebidas",
    rules:
      "Mismo mecanismo que la edición Decorativa de Fénix, con temática de bebidas (tetera, miel, té de yerba mate, hielo raspado, cerveza, vino, cóctel). Los efectos decorativos del fénix y la estela de luz funcionan igual.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Océano)",
    subtitle: "Marco mini 8×8 — apuesta a grande o pequeño",
    rules:
      "Un marco de luces 8×8 más pequeño (28 posiciones) con el mismo mecanismo de giro, con temática de animales marinos (tiburón, ballena, delfín, pez tropical, cangrejo, concha, burbujas). Caer en la flecha pierde, el símbolo gratis da una repetición gratuita, los símbolos fijos pagan un múltiplo fijo, y los símbolos grandes o pequeños pagan según el multiplicador vigente si se apostó. Puede activarse una ronda de bonificación de jackpot tras suficientes giros.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Postre)",
    subtitle: "Marco mini 8×8 — temática de postres",
    rules:
      "Mismo mecanismo de marco mini 8×8 que la edición Océano, con temática de postres (pastel, pastel de fresa, cupcake, dona, galleta, dulce, piruleta). Puede activarse una ronda de bonificación de jackpot tras suficientes giros con un sonido característico.",
  },
  "fruit-slot-1": {
    name: "Tragamonedas de Frutas I",
    subtitle: "Rodillos clásicos 3×3, 5 líneas de pago",
    rules:
      "Una máquina de frutas clásica de 3 rodillos y 3 filas con 5 líneas de pago (filas superior, media, inferior más ambas diagonales). Apuesta por línea, luego gira — cada rodillo se detiene de forma independiente de izquierda a derecha, y puedes tocar Stop para detenerlo antes. Tres símbolos iguales en cualquier línea de pago pagan según la tabla, desde el 7 de la suerte a 100x hasta la cereza a 4x; dos o más cerezas en cualquier parte de la pantalla pagan una pequeña consolación; tres 7 en la fila media es el jackpot con su propio espectáculo de luces y sonido.",
  },
  "fruit-slot-2": {
    name: "Tragamonedas de Frutas II",
    subtitle: "Temática de frutas tropicales, 5 líneas de pago",
    rules:
      "Mismo mecanismo de 3 rodillos y 5 líneas de pago que Tragamonedas de Frutas I, con temática tropical — un diamante reemplaza al 7 de la suerte como símbolo de jackpot, junto con fresa, piña, plátano, durazno y cereza. Tres símbolos iguales en cualquier línea de pago pagan según la tabla, desde el diamante a 100x hasta la cereza a 4x; tres diamantes en la fila media es el jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Clásico V (Bono Siete de la Suerte)",
    subtitle: "Ronda de bonificación multiplicadora de sietes de la suerte",
    rules:
      "Mismo mecanismo de giro que Little Mary Clásico, con apuestas colocadas en 8 símbolos a la vez. Tres rodillos de dígitos en el centro normalmente giran de forma puramente decorativa; al ganar hay una posibilidad de activar una ronda de bonificación donde los tres rodillos se detienen uno por uno. Caer en tres dígitos impares iguales multiplica tu ganancia por 10x, tres dígitos pares iguales por 5x — una bonificación aleatoria poco común que no siempre se activa.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Clásico IV (Bono Siete de la Suerte, Festivo)",
    subtitle: "Bono de sietes de la suerte con temática festiva",
    rules:
      "Mismo mecanismo que la edición Bono Siete de la Suerte, con temática festiva (sobre rojo, lingote de oro, farol, mandarina, pastel de luna, fuegos artificiales, cereza). La ronda de bonificación y los multiplicadores de coincidencia de dígitos 10x/5x funcionan igual, con colores y efectos de sonido festivos.",
  },
  "xiangqi-mahjong": {
    name: "Mahjong Xiangqi",
    subtitle: "Forma conjuntos con piezas de ajedrez, compite contra la computadora para ganar",
    rules:
      "Apuesta, luego tú y la computadora roban 5 piezas de ajedrez chino cada uno. En tu turno, roba una pieza — si completa un par más un conjunto (una secuencia o un trío), ganas por robo propio. Si no, descarta una de tus 6 piezas. Si el descarte de la computadora completa tu mano, puedes reclamarlo para ganar, o pasar y seguir robando. Pagos: 2x por par y secuencia mixtos, 3x por par y secuencia del mismo palo, 5x por cinco soldados o peones; reclamar un descarte paga según la tarifa indicada, el robo propio añade una bonificación. Si el mazo se agota sin ganador, se devuelven las apuestas.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Empuja Cilindro)",
    subtitle: "Pai gow con fichas de mahjong en tres posiciones a la vez",
    rules:
      "Usa fichas de círculos de mahjong del 1 al 9 (4 de cada una) más fichas en blanco (4, con valor de medio punto) para representar un mazo de 40 fichas. Apuesta en las posiciones de cabeza, cielo y cola, luego el crupier y cada posición voltean 2 fichas para comparar. Orden de rango: blanco doble (el más alto) vence a cualquier par, que vence a una combinación 2-8, que vence a un total de puntos normal (suma de dígitos, cuenta el último dígito, blanco = 0,5, 9,5 es el mejor total normal, 0 el más bajo). Cada posición se compara con el crupier por separado — una victoria paga 1x, los pares pagan 4x y el blanco doble paga 10x; los totales iguales favorecen al crupier según la regla de la casa.",
  },
  }
}

const pt: GameTable = {
  xiangqi: {
    name: "Xadrez Chinês",
    subtitle: "IA Solo／2 Jogadores",
    rules:
      "Movam as peças por turnos; o primeiro a encurralar o general adversário sem escapatória vence. Segue as regras tradicionais do Xiangqi: a carruagem move-se em linha reta, o cavalo em L, o elefante na diagonal dentro do seu território, o conselheiro na diagonal junto ao palácio, e o soldado pode mover-se lateralmente após cruzar o rio.",
  },
  "darkchess-classic": {
    name: "Xadrez Oculto (Clássico)",
    subtitle: "IA Solo／2 Jogadores",
    rules: "Todas as peças começam viradas para baixo. Ao revelá-las, capturam-se pela ordem hierárquica tradicional. Capturar todas as peças do adversário ou deixá-lo sem jogadas vence.",
  },
  "darkchess-variant": {
    name: "Xadrez Oculto (Variante)",
    subtitle: "IA Solo／2 Jogadores",
    rules: "Igual ao clássico, mas o ataque e a captura por salto do canhão seguem regras variantes, adicionando novas táticas.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Coloquem pedras pretas e brancas por turnos nas interseções de um tabuleiro 19×19; quem controlar mais território vence. Pedras totalmente rodeadas sem liberdades são capturadas.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Coloquem pedras por turnos; o primeiro a alinhar cinco em linha horizontal, vertical ou diagonal vence." },
  othello: {
    name: "Otelo",
    subtitle: "Padrão",
    rules: "Coloquem peças por turnos; peças do adversário encaixadas entre as suas viram para sua cor. No final, quem tiver mais peças vence.",
  },
  mahjong: {
    name: "Mahjong Chinês",
    subtitle: "IA Solo (3 Computadores)",
    rules: "Jogue numa mesa com três oponentes controlados por IA, compre e descarte peças por turnos, pode reivindicar descartes com Chow／Pong／Kong. O primeiro a completar uma mão válida vence.",
  },
  luzhanqi: {
    name: "Luzhanqi (Xadrez Militar)",
    subtitle: "IA Solo／2 Jogadores",
    rules: "A patente das peças de ambos os lados é secreta; o adversário só vê o verso. As batalhas são decididas pela patente; o primeiro a capturar a bandeira inimiga ou deixá-lo sem jogadas vence.",
  },
  checkers: {
    name: "Damas",
    subtitle: "Padrão",
    rules: "Movam peças na diagonal por turnos; podem saltar para capturar peças do adversário. Capturar todas as peças do adversário ou deixá-lo sem jogadas vence.",
  },
  tictactoe: {
    name: "Jogo do Galo",
    subtitle: "Formato Ampliado 3×3",
    rules: "Coloquem símbolos por turnos; o primeiro a alinhar três em linha horizontal, vertical ou diagonal vence.",
  },
  sevens: {
    name: "Jogo dos Sete",
    subtitle: "4 jogadores, sequência de cartas, menor pontuação de cartas bloqueadas vence",
    rules:
      "Começa com a carta base 5; jogue por turnos cartas de número adjacente. Se não puder jogar, bloqueie uma carta que subtrai pontos; no final, quem tiver menos pontos em cartas bloqueadas vence.",
  },
  "sichuan-mahjong": {
    name: "Mahjong de Sichuan (Batalha até o Fim)",
    subtitle: "Falta um naipe obrigatório, o vencedor continua jogando",
    rules:
      "Usa apenas três naipes; no início é preciso descartar um naipe por completo. Quem vencer primeiro se retira e os demais continuam até três vencerem ou as peças acabarem.",
  },
  "malaysia-mahjong": {
    name: "Mahjong Malaio de Três Jogadores",
    subtitle: "3 jogadores, peças voadoras como comodim",
    rules:
      "Partida de três jogadores em que o baralho só inclui círculos, peças de honra e peças voadoras (comodins), facilitando combinações grandes.",
  },
  "mahjong-pengpeng": {
    name: "Peng Peng (Só Trinca)",
    subtitle: "Mahjong simplificado, só trinca sem sequência",
    rules: "Baralho simplificado em que só se forma trincas (Pong) ou se compra, sem sequências (Chow); vence com 2 trincas e 1 par.",
  },
  "mahjong-sevens": {
    name: "Mahjong dos Sete",
    subtitle: "Como o Jogo dos Sete, mas com peças de mahjong",
    rules:
      "Começa com os cincos de cada naipe como base; jogue peças de número adjacente por turnos, bloquear uma peça subtrai pontos.",
  },
  "riichi-mahjong": {
    name: "Mahjong Riichi Japonês",
    subtitle: "Rodada do Leste, Riichi / Dora / Furiten",
    rules:
      "Com a mão fechada e pronta você pode declarar Riichi apostando; peças Dora somam pontos extras; em Furiten não se pode vencer com uma peça já descartada; é preciso ter um Yaku válido para vencer.",
  },
  "mahjong-solitaire": {
    name: "Paciência de Mahjong",
    subtitle: "Encontre pares iguais, conecte com no máx. 2 curvas",
    rules:
      "Encontre duas peças iguais conectáveis com no máximo duas curvas de linha para eliminá-las; limpe o tabuleiro antes do tempo acabar para vencer.",
  },
  "merge-2048": {
    name: "2048 Fusão",
    subtitle: "Deslize para fundir números, chegue ao 2048",
    rules: "Deslize para cima, baixo, esquerda ou direita; números iguais se fundem e dobram ao colidir. Alcance o 2048 para vencer.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Funda edifícios, de um gramado a um arranha-céu",
    rules: "Mesmo jogo que o 2048, mas os números são edifícios; funda progressivamente de um gramado até um arranha-céu.",
  },
  "merge-2048-undo": {
    name: "2048 com Desfazer",
    subtitle: "Funda números com opção de desfazer",
    rules: "Igual ao 2048, mas com função de desfazer: se deslizar na direção errada, pode voltar e tentar de novo.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Funda edifícios, cuidado com os ursos",
    rules:
      "Em um tabuleiro 6x6, funda três objetos iguais para evoluí-los; os ursos se movem e estorvam, mas podem ser encurralados e se tornam lápides fundíveis.",
  },
  suika: {
    name: "Suika Game (Fusão de Melancias)",
    subtitle: "Mova e solte frutas, as iguais se fundem e crescem",
    rules:
      "Mova para a esquerda ou direita para escolher onde soltar a fruta; frutas iguais que se tocarem se fundem em uma maior, com a melancia como meta final.",
  },
  "drop-2048": {
    name: "2048 de Queda",
    subtitle: "Blocos numéricos caem e se empilham, funda para dobrar",
    rules: "Blocos numéricos caem de cima; mova-os para os lados para escolher a posição, ao empilhar números iguais eles se fundem e dobram.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Pares de gelatinas caem, 4 ou mais da mesma cor eliminam",
    rules: "Pares de gelatinas coloridas caem e podem ser movidos e girados; conecte 4 ou mais da mesma cor para eliminá-las e encadear combos.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Cápsulas caem e se empilham, alinhe para eliminar vírus",
    rules: "Cápsulas de duas cores caem e se empilham; alinhe a mesma cor para eliminar vírus, limpe todos os vírus para passar de fase.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Alterne entre dois clássicos de queda e eliminação",
    rules: "Você pode alternar entre Columns (conecte gemas da mesma cor) e Tetris (complete uma linha para eliminá-la).",
  },
  "candy-crush": {
    name: "Candy Crush Saga",
    subtitle: "Troque doces em linha de 3, alcance a pontuação alvo",
    rules:
      "Troque doces adjacentes para formar linhas de 3; doces especiais são poderosos, alcance a pontuação alvo dentro do limite de movimentos.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "O pioneiro dos 3 em linha, troque gemas",
    rules: "Troque gemas adjacentes para formar linhas da mesma cor e elimine-as; acumule pontos continuamente para superar seu recorde.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Ganhe moedas com 3 em linha, restaure o jardim abandonado",
    rules: "Ganhe moedas combinando peças em linha de 3; use as moedas para completar as tarefas de restauração do jardim.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Ganhe moedas com 3 em linha, decore a mansão dos sonhos",
    rules: "Ganhe moedas combinando peças em linha de 3; use as moedas para completar as tarefas de decoração da mansão.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Ganhe moedas com 3 em linha, restaure o antigo castelo",
    rules: "Ganhe moedas combinando peças em linha de 3; use as moedas para completar as tarefas de restauração do castelo.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Combine gemas + batalha com cartas e evolução",
    rules: "Ao combinar gemas, aliados do elemento correspondente atacam os inimigos; derrote os inimigos para subir de nível e avançar.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Combine gemas + batalha com vantagens elementais",
    rules: "Combine gemas para atacar; aproveite as vantagens elementais para causar mais dano e derrotar inimigos.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Combine gemas + construção simplificada e PvP",
    rules:
      "Combine gemas para que seus heróis ataquem; derrote rivais para obter materiais de construção e expandir seu império passo a passo.",
  },
  "sheep-sheep": {
    name: "Ovelha após Ovelha",
    subtitle: "Toque peças empilhadas e colete até juntar 3 iguais",
    rules:
      "Toque nas peças não bloqueadas para enviá-las à bandeja de coleta; junte 3 iguais para eliminá-las, se a bandeja encher sem completar, você perde.",
  },
  match3d: {
    name: "Eliminação 3D",
    subtitle: "Pilha de objetos 3D, toque e colete em trio",
    rules: "Mesmo jogo que Ovelha após Ovelha, mas com uma pilha de objetos tridimensionais para buscar e coletar em trio.",
  },
  "balls-merge": {
    name: "Fusão de Bolas",
    subtitle: "Mova para os lados e solte, bolas iguais se fundem e crescem",
    rules: "Mesmo jogo que Suika Game, com tema de bolas; bolas iguais se fundem em uma maior.",
  },
  "cookies-merge": {
    name: "Fusão de Biscoitos",
    subtitle: "Mova para os lados e solte, biscoitos iguais se fundem e crescem",
    rules: "Mesmo jogo que Suika Game, com tema de biscoitos; biscoitos iguais se fundem em um maior.",
  },
  "planets-merge": {
    name: "Fusão de Planetas",
    subtitle: "Mova para os lados e solte, planetas iguais se fundem e crescem",
    rules: "Mesmo jogo que Suika Game, com tema de planetas; planetas iguais se fundem em um maior.",
  },
  "mahjong-ninepoint5": {
    name: "Nove e Meio de Mahjong",
    subtitle: "Peças de mahjong simulando cartas, aproxime-se de 9,5",
    rules: "Use peças de mahjong em vez de cartas; peça mais peças ou pare, vence quem ficar mais próximo de 9,5 sem passar.",
  },
  "mahjong-niuniu": {
    name: "Niu Niu de Mahjong",
    subtitle: "Peças de mahjong simulando cartas, forme 10 e compare",
    rules: "Use peças de mahjong em vez de cartas; de 5 peças, 3 devem somar um múltiplo de 10, as outras 2 são comparadas por pontos.",
  },
  "dragon-gate": {
    name: "Portão do Dragão",
    subtitle: "Peças de círculos de mahjong, adivinhe maior ou menor",
    rules:
      "Duas peças de círculos são reveladas como portão; após apostar, uma terceira é revelada — dentro do intervalo você ganha, fora perde, e no limite paga-se o dobro.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Contra o dealer, chegue perto de 21",
    rules:
      "Aproxime-se de 21 sem ultrapassar. O Ás vale 1 ou 11, as figuras valem 10. Escolha Pedir ou Parar — o dealer deve continuar a pedir até atingir 17 ou mais.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Aposte em Player, Banker ou Tie antes de distribuir as cartas. O total usa o último dígito da soma; o total maior vence. Cartas extras são sacadas automaticamente conforme as regras padrão do baccarat.",
  },
  "ten-half": {
    name: "Dez e Meio",
    subtitle: "Fique mais perto de 10,5 que o dealer",
    rules:
      "Aposte, depois ambos os lados recebem 2 cartas. Escolha Pedir ou Parar — quem ficar mais perto de 10,5 sem passar vence. O Ás vale 1 ponto, as figuras 0,5 ponto. Um 10,5 natural na distribuição paga 3x; vitória normal paga 2x; empate devolve a aposta.",
  },
  "thirteen-water": {
    name: "Treze Cartas",
    subtitle: "Divida 13 cartas em 3 mãos contra o dealer",
    rules:
      "Aposte e distribua. O sistema organiza automaticamente suas 13 cartas e as do dealer em uma mão frontal de 3 cartas, uma média de 5 e uma final de 5, comparadas separadamente. Vencer as 3 mãos paga 5x, vencer 2 paga 2x, vencer 1 paga 1,5x, empate não paga nem perde, e perder mais do que ganha custa a aposta.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Jogue cartas soltas ou pares para esvaziar a mão primeiro",
    rules:
      "Aposte e jogue contra o dealer. Jogue uma carta solta ou par do mesmo valor que supere a última jogada, ou passe. A ordem vai do 3 (mais baixo) ao 2 (mais alto), com o naipe decidindo empates. Esvazie suas 13 cartas primeiro para ganhar 2x sua aposta.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Compare 5 cartas diretamente contra o dealer",
    rules:
      "Aposte, depois você e o dealer recebem 5 cartas cada e comparam o ranking diretamente — straight flush, quadra, full house, flush, sequência, trinca, dois pares, par, carta alta. A mão mais forte vence 2x; empate devolve a aposta.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Forme múltiplos de 10 com 5 cartas para a melhor pontuação de touro",
    rules:
      "Aposte, depois você e o dealer recebem 5 cartas cada. Escolha 3 que somem um múltiplo de 10 ('touro'); o último dígito das 2 restantes é sua pontuação, quanto maior melhor. Um 10 exato é a mão 'Touro Touro' mais alta; nenhuma combinação válida é 'Sem Touro', a mais baixa. A pontuação maior vence 2x; empate devolve a aposta. As figuras valem 10, o Ás vale 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Compare 3 cartas diretamente contra o dealer",
    rules:
      "Aposte, depois você e o dealer recebem 3 cartas cada e comparam o ranking diretamente — trinca, straight flush, flush, sequência, par, carta alta. A mão mais forte vence 2x; empate devolve a aposta.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 rodadas de distribuição — desista ou dobre em cada etapa",
    rules:
      "Defina sua aposta inicial. As cartas são distribuídas em 4 etapas (3, depois 2, depois 1, depois as últimas 2 reveladas), e após cada etapa você pode desistir ou dobrar sua aposta. A melhor mão de 5 cartas entre suas 7 decide o resultado. Desistir perde sua aposta total atual; vencer paga conforme o ranking, de royal straight flush a 150x até dois pares a 1x.",
  },
  chess: {
    name: "Xadrez",
    subtitle: "IA Solo／2 Jogadores",
    rules:
      "Movam as peças por turnos; o primeiro a dar xeque-mate no rei adversário vence. Segue as regras padrão do xadrez para o movimento de peões, torres, cavalos, bispos, rainha e rei.",
  },
  connect4: {
    name: "Connect Four",
    subtitle: "IA Solo／2 Jogadores",
    rules: "Soltem peças por turnos em uma grade vertical. O primeiro a alinhar quatro em linha horizontal, vertical ou diagonal vence.",
  },
  "chinese-checkers": {
    name: "Damas Chinesas",
    subtitle: "Tabuleiro Estrela",
    rules:
      "Em um tabuleiro em forma de estrela de seis pontas, mova todas as suas peças para o canto oposto primeiro para vencer. As peças podem avançar um passo ou saltar em cadeia sobre outras peças para avançar.",
  },
  jigsaw: {
    name: "Quebra-Cabeça Deslizante",
    subtitle: "Peças Numeradas",
    rules: "Toque na peça ao lado do espaço vazio para deslizá-la. Organize as peças de 1 a 15 em sequência para completar o desafio.",
  },
  "number-merge": {
    name: "Fusão de Números",
    subtitle: "Estilo 2048",
    rules: "Deslize ou use os botões de direção. Peças com o mesmo número se fundem e dobram de valor ao colidir; alcance o 2048 para vencer.",
  },
  "memory-match": {
    name: "Jogo da Memória",
    subtitle: "Desafio de Combinação",
    rules: "Revele duas cartas ao mesmo tempo; os pares correspondentes permanecem abertos. Combine todos os pares com o menor número de tentativas para vencer.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Jogadores",
    rules: "Lance o dado para mover sua peça ao redor do tabuleiro até chegar em casa. Cair na peça do adversário a envia de volta ao início.",
  },
  solitaire: {
    name: "Paciência",
    subtitle: "Clássico Solo",
    rules: "Organize todas as cartas nas quatro pilhas base por naipe e em ordem crescente para limpar o tabuleiro e vencer.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Rami de Peças vs IA",
    rules: "Use suas peças numeradas para formar sequências ou grupos do mesmo número, depois coloque-as na mesa. Esgote todas as suas peças primeiro para vencer.",
  },
  "rps-battle": {
    name: "Pedra, Papel ou Tesoura",
    subtitle: "vs IA",
    rules: "Jogue pedra, papel ou tesoura contra o computador simultaneamente. Quem vencer mais rodadas vence a partida.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 contra 1 vs IA (Simplificado)",
    rules:
      "Você e a IA têm 2 cartas cada, mais 5 cartas comunitárias compartilhadas. Escolha Call para revelar sua mão, ou Fold para desistir — a mão de maior ranking vence o pote.",
  },
  war: {
    name: "Guerra",
    subtitle: "Carta Mais Alta vs IA",
    rules:
      "As cartas são distribuídas igualmente. Em cada rodada, ambos os lados revelam uma carta — a mais alta vence a rodada. Um empate desencadeia uma batalha extra; quem tiver mais cartas no final vence.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "vs Dealer",
    rules:
      "Você e o dealer recebem 3 cartas cada. Após ver sua mão, Call para revelar e comparar, ou Fold para desistir da rodada — a mão de maior ranking vence.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Quebra-Cabeça de Blocos Deslizantes",
    rules: "Deslize blocos de vários tamanhos em um espaço de tabuleiro limitado. Mova o bloco maior até a saída inferior para vencer.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Organize e Elimine Linhas",
    rules:
      "Deslize para esquerda ou direita para mover o bloco que cai, toque para girá-lo, deslize para baixo para cair rápido. Complete uma linha para eliminá-la e ganhar pontos; o jogo termina se a pilha chegar ao topo.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Combine Cores para Eliminar",
    rules: "Toque em uma direção para disparar a bolha atual. Três ou mais bolhas da mesma cor conectadas são eliminadas e dão pontos; o jogo termina se as bolhas chegarem ao topo.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Troque para Combinar",
    rules:
      "Toque em uma peça, depois toque em uma peça vizinha para trocá-las. Combinar 3 ou mais da mesma cor elimina e preenche a partir do topo, o que pode gerar combos em cadeia.",
  },
  hanoi: {
    name: "Torre de Hanói",
    subtitle: "Mova os Discos",
    rules:
      "Toque em uma torre para tomar o disco superior, depois toque em outra torre para movê-lo. Um disco grande não pode ficar sobre um pequeno — mova toda a pilha para a torre mais à direita para vencer.",
  },
  "water-sort": {
    name: "Quebra-Cabeça de Classificar Água",
    subtitle: "Despeje para Organizar as Cores",
    rules:
      "Toque em um tubo para tomar a cor superior, depois toque em outro tubo para despejá-la — apenas em um tubo vazio ou com a mesma cor no topo. Organize cada tubo em uma só cor para vencer.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Gire para Conectar",
    rules: "Toque em uma peça de tubo para girá-la 90°. Conecte a fonte de água no canto superior esquerdo até a saída no canto inferior direito para vencer.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Calcule o Momento da Queda",
    rules:
      "O bloco superior se move para esquerda e direita; toque para deixá-lo cair sobre a pilha abaixo. Quanto menos sobreposição, mais estreito o bloco — perder a pilha completamente termina o jogo.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Troque para Organizar",
    rules: "Toque em duas peças numeradas para trocar sua posição. Organize todos os números do menor ao maior com o menor número de trocas para vencer.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Grade 6×6",
    rules:
      "Cada linha, coluna e caixa 2×3 deve conter os números de 1 a 6 sem repetição. Preencha toda a grade sem conflitos para vencer.",
  },
  "shooting-range": {
    name: "Galeria de Tiro",
    subtitle: "Alvos de Reflexo Rápido",
    rules: "Os alvos se iluminam aleatoriamente em toda a grade — toque o mais rápido possível para ganhar pontos. Alcance a pontuação alvo antes que o tempo acabe para vencer.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Elimine Toda a Frota para Vencer",
    rules:
      "Mova-se para esquerda e direita para evitar os tiros inimigos e abater toda a frota alienígena. O desafio falha se a frota se aproximar demais ou as vidas se esgotarem.",
  },
  "tank-battle": {
    name: "Batalha de Tanques",
    subtitle: "O Primeiro a Conseguir 3 Acertos Vence",
    rules: "Mova seu tanque para esquerda e direita e dispare projéteis. Acertar a pista do adversário dá pontos — seja o primeiro a conseguir 3 acertos para vencer.",
  },
  "brick-breaker": {
    name: "Brick Breaker",
    subtitle: "Destrua Todos os Tijolos para Vencer",
    rules:
      "Arraste a raquete para esquerda e direita para quicar a bola e destruir todos os tijolos para vencer. A bola cair faz perder uma vida; o desafio falha se as vidas se esgotarem.",
  },
  "zombie-defense": {
    name: "Defesa contra Zumbis",
    subtitle: "Sobreviva a Cada Onda para Vencer",
    rules:
      "Os zumbis avançam pela pista a partir da direita; toque para destruí-los (alguns precisam de dois toques). Deixar um chegar à borda esquerda custa uma vida — sobreviva a cada onda para vencer.",
  },
  "air-combat": {
    name: "Combate Aéreo",
    subtitle: "Sobreviva e Alcance a Pontuação Alvo",
    rules:
      "Seu caça dispara automaticamente; mova-se para esquerda e direita para evitar aviões inimigos e eliminá-los. Sobreviva até o limite de tempo enquanto alcança a pontuação alvo para vencer; se as vidas se esgotarem o desafio falha.",
  },
  billiards: {
    name: "Bilhar",
    subtitle: "Arraste para Apontar, Encaçape Todas as Bolas",
    rules:
      "Arraste para trás a partir da bola branca para apontar, depois solte para tacar. Encaçape todas as bolas coloridas antes que as tentativas se esgotem para vencer.",
  },
  bowling: {
    name: "Boliche",
    subtitle: "Alcance a Meta de Pinos em 3 Quadros",
    rules: "Arraste o controle deslizante para ajustar o ângulo de lançamento, depois solte para lançar. Alcance o total alvo de pinos derrubados em 3 quadros para vencer.",
  },
  "basketball-shoot": {
    name: "Arremessos de Basquete",
    subtitle: "Calcule o Momento do Arremesso",
    rules: "O medidor de potência se move automaticamente para frente e para trás — toque para arremessar quando estiver perto do centro para acertar. Marque gols suficientes para vencer.",
  },
  "penalty-kick": {
    name: "Pênalti",
    subtitle: "Escolha o Lado vs Goleiro",
    rules: "Escolha esquerda, centro ou direita para chutar contra um goleiro que pula aleatoriamente. Marque gols suficientes em 5 rodadas para vencer.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Mude de Faixa para Evitar o Trânsito",
    rules: "Mude de faixa para esquerda e direita para evitar o trânsito que se aproxima. O desafio falha se as vidas se esgotarem antes de chegar à distância final.",
  },
  parking: {
    name: "Desafio de Estacionar",
    subtitle: "Estacione Dentro do Limite de Movimentos",
    rules: "Use o controle de direção e avanço para estacionar exatamente no local marcado antes que seus movimentos ou colisões se esgotem para vencer.",
  },
  motocross: {
    name: "Salto de Motocross",
    subtitle: "Salte os Buracos até a Chegada",
    rules: "Toque para fazer seu moto saltar e passar pelos buracos com o momento certo. O desafio falha se as vidas se esgotarem antes de chegar à linha de chegada.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Controle as Curvas para Pontuar",
    rules: "Controle conforme as curvas da pista para se manter no caminho enquanto acumula pontos de drift. Chegue à linha de chegada com pontos suficientes para vencer.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Por Turnos, o Primeiro KO Vence",
    rules:
      "Escolha Attack para encher o medidor especial, Guard para reduzir à metade o próximo ataque, ou solte o Finisher quando o medidor estiver cheio. Seja o primeiro a zerar a vida do adversário para vencer.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Forme parceria contra dois adversários controlados por computador",
    rules:
      "Você e seu parceiro do Norte jogam contra Oeste e Leste, ambos controlados por computador. Em cada vaza, os quatro jogadores jogam por turnos e devem seguir o naipe se possível; caso contrário, podem jogar qualquer naipe ou trunfo. A carta mais alta do naipe liderado, ou o trunfo mais alto, vence a vaza. Após as 13 vazas, vencer 7 ou mais como parceria vence a mão.",
  },
  "pick-red-points": {
    name: "Pegue Pontos Vermelhos",
    subtitle: "Combine a carta jogada com uma na mesa",
    rules:
      "Jogue uma carta por turno: se seu valor coincidir com uma carta na mesa, pegue todas as cartas desse valor mais a carta jogada para ganhar pontos. Se não coincidir, ela fica na mesa. Depois que o baralho se esgotar, compare os corações/ouros vermelhos coletados por cada lado — cartas vermelhas normais valem 1 ponto, 10, J, Q e K vermelhos valem 10 pontos cada. O total maior vence.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Luta contra o Latifundiário)",
    subtitle: "Latifundiário contra dois Camponeses",
    rules:
      "Após a distribuição, o sistema designa um Latifundiário (você ou o computador) com base na força da mão — o Latifundiário recebe 3 cartas ocultas extras, e os outros dois se tornam Camponeses que se unem contra ele. Jogue por turnos combinações mais fortes que a última, ou passe se não puder. O Latifundiário vence se esvaziar a mão primeiro; qualquer Camponês que termine primeiro vence para os Camponeses.",
  },
  "liars-cards": {
    name: "Cartas do Mentiroso",
    subtitle: "Jogue com a face oculta, anuncie o valor, adivinhe a mentira",
    rules:
      "Você e dois adversários controlados por computador jogam por turnos: jogue 1 a 4 cartas com a face oculta e anuncie um valor (os valores devem seguir o ciclo A→2→3→...→K→A, e você pode dizer a verdade ou mentir). Os outros jogadores podem Acreditar e passar a vez, ou Desafiar a mentira revelando as cartas para verificar — um desafio correto faz quem jogou as cartas recolher toda a pilha da mesa, um desafio incorreto faz o desafiante recolhê-la. O primeiro a esvaziar a mão sem ser pego mentindo vence.",
  },
  "five-pk": {
    name: "Poker de 5 Cartas",
    subtitle: "Uma troca, depois compare mãos com opção de dobrar",
    rules:
      "Aposte, depois são distribuídas 5 cartas (há 2 jokers no baralho). Mantenha as cartas que quiser e troque uma vez o resto. As mãos pagam conforme o ranking — straight flush 500x, quadra 200x, straight flush simples 120x, até dois pares 1x. Após vencer, você pode dobrar ou nada apostando em maior/menor ou vermelho/preto, ou sacar em qualquer momento.",
  },
  "little-mary": {
    name: "Little Mary Clássico",
    subtitle: "Moldura de luzes giratória — aposte em cartas grandes ou pequenas",
    rules:
      "Aposte em cada símbolo, depois comece. A moldura de luzes gira rápido por 3 voltas, depois desacelera para parar em meia a uma volta e meia — toque em Stop para parar antes. Parar na flecha perde; parar no símbolo de giro grátis dá uma repetição gratuita; os símbolos fixos pagam um múltiplo fixo; os símbolos de carta grande ou pequena pagam conforme o multiplicador vigente se você apostou nesse símbolo. Após voltas suficientes, uma rodada bônus pode ser acionada com um pagamento fixo maior e um som característico.",
  },
  "little-mary-2": {
    name: "Little Mary Clássico II",
    subtitle: "Moldura de luzes giratória com temática esportiva",
    rules:
      "Mesmo mecanismo de giro do Little Mary Clássico, com temática esportiva (futebol, rúgbi, basquete, boliche, tênis, tênis de mesa, golfe). Aposte em cada símbolo e comece — parar na flecha perde, o símbolo grátis dá uma repetição gratuita, os símbolos fixos pagam um múltiplo fixo, e os símbolos esportivos grandes ou pequenos pagam conforme o multiplicador vigente se apostados. Uma rodada bônus pode ser acionada após voltas suficientes com um pagamento fixo alto.",
  },
  "little-mary-3": {
    name: "Little Mary Clássico III",
    subtitle: "Jackpot do deus das flores — aposte em grande ou pequeno",
    rules:
      "Mesmo mecanismo de giro do Little Mary Clássico. As três luzes do deus das flores normalmente piscam de forma independente; após voltas suficientes podem sincronizar em um estado de alerta pulsante. Se o rolo parar no grupo de símbolos grande ou pequeno durante esse alerta, os três símbolos pagam juntos 3x o multiplicador vigente — um bônus de jackpot raro.",
  },
  "little-mary-4": {
    name: "Little Mary Clássico IV",
    subtitle: "Jackpot do deus das flores com temática animal",
    rules:
      "Mesmo mecanismo da edição Jackpot do Deus das Flores, com temática animal (tigre, dragão, macaco, raposa, rato, galo, pintinho). O alerta de jackpot do deus das flores e o pagamento 3x funcionam igual.",
  },
  "little-mary-5": {
    name: "Little Mary Clássico III (Fênix)",
    subtitle: "Edição decorativa de fênix — aposte em grande ou pequeno",
    rules:
      "Mesmo mecanismo de giro do Little Mary Clássico. Uma grande fênix no centro é puramente decorativa, piscando mais rápido durante o alerta de bônus. Parar em qualquer símbolo de giro grátis espalha um rastro de luz decorativo pela moldura — apenas visual, não altera o pagamento.",
  },
  "little-mary-6": {
    name: "Little Mary Clássico IV (Fênix)",
    subtitle: "Edição decorativa de fênix — temática de bebidas",
    rules:
      "Mesmo mecanismo da edição Decorativa de Fênix, com temática de bebidas (bule de chá, mel, chá-mate, raspadinha, cerveja, vinho, coquetel). Os efeitos decorativos da fênix e o rastro de luz funcionam igual.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Oceano)",
    subtitle: "Moldura mini 8×8 — aposte em grande ou pequeno",
    rules:
      "Uma moldura de luzes 8×8 menor (28 posições) com o mesmo mecanismo de giro, com temática de animais marinhos (tubarão, baleia, delfim, peixe tropical, caranguejo, concha, bolhas). Parar na flecha perde, o símbolo grátis dá uma repetição gratuita, os símbolos fixos pagam um múltiplo fixo, e os símbolos grandes ou pequenos pagam conforme o multiplicador vigente se apostados. Uma rodada bônus de jackpot pode ser acionada após voltas suficientes.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Sobremesa)",
    subtitle: "Moldura mini 8×8 — temática de sobremesas",
    rules:
      "Mesmo mecanismo de moldura mini 8×8 da edição Oceano, com temática de sobremesas (bolo, bolo de morango, cupcake, donut, biscoito, doce, pirulito). Uma rodada bônus de jackpot pode ser acionada após voltas suficientes com um som característico.",
  },
  "fruit-slot-1": {
    name: "Caça-Níqueis de Frutas I",
    subtitle: "Rolos clássicos 3×3, 5 linhas de pagamento",
    rules:
      "Uma máquina de frutas clássica de 3 rolos e 3 linhas com 5 linhas de pagamento (linhas superior, meio, inferior mais ambas as diagonais). Aposte por linha, depois gire — cada rolo para de forma independente da esquerda para a direita, e você pode tocar em Stop para parar antes. Três símbolos iguais em qualquer linha de pagamento pagam conforme a tabela, do 7 da sorte a 100x até a cereja a 4x; duas ou mais cerejas em qualquer lugar da tela pagam uma pequena consolação; três 7 na linha do meio é o jackpot com seu próprio show de luzes e som.",
  },
  "fruit-slot-2": {
    name: "Caça-Níqueis de Frutas II",
    subtitle: "Temática de frutas tropicais, 5 linhas de pagamento",
    rules:
      "Mesmo mecanismo de 3 rolos e 5 linhas de pagamento do Caça-Níqueis de Frutas I, com temática tropical — um diamante substitui o 7 da sorte como símbolo de jackpot, junto com morango, abacaxi, banana, pêssego e cereja. Três símbolos iguais em qualquer linha de pagamento pagam conforme a tabela, do diamante a 100x até a cereja a 4x; três diamantes na linha do meio é o jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Clássico V (Bônus Sete da Sorte)",
    subtitle: "Rodada bônus multiplicadora de setes da sorte",
    rules:
      "Mesmo mecanismo de giro do Little Mary Clássico, com apostas colocadas em 8 símbolos ao mesmo tempo. Três rolos de dígitos no centro normalmente giram de forma puramente decorativa; ao vencer há uma chance de acionar uma rodada bônus onde os três rolos param um por um. Parar em três dígitos ímpares iguais multiplica seu ganho por 10x, três dígitos pares iguais por 5x — um bônus aleatório raro que não aciona sempre.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Clássico IV (Bônus Sete da Sorte, Festivo)",
    subtitle: "Bônus de setes da sorte com temática festiva",
    rules:
      "Mesmo mecanismo da edição Bônus Sete da Sorte, com temática festiva (envelope vermelho, barra de ouro, lanterna, tangerina, bolo da lua, fogos de artifício, cereja). A rodada bônus e os multiplicadores de correspondência de dígitos 10x/5x funcionam igual, com cores e efeitos sonoros festivos.",
  },
  "xiangqi-mahjong": {
    name: "Mahjong Xiangqi",
    subtitle: "Forme conjuntos com peças de xadrez, corra contra o computador para vencer",
    rules:
      "Aposte, depois você e o computador compram 5 peças de xadrez chinês cada. Na sua vez, compre uma peça — se completar um par mais um conjunto (uma sequência ou uma trinca), você vence por compra própria. Se não, descarte uma das suas 6 peças. Se o descarte do computador completar sua mão, você pode reivindicá-lo para vencer, ou passar e continuar comprando. Pagamentos: 2x para par e sequência mistos, 3x para par e sequência do mesmo naipe, 5x para cinco soldados ou peões; reivindicar um descarte paga conforme a taxa listada, a compra própria adiciona um bônus. Se o baralho se esgotar sem vencedor, as apostas são devolvidas.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Empurra Cilindro)",
    subtitle: "Pai gow com peças de mahjong em três posições ao mesmo tempo",
    rules:
      "Usa peças de círculos de mahjong de 1 a 9 (4 de cada) mais peças em branco (4, com valor de meio ponto) para representar um baralho de 40 peças. Aposte nas posições de cabeça, céu e cauda, depois o dealer e cada posição revelam 2 peças para comparar. Ordem de ranking: branco duplo (o mais alto) vence qualquer par, que vence uma combinação 2-8, que vence um total de pontos normal (soma dos dígitos, conta o último dígito, branco = 0,5, 9,5 é o melhor total normal, 0 o mais baixo). Cada posição é comparada com o dealer separadamente — uma vitória paga 1x, os pares pagam 4x e o branco duplo paga 10x; totais iguais favorecem o dealer conforme a regra da casa.",
  },
}

const fr: GameTable = {
  xiangqi: {
    name: "Échecs Chinois",
    subtitle: "IA Solo／2 Joueurs",
    rules:
      "Déplacez les pièces à tour de rôle ; le premier à acculer le général adverse sans échappatoire gagne. Suit les règles traditionnelles du Xiangqi : le chariot avance tout droit, le cheval en L, l'éléphant en diagonale dans son propre camp, le conseiller en diagonale près du palais, et le soldat peut se déplacer latéralement après avoir traversé la rivière.",
  },
  "darkchess-classic": {
    name: "Échecs Cachés (Classique)",
    subtitle: "IA Solo／2 Joueurs",
    rules: "Toutes les pièces commencent face cachée. En les révélant, on capture selon l'ordre hiérarchique traditionnel. Capturer toutes les pièces adverses ou les priver de mouvement fait gagner.",
  },
  "darkchess-variant": {
    name: "Échecs Cachés (Variante)",
    subtitle: "IA Solo／2 Joueurs",
    rules: "Identique à la version classique, mais l'attaque et la capture par saut du canon suivent des règles variantes, ajoutant de nouvelles tactiques.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Placez des pierres noires et blanches à tour de rôle aux intersections d'un plateau 19×19 ; celui qui contrôle le plus de territoire gagne. Les pierres totalement encerclées sans liberté sont capturées.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Placez des pierres à tour de rôle ; le premier à aligner cinq pierres horizontalement, verticalement ou en diagonale gagne." },
  othello: {
    name: "Othello",
    subtitle: "Standard",
    rules: "Placez des pions à tour de rôle ; les pions adverses encadrés se retournent à votre couleur. À la fin, celui qui a le plus de pions gagne.",
  },
  mahjong: {
    name: "Mahjong Chinois",
    subtitle: "IA Solo (3 Ordinateurs)",
    rules: "Jouez à une table avec trois adversaires contrôlés par l'IA, piochez et défaussez des tuiles à tour de rôle, réclamez les défausses avec Chow／Pong／Kong. Le premier à compléter une main gagnante valide gagne.",
  },
  luzhanqi: {
    name: "Luzhanqi (Échecs Militaires)",
    subtitle: "IA Solo／2 Joueurs",
    rules: "Le rang des pièces de chaque camp est secret ; l'adversaire ne voit que le dos. Les batailles se règlent par rang ; le premier à capturer le drapeau ennemi ou à le priver de mouvement gagne.",
  },
  checkers: {
    name: "Dames",
    subtitle: "Standard",
    rules: "Déplacez les pièces en diagonale à tour de rôle ; sautez pour capturer les pièces adverses. Capturer toutes les pièces adverses ou les priver de mouvement fait gagner.",
  },
  tictactoe: {
    name: "Morpion",
    subtitle: "Format Agrandi 3×3",
    rules: "Placez des symboles à tour de rôle ; le premier à aligner trois symboles horizontalement, verticalement ou en diagonale gagne.",
  },
  sevens: {
    name: "Jeu des Sept",
    subtitle: "4 joueurs, suite de cartes, le plus bas score de cartes bloquées gagne",
    rules:
      "Commence avec la carte de base 5 ; jouez à tour de rôle des cartes de numéro adjacent. Si vous ne pouvez pas jouer, bloquez une carte qui retire des points ; à la fin, celui qui a le moins de points en cartes bloquées gagne.",
  },
  "sichuan-mahjong": {
    name: "Mahjong du Sichuan (Combat à Mort)",
    subtitle: "Une couleur manquante obligatoire, le gagnant continue à jouer",
    rules:
      "Utilise seulement trois couleurs ; au début, il faut écarter complètement une couleur. Le premier à gagner se retire et les autres continuent jusqu'à ce que trois joueurs gagnent ou que les tuiles soient épuisées.",
  },
  "malaysia-mahjong": {
    name: "Mahjong Malaisien à Trois Joueurs",
    subtitle: "3 joueurs, tuiles volantes jokers",
    rules:
      "Partie à trois joueurs où le jeu ne contient que des cercles, des tuiles d'honneur et des tuiles volantes (jokers), facilitant les grandes combinaisons.",
  },
  "mahjong-pengpeng": {
    name: "Peng Peng (Brelan Seulement)",
    subtitle: "Mahjong simplifié, brelan uniquement sans suite",
    rules: "Jeu simplifié où l'on ne peut former que des brelans (Pong) ou piocher, sans suites (Chow) ; gagne avec 2 brelans et 1 paire.",
  },
  "mahjong-sevens": {
    name: "Mahjong des Sept",
    subtitle: "Comme le Jeu des Sept, mais avec des tuiles de mahjong",
    rules:
      "Commence avec les cinq de chaque couleur comme base ; jouez des tuiles de numéro adjacent à tour de rôle, bloquer une tuile retire des points.",
  },
  "riichi-mahjong": {
    name: "Mahjong Riichi Japonais",
    subtitle: "Manche Est, Riichi / Dora / Furiten",
    rules:
      "Avec une main fermée et prête, vous pouvez déclarer Riichi en misant ; les tuiles Dora ajoutent des points bonus ; en Furiten, vous ne pouvez pas gagner avec une tuile déjà écartée ; il faut un Yaku valide pour gagner.",
  },
  "mahjong-solitaire": {
    name: "Solitaire Mahjong",
    subtitle: "Trouvez des paires identiques, reliez avec max. 2 virages",
    rules:
      "Trouvez deux tuiles identiques reliables avec au plus deux virages de ligne pour les éliminer ; videz le plateau avant la fin du temps pour gagner.",
  },
  "merge-2048": {
    name: "Fusion 2048",
    subtitle: "Glissez pour fusionner les nombres, atteignez 2048",
    rules: "Glissez vers le haut, le bas, la gauche ou la droite ; les nombres identiques fusionnent et doublent en se heurtant. Atteignez 2048 pour gagner.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Fusionnez des bâtiments, d'une pelouse à un gratte-ciel",
    rules: "Même jeu que 2048, mais les nombres sont des bâtiments ; fusionnez progressivement d'une pelouse à un gratte-ciel.",
  },
  "merge-2048-undo": {
    name: "2048 avec Annulation",
    subtitle: "Fusionnez les nombres avec option d'annuler",
    rules: "Comme 2048, mais avec une fonction d'annulation : si vous glissez dans la mauvaise direction, vous pouvez revenir en arrière et réessayer.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Fusionnez des bâtiments, attention aux ours",
    rules:
      "Sur un plateau 6x6, fusionnez trois objets identiques pour les améliorer ; les ours se déplacent et gênent, mais peuvent être encerclés pour devenir des pierres tombales fusionnables.",
  },
  suika: {
    name: "Suika Game (Fusion de Pastèques)",
    subtitle: "Déplacez et laissez tomber des fruits, les identiques fusionnent et grossissent",
    rules:
      "Déplacez à gauche ou à droite pour choisir où lâcher le fruit ; les fruits identiques qui se touchent fusionnent en un plus gros, avec la pastèque comme objectif final.",
  },
  "drop-2048": {
    name: "2048 à Chute",
    subtitle: "Des blocs numériques tombent et s'empilent, fusionnez pour doubler",
    rules: "Des blocs numériques tombent du haut ; déplacez-les sur les côtés pour choisir la position, en empilant des nombres identiques ils fusionnent et doublent.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Des paires de gelées tombent, 4 ou plus de même couleur s'éliminent",
    rules: "Des paires de gelées colorées tombent et peuvent être déplacées et tournées ; reliez 4 ou plus de même couleur pour les éliminer et enchaîner des combos.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Des capsules tombent et s'empilent, alignez pour éliminer les virus",
    rules: "Des capsules à deux couleurs tombent et s'empilent ; alignez la même couleur pour éliminer les virus, éliminez tous les virus pour passer le niveau.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Basculez entre deux classiques de chute et élimination",
    rules: "Vous pouvez basculer entre Columns (reliez des gemmes de même couleur) et Tetris (complétez une ligne pour l'éliminer).",
  },
  "candy-crush": {
    name: "Candy Crush Saga",
    subtitle: "Échangez des bonbons en ligne de 3, atteignez le score cible",
    rules:
      "Échangez des bonbons adjacents pour former des lignes de 3 ; les bonbons spéciaux sont puissants, atteignez le score cible dans la limite de coups.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Le pionnier du match-3, échangez des gemmes",
    rules: "Échangez des gemmes adjacentes pour former des lignes de même couleur et les éliminer ; accumulez des points en continu pour battre votre record.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Gagnez des pièces avec le match-3, restaurez le jardin abandonné",
    rules: "Gagnez des pièces en combinant des tuiles en ligne de 3 ; utilisez les pièces pour accomplir les tâches de restauration du jardin.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Gagnez des pièces avec le match-3, décorez le manoir de vos rêves",
    rules: "Gagnez des pièces en combinant des tuiles en ligne de 3 ; utilisez les pièces pour accomplir les tâches de décoration du manoir.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Gagnez des pièces avec le match-3, restaurez l'ancien château",
    rules: "Gagnez des pièces en combinant des tuiles en ligne de 3 ; utilisez les pièces pour accomplir les tâches de restauration du château.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Match-3 de gemmes + bataille de cartes avec progression",
    rules: "En combinant des gemmes, les alliés de l'élément correspondant attaquent les ennemis ; vaincre les ennemis fait monter de niveau et avancer.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Match-3 de gemmes + bataille avec avantages élémentaires",
    rules: "Combinez des gemmes pour attaquer ; profitez des avantages élémentaires pour infliger plus de dégâts et vaincre les ennemis.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Match-3 de gemmes + construction simplifiée et JcJ",
    rules:
      "Combinez des gemmes pour que vos héros attaquent ; vaincre des rivaux donne des matériaux de construction pour agrandir votre empire étape par étape.",
  },
  "sheep-sheep": {
    name: "Mouton après Mouton",
    subtitle: "Touchez les tuiles empilées et collectez jusqu'à 3 identiques",
    rules:
      "Touchez les tuiles non bloquées pour les envoyer au plateau de collecte ; rassemblez 3 identiques pour les éliminer, si le plateau se remplit sans compléter, vous perdez.",
  },
  match3d: {
    name: "Élimination 3D",
    subtitle: "Pile d'objets 3D, touchez et collectez par trio",
    rules: "Même jeu que Mouton après Mouton, mais avec une pile d'objets tridimensionnels à chercher et collecter par trio.",
  },
  "balls-merge": {
    name: "Fusion de Balles",
    subtitle: "Déplacez sur les côtés et lâchez, les balles identiques fusionnent et grossissent",
    rules: "Même jeu que Suika Game, thème balles ; les balles identiques fusionnent en une plus grosse.",
  },
  "cookies-merge": {
    name: "Fusion de Biscuits",
    subtitle: "Déplacez sur les côtés et lâchez, les biscuits identiques fusionnent et grossissent",
    rules: "Même jeu que Suika Game, thème biscuits ; les biscuits identiques fusionnent en un plus gros.",
  },
  "planets-merge": {
    name: "Fusion de Planètes",
    subtitle: "Déplacez sur les côtés et lâchez, les planètes identiques fusionnent et grossissent",
    rules: "Même jeu que Suika Game, thème planètes ; les planètes identiques fusionnent en une plus grosse.",
  },
  "mahjong-ninepoint5": {
    name: "Neuf et Demi de Mahjong",
    subtitle: "Tuiles de mahjong simulant des cartes, approchez de 9,5",
    rules: "Utilisez des tuiles de mahjong au lieu de cartes ; demandez plus de tuiles ou arrêtez-vous, gagne celui qui s'approche le plus de 9,5 sans dépasser.",
  },
  "mahjong-niuniu": {
    name: "Niu Niu de Mahjong",
    subtitle: "Tuiles de mahjong simulant des cartes, formez 10 et comparez",
    rules: "Utilisez des tuiles de mahjong au lieu de cartes ; sur 5 tuiles, 3 doivent former un multiple de 10, les 2 autres sont comparées par points.",
  },
  "dragon-gate": {
    name: "Porte du Dragon",
    subtitle: "Tuiles de cercles de mahjong, devinez plus ou moins",
    rules:
      "Deux tuiles de cercles sont révélées comme porte ; après avoir misé, une troisième est révélée — à l'intérieur vous gagnez, à l'extérieur vous perdez, et sur la limite la mise est doublée.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Contre le croupier, approchez-vous de 21",
    rules:
      "Approchez-vous de 21 sans le dépasser. L'As vaut 1 ou 11, les figures valent 10. Choisissez Tirer ou Rester — le croupier doit continuer à tirer jusqu'à atteindre 17 ou plus.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Misez sur Player, Banker ou Tie avant la distribution des cartes. Le total utilise le dernier chiffre de la somme ; le total le plus élevé gagne. Des cartes supplémentaires sont tirées automatiquement selon les règles standard du baccarat.",
  },
  "ten-half": {
    name: "Dix et Demi",
    subtitle: "Approchez-vous plus de 10,5 que le croupier",
    rules:
      "Misez, puis chaque côté reçoit 2 cartes. Choisissez Tirer ou Rester — celui qui s'approche le plus de 10,5 sans dépasser gagne. L'As vaut 1 point, les figures 0,5 point. Un 10,5 naturel à la distribution paie 3x ; une victoire normale paie 2x ; une égalité rembourse la mise.",
  },
  "thirteen-water": {
    name: "Treize Cartes",
    subtitle: "Divisez 13 cartes en 3 mains contre le croupier",
    rules:
      "Misez et distribuez. Le système organise automatiquement vos 13 cartes et celles du croupier en une main avant de 3 cartes, une main milieu de 5 et une main arrière de 5, comparées séparément. Gagner les 3 mains paie 5x, gagner 2 paie 2x, gagner 1 paie 1,5x, une égalité ne paie ni ne perd, et perdre plus que l'on gagne coûte la mise.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Jouez des cartes seules ou des paires pour vider votre main en premier",
    rules:
      "Misez et jouez contre le croupier. Jouez une carte seule ou une paire de même rang plus forte que le dernier coup, ou passez. L'ordre va du 3 (le plus faible) au 2 (le plus fort), la couleur départageant les égalités. Videz vos 13 cartes en premier pour gagner 2x votre mise.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Comparez 5 cartes directement contre le croupier",
    rules:
      "Misez, puis vous et le croupier recevez chacun 5 cartes et comparez directement le rang de la main — quinte flush, carré, full, couleur, quinte, brelan, double paire, paire, carte haute. La main la plus forte gagne 2x ; une égalité rembourse la mise.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Formez des multiples de 10 avec 5 cartes pour le meilleur score de taureau",
    rules:
      "Misez, puis vous et le croupier recevez chacun 5 cartes. Choisissez 3 cartes dont la somme est un multiple de 10 (un « taureau ») ; le dernier chiffre des 2 cartes restantes est votre score, plus c'est élevé, mieux c'est. Un 10 exact est la meilleure main « Taureau Taureau » ; aucune combinaison valide donne « Sans Taureau », la plus basse. Le score le plus élevé gagne 2x ; une égalité rembourse la mise. Les figures valent 10, l'As vaut 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Comparez 3 cartes directement contre le croupier",
    rules:
      "Misez, puis vous et le croupier recevez chacun 3 cartes et comparez directement le rang — brelan, quinte flush, couleur, quinte, paire, carte haute. La main la plus forte gagne 2x ; une égalité rembourse la mise.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 tours de distribution — couchez-vous ou doublez à chaque étape",
    rules:
      "Fixez votre mise de départ. Les cartes sont distribuées en 4 étapes (3, puis 2, puis 1, puis les 2 dernières révélées), et après chaque étape vous pouvez vous coucher ou doubler votre mise. La meilleure main de 5 cartes parmi vos 7 décide du résultat. Se coucher fait perdre votre mise totale actuelle ; gagner paie selon le rang, de la quinte flush royale à 150x jusqu'à la double paire à 1x.",
  },
  chess: {
    name: "Échecs",
    subtitle: "IA Solo／2 Joueurs",
    rules:
      "Déplacez les pièces à tour de rôle ; le premier à mettre le roi adverse échec et mat gagne. Suit les règles standard des échecs pour le déplacement des pions, tours, cavaliers, fous, dame et roi.",
  },
  connect4: {
    name: "Puissance 4",
    subtitle: "IA Solo／2 Joueurs",
    rules: "Laissez tomber des jetons à tour de rôle dans une grille verticale. Le premier à aligner quatre jetons horizontalement, verticalement ou en diagonale gagne.",
  },
  "chinese-checkers": {
    name: "Dames Chinoises",
    subtitle: "Plateau Étoile",
    rules:
      "Sur un plateau en forme d'étoile à six branches, déplacez toutes vos pièces dans le coin opposé en premier pour gagner. Les pièces peuvent avancer d'un pas ou sauter en chaîne par-dessus d'autres pièces pour progresser.",
  },
  jigsaw: {
    name: "Puzzle Coulissant",
    subtitle: "Tuiles Numérotées",
    rules: "Touchez la tuile à côté de l'espace vide pour la faire glisser. Classez les tuiles de 1 à 15 dans l'ordre pour terminer le défi.",
  },
  "number-merge": {
    name: "Fusion de Nombres",
    subtitle: "Style 2048",
    rules: "Glissez ou utilisez les boutons de direction. Les tuiles portant le même nombre fusionnent et doublent de valeur en se heurtant ; atteignez 2048 pour gagner.",
  },
  "memory-match": {
    name: "Jeu de Mémoire",
    subtitle: "Défi d'Appariement",
    rules: "Retournez deux cartes à la fois ; les paires correspondantes restent ouvertes. Trouvez toutes les paires avec le moins d'essais possible pour gagner.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Joueurs",
    rules: "Lancez le dé pour déplacer votre pion autour du plateau jusqu'à rentrer à la maison. Atterrir sur le pion adverse le renvoie au départ.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Classique Solo",
    rules: "Classez toutes les cartes sur les quatre piles de base par couleur et dans l'ordre croissant pour vider le plateau et gagner.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Rami de Tuiles contre l'IA",
    rules: "Utilisez vos tuiles numérotées pour former des suites ou des groupes du même nombre, puis placez-les sur la table. Épuisez toutes vos tuiles en premier pour gagner.",
  },
  "rps-battle": {
    name: "Pierre Papier Ciseaux",
    subtitle: "contre l'IA",
    rules: "Lancez pierre, papier ou ciseaux contre l'ordinateur simultanément. Celui qui gagne le plus de manches gagne la partie.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 contre 1 vs IA (Simplifié)",
    rules:
      "Vous et l'IA avez chacun 2 cartes, plus 5 cartes communes partagées. Choisissez Call pour révéler votre main, ou Fold pour vous coucher — la main la mieux classée gagne le pot.",
  },
  war: {
    name: "Bataille",
    subtitle: "Carte la Plus Haute vs IA",
    rules:
      "Les cartes sont distribuées équitablement. À chaque manche, les deux côtés révèlent une carte — la plus haute gagne la manche. Une égalité déclenche une bataille supplémentaire ; celui qui a le plus de cartes à la fin gagne.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "contre le Croupier",
    rules:
      "Vous et le croupier recevez chacun 3 cartes. Après avoir vu votre main, Call pour révéler et comparer, ou Fold pour vous coucher — la main la mieux classée gagne.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Puzzle de Blocs Coulissants",
    rules: "Faites glisser des blocs de tailles variées dans un espace de plateau limité. Déplacez le plus grand bloc vers la sortie en bas pour gagner.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Rangez et Éliminez les Lignes",
    rules:
      "Glissez à gauche ou à droite pour déplacer le bloc qui tombe, touchez pour le faire pivoter, glissez vers le bas pour le faire tomber vite. Remplissez une ligne pour l'éliminer et gagner des points ; la partie se termine si la pile atteint le sommet.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Associez les Couleurs pour Éliminer",
    rules: "Touchez une direction pour tirer la bulle actuelle. Trois bulles de même couleur connectées ou plus sont éliminées et donnent des points ; la partie se termine si les bulles atteignent le sommet.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Échangez pour Associer",
    rules:
      "Touchez une tuile, puis touchez une tuile voisine pour les échanger. Associer 3 ou plus de même couleur les élimine et remplit depuis le haut, ce qui peut déclencher des combos en chaîne.",
  },
  hanoi: {
    name: "Tour de Hanoï",
    subtitle: "Déplacez les Disques",
    rules:
      "Touchez une tour pour prendre le disque du haut, puis touchez une autre tour pour le déplacer. Un grand disque ne peut pas être au-dessus d'un petit — déplacez toute la pile vers la tour la plus à droite pour gagner.",
  },
  "water-sort": {
    name: "Puzzle de Tri d'Eau",
    subtitle: "Versez pour Trier les Couleurs",
    rules:
      "Touchez un tube pour prendre la couleur du haut, puis touchez un autre tube pour la verser — uniquement dans un tube vide ou avec la même couleur au-dessus. Triez chaque tube en une seule couleur pour gagner.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Tournez pour Connecter",
    rules: "Touchez une tuile de tuyau pour la faire pivoter de 90°. Connectez la source d'eau en haut à gauche jusqu'à la sortie en bas à droite pour gagner.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Calculez le Moment de la Chute",
    rules:
      "Le bloc du haut se déplace à gauche et à droite ; touchez pour le laisser tomber sur la pile en dessous. Moins il y a de chevauchement, plus le bloc est étroit — rater complètement la pile termine la partie.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Échangez pour Trier",
    rules: "Touchez deux tuiles numérotées pour échanger leur position. Triez tous les nombres du plus petit au plus grand avec le moins d'échanges possible pour gagner.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Grille 6×6",
    rules:
      "Chaque ligne, colonne et boîte 2×3 doit contenir les nombres de 1 à 6 sans répétition. Remplissez toute la grille sans conflit pour gagner.",
  },
  "shooting-range": {
    name: "Stand de Tir",
    subtitle: "Cibles à Réflexes Rapides",
    rules: "Les cibles s'allument au hasard sur toute la grille — touchez le plus vite possible pour gagner des points. Atteignez le score cible avant la fin du temps pour gagner.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Éliminez Toute la Flotte pour Gagner",
    rules:
      "Déplacez-vous à gauche et à droite pour éviter les tirs ennemis et abattre toute la flotte d'aliens. Le défi échoue si la flotte s'approche trop ou si vos vies s'épuisent.",
  },
  "tank-battle": {
    name: "Tank Battle",
    subtitle: "Le Premier à Obtenir 3 Coups Gagne",
    rules: "Déplacez votre tank à gauche et à droite et tirez des obus. Toucher la voie de l'adversaire donne des points — soyez le premier à obtenir 3 coups pour gagner.",
  },
  "brick-breaker": {
    name: "Casse-Briques",
    subtitle: "Détruisez Toutes les Briques pour Gagner",
    rules:
      "Faites glisser la raquette à gauche et à droite pour faire rebondir la balle et détruire toutes les briques pour gagner. La balle qui tombe fait perdre une vie ; le défi échoue si les vies s'épuisent.",
  },
  "zombie-defense": {
    name: "Défense contre les Zombies",
    subtitle: "Survivez à Chaque Vague pour Gagner",
    rules:
      "Les zombies avancent sur la voie depuis la droite ; touchez pour les détruire (certains nécessitent deux touches). Laisser un zombie atteindre le bord gauche fait perdre une vie — survivez à chaque vague pour gagner.",
  },
  "air-combat": {
    name: "Combat Aérien",
    subtitle: "Survivez et Atteignez le Score Cible",
    rules:
      "Votre avion de chasse tire automatiquement ; déplacez-vous à gauche et à droite pour éviter les avions ennemis et les éliminer. Survivez jusqu'à la limite de temps tout en atteignant le score cible pour gagner ; si les vies s'épuisent, le défi échoue.",
  },
  billiards: {
    name: "Billard",
    subtitle: "Faites Glisser pour Viser, Empochez Toutes les Boules",
    rules:
      "Faites glisser vers l'arrière depuis la boule blanche pour viser, puis relâchez pour frapper. Empochez toutes les boules colorées avant que les tentatives ne s'épuisent pour gagner.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Atteignez l'Objectif de Quilles en 3 Manches",
    rules: "Faites glisser le curseur pour régler l'angle de lancer, puis relâchez pour lancer. Atteignez le total cible de quilles renversées en 3 manches pour gagner.",
  },
  "basketball-shoot": {
    name: "Tirs au Basket",
    subtitle: "Calculez le Moment du Tir",
    rules: "La jauge de puissance se déplace automatiquement d'avant en arrière — touchez pour tirer quand elle est proche du centre pour marquer. Marquez suffisamment de paniers pour gagner.",
  },
  "penalty-kick": {
    name: "Penalty",
    subtitle: "Choisissez le Côté contre le Gardien",
    rules: "Choisissez gauche, centre ou droite pour tirer contre un gardien qui plonge au hasard. Marquez suffisamment de buts en 5 manches pour gagner.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Changez de Voie pour Éviter le Trafic",
    rules: "Changez de voie à gauche et à droite pour éviter le trafic qui arrive. Le défi échoue si les vies s'épuisent avant d'atteindre la distance d'arrivée.",
  },
  parking: {
    name: "Défi de Stationnement",
    subtitle: "Garez-vous dans la Limite de Coups",
    rules: "Utilisez la direction et l'avance pour vous garer exactement à l'emplacement marqué avant d'épuiser vos coups ou de heurter quelque chose pour gagner.",
  },
  motocross: {
    name: "Saut de Motocross",
    subtitle: "Sautez les Trous jusqu'à l'Arrivée",
    rules: "Touchez pour faire sauter votre moto et franchir les trous devant au bon moment. Le défi échoue si les vies s'épuisent avant d'atteindre l'arrivée.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Contrôlez les Virages pour le Score",
    rules: "Contrôlez selon les virages de la piste pour rester sur la route tout en accumulant des points de drift. Atteignez l'arrivée avec suffisamment de points pour gagner.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Au Tour par Tour, le Premier KO Gagne",
    rules:
      "Choisissez Attack pour remplir la jauge spéciale, Guard pour réduire de moitié la prochaine attaque, ou relâchez le Finisher quand la jauge est pleine. Soyez le premier à réduire à zéro la vie de l'adversaire pour gagner.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Faites équipe contre deux adversaires contrôlés par ordinateur",
    rules:
      "Vous et votre partenaire Nord jouez contre Ouest et Est, tous deux contrôlés par ordinateur. À chaque levée, les quatre joueurs jouent à tour de rôle et doivent fournir la couleur demandée si possible ; sinon, ils peuvent jouer n'importe quelle couleur ou atout. La carte la plus haute de la couleur demandée, ou l'atout le plus haut, gagne la levée. Après les 13 levées, gagner 7 levées ou plus en équipe gagne la donne.",
  },
  "pick-red-points": {
    name: "Ramassez les Points Rouges",
    subtitle: "Associez la carte jouée à une carte sur la table",
    rules:
      "Jouez une carte à tour de rôle : si son rang correspond à une carte sur la table, ramassez toutes les cartes de ce rang plus votre carte jouée pour gagner des points. Si elle ne correspond pas, elle reste sur la table. Une fois le paquet épuisé, comparez les cœurs/carreaux rouges collectés par chaque côté — les cartes rouges normales valent 1 point, les 10, Valet, Dame et Roi rouges valent 10 points chacun. Le total le plus élevé gagne.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Combat contre le Propriétaire Terrien)",
    subtitle: "Propriétaire terrien contre deux Fermiers",
    rules:
      "Après la distribution, le système désigne un Propriétaire terrien (vous ou l'ordinateur) selon la force de la main — le Propriétaire terrien reçoit 3 cartes cachées supplémentaires, et les deux autres deviennent des Fermiers qui s'allient contre lui. Jouez à tour de rôle des combinaisons plus fortes que la dernière, ou passez si vous ne pouvez pas. Le Propriétaire terrien gagne s'il vide sa main en premier ; n'importe quel Fermier qui termine en premier gagne pour les Fermiers.",
  },
  "liars-cards": {
    name: "Cartes du Menteur",
    subtitle: "Jouez face cachée, annoncez le rang, devinez le mensonge",
    rules:
      "Vous et deux adversaires contrôlés par ordinateur jouez à tour de rôle : posez 1 à 4 cartes face cachée et annoncez un rang (les rangs doivent suivre le cycle A→2→3→...→R→A, et vous pouvez dire la vérité ou mentir). Les autres joueurs peuvent Croire et passer le tour, ou Défier le mensonge en retournant les cartes pour vérifier — un défi correct fait que celui qui a joué les cartes récupère toute la pile de la table, un défi incorrect fait que le challenger la récupère. Le premier à vider sa main sans être pris en train de mentir gagne.",
  },
  "five-pk": {
    name: "Poker à 5 Cartes",
    subtitle: "Un échange, puis comparez les mains avec option de doubler",
    rules:
      "Misez, puis 5 cartes sont distribuées (il y a 2 jokers dans le paquet). Gardez les cartes que vous voulez et échangez le reste une fois. Les mains paient selon leur rang — quinte flush 500x, carré 200x, quinte flush simple 120x, jusqu'à double paire 1x. Après une victoire, vous pouvez doubler ou rien en misant sur plus grand/petit ou rouge/noir, ou encaisser à tout moment.",
  },
  "little-mary": {
    name: "Little Mary Classique",
    subtitle: "Cadre lumineux tournant — misez sur les cartes grandes ou petites",
    rules:
      "Misez sur chaque symbole, puis commencez. Le cadre lumineux tourne rapidement pendant 3 tours, puis ralentit pour s'arrêter entre un demi-tour et un tour et demi — touchez Stop pour l'arrêter plus tôt. S'arrêter sur la flèche fait perdre ; s'arrêter sur le symbole de tour gratuit donne une relance gratuite ; les symboles fixes paient un multiple défini ; les symboles de carte grande ou petite paient selon le multiplicateur en cours si vous avez misé sur ce symbole. Après suffisamment de tours, une manche bonus peut se déclencher avec un paiement fixe plus élevé et un son caractéristique.",
  },
  "little-mary-2": {
    name: "Little Mary Classique II",
    subtitle: "Cadre lumineux tournant à thème sportif",
    rules:
      "Même mécanisme de rotation que Little Mary Classique, avec un thème sportif (football, rugby, basket, bowling, tennis, tennis de table, golf). Misez sur chaque symbole puis commencez — s'arrêter sur la flèche fait perdre, le symbole gratuit donne une relance gratuite, les symboles fixes paient un multiple défini, et les symboles sportifs grands ou petits paient selon le multiplicateur en cours s'ils sont misés. Une manche bonus peut se déclencher après suffisamment de tours avec un paiement fixe élevé.",
  },
  "little-mary-3": {
    name: "Little Mary Classique III",
    subtitle: "Jackpot du dieu des fleurs — misez sur grand ou petit",
    rules:
      "Même mécanisme de rotation que Little Mary Classique. Les trois lumières du dieu des fleurs clignotent normalement de façon indépendante ; après suffisamment de tours, elles peuvent se synchroniser dans un état d'alerte clignotante. Si le rouleau s'arrête sur le groupe de symboles grand ou petit pendant cette alerte, les trois symboles paient ensemble 3x le multiplicateur en cours — un bonus jackpot rare.",
  },
  "little-mary-4": {
    name: "Little Mary Classique IV",
    subtitle: "Jackpot du dieu des fleurs à thème animal",
    rules:
      "Même mécanisme que l'édition Jackpot du Dieu des Fleurs, avec un thème animal (tigre, dragon, singe, renard, souris, coq, poussin). L'alerte de jackpot du dieu des fleurs et le paiement 3x fonctionnent de la même façon.",
  },
  "little-mary-5": {
    name: "Little Mary Classique III (Phénix)",
    subtitle: "Édition décorative phénix — misez sur grand ou petit",
    rules:
      "Même mécanisme de rotation que Little Mary Classique. Un grand phénix au centre est purement décoratif, clignotant plus vite pendant l'alerte bonus. S'arrêter sur l'un des symboles de tour gratuit déploie une traînée lumineuse décorative sur le cadre — purement visuel, cela ne change pas le paiement.",
  },
  "little-mary-6": {
    name: "Little Mary Classique IV (Phénix)",
    subtitle: "Édition décorative phénix — thème boissons",
    rules:
      "Même mécanisme que l'édition Décorative Phénix, avec un thème boissons (théière, miel, thé maté, glace pilée, bière, vin, cocktail). Les effets décoratifs du phénix et la traînée lumineuse fonctionnent de la même façon.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Océan)",
    subtitle: "Cadre mini 8×8 — misez sur grand ou petit",
    rules:
      "Un cadre lumineux 8×8 plus petit (28 positions) avec le même mécanisme de rotation, à thème animaux marins (requin, baleine, dauphin, poisson tropical, crabe, coquillage, bulles). S'arrêter sur la flèche fait perdre, le symbole gratuit donne une relance gratuite, les symboles fixes paient un multiple défini, et les symboles grands ou petits paient selon le multiplicateur en cours s'ils sont misés. Une manche bonus jackpot peut se déclencher après suffisamment de tours.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Dessert)",
    subtitle: "Cadre mini 8×8 — thème dessert",
    rules:
      "Même mécanisme de cadre mini 8×8 que l'édition Océan, avec un thème dessert (gâteau, gâteau aux fraises, cupcake, donut, biscuit, bonbon, sucette). Une manche bonus jackpot peut se déclencher après suffisamment de tours avec un son caractéristique.",
  },
  "fruit-slot-1": {
    name: "Rouleaux de Fruits I",
    subtitle: "Rouleaux classiques 3×3, 5 lignes de paiement",
    rules:
      "Une machine à fruits classique à 3 rouleaux et 3 rangées avec 5 lignes de paiement (rangées supérieure, médiane, inférieure plus les deux diagonales). Misez par ligne, puis tournez — chaque rouleau s'arrête indépendamment de gauche à droite, et vous pouvez toucher Stop pour l'arrêter plus tôt. Trois symboles identiques sur n'importe quelle ligne de paiement paient selon le tableau, du 7 chanceux à 100x jusqu'à la cerise à 4x ; deux cerises ou plus n'importe où sur l'écran paient une petite consolation ; trois 7 sur la rangée médiane est le jackpot avec son propre spectacle lumineux et son son.",
  },
  "fruit-slot-2": {
    name: "Rouleaux de Fruits II",
    subtitle: "Thème fruits tropicaux, 5 lignes de paiement",
    rules:
      "Même mécanisme à 3 rouleaux et 5 lignes de paiement que Rouleaux de Fruits I, avec un thème tropical — un diamant remplace le 7 chanceux comme symbole jackpot, associé à la fraise, l'ananas, la banane, la pêche et la cerise. Trois symboles identiques sur n'importe quelle ligne de paiement paient selon le tableau, du diamant à 100x jusqu'à la cerise à 4x ; trois diamants sur la rangée médiane est le jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Classique V (Bonus Sept Chanceux)",
    subtitle: "Manche bonus multiplicatrice de sept chanceux",
    rules:
      "Même mécanisme de rotation que Little Mary Classique, avec des mises placées sur 8 symboles à la fois. Trois rouleaux de chiffres au centre tournent normalement de façon purement décorative ; en cas de victoire, il y a une chance de déclencher une manche bonus où les trois rouleaux s'arrêtent un par un. S'arrêter sur trois chiffres impairs identiques multiplie votre gain par 10x, trois chiffres pairs identiques par 5x — un bonus aléatoire rare qui ne se déclenche pas toujours.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Classique IV (Bonus Sept Chanceux, Festif)",
    subtitle: "Bonus sept chanceux à thème festif",
    rules:
      "Même mécanisme que l'édition Bonus Sept Chanceux, avec un thème festif (enveloppe rouge, lingot d'or, lanterne, mandarine, gâteau de lune, feux d'artifice, cerise). La manche bonus et les multiplicateurs de correspondance de chiffres 10x/5x fonctionnent de la même façon, avec des couleurs et effets sonores festifs.",
  },
  "xiangqi-mahjong": {
    name: "Mahjong Xiangqi",
    subtitle: "Formez des ensembles avec des pièces d'échecs, courez contre l'ordinateur pour gagner",
    rules:
      "Misez, puis vous et l'ordinateur piochez chacun 5 pièces d'échecs chinois. À votre tour, piochez une pièce — si elle complète une paire plus un ensemble (une suite ou un brelan), vous gagnez par pioche propre. Sinon, défaussez une de vos 6 pièces. Si la défausse de l'ordinateur complète votre main, vous pouvez la réclamer pour gagner, ou passer et continuer à piocher. Paiements : 2x pour une paire-suite mixte, 3x pour une paire-suite de même couleur, 5x pour cinq soldats ou pions ; réclamer une défausse paie selon le tarif indiqué, la pioche propre ajoute un bonus. Si le paquet s'épuise sans gagnant, les mises sont remboursées.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Pousse Cylindre)",
    subtitle: "Pai gow aux tuiles de mahjong sur trois positions à la fois",
    rules:
      "Utilise des tuiles de cercles de mahjong de 1 à 9 (4 de chaque) plus des tuiles vierges (4, valant un demi-point) pour représenter un paquet de 40 tuiles. Misez sur les positions tête, ciel et queue, puis le croupier et chaque position retournent 2 tuiles pour comparer. Ordre de classement : vierge double (le plus élevé) bat n'importe quelle paire, qui bat une combinaison 2-8, qui bat un total de points normal (somme des chiffres, le dernier chiffre compte, vierge = 0,5, 9,5 est le meilleur total normal, 0 le plus bas). Chaque position est comparée au croupier séparément — une victoire paie 1x, les paires paient 4x et la vierge double paie 10x ; des totaux égaux favorisent le croupier selon la règle de la maison.",
  },
}

const de: GameTable = {
  xiangqi: {
    name: "Chinesisches Schach",
    subtitle: "KI Solo／2 Spieler",
    rules:
      "Bewegt abwechselnd Figuren; wer den gegnerischen General zuerst in die Falle treibt, gewinnt. Folgt den traditionellen Xiangqi-Regeln: Wagen zieht geradeaus, Pferd im L, Elefant diagonal im eigenen Bereich, Berater diagonal nahe dem Palast, Soldat darf nach Überqueren des Flusses seitwärts ziehen.",
  },
  "darkchess-classic": {
    name: "Verdecktes Schach (Klassisch)",
    subtitle: "KI Solo／2 Spieler",
    rules: "Alle Figuren beginnen verdeckt. Nach dem Umdrehen werden Figuren nach traditioneller Rangordnung geschlagen. Alle gegnerischen Figuren zu schlagen oder den Gegner zugunfähig zu machen gewinnt.",
  },
  "darkchess-variant": {
    name: "Verdecktes Schach (Variante)",
    subtitle: "KI Solo／2 Spieler",
    rules: "Wie die klassische Version, aber Kanonenangriff und Sprungschlag folgen Variantenregeln, was neue Taktiken ermöglicht.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Setzt abwechselnd schwarze und weiße Steine auf die Kreuzungen eines 19×19-Bretts; wer mehr Gebiet kontrolliert, gewinnt. Vollständig umschlossene Steine ohne Freiheiten werden gefangen.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Setzt abwechselnd Steine; wer als Erster fünf in einer Reihe verbindet, gewinnt." },
  othello: {
    name: "Othello",
    subtitle: "Standard",
    rules: "Setzt abwechselnd Steine; eingeschlossene gegnerische Steine werden auf Ihre Farbe gedreht. Am Ende gewinnt, wer mehr Steine hat.",
  },
  mahjong: {
    name: "Chinesisches Mahjong",
    subtitle: "KI Solo (3 Computer)",
    rules: "Spielt an einem Tisch mit drei Computergegnern, zieht und legt abwechselnd Steine ab, könnt abgelegte Steine mit Chow／Pong／Kong beanspruchen. Wer zuerst eine gültige Gewinnhand vervollständigt, gewinnt.",
  },
  luzhanqi: {
    name: "Luzhanqi (Militärschach)",
    subtitle: "KI Solo／2 Spieler",
    rules: "Der Rang der Figuren beider Seiten ist geheim; der Gegner sieht nur die Rückseite. Kämpfe werden nach Rang entschieden; wer zuerst die feindliche Flagge erobert oder den Gegner zugunfähig macht, gewinnt.",
  },
  checkers: {
    name: "Dame",
    subtitle: "Standard",
    rules: "Bewegt Figuren abwechselnd diagonal; könnt über gegnerische Figuren springen, um sie zu schlagen. Alle gegnerischen Figuren zu schlagen oder den Gegner zugunfähig zu machen gewinnt.",
  },
  tictactoe: {
    name: "Tic-Tac-Toe",
    subtitle: "Vergrößertes 3×3-Format",
    rules: "Setzt abwechselnd Symbole; wer als Erster drei in einer Reihe verbindet, gewinnt.",
  },
  sevens: {
    name: "Siebener-Spiel",
    subtitle: "4 Spieler, Kartenreihe, niedrigste Punktzahl blockierter Karten gewinnt",
    rules:
      "Beginnt mit der Basiskarte 5; spielt abwechselnd Karten mit benachbarter Zahl. Kann man nicht spielen, blockiert man eine Karte, die Punkte abzieht; am Ende gewinnt, wer die wenigsten Punkte bei blockierten Karten hat.",
  },
  "sichuan-mahjong": {
    name: "Sichuan-Mahjong (Blutschlacht)",
    subtitle: "Eine Farbe muss fehlen, der Gewinner spielt weiter",
    rules:
      "Verwendet nur drei Farben; zu Beginn muss eine Farbe vollständig verworfen werden. Wer zuerst gewinnt, scheidet aus, die anderen spielen weiter, bis drei gewonnen haben oder die Steine aufgebraucht sind.",
  },
  "malaysia-mahjong": {
    name: "Malaysisches Drei-Spieler-Mahjong",
    subtitle: "3 Spieler, fliegende Steine als Joker",
    rules:
      "Drei-Spieler-Partie, bei der das Set nur Kreise, Ehrensteine und fliegende Steine (Joker) enthält, was große Kombinationen erleichtert.",
  },
  "mahjong-pengpeng": {
    name: "Peng Peng (Nur Drillinge)",
    subtitle: "Vereinfachtes Mahjong, nur Drillinge ohne Folgen",
    rules: "Vereinfachtes Set, bei dem man nur Drillinge (Pong) bilden oder ziehen kann, keine Folgen (Chow); gewinnt mit 2 Drillingen und 1 Paar.",
  },
  "mahjong-sevens": {
    name: "Mahjong-Siebener",
    subtitle: "Wie das Siebener-Spiel, aber mit Mahjong-Steinen",
    rules:
      "Beginnt mit den Fünfen jeder Farbe als Basis; spielt abwechselnd Steine mit benachbarter Zahl, das Blockieren eines Steins zieht Punkte ab.",
  },
  "riichi-mahjong": {
    name: "Japanisches Riichi-Mahjong",
    subtitle: "Ost-Runde, Riichi / Dora / Furiten",
    rules:
      "Mit geschlossener, spielbereiter Hand kann man Riichi mit Einsatz erklären; Dora-Steine bringen Bonuspunkte; bei Furiten kann man nicht mit einem bereits abgeworfenen Stein gewinnen; ein gültiges Yaku ist zum Gewinnen nötig.",
  },
  "mahjong-solitaire": {
    name: "Mahjong-Solitaire",
    subtitle: "Finde gleiche Paare, verbinde mit max. 2 Kurven",
    rules:
      "Finde zwei gleiche Steine, die mit höchstens zwei Linienkurven verbindbar sind, um sie zu entfernen; räume das Feld vor Ablauf der Zeit, um zu gewinnen.",
  },
  "merge-2048": {
    name: "2048 Verschmelzen",
    subtitle: "Wischen zum Verschmelzen von Zahlen, erreiche 2048",
    rules: "Wische nach oben, unten, links oder rechts; gleiche Zahlen verschmelzen beim Zusammenstoß und verdoppeln sich. Erreiche 2048 zum Gewinnen.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Verschmelze Gebäude, vom Rasen zum Wolkenkratzer",
    rules: "Gleiches Spiel wie 2048, aber die Zahlen sind Gebäude; verschmelze schrittweise vom Rasen bis zum Wolkenkratzer.",
  },
  "merge-2048-undo": {
    name: "2048 mit Rückgängig",
    subtitle: "Verschmelze Zahlen mit Rückgängig-Funktion",
    rules: "Wie 2048, aber mit Rückgängig-Funktion: Wischt man in die falsche Richtung, kann man zurückgehen und es erneut versuchen.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Verschmelze Gebäude, Vorsicht vor Bären",
    rules:
      "Auf einem 6x6-Feld verschmilzt man drei gleiche Objekte, um sie aufzuwerten; Bären bewegen sich und stören, können aber eingekesselt werden und zu verschmelzbaren Grabsteinen werden.",
  },
  suika: {
    name: "Suika Game (Wassermelonen-Verschmelzung)",
    subtitle: "Bewege und lasse Früchte fallen, gleiche verschmelzen und wachsen",
    rules:
      "Bewege nach links oder rechts, um die Fallposition zu wählen; gleiche Früchte, die sich berühren, verschmelzen zu einer größeren, mit der Wassermelone als Endziel.",
  },
  "drop-2048": {
    name: "2048 Fall",
    subtitle: "Zahlenblöcke fallen und stapeln sich, verschmelze zum Verdoppeln",
    rules: "Zahlenblöcke fallen von oben; bewege sie seitlich, um die Position zu wählen, gleiche Zahlen verschmelzen beim Stapeln und verdoppeln sich.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Paare von Gelees fallen, 4 oder mehr gleicher Farbe löschen",
    rules: "Paare farbiger Gelees fallen und können bewegt und gedreht werden; verbinde 4 oder mehr gleicher Farbe, um sie zu löschen und Combos auszulösen.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Kapseln fallen und stapeln sich, reihe zum Löschen der Viren",
    rules: "Zweifarbige Kapseln fallen und stapeln sich; reihe die gleiche Farbe, um Viren zu löschen, lösche alle Viren, um das Level zu schaffen.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Wechsle zwischen zwei klassischen Fall-Löschspielen",
    rules: "Du kannst zwischen Columns (verbinde Edelsteine gleicher Farbe) und Tetris (fülle eine Zeile, um sie zu löschen) wechseln.",
  },
  "candy-crush": {
    name: "Candy Crush Saga",
    subtitle: "Tausche Süßigkeiten in Dreierreihe, erreiche die Zielpunktzahl",
    rules:
      "Tausche benachbarte Süßigkeiten, um Dreierreihen zu bilden; besondere Süßigkeiten sind mächtig, erreiche die Zielpunktzahl innerhalb der Zuglimit.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Der Pionier der Match-3-Spiele, tausche Edelsteine",
    rules: "Tausche benachbarte Edelsteine, um Reihen gleicher Farbe zu bilden und zu löschen; sammle fortlaufend Punkte, um deinen Rekord zu übertreffen.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Verdiene Münzen mit Match-3, restauriere den verwahrlosten Garten",
    rules: "Verdiene Münzen durch Dreier-Kombinationen; nutze die Münzen, um die Aufgaben zur Gartenrestaurierung zu erfüllen.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Verdiene Münzen mit Match-3, dekoriere die Traumvilla",
    rules: "Verdiene Münzen durch Dreier-Kombinationen; nutze die Münzen, um die Aufgaben zur Villendekoration zu erfüllen.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Verdiene Münzen mit Match-3, restauriere das alte Schloss",
    rules: "Verdiene Münzen durch Dreier-Kombinationen; nutze die Münzen, um die Aufgaben zur Schlossrestaurierung zu erfüllen.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Edelstein-Match-3 + Kartenkampf mit Progression",
    rules: "Beim Kombinieren von Edelsteinen greifen Verbündete des entsprechenden Elements die Feinde an; besiege Feinde, um aufzusteigen und voranzukommen.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Edelstein-Match-3 + Kampf mit Elementvorteilen",
    rules: "Kombiniere Edelsteine, um anzugreifen; nutze Elementvorteile für mehr Schaden und besiege Feinde.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Edelstein-Match-3 + vereinfachter Städtebau und PvP",
    rules: "Kombiniere Edelsteine, damit deine Helden angreifen; besiege Rivalen für Baumaterial und baue dein Reich Schritt für Schritt aus.",
  },
  "sheep-sheep": {
    name: "Schaf nach Schaf",
    subtitle: "Tippe gestapelte Kacheln an und sammle bis zu 3 gleiche",
    rules:
      "Tippe unblockierte Kacheln an, um sie in die Sammelablage zu schicken; sammle 3 gleiche zum Löschen, wenn die Ablage voll wird, ohne vollständig zu sein, verlierst du.",
  },
  match3d: {
    name: "3D-Löschen",
    subtitle: "3D-Krimskrams-Stapel, antippen und im Dreierpack sammeln",
    rules: "Gleiches Spiel wie Schaf nach Schaf, aber mit einem Stapel dreidimensionaler Objekte zum Suchen und Sammeln im Dreierpack.",
  },
  "balls-merge": {
    name: "Bälle-Verschmelzung",
    subtitle: "Seitlich bewegen und fallen lassen, gleiche Bälle verschmelzen und wachsen",
    rules: "Gleiches Spiel wie Suika Game, Thema Bälle; gleiche Bälle verschmelzen zu einem größeren.",
  },
  "cookies-merge": {
    name: "Keks-Verschmelzung",
    subtitle: "Seitlich bewegen und fallen lassen, gleiche Kekse verschmelzen und wachsen",
    rules: "Gleiches Spiel wie Suika Game, Thema Kekse; gleiche Kekse verschmelzen zu einem größeren.",
  },
  "planets-merge": {
    name: "Planeten-Verschmelzung",
    subtitle: "Seitlich bewegen und fallen lassen, gleiche Planeten verschmelzen und wachsen",
    rules: "Gleiches Spiel wie Suika Game, Thema Planeten; gleiche Planeten verschmelzen zu einem größeren.",
  },
  "mahjong-ninepoint5": {
    name: "Mahjong Neun-und-Halb",
    subtitle: "Mahjong-Steine simulieren Karten, komm an 9,5 heran",
    rules: "Verwende Mahjong-Steine statt Karten; ziehe weitere Steine oder halte an, wer am nächsten an 9,5 kommt, ohne zu überschreiten, gewinnt.",
  },
  "mahjong-niuniu": {
    name: "Mahjong Niu Niu",
    subtitle: "Mahjong-Steine simulieren Karten, bilde 10 und vergleiche",
    rules: "Verwende Mahjong-Steine statt Karten; von 5 Steinen müssen 3 ein Vielfaches von 10 ergeben, die anderen 2 werden nach Punkten verglichen.",
  },
  "dragon-gate": {
    name: "Drachentor",
    subtitle: "Mahjong-Kreissteine, rate höher oder niedriger",
    rules:
      "Zwei Kreissteine werden als Tor aufgedeckt; nach dem Einsatz wird ein dritter aufgedeckt – innerhalb des Tors gewinnst du, außerhalb verlierst du, und am Rand wird der Einsatz verdoppelt.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Gegen den Dealer, möglichst nah an 21",
    rules:
      "Komm möglichst nah an 21, ohne zu überschreiten. Ass zählt 1 oder 11, Bildkarten zählen 10. Wähle Ziehen oder Stehen bleiben – der Dealer muss weiterziehen, bis er 17 oder mehr erreicht.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Setze auf Player, Banker oder Tie, bevor die Karten ausgeteilt werden. Die Summe nutzt die letzte Ziffer; die höhere Summe gewinnt. Zusatzkarten werden automatisch nach den Standard-Baccarat-Regeln gezogen.",
  },
  "ten-half": {
    name: "Zehn-und-Halb",
    subtitle: "Näher an 10,5 als der Dealer",
    rules:
      "Setze einen Einsatz, dann erhalten beide Seiten 2 Karten. Wähle Ziehen oder Stehen bleiben – wer näher an 10,5 ist, ohne zu überschreiten, gewinnt. Ass zählt 1 Punkt, Bildkarten 0,5 Punkte. Ein natürliches 10,5 beim Austeilen zahlt 3x; ein normaler Sieg zahlt 2x; bei Gleichstand wird der Einsatz zurückgegeben.",
  },
  "thirteen-water": {
    name: "Dreizehn Karten",
    subtitle: "Teile 13 Karten in 3 Hände gegen den Dealer",
    rules:
      "Setze einen Einsatz und teile aus. Das System ordnet deine 13 Karten und die des Dealers automatisch in eine vordere Hand mit 3 Karten, eine mittlere mit 5 und eine hintere mit 5, die separat verglichen werden. Alle 3 Hände gewinnen zahlt 5x, 2 gewinnen zahlt 2x, 1 gewinnen zahlt 1,5x, Gleichstand zahlt weder noch, und mehr verlieren als gewinnen kostet den Einsatz.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Spiele Einzelkarten oder Paare, um zuerst die Hand zu leeren",
    rules:
      "Setze einen Einsatz und spiele gegen den Dealer. Spiele eine Einzelkarte oder ein gleichrangiges Paar, das stärker als der letzte Zug ist, oder passe. Die Reihenfolge geht von 3 (am schwächsten) bis 2 (am stärksten), bei Gleichstand entscheidet die Farbe. Leere deine 13 Karten zuerst, um das 2-fache deines Einsatzes zu gewinnen.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Vergleiche 5 Karten direkt mit dem Dealer",
    rules:
      "Setze einen Einsatz, dann erhalten du und der Dealer jeweils 5 Karten und vergleicht den Rang direkt – Straight Flush, Vierling, Full House, Flush, Straight, Drilling, zwei Paare, ein Paar, höchste Karte. Die stärkere Hand gewinnt 2x; bei Gleichstand wird der Einsatz zurückgegeben.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Bilde Vielfache von 10 aus 5 Karten für den besten Bull-Score",
    rules:
      "Setze einen Einsatz, dann erhalten du und der Dealer jeweils 5 Karten. Wähle 3, deren Summe ein Vielfaches von 10 ist (ein „Bull“); die letzte Ziffer der verbleibenden 2 Karten ist dein Score, höher ist besser. Eine genaue 10 ist die höchste „Bull Bull“-Hand; keine gültige Kombination ist „No Bull“, die niedrigste. Der höhere Score gewinnt 2x; bei Gleichstand wird der Einsatz zurückgegeben. Bildkarten zählen 10, Ass zählt 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Vergleiche 3 Karten direkt mit dem Dealer",
    rules:
      "Setze einen Einsatz, dann erhalten du und der Dealer jeweils 3 Karten und vergleicht den Rang direkt – Drilling, Straight Flush, Flush, Straight, Paar, höchste Karte. Die stärkere Hand gewinnt 2x; bei Gleichstand wird der Einsatz zurückgegeben.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 Austeilrunden – in jeder Phase aussteigen oder verdoppeln",
    rules:
      "Lege deinen Starteinsatz fest. Karten werden in 4 Phasen ausgeteilt (3, dann 2, dann 1, dann die letzten 2 aufgedeckt), und nach jeder Phase kannst du aussteigen oder deinen Einsatz verdoppeln. Die beste 5-Karten-Hand aus deinen 7 Karten entscheidet das Ergebnis. Aussteigen kostet deinen aktuellen Gesamteinsatz; ein Sieg zahlt nach Rang, von Royal Flush mit 150x bis zwei Paaren mit 1x.",
  },
  chess: {
    name: "Schach",
    subtitle: "KI Solo／2 Spieler",
    rules:
      "Bewegt abwechselnd Figuren; wer den gegnerischen König zuerst schachmatt setzt, gewinnt. Folgt den Standardregeln des Schachs für die Bewegung von Bauern, Türmen, Springern, Läufern, Dame und König.",
  },
  connect4: {
    name: "Vier Gewinnt",
    subtitle: "KI Solo／2 Spieler",
    rules: "Lasst abwechselnd Spielsteine in ein vertikales Gitter fallen. Wer als Erster vier Steine horizontal, vertikal oder diagonal verbindet, gewinnt.",
  },
  "chinese-checkers": {
    name: "Chinesisches Dame",
    subtitle: "Sternbrett",
    rules:
      "Auf einem sechszackigen sternförmigen Brett bewegt zuerst alle eure Figuren in die gegenüberliegende Ecke, um zu gewinnen. Figuren können einen Schritt vorrücken oder in einer Kette über andere Figuren springen, um voranzukommen.",
  },
  jigsaw: {
    name: "Schiebepuzzle",
    subtitle: "Nummerierte Kacheln",
    rules: "Tippt die Kachel neben dem leeren Feld an, um sie zu verschieben. Ordnet die Kacheln von 1 bis 15 in der richtigen Reihenfolge, um die Herausforderung abzuschließen.",
  },
  "number-merge": {
    name: "Zahlenfusion",
    subtitle: "2048-Stil",
    rules: "Wischt oder nutzt die Richtungstasten. Kacheln mit derselben Zahl verschmelzen und verdoppeln ihren Wert bei Kollision; erreicht 2048 zum Gewinnen.",
  },
  "memory-match": {
    name: "Memory",
    subtitle: "Zuordnungsherausforderung",
    rules: "Deckt zwei Karten gleichzeitig auf; übereinstimmende Paare bleiben offen. Findet alle Paare mit möglichst wenigen Versuchen, um zu gewinnen.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Spieler",
    rules: "Würfelt, um eure Figur um das Brett zu bewegen, bis sie nach Hause kommt. Landet man auf der Figur des Gegners, wird diese zurück zum Start geschickt.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Klassisches Solo",
    rules: "Ordnet alle Karten nach Farbe und aufsteigender Reihenfolge auf den vier Grundstapeln, um das Feld zu räumen und zu gewinnen.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Steine-Rommé gegen KI",
    rules: "Nutzt eure nummerierten Steine, um Folgen oder Gruppen gleicher Zahlen zu bilden, und legt sie dann auf den Tisch. Werdet zuerst alle eure Steine los, um zu gewinnen.",
  },
  "rps-battle": {
    name: "Schere, Stein, Papier",
    subtitle: "gegen KI",
    rules: "Wirft gleichzeitig Stein, Papier oder Schere gegen den Computer. Wer mehr Runden gewinnt, gewinnt das Spiel.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 gegen 1 vs KI (Vereinfacht)",
    rules:
      "Du und die KI haben jeweils 2 Karten sowie 5 gemeinsame Gemeinschaftskarten. Wählt Call, um die Hand aufzudecken, oder Fold, um auszusteigen – die höher eingestufte Hand gewinnt den Pot.",
  },
  war: {
    name: "Krieg",
    subtitle: "Höchste Karte vs KI",
    rules:
      "Die Karten werden gleichmäßig verteilt. In jeder Runde deckt jede Seite eine Karte auf – die höhere gewinnt die Runde. Ein Gleichstand löst eine zusätzliche Schlacht aus; wer am Ende mehr Karten hat, gewinnt.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "gegen den Dealer",
    rules:
      "Du und der Dealer erhaltet jeweils 3 Karten. Nachdem du deine Hand gesehen hast, wähle Call, um aufzudecken und zu vergleichen, oder Fold, um die Runde aufzugeben – die höher eingestufte Hand gewinnt.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Schiebeblock-Puzzle",
    rules: "Schiebt Blöcke unterschiedlicher Größe in einem begrenzten Brettraum. Bewegt den größten Block zum Ausgang unten, um zu gewinnen.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Ordnet und löscht Linien",
    rules:
      "Wischt nach links oder rechts, um den fallenden Block zu bewegen, tippt, um ihn zu drehen, wischt nach unten, um ihn schnell fallen zu lassen. Füllt eine Linie, um sie zu löschen und Punkte zu erhalten; das Spiel endet, wenn der Stapel die Spitze erreicht.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Farben kombinieren zum Löschen",
    rules: "Tippt eine Richtung an, um die aktuelle Blase abzuschießen. Drei oder mehr verbundene Blasen gleicher Farbe werden gelöscht und geben Punkte; das Spiel endet, wenn die Blasen die Spitze erreichen.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Tauschen zum Kombinieren",
    rules:
      "Tippt eine Kachel an, dann tippt eine benachbarte Kachel an, um sie zu tauschen. Das Kombinieren von 3 oder mehr gleicher Farbe löscht sie und füllt von oben nach, was Ketten-Combos auslösen kann.",
  },
  hanoi: {
    name: "Turm von Hanoi",
    subtitle: "Bewegt die Scheiben",
    rules:
      "Tippt einen Turm an, um die oberste Scheibe zu nehmen, dann tippt einen anderen Turm an, um sie zu bewegen. Eine große Scheibe darf nicht über einer kleinen liegen – bewegt den gesamten Stapel zum rechtesten Turm, um zu gewinnen.",
  },
  "water-sort": {
    name: "Wassersortier-Puzzle",
    subtitle: "Gießt, um Farben zu sortieren",
    rules:
      "Tippt ein Röhrchen an, um die oberste Farbe zu nehmen, dann tippt ein anderes Röhrchen an, um sie einzugießen – nur in ein leeres Röhrchen oder eines mit derselben Farbe oben. Sortiert jedes Röhrchen in eine einzige Farbe, um zu gewinnen.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Drehen zum Verbinden",
    rules: "Tippt eine Rohrkachel an, um sie um 90° zu drehen. Verbindet die Wasserquelle oben links mit dem Ausgang unten rechts, um zu gewinnen.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Timt euren Fall",
    rules:
      "Der obere Block bewegt sich nach links und rechts; tippt, um ihn auf den Stapel darunter fallen zu lassen. Je weniger Überlappung, desto schmaler der Block – den Stapel vollständig zu verfehlen beendet das Spiel.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Tauschen zum Sortieren",
    rules: "Tippt zwei nummerierte Kacheln an, um ihre Position zu tauschen. Sortiert alle Zahlen vom kleinsten zum größten mit möglichst wenigen Tauschvorgängen, um zu gewinnen.",
  },
  "mini-sudoku": {
    name: "Mini-Sudoku",
    subtitle: "6×6-Gitter",
    rules:
      "Jede Zeile, Spalte und 2×3-Box muss die Zahlen 1 bis 6 ohne Wiederholung enthalten. Füllt das gesamte Gitter ohne Konflikte, um zu gewinnen.",
  },
  "shooting-range": {
    name: "Schießstand",
    subtitle: "Schnelle Reflex-Ziele",
    rules: "Ziele leuchten zufällig im gesamten Gitter auf – tippt so schnell wie möglich, um Punkte zu sammeln. Erreicht die Zielpunktzahl, bevor die Zeit abläuft, um zu gewinnen.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Löscht die ganze Flotte zum Gewinnen",
    rules:
      "Bewegt euch nach links und rechts, um feindlichem Feuer auszuweichen und die gesamte Alienflotte abzuschießen. Die Herausforderung scheitert, wenn die Flotte zu nah kommt oder die Leben aufgebraucht sind.",
  },
  "tank-battle": {
    name: "Panzerschlacht",
    subtitle: "Wer zuerst 3 Treffer erzielt, gewinnt",
    rules: "Bewegt euren Panzer nach links und rechts und schießt Granaten. Einen Treffer auf der Spur des Gegners zu erzielen gibt Punkte – seid die Ersten mit 3 Treffern, um zu gewinnen.",
  },
  "brick-breaker": {
    name: "Brick Breaker",
    subtitle: "Zerstört alle Steine zum Gewinnen",
    rules:
      "Zieht das Paddel nach links und rechts, um den Ball abprallen zu lassen und alle Steine zu zerstören, um zu gewinnen. Fällt der Ball herunter, verliert ihr ein Leben; die Herausforderung scheitert, wenn die Leben aufgebraucht sind.",
  },
  "zombie-defense": {
    name: "Zombie-Abwehr",
    subtitle: "Überlebt jede Welle zum Gewinnen",
    rules:
      "Zombies bewegen sich auf der Spur von rechts vorwärts; tippt, um sie zu zerstören (manche brauchen zwei Tipps). Lässt man einen den linken Rand erreichen, kostet das ein Leben – überlebt jede Welle, um zu gewinnen.",
  },
  "air-combat": {
    name: "Luftkampf",
    subtitle: "Überleben & Zielpunktzahl erreichen",
    rules:
      "Euer Kampfjet schießt automatisch; bewegt euch nach links und rechts, um feindlichen Flugzeugen auszuweichen und sie zu eliminieren. Überlebt bis zum Zeitlimit und erreicht dabei die Zielpunktzahl, um zu gewinnen; sind die Leben aufgebraucht, scheitert die Herausforderung.",
  },
  billiards: {
    name: "Billard",
    subtitle: "Ziehen zum Zielen, alle Bälle einlochen",
    rules:
      "Zieht von der weißen Kugel nach hinten, um zu zielen, dann lasst los, um zu schlagen. Locht alle farbigen Bälle ein, bevor die Versuche aufgebraucht sind, um zu gewinnen.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Erreicht das Pin-Ziel in 3 Durchgängen",
    rules: "Zieht den Schieberegler, um den Wurfwinkel einzustellen, dann lasst los, um zu werfen. Erreicht die Zielanzahl umgeworfener Pins in 3 Durchgängen, um zu gewinnen.",
  },
  "basketball-shoot": {
    name: "Basketball-Wurf",
    subtitle: "Timt euren Wurf",
    rules: "Der Kraftmesser bewegt sich automatisch vor und zurück – tippt, um zu werfen, wenn er nahe der Mitte ist, damit er trifft. Erzielt genug Körbe, um zu gewinnen.",
  },
  "penalty-kick": {
    name: "Elfmeter",
    subtitle: "Seite wählen gegen den Torwart",
    rules: "Wählt links, Mitte oder rechts, um gegen einen zufällig springenden Torwart zu schießen. Erzielt genug Tore in 5 Runden, um zu gewinnen.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Spur wechseln, um Verkehr auszuweichen",
    rules: "Wechselt die Spur nach links und rechts, um ankommendem Verkehr auszuweichen. Die Herausforderung scheitert, wenn die Leben aufgebraucht sind, bevor die Zieldistanz erreicht ist.",
  },
  parking: {
    name: "Parkherausforderung",
    subtitle: "Parkt innerhalb des Zuglimits",
    rules: "Nutzt Lenkung und Vorwärtsfahrt, um genau an der markierten Stelle zu parken, bevor eure Züge aufgebraucht sind oder ihr zusammenstoßt, um zu gewinnen.",
  },
  motocross: {
    name: "Motocross-Sprung",
    subtitle: "Springt über Löcher bis zum Ziel",
    rules: "Tippt, um euer Motorrad springen zu lassen und Löcher vor euch mit präzisem Timing zu überwinden. Die Herausforderung scheitert, wenn die Leben aufgebraucht sind, bevor ihr das Ziel erreicht.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Kurven kontrollieren für Punkte",
    rules: "Steuert entsprechend den Kurven der Strecke, um auf der Strecke zu bleiben und dabei Drift-Punkte zu sammeln. Erreicht das Ziel mit genug Punkten, um zu gewinnen.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "Rundenbasiert, der erste K.O. gewinnt",
    rules:
      "Wählt Attack, um den Spezialmesser zu füllen, Guard, um den nächsten Angriff zu halbieren, oder lasst den Finisher los, wenn der Messer voll ist. Seid die Ersten, die das Leben des Gegners auf null bringen, um zu gewinnen.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Bildet ein Team gegen zwei computergesteuerte Gegner",
    rules:
      "Du und dein Nord-Partner spielt gegen West und Ost, die beide vom Computer gesteuert werden. In jedem Stich spielen alle vier Spieler abwechselnd und müssen die Farbe bedienen, wenn möglich; andernfalls dürfen sie jede Farbe oder einen Trumpf spielen. Die höchste Karte der angespielten Farbe oder der höchste Trumpf gewinnt den Stich. Nach allen 13 Stichen gewinnt das Team, das 7 oder mehr Stiche erzielt hat, die Hand.",
  },
  "pick-red-points": {
    name: "Rote Punkte sammeln",
    subtitle: "Ordnet die gespielte Karte einer auf dem Tisch zu",
    rules:
      "Spielt abwechselnd eine Karte: Stimmt ihr Rang mit einer Karte auf dem Tisch überein, nehmt alle Karten dieses Rangs plus eure gespielte Karte, um Punkte zu erhalten. Stimmt sie nicht überein, bleibt sie auf dem Tisch. Ist das Deck aufgebraucht, vergleicht die gesammelten roten Herzen/Karos jeder Seite – normale rote Karten zählen 1 Punkt, rote 10, Bube, Dame und König zählen jeweils 10 Punkte. Die höhere Summe gewinnt.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Kampf gegen den Landlord)",
    subtitle: "Landlord gegen zwei Farmer",
    rules:
      "Nach dem Austeilen weist das System basierend auf der Handstärke einen Landlord zu (dich oder den Computer) – der Landlord erhält 3 zusätzliche verdeckte Karten, und die anderen beiden werden zu Farmern, die sich gegen ihn verbünden. Spielt abwechselnd Kombinationen, die stärker als die letzte sind, oder passt, wenn ihr nicht könnt. Der Landlord gewinnt, wenn er zuerst die Hand leert; jeder Farmer, der zuerst fertig ist, gewinnt für die Farmer.",
  },
  "liars-cards": {
    name: "Lügenkarten",
    subtitle: "Verdeckt spielen, den Rang ansagen, die Lüge erraten",
    rules:
      "Du und zwei computergesteuerte Gegner spielt abwechselnd: Legt 1 bis 4 Karten verdeckt und sagt einen Rang an (die Ränge müssen dem Zyklus A→2→3→...→K→A folgen, und ihr könnt die Wahrheit sagen oder lügen). Andere Spieler können Glauben und den Zug weitergeben, oder die Lüge Herausfordern, indem sie die Karten zur Überprüfung aufdecken – eine korrekte Herausforderung lässt denjenigen, der die Karten gespielt hat, den gesamten Tischstapel aufnehmen, eine falsche Herausforderung lässt den Herausforderer ihn aufnehmen. Wer zuerst die Hand leert, ohne beim Lügen erwischt zu werden, gewinnt.",
  },
  "five-pk": {
    name: "5-Karten-Poker",
    subtitle: "Ein Tausch, dann Hände mit Verdopplungsoption vergleichen",
    rules:
      "Setzt einen Einsatz, dann werden 5 Karten ausgeteilt (2 Joker sind im Deck). Behaltet die Karten, die ihr wollt, und tauscht den Rest einmal aus. Hände zahlen nach Rang – Straight Flush 500x, Vierling 200x, einfacher Straight Flush 120x, bis zwei Paare 1x. Nach einem Gewinn könnt ihr alles-oder-nichts verdoppeln, indem ihr auf größer/kleiner oder rot/schwarz setzt, oder jederzeit auszahlen.",
  },
  "little-mary": {
    name: "Little Mary Klassik",
    subtitle: "Drehender Lichtrahmen — wette auf große oder kleine Karten",
    rules:
      "Setzt auf jedes Symbol, dann startet. Der Lichtrahmen dreht sich schnell für 3 Runden, verlangsamt sich dann, um zwischen einer halben und eineinhalb Runden zu stoppen – tippt Stop, um früher zu stoppen. Auf dem Pfeil zu landen verliert; auf dem Freispiel-Symbol zu landen gibt eine kostenlose Wiederholung; feste Symbole zahlen ein festes Vielfaches; große oder kleine Kartensymbole zahlen nach dem laufenden Multiplikator, wenn ihr auf dieses Symbol gesetzt habt. Nach genug Drehungen kann eine Bonusrunde mit höherer fester Auszahlung und charakteristischem Klang ausgelöst werden.",
  },
  "little-mary-2": {
    name: "Little Mary Klassik II",
    subtitle: "Drehender Lichtrahmen mit Sportthema",
    rules:
      "Gleicher Drehmechanismus wie Little Mary Klassik, mit Sportthema (Fußball, Rugby, Basketball, Bowling, Tennis, Tischtennis, Golf). Setzt auf jedes Symbol und startet – auf dem Pfeil zu landen verliert, das Freisymbol gibt eine kostenlose Wiederholung, feste Symbole zahlen ein festes Vielfaches, und große oder kleine Sportsymbole zahlen nach dem laufenden Multiplikator, wenn darauf gesetzt wurde. Eine Bonusrunde kann nach genug Drehungen mit hoher fester Auszahlung ausgelöst werden.",
  },
  "little-mary-3": {
    name: "Little Mary Klassik III",
    subtitle: "Blumengott-Jackpot — wette auf groß oder klein",
    rules:
      "Gleicher Drehmechanismus wie Little Mary Klassik. Die drei Blumengott-Lichter blinken normalerweise unabhängig; nach genug Drehungen können sie sich zu einem blinkenden Alarmzustand synchronisieren. Stoppt die Walze während dieses Alarms auf der großen oder kleinen Symbolgruppe, zahlen alle drei Symbole zusammen 3x den laufenden Multiplikator – ein seltener Jackpot-Bonus.",
  },
  "little-mary-4": {
    name: "Little Mary Klassik IV",
    subtitle: "Blumengott-Jackpot mit Tierthema",
    rules:
      "Gleicher Mechanismus wie die Blumengott-Jackpot-Edition, mit Tierthema (Tiger, Drache, Affe, Fuchs, Maus, Hahn, Küken). Der Blumengott-Jackpot-Alarm und die 3x-Auszahlung funktionieren identisch.",
  },
  "little-mary-5": {
    name: "Little Mary Klassik III (Phönix)",
    subtitle: "Phönix-Dekorationsedition — wette auf groß oder klein",
    rules:
      "Gleicher Drehmechanismus wie Little Mary Klassik. Ein großer Phönix in der Mitte ist rein dekorativ und blinkt während des Bonusalarms schneller. Auf einem der Freispiel-Symbole zu landen breitet eine dekorative Lichtspur über den Rahmen aus – nur visuell, ändert nicht die Auszahlung.",
  },
  "little-mary-6": {
    name: "Little Mary Klassik IV (Phönix)",
    subtitle: "Phönix-Dekorationsedition — Getränkethema",
    rules:
      "Gleicher Mechanismus wie die Phönix-Dekorationsedition, mit Getränkethema (Teekanne, Honig, Mate-Tee, Shaved Ice, Bier, Wein, Cocktail). Die dekorativen Phönix-Effekte und die Lichtspur funktionieren identisch.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Ozean)",
    subtitle: "8×8-Mini-Rahmen — wette auf groß oder klein",
    rules:
      "Ein kleinerer 8×8-Lichtrahmen (28 Positionen) mit gleichem Drehmechanismus, mit Meerestier-Thema (Hai, Wal, Delfin, tropischer Fisch, Krabbe, Muschel, Blasen). Auf dem Pfeil zu landen verliert, das Freisymbol gibt eine kostenlose Wiederholung, feste Symbole zahlen ein festes Vielfaches, und große oder kleine Symbole zahlen nach dem laufenden Multiplikator, wenn darauf gesetzt wurde. Eine Jackpot-Bonusrunde kann nach genug Drehungen ausgelöst werden.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Dessert)",
    subtitle: "8×8-Mini-Rahmen — Dessertthema",
    rules:
      "Gleicher 8×8-Mini-Rahmen-Mechanismus wie die Ozean-Edition, mit Dessertthema (Kuchen, Erdbeerkuchen, Cupcake, Donut, Keks, Süßigkeit, Lutscher). Eine Jackpot-Bonusrunde kann nach genug Drehungen mit charakteristischem Klang ausgelöst werden.",
  },
  "fruit-slot-1": {
    name: "Fruchtwalzen I",
    subtitle: "Klassische 3×3-Walzen, 5 Gewinnlinien",
    rules:
      "Ein klassischer 3-Walzen-, 3-Reihen-Fruchtautomat mit 5 Gewinnlinien (obere, mittlere, untere Reihe plus beide Diagonalen). Setzt pro Linie, dann dreht – jede Walze stoppt unabhängig von links nach rechts, und ihr könnt Stop tippen, um früher zu stoppen. Drei gleiche Symbole auf einer beliebigen Gewinnlinie zahlen nach Tabelle, von der Glückssieben mit 100x bis zur Kirsche mit 4x; zwei oder mehr Kirschen irgendwo auf dem Bildschirm zahlen einen kleinen Trostpreis; drei Siebenen in der mittleren Reihe sind der Jackpot mit eigener Lichtshow und Klang.",
  },
  "fruit-slot-2": {
    name: "Fruchtwalzen II",
    subtitle: "Tropisches Fruchtthema, 5 Gewinnlinien",
    rules:
      "Gleicher Mechanismus mit 3 Walzen und 5 Gewinnlinien wie Fruchtwalzen I, mit tropischem Thema — ein Diamant ersetzt die Glückssieben als Jackpot-Symbol, zusammen mit Erdbeere, Ananas, Banane, Pfirsich und Kirsche. Drei gleiche Symbole auf einer beliebigen Gewinnlinie zahlen nach Tabelle, vom Diamant mit 100x bis zur Kirsche mit 4x; drei Diamanten in der mittleren Reihe sind der Jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Klassik V (Glückssieben-Bonus)",
    subtitle: "Glückssieben-Bonusrunde mit Multiplikator",
    rules:
      "Gleicher Drehmechanismus wie Little Mary Klassik, mit Einsätzen auf 8 Symbolen gleichzeitig. Drei Ziffernwalzen in der Mitte drehen sich normalerweise rein dekorativ; bei einem Gewinn besteht die Chance, eine Bonusrunde auszulösen, bei der die drei Walzen einzeln stoppen. Auf drei gleichen ungeraden Ziffern zu landen verdoppelt euren Gewinn um 10x, drei gleiche gerade Ziffern um 5x – ein seltener Zufallsbonus, der nicht immer ausgelöst wird.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Klassik IV (Glückssieben-Bonus, Festlich)",
    subtitle: "Glückssieben-Bonus mit festlichem Thema",
    rules:
      "Gleicher Mechanismus wie die Glückssieben-Bonus-Edition, mit festlichem Thema (rotes Umschlag, Goldbarren, Laterne, Mandarine, Mondkuchen, Feuerwerk, Kirsche). Die Bonusrunde und die 10x/5x-Ziffernübereinstimmungs-Multiplikatoren funktionieren identisch, mit festlichen Farben und Soundeffekten.",
  },
  "xiangqi-mahjong": {
    name: "Xiangqi-Mahjong",
    subtitle: "Bildet Sets aus Schachfiguren, rennt gegen den Computer zum Gewinnen",
    rules:
      "Setzt einen Einsatz, dann zieht ihr und der Computer jeweils 5 chinesische Schachfiguren. An eurem Zug zieht eine Figur – vervollständigt sie ein Paar plus ein Set (eine Folge oder ein Drilling), gewinnt ihr durch Selbstzug. Wenn nicht, legt eine eurer 6 Figuren ab. Vervollständigt der Ablage des Computers eure Hand, könnt ihr sie zum Gewinnen beanspruchen oder passen und weiterziehen. Auszahlungen: 2x für gemischtes Paar-und-Folge, 3x für gleichfarbiges Paar-und-Folge, 5x für fünf Soldaten oder Bauern; das Beanspruchen einer Ablage zahlt nach gelisteter Rate, der Selbstzug fügt einen Bonus hinzu. Ist das Deck ohne Gewinner aufgebraucht, werden die Einsätze zurückerstattet.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Zylinder Schieben)",
    subtitle: "Mahjong-Stein-Pai-Gow an drei Positionen gleichzeitig",
    rules:
      "Nutzt Mahjong-Kreissteine von 1 bis 9 (je 4) plus leere Steine (4, im Wert eines halben Punktes), um ein 40-Stein-Deck darzustellen. Setzt auf die Positionen Kopf, Himmel und Schwanz, dann decken der Dealer und jede Position 2 Steine zum Vergleich auf. Rangfolge: doppelter Leerstein (höchster) schlägt jedes Paar, das schlägt eine 2-8-Kombination, die schlägt eine normale Punktesumme (Summe der Ziffern, letzte Ziffer zählt, Leer = 0,5, 9,5 ist die beste normale Summe, 0 die niedrigste). Jede Position wird separat mit dem Dealer verglichen – ein Sieg zahlt 1x, Paare zahlen 4x und doppelter Leerstein zahlt 10x; gleiche Summen begünstigen den Dealer nach Hausregel.",
  },
}

const it: GameTable = {
  xiangqi: {
    name: "Scacchi Cinesi",
    subtitle: "IA Solo／2 Giocatori",
    rules:
      "Muovete i pezzi a turno; il primo che metteinscacco matto il generale avversario senza via di fuga vince. Segue le regole tradizionali dello Xiangqi: il carro va dritto, il cavallo a L, l'elefante in diagonale nel proprio territorio, il consigliere in diagonale vicino al palazzo, il soldato può muoversi lateralmente dopo aver attraversato il fiume.",
  },
  "darkchess-classic": {
    name: "Scacchi Nascosti (Classico)",
    subtitle: "IA Solo／2 Giocatori",
    rules: "Tutti i pezzi iniziano coperti. Scoprendoli si catturano secondo l'ordine tradizionale dei ranghi. Catturare tutti i pezzi avversari o lasciarlo senza mosse fa vincere.",
  },
  "darkchess-variant": {
    name: "Scacchi Nascosti (Variante)",
    subtitle: "IA Solo／2 Giocatori",
    rules: "Come la versione classica, ma l'attacco e la cattura a salto del cannone seguono regole variante, aggiungendo nuove tattiche.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Posizionate pietre nere e bianche a turno sulle intersezioni di una griglia 19×19; chi controlla più territorio vince. Le pietre completamente circondate senza libertà vengono capturate.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Posizionate pietre a turno; il primo che allinea cinque pietre in orizzontale, verticale o diagonale vince." },
  othello: {
    name: "Othello",
    subtitle: "Standard",
    rules: "Posizionate pedine a turno; le pedine avversarie intrappolate si girano nel vostro colore. Alla fine chi ha più pedine vince.",
  },
  mahjong: {
    name: "Mahjong Cinese",
    subtitle: "IA Solo (3 Computer)",
    rules: "Giocate a un tavolo con tre avversari controllati dal computer, pescate e scartate tessere a turno, potete rivendicare gli scarti con Chow／Pong／Kong. Chi completa prima una mano vincente valida vince.",
  },
  luzhanqi: {
    name: "Luzhanqi (Scacchi Militari)",
    subtitle: "IA Solo／2 Giocatori",
    rules: "Il rango dei pezzi di entrambe le parti è segreto; l'avversario vede solo il retro. Le battaglie si decidono per rango; chi cattura prima la bandiera nemica o lascia l'avversario senza mosse vince.",
  },
  checkers: {
    name: "Dama",
    subtitle: "Standard",
    rules: "Muovete i pezzi in diagonale a turno; potete saltare per catturare i pezzi avversari. Catturare tutti i pezzi avversari o lasciarlo senza mosse fa vincere.",
  },
  tictactoe: {
    name: "Tris",
    subtitle: "Formato Ampliato 3×3",
    rules: "Posizionate simboli a turno; il primo che allinea tre simboli in orizzontale, verticale o diagonale vince.",
  },
  sevens: {
    name: "Gioco dei Sette",
    subtitle: "4 giocatori, sequenza di carte, punteggio più basso tra le carte bloccate vince",
    rules:
      "Inizia con la carta base 5; a turno si giocano carte con numero adiacente. Se non si può giocare, si blocca una carta che sottrae punti; alla fine, chi ha meno punti tra le carte bloccate vince.",
  },
  "sichuan-mahjong": {
    name: "Mahjong del Sichuan (Battaglia all'Ultimo Sangue)",
    subtitle: "Deve mancare un seme, il vincitore continua a giocare",
    rules:
      "Usa solo tre semi; all'inizio bisogna scartare completamente un seme. Chi vince prima si ritira, gli altri continuano finché tre giocatori vincono o le tessere finiscono.",
  },
  "malaysia-mahjong": {
    name: "Mahjong Malese a Tre Giocatori",
    subtitle: "3 giocatori, tessere volanti jolly",
    rules:
      "Partita a tre giocatori in cui il set contiene solo cerchi, tessere d'onore e tessere volanti (jolly), facilitando combinazioni grandi.",
  },
  "mahjong-pengpeng": {
    name: "Peng Peng (Solo Tris)",
    subtitle: "Mahjong semplificato, solo tris senza sequenze",
    rules: "Set semplificato dove si possono formare solo tris (Pong) o pescare, senza sequenze (Chow); si vince con 2 tris e 1 coppia.",
  },
  "mahjong-sevens": {
    name: "Mahjong dei Sette",
    subtitle: "Come il Gioco dei Sette, ma con tessere di mahjong",
    rules:
      "Inizia con i cinque di ogni seme come base; si giocano a turno tessere con numero adiacente, bloccare una tessera sottrae punti.",
  },
  "riichi-mahjong": {
    name: "Mahjong Riichi Giapponese",
    subtitle: "Round Est, Riichi / Dora / Furiten",
    rules:
      "Con una mano chiusa e pronta si può dichiarare Riichi puntando; le tessere Dora aggiungono punti bonus; in Furiten non si può vincere con una tessera già scartata; serve uno Yaku valido per vincere.",
  },
  "mahjong-solitaire": {
    name: "Solitario Mahjong",
    subtitle: "Trova coppie identiche, collega con max. 2 curve",
    rules:
      "Trova due tessere identiche collegabili con non più di due curve di linea per eliminarle; svuota il tabellone prima che finisca il tempo per vincere.",
  },
  "merge-2048": {
    name: "Fusione 2048",
    subtitle: "Scorri per fondere i numeri, raggiungi 2048",
    rules: "Scorri su, giù, sinistra o destra; numeri uguali si fondono e raddoppiano scontrandosi. Raggiungi 2048 per vincere.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Fondi edifici, da un prato a un grattacielo",
    rules: "Stesso gioco di 2048, ma i numeri sono edifici; fondi progressivamente da un prato a un grattacielo.",
  },
  "merge-2048-undo": {
    name: "2048 con Annulla",
    subtitle: "Fondi numeri con opzione di annullamento",
    rules: "Come 2048, ma con funzione di annullamento: se scorri nella direzione sbagliata, puoi tornare indietro e riprovare.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Fondi edifici, attenzione agli orsi",
    rules:
      "Su una griglia 6x6, fondi tre oggetti identici per potenziarli; gli orsi si muovono e ostacolano, ma possono essere circondati per diventare lapidi fondibili.",
  },
  suika: {
    name: "Suika Game (Fusione di Angurie)",
    subtitle: "Sposta e lascia cadere frutti, quelli uguali si fondono e crescono",
    rules:
      "Sposta a sinistra o destra per scegliere dove far cadere il frutto; frutti uguali che si toccano si fondono in uno più grande, con l'anguria come obiettivo finale.",
  },
  "drop-2048": {
    name: "2048 a Caduta",
    subtitle: "Blocchi numerici cadono e si accumulano, fondi per raddoppiare",
    rules: "Blocchi numerici cadono dall'alto; spostali lateralmente per scegliere la posizione, accumulando numeri uguali si fondono e raddoppiano.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Coppie di gelatine cadono, 4 o più dello stesso colore eliminano",
    rules: "Coppie di gelatine colorate cadono e possono essere spostate e ruotate; collega 4 o più dello stesso colore per eliminarle e concatenare combo.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Capsule cadono e si accumulano, allinea per eliminare i virus",
    rules: "Capsule a due colori cadono e si accumulano; allinea lo stesso colore per eliminare i virus, elimina tutti i virus per superare il livello.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Alterna tra due classici di caduta ed eliminazione",
    rules: "Puoi alternare tra Columns (collega gemme dello stesso colore) e Tetris (completa una riga per eliminarla).",
  },
  "candy-crush": {
    name: "Candy Crush Saga",
    subtitle: "Scambia caramelle in fila da 3, raggiungi il punteggio obiettivo",
    rules:
      "Scambia caramelle adiacenti per formare file da 3; le caramelle speciali sono potenti, raggiungi il punteggio obiettivo entro il limite di mosse.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Il pioniere dei match-3, scambia gemme",
    rules: "Scambia gemme adiacenti per formare file dello stesso colore ed eliminarle; accumula punti continuamente per superare il tuo record.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Guadagna monete con il match-3, restaura il giardino abbandonato",
    rules: "Guadagna monete combinando tessere in fila da 3; usa le monete per completare i compiti di restauro del giardino.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Guadagna monete con il match-3, arreda la villa dei sogni",
    rules: "Guadagna monete combinando tessere in fila da 3; usa le monete per completare i compiti di arredamento della villa.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Guadagna monete con il match-3, restaura l'antico castello",
    rules: "Guadagna monete combinando tessere in fila da 3; usa le monete per completare i compiti di restauro del castello.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Match-3 di gemme + battaglia a carte con progressione",
    rules: "Combinando gemme, gli alleati dell'elemento corrispondente attaccano i nemici; sconfiggi i nemici per salire di livello e avanzare.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Match-3 di gemme + battaglia con vantaggi elementali",
    rules: "Combina gemme per attaccare; sfrutta i vantaggi elementali per infliggere più danni e sconfiggere i nemici.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Match-3 di gemme + costruzione semplificata e PvP",
    rules:
      "Combina gemme per far attaccare i tuoi eroi; sconfiggi i rivali per ottenere materiali da costruzione ed espandere il tuo impero passo dopo passo.",
  },
  "sheep-sheep": {
    name: "Pecora dopo Pecora",
    subtitle: "Tocca tessere accumulate e raccogli finché non ne hai 3 uguali",
    rules:
      "Tocca le tessere non bloccate per inviarle al vassoio di raccolta; raccogli 3 uguali per eliminarle, se il vassoio si riempie senza completare, perdi.",
  },
  match3d: {
    name: "Eliminazione 3D",
    subtitle: "Pila di oggetti 3D, tocca e raccogli in trio",
    rules: "Stesso gioco di Pecora dopo Pecora, ma con una pila di oggetti tridimensionali da cercare e raccogliere in trio.",
  },
  "balls-merge": {
    name: "Fusione di Palle",
    subtitle: "Sposta lateralmente e lascia cadere, palle uguali si fondono e crescono",
    rules: "Stesso gioco di Suika Game, tema palle; palle uguali si fondono in una più grande.",
  },
  "cookies-merge": {
    name: "Fusione di Biscotti",
    subtitle: "Sposta lateralmente e lascia cadere, biscotti uguali si fondono e crescono",
    rules: "Stesso gioco di Suika Game, tema biscotti; biscotti uguali si fondono in uno più grande.",
  },
  "planets-merge": {
    name: "Fusione di Pianeti",
    subtitle: "Sposta lateralmente e lascia cadere, pianeti uguali si fondono e crescono",
    rules: "Stesso gioco di Suika Game, tema pianeti; pianeti uguali si fondono in uno più grande.",
  },
  "mahjong-ninepoint5": {
    name: "Nove e Mezzo di Mahjong",
    subtitle: "Tessere di mahjong che simulano carte, avvicinati a 9,5",
    rules: "Usa tessere di mahjong invece delle carte; chiedi altre tessere o fermati, vince chi si avvicina più a 9,5 senza superarlo.",
  },
  "mahjong-niuniu": {
    name: "Niu Niu di Mahjong",
    subtitle: "Tessere di mahjong che simulano carte, forma 10 e confronta",
    rules: "Usa tessere di mahjong invece delle carte; di 5 tessere, 3 devono formare un multiplo di 10, le altre 2 si confrontano per punti.",
  },
  "dragon-gate": {
    name: "Porta del Dragone",
    subtitle: "Tessere a cerchi di mahjong, indovina maggiore o minore",
    rules:
      "Due tessere a cerchi vengono rivelate come porta; dopo aver puntato, viene rivelata una terza — dentro l'intervallo vinci, fuori perdi, e al limite si paga il doppio.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Contro il banco, avvicinati a 21",
    rules:
      "Avvicinati a 21 senza superarlo. L'Asso vale 1 o 11, le figure valgono 10. Scegli Carta o Stai — il banco deve continuare a pescare finché non raggiunge 17 o più.",
  },
  baccarat: {
    name: "Baccarat",
    subtitle: "Player／Banker／Tie",
    rules:
      "Punta su Player, Banker o Tie prima che le carte vengano distribuite. Il totale usa l'ultima cifra della somma; il totale più alto vince. Carte extra vengono pescate automaticamente secondo le regole standard del baccarat.",
  },
  "ten-half": {
    name: "Dieci e Mezzo",
    subtitle: "Avvicinati a 10,5 più del banco",
    rules:
      "Punta, poi entrambe le parti ricevono 2 carte. Scegli Carta o Stai — chi si avvicina più a 10,5 senza superarlo vince. L'Asso vale 1 punto, le figure 0,5 punti. Un 10,5 naturale alla distribuzione paga 3x; una vittoria normale paga 2x; un pareggio restituisce la puntata.",
  },
  "thirteen-water": {
    name: "Tredici Carte",
    subtitle: "Dividi 13 carte in 3 mani contro il banco",
    rules:
      "Punta e distribuisci. Il sistema organizza automaticamente le tue 13 carte e quelle del banco in una mano anteriore di 3 carte, una centrale di 5 e una posteriore di 5, confrontate separatamente. Vincere tutte le 3 mani paga 5x, vincerne 2 paga 2x, vincerne 1 paga 1,5x, un pareggio non paga né perde, e perdere più di quanto si vince costa la puntata.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Gioca carte singole o coppie per svuotare prima la mano",
    rules:
      "Punta e gioca contro il banco. Gioca una carta singola o una coppia dello stesso valore più forte dell'ultima giocata, oppure passa. L'ordine va dal 3 (più debole) al 2 (più forte), il seme decide i pareggi. Svuota prima le tue 13 carte per vincere 2x la tua puntata.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Confronta 5 carte direttamente contro il banco",
    rules:
      "Punta, poi tu e il banco ricevete 5 carte ciascuno e confrontate direttamente il rango — scala reale, poker, full, colore, scala, tris, doppia coppia, coppia, carta alta. La mano più forte vince 2x; un pareggio restituisce la puntata.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "Forma multipli di 10 da 5 carte per il miglior punteggio toro",
    rules:
      "Punta, poi tu e il banco ricevete 5 carte ciascuno. Scegli 3 carte la cui somma è un multiplo di 10 (un «toro»); l'ultima cifra delle 2 carte rimanenti è il tuo punteggio, più alto è meglio. Un 10 esatto è la mano «Toro Toro» più alta; nessuna combinazione valida è «Senza Toro», la più bassa. Il punteggio più alto vince 2x; un pareggio restituisce la puntata. Le figure valgono 10, l'Asso vale 1.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Confronta 3 carte direttamente contro il banco",
    rules:
      "Punta, poi tu e il banco ricevete 3 carte ciascuno e confrontate direttamente il rango — tris, scala reale, colore, scala, coppia, carta alta. La mano più forte vince 2x; un pareggio restituisce la puntata.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 turni di distribuzione — abbandona o raddoppia a ogni fase",
    rules:
      "Imposta la puntata iniziale. Le carte vengono distribuite in 4 fasi (3, poi 2, poi 1, poi le ultime 2 rivelate), e dopo ogni fase puoi abbandonare o raddoppiare la puntata. La migliore mano di 5 carte tra le tue 7 decide il risultato. Abbandonare fa perdere la puntata totale attuale; vincere paga secondo il rango, da scala reale a 150x fino a doppia coppia a 1x.",
  },
  chess: {
    name: "Scacchi",
    subtitle: "IA Solo／2 Giocatori",
    rules:
      "Muovete i pezzi a turno; il primo che dà scacco matto al re avversario vince. Segue le regole standard degli scacchi per il movimento di pedoni, torri, cavalli, alfieri, regina e re.",
  },
  connect4: {
    name: "Forza 4",
    subtitle: "IA Solo／2 Giocatori",
    rules: "Lasciate cadere a turno i gettoni in una griglia verticale. Il primo che allinea quattro gettoni in orizzontale, verticale o diagonale vince.",
  },
  "chinese-checkers": {
    name: "Dama Cinese",
    subtitle: "Tavola a Stella",
    rules:
      "Su una tavola a forma di stella a sei punte, sposta prima tutte le tue pedine nell'angolo opposto per vincere. Le pedine possono avanzare di un passo o saltare in catena su altre pedine per procedere.",
  },
  jigsaw: {
    name: "Puzzle Scorrevole",
    subtitle: "Tessere Numerate",
    rules: "Tocca la tessera vicino allo spazio vuoto per farla scorrere. Ordina le tessere da 1 a 15 in sequenza per completare la sfida.",
  },
  "number-merge": {
    name: "Fusione di Numeri",
    subtitle: "Stile 2048",
    rules: "Scorri o usa i tasti direzionali. Le tessere con lo stesso numero si fondono e raddoppiano di valore quando si urtano; raggiungi 2048 per vincere.",
  },
  "memory-match": {
    name: "Memory",
    subtitle: "Sfida di Abbinamento",
    rules: "Scopri due carte alla volta; le coppie corrispondenti restano aperte. Trova tutte le coppie con il minor numero di tentativi per vincere.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Giocatori",
    rules: "Lancia il dado per muovere la tua pedina intorno al tabellone finché non torna a casa. Fermarsi sulla pedina avversaria la rimanda alla partenza.",
  },
  solitaire: {
    name: "Solitario",
    subtitle: "Classico Solo",
    rules: "Ordina tutte le carte sulle quattro pile base per seme e in ordine crescente per liberare il tabellone e vincere.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Ramino di Tessere contro IA",
    rules: "Usa le tue tessere numerate per formare scale o gruppi dello stesso numero, poi posizionale sul tavolo. Esaurisci prima tutte le tue tessere per vincere.",
  },
  "rps-battle": {
    name: "Carta, Forbice, Sasso",
    subtitle: "contro IA",
    rules: "Lancia sasso, carta o forbice contro il computer simultaneamente. Chi vince più round vince la partita.",
  },
  "texas-holdem": {
    name: "Texas Hold'em",
    subtitle: "1 contro 1 vs IA (Semplificato)",
    rules:
      "Tu e l'IA avete 2 carte ciascuno, più 5 carte comuni condivise. Scegli Call per scoprire la mano, o Fold per ritirarti — la mano con il rango più alto vince il piatto.",
  },
  war: {
    name: "Guerra",
    subtitle: "Carta Più Alta vs IA",
    rules:
      "Le carte vengono distribuite equamente. In ogni round entrambe le parti rivelano una carta — la più alta vince il round. Un pareggio scatena una battaglia extra; chi ha più carte alla fine vince.",
  },
  "three-card-poker": {
    name: "Three Card Poker",
    subtitle: "contro il Banco",
    rules:
      "Tu e il banco ricevete 3 carte ciascuno. Dopo aver visto la mano, Call per scoprire e confrontare, o Fold per ritirarti dal round — la mano con il rango più alto vince.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Puzzle di Blocchi Scorrevoli",
    rules: "Fai scorrere blocchi di varie dimensioni in uno spazio limitato del tabellone. Sposta il blocco più grande verso l'uscita in basso per vincere.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "Ordina ed Elimina Righe",
    rules:
      "Scorri a sinistra o destra per muovere il blocco che cade, tocca per ruotarlo, scorri verso il basso per farlo cadere velocemente. Completa una riga per eliminarla e guadagnare punti; la partita termina se la pila raggiunge la cima.",
  },
  "bubble-shooter": {
    name: "Bubble Shooter",
    subtitle: "Combina i Colori per Eliminare",
    rules: "Tocca una direzione per sparare la bolla attuale. Tre o più bolle dello stesso colore collegate vengono eliminate e danno punti; la partita termina se le bolle raggiungono la cima.",
  },
  match3: {
    name: "Match-3 Blast",
    subtitle: "Scambia per Combinare",
    rules:
      "Tocca una tessera, poi tocca una tessera vicina per scambiarle. Combinare 3 o più dello stesso colore le elimina e riempie dall'alto, il che può scatenare combo a catena.",
  },
  hanoi: {
    name: "Torre di Hanoi",
    subtitle: "Sposta i Dischi",
    rules:
      "Tocca una torre per prendere il disco in alto, poi tocca un'altra torre per spostarlo. Un disco grande non può stare sopra uno piccolo — sposta tutta la pila alla torre più a destra per vincere.",
  },
  "water-sort": {
    name: "Puzzle di Smistamento Acqua",
    subtitle: "Versa per Ordinare i Colori",
    rules:
      "Tocca un tubo per prendere il colore in alto, poi tocca un altro tubo per versarlo — solo in un tubo vuoto o con lo stesso colore sopra. Ordina ogni tubo in un solo colore per vincere.",
  },
  "pipe-connect": {
    name: "Pipe Connect",
    subtitle: "Ruota per Connettere",
    rules: "Tocca una tessera di tubo per ruotarla di 90°. Collega la fonte d'acqua in alto a sinistra fino all'uscita in basso a destra per vincere.",
  },
  "stack-tower": {
    name: "Stack Tower",
    subtitle: "Calcola il Momento della Caduta",
    rules:
      "Il blocco superiore si muove a sinistra e a destra; tocca per farlo cadere sulla pila sottostante. Meno sovrapposizione c'è, più stretto è il blocco — mancare completamente la pila termina la partita.",
  },
  "sequence-sort": {
    name: "Sort Master",
    subtitle: "Scambia per Ordinare",
    rules: "Tocca due tessere numerate per scambiare la loro posizione. Ordina tutti i numeri dal più piccolo al più grande con il minor numero di scambi per vincere.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "Griglia 6×6",
    rules:
      "Ogni riga, colonna e riquadro 2×3 deve contenere i numeri da 1 a 6 senza ripetizioni. Riempi tutta la griglia senza conflitti per vincere.",
  },
  "shooting-range": {
    name: "Galleria di Tiro",
    subtitle: "Obiettivi a Riflessi Rapidi",
    rules: "I bersagli si illuminano casualmente su tutta la griglia — tocca il più velocemente possibile per guadagnare punti. Raggiungi il punteggio obiettivo prima che il tempo finisca per vincere.",
  },
  "space-invaders": {
    name: "Space Invaders",
    subtitle: "Elimina Tutta la Flotta per Vincere",
    rules:
      "Muoviti a sinistra e a destra per evitare i colpi nemici e abbattere tutta la flotta aliena. La sfida fallisce se la flotta si avvicina troppo o le vite si esauriscono.",
  },
  "tank-battle": {
    name: "Battaglia di Carri",
    subtitle: "Il Primo a Ottenere 3 Colpi Vince",
    rules: "Muovi il tuo carro a sinistra e a destra e spara proiettili. Colpire la corsia dell'avversario dà punti — sii il primo a ottenere 3 colpi per vincere.",
  },
  "brick-breaker": {
    name: "Rompi Mattoni",
    subtitle: "Distruggi Tutti i Mattoni per Vincere",
    rules:
      "Trascina la racchetta a sinistra e a destra per far rimbalzare la palla e distruggere tutti i mattoni per vincere. La palla che cade fa perdere una vita; la sfida fallisce se le vite si esauriscono.",
  },
  "zombie-defense": {
    name: "Difesa dagli Zombie",
    subtitle: "Sopravvivi a Ogni Ondata per Vincere",
    rules:
      "Gli zombie avanzano sulla corsia da destra; tocca per distruggerli (alcuni richiedono due tocchi). Lasciare che uno raggiunga il bordo sinistro costa una vita — sopravvivi a ogni ondata per vincere.",
  },
  "air-combat": {
    name: "Combattimento Aereo",
    subtitle: "Sopravvivi e Raggiungi il Punteggio Obiettivo",
    rules:
      "Il tuo jet da combattimento spara automaticamente; muoviti a sinistra e a destra per evitare gli aerei nemici ed eliminarli. Sopravvivi fino al limite di tempo raggiungendo il punteggio obiettivo per vincere; se le vite si esauriscono la sfida fallisce.",
  },
  billiards: {
    name: "Biliardo",
    subtitle: "Trascina per Mirare, Imbuca Tutte le Palle",
    rules:
      "Trascina all'indietro dalla palla bianca per mirare, poi rilascia per colpire. Imbuca tutte le palle colorate prima che i tentativi si esauriscano per vincere.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "Raggiungi l'Obiettivo di Birilli in 3 Turni",
    rules: "Trascina il cursore per impostare l'angolo di lancio, poi rilascia per lanciare. Raggiungi il totale obiettivo di birilli abbattuti in 3 turni per vincere.",
  },
  "basketball-shoot": {
    name: "Tiri a Basket",
    subtitle: "Calcola il Momento del Tiro",
    rules: "Il misuratore di potenza si muove automaticamente avanti e indietro — tocca per tirare quando è vicino al centro per segnare. Segna abbastanza canestri per vincere.",
  },
  "penalty-kick": {
    name: "Calcio di Rigore",
    subtitle: "Scegli il Lato contro il Portiere",
    rules: "Scegli sinistra, centro o destra per tirare contro un portiere che si tuffa a caso. Segna abbastanza gol in 5 round per vincere.",
  },
  racing: {
    name: "Racing Rush",
    subtitle: "Cambia Corsia per Evitare il Traffico",
    rules: "Cambia corsia a sinistra e a destra per evitare il traffico in arrivo. La sfida fallisce se le vite si esauriscono prima di raggiungere la distanza del traguardo.",
  },
  parking: {
    name: "Sfida di Parcheggio",
    subtitle: "Parcheggia entro il Limite di Mosse",
    rules: "Usa lo sterzo e l'avanzamento per parcheggiare esattamente nel punto segnato prima che le mosse si esauriscano o tu urti qualcosa per vincere.",
  },
  motocross: {
    name: "Salto Motocross",
    subtitle: "Salta le Buche fino al Traguardo",
    rules: "Tocca per far saltare la tua moto e superare le buche davanti con il tempismo giusto. La sfida fallisce se le vite si esauriscono prima di raggiungere il traguardo.",
  },
  "drift-racing": {
    name: "Drift Racing",
    subtitle: "Controlla le Curve per il Punteggio",
    rules: "Controlla secondo le curve del circuito per rimanere in pista mentre accumuli punti drift. Raggiungi il traguardo con punti sufficienti per vincere.",
  },
  "duel-arena": {
    name: "Duel Arena",
    subtitle: "A Turni, il Primo KO Vince",
    rules:
      "Scegli Attack per riempire il misuratore speciale, Guard per ridurre a metà il prossimo attacco, o rilascia il Finisher quando il misuratore è pieno. Sii il primo a portare a zero la vita dell'avversario per vincere.",
  },
  bridge: {
    name: "Bridge",
    subtitle: "Fai squadra contro due avversari controllati dal computer",
    rules:
      "Tu e il tuo compagno Nord giocate contro Ovest ed Est, entrambi controllati dal computer. In ogni mano, i quattro giocatori giocano a turno e devono seguire il seme se possibile; altrimenti possono giocare qualsiasi seme o briscola. La carta più alta del seme di apertura, o la briscola più alta, vince la mano. Dopo tutte le 13 mani, vincere 7 o più mani come squadra vince la partita.",
  },
  "pick-red-points": {
    name: "Raccogli Punti Rossi",
    subtitle: "Abbina la carta giocata a una sul tavolo",
    rules:
      "Gioca una carta a turno: se il suo valore corrisponde a una carta sul tavolo, raccogli tutte le carte di quel valore più la tua carta giocata per guadagnare punti. Se non corrisponde, resta sul tavolo. Quando il mazzo si esaurisce, confronta i cuori/quadri rossi raccolti da ciascuna parte — le carte rosse normali valgono 1 punto, i 10, Fante, Regina e Re rossi valgono 10 punti ciascuno. Il totale più alto vince.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu (Lotta contro il Latifondista)",
    subtitle: "Latifondista contro due Contadini",
    rules:
      "Dopo la distribuzione, il sistema assegna un Latifondista (tu o il computer) in base alla forza della mano — il Latifondista riceve 3 carte nascoste extra, e gli altri due diventano Contadini che si alleano contro di lui. Gioca a turno combinazioni più forti dell'ultima, o passa se non puoi. Il Latifondista vince se svuota prima la mano; qualsiasi Contadino che finisce prima vince per i Contadini.",
  },
  "liars-cards": {
    name: "Carte del Mentitore",
    subtitle: "Gioca a faccia in giù, annuncia il valore, indovina la menzogna",
    rules:
      "Tu e due avversari controllati dal computer giocate a turno: posiziona 1-4 carte a faccia in giù e annuncia un valore (i valori devono seguire il ciclo A→2→3→...→K→A, e puoi dire la verità o mentire). Gli altri giocatori possono Credere e passare il turno, o Sfidare la menzogna scoprendo le carte per verificare — una sfida corretta fa raccogliere chi ha giocato le carte tutto il mazzo del tavolo, una sfida errata fa raccogliere lo sfidante. Il primo a svuotare la mano senza essere scoperto a mentire vince.",
  },
  "five-pk": {
    name: "Poker a 5 Carte",
    subtitle: "Un cambio, poi confronta le mani con opzione raddoppio",
    rules:
      "Punta, poi vengono distribuite 5 carte (ci sono 2 jolly nel mazzo). Mantieni le carte che vuoi e cambia una volta il resto. Le mani pagano secondo il rango — scala reale 500x, poker 200x, scala reale semplice 120x, fino a doppia coppia 1x. Dopo aver vinto, puoi raddoppiare o niente puntando su maggiore/minore o rosso/nero, oppure incassare in qualsiasi momento.",
  },
  "little-mary": {
    name: "Little Mary Classico",
    subtitle: "Cornice luminosa rotante — punta su carte grandi o piccole",
    rules:
      "Punta su ogni simbolo, poi inizia. La cornice luminosa gira velocemente per 3 giri, poi rallenta per fermarsi tra mezzo giro e un giro e mezzo — tocca Stop per fermarla prima. Fermarsi sulla freccia fa perdere; fermarsi sul simbolo di giro gratuito dà una ripetizione gratuita; i simboli fissi pagano un multiplo fisso; i simboli di carta grande o piccola pagano secondo il moltiplicatore corrente se hai puntato su quel simbolo. Dopo abbastanza giri, può attivarsi un round bonus con un pagamento fisso più alto e un suono caratteristico.",
  },
  "little-mary-2": {
    name: "Little Mary Classico II",
    subtitle: "Cornice luminosa rotante a tema sportivo",
    rules:
      "Stesso meccanismo di rotazione di Little Mary Classico, con tema sportivo (calcio, rugby, basket, bowling, tennis, tennis da tavolo, golf). Punta su ogni simbolo poi inizia — fermarsi sulla freccia fa perdere, il simbolo gratuito dà una ripetizione gratuita, i simboli fissi pagano un multiplo fisso, e i simboli sportivi grandi o piccoli pagano secondo il moltiplicatore corrente se puntati. Un round bonus può attivarsi dopo abbastanza giri con un pagamento fisso alto.",
  },
  "little-mary-3": {
    name: "Little Mary Classico III",
    subtitle: "Jackpot del dio dei fiori — punta su grande o piccolo",
    rules:
      "Stesso meccanismo di rotazione di Little Mary Classico. Le tre luci del dio dei fiori normalmente lampeggiano indipendentemente; dopo abbastanza giri possono sincronizzarsi in uno stato di allerta lampeggiante. Se il rullo si ferma sul gruppo di simboli grande o piccolo durante questa allerta, tutti e tre i simboli pagano insieme 3x il moltiplicatore corrente — un bonus jackpot raro.",
  },
  "little-mary-4": {
    name: "Little Mary Classico IV",
    subtitle: "Jackpot del dio dei fiori a tema animale",
    rules:
      "Stesso meccanismo dell'edizione Jackpot del Dio dei Fiori, con tema animale (tigre, drago, scimmia, volpe, topo, gallo, pulcino). L'allerta jackpot del dio dei fiori e il pagamento 3x funzionano in modo identico.",
  },
  "little-mary-5": {
    name: "Little Mary Classico III (Fenice)",
    subtitle: "Edizione decorativa fenice — punta su grande o piccolo",
    rules:
      "Stesso meccanismo di rotazione di Little Mary Classico. Una grande fenice al centro è puramente decorativa, lampeggia più velocemente durante l'allerta bonus. Fermarsi su uno dei simboli di giro gratuito dispiega una scia di luce decorativa sulla cornice — solo visivo, non cambia il pagamento.",
  },
  "little-mary-6": {
    name: "Little Mary Classico IV (Fenice)",
    subtitle: "Edizione decorativa fenice — tema bevande",
    rules:
      "Stesso meccanismo dell'edizione Decorativa Fenice, con tema bevande (teiera, miele, tè al mate, ghiaccio grattato, birra, vino, cocktail). Gli effetti decorativi della fenice e la scia di luce funzionano in modo identico.",
  },
  "little-mary-7": {
    name: "Mini Little Mary (Oceano)",
    subtitle: "Cornice mini 8×8 — punta su grande o piccolo",
    rules:
      "Una cornice luminosa 8×8 più piccola (28 posizioni) con lo stesso meccanismo di rotazione, a tema animali marini (squalo, balena, delfino, pesce tropicale, granchio, conchiglia, bolle). Fermarsi sulla freccia fa perdere, il simbolo gratuito dà una ripetizione gratuita, i simboli fissi pagano un multiplo fisso, e i simboli grandi o piccoli pagano secondo il moltiplicatore corrente se puntati. Un round bonus jackpot può attivarsi dopo abbastanza giri.",
  },
  "little-mary-8": {
    name: "Mini Little Mary (Dessert)",
    subtitle: "Cornice mini 8×8 — tema dessert",
    rules:
      "Stesso meccanismo di cornice mini 8×8 dell'edizione Oceano, con tema dessert (torta, torta alle fragole, cupcake, donut, biscotto, caramella, lecca-lecca). Un round bonus jackpot può attivarsi dopo abbastanza giri con un suono caratteristico.",
  },
  "fruit-slot-1": {
    name: "Rulli di Frutta I",
    subtitle: "Rulli classici 3×3, 5 linee di pagamento",
    rules:
      "Una slot di frutta classica a 3 rulli e 3 righe con 5 linee di pagamento (righe superiore, centrale, inferiore più entrambe le diagonali). Punta per linea, poi gira — ogni rullo si ferma indipendentemente da sinistra a destra, e puoi toccare Stop per fermarlo prima. Tre simboli uguali su qualsiasi linea di pagamento pagano secondo la tabella, dal 7 fortunato a 100x fino alla ciliegia a 4x; due o più ciliegie ovunque sullo schermo pagano una piccola consolazione; tre 7 sulla riga centrale è il jackpot con il proprio spettacolo di luci e suono.",
  },
  "fruit-slot-2": {
    name: "Rulli di Frutta II",
    subtitle: "Tema frutta tropicale, 5 linee di pagamento",
    rules:
      "Stesso meccanismo a 3 rulli e 5 linee di pagamento di Rulli di Frutta I, con tema tropicale — un diamante sostituisce il 7 fortunato come simbolo jackpot, insieme a fragola, ananas, banana, pesca e ciliegia. Tre simboli uguali su qualsiasi linea di pagamento pagano secondo la tabella, dal diamante a 100x fino alla ciliegia a 4x; tre diamanti sulla riga centrale è il jackpot.",
  },
  "little-mary-bonus": {
    name: "Little Mary Classico V (Bonus Sette Fortunato)",
    subtitle: "Round bonus moltiplicatore di sette fortunati",
    rules:
      "Stesso meccanismo di rotazione di Little Mary Classico, con puntate su 8 simboli contemporaneamente. Tre rulli di cifre al centro normalmente girano in modo puramente decorativo; quando si vince c'è la possibilità di attivare un round bonus dove i tre rulli si fermano uno per uno. Fermarsi su tre cifre dispari uguali moltiplica la tua vincita per 10x, tre cifre pari uguali per 5x — un bonus casuale raro che non si attiva sempre.",
  },
  "little-mary-bonus-2": {
    name: "Little Mary Classico IV (Bonus Sette Fortunato, Festivo)",
    subtitle: "Bonus sette fortunati a tema festivo",
    rules:
      "Stesso meccanismo dell'edizione Bonus Sette Fortunato, con tema festivo (busta rossa, lingotto d'oro, lanterna, mandarino, torta di luna, fuochi d'artificio, ciliegia). Il round bonus e i moltiplicatori di corrispondenza cifre 10x/5x funzionano in modo identico, con colori ed effetti sonori festivi.",
  },
  "xiangqi-mahjong": {
    name: "Mahjong Xiangqi",
    subtitle: "Forma set da pezzi degli scacchi, corri contro il computer per vincere",
    rules:
      "Punta, poi tu e il computer pescate 5 pezzi di scacchi cinesi ciascuno. Al tuo turno, pesca un pezzo — se completa una coppia più un set (una sequenza o un tris), vinci per pescata propria. Altrimenti, scarta uno dei tuoi 6 pezzi. Se lo scarto del computer completa la tua mano, puoi richiederlo per vincere, o passare e continuare a pescare. Pagamenti: 2x per coppia-sequenza mista, 3x per coppia-sequenza dello stesso seme, 5x per cinque soldati o pedoni; richiedere uno scarto paga secondo la tariffa indicata, la pescata propria aggiunge un bonus. Se il mazzo si esaurisce senza vincitore, le puntate vengono restituite.",
  },
  tuitongzai: {
    name: "Tui Tong Zai (Spingi Cilindro)",
    subtitle: "Pai gow con tessere mahjong in tre posizioni contemporaneamente",
    rules:
      "Usa tessere a cerchi mahjong da 1 a 9 (4 ciascuna) più tessere vuote (4, con valore di mezzo punto) per rappresentare un mazzo di 40 tessere. Punta sulle posizioni testa, cielo e coda, poi il banco e ogni posizione scoprono 2 tessere per confrontare. Ordine di rango: vuoto doppio (il più alto) batte qualsiasi coppia, che batte una combinazione 2-8, che batte un totale di punti normale (somma delle cifre, conta l'ultima cifra, vuoto = 0,5, 9,5 è il miglior totale normale, 0 il più basso). Ogni posizione viene confrontata con il banco separatamente — una vittoria paga 1x, le coppie pagano 4x e il vuoto doppio paga 10x; totali uguali favoriscono il banco secondo la regola della casa.",
  },
}

const ru: GameTable = {
  xiangqi: {
    name: "Китайские шахматы",
    subtitle: "ИИ Соло／2 Игрока",
    rules:
      "По очереди двигайте фигуры; кто первым поставит генерала противника в безвыходное положение, победит. Следует традиционным правилам Сянци: колесница ходит прямо, конь буквой Г, слон по диагонали на своей территории, советник по диагонали возле дворца, солдат может ходить в сторону после пересечения реки.",
  },
  "darkchess-classic": {
    name: "Тёмные шахматы (Классика)",
    subtitle: "ИИ Соло／2 Игрока",
    rules: "Все фигуры начинаются лицом вниз. После открытия фигуры бьют по традиционному порядку рангов. Победа — съесть все фигуры противника или лишить его ходов.",
  },
  "darkchess-variant": {
    name: "Тёмные шахматы (Вариант)",
    subtitle: "ИИ Соло／2 Игрока",
    rules: "Как классика, но атака и прыжковое взятие пушки следуют вариантным правилам, добавляя новую тактику.",
  },
  go: {
    name: "Го",
    subtitle: "19×19",
    rules: "По очереди ставьте чёрные и белые камни на пересечения доски 19×19; кто контролирует больше территории, побеждает. Камни, полностью окружённые без «дыхания», захватываются.",
  },
  gomoku: { name: "Гомоку", subtitle: "17×17", rules: "По очереди ставьте камни; кто первым выстроит пять в ряд по горизонтали, вертикали или диагонали, побеждает." },
  othello: {
    name: "Отелло",
    subtitle: "Стандарт",
    rules: "По очереди ставьте фишки; фишки противника, зажатые между вашими, переворачиваются в ваш цвет. В конце победит тот, у кого больше фишек.",
  },
  mahjong: {
    name: "Китайский маджонг",
    subtitle: "ИИ Соло (3 компьютера)",
    rules: "Играйте за столом с тремя компьютерными соперниками, по очереди берите и сбрасывайте фишки, можно забирать сбросы через Чоу／Пон／Кон. Кто первым соберёт правильную выигрышную комбинацию, победит.",
  },
  luzhanqi: {
    name: "Лучжанци (Военные шахматы)",
    subtitle: "ИИ Соло／2 Игрока",
    rules: "Ранг фигур обеих сторон скрыт; противник видит только заднюю сторону. Битвы решаются по рангу; кто первым захватит флаг противника или лишит его ходов, победит.",
  },
  checkers: {
    name: "Шашки",
    subtitle: "Стандарт",
    rules: "По очереди двигайте фигуры по диагонали; можно перескакивать, чтобы съесть фигуры противника. Победа — съесть все фигуры противника или лишить его ходов.",
  },
  tictactoe: {
    name: "Крестики-нолики",
    subtitle: "Увеличенный формат 3×3",
    rules: "По очереди ставьте символы; кто первым выстроит три в ряд по горизонтали, вертикали или диагонали, победит.",
  },
  sevens: {
    name: "Игра в Семёрки",
    subtitle: "4 игрока, цепочка карт, наименьшее очко блокированных карт выигрывает",
    rules:
      "Начинается с базовой карты 5; по очереди играют карты с соседним номером. Если нет возможности сыграть, блокируют карту, которая вычитает очки; в конце у кого меньше очков в блокированных картах, тот выигрывает.",
  },
  "sichuan-mahjong": {
    name: "Сычуаньский Маджонг (Битва до Конца)",
    subtitle: "Один обязательный недостающий набор, победитель продолжает играть",
    rules:
      "Используются только три набора; в начале нужно полностью отказаться от одного набора. Первый победивший выходит, остальные продолжают, пока не выиграют трое или не закончатся кости.",
  },
  "malaysia-mahjong": {
    name: "Малайзийский Маджонг на Троих",
    subtitle: "3 игрока, летающие кости-джокеры",
    rules:
      "Игра на троих, где набор содержит только круги, почётные кости и летающие кости (джокеры), облегчая составление крупных комбинаций.",
  },
  "mahjong-pengpeng": {
    name: "Пэн Пэн (Только Тройки)",
    subtitle: "Упрощённый маджонг, только тройки без последовательностей",
    rules: "Упрощённый набор, где можно составлять только тройки (Понг) или тянуть, без последовательностей (Чоу); выигрывает с 2 тройками и 1 парой.",
  },
  "mahjong-sevens": {
    name: "Маджонг-Семёрки",
    subtitle: "Как игра в семёрки, но с костями маджонга",
    rules:
      "Начинается с пятёрок каждого набора как основы; по очереди играют кости с соседним номером, блокировка кости вычитает очки.",
  },
  "riichi-mahjong": {
    name: "Японский Риичи-Маджонг",
    subtitle: "Восточный раунд, Риичи / Дора / Фуритен",
    rules:
      "С закрытой готовой рукой можно объявить Риичи, делая ставку; кости Дора добавляют бонусные очки; при Фуритене нельзя выиграть с уже сброшенной костью; для выигрыша нужна действительная комбинация Яку.",
  },
  "mahjong-solitaire": {
    name: "Пасьянс Маджонг",
    subtitle: "Найдите одинаковые пары, соедините не более чем 2 поворотами",
    rules:
      "Найдите две одинаковые кости, соединяемые не более чем двумя поворотами линии, чтобы убрать их; очистите поле до истечения времени, чтобы выиграть.",
  },
  "merge-2048": {
    name: "Слияние 2048",
    subtitle: "Сдвигайте для слияния чисел, достигните 2048",
    rules: "Сдвигайте вверх, вниз, влево или вправо; одинаковые числа при столкновении слипаются и удваиваются. Достигните 2048, чтобы выиграть.",
  },
  "city-2048": {
    name: "City 2048",
    subtitle: "Слияние зданий, от лужайки до небоскрёба",
    rules: "Та же игра, что и 2048, но числа заменены на здания; постепенно слияние от лужайки до небоскрёба.",
  },
  "merge-2048-undo": {
    name: "2048 с Отменой",
    subtitle: "Слияние чисел с функцией отмены",
    rules: "Как 2048, но с функцией отмены: если сдвинули в неправильном направлении, можно вернуться и попробовать снова.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "Слияние зданий, осторожно с медведями",
    rules:
      "На поле 6x6 слияние трёх одинаковых объектов для их улучшения; медведи двигаются и мешают, но их можно окружить, превратив в надгробия для слияния.",
  },
  suika: {
    name: "Suika Game (Слияние Арбузов)",
    subtitle: "Двигайте и бросайте фрукты, одинаковые слипаются и растут",
    rules:
      "Двигайтесь влево или вправо, чтобы выбрать место падения фрукта; одинаковые фрукты при соприкосновении слипаются в больший, с арбузом как конечной целью.",
  },
  "drop-2048": {
    name: "2048 Падение",
    subtitle: "Числовые блоки падают и накапливаются, слияние для удвоения",
    rules: "Числовые блоки падают сверху; двигайте их в стороны, чтобы выбрать позицию, при накоплении одинаковых чисел они слипаются и удваиваются.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Пары желешек падают, 4 или более одного цвета убираются",
    rules: "Пары цветных желешек падают, их можно двигать и вращать; соедините 4 или более одного цвета, чтобы убрать их и создать цепочку комбо.",
  },
  "dr-mario": {
    name: "Dr. Mario",
    subtitle: "Капсулы падают и накапливаются, выстройте в ряд для удаления вирусов",
    rules: "Двухцветные капсулы падают и накапливаются; выстройте одинаковый цвет в ряд, чтобы удалить вирусы, очистите всех вирусов, чтобы пройти уровень.",
  },
  "columns-tetris": {
    name: "Columns / Tetris",
    subtitle: "Переключайтесь между двумя классическими падающими играми",
    rules: "Можно переключаться между Columns (соедините камни одного цвета) и Tetris (заполните ряд, чтобы убрать его).",
  },
  "candy-crush": {
    name: "Candy Crush Saga",
    subtitle: "Меняйте конфеты в ряд по 3, достигните целевого счёта",
    rules:
      "Меняйте соседние конфеты, чтобы составить ряды по 3; особые конфеты очень сильны, достигните целевого счёта в пределах лимита ходов.",
  },
  bejeweled: {
    name: "Bejeweled",
    subtitle: "Пионер игр три-в-ряд, меняйте камни",
    rules: "Меняйте соседние камни, чтобы составить ряды одного цвета и убрать их; непрерывно набирайте очки, чтобы побить свой рекорд.",
  },
  gardenscapes: {
    name: "Gardenscapes",
    subtitle: "Зарабатывайте монеты в три-в-ряд, восстановите заброшенный сад",
    rules: "Зарабатывайте монеты, составляя ряды по 3; используйте монеты, чтобы выполнить задачи по восстановлению сада.",
  },
  homescapes: {
    name: "Homescapes",
    subtitle: "Зарабатывайте монеты в три-в-ряд, украсьте дом мечты",
    rules: "Зарабатывайте монеты, составляя ряды по 3; используйте монеты, чтобы выполнить задачи по украшению особняка.",
  },
  "royal-match": {
    name: "Royal Match",
    subtitle: "Зарабатывайте монеты в три-в-ряд, восстановите старинный замок",
    rules: "Зарабатывайте монеты, составляя ряды по 3; используйте монеты, чтобы выполнить задачи по восстановлению замка.",
  },
  "tower-of-saviors": {
    name: "Tower of Saviors",
    subtitle: "Три-в-ряд камней + карточные бои с развитием",
    rules: "При составлении рядов камней союзники соответствующей стихии атакуют врагов; победа над врагами повышает уровень и продвигает дальше.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Три-в-ряд камней + бои с преимуществами стихий",
    rules: "Составляйте ряды камней для атаки; используйте преимущества стихий для увеличения урона и победы над врагами.",
  },
  "empires-puzzles": {
    name: "Empires & Puzzles",
    subtitle: "Три-в-ряд камней + упрощённое строительство и PvP",
    rules:
      "Составляйте ряды камней, чтобы герои атаковали; победа над противниками даёт строительные материалы для постепенного расширения империи.",
  },
  "sheep-sheep": {
    name: "Овца за Овцой",
    subtitle: "Нажимайте на сложенные плитки и собирайте по 3 одинаковых",
    rules:
      "Нажимайте на незаблокированные плитки, чтобы отправить их в лоток для сбора; соберите 3 одинаковых, чтобы убрать их, если лоток заполнится без завершения, вы проиграете.",
  },
  match3d: {
    name: "3D Устранение",
    subtitle: "Куча 3D-предметов, нажимайте и собирайте по три",
    rules: "Та же игра, что Овца за Овцой, но с кучей трёхмерных предметов для поиска и сбора по три.",
  },
  "balls-merge": {
    name: "Слияние Мячей",
    subtitle: "Двигайте в стороны и бросайте, одинаковые мячи слипаются и растут",
    rules: "Та же игра, что Suika Game, тема мячи; одинаковые мячи слипаются в больший.",
  },
  "cookies-merge": {
    name: "Слияние Печенья",
    subtitle: "Двигайте в стороны и бросайте, одинаковое печенье слипается и растёт",
    rules: "Та же игра, что Suika Game, тема печенье; одинаковое печенье слипается в большее.",
  },
  "planets-merge": {
    name: "Слияние Планет",
    subtitle: "Двигайте в стороны и бросайте, одинаковые планеты слипаются и растут",
    rules: "Та же игра, что Suika Game, тема планеты; одинаковые планеты слипаются в большую.",
  },
  "mahjong-ninepoint5": {
    name: "Маджонг Девять с Половиной",
    subtitle: "Кости маджонга имитируют карты, приблизьтесь к 9,5",
    rules: "Используйте кости маджонга вместо карт; берите ещё кости или остановитесь, выигрывает тот, кто ближе к 9,5 без превышения.",
  },
  "mahjong-niuniu": {
    name: "Маджонг Нью Нью",
    subtitle: "Кости маджонга имитируют карты, составьте 10 и сравните",
    rules: "Используйте кости маджонга вместо карт; из 5 костей 3 должны составить кратное 10, остальные 2 сравниваются по очкам.",
  },
  "dragon-gate": {
    name: "Драконьи Врата",
    subtitle: "Круговые кости маджонга, угадайте больше или меньше",
    rules:
      "Две круговые кости раскрываются как врата; после ставки раскрывается третья — внутри диапазона выигрыш, снаружи проигрыш, а на границе ставка удваивается.",
  },
  blackjack: {
    name: "Блэкджек",
    subtitle: "Против дилера, ближе к 21",
    rules:
      "Приблизьтесь к 21 без превышения. Туз считается как 1 или 11, карты с картинками — 10. Выберите «Взять» или «Остановиться» — дилер должен брать карты, пока не достигнет 17 или больше.",
  },
  baccarat: {
    name: "Баккара",
    subtitle: "Player／Banker／Tie",
    rules:
      "Сделайте ставку на Player, Banker или Tie до раздачи карт. Сумма использует последнюю цифру; большая сумма выигрывает. Дополнительные карты раздаются автоматически по стандартным правилам баккары.",
  },
  "ten-half": {
    name: "Десять с половиной",
    subtitle: "Ближе к 10,5, чем дилер",
    rules:
      "Сделайте ставку, затем обе стороны получают по 2 карты. Выберите «Взять» или «Остановиться» — кто ближе к 10,5 без превышения, выигрывает. Туз — 1 очко, карты с картинками — 0,5 очка. Естественные 10,5 при раздаче выплачивают 3x; обычная победа — 2x; ничья возвращает ставку.",
  },
  "thirteen-water": {
    name: "Тринадцать карт",
    subtitle: "Разделите 13 карт на 3 руки против дилера",
    rules:
      "Сделайте ставку и раздайте карты. Система автоматически распределяет ваши 13 карт и карты дилера на переднюю руку из 3 карт, среднюю из 5 и заднюю из 5, сравниваемые отдельно. Победа во всех 3 руках выплачивает 5x, в 2 — 2x, в 1 — 1,5x, ничья не выплачивает и не забирает, а большее число проигрышей забирает ставку.",
  },
  "big-two": {
    name: "Биг Ту",
    subtitle: "Играйте одиночными картами или парами, чтобы первым опустошить руку",
    rules:
      "Сделайте ставку и играйте против дилера. Сыграйте одиночную карту или пару того же ранга сильнее предыдущего ход, или пропустите. Порядок от 3 (самая слабая) до 2 (самая сильная), при равенстве решает масть. Опустошите свои 13 карт первым, чтобы выиграть 2x ставки.",
  },
  "stud-poker": {
    name: "Стад-покер",
    subtitle: "Сравнение 5 карт напрямую с дилером",
    rules:
      "Сделайте ставку, затем вы и дилер получаете по 5 карт и сравниваете ранг напрямую — флеш-рояль, каре, фулл-хаус, флеш, стрит, тройка, две пары, пара, старшая карта. Более сильная рука выигрывает 2x; ничья возвращает ставку.",
  },
  niuniu: {
    name: "Ню-Ню",
    subtitle: "Составьте кратные 10 из 5 карт для лучшего счёта «быка»",
    rules:
      "Сделайте ставку, затем вы и дилер получаете по 5 карт. Выберите 3, сумма которых кратна 10 («бык»); последняя цифра оставшихся 2 карт — ваш счёт, чем выше, тем лучше. Точно 10 — высшая рука «Бык Бык»; отсутствие допустимой комбинации — «Без Быка», самая низкая. Более высокий счёт выигрывает 2x; ничья возвращает ставку. Карты с картинками — 10, туз — 1.",
  },
  "zha-jinhua": {
    name: "Три карты (Чжацзиньхуа)",
    subtitle: "Сравнение 3 карт напрямую с дилером",
    rules:
      "Сделайте ставку, затем вы и дилер получаете по 3 карты и сравниваете ранг напрямую — тройка, флеш-рояль, флеш, стрит, пара, старшая карта. Более сильная рука выигрывает 2x; ничья возвращает ставку.",
  },
  "seven-pk": {
    name: "Семикарточный стад",
    subtitle: "4 раунда раздачи — сброс или удвоение на каждом этапе",
    rules:
      "Установите начальную ставку. Карты раздаются в 4 этапа (3, затем 2, затем 1, затем последние 2 открываются), и после каждого этапа вы можете сбросить карты или удвоить ставку. Лучшая комбинация из 5 карт из ваших 7 определяет результат. Сброс карт означает потерю текущей общей ставки; выигрыш выплачивается по рангу руки, от флеш-рояля (150x) до двух пар (1x).",
  },
  chess: {
    name: "Шахматы",
    subtitle: "ИИ Соло／2 Игрока",
    rules:
      "По очереди двигайте фигуры; поставьте мат королю соперника, чтобы победить. Следует стандартным правилам шахмат для ходов пешки, ладьи, коня, слона, ферзя и короля.",
  },
  connect4: {
    name: "Четыре в ряд",
    subtitle: "ИИ Соло／2 Игрока",
    rules: "По очереди опускайте фишки в вертикальную сетку. Кто первым выстроит четыре в ряд по горизонтали, вертикали или диагонали, побеждает.",
  },
  "chinese-checkers": {
    name: "Китайские шашки",
    subtitle: "Звёздная доска",
    rules:
      "На доске в форме шестиконечной звезды первым переместите все свои фишки в противоположный угол. Фишки могут шагать или перепрыгивать через другие фишки для продвижения.",
  },
  jigsaw: {
    name: "Пятнашки",
    subtitle: "Пронумерованные плитки",
    rules: "Нажмите на плитку рядом с пустым местом, чтобы сдвинуть её. Расставьте плитки по порядку от 1 до 15, чтобы завершить испытание.",
  },
  "number-merge": {
    name: "Слияние чисел",
    subtitle: "В стиле 2048",
    rules: "Проведите пальцем или используйте стрелки. Совпадающие плитки сливаются и удваиваются при столкновении; достигните 2048, чтобы выиграть.",
  },
  "memory-match": {
    name: "Найди пару",
    subtitle: "Испытание на память",
    rules: "Переворачивайте по две карты за раз; совпавшие пары остаются открытыми. Найдите все пары за наименьшее число попыток, чтобы выиграть.",
  },
  ludo: {
    name: "Людо",
    subtitle: "2 игрока",
    rules: "Бросайте кубик, чтобы передвигать свои фишки по доске домой. Попадание на фишку соперника отправляет её обратно на старт.",
  },
  solitaire: {
    name: "Солитёр",
    subtitle: "Классический пасьянс",
    rules: "Разложите все карты по четырём базовым стопкам по мастям в порядке возрастания, чтобы очистить поле и выиграть.",
  },
  rummikub: {
    name: "Руммикуб",
    subtitle: "Костяшки руммикуба против ИИ",
    rules:
      "Используйте пронумерованные костяшки, чтобы составлять последовательности или наборы одинаковых чисел, и выкладывайте их на стол. Первым выложите все костяшки, чтобы выиграть.",
  },
  "rps-battle": {
    name: "Камень, ножницы, бумага",
    subtitle: "Против ИИ",
    rules: "Одновременно выбирайте камень, ножницы или бумагу против компьютера. Кто выиграет больше раундов, побеждает в матче.",
  },
  "texas-holdem": {
    name: "Техасский Холдем",
    subtitle: "Один на один против ИИ (упрощённо)",
    rules:
      "У вас и ИИ по 2 карты, плюс 5 общих карт на столе. Уравняйте и вскройте карты или сбросьте — старшая рука забирает банк.",
  },
  war: {
    name: "Война",
    subtitle: "Старшая карта против ИИ",
    rules:
      "Колода делится поровну. В каждом раунде обе стороны открывают по карте — старшая карта побеждает в раунде. При равенстве начинается битва; побеждает тот, у кого больше карт в конце.",
  },
  "three-card-poker": {
    name: "Покер на три карты",
    subtitle: "Против дилера",
    rules:
      "Вам и дилеру раздаётся по 3 карты. Посмотрев свою руку, уравняйте, чтобы сравнить карты, или сбросьте — старшая рука побеждает.",
  },
  klotski: {
    name: "Клоцки",
    subtitle: "Головоломка со сдвижными блоками",
    rules: "Сдвигайте блоки разного размера в ограниченном пространстве доски. Переместите самый большой блок к выходу внизу, чтобы выиграть.",
  },
  tetris: {
    name: "Тетрис",
    subtitle: "Складывайте и очищайте линии",
    rules:
      "Проведите влево или вправо, чтобы двигать падающую фигуру, нажмите для поворота, проведите вниз для быстрого падения. Заполните целый ряд, чтобы очистить его; игра заканчивается, если стопка достигает верха.",
  },
  "bubble-shooter": {
    name: "Стрельба пузырями",
    subtitle: "Соединяйте цвета, чтобы очищать",
    rules: "Нажмите на полосу, чтобы выстрелить текущим пузырём. Три и более одинаковых соединённых пузыря убираются за очки; игра заканчивается, если пузыри достигают верха.",
  },
  match3: {
    name: "Три в ряд",
    subtitle: "Меняйте местами для совпадений",
    rules:
      "Нажмите на плитку, затем на соседнюю, чтобы поменять их местами. Совпадение 3 и более одного цвета убирает их и заполняет поле сверху, что может вызвать цепочку совпадений.",
  },
  hanoi: {
    name: "Ханойская башня",
    subtitle: "Передвиньте диски",
    rules:
      "Нажмите на стержень, чтобы взять верхний диск, затем нажмите на другой стержень, чтобы переместить его туда. Больший диск никогда не может лежать на меньшем — переместите всю стопку на крайний правый стержень, чтобы выиграть.",
  },
  "water-sort": {
    name: "Сортировка воды",
    subtitle: "Переливайте, чтобы рассортировать цвета",
    rules:
      "Нажмите на пробирку, чтобы взять верхний цвет, затем нажмите на другую, чтобы перелить — только в пустую пробирку или с тем же цветом сверху. Рассортируйте каждую пробирку в один цвет, чтобы выиграть.",
  },
  "pipe-connect": {
    name: "Соединение труб",
    subtitle: "Поворачивайте, чтобы соединить",
    rules: "Нажмите на плитку трубы, чтобы повернуть её на 90°. Соедините источник воды в левом верхнем углу с выходом в правом нижнем углу, чтобы выиграть.",
  },
  "stack-tower": {
    name: "Башня из блоков",
    subtitle: "Рассчитайте время сброса",
    rules:
      "Блок наверху качается влево и вправо; нажмите, чтобы сбросить его на стопку внизу. Чем меньше перекрытие, тем уже становится блок — полностью промахнитесь мимо стопки, и игра закончится.",
  },
  "sequence-sort": {
    name: "Мастер сортировки",
    subtitle: "Меняйте местами для порядка",
    rules: "Нажмите на две плитки с числами, чтобы поменять их местами. Расставьте все числа от меньшего к большему за наименьшее число перестановок, чтобы выиграть.",
  },
  "mini-sudoku": {
    name: "Мини Судоку",
    subtitle: "Сетка 6×6",
    rules: "В каждой строке, столбце и блоке 2×3 должны быть числа от 1 до 6 без повторов. Заполните всю сетку без конфликтов, чтобы выиграть.",
  },
  "shooting-range": {
    name: "Тир",
    subtitle: "Быстрые реакции на мишени",
    rules: "Мишени случайно загораются по сетке — нажимайте на них как можно быстрее, чтобы набрать очки. Достигните целевого счёта до истечения времени, чтобы выиграть.",
  },
  "space-invaders": {
    name: "Космические захватчики",
    subtitle: "Очистите флот, чтобы выиграть",
    rules:
      "Двигайтесь влево и вправо, уклоняясь от вражеского огня, и уничтожьте весь флот пришельцев. Испытание провалено, если флот приблизится вплотную или закончатся жизни.",
  },
  "tank-battle": {
    name: "Танковая битва",
    subtitle: "Первый до 3 попаданий побеждает",
    rules: "Двигайте свой танк влево и вправо и стреляйте снарядами. Попадание по полосе соперника приносит очко — первым наберите 3 попадания, чтобы выиграть.",
  },
  "brick-breaker": {
    name: "Арканоид",
    subtitle: "Очистите все кирпичи, чтобы выиграть",
    rules:
      "Перетаскивайте платформу влево и вправо, чтобы отбивать мяч и разбивать все кирпичи. Падение мяча вниз стоит жизни; испытание провалено, если жизни закончатся.",
  },
  "zombie-defense": {
    name: "Оборона от зомби",
    subtitle: "Переживите каждую волну, чтобы выиграть",
    rules:
      "Зомби продвигаются по полосе справа; нажимайте на них, чтобы уничтожить (некоторым нужно два удара). Если один достигнет левого края, вы теряете здоровье — переживите все волны, чтобы выиграть.",
  },
  "air-combat": {
    name: "Воздушный бой",
    subtitle: "Выживите и наберите целевой счёт",
    rules:
      "Ваш истребитель стреляет автоматически; двигайтесь влево и вправо, уклоняясь от вражеских самолётов и уничтожая их. Продержитесь до конца времени, набрав целевой счёт, чтобы выиграть; потеря всех жизней проваливает испытание.",
  },
  billiards: {
    name: "Бильярд",
    subtitle: "Тяните, чтобы прицелиться, забейте все шары",
    rules: "Оттяните назад от битка, чтобы прицелиться, затем отпустите для удара. Забейте все цветные шары до того, как закончатся удары, чтобы выиграть.",
  },
  bowling: {
    name: "Боулинг",
    subtitle: "Наберите целевое число кеглей за 3 фрейма",
    rules: "Перетащите ползунок, чтобы задать угол броска, затем отпустите, чтобы бросить шар. Наберите целевое число сбитых кеглей за 3 фрейма, чтобы выиграть.",
  },
  "basketball-shoot": {
    name: "Баскетбольный бросок",
    subtitle: "Рассчитайте время броска",
    rules: "Шкала силы автоматически качается туда-сюда — нажмите для броска, когда она близка к центру, чтобы попасть. Наберите достаточно попаданий, чтобы выиграть.",
  },
  "penalty-kick": {
    name: "Пенальти",
    subtitle: "Выберите сторону против вратаря",
    rules: "Выберите удар влево, в центр или вправо против вратаря, который прыгает случайно. Забейте достаточно голов за 5 раундов, чтобы выиграть.",
  },
  racing: {
    name: "Гоночный рывок",
    subtitle: "Меняйте полосы, уклоняясь от трафика",
    rules: "Меняйте полосы влево и вправо, уклоняясь от встречного трафика. Испытание провалено, если жизни закончатся до финишной дистанции.",
  },
  parking: {
    name: "Испытание парковкой",
    subtitle: "Запаркуйтесь в пределах ходов",
    rules: "Используйте руль и педали, чтобы точно припарковаться на отмеченном месте до того, как закончатся ходы или произойдут столкновения, чтобы выиграть.",
  },
  motocross: {
    name: "Мотокросс-прыжок",
    subtitle: "Перепрыгните ямы до финиша",
    rules: "Нажмите, чтобы подпрыгнуть на мотоцикле и преодолеть ямы впереди с хорошим таймингом. Испытание провалено, если жизни закончатся до финиша.",
  },
  "drift-racing": {
    name: "Дрифт-гонки",
    subtitle: "Рулите вдоль трассы, чтобы набрать очки",
    rules: "Рулите вдоль поворотов трассы, оставаясь на курсе и набирая очки за дрифт. Доберитесь до финиша с достаточным числом очков, чтобы выиграть.",
  },
  "duel-arena": {
    name: "Арена дуэлей",
    subtitle: "Пошаговый бой, первый нокаут побеждает",
    rules:
      "Выбирайте Атаку, чтобы накопить специальную шкалу, Защиту, чтобы снизить вдвое следующий удар, или используйте Финишер, когда шкала заполнена. Первым обнулите здоровье соперника, чтобы выиграть.",
  },
  bridge: {
    name: "Бридж",
    subtitle: "В паре против двух компьютерных соперников",
    rules:
      "Вы и ваш партнёр Север играете против Запада и Востока, управляемых компьютером. В каждой взятке все четверо игроков ходят по очереди и обязаны сыграть в масть, если возможно; иначе можно сыграть любую масть или козырь. Взятку выигрывает старшая карта заявленной масти или старший козырь. После всех 13 взяток пара, выигравшая 7 и более взяток, побеждает в раздаче.",
  },
  "pick-red-points": {
    name: "Сбор красных очков",
    subtitle: "Совпадите сыгранную карту с картой на столе",
    rules:
      "По очереди играйте по одной карте: если её ранг совпадает с картой на столе, заберите все карты этого ранга плюс сыгранную карту за очки. Если нет — она остаётся на столе. После того как колода закончится, сравните собранные красные черви/бубны каждой стороны — обычные красные карты стоят 1 очко, красные десятки, валеты, дамы и короли — по 10. Больше очков побеждает.",
  },
  "dou-dizhu": {
    name: "Борьба с помещиком",
    subtitle: "Помещик против двух крестьян",
    rules:
      "После раздачи система назначает одного Помещика (вас или компьютер) на основе силы руки — Помещик берёт 3 дополнительные скрытые карты, а остальные двое становятся Крестьянами, объединяясь против него. По очереди играйте комбинации сильнее предыдущей или пасуйте, если не можете. Победа Помещика, выложившего карты первым, засчитывается ему; победа любого Крестьянина засчитывается команде Крестьян.",
  },
  "liars-cards": {
    name: "Карточный блеф",
    subtitle: "Играйте рубашкой вверх, называйте ранг, угадывайте блеф",
    rules:
      "Вы и два компьютерных соперника по очереди: играйте 1–4 карты рубашкой вверх и объявляйте ранг (ранги должны идти по циклу А→2→3→...→К→А, и вы можете объявить честно или блефовать). Другие игроки могут Поверить и передать ход дальше, или Раскрыть блеф и перевернуть карты для проверки — правильный вызов заставляет сыгравшего забрать всю стопку со стола, неправильный — забирает её вызывающий. Первый, кто опустошит руку без разоблачения блефа, побеждает.",
  },
  "five-pk": {
    name: "Покер на 5 карт",
    subtitle: "Одна замена, затем сравнение рук с удвоением",
    rules:
      "Сделайте ставку, затем раздайте 5 карт (в колоде 2 джокера). Оставьте нужные карты и замените остальные один раз. Руки оплачиваются по рангу — стрит-флеш 500x, каре 200x, флеш-стрит 120x, вплоть до двух пар по 1x. После выигрыша можно удвоить ставку на больше/меньше или красное/чёрное, либо забрать выигрыш в любой момент.",
  },
  "little-mary": {
    name: "Классическая Маленькая Мэри",
    subtitle: "Вращающаяся световая рамка — ставки на крупные или мелкие карты",
    rules:
      "Сделайте ставку на каждый символ, затем начните. Световая рамка быстро вращается 3 круга, затем замедляется и останавливается в пределах от половины до полутора кругов — нажмите «Стоп», чтобы остановить раньше. Остановка на стрелке — проигрыш; остановка на символе бесплатного вращения даёт бесплатный повтор; фиксированные символы платят установленный множитель; символы больших или малых карт платят по текущему множителю, если на них сделана ставка. После достаточного числа вращений может сработать бонусный раунд с более высокой фиксированной выплатой и характерным звуком.",
  },
  "little-mary-2": {
    name: "Классическая Маленькая Мэри II",
    subtitle: "Спортивная тема вращающейся световой рамки",
    rules:
      "Те же механики вращения, что и в Классической Маленькой Мэри, переработанные в спортивную тему (футбол, регби, баскетбол, боулинг, теннис, настольный теннис, гольф). Ставьте на каждый символ, затем начинайте — остановка на стрелке проигрывает, бесплатный символ даёт повторное вращение, фиксированные символы платят установленный множитель, большие или малые спортивные символы платят по текущему множителю при ставке на них. Бонусный раунд может сработать после достаточного числа вращений с высокой фиксированной выплатой.",
  },
  "little-mary-3": {
    name: "Классическая Маленькая Мэри III",
    subtitle: "Джекпот цветочного бога — ставки на крупные или мелкие",
    rules:
      "Те же механики вращения, что и в Классической Маленькой Мэри. Три огонька цветочного бога обычно мигают независимо; после достаточного числа вращений они могут синхронизироваться в мигающем состоянии тревоги. Если барабан остановится на группе символов больших или малых карт в этот момент, все три символа платят вместе 3x от текущего множителя — редкий бонус-джекпот.",
  },
  "little-mary-4": {
    name: "Классическая Маленькая Мэри IV",
    subtitle: "Джекпот цветочного бога в теме животных",
    rules:
      "Те же механики, что и в издании с джекпотом цветочного бога, переработанные в тему животных (тигр, дракон, обезьяна, лиса, мышь, петух, цыплёнок). Тревога джекпота цветочного бога и выплата 3x работают идентично.",
  },
  "little-mary-5": {
    name: "Классическая Маленькая Мэри III (Феникс)",
    subtitle: "Издание с декором феникса — ставки на крупные или мелкие",
    rules:
      "Те же механики вращения, что и в Классической Маленькой Мэри. Большой феникс в центре чисто декоративный, мигает быстрее во время тревоги бонуса. Остановка на любом символе бесплатного вращения вызывает декоративный световой след по рамке — только визуальный эффект, не влияет на выплату.",
  },
  "little-mary-6": {
    name: "Классическая Маленькая Мэри IV (Феникс)",
    subtitle: "Издание с декором феникса — тема напитков",
    rules:
      "Те же механики, что и в издании с декором феникса, переработанные в тему напитков (чайник, мёд, чай мате, колотый лёд, пиво, вино, коктейль). Декоративный феникс и эффекты светового следа работают идентично.",
  },
  "little-mary-7": {
    name: "Мини Маленькая Мэри (Океан)",
    subtitle: "Мини-рамка 8×8 — ставки на крупные или мелкие",
    rules:
      "Уменьшенная световая рамка 8×8 (28 позиций) с теми же механиками вращения, в теме океанских животных (акула, кит, дельфин, тропическая рыба, краб, ракушка, пузыри). Остановка на стрелке проигрывает, бесплатный символ даёт повторное вращение, фиксированные символы платят установленный множитель, большие или малые символы платят по текущему множителю при ставке на них. Бонусный раунд джекпота может сработать после достаточного числа вращений.",
  },
  "little-mary-8": {
    name: "Мини Маленькая Мэри (Десерт)",
    subtitle: "Мини-рамка 8×8 — тема десертов",
    rules:
      "Те же механики мини-рамки 8×8, что и в издании «Океан», переработанные в тему десертов (торт, клубничный торт, кекс, пончик, печенье, конфета, леденец). Бонусный раунд джекпота может сработать после достаточного числа вращений с характерным звуком.",
  },
  "fruit-slot-1": {
    name: "Фруктовые барабаны I",
    subtitle: "Классические барабаны 3×3, 5 линий выплат",
    rules:
      "Классический фруктовый автомат с 3 барабанами, 3 рядами и 5 линиями выплат (верхний, средний, нижний ряды плюс обе диагонали). Установите ставку на линию, затем крутите — каждый барабан останавливается независимо слева направо, можно нажать «Стоп», чтобы остановить раньше. Три совпадающих символа на любой линии платят по таблице, от счастливой семёрки за 100x до вишни за 4x; две или более вишни в любом месте экрана платят небольшое утешение; три семёрки в среднем ряду — джекпот с собственным световым шоу и звуком.",
  },
  "fruit-slot-2": {
    name: "Фруктовые барабаны II",
    subtitle: "Тропическая фруктовая тема, 5 линий выплат",
    rules:
      "Те же механики 3 барабанов и 5 линий выплат, что и в «Фруктовых барабанах I», переработанные в тропическую тему — бриллиант заменяет счастливую семёрку как символ джекпота, в паре с клубникой, ананасом, бананом, персиком и вишней. Три совпадающих символа на любой линии платят по таблице, от бриллианта за 100x до вишни за 4x; три бриллианта в среднем ряду — джекпот.",
  },
  "little-mary-bonus": {
    name: "Классическая Маленькая Мэри V (Бонус Счастливой Семёрки)",
    subtitle: "Бонусный раунд множителя счастливых семёрок",
    rules:
      "Те же механики вращения, что и в Классической Маленькой Мэри, со ставками сразу на 8 символов. Трио барабанов с цифрами в центре обычно вращается чисто декоративно; при выигрыше есть шанс, что сработает бонусный раунд, где три барабана останавливаются один за другим. Остановка на трёх одинаковых нечётных цифрах умножает выигрыш на 10x, на трёх чётных — на 5x — редкий случайный бонус, который срабатывает не каждый раз.",
  },
  "little-mary-bonus-2": {
    name: "Классическая Маленькая Мэри IV (Бонус Счастливой Семёрки, Праздничная)",
    subtitle: "Праздничная тема бонуса счастливых семёрок",
    rules:
      "Те же механики, что и в издании «Бонус Счастливой Семёрки», переработанные в праздничную тему (красный конверт, золотой слиток, фонарь, мандарин, лунный пряник, фейерверк, вишня). Бонусный раунд и множители совпадения цифр 10x/5x работают идентично, с праздничными цветами и звуковыми эффектами.",
  },
  "xiangqi-mahjong": {
    name: "Маджонг Сянци",
    subtitle: "Составляйте наборы из шахматных фигур, обгоните компьютер",
    rules:
      "Сделайте ставку, затем вы и компьютер тянете по 5 фигур китайских шахмат. На своём ходу тяните фигуру — если она завершает пару плюс набор (последовательность или тройку), вы побеждаете самостоятельным добором. Иначе сбросьте одну из своих 6 фигур. Если сброс компьютера завершает вашу руку, можете забрать её для победы или пропустить и продолжить тянуть. Выплаты: 2x за смешанную пару-с-последовательностью, 3x за пару-с-последовательностью одной масти, 5x за пять солдат или пешек; забор сброса платит по указанной ставке, самостоятельный добор добавляет бонус. Если колода закончится без победителя, ставки возвращаются.",
  },
  tuitongzai: {
    name: "Тойтунцзай",
    subtitle: "Костяшки маджонга пай-гоу сразу на трёх позициях",
    rules:
      "Используются круглые костяшки маджонга 1–9 (по 4 каждой) плюс пустые костяшки (4 штуки, по пол-очка), представляя колоду из 40 костяшек. Сделайте ставки на позиции головы, неба и хвоста, затем дилер и каждая позиция переворачивают по 2 костяшки для сравнения. Порядок рангов: двойная пустая (высшая) бьёт любую пару, которая бьёт комбинацию 2-8, которая бьёт обычную сумму очков (сумма цифр, считается последняя цифра, пустая = 0,5, 9,5 — лучшая обычная сумма, 0 — худшая). Каждая позиция сравнивается с дилером независимо — победа платит 1x, пары платят 4x, двойная пустая платит 10x; совпадающие суммы по правилам заведения в пользу дилера.",
  },
}

const ar: GameTable = {
  xiangqi: {
    name: "الشطرنج الصيني",
    subtitle: "ذكاء اصطناعي فردي／لاعبان",
    rules:
      "بالتناوب حرّك القطع؛ من يحاصر جنرال الخصم أولاً بلا مخرج يفوز. يتبع قواعد شيانغتشي التقليدية: العربة تتحرك في خط مستقيم، الحصان بشكل حرف L، الفيل قطريًا داخل منطقته، المستشار قطريًا قرب القصر، والجندي يمكنه التحرك جانبيًا بعد عبور النهر.",
  },
  "darkchess-classic": {
    name: "الشطرنج المخفي (كلاسيكي)",
    subtitle: "ذكاء اصطناعي فردي／لاعبان",
    rules: "تبدأ جميع القطع مقلوبة، وعند كشفها تُؤكل حسب ترتيب الرتب التقليدي. الفوز يكون بأكل جميع قطع الخصم أو تركه بلا حركة.",
  },
  "darkchess-variant": {
    name: "الشطرنج المخفي (متغير)",
    subtitle: "ذكاء اصطناعي فردي／لاعبان",
    rules: "مثل النسخة الكلاسيكية، لكن هجوم وقفز المدفع يتبعان قواعد متغيرة، مما يضيف تكتيكات جديدة.",
  },
  go: {
    name: "جو (Go)",
    subtitle: "19×19",
    rules: "بالتناوب ضع حجارة سوداء وبيضاء عند تقاطعات لوحة 19×19؛ من يسيطر على مساحة أكبر يفوز. الحجارة المحاصرة بالكامل بلا أنفاس تُؤسر.",
  },
  gomoku: { name: "جوموكو", subtitle: "17×17", rules: "بالتناوب ضع الحجارة؛ من يصل أولاً إلى خمسة متتالية أفقيًا أو عموديًا أو قطريًا يفوز." },
  othello: {
    name: "أوثيلو",
    subtitle: "قياسي",
    rules: "بالتناوب ضع القطع؛ قطع الخصم المحاصرة بين قطعك تنقلب إلى لونك. في النهاية من يملك أكثر قطع يفوز.",
  },
  mahjong: {
    name: "ماهجونج الصيني",
    subtitle: "ذكاء اصطناعي فردي (3 حواسيب)",
    rules: "اجلس على طاولة مع ثلاثة خصوم حاسوبيين، اسحب وتخلّ من القطع بالتناوب، يمكنك المطالبة بقطع مرمية عبر تشاو／بونج／كونج. من يكمل يدًا فائزة صحيحة أولاً يفوز.",
  },
  luzhanqi: {
    name: "لوجانتشي (شطرنج الجيش)",
    subtitle: "ذكاء اصطناعي فردي／لاعبان",
    rules: "رتبة قطع كل جانب سرية، والخصم يرى فقط الجانب الخلفي. تُحسم المعارك بالرتبة؛ من يستولي على راية الخصم أو يتركه بلا حركة أولاً يفوز.",
  },
  checkers: {
    name: "الداما",
    subtitle: "قياسي",
    rules: "بالتناوب حرّك القطع قطريًا؛ يمكنك القفز لأكل قطع الخصم. الفوز يكون بأكل جميع قطع الخصم أو تركه بلا حركة.",
  },
  tictactoe: {
    name: "إكس أو",
    subtitle: "نسخة موسعة 3×3",
    rules: "بالتناوب ضع الرموز؛ من يصل أولاً إلى ثلاثة متتالية أفقيًا أو عموديًا أو قطريًا يفوز.",
  },
  "sichuan-mahjong": {
    name: "ماهجونج سيتشوان",
    subtitle: "ذكاء اصطناعي (3 حواسيب)",
    rules: "بدون أوراق الشخصيات، كل يد تحتاج زهرة واحدة نقية (شخصية واحدة فقط). اسحب وتخلّ بالتناوب، يمكنك المطالبة بقطع مرمية. من يكمل يدًا فائزة صحيحة أولاً يفوز.",
  },
  "malaysia-mahjong": {
    name: "ماهجونج ماليزي ثلاثي",
    subtitle: "ذكاء اصطناعي (3 حواسيب)",
    rules: "نسخة ماليزية بقواعد كونج ثلاثي خاصة ودرجات بونات إضافية. اسحب وتخلّ بالتناوب، أكمل يدًا فائزة صحيحة أولاً للفوز.",
  },
  "mahjong-pengpeng": {
    name: "بونج بونج هو",
    subtitle: "ذكاء اصطناعي (3 حواسيب)",
    rules: "يجب أن تتكون اليد الفائزة فقط من مجموعات بونج (ثلاثيات متطابقة) وزوج واحد، بدون تشاو. اسحب وتخلّ، اطلب بونج من أي جهة.",
  },
  "mahjong-sevens": {
    name: "سبعات الماهجونج",
    subtitle: "مثل لعبة السبعات، بأشكال النقاط／الخيزران／الشخصيات",
    rules: "ابدأ من الخمسة في كل نوع، ثم بالتناوب العب الأرقام المتجاورة لها. من لا يملك قطعة قابلة للعب يمر مع خصم نقطة.",
  },
  "mahjong-solitaire": {
    name: "سوليتير ماهجونج",
    subtitle: "لعبة فردية",
    rules: "اضغط على زوج من البلاط المتطابق المكشوف (غير مغطى من الجانبين على الأقل) لإزالته. أزل جميع البلاط لتفوز.",
  },
  "riichi-mahjong": {
    name: "ماهجونج رييتشي اليابانية",
    subtitle: "ذكاء اصطناعي (3 حواسيب)",
    rules: "قواعد رييتشي اليابانية مع الدورا والرييتشي والترقيم الفانو. أعلن رييتشي عندما تكون على بعد قطعة واحدة من الفوز لمضاعفة نقاطك عند النجاح.",
  },
  bridge: {
    name: "البريدج",
    subtitle: "ذكاء اصطناعي (3 حواسيب)",
    rules: "مزايدة ثم لعب الأوراق مع شريكك ضد الزوج المعارض. أكمل عدد اللفات التي تعاقدت عليها لتسجيل النقاط.",
  },
  "pick-red-points": {
    name: "جمع النقاط الحمراء",
    subtitle: "طابق الورقة المطروحة بورقة على الطاولة",
    rules: "بالتناوب اطرح ورقة واحدة: إذا تطابقت رتبتها مع ورقة على الطاولة، اجمع جميع الأوراق من تلك الرتبة مع ورقتك لتحصل على نقاط. إن لم تتطابق تبقى على الطاولة. بعد نفاد الأوراق، قارن نقاط القلوب／الماس الحمراء لكل جانب: الأوراق الحمراء العادية بنقطة واحدة، والعشرة والجاك والكوين والكينغ الحمراء بـ10 نقاط كل منها. الأعلى يفوز.",
  },
  "dou-dizhu": {
    name: "محاربة ملاك الأرض",
    subtitle: "ملاك الأرض ضد فلاحَين",
    rules: "بعد التوزيع، يُعيّن النظام تلقائيًا \"ملاك الأرض\" (أنت أو الحاسوب) حسب قوة اليد؛ يأخذ ملاك الأرض 3 أوراق إضافية مخفية، والاثنان الآخران يصبحان فلاحين يتحدان ضده. بالتناوب اطرح تركيبات أقوى من آخر طرح، أو مرّر إن تعذّر. فوز ملاك الأرض بإفراغ يده أولاً يفوز لملاك الأرض؛ فوز أي فلاح أولاً يفوز لفريق الفلاحين.",
  },
  "liars-cards": {
    name: "الكذب بالأوراق",
    subtitle: "اطرح مقلوبًا، أعلن الرتبة، اكشف الكذب",
    rules: "أنت وخصمان حاسوبيان تتناوبون: اطرح 1-4 أوراق مقلوبة وأعلن رتبة (يجب أن تتوالى الرتب A←2←3←...←K←A، ويمكنك الصدق أو الكذب). يمكن للآخرين \"التصديق\" وتمرير الدور، أو \"كشف الكذب\" وقلب الأوراق للتحقق — الكشف الصحيح يجعل من طرحها يستعيد كل أوراق الطاولة، والكشف الخاطئ يجعل الكاشف يستعيدها بنفسه. أول من يفرغ يده دون أن يُكشف كذبه يفوز.",
  },
  "sevens": {
    name: "السبعات",
    subtitle: "ذكاء اصطناعي (3 حواسيب)",
    rules: "ابدأ بسبعة من أي بدلة، ثم اطرح أوراقًا متتالية صعودًا أو نزولاً من نفس البدلة. من لا يملك ورقة قابلة للعب يمر؛ أول من يفرغ يده يفوز.",
  },
  "merge-2048": {
    name: "2048 الدمج",
    subtitle: "لعبة شبكية",
    rules: "اسحب لتحريك جميع البلاط في اتجاه واحد؛ البلاط المتطابقة المتجاورة تندمج وتتضاعف قيمتها. الوصول إلى بلاطة 2048 يحقق الفوز.",
  },
  "city-2048": {
    name: "مدينة 2048",
    subtitle: "لعبة شبكية بثيم المباني",
    rules: "اسحب لدمج مباني المدينة المتطابقة إلى مستوى أعلى، من منزل صغير إلى مركز مدينة ضخم. ابنِ أعلى مستوى ممكن قبل امتلاء الشبكة.",
  },
  "merge-2048-undo": {
    name: "2048 مع التراجع",
    subtitle: "لعبة شبكية مع تراجع",
    rules: "نفس قواعد 2048 القياسية، لكن مع زر تراجع يسمح لك بإلغاء آخر حركة إذا ارتكبت خطأ.",
  },
  "triple-town": {
    name: "ترايبل تاون",
    subtitle: "لعبة بناء",
    rules: "ضع العناصر على الشبكة؛ ثلاثة متطابقة متجاورة تندمج لتكوين عنصر أعلى مستوى. خطط بعناية لتجنب امتلاء اللوحة.",
  },
  suika: {
    name: "دمج البطيخ",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط الفواكه من الأعلى؛ الفواكه المتطابقة التي تتلامس تندمج لتكوين فاكهة أكبر. تجنب تجاوز الفواكه لحافة الحاوية.",
  },
  "drop-2048": {
    name: "2048 بالسقوط",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط البلاط المرقّمة من الأعلى؛ البلاط المتطابقة المتلامسة تندمج وتتضاعف قيمتها. تجنب تجاوز البلاط لحافة الحاوية.",
  },
  puyo: {
    name: "بويو بويو",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط كبسولات الهلام الملونة؛ أربع كبسولات متصلة من نفس اللون تُمحى. امسح سلاسل متتالية لإرسال كبسولات عقبة للخصم.",
  },
  "dr-mario": {
    name: "دكتور ماريو (دمج)",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط كبسولات الفيروسات الملونة لمطابقة أربع كبسولات متصلة من نفس اللون ومحوها. أزل جميع الفيروسات من اللوحة لتفوز بالمستوى.",
  },
  "columns-tetris": {
    name: "كتل الجواهر",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط كتل الجواهر الملونة؛ الجواهر المتطابقة المتصلة تندمج وتصبح أكبر. امنع الكتل من تجاوز حافة الحاوية.",
  },
  "balls-merge": {
    name: "دمج الكرات",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط كرات رياضية مختلفة؛ الكرات المتطابقة المتلامسة تندمج لتكوين كرة من مستوى أعلى، من كرة البينغ بونغ حتى كرة القدم الأمريكية.",
  },
  "cookies-merge": {
    name: "دمج الكوكيز",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط كوكيز وبسكويت مختلف؛ القطع المتطابقة المتلامسة تندمج لتكوين حلوى أكبر، من بسكويت صغير حتى بيتزا عملاقة.",
  },
  "planets-merge": {
    name: "دمج الكواكب",
    subtitle: "لعبة فيزيائية للدمج بالسقوط",
    rules: "أسقط أجسامًا فلكية؛ الأجسام المتطابقة المتلامسة تندمج لتكوين جسم من مستوى أعلى، من النجوم حتى المجرات.",
  },
  "candy-crush": {
    name: "أسطورة الحلوى",
    subtitle: "مطابقة ثلاثية",
    rules: "بدّل الحلوى المتجاورة لتكوين ثلاث متطابقة أو أكثر؛ حقق هدف النقاط ضمن عدد محدود من الحركات لتفوز بالمستوى.",
  },
  bejeweled: {
    name: "متاهة الجواهر",
    subtitle: "مطابقة ثلاثية",
    rules: "بدّل الجواهر المتجاورة لتكوين خطوط متطابقة؛ كلما زادت السلاسل المتتالية زادت مضاعفة نقاطك. لا يوجد حد للحركات، اسعَ لتحقيق أعلى رقم قياسي.",
  },
  gardenscapes: {
    name: "حديقة الأحلام",
    subtitle: "مطابقة ثلاثية مع ترميم",
    rules: "طابق العناصر لكسب العملات؛ استخدم العملات لإصلاح الحديقة المتهالكة وإنجاز المهام المتتالية.",
  },
  homescapes: {
    name: "منزل الأحلام",
    subtitle: "مطابقة ثلاثية مع تزيين",
    rules: "طابق عناصر الديكور المنزلي لكسب العملات؛ استخدم العملات لتزيين وتجديد المنزل عبر مهام متتالية.",
  },
  "royal-match": {
    name: "المطابقة الملكية",
    subtitle: "مطابقة ثلاثية مع ترميم القصر",
    rules: "طابق الشعارات الملكية لكسب العملات؛ استخدم العملات لترميم أجزاء القصر عبر مهام متتالية.",
  },
  "tower-of-saviors": {
    name: "برج المخلّصين",
    subtitle: "مطابقة الجواهر مع قتال",
    rules: "بدّل الجواهر لتكوين خطوط متطابقة؛ أعضاء فريقك المتناسبون مع العنصر يهاجمون العدو. اهزم العدو للتقدم للمستوى التالي.",
  },
  "puzzle-dragons": {
    name: "لغز التنانين",
    subtitle: "مطابقة الجواهر مع تفاعل العناصر",
    rules: "بدّل الجواهر لمهاجمة الأعداء؛ استخدم العناصر المتفوقة (النار يتفوق على الخشب، الخشب على الماء، الماء على النار) لإحداث ضرر أكبر.",
  },
  "empires-puzzles": {
    name: "الإمبراطوريات والألغاز",
    subtitle: "مطابقة الجواهر مع بناء المدن",
    rules: "بدّل الجواهر لمهاجمة الأبطال؛ اهزم الخصوم لكسب مواد البناء وتطوير إمبراطوريتك عبر معارك PvP تقدمية.",
  },
  "sheep-sheep": {
    name: "الخروف والخروف",
    subtitle: "لعبة تجميع بالنقر",
    rules: "اضغط على العناصر المكشوفة غير المحجوبة لجمعها في الخزان السفلي؛ ثلاثة متطابقة في الخزان تُزال تلقائيًا. تجنب امتلاء الخزان.",
  },
  match3d: {
    name: "المطابقة الثلاثية بالأبعاد",
    subtitle: "لعبة تجميع بالنقر ثلاثية الأبعاد",
    rules: "اضغط على الأشياء المكشوفة في الكومة ثلاثية الأبعاد لجمعها؛ ثلاثة متطابقة تُزال تلقائيًا من الخزان. أزل جميع الأشياء قبل امتلاء الخزان.",
  },
  "mahjong-niuniu": {
    name: "نيو نيو بالماهجونج",
    subtitle: "قطع ماهجونج بدلاً من الأوراق، كوّن مضاعفات العشرة",
    rules: "لعب نيو نيو باستخدام قطع الماهجونج بدلاً من الأوراق. من 5 قطع، اختر 3 يكون مجموعها من مضاعفات 10، ثم قارن نقاط القطعتين المتبقيتين.",
  },
  "dragon-gate": {
    name: "بوابة التنين",
    subtitle: "قطعتا نقاط من الماهجونج تفتحان البوابة، راهن على النطاق",
    rules: "تُكشف قطعتان من النقاط كبوابة؛ ضع رهانك، ثم تُكشف قطعة ثالثة. السقوط بين البوابة يفوز، خارجها يخسر، وتطابق أحد العمودين يضاعف الخسارة.",
  },
  blackjack: {
    name: "بلاك جاك",
    subtitle: "ضد الموزع، اقترب من 21",
    rules: "اقترب من 21 دون تجاوزها. الآس يساوي 1 أو 11، البطاقات الصورية تساوي 10. اختر سحب ورقة أو التوقف — يجب على الموزع الاستمرار بالسحب حتى يصل إلى 17 أو أكثر.",
  },
  baccarat: {
    name: "باكارات",
    subtitle: "Player／Banker／Tie",
    rules: "راهن على Player أو Banker أو Tie قبل توزيع الأوراق. يستخدم الإجمالي آخر رقم من المجموع؛ الإجمالي الأعلى يفوز. تُسحب أوراق إضافية تلقائيًا وفقًا لقواعد الباكارات القياسية.",
  },
  "ten-half": {
    name: "عشرة ونصف",
    subtitle: "اقترب من 10.5 أكثر من الموزع",
    rules: "ضع رهانك، ثم يحصل كل جانب على ورقتين. اختر سحب ورقة أو التوقف — من يقترب أكثر من 10.5 دون تجاوزها يفوز. الآس يساوي نقطة واحدة، البطاقات الصورية 0.5 نقطة. 10.5 طبيعية عند التوزيع تدفع 3 أضعاف؛ الفوز العادي يدفع ضعفين؛ التعادل يعيد الرهان.",
  },
  "thirteen-water": {
    name: "ثلاث عشرة ورقة",
    subtitle: "قسّم 13 ورقة إلى 3 أيدٍ ضد الموزع",
    rules: "ضع رهانك ووزّع الأوراق. يرتب النظام تلقائيًا أوراقك الـ13 وأوراق الموزع إلى يد أمامية من 3 أوراق، ويد وسطى من 5، ويد خلفية من 5، تُقارَن بشكل منفصل. الفوز بثلاث أيدٍ يدفع 5 أضعاف، الفوز بيدين يدفع ضعفين، الفوز بيد واحدة يدفع 1.5 ضعف، التعادل لا يدفع ولا يخسر، وخسارة أكثر من الفوز تُكلّف الرهان.",
  },
  "big-two": {
    name: "بيغ تو",
    subtitle: "العب أوراقًا مفردة أو أزواجًا لإفراغ يدك أولاً",
    rules: "ضع رهانك والعب ضد الموزع. العب ورقة مفردة أو زوجًا من نفس الرتبة أقوى من آخر لعبة، أو تمرّر. الترتيب من 3 (الأضعف) إلى 2 (الأقوى)، مع فصل التعادل حسب النوع. أفرِغ أوراقك الـ13 أولًا للفوز بضعفي رهانك.",
  },
  "stud-poker": {
    name: "ستاد بوكر",
    subtitle: "قارن 5 أوراق مباشرة ضد الموزع",
    rules: "ضع رهانك، ثم تحصل أنت والموزع على 5 أوراق لكل منكما وتقارنان الرتبة مباشرة — فلوش مستقيم، فور أوف إيه كايند، فول هاوس، فلوش، مستقيم، ثلاثية، زوجان، زوج، أعلى ورقة. اليد الأقوى تفوز بضعفين؛ التعادل يعيد الرهان.",
  },
  niuniu: {
    name: "نيو نيو",
    subtitle: "كوّن مضاعفات العشرة من 5 أوراق لأفضل نقاط ثور",
    rules: "ضع رهانك، ثم تحصل أنت والموزع على 5 أوراق لكل منكما. اختر 3 يكون مجموعها من مضاعفات 10 ('ثور')؛ آخر رقم من الورقتين المتبقيتين هو نقاطك، الأعلى أفضل. 10 تمامًا هي أعلى يد 'ثور ثور'؛ عدم وجود تركيبة صالحة يعني 'بلا ثور'، الأدنى. النقاط الأعلى تفوز بضعفين؛ التعادل يعيد الرهان. البطاقات الصورية تساوي 10، الآس يساوي 1.",
  },
  "zha-jinhua": {
    name: "ثلاث أوراق فلاش",
    subtitle: "قارن 3 أوراق مباشرة ضد الموزع",
    rules: "ضع رهانك، ثم تحصل أنت والموزع على 3 أوراق لكل منكما وتقارنان الرتبة مباشرة — ثلاثية، فلوش مستقيم، فلوش، مستقيم، زوج، أعلى ورقة. اليد الأقوى تفوز بضعفين؛ التعادل يعيد الرهان.",
  },
  "seven-pk": {
    name: "سيفن كارد ستاد",
    subtitle: "4 جولات توزيع — انسحب أو ضاعف في كل مرحلة",
    rules: "حدد رهانك الابتدائي. تُوزَّع الأوراق على 4 مراحل (3، ثم 2، ثم 1، ثم تُكشف الورقتان الأخيرتان)، وبعد كل مرحلة يمكنك الانسحاب أو مضاعفة رهانك. أفضل يد من 5 أوراق من أوراقك السبعة تحدد النتيجة. الانسحاب يخسر رهانك الإجمالي الحالي؛ الفوز يدفع حسب الرتبة، من فلوش رويال بـ150 ضعفًا إلى زوجين بضعف واحد.",
  },
  chess: {
    name: "الشطرنج",
    subtitle: "ذكاء اصطناعي فردي／لاعبان",
    rules: "بالتناوب حرّك القطع؛ من يكِش ملك الخصم أولاً يفوز. يتبع قواعد الشطرنج القياسية لحركة البيدق والقلعة والحصان والفيل والملكة والملك.",
  },
  connect4: {
    name: "أربعة متتالية",
    subtitle: "ذكاء اصطناعي فردي／لاعبان",
    rules: "بالتناوب أسقط القطع في الشبكة العمودية. من يصل أولاً إلى أربعة متتالية أفقيًا أو عموديًا أو قطريًا يفوز.",
  },
  "chinese-checkers": {
    name: "الداما الصينية",
    subtitle: "لوحة نجمية",
    rules: "على لوحة نجمية سداسية، انقل جميع قطعك إلى الزاوية المقابلة أولاً. يمكن للقطع التحرك خطوة أو القفز المتتالي فوق قطع أخرى للتقدم.",
  },
  jigsaw: {
    name: "اللغز المنزلق",
    subtitle: "بلاط مرقّم",
    rules: "اضغط على بلاطة بجانب المكان الفارغ لتحريكها. رتّب البلاط من 1 إلى 15 بالترتيب لإكمال التحدي.",
  },
  "number-merge": {
    name: "دمج الأرقام",
    subtitle: "بنمط 2048",
    rules: "اسحب أو استخدم الأسهم. البلاط المتطابقة تندمج وتتضاعف قيمتها عند التصادم؛ الوصول إلى 2048 يحقق الفوز.",
  },
  "memory-match": {
    name: "لعبة الذاكرة",
    subtitle: "تحدي المطابقة",
    rules: "اقلب بطاقتين في كل مرة؛ الأزواج المتطابقة تبقى مكشوفة. طابق كل زوج بأقل عدد ممكن من المحاولات للفوز.",
  },
  ludo: {
    name: "لودو",
    subtitle: "لاعبان",
    rules: "ارمِ النرد لتحريك قطعك حول اللوحة وصولًا إلى المنزل. الهبوط على قطعة الخصم يعيدها إلى البداية.",
  },
  solitaire: {
    name: "سوليتير",
    subtitle: "لعبة فردية كلاسيكية",
    rules: "رتّب جميع الأوراق في الأكوام الأساسية الأربع حسب النوع وبترتيب تصاعدي لتفريغ اللوحة والفوز.",
  },
  rummikub: {
    name: "روميكوب",
    subtitle: "دومينو الأرقام ضد الذكاء الاصطناعي",
    rules: "استخدم بلاطك المرقّم لتكوين تسلسلات أو مجموعات من نفس الرقم ووضعها على الطاولة. أول من يلعب كل بلاطه يفوز.",
  },
  "rps-battle": {
    name: "حجر ورقة مقص",
    subtitle: "ضد الذكاء الاصطناعي",
    rules: "اختر حجر أو ورقة أو مقص في نفس الوقت مع الحاسوب. من يفوز بجولات أكثر يفوز بالمباراة.",
  },
  "texas-holdem": {
    name: "تكساس هولدم",
    subtitle: "مواجهة فردية ضد الذكاء الاصطناعي (مبسطة)",
    rules: "أنت والذكاء الاصطناعي لكل منكما ورقتان، بالإضافة إلى 5 أوراق مشتركة. اطلب كشف الأوراق أو انسحب — اليد الأعلى رتبة تفوز بالرهان.",
  },
  war: {
    name: "الحرب",
    subtitle: "الورقة الأعلى ضد الذكاء الاصطناعي",
    rules: "تُقسّم أوراق اللعب بالتساوي. في كل جولة يكشف الطرفان ورقة — الورقة الأعلى تفوز بالجولة. التعادل يؤدي إلى معركة؛ من يملك أوراقًا أكثر في النهاية يفوز.",
  },
  "three-card-poker": {
    name: "بوكر الثلاث أوراق",
    subtitle: "ضد الموزع",
    rules: "تحصل أنت والموزع على 3 أوراق لكل منكما. بعد رؤية يدك، اطلب كشف الأوراق للمقارنة أو انسحب — اليد الأعلى رتبة تفوز.",
  },
  klotski: {
    name: "كلوتسكي",
    subtitle: "لغز الكتل المنزلقة",
    rules: "حرّك الكتل المختلفة الحجم ضمن مساحة اللوحة المحدودة. انقل الكتلة الأكبر إلى المخرج في الأسفل للفوز.",
  },
  tetris: {
    name: "تتريس",
    subtitle: "كدّس وامسح الصفوف",
    rules: "اسحب يمينًا أو يسارًا لتحريك القطعة الساقطة، اضغط للتدوير، اسحب للأسفل للإسقاط السريع. امتلاء صف كامل يمسحه ويمنحك نقاطًا؛ تنتهي اللعبة إذا وصلت الكومة إلى الأعلى.",
  },
  "bubble-shooter": {
    name: "إطلاق الفقاعات",
    subtitle: "طابق الألوان للمسح",
    rules: "اضغط على مسار لإطلاق الفقاعة الحالية. ثلاث فقاعات متطابقة متصلة أو أكثر تُمسح للنقاط؛ تنتهي اللعبة إذا وصلت الفقاعات إلى الأعلى.",
  },
  match3: {
    name: "تفجير المطابقة الثلاثية",
    subtitle: "بدّل للمطابقة",
    rules: "اضغط على بلاطة ثم على بلاطة مجاورة لتبديلهما. مطابقة 3 أو أكثر من نفس اللون تمسحها وتملأ الفراغ من الأعلى، مما قد يُحدث سلسلة من المطابقات.",
  },
  hanoi: {
    name: "أبراج هانوي",
    subtitle: "انقل الأقراص",
    rules: "اضغط على عمود لالتقاط القرص العلوي، ثم اضغط على عمود آخر لنقله إليه. لا يمكن أبدًا وضع قرص أكبر فوق قرص أصغر — انقل كامل الكومة إلى العمود الأيمن للفوز.",
  },
  "water-sort": {
    name: "لغز فرز الماء",
    subtitle: "اسكب لفرز الألوان",
    rules: "اضغط على أنبوب لالتقاط اللون العلوي، ثم اضغط على أنبوب آخر لسكبه فيه — فقط في أنبوب فارغ أو بنفس اللون في الأعلى. افرز كل أنبوب بلون واحد للفوز.",
  },
  "pipe-connect": {
    name: "توصيل الأنابيب",
    subtitle: "دوّر للربط",
    rules: "اضغط على بلاطة الأنبوب لتدويرها 90 درجة. اربط مصدر الماء في أعلى اليسار بالمخرج في أسفل اليمين للفوز.",
  },
  "stack-tower": {
    name: "برج الكتل",
    subtitle: "اضبط توقيت الإسقاط",
    rules: "الكتلة في الأعلى تتأرجح يمينًا ويسارًا؛ اضغط لإسقاطها على الكومة أدناه. كلما قلّ التداخل أصبحت الكتلة أضيق — إخفاق الإسقاط تمامًا عن الكومة ينهي اللعبة.",
  },
  "sequence-sort": {
    name: "سيد الترتيب",
    subtitle: "بدّل للترتيب",
    rules: "اضغط على بلاطتين برقمين لتبديل مكانيهما. رتّب جميع الأرقام من الأصغر إلى الأكبر بأقل عدد ممكن من التبديلات للفوز.",
  },
  "mini-sudoku": {
    name: "سودوكو مصغّر",
    subtitle: "شبكة 6×6",
    rules: "يجب أن يحتوي كل صف وعمود ومربع 2×3 على الأرقام من 1 إلى 6 دون تكرار. املأ الشبكة بالكامل دون تعارض للفوز.",
  },
  "shooting-range": {
    name: "ميدان الرماية",
    subtitle: "ردود فعل سريعة على الأهداف",
    rules: "تضيء الأهداف عشوائيًا عبر الشبكة — اضغط عليها بأسرع ما يمكن لتسجيل النقاط. حقق النقاط المستهدفة قبل انتهاء الوقت للفوز.",
  },
  "space-invaders": {
    name: "غزاة الفضاء",
    subtitle: "امسح الأسطول للفوز",
    rules: "تحرك يمينًا ويسارًا لتفادي نيران العدو وأسقط أسطول الفضائيين بالكامل. يفشل التحدي إذا اقترب الأسطول كثيرًا أو نفدت أرواحك.",
  },
  "tank-battle": {
    name: "معركة الدبابات",
    subtitle: "أول من يسجل 3 إصابات يفوز",
    rules: "حرّك دبابتك يمينًا ويسارًا وأطلق القذائف. إصابة مسار الخصم تسجل نقطة — كن أول من يسجل 3 إصابات للفوز.",
  },
  "brick-breaker": {
    name: "كاسر الطوب",
    subtitle: "امسح كل الطوب للفوز",
    rules: "اسحب المضرب يمينًا ويسارًا لارتداد الكرة وكسر كل الطوب للفوز. سقوط الكرة من الأسفل يكلفك حياة؛ يفشل التحدي إذا نفدت أرواحك.",
  },
  "zombie-defense": {
    name: "الدفاع ضد الزومبي",
    subtitle: "انجُ من كل موجة للفوز",
    rules: "يتقدم الزومبي على المسار من اليمين؛ اضغط عليهم لتدميرهم (بعضهم يحتاج ضربتين). وصول أحدهم للحافة اليسرى يكلفك صحة — انجُ من كل الموجات للفوز.",
  },
  "air-combat": {
    name: "القتال الجوي",
    subtitle: "انجُ وحقق النقاط المستهدفة",
    rules: "مقاتلتك تطلق النار تلقائيًا؛ تحرك يمينًا ويسارًا لتفادي طائرات العدو وإسقاطها. اصمد حتى نهاية الوقت محققًا النقاط المستهدفة للفوز؛ نفاد الأرواح يُفشل التحدي.",
  },
  billiards: {
    name: "البلياردو",
    subtitle: "اسحب للتصويب، أدخل كل الكرات",
    rules: "اسحب للخلف من الكرة البيضاء للتصويب، ثم حرر للضرب. أدخل كل الكرات الملونة قبل نفاد الضربات للفوز.",
  },
  bowling: {
    name: "البولينج",
    subtitle: "حقق هدف الدبابيس خلال 3 أدوار",
    rules: "اسحب الشريط لضبط زاوية الرمية، ثم حرر لرمي الكرة. حقق إجمالي الدبابيس المستهدف خلال 3 أدوار للفوز.",
  },
  "basketball-shoot": {
    name: "تسديدة كرة السلة",
    subtitle: "اضبط توقيت التسديدة",
    rules: "يتأرجح مقياس القوة تلقائيًا ذهابًا وإيابًا — اضغط للتسديد عندما يكون قريبًا من المنتصف لتسجيل. سجل ما يكفي من السلال للفوز.",
  },
  "penalty-kick": {
    name: "ركلة الجزاء",
    subtitle: "اختر جهة ضد الحارس",
    rules: "اختر اليسار أو الوسط أو اليمين للتسديد ضد حارس يقفز عشوائيًا. سجل أهدافًا كافية خلال 5 جولات للفوز.",
  },
  racing: {
    name: "اندفاع السباق",
    subtitle: "بدّل المسارات لتفادي الزحام",
    rules: "بدّل المسارات يمينًا ويسارًا لتفادي السيارات القادمة. يفشل التحدي إذا نفدت أرواحك قبل مسافة النهاية.",
  },
  parking: {
    name: "تحدي ركن السيارة",
    subtitle: "اركن ضمن عدد الحركات",
    rules: "استخدم عناصر التحكم في التوجيه والتقدم لركن السيارة بدقة في البقعة المحددة قبل نفاد الحركات أو وقوع تصادمات للفوز.",
  },
  motocross: {
    name: "قفزة الموتوكروس",
    subtitle: "اقفز الحفر حتى خط النهاية",
    rules: "اضغط لتقفز بدراجتك وتتجاوز الحفر الأمامية بتوقيت جيد. يفشل التحدي إذا نفدت أرواحك قبل الوصول لخط النهاية.",
  },
  "drift-racing": {
    name: "سباق الانزلاق",
    subtitle: "وجّه مع المسار لتسجيل النقاط",
    rules: "وجّه مع منعطفات المسار للبقاء على المسار وجمع نقاط الانزلاق. اصل إلى خط النهاية بنقاط كافية للفوز.",
  },
  "duel-arena": {
    name: "ساحة المبارزة",
    subtitle: "قتال بالأدوار، أول إسقاط يفوز",
    rules: "اختر الهجوم لتعبئة مقياسك الخاص، أو الدفاع لتقليل الضربة التالية بالنصف، أو أطلق ضربتك الحاسمة عند امتلاء المقياس. كن أول من يُصفّر صحة خصمك للفوز.",
  },
  "mahjong-ninepoint5": {
    name: "ماهجونج تسعة ونصف",
    subtitle: "قطع ماهجونج بدلاً من الأوراق، اقترب من 9.5",
    rules: "استخدم قطع الماهجونج بدلاً من الأوراق واقترب من 9.5 دون تجاوزها. اسحب قطعة أو توقف — من يقترب أكثر يفوز.",
  },
  "five-pk": {
    name: "بوكر الخمس أوراق",
    subtitle: "استبدال واحد، ثم مقارنة الأيدي مع مضاعفة",
    rules:
      "ضع رهانك، ثم وُزّعت 5 أوراق (مع وجود ورقتي جوكر في المجموعة). احتفظ بالأوراق المرغوبة واستبدل الباقي مرة واحدة. تُدفع الأيدي حسب الرتبة — فلوش مستقيم 500 ضعف، فور أوف إيه كايند 200 ضعف، وصولًا إلى زوجين بضعف واحد. بعد الفوز يمكنك المضاعفة على الأكبر／الأصغر أو الأحمر／الأسود، أو سحب أرباحك في أي وقت.",
  },
  "little-mary": {
    name: "ماري الصغيرة الكلاسيكية",
    subtitle: "إطار ضوئي دوّار — راهن على الأوراق الكبيرة أو الصغيرة",
    rules:
      "ضع رهانك على كل رمز ثم ابدأ. يدور الإطار الضوئي بسرعة لـ3 لفات، ثم يتباطأ ويتوقف ضمن نصف لفة إلى لفة ونصف — اضغط إيقاف لإنهائه مبكرًا. التوقف على سهم يخسر؛ التوقف على رمز الدوران المجاني يمنح إعادة دوران مجانية؛ الرموز الثابتة تدفع مضاعفًا محددًا؛ رموز الأوراق الكبيرة أو الصغيرة تدفع حسب المضاعف الجاري إذا راهنت عليها. بعد عدد كافٍ من الدورات، قد تنطلق جولة مكافأة بدفع ثابت أعلى ونغمة مميزة.",
  },
  "little-mary-2": {
    name: "ماري الصغيرة الكلاسيكية الثانية",
    subtitle: "إطار ضوئي دوّار بثيم رياضي",
    rules:
      "نفس آليات الدوران في ماري الصغيرة الكلاسيكية، بثيم رياضي (كرة القدم، الرغبي، السلة، البولينج، التنس، تنس الطاولة، الغولف). راهن على كل رمز ثم ابدأ — التوقف على سهم يخسر، الرمز المجاني يمنح دورانًا إضافيًا، الرموز الثابتة تدفع مضاعفًا محددًا، ورموز الرياضة الكبيرة أو الصغيرة تدفع حسب المضاعف الجاري عند المراهنة عليها. قد تنطلق جولة مكافأة بعد عدد كافٍ من الدورات بدفع ثابت مرتفع.",
  },
  "little-mary-3": {
    name: "ماري الصغيرة الكلاسيكية الثالثة",
    subtitle: "جائزة إله الزهور الكبرى — راهن على الكبير أو الصغير",
    rules:
      "نفس آليات الدوران. تومض ثلاثة أضواء لإله الزهور عادةً بشكل مستقل؛ بعد عدد كافٍ من الدورات قد تتزامن في حالة تنبيه وامض. إذا توقفت البكرة على مجموعة رموز الكبير أو الصغير في تلك اللحظة، تدفع الرموز الثلاثة معًا 3 أضعاف المضاعف الجاري — مكافأة جائزة كبرى نادرة.",
  },
  "little-mary-4": {
    name: "ماري الصغيرة الكلاسيكية الرابعة",
    subtitle: "جائزة إله الزهور الكبرى بثيم الحيوانات",
    rules:
      "نفس آليات إصدار جائزة إله الزهور الكبرى، بثيم حيواني (النمر، التنين، القرد، الثعلب، الفأر، الديك، الكتكوت). ينطبق تنبيه الجائزة الكبرى والدفع 3 أضعاف بنفس الطريقة.",
  },
  "little-mary-5": {
    name: "ماري الصغيرة الكلاسيكية الثالثة (العنقاء)",
    subtitle: "إصدار زخرفة العنقاء — راهن على الكبير أو الصغير",
    rules:
      "نفس آليات الدوران. العنقاء الكبيرة في المنتصف زخرفية بحتة، تومض أسرع أثناء تنبيه المكافأة. التوقف على أي رمز دوران مجاني يُحدث مسارًا ضوئيًا زخرفيًا عبر الإطار — تأثير بصري فقط لا يغيّر الدفع.",
  },
  "little-mary-6": {
    name: "ماري الصغيرة الكلاسيكية الرابعة (العنقاء)",
    subtitle: "إصدار زخرفة العنقاء — ثيم المشروبات",
    rules:
      "نفس آليات إصدار زخرفة العنقاء، بثيم المشروبات (إبريق الشاي، العسل، شاي المتة، الثلج المبشور، البيرة، النبيذ، الكوكتيل). تعمل زخرفة العنقاء وتأثيرات المسار الضوئي بنفس الطريقة.",
  },
  "little-mary-7": {
    name: "ماري الصغيرة المصغّرة (المحيط)",
    subtitle: "إطار مصغّر 8×8 — راهن على الكبير أو الصغير",
    rules:
      "إطار ضوئي مصغّر 8×8 (28 موضعًا) بنفس آليات الدوران، بثيم حيوانات المحيط (القرش، الحوت، الدولفين، سمك استوائي، السلطعون، الصدفة، الفقاعات). التوقف على سهم يخسر، الرمز المجاني يمنح دورانًا إضافيًا، الرموز الثابتة تدفع مضاعفًا محددًا، والرموز الكبيرة أو الصغيرة تدفع حسب المضاعف الجاري عند المراهنة عليها. قد تنطلق جولة مكافأة جائزة كبرى بعد عدد كافٍ من الدورات.",
  },
  "little-mary-8": {
    name: "ماري الصغيرة المصغّرة (الحلويات)",
    subtitle: "إطار مصغّر 8×8 — ثيم الحلويات",
    rules:
      "نفس آليات الإطار المصغّر 8×8 في إصدار المحيط، بثيم الحلويات (الكعكة، كعكة الفراولة، الكب كيك، الدونات، البسكويت، الحلوى، المصاصة). قد تنطلق جولة مكافأة جائزة كبرى بعد عدد كافٍ من الدورات مع نغمة مميزة.",
  },
  "fruit-slot-1": {
    name: "بكرات الفاكهة الأولى",
    subtitle: "بكرات كلاسيكية 3×3، 5 خطوط دفع",
    rules:
      "ماكينة فاكهة كلاسيكية بـ3 بكرات و3 صفوف و5 خطوط دفع (الصفوف العلوي والأوسط والسفلي بالإضافة إلى القطرين). اضبط رهانك لكل خط ثم أدر — تتوقف كل بكرة بشكل مستقل من اليسار إلى اليمين، ويمكنك الضغط على إيقاف لإنهائها مبكرًا. ثلاثة رموز متطابقة على أي خط تدفع حسب الجدول، من السبعة المحظوظة بـ100 ضعف إلى الكرز بـ4 أضعاف؛ كرزتان أو أكثر في أي مكان على الشاشة تدفعان مواساة صغيرة؛ ثلاث سبعات في الصف الأوسط هي الجائزة الكبرى بعرض ضوئي ونغمة خاصة بها.",
  },
  "fruit-slot-2": {
    name: "بكرات الفاكهة الثانية",
    subtitle: "ثيم فاكهة استوائية، 5 خطوط دفع",
    rules:
      "نفس آليات 3 بكرات و5 خطوط دفع في بكرات الفاكهة الأولى، بثيم استوائي — الألماسة تحل محل السبعة المحظوظة كرمز الجائزة الكبرى، مع الفراولة والأناناس والموز والخوخ والكرز. ثلاثة رموز متطابقة على أي خط تدفع حسب الجدول، من الألماسة بـ100 ضعف إلى الكرز بـ4 أضعاف؛ ثلاث ألماسات في الصف الأوسط هي الجائزة الكبرى.",
  },
  "little-mary-bonus": {
    name: "ماري الصغيرة الكلاسيكية الخامسة (مكافأة السبعة المحظوظة)",
    subtitle: "جولة مكافأة مضاعفة السبعة المحظوظة",
    rules:
      "نفس آليات الدوران، مع رهانات على 8 رموز في آن واحد. ثلاثي بكرات الأرقام في المنتصف يدور عادة بشكل زخرفي بحت؛ عند الفوز هناك فرصة لانطلاق جولة مكافأة تتوقف فيها البكرات الثلاث واحدة تلو الأخرى. التوقف على ثلاثة أرقام فردية متطابقة يضاعف الفوز 10 مرات، وثلاثة أرقام زوجية 5 مرات — مكافأة عشوائية نادرة لا تنطلق في كل مرة.",
  },
  "little-mary-bonus-2": {
    name: "ماري الصغيرة الكلاسيكية الرابعة (مكافأة السبعة المحظوظة، احتفالية)",
    subtitle: "مكافأة السبعة المحظوظة بثيم احتفالي",
    rules:
      "نفس آليات إصدار مكافأة السبعة المحظوظة، بثيم احتفالي (المظروف الأحمر، سبيكة الذهب، الفانوس، اليوسفي، كعكة القمر، الألعاب النارية، الكرز). تعمل جولة المكافأة ومضاعفات تطابق الأرقام 10/5 أضعاف بنفس الطريقة، بألوان ومؤثرات صوتية احتفالية.",
  },
  "xiangqi-mahjong": {
    name: "ماهجونج شيانغتشي",
    subtitle: "كوّن مجموعات من قطع الشطرنج، تسابق مع الحاسوب",
    rules:
      "ضع رهانك، ثم تسحب أنت والحاسوب 5 قطع من الشطرنج الصيني لكل منكما. في دورك، اسحب قطعة — إذا أكملت زوجًا بالإضافة إلى مجموعة (تسلسل أو ثلاثية)، تفوز بالسحب الذاتي. وإلا تخلّ عن إحدى قطعك الست. إذا أكملت قطعة تخلّى عنها الحاسوب يدك، يمكنك المطالبة بها للفوز أو تمريرها ومواصلة السحب. المدفوعات: ضعفان لزوج مختلط مع تسلسل، 3 أضعاف لزوج مع تسلسل من نفس النوع، 5 أضعاف لخمسة جنود أو بيادق؛ المطالبة بقطعة متخلى عنها تدفع حسب المعدل المذكور، والسحب الذاتي يضيف مكافأة. إذا نفدت الأوراق دون فائز، تُعاد الرهانات.",
  },
  tuitongzai: {
    name: "توي تونغ زاي",
    subtitle: "قطع نقاط الماهجونج بأسلوب باي جاو على ثلاثة مواضع",
    rules:
      "تُستخدم قطع دائرية من الماهجونج من 1 إلى 9 (4 من كل نوع) بالإضافة إلى قطع فارغة (4 قطع بقيمة نصف نقطة)، لتمثيل مجموعة من 40 قطعة. ضع رهانات على مواضع الرأس والسماء والذيل، ثم يقلب الموزع وكل موضع قطعتين للمقارنة. ترتيب الرتب: الفراغ المزدوج (الأعلى) يتفوق على أي زوج، الذي يتفوق على تركيبة 2-8، التي تتفوق على المجموع العادي للنقاط (مجموع الأرقام، يُحسب الرقم الأخير، الفراغ = 0.5، 9.5 أفضل مجموع عادي، 0 الأدنى). يُقارن كل موضع مع الموزع بشكل منفصل — الفوز يدفع ضعفًا واحدًا، الأزواج تدفع 4 أضعاف، والفراغ المزدوج يدفع 10 أضعاف؛ المجاميع المتطابقة تُحسم لصالح الموزع حسب قواعد المنزل.",
  },
}

const hi: GameTable = {
  xiangqi: {
    name: "चीनी शतरंज",
    subtitle: "एआई एकल／2 खिलाड़ी",
    rules:
      "बारी-बारी से मोहरे चलाएं; जो पहले प्रतिद्वंद्वी के जनरल को बिना रास्ते के फंसा दे वह जीतता है। पारंपरिक शियांगकी नियमों के अनुसार: रथ सीधा चलता है, घोड़ा L आकार में, हाथी अपने क्षेत्र में तिरछा, सलाहकार महल के पास तिरछा, और सैनिक नदी पार करने के बाद बगल में चल सकता है।",
  },
  "darkchess-classic": {
    name: "डार्क चेस (क्लासिक)",
    subtitle: "एआई एकल／2 खिलाड़ी",
    rules: "सभी मोहरे उलटे रखे जाते हैं; पलटने के बाद पारंपरिक क्रम में खाए जाते हैं। प्रतिद्वंद्वी के सभी मोहरे खाकर या उसे चाल-रहित बनाकर जीत होती है।",
  },
  "darkchess-variant": {
    name: "डार्क चेस (वेरिएंट)",
    subtitle: "एआई एकल／2 खिलाड़ी",
    rules: "क्लासिक जैसा ही, पर तोप का आक्रमण व कूद-कर खाना वेरिएंट नियमों के अनुसार होता है, जिससे नई रणनीतियाँ मिलती हैं।",
  },
  go: {
    name: "गो",
    subtitle: "19×19",
    rules: "बारी-बारी से 19×19 बोर्ड के चौराहों पर काले-सफेद पत्थर रखें; अधिक क्षेत्र घेरने वाला जीतता है। पूरी तरह घिरे व सांस-रहित पत्थर पकड़े जाते हैं।",
  },
  gomoku: { name: "गोमोकू", subtitle: "17×17", rules: "बारी-बारी से पत्थर रखें; क्षैतिज, लंबवत या तिरछी दिशा में पहले पांच लगातार बनाने वाला जीतता है।" },
  othello: {
    name: "ओथेलो",
    subtitle: "स्टैंडर्ड",
    rules: "बारी-बारी से टुकड़े रखें; बीच में फंसे प्रतिद्वंद्वी के टुकड़े आपके रंग में बदल जाते हैं। अंत में अधिक टुकड़े वाला जीतता है।",
  },
  mahjong: {
    name: "चीनी माहजोंग",
    subtitle: "एआई एकल (3 कंप्यूटर)",
    rules: "तीन कंप्यूटर प्रतिद्वंद्वियों के साथ खेलें, बारी-बारी से टाइल उठाएं व फेंकें, चाओ／पोंग／कोंग से दूसरों की फेंकी टाइल ले सकते हैं। पहले वैध विजयी हाथ पूरा करने वाला जीतता है।",
  },
  luzhanqi: {
    name: "लुज़ानकी (सेना शतरंज)",
    subtitle: "एआई एकल／2 खिलाड़ी",
    rules: "दोनों पक्षों के मोहरों की रैंक गुप्त रहती है; प्रतिद्वंद्वी केवल पीठ देखता है। लड़ाई रैंक से तय होती है; पहले दुश्मन का झंडा छीनने या उसे चाल-रहित बनाने वाला जीतता है।",
  },
  checkers: {
    name: "चेकर्स",
    subtitle: "स्टैंडर्ड",
    rules: "बारी-बारी से तिरछा मोहरे चलाएं; कूदकर प्रतिद्वंद्वी के मोहरे खा सकते हैं। सभी मोहरे खाकर या चाल-रहित बनाकर जीत होती है।",
  },
  tictactoe: {
    name: "टिक-टैक-टो",
    subtitle: "बड़ा 3×3 प्रारूप",
    rules: "बारी-बारी से चिन्ह रखें; क्षैतिज, लंबवत या तिरछी दिशा में पहले तीन लगातार बनाने वाला जीतता है।",
  },
  "sichuan-mahjong": {
    name: "सिचुआन माहजोंग",
    subtitle: "एआई (3 कंप्यूटर)",
    rules: "कोई मानव टाइल नहीं, हर हाथ में एक ही शुद्ध फूल (सिर्फ एक किस्म) चाहिए। बारी-बारी से टाइल उठाएं व फेंकें, फेंकी टाइल ले सकते हैं। पहले वैध विजयी हाथ पूरा करने वाला जीतता है।",
  },
  "malaysia-mahjong": {
    name: "मलेशियाई त्रिगुणा माहजोंग",
    subtitle: "एआई (3 कंप्यूटर)",
    rules: "विशेष त्रिगुणा कोंग नियम व बोनस अंकों वाला मलेशियाई संस्करण। बारी-बारी से उठाएं-फेंकें, पहले वैध विजयी हाथ पूरा करने वाला जीतता है।",
  },
  "mahjong-pengpeng": {
    name: "पोंग पोंग हू",
    subtitle: "एआई (3 कंप्यूटर)",
    rules: "विजयी हाथ में केवल पोंग (मैचिंग त्रिक) व एक जोड़ी होनी चाहिए, चाओ नहीं। उठाएं-फेंकें, किसी से भी पोंग मांग सकते हैं।",
  },
  "mahjong-sevens": {
    name: "माहजोंग सेवन्स",
    subtitle: "सेवन्स जैसा, डॉट／बैम्बू／कैरेक्टर सूट के साथ",
    rules: "हर सूट के 5 से शुरू करें, फिर बारी-बारी से उसके आगे-पीछे वाली संख्याएं खेलें। खेलने योग्य टाइल न होने पर दंड के साथ पास करें।",
  },
  "mahjong-solitaire": {
    name: "माहजोंग सॉलिटेयर",
    subtitle: "एकल खिलाड़ी खेल",
    rules: "उजागर टाइलों की मैचिंग जोड़ी (जो कम से कम दोनों तरफ से ढकी न हो) पर टैप करें ताकि हटाई जा सके। जीतने के लिए सभी टाइलें हटाएं।",
  },
  "riichi-mahjong": {
    name: "जापानी रिची माहजोंग",
    subtitle: "एआई (3 कंप्यूटर)",
    rules: "डोरा, रिची व फैन स्कोरिंग के साथ जापानी रिची नियम। जीत से एक टाइल दूर होने पर रिची घोषित करें ताकि सफल होने पर अंक दोगुने हों।",
  },
  bridge: {
    name: "ब्रिज",
    subtitle: "एआई (3 कंप्यूटर)",
    rules: "अपने साथी के साथ विरोधी जोड़ी के खिलाफ बोली लगाएं व पत्ते खेलें। अपने अनुबंध किए गए ट्रिक्स पूरा करके अंक बनाएं।",
  },
  "pick-red-points": {
    name: "रेड पॉइंट्स इकट्ठा",
    subtitle: "खेले पत्ते को मेज़ पर मिलाएं",
    rules: "बारी-बारी से एक पत्ता खेलें: यदि उसकी रैंक मेज़ पर किसी पत्ते से मिलती है, तो वह रैंक की सारी पत्तियाँ व अपना पत्ता लेकर अंक पाएं। न मिलने पर वह मेज़ पर रहता है। डेक खत्म होने पर दोनों पक्षों के लाल हार्ट／डायमंड अंक गिनें—सामान्य लाल पत्ता 1 अंक, लाल दहाई／जैक／क्वीन／किंग 10 अंक। अधिक अंक वाला जीतता है।",
  },
  "dou-dizhu": {
    name: "डू डिझू",
    subtitle: "ज़मींदार बनाम दो किसान",
    rules: "बंटवारे के बाद सिस्टम हाथ की मजबूती के आधार पर एक \"ज़मींदार\" (आप या कंप्यूटर) चुनता है—ज़मींदार 3 अतिरिक्त छिपे पत्ते लेता है, बाकी दो किसान बनकर उसके विरुद्ध टीम बनाते हैं। बारी-बारी से पिछले से ऊंचा संयोजन खेलें, या पास करें। ज़मींदार पहले हाथ खत्म करे तो ज़मींदार जीतता है; कोई भी किसान पहले खत्म करे तो किसान जीतते हैं।",
  },
  "liars-cards": {
    name: "लायर्स कार्ड्स",
    subtitle: "उल्टा खेलें, रैंक बोलें, झूठ पकड़ें",
    rules: "आप व दो कंप्यूटर प्रतिद्वंद्वी बारी-बारी से 1-4 पत्ते उल्टे खेलते हैं व एक रैंक बोलते हैं (रैंक A→2→3→...→K→A क्रम में होनी चाहिए, सच या झूठ बोल सकते हैं)। अन्य खिलाड़ी \"विश्वास\" कर आगे बढ़ा सकते हैं, या \"चुनौती\" देकर पत्ते पलट सकते हैं—सही चुनौती पर खेलने वाला पूरा ढेर लेता है, गलत चुनौती पर चुनौती देने वाला लेता है। बिना पकड़े गए पहले हाथ खत्म करने वाला जीतता है।",
  },
  sevens: {
    name: "सेवन्स",
    subtitle: "एआई (3 कंप्यूटर)",
    rules: "किसी भी सूट के सात से शुरू करें, फिर उसी सूट में क्रमिक पत्ते ऊपर या नीचे खेलें। खेलने योग्य पत्ता न होने पर पास करें; पहले हाथ खत्म करने वाला जीतता है।",
  },
  "merge-2048": {
    name: "2048 मर्ज",
    subtitle: "ग्रिड खेल",
    rules: "सभी टाइलों को एक दिशा में खिसकाने के लिए स्वाइप करें; सटी हुई समान टाइलें मिलकर दोगुनी हो जाती हैं। 2048 टाइल बनाकर जीतें।",
  },
  "city-2048": {
    name: "सिटी 2048",
    subtitle: "भवन-थीम ग्रिड खेल",
    rules: "शहर की समान इमारतों को मिलाकर ऊंचे स्तर पर ले जाएं, छोटे घर से विशाल शहर केंद्र तक। ग्रिड भरने से पहले सबसे ऊंचा स्तर बनाएं।",
  },
  "merge-2048-undo": {
    name: "2048 अनडू",
    subtitle: "अनडू वाला ग्रिड खेल",
    rules: "मानक 2048 नियमों जैसा, पर अनडू बटन के साथ जो गलती होने पर आखिरी चाल वापस लेने देता है।",
  },
  "triple-town": {
    name: "ट्रिपल टाउन",
    subtitle: "निर्माण खेल",
    rules: "ग्रिड पर वस्तुएं रखें; सटी तीन समान वस्तुएं मिलकर ऊंचे स्तर की वस्तु बनती हैं। बोर्ड भरने से बचने के लिए सावधानी से योजना बनाएं।",
  },
  suika: {
    name: "तरबूज़ मर्ज",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "ऊपर से फल गिराएं; छूते हुए समान फल मिलकर बड़ा फल बनते हैं। फलों को कंटेनर के किनारे से बाहर न जाने दें।",
  },
  "drop-2048": {
    name: "2048 ड्रॉप",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "ऊपर से नंबर वाली टाइलें गिराएं; छूती समान टाइलें मिलकर दोगुनी हो जाती हैं। टाइलों को कंटेनर के किनारे से बाहर न जाने दें।",
  },
  puyo: {
    name: "पुयो पुयो",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "रंगीन जेली कैप्सूल गिराएं; एक ही रंग की चार जुड़ी हुई कैप्सूल मिट जाती हैं। लगातार चेन मिटाकर प्रतिद्वंद्वी को बाधा कैप्सूल भेजें।",
  },
  "dr-mario": {
    name: "डॉ. मारियो (मर्ज)",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "रंगीन वायरस कैप्सूल गिराकर एक ही रंग की चार जुड़ी कैप्सूल मिलाएं व मिटाएं। स्तर जीतने के लिए बोर्ड से सभी वायरस हटाएं।",
  },
  "columns-tetris": {
    name: "जेम ब्लॉक्स",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "रंगीन जेम ब्लॉक गिराएं; जुड़े समान जेम मिलकर बड़े हो जाते हैं। ब्लॉकों को कंटेनर के किनारे से बाहर न जाने दें।",
  },
  "balls-merge": {
    name: "बॉल्स मर्ज",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "विभिन्न खेल गेंदें गिराएं; छूती समान गेंदें मिलकर ऊंचे स्तर की गेंद बनती हैं, पिंग-पोंग से लेकर अमेरिकी फुटबॉल तक।",
  },
  "cookies-merge": {
    name: "कुकीज़ मर्ज",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "विभिन्न कुकीज़ व बिस्किट गिराएं; छूते समान टुकड़े मिलकर बड़ी मीठी चीज़ बनते हैं, छोटे बिस्किट से विशाल पिज़्ज़ा तक।",
  },
  "planets-merge": {
    name: "प्लैनेट्स मर्ज",
    subtitle: "फिजिक्स गिरने वाला मर्ज खेल",
    rules: "खगोलीय पिंड गिराएं; छूते समान पिंड मिलकर ऊंचे स्तर का पिंड बनते हैं, तारों से लेकर आकाशगंगा तक।",
  },
  "candy-crush": {
    name: "कैंडी क्रश लीजेंड",
    subtitle: "मैच-3",
    rules: "सटी कैंडी बदलकर तीन या अधिक समान मिलाएं; सीमित चालों में अंक लक्ष्य पूरा करके स्तर जीतें।",
  },
  bejeweled: {
    name: "ज्वेल्ड मेज़",
    subtitle: "मैच-3",
    rules: "सटे जेम बदलकर मैचिंग लाइनें बनाएं; अधिक चेन से अंक गुणा बढ़ता है। कोई चाल सीमा नहीं, अपना सर्वोच्च स्कोर बनाने का प्रयास करें।",
  },
  gardenscapes: {
    name: "ड्रीम गार्डन",
    subtitle: "मरम्मत वाला मैच-3",
    rules: "वस्तुएं मिलाकर सिक्के कमाएं; सिक्कों से जीर्ण बगीचे की मरम्मत करें व क्रमबद्ध कार्य पूरा करें।",
  },
  homescapes: {
    name: "ड्रीम होम",
    subtitle: "सजावट वाला मैच-3",
    rules: "घरेलू सजावट वस्तुएं मिलाकर सिक्के कमाएं; सिक्कों से घर सजाएं व नवीनीकृत करें क्रमबद्ध कार्यों के माध्यम से।",
  },
  "royal-match": {
    name: "रॉयल मैच",
    subtitle: "महल मरम्मत वाला मैच-3",
    rules: "शाही प्रतीक मिलाकर सिक्के कमाएं; सिक्कों से क्रमबद्ध कार्यों के माध्यम से महल के हिस्से बहाल करें।",
  },
  "tower-of-saviors": {
    name: "टॉवर ऑफ सेवियर्स",
    subtitle: "लड़ाई वाला जेम मैच",
    rules: "जेम बदलकर मैचिंग लाइनें बनाएं; तत्व से मैच करने वाले टीम सदस्य दुश्मन पर हमला करते हैं। दुश्मन हराकर अगले स्तर पर बढ़ें।",
  },
  "puzzle-dragons": {
    name: "पज़ल एंड ड्रैगन्स",
    subtitle: "तत्व इंटरैक्शन वाला जेम मैच",
    rules: "जेम बदलकर दुश्मनों पर हमला करें; अधिक नुकसान के लिए प्रभावी तत्व (अग्नि लकड़ी से बेहतर, लकड़ी जल से, जल अग्नि से) का उपयोग करें।",
  },
  "empires-puzzles": {
    name: "एम्पायर्स एंड पज़ल्स",
    subtitle: "शहर निर्माण वाला जेम मैच",
    rules: "जेम बदलकर हीरो से हमला करें; निर्माण सामग्री जीतने के लिए दुश्मन हराएं व प्रगतिशील PvP लड़ाइयों से अपना साम्राज्य बढ़ाएं।",
  },
  "sheep-sheep": {
    name: "शीप ए शीप",
    subtitle: "टैप कलेक्शन खेल",
    rules: "उजागर व न ढकी वस्तुओं पर टैप करके नीचे के भंडार में इकट्ठा करें; भंडार में तीन समान स्वचालित रूप से हट जाती हैं। भंडार भरने से बचें।",
  },
  match3d: {
    name: "3डी मैच कलेक्शन",
    subtitle: "3डी टैप कलेक्शन खेल",
    rules: "3डी ढेर में उजागर वस्तुओं पर टैप करके इकट्ठा करें; तीन समान भंडार से स्वचालित हट जाती हैं। भंडार भरने से पहले सभी वस्तुएं हटाएं।",
  },
  "mahjong-niuniu": {
    name: "माहजोंग निउ निउ",
    subtitle: "कार्ड के बदले माहजोंग टाइल, 10 के गुणज बनाएं",
    rules: "कार्ड के बदले माहजोंग टाइल से निउ निउ खेलें। 5 टाइलों में से, 3 चुनें जिनका योग 10 का गुणज हो, फिर बाकी 2 के अंक की तुलना करें।",
  },
  "dragon-gate": {
    name: "ड्रैगन गेट",
    subtitle: "दो माहजोंग डॉट टाइल गेट खोलती हैं, रेंज पर दांव लगाएं",
    rules: "दो डॉट टाइल गेट के रूप में खुलती हैं; दांव लगाने के बाद तीसरी टाइल खींची जाती है। गेट के बीच में आना जीत है, बाहर हारना है, और किसी एक खंभे से मेल खाने पर हार दोगुनी होती है।",
  },
  blackjack: {
    name: "ब्लैकजैक",
    subtitle: "डीलर के विरुद्ध, 21 के करीब पहुंचें",
    rules: "21 से अधिक न हो, उसके जितना करीब पहुंचें। ऐस 1 या 11 के बराबर है, चित्र कार्ड 10 के बराबर हैं। हिट या स्टैंड चुनें — डीलर को 17 या उससे अधिक तक पहुंचने तक खींचते रहना होगा।",
  },
  baccarat: {
    name: "बैकरेट",
    subtitle: "Player／Banker／Tie",
    rules: "कार्ड बंटने से पहले Player, Banker, या Tie पर दांव लगाएं। योग अंतिम अंक का उपयोग करता है; अधिक योग जीतता है। मानक बैकरेट नियमों के अनुसार अतिरिक्त कार्ड स्वचालित रूप से खींचे जाते हैं।",
  },
  "ten-half": {
    name: "टेन एंड हाफ",
    subtitle: "डीलर से अधिक 10.5 के करीब पहुंचें",
    rules: "दांव लगाएं, फिर दोनों पक्षों को 2 कार्ड मिलते हैं। हिट या स्टैंड चुनें — जो 10.5 से अधिक न होकर उसके सबसे करीब पहुंचे वह जीतता है। ऐस 1 अंक के बराबर है, चित्र कार्ड 0.5 अंक के बराबर हैं। बंटवारे पर प्राकृतिक 10.5 3x भुगतान करता है; सामान्य जीत 2x भुगतान करती है; बराबरी दांव वापस करती है।",
  },
  "thirteen-water": {
    name: "तेरह पत्ती जल",
    subtitle: "डीलर के विरुद्ध 13 कार्ड को 3 हाथों में बांटें",
    rules: "दांव लगाएं और बांटें। सिस्टम स्वचालित रूप से आपके और डीलर के 13 कार्डों को 3-कार्ड वाले आगे के हाथ, 5-कार्ड वाले मध्य हाथ, और 5-कार्ड वाले पीछे के हाथ में व्यवस्थित करता है, जिनकी अलग-अलग तुलना होती है। सभी 3 हाथ जीतने पर 5x भुगतान, 2 जीतने पर 2x, 1 जीतने पर 1.5x, बराबरी पर न भुगतान न नुकसान, और जीत से अधिक हार पर दांव की हानि होती है।",
  },
  "big-two": {
    name: "बिग टू",
    subtitle: "अपना हाथ पहले खाली करने के लिए एकल कार्ड या जोड़े खेलें",
    rules: "दांव लगाएं और डीलर के विरुद्ध खेलें। पिछली चाल से अधिक मजबूत समान रैंक का एकल कार्ड या जोड़ा खेलें, या पास करें। क्रम 3 (सबसे कमजोर) से 2 (सबसे मजबूत) तक है, बराबरी सूट से तय होती है। अपने दांव का 2x जीतने के लिए पहले अपने 13 कार्ड खाली करें।",
  },
  "stud-poker": {
    name: "स्टड पोकर",
    subtitle: "डीलर के विरुद्ध सीधे 5 कार्डों की तुलना करें",
    rules: "दांव लगाएं, फिर आप और डीलर को प्रत्येक को 5 कार्ड मिलते हैं और सीधे रैंक की तुलना करते हैं — स्ट्रेट फ्लश, फोर ऑफ ए काइंड, फुल हाउस, फ्लश, स्ट्रेट, थ्री ऑफ ए काइंड, टू पेयर, पेयर, हाई कार्ड। मजबूत हाथ 2x जीतता है; बराबरी दांव वापस करती है।",
  },
  niuniu: {
    name: "निउ निउ",
    subtitle: "सर्वश्रेष्ठ बुल स्कोर के लिए 5 कार्डों से 10 के गुणज बनाएं",
    rules: "दांव लगाएं, फिर आप और डीलर को प्रत्येक को 5 कार्ड मिलते हैं। 3 चुनें जिनका योग 10 का गुणज हो ('बुल'); बाकी 2 कार्डों का अंतिम अंक आपका स्कोर है, जितना अधिक बेहतर। ठीक 10 सबसे ऊंचा 'बुल बुल' हाथ है; कोई वैध संयोजन न होना सबसे नीचे का 'नो बुल' है। अधिक स्कोर 2x जीतता है; बराबरी दांव वापस करती है। चित्र कार्ड 10 के बराबर हैं, ऐस 1 के बराबर है।",
  },
  "zha-jinhua": {
    name: "थ्री कार्ड फ्लश",
    subtitle: "डीलर के विरुद्ध सीधे 3 कार्डों की तुलना करें",
    rules: "दांव लगाएं, फिर आप और डीलर को प्रत्येक को 3 कार्ड मिलते हैं और सीधे रैंक की तुलना करते हैं — थ्री ऑफ ए काइंड, स्ट्रेट फ्लश, फ्लश, स्ट्रेट, पेयर, हाई कार्ड। मजबूत हाथ 2x जीतता है; बराबरी दांव वापस करती है।",
  },
  "seven-pk": {
    name: "7 कार्ड स्टड",
    subtitle: "4 बंटवारे के दौर — हर चरण में फोल्ड करें या दोगुना करें",
    rules: "अपना शुरुआती दांव तय करें। कार्ड 4 चरणों में बांटे जाते हैं (3, फिर 2, फिर 1, फिर अंतिम 2 प्रकट होते हैं), और हर चरण के बाद आप फोल्ड कर सकते हैं या अपना दांव दोगुना कर सकते हैं। आपके 7 कार्डों में से सर्वश्रेष्ठ 5-कार्ड हाथ परिणाम तय करता है। फोल्ड करने पर आपका वर्तमान कुल दांव खो जाता है; जीत रैंक के अनुसार भुगतान करती है, रॉयल फ्लश 150x से टू पेयर 1x तक।",
  },
  chess: {
    name: "शतरंज",
    subtitle: "एआई एकल／2 खिलाड़ी",
    rules: "बारी-बारी से मोहरे चलाएं; प्रतिद्वंद्वी के राजा को चेकमेट करने वाला पहले जीतता है। प्यादा, किश्ती, घोड़ा, हाथी, रानी व राजा की चाल के लिए मानक शतरंज नियम लागू होते हैं।",
  },
  connect4: {
    name: "कनेक्ट फोर",
    subtitle: "एआई एकल／2 खिलाड़ी",
    rules: "बारी-बारी से खड़ी ग्रिड में टुकड़े गिराएं। क्षैतिज, लंबवत या तिरछी दिशा में पहले चार लगातार बनाने वाला जीतता है।",
  },
  "chinese-checkers": {
    name: "चाइनीज़ चेकर्स",
    subtitle: "स्टार बोर्ड",
    rules: "छह-नुकीले तारे वाले बोर्ड पर, अपने सभी टुकड़े पहले विपरीत कोने में ले जाएं। टुकड़े आगे बढ़ने के लिए कदम बढ़ा सकते हैं या अन्य टुकड़ों पर लगातार कूद सकते हैं।",
  },
  jigsaw: {
    name: "स्लाइडिंग पज़ल",
    subtitle: "नंबर वाली टाइलें",
    rules: "खाली जगह के पास की टाइल पर टैप करें ताकि वह खिसके। चुनौती पूरी करने के लिए टाइलों को 1 से 15 तक क्रम में लगाएं।",
  },
  "number-merge": {
    name: "नंबर मर्ज",
    subtitle: "2048 शैली में",
    rules: "स्वाइप करें या एरो कीज़ का उपयोग करें। टकराने पर मिलती-जुलती टाइलें मिलकर दोगुनी हो जाती हैं; 2048 तक पहुंचकर जीतें।",
  },
  "memory-match": {
    name: "मेमोरी मैच",
    subtitle: "याददाश्त चुनौती",
    rules: "एक बार में दो कार्ड पलटें; मिलती-जुलती जोड़ियां खुली रहती हैं। कम से कम प्रयासों में हर जोड़ी मिलाकर जीतें।",
  },
  ludo: {
    name: "लूडो",
    subtitle: "2 खिलाड़ी",
    rules: "अपने टुकड़ों को बोर्ड के चारों ओर घर तक ले जाने के लिए पासा फेंकें। प्रतिद्वंद्वी के टुकड़े पर उतरने से वह शुरुआत में वापस चला जाता है।",
  },
  solitaire: {
    name: "सॉलिटेयर",
    subtitle: "क्लासिक एकल खिलाड़ी",
    rules: "बोर्ड साफ करने व जीतने के लिए सभी कार्डों को सूट के अनुसार चार फाउंडेशन ढेरों में बढ़ते क्रम में लगाएं।",
  },
  rummikub: {
    name: "रम्मीक्यूब",
    subtitle: "एआई के विरुद्ध टाइल रम्मी",
    rules: "रन या समान संख्या के सेट बनाने के लिए अपनी नंबर वाली टाइलों का उपयोग करें और उन्हें मेज़ पर रखें। जीतने के लिए सबसे पहले अपनी सारी टाइलें खेलें।",
  },
  "rps-battle": {
    name: "रॉक पेपर सिज़र्स",
    subtitle: "एआई के विरुद्ध",
    rules: "कंप्यूटर के विरुद्ध एक साथ रॉक, पेपर या सिज़र्स चुनें। जो अधिक राउंड जीते वह मैच जीतता है।",
  },
  "texas-holdem": {
    name: "टेक्सास होल्डम",
    subtitle: "एआई के विरुद्ध हेड्स-अप (सरलीकृत)",
    rules: "आपके और एआई के पास 2-2 कार्ड हैं, साथ ही 5 साझा कम्युनिटी कार्ड। हाथ प्रकट करने के लिए कॉल करें या छोड़ने के लिए फोल्ड करें — उच्च रैंक वाला हाथ पॉट जीतता है।",
  },
  war: {
    name: "वॉर",
    subtitle: "एआई के विरुद्ध हाई कार्ड",
    rules: "डेक समान रूप से बांटा जाता है। हर राउंड में दोनों पक्ष एक कार्ड पलटते हैं — ऊंचा कार्ड राउंड जीतता है। बराबरी पर युद्ध होता है; अंत में अधिक कार्ड वाला जीतता है।",
  },
  "three-card-poker": {
    name: "थ्री कार्ड पोकर",
    subtitle: "डीलर के विरुद्ध",
    rules: "आपको और डीलर को 3-3 कार्ड मिलते हैं। अपना हाथ देखने के बाद, तुलना के लिए कॉल करें या छोड़ने के लिए फोल्ड करें — उच्च रैंक वाला हाथ जीतता है।",
  },
  klotski: {
    name: "क्लोत्स्की",
    subtitle: "स्लाइडिंग ब्लॉक पज़ल",
    rules: "सीमित बोर्ड स्थान में विभिन्न आकार के ब्लॉक खिसकाएं। जीतने के लिए सबसे बड़े ब्लॉक को नीचे के निकास तक ले जाएं।",
  },
  tetris: {
    name: "टेट्रिस",
    subtitle: "ढेर लगाएं और लाइनें साफ करें",
    rules: "गिरते हुए टुकड़े को हिलाने के लिए बाएं या दाएं स्वाइप करें, घुमाने के लिए टैप करें, तेज़ी से गिराने के लिए नीचे स्वाइप करें। पूरी पंक्ति भरने पर वह साफ हो जाती है व अंक मिलते हैं; ढेर ऊपर पहुंचने पर खेल खत्म होता है।",
  },
  "bubble-shooter": {
    name: "बबल शूटर",
    subtitle: "रंग मिलाकर साफ करें",
    rules: "वर्तमान बबल चलाने के लिए एक लेन पर टैप करें। तीन या अधिक जुड़े समान रंग के बबल अंकों के लिए साफ हो जाते हैं; बबल ऊपर पहुंचने पर खेल खत्म होता है।",
  },
  match3: {
    name: "मैच-3 ब्लास्ट",
    subtitle: "मैच के लिए बदलें",
    rules: "एक टाइल पर टैप करें, फिर बदलने के लिए पड़ोसी टाइल पर टैप करें। समान रंग के 3 या अधिक मिलने पर वे साफ हो जाते हैं व ऊपर से भरते हैं, जिससे और मैच बन सकते हैं।",
  },
  hanoi: {
    name: "टावर ऑफ हनोई",
    subtitle: "डिस्क हिलाएं",
    rules: "ऊपरी डिस्क उठाने के लिए एक खूंटी पर टैप करें, फिर उसे वहां ले जाने के लिए दूसरी खूंटी पर टैप करें। बड़ी डिस्क कभी छोटी पर नहीं रखी जा सकती — जीतने के लिए पूरा ढेर सबसे दाहिनी खूंटी पर ले जाएं।",
  },
  "water-sort": {
    name: "वॉटर सॉर्ट पज़ल",
    subtitle: "रंग छांटने के लिए डालें",
    rules: "ऊपरी रंग उठाने के लिए एक ट्यूब पर टैप करें, फिर उसे डालने के लिए दूसरी ट्यूब पर टैप करें — केवल खाली ट्यूब में या ऊपर समान रंग वाली में। जीतने के लिए हर ट्यूब को एक ही रंग में छांटें।",
  },
  "pipe-connect": {
    name: "पाइप कनेक्ट",
    subtitle: "जोड़ने के लिए घुमाएं",
    rules: "पाइप टाइल को 90° घुमाने के लिए उस पर टैप करें। जीतने के लिए ऊपर-बाएं पानी के स्रोत को नीचे-दाएं निकास से जोड़ें।",
  },
  "stack-tower": {
    name: "स्टैक टावर",
    subtitle: "अपनी ड्रॉप का समय तय करें",
    rules: "ऊपर वाला ब्लॉक बाएं-दाएं झूलता है; उसे नीचे के ढेर पर गिराने के लिए टैप करें। जितना कम ओवरलैप होगा, ब्लॉक उतना संकरा होगा — ढेर को पूरी तरह चूकने पर खेल खत्म होता है।",
  },
  "sequence-sort": {
    name: "सॉर्ट मास्टर",
    subtitle: "क्रम के लिए बदलें",
    rules: "दो नंबर टाइलों की जगह बदलने के लिए उन पर टैप करें। जीतने के लिए कम से कम बदलावों में हर नंबर को छोटे से बड़े क्रम में लगाएं।",
  },
  "mini-sudoku": {
    name: "मिनी सुडोकू",
    subtitle: "6×6 ग्रिड",
    rules: "हर पंक्ति, स्तंभ व 2×3 बॉक्स में बिना दोहराव के 1 से 6 तक संख्याएं होनी चाहिए। बिना टकराव पूरी ग्रिड भरकर जीतें।",
  },
  "shooting-range": {
    name: "शूटिंग रेंज",
    subtitle: "तेज़ प्रतिक्रिया वाले लक्ष्य",
    rules: "ग्रिड में लक्ष्य बेतरतीब ढंग से जलते हैं — अंक पाने के लिए जितनी तेज़ी से हो सके उन पर टैप करें। समय खत्म होने से पहले लक्ष्य स्कोर तक पहुंचकर जीतें।",
  },
  "space-invaders": {
    name: "स्पेस इनवेडर्स",
    subtitle: "जीतने के लिए पूरा बेड़ा साफ करें",
    rules: "दुश्मन की गोलीबारी से बचने के लिए बाएं-दाएं चलें और पूरे एलियन बेड़े को मार गिराएं। बेड़ा पास आने या जानें खत्म होने पर चुनौती विफल होती है।",
  },
  "tank-battle": {
    name: "टैंक बैटल",
    subtitle: "पहले 3 हिट करने वाला जीतता है",
    rules: "अपने टैंक को बाएं-दाएं चलाएं और गोले दागें। प्रतिद्वंद्वी की लेन पर निशाना लगने से अंक मिलता है — जीतने के लिए पहले 3 हिट करें।",
  },
  "brick-breaker": {
    name: "ब्रिक ब्रेकर",
    subtitle: "जीतने के लिए हर ईंट साफ करें",
    rules: "गेंद को उछालने व जीतने के लिए सभी ईंटें तोड़ने के लिए पैडल को बाएं-दाएं खींचें। गेंद नीचे गिरने पर एक जान जाती है; जानें खत्म होने पर चुनौती विफल होती है।",
  },
  "zombie-defense": {
    name: "ज़ॉम्बी डिफेंस",
    subtitle: "जीतने के लिए हर लहर से बचें",
    rules: "ज़ॉम्बी दाईं ओर से लेन में आगे बढ़ते हैं; उन्हें नष्ट करने के लिए टैप करें (कुछ को दो हिट चाहिए)। एक के बाएं किनारे तक पहुंचने पर स्वास्थ्य कम होता है — जीतने के लिए हर लहर से बचें।",
  },
  "air-combat": {
    name: "एयर कॉम्बैट",
    subtitle: "बचें और लक्ष्य स्कोर तक पहुंचें",
    rules: "आपका फाइटर अपने आप गोली चलाता है; दुश्मन के विमानों से बचने व उन्हें साफ करने के लिए बाएं-दाएं चलें। जीतने के लिए समय सीमा तक लक्ष्य स्कोर तक पहुंचते हुए बचे रहें; जानें खत्म होने पर चुनौती विफल होती है।",
  },
  billiards: {
    name: "बिलियर्ड्स",
    subtitle: "निशाना लगाने के लिए खींचें, सभी गेंदें साफ करें",
    rules: "निशाना लगाने के लिए क्यू बॉल से पीछे खींचें, फिर मारने के लिए छोड़ें। जीतने के लिए शॉट खत्म होने से पहले हर रंगीन गेंद को पॉकेट करें।",
  },
  bowling: {
    name: "बॉलिंग",
    subtitle: "3 फ्रेम में पिन लक्ष्य तक पहुंचें",
    rules: "अपना थ्रो एंगल सेट करने के लिए स्लाइडर खींचें, फिर बॉलिंग के लिए छोड़ें। जीतने के लिए 3 फ्रेम के भीतर गिराए गए पिन का लक्ष्य पूरा करें।",
  },
  "basketball-shoot": {
    name: "बास्केटबॉल शूटआउट",
    subtitle: "अपने शॉट का समय तय करें",
    rules: "पावर मीटर अपने आप आगे-पीछे झूलता है — निशाना लगाने के लिए जब यह केंद्र के पास हो तब टैप करें। जीतने के लिए पर्याप्त बास्केट बनाएं।",
  },
  "penalty-kick": {
    name: "पेनल्टी किक",
    subtitle: "गोलकीपर के विरुद्ध दिशा चुनें",
    rules: "बेतरतीब ढंग से छलांग लगाने वाले गोलकीपर के विरुद्ध शूट करने के लिए बाएं, केंद्र या दाएं चुनें। जीतने के लिए 5 राउंड में पर्याप्त गोल करें।",
  },
  racing: {
    name: "रेसिंग रश",
    subtitle: "ट्रैफिक से बचने के लिए लेन बदलें",
    rules: "आने वाले ट्रैफिक से बचने के लिए बाएं-दाएं लेन बदलें। फिनिश दूरी तक पहुंचने से पहले जानें खत्म होने पर चुनौती विफल होती है।",
  },
  parking: {
    name: "पार्किंग चैलेंज",
    subtitle: "अपनी चालों के भीतर पार्क करें",
    rules: "चालें या टक्कर खत्म होने से पहले चिह्नित जगह पर सही से पार्क करने के लिए स्टीयरिंग व आगे बढ़ने के नियंत्रण का उपयोग करें।",
  },
  motocross: {
    name: "मोटोक्रॉस जंप",
    subtitle: "फिनिश तक गड्ढे कूदें",
    rules: "अच्छे समय के साथ अपनी बाइक से कूदने व आगे के गड्ढों को पार करने के लिए टैप करें। फिनिश तक पहुंचने से पहले जानें खत्म होने पर चुनौती विफल होती है।",
  },
  "drift-racing": {
    name: "ड्रिफ्ट रेसिंग",
    subtitle: "अंक पाने के लिए ट्रैक के साथ स्टीयर करें",
    rules: "कोर्स पर बने रहते हुए ड्रिफ्ट अंक बटोरने के लिए ट्रैक के मोड़ों के साथ स्टीयर करें। जीतने के लिए पर्याप्त अंकों के साथ फिनिश तक पहुंचें।",
  },
  "duel-arena": {
    name: "ड्यूल एरेना",
    subtitle: "टर्न-आधारित, पहला नॉकआउट जीतता है",
    rules: "अपना विशेष मीटर भरने के लिए अटैक चुनें, अगली हिट आधी करने के लिए गार्ड चुनें, या मीटर भरने पर फिनिशर छोड़ें। जीतने के लिए प्रतिद्वंद्वी का स्वास्थ्य पहले शून्य करें।",
  },
  "mahjong-ninepoint5": {
    name: "माहजोंग 9.5",
    subtitle: "कार्ड के बदले माहजोंग टाइल, 9.5 के करीब पहुंचें",
    rules: "कार्ड के बदले माहजोंग टाइल का उपयोग करके 9.5 (ब्लैकजैक शैली) खेलें। हिट या स्टैंड करें — 9.5 से अधिक हुए बिना उसके सबसे करीब पहुंचकर जीतें।",
  },
  "five-pk": {
    name: "5-कार्ड पोकर",
    subtitle: "एक बार ड्रॉ करें, फिर डबल-या-नथिंग विकल्प के साथ हाथों की तुलना करें",
    rules:
      "दांव लगाएं, फिर 5 कार्ड बांटे जाते हैं (डेक में 2 जोकर हैं)। चाहे गए कार्ड रखें और बाकी को एक बार बदलने के लिए खींचें। हाथ रैंक के अनुसार भुगतान करते हैं — स्ट्रेट फ्लश 500x, फाइव ऑफ ए काइंड 200x, फ्लश स्ट्रेट 120x, और टू पेयर तक 1x। जीत के बाद आप बड़े/छोटे या लाल/काले पर डबल-या-नथिंग खेल सकते हैं, या कभी भी कैश आउट कर सकते हैं।",
  },
  "little-mary": {
    name: "क्लासिक लिटल मैरी",
    subtitle: "घूमता हुआ लाइट फ्रेम — बड़े या छोटे कार्ड पर दांव लगाएं",
    rules:
      "हर प्रतीक पर दांव लगाएं, फिर शुरू करें। लाइट फ्रेम तेज़ी से 3 चक्कर घूमता है, फिर धीमा होकर आधे से डेढ़ चक्कर के भीतर रुकता है — जल्दी रोकने के लिए स्टॉप टैप करें। एरो पर रुकना हार है; फ्री स्पिन प्रतीक पर रुकने से मुफ्त स्पिन मिलता है; स्थिर प्रतीक एक तय गुणक भुगतान करते हैं; बड़े या छोटे कार्ड प्रतीक दांव लगाने पर चालू गुणक के अनुसार भुगतान करते हैं। पर्याप्त स्पिन के बाद, उच्च निश्चित भुगतान व विशिष्ट ध्वनि वाला बोनस राउंड शुरू हो सकता है।",
  },
  "little-mary-2": {
    name: "क्लासिक लिटल मैरी II",
    subtitle: "स्पोर्ट्स थीम घूमता लाइट फ्रेम",
    rules:
      "क्लासिक लिटल मैरी जैसी ही घूमने की यांत्रिकी, स्पोर्ट्स थीम में (फुटबॉल, रग्बी, बास्केटबॉल, बॉलिंग, टेनिस, टेबल टेनिस, गोल्फ)। हर प्रतीक पर दांव लगाएं फिर शुरू करें — एरो पर रुकना हार है, फ्री प्रतीक मुफ्त स्पिन देता है, स्थिर प्रतीक तय गुणक भुगतान करते हैं, और बड़े या छोटे स्पोर्ट्स प्रतीक दांव लगाने पर चालू गुणक के अनुसार भुगतान करते हैं। पर्याप्त स्पिन के बाद उच्च निश्चित भुगतान वाला बोनस राउंड शुरू हो सकता है।",
  },
  "little-mary-3": {
    name: "क्लासिक लिटल मैरी III",
    subtitle: "फ्लावर-गॉड जैकपॉट — बड़े या छोटे पर दांव लगाएं",
    rules:
      "वही घूमने की यांत्रिकी। तीन फ्लावर-गॉड लाइटें सामान्यतः स्वतंत्र रूप से झपकती हैं; पर्याप्त स्पिन के बाद वे चमकती अलर्ट स्थिति में सिंक हो सकती हैं। यदि उस समय रील बड़े या छोटे प्रतीक समूह पर रुकती है, तो तीनों प्रतीक चालू गुणक के 3x साथ में भुगतान करते हैं — एक दुर्लभ बोनस जैकपॉट।",
  },
  "little-mary-4": {
    name: "क्लासिक लिटल मैरी IV",
    subtitle: "पशु-थीम फ्लावर-गॉड जैकपॉट",
    rules:
      "फ्लावर-गॉड जैकपॉट संस्करण जैसी ही यांत्रिकी, पशु थीम में (बाघ, ड्रैगन, बंदर, लोमड़ी, चूहा, मुर्गा, चूजा)। फ्लावर-गॉड जैकपॉट अलर्ट व 3x भुगतान वैसे ही काम करते हैं।",
  },
  "little-mary-5": {
    name: "क्लासिक लिटल मैरी III (फीनिक्स)",
    subtitle: "फीनिक्स सजावट संस्करण — बड़े या छोटे पर दांव लगाएं",
    rules:
      "वही घूमने की यांत्रिकी। केंद्र में बड़ा फीनिक्स पूरी तरह सजावटी है, बोनस अलर्ट के दौरान तेज़ी से झपकता है। किसी भी फ्री-स्पिन प्रतीक पर रुकने से फ्रेम पर सजावटी लाइट ट्रेल बहती है — केवल दृश्य प्रभाव, भुगतान नहीं बदलता।",
  },
  "little-mary-6": {
    name: "क्लासिक लिटल मैरी IV (फीनिक्स)",
    subtitle: "फीनिक्स सजावट संस्करण — पेय थीम",
    rules:
      "फीनिक्स सजावट संस्करण जैसी ही यांत्रिकी, पेय थीम में (चायदानी, शहद, मेट चाय, कुचली बर्फ, बियर, वाइन, कॉकटेल)। सजावटी फीनिक्स व लाइट ट्रेल प्रभाव वैसे ही काम करते हैं।",
  },
  "little-mary-7": {
    name: "मिनी लिटल मैरी (महासागर)",
    subtitle: "8×8 मिनी फ्रेम — बड़े या छोटे पर दांव लगाएं",
    rules:
      "समान घूमने की यांत्रिकी वाला छोटा 8×8 लाइट फ्रेम (28 स्थान), महासागर पशु थीम में (शार्क, व्हेल, डॉल्फिन, उष्णकटिबंधीय मछली, केकड़ा, सीप, बुलबुले)। एरो पर रुकना हार है, फ्री प्रतीक मुफ्त स्पिन देता है, स्थिर प्रतीक तय गुणक भुगतान करते हैं, और बड़े या छोटे प्रतीक दांव लगाने पर चालू गुणक के अनुसार भुगतान करते हैं। पर्याप्त स्पिन के बाद जैकपॉट बोनस राउंड शुरू हो सकता है।",
  },
  "little-mary-8": {
    name: "मिनी लिटल मैरी (डेज़र्ट)",
    subtitle: "8×8 मिनी फ्रेम — डेज़र्ट थीम",
    rules:
      "महासागर संस्करण जैसी ही 8×8 मिनी-फ्रेम यांत्रिकी, डेज़र्ट थीम में (केक, स्ट्रॉबेरी केक, कपकेक, डोनट, कुकी, कैंडी, लॉलीपॉप)। पर्याप्त स्पिन के बाद विशिष्ट ध्वनि के साथ जैकपॉट बोनस राउंड शुरू हो सकता है।",
  },
  "fruit-slot-1": {
    name: "फ्रूट रील्स I",
    subtitle: "क्लासिक 3×3 रील, 5 पेलाइन",
    rules:
      "5 पेलाइन (ऊपरी, मध्य, निचली पंक्तियां व दोनों तिरछी) वाली क्लासिक 3-रील, 3-पंक्ति फल मशीन। हर लाइन पर अपना दांव सेट करें, फिर घुमाएं — हर रील बाएं से दाएं स्वतंत्र रूप से रुकती है, और आप जल्दी रोकने के लिए स्टॉप टैप कर सकते हैं। किसी भी पेलाइन पर तीन मिलते प्रतीक तालिका के अनुसार भुगतान करते हैं, लकी 7 पर 100x से चेरी पर 4x तक; स्क्रीन पर कहीं भी दो या अधिक चेरी छोटा सांत्वना भुगतान करती हैं; मध्य पंक्ति में तीन 7 जैकपॉट है जिसका अपना लाइट शो व ध्वनि है।",
  },
  "fruit-slot-2": {
    name: "फ्रूट रील्स II",
    subtitle: "उष्णकटिबंधीय फल थीम, 5 पेलाइन",
    rules:
      "फ्रूट रील्स I जैसी ही 3-रील, 5-पेलाइन यांत्रिकी, उष्णकटिबंधीय थीम में — हीरा लकी 7 की जगह जैकपॉट प्रतीक बनता है, स्ट्रॉबेरी, अनानास, केला, आड़ू व चेरी के साथ। किसी भी पेलाइन पर तीन मिलते प्रतीक तालिका के अनुसार भुगतान करते हैं, हीरे पर 100x से चेरी पर 4x तक; मध्य पंक्ति में तीन हीरे जैकपॉट है।",
  },
  "little-mary-bonus": {
    name: "क्लासिक लिटल मैरी V (लकी 7 बोनस)",
    subtitle: "लकी सेवन बोनस गुणक राउंड",
    rules:
      "वही घूमने की यांत्रिकी, एक साथ 8 प्रतीकों पर दांव के साथ। केंद्र में अंक रील की तिकड़ी सामान्यतः पूरी तरह सजावटी घूमती है; जीत पर एक बोनस राउंड शुरू होने का मौका होता है जहां तीनों रील एक-एक करके रुकती हैं। तीन समान विषम अंकों पर रुकने से जीत 10x बढ़ती है, तीन सम अंकों पर 5x — एक दुर्लभ यादृच्छिक बोनस जो हर बार नहीं होता।",
  },
  "little-mary-bonus-2": {
    name: "क्लासिक लिटल मैरी IV (लकी 7 बोनस, उत्सव)",
    subtitle: "उत्सव थीम लकी सेवन बोनस",
    rules:
      "लकी सेवन बोनस संस्करण जैसी ही यांत्रिकी, उत्सव थीम में (लाल लिफाफा, सोने की सिल्ली, लालटेन, संतरा, मूनकेक, पटाखे, चेरी)। बोनस राउंड व 10x/5x अंक मिलान गुणक उत्सव रंगों व ध्वनि प्रभावों के साथ वैसे ही काम करते हैं।",
  },
  "xiangqi-mahjong": {
    name: "शियांगकी माहजोंग",
    subtitle: "शतरंज मोहरों से सेट बनाएं, कंप्यूटर से आगे निकलें",
    rules:
      "दांव लगाएं, फिर आप व कंप्यूटर प्रत्येक 5 चीनी शतरंज मोहरे खींचते हैं। अपनी बारी में, एक मोहरा खींचें — यदि वह जोड़ी व सेट (रन या त्रिक) पूरा करता है, तो आप स्व-ड्रॉ से जीतते हैं। अन्यथा अपने 6 मोहरों में से एक त्यागें। यदि कंप्यूटर का त्यागा हुआ मोहरा आपका हाथ पूरा करता है, तो आप जीतने के लिए उसे ले सकते हैं, या पास करके खींचते रह सकते हैं। भुगतान: मिश्रित जोड़ी-और-रन के लिए 2x, समान सूट जोड़ी-और-रन के लिए 3x, पांच सैनिक या प्यादों के लिए 5x; त्यागा हुआ मोहरा लेना सूचीबद्ध दर पर भुगतान करता है, स्व-ड्रॉ बोनस जोड़ता है। यदि बिना विजेता के डेक खत्म हो जाए, तो दांव वापस कर दिए जाते हैं।",
  },
  tuitongzai: {
    name: "तुईतोंगज़ाई",
    subtitle: "एक साथ तीन स्थानों पर माहजोंग-टाइल पाई गाओ",
    rules:
      "40-टाइल डेक दर्शाने के लिए माहजोंग डॉट टाइल 1–9 (हर एक की 4) व खाली टाइलें (4, आधे अंक की) का उपयोग किया जाता है। हेड, हैवन व टेल स्थानों पर दांव लगाएं, फिर डीलर व हर स्थान तुलना के लिए 2-2 टाइलें पलटते हैं। रैंक क्रम: डबल खाली (सबसे ऊंची) किसी भी जोड़ी को हराती है, जो 2-8 संयोजन को हराती है, जो सामान्य अंक योग को हराती है (अंकों का योग, अंतिम अंक गिना जाता है, खाली = 0.5, 9.5 सबसे अच्छा सामान्य योग है, 0 सबसे नीचे है)। हर स्थान की डीलर से स्वतंत्र रूप से तुलना होती है — जीत 1x भुगतान करती है, जोड़ियां 4x भुगतान करती हैं, डबल खाली 10x भुगतान करता है; मिलते योग हाउस नियम के अनुसार डीलर के पक्ष में जाते हैं।",
  },
}

const tr: GameTable = {
  xiangqi: {
    name: "Çin Satrancı",
    subtitle: "Yapay Zeka Solo／2 Oyuncu",
    rules:
      "Sırayla taş hareket ettirin; rakibin generalini önce çıkışsız köşeye sıkıştıran kazanır. Geleneksel Xiangqi kurallarına uyar: Araba düz gider, At L şeklinde, Fil kendi bölgesinde çapraz, Danışman saray yakınında çapraz, Asker nehri geçtikten sonra yana hareket edebilir.",
  },
  "darkchess-classic": {
    name: "Gizli Satranç (Klasik)",
    subtitle: "Yapay Zeka Solo／2 Oyuncu",
    rules: "Tüm taşlar ters başlar; açıldıktan sonra geleneksel rütbe sırasına göre yenir. Rakibin tüm taşlarını yemek veya onu hamlesiz bırakmak kazandırır.",
  },
  "darkchess-variant": {
    name: "Gizli Satranç (Varyant)",
    subtitle: "Yapay Zeka Solo／2 Oyuncu",
    rules: "Klasik ile aynıdır, ancak topun saldırı ve zıplayarak yeme şekli varyant kurallarına göredir, yeni taktikler ekler.",
  },
  go: {
    name: "Go",
    subtitle: "19×19",
    rules: "Sırayla 19×19 tahtanın kesişim noktalarına siyah-beyaz taş koyun; daha fazla alanı kontrol eden kazanır. Tamamen çevrili ve nefessiz taşlar ele geçirilir.",
  },
  gomoku: { name: "Gomoku", subtitle: "17×17", rules: "Sırayla taş koyun; yatay, dikey veya çapraz olarak önce beş taş dizen kazanır." },
  othello: {
    name: "Othello",
    subtitle: "Standart",
    rules: "Sırayla taş koyun; aranıza sıkışan rakip taşlar sizin renginize döner. Sonunda daha fazla taşı olan kazanır.",
  },
  mahjong: {
    name: "Çin Mahjong'u",
    subtitle: "Yapay Zeka Solo (3 Bilgisayar)",
    rules: "Üç bilgisayar rakibiyle masada oynayın, sırayla taş çekin ve atın, başkalarının attığı taşları Chow／Pong／Kong ile alabilirsiniz. Önce geçerli bir kazanan el tamamlayan kazanır.",
  },
  luzhanqi: {
    name: "Luzhanqi (Ordu Satrancı)",
    subtitle: "Yapay Zeka Solo／2 Oyuncu",
    rules: "Her iki tarafın taş rütbeleri gizlidir; rakip yalnızca arkayı görür. Savaşlar rütbeye göre kararlaştırılır; rakibin bayrağını önce alan veya onu hamlesiz bırakan kazanır.",
  },
  checkers: {
    name: "Dama",
    subtitle: "Standart",
    rules: "Sırayla taşları çapraz hareket ettirin; rakip taşları atlayıp yiyebilirsiniz. Rakibin tüm taşlarını yemek veya onu hamlesiz bırakmak kazandırır.",
  },
  tictactoe: {
    name: "XOX",
    subtitle: "Büyütülmüş 3×3 Format",
    rules: "Sırayla sembol koyun; yatay, dikey veya çapraz olarak önce üç sembol dizen kazanır.",
  },
  "sichuan-mahjong": {
    name: "Sichuan Mahjong",
    subtitle: "Yapay Zeka (3 Bilgisayar)",
    rules: "Karakter taşı yoktur, her el tek bir saf çiçek türü (tek tür) gerektirir. Sırayla çekin ve atın, atılan taşları alabilirsiniz. Önce geçerli bir kazanan el tamamlayan kazanır.",
  },
  "malaysia-mahjong": {
    name: "Malezya Üçlü Mahjong",
    subtitle: "Yapay Zeka (3 Bilgisayar)",
    rules: "Özel üçlü kong kuralları ve bonus puanları olan Malezya versiyonu. Sırayla çekin ve atın, önce geçerli bir kazanan el tamamlayan kazanır.",
  },
  "mahjong-pengpeng": {
    name: "Pong Pong Hu",
    subtitle: "Yapay Zeka (3 Bilgisayar)",
    rules: "Kazanan el yalnızca pong (eşleşen üçlüler) ve bir çiftten oluşmalı, chow yok. Çekin ve atın, herkesten pong talep edebilirsiniz.",
  },
  "mahjong-sevens": {
    name: "Mahjong Sevens",
    subtitle: "Sevens gibi, Nokta／Bambu／Karakter takımlarıyla",
    rules: "Her takımın 5'inden başlayın, ardından sırayla bitişik sayıları oynayın. Oynanabilir taşınız yoksa cezalı pas geçin.",
  },
  "mahjong-solitaire": {
    name: "Mahjong Solitaire",
    subtitle: "Tek Oyunculu Oyun",
    rules: "Açıkta olan (en az iki yandan kapalı olmayan) eşleşen bir çift taşa dokunarak kaldırın. Kazanmak için tüm taşları temizleyin.",
  },
  "riichi-mahjong": {
    name: "Japon Riichi Mahjong",
    subtitle: "Yapay Zeka (3 Bilgisayar)",
    rules: "Dora, riichi ve fan puanlamasıyla Japon riichi kuralları. Kazanmaya bir taş kala riichi ilan edin, başarılı olursanız puanlarınız ikiye katlanır.",
  },
  bridge: {
    name: "Briç",
    subtitle: "Yapay Zeka (3 Bilgisayar)",
    rules: "Ortağınızla birlikte rakip çifte karşı ihale yapın ve kart oynayın. Taahhüt ettiğiniz el sayısını tamamlayarak puan kazanın.",
  },
  "pick-red-points": {
    name: "Kırmızı Puan Toplama",
    subtitle: "Oynanan kartı masadaki kartla eşleştirin",
    rules: "Sırayla bir kart oynayın: değeri masadaki bir kartla eşleşirse, o değere ait tüm kartları ve kendi kartınızı alıp puan kazanırsınız. Eşleşmezse masada kalır. Deste tükendiğinde her iki tarafın topladığı kırmızı kupa／karo kartlarını sayın — normal kırmızı kart 1 puan, kırmızı onlu／vale／kız／papaz 10 puan. Yüksek puan kazanır.",
  },
  "dou-dizhu": {
    name: "Dou Dizhu",
    subtitle: "Toprak Ağası vs İki Çiftçi",
    rules: "Dağıtımdan sonra sistem el gücüne göre otomatik olarak birini (siz veya bilgisayar) \"toprak ağası\" seçer — toprak ağası 3 ekstra gizli kart alır, diğer ikisi çiftçi olarak ona karşı birleşir. Sırayla son oynanandan yüksek kombinasyonlar oynayın veya pas geçin. Toprak ağası önce elini bitirirse toprak ağası kazanır; herhangi bir çiftçi önce bitirirse çiftçiler kazanır.",
  },
  "liars-cards": {
    name: "Liar's Cards",
    subtitle: "Ters oynayın, değer söyleyin, yalanı yakalayın",
    rules: "Siz ve iki bilgisayar rakibi sırayla 1-4 kartı ters çevirip bir değer (A→2→3→...→K→A sırasına uymalı, doğru veya yalan söyleyebilirsiniz) ilan eder. Diğerleri \"güvenebilir\" ve pas geçebilir, veya \"itiraz edebilir\" ve kartları çevirip kontrol edebilir — doğru itirazda oynayan tüm yığını alır, yanlış itirazda itiraz eden alır. Yalanı yakalanmadan önce elini bitiren kazanır.",
  },
  sevens: {
    name: "Sevens",
    subtitle: "Yapay Zeka (3 Bilgisayar)",
    rules: "Herhangi bir takımdan yedi ile başlayın, sonra aynı takımdan ardışık kartları yukarı veya aşağı oynayın. Oynanabilir kartınız yoksa pas geçin; elini önce bitiren kazanır.",
  },
  "merge-2048": {
    name: "2048 Birleştir",
    subtitle: "Izgara Oyunu",
    rules: "Tüm taşları bir yöne kaydırmak için kaydırın; bitişik eşleşen taşlar birleşir ve değeri ikiye katlanır. 2048 taşına ulaşarak kazanın.",
  },
  "city-2048": {
    name: "Şehir 2048",
    subtitle: "Bina Temalı Izgara Oyunu",
    rules: "Eşleşen şehir binalarını birleştirerek daha yüksek seviyelere taşıyın, küçük bir evden devasa bir şehir merkezine kadar. Izgara dolmadan önce en yüksek seviyeyi inşa edin.",
  },
  "merge-2048-undo": {
    name: "2048 Geri Al",
    subtitle: "Geri Alma Özellikli Izgara Oyunu",
    rules: "Standart 2048 kurallarıyla aynı, ancak bir hata yaptığınızda son hamleyi geri almanızı sağlayan bir geri al düğmesiyle birlikte.",
  },
  "triple-town": {
    name: "Triple Town",
    subtitle: "İnşa Oyunu",
    rules: "Izgaraya nesneler yerleştirin; bitişik üç eşleşen nesne birleşerek daha yüksek seviyeli bir nesne oluşturur. Tahtanın dolmasını önlemek için dikkatli planlayın.",
  },
  suika: {
    name: "Karpuz Birleştirme",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Yukarıdan meyve düşürün; birbirine dokunan eşleşen meyveler birleşerek daha büyük bir meyve oluşturur. Meyvelerin kabın kenarından taşmasını önleyin.",
  },
  "drop-2048": {
    name: "2048 Düşür",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Yukarıdan numaralı taşlar düşürün; dokunan eşleşen taşlar birleşerek değeri ikiye katlanır. Taşların kabın kenarından taşmasını önleyin.",
  },
  puyo: {
    name: "Puyo Puyo",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Renkli jöle kapsülleri düşürün; aynı renkten bağlı dört kapsül silinir. Rakibe engel kapsülleri göndermek için art arda zincirler temizleyin.",
  },
  "dr-mario": {
    name: "Dr. Mario (Birleştirme)",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Renkli virüs kapsülleri düşürerek aynı renkten dört bağlı kapsülü eşleştirip silin. Seviyeyi kazanmak için tahtadaki tüm virüsleri temizleyin.",
  },
  "columns-tetris": {
    name: "Gem Blocks",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Renkli mücevher blokları düşürün; bağlı eşleşen mücevherler birleşip büyür. Blokların kabın kenarından taşmasını önleyin.",
  },
  "balls-merge": {
    name: "Top Birleştirme",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Farklı spor toplarını düşürün; dokunan eşleşen toplar pinpondan Amerikan futboluna kadar daha yüksek seviyeli bir top oluşturmak üzere birleşir.",
  },
  "cookies-merge": {
    name: "Kurabiye Birleştirme",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Farklı kurabiye ve bisküvileri düşürün; dokunan eşleşen parçalar küçük bisküviden devasa pizzaya kadar daha büyük bir tatlı oluşturmak üzere birleşir.",
  },
  "planets-merge": {
    name: "Gezegen Birleştirme",
    subtitle: "Fizik Tabanlı Düşen Birleştirme Oyunu",
    rules: "Gök cisimlerini düşürün; dokunan eşleşen cisimler yıldızlardan galaksilere kadar daha yüksek seviyeli bir cisim oluşturmak üzere birleşir.",
  },
  "candy-crush": {
    name: "Şeker Efsanesi",
    subtitle: "3'lü Eşleştirme",
    rules: "Üç veya daha fazla eşleşme oluşturmak için bitişik şekerleri değiştirin; sınırlı hamle içinde puan hedefine ulaşarak seviyeyi kazanın.",
  },
  bejeweled: {
    name: "Mücevher Labirenti",
    subtitle: "3'lü Eşleştirme",
    rules: "Eşleşen çizgiler oluşturmak için bitişik mücevherleri değiştirin; daha fazla zincir puan çarpanınızı artırır. Hamle sınırı yok, en yüksek skorunuzu kırmaya çalışın.",
  },
  gardenscapes: {
    name: "Hayal Bahçesi",
    subtitle: "Onarımlı 3'lü Eşleştirme",
    rules: "Nesneleri eşleştirerek para kazanın; parayı harap bahçeyi onarmak ve sıralı görevleri tamamlamak için kullanın.",
  },
  homescapes: {
    name: "Hayal Evi",
    subtitle: "Dekorasyonlu 3'lü Eşleştirme",
    rules: "Ev dekorasyon öğelerini eşleştirerek para kazanın; parayı sıralı görevlerle evi dekore etmek ve yenilemek için kullanın.",
  },
  "royal-match": {
    name: "Kraliyet Eşleştirmesi",
    subtitle: "Şato Onarımlı 3'lü Eşleştirme",
    rules: "Kraliyet rozetlerini eşleştirerek para kazanın; parayı sıralı görevlerle şato bölümlerini onarmak için kullanın.",
  },
  "tower-of-saviors": {
    name: "Kurtarıcılar Kulesi",
    subtitle: "Savaşlı Mücevher Eşleştirme",
    rules: "Eşleşen çizgiler oluşturmak için mücevherleri değiştirin; elementi eşleşen takım üyeleri düşmana saldırır. Bir sonraki seviyeye geçmek için düşmanı yenin.",
  },
  "puzzle-dragons": {
    name: "Puzzle & Dragons",
    subtitle: "Element Etkileşimli Mücevher Eşleştirme",
    rules: "Düşmanlara saldırmak için mücevherleri değiştirin; daha fazla hasar için avantajlı elementleri (ateş odunu yener, odun suyu, su ateşi) kullanın.",
  },
  "empires-puzzles": {
    name: "İmparatorluklar ve Bulmacalar",
    subtitle: "Şehir İnşalı Mücevher Eşleştirme",
    rules: "Kahramanlarla saldırmak için mücevherleri değiştirin; inşaat malzemeleri kazanmak için düşmanları yenin ve kademeli PvP savaşlarıyla imparatorluğunuzu büyütün.",
  },
  "sheep-sheep": {
    name: "Koyun ve Koyun",
    subtitle: "Dokunarak Toplama Oyunu",
    rules: "Açıkta olan ve kapatılmamış nesnelere dokunarak alttaki depoda toplayın; depoda üç eşleşen otomatik olarak silinir. Deponun dolmasını önleyin.",
  },
  match3d: {
    name: "3D Eşleştirme Toplama",
    subtitle: "3D Dokunarak Toplama Oyunu",
    rules: "3D yığındaki açıkta olan nesnelere dokunarak toplayın; üç eşleşen otomatik olarak depodan silinir. Depo dolmadan önce tüm nesneleri temizleyin.",
  },
  "mahjong-niuniu": {
    name: "Mahjong Niu Niu",
    subtitle: "Kart yerine mahjong taşları, 10'un katlarını oluştur",
    rules: "Kart yerine mahjong taşlarıyla Niu Niu oynayın. 5 taştan, toplamı 10'un katı olan 3'ünü seçin, ardından kalan 2'nin puanını karşılaştırın.",
  },
  "dragon-gate": {
    name: "Ejderha Kapısı",
    subtitle: "İki mahjong nokta taşı kapıyı açar, aralığa bahis yap",
    rules: "İki nokta taşı kapı olarak açılır; bahsinizi koyun, ardından üçüncü taş çekilir. Kapı arasına düşmek kazanır, dışına düşmek kaybeder, direklerden birine eşit olmak kaybı ikiye katlar.",
  },
  blackjack: {
    name: "Blackjack",
    subtitle: "Krupiyeye karşı, 21'e yaklaşın",
    rules: "21'i geçmeden mümkün olduğunca yaklaşın. As 1 veya 11 değerinde, resimli kartlar 10 değerinde. Kart Çek veya Dur seçin — krupiye 17 veya üzerine çıkana kadar çekmek zorundadır.",
  },
  baccarat: {
    name: "Bakara",
    subtitle: "Player／Banker／Tie",
    rules: "Kartlar dağıtılmadan önce Player, Banker veya Tie'a bahis koyun. Toplam, toplamın son hanesini kullanır; daha yüksek toplam kazanır. Ek kartlar standart bakara kurallarına göre otomatik çekilir.",
  },
  "ten-half": {
    name: "On Buçuk",
    subtitle: "Krupiyeden daha çok 10,5'e yaklaşın",
    rules: "Bahis koyun, ardından her iki taraf 2 kart alır. Kart Çek veya Dur seçin — 10,5'i geçmeden ona en çok yaklaşan kazanır. As 1 puan değerinde, resimli kartlar 0,5 puan değerinde. Dağıtımda doğal 10,5 3x öder; normal kazanç 2x öder; berabere bahsi geri verir.",
  },
  "thirteen-water": {
    name: "On Üç Kart Suyu",
    subtitle: "13 kartı krupiyeye karşı 3 ele bölün",
    rules: "Bahis koyun ve dağıtın. Sistem otomatik olarak sizin ve krupiyenin 13 kartını 3 kartlık ön el, 5 kartlık orta el ve 5 kartlık arka el olarak düzenler, ayrı ayrı karşılaştırılır. 3 elin hepsini kazanmak 5x öder, 2 el kazanmak 2x, 1 el kazanmak 1,5x, berabere ne öder ne kaybettirir, kazanmaktan fazla kaybetmek bahsi kaybettirir.",
  },
  "big-two": {
    name: "Big Two",
    subtitle: "Elinizi önce boşaltmak için tek kart veya çift oynayın",
    rules: "Bahis koyun ve krupiyeye karşı oynayın. Son oynanıştan daha güçlü aynı sıradan tek kart veya çift oynayın, ya da geçin. Sıralama 3 (en zayıf) ile 2 (en güçlü) arasındadır, berabereliği suit belirler. Bahsinizin 2 katını kazanmak için önce 13 kartınızı boşaltın.",
  },
  "stud-poker": {
    name: "Stud Poker",
    subtitle: "Krupiyeye karşı doğrudan 5 kartı karşılaştırın",
    rules: "Bahis koyun, ardından siz ve krupiye her biri 5 kart alır ve sırayı doğrudan karşılaştırırsınız — sıralı flush, kare, full house, flush, sıralı, üçlü, çift çift, çift, yüksek kart. Daha güçlü el 2x kazanır; berabere bahsi geri verir.",
  },
  niuniu: {
    name: "Niu Niu",
    subtitle: "En iyi boğa puanı için 5 karttan 10'un katlarını oluşturun",
    rules: "Bahis koyun, ardından siz ve krupiye her biri 5 kart alır. Toplamı 10'un katı olan 3'ünü seçin ('boğa'); kalan 2 kartın son hanesi puanınızdır, yüksek olması daha iyidir. Tam 10, en yüksek 'Boğa Boğa' elidir; geçerli kombinasyon yoksa en düşük 'Boğa Yok' olur. Daha yüksek puan 2x kazanır; berabere bahsi geri verir. Resimli kartlar 10 değerinde, As 1 değerindedir.",
  },
  "zha-jinhua": {
    name: "Three Card Flush",
    subtitle: "Krupiyeye karşı doğrudan 3 kartı karşılaştırın",
    rules: "Bahis koyun, ardından siz ve krupiye her biri 3 kart alır ve sırayı doğrudan karşılaştırırsınız — üçlü, sıralı flush, flush, sıralı, çift, yüksek kart. Daha güçlü el 2x kazanır; berabere bahsi geri verir.",
  },
  "seven-pk": {
    name: "7 Card Stud",
    subtitle: "4 dağıtım turu — her aşamada çekilin veya ikiye katlayın",
    rules: "Başlangıç bahsinizi belirleyin. Kartlar 4 aşamada dağıtılır (3, sonra 2, sonra 1, sonra son 2 açılır), ve her aşamadan sonra çekilebilir veya bahsinizi ikiye katlayabilirsiniz. 7 kartınızdan en iyi 5 kartlık el sonucu belirler. Çekilmek şu anki toplam bahsinizi kaybettirir; kazanç sıraya göre öder, royal flush 150x'ten çift çifte 1x'e kadar.",
  },
  chess: {
    name: "Satranç",
    subtitle: "Yapay Zeka Solo／2 Oyuncu",
    rules: "Sırayla taş hareket ettirin; rakibin şahını mat eden önce kazanır. Piyon, kale, at, fil, vezir ve şahın hareketi için standart satranç kurallarına uyar.",
  },
  connect4: {
    name: "Dörtlü Bağlan",
    subtitle: "Yapay Zeka Solo／2 Oyuncu",
    rules: "Sırayla dikey ızgaraya taş bırakın. Yatay, dikey veya çapraz olarak önce dört taş dizen kazanır.",
  },
  "chinese-checkers": {
    name: "Çin Daması",
    subtitle: "Yıldız Tahta",
    rules: "Altı köşeli yıldız tahtasında, tüm taşlarınızı önce karşı köşeye taşıyın. Taşlar ilerlemek için adım atabilir veya diğer taşların üzerinden art arda zıplayabilir.",
  },
  jigsaw: {
    name: "Kaydırmalı Bulmaca",
    subtitle: "Numaralı Taşlar",
    rules: "Boş alanın yanındaki taşa dokunarak kaydırın. Zorluğu tamamlamak için taşları 1'den 15'e sırayla dizin.",
  },
  "number-merge": {
    name: "Sayı Birleştirme",
    subtitle: "2048 Tarzı",
    rules: "Kaydırın veya ok tuşlarını kullanın. Çarpışan eşleşen taşlar birleşir ve değeri ikiye katlanır; 2048'e ulaşarak kazanın.",
  },
  "memory-match": {
    name: "Hafıza Eşleştirme",
    subtitle: "Eşleştirme Zorluğu",
    rules: "Bir seferde iki kart çevirin; eşleşen çiftler açık kalır. Kazanmak için her çifti mümkün olduğunca az denemeyle eşleştirin.",
  },
  ludo: {
    name: "Ludo",
    subtitle: "2 Oyuncu",
    rules: "Taşlarınızı tahtada hareket ettirip eve ulaştırmak için zar atın. Rakibin taşına inmek onu başa gönderir.",
  },
  solitaire: {
    name: "Solitaire",
    subtitle: "Klasik Tek Oyunculu",
    rules: "Tahtayı temizlemek ve kazanmak için tüm kartları suitlerine göre dört temel yığına artan sırayla dizin.",
  },
  rummikub: {
    name: "Rummikub",
    subtitle: "Yapay Zekaya Karşı Taş Remi",
    rules: "Numaralı taşlarınızı kullanarak seriler veya aynı sayıdan setler oluşturun ve masaya koyun. Tüm taşlarını önce oynayan kazanır.",
  },
  "rps-battle": {
    name: "Taş Kağıt Makas",
    subtitle: "Yapay Zekaya Karşı",
    rules: "Bilgisayara karşı aynı anda taş, kağıt veya makas seçin. Daha fazla tur kazanan maçı kazanır.",
  },
  "texas-holdem": {
    name: "Teksas Holdem",
    subtitle: "Yapay Zekaya Karşı Birebir (Basitleştirilmiş)",
    rules: "Siz ve yapay zeka 2'şer karta sahipsiniz, ayrıca 5 ortak kart var. Elleri açmak için Çağır veya pes etmek için Katlan — daha yüksek sıralı el potu kazanır.",
  },
  war: {
    name: "Savaş",
    subtitle: "Yapay Zekaya Karşı Yüksek Kart",
    rules: "Deste eşit olarak bölünür. Her turda iki taraf da bir kart çevirir — yüksek kart turu kazanır. Beraberlik savaşı tetikler; sonunda daha fazla kartı olan kazanır.",
  },
  "three-card-poker": {
    name: "Üç Kart Pokeri",
    subtitle: "Krupiyeye Karşı",
    rules: "Siz ve krupiye 3'er kart alırsınız. Elinizi gördükten sonra karşılaştırmak için Çağır veya pes etmek için Katlan — daha yüksek sıralı el kazanır.",
  },
  klotski: {
    name: "Klotski",
    subtitle: "Kaydırmalı Blok Bulmaca",
    rules: "Sınırlı tahta alanında farklı boyutlardaki blokları kaydırın. Kazanmak için en büyük bloğu alttaki çıkışa taşıyın.",
  },
  tetris: {
    name: "Tetris",
    subtitle: "İstifleyin ve Satırları Temizleyin",
    rules: "Düşen parçayı hareket ettirmek için sola veya sağa kaydırın, döndürmek için dokunun, hızlı düşürmek için aşağı kaydırın. Bir satırı tamamen doldurmak onu temizler ve puan kazandırır; yığın en üste ulaşırsa oyun biter.",
  },
  "bubble-shooter": {
    name: "Balon Atıcı",
    subtitle: "Renkleri Eşleştirip Temizleyin",
    rules: "Mevcut balonu ateşlemek için bir şerite dokunun. Bağlı üç veya daha fazla eşleşen balon puan için temizlenir; balonlar en üste ulaşırsa oyun biter.",
  },
  match3: {
    name: "3'lü Eşleştirme Patlaması",
    subtitle: "Eşleştirmek İçin Değiştirin",
    rules: "Bir taşa, ardından komşu bir taşa dokunarak değiştirin. Aynı renkten 3 veya daha fazlasını eşleştirmek onları temizler ve yukarıdan yeniden doldurur, bu da zincirleme eşleşmelere yol açabilir.",
  },
  hanoi: {
    name: "Hanoi Kulesi",
    subtitle: "Diskleri Taşıyın",
    rules: "Üst diski almak için bir çubuğa dokunun, ardından taşımak için başka bir çubuğa dokunun. Daha büyük bir disk asla daha küçüğünün üzerine konamaz — kazanmak için tüm yığını en sağdaki çubuğa taşıyın.",
  },
  "water-sort": {
    name: "Su Sıralama Bulmacası",
    subtitle: "Renkleri Sıralamak İçin Dökün",
    rules: "Üstteki rengi almak için bir tüpe dokunun, ardından dökmek için başka bir tüpe dokunun — yalnızca boş bir tüpe veya üstü aynı renk olana. Kazanmak için her tüpü tek bir renge sıralayın.",
  },
  "pipe-connect": {
    name: "Boru Bağlantısı",
    subtitle: "Bağlamak İçin Döndürün",
    rules: "Boru taşını 90° döndürmek için dokunun. Kazanmak için sol üstteki su kaynağını sağ alttaki çıkışa bağlayın.",
  },
  "stack-tower": {
    name: "İstif Kulesi",
    subtitle: "Düşüşünüzün Zamanlamasını Ayarlayın",
    rules: "Üstteki blok sağa sola sallanır; alttaki yığının üzerine düşürmek için dokunun. Ne kadar az örtüşürse blok o kadar daralır — yığını tamamen kaçırmak oyunu bitirir.",
  },
  "sequence-sort": {
    name: "Sıralama Ustası",
    subtitle: "Sıralamak İçin Değiştirin",
    rules: "Yerlerini değiştirmek için iki sayı taşına dokunun. Kazanmak için tüm sayıları mümkün olduğunca az değişimle küçükten büyüğe sıralayın.",
  },
  "mini-sudoku": {
    name: "Mini Sudoku",
    subtitle: "6×6 Izgara",
    rules: "Her satır, sütun ve 2×3 kutu tekrarsız 1'den 6'ya kadar sayılar içermelidir. Kazanmak için çatışma olmadan tüm ızgarayı doldurun.",
  },
  "shooting-range": {
    name: "Atış Poligonu",
    subtitle: "Hızlı Refleks Hedefleri",
    rules: "Hedefler ızgarada rastgele yanar — puan kazanmak için olabildiğince hızlı dokunun. Süre bitmeden hedef skora ulaşarak kazanın.",
  },
  "space-invaders": {
    name: "Uzay İstilacıları",
    subtitle: "Kazanmak İçin Filoyu Temizleyin",
    rules: "Düşman ateşinden kaçmak için sola sağa hareket edin ve tüm uzaylı filosunu vurun. Filo yaklaşırsa veya canlarınız biterse zorluk başarısız olur.",
  },
  "tank-battle": {
    name: "Tank Savaşı",
    subtitle: "İlk 3 İsabeti Yapan Kazanır",
    rules: "Tankınızı sola sağa hareket ettirin ve mermi ateşleyin. Rakibin şeridine isabet bir puan kazandırır — kazanmak için önce 3 isabet elde edin.",
  },
  "brick-breaker": {
    name: "Tuğla Kırıcı",
    subtitle: "Kazanmak İçin Tüm Tuğlaları Temizleyin",
    rules: "Topu sektirip tüm tuğlaları kırmak için raketi sola sağa sürükleyin. Topun altan düşmesi bir can kaybettirir; canlarınız biterse zorluk başarısız olur.",
  },
  "zombie-defense": {
    name: "Zombi Savunması",
    subtitle: "Kazanmak İçin Her Dalgayı Atlatın",
    rules: "Zombiler sağdan şeritte ilerler; yok etmek için dokunun (bazıları iki vuruş gerektirir). Birinin sol kenara ulaşması canınızı azaltır — kazanmak için tüm dalgaları atlatın.",
  },
  "air-combat": {
    name: "Hava Muharebesi",
    subtitle: "Hayatta Kalın ve Hedef Skora Ulaşın",
    rules: "Uçağınız otomatik ateş eder; düşman uçaklarından kaçmak ve onları temizlemek için sola sağa hareket edin. Kazanmak için süre boyunca hedef skora ulaşarak hayatta kalın; canlarınızın bitmesi zorluğu başarısız kılar.",
  },
  billiards: {
    name: "Bilardo",
    subtitle: "Nişan Almak İçin Çekin, Tüm Topları Temizleyin",
    rules: "Nişan almak için beyaz toptan geriye doğru çekin, ardından vurmak için bırakın. Kazanmak için vuruşlarınız bitmeden tüm renkli topları cebe sokun.",
  },
  bowling: {
    name: "Bowling",
    subtitle: "3 Frame İçinde Hedef Pine Ulaşın",
    rules: "Atış açınızı ayarlamak için kaydırıcıyı sürükleyin, ardından bowling topunu atmak için bırakın. Kazanmak için 3 frame içinde hedef devrilen pin sayısına ulaşın.",
  },
  "basketball-shoot": {
    name: "Basketbol Atışı",
    subtitle: "Atışınızın Zamanlamasını Ayarlayın",
    rules: "Güç ölçer otomatik olarak ileri geri sallanır — merkeze yakınken basmak puan kazandırır. Kazanmak için yeterince basket yapın.",
  },
  "penalty-kick": {
    name: "Penaltı Vuruşu",
    subtitle: "Kaleciye Karşı Bir Taraf Seçin",
    rules: "Rastgele atlayan bir kaleciye karşı vurmak için sol, orta veya sağı seçin. Kazanmak için 5 turda yeterince gol atın.",
  },
  racing: {
    name: "Yarış Hamlesi",
    subtitle: "Trafikten Kaçmak İçin Şerit Değiştirin",
    rules: "Gelen trafikten kaçmak için sola sağa şerit değiştirin. Bitiş mesafesine ulaşmadan canlarınız biterse zorluk başarısız olur.",
  },
  parking: {
    name: "Park Etme Zorluğu",
    subtitle: "Hamle Sınırında Park Edin",
    rules: "Hamleleriniz veya çarpışmalarınız bitmeden işaretli yere tam olarak park etmek için direksiyon ve ileri kontrollerini kullanın.",
  },
  motocross: {
    name: "Motokros Atlayışı",
    subtitle: "Bitişe Kadar Çukurları Atlayın",
    rules: "Motosikletinizle zıplamak ve öndeki çukurları iyi zamanlamayla aşmak için dokunun. Bitişe ulaşmadan canlarınız biterse zorluk başarısız olur.",
  },
  "drift-racing": {
    name: "Drift Yarışı",
    subtitle: "Puan Kazanmak İçin Pistle Yönlendirin",
    rules: "Rotada kalırken drift puanı toplamak için pistin virajlarıyla yönlendirin. Kazanmak için yeterli puanla bitişe ulaşın.",
  },
  "duel-arena": {
    name: "Düello Arenası",
    subtitle: "Sıra Tabanlı, İlk Nakavt Kazanır",
    rules: "Özel ölçerinizi doldurmak için Saldırı, bir sonraki vuruşu yarıya indirmek için Savunma seçin veya ölçer doluyken Bitirici hamlenizi kullanın. Kazanmak için rakibinizin canını önce sıfırlayın.",
  },
  "mahjong-ninepoint5": {
    name: "Mahjong Dokuz Buçuk",
    subtitle: "Kart yerine mahjong taşları, 9,5'e yaklaşın",
    rules: "Kart yerine mahjong taşları kullanarak 9,5'i (blackjack tarzı) oynayın. Kart çekin veya durun — 9,5'i geçmeden ona en çok yaklaşan kazanır.",
  },
  "five-pk": {
    name: "5 Kart Pokeri",
    subtitle: "Bir kez değişim, ardından katla ya da yok seçeneğiyle elleri karşılaştırın",
    rules:
      "Bahis koyun, ardından 5 kart dağıtılır (destede 2 joker vardır). İstediğiniz kartları tutun ve kalanları bir kez değiştirmek için çekin. Eller sıraya göre öder — sıralı flush 500x, beşli 200x, flush sıralı 120x, çift çifte kadar 1x. Kazandıktan sonra büyük/küçük veya kırmızı/siyah üzerine katla ya da yok oynayabilir, ya da istediğiniz zaman nakde çevirebilirsiniz.",
  },
  "little-mary": {
    name: "Klasik Küçük Mary",
    subtitle: "Dönen Işık Çerçevesi — Büyük veya Küçük Kartlara Bahis Yapın",
    rules:
      "Her sembole bahis koyun, ardından başlayın. Işık çerçevesi hızla 3 tur döner, ardından yavaşlar ve yarım turdan bir buçuk tura kadar bir aralıkta durur — erken bitirmek için Dur'a dokunun. Bir oka durmak kaybettirir; ücretsiz dönüş sembolüne durmak ücretsiz yeniden dönüş verir; sabit semboller belirli bir çarpan öder; büyük veya küçük kart sembolleri üzerlerine bahis yapılmışsa geçerli çarpana göre öder. Yeterli dönüşten sonra daha yüksek sabit ödemeli ve kendine özgü bir sesle bir bonus tur tetiklenebilir.",
  },
  "little-mary-2": {
    name: "Klasik Küçük Mary II",
    subtitle: "Spor Temalı Dönen Işık Çerçevesi",
    rules:
      "Klasik Küçük Mary ile aynı dönme mekaniği, spor temasıyla (futbol, ragbi, basketbol, bowling, tenis, masa tenisi, golf) yeniden düzenlenmiş. Her sembole bahis koyun ardından başlayın — bir oka durmak kaybettirir, ücretsiz sembol ekstra dönüş verir, sabit semboller belirli bir çarpan öder, büyük veya küçük spor sembolleri üzerlerine bahis yapılmışsa geçerli çarpana göre öder. Yeterli dönüşten sonra yüksek sabit ödemeli bir bonus tur tetiklenebilir.",
  },
  "little-mary-3": {
    name: "Klasik Küçük Mary III",
    subtitle: "Çiçek Tanrısı Jackpot — Büyük veya Küçüğe Bahis Yapın",
    rules:
      "Aynı dönme mekaniği. Üç çiçek tanrısı ışığı normalde bağımsız yanıp söner; yeterli dönüşten sonra yanıp sönen bir uyarı durumunda senkronize olabilirler. Makara o anda büyük veya küçük sembol grubunda durursa, üç sembol de birlikte geçerli çarpanın 3 katını öder — nadir bir bonus jackpot.",
  },
  "little-mary-4": {
    name: "Klasik Küçük Mary IV",
    subtitle: "Hayvan Temalı Çiçek Tanrısı Jackpot",
    rules:
      "Çiçek Tanrısı Jackpot sürümüyle aynı mekanik, hayvan temasıyla (kaplan, ejderha, maymun, tilki, fare, horoz, civciv) yeniden düzenlenmiş. Çiçek tanrısı jackpot uyarısı ve 3x ödeme aynı şekilde çalışır.",
  },
  "little-mary-5": {
    name: "Klasik Küçük Mary III (Anka Kuşu)",
    subtitle: "Anka Kuşu Dekorasyon Sürümü — Büyük veya Küçüğe Bahis Yapın",
    rules:
      "Aynı dönme mekaniği. Ortadaki büyük anka kuşu tamamen dekoratiftir, bonus uyarısı sırasında daha hızlı yanıp söner. Herhangi bir ücretsiz dönüş sembolüne durmak çerçeve boyunca dekoratif bir ışık izi süpürür — sadece görsel bir efekt, ödemeyi değiştirmez.",
  },
  "little-mary-6": {
    name: "Klasik Küçük Mary IV (Anka Kuşu)",
    subtitle: "Anka Kuşu Dekorasyon Sürümü — İçecek Teması",
    rules:
      "Anka Kuşu Dekorasyon sürümüyle aynı mekanik, içecek temasıyla (çaydanlık, bal, mate çayı, kırık buz, bira, şarap, kokteyl) yeniden düzenlenmiş. Dekoratif anka kuşu ve ışık izi efektleri aynı şekilde çalışır.",
  },
  "little-mary-7": {
    name: "Mini Küçük Mary (Okyanus)",
    subtitle: "8×8 Mini Çerçeve — Büyük veya Küçüğe Bahis Yapın",
    rules:
      "Aynı dönme mekaniğiyle daha küçük 8×8'lik bir ışık çerçevesi (28 konum), okyanus hayvanları temasıyla (köpekbalığı, balina, yunus, tropik balık, yengeç, kabuk, kabarcıklar). Bir oka durmak kaybettirir, ücretsiz sembol ekstra dönüş verir, sabit semboller belirli bir çarpan öder, büyük veya küçük semboller üzerlerine bahis yapılmışsa geçerli çarpana göre öder. Yeterli dönüşten sonra bir jackpot bonus turu tetiklenebilir.",
  },
  "little-mary-8": {
    name: "Mini Küçük Mary (Tatlı)",
    subtitle: "8×8 Mini Çerçeve — Tatlı Teması",
    rules:
      "Okyanus sürümüyle aynı 8×8 mini çerçeve mekaniği, tatlı temasıyla (kek, çilekli kek, kapkek, donut, kurabiye, şeker, lolipop) yeniden düzenlenmiş. Yeterli dönüşten sonra kendine özgü bir sesle jackpot bonus turu tetiklenebilir.",
  },
  "fruit-slot-1": {
    name: "Meyve Makaraları I",
    subtitle: "Klasik 3×3 Makara, 5 Ödeme Hattı",
    rules:
      "5 ödeme hattı (üst, orta, alt sıralar artı iki diyagonal) olan klasik 3 makaralı, 3 sıralı bir meyve makinesi. Hat başına bahsinizi ayarlayın, ardından çevirin — her makara soldan sağa bağımsız olarak durur, erken bitirmek için Dur'a dokunabilirsiniz. Herhangi bir hatta üç eşleşen sembol tabloya göre öder, şanslı 7'de 100x'ten kirazda 4x'e kadar; ekranda herhangi bir yerde iki veya daha fazla kiraz küçük bir teselli öder; orta sırada üç 7, kendi ışık şovu ve sesi olan jackpottur.",
  },
  "fruit-slot-2": {
    name: "Meyve Makaraları II",
    subtitle: "Tropikal Meyve Teması, 5 Ödeme Hattı",
    rules:
      "Meyve Makaraları I ile aynı 3 makaralı, 5 ödeme hatlı mekanik, tropikal temada — elmas, çilek, ananas, muz, şeftali ve kirazla eşleşerek şanslı 7'nin yerini jackpot sembolü olarak alır. Herhangi bir hatta üç eşleşen sembol tabloya göre öder, elmasta 100x'ten kirazda 4x'e kadar; orta sırada üç elmas jackpottur.",
  },
  "little-mary-bonus": {
    name: "Klasik Küçük Mary V (Şanslı 7 Bonusu)",
    subtitle: "Şanslı Yedililer Bonus Çarpan Turu",
    rules:
      "Aynı dönme mekaniği, aynı anda 8 sembole bahis ile. Ortadaki rakam makaralarının üçlüsü normalde tamamen dekoratif döner; kazanıldığında üç makaranın birer birer durduğu bir bonus turun tetiklenme şansı vardır. Üç aynı tek rakamda durmak kazancı 10 katına çıkarır, üç çift rakamda 5 katına — her seferinde tetiklenmeyen nadir, rastgele bir bonus.",
  },
  "little-mary-bonus-2": {
    name: "Klasik Küçük Mary IV (Şanslı 7 Bonusu, Bayram)",
    subtitle: "Bayram Temalı Şanslı Yedililer Bonusu",
    rules:
      "Şanslı Yedililer Bonusu sürümüyle aynı mekanik, bayram temasıyla (kırmızı zarf, altın külçe, fener, mandalina, ay keki, havai fişek, kiraz) yeniden düzenlenmiş. Bonus tur ve 10x/5x rakam eşleşme çarpanları bayram renkleri ve ses efektleriyle aynı şekilde çalışır.",
  },
  "xiangqi-mahjong": {
    name: "Xiangqi Mahjong",
    subtitle: "Satranç taşlarından setler oluşturun, bilgisayarla yarışın",
    rules:
      "Bahis koyun, ardından siz ve bilgisayar her biri 5 Çin satranç taşı çekersiniz. Sıranızda bir taş çekin — bir çift artı bir seti (seri veya üçlü) tamamlıyorsa, kendi çekişinizle kazanırsınız. Aksi takdirde 6 taşınızdan birini atın. Bilgisayarın attığı taş elinizi tamamlıyorsa, kazanmak için alabilir veya geçip çekmeye devam edebilirsiniz. Ödemeler: karışık çift-artı-seri için 2x, aynı takımdan çift-artı-seri için 3x, beş asker veya piyon için 5x; atılan taşı almak belirtilen oranda öder, kendi çekişi bonus ekler. Deste kazanan olmadan biterse, bahisler iade edilir.",
  },
  tuitongzai: {
    name: "Tuitongzai",
    subtitle: "Üç pozisyonda aynı anda mahjong taşı pai gow",
    rules:
      "40 taşlık bir desteyi temsil etmek için 1-9 arası daire mahjong taşları (her birinden 4 tane) ve yarım puan değerindeki boş taşlar (4 tane) kullanılır. Baş, gök ve kuyruk pozisyonlarına bahis koyun, ardından krupiye ve her pozisyon karşılaştırmak için 2'şer taş çevirir. Sıralama: çift boş (en yüksek) herhangi bir çifti yener, bu da 2-8 kombinasyonunu yener, bu da normal puan toplamını yener (rakamların toplamı, son hane sayılır, boş = 0,5, 9,5 en iyi normal toplamdır, 0 en düşüktür). Her pozisyon krupiyeyle bağımsız olarak karşılaştırılır — kazanmak 1x öder, çiftler 4x öder, çift boş 10x öder; eşleşen toplamlar kurum kuralına göre krupiyenin lehine sonuçlanır.",
  },
}

const bn: GameTable = {
  xiangqi: {
    name: "চীনা দাবা",
    subtitle: "এআই একক／২ খেলোয়াড়",
    rules:
      "পালাক্রমে ঘুঁটি নাড়ুন; যে প্রথমে প্রতিপক্ষের জেনারেলকে কোণঠাসা করবে সে জয়ী হবে। ঐতিহ্যবাহী শিয়াংছি নিয়ম অনুসরণ করে: রথ সোজা চলে, ঘোড়া L আকারে, হাতি নিজের এলাকায় তির্যক, উপদেষ্টা রাজপ্রাসাদের কাছে তির্যক, সৈনিক নদী পার হওয়ার পর পাশে যেতে পারে।",
  },
  "darkchess-classic": {
    name: "ডার্ক চেস (ক্লাসিক)",
    subtitle: "এআই একক／২ খেলোয়াড়",
    rules: "সব ঘুঁটি উল্টো রাখা হয়; উল্টে দেখানোর পর ঐতিহ্যবাহী পদক্রম অনুযায়ী খাওয়া হয়। প্রতিপক্ষের সব ঘুঁটি খেয়ে ফেলা বা তাকে চাল-শূন্য করে দেওয়াই জয়।",
  },
  "darkchess-variant": {
    name: "ডার্ক চেস (ভ্যারিয়েন্ট)",
    subtitle: "এআই একক／২ খেলোয়াড়",
    rules: "ক্লাসিকের মতোই, তবে কামানের আক্রমণ ও লাফিয়ে খাওয়ার নিয়ম ভিন্ন, যা নতুন কৌশল যুক্ত করে।",
  },
  go: {
    name: "গো",
    subtitle: "১৯×১৯",
    rules: "পালাক্রমে ১৯×১৯ বোর্ডের সংযোগস্থলে কালো-সাদা পাথর রাখুন; যে বেশি এলাকা দখল করবে সে জয়ী। সম্পূর্ণ ঘেরাও হওয়া নিঃশ্বাসহীন পাথর ধরা পড়ে।",
  },
  gomoku: { name: "গোমোকু", subtitle: "১৭×১৭", rules: "পালাক্রমে পাথর রাখুন; আনুভূমিক, উলম্ব বা তির্যকভাবে প্রথমে পাঁচটি সাজানো খেলোয়াড় জয়ী।" },
  othello: {
    name: "অথেলো",
    subtitle: "স্ট্যান্ডার্ড",
    rules: "পালাক্রমে ঘুঁটি রাখুন; মাঝে আটকে পড়া প্রতিপক্ষের ঘুঁটি আপনার রঙে বদলে যায়। শেষে বেশি ঘুঁটি থাকা খেলোয়াড় জয়ী।",
  },
  mahjong: {
    name: "চীনা মাহজং",
    subtitle: "এআই একক (৩ কম্পিউটার)",
    rules: "তিন কম্পিউটার প্রতিপক্ষের সাথে খেলুন, পালাক্রমে টাইল তুলুন ও ফেলুন, অন্যের ফেলা টাইল চাও／পং／কং করে নিতে পারেন। প্রথমে বৈধ জয়ী হাত সম্পূর্ণ করা খেলোয়াড় জয়ী।",
  },
  luzhanqi: {
    name: "লুজানছি (সামরিক দাবা)",
    subtitle: "এআই একক／২ খেলোয়াড়",
    rules: "দুই পক্ষের ঘুঁটির পদমর্যাদা গোপন থাকে; প্রতিপক্ষ শুধু পেছনের দিক দেখে। যুদ্ধ পদমর্যাদা অনুযায়ী নির্ধারিত হয়; প্রথমে প্রতিপক্ষের পতাকা দখল বা তাকে চাল-শূন্য করা খেলোয়াড় জয়ী।",
  },
  checkers: {
    name: "চেকার্স",
    subtitle: "স্ট্যান্ডার্ড",
    rules: "পালাক্রমে তির্যকভাবে ঘুঁটি নাড়ুন; ঝাঁপ দিয়ে প্রতিপক্ষের ঘুঁটি খেতে পারেন। প্রতিপক্ষের সব ঘুঁটি খাওয়া বা তাকে চাল-শূন্য করাই জয়।",
  },
  tictactoe: {
    name: "টিক-ট্যাক-টো",
    subtitle: "বড় ৩×৩ ফরম্যাট",
    rules: "পালাক্রমে চিহ্ন রাখুন; আনুভূমিক, উলম্ব বা তির্যকভাবে প্রথমে তিনটি সাজানো খেলোয়াড় জয়ী।",
  },
  "sichuan-mahjong": {
    name: "সিচুয়ান মাহজং",
    subtitle: "এআই (৩ কম্পিউটার)",
    rules: "কোনো ক্যারেক্টার টাইল নেই, প্রতি হাতে এক ধরনের বিশুদ্ধ ফুল (একটিমাত্র ধরন) প্রয়োজন। পালাক্রমে তুলুন ও ফেলুন, ফেলা টাইল নিতে পারেন। প্রথমে বৈধ জয়ী হাত সম্পূর্ণ করা খেলোয়াড় জয়ী।",
  },
  "malaysia-mahjong": {
    name: "মালয়েশিয়ান ট্রিপল মাহজং",
    subtitle: "এআই (৩ কম্পিউটার)",
    rules: "বিশেষ ট্রিপল কং নিয়ম ও বোনাস স্কোরসহ মালয়েশিয়ান সংস্করণ। পালাক্রমে তুলুন-ফেলুন, প্রথমে বৈধ জয়ী হাত সম্পূর্ণ করলে জয়ী।",
  },
  "mahjong-pengpeng": {
    name: "পং পং হু",
    subtitle: "এআই (৩ কম্পিউটার)",
    rules: "জয়ী হাতে শুধু পং (মিলানো ত্রিক) ও একটি জোড়া থাকতে হবে, চাও নেই। তুলুন-ফেলুন, যে কারো কাছ থেকে পং দাবি করতে পারেন।",
  },
  "mahjong-sevens": {
    name: "মাহজং সেভেনস",
    subtitle: "সেভেনসের মতো, ডট／বামবু／ক্যারেক্টার স্যুটে",
    rules: "প্রতি স্যুটের ৫ থেকে শুরু করুন, তারপর পালাক্রমে পাশের সংখ্যা খেলুন। খেলার মতো টাইল না থাকলে জরিমানাসহ পাস করুন।",
  },
  "mahjong-solitaire": {
    name: "মাহজং সলিটেয়ার",
    subtitle: "একক খেলোয়াড় খেলা",
    rules: "উন্মুক্ত (অন্তত দুই পাশ ঢাকা না থাকা) মিলানো টাইলের জোড়ায় ট্যাপ করে অপসারণ করুন। জয়ের জন্য সব টাইল পরিষ্কার করুন।",
  },
  "riichi-mahjong": {
    name: "জাপানি রিচি মাহজং",
    subtitle: "এআই (৩ কম্পিউটার)",
    rules: "দোরা, রিচি ও ফ্যান স্কোরিংসহ জাপানি রিচি নিয়ম। জয়ের এক টাইল দূরে থাকলে রিচি ঘোষণা করুন, সফল হলে স্কোর দ্বিগুণ হবে।",
  },
  bridge: {
    name: "ব্রিজ",
    subtitle: "এআই (৩ কম্পিউটার)",
    rules: "আপনার পার্টনারের সাথে প্রতিপক্ষ জোড়ার বিরুদ্ধে বিড করুন ও কার্ড খেলুন। আপনার চুক্তিকৃত ট্রিক সংখ্যা সম্পূর্ণ করে স্কোর করুন।",
  },
  "pick-red-points": {
    name: "রেড পয়েন্ট সংগ্রহ",
    subtitle: "খেলা কার্ড টেবিলের কার্ডের সাথে মিলান",
    rules: "পালাক্রমে একটি কার্ড খেলুন: এর র‍্যাঙ্ক টেবিলের কোনো কার্ডের সাথে মিললে, সেই র‍্যাঙ্কের সব কার্ড ও আপনার কার্ড নিয়ে পয়েন্ট পান। না মিললে তা টেবিলে থাকে। ডেক শেষ হলে দুই পক্ষের সংগ্রহ করা লাল হার্ট／ডায়মন্ড গণনা করুন—সাধারণ লাল কার্ড ১ পয়েন্ট, লাল দহলা／জ্যাক／কুইন／কিং ১০ পয়েন্ট করে। বেশি পয়েন্টধারী জয়ী।",
  },
  "dou-dizhu": {
    name: "দৌ দিঝু",
    subtitle: "জমিদার বনাম দুই কৃষক",
    rules: "বিতরণের পর সিস্টেম হাতের শক্তি অনুযায়ী একজনকে \"জমিদার\" (আপনি বা কম্পিউটার) নির্বাচন করে—জমিদার ৩টি অতিরিক্ত গোপন কার্ড নেয়, বাকি দুজন কৃষক হয়ে তার বিরুদ্ধে দল বাঁধে। পালাক্রমে আগের চালের চেয়ে উচ্চতর সমন্বয় খেলুন বা পাস করুন। জমিদার আগে হাত শেষ করলে জমিদার জয়ী; কোনো কৃষক আগে শেষ করলে কৃষকরা জয়ী।",
  },
  "liars-cards": {
    name: "লায়ার্স কার্ডস",
    subtitle: "উল্টো খেলুন, র‍্যাঙ্ক বলুন, মিথ্যা ধরুন",
    rules: "আপনি ও দুই কম্পিউটার প্রতিপক্ষ পালাক্রমে ১-৪টি কার্ড উল্টো খেলে একটি র‍্যাঙ্ক ঘোষণা করেন (র‍্যাঙ্ক A→2→3→...→K→A ক্রমে হতে হবে, সত্য বা মিথ্যা বলতে পারেন)। অন্যরা \"বিশ্বাস\" করে পাস করতে পারেন, বা \"চ্যালেঞ্জ\" করে কার্ড উল্টে যাচাই করতে পারেন—সঠিক চ্যালেঞ্জে খেলোয়াড় পুরো স্তূপ নেয়, ভুল চ্যালেঞ্জে চ্যালেঞ্জকারী নেয়। মিথ্যা না ধরা পড়ে আগে হাত খালি করলে জয়ী।",
  },
  sevens: {
    name: "সেভেনস",
    subtitle: "এআই (৩ কম্পিউটার)",
    rules: "কোনো স্যুটের সাত দিয়ে শুরু করুন, তারপর একই স্যুটে ক্রমিক কার্ড উপরে বা নিচে খেলুন। খেলার মতো কার্ড না থাকলে পাস করুন; হাত আগে শেষ করলে জয়ী।",
  },
  "merge-2048": {
    name: "২০৪৮ মার্জ",
    subtitle: "গ্রিড খেলা",
    rules: "সব টাইল এক দিকে সরাতে সোয়াইপ করুন; সংলগ্ন মিলানো টাইল মিশে দ্বিগুণ হয়ে যায়। ২০৪৮ টাইল তৈরি করে জয়ী হন।",
  },
  "city-2048": {
    name: "সিটি ২০৪৮",
    subtitle: "বিল্ডিং থিমের গ্রিড খেলা",
    rules: "মিলানো শহরের বিল্ডিং একত্রিত করে উচ্চতর স্তরে তুলুন, ছোট বাড়ি থেকে বিশাল শহর কেন্দ্র পর্যন্ত। গ্রিড ভর্তি হওয়ার আগে সর্বোচ্চ স্তর তৈরি করুন।",
  },
  "merge-2048-undo": {
    name: "২০৪৮ আনডু",
    subtitle: "আনডু সহ গ্রিড খেলা",
    rules: "স্ট্যান্ডার্ড ২০৪৮ নিয়মের মতোই, কিন্তু একটি আনডু বাটন সহ যা ভুল হলে শেষ চাল বাতিল করতে দেয়।",
  },
  "triple-town": {
    name: "ট্রিপল টাউন",
    subtitle: "নির্মাণ খেলা",
    rules: "গ্রিডে বস্তু রাখুন; সংলগ্ন তিনটি মিলানো বস্তু একত্রিত হয়ে উচ্চতর স্তরের বস্তু তৈরি করে। বোর্ড ভর্তি এড়াতে সাবধানে পরিকল্পনা করুন।",
  },
  suika: {
    name: "তরমুজ মার্জ",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "উপর থেকে ফল ফেলুন; স্পর্শকারী মিলানো ফল একত্রিত হয়ে বড় ফল তৈরি করে। ফলকে কন্টেইনারের কিনারা ছাড়িয়ে যেতে দেবেন না।",
  },
  "drop-2048": {
    name: "২০৪৮ ড্রপ",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "উপর থেকে সংখ্যাযুক্ত টাইল ফেলুন; স্পর্শকারী মিলানো টাইল একত্রিত হয়ে দ্বিগুণ হয়ে যায়। টাইলকে কন্টেইনারের কিনারা ছাড়িয়ে যেতে দেবেন না।",
  },
  puyo: {
    name: "পুয়ো পুয়ো",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "রঙিন জেলি ক্যাপসুল ফেলুন; একই রঙের সংযুক্ত চারটি ক্যাপসুল মুছে যায়। প্রতিপক্ষকে বাধা ক্যাপসুল পাঠাতে ধারাবাহিক চেইন পরিষ্কার করুন।",
  },
  "dr-mario": {
    name: "ডা. মারিও (মার্জ)",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "রঙিন ভাইরাস ক্যাপসুল ফেলে একই রঙের সংযুক্ত চারটি মিলিয়ে মুছুন। স্তর জয়ের জন্য বোর্ড থেকে সব ভাইরাস পরিষ্কার করুন।",
  },
  "columns-tetris": {
    name: "জেম ব্লকস",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "রঙিন জেম ব্লক ফেলুন; সংযুক্ত মিলানো জেম একত্রিত হয়ে বড় হয়ে যায়। ব্লককে কন্টেইনারের কিনারা ছাড়িয়ে যেতে দেবেন না।",
  },
  "balls-merge": {
    name: "বল মার্জ",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "বিভিন্ন খেলার বল ফেলুন; স্পর্শকারী মিলানো বল পিং-পং থেকে আমেরিকান ফুটবল পর্যন্ত উচ্চতর স্তরের বল তৈরি করতে একত্রিত হয়।",
  },
  "cookies-merge": {
    name: "কুকি মার্জ",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "বিভিন্ন কুকি ও বিস্কুট ফেলুন; স্পর্শকারী মিলানো টুকরা ছোট বিস্কুট থেকে বিশাল পিজা পর্যন্ত বড় মিষ্টি তৈরি করতে একত্রিত হয়।",
  },
  "planets-merge": {
    name: "প্ল্যানেট মার্জ",
    subtitle: "পদার্থবিজ্ঞান-ভিত্তিক পতন মার্জ খেলা",
    rules: "মহাকাশীয় বস্তু ফেলুন; স্পর্শকারী মিলানো বস্তু তারা থেকে গ্যালাক্সি পর্যন্ত উচ্চতর স্তরের বস্তু তৈরি করতে একত্রিত হয়।",
  },
  "candy-crush": {
    name: "ক্যান্ডি ক্রাশ লিজেন্ড",
    subtitle: "৩-ম্যাচ",
    rules: "তিন বা তার বেশি মিলানো তৈরি করতে সংলগ্ন ক্যান্ডি অদলবদল করুন; সীমিত চালের মধ্যে স্কোর লক্ষ্য পূর্ণ করে স্তর জয়ী হন।",
  },
  bejeweled: {
    name: "জুয়েলড মেজ",
    subtitle: "৩-ম্যাচ",
    rules: "মিলানো লাইন তৈরি করতে সংলগ্ন জেম অদলবদল করুন; বেশি চেইনে স্কোর মাল্টিপ্লায়ার বাড়ে। কোনো চালের সীমা নেই, আপনার সর্বোচ্চ স্কোর ভাঙার চেষ্টা করুন।",
  },
  gardenscapes: {
    name: "ড্রিম গার্ডেন",
    subtitle: "মেরামতসহ ৩-ম্যাচ",
    rules: "বস্তু মিলিয়ে কয়েন অর্জন করুন; কয়েন দিয়ে জরাজীর্ণ বাগান মেরামত করুন ও ধারাবাহিক কাজ সম্পূর্ণ করুন।",
  },
  homescapes: {
    name: "ড্রিম হোম",
    subtitle: "সাজসজ্জাসহ ৩-ম্যাচ",
    rules: "ঘর সাজানোর উপকরণ মিলিয়ে কয়েন অর্জন করুন; কয়েন দিয়ে ধারাবাহিক কাজের মাধ্যমে ঘর সাজান ও সংস্কার করুন।",
  },
  "royal-match": {
    name: "রয়্যাল ম্যাচ",
    subtitle: "প্রাসাদ মেরামতসহ ৩-ম্যাচ",
    rules: "রাজকীয় প্রতীক মিলিয়ে কয়েন অর্জন করুন; কয়েন দিয়ে ধারাবাহিক কাজের মাধ্যমে প্রাসাদের অংশ পুনরুদ্ধার করুন।",
  },
  "tower-of-saviors": {
    name: "টাওয়ার অফ সেভিয়র্স",
    subtitle: "যুদ্ধসহ জেম ম্যাচ",
    rules: "মিলানো লাইন তৈরি করতে জেম অদলবদল করুন; উপাদান মিলে যাওয়া দলের সদস্যরা শত্রুকে আক্রমণ করে। পরবর্তী স্তরে যেতে শত্রুকে পরাজিত করুন।",
  },
  "puzzle-dragons": {
    name: "পাজল অ্যান্ড ড্রাগনস",
    subtitle: "উপাদান মিথস্ক্রিয়াসহ জেম ম্যাচ",
    rules: "শত্রুকে আক্রমণ করতে জেম অদলবদল করুন; বেশি ক্ষতির জন্য সুবিধাজনক উপাদান ব্যবহার করুন (আগুন কাঠকে পরাজিত করে, কাঠ পানিকে, পানি আগুনকে)।",
  },
  "empires-puzzles": {
    name: "এম্পায়ারস অ্যান্ড পাজলস",
    subtitle: "শহর নির্মাণসহ জেম ম্যাচ",
    rules: "হিরো দিয়ে আক্রমণ করতে জেম অদলবদল করুন; নির্মাণ সামগ্রী অর্জনের জন্য শত্রুকে পরাজিত করুন ও ক্রমবর্ধমান PvP যুদ্ধের মাধ্যমে আপনার সাম্রাজ্য বড় করুন।",
  },
  "sheep-sheep": {
    name: "শিপ অ্যান্ড শিপ",
    subtitle: "ট্যাপ সংগ্রহ খেলা",
    rules: "উন্মুক্ত ও অবরুদ্ধ নয় এমন বস্তুতে ট্যাপ করে নিচের ভাণ্ডারে সংগ্রহ করুন; ভাণ্ডারে তিনটি মিলানো স্বয়ংক্রিয়ভাবে মুছে যায়। ভাণ্ডার ভর্তি হওয়া এড়িয়ে চলুন।",
  },
  match3d: {
    name: "৩ডি ম্যাচ কালেকশন",
    subtitle: "৩ডি ট্যাপ সংগ্রহ খেলা",
    rules: "৩ডি স্তূপে উন্মুক্ত বস্তুতে ট্যাপ করে সংগ্রহ করুন; তিনটি মিলানো ভাণ্ডার থেকে স্বয়ংক্রিয়ভাবে মুছে যায়। ভাণ্ডার ভর্তি হওয়ার আগে সব বস্তু পরিষ্কার করুন।",
  },
  "mahjong-niuniu": {
    name: "মাহজং নিউ নিউ",
    subtitle: "কার্ডের বদলে মাহজং টাইল, ১০-এর গুণিতক তৈরি করুন",
    rules: "কার্ডের বদলে মাহজং টাইল দিয়ে নিউ নিউ খেলুন। ৫টি টাইল থেকে, ৩টি বেছে নিন যার যোগফল ১০-এর গুণিতক হয়, তারপর বাকি ২টির স্কোর তুলনা করুন।",
  },
  "dragon-gate": {
    name: "ড্রাগন গেট",
    subtitle: "দুটি মাহজং ডট টাইল গেট খোলে, পরিসরে বাজি রাখুন",
    rules: "দুটি ডট টাইল গেট হিসেবে প্রকাশ হয়; বাজি রাখার পর তৃতীয় টাইল টানা হয়। গেটের মধ্যে পড়লে জয়, বাইরে হার, এবং কোনো একটি খুঁটির সাথে মিললে হার দ্বিগুণ হয়।",
  },
  blackjack: {
    name: "ব্ল্যাকজ্যাক",
    subtitle: "ডিলারের বিরুদ্ধে, ২১-এর কাছাকাছি পৌঁছান",
    rules: "২১ অতিক্রম না করে তার কাছাকাছি পৌঁছান। এইস ১ বা ১১ মূল্যের, ছবিওয়ালা কার্ড ১০ মূল্যের। হিট বা স্ট্যান্ড বেছে নিন — ডিলারকে ১৭ বা তার বেশি না হওয়া পর্যন্ত টানতে হবে।",
  },
  baccarat: {
    name: "ব্যাকারাট",
    subtitle: "Player／Banker／Tie",
    rules: "কার্ড বিতরণের আগে Player, Banker, বা Tie-এ বাজি রাখুন। যোগফলের শেষ অঙ্ক ব্যবহার করা হয়; বেশি যোগফল জয়ী হয়। স্ট্যান্ডার্ড ব্যাকারাট নিয়ম অনুসারে অতিরিক্ত কার্ড স্বয়ংক্রিয়ভাবে টানা হয়।",
  },
  "ten-half": {
    name: "টেন অ্যান্ড হাফ",
    subtitle: "ডিলারের চেয়ে ১০.৫-এর কাছাকাছি পৌঁছান",
    rules: "বাজি রাখুন, তারপর দুই পক্ষই ২টি কার্ড পায়। হিট বা স্ট্যান্ড বেছে নিন — ১০.৫ অতিক্রম না করে তার সবচেয়ে কাছে যে পৌঁছায় সে জয়ী হয়। এইস ১ পয়েন্ট মূল্যের, ছবিওয়ালা কার্ড ০.৫ পয়েন্ট মূল্যের। বিতরণে স্বাভাবিক ১০.৫ ৩x প্রদান করে; সাধারণ জয় ২x প্রদান করে; সমতা বাজি ফেরত দেয়।",
  },
  "thirteen-water": {
    name: "তেরো কার্ড জল",
    subtitle: "ডিলারের বিরুদ্ধে ১৩টি কার্ড ৩টি হাতে ভাগ করুন",
    rules: "বাজি রাখুন এবং বিতরণ করুন। সিস্টেম স্বয়ংক্রিয়ভাবে আপনার এবং ডিলারের ১৩টি কার্ড ৩-কার্ডের সামনের হাত, ৫-কার্ডের মাঝের হাত, এবং ৫-কার্ডের পিছনের হাতে সাজায়, আলাদাভাবে তুলনা করা হয়। ৩টি হাতেই জয় ৫x প্রদান করে, ২টি হাতে জয় ২x, ১টি হাতে জয় ১.৫x, সমতা কোনো অর্থ প্রদান বা ক্ষতি করে না, এবং জয়ের চেয়ে বেশি হার বাজি হারায়।",
  },
  "big-two": {
    name: "বিগ টু",
    subtitle: "আপনার হাত প্রথমে খালি করতে একক কার্ড বা জোড়া খেলুন",
    rules: "বাজি রাখুন এবং ডিলারের বিরুদ্ধে খেলুন। শেষ খেলার চেয়ে শক্তিশালী একই র‍্যাংকের একক কার্ড বা জোড়া খেলুন, বা পাস করুন। ক্রম ৩ (সবচেয়ে দুর্বল) থেকে ২ (সবচেয়ে শক্তিশালী) পর্যন্ত, সমতা স্যুট দ্বারা নির্ধারিত হয়। আপনার বাজির ২x জয়ের জন্য প্রথমে আপনার ১৩টি কার্ড খালি করুন।",
  },
  "stud-poker": {
    name: "স্টাড পোকার",
    subtitle: "ডিলারের বিরুদ্ধে সরাসরি ৫টি কার্ড তুলনা করুন",
    rules: "বাজি রাখুন, তারপর আপনি এবং ডিলার প্রত্যেকে ৫টি কার্ড পান এবং সরাসরি র‍্যাংক তুলনা করেন — স্ট্রেট ফ্লাশ, ফোর অফ আ কাইন্ড, ফুল হাউস, ফ্লাশ, স্ট্রেট, থ্রি অফ আ কাইন্ড, টু পেয়ার, পেয়ার, হাই কার্ড। শক্তিশালী হাত ২x জয়ী হয়; সমতা বাজি ফেরত দেয়।",
  },
  niuniu: {
    name: "নিউ নিউ",
    subtitle: "সেরা বুল স্কোরের জন্য ৫টি কার্ড থেকে ১০-এর গুণিতক তৈরি করুন",
    rules: "বাজি রাখুন, তারপর আপনি এবং ডিলার প্রত্যেকে ৫টি কার্ড পান। ৩টি বেছে নিন যার যোগফল ১০-এর গুণিতক ('বুল'); বাকি ২টি কার্ডের শেষ অঙ্ক আপনার স্কোর, বেশি হলে ভালো। ঠিক ১০ হলো সর্বোচ্চ 'বুল বুল' হাত; কোনো বৈধ সংমিশ্রণ না থাকলে সর্বনিম্ন 'নো বুল'। বেশি স্কোর ২x জয়ী হয়; সমতা বাজি ফেরত দেয়। ছবিওয়ালা কার্ড ১০ মূল্যের, এইস ১ মূল্যের।",
  },
  "zha-jinhua": {
    name: "থ্রি কার্ড ফ্লাশ",
    subtitle: "ডিলারের বিরুদ্ধে সরাসরি ৩টি কার্ড তুলনা করুন",
    rules: "বাজি রাখুন, তারপর আপনি এবং ডিলার প্রত্যেকে ৩টি কার্ড পান এবং সরাসরি র‍্যাংক তুলনা করেন — থ্রি অফ আ কাইন্ড, স্ট্রেট ফ্লাশ, ফ্লাশ, স্ট্রেট, পেয়ার, হাই কার্ড। শক্তিশালী হাত ২x জয়ী হয়; সমতা বাজি ফেরত দেয়।",
  },
  "seven-pk": {
    name: "৭ কার্ড স্টাড",
    subtitle: "৪টি বিতরণ রাউন্ড — প্রতিটি পর্যায়ে ফোল্ড করুন বা দ্বিগুণ করুন",
    rules: "আপনার প্রাথমিক বাজি নির্ধারণ করুন। কার্ড ৪টি পর্যায়ে বিতরণ করা হয় (৩, তারপর ২, তারপর ১, তারপর শেষ ২টি প্রকাশিত হয়), এবং প্রতিটি পর্যায়ের পরে আপনি ফোল্ড করতে পারেন বা আপনার বাজি দ্বিগুণ করতে পারেন। আপনার ৭টি কার্ড থেকে সেরা ৫-কার্ডের হাত ফলাফল নির্ধারণ করে। ফোল্ড করলে আপনার বর্তমান মোট বাজি হারাবেন; জয় র‍্যাংক অনুসারে প্রদান করে, রয়্যাল ফ্লাশ ১৫০x থেকে টু পেয়ার ১x পর্যন্ত।",
  },
  chess: {
    name: "দাবা",
    subtitle: "এআই একক／২ খেলোয়াড়",
    rules: "পালাক্রমে ঘুঁটি নাড়ুন; প্রতিপক্ষের রাজাকে চেকমেট করা প্রথম খেলোয়াড় জয়ী। পন, রুক, নাইট, বিশপ, রানি ও রাজার চালের জন্য স্ট্যান্ডার্ড দাবার নিয়ম প্রযোজ্য।",
  },
  connect4: {
    name: "কানেক্ট ফোর",
    subtitle: "এআই একক／২ খেলোয়াড়",
    rules: "পালাক্রমে উল্লম্ব গ্রিডে ঘুঁটি ফেলুন। আনুভূমিক, উলম্ব বা তির্যকভাবে প্রথমে চারটি সাজানো খেলোয়াড় জয়ী।",
  },
  "chinese-checkers": {
    name: "চাইনিজ চেকার্স",
    subtitle: "স্টার বোর্ড",
    rules: "ছয়-কোণাবিশিষ্ট তারা বোর্ডে, আপনার সব ঘুঁটি প্রথমে বিপরীত কোণে নিয়ে যান। ঘুঁটি এগিয়ে যেতে পদক্ষেপ নিতে পারে বা অন্য ঘুঁটির উপর দিয়ে ক্রমাগত লাফ দিতে পারে।",
  },
  jigsaw: {
    name: "স্লাইডিং পাজল",
    subtitle: "সংখ্যাযুক্ত টাইল",
    rules: "খালি জায়গার পাশের টাইলে ট্যাপ করে সরান। চ্যালেঞ্জ সম্পূর্ণ করতে টাইলগুলো ১ থেকে ১৫ পর্যন্ত ক্রমে সাজান।",
  },
  "number-merge": {
    name: "নাম্বার মার্জ",
    subtitle: "২০৪৮ স্টাইলে",
    rules: "সোয়াইপ করুন বা অ্যারো কী ব্যবহার করুন। সংঘর্ষে মিলানো টাইল একত্রিত হয়ে দ্বিগুণ হয়ে যায়; ২০৪৮-এ পৌঁছে জয়ী হন।",
  },
  "memory-match": {
    name: "মেমোরি ম্যাচ",
    subtitle: "স্মৃতিশক্তি চ্যালেঞ্জ",
    rules: "একবারে দুটি কার্ড উল্টান; মিলানো জোড়া উন্মুক্ত থাকে। সর্বনিম্ন চেষ্টায় প্রতিটি জোড়া মিলিয়ে জয়ী হন।",
  },
  ludo: {
    name: "লুডো",
    subtitle: "২ খেলোয়াড়",
    rules: "আপনার ঘুঁটি বোর্ডের চারপাশে ঘরে নিয়ে যেতে পাশা ফেলুন। প্রতিপক্ষের ঘুঁটিতে অবতরণ করলে তা শুরুতে ফিরে যায়।",
  },
  solitaire: {
    name: "সলিটেয়ার",
    subtitle: "ক্লাসিক একক খেলোয়াড়",
    rules: "বোর্ড পরিষ্কার করে জয়ী হতে সব কার্ড স্যুট অনুযায়ী চারটি ফাউন্ডেশন স্তূপে ক্রমবর্ধমান ক্রমে সাজান।",
  },
  rummikub: {
    name: "রামিকিউব",
    subtitle: "এআই-এর বিরুদ্ধে টাইল রামি",
    rules: "রান বা একই সংখ্যার সেট তৈরি করতে আপনার সংখ্যাযুক্ত টাইল ব্যবহার করুন এবং টেবিলে রাখুন। প্রথমে সব টাইল খেলে জয়ী হন।",
  },
  "rps-battle": {
    name: "রক পেপার সিজারস",
    subtitle: "এআই-এর বিরুদ্ধে",
    rules: "কম্পিউটারের বিরুদ্ধে একসাথে রক, পেপার বা সিজারস বেছে নিন। যে বেশি রাউন্ড জিতবে সে ম্যাচ জয়ী।",
  },
  "texas-holdem": {
    name: "টেক্সাস হোল্ডেম",
    subtitle: "এআই-এর বিরুদ্ধে হেডস-আপ (সরলীকৃত)",
    rules: "আপনার ও এআই-এর ২টি করে কার্ড আছে, সাথে ৫টি শেয়ার্ড কমিউনিটি কার্ড। হাত প্রকাশ করতে কল করুন বা ছেড়ে দিতে ফোল্ড করুন — উচ্চ র‍্যাংকের হাত পট জয়ী হয়।",
  },
  war: {
    name: "ওয়ার",
    subtitle: "এআই-এর বিরুদ্ধে হাই কার্ড",
    rules: "ডেক সমানভাবে ভাগ করা হয়। প্রতি রাউন্ডে উভয় পক্ষ একটি কার্ড উল্টায় — উচ্চ কার্ড রাউন্ড জয়ী হয়। সমতায় যুদ্ধ শুরু হয়; শেষে বেশি কার্ডধারী জয়ী।",
  },
  "three-card-poker": {
    name: "থ্রি কার্ড পোকার",
    subtitle: "ডিলারের বিরুদ্ধে",
    rules: "আপনি ও ডিলার ৩টি করে কার্ড পান। আপনার হাত দেখার পর তুলনা করতে কল করুন বা ছেড়ে দিতে ফোল্ড করুন — উচ্চ র‍্যাংকের হাত জয়ী হয়।",
  },
  klotski: {
    name: "ক্লটস্কি",
    subtitle: "স্লাইডিং ব্লক পাজল",
    rules: "সীমিত বোর্ড স্থানে বিভিন্ন আকারের ব্লক সরান। জয়ী হতে সবচেয়ে বড় ব্লককে নিচের প্রস্থানে নিয়ে যান।",
  },
  tetris: {
    name: "টেট্রিস",
    subtitle: "স্তূপ করুন ও সারি পরিষ্কার করুন",
    rules: "পতনশীল টুকরা সরাতে বামে বা ডানে সোয়াইপ করুন, ঘোরাতে ট্যাপ করুন, দ্রুত ফেলতে নিচে সোয়াইপ করুন। একটি সারি পূর্ণ হলে তা পরিষ্কার হয় ও পয়েন্ট পান; স্তূপ উপরে পৌঁছালে খেলা শেষ হয়।",
  },
  "bubble-shooter": {
    name: "বাবল শুটার",
    subtitle: "রঙ মিলিয়ে পরিষ্কার করুন",
    rules: "বর্তমান বাবল ছুঁড়তে একটি লেনে ট্যাপ করুন। সংযুক্ত তিন বা তার বেশি মিলানো বাবল পয়েন্টের জন্য পরিষ্কার হয়; বাবল উপরে পৌঁছালে খেলা শেষ হয়।",
  },
  match3: {
    name: "ম্যাচ-৩ ব্লাস্ট",
    subtitle: "মিলানোর জন্য বদল করুন",
    rules: "একটি টাইলে, তারপর বদল করতে প্রতিবেশী টাইলে ট্যাপ করুন। একই রঙের ৩ বা তার বেশি মিললে তা পরিষ্কার হয় ও উপর থেকে পুনরায় পূর্ণ হয়, যা আরও মিল তৈরি করতে পারে।",
  },
  hanoi: {
    name: "টাওয়ার অফ হ্যানয়",
    subtitle: "ডিস্ক সরান",
    rules: "উপরের ডিস্ক তুলতে একটি খুঁটিতে ট্যাপ করুন, তারপর সেখানে সরাতে অন্য খুঁটিতে ট্যাপ করুন। বড় ডিস্ক কখনো ছোটটির উপর রাখা যায় না — জয়ী হতে পুরো স্তূপ সবচেয়ে ডানের খুঁটিতে নিয়ে যান।",
  },
  "water-sort": {
    name: "ওয়াটার সর্ট পাজল",
    subtitle: "রঙ আলাদা করতে ঢালুন",
    rules: "উপরের রঙ তুলতে একটি টিউবে ট্যাপ করুন, তারপর ঢালতে অন্য টিউবে ট্যাপ করুন — শুধু খালি টিউবে বা একই রঙের উপরে। জয়ী হতে প্রতিটি টিউবকে একটি রঙে আলাদা করুন।",
  },
  "pipe-connect": {
    name: "পাইপ কানেক্ট",
    subtitle: "সংযোগের জন্য ঘোরান",
    rules: "পাইপ টাইল ৯০° ঘোরাতে তাতে ট্যাপ করুন। জয়ী হতে উপরে-বামে পানির উৎস নিচে-ডানে প্রস্থানের সাথে সংযুক্ত করুন।",
  },
  "stack-tower": {
    name: "স্ট্যাক টাওয়ার",
    subtitle: "আপনার ড্রপের সময় নির্ধারণ করুন",
    rules: "উপরের ব্লক ডানে-বামে দোলে; নিচের স্তূপের উপর ফেলতে ট্যাপ করুন। যত কম ওভারল্যাপ হবে, ব্লক তত সরু হবে — স্তূপ সম্পূর্ণ মিস করলে খেলা শেষ হয়।",
  },
  "sequence-sort": {
    name: "সর্ট মাস্টার",
    subtitle: "ক্রমের জন্য বদল করুন",
    rules: "দুটি সংখ্যা টাইলের স্থান বদল করতে তাতে ট্যাপ করুন। জয়ী হতে সর্বনিম্ন বদলে সব সংখ্যা ছোট থেকে বড় ক্রমে সাজান।",
  },
  "mini-sudoku": {
    name: "মিনি সুডোকু",
    subtitle: "৬×৬ গ্রিড",
    rules: "প্রতিটি সারি, কলাম ও ২×৩ বক্সে পুনরাবৃত্তি ছাড়া ১ থেকে ৬ পর্যন্ত সংখ্যা থাকতে হবে। কোনো সংঘর্ষ ছাড়া পুরো গ্রিড পূর্ণ করে জয়ী হন।",
  },
  "shooting-range": {
    name: "শুটিং রেঞ্জ",
    subtitle: "দ্রুত প্রতিক্রিয়া লক্ষ্যবস্তু",
    rules: "গ্রিডে লক্ষ্যবস্তু এলোমেলোভাবে জ্বলে — পয়েন্টের জন্য যত দ্রুত সম্ভব ট্যাপ করুন। সময় শেষ হওয়ার আগে লক্ষ্য স্কোরে পৌঁছে জয়ী হন।",
  },
  "space-invaders": {
    name: "স্পেস ইনভেডারস",
    subtitle: "জয়ী হতে পুরো বহর পরিষ্কার করুন",
    rules: "শত্রুর গুলি এড়াতে বামে-ডানে চলুন এবং পুরো এলিয়েন বহর ধ্বংস করুন। বহর কাছে এলে বা জীবন ফুরিয়ে গেলে চ্যালেঞ্জ ব্যর্থ হয়।",
  },
  "tank-battle": {
    name: "ট্যাংক ব্যাটল",
    subtitle: "প্রথমে ৩টি হিট করা জয়ী",
    rules: "আপনার ট্যাংক বামে-ডানে চালান এবং গোলা ছুঁড়ুন। প্রতিপক্ষের লেনে আঘাত করলে পয়েন্ট পান — জয়ী হতে প্রথমে ৩টি হিট করুন।",
  },
  "brick-breaker": {
    name: "ব্রিক ব্রেকার",
    subtitle: "জয়ী হতে সব ইট পরিষ্কার করুন",
    rules: "বল লাফাতে ও সব ইট ভাঙতে জয়ী হতে প্যাডেল বামে-ডানে টানুন। বল নিচে পড়লে একটি জীবন হারান; জীবন ফুরিয়ে গেলে চ্যালেঞ্জ ব্যর্থ হয়।",
  },
  "zombie-defense": {
    name: "জম্বি ডিফেন্স",
    subtitle: "জয়ী হতে প্রতিটি ঢেউ থেকে বাঁচুন",
    rules: "জম্বি ডান দিক থেকে লেনে এগিয়ে আসে; ধ্বংস করতে ট্যাপ করুন (কিছুতে দুটি হিট লাগে)। একটি বাম প্রান্তে পৌঁছালে স্বাস্থ্য কমে যায় — জয়ী হতে প্রতিটি ঢেউ থেকে বাঁচুন।",
  },
  "air-combat": {
    name: "এয়ার কমব্যাট",
    subtitle: "বাঁচুন ও লক্ষ্য স্কোরে পৌঁছান",
    rules: "আপনার ফাইটার স্বয়ংক্রিয়ভাবে গুলি চালায়; শত্রু বিমান এড়াতে ও পরিষ্কার করতে বামে-ডানে চলুন। জয়ী হতে সময়সীমা পর্যন্ত লক্ষ্য স্কোরে পৌঁছে বেঁচে থাকুন; জীবন ফুরিয়ে গেলে চ্যালেঞ্জ ব্যর্থ হয়।",
  },
  billiards: {
    name: "বিলিয়ার্ডস",
    subtitle: "নিশানা নিতে টানুন, সব বল পরিষ্কার করুন",
    rules: "নিশানা নিতে কিউ বল থেকে পিছনে টানুন, তারপর আঘাত করতে ছাড়ুন। জয়ী হতে শট শেষ হওয়ার আগে প্রতিটি রঙিন বল পকেটে ফেলুন।",
  },
  bowling: {
    name: "বোলিং",
    subtitle: "৩ ফ্রেমে পিন লক্ষ্যে পৌঁছান",
    rules: "আপনার থ্রো অ্যাঙ্গেল সেট করতে স্লাইডার টানুন, তারপর বোলিং করতে ছাড়ুন। জয়ী হতে ৩ ফ্রেমের মধ্যে ফেলে দেওয়া পিনের লক্ষ্যে পৌঁছান।",
  },
  "basketball-shoot": {
    name: "বাস্কেটবল শুটআউট",
    subtitle: "আপনার শটের সময় নির্ধারণ করুন",
    rules: "পাওয়ার মিটার স্বয়ংক্রিয়ভাবে সামনে-পিছনে দোলে — স্কোর করতে কেন্দ্রের কাছাকাছি থাকলে ট্যাপ করুন। জয়ী হতে যথেষ্ট বাস্কেট তৈরি করুন।",
  },
  "penalty-kick": {
    name: "পেনাল্টি কিক",
    subtitle: "গোলকিপারের বিরুদ্ধে একটি দিক বেছে নিন",
    rules: "এলোমেলোভাবে লাফ দেওয়া গোলকিপারের বিরুদ্ধে শুট করতে বাম, মাঝখান বা ডান বেছে নিন। জয়ী হতে ৫ রাউন্ডে যথেষ্ট গোল করুন।",
  },
  racing: {
    name: "রেসিং রাশ",
    subtitle: "ট্রাফিক এড়াতে লেন পাল্টান",
    rules: "আগত ট্রাফিক এড়াতে বামে-ডানে লেন পাল্টান। ফিনিশ দূরত্বে পৌঁছানোর আগে জীবন ফুরিয়ে গেলে চ্যালেঞ্জ ব্যর্থ হয়।",
  },
  parking: {
    name: "পার্কিং চ্যালেঞ্জ",
    subtitle: "আপনার চালের মধ্যে পার্ক করুন",
    rules: "চাল বা সংঘর্ষ শেষ হওয়ার আগে চিহ্নিত স্থানে সঠিকভাবে পার্ক করতে স্টিয়ারিং ও সামনে চলার নিয়ন্ত্রণ ব্যবহার করুন।",
  },
  motocross: {
    name: "মোটোক্রস জাম্প",
    subtitle: "ফিনিশ পর্যন্ত গর্ত লাফান",
    rules: "ভালো সময়ের সাথে আপনার বাইক দিয়ে লাফাতে ও সামনের গর্ত অতিক্রম করতে ট্যাপ করুন। ফিনিশে পৌঁছানোর আগে জীবন ফুরিয়ে গেলে চ্যালেঞ্জ ব্যর্থ হয়।",
  },
  "drift-racing": {
    name: "ড্রিফট রেসিং",
    subtitle: "পয়েন্টের জন্য ট্র্যাকের সাথে স্টিয়ার করুন",
    rules: "কোর্সে থাকার সাথে ড্রিফট পয়েন্ট সংগ্রহ করতে ট্র্যাকের বাঁকের সাথে স্টিয়ার করুন। জয়ী হতে যথেষ্ট পয়েন্ট সহ ফিনিশে পৌঁছান।",
  },
  "duel-arena": {
    name: "ডুয়েল এরিনা",
    subtitle: "টার্ন-ভিত্তিক, প্রথম নকআউট জয়ী",
    rules: "আপনার বিশেষ মিটার পূর্ণ করতে অ্যাটাক বেছে নিন, পরের হিট অর্ধেক করতে গার্ড বেছে নিন, বা মিটার পূর্ণ হলে ফিনিশার ছাড়ুন। জয়ী হতে প্রতিপক্ষের স্বাস্থ্য প্রথমে শূন্য করুন।",
  },
  "mahjong-ninepoint5": {
    name: "মাহজং ৯.৫",
    subtitle: "কার্ডের বদলে মাহজং টাইল, ৯.৫-এর কাছাকাছি পৌঁছান",
    rules: "কার্ডের বদলে মাহজং টাইল ব্যবহার করে ৯.৫ (ব্ল্যাকজ্যাক স্টাইল) খেলুন। হিট বা স্ট্যান্ড করুন — ৯.৫ অতিক্রম না করে তার সবচেয়ে কাছে পৌঁছে জয়ী হন।",
  },
  "five-pk": {
    name: "৫-কার্ড পোকার",
    subtitle: "একবার ড্র করুন, তারপর ডাবল-অর-নাথিং বিকল্পসহ হাত তুলনা করুন",
    rules:
      "বাজি রাখুন, তারপর ৫টি কার্ড বিতরণ করা হয় (ডেকে ২টি জোকার আছে)। চাওয়া কার্ড রাখুন এবং বাকিগুলো একবার বদলাতে টানুন। হাত র‍্যাংক অনুসারে প্রদান করে — স্ট্রেট ফ্লাশ ৫০০x, ফাইভ অফ আ কাইন্ড ২০০x, ফ্লাশ স্ট্রেট ১২০x, এবং টু পেয়ার পর্যন্ত ১x। জয়ের পর আপনি বড়/ছোট বা লাল/কালোতে ডাবল-অর-নাথিং খেলতে পারেন, বা যেকোনো সময় ক্যাশ আউট করতে পারেন।",
  },
  "little-mary": {
    name: "ক্লাসিক লিটল মেরি",
    subtitle: "ঘূর্ণায়মান লাইট ফ্রেম — বড় বা ছোট কার্ডে বাজি রাখুন",
    rules:
      "প্রতিটি প্রতীকে বাজি রাখুন, তারপর শুরু করুন। লাইট ফ্রেম দ্রুত ৩ চক্কর ঘোরে, তারপর ধীর হয়ে অর্ধেক থেকে দেড় চক্করের মধ্যে থামে — তাড়াতাড়ি থামাতে স্টপে ট্যাপ করুন। তীরে থামা হার; ফ্রি স্পিন প্রতীকে থামলে ফ্রি স্পিন পাবেন; স্থির প্রতীক নির্দিষ্ট গুণক প্রদান করে; বড় বা ছোট কার্ড প্রতীক বাজি রাখা হলে চলমান গুণক অনুসারে প্রদান করে। যথেষ্ট স্পিনের পর, উচ্চতর নির্দিষ্ট প্রদান ও স্বতন্ত্র শব্দসহ বোনাস রাউন্ড শুরু হতে পারে।",
  },
  "little-mary-2": {
    name: "ক্লাসিক লিটল মেরি II",
    subtitle: "স্পোর্টস থিম ঘূর্ণায়মান লাইট ফ্রেম",
    rules:
      "ক্লাসিক লিটল মেরির মতোই ঘূর্ণনের কৌশল, স্পোর্টস থিমে (ফুটবল, রাগবি, বাস্কেটবল, বোলিং, টেনিস, টেবিল টেনিস, গলফ) পুনর্গঠিত। প্রতিটি প্রতীকে বাজি রাখুন তারপর শুরু করুন — তীরে থামা হার, ফ্রি প্রতীক অতিরিক্ত স্পিন দেয়, স্থির প্রতীক নির্দিষ্ট গুণক প্রদান করে, এবং বড় বা ছোট স্পোর্টস প্রতীক বাজি রাখা হলে চলমান গুণক অনুসারে প্রদান করে। যথেষ্ট স্পিনের পর উচ্চ নির্দিষ্ট প্রদানসহ বোনাস রাউন্ড শুরু হতে পারে।",
  },
  "little-mary-3": {
    name: "ক্লাসিক লিটল মেরি III",
    subtitle: "ফ্লাওয়ার-গড জ্যাকপট — বড় বা ছোটতে বাজি রাখুন",
    rules:
      "একই ঘূর্ণনের কৌশল। তিনটি ফ্লাওয়ার-গড আলো সাধারণত স্বাধীনভাবে জ্বলে নেভে; যথেষ্ট স্পিনের পর তারা ঝলমলে সতর্কতা অবস্থায় সিঙ্ক হতে পারে। সেই মুহূর্তে রিল বড় বা ছোট প্রতীক গ্রুপে থামলে, তিনটি প্রতীকই একসাথে চলমান গুণকের ৩x প্রদান করে — একটি বিরল বোনাস জ্যাকপট।",
  },
  "little-mary-4": {
    name: "ক্লাসিক লিটল মেরি IV",
    subtitle: "প্রাণী-থিম ফ্লাওয়ার-গড জ্যাকপট",
    rules:
      "ফ্লাওয়ার-গড জ্যাকপট সংস্করণের মতোই কৌশল, প্রাণী থিমে (বাঘ, ড্রাগন, বানর, শিয়াল, ইঁদুর, মোরগ, ছানা) পুনর্গঠিত। ফ্লাওয়ার-গড জ্যাকপট সতর্কতা ও ৩x প্রদান একইভাবে কাজ করে।",
  },
  "little-mary-5": {
    name: "ক্লাসিক লিটল মেরি III (ফিনিক্স)",
    subtitle: "ফিনিক্স সাজসজ্জা সংস্করণ — বড় বা ছোটতে বাজি রাখুন",
    rules:
      "একই ঘূর্ণনের কৌশল। কেন্দ্রে বড় ফিনিক্স সম্পূর্ণ সাজসজ্জামূলক, বোনাস সতর্কতার সময় দ্রুত জ্বলে নেভে। যেকোনো ফ্রি-স্পিন প্রতীকে থামলে ফ্রেম জুড়ে একটি সাজসজ্জামূলক আলোর রেখা প্রবাহিত হয় — শুধু দৃশ্যমান প্রভাব, প্রদান পরিবর্তন করে না।",
  },
  "little-mary-6": {
    name: "ক্লাসিক লিটল মেরি IV (ফিনিক্স)",
    subtitle: "ফিনিক্স সাজসজ্জা সংস্করণ — পানীয় থিম",
    rules:
      "ফিনিক্স সাজসজ্জা সংস্করণের মতোই কৌশল, পানীয় থিমে (চায়ের কেটলি, মধু, মেট চা, কুচি বরফ, বিয়ার, ওয়াইন, ককটেল) পুনর্গঠিত। সাজসজ্জামূলক ফিনিক্স ও আলোর রেখার প্রভাব একইভাবে কাজ করে।",
  },
  "little-mary-7": {
    name: "মিনি লিটল মেরি (মহাসাগর)",
    subtitle: "৮×৮ মিনি ফ্রেম — বড় বা ছোটতে বাজি রাখুন",
    rules:
      "একই ঘূর্ণনের কৌশলসহ একটি ছোট ৮×৮ লাইট ফ্রেম (২৮ অবস্থান), মহাসাগর প্রাণী থিমে (হাঙর, তিমি, ডলফিন, ক্রান্তীয় মাছ, কাঁকড়া, খোলস, বুদবুদ)। তীরে থামা হার, ফ্রি প্রতীক অতিরিক্ত স্পিন দেয়, স্থির প্রতীক নির্দিষ্ট গুণক প্রদান করে, এবং বড় বা ছোট প্রতীক বাজি রাখা হলে চলমান গুণক অনুসারে প্রদান করে। যথেষ্ট স্পিনের পর একটি জ্যাকপট বোনাস রাউন্ড শুরু হতে পারে।",
  },
  "little-mary-8": {
    name: "মিনি লিটল মেরি (ডেজার্ট)",
    subtitle: "৮×৮ মিনি ফ্রেম — ডেজার্ট থিম",
    rules:
      "মহাসাগর সংস্করণের মতোই ৮×৮ মিনি-ফ্রেম কৌশল, ডেজার্ট থিমে (কেক, স্ট্রবেরি কেক, কাপকেক, ডোনাট, কুকি, ক্যান্ডি, ললিপপ) পুনর্গঠিত। যথেষ্ট স্পিনের পর স্বতন্ত্র শব্দসহ একটি জ্যাকপট বোনাস রাউন্ড শুরু হতে পারে।",
  },
  "fruit-slot-1": {
    name: "ফ্রুট রিলস I",
    subtitle: "ক্লাসিক ৩×৩ রিল, ৫ পেলাইন",
    rules:
      "৫টি পেলাইন (উপরের, মাঝের, নিচের সারি এবং দুটি তির্যক) সহ একটি ক্লাসিক ৩-রিল, ৩-সারি ফল মেশিন। প্রতি লাইনে আপনার বাজি সেট করুন, তারপর ঘোরান — প্রতিটি রিল বাম থেকে ডানে স্বাধীনভাবে থামে, এবং আপনি তাড়াতাড়ি থামাতে স্টপে ট্যাপ করতে পারেন। যেকোনো পেলাইনে তিনটি মিলানো প্রতীক টেবিল অনুসারে প্রদান করে, লাকি ৭-এ ১০০x থেকে চেরিতে ৪x পর্যন্ত; স্ক্রিনে যেকোনো জায়গায় দুই বা তার বেশি চেরি একটি ছোট সান্ত্বনা প্রদান করে; মাঝের সারিতে তিনটি ৭ হলো জ্যাকপট যার নিজস্ব লাইট শো ও শব্দ আছে।",
  },
  "fruit-slot-2": {
    name: "ফ্রুট রিলস II",
    subtitle: "ক্রান্তীয় ফল থিম, ৫ পেলাইন",
    rules:
      "ফ্রুট রিলস I-এর মতোই ৩-রিল, ৫-পেলাইন কৌশল, ক্রান্তীয় থিমে — হীরা লাকি ৭-এর স্থানে জ্যাকপট প্রতীক হয়, স্ট্রবেরি, আনারস, কলা, পিচ ও চেরির সাথে। যেকোনো পেলাইনে তিনটি মিলানো প্রতীক টেবিল অনুসারে প্রদান করে, হীরায় ১০০x থেকে চেরিতে ৪x পর্যন্ত; মাঝের সারিতে তিনটি হীরা জ্যাকপট।",
  },
  "little-mary-bonus": {
    name: "ক্লাসিক লিটল মেরি V (লাকি ৭ বোনাস)",
    subtitle: "লাকি সেভেনস বোনাস গুণক রাউন্ড",
    rules:
      "একই ঘূর্ণনের কৌশল, একসাথে ৮টি প্রতীকে বাজি সহ। কেন্দ্রে সংখ্যা রিলের ত্রয়ী সাধারণত সম্পূর্ণ সাজসজ্জামূলকভাবে ঘোরে; জয়ের সময় একটি বোনাস রাউন্ড শুরু হওয়ার সুযোগ থাকে যেখানে তিনটি রিল একে একে থামে। তিনটি একই বিজোড় সংখ্যায় থামলে জয় ১০x বৃদ্ধি পায়, তিনটি জোড় সংখ্যায় ৫x — একটি বিরল এলোমেলো বোনাস যা প্রতিবার ঘটে না।",
  },
  "little-mary-bonus-2": {
    name: "ক্লাসিক লিটল মেরি IV (লাকি ৭ বোনাস, উৎসব)",
    subtitle: "উৎসব থিম লাকি সেভেনস বোনাস",
    rules:
      "লাকি সেভেনস বোনাস সংস্করণের মতোই কৌশল, উৎসব থিমে (লাল খাম, সোনার বার, লণ্ঠন, কমলা, মুনকেক, আতশবাজি, চেরি) পুনর্গঠিত। বোনাস রাউন্ড ও ১০x/৫x সংখ্যা মিল গুণক উৎসবের রঙ ও শব্দ প্রভাবসহ একইভাবে কাজ করে।",
  },
  "xiangqi-mahjong": {
    name: "শিয়াংছি মাহজং",
    subtitle: "দাবার ঘুঁটি দিয়ে সেট তৈরি করুন, কম্পিউটারকে হারান",
    rules:
      "বাজি রাখুন, তারপর আপনি ও কম্পিউটার প্রত্যেকে ৫টি চীনা দাবার ঘুঁটি টানেন। আপনার পালায়, একটি ঘুঁটি টানুন — এটি একটি জোড়া ও সেট (রান বা ত্রিক) সম্পূর্ণ করলে, আপনি স্ব-টানে জয়ী হন। অন্যথায় আপনার ৬টি ঘুঁটির একটি ফেলুন। কম্পিউটারের ফেলা ঘুঁটি আপনার হাত সম্পূর্ণ করলে, আপনি জয়ী হতে তা নিতে পারেন, বা পাস করে টানতে থাকতে পারেন। প্রদান: মিশ্র জোড়া-ও-রানের জন্য ২x, একই স্যুটের জোড়া-ও-রানের জন্য ৩x, পাঁচটি সৈনিক বা পনের জন্য ৫x; ফেলা ঘুঁটি নেওয়া তালিকাভুক্ত হারে প্রদান করে, স্ব-টান বোনাস যোগ করে। বিজয়ী ছাড়া ডেক শেষ হলে, বাজি ফেরত দেওয়া হয়।",
  },
  tuitongzai: {
    name: "তুইতোংজাই",
    subtitle: "তিনটি স্থানে একসাথে মাহজং-টাইল পাই গাও",
    rules:
      "৪০-টাইল ডেক প্রতিনিধিত্ব করতে ১-৯ পর্যন্ত বৃত্তাকার মাহজং টাইল (প্রতিটির ৪টি) এবং অর্ধেক পয়েন্ট মূল্যের খালি টাইল (৪টি) ব্যবহার করা হয়। মাথা, স্বর্গ ও লেজ অবস্থানে বাজি রাখুন, তারপর ডিলার ও প্রতিটি অবস্থান তুলনার জন্য ২টি করে টাইল উল্টায়। র‍্যাংক ক্রম: ডাবল খালি (সর্বোচ্চ) যেকোনো জোড়াকে হারায়, যা ২-৮ সমন্বয়কে হারায়, যা সাধারণ পয়েন্ট যোগফলকে হারায় (অঙ্কের যোগফল, শেষ অঙ্ক গণনা করা হয়, খালি = ০.৫, ৯.৫ সেরা সাধারণ যোগফল, ০ সর্বনিম্ন)। প্রতিটি অবস্থান ডিলারের সাথে স্বাধীনভাবে তুলনা করা হয় — জয় ১x প্রদান করে, জোড়া ৪x প্রদান করে, ডাবল খালি ১০x প্রদান করে; মিলানো যোগফল হাউস নিয়ম অনুযায়ী ডিলারের পক্ষে যায়।",
  },
}

export const PUZZLE_GAME_TEXT: Record<LangId, GameTable> = {
  "zh-TW": zhTW,
  "zh-CN": zhCN,
  en,
  ja,
  ko,
  vi,
  th,
  id,
  ms,
  fil,
  es,
  pt,
  fr,
  de,
  it,
  ru,
  ar,
  hi,
  tr,
  bn,
}

// 依語言與遊戲 id 取出該款遊戲的名稱／副標／規則；若該語言尚未翻譯這款遊戲，
// 就自動退回到 lib/luckypi/data.ts 裡原始的中文版本，確保畫面一定有文字可顯示，不會白屏。
export function puzzleGameText(lang: LangId, gameId: PuzzleGameId): PuzzleGameText {
  const translated = PUZZLE_GAME_TEXT[lang]?.[gameId]
  if (translated) return translated
  const base = PUZZLE_GAMES.find((g) => g.id === gameId)
  if (base) {
    return { name: base.name, subtitle: base.subtitle, rules: base.rules }
  }
  return { name: gameId, subtitle: "", rules: "" }
}

// 依語言取出共用文字（牌牆、總局數…等標籤）；若該語言尚未提供，退回繁體中文版本。
export function puzzleCommonText(lang: LangId): PuzzleCommonText {
  return PUZZLE_COMMON_TEXT[lang] ?? PUZZLE_COMMON_TEXT["zh-TW"]
}

export const PUZZLE_COMMON_TEXT: Record<LangId, PuzzleCommonText> = {
  "zh-TW": {
    mahjongWall: "牌牆",
    mahjongTotalRounds: "總局數",
    mahjongWinCount: "胡牌次數",
    mahjongWinRate: "胡牌率",
    mahjongYourDiscards: "您的棄牌",
    mahjongEatPongKong: "吃・碰・槓",
    mahjongTingWinDraw: "聽・胡・摸牌",
    checkersKing: "王",
    comingSoonText: "這款遊戲正在陸續製作中，完成後會自動出現在這個格子裡，敬請期待！",
    backToLobby: "返回大廳",
    costToastTemplate: "本局已扣除 {cost} 遊戲幣",
  },
  "zh-CN": {
    mahjongWall: "牌墙",
    mahjongTotalRounds: "总局数",
    mahjongWinCount: "胡牌次数",
    mahjongWinRate: "胡牌率",
    mahjongYourDiscards: "您的弃牌",
    mahjongEatPongKong: "吃・碰・杠",
    mahjongTingWinDraw: "听・胡・摸牌",
    checkersKing: "王",
    comingSoonText: "这款游戏正在陆续制作中，完成后会自动出现在这个格子里，敬请期待！",
    backToLobby: "返回大厅",
    costToastTemplate: "本局已扣除 {cost} 游戏币",
  },
  en: {
    mahjongWall: "Wall",
    mahjongTotalRounds: "Total Rounds",
    mahjongWinCount: "Wins",
    mahjongWinRate: "Win Rate",
    mahjongYourDiscards: "Your Discards",
    mahjongEatPongKong: "Chow · Pong · Kong",
    mahjongTingWinDraw: "Ready · Win · Draw",
    checkersKing: "K",
    comingSoonText: "This game is being built and will appear here automatically once ready — stay tuned!",
    backToLobby: "Back to Lobby",
    costToastTemplate: "{cost} game coins deducted for this round",
  },
  ja: {
    mahjongWall: "牌山",
    mahjongTotalRounds: "総局数",
    mahjongWinCount: "和了回数",
    mahjongWinRate: "和了率",
    mahjongYourDiscards: "あなたの捨て牌",
    mahjongEatPongKong: "チー・ポン・カン",
    mahjongTingWinDraw: "聴牌・和了・ツモ",
    checkersKing: "王",
    comingSoonText: "このゲームは現在制作中です。完成すると自動的にこのマスに表示されます。お楽しみに！",
    backToLobby: "ロビーに戻る",
    costToastTemplate: "今回のゲームで{cost}ゲームコインを消費しました",
  },
  ko: {
    mahjongWall: "패산",
    mahjongTotalRounds: "총 판수",
    mahjongWinCount: "승리 횟수",
    mahjongWinRate: "승률",
    mahjongYourDiscards: "나의 버린 패",
    mahjongEatPongKong: "치・펑・깡",
    mahjongTingWinDraw: "텐・후・쯔모",
    checkersKing: "킹",
    comingSoonText: "이 게임은 현재 제작 중이며 완성되면 이 칸에 자동으로 표시됩니다. 기대해 주세요!",
    backToLobby: "로비로 돌아가기",
    costToastTemplate: "이번 게임에서 게임 코인 {cost}개가 차감되었습니다",
  },
  vi: {
    mahjongWall: "Tường bài",
    mahjongTotalRounds: "Tổng số vòng",
    mahjongWinCount: "Số lần thắng",
    mahjongWinRate: "Tỷ lệ thắng",
    mahjongYourDiscards: "Bài bạn đã đánh",
    mahjongEatPongKong: "Ăn・Bắt Cạ・Bắt Khàn",
    mahjongTingWinDraw: "Chờ・Thắng・Rút bài",
    checkersKing: "Vua",
    comingSoonText: "Trò chơi này đang được phát triển và sẽ tự động xuất hiện tại đây khi hoàn tất, hãy chờ đón!",
    backToLobby: "Về Sảnh Game",
    costToastTemplate: "Đã trừ {cost} xu trò chơi cho lượt này",
  },
  th: {
    mahjongWall: "กำแพงไพ่",
    mahjongTotalRounds: "จำนวนรอบทั้งหมด",
    mahjongWinCount: "จำนวนครั้งที่ชนะ",
    mahjongWinRate: "อัตราการชนะ",
    mahjongYourDiscards: "ไพ่ที่คุณทิ้ง",
    mahjongEatPongKong: "กิน・ป๊อง・กง",
    mahjongTingWinDraw: "เตี้ยม・ฮู・จั่ว",
    checkersKing: "คิง",
    comingSoonText: "เกมนี้กำลังอยู่ในระหว่างการพัฒนา เมื่อเสร็จแล้วจะปรากฏที่ช่องนี้โดยอัตโนมัติ โปรดติดตาม!",
    backToLobby: "กลับสู่ห้องโถงเกม",
    costToastTemplate: "หักเหรียญเกม {cost} เหรียญสำหรับรอบนี้",
  },
  id: {
    mahjongWall: "Tembok Kartu",
    mahjongTotalRounds: "Total Ronde",
    mahjongWinCount: "Jumlah Menang",
    mahjongWinRate: "Tingkat Menang",
    mahjongYourDiscards: "Kartu Buangan Anda",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Siap・Menang・Ambil",
    checkersKing: "Raja",
    comingSoonText: "Game ini masih dalam pengembangan dan akan otomatis muncul di sini setelah selesai. Nantikan!",
    backToLobby: "Kembali ke Lobi",
    costToastTemplate: "{cost} koin permainan telah dipotong untuk ronde ini",
  },
  ms: {
    mahjongWall: "Dinding Jubin",
    mahjongTotalRounds: "Jumlah Pusingan",
    mahjongWinCount: "Bilangan Menang",
    mahjongWinRate: "Kadar Menang",
    mahjongYourDiscards: "Jubin Buangan Anda",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Sedia・Menang・Ambil",
    checkersKing: "Raja",
    comingSoonText: "Permainan ini sedang dibangunkan dan akan muncul secara automatik di sini apabila siap. Nantikan!",
    backToLobby: "Kembali ke Lobi",
    costToastTemplate: "{cost} syiling permainan telah ditolak untuk pusingan ini",
  },
  fil: {
    mahjongWall: "Dingding ng Tile",
    mahjongTotalRounds: "Kabuuang Round",
    mahjongWinCount: "Bilang ng Panalo",
    mahjongWinRate: "Win Rate",
    mahjongYourDiscards: "Mga Itinapon Mong Tile",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Ready・Panalo・Kuha",
    checkersKing: "Hari",
    comingSoonText: "Ang larong ito ay kasalukuyang ginagawa at lalabas dito nang otomatiko kapag tapos na. Manatiling tuned!",
    backToLobby: "Bumalik sa Lobby",
    costToastTemplate: "{cost} game coins ang naibawas para sa round na ito",
  },
  es: {
    mahjongWall: "Muro de Fichas",
    mahjongTotalRounds: "Rondas Totales",
    mahjongWinCount: "Victorias",
    mahjongWinRate: "Tasa de Victoria",
    mahjongYourDiscards: "Tus Descartes",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Listo・Ganar・Robar",
    checkersKing: "Rey",
    comingSoonText: "Este juego está en desarrollo y aparecerá aquí automáticamente cuando esté listo. ¡Manténte atento!",
    backToLobby: "Volver al Vestíbulo",
    costToastTemplate: "Se descontaron {cost} monedas de juego en esta partida",
  },
  pt: {
    mahjongWall: "Muro de Peças",
    mahjongTotalRounds: "Rodadas Totais",
    mahjongWinCount: "Vitórias",
    mahjongWinRate: "Taxa de Vitória",
    mahjongYourDiscards: "Seus Descartes",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Pronto・Vitória・Comprar",
    checkersKing: "Rei",
    comingSoonText: "Este jogo está em desenvolvimento e aparecerá aqui automaticamente quando estiver pronto. Aguarde!",
    backToLobby: "Voltar ao Lobby",
    costToastTemplate: "{cost} moedas de jogo foram deduzidas nesta partida",
  },
  fr: {
    mahjongWall: "Mur de Tuiles",
    mahjongTotalRounds: "Total des Manches",
    mahjongWinCount: "Victoires",
    mahjongWinRate: "Taux de Victoire",
    mahjongYourDiscards: "Vos Défausses",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Prêt・Victoire・Piocher",
    checkersKing: "Roi",
    comingSoonText: "Ce jeu est en cours de développement et apparaîtra ici automatiquement une fois prêt. Restez à l'écoute !",
    backToLobby: "Retour au Salon",
    costToastTemplate: "{cost} jetons de jeu ont été déduits pour cette partie",
  },
  de: {
    mahjongWall: "Mauerstapel",
    mahjongTotalRounds: "Gesamtrunden",
    mahjongWinCount: "Siege",
    mahjongWinRate: "Siegquote",
    mahjongYourDiscards: "Ihre Abwürfe",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Bereit・Sieg・Ziehen",
    checkersKing: "König",
    comingSoonText: "Dieses Spiel befindet sich noch in Entwicklung und erscheint hier automatisch, sobald es fertig ist. Bleiben Sie gespannt!",
    backToLobby: "Zurück zur Lobby",
    costToastTemplate: "{cost} Spielmünzen wurden für diese Runde abgezogen",
  },
  it: {
    mahjongWall: "Muro di Tessere",
    mahjongTotalRounds: "Round Totali",
    mahjongWinCount: "Vittorie",
    mahjongWinRate: "Tasso di Vittoria",
    mahjongYourDiscards: "I Tuoi Scarti",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Pronto・Vittoria・Pesca",
    checkersKing: "Re",
    comingSoonText: "Questo gioco è in fase di sviluppo e apparirà qui automaticamente una volta pronto. Restate sintonizzati!",
    backToLobby: "Torna alla Sala",
    costToastTemplate: "{cost} monete di gioco sono state dedotte per questa partita",
  },
  ru: {
    mahjongWall: "Стена костей",
    mahjongTotalRounds: "Всего раундов",
    mahjongWinCount: "Побед",
    mahjongWinRate: "Процент побед",
    mahjongYourDiscards: "Ваши сбросы",
    mahjongEatPongKong: "Чоу・Пон・Кон",
    mahjongTingWinDraw: "Тинг・Победа・Взять",
    checkersKing: "Король",
    comingSoonText: "Эта игра сейчас в разработке и появится здесь автоматически, когда будет готова. Следите за обновлениями!",
    backToLobby: "Вернуться в лобби",
    costToastTemplate: "За этот раунд списано {cost} игровых монет",
  },
  ar: {
    mahjongWall: "جدار البلاط",
    mahjongTotalRounds: "إجمالي الجولات",
    mahjongWinCount: "عدد الانتصارات",
    mahjongWinRate: "نسبة الفوز",
    mahjongYourDiscards: "بلاطاتك المرمية",
    mahjongEatPongKong: "تشاو・بونج・كونج",
    mahjongTingWinDraw: "تينج・فوز・سحب",
    checkersKing: "الملك",
    comingSoonText: "هذه اللعبة قيد التطوير حاليًا وستظهر هنا تلقائيًا عند اكتمالها. تابعونا!",
    backToLobby: "العودة إلى الردهة",
    costToastTemplate: "تم خصم {cost} من عملات اللعبة لهذه الجولة",
  },
  hi: {
    mahjongWall: "टाइल दीवार",
    mahjongTotalRounds: "कुल राउंड",
    mahjongWinCount: "जीत की संख्या",
    mahjongWinRate: "जीत दर",
    mahjongYourDiscards: "आपकी फेंकी टाइलें",
    mahjongEatPongKong: "चाओ・पोंग・कोंग",
    mahjongTingWinDraw: "तैयार・जीत・उठाना",
    checkersKing: "राजा",
    comingSoonText: "यह गेम अभी बनाया जा रहा है और तैयार होने पर यहां स्वचालित रूप से दिखेगा। बने रहें!",
    backToLobby: "लॉबी में वापस जाएं",
    costToastTemplate: "इस राउंड के लिए {cost} गेम कॉइन काटे गए",
  },
  tr: {
    mahjongWall: "Taş Duvarı",
    mahjongTotalRounds: "Toplam Tur",
    mahjongWinCount: "Kazanma Sayısı",
    mahjongWinRate: "Kazanma Oranı",
    mahjongYourDiscards: "Attığınız Taşlar",
    mahjongEatPongKong: "Chow・Pong・Kong",
    mahjongTingWinDraw: "Hazır・Kazan・Çek",
    checkersKing: "Şah",
    comingSoonText: "Bu oyun geliştirilmekte ve hazır olduğunda otomatik olarak burada görünecek. Takipte kalın!",
    backToLobby: "Lobiye Dön",
    costToastTemplate: "Bu tur için {cost} oyun jetonu kesildi",
  },
  bn: {
    mahjongWall: "টাইল প্রাচীর",
    mahjongTotalRounds: "মোট রাউন্ড",
    mahjongWinCount: "জয়ের সংখ্যা",
    mahjongWinRate: "জয়ের হার",
    mahjongYourDiscards: "আপনার ফেলা টাইল",
    mahjongEatPongKong: "চাও・পং・কং",
    mahjongTingWinDraw: "রেডি・জয়・তোলা",
    checkersKing: "রাজা",
    comingSoonText: "এই গেমটি তৈরি করা হচ্ছে এবং সম্পূর্ণ হলে এখানে স্বয়ংক্রিয়ভাবে দেখা যাবে। সাথেই থাকুন!",
    backToLobby: "লবিতে ফিরে যান",
    costToastTemplate: "এই রাউন্ডের জন্য {cost} গেম কয়েন কাটা হয়েছে",
  },
}
