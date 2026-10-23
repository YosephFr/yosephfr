"use client"

import Link from "next/link"
import { useLocale } from "@/i18n"

interface LatestPost {
  href: string
  title: string
  description: string
  date: string
  readingMinutes: number
}

export default function LatestPosts({ posts }: { posts: LatestPost[] }) {
  const { t, locale } = useLocale()
  if (posts.length === 0) return null

  const dateLocale = locale === "en" ? "en-US" : "es"

  return (
    <section id="notas" className="px-4 mt-6">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2 text-text-secondary">
            <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
            <span className="text-sm tracking-[-0.2px]">{t.blog.latest}</span>
          </div>
          <Link href="/blog" className="text-sm text-accent hover:text-accent-hover">
            {t.blog.all}
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link
              key={post.href}
              href={post.href}
              className="group bg-surface-raised border border-surface-border rounded-2xl p-6 hover:border-surface-hover transition-all duration-300 block"
            >
              <p className="text-xs text-text-muted">
                <time dateTime={post.date}>
                  {new Intl.DateTimeFormat(dateLocale, { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${post.date}T00:00:00Z`))}
                </time>
                <span aria-hidden="true"> · </span>
                {post.readingMinutes} {t.blog.minutes}
              </p>
              <h2 className="text-lg font-medium tracking-[-0.2px] text-text-primary group-hover:text-accent mt-2">
                {post.title}
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed mt-2">{post.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
