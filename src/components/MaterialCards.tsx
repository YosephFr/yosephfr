import Link from 'next/link'
import type { Material } from '@/data/material'

const fecha = (d: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(d)).replace('.', '')

// Una tarjeta por pieza con la portada que se vio en la red: quien llega del video lo reconoce por la imagen.
export default function MaterialCards({ items, level = 'h3', className = '' }: { items: Material[]; level?: 'h2' | 'h3'; className?: string }) {
  const H = level
  return (
    <ul className={`estante ${className}`}>
      {items.map((m, i) => (
        <li key={m.slug} style={{ ['--i' as string]: i }}>
          <Link href={`/material/${m.slug}`} className="pieza" data-event="material_open" data-slug={m.slug}>
            <span className="pieza-portada">
              <img src={m.poster.src} width={m.poster.width} height={m.poster.height} alt="" loading={i < 4 ? 'eager' : 'lazy'} style={m.poster.focus ? { objectPosition: m.poster.focus } : undefined} />
            </span>
            <span className="pieza-texto">
              <span className="meta">{m.where} · {fecha(m.date)}</span>
              <H>{m.title}</H>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
