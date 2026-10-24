"use client"
import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import DotIcon from '@/components/dots/DotIcon'
import type { GlyphName } from '@/components/dots/glyphs'
import { UI, isEnglishPath } from '@/lib/lang'

function items(lang: 'es' | 'en'): { href: string; label: string; icon: GlyphName }[] {
  const t = UI[lang]
  return [
    { href: t.home, label: t.nav.home, icon: 'inicio' },
    { href: t.blog, label: t.nav.articles, icon: 'articulos' },
    { href: t.cv, label: t.nav.cv, icon: 'cv' },
    { href: t.contactPath, label: t.nav.contact, icon: 'contacto' },
  ]
}

function activeIndex(raw: string) {
  const path = raw.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  if (path === '/' || path === '/en') return 0
  if (path.startsWith('/blog') || path.startsWith('/en/blog')) return 1
  if (path === '/cv' || path === '/en/cv' || path.startsWith('/experiencia') || path.startsWith('/skills')) return 2
  if (path === '/contacto' || path === '/en/contact') return 3
  return -1
}

export default function Navbar() {
  const pathname = usePathname() ?? '/'
  const active = activeIndex(pathname)
  const lang = isEnglishPath(pathname) ? 'en' : 'es'
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <header className="barra" data-desplazado={scrolled} lang={lang === 'en' ? 'en' : undefined}>
      <div className="marco barra-dentro">
        <Link href={UI[lang].home} className="marca" aria-label={UI[lang].nav.brand}>
          <DotIcon name="marca" size={20} />
          Arncof
        </Link>
        <nav aria-label={lang === 'en' ? 'Main' : 'Principal'} className="capsula" data-activo={active} style={{ '--activo': Math.max(active, 0) } as CSSProperties}>
          <span className="capsula-pastilla" aria-hidden="true" />
          {items(lang).map((item, i) => (
            <Link key={item.href} href={item.href} aria-current={i === active ? 'page' : undefined}>
              <DotIcon name={item.icon} size={22} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
