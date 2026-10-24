import type { Metadata } from 'next'
import { PROFILE } from '@/data/profile'
import { social } from '@/lib/seo'
import { alternates } from '@/lib/lang'
import ContactActions from '@/components/ContactActions'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'
import DotField, { glyphAt } from '@/components/dots/DotField'

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Habla con Yoseph Franco sobre IA, software y automatización. ${PROFILE.email}`,
  alternates: { canonical: '/contacto', languages: alternates('/contacto', '/en/contact') },
  ...social({ title: 'Contacto | Arncof', url: '/contacto', description: 'Hablemos de tu producto o proceso.' }),
}

function handle(href: string) {
  const path = new URL(href).pathname.replace(/\/$/, '')
  if (path.startsWith('/in/')) return path.slice(1)
  const last = path.split('/').pop() ?? ''
  return href.includes('github.com') ? last : last.startsWith('@') ? last : `@${last}`
}

export default function ContactPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${PROFILE.url}/contacto#pagina`,
    url: `${PROFILE.url}/contacto`,
    name: 'Contacto',
    inLanguage: 'es',
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    mainEntity: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <main id="contenido" className="acento-verde">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <header className="marco pagina-cabeza cabeza-centrada">
          <h1 className="display">Hablemos de tu próximo proyecto.</h1>
          <p className="entrada-texto">IA, software y automatización. Cuéntame qué necesitas resolver.</p>
        </header>
        <section className="marco contacto-rejilla" aria-label="Correo">
          <div className="lamina correo-tarjeta"><ContactActions variant="tarjeta" /></div>
          <div className="contacto-campo" aria-hidden="true"><DotField cols={15} rows={9} cells={glyphAt('contacto', 6, 0)} align="xMaxYMid slice" /></div>
        </section>
        <section className="marco seccion" aria-labelledby="perfiles">
          <div className="seccion-cabeza"><h2 id="perfiles">También en</h2></div>
          <div className="perfiles">
            {PROFILE.socials.map(s => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" data-event="social_profile_click" data-channel={s.name} className="lamina perfil">
                <span className="perfil-nombre">{s.name}<DotIcon name="salida" size={11} /></span>
                <span className="meta">{handle(s.href)}</span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
