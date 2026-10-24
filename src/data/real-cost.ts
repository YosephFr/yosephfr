import type { Metadata } from 'next'
import { PROFILE } from '@/data/profile'
import { alternates, type Lang } from '@/lib/lang'
import { og } from '@/lib/seo'

// Únicas mediciones de primera mano. No agregar cifras que no estén en esta lista.
export const REAL_COST_ROWS = [
  { model: 'Astra', time: '5 min 50 s', seconds: 5 * 60 + 50, usd: 1.14, cost: '$1.14' },
  { model: 'Kimi', time: '34 min 42 s', seconds: 34 * 60 + 42, usd: 1.21, cost: '$1.21' },
  { model: 'Opus', time: '17 min 4 s', seconds: 17 * 60 + 4, usd: 3.10, cost: '$3.10' },
] as const

export const REAL_COST_PATH: Record<Lang, string> = {
  es: '/recursos/costo-real-modelos-ia',
  en: '/en/resources/real-cost-ai-models',
}

export const THANKS_PATH: Record<Lang, string> = {
  es: '/gracias',
  en: '/en/thanks',
}

export const LEAD_MAGNET: Record<Lang, string> = {
  es: 'Tabla de costo real: tiempo y USD por tarea entre modelos de IA, con mediciones propias',
  en: 'Real-cost table: time and USD per task across AI models, from my own runs',
}

export const NEWSLETTER_CONSENT: Record<Lang, string> = {
  es: 'Te suscribes al newsletter de Yoseph Franco (vía Buttondown). Puedes darte de baja cuando quieras.',
  en: "You subscribe to Yoseph Franco's newsletter (via Buttondown). You can unsubscribe whenever you want.",
}

export const BUTTONDOWN_ACTION = 'https://buttondown.com/api/emails/embed-subscribe/yosephfr'

const COPY = {
  es: {
    title: 'Costo real de modelos de IA',
    headline: 'Tabla de costo real: tiempo y USD por tarea entre modelos de IA',
    h1: 'Tabla de costo real',
    task: 'La tarea fue construir un juego «roadster». La consigna fue la misma en los tres casos.',
    when: 'octubre de 2026',
    other: 'Read in English',
    methodTitle: 'Cómo se midió',
    method: 'Misma consigna, una sola ejecución, en mi cuenta, octubre de 2026. Los resultados varían.',
    more: 'Por ahora son tres mediciones de una sola tarea. Van a llegar más. Si quieres las próximas, suscríbete.',
    home: 'Inicio',
    homePath: '/',
    columns: { model: 'Modelo', time: 'Tiempo', cost: 'Costo (USD)' },
    caption: 'Modelo, tiempo y costo en USD',
    sort: 'Ordenar por',
  },
  en: {
    title: 'Real cost of AI models',
    headline: 'Real-cost table: time and USD per task across AI models',
    h1: 'Real-cost table',
    task: "The task was to build a 'roadster' game. The prompt was the same in all three cases.",
    when: 'October 2026',
    other: 'Leer en español',
    methodTitle: 'How it was measured',
    method: 'Same prompt, a single run, on my own account, October 2026. Results vary.',
    more: 'For now these are three measurements of a single task. More are coming. Subscribe if you want the next ones.',
    home: 'Home',
    homePath: '/en',
    columns: { model: 'Model', time: 'Time', cost: 'Cost (USD)' },
    caption: 'Model, time and cost in USD',
    sort: 'Sort by',
  },
} as const

export function realCostCopy(lang: Lang) {
  return COPY[lang]
}

export function realCostMetadata(lang: Lang): Metadata {
  const t = COPY[lang]
  const path = REAL_COST_PATH[lang]
  const description = LEAD_MAGNET[lang]
  return {
    title: t.title,
    description,
    alternates: { canonical: path, languages: alternates(REAL_COST_PATH.es, REAL_COST_PATH.en) },
    openGraph: og({
      title: `${t.title} | Arncof`,
      description,
      url: path,
      type: 'article',
      locale: lang === 'en' ? 'en_US' : 'es_AR',
      alternateLocale: lang === 'en' ? ['es_AR'] : ['en_US'],
      publishedTime: '2026-10-24',
      modifiedTime: '2026-10-24',
      authors: [PROFILE.name],
    }),
    twitter: { card: 'summary_large_image', title: `${t.title} | Arncof`, description, images: ['/og-arncof-v2.jpg'], creator: '@arncof' },
  }
}
