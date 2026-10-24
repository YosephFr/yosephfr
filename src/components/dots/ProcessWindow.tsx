'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react'
import { seeded } from './glyphs'
import { UI, type Lang } from '@/lib/lang'

type Cell = [number, number]
const COLS = 16
const ROWS = 10
const DURATION = [2600, 2600, 3600]

function distance(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const vx = bx - ax, vy = by - ay
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy)))
  return Math.hypot(ax + t * vx - px, ay + t * vy - py)
}

const byColumn = (a: Cell, b: Cell) => a[0] - b[0] || a[1] - b[1]

function buildShapes() {
  const check: Cell[] = []
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const d = Math.min(distance(x + 0.5, y + 0.5, 3.2, 5.2, 6.4, 8.4), distance(x + 0.5, y + 0.5, 6.4, 8.4, 13.2, 1.6))
    if (d <= 0.75) check.push([x, y])
  }
  const connect: Cell[] = []
  for (const left of [2, 7, 12]) for (const x of [left, left + 1]) for (const y of [3, 4, 5]) connect.push([x, y])
  for (const x of [4, 5, 6, 9, 10, 11]) connect.push([x, 4])
  const count = connect.length
  while (check.length < count) check.push(check[check.length - 1])
  const all: Cell[] = []
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) all.push([x, y])
  const rand = seeded('arncof-entender')
  for (let i = all.length - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [all[i], all[j]] = [all[j], all[i]] }
  const scatter = all.slice(0, count)
  return [scatter.sort(byColumn), connect.sort(byColumn), check.sort(byColumn)]
}

const SHAPES = buildShapes()
const MOTION = '(prefers-reduced-motion: reduce)'
function subscribeMotion(change: () => void) {
  const query = window.matchMedia(MOTION)
  query.addEventListener('change', change)
  return () => query.removeEventListener('change', change)
}
const CHECK_SIZE = new Set(SHAPES[2].map(c => c.join(','))).size

export default function ProcessWindow({ caption, lang = 'es' }: { caption?: string; lang?: Lang }) {
  const { label, steps } = UI[lang].process
  const [chosen, setPhase] = useState(0)
  const [running, setRunning] = useState(false)
  // Con movimiento reducido se muestra directamente el resultado comprobado.
  const still = useSyncExternalStore(subscribeMotion, () => window.matchMedia(MOTION).matches, () => false)
  const phase = still ? 2 : chosen
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (still) return
    const node = root.current
    if (!node) return
    let inView = false
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; setRunning(inView && !document.hidden) }, { threshold: 0.25 })
    observer.observe(node)
    const onVisibility = () => setRunning(inView && !document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [still])

  useEffect(() => {
    if (!running || still) return
    const timer = window.setTimeout(() => setPhase(p => (p + 1) % 3), DURATION[phase])
    return () => window.clearTimeout(timer)
  }, [phase, running, still])

  const choose = useCallback((index: number) => { setPhase(index) }, [])

  return (
    <div ref={root} className={`ventana proceso fase-${phase}${still ? ' quieto' : ''}${running ? ' en-marcha' : ''}`}>
      <div className="ventana-medio proceso-medio">
        {caption && <p className="ventana-leyenda">{caption}</p>}
        <svg viewBox={`0 0 ${COLS} ${ROWS}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          <g className="campo-reticula">
            {Array.from({ length: COLS * ROWS }, (_, i) => <circle key={i} cx={(i % COLS) + 0.5} cy={Math.floor(i / COLS) + 0.5} r={0.46} />)}
          </g>
          <g className="proceso-particulas">
            {SHAPES[phase].map(([x, y], i) => (
              <circle
                key={i}
                r={0.44}
                className={i >= CHECK_SIZE && phase === 2 ? 'oculta' : undefined}
                style={{ transform: `translate(${x + 0.5}px, ${y + 0.5}px)`, '--i': i } as CSSProperties}
              />
            ))}
          </g>
        </svg>
      </div>
      <div className="ventana-banda proceso-banda" role="group" aria-label={label}>
        {steps.map((step, i) => (
          <button
            key={step.title}
            type="button"
            className={`proceso-paso${i === phase ? ' activo' : ''}${i < phase ? ' hecho' : ''}`}
            aria-pressed={i === phase}
            onClick={() => choose(i)}
          >
            <span className="proceso-barra" aria-hidden="true">
              <span key={`${phase}-${i}`} style={{ '--dura': `${DURATION[i]}ms` } as CSSProperties} />
            </span>
            <span className="dato-titulo">{step.title}</span>
            <span className="dato-texto">{step.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
