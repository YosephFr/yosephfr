import type { Metadata } from "next"
import BlogIndex from "@/components/blog/BlogIndex"
import { listingMetadata } from "@/lib/blog-meta"
import { tagStaticParams } from "@/lib/content.mjs"
import { noindex } from "@/lib/noindex"

interface Props {
  params: Promise<{ tag: string }>
}

export function generateStaticParams() {
  return tagStaticParams("en")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  if (tag === "_") return noindex
  return listingMetadata("en", 1, tag)
}

export default async function EnglishTagPage({ params }: Props) {
  const { tag } = await params
  return <BlogIndex lang="en" page={1} tagSlug={tag} />
}
