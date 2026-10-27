import type { Metadata } from 'next'
import Link from 'next/link'
import { articlePath, getEnglishIndex } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import ArticleCards from '@/components/blog/ArticleCards'
import Hero from '@/components/Hero'
import Experience from '@/components/Experience'
import Skills from '@/components/Skills'
import CTA from '@/components/CTA'
import NewsletterCTA from '@/components/NewsletterCTA'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'
import { jsonLd, og, profilePage } from '@/lib/seo'
import { UI, alternates } from '@/lib/lang'

const title = 'Arncof · Yoseph Franco | AI and software'
const description = 'AI agents, software and automation for real work. Experience, guides and analysis by Yoseph Franco, Arncof.'

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: '/en', languages: alternates('/', '/en'), types: { 'application/rss+xml': '/en/feed.xml' } },
  openGraph: og({ title, description, url: '/en', type: 'website', locale: 'en_US', alternateLocale: ['es_AR'] }),
  twitter: { card: 'summary_large_image', title: 'Arncof · Yoseph Franco', description, images: ['/og-arncof-v2.jpg'] },
}

export default function HomeEn() {
  const { english, spanishOnly } = getEnglishIndex()
  const articles = [...english, ...spanishOnly]
  const t = UI.en
  const schema = {
    '@context': 'https://schema.org',
    ...profilePage({
      id: `${PROFILE.url}/en#perfil`,
      url: `${PROFILE.url}/en`,
      name: `${PROFILE.brand} · ${PROFILE.name}`,
      inLanguage: 'en',
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
      <main id="contenido" lang="en" className="acento-verde">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <Hero lang="en" />
        {articles.length > 0 && (
          <section className="marco seccion acento-azul">
            <div className="seccion-cabeza">
              <h2>{t.articles.heading}</h2>
              <Link href={t.blog} className="enlace">{t.articles.all} <DotIcon name="flecha" size={13} /></Link>
            </div>
            <ArticleCards articles={articles.slice(0, 3)} lang="en" />
          </section>
        )}
        <Experience lang="en" />
        <Skills lang="en" />
        <CTA lang="en" />
        <NewsletterCTA lang="en" anchor="boletin" />
      </main>
      <Footer lang="en" />
    </>
  )
}
