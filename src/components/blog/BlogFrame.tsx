import type { ReactNode } from "react"
import { getPublishedPosts, site, type Lang } from "@/lib/content.mjs"
import "./blog.css"

const labels = {
  es: { blog: "Blog", rss: "RSS", home: "Inicio" },
  en: { blog: "Blog", rss: "RSS", home: "Home" },
} as const

function profileLabel(url: string) {
  if (url.includes("linkedin.com")) return "LinkedIn"
  if (url.includes("github.com")) return "GitHub"
  if (url.includes("x.com")) return "X"
  return url
}

export default function BlogFrame({ lang, children }: { lang: Lang; children: ReactNode }) {
  const copy = labels[lang]
  const otherLang: Lang = lang === "es" ? "en" : "es"
  const showOther = getPublishedPosts(otherLang).length > 0
  const otherHref = otherLang === "en" ? "/en/blog" : "/blog"

  return (
    <div className="blog-shell">
      <header className="border-b border-surface-border">
        <div className="max-w-[680px] mx-auto px-4 min-h-16 py-2 flex items-center justify-between gap-4">
          <a href="/" className="inline-flex items-center min-h-12 font-semibold tracking-tight text-text-primary">
            {site.name}
          </a>
          <nav aria-label={copy.blog} className="flex items-center gap-1">
            <a href={lang === "en" ? "/en/blog" : "/blog"} className="inline-flex items-center min-h-12 px-3 text-sm text-text-secondary">
              {copy.blog}
            </a>
            <a href="/rss.xml" className="inline-flex items-center min-h-12 px-3 text-sm text-text-secondary">
              {copy.rss}
            </a>
            {showOther ? (
              <a href={otherHref} className="inline-flex items-center min-h-12 px-3 text-sm text-text-secondary" hrefLang={otherLang}>
                {otherLang.toUpperCase()}
              </a>
            ) : null}
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-surface-border mt-16">
        <div className="max-w-[680px] mx-auto px-4 py-10">
          <p className="text-base text-text-secondary leading-relaxed">{site.positioning[lang]}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-4">
            <li>
              <a href={site.url} className="inline-flex items-center min-h-12 text-sm text-accent">
                {copy.home}
              </a>
            </li>
            {site.sameAs.map((url) => (
              <li key={url}>
                <a href={url} className="inline-flex items-center min-h-12 text-sm text-accent" rel="me noopener noreferrer">
                  {profileLabel(url)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  )
}
