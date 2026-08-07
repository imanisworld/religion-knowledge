import crypto from 'node:crypto';

export const PARSER_VERSION = '1.0.0';

const PROVENANCE = Object.freeze({
  MY_WORDS: 'MY_WORDS',
  MY_POSITION: 'MY_POSITION',
  MY_QUESTION: 'MY_QUESTION',
  CLAUDE: 'CLAUDE',
  CHATGPT: 'CHATGPT',
  SOURCE: 'SOURCE',
  INFERENCE: 'INFERENCE',
  REVIEW_REQUIRED: 'REVIEW_REQUIRED',
});

function cleanInlineMarkdown(text) {
  return text
    .replace(/^>\s?/, '')
    .replace(/^[-*+]\s+/, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .trim();
}

function markerInfo(raw) {
  if (/⟨YOURS(?:\s*—[^⟩]*)?⟩/i.test(raw)) {
    return {
      provenance_type: PROVENANCE.MY_WORDS,
      representation_type: 'VERBATIM',
      speaker: 'user',
      attribution_confidence: 'PROVEN',
      attribution_evidence: { method: 'explicit_marker', value: '⟨YOURS⟩' },
      review_required: false,
    };
  }
  if (/⟨INFERENCE(?:\s*—[^⟩]*)?⟩/i.test(raw)) {
    return {
      provenance_type: PROVENANCE.CLAUDE,
      representation_type: 'INFERENCE',
      speaker: 'Claude',
      attribution_confidence: 'PROVEN',
      attribution_evidence: { method: 'explicit_marker', value: raw.match(/⟨INFERENCE[^⟩]*⟩/i)?.[0] ?? '⟨INFERENCE⟩' },
      review_required: false,
    };
  }
  if (/⟨DOCUMENTED(?:\s*—[^⟩]*)?⟩/i.test(raw)) {
    return {
      provenance_type: PROVENANCE.SOURCE,
      representation_type: 'PARAPHRASE',
      speaker: null,
      attribution_confidence: 'PROVEN',
      attribution_evidence: { method: 'explicit_marker', value: raw.match(/⟨DOCUMENTED[^⟩]*⟩/i)?.[0] ?? '⟨DOCUMENTED⟩' },
      review_required: false,
    };
  }
  return null;
}

function classifyRecordType(text, headingPath, inAudit) {
  const t = text.toLowerCase();
  if (inAudit && /^as recorded\s*:/i.test(text)) return 'CLAIM';
  if (inAudit && /^status\s*:/i.test(text)) return 'AUDIT_STATUS';
  if (inAudit && /^corrected\s*:/i.test(text)) return 'CORRECTION';
  if (inAudit && /^why it looked right\s*:/i.test(text)) return 'AUDIT_REASONING';
  if (inAudit && /^what survives/i.test(text)) return 'AUDIT_SURVIVAL';
  if (/\?$/.test(text.trim())) return 'QUESTION';
  if (headingPath.some((h) => /glossary/i.test(h))) return 'DEFINITION';
  if (t.startsWith('core stance:')) return 'POSITION';
  return inAudit ? 'AUDIT_NOTE' : 'OBSERVATION';
}

function stableId(sourceFile, sectionPath, ordinal, rawText) {
  const input = `${sourceFile}\u0000${sectionPath.join(' > ')}\u0000${ordinal}\u0000${rawText}`;
  return `rk_${crypto.createHash('sha256').update(input).digest('hex').slice(0, 20)}`;
}

function isMixedLegacySection(sourceFile, headingPath) {
  if (sourceFile !== 'Bible_Deep_Dive_Master_Notes.md') return false;
  const numbered = headingPath.find((h) => /^\d+(?:\.\d+)?\b/.test(h));
  if (!numbered) return false;
  const major = Number(numbered.match(/^(\d+)/)?.[1]);
  return Number.isFinite(major) && major >= 0 && major <= 9;
}

export function parseMarkdown({ sourceFile, content }) {
  if (!sourceFile || typeof sourceFile !== 'string') throw new TypeError('sourceFile is required');
  if (typeof content !== 'string') throw new TypeError('content must be a string');

  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const headingPath = [];
  const records = [];
  const warnings = [];
  let paragraph = [];
  let ordinal = 0;
  let currentAuditId = null;
  let pendingAuditTitle = null;

  const flush = () => {
    if (!paragraph.length) return;
    const rawText = paragraph.join('\n').trim();
    paragraph = [];
    if (!rawText || /^---+$/.test(rawText)) return;

    ordinal += 1;
    const text = cleanInlineMarkdown(rawText.replace(/⟨(?:YOURS|INFERENCE|DOCUMENTED)(?:\s*—[^⟩]*)?⟩/gi, '').trim());
    if (!text) return;

    const explicit = markerInfo(rawText);
    const inAudit = Boolean(currentAuditId);
    let attribution = explicit;

    if (!attribution && inAudit) {
      attribution = {
        provenance_type: PROVENANCE.SOURCE,
        representation_type: 'PARAPHRASE',
        speaker: null,
        attribution_confidence: 'CONTEXTUAL',
        attribution_evidence: { method: 'audit_body_rule', value: 'Unmarked audit-body claim; document provenance rule says unmarked audit claims are documented.' },
        review_required: false,
      };
    }

    if (!attribution && isMixedLegacySection(sourceFile, headingPath)) {
      attribution = {
        provenance_type: PROVENANCE.REVIEW_REQUIRED,
        representation_type: 'VERBATIM',
        speaker: null,
        attribution_confidence: 'UNKNOWN',
        attribution_evidence: { method: 'document_warning', value: 'Master Notes §0–§9 explicitly described as mixed and no longer cleanly separable.' },
        review_required: true,
      };
    }

    if (!attribution) {
      attribution = {
        provenance_type: PROVENANCE.REVIEW_REQUIRED,
        representation_type: 'VERBATIM',
        speaker: null,
        attribution_confidence: 'UNKNOWN',
        attribution_evidence: { method: 'none', value: 'No deterministic provenance marker or applicable source rule.' },
        review_required: true,
      };
    }

    const recordType = classifyRecordType(text, headingPath, inAudit);
    const id = stableId(sourceFile, headingPath, ordinal, rawText);
    const record = {
      id,
      text,
      raw_text: rawText,
      provenance_type: attribution.provenance_type,
      representation_type: attribution.representation_type,
      speaker: attribution.speaker,
      topics: headingPath.filter(Boolean),
      subtopics: [],
      record_type: recordType,
      status: null,
      position_status: null,
      original_date: null,
      source_file: sourceFile,
      source_section: headingPath.join(' > ') || null,
      source_reference: `paragraph:${ordinal}`,
      parent_id: currentAuditId,
      related_ids: [],
      tags: [],
      citation: null,
      attribution_confidence: attribution.attribution_confidence,
      attribution_evidence: attribution.attribution_evidence,
      review_required: attribution.review_required,
      parser_version: PARSER_VERSION,
    };

    if (recordType === 'AUDIT_STATUS') record.status = text.replace(/^status\s*:\s*/i, '').trim();
    if (recordType === 'QUESTION') record.status = 'OPEN';
    records.push(record);
  };

  for (const line of lines) {
    const heading = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (heading) {
      flush();
      const level = heading[1].length;
      const title = cleanInlineMarkdown(heading[2]);
      headingPath.splice(level - 1);
      headingPath[level - 1] = title;

      const auditMatch = title.match(/^⚑\s*AUDIT\s*[—-]\s*(.+)$/i);
      if (auditMatch) {
        pendingAuditTitle = auditMatch[1].trim();
        currentAuditId = `audit_${crypto.createHash('sha256').update(`${sourceFile}\u0000${headingPath.join(' > ')}`).digest('hex').slice(0, 20)}`;
      } else if (level <= 3) {
        currentAuditId = null;
        pendingAuditTitle = null;
      }
      continue;
    }

    if (!line.trim()) {
      flush();
      continue;
    }

    paragraph.push(line);
  }
  flush();

  const auditGroups = new Map();
  for (const record of records) {
    if (!record.parent_id) continue;
    if (!auditGroups.has(record.parent_id)) auditGroups.set(record.parent_id, []);
    auditGroups.get(record.parent_id).push(record);
  }

  for (const [auditId, group] of auditGroups) {
    const original = group.find((r) => r.record_type === 'CLAIM');
    const correction = group.find((r) => r.record_type === 'CORRECTION');
    const status = group.find((r) => r.record_type === 'AUDIT_STATUS');
    if (original && correction) {
      original.related_ids.push(correction.id);
      correction.related_ids.push(original.id);
    }
    if (status && correction) {
      status.related_ids.push(correction.id);
      correction.related_ids.push(status.id);
    }
    if (!original || !correction) {
      warnings.push({
        code: 'INCOMPLETE_AUDIT_CHAIN',
        audit_id: auditId,
        title: pendingAuditTitle,
        message: 'Audit block does not contain both AS RECORDED and CORRECTED records.',
      });
    }
  }

  return { sourceFile, parserVersion: PARSER_VERSION, records, warnings };
}
