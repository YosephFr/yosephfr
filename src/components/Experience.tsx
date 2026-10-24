import Link from 'next/link'
import { EXPERIENCE } from '@/data/experience'
import DotIcon from '@/components/dots/DotIcon'
import { workGlyph } from '@/components/dots/maps'
import { EXPERIENCE_EN, UI, type Lang } from '@/lib/lang'

export default function Experience({ lang = 'es' }: { lang?: Lang }) {
  const t = UI[lang].experience
  const roles = EXPERIENCE.map(job => (lang === 'en' ? { ...job, ...EXPERIENCE_EN[job.slug] } : job))
  const hrefLang = lang === 'en' ? 'es' : undefined
  return (
    <section id="trabajo" className="marco seccion acento-naranja">
      <div className="seccion-cabeza">
        <h2>{t.heading}</h2>
        <Link href={UI[lang].cv} className="enlace">{t.cv} <DotIcon name="flecha" size={13} /></Link>
      </div>
      <div className="trabajos">
        {roles.map(job => (
          <Link key={job.slug} href={`/experiencia/${job.slug}`} className="lamina trabajo" hrefLang={hrefLang}>
            <div className="trabajo-arriba">
              <DotIcon name={workGlyph(job.slug)} size={40} />
            </div>
            <h3>{job.title}</h3>
            <p>{job.shortDescription}</p>
            <div className="trabajo-pie">
              <span>{job.company} · {job.period}</span>
              <DotIcon name="flecha" size={13} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
