import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { parseArticle, readArticles } from './import-articles.mjs';
import { verifyPublicExport } from './verify-export.mjs';
const require=createRequire(import.meta.url);
const ts=require('typescript');
const site=path.resolve(import.meta.dirname,'..');
const lab=path.resolve(site,'../../lab/2026-10-23-integracion-web');
fs.mkdirSync(lab,{recursive:true});
const now=Date.parse('2026-10-23T16:00:00Z');
function article(slug,status='publicado',date='2026-10-22T12:30:00-03:00') {
  return `---\nslug: "${slug}"\ntitle: "Guía original ${slug} & agentes"\ndescription: "Descripción ${slug} <prueba> & utilidad"\ncategory: "Agentes"\nlanguage: "es"\nauthor: "Franco"\npublish_after: "${date}"\nupdated_at: "${date}"\nstatus: "${status}"\nprivate_source: "/Users/private/meeting-secret"\n---\nContenido público de prueba para ${slug}, sin material privado de sus fuentes.\n`;
}
function loadTs(relative,dependencies) {
  const code=ts.transpileModule(fs.readFileSync(path.join(site,relative),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
  const loaded={exports:{}};
  new Function('require','module','exports',code)(id=>{if(id in dependencies)return dependencies[id];throw new Error(`Dependencia no prevista: ${id}`);},loaded,loaded.exports);
  return loaded.exports;
}
test('Lote ampliable: tres publicados, borrador y futuro; RSS/sitemap usan la misma selección incluso en preview',async()=>{
  const directory=fs.mkdtempSync(path.join(lab,'editorial-'));
  const originalNow=Date.now,preview=process.env.ARNCOF_PREVIEW;
  try {
    for(const [name,raw] of Object.entries({
      'a.md':article('antiguo','publicado','2026-10-20T12:30:00-03:00'),
      'b.md':article('medio'),
      'c.md':article('tercero-reciente','publicado','2026-10-23T12:30:00-03:00'),
      'd.md':article('borrador-privado','borrador_completo_revisado_codex'),
      'e.md':article('futuro-publicado','publicado','2026-10-23T19:30:00-03:00'),
    })) fs.writeFileSync(path.join(directory,name),raw);
    const data=readArticles(directory);
    assert.equal(data.length,5);
    assert(!JSON.stringify(data).includes('meeting-secret'));
    assert(!JSON.stringify(data).includes('private_source'));
    Date.now=()=>now;
    process.env.ARNCOF_PREVIEW='1';
    const articles=loadTs('src/data/articles.ts',{'./articles.json':data});
    assert.deepEqual(articles.getPublicArticles().map(a=>a.slug),['tercero-reciente','medio','antiguo']);
    assert.equal(articles.getArticles().length,5);
    const rss=loadTs('src/lib/rss.ts',{'@/data/articles':articles,'@/data/profile':{PROFILE:{url:'https://yosephfr.com',updated:'2026-10-23T10:00:00-03:00'}}});
    const feed=loadTs('src/app/feed.xml/route.ts',{'@/data/articles':articles,'@/lib/rss':rss});
    const xml=await feed.GET().text();
    assert(xml.includes('&lt;prueba&gt; &amp; utilidad'));
    assert(!xml.includes('borrador-privado')&&!xml.includes('futuro-publicado'));
    assert.equal((xml.match(/<item>/g)||[]).length,3);
    const sitemap=loadTs('src/app/sitemap.ts',{'@/data/articles':articles,'@/data/profile':{PROFILE:{url:'https://yosephfr.com',updated:'2026-10-23T10:00:00-03:00'}},'@/data/experience':{EXPERIENCE:[]},'@/data/skills':{SKILLS:[]}}).default();
    assert.deepEqual(sitemap.filter(a=>a.url.includes('/blog/')).map(a=>a.url.split('/').at(-1)),['tercero-reciente','medio','antiguo']);
    data.find(a=>a.slug==='antiguo').updated='2026-10-23T12:45:00-03:00';
    const modified=loadTs('src/app/sitemap.ts',{'@/data/articles':articles,'@/data/profile':{PROFILE:{url:'https://yosephfr.com',updated:'2026-10-23T10:00:00-03:00'}},'@/data/experience':{EXPERIENCE:[]},'@/data/skills':{SKILLS:[]}}).default();
    assert.equal(modified.find(a=>a.url==='https://yosephfr.com/blog').lastModified.toISOString(),'2026-10-23T15:45:00.000Z');
    assert.equal(modified.find(a=>a.url==='https://yosephfr.com/blog/antiguo').lastModified.toISOString(),'2026-10-23T15:45:00.000Z');
    delete process.env.ARNCOF_PREVIEW;
    const production=loadTs('src/data/articles.ts',{'./articles.json':data});
    assert.equal(production.getArticles().length,3);
    assert.equal(production.getArticle('borrador-privado'),undefined);
    assert.equal(production.getArticle('futuro-publicado'),undefined);
    Date.now=()=>Date.parse('2026-10-23T22:30:00Z');
    assert.equal(production.getPublicArticles().length,4);
    assert.equal(production.getArticle('borrador-privado'),undefined);
  } finally {Date.now=originalNow;if(preview===undefined)delete process.env.ARNCOF_PREVIEW;else process.env.ARNCOF_PREVIEW=preview;fs.rmSync(directory,{recursive:true,force:true});}
});
test('El importador rechaza metadatos ambiguos, fechas imposibles y slugs repetidos',()=>{
  assert.throws(()=>parseArticle(article('malo').replace('2026-10-22','2026-02-31')),/fecha inválida/);
  assert.throws(()=>parseArticle(article('malo').replace('12:30:00','24:00:00')),/fecha inválida/);
  assert.throws(()=>parseArticle(article('malo').replace('status: "publicado"','status: "publicado"\nstatus: "borrador"')),/duplicado/);
  assert.throws(()=>parseArticle(article('malo').replace('description:','other:')),/description/);
  assert.throws(()=>parseArticle(article('malo').replace('language: "es"','language: "fr"')),/idioma/);
  assert.throws(()=>parseArticle(article('malo').replace('language: "es"','language: "es"\ntranslation: "Mal Slug"')),/translation/);
  const directory=fs.mkdtempSync(path.join(lab,'duplicates-'));
  try {fs.writeFileSync(path.join(directory,'a.md'),article('mismo'));fs.writeFileSync(path.join(directory,'b.md'),article('mismo'));assert.throws(()=>readArticles(directory),/duplicados/);} finally {fs.rmSync(directory,{recursive:true,force:true});}
});
test('El gate de exportación bloquea preview, rutas ocultas, texto en JS, fuentes privadas y feeds divergentes',()=>{
  const directory=fs.mkdtempSync(path.join(lab,'export-'));
  const articles=[parseArticle(article('publicado')),parseArticle(article('borrador-secreto','borrador'))];
  const put=(file,content)=>{fs.mkdirSync(path.dirname(path.join(directory,file)),{recursive:true});fs.writeFileSync(path.join(directory,file),content);};
  const options={root:directory,articles,now,preview:false};
  try {
    put('index.html','<html lang="es">Portada');put('blog.html','<html lang="es">Blog');put('blog/publicado.html','<html lang="es">Publicado');put('404.html','<html lang="es">404');
    put('en.html','<html lang="en">Home');put('en/blog.html','<html lang="en">Blog');put('en/feed.xml','<rss><channel/></rss>');
    put('feed.xml','<rss><channel><item><link>https://yosephfr.com/blog/publicado</link></item></channel></rss>');
    put('sitemap.xml','<urlset><url><loc>https://yosephfr.com/blog/publicado</loc></url></urlset>');
    assert.equal(verifyPublicExport(options).publicArticles,1);
    assert.throws(()=>verifyPublicExport({...options,preview:true}),/ARNCOF_PREVIEW/);
    put('ARNCOF_PREVIEW_DO_NOT_DEPLOY.txt','preview');assert.throws(()=>verifyPublicExport(options),/Marcador/);fs.unlinkSync(path.join(directory,'ARNCOF_PREVIEW_DO_NOT_DEPLOY.txt'));
    put('blog/borrador-secreto.txt','RSC');assert.throws(()=>verifyPublicExport(options),/Ruta editorial/);fs.unlinkSync(path.join(directory,'blog/borrador-secreto.txt'));
    put('_next/static/test.js',JSON.stringify(articles[1]));assert.throws(()=>verifyPublicExport(options),/no público/);
    put('_next/static/test.js','const source="/Users/private/material"');assert.throws(()=>verifyPublicExport(options),/privado/);
    put('_next/static/test.js','const clean=true');
    put('en/blog/sin-articulos.html','marcador');assert.throws(()=>verifyPublicExport(options),/Marcador de lista vacía/);fs.unlinkSync(path.join(directory,'en/blog/sin-articulos.html'));
    put('en.html','<html lang="es">Home');assert.throws(()=>verifyPublicExport(options),/html lang/);put('en.html','<html lang="en">Home');
    put('feed.xml','<rss><channel/></rss>');assert.throws(()=>verifyPublicExport(options),/RSS/);
  } finally {fs.rmSync(directory,{recursive:true,force:true});}
});

test('Fecha pública real: published_at prevalece sin retrofechar la ventana y conserva compatibilidad',()=>{
  const raw=article('fecha-real','publicado','2026-10-23T12:30:00-03:00');
  const scheduled=parseArticle(raw);
  assert.equal(scheduled.date,'2026-10-23T12:30:00-03:00');
  const actual=raw.replace('updated_at: "2026-10-23T12:30:00-03:00"','updated_at: "2026-10-23T15:50:00-03:00"\npublished_at: "2026-10-23T15:50:00-03:00"');
  const published=parseArticle(actual);
  assert.equal(published.date,'2026-10-23T15:50:00-03:00');
  assert.equal(published.updated,published.date);
  assert.equal(published.publication,'published');
  const iso=new Date('2026-10-23T18:50:00.123Z').toISOString().replace(/\.\d{3}Z$/, 'Z');
  const precise=actual.replaceAll('2026-10-23T15:50:00-03:00',iso);
  assert.equal(parseArticle(precise).date,iso);
  assert.equal(parseArticle(precise).updated,iso);
  assert.throws(()=>parseArticle(actual.replace('published_at: "2026-10-23T15:50:00-03:00"','published_at: "2026-10-23T11:50:00-03:00"')),/published_at anterior/);
  assert.throws(()=>parseArticle(actual.replace('published_at: "2026-10-23T15:50:00-03:00"','published_at: "2026-02-31T15:50:00-03:00"')),/fecha inválida/);
});

test('Versión en inglés: parejas recíprocas, rutas /en/blog, feed propio y hreflang en el sitemap',async()=>{
  const directory=fs.mkdtempSync(path.join(lab,'bilingue-'));
  const originalNow=Date.now;
  const en=raw=>raw.replace('language: "es"','language: "en"');
  const pair=(raw,other)=>raw.replace('language:',`translation: "${other}"\nlanguage:`);
  try {
    fs.writeFileSync(path.join(directory,'a.md'),pair(article('guia'),'guide'));
    fs.writeFileSync(path.join(directory,'a.en.md'),pair(en(article('guide')),'guia'));
    fs.writeFileSync(path.join(directory,'b.md'),article('solo-espanol'));
    const data=readArticles(directory);
    assert.equal(data.find(a=>a.slug==='guide').translation,'guia');
    fs.writeFileSync(path.join(directory,'c.en.md'),pair(en(article('huerfano')),'no-existe'));
    assert.throws(()=>readArticles(directory),/pareja recíproca/);
    fs.writeFileSync(path.join(directory,'c.en.md'),pair(en(article('huerfano','publicado','2026-10-21T12:30:00-03:00')),'solo-espanol'));
    fs.writeFileSync(path.join(directory,'b.md'),pair(article('solo-espanol'),'huerfano'));
    assert.throws(()=>readArticles(directory),/misma hora/);
    fs.rmSync(path.join(directory,'c.en.md'));fs.writeFileSync(path.join(directory,'b.md'),article('solo-espanol'));
    Date.now=()=>now;
    const articles=loadTs('src/data/articles.ts',{'./articles.json':readArticles(directory)});
    assert.deepEqual(articles.getPublicArticles('en').map(a=>a.slug),['guide']);
    assert.deepEqual(articles.getPublicArticles().map(a=>a.slug).sort(),['guia','solo-espanol']);
    assert.equal(articles.getArticle('guide'),undefined);
    assert.equal(articles.articlePath(articles.getArticle('guide','en')),'/en/blog/guide');
    assert.equal(articles.getTranslation(articles.getArticle('guide','en')).slug,'guia');
    assert.deepEqual(articles.getEnglishIndex().spanishOnly.map(a=>a.slug),['solo-espanol']);
    const rss=loadTs('src/lib/rss.ts',{'@/data/articles':articles,'@/data/profile':{PROFILE:{url:'https://yosephfr.com',updated:'2026-10-23T10:00:00-03:00'}}});
    const feed=loadTs('src/app/(en)/en/feed.xml/route.ts',{'@/data/articles':articles,'@/lib/rss':rss});
    const xml=await feed.GET().text();
    assert(xml.includes('<link>https://yosephfr.com/en/blog/guide</link>')&&xml.includes('<language>en</language>')&&!xml.includes('guia'));
    const sitemap=loadTs('src/app/sitemap.ts',{'@/data/articles':articles,'@/data/profile':{PROFILE:{url:'https://yosephfr.com',updated:'2026-10-23T10:00:00-03:00'}},'@/data/experience':{EXPERIENCE:[]},'@/data/skills':{SKILLS:[]}}).default();
    const guide=sitemap.find(a=>a.url==='https://yosephfr.com/en/blog/guide');
    assert.deepEqual(guide.alternates.languages,{en:'https://yosephfr.com/en/blog/guide',es:'https://yosephfr.com/blog/guia'});
    assert.equal(sitemap.find(a=>a.url==='https://yosephfr.com/blog/solo-espanol').alternates,undefined);
  } finally {Date.now=originalNow;fs.rmSync(directory,{recursive:true,force:true});}
});
