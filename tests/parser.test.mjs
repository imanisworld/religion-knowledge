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

test('legacy Master Notes sections 0-9 fail closed to REVIEW_REQUIRED', () => {
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 1. Big Framework\n\n### 1.1 Claim\n\nThis predates provenance convention.' });
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
  assert.equal(out.records[0].review_required, true);
  assert.match(out.records[0].attribution_evidence.value, /mixed/i);
});

test('post-legacy Master Notes defaults to user-authored text', () => {
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 10. Current Notes\n\nThis is later user-authored material.' });
  assert.equal(out.records[0].provenance_type, 'MY_WORDS');
  assert.equal(out.records[0].review_required, false);
  assert.equal(out.records[0].attribution_evidence.method, 'document_provenance');
});

test('Field Guide section 7 defaults to user-authored fieldwork', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 7. FIELDWORK\n\nObserved in live conversation.' });
  assert.equal(out.records[0].provenance_type, 'MY_WORDS');
  assert.equal(out.records[0].review_required, false);
});

test('Field Guide mixed sections remain REVIEW_REQUIRED', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 3. HISTORY\n\nOld mixed material.' });
  assert.equal(out.records[0].provenance_type, 'REVIEW_REQUIRED');
  assert.equal(out.records[0].review_required, true);
});

test('Field Guide section 8 defaults to Claude compilation', () => {
  const out = parseMarkdown({ sourceFile: 'Field_Guide_Conversation_Reference.md', content: '# 8. METHOD\n\nCompiled method.' });
  assert.equal(out.records[0].provenance_type, 'CLAUDE');
  assert.equal(out.records[0].representation_type, 'SUMMARY');
});

test('Claude-authored reference docs use explicit document provenance', () => {
  for (const sourceFile of ['Glossary.md', 'Historical_Framework.md', 'The_Other_Side.md', 'Translations.md']) {
    const out = parseMarkdown({ sourceFile, content: '# Topic\n\nUnmarked paragraph.' });
    assert.equal(out.records[0].provenance_type, 'CLAUDE', sourceFile);
    assert.equal(out.records[0].representation_type, 'SUMMARY', sourceFile);
    assert.equal(out.records[0].review_required, false, sourceFile);
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

test('user-authored question becomes MY_QUESTION and OPEN', () => {
  const out = parseMarkdown({ sourceFile: 'Bible_Deep_Dive_Master_Notes.md', content: '## 10. Questions\n\nWhich translation are you using?' });
  assert.equal(out.records[0].record_type, 'QUESTION');
  assert.equal(out.records[0].status, 'OPEN');
  assert.equal(out.records[0].provenance_type, 'MY_QUESTION');
});

test('IDs are deterministic', () => {
  const input = { sourceFile: 'Glossary.md', content: '# A\n\n⟨DOCUMENTED⟩ Text.' };
  const a = parseMarkdown(input);
  const b = parseMarkdown(input);
  assert.equal(a.records[0].id, b.records[0].id);
});
