import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const html=fs.readFileSync('gender-over-time.html','utf8');
function palette(selector){
  const start=html.indexOf(selector+'{');
  assert.ok(start>=0,'Missing gender page palette '+selector);
  const decl=html.slice(start+selector.length+1,html.indexOf('}',start));
  return Object.fromEntries([...decl.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-f]{6})/gi)].map(m=>[m[1],m[2]]));
}
function luminance(hex){
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  const linear=rgb.map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return .2126*linear[0]+.7152*linear[1]+.0722*linear[2];
}
function ratio(a,b){
  const [high,low]=[luminance(a),luminance(b)].sort((x,y)=>y-x);
  return (high+.05)/(low+.05);
}
test('gender page uses page-scoped neutral light and dark palettes with 7:1 small-text contrast',()=>{
  const palettes=[palette('body.rk-gender-page'),palette(':root[data-theme=dark] body.rk-gender-page')];
  assert.ok(html.includes('<body class="rk-with-sitebar rk-gender-page">'));
  for(const c of palettes) for(const fg of ['ink2','ink3','accent'])
    for(const bg of ['ground','paper','soft']){
      const contrast=ratio(c[fg],c[bg]);
      assert.ok(contrast>=7,fg+' on '+bg+' contrast '+contrast.toFixed(2)+':1');
    }
});
test('case descriptions and textual evidence labels are readable and not dependent on badge colors',()=>{
  assert.ok(html.includes('.case p{margin:.7rem 0;color:var(--ink2);font-size:1rem'));
  assert.ok(html.includes('.tag.verified,.tag.interpret{color:var(--ink2);background:var(--soft)}'));
  assert.ok(html.includes('.casehead{display:flex;flex-direction:column'));
  assert.ok(html.includes('a:focus-visible,.case summary:focus-visible'));
});
