// 傳統麻台（幸運七倍加碼版）純邏輯引擎。
// 完全複製第一代（little-mary.ts）的燈位排列、押注圖案、機率權重與 ONCE MORE 全額退回規則，
// 唯一不同：把原本的「JP強制停在大牌/小牌」機制，改成「幸運七倍加碼」——
// 停在BAR類或大牌/小牌且該圖案自己有押注中獎時，額外有機會跳出三個獨立數字轉輪（0～9）的加碼關卡：
// 平常這三個轉輪只是裝飾性亂數跑動，不代表任何意義；加碼關卡觸發時，轉輪由左而右依序停下，
// 第三輪刻意拖長、神秘式慢慢停——通常第三輪會停在跟前兩輪不同的數字（只是預告、留下期待），
// 大約每100～200次中獎才會真正三輪同一數字：111/333/555/777/999 中獎再×10，000/222/444/666/888 中獎再×5。
import {
  LITTLE_MARY_RING,
  RING_SIZE,
  BOARD_COLS,
  BOARD_ROWS,
  BIG_CHASE_VALUES,
  SMALL_CHASE_VALUES,
  STAKE_SYMBOLS,
  slotPosition,
  createEmptyBets,
  totalStaked,
  type LittleMarySlot,
  type LittleMaryBets,
  type LittleMaryStakeKey,
} from "./little-mary"

export {
  LITTLE_MARY_RING,
  RING_SIZE,
  BOARD_COLS,
  BOARD_ROWS,
  BIG_CHASE_VALUES,
  SMALL_CHASE_VALUES,
  STAKE_SYMBOLS,
  slotPosition,
  createEmptyBets,
  totalStaked,
}
export type { LittleMarySlot, LittleMaryBets, LittleMaryStakeKey }

/** 單條BAR（🅱️×25倍）不限制；雙疊BAR（🅰️×50倍）與三疊BAR（🆎×100倍）累積至少這麼多轉才有機會隨機出現，跟第一代相同。 */
export const BAR_3_MIN_SPINS = 80
export const BAR_2_MIN_SPINS = 40

/** 幸運七轉輪：累積至少這麼多次「BAR／大牌／小牌中獎」才有機會真正開出三同數字。 */
export const BONUS_MIN_WINS = 100
/** 超過門檻後最晚再累積這麼多次中獎，必定開出一次真正三同數字，保證不會無限拖延。 */
export const BONUS_WINDOW_WINS = 100
/** 門檻開啟後，每次符合資格的中獎，有這個機率直接開出真正三同數字（門檻前恆為不可能）。 */
const BONUS_TRUE_CHANCE = 0.12
/** 不論門檻是否開啟，符合資格的中獎都有這個機率跳出轉輪關卡（多半只是預告式的「差一點」，留下期待與驚喜）。 */
const BONUS_TEASE_CHANCE = 0.4

export const BONUS_ODD_MULTIPLIER = 10
export const BONUS_EVEN_MULTIPLIER = 5

export interface LittleMaryBonusState {
  spinsSince3Bar: number
  spinsSince2Bar: number
  winsSinceBonus: number
}

export function createLittleMaryBonusState(): LittleMaryBonusState {
  return { spinsSince3Bar: 0, spinsSince2Bar: 0, winsSinceBonus: 0 }
}

function weightedPick(rng: () => number): number {
  return Math.floor(rng() * RING_SIZE)
}

function weightedPickWithBarGate(rng: () => number, allow3Bar: boolean, allow2Bar: boolean): number {
  for (let attempt = 0; attempt < 64; attempt++) {
    const idx = weightedPick(rng)
    const s = LITTLE_MARY_RING[idx]
    if (s.kind === "bar") {
      if (s.fixedMultiplier === 100 && !allow3Bar) continue
      if (s.fixedMultiplier === 50 && !allow2Bar) continue
    }
    return idx
  }
  return weightedPick(rng)
}

export interface LittleMaryBonusSpinResult {
  stopIndex: number
  slot: LittleMarySlot
  outcome: "lose" | "once-more" | "win"
  totalStaked: number
  stakeUsed: number
  /** 這一轉基礎倍數（未乘上幸運七加碼）。 */
  baseMultiplier: number
  /** 基礎中獎金額（未乘上幸運七加碼）。 */
  basePayout: number
  /** 是否跳出幸運七轉輪關卡（不代表一定中加碼）。 */
  bonusShown: boolean
  /** 轉輪關卡最終三個數字（由左而右）；未跳出關卡時為 undefined。 */
  bonusDigits?: [number, number, number]
  /** 是否真正開出三同數字（決定是否真的加碼）。 */
  bonusHit: boolean
  /** 幸運七加碼倍數（沒中獎或沒跳關卡時為 1）。 */
  bonusMultiplier: number
  /** 最終中獎金額 = basePayout × bonusMultiplier。 */
  payout: number
  chaseValue?: number
  nextState: LittleMaryBonusState
}

export function spinLittleMaryBonus(
  bets: LittleMaryBets,
  state: LittleMaryBonusState,
  rng: () => number = Math.random,
): LittleMaryBonusSpinResult {
  const staked = totalStaked(bets)
  const spinsSince3Bar = state.spinsSince3Bar + 1
  const spinsSince2Bar = state.spinsSince2Bar + 1
  const stopIndex = weightedPickWithBarGate(rng, spinsSince3Bar >= BAR_3_MIN_SPINS, spinsSince2Bar >= BAR_2_MIN_SPINS)
  const slotHit = LITTLE_MARY_RING[stopIndex]

  if (slotHit.kind === "arrow") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "lose",
      totalStaked: staked,
      stakeUsed: 0,
      baseMultiplier: 0,
      basePayout: 0,
      bonusShown: false,
      bonusHit: false,
      bonusMultiplier: 1,
      payout: 0,
      nextState: { spinsSince3Bar, spinsSince2Bar, winsSinceBonus: state.winsSinceBonus },
    }
  }

  if (slotHit.kind === "once-more") {
    return {
      stopIndex,
      slot: slotHit,
      outcome: "once-more",
      totalStaked: staked,
      stakeUsed: 0,
      baseMultiplier: 0,
      basePayout: staked,
      bonusShown: false,
      bonusHit: false,
      bonusMultiplier: 1,
      payout: staked,
      nextState: { spinsSince3Bar: state.spinsSince3Bar, spinsSince2Bar: state.spinsSince2Bar, winsSinceBonus: state.winsSinceBonus },
    }
  }

  const stakeKey = slotHit.stakeKey!
  const stakeUsed = bets[stakeKey] ?? 0
  const isQualifyingGroup = slotHit.kind === "bar" || slotHit.kind === "big" || slotHit.kind === "small"
  const isWin = stakeUsed > 0

  let baseMultiplier = 0
  let chaseValue: number | undefined
  let next3Bar = spinsSince3Bar
  let next2Bar = spinsSince2Bar

  if (slotHit.kind === "bar" || slotHit.kind === "fixed") {
    baseMultiplier = slotHit.fixedMultiplier ?? 1
    if (slotHit.fixedMultiplier === 100) next3Bar = 0
    if (slotHit.fixedMultiplier === 50) next2Bar = 0
  } else {
    const chaseValues = slotHit.kind === "big" ? BIG_CHASE_VALUES : SMALL_CHASE_VALUES
    chaseValue = chaseValues[Math.floor(rng() * chaseValues.length)]
    baseMultiplier = chaseValue
  }

  const basePayout = stakeUsed * baseMultiplier

  // 幸運七轉輪：只有BAR／大牌／小牌真正中獎（該圖案自己有押注）才有機會隨機跳出。
  let bonusShown = false
  let bonusHit = false
  let bonusMultiplier = 1
  let bonusDigits: [number, number, number] | undefined
  let winsSinceBonus = state.winsSinceBonus

  if (isQualifyingGroup && isWin) {
    winsSinceBonus += 1
    const windowOpen = winsSinceBonus >= BONUS_MIN_WINS
    const forced = winsSinceBonus >= BONUS_MIN_WINS + BONUS_WINDOW_WINS
    bonusHit = windowOpen && (forced || rng() < BONUS_TRUE_CHANCE)
    bonusShown = bonusHit || rng() < BONUS_TEASE_CHANCE

    if (bonusShown) {
      if (bonusHit) {
        const digit = Math.floor(rng() * 10)
        bonusDigits = [digit, digit, digit]
        bonusMultiplier = digit % 2 === 1 ? BONUS_ODD_MULTIPLIER : BONUS_EVEN_MULTIPLIER
        winsSinceBonus = 0
      } else {
        const d1 = Math.floor(rng() * 10)
        let d2 = Math.floor(rng() * 10)
        if (d2 === d1) d2 = (d2 + 1 + Math.floor(rng() * 9)) % 10
        bonusDigits = [d1, d1, d2]
      }
    }
  }

  const payout = basePayout * bonusMultiplier

  return {
    stopIndex,
    slot: slotHit,
    outcome: isWin ? "win" : "lose",
    totalStaked: staked,
    stakeUsed,
    baseMultiplier,
    basePayout,
    bonusShown,
    bonusDigits,
    bonusHit,
    bonusMultiplier,
    payout,
    chaseValue,
    nextState: { spinsSince3Bar: next3Bar, spinsSince2Bar: next2Bar, winsSinceBonus },
  }
}
