/* Progressive, hash-aware pagination for long research pages.
   All source content remains in the DOM and visible without JavaScript. */
(() => {
  'use strict';
  const TOP = 11;
  const instances = new WeakMap();

  function makeNav(label, options) {
    const nav = document.createElement('nav');
    nav.className = 'rk-topic-pager';
    nav.setAttribute('aria-label', label);
    const title = document.createElement('label');
    title.textContent = label;
    const select = document.createElement('select');
    select.setAttribute('aria-label', label);
    for (const [i, text] of options.entries()) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = text;
      select.append(opt);
    }
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.textContent = 'Previous';
    const next = document.createElement('button');
    next.type = 'button';
    next.textContent = 'Next';
    const status = document.createElement('span');
    status.className = 'rk-pager-status';
    status.setAttribute('aria-live', 'polite');
    nav.append(title, select, previous, next, status);
    return {nav, select, previous, next, status};
  }

  function clamp(value, max) {
    return Math.max(0, Math.min(max, value));
  }
  function cardName(card, index) {
    return (card.querySelector('h3, h2')?.textContent || 'Case ' + (index + 1))
      .replace(/\s+/g, ' ').trim();
  }

  function attach(root, opts = {}) {
    if (!root || instances.has(root)) return instances.get(root);
    const selector = opts.selector || ':scope > section';
    const sections = Array.from(root.querySelectorAll(selector));
    if (sections.length < 2) return null;
    sections.forEach((sec, i) => {
      if (!sec.id) sec.id = 'reading-topic-' + (i + 1);
    });
    const titles = sections.map((sec, i) => (sec.querySelector('h2,h3')?.textContent ||
      'Topic ' + (i + 1)).replace(/\s+/g, ' ').trim());
    const controls = makeNav('Choose a section', titles);
    const footer = makeNav('Section navigation', titles);
    footer.nav.classList.add('rk-topic-footer');
    const before = opts.insertBefore ? root.querySelector(opts.insertBefore) : null;
    (before || sections[0]).before(controls.nav);
    sections[sections.length - 1].after(footer.nav);

    const childPagers = new WeakMap();
    const allControls = [controls, footer];
    let active = 0;
    function paginateItems(section) {
      if (childPagers.has(section)) return childPagers.get(section);
      const cases = Array.from(section.querySelectorAll('article.case'));
      if (cases.length < 2) {
        childPagers.set(section, null);
        return null;
      }
      const nav = makeNav('Choose a case', cases.map(cardName));
      const end = makeNav('Case navigation', cases.map(cardName));
      end.nav.classList.add('rk-topic-footer');
      cases[0].before(nav.nav);
      cases[cases.length - 1].after(end.nav);
      let index = 0;
      function render() {
        cases.forEach((item, i) => { item.hidden = i !== index; });
        for (const c of [nav, end]) {
          c.select.value = String(index);
          c.previous.disabled = index === 0;
          c.next.disabled = index === cases.length - 1;
          c.status.textContent = 'Case ' + (index + 1) + ' of ' + cases.length;
        }
      }
      function set(i, changeUrl = false) {
        index = clamp(i, cases.length - 1);
        render();
        if (changeUrl) {
          const anchor = cases[index].id || cases[index].querySelector('[id]')?.id;
          if (anchor) history.pushState(null, '', '#' + encodeURIComponent(anchor));
          nav.nav.scrollIntoView({block:'start', behavior:'auto'});
        }
      }
      for (const c of [nav, end]) {
        c.previous.addEventListener('click', () => set(index - 1, true));
        c.next.addEventListener('click', () => set(index + 1, true));
        c.select.addEventListener('change', () => set(Number(c.select.value), true));
      }
      const controller = {cases, set, nav:nav.nav};
      childPagers.set(section, controller);
      render();
      return controller;
    }

    const tablePagers = [];
    function refreshTables() {
      for (const section of sections) {
        for (const tbody of section.querySelectorAll('table tbody')) {
          if (tbody.dataset.rkTablePager === 'yes') continue;
          tbody.dataset.rkTablePager = 'yes';
          const table = tbody.closest('table');
          let page = 0;
          const c = makeNav('Table rows', []);
          c.nav.classList.add('rk-table-pager');
          (table.closest('.table-wrap') || table).after(c.nav);
          c.select.hidden = true;
          c.nav.querySelector('label').textContent = 'Table results';
          function render() {
            const rows = Array.from(tbody.querySelectorAll(':scope > tr'));
            const count = Math.ceil(rows.length / TOP);
            page = clamp(page, Math.max(0, count - 1));
            rows.forEach((tr, i) => { tr.hidden = i < page * TOP || i >= (page + 1) * TOP; });
            c.nav.hidden = rows.length <= TOP;
            c.previous.disabled = page === 0;
            c.next.disabled = page >= count - 1;
            c.status.textContent = rows.length ? 'Rows ' + (page * TOP + 1) +
              '–' + Math.min(rows.length, (page + 1) * TOP) + ' of ' + rows.length : 'No rows';
          }
          c.previous.addEventListener('click', () => { page--; render(); c.nav.scrollIntoView({block:'nearest'}); });
          c.next.addEventListener('click', () => { page++; render(); c.nav.scrollIntoView({block:'nearest'}); });
          render();
          tablePagers.push(render);
        }
      }
      tablePagers.forEach(render => render());
    }

    function selectedFromHash() {
      const raw = decodeURIComponent(location.hash.slice(1));
      if (!raw || raw.includes('=')) return -1;
      const target = document.getElementById(raw);
      return target ? sections.findIndex(section => section === target || section.contains(target)) : -1;
    }
    function show(i, updateUrl = false) {
      active = clamp(i, sections.length - 1);
      sections.forEach((sec, index) => {
        sec.hidden = index !== active;
        sec.classList.toggle('rk-active-topic', index === active);
      });
      for (const c of allControls) {
        c.select.value = String(active);
        c.previous.disabled = active === 0;
        c.next.disabled = active === sections.length - 1;
        c.status.textContent = 'Section ' + (active + 1) + ' of ' + sections.length;
      }
      paginateItems(sections[active]);
      refreshTables();
      if (updateUrl) {
        history.pushState(null, '', '#' + encodeURIComponent(sections[active].id));
        controls.nav.scrollIntoView({block:'start', behavior:'auto'});
      }
    }
    function revealHash(scroll = false) {
      const id = decodeURIComponent(location.hash.slice(1));
      const sectionIndex = selectedFromHash();
      if (sectionIndex < 0) return false;
      show(sectionIndex);
      const section = sections[sectionIndex];
      const target = document.getElementById(id);
      const card = target?.closest('article.case');
      const cards = paginateItems(section);
      if (card && cards) {
        const index = cards.cases.indexOf(card);
        if (index >= 0) cards.set(index);
      }
      if (scroll && target) requestAnimationFrame(() =>
        target.scrollIntoView({block:'start', behavior:'auto'}));
      return true;
    }
    for (const c of allControls) {
      c.previous.addEventListener('click', () => show(active - 1, true));
      c.next.addEventListener('click', () => show(active + 1, true));
      c.select.addEventListener('change', () => show(Number(c.select.value), true));
    }
    document.addEventListener('click', event => {
      if (!root.isConnected) return;
      const link = event.target.closest('a[href^="#"]');
      if (!link || link.getAttribute('href').includes('=')) return;
      const anchor = decodeURIComponent(link.getAttribute('href').slice(1));
      const target = document.getElementById(anchor);
      const i = target ? sections.findIndex(sec => sec === target || sec.contains(target)) : -1;
      if (i < 0) return;
      show(i);
      const cards = paginateItems(sections[i]);
      const card = target.closest('article.case');
      if (cards && card) cards.set(cards.cases.indexOf(card));
    }, true);
    window.addEventListener('hashchange', () => { if(root.isConnected) revealHash(true); });
    window.addEventListener('popstate', () => { if(root.isConnected) revealHash(true); });
    root.classList.add('rk-research-paginated');
    if (!revealHash()) show(0);
    const api = {show, refreshTables};
    instances.set(root, api);
    return api;
  }

  // Transform markdown-rendered standalone law/state headings into compact topics.
  function attachHeadings(root) {
    if (!root) return;
    let headings = Array.from(root.children).filter(x => x.tagName === 'H2');
    if (headings.length < 2) return;
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      const next = headings[i + 1] || null;
      const wrapper = document.createElement('section');
      wrapper.className = 'rk-law-topic';
      wrapper.id = 'law-reading-' + (i + 1);
      heading.before(wrapper);
      let node = heading;
      while (node && node !== next) {
        const after = node.nextSibling;
        wrapper.append(node);
        node = after;
      }
    }
    return attach(root, {selector:':scope > section.rk-law-topic'});
  }
  window.ResearchPageNav = {attach, attachHeadings};
  function init() {
    const main = document.querySelector('main[data-research-pager]');
    if (main) { try { attach(main); } catch(error) { window.__researchPagerError=String(error)+' at '+(error.stack||''); console.error(error); } }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();