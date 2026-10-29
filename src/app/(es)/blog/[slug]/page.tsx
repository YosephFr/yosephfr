import type { Metadata } from 'next'
import ArticleView, { articleMetadata } from '@/components/blog/ArticleView'
import MetaViewContent from '@/components/MetaViewContent'
import { getArticle, getArticleSlugs, EMPTY_SLUG } from '@/data/articles'

export const dynamic = 'force-static'
type Props = { params: Promise<{ slug: string }> }

// Con output: export una lista vacía rompe el build; sin artículos visibles se genera un marcador que finalize-export borra.
export function generateStaticParams() {
  const slugs = getArticleSlugs('es')
  return (slugs.length ? slugs : [EMPTY_SLUG]).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return articleMetadata((await params).slug, 'es')
}

export default async function ArticlePage({ params }: Props) {
  const slug = (await params).slug
  const article = getArticle(slug, 'es')
  return (
    <>
      {article ? <MetaViewContent name={article.title} type="article" lang="es" /> : null}
      <ArticleView slug={slug} lang="es" />
    </>
  )
}
