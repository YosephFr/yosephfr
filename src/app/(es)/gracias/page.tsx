import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import LeadConfirm from '@/components/LeadConfirm'
import { REAL_COST_PATH } from '@/data/real-cost'

export const metadata: Metadata = {
  title: 'Confirma tu suscripción',
  description: 'Te llegó un correo para confirmar la suscripción al newsletter de Franco.',
  alternates: { canonical: '/gracias' },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
}

export default function GraciasPage() {
  return (
    <>
      <LeadConfirm />
      <main id="contenido" lang="es" className="acento-azul gracias">
        <header className="marco pagina-cabeza">
          <h1>Te llegó un correo para confirmar</h1>
          <p className="entrada-texto">Ábrelo y toca el enlace. Desde ahí, cada domingo te llega lo que probé con IA en la semana.</p>
          <div className="acciones">
            <Link href="/newsletter/1" className="boton">Lee el número 1</Link>
            <Link href={REAL_COST_PATH.es} className="boton boton-tonal">Tabla de costo real</Link>
          </div>
        </header>
      </main>
      <Footer />
    </>
  )
}
