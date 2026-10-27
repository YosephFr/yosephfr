'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PENDING_KEY = 'nl_pending'
const MAX_AGE_MS = 30 * 60 * 1000

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

function readPending(): { lang: 'es' | 'en'; ts: number } | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    if (!raw) return null
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return null
    const record = data as { lang?: unknown; ts?: unknown }
    if (record.lang !== 'es' && record.lang !== 'en') return null
    if (typeof record.ts !== 'number' || !Number.isFinite(record.ts)) return null
    return { lang: record.lang, ts: record.ts }
  } catch {
    return null
  }
}

function qualifies(pending: { lang: 'es' | 'en'; ts: number }) {
  const age = Date.now() - pending.ts
  if (age < 0 || age >= MAX_AGE_MS) return false
  const referrer = document.referrer
  return referrer === '' || referrer.toLowerCase().includes('buttondown')
}

// gtag loads afterInteractive, and the English redirect unmounts this page.
// Keep trying briefly without tying the timer to the component lifecycle.
function fireLead(lang: 'es' | 'en') {
  const send = () => {
    if (typeof window.gtag !== 'function') return false
    window.gtag('event', 'generate_lead', { method: 'newsletter', language: lang })
    return true
  }
  if (send()) return
  const started = Date.now()
  const id = window.setInterval(() => {
    if (send() || Date.now() - started > 5000) window.clearInterval(id)
  }, 100)
}

export default function LeadConfirm() {
  const router = useRouter()

  useEffect(() => {
    const pending = readPending()
    if (!pending || !qualifies(pending)) return

    fireLead(pending.lang)
    try {
      sessionStorage.removeItem(PENDING_KEY)
    } catch {
      // Already counted in this attempt; a full storage failure just skips removal.
    }

    const path = window.location.pathname.replace(/\/+$/, '') || '/'
    if (pending.lang === 'en' && path === '/gracias') router.replace('/en/thanks')
  }, [router])

  return null
}
