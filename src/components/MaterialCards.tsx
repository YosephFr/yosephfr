import Link from 'next/link'
import type { Material } from '@/data/material'

const fecha = (d: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(d)).replace('.', '')

// Una tarjeta por pieza: la portada, el título como se dijo en el video y dónde salió.
export default function MaterialCards({ items, level = 'h3' }: { items: Material[]; level?: 'h2' | 'h3' }) {
  const H = level
  return (
    <ul className="material-lista">
      {items.map((m, i) => (
        <li key={m.slug}>
          <Link href={`/material/${m.slug}`} className="lamina material-tarjeta" data-event="material_open" data-slug={m.slug}>
            <span className="material-portada">
              <img src={m.cover.src} width={m.cover.width} height={m.cover.height} alt="" loading={i < 2 ? 'eager' : 'lazy'} />
            </span>
            <span className="material-texto">
              <span className="meta">{m.where} · {fecha(m.date)}</span>
              <H>{m.title}</H>
              <span className="material-resumen">{m.summary}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
