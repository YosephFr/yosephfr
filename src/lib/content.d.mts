export interface FaqItem {
  q: string
  a: string
}

export interface TocItem {
  depth: 2 | 3
  id: string
  text: string
}

export type Lang = "es" | "en"

export interface Post {
  file: string
  slug: string
  title: string
  description: string
  date: string
  updated: string
  lang: Lang
  tags: string[]
  tagSlugs: string[]
  cover: string | null
  faq: FaqItem[]
  canonical: string | null
  draft: boolean
  translation: string | null
  body: string
  html: string
  toc: TocItem[]
  wordCount: number
  readingMinutes: number
  path: string
  url: string
  ogImage: string
}

export interface TagInfo {
  slug: string
  label: string
  count: number
  lastmod: string
}

export interface SitemapEntry {
  loc: string
  lastModified: string
  changeFrequency: "daily" | "weekly" | "monthly"
  priority: number
  languages?: Record<string, string>
}

export interface BlogError {
  file: string
  message: string
}

export const PAGE_SIZE: number

export const site: {
  url: string
  name: string
  siteTitle: string
  jobTitle: string
  personId: string
  email: string
  twitter: string
  positioning: { es: string; en: string }
  summary: { es: string; en: string }
  sameAs: string[]
}

export function slugify(value: string): string
export function renderMarkdown(markdown: string): { html: string; toc: TocItem[] }
export function loadPosts(): { posts: Post[]; errors: BlogError[] }
export function getAllPosts(): Post[]
export function getPublishedPosts(lang?: Lang): Post[]
export function getPost(slug: string, lang: Lang): Post | null
export function getTranslation(post: Post): Post | null
export function getTags(lang: Lang): TagInfo[]
export function getRelated(post: Post, limit?: number): Post[]
export function paginate<T>(items: T[], page: number): {
  items: T[]
  totalPages: number
  page: number
  total: number
}
export function indexPath(lang: Lang, page?: number): string
export function tagPath(lang: Lang, tagSlug: string, page?: number): string
export function pageStaticParams(lang: Lang): { page: string }[]
export function tagStaticParams(lang: Lang): { tag: string }[]
export function tagPageStaticParams(lang: Lang): { tag: string; page: string }[]
export function postStaticParams(lang: Lang): { slug: string }[]
export function getSitemapEntries(): SitemapEntry[]
export function findBrokenLinks(posts: Post[]): BlogError[]
