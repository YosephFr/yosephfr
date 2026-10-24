import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';

const decodeXml = value => value.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'");
export function exportFiles(root) {
  const files=[];
  function walk(directory) {
    for(const entry of fs.readdirSync(directory,{withFileTypes:true})) {
      const absolute=path.join(directory,entry.name);
      const relative=path.relative(root,absolute).split(path.sep).join('/');
      if(entry.isSymbolicLink()) throw new Error(`Enlace simbólico en exportación: ${relative}`);
      if(!/^[a-zA-Z0-9_./@%+$()[\]-]+$/.test(relative)) throw new Error(`Ruta no admitida para transferencia: ${relative}`);
      if(entry.isDirectory()) walk(absolute);
      else if(entry.isFile()) files.push(relative);
      else throw new Error(`Archivo especial en exportación: ${relative}`);
    }
  }
  walk(root);
  return files.sort();
}
export const transferredFile = file => file!=='.htaccess'&&file!=='.user.ini'&&file!=='.htpasswd'&&!file.startsWith('.well-known/');

export function verifyPublicExport({root='out',articles=JSON.parse(fs.readFileSync('src/data/articles.json','utf8')),now=Date.now(),preview=process.env.ARNCOF_PREVIEW==='1',origin='https://yosephfr.com'}={}) {
  if(preview) throw new Error('ARNCOF_PREVIEW=1: exportación privada; no transferir.');
  if(fs.existsSync(path.join(root,'ARNCOF_PREVIEW_DO_NOT_DEPLOY.txt'))) throw new Error('Marcador de vista previa: no transferir.');
  const files=exportFiles(root);
  for(const required of ['index.html','feed.xml','sitemap.xml']) if(!files.includes(required)) throw new Error(`Exportación incompleta: falta ${required}`);
  if(!files.includes('blog.html')&&!files.includes('blog/index.html')) throw new Error('Exportación incompleta: falta índice del blog');
  const visible=articles.filter(a=>a.publication==='published'&&Date.parse(a.date)<=now);
  const hidden=articles.filter(a=>!visible.includes(a));
  for(const article of articles) if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) throw new Error('Slug editorial inválido');
  for(const article of visible) {
    if(!files.includes(`blog/${article.slug}.html`)&&!files.includes(`blog/${article.slug}/index.html`)) throw new Error(`Falta página publicable: ${article.slug}`);
    if(!Number.isFinite(Date.parse(article.updated))||Date.parse(article.updated)>now) throw new Error(`Actualización inválida o futura: ${article.slug}`);
  }
  for(const article of hidden) if(files.some(file=>file===`blog/${article.slug}.html`||file===`blog/${article.slug}.txt`||file.startsWith(`blog/${article.slug}/`))) throw new Error(`Ruta editorial no pública: ${article.slug}`);
  const expected=visible.map(a=>`${origin}/blog/${a.slug}`).sort();
  const feed=fs.readFileSync(path.join(root,'feed.xml'),'utf8');
  const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  const feedUrls=[...feed.matchAll(/<item>[\s\S]*?<link>([^<]+)<\/link>[\s\S]*?<\/item>/g)].map(m=>decodeXml(m[1])).sort();
  const sitemapUrls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>decodeXml(m[1])).filter(url=>url.startsWith(`${origin}/blog/`)).sort();
  for(const [label,actual] of [['RSS',feedUrls],['sitemap',sitemapUrls]]) if(JSON.stringify(actual)!==JSON.stringify(expected)) throw new Error(`${label} no coincide con los artículos elegibles`);
  const needles=hidden.flatMap(a=>[a.slug,a.title,...a.blocks.filter(b=>b.type!=='heading').flatMap(b=>b.text?[b.text]:b.items||[]).filter(value=>value.length>=80)].filter(value=>value.length>=16).flatMap(value=>[value,JSON.stringify(value).slice(1,-1)]));
  for(const file of files) {
    if(/(^|\/)(\.env(?:\.|$)|[^/]+\.(?:pem|key)$)/i.test(file)) throw new Error(`Archivo privado en exportación: ${file}`);
    if(!/\.(?:html?|js|mjs|cjs|json|txt|xml|map|css|svg|rsc)$/i.test(file)) continue;
    const text=fs.readFileSync(path.join(root,file),'utf8');
    if(needles.some(value=>text.includes(value))) throw new Error(`Contenido de artículo no público en ${file}`);
    if(/(?:\/Users\/[^\s"<>]+|\/workspace\/|BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY|fuentes_privadas\s*[":]|source_private\s*[":])/.test(text)) throw new Error(`Posible material privado en ${file}; revisar antes de publicar`);
  }
  return {files,publicArticles:visible.length,excludedArticles:hidden.length};
}

export function writeTransferManifest(root,destination) {
  const lines=exportFiles(root).filter(transferredFile).map(file=>`${createHash('sha256').update(fs.readFileSync(path.join(root,file))).digest('hex')}  ${file}`);
  fs.writeFileSync(destination,lines.join('\n')+'\n',{mode:0o600});
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    const articles=process.argv[4]?JSON.parse(fs.readFileSync(process.argv[4],'utf8')):undefined;
    const result=verifyPublicExport({root:process.argv[2]||'out',...(articles?{articles}:{})});
    if(process.argv[3]) writeTransferManifest(process.argv[2]||'out',process.argv[3]);
    console.log(`Exportación pública verificada: ${result.publicArticles} artículos; ${result.excludedArticles} excluidos; ${result.files.length} archivos.`);
  } catch(error) { console.error(error.message);process.exitCode=1; }
}
