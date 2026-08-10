import fs from 'node:fs';
import path from 'node:path';

const READERS = [
  ['master-notes.html', 'Study Notes', 'The full study — audits, corrections, and the reading in progress.'],
  ['field-guide.html', 'Observations', 'Reading and conversation reference: claims, context, questions, and sources.'],
  ['history.html', 'Historical Framework', 'Chronology, empires, textual history, and canon formation.'],
  ['sources.html', 'Sources & Primary Texts', 'Named scholars, publications, and primary-text citations.'],
  ['other-side.html', 'The Strongest Case', 'The strongest traditional and apologetic cases, stated fairly.'],
  ['translations.html', 'Translations', 'Translation history and the choices behind disputed renderings.'],
  ['method-reference.html', 'Method & Reference', 'Survey method, open audit queue, reading timeline.'],
  ['glossary.html', 'Glossary', 'Terms and definitions used across the study.'],
];

// The deployed site is the full product, mirroring the repo layout so the
// app's relative paths (../data/…, ../master-notes.html) work unchanged:
// readers at the root, the app under app/, its data under data/, and the
// canonical Markdown alongside for the app's "open original" fallback.
const APP_FILES = [
  'app/index.html',
  'app/styles.css',
  'app/app.js',
  'app/position-history.js',
  'app/source-links.js',
  'app/review-backup.js',
  'app/source-library.js',
];

const DATA_FILES = [
  'data/normalized/records.js',
  'data/review/overrides.js',
];

const CANONICAL_SOURCES = [
  'Bible_Deep_Dive_Master_Notes.md',
  'Field_Guide_Conversation_Reference.md',
  'Glossary.md',
  'Historical_Framework.md',
  'Method_and_Reference.md',
  'Sources_and_Primary_Texts.md',
  'The_Other_Side.md',
  'Translations.md',
];

function parseArgs(argv) {
  const args = { output: 'dist/reader-site' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output') {
      if (!argv[i + 1]) throw new Error('--output requires a path');
      args.output = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function buildIndexHtml() {
  const cards = READERS.map(([file, title, blurb]) => `
      <a class="card" href="${file}">
        <h2>${title}</h2>
        <p>${blurb}</p>
      </a>`).join('');

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bible Deep Dive</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --ground:#EDEFEC; --paper:#FFFFFF; --ink:#17201D; --ink2:#4A5551; --ink3:#7A8582;
  --rule:#D3D8D4; --accent:#1F5E5B; --accent-soft:#E3EDEC;
  --f-display:"Newsreader",Georgia,serif;
  --f-body:"IBM Plex Sans",system-ui,sans-serif;
}
*{box-sizing:border-box}
html,body{overflow-x:hidden}
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--f-body);
  line-height:1.5;-webkit-font-smoothing:antialiased}
main{max-width:960px;margin:0 auto;padding:4rem 1.5rem 5rem}
h1{font-family:var(--f-display);font-size:2.1rem;font-weight:500;letter-spacing:-.01em;margin:0 0 .4rem}
main > p{color:var(--ink2);margin:0 0 2rem;max-width:60ch}
.app-card{display:block;background:var(--ink);color:#F2F5F3;border-radius:12px;
  padding:1.4rem 1.5rem;text-decoration:none;margin:0 0 2rem;transition:opacity .15s}
.app-card:hover{opacity:.92}
.app-card h2{font-family:var(--f-display);font-size:1.3rem;font-weight:500;margin:0 0 .35rem}
.app-card p{margin:0;font-size:.92rem;color:#C9D2CE;line-height:1.45}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1rem}
.card{display:block;background:var(--paper);border:1px solid var(--rule);border-radius:10px;
  padding:1.25rem 1.4rem;text-decoration:none;color:inherit;transition:border-color .15s}
.card:hover{border-color:var(--accent)}
.card h2{font-family:var(--f-display);font-size:1.15rem;font-weight:500;margin:0 0 .4rem;color:var(--ink)}
.card p{margin:0;font-size:.92rem;color:var(--ink3);line-height:1.45}
</style>
</head><body>
<main>
  <h1>Bible Deep Dive</h1>
  <p>A critical study of the Bible and religious belief systems, approached historically and analytically. Eight cross-linked documents.</p>
  <a class="app-card" href="app/">
    <h2>Open the app</h2>
    <p>Browse every record with provenance intact — search, topics, questions, audits, and the review queue.</p>
  </a>
  <div class="grid">${cards}
  </div>
</main>
</body></html>
`;
}

const { output } = parseArgs(process.argv.slice(2));

const generatedDir = 'data/normalized/generated';
const generatedFiles = fs.existsSync(generatedDir)
  ? fs.readdirSync(generatedDir).filter((f) => f.endsWith('.js')).map((f) => path.join(generatedDir, f))
  : [];
if (!generatedFiles.length) throw new Error('No generated record files found — run "npm run generate-records" first');

const allFiles = [
  ...READERS.map(([file]) => file),
  ...APP_FILES,
  ...DATA_FILES,
  ...generatedFiles,
  ...CANONICAL_SOURCES,
];
for (const file of allFiles) {
  if (!fs.existsSync(file)) throw new Error(`Deploy input missing: ${file}`);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const file of allFiles) {
  const target = path.join(output, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target);
}
fs.writeFileSync(path.join(output, 'index.html'), buildIndexHtml(), 'utf8');

console.log(`READER_SITE_BUILD_SUMMARY=${JSON.stringify({
  output,
  readers: READERS.length,
  app_files: APP_FILES.length,
  data_files: DATA_FILES.length + generatedFiles.length,
  canonical_sources: CANONICAL_SOURCES.length,
  total_files: allFiles.length + 1,
})}`);
