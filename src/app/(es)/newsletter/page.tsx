import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import InternalLink from '@/components/InternalLink'
import NewsletterCTA from '@/components/NewsletterCTA'
import { PROFILE } from '@/data/profile'
import Link from 'next/link'
import { NUMEROS } from '@/data/newsletter'
import { alternates } from '@/lib/lang'
import { jsonLd, og } from '@/lib/seo'

const title = 'Newsletter'
const description = 'Notas de Franco sobre agentes de IA, modelos, automatización y herramientas de código, y los artículos nuevos del blog. Un correo por semana. Puedes darte de baja cuando quieras.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/newsletter', languages: alternates('/newsletter', '/en/newsletter') },
  openGraph: og({ title: `${title} | ${PROFILE.brand}`, description, url: '/newsletter', locale: 'es_AR', alternateLocale: ['en_US'] }),
  twitter: { card: 'summary_large_image', title: `${title} | ${PROFILE.brand}`, description, images: ['/og-arncof-v2.jpg'], creator: '@arncof' },
  robots: { index: true, follow: true },
}

export default function NewsletterPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PROFILE.url}/newsletter#pagina`,
    url: `${PROFILE.url}/newsletter`,
    name: title,
    description,
    inLanguage: 'es',
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    about: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <main id="contenido" lang="es" className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza">
          <p className="meta">
            Franco
            {' · '}
            <InternalLink href="/en/newsletter" hrefLang="en" lang="en" className="enlace">Read in English</InternalLink>
          </p>
          <h1 className="titulo">{title}</h1>
        </header>
        <NewsletterCTA anchor="boletin" offer={{ title: 'Lo que aprendo, cada semana', text: 'Cada domingo, lo que probé con IA y el material nuevo de los videos.', button: 'Suscribirme' }} />
        <section className="marco seccion" aria-labelledby="numeros-titulo">
          <h2 id="numeros-titulo" className="numeros-titulo">Números</h2>
          <ul className="numeros">
            {NUMEROS.slice().reverse().map(n => (
              <li key={n.numero}>
                <Link href={`/newsletter/${n.numero}`} className="lamina numero-tarjeta">
                  <span className="meta">Número {n.numero}</span>
                  <strong>{n.title}</strong>
                  <span className="numero-resumen">{n.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  )
}
