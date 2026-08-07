import fs from 'node:fs';
import path from 'node:path';

const APP_DIR = 'app';
const CANONICAL_SOURCES = [
  'Bible_Deep_Dive_Master_Notes.md',
  'Field_Guide_Conversation_Reference.md',
  'Glossary.md',
  'Historical_Framework.md',
  'Sources_and_Primary_Texts.md',
  'The_Other_Side.md',
  'Translations.md',
];

function parseArgs(argv) {
  const args = { output: 'dist/religion-knowledge-standalone.html' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--output') {
      if (!argv[i + 1]) throw new Error('--output requires a path');
      args.output = argv[i + 1];
      i += 1;
    }
  }
  return args;
}

function resolveScriptPath(src) {
  return path.normalize(path.join(APP_DIR, src));
}

function escapeForInlineScript(code) {
  // A literal "</script" inside inlined JS (e.g. in a string) would close the
  // tag early when parsed as HTML. Escaping the slash keeps the JS identical
  // at runtime while making it HTML-safe.
  return code.replace(/<\/script/gi, '<\\/script');
}

function inlineScript(code, label) {
  return `<script>\n/* ${label} */\n${escapeForInlineScript(code)}\n</script>`;
}

function toTextDataUri(content) {
  return `data:text/plain;charset=utf-8;base64,${Buffer.from(content, 'utf8').toString('base64')}`;
}

const { output } = parseArgs(process.argv.slice(2));

for (const file of CANONICAL_SOURCES) {
  if (!fs.existsSync(file)) throw new Error(`Canonical source missing: ${file}`);
}

// A single opened HTML file can't reach sibling ".md" files on disk the way
// the served app does (relative "../File.md" links). Embed read-only copies
// of the seven canonical documents as data URIs so "Open original source"
// still works offline. This never touches the source files themselves.
const sourceUris = {};
for (const file of CANONICAL_SOURCES) {
  sourceUris[file] = toTextDataUri(fs.readFileSync(file, 'utf8'));
}
const sourceUrisScript = inlineScript(
  `window.RELIGION_KNOWLEDGE_SOURCE_URIS = ${JSON.stringify(sourceUris)};`,
  'embedded canonical source documents (standalone build — read-only copies for offline viewing)'
);

let html = fs.readFileSync(path.join(APP_DIR, 'index.html'), 'utf8');

const cssLinkTag = '<link rel="stylesheet" href="styles.css">';
if (!html.includes(cssLinkTag)) {
  throw new Error('app/index.html no longer has the expected styles.css <link> tag');
}
const css = fs.readFileSync(path.join(APP_DIR, 'styles.css'), 'utf8');
html = html.replace(cssLinkTag, `<style>\n${css}\n</style>`);

let injectedSourceUris = false;
let scriptCount = 0;
html = html.replace(/<script src="([^"]+)"><\/script>/g, (match, src) => {
  scriptCount += 1;
  const resolved = resolveScriptPath(src);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Script referenced by app/index.html not found on disk: ${resolved} (run "npm run generate-records" first)`);
  }
  const inlined = inlineScript(fs.readFileSync(resolved, 'utf8'), src);
  // Inject just before position-history.js, the first app script that runs —
  // must be defined before source-library.js / source-links.js execute.
  if (src === 'position-history.js') {
    injectedSourceUris = true;
    return `${sourceUrisScript}\n  ${inlined}`;
  }
  return inlined;
});

if (!injectedSourceUris) {
  throw new Error('Could not find the app/position-history.js script tag to anchor the embedded-source injection point');
}
if (scriptCount === 0) {
  throw new Error('app/index.html has no <script src="..."> tags to inline — did the loading mechanism change?');
}

const banner = [
  '<!--',
  '  GENERATED FILE — DO NOT HAND EDIT.',
  '  Self-contained standalone build of app/index.html for offline / no-server use',
  '  (e.g. opening directly on a phone). Regenerate with: npm run build:standalone',
  '',
  '  Data, styling, and behavior are identical to the served app. The only',
  '  difference: "Open original source" opens an embedded read-only copy',
  '  (data: URI) instead of a relative file link, since a single opened file',
  '  cannot reach sibling files on disk.',
  '-->',
].join('\n');

const outputDir = path.dirname(output);
fs.mkdirSync(outputDir, { recursive: true });
const finalHtml = `${banner}\n${html}`;
fs.writeFileSync(output, finalHtml, 'utf8');

const bytes = Buffer.byteLength(finalHtml, 'utf8');
console.log(`STANDALONE_BUILD_SUMMARY=${JSON.stringify({
  output,
  size_bytes: bytes,
  size_mb: Math.round((bytes / 1024 / 1024) * 100) / 100,
  scripts_inlined: scriptCount,
  canonical_sources_embedded: CANONICAL_SOURCES.length,
})}`);
