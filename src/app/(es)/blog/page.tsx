import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import ArticleCards, { FeaturedArticle } from '@/components/blog/ArticleCards'
import DotIcon from '@/components/dots/DotIcon'
import DotField, { cascade } from '@/components/dots/DotField'
import { getArticles, isEditorialPreview } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd, og } from '@/lib/seo'
import { alternates } from '@/lib/lang'

const description = 'Guías y decisiones prácticas sobre agentes de IA, diseño y automatización, por Franco.'

export const metadata: Metadata = {
  title: 'IA para el trabajo real',
  description,
  alternates: { canonical: '/blog', languages: alternates('/blog', '/en/blog'), types: { 'application/rss+xml': '/feed.xml' } },
  openGraph: og({ title: 'IA para el trabajo real | Franco', description: 'Guías prácticas de diseño y operación con agentes de IA.', url: '/blog', type: 'website' }),
  twitter: { card: 'summary_large_image', title: 'IA para el trabajo real | Franco', description: 'Guías prácticas de diseño y operación con agentes de IA.', images: ['/og-arncof-v2.jpg'] },
  robots: isEditorialPreview ? { index: false, follow: false } : { index: true, follow: true },
}

export default function BlogPage() {
  const articles = getArticles()
  const [first, ...rest] = articles
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Blog',
        '@id': `${PROFILE.url}/blog#blog`,
        url: `${PROFILE.url}/blog`,
        name: 'IA para el trabajo real',
        description,
        inLanguage: 'es',
        isPartOf: { '@id': `${PROFILE.url}/#website` },
        publisher: { '@id': `${PROFILE.url}/#person` },
        blogPost: articles.map(a => ({ '@type': 'BlogPosting', headline: a.title, url: `${PROFILE.url}/blog/${a.slug}`, datePublished: a.date, dateModified: a.updated, author: { '@id': `${PROFILE.url}/#person` } })),
      },
      breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Artículos', path: '/blog' }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang="es" className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza blog-cabeza cabeza-centrada">
          <div>
            <h1 className="display">IA para el trabajo real</h1>
            <p className="entrada-texto">Guías y decisiones prácticas sobre agentes, diseño y automatización.</p>
          </div>
          {first && <a href="/feed.xml" className="boton boton-tonal"><DotIcon name="rss" size={15} />RSS</a>}
        </header>
        <section className="marco blog-lista" aria-label="Artículos">
          {first ? (
            <>
              <FeaturedArticle article={first} />
              {rest.length > 0 && <ArticleCards articles={rest} level="h2" />}
            </>
          ) : (
            <div className="lamina vacio">
              <div>
                <h2 className="subtitulo">Los primeros artículos llegan pronto.</h2>
                <div className="acciones vacio-acciones"><a href="/feed.xml" className="boton boton-claro"><DotIcon name="rss" size={15} />Recibirlos por RSS</a></div>
              </div>
              <div className="vacio-campo"><DotField cols={14} rows={8} cells={cascade(14, 8, 'arncof-blog', 'abajo', 1.05)} align="xMaxYMax slice" /></div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
