(() => {
  const records = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS)
    ? window.RELIGION_KNOWLEDGE_RECORDS
    : [];
  const view = document.getElementById('view-sources');
  if (!view) return;

  const canonical = [
    ['Bible_Deep_Dive_Master_Notes.md', 'Study Notes', 'master-notes.html'],
    ['Field_Guide_Conversation_Reference.md', 'Observations', 'field-guide.html'],
    ['Glossary.md', 'Glossary', 'glossary.html'],
    ['Historical_Framework.md', 'Historical Framework', 'history.html'],
    ['Method_and_Reference.md', 'Method & Reference', 'method-reference.html'],
    ['Sources_and_Primary_Texts.md', 'Sources & Primary Texts', 'sources.html'],
    ['The_Other_Side.md', 'The Strongest Case', 'other-side.html'],
    ['Translations.md', 'Translations', 'translations.html'],
  ];

  const embeddedSources = window.RELIGION_KNOWLEDGE_SOURCE_URIS && typeof window.RELIGION_KNOWLEDGE_SOURCE_URIS === 'object'
    ? window.RELIGION_KNOWLEDGE_SOURCE_URIS
    : null;

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const library = document.createElement('section');
  library.className = 'section-block';
  library.id = 'source-library';
  library.setAttribute('aria-label', 'Canonical source documents');

  const cards = canonical.map(([file, title, reader]) => {
    const fileRecords = records.filter((record) => record.source_file === file);
    const review = fileRecords.filter((record) => record.review_required || record.provenance_type === 'REVIEW_REQUIRED').length;
    const embedded = embeddedSources && embeddedSources[file];
    const href = embedded || `../${encodeURIComponent(reader || file)}`;
    const linkLabel = embedded ? 'Open source (offline copy)' : (reader ? 'Open reader' : 'Open original');
    return `
      <article class="record-card source-library-card" data-source-library-file="${escapeHtml(file)}">
        <div class="record-meta"><span class="badge source">CANONICAL SOURCE</span></div>
        <h3>${escapeHtml(title)}</h3>
        <p>${fileRecords.length} records · ${review} review required</p>
        <p class="record-source">${escapeHtml(file)}</p>
        <div class="dialog-actions">
          <button class="secondary-button" type="button" data-browse-source="${escapeHtml(file)}">Browse records</button>
          <a class="secondary-button" href="${href}" target="_blank" rel="noopener" data-open-canonical-source="${escapeHtml(file)}">${linkLabel}</a>
        </div>
      </article>`;
  }).join('');

  library.innerHTML = `
    <div class="section-heading stacked">
      <div>
        <p class="eyebrow">Canonical documents</p>
        <h2>Source Library</h2>
      </div>
      <p class="muted">Browse records by original document or open the untouched Markdown source.</p>
    </div>
    <div class="card-list">${cards}</div>
    <div class="section-heading stacked">
      <div>
        <p class="eyebrow">Extracted evidence</p>
        <h2>Source Claims</h2>
      </div>
    </div>`;

  const sourcesList = document.getElementById('sources-list');
  view.insertBefore(library, sourcesList);

  document.addEventListener('click', (event) => {
    const browse = event.target.closest('[data-browse-source]');
    if (!browse) return;
    const file = browse.dataset.browseSource;
    const search = document.getElementById('search-input');
    if (!search) return;
    search.value = file;
    search.dispatchEvent(new Event('input', { bubbles: true }));
  });
})();

/* App chrome/accessibility hardening. This script intentionally runs after app.js
   so it can expose state without changing routing or data behavior. */
(() => {
  const search = document.getElementById('search-input');
  const topicSearch = document.getElementById('topic-search');
  const filterButton = document.getElementById('filter-button');
  const recordDialog = document.getElementById('record-dialog');
  const segmented = document.querySelector('.segmented[role="tablist"]');
  const aiButtons = [...document.querySelectorAll('[data-ai]')];
  const navItems = [...document.querySelectorAll('.nav-item[data-view]')];
  const moreButton = document.getElementById('nav-more');
  const themeButton = document.getElementById('theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const hiddenBottomViews = new Set(['topics', 'questions', 'sources', 'ai', 'compare', 'positions']);

  if (search && !search.getAttribute('aria-label')) search.setAttribute('aria-label', 'Search records, topics, questions, and sources');
  if (topicSearch && !topicSearch.getAttribute('aria-label')) topicSearch.setAttribute('aria-label', 'Filter topics');
  if (filterButton && !filterButton.getAttribute('aria-controls')) filterButton.setAttribute('aria-controls', 'filter-panel');
  if (recordDialog && !recordDialog.getAttribute('aria-labelledby')) recordDialog.setAttribute('aria-labelledby', 'dialog-title');

  if (segmented) {
    segmented.setAttribute('role', 'group');
    aiButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    const syncAi = () => aiButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.classList.contains('active'))));
    const aiObserver = new MutationObserver(syncAi);
    aiButtons.forEach((button) => aiObserver.observe(button, { attributes: true, attributeFilter: ['class'] }));
  }

  const syncNav = () => {
    const activeView = document.querySelector('.view.active')?.id?.replace(/^view-/, '') || 'home';
    navItems.forEach((item) => {
      const current = item.dataset.view === activeView;
      if (current) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    if (moreButton) {
      const current = hiddenBottomViews.has(activeView);
      moreButton.classList.toggle('active', current);
      if (current) moreButton.setAttribute('aria-current', 'page');
      else moreButton.removeAttribute('aria-current');
    }
  };
  syncNav();
  const navObserver = new MutationObserver(syncNav);
  document.querySelectorAll('.view').forEach((view) => navObserver.observe(view, { attributes: true, attributeFilter: ['class'] }));

  const effectiveTheme = () => {
    const explicit = document.documentElement.dataset.theme;
    return explicit === 'dark' ? 'dark' : 'light';
  };
  const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>';
  const syncTheme = () => {
    if (!themeButton) return;
    const dark = effectiveTheme() === 'dark';
    const next = dark ? 'light' : 'dark';
    themeButton.innerHTML = dark ? sunIcon : moonIcon;
    themeButton.setAttribute('aria-label', `Switch to ${next} mode`);
    themeButton.setAttribute('title', `Switch to ${next} mode`);
    themeButton.setAttribute('aria-pressed', String(dark));
    if (themeMeta) themeMeta.setAttribute('content', dark ? '#141012' : '#F4F2F1');
  };
  syncTheme();
  new MutationObserver(syncTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  const searchIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.7-3.7"/></svg>';
  document.querySelectorAll('.search-box > span[aria-hidden="true"]').forEach((icon) => {
    if (icon.textContent.trim() === '⌕') icon.innerHTML = searchIcon;
  });
})();
