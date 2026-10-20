/**
 * Focused navigation for all nine core/reference readers.
 * Source HTML remains complete and linkable; enhancement only changes
 * which top-level section is displayed. Without JS, all content is readable.
 */
(() => {
  'use strict';
  const main = document.querySelector('main');
  if (!main) return;
  // Move chapter headings (which the older renderer left at the end of the
  // preceding topic) before creating navigation. All original IDs survive.
  const sourceSections = Array.from(main.querySelectorAll(':scope > section'));
  for (let i = 0; i < sourceSections.length - 1; i++) {
    const last = sourceSections[i].lastElementChild;
    if (last && last.matches('h1[id]')) sourceSections[i + 1].prepend(last);
  }

  // Introductory notes and methodology are useful reference material, but they
  // are not a reading topic. Keep them in a disclosure, without creating an
  // otherwise empty "Introduction" page in the section selector.
  const howto = main.querySelector(':scope > .howto');
  const intro = main.querySelector(':scope > #sec-intro');
  if (howto || intro) {
    const about = document.createElement('details');
    about.className = 'reader-about';
    const summary = document.createElement('summary');
    summary.textContent = 'About this document';
    (howto || intro).before(about);
    about.append(summary);
    if (howto) about.append(howto);
    if (intro) about.append(intro);
  }

  // Long chapters in History, Sources, Method & Reference, Study Notes,
  // and other readers become separate topics at existing numbered headings.
  // Keep the parent heading with the first subsection; preserve every ID.
  {
    for (const section of Array.from(main.querySelectorAll(':scope > section'))) {
      const subsections = Array.from(section.children).filter(el =>
        el.matches('h3[data-num][id]'));
      if (section.textContent.length < 7500 || subsections.length < 2) continue;
      let current = section;
      let encounteredFirst = false;
      for (const node of Array.from(section.childNodes)) {
        if (node.nodeType === 1 && node.matches('h3[data-num][id]')) {
          if (encounteredFirst) {
            const next = document.createElement('section');
            next.id = 'read-' + node.id;
            current.after(next);
            current = next;
          }
          encounteredFirst = true;
        }
        if (current !== section) current.append(node);
      }
    }
  }
  const sections = Array.from(main.querySelectorAll(':scope > section'));
  if (!sections.length) return;

  const search = document.querySelector('#search');
  const noResults = document.querySelector('#nores');
  const toc = document.querySelector('#toc');
  const locationLabel = document.querySelector('#reader-current');
  const hereLabel = document.querySelector('#here');
  const filters = Array.from(document.querySelectorAll('.filt'));
  let active = 0;
  let query = '';
  let auditStatus = '';

  function heading(section) {
    return section.querySelector(':scope > h2[id]') ||
      section.querySelector(':scope > h1[id]') ||
      section.querySelector(':scope > h3[id]') ||
      section.querySelector('h2[id],h1[id],h3[id]') || section;
  }

  function title(section, index) {
    const target = heading(section);
    return (target.textContent || 'Section ' + index).replace(/\s+/g, ' ').trim();
  }

  const names = sections.map(title);
  // Remember the last reading topic in this tab, separately for each document.
  // A URL fragment always wins over saved progress, especially when following
  // a cited passage from another reader. No history/hash is rewritten on load.
  const readerProgressKey = 'religion-reader-topic:' + location.pathname;
  function saveCurrentTopic(index) {
    try { sessionStorage.setItem(readerProgressKey, sections[index].id); } catch (_) {}
  }
  function previousTopicIndex() {
    let id = '';
    try { id = sessionStorage.getItem(readerProgressKey) || ''; } catch (_) {}
    return id ? sections.findIndex(section => section.id === id) : -1;
  }
  sections.forEach((section, i) => {
    section.tabIndex = 0;
    section.setAttribute('role', 'region');
    section.setAttribute('aria-label', names[i]);
  });
  const wrapper = document.createElement('nav');
  wrapper.className = 'reader-section-nav';
  wrapper.setAttribute('aria-label', 'Reading section');
  wrapper.innerHTML =
    '<div class="reader-section-title">Read one section at a time</div>' +
    '<div class="reader-section-controls">' +
      '<label for="reader-section-select">Choose a topic</label>' +
      '<select id="reader-section-select" aria-label="Choose a reading section"></select>' +
      '<button type="button" class="reader-prev">Previous</button>' +
      '<button type="button" class="reader-next">Next</button>' +
    '</div>' +
    '<p class="reader-section-status" role="status" aria-live="polite"></p>';

  const select = wrapper.querySelector('select');
  let chapterGroup = null;
  sections.forEach((section, index) => {
    const chapter = section.querySelector(':scope > h1[id]');
    if (chapter) {
      chapterGroup = document.createElement('optgroup');
      chapterGroup.label = chapter.textContent.trim();
      select.append(chapterGroup);
    }
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = names[index];
    (chapterGroup || select).append(option);
  });
  main.insertBefore(wrapper, sections[0]);

  // The reader should also have navigation after the selected section.
  const footer = document.createElement('nav');
  footer.className = 'reader-section-footer';
  footer.setAttribute('aria-label', 'Next or previous section');
  footer.innerHTML =
    '<button type="button" class="reader-prev">Previous section</button>' +
    '<span class="reader-footer-count" aria-hidden="true"></span>' +
    '<button type="button" class="reader-next">Next section</button>';
  sections[sections.length - 1].after(footer);

  const controls = [wrapper, footer];
  const options = Array.from(select.options);

  function matching(index) {
    const section = sections[index];
    return (!query || section.textContent.toLocaleLowerCase().includes(query)) &&
      (!auditStatus || !!section.querySelector('.audit[data-status="' + auditStatus + '"]'));
  }
  function available() {
    return sections.map((_, index) => index).filter(matching);
  }
  function ancestorSection(target) {
    let element = target;
    while (element && element !== main) {
      if (element.parentElement === main && element.tagName === 'SECTION') return element;
      element = element.parentElement;
    }
    return null;
  }
  function targetFromHash() {
    const hash = decodeURIComponent(location.hash.replace(/^#/, ''));
    return hash ? document.getElementById(hash) : null;
  }
  function sectionFromTarget(target) {
    const section = target && ancestorSection(target);
    return section ? sections.indexOf(section) : -1;
  }
  function firstAnchor(index) {
    const target = heading(sections[index]);
    return target.id || sections[index].id;
  }
  function show(index, { navigate = false, scroll = false } = {}) {
    if (index < 0 || index >= sections.length) return;
    active = index;
    saveCurrentTopic(index);
    const hits = available();
    sections.forEach((section, i) => {
      section.hidden = hits.length === 0 || i !== index;
      section.setAttribute('aria-hidden', String(hits.length === 0 || i !== index));
      section.classList.remove('dim');
    });
    options.forEach((option, i) => { option.disabled = !matching(i); });
    select.value = String(index);
    const position = hits.indexOf(index);
    const state = query || auditStatus
      ? (position < 0 ? 'No matching section' : 'Match ' + (position + 1) + ' of ' + hits.length)
      : 'Section ' + (index + 1) + ' of ' + sections.length;
    wrapper.querySelector('.reader-section-status').textContent = state + ' · ' + names[index];
    footer.querySelector('.reader-footer-count').textContent = state;
    if (locationLabel) locationLabel.textContent = names[index];
    if (hereLabel) hereLabel.textContent = names[index];
    controls.forEach(control => {
      control.querySelectorAll('.reader-prev').forEach(button => {
        button.disabled = !hits.some(i => i < index);
      });
      control.querySelectorAll('.reader-next').forEach(button => {
        button.disabled = !hits.some(i => i > index);
      });
    });
    if (toc) {
      toc.querySelectorAll('a[href^="#"]').forEach(link => {
        const anchor = link.getAttribute('href').slice(1);
        const target = anchor && document.getElementById(decodeURIComponent(anchor));
        link.classList.toggle('here', !!target && sectionFromTarget(target) === index);
        const linkedSection = sectionFromTarget(target);
        link.classList.toggle('dim', !!(query || auditStatus) &&
          (linkedSection < 0 || !matching(linkedSection)));
      });
    }
    noResults.style.display = hits.length ? 'none' : 'block';
    if (navigate || scroll) {
      // Navigating should always begin at the top of the newly selected
      // reading pane rather than retaining a previous section's scroll.
      sections[index].scrollTop = 0;
    }
    if (navigate) {
      const hash = firstAnchor(index);
      if (hash) history.pushState({ readerSection: index }, '', '#' + encodeURIComponent(hash));
    }
    if (scroll) {
      // Return to the reader controls, rather than the document masthead.
      if (!window.matchMedia('(min-width:900px) and (min-height:640px)').matches) {
        wrapper.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    }
  }
  function move(direction) {
    const hits = available();
    const next = direction < 0 ? hits.filter(i => i < active).pop() :
      hits.find(i => i > active);
    if (next !== undefined) show(next, { navigate: true, scroll: true });
  }
  controls.forEach(control => {
    control.querySelector('.reader-prev').addEventListener('click', () => move(-1));
    control.querySelector('.reader-next').addEventListener('click', () => move(1));
  });
  select.addEventListener('change', () => show(Number(select.value), { navigate: true, scroll: true }));

  function updateFilter() {
    const hits = available();
    if (hits.length && !hits.includes(active)) show(hits[0], { scroll: false });
    else show(active, { scroll: false });
  }
  // The original document search dims all sections. This reader replaces that
  // behavior with filtered page navigation while retaining the full source DOM.
  if (search) {
    search.addEventListener('input', event => {
      event.stopImmediatePropagation();
      query = search.value.trim().toLocaleLowerCase();
      updateFilter();
    }, true);
  }
  filters.forEach(button => {
    button.addEventListener('click', event => {
      event.stopImmediatePropagation();
      const next = auditStatus === button.dataset.st ? '' : button.dataset.st;
      auditStatus = next;
      filters.forEach(b => b.classList.toggle('on', b.dataset.st === next && !!next));
      if (auditStatus) {
        sections.forEach(section => section.querySelectorAll('.audit').forEach(audit => {
          audit.open = audit.dataset.status === auditStatus;
        }));
      }
      updateFilter();
    }, true);
  });

  function openHashTarget({ scroll = true } = {}) {
    const target = targetFromHash();
    if (target && target.closest('.reader-about')) {
      target.closest('.reader-about').open = true;
      show(0);
      if (scroll) target.scrollIntoView({ block: 'start', behavior: 'auto' });
      return true;
    }
    const index = sectionFromTarget(target);
    if (index === -1) return false;
    if ((query || auditStatus) && !matching(index)) {
      query = ''; auditStatus = '';
      if (search) search.value = '';
      filters.forEach(button => button.classList.remove('on'));
    }
    show(index);
    if (scroll && target) target.scrollIntoView({ block: 'start', behavior: 'auto' });
    return true;
  }
  // Reveal hidden sections synchronously before native in-page anchor jumps.
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = decodeURIComponent(anchor.getAttribute('href').slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target && target.closest('.reader-about')) {
      target.closest('.reader-about').open = true;
      show(0);
      return;
    }
    const index = sectionFromTarget(target);
    if (index < 0) return;
    if ((query || auditStatus) && !matching(index)) {
      query = ''; auditStatus = '';
      if (search) search.value = '';
      filters.forEach(button => button.classList.remove('on'));
    }
    show(index);
    if (toc && toc.contains(anchor) && window.innerWidth < 1080) {
      document.querySelector('#rail')?.classList.remove('open');
      document.querySelector('#overlay')?.classList.remove('show');
    }
  }, true);
  window.addEventListener('hashchange', () => openHashTarget());
  window.addEventListener('popstate', () => {
    if (!openHashTarget()) show(0);
  });

  // Show the action explicitly; the default remains light when there is no
  // stored user preference. Existing user theme choices remain respected.
  const themeButton = document.querySelector('#themebtn');
  if (themeButton) {
    const updateThemeLabel = () => {
      const isDark = document.documentElement.dataset.theme === 'dark';
      themeButton.textContent = isDark ? 'Switch to light' : 'Switch to dark';
      themeButton.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    };
    updateThemeLabel();
    themeButton.addEventListener('click', updateThemeLabel);
  }

  // The selected section is the scrolling region on laptop-sized screens.
  // Report progress for that region rather than only for the page itself.
  const progressBar = document.querySelector('#progress i');
  sections.forEach(section => section.addEventListener('scroll', () => {
    if (!progressBar || section.hidden) return;
    const remaining = section.scrollHeight - section.clientHeight;
    progressBar.style.width = (remaining > 0 ? section.scrollTop / remaining * 100 : 100) + '%';
  }, { passive: true }));

  document.documentElement.classList.add('reader-paginated');
  if (!openHashTarget({ scroll: false })) {
    const previous = previousTopicIndex();
    show(previous >= 0 ? previous : 0);
  }
  if (location.hash) requestAnimationFrame(() => openHashTarget());
})();
