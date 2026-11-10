import type { CSSProperties } from 'react'
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Bot, Check, Clock, Cloud, Copy, Download, FileText, House,
  Mail, Newspaper, PanelsTopLeft, Plug, Rss, Search, X, type LucideIcon,
} from 'lucide-react'
import { GLYPHS, glyphCells, type GlyphName } from './glyphs'

type Props = { name?: GlyphName; rows?: readonly string[]; size?: number; className?: string; label?: string }

// Íconos de Lucide, la librería de sus productos. Solo la marca sigue hecha de puntos.
const LUCIDE: Partial<Record<GlyphName, LucideIcon>> = {
  inicio: House, articulos: Newspaper, cv: FileText, contacto: Mail, agentes: Bot, apis: Plug, interfaces: PanelsTopLeft,
  nube: Cloud, flecha: ArrowRight, volver: ArrowLeft, salida: ArrowUpRight, abajo: ArrowDown, copiar: Copy, listo: Check,
  correo: Mail, rss: Rss, reloj: Clock, descargar: Download, buscar: Search, cerrar: X,
}

export default function DotIcon({ name = 'flecha', rows, size = 20, className = '', label }: Props) {
  const Icono = rows ? undefined : LUCIDE[name]
  if (Icono) {
    return <Icono className={`punto-icono ${className}`} size={Math.max(14, size)} strokeWidth={2} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} focusable="false" />
  }
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
