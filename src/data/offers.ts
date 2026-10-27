import { LEAD_MAGNET } from '@/data/real-cost'
import type { Lang } from '@/lib/lang'

export type NewsletterOffer = { title: string; text: string; button: string }

export type Cluster = 'models' | 'agents' | 'automation' | 'code' | 'security' | 'design' | 'privacy'

// Categorías publicadas en articles.json, más dos clusters que el slug deja ver
// (automatización de WhatsApp y flujo de herramientas de código).
const CATEGORY_CLUSTER: Record<string, Cluster> = {
  'Modelos de IA': 'models',
  'AI models': 'models',
  'Operación de agentes': 'agents',
  'Agent operations': 'agents',
  'Diseño con agentes': 'design',
  Seguridad: 'security',
  Security: 'security',
  Privacidad: 'privacy',
  Privacy: 'privacy',
}

const SLUG_CLUSTER: Record<string, Cluster> = {
  'whatsapp-ia-agrupar-mensajes': 'automation',
  'whatsapp-ai-message-batching': 'automation',
  'como-trabajo-programador-ia': 'code',
  'how-i-work-as-developer-with-ai': 'code',
}

const COPY: Record<Cluster, Record<Lang, NewsletterOffer>> = {
  models: {
    es: {
      title: 'Costo de lista, cada semana',
      text: 'El newsletter semanal trae lo que pruebo con modelos y la tabla ya medida: Astra 1,14 USD, Kimi 1,21 USD y Opus 3,10 USD de lista, no lo facturado. Una sola tarea, octubre de 2026.',
      button: 'Suscribirme',
    },
    en: {
      title: 'List cost, every week',
      text: 'The weekly newsletter covers what I test with models and the table already measured: Astra $1.14, Kimi $1.21 and Opus $3.10 list cost, not the amount billed. One task, October 2026.',
      button: 'Subscribe',
    },
  },
  agents: {
    es: {
      title: 'Lo que pruebo al delegar',
      text: 'Un correo por semana con lo que sale bien y mal al delegar trabajo a un agente, más la tabla de costo de lista medida (USD de lista, no lo facturado). Sin plantillas ni cifras que no estén en el sitio.',
      button: 'Suscribirme',
    },
    en: {
      title: 'What I learn when I delegate',
      text: 'One email a week on what works and what fails when I hand work to an agent, plus the measured list-cost table (list USD, not the amount billed). No templates and no figures that are not already on the site.',
      button: 'Subscribe',
    },
  },
  automation: {
    es: {
      title: 'Automatización, una vez por semana',
      text: 'El newsletter semanal cuenta lo que pruebo al automatizar un flujo y recuerda la tabla de costo de lista (USD de lista, no lo facturado). El código, si lo hay, está en el artículo.',
      button: 'Suscribirme',
    },
    en: {
      title: 'Automation, once a week',
      text: 'The weekly newsletter covers what I test when automating a workflow and points to the list-cost table (list USD, not the amount billed). The code, when there is any, stays in the article.',
      button: 'Subscribe',
    },
  },
  code: {
    es: {
      title: 'Herramientas de código, en el correo',
      text: 'Un correo por semana con la herramienta de código que probé y qué pasó, más la tabla de costo de lista medida (USD de lista, no lo facturado). No hay una guía descargable aparte.',
      button: 'Suscribirme',
    },
    en: {
      title: 'Coding tools, in the email',
      text: 'One email a week on the coding tool I tried and what happened, plus the measured list-cost table (list USD, not the amount billed). There is no separate downloadable guide.',
      button: 'Subscribe',
    },
  },
  security: {
    es: {
      title: 'Antes de dar acceso',
      text: 'Un correo por semana con lo que pruebo sobre acceso, cuentas y agentes, y la tabla de costo de lista medida (USD de lista, no lo facturado). No es una lista de verificación descargable.',
      button: 'Suscribirme',
    },
    en: {
      title: 'Before you grant access',
      text: 'One email a week on what I test around access, accounts and agents, plus the measured list-cost table (list USD, not the amount billed). It is not a downloadable checklist.',
      button: 'Subscribe',
    },
  },
  design: {
    es: {
      title: 'Diseñar con agentes',
      text: 'El newsletter semanal cuenta lo que pruebo al diseñar con agentes y recuerda la tabla de costo de lista medida (USD de lista, no lo facturado). No hay una guía descargable aparte.',
      button: 'Suscribirme',
    },
    en: {
      title: 'Designing with agents',
      text: 'The weekly newsletter covers what I test when designing with agents, plus the measured list-cost table (list USD, not the amount billed). There is no separate downloadable guide.',
      button: 'Subscribe',
    },
  },
  privacy: {
    es: {
      title: 'Qué está probado',
      text: 'Un correo por semana con lo que pruebo y la tabla de costo de lista medida (USD de lista, no lo facturado). Lo que en el artículo sigue siendo rumor no se vuelve un dato en el correo.',
      button: 'Suscribirme',
    },
    en: {
      title: 'What is actually proven',
      text: 'One email a week with what I test and the measured list-cost table (list USD, not the amount billed). What the article still calls a rumor does not become a fact in the email.',
      button: 'Subscribe',
    },
  },
}

export function clusterFor(article: { category?: string; slug?: string }): Cluster | undefined {
  if (article.slug && SLUG_CLUSTER[article.slug]) return SLUG_CLUSTER[article.slug]
  if (article.category && CATEGORY_CLUSTER[article.category]) return CATEGORY_CLUSTER[article.category]
  return undefined
}

export function defaultOffer(lang: Lang): NewsletterOffer {
  return {
    title: lang === 'en' ? 'The weekly newsletter' : 'El newsletter semanal',
    text: LEAD_MAGNET[lang],
    button: lang === 'en' ? 'Subscribe' : 'Suscribirme',
  }
}

export function offerForArticle(article: { category?: string; slug?: string }, lang: Lang): NewsletterOffer {
  const cluster = clusterFor(article)
  return cluster ? COPY[cluster][lang] : defaultOffer(lang)
}
