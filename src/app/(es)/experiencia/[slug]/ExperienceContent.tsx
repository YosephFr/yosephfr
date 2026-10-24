import { EXPERIENCE, getExperienceBySlug } from '@/data/experience'
import BackButton from '@/components/BackButton'
import Footer from '@/components/Footer'
import { DetailHeader, NextCards } from '@/components/DetailParts'
import { workGlyph } from '@/components/dots/maps'

export default function ExperienceContent({ slug }: { slug: string }) {
  const role = getExperienceBySlug(slug)!
  const others = EXPERIENCE.filter(e => e.slug !== slug)
  return (
    <>
      <main id="contenido" className="acento-naranja">
        <div className="marco"><BackButton href="/#trabajo" /></div>
        <DetailHeader
          title={role.title}
          lead={role.shortDescription}
          glyph={workGlyph(slug)}
          facts={[
            { label: 'Período', value: role.period },
            { label: 'Ámbito', value: role.company },
            { label: 'Base', value: 'Buenos Aires' },
          ]}
        />
        <section className="marco seccion detalle-cuerpo">
          <div className="cuerpo-texto">
            <p>{role.fullDescription}</p>
            <h2>Trabajo realizado</h2>
            <ul className="lista-puntos">{role.achievements.map(a => <li key={a}>{a}</li>)}</ul>
          </div>
          <aside className="detalle-lateral" aria-label="Tecnologías">
            <h2>Tecnologías</h2>
            <ul className="tecnologias">{role.tags.map(t => <li key={t}>{t}</li>)}</ul>
          </aside>
        </section>
        <NextCards
          title="Sigue explorando"
          items={[
            ...others.map(e => ({ href: `/experiencia/${e.slug}`, meta: e.period, title: e.title })),
            { href: '/cv', meta: 'Experiencia y formación', title: 'CV completo' },
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
