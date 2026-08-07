(() => {
  const STORAGE_KEY = 'religion-knowledge-provenance-overrides-v1';
  const BACKUP_VERSION = 1;
  const ALLOWED = new Set([
    'MY_WORDS', 'MY_POSITION', 'MY_QUESTION', 'CLAUDE',
    'CHATGPT', 'SOURCE', 'INFERENCE', 'REVIEW_REQUIRED',
  ]);

  function readOverrides() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function validateOverrides(candidate) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
      throw new Error('Backup overrides must be an object.');
    }

    const knownIds = new Set(
      (Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS) ? window.RELIGION_KNOWLEDGE_RECORDS : [])
        .map((record) => record?.id)
        .filter(Boolean)
    );
    const cleaned = {};

    for (const [recordId, override] of Object.entries(candidate)) {
      if (!knownIds.has(recordId)) throw new Error(`Unknown record ID: ${recordId}`);
      if (!override || typeof override !== 'object' || Array.isArray(override)) {
        throw new Error(`Invalid override for ${recordId}`);
      }
      if (!ALLOWED.has(override.provenance_type)) {
        throw new Error(`Invalid provenance for ${recordId}`);
      }
      cleaned[recordId] = {
        provenance_type: override.provenance_type,
        note: typeof override.note === 'string' ? override.note : '',
        updated_at: typeof override.updated_at === 'string' ? override.updated_at : null,
      };
    }
    return cleaned;
  }

  function exportBackup() {
    const payload = {
      schema: 'religion-knowledge-review-backup',
      version: BACKUP_VERSION,
      exported_at: new Date().toISOString(),
      overrides: readOverrides(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `religion-review-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function importBackup(file) {
    if (!file) return;
    const payload = JSON.parse(await file.text());
    if (payload?.schema !== 'religion-knowledge-review-backup' || payload?.version !== BACKUP_VERSION) {
      throw new Error('Unsupported review-backup format.');
    }
    const overrides = validateOverrides(payload.overrides);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    location.reload();
  }

  const view = document.getElementById('view-review');
  const reviewList = document.getElementById('review-list');
  if (!view || !reviewList) return;

  const controls = document.createElement('section');
  controls.className = 'section-block';
  controls.setAttribute('aria-label', 'Review decision backup');
  controls.innerHTML = `
    <div class="section-heading stacked">
      <div>
        <p class="eyebrow">Portable review work</p>
        <h2>Review Backup</h2>
      </div>
      <p class="muted">Export or restore only your manual attribution decisions. Original notes and parser output are never included or rewritten.</p>
    </div>
    <div class="dialog-actions">
      <button id="export-review-backup" type="button" class="secondary-button">Export review decisions</button>
      <button id="import-review-backup" type="button" class="secondary-button">Import review decisions</button>
      <input id="review-backup-file" type="file" accept="application/json,.json" hidden>
    </div>
    <p id="review-backup-status" class="muted" role="status" aria-live="polite"></p>`;
  view.insertBefore(controls, reviewList);

  document.getElementById('export-review-backup')?.addEventListener('click', exportBackup);
  document.getElementById('import-review-backup')?.addEventListener('click', () => {
    document.getElementById('review-backup-file')?.click();
  });
  document.getElementById('review-backup-file')?.addEventListener('change', async (event) => {
    const status = document.getElementById('review-backup-status');
    try {
      await importBackup(event.target.files?.[0]);
    } catch (error) {
      if (status) status.textContent = `Import refused: ${error.message}`;
      event.target.value = '';
    }
  });
})();
