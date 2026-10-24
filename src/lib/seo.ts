import type { Metadata } from 'next'
import { PROFILE } from '@/data/profile'

type OpenGraph = NonNullable<Metadata['openGraph']>

// Next reemplaza el openGraph del layout cuando una ruta declara el suyo: se repiten aquí marca, idioma e imagen.
export function og(fields: OpenGraph): OpenGraph {
  return {
    siteName: PROFILE.brand,
    locale: 'es_AR',
    images: [{ url: '/og-arncof-v2.jpg', width: 1200, height: 630, alt: `${PROFILE.brand} · IA que llega al trabajo real`, type: 'image/jpeg' }],
    ...fields,
  } as OpenGraph
}

// openGraph y twitter con el mismo título y descripción de la ruta, y la tarjeta compartida nueva.
export function social(fields: { title: string; description?: string; url: string; type?: 'website' | 'article' | 'profile' }) {
  return {
    openGraph: og({ title: fields.title, description: fields.description, url: fields.url, type: fields.type ?? 'website' }),
    twitter: { card: 'summary_large_image' as const, title: fields.title, description: fields.description, images: ['/og-arncof-v2.jpg'] },
  }
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: `${PROFILE.url}${item.path}` })),
  }
}
