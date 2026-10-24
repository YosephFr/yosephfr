import type { Metadata } from 'next'
import Link from 'next/link'
import { PROFILE } from '@/data/profile'
import { social } from '@/lib/seo'
import { alternates } from '@/lib/lang'
import { EXPERIENCE } from '@/data/experience'
import DotIcon from '@/components/dots/DotIcon'
import ContactActions from '@/components/ContactActions'
import PrintButton from '@/components/PrintButton'
import Trajectory from '@/components/Trajectory'
import Skills from '@/components/Skills'
import Education from '@/components/Education'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'CV de Yoseph Franco',
  description: 'Experiencia en ingeniería de IA, desarrollo de software, automatización e infraestructura. Prácticas actuales y formación.',
  alternates: { canonical: '/cv', languages: alternates('/cv', '/en/cv') },
  ...social({ title: 'CV de Yoseph Franco | Arncof', description: 'Experiencia en ingeniería de IA, desarrollo de software, automatización e infraestructura.', url: '/cv', type: 'profile' }),
}

const PRACTICES = [
  { title: 'Continuidad entre agentes', text: 'Contexto persistente, registro de decisiones y responsables por área para retomar trabajos largos sin perder evidencia.' },
  { title: 'Diseño y revisión en uso', text: 'Investigación de referencias, adaptación al sistema visual del producto y recorridos con situaciones reales.' },
  { title: 'Conocimiento que se puede rastrear', text: 'Análisis de conversaciones y grabaciones, extracción de decisiones y documentación con ejemplos anonimizados.' },
  { title: 'Producción editorial con IA', text: 'Fuentes primarias, guiones, revisión de medios y control de publicaciones. Cada entrega conserva su estado y evidencia.' },
]

export default function CV() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${PROFILE.url}/cv#perfil`,
    url: `${PROFILE.url}/cv`,
    name: 'CV de Yoseph Franco',
    inLanguage: 'es',
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
            <p className="entrada-texto">Diseño flujos de trabajo con agentes para investigar, construir y revisar productos. Organizo el contexto, las herramientas y la continuidad del trabajo, y compruebo el resultado con casos reales.</p>
            <div className="acciones-cv"><ContactActions extra={<PrintButton />} /></div>
          </div>
          <Trajectory />
        </header>

        <section className="marco seccion" aria-labelledby="experiencia">
          <div className="seccion-cabeza"><h2 id="experiencia">Experiencia</h2></div>
          <div className="roles">
            {EXPERIENCE.map(e => (
              <article key={e.slug} className="lamina rol">
                <div>
                  <h3>{e.title}</h3>
                  <p className="meta">{e.company} · {e.period}</p>
                  <Link href={`/experiencia/${e.slug}`} className="enlace no-imprimir">Ver detalle <DotIcon name="flecha" size={13} /></Link>
                </div>
                <div className="rol-cuerpo">
                  <p>{e.fullDescription}</p>
                  <ul className="lista-puntos">{e.achievements.map(a => <li key={a}>{a}</li>)}</ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="marco seccion" aria-labelledby="practicas">
          <div className="seccion-cabeza"><h2 id="practicas">Prácticas actuales</h2></div>
          <div className="practicas">
            {PRACTICES.map((p, i) => (
              <div key={p.title} className="lamina practica">
                <span className="numero" aria-hidden="true">{i + 1}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
        </section>

        <Skills title="Herramientas y capacidades" withItems />
        <Education />
      </main>
      <Footer />
    </>
  )
}
