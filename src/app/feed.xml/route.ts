import { getPublicArticles } from '@/data/articles'
import { rss } from '@/lib/rss'
export const dynamic = 'force-static'
export function GET() {
  return rss({ lang: 'es', title: 'Franco · Trabajar con agentes', link: 'https://yosephfr.com/blog', description: 'Guías prácticas sobre agentes de IA, diseño y automatización.', articles: getPublicArticles('es') })
}
