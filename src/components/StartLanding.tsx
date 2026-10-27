'use client'

import InternalLink from '@/components/InternalLink'
import NewsletterCTA from '@/components/NewsletterCTA'
import RealCostTable from '@/components/RealCostTable'
import { REAL_COST_PATH, REAL_COST_ROWS, realCostCopy } from '@/data/real-cost'
import type { Lang } from '@/lib/lang'

export type StartArticle = {
  title: string
  description: string
  category: string
  when: string
  minutes: string
  href: string
}

const COPY = {
  es: {
    kicker: 'Yoseph Franco',
    h1: 'Empieza aquí',
    who: 'Diseño agentes de IA, software y automatizaciones, y publico lo que pruebo. En esta página está el newsletter semanal, la tabla de costo de lista y cuatro artículos recientes.',
    articles: 'Cuatro artículos para seguir',
    resource: 'Costo de lista de una tarea',
    resourceLink: 'Ver la medición completa',
    note: 'USD de lista, no lo facturado. Misma consigna, una ejecución por modelo, octubre de 2026.',
    other: 'Read in English',
    otherHref: '/en/start',
  },
  en: {
    kicker: 'Yoseph Franco',
    h1: 'Start here',
    who: 'I design AI agents, software and automations, and I publish what I test. This page has the weekly newsletter, the list-cost table and four recent articles.',
    articles: 'Four articles to continue with',
    resource: 'List cost of one task',
    resourceLink: 'Read the full measurement',
    note: 'List USD, not the amount billed. Same prompt, one run per model, October 2026.',
    other: 'Leer en español',
    otherHref: '/empieza',
  },
} as const

export default function StartLanding({ lang, articles, schemaJson }: { lang: Lang; articles: StartArticle[]; schemaJson: string }) {
  const t = COPY[lang]
  const cost = realCostCopy(lang)
  const other = lang === 'es' ? 'en' : 'es'
  return (
    <>
      <main id="contenido" lang={lang} className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schemaJson }} />
        <header className="marco pagina-cabeza">
          <p className="meta">
            {t.kicker}
            {' · '}
            <InternalLink href={t.otherHref} hrefLang={other} lang={other} className="enlace">{t.other}</InternalLink>
          </p>
          <h1>{t.h1}</h1>
          <p className="entrada-texto">{t.who}</p>
        </header>
        <NewsletterCTA lang={lang} anchor="boletin" />
        <section className="marco seccion" aria-labelledby="costo-lista">
          <div className="seccion-cabeza">
            <h2 id="costo-lista">{t.resource}</h2>
            <InternalLink href={REAL_COST_PATH[lang]} className="enlace">{t.resourceLink}</InternalLink>
          </div>
          <p className="nota">{cost.task}</p>
          <ul className="costo-cifras">
            {REAL_COST_ROWS.map(row => (
              <li key={row.model}>
                <strong>{row.cost}</strong>
                <span>{row.model} · {row.time}</span>
              </li>
            ))}
          </ul>
          <RealCostTable lang={lang} />
          <p className="nota">{t.note}</p>
        </section>
        <section className="marco seccion" aria-labelledby="articulos-empieza">
          <h2 id="articulos-empieza">{t.articles}</h2>
          <div className="empieza-articulos">
            {articles.map(article => (
              <InternalLink key={article.href} href={article.href} className="lamina empieza-articulo">
                <span className="meta">{article.category} · {article.when} · {article.minutes}</span>
                <h3>{article.title}</h3>
                <p>{article.description}</p>
              </InternalLink>
            ))}
          </div>
        </section>
        <NewsletterCTA lang={lang} />
      </main>
    </>
  )
}
