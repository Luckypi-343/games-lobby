"use client"

// Lightweight synthesized sound effects + background music for the puzzle-zone board games.
// No external audio files are used — everything is generated on the fly with the Web Audio API,
// so it works instantly regardless of network conditions.

let ctx: AudioContext | null = null
let bgmTimer: ReturnType<typeof setInterval> | null = null
let bgmGain: GainNode | null = null
let bgmRunning = false

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {})
  return ctx
}

function tone(freq: number, start: number, dur: number, gainVal: number, type: OscillatorType = "sine") {
  const c = getCtx()
  if (!c) return
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, c.currentTime + start)
  gain.gain.linearRampToValueAtTime(gainVal, c.currentTime + start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + start + dur)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(c.currentTime + start)
  osc.stop(c.currentTime + start + dur + 0.02)
}

/** A soft "tick" for placing/moving a piece. */
export function playMoveSound() {
  tone(520, 0, 0.09, 0.06, "triangle")
  tone(760, 0.02, 0.07, 0.04, "sine")
}

/** A slightly sharper "clack" for capturing/eating an opponent piece. */
export function playCaptureSound() {
  tone(300, 0, 0.05, 0.08, "square")
  tone(180, 0.03, 0.12, 0.07, "sawtooth")
}

/** A short rising chime for a good/special event (e.g. flipping a tile, forming a set). */
export function playSpecialSound() {
  tone(660, 0, 0.08, 0.06, "sine")
  tone(880, 0.08, 0.1, 0.06, "sine")
  tone(1040, 0.16, 0.14, 0.05, "sine")
}

/** Cheerful ascending fanfare for a win. */
export function playWinSound() {
  const notes = [523, 659, 784, 1047]
  notes.forEach((f, i) => tone(f, i * 0.09, 0.22, 0.07, "sine"))
}

/** Gentle descending tone for a loss — not harsh, just a soft nudge. */
export function playLossSound() {
  const notes = [440, 370, 311]
  notes.forEach((f, i) => tone(f, i * 0.1, 0.28, 0.06, "triangle"))
}

/** Neutral two-tone chime for a draw. */
export function playDrawSound() {
  tone(500, 0, 0.16, 0.06, "sine")
  tone(500, 0.18, 0.16, 0.06, "sine")
}

const BGM_SCALE = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3]
let bgmStep = 0

/** Starts a soft, looping ambient melody. Safe to call repeatedly (no-op if already running). */
export function startBgm() {
  if (bgmRunning || typeof window === "undefined") return
  const c = getCtx()
  if (!c) return
  bgmRunning = true
  bgmGain = c.createGain()
  bgmGain.gain.value = 0.035
  bgmGain.connect(c.destination)
  bgmStep = 0
  const playStep = () => {
    if (!bgmRunning || !c || !bgmGain) return
    const freq = BGM_SCALE[bgmStep % BGM_SCALE.length]
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = "sine"
    osc.frequency.value = freq
    g.gain.setValueAtTime(0, c.currentTime)
    g.gain.linearRampToValueAtTime(1, c.currentTime + 0.3)
    g.gain.linearRampToValueAtTime(0, c.currentTime + 1.6)
    osc.connect(g)
    g.connect(bgmGain)
    osc.start()
    osc.stop(c.currentTime + 1.7)
    bgmStep += 1
  }
  playStep()
  bgmTimer = setInterval(playStep, 1900)
}

export function stopBgm() {
  bgmRunning = false
  if (bgmTimer) {
    clearInterval(bgmTimer)
    bgmTimer = null
  }
  bgmGain = null
}

// 依機台主題色相把音高整體升降一點，讓同一套機制的不同機台（例如傳統麻台系列）
// 聽起來有些微差異，不是完全一樣的罐頭音效；色相只是穩定的「種子」，沒有真的色彩對應。
function hueShift(hue = 45) {
  const h = ((hue % 360) + 360) % 360
  return 0.72 + (h / 360) * 0.85
}

/** A short, light "tick" for the little-mary chase-light pointer moving one step. */
export function playTickSound(hue = 45) {
  const s = hueShift(hue)
  tone(900 * s, 0, 0.035, 0.035, "square")
}

/** A generic soft click for pressing a UI button. */
export function playButtonSound() {
  tone(680, 0, 0.05, 0.05, "sine")
}

/** An excited jingling bell run for a Jackpot (JP) hit — distinct from the normal win fanfare. */
export function playJpBellSound(hue = 45) {
  const s = hueShift(hue)
  const notes = [988, 1175, 1319, 1568, 1319, 1568, 1760].map((f) => f * s)
  notes.forEach((f, i) => tone(f, i * 0.07, 0.16, 0.06, "triangle"))
}

/** A single short urgent "alarm" blip, meant to be called repeatedly while a jackpot feature is armed/pre-announcing. */
export function playAlarmBlip(hue = 45) {
  const s = hueShift(hue)
  tone(1400 * s, 0, 0.06, 0.045, "square")
  tone(1050 * s, 0.07, 0.06, 0.04, "square")
}

// 以下三種「持續音效」是給傳統麻台系列在「確定本轉必中大獎」的那一轉，
// 從啟動的瞬間一路響到轉盤停下公布結果為止，中途不中斷。
// 呼叫 start 不會重複疊加（已在播放中會直接略過），務必在轉停或畫面卸載時呼叫對應的 stop。

let christmasBellTimer: ReturnType<typeof setInterval> | null = null
/** 持續的聖誕鐘聲 — 給 41、42 台 JP 預告使用。 */
export function startChristmasBellLoop(hue = 45) {
  if (christmasBellTimer || typeof window === "undefined") return
  const s = hueShift(hue)
  const ring = () => {
    tone(1319 * s, 0, 0.11, 0.05, "triangle")
    tone(988 * s, 0.1, 0.11, 0.04, "triangle")
  }
  ring()
  christmasBellTimer = setInterval(ring, 230)
}
export function stopChristmasBellLoop() {
  if (christmasBellTimer) {
    clearInterval(christmasBellTimer)
    christmasBellTimer = null
  }
}

let birdCallTimer: ReturnType<typeof setInterval> | null = null
/** 持續的鳥叫聲 — 給 43、44 台🌺預告使用。 */
export function startBirdCallLoop(hue = 45) {
  if (birdCallTimer || typeof window === "undefined") return
  const s = hueShift(hue)
  const chirp = () => {
    tone(2200 * s, 0, 0.05, 0.045, "sine")
    tone(2700 * s, 0.05, 0.05, 0.035, "sine")
  }
  chirp()
  birdCallTimer = setInterval(chirp, 270)
}
export function stopBirdCallLoop() {
  if (birdCallTimer) {
    clearInterval(birdCallTimer)
    birdCallTimer = null
  }
}

let eagleCryTimer: ReturnType<typeof setInterval> | null = null
/** 持續的鷹叫聲 — 給 45、46 台🐦‍🔥預告使用。 */
export function startEagleCryLoop(hue = 45) {
  if (eagleCryTimer || typeof window === "undefined") return
  const s = hueShift(hue)
  const cry = () => {
    tone(980 * s, 0, 0.24, 0.05, "sawtooth")
    tone(680 * s, 0.2, 0.2, 0.04, "sawtooth")
  }
  cry()
  eagleCryTimer = setInterval(cry, 430)
}
export function stopEagleCryLoop() {
  if (eagleCryTimer) {
    clearInterval(eagleCryTimer)
    eagleCryTimer = null
  }
}
