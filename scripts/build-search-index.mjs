/**
 * Build search-index.json from all HTML reader files.
 * Run: node scripts/build-search-index.mjs [--output path/to/search-index.json]
 */
import fs from 'node:fs';
import path from 'node:path';

const DOC_META = [
  ['master-notes.html',    'Study Notes'],
  ['field-guide.html',     'Observations'],
  ['history.html',         'History'],
  ['sources.html',         'Sources'],
  ['other-side.html',      'The Strongest Case'],
  ['translations.html',    'Translations'],
  ['method-reference.html','Method & Reference'],
  ['glossary.html',        'Glossary'],
  ['cited-persons.html',   'Cited Persons'],
];

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/gs, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#167;/g, '§')
    .replace(/&#\d+;/g, ' ')
    .replace(/&#x[0-9a-f]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractPersons(html, filename, docTitle) {
  const entries = [];
  const pRe = /<p id="(person-[^"]+)">([\s\S]*?)<\/p>/gi;
  let m;
  while ((m = pRe.exec(html)) !== null) {
    const [, id, inner] = m;
    const text = stripHtml(inner);
    const nameM = inner.match(/<strong>([^<]+)<\/strong>/);
    const name = nameM ? nameM[1] : id.replace('person-', '').replace(/-/g, ' ');
    const flag = /<span class="flag-tag"/.test(inner);
    entries.push({
      url: `${filename}#${id}`,
      doc: docTitle,
      title: name,
      text: text.slice(0, 600),
      flag,
    });
  }
  return entries;
}

function extractSections(html, filename, docTitle) {
  const entries = [];
  const headRe = /<h([23])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;
  const headings = [];
  let m;
  while ((m = headRe.exec(html)) !== null) {
    headings.push({ id: m[2], title: stripHtml(m[3]), pos: m.index, end: headRe.lastIndex });
  }
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const nextPos = headings[i + 1]?.pos ?? html.length;
    const body = html.slice(h.end, nextPos);
    // Skip the section if it's mostly nav/metadata (< 30 chars of body text)
    const text = stripHtml(body);
    if (text.length < 30) continue;
    entries.push({
      url: `${filename}#${h.id}`,
      doc: docTitle,
      title: h.title,
      text: text.slice(0, 600),
      flag: false,
    });
  }
  return entries;
}

function stripMarkdown(md) {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*•]\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*|__|\*|_/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^---+$/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractReligionLaw(baseDir) {
  const entries = [];
  const root = path.join(baseDir, 'research', 'religion-law');
  const statesDir = path.join(root, 'us-states');
  if (!fs.existsSync(statesDir)) return entries;

  for (const file of fs.readdirSync(statesDir).filter((name) =>
    name.endsWith('.md') && !['index.md', 'profile-template.md', 'anchor-state-status.md'].includes(name)
  ).sort()) {
    const md = fs.readFileSync(path.join(statesDir, file), 'utf8');
    const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() || file.replace(/\.md$/, '');
    entries.push({
      url: `religion-law.html#state=${file.replace(/\.md$/, '')}`,
      doc: 'Religion & Law',
      title,
      text: stripMarkdown(md).slice(0, 1400),
      flag: false,
    });
  }

  const supportingDocs = [
    ['methodology.md', 'Methodology', 'methodology'],
    ['us-constitutional-federal.md', 'U.S. Constitutional & Federal Baseline', 'federal'],
    ['formal-law-institutional-practice.md', 'Formal Law vs. Institutional Practice', 'formal-practice'],
    ['us-state-law.md', 'U.S. State-Law Module', 'state-module'],
    ['state-context-methodology.md', 'State Demographics & Power Methodology', 'state-context'],
    ['source-registry.md', 'Religion & Law Source Registry', 'sources'],
    ['comparative-constitutional-systems.md', 'Comparative Constitutional Systems', 'comparative'],
  ];
  for (const [file, title, route] of supportingDocs) {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) continue;
    const md = fs.readFileSync(fullPath, 'utf8');
    entries.push({
      url: `religion-law.html#doc=${route}`,
      doc: 'Religion & Law',
      title,
      text: stripMarkdown(md).slice(0, 1400),
      flag: false,
    });
  }

  const overviewData = [
    ['records/policy-influence.json', 'Policy influence', 'issue'],
    ['records/global-legal-structure.json', 'Global legal structure', 'issue'],
    ['records/institutional-practice.json', 'Institutional practice', 'example'],
  ];
  for (const [file, group, titleField] of overviewData) {
    const fullPath = path.join(root, file);
    if (!fs.existsSync(fullPath)) continue;
    const rows = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    for (const row of rows) {
      const text = Object.entries(row)
        .filter(([key]) => !['id', 'sources'].includes(key))
        .map(([, value]) => String(value))
        .join(' ');
      entries.push({
        url: 'religion-law.html#overview',
        doc: 'Religion & Law',
        title: `${group}: ${row[titleField] || row.id}`,
        text: text.slice(0, 1400),
        flag: false,
      });
    }
  }
  return entries;
}

export function buildSearchIndex(baseDir = '.') {
  const index = [];
  for (const [filename, docTitle] of DOC_META) {
    const filepath = path.join(baseDir, filename);
    if (!fs.existsSync(filepath)) {
      process.stderr.write(`SKIP (not found): ${filepath}\n`);
      continue;
    }
    // Drop script/style blocks: stripHtml removes tags but keeps their text
    // content, which let the readers' inline JS leak into the last section's
    // indexed text.
    const html = fs.readFileSync(filepath, 'utf8')
      .replace(/<script[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[\s\S]*?<\/style>/gi, ' ');
    const entries = filename === 'cited-persons.html'
      ? extractPersons(html, filename, docTitle)
      : extractSections(html, filename, docTitle);
    index.push(...entries);
    process.stdout.write(`  ${filename}: ${entries.length} entries\n`);
  }
  index.push(...extractReligionLaw(baseDir));
  return index;
}

// CLI entry point
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.url.replace('file://', ''))) {
  const args = process.argv.slice(2);
  let outFile = 'search-index.json';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) { outFile = args[++i]; }
  }
  process.stdout.write('Building search index...\n');
  const index = buildSearchIndex('.');
  const json = JSON.stringify(index);
  fs.writeFileSync(outFile, json, 'utf8');
  process.stdout.write(`\nWrote ${outFile}: ${index.length} entries, ${json.length} bytes\n`);
}
