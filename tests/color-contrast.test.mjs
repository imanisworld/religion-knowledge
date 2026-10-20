import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const css=fs.readFileSync('site-shell.css','utf8');
const landing=fs.readFileSync('scripts/build-reader-site.mjs','utf8');
const comparisons=fs.readFileSync('comparisons.html','utf8');

function palette(selector){
  const start=css.indexOf(selector+'{');
  assert.ok(start>=0,'Missing color palette '+selector);
  const declaration=css.slice(start+selector.length+1,css.indexOf('}',start));
  const values={};
  for (const m of declaration.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-f]{6})/gi))
    values[m[1]]=m[2];
  return values;
}
function luminance(hex){
  const rgb=[1,3,5].map(index=>{
    const val=parseInt(hex.slice(index,index+2),16)/255;
    return val<=.04045 ? val/12.92 : ((val+.055)/1.055)**2.4;
  });
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
}
function ratio(a,b){
  const [high,low]=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (high+.05)/(low+.05);
}
function readable(label,fg,bgs){
  assert.ok(fg,'Missing foreground '+label);
  for(const bg of bgs){
    assert.ok(bg,'Missing background '+label);
    const score=ratio(fg,bg);
    assert.ok(score>=4.5,label+' contrast '+score.toFixed(2)+':1 should be at least 4.5:1');
  }
}

test('public text and link palettes pass 4.5:1 in light and dark themes',()=>{
  const root=palette(':root');
  const light=palette('.rk-with-sitebar');
  const dark=palette(':root[data-theme=dark] .rk-with-sitebar');
  const darkNav=palette(':root[data-theme=dark] .rk-sitebar');
  readable('Light main secondary text',light['ink2'],[light['ground'],light['paper']]);
  readable('Light main muted text',light['ink3'],[light['ground'],light['paper'],light['accent-soft']]);
  readable('Light links',light['accent'],[light['ground'],light['paper'],light['accent-soft']]);
  readable('Light brand and metadata',root['rk-ink3'],[root['rk-ground'],root['rk-paper']]);
  readable('Light navigation',root['rk-ink2'],[root['rk-ground'],root['rk-paper']]);
  readable('Dark main secondary text',dark['ink2'],[dark['ground'],dark['paper']]);
  readable('Dark main muted text',dark['ink3'],[dark['ground'],dark['paper']]);
  readable('Dark links',dark['accent'],[dark['ground'],dark['paper'],dark['accent-soft']]);
  readable('Dark brand metadata',darkNav['rk-ink3'],[darkNav['rk-ground'],darkNav['rk-paper']]);
  readable('Dark navigation',darkNav['rk-ink2'],[darkNav['rk-ground'],darkNav['rk-paper']]);
  assert.ok(ratio(dark['rule'],dark['paper'])>=3,
    'Dark mode borders should remain visible against the reading surface');
  assert.ok(ratio(darkNav['rk-rule'],darkNav['rk-paper'])>=3,
    'Dark navigation borders should remain discernible');
  readable('Dark sitebar links',darkNav['rk-accent'],[darkNav['rk-ground'],darkNav['rk-paper']]);
});

test('the standalone comparisons page and landing use theme-aware readable colors',()=>{
  assert.ok(comparisons.includes('a{color:var(--accent)}'),
    'Comparison links must follow the theme-aware accent');
  assert.ok(landing.includes('--ink3:#6F6066'),
    'Landing root should use the readable light-mode secondary color');
});
