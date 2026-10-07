// 羊了個羊 — 多層堆疊點擊收集，湊滿 3 個相同即消除
import { tcNew, type TileState } from "./tile-collect"

export const SHEEP_ICON_COUNT = 8
export const SHEEP_LAYERS = 4
export const SHEEP_PER_LAYER = 9

export function sheepNew(): TileState {
  return tcNew(SHEEP_ICON_COUNT, SHEEP_LAYERS, SHEEP_PER_LAYER)
}
