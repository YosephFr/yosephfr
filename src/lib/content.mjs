import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"
import { Marked } from "marked"
import sanitizeHtml from "sanitize-html"

const ROOT = process.cwd()
const CONTENT_DIR = path.join(ROOT, "content", "blog")
const PUBLIC_DIR = path.join(ROOT, "public")

export const PAGE_SIZE = 10

export const site = {
  url: "https://yosephfr.com",
  name: "Yoseph Franco",
  siteTitle: "Yoseph Franco | AI & agents in production",
  jobTitle: "Tech Lead",
  personId: "https://yosephfr.com/#person",
  email: "contacto@yosephfr.com",
  twitter: "@Arncof",
  positioning: {
    es: "AI & agents in production · Conversational AI, CRM & end-to-end business automation · 14k+ conversations/month",
    en: "AI & agents in production · Conversational AI, CRM & end-to-end business automation · 14k+ conversations/month",
  },
  summary: {
    es: "Lidero tecnología y desarrollo: agentes de IA en producción, plataformas SaaS y automatización, de punta a punta: diseño, código, infraestructura y deploy.",
    en: "I lead technology and development: AI agents in production, SaaS platforms, and automation, end to end: design, code, infrastructure, and deploy.",
  },
  sameAs: [
    "https://www.linkedin.com/in/yosephfr/",
    "https://github.com/YosephFr",
    "https://x.com/Arncof",
    "https://www.instagram.com/yosephfranco/",
    "https://www.tiktok.com/@arncof",
  ],
}

const RESERVED_SLUGS = new Set(["page", "tag", "feed", "rss", "og"])

const STATIC_PATHS = [
  "/",
  "/contacto",
  "/blog",
  "/en/blog",
  "/click",
  "/memory",
  "/snake",
  "/typing",
  "/secreto",
  "/credits",
  "/achievements",
]

let cache = null

export function slugify(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function isIsoDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function uniqueSlug(text, seen) {
  const base = slugify(text) || "seccion"
  const count = seen.get(base) ?? 0
  seen.set(base, count + 1)
  return count === 0 ? base : `${base}-${count}`
}

export function renderMarkdown(markdown) {
  const toc = []
  const seen = new Map()
  const marked = new Marked({ gfm: true })
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens)
        const plain = decodeEntities(text.replace(/<[^>]+>/g, "")).trim()
        const id = uniqueSlug(plain, seen)
        if (depth === 2 || depth === 3) toc.push({ depth, id, text: plain })
        return `<h${depth} id="${id}">${text}</h${depth}>\n`
      },
    },
  })

  const raw = String(marked.parse(markdown))
  const html = sanitizeHtml(raw, {
    allowedTags: [
      "h2",
      "h3",
      "h4",
      "p",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "strong",
      "em",
      "hr",
      "br",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td",
      "img",
      "del",
    ],
    allowedAttributes: {
      a: ["href", "rel", "target"],
      img: ["src", "alt", "title"],
      h2: ["id"],
      h3: ["id"],
      h4: ["id"],
      code: ["class"],
      th: ["align"],
      td: ["align"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href || ""
        if (/^https?:\/\//i.test(href)) {
          attribs.target = "_blank"
          attribs.rel = "noopener noreferrer"
        }
        return { tagName, attribs }
      },
    },
  })

  return { html, toc }
}

function wordCountOf(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`\n]+`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~-]/g, " ")
  return plain.split(/\s+/).filter(Boolean).length
}

function listPostFiles() {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((name) => name.endsWith(".md") || name.endsWith(".mdx"))
    .filter((name) => !name.startsWith("_"))
    .sort()
    .map((name) => path.join(CONTENT_DIR, name))
}

function pushError(errors, file, message) {
  errors.push({ file: path.relative(ROOT, file), message })
}

function readOne(file, errors) {
  const raw = fs.readFileSync(file, "utf8")
  const parsed = matter(raw)
  const data = parsed.data ?? {}
  const body = parsed.content ?? ""
  const slug = path.basename(file, path.extname(file))
  let ok = true

  const fail = (message) => {
    ok = false
    pushError(errors, file, message)
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fail(`slug "${slug}" must be lowercase words separated by hyphens`)
  }
  if (RESERVED_SLUGS.has(slug)) fail(`slug "${slug}" is reserved`)

  if (typeof data.title !== "string" || !data.title.trim()) fail("title is required")
  else if (data.title.trim().length > 60) fail(`title is ${data.title.trim().length} chars; maximum is 60`)

  if (typeof data.description !== "string" || !data.description.trim()) fail("description is required")
  else {
    const length = data.description.trim().length
    if (length < 120 || length > 160) fail(`description is ${length} chars; expected 120–160`)
  }

  if (!isIsoDate(data.date)) fail("date must be a quoted YYYY-MM-DD string")
  if (!isIsoDate(data.updated)) fail("updated must be a quoted YYYY-MM-DD string")
  if (isIsoDate(data.date) && isIsoDate(data.updated) && data.updated < data.date) {
    fail("updated is earlier than date")
  }

  if (data.lang !== "es" && data.lang !== "en") fail("lang must be es or en")
  if (typeof data.draft !== "boolean") fail("draft must be a boolean")

  if (!Array.isArray(data.tags)) fail("tags must be an array of strings")
  else {
    const seen = new Set()
    for (const tag of data.tags) {
      if (typeof tag !== "string" || !tag.trim()) fail("every tag must be a non-empty string")
      else if (seen.has(tag.trim().toLowerCase())) fail(`duplicate tag "${tag}"`)
      else seen.add(tag.trim().toLowerCase())
      if (typeof tag === "string" && !slugify(tag)) fail(`tag "${tag}" cannot be turned into a URL`)
    }
  }

  if (data.faq != null) {
    if (!Array.isArray(data.faq)) fail("faq must be an array of { q, a }")
    else {
      data.faq.forEach((item, index) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          fail(`faq[${index}] must be an object with q and a`)
          return
        }
        if (typeof item.q !== "string" || !item.q.trim()) fail(`faq[${index}].q must be a non-empty string`)
        if (typeof item.a !== "string" || !item.a.trim()) fail(`faq[${index}].a must be a non-empty string`)
        const keys = Object.keys(item)
        if (keys.some((key) => key !== "q" && key !== "a")) {
          fail(`faq[${index}] only allows q and a`)
        }
      })
    }
  }

  if (data.canonical != null) {
    if (typeof data.canonical !== "string" || !/^https:\/\/\S+$/.test(data.canonical)) {
      fail("canonical must be an absolute https URL")
    }
  }

  if (data.cover != null) {
    if (typeof data.cover !== "string" || !data.cover.trim()) fail("cover must be a path or https URL")
    else if (data.cover.startsWith("/")) {
      const coverPath = path.join(PUBLIC_DIR, data.cover)
      if (!fs.existsSync(coverPath)) fail(`cover file not found: ${data.cover}`)
    } else if (!/^https:\/\/\S+$/.test(data.cover)) {
      fail("cover must start with / or https://")
    }
  }

  if (data.translation != null && (typeof data.translation !== "string" || !data.translation.trim())) {
    fail("translation must be a slug")
  }

  if (/^(import|export)\s/m.test(body)) {
    fail("posts are Markdown; import/export is not rendered")
  }

  if (!ok) return null

  const tags = data.tags.map((tag) => tag.trim())
  const lang = data.lang
  const postPath = lang === "en" ? `/en/blog/${slug}` : `/blog/${slug}`
  let html = ""
  let toc = []
  try {
    const rendered = renderMarkdown(body)
    html = rendered.html
    toc = rendered.toc
  } catch (error) {
    fail(`markdown failed to render: ${error instanceof Error ? error.message : "unknown error"}`)
    return null
  }

  const words = wordCountOf(body)

  return {
    file: path.relative(ROOT, file),
    slug,
    title: data.title.trim(),
    description: data.description.trim(),
    date: data.date,
    updated: data.updated,
    lang,
    tags,
    tagSlugs: tags.map((tag) => slugify(tag)),
    cover: data.cover ?? null,
    faq: (data.faq ?? []).map((item) => ({ q: item.q.trim(), a: item.a.trim() })),
    canonical: data.canonical ?? null,
    draft: data.draft,
    translation: data.translation ? String(data.translation).trim() : null,
    body,
    html,
    toc,
    wordCount: words,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    path: postPath,
    url: `${site.url}${postPath}`,
    ogImage: `/blog/og/${slug}.png`,
  }
}

export function loadPosts() {
  const errors = []
  const posts = []
  const seen = new Map()

  for (const file of listPostFiles()) {
    const post = readOne(file, errors)
    if (!post) continue
    if (seen.has(post.slug)) {
      pushError(errors, file, `duplicate slug "${post.slug}" (also ${seen.get(post.slug)})`)
      continue
    }
    seen.set(post.slug, post.file)
    posts.push(post)
  }

  for (const post of posts) {
    if (!post.translation) continue
    const other = posts.find((candidate) => candidate.slug === post.translation)
    if (!other) {
      errors.push({ file: post.file, message: `translation "${post.translation}" does not exist` })
      continue
    }
    if (other.lang === post.lang) {
      errors.push({ file: post.file, message: "translation must use the other language" })
    }
    if (other.translation !== post.slug) {
      errors.push({ file: post.file, message: `translation must be reciprocal (${other.slug} does not point back)` })
    }
  }

  posts.sort((a, b) => b.date.localeCompare(a.date) || b.updated.localeCompare(a.updated) || a.slug.localeCompare(b.slug))
  return { posts, errors }
}

export function getAllPosts() {
  if (cache) return cache
  const { posts, errors } = loadPosts()
  if (errors.length) {
    throw new Error(errors.map((error) => `${error.file}: ${error.message}`).join("\n"))
  }
  cache = posts
  return posts
}

export function getPublishedPosts(lang) {
  const posts = getAllPosts().filter((post) => !post.draft)
  if (!lang) return posts
  return posts.filter((post) => post.lang === lang)
}

export function getPost(slug, lang) {
  return getPublishedPosts(lang).find((post) => post.slug === slug) ?? null
}

export function getTranslation(post) {
  if (!post?.translation) return null
  const other = getAllPosts().find((candidate) => candidate.slug === post.translation && !candidate.draft)
  if (!other || other.lang === post.lang) return null
  return other
}

export function getTags(lang) {
  const map = new Map()
  for (const post of getPublishedPosts(lang)) {
    post.tags.forEach((label, index) => {
      const slug = post.tagSlugs[index]
      const current = map.get(slug) ?? { slug, label, count: 0, lastmod: post.updated }
      current.count += 1
      if (post.updated > current.lastmod) current.lastmod = post.updated
      map.set(slug, current)
    })
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, lang))
}

export function getRelated(post, limit = 3) {
  return getPublishedPosts(post.lang)
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: candidate.tagSlugs.filter((tag) => post.tagSlugs.includes(tag)).length,
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((item) => item.post)
}

export function paginate(items, page) {
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const current = Number(page) || 1
  const start = (current - 1) * PAGE_SIZE
  return {
    items: items.slice(start, start + PAGE_SIZE),
    totalPages,
    page: current,
    total: items.length,
  }
}

export function indexPath(lang, page = 1) {
  const base = lang === "en" ? "/en/blog" : "/blog"
  return page <= 1 ? base : `${base}/page/${page}`
}

export function tagPath(lang, tagSlug, page = 1) {
  const base = `${lang === "en" ? "/en/blog" : "/blog"}/tag/${tagSlug}`
  return page <= 1 ? base : `${base}/page/${page}`
}

function withFallback(params, fallback) {
  return params.length > 0 ? params : [fallback]
}

export function pageStaticParams(lang) {
  const totalPages = Math.ceil(getPublishedPosts(lang).length / PAGE_SIZE)
  const params = []
  for (let page = 2; page <= totalPages; page += 1) params.push({ page: String(page) })
  // `output: "export"` rejects a dynamic route that prerenders zero paths.
  return withFallback(params, { page: "0" })
}

export function tagStaticParams(lang) {
  return withFallback(
    getTags(lang).map((tag) => ({ tag: tag.slug })),
    { tag: "_" },
  )
}

export function tagPageStaticParams(lang) {
  const params = []
  for (const tag of getTags(lang)) {
    const count = getPublishedPosts(lang).filter((post) => post.tagSlugs.includes(tag.slug)).length
    const totalPages = Math.ceil(count / PAGE_SIZE)
    for (let page = 2; page <= totalPages; page += 1) {
      params.push({ tag: tag.slug, page: String(page) })
    }
  }
  return withFallback(params, { tag: "_", page: "0" })
}

export function postStaticParams(lang) {
  return withFallback(
    getPublishedPosts(lang).map((post) => ({ slug: post.slug })),
    { slug: "_" },
  )
}

function slugsIn(relativeFile) {
  const source = fs.readFileSync(path.join(ROOT, relativeFile), "utf8")
  return [...source.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1])
}

function mtime(relativeFile) {
  return fs.statSync(path.join(ROOT, relativeFile)).mtime.toISOString()
}

function newest(dates, fallback) {
  if (!dates.length) return fallback
  return dates.slice().sort().at(-1)
}

export function getSitemapEntries() {
  const posts = getPublishedPosts()
  const entries = []

  entries.push({
    loc: site.url,
    lastModified: mtime("src/app/(site)/page.tsx"),
    changeFrequency: "weekly",
    priority: 1,
  })

  for (const lang of ["es", "en"]) {
    const localized = posts.filter((post) => post.lang === lang)
    const base = indexPath(lang)
    entries.push({
      loc: `${site.url}${base}`,
      lastModified: newest(localized.map((post) => post.updated), mtime(lang === "en" ? "src/app/en/blog/page.tsx" : "src/app/blog/page.tsx")),
      changeFrequency: "daily",
      priority: lang === "es" ? 0.9 : 0.6,
    })

    const totalPages = Math.ceil(localized.length / PAGE_SIZE)
    for (let page = 2; page <= totalPages; page += 1) {
      const slice = localized.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
      entries.push({
        loc: `${site.url}${indexPath(lang, page)}`,
        lastModified: newest(slice.map((post) => post.updated), localized[0]?.updated ?? new Date(0).toISOString()),
        changeFrequency: "daily",
        priority: 0.4,
      })
    }

    for (const tag of getTags(lang)) {
      const tagged = localized.filter((post) => post.tagSlugs.includes(tag.slug))
      entries.push({
        loc: `${site.url}${tagPath(lang, tag.slug)}`,
        lastModified: tag.lastmod,
        changeFrequency: "weekly",
        priority: 0.5,
      })
      const tagPages = Math.ceil(tagged.length / PAGE_SIZE)
      for (let page = 2; page <= tagPages; page += 1) {
        const slice = tagged.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        entries.push({
          loc: `${site.url}${tagPath(lang, tag.slug, page)}`,
          lastModified: newest(slice.map((post) => post.updated), tag.lastmod),
          changeFrequency: "weekly",
          priority: 0.3,
        })
      }
    }
  }

  for (const post of posts) {
    const translation = getTranslation(post)
    const entry = {
      loc: post.url,
      lastModified: post.updated,
      changeFrequency: "monthly",
      priority: 0.8,
    }
    if (translation) {
      const es = post.lang === "es" ? post.url : translation.url
      const en = post.lang === "en" ? post.url : translation.url
      entry.languages = { es, en, "x-default": es }
    }
    entries.push(entry)
  }

  const experienceMtime = mtime("src/data/experience.ts")
  for (const slug of slugsIn("src/data/experience.ts")) {
    entries.push({
      loc: `${site.url}/experiencia/${slug}`,
      lastModified: experienceMtime,
      changeFrequency: "monthly",
      priority: slug === "ai-engineering" ? 0.8 : 0.7,
    })
  }

  const skillMtime = mtime("src/data/skills.ts")
  for (const slug of slugsIn("src/data/skills.ts")) {
    entries.push({
      loc: `${site.url}/skills/${slug}`,
      lastModified: skillMtime,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  }

  return entries
}

function stripCode(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "")
}

function collectHrefs(markdown) {
  const source = stripCode(markdown)
  const hrefs = []
  const pattern = /\[(?:\\.|[^\]])*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g
  for (const match of source.matchAll(pattern)) hrefs.push(match[1])
  for (const match of source.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)) hrefs.push(match[1])
  return hrefs
}

function dataSlugs(prefix) {
  const file = prefix === "/experiencia/" ? "src/data/experience.ts" : "src/data/skills.ts"
  return slugsIn(file).map((slug) => `${prefix}${slug}`)
}

export function findBrokenLinks(posts) {
  const errors = []
  const published = new Set(posts.filter((post) => !post.draft).map((post) => post.path))
  const drafts = new Set(posts.filter((post) => post.draft).map((post) => post.path))
  const routes = new Set(STATIC_PATHS)
  for (const route of dataSlugs("/experiencia/")) routes.add(route)
  for (const route of dataSlugs("/skills/")) routes.add(route)

  for (const lang of ["es", "en"]) {
    const localized = posts.filter((post) => post.lang === lang && !post.draft)
    const pages = Math.ceil(localized.length / PAGE_SIZE)
    for (let page = 2; page <= pages; page += 1) routes.add(indexPath(lang, page))
    const counts = new Map()
    for (const post of localized) {
      for (const tag of post.tagSlugs) counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
    for (const [tag, count] of counts) {
      routes.add(tagPath(lang, tag))
      const tagPages = Math.ceil(count / PAGE_SIZE)
      for (let page = 2; page <= tagPages; page += 1) routes.add(tagPath(lang, tag, page))
    }
  }

  const byPath = new Map(posts.map((post) => [post.path, post]))

  for (const post of posts) {
    for (const href of collectHrefs(post.body)) {
      if (!href || href.startsWith("mailto:") || /^https?:\/\//i.test(href)) continue
      if (href.startsWith("#")) {
        const id = href.slice(1)
        if (!post.toc.some((item) => item.id === id) && !post.faq.some((_, index) => id === `faq-${index}` || id === "faq")) {
          errors.push({ file: post.file, message: `missing heading for ${href}` })
        }
        continue
      }
      if (!href.startsWith("/")) {
        errors.push({ file: post.file, message: `internal link must be root-relative: ${href}` })
        continue
      }

      const [beforeHash, hash] = href.split("#")
      const pathname = beforeHash.split("?")[0].replace(/\/+$/, "") || "/"
      const publicFile = path.join(PUBLIC_DIR, pathname)
      const exists =
        routes.has(pathname) ||
        published.has(pathname) ||
        (post.draft && drafts.has(pathname)) ||
        (pathname !== "/" && fs.existsSync(publicFile) && fs.statSync(publicFile).isFile())

      if (!exists) {
        errors.push({ file: post.file, message: `broken internal link ${href}` })
        continue
      }

      if (hash) {
        const target = byPath.get(pathname)
        if (target && !target.toc.some((item) => item.id === hash) && hash !== "faq") {
          errors.push({ file: post.file, message: `missing heading #${hash} on ${pathname}` })
        }
      }
    }
  }

  return errors
}
