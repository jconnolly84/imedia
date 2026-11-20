/* Browser check for every page type. Run against a local static preview:
   STUDIO_PREVIEW=http://127.0.0.1:4187 NODE_PATH=<playwright node_modules> node scripts/test-studio.cjs
   Set CHROMIUM_PATH if Playwright's bundled browser isn't installed. */
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const os = require('node:os');
const root = path.resolve(__dirname, '..');
const origin = process.env.STUDIO_PREVIEW || 'http://127.0.0.1:4187';
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const htmlIn = dir => fs.readdirSync(path.join(root, dir)).filter(n => n.endsWith('.html')).map(n => (dir === '.' ? '' : dir + '/') + n);
const pages = [
  'index.html', ...htmlIn('.').filter(n => /^topic-\d.*\.html$/.test(n)),
  ...htmlIn('r094'), ...htmlIn('r097'),
  ...htmlIn('.').filter(n => read(n).includes('studio-game')),            // games and exam tools
  'help.html', 'privacy-policy.html', 'cookie-notice.html', 'terms-of-service.html',
  ...['r097-dreamweaver', 'r097-dreamweaver/pages'].flatMap(htmlIn).filter(n => !read(n).includes('http-equiv="refresh"')),
  'tools/index.html'
];
// Known gaps in content, reported separately rather than failing the run: the games' sound
// effects have never been added to the repository.
const knownMissing = /\/(sfx-[a-z]+\.mp3|sfx\/[a-z-]+\.mp3)$/;
const shots = new Set(['index.html','r094/index.html','r097/index.html','topic-01-traditional-media.html','r094/09-creating-the-logo.html','r097/13-build-idmp.html']);
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const headings = [], errors = [], missing = [], known = [], overflows = [], results = [], brokenLinks = new Set();
  try {
    for (const width of [1440, 390]) {
      const context = await browser.newContext({viewport:{width,height:900}});
      let index = 0;
      await Promise.all(Array.from({length:4}, async () => {
        const page = await context.newPage();
        let current;
        page.on('pageerror', error => errors.push({page:current,error:error.message}));
        page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) (knownMissing.test(new URL(response.url()).pathname) ? known : missing).push({page:current,url:response.url(),status:response.status()}); });
        while (index < pages.length) {
          current = pages[index++];
          await page.goto(origin+'/'+current,{waitUntil:'domcontentloaded'});
          await page.waitForSelector('.studio-nav');
          const info = await page.evaluate(() => ({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,nav:document.querySelectorAll('.studio-nav').length,bodyClass:document.body.className}));
          assert.equal(info.nav,1,current+' shared navigation');
          if (info.h1 !== 1) headings.push(current + ': ' + info.h1 + ' h1 elements');
          if(info.scroll > width + 1) overflows.push({page:current,width,scroll:info.scroll});
          const urls = await page.locator('a[href],img[src],source[src],iframe[src],script[src],link[rel="stylesheet"]').evaluateAll(elements => elements.map(el => el.href || el.src).filter(Boolean));
          for (const value of urls) {
            const url = new URL(value, origin);
            if (url.origin !== origin) continue;
            const filename = path.join(root, decodeURIComponent(url.pathname));
            if (!fs.existsSync(filename) && !knownMissing.test(url.pathname)) brokenLinks.add(current + ' -> ' + url.pathname);
          }
          if(shots.has(current)) {
            await page.evaluate(() => document.fonts.ready);
            await page.evaluate(async () => { const hero = document.querySelector('.studio-hero'); if (!hero) return; const url = getComputedStyle(hero).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1]; if (url) { const image = new Image(); image.src = url; await image.decode(); } });
            await page.screenshot({path:path.join(os.tmpdir(),'studio-final-'+width+'-'+current.replace(/[/.]/g,'-')+'.png'),fullPage:true});
          }
        }
        await page.close();
      }));
      await context.close();
    }
    console.log(JSON.stringify({pages:pages.length,viewports:[1440,390],errors,missing:[...new Map(missing.map(m=>[m.url,m])).values()],overflows,brokenLinks:[...brokenLinks],headings,knownMissingContent:[...new Set(known.map(m=>new URL(m.url).pathname))]},null,2));

    const context = await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
    const page = await context.newPage();
    await page.goto(origin+'/index.html',{waitUntil:'domcontentloaded'});
    const days = Number(await page.locator('#ecDays').innerText()); assert(days >= 0 && Number.isFinite(days));
    assert.equal(await page.locator('.topic-grid .topic-card').count(),35);
    await page.locator('#topicSearch').fill('Traditional Media');
    assert.equal(await page.locator('.topic-grid .topic-card:visible').count(),1);
    await page.locator('#topicSearch').clear();
    await page.locator('.topic-tick').first().click();
    assert.match(await page.locator('#ecFrac').innerText(),/1\s*\/\s*35/);
    await page.reload({waitUntil:'domcontentloaded'});
    assert.match(await page.locator('#ecFrac').innerText(),/1\s*\/\s*35/);
    await page.locator('.filter-btn[data-filter="legal"]').click();
    const filters = await page.locator('#gamesCollapsible .game-card:visible').evaluateAll(cards=>cards.map(c=>c.dataset.topic));
    assert(filters.length>0 && filters.every(t=>t==='legal'));
    results.push('R093 topic search, topic completion persistence, game filtering and countdown');
    await page.goto(origin+'/topic-01-traditional-media.html',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>document.querySelector('#fcCounter')?.textContent.includes('/'));
    await page.locator('#fcCard').click();
    assert(await page.locator('#fcCard').evaluate(el=>el.classList.contains('flipped')));
    await page.locator('#fcNext').click();
    await page.waitForFunction(()=>/^2\s*\//.test(document.querySelector('#fcCounter').textContent));
    assert.match(await page.locator('#fcCounter').innerText(),/2\s*\//);
    results.push('R093 flashcard loading, flipping and next card');

    for (const [course, first, second, total] of [['r094','01-setup-project.html','02-client-brief.html',15],['r097','01-target-audience.html','02-original-ideas.html',21]]) {
      await page.goto(origin+'/'+course+'/'+first,{waitUntil:'domcontentloaded'});
      await page.locator('#studioMarkComplete').click();
      assert.equal(await page.locator('#studioMarkComplete').getAttribute('aria-pressed'),'true');
      await page.reload({waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('#studioMarkComplete').getAttribute('aria-pressed'),'true');
      await page.goto(origin+'/'+course+'/index.html',{waitUntil:'domcontentloaded'});
      assert.equal(await page.locator('[data-course-progress]').innerText(),'1 / '+total+' guides completed');
      assert.equal(await page.locator('[data-continue-course]').getAttribute('href'),second);
      const downloadEvent = page.waitForEvent('download'); await page.locator('[data-export-course]').click(); const download = await downloadEvent;
      const exportPath = await download.path(); const exported = JSON.parse(fs.readFileSync(exportPath,'utf8'));
      assert.equal(exported.course,course); assert.deepEqual(exported.completed,[first]);
      await page.locator('[data-import-course]').setInputFiles({name:'progress.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,course,completed:[second]}))});
      await page.waitForFunction(total=>document.querySelector('[data-course-progress]').textContent==='2 / '+total+' guides completed',total);
      await page.locator('[data-import-course]').setInputFiles({name:'wrong.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,course:'wrong',completed:[]}))});
      await page.waitForFunction(()=>document.querySelector('[data-progress-status]').textContent.includes('valid'));
      results.push(course.toUpperCase()+' completion persistence, continue link, export, merged import and invalid-file rejection');
    }
    await context.close();
    console.log(JSON.stringify({pages:pages.length,viewports:[1440,390],errors,missing:[...new Map(missing.map(m=>[m.url,m])).values()],overflows,workflows:results},null,2));
    assert.equal(errors.length,0,'Unexpected browser errors');
    assert.equal(overflows.length,0,'Responsive overflow');
    assert.equal(missing.length,0,'Missing local resources');
    assert.equal(brokenLinks.size,0,'Broken local links');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
