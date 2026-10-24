'use client'

import { useEffect, useRef, useState } from 'react'
import DotIcon from '@/components/dots/DotIcon'
import { copyText } from '@/lib/copy'

export default function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState<boolean | null>(null)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  async function copy() {
    const ok = await copyText(url)
    setCopied(ok)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 2400)
  }
  return (
    <button type="button" onClick={copy} className={`boton boton-tonal${copied ? ' es-ok' : ''}${copied === false ? ' es-aviso' : ''}`}>
      <DotIcon name={copied ? 'listo' : 'copiar'} size={14} />
      <span key={String(copied)} className="boton-etiqueta">{copied ? 'Enlace copiado' : copied === false ? 'No se pudo copiar' : 'Copiar enlace'}</span>
    </button>
  )
}
