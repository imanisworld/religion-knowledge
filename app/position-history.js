(() => {
  const STORAGE_KEY = 'religion-knowledge-provenance-overrides-v1';

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function localOverrides() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function committedOverrides() {
    return window.RELIGION_KNOWLEDGE_OVERRIDES && typeof window.RELIGION_KNOWLEDGE_OVERRIDES === 'object'
      ? window.RELIGION_KNOWLEDGE_OVERRIDES
      : {};
  }

  function effectiveProvenance(record) {
    const local = localOverrides();
    const committed = committedOverrides();
    return local[record.id]?.provenance_type || committed[record.id]?.provenance_type || record.provenance_type;
  }

  function explicitPositions() {
    const records = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS) ? window.RELIGION_KNOWLEDGE_RECORDS : [];
    return records
      .filter((record) => effectiveProvenance(record) === 'MY_POSITION')
      .sort((a, b) => String(a.original_date || '').localeCompare(String(b.original_date || '')));
  }

  function render() {
    const target = document.getElementById('position-history-list');
    if (!target) return;
    const positions = explicitPositions();

    if (!positions.length) {
      target.innerHTML = '<div class="empty-state"><strong>No explicit positions yet</strong>Nothing appears here until a record is explicitly classified as MY_POSITION. Audit corrections and AI conclusions are not treated as your beliefs automatically.</div>';
      return;
    }

    target.innerHTML = positions.map((record, index) => {
      const source = [record.source_file, record.source_section].filter(Boolean).join(' · ');
      const date = record.original_date ? `<span>${escapeHtml(record.original_date)}</span>` : '<span>Date not recorded</span>';
      return `
        <button class="record-card" type="button" data-record-id="${escapeHtml(record.id)}">
          <div class="record-meta"><span class="badge mine">MY POSITION</span><span class="badge">${index === positions.length - 1 ? 'LATEST EXPLICIT' : 'EARLIER EXPLICIT'}</span></div>
          <h3>${escapeHtml(record.text || record.raw_text || 'Position')}</h3>
          <p class="record-source">${date}${source ? ` · ${escapeHtml(source)}` : ''}</p>
        </button>`;
    }).join('');
  }

  const thoughts = document.getElementById('view-thoughts');
  if (thoughts) {
    const heading = thoughts.querySelector('.section-heading');
    if (heading) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'secondary-button';
      button.dataset.go = 'positions';
      button.textContent = 'Position History';
      heading.appendChild(button);
    }
  }

  const review = document.getElementById('view-review');
  if (review) {
    const section = document.createElement('section');
    section.id = 'view-positions';
    section.className = 'view';
    section.dataset.title = 'Position History';
    section.innerHTML = `
      <div class="section-heading stacked">
        <div>
          <p class="eyebrow">Explicitly adopted only</p>
          <h2>Position History</h2>
        </div>
        <p class="muted">Only records explicitly classified as MY_POSITION appear here. Corrections, source claims, and AI conclusions never become your position by implication.</p>
      </div>
      <div id="position-history-list" class="card-list"></div>`;
    review.parentNode.insertBefore(section, review);
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-go="positions"], [data-view="positions"]')) render();
    if (event.target.closest('#save-review-override, #clear-review-override')) setTimeout(render, 0);
  });

  window.addEventListener('storage', render);
  render();
})();
