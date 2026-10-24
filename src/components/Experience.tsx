import Link from 'next/link'
import { EXPERIENCE } from '@/data/experience'
import DotIcon from '@/components/dots/DotIcon'
import { workGlyph } from '@/components/dots/maps'

export default function Experience() {
  return (
    <section id="trabajo" className="marco seccion acento-naranja">
      <div className="seccion-cabeza">
        <h2>Del producto a la operación</h2>
        <Link href="/cv" className="enlace">Ver CV <DotIcon name="flecha" size={13} /></Link>
      </div>
      <div className="trabajos">
        {EXPERIENCE.map(job => (
          <Link key={job.slug} href={`/experiencia/${job.slug}`} className="lamina trabajo">
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
