import Link from 'next/link'
import { SKILLS } from '@/data/skills'
import DotIcon from '@/components/dots/DotIcon'
import { skillGlyph } from '@/components/dots/maps'

export default function Skills({ title = 'Cómo puedo ayudarte', withItems = false }: { title?: string; withItems?: boolean }) {
  return (
    <section id="capacidades" className="marco seccion">
      <div className="seccion-cabeza"><h2>{title}</h2></div>
      <div className="capacidades">
        {SKILLS.map(skill => (
          <Link key={skill.slug} href={`/skills/${skill.slug}`} className="lamina capacidad">
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
