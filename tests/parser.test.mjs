import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMarkdown } from '../scripts/import/parse-markdown.mjs';

test('explicit YOURS marker maps to MY_WORDS', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# Topic\n\n⟨YOURS⟩ This is my observation.' });
  assert.equal(out.records[0].provenance_type, 'MY_WORDS');
  assert.equal(out.records[0].representation_type, 'VERBATIM');
  assert.equal(out.records[0].review_required, false);
});

test('explicit INFERENCE marker maps to Claude inference', () => {
  const out = parseMarkdown({ sourceFile: 'Historical_Framework.md', content: '# Topic\n\n⟨INFERENCE⟩ This reasoning is Claude\'s.' });
  assert.equal(out.records[0].provenance_type, 'CLAUDE');
  assert.equal(out.records[0].representation_type, 'INFERENCE');
  assert.equal(out.records[0].speaker, 'Claude');
});

test('explicit DOCUMENTED marker maps to SOURCE', () => {
  const out = parseMarkdown({ sourceFile: 'Sources_and_Primary_Texts.md', content: '# Topic\n\n⟨DOCUMENTED⟩ A named scholar made this claim.' });
  assert.equal(out.records[0].provenance_type, 'SOURCE');
  assert.equal(out.records[0].review_required, false);
});

test('provenance legend with multiple marker types fails closed', () => {
  const content = '# Topic\n\nWho is saying what: ⟨DOCUMENTED⟩ means source, ⟨INFERENCE⟩ means Claude reasoning, and ⟨YOURS⟩ means user observation.';
  const out = parseMarkdown({ sourceFile: 'The_Other_Side.md', content });
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
  assert.equal(out.records[0].review_required, true);
  assert.equal(out.records[0].attribution_evidence.method, 'multiple_explicit_markers');
});

test('multiline blockquote and nested list markers are cleaned on every line', () => {
  const content = `# Topic

> **Who is saying what.** Three markers:
>
> - **⟨DOCUMENTED⟩** — a named scholar.
> - **⟨INFERENCE⟩** — Claude's reasoning.
> - **⟨YOURS⟩** — the user's observation.
>
> **The rule:** keep the descriptions intact.`;
  const out = parseMarkdown({ sourceFile: 'The_Other_Side.md', content });
  const record = out.records[0];

  assert.equal(record.provenance_type, 'REVIEW_REQUIRED');
  assert.equal(record.attribution_evidence.method, 'multiple_explicit_markers');
  assert.doesNotMatch(record.text, /(?:^|\n)\s*>/);
  assert.doesNotMatch(record.text, /(?:^|\n)\s*[-*+]\s+/);
  assert.match(record.text, /Who is saying what\. Three markers:/);
  assert.match(record.text, /⟨DOCUMENTED⟩ — a named scholar\./);
  assert.match(record.text, /⟨INFERENCE⟩ — Claude's reasoning\./);
  assert.match(record.text, /⟨YOURS⟩ — the user's observation\./);
  assert.match(record.text, /The rule: keep the descriptions intact\./);
});

test('multiline unordered list markers are cleaned on every line', () => {
  const content = `# Topic

- First item
- Second item
  * Nested item`;
  const out = parseMarkdown({ sourceFile: 'Historical_Framework.md', content });

  assert.equal(out.records[0].text, 'First item\nSecond item\nNested item');
});

test('legacy Study Notes sections 0-9 are declared PRE_CONVENTION, not actionable', () => {
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 1. Big Framework\n\n### 1.1 Claim\n\nThis predates provenance convention.' });
  assert.equal(out.records[0].provenance_type, 'PRE_CONVENTION');
  assert.equal(out.records[0].review_required, false);
  assert.match(out.records[0].attribution_evidence.value, /mixed/i);
});

test('post-legacy Study Notes with no marker fails closed to REVIEW_REQUIRED, not silently MY_WORDS', () => {
  // Regression test: documentDefaultInfo() used to assume unmarked §10+ prose
  // was the user's own words (PROVEN, no review). That default document
  // provenance note promises everything past §9 is marked, so an unmarked
  // paragraph here is a broken promise, not evidence of authorship — it must
  // fail closed the same as any other unattributable claim.
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 10. Current Notes\n\nThis has no marker.' });
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
  assert.equal(out.records[0].review_required, true);
  assert.equal(out.records[0].attribution_confidence, 'UNKNOWN');
});

test('Observations section 7 defaults to user-authored fieldwork, confidence is a document default not proof', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 7. FIELDWORK\n\nObserved in live conversation.' });
  assert.equal(out.records[0].provenance_type, 'MY_WORDS');
  assert.equal(out.records[0].review_required, false);
  assert.equal(out.records[0].attribution_confidence, 'DOCUMENT_DEFAULT');
  assert.equal(out.records[0].attribution_evidence.method, 'document_provenance');
});

test('Observations §1-17 mixed sections are declared PRE_CONVENTION, not actionable', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 3. HISTORY\n\nOld mixed material.' });
  assert.equal(out.records[0].provenance_type, 'PRE_CONVENTION');
  assert.equal(out.records[0].review_required, false);
});

test('Observations content past §17 with no marker fails closed to REVIEW_REQUIRED, distinct from the declared PRE_CONVENTION span', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 20. SOMETHING NEW\n\nUnmarked paragraph.' });
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
  assert.equal(out.records[0].review_required, true);
});

test('Method and Reference document defaults to Claude compilation', () => {
  const out = parseMarkdown({ sourceFile: 'Method_and_Reference.md', content: '# 1. METHOD\n\nCompiled method.' });
  assert.equal(out.records[0].provenance_type, 'CLAUDE');
  assert.equal(out.records[0].representation_type, 'SUMMARY');
});

test('Observations section 8 no longer exists as a special case (moved to Method and Reference), falls into the general §1-17 PRE_CONVENTION rule', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 8. SOMETHING ELSE\n\nUnmarked paragraph.' });
  assert.equal(out.records[0].provenance_type, 'PRE_CONVENTION');
});

test('Claude-authored reference docs use explicit document provenance, confidence is a document default not proof', () => {
  for (const sourceFile of ['Glossary.md', 'Historical_Framework.md', 'Method_and_Reference.md', 'The_Other_Side.md', 'Translations.md']) {
    const out = parseMarkdown({ sourceFile, content: '# Topic\n\nUnmarked paragraph.' });
    assert.equal(out.records[0].provenance_type, 'CLAUDE', sourceFile);
    assert.equal(out.records[0].representation_type, 'SUMMARY', sourceFile);
    assert.equal(out.records[0].review_required, false, sourceFile);
    assert.equal(out.records[0].attribution_confidence, 'DOCUMENT_DEFAULT', sourceFile);
  }
});

test('Sources document What it says defaults to documented source', () => {
  const out = parseMarkdown({ sourceFile: 'Sources_and_Primary_Texts.md', content: '# Topic\n\n**What it says.** The inscription names Israel.' });
  assert.equal(out.records[0].provenance_type, 'SOURCE');
  assert.equal(out.records[0].representation_type, 'PARAPHRASE');
});

test('audit block preserves original-to-correction relationship', () => {
  const content = `#### ⚑ AUDIT — Example\n\n**AS RECORDED:** Old claim.\n\n**STATUS:** Overstated.\n\n**AUDIT**\n\nDocumented discussion.\n\n**CORRECTED:** Better claim.\n\n**WHY IT LOOKED RIGHT** ⟨INFERENCE⟩**:** Claude reasoning.`;
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content });
  const original = out.records.find((r) => r.record_type === 'CLAIM');
  const correction = out.records.find((r) => r.record_type === 'CORRECTION');
  const inference = out.records.find((r) => r.record_type === 'AUDIT_REASONING');
  assert.ok(original);
  assert.ok(correction);
  assert.ok(original.related_ids.includes(correction.id));
  assert.ok(correction.related_ids.includes(original.id));
  assert.equal(inference.provenance_type, 'CLAUDE');
  assert.equal(inference.representation_type, 'INFERENCE');
});

test('unmarked audit body uses documented-context rule', () => {
  const content = `#### ⚑ AUDIT — Example\n\n**AS RECORDED:** Old claim.\n\n**AUDIT**\n\nA documented audit-body claim.\n\n**CORRECTED:** Better claim.`;
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content });
  const note = out.records.find((r) => r.text === 'A documented audit-body claim.');
  assert.equal(note.provenance_type, 'SOURCE');
  assert.equal(note.attribution_evidence.method, 'audit_body_rule');
});

test('unknown document outside deterministic rules fails closed', () => {
  const out = parseMarkdown({ sourceFile: 'Unknown.md', content: '# Topic\n\nUnmarked paragraph.' });
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
  assert.equal(out.records[0].review_required, true);
});

test('explicitly marked user question becomes MY_QUESTION and OPEN', () => {
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 10. Questions\n\n⟨YOURS⟩ Which translation are you using?' });
  assert.equal(out.records[0].record_type, 'QUESTION');
  assert.equal(out.records[0].status, 'OPEN');
  assert.equal(out.records[0].provenance_type, 'MY_QUESTION');
});

test('unmarked question past §9 stays REVIEW_REQUIRED — record_type is QUESTION/OPEN, but a "?" is not proof of authorship', () => {
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 10. Questions\n\nWhich translation are you using?' });
  assert.equal(out.records[0].record_type, 'QUESTION');
  assert.equal(out.records[0].status, 'OPEN');
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
});

test('IDs are deterministic', () => {
  const input = { sourceFile: 'Glossary.md', content: '# A\n\n⟨DOCUMENTED⟩ Text.' };
  const a = parseMarkdown(input);
  const b = parseMarkdown(input);
  assert.equal(a.records[0].id, b.records[0].id);
});

test('Study Notes display rename preserves legacy record IDs', () => {
  const legacy = parseMarkdown({
    sourceFile: 'Bible_Deep_Dive_Master_Notes.md',
    content: '# Bible Deep Dive: Master Notes\n\nSee Master Notes §1.',
  });
  const renamed = parseMarkdown({
    sourceFile: 'Bible_Deep_Dive_Master_Notes.md',
    content: '# Bible Deep Dive: Study Notes\n\nSee Study Notes §1.',
  });

  assert.equal(renamed.records[0].id, legacy.records[0].id);
  assert.equal(renamed.records[0].topics[0], 'Bible Deep Dive: Study Notes');
  assert.equal(renamed.records[0].text, 'See Study Notes §1.');
});

test('Observations display rename preserves legacy record IDs', () => {
  const legacy = parseMarkdown({
    sourceFile: 'Field_Guide_Conversation_Reference.md',
    content: '# Field Guide: Live Conversation Reference\n\nSee Field Guide §2.',
  });
  const renamed = parseMarkdown({
    sourceFile: 'Field_Guide_Conversation_Reference.md',
    content: '# Observations: Live Conversation Reference\n\nSee Observations §2.',
  });

  assert.equal(renamed.records[0].id, legacy.records[0].id);
  assert.equal(renamed.records[0].topics[0], 'Observations: Live Conversation Reference');
  assert.equal(renamed.records[0].text, 'See Observations §2.');
});

test('reader-focused heading and prompt labels preserve unchanged record IDs', () => {
  const legacy = parseMarkdown({
    sourceFile: 'Field_Guide_Conversation_Reference.md',
    content: '# 2. COMMON CLAIMS & RESPONSES\n\n**Why this critique holds up — and what to say:**\n\n• Soft: "What supports that reading?"',
  });
  const renamed = parseMarkdown({
    sourceFile: 'Field_Guide_Conversation_Reference.md',
    content: '# 2. COMMON CLAIMS — CONTEXT AND QUESTIONS\n\n**Why this assessment holds — questions for conversation:**\n\n• Clarifying question: "What supports that reading?"',
  });

  assert.deepEqual(renamed.records.map(({ id }) => id), legacy.records.map(({ id }) => id));
  assert.equal(renamed.records.at(-1).text, '• Clarifying question: "What supports that reading?"');
});
