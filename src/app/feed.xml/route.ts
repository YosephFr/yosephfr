import { getPublicArticles } from '@/data/articles'
export const dynamic = 'force-static'
const escape = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;')
export function GET() {
  const items=getPublicArticles().map(a=>`<item><title>${escape(a.title)}</title><link>https://yosephfr.com/blog/${a.slug}</link><guid isPermaLink="true">https://yosephfr.com/blog/${a.slug}</guid><description>${escape(a.description)}</description><pubDate>${new Date(a.date).toUTCString()}</pubDate></item>`).join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Franco · Trabajar con agentes</title><link>https://yosephfr.com/blog</link><description>Guías prácticas sobre agentes de IA, diseño y automatización.</description><language>es</language>${items}</channel></rss>`,{headers:{'Content-Type':'application/rss+xml; charset=utf-8'}})
}
