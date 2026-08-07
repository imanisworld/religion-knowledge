import fs from 'node:fs';
import path from 'node:path';

const READERS = [
  ['master-notes.html', 'Master Notes', 'The full study — audits, corrections, and the reading in progress.'],
  ['field-guide.html', 'Field Guide', 'Conversation-ready reference: quick answers with sourcing.'],
  ['history.html', 'Historical Framework', 'Chronology, empires, textual history, and canon formation.'],
  ['sources.html', 'Sources & Primary Texts', 'Named scholars, publications, and primary-text citations.'],
  ['other-side.html', 'The Other Side', 'The strongest traditional and apologetic cases, stated fairly.'],
  ['translations.html', 'Translations', 'Translation history and the choices behind disputed renderings.'],
  ['glossary.html', 'Glossary', 'Terms and definitions used across the study.'],
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
body{margin:0;background:var(--ground);color:var(--ink);font-family:var(--f-body);
  line-height:1.5;-webkit-font-smoothing:antialiased}
main{max-width:960px;margin:0 auto;padding:4rem 1.5rem 5rem}
h1{font-family:var(--f-display);font-size:2.1rem;font-weight:500;letter-spacing:-.01em;margin:0 0 .4rem}
main > p{color:var(--ink2);margin:0 0 2.5rem;max-width:60ch}
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
  <p>A critical study of the Bible and religious belief systems, approached historically and analytically. Seven cross-linked documents.</p>
  <div class="grid">${cards}
  </div>
</main>
</body></html>
`;
}

const { output } = parseArgs(process.argv.slice(2));

for (const [file] of READERS) {
  if (!fs.existsSync(file)) throw new Error(`Reader HTML missing: ${file}`);
}

fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output, { recursive: true });

for (const [file] of READERS) {
  fs.copyFileSync(file, path.join(output, file));
}
fs.writeFileSync(path.join(output, 'index.html'), buildIndexHtml(), 'utf8');

console.log(`READER_SITE_BUILD_SUMMARY=${JSON.stringify({
  output,
  files: READERS.length + 1,
})}`);
