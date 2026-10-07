import type { Difficulty } from "@/lib/luckypi/data"

export type { Difficulty }

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "初級",
  medium: "中級",
  hard: "高級",
}

// 難度只影響 AI 選擇「隨機合法著手」而非「最佳著手」的機率，
// 隨機池永遠是合法著手，所以無論難度高低，AI 的每一步都保證合法。
const RANDOM_CHANCE: Record<Difficulty, number> = {
  easy: 0.55,
  medium: 0.22,
  hard: 0,
}

export function applyDifficulty<T>(difficulty: Difficulty, bestMove: T | null, randomPool: T[]): T | null {
  if (randomPool.length === 0) return bestMove
  const chance = RANDOM_CHANCE[difficulty]
  if (bestMove === null) return randomPool[Math.floor(Math.random() * randomPool.length)]
  if (Math.random() < chance) {
    return randomPool[Math.floor(Math.random() * randomPool.length)]
  }
  return bestMove
}
