// Lo que ya llegó a su hora y todavía no está en el sitio publicado.
// Compara los artículos y el material con fecha cumplida contra el sitemap en vivo.
// Imprime una ruta por línea; vacío si no falta nada. Lo usa .github/workflows/publicar-a-su-hora.yml.
import fs from 'node:fs'
import path from 'node:path'

const site = path.resolve(import.meta.dirname, '..')
const origin = 'https://yosephfr.com'
const now = Date.now()

const articles = JSON.parse(fs.readFileSync(path.join(site, 'src/data/articles.json'), 'utf8'))
const rutas = articles
  .filter(a => a.publication === 'published' && Date.parse(a.date) <= now)
  .map(a => `${a.language === 'en' ? '/en' : ''}/blog/${a.slug}`)

const material = fs.readFileSync(path.join(site, 'src/data/material.ts'), 'utf8')
for (const m of material.matchAll(/slug: '([a-z0-9-]+)',[\s\S]*?date: '([^']+)'/g)) {
  if (Date.parse(m[2]) <= now) rutas.push(`/material/${m[1]}`)
}

const res = await fetch(`${origin}/sitemap.xml`, { headers: { 'cache-control': 'no-cache' } })
if (!res.ok) throw new Error(`sitemap ${res.status}`)
const vivo = new Set([...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace(origin, '')))
for (const ruta of rutas) if (!vivo.has(ruta)) console.log(ruta)
