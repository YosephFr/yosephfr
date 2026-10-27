import type { Metadata } from 'next'
import { preload } from 'react-dom'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import InternalLink from '@/components/InternalLink'
import BackButton from '@/components/BackButton'
import Footer from '@/components/Footer'
import ArticleRead from '@/components/ArticleRead'
import NewsletterCTA from '@/components/NewsletterCTA'
import ArticleBody from '@/components/blog/ArticleBody'
import ArticleCards from '@/components/blog/ArticleCards'
import ArticleCover from '@/components/blog/ArticleCover'
import ArticleToc from '@/components/blog/ArticleToc'
import CopyLink from '@/components/CopyLink'
import DotIcon from '@/components/dots/DotIcon'
import { getArticle, getArticles, getTranslation, articleDate, articlePath, headingId, insertAfterShare, isEditorialPreview } from '@/data/articles'
import { extraFaqFor } from '@/data/extra-faq'
import { offerForArticle } from '@/data/offers'
import { PROFILE } from '@/data/profile'
import ProfilePhoto from '@/components/ProfilePhoto'
import { breadcrumbs, jsonLd, og } from '@/lib/seo'
import { UI, type Lang } from '@/lib/lang'

const TEXT = {
  es: { home: 'Inicio', articles: 'Artículos', read: 'min de lectura', updated: 'Actualizado', by: 'Escrito por', bio: 'Agentes de IA, software y automatización para el trabajo real.', cv: 'Ver CV', contact: 'Contacto', more: 'Sigue leyendo', other: 'Read in English', locale: 'es_AR' },
  en: { home: 'Home', articles: 'Articles', read: 'min read', updated: 'Updated', by: 'Written by', bio: 'AI agents, software and automation for real work.', cv: 'View CV', contact: 'Contact', more: 'Keep reading', other: 'Leer en español', locale: 'en_US' },
}

// Canonical propio y, si la otra versión ya es visible, hreflang recíproco con x-default en español.
export function articleMetadata(slug: string, lang: Lang): Metadata {
  const a = getArticle(slug, lang)
  if (!a) return {}
  const path = articlePath(a)
  const other = getTranslation(a)
  // Con traducción: hreflang recíproco y x-default en español. Un original solo en inglés declara en, sin x-default.
  const languages = other
    ? { [a.language]: path, [other.language]: articlePath(other), 'x-default': a.language === 'es' ? path : articlePath(other) }
    : a.language === 'en'
      ? { en: path }
      : undefined
  const socialTitle = a.ogTitle || a.seoTitle || a.title
  const socialDescription = a.ogDescription || a.description
  const coverImage = a.cover ? [{ url: a.cover.src, width: a.cover.width, height: a.cover.height, alt: a.cover.alt, type: 'image/webp' as const }] : undefined
  return {
    title: a.seoTitle ? { absolute: a.seoTitle } : a.title,
    description: a.description,
    alternates: { canonical: path, ...(languages ? { languages } : {}) },
    openGraph: og({ title: socialTitle, description: socialDescription, url: path, type: 'article', publishedTime: a.date, modifiedTime: a.updated, authors: [PROFILE.name], section: a.category, locale: TEXT[lang].locale, ...(coverImage ? { images: coverImage } : {}) }),
    twitter: { card: 'summary_large_image', title: socialTitle, description: socialDescription, images: [a.cover?.src ?? '/og-arncof-v2.jpg'], creator: '@arncof' },
    robots: isEditorialPreview ? { index: false, follow: false } : { index: true, follow: true },
  }
}

export default function ArticleView({ slug, lang }: { slug: string; lang: Lang }) {
  const article = getArticle(slug, lang)
  if (!article) notFound()
  const t = TEXT[lang]
  const path = articlePath(article)
  const url = `${PROFILE.url}${path}`
  const blog = UI[lang].blog
  const other = getTranslation(article)
  const headings = article.blocks.filter(b => b.type === 'heading').map(b => ({ id: headingId(b.text!), text: b.text! }))
  const offer = offerForArticle(article, lang)
  const moreFaq = article.faq?.length ? extraFaqFor(article, lang) : []
  const faq = [...(article.faq ?? []), ...moreFaq]
  const sameLanguage = getArticles(lang)
    .filter(a => a.slug !== slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category) || Date.parse(b.date) - Date.parse(a.date))
  const related = (sameLanguage.length ? sameLanguage : lang === 'en' ? getArticles('es') : []).slice(0, 2)
  if (article.cover) preload(article.cover.src, { as: 'image', fetchPriority: 'high' })
  const published = articleDate(article.date, lang)
  const updated = articleDate(article.updated, lang)
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
        inLanguage: lang,
        image: article.cover
          ? { '@type': 'ImageObject', url: `${PROFILE.url}${article.cover.src}`, width: article.cover.width, height: article.cover.height, caption: article.cover.alt }
          : `${PROFILE.url}/og-arncof-v2.jpg`,
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', '@id': `${PROFILE.url}/#person`, name: PROFILE.name, url: PROFILE.url },
        publisher: { '@id': `${PROFILE.url}/#person` },
        isPartOf: { '@id': `${PROFILE.url}${lang === 'en' ? '/en/blog' : '/blog'}#blog` },
        ...(article.citation ? { citation: article.citation, isBasedOn: article.citation } : {}),
        ...(article.keyword ? { keywords: article.keyword } : {}),
        // La versión en inglés declara de qué artículo es traducción.
        ...(other && lang === 'en' ? { translationOfWork: { '@id': `${PROFILE.url}${articlePath(other)}#articulo` } } : {}),
      },
      ...(faq.length ? [{
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        inLanguage: lang,
        mainEntity: faq.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
      }] : []),
      breadcrumbs([{ name: t.home, path: UI[lang].home }, { name: t.articles, path: blog }, { name: article.title, path }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang={lang} className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <article>
          <ArticleRead lang={lang} />
          <header className="marco articulo-cabeza">
            <BackButton href={blog} label={t.articles} />
            <h1>{article.title}</h1>
            <p className="entrada-texto">{article.description}</p>
            {article.citation && <p className="atribucion">Originally published on <a href={article.citation} rel="noopener">X</a>.</p>}
            <div className="articulo-datos">
              <span className="meta">
                {article.category} · <Link href={UI[lang].home} rel="author">{PROFILE.name}</Link> · <time dateTime={article.date}>{published}</time> · {article.readingMinutes} {t.read}
                {updated !== published && <> · {t.updated} <time dateTime={article.updated}>{updated}</time></>}
                {other && <> · <InternalLink href={articlePath(other)} hrefLang={other.language} lang={other.language} className="enlace">{t.other}</InternalLink></>}
              </span>
              <CopyLink url={url} lang={lang} />
            </div>
          </header>
          {article.cover ? (
            <figure className="marco articulo-banda con-portada">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.cover.src} width={article.cover.width} height={article.cover.height} alt={article.cover.alt} decoding="async" fetchPriority="high" />
            </figure>
          ) : (
            <div className="marco articulo-banda" aria-hidden="true"><ArticleCover slug={slug} cols={36} rows={8} density={0.85} from="abajo-derecha" /></div>
          )}
          <div className="marco articulo-rejilla">
            <div>
              {headings.length > 1 && <ArticleToc headings={headings} variant="movil" lang={lang} />}
              <ArticleBody
                blocks={article.blocks}
                cut={insertAfterShare(article.blocks)}
                insert={<NewsletterCTA lang={lang} embedded anchor="boletin" offer={offer} />}
              />
              {moreFaq.length > 0 && (
                <section className="faq-extra" aria-labelledby="faq-extra">
                  <h2 id="faq-extra">{lang === 'en' ? 'One more question' : 'Una pregunta más'}</h2>
                  {moreFaq.map(item => (
                    <div key={item.q}>
                      <h3>{item.q}</h3>
                      <p>{item.a}</p>
                    </div>
                  ))}
                </section>
              )}
              <aside className="lamina autor" aria-label={t.by}>
                <ProfilePhoto size={72} />
                <div>
                  <h2>{t.by} <Link href={UI[lang].home} rel="author">{PROFILE.name}</Link></h2>
                  <p>{t.bio}</p>
                </div>
                <div className="acciones">
                  <Link href={UI[lang].cv} className="boton boton-tonal">{t.cv}</Link>
                  <Link href={UI[lang].contactPath} className="boton boton-tonal">{t.contact}</Link>
                </div>
              </aside>
            </div>
            {headings.length > 1 && <div><ArticleToc headings={headings} variant="lateral" lang={lang} /></div>}
          </div>
        </article>
        {related.length > 0 && (
          <section className="marco seccion" aria-labelledby="seguir-leyendo">
            <div className="seccion-cabeza">
              <h2 id="seguir-leyendo">{t.more}</h2>
              <InternalLink href={blog} className="enlace">{UI[lang].articles.all} <DotIcon name="flecha" size={13} /></InternalLink>
            </div>
            <ArticleCards articles={related} lang={lang} />
          </section>
        )}
        <NewsletterCTA lang={lang} offer={offer} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
