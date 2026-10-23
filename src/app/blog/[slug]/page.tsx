import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Article from "@/components/blog/Article"
import EmptyRoute from "@/components/blog/EmptyRoute"
import { postMetadata } from "@/lib/blog-meta"
import { getPost, postStaticParams } from "@/lib/content.mjs"
import { noindex } from "@/lib/noindex"

interface Props {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return postStaticParams("es")
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  if (slug === "_") return noindex
  const post = getPost(slug, "es")
  if (!post) return {}
  return postMetadata(post)
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  if (slug === "_") return <EmptyRoute lang="es" />
  const post = getPost(slug, "es")
  if (!post) notFound()
  return <Article post={post} />
}
