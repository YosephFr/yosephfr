import { clusterFor, type Cluster } from '@/data/offers'
import type { ArticleFaq } from '@/data/articles'
import type { Lang } from '@/lib/lang'

const EXTRA: Record<Cluster, Record<Lang, ArticleFaq>> = {
  models: {
    es: {
      q: '¿Esos USD son lo que se facturó en la cuenta?',
      a: 'No. La tabla de costo de lista (octubre de 2026, una sola tarea) publica USD de lista: Astra 1,14, Kimi 1,21 y Opus 3,10. No es el importe facturado.',
    },
    en: {
      q: 'Are those USD figures what the account was billed?',
      a: 'No. The list-cost table (October 2026, one task) shows list USD: Astra 1.14, Kimi 1.21 and Opus 3.10. It is not the amount billed.',
    },
  },
  agents: {
    es: {
      q: '¿El newsletter incluye una plantilla de entrega?',
      a: 'No. Es un correo por semana con lo que se prueba y la tabla de costo de lista ya medida (USD de lista, no lo facturado). No hay un archivo descargable.',
    },
    en: {
      q: 'Does the newsletter include a delivery template?',
      a: 'No. It is one email a week with what I test and the list-cost table already measured (list USD, not the amount billed). There is no downloadable file.',
    },
  },
  automation: {
    es: {
      q: '¿El correo trae el código de la automatización?',
      a: 'No. El artículo está en el sitio. El newsletter semanal cuenta lo que se prueba y recuerda la tabla de costo de lista (USD de lista, no lo facturado).',
    },
    en: {
      q: 'Does the email include the automation code?',
      a: 'No. The article is on the site. The weekly newsletter covers what I test and points to the list-cost table (list USD, not the amount billed).',
    },
  },
  code: {
    es: {
      q: '¿Hay una guía descargable del flujo de trabajo?',
      a: 'No. Lo publicado es el artículo. El newsletter es semanal: lo que se prueba y la tabla de costo de lista (USD de lista, no lo facturado).',
    },
    en: {
      q: 'Is there a downloadable guide to the workflow?',
      a: 'No. What is published is the article. The newsletter is weekly: what I test and the list-cost table (list USD, not the amount billed).',
    },
  },
  security: {
    es: {
      q: '¿Esta página pide la contraseña o el número de tarjeta?',
      a: 'No. El único formulario pide un correo para el newsletter semanal y lo envía a Buttondown. No pide contraseñas ni tarjetas.',
    },
    en: {
      q: 'Does this page ask for a password or a card number?',
      a: 'No. The only form asks for an email for the weekly newsletter and sends it to Buttondown. It does not ask for passwords or card numbers.',
    },
  },
  design: {
    es: {
      q: '¿El newsletter trae una guía aparte para rediseñar?',
      a: 'No. Es un correo por semana con lo que se prueba al diseñar con agentes, y la tabla de costo de lista medida (USD de lista, no lo facturado).',
    },
    en: {
      q: 'Does the newsletter include a separate redesign guide?',
      a: 'No. It is one email a week on what I test when designing with agents, plus the measured list-cost table (list USD, not the amount billed).',
    },
  },
  privacy: {
    es: {
      q: '¿El newsletter publica datos que no están en el artículo?',
      a: 'No. Cuenta lo que se prueba y recuerda la tabla de costo de lista (USD de lista, no lo facturado). Lo que sigue siendo rumor en el artículo sigue siendo rumor.',
    },
    en: {
      q: 'Does the newsletter add facts that are not in the article?',
      a: 'No. It covers what I test and points to the list-cost table (list USD, not the amount billed). What the article still calls a rumor stays a rumor.',
    },
  },
}

export function extraFaqFor(article: { category?: string; slug?: string }, lang: Lang): ArticleFaq[] {
  const cluster = clusterFor(article)
  return cluster ? [EXTRA[cluster][lang]] : []
}
