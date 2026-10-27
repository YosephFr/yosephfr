'use client'

import { useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import NewsletterCTA from '@/components/NewsletterCTA'
import RealCostTable from '@/components/RealCostTable'
import { LEAD_MAGNET, REAL_COST_PATH, realCostCopy } from '@/data/real-cost'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd } from '@/lib/seo'
import type { Lang } from '@/lib/lang'

const CONFIRM_KEY = 'nl_confirm'
let confirmWatch: number | null = null
let confirmCounted = false

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function alreadyConfirmed() {
  if (confirmCounted) return true
  try {
    return sessionStorage.getItem(CONFIRM_KEY) === '1'
  } catch {
    return false
  }
}

function fireConfirm(lang: Lang) {
  if (alreadyConfirmed() || confirmWatch !== null) return

  const send = () => {
    if (alreadyConfirmed()) return true
    if (typeof window.gtag !== 'function') return false
    window.gtag('event', 'newsletter_confirm', { language: lang })
    confirmCounted = true
    try {
      sessionStorage.setItem(CONFIRM_KEY, '1')
    } catch {
      // Counted for this document; a new tab can send the event again.
    }
    return true
  }
  if (send()) return
  const started = Date.now()
  confirmWatch = window.setInterval(() => {
    if (send() || Date.now() - started > 5000) {
      if (confirmWatch !== null) window.clearInterval(confirmWatch)
      confirmWatch = null
    }
  }, 100)
}

function subscribeToConfirm() {
  return () => {}
}

function readConfirmed() {
  return new URLSearchParams(window.location.search).get('confirmado') === '1'
}

export default function RealCostArticle({ lang }: { lang: Lang }) {
  const t = realCostCopy(lang)
  const confirmed = useSyncExternalStore(subscribeToConfirm, readConfirmed, () => false)

  useEffect(() => {
    if (confirmed) fireConfirm(lang)
  }, [confirmed, lang])
  const path = REAL_COST_PATH[lang]
  const other = lang === 'es' ? 'en' : 'es'
  const url = `${PROFILE.url}${path}`
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#articulo`,
        headline: t.headline,
        description: LEAD_MAGNET[lang],
        datePublished: '2026-10-24',
        dateModified: '2026-10-24',
        inLanguage: lang,
        image: `${PROFILE.url}/og-arncof-v2.jpg`,
        url,
        mainEntityOfPage: url,
        author: { '@type': 'Person', '@id': `${PROFILE.url}/#person`, name: PROFILE.name, url: PROFILE.url },
        publisher: { '@id': `${PROFILE.url}/#person` },
        isPartOf: { '@id': `${PROFILE.url}/#website` },
      },
      breadcrumbs([{ name: t.home, path: t.homePath }, { name: t.h1, path }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang={lang} className="acento-azul">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza">
          {confirmed && (
            <p className="estado-texto" role="status">{lang === 'en' ? 'Subscription confirmed' : 'Suscripción confirmada'}</p>
          )}
          <p className="meta">
            <Link href={t.homePath} rel="author">{PROFILE.name}</Link>
            {' · '}
            <time dateTime="2026-10">{t.when}</time>
            {' · '}
            <Link href={REAL_COST_PATH[other]} hrefLang={other} lang={other} className="enlace">{t.other}</Link>
          </p>
          <h1>{t.h1}</h1>
          <p className="entrada-texto">{LEAD_MAGNET[lang]}</p>
          <p className="entrada-texto">{t.task}</p>
        </header>
        <section className="marco medicion" aria-labelledby="como-se-midio">
          <RealCostTable lang={lang} />
          <h2 id="como-se-midio">{t.methodTitle}</h2>
          <p className="nota">{t.method}</p>
          <p className="nota">{t.more}</p>
        </section>
        <NewsletterCTA lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
