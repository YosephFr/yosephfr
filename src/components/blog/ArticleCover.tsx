import DotField, { cascade } from '@/components/dots/DotField'

const FROM = ['abajo-derecha', 'abajo', 'derecha'] as const

// Portada propia de cada artículo: una cascada de puntos que depende de su slug.
export default function ArticleCover({ slug, cols = 12, rows = 9, density = 1.1, from }: { slug: string; cols?: number; rows?: number; density?: number; from?: (typeof FROM)[number] }) {
  const direction = from ?? FROM[[...slug].reduce((n, c) => n + c.charCodeAt(0), 0) % FROM.length]
  return <DotField cols={cols} rows={rows} cells={cascade(cols, rows, slug, direction, density)} align="xMaxYMax slice" />
}
