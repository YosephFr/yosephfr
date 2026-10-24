'use client'

import DotIcon from '@/components/dots/DotIcon'

export default function PrintButton({ lang = 'es' }: { lang?: 'es' | 'en' }) {
  return (
    <button type="button" className="boton boton-tonal" onClick={() => window.print()}>
      <DotIcon name="descargar" size={16} />
      {lang === 'en' ? 'Save PDF' : 'Guardar PDF'}
    </button>
  )
}
