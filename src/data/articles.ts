import data from './articles.json'

export type ArticleBlock = { type: string; text?: string; items?: string[] }
export type Article = {
  slug: string; title: string; description: string; category: string;
  language: string; author: string; date: string; updated: string; publication: string;
  readingMinutes: number; blocks: ArticleBlock[]
}

export const isEditorialPreview = process.env.ARNCOF_PREVIEW === '1'
export function getPublicArticles(): Article[] {
  return data.filter(a => a.publication === 'published' && Date.parse(a.date) <= Date.now()).sort((a,b) => Date.parse(b.date)-Date.parse(a.date))
}
export function getArticles(): Article[] {
  return isEditorialPreview ? data : getPublicArticles()
}
export function getArticleSlugs() {
  return data.map(article => article.slug)
}
export function getArticle(slug: string) {
  return getArticles().find(article => article.slug === slug)
}
export function articleDate(date: string) {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(date))
}
export function headingId(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
