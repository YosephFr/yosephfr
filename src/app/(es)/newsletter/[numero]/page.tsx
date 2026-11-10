import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Footer from '@/components/Footer'
import NewsletterCTA from '@/components/NewsletterCTA'
import DotIcon from '@/components/dots/DotIcon'
import { numerosPublicados } from '@/data/newsletter'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd, social } from '@/lib/seo'

type Props = { params: Promise<{ numero: string }> }

export function generateStaticParams() {
  // El export estático exige al menos una ruta: antes del primer envío, /newsletter/1 sale como «no encontrado».
  const salidos = numerosPublicados().map(n => ({ numero: String(n.numero) }))
  return salidos.length ? salidos : [{ numero: '1' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const numero = Number((await params).numero)
  const n = numerosPublicados().find(x => x.numero === numero)
  if (!n) return {}
  const title = `${n.title} · Newsletter ${n.numero}`
  return {
    title,
    description: n.summary,
    alternates: { canonical: `/newsletter/${n.numero}` },
    ...social({ title: `${title} | Arncof`, description: n.summary, url: `/newsletter/${n.numero}` }),
  }
}

export default async function NumeroPage({ params }: Props) {
  const numero = Number((await params).numero)
  const n = numerosPublicados().find(x => x.numero === numero)
  if (!n) notFound()
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${PROFILE.url}/newsletter/${n.numero}#numero`,
        url: `${PROFILE.url}/newsletter/${n.numero}`,
        headline: n.title,
        description: n.summary,
        datePublished: n.date,
        inLanguage: 'es',
        author: { '@id': `${PROFILE.url}/#person` },
        isPartOf: { '@id': `${PROFILE.url}/newsletter#pagina` },
      },
      breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Newsletter', path: '/newsletter' }, { name: n.title, path: `/newsletter/${n.numero}` }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang="es">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <article className="lectura carta">
          <Link href="/newsletter" className="enlace enlace-suave volver"><DotIcon name="volver" size={13} />Newsletter</Link>
          <p className="meta">Número {n.numero}</p>
          <h1 className="titulo">{n.title}</h1>
          <div className="numero-cuerpo">
            {n.intro.map((p, i) => <p key={i}>{p}</p>)}
            {n.sections.map(s => (
              <section key={s.title}>
                <h2>{s.title}</h2>
                {s.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                {s.link && <Link href={s.link.href} className="lamina enlace-tarjeta"><strong>{s.link.label}</strong><DotIcon name="flecha" size={12} /></Link>}
              </section>
            ))}
            <div className="numero-cierre">{n.close.map((p, i) => <p key={i}>{p}</p>)}</div>
          </div>
        </article>
        <NewsletterCTA anchor="boletin" offer={{ title: 'El próximo, en tu correo', text: 'Cada domingo, lo que probé con IA y el material nuevo de los videos.', button: 'Suscribirme' }} />
      </main>
      <Footer />
    </>
  )
}
