(() => {
  const STORAGE_KEY = 'religion-knowledge-provenance-overrides-v1';
  const META_KEY = 'religion-knowledge-review-backup-meta-v1';
  const BACKUP_VERSION = 1;
  const ALLOWED = new Set([
    'MY_WORDS', 'MY_POSITION', 'MY_QUESTION', 'CLAUDE',
    'CHATGPT', 'SOURCE', 'INFERENCE', 'REVIEW_REQUIRED', 'PRE_CONVENTION',
  ]);

  function readOverrides() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    } catch {
      return {};
    }
  }

  function readMeta() {
    try {
      const value = JSON.parse(localStorage.getItem(META_KEY) || 'null');
      return value && typeof value === 'object' ? value : { last_exported_at: null };
    } catch {
      return { last_exported_at: null };
    }
  }

  function writeMeta(meta) {
    try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch {}
  }

  // Decisions that exist only in this browser: never exported, or saved/edited
  // since the last export. These are the ones lost if the browser data goes.
  function unexportedCount() {
    const overrides = readOverrides();
    const lastExport = readMeta().last_exported_at;
    const ids = Object.keys(overrides);
    if (!ids.length) return 0;
    if (!lastExport) return ids.length;
    return ids.filter((id) => {
      const updated = overrides[id]?.updated_at;
      return !updated || updated > lastExport;
    }).length;
  }

  function renderBackupStatus() {
    const total = Object.keys(readOverrides()).length;
    const unexported = unexportedCount();
    const lastExport = readMeta().last_exported_at;

    const status = document.getElementById('review-backup-status');
    if (status && !status.dataset.transient) {
      if (unexported > 0) {
        status.textContent = `${unexported} review decision${unexported === 1 ? '' : 's'} exist${unexported === 1 ? 's' : ''} only in this browser — export a backup.`;
      } else if (total > 0 && lastExport) {
        status.textContent = `All ${total} review decision${total === 1 ? '' : 's'} backed up (last export ${lastExport.slice(0, 10)}).`;
      } else {
        status.textContent = '';
      }
    }

    const homeStatus = document.getElementById('home-backup-status');
    if (homeStatus) {
      if (unexported > 0) {
        homeStatus.textContent = `${unexported} review decision${unexported === 1 ? '' : 's'} exist only in this browser. Export a backup from the Review Queue.`;
        homeStatus.hidden = false;
      } else {
        homeStatus.textContent = '';
        homeStatus.hidden = true;
      }
    }

    const exportButton = document.getElementById('export-review-backup');
    if (exportButton) exportButton.classList.toggle('needs-backup', unexported > 0);
  }

  function exportBackup() {
    const overrides = readOverrides();
    const exportedAt = new Date().toISOString();
    const payload = {
      schema: 'religion-knowledge-review-backup',
      version: BACKUP_VERSION,
      exported_at: exportedAt,
      overrides,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `religion-review-backup-${exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    writeMeta({ last_exported_at: exportedAt });
    const status = document.getElementById('review-backup-status');
    if (status) {
      status.dataset.transient = 'true';
      status.textContent = `Exported ${Object.keys(overrides).length} review decision${Object.keys(overrides).length === 1 ? '' : 's'} · just now.`;
      setTimeout(() => {
        delete status.dataset.transient;
        renderBackupStatus();
      }, 4000);
    }
    renderBackupStatus();
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

  async function importBackup(file) {
    if (!file) return;
    const payload = JSON.parse(await file.text());
    if (payload?.schema !== 'religion-knowledge-review-backup' || payload?.version !== BACKUP_VERSION) {
      throw new Error('Unsupported review-backup format.');
    }
    const overrides = validateOverrides(payload.overrides);

    const current = readOverrides();
    const currentCount = Object.keys(current).length;
    const incomingCount = Object.keys(overrides).length;
    if (currentCount > 0 && JSON.stringify(current) !== JSON.stringify(overrides)) {
      const proceed = window.confirm(
        `Replace ${currentCount} local review decision${currentCount === 1 ? '' : 's'} with ${incomingCount} from this backup? Your current local decisions will be overwritten.`
      );
      if (!proceed) throw new Error('import cancelled — nothing was changed.');
    }

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

  // Recompute whenever a review decision is saved or cleared (same targets the
  // rest of the app watches), and when another tab changes storage.
  document.addEventListener('click', (event) => {
    if (event.target.closest('#save-review-override, #save-review-next, #clear-review-override')) {
      setTimeout(renderBackupStatus, 0);
    }
  });
  window.addEventListener('storage', renderBackupStatus);

  renderBackupStatus();
})();
