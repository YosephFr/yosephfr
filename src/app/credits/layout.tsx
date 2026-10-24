import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Créditos',
  description: 'Quién y con qué se hizo este sitio.',
  alternates: { canonical: '/credits' },
  robots: { index: false, follow: true },
  ...social({ title: 'Créditos | Arncof', description: 'Quién y con qué se hizo este sitio.', url: '/credits' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
