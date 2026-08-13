import fs from 'node:fs';

const DOCUMENTS = [
  ['Bible_Deep_Dive_Master_Notes.md', 'master-notes.html', 'Bible Deep Dive: Study Notes'],
  ['Field_Guide_Conversation_Reference.md', 'field-guide.html', 'Observations: Live Conversation Reference'],
  ['Historical_Framework.md', 'history.html', 'Historical Framework'],
  ['Sources_and_Primary_Texts.md', 'sources.html', 'Sources & Primary Texts'],
  ['The_Other_Side.md', 'other-side.html', 'The Strongest Case'],
  ['Translations.md', 'translations.html', 'Translations'],
  ['Method_and_Reference.md', 'method-reference.html', 'Method & Reference'],
  ['Glossary.md', 'glossary.html', 'Glossary'],
];

// cited-persons.html is hand-maintained; Cited_Persons.md is a working draft
// under review. They are intentionally not held in sync, so the HTML gets
// structural checks only (duplicate ids, link targets) — no Markdown pairing.
const STANDALONE_READERS = [
  ['cited-persons.html', 'Cited Persons'],
];

const SWITCHER_LABELS = [
  'Study Notes',
  'Observations',
  'History',
  'Sources',
  'The Strongest Case',
  'Translations',
  'Method & Reference',
  'Glossary',
  'Cited Persons',
  'Search',
];

const decode = (value) => value
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));

const plain = (value) => decode(value)
  .replace(/<[^>]+>/g, '')
  .replace(/[`*_]/g, '')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/\s+/g, ' ')
  .trim();

const auditIdentity = (value) => {
  const normalized = plain(value).replace(/^Addendum\s*[—-]\s*/i, '');
  if (/two innate fears/i.test(normalized)) {
    return 'Is Religious Fear Innate or Learned?';
  }
  return normalized;
};

const count = (items) => {
  const result = new Map();
  for (const item of items) result.set(item, (result.get(item) || 0) + 1);
  return result;
};

const compare = (label, expected, actual, failures) => {
  const expectedCounts = count(expected);
  const actualCounts = count(actual);
  for (const [item, wanted] of expectedCounts) {
    const found = actualCounts.get(item) || 0;
    if (found !== wanted) failures.push(`${label}: expected ${wanted}, found ${found}: ${item}`);
  }
  for (const [item, found] of actualCounts) {
    if (!expectedCounts.has(item)) failures.push(`${label}: reader-only entry (${found}): ${item}`);
  }
};

const failures = [];
const summaries = [];
const readerIds = new Map();

const idsFor = (file) => {
  if (!readerIds.has(file)) {
    const html = fs.readFileSync(file, 'utf8');
    readerIds.set(file, new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1])));
  }
  return readerIds.get(file);
};

for (const [markdownFile, htmlFile, expectedTitle] of DOCUMENTS) {
  const markdown = fs.readFileSync(markdownFile, 'utf8');
  const html = fs.readFileSync(htmlFile, 'utf8');
  const allIds = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(allIds.filter((id, index) => allIds.indexOf(id) !== index))];
  if (duplicateIds.length) failures.push(`${htmlFile}: duplicate ids: ${duplicateIds.join(', ')}`);

  const markdownAudits = [...markdown.matchAll(/^####\s+⚑\s*AUDIT(?:\s+ADDENDUM)?\s*[—-]\s*(.+)$/gmi)]
    .map((match) => auditIdentity(match[1]));
  const readerAudits = [...html.matchAll(/<span class="atitle">([\s\S]*?)<\/span>/g)]
    .map((match) => auditIdentity(match[1]));

  compare(`${markdownFile} audits`, markdownAudits, readerAudits, failures);

  const checked = (markdown.match(/^`CHECKED\s+[^`]+`$/gm) || []).length;
  const statuses = (markdown.match(/^\*\*STATUS(?:\s*:[^*]*)?\*\*/gm) || []).length;
  const readerDetails = (html.match(/<details class="audit"/g) || []).length;
  const readerChecked = (html.match(/<span class="stamp">CHECKED\s+/g) || []).length;

  if (markdownAudits.length !== checked) failures.push(`${markdownFile}: ${markdownAudits.length} audits but ${checked} CHECKED lines`);
  if (statuses > markdownAudits.length) failures.push(`${markdownFile}: more STATUS fields than audits`);
  if (readerAudits.length !== readerDetails) failures.push(`${htmlFile}: ${readerAudits.length} titles but ${readerDetails} audit cards`);
  if (readerAudits.length !== readerChecked) failures.push(`${htmlFile}: ${readerAudits.length} audits but ${readerChecked} CHECKED chips`);

  const actualTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  if (actualTitle !== expectedTitle) failures.push(`${htmlFile}: expected title "${expectedTitle}", found "${actualTitle}"`);

  const switcher = html.match(/<div class="docswitch">([\s\S]*?)<\/div>/)?.[1] || '';
  const switcherLinks = [...switcher.matchAll(/<a([^>]*)>([\s\S]*?)<\/a>/g)]
    .filter((match) => !match[1].includes('app-link'));
  const labels = switcherLinks.map((match) => plain(match[2]));
  if (JSON.stringify(labels) !== JSON.stringify(SWITCHER_LABELS)) {
    failures.push(`${htmlFile}: unexpected reader switcher labels: ${JSON.stringify(labels)}`);
  }
  if (switcherLinks.filter((match) => /class="[^"]*\bon\b/.test(match[1])).length !== 1) {
    failures.push(`${htmlFile}: reader switcher must have exactly one active entry`);
  }

  for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
    if (href.includes('+letter+')) continue;
    if (/^(?:https?:|mailto:|javascript:|app\/|#?$)/.test(href)) continue;
    const [targetPath, fragment] = href.split('#');
    const targetFile = targetPath || htmlFile;
    if (!fs.existsSync(targetFile)) {
      failures.push(`${htmlFile}: local link target is missing: ${href}`);
      continue;
    }
    if (fragment && !idsFor(targetFile).has(decodeURIComponent(fragment))) {
      failures.push(`${htmlFile}: local fragment is missing: ${href}`);
    }
  }

  summaries.push({ markdown: markdownFile, reader: htmlFile, audits: markdownAudits.length });
}

for (const [htmlFile, expectedTitle] of STANDALONE_READERS) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const allIds = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]);
  const duplicateIds = [...new Set(allIds.filter((id, index) => allIds.indexOf(id) !== index))];
  if (duplicateIds.length) failures.push(`${htmlFile}: duplicate ids: ${duplicateIds.join(', ')}`);

  const actualTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  if (actualTitle !== expectedTitle) failures.push(`${htmlFile}: expected title "${expectedTitle}", found "${actualTitle}"`);

  for (const href of [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])) {
    if (href.includes('+letter+')) continue;
    if (/^(?:https?:|mailto:|javascript:|app\/|#?$)/.test(href)) continue;
    const [targetPath, fragment] = href.split('#');
    const targetFile = targetPath || htmlFile;
    if (!fs.existsSync(targetFile)) {
      failures.push(`${htmlFile}: local link target is missing: ${href}`);
      continue;
    }
    if (fragment && !idsFor(targetFile).has(decodeURIComponent(fragment))) {
      failures.push(`${htmlFile}: local fragment is missing: ${href}`);
    }
  }

  summaries.push({ reader: htmlFile, standalone: true });
}

if (failures.length) {
  console.error(`READER_SYNC_FAILURES=${JSON.stringify(failures)}`);
  process.exit(1);
}

console.log(`READER_SYNC_SUMMARY=${JSON.stringify({ documents: summaries.length, files: summaries })}`);
