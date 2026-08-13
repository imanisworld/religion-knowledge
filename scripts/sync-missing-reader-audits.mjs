import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const DOCUMENTS = [
  ['Field_Guide_Conversation_Reference.md', 'field-guide.html'],
];

const plain = (value) => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&quot;|&ldquo;|&rdquo;/g, '"')
  .replace(/&apos;|&lsquo;|&rsquo;/g, "'")
  .replace(/<[^>]+>/g, '')
  .replace(/[`*_“”‘’"']/g, '')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

const auditIdentity = (value) => {
  const normalized = plain(value).replace(/^addendum\s*[—-]\s*/, '');
  if (/two innate fears/.test(normalized)) {
    return 'is religious fear innate or learned?';
  }
  return normalized;
};

const slug = (value) => value
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

function auditBlocks(markdown) {
  const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
  const audits = [];
  let section = null;
  for (let index = 0; index < lines.length; index += 1) {
    const sectionMatch = lines[index].match(/^#{1,3}\s+(\d+(?:\.\d+)*)\.?\s+/);
    if (sectionMatch) section = sectionMatch[1];
    const auditMatch = lines[index].match(/^####\s+⚑\s*AUDIT(?:\s+ADDENDUM)?\s*[—-]\s*(.+)$/i);
    if (!auditMatch) continue;
    let end = index + 1;
    while (end < lines.length && !/^---\s*$/.test(lines[end]) && !/^#{1,4}\s+/.test(lines[end])) end += 1;
    audits.push({ title: auditMatch[1].trim(), section, body: lines.slice(index + 1, end).join('\n').trim() });
    index = end - 1;
  }
  return audits;
}

function renderAudit(audit) {
  const result = spawnSync('pandoc', ['-f', 'gfm', '-t', 'html5'], { input: audit.body, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || `pandoc failed for ${audit.title}`);
  const checked = audit.body.match(/`CHECKED\s+([^`]+)`/i)?.[1] || 'DATE MISSING';
  const statusText = audit.body.match(/^\*\*STATUS(?:\s*:[^*]*)?\*\*/mi)?.[0] || '';
  const status = /collapse/i.test(statusText) ? 'collapses' : /overstat/i.test(statusText) ? 'overstated' : 'holds';
  const badge = status === 'collapses' ? 'Collapses' : status === 'overstated' ? 'Overstated' : 'Holds';
  let body = result.stdout
    .replace(/<p><code>CHECKED[^<]+<\/code><\/p>\s*/i, '')
    .replace(/⟨INFERENCE⟩/g, '<span class="mark inf">INFERENCE</span>')
    .replace(/<p><strong>AS RECORDED(?:\s*\([^<]*\))?:<\/strong>\s*/gi, '<span class="fld">AS RECORDED</span><p class="hasfld">')
    .replace(/<p><strong>STATUS:\s*/gi, '<span class="fld">STATUS</span><p class="hasfld"><strong>')
    .replace(/<p><strong>AUDIT<\/strong><\/p>/gi, '<span class="fld">AUDIT</span><p class="hasfld"></p>')
    .replace(/<p><strong>CORRECTED:<\/strong>\s*/gi, '<span class="fld">CORRECTED</span><p class="hasfld">')
    .replace(/<p><strong>WHY IT LOOKED RIGHT<\/strong>\s*(?:<span class="mark inf">INFERENCE<\/span>)?<strong>:<\/strong>\s*/gi, '<span class="fld">WHY IT LOOKED RIGHT</span><p class="hasfld"><span class="mark inf">INFERENCE</span><strong>:</strong> ');
  return `<details class="audit" data-status="${status}" id="a-${slug(audit.title)}"><summary><span class="siglum">⚑</span><span class="atitle">${audit.title}</span><span class="stamp">CHECKED ${checked.toUpperCase()}</span><span class="badge ${status}">${badge}</span><span class="chev">▶</span></summary><div class="abody">${body}</div></details>`;
}

for (const [markdownFile, htmlFile] of DOCUMENTS) {
  const audits = auditBlocks(fs.readFileSync(markdownFile, 'utf8'));
  let html = fs.readFileSync(htmlFile, 'utf8');
  const seenCards = new Set();
  html = html.replace(/<details class="audit"[\s\S]*?<span class="atitle">([\s\S]*?)<\/span>[\s\S]*?<\/details>/g, (card, title) => {
    const identity = auditIdentity(title);
    if (seenCards.has(identity)) return '';
    seenCards.add(identity);
    return card;
  });
  const existing = new Set([...html.matchAll(/<span class="atitle">([\s\S]*?)<\/span>/g)].map((match) => auditIdentity(match[1])));
  let added = 0;
  for (const audit of audits) {
    if (existing.has(auditIdentity(audit.title))) continue;
    if (!audit.section) throw new Error(`Cannot locate section for ${audit.title}`);
    const sectionStart = html.indexOf(`<section id="sec-${audit.section}">`);
    if (sectionStart < 0) throw new Error(`Reader section ${audit.section} missing for ${audit.title}`);
    const sectionEnd = html.indexOf('</section>', sectionStart);
    if (sectionEnd < 0) throw new Error(`Reader section ${audit.section} is unclosed`);
    html = `${html.slice(0, sectionEnd)}${renderAudit(audit)}\n${html.slice(sectionEnd)}`;
    existing.add(auditIdentity(audit.title));
    added += 1;
  }
  fs.writeFileSync(htmlFile, html, 'utf8');
  console.log(`${htmlFile}: added ${added} missing audit card(s)`);
}
