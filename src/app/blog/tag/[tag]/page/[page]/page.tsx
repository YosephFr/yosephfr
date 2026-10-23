import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogIndex from "@/components/blog/BlogIndex"
import { listingMetadata } from "@/lib/blog-meta"
import { tagPageStaticParams } from "@/lib/content.mjs"
import { noindex } from "@/lib/noindex"

interface Props {
  params: Promise<{ tag: string; page: string }>
}

export function generateStaticParams() {
  return tagPageStaticParams("es")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag, page } = await params
  if (tag === "_" || page === "0") return noindex
  const number = Number(page)
  if (!Number.isInteger(number) || number < 2) return {}
  return listingMetadata("es", number, tag)
}

export default async function TagPaged({ params }: Props) {
  const { tag, page } = await params
  if (tag === "_" || page === "0") return <BlogIndex lang="es" page={0} tagSlug="_" />
  const number = Number(page)
  if (!Number.isInteger(number) || number < 2) notFound()
  return <BlogIndex lang="es" page={number} tagSlug={tag} />
}
