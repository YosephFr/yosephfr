import { articlePath, type Article } from '@/data/articles'
import { PROFILE } from '@/data/profile'

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

// Un feed por idioma: /feed.xml (español) y /en/feed.xml (inglés).
export function rss({ lang, title, link, description, articles }: { lang: string; title: string; link: string; description: string; articles: Article[] }) {
  const items = articles.map(a => {
    const url = `${PROFILE.url}${articlePath(a)}`
    return `<item><title>${escape(a.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${escape(a.description)}</description><pubDate>${new Date(a.date).toUTCString()}</pubDate></item>`
  }).join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escape(title)}</title><link>${link}</link><description>${escape(description)}</description><language>${lang}</language>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } })
}
