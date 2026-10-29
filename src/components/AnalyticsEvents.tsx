'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'
import { trackMeta } from '@/lib/meta'

function contactMethod(href: string): 'email' | 'whatsapp' | 'calendar' | undefined {
  if (href.startsWith('mailto:')) return 'email'
  try {
    const host = new URL(href, window.location.href).hostname.toLowerCase().replace(/^www\./, '')
    if (host === 'wa.me' || host === 'api.whatsapp.com') return 'whatsapp'
    if (
      host === 'cal.com' || host.endsWith('.cal.com') ||
      host === 'calendly.com' || host.endsWith('.calendly.com') ||
      host === 'calendar.app.google' || host === 'calendar.google.com'
    ) return 'calendar'
  } catch {
    // Relative or malformed hrefs are not contact links.
  }
  return undefined
}

export default function AnalyticsEvents() {
  useEffect(() => {
    captureAttribution()
    const onClick = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null
      const anchor = element?.closest('a')
      const method = anchor ? contactMethod(anchor.getAttribute('href') ?? '') : undefined
      // contact_email_copy is a button, not a mailto link, so it is not a Contact.
      if (method) trackMeta('Contact', { contact_method: method })

      const target = element?.closest<HTMLElement>('a[data-event], button[data-event]') ?? null
      if (!target) return
      const name = target.dataset.event
      // contact_email_copy mide la intención de copiar el correo, igual que el clic en mailto: no es un mensaje recibido.
      if (!['contact_email_click', 'contact_email_copy', 'social_profile_click', 'article_open'].includes(name ?? '')) return
      const analytics = window as Window & { gtag?: (command:string, name:string, params:Record<string,string>) => void }
      // No email addresses, form contents or query strings are sent.
      analytics.gtag?.('event', name!, { channel: target.dataset.channel ?? 'website', page_path: window.location.pathname })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}
