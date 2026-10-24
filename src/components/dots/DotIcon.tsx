import type { CSSProperties } from 'react'
import { GLYPHS, glyphCells, type GlyphName } from './glyphs'

type Props = { name?: GlyphName; rows?: readonly string[]; size?: number; className?: string; label?: string }

export default function DotIcon({ name = 'flecha', rows, size = 20, className = '', label }: Props) {
  const { cells, width, height } = glyphCells(rows ?? GLYPHS[name])
  const scale = size / Math.max(width, height)
  return (
    <svg
      className={`punto-icono ${className}`}
      width={width * scale}
      height={height * scale}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      {cells.map(([x, y], i) => (
        <circle key={i} cx={x + 0.5} cy={y + 0.5} r={0.36} style={{ '--i': i } as CSSProperties} />
      ))}
    </svg>
  )
}
