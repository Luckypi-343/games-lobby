"use client"

import { TileCollectView } from "./tile-collect-view"
import { match3dNew } from "@/lib/games/match3d"

const ICONS: { bg: string; shape: "diamond" | "star" | "box" | "key" | "circle" }[] = [
  { bg: "linear-gradient(135deg, #fecaca, #ef4444 50%, #7f1d1d)", shape: "diamond" }, // 紅寶石
  { bg: "linear-gradient(135deg, #bae6fd, #0ea5e9 50%, #0c4a6e)", shape: "diamond" }, // 藍寶石
  { bg: "linear-gradient(135deg, #fef08a, #eab308 50%, #713f12)", shape: "star" }, // 金星
  { bg: "linear-gradient(135deg, #fbcfe8, #ec4899 50%, #831843)", shape: "box" }, // 禮物盒
  { bg: "linear-gradient(135deg, #e9d5ff, #a855f7 50%, #581c87)", shape: "key" }, // 鑰匙
  { bg: "linear-gradient(135deg, #bbf7d0, #22c55e 50%, #14532d)", shape: "circle" }, // 綠寶珠
  { bg: "linear-gradient(135deg, #fed7aa, #f97316 50%, #7c2d12)", shape: "box" }, // 木箱
  { bg: "linear-gradient(135deg, #e5e7eb, #9ca3af 50%, #374151)", shape: "diamond" }, // 銀幣
  { bg: "linear-gradient(135deg, #ddd6fe, #7c3aed 50%, #3b0764)", shape: "star" }, // 紫水晶
]

function Icon({ icon, size }: { icon: number; size: number }) {
  const style = ICONS[icon] ?? ICONS[0]
  const common = {
    width: size,
    height: size,
    background: style.bg,
    boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.35), inset 2px 2px 3px rgba(255,255,255,0.55), 0 3px 5px rgba(0,0,0,0.35)",
  }
  if (style.shape === "diamond") {
    return <div className="relative" style={{ ...common, clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)" }} />
  }
  if (style.shape === "star") {
    return (
      <div
        className="relative"
        style={{ ...common, clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)" }}
      />
    )
  }
  if (style.shape === "key") {
    return (
      <div className="relative flex items-center justify-center rounded-lg" style={common}>
        <div className="absolute left-[20%] top-1/2 h-[18%] w-[55%] -translate-y-1/2 rounded-sm bg-white/30" />
        <div className="absolute left-[62%] top-1/2 h-[45%] w-[22%] -translate-y-1/2 rounded-full border-2 border-white/40" />
      </div>
    )
  }
  return (
    <div className="relative rounded-lg" style={common}>
      <div className="absolute left-[18%] top-[16%] h-[20%] w-[20%] rounded-full bg-white/55 blur-[1px]" />
      {style.shape === "box" && <div className="absolute inset-x-0 top-1/2 h-[10%] -translate-y-1/2 bg-white/25" />}
    </div>
  )
}

export function Match3DView({ onBack }: { onBack: () => void }) {
  return (
    <TileCollectView
      gameId="match3d"
      title="3D消除"
      subtitle="五層立體雜物堆，找出 3 個相同寶物放入收集欄"
      rulesBrief="畫面上堆滿五層立體雜物（紅寶石、藍寶石、金星、禮物盒、鑰匙、綠寶珠、木箱、銀幣、紫水晶），只能點擊沒有被上層物件壓住、顏色正常明亮的物品，點擊後會收進下方收集欄。收集欄湊滿 3 個相同寶物就會自動消除清空。收集欄滿了（7格）還沒湊到三連就會挑戰失敗，把雜物堆全部清空即可過關。"
      cost={8}
      boardBg="radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 60%, #020617 100%)"
      renderIcon={(icon, size) => <Icon icon={icon} size={size} />}
      initial={match3dNew}
      onBack={onBack}
    />
  )
}
