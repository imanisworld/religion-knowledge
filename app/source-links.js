(() => {
  const records = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS)
    ? window.RELIGION_KNOWLEDGE_RECORDS
    : [];

  function safeSourceHref(sourceFile) {
    if (typeof sourceFile !== 'string') return null;
    if (!/^[A-Za-z0-9_.-]+\.md$/.test(sourceFile)) return null;
    return `../${encodeURIComponent(sourceFile)}`;
  }

  function addOriginalSourceLink(recordId) {
    const record = records.find((item) => item.id === recordId);
    const body = document.getElementById('dialog-body');
    if (!record || !body || body.querySelector('[data-original-source-link]')) return;

    const href = safeSourceHref(record.source_file);
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
    link.textContent = 'Open original source';

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
