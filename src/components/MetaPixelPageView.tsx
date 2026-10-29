'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { trackMeta } from '@/lib/meta'

// Replaces the inline PageView so the first load and client navigations
// share one event_id with the Conversions API. The pixel snippet no longer
// tracks PageView itself.
export default function MetaPixelPageView() {
  const pathname = usePathname()

  useEffect(() => {
    trackMeta('PageView')
  }, [pathname])

  return null
}
