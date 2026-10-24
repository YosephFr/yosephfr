import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { readArticles } from './import-articles.mjs';
import { exportFiles, verifyPublicExport, writeTransferManifest } from './verify-export.mjs';

export const sha256 = value => createHash('sha256').update(value).digest('hex');
export const jsonBytes = value => JSON.stringify(value, null, 2) + '\n';
const cacheHeader = 'Header set Cache-Control "public, max-age=31536000, immutable"\n';
const requiredChecks = ['command_palette_runtime', 'memory_contrast_runtime', 'article_runtime', 'public_export_gate'];
const defaultSite = path.resolve(import.meta.dirname, '..');

function regular(file) {
  if (!fs.lstatSync(file).isFile()) throw new Error(`Archivo de release no regular: ${path.basename(file)}`);
  return fs.readFileSync(file);
}

function contained(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.split('/').some(p => !p || p === '.' || p === '..')) throw new Error('Ruta inválida en evidencia de release');
  const target = path.join(root, relative);
  if (fs.realpathSync(target) !== target) throw new Error('Enlace en evidencia de release');
  return target;
}

function entries(root, prefix = '') {
  const result = [];
  for (const item of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    const file = path.join(root, item.name), relative = prefix + item.name;
    if (item.isDirectory()) result.push(...entries(file, relative + '/'));
    else if (item.isFile()) result.push({ path: relative, sha256: sha256(regular(file)) });
    else throw new Error(`Fuente no regular: ${relative}`);
  }
  return result;
}

// Hashes únicamente: las fuentes privadas y .env nunca se copian al export.
export function sourceSnapshot(site = defaultSite) {
  const files = [];
  for (const directory of ['src', 'public', 'scripts']) {
    const root = path.join(site, directory);
    if (fs.existsSync(root)) {
      if (!fs.lstatSync(root).isDirectory()) throw new Error('Directorio de fuente no regular');
      files.push(...entries(root, directory + '/'));
    }
  }
  for (const name of fs.readdirSync(site).sort()) {
    if (/\.(?:[cm]?[jt]sx?|json)$/.test(name) || /^\.env(?:\.|$)/.test(name)) {
      files.push({ path: name, sha256: sha256(regular(path.join(site, name))) });
    }
  }
  const articleRoot = path.resolve(site, '../articulos');
  if (!fs.lstatSync(articleRoot).isDirectory()) throw new Error('Directorio editorial no regular');
  const articles = fs.readdirSync(articleRoot).filter(n => n.endsWith('.md')).sort().map(name => ({ path: name, sha256: sha256(regular(path.join(articleRoot, name))) }));
  const publicEnvironment = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith('NEXT_PUBLIC_')).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => [key, sha256(value)]));
  return { version: 1, site: files.sort((a, b) => a.path.localeCompare(b.path, 'en')), articles, publicEnvironment };
}

export function exportManifest(root) {
  return exportFiles(root).map(file => `${sha256(regular(path.join(root, file)))}  ${file}`).join('\n') + '\n';
}

function timestamp(value, label) {
  if (typeof value !== 'string' || !Number.isFinite(Date.parse(value))) throw new Error(`Fecha de ${label} inválida`);
  return Date.parse(value);
}

export function validateRelease(directory, { site = defaultSite, copyRoot } = {}) {
  if (process.env.ARNCOF_PREVIEW === '1') throw new Error('Preview no transferible');
  const root = path.resolve(directory);
  if (!fs.lstatSync(root).isDirectory() || fs.realpathSync(root) !== root) throw new Error('Directorio de release con enlace o no regular');
  const manifestBytes = regular(path.join(root, 'release.json'));
  const manifest = JSON.parse(manifestBytes);
  if (manifest.version !== 1) throw new Error('Versión de release inválida');
  const sourceBytes = regular(path.join(root, 'sources.json'));
  const catalogBytes = regular(path.join(root, 'articles.json'));
  const exportedBytes = regular(path.join(root, 'export.sha256'));
  const bound = { sources_sha256: sha256(sourceBytes), catalog_sha256: sha256(catalogBytes), export_sha256: sha256(exportedBytes) };
  for (const [key, value] of Object.entries(bound)) if (manifest[key] !== value) throw new Error(`Hash de release distinto: ${key}`);
  if (sourceBytes.toString() !== jsonBytes(sourceSnapshot(site))) throw new Error('Fuentes cambiadas desde el build del release');
  const catalog = JSON.parse(catalogBytes);
  if (!Array.isArray(catalog) || catalogBytes.toString() !== fs.readFileSync(path.join(site, 'src/data/articles.json'), 'utf8') || JSON.stringify(catalog) !== JSON.stringify(readArticles(path.resolve(site, '../articulos')))) throw new Error('Catálogo del release distinto de las fuentes editoriales/importadas');
  const build = manifest.build;
  const started = timestamp(build?.started_at, 'inicio de build');
  const finished = timestamp(build?.finished_at, 'fin de build');
  if (build?.exit_code !== 0 || build?.preview !== false || !Array.isArray(build?.command) || build.command[0] !== 'npm' || build.command[1] !== 'run' || build.command[2] !== 'build' || started > finished || finished > Date.now() || build.sources_before_sha256 !== bound.sources_sha256 || build.sources_after_sha256 !== bound.sources_sha256 || build.export_sha256 !== bound.export_sha256) throw new Error('Comprobante de build público no corresponde al release');
  if (sha256(regular(contained(root, build.log))) !== build.log_sha256) throw new Error('Log del build cambiado');
  const exportRoot = path.join(root, 'export');
  if (!fs.lstatSync(exportRoot).isDirectory()) throw new Error('Export de release no regular');
  if (exportManifest(exportRoot) !== exportedBytes.toString()) throw new Error('Hash de archivos del export distinto');
  if (regular(path.join(exportRoot, '_next/static/.htaccess')).toString() !== cacheHeader) throw new Error('Cache header debe formar parte del export revisado');
  verifyPublicExport({ root: exportRoot, articles: catalog });
  const qa = JSON.parse(regular(path.join(root, 'qa.json')));
  const checked = timestamp(qa.checked_at, 'QA');
  if (qa.version !== 1 || qa.status !== 'passed' || qa.release_sha256 !== sha256(manifestBytes) || checked < finished || checked > Date.now() || requiredChecks.some(key => qa.checks?.[key] !== true)) throw new Error('QA pendiente o no corresponde al release');
  for (const [key, value] of Object.entries(bound)) if (qa[key] !== value) throw new Error(`QA no corresponde a ${key}`);
  if (!Array.isArray(qa.evidence) || qa.evidence.length === 0) throw new Error('QA sin evidencia');
  for (const item of qa.evidence) {
    if (!item.path?.startsWith('qa/')) throw new Error('Evidencia QA fuera de su carpeta');
    if (sha256(regular(contained(root, item.path))) !== item.sha256) throw new Error('Evidencia QA cambiada');
  }
  if (copyRoot) {
    if (!regular(path.join(path.dirname(copyRoot), 'articles.json')).equals(catalogBytes)) throw new Error('Catálogo de transferencia distinto del release');
    const receipt = JSON.parse(regular(path.join(path.dirname(copyRoot), 'validated-release.json')));
    if (receipt.release !== root || receipt.release_sha256 !== sha256(manifestBytes) || Object.entries(bound).some(([key, value]) => receipt[key] !== value)) throw new Error('Release cambiado después de preparar la copia');
    if (exportManifest(copyRoot) !== exportedBytes.toString()) throw new Error('Copia de transferencia distinta del release validado');
    verifyPublicExport({ root: copyRoot, articles: catalog });
  }
  return { root, exportRoot, catalogBytes, manifest, release_sha256: sha256(manifestBytes), ...bound };
}

export function stageRelease(directory, destination, options = {}) {
  const release = validateRelease(directory, options);
  const copyRoot = path.join(destination, 'export');
  if (fs.existsSync(copyRoot)) throw new Error('La copia de transferencia ya existe');
  fs.cpSync(release.exportRoot, copyRoot, { recursive: true, errorOnExist: true, force: false });
  fs.writeFileSync(path.join(destination, 'articles.json'), release.catalogBytes, { flag: 'wx', mode: 0o600 });
  fs.writeFileSync(path.join(destination, 'validated-release.json'), jsonBytes({ release: release.root, release_sha256: release.release_sha256, sources_sha256: release.sources_sha256, catalog_sha256: release.catalog_sha256, export_sha256: release.export_sha256 }), { flag: 'wx', mode: 0o600 });
  validateRelease(directory, { ...options, copyRoot });
  writeTransferManifest(copyRoot, path.join(destination, 'deployed.sha256'));
  return release;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [action, directory, destination] = process.argv.slice(2);
    if (action === 'snapshot' && !destination) {
      const bytes = jsonBytes(sourceSnapshot());
      if (directory) fs.writeFileSync(directory, bytes, { flag: 'wx', mode: 0o600 });
      else process.stdout.write(bytes);
    } else if (action === 'verify' && directory) {
      const result = validateRelease(directory, { copyRoot: destination });
      console.log(`Release y QA verificados: ${result.release_sha256}`);
    } else if (action === 'stage' && directory && destination) {
      const result = stageRelease(directory, destination);
      console.log(`Copia del release verificada: ${result.release_sha256}`);
    } else throw new Error('Uso: release-web.mjs snapshot [archivo] | verify RELEASE [COPIA] | stage RELEASE RUN_DIR');
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
