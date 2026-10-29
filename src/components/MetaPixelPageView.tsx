'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

// The inline pixel already sends PageView on the first load. Client navigations
// (next/link) do not re-run that script, so those get their own PageView.
export default function MetaPixelPageView() {
  const pathname = usePathname()
  const initial = useRef(true)

  useEffect(() => {
    if (initial.current) {
      initial.current = false
      return
    }
    if (typeof window.fbq === 'function') window.fbq('track', 'PageView')
  }, [pathname])

  return null
}
