import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const { launch } = await import(process.env.ARNCOF_VM==='1' ? new URL('../../qa-tools/headless.mjs', import.meta.url).href : '/Users/franco/.claude/tools/viewer/headless.mjs');
import { jsonBytes } from './release-web.mjs';

// QA limitado al export recién construido. No construye, cambia contenido ni publica.
export async function qaRelease(release) {
  const root = path.join(release, 'export'), qa = path.join(release, 'qa');
  fs.mkdirSync(qa, { mode: 0o700 });
  const articles = JSON.parse(fs.readFileSync(path.join(release, 'articles.json')));
  const published = articles.filter(a => a.publication === 'published');
  assert.deepEqual(published.map(a=>a.slug).sort(), ['continuidad-entre-sesiones-de-agentes','referencias-antes-de-redisenar']);
  const report = { started_at: new Date().toISOString(), checks: {}, viewports: [], console: [], pageerrors: [], requests_failed: [] };
  const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.jpg':'image/jpeg', '.woff2':'font/woff2', '.xml':'application/xml', '.txt':'text/plain', '.json':'application/json', '.ico':'image/x-icon', '.webmanifest':'application/manifest+json' };
  const server = http.createServer((req,res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const candidates = pathname.endsWith('/') ? [pathname+'index.html'] : [pathname,pathname+'.html',pathname+'/index.html'];
    for(const candidate of candidates) {
      const file = path.resolve(root, '.'+candidate);
      if(file.startsWith(root+'/') && fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, {'Content-Type':mime[path.extname(file)]||'application/octet-stream'});
        return fs.createReadStream(file).pipe(res);
      }
    }
    res.writeHead(404, {'Content-Type':'text/html'});
    fs.createReadStream(path.join(root,'404.html')).pipe(res);
  });
  let browser, page;
  try {
    await new Promise((resolve,reject) => {server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
    const base = `http://127.0.0.1:${server.address().port}`;
    browser = await launch({ args:['--renderer-process-limit=1','--disable-background-networking','--disable-component-update'], timeout:20000 });
    const context = await browser.newContext({ viewport:{width:1440,height:900}, locale:'es-AR', deviceScaleFactor:1 });
    page = await context.newPage();
    page.setDefaultTimeout(8000);
    page.on('pageerror', error => report.pageerrors.push(error.message));
    page.on('console', message => { if(['error','warning'].includes(message.type()))report.console.push({type:message.type(),text:message.text(),url:page.url()}); });
    page.on('requestfailed', request => report.requests_failed.push({url:request.url(),error:request.failure()?.errorText}));
    const waitFocus = async locator => { await locator.waitFor({state:'visible'}); await page.waitForFunction(el=>el===document.activeElement,await locator.elementHandle()); };
    const forceOutside = async () => page.evaluate(() => {document.body.tabIndex=-1;document.body.focus();if(document.activeElement!==document.body)throw new Error('No se pudo llevar el foco fuera para la prueba');});
    for(const viewport of [{width:1440,height:900},{width:390,height:844}]) {
      await page.setViewportSize(viewport);
      const label = viewport.width===1440?'desktop':'mobile', row = {label,viewport};
      await page.goto(base+'/contacto',{waitUntil:'networkidle'});
      const trigger = page.getByRole('button',{name:'Copiar correo',exact:true}).first();
      await trigger.focus();
      await page.keyboard.press('Control+k');
      const dialog = page.getByRole('dialog',{name:'Buscar en el sitio'}), input = dialog.getByRole('textbox');
      await waitFocus(input);
      assert.equal(await dialog.getAttribute('aria-modal'),'true');
      assert.equal(await trigger.evaluate(el=>!!el.closest('[inert]')),true);
      const last = dialog.getByRole('button').last();
      await page.keyboard.press('Shift+Tab'); await waitFocus(last);
      await page.keyboard.press('Tab'); await waitFocus(input);
      await forceOutside(); await page.keyboard.press('Tab'); await waitFocus(input);
      await forceOutside(); await page.keyboard.press('Shift+Tab'); await waitFocus(last);
      await forceOutside(); await page.keyboard.press('Escape');
      await dialog.waitFor({state:'hidden'}); await waitFocus(trigger);
      assert.equal(await trigger.evaluate(el=>!!el.closest('[inert]')),false);
      await page.keyboard.press('Control+k'); await waitFocus(input);
      await input.fill('Memory');
      await page.screenshot({path:path.join(qa,`${label}-paleta.png`)});
      await page.keyboard.press('Enter');
      await page.waitForURL(base+'/memory');
      await page.getByRole('heading',{name:'Memory',exact:true}).waitFor();
      await page.waitForFunction(()=>document.querySelectorAll('div.grid.grid-cols-4 > button').length===16);
      const cards = page.locator('div.grid.grid-cols-4 > button');
      // El mazo se baraja un cuadro después de montar; un clic por coordenadas antes de eso cae en otra carta.
      await page.waitForFunction(() => [...document.querySelectorAll('div.grid.grid-cols-4 > button')].map(b => b.textContent.replace(/\?/g, '')).join() !== 'WP,WP,JS,JS,CSS,CSS,PHP,PHP,AWS,AWS,SQL,SQL,SEO,SEO,CDN,CDN', null, { timeout: 3000 }).catch(() => {});
      for(const text of ['WP','JS','CSS','PHP','AWS','SQL','SEO','CDN']) {
        const pair = cards.filter({has:page.getByText(text,{exact:true})});
        assert.equal(await pair.count(),2);
        await pair.nth(0).click(); await pair.nth(1).click();
      }
      await page.getByText('Completado',{exact:true}).waitFor();
      const contrast = await cards.evaluateAll(buttons=>buttons.map(button=>{
        const span=[...button.querySelectorAll('span')].find(el=>el.textContent!=='?');
        const ink=getComputedStyle(span).color, background=getComputedStyle(span.parentElement).backgroundColor;
        const luminance=value=>{const rgb=value.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
        const a=luminance(ink), b=luminance(background);
        return {text:span.textContent,ink,background,ratio:(Math.max(a,b)+.05)/(Math.min(a,b)+.05),transform:button.firstElementChild.style.transform};
      }));
      assert.equal(contrast.length,16);
      assert(contrast.every(c=>c.ratio>=4.5&&c.transform==='rotateY(180deg)'));
      assert(contrast.filter(c=>['PHP','SEO','CDN'].includes(c.text)).every(c=>c.ink==='rgb(0, 0, 0)'));
      await page.screenshot({path:path.join(qa,`${label}-memory.png`),animations:'disabled'});
      row.command_palette={focus_wrap:true,focus_outside:true,escape_restore:true,background_inert:true,enter_navigation:true};
      row.memory={completed:true,cards:contrast,min_ratio:Math.min(...contrast.map(c=>c.ratio))};
      for(const article of published) {
        await page.goto(base+'/blog',{waitUntil:'networkidle'});
        const link=page.locator(`a[href="/blog/${article.slug}"]`).first();
        await link.click(); await page.waitForURL(base+'/blog/'+article.slug);
        assert.equal(await page.locator('h1').innerText(),article.title);
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),'https://yosephfr.com/blog/'+article.slug);
        assert.equal(await page.locator('article time').first().getAttribute('datetime'),article.date);
        const schemas=await page.locator('script[type="application/ld+json"]').allTextContents();
        const posting=schemas.flatMap(text=>{const s=JSON.parse(text);return s['@graph']||[s];}).find(s=>s['@type']==='BlogPosting');
        assert.equal(posting.datePublished,article.date);assert.equal(posting.url,'https://yosephfr.com/blog/'+article.slug);
        if(label==='mobile')await page.locator('details.indice-movil summary').click();
        const toc=page.getByRole('navigation',{name:'Secciones del artículo'}).filter({visible:true}).first();
        const first=toc.locator('a').first(), hash=await first.getAttribute('href');
        await first.click();await page.waitForURL(base+'/blog/'+article.slug+hash);
        const heading=page.locator(hash);await heading.waitFor({state:'visible'});
        await page.waitForFunction(el=>el.getBoundingClientRect().top<window.innerHeight&&el.getBoundingClientRect().bottom>0,await heading.elementHandle());
        await page.screenshot({path:path.join(qa,`${label}-articulo-${article.slug}.png`)});
        (row.articles??=[]).push({title:article.title,canonical:posting.url,datePublished:posting.datePublished,toc_target:hash});
      }
      report.viewports.push(row);
    }
    const feed=await (await fetch(base+'/feed.xml')).text();
    assert.equal((feed.match(/<item>/g)||[]).length,published.length);
    for(const article of published)assert(feed.includes(new Date(article.date).toUTCString()));
    const sitemap=await (await fetch(base+'/sitemap.xml')).text();
    for(const article of published)assert(sitemap.includes('/blog/'+article.slug));
    for(const other of articles.filter(a=>a.publication!=='published')) {
      assert(!feed.includes(other.slug)&&!sitemap.includes(other.slug));
      assert.equal((await fetch(base+'/blog/'+other.slug)).status,404);
    }
    assert.equal(report.pageerrors.length,0,JSON.stringify(report.pageerrors));
    const errors=report.console.filter(x=>x.type==='error'&&!/Failed to load resource.*404/.test(x.text));
    assert.equal(errors.length,0,JSON.stringify(errors));
    report.checks={command_palette_runtime:true,memory_contrast_runtime:true,article_runtime:true};
    report.status='passed';
    return report;
  } catch(error) {
    report.status='failed'; report.error=error.stack;
    if(page)await page.screenshot({path:path.join(qa,'failure.png')}).catch(()=>{});
    throw error;
  } finally {
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
    report.finished_at=new Date().toISOString();
    fs.writeFileSync(path.join(qa,'runtime.json'),jsonBytes(report),{mode:0o600});
  }
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href) {
  console.error('Usar preparar-release.mjs bajo la guarda global; no ejecutar QA por separado.');
  process.exitCode=2;
}
