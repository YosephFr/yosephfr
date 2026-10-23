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
  return pageStaticParams("es")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params
  if (page === "0") return noindex
  const number = Number(page)
  if (!Number.isInteger(number) || number < 2) return {}
  return listingMetadata("es", number)
}

export default async function BlogPaged({ params }: Props) {
  const { page } = await params
  if (page === "0") return <BlogIndex lang="es" page={0} />
  const number = Number(page)
  if (!Number.isInteger(number) || number < 2) notFound()
  return <BlogIndex lang="es" page={number} />
}
