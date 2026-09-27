import fs from 'node:fs';
import path from 'node:path';
import { buildSearchIndex } from './build-search-index.mjs';

const READERS = [
  ['master-notes.html', 'Study Notes', 'The full study — audits, corrections, and the reading in progress.'],
  ['field-guide.html', 'Observations', 'Reading and conversation reference: claims, context, questions, and sources.'],
  ['history.html', 'Historical Framework', 'Chronology, empires, textual history, and canon formation.'],
  ['sources.html', 'Sources & Primary Texts', 'Named scholars, publications, and primary-text citations.'],
  ['other-side.html', 'The Strongest Case', 'The strongest traditional and apologetic cases, stated fairly.'],
  ['translations.html', 'Translations', 'Translation history and the choices behind disputed renderings.'],
  ['method-reference.html', 'Method & Reference', 'Survey method, open audit queue, reading timeline.'],
  ['glossary.html', 'Glossary', 'Terms and definitions used across the study.'],
  ['personal-belief-history.html', 'Personal Belief History', 'A reconstruction log for what I actually believed at different stages, with unknowns preserved.'],
  ['search.html', 'Search', 'Search across all research documents and cited persons by name, topic, or scholar.'],
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

const MISC_FILES = [
  'highlight-referral.js',
  'correction-form.js',
  'cited-persons.html',
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
  'Personal_Belief_History.md',
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
<html lang="en" data-theme="light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Bible Deep Dive</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
:root{
  --ground:#F5F1F0;--paper:#FFFDFC;--ink:#241B1E;--ink2:#62565A;--ink3:#807277;
  --rule:#DDD2D5;--accent:#8B3A4A;--accent-strong:#6F2D3A;--accent-soft:#F4E7EA;
  --shadow:0 18px 45px rgba(57,34,42,.07);
  --f-display:"Newsreader",Georgia,serif;
  --f-body:"IBM Plex Sans",system-ui,sans-serif;
}
*{box-sizing:border-box}
html,body{overflow-x:hidden}
body{
  margin:0;color:var(--ink);font-family:var(--f-body);line-height:1.58;
  -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(circle at 78% -10%,rgba(139,58,74,.09),transparent 34rem),
    var(--ground)
}
main{max-width:1080px;margin:0 auto;padding:5rem 1.6rem 6rem}
.hero{max-width:720px;margin-bottom:2.5rem}
.eyebrow{
  margin:0 0 .8rem;font-size:.68rem;font-weight:600;letter-spacing:.17em;
  text-transform:uppercase;color:var(--accent)
}
h1{
  font-family:var(--f-display);font-size:clamp(2.65rem,6vw,4.4rem);font-weight:500;
  letter-spacing:-.035em;line-height:.98;margin:0 0 1rem
}
main>.hero>p{color:var(--ink2);margin:0;max-width:62ch;font-size:1.03rem}
.app-card{
  position:relative;display:block;overflow:hidden;
  background:linear-gradient(135deg,var(--accent-strong),var(--accent));
  color:#FFF8FA;border:1px solid rgba(255,255,255,.12);border-radius:18px;
  padding:1.65rem 1.75rem;text-decoration:none;margin:0 0 2.1rem;
  box-shadow:0 18px 45px rgba(111,45,58,.18);
  transition:transform .18s ease,box-shadow .18s ease
}
.app-card::after{
  content:"→";position:absolute;right:1.6rem;top:50%;transform:translateY(-52%);
  font-size:1.45rem;opacity:.72;transition:transform .18s ease
}
.app-card:hover{
  transform:translateY(-2px);
  box-shadow:0 22px 52px rgba(111,45,58,.23)
}
.app-card:hover::after{transform:translate(.2rem,-52%)}
.app-card h2{
  font-family:var(--f-display);font-size:1.45rem;font-weight:500;margin:0 0 .35rem
}
.app-card p{margin:0;padding-right:3rem;font-size:.94rem;color:#F2DDE2;line-height:1.5}
.section-label{
  margin:2.2rem 0 .9rem;font-size:.7rem;font-weight:600;letter-spacing:.14em;
  text-transform:uppercase;color:var(--ink3)
}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1rem}
.card{
  display:block;min-height:150px;background:color-mix(in srgb,var(--paper) 96%,var(--accent-soft));
  border:1px solid var(--rule);border-radius:14px;padding:1.35rem 1.45rem;
  text-decoration:none;color:inherit;box-shadow:0 8px 24px rgba(57,34,42,.035);
  transition:transform .16s ease,border-color .16s ease,box-shadow .16s ease,background .16s ease
}
.card:hover{
  transform:translateY(-2px);border-color:color-mix(in srgb,var(--accent) 58%,var(--rule));
  background:var(--paper);box-shadow:var(--shadow)
}
.card h2{
  font-family:var(--f-display);font-size:1.2rem;font-weight:500;margin:0 0 .5rem;color:var(--ink)
}
.card p{margin:0;font-size:.91rem;color:var(--ink3);line-height:1.5}
@media(max-width:620px){
  main{padding:3.5rem 1rem 4rem}
  .hero{margin-bottom:2rem}
  .app-card{padding:1.4rem 1.35rem}
  .app-card::after{right:1.2rem}
  .grid{grid-template-columns:1fr}
  .card{min-height:0}
}
:root[data-theme=dark]{
  --ground:#120E10;--paper:#1C1518;--ink:#F7F2F3;--ink2:#C4B7BB;--ink3:#978A8F;
  --rule:#382B30;--accent:#D8899A;--accent-strong:#8B3A4A;--accent-soft:#3A2028;
  --shadow:0 18px 45px rgba(0,0,0,.22)
}
:root[data-theme=dark] .app-card{
  background:linear-gradient(135deg,#5F2734,#8B3A4A);
  border-color:#6F4650;box-shadow:0 18px 45px rgba(0,0,0,.26)
}
:root[data-theme=dark] .app-card p{color:#E8CCD3}
@media(prefers-color-scheme:dark){
  :root:not([data-theme=light]){
    --ground:#120E10;--paper:#1C1518;--ink:#F7F2F3;--ink2:#C4B7BB;--ink3:#978A8F;
    --rule:#382B30;--accent:#D8899A;--accent-strong:#8B3A4A;--accent-soft:#3A2028;
    --shadow:0 18px 45px rgba(0,0,0,.22)
  }
  :root:not([data-theme=light]) .app-card{
    background:linear-gradient(135deg,#5F2734,#8B3A4A);
    border-color:#6F4650;box-shadow:0 18px 45px rgba(0,0,0,.26)
  }
  :root:not([data-theme=light]) .app-card p{color:#E8CCD3}
}

/* ---------- landing readability refinement ---------- */
body{line-height:1.66}
main{padding-top:5.5rem}
.hero{max-width:760px;margin-bottom:2.8rem}
main>.hero>p{font-size:1.08rem;line-height:1.72;max-width:64ch}
.app-card{padding:1.8rem 1.9rem}
.app-card h2{font-size:1.55rem}
.app-card p{font-size:.98rem;line-height:1.62}
.section-label{margin-top:2.5rem}
.card{min-height:156px;padding:1.45rem 1.5rem}
.card h2{font-size:1.26rem;line-height:1.25}
.card p{font-size:.96rem;line-height:1.62}
.app-card:focus-visible,.card:focus-visible{
  outline:3px solid color-mix(in srgb,var(--accent) 34%,transparent);
  outline-offset:3px
}
:root[data-theme=dark]{--ink2:#D1C5C9;--ink3:#AA9CA1;--rule:#44343A}
@media(prefers-color-scheme:dark){:root:not([data-theme=light]){--ink2:#D1C5C9;--ink3:#AA9CA1;--rule:#44343A}}
@media(max-width:620px){
  main{padding-top:4rem}
  main>.hero>p{font-size:1rem}
  .app-card{padding:1.5rem 1.4rem}
  .card{padding:1.25rem 1.3rem}
}

/* ---------- landing interface refinement ---------- */
.grid{gap:1.1rem}
.card{position:relative;padding-right:3.2rem}
.card::after{
  content:"→";
  position:absolute;
  right:1.3rem;
  top:1.35rem;
  color:var(--accent);
  opacity:.55;
  transition:transform .16s ease,opacity .16s ease
}
.card:hover::after,.card:focus-visible::after{transform:translateX(.18rem);opacity:1}
.section-label{
  font-family:var(--f-body);
  font-size:.76rem;
  font-weight:600;
  letter-spacing:.08em
}
@media(max-width:620px){
  .card{padding-right:2.8rem}
  .card::after{right:1.1rem;top:1.2rem}
}
</style>
<script>try{var __t=localStorage.getItem("religion-knowledge-theme");document.documentElement.dataset.theme=__t||"light"}catch(e){document.documentElement.dataset.theme="light"}</script>
</head><body>
<main>
  <div class="hero">
    <p class="eyebrow">Religion Knowledge</p>
    <h1>Bible Deep Dive</h1>
    <p>A critical study of the Bible and religious belief systems, approached historically and analytically. Open the app to explore every claim with its sources and audit trail, or read the research documents directly.</p>
  </div>
  <a class="app-card" href="app/">
    <h2>Open the app</h2>
    <p>Browse every record with provenance intact — search, topics, questions, audits, and the review queue.</p>
  </a>
  <p class="section-label">Research library</p>
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
  ...MISC_FILES,
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

// Deployed app starts in light mode on first visit while preserving an
// explicit saved theme. Keep this deployment-only so the committed standalone
// bundle remains byte-consistent with app source until its next regeneration.
const deployedAppIndex = path.join(output, 'app/index.html');
let appIndexHtml = fs.readFileSync(deployedAppIndex, 'utf8');
appIndexHtml = appIndexHtml.replace('<html lang="en">', '<html lang="en" data-theme="light">');
appIndexHtml = appIndexHtml.replace(
  '<link rel="stylesheet" href="styles.css">',
  '<script>try{var __t=localStorage.getItem("religion-knowledge-theme");document.documentElement.dataset.theme=__t||"light";var __m=document.querySelector(\'meta[name="theme-color"]\');if(__m)__m.content=document.documentElement.dataset.theme==="dark"?"#211A1C":"#F5F1F0"}catch(e){document.documentElement.dataset.theme="light"}</script>\n  <link rel="stylesheet" href="styles.css">'
);
fs.writeFileSync(deployedAppIndex, appIndexHtml, 'utf8');

fs.writeFileSync(path.join(output, 'index.html'), buildIndexHtml(), 'utf8');

// Build search index from the reader HTML files already copied to dist
const searchIndex = buildSearchIndex(output);
const searchIndexJson = JSON.stringify(searchIndex);
fs.writeFileSync(path.join(output, 'search-index.json'), searchIndexJson, 'utf8');

console.log(`READER_SITE_BUILD_SUMMARY=${JSON.stringify({
  output,
  readers: READERS.length,
  app_files: APP_FILES.length,
  data_files: DATA_FILES.length + generatedFiles.length,
  canonical_sources: CANONICAL_SOURCES.length,
  search_entries: searchIndex.length,
  total_files: allFiles.length + 2,
})}`);
