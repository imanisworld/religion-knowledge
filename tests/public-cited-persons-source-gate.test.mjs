import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source=fs.readFileSync('Cited_Persons.md','utf8');
const publicHtml=fs.readFileSync('cited-persons.html','utf8');
const index=JSON.parse(fs.readFileSync('search-index.json','utf8'));

const cases=[
  ['person-archer-gleason','Archer, Gleason L., Jr.'],
  ['person-barton-john','Barton, John'],
  ['person-briggs-peter','Briggs, Peter'],
  ['person-macdonald-dennis-r','MacDonald, Dennis R.'],
  ['person-macintyre-alasdair','MacIntyre, Alasdair'],
];

test('the five unresolved biographies warn public readers about their source gaps',()=>{
  for(const [id,name] of cases){
    const sourceLine=source.split('\n').find(row=>row.startsWith('⟨UNRESOLVED⟩ **'+name+'**'));
    assert.ok(sourceLine,name+' must remain visibly unresolved in canonical research');
    const match=publicHtml.match(new RegExp('<p id="'+id+'">([\\s\\S]*?)<\\/p>'));
    assert.ok(match,name+' missing public biography');
    assert.match(match[1], /Unresolved|Unverified attribution|still need|still needs/i,
      name+' public biography is missing its evidence warning');
    const search=index.find(row=>row.url==='cited-persons.html#'+id);
    assert.ok(search,name+' missing indexed entry');
    assert.match(search.text,/Unresolved|Unverified attribution|still need|still needs/i,
      name+' search result hides the evidence warning');
  }
  assert.doesNotMatch(publicHtml, /Rejects the <em>eleph<\/em> proposal outright/);
  assert.doesNotMatch(publicHtml, /Challenges Harnack's thesis that Marcion provoked NT canon formation/);
  assert.doesNotMatch(publicHtml, /Applied the <em>eleph<\/em> proposal to Numbers/);
  assert.doesNotMatch(publicHtml, /circulated as an independent Jesus saying before Paul used it/);
});
