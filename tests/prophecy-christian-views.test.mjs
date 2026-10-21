import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const base=JSON.parse(fs.readFileSync('research/prophecy-audit/records.json','utf8'));
const v=JSON.parse(fs.readFileSync('research/prophecy-audit/christian-interpretations.json','utf8'));
const md=fs.readFileSync('research/prophecy-audit/index.md','utf8');
const html=fs.readFileSync('prophecy-audit.html','utf8');

test('all 65 prophecy cases include bounded, contrasting Christian understandings',()=>{
  const ids=base.records.map(x=>x.id);
  assert.equal(ids.length,65);
  assert.equal(v.case_count,65);
  assert.deepEqual(v.case_ids,ids);
  assert.deepEqual(Object.keys(v.cases),ids);
  assert.equal((html.match(/<article class="case">/g)||[]).length,65);
  assert.equal((html.match(/<details class="christian-views">/g)||[]).length,65);
  for (const id of ids){
    const views=v.cases[id];
    assert.ok(Array.isArray(views)&&views.length>=2,id+' lacks distinct readings');
    const start=html.indexOf('<h3 id="case-'+id+'">');
    assert.ok(start>=0,'Missing HTML case '+id);
    const end=html.indexOf('</article>',start);
    assert.ok(end>start,'Missing case close '+id);
    const block=html.slice(start,end);
    assert.match(block,/<summary>Different Christian readings \(\d+\)<\/summary>/);
    assert.ok(block.includes('<dt>Earlier situation</dt>') &&
      block.includes('<dt>Historical evidence &amp; limits</dt>') &&
      block.includes('<dt>Current assessment</dt>'),
      'Original-context and historical-evidence fields must remain separate: '+id);
    assert.ok(md.includes('{#'+id+'}'),'Missing research heading '+id);
    for(const view of views){
      assert.ok(view.label.length>8&&view.explanation.length>35);
      const ref=v.source_registry[view.source_key];
      assert.ok(ref?.url?.startsWith('https://'),id+' unlinked framework source');
      assert.ok(ref.scope.length>30,id+' missing source-level caution');
      assert.ok(['general_method_or_comparative','passage_specific_primary_statement',
        'official_doctrine_not_full_verse_exegesis'].includes(view.source_level),
        id+' source level must be explicit');
      if(view.source_level==='passage_specific_primary_statement'){
        assert.match(view.attribution,/original author or official institution/);
        assert.match(block,/Passage-specific source/);
      }
      assert.ok(block.includes(view.label.replace(/&/g,'&amp;').replace(/'/g,'&#39;')),'Missing public reading: '+id+' '+view.label);
    }
  }
});

test('reader distinguishes interpretive schools from churches and keeps source limits',()=>{
  assert.match(html,/id="christian-views-guide"/);
  assert.match(html,/preterist, futurist, historicist, idealist/);
  assert.match(html,/Most citations describe <em>approaches<\/em>/);
  assert.match(html,/An interpretation does not independently prove/);
  assert.match(md,/## How different Christians interpret prophecy/);
  assert.match(md,/not official denomination-wide assertions/);
  for(const term of ['Catholic','Orthodox','Reformed','Adventist','dispensational','futurist','preterist']){
    const combined=html+' '+md;
    assert.ok(combined.toLowerCase().includes(term.toLowerCase()),'Missing approach: '+term);
  }
  assert.ok(!html.includes('href="research/prophecy-audit/'),'No internal research file links on public HTML');
  assert.ok(!html.includes('github.com/'),'No internal repository links on public HTML');
});

test('original prophecy data and historical outcome count remain separate from Christian interpretations',()=>{
  assert.equal(base.records.length,65);
  for(const entry of base.records){
    assert.ok(entry.setting&&entry.evidence&&entry.sourceStatus);
    assert.ok(v.cases[entry.id].length>=2);
    assert.ok(!Object.hasOwn(entry,'historical_fulfillment_proven_by_christian_reading'));
  }
  const adventist=v.cases['daniel-8-ram-goat-2300'];
  assert.ok(adventist.some(x=>x.label.includes('Seventh-day Adventist')));
  assert.ok(adventist.some(x=>x.explanation.includes('1844')));
  assert.ok(v.cases['revelation-20-21-millennium-new-jerusalem'].length>=4);
});

test('eighteen original passage-specific attestations stay distinct from broad comparison sources',()=>{
  const all=Object.values(v.cases).flat();
  assert.equal(all.length,141);
  assert.equal(all.filter(x=>x.source_level==='passage_specific_primary_statement').length,18);
  assert.equal(all.filter(x=>x.source_level==='official_doctrine_not_full_verse_exegesis').length,1);
  assert.equal(all.filter(x=>x.source_level==='general_method_or_comparative').length,122);
  for(const id of ['isaiah-7-14','isaiah-53','jeremiah-31-hebrews-8','daniel-8-ram-goat-2300',
    'daniel-9-seventy-weeks','mark-13-30-this-generation','revelation-13-beast-number',
    'revelation-20-21-millennium-new-jerusalem']){
    assert.ok(v.cases[id].some(x=>x.source_level==='passage_specific_primary_statement'));
  }
  for (const id of ["hosea-11-1","jeremiah-31-15","micah-5-2","zechariah-9-9"]) assert.ok(v.cases[id].some(x=>x.source_level==='passage_specific_primary_statement'),id);
  const cath=v.cases['revelation-20-21-millennium-new-jerusalem'][0];
  assert.equal(cath.source_level,'official_doctrine_not_full_verse_exegesis');
  assert.match(cath.explanation,/does not prescribe an exhaustive official commentary/);
  assert.match(md,/Original|original/i);
});
