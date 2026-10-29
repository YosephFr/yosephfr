'use client'

import { useId, useRef, type FormEvent } from 'react'
import { defaultOffer, type NewsletterOffer } from '@/data/offers'
import { BUTTONDOWN_ACTION, NEWSLETTER_CONSENT } from '@/data/real-cost'
import { sendEvent } from '@/lib/attribution'
import { sha256Email } from '@/lib/meta'
import type { Lang } from '@/lib/lang'

const TEXT = {
  es: {
    email: 'Correo electrónico',
    placeholder: 'tu@correo.com',
    helper: 'Si ves una verificación o un error de Buttondown, complétalo ahí.',
  },
  en: {
    email: 'Email',
    placeholder: 'you@email.com',
    helper: 'If Buttondown shows a check or an error, finish it there.',
  },
} as const

const PENDING_KEY = 'nl_pending'
const EM_KEY = 'nl_em'

export default function NewsletterCTA({ lang = 'es', embedded = false, anchor, offer }: { lang?: Lang; embedded?: boolean; anchor?: string; offer?: NewsletterOffer }) {
  const t = TEXT[lang]
  const copy = offer ?? defaultOffer(lang)
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

    if (email instanceof HTMLInputElement && email.value) {
      // Drop a stale hash first. The new one is stored when the digest resolves, without blocking the POST.
      try { sessionStorage.removeItem(EM_KEY) } catch { /* storage can be blocked */ }
      const address = email.value
      sha256Email(address).then(hash => {
        try { sessionStorage.setItem(EM_KEY, hash) } catch { /* storage can be blocked */ }
      }).catch(() => {})
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

    try {
      sendEvent('newsletter_submit', { language: lang, page_path: window.location.pathname })
    } catch {
      // Measuring the submit must not block the native POST.
    }
  }

  return (
    <section id={anchor} className={embedded ? 'boletin-seccion boletin-en-cuerpo' : 'marco seccion boletin-seccion'} aria-labelledby={titleId}>
      <div className="boletin">
        <h2 id={titleId}>{copy.title}</h2>
        <p className="entrada-texto">{copy.text}</p>
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
            <button className="boton boton-claro" type="submit">{copy.button}</button>
            <p className="estado-texto" style={{ flexBasis: '100%' }}>{t.helper}</p>
          </div>
          <p id={consentId} className="meta consentimiento">{NEWSLETTER_CONSENT[lang]}</p>
        </form>
      </div>
    </section>
  )
}
