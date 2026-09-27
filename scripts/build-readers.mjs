/**
 * build-readers.mjs — Generates reader HTML files from Markdown sources.
 *
 * Usage:
 *   node scripts/build-readers.mjs [--output dist/readers]
 *
 * Writes to dist/readers/ by default; does NOT overwrite the production HTML
 * files unless you point --output at the repo root.
 */

import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

// ── Disable marked's mangling/auto-id so we control all IDs ──
marked.use({ mangle: false, headerIds: false });

// ── Cross-document "Connects to" link map ────────────────────────────────────
// Keyed by doc html filename, then section/audit id.
// Each value is an array of link groups; each group becomes one <div class="related">.
// Links are [displayText, href].

const RELATED_BY_DOC = {
  'history.html': {
    's2-4': [
      [['Study §5.4 damnation escalation', 'master-notes.html#s5-4'],
       ['Observations §9.2 hell as a claim', 'field-guide.html#s9-2']],
    ],
    's3': [
      [['Study §6 the Gospels themselves', 'master-notes.html#s6-1'],
       ['§9 mythicism — do not use it', '#s9']],
    ],
    's5': [
      [['Study §5.2 key structural facts', 'master-notes.html#s5-2'],
       ['§7 what Nicaea did not do', '#s7']],
    ],
    's7': [
      [['§9 the myth version to avoid', '#s9'],
       ['Observations §13 the Trinity', 'field-guide.html#s13']],
    ],
    's9': [
      [['§10 the other side\'s bad history', '#s10'],
       ['§11 handling uncertainty', '#s11'],
       ['Study §11 the audit method', 'master-notes.html#s11']],
    ],
    's10': [
      [['§4 the manuscript answer', '#s4'],
       ['Study §6.5 slavery in disputed letters', 'master-notes.html#s6-5']],
    ],
  },
  'sources.html': {
    's1-4': [
      [['History §2.2 the 701 BCE timeline', 'history.html#s2-2'],
       ['History §1.3 what archaeology proves', 'history.html#s1-3']],
    ],
    's2-2': [
      [['History §2.4 Second Temple period', 'history.html#s2-4'],
       ['History §4 manuscripts', 'history.html#s4']],
    ],
    's2-3': [
      [['History §3 sources outside the NT', 'history.html#s3'],
       ['History §9 do not call it a forgery', 'history.html#s9']],
    ],
    's4-1': [
      [['History §4 what manuscripts establish', 'history.html#s4'],
       ['Study §8 John', 'master-notes.html#s8']],
    ],
    's6-1': [
      [['History §9 common skeptical claims', 'history.html#s9'],
       ['Study §11 the audit method', 'master-notes.html#s11']],
    ],
  },
  'other-side.html': {
    's1-2': [
      [['History §3 sources outside the NT', 'history.html#s3'],
       ['Study §6 the Gospels', 'master-notes.html#s6-1']],
    ],
    's1-3': [
      [['Study §1.8 Exodus audit — Hoffmeier', 'master-notes.html#s1-8'],
       ['History §10 apologetic history', 'history.html#s10']],
    ],
    's2-2': [
      [['Study §1.5 selective law-keeping', 'master-notes.html#s1-5'],
       ['Study §2 translation issues', 'master-notes.html#s2'],
       ['Observations §10 adding your own understanding', 'field-guide.html#s10']],
    ],
    's2-4': [
      [['Study §1.5 the same structural point', 'master-notes.html#s1-5'],
       ['Observations §1.2 circular reasoning', 'field-guide.html#s1-2']],
    ],
    's3': [
      [['History §11 handling uncertainty', 'history.html#s11'],
       ['Study §11 audit method', 'master-notes.html#s11']],
    ],
  },
  'master-notes.html': {
    's1': [
      [['History §1 how evidence works', 'history.html#s1'],
       ['History §2 the historical timeline', 'history.html#s2']],
    ],
    's1-2': [
      [['§1.3 Job breaks this model', '#s1-3'],
       ['§3.4 Amos rejects the ritual side', '#s3-4'],
       ['Observations §2.1 objective morality', 'field-guide.html#s2-1']],
    ],
    's1-3': [
      [['§1.2 the model Job attacks', '#s1-2'],
       ['Observations §9.3 free will', 'field-guide.html#s9-3']],
    ],
    's1-5': [
      [['§4 how it plays out on gender', '#s4'],
       ['⚑ Leviticus 18:22 audit', '#a-leviticus-18-22-20-13-worked-in-session'],
       ['§2 translation as a sorting tool', '#s2']],
    ],
    's1-8': [
      [['⚑ Exodus dating audit', '#a-exodus-composition-and-dating'],
       ['§3.2 Jeremiah in the same crisis', '#s3-2'],
       ['§3.3 Ezekiel in exile', '#s3-3']],
    ],
    's2': [
      [['§1.5 selective application', '#s1-5'],
       ['Observations §12.3 Isaiah 7:14', 'field-guide.html#s12-3']],
    ],
    's4': [
      [['Study §2 translation issues', 'master-notes.html#s2'],
       ['Observations §2.3 the Bible as God\'s word', 'field-guide.html#s2-3']],
      [['§1.5 selective law-keeping', '#s1-5'],
       ['⚑ Leviticus 18:22 audit', '#a-leviticus-18-22-20-13-worked-in-session'],
       ['Observations §15 God and women', 'field-guide.html#s15']],
    ],
    's5-1': [
      [['History §2.4 the Second Temple gap', 'history.html#s2-4'],
       ['History §5 canon formation', 'history.html#s5']],
    ],
    's5-4': [
      [['History §2.4 where hell and Satan came from', 'history.html#s2-4']],
      [['Observations §9.2 hell as a claim', 'field-guide.html#s9-2'],
       ['§8.6 the timeline problem', '#s8-6']],
    ],
    's6-5': [
      [['⚑ Pseudonymity audit — three tiers', '#a-deutero-pauline-pseudonymity-three-tiers-not-one'],
       ['§9.3 Acts vs. Paul\'s own letters', '#s9-3'],
       ['Observations §12.6 Gal 3:28 vs Col 3:22', 'field-guide.html#s12-6']],
    ],
    's8-5': [
      [['⚑ Audit — anti-Jewish rhetoric', '#a-john-is-textually-antisemitic'],
       ['Observations §12.8 John 8:44', 'field-guide.html#s12-8']],
    ],
    's8-6': [
      [['⚑ Audit — is delay the cause?', '#a-is-the-parousia-delay-actually-the-cause'],
       ['Observations §12.4 Mark 13:30 / Matt 16:28', 'field-guide.html#s12-4'],
       ['§5.4 damnation escalation', '#s5-4']],
    ],
    's9-2': [
      [['§9.3 the same council in Galatians', '#s9-3'],
       ['§6.5 Paul\'s letters', '#s6-5']],
    ],
    's9-3': [
      [['§6.5 Paul\'s letters', '#s6-5'],
       ['⚑ Audit — the speeches', '#a-are-the-speeches-fictional-constructions'],
       ['§9.4 conversion accounts', '#s9-4']],
    ],
    's11': [
      [['Method §1 corpus audit method', 'method-reference.html#s1']],
    ],
  },
};

function buildRelatedHtml(groups) {
  return groups.map(links =>
    `<div class="related"><b>Connects to</b>${links.map(([text, href]) =>
      `<a href="${href}">${escHtml(text)}</a>`).join('')}</div>`
  ).join('');
}

// ── Document registry ─────────────────────────────────────────────────────────

const DOCSWITCH = [
  { label: 'Study Notes',        href: 'master-notes.html' },
  { label: 'Observations',       href: 'field-guide.html' },
  { label: 'History',            href: 'history.html' },
  { label: 'Sources',            href: 'sources.html' },
  { label: 'The Strongest Case', href: 'other-side.html' },
  { label: 'Translations',       href: 'translations.html' },
  { label: 'Method &amp; Reference', href: 'method-reference.html' },
  { label: 'Glossary',           href: 'glossary.html' },
  { label: 'Cited Persons',      href: 'cited-persons.html' },
  { label: 'Religion &amp; Law', href: 'religion-law.html' },
  { label: 'Personal History',   href: 'personal-belief-history.html' },
  { label: 'Search',             href: 'search.html' },
];

const DOCS = [
  {
    md:       'Bible_Deep_Dive_Master_Notes.md',
    html:     'master-notes.html',
    title:    'Bible Deep Dive: Study Notes',
    doctitle: 'Bible Deep Dive: Study Notes',
    docsub:   'Findings &amp; textual analysis',
    lens:     'Critical / Historical / Moral Lens',
    masthead: 'Bible Deep Dive: Study Notes',
    meta:     '<span><b>Source</b>ESV + audiobook</span><span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="field-guide.html">Observations</a></span>',
    hasAudits: true,
    hasHowto:  true,
    howto:    `<p><strong>Provenance.</strong> <strong>Written by:</strong> you, across
the reading. <strong>Audits added by:</strong> Claude, with sources
named. <strong>Honest limitation:</strong> §0–§9 predate this convention
and are a genuine mix — your reading notes and Claude's earlier framing,
no longer cleanly separable after the fact. Do not assume a claim in
those sections is sourced unless a name is attached. Everything from the
audit sections onward is marked.</p>`,
    // Field Guide uses # for chapter markers (h1, not in TOC), ## for sections
    chapterMarkers: false,
  },
  {
    md:       'Field_Guide_Conversation_Reference.md',
    html:     'field-guide.html',
    title:    'Observations: Live Conversation Reference',
    doctitle: 'Observations: Live Conversation Reference',
    docsub:   'Reading notes &amp; conversation questions',
    lens:     'Bible Reading, Religion, Morality, and Conversation',
    masthead: 'Observations: Live Conversation Reference',
    meta:     '<span><b>Source</b>ESV + audiobook</span><span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="master-notes.html">Study Notes</a></span>',
    hasAudits: true,
    hasHowto:  false,
    chapterMarkers: true,  // # N. CHAPTER → h1, not in TOC
  },
  {
    md:       'Historical_Framework.md',
    html:     'history.html',
    title:    'Historical Framework',
    doctitle: 'Historical Framework',
    docsub:   'Chronology &amp; evidence',
    lens:     'Chronology, Evidence, and Historical Context',
    masthead: 'Historical Framework',
    meta:     '<span><b>Source</b>ESV + audiobook</span><span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="master-notes.html">Study Notes</a></span>',
    hasAudits: false,
    hasHowto:  false,
    chapterMarkers: false,
  },
  {
    md:       'Sources_and_Primary_Texts.md',
    html:     'sources.html',
    title:    'Sources &amp; Primary Texts',
    doctitle: 'Sources &amp; Primary Texts',
    docsub:   'What they say + links',
    lens:     'Primary Evidence — Read It Yourself',
    masthead: 'Sources &amp; Primary Texts',
    meta:     '<span><b>Source</b>ESV + audiobook</span><span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="history.html">History</a></span>',
    hasAudits: false,
    hasHowto:  false,
    chapterMarkers: false,
  },
  {
    md:       'The_Other_Side.md',
    html:     'other-side.html',
    title:    'The Strongest Case',
    doctitle: 'The Strongest Case',
    docsub:   'Theologians, apologists, hermeneutics',
    lens:     'Steelmanning the Believing Position',
    masthead: 'The Strongest Case',
    meta:     '<span><b>Source</b>ESV + audiobook</span><span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="sources.html">Sources</a></span>',
    hasAudits: false,
    hasHowto:  false,
    chapterMarkers: false,
  },
  {
    md:       'Translations.md',
    html:     'translations.html',
    title:    'Translations',
    doctitle: 'Translations',
    docsub:   'Which Bible, and why',
    lens:     'Which Bible You Read Is Already an Interpretation',
    masthead: 'Translations',
    meta:     '<span><b>Source</b>ESV + audiobook</span><span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="master-notes.html">Study Notes</a></span>',
    hasAudits: false,
    hasHowto:  false,
    chapterMarkers: false,
  },
  {
    md:       'Method_and_Reference.md',
    html:     'method-reference.html',
    title:    'Method &amp; Reference',
    doctitle: 'Method &amp; Reference',
    docsub:   'How claims get verified, and where to look',
    lens:     'How This Corpus Verifies Claims, and Where to Look',
    masthead: 'Method &amp; Reference',
    meta:     '<span><b>Updated</b>10 August 2026</span><span><b>Companion</b><a href="field-guide.html">Observations</a></span>',
    hasAudits: false,
    hasHowto:  false,
    chapterMarkers: false,
  },
  {
    md:       'Glossary.md',
    html:     'glossary.html',
    title:    'Glossary',
    doctitle: 'Glossary',
    docsub:   'Technical terms, in plain English',
    lens:     'Every Technical Term, in Plain English',
    masthead: 'Glossary',
    meta:     '<span><b>Updated</b>August 2026</span><span><b>Companion</b><a href="method-reference.html">Method &amp; Reference</a></span>',
    hasAudits: false,
    hasHowto:  false,
    chapterMarkers: false,
  },
];

// cited-persons.html is maintained by hand alongside Cited_Persons.md.
// It is excluded from the generated pipeline to preserve its clean flag-tag
// format; Cited_Persons.md entries are under review and not publication-ready.

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizePersonName(text) {
  return text
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/\s+/g, ' ')
    .trim();
}

function readStablePersonIds(htmlPath) {
  const ids = new Map();
  if (!fs.existsSync(htmlPath)) return ids;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const entryRe = /<p id="([^"]+)"[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>/g;
  for (const match of html.matchAll(entryRe)) {
    ids.set(normalizePersonName(match[2]), match[1]);
  }
  // This public anchor predates the deterministic builder. Keep it stable even
  // though HTML entity encoding previously made the apostrophe look like a rename.
  ids.set("O'Neill, Tim", 'person-oneill-tim');
  return ids;
}

function addPersonAnchors(html, stableIds) {
  const entryRe = /<p>(\s*<span class="mark (?:doc|unresolved)">(?:DOCUMENTED|UNRESOLVED)<\/span>\s*<strong>([^<]+)<\/strong>)/g;
  return html.replace(entryRe, (match, start, rawName) => {
    const name = normalizePersonName(rawName);
    const id = stableIds.get(name) || `person-${slugify(name)}`;
    if (stableIds.has(name) && stableIds.get(name) !== id) {
      throw new Error(`Conflicting stable person anchor for ${name}`);
    }
    stableIds.set(name, id);
    return `<p id="${id}">${start}`;
  });
}

function numToId(num) {
  // "1" → "s1", "1.2" → "s1-2", "9.5.3" → "s9-5-3"
  return 's' + num.replace(/\./g, '-');
}

function secId(num) {
  // section wrapper id: "1" → "sec-1", "9.5" → "sec-9-5"
  return 'sec-' + num.replace(/\./g, '-');
}

// Classify a STATUS text string into one of four canonical statuses.
// Returns { badge, dataStatus } where badge is the display text.
function parseStatusBadge(statusText) {
  const t = statusText.trim();
  const lower = t.toLowerCase();

  // Leading canonical phrase (highest confidence)
  if (/^Holds w\/\s*revisions/i.test(t)) return { badge: 'Holds w/ revisions', dataStatus: 'holds' };
  if (/^New entry/i.test(t)) return { badge: 'New entry', dataStatus: 'new' };
  if (/^Collapses/i.test(t)) return { badge: 'Collapses', dataStatus: 'collapses' };
  if (/^Overstated/i.test(t)) return { badge: 'Overstated', dataStatus: 'overstated' };

  // "Directionally sound" = positive but needs revision; "directionally right/correct" = overstated
  if (/directionally sound/i.test(t)) return { badge: 'Holds w/ revisions', dataStatus: 'holds' };
  if (/directional/i.test(t)) return { badge: 'Overstated', dataStatus: 'overstated' };

  // "Substantially wrong in framing" → overstated (wrong framing, not wrong claim)
  if (/substantially wrong in framing/i.test(t)) return { badge: 'Overstated', dataStatus: 'overstated' };
  // Other "wrong" signals → collapses
  if (/\b(wrong|incorrect|false|mistaken)\b/.test(lower)) return { badge: 'Collapses', dataStatus: 'collapses' };

  // "Holds —" followed by qualification → Holds w/ revisions
  if (/^holds\s*[—\-]/i.test(t)) return { badge: 'Holds w/ revisions', dataStatus: 'holds' };
  // Plain leading "Holds"
  if (/^Holds/i.test(t)) return { badge: 'Holds', dataStatus: 'holds' };

  // Positive signal + qualification signals → Holds w/ revisions
  const hasPositive = /\b(holds?|correct|accurate|real|sound|documented)\b/.test(lower);
  const hasQualifier = /\b(but\b|weaker|more specific|resolves differently|terminology|flattened|nuance|needs)\b/.test(lower);
  if (hasPositive && hasQualifier) return { badge: 'Holds w/ revisions', dataStatus: 'holds' };
  if (hasPositive) return { badge: 'Holds', dataStatus: 'holds' };

  // Fallback keyword scan
  if (/\boverstated\b/.test(lower)) return { badge: 'Overstated', dataStatus: 'overstated' };
  if (/\bcollapses\b/.test(lower)) return { badge: 'Collapses', dataStatus: 'collapses' };
  if (/\bnew entry\b/.test(lower)) return { badge: 'New entry', dataStatus: 'new' };

  return { badge: 'Holds', dataStatus: 'holds' };
}

function badgeStatus(badge) {
  return badge.toLowerCase().split(/\W/)[0]; // "holds", "overstated", "collapses", "new"
}

// ── Inline post-processing ────────────────────────────────────────────────────

function postProcessInline(html) {
  // Attribution markers
  html = html
    .replace(/⟨DOCUMENTED⟩/g, '<span class="mark doc">DOCUMENTED</span>')
    .replace(/⟨UNRESOLVED⟩/g, '<span class="mark unresolved">UNRESOLVED</span>')
    .replace(/⟨INFERENCE⟩/g, '<span class="mark inf">INFERENCE</span>')
    .replace(/⟨YOURS⟩/g, '<span class="mark you">YOURS</span>');

  // Camp tags [CAMP LABEL] — must start with 2+ uppercase letters (camp keyword)
  // and not be a markdown link (those are already converted to <a> by this point).
  // Labels can contain mixed case (e.g. [CRITICAL, archaeologist, anti-minimalist]).
  html = html.replace(/\[([A-Z]{2,}[^\[\]\n]*)\]/g, (match, inner) => {
    // Skip if this looks like a remaining markdown link target (contains a URL-like pattern)
    if (/https?:\/\/|\.html|\.md/.test(inner)) return match;
    return `<span class="camp">${inner}</span>`;
  });

  // Plain § references are intentionally left as text. A section number alone
  // does not say which reader owns the target, so inferring a same-document
  // href creates broken or misleading links. Explicit Markdown and RELATED_BY_DOC
  // links remain clickable and are checked by validate-reader-sync.mjs.

  return html;
}

// ── AUDIT block builder ───────────────────────────────────────────────────────

function buildAuditHtml(block) {
  const { title, stamp, badge, dataStatus, fields, id } = block;

  const summaryHtml =
    `<summary>` +
    `<span class="siglum">⚑</span>` +
    `<span class="atitle">${escHtml(title)}</span>` +
    (stamp ? `<span class="stamp">${escHtml(stamp)}</span>` : '') +
    `<span class="badge ${dataStatus}">${escHtml(badge)}</span>` +
    `<span class="chev">▶</span>` +
    `</summary>`;

  let bodyHtml = '<div class="abody">';
  for (const { label, content } of fields) {
    const contentHtml = content.trim()
      ? postProcessInline(marked.parse(content))
      : '';
    // Wrap first <p> with hasfld
    const firstP = contentHtml.indexOf('<p>');
    const wrappedContent = firstP !== -1
      ? contentHtml.slice(0, firstP) +
        contentHtml.slice(firstP).replace('<p>', '<p class="hasfld">', )
      : contentHtml;
    bodyHtml += `<span class="fld">${escHtml(label)}</span>${wrappedContent}`;
  }
  bodyHtml += '</div>';

  return (
    `<details class="audit" data-status="${dataStatus}" id="${id}">` +
    summaryHtml +
    bodyHtml +
    `</details>`
  );
}

function escHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── AUDIT block parser ────────────────────────────────────────────────────────

const FIELD_LABELS = [
  'AS RECORDED',
  'STATUS',
  'AUDIT',
  'CORRECTED',
  'WHY IT LOOKED RIGHT',
  'READING AND CONVERSATION NOTE',
  'Reading and conversation note',
  'Sources and fuller audit',
];

// Pattern matching: **LABEL:** content or **LABEL** alone
const FIELD_LABEL_RE = new RegExp(
  `^\\*\\*(${FIELD_LABELS.map(l => l.replace(/[()]/g, '\\$&')).join('|')})[:\\s*]*\\**(.*)$`,
  'i'
);

function parseAuditBlock(lines) {
  const isAddendum = /^####\s*⚑\s*AUDIT\s+ADDENDUM\s*—/.test(lines[0]);
  const rawTitle = lines[0].replace(/^####\s*⚑\s*AUDIT(?:\s+ADDENDUM)?\s*—\s*/, '').trim();
  const title = isAddendum ? `Addendum — ${rawTitle}` : rawTitle;
  const id = 'a-' + slugify(isAddendum ? 'addendum-' + rawTitle : rawTitle);

  let stamp = '';
  let badge = '';
  let dataStatus = '';
  const fields = [];

  // Extract stamp from backtick line
  const stampLine = lines.find(l => /^`CHECKED\s+/i.test(l.trim()));
  if (stampLine) stamp = stampLine.trim().replace(/^`|`$/g, '');

  // Collect content lines (after the title line)
  const contentLines = lines.slice(1).filter(l => !(/^`CHECKED/i.test(l.trim())));

  // Split into field sections
  let currentLabel = null;
  let currentLines = [];

  function flushField() {
    if (currentLabel === null) return;
    let content = currentLines.join('\n').trim();

    if (currentLabel.toUpperCase() === 'STATUS') {
      // Extract badge from STATUS content (strip leading/trailing **)
      const statusText = content
        .replace(/^\*+/, '')
        .replace(/\*+$/, '')
        .replace(/^STATUS:\s*/i, '');
      const parsed = parseStatusBadge(statusText);
      badge = parsed.badge;
      dataStatus = parsed.dataStatus;
      // If there's a " — explanation" suffix after the badge phrase, show only that as body
      const dashIdx = statusText.indexOf(' — ');
      content = dashIdx !== -1 ? statusText.slice(dashIdx + 3) : statusText;
    }

    fields.push({ label: currentLabel.toUpperCase(), content });
    currentLabel = null;
    currentLines = [];
  }

  for (const line of contentLines) {
    // Check for a field label
    const m = line.match(FIELD_LABEL_RE);
    if (m) {
      flushField();
      // Normalize label to uppercase for display
      currentLabel = m[1].toUpperCase();
      // Handle "WHY IT LOOKED RIGHT ⟨INFERENCE⟩**:" which has marker inline
      // The rest after the label
      const afterLabel = line
        .replace(/^\*\*/, '')
        .replace(/\*\*$/, '')
        .replace(new RegExp(`^${m[1]}[:\\s*]*\\**`), '')
        .trim();
      if (afterLabel) currentLines.push(afterLabel);
    } else {
      currentLines.push(line);
    }
  }
  flushField();

  // Default badge/status if not found
  if (!badge) {
    badge = isAddendum ? 'Overstated' : 'Unchecked';
    dataStatus = isAddendum ? 'overstated' : 'new';
  }

  return { title, id, stamp, badge, dataStatus, fields };
}

// ── Markdown document parser ──────────────────────────────────────────────────

function parseDocument(src, doc) {
  const lines = src.split('\n');
  const toc = [];
  const sections = [];

  let i = 0;
  let pendingLines = [];
  let currentSection = null;  // { id, content[] }
  let skipDocTitle = !doc.chapterMarkers; // first # heading = page title, skip

  function flushProse() {
    if (!pendingLines.length) return;
    const md = pendingLines.join('\n').trim();
    if (md) {
      if (currentSection) {
        currentSection.content.push({ type: 'prose', md });
      } else {
        sections.push({ type: 'prose', md });
      }
    }
    pendingLines = [];
  }

  function openSection(secData) {
    if (currentSection) sections.push(currentSection);
    currentSection = { type: 'section', ...secData, content: [] };
  }

  while (i < lines.length) {
    const line = lines[i];

    // ── AUDIT block ──────────────────────────────────────────────────────────
    if (/^####\s*⚑\s*AUDIT(?:\s+ADDENDUM)?\s*—/.test(line)) {
      flushProse();
      const auditLines = [line];
      i++;
      while (i < lines.length) {
        const al = lines[i];
        // End at `---`, next non-audit heading, or start of another audit block
        if (/^---+\s*$/.test(al)) { i++; break; }
        if (/^####\s*⚑\s*AUDIT(?:\s+ADDENDUM)?\s*—/.test(al) && al !== auditLines[0]) break;
        if (/^#{1,4}\s/.test(al)) break;
        auditLines.push(al);
        i++;
      }
      const audit = parseAuditBlock(auditLines);
      toc.push({
        lvl: 'lvl4',
        text: audit.title,
        href: '#' + audit.id,
        stClass: 'st-' + audit.dataStatus,
      });
      const node = { type: 'audit', audit };
      if (currentSection) currentSection.content.push(node);
      else sections.push(node);
      continue;
    }

    // ── h1 (# Title) ─────────────────────────────────────────────────────────
    if (/^#\s/.test(line) && !/^#{2,}/.test(line)) {
      flushProse();
      const text = line.replace(/^#\s+/, '').trim();

      if (doc.chapterMarkers) {
        // Field Guide chapter markers → h1, not in TOC
        const chapterNum = text.match(/^([\d]+(?:\.[\d]+)*)\.\s+/)?.[1];
        const chapterId = chapterNum
          ? numToId(chapterNum)
          : slugify(text.replace(/^\d+\.\s+/, ''));
        if (currentSection) sections.push(currentSection);
        currentSection = null;
        sections.push({ type: 'chapter', text, id: chapterId });
      } else if (skipDocTitle) {
        // First # = document title — skip (masthead handles it)
        skipDocTitle = false;
      }
      i++;
      continue;
    }

    // ── h2 (## N. Title or ## N.M Title or ## Title) ─────────────────────────
    if (/^##\s/.test(line) && !/^#{3,}/.test(line)) {
      flushProse();
      const text = line.replace(/^##\s+/, '').trim();

      // Try to extract section number prefix: "N." or "N.M" or "N.M.P"
      const numMatch = text.match(/^([\d]+(?:\.[\d]+[a-z]?)*)\.?\s+(.+)/);
      if (numMatch) {
        const [, num, rest] = numMatch;
        const hid = numToId(num);
        const sid = secId(num);
        toc.push({ lvl: 'lvl2', num, text: rest, href: '#' + hid });
        // Determine if this is a sub-section of another (e.g. "9.5" under "9")
        const depth = num.split('.').length;
        const htmlTag = depth === 1 ? 'h2' : 'h2'; // always h2 for `##`
        openSection({ id: sid, hid, num, text: rest, tag: htmlTag });
      } else {
        // No number — text slug, TOC entry without num span
        const hid = doc.alphaSections && /^[A-Z]$/.test(text)
          ? `s${text}`
          : slugify(text);
        toc.push({ lvl: 'lvl2', text, href: '#' + hid });
        openSection({ id: 'sec-' + hid, hid, text, tag: 'h2' });
      }
      i++;
      continue;
    }

    // ── h3 (### N.M.P Title) ─────────────────────────────────────────────────
    if (/^###\s/.test(line) && !/^#{4,}/.test(line)) {
      flushProse();
      const text = line.replace(/^###\s+/, '').trim();

      // Special: ### N.Na ⚑ CORRECTION — title
      const corrMatch = text.match(/^([\d]+(?:\.[\d]+[a-z]?)*)\.?\s+⚑\s*CORRECTION\s*—\s*(.+)/);
      if (corrMatch) {
        const [, num, rest] = corrMatch;
        const hid = slugify(num + '-correction-' + rest);
        toc.push({ lvl: 'lvl3', num, text: `${num} ⚑ CORRECTION — ${rest}`, href: '#' + hid });
        const node = { type: 'h3corr', hid, num, text: `${num} ⚑ CORRECTION — ${rest}` };
        if (currentSection) currentSection.content.push(node);
        else sections.push(node);
        i++;
        continue;
      }

      const numMatch = text.match(/^([\d]+(?:\.[\d]+(?:\.[\d]+)?)[a-z]?)\.?\s+(.+)/);
      if (numMatch) {
        const [, num, rest] = numMatch;
        const hid = numToId(num);
        const depth = num.split('.').length;
        const tocLvl = depth >= 3 ? 'lvl4' : 'lvl3';
        toc.push({ lvl: tocLvl, num, text: rest, href: '#' + hid });
        const node = { type: 'h3', hid, num, text: rest };
        if (currentSection) currentSection.content.push(node);
        else sections.push(node);
      } else {
        // Unnumbered h3 — no TOC entry, just render as h3
        const hid = slugify(text);
        const node = { type: 'h3plain', hid, text };
        if (currentSection) currentSection.content.push(node);
        else sections.push(node);
      }
      i++;
      continue;
    }

    // ── h4 (#### that isn't an AUDIT) ────────────────────────────────────────
    if (/^####\s/.test(line)) {
      flushProse();
      const text = line.replace(/^####\s+/, '').trim();
      const hid = slugify(text);
      const node = { type: 'h4', hid, text };
      if (currentSection) currentSection.content.push(node);
      else sections.push(node);
      i++;
      continue;
    }

    // ── Normal line ──────────────────────────────────────────────────────────
    pendingLines.push(line);
    i++;
  }

  flushProse();
  if (currentSection) sections.push(currentSection);

  return { toc, sections };
}

// ── Render sections to HTML ───────────────────────────────────────────────────

function renderNode(node) {
  switch (node.type) {
    case 'prose':
      return postProcessInline(marked.parse(node.md));

    case 'audit':
      return buildAuditHtml(node.audit);

    case 'h3': {
      const numSpan = `<span class="num">§${node.num}</span>`;
      return `<h3 data-num="${node.num}" id="${node.hid}">${numSpan}${escHtml(node.text)}</h3>`;
    }

    case 'h3plain':
      return `<h3 id="${node.hid}">${escHtml(node.text)}</h3>`;

    case 'h3corr':
      return `<h3 id="${node.hid}">${escHtml(node.text)}</h3>`;

    case 'h4':
      return `<h4 id="${node.hid}">${escHtml(node.text)}</h4>`;

    default:
      return '';
  }
}

// Render a section's content nodes, injecting related blocks after h3 subsections.
function renderContent(nodes, relatedMap) {
  const H3_TYPES = new Set(['h3', 'h3plain', 'h3corr']);
  let html = '';
  let i = 0;
  while (i < nodes.length) {
    const node = nodes[i];
    if (H3_TYPES.has(node.type)) {
      // Render this h3 heading, then collect all its following prose/audit nodes
      // until the next h3 or end of array, then append any related block.
      html += renderNode(node);
      let sub = '';
      i++;
      while (i < nodes.length && !H3_TYPES.has(nodes[i].type)) {
        sub += renderNode(nodes[i]);
        i++;
      }
      const related = relatedMap && relatedMap[node.hid]
        ? buildRelatedHtml(relatedMap[node.hid])
        : '';
      html += sub + related;
    } else {
      html += renderNode(node);
      i++;
    }
  }
  return html;
}

function renderSections(sections, relatedMap) {
  let html = '';
  for (const sec of sections) {
    if (sec.type === 'chapter') {
      // Field Guide chapter markers → standalone h1
      html += `<h1 id="${sec.id}">${escHtml(sec.text)}</h1>\n`;
    } else if (sec.type === 'section') {
      const numSpan = sec.num
        ? `<span class="num">§${sec.num}</span>`
        : '';
      const heading = `<${sec.tag} data-num="${sec.num || ''}" id="${sec.hid}">${numSpan}${escHtml(sec.text)}</${sec.tag}>`;
      const inner = renderContent(sec.content, relatedMap);
      const related = relatedMap && relatedMap[sec.hid]
        ? buildRelatedHtml(relatedMap[sec.hid])
        : '';
      html += `</section><section id="${sec.id}">${heading}${inner}${related}\n`;
    } else if (sec.type === 'prose') {
      html += postProcessInline(marked.parse(sec.md));
    } else if (sec.type === 'audit') {
      html += buildAuditHtml(sec.audit);
    } else {
      html += renderNode(sec);
    }
  }
  return html;
}

// ── TOC HTML ─────────────────────────────────────────────────────────────────

function buildTocHtml(toc) {
  return toc.map(entry => {
    if (entry.lvl === 'lvl4' && entry.stClass) {
      return `<a class="lvl4 ${entry.stClass}" href="${entry.href}">${escHtml(entry.text)}</a>`;
    }
    if (entry.num) {
      const numSpan = `<span style="opacity:.5;font-family:var(--f-mono);font-size:.75em">${entry.num}</span>`;
      return `<a class="${entry.lvl}" href="${entry.href}">${numSpan} ${escHtml(entry.text)}</a>`;
    }
    return `<a class="${entry.lvl}" href="${entry.href}">${escHtml(entry.text)}</a>`;
  }).join('\n');
}

function buildSitebar() {
  return `<header class="rk-sitebar">
  <div class="rk-sitebar-inner">
    <a class="rk-brand" href="index.html">Religion Knowledge<small>Research library</small></a>
    <nav class="rk-global-nav" aria-label="Site navigation">
      <a href="index.html">Library</a>
      <a href="search.html">Search</a>
      <a href="religion-law.html">Religion &amp; Law</a>
      <a href="app/">App</a>
    </nav>
  </div>
</header>`;
}

// ── Docswitch HTML ────────────────────────────────────────────────────────────

function buildDocswitch(currentHref) {
  const docLinks = DOCSWITCH.filter(({ href }) => href !== 'search.html').map(({ label, href }) => {
    const on = href === currentHref;
    return `<a${on ? ' class="on" href="#"' : ` href="${href}"`}>${label}</a>`;
  }).join('');
  const caret = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
  return `<details class="library"><summary><span>Library</span>${caret}</summary>` +
    `<div class="docswitch">${docLinks}</div></details>`;
}

// ── Toolbar HTML ──────────────────────────────────────────────────────────────

function buildToolbar(hasAudits) {
  if (hasAudits) {
    return `<div id="tools"><button class="tbtn" id="toggleAudits">Expand all audits</button><button class="tbtn filt" data-st="collapses">⚑ Collapses</button><button class="tbtn filt" data-st="overstated">⚑ Overstated</button><button class="tbtn filt" data-st="holds">⚑ Holds</button><button class="tbtn" id="themebtn" aria-label="Toggle dark mode">Theme</button><span id="here"></span></div>`;
  }
  return `<div id="tools"><button class="tbtn" id="themebtn" aria-label="Toggle dark mode">Theme</button><span id="here"></span></div>`;
}

// ── Full CSS (shared across all readers) ─────────────────────────────────────

const CSS = `
:root{
  --ground:#EDEFEC; --paper:#FFFFFF; --ink:#17201D; --ink2:#4A5551; --ink3:#5F6A66;
  --rule:#D3D8D4; --accent:#1F5E5B; --accent-soft:#E3EDEC;
  --holds:#2D6A4F; --overstated:#A8681B; --collapses:#8E2B2B; --new:#1F5E5B;
  --camp:#57478C; --camp-soft:#EEEAF6;
  --rail:320px; --measure:70ch;
  --f-display:"Newsreader",Georgia,serif;
  --f-body:"IBM Plex Sans",system-ui,sans-serif;
  --f-mono:"IBM Plex Mono",ui-monospace,monospace;
}
*{box-sizing:border-box}
html{overflow-x:clip}html{scroll-behavior:smooth;scroll-padding-top:5rem}
@media (prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation:none!important;transition:none!important}}
body{margin:0;overflow-x:clip;background:var(--ground);color:var(--ink);font-family:var(--f-body);
  font-size:16.5px;line-height:1.62;-webkit-font-smoothing:antialiased}

/* ---------- rail ---------- */
#rail{position:fixed;inset:0 auto 0 0;width:var(--rail);background:var(--ink);
  color:#C9D2CE;display:flex;flex-direction:column;z-index:40}
#rail header{padding:1.35rem 1.4rem 1rem;border-bottom:1px solid #2C3833}
#rail .doctitle{font-family:var(--f-display);font-size:1.16rem;line-height:1.2;
  color:#F2F5F3;font-weight:500;letter-spacing:-.01em;margin:0 0 .3rem}
#rail .docsub{font-family:var(--f-mono);font-size:.63rem;letter-spacing:.13em;
  text-transform:uppercase;color:#7F8D88}
.docswitch{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.85rem}
.docswitch a{flex:1;text-align:center;font-family:var(--f-mono);font-size:.63rem;
  letter-spacing:.07em;text-transform:uppercase;padding:.45rem .3rem;border-radius:3px;
  text-decoration:none;color:#8E9C97;border:1px solid #2C3833;transition:.15s}
.docswitch a:hover{color:#E6EDEA;border-color:#3E4C46}
.docswitch a.on{background:var(--accent);color:#fff;border-color:var(--accent)}

/* ---------- library dropdown ---------- */
.quicknav{display:flex;gap:.4rem;margin-top:.85rem}
.quicknav a{flex:1;text-align:center;font-family:var(--f-mono);font-size:.63rem;
  letter-spacing:.07em;text-transform:uppercase;padding:.45rem .3rem;border-radius:3px;
  text-decoration:none;color:#8E9C97;border:1px solid #2C3833;transition:.15s}
.quicknav a:hover{color:#E6EDEA;border-color:#3E4C46}
.library{margin-top:.5rem}
.library summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:.5rem;
  justify-content:space-between;font-family:var(--f-mono);font-size:.63rem;letter-spacing:.07em;
  text-transform:uppercase;color:#8E9C97;border:1px solid #2C3833;border-radius:3px;
  padding:.48rem .6rem;transition:.15s}
.library summary::-webkit-details-marker{display:none}
.library summary:hover{color:#E6EDEA;border-color:#3E4C46}
.library summary svg{flex:none;transition:transform .18s}
.library[open] summary svg{transform:rotate(180deg)}
.library .docswitch{flex-direction:column;gap:.3rem;margin-top:.5rem}
.library .docswitch a{text-align:left;flex:none}

#search{margin:.9rem 1.4rem;padding:.55rem .7rem;border-radius:4px;border:1px solid #2C3833;
  background:#0F1614;color:#E6EDEA;font-family:var(--f-body);font-size:.85rem;width:calc(100% - 2.8rem)}
#search::placeholder{color:#5E6C67}
#search:focus{outline:2px solid var(--accent);outline-offset:1px;border-color:transparent}
#toc{flex:1;overflow-y:auto;overscroll-behavior-y:contain;scrollbar-gutter:stable;padding:0 .7rem 2rem}
#toc a{display:block;text-decoration:none;color:#A8B4B0;padding:.32rem .7rem;
  border-radius:3px;font-size:.845rem;line-height:1.35;border-left:2px solid transparent}
#toc a:hover{color:#F2F5F3;background:#212C28}
#toc a.lvl2{font-weight:600;color:#D6DEDA;margin-top:.55rem;font-size:.875rem}
#toc a.lvl3{padding-left:1.4rem;font-size:.8rem}
#toc a.lvl4{padding-left:1.4rem;font-family:var(--f-mono);font-size:.7rem;letter-spacing:.02em;
  color:#8E9C97;display:flex;align-items:center;gap:.4rem}
#toc a.lvl4::before{content:"⚑";font-size:.75rem}
#toc a.here{background:#26332E;color:#fff;border-left-color:var(--accent)}
#toc a.lvl4.st-overstated::before{color:var(--overstated)}
#toc a.lvl4.st-collapses::before{color:#C05252}
#toc a.lvl4.st-holds::before{color:#4E9970}
#toc a.lvl4.st-new::before{color:#5FA9A5}
#toc a.dim{display:none}

/* ---------- main ---------- */
main{margin-left:var(--rail);padding:0 3.5rem 8rem;max-width:calc(var(--measure) + 12rem)}
#progress{position:fixed;top:0;left:var(--rail);right:0;height:2px;background:transparent;z-index:50}
#progress i{display:block;height:100%;background:var(--accent);width:0}

.reader-context{
  display:flex;align-items:center;gap:.45rem;max-width:var(--measure);min-width:0;
  margin:0 0 1.25rem;color:var(--ink3);font-family:var(--f-mono);
  font-size:.67rem;line-height:1.4;letter-spacing:.035em
}
.reader-context a{color:var(--accent);text-decoration:none;font-weight:500}
.reader-context a:hover{text-decoration:underline;text-underline-offset:3px}
.reader-context .sep{opacity:.45;flex:none}
#reader-current{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}

.masthead{padding:4rem 0 2.2rem;border-bottom:1px solid var(--rule);margin-bottom:2.5rem}
.masthead h1{font-family:var(--f-display);font-size:clamp(2.1rem,4.2vw,3.05rem);
  font-weight:400;letter-spacing:-.025em;line-height:1.06;margin:0 0 .8rem}
.masthead .lens{font-family:var(--f-mono);font-size:.7rem;letter-spacing:.16em;
  text-transform:uppercase;color:var(--accent);margin-bottom:1.4rem}
.meta{display:flex;flex-wrap:wrap;gap:.5rem 1.6rem;font-size:.82rem;color:var(--ink2)}
.meta b{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.1em;
  text-transform:uppercase;color:var(--ink3);font-weight:500;margin-right:.35rem}

.howto{background:var(--paper);border:1px solid var(--rule);border-left:3px solid var(--accent);
  border-radius:0 5px 5px 0;padding:1.3rem 1.5rem;margin:0 0 3rem;max-width:var(--measure)}
.howto p{margin:0 0 .75rem;font-size:.925rem;color:var(--ink2)}
.howto p:last-child{margin-bottom:0}
.howto strong{color:var(--ink)}

section{max-width:var(--measure);margin-bottom:3.4rem;scroll-margin-top:4.5rem}
section.dim{display:none}
h2{font-family:var(--f-display);font-size:1.92rem;font-weight:500;letter-spacing:-.02em;
  line-height:1.14;margin:3.6rem 0 1.3rem;padding-top:1.6rem;border-top:1px solid var(--rule);
  max-width:var(--measure);scroll-margin-top:4.5rem;display:flex;gap:.7rem;align-items:baseline}
h2 .num{font-family:var(--f-mono);font-size:.78rem;color:var(--accent);letter-spacing:.06em;
  font-weight:500;flex:none;padding-top:.42rem}
h3{font-family:var(--f-display);font-size:1.24rem;font-weight:600;letter-spacing:-.008em;
  margin:2.3rem 0 .7rem;scroll-margin-top:4.5rem;display:flex;gap:.6rem;align-items:baseline}
h3 .num{font-family:var(--f-mono);font-size:.7rem;color:var(--ink3);flex:none;padding-top:.2rem}
p{margin:0 0 1.05rem;max-width:var(--measure)}
ul,ol{max-width:var(--measure);padding-left:1.2rem;margin:0 0 1.15rem}
li{margin-bottom:.45rem}
strong{font-weight:600}
hr{display:none}
a{color:var(--accent);text-underline-offset:2px}

/* ---------- audit apparatus ---------- */
.audit{position:relative;background:var(--paper);border:1px solid var(--rule);
  border-radius:5px;margin:1.5rem 0 2.4rem;overflow:hidden;max-width:var(--measure)}
.audit::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ink3)}
.audit[data-status=overstated]::before{background:var(--overstated)}
.audit[data-status=collapses]::before{background:var(--collapses)}
.audit[data-status=holds]::before{background:var(--holds)}
.audit[data-status=new]::before{background:var(--new)}
.audit > summary{list-style:none;cursor:pointer;padding:1rem 1.3rem 1rem 1.5rem;
  display:flex;gap:.75rem;align-items:flex-start;flex-wrap:wrap;transition:background .15s}
.audit > summary::-webkit-details-marker{display:none}
.audit > summary:hover{background:#F6F8F7}
.audit > summary:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}
.siglum{font-size:.95rem;line-height:1.4;flex:none;color:var(--ink3)}
.audit[data-status=overstated] .siglum{color:var(--overstated)}
.audit[data-status=collapses] .siglum{color:var(--collapses)}
.audit[data-status=holds] .siglum{color:var(--holds)}
.audit[data-status=new] .siglum{color:var(--new)}
.audit .atitle{flex:1;min-width:14rem;font-family:var(--f-display);font-size:1.02rem;
  font-weight:600;line-height:1.3}
.badge{font-family:var(--f-mono);font-size:.6rem;letter-spacing:.11em;text-transform:uppercase;
  padding:.28rem .55rem;border-radius:99px;flex:none;font-weight:500;white-space:nowrap;
  background:#EDEFEC;color:var(--ink2)}
.badge.overstated{background:#FBF0DE;color:#7E4E11}
.badge.collapses{background:#F9E6E6;color:#7A2222}
.badge.holds{background:#E3F1E9;color:#1F4C38}
.badge.new{background:var(--accent-soft);color:#134745}
.stamp{font-family:var(--f-mono);font-size:.58rem;letter-spacing:.09em;color:var(--ink3);
  flex:none;padding:.32rem .45rem;border:1px solid var(--rule);border-radius:3px;white-space:nowrap}
.chev{flex:none;color:var(--ink3);font-size:.75rem;transition:transform .18s;margin-top:.28rem}
.audit[open] .chev{transform:rotate(90deg)}
.abody{padding:.2rem 1.5rem 1.35rem;border-top:1px solid var(--rule);margin-top:0}
.abody > p:first-child{margin-top:1.1rem}
.abody p{font-size:.925rem;margin-bottom:.9rem}
.abody ul{font-size:.925rem}
.abody em{color:var(--ink2)}

/* field labels inside audits */
.fld{display:block;font-family:var(--f-mono);font-size:.63rem;letter-spacing:.13em;
  text-transform:uppercase;color:var(--ink3);margin:1.4rem 0 .3rem}
.abody > p.hasfld{margin-top:0}

/* camp tags */
.mark{font-family:var(--f-mono);font-size:.6rem;letter-spacing:.07em;padding:.12rem .4rem;
  border-radius:3px;white-space:normal;font-weight:500;font-style:normal;vertical-align:baseline}
.mark.inf{background:#F6EBD6;color:#7A5510;border:1px solid #E4CFA6}
.mark.doc{background:#E3F1E9;color:#1F4C38;border:1px solid #C2DFD1}
.mark.unresolved{background:#FDF4E7;color:#7A5510;border:1px solid #E4CFA6}
.mark.you{background:#E5E9F6;color:#2E3E73;border:1px solid #C6CEE8}
.camp{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.05em;background:var(--camp-soft);
  color:var(--camp);padding:.1rem .38rem;border-radius:3px;white-space:nowrap}

/* cross-reference links */
.xref{font-family:var(--f-mono);font-size:.86em;color:var(--accent);text-decoration:none;
  border-bottom:1px dotted currentColor;padding:0 .05em}
.xref:hover{background:var(--accent-soft)}
.gloss{border-bottom:1px dashed #B79A4E;cursor:help;position:relative}
.gloss:hover,.gloss:focus{background:#FBF3D9;outline:none}
.gloss .tip{position:absolute;left:0;top:calc(100% + 7px);width:min(21rem,78vw);
  background:var(--ink);color:#E9EFEC;padding:.65rem .8rem;border-radius:5px;font-size:.8rem;
  line-height:1.45;font-weight:400;font-style:normal;z-index:70;opacity:0;pointer-events:none;
  transition:opacity .13s;box-shadow:0 6px 22px rgba(0,0,0,.24)}
.gloss .tip b{display:block;font-family:var(--f-mono);font-size:.62rem;letter-spacing:.1em;
  text-transform:uppercase;color:#8FBFBC;margin-bottom:.25rem}
.gloss:hover .tip,.gloss:focus .tip{opacity:1}
.gloss.flip .tip{left:auto;right:0}
a.ext{color:var(--accent);font-weight:500;text-decoration:none;border-bottom:1px solid #A8CFCC;padding-bottom:1px}
a.ext:hover{border-bottom-color:var(--accent);background:var(--accent-soft)}
a.ext::after{content:"↗";font-size:.72em;margin-left:.18em;vertical-align:super;opacity:.65}
:target > .flashwrap,.flash{animation:flash 1.5s ease-out}
@keyframes flash{0%,22%{background:#FBF0C9}100%{background:transparent}}

/* related links */
.related{margin:1.1rem 0 0;padding:.75rem 1rem;background:var(--accent-soft);
  border-radius:4px;font-size:.83rem;max-width:var(--measure)}
.related b{font-family:var(--f-mono);font-size:.6rem;letter-spacing:.12em;text-transform:uppercase;
  color:#134745;display:block;margin-bottom:.35rem}
.related a{display:inline-block;margin:0 .9rem .3rem 0;overflow-wrap:anywhere}

/* toolbar */
#tools{position:sticky;top:0;background:rgba(237,239,236,.93);backdrop-filter:blur(8px);
  padding:.7rem 0;margin:0 0 0;z-index:30;display:flex;gap:.5rem;align-items:center;
  border-bottom:1px solid var(--rule);flex-wrap:wrap}
.tbtn{font-family:var(--f-mono);font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;
  padding:.42rem .7rem;border:1px solid var(--rule);background:var(--paper);color:var(--ink2);
  border-radius:3px;cursor:pointer;transition:.15s}
.tbtn:hover{border-color:var(--accent);color:var(--accent)}
.tbtn.on{background:var(--ink);color:#fff;border-color:var(--ink)}
#here{margin-left:auto;font-family:var(--f-mono);font-size:.66rem;color:var(--ink3);
  letter-spacing:.05em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:20rem}
#nores{display:none;padding:2rem 0;color:var(--ink3);font-size:.9rem}

table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch}table{border-collapse:collapse;width:100%;max-width:var(--measure);margin:0 0 1.6rem;font-size:.875rem}code,pre{overflow-wrap:anywhere;word-break:break-word}
th{text-align:left;font-family:var(--f-mono);font-size:.63rem;letter-spacing:.11em;text-transform:uppercase;
  color:var(--ink3);font-weight:500;padding:.5rem .7rem;border-bottom:1.5px solid var(--rule)}
td{padding:.55rem .7rem;border-bottom:1px solid var(--rule);vertical-align:top}
tr:hover td{background:#F6F8F7}
td:first-child{font-family:var(--f-mono);font-size:.8rem;white-space:nowrap;color:var(--accent)}
h2 span.flagmark{color:var(--collapses)}
#top{position:fixed;right:1.5rem;bottom:calc(1.5rem + env(safe-area-inset-bottom));display:grid;place-items:center;width:2.6rem;height:2.6rem;border-radius:50%;
  background:var(--ink);color:#fff;border:none;cursor:pointer;font-size:.9rem;opacity:0;
  transition:opacity .2s;z-index:45}
#top.show{opacity:.85}
#top:hover{opacity:1}

@media(max-width:1080px){
  :root{--rail:0px}
  #rail{transform:translateX(-100%);visibility:hidden;width:300px;transition:transform .22s,visibility .22s;inset:0 auto 0 0}
  #rail.open{transform:none;visibility:visible;box-shadow:0 0 40px rgba(0,0,0,.3)}
  main{padding:0 1.1rem 6rem;max-width:none}
  #menu{display:block!important}
  #progress{left:0}
  .masthead{padding-top:4.2rem}
  .camp{white-space:normal}
  .related a{white-space:normal}
  .audit .atitle{min-width:0}
  td:first-child{white-space:normal}
  #here{display:none}
  #tools{padding:.5rem 0 .5rem 2.6rem;gap:.4rem}
  .tbtn{font-size:.6rem;padding:.38rem .55rem}
}
#overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:39}
#overlay.show{display:block}
#menu{display:none;position:fixed;top:.85rem;left:.85rem;z-index:60;background:var(--ink);
  color:#fff;border:none;border-radius:4px;padding:.5rem .75rem;cursor:pointer;font-size:.9rem}
#menu svg{display:block}

/* ---------- dark mode ---------- */
@keyframes flashdark{0%,22%{background:#3A3414}100%{background:transparent}}
:root[data-theme=dark]{--ground:#10130F;--paper:#17201D;--ink:#F2F5F3;--ink2:#A8B4B0;--ink3:#8A9792;--rule:#2C3833;--accent:#6FBFB5;--accent-soft:#1B3330;--holds:#7FCB9E;--overstated:#E6B876;--collapses:#E8A3A3;--new:#6FBFB5;--camp:#B7ABE0;--camp-soft:#292344}
:root[data-theme=dark] #rail{background:#0F1614}
:root[data-theme=dark] .docswitch a.on{background:#1F5E5B;color:#fff;border-color:#1F5E5B}
:root[data-theme=dark] #menu{background:#26332E;color:#F2F5F3}
:root[data-theme=dark] #tools{background:rgba(16,19,15,.93)}
:root[data-theme=dark] .tbtn.on{background:#26332E;color:#F2F5F3;border-color:#3E4C46}
:root[data-theme=dark] #top{background:#26332E;color:#F2F5F3}
:root[data-theme=dark] .audit > summary:hover{background:#1C2622}
:root[data-theme=dark] tr:hover td{background:#1C2622}
:root[data-theme=dark] .badge{background:#26332E;color:var(--ink2)}
:root[data-theme=dark] .badge.overstated{background:#3A2E14;color:#E8C176}
:root[data-theme=dark] .badge.collapses{background:#3A1A1A;color:#E8A3A3}
:root[data-theme=dark] .badge.holds{background:#17332A;color:#8FD4AA}
:root[data-theme=dark] .badge.new{background:#1B3330;color:#8FD4CC}
:root[data-theme=dark] .mark.inf{background:#3A2E14;color:#E8C176;border-color:#5C4A22}
:root[data-theme=dark] .mark.doc{background:#17332A;color:#8FD4AA;border-color:#245240}
:root[data-theme=dark] .mark.unresolved{background:#3A2E14;color:#E8C176;border-color:#5C4A22}
:root[data-theme=dark] .mark.you{background:#232B4A;color:#B7C2EE;border-color:#33406E}
:root[data-theme=dark] .gloss{border-bottom-color:#8A7434}
:root[data-theme=dark] .gloss:hover{background:#332B10}
:root[data-theme=dark] .gloss:focus{background:#332B10}
:root[data-theme=dark] a.ext{border-bottom-color:#3E5C58}
:root[data-theme=dark] .related b{color:#8FD4CC}
:root[data-theme=dark] .flash{animation-name:flashdark}
:root[data-theme=dark] :target > .flashwrap{animation-name:flashdark}
/* ---------- reader visual refresh ---------- */
:root{
  --ground:#F5F1F0;--paper:#FFFDFC;--ink:#241B1E;--ink2:#62565A;--ink3:#807277;
  --rule:#DDD2D5;--accent:#8B3A4A;--accent-soft:#F4E7EA;--new:#8B3A4A;
  --rail-bg:#21181B;--rail-deep:#171013;--rail-rule:#3A2D32;
  --rail-text:#F7F1F3;--rail-muted:#B6A6AC;--rail-hover:#34242A;
  --toolbar-bg:rgba(245,241,240,.94);--rail:330px;--measure:72ch
}
body{line-height:1.68}
#rail{background:linear-gradient(180deg,var(--rail-bg) 0%,var(--rail-deep) 100%);border-right:1px solid var(--rail-rule);box-shadow:12px 0 36px rgba(55,28,37,.08)}
#rail header{padding:1.6rem 1.55rem 1.2rem;border-bottom-color:var(--rail-rule)}
#rail .doctitle{font-size:1.27rem;color:var(--rail-text)}
#rail .docsub{color:var(--rail-muted);margin-top:.45rem}
.docswitch,.quicknav{gap:.5rem}
.docswitch a,.quicknav a,.library summary{color:var(--rail-muted);border-color:var(--rail-rule);border-radius:8px;padding:.55rem}
.docswitch a:hover,.quicknav a:hover,.library summary:hover{color:var(--rail-text);border-color:#6B4A55;background:rgba(139,58,74,.10)}
.docswitch a.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.library{margin-top:.6rem}
#search{margin:1rem 1.4rem;padding:.68rem .8rem;border-radius:10px;border-color:var(--rail-rule);background:var(--rail-deep);color:var(--rail-text)}
#search::placeholder{color:#8E7F84}
#toc{padding:0 .85rem 2rem}
#toc a{padding:.42rem .75rem;border-radius:7px;color:#B9ACB0;line-height:1.4}
#toc a:hover{color:var(--rail-text);background:var(--rail-hover)}
#toc a.lvl2{color:#E7DDE0;margin-top:.62rem}
#toc a.lvl4{color:#A99A9F}
#toc a.here{background:rgba(139,58,74,.24);color:#fff;border-left-color:var(--accent)}
#toc a.lvl4.st-new::before{color:var(--accent)}
main{padding:0 4.25rem 8rem;max-width:calc(var(--measure) + 16rem)}
.masthead{padding:5rem 0 2.6rem;margin-bottom:2.9rem}
.masthead h1{font-size:clamp(2.35rem,4.7vw,3.45rem);line-height:1.02}
.masthead .lens{margin-bottom:1.55rem}
.meta{gap:.6rem 1.9rem}
#tools{background:var(--toolbar-bg);padding:.85rem 0;gap:.55rem;box-shadow:0 1px 0 var(--rule)}
.tbtn{padding:.5rem .78rem;border-radius:8px;background:var(--paper)}
.tbtn:hover{background:var(--accent-soft)}
.tbtn.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.howto,.audit{border-radius:12px;box-shadow:0 10px 28px rgba(57,34,42,.06)}
.howto{padding:1.45rem 1.6rem}
.audit::before{width:4px}
.audit>summary{padding:1.08rem 1.4rem 1.08rem 1.6rem}
.audit>summary:hover{background:var(--accent-soft)}
.badge{border-radius:999px}
.badge.new{background:var(--accent-soft);color:var(--accent)}
.related{border-radius:9px}
.related b{color:var(--accent)}
.gloss .tip b{color:#DCA1AE}
a.ext{border-bottom-color:#C9A1AA}
#top{background:var(--accent)}
h2{margin-top:4rem}
@media(max-width:1080px){main{padding:0 1.25rem 6rem}.masthead{padding-top:4.7rem}}
:root[data-theme=dark]{--ground:#120E10;--paper:#1C1518;--ink:#F7F2F3;--ink2:#C4B7BB;--ink3:#978A8F;--rule:#382B30;--accent:#D8899A;--accent-soft:#3A2028;--new:#D8899A;--rail-bg:#100C0E;--rail-deep:#0C090A;--rail-rule:#2B2024;--rail-text:#FAF5F6;--rail-muted:#A99BA0;--rail-hover:#251A1E;--toolbar-bg:rgba(18,14,16,.94)}
:root[data-theme=dark] #rail{background:linear-gradient(180deg,var(--rail-bg) 0%,var(--rail-deep) 100%)}
:root[data-theme=dark] .docswitch a.on{background:var(--accent);border-color:var(--accent)}
:root[data-theme=dark] #menu,:root[data-theme=dark] #top{background:var(--accent);color:#fff}
:root[data-theme=dark] #tools{background:var(--toolbar-bg)}
:root[data-theme=dark] .tbtn.on{background:var(--accent);color:#fff;border-color:var(--accent)}
:root[data-theme=dark] .audit>summary:hover{background:var(--accent-soft)}
:root[data-theme=dark] tr:hover td{background:#24191D}
:root[data-theme=dark] .badge{background:#2A2024;color:var(--ink2)}
:root[data-theme=dark] .badge.new{background:var(--accent-soft);color:#EAB0BD}
:root[data-theme=dark] .related b{color:#EAB0BD}
:root[data-theme=dark] a.ext{border-bottom-color:#70414D}
/* ---------- reader readability refinement ---------- */
:root{--measure:66ch}
body{font-size:17.25px;line-height:1.72}
main{padding-left:4.5rem;padding-right:3rem}
.masthead{padding-top:4.6rem}
.masthead h1{max-width:18ch}
.meta{font-size:.88rem;line-height:1.55}
.howto p{font-size:1rem;line-height:1.7;color:var(--ink2)}
section{margin-bottom:3.8rem}
p{margin-bottom:1.18rem}
ul,ol{margin-bottom:1.3rem;padding-left:1.35rem}
li{margin-bottom:.58rem}
h2{font-size:2.05rem;line-height:1.16;margin-top:4.25rem;margin-bottom:1.45rem}
h3{font-size:1.36rem;line-height:1.28;margin-top:2.55rem;margin-bottom:.82rem}
#search{font-size:.9rem;line-height:1.4}
#toc a{font-size:.9rem;line-height:1.42;padding-top:.38rem;padding-bottom:.38rem}
#toc a.lvl2{font-size:.94rem;line-height:1.38}
#toc a.lvl3{font-size:.86rem}
#toc a.lvl4{font-size:.75rem;line-height:1.42}
#rail .docsub{font-size:.67rem}
.tbtn{font-size:.68rem;line-height:1.25}
.audit .atitle{font-size:1.09rem;line-height:1.38}
.abody{padding: .35rem 1.6rem 1.5rem}
.abody p,.abody ul{font-size:1rem;line-height:1.68}
.fld{font-size:.66rem;margin-top:1.55rem}
.related{font-size:.9rem;line-height:1.55}
table{font-size:.92rem;line-height:1.55}
th{font-size:.66rem}
td{padding:.65rem .75rem}
:root[data-theme=dark]{--ink2:#D1C5C9;--ink3:#AA9CA1;--rule:#44343A}
@media(max-width:1080px){
  body{font-size:17px}
  main{padding-left:1.25rem;padding-right:1.25rem}
}
@media(max-width:640px){
  body{font-size:16.5px;line-height:1.7}
  .masthead h1{font-size:2.35rem}
  h2{font-size:1.82rem}
  h3{font-size:1.25rem}
}

/* ---------- reader interface refinement ---------- */
:root{--rail:312px}
#progress{height:3px}
#rail header{padding:1.4rem 1.35rem 1.05rem}
#rail .doctitle{font-size:1.2rem}
#rail .docsub{font-size:.65rem;letter-spacing:.11em}
.quicknav a,
.library summary{
  font-family:var(--f-body);
  font-size:.76rem;
  font-weight:600;
  letter-spacing:0;
  text-transform:none;
  padding:.58rem .68rem
}
.library .docswitch a{
  font-family:var(--f-body);
  font-size:.81rem;
  font-weight:500;
  letter-spacing:0;
  text-transform:none;
  padding:.58rem .7rem
}
#search{
  margin:.85rem 1.15rem 1rem;
  width:calc(100% - 2.3rem);
  padding:.72rem .82rem;
  font-size:.91rem;
  background:color-mix(in srgb,var(--rail-deep) 86%,var(--rail-hover))
}
#search:focus{
  outline:3px solid rgba(216,137,154,.2);
  outline-offset:0;
  border-color:#6B4A55
}
#toc{padding:0 .65rem 4.25rem}
#toc a{border-left:0;padding:.4rem .7rem}
#toc a.lvl2{
  margin-top:.8rem;
  padding-top:.52rem;
  padding-bottom:.46rem;
  font-weight:650
}
#toc a.lvl3{padding-left:1.15rem}
#toc a.lvl4{padding-left:1.15rem}
#toc a.here{
  background:rgba(139,58,74,.2);
  box-shadow:inset 3px 0 0 var(--accent);
  color:#fff
}
.masthead{
  padding-top:3.8rem;
  padding-bottom:2rem;
  margin-bottom:1.85rem
}
.masthead h1{
  font-size:clamp(2.25rem,4.3vw,3.15rem);
  letter-spacing:-.03em
}
.masthead .lens{
  margin-bottom:1.2rem;
  font-size:.68rem;
  letter-spacing:.12em
}
.meta{gap:.45rem 1.45rem}
.meta b{letter-spacing:.06em}
#tools{
  margin-bottom:1.35rem;
  padding:.62rem 0;
  border-bottom:0;
  box-shadow:none;
  gap:.45rem
}
.tbtn{
  flex:0 0 auto;
  font-family:var(--f-body);
  font-size:.76rem;
  font-weight:600;
  letter-spacing:0;
  text-transform:none;
  padding:.5rem .82rem;
  border-radius:999px;
  background:transparent
}
.tbtn:hover{
  background:var(--accent-soft);
  border-color:color-mix(in srgb,var(--accent) 58%,var(--rule));
  color:var(--accent)
}
.tbtn.on{box-shadow:0 5px 16px rgba(139,58,74,.16)}
#here{
  font-family:var(--f-body);
  font-size:.74rem;
  letter-spacing:0;
  color:var(--ink3);
  max-width:17rem
}
.howto{
  margin-bottom:2.5rem;
  border-left-width:4px;
  box-shadow:0 8px 22px rgba(57,34,42,.045)
}
.audit{
  box-shadow:0 7px 20px rgba(57,34,42,.04)
}
.audit>summary{align-items:center}
.badge,.stamp{letter-spacing:.07em}
#menu{
  border-radius:999px;
  padding:.62rem;
  box-shadow:0 8px 22px rgba(33,26,28,.18)
}
#top{
  width:2.75rem;
  height:2.75rem;
  box-shadow:0 8px 22px rgba(33,26,28,.18)
}
:root[data-theme=dark] #search{background:#171114}
@media(max-width:1080px){
  #rail{width:min(86vw,320px)}
  .masthead{padding-top:4rem;margin-bottom:1.4rem}
  #tools{
    flex-wrap:nowrap;
    overflow-x:auto;
    scrollbar-width:none;
    margin-left:-1.25rem;
    margin-right:-1.25rem;
    padding:.55rem 1.25rem .55rem 3.75rem;
    border-bottom:1px solid var(--rule)
  }
  #tools::-webkit-scrollbar{display:none}
  .tbtn{font-size:.74rem;padding:.48rem .75rem}
}
@media(max-width:640px){
  .masthead{padding-bottom:1.55rem}
  .masthead h1{font-size:2.2rem}
  .meta{gap:.4rem 1rem}
  .reader-context{font-size:.63rem;margin-bottom:1rem}
  .reader-context .reader-doc,.reader-context .reader-doc-sep{display:none}
}

/* ---------- focus reading mode ---------- */
.gloss .tip{
  background:#21181B;
  color:#F7F2F3;
  border:1px solid #4E3941;
  box-shadow:0 12px 32px rgba(33,26,28,.28)
}
.gloss .tip b{color:#EAB0BD}
a.ext{border-bottom-color:#C9A1AA}
html.focus-reading{--rail:0px}
html.focus-reading #rail{
  transform:translateX(-100%);
  visibility:hidden;
  box-shadow:none
}
html.focus-reading #progress{left:0}
html.focus-reading main{
  margin-left:0;
  max-width:none;
  padding-left:clamp(1.25rem,8vw,8rem);
  padding-right:clamp(1.25rem,8vw,8rem)
}
html.focus-reading main>.masthead,
html.focus-reading main>#tools,
html.focus-reading main>.howto,
html.focus-reading main>#nores,
html.focus-reading main>section{
  max-width:var(--measure);
  margin-left:auto;
  margin-right:auto
}
html.focus-reading #menu{display:none!important}
html.focus-reading #tools{width:100%}
html.focus-reading .masthead{width:100%}
@media(max-width:1080px){
  html.focus-reading main{
    padding-left:1.25rem;
    padding-right:1.25rem
  }
}

/* ---------- reader content hierarchy ---------- */
blockquote{
  max-width:var(--measure);
  margin:1.35rem 0 1.7rem;
  padding:1rem 1.2rem;
  border-left:4px solid color-mix(in srgb,var(--accent) 70%,var(--rule));
  border-radius:0 10px 10px 0;
  background:color-mix(in srgb,var(--paper) 88%,var(--accent-soft));
  color:var(--ink2)
}
blockquote p{margin-bottom:.78rem}
blockquote p:last-child{margin-bottom:0}
blockquote strong{color:var(--ink)}

.audit{
  transition:border-color .16s ease,box-shadow .16s ease,background .16s ease
}
.audit[open]{
  border-color:color-mix(in srgb,var(--accent) 28%,var(--rule));
  box-shadow:0 12px 30px rgba(57,34,42,.065)
}
.audit>summary{
  min-height:3.8rem;
  align-items:center;
  gap:.7rem
}
.audit[open]>summary{
  background:color-mix(in srgb,var(--paper) 72%,var(--accent-soft))
}
.siglum{
  display:grid;
  place-items:center;
  width:1.55rem;
  height:1.55rem;
  border-radius:999px;
  background:color-mix(in srgb,var(--paper) 72%,var(--rule));
  font-size:.82rem
}
.audit .atitle{
  font-size:1.08rem;
  line-height:1.34
}
.badge{
  font-size:.63rem;
  padding:.32rem .58rem;
  line-height:1.2
}
.stamp{
  font-size:.6rem;
  padding:.3rem .48rem;
  border-radius:999px
}
.chev{
  display:grid;
  place-items:center;
  width:1.55rem;
  height:1.55rem;
  border-radius:999px;
  background:color-mix(in srgb,var(--paper) 78%,var(--rule));
  margin-top:0
}
.abody{
  background:color-mix(in srgb,var(--paper) 94%,var(--ground));
  padding-top:.55rem
}
.abody>p:first-child{margin-top:1rem}
.fld{
  padding-top:.2rem;
  color:color-mix(in srgb,var(--ink3) 86%,var(--accent))
}

table{
  border-collapse:separate;
  border-spacing:0;
  border:1px solid var(--rule);
  border-radius:12px;
  background:var(--paper);
  box-shadow:0 7px 20px rgba(57,34,42,.035)
}
th{
  background:color-mix(in srgb,var(--paper) 72%,var(--accent-soft));
  padding:.7rem .8rem
}
td{padding:.72rem .8rem}
th+th,td+td{border-left:1px solid color-mix(in srgb,var(--rule) 74%,transparent)}
tbody tr:nth-child(even) td{
  background:color-mix(in srgb,var(--paper) 96%,var(--ground))
}
tbody tr:last-child td{border-bottom:0}
tr:hover td{
  background:color-mix(in srgb,var(--paper) 82%,var(--accent-soft))
}

pre{
  max-width:var(--measure);
  overflow:auto;
  margin:1.35rem 0 1.7rem;
  padding:1rem 1.1rem;
  border:1px solid var(--rule);
  border-radius:10px;
  background:color-mix(in srgb,var(--paper) 84%,var(--ground));
  font-family:var(--f-mono);
  font-size:.84rem;
  line-height:1.6
}
code{
  font-family:var(--f-mono);
  font-size:.88em
}
p code,li code,td code{
  padding:.08rem .28rem;
  border-radius:5px;
  background:color-mix(in srgb,var(--paper) 72%,var(--accent-soft))
}
figure{
  max-width:var(--measure);
  margin:1.7rem 0
}
img{
  max-width:100%;
  height:auto;
  border-radius:10px
}
figcaption{
  margin-top:.55rem;
  color:var(--ink3);
  font-size:.82rem;
  line-height:1.5
}
hr+*{margin-top:0}

:root[data-theme=dark] blockquote{
  background:color-mix(in srgb,var(--paper) 86%,var(--accent-soft))
}
:root[data-theme=dark] tbody tr:nth-child(even) td{
  background:color-mix(in srgb,var(--paper) 92%,var(--ground))
}
@media(max-width:640px){
  blockquote{padding:.9rem 1rem}
  .audit>summary{padding-left:1.25rem;padding-right:1rem}
  .stamp{display:none}
  th,td{padding:.62rem .68rem}
}
`.trim();

// ── JS (shared across all readers) ───────────────────────────────────────────

const JS = `
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* keep wheel/trackpad scrolling inside the navigation rail */
const rail=$('#rail'), railToc=$('#toc');
if(rail&&railToc) rail.addEventListener('wheel',e=>{
  if(e.ctrlKey||!e.deltaY)return;
  railToc.scrollTop+=e.deltaY;
  e.preventDefault();
},{passive:false});

/* progress */
addEventListener('scroll',()=>{
  const h=document.documentElement, p=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
  $('#progress i').style.width=p+'%';
  $('#top').classList.toggle('show',h.scrollTop>600);
},{passive:true});

/* scrollspy + current location */
const heads=$$('h2[id],h3[id]');
const currentLabel=$('#reader-current');
const setCurrentLocation=text=>{
  const label=(text||'Overview').trim();
  $('#here').textContent=label;
  if(currentLabel)currentLabel.textContent=label;
};
const spy=new IntersectionObserver(es=>{
  es.forEach(e=>{if(!e.isIntersecting)return;
    const id=e.target.id;
    $$('#toc a').forEach(a=>a.classList.toggle('here',a.getAttribute('href')==='#'+id));
    const l=$('#toc a.here'); if(l){setCurrentLocation(l.textContent);
      const r=l.getBoundingClientRect(),c=$('#toc').getBoundingClientRect();
      if(r.top<c.top||r.bottom>c.bottom)l.scrollIntoView({block:'center'});}
  });
},{rootMargin:'-70px 0px -72% 0px'});
heads.forEach(h=>spy.observe(h));

/* search */
const sec=$$('main section'), tocA=$$('#toc a');
$('#search').addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();
  if(!q){sec.forEach(s=>s.classList.remove('dim'));tocA.forEach(a=>a.classList.remove('dim'));
    $('#nores').style.display='none';return;}
  let hits=0;
  sec.forEach(s=>{const m=s.textContent.toLowerCase().includes(q);
    s.classList.toggle('dim',!m); if(m)hits++;});
  tocA.forEach(a=>{const t=$(a.getAttribute('href'));
    const s=t&&t.closest('section'); a.classList.toggle('dim',!(s&&!s.classList.contains('dim')));});
  $('#nores').style.display=hits?'none':'block';
});

/* audit toggles */
let openAll=false;
const ta=$('#toggleAudits'); if(ta) ta.addEventListener('click',e=>{
  openAll=!openAll; $$('.audit').forEach(d=>d.open=openAll);
  e.target.classList.toggle('on',openAll);
  e.target.textContent=openAll?'Collapse all audits':'Expand all audits';
});
/* status filter */
$$('.filt').forEach(b=>b.addEventListener('click',()=>{
  const on=b.classList.toggle('on');
  $$('.filt').forEach(o=>{if(o!==b)o.classList.remove('on')});
  const st=b.dataset.st;
  if(!on){sec.forEach(s=>s.classList.remove('dim'));return}
  sec.forEach(s=>s.classList.toggle('dim',!s.querySelector(\`.audit[data-status="\${st}"]\`)));
  $$('.audit').forEach(d=>d.open=d.dataset.status===st);
}));

/* xref flash + open target audit */
addEventListener('click',e=>{
  const a=e.target.closest('a[href^="#"]'); if(!a)return;
  const t=$(a.getAttribute('href')); if(!t)return;
  const d=t.closest('details'); if(d)d.open=true;
  const dd=t.matches('details')?t:null; if(dd)dd.open=true;
  t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
});
if(location.hash){
  const t=$(location.hash),d=t&&t.closest('details');if(d)d.open=true;
  const a=tocA.find(link=>link.getAttribute('href')===location.hash);if(a)setCurrentLocation(a.textContent);
}

$$('.gloss').forEach(g=>g.addEventListener('mouseenter',()=>{
  const t=g.querySelector('.tip'); g.classList.remove('flip');
  if(g.getBoundingClientRect().left+t.offsetWidth>innerWidth-20)g.classList.add('flip');
}));
$('#top').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
$('#menu').addEventListener('click',()=>{const o=$('#rail').classList.toggle('open');$('#overlay').classList.toggle('show',o)});

/* focus reading mode */
const toolsBar=$('#tools');
if(toolsBar){
  const focusBtn=document.createElement('button');
  focusBtn.type='button';
  focusBtn.className='tbtn';
  focusBtn.id='focusbtn';
  focusBtn.setAttribute('aria-pressed','false');
  const themeButton=$('#themebtn');
  if(themeButton)toolsBar.insertBefore(focusBtn,themeButton);
  else toolsBar.appendChild(focusBtn);

  const focusKey='religion-reader-focus';
  const setFocus=(on,persist=true)=>{
    document.documentElement.classList.toggle('focus-reading',on);
    focusBtn.classList.toggle('on',on);
    focusBtn.setAttribute('aria-pressed',String(on));
    focusBtn.textContent=on?'Exit focus':'Focus';
    if(persist){try{localStorage.setItem(focusKey,on?'1':'0')}catch(e){}}
  };
  let savedFocus=false;
  try{savedFocus=localStorage.getItem(focusKey)==='1'}catch(e){}
  setFocus(savedFocus,false);
  focusBtn.addEventListener('click',()=>setFocus(!document.documentElement.classList.contains('focus-reading')));
}

/* theme toggle (shared key with the app) */
const tb=$('#themebtn'); if(tb) tb.addEventListener('click',()=>{
  const r=document.documentElement;
  const cur=r.dataset.theme||'light';
  r.dataset.theme=cur==='dark'?'light':'dark';
  try{localStorage.setItem('religion-knowledge-theme',r.dataset.theme)}catch(e){}
});
$('#overlay').addEventListener('click',()=>{$('#rail').classList.remove('open');$('#overlay').classList.remove('show')});
$('#toc').addEventListener('click',e=>{if(e.target.tagName==='A'&&innerWidth<1080){$('#rail').classList.remove('open');$('#overlay').classList.remove('show')}});
addEventListener('keydown',e=>{
  if(e.key==='/'&&document.activeElement!==$('#search')){e.preventDefault();$('#search').focus()}
  if(e.key==='Escape'){$('#search').value='';$('#search').dispatchEvent(new Event('input'));$('#search').blur()}
});
`.trim();

// ── Page template ─────────────────────────────────────────────────────────────

function buildPage(doc, tocHtml, contentHtml) {
  const howtoBlock = doc.hasHowto
    ? `\n  <div class="howto">${doc.howto}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en" data-theme="light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${doc.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500;6..72,600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${CSS}
</style><link rel="stylesheet" href="site-shell.css"><script>try{var __v="religion-knowledge-theme-default-v2";if(!localStorage.getItem(__v)){localStorage.removeItem("religion-knowledge-theme");localStorage.setItem(__v,"1")}var __t=localStorage.getItem("religion-knowledge-theme");document.documentElement.dataset.theme=__t||"light"}catch(e){document.documentElement.dataset.theme="light"}</script></head><body class="rk-with-sitebar rk-reader-page">
${buildSitebar()}
<button id="menu" aria-label="Toggle navigation"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
<div id="overlay"></div>
<div id="progress"><i></i></div>
<nav id="rail" aria-label="Contents">
  <header>
    <p class="doctitle">${doc.doctitle}</p>
    <p class="docsub">${doc.docsub}</p>
    ${buildDocswitch(doc.html)}
  </header>
  <input id="search" type="search" placeholder="Search  ( / )" aria-label="Search document">
  <div id="toc">${tocHtml}</div>
</nav>
<main>
  <div class="masthead">
    <nav class="reader-context" aria-label="Breadcrumb"><a href="index.html">Library</a><span class="sep">›</span><span class="reader-doc">${doc.doctitle}</span><span class="sep reader-doc-sep">›</span><span id="reader-current">Overview</span></nav>
    <p class="lens">${doc.lens}</p>
    <h1>${doc.masthead}</h1>
    <div class="meta">${doc.meta}</div>
  </div>
  ${buildToolbar(doc.hasAudits)}${howtoBlock}
  <div id="nores">No section matches that search.</div>
  <section id="sec-intro">
${contentHtml}
</section>
</main>
<button id="top" aria-label="Back to top"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg></button>
<script>
${JS}
</script><script src="highlight-referral.js"></script><script src="correction-form.js"></script>
</body></html>
`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { output: 'dist/readers' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--output') {
      args.output = argv[i + 1];
      i++;
    }
  }
  return args;
}

const { output } = parseArgs(process.argv.slice(2));
fs.mkdirSync(output, { recursive: true });
const stablePersonIds = readStablePersonIds('cited-persons.html');

let built = 0;
for (const doc of DOCS) {
  if (!fs.existsSync(doc.md)) {
    console.warn(`SKIP: ${doc.md} not found`);
    continue;
  }
  let src = fs.readFileSync(doc.md, 'utf8');
  if (doc.stripPreamble) {
    src = src.replace(/^[\s\S]*?^---+\s*$/m, '').trimStart();
  }
  const { toc, sections } = parseDocument(src, doc);
  const tocHtml = buildTocHtml(toc);
  const relatedMap = RELATED_BY_DOC[doc.html] || null;
  let contentHtml = renderSections(sections, relatedMap);
  if (doc.personIndex) {
    contentHtml = addPersonAnchors(contentHtml, stablePersonIds);
  }
  const pageHtml = buildPage(doc, tocHtml, contentHtml);
  const outPath = path.join(output, doc.html);
  fs.writeFileSync(outPath, pageHtml, 'utf8');
  console.log(`  wrote ${outPath} (${toc.length} TOC entries)`);
  built++;
}

console.log(`\nBuild complete: ${built}/${DOCS.length} documents → ${output}/`);
