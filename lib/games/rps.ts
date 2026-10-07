import type { Difficulty } from "@/lib/luckypi/data"

export type RpsChoice = "rock" | "paper" | "scissors"

const CHOICES: RpsChoice[] = ["rock", "paper", "scissors"]

// rock beats scissors, scissors beats paper, paper beats rock
const BEATS: Record<RpsChoice, RpsChoice> = {
  rock: "scissors",
  scissors: "paper",
  paper: "rock",
}

export function rpsOutcome(player: RpsChoice, ai: RpsChoice): "win" | "loss" | "draw" {
  if (player === ai) return "draw"
  return BEATS[player] === ai ? "win" : "loss"
}

// On easy/medium the computer plays uniformly at random (a fair opponent).
// On hard, it leans toward whatever counters the player's most frequent recent pick,
// which feels tougher without ever being unbeatable or reading future moves.
export function rpsAiChoice(difficulty: Difficulty, playerHistory: RpsChoice[]): RpsChoice {
  if (difficulty === "hard" && playerHistory.length >= 2 && Math.random() < 0.55) {
    const counts: Record<RpsChoice, number> = { rock: 0, paper: 0, scissors: 0 }
    for (const c of playerHistory.slice(-5)) counts[c]++
    const favored = (Object.keys(counts) as RpsChoice[]).sort((a, b) => counts[b] - counts[a])[0]
    // Pick the move that beats the player's favorite choice.
    const counter = (Object.keys(BEATS) as RpsChoice[]).find((k) => BEATS[k] === favored)
    if (counter) return counter
  }
  return CHOICES[Math.floor(Math.random() * CHOICES.length)]
}

export const RPS_GLYPH: Record<RpsChoice, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
}
