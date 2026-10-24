import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Memory',
  description: 'Encuentra los pares de tecnologías en el menor número de intentos.',
  alternates: { canonical: '/memory' },
  robots: { index: false, follow: true },
  ...social({ title: 'Memory | Arncof', description: 'Encuentra los pares de tecnologías en el menor número de intentos.', url: '/memory' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
