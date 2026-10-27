'use client'

import { useId, useRef, type FormEvent } from 'react'
import { BUTTONDOWN_ACTION, LEAD_MAGNET, NEWSLETTER_CONSENT } from '@/data/real-cost'
import type { Lang } from '@/lib/lang'

const TEXT = {
  es: {
    title: 'Recibe la tabla por correo',
    email: 'Correo electrónico',
    placeholder: 'tu@correo.com',
    button: 'Recibir la tabla',
    helper: 'Si ves una verificación o un error de Buttondown, complétalo ahí.',
  },
  en: {
    title: 'Get the table by email',
    email: 'Email',
    placeholder: 'you@email.com',
    button: 'Get the table',
    helper: 'If Buttondown shows a check or an error, finish it there.',
  },
} as const

const PENDING_KEY = 'nl_pending'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function NewsletterCTA({ lang = 'es', embedded = false }: { lang?: Lang; embedded?: boolean }) {
  const t = TEXT[lang]
  const titleId = useId()
  const emailId = useId()
  const consentId = useId()
  const honeypotRef = useRef<HTMLInputElement>(null)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    if (honeypotRef.current?.value) {
      event.preventDefault()
      return
    }

    const email = event.currentTarget.elements.namedItem('email')
    if (email instanceof HTMLInputElement) {
      email.value = email.value.trim()
      if (!email.checkValidity()) {
        event.preventDefault()
        email.reportValidity()
        return
      }
    }

    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify({
        lang,
        path: window.location.pathname,
        ts: Date.now(),
      }))
    } catch {
      // Private mode can block storage; the form still posts.
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'newsletter_submit', { language: lang, page_path: window.location.pathname })
    }
  }

  return (
    <section className={embedded ? 'boletin-seccion boletin-en-cuerpo' : 'marco seccion boletin-seccion'} aria-labelledby={titleId}>
      <div className="boletin">
        <h2 id={titleId}>{t.title}</h2>
        <p className="entrada-texto">{LEAD_MAGNET[lang]}</p>
        <form action={BUTTONDOWN_ACTION} method="post" onSubmit={onSubmit}>
          <input
            ref={honeypotRef}
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            defaultValue=""
            style={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}
          />
          <div className="boletin-form">
            <label className="solo-lector" htmlFor={emailId}>{t.email}</label>
            <input id={emailId} name="email" type="email" required autoComplete="email" placeholder={t.placeholder} aria-describedby={consentId} />
            <input type="hidden" name="embed" value="1" />
            <button className="boton boton-claro" type="submit">{t.button}</button>
            <p className="estado-texto" style={{ flexBasis: '100%' }}>{t.helper}</p>
          </div>
          <p id={consentId} className="meta consentimiento">{NEWSLETTER_CONSENT[lang]}</p>
        </form>
      </div>
    </section>
  )
}
