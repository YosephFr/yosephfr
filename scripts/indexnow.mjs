import fs from 'node:fs'
import path from 'node:path'

const host = 'yosephfr.com'
const endpoint = 'https://api.indexnow.org/indexnow'

function decode(value) {
  return value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
}

function keyFromPublic() {
  const dir = path.resolve('public')
  for (const name of fs.readdirSync(dir)) {
    if (!/^[a-zA-Z0-9-]{8,128}\.txt$/.test(name)) continue
    const key = name.slice(0, -4)
    const body = fs.readFileSync(path.join(dir, name), 'utf8').trim()
    if (body === key) return key
  }
  return ''
}

function urls(xml) {
  const map = new Map()
  if (!xml) return map
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const loc = block[1].match(/<loc>([^<]+)<\/loc>/)?.[1]
    const lastmod = block[1].match(/<lastmod>([^<]*)<\/lastmod>/)?.[1] ?? ''
    if (loc) map.set(decode(loc), lastmod)
  }
  return map
}

async function main() {
  try {
    const beforePath = process.argv[2]
    const afterPath = process.argv[3]
    const key = keyFromPublic()
    if (!key) {
      console.log('IndexNow: no hay clave pública. Se omite el aviso.')
      return
    }
    const before = beforePath && fs.existsSync(beforePath) ? fs.readFileSync(beforePath, 'utf8') : ''
    const after = afterPath && fs.existsSync(afterPath) ? fs.readFileSync(afterPath, 'utf8') : ''
    if (!after) {
      console.log('IndexNow: sitemap nuevo ausente. Se omite el aviso.')
      return
    }
    const previous = urls(before)
    const next = urls(after)
    const changed = []
    for (const [url, lastmod] of next) {
      if (!previous.has(url) || previous.get(url) !== lastmod) changed.push(url)
    }
    if (!changed.length) {
      console.log('IndexNow: ninguna URL del sitemap cambió.')
      return
    }
    const body = {
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList: changed.slice(0, 10000),
    }
    let lastError = 'sin respuesta'
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'content-type': 'application/json; charset=utf-8' },
          body: JSON.stringify(body),
        })
        console.log(`IndexNow: HTTP ${response.status} para ${body.urlList.length} URL (intento ${attempt}).`)
        if (response.ok) return
        lastError = `HTTP ${response.status}`
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        console.log(`IndexNow: fallo de red (intento ${attempt}): ${lastError}`)
      }
      if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
    }
    console.log(`IndexNow: no se pudo avisar (${lastError}). El deploy sigue.`)
  } catch (error) {
    console.log(`IndexNow: error inesperado (${error instanceof Error ? error.message : error}). El deploy sigue.`)
  }
}

await main()
