import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Snake',
  description: 'El clásico de la serpiente, con flechas o WASD.',
  alternates: { canonical: '/snake' },
  robots: { index: false, follow: true },
  ...social({ title: 'Snake | Arncof', description: 'El clásico de la serpiente, con flechas o WASD.', url: '/snake' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
