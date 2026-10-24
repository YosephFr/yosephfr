import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const origin = 'https://yosephfr.com'
const plain = text => text
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1 ($2)')
  .replace(/\*\*([^*]+)\*\*/g, '$1')
  .replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,;:]|$)/g, '$1$2')
  .replace(/`([^`]+)`/g, '$1')

function articleUrl(article) {
  return `${origin}${article.language === 'en' ? '/en' : ''}/blog/${article.slug}`
}

function articleText(article) {
  const chunks = [
    `# ${article.title}`,
    plain(article.description),
    `URL: ${articleUrl(article)}`,
    `Publicado: ${article.date}`,
    'Autor: Yoseph Franco (https://yosephfr.com/)',
  ]
  for (const block of article.blocks) {
    if (block.type === 'heading') chunks.push(`## ${block.text}`)
    else if (block.type === 'subheading') chunks.push(`### ${block.text}`)
    else if (block.type === 'paragraph') chunks.push(plain(block.text))
    else if (block.type === 'bullets') chunks.push(block.items.map(item => `- ${plain(item)}`).join('\n'))
    else if (block.type === 'list') chunks.push(block.items.map((item, index) => `${(block.start || 1) + index}. ${plain(item)}`).join('\n'))
    else if (block.type === 'code') chunks.push('```' + (block.lang || '') + '\n' + block.text + '\n```')
    else if (block.type === 'table') chunks.push([block.headers.map(plain).join(' | '), ...block.rows.map(row => row.map(plain).join(' | '))].join('\n'))
  }
  return chunks.join('\n\n')
}

export function writeLlms(articles, directory, now = Date.now()) {
  const visible = articles.filter(article => article.publication === 'published' && Date.parse(article.date) <= now)
  const spanish = visible.filter(article => article.language === 'es')
  const english = visible.filter(article => article.language === 'en')
  const link = (title, url, summary) => `- [${title}](${url}): ${summary}`
  const posts = items => items.map(article => link(article.title, articleUrl(article), article.description)).join('\n')
  const llms = `# Yoseph Franco

> AI Engineer en Buenos Aires. Diseña agentes de IA, software y automatizaciones, y escribe sobre agentes, modelos, automatización y herramientas de código con IA.

Datos clave: AI Engineer · idiomas: español e inglés · contacto: ${origin}/contacto

## Español
${link('Inicio', `${origin}/`, 'perfil profesional, áreas de trabajo y artículos recientes')}
${link('CV', `${origin}/cv`, 'experiencia, prácticas actuales y formación')}
${link('Contacto', `${origin}/contacto`, 'correo y perfiles públicos')}
${link('Blog', `${origin}/blog`, 'artículos en español')}
${link('IA y agentes', `${origin}/skills/ai-agents`, 'modelos, herramientas, MCP y coordinación')}
${link('Servicios y APIs', `${origin}/skills/backend-apis`, 'APIs, integraciones y flujos')}
${link('Interfaces y diseño', `${origin}/skills/frontend-react`, 'interfaces claras y probadas en uso')}
${link('Infraestructura cloud', `${origin}/skills/cloud-devops`, 'despliegues, continuidad y observabilidad')}
${link('Ingeniería de IA y agentes', `${origin}/experiencia/ai-engineering`, 'agentes y sistemas en producción')}
${link('Software e infraestructura', `${origin}/experiencia/fullstack-cloud`, 'desarrollo, infraestructura y automatización')}

## English
${link('Home', `${origin}/en`, 'professional profile and recent articles')}
${link('CV', `${origin}/en/cv`, 'experience, current practices and education')}
${link('Contact', `${origin}/en/contact`, 'email and public profiles')}
${link('Articles', `${origin}/en/blog`, 'English articles, plus Spanish originals that do not have an English version yet')}
${link('RSS', `${origin}/en/feed.xml`, 'English feed')}

## Artículos
${posts(spanish)}

## Articles in English
${english.length ? posts(english) : '- No English originals yet. Spanish articles are listed above and linked from the English index.'}

## Cómo citar
- Autor: Yoseph Franco (${origin}/). Cita la URL del artículo y su fecha de publicación.

## Optional
- [Texto completo](${origin}/llms-full.txt)
- [RSS](${origin}/feed.xml)
`
  const full = `# Yoseph Franco

AI Engineer en Buenos Aires. Diseña agentes de IA, software y automatizaciones. Escribe sobre agentes, modelos, automatización y herramientas de código con IA.

Perfil: ${origin}/
CV: ${origin}/cv
Contacto: ${origin}/contacto
English: ${origin}/en

${visible.map(articleText).join('\n\n---\n\n')}
`
  fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(path.join(directory, 'llms.txt'), llms)
  fs.writeFileSync(path.join(directory, 'llms-full.txt'), full)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const articles = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'src/data/articles.json'), 'utf8'))
  for (const directory of process.argv.slice(2)) writeLlms(articles, directory)
  if (process.argv.length < 3) writeLlms(articles, 'public')
}
