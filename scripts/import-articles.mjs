import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function parseArticle(raw, file = 'article.md') {
  const match=raw.replace(/\r\n/g,'\n').match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
  if(!match) throw new Error(`Frontmatter faltante: ${file}`);
  const entries=[...match[1].matchAll(/^(\w+):[ \t]*"([^"\n]*)"$/gm)].map(m=>[m[1],m[2]]);
  if(new Set(entries.map(([key])=>key)).size!==entries.length) throw new Error(`${file}: campo duplicado`);
  const fields=Object.fromEntries(entries);
  for(const field of ['slug','title','description','category','language','author','publish_after','updated_at','status']) {
    if(!fields[field]?.trim()) throw new Error(`${file}: falta ${field}`);
  }
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug)) throw new Error(`${file}: slug inválido`);
  for(const f of ['publish_after','updated_at',...(fields.published_at ? ['published_at'] : [])]) {
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(fields[f])||!Number.isFinite(Date.parse(fields[f]))) throw new Error(`${file}: fecha inválida ${f}`);
    // Date.parse normaliza días inexistentes (por ejemplo 31-febrero).
    const [year,month,day]=fields[f].slice(0,10).split('-').map(Number);
    if(day<1||day>new Date(Date.UTC(year,month,0)).getUTCDate()||Number(fields[f].slice(11,13))>23) throw new Error(`${file}: fecha inválida ${f}`);
  }
  if(fields.published_at && Date.parse(fields.published_at)<Date.parse(fields.publish_after)) throw new Error(`${file}: published_at anterior a publish_after`);
  if(Date.parse(fields.updated_at)<Date.parse(fields.published_at || fields.publish_after)) throw new Error(`${file}: updated_at anterior a fecha de publicación`);
  if(!['es','en'].includes(fields.language)) throw new Error(`${file}: idioma sin ruta pública implementada`);
  // translation: slug de la misma pieza en el otro idioma; las dos versiones se declaran entre sí y salen a la misma hora.
  if(fields.translation!==undefined&&!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.translation)) throw new Error(`${file}: translation inválido`);
  const body=match[2].trim();
  const blocks=body.split(/\n\n+/).map(text=>{
    if(text.startsWith('## ')) return {type:'heading',text:text.slice(3)};
    if(/^\d+\. /.test(text)) return {type:'list',items:text.split('\n').map(x=>x.replace(/^\d+\. /,''))};
    if(/^- /.test(text)) return {type:'bullets',items:text.split('\n').map(x=>x.replace(/^- /,''))};
    return {type:'paragraph',text};
  });
  return {slug:fields.slug,title:fields.title,description:fields.description,category:fields.category,language:fields.language,...(fields.translation?{translation:fields.translation}:{}),author:fields.author,date:fields.published_at || fields.publish_after,updated:fields.updated_at,publication:fields.status==='publicado'?'published':'draft',readingMinutes:Math.max(1,Math.ceil(body.split(/\s+/).length/220)),blocks};
}
export function readArticles(base) {
  const articles=fs.readdirSync(base).filter(f=>f.endsWith('.md')).sort().map(file=>parseArticle(fs.readFileSync(path.join(base,file),'utf8'),file));
  if(new Set(articles.map(a=>a.slug)).size!==articles.length) throw new Error('Slugs duplicados');
  for(const a of articles.filter(a=>a.translation)) {
    const other=articles.find(b=>b.slug===a.translation);
    if(!other||other.language===a.language||other.translation!==a.slug) throw new Error(`${a.slug}: traducción sin pareja recíproca en el otro idioma`);
    if(other.date!==a.date||other.publication!==a.publication) throw new Error(`${a.slug}: la traducción debe publicarse a la misma hora y con el mismo estado`);
  }
  return articles.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  const articles=readArticles(path.resolve(process.cwd(),'../articulos'));
  fs.writeFileSync('src/data/articles.json',JSON.stringify(articles,null,2)+'\n');
  console.log(`Importados ${articles.length} artículos con estado explícito. Campos privados excluidos.`);
}
