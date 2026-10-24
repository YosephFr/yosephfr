import type { CSSProperties } from 'react'
import { DIGITS, GLYPHS, glyphCells, seeded, type GlyphName } from './glyphs'

export type Cell = [number, number]

type Props = {
  cols: number
  rows: number
  cells: Cell[]
  className?: string
  align?: string
  dim?: Cell[]
  label?: string
}

// Retícula de círculos en contorno con partículas llenas que ocupan sus celdas.
export default function DotField({ cols, rows, cells, className = '', align = 'xMidYMid slice', dim = [], label }: Props) {
  const lattice: Cell[] = []
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) lattice.push([x, y])
  return (
    <svg
      className={`campo ${className}`}
      viewBox={`0 0 ${cols} ${rows}`}
      preserveAspectRatio={align}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <g className="campo-reticula">
        {lattice.map(([x, y]) => <circle key={`${x}-${y}`} cx={x + 0.5} cy={y + 0.5} r={0.46} />)}
      </g>
      {dim.length > 0 && (
        <g className="campo-tenue">
          {dim.map(([x, y], i) => <circle key={i} cx={x + 0.5} cy={y + 0.5} r={0.44} />)}
        </g>
      )}
      <g className="campo-particulas">
        {cells.map(([x, y], i) => (
          <circle key={i} cx={x + 0.5} cy={y + 0.5} r={0.46} style={{ '--i': i, '--fila': y } as CSSProperties} />
        ))}
      </g>
    </svg>
  )
}

export function glyphAt(name: GlyphName, ox: number, oy: number): Cell[] {
  return glyphCells(GLYPHS[name]).cells.map(([x, y]) => [x + ox, y + oy])
}

export function digitsAt(text: string, ox: number, oy: number, gap = 1): Cell[] {
  const cells: Cell[] = []
  let cursor = ox
  for (const ch of text) {
    const rows = DIGITS[ch]
    if (!rows) { cursor += 3; continue }
    glyphCells(rows).cells.forEach(([x, y]) => cells.push([x + cursor, y + oy]))
    cursor += rows[0].length + gap
  }
  return cells
}

// Cascada que se acumula hacia un borde, como las partículas de las láminas.
export function cascade(cols: number, rows: number, seed: string, from: 'abajo-derecha' | 'abajo' | 'derecha' = 'abajo-derecha', density = 1): Cell[] {
  const rand = seeded(seed)
  const cells: Cell[] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const fx = x / (cols - 1)
      const fy = y / (rows - 1)
      const weight = from === 'abajo' ? fy : from === 'derecha' ? fx : fx * 0.55 + fy * 0.75
      const p = Math.min(1, Math.max(0, (weight - 0.42) * 2.3 * density))
      if (rand() < p) cells.push([x, y])
    }
  }
  return cells
}
