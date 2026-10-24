import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import ArticleCards, { FeaturedArticle } from '@/components/blog/ArticleCards'
import DotIcon from '@/components/dots/DotIcon'
import DotField, { cascade } from '@/components/dots/DotField'
import { getArticles, isEditorialPreview } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { og } from '@/lib/seo'
import { alternates } from '@/lib/lang'

const title = 'AI for real work'
const description = 'Practical guides and decisions on AI agents, design and automation, by Franco. Articles are written in Spanish.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/en/blog', languages: alternates('/blog', '/en/blog'), types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: og({ title: `${title} | Franco`, description, url: '/en/blog', type: 'website', locale: 'en_US', alternateLocale: ['es_AR'] }),
  twitter: { card: 'summary_large_image', title: `${title} | Franco`, description, images: ['/og-arncof-v2.jpg'] },
  robots: isEditorialPreview ? { index: false, follow: false } : { index: true, follow: true },
}

// Índice en inglés de los artículos, que se publican en español: cada tarjeta enlaza a /blog/<slug> con hreflang="es".
export default function BlogPageEn() {
  const articles = getArticles()
  const [first, ...rest] = articles
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${PROFILE.url}/en/blog#coleccion`,
    url: `${PROFILE.url}/en/blog`,
    name: title,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    about: { '@id': `${PROFILE.url}/blog#blog` },
    hasPart: articles.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: `${PROFILE.url}/blog/${a.slug}`, inLanguage: 'es', datePublished: a.date })),
  }
  return (
    <>
      <main id="contenido" lang="en" className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <header className="marco pagina-cabeza blog-cabeza cabeza-centrada">
          <div>
            <h1 className="display">{title}</h1>
            <p className="entrada-texto">Practical guides and decisions on agents, design and automation. The articles are written in Spanish.</p>
          </div>
          {first && <a href="/feed.xml" className="boton boton-tonal"><DotIcon name="rss" size={15} />RSS</a>}
        </header>
        <section className="marco blog-lista" aria-label="Articles">
          {first ? (
            <>
              <FeaturedArticle article={first} lang="en" />
              {rest.length > 0 && <ArticleCards articles={rest} level="h2" lang="en" />}
            </>
          ) : (
            <div className="lamina vacio">
              <div>
                <h2 className="subtitulo">The first articles are coming soon.</h2>
                <div className="acciones vacio-acciones"><a href="/feed.xml" className="boton boton-claro"><DotIcon name="rss" size={15} />Get them by RSS</a></div>
              </div>
              <div className="vacio-campo"><DotField cols={14} rows={8} cells={cascade(14, 8, 'arncof-blog', 'abajo', 1.05)} align="xMaxYMax slice" /></div>
            </div>
          )}
        </section>
      </main>
      <Footer lang="en" />
    </>
  )
}
