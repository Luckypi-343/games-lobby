"use client"

// Procedural "rumble" sound for the spinning reels — five independent mechanical
// thump rhythms (not continuous noise/tone) stacked together to feel like five
// wheels spinning at once, dropped one at a time as each column stops.

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      ctx = new Ctor()
    }
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {})
    }
    return ctx
  } catch {
    return null
  }
}

// 齒輪轉動聲：完全不用任何固定音高的振盪器（那才是先前聽起來像高壓電流／警報聲
// 的真正原因），純粹用經過濾波的噴射式噪音（每個轉輪各自一段長緩衝的隨機噪音，
// 迴圈播放），濾波器的截止頻率用「隨機漫步」而非固定值或週期性 LFO 慢慢飄動，
// 這樣聽起來才會是真正無規律、渾厚的機械滾動悶聲，不會被耳朵誤判成任何有音高
// 的嗡鳴或電流聲。5 個轉輪各自的噪音緩衝、濾波飄動節奏都不同，隨每一豎列停止
// 逐一抽掉，越接近停止越稀薄。
interface GearVoice {
  source: AudioBufferSourceNode
  filter: BiquadFilterNode
  gain: GainNode
  driftTimer: number
  stopped: boolean
}

let gearVoices: GearVoice[] = []
let rumbleMasterGain: GainNode | null = null

// 產生一段數秒長的隨機噪音緩衝，之後用 loop 播放，避免用短顆粒疊加造成的
// 規律敲擊感——來源訊號本身就是連續無規律的噴射噪音。
function makeNoiseBuffer(audioCtx: AudioContext, seconds: number) {
  const buf = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * seconds), audioCtx.sampleRate)
  const data = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < data.length; i++) {
    // 用簡單的漏積分（leaky integrator）把白噪音變成偏低頻的棕噪音，
    // 聽感更悶更厚，不刺耳。
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    data[i] = last * 3.2
  }
  return buf
}

// 依機台專屬主題色相，把音效的音高整體升降一點，讓每一台機台的隆隆聲／煖車聲／
// 中獎音／背景音樂，聽起來都跟別台有些微不同，色相數值只是拿來當作穩定的「種子」，
// 不代表真的有色彩與音高的物理對應關係。
function hueShift(hue = 45) {
  const h = ((hue % 360) + 360) % 360
  return 0.72 + (h / 360) * 0.85
}

export function startReelRumble(enabled: boolean, hue = 45) {
  stopReelRumble()
  if (!enabled) return
  const audioCtx = getCtx()
  if (!audioCtx) return
  try {
    const shift = hueShift(hue)
    rumbleMasterGain = audioCtx.createGain()
    rumbleMasterGain.gain.value = 0.55
    rumbleMasterGain.connect(audioCtx.destination)

    const wheels = [
      { baseFreq: 240 * shift, range: 110 * shift, amp: 0.9 },
      { baseFreq: 200 * shift, range: 90 * shift, amp: 0.8 },
      { baseFreq: 270 * shift, range: 120 * shift, amp: 0.85 },
      { baseFreq: 180 * shift, range: 80 * shift, amp: 0.75 },
      { baseFreq: 220 * shift, range: 100 * shift, amp: 0.8 },
    ]
    wheels.forEach(({ baseFreq, range, amp }) => {
      const buffer = makeNoiseBuffer(audioCtx, 4 + Math.random())
      const source = audioCtx.createBufferSource()
      source.buffer = buffer
      source.loop = true

      const filter = audioCtx.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.value = baseFreq
      filter.Q.value = 0.5

      const gain = audioCtx.createGain()
      gain.gain.value = amp * 0.22
      if (!rumbleMasterGain) return

      source.connect(filter)
      filter.connect(gain)
      gain.connect(rumbleMasterGain)
      source.start()

      const voice: GearVoice = { source, filter, gain, driftTimer: 0, stopped: false }

      // 隨機漫步調整濾波截止頻率：每隔一段不規則的時間，緩慢滑向一個新的隨機
      // 目標值，完全沒有固定週期，聽起來是渾厚、無規律的機械滾動聲。
      const drift = () => {
        if (voice.stopped) return
        const target = baseFreq + (Math.random() * 2 - 1) * range
        const now = audioCtx.currentTime
        filter.frequency.cancelScheduledValues(now)
        filter.frequency.setTargetAtTime(target, now, 0.35)
        voice.driftTimer = window.setTimeout(drift, 260 + Math.random() * 380)
      }
      drift()

      gearVoices.push(voice)
    })
  } catch {
    // best-effort ambience only — never blocks gameplay
  }
}

export function reduceReelRumble(remaining: number) {
  while (gearVoices.length > Math.max(0, remaining)) {
    const last = gearVoices.pop()
    if (!last) break
    last.stopped = true
    window.clearTimeout(last.driftTimer)
    try {
      last.gain.gain.setTargetAtTime(0, last.source.context.currentTime, 0.12)
      window.setTimeout(() => {
        try {
          last.source.stop()
          last.source.disconnect()
          last.filter.disconnect()
          last.gain.disconnect()
        } catch {}
      }, 200)
    } catch {}
  }
}

export function stopReelRumble() {
  reduceReelRumble(0)
  gearVoices = []
  if (rumbleMasterGain) {
    try {
      rumbleMasterGain.disconnect()
    } catch {}
    rumbleMasterGain = null
  }
}

// 逐列停止時的「煞車聲」：短促、下滑音高的喀噠聲，五個豎列停下各觸發一次，
// 一前一後共 5 聲，跟隆隆共鳴聲的逐列減弱一起營造真實的機械停止感。
export function playBrakeClick(hue = 45) {
  const audioCtx = getCtx()
  if (!audioCtx) return
  try {
    const shift = hueShift(hue)
    const now = audioCtx.currentTime
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = "square"
    osc.frequency.setValueAtTime(340 * shift, now)
    osc.frequency.exponentialRampToValueAtTime(90 * shift, now + 0.14)
    gain.gain.setValueAtTime(0.09, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(now)
    osc.stop(now + 0.18)

    const noise = audioCtx.createOscillator()
    const noiseGain = audioCtx.createGain()
    noise.type = "sawtooth"
    noise.frequency.setValueAtTime(120 * shift, now)
    noiseGain.gain.setValueAtTime(0.05, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
    noise.connect(noiseGain)
    noiseGain.connect(audioCtx.destination)
    noise.start(now)
    noise.stop(now + 0.09)
  } catch {
    // best-effort ambience only — never blocks gameplay
  }
}

// 中獎喜悅音效：四個音符往上跳的開心琶音（三角波，比較柔和不刺耳），
// 轉停對獎判定有中獎金額時播放一次，跟恭賀橫幅、動物動三下同一時間出現。
export function playWinSound(hue = 45) {
  const audioCtx = getCtx()
  if (!audioCtx) return
  try {
    const shift = hueShift(hue)
    const now = audioCtx.currentTime
    const notes = [523.3 * shift, 659.3 * shift, 784.0 * shift, 1046.5 * shift]
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.type = "triangle"
      osc.frequency.value = freq
      const start = now + i * 0.09
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.18, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35)
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.start(start)
      osc.stop(start + 0.4)
    })
  } catch {
    // best-effort ambience only — never blocks gameplay
  }
}

// 背景演奏音樂：進入遊戲頁面即可開啟的輕柔五聲音階循環墊底音樂，
// 用低音量的正弦波交錯播放，避免依賴外部音源檔案。
let bgmCtx: AudioContext | null = null
let bgmGain: GainNode | null = null
let bgmTimer: number | null = null
const PENTATONIC = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3]

function getBgmCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  try {
    if (!bgmCtx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return null
      bgmCtx = new Ctor()
    }
    if (bgmCtx.state === "suspended") bgmCtx.resume().catch(() => {})
    return bgmCtx
  } catch {
    return null
  }
}

export function startBgm(hue = 45) {
  stopBgm()
  const audioCtx = getBgmCtx()
  if (!audioCtx) return
  try {
    const shift = hueShift(hue)
    bgmGain = audioCtx.createGain()
    bgmGain.gain.value = 0.05
    bgmGain.connect(audioCtx.destination)

    const playNote = () => {
      if (!bgmGain || !audioCtx) return
      const freq = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)] * shift
      const osc = audioCtx.createOscillator()
      const g = audioCtx.createGain()
      osc.type = "sine"
      osc.frequency.value = freq
      g.gain.value = 0
      osc.connect(g)
      g.connect(bgmGain)
      const now = audioCtx.currentTime
      g.gain.linearRampToValueAtTime(0.9, now + 0.4)
      g.gain.linearRampToValueAtTime(0, now + 1.8)
      osc.start(now)
      osc.stop(now + 1.9)
    }
    playNote()
    bgmTimer = window.setInterval(playNote, 1400)
  } catch {
    // ambience only
  }
}

export function stopBgm() {
  if (bgmTimer !== null) {
    window.clearInterval(bgmTimer)
    bgmTimer = null
  }
  if (bgmGain) {
    try {
      bgmGain.disconnect()
    } catch {}
    bgmGain = null
  }
}
