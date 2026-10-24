import fs from 'node:fs';
import path from 'node:path';
import { verifyPublicExport } from './verify-export.mjs';
import { writeLlms } from './write-llms.mjs';
const articles=JSON.parse(fs.readFileSync('src/data/articles.json','utf8'));
const preview=process.env.ARNCOF_PREVIEW==='1';
const visible=articles.filter(a=>a.publication==='published'&&Date.parse(a.date)<=Date.now());
if(preview){
  fs.writeFileSync('out/ARNCOF_PREVIEW_DO_NOT_DEPLOY.txt','Vista previa editorial local. Incluye borradores. No desplegar.\n');
}else{
  writeLlms(articles, 'out');
  for(const a of articles.filter(a=>!visible.includes(a))){
    if(!/^[a-z0-9-]+$/.test(a.slug))throw new Error('Slug no valido');
    for(const suffix of ['.html','.txt',''])fs.rmSync(path.join('out',a.language==='en'?'en/blog':'blog',a.slug+suffix),{force:true,recursive:true});
  }
  // Marcador que generateStaticParams emite cuando un idioma todavía no tiene artículos visibles.
  for(const dir of ['blog','en/blog'])for(const suffix of ['.html','.txt',''])fs.rmSync(path.join('out',dir,'sin-articulos'+suffix),{force:true,recursive:true});
  verifyPublicExport({articles});
}
console.log(preview?'Vista previa marcada: no desplegar.':`Exportacion final: ${visible.length} articulos publicables; borradores excluidos.`);
