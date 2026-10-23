import type { Metadata } from "next"
import {
  getTags,
  getTranslation,
  indexPath,
  site,
  tagPath,
  type Lang,
  type Post,
} from "@/lib/content.mjs"

export function postMetadata(post: Post): Metadata {
  const languages = (() => {
    const other = getTranslation(post)
    if (!other) return undefined
    const es = post.lang === "es" ? post.path : other.path
    const en = post.lang === "en" ? post.path : other.path
    return { es, en, "x-default": es }
  })()

  const canonical = post.canonical ?? post.path

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical,
      ...(languages ? { languages } : {}),
    },
    openGraph: {
      type: "article",
      url: post.canonical ?? post.url,
      title: post.title,
      description: post.description,
      siteName: site.name,
      locale: post.lang === "en" ? "en_US" : "es_AR",
      publishedTime: `${post.date}T00:00:00.000Z`,
      modifiedTime: `${post.updated}T00:00:00.000Z`,
      tags: [...post.tags],
      images: [{ url: post.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.ogImage],
      creator: site.twitter,
    },
  }
}

export function listingMetadata(lang: Lang, page = 1, tagSlug?: string): Metadata {
  const tag = tagSlug ? getTags(lang).find((item) => item.slug === tagSlug) : undefined
  const path = tag ? tagPath(lang, tag.slug, page) : indexPath(lang, page)
  const baseTitle = tag
    ? lang === "en"
      ? `${tag.label} notes`
      : `Notas sobre ${tag.label}`
    : lang === "en"
      ? "Notes from production"
      : "Notas desde producción"
  const title = page > 1 ? `${baseTitle}, ${lang === "en" ? "page" : "página"} ${page}` : baseTitle
  const description =
    lang === "en"
      ? "Production notes on AI that talks to customers: operations, spend, limits, and what actually breaks."
      : "Notas de producción sobre IA que conversa con clientes: operación, costos, límites y lo que se rompe con tráfico real."

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      siteName: site.name,
      locale: lang === "en" ? "en_US" : "es_AR",
      images: [{ url: "/blog/og/_blog.png", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/blog/og/_blog.png"],
      creator: site.twitter,
    },
  }
}
