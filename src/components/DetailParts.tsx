import Link from 'next/link'
import DotField, { glyphAt } from '@/components/dots/DotField'
import DotIcon from '@/components/dots/DotIcon'
import type { GlyphName } from '@/components/dots/glyphs'

type Fact = { label: string; value: string }

export function DetailHeader({ title, lead, glyph, facts }: { title: string; lead: string; glyph: GlyphName; facts: Fact[] }) {
  return (
    <header className="marco pagina-cabeza cabeza-doble">
      <div>
        <h1 className="titulo detalle-titulo">{title}</h1>
        <p className="entrada-texto">{lead}</p>
      </div>
      <div className="ventana detalle-ventana">
        <div className="ventana-medio"><DotField cols={16} rows={11} cells={glyphAt(glyph, 8, 1)} /></div>
        <dl className="ventana-banda">
          {facts.map(f => (
            <div key={f.label}>
              <dt className="dato-texto">{f.label}</dt>
              <dd className="dato-titulo">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </header>
  )
}

export function NextCards({ title, items }: { title: string; items: { href: string; meta: string; title: string }[] }) {
  return (
    <section className="marco seccion">
      <div className="seccion-cabeza"><h2>{title}</h2></div>
      <div className="siguientes">
        {items.map(item => (
          <Link key={item.href} href={item.href} className="lamina siguiente">
            <h3>{item.title}</h3>
            <span className="meta">{item.meta}</span>
            <DotIcon name="flecha" size={14} />
          </Link>
        ))}
      </div>
    </section>
  )
}
