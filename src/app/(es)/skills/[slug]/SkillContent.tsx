import { SKILLS, getSkillBySlug } from '@/data/skills'
import BackButton from '@/components/BackButton'
import Footer from '@/components/Footer'
import { DetailHeader, NextCards } from '@/components/DetailParts'
import { skillGlyph } from '@/components/dots/maps'

export default function SkillContent({ slug }: { slug: string }) {
  const skill = getSkillBySlug(slug)!
  const index = SKILLS.findIndex(s => s.slug === slug)
  const next = [1, 2].map(step => SKILLS[(index + step) % SKILLS.length])
  return (
    <>
      <main id="contenido" className="acento-naranja">
        <div className="marco"><BackButton href="/#capacidades" /></div>
        <DetailHeader
          title={skill.name}
          lead={skill.description}
          glyph={skillGlyph(slug)}
          facts={[
            { label: 'Capacidades', value: String(skill.items.length) },
            { label: 'Herramientas', value: String(skill.tools.length) },
          ]}
        />
        <section className="marco seccion detalle-cuerpo">
          <div className="cuerpo-texto">
            <p>{skill.fullDescription}</p>
            <h2>Capacidades</h2>
            <ul className="tecnologias">{skill.items.map(i => <li key={i.name}>{i.name}</li>)}</ul>
          </div>
          <aside className="detalle-lateral" aria-label="Herramientas">
            <h2>Herramientas</h2>
            <ul className="tecnologias">{skill.tools.map(t => <li key={t}>{t}</li>)}</ul>
          </aside>
        </section>
        <NextCards title="Otras capacidades" items={next.map(s => ({ href: `/skills/${s.slug}`, meta: 'Capacidad', title: s.name }))} />
      </main>
      <Footer />
    </>
  )
}
