import { PROFILE } from '@/data/profile'
import { jsonLd, personNode } from '@/lib/seo'

// Contacto público único: el correo de PROFILE, sin teléfono ni dirección.
export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      personNode(),
      { '@type': 'WebSite', '@id': `${PROFILE.url}/#website`, name: PROFILE.brand, url: PROFILE.url, inLanguage: ['es', 'en'], publisher: { '@id': `${PROFILE.url}/#person` } },
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
}
