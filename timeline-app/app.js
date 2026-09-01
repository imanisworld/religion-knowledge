(() => {
  const DATA = window.TIMELINE_RESEARCH_DATA || { entities: [], claims: [], meta: {} };
  const claims = (Array.isArray(DATA.claims) ? DATA.claims : []).filter((claim) => ['verified', 'published'].includes(claim.status));
  const entities = Array.isArray(DATA.entities) ? DATA.entities : [];
  const entityMap = new Map(entities.filter((entity) => entity?.id).map((entity) => [entity.id, entity]));

  const ZOOM_WINDOWS = [10_000_000, 1_000_000, 100_000, 10_000, 5_000, 1_000, 100, 10];
  const LAYER_CODES = {
    Population: 'POP', Culture: 'CUL', Polity: 'POL', Tradition: 'REL', Deity: 'DEI',
    GenderSystem: 'GEN', WritingSystem: 'WRT', Text: 'TXT', Narrative: 'NAR',
    KnowledgeState: 'KNW', Person: 'PER', MediaEra: 'MED', Hypothesis: 'HYP',
  };

  const $ = (id) => document.getElementById(id);
  const validDates = claims.map((claim) => claimDate(claim)).filter(Boolean);
  const nowYear = new Date().getFullYear();
  const fullStart = validDates.length ? Math.min(...validDates.map((date) => date.earliest)) : -10_000;
  const fullEnd = validDates.length ? Math.max(...validDates.map((date) => date.latest)) : nowYear;
  const allLanes = [...new Set(claims.flatMap((claim) => Array.isArray(claim.region) ? claim.region : []))].sort((a, b) => a.localeCompare(b));
  const allLayers = [...new Set(claims.map((claim) => claim.subject_type).filter(Boolean))].sort((a, b) => a.localeCompare(b));

  const state = {
    from: fullStart,
    to: fullEnd,
    zoom: nearestZoom(fullEnd - fullStart),
    lanes: new Set(allLanes),
    layers: new Set(allLayers),
    query: '',
    mode: 'timeline',
    selected: null,
  };

  let restoringHistory = false;
  let inspectorOrigin = null;

  function claimDate(claim) {
    const raw = claim?.date;
    if (!raw || !Number.isFinite(raw.earliest)) return null;
    const earliest = raw.earliest;
    const latest = Number.isFinite(raw.latest) ? raw.latest : earliest;
    return { earliest: Math.min(earliest, latest), latest: Math.max(earliest, latest), precision: raw.precision || 'UNKNOWN' };
  }

  function nearestZoom(span) {
    let best = 0;
    let distance = Number.POSITIVE_INFINITY;
    for (let i = 0; i < ZOOM_WINDOWS.length; i += 1) {
      const d = Math.abs(Math.log(Math.max(span, 1)) - Math.log(ZOOM_WINDOWS[i]));
      if (d < distance) { best = i; distance = d; }
    }
    return best;
  }

  function entityLabel(id) {
    const entity = entityMap.get(id);
    if (!entity) return humanize(id || 'Unknown subject');
    if (entity.name) return entity.name;
    if (entity._entity_type === 'GenderSystem' && entity.culture_id) {
      const culture = entityMap.get(entity.culture_id);
      return `${culture?.name || humanize(entity.culture_id)} gender system`;
    }
    return humanize(entity.id);
  }

  function humanize(value) {
    return String(value || '').replace(/^(pop|cul|pol|trad|deity|gs|ws|text|claim)_/, '').replaceAll('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function formatYear(year) {
    if (!Number.isFinite(year)) return 'Unknown date';
    if (year <= -10_000) {
      // Timeline dates are signed astronomical years (schema: negative = BCE).
      // Keep the display faithful to the stored coordinate instead of silently
      // reinterpreting a BCE year as a years-before-present measurement.
      const magnitude = Math.abs(year);
      if (magnitude >= 1_000_000) return `≈${trimNumber(magnitude / 1_000_000)} million BCE`;
      const rounded = Math.round(magnitude / 1000) * 1000;
      return `≈${rounded.toLocaleString()} BCE`;
    }
    if (year < 0) return `${Math.abs(Math.trunc(year)).toLocaleString()} BCE`;
    if (year === 0) return '1 BCE / 1 CE boundary';
    return `${Math.trunc(year).toLocaleString()} CE`;
  }

  function trimNumber(value) {
    return value >= 10 ? value.toFixed(1).replace(/\.0$/, '') : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  }

  function formatRange(date) {
    if (!date) return 'Unknown date';
    if (date.earliest === date.latest) return formatYear(date.earliest);
    return `${formatYear(date.earliest)} – ${formatYear(date.latest)}`;
  }

  function escapeHtml(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function parseSetParam(params, name, allowed, fallback) {
    if (!params.has(name)) return new Set(fallback);
    const values = params.get(name).split(',').map((value) => decodeURIComponent(value)).filter((value) => allowed.includes(value));
    return new Set(values);
  }

  function loadUrlState() {
    const params = new URLSearchParams(location.search);
    const from = Number(params.get('from'));
    const to = Number(params.get('to'));
    if (Number.isFinite(from) && Number.isFinite(to) && from < to) {
      state.from = from;
      state.to = to;
    } else {
      state.from = fullStart;
      state.to = fullEnd;
    }
    const z = Number(params.get('z'));
    state.zoom = Number.isInteger(z) && z >= 0 && z < ZOOM_WINDOWS.length ? z : nearestZoom(state.to - state.from);
    state.lanes = parseSetParam(params, 'lanes', allLanes, allLanes);
    state.layers = parseSetParam(params, 'layers', allLayers, allLayers);
    state.query = params.get('q') || '';
    state.mode = params.get('view') === 'list' ? 'list' : 'timeline';
    state.selected = params.get('selected') || null;
  }

  function syncUrl(mode = 'replace') {
    if (restoringHistory) return;
    const params = new URLSearchParams();
    params.set('from', String(Math.round(state.from)));
    params.set('to', String(Math.round(state.to)));
    params.set('z', String(state.zoom));
    if (state.lanes.size !== allLanes.length) params.set('lanes', [...state.lanes].sort().join(','));
    if (state.layers.size !== allLayers.length) params.set('layers', [...state.layers].sort().join(','));
    if (state.query) params.set('q', state.query);
    if (state.mode === 'list') params.set('view', 'list');
    if (state.selected) params.set('selected', state.selected);
    const next = `${location.pathname}?${params.toString()}`;
    history[mode === 'push' ? 'pushState' : 'replaceState'](null, '', next);
  }

  function clampRange(from, to) {
    const fullSpan = Math.max(fullEnd - fullStart, 1);
    let span = Math.max(to - from, 1);
    if (span >= fullSpan) return [fullStart, fullEnd];
    if (from < fullStart) { to += fullStart - from; from = fullStart; }
    if (to > fullEnd) { from -= to - fullEnd; to = fullEnd; }
    return [Math.max(from, fullStart), Math.min(to, fullEnd)];
  }

  function setRange(from, to, { push = true, announce = true } = {}) {
    [state.from, state.to] = clampRange(from, to);
    state.zoom = nearestZoom(state.to - state.from);
    render();
    syncUrl(push ? 'push' : 'replace');
    if (announce) say(`Showing ${formatYear(state.from)} through ${formatYear(state.to)}.`);
  }

  function pan(direction, large = false) {
    const span = state.to - state.from;
    const shift = span * (large ? .75 : .25) * direction;
    setRange(state.from + shift, state.to + shift);
  }

  function zoom(direction) {
    let targetIndex = state.zoom + direction;
    targetIndex = Math.max(0, Math.min(ZOOM_WINDOWS.length - 1, targetIndex));
    let targetSpan = Math.min(ZOOM_WINDOWS[targetIndex], Math.max(fullEnd - fullStart, 1));
    if (targetIndex === state.zoom) targetSpan = state.to - state.from;
    const selected = state.selected ? claims.find((claim) => claim.id === state.selected) : null;
    const selectedDate = claimDate(selected);
    const center = selectedDate ? (selectedDate.earliest + selectedDate.latest) / 2 : (state.from + state.to) / 2;
    state.zoom = targetIndex;
    setRange(center - targetSpan / 2, center + targetSpan / 2);
  }

  function jumpTo(year) {
    const span = state.to - state.from;
    setRange(year - span / 2, year + span / 2);
  }

  function matchesQuery(claim) {
    const q = state.query.trim().toLowerCase();
    if (!q) return true;
    const entity = entityMap.get(claim.subject_id);
    const haystack = [
      claim.statement, claim.subject_type, claim.subject_id, entityLabel(claim.subject_id),
      ...(claim.region || []), ...(claim.evidence_types || []), claim.claim_tier,
      entity?.name, entity?.notes,
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(q);
  }

  function overlaps(date) {
    return date && date.latest >= state.from && date.earliest <= state.to;
  }

  function claimLane(claim) {
    return (claim.region || []).find((lane) => state.lanes.has(lane)) || null;
  }

  function zoomLevel(value) {
    const match = /^Z([0-7])$/.exec(String(value || ''));
    return match ? Number(match[1]) : null;
  }

  function visibleAtZoom(claim) {
    const min = zoomLevel(claim.zoom_min);
    const max = zoomLevel(claim.zoom_max);
    if (min === null || max === null) return true;
    return state.zoom >= Math.min(min, max) && state.zoom <= Math.max(min, max);
  }

  function laneWindowClaims(lane) {
    return claims.filter((claim) => claimLane(claim) === lane && visibleAtZoom(claim) && overlaps(claimDate(claim)));
  }

  function visibleClaims() {
    return claims.filter((claim) => {
      if (!visibleAtZoom(claim)) return false;
      if (!state.layers.has(claim.subject_type)) return false;
      if (!claimLane(claim)) return false;
      if (!overlaps(claimDate(claim))) return false;
      return matchesQuery(claim);
    });
  }

  function relativePosition(year) {
    const span = Math.max(state.to - state.from, 1);
    return Math.max(0, Math.min(1, (year - state.from) / span));
  }

  function allocateRows(items) {
    const rows = [];
    return items.map((claim) => {
      const date = claimDate(claim);
      const start = relativePosition(date.earliest);
      const end = Math.max(start + .025, relativePosition(date.latest));
      let row = rows.findIndex((rowEnd) => rowEnd + .012 < start);
      if (row < 0) { row = rows.length; rows.push(end); }
      else rows[row] = end;
      return { claim, start, end: Math.min(end, 1), row };
    });
  }

  function renderTruthStrip() {
    const span = Math.max(fullEnd - fullStart, 1);
    const left = Math.max(0, Math.min(1, (state.from - fullStart) / span));
    const right = Math.max(left, Math.min(1, (state.to - fullStart) / span));
    $('truth-window').style.left = `${left * 100}%`;
    $('truth-window').style.width = `${Math.max((right - left) * 100, .35)}%`;
    $('truth-start').textContent = formatYear(fullStart);
    $('truth-end').textContent = formatYear(fullEnd);
    $('range-label').textContent = `${formatYear(state.from)} → ${formatYear(state.to)}`;
    $('truth-strip').setAttribute('aria-label', `Full researched span ${formatYear(fullStart)} through ${formatYear(fullEnd)}. Current viewport ${formatYear(state.from)} through ${formatYear(state.to)}.`);
  }

  function renderTimeline(items) {
    const root = $('timeline');
    const lanes = [...state.lanes].sort((a, b) => a.localeCompare(b));
    if (!lanes.length) {
      root.innerHTML = '<div class="timeline-empty"><strong>No lanes selected.</strong><br>Choose at least one lane to render the timeline.</div>';
      return;
    }

    const byLane = new Map(lanes.map((lane) => [lane, []]));
    for (const claim of items) {
      const lane = claimLane(claim);
      if (lane && byLane.has(lane)) byLane.get(lane).push(claim);
    }

    root.innerHTML = lanes.map((lane) => {
      const laneItems = byLane.get(lane).sort((a, b) => claimDate(a).earliest - claimDate(b).earliest);
      const positioned = allocateRows(laneItems);
      const rows = positioned.length ? Math.max(...positioned.map((item) => item.row)) + 1 : 1;
      const trackHeight = Math.max(74, rows * 36 + 12);
      const marks = positioned.map(({ claim, start, end, row }) => {
        const date = claimDate(claim);
        const label = entityLabel(claim.subject_id);
        const width = Math.max((end - start) * 100, .7);
        const top = 6 + row * 36;
        return `<button class="claim-mark" type="button" data-claim-id="${escapeHtml(claim.id)}" data-confidence="${escapeHtml(claim.confidence || 'UNKNOWN')}" data-layer="${escapeHtml(claim.subject_type || 'Unknown')}" style="left:${start * 100}%;width:${width}%;top:${top}px" aria-label="${escapeHtml(`${label}. ${formatRange(date)}. ${claim.confidence || 'Unknown'} confidence.`)}"><span class="layer-code" aria-hidden="true">${escapeHtml(LAYER_CODES[claim.subject_type] || '•')}</span><span class="mark-label">${escapeHtml(label)}</span></button>`;
      }).join('');
      const baseItems = laneWindowClaims(lane);
      const filteredOut = !laneItems.length && baseItems.length > 0;
      const absence = laneItems.length ? '' : filteredOut
        ? '<div class="lane-absence filtered">Items in this lane and time window are hidden by the current search or layer filters. <button class="inline-reset" type="button" data-clear-display-filters>Show hidden items</button></div>'
        : '<div class="lane-absence">Not represented in the current dataset at this zoom and time window. Coverage status is unknown; no historical absence is inferred.</div>';
      return `<section class="lane" aria-label="${escapeHtml(lane)} lane"><div class="lane-label">${escapeHtml(lane)}<small>${laneItems.length} visible</small></div><div class="lane-track" style="min-height:${trackHeight}px">${marks}${absence}</div></section>`;
    }).join('');
  }

  function renderList(items) {
    const root = $('list-content');
    const lanes = [...state.lanes].sort((a, b) => a.localeCompare(b));
    const byLane = new Map(lanes.map((lane) => [lane, []]));
    for (const claim of items) {
      const lane = claimLane(claim);
      if (lane && byLane.has(lane)) byLane.get(lane).push(claim);
    }
    root.innerHTML = lanes.map((lane) => {
      const laneItems = byLane.get(lane).sort((a, b) => claimDate(a).earliest - claimDate(b).earliest);
      const baseItems = laneWindowClaims(lane);
      const content = laneItems.length
        ? `<div class="list-claims">${laneItems.map((claim) => `<button class="list-claim" type="button" data-claim-id="${escapeHtml(claim.id)}"><strong>${escapeHtml(entityLabel(claim.subject_id))}</strong><span>${escapeHtml(claim.statement)}</span><small>${escapeHtml(formatRange(claimDate(claim)))} · ${escapeHtml(claim.confidence || 'UNKNOWN')} · ${escapeHtml(claim.subject_type || 'Unknown')}</small></button>`).join('')}</div>`
        : baseItems.length
          ? '<p class="muted">Items are hidden by the current search or layer filters. <button class="inline-reset" type="button" data-clear-display-filters>Show hidden items</button></p>'
          : '<p class="muted">Not represented in the current dataset at this zoom and time window. Coverage status is unknown; no historical absence is inferred.</p>';
      return `<section class="list-lane"><h3>${escapeHtml(lane)}</h3>${content}</section>`;
    }).join('');
  }

  function renderPickers() {
    $('lane-options').innerHTML = allLanes.map((lane) => `<label class="check-option"><input type="checkbox" value="${escapeHtml(lane)}" data-lane ${state.lanes.has(lane) ? 'checked' : ''}><span>${escapeHtml(lane)}</span></label>`).join('');
    $('layer-options').innerHTML = allLayers.map((layer) => `<label class="check-option"><input type="checkbox" value="${escapeHtml(layer)}" data-layer ${state.layers.has(layer) ? 'checked' : ''}><span><strong>${escapeHtml(layer)}</strong><br><small class="muted">${escapeHtml(LAYER_CODES[layer] || 'Layer')}</small></span></label>`).join('');
    $('lane-count').textContent = state.lanes.size;
    $('layer-count').textContent = state.layers.size;
  }

  function render() {
    renderTruthStrip();
    renderPickers();
    const items = visibleClaims();
    $('visible-summary').textContent = `${items.length} visible claim${items.length === 1 ? '' : 's'} · ${state.lanes.size} lane${state.lanes.size === 1 ? '' : 's'} · Z${state.zoom}`;
    $('list-summary').textContent = `${formatYear(state.from)} through ${formatYear(state.to)} · ${items.length} claims`;
    $('timeline').setAttribute('aria-label', `Timeline from ${formatYear(state.from)} through ${formatYear(state.to)}, ${items.length} visible claims across ${state.lanes.size} active lanes.`);
    renderTimeline(items);
    renderList(items);
    $('search-input').value = state.query;
    const listMode = state.mode === 'list';
    $('timeline-view').hidden = listMode;
    $('list-view').hidden = !listMode;
    $('view-toggle').textContent = listMode ? 'Timeline view' : 'List view';
    $('view-toggle').setAttribute('aria-pressed', String(listMode));
  }

  function sourceHtml(source) {
    const meta = [source.type, source.author, source.year, source.venue].filter(Boolean).join(' · ');
    const verification = [source.verification_method, source.verified_by, source.verified_date].filter(Boolean).join(' · ');
    return `<div class="source-card"><cite>${escapeHtml(source.citation || 'Source')}</cite>${meta ? `<div class="source-meta">${escapeHtml(meta)}</div>` : ''}${verification ? `<div class="source-meta">Verification: ${escapeHtml(verification)}</div>` : ''}${source.access_note ? `<p class="muted">${escapeHtml(source.access_note)}</p>` : ''}</div>`;
  }

  function openInspector(id, { push = true, origin = document.activeElement } = {}) {
    const claim = claims.find((item) => item.id === id);
    if (!claim) return;
    inspectorOrigin = origin instanceof HTMLElement ? origin : null;
    state.selected = id;
    const date = claimDate(claim);
    $('inspector-type').textContent = `${claim.subject_type || 'Claim'} · ${claim.status || 'unknown status'}`;
    $('inspector-title').textContent = entityLabel(claim.subject_id);
    const interpretations = Array.isArray(claim.interpretations) ? claim.interpretations : [];
    const limits = Array.isArray(claim.does_not_demonstrate) ? claim.does_not_demonstrate : [];
    const sources = Array.isArray(claim.sources) ? claim.sources : [];
    $('inspector-body').innerHTML = `
      <div class="detail-grid">
        <div class="detail-card"><span>Date</span><strong>${escapeHtml(formatRange(date))}</strong><small>${escapeHtml(date?.precision || 'Unknown precision')}</small></div>
        <div class="detail-card"><span>Confidence</span><strong>${escapeHtml(claim.confidence || 'UNKNOWN')}</strong></div>
        <div class="detail-card"><span>Claim tier</span><strong>${escapeHtml(humanize(claim.claim_tier || 'Unknown'))}</strong></div>
        <div class="detail-card"><span>Date semantics</span><strong>${escapeHtml(humanize(claim.date_semantics || 'Unknown'))}</strong></div>
      </div>
      <section class="detail-section"><h3>What the claim says</h3><p>${escapeHtml(claim.statement || '')}</p><span class="status-chip">${escapeHtml(claim.status || 'unknown')}</span><span class="status-chip">${escapeHtml((claim.region || []).join(' · ') || 'Region unknown')}</span>${(claim.evidence_types || []).map((type) => `<span class="status-chip">${escapeHtml(humanize(type))}</span>`).join('')}</section>
      ${claim.scholarly_disagreement ? `<section class="detail-section"><h3>Scholarly disagreement</h3><p>${escapeHtml(String(claim.scholarly_disagreement))}</p></section>` : ''}
      ${interpretations.length ? `<section class="detail-section"><h3>Interpretations</h3>${interpretations.map((item) => `<div class="source-card"><strong>${escapeHtml(item.position || 'Interpretation')}</strong>${item.strongest_case ? `<p>${escapeHtml(item.strongest_case)}</p>` : ''}${item.status ? `<div class="source-meta">${escapeHtml(item.status)}</div>` : ''}</div>`).join('')}</section>` : ''}
      ${limits.length ? `<section class="detail-section"><h3>What this does not demonstrate</h3><ul>${limits.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>` : ''}
      ${claim.adversarial_counter ? `<section class="detail-section"><h3>Strongest counter / complication</h3><p>${escapeHtml(typeof claim.adversarial_counter === 'string' ? claim.adversarial_counter : JSON.stringify(claim.adversarial_counter))}</p></section>` : ''}
      ${claim.notes ? `<section class="detail-section"><h3>Notes</h3><p>${escapeHtml(claim.notes)}</p></section>` : ''}
      <section class="detail-section"><h3>Sources & verification</h3>${sources.length ? sources.map(sourceHtml).join('') : '<p class="muted">No source objects attached to this claim.</p>'}</section>`;
    if (!$('inspector').open) $('inspector').showModal();
    syncUrl(push ? 'push' : 'replace');
  }

  function closeInspector({ fromHistory = false } = {}) {
    const dialog = $('inspector');
    if (dialog.open) dialog.close();
    state.selected = null;
    if (!fromHistory) syncUrl('replace');
    const origin = inspectorOrigin;
    inspectorOrigin = null;
    if (origin?.isConnected) origin.focus();
  }

  function setAll(kind, selected) {
    const target = kind === 'lane' ? state.lanes : state.layers;
    const all = kind === 'lane' ? allLanes : allLayers;
    target.clear();
    if (selected) all.forEach((value) => target.add(value));
    render();
    syncUrl('replace');
  }

  function say(message) { $('live-status').textContent = message; }

  function effectiveTheme() {
    const explicit = document.documentElement.dataset.theme;
    if (explicit === 'dark' || explicit === 'light') return explicit;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function syncThemeControl() {
    const dark = effectiveTheme() === 'dark';
    const next = dark ? 'light' : 'dark';
    $('theme-toggle').setAttribute('aria-label', `Switch to ${next} mode`);
    $('theme-toggle').setAttribute('title', `Switch to ${next} mode`);
    $('theme-toggle').setAttribute('aria-pressed', String(dark));
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#10130F' : '#17201D');
  }

  $('theme-toggle').addEventListener('click', () => {
    const next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('religion-knowledge-theme', next); } catch {}
    syncThemeControl();
  });

  $('earlier').addEventListener('click', () => pan(-1));
  $('later').addEventListener('click', () => pan(1));
  $('zoom-out').addEventListener('click', () => zoom(-1));
  $('zoom-in').addEventListener('click', () => zoom(1));
  $('reset-view').addEventListener('click', () => {
    state.from = fullStart; state.to = fullEnd; state.zoom = nearestZoom(fullEnd - fullStart);
    state.lanes = new Set(allLanes); state.layers = new Set(allLayers); state.query = ''; state.mode = 'timeline'; state.selected = null;
    render(); syncUrl('push'); say('Timeline reset to the full researched span.');
  });
  $('view-toggle').addEventListener('click', () => { state.mode = state.mode === 'list' ? 'timeline' : 'list'; render(); syncUrl('push'); });
  $('search-input').addEventListener('input', (event) => { state.query = event.target.value; render(); syncUrl('replace'); });
  $('lanes-open').addEventListener('click', () => $('lane-dialog').showModal());
  $('layers-open').addEventListener('click', () => $('layer-dialog').showModal());
  $('jump-open').addEventListener('click', () => { $('jump-year').value = String(Math.round((state.from + state.to) / 2)); $('jump-dialog').showModal(); setTimeout(() => $('jump-year').focus(), 0); });
  $('jump-form').addEventListener('submit', (event) => { const year = Number($('jump-year').value); if (!Number.isFinite(year)) { event.preventDefault(); return; } jumpTo(year); });
  $('share-view').addEventListener('click', async () => {
    syncUrl('replace');
    try { await navigator.clipboard.writeText(location.href); say('Current timeline view copied to the clipboard.'); }
    catch { say('Copy was blocked. The current URL contains the timeline state and can be copied from the address bar.'); }
  });
  $('lanes-all').addEventListener('click', () => setAll('lane', true));
  $('lanes-none').addEventListener('click', () => setAll('lane', false));
  $('layers-all').addEventListener('click', () => setAll('layer', true));
  $('layers-none').addEventListener('click', () => setAll('layer', false));

  $('lane-options').addEventListener('change', (event) => {
    const input = event.target.closest('[data-lane]'); if (!input) return;
    if (input.checked) state.lanes.add(input.value); else state.lanes.delete(input.value);
    render(); syncUrl('replace');
  });
  $('layer-options').addEventListener('change', (event) => {
    const input = event.target.closest('[data-layer]'); if (!input) return;
    if (input.checked) state.layers.add(input.value); else state.layers.delete(input.value);
    render(); syncUrl('replace');
  });

  document.addEventListener('click', (event) => {
    const clear = event.target.closest('[data-clear-display-filters]');
    if (clear) {
      state.query = '';
      state.layers = new Set(allLayers);
      render();
      syncUrl('replace');
      say('Search and layer filters cleared.');
      return;
    }
    const trigger = event.target.closest('[data-claim-id]');
    if (trigger) openInspector(trigger.dataset.claimId, { origin: trigger });
  });
  $('inspector-close').addEventListener('click', () => closeInspector());
  $('inspector').addEventListener('cancel', (event) => { event.preventDefault(); closeInspector(); });

  $('timeline').addEventListener('keydown', (event) => {
    if (event.target !== $('timeline')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); pan(event.key === 'ArrowLeft' ? -1 : 1, event.shiftKey); return;
    }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); zoom(1); return; }
    if (event.key === '-') { event.preventDefault(); zoom(-1); }
  });

  window.addEventListener('popstate', () => {
    restoringHistory = true;
    loadUrlState();
    render();
    const selected = state.selected;
    if (selected) openInspector(selected, { push: false, origin: null });
    else if ($('inspector').open) closeInspector({ fromHistory: true });
    restoringHistory = false;
  });

  loadUrlState();
  render();
  syncThemeControl();
  if (state.selected) openInspector(state.selected, { push: false, origin: null });
  else syncUrl('replace');

  if (!claims.length) {
    $('timeline').innerHTML = '<div class="timeline-empty"><strong>No verified or published claims are bundled.</strong><br>Run <code>node timeline-app/build-data.mjs</code> after timeline data exists.</div>';
  }
})();
