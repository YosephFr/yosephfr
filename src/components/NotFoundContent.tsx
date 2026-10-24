import Link from 'next/link'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'
import DotField, { cascade, digitsAt } from '@/components/dots/DotField'

// Contenido de la 404, compartido por la 404 global (URLs que no existen) y la de cada grupo (notFound()).
export default function NotFoundContent() {
  const digits = digitsAt('404', 3, 2)
  const taken = new Set(digits.map(c => c.join(',')))
  const dust = cascade(23, 11, 'arncof-404', 'abajo', 0.55).filter(([x, y]) => y > 9 && !taken.has(`${x},${y}`))
  return (
    <>
      <main id="contenido" className="marco no-encontrada acento-morado">
        <div>
          <h1 className="titulo">Esta página no existe.</h1>
          <p className="entrada-texto">Puede que el enlace haya cambiado o que la página ya no esté.</p>
          <div className="acciones no-encontrada-acciones">
            <Link href="/" className="boton boton-claro"><DotIcon name="inicio" size={16} />Ir al inicio</Link>
            <Link href="/blog" className="boton boton-tonal"><DotIcon name="articulos" size={16} />Ver artículos</Link>
          </div>
        </div>
        <div className="no-encontrada-campo"><DotField cols={23} rows={11} cells={[...digits, ...dust]} label="404" /></div>
      </main>
      <Footer />
    </>
  )
}
