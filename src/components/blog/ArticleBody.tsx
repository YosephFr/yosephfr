import type { ReactNode } from 'react'
import { headingId, type ArticleBlock } from '@/data/articles'

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g).map((part, i) => {
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/)
    if (link) return <a key={i} href={link[2]} rel="noopener">{link[1]}</a>
    return part
  })
}
export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return <div className="editorial-body">
    {blocks.map((block, index) => {
      if (block.type === 'heading') return <h2 id={headingId(block.text!)} key={index}>{block.text}</h2>
      if (block.type === 'bullets') return <ul key={index}>{block.items!.map((item,i)=><li key={i}>{inline(item)}</li>)}</ul>
      if (block.type === 'list') return <ol key={index}>{block.items!.map((item, i) => <li key={i}>{inline(item)}</li>)}</ol>
      return <p key={index}>{inline(block.text!)}</p>
    })}
  </div>
}
