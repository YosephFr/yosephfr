import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import StartLanding from '@/components/StartLanding'
import { articleDate, articlePath, getFeaturedArticles } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { alternates } from '@/lib/lang'
import { jsonLd, og } from '@/lib/seo'

const title = 'Empieza aquí'
const description = 'Yoseph Franco diseña agentes de IA, software y automatizaciones, y publica lo que prueba. Newsletter semanal, costo de lista de modelos y artículos recientes.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/empieza', languages: alternates('/empieza', '/en/start') },
  openGraph: og({ title: `${title} | ${PROFILE.brand}`, description, url: '/empieza', locale: 'es_AR', alternateLocale: ['en_US'] }),
  twitter: { card: 'summary_large_image', title: `${title} | ${PROFILE.brand}`, description, images: ['/og-arncof-v2.jpg'], creator: '@arncof' },
  robots: { index: true, follow: true },
}

export default function EmpiezaPage() {
  const articles = getFeaturedArticles('es', 4).map(article => ({
    title: article.title,
    description: article.description,
    category: article.category,
    when: articleDate(article.date, 'es'),
    minutes: `${article.readingMinutes} min de lectura`,
    href: articlePath(article),
  }))
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${PROFILE.url}/empieza#pagina`,
    url: `${PROFILE.url}/empieza`,
    name: title,
    description,
    inLanguage: 'es',
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    about: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <StartLanding lang="es" articles={articles} schemaJson={jsonLd(schema)} />
      <Footer />
    </>
  )
}
