'use client'

import { useEffect } from 'react'
import { trackMeta } from '@/lib/meta'
import type { Lang } from '@/lib/lang'

export default function MetaViewContent({ name, type, lang }: { name: string; type: 'article' | 'resource'; lang: Lang }) {
  useEffect(() => {
    trackMeta('ViewContent', { content_name: name, content_type: type, lang })
  }, [name, type, lang])
  return null
}
