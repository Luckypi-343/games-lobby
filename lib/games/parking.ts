// 停車挑戰 — 用方向按鈕操控車輛，在有限步數內停進標記車位。
export const PK2_SIZE = 6
export const PK2_MAX_MOVES = 20

export interface Pk2State {
  carX: number
  carY: number
  facing: 0 | 1 | 2 | 3 // 0=up 1=right 2=down 3=left
  walls: { x: number; y: number }[]
  target: { x: number; y: number }
  movesLeft: number
  bumps: number
  over: boolean
  won: boolean
}

// 多設方樁障礙，提高停車挑戰的難度與場地豐富度
const WALLS = [
  { x: 2, y: 1 },
  { x: 2, y: 2 },
  { x: 4, y: 3 },
  { x: 1, y: 4 },
  { x: 3, y: 1 },
  { x: 0, y: 2 },
  { x: 5, y: 3 },
  { x: 3, y: 4 },
]

// 停車點不再固定，每次挑戰隨機從多個車位中挑一個，且避開已有的方樁位置
const TARGET_SPOTS = [
  { x: 5, y: 0 },
  { x: 0, y: 0 },
  { x: 5, y: 5 },
  { x: 2, y: 5 },
  { x: 0, y: 5 },
  { x: 4, y: 0 },
]

export function pk2New(): Pk2State {
  const target = TARGET_SPOTS[Math.floor(Math.random() * TARGET_SPOTS.length)]
  const walls = WALLS.filter((w) => !(w.x === target.x && w.y === target.y))
  return {
    carX: 0,
    carY: 5,
    facing: 0,
    walls,
    target,
    movesLeft: PK2_MAX_MOVES,
    bumps: 0,
    over: false,
    won: false,
  }
}

const DIRS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
]

export function pk2Turn(state: Pk2State, dir: -1 | 1): Pk2State {
  if (state.over) return state
  const facing = (((state.facing + dir) % 4) + 4) % 4
  return { ...state, facing: facing as 0 | 1 | 2 | 3 }
}

export function pk2Move(state: Pk2State): Pk2State {
  if (state.over || state.movesLeft <= 0) return state
  const { dx, dy } = DIRS[state.facing]
  const nx = state.carX + dx
  const ny = state.carY + dy
  let bumps = state.bumps
  let carX = state.carX
  let carY = state.carY

  const blocked = nx < 0 || nx >= PK2_SIZE || ny < 0 || ny >= PK2_SIZE || state.walls.some((w) => w.x === nx && w.y === ny)
  if (blocked) {
    bumps += 1
  } else {
    carX = nx
    carY = ny
  }

  const movesLeft = state.movesLeft - 1
  const parked = carX === state.target.x && carY === state.target.y
  const over = parked || movesLeft <= 0 || bumps >= 5
  const won = parked

  return { ...state, carX, carY, movesLeft, bumps, over, won }
}
