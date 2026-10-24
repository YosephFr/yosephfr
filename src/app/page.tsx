import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicArticles } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import ArticleCards from '@/components/blog/ArticleCards'
import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'

export const metadata: Metadata = {
  alternates: { canonical: '/', types: { 'application/rss+xml': '/feed.xml' } },
}

export default function Home() {
  const articles = getPublicArticles()
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${PROFILE.url}/#perfil`,
    url: `${PROFILE.url}/`,
    name: `${PROFILE.brand} · ${PROFILE.name}`,
    inLanguage: 'es',
    dateModified: PROFILE.updated,
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    mainEntity: { '@id': `${PROFILE.url}/#person` },
  }
  return (
    <>
      <main id="contenido" className="acento-verde">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <Hero />
        {articles.length > 0 && (
          <section className="marco seccion acento-azul">
            <div className="seccion-cabeza">
              <h2>Ideas para trabajar mejor</h2>
              <Link href="/blog" className="enlace">Todos los artículos <DotIcon name="flecha" size={13} /></Link>
            </div>
            <ArticleCards articles={articles.slice(0, 3)} />
          </section>
        )}
        <Experience />
        <Skills />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
