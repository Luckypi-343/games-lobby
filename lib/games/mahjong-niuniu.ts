// 麻將妞妞：用麻將棋子代替撲克牌玩「妞妞/牛牛」。每人發5顆（只用一筒~九筒/一索~九索/一萬~九萬，
// 每種點數各12顆，不含字牌），從中挑3顆湊成10的倍數（稱為「有妞」），剩下2顆相加取個位數比大小，
// 湊到剛好整10稱為「妞妞」最大，湊不出倍數則「無妞」最小。

export type NNTile = { id: string; label: string; value: number }

const SUITS: Array<"t" | "s" | "w"> = ["t", "s", "w"]

function buildDeck(): NNTile[] {
  const deck: NNTile[] = []
  for (const suit of SUITS) {
    for (let n = 1; n <= 9; n++) {
      for (let copy = 0; copy < 4; copy++) {
        deck.push({ id: `${suit}${n}-${copy}`, label: `${suit}${n}`, value: n })
      }
    }
  }
  return deck
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function nnScore(tiles: NNTile[]): number {
  const idx = [0, 1, 2, 3, 4]
  let best = -1
  for (let a = 0; a < 5; a++) {
    for (let b = a + 1; b < 5; b++) {
      for (let c = b + 1; c < 5; c++) {
        const sum3 = tiles[a].value + tiles[b].value + tiles[c].value
        if (sum3 % 10 !== 0) continue
        const rest = idx.filter((i) => i !== a && i !== b && i !== c)
        const sum2 = (tiles[rest[0]].value + tiles[rest[1]].value) % 10
        const score = sum2 === 0 ? 10 : sum2
        if (score > best) best = score
      }
    }
  }
  return best < 0 ? 0 : best
}

export function nnLabel(score: number): string {
  if (score === 0) return "無妞"
  if (score === 10) return "妞妞"
  return `妞${score}`
}

export type NNPhase = "betting" | "revealed"

export type NNState = {
  phase: NNPhase
  bet: number
  player: NNTile[]
  dealer: NNTile[]
  playerScore: number
  dealerScore: number
  result: "win" | "lose" | "push" | null
  payout: number
}

export function nnInitial(bet: number): NNState {
  return { phase: "betting", bet, player: [], dealer: [], playerScore: 0, dealerScore: 0, result: null, payout: 0 }
}

export function nnDeal(bet: number): NNState {
  const deck = shuffle(buildDeck())
  const player = deck.slice(0, 5)
  const dealer = deck.slice(5, 10)
  const playerScore = nnScore(player)
  const dealerScore = nnScore(dealer)
  let result: NNState["result"]
  let multiplier = 1
  if (playerScore === dealerScore) {
    result = "push"
  } else if (playerScore > dealerScore) {
    result = "win"
    if (playerScore === 10) multiplier = 3 // 妞妞加碼3倍
    else if (playerScore >= 7) multiplier = 2 // 妞7以上加碼2倍
  } else {
    result = "lose"
    if (dealerScore === 10) multiplier = 3
    else if (dealerScore >= 7) multiplier = 2
  }
  const payout = result === "win" ? bet * multiplier : result === "push" ? 0 : -bet * multiplier
  return { phase: "revealed", bet, player, dealer, playerScore, dealerScore, result, payout }
}
