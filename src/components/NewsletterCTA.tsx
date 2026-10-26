'use client'

import { useId } from 'react'
import { BUTTONDOWN_ACTION, LEAD_MAGNET, NEWSLETTER_CONSENT } from '@/data/real-cost'
import type { Lang } from '@/lib/lang'

const TEXT = {
  es: { title: 'Recibe la tabla por correo', email: 'Correo electrónico', placeholder: 'tu@correo.com', button: 'Recibir la tabla' },
  en: { title: 'Get the table by email', email: 'Email', placeholder: 'you@email.com', button: 'Get the table' },
} as const

type Gtag = (command: string, name: string, params: { method: string; language: string }) => void

export default function NewsletterCTA({ lang = 'es', embedded = false }: { lang?: Lang; embedded?: boolean }) {
  const t = TEXT[lang]
  const titleId = useId()
  const emailId = useId()
  const consentId = useId()

  function onSubmit() {
    const gtag = (window as Window & { gtag?: Gtag }).gtag
    gtag?.('event', 'generate_lead', { method: 'newsletter', language: lang })
  }

  return (
    <section className={embedded ? 'boletin-seccion boletin-en-cuerpo' : 'marco seccion boletin-seccion'} aria-labelledby={titleId}>
      <div className="boletin">
        <h2 id={titleId}>{t.title}</h2>
        <p className="entrada-texto">{LEAD_MAGNET[lang]}</p>
        <form action={BUTTONDOWN_ACTION} method="post" onSubmit={onSubmit}>
          <div className="boletin-form">
            <label className="solo-lector" htmlFor={emailId}>{t.email}</label>
            <input id={emailId} name="email" type="email" required autoComplete="email" placeholder={t.placeholder} aria-describedby={consentId} />
            <input type="hidden" name="embed" value="1" />
            <input type="hidden" name="tag" value={lang} />
            <button className="boton boton-claro" type="submit">{t.button}</button>
          </div>
          <p id={consentId} className="meta consentimiento">{NEWSLETTER_CONSENT[lang]}</p>
        </form>
      </div>
    </section>
  )
}
