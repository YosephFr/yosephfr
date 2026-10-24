import type { Metadata } from 'next'
import SiteShell from '@/components/SiteShell'
import NotFoundContent from '@/components/NotFoundContent'

// Con dos layouts raíz, la 404 de URLs inexistentes no tiene layout que la envuelva: arma su propio documento.
export const metadata: Metadata = {
  title: 'Página no encontrada | Arncof',
  robots: { index: false, follow: true },
}

export default function GlobalNotFound() {
  return <SiteShell lang="es"><NotFoundContent /></SiteShell>
}
