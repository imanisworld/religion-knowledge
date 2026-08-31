#!/usr/bin/env node
// Validates docs/timeline/data/**/*.json against the shapes documented in
// docs/timeline/schema/*.schema.json and the rules in docs/timeline/SPEC.md.
// Hand-rolled (no JSON Schema library dependency) to match this repo's existing
// validator style (scripts/import/validate-corpus.mjs, scripts/validate-reader-sync.mjs).
//
// Run: node docs/timeline/scripts/validate-timeline.mjs

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, 'docs/timeline/data');
const ENTITIES_DIR = path.join(DATA_DIR, 'entities');
const CLAIMS_DIR = path.join(DATA_DIR, 'claims');

const failures = [];
const fail = (msg) => failures.push(msg);

const ZOOM_LEVELS = ['Z0', 'Z1', 'Z2', 'Z3', 'Z4', 'Z5', 'Z6', 'Z7'];
const DATE_PRECISIONS = ['YEAR', 'DECADE', 'CENTURY', 'MILLENNIUM', 'ORDER_OF_MAGNITUDE'];
const DATE_SEMANTICS = [
  'EVENT_DATE', 'EARLIEST_SURVIVING_EVIDENCE', 'EARLIEST_WRITTEN_ATTESTATION',
  'SURVIVING_MANUSCRIPT_DATE', 'ESTIMATED_COMPOSITION', 'TRADITION_INTERNAL_CLAIM',
  'ESTIMATED_ORAL_ORIGIN',
];
const EVIDENCE_TYPES = [
  'ARCHAEOLOGY', 'ANCIENT_DNA', 'WRITTEN_PRIMARY', 'INSCRIPTION', 'ORAL_TRADITION',
  'ART_ICONOGRAPHY', 'MATERIAL_CULTURE', 'ASTRONOMICAL', 'SCIENTIFIC_ANALYSIS',
  'LATER_HISTORICAL_ACCOUNT', 'LINGUISTIC', 'ETHNOGRAPHIC', 'COMPARATIVE_RECONSTRUCTION',
];
const CONFIDENCE_LEVELS = ['HIGH', 'MODERATE', 'LOW', 'DISPUTED', 'UNKNOWN'];
const CLAIM_TIERS = ['OBSERVATION', 'INTERPRETATION', 'CAUSAL_EXPLANATION'];
const CLAIM_STATUSES = ['draft', 'verified', 'published'];
const SOURCE_TYPES = ['PRIMARY', 'SECONDARY'];
const VERIFICATION_METHODS = ['DIRECT_READ', 'CONVERGING_SECONDARY', 'SEARCH_SNIPPET'];
const INTERPRETATION_STATUSES = ['MAJORITY', 'MINORITY', 'CONTESTED', 'FRINGE'];
const SUBJECT_TYPES = [
  'Population', 'Culture', 'Polity', 'Tradition', 'Deity', 'Text', 'Narrative',
  'KnowledgeState', 'GenderSystem', 'Person', 'WritingSystem', 'MediaEra', 'Hypothesis',
];

// SPEC.md P5: "Middle East"/"Near East" banned as an ancient-period lane label.
// Applied to any region tag on a claim or entity whose date (if present) is BCE
// or whose subject predates the modern era; conservatively applied to all region
// tags for now since Phase 2 has no post-modern content.
const BANNED_LANE_LABELS = [/\bmiddle east\b/i, /\bnear east\b/i];

function readJsonFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...readJsonFilesRecursive(full));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      out.push(full);
    }
  }
  return out;
}

function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    fail(`${path.relative(ROOT, file)}: invalid JSON (${err.message})`);
    return null;
  }
}

function checkRegionLabels(regionArr, sourceLabel) {
  if (!Array.isArray(regionArr)) return;
  for (const label of regionArr) {
    if (typeof label !== 'string') continue;
    for (const banned of BANNED_LANE_LABELS) {
      if (banned.test(label)) {
        fail(`${sourceLabel}: region label "${label}" uses banned ancient-period vocabulary (SPEC.md P5)`);
      }
    }
  }
}

function checkDateShape(date, dateSemantics, sourceLabel) {
  if (date === null || date === undefined) return;
  if (typeof date !== 'object') {
    fail(`${sourceLabel}: date must be an object or null`);
    return;
  }
  if (!DATE_PRECISIONS.includes(date.precision)) {
    fail(`${sourceLabel}: date.precision "${date.precision}" is not one of ${DATE_PRECISIONS.join(', ')}`);
  }
  if (!('earliest' in date) || !('latest' in date)) {
    fail(`${sourceLabel}: date must include earliest and latest (may be null)`);
  }
  // date present => date_semantics required and must not be null (SPEC.md §5.1)
  if (dateSemantics === null || dateSemantics === undefined) {
    fail(`${sourceLabel}: date is present but date_semantics is missing (SPEC.md §5.1 requires it whenever a date is present)`);
  }
}

function checkDateSemanticsValue(value, sourceLabel) {
  if (value === null || value === undefined) return;
  if (value === 'FIRST_EVER') {
    fail(`${sourceLabel}: date_semantics "FIRST_EVER" does not exist in this schema (SPEC.md §5.1) — use EARLIEST_SURVIVING_EVIDENCE or another honest value`);
    return;
  }
  if (!DATE_SEMANTICS.includes(value)) {
    fail(`${sourceLabel}: date_semantics "${value}" is not a recognized value`);
  }
}

// ---------------------------------------------------------------------------
// Load entities
// ---------------------------------------------------------------------------

const entityFiles = readJsonFilesRecursive(ENTITIES_DIR);
const entitiesById = new Map(); // id -> { data, type, file }

for (const file of entityFiles) {
  const data = loadJson(file);
  if (!data) continue;
  const rel = path.relative(ROOT, file);
  const type = path.basename(path.dirname(file)) === 'populations' ? 'Population' : null;
  if (!type) {
    fail(`${rel}: could not infer entity type from directory name; expected e.g. data/entities/populations/`);
    continue;
  }
  if (!data.id) {
    fail(`${rel}: missing id`);
    continue;
  }
  if (entitiesById.has(data.id)) {
    fail(`Duplicate entity id "${data.id}": ${rel} and ${path.relative(ROOT, entitiesById.get(data.id).file)}`);
    continue;
  }
  entitiesById.set(data.id, { data, type, file });

  if (type === 'Population') {
    validatePopulation(data, rel);
  }
}

function validatePopulation(pop, rel) {
  if (!pop.name) fail(`${rel}: Population missing name`);
  if (!pop.taxonomic_status || typeof pop.taxonomic_status !== 'object') {
    fail(`${rel}: Population missing taxonomic_status`);
  } else {
    if (typeof pop.taxonomic_status.classification !== 'string') {
      fail(`${rel}: taxonomic_status.classification must be a string`);
    }
    if (typeof pop.taxonomic_status.disputed !== 'boolean') {
      fail(`${rel}: taxonomic_status.disputed must be a boolean`);
    }
  }
  if (!pop.date_range || typeof pop.date_range !== 'object') {
    fail(`${rel}: Population missing date_range`);
  } else {
    checkDateSemanticsValue(pop.date_range.date_semantics, `${rel} date_range`);
    if (!DATE_PRECISIONS.includes(pop.date_range.precision)) {
      fail(`${rel}: date_range.precision "${pop.date_range.precision}" invalid`);
    }
    if (pop.date_range.date_semantics === null || pop.date_range.date_semantics === undefined) {
      fail(`${rel}: date_range.date_semantics is required`);
    }
  }
  checkRegionLabels(pop.region, rel);
  if (!Array.isArray(pop.region) || pop.region.length === 0) {
    fail(`${rel}: Population must have at least one region tag`);
  }
  if (pop.gene_flow_edges) {
    for (const [i, edge] of pop.gene_flow_edges.entries()) {
      const label = `${rel} gene_flow_edges[${i}]`;
      if (!edge.with_population_id) fail(`${label}: missing with_population_id`);
      if (!['BIDIRECTIONAL', 'INTO_SUBJECT', 'FROM_SUBJECT'].includes(edge.direction)) {
        fail(`${label}: direction "${edge.direction}" invalid`);
      }
      if (!CONFIDENCE_LEVELS.includes(edge.confidence)) {
        fail(`${label}: confidence "${edge.confidence}" invalid`);
      }
      if (!edge.claim_id) fail(`${label}: gene_flow_edges entries must cite a backing claim_id (SPEC.md §7.1)`);
      // cross-reference resolved after claims are loaded, below
    }
  }
}

// ---------------------------------------------------------------------------
// Load claims
// ---------------------------------------------------------------------------

const claimFiles = readJsonFilesRecursive(CLAIMS_DIR);
const claimsById = new Map();

for (const file of claimFiles) {
  const data = loadJson(file);
  if (!data) continue;
  const rel = path.relative(ROOT, file);
  if (!data.id) {
    fail(`${rel}: missing id`);
    continue;
  }
  if (claimsById.has(data.id)) {
    fail(`Duplicate claim id "${data.id}": ${rel} and ${path.relative(ROOT, claimsById.get(data.id).file)}`);
    continue;
  }
  claimsById.set(data.id, { data, file });
}

for (const [id, { data: claim, file }] of claimsById) {
  const rel = path.relative(ROOT, file);
  const label = `${rel} (${id})`;

  if (!SUBJECT_TYPES.includes(claim.subject_type)) {
    fail(`${label}: subject_type "${claim.subject_type}" not recognized`);
  }
  if (!claim.subject_id) {
    fail(`${label}: missing subject_id`);
  } else if (claim.subject_type === 'Population' && !entitiesById.has(claim.subject_id)) {
    fail(`${label}: subject_id "${claim.subject_id}" does not resolve to any loaded Population entity`);
  }

  if (typeof claim.statement !== 'string' || claim.statement.trim().length === 0) {
    fail(`${label}: statement must be a non-empty string`);
  }

  if (!CLAIM_TIERS.includes(claim.claim_tier)) {
    fail(`${label}: claim_tier "${claim.claim_tier}" invalid`);
  }

  if (claim.claim_tier === 'CAUSAL_EXPLANATION') {
    if (!claim.related_observation_id) {
      fail(`${label}: CAUSAL_EXPLANATION requires related_observation_id (SPEC.md §6.6)`);
    } else {
      const obs = claimsById.get(claim.related_observation_id);
      if (!obs) {
        fail(`${label}: related_observation_id "${claim.related_observation_id}" does not resolve to a loaded claim`);
      } else if (obs.data.claim_tier !== 'OBSERVATION') {
        fail(`${label}: related_observation_id points to a claim that is not claim_tier OBSERVATION`);
      } else {
        const obsCitations = new Set((obs.data.sources || []).map((s) => s.citation));
        const ownCitations = (claim.sources || []).map((s) => s.citation);
        const hasIndependentSource = ownCitations.some((c) => !obsCitations.has(c));
        if (!hasIndependentSource) {
          fail(`${label}: CAUSAL_EXPLANATION cites no source beyond its related observation's own sources (SPEC.md §6.6 — a causal claim needs evidence of its own)`);
        }
      }
    }
  }

  checkDateSemanticsValue(claim.date_semantics, label);
  checkDateShape(claim.date, claim.date_semantics, label);

  if (!ZOOM_LEVELS.includes(claim.zoom_min)) fail(`${label}: zoom_min "${claim.zoom_min}" invalid`);
  if (!ZOOM_LEVELS.includes(claim.zoom_max)) fail(`${label}: zoom_max "${claim.zoom_max}" invalid`);
  if (ZOOM_LEVELS.includes(claim.zoom_min) && ZOOM_LEVELS.includes(claim.zoom_max)) {
    if (ZOOM_LEVELS.indexOf(claim.zoom_min) > ZOOM_LEVELS.indexOf(claim.zoom_max)) {
      fail(`${label}: zoom_min "${claim.zoom_min}" is a narrower window than zoom_max "${claim.zoom_max}"`);
    }
  }

  checkRegionLabels(claim.region, label);

  if (claim.evidence_types) {
    for (const et of claim.evidence_types) {
      if (!EVIDENCE_TYPES.includes(et)) fail(`${label}: evidence_types entry "${et}" invalid`);
    }
  }

  if (!CONFIDENCE_LEVELS.includes(claim.confidence)) {
    fail(`${label}: confidence "${claim.confidence}" invalid`);
  }

  if (claim.confidence === 'DISPUTED') {
    if (!claim.scholarly_disagreement) {
      fail(`${label}: confidence DISPUTED requires scholarly_disagreement (one-sentence summary)`);
    }
    if (!Array.isArray(claim.interpretations) || claim.interpretations.length < 2) {
      fail(`${label}: confidence DISPUTED requires >= 2 interpretations[] (SPEC.md §6.2)`);
    }
  }

  if (!Array.isArray(claim.sources) || claim.sources.length === 0) {
    fail(`${label}: sources[] must have at least one entry`);
  } else {
    for (const [i, src] of claim.sources.entries()) {
      const sl = `${label} sources[${i}]`;
      if (!SOURCE_TYPES.includes(src.type)) fail(`${sl}: type "${src.type}" invalid`);
      if (typeof src.citation !== 'string' || src.citation.trim().length === 0) {
        fail(`${sl}: citation must be a non-empty string`);
      }
      if (!VERIFICATION_METHODS.includes(src.verification_method)) {
        fail(`${sl}: verification_method "${src.verification_method}" invalid`);
      }
    }
  }

  if (claim.interpretations) {
    for (const [i, interp] of claim.interpretations.entries()) {
      const il = `${label} interpretations[${i}]`;
      if (typeof interp.position !== 'string' || !interp.position) fail(`${il}: missing position`);
      if (!INTERPRETATION_STATUSES.includes(interp.status)) fail(`${il}: status "${interp.status}" invalid`);
      if (!Array.isArray(interp.holders) || interp.holders.length === 0) {
        fail(`${il}: holders[] must have at least one entry`);
      } else {
        for (const [j, holder] of interp.holders.entries()) {
          if (!holder.name) fail(`${il} holders[${j}]: missing name`);
          if (!holder.camp) fail(`${il} holders[${j}]: missing camp label`);
        }
      }
    }
  }

  if (!CLAIM_STATUSES.includes(claim.status)) {
    fail(`${label}: status "${claim.status}" invalid`);
  }
}

// Cross-reference gene_flow_edges now that claims are loaded.
for (const [entId, { data, type, file }] of entitiesById) {
  if (type !== 'Population' || !data.gene_flow_edges) continue;
  const rel = path.relative(ROOT, file);
  for (const [i, edge] of data.gene_flow_edges.entries()) {
    const label = `${rel} gene_flow_edges[${i}]`;
    if (edge.with_population_id && !entitiesById.has(edge.with_population_id)) {
      fail(`${label}: with_population_id "${edge.with_population_id}" does not resolve to any loaded Population entity`);
    }
    if (edge.claim_id && !claimsById.has(edge.claim_id)) {
      fail(`${label}: claim_id "${edge.claim_id}" does not resolve to any loaded claim`);
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

if (failures.length) {
  console.error(`TIMELINE_VALIDATION_FAILURES=${JSON.stringify(failures)}`);
  process.exit(1);
}

const summary = {
  entities: entitiesById.size,
  claims: claimsById.size,
  by_status: CLAIM_STATUSES.reduce((acc, s) => {
    acc[s] = [...claimsById.values()].filter(({ data }) => data.status === s).length;
    return acc;
  }, {}),
};
console.log(`TIMELINE_VALIDATION_SUMMARY=${JSON.stringify(summary)}`);
