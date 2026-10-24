import Link from 'next/link'
import { SKILLS } from '@/data/skills'
import DotIcon from '@/components/dots/DotIcon'
import { skillGlyph } from '@/components/dots/maps'
import { SKILLS_EN, UI, type Lang } from '@/lib/lang'

export default function Skills({ title, withItems = false, lang = 'es' }: { title?: string; withItems?: boolean; lang?: Lang }) {
  const skills = SKILLS.map(skill => (lang === 'en' ? { ...skill, ...SKILLS_EN[skill.slug] } : skill))
  return (
    <section id="capacidades" className="marco seccion acento-morado">
      <div className="seccion-cabeza"><h2>{title ?? UI[lang].skills.heading}</h2></div>
      <div className="capacidades">
        {skills.map(skill => (
          <Link key={skill.slug} href={`/skills/${skill.slug}`} className="lamina capacidad" hrefLang={lang === 'en' ? 'es' : undefined}>
            <DotIcon name={skillGlyph(skill.slug)} size={32} />
            <h3>{skill.name}</h3>
            <p>{withItems ? skill.items.map(i => i.name).join(' · ') : skill.description}</p>
            <span className="flecha-pie"><DotIcon name="flecha" size={13} /></span>
          </Link>
        ))}
      </div>
    </section>
  )
}
