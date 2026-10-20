/* Navigate source-backed tradition profiles without rendering an endless list. */
(() => {
  const profiles = [...document.querySelectorAll('.tradition-profile')];
  const buttons = [...document.querySelectorAll('.tradition-item[data-select]')];
  const chooser = document.getElementById('traditionChooser');
  const input = document.getElementById('traditionSearch');
  const matches = document.getElementById('traditionMatches');
  const count = document.getElementById('profileCount');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const pane = document.getElementById('traditionProfiles');
  const ids = profiles.map(p => p.id);
  if (!profiles.length || profiles.length !== buttons.length) return;
  let active = 0;

  function permitted() { return buttons.map((b,i) => !b.hidden ? i : -1).filter(i => i >= 0); }
  function show(index, { hash = false, focus = false } = {}) {
    if (index < 0 || index >= profiles.length) return;
    active = index;
    profiles.forEach((p,i) => {
      p.hidden = i !== index;
      p.setAttribute('aria-hidden', String(i !== index));
    });
    buttons.forEach((b,i) => {
      b.setAttribute('aria-pressed', String(i === index));
      if (i === index && !b.hidden && window.innerWidth >= 850) b.scrollIntoView({ block:'nearest' });
    });
    const visible = permitted();
    const pos = visible.indexOf(index);
    const display = pos >= 0 ? (pos+1)+' of '+visible.length : (index+1)+' of '+profiles.length;
    count.textContent = 'Profile '+display;
    prev.disabled = !visible.some(i => i < index);
    next.disabled = !visible.some(i => i > index);
    pane.scrollTop = 0;
    if (hash) history.pushState({ tradition:ids[index] }, '', '#'+encodeURIComponent(ids[index]));
    if (focus) {
      profiles[index].focus({ preventScroll: true });
      if (window.innerWidth < 850) document.getElementById(ids[index]).scrollIntoView({ block:'start',behavior:'auto' });
      chooser.open = window.innerWidth >= 850;
    }
  }
  function move(dir) {
    const available = permitted();
    const selected = dir < 0 ? available.filter(i=>i<active).pop() : available.find(i=>i>active);
    if (selected !== undefined) show(selected,{hash:true,focus:true});
  }
  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  buttons.forEach((button,i)=>button.addEventListener('click',()=>show(i,{hash:true,focus:true})));
  input.addEventListener('input',()=>{
    const term = input.value.toLocaleLowerCase().trim();
    buttons.forEach(button=>{
      button.hidden = !!term && !button.textContent.toLocaleLowerCase().includes(term);
    });
    const available = permitted();
    matches.textContent = term ? available.length+' matching records' : '';
    if (available.length && !available.includes(active)) show(available[0]);
    else show(active);
    if (!available.length) {
      count.textContent = 'No matching traditions';
      profiles.forEach(profile => { profile.hidden = true; profile.setAttribute('aria-hidden','true'); });
      prev.disabled = next.disabled = true;
    }
  });
  function restore() {
    const hash = decodeURIComponent(location.hash.replace(/^#/,''));
    const index = ids.indexOf(hash);
    if (index >= 0) {
      // A direct link wins over an old search filter.
      if (buttons[index].hidden) { input.value=''; input.dispatchEvent(new Event('input')); }
      show(index);
      return true;
    }
    return false;
  }
  window.addEventListener('hashchange',restore);
  window.addEventListener('popstate',()=>{if(!restore())show(0)});
  document.documentElement.classList.add('traditions-enhanced');
  if (!restore()) show(0);
  // The chooser is compact on phones, open and searchable on laptops.
  if (window.innerWidth < 850) chooser.open = false;

  const theme = document.getElementById('theme');
  if (theme) theme.addEventListener('click',()=>{
    const el = document.documentElement;
    el.dataset.theme = el.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('religion-knowledge-theme',el.dataset.theme); } catch(_) {}
  });
})();
