import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { parseArticle, readArticles } from './import-articles.mjs';
import { sourceSnapshot, jsonBytes, sha256, exportManifest, validateRelease } from './release-web.mjs';
import { verifyPublicExport } from './verify-export.mjs';
import { qaRelease } from './qa-release.mjs';

const entry=fileURLToPath(import.meta.url), site=path.resolve(import.meta.dirname,'..'), workspace=path.resolve(site,'../..');
const guard=path.join(workspace,'contenido/herramientas/recursos.py'), vm=process.env.ARNCOF_VM==='1';
// En la VM no rige la guarda del Mac: se coordina un solo trabajo pesado a la vez.
if(!vm&&spawnSync('python3',[guard,'check','--entry',entry,'--pid',String(process.pid)],{stdio:'inherit'}).status!==0)throw new Error('Runner sin lease válido; no iniciar');
if(process.argv.length!==3||!path.isAbsolute(process.argv[2]))throw new Error('Uso bajo guarda: preparar-release.mjs /ruta/absoluta/nueva');
const release=path.resolve(process.argv[2]);
if(!release.startsWith(path.join(workspace,'lab')+'/')||fs.existsSync(release)||fs.realpathSync(path.dirname(release))!==path.dirname(release))throw new Error('El release debe ser nuevo, sin enlaces y dentro del lab del workspace');
if(process.env.ARNCOF_PREVIEW)throw new Error('No preparar release con ARNCOF_PREVIEW');
if(!vm)for(const key of ['CIRCLE_NODE_TOTAL','NEXT_WEBPACK_PARALLELISM','UV_THREADPOOL_SIZE','RAYON_NUM_THREADS','TOKIO_WORKER_THREADS'])assert.equal(process.env[key],'1',key);
process.chdir(site);
fs.mkdirSync(release,{mode:0o700});
const write=(name,value)=>fs.writeFileSync(path.join(release,name),typeof value==='string'||Buffer.isBuffer(value)?value:jsonBytes(value),{mode:0o600,flag:'wx'});
const state={started_at:new Date().toISOString(),status:'preparing',builds:0,deploy_executed:false,article_public_readback:null,stages:[]};
const previous=path.join(release,'preexisting-local-output');
let buildStarted=false;
const logStage=name=>{state.stages.push({name,at:new Date().toISOString()});console.log(name);};
try {
  // No instalación. El lock y las versiones presentes deben seguir coincidiendo.
  const lock=JSON.parse(fs.readFileSync('package-lock.json'));
  let installed=0;
  for(const [key,value] of Object.entries(lock.packages||{})) {
    if(!key.startsWith('node_modules/'))continue;
    const file=path.join(site,key,'package.json');
    if(!fs.existsSync(file)) {if(value.optional)continue;throw new Error('Dependencia obligatoria ausente: '+key);}
    assert.equal(JSON.parse(fs.readFileSync(file)).version,value.version,'Versión distinta: '+key);installed++;
  }
  write('dependencies.json',{lock_sha256:sha256(fs.readFileSync('package-lock.json')),installed,install_performed:false});
  // La forma esperada por Next 16 está ya presente: no permitir una autoedición tardía.
  const envDeclaration='/// <reference types="next" />\n/// <reference types="next/image-types/global" />\nimport "./.next/types/routes.d.ts";\n\n// NOTE: This file should not be edited\n// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.\n';
  assert.equal(fs.readFileSync('next-env.d.ts','utf8'),envDeclaration,'next-env debe normalizarse antes del snapshot');
  const config=JSON.parse(fs.readFileSync('tsconfig.json'));
  for(const include of ['.next/types/**/*.ts','.next/dev/types/**/*.ts','**/*.mts'])assert(config.include.includes(include));
  // Artículos autorizados para este release. La fecha pública es su ventana editorial (publish_after); la hora real de deploy se registra aparte.
  const authorized=['01-referencias-antes-de-redisenar.md','02-continuidad-entre-sesiones.md'];
  const beforeArticles=readArticles(path.resolve(site,'../articulos'));
  assert.equal(beforeArticles.length,6);assert(beforeArticles.every(a=>a.publication==='draft'));
  const originalArticles=Object.fromEntries(fs.readdirSync(path.resolve(site,'../articulos')).filter(n=>n.endsWith('.md')).map(n=>[n,sha256(fs.readFileSync(path.resolve(site,'../articulos',n)))]));
  write('editorial-before.json',{hashes:originalArticles,authorized,original_status:'borrador_completo_revisado_codex',public_readback:null});
  for(const name of authorized) {
    const articleFile=path.resolve(site,'../articulos',name), raw=fs.readFileSync(articleFile,'utf8');
    assert(raw.includes('status: "borrador_completo_revisado_codex"'));assert(!raw.includes('published_at:'));
    const window=raw.match(/^publish_after: "([^"]+)"$/m)[1];
    assert(Date.parse(window)<=Date.now(),'Ventana futura: '+name);
    const updated=raw.replace('status: "borrador_completo_revisado_codex"','status: "publicado"');
    parseArticle(updated,name);
    write(name.slice(0,2)+'-before.md',raw);write(name.slice(0,2)+'-prepared.md',updated);
    fs.writeFileSync(articleFile,updated);
  }
  state.publication_metadata_meaning='Fecha pública = ventana editorial; producción aún no publicada ni leída';
  for(const [name,hash] of Object.entries(originalArticles))if(!authorized.includes(name))assert.equal(sha256(fs.readFileSync(path.resolve(site,'../articulos',name))),hash);
  const catalog=readArticles(path.resolve(site,'../articulos'));
  const visible=catalog.filter(a=>a.publication==='published'&&Date.parse(a.date)<=Date.now());
  assert.deepEqual(visible.map(a=>a.slug).sort(),['continuidad-entre-sesiones-de-agentes','referencias-antes-de-redisenar']);
  const catalogBytes=jsonBytes(catalog);
  fs.writeFileSync('src/data/articles.json',catalogBytes);
  write('articles.json',catalogBytes);
  const sources=jsonBytes(sourceSnapshot(site));write('sources.json',sources);
  const sourcesHash=sha256(sources);
  write('output-ownership.json',{site,previous,outputs:['.next','out'],existing:['.next','out'].filter(name=>fs.existsSync(name)),created_at:new Date().toISOString()});
  fs.mkdirSync(previous,{mode:0o700});
  for(const name of ['.next','out'])if(fs.existsSync(name))fs.renameSync(name,path.join(previous,name));
  logStage('build-start');buildStarted=true;state.builds=1;
  const started=new Date().toISOString(),command=['npm','run','build','--','--webpack'];
  const fd=fs.openSync(path.join(release,'build.log'),'wx',0o600);
  let code;
  try {
    code=await new Promise((resolve,reject)=>{
      const child=spawn(command[0],command.slice(1),{cwd:site,env:process.env,stdio:['ignore',fd,fd]});
      child.once('error',reject);child.once('exit',value=>resolve(value));
    });
  } finally {fs.closeSync(fd);}
  const finished=new Date().toISOString();state.build_exit_code=code;
  assert.equal(code,0,'El único build falló; no reintentar');
  const after=jsonBytes(sourceSnapshot(site));
  write('sources-after.json',after);
  assert.equal(after,sources,'Fuente cambiada o autoeditada durante build; release inválido');
  logStage('freeze-export');
  fs.cpSync('out',path.join(release,'export'),{recursive:true,errorOnExist:true,force:false});
  fs.mkdirSync(path.join(release,'export/_next/static'),{recursive:true});
  fs.writeFileSync(path.join(release,'export/_next/static/.htaccess'),'Header set Cache-Control "public, max-age=31536000, immutable"\n');
  const gate=verifyPublicExport({root:path.join(release,'export'),articles:catalog});
  assert.equal(gate.publicArticles,2);assert.equal(gate.excludedArticles,4);
  const exported=exportManifest(path.join(release,'export'));write('export.sha256',exported);
  const bound={sources_sha256:sourcesHash,catalog_sha256:sha256(catalogBytes),export_sha256:sha256(exported)};
  const manifest={version:1,...bound,build:{started_at:started,finished_at:finished,exit_code:code,preview:false,command,sources_before_sha256:sourcesHash,sources_after_sha256:sha256(after),export_sha256:bound.export_sha256,log:'build.log',log_sha256:sha256(fs.readFileSync(path.join(release,'build.log')))}};
  write('release.json',manifest);
  logStage('qa-start');
  const runtime=await qaRelease(release);
  const finalGate=verifyPublicExport({root:path.join(release,'export'),articles:catalog});
  assert.equal(exportManifest(path.join(release,'export')),exported);
  fs.writeFileSync(path.join(release,'qa/gate.json'),jsonBytes({publicArticles:finalGate.publicArticles,excludedArticles:finalGate.excludedArticles,files:finalGate.files.length,at:new Date().toISOString()}),{mode:0o600});
  const evidence=fs.readdirSync(path.join(release,'qa')).sort().map(name=>({path:'qa/'+name,sha256:sha256(fs.readFileSync(path.join(release,'qa',name)))}));
  write('qa.json',{version:1,status:'passed',checked_at:new Date().toISOString(),release_sha256:sha256(fs.readFileSync(path.join(release,'release.json'))),...bound,checks:{...runtime.checks,public_export_gate:true},evidence});
  const verified=validateRelease(release);
  state.status='ready_for_dry_run';state.release_sha256=verified.release_sha256;state.export_sha256=bound.export_sha256;
  logStage('release-verified');
} catch(error) {
  state.status='failed';state.error=error.stack;process.exitCode=1;console.error(error.stack);
} finally {
  // Solo se eliminan salidas nuevas de este intento; las anteriores vuelven intactas.
  if(buildStarted)for(const name of ['.next','out'])fs.rmSync(path.join(site,name),{recursive:true,force:true});
  for(const name of ['.next','out'])if(fs.existsSync(path.join(previous,name)))fs.renameSync(path.join(previous,name),path.join(site,name));
  if(fs.existsSync(previous)&&fs.readdirSync(previous).length===0)fs.rmdirSync(previous);
  state.finished_at=new Date().toISOString();write('result.json',state);
  console.log(JSON.stringify(state));
}
