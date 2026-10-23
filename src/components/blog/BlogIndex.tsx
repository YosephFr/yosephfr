import { notFound } from "next/navigation"
import {
  getPublishedPosts,
  getTags,
  indexPath,
  paginate,
  site,
  tagPath,
  type Lang,
} from "@/lib/content.mjs"

function formatDate(value: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function pageHref(lang: Lang, page: number, tagSlug?: string) {
  return tagSlug ? tagPath(lang, tagSlug, page) : indexPath(lang, page)
}

const copy = {
  es: {
    kicker: "Blog",
    title: "Notas desde producción",
    empty: "Todavía no hay notas en español.",
    all: "Todas",
    read: "Leer",
    minutes: "min de lectura",
    prev: "Anterior",
    next: "Siguiente",
    page: "Página",
    home: "Inicio",
    blog: "Blog",
  },
  en: {
    kicker: "Blog",
    title: "Notes from production",
    empty: "No English notes yet.",
    all: "All",
    read: "Read",
    minutes: "min read",
    prev: "Previous",
    next: "Next",
    page: "Page",
    home: "Home",
    blog: "Blog",
  },
} as const

export default function BlogIndex({
  lang,
  page,
  tagSlug,
}: {
  lang: Lang
  page: number
  tagSlug?: string
}) {
  const text = copy[lang]
  const tags = getTags(lang)
  const tag = tagSlug ? tags.find((item) => item.slug === tagSlug) : undefined
  if (tagSlug === "_" || page === 0) {
    return (
      <main className="max-w-[680px] mx-auto px-4 py-16">
        <p className="text-base text-text-secondary">
          {lang === "en" ? "No English notes yet." : "No hay más páginas."}{" "}
          <a href={indexPath(lang === "en" ? "es" : lang)} className="text-accent underline">
            Blog
          </a>
        </p>
      </main>
    )
  }

  if (tagSlug && !tag) notFound()

  const source = tag
    ? getPublishedPosts(lang).filter((post) => post.tagSlugs.includes(tag.slug))
    : getPublishedPosts(lang)

  if (page < 1 || (source.length > 0 && page > Math.ceil(source.length / 10)) || (source.length === 0 && page > 1)) {
    notFound()
  }

  const { items, totalPages } = paginate(source, page)
  const featured = page === 1 ? items[0] : undefined
  const rest = featured ? items.slice(1) : items
  const crumbs = [
    { name: text.home, path: "/" },
    { name: text.blog, path: indexPath(lang) },
    ...(tag ? [{ name: tag.label, path: tagPath(lang, tag.slug) }] : []),
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${site.url}${indexPath(lang)}#blog`,
    name: text.title,
    url: `${site.url}${indexPath(lang)}`,
    inLanguage: lang,
    description: site.positioning[lang],
    author: { "@id": site.personId },
    blogPost: items.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: post.url,
      datePublished: post.date,
      dateModified: post.updated,
      inLanguage: post.lang,
    })),
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${site.url}${crumb.path === "/" ? "" : crumb.path}` || site.url,
    })),
  }

  const prev = page > 1 ? pageHref(lang, page - 1, tag?.slug) : null
  const next = page < totalPages ? pageHref(lang, page + 1, tag?.slug) : null

  return (
    <main className="max-w-[680px] mx-auto px-4 py-10">
      {prev ? <link rel="prev" href={prev} /> : null}
      {next ? <link rel="next" href={next} /> : null}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="text-sm text-text-muted mb-6">
        <ol className="flex flex-wrap gap-x-2 gap-y-1">
          {crumbs.map((crumb, index) => (
            <li key={crumb.path} className="inline-flex items-center gap-2 min-h-12">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              <a href={crumb.path} className="text-text-secondary">
                {crumb.name}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <p className="text-sm text-text-secondary mb-2">{text.kicker}</p>
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
        {tag ? tag.label : text.title}
      </h1>
      <p className="text-base text-text-secondary leading-relaxed mt-3">{site.positioning[lang]}</p>

      {tags.length > 0 ? (
        <nav aria-label={lang === "en" ? "Tags" : "Temas"} className="flex flex-wrap gap-2 mt-6">
          <a
            href={indexPath(lang)}
            aria-current={tag ? undefined : "page"}
            className={`inline-flex items-center min-h-12 px-4 rounded-full border text-sm ${
              tag ? "border-surface-border text-text-secondary" : "border-accent text-text-primary"
            }`}
          >
            {text.all}
          </a>
          {tags.map((item) => (
            <a
              key={item.slug}
              href={tagPath(lang, item.slug)}
              aria-current={item.slug === tag?.slug ? "page" : undefined}
              className={`inline-flex items-center min-h-12 px-4 rounded-full border text-sm ${
                item.slug === tag?.slug ? "border-accent text-text-primary" : "border-surface-border text-text-secondary"
              }`}
            >
              {item.label}
              <span className="ml-2 text-text-muted">{item.count}</span>
            </a>
          ))}
        </nav>
      ) : null}

      {source.length === 0 ? (
        <p className="mt-10 text-base text-text-secondary">
          {text.empty}{" "}
          {lang === "en" ? (
            <a href="/blog" className="text-accent underline">
              {copy.es.title}
            </a>
          ) : null}
        </p>
      ) : null}

      {featured ? (
        <article className="mt-8 bg-surface-raised border border-surface-border rounded-3xl p-6 md:p-8">
          <p className="text-sm text-text-muted">
            <time dateTime={featured.date}>{formatDate(featured.date, lang)}</time>
            <span aria-hidden="true"> · </span>
            {featured.readingMinutes} {text.minutes}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-text-primary mt-3" style={{ fontFamily: "var(--font-heading)" }}>
            <a href={featured.path}>{featured.title}</a>
          </h2>
          <p className="text-base text-text-secondary leading-relaxed mt-3">{featured.description}</p>
          <a href={featured.path} className="inline-flex items-center min-h-12 mt-4 text-sm font-medium text-accent">
            {text.read}
          </a>
        </article>
      ) : null}

      {rest.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {rest.map((post) => (
            <li key={post.slug}>
              <article className="bg-surface-raised border border-surface-border rounded-2xl p-5">
                <p className="text-sm text-text-muted">
                  <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  <span aria-hidden="true"> · </span>
                  {post.readingMinutes} {text.minutes}
                </p>
                <h2 className="text-lg font-medium text-text-primary mt-2">
                  <a href={post.path} className="inline-flex items-center min-h-12">
                    {post.title}
                  </a>
                </h2>
                <p className="text-base text-text-secondary leading-relaxed">{post.description}</p>
              </article>
            </li>
          ))}
        </ul>
      ) : null}

      {totalPages > 1 ? (
        <nav aria-label={text.page} className="flex flex-wrap items-center gap-2 mt-8">
          {prev ? (
            <a href={prev} className="inline-flex items-center min-h-12 px-4 rounded-full border border-surface-border text-sm">
              {text.prev}
            </a>
          ) : null}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <a
              key={number}
              href={pageHref(lang, number, tag?.slug)}
              aria-current={number === page ? "page" : undefined}
              className={`inline-flex items-center justify-center min-h-12 min-w-12 rounded-full border text-sm ${
                number === page ? "border-accent text-text-primary" : "border-surface-border text-text-secondary"
              }`}
            >
              {number}
            </a>
          ))}
          {next ? (
            <a href={next} className="inline-flex items-center min-h-12 px-4 rounded-full border border-surface-border text-sm">
              {text.next}
            </a>
          ) : null}
        </nav>
      ) : null}
    </main>
  )
}
