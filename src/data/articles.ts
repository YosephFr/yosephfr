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

function blockWeight(block: ArticleBlock) {
  const parts = [block.text, ...(block.items ?? []), ...(block.headers ?? []), ...(block.rows ?? []).flat(), block.alt]
  const text = parts.filter((part): part is string => typeof part === 'string').join(' ').length
  if (block.type === 'image') return Math.max(text, 80)
  if (block.type === 'code') return Math.max(text, 120)
  return Math.max(text, 1)
}

// Cuántos bloques van antes del formulario: después de ~40 % del texto, sin cortar un título de su párrafo.
export function insertAfterShare(blocks: ArticleBlock[], share = 0.4) {
  if (blocks.length === 0) return 0
  const weights = blocks.map(blockWeight)
  const total = weights.reduce((sum, weight) => sum + weight, 0) || 1
  let covered = 0
  let index = blocks.length - 1
  for (let i = 0; i < blocks.length; i++) {
    covered += weights[i]
    if (covered / total >= share) {
      index = i
      break
    }
  }
  while (index < blocks.length - 1 && (blocks[index].type === 'heading' || blocks[index].type === 'subheading')) index += 1
  return index + 1
}

// Recientes y, dentro de esos, una categoría distinta cada uno.
export function getFeaturedArticles(lang: Lang = 'es', count = 4): Article[] {
  const all = getPublicArticles(lang)
  const picked: Article[] = []
  const seen = new Set<string>()
  for (const article of all) {
    if (seen.has(article.category)) continue
    seen.add(article.category)
    picked.push(article)
    if (picked.length === count) return picked
  }
  for (const article of all) {
    if (picked.some(item => item.slug === article.slug)) continue
    picked.push(article)
    if (picked.length === count) break
  }
  return picked
}
