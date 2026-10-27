'use client'

import Link from 'next/link'
import { useEffect, useState, type ComponentProps } from 'react'
import { applyUtm } from '@/lib/attribution'

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string }

// Mantiene utm_source, utm_medium, utm_campaign y utm_content de la URL actual.
export default function InternalLink({ href, ...rest }: Props) {
  const [to, setTo] = useState(href)
  useEffect(() => {
    setTo(applyUtm(href))
  }, [href])
  return <Link href={to} {...rest} />
}
