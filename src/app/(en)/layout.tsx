import SiteShell, { siteMetadata, siteViewport } from '@/components/SiteShell'

export const metadata = siteMetadata('en')
export const viewport = siteViewport

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell lang="en">{children}</SiteShell>
}
