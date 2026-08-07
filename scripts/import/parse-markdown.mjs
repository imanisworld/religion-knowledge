import crypto from 'node:crypto';

export const PARSER_VERSION = '1.1.2';

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
  const present = [
    ['YOURS', /⟨YOURS(?:\s*—[^⟩]*)?⟩/i],
    ['INFERENCE', /⟨INFERENCE(?:\s*—[^⟩]*)?⟩/i],
    ['DOCUMENTED', /⟨DOCUMENTED(?:\s*—[^⟩]*)?⟩/i],
  ].filter(([, pattern]) => pattern.test(raw));

  if (present.length > 1) {
    return {
      provenance_type: PROVENANCE.REVIEW_REQUIRED,
      representation_type: 'VERBATIM',
      speaker: null,
      attribution_confidence: 'UNKNOWN',
      attribution_evidence: {
        method: 'multiple_explicit_markers',
        value: `Paragraph contains multiple provenance marker types (${present.map(([name]) => name).join(', ')}); marker mentions cannot prove authorship.`,
      },
      review_required: true,
    };
  }

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
  if (headingPath.some((h) => h && /glossary/i.test(h))) return 'DEFINITION';
  if (t.startsWith('core stance:')) return 'POSITION';
  return inAudit ? 'AUDIT_NOTE' : 'OBSERVATION';
}

function stableId(sourceFile, sectionPath, ordinal, rawText) {
  const input = `${sourceFile}\u0000${sectionPath.filter(Boolean).join(' > ')}\u0000${ordinal}\u0000${rawText}`;
  return `rk_${crypto.createHash('sha256').update(input).digest('hex').slice(0, 20)}`;
}

function majorSection(headingPath) {
  for (const heading of headingPath) {
    if (!heading) continue;
    const match = heading.match(/^(\d+)\b/);
    if (match) return Number(match[1]);
  }
  return null;
}

function reviewRequired(value) {
  return {
    provenance_type: PROVENANCE.REVIEW_REQUIRED,
    representation_type: 'VERBATIM',
    speaker: null,
    attribution_confidence: 'UNKNOWN',
    attribution_evidence: { method: 'document_warning', value },
    review_required: true,
  };
}

function claudeDocumentDefault(value) {
  return {
    provenance_type: PROVENANCE.CLAUDE,
    representation_type: 'SUMMARY',
    speaker: 'Claude',
    attribution_confidence: 'PROVEN',
    attribution_evidence: { method: 'document_provenance', value },
    review_required: false,
  };
}

function userDocumentDefault(value) {
  return {
    provenance_type: PROVENANCE.MY_WORDS,
    representation_type: 'VERBATIM',
    speaker: 'user',
    attribution_confidence: 'PROVEN',
    attribution_evidence: { method: 'document_provenance', value },
    review_required: false,
  };
}

function documentDefaultInfo(sourceFile, headingPath, text) {
  const major = majorSection(headingPath);

  if (sourceFile === 'Bible_Deep_Dive_Master_Notes.md') {
    if (Number.isFinite(major) && major >= 0 && major <= 9) {
      return reviewRequired('Master Notes §0–§9 explicitly described as mixed and no longer cleanly separable.');
    }
    return userDocumentDefault('Master Notes provenance says the document is written by the user across the reading; audits are handled separately and §0–§9 are explicitly excluded as mixed.');
  }

  if (sourceFile === 'Field_Guide_Conversation_Reference.md') {
    if (major === 7) {
      return userDocumentDefault('Field Guide provenance explicitly states the fieldwork observations at §7 are the user\'s.');
    }
    if (major === 8 || major === 19) {
      return claudeDocumentDefault('Field Guide provenance explicitly states §8 method and §19 timeline are Claude compilations from named sources.');
    }
    if (Number.isFinite(major) && major >= 1 && major <= 17) {
      return reviewRequired('Field Guide §1–§17 explicitly described as genuinely mixed and no longer cleanly separable, except §7 and §8 stated exceptions.');
    }
    return reviewRequired('Field Guide provenance does not deterministically assign this section to one speaker.');
  }

  if (sourceFile === 'Glossary.md') {
    return claudeDocumentDefault('Glossary provenance explicitly states: Written by Claude; plain-English definitions of standard field terms.');
  }

  if (sourceFile === 'Historical_Framework.md') {
    return claudeDocumentDefault('Historical Framework provenance explicitly states: Written by Claude; nothing here is the user\'s prior work.');
  }

  if (sourceFile === 'Sources_and_Primary_Texts.md') {
    if (/^what it says\s*\./i.test(text)) {
      return {
        provenance_type: PROVENANCE.SOURCE,
        representation_type: 'PARAPHRASE',
        speaker: null,
        attribution_confidence: 'PROVEN',
        attribution_evidence: { method: 'document_provenance', value: 'Sources document explicitly states what each source says is documented.' },
        review_required: false,
      };
    }
    return claudeDocumentDefault('Sources & Primary Texts provenance explicitly states the document was written by Claude; interpretation of what sources establish is Claude\'s reading unless separately marked.');
  }

  if (sourceFile === 'The_Other_Side.md') {
    return claudeDocumentDefault('The Strongest Case provenance explicitly states: Written by Claude; rankings/judgments are Claude\'s where marked.');
  }

  if (sourceFile === 'Translations.md') {
    return claudeDocumentDefault('Translations provenance explicitly states: Written by Claude, verified by search.');
  }

  return null;
}

export function parseMarkdown({ sourceFile, content }) {
  if (!sourceFile || typeof sourceFile !== 'string') throw new TypeError('sourceFile is required');
  if (typeof content !== 'string') throw new TypeError('content must be a string');

  const lines = content.replace(/\r\n?/g, '\n').split('\n');
  const headingPath = [];
  const records = [];
  const warnings = [];
  const auditTitles = new Map();
  let paragraph = [];
  let ordinal = 0;
  let currentAuditId = null;

  const flush = () => {
    if (!paragraph.length) return;
    const rawText = paragraph.join('\n').trim();
    paragraph = [];
    if (!rawText || /^---+$/.test(rawText)) return;

    ordinal += 1;
    const text = cleanInlineMarkdown(rawText.replace(/⟨(?:YOURS|INFERENCE|DOCUMENTED)(?:\s*—[^⟩]*)?⟩/gi, '').trim());
    if (!text) return;

    const inAudit = Boolean(currentAuditId);
    const recordType = classifyRecordType(text, headingPath, inAudit);
    let attribution = markerInfo(rawText);

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

    if (!attribution) attribution = documentDefaultInfo(sourceFile, headingPath, text);

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

    if (attribution.provenance_type === PROVENANCE.MY_WORDS && recordType === 'QUESTION') {
      attribution = { ...attribution, provenance_type: PROVENANCE.MY_QUESTION };
    }
    if (attribution.provenance_type === PROVENANCE.MY_WORDS && recordType === 'POSITION') {
      attribution = { ...attribution, provenance_type: PROVENANCE.MY_POSITION };
    }

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
      source_section: headingPath.filter(Boolean).join(' > ') || null,
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
        currentAuditId = `audit_${crypto.createHash('sha256').update(`${sourceFile}\u0000${headingPath.filter(Boolean).join(' > ')}`).digest('hex').slice(0, 20)}`;
        auditTitles.set(currentAuditId, auditMatch[1].trim());
      } else if (level <= 3) {
        currentAuditId = null;
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
        title: auditTitles.get(auditId) ?? null,
        message: 'Audit block does not contain both AS RECORDED and CORRECTED records.',
      });
    }
  }

  return { sourceFile, parserVersion: PARSER_VERSION, records, warnings };
}
