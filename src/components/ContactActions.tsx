'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { PROFILE } from '@/data/profile'
import DotIcon from '@/components/dots/DotIcon'
import { copyText } from '@/lib/copy'

type State = 'idle' | 'copied' | 'unavailable'

export default function ContactActions({ variant = 'botones', extra }: { variant?: 'botones' | 'tarjeta'; extra?: ReactNode }) {
  const [state, setState] = useState<State>('idle')
  const address = useRef<HTMLSpanElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function copy() {
    const ok = await copyText(PROFILE.email)
    if (!ok && address.current) {
      const range = document.createRange()
      range.selectNodeContents(address.current)
      const selection = window.getSelection()
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
    setState(ok ? 'copied' : 'unavailable')
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setState('idle'), ok ? 2400 : 5000)
  }

  const label = state === 'copied' ? 'Copiado' : state === 'unavailable' ? 'Correo seleccionado' : 'Copiar correo'
  const message = state === 'copied' ? 'Correo copiado.' : state === 'unavailable' ? 'No se pudo copiar. El correo quedó seleccionado.' : ''

  const buttons = (
    <div className="acciones">
      <a className="boton boton-claro" href={`mailto:${PROFILE.email}`} data-event="contact_email_click">
        <DotIcon name="correo" size={16} />
        Escribir correo
      </a>
      <button
        type="button"
        className={`boton boton-tonal${state === 'copied' ? ' es-ok' : ''}${state === 'unavailable' ? ' es-aviso' : ''}`}
        onClick={copy}
        data-event="contact_email_copy"
      >
        <DotIcon name={state === 'copied' ? 'listo' : 'copiar'} size={16} />
        <span key={state} className="boton-etiqueta">{label}</span>
      </button>
      {extra}
    </div>
  )

  if (variant === 'tarjeta') {
    return (
      <div className="correo-cuerpo">
        <span ref={address} className="correo-grande">{PROFILE.email}</span>
        {buttons}
        <p role="status" className={`estado-texto${state === 'unavailable' ? ' es-aviso' : ''}`}>{message}</p>
      </div>
    )
  }

  return (
    <div>
      {buttons}
      <p className="meta contacto-linea">
        <span ref={address}>{PROFILE.email}</span>
      </p>
      <p role="status" className={state === 'unavailable' ? 'estado-texto es-aviso' : 'solo-lector'}>{message}</p>
    </div>
  )
}
