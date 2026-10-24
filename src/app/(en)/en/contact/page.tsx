import type { Metadata } from 'next'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd, social } from '@/lib/seo'
import { alternates } from '@/lib/lang'
import ContactActions from '@/components/ContactActions'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'
import DotField, { glyphAt } from '@/components/dots/DotField'

export const metadata: Metadata = {
  title: 'Contact',
  description: `Talk to Yoseph Franco about AI, software and automation. ${PROFILE.email}`,
  alternates: { canonical: '/en/contact', languages: alternates('/contacto', '/en/contact') },
  ...social({ title: 'Contact | Arncof', url: '/en/contact', description: 'Let’s talk about your product or process.' }),
}

function handle(href: string) {
  const path = new URL(href).pathname.replace(/\/$/, '')
  if (path.startsWith('/in/')) return path.slice(1)
  const last = path.split('/').pop() ?? ''
  return href.includes('github.com') ? last : last.startsWith('@') ? last : `@${last}`
}

export default function ContactPageEn() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        '@id': `${PROFILE.url}/en/contact#pagina`,
        url: `${PROFILE.url}/en/contact`,
        name: 'Contact',
        inLanguage: 'en',
        isPartOf: { '@id': `${PROFILE.url}/#website` },
        mainEntity: { '@id': `${PROFILE.url}/#person` },
      },
      breadcrumbs([{ name: 'Home', path: '/en' }, { name: 'Contact', path: '/en/contact' }]),
    ],
  }
  return (
    <>
      <main id="contenido" className="acento-verde">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza cabeza-centrada">
          <h1 className="display">Let’s talk about your next project.</h1>
          <p className="entrada-texto">AI, software and automation. Tell me what you need to solve.</p>
        </header>
        <section className="marco contacto-rejilla" aria-label="Email">
          <div className="lamina correo-tarjeta"><ContactActions variant="tarjeta" lang="en" /></div>
          <div className="contacto-campo" aria-hidden="true"><DotField cols={15} rows={9} cells={glyphAt('contacto', 6, 0)} align="xMaxYMid slice" /></div>
        </section>
        <section className="marco seccion" aria-labelledby="perfiles">
          <div className="seccion-cabeza"><h2 id="perfiles">Also on</h2></div>
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
      <Footer lang="en" />
    </>
  )
}
