'use client'

const CAPI_URL = 'https://yosephfr-capi.yosephfr.workers.dev/events'
type MetaEvent = 'PageView' | 'ViewContent' | 'Contact' | 'Lead'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function cookie(name: string) {
  const m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : undefined
}

// _fbc: cookie; si no existe pero la URL trae fbclid, se arma fb.1.<ms>.<fbclid>
function readFbc() {
  const c = cookie('_fbc')
  if (c) return c
  const id = new URLSearchParams(location.search).get('fbclid')
  return id ? `fb.1.${Date.now()}.${id}` : undefined
}

// The pixel snippet is lazyOnload, so the first effect can run before the stub
// exists. Retry with the same eventID; the stub queues the call once it loads.
function sendPixel(name: MetaEvent, data: Record<string, string>, eventID: string) {
  const fire = () => {
    if (typeof window.fbq !== 'function') return false
    window.fbq('track', name, data, { eventID })
    return true
  }
  if (fire()) return
  const delays = [200, 600, 1500, 4000, 8000]
  const tryLater = (index: number) => {
    window.setTimeout(() => {
      if (fire() || index >= delays.length - 1) return
      tryLater(index + 1)
    }, delays[index])
  }
  tryLater(0)
}

export function trackMeta(name: MetaEvent, data: Record<string, string> = {}, extra: { em?: string } = {}) {
  const eventID = crypto.randomUUID()
  const em = extra.em && /^[a-f0-9]{64}$/.test(extra.em) ? extra.em : undefined
  sendPixel(name, data, eventID)
  // A Lead without a hashed email is rejected by the worker. Pixel only.
  if (name === 'Lead' && !em) return
  const body = JSON.stringify({
    event_name: name,
    event_id: eventID,
    event_source_url: location.href.split('#')[0],
    fbp: cookie('_fbp'),
    fbc: readFbc(),
    custom_data: data,
    ...(em ? { em } : {}),
  })
  try {
    // text/plain evita el preflight; el worker parsea igual el JSON
    const blob = new Blob([body], { type: 'text/plain' })
    if (navigator.sendBeacon?.(CAPI_URL, blob)) return
  } catch {
    // Beacon can throw; fetch below is the fallback.
  }
  fetch(CAPI_URL, { method: 'POST', body, keepalive: true, mode: 'cors', headers: { 'Content-Type': 'application/json' } }).catch(() => {})
}

export async function sha256Email(email: string) {
  const n = email.trim().toLowerCase()
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(n))
  return [...new Uint8Array(d)].map(b => b.toString(16).padStart(2, '0')).join('')
}
