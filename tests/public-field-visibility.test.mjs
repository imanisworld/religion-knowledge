import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {auditVisibility,assertAudited,CATEGORY_POLICY} from '../scripts/audit-public-field-visibility.mjs';
import {buildPublicCatalog} from '../scripts/build-public-catalog.mjs';

const report=auditVisibility();

test('every Timeline entity category and source field has an explicit publishing disposition',()=>{
  assert.doesNotThrow(()=>assertAudited(report));
  assert.equal(report.categories.length,10);
  assert.equal(report.totalRecords,179);
  assert.equal(report.catalogListedRecords,128);
  assert.equal(report.notDirectlyCatalogListed,51);
  const byName=Object.fromEntries(report.categories.map(c=>[c.dir,c.records]));
  assert.deepEqual(Object.fromEntries([
    'gender_systems','knowledge_states','polities','populations','texts'
  ].map(k=>[k,byName[k]])), {
    gender_systems:21, knowledge_states:3, polities:9, populations:6, texts:12
  });
  for(const item of report.categories){
    assert.equal(item.unmapped.length,0,item.dir+' has an unexplained field');
    for(const [key,status] of Object.entries(item.fieldStatus)){
      assert.ok(status?.state&&status.reason?.length>=15,
        item.dir+'.'+key+' has no plain-language public-display reason');
    }
  }
});

test('restricted/contested categories do not leak into the catalog simply because they are present in research',()=>{
  const html=buildPublicCatalog();
  const publicFamilies=report.categories.filter(x=>x.mode==='listed_in_catalog');
  const heldFamilies=report.categories.filter(x=>x.mode!=='listed_in_catalog');
  for(const c of publicFamilies)assert.match(html,new RegExp('<details id="'+c.dir+'" class="group"'));
  for(const c of heldFamilies)assert.doesNotMatch(html,
    new RegExp('<details id="'+c.dir+'" class="group"'));
  assert.deepEqual(heldFamilies.map(c=>c.dir),[
    'gender_systems','knowledge_states','polities','populations','texts'
  ]);
  assert.ok(CATEGORY_POLICY.knowledge_states.warning.includes('community protocols'));
  assert.ok(CATEGORY_POLICY.narratives.fields.relationships.reason.includes('passage-level'));
  assert.ok(CATEGORY_POLICY.traditions.fields.relationships.reason.includes('passage-level'));
});

test('similarly named gender datasets are audited as distinct sources',()=>{
  const gender=JSON.parse(fs.readFileSync('research/gender-over-time/records.json','utf8'));
  assert.equal(gender.records.length,39);
  assert.equal(report.categories.find(c=>c.dir==='gender_systems').records,21);
  assert.equal(report.categories.find(c=>c.dir==='gender_systems').mode,'withheld_as_distinct_dataset');
  assert.ok(fs.existsSync('gender-over-time.html'));
});

test('future public mapping changes require an explicit policy update',()=>{
  const fields=report.categories.find(c=>c.dir==='texts').fieldStatus;
  assert.equal(fields.witness_chain.state,'unpublished_requires_review');
  assert.equal(fields.decipherment_status.state,'unpublished_requires_review');
  assert.equal(report.categories.find(c=>c.dir==='writing_systems').fieldStatus.descends_from.state,'unpublished_requires_review');
  assert.equal(report.categories.find(c=>c.dir==='cultures').fieldStatus.date_range.state,'planned_in_draft_pr_239');
  assert.ok(report.otherPublicSurfaces.some(x=>x.name==='Cited Persons'));
});
