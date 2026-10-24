import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import NewsletterCTA from '@/components/NewsletterCTA'
import ArticleCards, { FeaturedArticle } from '@/components/blog/ArticleCards'
import DotIcon from '@/components/dots/DotIcon'
import DotField, { cascade } from '@/components/dots/DotField'
import { articlePath, getEnglishIndex, isEditorialPreview } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd, og } from '@/lib/seo'
import { alternates } from '@/lib/lang'

const title = 'AI for real work'
const description = 'Practical guides and decisions on AI agents, design and automation, by Franco. In English and Spanish.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/en/blog', languages: alternates('/blog', '/en/blog'), types: { 'application/rss+xml': '/en/feed.xml' } },
  openGraph: og({ title: `${title} | Franco`, description, url: '/en/blog', type: 'website', locale: 'en_US', alternateLocale: ['es_AR'] }),
  twitter: { card: 'summary_large_image', title: `${title} | Franco`, description, images: ['/og-arncof-v2.jpg'] },
  robots: isEditorialPreview ? { index: false, follow: false } : { index: true, follow: true },
}

// Índice en inglés: los artículos en inglés primero; los que todavía solo existen en español, después y avisados.
export default function BlogPageEn() {
  const { english, spanishOnly } = getEnglishIndex()
  const [first, ...rest] = english
  const all = [...english, ...spanishOnly]
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${PROFILE.url}/en/blog#blog`,
        url: `${PROFILE.url}/en/blog`,
        name: title,
        description,
        inLanguage: 'en',
        isPartOf: { '@id': `${PROFILE.url}/#website` },
        publisher: { '@id': `${PROFILE.url}/#person` },
        blogPost: all.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: `${PROFILE.url}${articlePath(a)}`, inLanguage: a.language, datePublished: a.date, dateModified: a.updated, author: { '@id': `${PROFILE.url}/#person` } })),
      },
      breadcrumbs([{ name: 'Home', path: '/en' }, { name: 'Articles', path: '/en/blog' }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang="en" className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza blog-cabeza cabeza-centrada">
          <div>
            <h1 className="display">{title}</h1>
            <p className="entrada-texto">Practical guides and decisions on agents, design and automation.</p>
          </div>
          {english.length > 0 && <a href="/en/feed.xml" className="boton boton-tonal"><DotIcon name="rss" size={15} />RSS</a>}
        </header>
        <section className="marco blog-lista" aria-label="Articles">
          {first ? (
            <>
              <FeaturedArticle article={first} lang="en" />
              {rest.length > 0 && <ArticleCards articles={rest} level="h2" lang="en" />}
            </>
          ) : spanishOnly.length === 0 && (
            <div className="lamina vacio">
              <div>
                <h2 className="subtitulo">The first articles are coming soon.</h2>
                <div className="acciones vacio-acciones"><a href="/en/feed.xml" className="boton boton-claro"><DotIcon name="rss" size={15} />Get them by RSS</a></div>
              </div>
              <div className="vacio-campo"><DotField cols={14} rows={8} cells={cascade(14, 8, 'arncof-blog', 'abajo', 1.05)} align="xMaxYMax slice" /></div>
            </div>
          )}
        </section>
        {spanishOnly.length > 0 && (
          <section className="marco seccion" aria-labelledby="en-espanol">
            <div className="seccion-cabeza"><h2 id="en-espanol">In Spanish</h2></div>
            <ArticleCards articles={spanishOnly} lang="en" />
          </section>
        )}
        <NewsletterCTA lang="en" />
      </main>
      <Footer lang="en" />
    </>
  )
}
