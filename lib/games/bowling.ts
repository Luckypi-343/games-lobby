// 保齡球 — 拖曳調整角度後擲球，3 局內擊倒的球瓶數達標即過關。
export const BW_PINS = 10
export const BW_FRAMES = 3
export const BW_WIN_SCORE = 20

export interface BwState {
  angle: number
  rolling: boolean
  ballX: number
  ballY: number
  standing: boolean[]
  frame: number
  ballInFrame: number
  totalScore: number
  frameHistory: number[]
  over: boolean
  won: boolean
  message: string
}

export function bwNew(): BwState {
  return {
    angle: 0,
    rolling: false,
    ballX: 50,
    ballY: 92,
    standing: Array(BW_PINS).fill(true),
    frame: 1,
    ballInFrame: 1,
    totalScore: 0,
    frameHistory: [],
    over: false,
    won: false,
    message: "拖曳調整角度後擲球",
  }
}

export function bwSetAngle(state: BwState, angle: number): BwState {
  if (state.rolling || state.over) return state
  return { ...state, angle: Math.max(-30, Math.min(30, angle)) }
}

export function bwRoll(state: BwState): BwState {
  if (state.rolling || state.over) return state
  return { ...state, rolling: true, ballX: 50, ballY: 92 }
}

export function bwTick(state: BwState): BwState {
  if (!state.rolling || state.over) return state
  const nextY = state.ballY - 4
  const drift = state.angle * 0.06
  const nextX = state.ballX + drift

  if (nextY > 18) {
    return { ...state, ballX: nextX, ballY: nextY }
  }

  const standing = state.standing.map((alive, i) => {
    if (!alive) return false
    const pinX = 30 + (i % 4) * 13 + Math.floor(i / 4) * 6.5
    return Math.abs(pinX - nextX) > 9
  })
  const knocked = state.standing.filter(Boolean).length - standing.filter(Boolean).length

  let ballInFrame = state.ballInFrame
  let frame = state.frame
  let frameHistory = state.frameHistory
  let totalScore = state.totalScore + knocked
  let nextStanding = standing
  let message = knocked > 0 ? `擲球擊倒 ${knocked} 瓶！` : "沒有擊倒任何球瓶"

  const allDown = standing.every((s) => !s)
  if (allDown || ballInFrame >= 2) {
    frameHistory = [...frameHistory, totalScore - state.totalScore + (frameHistory.length ? 0 : 0)]
    frame += 1
    ballInFrame = 1
    nextStanding = Array(BW_PINS).fill(true)
  } else {
    ballInFrame += 1
  }

  const over = frame > BW_FRAMES
  const won = over && totalScore >= BW_WIN_SCORE

  return {
    angle: 0,
    rolling: false,
    ballX: 50,
    ballY: 92,
    standing: over ? standing : nextStanding,
    frame: Math.min(frame, BW_FRAMES),
    ballInFrame,
    totalScore,
    frameHistory,
    over,
    won,
    message: over ? (won ? "恭喜達標過關！" : "分數不足，再挑戰一次！") : message,
  }
}
