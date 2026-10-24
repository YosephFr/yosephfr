import { getPublicArticles } from '@/data/articles'
import { rss } from '@/lib/rss'
export const dynamic = 'force-static'
export function GET() {
  return rss({ lang: 'en', title: 'Franco · Working with agents', link: 'https://yosephfr.com/en/blog', description: 'Practical guides on AI agents, design and automation.', articles: getPublicArticles('en') })
}
