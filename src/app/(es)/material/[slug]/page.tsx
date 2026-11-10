import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CopyText from '@/components/CopyText'
import DotIcon from '@/components/dots/DotIcon'
import Footer from '@/components/Footer'
import NewsletterCTA from '@/components/NewsletterCTA'
import { getMaterial, materialByDate } from '@/data/material'
import { PROFILE } from '@/data/profile'
import { breadcrumbs, jsonLd, social } from '@/lib/seo'

export const dynamic = 'force-static'
type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return materialByDate().map(m => ({ slug: m.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = getMaterial((await params).slug)
  if (!m) return {}
  return {
    title: m.title,
    description: m.summary,
    alternates: { canonical: `/material/${m.slug}` },
    ...social({ title: `${m.title} | Arncof`, description: m.summary, url: `/material/${m.slug}`, type: 'article' }),
  }
}

const fecha = (d: string) => new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(d))

export default async function MaterialItem({ params }: Props) {
  const m = getMaterial((await params).slug)
  if (!m) notFound()
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${PROFILE.url}/material/${m.slug}#material`,
        url: `${PROFILE.url}/material/${m.slug}`,
        name: m.title,
        description: m.summary,
        datePublished: m.date,
        inLanguage: 'es',
        image: `${PROFILE.url}${m.cover.src}`,
        author: { '@id': `${PROFILE.url}/#person` },
      },
      breadcrumbs([{ name: 'Inicio', path: '/' }, { name: 'Material', path: '/material' }, { name: m.title, path: `/material/${m.slug}` }]),
    ],
  }
  return (
    <>
      <main id="contenido" lang="es">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <article className="marco material-pieza">
          <aside className="pieza-lado">
            <img src={m.poster.src} width={m.poster.width} height={m.poster.height} alt={m.cover.alt} className="pieza-cartel" fetchPriority="high" />
          </aside>
          <div className="pieza-cuerpo">
          <Link href="/material" className="enlace enlace-suave volver"><DotIcon name="volver" size={13} />Lo de los videos</Link>
          <p className="meta">{m.where} · {fecha(m.date)}</p>
          <h1 className="titulo">{m.title}</h1>
          <p className="entrada-texto">{m.summary}</p>
          {m.watch && m.watch.length > 0 && (
            <ul className="pieza-ver" aria-label="Dónde verlo">
              {m.watch.map(l => (
                <li key={l.href}><a href={l.href} target="_blank" rel="noopener noreferrer" data-event="material_watch" data-channel={l.label}>Verlo en {l.label} <DotIcon name="salida" size={11} /></a></li>
              ))}
            </ul>
          )}
          <div className="material-bloques">
            {m.blocks.map((b, i) => {
              if (b.type === 'texto') return <p key={i} className="material-parrafo">{b.text}</p>
              if (b.type === 'pedido') return (
                <figure key={i} className="pedido">
                  <figcaption>{b.label}</figcaption>
                  <blockquote>{b.text}</blockquote>
                  <CopyText text={b.text} />
                </figure>
              )
              if (b.type === 'vista') return (
                <figure key={i} className="vista">
                  <a href={b.href} target="_blank" rel="noopener" className="vista-imagen" data-event="material_view">
                    <img src={b.src} width={b.width} height={b.height} alt={b.alt} loading="lazy" />
                  </a>
                  <figcaption><a href={b.href} target="_blank" rel="noopener" className="enlace">Abrir la página <DotIcon name="salida" size={11} /></a></figcaption>
                </figure>
              )
              return (
                <section key={i} className="enlaces-bloque">
                  <h2>{b.title}</h2>
                  <ul>
                    {b.links.map(l => (
                      <li key={l.href}>
                        <a href={l.href} {...(l.href.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })} className="lamina enlace-tarjeta">
                          <span><strong>{l.label}</strong>{l.note && <span className="meta">{l.note}</span>}</span>
                          <DotIcon name={l.href.startsWith('/') ? 'flecha' : 'salida'} size={12} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )
            })}
          </div>
          </div>
        </article>
        <NewsletterCTA anchor="boletin" offer={{ title: 'Lo que aprendo, cada semana', text: 'Cada domingo, lo que probé con IA y el material nuevo de los videos.', button: 'Suscribirme' }} />
      </main>
      <Footer />
    </>
  )
}
