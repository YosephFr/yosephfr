"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import DotIcon from '@/components/dots/DotIcon'
import { UI, isEnglishPath } from '@/lib/lang'

function current(raw: string) {
  const path = raw.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  if (path.startsWith('/material')) return 'material'
  if (path.startsWith('/blog') || path.startsWith('/en/blog')) return 'blog'
  if (path === '/cv' || path === '/en/cv' || path.startsWith('/experiencia') || path.startsWith('/skills')) return 'cv'
  return ''
}

export default function Navbar() {
  const pathname = usePathname() ?? '/'
  const lang = isEnglishPath(pathname) ? 'en' : 'es'
  const t = UI[lang]
  const active = current(pathname)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  // En la portada el formulario está en la misma página; en el resto se va a la del newsletter.
  const subscribeHref = pathname === t.home || pathname === `${t.home}/` ? '#boletin' : t.newsletter
  return (
    <header className="barra" data-desplazado={scrolled} lang={lang === 'en' ? 'en' : undefined}>
      <div className="marco barra-dentro">
        <Link href={t.home} className="marca" aria-label={t.nav.brand}>
          <DotIcon name="marca" size={20} />
          Arncof
        </Link>
        <nav aria-label={lang === 'en' ? 'Main' : 'Principal'} className="navegacion">
          {lang === 'es' && <Link href={t.material} aria-current={active === 'material' ? 'page' : undefined}>{t.nav.material}</Link>}
          <Link href={t.blog} className={lang === 'es' ? 'solo-ancho' : undefined} aria-current={active === 'blog' ? 'page' : undefined}>{t.nav.articles}</Link>
          <Link href={t.cv} className="solo-ancho" aria-current={active === 'cv' ? 'page' : undefined}>{t.nav.cv}</Link>
          <a href={subscribeHref} className="boton" data-event="nav_subscribe_click">{t.nav.subscribe}</a>
        </nav>
      </div>
    </header>
  )
}
