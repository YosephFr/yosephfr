import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { REAL_COST_PATH, THANKS_PATH } from '@/data/real-cost'

export const metadata: Metadata = {
  title: 'Confirma tu suscripción',
  description: 'Revisa tu correo y confirma la suscripción; al confirmar recibes la tabla.',
  alternates: { canonical: '/gracias' },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
}

export default function GraciasPage() {
  return (
    <>
      <main id="contenido" lang="es" className="acento-azul gracias">
        <header className="marco pagina-cabeza">
          <h1>Revisa tu correo para confirmar la suscripción</h1>
          <p className="entrada-texto">Revisa tu correo y confirma la suscripción; al confirmar recibes la tabla.</p>
          <div className="acciones">
            <Link href={REAL_COST_PATH.es} className="boton boton-claro">Tabla de costo real</Link>
            <Link href={THANKS_PATH.en} hrefLang="en" lang="en" className="boton boton-tonal">English</Link>
          </div>
        </header>
      </main>
      <Footer />
    </>
  )
}
