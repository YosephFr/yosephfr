'use client'

import { useEffect, useState } from 'react'
import DotIcon from '@/components/dots/DotIcon'

type Heading = { id: string; text: string }

// Índice con puntos: el actual se ilumina y los leídos quedan llenos.
export default function ArticleToc({ headings, variant }: { headings: Heading[]; variant: 'lateral' | 'movil' }) {
  const [current, setCurrent] = useState(-1)

  useEffect(() => {
    const nodes = headings.map(h => document.getElementById(h.id)).filter((n): n is HTMLElement => !!n)
    if (!nodes.length) return
    const update = () => {
      const line = window.innerHeight * 0.3
      let index = -1
      nodes.forEach((node, i) => { if (node.getBoundingClientRect().top <= line) index = i })
      setCurrent(index)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [headings])

  const links = (mobile: boolean) => (
    <ol>
      {headings.map((h, i) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className={mobile ? undefined : i === current ? 'actual' : i < current ? 'leido' : undefined} aria-current={!mobile && i === current ? 'location' : undefined}>
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  )

  if (variant === 'movil') {
    return (
      <details className="indice-movil">
        <summary>En este artículo <DotIcon name="abajo" size={12} /></summary>
        <nav aria-label="Secciones del artículo">{links(true)}</nav>
      </details>
    )
  }
  return (
    <nav aria-label="Secciones del artículo" className="indice">
      <h2>En este artículo</h2>
      {links(false)}
    </nav>
  )
}
