import { getAccent, getAccentHover, getTextPrimary, getTextMuted, getSurface } from "@/easter-eggs/themeColors"

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "")
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  }
}

function withAlpha(hex: string, alpha: number): string {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function confetti(duration = 3000) {
  const canvas = document.createElement("canvas")
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999"
  document.body.appendChild(canvas)
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const accent = getAccent()
  const accentHover = getAccentHover()
  const textPrimary = getTextPrimary()
  const textMuted = getTextMuted()
  const textSecondary = withAlpha(textMuted, 0.75)

  const colors = [accent, accentHover, textPrimary, textMuted, textSecondary]
  const particles: {
    x: number
    y: number
    vx: number
    vy: number
    size: number
    color: string
    rotation: number
    rotationSpeed: number
  }[] = []

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height * -1,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    })
  }

  const start = Date.now()

  function animate() {
    if (!ctx) return
    const elapsed = Date.now() - start
    if (elapsed > duration) {
      canvas.remove()
      return
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const opacity = elapsed > duration - 500 ? (duration - elapsed) / 500 : 1
    ctx.globalAlpha = opacity

    particles.forEach((p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.fillStyle = p.color
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size)
      ctx.restore()

      p.x += p.vx
      p.y += p.vy
      p.vy += 0.05
      p.rotation += p.rotationSpeed
    })

    requestAnimationFrame(animate)
  }

  animate()
}

export function matrixRain(duration = 4000) {
  const canvas = document.createElement("canvas")
  canvas.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;opacity:0.3"
  document.body.appendChild(canvas)
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const columns = Math.floor(canvas.width / 14)
  const drops: number[] = Array.from({ length: columns }, () =>
    Math.random() * -100
  )
  const chars = "01アイウエオカキクケコサシスセソ"

  const surfaceFade = withAlpha(getSurface(), 0.05)
  const rainColor = getAccent()

  const start = Date.now()

  function animate() {
    if (!ctx) return
    if (Date.now() - start > duration) {
      canvas.remove()
      return
    }

    ctx.fillStyle = surfaceFade
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = rainColor
    ctx.font = "14px monospace"

    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(char, i * 14, y)
      drops[i] = y > canvas.height && Math.random() > 0.975 ? 0 : y + 14
    })

    requestAnimationFrame(animate)
  }

  animate()
}

export function screenFlip(duration = 2000) {
  document.body.style.transition = "transform 0.5s ease"
  document.body.style.transform = "scaleY(-1)"
  setTimeout(() => {
    document.body.style.transform = "scaleY(1)"
    setTimeout(() => {
      document.body.style.transition = ""
      document.body.style.transform = ""
    }, 500)
  }, duration)
}

export function discoMode(duration = 5000) {
  const overlay = document.createElement("div")
  overlay.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;mix-blend-mode:overlay;opacity:0.15"
  document.body.appendChild(overlay)

  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff"]
  let colorIndex = 0

  const interval = setInterval(() => {
    overlay.style.backgroundColor = colors[colorIndex % colors.length]
    colorIndex++
  }, 200)

  setTimeout(() => {
    clearInterval(interval)
    overlay.remove()
  }, duration)
}

export function tealPulse() {
  const accentRgba = withAlpha(getAccent(), 0.2)
  const overlay = document.createElement("div")
  overlay.style.cssText =
    `position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9998;background:radial-gradient(circle,${accentRgba} 0%,transparent 70%);opacity:0`
  document.body.appendChild(overlay)

  overlay.animate(
    [
      { opacity: 0 },
      { opacity: 1 },
      { opacity: 0 },
    ],
    { duration: 1500, easing: "ease-in-out" }
  ).onfinish = () => overlay.remove()
}
