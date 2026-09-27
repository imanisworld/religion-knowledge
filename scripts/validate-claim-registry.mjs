#!/usr/bin/env node
/**
 * validate-claim-registry.mjs
 * Validates docs/research/claim-registry.json against structural rules.
 * Exits non-zero if any violation is found.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const REGISTRY_PATH = join(ROOT, 'docs/research/claim-registry.json');

const REQUIRED_FIELDS = [
  'claim_id', 'claim_text', 'claim_type', 'status', 'confidence',
  'last_verified', 'public_locations'
];

const VALID_CLAIM_TYPES = [
  'direct_textual', 'manuscript_textual_critical', 'historical_date_event',
  'historical_interpretation', 'linguistic', 'scholarly_consensus',
  'causation_influence', 'theological_confessional', 'ethical_polemical'
];

const VALID_STATUSES = [
  'verified', 'verified_with_qualification', 'overstated', 'inaccurate',
  'disputed', 'unreviewed', 'needs_qualification'
];

const VALID_CONFIDENCE = ['high', 'medium', 'low', 'contested'];

const PROHIBITED_WORDING = [
  'proves', 'proof that', 'all scholars agree', 'clearly means',
  'the bible originally said', 'this was copied from', 'the church changed',
  'beyond doubt', 'no serious scholar'
];

const CLAIM_ID_PATTERN = /^[A-Z]{2,6}-[A-Z0-9]{2,12}-[0-9]{3}$/;
const DATE_PATTERN = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;

let errors = [];
let warnings = [];

function error(msg) { errors.push(`  ERROR: ${msg}`); }
function warn(msg)  { warnings.push(`  WARN:  ${msg}`); }

let registry;
try {
  const raw = readFileSync(REGISTRY_PATH, 'utf8');
  registry = JSON.parse(raw);
} catch (e) {
  console.error(`FATAL: Cannot read or parse ${REGISTRY_PATH}`);
  console.error(e.message);
  process.exit(1);
}

if (!Array.isArray(registry)) {
  console.error('FATAL: claim-registry.json must be a JSON array.');
  process.exit(1);
}

const seenIds = new Set();

for (let i = 0; i < registry.length; i++) {
  const entry = registry[i];
  const prefix = `Entry [${i}]${entry.claim_id ? ` (${entry.claim_id})` : ''}`;

  // Required fields
  for (const field of REQUIRED_FIELDS) {
    if (entry[field] === undefined || entry[field] === null || entry[field] === '') {
      error(`${prefix}: missing required field '${field}'`);
    }
  }

  // claim_id format and uniqueness
  if (entry.claim_id) {
    if (!CLAIM_ID_PATTERN.test(entry.claim_id)) {
      error(`${prefix}: claim_id '${entry.claim_id}' does not match pattern PREFIX-TOPIC-NNN (e.g. HF-EXILE-001)`);
    }
    if (seenIds.has(entry.claim_id)) {
      error(`${prefix}: duplicate claim_id '${entry.claim_id}'`);
    }
    seenIds.add(entry.claim_id);
  }

  // claim_type
  if (entry.claim_type && !VALID_CLAIM_TYPES.includes(entry.claim_type)) {
    error(`${prefix}: invalid claim_type '${entry.claim_type}'`);
  }

  // status
  if (entry.status && !VALID_STATUSES.includes(entry.status)) {
    error(`${prefix}: invalid status '${entry.status}'`);
  }

  // confidence
  if (entry.confidence && !VALID_CONFIDENCE.includes(entry.confidence)) {
    error(`${prefix}: invalid confidence '${entry.confidence}'`);
  }

  // last_verified date format
  if (entry.last_verified && !DATE_PATTERN.test(entry.last_verified)) {
    error(`${prefix}: last_verified '${entry.last_verified}' must be YYYY-MM-DD`);
  }

  // public_locations
  if (Array.isArray(entry.public_locations)) {
    if (entry.public_locations.length === 0) {
      error(`${prefix}: public_locations must contain at least one entry`);
    }
    for (let j = 0; j < entry.public_locations.length; j++) {
      const loc = entry.public_locations[j];
      if (!loc.file || !loc.anchor) {
        error(`${prefix}: public_locations[${j}] must have 'file' and 'anchor'`);
      }
    }
  }

  // Prohibited wording check on claim_text
  if (entry.claim_text) {
    const lower = entry.claim_text.toLowerCase();
    for (const phrase of PROHIBITED_WORDING) {
      if (lower.includes(phrase) && !entry.prohibited_wording_exception) {
        error(`${prefix}: claim_text contains prohibited phrase '${phrase}' — add 'prohibited_wording_exception' to justify it`);
      }
    }
  }

  // Counterargument required for disputed / ethical_polemical
  if (
    (entry.status === 'disputed' || entry.claim_type === 'ethical_polemical') &&
    !entry.counterargument
  ) {
    error(`${prefix}: status='${entry.status}' / type='${entry.claim_type}' requires a 'counterargument' field`);
  }

  // Causation/influence claims: warn if no secondary sources
  if (entry.claim_type === 'causation_influence') {
    if (!Array.isArray(entry.secondary_sources) || entry.secondary_sources.length < 2) {
      warn(`${prefix}: causation_influence claims should have at least 2 secondary sources with stance indicators`);
    }
  }

  // Source locator specificity: warn if locator is empty or too generic
  if (Array.isArray(entry.secondary_sources)) {
    for (const src of entry.secondary_sources) {
      if (!src.locator || src.locator.trim().length < 3) {
        warn(`${prefix}: secondary source '${src.citation || '?'}' has a missing or very short locator — add page/section`);
      }
    }
  }
}

console.log(`\nclaim-registry validation: ${registry.length} entries checked.`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(w);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s):`);
  for (const e of errors) console.error(e);
  process.exit(1);
} else {
  console.log('\nAll checks passed.');
  process.exit(0);
}
