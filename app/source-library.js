(() => {
  const records = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS)
    ? window.RELIGION_KNOWLEDGE_RECORDS
    : [];
  const view = document.getElementById('view-sources');
  if (!view) return;

  const canonical = [
    ['Bible_Deep_Dive_Master_Notes.md', 'Master Notes', 'master-notes.html'],
    ['Field_Guide_Conversation_Reference.md', 'Field Guide', 'field-guide.html'],
    ['Glossary.md', 'Glossary', 'glossary.html'],
    ['Historical_Framework.md', 'Historical Framework', 'history.html'],
    ['Sources_and_Primary_Texts.md', 'Sources & Primary Texts', 'sources.html'],
    ['The_Other_Side.md', 'The Other Side', 'other-side.html'],
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
