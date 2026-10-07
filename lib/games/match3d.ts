// 3D消除 — 立體雜物堆點擊收集，湊滿 3 個相同即消除
import { tcNew, type TileState } from "./tile-collect"

export const M3D_ICON_COUNT = 9
export const M3D_LAYERS = 5
export const M3D_PER_LAYER = 8

export function match3dNew(): TileState {
  return tcNew(M3D_ICON_COUNT, M3D_LAYERS, M3D_PER_LAYER)
}
