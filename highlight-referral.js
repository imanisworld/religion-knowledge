/* highlight-referral.js — loaded by every reader page.
   Reads ?hl=TERM from the URL (set by search.html), highlights all
   text matches in <main>, shows a dismissible toast with prev/next nav. */
(function () {
  const q = new URLSearchParams(location.search).get('hl');
  if (!q) return;

  /* Clean the ?hl= out of the URL bar immediately */
  history.replaceState(null, '', location.pathname + (location.hash || ''));

  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return;

  const re = new RegExp(
    '(' + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')',
    'gi'
  );

  function walk(node) {
    if (node.nodeType === 3) {
      const t = node.textContent;
      if (!re.test(t)) return;
      re.lastIndex = 0;
      const frag = document.createDocumentFragment();
      t.split(re).forEach((s, i) => {
        if (i % 2 === 1) {
          const m = document.createElement('mark');
          m.textContent = s;
          m.className = 'hl-ref';
          frag.appendChild(m);
        } else if (s) {
          frag.appendChild(document.createTextNode(s));
        }
      });
      node.parentNode.replaceChild(frag, node);
    } else if (
      node.nodeType === 1 &&
      !['MARK', 'SCRIPT', 'STYLE', 'INPUT', 'TEXTAREA', 'NAV'].includes(node.tagName)
    ) {
      [...node.childNodes].forEach(walk);
    }
  }

  function doHighlight() {
    const main = document.querySelector('main') || document.body;
    walk(main);

    const marks = Array.from(document.querySelectorAll('mark.hl-ref'));
    if (!marks.length) return;

    const style = document.createElement('style');
    style.textContent =
      'mark.hl-ref{background:#FEF9C3;color:inherit;border-radius:2px;padding:0 1px}' +
      'mark.hl-ref.hl-cur{background:#FDE047;outline:2px solid #CA8A04;border-radius:2px}' +
      '#hl-toast{position:fixed;bottom:5.5rem;right:1.5rem;z-index:100;' +
        'background:#FEF9C3;border:1px solid #D4A017;border-radius:6px;' +
        'padding:.55rem .8rem;font-family:monospace;font-size:.78rem;' +
        'box-shadow:0 2px 10px rgba(0,0,0,.18);display:flex;align-items:center;' +
        'gap:.55rem;color:#5a4005;white-space:nowrap}' +
      '#hl-toast .hl-label{max-width:160px;overflow:hidden;text-overflow:ellipsis}' +
      '#hl-toast .hl-nav{display:flex;align-items:center;gap:.3rem}' +
      '#hl-toast .hl-pos{font-size:.72rem;min-width:3.5rem;text-align:center}' +
      '#hl-toast button{background:none;border:1px solid #D4A017;border-radius:3px;' +
        'cursor:pointer;font-size:.8rem;padding:.1rem .4rem;color:#7A5510;' +
        'line-height:1.4;flex-shrink:0}' +
      '#hl-toast button.hl-x{border:none;font-size:1rem;padding:0 .1rem}' +
      '#hl-toast button:hover{background:#FDE68A}';
    document.head.appendChild(style);

    let cur = 0;

    function goTo(idx) {
      marks[cur].classList.remove('hl-cur');
      cur = (idx + marks.length) % marks.length;
      marks[cur].classList.add('hl-cur');
      marks[cur].scrollIntoView({ behavior: 'smooth', block: 'center' });
      posEl.textContent = (cur + 1) + ' / ' + marks.length;
    }

    const toast = document.createElement('div');
    toast.id = 'hl-toast';

    const labelEl = document.createElement('span');
    labelEl.className = 'hl-label';
    labelEl.title = 'Matches for "' + q.trim() + '"';
    labelEl.innerHTML = '&#128269; "' + escQ(q.trim()) + '"';

    const navEl = document.createElement('span');
    navEl.className = 'hl-nav';

    const prevBtn = document.createElement('button');
    prevBtn.textContent = '◀';
    prevBtn.title = 'Previous match';
    prevBtn.setAttribute('aria-label', 'Previous highlighted match');
    prevBtn.addEventListener('click', () => goTo(cur - 1));

    const posEl = document.createElement('span');
    posEl.className = 'hl-pos';
    posEl.textContent = '1 / ' + marks.length;
    posEl.setAttribute('aria-live', 'polite');

    const nextBtn = document.createElement('button');
    nextBtn.textContent = '▶';
    nextBtn.title = 'Next match';
    nextBtn.setAttribute('aria-label', 'Next highlighted match');
    nextBtn.addEventListener('click', () => goTo(cur + 1));

    const closeBtn = document.createElement('button');
    closeBtn.className = 'hl-x';
    closeBtn.textContent = '×';
    closeBtn.title = 'Clear highlights';
    closeBtn.setAttribute('aria-label', 'Clear search highlights');
    closeBtn.addEventListener('click', () => {
      marks.forEach(m => m.replaceWith(document.createTextNode(m.textContent)));
      toast.remove();
    });

    navEl.append(prevBtn, posEl, nextBtn);
    toast.append(labelEl, navEl, closeBtn);
    document.body.appendChild(toast);

    /* Jump to first match */
    requestAnimationFrame(() => goTo(0));

    /* Keyboard: n = next, p = prev while toast is visible */
    document.addEventListener('keydown', function onKey(e) {
      if (!document.getElementById('hl-toast')) {
        document.removeEventListener('keydown', onKey);
        return;
      }
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); goTo(cur + 1); }
      if (e.key === 'p' || e.key === 'P') { e.preventDefault(); goTo(cur - 1); }
    });
  }

  function escQ(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doHighlight);
  } else {
    doHighlight();
  }
})();

/* Reader chrome state: expose navigation/theme state without changing the
   generated reader markup or duplicating its behavior. */
(function () {
  const menu = document.getElementById('menu');
  const rail = document.getElementById('rail');
  const themeButton = document.getElementById('themebtn');
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  if (menu && rail) {
    const syncMenu = () => menu.setAttribute('aria-expanded', String(rail.classList.contains('open')));
    syncMenu();
    new MutationObserver(syncMenu).observe(rail, { attributes: true, attributeFilter: ['class'] });
  }

  if (themeButton) {
    const effectiveTheme = () => {
      const explicit = document.documentElement.dataset.theme;
      if (explicit === 'dark' || explicit === 'light') return explicit;
      return media.matches ? 'dark' : 'light';
    };
    const syncTheme = () => {
      const dark = effectiveTheme() === 'dark';
      const next = dark ? 'light' : 'dark';
      themeButton.textContent = next === 'dark' ? 'Dark' : 'Light';
      themeButton.setAttribute('aria-label', `Switch to ${next} mode`);
      themeButton.setAttribute('title', `Switch to ${next} mode`);
      themeButton.setAttribute('aria-pressed', String(dark));
    };
    syncTheme();
    new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (typeof media.addEventListener === 'function') media.addEventListener('change', syncTheme);
  }
})();

/* Reader presentation polish: reduce repeated chrome without altering the
   research source files or generated reader structure. */
(function () {
  if (!document.body.classList.contains('rk-reader-page')) return;

  const sitebarInner = document.querySelector('.rk-sitebar-inner');
  const themeButton = document.getElementById('themebtn');
  if (themeButton && sitebarInner && themeButton.parentElement !== sitebarInner) {
    themeButton.classList.remove('tbtn');
    themeButton.classList.add('rk-site-control', 'rk-reader-theme');
    sitebarInner.appendChild(themeButton);
  }

  const masthead = document.querySelector('.masthead');
  const mastheadTitle = masthead?.querySelector('h1');
  const railSub = document.querySelector('#rail .docsub');
  if (masthead && mastheadTitle && railSub && !masthead.querySelector('.reader-deck')) {
    const deck = document.createElement('p');
    deck.className = 'reader-deck';
    deck.textContent = railSub.textContent.trim();
    mastheadTitle.insertAdjacentElement('afterend', deck);
  }

  const search = document.getElementById('search');
  if (search) search.placeholder = 'Search this document…';

  const wrapAbout = (container, title, subtitle) => {
    if (!container || container.querySelector(':scope > .reader-intro')) return null;
    const details = document.createElement('details');
    details.className = 'reader-intro';

    const summary = document.createElement('summary');
    const labels = document.createElement('span');
    labels.className = 'reader-intro-labels';

    const heading = document.createElement('strong');
    heading.textContent = title;
    const sub = document.createElement('small');
    sub.textContent = subtitle;
    labels.append(heading, sub);
    summary.appendChild(labels);

    const body = document.createElement('div');
    body.className = 'reader-intro-body';
    while (container.firstChild) body.appendChild(container.firstChild);

    details.append(summary, body);
    container.appendChild(details);
    return details;
  };

  const intro = document.getElementById('sec-intro');
  let introDetails = null;
  if (intro) {
    intro.classList.add('reader-intro-section');
    introDetails = wrapAbout(
      intro,
      'About this document',
      'Provenance, scope, reading context, and marker definitions'
    );

    const duplicateHowto = document.querySelector('main > .howto');
    if (duplicateHowto) duplicateHowto.remove();

    const hl = new URLSearchParams(location.search).get('hl');
    if (hl && introDetails) introDetails.open = true;
  }

  const docName = document.querySelector('.reader-doc')?.textContent.trim();
  if (docName === 'Cited Persons') {
    document.body.classList.add('rk-cited-persons-page');
    if (search) search.placeholder = 'Search name, field, affiliation, or flag…';

    const howto = document.querySelector('main > .howto');
    if (howto) {
      const holder = document.createElement('div');
      howto.insertAdjacentElement('beforebegin', holder);
      while (howto.firstChild) holder.appendChild(howto.firstChild);
      howto.remove();
      wrapAbout(holder, 'About this index', 'Purpose, source context, and flagging rules');
      holder.className = 'cited-intro-holder';
    }
  }

  if (search && introDetails) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      if (q && intro.textContent.toLowerCase().includes(q)) introDetails.open = true;
    });
  }

  const toolsBar = document.getElementById('tools');
  if (toolsBar?.querySelector('.filt') && !toolsBar.querySelector('.reader-tool-label')) {
    const label = document.createElement('span');
    label.className = 'reader-tool-label';
    label.textContent = 'Audits';
    toolsBar.insertBefore(label, toolsBar.firstChild);
  }
})();
