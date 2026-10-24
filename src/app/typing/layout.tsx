import type { Metadata } from 'next'
import { social } from '@/lib/seo'

// Ruta de juego: título y canonical propios, fuera del índice de buscadores (tampoco está en el sitemap).
export const metadata: Metadata = {
  title: 'Typing Race',
  description: 'Cinco frases para medir tu velocidad y precisión al escribir.',
  alternates: { canonical: '/typing' },
  robots: { index: false, follow: true },
  ...social({ title: 'Typing Race | Arncof', description: 'Cinco frases para medir tu velocidad y precisión al escribir.', url: '/typing' }),
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
