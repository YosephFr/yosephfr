// Exporta la portada tipográfica de cada artículo como imagen para compartir (1600×900, webp):
// public/blog/<slug>/portada.webp. Usa los datos de src/data/portadas.json y el mismo diseño que
// .tipo-portada en globals.css, a escala fija.
// Requiere agent-browser (headless, sesión propia) y cwebp.
// Uso: node scripts/portadas.mjs            (todas)
//      node scripts/portadas.mjs <slug> ...  (solo esas)
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'

const site = path.resolve(import.meta.dirname, '..')
const datos = JSON.parse(fs.readFileSync(path.join(site, 'src/data/portadas.json'), 'utf8'))
const pedidas = process.argv.slice(2)
const slugs = Object.keys(datos).filter(k => k !== '_' && (!pedidas.length || pedidas.includes(k)))
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'portadas-'))
const fuentes = path.join(site, 'public/fonts')
const sesion = ['--session', 'portadas-yosephfr']
const ab = (...args) => execFileSync('agent-browser', [...sesion, ...args], { stdio: ['ignore', 'pipe', 'inherit'] })

const fondo = { negro: ['#0b0b0c', '#ffffff', '#86c8ff', '#0b0b0c'], claro: ['#e6e7ea', '#0b0b0c', '#0b0b0c', '#ffffff'], celeste: ['#dcecfd', '#0b0b0c', '#0b0b0c', '#ffffff'] }
const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function html({ sujeto, dato, realce, tono }) {
  const [bg, tinta, caja, letraCaja] = fondo[tono]
  const i = realce ? dato.indexOf(realce) : -1
  const cuerpo = i < 0 ? esc(dato) : `${esc(dato.slice(0, i))}<mark>${esc(realce)}</mark>${esc(dato.slice(i + realce.length))}`
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Be Vietnam Pro"; src: url("file://${fuentes}/bevietnampro-800-latin.woff2") format("woff2"); font-weight: 800; }
@font-face { font-family: "Be Vietnam Pro"; src: url("file://${fuentes}/bevietnampro-800-latin-ext.woff2") format("woff2"); font-weight: 800; unicode-range: U+0100-02AF; }
@font-face { font-family: "Manrope"; src: url("file://${fuentes}/manrope-latin-wght-normal.woff2") format("woff2"); font-weight: 200 800; }
html, body { margin: 0; width: 1600px; height: 900px; }
body { background: ${bg}; color: ${tinta}; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; padding: 96px 104px 104px; -webkit-font-smoothing: antialiased; }
.arriba { display: flex; justify-content: space-between; align-items: baseline; font: 700 46px/1.2 "Manrope", sans-serif; }
.arriba span { opacity: 0.78; } .arriba .sitio { font-size: 34px; opacity: 0.6; }
.dato { font: 800 150px/1.14 "Be Vietnam Pro", sans-serif; max-width: 15ch; text-wrap: balance; }
mark { background: ${caja}; color: ${letraCaja}; padding: 0 0.14em; border-radius: 0.16em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
</style></head><body><div class="arriba"><span>${esc(sujeto)}</span><span class="sitio">yosephfr.com</span></div><div class="dato">${cuerpo}</div></body></html>`
}

ab('set', 'viewport', '1600', '900')
for (const slug of slugs) {
  const pagina = path.join(tmp, `${slug}.html`)
  fs.writeFileSync(pagina, html(datos[slug]))
  ab('open', `file://${pagina}`)
  ab('wait', '400')
  const png = path.join(tmp, `${slug}.png`)
  ab('screenshot', png)
  const dir = path.join(site, 'public/blog', slug)
  fs.mkdirSync(dir, { recursive: true })
  execFileSync('cwebp', ['-quiet', '-q', '86', png, '-o', path.join(dir, 'portada.webp')])
  console.log('portada', slug)
}
ab('close')
fs.rmSync(tmp, { recursive: true, force: true })
