(() => {
  const records = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS)
    ? window.RELIGION_KNOWLEDGE_RECORDS
    : [];

  const READERS = {
    'Bible_Deep_Dive_Master_Notes.md': 'master-notes.html',
    'Field_Guide_Conversation_Reference.md': 'field-guide.html',
    'Glossary.md': 'glossary.html',
    'Historical_Framework.md': 'history.html',
    'Method_and_Reference.md': 'method-reference.html',
    'Sources_and_Primary_Texts.md': 'sources.html',
    'The_Other_Side.md': 'other-side.html',
    'Translations.md': 'translations.html',
  };

  function embeddedHref(sourceFile) {
    const embeddedSources = window.RELIGION_KNOWLEDGE_SOURCE_URIS && typeof window.RELIGION_KNOWLEDGE_SOURCE_URIS === 'object'
      ? window.RELIGION_KNOWLEDGE_SOURCE_URIS
      : null;
    return (embeddedSources && embeddedSources[sourceFile]) || null;
  }

  // Reader headings carry id="s<num>" anchors (dots as dashes: "3.2" → "s3-2").
  // The record's source_section breadcrumb ends in the most specific section;
  // audit sub-blocks have no leading numeral, so walk backwards to the nearest
  // numbered ancestor. No numeral anywhere → '' (link to the reader top).
  function sectionAnchor(sourceSection) {
    if (typeof sourceSection !== 'string') return '';
    const segments = sourceSection.split(' > ');
    for (let i = segments.length - 1; i >= 0; i -= 1) {
      const match = segments[i].match(/^\s*(\d+(?:\.\d+)*)[.)]?\s/);
      if (match) return `#s${match[1].replaceAll('.', '-')}`;
    }
    return '';
  }

  function safeSourceHref(sourceFile, sourceSection) {
    if (typeof sourceFile !== 'string') return null;
    if (!/^[A-Za-z0-9_.-]+\.md$/.test(sourceFile)) return null;
    const embedded = embeddedHref(sourceFile);
    if (embedded) return embedded;
    const reader = READERS[sourceFile];
    const anchor = reader ? sectionAnchor(sourceSection) : '';
    return `../${encodeURIComponent(reader || sourceFile)}${anchor}`;
  }

  function addOriginalSourceLink(recordId) {
    const record = records.find((item) => item.id === recordId);
    const body = document.getElementById('dialog-body');
    if (!record || !body || body.querySelector('[data-original-source-link]')) return;

    const href = safeSourceHref(record.source_file, record.source_section);
    if (!href) return;

    const section = document.createElement('section');
    section.className = 'source-trace';
    section.setAttribute('aria-label', 'Original source');

    const title = document.createElement('strong');
    title.textContent = 'Original source';

    const detail = document.createElement('p');
    detail.className = 'record-source';
    detail.textContent = [record.source_file, record.source_reference].filter(Boolean).join(' · ');

    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'secondary-button original-source-link';
    link.dataset.originalSourceLink = 'true';
    const anchor = !embeddedHref(record.source_file) && READERS[record.source_file]
      ? sectionAnchor(record.source_section)
      : '';
    link.textContent = embeddedHref(record.source_file)
      ? 'Open source (offline copy)'
      : (READERS[record.source_file]
        ? (anchor ? `Open reader · §${anchor.slice(2).replaceAll('-', '.')}` : 'Open reader')
        : 'Open original source');

    section.append(title, detail, link);
    const editor = body.querySelector('.review-editor');
    if (editor) body.insertBefore(section, editor);
    else body.append(section);
  }

  document.addEventListener('click', (event) => {
    const recordButton = event.target.closest('[data-record-id]');
    if (!recordButton) return;
    const recordId = recordButton.dataset.recordId;
    if (!recordId) return;
    setTimeout(() => addOriginalSourceLink(recordId), 0);
  });
})();
