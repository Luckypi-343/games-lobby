// 帝國與拼圖 — 寶石消除 + 簡化城市建設與 PvP 英雄對決
import { rmNewBoard, rmGrantStageExp, type RmState, type RmCharacter, type RmEnemy } from "./rpg-match3-core"

const BASE_PARTY: Omit<RmCharacter, "hp">[] = [
  { id: "knight", name: "王國騎士", element: 0, maxHp: 125, atk: 23, level: 1, exp: 0 },
  { id: "archer", name: "精靈弓手", element: 2, maxHp: 95, atk: 25, level: 1, exp: 0 },
  { id: "cleric", name: "聖光祭司", element: 3, maxHp: 105, atk: 18, level: 1, exp: 0 },
]

const RIVAL_NAMES = ["鄰國傭兵隊長", "流亡騎士", "海盜船長", "蠻族首領", "敵國將軍", "帝國皇帝"]

export const BUILD_TARGETS = { wood: 40, stone: 30, food: 35 }

function makeRival(stage: number, slot: number): RmEnemy {
  const element = ((stage + slot) % 5) as 0
  const scale = 1 + stage * 0.38
  return {
    id: `ep${stage}-${slot}`,
    name: RIVAL_NAMES[(stage + slot) % RIVAL_NAMES.length],
    element,
    maxHp: Math.round(145 * scale),
    hp: Math.round(145 * scale),
    atk: Math.round(17 * scale),
    turnsToAttack: 3,
    attackIn: 3,
  }
}

export function epNewStage(stage: number, party?: RmCharacter[], resources?: RmState["resources"]): RmState {
  const count = stage >= 4 ? 2 : 1
  const enemies = Array.from({ length: count }, (_, i) => makeRival(stage, i))
  const basedParty = (party ?? BASE_PARTY.map((p) => ({ ...p, hp: p.maxHp }))).map((p) => ({ ...p, hp: p.maxHp }))
  return {
    grid: rmNewBoard(),
    party: basedParty,
    enemies,
    enemyIndex: 0,
    stage,
    maxStage: 6,
    log: [`PvP 第 ${stage} 回合：對上 ${enemies.map((e) => e.name).join("、")}，消除寶石收集建材並擊退對手！`],
    gold: 0,
    resources: resources ?? { wood: 0, stone: 0, food: 0 },
    cleared: false,
    defeated: false,
    lastDamage: 0,
  }
}

export function epNew(): RmState {
  return epNewStage(1)
}

export function epAdvance(state: RmState): RmState {
  const leveled = rmGrantStageExp(state)
  if (leveled.stage >= leveled.maxStage) {
    return epNewStage(1, leveled.party, leveled.resources)
  }
  return epNewStage(leveled.stage + 1, leveled.party, leveled.resources)
}
