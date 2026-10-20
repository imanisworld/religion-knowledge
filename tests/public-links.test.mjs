import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('dist/reader-site');
const PAGES = fs.existsSync(ROOT)
  ? fs.readdirSync(ROOT).filter(file => file.endsWith('.html')).sort()
  : [];
const htmlByPage = new Map(PAGES.map(file => [file, fs.readFileSync(path.join(ROOT,file),'utf8')]));

function staticMarkup(html) {
  // Scripted views may create links after a visitor makes a selection.
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'');
}
function ids(html) {
  const found = new Set();
  for(const m of staticMarkup(html).matchAll(/<[a-z][^>]*?[\s]id=["']([^"']+)["']/gi))
    found.add(m[1]);
  return found;
}
function linkDestinations(html) {
  return [...staticMarkup(html).matchAll(/<a\b[^>]*?\shref=["']([^"']*)["']/gi)]
    .map(m=>m[1].replace(/&amp;/g,'&'));
}

test('public local links point to deployed files and real anchors', () => {
  assert.ok(PAGES.length >= 17,'Expected home, catalog and reader pages');
  const missing = [];
  let checkedLinks = 0, checkedAnchors = 0;
  const pageIds = new Map([...htmlByPage].map(([file,html])=>[file,ids(html)]));
  for (const [page,html] of htmlByPage) {
    for (const href of linkDestinations(html)) {
      if (!href || href==='#' || /^(?:https?:|mailto:|tel:|javascript:|data:|\/\/)/i.test(href)) continue;
      if (href.includes('$'+'{') || href.includes("'+") || href.includes('{{')) continue;
      let target;
      try { target = new URL(href, new URL(page,'https://religion.example/')); }
      catch { missing.push(page+': malformed '+href); continue; }
      if(target.hostname!=='religion.example') continue;
      let targetPath=decodeURIComponent(target.pathname).replace(/^\/+/,'') || 'index.html';
      if(targetPath.endsWith('/')) targetPath+='index.html';
      const localPath=path.resolve(ROOT,targetPath);
      if(!localPath.startsWith(ROOT+path.sep)){missing.push(page+': path escape '+href);continue}
      checkedLinks++;
      if(!fs.existsSync(localPath)){missing.push(page+': missing file '+href);continue}
      // Law and search views use dynamic hash routes such as #state=... .
      if(!target.hash || !targetPath.endsWith('.html')) continue;
      const fragment=decodeURIComponent(target.hash.slice(1));
      if(!fragment||fragment.includes('='))continue;
      checkedAnchors++;
      const known=pageIds.get(targetPath);
      // Religion & Law builds its overview sections on page load. Verify the
      // expected id exists in that script's source rather than exempting all
      // dynamic links from validation.
      const dynamicLawSection=targetPath==='religion-law.html'
        && htmlByPage.get(targetPath)?.includes('id="'+fragment+'"');
      if(known && !known.has(fragment) && !dynamicLawSection)
        missing.push(page+': missing destination '+href);
    }
  }
  assert.ok(checkedLinks >= 250,'Suspiciously few checked links: '+checkedLinks);
  assert.ok(checkedAnchors >= 100,'Suspiciously few checked anchors: '+checkedAnchors);
  assert.deepEqual(missing,[],'Public research links must all resolve');
});

test('subject pages connect in both directions without asserting historical influence', () => {
  const home=htmlByPage.get('index.html')||'';
  const hub=htmlByPage.get('comparisons.html')||'';
  const catalog=htmlByPage.get('catalog.html')||'';
  for(const page of ['history.html','catalog.html','traditions.html','comparisons.html','search.html'])
    assert.ok(home.includes('href="'+page+'"'),'Homepage missing '+page);
  assert.ok(hub.includes('href="catalog.html"'),'Comparison hub must reach catalog');
  assert.ok(catalog.includes('href="comparisons.html"'),'Catalog must reach comparison hub');
  for(const target of ['history.html#s2-1','gender-over-time.html#biblical-gender-metaphors',
    'religion-law.html#compare-laws','cited-persons.html'])
    assert.ok(hub.includes('href="'+target+'"'),'Comparison hub missing '+target);
  const gender=htmlByPage.get('gender-over-time.html')||'';
  const patterns=htmlByPage.get('patterns-synthesis.html')||'';
  assert.ok(gender.includes('href="translations.html#s5"'),
    'Hebrew/Greek imagery needs a translation-context link');
  assert.ok(gender.includes('href="patterns-synthesis.html#body"'),
    'Gender imagery needs broader social-category context');
  assert.ok(patterns.includes('href="gender-over-time.html#method"'),
    'Historical patterns should lead readers back to the gender research');
  assert.match(catalog,/Similar gods or stories may have developed separately/);
  assert.match(catalog,/Read research notes/);
  assert.match(catalog,/href="traditions.html#trad_akan_traditional_religion"/);
  assert.doesNotMatch(catalog,/github\.com|View research file/);
  assert.match(catalog,/href="cited-persons.html#person-/);
});
