'use client'

import { useEffect } from 'react'
import { captureAttribution } from '@/lib/attribution'

export default function AnalyticsEvents() {
  useEffect(() => {
    captureAttribution()
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>('a[data-event], button[data-event]') : null
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
