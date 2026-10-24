import type { Metadata } from 'next'
import Link from 'next/link'
import { articlePath, getPublicArticles } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { jsonLd, profilePage } from '@/lib/seo'
import ArticleCards from '@/components/blog/ArticleCards'
import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import CTA from '@/components/CTA'
import NewsletterCTA from '@/components/NewsletterCTA'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'
import { alternates } from '@/lib/lang'

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: alternates('/', '/en'), types: { 'application/rss+xml': '/feed.xml' } },
}

export default function Home() {
  const articles = getPublicArticles()
  const schema = {
    '@context': 'https://schema.org',
    ...profilePage({
      id: `${PROFILE.url}/#perfil`,
      url: `${PROFILE.url}/`,
      name: `${PROFILE.brand} · ${PROFILE.name}`,
      inLanguage: 'es',
      hasPart: articles.slice(0, 3).map(a => ({
        '@type': 'BlogPosting',
        headline: a.title,
        url: `${PROFILE.url}${articlePath(a)}`,
        datePublished: a.date,
        inLanguage: a.language,
        author: { '@id': `${PROFILE.url}/#person` },
      })),
    }),
  }
  return (
    <>
      <main id="contenido" className="acento-verde">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
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
        <NewsletterCTA />
      </main>
      <Footer />
    </>
  )
}
