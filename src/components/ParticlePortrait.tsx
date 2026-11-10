'use client'

import { useEffect, useRef } from 'react'

// El personaje de Franco armado con partículas, como en sus videos: llegan dispersas, se ordenan
// en su cara con su color real (más luz, punto más grande) y se apartan del dedo o del cursor. Sin movimiento si la persona lo pidió así.
// La imagen real queda debajo para quien no tiene JavaScript y para los buscadores.

type Props = { src: string; alt: string; width: number; height: number; className?: string }

const CELDA = 6 // px CSS entre partículas
const NIVELES = 6 // tamaños de punto, del más chico al más grande
const DIAMETRO = 5 // px CSS del punto más grande

export default function ParticlePortrait({ src, alt, width, height, className }: Props) {
  const caja = useRef<HTMLDivElement>(null)
  const lienzo = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const root = caja.current
    const canvas = lienzo.current
    if (!root || !canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let vivo = true
    let iniciado = false
    let w = 0, h = 0, dpr = 1
    let n = 0
    let hx = new Float32Array(0), hy = new Float32Array(0)
    let px = new Float32Array(0), py = new Float32Array(0)
    let vx = new Float32Array(0), vy = new Float32Array(0)
    let color = new Uint32Array(0)
    let nivel = new Uint8Array(0)
    let sellos: Int32Array[] = []
    let img: ImageData | null = null
    let buf: Uint32Array | null = null
    let t0 = 0
    let quieto = 0
    const dedo = { x: -9999, y: -9999, activo: false, ultimo: 0 }

    const fuente = new Image()
    fuente.decoding = 'async'
    fuente.src = src

    function armar() {
      const r = root!.getBoundingClientRect()
      w = Math.round(r.width)
      h = Math.round(r.height)
      if (!w || !h) return false
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas!.width = Math.round(w * dpr)
      canvas!.height = Math.round(h * dpr)
      const cols = Math.floor(w / CELDA)
      const filas = Math.floor(h / CELDA)
      const muestra = document.createElement('canvas')
      muestra.width = cols
      muestra.height = filas
      const m = muestra.getContext('2d', { willReadFrequently: true })
      if (!m) return false
      // object-fit: cover sobre la grilla, con el foco en la cara (igual que la imagen de respaldo)
      const escala = Math.max(cols / fuente.naturalWidth, filas / fuente.naturalHeight)
      const dw = fuente.naturalWidth * escala
      const dh = fuente.naturalHeight * escala
      m.drawImage(fuente, (cols - dw) / 2, (filas - dh) * 0.28, dw, dh)
      const datos = m.getImageData(0, 0, cols, filas).data
      const prev = { px, py }
      const ox = (w - cols * CELDA) / 2 + CELDA / 2
      const oy = (h - filas * CELDA) / 2 + CELDA / 2
      // Primero se cuentan los puntos que tienen luz suficiente: el fondo oscuro queda vacío.
      const luz = new Float32Array(cols * filas)
      let cuantos = 0
      for (let i = 0; i < cols * filas; i++) {
        const k = i * 4
        const l = (0.2126 * datos[k] + 0.7152 * datos[k + 1] + 0.0722 * datos[k + 2]) / 255
        const v = Math.min(1, Math.max(0, (l - 0.07) / 0.6))
        luz[i] = v
        if (v > 0.06) cuantos++
      }
      n = cuantos
      hx = new Float32Array(n); hy = new Float32Array(n)
      px = new Float32Array(n); py = new Float32Array(n)
      vx = new Float32Array(n); vy = new Float32Array(n)
      color = new Uint32Array(n)
      nivel = new Uint8Array(n)
      let j = 0
      for (let f = 0; f < filas; f++) {
        for (let c = 0; c < cols; c++) {
          const v = luz[f * cols + c]
          if (v <= 0.06) continue
          // Su color real, un poco más luminoso para que el punto se lea sobre el negro
          const k = (f * cols + c) * 4
          const r = Math.min(255, Math.round(datos[k] * 1.18 + 10))
          const g = Math.min(255, Math.round(datos[k + 1] * 1.18 + 10))
          const b = Math.min(255, Math.round(datos[k + 2] * 1.18 + 10))
          color[j] = (255 << 24) | (b << 16) | (g << 8) | r
          nivel[j] = Math.min(NIVELES - 1, Math.floor((0.25 + 0.75 * Math.sqrt(v)) * NIVELES))
          hx[j] = ox + c * CELDA
          hy[j] = oy + f * CELDA
          if (!iniciado || j >= prev.px.length) {
            // Nube amplia alrededor del centro
            const a = Math.random() * Math.PI * 2
            const d = (0.35 + Math.random() * 0.9) * Math.max(w, h)
            px[j] = w / 2 + Math.cos(a) * d * 0.6
            py[j] = h / 2 + Math.sin(a) * d * 0.6
            vx[j] = (Math.random() - 0.5) * 6
            vy[j] = (Math.random() - 0.5) * 6
          } else {
            px[j] = hx[j]; py[j] = hy[j]
          }
          j++
        }
      }
      // Un sello de píxeles por tamaño de punto, a la densidad de la pantalla
      sellos = []
      for (let lv = 0; lv < NIVELES; lv++) {
        const rad = ((lv + 1) / NIVELES) * (DIAMETRO / 2) * dpr
        const lim = Math.ceil(rad)
        const pares: number[] = []
        for (let y = -lim; y <= lim; y++) for (let x = -lim; x <= lim; x++) if (x * x + y * y <= rad * rad + 0.25) pares.push(x, y)
        sellos.push(Int32Array.from(pares.length ? pares : [0, 0]))
      }
      img = ctx!.createImageData(canvas!.width, canvas!.height)
      buf = new Uint32Array(img.data.buffer)
      return true
    }

    function dibujar() {
      if (!img || !buf) return
      buf.fill(0)
      const W = canvas!.width, H = canvas!.height
      for (let i = 0; i < n; i++) {
        const cx = Math.round(px[i] * dpr)
        const cy = Math.round(py[i] * dpr)
        if (cx < -8 || cy < -8 || cx >= W + 8 || cy >= H + 8) continue
        const sello = sellos[nivel[i]]
        const c = color[i]
        for (let k = 0; k < sello.length; k += 2) {
          const x = cx + sello[k], y = cy + sello[k + 1]
          if (x >= 0 && y >= 0 && x < W && y < H) buf[y * W + x] = c
        }
      }
      ctx!.putImageData(img, 0, 0)
    }

    function paso(ahora: number) {
      if (!vivo) return
      const t = ahora - t0
      // El resorte se endurece al principio: primero remolino, después orden.
      const k = 0.012 + 0.07 * Math.min(1, t / 1400)
      const amort = 0.84
      const R = 70
      let energia = 0
      const cerca = dedo.activo && ahora - dedo.ultimo < 1200
      for (let i = 0; i < n; i++) {
        let ax = (hx[i] - px[i]) * k
        let ay = (hy[i] - py[i]) * k
        if (cerca) {
          const dx = px[i] - dedo.x
          const dy = py[i] - dedo.y
          const d2 = dx * dx + dy * dy
          if (d2 < R * R && d2 > 0.01) {
            const d = Math.sqrt(d2)
            const fuerza = (1 - d / R) * 3.2
            ax += (dx / d) * fuerza
            ay += (dy / d) * fuerza
          }
        }
        vx[i] = (vx[i] + ax) * amort
        vy[i] = (vy[i] + ay) * amort
        px[i] += vx[i]
        py[i] += vy[i]
        energia += vx[i] * vx[i] + vy[i] * vy[i]
      }
      dibujar()
      if (energia / Math.max(1, n) < 0.0004 && !cerca && t > 1500) {
        quieto++
      } else quieto = 0
      if (quieto > 20) {
        // Exacto en su lugar y a descansar: no gasta batería mientras nadie lo toca.
        for (let i = 0; i < n; i++) { px[i] = hx[i]; py[i] = hy[i]; vx[i] = 0; vy[i] = 0 }
        dibujar()
        raf = 0
        return
      }
      raf = requestAnimationFrame(paso)
    }

    function despertar() {
      if (!raf && iniciado) {
        quieto = 0
        raf = requestAnimationFrame(paso)
      }
    }

    function iniciar() {
      if (iniciado || !fuente.complete || !fuente.naturalWidth) return
      if (!armar()) return
      iniciado = true
      root!.dataset.vivo = '1'
      t0 = performance.now()
      raf = requestAnimationFrame(paso)
    }

    function mover(e: PointerEvent) {
      const r = canvas!.getBoundingClientRect()
      dedo.x = e.clientX - r.left
      dedo.y = e.clientY - r.top
      dedo.activo = true
      dedo.ultimo = performance.now()
      despertar()
    }
    function salir() { dedo.activo = false; dedo.x = dedo.y = -9999 }

    const visto = new IntersectionObserver(entradas => {
      if (entradas.some(e => e.isIntersecting)) {
        if (fuente.complete) iniciar()
        else fuente.onload = iniciar
      }
    }, { threshold: 0.25 })
    visto.observe(root)

    let medida = 0
    const tam = new ResizeObserver(() => {
      if (!iniciado) return
      cancelAnimationFrame(medida)
      medida = requestAnimationFrame(() => { if (armar()) { dibujar(); despertar() } })
    })
    tam.observe(root)

    canvas.addEventListener('pointermove', mover)
    canvas.addEventListener('pointerdown', mover)
    canvas.addEventListener('pointerleave', salir)
    canvas.addEventListener('pointercancel', salir)

    return () => {
      vivo = false
      cancelAnimationFrame(raf)
      visto.disconnect()
      tam.disconnect()
      canvas.removeEventListener('pointermove', mover)
      canvas.removeEventListener('pointerdown', mover)
      canvas.removeEventListener('pointerleave', salir)
      canvas.removeEventListener('pointercancel', salir)
    }
  }, [src])

  return (
    <div ref={caja} className={`retrato ${className ?? ''}`}>
      <img src={src} alt={alt} width={width} height={height} className="retrato-img" fetchPriority="high" />
      <canvas ref={lienzo} className="retrato-lienzo" aria-hidden="true" />
    </div>
  )
}
