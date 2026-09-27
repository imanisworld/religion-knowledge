(() => {
  const baseRecords = Array.isArray(window.RELIGION_KNOWLEDGE_RECORDS)
    ? window.RELIGION_KNOWLEDGE_RECORDS
    : [];
  const committedOverrides = window.RELIGION_KNOWLEDGE_OVERRIDES && typeof window.RELIGION_KNOWLEDGE_OVERRIDES === 'object'
    ? window.RELIGION_KNOWLEDGE_OVERRIDES
    : {};

  const OVERRIDE_STORAGE_KEY = 'religion-knowledge-provenance-overrides-v1';
  const RESUME_STORAGE_KEY = 'religion-knowledge-resume-v1';
  const LIST_PAGE_SIZE = 60;
  const ALLOWED_OVERRIDE_TYPES = [
    'MY_WORDS',
    'MY_POSITION',
    'MY_QUESTION',
    'CLAUDE',
    'CHATGPT',
    'SOURCE',
    'INFERENCE',
    'REVIEW_REQUIRED',
    'PRE_CONVENTION',
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
    listLimits: {},
    topicQuery: '',
    topicSort: 'count',
  };

  const MORE_SHEET_VIEWS = ['audits', 'questions', 'sources', 'ai', 'compare', 'positions'];
  const VIEW_NAMES = ['home', 'thoughts', 'topics', 'questions', 'sources', 'ai', 'audits', 'compare', 'positions', 'review', 'search'];

  const $ = (id) => document.getElementById(id);
  const views = [...document.querySelectorAll('.view')];
  const navItems = [...document.querySelectorAll('.nav-item')];

  // --- Hash routing -------------------------------------------------------
  // Views, search/filter state, and open records are mirrored into
  // location.hash so they are bookmarkable and survive reloads. Everything
  // degrades to a no-op where the environment disallows it (some file://
  // webviews reject history calls) — the app then behaves exactly as before.
  let openRecordId = null;
  let syncingHash = false;
  let routerClosing = false;

  function hashForState() {
    if (openRecordId) return `#/record/${encodeURIComponent(openRecordId)}`;
    if (state.view === 'search') {
      const params = new URLSearchParams();
      if (state.query.trim()) params.set('q', state.query.trim());
      if (state.provenance !== 'ALL') params.set('prov', state.provenance);
      if (state.type !== 'ALL') params.set('type', state.type);
      const encoded = params.toString();
      return encoded ? `#/search?${encoded}` : '#/search';
    }
    if (state.view === 'ai' && state.aiSource !== 'CLAUDE') return `#/ai?src=${encodeURIComponent(state.aiSource)}`;
    return `#/${state.view}`;
  }

  function writeHash(hash, push) {
    if (location.hash === hash) return;
    syncingHash = true;
    try {
      if (push) history.pushState(null, '', hash);
      else history.replaceState(null, '', hash);
    } catch {
      try { location.replace(hash); } catch { /* immutable environment — skip */ }
    }
    // hashchange only fires for location.* writes, and asynchronously; clear
    // the guard on the next tick either way.
    setTimeout(() => { syncingHash = false; }, 0);
  }

  function syncHash(options = {}) {
    writeHash(hashForState(), Boolean(options.push));
    saveResumeState();
  }

  function saveResumeState() {
    // Home is a destination, not useful resume state. Preserve the last
    // meaningful record/view instead of replacing it with "Home".
    if (!openRecordId && state.view === 'home') return;
    try {
      const record = openRecordId ? baseRecords.find((r) => r.id === openRecordId) : null;
      const active = document.querySelector(`#view-${state.view}`);
      const recordTitle = record ? String(record.title || record.text || '').trim() : '';
      localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify({
        hash: hashForState(),
        view: state.view,
        viewTitle: active?.dataset.title || 'Home',
        recordId: openRecordId,
        recordTitle: recordTitle ? (recordTitle.length > 80 ? `${recordTitle.slice(0, 77)}…` : recordTitle) : null,
        updated_at: new Date().toISOString(),
      }));
    } catch { /* private mode / storage denied — resume simply stays off */ }
  }

  function loadResumeState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RESUME_STORAGE_KEY) || 'null');
      return parsed && typeof parsed === 'object' && typeof parsed.hash === 'string' ? parsed : null;
    } catch {
      return null;
    }
  }

  function parseHash(raw) {
    if (typeof raw !== 'string' || !raw.startsWith('#/')) return null;
    const [path, queryString] = raw.slice(2).split('?');
    const params = new URLSearchParams(queryString || '');
    const [head, ...rest] = path.split('/');
    if (head === 'record' && rest.length) return { kind: 'record', id: decodeURIComponent(rest.join('/')) };
    if (head === 'topic' && rest.length) return { kind: 'topic', topic: decodeURIComponent(rest.join('/')) };
    if (head === 'search') {
      return {
        kind: 'search',
        query: params.get('q') || '',
        provenance: params.get('prov') || 'ALL',
        type: params.get('type') || 'ALL',
      };
    }
    if (VIEW_NAMES.includes(head)) return { kind: 'view', view: head, aiSource: params.get('src') || null };
    return null;
  }

  function closeDialogFromRouter() {
    const dialog = $('record-dialog');
    if (dialog?.open) {
      routerClosing = true;
      dialog.close();
      routerClosing = false;
    }
    openRecordId = null;
  }

  function applyFilterState(query, provenance, type) {
    state.query = query;
    state.provenance = ALLOWED_OVERRIDE_TYPES.includes(provenance) || provenance === 'ALL' ? provenance : 'ALL';
    state.type = type;
    resetListLimits();
    const search = $('search-input');
    if (search) search.value = state.query;
    const provSelect = $('provenance-filter');
    if (provSelect) provSelect.value = state.provenance;
    const typeSelect = $('type-filter');
    if (typeSelect && [...typeSelect.options].some((o) => o.value === state.type)) typeSelect.value = state.type;
    else state.type = 'ALL';
  }

  function route() {
    try {
      const parsed = parseHash(location.hash);
      if (!parsed) {
        closeDialogFromRouter();
        showView('home', { silent: true });
        syncHash();
        return;
      }
      if (parsed.kind === 'record') {
        const exists = baseRecords.some((r) => r.id === parsed.id);
        if (!exists) {
          closeDialogFromRouter();
          showView('home', { silent: true });
          syncHash();
          return;
        }
        openRecord(parsed.id, { silent: true });
        return;
      }
      closeDialogFromRouter();
      if (parsed.kind === 'topic') {
        applyFilterState(parsed.topic, 'ALL', 'ALL');
        renderAll();
        showView('search', { silent: true });
        return;
      }
      if (parsed.kind === 'search') {
        applyFilterState(parsed.query, parsed.provenance, parsed.type);
        renderAll();
        showView('search', { silent: true });
        return;
      }
      if (parsed.view === 'ai' && parsed.aiSource && ['CLAUDE', 'CHATGPT', 'INFERENCE'].includes(parsed.aiSource)) {
        state.aiSource = parsed.aiSource;
        document.querySelectorAll('[data-ai]').forEach((button) => button.classList.toggle('active', button.dataset.ai === parsed.aiSource));
        renderAI();
      }
      showView(parsed.view, { silent: true });
    } catch {
      showView('home', { silent: true });
    }
  }
  // ------------------------------------------------------------------------

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
    if (provenance === 'PRE_CONVENTION') return 'pre-convention';
    if (provenance === 'SOURCE') return 'source';
    if (['CLAUDE', 'CHATGPT', 'INFERENCE'].includes(provenance)) return 'ai';
    return '';
  }

  function label(value) {
    return String(value ?? '').replaceAll('_', ' ');
  }

  // Badge copy only — the dialog's detail rows keep the raw enum labels,
  // since that surface is the attribution audit trail.
  function badgeText(provenance) {
    if (provenance === 'REVIEW_REQUIRED') return 'NEEDS REVIEW';
    // Neutral on purpose: this is a declared, closed dead end (the source
    // document says the span is unrecoverably mixed), not an open item —
    // it must not read as another orange "do something about this" badge.
    if (provenance === 'PRE_CONVENTION') return 'MIXED — PRE-CONVENTION';
    return label(provenance);
  }

  const DOC_TITLES = {
    'Bible_Deep_Dive_Master_Notes.md': 'Study Notes',
    'Field_Guide_Conversation_Reference.md': 'Observations',
    'Glossary.md': 'Glossary',
    'Historical_Framework.md': 'Historical Framework',
    'Method_and_Reference.md': 'Method & Reference',
    'Sources_and_Primary_Texts.md': 'Sources & Primary Texts',
    'The_Other_Side.md': 'The Strongest Case',
    'Translations.md': 'Translations',
  };

  function resetListLimits() {
    state.listLimits = {};
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
    // Card faces stay lean: provenance (the at-a-glance fact), record type
    // only when it says more than the default OBSERVATION, and a REVIEWED
    // stamp for overridden records. Representation and full attribution
    // detail live in the record dialog.
    const badges = [`<span class="badge ${badgeClass(record.provenance_type)}">${escapeHtml(badgeText(record.provenance_type))}</span>`];
    if (record.record_type && record.record_type !== 'OBSERVATION') {
      badges.push(`<span class="badge">${escapeHtml(label(record.record_type))}</span>`);
    }
    if (record.override_applied) badges.push('<span class="badge">REVIEWED</span>');

    const docTitle = DOC_TITLES[record.source_file] || record.source_file || '';
    const sectionParts = typeof record.source_section === 'string' ? record.source_section.split(' > ') : [];
    const sectionLeaf = sectionParts.length > 1 ? sectionParts[sectionParts.length - 1] : '';

    return `
      <button class="record-card" type="button" data-record-id="${escapeHtml(record.id)}">
        <div class="record-meta">${badges.join('')}</div>
        <h3>${escapeHtml(title.length > 110 ? `${title.slice(0, 107)}…` : title)}</h3>
        ${preview && preview !== title ? `<p>${escapeHtml(preview.length > 220 ? `${preview.slice(0, 217)}…` : preview)}</p>` : ''}
        ${record.source_file ? `<p class="record-source">${escapeHtml(docTitle)}${sectionLeaf ? ` · ${escapeHtml(sectionLeaf)}` : ''}</p>` : ''}
      </button>`;
  }

  function emptyState(title, body) {
    return `<div class="empty-state"><strong>${escapeHtml(title)}</strong>${escapeHtml(body)}</div>`;
  }

  function renderList(targetId, items, emptyTitle, emptyBody, options = {}) {
    const target = $(targetId);
    if (!target) return;
    if (!items.length) {
      target.innerHTML = emptyState(emptyTitle, emptyBody);
      return;
    }

    const unbounded = Boolean(options.unbounded);
    const limit = unbounded ? items.length : (state.listLimits[targetId] || LIST_PAGE_SIZE);
    const visible = items.slice(0, limit);
    const remaining = items.length - visible.length;
    const footer = remaining > 0
      ? `<div class="list-more"><p class="muted">Showing ${visible.length} of ${items.length}</p><button class="secondary-button" type="button" data-show-more="${escapeHtml(targetId)}">Show ${Math.min(LIST_PAGE_SIZE, remaining)} more</button></div>`
      : items.length > LIST_PAGE_SIZE && !unbounded
        ? `<div class="list-more"><p class="muted">Showing all ${items.length}</p></div>`
        : '';

    target.innerHTML = visible.map(card).join('') + footer;
  }

  function renderStats() {
    const records = currentRecords();
    const review = records.filter((r) => r.review_required || r.provenance_type === 'REVIEW_REQUIRED').length;
    const mine = records.filter((r) => ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(r.provenance_type)).length;
    const audits = records.filter((r) => ['AUDIT', 'AUDIT_NOTE', 'AUDIT_STATUS', 'CORRECTION', 'AUDIT_SURVIVAL', 'AUDIT_REASONING'].includes(r.record_type)).length;
    const sources = records.filter((r) => r.provenance_type === 'SOURCE').length;
    const stats = [
      ['Records', records.length, 'search'],
      ['My thoughts', mine, 'thoughts'],
      ['Audits', audits, 'audits'],
      ['Review', review, 'review'],
      ['Sources', sources, 'sources'],
    ];

    $('stats-grid').innerHTML = stats.map(([name, count, target]) => `
      <button class="stat-card" type="button" data-go="${escapeHtml(target)}"><strong>${count}</strong><span>${escapeHtml(name)}</span></button>
    `).join('');
  }

  function renderHomeLead() {
    const lead = $('home-lead');
    if (!lead) return;
    const resume = loadResumeState();
    const meaningfulResume = resume
      && resume.hash
      && resume.hash !== '#/home'
      && !(resume.view === 'search' && !resume.hash.includes('?'));
    if (meaningfulResume) {
      const title = resume.recordTitle || resume.viewTitle || 'Where you left off';
      const context = resume.recordTitle ? `Record · ${resume.viewTitle || 'Home'}` : (resume.viewTitle || '');
      lead.innerHTML = `
        <a class="hero-card continue-card" href="${escapeHtml(resume.hash)}">
          <p class="eyebrow">Continue where you left off</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(context)} →</p>
        </a>`;
    } else {
      lead.innerHTML = `
        <div class="hero-card">
          <p class="eyebrow">Religion Knowledge</p>
          <h2>Research records with provenance kept visible.</h2>
          <p>Your words, AI analysis, and named sources stay separate so you can see what each claim rests on.</p>
        </div>`;
    }
  }

  function topicCounts(records) {
    const counts = new Map();
    records.forEach((record) => {
      (record.topics || []).forEach((topic) => counts.set(topic, (counts.get(topic) || 0) + 1));
    });
    return counts;
  }

  function renderHomeTopics() {
    const target = $('home-topics');
    if (!target) return;
    const top = [...topicCounts(currentRecords()).entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 6);
    target.innerHTML = top.length
      ? top.map(([topic, count]) => `<a class="topic-chip" href="#/topic/${encodeURIComponent(topic)}">${escapeHtml(topic)}<span>${count}</span></a>`).join('')
      : emptyState('No topics yet', 'Topics appear as records are added.');
  }

  function renderHomeQuestions() {
    const questions = currentRecords().filter((r) => r.provenance_type === 'MY_QUESTION' || r.record_type === 'QUESTION');
    const heading = $('home-questions-heading');
    if (heading) heading.textContent = questions.length ? `Open questions · ${questions.length}` : 'Open questions';
    renderList('home-questions-list', questions.slice(0, 3), 'No questions normalized yet', 'Questions appear here as the corpus grows.', { unbounded: true });
  }

  function renderHome() {
    const records = currentRecords();
    const reviewAll = records.filter((r) => r.review_required || r.provenance_type === 'REVIEW_REQUIRED');
    const recent = [...records]
      .sort((a, b) => String(b.original_date || '').localeCompare(String(a.original_date || '')))
      .slice(0, 3);

    renderHomeLead();
    renderStats();
    renderHomeTopics();
    renderHomeQuestions();
    const reviewHeading = $('home-review-heading');
    if (reviewHeading) reviewHeading.textContent = reviewAll.length ? `Needs attention · ${reviewAll.length}` : 'Needs attention';
    renderList('home-review-list', reviewAll.slice(0, 4), 'Nothing needs review', 'Uncertain attribution stays here until it is explicitly reviewed.', { unbounded: true });
    renderList('recent-list', recent, 'No normalized records yet', 'The original documents are unchanged.', { unbounded: true });
  }

  function renderThoughts() {
    const items = filteredRecords((r) => ['MY_WORDS', 'MY_POSITION', 'MY_QUESTION'].includes(r.provenance_type));
    renderList('thoughts-list', items, 'No proven user records yet', 'Only explicitly attributable or manually reviewed user material appears here.');
  }

  function renderQuestions() {
    const items = filteredRecords((r) => r.provenance_type === 'MY_QUESTION' || r.record_type === 'QUESTION');
    renderList('questions-list', items, 'No questions normalized yet', 'Open questions from across the study.');
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

  function needsReview(record) {
    return record.review_required || record.provenance_type === 'REVIEW_REQUIRED';
  }

  function reviewedThisSessionCount() {
    return Object.keys(localOverrides).filter((id) => {
      const original = baseRecords.find((r) => r.id === id);
      return original && needsReview(original) && localOverrides[id]?.provenance_type !== 'REVIEW_REQUIRED';
    }).length;
  }

  function renderReview() {
    const items = filteredRecords(needsReview);
    const remaining = currentRecords().filter(needsReview).length;
    const reviewed = reviewedThisSessionCount();
    const progress = $('review-progress');
    if (progress) {
      progress.textContent = reviewed
        ? `${remaining} remaining · ${reviewed} reviewed this session`
        : `${remaining} awaiting review`;
    }
    renderList('review-list', items, 'Review queue clear', 'Manually reviewed items leave this queue but retain their original attribution underneath.');
  }

  function renderTopics() {
    let topics = [...topicCounts(filteredRecords()).entries()];
    const topicQuery = state.topicQuery.trim().toLowerCase();
    if (topicQuery) topics = topics.filter(([topic]) => topic.toLowerCase().includes(topicQuery));
    topics = state.topicSort === 'alpha'
      ? topics.sort((a, b) => a[0].localeCompare(b[0]))
      : topics.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

    $('topics-list').innerHTML = topics.length
      ? topics.map(([topic, count]) => `<button class="topic-card" type="button" data-topic="${escapeHtml(topic)}"><strong>${escapeHtml(topic)}</strong><span>${count} record${count === 1 ? '' : 's'}</span></button>`).join('')
      : emptyState(topicQuery ? 'No topics match your filter' : 'No topics normalized yet', topicQuery ? 'Try a different search term.' : 'Topics appear as records are added.');
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

    const hasActiveFilters = state.query.trim() || state.provenance !== 'ALL' || state.type !== 'ALL';
    return hasActiveFilters
      ? chains.filter((chain) => chain.some((item) => matchesFilters(item)))
      : chains;
  }

  function renderCompare() {
    const chains = buildChains();
    const target = $('compare-list');
    if (!target) return;

    const summary = document.querySelector('#view-compare .section-heading .muted');
    if (summary) {
      const filtered = state.query.trim() || state.provenance !== 'ALL' || state.type !== 'ALL';
      summary.textContent = `${chains.length} linked chain${chains.length === 1 ? '' : 's'}${filtered ? ' matching current filters' : ''} · Original words → AI interpretation → evidence → audit → current position.`;
    }

    if (!chains.length) {
      target.innerHTML = emptyState(
        'No comparison chains match',
        'Comparison requires linked records. Clear the current search or filters if you expected a chain here.'
      );
      return;
    }

    const limit = state.listLimits['compare-list'] || LIST_PAGE_SIZE;
    const visible = chains.slice(0, limit);
    const remaining = chains.length - visible.length;
    const footer = remaining > 0
      ? `<div class="list-more"><p class="muted">Showing ${visible.length} of ${chains.length} chains</p><button class="secondary-button" type="button" data-show-more="compare-list">Show ${Math.min(LIST_PAGE_SIZE, remaining)} more</button></div>`
      : chains.length > LIST_PAGE_SIZE
        ? `<div class="list-more"><p class="muted">Showing all ${chains.length} chains</p></div>`
        : '';

    target.innerHTML = visible.map((chain) =>
      `<article class="compare-chain">${chain.map((item) =>
        `<div class="compare-step"><div class="record-meta"><span class="badge ${badgeClass(item.provenance_type)}">${escapeHtml(badgeText(item.provenance_type))}</span></div><strong>${escapeHtml(item.text || item.raw_text || item.id)}</strong>${item.source_file ? `<p class="record-source">${escapeHtml(DOC_TITLES[item.source_file] || item.source_file)}</p>` : ''}</div>`
      ).join('')}</article>`
    ).join('') + footer;
  }

  function renderSearch() {
    const items = filteredRecords();
    const summary = $('search-summary');
    if (summary) {
      const q = state.query.trim();
      const parts = [`${items.length} result${items.length === 1 ? '' : 's'}`];
      if (q) parts.push(`for “${q}”`);
      if (state.provenance !== 'ALL') parts.push(`· ${label(state.provenance).toLowerCase()}`);
      if (state.type !== 'ALL') parts.push(`· ${label(state.type).toLowerCase()}`);
      summary.textContent = parts.join(' ');
    }
    renderList('search-results', items, 'No matching records', currentRecords().length ? 'Change the search or filters.' : 'No normalized records have been loaded.');
  }

  function renderFilterBadge() {
    const count = (state.provenance !== 'ALL' ? 1 : 0) + (state.type !== 'ALL' ? 1 : 0);
    const badge = $('filter-count');
    if (badge) badge.textContent = count ? String(count) : '';
    $('filter-button')?.classList.toggle('has-filters', count > 0);
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
    renderFilterBadge();
  }

  function showView(name, options = {}) {
    state.view = name;
    if (name === 'home') renderHomeLead();
    views.forEach((view) => view.classList.toggle('active', view.id === `view-${name}`));
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.view === name));
    const moreButton = $('nav-more');
    if (moreButton) moreButton.classList.toggle('active', MORE_SHEET_VIEWS.includes(name));
    const active = document.querySelector(`#view-${name}`);
    $('page-title').textContent = active?.dataset.title || 'Religion Knowledge';
    $('main-content').focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!options.silent) {
      openRecordId = null;
      syncHash({ push: true });
    }
  }

  function reviewControls(record) {
    const original = baseRecords.find((r) => r.id === record.id) || record;
    const options = ALLOWED_OVERRIDE_TYPES.map((type) => `<option value="${type}"${record.provenance_type === type ? ' selected' : ''}>${escapeHtml(label(type))}</option>`).join('');
    const originalEvidence = original.attribution_evidence
      ? `${original.attribution_evidence.method || 'evidence'}: ${original.attribution_evidence.value || ''}`
      : 'Not recorded';
    const inQueue = needsReview(record);

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
          ${inQueue ? `<button type="button" id="save-review-next" data-record-id="${escapeHtml(record.id)}">Save &amp; review next</button>` : ''}
          ${getOverride(record.id) ? `<button type="button" id="clear-review-override" data-record-id="${escapeHtml(record.id)}">Restore parser attribution</button>` : ''}
        </div>
        <p class="record-source"><strong>Original parser attribution:</strong> ${escapeHtml(label(original.provenance_type))} · ${escapeHtml(originalEvidence)}</p>
      </section>`;
  }

  function openRecord(id, options = {}) {
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
    const dialog = $('record-dialog');
    if (!dialog.open) dialog.showModal();
    openRecordId = id;
    syncHash({ push: !options.silent && location.hash !== `#/record/${encodeURIComponent(id)}` });
  }

  function applyReviewOverride(recordId) {
    const provenance = $('review-provenance')?.value;
    if (!ALLOWED_OVERRIDE_TYPES.includes(provenance)) return false;
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
    return true;
  }

  function saveReviewOverride(recordId) {
    if (!applyReviewOverride(recordId)) return;
    renderAll();
    openRecord(recordId);
  }

  function saveReviewOverrideAndAdvance(recordId) {
    const queue = filteredRecords(needsReview).map((r) => r.id);
    if (!applyReviewOverride(recordId)) return;
    renderAll();

    const idx = queue.indexOf(recordId);
    const rest = idx >= 0 ? queue.slice(idx + 1) : [];
    const nextId = rest.find((id) => id !== recordId) || queue.find((id) => id !== recordId);

    if (nextId) {
      openRecord(nextId);
    } else {
      $('record-dialog').close();
      showView('review');
    }
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
    if (go) {
      showView(go.dataset.go);
      if (go.closest('#more-sheet')) $('more-sheet').close();
    }

    const more = event.target.closest('[data-show-more]');
    if (more) {
      const targetId = more.dataset.showMore;
      state.listLimits[targetId] = (state.listLimits[targetId] || LIST_PAGE_SIZE) + LIST_PAGE_SIZE;
      renderAll();
      return;
    }

    const record = event.target.closest('[data-record-id]');
    if (record && !event.target.closest('#save-review-override, #save-review-next, #clear-review-override')) openRecord(record.dataset.recordId);

    if (event.target.closest('#save-review-override')) {
      saveReviewOverride(event.target.closest('#save-review-override').dataset.recordId);
    }

    if (event.target.closest('#save-review-next')) {
      saveReviewOverrideAndAdvance(event.target.closest('#save-review-next').dataset.recordId);
    }

    if (event.target.closest('#clear-review-override')) {
      clearReviewOverride(event.target.closest('#clear-review-override').dataset.recordId);
    }

    const ai = event.target.closest('[data-ai]');
    if (ai) {
      state.aiSource = ai.dataset.ai;
      state.listLimits['ai-list'] = LIST_PAGE_SIZE;
      document.querySelectorAll('[data-ai]').forEach((button) => button.classList.toggle('active', button === ai));
      renderAI();
    }

    const topic = event.target.closest('[data-topic]');
    if (topic) {
      state.query = topic.dataset.topic;
      resetListLimits();
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

  $('nav-more')?.addEventListener('click', () => $('more-sheet').showModal());
  $('more-sheet-close')?.addEventListener('click', () => $('more-sheet').close());

  $('topic-search')?.addEventListener('input', (event) => {
    state.topicQuery = event.target.value;
    renderTopics();
  });

  $('topic-sort-toggle')?.addEventListener('click', () => {
    state.topicSort = state.topicSort === 'count' ? 'alpha' : 'count';
    const button = $('topic-sort-toggle');
    button.dataset.sort = state.topicSort;
    button.textContent = state.topicSort === 'count' ? 'Sort: Most records' : 'Sort: A–Z';
    renderTopics();
  });

  $('search-input').addEventListener('input', (event) => {
    state.query = event.target.value;
    state.listLimits['search-results'] = LIST_PAGE_SIZE;
    renderSearch();
    // Typing must not spam browser history: navigate silently and mirror the
    // hash with replace instead of push.
    if (state.query.trim()) {
      showView('search', { silent: true });
      openRecordId = null;
      syncHash();
    } else if (state.view === 'search') {
      showView('home', { silent: true });
      openRecordId = null;
      syncHash();
    }
  });

  $('provenance-filter').addEventListener('change', (event) => {
    state.provenance = event.target.value;
    resetListLimits();
    renderAll();
    showView('search', { silent: true });
    openRecordId = null;
    syncHash();
  });

  $('type-filter').addEventListener('change', (event) => {
    state.type = event.target.value;
    resetListLimits();
    renderAll();
    showView('search', { silent: true });
    openRecordId = null;
    syncHash();
  });

  $('clear-filters').addEventListener('click', () => {
    state.query = '';
    state.provenance = 'ALL';
    state.type = 'ALL';
    resetListLimits();
    $('search-input').value = '';
    $('provenance-filter').value = 'ALL';
    $('type-filter').value = 'ALL';
    renderAll();
    showView('home');
  });

  $('theme-toggle').addEventListener('click', () => {
    const root = document.documentElement;
    const current = root.dataset.theme || 'light';
    root.dataset.theme = current === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('religion-knowledge-theme', root.dataset.theme); } catch {}
  });

  $('dialog-close').addEventListener('click', () => $('record-dialog').close());

  $('record-dialog').addEventListener('close', () => {
    if (routerClosing) return;
    openRecordId = null;
    syncHash();
  });

  window.addEventListener('hashchange', () => {
    if (syncingHash) return;
    route();
  });

  try {
    const saved = localStorage.getItem('religion-knowledge-theme');
    if (saved) document.documentElement.dataset.theme = saved;
  } catch {}

  // Desktop navigation owns its scroll region. Wheel/trackpad input over the
  // rail never falls through and moves the research pane underneath it.
  const desktopNav = document.querySelector('.side-nav');
  desktopNav?.addEventListener('wheel', (event) => {
    if (!matchMedia('(min-width: 1024px)').matches || event.ctrlKey || !event.deltaY) return;
    desktopNav.scrollTop += event.deltaY;
    event.preventDefault();
  }, { passive: false });

  // The standalone single-file build has no sibling index.html to link back
  // to — it is the whole app in one file — so hide the readers link there.
  if (window.RELIGION_KNOWLEDGE_SOURCE_URIS) {
    $('back-to-readers')?.remove();
  }

  renderAll();
  route();
})();