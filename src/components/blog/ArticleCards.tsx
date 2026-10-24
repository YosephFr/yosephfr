import Link from 'next/link'
import { type Article } from '@/data/articles'
import ArticleCover from './ArticleCover'

export function shortDate(date: string) {
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(date)).replace('.', '')
}

function Card({ article, level = 'h3', className = '' }: { article: Article; level?: 'h2' | 'h3'; className?: string }) {
  const Title = level
  return (
    <Link href={`/blog/${article.slug}`} data-event="article_open" className={`lamina articulo-tarjeta${className}`}>
      <div className="articulo-portada"><ArticleCover slug={article.slug} /></div>
      <div className="articulo-texto">
        <Title>{article.title}</Title>
        <p>{article.description}</p>
        <span className="meta pie-tarjeta">{shortDate(article.date)} · {article.readingMinutes} min</span>
      </div>
    </Link>
  )
}

export function FeaturedArticle({ article, level = 'h2', compact = false }: { article: Article; level?: 'h2' | 'h3'; compact?: boolean }) {
  const Title = level
  return (
    <Link href={`/blog/${article.slug}`} data-event="article_open" className={`lamina articulo-destacado${compact ? ' compacto' : ''}`}>
      <div className="articulo-portada"><ArticleCover slug={article.slug} cols={compact ? 18 : 16} rows={compact ? 8 : 11} /></div>
      <div className="articulo-texto">
        <Title>{article.title}</Title>
        <p>{article.description}</p>
        <span className="meta pie-tarjeta">{article.category} · {shortDate(article.date)} · {article.readingMinutes} min</span>
      </div>
    </Link>
  )
}

// La rejilla se adapta a la cantidad para no dejar huecos: uno va en horizontal a todo el ancho, dos a medias,
// tres en tres columnas; si la última fila de escritorio queda incompleta, sus tarjetas se reparten el ancho (4 = 2 × 2, 5 = 3 + 2).
export default function ArticleCards({ articles, level = 'h3' }: { articles: Article[]; level?: 'h2' | 'h3' }) {
  const n = articles.length
  if (n === 1) return <FeaturedArticle article={articles[0]} level={level} compact />
  const halves = n % 3 === 2 ? 2 : n % 3 === 1 ? 4 : 0
  return (
    <div className="articulos">
      {articles.map((article, i) => {
        const half = i >= n - halves ? ' ancho-medio' : ''
        const oddLast = n % 2 === 1 && i === n - 1 ? ' impar-final' : ''
        return <Card key={article.slug} article={article} level={level} className={half + oddLast} />
      })}
    </div>
  )
}
