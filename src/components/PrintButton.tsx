'use client'

import DotIcon from '@/components/dots/DotIcon'

export default function PrintButton() {
  return (
    <button type="button" className="boton boton-tonal" onClick={() => window.print()}>
      <DotIcon name="descargar" size={16} />
      Guardar PDF
    </button>
  )
}
