import type { Metadata } from 'next'
import { PROFILE } from '@/data/profile'

type OpenGraph = NonNullable<Metadata['openGraph']>

const OG_IMAGE = '/og-arncof-v2.jpg'

// Next reemplaza el openGraph del layout cuando una ruta declara el suyo: se repiten aquí marca, idioma e imagen.
export function og(fields: OpenGraph): OpenGraph {
  return {
    siteName: PROFILE.brand,
    locale: 'es_AR',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${PROFILE.brand} · IA que llega al trabajo real`, type: 'image/jpeg' }],
    ...fields,
  } as OpenGraph
}

// openGraph y twitter con el mismo título y descripción de la ruta, y la tarjeta compartida.
export function social(fields: { title: string; description?: string; url: string; type?: 'website' | 'article' | 'profile'; image?: string }) {
  const image = fields.image ?? OG_IMAGE
  return {
    openGraph: og({ title: fields.title, description: fields.description, url: fields.url, type: fields.type ?? 'website', images: [{ url: image, width: 1200, height: 630, alt: fields.title }] }),
    twitter: { card: 'summary_large_image' as const, title: fields.title, description: fields.description, images: [image], creator: '@arncof' },
  }
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${PROFILE.url}${item.path}` })),
  }
}

export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

// Persona única del sitio. mainEntity de ProfilePage tiene que traer @type y name
// en el mismo objeto: Search Console marcó la portada como inválida cuando mainEntity
// era solo un @id hacia otro <script>.
export function personNode() {
  return {
    '@type': 'Person',
    '@id': `${PROFILE.url}/#person`,
    name: PROFILE.name,
    alternateName: PROFILE.brand,
    url: PROFILE.url,
    email: PROFILE.email,
    jobTitle: 'AI Engineer',
    description: PROFILE.description,
    image: {
      '@type': 'ImageObject',
      url: `${PROFILE.url}${PROFILE.photo}`,
      width: PROFILE.photoWidth,
      height: PROFILE.photoHeight,
      caption: PROFILE.photoAlt,
    },
    sameAs: PROFILE.socials.map(s => s.href),
    knowsAbout: ['Agentes de IA', 'MCP', 'Orquestación de agentes', 'Desarrollo de software', 'Automatización', 'Diseño de interfaces', 'Infraestructura cloud'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'general', email: PROFILE.email, url: `${PROFILE.url}/contacto`, availableLanguage: ['es', 'en'] },
  }
}

export function profilePage(fields: { id: string; url: string; name: string; inLanguage: string; hasPart?: unknown[] }) {
  return {
    '@type': 'ProfilePage',
    '@id': fields.id,
    url: fields.url,
    name: fields.name,
    inLanguage: fields.inLanguage,
    dateModified: PROFILE.updated,
    isPartOf: { '@id': `${PROFILE.url}/#website` },
    mainEntity: personNode(),
    ...(fields.hasPart?.length ? { hasPart: fields.hasPart } : {}),
  }
}
