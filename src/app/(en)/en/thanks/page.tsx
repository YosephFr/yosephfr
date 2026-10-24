import type { Metadata } from 'next'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { REAL_COST_PATH, THANKS_PATH } from '@/data/real-cost'

export const metadata: Metadata = {
  title: 'Confirm your subscription',
  description: 'Check your email and confirm the subscription; when you confirm, you receive the table.',
  alternates: { canonical: '/en/thanks' },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
}

export default function ThanksPage() {
  return (
    <>
      <main id="contenido" lang="en" className="acento-azul gracias">
        <header className="marco pagina-cabeza">
          <h1>Check your email to confirm the subscription</h1>
          <p className="entrada-texto">Check your email and confirm the subscription; when you confirm, you receive the table.</p>
          <div className="acciones">
            <Link href={REAL_COST_PATH.en} className="boton boton-claro">Real-cost table</Link>
            <Link href={THANKS_PATH.es} hrefLang="es" lang="es" className="boton boton-tonal">Español</Link>
          </div>
        </header>
      </main>
      <Footer lang="en" />
    </>
  )
}
