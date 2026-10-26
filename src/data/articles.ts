import data from './articles.json'
import type { Lang } from '@/lib/lang'

export type ArticleBlock = {
  type: string; text?: string; items?: string[]; headers?: string[]; rows?: string[][]; lang?: string; start?: number
  src?: string; width?: number; height?: number; alt?: string; href?: string
}
export type ArticleFaq = { q: string; a: string }
export type ArticleCover = { src: string; width: number; height: number; alt: string }
export type Article = {
  slug: string; title: string; description: string; category: string;
  language: string; translation?: string; author: string; date: string; updated: string; publication: string;
  readingMinutes: number; blocks: ArticleBlock[]; faq?: ArticleFaq[]; keyword?: string; tags?: string[]
  ogTitle?: string; ogDescription?: string
  // Título del documento, sin la plantilla «| Arncof». Solo cuando el título visible se pasa de 60 caracteres.
  seoTitle?: string
  cover?: ArticleCover
  citation?: string
}

const all: Article[] = data
export const isEditorialPreview = process.env.ARNCOF_PREVIEW === '1'
export const EMPTY_SLUG = 'sin-articulos'
const visible = (a: Article) => a.publication === 'published' && Date.parse(a.date) <= Date.now()
const byDate = (a: Article, b: Article) => Date.parse(b.date) - Date.parse(a.date)

export function getPublicArticles(lang: Lang = 'es'): Article[] {
  return all.filter(a => a.language === lang && visible(a)).sort(byDate)
}
export function getArticles(lang: Lang = 'es'): Article[] {
  return isEditorialPreview ? all.filter(a => a.language === lang).sort(byDate) : getPublicArticles(lang)
}
export function getArticleSlugs(lang: Lang = 'es') {
  return all.filter(a => a.language === lang).map(article => article.slug)
}
export function getArticle(slug: string, lang: Lang = 'es') {
  return getArticles(lang).find(article => article.slug === slug)
}
// Versión del mismo artículo en el otro idioma, solo si ya es visible.
export function getTranslation(article: Article) {
  if (!article.translation) return undefined
  return getArticles(article.language === 'en' ? 'es' : 'en').find(a => a.slug === article.translation)
}
// Índice en inglés: primero los traducidos; después, los que solo existen en español.
export function getEnglishIndex() {
  const english = getArticles('en')
  const translated = new Set(english.map(a => a.translation))
  return { english, spanishOnly: getArticles('es').filter(a => !translated.has(a.slug)) }
}
export function articlePath(article: Pick<Article, 'slug' | 'language'>) {
  return article.language === 'en' ? `/en/blog/${article.slug}` : `/blog/${article.slug}`
}
export function articleDate(date: string, lang: Lang = 'es') {
  return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(date))
}
export function headingId(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}
