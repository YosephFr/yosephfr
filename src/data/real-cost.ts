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
  es: 'Un correo por semana con lo que pruebo y la tabla de costo de lista ya medida: USD de lista, no lo facturado. Tres modelos, una tarea, octubre de 2026.',
  en: 'One email a week with what I test and the list-cost table already measured: list USD, not the amount billed. Three models, one task, October 2026.',
}

export const REAL_COST_OFFER: Record<Lang, { title: string; text: string; button: string }> = {
  es: {
    title: 'Qué pruebo, cada semana',
    text: 'La tabla es pública: tres costos de lista de octubre de 2026 (USD de lista, no lo facturado). El newsletter es un correo por semana con lo que pruebo. No incluye cifras que no estén en el sitio.',
    button: 'Suscribirme',
  },
  en: {
    title: 'What I test, every week',
    text: 'The table is public: three list costs from October 2026 (list USD, not the amount billed). The newsletter is one email a week with what I test. It does not include figures that are not on the site.',
    button: 'Subscribe',
  },
}

export const NEWSLETTER_CONSENT: Record<Lang, string> = {
  es: 'Te suscribes al newsletter de Yoseph Franco (vía Buttondown). Puedes darte de baja cuando quieras.',
  en: "You subscribe to Yoseph Franco's newsletter (via Buttondown). You can unsubscribe whenever you want.",
}

export const BUTTONDOWN_ACTION = 'https://buttondown.com/api/emails/embed-subscribe/yosephfr'

const COPY = {
  es: {
    title: 'Costo de lista de modelos de IA',
    headline: 'La misma tarea costó entre 1,14 y 3,10 USD de lista',
    h1: 'De 1,14 a 3,10 USD de lista',
    task: 'La tarea fue construir un juego «roadster». La consigna fue la misma y hubo una sola ejecución por modelo.',
    when: 'octubre de 2026',
    other: 'Read in English',
    methodTitle: 'Cómo se midió',
    method: 'Misma consigna, una sola ejecución, en mi cuenta, octubre de 2026. El USD es de lista, no lo facturado. Los resultados varían.',
    more: 'Hoy son tres mediciones de una sola tarea. El newsletter semanal cuenta lo que pruebo y recuerda esta tabla. No prometo mediciones que todavía no existen.',
    home: 'Inicio',
    homePath: '/',
    columns: { model: 'Modelo', time: 'Tiempo', cost: 'Costo de lista (USD)' },
    caption: 'Modelo, tiempo y costo de lista en USD. No es lo facturado.',
    sort: 'Ordenar por',
  },
  en: {
    title: 'List cost of AI models',
    headline: 'The same task cost $1.14 to $3.10 at list price',
    h1: '$1.14 to $3.10 list cost',
    task: "The task was to build a 'roadster' game. The prompt was the same, with one run per model.",
    when: 'October 2026',
    other: 'Leer en español',
    methodTitle: 'How it was measured',
    method: 'Same prompt, a single run, on my own account, October 2026. The USD figure is list cost, not the amount billed. Results vary.',
    more: 'These are three measurements of a single task. The weekly newsletter covers what I test and points back to this table. I do not promise measurements that do not exist yet.',
    home: 'Home',
    homePath: '/en',
    columns: { model: 'Model', time: 'Time', cost: 'List cost (USD)' },
    caption: 'Model, time and list cost in USD. Not the amount billed.',
    sort: 'Sort by',
  },
} as const

export function realCostCopy(lang: Lang) {
  return COPY[lang]
}

export function realCostMetadata(lang: Lang): Metadata {
  const t = COPY[lang]
  const path = REAL_COST_PATH[lang]
  const description = t.headline
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
