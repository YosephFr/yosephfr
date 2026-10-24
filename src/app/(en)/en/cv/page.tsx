import type { Metadata } from 'next'
import Link from 'next/link'
import { PROFILE } from '@/data/profile'
import { social } from '@/lib/seo'
import { EXPERIENCE } from '@/data/experience'
import { EXPERIENCE_FULL_EN, PRACTICES_EN } from '@/data/cv-en'
import { EXPERIENCE_EN, alternates } from '@/lib/lang'
import DotIcon from '@/components/dots/DotIcon'
import ContactActions from '@/components/ContactActions'
import PrintButton from '@/components/PrintButton'
import Trajectory from '@/components/Trajectory'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Footer from '@/components/Footer'

const description = 'Experience in AI engineering, software development, automation and infrastructure. Current practices and education.'

export const metadata: Metadata = {
  title: 'Yoseph Franco’s CV',
  description,
  alternates: { canonical: '/en/cv', languages: alternates('/cv', '/en/cv') },
  ...social({ title: 'Yoseph Franco’s CV | Arncof', description: 'Experience in AI engineering, software development, automation and infrastructure.', url: '/en/cv', type: 'profile' }),
}

export default function CVEn() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${PROFILE.url}/en/cv#perfil`,
    url: `${PROFILE.url}/en/cv`,
    name: 'Yoseph Franco’s CV',
    inLanguage: 'en',
    dateModified: PROFILE.updated,
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    mainEntity: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <main id="contenido" className="acento-morado">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <header className="marco pagina-cabeza cabeza-doble">
          <div>
            <h1 className="display">Yoseph Franco</h1>
            <p className="entrada-texto">I design workflows with agents to research, build and review products. I organize the context, the tools and the continuity of the work, and I check the result against real cases.</p>
            <div className="acciones-cv"><ContactActions lang="en" extra={<PrintButton lang="en" />} /></div>
          </div>
          <Trajectory lang="en" />
        </header>

        <section className="marco seccion" aria-labelledby="experiencia">
          <div className="seccion-cabeza"><h2 id="experiencia">Experience</h2></div>
          <div className="roles">
            {EXPERIENCE.map(e => {
              const en = { ...e, ...EXPERIENCE_EN[e.slug], ...EXPERIENCE_FULL_EN[e.slug] }
              return (
                <article key={e.slug} className="lamina rol">
                  <div>
                    <h3>{en.title}</h3>
                    <p className="meta">{en.company} · {en.period}</p>
                    <Link href={`/experiencia/${e.slug}`} hrefLang="es" className="enlace no-imprimir">Details (in Spanish) <DotIcon name="flecha" size={13} /></Link>
                  </div>
                  <div className="rol-cuerpo">
                    <p>{en.fullDescription}</p>
                    <ul className="lista-puntos">{en.achievements.map(a => <li key={a}>{a}</li>)}</ul>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        <section className="marco seccion" aria-labelledby="practicas">
          <div className="seccion-cabeza"><h2 id="practicas">Current practices</h2></div>
          <div className="practicas">
            {PRACTICES_EN.map((p, i) => (
              <div key={p.title} className="lamina practica">
                <span className="numero" aria-hidden="true">{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Skills title="Tools and capabilities" withItems lang="en" />
        <Education lang="en" />
      </main>
      <Footer lang="en" />
    </>
  )
}
