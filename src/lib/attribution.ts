// Primera visita de la sesión: los UTM de la URL se guardan una vez y viajan con los eventos del boletín.
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type Utm = Partial<Record<UtmKey, string>>

const STORAGE_KEY = 'nl_utm'
const SOCIAL_KEY = 'nl_social'

const SOCIAL_HOST = /(^|\.)(x\.com|t\.co|twitter\.com|linkedin\.com|lnkd\.in|instagram\.com|facebook\.com|fb\.com|fb\.me)$/i

export function readUtmFromSearch(search: string): Utm {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search)
  const utm: Utm = {}
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim().toLowerCase()
    if (value) utm[key] = value.slice(0, 100)
  }
  return utm
}

function hasAny(utm: Utm) {
  return UTM_KEYS.some(key => Boolean(utm[key]))
}

export function readStoredUtm(): Utm {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object') return {}
    const utm: Utm = {}
    for (const key of UTM_KEYS) {
      const value = (data as Record<string, unknown>)[key]
      if (typeof value === 'string' && value) utm[key] = value.slice(0, 100)
    }
    return utm
  } catch {
    return {}
  }
}

export function captureAttribution(): Utm {
  const existing = readStoredUtm()
  if (hasAny(existing)) return existing
  const fromUrl = readUtmFromSearch(window.location.search)
  if (!hasAny(fromUrl)) return {}
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl))
  } catch {
    // Private mode can block storage; this call still returns the URL values.
  }
  return fromUrl
}

export function attributionParams(): Record<string, string> {
  const utm = captureAttribution()
  const params: Record<string, string> = {}
  for (const key of UTM_KEYS) {
    if (utm[key]) params[key] = utm[key]
  }
  return params
}

export function applyUtm(href: string): string {
  if (typeof window === 'undefined' || !href.startsWith('/')) return href
  const utm = readUtmFromSearch(window.location.search)
  if (!hasAny(utm)) return href
  const hashAt = href.indexOf('#')
  const hash = hashAt >= 0 ? href.slice(hashAt) : ''
  const base = hashAt >= 0 ? href.slice(0, hashAt) : href
  const url = new URL(base, window.location.origin)
  for (const key of UTM_KEYS) {
    if (utm[key]) url.searchParams.set(key, utm[key])
  }
  return `${url.pathname}${url.search}${hash}`
}

function referrerIsSocial() {
  if (!document.referrer) return false
  try {
    return SOCIAL_HOST.test(new URL(document.referrer).hostname)
  } catch {
    return false
  }
}

export function visitIsSocial(): boolean {
  try {
    if (sessionStorage.getItem(SOCIAL_KEY) === '1') return true
  } catch {
    // Fall through and decide from this document.
  }
  const utm = { ...captureAttribution(), ...readUtmFromSearch(window.location.search) }
  const social = utm.utm_medium === 'social' || referrerIsSocial()
  if (social) {
    try {
      sessionStorage.setItem(SOCIAL_KEY, '1')
    } catch {
      // Show the bar for this view even if the flag cannot be stored.
    }
  }
  return social
}

function track(name: string, params: Record<string, string>) {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  if (typeof gtag !== 'function') return false
  gtag('event', name, params)
  return true
}

export function sendEvent(name: string, params: Record<string, string>) {
  const payload = { ...attributionParams(), ...params }
  if (track(name, payload)) return
  const started = Date.now()
  const id = window.setInterval(() => {
    if (track(name, payload) || Date.now() - started > 5000) window.clearInterval(id)
  }, 100)
}
