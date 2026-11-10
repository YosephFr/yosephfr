'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Las secciones que están más abajo suben un poco cuando llegan a la pantalla.
// Lo que ya se ve al cargar no se toca, y sin JavaScript o con menos movimiento todo queda visible.
const SELECTOR = '.seccion, .estante > li, .articulos > *, .numeros > li, .material-bloques > *'

export default function Revelar() {
  const ruta = usePathname()
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const alto = window.innerHeight
    const todos = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR)).filter(el => el.getBoundingClientRect().top > alto * 0.92)
    if (!todos.length) return
    todos.forEach(el => el.classList.add('por-revelar'))
    const obs = new IntersectionObserver(entradas => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue
        e.target.classList.add('revelado')
        obs.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -8% 0px' })
    todos.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [ruta])
  return null
}
