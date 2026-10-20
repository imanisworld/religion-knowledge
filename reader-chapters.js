/**
 * Focused navigation for the Study Notes and Observations readers.
 * Source HTML remains complete and linkable; enhancement only changes
 * which top-level section is displayed. Without JS, all content is readable.
 */
(() => {
  'use strict';
  const main = document.querySelector('main');
  if (!main) return;
  // An unusually long Study Notes section can still feel endless. Split it
  // at existing numbered subsection headings; preserve all original anchors,
  // audits, prose and related links without copying or truncating content.
  if (document.title.includes('Study Notes')) {
    for (const section of Array.from(main.querySelectorAll(':scope > section'))) {
      const subsections = Array.from(section.children).filter(el =>
        el.matches('h3[data-num][id]'));
      if (section.textContent.length < 8500 || subsections.length < 2) continue;
      let current = section;
      for (const node of Array.from(section.childNodes)) {
        if (node.nodeType === 1 && node.matches('h3[data-num][id]')) {
          const next = document.createElement('section');
          next.id = 'read-' + node.id;
          current.after(next);
          current = next;
        }
        if (current !== section) current.append(node);
      }
    }
  }
  const sections = Array.from(main.querySelectorAll(':scope > section'));
  if (sections.length < 2) return;

  // The legacy Observations renderer sometimes puts the next chapter heading
  // at the end of the preceding section. Place only trailing headings with
  // their first topic, preserving every existing ID and linked passage.
  for (let i = 0; i < sections.length - 1; i += 1) {
    const current = sections[i];
    const last = current.lastElementChild;
    if (last && last.matches('h1[id]')) sections[i + 1].prepend(last);
  }

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
    if (index === 0) return 'Introduction';
    const target = heading(section);
    return (target.textContent || 'Section ' + index).replace(/\s+/g, ' ').trim();
  }

  const names = sections.map(title);
  const wrapper = document.createElement('nav');
  wrapper.className = 'reader-section-nav';
  wrapper.setAttribute('aria-label', 'Reading section');
  wrapper.innerHTML =
    '<div class="reader-section-title">Read one section at a time</div>' +
    '<div class="reader-section-controls">' +
      '<label for="reader-section-select">Choose a section</label>' +
      '<select id="reader-section-select" aria-label="Choose a reading section"></select>' +
      '<button type="button" class="reader-prev">Previous</button>' +
      '<button type="button" class="reader-next">Next</button>' +
    '</div>' +
    '<p class="reader-section-status" role="status" aria-live="polite"></p>';

  const select = wrapper.querySelector('select');
  let chapterGroup = null;
  sections.forEach((section, index) => {
    const chapter = section.querySelector(':scope > h1[id]');
    if (chapter && index > 0) {
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
    const hits = available();
    sections.forEach((section, i) => {
      section.hidden = hits.length === 0 || i !== index;
      section.setAttribute('aria-hidden', String(i !== index));
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
    if (navigate) {
      const hash = firstAnchor(index);
      if (hash) history.pushState({ readerSection: index }, '', '#' + encodeURIComponent(hash));
    }
    if (scroll) {
      // Return to the reader controls, rather than the document masthead.
      wrapper.scrollIntoView({ block: 'start', behavior: 'auto' });
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
    const index = sectionFromTarget(target);
    if (index === -1) return false;
    if ((query || auditStatus) && !matching(index)) {
      query = ''; auditStatus = '';
      if (search) search.value = '';
      filters.forEach(button => button.classList.remove('on'));
    }
    show(index);
    if (scroll && target) target.scrollIntoView({ block: 'start' });
    return true;
  }
  // Reveal hidden sections synchronously before native in-page anchor jumps.
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[href^="#"]');
    if (!anchor) return;
    const id = decodeURIComponent(anchor.getAttribute('href').slice(1));
    if (!id) return;
    const target = document.getElementById(id);
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

  document.documentElement.classList.add('reader-paginated');
  if (!openHashTarget({ scroll: false })) show(0);
  if (location.hash) requestAnimationFrame(() => openHashTarget());
})();
