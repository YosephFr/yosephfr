import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { headingId, type ArticleBlock } from '@/data/articles'

const TOKEN = /(`[^`]+`|\[[^\]]+\]\((?:https?:\/\/|\/|#)[^)\s]+\)|\*\*[^*]+\*\*|\*[^*]+\*)/g

function inline(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return <code key={i}>{part.slice(1, -1)}</code>
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*')) return <em key={i}>{part.slice(1, -1)}</em>
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const href = link[2]
      const label = inline(link[1])
      if (href.startsWith('/')) return <Link key={i} href={href}>{label}</Link>
      return <a key={i} href={href} rel="noopener">{label}</a>
    }
    return part
  })
}

export default function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return <div className="editorial-body">
    {blocks.map((block, index) => {
      if (block.type === 'heading') return <h2 id={headingId(block.text!)} key={index}>{inline(block.text!)}</h2>
      if (block.type === 'subheading') return <h3 id={headingId(block.text!)} key={index}>{inline(block.text!)}</h3>
      if (block.type === 'bullets') return <ul key={index}>{block.items!.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>
      if (block.type === 'list') {
        const style = block.start && block.start > 1 ? ({ '--paso': block.start - 1 } as CSSProperties) : undefined
        return <ol key={index} start={block.start} style={style}>{block.items!.map((item, i) => <li key={i}>{inline(item)}</li>)}</ol>
      }
      if (block.type === 'code') return <pre key={index}><code className={block.lang ? `language-${block.lang}` : undefined}>{block.text}</code></pre>
      if (block.type === 'table') return (
        <div className="tabla" key={index}>
          <table>
            <caption className="solo-lector">{block.headers!.join(', ')}</caption>
            <thead>
              <tr>{block.headers!.map((cell, i) => <th key={i} scope="col">{inline(cell)}</th>)}</tr>
            </thead>
            <tbody>
              {block.rows!.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}
            </tbody>
          </table>
        </div>
      )
      return <p key={index}>{inline(block.text!)}</p>
    })}
  </div>
}
