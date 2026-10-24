"use client"
import Link from 'next/link'
import { useEffect, useState, type CSSProperties } from 'react'
import { usePathname } from 'next/navigation'
import DotIcon from '@/components/dots/DotIcon'
import type { GlyphName } from '@/components/dots/glyphs'

const ITEMS: { href: string; label: string; icon: GlyphName }[] = [
  { href: '/', label: 'Inicio', icon: 'inicio' },
  { href: '/blog', label: 'Artículos', icon: 'articulos' },
  { href: '/cv', label: 'CV', icon: 'cv' },
  { href: '/contacto', label: 'Contacto', icon: 'contacto' },
]

function activeIndex(raw: string) {
  const path = raw.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  if (path === '/') return 0
  if (path.startsWith('/blog')) return 1
  if (path === '/cv' || path.startsWith('/experiencia') || path.startsWith('/skills')) return 2
  if (path === '/contacto') return 3
  return -1
}

export default function Navbar() {
  const active = activeIndex(usePathname() ?? '/')
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  return (
    <header className="barra" data-desplazado={scrolled}>
      <div className="marco barra-dentro">
        <Link href="/" className="marca" aria-label="Arncof, inicio">
          <DotIcon name="marca" size={20} />
          Arncof
        </Link>
        <nav aria-label="Principal" className="capsula" data-activo={active} style={{ '--activo': Math.max(active, 0) } as CSSProperties}>
          <span className="capsula-pastilla" aria-hidden="true" />
          {ITEMS.map((item, i) => (
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
