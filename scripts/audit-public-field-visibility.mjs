/**
 * Inventory the canonical timeline entity schema against the public catalog.
 * This is a visibility/governance audit, NEVER automatic authorization to
 * publish a field or treat an unsourced historical relation as established.
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = 'docs/timeline/data/entities';
const SCHEMA = 'docs/timeline/schema';
const HERE = process.cwd();
const field = (state, reason) => ({ state, reason });
const publicPrimary = field('catalog_summary', 'Shown in the current public catalog list.');
const publicDetail = field('catalog_details', 'Shown in the current public catalog research-note expansion.');
const internal = field('internal_key', 'Used for cross-record references, not visitor-facing prose.');
const pending = reason => field('unpublished_requires_review', reason);
const draft = reason => field('planned_in_draft_pr_239', reason + ' PR #239 has not been merged or deployed.');
const subjectHold = pending('A separate research system holds this source record. Do not publish unreviewed claims or assume the related public topical page renders this very record.');
const sourceHold = pending('A proposed cross-record link or claim ID requires passage-level historical/source verification before being presented as an established relationship.');

export const CATEGORY_POLICY = {
  cultures: {
    schema:'culture', route:'catalog.html#cultures', mode:'listed_in_catalog',
    fields:{
      id:internal, name:publicPrimary, region:publicPrimary,
      date_range:draft('A bounded chronology is recorded but hidden in main catalog.'), notes:publicPrimary
    }
  },
  deities: {
    schema:'deity', route:'catalog.html#deities', mode:'listed_in_catalog',
    fields:{
      id:internal, name:publicPrimary, region:publicPrimary,
      identifications:pending('Entity identification proposals must be checked individually before display; do not conflate different deities.'),
      domain_history:field('partly_visible','The domain description is shown, but period and claim-level provenance are not fully displayed on main; dated portrayal is proposed in #239.'),
      notes:publicDetail
    }
  },
  gender_systems: {
    schema:'gendersystem', route:'gender-over-time.html', mode:'withheld_as_distinct_dataset',
    warning:'This 21-record Timeline dataset is not the separately curated 39-record gender-over-time research module. Detailed assessments carry varying confidence and source-access levels.',
    fields:{
      id:internal, culture_id:subjectHold, region:subjectHold, period:subjectHold,
      dimensions:pending('Nested research assessments have HIGH, MODERATE, UNKNOWN confidence and often secondhand or inaccessible sources. Validate individual dimensions, and honor culture-specific and restricted knowledge before any public mapping.'),
      notes:subjectHold
    }
  },
  knowledge_states: {
    schema:'knowledgestate', route:null, mode:'withheld_sensitive_research',
    warning:'Contains publicly sourced or restricted/unknown knowledge distinctions. Cultural restrictions and community protocols require a deliberate public release review.',
    fields:{
      id:internal, name:subjectHold, culture_id:subjectHold, region:subjectHold, period:subjectHold,
      known_claim_ids:sourceHold, unknown_claim_ids:sourceHold,
      natural_explanation_claim_ids:sourceHold, supernatural_explanation_claim_ids:sourceHold,
      methodology_note:pending('Methodology may refer to culturally restricted knowledge and outside researcher classifications; check community sources before presentation.'),
      notes:subjectHold
    }
  },
  narratives: {
    schema:'narrative', route:'catalog.html#narratives', mode:'listed_in_catalog',
    fields:{
      id:internal, name:publicPrimary, genre:publicDetail,
      tradition_id:pending('A linked tradition is an indexing relation, not historical proof of origins or influence.'),
      region:publicPrimary, language:publicDetail, source_label:publicPrimary,
      motif_tags:draft('Motifs already recorded are not yet shown in the main catalog. Shared motifs cannot establish borrowing.'),
      dating:field('partly_visible','Dating notes and some evidence types appear in main, but separated witness/composition dates are planned in #239.'),
      relationships:sourceHold, notes:publicDetail
    }
  },
  polities: {
    schema:'polity', route:'religion-law.html', mode:'withheld_as_distinct_dataset',
    warning:'Related legal/history content exists, but this specific nine-record Timeline polity dataset is not directly indexed on the current catalog.',
    fields:{
      id:internal, name:subjectHold, region:subjectHold, date_range:subjectHold,
      patronage_edges:sourceHold, notes:subjectHold
    }
  },
  populations: {
    schema:'population', route:'history.html', mode:'withheld_as_distinct_dataset',
    warning:'The historical framework discusses human origins, but these six phylogenetic data records are not a directly published row-for-row source for that reader.',
    fields:{
      id:internal, name:subjectHold,
      taxonomic_status:pending('Taxonomic assignments, genetic evidence and alternatives can be disputed; require date and interpretation review before publishing.'),
      date_range:subjectHold, region:subjectHold,
      gene_flow_edges:sourceHold, notes:subjectHold
    }
  },
  texts: {
    schema:'text', route:'catalog.html#writing_systems', mode:'withheld_as_distinct_dataset',
    warning:'The catalog lists writing systems, but its twelve inscription/document records are a different entity type and are not individually indexed.',
    fields:{
      id:internal, name:subjectHold, writing_system_id:sourceHold,
      decipherment_status:pending('Text decipherment status needs a text-specific source, not an inference from the linked writing system.'),
      witness_chain:pending('Dated composition and surviving physical witness must remain separate and independently sourced.'),
      region:subjectHold, notes:subjectHold
    }
  },
  traditions: {
    schema:'tradition', route:'catalog.html#traditions', additionalRoute:'traditions.html', mode:'listed_in_catalog',
    fields:{
      id:internal, name:publicPrimary, category_tags:publicDetail, region:publicPrimary,
      dating:field('partly_visible','Main catalog shows a documented written period; dedicated tradition profiles show more differentiated evidence and disputed estimates.'),
      relationships:sourceHold,
      notes:publicDetail,
      source_links:draft('Source links and precisely what they establish appear on tradition profiles, but not the catalog details on main.'),
      public_profile_facts:field('separate_source_checked_reader','These limited fact/scope statements appear on the dedicated traditions page only when their URL matches a listed source.')
    }
  },
  writing_systems: {
    schema:'writingsystem', route:'catalog.html#writing_systems', mode:'listed_in_catalog',
    fields:{
      id:internal, name:publicPrimary,
      origin_type:draft('The recorded research classification is not currently visible and is not proof of descent.'),
      script_type:publicDetail,
      date_range:draft('Date/evidence semantics exist in source but are hidden on main catalog.'),
      region:publicPrimary,
      descends_from:sourceHold,
      notes:publicPrimary
    }
  }
};

const COUNTED_SOURCES = [
  {name:'Cited Persons',source:'Cited_Persons.md',reader:'cited-persons.html',search:'search-index.json',
    policy:'Public persons are manually maintained and indexed. An UNRESOLVED attribution retains its visible warning. Birth and death dates are not derived from book-publication years.'},
  {name:'Core research readers',source:'Bible_Deep_Dive_Master_Notes.md',reader:'master-notes.html',
    policy:'Markdown-to-HTML transformation checked by reader-sync tests; research notes and observations have provenance checks.'},
  {name:'Gender Over Time',source:'research/gender-over-time/records.json',reader:'gender-over-time.html',
    policy:'39 separately curated module records; this is NOT the 21-record Timeline gender_systems directory. Do not infer row parity.'},
  {name:'Religion & Law',source:'research/religion-law/overview-records.schema.json',reader:'religion-law.html',
    policy:'Reader and structured legal research have their own evidentiary categories; not all research staging data is automatically public.'},
  {name:'Tradition profiles',source:'docs/timeline/data/entities/traditions',reader:'scripts/build-traditions-profiles.mjs',
    policy:'Dedicated profiles expose dates and limited source-linked facts. Unchecked beliefs/practices are flagged.'},
  {name:'Research claims',source:'docs/timeline/data/claims',reader:'scripts/build-public-catalog.mjs',
    policy:'The catalog shows linked-claim status counts, not full claim proofs; a graph edge never independently establishes cultural borrowing.'}
];

export function auditVisibility(root = HERE) {
  const dirs = fs.readdirSync(path.join(root, BASE), {withFileTypes:true})
    .filter(x=>x.isDirectory()).map(x=>x.name).sort();
  const missingFamilies=dirs.filter(d=>!CATEGORY_POLICY[d]);
  const extraFamilies=Object.keys(CATEGORY_POLICY).filter(d=>!dirs.includes(d));
  const categories=[];
  let total=0,publicListed=0,held=0;
  for(const dir of dirs) {
    const policy=CATEGORY_POLICY[dir];if(!policy)continue;
    const base=path.join(root,BASE,dir);
    const files=fs.readdirSync(base).filter(x=>x.endsWith('.json')).sort();
    const schema=JSON.parse(fs.readFileSync(path.join(root,SCHEMA,policy.schema+'.schema.json'),'utf8'));
    const observed=new Set();
    const records=files.flatMap(file=>{
      const parsed=JSON.parse(fs.readFileSync(path.join(base,file),'utf8'));
      const arr=Array.isArray(parsed)?parsed:[parsed];
      for(const entry of arr)Object.keys(entry).forEach(k=>observed.add(k));
      return arr;
    });
    const keyset=new Set([...Object.keys(schema.properties||{}),...observed]);
    const unmapped=[...keyset].filter(k=>!Object.hasOwn(policy.fields,k));
    const unrecorded=[...observed].filter(k=>!Object.hasOwn(schema.properties||{},k));
    const fieldStatus=Object.fromEntries([...keyset].sort().map(k=>[k,policy.fields[k]||null]));
    const dated=records.filter(record=>
      Number.isFinite(record?.date_range?.earliest)||
      Number.isFinite(record?.period?.earliest)||
      Number.isFinite(record?.dating?.earliest_written_attestation?.range?.earliest)||
      Number.isFinite(record?.dating?.surviving_manuscript_date?.range?.earliest)||
      Number.isFinite(record?.dating?.estimated_composition?.range?.earliest)||
      (record?.domain_history||[]).some(x=>Number.isFinite(x?.period?.earliest))||
      Number.isFinite(record?.witness_chain?.earliest_witness_date?.earliest)
    ).length;
    categories.push({
      dir,records:records.length,schemaFields:[...keyset].sort(),fieldStatus,unmapped,
      unrecordedSchemaExtras:unrecorded,datedRecordCount:dated,
      route:policy.route,mode:policy.mode,warning:policy.warning||null
    });
    total+=records.length;
    if(policy.mode==='listed_in_catalog')publicListed+=records.length;
    else held+=records.length;
  }
  const missingSurfaces=COUNTED_SOURCES.flatMap(p=>[p.source,p.reader,...(p.search?[p.search]:[])])
    .filter(x=>!fs.existsSync(path.join(root,x)));
  return {categories,totalRecords:total,catalogListedRecords:publicListed,notDirectlyCatalogListed:held,
    missingFamilies,extraFamilies,missingSurfaces,otherPublicSurfaces:COUNTED_SOURCES};
}

export function assertAudited(report) {
  const failures=[
    ...report.missingFamilies.map(x=>'No visibility policy for entity category '+x),
    ...report.extraFamilies.map(x=>'Policy category lacks source directory '+x),
    ...report.missingSurfaces.map(x=>'Missing source or reader '+x),
    ...report.categories.flatMap(x=>x.unmapped.map(k=>'Unmapped source field '+x.dir+'.'+k)),
  ];
  if(failures.length)throw new Error('Public field visibility audit failed:\n'+failures.join('\n'));
}

if (process.argv[1] && path.resolve(process.argv[1])===path.resolve(new URL(import.meta.url).pathname)) {
  const report=auditVisibility();
  assertAudited(report);
  if(process.argv.includes('--json')) process.stdout.write(JSON.stringify(report,null,2)+'\n');
  else {
    process.stdout.write('Timeline entity audit: '+report.totalRecords+' records; '+
      report.catalogListedRecords+' in five catalog families; '+
      report.notDirectlyCatalogListed+' in five withheld families.\n');
    for(const c of report.categories)process.stdout.write(
      c.dir+': '+c.records+' ('+c.mode+'), dated='+c.datedRecordCount+
      ', source fields='+c.schemaFields.length+'\n'
    );
  }
}
