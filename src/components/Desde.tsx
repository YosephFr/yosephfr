'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Lo programado (data-desde) aparece solo cuando llega su hora, aunque la página siga abierta.
export default function Desde() {
  const ruta = usePathname()
  useEffect(() => {
    const revisar = () => {
      const ahora = Date.now()
      document.querySelectorAll<HTMLElement>('[data-desde][hidden]').forEach(el => {
        if (Date.parse(el.dataset.desde ?? '') <= ahora) el.hidden = false
      })
    }
    revisar()
    const reloj = window.setInterval(revisar, 60000)
    return () => window.clearInterval(reloj)
  }, [ruta])
  return null
}
