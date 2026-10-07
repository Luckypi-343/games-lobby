// 極速漂移 — 順著彎道左右轉向維持在賽道上，累積漂移分數並抵達終點。
export const DR_GOAL_DISTANCE = 400
export const DR_TRACK_WIDTH = 60
export const DR_WIN_SCORE = 150

export interface DrState {
  carX: number
  roadCenter: number
  curveDir: number
  distance: number
  driftScore: number
  offTrackTime: number
  over: boolean
  won: boolean
}

export function drNew(): DrState {
  return {
    carX: 50,
    roadCenter: 50,
    curveDir: 1,
    distance: 0,
    driftScore: 0,
    offTrackTime: 0,
    over: false,
    won: false,
  }
}

export function drSteer(state: DrState, dx: number): DrState {
  if (state.over) return state
  const carX = Math.max(0, Math.min(100, state.carX + dx))
  return { ...state, carX }
}

export function drTick(state: DrState): DrState {
  if (state.over) return state

  const distance = state.distance + 2.2
  const wave = Math.sin(distance / 60) * 22
  const roadCenter = 50 + wave

  const steering = Math.abs(state.carX - state.roadCenter) > 3
  const onCurve = Math.abs(wave) > 8
  const driftScore = state.driftScore + (steering && onCurve ? 2 : 0)

  const offTrack = Math.abs(state.carX - roadCenter) > DR_TRACK_WIDTH / 2
  const offTrackTime = offTrack ? state.offTrackTime + 1 : 0

  const won = distance >= DR_GOAL_DISTANCE && driftScore >= DR_WIN_SCORE
  const failed = offTrackTime >= 18
  const over = won || failed || (distance >= DR_GOAL_DISTANCE && driftScore < DR_WIN_SCORE)

  return {
    carX: state.carX,
    roadCenter,
    curveDir: state.curveDir,
    distance: Math.min(distance, DR_GOAL_DISTANCE),
    driftScore,
    offTrackTime,
    over,
    won,
  }
}
