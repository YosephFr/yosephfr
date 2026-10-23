import { getRelated, indexPath, site, tagPath, type Post } from "@/lib/content.mjs"

function formatDate(value: string, lang: Post["lang"]) {
  return new Intl.DateTimeFormat(lang === "en" ? "en-US" : "es", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`))
}

function profileLabel(url: string) {
  if (url.includes("linkedin.com")) return "LinkedIn"
  if (url.includes("github.com")) return "GitHub"
  if (url.includes("x.com")) return "X"
  if (url.includes("instagram.com")) return "Instagram"
  if (url.includes("tiktok.com")) return "TikTok"
  return url
}

function json(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

const copy = {
  es: {
    home: "Inicio",
    blog: "Blog",
    minutes: "min de lectura",
    updated: "Actualizado",
    toc: "Contenido",
    faq: "Preguntas frecuentes",
    by: "Escrito por",
    related: "Notas relacionadas",
  },
  en: {
    home: "Home",
    blog: "Blog",
    minutes: "min read",
    updated: "Updated",
    toc: "Contents",
    faq: "Frequently asked questions",
    by: "Written by",
    related: "Related notes",
  },
} as const

export default function Article({ post }: { post: Post }) {
  const text = copy[post.lang]
  const related = getRelated(post, 3)
  const canonical = post.canonical ?? post.url
  const crumbs = [
    { name: text.home, item: site.url },
    { name: text.blog, item: `${site.url}${indexPath(post.lang)}` },
    { name: post.title, item: post.url },
  ]

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated,
    inLanguage: post.lang,
    author: { "@type": "Person", "@id": site.personId, name: site.name, url: site.url },
    publisher: { "@type": "Person", "@id": site.personId, name: site.name, url: site.url },
    image: [`${site.url}${post.ogImage}`],
    mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
    url: post.url,
    wordCount: post.wordCount,
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readingMinutes}M`,
  }

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  }

  const faq = post.faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null

  return (
    <main className="max-w-[680px] mx-auto px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(blogPosting) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(breadcrumbs) }} />
      {faq ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json(faq) }} /> : null}

      <article lang={post.lang}>
        <nav aria-label="Breadcrumb" className="text-sm text-text-muted mb-6">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li className="inline-flex items-center min-h-12">
              <a href="/" className="text-text-secondary">{text.home}</a>
            </li>
            <li className="inline-flex items-center gap-2 min-h-12">
              <span aria-hidden="true">/</span>
              <a href={indexPath(post.lang)} className="text-text-secondary">{text.blog}</a>
            </li>
            <li className="inline-flex items-center gap-2 min-h-12 text-text-primary">
              <span aria-hidden="true">/</span>
              <span>{post.title}</span>
            </li>
          </ol>
        </nav>

        <header>
          <h1 className="text-[2rem] leading-tight font-semibold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            {post.title}
          </h1>
          <p className="text-base text-text-secondary leading-relaxed mt-4">{post.description}</p>
          <p className="text-sm text-text-muted mt-4">
            <time dateTime={post.date}>{formatDate(post.date, post.lang)}</time>
            {post.updated !== post.date ? (
              <>
                <span aria-hidden="true"> · </span>
                <span>
                  {text.updated} <time dateTime={post.updated}>{formatDate(post.updated, post.lang)}</time>
                </span>
              </>
            ) : null}
            <span aria-hidden="true"> · </span>
            <span>{post.readingMinutes} {text.minutes}</span>
          </p>
          <ul className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, index) => (
              <li key={tag}>
                <a
                  href={tagPath(post.lang, post.tagSlugs[index])}
                  className="inline-flex items-center min-h-12 px-4 rounded-full border border-surface-border text-sm text-text-secondary"
                >
                  {tag}
                </a>
              </li>
            ))}
          </ul>
        </header>

        {post.cover ? (
          <img src={post.cover} alt={post.title} className="mt-8 w-full rounded-2xl" />
        ) : null}

        {post.toc.length > 0 ? (
          <nav aria-label={text.toc} className="my-8 border border-surface-border rounded-2xl p-5">
            <p className="text-sm font-medium text-text-primary mb-1">{text.toc}</p>
            <ol>
              {post.toc.map((item) => (
                <li key={item.id} className={item.depth === 3 ? "ml-4" : undefined}>
                  <a href={`#${item.id}`} className="block py-3 text-base leading-6 text-text-secondary">
                    {item.text}
                  </a>
                </li>
              ))}
              {post.faq.length > 0 ? (
                <li>
                  <a href="#faq" className="block py-3 text-base leading-6 text-text-secondary">
                    {text.faq}
                  </a>
                </li>
              ) : null}
            </ol>
          </nav>
        ) : null}

        <div className="prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.faq.length > 0 ? (
          <section id="faq" className="mt-12" aria-labelledby="faq-title">
            <h2 id="faq-title" className="text-2xl font-semibold tracking-tight text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              {text.faq}
            </h2>
            <div className="mt-4 flex flex-col gap-6">
              {post.faq.map((item, index) => (
                <div key={item.q}>
                  <h3 id={`faq-${index}`} className="text-lg font-medium text-text-primary">
                    {item.q}
                  </h3>
                  <p className="text-base text-text-secondary leading-relaxed mt-2">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <aside className="mt-12 border border-surface-border rounded-2xl p-6">
          <p className="text-sm text-text-muted">{text.by}</p>
          <a href={site.url} className="inline-flex items-center min-h-12 text-xl font-semibold text-text-primary">
            {site.name}
          </a>
          <p className="text-base text-text-secondary leading-relaxed mt-2">{site.positioning[post.lang]}</p>
          <ul className="flex flex-wrap gap-x-5">
            {site.sameAs.map((url) => (
              <li key={url}>
                <a href={url} className="inline-flex items-center min-h-12 text-sm text-accent" rel="me noopener noreferrer">
                  {profileLabel(url)}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {related.length > 0 ? (
          <aside className="mt-12" aria-labelledby="related-title">
            <h2 id="related-title" className="text-xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-heading)" }}>
              {text.related}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {related.map((item) => (
                <li key={item.slug}>
                  <a href={item.path} className="block bg-surface-raised border border-surface-border rounded-2xl p-5">
                    <span className="block text-base font-medium text-text-primary">{item.title}</span>
                    <span className="block text-sm text-text-secondary mt-1">{item.description}</span>
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        ) : null}
      </article>
    </main>
  )
}
