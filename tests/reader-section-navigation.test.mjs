import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const scripts = readFileSync('reader-chapters.js', 'utf8');
const stylesheet = readFileSync('reader-chapters.css', 'utf8');
const generator = readFileSync('scripts/build-readers.mjs', 'utf8');
const manifest = readFileSync('scripts/build-reader-site.mjs', 'utf8');

test('focused reading is explicitly enabled for Study Notes and Observations only', () => {
  for (const file of ['master-notes.html', 'field-guide.html']) {
    const markup = readFileSync(file, 'utf8');
    assert.match(markup, /<link rel="stylesheet" href="reader-chapters.css">/);
    assert.match(markup, /<script src="reader-chapters.js"><\/script>/);
    assert.match(markup, /id="sec-intro"/);
    assert.ok((markup.match(/<section id="sec-/g) || []).length >= 10);
  }
  for (const file of ['history.html', 'sources.html', 'translations.html']) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /reader-chapters\.(?:js|css)/);
  }
  assert.match(generator, /doc\.html === 'master-notes\.html'/);
  assert.match(generator, /doc\.html === 'field-guide\.html'/);
  assert.match(manifest, /'reader-chapters\.js'/);
  assert.match(manifest, /'reader-chapters\.css'/);
});

test('reader navigation remains accessible, searchable and deep-linkable', () => {
  assert.doesNotThrow(() => new vm.Script(scripts));
  assert.match(scripts, /reader-section-select/);
  assert.match(scripts, /section\.tabIndex = 0/);
  assert.match(scripts, /section\.setAttribute\('role', 'region'\)/);
  assert.match(scripts, /section\.textContent\.length < 8500/);
  assert.match(scripts, /next\.id = 'read-' \+ node\.id/);
  assert.match(scripts, /const intro = main\.querySelector\(':scope > #sec-intro'\)/);
  assert.match(scripts, /about\.append\(intro\)/);
  assert.match(scripts, /summary\.textContent = 'About this document'/);
  assert.match(scripts, /let encounteredFirst = false/);
  assert.match(scripts, /if \(encounteredFirst\)/);
  assert.match(scripts, /encounteredFirst = true/);
  assert.doesNotMatch(scripts, /return 'Introduction'/);
  assert.match(scripts, /Choose a topic/);
  assert.match(scripts, /target\.closest\('\.reader-about'\)/);
  assert.match(scripts, /aria-live="polite"/);
  assert.match(scripts, /section\.hidden = hits\.length === 0 \|\| i !== index/);
  assert.match(scripts, /document\.getElementById\(hash\)/);
  assert.match(scripts, /addEventListener\('hashchange'/);
  assert.match(scripts, /addEventListener\('popstate'/);
  assert.match(scripts, /addEventListener\('input', event/);
  assert.match(scripts, /addEventListener\('click', event/);
  assert.match(scripts, /if \(!openHashTarget/);
  assert.match(stylesheet, /main > section\[hidden\]/);
  assert.match(stylesheet, /@media\(max-width:640px\)/);
  assert.doesNotMatch(scripts, /fetch\(|innerHTML\s*=\s*location/);
});


function luminance(hex) {
  const channels = [1,3,5].map(i => parseInt(hex.slice(i,i+2), 16) / 255);
  const srgb = channels.map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return srgb[0] * .2126 + srgb[1] * .7152 + srgb[2] * .0722;
}
function contrast(a, b) {
  const [higher, lower] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (higher + .05) / (lower + .05);
}

test('laptop reading workspace keeps controls and a scrollable passage in one viewport', () => {
  assert.match(stylesheet, /@media\(min-width:900px\) and \(min-height:640px\)/);
  assert.match(stylesheet, /height:calc\(100dvh - var\(--rk-nav-h,56px\)\)/);
  assert.match(stylesheet, /flex-direction:column/);
  assert.match(stylesheet, /flex:1 1 0/);
  assert.match(stylesheet, /overflow-y:auto/);
  assert.match(stylesheet, /scrollbar-gutter:stable/);
  assert.match(stylesheet, /@media\(max-width:899px\), \(max-height:639px\)/);
  assert.match(scripts, /className = 'reader-about'/);
  assert.match(scripts, /min-width:900px/);
  assert.match(scripts, /scrollTop = 0/);
  assert.match(scripts, /Switch to light theme/);
  assert.match(scripts, /Switch to dark theme/);
});

test('reader dark theme is legible and light remains the saved-preference default', () => {
  const dark = stylesheet.match(/:root\[data-theme=dark\] body\.rk-reader-page \{([\s\S]*?)\}/);
  assert.ok(dark, 'Missing dark-mode reading palette');
  const colors = Object.fromEntries([...dark[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)]
    .map(([, key, color]) => [key, color]));
  for (const foreground of ['ink','ink2','ink3','accent']) {
    for (const background of ['ground','paper']) {
      const score = contrast(colors[foreground], colors[background]);
      assert.ok(score >= 4.5, foreground + ' against ' + background +
        ' should meet WCAG 4.5:1; got ' + score.toFixed(2));
    }
  }
  assert.ok(contrast(colors.rule, colors.paper) >= 3,
    'Dark theme control borders should remain visually distinguishable');
  for (const html of ['master-notes.html','field-guide.html']) {
    assert.match(readFileSync(html,'utf8'), /data-theme="light"/);
  }
});
