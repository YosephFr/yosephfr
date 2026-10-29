import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import InternalLink from '@/components/InternalLink'
import NewsletterCTA from '@/components/NewsletterCTA'
import { PROFILE } from '@/data/profile'
import { alternates } from '@/lib/lang'
import { jsonLd, og } from '@/lib/seo'

const title = 'Newsletter'
const description = "Franco's notes on AI agents, models, automation and coding tools, plus new posts from the blog. One email a week. Unsubscribe anytime."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/en/newsletter', languages: alternates('/newsletter', '/en/newsletter') },
  openGraph: og({ title: `${title} | ${PROFILE.brand}`, description, url: '/en/newsletter', locale: 'en_US', alternateLocale: ['es_AR'] }),
  twitter: { card: 'summary_large_image', title: `${title} | ${PROFILE.brand}`, description, images: ['/og-arncof-v2.jpg'], creator: '@arncof' },
  robots: { index: true, follow: true },
}

export default function NewsletterPageEn() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PROFILE.url}/en/newsletter#page`,
    url: `${PROFILE.url}/en/newsletter`,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    about: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <main id="contenido" lang="en" className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza">
          <p className="meta">
            Franco
            {' · '}
            <InternalLink href="/newsletter" hrefLang="es" lang="es" className="enlace">Leer en español</InternalLink>
          </p>
          <h1>{title}</h1>
          <p className="entrada-texto">{description}</p>
        </header>
        <NewsletterCTA lang="en" anchor="boletin" />
      </main>
      <Footer lang="en" />
    </>
  )
}
