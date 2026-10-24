import SiteShell, { siteMetadata, siteViewport } from '@/components/SiteShell'

export const metadata = siteMetadata('es')
export const viewport = siteViewport

export default function SpanishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="es">{children}</SiteShell>
}
