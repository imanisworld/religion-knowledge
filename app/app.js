(() => {
  const baseRecords = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS)
    ? window.RELIGION_KNOWLEDGE_RECORDS
    : [];
  const committedOverrides = window.RELIGION_KNOWLEDGE_OVERRIDES && typeof window.RELIGION_KNOWLEDGE_OVERRIDES === 'object'
    ? window.RELIGION_KNOWLEDGE_OVERRIDES
    : {};

  const OVERRIDE_STORAGE_KEY = 'religion-knowledge-provenance-overrides-v1';
  const ALLOWED_OVERRIDE_TYPES = [
    'MY_WORDS',
    'MY_POSITION',
    'MY_QUESTION',
    'CLAUDE',
    'CHATGPT',
    'SOURCE',
    'INFERENCE',
    'REVIEW_REQUIRED',
  ];

  function loadLocalOverrides() {
    try {
      const parsed = JSON.parse(localStorage.getItem(OVERRIDE_STORAGE_KEY) || '{}');
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  let localOverrides = loadLocalOverrides();

  function getOverride(recordId) {
    return localOverrides[recordId] || committedOverrides[recordId] || null;
  }

  function effectiveRecord(record) {
    const override = getOverride(record.id);
    if (!override || !ALLOWED_OVERRIDE_TYPES.includes(override.provenance_type)) return record;

    const provenance = override.provenance_type;
    const inference = provenance === 'INFERENCE';
    return {
      ...record,
      provenance_type: provenance,
      representation_type: inference ? 'INFERENCE' : record.representation_type,
      speaker:
        provenance === 'CLAUDE' ? 'Claude' :
        provenance === 'CHATGPT' ? 'ChatGPT' :
        ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(provenance) ? 'user' :
        record.speaker,
      review_required: provenance === 'REVIEW_REQUIRED',
      attribution_confidence: provenance === 'REVIEW_REQUIRED' ? 'UNKNOWN' : 'MANUALLY_REVIEWED',
      attribution_evidence: provenance === 'REVIEW_REQUIRED'
        ? record.attribution_evidence
        : {
            method: 'manual_review_override',
            value: override.note || 'Manually classified after reviewing the original source.',
          },
      original_attribution: {
        provenance_type: record.provenance_type,
        representation_type: record.representation_type,
        review_required: record.review_required,
        attribution_confidence: record.attribution_confidence,
        attribution_evidence: record.attribution_evidence,
      },
      override_applied: true,
      override_updated_at: override.updated_at || null,
    };
  }

  function currentRecords() {
    return baseRecords.map(effectiveRecord);
  }

  const state = {
    view: 'home',
    query: '',
    provenance: 'ALL',
    type: 'ALL',
    aiSource: 'CLAUDE',
  };

  const $ = (id) => document.getElementById(id);
  const views = [...document.querySelectorAll('.view')];
  const navItems = [...document.querySelectorAll('.nav-item')];

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function badgeClass(provenance) {
    if (['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(provenance)) return 'mine';
    if (provenance === 'REVIEW_REQUIRED') return 'review';
    if (provenance === 'SOURCE') return 'source';
    if (['CLAUDE', 'CHATGPT', 'INFERENCE'].includes(provenance)) return 'ai';
    return '';
  }

  function label(value) {
    return String(value ?? '').replaceAll('_', ' ');
  }

  function matchesFilters(record) {
    if (state.provenance !== 'ALL' && record.provenance_type !== state.provenance) return false;
    if (state.type !== 'ALL' && record.record_type !== state.type) return false;

    const q = state.query.trim().toLowerCase();
    if (!q) return true;

    const haystack = [
      record.text,
      record.raw_text,
      record.speaker,
      record.source_file,
      record.source_section,
      record.citation,
      ...(record.topics || []),
      ...(record.tags || []),
    ].filter(Boolean).join(' ').toLowerCase();

    return haystack.includes(q);
  }

  function filteredRecords(extra = () => true) {
    return currentRecords().filter((r) => matchesFilters(r) && extra(r));
  }

  function card(record) {
    const title = record.title || record.text || 'Untitled record';
    const preview = record.text || record.raw_text || '';
    const badges = [record.provenance_type, record.representation_type, record.record_type]
      .filter(Boolean)
      .map((item, index) => {
        const cls = index === 0 ? badgeClass(record.provenance_type) : '';
        return `<span class="badge ${cls}">${escapeHtml(label(item))}</span>`;
      })
      .join('');
    const overrideBadge = record.override_applied ? '<span class="badge">MANUAL REVIEW</span>' : '';

    return `
      <button class="record-card" type="button" data-record-id="${escapeHtml(record.id)}">
        <div class="record-meta">${badges}${overrideBadge}</div>
        <h3>${escapeHtml(title.length > 110 ? `${title.slice(0, 107)}…` : title)}</h3>
        ${preview && preview !== title ? `<p>${escapeHtml(preview.length > 220 ? `${preview.slice(0, 217)}…` : preview)}</p>` : ''}
        ${record.source_file ? `<p class="record-source">${escapeHtml(record.source_file)}${record.source_section ? ` · ${escapeHtml(record.source_section)}` : ''}</p>` : ''}
      </button>`;
  }

  function emptyState(title, body) {
    return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${escapeHtml(body)}</div>`;
  }

  function renderList(targetId, items, emptyTitle, emptyBody) {
    const target = $(targetId);
    if (!target) return;
    target.innerHTML = items.length
      ? items.map(card).join('')
      : emptyState(emptyTitle, emptyBody);
  }

  function renderStats() {
    const records = currentRecords();
    const review = records.filter((r) => r.review_required || r.provenance_type === 'REVIEW_REQUIRED').length;
    const mine = records.filter((r) => ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(r.provenance_type)).length;
    const audits = records.filter((r) => ['AUDIT', 'CORRECTION'].includes(r.record_type)).length;
    const sources = records.filter((r) => r.provenance_type === 'SOURCE').length;
    const stats = [
      ['Records', records.length],
      ['Provably mine', mine],
      ['Audits', audits],
      ['Review', review],
      ['Sources', sources],
    ];

    $('stats-grid').innerHTML = stats.map(([name, count]) => `
      <div class="stat-card"><strong>${count}</strong><span>${escapeHtml(name)}</span></div>
    `).join('');
  }

  function renderHome() {
    const records = currentRecords();
    const review = records.filter((r) => r.review_required || r.provenance_type === 'REVIEW_REQUIRED').slice(0, 4);
    const recent = [...records]
      .sort((a, b) => String(b.original_date || '').localeCompare(String(a.original_date || '')))
      .slice(0, 6);

    renderStats();
    renderList('home-review-list', review, 'Nothing needs review', 'Uncertain attribution stays here until it is explicitly reviewed.');
    renderList('recent-list', recent, 'No normalized records yet', 'The source corpus is preserved in Git.');
  }

  function renderThoughts() {
    const items = filteredRecords((r) => ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(r.provenance_type));
    renderList('thoughts-list', items, 'No proven user records yet', 'Only explicitly attributable or manually reviewed user material appears here.');
  }

  function renderQuestions() {
    const items = filteredRecords((r) => r.provenance_type === 'MY_QUESTION' || r.record_type === 'QUESTION');
    renderList('questions-list', items, 'No questions normalized yet', 'Questions appear here without implying that unresolved questions belong to you.');
  }

  function renderSources() {
    const items = filteredRecords((r) => r.provenance_type === 'SOURCE' || r.record_type === 'SOURCE_NOTE');
    renderList('sources-list', items, 'No source records normalized yet', 'Named scholarly, scriptural, historical, and primary-source records appear here.');
  }

  function renderAI() {
    const items = filteredRecords((r) => {
      if (state.aiSource === 'INFERENCE') return r.provenance_type === 'INFERENCE' || r.representation_type === 'INFERENCE';
      return r.provenance_type === state.aiSource;
    });
    renderList('ai-list', items, `No ${label(state.aiSource).toLowerCase()} records yet`, 'AI-origin material stays separate from user-origin material.');
  }

  function renderAudits() {
    const items = filteredRecords((r) => ['AUDIT', 'AUDIT_NOTE', 'AUDIT_STATUS', 'CORRECTION', 'AUDIT_SURVIVAL', 'AUDIT_REASONING'].includes(r.record_type));
    renderList('audits-list', items, 'No audits normalized yet', 'Original claims and later corrections remain separate linked records.');
  }

  function renderReview() {
    const items = filteredRecords((r) => r.review_required || r.provenance_type === 'REVIEW_REQUIRED');
    renderList('review-list', items, 'Review queue clear', 'Manually reviewed items leave this queue but retain their original attribution underneath.');
  }

  function renderTopics() {
    const counts = new Map();
    filteredRecords().forEach((record) => {
      (record.topics || []).forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + 1));
    });
    const topics = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    $('topics-list').innerHTML = topics.length
      ? topics.map(([topic, count]) => `<button class="topic-card" type="button" data-topic="${escapeHtml(topic)}"><strong>${escapeHtml(topic)}</strong><span>${count} record${count === 1 ? '' : 's'}</span></button>`).join('')
      : emptyState('No topics normalized yet', 'Topic metadata appears after corpus normalization.');
  }

  function buildChains() {
    const records = currentRecords();
    const byId = new Map(records.map((r) => [r.id, r]));
    const chains = [];
    records.forEach((record) => {
      if (!['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(record.provenance_type)) return;
      const related = (record.related_ids || []).map((id) => byId.get(id)).filter(Boolean);
      if (related.length) chains.push([record, ...related]);
    });
    return chains;
  }

  function renderCompare() {
    const chains = buildChains();
    $('compare-list').innerHTML = chains.length
      ? chains.map((chain) => `<article class="compare-chain">${chain.map((item) => `<div class="compare-step"><div class="record-meta"><span class="badge ${badgeClass(item.provenance_type)}">${escapeHtml(label(item.provenance_type))}</span></div><strong>${escapeHtml(item.text || item.raw_text || item.id)}</strong>${item.source_file ? `<p class="record-source">${escapeHtml(item.source_file)}</p>` : ''}</div>`).join('')}</article>`).join('')
      : emptyState('No comparison chains yet', 'Comparison requires source-backed relationships between original words, AI interpretation, evidence, audits, and later positions.');
  }

  function renderSearch() {
    const items = filteredRecords();
    renderList('search-results', items, 'No matching records', currentRecords().length ? 'Change the search or filters.' : 'No normalized records have been loaded.');
  }

  function renderAll() {
    renderHome();
    renderThoughts();
    renderTopics();
    renderQuestions();
    renderSources();
    renderAI();
    renderAudits();
    renderCompare();
    renderReview();
    renderSearch();
  }

  function showView(name) {
    state.view = name;
    views.forEach((view) => view.classList.toggle('active', view.id === `view-${name}`));
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.view === name));
    const active = document.querySelector(`#view-${name}`);
    $('page-title').textContent = active?.dataset.title || 'Religion Knowledge';
    $('main-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reviewControls(record) {
    const original = baseRecords.find((r) => r.id === record.id) || record;
    const options = ALLOWED_OVERRIDE_TYPES.map((type) => `<option value="${type}"${record.provenance_type === type ? ' selected' : ''}>${escapeHtml(label(type))}</option>`).join('');
    const originalEvidence = original.attribution_evidence
      ? `${original.attribution_evidence.method || 'evidence'}: ${original.attribution_evidence.value || ''}`
      : 'Not recorded';

    return `
      <section class="review-editor" aria-label="Manual attribution review">
        <h3>Attribution review</h3>
        <p>This changes only the app's review layer. The original source text and parser attribution remain unchanged.</p>
        <label for="review-provenance">Reviewed attribution</label>
        <select id="review-provenance">${options}</select>
        <label for="review-note">Review note</label>
        <textarea id="review-note" rows="3" placeholder="Why this attribution is now known"></textarea>
        <div class="dialog-actions">
          <button type="button" id="save-review-override" data-record-id="${escapeHtml(record.id)}">Save review</button>
          ${getOverride(record.id) ? `<button type="button" id="clear-review-override" data-record-id="${escapeHtml(record.id)}">Restore parser attribution</button>` : ''}
        </div>
        <p class="record-source"><strong>Original parser attribution:</strong> ${escapeHtml(label(original.provenance_type))} · ${escapeHtml(originalEvidence)}</p>
      </section>`;
  }

  function openRecord(id) {
    const base = baseRecords.find((r) => r.id === id);
    if (!base) return;
    const record = effectiveRecord(base);
    $('dialog-kicker').textContent = [label(record.provenance_type), label(record.representation_type)].filter(Boolean).join(' · ');
    $('dialog-title').textContent = record.title || record.record_type || 'Record';

    const evidence = record.attribution_evidence
      ? `${record.attribution_evidence.method || 'evidence'}: ${record.attribution_evidence.value || ''}`
      : 'Not recorded';

    $('dialog-body').innerHTML = `
      <div class="raw-text">${escapeHtml(record.raw_text || record.text || '')}</div>
      <div class="detail-grid">
        <div class="detail-row"><strong>Provenance</strong>${escapeHtml(label(record.provenance_type))}</div>
        <div class="detail-row"><strong>Representation</strong>${escapeHtml(label(record.representation_type))}</div>
        <div class="detail-row"><strong>Attribution evidence</strong>${escapeHtml(evidence)}</div>
        <div class="detail-row"><strong>Source</strong>${escapeHtml(record.source_file || 'Unknown')}${record.source_section ? ` · ${escapeHtml(record.source_section)}` : ''}</div>
        <div class="detail-row"><strong>Topics</strong>${escapeHtml((record.topics || []).join(', ') || 'None')}</div>
        <div class="detail-row"><strong>Status</strong>${escapeHtml(label(record.status || record.position_status || ''))}</div>
      </div>
      ${reviewControls(record)}`;

    const override = getOverride(record.id);
    if (override?.note) $('review-note').value = override.note;
    $('record-dialog').showModal();
  }

  function saveReviewOverride(recordId) {
    const provenance = $('review-provenance')?.value;
    if (!ALLOWED_OVERRIDE_TYPES.includes(provenance)) return;
    const note = $('review-note')?.value?.trim() || '';
    localOverrides = {
      ...localOverrides,
      [recordId]: {
        provenance_type: provenance,
        note,
        updated_at: new Date().toISOString(),
      },
    };
    try { localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(localOverrides)); } catch {}
    renderAll();
    openRecord(recordId);
  }

  function clearReviewOverride(recordId) {
    const next = { ...localOverrides };
    delete next[recordId];
    localOverrides = next;
    try { localStorage.setItem(OVERRIDE_STORAGE_KEY, JSON.stringify(localOverrides)); } catch {}
    renderAll();
    openRecord(recordId);
  }

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-view]');
    if (nav) showView(nav.dataset.view);

    const go = event.target.closest('[data-go]');
    if (go) showView(go.dataset.go);

    const record = event.target.closest('[data-record-id]');
    if (record && !event.target.closest('#save-review-override, #clear-review-override')) openRecord(record.dataset.recordId);

    if (event.target.closest('#save-review-override')) {
      saveReviewOverride(event.target.closest('#save-review-override').dataset.recordId);
    }

    if (event.target.closest('#clear-review-override')) {
      clearReviewOverride(event.target.closest('#clear-review-override').dataset.recordId);
    }

    const ai = event.target.closest('[data-ai]');
    if (ai) {
      state.aiSource = ai.dataset.ai;
      document.querySelectorAll('[data-ai]').forEach((button) => button.classList.toggle('active', button === ai));
      renderAI();
    }

    const topic = event.target.closest('[data-topic]');
    if (topic) {
      state.query = topic.dataset.topic;
      $('search-input').value = state.query;
      renderSearch();
      showView('search');
    }
  });

  $('filter-button').addEventListener('click', () => {
    const panel = $('filter-panel');
    panel.hidden = !panel.hidden;
    $('filter-button').setAttribute('aria-expanded', String(!panel.hidden));
  });

  $('search-input').addEventListener('input', (event) => {
    state.query = event.target.value;
    renderSearch();
    if (state.query.trim()) showView('search');
    else if (state.view === 'search') showView('home');
  });

  $('provenance-filter').addEventListener('change', (event) => {
    state.provenance = event.target.value;
    renderAll();
    showView('search');
  });

  $('type-filter').addEventListener('change', (event) => {
    state.type = event.target.value;
    renderAll();
    showView('search');
  });

  $('clear-filters').addEventListener('click', () => {
    state.query = '';
    state.provenance = 'ALL';
    state.type = 'ALL';
    $('search-input').value = '';
    $('provenance-filter').value = 'ALL';
    $('type-filter').value = 'ALL';
    renderAll();
    showView('home');
  });

  $('theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('religion-knowledge-theme', root.dataset.theme); } catch {}
  });

  $('dialog-close').addEventListener('click', () => $('record-dialog').close());

  try {
    const saved = localStorage.getItem('religion-knowledge-theme');
    if (saved) document.documentElement.dataset.theme = saved;
  } catch {}

  renderAll();
  showView('home');
})();
