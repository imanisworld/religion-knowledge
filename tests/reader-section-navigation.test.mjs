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
  assert.match(scripts, /section\.textContent\.length < 8500/);
  assert.match(scripts, /next\.id = 'read-' \+ node\.id/);
  assert.match(scripts, /aria-live="polite"/);
  assert.match(scripts, /section\.hidden = i !== index/);
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
