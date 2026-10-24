import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BackButton from '@/components/BackButton'
import Footer from '@/components/Footer'
import ArticleBody from '@/components/blog/ArticleBody'
import ArticleCards from '@/components/blog/ArticleCards'
import ArticleCover from '@/components/blog/ArticleCover'
import ArticleToc from '@/components/blog/ArticleToc'
import CopyLink from '@/components/CopyLink'
import DotIcon from '@/components/dots/DotIcon'
import { getArticle, getArticles, getArticleSlugs, articleDate, headingId, isEditorialPreview } from '@/data/articles'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, og } from '@/lib/seo'

export const dynamic = 'force-static'
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() { return getArticleSlugs().map(slug => ({ slug })) }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const a = getArticle(slug)
  if (!a) return {}
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: og({ title: a.title, description: a.description, url: `/blog/${slug}`, type: 'article', publishedTime: a.date, modifiedTime: a.updated, authors: [PROFILE.name], section: a.category }),
    twitter: { card: 'summary_large_image', title: a.title, description: a.description, images: ['/og-arncof-v2.jpg'] },
    robots: isEditorialPreview ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()
  const url = `${PROFILE.url}/blog/${slug}`
  const headings = article.blocks.filter(b => b.type === 'heading').map(b => ({ id: headingId(b.text!), text: b.text! }))
  const related = getArticles()
    .filter(a => a.slug !== slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category) || Date.parse(b.date) - Date.parse(a.date))
    .slice(0, 2)
  const published = articleDate(article.date)
  const updated = articleDate(article.updated)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#articulo`,
        headline: article.title,
        description: article.description,
        articleSection: article.category,
        datePublished: article.date,
        dateModified: article.updated,
        inLanguage: 'es',
        image: `${PROFILE.url}/og-arncof-v2.jpg`,
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', '@id': `${PROFILE.url}/#person`, name: PROFILE.name, url: PROFILE.url },
        publisher: { '@id': `${PROFILE.url}/#person` },
        isPartOf: { '@id': `${PROFILE.url}/blog#blog` },
      },
      breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Artículos', path: '/blog' }, { name: article.title, path: `/blog/${slug}` }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang="es" className="acento-fucsia">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <article>
          <header className="marco articulo-cabeza">
            <BackButton href="/blog" label="Artículos" />
            <h1>{article.title}</h1>
            <p className="entrada-texto">{article.description}</p>
            <div className="articulo-datos">
              <span className="meta">
                {article.category} · {article.author} · <time dateTime={article.date}>{published}</time> · {article.readingMinutes} min de lectura
                {updated !== published && <> · Actualizado <time dateTime={article.updated}>{updated}</time></>}
              </span>
              <CopyLink url={url} />
            </div>
          </header>
          <div className="marco articulo-banda" aria-hidden="true"><ArticleCover slug={slug} cols={36} rows={8} density={0.85} from="abajo-derecha" /></div>
          <div className="marco articulo-rejilla">
            <div>
              {headings.length > 1 && <ArticleToc headings={headings} variant="movil" />}
              <ArticleBody blocks={article.blocks} />
              <aside className="lamina autor" aria-label="Autor">
                <div>
                  <h2>Escrito por {article.author}</h2>
                  <p>{PROFILE.name}. Agentes de IA, software y automatización para el trabajo real.</p>
                </div>
                <div className="acciones">
                  <Link href="/cv" className="boton boton-tonal">Ver CV</Link>
                  <Link href="/contacto" className="boton boton-tonal">Contacto</Link>
                </div>
              </aside>
            </div>
            {headings.length > 1 && <div><ArticleToc headings={headings} variant="lateral" /></div>}
          </div>
        </article>
        {related.length > 0 && (
          <section className="marco seccion" aria-labelledby="seguir-leyendo">
            <div className="seccion-cabeza">
              <h2 id="seguir-leyendo">Sigue leyendo</h2>
              <Link href="/blog" className="enlace">Todos los artículos <DotIcon name="flecha" size={13} /></Link>
            </div>
            <ArticleCards articles={related} />
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
