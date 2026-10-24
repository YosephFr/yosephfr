import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Click Challenge',
  description: 'Cuántos clics llegas a hacer en pocos segundos.',
  alternates: { canonical: '/click' },
  robots: { index: false, follow: true },
  ...social({ title: 'Click Challenge | Arncof', description: 'Cuántos clics llegas a hacer en pocos segundos.', url: '/click' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
