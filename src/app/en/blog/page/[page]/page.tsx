import type { Metadata } from "next"
import { notFound } from "next/navigation"
import BlogIndex from "@/components/blog/BlogIndex"
import { listingMetadata } from "@/lib/blog-meta"
import { pageStaticParams } from "@/lib/content.mjs"
import { noindex } from "@/lib/noindex"

interface Props {
  params: Promise<{ page: string }>
}

export function generateStaticParams() {
  return pageStaticParams("en")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params
  if (page === "0") return noindex
  const number = Number(page)
  if (!Number.isInteger(number) || number < 2) return {}
  return listingMetadata("en", number)
}

export default async function EnglishBlogPaged({ params }: Props) {
  const { page } = await params
  if (page === "0") return <BlogIndex lang="en" page={0} />
  const number = Number(page)
  if (!Number.isInteger(number) || number < 2) notFound()
  return <BlogIndex lang="en" page={number} />
}
