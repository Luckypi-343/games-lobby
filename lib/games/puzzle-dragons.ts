// 智龍迷城 — 寶石消除 + 屬性相剋戰鬥養成
import { rmNewBoard, rmGrantStageExp, type RmState, type RmCharacter, type RmEnemy } from "./rpg-match3-core"

const BASE_PARTY: Omit<RmCharacter, "hp">[] = [
  { id: "fire-dragon", name: "赤焰飛龍", element: 0, maxHp: 110, atk: 24, level: 1, exp: 0 },
  { id: "water-dragon", name: "蒼藍海龍", element: 1, maxHp: 115, atk: 20, level: 1, exp: 0 },
  { id: "wood-dragon", name: "翠綠森龍", element: 2, maxHp: 105, atk: 22, level: 1, exp: 0 },
]

const DUNGEON_NAMES = ["新手之塔", "炎之洞窟", "水之神殿", "森之迷宮", "光暗之境", "龍王殿"]
const ENEMY_NAMES = ["史萊姆", "哥布林戰士", "妖精法師", "沙漠蠍王", "深淵魔龍"]

function makeEnemy(stage: number, slot: number): RmEnemy {
  const element = ((stage + slot * 2) % 5) as 0
  const scale = 1 + stage * 0.4
  return {
    id: `pd${stage}-${slot}`,
    name: ENEMY_NAMES[(stage + slot) % ENEMY_NAMES.length],
    element,
    maxHp: Math.round(150 * scale),
    hp: Math.round(150 * scale),
    atk: Math.round(15 * scale),
    turnsToAttack: 3,
    attackIn: 3,
  }
}

export function pdNewStage(stage: number, party?: RmCharacter[]): RmState {
  const count = stage >= 5 ? 3 : stage >= 3 ? 2 : 1
  const enemies = Array.from({ length: count }, (_, i) => makeEnemy(stage, i))
  const basedParty = (party ?? BASE_PARTY.map((p) => ({ ...p, hp: p.maxHp }))).map((p) => ({ ...p, hp: p.maxHp }))
  return {
    grid: rmNewBoard(),
    party: basedParty,
    enemies,
    enemyIndex: 0,
    stage,
    maxStage: 6,
    log: [`進入「${DUNGEON_NAMES[(stage - 1) % DUNGEON_NAMES.length]}」：注意屬性相剋，用剋制的寶石造成加成傷害！`],
    gold: 0,
    resources: { wood: 0, stone: 0, food: 0 },
    cleared: false,
    defeated: false,
    lastDamage: 0,
  }
}

export function pdNew(): RmState {
  return pdNewStage(1)
}

export function pdAdvance(state: RmState): RmState {
  const leveled = rmGrantStageExp(state)
  if (leveled.stage >= leveled.maxStage) {
    return pdNewStage(1, leveled.party)
  }
  return pdNewStage(leveled.stage + 1, leveled.party)
}

export const PD_DUNGEON_NAMES = DUNGEON_NAMES
