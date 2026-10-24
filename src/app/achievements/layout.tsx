import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Logros',
  description: 'Los secretos que ya descubriste en el sitio.',
  alternates: { canonical: '/achievements' },
  robots: { index: false, follow: true },
  ...social({ title: 'Logros | Arncof', description: 'Los secretos que ya descubriste en el sitio.', url: '/achievements' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
