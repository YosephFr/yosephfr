import type { Metadata } from 'next'
import Footer from '@/components/Footer'
import MaterialCards from '@/components/MaterialCards'
import NewsletterCTA from '@/components/NewsletterCTA'
import { materialByDate } from '@/data/material'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd, social } from '@/lib/seo'

const title = 'Material de los videos'
const description = 'Los pedidos, archivos y fuentes de cada video y post de Franco, para que lo pruebes tú.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/material' },
  ...social({ title: `${title} | Arncof`, description, url: '/material' }),
}

export default function MaterialPage() {
  const items = materialByDate()
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${PROFILE.url}/material#pagina`,
        url: `${PROFILE.url}/material`,
        name: title,
        description,
        inLanguage: 'es',
        isPartOf: { '@id': `${PROFILE.url}/#website` },
        author: { '@id': `${PROFILE.url}/#person` },
      },
      breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Material', path: '/material' }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang="es">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <header className="marco pagina-cabeza">
          <h1 className="titulo">Lo de los videos</h1>
                  </header>
        <section className="marco seccion seccion-material" aria-label="Material">
          <MaterialCards items={items} level="h2" className="ancho" />
        </section>
        <NewsletterCTA anchor="boletin" offer={{ title: 'Lo que aprendo, cada semana', text: 'Cada domingo, lo que probé con IA y el material nuevo de los videos.', button: 'Suscribirme' }} />
      </main>
      <Footer />
    </>
  )
}
