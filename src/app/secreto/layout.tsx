import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Datos curiosos',
  description: 'Algunas cosas que no aparecen en el CV.',
  alternates: { canonical: '/secreto' },
  robots: { index: false, follow: true },
  ...social({ title: 'Datos curiosos | Arncof', description: 'Algunas cosas que no aparecen en el CV.', url: '/secreto' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
