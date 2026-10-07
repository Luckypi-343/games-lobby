"use client"

import { TileCollectView } from "./tile-collect-view"
import { sheepNew } from "@/lib/games/sheep-sheep"

const ICONS: { bg: string; fg: string; shape: "circle" | "cloud" | "flower" | "fence" }[] = [
  { bg: "radial-gradient(circle at 35% 30%, #fff, #f1f5f9 55%, #cbd5e1)", fg: "#1e293b", shape: "circle" }, // 羊
  { bg: "radial-gradient(circle at 35% 30%, #86efac, #22c55e 60%, #14532d)", fg: "#ffffff", shape: "circle" }, // 草地
  { bg: "radial-gradient(circle at 35% 30%, #fef9c3, #fde047 55%, #a16207)", fg: "#92400e", shape: "circle" }, // 太陽
  { bg: "radial-gradient(circle at 35% 30%, #ffffff, #e2e8f0 60%, #94a3b8)", fg: "#475569", shape: "cloud" }, // 雲朵
  { bg: "radial-gradient(circle at 35% 30%, #fecdd3, #f472b6 55%, #9d174d)", fg: "#ffffff", shape: "flower" }, // 花朵
  { bg: "radial-gradient(circle at 35% 30%, #fed7aa, #f97316 55%, #7c2d12)", fg: "#ffffff", shape: "circle" }, // 紅蘿蔔
  { bg: "radial-gradient(circle at 35% 30%, #fef08a, #eab308 55%, #713f12)", fg: "#713f12", shape: "circle" }, // 鈴鐺
  { bg: "linear-gradient(135deg, #d6bcfa, #a78bfa 50%, #5b21b6)", fg: "#ffffff", shape: "fence" }, // 柵欄
]

function Icon({ icon, size }: { icon: number; size: number }) {
  const style = ICONS[icon] ?? ICONS[0]
  return (
    <div
      className="relative flex items-center justify-center rounded-xl"
      style={{
        width: size,
        height: size,
        background: style.bg,
        boxShadow: "inset -2px -3px 4px rgba(0,0,0,0.3), inset 2px 2px 3px rgba(255,255,255,0.5), 0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      {style.shape === "circle" && <div className="h-[55%] w-[55%] rounded-full" style={{ background: style.fg, opacity: 0.25 }} />}
      {style.shape === "cloud" && (
        <div className="flex gap-0.5">
          <div className="h-3 w-3 rounded-full" style={{ background: style.fg, opacity: 0.4 }} />
          <div className="h-4 w-4 rounded-full" style={{ background: style.fg, opacity: 0.4 }} />
          <div className="h-3 w-3 rounded-full" style={{ background: style.fg, opacity: 0.4 }} />
        </div>
      )}
      {style.shape === "flower" && (
        <div className="relative h-[60%] w-[60%]">
          {[0, 72, 144, 216, 288].map((deg) => (
            <div
              key={deg}
              className="absolute left-1/2 top-1/2 h-[45%] w-[30%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: style.fg, opacity: 0.5, transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-40%)` }}
            />
          ))}
        </div>
      )}
      {style.shape === "fence" && (
        <div className="flex h-[60%] w-[60%] items-end justify-between">
          <div className="h-full w-[18%] rounded-sm" style={{ background: style.fg, opacity: 0.5 }} />
          <div className="h-[75%] w-[18%] rounded-sm" style={{ background: style.fg, opacity: 0.5 }} />
          <div className="h-full w-[18%] rounded-sm" style={{ background: style.fg, opacity: 0.5 }} />
        </div>
      )}
      <div className="absolute left-[16%] top-[14%] h-[18%] w-[18%] rounded-full bg-white/60 blur-[1px]" />
    </div>
  )
}

export function SheepSheepView({ onBack }: { onBack: () => void }) {
  return (
    <TileCollectView
      gameId="sheep-sheep"
      title="羊了個羊"
      subtitle="四層牧場小物堆疊，點擊收集湊滿 3 個同款即消除"
      rulesBrief="畫面上堆疊了四層牧場小物（小羊、草地、太陽、雲朵、花朵、紅蘿蔔、鈴鐺、柵欄），只能點擊沒有被上層物件壓住的圖案，點擊後會收進下方收集槽。收集槽裡湊滿 3 個一樣的圖案就會自動消除清空。收集槽滿了（7格）還沒湊到三連就會挑戰失敗，把牧場上所有小物清空即可過關。"
      cost={8}
      boardBg="linear-gradient(180deg, #ecfccb 0%, #d9f99d 55%, #bef264 100%)"
      renderIcon={(icon, size) => <Icon icon={icon} size={size} />}
      initial={sheepNew}
      onBack={onBack}
    />
  )
}
