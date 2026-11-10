import type { Metadata } from 'next'
import Link from 'next/link'
import { articlePath, getPublicArticles } from '@/data/articles'
import { materialEnSitio } from '@/data/material'
import { ultimoNumero } from '@/data/newsletter'
import { PROFILE } from '@/data/profile'
import { jsonLd, profilePage } from '@/lib/seo'
import ArticleCards from '@/components/blog/ArticleCards'
import Hero from '@/components/Hero'
import MaterialCards from '@/components/MaterialCards'
import NewsletterCTA from '@/components/NewsletterCTA'
import Footer from '@/components/Footer'
import DotIcon from '@/components/dots/DotIcon'
import { alternates } from '@/lib/lang'

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: alternates('/', '/en'), types: { 'application/rss+xml': '/feed.xml' } },
}

// Quien llega desde un video viene a buscar algo: primero el material, después el newsletter.
export default function Home() {
  const ultimo = ultimoNumero()
  const articles = getPublicArticles()
  const material = materialEnSitio()
  const schema = {
    '@context': 'https://schema.org',
    ...profilePage({
      id: `${PROFILE.url}/#perfil`,
      url: `${PROFILE.url}/`,
      name: `${PROFILE.brand} · ${PROFILE.name}`,
      inLanguage: 'es',
      hasPart: articles.slice(0, 3).map(a => ({
        '@type': 'BlogPosting',
        headline: a.title,
        url: `${PROFILE.url}${articlePath(a)}`,
        datePublished: a.date,
        inLanguage: a.language,
        author: { '@id': `${PROFILE.url}/#person` },
      })),
    }),
  }
  return (
    <>
      <main id="contenido" className="inicio">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(schema) }} />
        <Hero />
        {material.length > 0 && (
          <section id="material" className="marco seccion seccion-material" aria-labelledby="material-titulo">
            <div className="seccion-fila">
              <h2 id="material-titulo">Lo de los videos</h2>
              {material.length > 6 && <Link href="/material" className="enlace">Todo <DotIcon name="flecha" size={13} /></Link>}
            </div>
            <MaterialCards items={material.slice(0, 6)} />
          </section>
        )}
        <NewsletterCTA anchor="boletin" offer={{ title: 'Lo que aprendo, cada semana', text: 'Cada domingo, lo que probé con IA y el material nuevo de los videos.', button: 'Suscribirme' }}>
          {ultimo && <Link href={`/newsletter/${ultimo.numero}`} className="boletin-leer">Lee el número {ultimo.numero}: {ultimo.title} <DotIcon name="flecha" size={12} /></Link>}
        </NewsletterCTA>
        {articles.length > 0 && (
          <section className="marco seccion inicio-articulos" aria-labelledby="articulos-titulo">
            <div className="seccion-fila">
              <h2 id="articulos-titulo">Artículos</h2>
              <Link href="/blog" className="enlace">Todos <DotIcon name="flecha" size={13} /></Link>
            </div>
            <ArticleCards articles={articles.slice(0, 4)} />
          </section>
        )}
        <section className="marco seccion" aria-labelledby="quien-titulo">
          <div className="quien">
            <div className="quien-texto">
              <h2 id="quien-titulo">Quién te lo cuenta</h2>
              <p className="entrada-texto">Llevo más de diez años programando y trabajando en informática. Desde que los modelos de lenguaje empezaron a programar directo en la computadora, lanzo diez veces más proyectos a producción. Lo que antes pedía un equipo multidisciplinario hoy lo saca un equipo reducido de alto rendimiento.</p>
              <Link href="/cv" className="enlace">Mi CV <DotIcon name="flecha" size={13} /></Link>
            </div>
            <ul className="quien-cifras">
              <li><strong>14.000</strong><span>conversaciones al mes atendidas con IA en lo que tengo en producción</span></li>
              <li><strong>400 USD</strong><span>al mes en Claude y Codex, que a precio de API serían entre 18 y 30 mil</span></li>
            </ul>
          </div>
        </section>
        <section className="marco seccion" aria-labelledby="proposito-titulo">
          <div className="proposito">
            <h2 id="proposito-titulo">Que seamos muchísimos más</h2>
            <p className="entrada-texto">A todos nos conviene que no sea yo solo lanzando startups, sino muchísimos más, y que en Latinoamérica avancemos todos juntos. Por eso explico aquí cómo lo hago: para que mejores tus habilidades y tu entendimiento, y la pasemos bien en el camino.</p>
            <Link href="/material" className="enlace">Empieza por lo de los videos <DotIcon name="flecha" size={13} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
