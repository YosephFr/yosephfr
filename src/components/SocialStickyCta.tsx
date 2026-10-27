'use client'

import { useEffect, useState, type MouseEvent } from 'react'
import { usePathname } from 'next/navigation'
import { applyUtm, sendEvent, visitIsSocial } from '@/lib/attribution'
import { isEnglishPath } from '@/lib/lang'

const DISMISS_KEY = 'cta_social_off'
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000
const MOBILE = '(max-width: 899px)'

const COPY = {
  es: { label: 'Newsletter semanal', action: 'Recibir', close: 'Cerrar', region: 'Suscripción al newsletter' },
  en: { label: 'Weekly newsletter', action: 'Get it', close: 'Close', region: 'Newsletter signup' },
} as const

function dismissed() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false
    const ts = Number(raw)
    if (!Number.isFinite(ts)) return true
    return Date.now() - ts < DISMISS_MS
  } catch {
    return false
  }
}

export default function SocialStickyCta() {
  const pathname = usePathname() ?? '/'
  const lang = isEnglishPath(pathname) ? 'en' : 'es'
  const t = COPY[lang]
  const [visible, setVisible] = useState(false)
  const [href, setHref] = useState(lang === 'en' ? '/en/start' : '/empieza')

  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/'
    if (path === '/gracias' || path === '/en/thanks' || dismissed() || !visitIsSocial()) return
    const mobile = window.matchMedia(MOBILE)
    let deep = false
    let formOnScreen = false
    let closed = false
    const hitting = new Map<Element, boolean>()

    const sync = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      deep = max <= 0 || window.scrollY / max >= 0.4
      setVisible(!closed && mobile.matches && deep && !formOnScreen)
    }

    const onMedia = () => sync()
    mobile.addEventListener('change', onMedia)
    window.addEventListener('scroll', sync, { passive: true })

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) hitting.set(entry.target, entry.isIntersecting)
      formOnScreen = [...hitting.values()].some(Boolean)
      sync()
    }, { threshold: 0.35 })
    for (const form of document.querySelectorAll('.boletin-seccion')) observer.observe(form)

    const anchor = document.getElementById('boletin')
    setHref(anchor ? '#boletin' : applyUtm(lang === 'en' ? '/en/start' : '/empieza'))
    const onOff = () => {
      closed = true
      setVisible(false)
    }
    window.addEventListener('cta-social-off', onOff)
    sync()

    return () => {
      closed = true
      mobile.removeEventListener('change', onMedia)
      window.removeEventListener('scroll', sync)
      window.removeEventListener('cta-social-off', onOff)
      observer.disconnect()
    }
  }, [pathname, lang])

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()))
    } catch {
      // Closing still hides it for this view; the next page reads storage again.
    }
    window.dispatchEvent(new Event('cta-social-off'))
  }

  function onClick(event: MouseEvent<HTMLAnchorElement>) {
    sendEvent('sticky_cta_click', { page_path: window.location.pathname, language: lang })
    const form = document.getElementById('boletin')
    if (!form) return
    event.preventDefault()
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    const input = form.querySelector('input[type="email"]')
    if (input instanceof HTMLElement) input.focus({ preventScroll: true })
  }

  if (!visible) return null

  return (
    <aside className="cta-social" role="region" aria-label={t.region}>
      <a className="cta-social-ir" href={href} onClick={onClick}>
        <span>{t.label}</span>
        <span className="boton boton-claro">{t.action}</span>
      </a>
      <button type="button" className="cta-social-cerrar" aria-label={t.close} onClick={dismiss}>×</button>
    </aside>
  )
}
