import PORTADAS from '@/data/portadas.json'

export type Portada = { sujeto: string; dato: string; realce?: string; tono: 'negro' | 'claro' | 'celeste' }

export function getPortada(slug: string): Portada | undefined {
  const p = (PORTADAS as Record<string, unknown>)[slug]
  return p && typeof p === 'object' ? (p as Portada) : undefined
}

// Portada tipográfica del sitio: de qué habla y el dato en grande, con la palabra clave en la caja celeste
// (el mismo sistema de cajas de los carruseles). Se adapta a la tarjeta cuadrada, ancha o a la banda del artículo.
export default function TypeCover({ portada, lang }: { portada: Portada; lang?: string }) {
  const { sujeto, dato, realce, tono } = portada
  const i = realce ? dato.indexOf(realce) : -1
  return (
    <span className={`tipo-portada tono-${tono}`} lang={lang} aria-hidden="true">
      <span className="tipo-sujeto">{sujeto}</span>
      <span className="tipo-dato">
        {i < 0 ? dato : (<>{dato.slice(0, i)}<mark>{realce}</mark>{dato.slice(i + realce!.length)}</>)}
      </span>
    </span>
  )
}
