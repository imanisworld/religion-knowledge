import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const canon=fs.readFileSync('Cited_Persons.md','utf8');
const html=fs.readFileSync('cited-persons.html','utf8');
const search=JSON.parse(fs.readFileSync('search-index.json','utf8'));

const cases=[
  ['Metzger, Bruce','person-metzger-bruce',['1989 NRSV','NRSVue']],
  ['Munro, Winsome','person-munro-winsome',['Biblical Theology Bulletin','161–168']],
  ['Nix, William','person-nix-william',['Norman L. Geisler']],
  ['Moo, Douglas','person-moo-douglas',['permitting disobedience']],
  ['Pliny the Younger','person-pliny-the-younger',['torture of two women']],
  ['Walk, Richard','person-walk-richard',['Eleanor J. Gibson']],
  ['Walls, Jerry','person-walls-jerry',['David Baggett']],
  ['Wason, Peter','person-wason-peter',['6 of 29']],
  ['Watson and Rayner','person-watson-and-rayner',['31 days']],
  ['Wenham, John','person-wenham-john',['1967','Gordon J. Wenham']],
  ['Trobisch, David','person-trobisch-david',['2023','contested hypothesis']],
];

function personHtml(id){
  const match=html.match(new RegExp('<p id="'+id+'">([\\s\\S]*?)<\\/p>'));
  assert.ok(match,'Missing rendered person '+id);
  return match[1].replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/\s+/g,' ').trim();
}

test('corrected claims and warnings remain visible in canonical text, public profiles and search',()=>{
  for(const [name,id,phrases] of cases){
    const original=canon.split('\n').find(line=>line.startsWith('⟨UNRESOLVED⟩ **'+name+'**'));
    assert.ok(original,'Missing canonical line for '+name);
    const publicText=personHtml(id);
    assert.match(publicText,/Unresolved:/,'No source warning: '+name);
    assert.match(publicText,/Source review incomplete/,'No source status: '+name);
    const indexed=search.find(entry=>entry.url==='cited-persons.html#'+id);
    assert.ok(indexed,'Missing search entry '+name);
    assert.equal(indexed.flag,true,'Missing search source flag '+name);
    for(const phrase of phrases){
      assert.ok(original.includes(phrase),name+' missing canonical: '+phrase);
      assert.ok(publicText.includes(phrase),name+' missing public text: '+phrase);
      assert.ok(indexed.text.includes(phrase),name+' missing search text: '+phrase);
    }
  }
});

test('known false legacy claims do not reappear in public biographies',()=>{
  const avoid=[
    ['person-metzger-bruce','preface to the NRSV/NRSVue'],
    ['person-munro-winsome','(<em>JSNT</em>'],
    ['person-moo-douglas','straightforward mandate for civil obedience'],
    ['person-pliny-the-younger','Disinterested source'],
    ['person-wason-peter','Showed subjects overwhelmingly seek confirming instances and never attempt to falsify'],
    ['person-watson-and-rayner','neither strong nor lasting'],
    ['person-wenham-john','proposals (1967, 1981)'],
    ['person-trobisch-david','Scripture</em> (2024)'],
  ];
  for(const [id,wrong] of avoid){
    assert.ok(!personHtml(id).includes(wrong),id+' still has old claim: '+wrong);
  }
});

test('public correction batch leaves all 365 original statuses unchanged',()=>{
  const lines=canon.split('\n');
  assert.equal(lines.filter(row=>row.startsWith('⟨DOCUMENTED⟩')).length,194);
  assert.equal(lines.filter(row=>row.startsWith('⟨UNRESOLVED⟩')).length,171);
});
